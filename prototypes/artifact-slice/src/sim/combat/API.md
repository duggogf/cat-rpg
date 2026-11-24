<!-- PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see ../../../README.md) -->
# Combat simulation API (M1.1)

Pure, deterministic, headless combat for `design/gdd/combat-system.md`, as amended by the owner's **M1.1 direction** (`design/reviews/owner-feedback/combat-m1.1-spec.md`, binding where it differs). There is no rendering, no DOM, no `Math.random` and no wall clock. The presentation **reads** a snapshot and an event stream, and **writes** one input frame per tick.

```js
import { createEncounter, sampleShake } from '../sim/combat/index.js';

const enc = createEncounter('sandbox', { seed: 42, showcase: true });
const events = enc.step(inputFrame);   // once per 1/60 s of real time; ordered, already arbiter-filtered
const s = enc.snapshot();              // read-only plain object for rendering
enc.hash();                            // 16 hex chars over the canonical sim state
```

## What changed in M1.1 (for the presentation agent)

| Area | M1 | **M1.1** |
|---|---|---|
| Control | Switch cats (Z X C V), Tag-In, Relay | **Mikan only.** `switchTo` is ignored; no `TagIn`, `Switch`, `RelayEnded` events; `tag_window` and `relay` are gone from the snapshot. Crew are AI only |
| Attacks | `attack` (one 3-hit string) | `light` (LMB), `heavy` (RMB **held** boolean), `dash` (Shift), `dodge` (Space). Mikan's five strings live in `strings.json`. Events `AttackStart`, `AttackActive`, `InputBuffered`, `InputDropped`; `entity.attack` and `entity.can_move` |
| Lock-on | Soft lock always on | **Off by default.** `lockOn` (Tab) cycles: nearest → (same nearest) unlock, or (new nearest) re-lock. `snapshot.lock` is `null` when free |
| Tactical menu | `slowBlink` (Tab), Slow Blink events | **Skill bar** `skillBar` (**R**), time ×0.05; events `SkillBarOpen`/`SkillBarClose`; `snapshot.skill_bar`. Commands may also force any crew Move; a command to a Cowed recruit clears it |
| Pile-On | Offer, `hiss` triggers Quick/Full | **Removed.** Replaced by the **Special** (**F**) on a staggered enemy: `SpecialChainStart` → `SpecialCutIn` ×n → `TeamFinisher` (all four) → `SpecialChainEnd`. Sim time stops for the chain |
| Frazzle | `Frazzled`, `FrazzleEnded`, `frazzle`, `frazzled_s` | Renamed **stagger**: `Staggered {treatment, slow}`, `StaggerEnded`; `stagger`, `staggered_s`; a brief sim slow-motion on each stagger (`snapshot.stagger_slow`) |
| AI | Spacing only | Every non-player entity has an **`intent`**: `stalk`, `circle`, `posture`, `flank`, `strut`, `hold`, `dash_in`, `attack`, `feint`, `retreat`, `sidestep` (Daifuku: `pace`, `ground`), plus `engaging` (target id or null) |
| Pacing | 4.5 m/s, crew string 1.8 s | 3.3 m/s (−27%), crew string 2.2 s, longer enemy recovery; a light's first active frame ≤ 3 ticks after the press |
| Hiss, Brace, Hop | Keys F, RMB, Space | **No keys in M1.1.** The verbs remain (`hiss`, `brace`, `hop` inputs; skill-bar `{action:'hiss'}`). Dashing into a High Road edge mantles; dashing on one hops down |

## Coordinates and time

- **Metres, y up, ground plane x/z**, arena-local. World position = `snapshot().arena.origin + pos` (M0 lane frame). Cats are scale 1.25 (radius 0.35 m; Daifuku 0.6 m). `pos[1]` is height (wall top 1.5 m).
- **Facings are unit vectors** `[fx, fz]` (yaw = `atan2(fx, fz)`).
- One `step()` = 1/60 s of **real** time. `time_scale`: 1; 0.05 with the skill bar open; 0.25 or 0.5 for 0.45 or 0.2 s after a stagger; 0 in global hit-stop and during a Special chain. `t` is real seconds, `sim_t` scaled, `fight_t` the fight only.
- **Ring bounds** (`snapshot().arena.bounds`, `enc.ringBounds()`): `{center, radius, scram_radius, half_planes:[{point, normal, wall}], origin}`. Playable when inside the circle and `(p − point)·normal ≥ 0` for every wall. Keep walls and dressing outside it.

## `createEncounter(def, opts)`

| Arg | Meaning |
|---|---|
| `def` | An `encounters.json` Name (`tough_focus`, `toughs_2`, `toughs_3`, `sandbox`, `two_strays`, `captain`, `challenger`, `challenger_no_guest`, `daifuku_bout`, `lose_to_daifuku`) or an inline row of the same shape |
| `opts.seed` | uint32; every AI draws from its own substream `ai:<id>` |
| `opts.showcase` | Applies `showcase_overrides.json`: Daifuku phase cap 1 and Furious; `ai_fill` 1.0; the Captain-rank challenger with the Water Fear; Special meters starting at Mikan 20 and crew 80 (as if carried from earlier fights that day) |
| `opts.special` | `{ mikan: 0..100, hige: … }`: meters carried in from earlier fights (Combat F8: the gauge persists within a day). Beats the showcase start |
| `opts.difficulty`, `opts.anger`, `opts.reduceFlashes`, `opts.motionScale`, `opts.data` | As in M1 (Feral's engage cap is 2, per M1.1 §4) |

## InputFrame (all optional; booleans are *pressed this tick* unless marked held)

| Field | Key (M1.1 §1) | Effect |
|---|---|---|
| `move: [x, z]` | WASD | World-space ground vector, length ≤ 1. Steers the start of light attacks and the tail of recovery (see `can_move`) |
| `light` (alias `attack`) | LMB | L1, or the next hit in the string. A press during an attack is **buffered only within `input_buffer_s` (0.15 s) before the chain point**; earlier presses are dropped (`InputDropped`) |
| `heavy` (**held**) | RMB | Contextual heavy on press: after L3 → **FIN** (L-L-L-H finisher), after L1 → **LAUNCH**, after L2 → H. From neutral: hold ≥ 0.25 s → **HC** charged heavy on release (full at 1.0 s), shorter → **H** |
| `dash` | Shift | 2.6 m dash; `light` during it or ≤ 0.25 s after → **DL** lunge. Into a High Road edge: mantle; on a High Road: hop down |
| `dodge` (alias `skitter`) | Space | 2.5 m dodge, i-frames 0.2 s; **cancels recovery any time after the hit** (the heavy finisher commits for 0.3 s first) |
| `lockOn` | Tab | Lock-on cycle (see above). `lockId: id|null` sets it directly (bots, tests) |
| `skillBar` (alias `slowBlink`) | **R** | Toggle the skill bar |
| `command` | skill bar | `{cat, move|slot, target}` queues a Move for Mikan or any crew cat (forced, whatever its `ai_use`; Paws reserved). A Pay-off commanded after another cat's Set-up on the same target in one opening waits for it (`CommandQueued.after`). `{action:'hiss'}` makes Mikan Hiss when the bar closes; `{action:'scram'}` flees |
| `special` | **F** | Mikan's Special on the staggered enemy in `special_prompt` (needs `ready`) |
| `aim`, `hiss`, `brace`, `hop` | unbound | Optional verbs kept from M1 |

## `snapshot()`

Top level: `tick, t, sim_t, fight_t, time_scale, mode ('standoff'|'fight'|'special'|'gloat'|'ended'), skill_bar, controlled ('mikan'), lock (id|null), locked, arena{id, origin, ring_center, ring_radius, high_roads[], bounds}, props[], entities[], telegraphs[], special_prompt {target, ready}|null, special_chain {target, t, total_s, team_finisher, shortened, steps[{cat, start_s, dur_s, done}]}|null, chains_this_fight, next_chain_shortened, stagger_slow {scale, left_s}|null, fed_up, outcome`.

`entities[]` (new or renamed fields in **bold**):
- **Identity and position**: `id, cat, name, side, slot, rank, style, personality, pos, facing, present, routed, anim, anim_t`.
- **Intent and movement**: **`intent`**, **`engaging`**, **`can_move`** (0–1: 0 through startup, hit and the first 60% of recovery, then a ramp to 1; the finisher holds 0 for its commit), **`attack {id: 'L1'|'L2'|'L3'|'FIN'|'LAUNCH'|'H'|'HC'|'DL'|'charging', t, charge}`**, `string_idx` (crew Style basic), `controlled, invulnerable, bracing, on_high_road`.
- **Gauges**: `nerve, nerve_max, paws, paw_points, paws_reserved, orders[]`, **`stagger`** (enemies 0–100), **`staggered_s`**, `pips`, **`special`** (Posse 0–100), **`special_ready`**.
- **States and statuses**: `ruffled_s, splat_s, clumped_s, status, anger_fired_up, hiss_cd_s, moves[], target, boss{…}, guest{…}`.

`anim` adds `atk`, `charge`, `dash`, `launched`, `sidestep` to the M1 list; `windup_<class>` and the rest are unchanged.

## Events (beyond `type, t, sim_t, tick`; * carries `feel`)

New or changed in M1.1:

| Event | Payload |
|---|---|
| `AttackStart` / `AttackActive` | `cat, attack, charge, target` / `cat, attack, latency_ticks` (the first active frame; the hit resolves on it) |
| `InputBuffered` / `InputDropped` | `cat, input ('light'|'heavy'), attack` |
| `Dash` | `cat` |
| `LockTarget` | `target (id|null), locked, reason?` |
| `SkillBarOpen` / `SkillBarClose` | `reason?` |
| `Staggered` / `StaggerEnded` | `cat, by, window_s, treatment ('full' for Captains, Bosses and the fight's first stagger; else 'light'), slow {scale, ms}` / `cat, reason ('window'|'team_finisher')` |
| `SpecialReady` / `SpecialRejected` | `cat` / `reason ('no_staggered_target'|'meter'), target?` |
| `SpecialChainStart` | `target, cats[] (Mikan first, then each ready crew cat within 8 m, by slot), team_finisher, shortened, cutin_s, team_s, total_s (≤ 6), stagger_left_s` |
| `SpecialCutIn` * | `cat, special ('Midnight Laps'|'Landslide'|'Midnight Aria'), style, index, of, duration_s, target`: T5; the sim is frozen for `duration_s` |
| `SpecialUsed` | `cat, special, targets_hit[]` (its `Hit` events have `kind: 'special'`) |
| `TeamFinisher` * | `target, cats[], duration_s, t_rem, value_mv` (Combat F5 at the stagger time left; below Captain it Routs the target and staggered trash within 3 m): the old Pile-On's KA-BLAM |
| `SpecialChainEnd` | `target, team_finisher, routed[]` |
| `StatusEnded` | adds `reason: 'command'` when a skill-bar command steadies a Cowed recruit (and `Bark {kind:'steeled'}`) |
| `Hit` * | adds `attack` (Mikan's string id) and kinds `heavy`, `special` |

Unchanged from M1: `EncounterStarted`, `StandoffStart/End`, `FightStarted`, `Whiff`, `Ruffled*`, `Splat`, `KnockOff`, `BossLanded`, `ClimbBack`, `Status*`, `Telegraph*`, `Hiss*`, `BackDown`, `MoveUsed`, `Command*`, `PawFilled`, `PropTriggered` (with its splash cone), `FearTriggered`, `CatRouted`, `AllyJoined`/`AllyYowl`/`GuestEntered`/`GuestLeft`, `PhaseBreak`/`PhaseStarted`/`BossFlee`, `FedUp`, `Skitter`, `Mantle`, `HopDown`, `Healed`, `Bark`, `Gloat`, `EncounterEnded` (the day loop consumes `outcome = loss`).

**Removed**: `Switch`, `TagIn`, `RelayEnded`, `PileOnOffered/Withdrawn/Start/Beat/End`, `SlowBlinkOpen/Close`, `Frazzled`, `FrazzleEnded`.

`feel` and the arbiter's caps are unchanged. Cut-ins and the Team finisher are authored T5 (hit-stop exempt, never stop the sim twice). Their full-screen frames still obey ≤ 1 per second, so a shortened chain's 0.5 s cut-ins get `impact: 'local_disc'` after the first. `sampleShake()` is unchanged.

## Data (`src/data/combat/*.json`, rows keyed by `Name`, each with `_src`)

New in M1.1:
- `strings.json`: Mikan's five strings with frame data, buffer and chain points.
- `specials.json`: one Special per Style, the Zoomies folded in.
- `combat_constants`: `input_buffer_s`, `combo_grace_s`, `move_out_from`, `dash`, `stagger_slow`, `special`, `special_gain`, `special_start`, `engage`; slower `move_speed_mps`, `string_cycle_s` and recovery.
- `personalities.ai_style`: band, aggression, engage cooldown, combo, feint/posture/flank/sidestep chances, Braggart `front`, Stalwart `hold_near_controlled_m`.

Removed: the Tag-In and Relay constants and the Quick/Full Pile-On durations.

## Assumptions (flag to the combat designer)

1. **Ring ≈ 10 m read as a diameter** (radius 5 m), with walls at the ring's edge and each wall a half-plane clamp. The M0 lane's walls are not sim colliders.
2. **Enemy white attack** = one telegraphed swing of MV 1.5 (F10).
3. **Daifuku phase 1**:
   - He swings every 4 s: a yellow Paw Swat at a cat on his wall, otherwise a red Belly Drop onto a ground cat; on the ground he swings white, then Climbs Back after 6 s.
   - **Knock-off sources**: `shove`, `shoulder_check`, `body_slam`, `banshee_screech`, `landslide` and, new in M1.1, **`heavy_finisher`** (Mikan's L-L-L-H, 1.5 m knockback), so a player who controls only Mikan can knock him off. He falls to the yard side, into the wash tub if close (one use per phase).
4. **Fear proposals adopted**: Daifuku Fear Water and immune to Cowed.
5. **Timers**: local hit-stop freezes only the action. Status, stagger and anger timers stop in global hit-stop, slow in the skill bar and stagger slow-motion, and stop through a Special chain.
6. **Posse hit reactions**: a hit flinches a Posse cat for 0.3 s and interrupts its attack (Mikan's string included). An enemy Splat knocks a Posse cat flat for 1.0 s.
7. **Styles not in the GDDs**: Goma Bruiser, Sasa Yowler, Strays Scrapper Lv 7, the challenger a Scrapper with Face Swat + Bunny-Kick, Togemaru Lv 7, Kinako Lv 7.
8. **Bucket splash** is the §3.9 3 m cone, 90° (angle assumed), pointing away from the hitter.
9. **AI Moves by personality** (round 2; still a deviation from §3.10 and §3.11, designer sign-off pending): Stalwart self-casts Shoulder Check, Goofball Withering Hiss (with a Purr Pay-off), Braggart and Schemer Face Swat. An AI cat may spend its last Paw when the Posse banks one (B-17).
10. **The challenger is a Captain with the Water Fear in the showcase only.** Creative-director sign-off is pending.
11. **M1.1: crew keep their Style basic as their AI "dash-in combo"** (Fraidy one hit). The spec's "crew have no strings" is read as "crew do not get Mikan's five player strings", because §4 has crew "dash in for a combo".
12. **M1.1: Hiss, Brace and Hop have no key** in the new map (RMB, Space and F are taken). The verbs stay in the sim; the skill bar offers Hiss; dashing into a ledge mantles.
13. **M1.1: Mikan Routed** leaves the crew fighting under AI (control never passes); the fight is lost only when all four are Routed.
14. **M1.1: Special meter** uses Combat F8 (+1 per 1% Nerve lost, ≤ 40; +10 per enemy stagger) plus per-hit gains (Mikan light 1.5, heavy 3, Move 4; crew hit 1). Meters start at 0 in canon (carried in via `opts.special`); the showcase starts them at Mikan 20 and crew 80. Zoomies unlock gates (Mikan L2D3, crew Lv 6) are not applied.
15. **M1.1: the Special chain**:
    - It takes Mikan first, then each crew cat within 8 m of the target with a full meter, in slot order. **All four** (the Posse must have four) → the Team finisher.
    - Cut-ins last 1.0 s, and 0.5 s after the first chain of the fight; the Team finisher 1.6 / 1.0 s; the total stays ≤ 6 s.
    - Specials use the §3.7 Zoomies effects: Scrapper Midnight Laps 4 × MV 1.2 on every enemy; Bruiser Landslide MV 12 / FZ 80 on the target; Yowler Midnight Aria MV 3 to all, Cowed, heal 15%.
16. **M1.1: engagement**:
    - At most 2 enemies engage the controlled cat at once (`dash_in`, `attack` or `feint`), 1 on each AI cat, and 2 crew on one enemy.
    - The others circle, stalk, posture, flank or strut at their personality's band, and decide every 0.4 s whether to engage.
    - Enemies side-step Mikan's swing at 15% when not engaged.
17. **M1.1: stagger slow-motion**: ×0.25 for 0.45 s on the full treatment, ×0.5 for 0.2 s on the light one, inside the ≤ 0.5 s budget. The zoom and shattered-glass blink are presentation.
18. Rival flight, the `ambush_by_rival` and `raid_defence` openers, Daifuku phases 2–3 content, and guest wave cues are unbuilt, as in M1.

## Fight lengths (tools/sim-run.mjs, 30 seeds, Alley, showcase on; round 2 → M1.1)

| Fight | Median bot | Skilled bot | Note |
|---|---|---|---|
| Tough alone | 7.4 → 11.6 s | 7.4 → 10.7 s | F9 5.6–5.7 s |
| 2 Toughs | 13.0 → 13.6 s | 11.8 → 13.1 s | F9 18–21 s |
| 3 Toughs | 20.5 → 17.5 s | 18.7 → 17.6 s | Specials and Team finishers in 43–60% of runs |
| Sandbox (4) | 27.1 → 19.0 s | 23.1 → 19.7 s | Team finisher 28–29/30 (showcase meters); canon meters 22.6 s |
| Captain | 36.3 → 33.1 s | 27.8 → 32.4 s | F9 37 s; canon 38.2 s |
| Challenger (Captain-rank) | — | 24.3 → 32.1 s | target 23–34 s; Team finisher 28/30 |
| **Daifuku phase 1** (scripted bot) | — | 28.1 → **41.4 s** (max 58.7) | ≤ 90 s timebox ✓; Team finisher 29/30 |
| Lose to Daifuku (passive) | wipe 91.3 → 105.9 s, 30/30 | — | |

Never more than 2 enemies engaged Mikan in any run (`maxEng`). Trash fights are no longer much shorter than round 2, though slower pacing and tokens were expected to lengthen them: the showcase's carried meters let the first stagger open a Special chain that clears clustered trash. With canon meters (start 0) the sandbox runs 22.6 s.

<!-- PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see ../../../README.md) -->
# Combat simulation API (M1.2)

Pure, deterministic, headless combat for `design/gdd/combat-system.md`, as amended by the owner's **M1.1** and **M1.2** directions (`design/reviews/owner-feedback/combat-m1.1-spec.md`, `combat-m1.2-spec.md`; M1.2 wins where they differ). There is no rendering, no DOM, no `Math.random` and no wall clock. The presentation **reads** a snapshot and an event stream, and **writes** one input frame per tick.

```js
import { createEncounter, sampleShake } from '../sim/combat/index.js';

const enc = createEncounter('sandbox', { seed: 42, showcase: true });
const events = enc.step(inputFrame);   // once per 1/60 s of real time; ordered, already arbiter-filtered
const s = enc.snapshot();              // read-only plain object for rendering
enc.hash();                            // 16 hex chars over the canonical sim state
```

## What changed in M1.2 (for the presentation agent)

| Area | M1.1 | **M1.2** |
|---|---|---|
| Evade | `dodge` (Space) + `dash` (Shift) | **One `evade` (Space)**; `dodge`, `skitter` and `dash` alias to it. 2.0 m in 0.3 s, i-frames 0.22 s, **cooldown 0.8 s** (`entity.evade_cd_s`, `evade_ready`). It **cancels any attack at any frame** (heavy anticipation included) and **keeps the combo**: a light during or ≤ 0.3 s after it continues the string with a lunge (`Evade.combo_kept`); with no combo, Evade → Light is the **DL** lunge. Events `Evade {cancelled, combo_kept, perfect}`, `EvadeRejected {cooldown_left_s}` |
| Perfect evade | — | An evade that starts with an enemy hit due within 0.2 s (a telegraph on Mikan, or a shockwave front about to reach her) → `PerfectEvade {attacker, slow {scale 0.3, ms 500}, counter_window_s 1.0}`, a sim slow-mo (`snapshot.slow_mo`), and the next light or heavy is the **CTR** counter (`entity.counter_window_s`) |
| Light / heavy | Light active ≤ 3 ticks | **Light active on the next tick** (startup 0.02 s, `AttackActive.latency_ticks` = 1). **Heavies wind up 0.24–0.35 s** (readable anticipation; draw the pose from `attack.id` + `attack.t` < `startup_s`) |
| Movement in attacks | 0 until 60% of recovery | **`can_move` = 0.3 (slow steering) from frame 1, 1.0 from 60% of the TOTAL animation**. Combat move speed **1.6 m/s** (the Lane's Shift-walk) |
| Lock-on | Tab cycles | **Tab locks the nearest; Tab again unlocks.** While locked, send `lockSwitch: {side: 'left'|'right', right: [x,z] (camera right on the ground)}` when the mouse flick passes your threshold → the next enemy on that side |
| Special | Only on a staggered enemy | **F at any time** (meter full). `special_prompt {target, ready, staggered}`. Staggered targets take ×1.3 Special damage (on top of F1's ×1.5) |
| Chain | Parallel-timed cut-ins | **Sequential**: `SpecialStart {cat, cutin_s, action_s, duration_s, index, of}` then `SpecialEnd {cat}` after `duration_s`; the next cat starts only after the previous `SpecialEnd`. `TeamFinisher` (the full burst) comes after the last `SpecialEnd`: extra damage (F5 + 3 MV per cat), or the Rout of a staggered Tough. Repeat chains ×0.6. `SpecialCutIn` is gone |
| AI | Tokens | Plus **cornered cats**: an enemy outnumbered nearby (≥ 2 opponents within 3.5 m, more than its friends + 1) emits `Cornered`, hisses 0.4 s (`intent: 'cornered'`), then lashes out every 0.5–1.0 s at the weakest (< 50% Nerve) or nearest attacker, ignoring token limits and shrugging off light-hit flinches |
| Final KO | — | **`FinalKO {cat, by, how, freeze_ms 400, slow {scale 0.25, ms 1500}, pos}`** when the last opponent falls (and on the showcase's phase-1 break), before `EncounterEnded`. The sim does not slow itself; the presentation stages it |
| Daifuku | Wall, wash tub, knock-offs | **On the ground**, a data-driven Boss pattern (`bosses.json`: phases, weighted attacks with ranges and cooldowns, swing period, rage thresholds; `pattern: 'ground_brawler'`). Signature **Belly-Flop Shockwave**: red telegraph 1.6 s (circle on the target) → slam (MV 2.5 + knockdown) → `ShockwaveStart {id, center, radius, speed_mps 6, max_radius_m 6, width_m 0.7, duration_s}` → a ring hitting every grounded cat it crosses (MV 1.5 + `KnockedDown {duration_s 1.0}`) unless in i-frames → `ShockwaveEnd`. Live rings in `snapshot.hazards[] {center, radius, width, speed, max_radius}`. `BossRage {level}` at 85% Nerve. Arena `yard_ground` (no walls, no props). **Removed:** `KnockOff`, `BossLanded`, `ClimbBack`, the Belly Drop, Climb Back and `wash_tub_kit`. Phase 1 ends `PhaseBreak` → `BossFlee` → `FinalKO {how: 'phase_break'}` → `EncounterEnded(rival_fled)` within 4 s (tested: no stuck state) |
| Damage numbers | — | Every `Hit` has its per-hit `dmg` (integer), `target`, `attacker`, `kind`; `Healed.amount` for heals |

**NieR: Automata check** (web search; the fextralife wiki was unreachable from this session, so frame data is unverified):
- **What the sources say**: a perfect evade is a dodge timed just before an enemy hit; it gives brief invincibility and lets a light or heavy right after it counter. Players report that the counter window is narrower than the evade window.
- **Where we differ**:
  1. Our evade has a 0.8 s cooldown (the owner asked for one; NieR has none).
  2. Our counter is one CTR attack within 1.0 s, whatever the weapon (NieR's counter varies with the equipped weapons).
  3. We add a slow-mo on the perfect evade (the owner's request).
  4. The combo survives an evade by our own rule; NieR's behaviour here is unverified.

## What changed in M1.1

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
| `evade` (aliases `dodge`, `skitter`, `dash`) | Space | **M1.2**: see the table above. Into a High Road edge it mantles; on one it hops down |
| `lockOn` | Tab | Lock / unlock (M1.2). `lockSwitch {side, right}` switches while locked; `lockId: id|null` sets it directly (bots, tests) |
| `skillBar` (alias `slowBlink`) | **R** | Toggle the skill bar |
| `command` | skill bar | `{cat, move|slot, target}` queues a Move for Mikan or any crew cat (forced, whatever its `ai_use`; Paws reserved). A Pay-off commanded after another cat's Set-up on the same target in one opening waits for it (`CommandQueued.after`). `{action:'hiss'}` makes Mikan Hiss when the bar closes; `{action:'scram'}` flees |
| `special` | **F** | Mikan's Special on `special_prompt.target` (needs `ready`; any time in M1.2) |
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
| `Evade` / `EvadeRejected` / `PerfectEvade` | M1.2, see above |
| `KnockedDown` / `ShockwaveStart` / `ShockwaveEnd` / `BossRage` | M1.2, see above |
| `Cornered` / `FinalKO` | M1.2, see above |
| `Staggered` / `StaggerEnded` | `cat, by, window_s, treatment ('full' for Captains, Bosses and the fight's first stagger; else 'light'), slow {scale, ms}` / `cat, reason ('window'|'team_finisher')` |
| `SpecialReady` / `SpecialRejected` | `cat` / `reason ('no_staggered_target'|'meter'), target?` |
| `SpecialChainStart` | `target, cats[] (Mikan first, then each ready crew cat within 8 m, by slot), team_finisher, shortened, staggered, special_s, cutin_s, action_s, team_s, total_s (≤ 6), stagger_left_s` |
| `SpecialStart` * / `SpecialEnd` | `cat, special ('Midnight Laps'|'Landslide'|'Midnight Aria'), style, index, of, cutin_s, action_s, duration_s, target`: T5; the sim is frozen; the next cat starts only after the previous `SpecialEnd` (M1.2) / `cat, index` |
| `SpecialUsed` | `cat, special, targets_hit[]` (its `Hit` events have `kind: 'special'`) |
| `TeamFinisher` * | `target, cats[], duration_s, t_rem`: the full burst after the last `SpecialEnd`; its damage (F5 + 3 MV per cat, `Hit.kind = 'pile_on_beat'`) or the Rout of a staggered Tough lands at its end: the old Pile-On's KA-BLAM |
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
3. **Daifuku (M1.2)** fights on the ground with a basic white swing (MV 1.5 ×1.6), a yellow Paw Swat (MV 2) and his signature shockwave (7 s cooldown, ×0.7 when raging). He swings every 3.2 s ×0.85–1.15, ×0.75 when raging at ≤ 85% Nerve. No knock-offs; a Boss is never knocked back (heavies flinch him per poise). Values are prototype; phases 2–3 have empty attack lists (later milestones).
4. **Fear proposals**: Daifuku keeps "immune to Cowed"; his Water Fear is dropped from the row, since there is no water prop in his bout.
5. **Timers**: local hit-stop freezes only the action. Status, stagger and anger timers stop in global hit-stop, slow in the skill bar and stagger slow-motion, and stop through a Special chain.
6. **Posse hit reactions**: a hit flinches a Posse cat for 0.3 s and interrupts its attack (Mikan's string included). An enemy Splat knocks a Posse cat flat for 1.0 s.
7. **Styles not in the GDDs**: Goma Bruiser, Sasa Yowler, Strays Scrapper Lv 7, the challenger a Scrapper with Face Swat + Bunny-Kick, Togemaru Lv 7, Kinako Lv 7.
8. **Bucket splash** is the §3.9 3 m cone, 90° (angle assumed), pointing away from the hitter.
9. **AI Moves by personality** (round 2; still a deviation from §3.10 and §3.11, designer sign-off pending): Stalwart self-casts Shoulder Check, Goofball Withering Hiss (with a Purr Pay-off), Braggart and Schemer Face Swat. An AI cat may spend its last Paw when the Posse banks one (B-17).
10. **The challenger is a Captain with the Water Fear in the showcase only.** Creative-director sign-off is pending.
11. **M1.1: crew keep their Style basic as their AI "dash-in combo"** (Fraidy one hit). The spec's "crew have no strings" is read as "crew do not get Mikan's five player strings", because §4 has crew "dash in for a combo".
12. **Hiss, Brace and Hop have no key** (M1.1/M1.2 maps). The verbs stay in the sim; the skill bar offers Hiss; an evade into a ledge mantles.
13. **M1.1: Mikan Routed** leaves the crew fighting under AI (control never passes); the fight is lost only when all four are Routed.
14. **M1.1: Special meter** uses Combat F8 (+1 per 1% Nerve lost, ≤ 40; +10 per enemy stagger) plus per-hit gains (Mikan light 1.5, heavy 3, Move 4; crew hit 1). Meters start at 0 in canon (carried in via `opts.special`); the showcase starts them at Mikan 20 and crew 70. Zoomies unlock gates (Mikan L2D3, crew Lv 6) are not applied.
15. **The Special chain (M1.2)**:
    - **Target**: the lock target, else the nearest staggered enemy within 8 m, else the nearest enemy.
    - **Order**: Mikan, then every crew cat within 8 m of the target with a full meter, in slot order. Each Special lasts 0.7 s cut-in + 0.5 s action, and the next starts only at the previous one's `SpecialEnd`.
    - **Full burst**: all four (the Posse must have four) → the Team finisher, 1.2 s. It deals F5 (2 + k·T_rem) + 3 MV per cat, or Routs a staggered target below Captain together with staggered trash within 3 m.
    - **Totals**: ≤ 6 s; repeat chains run ×0.6.
    - **Effects**: the §3.7 Zoomies effects, ×1.3 on a staggered target.
16. **M1.1: engagement**:
    - At most 2 enemies engage the controlled cat at once (`dash_in`, `attack` or `feint`), 1 on each AI cat, and 2 crew on one enemy.
    - The others circle, stalk, posture, flank or strut at their personality's band, and decide every 0.4 s whether to engage.
    - Enemies side-step Mikan's swing at 15% when not engaged.
17. **M1.1: stagger slow-motion**: ×0.25 for 0.45 s on the full treatment, ×0.5 for 0.2 s on the light one, inside the ≤ 0.5 s budget. The zoom and shattered-glass blink are presentation.
18. Rival flight, the `ambush_by_rival` and `raid_defence` openers, Daifuku phases 2–3 content, and guest wave cues are unbuilt, as in M1.
19. **Evade and combo (M1.2)**: the combo kept by an evade is the last attack that landed (an attack cancelled before its hit hands on its predecessor). It lives through the evade and for `combo_grace_s` (0.3 s) after. A perfect evade is judged when the evade starts: an enemy telegraph on Mikan (aimed at her, or with her inside its shape) resolving within 0.2 s, or a shockwave front within its travel distance for 0.2 s.
20. **Cornered cat (M1.2)**: "outnumbered" = at least 2 opponents within 3.5 m and more opponents than its friends within 4 m + 1. While cornered, light string hits do not flinch it, because otherwise four attackers flinch-lock it (the owner's "rarely attack" complaint). Heavies, finishers, Hiss interrupts and Fears still do.
21. **Final KO** is an event only: the sim ends the encounter on the same tick (win) or after the phase break, and the presentation stages the freeze and slow-mo from its durations. No `FinalKO` on a loss or a Scram.

## Fight lengths (tools/sim-run.mjs, 30 seeds, Alley, showcase on; M1.1 → M1.2)

| Fight | Median bot | Skilled bot | Note |
|---|---|---|---|
| Tough alone | 11.6 → 9.0 s | 10.7 → 8.3 s | |
| 2 Toughs | 13.6 → 11.2 s | 13.1 → 10.1 s | |
| 3 Toughs | 17.5 → 11.9 s | 17.6 → 11.3 s | a Special chain in 29–30/30 |
| Sandbox (4) | 19.0 → 14.6 s | 19.7 → 12.5 s | Team finisher 8–9/30 |
| Captain | 33.1 → 30.3 s | 32.4 → 28.2 s | F9 37 s (band 30–45) |
| Challenger (Captain-rank) | — | 32.1 → 31.0 s | target 23–34 s |
| **Daifuku phase 1** (ground; skilled bot on him) | — | 41.4 → **47.0 s** (25–90.5 s) | ≤ 90 s timebox; shockwaves and knockdowns every bout |
| Lose to Daifuku (passive) | wipe 105.9 → 55.5 s, 30/30 | — | |

M1.2 trash fights are shorter, for three reasons:
- Lights start instantly and chain at 0.44–0.5 s.
- The Special can open with full showcase crew meters (start 70) without waiting for a stagger.
- A cornered last enemy lashes out, but it also dies faster.

Move speed is the owner's 1.6 m/s, which lengthens the approaches.

Showcase Special meters now start at Mikan 20 and crew 70 (M1.1: 20/80).

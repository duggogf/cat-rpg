<!-- PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see ../../../README.md) -->
# Combat simulation API (M1 grey box)

Pure, deterministic, headless combat for `design/gdd/combat-system.md`. No rendering, no DOM, no `Math.random`, no wall clock. The presentation layer (combat camera, HUD, VFX, feel tiers) **reads** a snapshot and an event stream and **writes** one input frame per tick.

```js
import { createEncounter, sampleShake } from '../sim/combat/index.js';

const enc = createEncounter('sandbox', { seed: 42, showcase: true });
// Fixed 60 Hz: call step() once per 1/60 s of real time (accumulator in the render loop).
const events = enc.step(inputFrame);   // ordered, already filtered by the safety arbiter
const s = enc.snapshot();              // read-only plain object for rendering
enc.hash();                            // 16 hex chars over the canonical sim state
```

## Coordinates and time

- **Metres, y up, ground plane x/z**, arena-local. `snapshot().arena.origin` is the arena's offset in the M0 world (`src/world/lane.json` frame: x right, lane along z). World position = `origin + pos`.
- Cats are authored for **scale 1.25**: body radius 0.35 m (Daifuku 0.6 m). Walls and the High Road are 1.5 m (M0 wall height); `pos[1]` is the height (0 ground, 1.5 on a wall; arcs for hops, pounces, Tag-In leaps).
- **Facings are unit vectors** `[fx, fz]` on the ground plane (yaw = `atan2(fx, fz)` in three.js terms). The sim never uses trig on its state.
- One `step()` = 1/60 s of **real** time. `snapshot().time_scale` is 1, 0.05 in Slow Blink, 0 during global hit-stop. `t` is real seconds, `sim_t` is scaled seconds, `fight_t` counts only the fight.

## `createEncounter(def, opts)`

| Arg | Meaning |
|---|---|
| `def` | An `encounters.json` Name (`tough_focus`, `toughs_2`, `toughs_3`, `sandbox`, `two_strays`, `captain`, `challenger`, `challenger_no_guest`, `daifuku_bout`, `lose_to_daifuku`) or an inline row `{Name, arena, opener, posse[], enemies[], guest:{cat, cue:'start'}|null, tutorial, old_scores?}` |
| `opts.seed` | uint32. Every AI has its own substream `ai:<id>`, so adding a cat never shifts another's draws |
| `opts.showcase` | Applies `showcase_overrides.json` (phase cap 1, Daifuku Furious, the tutorial Frazzle boost). Off = canon |
| `opts.difficulty` | `Kitten` / `Alley` (default) / `Feral` (Combat §3.15) |
| `opts.anger` | `{ daifuku: 'Calm'|'Riled'|'Seething'|'Furious' }`: Nemesis's stage at fight start (beats the showcase value) |
| `opts.reduceFlashes`, `opts.motionScale` | Accessibility options fed to the arbiter (line hold instead of flashes; shake scale 0–1) |
| `opts.controlled` | Starting controlled cat (default the first Posse cat) |
| `opts.data` | A `buildData(overrides)` bundle, for tuning experiments and tests |

The first `step()` also returns the constructor's events (`EncounterStarted`, `StandoffStart`). `enc.log` holds every event so far.

## InputFrame (all fields optional; booleans are *pressed this tick*)

| Field | Control (DR-08) | Effect |
|---|---|---|
| `move: [x, z]` | WASD / left stick | World-space ground vector (camera-relative conversion is the presentation's job). Length ≤ 1 |
| `aim: [x, z]` | — | Optional facing for the controlled cat (Hiss and strings act "in front") |
| `attack` | LMB / West | 3-hit string; airborne or from the High Road it is a **Pounce** at the lock target (≤ 6 m, F7 wind-up). Buffered 0.3 s |
| `hop` | Space / South | Hop; within 1 m of a High Road edge it mantles; on the High Road it hops down |
| `skitter` | Shift / East | 2.5 m dodge along `move` (or backwards), i-frames 0.2 s |
| `brace` (held) | RMB / R1 | Guard the front 120°; the presentation implements the toggle option |
| `hiss` | F / North | Hiss; becomes **Pile-On** while `pile_on_offer` is set |
| `moveSlot: 0..3` | 1–4 | Shortcut Move for the controlled cat at the lock target (paths to range, Paw spent at commit) |
| `switchTo: 0..3` | Z X C V / D-pad | Switch; inside `tag_window` it is a **Tag-In** (Relay rules applied by the sim) |
| `slowBlink` | Tab / R2 | Toggle Slow Blink (closed in the Standoff and Pile-On) |
| `command` | Slow Blink menu | `{cat, move | slot, target}` (queues; Paws reserved), `{action:'pile_on'}` or `{action:'scram'}`. Only while Slow Blink is open; one per tick |
| `lockNext` / `lockId` | wheel or R3 flick / direct | Lock-on target (soft lock picks the nearest by default) |

There is no heavy attack and no hold-charge (Combat §3.2; DR-28): the string's finisher is the heavy beat.

## `snapshot()` (read-only; a fresh object every call)

Top level: `tick, t, sim_t, fight_t, time_scale, mode ('standoff'|'fight'|'pileon'|'gloat'|'ended'), slow_blink, controlled, lock, arena{id, origin, ring_center, ring_radius, high_roads[]}, props[{id, kind, pos, uses_left}], entities[], telegraphs[], tag_window{target, left_s, relay}|null, relay{starter, count, members, bonus_locked}|null, relay_bonus_locked_s, pile_on_offer{type:'quick'|'full', targetId, cluster[], t_rem, pips}|null, pile_on{type, target, cats[], t, dur}|null, fed_up, outcome`.

`entities[]`: `id, cat, name, side ('posse'|'enemy'|'guest'), slot (D-pad 0..3; -1 guest), rank, style, personality, pos [x,y,z], facing [fx,fz], present, routed, anim, anim_t, string_idx, controlled, invulnerable, bracing, on_high_road, nerve, nerve_max, paws (0–2, fractional), paw_points, paws_reserved, orders[], frazzle (enemies 0–100), frazzled_s, pips, ruffled_s (-1 = Fed Up, rest of fight), splat_s, clumped_s, status{kind:'soggy'|'cowed'|'fired_up', left_s, source}|null, anger_fired_up{active, left_s (-1 = whole fight), stage}|null, hiss_cd_s, moves[], target, boss{phase, state:'wall'|'falling'|'ground'|'drop', ground_s, pending_break}|null, guest{state:'waiting'|'yowl'|'in', t}|null`.

`anim` values: `idle, run, string, move_<id>, skitter, hiss, hop, mantle, drop, pounce, leap, tagin, enter, knockback, flinch, splat, frazzled, piled, pileon, windup_white|windup_yellow|windup_red, recover, fall, climb, drop_recover, break, brace, routed, yowl_offstage, offstage, gone`.

`telegraphs[]`: `id, attacker, cls ('white'|'yellow'|'red'), move, aimed_at, shape, t, dur, fill (0–1)`. Shapes: `{type:'cone', origin:[x,z], dir:[x,z], range, angle_deg}`, `{type:'circle', center, radius}`, `{type:'line', origin, dir, length, width}`, `{type:'self'}`. The hit test uses exactly this shape (a hit never exceeds its drawn shape).

## Events (ordered within the tick; payload fields beyond `type, t, sim_t, tick`)

| Event | Payload |
|---|---|
| `EncounterStarted` | `encounter_id, opener, arena, posse[], enemies[], guest` |
| `StandoffStart` / `StandoffEnd` / `FightStarted` | `duration_s, enemies[], barks[{cat, kind:'defiant'|'kin', text?}]` |
| `Hit` * | `attacker, target, kind ('string'|'finisher'|'pounce'|'tag_in'|'move1'|'move2'|'enemy_white'|'enemy_yellow'|'enemy_red'|'pile_on_beat'|'move_mid'), move, dmg, mv, fz, hit_type, blocked, frazzled, nerve, cls, authored ('player'|'ai'|'enemy')` |
| `Whiff` * | `attacker, target, perfect_skitter` |
| `Frazzled` / `FrazzleEnded` | `cat, by, window_s` / `cat, reason ('window'|'pile_on')` |
| `Ruffled` / `RuffledEnded` / `RuffleIgnored` | `cat, by, duration_s` / `cat` / `cat, reason:'wise_to_it'` |
| `Splat`, `KnockOff` *, `BossLanded`, `ClimbBack` | `cat, by, duration_s` / `cat, by, land` / `cat, in_bucket` / `cat` |
| `StatusApplied` / `StatusEnded` / `StatusPaused` / `StatusResumed` / `StatusImmune` | `cat, status, source ('anger'|'nerves'|move|prop), duration_s|left_s, stage?, reason?` |
| `TelegraphStart` / `TelegraphEnd` | `id, attacker, cls, move, aimed_at, shape, windup_s` / `id, reason ('resolved'|'interrupted'|'cancelled'|...)` |
| `Hiss`, `HissFizzle`, `HissInterrupt` *, `BackDown` * | `cat` / `cat` / `cat, target, move, tele, aimed_at, authored` / `cat, by` |
| `MoveUsed` | `user, move, targets_hit[], authored, paws_after` (canon `MoveUsed`) |
| `CommandQueued` / `CommandRejected` / `CommandDropped` | `cat, move, target, shortcut` / `reason, command` |
| `PawFilled` | `cat, paws` (a per-slot cue, §3.17 rule 8) |
| `Switch` / `TagIn` / `RelayEnded` | `from, to, tag_in, reason?` / `from, to, relay_count, target` (canon `TagIn`) / `tags, reason, bonus_locked_until` |
| `SlowBlinkOpen` / `SlowBlinkClose` | `reason` |
| `PileOnOffered` / `PileOnWithdrawn` | `pile_type, target, cluster[]` |
| `PileOnStart` * / `PileOnBeat` * / `PileOnEnd` * | `pile_type, target, cluster, cats[], t_rem, pips` / `cat, beat, of, style, flourish` / `pile_type, target, routed[]` |
| `PropTriggered` * / `PropHit` / `FearTriggered` * | `prop, kind, by, goofball` / `prop, empty` / `cat, fear, source (prop id or 'tell'), effect` |
| `CatRouted` * | `cat, by, how ('by_hit'|'by_pile_on'|'by_back_down'), side` (canon `CatRouted`) |
| `AllyJoined` / `AllyYowl` / `GuestEntered` / `GuestLeft` | `cat_id, encounter_id` / `cat, from, duration_s` / `cat` / `cat, reason` |
| `PhaseBreak` * / `PhaseStarted` / `BossFlee` | `cat, phase, capped, carry` / `cat, phase` / `cat, to:'den'` |
| `FedUp`, `LockTarget`, `Skitter`, `Hop`, `HopDown`, `Mantle`, `Pounce`, `Healed`, `Bark` | small payloads; `Bark.kind: 'steeled'` when a Tag-In clears Old Gang Nerves |
| `Gloat` | `victors[], duration_s` (≤ 3 s; Combat's part of a loss ends here) |
| `EncounterEnded` | `encounter_id, outcome ('win'|'loss'|'player_fled'|'rival_fled'), victor_ids[], boss_ids[], fight_s, real_s, reason?, rival?, by?` — **the day loop consumes `outcome = loss`** (clock to Night, closed street). Combat writes no record |

\* carries `feel`, the arbiter's verdict for the presentation:

```
feel = { tier 0-5, base_tier, authored, hitstop{scope:'none'|'local'|'global', ms, dropped_ms}, shake{peak_pct, steps, step_ms, decay}|null,
         impact:'none'|'local_disc'|'fullscreen'|'line_hold', impact_frames, delay_ms (queued on the screen-wide channel),
         lines, lines_ms, glyph, dust, punch_in_pct, time_dip, rumble[lo,hi], word{cls, ms}|null, edge_pulse{ms, alpha, colour}|null }
```

The arbiter already enforces: AI-authored hits one tier lower (no global hit-stop, full-screen or lettering); hits on AI cats two tiers lower, no shake; incoming hits on the controlled cat at the enemy class's tier with local hit-stop ×0.75 and an Ink edge pulse; **≤ 1 full-screen frame per second, ≤ 2 flashes/s and 6 per rolling 5 s**; the one screen-wide channel (higher tier pre-empts, equal tiers queue 170 ms, `delay_ms`); a Tough Rout's full-screen frame only if none in the last 1 s; **global hit-stop ≤ 200 ms per rolling 1 s outside authored T5** (the excess is dropped and the sim honours the granted amount); lettering only on player T4/T5, one word at a time; Reduce Flashes. **Shake summing and the 1.8% clamp** belong to the camera: `sampleShake(activePatterns, t)` returns the clamped displacement (patterns are `feel.shake` plus their start time).

## `hash()`

FNV-1a (two lanes) over `enc.state()`: entities, actions, timers, gauges, RNG draw counts, telegraphs, props, relay, arbiter windows. Same seed + same input log ⇒ same hash, in Node ESM and in the esbuild IIFE bundle (checked).

## Data (`src/data/combat/*.json`, rows keyed by `Name`, every row has `_src`)

`combat_constants` (F1–F11, poise, tokens, Pile-On, Relay, statuses, anger, nerves, difficulty, frame data marked *prototype*), `styles`, `ranks`, `moves` (the slice six ★ plus the other six catalogue Moves and the enemy-only attacks), `personalities`, `combatants`, `bosses` (Daifuku's phase table and kit), `tiers` (T0–T5), `safety` (DR-50), `arenas` (sandbox lane, gatepost, the wash-tub kit), `encounters`, and `showcase_overrides` (**throwaway, never transfers**).

## Assumptions (GDD ambiguities resolved here; flag to the combat designer)

1. **No heavy attack** (§3.2, DR-28): the brief's "heavy" is the string finisher. Zoomies are not built (not in the M1 scope; Mikan's unlock is Life 2 day 3).
2. **Ring ≈ 10 m read as a diameter** (radius 5 m). Arenas are circular rings in local coordinates; the M0 lane's walls are not colliders for the sim (the presentation places `origin`; M2 owns lane collision).
3. **Enemy white attack** = one telegraphed swing of MV 1.5 (F10's "each attack averages about 1.5 MV"), not a 3-hit string. Token holders attack every 4.5 s × 0.8–1.2 (seeded).
4. **Daifuku phase 1**: he swings every 4 s (F10): a yellow Paw Swat (MV 2) at a cat on his wall within 2.4 m, otherwise a red Belly Drop (MV 2, 2 m circle, 1.5 s windup) onto a ground cat, then he jumps straight back. On the ground: white swings, then a yellow Climb Back after 6 s. Belly Drop reach covers the ring (9 m). No Sit On It in phase 1.
5. **Knock-offs**: any listed knockback source (`shove`, `shoulder_check`, `body_slam`, `banshee_screech`) landing on him while he is on his wall and **not Frazzled** drops him; he always falls to the yard side, 0.95 m off the wall line and 0.5 m along the push, and lands in the tub if within its radius + 0.6 m. The wash tub is one use per phase (Combat §3.9 bucket rule).
6. **Fear proposals adopted**: Daifuku Fear Water and "immune to Cowed" (Crew §3.3 proposals) are in `combatants.json`. A dunk is Ruffle + 20 + 10 FZ + the Fear's 15 FZ chunk (F9's model has no Fear chunk).
7. **Local hit-stop freezes only the entity's action**; status, Frazzle, Ruffled and anger timers stop only in global hit-stop and run at 5% in Slow Blink (§3.17 rule 6). The Pile-On target's Frazzle window is held while the Pile-On plays.
8. **Pile-On beats**: the Full Pile-On deals `(2 + k·T_rem)` MV per participating cat through F1 (so Off/Hide/type apply on top of F5's neutral figure). Each beat is a T3 local beat (shake on beats); the start and end are T5.
9. **Quick Pile-On "last enemy"** counts every standing enemy in the ring (no waves exist in M1).
10. **Posse cats hit by enemies** flinch 0.3 s; an enemy Splat knocks a Posse cat flat for 1.0 s. Soggy slows actions as well as movement (×0.8).
11. **AI cadence**: a full string, then posture for `1.8 × 0.65/0.35 × U(0.8, 1.2)` s. White-telegraph dodge chance per personality (`white_dodge_p`, prototype); Stalwart Braces (`brace_p` 0.8).
12. **Stalwart "takes attack-token priority"**: enemies score a Stalwart within 3 m of the controlled cat 1.5 m closer when picking a token target. This reads the target's perk, not Posse membership (G4/G7 hold).
13. **Styles not in the GDDs**: Goma = Bruiser Tough Lv 8, Sasa = Yowler Tough Lv 8, Strays Scrapper Lv 7, the challenger a Scrapper Tough Lv 8 with Face Swat + Bunny-Kick, Togemaru Lv 7, Kinako Lv 7 (Mikan − 1), the reference Captain a Lv 8 Yowler. Mikan has no personality, so no bonded Tag-Ins with her.
14. **Guest cue**: only `cue: 'start'` (the yowl at the Standoff's end). The wave cue is unbuilt until waves exist (phase 2+).
15. **Prop hits** need an untargeted swing facing the prop (so a whiff on a climbing Boss does not waste the tub). The bucket splash is a 1.5 m circle (the GDD's "3 m cone"). Goofball ×1.3 scales the flat Frazzle chunks.
16. **Rival flight** and the Togemaru day-1 bolt are data-driven (`flee_threshold`, `flee_uninterruptible`) but no slice row sets them in M1; `ambush_by_rival` and `raid_defence` openers are not built (`ambush_by_player` is).
17. **Phases 2–3** keep the phase table and the clamp; with `boss_phase_cap` 3 the fight continues on the phase-1 kit (no waves, horn or ledge junk yet).

## Fight lengths (tools/sim-run.mjs, 30 seeds, Alley, showcase on) vs the GDD

| Fight | Median bot (F9 policy) | Skilled bot | GDD (F9 sim) |
|---|---|---|---|
| Tough alone (last enemy, Quick Pile-On) | 7.7 s | 7.7 s | 5.6–5.7 s |
| 2 Toughs | 14.2 s | 12.1 s | 18–21 s |
| 3 Toughs | 21.1 s | 18.5 s | 25–28 s |
| Sandbox, 4 Toughs/Strays | 26.1 s | 25.2 s | 33–36 s |
| Captain | 41.4 s | 31.1 s | 37 s (band 30–45) |
| Daifuku phase 1 (scripted bot) | — | 39.0 s to the break | ≈ 55–60 s (⅓ of 166–176 s); bout ≤ 90 s |
| Daifuku, all 3 phases (canon, Calm, scripted bot, 3 seeds) | — | 128–195 s, wins | 166–176 s |
| Lose to Daifuku (passive) | wipe at 90.2 s, 30/30 | — | loss near-certain |

Trash fights run ≈ 20–30% shorter than F9's sim (its group focus factor 0.55 is a model input; here targets rarely split and Quick Pile-Ons clear Frazzled clusters). Not retuned: a tuning change is a GDD change request.

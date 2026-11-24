<!-- PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see ../../../README.md) -->
# Territory simulation API (M2)

Pure, deterministic, headless territory for `design/gdd/territory-management.md` (owner-feedback and consistency passes, 2026-11-24), with `owner-feedback-rulings.md` OR-07…OR-16 winning where they differ. No rendering, no DOM, no `Math.random`, no wall clock. The presentation **calls verbs**, **reads** `snapshot()` and **subscribes** to the returned events. Every number is in `src/data/territory/*.json` with `_src`.

```js
import { createDistrict } from '../sim/territory/index.js';

const t = createDistrict({ seed: 42, start: 'l1d1' });     // or start: 'showcase_l2d2' (influence 95, challenger on LPY)
let ev = t.rub('LPY', 'LPY.rub1');                          // each call returns an ordered event array
ev = t.spray('LPY');                                        // call when the 1.2 s hold completes uninterrupted
const s = t.snapshot();                                     // plain object for rendering
t.hash();                                                   // 16 hex chars over the territory state
```

## Ids

- District `hidamari` (Hidamari Lane). Patches `LWC` Low Wall Corner (Home Ground), `LPY` Laundry Pole Yard, `PA` Persimmon Alley, `TSS` Tofu Shop Step, `DEN` Daifuku's Wall.
- Posts (one per Patch, place one landmark mesh each): `red_mailbox`, `gatepost`, `utility_pole`, `milk_crates`, `corner_stone`. Rub Marks: `LWC.rub1`, `LWC.rub2`, `LPY.rub1`, … (two per outer Patch, shown only in Whisker Sense; the Den has none).
- Boss stops (`boss_patrol.json`): `den_wall` (window shut: no Standoff), `S_M` Laundry Pole Yard (Morning), `S_D` Tofu Shop's back lane (Day), `S_N` the Den corner (Dusk, Night). The environment places these; the sim says which one is live.
- Clowders and wisp colours (`clowders.json`): `bell` #F2B01E, `wall_sitters` #A8C878, `strays` #33273B, `outsiders` #4E9DA6 (**placeholder**: the art bible has no Outsiders colour yet).

## Verbs (by day)

| Call | Rule | Key events |
|---|---|---|
| `rub(patch, mark, {seen})` | Own Patch: no Scent, `seen` only. Rival: **Over-mark −10**, once per mark per contest; quiet unless `seen` (a rival cat within 8 m: the caller decides) | `Rubbed` or `MarkApplied{kind:'over_mark'}`, `ScentChanged`… |
| `sprayOffer(patch)` | `{kind, hold_s: 1.2}` or `null`: `rescue_spray` (own post **< 60** only), `claim_spray` (no Keeper), `counter_spray` (rival with a Keeper). Den: null until the Boss's Verdict | — |
| `spray(patch)` | Rescue → **90**; Claim → yours at **70**; Counter-Spray **−30**, always loud | `MarkApplied`, `ScentChanged`, `PatchChanged`, `InfluenceChanged`, `BossWindowChanged`, `BossMoved`, `DistrictClaimed` |
| contest | First loud/seen act Bristles: `ContestBristled{waves: 2 if S_r ≥ 40, 1 if > 30, 0 if ≤ 30}`. At S_r ≤ 30: `KeeperCalled{keeper, escort_wave}` (escort only on a quiet take). Life 1 LWC follows PP-03 (`scripted: true`). `endContest(patch, reason)` when Mikan leaves 20 s or goes home | `TurfWavesStopped`, `KeeperCalled`, `ContestEnded` |
| `verdict(patch, 'chase'\|'recruit'\|'nose')` | Clears the Keeper; offers the Claim. **Changes no Scent.** On `DEN` the Boss leaves the patrol | `PatchChanged{keeper:null}`, `ClaimOffered` |
| `encounterEnded({patch, outcome})` | Marks the Patch seen. **Never moves Scent** (G5) | — |
| `challengerBeaten()` | Verdict on the challenger by day: the challenge ends, tonight's `challenge` raid is declined, no Scent | `ChallengeEnded` |
| `setSentry(patch, {cat, style, personality} \| null)` | ≤ 2 slots (DR-01). Style `yowler` = Crier (+14), `bruiser` = Anchor; personality `brooder` (decay ×0.5), `goofball` (challenger over-mark 0) | `SentryPosted`, `SentryReturned` |
| `whisker(dt, {held, inCombat, pos:[x,z], cats:[{id, pos\|dist, onScreen}]})` | Every frame while held. An undiscovered cat on screen within **10 m** for **1.0 s** → discovered. Release, combat, range or screen loss cancels | `CatDiscovered{cat, how:'sniff'}` |
| `discover(cat, how)` | Encounter/Crew discovery | `CatDiscovered` |

**Animating changes (M2 review fix 6).** Every per-Patch Scent change emits
**`ScentChanged {district, patch, clowder, previous_clowder?, from, to, delta, cause}`**, with `cause` one of `over_mark`, `counter_spray`, `rescue_spray`, `claim_spray` (by day), `decay`, `recovery`, `keeperless_fade`, `challenger_overmark`, `raid`, `raid_lost`, `scrapper_repel`, `challenger_settled` (overnight), or `newcomer` / `turncoat`. `clowder` is the owner after the change. `previous_clowder` appears only when the Patch changed hands, so the rival's loss on an Over-mark or Counter-Spray is `clowder: 'wall_sitters', delta: -10 / -30`.
When any Clowder's bar value moves, **`InfluenceChanged {district, by_clowder, from, delta, cause, scent}`** follows. `from`, `by_clowder` and `delta` are per-Clowder maps. `cause` is `{kind, patch}` for a day act or `{kind: 'overnight', night}`. `scent[]` lists the Scent changes behind it, so ours and theirs ("+5 ours / −8 theirs") come in one event. A mark on a rival post still at 60 or more moves no bar (influence caps at Strong), so it emits ScentChanged only.

**`MarkApplied {district, patch, post, by:'mikan', kind, target_clowder, rub_mark?}`**, `kind ∈ over_mark | counter_spray | claim_spray | rescue_spray` (F8 contract; `district`/`patch` are its `district_id`/`patch_id`). Nemesis reads it for anger (over_mark +5 / counter_spray +15 on `wall_sitters` only); `anger-reference.js` is a stand-in consumer until M3.

## Time

- `advance(clockSeconds)`, `setClock(c)`, `setPhase('morning'|'day'|'dusk'|'night')`: Morning [0,240) · Day [240,480) · Dusk [480,720) · Night [720,960) clock s, capped at 720 until `catFlap()`. Emits `PhaseChanged`; while the window is open, `BossMoved{at, patch, roaming, phase}`.
- `overnight({raid})` runs step 2 in canon order (decay + refresh → challenger over-mark → raid → lapses → influence and window), the challenger calendar (hosted until M3), then opens the next morning (`DayStarted`). `raid = {patch, motive, leader, outcome}` with the outcome **already rolled by M5's §4.5 resolver**; the sim applies the Strong, window, gloat and admissibility rules (`RaidResolved`). Returns `{events, report}` (`report.patches[id] = {from, decay, refresh, overmark, to, …}`).

## Queries

`influence(clowder='bell')` (the header bar value, §4.14), `influenceBar()` (`{bell, wall_sitters, strays, outsiders, open}`), `bossWindow()` (`{open, crown_lit, at, patch, roaming, standoff_offered, verdicted}`), `patch(id)`, `scent(id)`, `owner(id)`, `band(scent)`, `raidInadmissible(id, motive)`, `challengerTarget()`, `isDiscovered(cat)`, `rng(step, subsystem, key)` (counter-seeded substream for M5), `state()`, `hash()`.

## `snapshot()`

```
{ district, display, day, life, phase, clock, influence, bar, window,
  posts: [{ patch, post, display, owner, colour, keeper, scent, band, wisps (0-4), droop (< 60),
            fading (yours and < 60: the cracked-wisp stamp), staked_by, contested, keeper_called,
            spray_offer, home_ground, boss_seat, sentry, rub_marks: [{id, over_marked}] }],
  challenger, discovered, whisker: { held, rings: [{cat, t, of}], ticks: [{kind, target, patch}] } }
```

Compass ticks (≤ 6, hud.md §3.2 priority): `roaming_boss` (target = stop id), `challenger`, `fading_post`, `rival_mark` (target = post id). The street shows wisps only; `influence` is for the Turf Board header and the Sniff bar.

## Run

```bash
node --test 'tests/unit/territory/*.test.mjs'
node tools/territory-run.mjs
```

## Assumptions (flagged)

- Life 1 LWC starts Stray-held at 80 (the outer ceiling); PP-03 bypasses the thresholds.
- A Fraidy that "bolts" on a Scuffed leaves its Patch Unwatched the next night like a Routed Sentry.
- After `DistrictClaimed` the window flag is left as it was; the Boss is off the patrol.
- The challenger calendar, discovery flags and anger live here only until M3's nemesis module takes them.

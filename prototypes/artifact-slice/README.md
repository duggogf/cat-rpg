# Cat RPG — artifact showcase slice (prototype)

**PROTOTYPE - NOT FOR PRODUCTION.** Throwaway browser build (three.js 0.160.1) that showcases Cat RPG's
gameplay and art direction as a single shareable Artifact page, before the Unreal Engine 5.8 build.
Plan: `production/artifact-slice/IMPLEMENTATION-PLAN.md`. Nothing here migrates to Unreal except the data
tables and tuning values (plan §7).

## Hypotheses

- **M0 (look-dev):** code-authored real-time 3D can hit the owner's art target — cel-shaded cats that read
  as 2D cartoon cels over environments that read as 2D painted anime backgrounds (style reference
  `design/reviews/refs/style-reference.webp`), under a free third-person camera.
- Later milestones: the showcase slice's gameplay reads and feels right in ~14 minutes (plan §2).

## Run

```bash
npm install
```

```bash
node tools/build.mjs
```

```bash
node tools/serve.mjs 5173
```

Open `http://localhost:5173/` (the M0 scene; `dist/catlab.html` is the cat lab). Query params:
`?phase=day|dusk`, `?view=01`, `?orbit=0..7`, `?test=1`. Evidence shots: `node tools/m0-shots.mjs`
(writes to `production/qa/evidence/artifact-slice/M0/`). Publish set: `dist/index.html` (page fragment,
three from jsDelivr) plus `dist/game.js`, `dist/mesh/*.json`, `dist/tex/*`.

## Combat simulation (M1, headless)

The combat rules run as pure, deterministic logic in `src/sim/combat/` (API and assumptions:
`src/sim/combat/API.md`), with every number in `src/data/combat/*.json` (each row cites its GDD source in `_src`).
No browser and no `npm install` beyond Node 22 are needed:

```bash
node --test 'tests/unit/combat/*.test.mjs' 'tests/smoke/combat/*.test.mjs'
```

Keep the quotes and the `*.test.mjs` globs: Node 22 expands them itself, and a bare directory
(`node --test tests/unit/combat/`) fails with MODULE_NOT_FOUND.

```bash
node tools/sim-run.mjs --seeds 30
```

The first runs the unit tests (F1–F5, F7 and F11 worked examples, determinism by hash, the join-in guest leaving the
opposing Rival's AI bit-identical, Old Gang Nerves, the arbiter's flash and hit-stop caps, and the M1.1/M1.2 input model:
the one-slot buffer, next-tick lights, move-out at 60%, Evade cancels with combo continuation and cooldown, perfect
evade, L-L-L-H, lock-on, attack tokens, cornered cats, the sequential Special chain, Daifuku's shockwave and clean
phase-1 end, Final KO) and the smoke bots on
3 seeds. The second prints fight lengths per scenario (skilled, median-policy, scripted-Daifuku and passive bots)
against the GDD's F9 figures and exits non-zero if a bot misses its expectation (`--only <id>`, `--json out.json`).

## Lane, exploration and territory (M2, world side)

The default page is now ≈ 120 m of Hidamari Lane grown around the approved M0 corner (`src/world/lane-m2.js`):
Haru's garden wall (the wall blend) and Low Wall Corner uphill, Persimmon Alley, Laundry Pole Yard (the M0 corner,
High Perch, yard stop), the Den wall with Daifuku within 10 m of the perch, and the stepped slope down to Tofu Shop Step.
Territory rules come only from the simulation (`src/sim/territory/`, `API.md`) through `src/world/territory.js`;
`src/render/scent.js` draws wisps, pops, Rub Marks, trails, the compass ring and the Head Home thread;
`src/ui/street-hud.js` is the street HUD; `src/camera/rig.js` `ExploreRig` is the Explore camera.

Controls: WASD (Shift run), drag or double-click to look (1:1), Space hop onto walls / off the ribbon, E spray / rub /
nap / pick up (hold), Tab Whisker Sense, H Head Home thread, N nap to Dusk, 1 / 2 Day / Dusk.
Params: `?start=showcase_l2d2|l1d1`, `?seed=N`, `?vantage=0..5`, `?sense=1`, `?fps=1` (frame-time overlay;
`__frameLog()` for the real-laptop log), `?hud=0|1`. Evidence: `node tools/m2-shots.mjs`
(writes to `production/qa/evidence/artifact-slice/M2/`).

## Rivals, Verdict and the Rivals board (M3, presentation)

Facts come from the nemesis simulation (`src/sim/nemesis/`, `API.md`) through `src/ui/rivals-model.js` (`fromNemesis`).
`src/render/boardscene.js` is the board's 3D diorama (three small sets from `src/world/board_lane.json`, the street's
painted shader and baked paint, live cats on role anchors, ink silhouettes in the shade); `src/ui/rivalsboard.js` is its
DOM layer (ribbons, tags, arrows, card, scene strip; hover ray, keys); `src/ui/standoff.js`, `verdict.js` and
`sniffcards.js` are the Standoff, the three-card Verdict and the Declaration / closing cards; `src/ui/m3.js` hooks them
into the Lane (J or Pause > Rivals opens the board; T stages Togemaru's L1D2 Standoff, then the Verdict and the L2D2
Sniff); `src/ui/m3-combat.js` shows the Verdict after a won rival fight in the combat chapters (`&verdict=0` turns it off).
Params: `?board=lane|outsiders|bell&focus=<id>&full=1`, `?branch=A|B|C|L1`, `?m3=standoff|verdict|declaration|pause`
(`&card=up|left|right`). Evidence: `node tools/m3-shots.mjs` (writes to `production/qa/evidence/artifact-slice/M3/`).

## Status

- **M0 look-dev:** concluded on the studio side — three review iterations (art + creative director): final
  verdict **GO WITH FIXES (carried into M1)**; overall 7/10 vs the style reference, 7.5/10 vs preview 01
  (`production/qa/evidence/artifact-slice/M0/review-final.md`). Published as the Cat RPG Showcase artifact
  (https://claude.ai/artifact/MBsJLyudNiAdVyUu9BhpD6). **Awaiting the owner's go/no-go before M1.**

- **M1 combat grey box:** done — final review GO WITH FIXES (overall 7/10); deterministic sim (58 tests), personality AI, Slow Blink, Pile-On, Daifuku phase 1; reachable via `?chapter=combat&fight=toughs3|captain|daifuku` or the chapter menu.

## Findings

- M0 (provisional): the "ink what acts, paint what stays" split works in three.js — SDF-built skinned cats
  with a two-tone toon ramp and an output-scaled inverted-hull ink line; environments shaded from textures
  baked out of the preview kit, coloured shadows, card foliage, animated leaf-light and a paint post-process.
  All 8 orbit angles read as painted. Open: white cats on the lighter (reference-matched) ground miss the
  E-5 contrast target (13–18 L* vs 20); readability currently rests on the ink line and contact shadow.
- Artifact hosting: `.bin` is not a served type, so mesh binaries are packed into their JSON as base64 at build.

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

```bash
node tools/sim-run.mjs --seeds 30
```

The first runs the unit tests (F1–F7 and F11 worked examples, determinism by hash, the join-in guest leaving the
opposing Rival's AI bit-identical, Old Gang Nerves, the arbiter's flash and hit-stop caps) and the smoke bots on
3 seeds. The second prints fight lengths per scenario (skilled, median-policy, scripted-Daifuku and passive bots)
against the GDD's F9 figures and exits non-zero if a bot misses its expectation (`--only <id>`, `--json out.json`).

## Status

- **M0 look-dev:** concluded on the studio side — three review iterations (art + creative director): final
  verdict **GO WITH FIXES (carried into M1)**; overall 7/10 vs the style reference, 7.5/10 vs preview 01
  (`production/qa/evidence/artifact-slice/M0/review-final.md`). Published as the Cat RPG Showcase artifact
  (https://claude.ai/artifact/MBsJLyudNiAdVyUu9BhpD6). **Awaiting the owner's go/no-go before M1.**

## Findings

- M0 (provisional): the "ink what acts, paint what stays" split works in three.js — SDF-built skinned cats
  with a two-tone toon ramp and an output-scaled inverted-hull ink line; environments shaded from textures
  baked out of the preview kit, coloured shadows, card foliage, animated leaf-light and a paint post-process.
  All 8 orbit angles read as painted. Open: white cats on the lighter (reference-matched) ground miss the
  E-5 contrast target (13–18 L* vs 20); readability currently rests on the ink line and contact shadow.
- Artifact hosting: `.bin` is not a served type, so mesh binaries are packed into their JSON as base64 at build.

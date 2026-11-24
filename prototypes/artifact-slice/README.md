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

## Status

- **M0 look-dev:** in progress — two review iterations done (art + creative director: GO WITH FIXES, fixes
  applied); awaiting the final director check and the owner's go/no-go.

## Findings

- M0 (provisional): the "ink what acts, paint what stays" split works in three.js — SDF-built skinned cats
  with a two-tone toon ramp and an output-scaled inverted-hull ink line; environments shaded from textures
  baked out of the preview kit, coloured shadows, card foliage, animated leaf-light and a paint post-process.
  All 8 orbit angles read as painted. Open: white cats on the lighter (reference-matched) ground miss the
  E-5 contrast target (13–18 L* vs 20); readability currently rests on the ink line and contact shadow.
- Artifact hosting: `.bin` is not a served type, so mesh binaries are packed into their JSON as base64 at build.

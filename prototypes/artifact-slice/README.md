# Cat RPG browser showcase slice (prototype)

PROTOTYPE - NOT FOR PRODUCTION. Throwaway three.js r160.1 build for `production/artifact-slice/IMPLEMENTATION-PLAN.md`.

## Hypothesis (M0, look-dev spike)

A code-authored 3D world can hit the art target, a lush 2D painted anime background with cel characters on top
(reference-close; frame `design/previews/01-exploration.png`), under a free, rotatable third-person camera.
GO / GO with fixes / pivot is decided by the art and creative directors, then the user, from the M0 evidence.

**Status:** in progress (M0). Environment half built; cats are built in parallel under `src/render/cats/`.

## Run

```
npm install                       # esbuild, pngjs, three (dev stand-in for the CDN copy)
node tools/bake-textures.mjs      # design/previews/kit/kit.js -> assets/tex/*.webp (Playwright)
node tools/build.mjs              # src/entries/*.js -> dist/
node tools/serve.mjs              # http://localhost:5173/  (dist/dev.html)
node tools/m0-shots.mjs           # evidence -> production/qa/evidence/artifact-slice/M0/env/
node tools/shot.mjs 'dist/dev.html?view=01&phase=dusk&test=1' out.png
```

Controls: drag (or double-click for pointer lock) to orbit, wheel to zoom, WASD to walk Mikan (Shift faster),
1 / 2 Day / Dusk, O toggles the paint post. Query params: `phase=day|dusk`, `view=01`, `orbit=0..7`, `test=1`,
`post=0`, `res=0.85`, `mask=cats|shade|albedo`, `card=1`.

## Environment method (M0)

- **Layout** in `src/world/lane.json`, built by `src/world/builder.js` (merged per material, hand-wobble vertex
  noise, collision boxes; a seeded lower town on the slope).
- **Paint** is the preview kit baked to WebP by `tools/bake-textures.mjs` (`tools/bake/tex-defs.js`): wall, fence,
  ground, garden, roof, house, window, notice, foliage and hydrangea clumps, grass, cumulus, hill rings, town strip, sea.
- **Shading** (`src/render/env.js`): display-space (sRGB) maths like the kit's multiply layers; soft 2-band sun ramp;
  shade = albedo × mix(1, phase shadow colour, k) (never grey); a lift on shaded upright planes with a warm lane
  bounce at their foot; a 2048² sun shadow with a rotated 12-tap wide kernel (soft painted edges); haze to the horizon.
- **Foliage** is instanced camera-facing clump cards with sphere-projected normals, so each clump shades as one
  painted mass from any angle, and casts dappled shadow.
- **Sky** is a dome with the kit's gradient laid over 0–22° plus brush, cumulus cards on a ring, two hill rings, a sea
  ring and a town strip that sit "at infinity" (follow the camera).
- **Paint post** (`src/render/post.js`): noise-displaced lookup (edge wobble), 4-sector Kuwahara, paper grain; writes
  depth so the inked layer (cats, the stone-lantern Scent Post, wires) draws crisp after it.
- **Camera** (`src/camera/rig.js`): Explore values from `design/gdd/camera-system.md` (3.0 m, +10°, vFOV 45°,
  pitch −10°..+55°), five-ray collision, snap in / 0.4 s ease out; camera-soft props dither to 30%.

## Findings

Evidence: `production/qa/evidence/artifact-slice/M0/env/README.md` (comparison sheets, orbit sheets, pixel checks,
draw calls and texture budget). Environment observations after 8 look passes (for the directors' review, not a verdict):

- **Reads as painted:** sky gradient and cumulus, gouache foliage masses, plaster and board textures, coloured
  (wisteria / plum) soft-edged shadows with leaf-edged borders, haze to the sea; every orbit angle is a painted surface.
  Dusk is the strongest frame.
- **Still reads as 3D:** straight box silhouettes of houses and roofs at mid distance, roof tiles as stripes, the
  dithered Scent Post when the camera stands beside it, large untextured-looking plaster spans in side views.
- **Gaps against 01:** the lit lane is greyer than 01's cream (darkened on purpose to keep walkable ground at
  L* ≤ 80 and E-5 ≥ 20); less foliage lushness; smaller cumulus.
- **Measured:** 62 draw calls, 66k triangles, ≈ 107 MB GPU texture estimate, 0.75 MB of baked WebP; E-5 misses by
  1–2 L* at the Explore orbit; the cat line at 85% render scale measures 1.44 px (cat module).

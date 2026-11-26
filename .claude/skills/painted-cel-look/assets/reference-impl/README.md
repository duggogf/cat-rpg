# Reference implementation (verbatim copies)

Copied on 2026-11-26 from the Cat RPG showcase prototype (three.js 0.160.1). Prototype code — study and
adapt; do not import these files directly. Some import siblings that are not copied (e.g. `face-decals.js`
imports `INK` and the cast styles from `../casts.js`; `painted-environment.js` imports `./phases.js`, here
`phase-keys.js`).

| File | From | What it shows |
|---|---|---|
| `cel-character-shaders.js` | `prototypes/artifact-slice/src/render/cats/shaders.js` | two-tone fill, face/eye decals, clip-space ink hull, contact blob |
| `painted-environment.js` | `src/render/env.js` | env ramp + coloured PCF shadow + bounce + haze, foliage cards + leaf-light, sky dome, backdrop rings, inked props, sun shadow pass |
| `paint-post.js` | `src/render/post.js` | wobble + Kuwahara + grain post that writes depth |
| `phase-keys.js` | `src/render/phases.js` | Day/Dusk keys, phase blending, raw sRGB helper |
| `cel-character-runtime.js` | `src/render/cats/cat.js` | material setup, outline width per frame, eye turning, LOD, lighting hook |
| `face-decals.js` | `src/render/cats/face.js` | canvas-drawn face and per-eye atlases |
| `sdf-primitives.js` | `tools/cats/sdf.js` | SDF primitives and smooth union for character modelling |
| `svg-paint-filters.js`, `svg-paint-helpers.js` | `design/previews/kit/kit.js` (excerpts) | SVG paint filters and surface/foliage painting helpers |

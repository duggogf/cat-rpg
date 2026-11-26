# Painted environment textures

The painted world gets its look from **painted albedo**, not from lighting tricks. We paint textures as SVG
with a small kit of filters, then bake them to WebP with headless Chromium. The same kit draws the static
preview mock-ups, so mocks and the 3D build share one hand.

Sources: `design/previews/kit/kit.js` (helpers + filters; excerpts in
`assets/reference-impl/svg-paint-filters.js`, `svg-paint-helpers.js`), texture definitions
`prototypes/artifact-slice/tools/bake/tex-defs.js`, baker `tools/bake-textures.mjs`.

## The filter kit

All are SVG filters with `color-interpolation-filters="sRGB"`:

| Filter | Recipe | Use |
|---|---|---|
| `k-rough` | fractalNoise f 0.022, 2 oct, displacement 6 | hand-wobbled edges on every flat shape |
| `k-wobble` | f 0.008, displacement 14 | big, slow wobble (hill lines, roof ridges) |
| `k-leaf` / `-fine` / `-far` | f 0.038 / 0.075 / 0.02, displacement 26 / 13 / 16 (+0.8 blur far) | foliage clump edges |
| `k-soft`, `k-soft2`, `k-soft3` | Gaussian blur 5 / 16 / 42 | stains, glows, grime, cast-shadow washes |
| `k-grain` | fractalNoise f 0.9 → colour-matrix to a faint violet-grey alpha | paper grain |
| `k-brush`, `k-brush-v` | anisotropic noise (0.004×0.09 / 0.07×0.005) | horizontal / vertical brush streaks |
| `k-mottle`, `k-mottle-light` | low-frequency noise, 4 oct | dark / light mottling of large surfaces |
| `k-dry` | displacement 5 | dry-brush edges |

## How a surface is painted (`K.surface`)

1. Flat base colour clipped to the quad.
2. A vertical gradient: lighter at the top, warmer/darker at the foot.
3. Overlays: the chosen texture (brush/mottle) at low opacity, `mottle-light` 35%, grain 16%.
4. Grime: a soft wisteria-brown band at the foot, **multiply** blend.
5. Hand-placed details: soft stains (blurred rectangles), rain streaks as hard-edged flat value shapes
   under the coping (not vertical brush), moss dots with `k-leaf-fine`, a light coping edge with `k-rough`.

Foliage clumps: three to four stacked flat blobs (shade, mid, light top, small highlights), each with a leaf
displacement filter, top-lit. Clouds: tall cumulus of flat blobs, white light / `#C9D8F0` shade, so the
3D shader can remap those two values onto the phase's cloud colours.

## Rules

- **Albedo only.** Keep baked lighting gentle: top-light in foliage and clouds is wanted; cast shadows are
  never baked (the 3D sun does them, coloured).
- No photo sources, no PBR maps, no ink lines anywhere in an environment texture.
- Texel density targets: ground band (0–1.2 m) 512 px/m, walls above 256 px/m, roofs 128 px/m — spend
  detail where the low camera looks.
- Writing in the world is invented "scribble" glyphs, not a real language (keeps the world wordless and
  avoids localisation).
- Alpha textures are uploaded premultiplied; colour under alpha 0 doesn't matter.
- Break repetition in-shader (world-scale macro variation), not by painting bigger textures.
- Backdrop strips (hills, far town, sea) are wide alpha strips (4096×128–1024) on cylindrical rings. A
  strip that wraps a full 360° must **paint its content past both edges** (draw the last hill again
  before x = 0 and after x = W) — displacement filters pull transparent pixels in at the edges and leave a
  visible seam otherwise. Or keep strips to < 360° arcs and hide the ends behind nearer scenery.

## Baking

```bash
node tools/bake-textures.mjs            # all → assets/tex/<name>.webp + manifest.json
node tools/bake-textures.mjs wall fence # just these
```
The baker loads the kit + definitions in Chromium, sets the viewport to each texture's exact size, takes a
transparent screenshot and encodes WebP in-page. Every definition returns an SVG string of exactly `{w,h}`.

For Unreal or another engine, the same baked PNG/WebP files are valid source textures; or repaint in a
2D tool using the same layer stack (flat shape → wobble → gradient → brush/mottle → grain → multiply grime).

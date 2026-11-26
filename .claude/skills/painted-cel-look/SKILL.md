---
name: painted-cel-look
description: Recipe for the "2D anime you can walk around in" look — flat two-tone cel characters with a thin even ink line over soft, unlined, painterly 3D environments with a gradient sky, coloured shadows and a paint post-process — as built and owner-approved on Cat RPG. Use it whenever you build, extend, review or port this look in any engine (three.js/WebGL prototype, Unreal, Godot, Unity), make a new character, prop, environment, sky, VFX or preview mock in it, write a toon/cel/outline/painterly shader, or when someone asks for a cel-shaded, anime-background, hand-painted, "Japanese cartoon", Ghibli-ish or TV-anime style 3D scene — even if they don't name this skill.
argument-hint: "[what to build or review in the look]"
user-invocable: true
model: opus
---

# Painted-cel look

**A 2D anime cartoon you can walk around in.** Characters are 3D meshes made to read as flat 2D cels with
a thin even ink line; the world is 3D geometry painted and lit to read as a soft 2D anime background. The
camera is free (third person, any angle), so the trick must hold from every direction — that is the hard
part, and most of this skill exists to make it hold.

The look was developed on Cat RPG (art bible: `design/art/art-bible.md`; working three.js build:
`prototypes/artifact-slice/`) and approved by the owner: "it looks perfect". Match the *rendering
technique*, not any reference game's characters, places or compositions — those stay original.

## The one rule: ink what acts, paint what stays

Everything that moves, fights, can be knocked over, or can be interacted with is a **flat two-tone cel
with an ink line**. Static signage and set dressing a character can't affect is paint. Everything that stays put is a **soft, unlined painting**. When unsure about any
object, ask which of the two it is. This is the oldest tell of hand-made TV anime (the thing about to move
is visibly a cel over a painted background), and it doubles as affordance: an inked bucket on a painted
wall is obviously the bucket you can knock off.

Consequences you must keep:
- No full-screen edge-detect outline pass — it would ink the environment and break the rule. Lines come
  from per-object inverted hulls only.
- Characters render **after** the paint post, so the painterly filter never smears a cel.
- Coat patches and patterns are borderless flat shapes — never an ink line around a colour patch.

## The pipeline (render order)

1. **Sun shadow map** (environment casters only; foliage cards cast with a moving noise "leaf-light" mask).
2. **Environment pass → offscreen target with depth.** Sky dome, parallax backdrop cards, painted
   meshes, camera-facing foliage cards. All unlined.
3. **Paint post** (full-screen): low-frequency noise wobble of the lookup → 4-sector Kuwahara (radius 2)
   → paper grain; it **writes the displaced depth back** so later passes still sort against the world.
4. **Late pass (cels):** characters, interactive props, VFX drawings — two-tone fill + inverted-hull ink
   line + soft contact blob. Drawn crisp over the painting.
5. **UI** in screen space (warm cream panels, rounded "bean" shapes).

Colours are handled as **raw sRGB numbers end to end** — no colour-space conversion, no tone mapping, no
auto-exposure, no bloom on cels — so a palette hex arrives on screen unchanged (target ΔE2000 ≤ 2–3).
This matters more than it sounds: tone mapping silently desaturates the whole palette and the look dies.

## Characters (cels)

- **Two tones only, hard terminator.** `ndl = dot(N_smooth, keyDir)`; shade = `1 - smoothstep(t-aa, t+aa, ndl)`
  with `t = -0.06` and `aa = fwidth(ndl)*0.75` (one-pixel antialias, still hard). Shade covers **15–25%**
  of the visible character, measured from the gameplay camera (behind, slightly above) in the day key —
  the reference is *nearly* flat. More shade looks 3D/CG. Expect ±5 points across orbit angles; tune `t`
  per phase rather than chasing every angle.
- **The character key is world-fixed and mostly overhead** (day ≈ (−0.35, 0.91, 0.24), dusk ≈ (0.45, 0.80,
  0.30)). Because it is high, the terminator falls under the belly, chin and tail, so the shade share stays
  stable from every orbit angle and the face is lit front-on. Don't make it camera-relative — cels would
  "swim" as the camera turns.
- **Shade is lavender, never grey.** At runtime the shade is a multiply: `lit = mix(1, keyColor, 0.5)`,
  `shade = mix(1, phaseShadeColor, 0.26) * 0.96 * lit` — one tint for the whole character, which keeps
  every coat colour in the same family. For hand-authored assets (2D mocks, painted UI portraits) author
  the shade per colour instead: hue +8–15° toward violet, saturation +5–10, value −18–24, whites →
  `#D8D2EA`. Both give the same read; use the multiply in 3D.
- **Characters have their own key light**, decoupled from the sun, and never receive the shadow map
  (no shadow-map stripes on a cel). The design calls for a *zone tint* — the whole cel steps into shade
  together when its root is in environment shadow (e.g. a CPU ray toward the sun, then lerp the lit tone
  ~45% toward the phase shadow tint over ~0.2 s). The Cat RPG prototype did not implement it yet; treat
  values as a starting point.
- **Ink line:** inverted hull, back faces pushed out along *smoothed* normals **in clip space**, so the width
  is a constant number of render-target pixels at any distance: silhouette ≈ 2.0–2.5 px at 1080p, interior
  ≈ 1.25 px, scaled by `rtHeight/1080` (so 720p expects ≈ 1.3–1.7 px). Single flat colour **Aubergine Ink `#33273B`** (a warm near-black;
  never pure black, never lit). Below ~4% of screen height drop to 1 px and kill interior lines.
- **Interior overlap lines** (a leg crossing the body) come for free if the legs are a *separate shell*
  with their own hull; pull the hull a little toward the eye by local thickness so it shows on overlaps.
- **Contact blob** under every cel *and* every inked prop: feathered ellipse, Shadow Wisteria at ~45%.
- **Inked props** (hard-edged boxes, buckets) need hull normals that don't split at corners: use the
  direction from the prop's centre (y scaled ×1.4) as the "smooth normal" for the hull.
- **Faces are flat decals**, not geometry: nose/mouth card projected along the head's +Z; each eye its own
  planar decal on its own axis (so eyes turn to camera on a 3/4 view). Eye = coloured disc, ink pupil, one
  hard white highlight, ink rim. Expressions/blinks are atlas frames. No side-profile face swap — the decal
  approach reads from every angle.
- **Stepped animation:** actions, VFX and comedy takes on twos (12 poses/s); locomotion and camera stay
  smooth on ones. Step on simulation time so hit-stop lengthens holds instead of strobing.
- **Near the camera, dither — never hide.** 4×4 Bayer discard down to ~30% coverage for anything the lens
  passes through (props, foliage cards, cels). Hiding pops; dithering reads as a painted veil.

Shape language: bodies are **beans** (soft asymmetric capsules), heads **chestnuts** (round, slightly wider
low), accents **poms**, ears/claws/danger **wedges**. No straight lines on a character; at most one sharp
point per feature. See `references/characters.md` for the SDF modelling method and the anatomy lessons the
owner taught us the hard way — read it before shaping any character.

## Environments (paint)

- **Painted albedo carries the light.** Textures are painted (we bake them from SVG paintings: flat
  shapes + turbulence-displacement filters + mottle/brush/grain overlays), with a gentle top-light and no
  baked cast shadows. No PBR roughness/metal look, no photo sources, no outlines.
- **Soft 2-band sun ramp:** `ramp = smoothstep(-0.04, 0.16, ndl)` (soft terminator ≈ 10–15% of the ramp).
- **Shadows are coloured** — `albedo × mix(1, phaseShadowTint, ~0.6)`, a wisteria/violet in day, plum at
  dusk. Never grey or black. Soft PCF (12-tap rotated Poisson disc) so shadow edges read as a painted edge.
- **Painter's cheats:** warm **bounce** off the lit ground into the foot of shaded walls; **vertical lift**
  (shaded upright planes lifted toward white — sky fill); upright planes at grazing sun stay one flat tone
  (no soft banding); world-scale macro variation breaks trim-sheet repeats; **haze** to a horizon colour by
  distance.
- **Foliage = instanced camera-facing cards** with painted clumps; normals are *sphere-projected from the
  clump centre*, so a tree shades as one painted mass from any angle. Gentle wind sway. The shadow pass
  uses a drifting noise mask for animated **leaf-light** under a high sun only.
- **Sky = painted dome + 2–3 parallax backdrop rings** (hills, sea, far town) + drifting cloud cards. The
  gradient: horizon → mid (72% toward horizon) → zenith → a slightly deeper top, over 0–22° elevation, with
  a subtle brush texture and a sun glow. Sky should be visible in ≥ 30% of level exploration frames (a low camera looking down at
  the character shows only a strip; that's fine — check it with a level camera). Any texture wrapped around
  360° must repeat a **whole number** of times or it seams at the back (the prototype's `az * 0.6` brush
  lookup has this seam — use e.g. `az / (2π) * 3`), and painted 360° strips must wrap their content past
  both edges before the displacement filters run.
- **Paint post** on the environment only: noise wobble (~1.8 px), Kuwahara 4-sector r=2 (turns texture
  into flat daubs and softens 3D edges into paint edges), paper grain ~10%. Planes flagged "upright"
  (via alpha) skip Kuwahara to keep crisp plaster/board accents.
- **Value bands:** walkable ground stays inside L* 35–80 with low local contrast; cels own the extremes
  (near-white coats and the ink). This is why characters read on any ground — the **ink line carries
  separation**, not the coat colour.
- **Saturation ceilings:** painted backgrounds ≤ 70% HSV, sky ≤ 75%; cels, VFX, hero objects up to 90%.

## Time of day = a phase key

One data object per phase drives everything: sky zenith/horizon, sun elevation/azimuth, key colour,
shadow tint and strength, bounce, haze, cloud light/shade, backdrop key, sun glow, the character key
direction/colour/shade. Blend phases by lerping the whole object in sRGB. Day and Dusk values are in
`references/palette-and-values.md`.

## VFX (cels too)

Every effect is a **drawing**: hard-edged, 2–3 flat tones (cream core, one colour, ink edge), on twos,
3–8 drawings long. No soft particles, additive glow, gradients or alpha fades — effects end by breaking
into wedges/dots or a halftone dissolve. Impact frames are limited-palette inversions matched to the
frame's mean luminance (flash safety), not raw negatives. Details: `references/vfx-and-ui.md`.

## How to work in this look (process)

1. **Start from working code**, don't re-derive. For a new web scene, copy `assets/starter-scene/` (a small
   self-contained scene in the look: fox, bench, bus stop, dusk — runs from a CDN, screenshots itself).
   `assets/reference-impl/` holds the exact approved Cat RPG shaders (three.js/GLSL; prototype code,
   rewrite for production). Read `references/threejs-recipe.md` for how they fit together.
2. **Pin the palette first** (`references/palette-and-values.md`); keep colours raw sRGB.
3. **Build a look-dev scene** before content: one short street with sky, wall, fence, foliage, one cel
   character and one inked prop, in two phase keys.
4. **Capture an orbit** (8 yaw angles at the gameplay camera distance ≈ 3–4 m, pitch −10°, +10° and
   +55°, FOV ≈ 50–60°; plus a level shot with the camera raised to look over the scene) — the look must hold
   from every angle. Use headless Chromium + SwiftShader for WebGL screenshots.
5. **Review with an art director pass** on each capture: line width (measure px), shade share, any grey
   shadow, any ink on the environment, any soft glow on a cel, character/ground separation, sky visible.
   For characters, review *anatomy and appeal*, not a literal match to a turnaround (see characters.md).
6. **Show the owner screenshots, not descriptions.** Iterate at most ~3 rounds; then list the remaining
   improvements with scores instead of looping.

## Quick self-check (run before showing anything)

- [ ] Every interactive thing is inked; nothing static is inked.
- [ ] Line is one flat `#33273B`, ~2–2.5 px at 1080p regardless of distance; no hairlines up close, no blobs far away.
- [ ] Cels: exactly two tones, hard terminator, shade 15–25%, no rim light, no specular, no glow.
- [ ] No grey or black shadow anywhere — all shade is violet/lavender/plum family.
- [ ] Palette swatches sample within ΔE ≈ 3 of their hex (no tone mapping drift).
- [ ] Environment looks painted (wobble + daubs + grain), with soft shadow edges and haze.
- [ ] Near-camera geometry dithers, never pops.
- [ ] Sky gradient visible, no seams from any orbit angle.
- [ ] Characters read off the ground by their line + contact blob in every phase.

Report each item as pass, fail, or **NOT ASSESSED** (with the reason, e.g. "no screenshot could be
captured", "night phase not built"). An item you could not look at is not a pass — a look you have not seen
rendered has not been checked.

## Reference files

- `references/threejs-recipe.md` — render passes, materials, uniforms, and how the reference implementation wires up.
- `references/palette-and-values.md` — the 12-colour palette, tone rules, phase keys (Day, Dusk), numeric constants.
- `references/characters.md` — SDF bean/chestnut modelling, rig, face decals, and the owner's anatomy corrections.
- `references/painted-textures.md` — painting environment textures in SVG and baking them.
- `references/vfx-and-ui.md` — the drawn VFX language, impact frames, flash safety, warm UI.
- `references/unreal-port.md` — mapping each piece to Unreal Engine 5.x (candidates to verify, not facts).
- `assets/reference-impl/` — the approved shader and helper source files, copied verbatim from the prototype.
- `assets/starter-scene/` — a runnable, project-neutral starter scene built from this skill (see its README).

# Porting to Unreal Engine 5.x

**Status: candidates, not verified facts.** The look was proven in three.js only. Each row below names a
plausible Unreal approach; verify every API and setting against the project's pinned engine reference
(`docs/engine-reference/unreal/`) before relying on it, and record the chosen method in an ADR. If a
technique has not been tried in-engine, report it as NOT ASSESSED rather than as working.

| Piece (three.js) | Requirement | Candidate UE approach | Fallback | Pass test |
|---|---|---|---|---|
| Cel fill (two tones, hard terminator, own key light) | R-1 | Unlit/emissive material computing the two-tone band from a key-direction parameter (material parameter collection per phase) | Post-process cel pass masked by custom depth/stencil on characters | Day capture: shade 15–25%, hard edge, no third tone |
| Inverted-hull ink, constant px width | R-2 | Second mesh section/material with front-face culling, vertex offset along baked smoothed normals in clip space scaled by view size (world position offset with a screen-space width) | Post-process outline restricted to the character stencil | 2.0 ± 0.5 px at 1080p and at 85% screen percentage; no line on environment |
| Painted environment (ramp, coloured shadow, bounce, haze) | R-3 | Unlit materials sampling painted albedo, sun direction and shadow tint from a parameter collection; no dependence on Lumen GI/reflections for the look | Lit with a custom shading model if shadows from the engine's sun are needed — then tint shadows in post | Shadow pixels hue-check, never grey |
| Sun shadows (soft, coloured) | E-1 | Engine shadow maps sampled into the unlit material are not directly exposed — likely a lit material or a post-process shadow tint driven by a shadow mask | Light functions / baked shadow textures for static sets | Soft painted edge, coloured |
| Foliage cards | — | Camera-facing card meshes (material billboard / WPO), sphere-projected normals from the clump centre | Hand-authored normals | Clump shades as one mass from all angles |
| Sky dome + backdrop rings | R-4 | Unlit sky-sphere mesh with the gradient material, plus cylindrical backdrop meshes; no physical sky/atmosphere | — | No seams on a 360° orbit |
| Paint post (wobble, Kuwahara, grain) | — | Post-process material before tonemapping-free output; must exclude characters (custom depth/stencil mask) | Apply to a scene capture of environment-only layers | Characters stay crisp; env reads painted |
| No tone mapping drift | R-6 | Disable/neutralise tonemapper, auto-exposure, bloom, motion blur, film grain for the look (check how the pinned version exposes this) | Inverse-tonemap in materials | Palette swatches ΔE ≤ 3 |
| Dither fade | — | Masked material with dither temporal-AA-safe pattern, or opacity mask with a Bayer texture | — | No popping near camera |
| Stepped animation | E-9 | Animation sampled on twos via a stepped pose node/update rate; write zero motion vectors on holds | — | No ghosting under the chosen AA/upscaler |

Notes:
- TAA/TSR ghosting is the main risk for stepped animation and the paint wobble — test with the chosen
  anti-aliasing early.
- Substrate is on by default in new 5.7+ projects; confirm unlit/custom materials behave as expected under it.
- Keep colours as authored sRGB values in parameter collections; check the swatch ΔE in captures.

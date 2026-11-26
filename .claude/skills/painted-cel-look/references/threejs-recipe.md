# three.js / WebGL recipe

The approved implementation, file by file. Source copies are in `../assets/reference-impl/` (verbatim
from `prototypes/artifact-slice/src/render/`, three.js 0.160.1). They are prototype code: lift the
technique, rewrite to your project's standards.

## Contents
1. Renderer setup
2. Frame order
3. Character cel material (`cel-character-shaders.js`)
4. Ink hull
5. Environment materials (`painted-environment.js`)
6. Foliage cards and leaf-light
7. Sky dome and backdrop rings
8. Paint post (`paint-post.js`)
9. Dither fade
10. Screenshots and checks

## 1. Renderer setup

- `renderer.outputColorSpace` left so that shaders write raw sRGB; custom `ShaderMaterial`s **omit** the
  colorspace and tonemapping chunks. Textures: `colorSpace = THREE.NoColorSpace`. Uniform colours via a
  raw hex→vec3 helper (`rgb()` in `phase-keys.js`), never `THREE.Color` with colour management.
- No tone mapping, no bloom, no SSAO, no physical lights. Lighting is computed in-shader from uniforms.
- Antialias on; render at device pixel ratio but compute line widths from the *render-target* height.

## 2. Frame order

```js
shadow.update(renderer, [envScene], casters);          // sun depth, env casters only
renderer.setRenderTarget(post.rt); renderer.clear();
renderer.render(envScene, cam);                         // sky, backdrops, painted meshes, foliage cards
post.render(renderer);                                  // wobble + Kuwahara + grain → screen, writes depth
renderer.autoClear = false;
renderer.render(lateScene, cam);                        // cats, inked props, VFX: crisp, depth-tested
renderer.autoClear = true;
```

The post writes `gl_FragDepth` from the env depth texture (looked up at the *displaced* UV), with
`depthFunc = AlwaysDepth`, so cels drawn after still hide behind walls.

## 3. Character cel material

`fillFrag()` in `cel-character-shaders.js`:
- Normals: a baked **smoothed normal** attribute (`snormal`, the SDF gradient) skinned with the mesh —
  smooth normals give one clean terminator instead of faceted patches.
- `vec3 col = base * mix(uLitMul, uShadeMul, sh)`, with `sh` the hard antialiased step. `uLitMul` = white
  lerped 50% to the phase key colour; `uShadeMul` = white lerped 26% to the shade colour × 0.96 × lit.
- Coat patterns are procedural functions of rest-pose position per part (`part` attribute: body, head,
  tail, collar, bell, legs) — borderless flat shapes.
- An authored contact shade: the head's shadow on the chest as a fixed ellipse (kit drawings do this).
- Toe splits: two short ink lines on the front of each paw, drawn in the fill shader.
- Face decals: see `characters.md`.
- Silhouette mode (`uSil`): solid colour, used for undiscovered characters on menus.

## 4. Ink hull

`hullVert`: second draw of the same skinned mesh with `side: BackSide`. In clip space:
```glsl
vec2 sd = normalize((projectionMatrix * vec4(viewNormal, 0.0)).xy * uRes);
clip.xy += sd * (widthPx * 2.0 / uRes) * clip.w;
```
`widthPx = uLinePx * uPartLine[part]` (per-part multipliers), `uLinePx` scaled by `rtHeight/1080`.
Interior lines: pull the hull toward the eye by `min((thick - 0.03) * uPull, max)` so a thick part's hull
shows where it overlaps another. Fragment: flat `uInk`. For static props use `hullMat()` in
`painted-environment.js` (same idea, plus a tiny `+0.0004*w` depth push).

Team/side colour (gameplay): swap the hull colour (allies Bell-Gold, enemies red) — the line is the cheapest
readable channel and stays in the style.

## 5. Environment materials

`envMat(o)` + `LIGHT_PARS.envShade()`:
```glsl
float ramp = smoothstep(-0.04, 0.16, dot(n, sunDir));
float lit  = ramp * sunShadow(p, n, soft);           // 12-tap rotated Poisson PCF
vec3 sm    = mix(shadeMul, vec3(1), vertLift * vert * ...);   // sky fill on upright planes
vec3 light = mix(sm + bounce * vert * footFalloff, keyColor, lit);
col = hazeIt(alb * light, p);
```
- `shadeMul = mix(1, shadowTint, shadeK)`; `bounce = bounceColor * bounceK`.
- Upright planes get a hardened shadow (`smoothstep(0.32,0.68,sh)`) and grazing-sun planes stay flat.
- Albedo × grain (triplanar-ish lookup) × world-scale macro variation.
- Cloth: two-sided lighting (`abs(ndl)*0.8+0.1`) and vertex flutter.
- Windows/lamps get a phase-driven glow (dusk).
- `alpha < 0.75` written by upright plaster/board planes tells the post to skip Kuwahara there.
- Debug modes: shade mask and albedo-only, for checking shade share and coloured shadows.

## 6. Foliage cards and leaf-light

`billboards(items, atlas, o)`: instanced quads, each `{pos, size, rot, cell, bright, clump:[x,y,z,r]}`.
- Spherical (canopy) or cylindrical (grass, shrubs; Y-up) facing.
- Normal = `(worldPos - clumpCentre)/r + forward*0.35`: the whole clump shades as one mass.
- Softer ramp (`rampLo -0.35, rampHi 0.45`), shade lifted 18% toward white.
- Wind: phase-offset sine sway scaled by height in the clump.
- Shadow pass uses `BB_DEPTH_FRAG`: a drifting value-noise mask punches holes → animated dappled
  leaf-light; gated by sun elevation (`smoothstep(0.3,0.7,sunDir.y)`) so a low dusk sun throws long solid
  shadows instead of camouflage.

## 7. Sky dome and backdrop rings

`skyDome(brushTex)`: BackSide sphere r=1000, `renderOrder -10`, no depth write. Gradient by elevation
(see SKILL.md), brush texture ×(1±18%), sun glow `pow(g,6)*0.6 + pow(g,40)*0.4`, an optional bright
"sea gap" glow in one azimuth.
`ringGeometry(r, a0, a1, y0, y1)` + `backdropMat(map, {haze, cloud})`: cylindrical painted strips for hills,
far town, sea; the cloud mode remaps a painted day cloud's values onto the phase's cloud light/shade
colours. Add 2–3 rings at different radii for parallax.

## 8. Paint post

`PaintPost` (80 lines): render target with depth texture; full-screen quad:
1. `uv += (noise(q/260)*1.6 + noise(q/70)*0.7) * wob * px` — wobble, `wob ≈ 1.8`.
2. Kuwahara 4 sectors of 2×2 (radius 2), choose the lowest-variance mean.
3. `col *= mix(1, grain/0.83, 0.1)` paper grain (tiling 512 px texture in screen space).
4. Optional "sense" desaturation toward lavender-grey for a special vision mode (cats stay full colour).
5. `gl_FragDepth = depth(uv)`.
Scale the kernel with `max(1, h/1080)`. On fast camera motion, ease the wobble down — wobble + motion
reads as ghosting.

## 9. Dither fade

```glsl
float bayer4(vec2 p){ ivec2 i = ivec2(mod(p,4.0)); int b[16]=int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5);
  return (float(b[i.y*4+i.x]) + 0.5) / 16.0; }
if (fade < 0.999 && bayer4(gl_FragCoord.xy) > fade) discard;
```
Apply to fill *and* hull. Floor at ~0.3 for camera-near objects.

## 10. Screenshots and checks

- Headless Chromium launch args: `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`.
- Expose `window.__ready` and deterministic hooks (`setPhase`, `teleport`, `step`) so a script can stage
  identical shots every run.
- Pixel checks worth automating: line width in px at the silhouette, shade share on a character mask,
  shadow pixels' hue (not grey), palette swatch ΔE, character-vs-ground L* contrast.
- Interpolate the controlled character between fixed sim ticks; drawing raw 60 Hz steps double-images on
  high-refresh monitors and the paint post makes it look like smearing.

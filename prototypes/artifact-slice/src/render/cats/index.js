// PROTOTYPE - NOT FOR PRODUCTION
// Cat module — CONTRACT between the cat builder (owns src/render/cats/, src/anim/,
// tools/cats/, tools/bake-meshes.mjs, assets/mesh/) and the environment builder
// (owns everything else, imports only this file).
//
//   await loadCatAssets(baseUrl)           -> resolves when meshes/atlases are loaded ('' = same folder)
//                                             fetches `${baseUrl}mesh/<cast>.json|.bin` (build copies assets/mesh -> dist/mesh)
//   createCat({ cast, scale })              -> Cat
//       cast:  'mikan' | 'wallSitter' | 'hige' | 'pon' | 'kinako' | 'togemaru' | 'kagi' | 'daifuku' | 'tough'
//              'tough' takes extra options (all optional; ADDITIONS, same signature):
//                coat (COATS key | hex | {base, white, patch, patch2}), pattern (solid|bicolour|tabby|patched|
//                pointed|tuxedo|saddle), tail (whip|plume|ringed|stub), ears (standard|tall|round),
//                build (round|standard|long), eye, expr (neutral|smug|angry|happy|sleepy|shock),
//                personality (braggart|stalwart|goofball|schemer|brooder|fraidy) or carry, rank, seed
//              Rank scale (Captain 1.15, Daifuku 1.6, Pon 0.9) multiplies on top of `scale`.
//       scale: world scale multiplier (art bible: 1.25 x real cat size; 1.0 = real size)
//   Cat.object3D                            THREE.Object3D, origin at the feet, faces +Z
//   Cat.update(dt)                          advance animation (dt in seconds, sim time)
//   Cat.setGait(name, speed)                'idle' | 'walk' (speed in m/s, drives cadence)
//   Cat.setLighting({ keyDir, keyColor, shadeColor, rimColor })
//                                           keyDir: THREE.Vector3 (world, towards light);
//                                           colours: THREE.Color. Called on phase change.
//   Cat.setOutlineScale(k)                  1 = art-bible line weight; for tests
//   Cat.setLod('auto'|'full'|'low')         (ADDITION) LOD: auto = full mesh above 18% of screen height,
//                                           ≈ 7k-tri mesh below 15%; also createCat({ lod }). Use 'full' for the
//                                           controlled cat. Cat.lod (0/1) and Cat.triangles (per pass) read it.
//                                           A shell named 'keyline-rim' in the cat's subtree is hidden below 5%.
//   Cat.lookAt(worldPos | null)             (M0 fix pass ADDITION) head turns toward a THREE.Vector3 in world
//                                           space, clamped ±70°; null = back to idle glances
//   Cat.setPosture(name | null)             (M3 ADDITION) posture override, e.g. 'routed' at a Verdict (low, ears flat back)
//   Cat.bones                               (M3 ADDITION) the skeleton by bone name (read-only; for marks on the model)
//   Cat.dispose()
//
// Characters receive NO shadow map; the cat draws its own soft contact blob.
// Implementation: SDF-baked skinned mesh, cel fill + inverted-hull ink (see cat.js).
// Render notes for integrators: the cat shaders write raw sRGB (keep renderer.toneMapping =
// NoToneMapping for the cat pass) and size the line from the CURRENT render target height.
import { loadCatAssets as load, createCatInternal } from './cat.js';

export async function loadCatAssets(baseUrl = '') { return load(baseUrl); }

export function createCat({ cast = 'mikan', scale = 1.25, ...rest } = {}) {
  const c = createCatInternal({ ...rest, cast, scale });
  return {
    object3D: c.object3D,
    update: (dt) => c.update(dt),
    setGait: (name, speed = 0) => c.setGait(name, speed),
    setLighting: (l) => c.setLighting(l),
    setOutlineScale: (k) => c.setOutlineScale(k),
    lookAt: (p) => c.lookAt(p),
    setPosture: (n) => c.setPosture(n),
    bones: c.bones,
    setLod: (m) => c.setLod(m),
    get lod() { return c.lod; },
    get triangles() { return c.triangles; },
    dispose: () => c.dispose(),
  };
}

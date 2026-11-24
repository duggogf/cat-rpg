// PROTOTYPE - NOT FOR PRODUCTION
// Cat module — CONTRACT between the cat builder (owns src/render/cats/, src/anim/,
// tools/cats/, tools/bake-meshes.mjs, assets/mesh/) and the environment builder
// (owns everything else, imports only this file).
//
//   await loadCatAssets(baseUrl)           -> resolves when meshes/atlases are loaded ('' = same folder)
//                                             fetches `${baseUrl}mesh/<cast>.json|.bin` (build copies assets/mesh -> dist/mesh)
//   createCat({ cast, scale })              -> Cat
//       cast:  'mikan' | 'wallSitter'       (more casts later: 'daifuku', 'togemaru', ...)
//       scale: world scale multiplier (art bible: 1.25 x real cat size; 1.0 = real size)
//   Cat.object3D                            THREE.Object3D, origin at the feet, faces +Z
//   Cat.update(dt)                          advance animation (dt in seconds, sim time)
//   Cat.setGait(name, speed)                'idle' | 'walk' (speed in m/s, drives cadence)
//   Cat.setLighting({ keyDir, keyColor, shadeColor, rimColor })
//                                           keyDir: THREE.Vector3 (world, towards light);
//                                           colours: THREE.Color. Called on phase change.
//   Cat.setOutlineScale(k)                  1 = art-bible line weight; for tests
//   Cat.dispose()
//
// Characters receive NO shadow map; the cat draws its own soft contact blob.
// Implementation: SDF-baked skinned mesh, cel fill + inverted-hull ink (see cat.js).
// Render notes for integrators: the cat shaders write raw sRGB (keep renderer.toneMapping =
// NoToneMapping for the cat pass) and size the line from the CURRENT render target height.
import { loadCatAssets as load, createCatInternal } from './cat.js';

export async function loadCatAssets(baseUrl = '') { return load(baseUrl); }

export function createCat({ cast = 'mikan', scale = 1.25 } = {}) {
  const c = createCatInternal({ cast, scale });
  return {
    object3D: c.object3D,
    update: (dt) => c.update(dt),
    setGait: (name, speed = 0) => c.setGait(name, speed),
    setLighting: (l) => c.setLighting(l),
    setOutlineScale: (k) => c.setOutlineScale(k),
    dispose: () => c.dispose(),
  };
}

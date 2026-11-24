// Cat module — CONTRACT between the cat builder (owns src/render/cats/, src/anim/,
// tools/cats/, tools/bake-meshes.mjs, assets/mesh/) and the environment builder
// (owns everything else, imports only this file).
//
// This is a PLACEHOLDER (a capsule) that honours the contract so integration can start;
// the cat builder replaces the implementation, never the signatures.
//
//   await loadCatAssets(baseUrl)           -> resolves when meshes/atlases are loaded ('' = same folder)
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
import * as THREE from 'three';

export async function loadCatAssets(baseUrl = '') { return true; }

export function createCat({ cast = 'mikan', scale = 1.25 } = {}) {
  const col = cast === 'mikan' ? '#F28C28' : '#A8A8A0';
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.09 * scale, 0.22 * scale, 6, 12),
    new THREE.MeshToonMaterial({ color: col }));
  body.rotation.x = Math.PI / 2; body.position.y = 0.15 * scale; g.add(body);
  let t = 0, gait = 'idle', spd = 0;
  return {
    object3D: g,
    update(dt) { t += dt; body.position.y = 0.15 * scale + (gait === 'walk' ? Math.abs(Math.sin(t * 8)) * 0.01 : 0); },
    setGait(name, speed = 0) { gait = name; spd = speed; },
    setLighting() {}, setOutlineScale() {}, dispose() { g.clear(); },
  };
}

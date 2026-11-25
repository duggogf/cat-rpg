// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Staging the cat being judged at a Verdict (review round 1, fix 4; plan §1.1 #3 "shows on his model (a Scar)"; mock
// 07): the subject sits low with its ears flat back (the 'routed' posture), and its fresh Scar shows on its model as a
// small notch bitten out of the camera-side ear (review round 2, fix 2). Presentation only: it reads the Scar list the
// nemesis sim already wrote, never a cat record.
import * as THREE from 'three';

/**
 * Where the fresh notch goes on one ear, in the ear's own coordinates (the `aux` attribute the cat bake writes: u
 * across, v up the ear): the mouth on the ear's outer edge a little above half its height, sized to the ear. Read from
 * the cat's own mesh, so it fits every cast. The fill shader cuts the V (uNick / uNickS, src/render/cats/shaders.js).
 * @param side +1 earL, -1 earR (the ear's outer edge is +u on earL and -u on earR)
 * @returns {{nick: THREE.Vector4, size: THREE.Vector4}} | null
 */
export function earNick(cat, side) {
  const sk = cat.object3D && cat.object3D.getObjectByProperty('isSkinnedMesh', true);
  const bone = cat.bones && (side < 0 ? cat.bones.earR : cat.bones.earL);
  if (!sk || !bone || !sk.geometry.attributes.aux) return null;
  const bi = sk.skeleton.bones.indexOf(bone); if (bi < 0) return null;
  const g = sk.geometry, A = g.attributes.aux, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight;
  const uv = [];
  for (let i = 0; i < A.count; i++) {
    let w = 0; for (let k = 0; k < 4; k++) if (SI.getComponent(i, k) === bi) w += SW.getComponent(i, k);
    if (w >= 0.9) uv.push([A.getX(i), A.getY(i)]);
  }
  if (uv.length < 8) return null;
  let v0 = Infinity, v1 = -Infinity, u0 = Infinity, u1 = -Infinity;
  for (const [u, v] of uv) { v0 = Math.min(v0, v); v1 = Math.max(v1, v); u0 = Math.min(u0, u); u1 = Math.max(u1, u); }
  const vE = v0 + 0.58 * (v1 - v0), band = 0.12 * (v1 - v0);
  const edge = uv.filter(([, v]) => Math.abs(v - vE) < band).reduce((a, [u]) => Math.max(a, u * side), -Infinity);
  if (!Number.isFinite(edge)) return null;
  const width = u1 - u0;   // the ear's widest span (at its base)
  return { nick: new THREE.Vector4(side, edge * side, vE, side), size: new THREE.Vector4(0.45 * width, 0.11 * (v1 - v0), 0.007, 0) };
}

/**
 * Pose the judged cat and mark its fresh Scar.
 * @param cat a createCat() handle (street rival, or a combat Fighter's `.cat`)
 * @param o {scar: true to cut the notch (the cat has a Scar from this encounter); side: +1 earL | -1 earR, or 'auto'
 *   with `camera`: the ear nearer that camera on the first frame it draws the cat (then fixed, so the Scar never swaps
 *   ears when the cat turns); squash: false to skip the low-and-spread root scale (combat: the routed crouch alone)}
 * @returns undo()
 */
export function stageSubject(cat, { scar = true, side = 'auto', camera = null, squash = true } = {}) {
  if (!cat) return () => {};
  if (cat.setPosture) cat.setPosture('routed');
  const o3 = cat.object3D, s0 = o3 ? o3.scale.clone() : null;
  if (o3 && squash) o3.scale.set(s0.x * 1.06, s0.y * 0.9, s0.z * 1.06);   // low and spread, the beaten loaf of mock 07
  const sk = scar && o3 ? o3.getObjectByProperty('isSkinnedMesh', true) : null;
  const U = sk && Array.isArray(sk.material) && sk.material[0].uniforms && sk.material[0].uniforms.uNick ? sk.material[0].uniforms : null;
  // part of the ear: depth-tested, lit and inked with it (never a sprite on the head)
  const cut = (sd) => { const n = earNick(cat, sd); if (n) { U.uNick.value.copy(n.nick); U.uNickS.value.copy(n.size); } };
  let hook = null, prev = null;
  if (U && side !== 'auto') cut(side < 0 ? -1 : 1);
  else if (U && camera) {
    prev = sk.onBeforeRender; const x = new THREE.Vector3(), d = new THREE.Vector3();
    hook = sk.onBeforeRender = function (r, sc, cam, ...rest) {
      if (cam === camera) {   // the first frame through the scene camera (not the shadow pass): the lens-side ear
        x.setFromMatrixColumn(o3.matrixWorld, 0); d.setFromMatrixPosition(camera.matrixWorld).sub(o3.getWorldPosition(new THREE.Vector3()));
        cut(x.dot(d) >= 0 ? 1 : -1); sk.onBeforeRender = prev;
      }
      return prev.call(this, r, sc, cam, ...rest);
    };
  } else if (U) cut(-1);
  return () => {
    if (cat.setPosture) cat.setPosture(null);
    if (o3) o3.scale.copy(s0);
    if (hook && sk.onBeforeRender === hook) sk.onBeforeRender = prev;
    if (U) U.uNick.value.set(0, 0, 0, 1);
  };
}

/** True when the cat's newest Scar came from the encounter its Verdict is about (offer.serial), or on the offer's day. */
export function freshScar(townCat, offer) {
  if (!townCat || !townCat.scars || !townCat.scars.length) return false;
  const s = townCat.scars[townCat.scars.length - 1];
  return offer ? (s.serial === offer.serial || s.day === offer.day) : true;
}

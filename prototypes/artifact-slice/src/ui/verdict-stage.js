// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Staging the cat being judged at a Verdict (review round 1, fix 4; plan §1.1 #3 "shows on his model (a Scar)"; mock
// 07): the subject sits low with its ears flat back (the 'routed' posture), and its fresh Scar is drawn on its model as
// an inked mark at the head. Presentation only: it reads the Scar list the nemesis sim already wrote, never a cat record.
import * as THREE from 'three';

const INK = '#33273B', CREAM = '#FFF6E6', CRIMSON = '#C8455E', GOLD = '#F2B233';
let tex = null;
/** One inked "fresh scar" mark (a notch cut with two fresh ticks), drawn once. */
function scarTexture() {
  if (tex) return tex;
  const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d'); g.lineJoin = 'round'; g.lineCap = 'round';
  // the notch: a cream ear tip with a V bitten out, an ink line, the cut in crimson
  g.beginPath(); g.moveTo(30, 104); g.lineTo(52, 26); g.lineTo(62, 50); g.lineTo(74, 30); g.lineTo(98, 104); g.closePath();
  g.fillStyle = CREAM; g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.stroke();
  g.beginPath(); g.moveTo(52, 30); g.lineTo(62, 54); g.lineTo(74, 34); g.lineWidth = 8; g.strokeStyle = CRIMSON; g.stroke();
  // two fresh ticks
  g.lineWidth = 7; g.strokeStyle = GOLD;
  for (const [x0, y0, x1, y1] of [[18, 30, 30, 40], [108, 26, 96, 38]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  g.lineWidth = 2.5; g.strokeStyle = INK;
  for (const [x0, y0, x1, y1] of [[18, 30, 30, 40], [108, 26, 96, 38]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Pose the judged cat and mark its fresh Scar.
 * @param cat a createCat() handle (street rival, or a combat Fighter's `.cat`)
 * @param o {scar: true to draw the mark (the cat has a Scar from this encounter), side: +1 | -1 (which ear faces the camera)}
 * @returns undo()
 */
export function stageSubject(cat, { scar = true, side = 1 } = {}) {
  if (!cat) return () => {};
  if (cat.setPosture) cat.setPosture('routed');
  const o3 = cat.object3D, s0 = o3 ? o3.scale.clone() : null;
  if (o3) o3.scale.set(s0.x * 1.06, s0.y * 0.9, s0.z * 1.06);   // low and spread, the beaten loaf of mock 07
  let sprite = null;
  const head = cat.bones && cat.bones.head;
  if (scar && head) {
    sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: scarTexture(), depthTest: false, depthWrite: false, transparent: true, toneMapped: false }));
    sprite.name = 'verdict-scar'; sprite.renderOrder = 20;
    sprite.position.set(0.085 * side, 0.115, 0.01); sprite.scale.setScalar(0.15);   // on the camera-side ear, big enough to read at the two-shot
    head.add(sprite);
  }
  return () => { if (cat.setPosture) cat.setPosture(null); if (o3) o3.scale.copy(s0); if (sprite) { sprite.removeFromParent(); sprite.material.dispose(); } };
}

/** True when the cat's newest Scar came from the encounter its Verdict is about (offer.serial), or on the offer's day. */
export function freshScar(townCat, offer) {
  if (!townCat || !townCat.scars || !townCat.scars.length) return false;
  const s = townCat.scars[townCat.scars.length - 1];
  return offer ? (s.serial === offer.serial || s.day === offer.day) : true;
}

// PROTOTYPE - NOT FOR PRODUCTION
// Face decal atlas drawn with Canvas2D in kit.js faceFront() units (eyes at ±12, nose at y 8–12).
// Frames (rows, top to bottom): 0 open, 1 half-lid, 2 closed (front, projected along +Z); 3–5 the same
// as a PROFILE decal (kit sideHead: almond eye, pupil forward, nose tip, mouth corner), projected
// along X onto both cheeks and swapped in when the head is seen from more than ~60° off its nose.
import * as THREE from 'three';
import { INK } from './casts.js';

export const FACE_FRAMES = 6;
const W = 512, H = 256;

/** Face rectangle in head-local metres: centre (x, y) and half-size (hw, hh). */
export function faceRect(hs) { return { x: 0, y: -0.02 * hs, hw: 0.1 * hs, hh: 0.055 * hs }; }
/** Profile rectangle in head-local metres: centre (z, y) and half-size (hz, hy). */
export function sideRect(hs) { return { z: 0.055 * hs, y: -0.02 * hs, hz: 0.06 * hs, hy: 0.05 * hs }; }

export function makeFaceTexture(style, hs) {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H * FACE_FRAMES;
  const g = cv.getContext('2d');
  const R = faceRect(hs), U = 0.00335 * hs; // metres per kit unit
  const eyeY = -0.004 * hs;
  for (let f = 0; f < 3; f++) {
    g.setTransform(U * W / (2 * R.hw), 0, 0, U * H / (2 * R.hh), W / 2, f * H + H / 2 - (eyeY - R.y) * H / (2 * R.hh));
    drawFace(g, style, f);
  }
  const S = sideRect(hs);
  for (let f = 0; f < 3; f++) {
    // kit side-head units: x forward (= +Z), y down; origin at the eye, which sits 0.03 m ahead of the head centre
    g.setTransform(U * W / (2 * S.hz), 0, 0, U * H / (2 * S.hy), W / 2 + (0.03 * hs - S.z) * W / (2 * S.hz), (f + 3) * H + H / 2 - (eyeY - S.y) * H / (2 * S.hy));
    drawSide(g, style, f, hs);
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

function drawFace(g, s, frame) {
  const ink = INK, lw = 1.7;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const line = (fn, w) => { g.beginPath(); fn(); g.strokeStyle = ink; g.lineWidth = w || lw; g.stroke(); };
  const expr = s.expr;
  for (const x of [-12, 12]) {
    const lid = x > 0 ? s.lidL : s.lidR;
    if (frame === 2) { // closed: a soft downward arc
      line(() => { g.moveTo(x - 6.5, 0); g.quadraticCurveTo(x, 4.2, x + 6.5, 0); }, 2.1);
      continue;
    }
    // eye disc + pupil + one hard highlight
    g.beginPath(); g.ellipse(x, 0, 6.8, 7.6, 0, 0, Math.PI * 2); g.fillStyle = s.eye; g.fill();
    g.beginPath(); g.ellipse(x + 0.4 * Math.sign(x), 0.5, 6.8 * 0.44, 7.6 * 0.8, 0, 0, Math.PI * 2); g.fillStyle = ink; g.fill();
    g.beginPath(); g.arc(x - 6.8 * 0.36, -7.6 * 0.4, 6.8 * 0.3, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill();
    g.beginPath(); g.ellipse(x, 0, 6.8, 7.6, 0, 0, Math.PI * 2); g.strokeStyle = ink; g.lineWidth = lw; g.stroke();
    // lids: expression lid (smug) and blink half-lid, in the coat colour around the eye
    let lidY = expr === 'smug' ? -2.4 : null;
    if (frame === 1) lidY = 1.0;
    if (lidY != null) {
      g.save(); g.beginPath(); g.ellipse(x, 0, 7.8, 8.6, 0, 0, Math.PI * 2); g.clip();
      g.beginPath(); g.moveTo(x - 9, -10); g.lineTo(x + 9, -10); g.lineTo(x + 9, lidY - 0.6); g.quadraticCurveTo(x, lidY - 2.2, x - 9, lidY - 0.6); g.closePath();
      g.fillStyle = lid; g.fill(); g.restore();
      line(() => { g.moveTo(x - 7.4, lidY - 0.4); g.quadraticCurveTo(x, lidY - 2.4, x + 7.4, lidY - 0.4); }, 2.1);
    }
  }
  // nose wedge (pad pink) + mouth
  g.beginPath(); g.moveTo(-3.4, 8.0); g.quadraticCurveTo(0, 7.0, 3.4, 8.0); g.quadraticCurveTo(2.1, 12, 0, 12.4); g.quadraticCurveTo(-2.1, 12, -3.4, 8.0); g.closePath();
  g.fillStyle = '#F6809A'; g.fill(); g.strokeStyle = ink; g.lineWidth = 1.3; g.stroke();
  if (expr === 'smug') {
    line(() => { g.moveTo(0, 12.4); g.quadraticCurveTo(-1, 17, -7, 16.4); });
    line(() => { g.moveTo(0, 12.4); g.quadraticCurveTo(1, 17.6, 8.5, 14.6); });
  } else {
    line(() => { g.moveTo(0, 12.4); g.quadraticCurveTo(-0.6, 17, -6.4, 16.6); g.quadraticCurveTo(-9, 16.2, -9.8, 14); });
    line(() => { g.moveTo(0, 12.4); g.quadraticCurveTo(0.6, 17, 6.4, 16.6); g.quadraticCurveTo(9, 16.2, 9.8, 14); });
  }
}

function drawSide(g, s, frame, hs) {
  const ink = INK;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const line = (fn, w) => { g.beginPath(); fn(); g.strokeStyle = ink; g.lineWidth = w || 1.7; g.stroke(); };
  if (frame === 2) line(() => { g.moveTo(-5, -0.5); g.quadraticCurveTo(0, 3.2, 5.2, -0.5); }, 2.1);
  else {
    // almond eye, pupil pushed forward (+x), one hard highlight
    g.save(); g.beginPath(); g.ellipse(0, 0, 5.2, 6.8, 0, 0, Math.PI * 2); g.fillStyle = s.eye; g.fill(); g.clip();
    g.beginPath(); g.ellipse(1.6, 0.4, 2.4, 5.2, 0, 0, Math.PI * 2); g.fillStyle = ink; g.fill();
    g.beginPath(); g.arc(-1.4, -2.8, 1.8, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill();
    let lidY = s.expr === 'smug' ? -1.8 : null; if (frame === 1) lidY = 1.2;
    if (lidY != null) { g.beginPath(); g.moveTo(-7, -9); g.lineTo(7, -9); g.lineTo(7, lidY - 1.2); g.quadraticCurveTo(0, lidY - 2.6, -7, lidY - 0.4); g.closePath(); g.fillStyle = s.lidL; g.fill(); }
    g.restore();
    g.beginPath(); g.ellipse(0, 0, 5.2, 6.8, 0, 0, Math.PI * 2); g.strokeStyle = ink; g.lineWidth = 1.7; g.stroke();
    if (lidY != null) line(() => { g.moveTo(-5.4, lidY - 0.4); g.quadraticCurveTo(0, lidY - 2.6, 5.4, lidY - 1.2); }, 2.1);
  }
  // nose tip at the muzzle front + mouth corner (kit sideHead)
  const nx = 19.5; // the nose bump tip, 0.065 m ahead of the eye
  g.beginPath(); g.moveTo(nx - 3.5, 1.6); g.quadraticCurveTo(nx + 0.6, 1.4, nx + 0.4, 4.8); g.quadraticCurveTo(nx - 1.8, 5.8, nx - 3.6, 3.8); g.closePath();
  g.fillStyle = '#F6809A'; g.fill(); g.strokeStyle = ink; g.lineWidth = 1.3; g.stroke();
  line(() => { g.moveTo(nx - 1.6, 6.2); g.quadraticCurveTo(nx - 2.6, 10.6, nx - 8.4, 10.8); }, 1.5);
}

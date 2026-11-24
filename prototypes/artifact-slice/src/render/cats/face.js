// PROTOTYPE - NOT FOR PRODUCTION
// Face decal atlas drawn with Canvas2D in kit.js faceFront() units (eyes at ±12, nose at y 8–12).
// Frames (rows, top to bottom): 0 open, 1 half-lid, 2 closed.
// Two textures, one drawing: the FACE card holds nose + mouth (projected along head +Z onto the
// muzzle); the EYES atlas holds each eye (with its lids/expression) in its own cell, projected per
// eye from cat.js along an axis that is +Z front-on (so the front face is the kit face exactly) and
// turns continuously toward the camera on that eye's side, so the near eye reads side-on. No swap.
import * as THREE from 'three';
import { INK } from './casts.js';

export const FACE_FRAMES = 3;
const W = 512, H = 256;

/** Face rectangle in head-local metres: centre (x, y) and half-size (hw, hh). */
export function faceRect(hs) { return { x: 0, y: -0.02 * hs, hw: 0.1 * hs, hh: 0.055 * hs }; }

export function makeFaceTexture(style, hs) {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H * FACE_FRAMES;
  const g = cv.getContext('2d');
  const R = faceRect(hs), U = 0.00335 * hs; // metres per kit unit
  const eyeY = -0.004 * hs;
  for (let f = 0; f < 3; f++) {
    g.setTransform(U * W / (2 * R.hw), 0, 0, U * H / (2 * R.hh), W / 2, f * H + H / 2 - (eyeY - R.y) * H / (2 * R.hh));
    drawFace(g, style, f, { eyes: [] });
  }
  return tex(cv);
}

/** Eye decal half-size in metres (eye-local square). */
export const eyeHalf = (hs) => 0.034 * hs;
const EW = 256;
/** Eyes atlas: columns = eye (0: the -X eye, kit x -12; 1: the +X eye, kit x +12), rows = frames. */
export function makeEyesTexture(style, hs) {
  const cv = document.createElement('canvas'); cv.width = EW * 2; cv.height = EW * FACE_FRAMES;
  const g = cv.getContext('2d');
  const U = 0.00335 * hs, k = U * EW / (2 * eyeHalf(hs)); // px per kit unit
  [-12, 12].forEach((x, col) => {
    for (let f = 0; f < FACE_FRAMES; f++) {
      g.save(); g.beginPath(); g.rect(col * EW, f * EW, EW, EW); g.clip();
      g.setTransform(k, 0, 0, k, col * EW + EW / 2 - x * k, f * EW + EW / 2);
      drawFace(g, style, f, { eyes: [x], mouth: false });
      g.restore();
    }
  });
  return tex(cv);
}

function tex(cv) {
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

function drawFace(g, s, frame, opt = {}) {
  const ink = INK, lw = 1.7;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const line = (fn, w) => { g.beginPath(); fn(); g.strokeStyle = ink; g.lineWidth = w || lw; g.stroke(); };
  const expr = s.expr;
  for (const x of (opt.eyes || [-12, 12])) {
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
  if (opt.mouth === false) return;
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


// Rural bus stop at dusk in the painted-cel look. Ink what acts (fox, bench), paint what stays (shelter,
// sign, road, hedge, trees, hills, sky). Frame order: sun shadow -> env to RT -> paint post -> cels.
import * as THREE from 'three';
import { U, applyPhase, envMat, billboards, skyDome, backdropMat, ringGeometry, CEL, celMat, hullMat, SunShadow } from './env.js';
import { PaintPost } from './post.js';
import { PHASES, rgb } from './phases.js';
import { bakeAll } from './paint.js';
import { buildFox, blobMat, hexV, authoredShade } from './fox.js';

const W = 1280, H = 720;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
document.body.appendChild(renderer.domElement);
const cam = new THREE.PerspectiveCamera(50, W / H, 0.05, 2500);
const env = new THREE.Scene(), late = new THREE.Scene();
const casters = new Set(), rayCasters = [];
let R = 1; const rnd = () => ((R = (R * 16807) % 2147483647) / 2147483647);

const phaseName = new URLSearchParams(location.search).get('phase') || 'dusk';
const ph = { ...PHASES[phaseName], seaGlowK: 0 };    // no sea in this scene: drop the lane's sea-gap glow
applyPhase(ph);

const T = await bakeAll();
U.grainMap.value = T.grain;

/* ---------------------------------------------------------------- helpers */
function boxUV(geo, w, h, d, tile) { // scale BoxGeometry face UVs so the texture tiles every `tile` metres
  const uv = geo.attributes.uv, size = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) { const k = f * 4 + i; uv.setXY(k, uv.getX(k) * size[f][0] / tile, uv.getY(k) * size[f][1] / tile); }
  return geo;
}
function add(mesh, { cast = true, ray = true } = {}) { env.add(mesh); if (cast) casters.add(mesh); if (ray) rayCasters.push(mesh); return mesh; }
function box(w, h, d, mat, x, y, z, tile = 1) { const m = new THREE.Mesh(boxUV(new THREE.BoxGeometry(w, h, d), w, h, d, tile), mat); m.position.set(x, y, z); return m; }

/* ---------------------------------------------------------------- sky, backdrops */
env.add(skyDome(T.brush));
const ring = (r, y0, y1, map, o, order) => { const m = new THREE.Mesh(ringGeometry(r, 0, 360, y0, y1, 128), backdropMat(map, o)); m.renderOrder = order; m.frustumCulled = false; env.add(m); return m; };
ring(700, 30, 300, T.clouds, { cloud: true }, -9);
ring(320, -5, 90, T.hillsFar, { haze: 0.5 }, -8);
ring(140, -2, 36, T.hillsNear, { haze: 0.18 }, -7);

/* ---------------------------------------------------------------- ground, road, verge */
{
  const g = new THREE.CircleGeometry(130, 72); g.rotateX(-Math.PI / 2);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 65, uv.getY(i) * 65);
  add(new THREE.Mesh(g, envMat({ map: T.grass, grain: 0.12 })), { cast: false, ray: false });
  const rg = new THREE.PlaneGeometry(4.6, 260); rg.rotateX(-Math.PI / 2);
  const ru = rg.attributes.uv; for (let i = 0; i < ru.count; i++) ru.setXY(i, ru.getX(i), ru.getY(i) * 260 / 9);
  const rm = envMat({ map: T.road, grain: 0.12 }); rm.polygonOffset = true; rm.polygonOffsetFactor = -1; rm.polygonOffsetUnits = -1;
  const road = new THREE.Mesh(rg, rm); road.position.set(3.3, 0.005, 0); add(road, { cast: false, ray: false });
  const dg = new THREE.PlaneGeometry(3.4, 4.4); dg.rotateX(-Math.PI / 2);
  const dirt = new THREE.Mesh(dg, envMat({ map: T.dirt, blend: true, grain: 0.1 })); dirt.position.set(-1.55, 0.01, 0.35); add(dirt, { cast: false, ray: false });
}

/* ---------------------------------------------------------------- the shelter (scenery: painted, unlined) */
{
  const wood = envMat({ map: T.wood }), foot = envMat({ map: T.woodFoot }), roof = envMat({ map: T.roof });
  const conc = envMat({ tint: '#CDBFA9', grain: 0.6 });
  add(box(1.7, 0.08, 3.5, conc, -3.12, 0.04, 0));
  add(box(0.07, 2.12, 3.26, foot, -3.8, 1.1, 0));
  for (const s of [-1, 1]) {
    add(box(1.3, 1.95, 0.06, foot, -3.17, 1.06, s * 1.6));
    add(box(0.11, 2.3, 0.11, wood, -2.5, 1.15, s * 1.6, 0.5));
    add(box(0.11, 2.2, 0.11, wood, -3.8, 1.1, s * 1.6, 0.5));
  }
  add(box(1.4, 0.12, 3.3, wood, -3.17, 2.12, 0));            // tie beam under the roof
  const rf = box(2.0, 0.06, 3.8, roof, -3.12, 2.32, 0, 1.4); rf.rotation.z = 0.12; add(rf);
  // bus-stop sign: a painted disc on a pole (static, so unlined)
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 2.2, 12), envMat({ tint: '#8E8CA6', grain: 0.5 })); pole.position.set(-1.75, 1.1, 2.15); add(pole);
  const sign = new THREE.Mesh(new THREE.CircleGeometry(0.26, 40), envMat({ map: T.sign, alphaCut: 0.5, side: THREE.DoubleSide, grain: 0.05 }));
  sign.position.set(-1.71, 2.02, 2.15); sign.rotation.y = Math.PI / 2; add(sign);
}

/* ---------------------------------------------------------------- hedges, trees, grass (painted cards) */
{
  const hedge = [], canopy = [], grass = [];
  const hedgeRun = (x, z0, z1) => { for (let z = z0; z <= z1; z += 0.5) {
    const c = [x + (rnd() - 0.5) * 0.3, 0.72 + rnd() * 0.12, z, 0.78];
    for (let k = 0; k < 4; k++) hedge.push({ pos: [c[0] + (rnd() - 0.5) * 0.6, c[1] + (rnd() - 0.3) * 0.5, z + (rnd() - 0.5) * 0.5], size: 1.0 + rnd() * 0.35, rot: (rnd() - 0.5) * 0.6, cell: 4 + (k & 1), bright: 0.92 + rnd() * 0.16, clump: c });
  } };
  hedgeRun(-4.75, -20, 20); hedgeRun(8.4, -20, -3.2); hedgeRun(8.4, 3.2, 20);
  const tree = (x, z, hgt, s) => {
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * s, 0.19 * s, hgt, 10), envMat({ tint: '#7A5A48', grain: 0.6 })); tr.position.set(x, hgt / 2, z); add(tr);
    for (let c = 0; c < 6; c++) {
      const a = c * 1.1 + rnd(), rr = c ? 0.9 * s : 0;
      const ctr = [x + Math.cos(a) * rr, hgt + 0.5 * s + (c ? (rnd() - 0.3) * 0.9 * s : 0.8 * s), z + Math.sin(a) * rr, 1.25 * s];
      for (let k = 0; k < 8; k++) canopy.push({ pos: [ctr[0] + (rnd() - 0.5) * 1.2 * s, ctr[1] + (rnd() - 0.5) * 1.0 * s, ctr[2] + (rnd() - 0.5) * 1.2 * s], size: (1.3 + rnd() * 0.5) * s, rot: (rnd() - 0.5) * 0.8, cell: Math.floor(rnd() * 4), bright: 0.9 + rnd() * 0.2, clump: ctr });
    }
  };
  tree(-6.6, -5.2, 2.6, 1.15); tree(-7.2, 5.6, 2.3, 1.0); tree(11, -7.5, 2.8, 1.2); tree(12.5, 8, 2.4, 1.05); tree(-5.5, -14, 2.6, 1.1);
  const tuft = (x, z) => { if (Math.hypot(x, z) < 0.9 || (x < -2.2 && x > -4.2 && Math.abs(z) < 1.9)) return; grass.push({ pos: [x, 0, z], size: 0.32 + rnd() * 0.25, cell: 6 + Math.floor(rnd() * 2), bright: 0.9 + rnd() * 0.2, clump: [x, 0.25, z, 0.5] }); };
  for (let i = 0; i < 160; i++) { const z = (rnd() - 0.5) * 36; tuft(rnd() < 0.5 ? 0.95 + rnd() * 0.25 : 5.6 + rnd() * 0.4, z); }
  for (let i = 0; i < 120; i++) tuft(-4.4 + rnd() * 3.2 - (rnd() < 0.5 ? 0 : 0), (rnd() - 0.5) * 30);
  for (let i = 0; i < 80; i++) tuft(6 + rnd() * 2.2, (rnd() - 0.5) * 36);
  const hm = billboards(hedge, T.foliage, { cols: 4, rows: 2, holes: 0.35 }); env.add(hm); casters.add(hm);
  const cm = billboards(canopy, T.foliage, { cols: 4, rows: 2, holes: 0.45 }); env.add(cm); casters.add(cm);
  const gm = billboards(grass, T.foliage, { cols: 4, rows: 2, cylindrical: true, castShadow: false, rampLo: -0.5, rampHi: 0.6 }); env.add(gm);
}

/* ---------------------------------------------------------------- the bench (interactive: inked cel prop) */
const benchZone = { value: new THREE.Vector3(1, 1, 1) };
const bench = new THREE.Group(); bench.name = 'bench';
{
  const parts = [], slat = '#C28A52', iron = '#5E6E8C';
  const pb = (w, h, d, x, y, z, col) => parts.push({ w, h, d, x, y, z, col });
  for (let i = 0; i < 3; i++) pb(0.11, 0.035, 1.8, -0.12 + i * 0.125, 0.45, 0, slat);
  for (const y of [0.6, 0.73]) pb(0.035, 0.1, 1.8, -0.24, y, 0, slat);
  for (const z of [-0.75, 0.75]) {
    pb(0.05, 0.43, 0.05, 0.1, 0.215, z, iron); pb(0.05, 0.8, 0.05, -0.24, 0.4, z, iron);
    pb(0.38, 0.04, 0.05, -0.07, 0.415, z, iron);
  }
  const pos = [], nrm = [], sm = [], col = [], sh = [], idx = [];
  for (const p of parts) {
    const g = new THREE.BoxGeometry(p.w, p.h, p.d), base = pos.length / 3;
    const c = hexV(p.col), s = authoredShade(p.col);
    for (let i = 0; i < g.attributes.position.count; i++) {
      const x = g.attributes.position.getX(i), y = g.attributes.position.getY(i), z = g.attributes.position.getZ(i);
      pos.push(x + p.x, y + p.y, z + p.z); nrm.push(g.attributes.normal.getX(i), g.attributes.normal.getY(i), g.attributes.normal.getZ(i));
      const v = new THREE.Vector3(Math.sign(x), Math.sign(y), Math.sign(z)).normalize(); sm.push(v.x, v.y, v.z);
      col.push(c.x, c.y, c.z); sh.push(s.x, s.y, s.z);
    }
    for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + base);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute('smoothN', new THREE.Float32BufferAttribute(sm, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('shadeCol', new THREE.Float32BufferAttribute(sh, 3)); g.setIndex(idx);
  const fadeB = { value: 1 };
  bench.add(new THREE.Mesh(g, celMat(fadeB, benchZone)), new THREE.Mesh(g, hullMat(2.25, fadeB)));
  const bb = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 2.1), blobMat(0.45)); bb.rotation.x = -Math.PI / 2; bb.position.set(-0.08, 0.085, 0); bench.add(bb);
  bench.position.set(-3.3, 0.0, 0); bench.userData.fade = fadeB;
  late.add(bench);
}

/* ---------------------------------------------------------------- the fox (cel) */
const fox = buildFox();
fox.group.rotation.y = -Math.PI / 2;   // faces -X, toward the shelter
late.add(fox.group);

/* ---------------------------------------------------------------- per-frame */
const shadow = new SunShadow(2048, 22); shadow.target.set(-2, 0, 0);
const post = new PaintPost(T.grain); post.setSize(W, H);
CEL.rtHeight.value = H; CEL.rtWidth.value = W;
const ray = new THREE.Raycaster();
function zoneAt(p) { // environment shadow on a cel = one zone tint sampled at its root, never shadow-map stripes
  ray.set(p, U.sunDir.value); ray.far = 60;
  const hit = ray.intersectObjects(rayCasters, false).length > 0;
  return hit ? new THREE.Vector3(1, 1, 1).lerp(rgb(ph.shadowTint), 0.45) : new THREE.Vector3(1, 1, 1);
}
function setupCels() {
  // character key: the phase's direction, read in the camera's yaw frame (x = screen right, z = toward camera)
  const yaw = Math.atan2(cam.position.x - 0, cam.position.z - 0);
  const k = new THREE.Vector3(...ph.catDir).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  fox.U.uKeyDir.value.copy(k); CEL.keyDir.value.copy(k);
  const lit = new THREE.Vector3(1, 1, 1).lerp(rgb(ph.catKey), 0.5);
  fox.U.uLitMul.value.copy(lit); CEL.celTint.value.copy(lit);
  fox.U.uZone.value.copy(zoneAt(new THREE.Vector3(0, 0.25, 0)));
  if (neutral) { fox.U.uLitMul.value.set(1, 1, 1); fox.U.uZone.value.set(1, 1, 1); }
  benchZone.value.copy(zoneAt(new THREE.Vector3(-3.3, 0.45, 0)));
  const bd = cam.position.distanceTo(new THREE.Vector3(-3.3, 0.45, 0));
  bench.userData.fade.value = Math.max(0.3, Math.min(1, (bd - 0.4) / 0.6));
  fox.update(cam, H);
}
const VIEWS = {
  behind: { pos: [2.5, 1.05, 0.3], at: [-1.2, 0.72, 0] },
  '34': { pos: [-1.55, 0.9, 1.45], at: [0, 0.4, 0.05] },
  side: { pos: [0.05, 0.8, 2.7], at: [-0.25, 0.42, 0] },
  near: { pos: [0.62, 0.62, 0.12], at: [-3.0, 0.5, -0.2] },
  wide: { pos: [6.5, 2.6, 6.5], at: [-2.2, 0.8, -0.6] },
  skyZ: { pos: [1.5, 0.4, -1.5], at: [1.5, 4.5, 12] },
  skyNegZ: { pos: [1.5, 0.4, 1.5], at: [1.5, 4.5, -12] },
};
let neutral = false;
function setView(name) { const v = VIEWS[name]; cam.position.set(...v.pos); cam.lookAt(new THREE.Vector3(...v.at)); cam.updateMatrixWorld(); }
function render() {
  U.time.value = 3.0;
  setupCels();
  shadow.update(renderer, [env], casters);
  renderer.setRenderTarget(post.rt); renderer.clear(); renderer.render(env, cam);
  post.render(renderer);
  renderer.autoClear = false; renderer.render(late, cam); renderer.autoClear = true;
}

/* ---------------------------------------------------------------- measurement hooks (observations only) */
function pixels() { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.drawImage(renderer.domElement, 0, 0); return g.getImageData(0, 0, W, H).data; }
function lab(r, g, b) {
  const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const R_ = f(r), G_ = f(g), B_ = f(b);
  let x = (R_ * 0.4124 + G_ * 0.3576 + B_ * 0.1805) / 0.95047, y = R_ * 0.2126 + G_ * 0.7152 + B_ * 0.0722, z = (R_ * 0.0193 + G_ * 0.1192 + B_ * 0.9505) / 1.08883;
  const h = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116); x = h(x); y = h(y); z = h(z);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
function de2000(A, B) {
  const [L1, a1, b1] = A, [L2, a2, b2] = B, rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2, G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1p = a1 * (1 + G), a2p = a2 * (1 + G), C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h1 = (Math.atan2(b1, a1p) / rad + 360) % 360, h2 = (Math.atan2(b2, a2p) / rad + 360) % 360;
  const dL = L2 - L1, dC = C2p - C1p; let dh = h2 - h1; if (C1p * C2p === 0) dh = 0; else if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin(dh * rad / 2), Lm = (L1 + L2) / 2, Cmp = (C1p + C2p) / 2;
  let hm = h1 + h2; if (C1p * C2p !== 0) { if (Math.abs(h1 - h2) > 180) hm += h1 + h2 < 360 ? 360 : -360; hm /= 2; }
  const Tt = 1 - 0.17 * Math.cos((hm - 30) * rad) + 0.24 * Math.cos(2 * hm * rad) + 0.32 * Math.cos((3 * hm + 6) * rad) - 0.2 * Math.cos((4 * hm - 63) * rad);
  const SL = 1 + 0.015 * (Lm - 50) ** 2 / Math.sqrt(20 + (Lm - 50) ** 2), SC = 1 + 0.045 * Cmp, SH = 1 + 0.015 * Cmp * Tt;
  const RT = -2 * Math.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hm - 275) / 25) ** 2)) * rad);
  return Math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH));
}
function hsv(r, g, b) { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return [h, mx ? d / mx : 0, mx / 255]; }

function analyze(view) {
  setView(view);
  const out = { view };
  // 1. fox shade share (mask: red = shade, green = lit), cels only
  const vis = (o, v) => { o.visible = v; };
  render(); const normal = pixels();
  fox.U.uMask.value = 1; render(); const m = pixels(); fox.U.uMask.value = 0;
  let sh = 0, lt = 0; const foxPix = [];
  for (let i = 0; i < W * H; i++) { const r = m[i * 4], g = m[i * 4 + 1], b = m[i * 4 + 2]; if (r > 250 && g < 5 && b < 5) { sh++; foxPix.push(i); } else if (g > 250 && r < 5 && b < 5) { lt++; foxPix.push(i); } }
  out.foxPixels = sh + lt; out.shadeShare = +(sh / Math.max(1, sh + lt)).toFixed(3);
  // 2. ink line width: cels alone on white, fills white; darkness-weighted width of the outermost run per row
  const saved = []; env.traverse((o) => { if (o.isMesh) { saved.push([o, o.visible]); o.visible = false; } }); vis(bench, false);
  fox.U.uMask.value = 2;
  renderer.setClearColor(0xffffff, 1);
  renderer.setRenderTarget(null); renderer.clear(); setupCels(); renderer.render(late, cam);
  const k = pixels(); fox.U.uMask.value = 0; renderer.setClearColor(0x000000, 1);
  for (const [o, v] of saved) o.visible = v; vis(bench, true);
  const ink = [0x33, 0x27, 0x3b], Lw = 255 * 3, Li = ink[0] + ink[1] + ink[2];
  const widths = [];
  for (let y = 0; y < H; y++) {
    let x = 0; while (x < W && k[(y * W + x) * 4] + k[(y * W + x) * 4 + 1] + k[(y * W + x) * 4 + 2] > Lw - 20) x++;
    if (x >= W - 2) continue;
    let w = 0, x2 = x; while (x2 < W) { const j = (y * W + x2) * 4, s = k[j] + k[j + 1] + k[j + 2]; const cov = (Lw - s) / (Lw - Li); if (cov < 0.08 && x2 > x + 1) break; w += Math.min(1, Math.max(0, cov)); x2++; if (x2 - x > 12) break; }
    if (x2 - x <= 12) widths.push(w);
  }
  widths.sort((a, b) => a - b);
  out.lineWidthPx = { median: +(widths[widths.length >> 1] || 0).toFixed(2), p10: +(widths[Math.floor(widths.length * 0.1)] || 0).toFixed(2), p90: +(widths[Math.floor(widths.length * 0.9)] || 0).toFixed(2), rows: widths.length, at1080: +((widths[widths.length >> 1] || 0) * 1080 / H).toFixed(2) };
  // 3. darkest fox-region pixel in the normal frame (the ink should be #33273B)
  let darkest = 1e9, dHex = '';
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const j = (y * W + x) * 4; if (k[j] + k[j + 1] + k[j + 2] < Lw - 600) { const s = normal[j] + normal[j + 1] + normal[j + 2]; if (s < darkest) { darkest = s; dHex = '#' + [normal[j], normal[j + 1], normal[j + 2]].map((v) => v.toString(16).padStart(2, '0')).join(''); } } }
  out.inkSample = dHex; out.inkDE = +de2000(lab(...ink), lab(...[1, 3, 5].map((i) => parseInt(dHex.slice(i, i + 2), 16)))).toFixed(2);
  // 4. environment shade pixels: are any grey?
  U.debugMode.value = 1; const hid = []; env.traverse((o) => { if (o.isMesh && o.material.uniforms && !o.material.uniforms.debugMode) { hid.push(o); o.visible = false; } });
  const lateVis = late.visible; late.visible = false; render(); const dm = pixels(); late.visible = lateVis; for (const o of hid) o.visible = true; U.debugMode.value = 0;
  U.debugMode.value = 2; late.visible = false; render(); const alb = pixels(); late.visible = lateVis; U.debugMode.value = 0;
  let shN = 0, grey = 0; const mul = [0, 0, 0];
  for (let i = 0; i < W * H; i++) if (dm[i * 4] > 160 && dm[i * 4 + 1] < 20) { const [h, s] = hsv(normal[i * 4], normal[i * 4 + 1], normal[i * 4 + 2]); shN++; if (s < 0.08) grey++;
    for (let c = 0; c < 3; c++) mul[c] += normal[i * 4 + c] / Math.max(8, alb[i * 4 + c]); }
  out.envShadePixels = shN; out.envShadeGreyFrac = +(grey / Math.max(1, shN)).toFixed(4);
  const mm = mul.map((v) => v / Math.max(1, shN)), mx = Math.max(...mm);
  out.envShadeLightMul = mm.map((v) => +v.toFixed(3)); out.envShadeLightHue = Math.round(hsv(...mm.map((v) => v / mx * 255))[0]);
  // 5. palette drift: fox with neutral key and no zone; lit coat pixels vs the coat hex
  neutral = true; render(); const flat = pixels(); neutral = false;
  const counts = new Map(); for (const i of foxPix) if (m[i * 4 + 1] > 250) { const key = (flat[i * 4] << 16) | (flat[i * 4 + 1] << 8) | flat[i * 4 + 2]; counts.set(key, (counts.get(key) || 0) + 1); }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (top) { const c = [(top[0] >> 16) & 255, (top[0] >> 8) & 255, top[0] & 255]; out.coatSample = '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); out.coatDE = +de2000(lab(0xe2, 0x63, 0x2b), lab(...c)).toFixed(2); }
  // 6. fox vs surrounding ground L*
  let fl = 0, fn = 0; for (const i of foxPix) { fl += lab(normal[i * 4], normal[i * 4 + 1], normal[i * 4 + 2])[0]; fn++; }
  out.foxMeanL = +(fl / Math.max(1, fn)).toFixed(1);
  render();
  return out;
}

function setOrbit(yawDeg, h, d) { const a = THREE.MathUtils.degToRad(yawDeg); VIEWS.orbit = { pos: [Math.cos(a) * d, h, Math.sin(a) * d], at: [0, 0.42, 0] }; setView('orbit'); }
Object.assign(window, { setView, setOrbit, render, analyze, VIEWS, foxU: fox.U });
setView('behind'); render();
window.__ready = true;

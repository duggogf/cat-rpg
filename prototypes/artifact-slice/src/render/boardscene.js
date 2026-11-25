// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Rivals board set (plan §3.4; design/ux/key-screens.md §2.3-§2.6): a small separate 3D diorama per scene,
// rendered alone while the street is paused. Same painted environment shader, baked paint and phase lighting as
// the street (env.js; Dusk gold by default), live SDF cats on their fixed role anchors (board_lane.json), flat Ink
// silhouettes in the wall shade for undiscovered cats. The set is built once and kept (opens in <= 300 ms after).
// This module is 3D only: the DOM layer (ribbons, tags, arrows, card, header) is src/ui/rivalsboard.js, which
// reads projected anchors from here.
import * as THREE from 'three';
import B from '../world/board_lane.json';
import { U, CEL, envMat, billboards, skyDome, backdropMat, ringGeometry, applyPhase, SunShadow } from './env.js';
import { PHASES, rgb, sunDir, mixPhase } from './phases.js';
import { createCat } from './cats/index.js';

const INK = '#33273B', GOLD = '#F2B01E', CREAM = '#FFF6E3', WIST = '#6E6AA8';
const hexV = (h) => rgb(h);
// the diorama stages cats a little under street size so the gang fits the 1080p wedge (key-screens §2.6 zones)
const CAT_K = B.catScale || 0.78;

/* ---------------------------------------------------------------- a tiny painted-geometry accumulator */
class Geo {
  constructor() { this.p = []; this.n = []; this.uv = []; this.c = []; this.i = []; }
  quad(a, b, c, d, uvf, o = {}) {
    const nu = o.nu || 1, nv = o.nv || 1, base = this.p.length / 3;
    const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b), C = new THREE.Vector3(...c), D = new THREE.Vector3(...d);
    const nrm = new THREE.Vector3().subVectors(Bv, A).cross(new THREE.Vector3().subVectors(D, A)).normalize();
    const col = rgb(o.color || '#FFFFFF');
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const P = A.clone().lerp(Bv, i / nu).lerp(D.clone().lerp(C, i / nu), j / nv), t = uvf(P), ao = o.ao ? o.ao(P) : 1;
      this.p.push(P.x, P.y, P.z); this.n.push(nrm.x, nrm.y, nrm.z); this.uv.push(t[0], t[1]); this.c.push(col.x * ao, col.y * ao, col.z * ao);
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const k = base + j * (nu + 1) + i; this.i.push(k, k + 1, k + nu + 2, k, k + nu + 2, k + nu + 1); }
  }
  /** Axis box [x0,y0,z0,x1,y1,z1]; faces subset of 'px nx py ny pz nz'; tu/tv metres per texture tile. */
  box(bx, o = {}) {
    const [x0, y0, z0, x1, y1, z1] = bx, tu = o.tu || 1, tv = o.tv || 1, F = o.faces || 'pxnxpynypznz';
    const fc = (k) => (o.faceColor && o.faceColor[k]) || o.color, vy = (P) => (P.y - y0) / tv, sub = (l) => Math.max(1, Math.round(l / (o.seg || 1.2)));
    if (F.includes('px')) this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], (P) => [(z1 - P.z) / tu, vy(P)], { ...o, color: fc('px'), nu: sub(z1 - z0), nv: sub(y1 - y0) });
    if (F.includes('nx')) this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], (P) => [(P.z - z0) / tu, vy(P)], { ...o, color: fc('nx'), nu: sub(z1 - z0), nv: sub(y1 - y0) });
    if (F.includes('pz')) this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], (P) => [(P.x - x0) / tu, vy(P)], { ...o, color: fc('pz'), nu: sub(x1 - x0), nv: sub(y1 - y0) });
    if (F.includes('nz')) this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], (P) => [(x1 - P.x) / tu, vy(P)], { ...o, color: fc('nz'), nu: sub(x1 - x0), nv: sub(y1 - y0) });
    if (F.includes('py')) this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], (P) => [P.x / tu, P.z / tu], { ...o, color: fc('py'), nu: sub(x1 - x0), nv: sub(z1 - z0) });
    if (F.includes('ny')) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], (P) => [P.x / tu, P.z / tu], { ...o, color: fc('ny') });
  }
  add(g, color) {
    g = g.index ? g.toNonIndexed() : g; const base = this.p.length / 3, col = rgb(color || '#FFFFFF'), P = g.attributes.position, N = g.attributes.normal, T = g.attributes.uv;
    for (let k = 0; k < P.count; k++) { this.p.push(P.getX(k), P.getY(k), P.getZ(k)); this.n.push(N.getX(k), N.getY(k), N.getZ(k)); this.uv.push(T ? T.getX(k) : 0, T ? T.getY(k) : 0); this.c.push(col.x, col.y, col.z); this.i.push(base + k); }
  }
  get empty() { return this.p.length === 0; }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setIndex(this.i); g.computeBoundingSphere(); return g;
  }
}
function rng(seed) { let a = (seed | 0) + 0x6D2B79F5; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------------------------------------------------------------- cat material patches: dim (flat, toward Wisteria) */
function patchDim(m, dimCol) {
  if (!m || !m.isShaderMaterial || m.userData.dimPatched) return;
  m.uniforms.uDim = { value: 0 }; m.uniforms.uDimCol = { value: hexV(dimCol) };
  const fs = m.fragmentShader, i = fs.lastIndexOf('}');
  // every early `return` in the fill shader writes gl_FragColor first, so the mix goes on each write
  m.fragmentShader = 'uniform float uDim; uniform vec3 uDimCol;\n' + fs.slice(0, i).replace(/gl_FragColor\s*=\s*([^;]+);/g, 'gl_FragColor = $1; gl_FragColor.rgb = mix(gl_FragColor.rgb, uDimCol, uDim);') + '}';
  m.userData.dimPatched = true; m.needsUpdate = true;
}
/** Extra hull shell in Bell Gold: the focus rim (key-screens §2.6 "lifts 4 px with a Bell-Gold rim"). */
function addRim(cat) {
  const sk = cat.object3D.getObjectByProperty('isSkinnedMesh', true);
  if (!sk || !Array.isArray(sk.material) || !sk.material[1] || !sk.material[1].uniforms || !sk.material[1].uniforms.uLinePx) return null;
  const base = sk.material[1], m = base.clone(), hide = new THREE.MeshBasicMaterial({ visible: false });
  m.uniforms.uInk.value = hexV(GOLD); m.polygonOffset = true; m.polygonOffsetFactor = 2; m.polygonOffsetUnits = 40;
  const mesh = new THREE.SkinnedMesh(sk.geometry, [hide, m]);
  mesh.bind(sk.skeleton, sk.bindMatrix); mesh.frustumCulled = false; mesh.name = 'board-rim'; mesh.visible = false;
  mesh.onBeforeRender = () => { m.uniforms.uRes.value.copy(base.uniforms.uRes.value); m.uniforms.uLinePx.value = base.uniforms.uLinePx.value + 3.2 * base.uniforms.uRes.value.y / 1080; };
  sk.parent.add(mesh);
  return mesh;
}

/* ---------------------------------------------------------------- the sets */
function buildLane(tex, X, out) {
  const ground = new Geo(), stone = new Geo(), wall = new Geo(), fence = new Geo(), house = new Geo(), roof = new Geo(), wood = new Geo(), win = new Geo(), coping = new Geo(), paint = new Geo();
  const ao = (P) => 1 - 0.3 * Math.exp(-Math.min(Math.abs(P.x - X + 2.05), Math.abs(P.x - X - 2.05)) / 0.35);
  // the stone path toward the camera (sun-baked lane paint), with wisteria contact darkening at the wall feet
  for (let z = 2; z > -6.6; z -= 0.6) ground.quad([X - 2.1, 0, z], [X + 2.1, 0, z], [X + 2.1, 0, z - 0.6], [X - 2.1, 0, z - 0.6], (P) => [P.x / 3.2, -P.z / 3.2], { nu: 8, ao });
  // six stone steps up to the porch (rise 0.2167, run 0.45)
  for (let i = 0; i < 6; i++) {
    const z0 = -6.6 - i * 0.45, y1 = (i + 1) * 0.2167, w = 1.55 - i * 0.02;
    stone.box([X - w, 0, z0 - 0.45, X + w, y1, z0], { faces: 'pypznxpx', tu: 1.4, tv: 0.7, faceColor: { py: '#EDE4D6', pz: '#C9BCB0', nx: '#B8ACA2', px: '#B8ACA2' } });
  }
  // the porch (the Boss's perch): deck, front face, posts, eave roof, back wall with a sliding door, boxes
  wood.box([X - 1.75, 0, -11.4, X + 1.75, 1.3, -9.3], { faces: 'pypznxpx', tu: 1.8, tv: 1.3, faceColor: { py: '#D8B488', pz: '#9C7454', nx: '#8C6A4E', px: '#8C6A4E' } });
  for (const sx of [-1.55, 1.55]) wood.box([X + sx - 0.07, 1.3, -9.52, X + sx + 0.07, 2.85, -9.38], { color: '#8A6046' });
  house.box([X - 2.1, 0, -12.2, X + 2.1, 3.3, -11.4], { faces: 'pz', tu: 3, tv: 3.3 });
  win.quad([X - 1.25, 1.42, -11.38], [X - 0.15, 1.42, -11.38], [X - 0.15, 2.5, -11.38], [X - 1.25, 2.5, -11.38], (P) => [(P.x - X + 1.25) / 1.1, (P.y - 1.42) / 1.08]);
  for (const [x0, y0, w, h, c] of [[0.35, 1.3, 0.5, 0.36, '#D8B27E'], [0.9, 1.3, 0.42, 0.3, '#C9A06C'], [0.5, 1.66, 0.42, 0.3, '#E2C08C']]) paint.box([X + x0, y0, -11.35, X + x0 + w, y0 + h, -11.0], { color: c });
  roof.quad([X - 2.25, 2.62, -9.0], [X + 2.25, 2.62, -9.0], [X + 2.25, 3.15, -11.6], [X - 2.25, 3.15, -11.6], (P) => [P.x / 2.2, P.z / 1.4], { nu: 3, nv: 2 });
  // the cushion on the perch
  paint.box([X - 0.48, 1.3, -10.3, X + 0.48, 1.42, -9.45], { color: '#8E6EB8' });
  // left: board fence near the camera, then a wood-and-plaster house facade up to the porch
  fence.box([X - 2.25, 0, -6.6, X - 2.1, 2.1, 2], { faces: 'px', tu: 2.6, tv: 2.1 });
  house.box([X - 3.4, 0, -11.4, X - 1.7, 3.6, -6.6], { faces: 'pxpz', tu: 3, tv: 3.6 });
  win.quad([X - 1.69, 1.5, -7.4], [X - 1.69, 1.5, -8.6], [X - 1.69, 2.5, -8.6], [X - 1.69, 2.5, -7.4], (P) => [(-7.4 - P.z) / 1.2, (P.y - 1.5) / 1.0]);
  roof.quad([X - 1.25, 3.4, -11.4], [X - 1.25, 3.4, -6.4], [X - 2.6, 4.2, -6.4], [X - 2.6, 4.2, -11.4], (P) => [P.z / 2.2, P.x / 1.4], { nu: 3, nv: 1 });
  // right: plaster wall with its pale coping near the camera, then a taller facade
  wall.box([X + 2.1, 0, -6.6, X + 2.4, 1.95, 2], { faces: 'nx', tu: 3, tv: 1.7 });
  coping.box([X + 2.06, 1.95, -6.6, X + 2.44, 2.05, 2], { faceColor: { py: '#F7F3E8', nx: '#CBD2D6', pz: '#D9DEE0' }, faces: 'pynxpz' });
  house.box([X + 1.7, 0, -11.4, X + 3.4, 3.9, -6.6], { faces: 'nxpz', tu: 3, tv: 3.9 });
  win.quad([X + 1.69, 1.6, -8.8], [X + 1.69, 1.6, -7.6], [X + 1.69, 2.55, -7.6], [X + 1.69, 2.55, -8.8], (P) => [(P.z + 8.8) / 1.2, (P.y - 1.6) / 0.95]);
  roof.quad([X + 1.25, 3.7, -6.4], [X + 1.25, 3.7, -11.4], [X + 2.6, 4.5, -11.4], [X + 2.6, 4.5, -6.4], (P) => [P.z / 2.2, P.x / 1.4], { nu: 3, nv: 1 });
  // houses beyond the walls (tops seen over the plaster wall and fence)
  house.box([X + 2.5, 0, -6.0, X + 6.5, 3.0, 1.5], { faces: 'nx', tu: 3, tv: 3 });
  roof.quad([X + 2.3, 3.0, 1.5], [X + 2.3, 3.0, -6.0], [X + 4.0, 3.9, -6.0], [X + 4.0, 3.9, 1.5], (P) => [P.z / 2.2, P.x / 1.4], { nu: 3, nv: 1 });
  house.box([X - 6.5, 0, -6.0, X - 2.6, 3.2, 1.5], { faces: 'px', tu: 3, tv: 3.2 });
  roof.quad([X - 2.4, 3.2, -6.0], [X - 2.4, 3.2, 1.5], [X - 4.1, 4.1, 1.5], [X - 4.1, 4.1, -6.0], (P) => [P.z / 2.2, P.x / 1.4], { nu: 3, nv: 1 });
  // a laundry line across the slit of sky, with three sheets
  const lg = new Geo();
  for (const [x0, x1, len, col] of [[-0.9, -0.45, 0.55, '#FFFDF4'], [-0.25, 0.1, 0.42, '#F7C8A8'], [0.55, 1.0, 0.6, '#C8DCEC']]) lg.quad([X + x0, 3.05 - len, -8.2], [X + x1, 3.05 - len, -8.2], [X + x1, 3.05, -8.2], [X + x0, 3.05, -8.2], () => [0, 0], { color: col, nu: 2, nv: 2 });
  // aircon unit on the right facade
  const ac = new Geo(); ac.quad([X + 1.68, 1.95, -7.0], [X + 1.68, 1.95, -6.62], [X + 1.68, 2.35, -6.62], [X + 1.68, 2.35, -7.0], (P) => [(P.z + 7.0) / 0.38, (P.y - 1.95) / 0.4]);
  const m = (g, mat, cast = true) => { if (g.empty) return; const me = new THREE.Mesh(g.build(), mat); out.env.add(me); if (cast) out.casters.add(me); };
  m(ground, envMat({ map: tex.ground, vertexColors: true, grain: 0.05 }), false);
  m(stone, envMat({ map: tex.stonewall || tex.wall, vertexColors: true, grain: 0.2 }));
  m(wood, envMat({ map: tex.fence, vertexColors: true, grain: 0.4 }));
  m(house, envMat({ map: tex.house, grain: 0.05 }));
  m(fence, envMat({ map: tex.fence, alphaCut: 0.5, grain: 0.05, side: THREE.DoubleSide }));
  m(wall, envMat({ map: tex.wall, grain: 0.05 }));
  m(coping, envMat({ vertexColors: true, grain: 0.5 }));
  m(roof, envMat({ map: tex.roof, grain: 0.05, side: THREE.DoubleSide }));
  m(win, envMat({ map: tex.window, grain: 0, glass: 1 }), false);
  m(paint, envMat({ vertexColors: true, grain: 0.6 }));
  m(lg, envMat({ vertexColors: true, grain: 0.5, side: THREE.DoubleSide, twoSided: true, flutter: 1, hangY: 3.05 }));
  m(ac, envMat({ map: tex.aircon, alphaCut: 0.4, grain: 0 }), false);
  // laundry wire + the porch lantern glow card
  const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(X - 1.7, 3.15, -8.2), new THREE.Vector3(X, 3.0, -8.2), new THREE.Vector3(X + 1.7, 3.15, -8.2)]), 12, 0.012, 4), envMat({ tint: '#4A4560', grain: 0 }));
  out.env.add(wire);
  // painted foliage: hedge clumps along both walls, a spill-over tree, pots by the steps; hydrangeas; grass at the wall feet
  const R = rng(17), items = [];
  const clump = (cx, cy, cz, rx, ry, rz, d = 1) => { const n = Math.max(5, Math.round((8 + rx * ry * rz * 3.2) * d)), avg = (rx + ry + rz) / 3;
    for (let i = 0; i < n; i++) { const th = R() * 6.283, ph = Math.acos(2 * R() - 1), rr = 0.45 + 0.55 * Math.sqrt(R());
      items.push({ pos: [cx + Math.sin(ph) * Math.cos(th) * rx * rr * 0.8, cy + Math.cos(ph) * ry * rr * 0.75, cz + Math.sin(ph) * Math.sin(th) * rz * rr * 0.8], size: avg * (0.85 + R() * 0.5), rot: (R() - 0.5) * 0.5, cell: Math.floor(R() * 8), bright: 0.92 + R() * 0.14, clump: [cx, cy, cz, avg] }); } };
  clump(X - 1.75, 0.5, -1.2, 0.45, 0.55, 0.7, 1.2); clump(X - 1.8, 0.45, -3.4, 0.35, 0.45, 0.5);
  clump(X + 1.8, 0.55, -2.4, 0.4, 0.6, 0.8, 1.2); clump(X + 1.85, 0.5, -6.0, 0.3, 0.45, 0.5);
  clump(X - 3.2, 3.6, -5.2, 1.2, 1.0, 1.2, 0.8); clump(X + 3.4, 3.6, -9.5, 1.3, 1.1, 1.2, 0.7);
  clump(X - 0.9, 3.4, -13.5, 1.5, 1.1, 0.8, 0.7); clump(X + 1.2, 3.5, -13.8, 1.4, 1.0, 0.8, 0.7);
  clump(X - 1.4, 0.55, -6.45, 0.25, 0.3, 0.25); clump(X + 1.42, 0.55, -6.45, 0.22, 0.3, 0.22);
  const fol = billboards(items, tex.foliage, { cols: 4, rows: 2, receive: true, holes: 0.4 }); out.env.add(fol); out.casters.add(fol);
  const fl = [[X + 1.72, -4.1, 0.55], [X + 1.7, -3.55, 0.45], [X - 1.75, -2.4, 0.5]].map(([x, z, s], i) => ({ pos: [x - s * 0.15, -s * 0.1, z], size: s, rot: 0, cell: i % 2, bright: 1 }));
  out.env.add(billboards(fl, tex.flowers, { cols: 2, rows: 1, cylindrical: true, rampLo: -0.6, rampHi: 0.3, keyK: 0.45 }));
  const gi = []; for (const sx of [-1, 1]) for (let i = 0; i < 26; i++) { const z = 1.5 - R() * 8.0; gi.push({ pos: [X + sx * (2.0 - R() * 0.12), -0.01, z], size: 0.16 + R() * 0.16, rot: 0, cell: Math.floor(R() * 4), bright: 0.9 + R() * 0.2 }); }
  out.env.add(billboards(gi, tex.grass, { cols: 4, rows: 1, cylindrical: true, castShadow: false, rampLo: -0.8, rampHi: 0.2 }));
  // the paper lantern (painted, glowing at Dusk)
  const lan = new Geo(); lan.add(new THREE.SphereGeometry(0.16, 10, 8).scale(1, 1.25, 1).translate(X - 1.15, 2.4, -9.6), '#F3E2C4');
  m(lan, envMat({ vertexColors: true, grain: 0, emit: 1 }), false);
}

function buildOutsiders(tex, X, out) {
  const road = new Geo(), verge = new Geo(), shelter = new Geo(), roof = new Geo(), rail = new Geo(), poster = new Geo(), sign = new Geo(), wall = new Geo();
  for (let z = 2; z > -9; z -= 0.6) road.quad([X - 3.2, 0, z], [X + 3.2, 0, z], [X + 3.2, 0, z - 0.6], [X - 3.2, 0, z - 0.6], (P) => [P.x / 3.6, -P.z / 3.6], { nu: 8, color: '#E2D8C8' });
  verge.quad([X - 30, -0.02, -9], [X + 30, -0.02, -9], [X + 30, -0.02, -12], [X - 30, -0.02, -12], (P) => [P.x / 4, -P.z / 4], { nu: 4 });
  // the bus shelter at the back-left: back panel, two posts, a slanted roof; a bench
  shelter.box([X - 2.9, 0, -8.0, X - 0.6, 2.1, -7.85], { faces: 'pz', tu: 2.3, tv: 2.1, color: '#C9D2D2' });
  for (const sx of [-2.85, -0.65]) shelter.box([X + sx - 0.05, 0, -7.0, X + sx + 0.05, 2.25, -6.9], { color: '#7E8A96' });
  shelter.box([X - 2.5, 0.42, -7.8, X - 1.0, 0.48, -7.4], { color: '#B88A62' });
  roof.quad([X - 3.05, 2.25, -6.75], [X - 0.45, 2.25, -6.75], [X - 0.45, 2.35, -8.1], [X - 3.05, 2.35, -8.1], (P) => [P.x / 2, P.z / 2], { color: '#9AA4AE' });
  poster.quad([X - 2.5, 0.85, -7.83], [X - 1.7, 0.85, -7.83], [X - 1.7, 1.85, -7.83], [X - 2.5, 1.85, -7.83], (P) => [(P.x - X + 2.5) / 0.8, (P.y - 0.85) / 1.0]);
  // the bus-stop sign: pole and round plate (painted; nothing a cat acts on)
  sign.add(new THREE.CylinderGeometry(0.035, 0.04, 1.95, 8).translate(X + 1.55, 0.975, -6.6), '#9AA4AE');
  sign.add(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 20).rotateX(Math.PI / 2).translate(X + 1.55, 1.85, -6.6), '#F3E9D6');
  sign.add(new THREE.CylinderGeometry(0.2, 0.2, 0.045, 20).rotateX(Math.PI / 2).translate(X + 1.55, 1.85, -6.58), '#4E9DA6');
  // a guardrail along the coast road and the low sea wall beyond
  for (let x = -6; x <= 6; x += 1.5) rail.box([X + x - 0.04, 0, -9.05, X + x + 0.04, 0.7, -8.95], { color: '#E8E4DA' });
  rail.box([X - 6.2, 0.5, -9.05, X + 6.2, 0.7, -8.98], { color: '#F2EEE4' });
  wall.box([X - 30, -1.5, -9.3, X + 30, 0.25, -9.1], { faces: 'pzpy', tu: 3, tv: 1.7 });
  // a plaster wall and an old house on the right edge, a hedge on the left
  wall.box([X + 2.9, 0, -8.5, X + 3.3, 1.6, 2], { faces: 'nx', tu: 3, tv: 1.6 });
  const m = (g, mat, cast = true) => { if (g.empty) return; const me = new THREE.Mesh(g.build(), mat); out.env.add(me); if (cast) out.casters.add(me); };
  m(road, envMat({ map: tex.ground, vertexColors: true, grain: 0.05 }), false);
  m(verge, envMat({ map: tex.garden, grain: 0.1 }), false);
  m(shelter, envMat({ vertexColors: true, grain: 0.5 }));
  m(roof, envMat({ vertexColors: true, grain: 0.5, side: THREE.DoubleSide }));
  m(rail, envMat({ vertexColors: true, grain: 0.3 }));
  m(poster, envMat({ map: tex.poster || tex.notice, alphaCut: 0.4, grain: 0 }), false);
  m(sign, envMat({ vertexColors: true, grain: 0.3 }));
  m(wall, envMat({ map: tex.wall, grain: 0.05 }));
  const R = rng(29), items = [];
  const clump = (cx, cy, cz, rx, ry, rz, d = 1) => { const n = Math.max(5, Math.round((8 + rx * ry * rz * 3.2) * d)), avg = (rx + ry + rz) / 3;
    for (let i = 0; i < n; i++) { const th = R() * 6.283, ph = Math.acos(2 * R() - 1), rr = 0.45 + 0.55 * Math.sqrt(R());
      items.push({ pos: [cx + Math.sin(ph) * Math.cos(th) * rx * rr * 0.8, cy + Math.cos(ph) * ry * rr * 0.75, cz + Math.sin(ph) * Math.sin(th) * rz * rr * 0.8], size: avg * (0.85 + R() * 0.5), rot: (R() - 0.5) * 0.5, cell: Math.floor(R() * 8), bright: 0.92 + R() * 0.14, clump: [cx, cy, cz, avg] }); } };
  clump(X - 3.0, 0.6, -2.0, 0.6, 0.7, 1.2, 1.1); clump(X + 2.6, 0.5, -3.0, 0.4, 0.5, 0.8); clump(X - 3.6, 2.4, -9.6, 1.4, 1.1, 0.8, 0.7);
  out.env.add(billboards(items, tex.foliage, { cols: 4, rows: 2, receive: true, holes: 0.4 }));
  const gi = []; for (let i = 0; i < 30; i++) gi.push({ pos: [X - 3 + R() * 6, -0.01, -8.6 + R() * 0.4], size: 0.16 + R() * 0.18, rot: 0, cell: Math.floor(R() * 4), bright: 0.9 + R() * 0.2 });
  out.env.add(billboards(gi, tex.grass, { cols: 4, rows: 1, cylindrical: true, castShadow: false, rampLo: -0.8, rampHi: 0.2 }));
}

function buildBell(tex, X, out) {
  const lot = new Geo(), truck = new Geo(), dark = new Geo(), crates = new Geo(), fence = new Geo(), glass = new Geo();
  for (let z = 2; z > -11; z -= 0.8) lot.quad([X - 3.4, 0, z], [X + 3.4, 0, z], [X + 3.4, 0, z - 0.8], [X - 3.4, 0, z - 0.8], (P) => [P.x / 3.4, -P.z / 3.4], { nu: 8, color: '#E6DCCB' });
  // the kei truck, side-on across the back of the Lot: cab on the right (Mikan's perch is its roof), open bed on the left
  truck.box([X + 0.35, 0.45, -8.75, X + 1.45, 1.42, -7.65], { faceColor: { pz: '#E4EAF0', py: '#F4F6F8', nx: '#B9C2CC', px: '#C8D0D8' }, faces: 'pznxpxpy' });
  glass.quad([X + 0.5, 0.98, -7.64], [X + 1.3, 0.98, -7.64], [X + 1.3, 1.34, -7.64], [X + 0.5, 1.34, -7.64], () => [0.5, 0.5], { color: '#6F8FB8' });
  glass.quad([X + 0.52, 1.24, -7.635], [X + 0.86, 1.32, -7.635], [X + 0.86, 1.33, -7.635], [X + 0.52, 1.25, -7.635], () => [0.5, 0.5], { color: '#D8E8F4' });
  dark.box([X + 0.35, 0.3, -8.75, X + 1.5, 0.45, -7.6], { faceColor: { pz: '#5E6270', py: '#7A7E8C', px: '#4E5260' }, faces: 'pzpypx' });            // cab skirt + bumper
  truck.box([X - 1.95, 0.35, -8.75, X + 0.33, 0.6, -7.65], { faceColor: { pz: '#D9E0E6', py: '#AEB6BE' }, faces: 'pzpy' });                 // bed floor
  truck.box([X - 1.95, 0.6, -7.72, X + 0.33, 0.92, -7.65], { faceColor: { pz: '#E4EAF0', py: '#F4F6F8' }, faces: 'pzpy' });                 // bed side gate
  dark.box([X - 1.95, 0.6, -7.645, X + 0.33, 0.625, -7.64], { color: '#8C94A0', faces: 'pz' });
  for (const gx of [-1.4, -0.8, -0.2]) dark.box([X + gx, 0.62, -7.645, X + gx + 0.025, 0.9, -7.64], { color: '#A0A8B4', faces: 'pz' });
  truck.box([X - 1.95, 0.6, -8.75, X - 1.9, 0.92, -7.65], { color: '#C8D0D8', faces: 'nxpy' });
  dark.box([X - 1.95, 0.25, -8.75, X + 0.33, 0.35, -7.62], { faceColor: { pz: '#5E6270', py: '#7A7E8C' }, faces: 'pzpy' });
  for (const wx of [-1.35, 0.9]) {
    dark.add(new THREE.CylinderGeometry(0.25, 0.25, 0.16, 18).rotateX(Math.PI / 2).translate(X + wx, 0.25, -7.6), '#3E3A50');
    dark.add(new THREE.CylinderGeometry(0.11, 0.11, 0.02, 14).rotateX(Math.PI / 2).translate(X + wx, 0.25, -7.51), '#C8CCD6');
  }
  // crates (Pon sits on one), the back fence with its gate
  for (const [x, y, z, s, c] of [[-1.05, 0, -5.6, 0.5, '#C99A6A'], [-1.65, 0, -5.9, 0.5, '#B88A5A'], [-1.35, 0.5, -6.1, 0.45, '#D8B07E'], [2.1, 0, -6.2, 0.55, '#C99A6A']]) crates.box([X + x - s / 2, y, z - s / 2, X + x + s / 2, y + s, z + s / 2], { color: c });
  fence.box([X - 4.0, 0, -10.2, X + 4.0, 2.0, -10.05], { faces: 'pz', tu: 2.6, tv: 2.0 });
  const m = (g, mat, cast = true) => { if (g.empty) return; const me = new THREE.Mesh(g.build(), mat); out.env.add(me); if (cast) out.casters.add(me); };
  m(lot, envMat({ map: tex.ground, vertexColors: true, grain: 0.05 }), false);
  m(truck, envMat({ vertexColors: true, grain: 0.25 }));
  m(dark, envMat({ vertexColors: true, grain: 0.2 }));
  m(crates, envMat({ map: tex.fence, vertexColors: true, grain: 0.4 }));
  m(fence, envMat({ map: tex.fence, alphaCut: 0.5, grain: 0.05, side: THREE.DoubleSide }));
  m(glass, envMat({ vertexColors: true, grain: 0 }), false);
  const R = rng(41), items = [];
  const clump = (cx, cy, cz, rx, ry, rz, d = 1) => { const n = Math.max(5, Math.round((8 + rx * ry * rz * 3.2) * d)), avg = (rx + ry + rz) / 3;
    for (let i = 0; i < n; i++) { const th = R() * 6.283, ph = Math.acos(2 * R() - 1), rr = 0.45 + 0.55 * Math.sqrt(R());
      items.push({ pos: [cx + Math.sin(ph) * Math.cos(th) * rx * rr * 0.8, cy + Math.cos(ph) * ry * rr * 0.75, cz + Math.sin(ph) * Math.sin(th) * rz * rr * 0.8], size: avg * (0.85 + R() * 0.5), rot: (R() - 0.5) * 0.5, cell: Math.floor(R() * 8), bright: 0.92 + R() * 0.14, clump: [cx, cy, cz, avg] }); } };
  clump(X - 3.0, 2.6, -11.0, 1.4, 1.2, 0.8, 0.8); clump(X + 2.8, 2.4, -11.2, 1.3, 1.1, 0.8, 0.8); clump(X - 3.1, 0.5, -3.0, 0.4, 0.5, 0.9); clump(X + 3.0, 0.55, -4.0, 0.4, 0.55, 0.8);
  out.env.add(billboards(items, tex.foliage, { cols: 4, rows: 2, receive: true, holes: 0.4 }));
  const gi = []; for (let i = 0; i < 34; i++) gi.push({ pos: [X - 3.6 + R() * 7.2, -0.01, -9.9 + R() * 0.3], size: 0.16 + R() * 0.18, rot: 0, cell: Math.floor(R() * 4), bright: 0.9 + R() * 0.2 });
  out.env.add(billboards(gi, tex.grass, { cols: 4, rows: 1, cylindrical: true, castShadow: false, rampLo: -0.8, rampHi: 0.2 }));
}

/* ---------------------------------------------------------------- the board scene */
export const BOARD = B;
export class BoardScene {
  /** tex: the street's texture set (shared, already uploaded); post: the street's PaintPost (shared). */
  constructor(renderer, tex, post) {
    this.renderer = renderer; this.tex = tex; this.post = post;
    this.env = new THREE.Scene(); this.late = new THREE.Scene(); this.casters = new Set();
    this.cam = new THREE.PerspectiveCamera(B.camera.fov, 16 / 9, 0.1, 1500);
    this.cats = new Map();       // `${scene}:${id}` -> {cat, rim, mats, anchor, base, lift, dim, sil, scene, id}
    this.sceneId = 'lane'; this.camX = 0; this.pan = null; this.drift = new THREE.Vector2(); this.driftTo = new THREE.Vector2();
    this.built = false; this.reduceMotion = false; this.time = 0;
  }
  sceneDef(id = this.sceneId) { return B.scenes.find((s) => s.id === id); }
  /** Build the three sets and the sky once. Cats are placed by setRoster(). */
  build() {
    if (this.built) return;
    const out = { env: this.env, casters: this.casters };
    for (const s of B.scenes) {
      const g = new THREE.Group(); g.name = 'set:' + s.id; const o2 = { env: g, casters: this.casters };
      if (s.id === 'lane') buildLane(this.tex, s.x, o2); else if (s.id === 'outsiders') buildOutsiders(this.tex, s.x, o2); else buildBell(this.tex, s.x, o2);
      this.env.add(g); s._group = g;
    }
    void out;
    // sky, clouds and a far sea band (the backdrop follows the camera, as on the street)
    this.back = new THREE.Group();
    this.back.add(skyDome(this.tex.skybrush));
    const cm = backdropMat(this.tex.clouds, { cloud: true, haze: 0 });
    for (const [az, w] of [[-6, 420], [22, 300], [-34, 280]]) { const hgt = w, g = new THREE.PlaneGeometry(w, hgt), uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.5 * uv.getX(i), uv.getY(i));
      const me = new THREE.Mesh(g, cm), a = THREE.MathUtils.degToRad(az); me.position.set(Math.sin(a) * 620, hgt / 2 + 30, -Math.cos(a) * 620); me.lookAt(0, me.position.y, 0); me.renderOrder = -8; this.back.add(me); }
    const sea = new THREE.Mesh(ringGeometry(700, -70, 70, -40, 0, 32), backdropMat(this.tex.sea, { haze: 0.12, keyK: 0.7 })); sea.renderOrder = -6; this.back.add(sea);
    const far = new THREE.Mesh(ringGeometry(640, -80, 80, Math.tan(-1 * Math.PI / 180) * 640, Math.tan(4 * Math.PI / 180) * 640, 48), backdropMat(this.tex.hillsFar, { haze: 0.35, keyK: 0.5 })); far.renderOrder = -7; this.back.add(far);
    this.env.add(this.back);
    this.shadow = null;   // created on first render (it takes over U.shadowMap while the board is open)
    this.keyLight = new THREE.DirectionalLight('#ffffff', 2.5); this.fill = new THREE.AmbientLight('#6E6AA8', 0.8); this.late.add(this.keyLight, this.fill);
    this.built = true;
  }
  /**
   * Place the cats for a roster: [{scene, id, cast:{cast, ...opts, extra}, discovered, state, slot}].
   * Cats are created once and reused (visibility only after that), so reopening is cheap.
   */
  setRoster(list) {
    const want = new Set();
    for (const r of list) {
      const def = this.sceneDef(r.scene); if (!def) continue;
      const sil = !r.discovered, key = `${r.scene}:${r.id}:${sil ? 'sil' : 'cat'}`; want.add(key);
      let c = this.cats.get(key);
      if (!c) {
        const cast = r.cast || { cast: 'tough' };
        let cat;
        // a silhouette gives nothing away: one generic body, flat Ink at 70% over the wall shade (no coat, Scars or pose)
        try { cat = sil ? createCat({ cast: 'tough', build: 'standard', ears: 'standard', tail: 'whip', carry: 'level', scale: 1.25 * CAT_K * (r.role === 'boss' ? 1.6 : 1), silhouette: true, silColor: '#4A3657', seed: 5, lod: 'low' })
          : createCat({ ...(cast.opts || {}), cast: cast.cast, scale: 1.25 * CAT_K * (cast.extra || 1), lod: 'auto' }); }
        catch (e) { console.warn('board cat skipped', r.id, e); continue; }
        const sk = cat.object3D.getObjectByProperty('isSkinnedMesh', true), mats = sk ? sk.material : [];
        for (const mm of mats) patchDim(mm, WIST);
        c = { cat, rim: sil ? null : addRim(cat), mats, scene: r.scene, id: r.id, sil, dim: 0, dimTo: 0, lift: 0, liftTo: 0 };
        this.late.add(cat.object3D); this.cats.set(key, c);
      }
      const a = r.at || (def.anchors[r.id] && def.anchors[r.id].at) || [0, 0, -5];
      c.base = new THREE.Vector3(def.x + a[0], a[1], a[2]); c.role = r.role;
      // staging scale per spot (near spots read a little small, like a painted set; key-screens §2.6 zones)
      const an = def.anchors[r.id]; if (!c.s0) c.s0 = c.cat.object3D.scale.x; c.cat.object3D.scale.setScalar(c.s0 * (r.at && r.at[3] ? r.at[3] : !r.at && an && an.scale ? an.scale : 1));   // a shade spot may carry its staging scale as a 4th value
      c.cat.object3D.position.copy(c.base);
      const face = r.face ?? (def.anchors[r.id] ? def.anchors[r.id].face : 0) ?? 0;
      c.cat.object3D.rotation.y = face;
      c.cat.setGait('idle', 0);
      c.cat.lookAt(sil ? null : new THREE.Vector3(def.x + B.camera.pos[0], B.camera.pos[1], B.camera.pos[2]));
    }
    for (const [k, c] of this.cats) { c.active = want.has(k); c.cat.object3D.visible = c.active && c.scene === this.sceneId; }
  }
  entry(scene, id) { for (const c of this.cats.values()) if (c.active && c.scene === scene && c.id === id) return c; return null; }
  setScene(id, animate = true) {
    const def = this.sceneDef(id); if (!def) return;
    const from = this.camX; this.sceneId = id;
    if (animate && !this.reduceMotion && from !== def.x) this.pan = { from, to: def.x, t: 0, dur: 0.32 };
    else { this.pan = null; this.camX = def.x; }
    for (const s of B.scenes) s._group.visible = s.id === id || !!this.pan;
    for (const c of this.cats.values()) c.cat.object3D.visible = c.active && (c.scene === id || !!this.pan);
  }
  /** focus: {scene,id} or null; related: Set of ids kept at full colour; dimOthers: whether anything dims. */
  setFocus(focusId, related, dimOthers) {
    for (const c of this.cats.values()) {
      if (c.scene !== this.sceneId) continue;
      const isF = focusId && c.id === focusId;
      c.dimTo = dimOthers && !isF && !(related && related.has(c.id)) ? 0.45 : 0;
      c.liftTo = isF ? 1 : 0;
      if (c.rim) c.rim.visible = !!isF;
    }
  }
  setDriftTo(px, py) { this.driftTo.set(this.reduceMotion ? 0 : px, this.reduceMotion ? 0 : py); }
  layout(w, h) {
    // lens shift: the vanishing point at principalY of 1080 (a level camera keeps verticals vertical)
    const s = h / 1080, F = (h / 2) / Math.tan(THREE.MathUtils.degToRad(B.camera.fov / 2)), ppx = w / 2 + this.drift.x * s, ppy = B.camera.principalY * s + this.drift.y * s;
    const fullW = 2 * Math.max(ppx, w - ppx), fullH = 2 * Math.max(ppy, h - ppy);
    this.cam.fov = 2 * Math.atan(fullH / 2 / F) * 180 / Math.PI; this.cam.aspect = fullW / fullH;
    this.cam.setViewOffset(fullW, fullH, fullW / 2 - ppx, fullH / 2 - ppy, w, h); this.cam.updateProjectionMatrix();
    this.w = w; this.h = h;
  }
  /** Phase lighting: Dusk gold by default (the board's own key, applied while it is open). */
  applyLight(phaseName = B.phase) {
    const p = typeof phaseName === 'object' ? phaseName : phaseName === 'dusk' ? boardDusk() : (PHASES[phaseName] || boardDusk()); applyPhase(p);
    CEL.keyDir.value.copy(sunDir(p)).normalize(); CEL.celTint.value.set(...hexArr(p.cel));
    U.lampWave.value = phaseName === 'day' ? -1 : 99;
    const light = { keyDir: new THREE.Vector3(...p.catDir).normalize(), keyColor: new THREE.Color(p.catKey), shadeColor: new THREE.Color(p.catShade), rimColor: new THREE.Color(p.catRim) };
    for (const c of this.cats.values()) if (!c.sil) c.cat.setLighting(light);
    this.keyLight.position.copy(sunDir(p)).multiplyScalar(10); this.keyLight.color.set(p.catKey); this.fill.color.set(p.shadow);
  }
  update(dt) {
    this.time += dt;
    if (this.pan) { const p = this.pan; p.t += dt; const k = Math.min(1, p.t / p.dur), e = k * k * (3 - 2 * k); this.camX = p.from + (p.to - p.from) * e;
      if (k >= 1) { this.pan = null; this.setScene(this.sceneId, false); } }
    const kd = Math.min(1, dt / 0.25); this.drift.lerp(this.driftTo, kd);
    const cp = B.camera.pos; this.cam.position.set(this.camX + cp[0], cp[1], cp[2]); this.cam.rotation.set(0, 0, 0);
    if (this.w) this.layout(this.w, this.h);
    this.cam.updateMatrixWorld();
    this.back.position.copy(this.cam.position);
    const k3 = Math.min(1, dt / 0.1);
    for (const c of this.cats.values()) {
      if (!c.cat.object3D.visible) continue;
      c.dim += (c.dimTo - c.dim) * (this.reduceMotion || dt === 0 ? 1 : k3); c.lift += (c.liftTo - c.lift) * (dt === 0 ? 1 : k3);
      for (const m of c.mats) if (m.uniforms && m.uniforms.uDim) m.uniforms.uDim.value = c.dim;
      // lift 4 px (key-screens §2.6): convert 4 screen px at the cat's depth into metres
      const d = Math.max(0.5, -(c.base.z - this.cam.position.z)), mPerPx = 2 * d * Math.tan(THREE.MathUtils.degToRad(B.camera.fov / 2)) / 1080;
      c.cat.object3D.position.set(c.base.x, c.base.y + c.lift * 4 * mPerPx, c.base.z);
      c.cat.update(dt);
    }
  }
  render() {
    const r = this.renderer;
    if (!this.shadow) { const prev = { map: U.shadowMap.value, texel: U.shadowTexel.value }; this.shadow = new SunShadow(1024, 9); this.shadowRT = U.shadowMap.value; U.shadowMap.value = prev.map; U.shadowTexel.value = prev.texel; }
    U.shadowMap.value = this.shadowRT; U.shadowTexel.value = 1 / 1024;
    this.shadow.target.set(this.camX, 0.8, -6.5);
    r.info.reset();
    this.shadow.update(r, [this.env], this.casters);
    r.info.reset();
    CEL.rtWidth.value = r.domElement.width; CEL.rtHeight.value = r.domElement.height;
    if (this.post) { r.setRenderTarget(this.post.rt); r.clear(); r.render(this.env, this.cam); this.post.mat.uniforms.sense.value = 0; this.post.render(r); }
    else { r.setRenderTarget(null); r.clear(); r.render(this.env, this.cam); }
    r.autoClear = false; r.render(this.late, this.cam); r.autoClear = true;
    this.stats = { calls: r.info.render.calls, triangles: r.info.render.triangles };
  }
  /** Screen position (CSS px) of a world point, or null behind the lens. */
  project(v) { const p = v.clone().project(this.cam); if (p.z > 1) return null; return { x: (p.x * 0.5 + 0.5) * this.w, y: (-p.y * 0.5 + 0.5) * this.h }; }
  /** Cat height (m) to the ear tips, for ribbons and head marks. */
  heightOf(c) { const s = c.cat.object3D.scale.y; return 0.36 * s; }
  /** Mouse ray against per-cat capsules (feet to head, radius ≈ body half-width). Returns the nearest entry. */
  pick(px, py) {
    const ndc = new THREE.Vector2(px / this.w * 2 - 1, -(py / this.h) * 2 + 1), ray = new THREE.Raycaster(); ray.setFromCamera(ndc, this.cam);
    let best = null, bd = Infinity; const a = new THREE.Vector3(), b = new THREE.Vector3(), on = new THREE.Vector3(), seg = new THREE.Vector3();
    for (const c of this.cats.values()) {
      if (!c.active || c.scene !== this.sceneId || !c.cat.object3D.visible) continue;
      const h = this.heightOf(c), r = 0.17 * c.cat.object3D.scale.y;
      a.copy(c.cat.object3D.position).y += r * 0.6; b.copy(c.cat.object3D.position).y += h - r * 0.4;
      const d2 = ray.ray.distanceSqToSegment(a, b, on, seg);
      if (d2 < r * r) { const dd = on.distanceTo(ray.ray.origin); if (dd < bd) { bd = dd; best = c; } }
    }
    return best;
  }
  /** Scene-switch helper for evidence: total triangles in the visible set. */
}
/** The board's own Dusk key: late-afternoon gold poured down the alley from high over the porch (the street's Dusk
 *  sun sits behind the porch at 16°, which would leave the whole set in shade). */
function boardDusk() { const p = mixPhase('day', 'dusk', 0.62); p.sunEl = 50; p.sunAz = -14; p.catDir = [-0.2, 0.85, 0.5]; p.hazeMax = 0.35; return p; }
function hexArr(h) { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }
export { INK, GOLD, CREAM };

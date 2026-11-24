// PROTOTYPE - NOT FOR PRODUCTION
// Builds the M0 lane corner from lane.json: painted, unlined environment geometry (merged
// per material), billboard foliage, backdrop rings, the inked stone-lantern Scent Post, and
// collision boxes for movement and the camera.
import * as THREE from 'three';
import { envMat, billboards, skyDome, backdropMat, ringGeometry, celMat, hullMat, U, CEL } from '../render/env.js';
import { rgb } from '../render/phases.js';
import { groundY } from './lane-m2.js';

/* --------------------------------------------------------------- tiny deterministic noise */
function rng(seed) { let a = (seed | 0) + 0x6D2B79F5; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const s = (t) => t * t * (3 - 2 * t), u = s(xf), v = s(yf), w = s(zf);
  const L = (a, b, t) => a + (b - a) * t;
  const c = (i, j, k) => hash(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
}

/** Weld coincident vertices and recompute normals (soft, facet-free cel shading on boxy props). */
function mergeSmooth(g) {
  g = g.index ? g.toNonIndexed() : g; const P = g.attributes.position, map = new Map(), pos = [], idx = [];
  for (let i = 0; i < P.count; i++) { const k = `${P.getX(i).toFixed(4)},${P.getY(i).toFixed(4)},${P.getZ(i).toFixed(4)}`; let j = map.get(k);
    if (j == null) { j = pos.length / 3; map.set(k, j); pos.push(P.getX(i), P.getY(i), P.getZ(i)); } idx.push(j); }
  const o = new THREE.BufferGeometry(); o.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); o.setIndex(idx); o.computeVertexNormals();
  // round the block a little: push vertices toward a superellipsoid so the silhouette reads as a worn stone
  const Q = o.attributes.position; for (let i = 0; i < Q.count; i++) { const v = new THREE.Vector3(Q.getX(i), Q.getY(i), Q.getZ(i)); const l = v.length(); v.multiplyScalar(0.88 + 0.12 * (0.35 / Math.max(l, 0.01))); Q.setXYZ(i, v.x, v.y, v.z); }
  o.computeVertexNormals(); return o.toNonIndexed();
}

/* --------------------------------------------------------------- geometry accumulator */
class Geo {
  constructor() { this.p = []; this.n = []; this.uv = []; this.c = []; this.i = []; }
  /** Quad a,b,c,d (counter-clockwise seen from the front), subdivided nu x nv; uvf(point) -> [u,v]. */
  quad(a, b, c, d, uvf, o = {}) {
    const nu = o.nu || 1, nv = o.nv || 1, base = this.p.length / 3;
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), C = new THREE.Vector3(...c), D = new THREE.Vector3(...d);
    const nrm = new THREE.Vector3().subVectors(B, A).cross(new THREE.Vector3().subVectors(D, A)).normalize();
    const col = o.color ? rgb(o.color) : new THREE.Vector3(1, 1, 1);
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const u = i / nu, v = j / nv;
      const P = new THREE.Vector3().copy(A).lerp(B, u).lerp(new THREE.Vector3().copy(D).lerp(C, u), v);
      const uvp = uvf(P);
      if (o.wobble) { const k = o.wobble * vnoise(P.x * 1.7, P.y * 1.7, P.z * 1.7); const edge = (i === 0 || i === nu || j === 0 || j === nv) ? 0.5 : 1; P.addScaledVector(nrm, k * edge); }
      this.p.push(P.x, P.y, P.z); this.n.push(nrm.x, nrm.y, nrm.z); this.uv.push(uvp[0], uvp[1]);
      const ao = o.ao ? o.ao(P) : 1;
      this.c.push(col.x * ao, col.y * ao, col.z * ao);
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const k = base + j * (nu + 1) + i;
      this.i.push(k, k + 1, k + nu + 2, k, k + nu + 2, k + nu + 1);
    }
  }
  /** Axis box [x0,y0,z0,x1,y1,z1]. faces: which to emit; uv tile sizes tu,tv (m); seg: metres per subdivision. */
  box(bx, o = {}) {
    const [x0, y0, z0, x1, y1, z1] = bx, tu = o.tu || 1, tv = o.tv || 1, seg = o.seg || 0.6;
    const F = o.faces || 'pxnxpynypznz', sub = (len) => Math.max(1, Math.round(len / seg));
    const vy = (P) => (P.y - y0) / tv;
    const fc = (k) => (o.faceColor && o.faceColor[k]) || o.color;
    if (F.includes('px')) this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], (P) => [(z1 - P.z) / tu, vy(P)], { ...o, color: fc('px'), nu: sub(z1 - z0), nv: sub(y1 - y0) });
    if (F.includes('nx')) this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], (P) => [(P.z - z0) / tu, vy(P)], { ...o, color: fc('nx'), nu: sub(z1 - z0), nv: sub(y1 - y0) });
    if (F.includes('pz')) this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], (P) => [(P.x - x0) / tu, vy(P)], { ...o, color: fc('pz'), nu: sub(x1 - x0), nv: sub(y1 - y0) });
    if (F.includes('nz')) this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], (P) => [(x1 - P.x) / tu, vy(P)], { ...o, color: fc('nz'), nu: sub(x1 - x0), nv: sub(y1 - y0) });
    if (F.includes('py')) this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], (P) => [P.x / tu, P.z / tu], { ...o, color: fc('py'), nu: sub(x1 - x0), nv: sub(z1 - z0) });
    if (F.includes('ny')) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], (P) => [P.x / tu, P.z / tu], { ...o, color: fc('ny'), nu: 1, nv: 1 });
  }
  tri(a, b, c, uvf, o = {}) {
    const base = this.p.length / 3, A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), C = new THREE.Vector3(...c);
    const nrm = new THREE.Vector3().subVectors(B, A).cross(new THREE.Vector3().subVectors(C, A)).normalize();
    const col = o.color ? rgb(o.color) : new THREE.Vector3(1, 1, 1);
    for (const P of [A, B, C]) { const t = uvf(P); this.p.push(P.x, P.y, P.z); this.n.push(nrm.x, nrm.y, nrm.z); this.uv.push(t[0], t[1]); this.c.push(col.x, col.y, col.z); }
    this.i.push(base, base + 1, base + 2);
  }
  /** Append an existing BufferGeometry (positions/normals; uv optional), tinted. */
  add(g, color, uvScale = 1) {
    g = g.index ? g.toNonIndexed() : g; const base = this.p.length / 3, col = rgb(color || '#FFFFFF');
    const P = g.attributes.position, N = g.attributes.normal, T = g.attributes.uv;
    for (let k = 0; k < P.count; k++) {
      this.p.push(P.getX(k), P.getY(k), P.getZ(k)); this.n.push(N.getX(k), N.getY(k), N.getZ(k));
      this.uv.push(T ? T.getX(k) * uvScale : 0, T ? T.getY(k) * uvScale : 0); this.c.push(col.x, col.y, col.z); this.i.push(base + k);
    }
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(this.n, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.setIndex(this.i); g.computeBoundingSphere(); return g;
  }
}

/* --------------------------------------------------------------- the builder */
export function buildWorld(L, tex) {
  const env = new THREE.Group(), backdrop = new THREE.Group(), late = new THREE.Group();
  const colliders = [], casters = new Set(), cards = [];
  const mesh = (geo, mat, cast = true) => { const m = new THREE.Mesh(geo, mat); env.add(m); if (cast) casters.add(m); return m; };
  const R = rng(7);

  /* ---- ground: lane strip + garden terrain, with the crest dropping toward the sea */
  const cz = L.crest.z, h = (z) => (z >= cz ? 0 : L.crest.dropTo * Math.min(1, Math.pow((cz - z) / (cz - L.crest.dropZ), 1.3)));
  const ao = (P) => {
    // painted contact darkening at wall / fence feet (vertex colour, multiplied; never grey: tinted wisteria)
    let d = Math.abs(P.x - L.lane.x0); if (P.z < -13.85 || P.z > 26) d = 9;
    let e = Math.abs(P.x - L.lane.x1); if (P.z < -7.85 || P.z > 7.5) e = 9;
    const k = 0.28 * Math.exp(-Math.min(d, e) / 0.28);
    return 1 - k;
  };
  {
    const g = new Geo(), x0 = L.lane.x0, x1 = L.lane.x1;
    const zs = []; for (let z = L.lane.z1; z > -60; z -= (z > cz ? 0.5 : 1.5)) zs.push(z); zs.push(-60);
    for (let k = 0; k < zs.length - 1; k++) {
      const za = zs[k], zb = zs[k + 1];
      g.quad([x0, h(za), za], [x1, h(za), za], [x1, h(zb), zb], [x0, h(zb), zb], (P) => [P.x / 4, -P.z / 4], { nu: 8, nv: 1, ao, wobble: 0 });
    }
    const geo = g.build(); geo.attributes.color.array.forEach((v, i, a) => { }); // ao already in vertex colours
    const m = envMat({ map: tex.ground, vertexColors: true, grain: 0.0, tint: '#FFFFFF', tintScale: 1.02 }); // lit lane kept in the walkable band (L* ≤ 80, art bible §4.2)
    // tint the vertex-colour darkening toward wisteria (the colour channel multiplies per channel)
    const col = geo.attributes.color;
    for (let i = 0; i < col.count; i++) { const k = 1 - col.getX(i); col.setXYZ(i, 1 - k * 0.95, 1 - k, 1 - k * 0.55); }
    mesh(geo, m, false).name = 'lane';
  }
  {
    const g = new Geo();
    const xs = [-400, -160, -80, -40, -20, -10, -5, -1.6, 1.6, 5, 10, 20, 40, 80, 160, 400];
    const zs = [400, 160, 80, 40, 26, 10, 0, -8, -14, -16, -20, -26, -34, -42, -60, -90, -160, -400];
    for (let a = 0; a < xs.length - 1; a++) for (let b = 0; b < zs.length - 1; b++) {
      const xa = xs[a], xb = xs[a + 1], za = zs[b], zb = zs[b + 1];
      const y = (z) => h(z) - (Math.abs(xa) < 2 && Math.abs(xb) < 2 ? 0.02 : 0.005);
      g.quad([xa, y(za), za], [xb, y(za), za], [xb, y(zb), zb], [xa, y(zb), zb], (P) => [P.x / 4, -P.z / 4], { nu: 1, nv: 1 });
    }
    mesh(g.build(), envMat({ map: tex.garden, grain: 0.1 }), false).name = 'terrain';
  }

  /* ---- plaster walls with pale coping (the High Road ribbon) */
  {
    const gs = new Map(), c = new Geo(), n = new Geo();
    for (const w of L.walls) {
      const [x0, y0, z0, x1, y1, z1] = [Math.min(w.box[0], w.box[3]), w.box[1], Math.min(w.box[2], w.box[5]), Math.max(w.box[0], w.box[3]), w.box[4], Math.max(w.box[2], w.box[5])];
      const key = w.tint || '#FFFFFF'; if (!gs.has(key)) gs.set(key, new Geo()); const g = gs.get(key);
      g.box([x0, y0, z0, x1, y1, z1], { faces: 'pxnxpznz', tu: 3, tv: Math.min(y1 - y0, 1.7), wobble: 0.012, seg: 0.5 });
      const k = w.coping, o = 0.035;
      c.box([x0 - o, y1, z0 - o, x1 + o, y1 + k, z1 + o], { tu: 1, tv: 1, faceColor: { py: '#F7F3E8', px: '#CBD2D6', nx: '#CBD2D6', pz: '#D9DEE0', nz: '#D9DEE0', ny: '#9AA4B4' }, wobble: 0.006, seg: 0.5 });
      colliders.push(new THREE.Box3(new THREE.Vector3(x0 - o, y0, z0 - o), new THREE.Vector3(x1 + o, y1 + k, z1 + o)));
    }
    for (const [tint, g] of gs) mesh(g.build(), envMat({ map: tex.wall, grain: 0.05, tint })).name = 'walls';
    mesh(c.build(), envMat({ vertexColors: true, grain: 0.5 })).name = 'coping';
    // a posted notice with Scribble (E-8)
    const nt = L.notice;
    n.quad([nt.x + 0.006, nt.y, nt.z + nt.w / 2], [nt.x + 0.006, nt.y, nt.z - nt.w / 2], [nt.x + 0.006, nt.y + nt.h, nt.z - nt.w / 2], [nt.x + 0.006, nt.y + nt.h, nt.z + nt.w / 2], (P) => [(nt.z + nt.w / 2 - P.z) / nt.w, (P.y - nt.y) / nt.h]);
    mesh(n.build(), envMat({ map: tex.notice, alphaCut: 0.5, grain: 0 }), false);
  }

  /* ---- board fence */
  {
    const g = new Geo();
    for (const f of L.fences) {
      const [x0, y0, z0, x1, y1, z1] = [Math.min(f.box[0], f.box[3]), f.box[1], Math.min(f.box[2], f.box[5]), Math.max(f.box[0], f.box[3]), f.box[4], Math.max(f.box[2], f.box[5])];
      g.box([x0, y0, z0, x1, y1, z1], { faces: 'pxnxpznz', tu: 2.6, tv: y1 - y0, wobble: 0.008, seg: 0.65 });
      colliders.push(new THREE.Box3(new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1)));
    }
    mesh(g.build(), envMat({ map: tex.fence, alphaCut: 0.5, grain: 0.05, side: THREE.DoubleSide })).name = 'fence';
  }

  /* ---- the lower town stepping down toward the sea (seeded houses on the slope) */
  const townClumps = [];
  if (L.town) {
    const T = L.town, r2 = rng(T.seed); let made = 0, tries = 0;
    const boxes = [];
    while (made < T.count && tries++ < 400) {
      const w = 5 + r2() * 3.5, d = 4 + r2() * 3, x = T.x[0] + r2() * (T.x[1] - T.x[0]), z = T.z[0] + r2() * (T.z[1] - T.z[0]);
      if (Math.abs(x) < T.laneClear + w / 2) continue;
      const bb = [x - w / 2, z - d / 2, x + w / 2, z + d / 2];
      if (boxes.some((b) => bb[0] < b[2] + 1.5 && bb[2] > b[0] - 1.5 && bb[1] < b[3] + 1.5 && bb[3] > b[1] - 1.5)) continue;
      boxes.push(bb); made++;
      const y0 = h(z + d / 2) - 1.2, hh = 2.1 + r2() * 0.5;
      L.houses.push({ box: [bb[0], y0, bb[1], bb[2], h(z + d / 2) + hh, bb[3]], roof: 1.4 + r2() * 0.5, ridge: r2() < 0.6 ? 'x' : 'z', windows: [['+z', 0.3 + r2() * 0.4, 1.0 + 1.2, 1.2, 0.8]], town: true });
      if (r2() < 0.7) townClumps.push([x + (r2() < 0.5 ? -1 : 1) * (w / 2 + 0.8), h(z) + 1.2, z + (r2() - 0.5) * d, 1.6 + r2(), 1.2, 1.6 + r2()]);
    }
  }

  /* ---- houses: plaster-and-wood walls, tiled gable roofs, windows */
  {
    const w = new Geo(), r = new Geo(), win = new Geo();
    for (const hs of L.houses) {
      const [x0, y0, z0, x1, y1, z1] = hs.box, oh = 0.45, rh = hs.roof;
      w.box([x0, y0, z0, x1, y1, z1], { faces: 'pxnxpznz', tu: 3, tv: 3, wobble: 0.02, seg: 1 });
      if (!hs.town) colliders.push(new THREE.Box3(new THREE.Vector3(x0, y0 - 1, z0), new THREE.Vector3(x1, y1 + rh, z1)));
      const ruv = (P) => [P.x / 3 + P.z / 3, P.y / 2];
      if (hs.ridge === 'x') {
        const zm = (z0 + z1) / 2, ry = y1 + rh;
        r.quad([x0 - oh, y1 - 0.25, z1 + oh], [x1 + oh, y1 - 0.25, z1 + oh], [x1 + oh, ry, zm], [x0 - oh, ry, zm], (P) => [P.x / 3, (P.z - zm) / -3], { nu: 4, nv: 2, wobble: 0.04 });
        r.quad([x1 + oh, y1 - 0.25, z0 - oh], [x0 - oh, y1 - 0.25, z0 - oh], [x0 - oh, ry, zm], [x1 + oh, ry, zm], (P) => [-P.x / 3, (P.z - zm) / 3], { nu: 4, nv: 2, wobble: 0.04 });
        w.tri([x1, y1, z1], [x1, y1, z0], [x1, ry, zm], (P) => [(z1 - P.z) / 3, P.y / 3 - y0 / 3]);
        w.tri([x0, y1, z0], [x0, y1, z1], [x0, ry, zm], (P) => [(P.z - z0) / 3, P.y / 3 - y0 / 3]);
      } else {
        const xm = (x0 + x1) / 2, ry = y1 + rh;
        r.quad([x1 + oh, y1 - 0.25, z1 + oh], [x1 + oh, y1 - 0.25, z0 - oh], [xm, ry, z0 - oh], [xm, ry, z1 + oh], (P) => [-P.z / 3, (P.x - xm) / -3], { nu: 4, nv: 2, wobble: 0.04 });
        r.quad([x0 - oh, y1 - 0.25, z0 - oh], [x0 - oh, y1 - 0.25, z1 + oh], [xm, ry, z1 + oh], [xm, ry, z0 - oh], (P) => [P.z / 3, (P.x - xm) / 3], { nu: 4, nv: 2, wobble: 0.04 });
        w.tri([x0, y1, z1], [x1, y1, z1], [xm, ry, z1], (P) => [(P.x - x0) / 3, P.y / 3 - y0 / 3]);
        w.tri([x1, y1, z0], [x0, y1, z0], [xm, ry, z0], (P) => [(x1 - P.x) / 3, P.y / 3 - y0 / 3]);
      }
      for (const [face, u, vc, ww, wh] of hs.windows) {
        const e = 0.01, yb = y0 + vc - wh / 2, yt = y0 + vc + wh / 2;
        const uvq = (a, b, c, d) => win.quad(a, b, c, d, (P) => [0, 0], {});
        let q;
        if (face === '+z') { const xc = x0 + (x1 - x0) * u; q = [[xc - ww / 2, yb, z1 + e], [xc + ww / 2, yb, z1 + e], [xc + ww / 2, yt, z1 + e], [xc - ww / 2, yt, z1 + e]]; }
        if (face === '-z') { const xc = x0 + (x1 - x0) * u; q = [[xc + ww / 2, yb, z0 - e], [xc - ww / 2, yb, z0 - e], [xc - ww / 2, yt, z0 - e], [xc + ww / 2, yt, z0 - e]]; }
        if (face === '+x') { const zc = z0 + (z1 - z0) * u; q = [[x1 + e, yb, zc + ww / 2], [x1 + e, yb, zc - ww / 2], [x1 + e, yt, zc - ww / 2], [x1 + e, yt, zc + ww / 2]]; }
        if (face === '-x') { const zc = z0 + (z1 - z0) * u; q = [[x0 - e, yb, zc - ww / 2], [x0 - e, yb, zc + ww / 2], [x0 - e, yt, zc + ww / 2], [x0 - e, yt, zc - ww / 2]]; }
        const base = win.uv.length; uvq(...q);
        win.uv.splice(base, 8, 0, 0, 1, 0, 0, 1, 1, 1);
      }
    }
    mesh(w.build(), envMat({ map: tex.house, grain: 0.05 })).name = 'houses';
    const rm = mesh(r.build(), envMat({ map: tex.roof, grain: 0.05, side: THREE.DoubleSide })); rm.name = 'roofs';
    mesh(win.build(), envMat({ map: tex.window, grain: 0, glass: 1 }), false).name = 'windows';
  }

  /* ---- utility pole, far poles, wires; laundry pole with sheets */
  const wires = [];
  {
    const g = new Geo(), lp = new Geo();
    const pole = (x, z, H, top) => {
      const c = new THREE.CylinderGeometry(0.105, 0.15, H, 10, 4); c.translate(x, H / 2, z); g.add(c, '#A39684');
      const arms = [[H * 0.94, 1.5], [H * 0.84, 1.15]], ins = [];
      for (const [y, len] of arms) {
        const b = new THREE.BoxGeometry(len, 0.1, 0.1); b.translate(x, y, z); g.add(b, '#9C9080');
        for (const k of [-0.46, -0.2, 0.2, 0.46]) { const s = new THREE.CylinderGeometry(0.035, 0.045, 0.12, 6); s.translate(x + k * len, y + 0.11, z); g.add(s, '#EEE9DC'); ins.push(new THREE.Vector3(x + k * len, y + 0.17, z)); }
      }
      if (top) { const t = new THREE.CylinderGeometry(0.2, 0.2, 0.62, 10); t.rotateZ(-0.09); t.translate(x + 0.32, H * 0.66, z); g.add(t, '#93A0AE'); }
      return ins;
    };
    const P0 = L.pole, ins0 = pole(P0.at[0], P0.at[1], P0.h, true);
    { const b = new THREE.Box3(new THREE.Vector3(P0.at[0] - 0.15, 0, P0.at[1] - 0.15), new THREE.Vector3(P0.at[0] + 0.15, P0.h, P0.at[1] + 0.15)); b.soft = true; colliders.push(b); }
    const far = L.farPoles.map(([x, z]) => pole(x, z, P0.h, false));
    // wires: catenaries from the near pole to each far pole, plus a service drop to the house
    const cat = (a, b, sag) => { const pts = []; for (let i = 0; i <= 24; i++) { const t = i / 24; const p = a.clone().lerp(b, t); p.y -= sag * 4 * t * (1 - t); pts.push(p); } return pts; };
    for (const f of far) for (const k of [0, 3, 5]) wires.push(cat(ins0[k], f[k], 0.5 + 0.08 * k));
    wires.push(cat(ins0[1], new THREE.Vector3(5.2, 2.6, -10.2), 0.35));
    wires.push(cat(ins0[6], new THREE.Vector3(-5.5, 2.5, -14.8), 0.4));
    mesh(g.build(), envMat({ vertexColors: true, grain: 0.7 })).name = 'poles';
    // laundry: posts, rail, sheets (camera-soft; they catch the sun)
    const LD = L.laundry, [[ax, az], [bx, bz]] = LD.posts;
    for (const [x, z] of LD.posts) { const c = new THREE.CylinderGeometry(0.03, 0.035, LD.h, 6); c.translate(x, LD.h / 2, z); lp.add(c, '#A8998A'); }
    const rail = new THREE.CylinderGeometry(0.022, 0.022, Math.hypot(bx - ax, bz - az) + 0.3, 6); rail.rotateZ(Math.PI / 2); rail.translate((ax + bx) / 2, LD.h - 0.08, (az + bz) / 2); lp.add(rail, '#C2B4A2');
    mesh(lp.build(), envMat({ vertexColors: true, grain: 0.6 })).name = 'laundryPoles';
    const sg = new Geo();
    for (const [u0, u1, len, col] of LD.sheets) {
      const xa = ax + (bx - ax) * u0, xb = ax + (bx - ax) * u1, y = LD.h - 0.08;
      sg.quad([xa, y - len, az], [xb, y - len, az], [xb, y, az], [xa, y, az], (P) => [0, 0], { color: col, nu: 4, nv: 3 });
    }
    const sgeo = sg.build(); const sp = sgeo.attributes.position;
    for (let i = 0; i < sp.count; i++) sp.setZ(i, sp.getZ(i) + Math.sin(sp.getX(i) * 7.0) * 0.035 * (1 - (sp.getY(i) - 1.4) / 1.0));
    sgeo.computeVertexNormals();
    mesh(sgeo, envMat({ vertexColors: true, grain: 0.55, side: THREE.DoubleSide, twoSided: true, flutter: 1, hangY: LD.h - 0.08 })).name = 'laundry';
  }
  {
    const wm = envMat({ tint: '#4A4560', grain: 0 }); wm.uniforms.shadeMul = { value: new THREE.Vector3(1, 1, 1) };
    for (const pts of wires) { const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.011, 4), wm); late.add(t); }
  }

  /* ---- trees, hedges, spill-over clump, hydrangeas, grass (billboard paint) */
  {
    const items = [], tg = new Geo();
    const clump = (cx, cy, cz, rx, ry, rz, density = 1) => {
      const vol = rx * ry * rz, n = Math.max(5, Math.round((8 + vol * 3.2) * density)), avg = (rx + ry + rz) / 3;
      for (let i = 0; i < n; i++) {
        const th = R() * Math.PI * 2, ph = Math.acos(2 * R() - 1), rr = 0.45 + 0.55 * Math.sqrt(R());
        const p = [cx + Math.sin(ph) * Math.cos(th) * rx * rr * 0.8, cy + Math.cos(ph) * ry * rr * 0.75, cz + Math.sin(ph) * Math.sin(th) * rz * rr * 0.8];
        items.push({ pos: p, size: avg * (0.85 + R() * 0.5), rot: (R() - 0.5) * 0.5, cell: Math.floor(R() * 8), bright: 0.92 + R() * 0.14, clump: [cx, cy, cz, avg] });
      }
    };
    for (const t of L.trees) {
      const [x, z] = t.trunk, c = new THREE.CylinderGeometry(0.1, 0.17, t.h, 8, 3); c.translate(x, t.h / 2 + (t.base || 0), z); tg.add(c, '#8A6A50');
      for (const k of t.clumps) clump(...k);
    }
    for (const k of L.hedges) clump(...k, 1.2);
    for (const k of townClumps) clump(...k, 0.7);
    mesh(tg.build(), envMat({ vertexColors: true, grain: 0.8 })).name = 'trunks';
    cards.push(...items.map((it) => ({ p: it.pos, s: it.size, y: it.pos[1] })), ...L.hydrangeas.map(([x, z, s]) => ({ p: [x, s * 0.4, z], s, y: -s * 0.1 })));
    const fol = billboards(items, tex.foliage, { cols: 4, rows: 2, receive: true, holes: 0.5 }); env.add(fol); casters.add(fol); fol.name = 'foliage';
    const fl = L.hydrangeas.map(([x, z, s], i) => ({ pos: [x - s * 0.15, -s * 0.1, z], size: s, rot: 0, cell: i % 2, bright: 1 }));
    const flw = billboards(fl, tex.flowers, { cols: 2, rows: 1, cylindrical: true, rampLo: -0.6, rampHi: 0.3, keyK: 0.45 }); env.add(flw); casters.add(flw); flw.name = 'hydrangeas';
    const gi = [];
    for (const [x0, z0, x1, z1, n] of L.grassLines) for (let i = 0; i < n; i++) { const t = R(); gi.push({ pos: [x0 + (x1 - x0) * t + (R() - 0.5) * 0.06, -0.01, z0 + (z1 - z0) * t], size: 0.16 + R() * 0.16, rot: 0, cell: Math.floor(R() * 4), bright: 0.9 + R() * 0.2 }); }
    const gr = billboards(gi, tex.grass, { cols: 4, rows: 1, cylindrical: true, castShadow: false, rampLo: -0.8, rampHi: 0.2 }); env.add(gr); gr.name = 'grass';
  }

  /* ---- inked cel props (L-1: a cat can act on them): Scent Post lantern, bucket, pots */
  const soft = [];  // camera-soft late objects: hidden when they crowd the lens or hide Mikan
  const shadeOf = (v) => { const s = rgb('#D8D2EA'); return new THREE.Vector3(v.x * s.x * 0.96, v.y * s.y * 0.96, v.z * s.z * 0.96); };
  const celPart = (g, colorAt, centre) => {
    g = g.index ? g : g; g.computeVertexNormals();
    const P = g.attributes.position, N = g.attributes.normal, C = [], S = [], SN = [];
    for (let i = 0; i < P.count; i++) {
      const p = new THREE.Vector3(P.getX(i), P.getY(i), P.getZ(i)), n = new THREE.Vector3(N.getX(i), N.getY(i), N.getZ(i));
      const c = colorAt(p, n), sh = shadeOf(c);
      C.push(c.x, c.y, c.z); S.push(sh.x, sh.y, sh.z);
      const d = p.clone().sub(centre); d.y *= 1.4; d.normalize(); SN.push(d.x, d.y, d.z);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.setAttribute('shadeCol', new THREE.Float32BufferAttribute(S, 3)); g.setAttribute('smoothN', new THREE.Float32BufferAttribute(SN, 3));
    return g;
  };
  const celProp = (parts, x, z, name, rotY = 0, y = 0) => {
    // each inked prop owns its fade uniform: camera-soft props dither to 30% (never hidden)
    const fade = { value: 1 }, cm = celMat(fade), hm = hullMat(2.0, fade);
    const grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.y = rotY; grp.name = name; grp.userData.fade = fade;
    for (const g of parts) { const m = new THREE.Mesh(g, cm); grp.add(m); casters.add(m); if (!g.userData.noHull) grp.add(new THREE.Mesh(g, hm)); }
    late.add(grp); return grp;
  };
  const lathe = (prof, seg = 24) => new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  const solid = (hex) => () => rgb(hex);
  {
    // Stone lantern, repainted: round lathe parts (no facets), warm stone with painted moss
    // patches and a green drip, a soft terminator; the fire-box window stays the dark square.
    const [lx, lz] = L.lantern.at, sc = L.lantern.h / 1.2;
    const stone = rgb('#C2BDB4'), moss = rgb('#93B470'), mossD = rgb('#7FA35E');
    const mossAt = (p, n) => {
      const nz = vnoise(p.x * 9 + 3, p.y * 9, p.z * 9) * 0.5 + vnoise(p.x * 23, p.y * 23 + 1, p.z * 23) * 0.25;
      const top = n.y > 0.35 ? 0.45 : 0, drip = (Math.abs(Math.atan2(p.x, p.z) + 2.3) < 0.35 && p.y > 0.25 && p.y < 0.75) ? 0.55 : 0, foot = p.y < 0.12 && p.x < 0 ? 0.5 : 0;
      const k = THREE.MathUtils.smoothstep(nz + top + drip + foot, 0.55, 0.75);
      return stone.clone().lerp(nz > 0.2 ? mossD : moss, k);
    };
    const S = (v) => v * sc, parts = [];
    const add = (prof, seg, yc) => { const g = lathe(prof.map(([r, y]) => [S(r), S(y)]), seg); parts.push(celPart(g, mossAt, new THREE.Vector3(0, S(yc), 0))); };
    add([[0, 0], [0.25, 0], [0.26, 0.04], [0.22, 0.1], [0.09, 0.12], [0, 0.12]], 28, 0.06);             // base
    add([[0, 0.1], [0.09, 0.1], [0.08, 0.32], [0.085, 0.55], [0, 0.55]], 20, 0.33);                     // shaft
    add([[0, 0.53], [0.17, 0.53], [0.22, 0.58], [0.2, 0.64], [0, 0.64]], 28, 0.59);                     // platform
    add([[0, 0.63], [0.15, 0.63], [0.15, 0.87], [0, 0.87]], 24, 0.75);                                  // fire box
    add([[0, 0.85], [0.36, 0.86], [0.34, 0.9], [0.2, 0.97], [0.07, 1.06], [0, 1.08]], 32, 0.95);        // roof with up-turned eave
    add([[0, 1.04], [0.05, 1.07], [0.055, 1.12], [0.02, 1.19], [0, 1.2]], 16, 1.12);                    // jewel
    for (const sgn of [-1, 1]) { // window openings (front/back), dark, no hull
      const b = new THREE.BoxGeometry(S(0.15), S(0.13), 0.02); b.translate(0, S(0.765), sgn * S(0.145));
      const g = b.toNonIndexed(); g.userData.noHull = true; parts.push(celPart(g, solid('#4E4858'), new THREE.Vector3(0, S(0.76), 0)));
    }
    const grp = celProp(parts, lx, lz, 'lantern', 0.35);
    soft.push({ obj: grp, x: lx, z: lz, r: 0.6 });
    { const b = new THREE.Box3(new THREE.Vector3(lx - 0.25, 0, lz - 0.25), new THREE.Vector3(lx + 0.25, 1.2 * sc, lz + 0.25)); b.soft = true; colliders.push(b); }
    env.add(contactBlob(lx + 0.02, lz, 0.42, 0.3));
  }
  for (const pr of L.props || []) {
    const [kind, x, z] = pr, parts = [];
    if (kind === 'bucket') {
      parts.push(celPart(lathe([[0, 0.005], [0.1, 0.005], [0.115, 0.02], [0.14, 0.26], [0.125, 0.26], [0.105, 0.03], [0, 0.03]]), solid('#7FB2D9'), new THREE.Vector3(0, 0.13, 0)));
      const rim = new THREE.TorusGeometry(0.138, 0.012, 6, 24); rim.rotateX(Math.PI / 2); rim.translate(0, 0.26, 0); parts.push(celPart(rim, solid('#A9D2EE'), new THREE.Vector3(0, 0.26, 0)));
      const h = new THREE.TorusGeometry(0.14, 0.006, 4, 16, Math.PI); h.rotateZ(0.25); h.translate(0, 0.26, 0); h.userData.noHull = true; parts.push(celPart(h, solid('#33273B'), new THREE.Vector3(0, 0.3, 0)));
    } else {
      parts.push(celPart(lathe([[0, 0.005], [0.09, 0.005], [0.12, 0.2], [0.135, 0.205], [0.135, 0.245], [0.11, 0.245], [0.1, 0.22], [0, 0.22]]), (p) => rgb(p.y > 0.2 ? '#D98A5C' : '#C9764A'), new THREE.Vector3(0, 0.12, 0)));
      if (kind === 'aloe') for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 2 + 0.3, tilt = 0.25 + (i % 3) * 0.22, len = 0.32 + (i % 2) * 0.12;
        const c = new THREE.ConeGeometry(0.028, len, 5); c.translate(0, len / 2, 0); c.rotateZ(tilt); c.rotateY(a); c.translate(0, 0.21, 0);
        parts.push(celPart(c, solid('#6FAE55'), new THREE.Vector3(0, 0.4, 0)));
      }
    }
    const grp = celProp(parts, x, z, kind, pr[3] || 0, groundY(L, z)); if (pr[4]) grp.scale.setScalar(pr[4]);
    soft.push({ obj: grp, x, z, r: 0.35 });
    env.add(contactBlob(x, z, 0.22 * (pr[4] || 1), 0.2 * (pr[4] || 1)));
    const c = new THREE.Box3(new THREE.Vector3(x - 0.15, 0, z - 0.15), new THREE.Vector3(x + 0.15, 0.3, z + 0.15)); c.soft = true; colliders.push(c);
  }
  /* ---- the passer-by, as weather (inked stand-in card from the kit; M4 brings the leg rig) */
  if (L.passerBy) {
    const [x, z, hgt] = L.passerBy, w = hgt * 0.5;
    const m = new THREE.ShaderMaterial({
      uniforms: { map: { value: tex.legs }, fade: { value: 1 } },
      vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; vec3 r = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0])); vec3 c = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz; vec3 wp = c + r * position.x + vec3(0.0, position.y, 0.0); gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0); }`,
      fragmentShader: /* glsl */`uniform sampler2D map; uniform float fade; varying vec2 vUv; float bb(vec2 p){ ivec2 i = ivec2(mod(p, 4.0)); int b[16] = int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(b[i.y * 4 + i.x]) + 0.5) / 16.0; } void main(){ vec4 t = texture2D(map, vUv); if (t.a < 0.5) discard; if (fade < 0.999 && bb(gl_FragCoord.xy) > fade) discard; gl_FragColor = vec4(t.rgb / t.a, 1.0); }`,
      side: THREE.DoubleSide,
    });
    const g = new THREE.PlaneGeometry(w, hgt); g.translate(0, hgt / 2, 0);
    const card = new THREE.Mesh(g, m); card.userData.fade = m.uniforms.fade; card.position.set(x, 0, z); card.frustumCulled = false; card.name = 'passerBy'; late.add(card);
    soft.push({ obj: card, x, z, r: 0.8, downLaneOnly: true });
    env.add(contactBlob(x, z, 0.45, 0.22, 0.4));
  }

  /* ---- M2 inked Scent Posts: Low Wall Corner's red mailbox and the Den's mossy corner stone */
  if (L.mailbox) {
    const [x, z] = L.mailbox.at, parts = [];
    const post = new THREE.CylinderGeometry(0.035, 0.04, 0.78, 10); post.translate(0, 0.39, 0); parts.push(celPart(post, solid('#8A6A50'), new THREE.Vector3(0, 0.4, 0)));
    const box = new THREE.CapsuleGeometry(0.15, 0.22, 6, 16); box.scale(1, 1, 0.72); box.translate(0, 0.98, 0); parts.push(celPart(box, solid('#C8463C'), new THREE.Vector3(0, 0.98, 0)));
    const slot = new THREE.BoxGeometry(0.16, 0.025, 0.02); slot.translate(0, 1.04, 0.112); slot.userData.noHull = true; parts.push(celPart(slot.toNonIndexed(), solid('#33273B'), new THREE.Vector3(0, 1.04, 0)));
    const g = celProp(parts, x, z, 'mailbox', Math.PI / 2, groundY(L, z));
    soft.push({ obj: g, x, z, r: 0.35 }); env.add(contactBlob(x, z, 0.24, 0.2));
    colliders.push(Object.assign(new THREE.Box3(new THREE.Vector3(x - 0.18, 0, z - 0.18), new THREE.Vector3(x + 0.18, 1.2, z + 0.18)), { soft: true }));
  }
  if (L.den) {
    const [x, z] = L.den.stone; let b = new THREE.BoxGeometry(0.7, 0.62, 0.7, 4, 4, 4);
    b = mergeSmooth(b); b.translate(0, 0.31, 0);
    const moss = rgb('#86A866'), stone = rgb('#B4AE9E');
    const g = celProp([celPart(b, (p, n) => stone.clone().lerp(moss, THREE.MathUtils.smoothstep(vnoise(p.x * 6, p.y * 6, p.z * 6) + (n.y > 0.5 ? 0.6 : 0), 0.35, 0.6)), new THREE.Vector3(0, 0.31, 0))], x, z, 'denStone', 0.3);
    soft.push({ obj: g, x, z, r: 0.5 });
  }
  /* ---- street lamps: painted posts; heads and ground pools light in a wave at Dusk (U.lampWave) */
  const lamps = [];
  if (L.lamps) {
    const pg = new Geo(), heads = [], pools = [];
    L.lamps.forEach(([x, z, y0], i) => {
      const side = x < 0 ? 1 : -1, H = 3.3;
      const c = new THREE.CylinderGeometry(0.045, 0.06, H, 8); c.translate(x, y0 + H / 2, z); pg.add(c, '#8E8A86');
      const arm = new THREE.BoxGeometry(0.55, 0.04, 0.04); arm.translate(x + side * 0.26, y0 + H - 0.05, z); pg.add(arm, '#7E7A78');
      const hood = new THREE.CylinderGeometry(0.05, 0.17, 0.1, 10); hood.translate(x + side * 0.52, y0 + H - 0.08, z); pg.add(hood, '#6F7682');
      heads.push([x + side * 0.52, y0 + H - 0.17, z, i]); pools.push([x + side * 0.4, y0 + 0.012, z, i]);
      lamps.push({ x, z, y: y0, i });
    });
    mesh(pg.build(), envMat({ vertexColors: true, grain: 0.6 })).name = 'lampPosts';
    const geoOf = (list, mk) => { const ps = [], ix = [], ids = [], uvs = []; let base = 0;
      for (const [x, y, z, i] of list) { const q = mk(); const P = q.attributes.position, U2 = q.attributes.uv;
        for (let k = 0; k < P.count; k++) { ps.push(P.getX(k) + x, P.getY(k) + y, P.getZ(k) + z); ids.push(i); uvs.push(U2.getX(k), U2.getY(k)); }
        for (const k of q.index.array) ix.push(k + base); base += P.count; }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(ps, 3)); g.setAttribute('lampIdx', new THREE.Float32BufferAttribute(ids, 1)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); g.setIndex(ix); return g; };
    const lampOn = /* glsl */`uniform float lampWave; attribute float lampIdx; varying float vOn; varying vec2 vUv;
      void main(){ vOn = clamp((lampWave - lampIdx * 0.32) / 0.22, 0.0, 1.0); vUv = uv; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }`;
    const lens = new THREE.Mesh(geoOf(heads, () => new THREE.SphereGeometry(0.075, 10, 6)), new THREE.ShaderMaterial({
      uniforms: { lampWave: U.lampWave, lamp: U.lamp }, vertexShader: lampOn,
      fragmentShader: /* glsl */`uniform vec3 lamp; varying float vOn; varying vec2 vUv; void main(){ gl_FragColor = vec4(mix(vec3(0.91, 0.89, 0.84), min(lamp * 1.2, vec3(1.0)), vOn), 1.0); }` }));
    lens.name = 'lampLens'; env.add(lens);
    const pool = new THREE.Mesh(geoOf(pools, () => { const q = new THREE.PlaneGeometry(2.6, 2.0); q.rotateX(-Math.PI / 2); return q; }), new THREE.ShaderMaterial({
      uniforms: { lampWave: U.lampWave, lamp: U.lamp }, vertexShader: lampOn, transparent: true, depthWrite: false,
      fragmentShader: /* glsl */`uniform vec3 lamp; varying float vOn; varying vec2 vUv;
        void main(){ vec2 d = vUv * 2.0 - 1.0; float r = length(d); if (vOn <= 0.0 || r > 1.0) discard;
          // a warm painted pool with a halftone rim (art bible §6.2 Sunspot / lamp pool language)
          float core = 1.0 - smoothstep(0.35, 0.7, r); vec2 cell = fract(gl_FragCoord.xy / 7.0) - 0.5; float dotv = step(length(cell), 0.32 * (1.0 - smoothstep(0.55, 1.0, r)));
          float a = max(core * 0.45, (r > 0.55 ? dotv * 0.4 : 0.0)) * vOn; gl_FragColor = vec4(lamp, a); }` }));
    pool.name = 'lampPools'; pool.renderOrder = 3; env.add(pool);
  }
  /* ---- the Sunspot (canon nap point): a warm painted light patch with a halftone rim */
  if (L.sunspot) {
    const [x, z] = L.sunspot.at, r = L.sunspot.r, q = new THREE.PlaneGeometry(r * 2.4, r * 2); q.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(q, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { col: { value: rgb('#FFE7A3') }, keyColor: U.keyColor },
      vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`uniform vec3 col, keyColor; varying vec2 vUv; void main(){ vec2 d = vUv * 2.0 - 1.0; float r = length(d * vec2(1.0, 1.15)); if (r > 1.0) discard;
        vec2 cell = fract(gl_FragCoord.xy / 6.0) - 0.5; float dotv = step(length(cell), 0.35 * (1.0 - smoothstep(0.6, 1.0, r)));
        float a = r < 0.62 ? 0.55 : dotv * 0.5; gl_FragColor = vec4(col * mix(vec3(1.0), keyColor, 0.5), a); }` }));
    m.position.set(x, groundY(L, z) + 0.008, z); m.renderOrder = 3; m.name = 'sunspot'; env.add(m);
  }

  /* ---- painted set dressing (not interactive, so unlined): decals, drainpipe, gates, broom, vending, air-con */
  {
    const dec = new Map();
    const decal = (texName, cell, cells, x, y, z, w, h, face) => {
      const g = new Geo(), e = 0.004, [u0, u1] = [cell / cells, (cell + 1) / cells];
      let q;
      if (face === '+x') q = [[x + e, y, z + w / 2], [x + e, y, z - w / 2], [x + e, y + h, z - w / 2], [x + e, y + h, z + w / 2]];
      if (face === '-x') q = [[x - e, y, z - w / 2], [x - e, y, z + w / 2], [x - e, y + h, z + w / 2], [x - e, y + h, z - w / 2]];
      if (face === 'up') { const yy = 0.004 + (y || 0) * 0.001; q = [[x - w / 2, yy, z + h / 2], [x + w / 2, yy, z + h / 2], [x + w / 2, yy, z - h / 2], [x - w / 2, yy, z - h / 2]]; }
      g.quad(...q, () => [0, 0]); g.uv.splice(0, 8, u0, 0, u1, 0, u0, 1, u1, 1);
      if (!dec.has(texName)) dec.set(texName, []); dec.get(texName).push(g);
    };
    for (const d of L.decals || []) decal(...d);
    for (const [name, list] of dec) {
      const g = new Geo(); for (const q of list) { const base = g.p.length / 3; g.p.push(...q.p); g.n.push(...q.n); g.uv.push(...q.uv); g.c.push(...q.c); g.i.push(...q.i.map((k) => k + base)); }
      const m = envMat({ map: tex[name], grain: 0, blend: true }); mesh(g.build(), m, false).name = 'decals-' + name;
    }
    const pg = new Geo(), wood = new Geo();
    for (const [x, z, h] of L.drainpipes || []) {
      const c = new THREE.CylinderGeometry(0.035, 0.035, h, 8); c.translate(x, h / 2, z); pg.add(c, '#A7AEB4');
      for (const y of [0.35, 0.9, h - 0.15]) { const b = new THREE.BoxGeometry(0.1, 0.03, 0.09); b.translate(x - 0.02, y, z); pg.add(b, '#7D858E'); }
      const e = new THREE.CylinderGeometry(0.035, 0.05, 0.12, 8); e.rotateZ(Math.PI / 2); e.translate(x + 0.05, 0.05, z); pg.add(e, '#A7AEB4');
    }
    for (const [x, z, ang] of L.brooms || []) {
      const st = new THREE.CylinderGeometry(0.012, 0.012, 1.15, 6); st.translate(0, 0.57, 0); st.rotateX(ang); st.translate(x, 0, z); pg.add(st, '#C79A5E');
      const br = new THREE.ConeGeometry(0.11, 0.3, 8); br.translate(0, 0.12, 0); br.rotateX(ang * 0.5); br.translate(x, 0, z); pg.add(br, '#D7B46A');
    }
    for (const [x, z, r] of L.bricks || []) { const b = new THREE.BoxGeometry(0.21, 0.06, 0.1); b.rotateY(r); b.translate(x, 0.03, z); pg.add(b, '#B9765A'); const b2 = new THREE.BoxGeometry(0.21, 0.06, 0.1); b2.rotateY(r + 0.3); b2.translate(x + 0.03, 0.09, z + 0.01); pg.add(b2, '#C98A6A'); }
    for (const [x, y, z, w, h, d] of L.aircons || []) { const b = new THREE.BoxGeometry(w, h, d); b.translate(x, y, z); pg.add(b, '#E3DED2'); colliders.push(new THREE.Box3(new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2), new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2))); }
    mesh(pg.build(), envMat({ vertexColors: true, grain: 0.5 })).name = 'pipes';
    for (const gt of L.gates || []) { // wooden gate panels on the wall / fence
      const [x, z0, z1, h, face] = gt, e = face === '+x' ? 0.03 : -0.03;
      wood.box([Math.min(x, x + e), 0, z0, Math.max(x, x + e), h, z1], { faces: face === '+x' ? 'px' : 'nx', tu: 1.3, tv: h, wobble: 0.004 });
      const p0 = new THREE.BoxGeometry(0.09, h + 0.12, 0.09), p1 = p0.clone(); p0.translate(x + e, (h + 0.12) / 2, z0); p1.translate(x + e, (h + 0.12) / 2, z1);
      wood.add(p0, '#9A6A44'); wood.add(p1, '#9A6A44');
    }
    mesh(wood.build(), envMat({ map: tex.fence, tint: '#C9A88E', grain: 0.1, alphaCut: 0.5 })).name = 'gates';
    for (const [x, z] of L.vending || []) { // stands at the fence end, front facing down-lane (-Z)
      const vg = new Geo(), w = 0.9, dpt = 0.7, h = 1.83;
      vg.box([x - w / 2, 0, z - dpt / 2, x + w / 2, h, z + dpt / 2], { faces: 'pxnxpzpy', tu: 10, tv: 10, color: '#3F78B8' });
      vg.box([x - w / 2 - 0.01, h - 0.12, z - dpt / 2 - 0.04, x + w / 2 + 0.01, h, z + dpt / 2], { faces: 'pxnxnzpy', tu: 10, tv: 10, color: '#2E5C91' });
      mesh(vg.build(), envMat({ vertexColors: true, grain: 0.4 })).name = 'vendingBody';
      const fg = new Geo(), fz = z - dpt / 2 - 0.003;
      fg.quad([x + w / 2, 0, fz], [x - w / 2, 0, fz], [x - w / 2, h - 0.12, fz], [x + w / 2, h - 0.12, fz], () => [0, 0]);
      fg.uv.splice(0, 8, 0, 0, 1, 0, 0, 1, 1, 1);
      mesh(fg.build(), envMat({ map: tex.vending, grain: 0, emit: 1 })).name = 'vendingFront';
      colliders.push(new THREE.Box3(new THREE.Vector3(x - w / 2, 0, z - dpt / 2), new THREE.Vector3(x + w / 2, h, z + dpt / 2)));
      env.add(contactBlob(x, z, 0.65, 0.55, 0.35));
    }
    const ac = new Geo();
    for (const [x, y, z, w, h, d, face] of L.aircons || []) { const fx = face === '-x' ? x - d / 2 - 0.003 : x + d / 2 + 0.003; ac.quad([fx, y - h / 2, z - w / 2 * (face === '-x' ? 1 : -1)], [fx, y - h / 2, z + w / 2 * (face === '-x' ? 1 : -1)], [fx, y + h / 2, z + w / 2 * (face === '-x' ? 1 : -1)], [fx, y + h / 2, z - w / 2 * (face === '-x' ? 1 : -1)], () => [0, 0]); ac.uv.splice(ac.uv.length - 8, 8, 0, 0, 1, 0, 0, 1, 1, 1); }
    if (ac.p.length) mesh(ac.build(), envMat({ map: tex.aircon, grain: 0 }), false).name = 'aircons';
  }

  /* ---- sky dome, clouds, backdrop rings */
  const sky = skyDome(tex.skybrush); backdrop.add(sky);
  {
    const cm = backdropMat(tex.clouds, { cloud: true, haze: 0.0 });
    const cells = { big: [0, 0, 0.5, 1, 1], a: [0.5, 0.5, 1, 1, 0.5], b: [0.5, 0, 1, 0.5, 0.5] };
    const list = [['big', 9, 470], ['a', -24, 300], ['a', 34, 330], ['big', 75, 420], ['a', 128, 280], ['big', 196, 440], ['b', 250, 240], ['big', 300, 380]];
    const cg = new THREE.Group(); cg.name = 'clouds';
    for (const [k, az, w] of list) {
      const [u0, v0, u1, v1, asp] = cells[k], hgt = w * asp, r = 620;
      const g = new THREE.PlaneGeometry(w, hgt); const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, u0 + (u1 - u0) * uv.getX(i), v0 + (v1 - v0) * uv.getY(i));
      const m = new THREE.Mesh(g, cm); const a = THREE.MathUtils.degToRad(az);
      m.position.set(Math.sin(a) * r, hgt / 2 - hgt * 0.04 - 14, -Math.cos(a) * r); m.lookAt(0, m.position.y, 0);
      m.renderOrder = -8; m.userData.az = az; cg.add(m);
    }
    backdrop.add(cg);
  }
  const ringFar = new THREE.Mesh(ringGeometry(640, 0, 360, Math.tan(-1 * Math.PI / 180) * 640, Math.tan(5 * Math.PI / 180) * 640, 96), backdropMat(tex.hillsFar, { haze: 0.35, keyK: 0.5 }));
  ringFar.renderOrder = -7;
  const sea = new THREE.Mesh(ringGeometry(700, -60, 40, -32, 0, 32), backdropMat(tex.sea, { haze: 0.12, keyK: 0.7 })); sea.renderOrder = -6;
  const ringNear = new THREE.Mesh(ringGeometry(270, 0, 360, Math.tan(-4 * Math.PI / 180) * 270, Math.tan(20 * Math.PI / 180) * 270, 128), backdropMat(tex.hillsNear, { haze: 0.18, keyK: 0.8 }));
  ringNear.renderOrder = -5;
  backdrop.add(ringFar, sea, ringNear);
  const towns = new THREE.Group();
  for (const [r, a, top, hh, hz, tx] of [[140, 60, -0.9, 5.1, 0.32, 'townFar'], [72, 50, -0.4, 4.1, 0.1, 'town']]) {
    const t = new THREE.Mesh(ringGeometry(r, -a, a, top - hh, top, 64), backdropMat(tex[tx], { haze: hz, keyK: 0.9, glass: 1 }));
    t.position.z = -2; t.renderOrder = r > 100 ? -4 : -3; towns.add(t);
  }
  env.add(towns);

  return { env, backdrop, late, colliders, casters, soft, cards, lamps, rings: { ringFar, sea, ringNear, sky, clouds: backdrop.getObjectByName('clouds') } };
}

/** Soft wisteria contact blob on the ground (E-4). */
export function contactBlob(x, z, rx, rz, opacity = 0.45) {
  const m = new THREE.ShaderMaterial({
    uniforms: { shadow: { value: rgb('#6E6AA8') }, op: { value: opacity } },
    vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */`uniform vec3 shadow; uniform float op; varying vec2 vUv; void main(){ float d = length(vUv); float a = op * (1.0 - smoothstep(0.55, 1.0, d)); gl_FragColor = vec4(shadow, a); }`,
    transparent: true, depthWrite: false, blending: THREE.MultiplyBlending, premultipliedAlpha: true,
  });
  // MultiplyBlending in three expects premultiplied output: dst * src.rgb; fold alpha into colour
  m.fragmentShader = m.fragmentShader.replace('gl_FragColor = vec4(shadow, a);', 'gl_FragColor = vec4(mix(vec3(1.0), shadow, a), 1.0);');
  const g = new THREE.PlaneGeometry(rx * 2, rz * 2); g.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(g, m); mesh.position.set(x, 0.006, z); mesh.renderOrder = 2;
  return mesh;
}

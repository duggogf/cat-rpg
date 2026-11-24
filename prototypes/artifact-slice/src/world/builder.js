// PROTOTYPE - NOT FOR PRODUCTION
// Builds the M0 lane corner from lane.json: painted, unlined environment geometry (merged
// per material), billboard foliage, backdrop rings, the inked stone-lantern Scent Post, and
// collision boxes for movement and the camera.
import * as THREE from 'three';
import { envMat, billboards, skyDome, backdropMat, ringGeometry, celMat, hullMat, U } from '../render/env.js';
import { rgb } from '../render/phases.js';

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
  const colliders = [], casters = new Set();
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
    const m = envMat({ map: tex.ground, vertexColors: true, grain: 0.0, tint: '#E8DDCB' }); // lit lane kept in the walkable band (L* ≤ 80, art bible §4.2)
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
    const g = new Geo(), c = new Geo(), n = new Geo();
    for (const w of L.walls) {
      const [x0, y0, z0, x1, y1, z1] = [Math.min(w.box[0], w.box[3]), w.box[1], Math.min(w.box[2], w.box[5]), Math.max(w.box[0], w.box[3]), w.box[4], Math.max(w.box[2], w.box[5])];
      g.box([x0, y0, z0, x1, y1, z1], { faces: 'pxnxpznz', tu: 3, tv: y1 - y0, wobble: 0.012, seg: 0.5 });
      const k = w.coping, o = 0.035;
      c.box([x0 - o, y1, z0 - o, x1 + o, y1 + k, z1 + o], { tu: 1, tv: 1, faceColor: { py: '#F7F3E8', px: '#CBD2D6', nx: '#CBD2D6', pz: '#D9DEE0', nz: '#D9DEE0', ny: '#9AA4B4' }, wobble: 0.006, seg: 0.5 });
      colliders.push(new THREE.Box3(new THREE.Vector3(x0 - o, y0, z0 - o), new THREE.Vector3(x1 + o, y1 + k, z1 + o)));
    }
    mesh(g.build(), envMat({ map: tex.wall, grain: 0.05 })).name = 'walls';
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
    mesh(win.build(), envMat({ map: tex.window, grain: 0 }), false).name = 'windows';
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
    mesh(sgeo, envMat({ vertexColors: true, grain: 0.55, side: THREE.DoubleSide, twoSided: true })).name = 'laundry';
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
      const [x, z] = t.trunk, c = new THREE.CylinderGeometry(0.1, 0.17, t.h, 8, 3); c.translate(x, t.h / 2, z); tg.add(c, '#8A6A50');
      for (const k of t.clumps) clump(...k);
    }
    for (const k of L.hedges) clump(...k, 1.2);
    for (const k of townClumps) clump(...k, 0.7);
    mesh(tg.build(), envMat({ vertexColors: true, grain: 0.8 })).name = 'trunks';
    const fol = billboards(items, tex.foliage, { cols: 4, rows: 2, receive: true }); env.add(fol); casters.add(fol); fol.name = 'foliage';
    const fl = L.hydrangeas.map(([x, z, s], i) => ({ pos: [x - s * 0.15, -s * 0.1, z], size: s, rot: 0, cell: i % 2, bright: 1 }));
    const flw = billboards(fl, tex.flowers, { cols: 2, rows: 1, cylindrical: true, rampLo: -0.6, rampHi: 0.3, keyK: 0.45 }); env.add(flw); casters.add(flw); flw.name = 'hydrangeas';
    const gi = [];
    for (const [x0, z0, x1, z1, n] of L.grassLines) for (let i = 0; i < n; i++) { const t = R(); gi.push({ pos: [x0 + (x1 - x0) * t + (R() - 0.5) * 0.06, -0.01, z0 + (z1 - z0) * t], size: 0.16 + R() * 0.16, rot: 0, cell: Math.floor(R() * 4), bright: 0.9 + R() * 0.2 }); }
    const gr = billboards(gi, tex.grass, { cols: 4, rows: 1, cylindrical: true, castShadow: false, rampLo: -0.8, rampHi: 0.2 }); env.add(gr); gr.name = 'grass';
  }

  /* ---- the stone-lantern Scent Post: inked cel prop (L-1) */
  {
    const [lx, lz] = L.lantern.at, sc = L.lantern.h / 1.2;
    const stone = '#B9B5B0', moss = '#A3B581';
    const shadeOf = (hex) => { const a = rgb(hex), s = rgb('#D8D2EA'); return new THREE.Vector3(a.x * s.x * 0.96, a.y * s.y * 0.96, a.z * s.z * 0.96); };
    const parts = [
      [0.22, 0.24, 0.1, 0.05, 6, 0], [0.075, 0.085, 0.46, 0.32, 6, 0], [0.21, 0.19, 0.1, 0.59, 6, 0],
      [0.145, 0.145, 0.24, 0.76, 4, Math.PI / 4], [0.02, 0.34, 0.2, 0.97, 4, Math.PI / 4], [0.34, 0.34, 0.03, 0.865, 4, Math.PI / 4], [0.0, 0.06, 0.12, 1.13, 6, 0],
    ];
    const cel = new THREE.Group(); cel.position.set(lx, 0, lz);
    const cm = celMat(), hm = hullMat(2.0);
    for (const [rt, rb, hh, yc, seg, rot] of parts) {
      let g = new THREE.CylinderGeometry(rt * sc, rb * sc, hh * sc, seg, 1); g.rotateY(rot); g.translate(0, yc * sc, 0);
      g = g.toNonIndexed(); g.computeVertexNormals();
      const P = g.attributes.position, N = g.attributes.normal, C = [], S = [], SN = [];
      for (let i = 0; i < P.count; i++) {
        const isMoss = (N.getY(i) > 0.25 && N.getX(i) < -0.3 && N.getZ(i) > -0.2 && hh > 0.1 && hh < 0.25 && yc > 0.8) || (yc < 0.1 && N.getY(i) > 0.9 && P.getX(i) < 0);
        const col = isMoss ? moss : stone, a = rgb(col), s = shadeOf(col);
        C.push(a.x, a.y, a.z); S.push(s.x, s.y, s.z);
        const d = new THREE.Vector3(P.getX(i), P.getY(i) - yc * sc, P.getZ(i)).normalize(); SN.push(d.x, d.y, d.z);
      }
      g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.setAttribute('shadeCol', new THREE.Float32BufferAttribute(S, 3)); g.setAttribute('smoothN', new THREE.Float32BufferAttribute(SN, 3));
      const m = new THREE.Mesh(g, cm); cel.add(m); casters.add(m);
      const hl = new THREE.Mesh(g, hm); cel.add(hl);
    }
    // the fire-box opening (two faces), dark
    for (const s of [-1, 1]) {
      const b = new THREE.BoxGeometry(0.15 * sc, 0.13 * sc, 0.01); b.translate(0, 0.765 * sc, s * 0.146 * sc);
      const g = b.toNonIndexed(), n = g.attributes.position.count, C = new Float32Array(n * 3).fill(0), S = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { C.set([0.357, 0.333, 0.4], i * 3); S.set([0.275, 0.247, 0.322], i * 3); }
      g.setAttribute('color', new THREE.BufferAttribute(C, 3)); g.setAttribute('shadeCol', new THREE.BufferAttribute(S, 3));
      cel.add(new THREE.Mesh(g, cm));
    }
    late.add(cel); cel.name = 'lantern';  // inked: drawn crisp after the paint post, like the cats
    { const b = new THREE.Box3(new THREE.Vector3(lx - 0.25, 0, lz - 0.25), new THREE.Vector3(lx + 0.25, 1.2 * sc, lz + 0.25)); b.soft = true; colliders.push(b); }
    env.add(contactBlob(lx + 0.02, lz, 0.42, 0.3));
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
  for (const [r, top, hh, hz] of [[120, -0.7, 5.5, 0.3]]) {
    const t = new THREE.Mesh(ringGeometry(r, -78, 78, top - hh, top, 64), backdropMat(tex.town, { haze: hz, keyK: 0.9 }));
    t.position.z = -2; t.renderOrder = r > 100 ? -4 : -3; towns.add(t);
  }
  env.add(towns);

  return { env, backdrop, late, colliders, casters, rings: { ringFar, sea, ringNear, sky, clouds: backdrop.getObjectByName('clouds') } };
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

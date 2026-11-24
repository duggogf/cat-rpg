// SDF primitives for the cat bakes (pure JS, no three). Units: metres at scale 1 (a real-size cat).
// Cats face +Z, +Y is up, the cat's left is +X. Each primitive carries the bone it is skinned to.
export const v3 = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a) => Math.hypot(a[0], a[1], a[2]),
  norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
};

/** Polynomial smooth min (k = blend radius in metres). */
export function smin(a, b, k) {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

function sdEllipsoid(px, py, pz, r) {
  const k0 = Math.hypot(px / r[0], py / r[1], pz / r[2]);
  const k1 = Math.hypot(px / (r[0] * r[0]), py / (r[1] * r[1]), pz / (r[2] * r[2]));
  return k1 > 1e-9 ? k0 * (k0 - 1) / k1 : -Math.min(r[0], r[1], r[2]);
}
// iq's exact round cone between two points
function sdRoundCone(p, a, b, r1, r2) {
  const ba = v3.sub(b, a), l2 = v3.dot(ba, ba), rr = r1 - r2, a2 = l2 - rr * rr, il2 = 1 / l2;
  const pa = v3.sub(p, a), y = v3.dot(pa, ba), z = y - l2;
  const xv = v3.sub(v3.mul(pa, l2), v3.mul(ba, y)), x2 = v3.dot(xv, xv), y2 = y * y * l2, z2 = z * z * l2;
  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(z) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
  if (Math.sign(y) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
  return (Math.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
// iq's 2D triangle
export function sdTri2(px, py, A, B, C) {
  const e0 = [B[0] - A[0], B[1] - A[1]], e1 = [C[0] - B[0], C[1] - B[1]], e2 = [A[0] - C[0], A[1] - C[1]];
  const v0 = [px - A[0], py - A[1]], v1 = [px - B[0], py - B[1]], v2 = [px - C[0], py - C[1]];
  const cl = (v, e) => { const t = Math.max(0, Math.min(1, (v[0] * e[0] + v[1] * e[1]) / (e[0] * e[0] + e[1] * e[1]))); return [v[0] - e[0] * t, v[1] - e[1] * t]; };
  const pq0 = cl(v0, e0), pq1 = cl(v1, e1), pq2 = cl(v2, e2);
  const s = Math.sign(e0[0] * e2[1] - e0[1] * e2[0]);
  const d0 = [pq0[0] * pq0[0] + pq0[1] * pq0[1], s * (v0[0] * e0[1] - v0[1] * e0[0])];
  const d1 = [pq1[0] * pq1[0] + pq1[1] * pq1[1], s * (v1[0] * e1[1] - v1[1] * e1[0])];
  const d2 = [pq2[0] * pq2[0] + pq2[1] * pq2[1], s * (v2[0] * e2[1] - v2[1] * e2[0])];
  const dx = Math.min(d0[0], d1[0], d2[0]), dy = Math.min(d0[1], d1[1], d2[1]);
  return -Math.sqrt(dx) * Math.sign(dy);
}

/** Make an orthonormal frame from an "up" (v) and a rough "forward" (w). */
export function frame(o, up, fwd) {
  const v = v3.norm(up); let w = v3.norm(fwd); const u = v3.norm(v3.cross(v, w)); w = v3.cross(u, v);
  return { o, u, v, w };
}
export function toFrame(F, p) { const d = v3.sub(p, F.o); return [v3.dot(d, F.u), v3.dot(d, F.v), v3.dot(d, F.w)]; }

/** Signed distance of one primitive. */
export function prim(P, p) {
  switch (P.t) {
    case 'sph': return v3.len(v3.sub(p, P.c)) - P.r;
    case 'ell': return sdEllipsoid(p[0] - P.c[0], p[1] - P.c[1], p[2] - P.c[2], P.r);
    case 'cap': return sdRoundCone(p, P.a, P.b, P.ra, P.rb);
    case 'tor': {
      const d = v3.sub(p, P.c), h = v3.dot(d, P.axis), q = v3.sub(d, v3.mul(P.axis, h));
      return Math.hypot(v3.len(q) - P.R, h) - P.r;
    }
    case 'ear': { // rounded triangular wedge in a local frame: u across the base, v up, w out of the face
      const l = toFrame(P.F, p);
      const d2 = sdTri2(l[0], l[1], P.A, P.B, P.C) + P.rr;
      // a gentle cup: the face is pushed back toward the middle of the ear
      const cup = P.cup ? P.cup * Math.max(0, 1 - (l[0] * l[0]) / (P.hw * P.hw)) : 0;
      const dz = Math.abs(l[2] + cup) - P.th * 0.5 * (1 - 0.55 * Math.max(0, Math.min(1, l[1] / P.C[1])));
      const ox = Math.max(d2, 0), oz = Math.max(dz, 0);
      return Math.hypot(ox, oz) + Math.min(Math.max(d2, dz), 0) - P.rr;
    }
    default: throw new Error('unknown prim ' + P.t);
  }
}

/** Shell SDF: smooth union of its prims (prim.k = blend radius into what came before), minus `cut` prims. */
export function shellSdf(S) {
  return (p) => {
    let d = 1e9;
    for (const P of S.prims) d = P.cut ? Math.max(d, -prim(P, p)) : smin(d, prim(P, p), P.k || 0);
    return d;
  };
}

/** Rough bounds of a shell (only additive prims). */
export function shellBounds(S, pad) {
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  const grow = (c, r) => { for (let i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], c[i] - r); mx[i] = Math.max(mx[i], c[i] + r); } };
  for (const P of S.prims) {
    if (P.cut) continue;
    if (P.t === 'sph') grow(P.c, P.r);
    else if (P.t === 'ell') grow(P.c, Math.max(...P.r));
    else if (P.t === 'cap') { grow(P.a, P.ra); grow(P.b, P.rb); }
    else if (P.t === 'tor') grow(P.c, P.R + P.r);
    else if (P.t === 'ear') grow(P.F.o, Math.max(P.hw, P.C[1]) + P.th + P.rr + 0.02);
  }
  return { mn: mn.map((v) => v - pad), mx: mx.map((v) => v + pad) };
}

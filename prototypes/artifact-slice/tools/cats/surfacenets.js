// PROTOTYPE - NOT FOR PRODUCTION
// Surface-nets polygoniser: SDF -> welded, closed triangle mesh with gradient (smoothed) normals.
// A single welded shell is exactly what the inverted-hull outline needs: no cracks at creases.
import { v3 } from './sdf.js';

export function gradient(f, p, e) {
  return v3.norm([
    f([p[0] + e, p[1], p[2]]) - f([p[0] - e, p[1], p[2]]),
    f([p[0], p[1] + e, p[2]]) - f([p[0], p[1] - e, p[2]]),
    f([p[0], p[1], p[2] + e]) - f([p[0], p[1], p[2] - e]),
  ]);
}

export function surfaceNets(f, bounds, cell) {
  const { mn, mx } = bounds;
  const nx = Math.ceil((mx[0] - mn[0]) / cell) + 1, ny = Math.ceil((mx[1] - mn[1]) / cell) + 1, nz = Math.ceil((mx[2] - mn[2]) / cell) + 1;
  const val = new Float32Array(nx * ny * nz);
  const I = (i, j, k) => i + nx * (j + ny * k);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
    val[I(i, j, k)] = f([mn[0] + i * cell, mn[1] + j * cell, mn[2] + k * cell]);
  const cx = nx - 1, cy = ny - 1, cz = nz - 1;
  const cellVert = new Int32Array(cx * cy * cz).fill(-1);
  const C = (i, j, k) => i + cx * (j + cy * k);
  const pos = [];
  const corners = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    const v = corners.map((c) => val[I(i + c[0], j + c[1], k + c[2])]);
    let inside = 0; for (const x of v) if (x < 0) inside++;
    if (inside === 0 || inside === 8) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of edges) {
      if ((v[a] < 0) === (v[b] < 0)) continue;
      const t = v[a] / (v[a] - v[b]), A = corners[a], B = corners[b];
      sx += A[0] + (B[0] - A[0]) * t; sy += A[1] + (B[1] - A[1]) * t; sz += A[2] + (B[2] - A[2]) * t; n++;
    }
    cellVert[C(i, j, k)] = pos.length;
    pos.push([mn[0] + (i + sx / n) * cell, mn[1] + (j + sy / n) * cell, mn[2] + (k + sz / n) * cell]);
  }
  // project onto the surface (sharper silhouettes than the cell average)
  for (const p of pos) for (let it = 0; it < 3; it++) {
    const d = f(p), g = gradient(f, p, cell * 0.25);
    p[0] -= g[0] * d; p[1] -= g[1] * d; p[2] -= g[2] * d;
  }
  const tris = [];
  const quad = (a, b, c, d, flip) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) { const t = b; b = d; d = t; }
    // split along the shorter diagonal
    if (v3.len(v3.sub(pos[a], pos[c])) < v3.len(v3.sub(pos[b], pos[d]))) tris.push(a, b, c, a, c, d);
    else tris.push(a, b, d, b, c, d);
  };
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const s0 = val[I(i, j, k)] < 0;
    if (i < cx && j > 0 && k > 0 && j < ny - 1 && k < nz - 1 && s0 !== (val[I(i + 1, j, k)] < 0))
      quad(cellVert[C(i, j - 1, k - 1)], cellVert[C(i, j, k - 1)], cellVert[C(i, j, k)], cellVert[C(i, j - 1, k)], !s0);
    if (j < cy && i > 0 && k > 0 && i < nx - 1 && k < nz - 1 && s0 !== (val[I(i, j + 1, k)] < 0))
      quad(cellVert[C(i - 1, j, k - 1)], cellVert[C(i - 1, j, k)], cellVert[C(i, j, k)], cellVert[C(i, j, k - 1)], !s0);
    if (k < cz && i > 0 && j > 0 && i < nx - 1 && j < ny - 1 && s0 !== (val[I(i, j, k + 1)] < 0))
      quad(cellVert[C(i - 1, j - 1, k)], cellVert[C(i, j - 1, k)], cellVert[C(i, j, k)], cellVert[C(i - 1, j, k)], !s0);
  }
  const nrm = pos.map((p) => gradient(f, p, cell * 0.5));
  // orientation check against the gradient (robust whatever the quad winding convention)
  let agree = 0, total = 0;
  for (let t = 0; t < tris.length; t += 3) {
    const a = pos[tris[t]], b = pos[tris[t + 1]], c = pos[tris[t + 2]];
    const gn = v3.cross(v3.sub(b, a), v3.sub(c, a));
    const s = v3.dot(gn, v3.add(v3.add(nrm[tris[t]], nrm[tris[t + 1]]), nrm[tris[t + 2]]));
    total++; if (s > 0) agree++;
  }
  if (agree < total / 2) for (let t = 0; t < tris.length; t += 3) { const x = tris[t + 1]; tris[t + 1] = tris[t + 2]; tris[t + 2] = x; }
  return { pos, nrm, tris };
}

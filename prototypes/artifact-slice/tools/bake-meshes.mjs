// PROTOTYPE - NOT FOR PRODUCTION
// Bakes the SDF cats (tools/cats/casts.sdf.js) into skinned mesh PARTS shared between casts:
//   assets/mesh/<part>.bin + .json  (body_<build>, head_<build>_<ears>[_scars…], tail_<build>_<tail>, collar_<build>)
//   assets/mesh/cats.json           (manifest: each cast / tough combination -> parts, skeleton, meta)
// Each shell is polygonised with surface nets; normals are the SDF gradient (smooth, so they double
// as the outline's smoothed normals); skin weights are a soft-min over each bone's primitives.
// Attributes are quantised (half-float positions, 8-bit normals/weights, 16-bit indices).
//   node tools/bake-meshes.mjs
import fs from 'node:fs';
import path from 'node:path';
import { CASTS, TOUGH, buildCast, BONES } from './cats/casts.sdf.js';
import { shellSdf, shellBounds, prim, v3, toFrame } from './cats/sdf.js';
import { surfaceNets, gradient } from './cats/surfacenets.js';
import { MeshoptSimplifier } from 'meshoptimizer';
await MeshoptSimplifier.ready;
// triangle budget per shell (≈ 20k per cat; the plan's 4–6k is the Unreal target, this is a browser spike)
const BUDGET = { body: 7000, legs: 6000, head: 8000, tail: 2000, collar: 1200, bell: 300, peg: 200 };
// LOD index (same vertices, decimated further): other cats at combat distance, ≈ 7k triangles per cat
const LOD = { body: 1800, legs: 1700, head: 2800, tail: 500, collar: 300, bell: 80, peg: 60 };

const root = path.dirname(new URL(import.meta.url).pathname) + '/..';
const out = path.join(root, 'assets/mesh');
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) fs.unlinkSync(path.join(out, f)); // parts are regenerated from scratch

// float -> IEEE half (round to nearest)
const f32 = new Float32Array(1), u32 = new Uint32Array(f32.buffer);
function toHalf(v) {
  f32[0] = v; const x = u32[0];
  const sign = (x >>> 16) & 0x8000; let e = ((x >>> 23) & 0xff) - 127 + 15; let m = x & 0x7fffff;
  if (e <= 0) { if (e < -10) return sign; m = (m | 0x800000) >> (1 - e); return sign | ((m + 0x1000) >> 13); }
  if (e >= 31) return sign | 0x7c00;
  const h = sign | (e << 10) | (m >> 13); return (m & 0x1000) ? h + 1 : h;
}

function bakeShells(M, shells, label) {
  const P = [], N = [], SN = [], SI = [], SW = [], PT = [], AX = [], TH = [], IDX = [], IDXL = [];
  const meta = {};
  for (const S of shells) {
    const f = shellSdf(S);
    let { pos, nrm, tris } = surfaceNets(f, shellBounds(S, S.cell * 3), S.cell);
    const [ix] = MeshoptSimplifier.simplify(new Uint32Array(tris), new Float32Array(pos.flat()), 3, Math.min(tris.length, (BUDGET[S.name] || 2000) * 3), 0.02);
    const remap = new Map(), np = [], nn = [];
    tris = Array.from(ix, (i) => { if (!remap.has(i)) { remap.set(i, np.length); np.push(pos[i]); nn.push(nrm[i]); } return remap.get(i); });
    pos = np; nrm = nn;
    const base = P.length / 3;
    const boneIds = [...new Set(S.prims.filter((p) => !p.cut).map((p) => p.bone))];
    for (let i = 0; i < pos.length; i++) {
      const p = pos[i];
      P.push(...p); N.push(...nrm[i]); PT.push(S.part);
      // thickness along -normal: the hull may be pulled toward the eye by a share of it (interior lines)
      let th = 0.002; const n = nrm[i];
      while (th < 0.12 && f([p[0] - n[0] * th, p[1] - n[1] * th, p[2] - n[2] * th]) < 0) th += 0.002;
      // ears, flaps and ruff spikes never pull (their -normal ray runs into the skull)
      if (S.name === 'head') { let best = 1e9, bt = ''; for (const q of S.prims) { if (q.cut) continue; const d = prim(q, p); if (d < best) { best = d; bt = q.t; } } if (bt === 'ear') th = 0; }
      TH.push(th);
      SN.push(...gradient(f, p, 0.014)); // form normal (shading only): a simple designed terminator
      const d = boneIds.map((b) => Math.min(...S.prims.filter((q) => q.bone === b && !q.cut).map((q) => prim(q, p))));
      const dmin = Math.min(...d);
      let w = d.map((x, j) => ({ b: BONES.indexOf(boneIds[j]), w: Math.exp(-(x - dmin) / S.sigma) }));
      w.sort((a, b) => b.w - a.w); w = w.slice(0, 4);
      const sum = w.reduce((a, x) => a + x.w, 0);
      const q8 = w.map((x) => Math.round(x.w / sum * 255)); q8[0] += 255 - q8.reduce((a, b) => a + b, 0);
      for (let j = 0; j < 4; j++) { SI.push(w[j] ? w[j].b : 0); SW.push(w[j] ? q8[j] : 0); }
      let ax = [0, 0, 0];
      if (S.name === 'head') { const e = M.meta.ears[p[0] >= 0 ? 0 : 1]; ax = toFrame({ o: e.o, u: e.u, v: e.v, w: e.w }, p); }
      else if (S.name === 'tail') { const z0 = M.bones.find((b) => b.name === 'tail1').pos[2]; ax = [Math.max(0, Math.min(1.2, (z0 - p[2]) / M.meta.tailLen)), 0, 0]; }
      else if (S.name === 'bell') ax = v3.sub(p, S.prims[0].c);
      AX.push(...ax);
    }
    for (const t of tris) IDX.push(t + base);
    // LOD: simplify the baked shell again (lock nothing; silhouette-preserving error metric)
    const [il] = MeshoptSimplifier.simplify(new Uint32Array(tris), new Float32Array(pos.flat()), 3, Math.min(tris.length, (LOD[S.name] || 500) * 3), 0.05);
    for (const t of il) IDXL.push(t + base);
    if (S.name === 'head') {
      // eye anchors: where the face's eye centres (kit x = ±12 units, 0.00335 m each) meet the skull
      const hs = M.meta.hs, ey = M.meta.headC[1] - 0.004 * hs;
      meta.eyes = [-1, 1].map((sd) => { const x = sd * 12 * 0.00335 * hs; let z = M.meta.headC[2] + 0.2; while (z > M.meta.headC[2] && f([x, ey, z]) > 0) z -= 0.0005; return [x, ey, z]; });
    }
  }
  if (P.length / 3 > 65535) throw new Error(label + ': too many vertices for 16-bit indices');
  const q = (v) => Math.max(-127, Math.min(127, Math.round(v * 127)));
  const chunks = [
    ['position', Uint16Array.from(P, toHalf), 3, 'half'], ['normal', Int8Array.from(N, q), 3, 'snorm8'], ['snormal', Int8Array.from(SN, q), 3, 'snorm8'],
    ['skinIndex', Uint8Array.from(SI), 4, 'u8'], ['skinWeight', Uint8Array.from(SW), 4, 'unorm8'],
    ['part', Uint8Array.from(PT), 1, 'u8'], ['aux', Uint16Array.from(AX, toHalf), 3, 'half'], ['thick', Uint16Array.from(TH, toHalf), 1, 'half'],
    ['index', Uint16Array.from(IDX), 1, 'u16'], ['indexLod', Uint16Array.from(IDXL), 1, 'u16'],
  ];
  const attributes = {}; let off = 0; const bufs = [];
  for (const [k, arr, size, kind] of chunks) {
    attributes[k] = { offset: off, count: arr.length, itemSize: size, kind };
    const b = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength); bufs.push(b); off += b.length;
    const pad = (4 - (off % 4)) % 4; if (pad) { bufs.push(Buffer.alloc(pad)); off += pad; }
  }
  fs.writeFileSync(path.join(out, label + '.bin'), Buffer.concat(bufs));
  fs.writeFileSync(path.join(out, label + '.json'), JSON.stringify({ part: label, meta, vertexCount: P.length / 3, triangleCount: IDX.length / 3, triangleCountLod: IDXL.length / 3, attributes, bin: label + '.bin' }));
  return { meta, tris: IDX.length / 3, trisLod: IDXL.length / 3, bytes: off };
}

// every cast and every tough combination; parts are baked once and shared
const entries = Object.entries(CASTS).map(([k, o]) => [k, o]);
for (const b of TOUGH.builds) for (const e of TOUGH.ears) for (const t of TOUGH.tails) entries.push([`tough:${b}:${e}:${t}`, { build: b, ears: e, tail: t }]);
const baked = {}, manifest = { casts: {}, parts: {} };
let total = 0;
for (const [name, opts] of entries) {
  const M = buildCast(opts);
  const groups = [...new Set(M.shells.map((s) => s.group))];
  const meta = { ...M.meta };
  for (const g of groups) {
    if (!baked[g]) {
      const t0 = Date.now();
      baked[g] = bakeShells(M, M.shells.filter((s) => s.group === g), g);
      manifest.parts[g] = { json: g + '.json' };
      total += baked[g].bytes;
      console.log(`  ${g}: ${baked[g].tris} tris (LOD ${baked[g].trisLod}), ${(baked[g].bytes / 1024).toFixed(0)} KB, ${Date.now() - t0} ms`);
    }
    Object.assign(meta, baked[g].meta);
  }
  delete meta.ears; // aux already baked; the runtime needs only earDims
  manifest.casts[name] = { parts: groups, bones: M.bones, meta };
}
fs.writeFileSync(path.join(out, 'cats.json'), JSON.stringify(manifest));
console.log(`baked ${Object.keys(baked).length} parts for ${entries.length} cast entries, ${(total / 1024).toFixed(0)} KB total`);

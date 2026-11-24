// PROTOTYPE - NOT FOR PRODUCTION
// Bakes the SDF cats (tools/cats/casts.sdf.js) into skinned meshes: assets/mesh/<cast>.json + .bin.
// Each shell is polygonised with surface nets; normals are the SDF gradient (smooth, so they double
// as the outline's smoothed normals); skin weights are a soft-min over each bone's primitives.
//   node tools/bake-meshes.mjs [cast ...]
import fs from 'node:fs';
import path from 'node:path';
import { CASTS, buildCast, BONES } from './cats/casts.sdf.js';
import { shellSdf, shellBounds, prim, v3, toFrame } from './cats/sdf.js';
import { surfaceNets, gradient } from './cats/surfacenets.js';
import { MeshoptSimplifier } from 'meshoptimizer';
await MeshoptSimplifier.ready;
// triangle budget per shell (≈ 20k per cat; the plan's 4–6k is the Unreal target, this is a browser spike)
const BUDGET = { body: 8000, legs: 7000, head: 9000, tail: 2400, collar: 1200, bell: 300 };

const root = path.dirname(new URL(import.meta.url).pathname) + '/..';
const out = path.join(root, 'assets/mesh');
fs.mkdirSync(out, { recursive: true });
const want = process.argv.slice(2);

for (const [name, opts] of Object.entries(CASTS)) {
  if (want.length && !want.includes(name)) continue;
  const t0 = Date.now();
  const M = buildCast(opts);
  const P = [], N = [], SN = [], SI = [], SW = [], PT = [], AX = [], TH = [], IDX = [];
  for (const S of M.shells) {
    const f = shellSdf(S);
    let { pos, nrm, tris } = surfaceNets(f, shellBounds(S, S.cell * 3), S.cell);
    // decimate (silhouette-preserving error metric), then drop unused vertices
    const before = tris.length / 3;
    const [ix] = MeshoptSimplifier.simplify(new Uint32Array(tris), new Float32Array(pos.flat()), 3, Math.min(tris.length, BUDGET[S.name] * 3), 0.02);
    const remap = new Map(), np = [], nn = [];
    tris = Array.from(ix, (i) => { if (!remap.has(i)) { remap.set(i, np.length); np.push(pos[i]); nn.push(nrm[i]); } return remap.get(i); });
    pos = np; nrm = nn;
    if (before !== tris.length / 3) process.stdout.write(`  (${before} -> ${tris.length / 3}) `);
    const base = P.length / 3;
    const boneIds = [...new Set(S.prims.filter((p) => !p.cut).map((p) => p.bone))];
    for (let i = 0; i < pos.length; i++) {
      const p = pos[i];
      P.push(...p); N.push(...nrm[i]); PT.push(S.part);
      // thickness along -normal (to the far surface): the hull may be pulled toward the camera by a
      // share of it, which draws interior overlap lines without inking thin parts (ears) solid
      let th = 0.002; const n = nrm[i];
      while (th < 0.12 && f([p[0] - n[0] * th, p[1] - n[1] * th, p[2] - n[2] * th]) < 0) th += 0.002;
      TH.push(th);
      // form normal: the SDF gradient at a coarse scale, for shading only, so the terminator is a
      // simple designed shape (no stair-steps from the decimated mesh, no kinks at junctions)
      SN.push(...gradient(f, p, 0.014));
      // skin weights: soft-min of per-bone distances
      const d = boneIds.map((b) => Math.min(...S.prims.filter((q) => q.bone === b && !q.cut).map((q) => prim(q, p))));
      const dmin = Math.min(...d);
      let w = d.map((x, j) => ({ b: BONES.indexOf(boneIds[j]), w: Math.exp(-(x - dmin) / S.sigma) }));
      w.sort((a, b) => b.w - a.w); w = w.slice(0, 4);
      const sum = w.reduce((a, x) => a + x.w, 0);
      for (let j = 0; j < 4; j++) { SI.push(w[j] ? w[j].b : 0); SW.push(w[j] ? w[j].w / sum : 0); }
      // aux: part-local coordinates for the shader's pattern functions
      let ax = [0, 0, 0];
      if (S.name === 'head') {
        const e = M.meta.ears[p[0] >= 0 ? 0 : 1];
        ax = toFrame({ o: e.o, u: e.u, v: e.v, w: e.w }, p);
      } else if (S.name === 'tail') {
        const tb = M.bones.filter((b) => b.name.startsWith('tail'));
        const z0 = tb[0].pos[2], len = M.meta.tailLen;
        ax = [Math.max(0, Math.min(1.2, (z0 - p[2]) / len)), 0, 0];
      } else if (S.name === 'bell') {
        const c = S.prims[0].c; ax = v3.sub(p, c);
      }
      AX.push(...ax);
    }
    for (const t of tris) IDX.push(t + base);
    console.log(`  ${name}.${S.name}: ${pos.length} verts, ${tris.length / 3} tris`);
  }
  // pack
  const parts = [
    ['position', new Float32Array(P), 3], ['normal', new Float32Array(N), 3], ['snormal', new Float32Array(SN), 3],
    ['skinIndex', new Uint16Array(SI), 4], ['skinWeight', new Float32Array(SW), 4],
    ['part', new Float32Array(PT), 1], ['aux', new Float32Array(AX), 3], ['thick', new Float32Array(TH), 1],
    ['index', new Uint32Array(IDX), 1],
  ];
  const attributes = {}; let off = 0; const bufs = [];
  for (const [k, arr, size] of parts) {
    attributes[k] = { offset: off, count: arr.length, itemSize: size, type: arr.constructor.name };
    bufs.push(Buffer.from(arr.buffer)); off += arr.byteLength;
  }
  const json = { cast: name, opts, bones: M.bones, meta: M.meta, vertexCount: P.length / 3, triangleCount: IDX.length / 3, attributes, bin: name + '.bin' };
  fs.writeFileSync(path.join(out, name + '.bin'), Buffer.concat(bufs));
  fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify(json));
  console.log(`baked ${name}: ${json.vertexCount} verts, ${json.triangleCount} tris, ${(off / 1024).toFixed(0)} KB in ${Date.now() - t0} ms`);
}

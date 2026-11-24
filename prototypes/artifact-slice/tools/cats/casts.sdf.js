// PROTOTYPE - NOT FOR PRODUCTION
// Cat models as SDF smooth-unions (art bible §3.1: beans, chestnuts, poms, wedge ears).
// One skeleton for every cast; builds (Round / Standard / Long) are proportions, as in kit.js BUILD.
// Real-size metres (scale 1); the runtime multiplies by the 1.25 cat scale.
import { frame, v3 } from './sdf.js';

const BUILD = {
  round: { bx: 1.2, by: 1.12, leg: 0.84, head: 1.06, len: 1.0 },
  standard: { bx: 1, by: 1, leg: 1, head: 1, len: 1 },
  long: { bx: 0.88, by: 0.94, leg: 1.2, head: 0.93, len: 1.12 },
};
export const BONES = ['root', 'hips', 'chest', 'neck', 'head', 'earL', 'earR',
  'tail1', 'tail2', 'tail3', 'tail4', 'tail5', 'tail6',
  'fUL', 'fLL', 'fUR', 'fLR', 'hUL', 'hLL', 'hUR', 'hLR'];
const PARENT = { hips: 'root', chest: 'hips', neck: 'chest', head: 'neck', earL: 'head', earR: 'head', tail1: 'hips',
  tail2: 'tail1', tail3: 'tail2', tail4: 'tail3', tail5: 'tail4', tail6: 'tail5',
  fUL: 'chest', fLL: 'fUL', fUR: 'chest', fLR: 'fUR', hUL: 'hips', hLL: 'hUL', hUR: 'hips', hLR: 'hUR' };

/** Part ids (the shader's coat functions switch on these). */
export const PART = { body: 0, head: 1, tail: 2, collar: 3, bell: 4 };

/**
 * @param {object} o build, tail ('pom'|'whip'|'ringed'|'plume'|'stub'), ears ('standard'|'tall'|'round'), collar (bool)
 */
export function buildCast(o) {
  const B = BUILD[o.build || 'standard'];
  const bx = B.bx, by = B.by, lg = B.leg, hs = B.head, ln = B.len;
  const pos = {};
  // ---- skeleton (rest = standing, legs straight down, tail straight back)
  const legTop = 0.122 * lg + 0.018;       // shoulder / hip pivot height
  const knee = 0.062 * lg + 0.006;
  const spineY = legTop + 0.03 * by;
  const zF = 0.07 * ln, zH = -0.085 * ln;   // front / hind leg z
  const xF = 0.036 * bx, xH = 0.046 * bx;
  pos.root = [0, 0, 0];
  pos.hips = [0, spineY, -0.04 * ln];
  pos.chest = [0, spineY + 0.008, 0.035 * ln];
  pos.neck = [0, spineY + 0.035, zF + 0.012];
  const headC = [0, spineY + 0.125 * hs + 0.005, zF + 0.05 * hs]; // chestnut centre
  pos.head = [0, headC[1] - 0.06 * hs, headC[2] - 0.025 * hs];   // pivot low and behind: nods read well
  const rump = [0, spineY + 0.012, -0.142 * ln * (0.85 + 0.15 * bx)];
  const tailLen = { pom: 0.06, stub: 0.1, whip: 0.27, ringed: 0.25, plume: 0.27 }[o.tail || 'whip'];
  const seg = tailLen / 6;
  for (let i = 0; i < 6; i++) pos['tail' + (i + 1)] = [0, rump[1], rump[2] + 0.02 - i * seg];
  pos.fUL = [xF, legTop + 0.005, zF]; pos.fLL = [xF, knee, zF + 0.004];
  pos.fUR = [-xF, legTop + 0.005, zF]; pos.fLR = [-xF, knee, zF + 0.004];
  pos.hUL = [xH, legTop + 0.01, zH]; pos.hLL = [xH, knee, zH - 0.006];
  pos.hUR = [-xH, legTop + 0.01, zH]; pos.hLR = [-xH, knee, zH - 0.006];

  // ---- ears (wedges in a local frame; base sits in the skull top)
  const earShape = {
    standard: { hw: 0.04, h: 0.072, tip: 0.012, th: 0.014 },
    tall: { hw: 0.036, h: 0.088, tip: 0.008, th: 0.013 },
    round: { hw: 0.038, h: 0.056, tip: 0.0, th: 0.016 },
  }[o.ears || 'standard'];
  const ears = [1, -1].map((s) => {
    const base = [headC[0] + s * 0.056 * hs, headC[1] + 0.046 * hs, headC[2] - 0.006 * hs];
    pos[s > 0 ? 'earL' : 'earR'] = base;
    const up = v3.norm([s * 0.36, 1, -0.12]);
    const F = frame(base, up, [s * 0.32, 0, 1]);
    const E = earShape, sc = hs;
    return { t: 'ear', F, A: [-E.hw * sc, -0.01], B: [E.hw * sc, -0.01], C: [s * E.tip * sc, E.h * sc],
      hw: E.hw * sc, th: E.th * sc, rr: o.ears === 'round' ? 0.011 : 0.006, cup: 0.005, bone: s > 0 ? 'earL' : 'earR', k: 0.016, side: s };
  });

  // ---- body shell: bean torso, haunches, chest, legs, paws
  const body = [];
  const P = (x) => body.push(x);
  const tr = 0.066 * by;                       // torso radius
  P({ t: 'cap', a: [0, spineY + 0.004, rump[2] + 0.06], b: [0, spineY + 0.006, 0.0], ra: tr * 1.02, rb: tr * 0.96, bone: 'hips', k: 0 });
  P({ t: 'cap', a: [0, spineY + 0.006, 0.0], b: [0, spineY + 0.016, zF + 0.004], ra: tr * 0.96, rb: tr * 0.95, bone: 'chest', k: 0.03 });
  // wide round haunches (the pear from behind)
  for (const s of [1, -1]) P({ t: 'ell', c: [s * (xH + 0.006) * 1.0, legTop + 0.004, zH + 0.005], r: [0.046 * bx, 0.06 * by, 0.062 * by], bone: s > 0 ? 'hUL' : 'hUR', k: 0.035 });
  // chest / bib
  P({ t: 'ell', c: [0, spineY + 0.006, zF + 0.012], r: [0.064 * bx, 0.07 * by, 0.058], bone: 'chest', k: 0.03 });
  // neck into the head
  P({ t: 'cap', a: [0, spineY + 0.02, zF + 0.005], b: [0, headC[1] - 0.05 * hs, headC[2] - 0.02], ra: 0.048 * bx, rb: 0.042 * bx, bone: 'neck', k: 0.03 });
  // legs: column legs, slightly tapered, rounded paws
  const leg = (s, front) => {
    const U = front ? (s > 0 ? 'fUL' : 'fUR') : (s > 0 ? 'hUL' : 'hUR');
    const L = front ? (s > 0 ? 'fLL' : 'fLR') : (s > 0 ? 'hLL' : 'hLR');
    const top = pos[U], kn = pos[L];
    const r0 = (front ? 0.024 : 0.027) * Math.sqrt(bx), r1 = (front ? 0.021 : 0.022) * Math.sqrt(bx);
    const pawZ = kn[2] + 0.008;
    P({ t: 'cap', a: [top[0], top[1] - 0.01, top[2]], b: kn, ra: r0, rb: r1, bone: U, k: 0.022 });
    P({ t: 'cap', a: kn, b: [kn[0], 0.026, pawZ - 0.004], ra: r1, rb: r1 * 0.96, bone: L, k: 0.008 });
    P({ t: 'ell', c: [kn[0] * 1.02, 0.017, pawZ + 0.006], r: [r1 * 1.12, 0.0175, r1 * 1.38], bone: L, k: 0.014 });
  };
  for (const s of [1, -1]) { leg(s, true); leg(s, false); }

  // ---- head shell: chestnut (wider at the bottom), cheek ruffs, small muzzle, ears
  const head = [];
  const H = (x) => head.push(x);
  const hc = headC;
  H({ t: 'ell', c: hc, r: [0.094 * hs, 0.074 * hs, 0.077 * hs], bone: 'head', k: 0 });
  for (const s of [1, -1]) H({ t: 'ell', c: [hc[0] + s * 0.052 * hs, hc[1] - 0.024 * hs, hc[2] + 0.002], r: [0.06 * hs * (o.build === 'round' ? 1.08 : 1), 0.047 * hs, 0.058 * hs], bone: 'head', k: 0.03 });
  H({ t: 'ell', c: [hc[0], hc[1] - 0.033 * hs, hc[2] + 0.052 * hs], r: [0.034 * hs, 0.024 * hs, 0.026 * hs], bone: 'head', k: 0.02 });
  for (const e of ears) H(e);

  // ---- tail shell
  const tail = [];
  const T = (x) => tail.push(x);
  const tp = (i) => pos['tail' + Math.min(6, i + 1)];
  if (o.tail === 'pom') {
    const c = [0, rump[1] + 0.008, rump[2] - 0.028];
    T({ t: 'sph', c, r: 0.036, bone: 'tail1', k: 0 });
    // scallops all round: a cauliflower of small spheres (pom = imperfect circle from every angle)
    const n = 18, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
      const d = [Math.cos(th) * r, y, Math.sin(th) * r];
      if (d[2] > 0.55) continue; // the side buried in the rump
      T({ t: 'sph', c: v3.add(c, v3.mul(d, 0.03)), r: 0.019 + 0.003 * ((i * 7) % 3) / 2, bone: 'tail1', k: 0.008 });
    }
  } else {
    const rad = { whip: [0.017, 0.012], ringed: [0.024, 0.02], plume: [0.024, 0.022], stub: [0.026, 0.022] }[o.tail];
    const pts = [[0, rump[1], rump[2] + 0.03], ...[1, 2, 3, 4, 5].map((i) => tp(i)), v3.add(tp(5), [0, 0, -seg])];
    for (let i = 0; i < 6; i++) {
      const t0 = i / 6, t1 = (i + 1) / 6;
      const rA = rad[0] + (rad[1] - rad[0]) * t0, rB = rad[0] + (rad[1] - rad[0]) * t1;
      const plumeK = o.tail === 'plume' ? 1 + 0.5 * Math.sin(Math.PI * Math.min(1, t1 * 1.1)) : 1;
      T({ t: 'cap', a: pts[i], b: pts[i + 1], ra: rA * (o.tail === 'plume' ? 1 + 0.5 * Math.sin(Math.PI * t0) : 1), rb: rB * plumeK, bone: 'tail' + (i + 1), k: 0.004 });
    }
  }

  const shells = [
    { name: 'body', part: PART.body, cell: 0.0042, sigma: 0.012, prims: body },
    { name: 'head', part: PART.head, cell: 0.0032, sigma: 0.006, prims: head },
    { name: 'tail', part: PART.tail, cell: o.tail === 'pom' ? 0.0028 : 0.0035, sigma: 0.006, prims: tail },
  ];
  // ---- collar + bell (Mikan only; collars mean pets)
  if (o.collar) {
    const axis = v3.norm([0, 0.93, 0.42]);
    const cc = [0, headC[1] - 0.084 * hs, headC[2] - 0.022];
    shells.push({ name: 'collar', part: PART.collar, cell: 0.0024, sigma: 0.01, prims: [{ t: 'tor', c: cc, axis, R: 0.05 * bx, r: 0.0085, bone: 'neck', k: 0 }] });
    const front = v3.add(cc, [0, -0.026, 0.05 * bx + 0.01]);
    shells.push({ name: 'bell', part: PART.bell, cell: 0.0018, sigma: 0.01, prims: [{ t: 'sph', c: front, r: 0.0165, bone: 'neck', k: 0 }] });
  }
  return {
    bones: BONES.map((n) => ({ name: n, parent: PARENT[n] || null, pos: pos[n] })),
    shells,
    meta: {
      headC, hs, rump, spineY, ears: ears.map((e) => ({ o: e.F.o, u: e.F.u, v: e.F.v, w: e.F.w, A: e.A, B: e.B, C: e.C, th: e.th, side: e.side })),
      tailLen, legTop, zF, zH, xF, xH,
    },
  };
}

/** The casts baked for M0. */
export const CASTS = {
  mikan: { build: 'standard', tail: 'pom', ears: 'standard', collar: true },
  // Wall Sitter tough: Round build (Bruiser-weighted), thick ringed tail, small round ears.
  wallSitter: { build: 'round', tail: 'ringed', ears: 'round', collar: false },
};

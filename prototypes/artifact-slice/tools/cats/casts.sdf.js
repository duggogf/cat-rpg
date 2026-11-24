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
export const PART = { body: 0, head: 1, tail: 2, collar: 3, bell: 4, legs: 5 };

/**
 * @param {object} o build, tail ('pom'|'whip'|'ringed'|'plume'|'stub'), ears ('standard'|'tall'|'round'), collar (bool)
 */
export function buildCast(o) {
  const B = BUILD[o.build || 'standard'];
  const bx = B.bx, by = B.by, lg = B.leg, hs = B.head, ln = B.len;
  const pos = {};
  // ---- skeleton (rest = standing, legs straight down, tail straight back)
  const legTop = 0.1 * lg + 0.018;       // shoulder / hip pivot height
  const knee = 0.052 * lg + 0.006;
  const spineY = legTop + 0.03 * by;
  const zF = 0.07 * ln, zH = -0.085 * ln;   // front / hind leg z
  const xF = 0.036 * bx, xH = 0.046 * bx;
  pos.root = [0, 0, 0];
  pos.hips = [0, spineY, -0.04 * ln];
  pos.chest = [0, spineY + 0.008, 0.035 * ln];
  pos.neck = [0, spineY + 0.035, zF + 0.012];
  const headC = [0, spineY + 0.136 * hs + 0.006, zF + 0.066 * hs]; // chestnut centre
  pos.head = [0, headC[1] - 0.06 * hs, headC[2] - 0.025 * hs];   // pivot low and behind: nods read well
  const rump = [0, spineY + 0.014, -0.128 * ln * (0.85 + 0.15 * bx)];
  const tailLen = { pom: 0.06, stub: 0.1, whip: 0.34, ringed: 0.31, plume: 0.33 }[o.tail || 'whip'];
  const seg = tailLen / 6;
  for (let i = 0; i < 6; i++) pos['tail' + (i + 1)] = [0, rump[1], rump[2] + 0.02 - i * seg];
  pos.fUL = [xF, legTop + 0.005, zF]; pos.fLL = [xF, knee, zF + 0.004];
  pos.fUR = [-xF, legTop + 0.005, zF]; pos.fLR = [-xF, knee, zF + 0.004];
  pos.hUL = [xH, legTop + 0.01, zH]; pos.hLL = [xH, knee, zH - 0.006];
  pos.hUR = [-xH, legTop + 0.01, zH]; pos.hLR = [-xH, knee, zH - 0.006];

  // ---- ears (wedges in a local frame; base sits in the skull top)
  const earShape = {
    standard: { hw: 0.04, h: 0.072, tip: 0.012, th: 0.02 },
    tall: { hw: 0.036, h: 0.088, tip: 0.008, th: 0.018 },
    round: { hw: 0.038, h: 0.056, tip: 0.0, th: 0.022 },
  }[o.ears || 'standard'];
  const ears = [1, -1].map((s) => {
    const base = [headC[0] + s * 0.056 * hs, headC[1] + 0.046 * hs, headC[2] - 0.006 * hs];
    pos[s > 0 ? 'earL' : 'earR'] = base;
    const up = v3.norm([s * 0.36, 1, -0.12]);
    const F = frame(base, up, [s * 0.5, 0, 1]);
    const E = earShape, sc = hs;
    return { t: 'ear', F, A: [-E.hw * sc, -0.01], B: [E.hw * sc, -0.01], C: [s * E.tip * sc, E.h * sc],
      hw: E.hw * sc, th: E.th * sc, rr: o.ears === 'round' ? 0.011 : 0.0085, cup: 0.005, bone: s > 0 ? 'earL' : 'earR', k: 0.016, side: s };
  });

  // ---- torso shell: a bean (round rump, deep chest), thick neck. Legs are a SEPARATE shell so
  // their hull draws the drawn-cel overlap line where a leg crosses the body (AD fix 4).
  const body = [];
  const P = (x) => body.push(x);
  const tr = 0.066 * by;
  P({ t: 'ell', c: [0, spineY + 0.006, rump[2] + 0.058], r: [0.07 * bx, 0.07 * by, 0.068], bone: 'hips', k: 0 });
  P({ t: 'cap', a: [0, spineY + 0.004, rump[2] + 0.06], b: [0, spineY + 0.01, zF - 0.01], ra: tr, rb: tr * 1.02, bone: 'hips', k: 0.03 });
  P({ t: 'ell', c: [0, spineY + 0.014, zF + 0.004], r: [0.068 * bx, 0.082 * by, 0.066], bone: 'chest', k: 0.035 });
  const nA = [0, spineY + 0.03, zF + 0.008], nB = [0, headC[1] - 0.042 * hs, headC[2] - 0.03 * hs];
  P({ t: 'cap', a: nA, b: nB, ra: 0.056 * bx, rb: 0.05 * bx, bone: 'neck', k: 0.03 });

  // ---- legs shell: column legs with rounded paws; hind legs carry the round haunch (thigh)
  const legsP = [];
  const leg = (s, front) => {
    const U = front ? (s > 0 ? 'fUL' : 'fUR') : (s > 0 ? 'hUL' : 'hUR');
    const L = front ? (s > 0 ? 'fLL' : 'fLR') : (s > 0 ? 'hLL' : 'hLR');
    const top = pos[U], kn = pos[L];
    const r0 = (front ? 0.029 : 0.031) * Math.sqrt(bx), r1 = (front ? 0.026 : 0.027) * Math.sqrt(bx);
    const pawZ = kn[2] + 0.008;
    legsP.push({ t: 'cap', a: [top[0], top[1] + 0.012, top[2]], b: kn, ra: r0, rb: r1, bone: U, k: 0.02 });
    if (!front) legsP.push({ t: 'ell', c: [s * (xH + 0.008), legTop + 0.008, zH + 0.008], r: [0.042 * bx, 0.058 * by, 0.062 * by], bone: U, k: 0.03 });
    legsP.push({ t: 'cap', a: kn, b: [kn[0], 0.026, pawZ - 0.004], ra: r1, rb: r1 * 0.96, bone: L, k: 0.008 });
    legsP.push({ t: 'ell', c: [kn[0] * 1.02, 0.018, pawZ + 0.006], r: [r1 * 1.12, 0.018, r1 * 1.38], bone: L, k: 0.014 });
  };
  for (const s of [1, -1]) { leg(s, true); leg(s, false); }

  // ---- head shell: chestnut, cheek ruffs, a real muzzle + nose bump + chin (the side profile)
  const head = [];
  const H = (x) => head.push(x);
  const hc = headC;
  H({ t: 'ell', c: hc, r: [0.094 * hs, 0.074 * hs, 0.075 * hs], bone: 'head', k: 0 });
  for (const s of [1, -1]) H({ t: 'ell', c: [hc[0] + s * 0.052 * hs, hc[1] - 0.024 * hs, hc[2] + 0.004], r: [0.06 * hs * (o.build === 'round' ? 1.08 : 1), 0.047 * hs, 0.058 * hs], bone: 'head', k: 0.03 });
  H({ t: 'ell', c: [hc[0], hc[1] - 0.029 * hs, hc[2] + 0.06 * hs], r: [0.04 * hs, 0.028 * hs, 0.036 * hs], bone: 'head', k: 0.02 });
  H({ t: 'sph', c: [hc[0], hc[1] - 0.017 * hs, hc[2] + 0.09 * hs], r: 0.011 * hs, bone: 'head', k: 0.012 });
  H({ t: 'ell', c: [hc[0], hc[1] - 0.052 * hs, hc[2] + 0.042 * hs], r: [0.024 * hs, 0.015 * hs, 0.02 * hs], bone: 'head', k: 0.016 });
  for (const e of ears) H(e);

  // ---- tail shell
  const tail = [];
  const T = (x) => tail.push(x);
  const tp = (i) => pos['tail' + Math.min(6, i + 1)];
  if (o.tail === 'pom') {
    // a clean scalloped tuft: one core and a ring of soft lobes facing the camera behind (kit pomPts)
    const c = [0, rump[1] + 0.01, rump[2] - 0.03];
    T({ t: 'sph', c, r: 0.037, bone: 'tail1', k: 0 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      T({ t: 'sph', c: v3.add(c, [Math.cos(a) * 0.03, Math.sin(a) * 0.03, -0.004]), r: 0.02, bone: 'tail1', k: 0.012 });
    }
    T({ t: 'sph', c: v3.add(c, [0, 0, -0.022]), r: 0.03, bone: 'tail1', k: 0.014 });
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
    { name: 'body', part: PART.body, cell: 0.0045, sigma: 0.012, prims: body },
    { name: 'legs', part: PART.legs, cell: 0.0036, sigma: 0.008, prims: legsP },
    { name: 'head', part: PART.head, cell: 0.003, sigma: 0.006, prims: head },
    { name: 'tail', part: PART.tail, cell: o.tail === 'pom' ? 0.0026 : 0.0035, sigma: 0.006, prims: tail },
  ];
  // ---- collar + bell (Mikan only; collars mean pets): seated ON the neck, square to its axis
  let collar = null;
  if (o.collar) {
    const axis = v3.norm(v3.sub(nB, nA));
    const cc = v3.add(nA, v3.mul(v3.sub(nB, nA), 0.5));
    const R = 0.053 * bx + 0.002;
    collar = { c: cc, axis };
    shells.push({ name: 'collar', part: PART.collar, cell: 0.0022, sigma: 0.01, prims: [{ t: 'tor', c: cc, axis, R, r: 0.0095, bone: 'neck', k: 0 }] });
    const f = v3.norm(v3.sub([0, 0, 1], v3.mul(axis, axis[2])));
    const front = v3.add(v3.add(cc, v3.mul(f, R + 0.013)), [0, -0.012, 0]);
    shells.push({ name: 'bell', part: PART.bell, cell: 0.0018, sigma: 0.01, prims: [{ t: 'sph', c: front, r: 0.0165, bone: 'neck', k: 0 }] });
  }
  return {
    bones: BONES.map((n) => ({ name: n, parent: PARENT[n] || null, pos: pos[n] })),
    shells,
    meta: {
      headC, hs, rump, spineY, ears: ears.map((e) => ({ o: e.F.o, u: e.F.u, v: e.F.v, w: e.F.w, A: e.A, B: e.B, C: e.C, th: e.th, side: e.side })),
      tailLen, legTop, zF, zH, xF, xH, collar,
    },
  };
}

/** The casts baked for M0. */
export const CASTS = {
  mikan: { build: 'standard', tail: 'pom', ears: 'standard', collar: true },
  // Wall Sitter tough: Round build (Bruiser-weighted), thick ringed tail, small round ears.
  wallSitter: { build: 'round', tail: 'ringed', ears: 'round', collar: false },
};

// PROTOTYPE - NOT FOR PRODUCTION
// Cat models as SDF smooth-unions (art bible §3.1: beans, chestnuts, poms, wedge ears).
// One skeleton for every cast; builds (Round / Standard / Long) are proportions, as in kit.js BUILD.
// Real-size metres (scale 1); the runtime multiplies by the 1.25 cat scale.
import { frame, v3 } from './sdf.js';

const BUILD = {
  round: { bx: 1.2, by: 1.12, leg: 0.84, head: 1.27, len: 1.0 },
  standard: { bx: 1, by: 1, leg: 1, head: 1.22, len: 1 },  // head ≈ 45–50% of height (owner turnaround)
  long: { bx: 0.88, by: 0.94, leg: 1.2, head: 1.12, len: 1.12 },
  huge: { bx: 1.42, by: 1.24, leg: 0.76, head: 1.08, len: 1.08 },   // Daifuku: Round at maximum puff (× rank 1.6 at runtime)
};
export const BONES = ['root', 'hips', 'chest', 'neck', 'head', 'earL', 'earR',
  'tail1', 'tail2', 'tail3', 'tail4', 'tail5', 'tail6',
  'fUL', 'fLL', 'fUR', 'fLR', 'hUL', 'hLL', 'hUR', 'hLR'];
const PARENT = { hips: 'root', chest: 'hips', neck: 'chest', head: 'neck', earL: 'head', earR: 'head', tail1: 'hips',
  tail2: 'tail1', tail3: 'tail2', tail4: 'tail3', tail5: 'tail4', tail6: 'tail5',
  fUL: 'chest', fLL: 'fUL', fUR: 'chest', fLR: 'fUR', hUL: 'hips', hLL: 'hUL', hUR: 'hips', hLR: 'hUR' };

/** Part ids (the shader's coat functions switch on these). */
export const PART = { body: 0, head: 1, tail: 2, collar: 3, bell: 4, legs: 5, regalia: 6 };

/**
 * @param {object} o build ('round'|'standard'|'long'|'huge'), tail ('pom'|'whip'|'ringed'|'plume'|'stub'),
 *   ears ('standard'|'tall'|'round'|'huge'), collar (bool), notch ('L'|'R': V bite in that ear, +X = L),
 *   fold ('L'|'R': tip folded forward), ruff (spiky cheek ruff), jowls (cheek scale, 1 = none), peg (clothes-peg regalia on the R ear)
 */
export function buildCast(o) {
  const B = BUILD[o.build || 'standard'];
  const bx = B.bx, by = B.by, lg = B.leg, hs = B.head, ln = B.len;
  const pos = {};
  // ---- skeleton (rest = standing, legs straight down, tail straight back)
  const legTop = 0.124 * lg + 0.018;       // shoulder / hip pivot height
  const knee = 0.052 * lg + 0.006;
  const spineY = legTop + 0.03 * by;
  const zF = 0.062 * ln, zH = -0.072 * ln;   // front / hind leg z
  const xF = 0.042 * bx, xH = 0.046 * bx;
  // front legs drop from the shoulder at the upper front of the chest, under the neck base (C7)
  const zFL = zF + 0.044 * ln;
  pos.root = [0, 0, 0];
  pos.hips = [0, spineY, -0.04 * ln];
  pos.chest = [0, spineY + 0.008, 0.035 * ln];
  pos.neck = [0, spineY + 0.035, zF + 0.012];
  const headC = [0, spineY + 0.118 * hs + 0.006, zF + 0.074 * hs]; // chestnut centre
  pos.head = [0, headC[1] - 0.06 * hs, headC[2] - 0.025 * hs];   // pivot low and behind: nods read well
  const rump = [0, spineY + 0.014, -0.112 * ln * (0.85 + 0.15 * bx)];
  const tailLen = { pom: 0.06, stub: 0.1, whip: 0.34, ringed: 0.31, plume: 0.33, long: 0.25 }[o.tail || 'whip'];
  const seg = tailLen / 6;
  const tailRoot = [0, spineY + 0.05 * by, rump[2] + 0.016]; // top of the rump, continuing the back line (C8 AD)
  for (let i = 0; i < 6; i++) pos['tail' + (i + 1)] = [0, tailRoot[1], tailRoot[2] + 0.004 - i * seg];
  pos.fUL = [xF, legTop + 0.012, zFL]; pos.fLL = [xF, knee, zFL];
  pos.fUR = [-xF, legTop + 0.012, zFL]; pos.fLR = [-xF, knee, zFL];
  pos.hUL = [xH, legTop + 0.01, zH + 0.008]; pos.hLL = [xH, 0.072 * lg, zH - 0.02]; // hLL = the hock (heel), above a near-vertical foot
  pos.hUR = [-xH, legTop + 0.01, zH + 0.008]; pos.hLR = [-xH, 0.072 * lg, zH - 0.02];

  // ---- ears (wedges in a local frame; base sits in the skull top)
  const earShape = {
    standard: { hw: 0.047, h: 0.092, tip: 0.007, th: 0.022 },
    tall: { hw: 0.036, h: 0.088, tip: 0.008, th: 0.018 },
    round: { hw: 0.044, h: 0.07, tip: 0.0, th: 0.022 },
    huge: { hw: 0.056, h: 0.112, tip: 0.008, th: 0.02 },
  }[o.ears || 'standard'];
  const ears = [1, -1].map((s) => {
    const base = [headC[0] + s * 0.057 * hs, headC[1] + 0.046 * hs, headC[2] - 0.016 * hs];
    pos[s > 0 ? 'earL' : 'earR'] = base;
    const up = v3.norm([s * 0.42, 1, -0.16]);
    const F = frame(base, up, [s * 0.62, 0, 1]);
    const E = earShape, sc = hs, folded = o.fold === (s > 0 ? 'L' : 'R');
    return { t: 'ear', F, A: [-E.hw * sc, -0.01], B: [E.hw * sc, -0.01], C: [s * E.tip * sc, E.h * sc * (folded ? 0.6 : 1)], folded,
      hw: E.hw * sc, th: E.th * sc, rr: o.ears === 'round' ? 0.01 : 0.005, H: E.h * sc, cup: 0.011, bone: s > 0 ? 'earL' : 'earR', k: 0.016, side: s };
  });

  // ---- torso shell: a bean (round rump, deep chest), thick neck. Legs are a SEPARATE shell so
  // their hull draws the drawn-cel overlap line where a leg crosses the body (AD fix 4).
  const body = [];
  const P = (x) => body.push(x);
  const tr = 0.072 * by;
  P({ t: 'ell', c: [0, spineY - 0.012, rump[2] + 0.058], r: [0.1 * bx, 0.082 * by, 0.072], bone: 'hips', k: 0 }); // the pear from behind: haunches live inside it
  P({ t: 'cap', a: [0, spineY + 0.004, rump[2] + 0.06], b: [0, spineY + 0.01, zF - 0.01], ra: tr, rb: tr * 1.02, bone: 'hips', k: 0.03 });
  P({ t: 'ell', c: [0, spineY + 0.0, zF + 0.026], r: [0.077 * bx, 0.092 * by, 0.072], bone: 'chest', k: 0.035 }); // full chest, pushed forward
  // convex bib: the chest leads the forelegs by ~1 cm and separates from them in the front view
  P({ t: 'ell', c: [0, spineY - 0.028, zF + 0.07], r: [0.05 * bx, 0.054 * by, 0.044], bone: 'chest', k: 0.03 });
  const nA = [0, spineY + 0.03, zF + 0.008], nB = [0, headC[1] - 0.042 * hs, headC[2] - 0.03 * hs];
  P({ t: 'cap', a: nA, b: nB, ra: 0.056 * bx, rb: 0.05 * bx, bone: 'neck', k: 0.03 });

  // ---- legs shell: column legs with rounded paws; hind legs carry the round haunch (thigh)
  const legsP = [];
  const leg = (s, front) => {
    const U = front ? (s > 0 ? 'fUL' : 'fUR') : (s > 0 ? 'hUL' : 'hUR');
    const L = front ? (s > 0 ? 'fLL' : 'fLR') : (s > 0 ? 'hLL' : 'hLR');
    const top = pos[U], kn = pos[L];
    if (front) { // sturdy column, big round paw
      const r0 = 0.033 * Math.sqrt(bx), r1 = 0.03 * Math.sqrt(bx), pawZ = kn[2] + 0.006;
      legsP.push({ t: 'cap', a: [top[0], top[1] + 0.012, top[2]], b: kn, ra: r0, rb: r1, bone: U, k: 0.02 });
      legsP.push({ t: 'cap', a: kn, b: [kn[0], 0.026, kn[2]], ra: r1, rb: r1, bone: L, k: 0.008 });
      legsP.push({ t: 'ell', c: [kn[0] * 1.03, 0.02, pawZ + 0.008], r: [r1 * 1.18, 0.02, r1 * 1.36], bone: L, k: 0.012 });
    } else {   // round thigh -> shin angled back to a visible hock -> upright foot -> big paw
      const x = s * xH, kb = Math.sqrt(bx);
      legsP.push({ t: 'ell', c: [s * (xH + 0.01), legTop + 0.0, zH + 0.022], r: [0.036 * bx, 0.064 * by, 0.064 * by], bone: U, k: 0 }); // inside the pear from behind (C7)
      legsP.push({ t: 'cap', a: [x * 1.06, legTop - 0.012, zH + 0.022], b: kn, ra: 0.034 * kb, rb: 0.018 * kb, bone: U, k: 0.03 });
      legsP.push({ t: 'cap', a: kn, b: [x, 0.026, zH - 0.008], ra: 0.019 * kb, rb: 0.023 * kb, bone: L, k: 0.006 });
      legsP.push({ t: 'sph', c: [x, kn[1] + 0.002, kn[2] - 0.009], r: 0.013 * kb, bone: L, k: 0.006 }); // heel point
      legsP.push({ t: 'ell', c: [x * 1.03, 0.02, zH + 0.004], r: [0.033 * kb, 0.02, 0.04 * kb], bone: L, k: 0.012 });
    }
  };
  for (const s of [1, -1]) { leg(s, true); leg(s, false); }

  // ---- head shell: chestnut, cheek ruffs, a real muzzle + nose bump + chin (the side profile)
  const head = [];
  const H = (x) => head.push(x);
  const hc = headC;
  H({ t: 'ell', c: [hc[0], hc[1] + 0.003 * hs, hc[2]], r: [0.093 * hs, 0.086 * hs, 0.088 * hs], bone: 'head', k: 0 }); // round cranium: the round, fat-cheeked face (owner C8)
  const jw = o.jowls || 1, cheekK = (o.build === 'round' || o.build === 'huge') ? 1.08 : 1;
  for (const s of [1, -1]) H({ t: 'ell', c: [hc[0] + s * 0.05 * hs * (1 + (jw - 1) * 0.5), hc[1] - (0.027 + (jw - 1) * 0.03) * hs, hc[2] + 0.02 * hs], r: [0.064 * hs * cheekK * jw, 0.054 * hs * (1 + (jw - 1) * 0.6), 0.064 * hs], bone: 'head', k: 0.034 }); // the KEEP front silhouette
  H({ t: 'ell', c: [hc[0], hc[1] - 0.046 * hs, hc[2] - 0.022 * hs], r: [0.062 * hs, 0.042 * hs, 0.06 * hs], bone: 'head', k: 0.036 }); // nape fill: a round lower outline from behind // full, low cheeks: the round fat face
  // lifted muzzle: a small stop under the brow (low blend), the nose tip the most forward point, chin tucked back
  // C9: between flat and the rejected dog snout. A nose BRIDGE slopes from the forehead (between the eyes) down to a
  // small snout whose nose tip and upper lip sit a little ahead of the cheek; then a small chin.
  H({ t: 'cap', a: [hc[0], hc[1] + 0.016 * hs, hc[2] + 0.074 * hs], b: [hc[0], hc[1] - 0.017 * hs, hc[2] + 0.099 * hs], ra: 0.016 * hs, rb: 0.011 * hs, bone: 'head', k: 0.014 }); // bridge
  H({ t: 'ell', c: [hc[0], hc[1] - 0.039 * hs, hc[2] + 0.074 * hs], r: [0.034 * hs, 0.021 * hs, 0.028 * hs], bone: 'head', k: 0.022 }); // upper lip / snout
  H({ t: 'ell', c: [hc[0], hc[1] - 0.024 * hs, hc[2] + 0.104 * hs], r: [0.013 * hs, 0.009 * hs, 0.009 * hs], bone: 'head', k: 0.012 }); // small nose tip: the most forward point
  H({ t: 'ell', c: [hc[0], hc[1] - 0.058 * hs, hc[2] + 0.046 * hs], r: [0.018 * hs, 0.011 * hs, 0.014 * hs], bone: 'head', k: 0.014 }); // small chin
  for (const e of ears) H(e);
  for (const e of ears) {
    const bone = e.bone, F = e.F;
    if (e.folded) { // the tip folds forward: a flap hinged at the shortened ear's top
      const top = v3.add(F.o, v3.mul(F.v, e.C[1] * 0.96));
      const Ff = frame(top, v3.add(v3.mul(F.w, 0.85), v3.mul(F.v, -0.35)), v3.mul(F.v, -1));
      H({ t: 'ear', F: Ff, A: [-e.hw * 0.58, -0.004], B: [e.hw * 0.58, -0.004], C: [0, e.H * 0.42], hw: e.hw * 0.58, th: e.th * 0.9, rr: 0.004, cup: 0, bone, k: 0.008 });
    }
  }
  if (o.ruff) for (const s of [1, -1]) for (const [dy, tilt] of [[-0.018, -0.15], [-0.042, -0.75]]) { // spiky cheek ruff (Togemaru)
    const b = [hc[0] + s * 0.118 * hs, hc[1] + dy * hs, hc[2] + 0.004 * hs]; // at the cheek's outer edge
    const F = frame(b, v3.norm([s, tilt, -0.15]), [0, 0, 1]);
    H({ t: 'ear', F, A: [-0.02 * hs, -0.012], B: [0.02 * hs, -0.012], C: [0, 0.042 * hs], hw: 0.02 * hs, th: 0.016, rr: 0.003, cup: 0, bone: 'head', k: 0.006 });
  }
  if (o.notch) { // silhouette Scar: a deep V bite out of the ear's outer edge (cut last)
    const e = ears[o.notch === 'L' ? 0 : 1], out = e.side > 0 ? 1 : -1;
    const Pm = [out * e.hw * 0.62, e.C[1] * 0.5];
    H({ t: 'vcut', F: e.F, A: [out * e.hw * 1.3, e.C[1] * 0.78], B: [out * e.hw * 1.3, e.C[1] * 0.3], C: [-out * e.hw * 0.08, e.C[1] * 0.6], th: 0.05, bone: e.bone, cut: true }); // a bold V to just past the midline: reads at 3 m (RV.notched)
  }

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
    const rad = { whip: [0.017, 0.012], ringed: [0.024, 0.02], plume: [0.024, 0.022], stub: [0.026, 0.022], long: [0.03, 0.026] }[o.tail];
    const pts = [[0, tailRoot[1] - 0.004, tailRoot[2] + 0.028], ...[1, 2, 3, 4, 5].map((i) => tp(i)), v3.add(tp(5), [0, 0, -seg])]; // root buried in the rump: no cap shows
    for (let i = 0; i < 6; i++) {
      const t0 = i / 6, t1 = (i + 1) / 6;
      const rA = rad[0] + (rad[1] - rad[0]) * t0, rB = rad[0] + (rad[1] - rad[0]) * t1;
      const plumeK = o.tail === 'plume' ? 1 + 0.5 * Math.sin(Math.PI * Math.min(1, t1 * 1.1)) : 1;
      T({ t: 'cap', a: pts[i], b: pts[i + 1], ra: rA * (o.tail === 'plume' ? 1 + 0.5 * Math.sin(Math.PI * t0) : 1), rb: rB * plumeK, bone: 'tail' + (i + 1), k: 0.004 });
    }
  }

  const hk = `head_${o.build || 'standard'}_${o.ears || 'standard'}${o.notch ? '_n' + o.notch : ''}${o.fold ? '_f' + o.fold : ''}${o.ruff ? '_ruff' : ''}${o.jowls ? '_j' + o.jowls : ''}${o.peg ? '_peg' : ''}`;
  const bk = `body_${o.build || 'standard'}`, tk = `tail_${o.build || 'standard'}_${o.tail || 'whip'}`;
  const shells = [
    { name: 'body', group: bk, part: PART.body, cell: 0.0045, sigma: 0.012, prims: body },
    { name: 'legs', group: bk, part: PART.legs, cell: 0.0036, sigma: 0.014, prims: legsP }, // soft joints: no fold-through at the wrist
    { name: 'head', group: hk, part: PART.head, cell: 0.003, sigma: 0.006, prims: head },
    { name: 'tail', group: tk, part: PART.tail, cell: o.tail === 'pom' ? 0.0026 : 0.0035, sigma: 0.006, prims: tail },
  ];
  if (o.peg) { // Kagi's regalia: a cream clothes-peg clipped to the outer edge of his right ear
    const e = ears[1], a = v3.add(v3.add(e.F.o, v3.mul(e.F.u, -e.hw * 0.62)), v3.mul(e.F.v, e.C[1] * 0.38));
    const b = v3.add(v3.add(a, v3.mul(e.F.u, -0.03)), v3.mul(e.F.v, -0.01));
    shells.push({ name: 'peg', group: hk, part: PART.regalia, cell: 0.0018, sigma: 0.01, prims: [{ t: 'cap', a, b, ra: 0.0075, rb: 0.0075, bone: 'earR', k: 0 }] });
  }
  // ---- collar + bell (Mikan only; collars mean pets): seated ON the neck, square to its axis
  let collar = null;
  if (o.collar) {
    const axis = v3.norm(v3.sub(nB, nA));
    const cc = v3.add(nA, v3.mul(v3.sub(nB, nA), 0.5));
    const R = 0.054 * bx + 0.002;
    collar = { c: cc, axis };
    shells.push({ name: 'collar', group: `collar_${o.build || 'standard'}`, part: PART.collar, cell: 0.0022, sigma: 0.01, prims: [{ t: 'tor', c: cc, axis, R, r: 0.011, bone: 'neck', k: 0 }] });
    const f = v3.norm(v3.sub([0, 0, 1], v3.mul(axis, axis[2])));
    const front = v3.add(v3.add(cc, v3.mul(f, R + 0.012)), [0, -0.019, 0.017]); // hangs proud of the full chest
    shells.push({ name: 'bell', group: `collar_${o.build || 'standard'}`, part: PART.bell, cell: 0.0018, sigma: 0.01, prims: [{ t: 'sph', c: front, r: 0.0165, bone: 'neck', k: 0 }] });
  }
  return {
    bones: BONES.map((n) => ({ name: n, parent: PARENT[n] || null, pos: pos[n] })),
    shells,
    meta: {
      paws: { xF: xF * 1.03, xH: xH * 1.03, zF: pos.fLL[2] + 0.018, zH: zH + 0.004 },
      headC, hs, rump, spineY, ears: ears.map((e) => ({ o: e.F.o, u: e.F.u, v: e.F.v, w: e.F.w, A: e.A, B: e.B, C: e.C, th: e.th, side: e.side })),
      tailLen, legTop, zF, zH, xF, xH, collar, earDims: { hw: earShape.hw, h: earShape.h, tip: earShape.tip },
    },
  };
}

/** Geometry of every named cast (look lives in src/render/cats/casts.js). */
export const CASTS = {
  mikan: { build: 'standard', tail: 'long', ears: 'standard', collar: true }, // canon change C8: long tail (was the pom bobtail)
  // Wall Sitter tough (M0): Round build (Bruiser-weighted), thick ringed tail, small round ears.
  wallSitter: { build: 'round', tail: 'ringed', ears: 'round' },
  // The old wall cat (art bible §5.2: lean grey elder on the Long mesh, the one notched ear; GDD: heavy jowls)
  hige: { build: 'long', tail: 'whip', ears: 'tall', notch: 'R', jowls: 1.12 },
  // Small round calico, one ear always half-folded
  pon: { build: 'round', tail: 'plume', ears: 'round', fold: 'L' },
  // Pale fawn, huge ears, thin
  kinako: { build: 'long', tail: 'whip', ears: 'huge' },
  // Lean black-and-tan tom, spiky cheek ruff, deep V notch in the ear on the viewer's right front-on (+X)
  togemaru: { build: 'long', tail: 'plume', ears: 'standard', notch: 'L', ruff: true },
  // Long-bodied silver tabby, tall ears, clothes-peg regalia
  kagi: { build: 'long', tail: 'whip', ears: 'tall', peg: true },
  // The Boss: an enormous loaf, folded jowls visible past the cheeks from behind, thick short tail
  daifuku: { build: 'huge', tail: 'stub', ears: 'round', jowls: 1.35 },
};
/** Generic gang members: every build × ears × tail combination is baked (parts are shared). */
export const TOUGH = { builds: ['round', 'standard', 'long'], ears: ['standard', 'tall', 'round'], tails: ['whip', 'plume', 'ringed', 'stub'] };

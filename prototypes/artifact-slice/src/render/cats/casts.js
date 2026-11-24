// PROTOTYPE - NOT FOR PRODUCTION
// Runtime cast styles: coat colours (kit.js COATS), eye colour, face expression, coat-pattern GLSL.
// Pattern functions run per fragment in REST (bind-pose) object space, so marks ride the skin and
// their edges stay hard and borderless (L-7). Inputs: vRest, vP, vAux, h = vRest - uHeadC.
export const INK = '#33273B';
export const PINK_EAR = '#F7A3B7';
export const PAD = '#F6809A';

const EAR_INNER = /* glsl */`
  // inner-ear pink: an inset triangle on the front face of the wedge (aux = ear-local u,v,w)
  float earInner(vec3 a, float side, float hw, float h, float tip) {
    if (a.z < 0.0) return 0.0;
    vec2 A = vec2(-hw * 0.6, 0.004), B = vec2(hw * 0.6, 0.004), C = vec2(side * tip * 0.7, h * 0.8);
    vec2 p = a.xy;
    float e0 = (B.x - A.x) * (p.y - A.y) - (B.y - A.y) * (p.x - A.x);
    float e1 = (C.x - B.x) * (p.y - B.y) - (C.y - B.y) * (p.x - B.x);
    float e2 = (A.x - C.x) * (p.y - C.y) - (A.y - C.y) * (p.x - C.x);
    float s = sign(e0 + e1 + e2);
    return (e0 * s >= 0.0 && e1 * s >= 0.0 && e2 * s >= 0.0) ? 1.0 : 0.0;
  }
  // is this head fragment on the ear (above the skull)?
  float onEar(vec3 a, float h) { return (a.y > 0.004 && a.y < h * 1.2 && abs(a.z) < 0.02) ? 1.0 : 0.0; }
`;

export const CASTS = {
  mikan: {
    entry: 'mikan', carry: 'pom',
    colors: { white: '#FFF8EC', ginger: '#F28C28', collar: '#D02A45', gold: '#F2B01E', ear: PINK_EAR, ink: INK, cream: '#FFF6E3' },
    eye: '#FFB52E', expr: 'neutral', lid: '#FFF8EC', lidR: '#FFF8EC', lidL: '#F28C28',
    ear: { hw: 0.047, h: 0.092, tip: 0.007 },
    glsl: EAR_INNER + /* glsl */`
  vec3 coat() {
    vec3 h = vRest - uHeadC;
    if (vP < 0.5) {
      // collar band painted on the neck surface along the torus plane: carries the collar line
      // wherever the neck shows below the big head (the from-behind read, art bible §5.1)
      vec3 dc = vRest - uCollarC;
      if (abs(dot(dc, uCollarAx)) < 0.0105 && length(dc) < 0.085) return c_collar;
      return c_white;
    }
    if (vP < 1.5) {
      float side = h.x >= 0.0 ? 1.0 : -1.0;
      if (onEar(vAux, uEar.y) > 0.5) return earInner(vAux, side, uEar.x, uEar.y, uEar.z) > 0.5 ? c_ear : c_ginger;
      // the ginger cap: low at the back and sides, rising to the brow at the front, wavy edge,
      // a small white blaze between the eyes; plus the patch over the LEFT eye (+X)
      float front = smoothstep(0.01, 0.075, h.z);
      float ang = atan(h.x, -h.z);
      float edge = mix(-0.018, 0.026, front) + 0.0045 * sin(ang * 6.0) * (1.0 - front);
      edge += 0.03 * front * max(0.0, 1.0 - abs(h.x) / 0.016);
      if (h.y > edge) return c_ginger;
      vec3 q = (h - vec3(0.047, 0.004, 0.06)) / vec3(0.044, 0.04, 0.06);
      if (dot(q, q) < 1.0 && h.z > 0.0) return c_ginger;
      return c_white;
    }
    if (vP < 2.5) return c_ginger;
    if (vP < 3.5) return c_collar;
    // bell: gold, ink slit, cream highlight
    if (abs(vAux.y + 0.004) < 0.0018 && vAux.z > 0.0) return c_ink;
    if (length(vAux - vec3(-0.006, 0.008, 0.012)) < 0.0055) return c_cream;
    return c_gold;
  }`,
  },
  wallSitter: {
    entry: 'wallSitter', carry: 'flag',
    // Wall Sitters lean to White / Cream / Silver (art bible §3.4): a silver tabby tough.
    colors: { base: '#CDD1DC', stripe: '#8E93A8', muzzle: '#EEF0F2', ear: PINK_EAR, ink: INK },
    eye: '#C9D64A', expr: 'smug', lid: '#CDD1DC', lidR: '#CDD1DC', lidL: '#CDD1DC',
    ear: { hw: 0.044, h: 0.07, tip: 0.0 },
    glsl: EAR_INNER + /* glsl */`
  vec3 coat() {
    vec3 h = vRest - uHeadC;
    if (vP < 0.5) {
      // dorsal tabby chevrons: 4 bold bands, meeting at the spine, fading out down the flanks
      float z = vRest.z, x = abs(vRest.x), y = vRest.y;
      float band = fract((z + 0.13) / 0.064 - x * 7.0);
      float onBack = step(uSpineY - 0.035 + x * 0.25, y);
      if (z < 0.07 && z > -0.15 && band < 0.36 && onBack > 0.5) return c_stripe;
      // socks of stripes on the outside of the haunches
      return c_base;
    }
    if (vP < 1.5) {
      float side = h.x >= 0.0 ? 1.0 : -1.0;
      if (onEar(vAux, uEar.y) > 0.5) return earInner(vAux, side, uEar.x, uEar.y, uEar.z) > 0.5 ? c_ear : c_base;
      // forehead M: three tapering stripes from the crown toward the brow
      if (h.y > 0.022) {
        for (int i = -1; i <= 1; i++) {
          float cx = float(i) * 0.024;
          float w = 0.0065 * clamp((h.y - 0.022) / 0.05, 0.0, 1.0) + 0.0015;
          if (abs(h.x - cx) < w && h.z > -0.04) return c_stripe;
        }
      }
      // cheek stripes
      float ch = abs(h.x);
      if (ch > 0.06 && abs(h.y + 0.04 - (ch - 0.06) * 0.25) < 0.005 && h.z > -0.035 && h.z < 0.012) return c_stripe;
      if (h.z > 0.04 && h.y < -0.02 && abs(h.x) < 0.045) return c_muzzle;
      return c_base;
    }
    // ringed tail
    return fract(vAux.x * 5.5 + 0.2) < 0.45 ? c_stripe : c_base;
  }`,
  },
};

/* ---------------------------------------------------------------- generic coat (all other casts)
 * One shader for every generated / authored coat (kit.js patternOverlays): the pattern is a uniform,
 * so every cat that uses it shares one compiled program. Pattern ids: */
export const PATTERN = { solid: 0, bicolour: 1, tabby: 2, patched: 3, pointed: 4, tuxedo: 5, saddle: 6 };
export const COATS = {
  white: '#FFF8EC', cream: '#F4DDAA', silver: '#CDD1DC', grey: '#8E93A8', charcoal: '#514D60',
  black: '#37323F', marmalade: '#C98A4A', chocolate: '#7C5438', fawn: '#E3C39A', seal: '#5E4636',
};
export const EYES = { amber: '#FFB52E', green: '#7CC25A', yellowgreen: '#C9D64A', blue: '#5BB4F0', copper: '#D9772E' };
const GENERIC = EAR_INNER + /* glsl */`
  vec3 coat() {
    vec3 h = vRest - uHeadC; float hs = uHS; int P = int(uPattern + 0.5);
    bool legs = vPart > 4.5 && vPart < 5.5;
    if (vPart > 5.5) return c_cream;                       // regalia (Kagi's clothes-peg)
    vec3 sd = vec3(sin(uSeed * 1.7), cos(uSeed * 2.3), sin(uSeed * 0.9)) * 0.015;
    if (vP > 0.5 && vP < 1.5) {                            // ---- head
      float side = h.x >= 0.0 ? 1.0 : -1.0;
      if (onEar(vAux, uEar.y) > 0.5) {
        if (earInner(vAux, side, uEar.x, uEar.y, uEar.z) > 0.5) return c_ear;
        if (P == 4 || P == 6) return c_patch;
        if (P == 3) return side > 0.0 ? c_patch : c_patch2;
        return c_base;
      }
      float front = smoothstep(0.01 * hs, 0.075 * hs, h.z);
      vec3 mq = (h - vec3(0.0, -0.04, 0.07) * hs) / (vec3(0.058, 0.034, 0.07) * hs);
      bool muzzle = dot(mq, mq) < 1.0 && h.z > 0.0;   // a soft oval, not a box
      bool blaze = h.z > 0.05 * hs && h.y < 0.045 * hs && abs(h.x) < 0.007 * hs + max(0.0, 0.035 * hs - h.y) * 0.3;
      if (P == 1) return (muzzle || blaze) ? c_white : c_base;
      if (P == 5) return muzzle ? c_white : c_base;
      if (P == 2) {
        if (h.y > 0.022 * hs) for (int i = -1; i <= 1; i++) {
          float w = (0.0065 * clamp((h.y - 0.022 * hs) / (0.05 * hs), 0.0, 1.0) + 0.0015) * hs;
          if (abs(h.x - float(i) * 0.024 * hs) < w && h.z > -0.04 * hs) return c_patch;
        }
        float ch = abs(h.x);
        if (ch > 0.06 * hs && abs(h.y + 0.04 * hs - (ch - 0.06 * hs) * 0.25) < 0.005 * hs && h.z > -0.035 * hs && h.z < 0.012 * hs) return c_patch;
        return muzzle ? mix(c_base, c_white, 0.6) : c_base;
      }
      if (P == 3) {                                       // calico: ginger over the +X eye and ear, charcoal over the other ear
        if (h.x > 0.004 * hs && h.y > -0.02 * hs && !blaze) return c_patch;
        if (h.x < -0.01 * hs && h.y > 0.035 * hs) return c_patch2;
        return c_base;
      }
      if (P == 4) { vec3 q = (h - vec3(0.0, -0.026, 0.07) * hs) / (vec3(0.072, 0.056, 0.075) * hs); return (dot(q, q) < 1.0 && h.z > 0.0) ? c_patch : c_base; }
      if (P == 6) return h.y > mix(-0.004, 0.03, front) * hs + 0.004 * sin(atan(h.x, -h.z) * 6.0) * (1.0 - front) ? c_patch : c_base;
      return c_base;
    }
    if (vP > 1.5 && vP < 2.5) {                            // ---- tail
      if (P == 1 || P == 5) return vAux.x > 0.82 ? c_white : c_base;
      if (P == 2) return fract(vAux.x * 5.5 + 0.2) < 0.45 ? c_patch : c_base;
      if (P == 3) return c_patch2;
      if (P == 4 || P == 6) return c_patch;
      return c_base;
    }
    // ---- body and legs
    float x = abs(vRest.x), y = vRest.y, z = vRest.z;
    bool socks = legs && y < 0.05;
    bool chest = !legs && z > uZF + 0.005 && y < uSpineY + 0.015 && x < 0.062;
    bool belly = !legs && y < uSpineY - 0.05;
    if (P == 1) return (socks || chest || belly) ? c_white : c_base;
    if (P == 5) return ((legs && y < 0.036) || (chest && y < uSpineY - 0.004)) ? c_white : c_base;
    if (P == 2) {
      float band = fract((z - uZF + 0.2) / 0.064 - x * 7.0);
      bool onBack = y > uSpineY - 0.035 + x * 0.25;
      if (!legs && z < uZF + 0.01 && band < 0.36 && onBack) return c_patch;
      if (legs && y > 0.05 && fract(y / 0.034) < 0.32 && vRestN.z < 0.2) return c_patch;   // leg bars, outer faces
      return c_base;
    }
    if (P == 3) {
      vec3 a = (vRest - vec3(0.05, uSpineY + 0.035, uZF - 0.14) - sd) / vec3(0.08, 0.075, 0.085);
      vec3 b = (vRest - vec3(-0.055, uSpineY + 0.025, uZF - 0.02) + sd) / vec3(0.07, 0.07, 0.065);
      if (!legs && dot(a, a) < 1.0) return c_patch;
      if (!legs && dot(b, b) < 1.0) return c_patch2;
      return c_base;
    }
    if (P == 4) return (legs && y < 0.07) ? c_patch : c_base;
    if (P == 6) return (!legs && y > uSpineY + 0.02 && z < uZF + 0.03) ? c_patch : c_base;
    return c_base;
  }`;
const GCOL = (c) => ({ base: c.base, white: c.white || COATS.white, patch: c.patch || c.base, patch2: c.patch2 || COATS.charcoal, ear: PINK_EAR, ink: INK, cream: '#FFF6E3' });
function generic(entry, c, pattern, eye, expr, carry, extra = {}) {
  const colors = GCOL(c);
  const lid = (pattern === 'pointed' ? colors.patch : colors.base);
  return Object.assign({ entry, colors, pattern: PATTERN[pattern], eye, expr, carry, lid, lidL: lid, lidR: lid, glsl: GENERIC }, extra);
}
// The slice's named cats (crew-and-progression §3.3; rival-helpers.js; art bible §5.2 / §3.3)
CASTS.hige = generic('hige', { base: COATS.grey, patch: COATS.charcoal }, 'solid', EYES.yellowgreen, 'sleepy', 'post');
CASTS.pon = generic('pon', { base: COATS.white, patch: COATS.marmalade, patch2: COATS.charcoal }, 'patched', EYES.green, 'happy', 'spring', { rank: 0.9, lidL: COATS.marmalade, lidR: COATS.white });
CASTS.kinako = generic('kinako', { base: COATS.fawn, patch: COATS.seal }, 'pointed', EYES.blue, 'shock', 'comma');
CASTS.togemaru = generic('togemaru', { base: COATS.black, white: '#D9A060', patch: '#D9A060' }, 'tuxedo', EYES.yellowgreen, 'smug', 'flag');
CASTS.kagi = generic('kagi', { base: COATS.silver, patch: '#7D8397' }, 'tabby', EYES.yellowgreen, 'smug', 'blade', { rank: 1.15 });
CASTS.daifuku = generic('daifuku', { base: COATS.white, patch: '#A9AEC0' }, 'saddle', EYES.copper, 'smug', 'anchor', { rank: 1.6 });

const PERSONALITY_CARRY = { braggart: 'flag', stalwart: 'post', goofball: 'spring', schemer: 'blade', brooder: 'anchor', fraidy: 'comma' };
/**
 * Style for a cast name. 'tough' is the generic gang member:
 *   createCat({ cast: 'tough', coat, pattern, tail, ears, build, eye, expr, personality | carry, rank, seed })
 *   coat: COATS key, a hex, or { base, white, patch, patch2 }; pattern: solid | bicolour | tabby | patched |
 *   pointed | tuxedo | saddle; tail: whip | plume | ringed | stub; ears: standard | tall | round;
 *   build: round | standard | long. Defaults: a silver bicolour Wall Sitter, Round, standard ears, whip tail.
 */
export function resolveStyle(cast, o = {}) {
  if (cast !== 'tough') return CASTS[cast] || CASTS.mikan;
  const build = ['round', 'standard', 'long'].includes(o.build) ? o.build : 'round';
  const ears = ['standard', 'tall', 'round'].includes(o.ears) ? o.ears : 'standard';
  const tail = ['whip', 'plume', 'ringed', 'stub'].includes(o.tail) ? o.tail : 'whip';
  let c = o.coat || { base: COATS.silver, white: COATS.white };
  if (typeof c === 'string') c = { base: COATS[c] || c };
  c = Object.fromEntries(Object.entries(c).map(([k, v]) => [k, COATS[v] || v]));
  const pattern = PATTERN[o.pattern] !== undefined ? o.pattern : 'bicolour';
  const carry = o.carry || PERSONALITY_CARRY[o.personality] || 'anchor';
  return generic(`tough:${build}:${ears}:${tail}`, c, pattern, EYES[o.eye] || o.eye || EYES.copper, o.expr || 'angry', carry, { rank: o.rank || 1, seed: o.seed || 0 });
}

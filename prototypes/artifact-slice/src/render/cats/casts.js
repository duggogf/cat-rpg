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
    vec2 A = vec2(-hw * 0.52, 0.006), B = vec2(hw * 0.52, 0.006), C = vec2(side * tip * 0.7, h * 0.74);
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
    mesh: 'mikan',
    colors: { white: '#FFF8EC', ginger: '#F28C28', collar: '#D02A45', gold: '#F2B01E', ear: PINK_EAR, ink: INK, cream: '#FFF6E3' },
    eye: '#FFB52E', expr: 'neutral', lid: '#FFF8EC', lidR: '#FFF8EC', lidL: '#F28C28',
    ear: { hw: 0.04, h: 0.072, tip: 0.012 },
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
    mesh: 'wallSitter',
    // Wall Sitters lean to White / Cream / Silver (art bible §3.4): a silver tabby tough.
    colors: { base: '#CDD1DC', stripe: '#8E93A8', muzzle: '#EEF0F2', ear: PINK_EAR, ink: INK },
    eye: '#C9D64A', expr: 'smug', lid: '#CDD1DC', lidR: '#CDD1DC', lidL: '#CDD1DC',
    ear: { hw: 0.038, h: 0.056, tip: 0.0 },
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

// "Kitsu" — an original chubby red-fox mascot, built as SDF smooth unions (one shell per part: body, head,
// tail, legs), polygonised with surface nets; the SDF gradient is the smooth normal for both the cel
// terminator and the ink hull. Fox-local: faces +Z, +Y up, its left is +X, metres.
import * as THREE from 'three';
import { shellSdf, shellBounds, frame } from './sdf.js';

const sph = (c, r, k = 0) => ({ t: 'sph', c, r, k });
const ell = (c, r, k = 0) => ({ t: 'ell', c, r, k });
const cap = (a, b, ra, rb, k = 0) => ({ t: 'cap', a, b, ra, rb, k });
function ear(s) {
  const hw = 0.058;
  return { t: 'ear', F: frame([s * 0.098, 0.62, 0.19], [s * 0.5, 1, -0.06], [0, 0, 1]), A: [-hw, 0], B: [hw, 0], C: [0, 0.16], hw, th: 0.034, rr: 0.012, cup: 0.012, k: 0.03 };
}
export const NOSE = [0, 0.476, 0.385], TAILTIP = [0.235, 0.5, -0.63];
export const SHELLS = [
  { part: 0, name: 'body', prims: [ell([0, 0.3, 0.01], [0.18, 0.165, 0.24]), sph([0, 0.285, -0.12], 0.165, 0.08), sph([0, 0.33, 0.13], 0.155, 0.08),
    cap([0, 0.36, 0.14], [0, 0.44, 0.19], 0.105, 0.09, 0.06)] },
  { part: 1, name: 'head', prims: [ell([0, 0.53, 0.2], [0.162, 0.145, 0.138]), ell([0.108, 0.474, 0.2], [0.076, 0.06, 0.072], 0.04), ell([-0.108, 0.474, 0.2], [0.076, 0.06, 0.072], 0.04),
    cap([0, 0.472, 0.28], [0, 0.466, 0.368], 0.058, 0.03, 0.05), sph(NOSE, 0.021, 0.008), ear(1), ear(-1)] },
  { part: 2, name: 'tail', prims: [[0, 0.37, -0.24, 0.06], [0.02, 0.33, -0.34, 0.085], [0.06, 0.3, -0.45, 0.105], [0.12, 0.31, -0.55, 0.108],
    [0.18, 0.37, -0.62, 0.088], [0.22, 0.45, -0.64, 0.058], [0.235, 0.5, -0.63, 0.032]].map((q, i) => sph([q[0], q[1], q[2]], q[3], i ? 0.07 : 0)) },
  { part: 3, name: 'legs', prims: [1, -1].flatMap((s) => [
    cap([s * 0.075, 0.3, 0.15], [s * 0.08, 0.05, 0.165], 0.052, 0.042), ell([s * 0.08, 0.035, 0.19], [0.048, 0.035, 0.062], 0.03),
    sph([s * 0.07, 0.25, -0.14], 0.08, 0.05), cap([s * 0.08, 0.25, -0.13], [s * 0.085, 0.05, -0.12], 0.066, 0.044, 0.04), ell([s * 0.085, 0.035, -0.095], [0.05, 0.035, 0.065], 0.03)]) },
];

/** Surface nets over a shell SDF. Returns {pos, nrm, thick} with gradient normals and local thickness. */
function surfaceNets(f, b, h) {
  const nx = Math.ceil((b.mx[0] - b.mn[0]) / h) + 2, ny = Math.ceil((b.mx[1] - b.mn[1]) / h) + 2, nz = Math.ceil((b.mx[2] - b.mn[2]) / h) + 2;
  const P = (x, y, z) => [b.mn[0] + x * h, b.mn[1] + y * h, b.mn[2] + z * h];
  const V = new Float32Array(nx * ny * nz), I = (x, y, z) => (z * ny + y) * nx + x;
  for (let z = 0; z < nz; z++) for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) V[I(x, y, z)] = f(P(x, y, z));
  const cell = new Int32Array(nx * ny * nz).fill(-1), verts = [];
  const E = []; for (let a = 0; a < 8; a++) for (let d = 0; d < 3; d++) { const c = a ^ (1 << d); if (c > a) E.push([a, c]); }
  for (let z = 0; z < nz - 1; z++) for (let y = 0; y < ny - 1; y++) for (let x = 0; x < nx - 1; x++) {
    const v = []; let neg = 0;
    for (let a = 0; a < 8; a++) { const val = V[I(x + (a & 1), y + ((a >> 1) & 1), z + ((a >> 2) & 1))]; v.push(val); if (val < 0) neg++; }
    if (neg === 0 || neg === 8) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, c] of E) {
      if ((v[a] < 0) === (v[c] < 0)) continue;
      const t = v[a] / (v[a] - v[c]);
      sx += (a & 1) + t * ((c & 1) - (a & 1)); sy += ((a >> 1) & 1) + t * (((c >> 1) & 1) - ((a >> 1) & 1)); sz += ((a >> 2) & 1) + t * (((c >> 2) & 1) - ((a >> 2) & 1)); n++;
    }
    cell[I(x, y, z)] = verts.length;
    verts.push(P(x + sx / n, y + sy / n, z + sz / n));
  }
  const tris = [];
  const quad = (a, b2, c, d) => { if (a < 0 || b2 < 0 || c < 0 || d < 0) return; tris.push([a, b2, c], [a, c, d]); };
  for (let z = 1; z < nz - 1; z++) for (let y = 1; y < ny - 1; y++) for (let x = 1; x < nx - 1; x++) {
    const s0 = V[I(x, y, z)] < 0;
    if (x < nx - 1 && s0 !== (V[I(x + 1, y, z)] < 0)) quad(cell[I(x, y - 1, z - 1)], cell[I(x, y, z - 1)], cell[I(x, y, z)], cell[I(x, y - 1, z)]);
    if (y < ny - 1 && s0 !== (V[I(x, y + 1, z)] < 0)) quad(cell[I(x - 1, y, z - 1)], cell[I(x, y, z - 1)], cell[I(x, y, z)], cell[I(x - 1, y, z)]);
    if (z < nz - 1 && s0 !== (V[I(x, y, z + 1)] < 0)) quad(cell[I(x - 1, y - 1, z)], cell[I(x, y - 1, z)], cell[I(x, y, z)], cell[I(x - 1, y, z)]);
  }
  const grad = (p) => { const e = h * 0.5; const g = [f([p[0] + e, p[1], p[2]]) - f([p[0] - e, p[1], p[2]]), f([p[0], p[1] + e, p[2]]) - f([p[0], p[1] - e, p[2]]), f([p[0], p[1], p[2] + e]) - f([p[0], p[1], p[2] - e])];
    const l = Math.hypot(...g) || 1; return g.map((q) => q / l); };
  const nrm = verts.map(grad);
  const idx = [];
  for (const t of tris) { // orient each triangle with the SDF gradient
    const [A, B, Cc] = t.map((i) => verts[i]);
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], w = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]];
    const fn = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const gn = nrm[t[0]];
    if (fn[0] * gn[0] + fn[1] * gn[1] + fn[2] * gn[2] < 0) idx.push(t[0], t[2], t[1]); else idx.push(t[0], t[1], t[2]);
  }
  const thick = verts.map((p, i) => { const n = nrm[i]; let t = 0.004; while (t < 0.5 && f([p[0] - n[0] * t, p[1] - n[1] * t, p[2] - n[2] * t]) < 0) t += 0.004; return t; });
  return { verts, nrm, thick, idx };
}

export function bakeShell(S, h = 0.0065) {
  const f = shellSdf(S), r = surfaceNets(f, shellBounds(S, 0.03), h);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(r.verts.flat(), 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(r.nrm.flat(), 3));
  g.setAttribute('thick', new THREE.Float32BufferAttribute(r.thick, 1));
  g.setAttribute('part', new THREE.Float32BufferAttribute(new Array(r.verts.length).fill(S.part), 1));
  g.setIndex(r.idx); g.computeBoundingSphere();
  return g;
}

/* ------------------------------------------------------------------ colours (raw sRGB) */
export function hexV(h) { const n = parseInt(h.slice(1), 16); return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); }
function rgb2hsv([r, g, b]) { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let hh = 0;
  if (d) hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; return [hh, mx ? d / mx : 0, mx]; }
function hsv2rgb([hh, s, v]) { const c = v * s, x = c * (1 - Math.abs(((hh / 60) % 2) - 1)), m = v - c; const k = Math.floor(hh / 60) % 6;
  const t = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][k]; return t.map((q) => q + m); }
/** Authored shade (palette tone rules): hue 12 deg toward violet (270), saturation +8, value -21; whites -> lavender #D8D2EA. */
export function authoredShade(hex) {
  const c = hexV(hex), hsv = rgb2hsv([c.x, c.y, c.z]);
  if (hsv[1] < 0.15 && hsv[2] > 0.85) return hexV('#D8D2EA');
  let dh = 270 - hsv[0]; if (dh > 180) dh -= 360; if (dh < -180) dh += 360;
  const out = hsv2rgb([(hsv[0] + Math.sign(dh) * Math.min(12, Math.abs(dh)) + 360) % 360, Math.min(1, hsv[1] + 0.08), Math.max(0, hsv[2] - 0.21)]);
  return new THREE.Vector3(...out);
}
export const COAT = { red: '#E2632B', cream: '#FFF4E0', dark: '#4E3440', nose: '#3B2B3F', inner: '#F7D6C4' };

/* ------------------------------------------------------------------ shaders */
const VARY = 'varying vec3 vRest; varying vec3 vRestN; varying vec3 vWN; varying float vPart;';
const BAYER = 'float bayer4(vec2 p){ ivec2 i = ivec2(mod(p, 4.0)); int b[16] = int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(b[i.y * 4 + i.x]) + 0.5) / 16.0; }';
const fillVert = /* glsl */`
  attribute float part; ${VARY}
  void main() { vRest = position; vRestN = normal; vPart = part; vWN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const names = Object.keys(COAT);
const fillFrag = /* glsl */`
  ${VARY}
  uniform vec3 uKeyDir, uLitMul, uZone, uInk; uniform float uTerm, uFade, uMask;
  ${names.map((n) => `uniform vec3 c_${n}, s_${n};`).join(' ')}
  uniform vec3 uEyeC[2], uEyeAx[2], uEyeT[2], uEyeCol; uniform vec2 uEyeR;
  uniform vec3 uNose, uTailTip;
  ${BAYER}
  // hard-edged, borderless coat patches: inside when d < 0, antialiased over one pixel
  float inside(float d) { float a = max(fwidth(d) * 0.75, 1e-5); return 1.0 - smoothstep(-a, a, d); }
  void pick(inout vec3 L, inout vec3 S, vec3 l, vec3 s, float k) { L = mix(L, l, k); S = mix(S, s, k); }
  void main() {
    if (uFade < 0.999 && bayer4(gl_FragCoord.xy) > uFade) discard;
    if (uMask > 1.5) { gl_FragColor = vec4(1.0); return; }
    vec3 p = vRest; int part = int(vPart + 0.5);
    vec3 L = c_red, S = s_red;
    if (part == 0) {
      float bib = length((p - vec3(0.0, 0.31, 0.2)) / vec3(0.085, 0.125, 0.13)) - 1.0;
      pick(L, S, c_cream, s_cream, inside(bib));
      pick(L, S, c_cream, s_cream, inside(max(p.y - 0.185, abs(p.x) - 0.1)));
    } else if (part == 1) {
      pick(L, S, c_cream, s_cream, inside(max(p.y - 0.452 - 0.04 * smoothstep(0.1, 0.31, p.z) - 0.012 * smoothstep(0.06, 0.15, abs(p.x)), 0.11 - p.z)));
      if (p.y > 0.62) {
        pick(L, S, c_inner, s_inner, inside(max(0.25 - vRestN.z, p.y - 0.715)) * step(0.64, p.y));
        pick(L, S, c_dark, s_dark, max(inside(0.725 - p.y), inside(vRestN.z + 0.25) * step(0.69, p.y)));
      }
      pick(L, S, c_nose, s_nose, inside(length(p - uNose) - 0.025));
    } else if (part == 2) {
      pick(L, S, c_cream, s_cream, inside(length(p - uTailTip) - 0.085));
    } else {
      pick(L, S, c_dark, s_dark, inside(p.y - 0.13 - 0.015 * sin(p.z * 40.0)));
    }
    // two tones, hard terminator (one-pixel antialias) against the character key
    float ndl = dot(normalize(vWN), uKeyDir);
    float aa = max(fwidth(ndl) * 0.75, 1e-4);
    float sh = 1.0 - smoothstep(uTerm - aa, uTerm + aa, ndl);
    if (uMask > 0.5) { gl_FragColor = vec4(sh > 0.5 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0), 1.0); return; }
    vec3 col = mix(L, S, sh);
    if (part == 1) {
      // mouth: a small ink smile under the nose, projected along head +Z (flat, never shaded)
      if (vRestN.z > 0.2 && p.z > 0.315) {
        vec2 q = p.xy - vec2(0.0, 0.46); float dm = abs(length(vec2(abs(q.x) - 0.011, q.y)) - 0.011);
        float mk = inside(dm - 0.0018) * step(q.y, -0.002) * step(abs(q.x), 0.022);
        col = mix(col, uInk, mk);
      }
      // eyes: each its own planar decal along its own axis (turns to camera on its side; no swap)
      for (int e = 0; e < 2; e++) {
        vec3 ax = uEyeAx[e], q = p - uEyeC[e];
        if (dot(vRestN, ax) > 0.05 && dot(q, ax) > -0.04) {
          vec3 T = uEyeT[e], B = cross(ax, T);
          vec2 u = vec2(dot(q, T), dot(q, B));
          float d = length(u / uEyeR) - 1.0;
          float eyeIn = inside(d);
          if (eyeIn > 0.0) {
            vec3 ec = uEyeCol;
            ec = mix(ec, uInk, inside(length((u - vec2(0.0, -0.002)) / (uEyeR * vec2(0.46, 0.78))) - 1.0));
            ec = mix(ec, vec3(1.0), inside(length(u - vec2(-0.36, 0.4) * uEyeR) - uEyeR.x * 0.3));
            ec = mix(ec, uInk, 1.0 - inside(d + 0.0045 / uEyeR.x));
            col = mix(col, ec, eyeIn);
          }
        }
      }
    }
    gl_FragColor = vec4(col * uLitMul * uZone, 1.0);
  }`;
const hullVert = /* glsl */`
  uniform vec2 uRes; uniform float uLinePx; uniform float uPartLine[4]; uniform float uPull; uniform float uPullMax;
  attribute float part; attribute float thick;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float sc = length(modelViewMatrix[0].xyz);
    mv.xyz += normalize(-mv.xyz) * min(max(thick - 0.03, 0.0) * uPull, part > 2.5 ? 0.008 : uPullMax) * sc;
    vec4 clip = projectionMatrix * mv;
    vec3 vn = normalize(normalMatrix * normal);
    vec2 sd = (projectionMatrix * vec4(vn, 0.0)).xy * uRes;
    float l = length(sd); sd = l > 1e-6 ? sd / l : vec2(0.0);
    float w = uLinePx * uPartLine[int(part + 0.5)];
    clip.xy += sd * (w * 2.0 / uRes) * clip.w;
    gl_Position = clip;
  }`;
const hullFrag = /* glsl */`uniform vec3 uInk; uniform float uFade; ${BAYER}
  void main() { if (uFade < 0.999 && bayer4(gl_FragCoord.xy) > uFade) discard; gl_FragColor = vec4(uInk, 1.0); }`;
export const blobMat = (alpha = 0.45) => new THREE.ShaderMaterial({
  uniforms: { uCol: { value: hexV('#6E6AA8') }, uAlpha: { value: alpha } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform vec3 uCol; uniform float uAlpha; varying vec2 vUv; void main(){ float r = length(vUv); float a = uAlpha * (1.0 - smoothstep(0.45, 1.0, r)); if (a < 0.003) discard; gl_FragColor = vec4(uCol, a); }',
  transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
});

/** Build the fox: returns {group, U (shared uniforms), update(camera)} */
const HEADC = [0, 0.535, 0.2], EYE0 = [new THREE.Vector3(-0.067, 0.535, 0.322), new THREE.Vector3(0.067, 0.535, 0.322)];
export function buildFox() {
  const U = {
    uKeyDir: { value: new THREE.Vector3(0, 1, 0) }, uLitMul: { value: new THREE.Vector3(1, 1, 1) }, uZone: { value: new THREE.Vector3(1, 1, 1) },
    uInk: { value: hexV('#33273B') }, uTerm: { value: 0.03 }, uFade: { value: 1 }, uMask: { value: 0 },
    uEyeC: { value: [new THREE.Vector3(), new THREE.Vector3()] },
    uEyeAx: { value: [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1)] }, uEyeT: { value: [new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, 0)] },
    uEyeCol: { value: hexV('#E3A23A') }, uEyeR: { value: new THREE.Vector2(0.029, 0.035) },
    uNose: { value: new THREE.Vector3(...NOSE) }, uTailTip: { value: new THREE.Vector3(...TAILTIP) },
    uRes: { value: new THREE.Vector2(1280, 720) }, uLinePx: { value: 1.5 }, uPartLine: { value: [1, 1, 1, 0.85] }, uPull: { value: 0.3 }, uPullMax: { value: 0.006 },
  };
  for (const n of names) { U['c_' + n] = { value: hexV(COAT[n]) }; U['s_' + n] = { value: authoredShade(COAT[n]) }; }
  const fill = new THREE.ShaderMaterial({ uniforms: U, vertexShader: fillVert, fragmentShader: fillFrag });
  const hull = new THREE.ShaderMaterial({ uniforms: U, vertexShader: hullVert, fragmentShader: hullFrag, side: THREE.BackSide });
  const group = new THREE.Group(); group.name = 'fox';
  for (const S of SHELLS) {
    const g = bakeShell(S);
    group.add(new THREE.Mesh(g, fill), new THREE.Mesh(g, hull));
  }
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.95), blobMat());
  blob.rotation.x = -Math.PI / 2; blob.position.set(0, 0.004, -0.02); group.add(blob);
  const tmp = new THREE.Vector3(), inv = new THREE.Matrix4();
  function update(cam, rtH) {
    group.updateMatrixWorld();
    inv.copy(group.matrixWorld).invert();
    // eyes: each axis turns toward the camera on its own side of the head (up to 70 deg), else stays +Z
    const cl = tmp.copy(cam.position).applyMatrix4(inv);
    [-1, 1].forEach((s, e) => {
      const c0 = EYE0[e], dx = cl.x - c0.x, dz = cl.z - c0.z;
      let a = Math.atan2(dx, dz); a = s * a > 0 ? s * Math.min(Math.abs(a) * 0.85, 1.22) : 0;
      U.uEyeAx.value[e].set(Math.sin(a), 0, Math.cos(a)); U.uEyeT.value[e].set(Math.cos(a), 0, -Math.sin(a));
      // the eye also slides round the skull a little toward that side, so its decal stays on a surface facing the axis
      const b = a * 0.5, rx = c0.x - HEADC[0], rz = c0.z - HEADC[2];
      U.uEyeC.value[e].set(HEADC[0] + rx * Math.cos(b) + rz * Math.sin(b), c0.y, HEADC[2] - rx * Math.sin(b) + rz * Math.cos(b));
    });
    // near the camera: dither (floor 30%), never hide
    const d = cam.position.distanceTo(tmp.set(0, 0.35, 0).applyMatrix4(group.matrixWorld));
    U.uFade.value = Math.max(0.3, Math.min(1, (d - 0.35) / 0.5));
    // small on screen (< 4% of height): 1 px line, no interior pull
    const hFrac = 0.77 / (2 * d * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)));
    U.uLinePx.value = hFrac < 0.04 ? 1 : 2.25 * rtH / 1080; U.uPull.value = hFrac < 0.04 ? 0 : 0.3;
    U.uRes.value.set(rtH * cam.aspect, rtH);
  }
  return { group, U, update };
}

// PROTOTYPE - NOT FOR PRODUCTION
// Environment shading: "paint what stays". Unlined, unlit-by-PBR materials that sample the
// kit-baked albedo and apply a soft 2-band sun ramp (E-1), a coloured (never grey) shade
// tint, a warm lane bounce on shaded walls, a soft PCF sun shadow and haze to the horizon.
// All maths is in display (sRGB) space, like the kit's multiply layers, and the shaders
// write sRGB directly (no colorspace chunk), so palette swatches arrive unshifted.
import * as THREE from 'three';
import { PHASES, rgb, sunDir } from './phases.js';

/** Uniforms shared by every environment material (one object, so a phase change is one write). */
export const U = {
  sunDir: { value: new THREE.Vector3(0, 1, 0) },
  keyColor: { value: new THREE.Vector3(1, 1, 1) },
  shadeMul: { value: new THREE.Vector3(0.7, 0.7, 0.8) },
  bounce: { value: new THREE.Vector3(0, 0, 0) },
  hazeColor: { value: new THREE.Vector3(1, 1, 1) },
  hazeNear: { value: 20 }, hazeFar: { value: 250 }, hazeMax: { value: 0.6 },
  shadowMap: { value: null }, shadowMatrix: { value: new THREE.Matrix4() }, shadowTexel: { value: 1 / 2048 }, shadowOn: { value: 1 },
  grainMap: { value: null },
  vertLift: { value: 0.4 },
  debugMode: { value: 0 },  // 0 lit, 1 shade mask (R = 1 - lit), 2 albedo (with the same haze)
  zenith: { value: new THREE.Vector3() }, horizon: { value: new THREE.Vector3() },
  sunGlow: { value: new THREE.Vector3() }, sunGlowK: { value: 0.5 },
  cloudLight: { value: new THREE.Vector3(1, 1, 1) }, cloudShade: { value: new THREE.Vector3(0.8, 0.85, 0.94) },
  backdropKey: { value: new THREE.Vector3(1, 1, 1) },
  time: { value: 0 },
};

export function applyPhase(name) {
  const p = PHASES[name];
  U.sunDir.value.copy(sunDir(p));
  U.keyColor.value.copy(rgb(p.key));
  const sh = rgb(p.shadowTint || p.shadow);
  U.shadeMul.value.set(1, 1, 1).lerp(sh, p.shadeK);
  U.bounce.value.copy(rgb(p.bounce)).multiplyScalar(p.bounceK);
  U.hazeColor.value.copy(rgb(p.haze)); U.hazeNear.value = p.hazeNear; U.hazeFar.value = p.hazeFar; U.hazeMax.value = p.hazeMax;
  U.zenith.value.copy(rgb(p.zenith)); U.horizon.value.copy(rgb(p.horizon));
  U.sunGlow.value.copy(rgb(p.sunGlow)); U.sunGlowK.value = p.sunGlowK;
  U.cloudLight.value.copy(rgb(p.cloudLight)); U.cloudShade.value.copy(rgb(p.cloudShade));
  U.backdropKey.value.copy(rgb(p.backdropKey)); U.vertLift.value = p.vertLift;
  return p;
}

const LIGHT_PARS = /* glsl */`
uniform vec3 sunDir, keyColor, shadeMul, bounce, hazeColor;
uniform float hazeNear, hazeFar, hazeMax, shadowTexel, shadowOn, debugMode, vertLift;
uniform sampler2D shadowMap, grainMap;
uniform mat4 shadowMatrix;
const vec2 PD[12] = vec2[12](vec2(-0.326,-0.406), vec2(-0.840,-0.074), vec2(-0.696,0.457), vec2(-0.203,0.621), vec2(0.962,-0.195), vec2(0.473,-0.480),
  vec2(0.519,0.767), vec2(0.185,-0.893), vec2(0.507,0.064), vec2(0.896,0.412), vec2(-0.322,-0.933), vec2(-0.792,-0.598));
float sunShadow(vec3 p, vec3 n, float soft) {
  if (shadowOn < 0.5) return 1.0;
  vec4 sc = shadowMatrix * vec4(p + n * 0.05, 1.0);
  vec3 c = sc.xyz / sc.w;
  if (c.x < 0.0 || c.x > 1.0 || c.y < 0.0 || c.y > 1.0 || c.z > 1.0) return 1.0;
  float s = 0.0;
  // rotate the disc per pixel so the wide kernel reads as a soft painted edge, not bands
  float a = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 6.2832;
  mat2 r = mat2(cos(a), sin(a), -sin(a), cos(a));
  for (int i = 0; i < 12; i++) {
    float d = texture2D(shadowMap, c.xy + r * PD[i] * shadowTexel * soft).r;
    s += step(c.z - 0.0015, d);
  }
  return s / 12.0;
}
float grainAt(vec3 p, vec3 n) {
  vec3 an = abs(n);
  vec2 g = an.y > 0.6 ? p.xz : (an.x > an.z ? p.zy : p.xy);
  return texture2D(grainMap, g * 0.31).g;
}
vec3 hazeIt(vec3 c, vec3 p) {
  float h = hazeMax * smoothstep(hazeNear, hazeFar, length(p - cameraPosition));
  return mix(c, hazeColor, h);
}
vec3 envShade(vec3 alb, vec3 n, vec3 p, float shadowSoft, float twoSided) {
  float ndl = dot(n, sunDir);
  if (twoSided > 0.5) ndl = abs(ndl) * 0.8 + 0.1;   // cloth: the sun glows through
  float ramp = smoothstep(-0.04, 0.16, ndl);          // E-1: soft terminator, ~12% of the ramp
  float lit = ramp * (ramp > 0.0 ? sunShadow(p, n, shadowSoft) : 1.0);
  float vert = 1.0 - abs(n.y);
  vec3 b = bounce * vert * (1.0 - smoothstep(0.0, 1.7, p.y));
  // the painter lifts shaded upright planes (sky fill), warmest at the foot (lane bounce)
  vec3 sm = mix(shadeMul, vec3(1.0), vertLift * vert * (0.55 + 0.45 * smoothstep(2.5, 0.0, p.y)));
  vec3 light = mix(sm + b, keyColor, lit);
  vec3 c = alb * light;
  if (debugMode > 1.5) return hazeIt(alb, p);
  if (debugMode > 0.5) return vec3(1.0 - lit, 0.0, 0.0);
  return hazeIt(c, p);
}
`;

const STD_VERT = /* glsl */`
varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying vec3 vC;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vUv = uv;
#ifdef USE_COLOR
  vC = color;
#else
  vC = vec3(1.0);
#endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const STD_FRAG = /* glsl */`
uniform sampler2D map; uniform float hasMap, alphaCut, grainK, premul, shadowSoft, twoSided; uniform vec3 tint;
varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying vec3 vC;
${LIGHT_PARS}
void main() {
  vec4 t = hasMap > 0.5 ? texture2D(map, vUv) : vec4(1.0);
  if (t.a < alphaCut) discard;
  if (premul > 0.5) t.rgb /= max(t.a, 0.001);
  vec3 n = normalize(vN);
  if (!gl_FrontFacing) n = -n;
  vec3 alb = t.rgb * tint * vC;
  alb *= mix(1.0, grainAt(vP, n) / 0.83, grainK);
  // world-scale paint variation: breaks the trim-sheet repeat over tens of metres (stains, sun-fade)
  float macro = texture2D(grainMap, vec2(vP.x + vP.z, vP.y * 2.0 + vP.z * 0.3) * 0.021).g * 0.6 + texture2D(grainMap, (vP.xz + vP.y) * 0.0071 + 0.31).g * 0.4;
  alb *= mix(vec3(1.0), vec3(macro / 0.83) * vec3(1.0, 0.985, 1.02), 0.35);
  gl_FragColor = vec4(envShade(alb, n, vP, shadowSoft, twoSided), 1.0);
}`;

/** Standard painted environment material. o: {map, tint, grain, alphaCut, side, vertexColors, shadowSoft} */
export function envMat(o = {}) {
  const m = new THREE.ShaderMaterial({
    uniforms: { ...U, map: { value: o.map || null }, hasMap: { value: o.map ? 1 : 0 }, tint: { value: rgb(o.tint || '#FFFFFF') },
      alphaCut: { value: o.alphaCut || 0 }, grainK: { value: o.grain == null ? (o.map ? 0.15 : 0.6) : o.grain },
      premul: { value: o.map && o.map.premultiplyAlpha ? 1 : 0 }, shadowSoft: { value: o.shadowSoft || 2.6 }, twoSided: { value: o.twoSided ? 1 : 0 } },
    vertexShader: STD_VERT, fragmentShader: STD_FRAG, side: o.side || THREE.FrontSide, vertexColors: !!o.vertexColors,
  });
  m.userData.alphaCut = o.alphaCut || 0;
  return m;
}

/* ---------------------------------------------------------------- billboard clumps */
const BB_VERT = /* glsl */`
attribute vec3 iPos; attribute vec4 iParam; attribute vec4 iClump;
uniform float cylindrical, cols, rows;
varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying float vBright; varying vec3 vCtr;
void main() {
  vec2 corner = position.xy;
  float c = cos(iParam.y), s = sin(iParam.y);
  vec2 off = vec2(c * corner.x - s * corner.y, s * corner.x + c * corner.y) * iParam.x;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  if (cylindrical > 0.5) { right = normalize(vec3(right.x, 0.0, right.z)); up = vec3(0.0, 1.0, 0.0); off.y += 0.5 * iParam.x; }
  vec3 wp = iPos + right * off.x + up * off.y;
  vP = wp;
  vec3 fwd = normalize(cross(up, right));
  // sphere-projected normal: the clump shades as one painted mass from any angle
  vN = (wp - iClump.xyz) / max(iClump.w, 0.01) + fwd * 0.35;
  vCtr = iClump.xyz;
  float cell = iParam.z;
  vec2 cuv = vec2(mod(cell, cols), rows - 1.0 - floor(cell / cols));
  vUv = (cuv + position.xy + 0.5) / vec2(cols, rows);
  vBright = iParam.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`;
const BB_FRAG = /* glsl */`
uniform sampler2D map; uniform float alphaCut, rampLo, rampHi, receive, keyK; uniform vec3 tint;
varying vec2 vUv; varying vec3 vN; varying vec3 vP; varying float vBright; varying vec3 vCtr;
${LIGHT_PARS}
void main() {
  vec4 t = texture2D(map, vUv);
  if (t.a < alphaCut) discard;
  vec3 alb = t.rgb / max(t.a, 0.001) * tint * vBright;
  vec3 n = normalize(vN);
  float ndl = dot(n, sunDir);
  float lit = smoothstep(rampLo, rampHi, ndl);
  if (receive > 0.5 && lit > 0.0) lit *= mix(1.0, sunShadow(vCtr + (vP - vCtr) * 0.6, sunDir, 3.5), 0.75);
  vec3 c = alb * mix(mix(shadeMul, vec3(1.0), 0.18), mix(vec3(1.0), keyColor, keyK) * 1.1, lit);
  if (debugMode > 1.5) c = alb; else if (debugMode > 0.5) c = vec3(1.0 - lit, 0.0, 0.0);
  gl_FragColor = vec4(hazeIt(c, vP), 1.0);
}`;
const BB_DEPTH_FRAG = /* glsl */`
uniform sampler2D map; uniform float alphaCut; varying vec2 vUv;
void main() { if (texture2D(map, vUv).a < alphaCut) discard; gl_FragColor = vec4(1.0); }`;

/**
 * Instanced camera-facing cards. items: [{pos:[x,y,z], size, rot, cell, bright, clump:[x,y,z,r]}].
 * Returns a Mesh with userData.depthMat for the shadow pass (cards face the sun camera there).
 */
export function billboards(items, map, o = {}) {
  const base = new THREE.PlaneGeometry(1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.index = base.index; g.attributes.position = base.attributes.position;
  const n = items.length, P = new Float32Array(n * 3), Q = new Float32Array(n * 4), K = new Float32Array(n * 4);
  items.forEach((it, i) => {
    P.set(it.pos, i * 3); Q.set([it.size, it.rot || 0, it.cell || 0, it.bright || 1], i * 4);
    K.set(it.clump || [it.pos[0], it.pos[1], it.pos[2], it.size], i * 4);
  });
  g.setAttribute('iPos', new THREE.InstancedBufferAttribute(P, 3));
  g.setAttribute('iParam', new THREE.InstancedBufferAttribute(Q, 4));
  g.setAttribute('iClump', new THREE.InstancedBufferAttribute(K, 4));
  g.instanceCount = n;
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);
  const common = { cylindrical: { value: o.cylindrical ? 1 : 0 }, cols: { value: o.cols || 4 }, rows: { value: o.rows || 2 }, map: { value: map }, alphaCut: { value: o.alphaCut || 0.5 } };
  const m = new THREE.ShaderMaterial({
    uniforms: { ...U, ...common, tint: { value: rgb(o.tint || '#FFFFFF') }, rampLo: { value: o.rampLo ?? -0.35 }, rampHi: { value: o.rampHi ?? 0.45 }, receive: { value: o.receive ? 1 : 0 }, keyK: { value: o.keyK ?? 1 } },
    vertexShader: BB_VERT, fragmentShader: BB_FRAG, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.frustumCulled = false;
  mesh.userData.depthMat = new THREE.ShaderMaterial({ uniforms: common, vertexShader: BB_VERT, fragmentShader: BB_DEPTH_FRAG, side: THREE.DoubleSide });
  mesh.userData.castShadow = o.castShadow !== false;
  return mesh;
}

/* ---------------------------------------------------------------- sky dome */
export function skyDome(brush) {
  const m = new THREE.ShaderMaterial({
    uniforms: { ...U, brush: { value: brush } },
    vertexShader: /* glsl */`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform vec3 zenith, horizon, sunDir, sunGlow; uniform float sunGlowK; uniform sampler2D brush; varying vec3 vD;
      void main(){
        vec3 d = normalize(vD);
        float e = asin(clamp(d.y, -1.0, 1.0)) * 57.2958;
        // the kit's sky gradient (top deep, 42% zenith, 80% mix, bottom horizon) laid over 0..22 degrees
        vec3 deep = mix(zenith, vec3(0.118, 0.373, 0.753), 0.18);
        vec3 mid = mix(zenith, horizon, 0.72);
        float t = clamp(e / 22.0, 0.0, 1.0);
        vec3 c = t < 0.2 ? mix(horizon, mid, t / 0.2) : (t < 0.58 ? mix(mid, zenith, (t - 0.2) / 0.38) : mix(zenith, deep, (t - 0.58) / 0.42));
        if (e < 0.0) c = horizon;
        float az = atan(d.x, -d.z);
        float b = texture2D(brush, vec2(az * 0.6, e / 40.0)).g;
        c *= mix(1.0, b / 0.9, 0.18);
        float g = max(dot(d, normalize(sunDir)), 0.0);
        c = mix(c, sunGlow, sunGlowK * (pow(g, 6.0) * 0.6 + pow(g, 40.0) * 0.4));
        gl_FragColor = vec4(c, 1.0);
      }`,
    side: THREE.BackSide, depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1000, 48, 24), m);
  mesh.renderOrder = -10; mesh.frustumCulled = false;
  return mesh;
}

/* ---------------------------------------------------------------- backdrop cards and rings */
const BACK_FRAG = /* glsl */`
uniform sampler2D map; uniform float haze, cloud, keyK; uniform vec3 horizon, backdropKey, cloudLight, cloudShade, hazeColor;
varying vec2 vUv; varying vec3 vP;
void main(){
  vec4 t = texture2D(map, vUv);
  if (t.a < 0.02) discard;
  vec3 c = t.rgb / max(t.a, 0.001);
  if (cloud > 0.5) {
    // remap the kit's day cloud (shade #C9D8F0 .. white) onto the phase's cloud tones
    float l = clamp((dot(c, vec3(0.3, 0.5, 0.2)) - 0.80) / 0.2, 0.0, 1.0);
    c = mix(cloudShade, cloudLight, l);
  } else {
    c *= mix(vec3(1.0), backdropKey, keyK);
  }
  c = mix(c, mix(hazeColor, horizon, 0.5), haze);
  gl_FragColor = vec4(c, t.a);
}`;
export function backdropMat(map, o = {}) {
  return new THREE.ShaderMaterial({
    uniforms: { ...U, map: { value: map }, haze: { value: o.haze || 0 }, cloud: { value: o.cloud ? 1 : 0 }, keyK: { value: o.keyK ?? 1 } },
    vertexShader: /* glsl */`varying vec2 vUv; varying vec3 vP; void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position,1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: BACK_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
}
/** Cylindrical ring strip: azimuth a0..a1 (deg; 0 = -Z, +90 = +X), heights y0..y1, radius r. v=1 at the top. */
export function ringGeometry(r, a0, a1, y0, y1, seg = 64) {
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const u = i / seg, a = THREE.MathUtils.degToRad(a0 + (a1 - a0) * u), x = Math.sin(a) * r, z = -Math.cos(a) * r;
    pos.push(x, y0, z, x, y1, z); uv.push(u, 0, u, 1);
    if (i < seg) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
}

/* ---------------------------------------------------------------- inked props (cel + hull line) */
// A Scent Post is interactive, so it is inked (L-1): flat two-tone cel lit by the character key,
// hard terminator, plus an Aubergine Ink inverted hull whose width is set in render-target pixels.
export const CEL = {
  keyDir: { value: new THREE.Vector3(0, 1, 0) }, celTint: { value: new THREE.Vector3(1, 1, 1) }, celShade: { value: new THREE.Vector3(0.85, 0.82, 0.92) },
  rtHeight: { value: 1080 }, rtWidth: { value: 1920 }, lineScale: { value: 1 }, fade: { value: 1 },
};
export function celMat() {
  return new THREE.ShaderMaterial({
    uniforms: { ...CEL, hazeColor: U.hazeColor, hazeNear: U.hazeNear, hazeFar: U.hazeFar, hazeMax: U.hazeMax, debugMode: U.debugMode },
    vertexColors: true,
    vertexShader: /* glsl */`attribute vec3 shadeCol; varying vec3 vC; varying vec3 vS; varying vec3 vN; varying vec3 vP;
      void main(){ vC = color; vS = shadeCol; vec4 wp = modelMatrix * vec4(position,1.0); vP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * wp; }`,
    fragmentShader: /* glsl */`uniform vec3 keyDir, celTint, hazeColor; uniform float hazeNear, hazeFar, hazeMax, debugMode, fade; varying vec3 vC; varying vec3 vS; varying vec3 vN; varying vec3 vP;
      float bayer4(vec2 p){ ivec2 i = ivec2(mod(p, 4.0)); int b[16] = int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(b[i.y * 4 + i.x]) + 0.5) / 16.0; }
      void main(){ if (fade < 0.999 && bayer4(gl_FragCoord.xy) > fade) discard; float l = step(0.12, dot(normalize(vN), keyDir)); vec3 c = mix(vS, vC, l) * celTint;
        if (debugMode > 1.5) c = vC; else if (debugMode > 0.5) c = vec3(0.0);
        c = mix(c, hazeColor, hazeMax * smoothstep(hazeNear, hazeFar, length(vP - cameraPosition)));
        gl_FragColor = vec4(c, 1.0); }`,
  });
}
export function hullMat(widthPx = 2.0) {
  return new THREE.ShaderMaterial({
    uniforms: { ...CEL, width: { value: widthPx } },
    vertexShader: /* glsl */`uniform float width, rtHeight, rtWidth, lineScale; attribute vec3 smoothN;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vec4 cp = projectionMatrix * viewMatrix * wp;
        vec3 nv = normalize(mat3(viewMatrix) * normalize(mat3(modelMatrix) * smoothN));
        vec2 res = vec2(rtWidth, rtHeight);
        vec2 dir = normalize(vec2(projectionMatrix[0][0] * nv.x, projectionMatrix[1][1] * nv.y) * res + 1e-6);
        // L-3: silhouette 2.0 px at 1080p, computed against the current render-target height
        float px = width * lineScale * (rtHeight / 1080.0);
        cp.xy += dir * px * 2.0 / res * cp.w;
        cp.z += 0.0004 * cp.w;
        gl_Position = cp;
      }`,
    fragmentShader: /* glsl */`uniform float fade; float bayer4(vec2 p){ ivec2 i = ivec2(mod(p, 4.0)); int b[16] = int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(b[i.y * 4 + i.x]) + 0.5) / 16.0; } void main(){ if (fade < 0.999 && bayer4(gl_FragCoord.xy) > fade) discard; gl_FragColor = vec4(0.2, 0.153, 0.231, 1.0); }`,
    side: THREE.BackSide,
  });
}

/* ---------------------------------------------------------------- sun shadow pass */
export class SunShadow {
  constructor(size = 2048, extent = 22) {
    this.rt = new THREE.WebGLRenderTarget(size, size, { depthBuffer: true });
    this.rt.depthTexture = new THREE.DepthTexture(size, size, THREE.UnsignedIntType);
    this.rt.depthTexture.minFilter = this.rt.depthTexture.magFilter = THREE.NearestFilter;
    this.cam = new THREE.OrthographicCamera(-extent, extent, extent, -extent, 1, 160);
    this.target = new THREE.Vector3(0, 0, -3);
    this.depthMat = new THREE.MeshBasicMaterial({ colorWrite: true, side: THREE.DoubleSide });
    this.cutMats = new Map();
    U.shadowMap.value = this.rt.depthTexture; U.shadowTexel.value = 1 / size;
    this.bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.calls = 0;
  }
  update(renderer, scenes, casters) {
    const d = U.sunDir.value;
    this.cam.position.copy(this.target).addScaledVector(d, 80); this.cam.up.set(0, 1, 0);
    if (Math.abs(d.y) > 0.99) this.cam.up.set(0, 0, 1);
    this.cam.lookAt(this.target); this.cam.updateMatrixWorld(); this.cam.updateProjectionMatrix();
    U.shadowMatrix.value.copy(this.bias).multiply(this.cam.projectionMatrix).multiply(this.cam.matrixWorldInverse);
    renderer.setRenderTarget(this.rt); renderer.clear();
    const ac = renderer.autoClear; renderer.autoClear = false; let calls = 0;
    for (const scene of scenes) {
      // swap in depth materials; hide non-casters
      const saved = [];
      scene.traverse((o) => { if (o.isMesh || o.isLine) saved.push([o, o.material, o.visible]); });
      for (const [o] of saved) {
        if (!casters.has(o)) { o.visible = false; continue; }
        if (o.userData.depthMat) o.material = o.userData.depthMat;
        else if (o.material.userData && o.material.userData.alphaCut) {
          const src = o.material; let m = this.cutMats.get(src);
          if (!m) { m = new THREE.MeshBasicMaterial({ map: src.uniforms.map.value, alphaTest: src.userData.alphaCut, side: THREE.DoubleSide }); this.cutMats.set(src, m); }
          o.material = m;
        } else o.material = this.depthMat;
      }
      const bg = scene.background; scene.background = null;
      renderer.render(scene, this.cam); calls += renderer.info.render.calls;
      scene.background = bg;
      for (const [o, m, v] of saved) { o.material = m; o.visible = v; }
    }
    renderer.autoClear = ac; renderer.setRenderTarget(null);
    this.calls = calls;
  }
}

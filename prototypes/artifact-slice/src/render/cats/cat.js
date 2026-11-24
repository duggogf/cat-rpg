// PROTOTYPE - NOT FOR PRODUCTION
// Inked-cel cats: baked SDF meshes (tools/bake-meshes.mjs) as ONE skinned mesh per cat drawn twice
// (cel fill + inverted-hull ink), a face decal atlas, whiskers, and a soft contact blob.
// Draw calls per cat: fill 1 + hull 1 + whiskers 1 + blob 1 = 4.
import * as THREE from 'three';
import { INK, resolveStyle } from './casts.js';
import { fillVert, fillFrag, hullVert, hullFrag, blobVert, blobFrag } from './shaders.js';
import { makeFaceTexture, makeEyesTexture, eyeHalf, faceRect, FACE_FRAMES } from './face.js';
import { createAnimator } from '../../anim/catAnim.js';

const parts = {};      // part name -> { json, attrs: {name: TypedArray}, index }
let manifest = null;   // assets/mesh/cats.json: cast / tough entry -> { parts, bones, meta }
const geoCache = {};   // entry name -> assembled BufferGeometry (shared by every cat of that entry)
const srgb = (c) => { const o = new THREE.Color(); (c.isColor ? c : new THREE.Color(c)).getRGB(o, THREE.SRGBColorSpace); return new THREE.Vector3(o.r, o.g, o.b); };
const hexV = (h) => { const c = new THREE.Color(); c.setStyle(h, THREE.SRGBColorSpace); return srgb(c); };
const KIND = { half: Uint16Array, snorm8: Int8Array, u8: Uint8Array, unorm8: Uint8Array, u16: Uint16Array };

/** Loads the manifest and every mesh part (the parts are shared, so this is all casts at once). */
export async function loadCatAssets(baseUrl = '') {
  if (!manifest) manifest = await (await fetch(`${baseUrl}mesh/cats.json`)).json();
  await Promise.all(Object.keys(manifest.parts).map(async (n) => {
    if (parts[n]) return;
    const json = await (await fetch(`${baseUrl}mesh/${manifest.parts[n].json}`)).json();
    // The Artifact host does not serve .bin files: the build packs the binary into the
    // JSON as base64 (`binB64`). Dev builds may still point at the .bin.
    const bin = json.binB64
      ? Uint8Array.from(atob(json.binB64), c => c.charCodeAt(0)).buffer
      : await (await fetch(`${baseUrl}mesh/${json.bin}`)).arrayBuffer();
    const A = json.attributes, attrs = {};
    for (const k in A) attrs[k] = new KIND[A[k].kind](bin, A[k].offset, A[k].count);
    parts[n] = { json, attrs };
  }));
  return true;
}

/** One geometry per cast entry: its parts concatenated (quantised attributes kept as they are). */
function entryGeometry(name) {
  if (geoCache[name]) return geoCache[name];
  const E = manifest.casts[name];
  const P = E.parts.map((n) => parts[n]);
  const cat = (k) => { const T = P[0].attrs[k].constructor, n = P.reduce((a, p) => a + p.attrs[k].length, 0), o = new T(n); let off = 0; for (const p of P) { o.set(p.attrs[k], off); off += p.attrs[k].length; } return o; };
  const g = new THREE.BufferGeometry();
  const half = (k, size) => g.setAttribute(k, new THREE.Float16BufferAttribute(cat(k), size));
  half('position', 3); half('aux', 3); half('thick', 1);
  g.setAttribute('normal', new THREE.BufferAttribute(cat('normal'), 3, true));
  g.setAttribute('snormal', new THREE.BufferAttribute(cat('snormal'), 3, true));
  g.setAttribute('skinIndex', new THREE.BufferAttribute(cat('skinIndex'), 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(cat('skinWeight'), 4, true));
  g.setAttribute('part', new THREE.BufferAttribute(cat('part'), 1));
  // index = [full triangles | LOD triangles] over the same vertices; each cat picks a range via its groups
  const nF = P.reduce((a, p) => a + p.attrs.index.length, 0), nL = P.reduce((a, p) => a + p.attrs.indexLod.length, 0);
  const idx = new Uint32Array(nF + nL);
  let o = 0, base = 0;
  for (const p of P) { for (let i = 0; i < p.attrs.index.length; i++) idx[o + i] = p.attrs.index[i] + base; o += p.attrs.index.length; base += p.json.vertexCount; }
  base = 0;
  for (const p of P) { for (let i = 0; i < p.attrs.indexLod.length; i++) idx[o + i] = p.attrs.indexLod[i] + base; o += p.attrs.indexLod.length; base += p.json.vertexCount; }
  g.setIndex(new THREE.BufferAttribute(base < 65536 ? Uint16Array.from(idx) : idx, 1));
  g.userData.ranges = { full: [0, nF], low: [nF, nL] };
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.25, 0), 0.6);
  return (geoCache[name] = g);
}

/** Day key from the art bible §4.4 (sun ≈ 65°). The environment builder passes its own per phase. */
export const DAY_LIGHT = {
  keyDir: new THREE.Vector3(-0.35, 0.906, 0.24).normalize(),
  keyColor: new THREE.Color('#FFFBEF'), shadeColor: new THREE.Color('#6E6AA8'), rimColor: new THREE.Color('#FFF6E3'),
};

/**
 * Full constructor (the contract's createCat wraps this).
 * Extra lab options: carry (tail-carriage override), silhouette (flat colour, for the strip test), seed.
 */
export function createCatInternal(opts = {}) {
  const { cast = 'mikan', scale = 1.25, carry, silhouette = false, silColor = '#000000', seed = 1 } = opts;
  if (!manifest) throw new Error('loadCatAssets() first');
  const style = resolveStyle(cast, opts);
  const entry = style.entry;
  if (!manifest.casts[entry]) throw new Error('unknown cat mesh entry ' + entry);
  const json = manifest.casts[entry], meta = json.meta, hs = meta.hs;

  // ---- skeleton
  const bones = {}, list = [];
  for (const b of json.bones) {
    const bone = new THREE.Bone(); bone.name = b.name;
    const p = b.parent ? json.bones.find((x) => x.name === b.parent).pos : [0, 0, 0];
    bone.position.set(b.pos[0] - p[0], b.pos[1] - p[1], b.pos[2] - p[2]);
    if (b.parent) bones[b.parent].add(bone);
    bones[b.name] = bone; list.push(bone);
  }

  // ---- materials
  const colorNames = Object.keys(style.colors);
  const fr = faceRect(hs);
  const faceTex = silhouette ? null : makeFaceTexture(style, hs);
  const eyesTex = silhouette ? null : makeEyesTexture(style, hs);
  const eyeC0 = (meta.eyes || [[-0.04, meta.headC[1], meta.headC[2] + 0.08], [0.04, meta.headC[1], meta.headC[2] + 0.08]]).map((e) => new THREE.Vector3(...e));
  const U = {
    uKeyDir: { value: DAY_LIGHT.keyDir.clone() }, uLitMul: { value: new THREE.Vector3(1, 1, 1) }, uShadeMul: { value: new THREE.Vector3(0.8, 0.8, 0.88) },
    uTerm: { value: -0.06 },
    uHeadC: { value: new THREE.Vector3(...meta.headC) }, uSpineY: { value: meta.spineY },
    uCollarC: { value: new THREE.Vector3(...(meta.collar ? meta.collar.c : [0, -9, 0])) }, uCollarAx: { value: new THREE.Vector3(...(meta.collar ? meta.collar.axis : [0, 1, 0])) },
    uEar: { value: new THREE.Vector3(meta.earDims.hw * hs, meta.earDims.h * hs, meta.earDims.tip * hs) },
    uHS: { value: hs }, uZF: { value: meta.zF }, uPattern: { value: style.pattern || 0 }, uSeed: { value: style.seed || 0 },
    uChin: { value: new THREE.Vector4(0, meta.headC[1] - 0.085 * hs, meta.headC[2] - 0.035 * hs, 0.07 * hs) },
    uFace: { value: faceTex }, uFaceRect: { value: new THREE.Vector4(meta.headC[0] + fr.x, meta.headC[1] + fr.y, fr.hw, fr.hh) },
    uFaceFrame: { value: 0 }, uFaceFrames: { value: FACE_FRAMES }, uFaceOn: { value: silhouette ? 0 : 1 },
    uEyes: { value: eyesTex }, uEyeHalf: { value: eyeHalf(hs) },
    uEyeC: { value: eyeC0.map((v) => v.clone()) }, uEyeAx: { value: [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1)] }, uEyeT: { value: [new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, 0)] },
    uSil: { value: silhouette ? 1 : 0 }, uSilCol: { value: hexV(silColor) }, uInkF: { value: hexV(INK) },
    uPaws: { value: meta.paws ? new THREE.Vector4(meta.paws.xF, meta.paws.xH, meta.paws.zF, meta.paws.zH) : new THREE.Vector4(9, 9, 0, 0) },
  };
  for (const n of colorNames) U['c_' + n] = { value: hexV(style.colors[n]) };
  const fill = new THREE.ShaderMaterial({ uniforms: U, vertexShader: fillVert, fragmentShader: fillFrag(style.glsl, colorNames) });
  const HU = {
    uRes: { value: new THREE.Vector2(1920, 1080) }, uLinePx: { value: 2 },
    uPartLine: { value: [1, 1, 1, 0.8, 0.7, 1, 0.7] }, uPull: { value: 0.6 }, uPullMax: { value: 0.016 }, uInk: { value: hexV(silhouette ? silColor : INK) },
  };
  const hull = new THREE.ShaderMaterial({ uniforms: HU, vertexShader: hullVert, fragmentShader: hullFrag, side: THREE.BackSide });

  // per-cat geometry: shares every attribute and the index (one GPU buffer each), so LOD is a per-cat
  // choice of index range. Extra hull shells built on this geometry (keyline, rim) follow it automatically.
  const shared = entryGeometry(entry), geo = new THREE.BufferGeometry();
  for (const k in shared.attributes) geo.setAttribute(k, shared.attributes[k]);
  geo.setIndex(shared.index); geo.boundingSphere = shared.boundingSphere;
  const ranges = shared.userData.ranges;
  geo.addGroup(ranges.full[0], ranges.full[1], 0); geo.addGroup(ranges.full[0], ranges.full[1], 1);
  let lodMode = opts.lod || 'auto', lodLevel = 0, share = 1; // 0 full, 1 low
  const setLevel = (l) => { if (l === lodLevel) return; lodLevel = l; const r = l ? ranges.low : ranges.full; for (const gr of geo.groups) { gr.start = r[0]; gr.count = r[1]; } };
  const mesh = new THREE.SkinnedMesh(geo, [fill, hull]);
  mesh.add(bones.root);
  mesh.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(list);
  mesh.bind(skeleton);
  mesh.frustumCulled = false;

  const group = new THREE.Group();
  group.name = 'cat:' + cast;
  group.add(mesh);
  group.scale.setScalar(scale * (style.rank || 1)); // rank scale multiplies on top of the 1.25 cat scale

  // ---- whiskers (1 px ink lines on the head bone; kit: 3 per side, past the cheeks)
  let whiskers = null;
  if (!silhouette) {
    const hp = new THREE.Vector3(); bones.head.updateMatrixWorld(true);
    const hb = json.bones.find((b) => b.name === 'head').pos, c = meta.headC;
    const v = [];
    for (const s of [1, -1]) for (const [dy, ey, dz] of [[-0.022, 0.0, 0.0], [-0.03, -0.012, -0.004], [-0.038, -0.03, -0.008]]) {
      const x0 = s * 0.07 * hs, y0 = c[1] + dy * hs - hb[1], z0 = c[2] + 0.045 * hs - hb[2];
      v.push(x0, y0, z0, x0 + s * 0.065 * hs, y0 + ey * hs + 0.006, z0 + dz - 0.012);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    whiskers = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: new THREE.Color().setStyle(INK, THREE.SRGBColorSpace), toneMapped: false }));
    bones.head.add(whiskers); void hp;
  }

  // ---- contact blob (feathered Shadow Wisteria at 45%)
  const blobMat = new THREE.ShaderMaterial({
    uniforms: { uCol: { value: silhouette ? hexV('#000000') : hexV('#6E6AA8') }, uAlpha: { value: silhouette ? 0 : 0.45 } },
    vertexShader: blobVert, fragmentShader: blobFrag, transparent: true, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), blobMat);
  blob.rotation.x = -Math.PI / 2; blob.position.set(0, 0.002, (meta.zF + meta.zH) / 2);
  blob.scale.set(0.24 * (meta.xH / 0.046) + 0.02, 0.4, 1);
  blob.renderOrder = -1;
  group.add(blob);

  // ---- outline width: L-3 as revised at M0 review: 2.5 px at 1080p OUTPUT. The hull is expanded in
  // render-target pixels, so it is scaled by rtHeight / outputHeight and gets a small top-up when the
  // render target is smaller than the output (the upscale filter eats part of the line; tuned to the M0 harness).
  // L-4: below 4% of screen height the line drops to 1 px and the face decals switch off.
  // One face decal at every angle (owner, M0 sign-off): the lifted muzzle mesh carries the profile.
  let outlineK = 1;
  const v2 = new THREE.Vector2(), p0 = new THREE.Vector3(), p1 = new THREE.Vector3();
  const camRest = new THREE.Vector3(), invHead = new THREE.Matrix4();
  const headRest = new THREE.Vector3(...json.bones.find((b) => b.name === 'head').pos);
  mesh.onBeforeRender = (renderer, scene, camera) => {
    const rt = renderer.getRenderTarget();
    if (rt) v2.set(rt.width, rt.height); else renderer.getDrawingBufferSize(v2);
    HU.uRes.value.copy(v2);
    const el = renderer.domElement;
    const outH = (el.clientHeight || el.height) * (globalThis.devicePixelRatio || 1);
    const k = Math.min(1, v2.y / outH);
    // screen-height share of the cat (feet to head top)
    group.getWorldPosition(p0); p1.copy(p0); p1.y += (meta.headC[1] + 0.08 * hs) * group.scale.y;
    p0.project(camera); p1.project(camera);
    share = Math.abs(p1.y - p0.y) * 0.5;
    const far = share < 0.04;
    const outPx = (far ? 1 : 2.5) * outlineK * outH / 1080 + (1 - k) * 1.0; // ≈ 2.3–2.4 px at 85% on the harness
    HU.uLinePx.value = outPx * k;
    U.uFaceOn.value = silhouette || far ? 0 : 1;
    // eyes: the camera's yaw around the head, in rest (bind) space. The eye on the camera's side turns
    // its projection axis toward the camera (up to 68°) and slides its anchor round the skull (up to
    // 45°: cheek and muzzle stay ahead of the eye in profile), continuously, so it reads as a round eye side-on; front-on both axes are +Z (the kit face).
    camRest.copy(camera.position); invHead.copy(bones.head.matrixWorld).invert(); camRest.applyMatrix4(invHead).add(headRest);
    const psi = Math.atan2(camRest.x - meta.headC[0], camRest.z - meta.headC[2]);
    for (let e = 0; e < 2; e++) {
      const sd = e === 0 ? -1 : 1;
      let gw = Math.min(1, Math.max(0, sd * psi / (Math.PI / 2))); gw = gw * gw * (3 - 2 * gw);
      const a = sd * gw * 68 * Math.PI / 180, ac = sd * gw * 40 * Math.PI / 180, grow = 1 + 0.12 * gw;
      U.uEyeAx.value[e].set(Math.sin(a), 0, Math.cos(a));
      U.uEyeT.value[e].set(Math.cos(a), 0, -Math.sin(a)).multiplyScalar(1 / grow); // |T| < 1: the eye grows a little side-on
      const c0 = eyeC0[e], dx = c0.x - meta.headC[0], dz = c0.z - meta.headC[2];
      U.uEyeC.value[e].set(meta.headC[0] + dx * Math.cos(ac) + dz * Math.sin(ac), c0.y, meta.headC[2] - dx * Math.sin(ac) + dz * Math.cos(ac));
    }
  };

  const lookWorld0 = null; let lookWorld = lookWorld0; const lookLocal = new THREE.Vector3();
  const anim = createAnimator(bones, { carry: carry || style.carry || 'flag', posture: carry || style.carry, legLen: meta.legTop * scale * (style.rank || 1), legRest: meta.legTop, seed });

  return {
    object3D: group,
    bones, mesh,
    update(dt) {
      // LOD (hysteresis): full above 18% of screen height, the low mesh below 15% (the whole 4.5–7.2 m combat
      // framing); 'full' / 'low' force it (use 'full' for the controlled cat).
      setLevel(lodMode === 'full' ? 0 : lodMode === 'low' ? 1 : (lodLevel ? (share > 0.18 ? 0 : 1) : (share < 0.15 ? 1 : 0)));
      // A cream rim shell added in this cat's subtree by the combat presentation (named 'keyline-rim') is
      // dropped below 5% of screen height, where it is under a pixel and only costs triangles.
      if (share < 0.05) for (const c of group.children) if (c.name === 'keyline-rim') c.visible = false;
      if (lookWorld) { group.updateWorldMatrix(true, false); lookLocal.copy(lookWorld); group.worldToLocal(lookLocal); anim.setLook(lookLocal); }
      anim.update(dt);
      U.uFaceFrame.value = anim.state.faceFrame;
    },
    setGait(name, speed = 0) { anim.setGait(name, speed); },
    setCarry(name) { anim.setCarry(name); },
    setLighting({ keyDir, keyColor, shadeColor, rimColor } = {}) {
      if (keyDir) U.uKeyDir.value.copy(keyDir).normalize();
      // lit tone: the phase cel tint (≈ half-way to the key colour; Day ≈ white). Shade: kit lavender multiply.
      if (keyColor) U.uLitMul.value.copy(new THREE.Vector3(1, 1, 1).lerp(srgb(keyColor), 0.5));
      if (shadeColor) {
        const s = new THREE.Vector3(1, 1, 1).lerp(srgb(shadeColor), 0.26).multiplyScalar(0.96);
        U.uShadeMul.value.copy(s.multiply(U.uLitMul.value));
      }
      void rimColor; // reserved: the reference has no rim light on cels
    },
    setOutlineScale(k) { outlineK = k; },
    /** ADDITION: 'auto' (default: by projected screen height) | 'full' (the controlled cat, close-ups) | 'low'. */
    setLod(mode) { lodMode = mode; },
    /** ADDITION: current level, 0 = full, 1 = low; and triangles per pass at that level. */
    get lod() { return lodLevel; },
    get triangles() { return (lodLevel ? ranges.low[1] : ranges.full[1]) / 3; },
    /** ADDITION to the contract: turn the head (and neck) toward a world point; null releases to idle glances. */
    lookAt(worldPos) { lookWorld = worldPos ? worldPos.clone() : null; if (!lookWorld) anim.setLook(null); },
    dispose() {
      fill.dispose(); hull.dispose(); blobMat.dispose(); blob.geometry.dispose();
      if (faceTex) faceTex.dispose();
      if (eyesTex) eyesTex.dispose();
      if (whiskers) { whiskers.geometry.dispose(); whiskers.material.dispose(); }
      geo.dispose(); skeleton.dispose(); group.clear();
    },
  };
}

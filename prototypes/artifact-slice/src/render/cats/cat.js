// PROTOTYPE - NOT FOR PRODUCTION
// Inked-cel cats: baked SDF meshes (tools/bake-meshes.mjs) as ONE skinned mesh per cat drawn twice
// (cel fill + inverted-hull ink), a face decal atlas, whiskers, and a soft contact blob.
// Draw calls per cat: fill 1 + hull 1 + whiskers 1 + blob 1 = 4.
import * as THREE from 'three';
import { CASTS, INK } from './casts.js';
import { fillVert, fillFrag, hullVert, hullFrag, blobVert, blobFrag } from './shaders.js';
import { makeFaceTexture, faceRect, FACE_FRAMES } from './face.js';
import { createAnimator } from '../../anim/catAnim.js';

const assets = {}; // mesh name -> { json, geometry }
const srgb = (c) => { const o = new THREE.Color(); (c.isColor ? c : new THREE.Color(c)).getRGB(o, THREE.SRGBColorSpace); return new THREE.Vector3(o.r, o.g, o.b); };
const hexV = (h) => { const c = new THREE.Color(); c.setStyle(h, THREE.SRGBColorSpace); return srgb(c); };

export async function loadCatAssets(baseUrl = '') {
  const names = [...new Set(Object.values(CASTS).map((c) => c.mesh))];
  await Promise.all(names.map(async (n) => {
    if (assets[n]) return;
    const json = await (await fetch(`${baseUrl}mesh/${n}.json`)).json();
    const bin = await (await fetch(`${baseUrl}mesh/${json.bin}`)).arrayBuffer();
    const g = new THREE.BufferGeometry();
    const A = json.attributes, T = { Float32Array, Uint16Array, Uint32Array };
    const arr = (k) => new T[A[k].type](bin, A[k].offset, A[k].count);
    g.setAttribute('position', new THREE.BufferAttribute(arr('position'), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(arr('normal'), 3));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(arr('skinIndex'), 4));
    g.setAttribute('skinWeight', new THREE.BufferAttribute(arr('skinWeight'), 4));
    g.setAttribute('part', new THREE.BufferAttribute(arr('part'), 1));
    g.setAttribute('aux', new THREE.BufferAttribute(arr('aux'), 3));
    g.setIndex(new THREE.BufferAttribute(arr('index'), 1));
    const n3 = A.index.count;
    g.addGroup(0, n3, 0); g.addGroup(0, n3, 1);
    g.computeBoundingSphere();
    assets[n] = { json, geometry: g };
  }));
  return true;
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
export function createCatInternal({ cast = 'mikan', scale = 1.25, carry, silhouette = false, silColor = '#000000', seed = 1 } = {}) {
  const style = CASTS[cast] || CASTS.mikan;
  const A = assets[style.mesh];
  if (!A) throw new Error('loadCatAssets() first');
  const { json } = A, meta = json.meta, hs = meta.hs;

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
  const U = {
    uKeyDir: { value: DAY_LIGHT.keyDir.clone() }, uLitMul: { value: new THREE.Vector3(1, 1, 1) }, uShadeMul: { value: new THREE.Vector3(0.8, 0.8, 0.88) },
    uTerm: { value: -0.06 },
    uHeadC: { value: new THREE.Vector3(...meta.headC) }, uSpineY: { value: meta.spineY },
    uEar: { value: new THREE.Vector3(style.ear.hw * hs, style.ear.h * hs, style.ear.tip * hs) },
    uChin: { value: new THREE.Vector4(0, meta.headC[1] - 0.085 * hs, meta.headC[2] - 0.035 * hs, 0.07 * hs) },
    uFace: { value: faceTex }, uFaceRect: { value: new THREE.Vector4(meta.headC[0] + fr.x, meta.headC[1] + fr.y, fr.hw, fr.hh) },
    uFaceFrame: { value: 0 }, uFaceFrames: { value: FACE_FRAMES }, uFaceOn: { value: silhouette ? 0 : 1 },
    uSil: { value: silhouette ? 1 : 0 }, uSilCol: { value: hexV(silColor) },
  };
  for (const n of colorNames) U['c_' + n] = { value: hexV(style.colors[n]) };
  const fill = new THREE.ShaderMaterial({ uniforms: U, vertexShader: fillVert, fragmentShader: fillFrag(style.glsl, colorNames) });
  const HU = {
    uRes: { value: new THREE.Vector2(1920, 1080) }, uLinePx: { value: 2 },
    uPartLine: { value: [1, 1, 1, 0.8, 0.7] }, uInk: { value: hexV(silhouette ? silColor : INK) },
  };
  const hull = new THREE.ShaderMaterial({ uniforms: HU, vertexShader: hullVert, fragmentShader: hullFrag, side: THREE.BackSide });

  const mesh = new THREE.SkinnedMesh(A.geometry, [fill, hull]);
  mesh.add(bones.root);
  mesh.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(list);
  mesh.bind(skeleton);
  mesh.frustumCulled = false;

  const group = new THREE.Group();
  group.name = 'cat:' + cast;
  group.add(mesh);
  group.scale.setScalar(scale);

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

  // ---- outline width: L-3 (2.0 px at 1080p, against the CURRENT render-target height), L-4 clamp
  let outlineK = 1;
  const v2 = new THREE.Vector2(), p0 = new THREE.Vector3(), p1 = new THREE.Vector3();
  mesh.onBeforeRender = (renderer, scene, camera) => {
    const rt = renderer.getRenderTarget();
    if (rt) v2.set(rt.width, rt.height); else renderer.getDrawingBufferSize(v2);
    HU.uRes.value.copy(v2);
    // screen-height share of the cat (feet to head top)
    group.getWorldPosition(p0); p1.copy(p0); p1.y += (meta.headC[1] + 0.08 * hs) * group.scale.y;
    p0.project(camera); p1.project(camera);
    const share = Math.abs(p1.y - p0.y) * 0.5;
    const far = share < 0.04;
    HU.uLinePx.value = (far ? 1 : 2) * outlineK * v2.y / 1080;
    U.uFaceOn.value = silhouette || far ? 0 : 1;
  };

  const anim = createAnimator(bones, { carry: carry || (cast === 'mikan' ? 'pom' : 'flag'), legLen: meta.legTop * scale, seed });

  return {
    object3D: group,
    bones, mesh,
    update(dt) {
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
    dispose() {
      fill.dispose(); hull.dispose(); blobMat.dispose(); blob.geometry.dispose();
      if (faceTex) faceTex.dispose();
      if (whiskers) { whiskers.geometry.dispose(); whiskers.material.dispose(); }
      skeleton.dispose(); group.clear();
    },
  };
}

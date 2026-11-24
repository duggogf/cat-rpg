// PROTOTYPE - NOT FOR PRODUCTION
// M0 look-dev scene: one Hidamari Lane corner, Day and Dusk, free orbit camera.
// Query params (each sets window.__ready once the frame is drawn):
//   ?phase=day|dusk  ?view=01 (the 01-exploration framing)  ?orbit=0..7 (45° steps around Mikan)
//   ?test=1 (deterministic: fixed sim time, no real-time pacing)  ?post=0 (paint post off)
//   ?res=0.85 (render scale)  ?mask=cats|shade|albedo (pixel-check passes)  ?card=1 (force desktop card)
import * as THREE from 'three';
import L from '../world/lane.json';
import { buildWorld } from '../world/builder.js';
import { U, CEL, applyPhase, SunShadow } from '../render/env.js';
import { PHASES, sunDir } from '../render/phases.js';
import { PaintPost } from '../render/post.js';
import { OrbitRig, collideCircle, EXPLORE } from '../camera/rig.js';
import { loadCatAssets, createCat } from '../render/cats/index.js';
import { desktopCard, isSmallOrTouch } from '../ui/desktopcard.js';

const Q = new URLSearchParams(location.search);
const opt = {
  phase: PHASES[Q.get('phase')] ? Q.get('phase') : 'day', view: Q.get('view'), orbit: Q.has('orbit') ? (+Q.get('orbit') | 0) % 8 : null,
  test: Q.get('test') === '1', mask: Q.get('mask'), post: Q.get('post') !== '0' && !Q.get('mask'), res: +(Q.get('res') || 1),
};
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: opt.test, powerPreference: 'high-performance' });
const dpr = opt.test ? 1 : Math.min(devicePixelRatio, 1.5);
renderer.setPixelRatio(dpr * opt.res);
renderer.setSize(app.clientWidth, app.clientHeight);
renderer.info.autoReset = false;
app.appendChild(renderer.domElement);

/* ---------------------------------------------------------------- textures */
const TEX = {
  wall: { wrap: 'mirror' }, fence: { wrap: 'mirror', alpha: true }, ground: { wrap: 'mirror' }, garden: { wrap: 'mirror' }, grain: { wrap: 'repeat' },
  skybrush: { wrap: 'repeat' }, foliage: { alpha: true }, flowers: { alpha: true }, grass: { alpha: true }, clouds: { alpha: true },
  hillsNear: { alpha: true, wrapS: 'repeat' }, hillsFar: { alpha: true, wrapS: 'repeat' }, town: { alpha: true }, sea: { wrapS: 'repeat' },
  roof: { wrap: 'mirror' }, house: { wrap: 'mirror' }, window: {}, notice: { alpha: true },
};
const W = { mirror: THREE.MirroredRepeatWrapping, repeat: THREE.RepeatWrapping };
async function loadTextures() {
  const loader = new THREE.TextureLoader(), out = {}, aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  await Promise.all(Object.entries(TEX).map(([k, o]) => loader.loadAsync(`tex/${k}.webp`).then((t) => {
    if (o.wrap) t.wrapS = t.wrapT = W[o.wrap];
    if (o.wrapS) t.wrapS = W[o.wrapS];
    t.premultiplyAlpha = !!o.alpha; t.anisotropy = aniso; t.colorSpace = THREE.NoColorSpace;
    out[k] = t;
  })));
  return out;
}

/* ---------------------------------------------------------------- scene */
const envScene = new THREE.Scene(), lateScene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(EXPLORE.fov, 1, 0.1, 1500);
let world, shadow, post, rig, mikan, sitter, keyLight, fillLight, phaseName, shadowDirty = true;
const mikanPos = new THREE.Vector3(), move = { f: 0, r: 0, run: false };
let simTime = 0, lastStats = {};

function setPhase(name) {
  phaseName = name; const p = applyPhase(name);
  const sd = sunDir(p);
  CEL.keyDir.value.copy(sd).normalize();
  const tint = new THREE.Color(p.cel); CEL.celTint.value.set(...hexRGB(p.cel));
  const light = { keyDir: new THREE.Vector3(...p.catDir).normalize(), keyColor: new THREE.Color(p.catKey), shadeColor: new THREE.Color(p.catShade), rimColor: new THREE.Color(p.catRim) };
  for (const c of [mikan, sitter]) if (c) c.setLighting(light);
  if (keyLight) { keyLight.position.copy(sd).multiplyScalar(10); keyLight.color.set(p.catKey); fillLight.color.set(p.shadow); }
  shadowDirty = true; void tint;
}
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }

function layoutCamera() {
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h);
  const bw = renderer.domElement.width, bh = renderer.domElement.height;
  CEL.rtWidth.value = bw; CEL.rtHeight.value = bh;
  if (post) post.setSize(bw, bh);
  cam.aspect = w / h;
  if (opt.view === '01') {
    // 01-exploration.html: camera 1 m up, level (verticals stay vertical), focal 1304 px at 1080,
    // principal point (horizon / lane vanishing point) at (900, 330) of 1920 x 1080: a lens shift.
    const s = h / 1080, F = 1304 * s, ppx = (900 / 1920) * w, ppy = 330 * s;
    const fullW = 2 * Math.max(ppx, w - ppx), fullH = 2 * Math.max(ppy, h - ppy);
    cam.fov = 2 * Math.atan(fullH / 2 / F) * 180 / Math.PI; cam.aspect = fullW / fullH;
    cam.setViewOffset(fullW, fullH, fullW / 2 - ppx, fullH / 2 - ppy, w, h);
  } else { cam.fov = EXPLORE.fov; cam.clearViewOffset(); }
  cam.updateProjectionMatrix();
}

/* ---------------------------------------------------------------- input */
const keys = new Set(); let dragging = false, lastInput = -1e9;
function bindInput() {
  const el = renderer.domElement;
  el.addEventListener('mousedown', (e) => { dragging = true; e.preventDefault(); });
  addEventListener('mouseup', () => { dragging = false; });
  addEventListener('mousemove', (e) => {
    if (!(dragging || document.pointerLockElement === el)) return;
    rig.yaw -= e.movementX * 0.25; rig.pitch += e.movementY * 0.18; lastInput = simTime;
  });
  el.addEventListener('dblclick', () => { if (document.pointerLockElement === el) document.exitPointerLock(); else el.requestPointerLock && el.requestPointerLock(); });
  el.addEventListener('wheel', (e) => { rig.want *= 1 + Math.sign(e.deltaY) * 0.1; e.preventDefault(); }, { passive: false });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
  addEventListener('keydown', (e) => {
    keys.add(e.code);
    if (e.code === 'Digit1') setPhase('day'); if (e.code === 'Digit2') setPhase('dusk');
    if (e.code === 'KeyP') setPhase(phaseName === 'day' ? 'dusk' : 'day');
    if (e.code === 'KeyO') { opt.post = !opt.post; }
    if (e.code === 'KeyR') { rig.yaw = (mikan.object3D.rotation.y * 180 / Math.PI) + 180; }
  });
  addEventListener('keyup', (e) => keys.delete(e.code));
  addEventListener('blur', () => keys.clear());
  addEventListener('resize', layoutCamera);
}

/* ---------------------------------------------------------------- frame */
function step(dt) {
  simTime += dt; U.time.value = simTime;
  // walk Mikan relative to the camera yaw
  const f = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
  const r = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
  if (f || r) {
    const y = rig.yaw * Math.PI / 180, fw = new THREE.Vector3(-Math.sin(y), 0, -Math.cos(y)), rt = new THREE.Vector3(Math.cos(y), 0, -Math.sin(y));
    const d = fw.multiplyScalar(f).add(rt.multiplyScalar(r)).normalize(), speed = keys.has('ShiftLeft') ? 1.6 : 0.9;
    mikanPos.addScaledVector(d, speed * dt); collideCircle(mikanPos, 0.2, world.colliders);
    const want = Math.atan2(d.x, d.z), o = mikan.object3D; let dy = want - o.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    o.rotation.y += dy * Math.min(1, dt * 10);
    mikan.setGait('walk', speed);
  } else mikan.setGait('idle', 0);
  mikan.object3D.position.copy(mikanPos);
  mikan.update(dt); sitter.update(dt);
  if (opt.view !== '01') rig.update(dt, mikanPos);
  // camera-soft (camera-system.md §3.4): the Scent Post dithers to 30% when it crowds the lens or hides Mikan
  { const lp = new THREE.Vector3(L.lantern.at[0], 0.6, L.lantern.at[1]), c = cam.position, pv = rig.pivot;
    const near = Math.hypot(c.x - lp.x, c.z - lp.z) < 1.1;
    const seg = new THREE.Line3(c.clone(), pv.clone()), cp = new THREE.Vector3(); seg.closestPointToPoint(lp, true, cp);
    const blocks = Math.hypot(cp.x - lp.x, cp.z - lp.z) < 0.3 && cp.y < 1.2 && cp.distanceTo(pv) > 0.3;
    const inside = Math.hypot(c.x - lp.x, c.z - lp.z) < 0.55; const want = inside ? 0 : near || blocks ? 0.3 : 1, k = want < CEL.fade.value ? 0.1 : 0.3;
    CEL.fade.value = dt <= 0 ? want : CEL.fade.value + (want - CEL.fade.value) * (1 - Math.pow(2, -dt / k)); }
  // painted backdrops sit at "infinity": they follow the camera (the near hill ring with a little parallax)
  const R = world.rings;
  R.sky.position.copy(cam.position); R.ringFar.position.copy(cam.position); R.sea.position.copy(cam.position); R.clouds.position.copy(cam.position);
  R.ringNear.position.set(cam.position.x * 0.85, cam.position.y, cam.position.z * 0.85);
  if (!opt.test) R.clouds.rotation.y = -simTime * 0.0015;
}

function render() {
  renderer.info.reset();
  if (shadowDirty) { shadow.update(renderer, [envScene, lateScene], world.casters); shadowDirty = false; lastStats.shadowCalls = shadow.calls; renderer.info.reset(); }
  cam.updateMatrixWorld();
  if (opt.mask === 'cats') {
    const black = new THREE.MeshBasicMaterial({ color: 0x000000 }); envScene.overrideMaterial = black;
    renderer.setClearColor(0x000000, 1); renderer.setRenderTarget(null); renderer.clear(); renderer.render(envScene, cam); envScene.overrideMaterial = null;
    const hidden = []; lateScene.traverse((o) => { if (o.isMesh && (o.material.transparent || !isCat(o))) { hidden.push(o); o.visible = false; } });
    lateScene.overrideMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); renderer.autoClear = false; renderer.render(lateScene, cam); renderer.autoClear = true;
    lateScene.overrideMaterial = null; hidden.forEach((o) => { o.visible = true; });
    return;
  }
  U.debugMode.value = opt.mask === 'shade' ? 1 : opt.mask === 'albedo' ? 2 : 0;
  if (opt.post) { renderer.setRenderTarget(post.rt); renderer.clear(); renderer.render(envScene, cam); post.render(renderer); }
  else { renderer.setRenderTarget(null); renderer.clear(); renderer.render(envScene, cam); }
  if (!opt.mask) { renderer.autoClear = false; renderer.render(lateScene, cam); renderer.autoClear = true; }
  lastStats.calls = renderer.info.render.calls; lastStats.triangles = renderer.info.render.triangles;
}
const catRoots = new Set();
function isCat(o) { for (let p = o; p; p = p.parent) if (catRoots.has(p)) return true; return false; }

function texMB() {
  let b = 0; for (const t of Object.values(world.tex)) { const i = t.image; b += i.width * i.height * 4 * 1.333; }
  const bw = renderer.domElement.width, bh = renderer.domElement.height;
  b += 2048 * 2048 * 4 + (opt.post ? bw * bh * 8 : 0);
  return +(b / 1048576).toFixed(1);
}

/* ---------------------------------------------------------------- boot */
async function boot() {
  if (Q.get('card') === '1' || !opt.test) desktopCard(Q.get('card') === '1');
  const tex = await loadTextures();
  world = buildWorld(L, tex); world.tex = tex;
  envScene.add(world.env, world.backdrop); lateScene.add(world.late);
  shadow = new SunShadow(2048, 21);
  post = new PaintPost(tex.grain);
  U.grainMap.value = tex.grain;
  await loadCatAssets('');
  mikan = createCat({ cast: 'mikan', scale: 1.25 }); sitter = createCat({ cast: 'wallSitter', scale: 1.25 });
  catRoots.add(mikan.object3D); catRoots.add(sitter.object3D);
  const [mx, my, mz, mr] = L.spawn.mikan; mikanPos.set(mx, my, mz); mikan.object3D.rotation.y = mr;
  const [sx, sy, sz, sr] = L.spawn.wallSitter; sitter.object3D.position.set(sx, sy, sz); sitter.object3D.rotation.y = sr;
  lateScene.add(mikan.object3D, sitter.object3D);
  keyLight = new THREE.DirectionalLight('#ffffff', 2.5); fillLight = new THREE.AmbientLight('#6E6AA8', 0.8); lateScene.add(keyLight, fillLight);
  rig = new OrbitRig(cam, world.colliders);
  if (opt.orbit != null) rig.yaw = opt.orbit * 45;
  layoutCamera();
  setPhase(opt.phase);
  if (opt.view === '01') { cam.position.set(0, 1.0, 2.15); cam.lookAt(0, 1.0, -10); }
  else rig.update(0, mikanPos.clone(), true);
  step(0); if (opt.view !== '01') rig.update(0, mikanPos, true);
  window.__cat = {
    state: () => ({ phase: phaseName, camera: cam.position.toArray().map((v) => +v.toFixed(3)), yaw: rig.yaw, pitch: rig.pitch, dist: +rig.dist.toFixed(3), mikan: mikanPos.toArray(), stats: { ...lastStats, texMB: texMB() } }),
    step: (n = 1) => { for (let i = 0; i < n; i++) step(1 / 60); render(); },
    setPhase: (p) => { setPhase(p); render(); },
  };
  if (opt.test) {
    for (let i = 0; i < 6; i++) step(1 / 60); // settle cat idle deterministically
    render(); render();
    window.__ready = true;
    return;
  }
  bindInput();
  if (!isSmallOrTouch()) hint();
  let last = performance.now(), first = true;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    step(dt); render();
    if (first) { first = false; window.__ready = true; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
function hint() {
  const d = document.createElement('div');
  d.textContent = 'Drag to orbit · wheel zoom · WASD walk (Shift faster) · double-click locks the pointer · 1 Day / 2 Dusk · O paint post';
  d.style.cssText = 'position:fixed;left:16px;bottom:14px;max-width:calc(100% - 32px);padding:8px 14px;border-radius:999px;background:rgba(255,246,227,.88);color:#33273B;font:600 13px/1.3 ui-rounded,system-ui,sans-serif;pointer-events:none';
  document.body.appendChild(d);
}
boot().catch((e) => { console.error(e); });

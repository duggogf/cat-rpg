// PROTOTYPE - NOT FOR PRODUCTION
// M2: Hidamari Lane (≈ 120 m) on the approved M0 look: two live Patches (Low Wall Corner, Laundry Pole Yard),
// the yard stop and the Den sniff perch, High Road ribbons, Whisker Sense (wisps, trails, compass, the 1 s sniff),
// Rub / Over-mark, Counter-Spray, Claim and Rescue Spray with feedback, the Explore camera with collision,
// Day -> Dusk with the lamp wave, the Head Home thread, the street HUD and the garden-wall blend.
// Query params (each sets window.__ready once the frame is drawn):
//   ?phase=day|dusk  ?view=01 (the 01-exploration framing)  ?orbit=0..7 (45° steps around Mikan)  ?vantage=0..5 (M2 shots)
//   ?test=1 (deterministic: fixed sim time, no real-time pacing)  ?post=0  ?res=0.85  ?hud=0|1  ?sense=1 (Whisker Sense held)
//   ?mask=cats|catsTop|blobs|shade|albedo (pixel-check passes)  ?card=1 (force desktop card)  ?fps=1 (frame-time overlay + log)
//   ?chapter=combat (hands the page to combat.js)
import * as THREE from 'three';
import L from '../world/lane.json';
import { extendLayout, highRoad, groundY } from '../world/lane-m2.js';
import { buildWorld } from '../world/builder.js';
import { createTerritory } from '../world/territory.js';
import { U, CEL, applyPhase, SunShadow } from '../render/env.js';
import { PHASES, sunDir, mixPhase } from '../render/phases.js';
import { PaintPost } from '../render/post.js';
import { ScentLayer, bakeScent } from '../render/scent.js';
import { OrbitRig, ExploreRig, collideCircle, EXPLORE } from '../camera/rig.js';
import { loadCatAssets, createCat } from '../render/cats/index.js';
import { desktopCard, isSmallOrTouch } from '../ui/desktopcard.js';
import { StreetHUD } from '../ui/street-hud.js';
import { chapterPill } from '../ui/combat/chapters.js';
import { M3 } from '../ui/m3.js';

const Q = new URLSearchParams(location.search);
const opt = {
  phase: PHASES[Q.get('phase')] ? Q.get('phase') : 'day', view: Q.get('view'), orbit: Q.has('orbit') ? (+Q.get('orbit') | 0) % 8 : null,
  vantage: Q.has('vantage') ? (+Q.get('vantage') | 0) : null,
  test: Q.get('test') === '1', mask: Q.get('mask'), post: Q.get('post') !== '0' && !['shade', 'albedo'].includes(Q.get('mask')), res: +(Q.get('res') || 1),
  board: Q.get('board'), focus: Q.get('focus'), branch: Q.get('branch'), m3: Q.get('m3'), day: Q.get('day'),
  sense: Q.get('sense') === '1', fps: Q.get('fps') === '1', start: Q.get('start') === 'l1d1' ? 'l1d1' : 'showcase_l2d2', seed: +(Q.get('seed') || 42),
};
opt.m0 = opt.view === '01' || opt.orbit != null;            // the approved M0 evidence framings
opt.hud = Q.has('hud') ? Q.get('hud') === '1' : !(opt.test && (opt.m0 || opt.mask));
extendLayout(L);
if (!opt.m0) delete L.passerBy;   // the 01 frame's passer-by is a one-sided M0 stand-in card; the M4 leg rig replaces it in play
const HR = highRoad(L);
const gAt = (x, z) => groundY(L, z);
const app = document.getElementById('app');
let renderer = null, startError = null;
const dpr = opt.test ? 1 : Math.min(devicePixelRatio, 1.5);
try { // no WebGL (or a lost context) must surface as the error card, not a blank page
  if (typeof THREE.WebGLRenderer !== 'function') throw new Error('three.js did not load');
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: opt.test, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr * opt.res);
  renderer.setSize(app.clientWidth, app.clientHeight);
  renderer.info.autoReset = false;
  app.appendChild(renderer.domElement);
} catch (e) { startError = new Error('WebGL is not available (' + ((e && e.message) || e) + ')'); }

/* ---------------------------------------------------------------- textures */
const TEX = {
  wall: { wrap: 'mirror' }, fence: { wrap: 'mirror', alpha: true }, ground: { wrap: 'mirror' }, garden: { wrap: 'mirror' }, grain: { wrap: 'repeat' },
  skybrush: { wrap: 'repeat' }, foliage: { alpha: true }, flowers: { alpha: true }, grass: { alpha: true }, clouds: { alpha: true },
  hillsNear: { alpha: true, wrapS: 'repeat' }, hillsFar: { alpha: true, wrapS: 'repeat' }, town: { alpha: true }, sea: { wrapS: 'repeat' },
  roof: { wrap: 'mirror' }, house: { wrap: 'mirror' }, window: {}, notice: { alpha: true },
  stains: { alpha: true }, groundbits: { alpha: true }, stonewall: { wrap: 'mirror' }, poster: { alpha: true }, manhole: { alpha: true }, vending: {}, aircon: {}, legs: { alpha: true }, townFar: { alpha: true },
};
const W = { mirror: THREE.MirroredRepeatWrapping, repeat: THREE.RepeatWrapping };
const missing = [];
async function loadTextures() {
  const loader = new THREE.TextureLoader(), out = {}, aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  // one missing or broken file must never stop the scene: warn and stand in a neutral 1x1 texture
  await Promise.all(Object.entries(TEX).map(([k, o]) => loader.loadAsync(`tex/${k}.webp`).then((t) => {
    if (o.wrap) t.wrapS = t.wrapT = W[o.wrap];
    if (o.wrapS) t.wrapS = W[o.wrapS];
    t.premultiplyAlpha = !!o.alpha; t.anisotropy = aniso; t.colorSpace = THREE.NoColorSpace;
    out[k] = t;
  }).catch((e) => {
    console.warn(`texture tex/${k}.webp failed to load; using a neutral stand-in`, e && e.message ? e.message : e);
    const t = new THREE.DataTexture(new Uint8Array(o.alpha ? [0, 0, 0, 0] : [214, 204, 186, 255]), 1, 1);
    t.needsUpdate = true; t.premultiplyAlpha = !!o.alpha; out[k] = t; missing.push(k);
  })));
  return out;
}

/* ---------------------------------------------------------------- scene state */
const envScene = new THREE.Scene(), lateScene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(EXPLORE.fov, 1, 0.1, 1500);
let m3 = null;
let world, shadow, post, rig, mikan, sitter, daifuku, challenger, keyLight, fillLight, terr, scent, hud, sb;
let simTime = 0, lastStats = {};
const mikanPos = new THREE.Vector3(), drive = { x: 0, z: 0 }, bot = { on: false, f: 0, r: 0, look: [0, 0], space: false, e: false, tab: false };
// phase clock: a key (day | dusk) or a running blend
const ph = { name: opt.phase, from: null, to: null, k: 0, dur: 20, lampT: -1, called: false, threadUntil: -1, catT: 0 };
// Mikan's locomotion: ground | top (High Road segment) | hop (arc)
const mv = { mode: 'ground', seg: -1, s: 0, hop: null, speed: 0, dir: new THREE.Vector3(0, 0, -1), hold: null, holdT: 0, inPatch: null, home: false, napping: 0 };
const sense = { held: false, k: 0, sniffT: 0, discovered: { daifuku: false } };
let found = false, windowOpen = false, climb = null;

function setPhaseKey(p) {
  applyPhase(p);
  const sd = sunDir(p);
  CEL.keyDir.value.copy(sd).normalize();
  CEL.celTint.value.set(...hexRGB(p.cel));
  const light = { keyDir: new THREE.Vector3(...p.catDir).normalize(), keyColor: new THREE.Color(p.catKey), shadeColor: new THREE.Color(p.catShade), rimColor: new THREE.Color(p.catRim) };
  for (const c of [mikan, sitter, daifuku, challenger]) if (c) c.setLighting(light);
  if (keyLight) { keyLight.position.copy(sd).multiplyScalar(10); keyLight.color.set(p.catKey); fillLight.color.set(p.shadow); }
}
function setPhase(name) { ph.name = name; ph.from = ph.to = null; ph.k = name === 'dusk' ? 1 : 0; setPhaseKey(PHASES[name]); if (name === 'dusk') { ph.lampT = 99; U.lampWave.value = 99; } else { ph.lampT = -1; U.lampWave.value = -1; ph.called = false; } }
/** Day -> Dusk over ≈ 20 s (art bible §4.4): lights the lamp wave uphill, then the Call, then the Head Home thread. */
function startDusk(secs = 20) { if (ph.name === 'dusk' || ph.to) return; ph.from = 'day'; ph.to = 'dusk'; ph.k = 0; ph.dur = secs; }
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }

function layoutCamera() {
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h);
  const bw = renderer.domElement.width, bh = renderer.domElement.height;
  CEL.rtWidth.value = bw; CEL.rtHeight.value = bh;
  if (post) post.setSize(bw, bh);
  if (scent) scent.setRT(bw, bh);
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

/* ---------------------------------------------------------------- input (hud.md §8.2) */
const keys = new Set(); let dragging = false;
const down = (c) => keys.has(c);
function bindInput() {
  const el = renderer.domElement;
  el.addEventListener('mousedown', (e) => { dragging = true; e.preventDefault(); });
  addEventListener('mouseup', () => { dragging = false; });
  addEventListener('mousemove', (e) => {
    if (!(dragging || document.pointerLockElement === el)) return;
    rig.look(-e.movementX * 0.2, e.movementY * 0.16);      // 1:1: straight onto the pose, no smoothing
  });
  el.addEventListener('dblclick', () => { if (document.pointerLockElement === el) document.exitPointerLock(); else el.requestPointerLock && el.requestPointerLock(); });
  el.addEventListener('wheel', (e) => { rig.zoom = THREE.MathUtils.clamp(rig.zoom * (1 + Math.sign(e.deltaY) * 0.1), 0.35, 1.2); e.preventDefault(); }, { passive: false });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
  addEventListener('keydown', (e) => {
    if (e.code === 'Tab') e.preventDefault();
    if (m3 && m3.key(e)) { keys.clear(); e.preventDefault(); return; }
    if (e.repeat) return; keys.add(e.code);
    if (e.code === 'Digit1') setPhase('day'); if (e.code === 'Digit2') setPhase('dusk'); if (e.code === 'KeyN') startDusk(20);
    if (e.code === 'KeyO') { opt.post = !opt.post; }
    if (e.code === 'Space') hop();
  });
  addEventListener('keyup', (e) => { keys.delete(e.code); if (m3) m3.keyUp(e); });
  addEventListener('blur', () => keys.clear());
  addEventListener('resize', layoutCamera);
}

/* ---------------------------------------------------------------- High Road: hop up, walk the ribbon, hop down */
const segPoint = (sg, x, z) => { const dx = sg.bx - sg.ax, dz = sg.bz - sg.az, l2 = dx * dx + dz * dz || 1; let s = ((x - sg.ax) * dx + (z - sg.az) * dz) / l2; s = Math.max(0, Math.min(1, s)); return { s, x: sg.ax + dx * s, z: sg.az + dz * s, len: Math.sqrt(l2) }; };
function hop() {
  if (mv.hop || mv.napping) return;
  if (mv.mode === 'ground') {
    let best = null;
    HR.forEach((sg, i) => { if (sg.kind === 'den') return; const p = segPoint(sg, mikanPos.x, mikanPos.z), d = Math.hypot(p.x - mikanPos.x, p.z - mikanPos.z), rise = sg.y - mikanPos.y;
      if (d < 0.85 && rise > 0.4 && rise < 2.0 && (!best || d < best.d)) best = { i, p, d }; });
    if (best) startHop(new THREE.Vector3(best.p.x, HR[best.i].y, best.p.z), { mode: 'top', seg: best.i, s: best.p.s });
  } else if (mv.mode === 'top') {
    const sg = HR[mv.seg], side = Math.sign(-sg.ax) || 1, nx = Math.abs(sg.bx - sg.ax) > Math.abs(sg.bz - sg.az);
    // land on clear ground: try the lane side, then the far side; never inside a prop or wall (collision first)
    const inside = (q) => world.colliders.some((b) => !b.soft && q.x > b.min.x - 0.15 && q.x < b.max.x + 0.15 && q.z > b.min.z - 0.15 && q.z < b.max.z + 0.15 && b.max.y > gAt(q.x, q.z) + 0.3);
    for (const sgn of [1, -1]) {
      const t = mikanPos.clone(); if (nx) t.z += sgn * Math.sign(-sg.az || 1) * 0.55; else t.x += sgn * side * 0.55;
      collideCircle(t, 0.2, world.colliders); t.y = gAt(t.x, t.z);
      if (!inside(t)) { startHop(t, { mode: 'ground' }); return; }
    }
  }
}
function startHop(to, after) { mv.hop = { from: mikanPos.clone(), to, t: 0, dur: 0.38, after }; mikan.setGait('walk', 1.6); }

/* ---------------------------------------------------------------- per-step simulation */
function step(dt) {
  simTime += dt; U.time.value = simTime;
  // ---- phase blend, lamp wave, the Call, the thread
  if (ph.to) {
    ph.k = Math.min(1, ph.k + dt / ph.dur); setPhaseKeyThrottled(mixPhase(ph.from, ph.to, ss(ph.k)), dt);
    if (ph.k > 0.55 && ph.lampT < 0) ph.lampT = 0;
    if (ph.k >= 1) { ph.name = ph.to; ph.from = ph.to = null; setPhaseKey(PHASES[ph.name]); terr.setPhase(ph.name === 'dusk' ? 'dusk' : 'morning'); }
  }
  if (ph.lampT >= 0 && ph.lampT < 99) { ph.lampT += dt; U.lampWave.value = ph.lampT; if (ph.lampT > L.lamps.length * 0.32 + 0.6 && !ph.called) { ph.called = true; ph.threadUntil = simTime + 4; if (hud) { hud.hint('Time to head home.', 4); } } }
  if (mv.napping) mv.napping = Math.max(0, mv.napping - dt);
  // ---- input (keyboard, or the bot / drive hooks)
  const f = bot.on ? bot.f : (down('KeyW') || down('ArrowUp') ? 1 : 0) - (down('KeyS') || down('ArrowDown') ? 1 : 0);
  const r = bot.on ? bot.r : (down('KeyD') || down('ArrowRight') ? 1 : 0) - (down('KeyA') || down('ArrowLeft') ? 1 : 0);
  if (bot.on) rig.look(bot.look[0], bot.look[1]);
  sense.held = bot.on ? bot.tab : (down('Tab') || opt.sense);
  const eHeld = bot.on ? bot.e : down('KeyE');
  // ---- locomotion
  const y = rig.yaw * Math.PI / 180, fw = new THREE.Vector3(-Math.sin(y), 0, -Math.cos(y)), rt = new THREE.Vector3(Math.cos(y), 0, -Math.sin(y));
  let d = (drive.x || drive.z) ? new THREE.Vector3(drive.x, 0, drive.z) : fw.multiplyScalar(f).add(rt.multiplyScalar(r));
  const moving = d.lengthSq() > 1e-4 && !mv.hold && !mv.napping; if (moving) d.normalize();
  const speed = (down('ShiftLeft') || bot.run) ? 1.7 : 1.0;
  if (mv.hop) {
    const h = mv.hop; h.t += dt; const k = Math.min(1, h.t / h.dur);
    mikanPos.lerpVectors(h.from, h.to, k); mikanPos.y += Math.sin(Math.PI * k) * (0.25 + Math.max(0, h.to.y - h.from.y) * 0.25);
    if (k >= 1) { Object.assign(mv, h.after); mv.hop = null; mikanPos.copy(h.to); }
  } else if (mv.mode === 'top') {
    const sg = HR[mv.seg], ax = new THREE.Vector3(sg.bx - sg.ax, 0, sg.bz - sg.az), len = ax.length(); ax.normalize();
    if (moving) {
      const along = d.dot(ax); mv.s = mv.s + along * speed * dt / len;
      if (mv.s < 0 || mv.s > 1) {   // ribbon ends: step onto a touching segment (stepped walls), else stop at the end
        const end = mv.s < 0 ? [sg.ax, sg.az] : [sg.bx, sg.bz]; let nxt = -1;
        HR.forEach((o, i) => { if (i === mv.seg || o.kind === 'den') return; for (const [ex, ez] of [[o.ax, o.az], [o.bx, o.bz]]) if (Math.hypot(ex - end[0], ez - end[1]) < 0.7 && Math.abs(o.y - sg.y) < 0.75) nxt = i; });
        if (nxt >= 0) { const o = HR[nxt], p = segPoint(o, end[0], end[1]); mv.seg = nxt; mv.s = p.s; } else mv.s = Math.max(0, Math.min(1, mv.s));
      }
      mv.dir.copy(ax).multiplyScalar(Math.sign(d.dot(ax)) || 1);
    }
    const sg2 = HR[mv.seg]; mikanPos.set(sg2.ax + (sg2.bx - sg2.ax) * mv.s, sg2.y, sg2.az + (sg2.bz - sg2.az) * mv.s);
  } else {
    if (moving) { mikanPos.addScaledVector(d, speed * dt); collideCircle(mikanPos, 0.2, world.colliders); mv.dir.copy(d); }
    mikanPos.y = gAt(mikanPos.x, mikanPos.z);
  }
  if (moving || mv.hop) { const want = Math.atan2(mv.dir.x, mv.dir.z), o = mikan.object3D; let dy = want - o.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); o.rotation.y += dy * Math.min(1, dt * 10); }
  if (!mv.hop) mikan.setGait(moving ? 'walk' : 'idle', moving ? speed : 0);
  mikan.object3D.position.copy(mikanPos);
  mikan.update(dt); sitter.update(dt); if (daifuku) daifuku.update(dt); if (challenger) challenger.update(dt);
  // ---- garden wall blend (hud.md §3.5): inside Haru's garden the camera lowers and tightens and the HUD fades
  const hz = L.home.zone, home = mikanPos.x > hz[0] && mikanPos.x < hz[1] && mikanPos.z > hz[2] && mikanPos.z < hz[3];
  if (home !== mv.home) { mv.home = home; if (hud) hud.setHome(home); }
  // ---- Patch entry: the tag shows 3 s
  const inP = L.patches.find((p) => p.zone && mikanPos.z > p.zone[0] && mikanPos.z < p.zone[1] && !home);
  if ((inP && inP.id) !== mv.inPatch) { mv.inPatch = inP ? inP.id : null; if (inP && hud) { hud.tag(terr.patch(inP.id), 3); hud.influence(terr.sim.influenceBar(), null, 3); } }
  // ---- interactions (E): Spray hold 1.2 s, Rub 0.4 s, Nap, pick up
  interact(dt, eHeld);
  // ---- Whisker Sense and the 1 s sniff (Den perch, within 10 m)
  sense.k += ((sense.held && !home ? 1 : 0) - sense.k) * Math.min(1, dt / 0.12);
  if (post) post.mat.uniforms.sense.value = sense.k;
  sniff(dt);
  // ---- the Boss window: Daifuku's yowl, his climb down to the yard stop (authored clip; control kept)
  if (climb) stepClimb(dt);
  // ---- camera
  if (!opt.m0) { rig.setState(home ? 'home' : mv.mode === 'top' ? 'highroad' : 'explore'); rig.update(dt, mikanPos, false, { moveDir: moving ? mv.dir : null, airborne: !!mv.hop, rise: mv.hop ? mv.hop.to.y - mv.hop.from.y : 0 }); }
  else if (opt.view !== '01') rig.update(dt, mikanPos);
  // ---- camera-soft: dither to 30%, never hidden (owner M1.2 rule)
  { const c = cam.position, pv = rig.pivot, seg = new THREE.Line3(c.clone(), pv.clone()), cp = new THREE.Vector3();
    for (const sft of world.soft) {
      const p = new THREE.Vector3(sft.x, gAt(sft.x, sft.z) + 0.5, sft.z); seg.closestPointToPoint(p, true, cp);
      const near = Math.hypot(c.x - sft.x, c.z - sft.z) < sft.r + 0.5;
      const blocks = Math.hypot(cp.x - sft.x, cp.z - sft.z) < sft.r * 0.6 && cp.y < p.y + 0.8 && cp.distanceTo(pv) > 0.35;
      const fwdZ = pv.z - c.z, fwdL = Math.hypot(pv.x - c.x, fwdZ) || 1;
      if (sft.downLaneOnly) { sft.obj.visible = fwdZ / fwdL < -0.75 && Math.abs(mikanPos.z) < 12; }   // the stand-in card has one valid side
      const fade = sft.obj.userData.fade; if (fade) { const want = near || blocks ? 0.3 : 1; fade.value += (want - fade.value) * Math.min(1, dt / (want < fade.value ? 0.1 : 0.3)); if (dt === 0) fade.value = want; }
    } }
  // ---- painted backdrops sit at "infinity"; the shadow box follows Mikan (snapped to texels)
  const R = world.rings;
  R.sky.position.copy(cam.position); R.ringFar.position.copy(cam.position); R.sea.position.copy(cam.position); R.clouds.position.copy(cam.position);
  R.ringNear.position.set(cam.position.x * 0.85, cam.position.y, cam.position.z * 0.85);
  R.clouds.rotation.y = -simTime * 0.004;
  if (shadow && !opt.m0) { const tx = 42 / 2048; shadow.target.set(Math.round(mikanPos.x / tx) * tx, Math.round(mikanPos.y / tx) * tx, Math.round((mikanPos.z - 2) / tx) * tx); }
  // ---- territory visuals and HUD
  scent.update(dt, { sense: sense.k, mikan: mikanPos, ticks: compassTicks(), thread: threadPts(), threadGate: 1, fadeOf: null });
  if (hud) hudFrame(dt);
}
let catLightT = 0;
function setPhaseKeyThrottled(p, dt) { applyPhase(p); CEL.keyDir.value.copy(sunDir(p)).normalize(); CEL.celTint.value.set(...hexRGB(p.cel)); catLightT += dt; if (catLightT > 0.25) { catLightT = 0; setPhaseKey(p); } }
const ss = (x) => x * x * (3 - 2 * x);

/* ---------------------------------------------------------------- interactions */
function candidates() {
  const out = [], m = mikanPos;
  for (const p of L.patches) {
    const offer = terr.offer(p.id), d = Math.hypot(m.x - p.at[0], m.z - p.at[2]);
    if (offer && d < 1.35 && mv.mode === 'ground') out.push({ id: 'post-' + p.id, kind: 'spray', patch: p.id, offer, at: new THREE.Vector3(p.at[0], gAt(p.at[0], p.at[2]) + Math.min(0.95, p.at[1] * 0.75), p.at[2]), cap: p.at[1], d, dur: 1.2 });
    for (const [k, [x, , z]] of Object.entries(p.rub)) { const ro = terr.rubOffer(p.id, k), dd = Math.hypot(m.x - x, m.z - z); if (ro && dd < 0.9 && mv.mode === 'ground') out.push({ id: `rub-${k}`, kind: 'rub', patch: p.id, k, offer: ro, at: new THREE.Vector3(x, gAt(x, z) + 0.55, z), d: dd, dur: 0.4 }); }
  }
  if (ph.name === 'day' && !ph.to) { const [x, z] = L.sunspot.at, d = Math.hypot(m.x - x, m.z - z); if (d < 0.9) out.push({ id: 'nap', kind: 'nap', at: new THREE.Vector3(x, 0.5, z), d, dur: 0.5 }); }
  if (!found) { const [x, z] = L.find, d = Math.hypot(m.x - x, m.z - z); if (d < 0.8) out.push({ id: 'find', kind: 'find', at: new THREE.Vector3(x, 0.45, z), d, dur: 0.2 }); }
  return out.sort((a, b) => a.d - b.d);
}
const VERB = { rescue_spray: ['rescue', 'Rescue Spray'], counter_spray: ['counter', 'Counter-Spray'], claim_spray: ['claim', 'Claim Spray'], over_mark: ['rub', 'Over-mark'], rub: ['rub', 'Rub'] };
function interact(dt, eHeld) {
  const c = candidates(); mv.cands = c;
  const top = c[0];
  if (!top || !eHeld) { mv.hold = null; mv.holdT = 0; return; }
  if (!mv.hold || mv.hold.id !== top.id) { mv.hold = top; mv.holdT = 0; }
  mv.holdT += dt;
  if (mv.holdT >= top.dur) { complete(top); mv.hold = null; mv.holdT = 0; keys.delete('KeyE'); bot.e = false; }
}
function complete(c) {
  if (c.kind === 'spray' || c.kind === 'rub') {
    // a rival cat within 8 m sees a Rub (Territory §3.3); the caller decides, the sim applies it
    const seen = [sitter, challenger, daifuku].some((q) => q && q.object3D.visible && q.object3D.position.distanceTo(mikanPos) < 8);
    const ev = c.kind === 'spray' ? terr.spray(c.patch) : terr.rub(c.patch, c.k, { seen });
    if (!ev) return;
    const lp = L.patches.find((q) => q.id === c.patch), cap = c.kind === 'spray' ? new THREE.Vector3(lp.at[0], lp.at[1] + 0.25, lp.at[2]) : c.at.clone().add(new THREE.Vector3(0, 0.1, 0));
    scent.pop(cap, c.kind === 'spray', ev.target_clowder && ev.target_clowder !== 'bell' ? '#A8C878' : '#F2B01E');
    if (c.kind === 'spray') rig.kick && rig.kick(-6);
    if (hud) { hud.tag(terr.patch(c.patch), 3); hud.influence(terr.sim.influenceBar(), null, 3); }
  } else if (c.kind === 'nap') { mv.napping = 1.2; mikan.setGait('idle', 0); startDusk(opt.test ? 2 : 20); hud.hint('A nap in the sun\u2026', 3); }
  else if (c.kind === 'find') { found = true; hud.pickup('Shiny'); scent.pop(c.at, false); }
}
const log = [];
function onTerritory(e) {
  log.push({ t: +simTime.toFixed(2), ...e });
  if (e.type === 'BossWindowChanged') windowOpen = !!e.open;
  if (e.type === 'BossMoved') moveBoss(e.at);
  if (e.type === 'CatDiscovered' && daifuku && hud) { const scr = project(daifuku.object3D.position.clone().add(new THREE.Vector3(0, 0.6, 0))); if (scr) hud.tapeStar(scr); scent.pop(daifuku.object3D.position.clone().add(new THREE.Vector3(0, 0.6, 0)), false); }
  if (!hud) return;
  if (e.type === 'ScentChanged') {
    const p = L.patches.find((q) => q.id === e.patch), post = terr.patch(e.patch);
    if (p) { const scr = project(new THREE.Vector3(p.at[0], p.at[1] + 0.55, p.at[2])); const d = e.to - e.from;
      const txt = /rescue|claim/.test(e.cause || '') ? `${e.from} \u2192 ${e.to}` : `${d > 0 ? '+' : '\u2212'}${Math.abs(d)}`;
      hud.scentPop(scr && { x: scr.x, y: Math.min(innerHeight - 260, Math.max(170, scr.y)) }, txt, post.colour || '#F2B01E'); }
  }
  if (e.type === 'InfluenceChanged') { const to = (e.by_clowder || {}).bell ?? terr.influence(); hud.influence(terr.sim.influenceBar(), { from: e.from && typeof e.from === 'object' ? e.from.bell : (e.from ?? lastInfl), to }, 4); lastInfl = to; }
  if (e.type === 'AngerRaised') hud.angerPuff(false);
  if (e.type === 'AngerChanged') hud.angerPuff(true);
  if (e.type === 'KeeperCalled') hud.hint('Fight to clear, spray to claim.', 4);
  if (e.type === 'MarkApplied' && e.kind === 'rescue_spray' && !terr.window) hud.hint('Spray it Strong. The bar fills.', 3);
  if (e.type === 'CatDiscovered') hud.hint('That\u2019s Daifuku up there.', 3);
}

/* ---------------------------------------------------------------- Whisker Sense: compass ticks and the sniff */
const TICK_GLYPH = { roaming_boss: 'crown', challenger: 'stake', fading_post: 'cracked', rival_mark: 'brick' };
function compassTicks() {
  // the sim decides which ticks exist and their priority (hud.md §3.2, <= 6); the layout says where they point
  const out = [], byPost = (id) => L.patches.find((p) => p.post === id || p.id === id);
  for (const k of terr.ticks()) {
    let at = null;
    if (k.kind === 'roaming_boss') { const s = L.stops[k.target]; if (s) at = [s[0], s[2]]; }
    else { const p = byPost(k.target) || byPost(k.patch); if (p) { const r = p.rub[k.target]; at = r ? [r[0], r[2]] : [p.at[0], p.at[2]]; } }
    if (at) out.push({ kind: TICK_GLYPH[k.kind] || 'brick', x: at[0], z: at[1] });
  }
  if (!found && out.length < 6) out.push({ kind: 'sparkle', x: L.find[0], z: L.find[1] });
  return out;
}
function sniff(dt) {
  // the 1 s sniff is the sim's rule (whisker(): on screen, <= 10 m, 1.0 s); the street draws its fill ring
  const held = sense.k > 0.6;
  if (!held && !sense.wasHeld) { if (hud) hud.sniffRing(null); return; }
  sense.wasHeld = held;
  const cats = []; let scr = null;
  if (daifuku) { const dp = daifuku.object3D.position; scr = project(dp.clone().add(new THREE.Vector3(0, 0.5, 0))); cats.push({ id: 'daifuku', pos: [dp.x, dp.z], onScreen: !!(scr && scr.x > 0 && scr.x < innerWidth && scr.y > 0 && scr.y < innerHeight) }); }
  const w = terr.whisker(dt, { held, inCombat: false, pos: [mikanPos.x, mikanPos.z], cats });
  const ring = w.rings && w.rings.find((r) => r.cat === 'daifuku');
  if (hud) hud.sniffRing(ring && scr ? scr : null, ring ? ring.t / ring.of : 0);
  sense.discovered.daifuku = terr.sim.isDiscovered('daifuku');
}
/** Screen position plus whether the point is behind the lens or off-screen (for edge badges). */
function projectEdge(p) { const v = p.clone().project(cam), behind = v.z > 1; const x = (v.x * 0.5 + 0.5) * innerWidth, y = (-v.y * 0.5 + 0.5) * innerHeight; return { x, y, behind, off: behind || x < 0 || x > innerWidth || y < 0 || y > innerHeight }; }
function project(p) { const v = p.clone().project(cam); if (v.z > 1) return null; return { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight }; }

/* ---------------------------------------------------------------- the Boss window: yowl, climb down, yard stop */
let bossAt = 'den_wall', lastInfl = null;
function moveBoss(at) {
  if (!daifuku || !L.stops[at] || at === bossAt) return;
  const from = bossAt; bossAt = at; const [tx, ty, tz] = L.stops[at], p0 = daifuku.object3D.position.clone();
  // authored clips (plan §2.4: the climb-down is staged, control kept): via the Den wall face, the garden and over the lane wall
  // the Boss walks the High Road in view: down off the Den, a quick run across the garden, up onto the lane wall, along its
  // coping toward the yard, and down to the stop. [x, y, z, speed factor]
  const viaWall = [[-9.6, 3.25, 3.4, 1], [-9.2, 0, 3.0, 2.5], [-2.3, 0, 1.6, 2.5], [-1.7, 1.58, 1.2, 1], [-1.7, 1.58, -3.6, 0.8], [-1.7, 1.58, -8.4, 0.8], [-1.0, 0, -9.4, 1]];
  const pts = [[p0.x, p0.y, p0.z, 1]];
  if (from === 'den_wall') pts.push(...viaWall); else if (at === 'S_N' || at === 'den_wall') pts.push([-1.0, 0, -9.4, 1], [-1.7, 1.58, -8.4, 1], [-1.7, 1.58, 1.2, 1], [-2.3, 0, 1.6, 2.5], [-8.6, 0, 1.0, 2.5]);
  pts.push([tx, ty, tz, 1]);
  climb = { t: 0, pts, speed: opt.test ? 2.2 : 1.1 };
  if (from === 'den_wall' && hud) hud.hint('The big wall stirs\u2026', 3);
  // soft look-at (control kept) toward where he will be seen: his run along the lane wall's coping
  if (rig.biasTo && from === 'den_wall') rig.biasTo(-1.7, -4.2, opt.test ? 7 : 14);
}
function stepClimb(dt) {
  const c = climb, P = c.pts; let acc = 0;
  { let a2 = 0; for (let i = 0; i < P.length - 1; i++) { const l = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1], P[i + 1][2] - P[i][2]); if (c.t <= a2 + l) { c.t += dt * c.speed * (P[i + 1][3] || 1); break; } a2 += l; } if (c.t >= a2) c.t += dt * c.speed; }
  for (let i = 0; i < P.length - 1; i++) {
    const a = new THREE.Vector3(P[i][0], P[i][1], P[i][2]), b = new THREE.Vector3(P[i + 1][0], P[i + 1][1], P[i + 1][2]), l = a.distanceTo(b);
    if (c.t <= acc + l) { const k = (c.t - acc) / l, p = a.clone().lerp(b, k); if (b.y !== a.y) p.y += Math.sin(Math.PI * k) * 0.4; else p.y = a.y === 0 ? gAt(p.x, p.z) : a.y; if (a.y === 0 && b.y === 0) p.y = gAt(p.x, p.z);
      daifuku.object3D.position.copy(p); daifuku.object3D.rotation.y = Math.atan2(b.x - a.x, b.z - a.z); daifuku.setGait('walk', 1.1); return; }
    acc += l;
  }
  const [yx, yy, yz] = L.stops[bossAt]; daifuku.object3D.position.set(yx, yy || gAt(yx, yz), yz); daifuku.object3D.rotation.y = 0; daifuku.setGait('idle', 0); climb = null;
  log.push({ t: +simTime.toFixed(2), type: 'BossAtStop', stop: bossAt });
}

/* ---------------------------------------------------------------- the Head Home thread (lane centre line to the garden gate) */
function threadPts() {
  const show = (simTime < ph.threadUntil) || ((ph.name === 'dusk' || ph.called) && (down('KeyH') || bot.home));
  if (!show || mv.home) { hud && hud.homePrompt(ph.name === 'dusk' && !mv.home && simTime < ph.threadUntil); return null; }
  hud && hud.homePrompt(true);
  const [gx, gz] = L.home.gate, pts = [], m = mikanPos, y0 = (z) => gAt(0, z) + 0.18;
  pts.push([m.x, m.y + 0.18, m.z]);
  const z0 = m.z, x0 = THREE.MathUtils.clamp(m.x, -1.2, 1.2);
  for (let i = 1; i <= 24; i++) { const k = i / 24, z = z0 + (gz - z0) * k, x = x0 + (gx + 0.9 - x0) * ss(k) + Math.sin(k * 9 + simTime * 2) * 0.05 * (1 - k); pts.push([x, y0(z) + Math.sin(k * 7) * 0.04, z]); }
  pts.push([gx - 0.6, 0.2, gz]);
  return pts;
}

/* ---------------------------------------------------------------- HUD frame */
function hudFrame(dt) {
  const dialT = ph.to ? 0.62 + 0.26 * ph.k : ph.name === 'dusk' ? 0.88 : 0.55;
  hud.dial(ph.to ? (ph.k > 0.5 ? 'dusk' : 'day') : ph.name, dialT, !!ph.to || sense.k > 0.5);
  const list = [];
  for (const c of (mv.cands || []).slice(0, 1)) {
    const s = project(c.at); if (!s) continue; s.y = Math.min(innerHeight - 230, Math.max(150, s.y));   // always in frame
    const vb = c.kind === 'spray' || c.kind === 'rub' ? VERB[c.offer] : c.kind === 'nap' ? ['nap', 'Nap'] : ['sniff', 'Pick up'];
    list.push({ id: c.id, x: s.x, y: s.y, verb: vb[0], label: vb[1], hold: mv.hold && mv.hold.id === c.id ? Math.min(1, mv.holdT / c.dur) : 0 });
  }
  hud.prompts_(list);
  if (daifuku && (climb || (windowOpen && sense.k > 0.5))) { hud.edgeTrack(projectEdge(daifuku.object3D.position.clone().add(new THREE.Vector3(0, 0.5, 0)))); } else hud.edgeTrack(null);
  hud.update(dt);
}

/* ---------------------------------------------------------------- render */
function render() {
  renderer.info.reset();
  shadow.update(renderer, [envScene, lateScene], world.casters); lastStats.shadowCalls = shadow.calls; renderer.info.reset();
  cam.updateMatrixWorld();
  if (opt.mask === 'cats' || opt.mask === 'catsTop' || opt.mask === 'blobs') {
    // depth from the real environment pass (through the real paint post, whose wobble displaces depth), then colour cleared
    if (opt.post) { renderer.setRenderTarget(post.rt); renderer.clear(); renderer.render(envScene, cam); post.render(renderer); }
    else { renderer.setRenderTarget(null); renderer.clear(); renderer.render(envScene, cam); }
    renderer.setClearColor(0x000000, 1); renderer.clear(true, opt.mask === 'catsTop', false);
    const blobs = opt.mask === 'blobs';
    const hidden = []; lateScene.traverse((o) => { if (!o.isMesh) return; const keep = isCat(o) && (blobs ? o.material.transparent : !o.material.transparent); if (!keep) { hidden.push(o); o.visible = false; } });
    const mats = new Map(); lateScene.traverse((o) => { if (o.isMesh && o.visible) { mats.set(o, o.material); o.material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: blobs ? THREE.DoubleSide : THREE.FrontSide, depthTest: opt.mask !== 'catsTop' }); } });
    renderer.autoClear = false; renderer.render(lateScene, cam); renderer.autoClear = true;
    for (const [o, m] of mats) o.material = m; hidden.forEach((o) => { o.visible = true; });
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

/* ---------------------------------------------------------------- M2 evidence: vantage shots and the bot walk */
// six vantages (plan §5 M2): Mikan's spot, camera yaw/pitch, High Road state, Whisker Sense
const VANTAGE = [
  { at: [0.3, 0, 45.8], yaw: 200, pitch: 12, note: 'Low Wall Corner: red-mailbox post, Sunspot, Haru\u2019s garden wall' },
  { at: [0.0, 0, 4.5], yaw: 0, pitch: 9, note: 'Laundry Pole Yard from up-lane: lantern post, wisps, High Perch' },
  { top: [-1.7, 3.2], yaw: 75, pitch: 6, note: 'The High Perch on the wall: the Den wall and Daifuku within 10 m' },
  { at: [0.0, 0, -20.0], yaw: 0, pitch: 8, note: 'Down the slope into the lower town, toward the sea' },
  { at: [0.0, 0, -34.0], yaw: 180, pitch: 4, note: 'Looking back uphill at the stepped walls and the crest' },
  { at: [-1.0, 0, 52.2], yaw: 140, pitch: 8, note: 'Haru\u2019s garden gate: the wall blend between street and home' },
];
function placeAt(v) {
  if (v.top) { const [x, z] = v.top, i = HR.findIndex((s) => s.kind === 'wall' && Math.abs(s.ax - x) < 0.3 && z >= Math.min(s.az, s.bz) && z <= Math.max(s.az, s.bz)); const s = HR[i], p = segPoint(s, x, z); Object.assign(mv, { mode: 'top', seg: i, s: p.s }); mikanPos.set(p.x, s.y, p.z); }
  else { mikanPos.set(v.at[0], gAt(v.at[0], v.at[2]), v.at[2]); mv.mode = 'ground'; }
  rig.yaw = v.yaw; rig.pitch = v.pitch; rig.lastLook = rig.t;
}
/** The 5-minute bot walk (plan §5 M2 acceptance): no rendering, fixed 30 Hz sim; counts camera-in-geometry frames and
 *  frames where the cat is out of frame or hidden behind camera-solid geometry. */
function botWalk(seconds = 300, seedN = 7) {
  let s = seedN >>> 0; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const route = [[0, 58], [0, 30], [-1.0, 12], [0.8, -2], [-0.5, -12], [0, -30], [0.5, -58], [0, -30], [0.6, -6], [0, 20], [-0.9, 50], [0, 62]];
  const dt = 1 / 30, N = Math.round(seconds / dt), solid = world.colliders.filter((b) => !b.soft), ray = new THREE.Ray(), hit = new THREE.Vector3();
  mikanPos.set(0, 0, 58); mv.mode = 'ground'; mv.hop = null; rig.yaw = 0; rig.update(0, mikanPos, true);
  bot.on = true; let wp = 0, camIn = 0, out = 0, hidden = 0, hops = 0, ribbonT = 0, lookT = 0, frames = []; const fails = [];
  const fr = new THREE.Frustum(), M = new THREE.Matrix4();
  for (let i = 0; i < N; i++) {
    const tgt = route[wp % route.length], dx = tgt[0] - mikanPos.x, dz = tgt[1] - mikanPos.z;
    if (Math.hypot(dx, dz) < 0.8) wp++;
    // steer in camera space toward the waypoint (as a player would with WASD)
    const yr = rig.yaw * Math.PI / 180, fwd = new THREE.Vector3(-Math.sin(yr), 0, -Math.cos(yr)), right = new THREE.Vector3(Math.cos(yr), 0, -Math.sin(yr)), dir = new THREE.Vector3(dx, 0, dz).normalize();
    bot.f = Math.round(dir.dot(fwd) * 1.4); bot.r = Math.round(dir.dot(right) * 1.4); bot.run = rnd() < 0.3;
    // look input: bursts of orbiting and pitching, like a curious player
    if (lookT <= 0) { lookT = 0.5 + rnd() * 2.5; bot.look = rnd() < 0.55 ? [(rnd() - 0.5) * 7, (rnd() - 0.5) * 2.5] : [0, 0]; }
    lookT -= dt;
    // now and then hop onto the wall ribbon, run it for a few seconds, hop down
    if (mv.mode === 'ground' && !mv.hop && rnd() < 0.004 && Math.abs(mikanPos.x) > 0.6) { hop(); if (mv.hop) { hops++; ribbonT = 2 + rnd() * 3; } }
    if (mv.mode === 'top' && !mv.hop) { ribbonT -= dt; if (ribbonT <= 0) hop(); }
    step(dt); cam.updateMatrixWorld();
    // metrics
    const c = cam.position; let inside = c.y < gAt(c.x, c.z) + 0.05;
    for (const b of solid) if (b.containsPoint(c)) { inside = true; break; }
    if (inside) { camIn++; if (fails.filter((f) => f.kind === 'camIn').length < 8) fails.push({ i, kind: 'camIn', cam: c.toArray().map((v) => +v.toFixed(2)), mikan: mikanPos.toArray().map((v) => +v.toFixed(2)), mode: mv.mode, hop: !!mv.hop, dist: +rig.dist.toFixed(2), pitch: +(rig.solvedPitch || 0).toFixed(1) }); }
    M.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); fr.setFromProjectionMatrix(M);
    const head = mikanPos.clone().add(new THREE.Vector3(0, 0.3, 0));
    const inFr = fr.containsPoint(head); if (!inFr) { out++; if (fails.filter((f) => f.kind === 'out').length < 8) fails.push({ i, kind: 'out', cam: c.toArray().map((v) => +v.toFixed(2)), mikan: mikanPos.toArray().map((v) => +v.toFixed(2)), mode: mv.mode, hop: !!mv.hop }); }
    else { ray.origin.copy(c); ray.direction.copy(head).sub(c); const L2 = ray.direction.length(); ray.direction.normalize(); for (const b of solid) { if (ray.intersectBox(b, hit) && hit.distanceTo(c) < L2 - 0.25) { hidden++; if (fails.filter((f) => f.kind === 'hidden').length < 8) fails.push({ i, kind: 'hidden', cam: c.toArray().map((v) => +v.toFixed(2)), mikan: mikanPos.toArray().map((v) => +v.toFixed(2)), mode: mv.mode, hop: !!mv.hop, box: [b.min.toArray(), b.max.toArray()].map((a) => a.map((v) => +v.toFixed(2))) }); break; } } }
    if (i % 300 === 0) frames.push({ t: +(i * dt).toFixed(1), mikan: mikanPos.toArray().map((v) => +v.toFixed(2)), cam: c.toArray().map((v) => +v.toFixed(2)), mode: mv.mode });
  }
  bot.on = false; bot.look = [0, 0];
  const visible = N - out - hidden;
  return { seconds, frames: N, camInsideGeometry: camIn, catOutOfFrustum: out, catBehindSolid: hidden, catInFramePct: +(100 * visible / N).toFixed(2), hops, waypointsReached: wp, samples: frames, fails };
}

/* ---------------------------------------------------------------- boot */
async function boot() {
  if (startError) throw startError;
  if (Q.get('card') === '1' || !opt.test) desktopCard(Q.get('card') === '1');
  const [tex, sTex] = await Promise.all([loadTextures(), bakeScent()]);
  world = buildWorld(L, tex); world.tex = tex;
  envScene.add(world.env, world.backdrop); lateScene.add(world.late);
  shadow = new SunShadow(2048, 21);
  post = new PaintPost(tex.grain);
  U.grainMap.value = tex.grain;
  terr = createTerritory(L, { seed: opt.seed, start: opt.start }); terr.on(onTerritory);
  try { await loadCatAssets(''); } catch (e) { console.warn('cat assets failed to load; casts that need them are skipped', e); }
  const stub = () => ({ object3D: new THREE.Group(), update() {}, setGait() {}, setLighting() {}, setOutlineScale() {}, dispose() {} });
  const cat = (cast) => { try { return createCat({ cast, scale: 1.25 }); } catch (e) { console.warn(`cat "${cast}" could not be built; skipped`, e); missing.push('cat:' + cast); return stub(); } };
  mikan = cat('mikan'); sitter = cat('wallSitter'); daifuku = opt.m0 ? null : (() => { try { return createCat({ cast: 'daifuku', scale: 1.25 * 1.35 }); } catch (e) { console.warn('daifuku skipped', e); return null; } })();
  for (const c of [mikan, sitter, daifuku]) if (c) catRoots.add(c.object3D);
  const [mx, my, mz, mr] = L.spawn.mikan; mikanPos.set(mx, my, mz); mikan.object3D.rotation.y = mr;
  const [sx, sy, sz, sr] = L.spawn.wallSitter; sitter.object3D.position.set(sx, sy, sz); sitter.object3D.rotation.y = sr;
  lateScene.add(mikan.object3D, sitter.object3D);
  if (daifuku) { const [x, y, z, r] = L.den.seat; daifuku.object3D.position.set(x, y, z); daifuku.object3D.rotation.y = r; lateScene.add(daifuku.object3D); }
  // the challenger glowers from the fence top beside the post it stakes (plan §2.2 10:55; the sim says who and where)
  const ch = terr.snapshot().challenger;
  if (ch && !ch.beaten && !opt.m0) { challenger = cat('tough'); const p = L.patches.find((q) => q.id === ch.patch); if (p && challenger) { challenger.object3D.position.set(1.64, 1.3, p.at[2] + 0.9); challenger.object3D.rotation.y = -Math.PI / 2; lateScene.add(challenger.object3D); catRoots.add(challenger.object3D); } }
  terr.setPhase(opt.phase === 'dusk' ? 'dusk' : 'morning');
  keyLight = new THREE.DirectionalLight('#ffffff', 2.5); fillLight = new THREE.AmbientLight('#6E6AA8', 0.8); lateScene.add(keyLight, fillLight);
  scent = new ScentLayer(lateScene, L, terr, sTex, (z) => gAt(0, z));
  if (daifuku) scent.bossMarker(daifuku.object3D, 0.95);
  hud = opt.hud ? new StreetHUD() : null;
  m3 = new M3({ renderer, tex, post, opt, hud, project, cam, get mikan() { return mikan; }, lane: L, terr, get mikanPos() { return mikanPos; }, get phase() { return ph.name; }, lateScene, catRoots, gAt, createCat, keysClear: () => keys.clear(),
    saveGlobals: () => ({ map: U.shadowMap.value, texel: U.shadowTexel.value }),
    restoreGlobals: (g) => { if (g) { U.shadowMap.value = g.map; U.shadowTexel.value = g.texel; } setPhaseKey(ph.to ? mixPhase(ph.from, ph.to, ss(ph.k)) : PHASES[ph.name]); U.lampWave.value = ph.lampT >= 0 ? ph.lampT : -1; layoutCamera(); },
    renderStreet: () => render(), stepStreet: (dt) => step(dt) });
  rig = opt.m0 ? new OrbitRig(cam, world.colliders) : new ExploreRig(cam, world.colliders, gAt);
  if (opt.orbit != null) rig.yaw = opt.orbit * 45;
  layoutCamera();
  setPhase(opt.phase);
  if (opt.vantage != null && VANTAGE[opt.vantage]) placeAt(VANTAGE[opt.vantage]);
  if (opt.view === '01') { cam.position.set(0, 1.0, 2.15); cam.lookAt(0, 1.0, -10); }
  else rig.update(0, mikanPos.clone(), true);
  step(0); if (opt.view !== '01') rig.update(0, mikanPos, true);
  window.__cat = {
    state: () => ({ phase: ph.name, blend: ph.to ? +ph.k.toFixed(2) : null, camera: cam.position.toArray().map((v) => +v.toFixed(3)), yaw: rig.yaw, pitch: rig.pitch, dist: +rig.dist.toFixed(3),
      mikan: mikanPos.toArray().map((v) => +v.toFixed(3)), mode: mv.mode, home: mv.home, influence: terr.influence(), window: terr.window, boss: bossAt, patches: terr.patches(), discovered: { ...sense.discovered }, hash: terr.hash(),
      stats: { ...lastStats, texMB: texMB() }, missing: [...missing], log: log.slice(-20) }),
    step: (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) step(dt); render(); },
    setPhase: (p) => { setPhase(p); render(); },
    startDusk: (s) => startDusk(s),
    /** Scripted input for tests: {f, r, look:[dy,dp], e, tab, space, home, frames, dt} then one render. */
    input: (o = {}) => { bot.on = true; Object.assign(bot, { f: 0, r: 0, look: [0, 0], e: false, tab: false, home: false }, o); if (o.space) hop(); for (let i = 0; i < (o.frames || 1); i++) step(o.dt || 1 / 30); bot.on = false; render(); return window.__cat.state(); },
    teleport: (x, z, yaw) => { mikanPos.set(x, gAt(x, z), z); collideCircle(mikanPos, 0.2, world.colliders); mikanPos.y = gAt(mikanPos.x, mikanPos.z); mv.mode = 'ground'; if (yaw != null) rig.yaw = yaw; rig.update(0, mikanPos, true); step(0); render(); },
    botWalk: (s, seed) => botWalk(s, seed),
    m3: () => m3,
    verdict: (patch, v = 'chase') => { terr.verdict(patch, v); render(); return window.__cat.state(); },   // M3 owns the Verdict; test scripts only
    hold: (secs = 1.3, o = {}) => window.__cat.input({ e: true, frames: Math.ceil(secs * 30), ...o }),
    lensCheck: () => {
      const c = cam.position, t = Math.tan(cam.fov * Math.PI / 360); let worst = { frac: 0 };
      cam.updateMatrixWorld(); const fr = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
      for (const k of world.cards) {
        const p = new THREE.Vector3(...k.p), dl = p.distanceTo(c);
        if (dl < k.s * 0.55 + 0.35 || (dl < k.s * 1.5 + 0.2 && k.p[1] < c.y + 0.6)) continue;  // dithered to 30% by the card shader
        if (!fr.intersectsSphere(new THREE.Sphere(p, k.s * 0.5))) continue;
        const frac = k.s / (2 * dl * t); if (k.p[1] < c.y + 0.6 && frac > worst.frac) worst = { frac: +frac.toFixed(2), what: 'low foliage card', at: k.p };
      }
      for (const sft of world.soft) if (sft.obj.visible && sft.obj.userData.fade && sft.obj.userData.fade.value > 0.95) { const dl = Math.hypot(sft.x - c.x, sft.z - c.z); if (dl < 0.8) worst = { frac: 1, what: 'prop ' + sft.obj.name, at: [sft.x, sft.z] }; }
      return worst;
    },
    drive: ({ x = 0, z = -1, frames = 15, yaw = 0, dt = 1 / 30 } = {}) => {
      drive.x = x; drive.z = z;
      for (let i = 0; i < frames; i++) { rig.yaw += yaw / frames; if (rig.lastLook != null) rig.lastLook = rig.t; step(dt); }
      drive.x = drive.z = 0; render();
    },
  };
  if (opt.test) {
    for (let i = 0; i < 6; i++) step(1 / 60); // settle cat idle deterministically
    render(); render();
    if (m3) m3.boot();
    window.__ready = true;
    return;
  }
  bindInput();
  if (m3) m3.boot();
  if (!isSmallOrTouch()) hint();
  if (opt.fps) fpsOverlay();
  let last = performance.now(), first = true;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; frameLog(dt);
    try { if (m3 && m3.modal()) m3.frame(dt); else { step(dt); render(); if (m3) m3.frame(dt); } } catch (e) { console.error('frame failed:', e); failCard(e); return; }
    if (first) { first = false; window.__ready = true; loading(false); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
function hint() {
  const d = document.createElement('div');
  d.textContent = 'WASD walk (Shift run) · drag or double-click to look · Space hop onto walls · E spray / rub / nap · Tab Whisker Sense · H Head Home · N nap to Dusk · J Rivals · T Togemaru · Esc Pause';
  d.style.cssText = 'position:fixed;left:16px;bottom:14px;max-width:calc(100% - 32px);padding:8px 14px;border-radius:999px;background:rgba(255,246,227,.88);color:#33273B;font:600 13px/1.3 ui-rounded,system-ui,sans-serif;pointer-events:none;z-index:31';
  document.body.appendChild(d);
}
/* ---------------------------------------------------------------- ?fps=1: the real-laptop frame log (plan §4.8) */
const FL = { n: 0, sum: 0, worst: 0, hist: new Array(8).fill(0), el: null };
function frameLog(dt) { if (!opt.fps) return; FL.n++; FL.sum += dt; FL.worst = Math.max(FL.worst, dt); FL.hist[Math.min(7, Math.floor(dt * 1000 / 8.33))]++;
  if (FL.el && FL.n % 15 === 0) FL.el.textContent = `${(FL.n / FL.sum).toFixed(0)} fps avg · worst ${(FL.worst * 1000).toFixed(0)} ms · ${lastStats.calls} calls · ${(lastStats.triangles / 1000).toFixed(0)}k tris`; }
function fpsOverlay() { FL.el = document.createElement('div'); FL.el.style.cssText = 'position:fixed;right:16px;bottom:14px;padding:6px 12px;border-radius:12px;background:#33273B;color:#FFF6E3;font:600 12px/1.2 ui-monospace,monospace;z-index:31'; document.body.appendChild(FL.el);
  window.__frameLog = () => ({ frames: FL.n, avgFps: +(FL.n / FL.sum).toFixed(1), worstMs: +(FL.worst * 1000).toFixed(1), histogramMs8: FL.hist, ua: navigator.userAgent, dpr: devicePixelRatio, size: [innerWidth, innerHeight] }); }
/* ---------------------------------------------------------------- loading and failure, always visible */
function loading(on) {
  let el = document.getElementById('scene-loading');
  if (!on) { if (el) el.remove(); return; }
  el = document.createElement('div'); el.id = 'scene-loading'; el.setAttribute('role', 'status');
  el.textContent = 'Loading the lane\u2026';
  el.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);padding:12px 24px;border-radius:999px;background:#FFF6E3;color:#33273B;border:3px solid #6B4A35;font:700 18px/1.2 "M PLUS Rounded 1c",ui-rounded,system-ui,sans-serif;z-index:40';
  document.body.appendChild(el);
}
function failCard(e) {
  loading(false);
  const reason = String((e && e.message) || e || 'unknown error').split('\n')[0].slice(0, 160);
  const el = document.createElement('div'); el.id = 'scene-error'; el.setAttribute('role', 'alert');
  el.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:#FFF6E3;z-index:60;font-family:"M PLUS Rounded 1c",ui-rounded,system-ui,sans-serif';
  el.innerHTML = '<div style="box-sizing:border-box;width:min(100%,460px);background:#FFF6E3;color:#33273B;border:4px solid #6B4A35;border-radius:28px;padding:22px;text-align:center;box-shadow:0 6px 0 #6B4A35"><h2 style="margin:0 0 8px;font-size:26px">Couldn\u2019t load the scene</h2><p style="margin:0 0 16px;font-size:17px;line-height:1.4"></p><button type="button" style="font:inherit;font-weight:700;font-size:17px;background:#6B4A35;color:#FFF6E3;border:0;border-radius:999px;padding:11px 24px;min-height:44px;cursor:pointer">Try again</button></div>';
  el.querySelector('p').textContent = reason;
  el.querySelector('button').addEventListener('click', () => location.reload());
  document.body.appendChild(el);
}
// ?chapter=combat: hand the page to the combat sandbox bundle (combat.js, same folder) instead of the Lane scene
if (Q.get('chapter') === 'combat') {
  if (renderer) { renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); }
  const sc = document.createElement('script'); sc.src = 'combat.js'; sc.onerror = () => failCard(new Error('combat.js failed to load')); document.body.appendChild(sc);
} else {
  if (!opt.test) loading(true);
  boot().then(() => chapterPill()).catch((e) => { console.error('scene failed to start:', e); failCard(e); });
}

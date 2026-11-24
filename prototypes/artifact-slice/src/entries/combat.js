// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// M1 combat sandbox (-> dist/combat.html): the deterministic sim (src/sim/combat) driven at a fixed 60 Hz,
// rendered from snapshot() with interpolation in the M0 painted look, with the combat camera, inked VFX
// on twos, the screen layer (lines, lettering, Pile-On set-piece) and the kit-CSS HUD.
// Query params:
//   ?fight=toughs3|captain|daifuku|sandbox|challenger|lose   (encounter; default toughs3)
//   ?seed=N  ?phase=day|dusk  ?script=demo (an M1.1 player bot drives Mikan) | bot|median|daifuku|passive (sim smoke bots)
//   ?test=1 (deterministic: no real-time pacing; window.__cat drives frames)  ?flash=reduce  ?motion=0..1
//   ?res=0.85 (render scale)  ?post=0 (paint post off)  ?hud=0  ?rim=0 (drop the cream rim shell)  ?dmg=0 (damage numbers off; N toggles)
import * as THREE from 'three';
import { U, CEL, applyPhase, SunShadow } from '../render/env.js';
import { PHASES, sunDir } from '../render/phases.js';
import { PaintPost } from '../render/post.js';
import { loadCatAssets } from '../render/cats/index.js';
import { createEncounter, DATA } from '../sim/combat/index.js';
import { skilledBot, medianBot, daifukuBot, passiveBot, withCommandQueue } from '../../tests/smoke/combat/bots.mjs';
import { buildArena, spendProp } from '../render/vfx/arena.js';
import { Fighter, portraitFor } from '../render/vfx/fighters.js';
import { bakeSprites, Kit } from '../render/vfx/sprites.js';
import { WorldFX } from '../render/vfx/fx.js';
import { ScreenFX } from '../render/vfx/screen.js';
import { CombatCamera, COMBAT_CAM } from '../camera/combat.js';
import { CombatInput } from '../input/combat-input.js';
import { CombatHUD, BARK_ICON } from '../ui/combat/hud.js';
import { chapterPill } from '../ui/combat/chapters.js';
import { Cinematics, styleOf, SPECIAL_BY_STYLE } from '../render/vfx/cinematics.js';

const Q = new URLSearchParams(location.search);
// a 10-cat brawl for the triangle budget check (inline encounter row; same arena as the sandbox)
const BRAWL10 = { Name: 'brawl10', arena: 'sandbox_lane', opener: 'standoff', posse: ['mikan', 'hige', 'pon', 'kinako'], enemies: ['goma', 'sasa', 'stray', 'stray', 'stray', 'challenger'], guest: null, tutorial: false };
const FIGHTS = { brawl10: BRAWL10, toughs3: 'toughs_3', captain: 'captain', daifuku: 'daifuku_bout', sandbox: 'sandbox', challenger: 'challenger', lose: 'lose_to_daifuku', toughs2: 'toughs_2', strays: 'two_strays' };
const opt = {
  fight: FIGHTS[Q.get('fight')] || 'toughs_3', seed: (+Q.get('seed') || 1) >>> 0, phase: PHASES[Q.get('phase')] ? Q.get('phase') : 'day',
  test: Q.get('test') === '1', script: Q.get('script') || '', post: Q.get('post') !== '0', res: +(Q.get('res') || 1), hud: Q.get('hud') !== '0',
  reduceFlashes: Q.get('flash') === 'reduce', motion: Q.has('motion') ? +Q.get('motion') : 1, dmg: Q.get('dmg') !== '0',
};
const app = document.getElementById('app');
app.style.position = 'fixed'; app.style.inset = '0';
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: opt.test, powerPreference: 'high-performance' });
const dpr = opt.test ? 1 : Math.min(devicePixelRatio, 1.5);
renderer.setPixelRatio(dpr * opt.res);
renderer.setSize(app.clientWidth, app.clientHeight);
renderer.info.autoReset = false;
renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
app.appendChild(renderer.domElement);

/* ---------------------------------------------------------------- textures (same set as the M0 scene) */
const TEX = {
  wall: { wrap: 'mirror' }, fence: { wrap: 'mirror', alpha: true }, ground: { wrap: 'mirror' }, garden: { wrap: 'mirror' }, grain: { wrap: 'repeat' },
  skybrush: { wrap: 'repeat' }, foliage: { alpha: true }, flowers: { alpha: true }, grass: { alpha: true }, clouds: { alpha: true },
  hillsNear: { alpha: true, wrapS: 'repeat' }, hillsFar: { alpha: true, wrapS: 'repeat' }, town: { alpha: true }, sea: { wrapS: 'repeat' },
  roof: { wrap: 'mirror' }, house: { wrap: 'mirror' }, window: {}, notice: { alpha: true },
  stains: { alpha: true }, groundbits: { alpha: true }, poster: { alpha: true }, manhole: { alpha: true }, vending: {}, aircon: {}, legs: { alpha: true }, townFar: { alpha: true },
};
const WR = { mirror: THREE.MirroredRepeatWrapping, repeat: THREE.RepeatWrapping };
async function loadTextures() {
  const loader = new THREE.TextureLoader(), out = {}, aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  await Promise.all(Object.entries(TEX).map(([k, o]) => loader.loadAsync(`tex/${k}.webp`).then((t) => {
    if (o.wrap) t.wrapS = t.wrapT = WR[o.wrap];
    if (o.wrapS) t.wrapS = WR[o.wrapS];
    t.premultiplyAlpha = !!o.alpha; t.anisotropy = aniso; t.colorSpace = THREE.NoColorSpace; out[k] = t;
  })));
  return out;
}

/* ---------------------------------------------------------------- state */
const envScene = new THREE.Scene(), lateScene = new THREE.Scene(), fxScene = new THREE.Scene(), decalScene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(COMBAT_CAM.fov, 1, 0.1, 1500);
const fGroup = new THREE.Group(); lateScene.add(fGroup);
let world, shadow, post, enc, snap, prevSnap, fighters = new Map(), fx, scr, ccam, input, hud, sprites, keyLight, fillLight;
let realT = 0, acc = 0, paused = false, script = null, cmdQueue = [], injectQ = [], pile = null, impact = null, dip = null, midTone = new THREE.Color('#8C88B8');
const DT = 1 / 60, TWO = 1 / 30, evLog = [], counts = {};
let lastTagWindow = null, routedTrail = new Map(), crackedUntil = new Map(), standoffFocus = null, fightStartT = null, endShown = false, lastStats = {};
let camPrev = null, driveInp = null, driveYaw = 0, ko = null, lastEnemyOut = null, lastOutBy = null, sawShockwaveEvent = false; const teleById = new Map();
let quiet = null, hudBackAt = null, chainMean = 0.4, staggerSeen = false, latencyLog = [], cin = null, chainPending = false, chainFired = false; const banners = new Set(), bonusShown = new Set();
let pendingCard = null, seedCounter = 1, skipDraw = false; const pendingMenu = [];

function setPhase(name) {
  const p = applyPhase(name), sd = sunDir(p);
  CEL.keyDir.value.copy(sd).normalize();
  const h = (x) => { const n = parseInt(x.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  CEL.celTint.value.set(...h(p.cel));
  const light = { keyDir: new THREE.Vector3(...p.catDir).normalize(), keyColor: new THREE.Color(p.catKey), shadeColor: new THREE.Color(p.catShade), rimColor: new THREE.Color(p.catRim) };
  for (const f of fighters.values()) f.cat.setLighting(light);
  if (keyLight) { keyLight.position.copy(sd).multiplyScalar(10); keyLight.color.set(p.catKey); fillLight.color.set(p.shadow); }
}

function layout() {
  const w = app.clientWidth, h = app.clientHeight;
  renderer.setSize(w, h);
  const bw = renderer.domElement.width, bh = renderer.domElement.height;
  CEL.rtWidth.value = bw; CEL.rtHeight.value = bh;
  if (post) post.setSize(bw, bh);
  cam.aspect = w / h; cam.updateProjectionMatrix();
  if (hud) hud.layout(w, h);
}

/* ---------------------------------------------------------------- helpers */
const v3 = (p) => new THREE.Vector3(p[0], p[1], p[2]);
const F = (id) => fighters.get(id);
const ent = (id, s = snap) => s.entities.find((e) => e.id === id);
const pv = new THREE.Vector3();
function project(p) {
  pv.copy(p).project(cam);
  const w = app.clientWidth, h = app.clientHeight;
  return { x: (pv.x * 0.5 + 0.5) * w, y: (-pv.y * 0.5 + 0.5) * h, on: pv.z < 1 && Math.abs(pv.x) < 1.3 && Math.abs(pv.y) < 1.3, nx: pv.x, ny: pv.y };
}
function hitTypeOf(e) { const st = e && DATA.styles[e.style]; return st ? (st.basic_type || st.type || (e.style === 'Bruiser' ? 'thump' : e.style === 'Yowler' ? 'yowl' : 'claw')) : 'claw'; }
function screenDir(from, to) { const a = project(from), b = project(to); const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return [dx / l, -dy / l]; }

/** Combat §3.17 feel playback: hit-stop is the sim's; here impact frames, shake, punch-in, lines, the word, edge pulse, time dip. */
function applyFeel(feel, at, o = {}) {
  if (!feel) return;
  const start = realT + (feel.delay_ms || 0) / 1000, hs = (feel.hitstop?.ms || 0) / 1000;
  let impactDur = 0;
  if (feel.impact === 'fullscreen' && !opt.reduceFlashes) {
    impact = { start, inv: feel.impact_frames || 2, at: at.clone(), mean: measureMean() };
    impactDur = (impact.inv + 2) / 60;
    ccam.hold(start + impactDur);
  }
  if (feel.shake) ccam.addShake(feel.shake, start + impactDur, o.dir);
  if (feel.punch_in_pct) ccam.addPunch(at, Math.min(feel.tier >= 5 ? 8 : feel.punch_in_pct, 15) * opt.motion, start, Math.max(hs, 0.06));
  if (feel.lines === 'local_streak' && o.from) scr.add({ kind: 'streak', from: o.from.clone(), to: at.clone(), dur: feel.lines_ms / 1000, seed: seedCounter++ % 3, delay: feel.delay_ms / 1000 });
  else if (feel.lines === 'radial_20' || feel.lines === 'radial_40') scr.add({ kind: 'radial', share: feel.lines === 'radial_20' ? 0.2 : 0.4, at: at.clone(), dur: feel.lines_ms / 1000, seed: seedCounter++ % 3, delay: feel.delay_ms / 1000 });
  else if (feel.lines === 'full_field' && !o.noFull) scr.add({ kind: 'radial', share: 0.62, at: at.clone(), dur: feel.lines_ms / 1000, seed: seedCounter++ % 3, color: Kit.C.ink });
  if (feel.word && !(cin && cin.holding) && !(quiet && realT < quiet.until)) scr.letter({ cls: feel.word.cls, ms: feel.word.ms, tier: feel.tier, hitType: o.hitType, at: at.clone(), seed: seedCounter++, dir: o.dir, text: o.text });
  if (feel.edge_pulse) scr.add({ kind: 'edge', dur: Math.max(2 / 60, feel.edge_pulse.ms / 1000) });
  if (feel.time_dip && (!feel.time_dip.final_rout_only || o.finalRout)) dip = { from: start + hs + impactDur, to: start + hs + impactDur + feel.time_dip.ms / 1000, scale: feel.time_dip.scale };
}

/** Mean relative luminance of the environment (64 x 36 readback), for the impact frame's mid tone (±0.10). */
let meanRT = null;
function measureMean() {
  if (!meanRT) meanRT = new THREE.WebGLRenderTarget(64, 36);
  renderer.setRenderTarget(meanRT); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(envScene, cam);
  const buf = new Uint8Array(64 * 36 * 4); renderer.readRenderTargetPixels(meanRT, 0, 0, 64, 36, buf); renderer.setRenderTarget(null);
  let sum = 0; const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  for (let i = 0; i < buf.length; i += 4) sum += 0.2126 * lin(buf[i]) + 0.7152 * lin(buf[i + 1]) + 0.0722 * lin(buf[i + 2]);
  const mean = sum / (64 * 36);
  // a lavender mid-tone (Shadow Wisteria family) scaled to the frame's mean luminance
  const base = [0.62, 0.6, 0.8].map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const L = 0.2126 * base[0] + 0.7152 * base[1] + 0.0722 * base[2], k = mean / L;
  const enc = (c) => { c = Math.min(1, c * k); return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; };
  midTone.setRGB(enc(base[0]), enc(base[1]), enc(base[2]), THREE.SRGBColorSpace);
  return mean;
}

function contactPoint(att, tgt) {
  const a = att ? att.pos.clone() : tgt.pos.clone(), b = tgt.pos.clone();
  const d = new THREE.Vector3(b.x - a.x, 0, b.z - a.z); const l = d.length() || 1; d.divideScalar(l);
  const p = b.clone().addScaledVector(d, -0.18 * tgt.scaleK); p.y = b.y + 0.32 * tgt.scaleK;
  return { p, dir: [d.x, d.z] };
}

/* ---------------------------------------------------------------- events -> presentation */
function onEvent(ev) {
  evLog.push(ev); counts[ev.type] = (counts[ev.type] || 0) + 1;
  hud && hud.onEvent(ev, snap, realT);
  const tw = realT;
  switch (ev.type) {
    case 'StandoffStart': {
      const foes = snap.entities.filter((e) => e.side === 'enemy');
      const c = foes.reduce((a, e) => a.add(v3(e.pos)), new THREE.Vector3()).divideScalar(Math.max(1, foes.length)); standoffFocus = c;
      const boss = foes.find((e) => e.rank === 'boss' || e.rank === 'captain');
      hud.card(boss ? boss.name.toUpperCase() : 'WALL SITTERS', boss ? (boss.rank === 'boss' ? ' Boss of the Wall' : ' Captain') : ` ×${foes.length}`, ev.duration_s * 1000 - 300, realT, 'sage');
      scr.add({ kind: 'bands', ats: foes.map((e) => v3(e.pos).add(new THREE.Vector3(0, 0.35, 0))), dur: ev.duration_s - 0.2, color: Kit.C.sage });
      scr.add({ kind: 'bands', ats: snap.entities.filter((e) => e.side === 'posse').slice(0, 1).map((e) => v3(e.pos).add(new THREE.Vector3(0, 1.05, 0))), dur: ev.duration_s - 0.2, color: Kit.C.gold });
      for (const e of snap.entities) { const f = F(e.id); if (f) f.impulse('hiss', tw, { dur: 0.6 }); }
      break;
    }
    case 'FightStarted': fightStartT = realT; ccam.blend(COMBAT_CAM.enterBlend); break;
    case 'Hit': {
      const fa = F(ev.attacker), ft = F(ev.target); if (!ft) break;
      const ea = ent(ev.attacker), cp = contactPoint(fa, ft), ht = ev.hit_type || hitTypeOf(ea);
      if (fa && !ev.attack) fa.impulse('strike', tw, { mag: ev.kind === 'finisher' || (ev.feel && ev.feel.tier >= 3) ? 1.4 : 1 });
      ft.impulse('hurt', tw, { mag: ev.blocked ? 0.4 : Math.min(1.6, 0.6 + (ev.feel?.tier || 0) * 0.25) });
      if (!ev.blocked) ft.flash(tw, 8);   // M1.2 §5: a longer, character-local hit flash (~133 ms) on every cat
      if (ev.kind === 'special' && (ev.stagger_bonus || ev.bonus || (ent(ev.target) && ent(ev.target).staggered_s > 0)) && !bonusShown.has(ev.attacker + ev.tick)) { bonusShown.add(ev.attacker + ev.tick); scr.add({ kind: 'banner', at: ft.head.clone(), text: 'STAGGER BONUS!', col: '#F2B01E', who: '', dur: 0.9 }); }
      if (opt.dmg && ev.dmg > 0) scr.damage(ft, Math.round(ev.dmg), ft.side === 'enemy' ? 'out' : 'in', realT, ev.kind === 'special' || (ev.feel && ev.feel.tier >= 3));
      const facingRot = Math.atan2(cp.dir[1], cp.dir[0]) * 0.5;
      if (quiet && realT < quiet.until) { ft.flash(tw, 2); break; }   // the stagger cinematic owns the screen
      fx.hit(cp.p, ht, ev.feel || { tier: 0, dust: '2 puffs' }, cp.dir, { blocked: ev.blocked, stringIdx: ea ? ea.string_idx : 0, finisher: ev.kind === 'finisher' || ev.kind === 'tag_in', player: ev.authored === 'player', seed: seedCounter++, facingRot });
      applyFeel(ev.feel, cp.p, { dir: screenDir(fa ? fa.pos : cp.p, ft.pos), from: fa ? fa.pos.clone().add(new THREE.Vector3(0, 0.3, 0)) : null, hitType: ht });
      // the player's own swipes get a short speed smear behind the lunge even on T1 (no flash: Ink wedges, 2 drawings)
      if (fa && ev.authored === 'player' && (ev.feel?.tier ?? 0) <= 1) scr.add({ kind: 'streak', from: fa.pos.clone().add(new THREE.Vector3(0, 0.3, 0)), to: cp.p.clone(), dur: 0.12, seed: seedCounter++ % 3, len: 120 });
      break;
    }
    case 'Whiff': { const fa = F(ev.attacker); if (fa) { fa.impulse('strike', tw, { mag: 0.8 }); fx.spawn('wedge', fa.head.clone().add(new THREE.Vector3(0, -0.2, 0)), { size: 0.3, drawings: 3 }); } break; }
    case 'Hop': case 'Mantle': case 'HopDown': { const f = F(ev.cat); if (f) fx.dust('2 puffs', f.pos); break; }
    case 'Pounce': { const f = F(ev.cat); if (f) scr.add({ kind: 'streak', from: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)), to: f.pos.clone().add(new THREE.Vector3(0, 0, 0)), dur: 0.2, seed: 2 }); break; }
    case 'Staggered': case 'Frazzled': {
      // M1.1 §5 stagger cinematic (the sim's 'Staggered' when published; the M1 Frazzle until then)
      // ONE dominant effect: the shattered-glass blink over the target, framed clear and large. Everything else
      // that piled onto it (slash arcs, sparks, swirls, the hit word, lines, the impact frame, bars, barks) is
      // cleared now and held back for the cinematic's ~0.5 s.
      { const f = F(ev.cat), e = ent(ev.cat);
        if (f && e && e.side === 'enemy') { const full = ev.treatment ? ev.treatment === 'full' : (e.rank === 'captain' || e.rank === 'boss' || !staggerSeen); staggerSeen = true;
          const r = cin.stagger(f, full, realT); if (!ev.slow) dip = r.dip;
          const C = F(snap.controlled);
          ccam.stagger = { T: f, C, from: realT, until: realT + (full ? 0.55 : 0.36), full };
          quiet = { id: ev.cat, until: realT + (full ? 0.55 : 0.36) };
          fx.clearNear(f.pos, 3.0); scr.word = null; scr.fx = scr.fx.filter((x) => x.kind === 'shatter'); impact = null; ccam.holdUntil = 0; ccam.punch = null;
          hud.barkMsg = null; } }
      break;
    }
    case 'FrazzledLegacy': { { const by = ent(ev.by); if (by && by.side !== 'enemy') hud.bark(ev.by, 'bang', realT); } const f = F(ev.cat); if (f) { f.impulse('take', tw, { dur: 0.25 }); fx.spawn('burstMagenta', f.head.clone(), { size: 0.9, drawings: 4, cycle: false }); } break; }
    case 'FrazzleEnded': { const f = F(ev.cat); if (f) for (let i = 0; i < 3; i++) fx.spawn('wedge', f.head.clone().add(new THREE.Vector3((i - 1) * 0.2, 0, 0)), { size: 0.22, drawings: 4, vel: new THREE.Vector3((i - 1) * 0.8, 0.6, 0) }); break; }
    case 'Ruffled': { const f = F(ev.cat); if (f) { f.impulse('take', tw); fx.spawn('sweat', null, { size: 0.26, drawings: 30, cycle: true, follow: () => f.head.clone().add(new THREE.Vector3(0.22 * f.scaleK, 0.08, 0)), breakAt: 0.85 }); } break; }
    case 'Hiss': { const f = F(ev.cat), e = ent(ev.cat); if (f && e) { f.impulse('hiss', tw); fx.spawn('hiss', f.head.clone().add(new THREE.Vector3(e.facing[0] * 0.35, -0.05, e.facing[1] * 0.35)), { size: 0.7, drawings: 5, rot: Math.atan2(-e.facing[1], e.facing[0]) * 0.3, cycle: true, breakAt: 0.7 }); } break; }
    case 'HissInterrupt': crackedUntil.set(ev.target, realT + 0.5); if (F(ev.target)) applyFeel(ev.feel, F(ev.target).head, { dir: [0, 1] }); break;
    case 'BackDown': { const f = F(ev.cat); if (f) { f.impulse('take', tw); applyFeel(ev.feel, f.head, {}); } break; }
    case 'Splat': { const f = F(ev.cat); if (f) fx.dust('5-puff ring', f.pos); break; }
    case 'KnockOff': { const f = F(ev.cat); if (f) { f.impulse('take', tw, { dur: 0.35 }); scr.add({ kind: 'streak', from: f.head.clone(), to: v3([ev.land[0], 0.3, ev.land[1]]), dur: 0.3, seed: 2 }); applyFeel(ev.feel, f.head, {}); } break; }
    case 'BossLanded': { const f = F(ev.cat); if (f) { fx.dust('ring plus crack decal', f.pos); f.impulse('land', tw, { dur: 0.3 }); if (ev.in_bucket) scr.add({ kind: 'splash', at: f.pos.clone(), dur: 0.5, seed: 3 }); } break; }
    case 'PropTriggered': { const p = snap.props.find((x) => x.id === ev.prop); if (p) { scr.add({ kind: 'splash', at: v3(p.pos), dur: 0.45, seed: 5 }); spendProp(world.props[ev.prop], ev.prop); } break; }
    case 'FearTriggered': { const f = F(ev.cat); if (f) { scr.add({ kind: 'fear', at: f.head.clone(), dur: 0.9 }); f.impulse('take', tw, { dur: 0.3 }); applyFeel(ev.feel, f.head, {}); } break; }
    case 'PawFilled': { const f = F(ev.cat); if (f) fx.groundMark('pawDisc', f.pos, 0.8 * f.scaleK, 0.33); break; }
    case 'Switch': ccam.blend(COMBAT_CAM.tagBlend); break;
    case 'SlowBlinkOpen': case 'SlowBlinkClose': ccam.blend(COMBAT_CAM.sbBlend); break;
    case 'MoveUsed': {
      // who did what: the user's lunge, a personality flourish (bark + a burst of its pictogram), its plate pom
      const fu = F(ev.user), eu = ent(ev.user); if (!fu || !eu) break;
      fu.impulse('strike', tw, { mag: 1.5, dur: 0.28 });
      hud.moveUsed(ev.user, ev.move, realT);
      hud.barkMsg = hud.barkMsg && hud.barkMsg.id === ev.user ? null : hud.barkMsg;   // the banner is the flourish: no balloon over it
      const mv = DATA.moves[ev.move] || {}, col = styleOf(eu.cat).col;
      fx.tagRing(fu.pos, eu.side === 'enemy' ? '#A8C878' : col);
      if (!banners.has(ev.user + ev.move + Math.floor(realT))) scr.add({ kind: 'banner', at: fu.head.clone(), text: (mv.name || ev.move).toUpperCase(), col: eu.side === 'enemy' ? '#A8C878' : col, who: eu.name, dur: 1.3 });
      // distinct VFX per Move type at each target: claw flurry, thump shockwave, yowl arcs
      for (const id of ev.targets_hit || []) { const ft = F(id); if (!ft || mv.target === 'ally') continue;
        const at = ft.head.clone().add(new THREE.Vector3(0, -0.15, 0));
        if (mv.type === 'thump') { fx.dust('ring plus crack decal', ft.pos); fx.spawn('burstThump', at, { size: 1.2, drawings: 5, cycle: false }); fx.tagRing(ft.pos, '#FFF6E3'); }
        else if (mv.type === 'yowl') { for (let i = 0; i < 3; i++) fx.spawn('sparkYowl', fu.head.clone().lerp(at, 0.35 + i * 0.3), { size: 0.5 + i * 0.25, drawings: 5, delay: i * TWO * 2 }); fx.spawn('spiral', at, { size: 0.35, drawings: 6 }); }
        else { fx.spawn('slashFlurry', at, { size: 1.5, drawings: 5, cycle: false }); for (let i = 0; i < 3; i++) fx.spawn('claws', at.clone().add(new THREE.Vector3((i - 1) * 0.25, 0.2, 0)), { size: 0.3, drawings: 5, delay: i * TWO }); } }
      if (mv.target === 'ally' || mv.target === 'self') for (const id of (ev.targets_hit && ev.targets_hit.length ? ev.targets_hit : [ev.user])) { const f = F(id); if (f) for (let i = 0; i < 3; i++) fx.spawn('heart', f.head.clone().add(new THREE.Vector3((i - 1) * 0.18, 0.1, 0)), { size: 0.18, drawings: 10, vel: new THREE.Vector3((i - 1) * 0.2, 0.7, 0), delay: i * TWO, breakAt: 0.7 }); }
      break;
    }
    case 'Healed': { const f = F(ev.cat); if (f && opt.dmg && ev.amount > 0) scr.damage(f, Math.round(ev.amount), 'heal', realT, false); if (f) for (let i = 0; i < 2; i++) fx.spawn('heart', f.head.clone(), { size: 0.16, drawings: 10, vel: new THREE.Vector3((i ? 1 : -1) * 0.25, 0.6, 0), delay: i * TWO * 2, breakAt: 0.7 }); break; }
    case 'TagIn': {
      { const e2 = ent(ev.to); if (e2) hud.bark(ev.to, e2.personality, realT, true); }
      ccam.blend(COMBAT_CAM.tagBlend); ccam.relayHold = realT + 3;
      const fi = F(ev.to), ftg = F(ev.target);
      if (fi && ftg) {
        // the streak reads from the edge of the action: at least 3 m long, back along the leap
        const to = ftg.pos.clone().add(new THREE.Vector3(0, 0.35, 0)), d = fi.pos.clone().sub(ftg.pos); d.y = 0;
        const L = Math.max(3, d.length()); if (d.lengthSq() < 1e-4) d.set(0, 0, 1); d.normalize();
        scr.add({ kind: 'tagstreak', from: to.clone().addScaledVector(d, L).add(new THREE.Vector3(0, 0.4, 0)), to, dur: 0.4, relay: ev.relay_count });
      }
      break;
    }
    case 'CatRouted': {
      const f = F(ev.cat); if (!f) break;
      f.impulse('take', tw, { dur: 0.18 });
      fx.spawn('sparkle', f.head.clone(), { size: 0.3, drawings: 10, spin: 6, cycle: false });
      routedTrail.set(ev.cat, realT); if (ev.side === 'enemy') { lastEnemyOut = ev.cat; lastOutBy = ev.by; }
      { const by = ent(ev.by); if (by && by.side !== 'enemy' && ev.how !== 'by_pile_on') hud.bark(ev.by, by.personality, realT); }
      const last = snap.entities.filter((e) => e.side === ev.side && !e.routed && e.present).length === 0;
      if (ev.feel && ev.how !== 'by_pile_on') applyFeel(ev.feel, f.head, { dir: [0, 1], finalRout: last, hitType: 'claw' });
      else if (ev.feel && ev.feel.word && !pile) scr.letter({ cls: ev.feel.word.cls, ms: ev.feel.word.ms, tier: ev.feel.tier, at: f.head.clone(), seed: seedCounter++ });
      break;
    }
    case 'TeamFinisher': case 'PileOnStart': {
      // the Team finisher (M1.1 §6) reuses the Pile-On set-piece; on the M1 sim it is the Pile-On itself
      const isTeam = ev.type === 'TeamFinisher'; if (isTeam) { ev = { ...ev, pile_type: 'full', feel: ev.feel || { tier: 5 } }; }
      const t = F(ev.target);
      pile = { t: 0, dur: ev.duration_s || (snap.pile_on ? snap.pile_on.dur : (ev.pile_type === 'full' ? 2.5 : 1.2)), type: ev.pile_type, target: ev.target, cats: ev.cats, phase: 'main', beat: 0, beatT: null, beatDx: 0, outT: 0,
        coats: ev.cats.map((id) => { const e = ent(id); const k = portraitFor(e?.cat || id, id); return id === 'mikan' ? k.coat.base : (k.coat.patch || k.coat.base); }),
        mikan: ev.cats.includes('mikan'), chevrons: Math.max(0, ev.cats.length - (ev.cats.includes('mikan') ? 1 : 0)), panel: Kit.C.gold,
        bolter: t && t.side === 'enemy' && (ent(ev.target)?.rank !== 'boss') ? { ...portraitFor(ent(ev.target)?.cat, ev.target) } : null, centerW: t ? t.pos.clone() : new THREE.Vector3(), team: isTeam, beatIdx: -1 };
      hud.showChrome(false);
      applyFeel(ev.feel, pile.centerW.clone().add(new THREE.Vector3(0, 0.4, 0)), { noFull: true, text: 'BAP-BAP-BAP!' });
      break;
    }
    case 'PileOnBeat': if (pile) {
      // each beat belongs to one cat: its face pops out of the cloud with its personality flourish and its Style word
      pile.beat = ev.beat; pile.beatT = 0; pile.beatDx = ((ev.beat * 37) % 7 - 3) / 6;
      const e = ent(ev.cat); pile.beatFace = e ? hud.portrait(e.cat, 150, e.id) : null; pile.beatIcon = BARK_ICON[ev.flourish] || BARK_ICON.bang;
      const W = { Scrapper: ['SKRITCH!', 'SHNK!', 'SWISH!'], Bruiser: ['WHAM!', 'BOFF!', 'THOOM!'], Yowler: ['YOWWL!', 'MRRAOW!'] }[ev.style] || ['POW!'];
      scr.letter({ cls: 'dust_cloud', ms: 340, tier: 4, hitType: ev.style === 'Bruiser' ? 'thump' : ev.style === 'Yowler' ? 'yowl' : 'claw', text: W[ev.beat % W.length], seed: ev.beat });
      if (ev.feel?.shake) ccam.addShake(ev.feel.shake, realT, [0, 1]);
    } break;
    case 'SkillBarOpen': case 'SkillBarClose': ccam.blend(COMBAT_CAM.sbBlend); break;
    case 'SpecialChainStart': chainMean = measureMean(); hud.showChrome(false); break;
    case 'SpecialStart': {   // M1.2: sequential; the cut-in plays for cutin_s, then the cat's action plays in the world
      const e = ent(ev.cat), f = F(ev.cat); if (!e || !f) break;
      cin.cutIn({ id: e.id, catId: e.cat, name: e.name, f, special: ((DATA.cats[e.cat] && DATA.cats[e.cat].special_name) || ev.special || '').toUpperCase(), idx: (ev.index || 1) - 1, of: ev.of || 1 }, ev.cutin_s || 0.8, chainMean, realT, ev.index === 1);
      hud.moveUsed(ev.cat, null, realT);
      break;
    }
    case 'SpecialEnd': break;
    case 'SpecialCutIn': {
      const e = ent(ev.cat), f = F(ev.cat); if (!e || !f) break;
      cin.cutIn({ id: e.id, catId: e.cat, name: e.name, f, special: ((DATA.cats[e.cat] && DATA.cats[e.cat].special_name) || ev.special || '').toUpperCase(), idx: (ev.index || 1) - 1, of: ev.of || 1 }, ev.duration_s || 1, chainMean, realT, ev.index === 1);
      break;
    }
    case 'SpecialUsed': { const fu = F(ev.cat); for (const id of ev.targets_hit || []) { const ft = F(id); if (ft) { ft.impulse('hurt', tw, { mag: 1.5 }); fx.spawn('burstGold', ft.head.clone(), { size: 1.2, drawings: 4, cycle: false }); fx.dust('5-puff ring', ft.pos); } } if (fu) fu.impulse('strike', tw, { mag: 1.6 }); break; }
    case 'SpecialChainEnd': {
      if (pile) { pile.phase = 'out'; pile.outT = 0; pile.screen = pile.anchor || project(pile.centerW.clone().add(new THREE.Vector3(0, 0.35, 0))); scr.letter({ cls: 'dust_cloud', ms: 800, tier: 5, hitType: 'thump', text: 'KA-BLAM!', at: pile.centerW.clone().add(new THREE.Vector3(0, 0.4, 0)), seed: 3 }); }
      else { hud.showChrome(true); }
      cin.end(); ccam.blend(0.2);
      break;
    }
    case 'Dash': { const f = F(ev.cat); if (f) { fx.dust('3-puff ring', f.pos); scr.add({ kind: 'streak', from: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)), to: f.pos.clone().add(new THREE.Vector3(Math.sin(f.yaw), 0.3, Math.cos(f.yaw))), dur: 0.2, seed: 1, len: 140 }); } break; }
    case 'AttackStart': { // anticipation sized to the attack's own startup (light: near-instant; heavy: a readable wind-up)
      const f = F(ev.cat); if (f) { const heavy = /^(H|HC|FIN|LAUNCH)$/.test(ev.attack), row = DATA.strings && DATA.strings[ev.attack];
        const st = row ? row.startup_s + (ev.charge ? (row.charge_max_s || 0) * ev.charge : 0) : heavy ? 0.25 : 0.03;
        f.impulse('coil', tw, { dur: Math.max(0.03, st), mag: heavy ? 2 : 0.6 }); }
      break; }
    case 'Evade': case 'Skitter': {   // M1.2 §2 Evade: a short streak, two afterimage wedges, dust; a perfect evade rings the clock
      const f = F(ev.cat); if (!f) break;
      fx.dust('3-puff ring', f.pos);
      const back = new THREE.Vector3(-Math.sin(f.yaw), 0, -Math.cos(f.yaw));
      scr.add({ kind: 'streak', from: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)).addScaledVector(back, 0.8), to: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)), dur: 0.18, seed: 1, len: 120 });
      if (ev.perfect) { scr.add({ kind: 'perfect', at: f.head.clone(), dur: 0.45 }); hud.bark(ev.cat, 'bang', realT, true); }
      break; }
    case 'PerfectEvade': { const f = F(ev.cat); if (f) scr.add({ kind: 'perfect', at: f.head.clone(), dur: 0.45 }); break; }
    case 'InputBuffered': case 'InputDropped': latencyLog.push({ type: ev.type, tick: ev.tick, attack: ev.attack }); break;
    case 'AttackActive': { const f = F(ev.cat); if (f) { const heavy = /^(H|HC|FIN|LAUNCH)$/.test(ev.attack); f.impulse('strike', tw, { mag: heavy ? 1.5 : 1.05, dur: heavy ? 0.42 : 0.3 }); } }
      latencyLog.push({ type: ev.type, tick: ev.tick, attack: ev.attack, latency_ticks: ev.latency_ticks }); break;
    case 'PileOnEnd': {
      if (pile) { pile.phase = 'out'; pile.outT = 0; pile.screen = pile.anchor || project(pile.centerW.clone().add(new THREE.Vector3(0, 0.35, 0))); }
      const at = pile ? pile.centerW.clone().add(new THREE.Vector3(0, 0.4, 0)) : new THREE.Vector3();
      applyFeel(ev.feel, at, { noFull: true, finalRout: snap.mode === 'ended' || snap.entities.filter((e) => e.side === 'enemy' && !e.routed && e.present).length === 0, hitType: 'thump', text: 'KA-BLAM!' });
      break;
    }
    case 'PhaseBreak': {
      const f = F(ev.cat); if (!f) break;
      f.impulse('take', tw, { dur: 0.6 });
      fx.dust('ring plus crack decal', f.pos); fx.spawn('burstGold', f.head.clone(), { size: 1.6, drawings: 5, cycle: false });
      applyFeel(ev.feel, f.head.clone(), { hitType: 'thump', dir: [0, 1] });
      hud.card('PHASE BREAK', '', 1400, realT, 'gold', 0.78);
      hud.showChrome(false); hudBackAt = realT + 1.0;   // authored T5: screen-anchored HUD hides, returns over 200 ms
      break;
    }
    case 'GuestEntered': case 'AllyYowl': { const f = F(ev.cat); if (f) fx.spawn('sparkleCream', f.head.clone(), { size: 0.4, drawings: 6 }); break; }
    case 'EncounterEnded': {
      endShown = true;
      const t = { win: ['ROUTED THEM!', ' The lot is ours'], loss: ['WIPED OUT', ' Back home by nightfall'], rival_fled: ['DAIFUKU BOLTS!', ' Phase 1 cleared'], player_fled: ['SCRAM!', ''] }[ev.outcome] || ['FIGHT OVER', ''];
      // the final KO cinematic, unless the sim already sent FinalKO this tick
      if (!ko && (ev.outcome === 'win' || ev.outcome === 'rival_fled')) { const last = ev.outcome === 'rival_fled' ? (ev.rival || (ev.boss_ids || [])[0]) : lastEnemyOut; if (last) startKO(last, lastOutBy); }
      pendingCard = { at: realT + (ko ? 1.6 : 1.1), text: t[0], sub: t[1], clowder: ev.outcome === 'loss' ? 'ink' : 'gold' };
      break;
    }
    case 'FinalKO': if (!ko) startKO(ev.cat || ev.target, ev.by, ev.freeze_ms, ev.slow); break;
    case 'TelegraphStart': teleById.set(ev.id, ev); break;
    case 'TelegraphEnd': {   // a belly-flop / slam resolving sends its shockwave ring (unless the sim sends its own)
      const tl = teleById.get(ev.id); teleById.delete(ev.id);
      if (tl && ev.reason === 'resolved' && !sawShockwaveEvent && !('hazards' in snap) && /belly|flop|slam|shock/.test(tl.move || '') && tl.shape && tl.shape.type === 'circle') {
        const c = v3([tl.shape.center[0], 0, tl.shape.center[1]]); fx.shockwave(c, tl.shape.radius * 1.15, 0.45); fx.dust('ring plus crack decal', c); }
      break; }
    case 'ShockwaveStart': {
      sawShockwaveEvent = true;
      const c = v3([ev.center[0], 0, ev.center[1]]), maxR = ev.max_radius_m || 6, sp = ev.speed_mps || 6;
      fx.shockwave(c, maxR, ev.duration_s || maxR / sp, { linear: true, r0: ev.radius || 0.3, width: ev.width_m || 0.7 });
      fx.dust('ring plus crack decal', c); fx.spawn('burstThump', c.clone().add(new THREE.Vector3(0, 0.4, 0)), { size: 1.6, drawings: 4, cycle: false });
      scr.letter({ cls: 'thud', ms: 500, tier: 4, hitType: 'thump', text: 'THOOM!', at: c.clone().add(new THREE.Vector3(0, 0.8, 0)), seed: 7 });
      ccam.addShake({ peak_pct: 1.1, steps: 5, step_ms: 33, decay: 0.6 }, realT, [0, 1]);
      break; }
    case 'KnockedDown': { const f = F(ev.cat); if (f) { f.impulse('hurt', tw, { mag: 1.6 }); fx.dust('5-puff ring', f.pos); } break; }
    case 'BossRage': { const f = F(ev.cat); if (f) { scr.add({ kind: 'banner', at: f.head.clone(), text: 'RAGE!', col: '#E2453F', who: f.id === 'daifuku' ? 'Daifuku' : '', dur: 1.3 }); for (let i = 0; i < 4; i++) fx.spawn('puffSmall', f.head.clone().add(new THREE.Vector3((i - 1.5) * 0.25, 0.1, 0)), { size: 0.22, drawings: 9, vel: new THREE.Vector3((i - 1.5) * 0.3, 0.7, 0) }); } break; }
    case 'Cornered': { const f = F(ev.cat); if (f) { f.impulse('hiss', tw, { dur: 0.4 }); fx.spawn('hiss', f.head.clone(), { size: 0.5, drawings: 5, breakAt: 0.7 }); } break; }
    case 'Shockwave': {
      sawShockwaveEvent = true;
      const c = v3([ev.center ? ev.center[0] : ev.pos[0], 0, ev.center ? ev.center[1] : ev.pos[2]]);
      fx.shockwave(c, ev.radius || ev.radius_m || 3, ev.duration_s || 0.45); fx.dust('ring plus crack decal', c);
      if (ev.feel) applyFeel(ev.feel, c.clone().add(new THREE.Vector3(0, 0.3, 0)), {}); else ccam.addShake({ peak_pct: 1.1, steps: 5, step_ms: 33, decay: 0.6 }, realT, [0, 1]);
      break; }
    default: break;
  }
}

/* ---------------------------------------------------------------- M1.1 input -> sim adapter */
// Tab lock-on cycle (owner, C10): not locked by default; a press locks the nearest enemy; a press when the
// nearest enemy is a DIFFERENT one locks that one; otherwise it unlocks (free third-person camera).
let camLock = null;
function nearestEnemy() {
  const c = snap.entities.find((e) => e.id === snap.controlled); if (!c) return null;
  let best = null, bd = 1e9;
  for (const e of snap.entities) { if (e.side !== 'enemy' || !e.present || e.routed) continue; const d = Math.hypot(e.pos[0] - c.pos[0], e.pos[2] - c.pos[2]); if (d < bd) { bd = d; best = e.id; } }
  return best;
}
function lockCycle() {
  const n = nearestEnemy();
  camLock = n && n !== camLock ? n : null;
  if (camLock) hud.lockFlash = realT;
}
let flickLock = null, flickSide = null, flickAcc = 0, flickT = -9;
/** Next enemy on screen side `dir` (+1 right, -1 left) of the current lock: the nearest in screen x. */
function pickSide(dir) {
  if (simM11()) { flickSide = dir > 0 ? 'right' : 'left'; hud.lockFlash = realT; return; }   // the sim picks the cat
  const cur = F(snap.lock); if (!cur) return;
  const cx = project(cur.head).x; let best = null, bd = 1e9;
  for (const e of snap.entities) { if (e.side !== 'enemy' || !e.present || e.routed || e.id === snap.lock) continue; const f = F(e.id); if (!f) continue;
    const p = project(f.head); if (!p.on) continue; const dx = (p.x - cx) * dir; if (dx > 8 && dx < bd) { bd = dx; best = e.id; } }
  if (best) { flickLock = best; hud.lockFlash = realT; }
}
/** Does the sim speak the M1.1 InputFrame (light/heavy/dodge/dash/special/skillBar)? Detected from API.md's
 * contract as published in the snapshot (`input_api >= 2`) or the encounter (`enc.inputApi`). */
const simM11 = () => !!snap && 'special_prompt' in snap;
function toSim(f) {
  const out = { move: f.move };
  if (simM11()) {   // M1.1 sim: it owns the Tab cycle (lockOn) and reads heavy as a HELD flag (press/release edges)
    for (const k of ['light', 'special', 'skillBar']) if (f[k]) out[k] = true;
    if (f.evade) { out.evade = true; out.dodge = true; }   // M1.2 'evade' (M1.1 sims read 'dodge')
    if (f.heavy || f.heavyHeld) out.heavy = true;
    // Tab (M1.2 §6): lock the nearest enemy, Tab again unlocks; a horizontal mouse flick while locked switches side
    if (f.lock) out.lockOn = true;   // the M1.2 sim toggles: lock the nearest / unlock
    if (flickSide && snap.locked) { const y = ccam.pose.yaw * Math.PI / 180; out.lockSwitch = { side: flickSide, right: [Math.cos(y), -Math.sin(y)] }; } flickSide = null;
    return out;
  }
  if (f.lock) lockCycle();
  if (camLock && !ent(camLock)?.routed) out.lockId = camLock; else if (camLock) camLock = null;
  // legacy (M1) sim: light/heavy -> the string, dodge/dash -> skitter, Special -> the Pile-On while one is offered,
  // skill bar -> Slow Blink
  if (f.light || f.heavy) out.attack = true;
  if (f.evade || f.dodge || f.dash) out.skitter = true;
  if (f.special && snap.pile_on_offer) out.hiss = true;
  if (f.skillBar) out.slowBlink = true;
  return out;
}

/** Final KO (M1.2 §8): a freeze frame over an impact background (≈ 0.4 s), then slow motion (≈ 1.1 s) on a
 * slowly turning two-shot of the KO'd cat and its attacker, with the giant K.O.! — ≈ 1.5 s, flash-safe. */
function startKO(id, byId, freezeMs = 400, slow = { scale: 0.25, ms: 1100 }) {
  const f = F(id); if (!f) return;
  const a = F(byId) || F(snap.controlled);
  ko = { f, a, t0: realT, mean: measureMean(), freeze: (freezeMs || 400) / 1000, slowS: Math.min(1.5, (slow && slow.ms || 1100) / 1000), slowK: (slow && slow.scale) || 0.25 };
  const koLen = ko.freeze + ko.slowS;
  ccam.stagger = { T: f, C: a || f, from: realT, until: realT + koLen, full: true, spin: 0.3, close: 0.75 };
  scr.word = null; scr.fx = scr.fx.filter((x) => x.kind === 'dmg'); scr.add({ kind: 'ko', dur: koLen, delay: 0.1 });
  quiet = { id, until: realT + koLen }; hud.showChrome(false); fx.clearNear(f.pos, 4); impact = null; dip = null; ccam.shakes = []; ccam.punch = null; pendingCard = null;
}
/** The enemy the F prompt points at: a staggered enemy while Mikan's Special is ready (M1 sim: the offered Pile-On). */
function specialTarget(s) {
  if (s.special_prompt) return s.special_prompt.ready ? s.special_prompt.target : null;
  if (simM11()) { const m = s.entities.find((e) => e.id === s.controlled); const st = s.entities.find((e) => e.side === 'enemy' && (e.staggered_s > 0 || e.frazzled_s > 0)); return m && st && (m.special ?? 0) >= 100 ? st.id : null; }
  return s.pile_on_offer ? s.pile_on_offer.targetId : null;
}
function startSpecialChain() {
  if (cin.holding || chainPending) return;
  const offer = snap.pile_on_offer, tgt = offer ? ent(offer.targetId) : null;
  const order = snap.entities.filter((e) => e.side === 'posse' && e.present && !e.routed).sort((a, b) => (b.controlled - a.controlled) || a.slot - b.slot)
    .filter((e) => !tgt || e.controlled || Math.hypot(e.pos[0] - tgt.pos[0], e.pos[2] - tgt.pos[2]) < 7.5);
  const cats = order.map((e) => ({ id: e.id, catId: e.cat, name: e.name, f: F(e.id), special: ((DATA.cats[e.cat] && DATA.cats[e.cat].special_name) || SPECIAL_BY_STYLE[e.style] || '').toUpperCase() })).filter((c) => c.f);
  if (!cats.length) return;
  chainPending = true; hud.showChrome(false);
  cin.startChain(cats, measureMean(), realT, () => { chainPending = false; chainFired = true; ccam.blend(0.2); });
}

/* ---------------------------------------------------------------- sim tick */
function tick() {
  let inp;
  if (injectQ.length) inp = injectQ.shift();
  else if (script) inp = script(enc, enc.tick) || {};
  else if (driveInp) inp = { ...driveInp };
  else inp = toSim(input.frame(ccam.pose.yaw, input._pad));
  if (cmdQueue.length && snap.slow_blink) { const c = cmdQueue.shift(); if (c.command) inp.command = c.command; if (c.slowBlink) inp.slowBlink = true; }
  else if (cmdQueue.length && cmdQueue[0].slowBlink) { cmdQueue.shift(); inp.slowBlink = true; }
  // Special (F on a staggered enemy): the cut-in chain plays first with the sim held (time stop), then the Team
  // finisher fires. On the M1 sim the finisher is its Pile-On (offered on a Frazzled target), so the chain wraps it.
  if (inp.hiss && snap.pile_on_offer && !chainFired && !simM11()) { delete inp.hiss; startSpecialChain(); }
  if (chainFired) { inp.hiss = true; chainFired = false; }
  prevSnap = snap;
  const evs = enc.step(inp);
  snap = normSnap(enc.snapshot());
  if (simM11()) camLock = snap.locked ? snap.lock : null;
  for (const ev of evs) onEvent(ev);
}

/** M1.1 snapshot aliases for the presentation (skill bar = the old Slow Blink grade/menu; stagger = Frazzle). */
function normSnap(s) {
  if ('skill_bar' in s) s.slow_blink = s.skill_bar;
  for (const e of s.entities) { if (e.staggered_s != null) e.frazzled_s = e.staggered_s; if (e.stagger != null && e.frazzle == null) e.frazzle = e.stagger; }
  return s;
}

/** Interpolated entity for rendering. */
function lerpEnt(e, a) {
  const p = prevSnap && prevSnap.entities.find((x) => x.id === e.id);
  if (!p || a >= 1) return e;
  return { ...e, pos: [p.pos[0] + (e.pos[0] - p.pos[0]) * a, p.pos[1] + (e.pos[1] - p.pos[1]) * a, p.pos[2] + (e.pos[2] - p.pos[2]) * a],
    facing: [p.facing[0] + (e.facing[0] - p.facing[0]) * a, p.facing[1] + (e.facing[1] - p.facing[1]) * a] };
}

/* ---------------------------------------------------------------- one rendered frame of real time */
function frame(dt) {
  realT += dt; input.now = realT;
  if (!opt.test) input._pad = input.pollPad();
  const look = input.takeLook(dt); if (driveYaw) look[0] += driveYaw * dt;
  if (snap.locked && !snap.slow_blink) {
    // locked: no free yaw; a flick past ~12° of mouse travel within 0.3 s picks the next enemy on that side
    flickAcc = realT - flickT > 0.3 ? look[0] : flickAcc + look[0]; if (look[0]) flickT = realT;
    if (Math.abs(flickAcc) > 12) { pickSide(flickAcc < 0 ? 1 : -1); flickAcc = 0; }
    ccam.userOrbit(0, look[1], realT);
  } else ccam.userOrbit(look[0], look[1], realT);
  input.skillBarOpen = !!snap.slow_blink;
  const menu = input.takeMenu();
  if (menu.includes('pause')) { paused = !paused; hud.setHint(paused ? 'Paused · P / Esc to resume' : ''); }
  const cut = cin.update(realT);
  let rate = paused || (cin.holding && !simM11()) ? 0 : 1;
  const koU = ko ? realT - ko.t0 : null;
  if (ko && koU < ko.freeze) rate = 0; else if (ko && koU < ko.freeze + ko.slowS) rate = Math.min(rate, ko.slowK);
  if (dip && realT >= dip.from && realT < dip.to) { const k = (dip.to - realT) < 0.1 ? 1 - (dip.to - realT) / 0.1 : 0; rate = dip.scale + (1 - dip.scale) * k; }
  if (dip && realT >= dip.to) dip = null;
  if (enc.mode !== 'ended' || prevSnap !== snap) {
    acc += dt * rate; let n = 0;
    while (acc >= DT - 1e-9 && n < 5) { acc -= DT; if (enc.mode === 'ended') { prevSnap = snap; break; } tick(); n++; }
    if (n >= 5) acc = 0;
  }
  present(dt, Math.min(1, acc / DT), menu, cut);
}

function present(dt, alpha, menu = [], cut = null) {
  const s = snap, tw = Math.floor(realT * 30 + 1e-6) / 30;
  const globalStop = s.time_scale === 0;
  // triangle budget (0.5 M): besides the controlled cat (full), at most the 2 nearest cats may take the full mesh
  { const others = [...fighters.values()].filter((f) => f.id !== s.controlled && f.root.visible).sort((a, b) => a.pos.distanceToSquared(cam.position) - b.pos.distanceToSquared(cam.position));
    others.forEach((f, i) => { f.lodCap = i < 2 ? 'auto' : 'low'; }); }
  // fighters
  const Cf = F(s.controlled), C0d = Cf ? Math.hypot(Cf.pos.x - cam.position.x, Cf.pos.z - cam.position.z) : null;
  for (const e of s.entities) {
    const f = F(e.id); if (!f) continue;
    const prevE = prevSnap && prevSnap.entities.find((x) => x.id === e.id);
    const frozen = globalStop || (prevE && prevE.anim === e.anim && prevE.anim_t === e.anim_t && e.anim !== 'idle' && e.anim !== 'run');
    const hidden = (pile && pile.phase === 'main' && pile.cats.concat([pile.target]).includes(e.id));
    // camera-soft cats: an AI cat crowding the lens (closer than 1.5 m, nearer than the controlled cat) is hidden
    const dc = Math.hypot(f.pos.x - cam.position.x, f.pos.z - cam.position.z);
    // hysteresis + a 0.6 s hold, so a cat at the lens edge never blinks in and out (a large-area flash, DR-50)
    const want = !e.controlled && C0d != null && (f.crowd ? dc < 3.3 && dc < C0d : dc < 2.8 && dc < C0d - 0.3);
    if (want !== !!f.crowd && realT - (f.crowdT || -9) > 0.6) { f.crowd = want; f.crowdT = realT; }
    const crowd = !!f.crowd && !e.controlled;
    // stagger framing: any other cat between the lens and the staggered cat is hidden for the moment
    let blocker = false;
    if (ccam.stagger && realT < ccam.stagger.until && e.id !== ccam.stagger.T.id && !e.controlled) {
      const T = ccam.stagger.T.pos, cp = cam.position, dT = Math.hypot(T.x - cp.x, T.z - cp.z);
      const ux = (T.x - cp.x) / dT, uz = (T.z - cp.z) / dT, vx = f.pos.x - cp.x, vz = f.pos.z - cp.z, along = vx * ux + vz * uz;
      blocker = along > 0 && along < dT + 0.3 && Math.abs(vx * uz - vz * ux) < 0.9 * Math.max(1, f.scaleK);
    }
    f.hidden = hidden;
    f.fadeTarget = crowd || blocker ? 0.3 : 1; f.stepFade(dt);   // dither-fade, never hidden (M1.2 §6)
    // nearest standing opponent (for intent reading and squaring off)
    const le = lerpEnt(e, alpha);   // every cat, the controlled one included, interpolates between ticks (no 60 Hz stepping / ghosting on high-refresh displays)
    if (!e.controlled && !e.routed && e.present) {
      let bo = null, bd = 1e9;
      for (const o of s.entities) { if (!o.present || o.routed || (o.side === 'enemy') === (e.side === 'enemy')) continue; const d = Math.hypot(o.pos[0] - e.pos[0], o.pos[2] - e.pos[2]); if (d < bd) { bd = d; bo = o; } }
      if (bo && bd > 1e-3) { le._opp = { dir: [(bo.pos[0] - e.pos[0]) / bd, (bo.pos[2] - e.pos[2]) / bd], dist: bd }; le._side = (e.id.charCodeAt(0) + e.id.length) % 2 ? 1 : -1; }
    }
    const koFreeze = ko && realT - ko.t0 < ko.freeze;
    f.update(le, cut && cut.id === e.id ? dt : (frozen || koFreeze) ? 0 : dt * (s.slow_blink ? 0.05 : 1) * (ko ? 0.25 : 1), realT, tw, dt);
    // posturing cats hiss and lash (a hiss glyph every ~1.6 s, staggered per cat); dash-ins leave a streak
    if (!skipDraw && f.root.visible && (f.intent === 'posture' || f.intent === 'strut') && e.side === 'enemy' && (!f.hissT || realT - f.hissT > 1.6 + (e.id.length % 3) * 0.4)) {
      f.hissT = realT; fx.spawn('hiss', f.head.clone().add(new THREE.Vector3(le._opp.dir[0] * 0.3, -0.04, le._opp.dir[1] * 0.3)), { size: 0.32, drawings: 4, breakAt: 0.7 });
      fx.spawn('claws', f.pos.clone().add(new THREE.Vector3(-le._opp.dir[0] * 0.45, 0.35, -le._opp.dir[1] * 0.45)), { size: 0.22, drawings: 3, rot: 1.2 });
    }
    if (!skipDraw && f.root.visible && f.intent === 'dash_in' && (!f.dashT || realT - f.dashT > 0.35)) { f.dashT = realT; scr.add({ kind: 'streak', from: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)).addScaledVector(f.vel, -0.25), to: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)), dur: 0.2, seed: 2, len: 110 }); }
    // routed bolt: a three-puff trail of shrinking clouds
    if (e.anim === 'routed' && routedTrail.has(e.id) && realT - routedTrail.get(e.id) > 0.12 && !(ko && ko.f === f)) { routedTrail.set(e.id, realT); fx.spawn('puffSmall', f.pos.clone().add(new THREE.Vector3(0, 0.12, 0)), { size: 0.3, drawings: 6 }); }
    // Frazzled: spiral eyes (two spiral glyphs over the face when it turns toward the camera)
    if (e.frazzled_s > 0 && f.root.visible && !skipDraw) {
      const toCam = new THREE.Vector3(cam.position.x - f.pos.x, 0, cam.position.z - f.pos.z).normalize();
      const facing = e.facing[0] * toCam.x + e.facing[1] * toCam.z;
      if (facing > 0.35 && (!f.spiralT || realT - f.spiralT > 2 / 30 - 1e-6)) {
        f.spiralT = realT;
        const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
        for (const sg of [-1, 1]) fx.spawn('spiral', f.head.clone().add(new THREE.Vector3(e.facing[0] * 0.14 * f.scaleK, -0.11 * f.scaleK, e.facing[1] * 0.14 * f.scaleK)).addScaledVector(right, sg * 0.075 * f.scaleK), { size: 0.12 * f.scaleK, drawings: 1, rot: (Math.floor(realT * 15) % 4) * 1.57 * sg, breakAt: 9, order: 4 });
      }
    }
    // Fired Up (anger or a status): steam puffs rising off the head, on twos
    const fired = (e.status && e.status.kind === 'fired_up') || (e.anger_fired_up && e.anger_fired_up.active);
    if (fired && f.root.visible && (!f.steamT || realT - f.steamT > 0.45)) {
      f.steamT = realT; const sg = (Math.floor(realT / 0.45) % 2) ? 1 : -1;
      const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
      fx.spawn('puffSmall', f.head.clone().addScaledVector(right, sg * 0.22 * f.scaleK).add(new THREE.Vector3(0, 0.08, 0)), { size: 0.16 * f.scaleK, drawings: 8, vel: new THREE.Vector3(0, 0.5, 0), grow: 0.3, order: 4 });
    }
    if (e.controlled && f.root.visible) f.cat.lookAt(s.lock && F(s.lock) ? F(s.lock).head : null);
  }
  // camera-soft ring dressing: a prop crowding the lens is hidden outright (never half-transparent)
  if (world.dress) for (const m of world.dress.children) {   // camera-soft ring dressing dither-fades (never hidden)
    if (!m.userData.dith) { m.material = m.material.clone(); patchEnvDither(m.material); m.userData.dith = true; }
    const d = Math.hypot(m.position.x - cam.position.x, m.position.z - cam.position.z), want = d < 1.7 ? 0.3 : d < 2.4 ? 0.3 + (d - 1.7) / 0.7 * 0.7 : 1;
    m.material.uniforms.uFade.value = Math.round(want * 8) / 8;
  }
  // tag window opening: a bell-gold spark ring on the controlled cat
  lastTagWindow = s.tag_window;
  // camera
  const lockId = camLock || (script && !simM11() ? s.lock : null);   // bots play locked; the player starts free
  const C = F(s.controlled), T = lockId && F(lockId) && F(lockId).root.visible ? F(lockId) : null;
  const foes = s.entities.filter((e) => e.side === 'enemy' && e.present && !e.routed);
  const cen = foes.length ? foes.reduce((a, e) => a.add(v3(e.pos)), new THREE.Vector3()).divideScalar(foes.length) : null;
  let offFrame = false;
  if (T && C) { const a = project(T.head), b = project(C.pos); offFrame = Math.abs(a.nx) > 0.6 || Math.abs(b.nx) > 0.8 || b.ny < -0.75 || a.ny > 0.75; }
  const standoffK = s.mode === 'standoff' ? Math.min(1, s.t / 3) : 0;
  ccam.update(dt, realT, { free: !T, C: C ? C.pos.clone() : new THREE.Vector3(), T: T ? T.pos.clone() : null, enemiesCentroid: cen, aspect: cam.aspect, slowBlink: s.slow_blink,
    highRoad: C && T && Math.abs(C.pos.y - T.pos.y) > 0.6, mode: pile && pile.phase === 'main' ? 'pileon' : s.mode, pileCenter: pile ? pile.centerW : null,
    standoffFocus, standoffK, offFrame, globalStop, targetNY: T ? project(T.head).ny : null, clearance, occluded: C ? (pose) => occludedAt(pose, [C.head, T ? T.head : null]) : null });
  // impact frame state
  let impactMode = null;
  if (impact) {
    const u = (realT - impact.start) * 60;
    if (u >= 0 && u < impact.inv) impactMode = 'inv';
    else if (u >= impact.inv && u < impact.inv + 2) { if (!impact.flashed) { impact.flashed = true; fx.spawn('burstPlain', impact.at, { size: Math.min(2.2, fx.fit(impact.at, 0.4)), drawings: 1, cycle: false, flat: new THREE.Vector4(1, 0.965, 0.89, 1), breakAt: 9, order: 4 }); } }
    else if (u >= impact.inv + 2) impact = null;
  }
  // world FX
  fx.update(dt, tw, s, fighters, s.controlled, quiet && realT < quiet.until ? quiet.id : null);
  // Pile-On set-piece clock
  if (pile) {
    pile.t += dt; if (pile.beatT != null) pile.beatT += dt;
    // Team finisher (M1.1): the sim sends no per-cat beats, so each chained cat gets one beat across the cloud's run
    if (pile.team && pile.phase === 'main') {
      const n = pile.cats.length, bi = Math.min(n - 1, Math.floor(pile.t / (pile.dur * 0.85 / n)));
      if (bi !== pile.beatIdx) { pile.beatIdx = bi; const e = ent(pile.cats[bi]); if (e) onEvent({ type: 'PileOnBeat', cat: e.id, beat: bi + 1, of: n, style: e.style, flourish: e.personality, feel: { shake: { peak_pct: 0.7, steps: 4, step_ms: 33, decay: 0.6 } } }); }
    }
    if (pile.phase === 'out') { pile.outT += dt; if (pile.outT > 0.42) { pile = null; hudBackAt = realT + (scr.word ? Math.max(0, scr.word.ms / 1000 - scr.word.t) : 0); } }
  }
  if (ko) { if (realT - ko.t0 < ko.freeze + ko.slowS + 0.05) hud.showChrome(false); else if (!ko.back) { ko.back = true; hud.showChrome(true); } }
  // the giant T5 word plays only while the HUD is hidden (HUD §4.1): the chrome returns after it
  if (hudBackAt != null && realT >= hudBackAt) { hudBackAt = null; hud.showChrome(true); }
  // screen layer
  const w = app.clientWidth, h = app.clientHeight;
  const cb = C ? (() => { const a = project(C.pos), b = project(C.head); const hh = Math.max(40, a.y - b.y) * 1.5; return { x: a.x - hh * 0.8, y: b.y - hh * 0.4, w: hh * 1.6, h: hh * 1.4 }; })() : { x: 0, y: 0, w: 0, h: 0 };
  const overheads = s.telegraphs.map((tl) => { const f = F(tl.attacker); return f ? { at: f.head.clone().add(new THREE.Vector3(0, 0.12 * f.scaleK, 0)), cls: tl.cls } : null; }).filter(Boolean);
  for (const [id, until] of crackedUntil) { if (realT > until) crackedUntil.delete(id); else { const f = F(id); if (f) overheads.push({ at: f.head.clone().add(new THREE.Vector3(0, 0.12 * f.scaleK, 0)), cls: 'yellow', cracked: true }); } }
  const arrows = [];
  if (s.mode === 'fight' && !s.slow_blink) for (const e of s.entities) {
    if (!e.present || e.routed || e.controlled) continue;
    const attacking = s.telegraphs.some((tl) => tl.attacker === e.id);
    if (e.side === 'enemy' && !attacking) continue;
    const f = F(e.id); if (!f || !f.root.visible) continue;
    const p = project(f.head);
    if (p.on && p.x > 30 && p.x < w - 30 && p.y > 30 && p.y < h - 30) continue;
    const ang = Math.atan2(p.ny * (pv.z > 1 ? -1 : 1), p.nx * (pv.z > 1 ? -1 : 1));
    const ex = w / 2 + Math.cos(ang) * w, ey = h / 2 - Math.sin(ang) * h;
    arrows.push({ x: ex, y: ey, ex: Math.min(w - 40, Math.max(40, ex)), ey: Math.min(h - 40, Math.max(40, ey)), color: e.side === 'enemy' ? Kit.C.magenta : Kit.C.gold });
  }
  let pileCtx = null;
  if (pile) {
    if (!pile.anchor) pile.anchor = project(pile.centerW.clone().add(new THREE.Vector3(0, 0.35, 0)));   // fixed for the set-piece
    const c = pile.phase === 'out' ? pile.screen : pile.anchor;
    pileCtx = { ...pile, center: { x: Math.min(w * 0.7, Math.max(w * 0.3, c.x)), y: Math.min(h * 0.62, Math.max(h * 0.4, c.y)) } };
  }
  scr.update(dt, { skip: skipDraw, w, h, project, controlledBox: cb, hudRects: opt.hud && !skipDraw ? hud.rects() : [], pile: pileCtx, tw, overheads, arrows });
  // HUD
  if (skipDraw) pendingMenu.push(...menu);
  else if (opt.hud) {
    hud.update({ device: input.lastDevice, quietId: quiet && realT < quiet.until ? quiet.id : null, lockId: camLock, cinematic: cin.holding || !!pile, specialTarget: specialTarget(s), s, t: realT, project, fighters, menuEvents: pendingMenu.splice(0).concat(menu), send: (c) => cmdQueue.push(c) });
    if (pendingCard && realT >= pendingCard.at) { hud.card(pendingCard.text, pendingCard.sub, 1e6, realT, pendingCard.clowder); pendingCard = null; }
    hud.tickCard(realT);
  }
  renderer.domElement.style.filter = s.slow_blink ? 'saturate(0.7) brightness(0.9)' : '';
  // paint post under camera motion (M1.2 §6): the edge wobble is screen-anchored, so while the view turns or
  // travels the world would swim under it; it eases down with camera speed and back up at rest
  { const cp = cam.position, q = camPrev || (camPrev = { p: cp.clone(), yaw: ccam.pose.yaw });
    const speed = dt > 0 ? (cp.distanceTo(q.p) * 6 + Math.abs(ccam.pose.yaw - q.yaw) * 0.12) / dt : 0;
    const want = 1.8 * Math.max(0.25, 1 - Math.min(1, speed / 6));
    const u = post.mat.uniforms.wob; u.value += (want - u.value) * Math.min(1, dt * 10);
    q.p.copy(cp); q.yaw = ccam.pose.yaw; }
  if (!skipDraw) draw(impactMode, s, cut);
}

/** Distance the camera may sit at from `pivot` along `dir` before camera-solid geometry (minus 0.2 m). */
const ray2 = new THREE.Ray(), hit2 = new THREE.Vector3();
function clearance(pivot, dir, want) {
  ray2.set(pivot, dir); let best = want;
  for (const b of world.colliders) { if (b.soft) continue; if (b.containsPoint(pivot)) continue; if (ray2.intersectBox(b, hit2)) { const d = hit2.distanceTo(pivot) - 0.2; if (d < best) best = d; } }
  return best;
}
/** Does camera-solid geometry hide any of `pts` from the camera at `pose`? */
const ray = new THREE.Ray(), hitP = new THREE.Vector3(), camP = new THREE.Vector3();
function occludedAt(pose, pts) {
  const y = pose.yaw * Math.PI / 180, pi = pose.pitch * Math.PI / 180;
  camP.set(pose.px + Math.sin(y) * Math.cos(pi) * pose.dist, pose.py + Math.sin(pi) * pose.dist, pose.pz + Math.cos(y) * Math.cos(pi) * pose.dist);
  for (const p of pts) {
    if (!p) continue;
    const d = p.clone().sub(camP), L = d.length(); ray.set(camP, d.divideScalar(L));
    for (const b of world.colliders) { if (b.soft || b.max.y > 4) continue; if (ray.intersectBox(b, hitP) && hitP.distanceTo(camP) < L - 0.15) return true; }
  }
  return false;
}

function patchEnvDither(m) {
  m.uniforms.uFade = { value: 1 };
  const src = m.fragmentShader, k = src.lastIndexOf('void main'), open = src.indexOf('{', k) + 1;
  m.fragmentShader = src.slice(0, k) + 'uniform float uFade; float ditherB4e(vec2 p){ ivec2 i = ivec2(mod(p, 4.0)); int b[16] = int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(b[i.y * 4 + i.x]) + 0.5) / 16.0; }\n'
    + src.slice(k, open) + ' if (uFade < 0.999 && ditherB4e(gl_FragCoord.xy) > uFade) discard; ' + src.slice(open);
  m.needsUpdate = true;
}

/* ---------------------------------------------------------------- render */
function draw(impactMode, s, cut = null) {
  renderer.info.reset();
  shadow.update(renderer, [envScene, lateScene], world.casters); renderer.info.reset();
  const R = world.rings;
  for (const k of ['sky', 'ringFar', 'sea', 'clouds']) R[k].position.copy(cam.position);
  R.ringNear.position.set(cam.position.x * 0.85, cam.position.y, cam.position.z * 0.85);
  U.time.value = realT;
  cam.updateMatrixWorld();
  if (impactMode === 'inv') {
    // drawing 1 of the impact frame: background flattened to one mid tone matched to the frame's mean
    // luminance, figures as Ink silhouettes with Cream lines; effect shapes keep their colours
    renderer.setRenderTarget(null); renderer.setClearColor(midTone, 1); renderer.clear();
    world.late.visible = false; for (const f of fighters.values()) f.setLook('ink');
    renderer.autoClear = false; renderer.render(lateScene, cam); renderer.render(fxScene, cam); renderer.autoClear = true;
    world.late.visible = true; for (const f of fighters.values()) f.setLook('normal');
  } else {
    if (opt.post) { renderer.setRenderTarget(post.rt); renderer.clear(); renderer.render(envScene, cam); post.render(renderer); }
    else { renderer.setRenderTarget(null); renderer.clear(); renderer.render(envScene, cam); }
    renderer.autoClear = false;
    renderer.render(lateScene, cam);
    renderer.render(fxScene, cam);
    renderer.render(decalScene, cam);
    // the controlled cat is never covered by effects: draw it again on top (art bible §10.1 rule 5)
    // (only when an effect is actually near it, and only its fill + ink: the keyline shells stay underneath)
    const cf = F(s.controlled);
    const near = cf && cf.root.visible && fx.items.some((it) => !it.ground && it.mesh.visible && it.mesh.position.distanceTo(cf.pos) < 1.6);
    if (near) {
      const vis = []; for (const c of lateScene.children) { vis.push(c.visible); c.visible = false; }
      fGroup.visible = true; const fv = []; for (const c of fGroup.children) { fv.push(c.visible); c.visible = c === cf.root; }
      const shells = []; cf.root.traverse((o) => { if (o.name && o.name.startsWith('keyline-')) { shells.push([o, o.visible]); o.visible = false; } });
      renderer.render(lateScene, cam);
      shells.forEach(([o, v]) => { o.visible = v; });
      lateScene.children.forEach((c, i) => { c.visible = vis[i]; }); fGroup.children.forEach((c, i) => { c.visible = fv[i]; });
    }
    renderer.autoClear = true;
  }
  if (cut) cin.render(cut, realT);
  else if (ko && realT - ko.t0 < ko.freeze) cin.renderKO(ko, realT, cam);
  lastStats = { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
}

/* ---------------------------------------------------------------- boot */
async function boot() {
  const [tex, spr] = await Promise.all([loadTextures(), bakeSprites(256), loadCatAssets('')]);
  sprites = spr;
  enc = createEncounter(opt.fight, { seed: opt.seed, showcase: true, reduceFlashes: opt.reduceFlashes, motionScale: opt.motion });
  snap = normSnap(enc.snapshot()); prevSnap = snap;
  world = buildArena(snap.arena, snap.props, tex); world.tex = tex;
  envScene.add(world.env, world.backdrop); lateScene.add(world.late);
  shadow = new SunShadow(2048, 21); post = new PaintPost(tex.grain); U.grainMap.value = tex.grain;
  keyLight = new THREE.DirectionalLight('#ffffff', 2.5); fillLight = new THREE.AmbientLight('#6E6AA8', 0.8); lateScene.add(keyLight, fillLight);
  for (const e of snap.entities) { const f = new Fighter(e, { rim: Q.get('rim') !== '0' }); fighters.set(e.id, f); fGroup.add(f.root); }
  fx = new WorldFX(spr, fxScene, decalScene); fx.cam = cam;
  cin = new Cinematics({ renderer, cam, scr: null, lateScene, fGroup });
  scr = new ScreenFX(app); cin.scr = scr;
  hud = new CombatHUD(app, DATA); if (!opt.hud) hud.el.style.display = 'none';
  // deterministic captures step frames faster than wall-clock CSS transitions: snap them in test mode
  if (opt.test) { const st = document.createElement('style'); st.textContent = '.ch, .ch * { transition: none !important; animation: none !important; }'; document.head.appendChild(st); }
  try { await Promise.all(["400 64px 'Dela Gothic One'", "800 32px 'M PLUS Rounded 1c'", "700 32px 'M PLUS Rounded 1c'"].map((f) => document.fonts.load(f))); } catch (e) { /* fonts optional */ }
  hud.setup(snap); hud.catOf = (id) => (snap.entities.find((e) => e.id === id) || {}).cat || id;
  ccam = new CombatCamera(cam);
  input = new CombatInput(renderer.domElement, { braceToggle: Q.get('brace') === 'toggle' });
  // ?script=demo: a presentation-side player bot for the M1.1 controls (Mikan only): locks on, plays L-L-L-H
  // strings with steering, dodges telegraphs aimed at her, presses F (Special) whenever the prompt is ready
  const demoBot = () => { let n = 0, holdH = 0; return () => {
    const s = snap; if (s.mode !== 'fight') return {};
    const c = s.entities.find((e) => e.controlled); if (!c) return {};
    const foes = s.entities.filter((e) => e.side === 'enemy' && e.present && !e.routed); if (!foes.length) return {};
    const out = {};
    if (!s.locked) out.lockOn = (n++ % 30) === 0;
    if (s.special_prompt && s.special_prompt.ready) return { ...out, special: true };
    // meter full: go for a staggered enemy (the Special needs one in range)
    const stag = c.special_ready && foes.find((e) => (e.staggered_s || 0) > 0);
    if (stag) return { ...out, move: [stag.pos[0] - c.pos[0], stag.pos[2] - c.pos[2]], dash: n++ % 40 === 0 };
    const t = foes.find((e) => e.id === s.lock) || foes.sort((a, b) => Math.hypot(a.pos[0] - c.pos[0], a.pos[2] - c.pos[2]) - Math.hypot(b.pos[0] - c.pos[0], b.pos[2] - c.pos[2]))[0];
    const tl = s.telegraphs.find((x) => x.aimed_at === c.id && x.dur - x.t < 0.22);
    if (tl && !(c.evade_cd_s > 0)) return { ...out, dodge: true, evade: true, move: [c.pos[0] - t.pos[0], c.pos[2] - t.pos[2]] };
    const d = Math.hypot(t.pos[0] - c.pos[0], t.pos[2] - c.pos[2]);
    if (d > 1.3) return { ...out, move: [t.pos[0] - c.pos[0], t.pos[2] - c.pos[2]], dash: d > 3.5 && n % 90 === 0 };
    n++;
    const ph = n % 40;   // a press every ~10 ticks: L L L then H (the finisher)
    if (ph === 0 || ph === 10 || ph === 20) return { ...out, light: true };
    if (ph >= 30 && ph < 33) { holdH = 1; return { ...out, heavy: true }; }
    holdH = 0; return out;
  }; };
  const bots = { demo: () => demoBot(), bot: () => withCommandQueue(skilledBot()), median: () => withCommandQueue(medianBot()), daifuku: () => withCommandQueue(daifukuBot()), passive: () => passiveBot() };
  if (bots[opt.script]) script = bots[opt.script]();
  layout(); setPhase(opt.phase);
  // start the camera on the Posse, looking down the ring at the opponents
  const C0 = F(snap.controlled);
  Object.assign(ccam.pose, { px: C0.pos.x, py: 0.5, pz: C0.pos.z - 1, yaw: 0, pitch: 18, dist: 6.5, shoulder: 0 });
  addEventListener('resize', layout);
  window.__cat = {
    state: () => ({ fight: opt.fight, seed: opt.seed, tick: enc.tick, realT: +realT.toFixed(4), mode: snap.mode, outcome: snap.outcome, slow_blink: snap.slow_blink, controlled: snap.controlled,
      counts: { ...counts }, pile: !!pile, impact: !!impact, camera: cam.position.toArray().map((v) => +v.toFixed(3)), yaw: +ccam.pose.yaw.toFixed(2), stats: { ...lastStats } }),
    hash: () => enc.hash(),
    latency: () => latencyLog.slice(),
    debug: () => ({ screen: scr.fx.map((f) => ({ kind: f.kind, t: +f.t.toFixed(3), dur: f.dur, from: f.from && project(f.from), to: f.to && project(f.to) })), word: scr.word && scr.word.text, world: fx.items.length, cats: [...fighters.values()].map((f) => ({ id: f.id, intent: f.intent, vis: f.root.visible, lod: f.cat.lod, tri: f.cat.triangles, d: +f.pos.distanceTo(cam.position).toFixed(2) })) }),
    snapshot: () => snap,
    /** Advance n rendered frames of 1/60 s (deterministic), drawing only the last unless every = true. */
    frames: (n = 1, every = false) => { for (let i = 0; i < n; i++) { skipDraw = !every && i < n - 1; frame(DT); } skipDraw = false; return window.__cat.state(); },
    /** Run until an event of `type` (count index `nth`, 0-based over the whole run) has been emitted, or max frames. */
    until: (type, max = 6000, nth = 0) => { skipDraw = true; for (let i = 0; i < max; i++) { if ((counts[type] || 0) > nth) { skipDraw = false; present(0, 1); return { ok: true, ...window.__cat.state() }; } if (snap.mode === 'ended' && i > 0 && prevSnap === snap) break; frame(DT); } skipDraw = false; return { ok: (counts[type] || 0) > nth, ...window.__cat.state() }; },
    /** Advance (undrawn) until pred(snapshot, events) is true or max frames; then draw once. */
    untilWhere: (pred, max = 3000) => { skipDraw = true; let ok = false; for (let i = 0; i < max; i++) { if (pred(snap, evLog)) { ok = true; break; } frame(DT); } skipDraw = false; present(0, 1); return { ok, ...window.__cat.state() }; },
    inject: (inp) => { injectQ.push(inp); },
    /** Camera-pan / ghosting capture: hold a sim input and turn the camera at yawDegPerS, stepping `n` frames of `dt`
     * (1/120 = a 120 Hz display); returns the controlled cat's screen x/y per frame. */
    drive: ({ move = [0, -1], yaw = 0, n = 60, dt = 1 / 120, draw = false } = {}) => {
      driveInp = { move }; driveYaw = yaw; const out = [];
      for (let i = 0; i < n; i++) { skipDraw = !draw; frame(dt); const f = F(snap.controlled); const p = project(f.pos.clone().add(new THREE.Vector3(0, 0.3, 0))); out.push([+p.x.toFixed(2), +p.y.toFixed(2), +ccam.pose.yaw.toFixed(3)]); }
      skipDraw = false; driveInp = null; driveYaw = 0; return out;
    },
    postWob: () => post.mat.uniforms.wob.value,
    scriptOn: (on) => { if (!on) { window.__cat._script = script; script = null; } else if (window.__cat._script) script = window.__cat._script; },
    menu: (m) => { input.menu.push(m); },
    events: (type) => evLog.filter((e) => !type || e.type === type).map((e) => ({ type: e.type, user: e.user || e.cat, move: e.move, tick: e.tick, t: e.t, tier: e.feel ? e.feel.tier : null, impact: e.feel ? e.feel.impact : null })),
  };
  if (Q.get('sheet') === '1') {
    const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;background:#B9AC93;display:flex;flex-wrap:wrap;gap:6px;padding:8px;z-index:9;overflow:auto';
    for (const [k, list] of Object.entries(spr)) for (const t of list) { const c = t.image; c.style.cssText = 'width:150px;height:150px;background:#C9BFA8'; c.title = k; d.appendChild(c); }
    document.body.appendChild(d);
  }
  if (opt.test) {
    frame(DT); frame(DT);
    window.__ready = true;
    return;
  }
  input.bind();
  addEventListener('keydown', (e) => { if (e.code === 'KeyN') { opt.dmg = !opt.dmg; hud.setHint(opt.dmg ? 'Damage numbers on (N)' : 'Damage numbers off (N)'); } });
  chapterPill();
  hud.setHint(script ? 'Demo: a bot is playing · reload without ?script to fight yourself' : 'Click to capture the mouse · WASD move · LMB light · RMB heavy (hold) · Space evade · Tab lock / unlock (flick the mouse to switch) · F Special · R skills · N damage numbers · P pause');
  let last = performance.now(), first = true;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    frame(dt);
    if (first) { first = false; window.__ready = true; }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
boot().catch((e) => { console.error(e); });

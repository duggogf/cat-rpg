// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// M1 combat sandbox (-> dist/combat.html): the deterministic sim (src/sim/combat) driven at a fixed 60 Hz,
// rendered from snapshot() with interpolation in the M0 painted look, with the combat camera, inked VFX
// on twos, the screen layer (lines, lettering, Pile-On set-piece) and the kit-CSS HUD.
// Query params:
//   ?fight=toughs3|captain|daifuku|sandbox|challenger|lose   (encounter; default toughs3)
//   ?seed=N  ?phase=day|dusk  ?script=bot|median|daifuku|passive (a bot drives the controlled cat; demo/attract)
//   ?test=1 (deterministic: no real-time pacing; window.__cat drives frames)  ?flash=reduce  ?motion=0..1
//   ?res=0.85 (render scale)  ?post=0 (paint post off)  ?hud=0  ?brace=toggle  ?rim=0 (drop the cream rim shell: -1 pass per cat)
import * as THREE from 'three';
import { U, CEL, applyPhase, SunShadow } from '../render/env.js';
import { PHASES, sunDir } from '../render/phases.js';
import { PaintPost } from '../render/post.js';
import { loadCatAssets } from '../render/cats/index.js';
import { createEncounter, DATA } from '../sim/combat/index.js';
import { skilledBot, medianBot, daifukuBot, passiveBot, withCommandQueue } from '../../tests/smoke/combat/bots.mjs';
import { buildArena, spendProp } from '../render/vfx/arena.js';
import { Fighter } from '../render/vfx/fighters.js';
import { bakeSprites, Kit } from '../render/vfx/sprites.js';
import { WorldFX } from '../render/vfx/fx.js';
import { ScreenFX } from '../render/vfx/screen.js';
import { CombatCamera, COMBAT_CAM } from '../camera/combat.js';
import { CombatInput } from '../input/combat-input.js';
import { CombatHUD } from '../ui/combat/hud.js';

const Q = new URLSearchParams(location.search);
const FIGHTS = { toughs3: 'toughs_3', captain: 'captain', daifuku: 'daifuku_bout', sandbox: 'sandbox', challenger: 'challenger', lose: 'lose_to_daifuku', toughs2: 'toughs_2', strays: 'two_strays' };
const opt = {
  fight: FIGHTS[Q.get('fight')] || 'toughs_3', seed: (+Q.get('seed') || 1) >>> 0, phase: PHASES[Q.get('phase')] ? Q.get('phase') : 'day',
  test: Q.get('test') === '1', script: Q.get('script') || '', post: Q.get('post') !== '0', res: +(Q.get('res') || 1), hud: Q.get('hud') !== '0',
  reduceFlashes: Q.get('flash') === 'reduce', motion: Q.has('motion') ? +Q.get('motion') : 1,
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
const DT = 1 / 60, evLog = [], counts = {};
let lastTagWindow = null, routedTrail = new Map(), crackedUntil = new Map(), standoffFocus = null, fightStartT = null, endShown = false, lastStats = {};
let hudBackAt = null, pendingCard = null, seedCounter = 1, skipDraw = false; const pendingMenu = [];

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
  if (feel.word) scr.letter({ cls: feel.word.cls, ms: feel.word.ms, tier: feel.tier, hitType: o.hitType, at: at.clone(), seed: seedCounter++, dir: o.dir, text: o.text });
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
      scr.add({ kind: 'bands', ats: snap.entities.filter((e) => e.side === 'posse').slice(0, 1).map((e) => v3(e.pos).add(new THREE.Vector3(0, 0.35, 0))), dur: ev.duration_s - 0.2, color: Kit.C.gold });
      for (const e of snap.entities) { const f = F(e.id); if (f) f.impulse('hiss', tw, { dur: 0.6 }); }
      break;
    }
    case 'FightStarted': fightStartT = realT; ccam.blend(COMBAT_CAM.enterBlend); break;
    case 'Hit': {
      const fa = F(ev.attacker), ft = F(ev.target); if (!ft) break;
      const ea = ent(ev.attacker), cp = contactPoint(fa, ft), ht = ev.hit_type || hitTypeOf(ea);
      if (fa) fa.impulse('strike', tw, { mag: ev.kind === 'finisher' || (ev.feel && ev.feel.tier >= 3) ? 1.4 : 1 });
      ft.impulse('hurt', tw, { mag: ev.blocked ? 0.4 : Math.min(1.6, 0.6 + (ev.feel?.tier || 0) * 0.25) });
      if (!ev.blocked && (ev.feel?.tier ?? 0) >= 1) ft.flash(tw, 2);
      const facingRot = Math.atan2(cp.dir[1], cp.dir[0]) * 0.5;
      fx.hit(cp.p, ht, ev.feel || { tier: 0, dust: '2 puffs' }, cp.dir, { blocked: ev.blocked, stringIdx: ea ? ea.string_idx : 0, finisher: ev.kind === 'finisher' || ev.kind === 'tag_in', player: ev.authored === 'player', seed: seedCounter++, facingRot });
      applyFeel(ev.feel, cp.p, { dir: screenDir(fa ? fa.pos : cp.p, ft.pos), from: fa ? fa.pos.clone().add(new THREE.Vector3(0, 0.3, 0)) : null, hitType: ht });
      break;
    }
    case 'Whiff': { const fa = F(ev.attacker); if (fa) { fa.impulse('strike', tw, { mag: 0.8 }); fx.spawn('wedge', fa.head.clone().add(new THREE.Vector3(0, -0.2, 0)), { size: 0.3, drawings: 3 }); } break; }
    case 'Skitter': { const f = F(ev.cat); if (f) { fx.dust('2 puffs', f.pos); scr.add({ kind: 'streak', from: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)), to: f.pos.clone().add(new THREE.Vector3(f.vel.x, 0.3, f.vel.z).multiplyScalar(0.3)), dur: 0.2, seed: 1, len: 120 }); } break; }
    case 'Hop': case 'Mantle': case 'HopDown': { const f = F(ev.cat); if (f) fx.dust('2 puffs', f.pos); break; }
    case 'Pounce': { const f = F(ev.cat); if (f) scr.add({ kind: 'streak', from: f.pos.clone().add(new THREE.Vector3(0, 0.3, 0)), to: f.pos.clone().add(new THREE.Vector3(0, 0, 0)), dur: 0.2, seed: 2 }); break; }
    case 'Frazzled': { const f = F(ev.cat); if (f) { f.impulse('take', tw, { dur: 0.25 }); fx.spawn('burstMagenta', f.head.clone(), { size: 0.9, drawings: 4, cycle: false }); } break; }
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
    case 'TagIn': {
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
      routedTrail.set(ev.cat, realT);
      const last = snap.entities.filter((e) => e.side === ev.side && !e.routed && e.present).length === 0;
      if (ev.feel && ev.how !== 'by_pile_on') applyFeel(ev.feel, f.head, { dir: [0, 1], finalRout: last, hitType: 'claw' });
      else if (ev.feel && ev.feel.word && !pile) scr.letter({ cls: ev.feel.word.cls, ms: ev.feel.word.ms, tier: ev.feel.tier, at: f.head.clone(), seed: seedCounter++ });
      break;
    }
    case 'PileOnStart': {
      const t = F(ev.target);
      pile = { t: 0, dur: snap.pile_on ? snap.pile_on.dur : (ev.pile_type === 'full' ? 2.5 : 1.2), type: ev.pile_type, target: ev.target, cats: ev.cats, phase: 'main', beat: 0, beatT: null, beatDx: 0, outT: 0,
        coats: ev.cats.map((id) => { const e = ent(id); const cast = Kit.CAST[{ mikan: 'mikan', hige: 'stalwart', pon: 'goofball', kinako: 'fraidy', togemaru: 'braggart', kagi: 'schemer' }[e?.cat] || 'stalwart']; return cast.coat.patch && id !== 'mikan' ? cast.coat.patch : cast.coat.base; }),
        mikan: ev.cats.includes('mikan'), chevrons: Math.max(0, ev.cats.length - (ev.cats.includes('mikan') ? 1 : 0)), panel: Kit.C.gold,
        bolter: t && t.side === 'enemy' && (ent(ev.target)?.rank !== 'boss') ? { ...Kit.CAST.brooder } : null, centerW: t ? t.pos.clone() : new THREE.Vector3() };
      hud.showChrome(false);
      applyFeel(ev.feel, pile.centerW.clone().add(new THREE.Vector3(0, 0.4, 0)), { noFull: true, text: 'BAP-BAP-BAP!' });
      break;
    }
    case 'PileOnBeat': if (pile) { pile.beat = ev.beat; pile.beatT = 0; pile.beatDx = ((ev.beat * 37) % 7 - 3) / 6; if (ev.feel?.shake) ccam.addShake(ev.feel.shake, realT, [0, 1]); } break;
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
      setTimeout(() => {}, 0);
      pendingCard = { at: realT + 1.1, text: t[0], sub: t[1], clowder: ev.outcome === 'loss' ? 'ink' : 'gold' };
      break;
    }
    default: break;
  }
}

/* ---------------------------------------------------------------- sim tick */
function tick() {
  let inp;
  if (injectQ.length) inp = injectQ.shift();
  else if (script) inp = script(enc, enc.tick) || {};
  else inp = input.frame(ccam.pose.yaw, input._pad);
  if (cmdQueue.length && snap.slow_blink) { const c = cmdQueue.shift(); if (c.command) inp.command = c.command; if (c.slowBlink) inp.slowBlink = true; }
  else if (cmdQueue.length && cmdQueue[0].slowBlink) { cmdQueue.shift(); inp.slowBlink = true; }
  prevSnap = snap;
  const evs = enc.step(inp);
  snap = enc.snapshot();
  for (const ev of evs) onEvent(ev);
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
  const look = input.takeLook(dt); ccam.userOrbit(look[0], look[1], realT);
  input.slowBlinkOpen = !!snap.slow_blink;
  const menu = input.takeMenu();
  if (menu.includes('pause')) { paused = !paused; hud.setHint(paused ? 'Paused · P / Esc to resume' : ''); }
  let rate = paused ? 0 : 1;
  if (dip && realT >= dip.from && realT < dip.to) { const k = (dip.to - realT) < 0.1 ? 1 - (dip.to - realT) / 0.1 : 0; rate = dip.scale + (1 - dip.scale) * k; }
  if (dip && realT >= dip.to) dip = null;
  if (enc.mode !== 'ended' || prevSnap !== snap) {
    acc += dt * rate; let n = 0;
    while (acc >= DT - 1e-9 && n < 5) { acc -= DT; if (enc.mode === 'ended') { prevSnap = snap; break; } tick(); n++; }
    if (n >= 5) acc = 0;
  }
  present(dt, Math.min(1, acc / DT), menu);
}

function present(dt, alpha, menu = []) {
  const s = snap, tw = Math.floor(realT * 30 + 1e-6) / 30;
  const globalStop = s.time_scale === 0;
  // fighters
  for (const e of s.entities) {
    const f = F(e.id); if (!f) continue;
    const prevE = prevSnap && prevSnap.entities.find((x) => x.id === e.id);
    const frozen = globalStop || (prevE && prevE.anim === e.anim && prevE.anim_t === e.anim_t && e.anim !== 'idle' && e.anim !== 'run');
    const hidden = (pile && pile.phase === 'main' && pile.cats.concat([pile.target]).includes(e.id));
    f.hidden = hidden;
    f.update(lerpEnt(e, alpha), frozen ? 0 : dt * (s.slow_blink ? 0.05 : 1), realT, tw, dt);
    // routed bolt: a three-puff trail of shrinking clouds
    if (e.anim === 'routed' && routedTrail.has(e.id) && realT - routedTrail.get(e.id) > 0.12) { routedTrail.set(e.id, realT); fx.spawn('puffSmall', f.pos.clone().add(new THREE.Vector3(0, 0.12, 0)), { size: 0.3, drawings: 6 }); }
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
  // tag window opening: a bell-gold spark ring on the controlled cat
  if (s.tag_window && !lastTagWindow) { const f = F(s.controlled); if (f) fx.tagRing(f.pos); }
  lastTagWindow = s.tag_window;
  // camera
  const C = F(s.controlled), T = s.lock && F(s.lock) && F(s.lock).root.visible ? F(s.lock) : null;
  const foes = s.entities.filter((e) => e.side === 'enemy' && e.present && !e.routed);
  const cen = foes.length ? foes.reduce((a, e) => a.add(v3(e.pos)), new THREE.Vector3()).divideScalar(foes.length) : null;
  let offFrame = false;
  if (T && C) { const a = project(T.head), b = project(C.pos); offFrame = Math.abs(a.nx) > 0.6 || Math.abs(b.nx) > 0.8 || b.ny < -0.75 || a.ny > 0.75; }
  const standoffK = s.mode === 'standoff' ? Math.min(1, s.t / 3) : 0;
  ccam.update(dt, realT, { C: C ? C.pos.clone() : new THREE.Vector3(), T: T ? T.pos.clone() : null, enemiesCentroid: cen, aspect: cam.aspect, slowBlink: s.slow_blink,
    highRoad: C && T && Math.abs(C.pos.y - T.pos.y) > 0.6, mode: pile && pile.phase === 'main' ? 'pileon' : s.mode, pileCenter: pile ? pile.centerW : null,
    standoffFocus, standoffK, offFrame, globalStop, targetNY: T ? project(T.head).ny : null, occluded: C ? (pose) => occludedAt(pose, [C.head, T ? T.head : null]) : null });
  // impact frame state
  let impactMode = null;
  if (impact) {
    const u = (realT - impact.start) * 60;
    if (u >= 0 && u < impact.inv) impactMode = 'inv';
    else if (u >= impact.inv && u < impact.inv + 2) { if (!impact.flashed) { impact.flashed = true; fx.spawn('burstPlain', impact.at, { size: 2.2, drawings: 1, cycle: false, flat: new THREE.Vector4(1, 0.965, 0.89, 1), breakAt: 9, order: 4 }); } }
    else if (u >= impact.inv + 2) impact = null;
  }
  // world FX
  fx.update(dt, tw, s, fighters, s.controlled);
  // Pile-On set-piece clock
  if (pile) {
    pile.t += dt; if (pile.beatT != null) pile.beatT += dt;
    if (pile.phase === 'out') { pile.outT += dt; if (pile.outT > 0.42) { pile = null; hudBackAt = realT + (scr.word ? Math.max(0, scr.word.ms / 1000 - scr.word.t) : 0); } }
  }
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
    hud.update({ s, t: realT, project, fighters, menuEvents: pendingMenu.splice(0).concat(menu), send: (c) => cmdQueue.push(c) });
    if (pendingCard && realT >= pendingCard.at) { hud.card(pendingCard.text, pendingCard.sub, 1e6, realT, pendingCard.clowder); pendingCard = null; }
    hud.tickCard(realT);
  }
  renderer.domElement.style.filter = s.slow_blink ? 'saturate(0.7) brightness(0.9)' : '';
  if (!skipDraw) draw(impactMode, s);
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

/* ---------------------------------------------------------------- render */
function draw(impactMode, s) {
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
    const cf = F(s.controlled);
    if (cf && cf.root.visible) {
      const vis = []; for (const c of lateScene.children) { vis.push(c.visible); c.visible = false; }
      fGroup.visible = true; const fv = []; for (const c of fGroup.children) { fv.push(c.visible); c.visible = c === cf.root; }
      renderer.render(lateScene, cam);
      lateScene.children.forEach((c, i) => { c.visible = vis[i]; }); fGroup.children.forEach((c, i) => { c.visible = fv[i]; });
    }
    renderer.autoClear = true;
  }
  lastStats = { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
}

/* ---------------------------------------------------------------- boot */
async function boot() {
  const [tex, spr] = await Promise.all([loadTextures(), bakeSprites(256), loadCatAssets('')]);
  sprites = spr;
  enc = createEncounter(opt.fight, { seed: opt.seed, showcase: true, reduceFlashes: opt.reduceFlashes, motionScale: opt.motion });
  snap = enc.snapshot(); prevSnap = snap;
  world = buildArena(snap.arena, snap.props, tex); world.tex = tex;
  envScene.add(world.env, world.backdrop); lateScene.add(world.late);
  shadow = new SunShadow(2048, 21); post = new PaintPost(tex.grain); U.grainMap.value = tex.grain;
  keyLight = new THREE.DirectionalLight('#ffffff', 2.5); fillLight = new THREE.AmbientLight('#6E6AA8', 0.8); lateScene.add(keyLight, fillLight);
  for (const e of snap.entities) { const f = new Fighter(e, { rim: Q.get('rim') !== '0' }); fighters.set(e.id, f); fGroup.add(f.root); }
  fx = new WorldFX(spr, fxScene, decalScene);
  scr = new ScreenFX(app);
  hud = new CombatHUD(app, DATA); if (!opt.hud) hud.el.style.display = 'none';
  // deterministic captures step frames faster than wall-clock CSS transitions: snap them in test mode
  if (opt.test) { const st = document.createElement('style'); st.textContent = '.ch, .ch * { transition: none !important; animation: none !important; }'; document.head.appendChild(st); }
  try { await Promise.all(["400 64px 'Dela Gothic One'", "800 32px 'M PLUS Rounded 1c'", "700 32px 'M PLUS Rounded 1c'"].map((f) => document.fonts.load(f))); } catch (e) { /* fonts optional */ }
  hud.setup(snap);
  ccam = new CombatCamera(cam);
  input = new CombatInput(renderer.domElement, { braceToggle: Q.get('brace') === 'toggle' });
  const bots = { bot: () => withCommandQueue(skilledBot()), median: () => withCommandQueue(medianBot()), daifuku: () => withCommandQueue(daifukuBot()), passive: () => passiveBot() };
  if (bots[opt.script]) script = bots[opt.script]();
  layout(); setPhase(opt.phase);
  // start the camera on the Posse, looking down the ring at the opponents
  const C0 = F(snap.controlled);
  Object.assign(ccam.pose, { px: C0.pos.x, py: 0.5, pz: C0.pos.z + 1, yaw: 0, pitch: 22, dist: 7.5 });
  addEventListener('resize', layout);
  window.__cat = {
    state: () => ({ fight: opt.fight, seed: opt.seed, tick: enc.tick, realT: +realT.toFixed(4), mode: snap.mode, outcome: snap.outcome, slow_blink: snap.slow_blink, controlled: snap.controlled,
      counts: { ...counts }, pile: !!pile, impact: !!impact, camera: cam.position.toArray().map((v) => +v.toFixed(3)), yaw: +ccam.pose.yaw.toFixed(2), stats: { ...lastStats } }),
    hash: () => enc.hash(),
    debug: () => ({ screen: scr.fx.map((f) => ({ kind: f.kind, t: +f.t.toFixed(3), dur: f.dur, from: f.from && project(f.from), to: f.to && project(f.to) })), word: scr.word && scr.word.text, world: fx.items.length }),
    snapshot: () => snap,
    /** Advance n rendered frames of 1/60 s (deterministic), drawing only the last unless every = true. */
    frames: (n = 1, every = false) => { for (let i = 0; i < n; i++) { skipDraw = !every && i < n - 1; frame(DT); } skipDraw = false; return window.__cat.state(); },
    /** Run until an event of `type` (count index `nth`, 0-based over the whole run) has been emitted, or max frames. */
    until: (type, max = 6000, nth = 0) => { skipDraw = true; for (let i = 0; i < max; i++) { if ((counts[type] || 0) > nth) { skipDraw = false; present(0, 1); return { ok: true, ...window.__cat.state() }; } if (snap.mode === 'ended' && i > 0 && prevSnap === snap) break; frame(DT); } skipDraw = false; return { ok: (counts[type] || 0) > nth, ...window.__cat.state() }; },
    inject: (inp) => { injectQ.push(inp); },
    scriptOn: (on) => { if (!on) { window.__cat._script = script; script = null; } else if (window.__cat._script) script = window.__cat._script; },
    menu: (m) => { input.menu.push(m); },
    events: (type) => evLog.filter((e) => !type || e.type === type).map((e) => ({ type: e.type, tick: e.tick, t: e.t, tier: e.feel ? e.feel.tier : null, impact: e.feel ? e.feel.impact : null })),
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
  hud.setHint(script ? 'Demo: a bot is playing · reload without ?script to fight yourself' : 'WASD move · LMB attack · Space hop · Shift skitter · RMB brace · F hiss / Pile-On · Tab Slow Blink · 1-4 Moves · Z X C V switch · wheel lock · P pause');
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

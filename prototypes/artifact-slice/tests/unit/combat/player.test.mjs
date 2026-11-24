// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The owner's M1.1 and M1.2 direction (design/reviews/owner-feedback/combat-m1.1-spec.md, combat-m1.2-spec.md):
// Mikan's input model, strings and Evade; lock-on; attack tokens; and the Special chain with the Team finisher.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA, createEncounter } from '../../../src/sim/combat/index.js';
import { engagersOf } from '../../../src/sim/combat/ai.js';
import { canMoveFraction } from '../../../src/sim/combat/player.js';
import { skilledBot, passiveBot, withCommandQueue } from '../../smoke/combat/bots.mjs';

const T = 60, S = DATA.strings, K = DATA.k;
const total = id => S[id].startup_s + S[id].active_s + S[id].recovery_s;

/** A fight past its Standoff with Goma parked in front of Mikan and every enemy holding still. */
function arena(name = 'tough_focus', opts = {}) {
  const enc = createEncounter(name, { seed: 9, ...opts });
  for (let i = 0; i < T * 3 + 1; i++) enc.step({});
  const m = enc.byId.get('mikan'), g = enc.byId.get('goma');
  m.x = 0; m.z = 0; m.fx = 0; m.fz = -1; g.x = 0; g.z = -1.0;
  for (const p of enc.posse()) if (p !== m) { p.x = -4; p.z = 4; p.ai.engageCd = 99; p.ai.decideT = 99; } // crew away, so Goma is not cornered
  for (const e of enc.enemies()) { enc._removeTeleOf(e); e.act = null; e.ai.intent = 'posture'; e.ai.phaseT = 99; e.ai.engageCd = 99; e.ai.decideT = 99; e.ai.cornerT = 99; }
  return { enc, m, g };
}
const steps = (enc, n, f = () => ({})) => { const ev = []; for (let i = 0; i < n; i++) ev.push(...enc.step(f(i))); return ev; };
const starts = ev => ev.filter(e => e.type === 'AttackStart').map(e => e.attack);
/** Press `key` once the current attack reaches its buffer window (as a player watching the swing). */
const inWindow = (m) => m.act?.kind === 'atk' && m.act.t >= S[m.act.id].chain_s - 0.1 && !m.buf;

test('three rapid light clicks give one attack, not three (presses before the buffer window are dropped)', () => {
  const { enc } = arena();
  const ev = steps(enc, T * 2, i => (i < 3 ? { light: true } : {}));
  assert.deepEqual(starts(ev), ['L1']);
  assert.equal(ev.filter(e => e.type === 'InputDropped').length, 2);
});

test('a press in the last 150 ms before the chain point is buffered and L2 follows at the chain point', () => {
  const { enc, m } = arena();
  let sent = false;
  const ev = steps(enc, T * 2, i => (i === 0 ? { light: true } : !sent && inWindow(m) ? (sent = true, { light: true }) : {}));
  assert.deepEqual(starts(ev), ['L1', 'L2']);
  assert.ok(ev.some(e => e.type === 'InputBuffered'));
});

test('a light is active on the next tick after the press and lands on that frame; a heavy winds up first', () => {
  const { enc } = arena();
  const ev = steps(enc, 10, i => (i === 0 ? { light: true } : {}));
  const act = ev.find(e => e.type === 'AttackActive');
  assert.ok(act.latency_ticks <= 1, `latency ${act.latency_ticks}`);
  assert.equal(ev.find(e => e.type === 'Hit' && e.attacker === 'mikan').tick, act.tick);
  for (const h of ['FIN', 'H', 'LAUNCH', 'HC']) assert.ok(S[h].startup_s >= 0.2, `${h} anticipation`);
  for (const l of ['L1', 'L2', 'L3', 'DL']) assert.ok(S[l].startup_s <= 2 / T + 1e-9, `${l} is active on the next tick`);
});

test('during an attack Mikan steers at reduced speed from frame 1 and moves freely from 60% of the total animation', () => {
  // Arrange
  const { enc, m } = arena();
  const at = (id, t) => { m.act = { kind: 'atk', id, t, hit: true, charge: 0 }; return canMoveFraction(enc, m); };
  // Assert: the fraction, for a light and for the heavy finisher alike.
  for (const id of ['L1', 'FIN']) {
    assert.equal(at(id, 0.001), K.attack_steer, `${id} frame 1`);
    assert.equal(at(id, 0.6 * total(id) - 0.01), K.attack_steer, `${id} before 60%`);
    assert.equal(at(id, 0.6 * total(id) + 0.001), 1, `${id} from 60%`);
  }
  // Act: holding the stick sideways during a swing (lunge off) moves Mikan at the reduced speed.
  m.x = 0; m.z = 0; m.fx = 0; m.fz = -1;
  m.act = { kind: 'atk', id: 'FIN', t: 0.01, hit: true, charge: 0, pressTick: enc.tick, lunge: 0 };
  for (let i = 0; i < 6; i++) enc.step({ move: [1, 0] });
  assert.ok(Math.abs(m.x - 6 / T * K.move_speed_mps * K.attack_steer) < 0.01, `steered ${m.x}`);
});

test('Evade cancels an attack at any frame, keeps the combo (the next light continues the string), and has a cooldown', () => {
  // Cancel L2 before its hit: the combo survives from L1, and a light during the evade gives L3? no: L2 again, lunging.
  const { enc, m } = arena();
  let phase = 0;
  const ev = steps(enc, T * 2, () => {
    if (phase === 0) { phase = 1; return { light: true }; }
    if (phase === 1 && inWindow(m)) { phase = 2; return { light: true }; }
    if (phase === 2 && m.act?.kind === 'atk' && m.act.id === 'L2' && !m.act.hit) { phase = 3; return { evade: true, move: [1, 0] }; }
    if (phase === 3 && m.act?.kind === 'evade') { phase = 4; return { light: true }; }
    return {};
  });
  const evd = ev.find(e => e.type === 'Evade');
  assert.equal(evd.cancelled, 'L2'); assert.equal(evd.combo_kept, 'L1');
  assert.deepEqual(starts(ev), ['L1', 'L2', 'L2'], 'the string goes on after the evade');
  assert.ok(ev.filter(e => e.type === 'AttackStart')[2].lunge_m > S.L2.lunge_m, 'Evade -> Light lunges');
  // The heavy finisher's anticipation is cancellable too.
  const b = arena();
  b.m.act = { kind: 'atk', id: 'FIN', t: 0.05, hit: false, charge: 0, pressTick: b.enc.tick, lunge: 0 };
  b.enc.step({ evade: true, move: [1, 0] });
  assert.equal(b.m.act.kind, 'evade');
  // Cooldown: a second evade inside 0.8 s is rejected; after it, accepted.
  const c = arena();
  c.enc.step({ evade: true, move: [1, 0] });
  const rej = steps(c.enc, Math.round(0.5 * T), i => (i === Math.round(0.5 * T) - 1 ? { evade: true } : {}));
  assert.ok(rej.some(e => e.type === 'EvadeRejected'));
  assert.ok(c.enc.snapshot().entities.find(e => e.id === 'mikan').evade_cd_s > 0);
  const ok = steps(c.enc, Math.round(0.4 * T), i => (i === Math.round(0.4 * T) - 1 ? { evade: true } : {}));
  assert.ok(ok.some(e => e.type === 'Evade'));
});

test('an Evade gives i-frames; a perfect evade (hit imminent) brings slow-mo and a counter on the next press', () => {
  // Arrange: Goma's swing at Mikan resolves in 0.1 s.
  const { enc, m, g } = arena();
  enc._enemyWindup(g, 'enemy_swipe', m);
  const tl = enc.teles[0]; tl.t0 = enc.simT - (tl.dur - 0.1); g.act.t = tl.dur - 0.1;
  // Act
  const ev = steps(enc, 20, i => (i === 0 ? { evade: true, move: [0, 1] } : i === 3 ? { light: true } : {}));
  // Assert
  assert.ok(ev.some(e => e.type === 'PerfectEvade' && e.attacker === 'goma'));
  assert.ok(!ev.some(e => e.type === 'Hit' && e.target === 'mikan'), 'invulnerable through the swing');
  assert.deepEqual(starts(ev), ['CTR']);
});

test('L-L-L-H is the finisher; L-H launches; Evade-L lunges; holding H charges; heavies build stagger faster', () => {
  const { enc, m } = arena();
  const plan = ['light', 'light', 'light', 'heavy']; let n = 0;
  const ev = steps(enc, T * 4, () => (n === 0 ? (n++, { light: true }) : n < plan.length && inWindow(m) ? { [plan[n++]]: true } : {}));
  assert.deepEqual(starts(ev), ['L1', 'L2', 'L3', 'FIN']);
  assert.ok(ev.some(e => e.type === 'Hit' && e.attack === 'FIN' && e.kind === 'finisher'));
  const a = arena(); let sent = false;
  assert.deepEqual(starts(steps(a.enc, T * 2, i => (i === 0 ? { light: true } : !sent && inWindow(a.m) ? (sent = true, { heavy: true }) : {}))), ['L1', 'LAUNCH']);
  const b = arena();
  assert.deepEqual(starts(steps(b.enc, T, i => (i === 0 ? { evade: true, move: [0, -1] } : i === 5 ? { light: true } : {}))), ['DL']);
  const c = arena();
  const hc = steps(c.enc, T * 2, i => (i < 48 ? { heavy: true } : {})).find(e => e.type === 'AttackStart');
  assert.equal(hc.attack, 'HC'); assert.ok(hc.charge > 0.7);
  for (const h of ['FIN', 'LAUNCH', 'H', 'HC']) assert.ok(S[h].fz > Math.max(S.L1.fz, S.L2.fz, S.L3.fz), h);
});

test('Tab locks the nearest enemy and Tab again unlocks; a flick switches to the next enemy on that side', () => {
  const { enc, m } = arena('toughs_3');
  const [goma, sasa, stray] = ['goma', 'sasa', 'stray'].map(id => enc.byId.get(id));
  goma.x = 0; goma.z = -2; sasa.x = 2; sasa.z = -2; stray.x = -2; stray.z = -2;
  assert.equal(enc.lockId, null, 'not locked by default');
  enc.step({ lockOn: true }); assert.equal(enc.lockId, 'goma');
  enc.step({ lockOn: true }); assert.equal(enc.lockId, null);
  enc.step({ lockOn: true });
  enc.step({ lockSwitch: { side: 'right', right: [1, 0] } }); assert.equal(enc.lockId, 'sasa');
  enc.step({ lockSwitch: { side: 'left', right: [1, 0] } }); assert.equal(enc.lockId, 'goma');
  enc.step({ lockSwitch: { side: 'left', right: [1, 0] } }); assert.equal(enc.lockId, 'stray');
});

test('never more than two enemies engage Mikan at once outside a cornered cat, and the rest circle, stalk, posture or flank', () => {
  const seen = new Set();
  for (const [name, mk] of [['sandbox', () => passiveBot()], ['sandbox', () => withCommandQueue(skilledBot())], ['toughs_3', () => passiveBot()]]) for (const seed of [1, 2, 3]) {
    const enc = createEncounter(name, { seed, showcase: true });
    const bot = mk(), m = enc.byId.get('mikan');
    for (let i = 0; i < T * 60 && enc.mode !== 'ended'; i++) {
      enc.step(bot(enc, i));
      assert.ok(engagersOf(enc, m) <= 2, `${name} seed ${seed} tick ${i}`);
      for (const e of enc.enemies()) if (enc.standing(e)) seen.add(e.ai.intent);
    }
  }
  for (const intent of ['circle', 'posture', 'dash_in', 'retreat']) assert.ok(seen.has(intent), `enemies never ${intent}`);
});

/** All four meters full, the crew in range of Goma. */
function chainSetup(stagger) {
  const r = arena('sandbox');
  for (const p of r.enc.posse()) { p.special = 100; p.x = r.g.x + (p.slot - 1.5); p.z = r.g.z + 1.5; }
  r.g.nerve = r.g.nerveMax = 1e5; // fixture: the target survives every Special
  r.m.x = 0; r.m.z = 0;
  if (stagger) r.enc._addFz(r.g, 200, r.m);
  return r;
}

test('F fires the Special at any time; crew Specials follow one after another with time stopped; all four add the full burst', () => {
  // Arrange: Goma not staggered.
  const { enc, g } = chainSetup(false);
  const simT = enc.simT;
  // Act
  const ev = steps(enc, T * 8, i => (i === 0 ? { special: true } : {}));
  // Assert: order and sequencing.
  const st = ev.find(e => e.type === 'SpecialChainStart');
  assert.deepEqual(st.cats, ['mikan', 'hige', 'pon', 'kinako']); assert.equal(st.staggered, false);
  const s = ev.filter(e => e.type === 'SpecialStart'), e2 = ev.filter(e => e.type === 'SpecialEnd');
  assert.deepEqual(s.map(x => x.cat), ['mikan', 'hige', 'pon', 'kinako']);
  for (let i = 1; i < s.length; i++) assert.ok(s[i].t >= e2[i - 1].t - 1e-9, 'each Special starts after the previous one ends');
  for (let i = 0; i < s.length; i++) assert.ok(Math.abs(e2[i].t - s[i].t - s[i].duration_s) < 1.5 / T, 'ends after its duration');
  const tf = ev.find(e => e.type === 'TeamFinisher');
  assert.ok(tf && tf.t >= e2[3].t - 1e-9, 'the full burst comes last');
  const end = ev.find(e => e.type === 'SpecialChainEnd');
  assert.ok(Math.abs(end.sim_t - simT) < 0.05, 'sim time stood still'); assert.ok(st.total_s <= K.special.chain_max_s);
  assert.ok(ev.some(e => e.type === 'Hit' && e.kind === 'pile_on_beat') || ev.some(e => e.type === 'CatRouted' && e.how === 'by_pile_on'),
    'full burst = extra damage on top (or, on a staggered Tough, the Rout)');
});

test('a staggered target takes bonus Special damage; a repeat chain plays faster; F without a full meter is refused', () => {
  const dmgOf = stagger => {
    const { enc } = chainSetup(stagger);
    for (const p of enc.posse()) if (p.id !== 'mikan') p.special = 0;
    const ev = steps(enc, T * 3, i => (i === 0 ? { special: true } : {}));
    return ev.filter(e => e.type === 'Hit' && e.kind === 'special' && e.target === 'goma').reduce((a, e) => a + e.dmg, 0);
  };
  assert.ok(dmgOf(true) > dmgOf(false) * 1.5 * K.special.stagger_bonus * 0.95);
  const r = chainSetup(false);
  r.enc.chainCount = 1;
  const ev = steps(r.enc, T * 6, i => (i === 0 ? { special: true } : {}));
  assert.equal(ev.find(e => e.type === 'SpecialChainStart').shortened, true);
  assert.ok(ev.filter(e => e.type === 'SpecialStart').every(x => Math.abs(x.duration_s - (K.special.cutin_s + K.special.action_s) * K.special.repeat_mult) < 1e-9));
  const c = arena('sandbox'); c.m.special = 10;
  assert.ok(steps(c.enc, 2, i => (i === 0 ? { special: true } : {})).some(e => e.type === 'SpecialRejected' && e.reason === 'meter'));
});

test('the player controls Mikan only: switch input is ignored and Mikan Routed passes control to nobody', () => {
  const { enc, m } = arena('sandbox');
  enc.step({ switchTo: 1 });
  assert.equal(enc.controlledId, 'mikan');
  enc._rout(m, enc.byId.get('goma'), 'by_hit');
  enc.step({});
  assert.equal(enc.controlledId, 'mikan');
  assert.notEqual(enc.mode, 'gloat', 'the crew fight on');
});

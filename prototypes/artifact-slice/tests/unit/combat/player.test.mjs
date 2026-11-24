// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// M1.1 owner direction (design/reviews/owner-feedback/combat-m1.1-spec.md): Mikan's input model, strings,
// lock-on, attack tokens, and the Special chain with the Team finisher.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA, createEncounter } from '../../../src/sim/combat/index.js';
import { engagersOf } from '../../../src/sim/combat/ai.js';
import { canMoveFraction } from '../../../src/sim/combat/player.js';
import { skilledBot, passiveBot, withCommandQueue } from '../../smoke/combat/bots.mjs';

const T = 60, S = DATA.strings;

/** A fight past its Standoff with Goma parked in front of Mikan and every other enemy far away. */
function arena(name = 'tough_focus', opts = {}) {
  const enc = createEncounter(name, { seed: 9, ...opts });
  for (let i = 0; i < T * 3 + 1; i++) enc.step({});
  const m = enc.byId.get('mikan'), g = enc.byId.get('goma');
  m.x = 0; m.z = 0; m.fx = 0; m.fz = -1; g.x = 0; g.z = -1.0;
  for (const e of enc.enemies()) { enc._removeTeleOf(e); e.act = null; e.ai.intent = 'posture'; e.ai.phaseT = 99; e.ai.engageCd = 99; e.ai.decideT = 99; }
  return { enc, m, g };
}
const steps = (enc, n, f = () => ({})) => { const ev = []; for (let i = 0; i < n; i++) ev.push(...enc.step(f(i))); return ev; };
const starts = ev => ev.filter(e => e.type === 'AttackStart').map(e => e.attack);

test('three rapid light clicks give one attack, not three (presses before the buffer window are dropped)', () => {
  // Arrange
  const { enc } = arena();
  // Act: click on three consecutive ticks, then wait out the string.
  const ev = steps(enc, T * 2, i => (i < 3 ? { light: true } : {}));
  // Assert
  assert.deepEqual(starts(ev), ['L1']);
  assert.equal(ev.filter(e => e.type === 'InputDropped').length, 2);
});

test('a press in the last 150 ms before the chain point is buffered and starts L2 at the chain point', () => {
  const { enc } = arena();
  const pressTick = Math.round((S.L1.chain_s - 0.1) * T);
  const ev = steps(enc, T * 2, i => (i === 0 || i === pressTick ? { light: true } : {}));
  assert.deepEqual(starts(ev), ['L1', 'L2']);
  const l2 = ev.find(e => e.type === 'AttackStart' && e.attack === 'L2');
  assert.ok(ev.some(e => e.type === 'InputBuffered'));
  const l1 = ev.find(e => e.type === 'AttackStart' && e.attack === 'L1'), hs = Math.ceil(DATA.tiers[1].hitstop_ms / 1000 * T);
  assert.ok(Math.abs(l2.tick - l1.tick - S.L1.chain_s * T) <= 2 + hs, 'L2 starts at L1\'s chain point (plus its own hit-stop)');
});

test('a light\'s first active frame comes within 3 ticks of the press and the hit lands on that frame', () => {
  const { enc } = arena();
  const ev = steps(enc, 10, i => (i === 0 ? { light: true } : {}));
  const act = ev.find(e => e.type === 'AttackActive');
  assert.ok(act.latency_ticks <= 3, `latency ${act.latency_ticks}`);
  const hit = ev.find(e => e.type === 'Hit' && e.attacker === 'mikan');
  assert.equal(hit.tick, act.tick);
});

test('movement returns on a ramp from 60% of recovery, the heavy finisher commits, and a dodge cancels recovery after the hit', () => {
  // Arrange
  const { enc, m } = arena();
  const r = S.L1, hitEnd = r.startup_s + r.active_s, from = hitEnd + 0.6 * r.recovery_s, end = hitEnd + r.recovery_s;
  const at = t => { m.act = { kind: 'atk', id: 'L1', t, hit: true, charge: 0 }; return canMoveFraction(enc, m); };
  // Assert: no movement before the ramp, partial on it, full at the end.
  assert.equal(at(0.02), 0); assert.equal(at(from - 0.01), 0);
  const mid = at((from + end) / 2); assert.ok(mid > 0.3 && mid < 0.7, `mid ${mid}`);
  assert.ok(at(end - 1e-6) > 0.99);
  const f = S.FIN, fHit = f.startup_s + f.active_s;
  m.act = { kind: 'atk', id: 'FIN', t: fHit + f.commit_s * 0.5, hit: true, charge: 0 };
  assert.equal(canMoveFraction(enc, m), 0, 'the finisher commits');
  // Act: a dodge right after a light's hit cancels its recovery; before the finisher's commit ends it does not.
  m.act = { kind: 'atk', id: 'L1', t: hitEnd + 0.02, hit: true, charge: 0, pressTick: enc.tick };
  enc.step({ dodge: true, move: [1, 0] });
  assert.equal(m.act?.kind, 'skitter');
  m.act = { kind: 'atk', id: 'FIN', t: fHit + 0.05, hit: true, charge: 0, pressTick: enc.tick };
  enc.step({ dodge: true, move: [1, 0] });
  assert.equal(m.act?.kind, 'atk');
});

test('L-L-L-H is the finisher; L-H launches; Dash-L lunges; holding H charges', () => {
  // L-L-L-H: press each next key inside the buffer window (reading Mikan's attack clock, as a player watches it).
  const { enc, m } = arena();
  const plan = ['light', 'light', 'light', 'heavy'];
  let n = 0;
  const ev = steps(enc, T * 4, () => {
    if (n === 0) { n++; return { light: true }; }
    const a = m.act;
    if (n < plan.length && a?.kind === 'atk' && a.t >= S[a.id].chain_s - 0.1 && !m.buf) return { [plan[n++]]: true };
    return {};
  });
  assert.deepEqual(starts(ev), ['L1', 'L2', 'L3', 'FIN']);
  assert.ok(ev.some(e => e.type === 'Hit' && e.attack === 'FIN' && e.kind === 'finisher'));
  // L-H launcher.
  const a = arena();
  let sent = false;
  assert.deepEqual(starts(steps(a.enc, T * 2, i => {
    if (i === 0) return { light: true };
    const x = a.m.act; if (!sent && x?.kind === 'atk' && x.t >= S.L1.chain_s - 0.1) { sent = true; return { heavy: true }; }
    return {};
  })), ['L1', 'LAUNCH']);
  // Dash -> L.
  const b = arena();
  assert.deepEqual(starts(steps(b.enc, T, i => (i === 0 ? { dash: true, move: [0, -1] } : i === 5 ? { light: true } : {}))), ['DL']);
  // Hold H for 0.8 s, release: a charged heavy.
  const c = arena();
  const ev2 = steps(c.enc, T * 2, i => (i < 48 ? { heavy: true } : {}));
  const hc = ev2.find(e => e.type === 'AttackStart');
  assert.equal(hc.attack, 'HC'); assert.ok(hc.charge > 0.7);
});

test('heavies build stagger faster than lights', () => {
  for (const h of ['FIN', 'LAUNCH', 'H', 'HC']) assert.ok(S[h].fz > Math.max(S.L1.fz, S.L2.fz, S.L3.fz), h);
});

test('Tab locks the nearest enemy, re-locks when the nearest changes, and otherwise unlocks', () => {
  const { enc, m } = arena('toughs_2');
  assert.equal(enc.lockId, null, 'not locked by default');
  enc.byId.get('sasa').x = 4; enc.byId.get('sasa').z = 4;
  enc.step({ lockOn: true }); assert.equal(enc.lockId, 'goma');
  enc.step({ lockOn: true }); assert.equal(enc.lockId, null);
  enc.step({ lockOn: true }); assert.equal(enc.lockId, 'goma');
  m.x = 3.5; m.z = 3.5; enc.byId.get('sasa').x = 4; enc.byId.get('sasa').z = 4;
  enc.step({ lockOn: true }); assert.equal(enc.lockId, 'sasa');
});

test('never more than two enemies engage Mikan at once, while the rest circle, stalk, posture or flank', () => {
  const seen = new Set();
  for (const [name, mk] of [['sandbox', () => passiveBot()], ['sandbox', () => withCommandQueue(skilledBot())], ['toughs_3', () => passiveBot()]]) for (const seed of [1, 2, 3]) {
    const enc = createEncounter(name, { seed, showcase: true });
    const bot = mk(), m = enc.byId.get('mikan');
    for (let i = 0; i < T * 60 && enc.mode !== 'ended'; i++) {
      enc.step(bot(enc, i));
      assert.ok(engagersOf(enc, m) <= 2, `${name} seed ${seed} tick ${i}`);
      assert.ok(enc.teles.filter(t => t.aimedAt === 'mikan').length <= 2);
      for (const e of enc.enemies()) if (enc.standing(e)) seen.add(e.ai.intent);
    }
  }
  for (const intent of ['circle', 'posture', 'dash_in', 'retreat']) assert.ok(seen.has(intent), `enemies never ${intent}`);
});

test('F on a staggered enemy runs Mikan\'s Special, chains every ready crew Special with time stopped, then the Team finisher', () => {
  // Arrange: all four meters full, Goma staggered, the crew in range.
  const { enc, m, g } = arena('sandbox');
  for (const p of enc.posse()) { p.special = 100; p.x = g.x + (p.slot - 1.5); p.z = g.z + 1.5; }
  m.x = 0; m.z = 0;
  enc._addFz(g, 200, m);
  // Act
  const simT = enc.simT;
  const ev = steps(enc, T * 7, i => (i === 0 ? { special: true } : {}));
  // Assert
  const st = ev.find(e => e.type === 'SpecialChainStart');
  assert.deepEqual(st.cats, ['mikan', 'hige', 'pon', 'kinako']);
  assert.equal(st.team_finisher, true); assert.equal(st.shortened, false); assert.ok(st.total_s <= 6);
  const cuts = ev.filter(e => e.type === 'SpecialCutIn');
  assert.deepEqual(cuts.map(c => c.cat), ['mikan', 'hige', 'pon', 'kinako']);
  assert.ok(cuts.every(c => c.duration_s === DATA.k.special.cutin_s));
  assert.ok(ev.some(e => e.type === 'TeamFinisher'));
  const end = ev.find(e => e.type === 'SpecialChainEnd');
  assert.ok(Math.abs(end.sim_t - simT) < 0.05, 'sim time stood still through the chain');
  assert.ok(g.routed, 'the Team finisher Routs a Tough');
  assert.ok(enc.posse().every(p => p.special === 0 || p.special < 100));
});

test('a later chain is shortened, a chain without all four has no Team finisher, and F needs a ready meter', () => {
  const { enc, m } = arena('sandbox');
  const [a, b] = [enc.byId.get('sasa'), enc.byId.get('stray')];
  for (const e of [a, b]) { e.x = 0; e.z = -1.2; }
  enc.chainCount = 1; m.special = 100; enc.byId.get('hige').special = 100;
  enc._addFz(a, 200, m);
  const ev = steps(enc, T * 4, i => (i === 0 ? { special: true } : {}));
  const st = ev.find(e => e.type === 'SpecialChainStart');
  assert.equal(st.shortened, true); assert.equal(st.team_finisher, false);
  assert.ok(ev.filter(e => e.type === 'SpecialCutIn').every(c => c.duration_s === DATA.k.special.cutin_short_s));
  assert.ok(!ev.some(e => e.type === 'TeamFinisher'));
  // Meter empty: rejected.
  const c = arena('sandbox');
  c.enc._addFz(c.g, 200, c.m); c.m.special = 10;
  const r = steps(c.enc, 2, i => (i === 0 ? { special: true } : {}));
  assert.ok(r.some(e => e.type === 'SpecialRejected' && e.reason === 'meter'));
  assert.equal(c.enc.snapshot().special_prompt.ready, false);
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

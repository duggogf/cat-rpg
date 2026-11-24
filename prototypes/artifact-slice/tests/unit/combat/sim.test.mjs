// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Encounter-level rules: determinism, the allied guest (G7), Fired Up by anger (F11), Old Gang Nerves,
// Kin, AI limits, Tag-In/Relay, Pile-On conditions, Daifuku's phase clamp, and the loss hand-off.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DATA, buildData, createEncounter, run } from '../../../src/sim/combat/index.js';
import { hashOf } from '../../../src/sim/core/hash.js';
import { skilledBot, daifukuBot, withCommandQueue } from '../../smoke/combat/bots.mjs';

const T = 60; // ticks per second
const stepN = (enc, n, f = () => ({})) => { const evs = []; for (let i = 0; i < n && enc.mode !== 'ended'; i++) evs.push(...enc.step(f(enc, i))); return evs; };

test('the same seed and input log give the same hash; another seed gives another', () => {
  // Arrange: record a skilled bot's inputs on the sandbox.
  const a = createEncounter('sandbox', { seed: 11, showcase: true });
  const bot = withCommandQueue(skilledBot());
  const log = [], marks = [];
  // Act
  for (let i = 0; a.mode !== 'ended' && i < T * 120; i++) { const inp = bot(a, i); log.push(JSON.parse(JSON.stringify(inp))); a.step(inp); if (i % 600 === 0) marks.push(a.hash()); }
  const b = createEncounter('sandbox', { seed: 11, showcase: true });
  const marksB = [];
  for (let i = 0; i < log.length; i++) { b.step(log[i]); if (i % 600 === 0) marksB.push(b.hash()); }
  const c = createEncounter('sandbox', { seed: 12, showcase: true });
  for (let i = 0; i < log.length; i++) c.step(log[i]);
  // Assert
  assert.deepEqual(marksB, marks);
  assert.equal(b.hash(), a.hash());
  assert.equal(hashOf(b.log), hashOf(a.log), 'event logs identical');
  assert.notEqual(c.hash(), a.hash());
});

test('a join-in guest yowls, enters 3 s later, and leaves the opposing Rival\'s AI state bit-identical (G7)', () => {
  // Arrange: the same seed with and without Togemaru; no player input.
  const g = createEncounter('challenger', { seed: 5, showcase: true });
  const n = createEncounter('challenger_no_guest', { seed: 5, showcase: true });
  const rivalProfile = enc => { const r = enc.byId.get('challenger'); return hashOf({ pers: r.pers, row: r.row, rank: r.rankRow, stats: r.stats, status: r.status, anger: r.anger, moves: r.moves }); };
  const noGuest = enc => { const s = enc.state(); s.ents = s.ents.filter(e => e.id !== 'togemaru'); return hashOf(s); };
  const rivalState = enc => hashOf(enc.state().ents.find(e => e.id === 'challenger'));
  // Act + Assert: tick by tick until the guest is present.
  let yowlT = null, enterT = null;
  for (let i = 0; i < T * 12; i++) {
    const eg = g.step({}), en = n.step({});
    for (const e of eg) { if (e.type === 'AllyYowl') yowlT = e.sim_t; if (e.type === 'GuestEntered') enterT = e.sim_t; }
    if (enterT == null) { assert.equal(noGuest(g), noGuest(n), `tick ${i}`); assert.equal(rivalState(g), rivalState(n)); }
    if (enterT != null) break;
    assert.ok(!en.some(e => e.type === 'AllyJoined'));
  }
  assert.ok(yowlT != null && enterT != null);
  assert.ok(Math.abs(enterT - yowlT - DATA.k.guest_entry_yowl_s) < 1.5 / T, 'enters 3 s after its yowl');
  assert.equal(rivalProfile(g), rivalProfile(n), 'the Rival\'s AI profile, buffs and kit are identical');
  // The guest is not controllable, commandable or in a Pile-On, and leaves at EncounterEnded.
  g.step({ switchTo: -1 }); assert.notEqual(g.controlledId, 'togemaru');
  g.step({ slowBlink: true }); const rej = g.step({ command: { cat: 'togemaru', move: 'bunny_kick', target: 'challenger' } }); g.step({ slowBlink: true });
  assert.ok(rej.some(e => e.type === 'CommandRejected' && e.reason === 'bad_cat'));
  const { events } = run(g, withCommandQueue(skilledBot()), T * 120);
  for (const e of events.filter(e => e.type === 'PileOnStart')) assert.ok(!e.cats.includes('togemaru'));
  assert.ok(events.some(e => e.type === 'GuestLeft'));
  assert.equal(g.byId.get('togemaru').gone, true);
});

test('enemy and Boss AI never read guest, Kin, Old Gang, anger or Posse-membership fields (static check, AC 21/23/24)', () => {
  const src = fs.readFileSync(new URL('../../../src/sim/combat/ai.js', import.meta.url), 'utf8');
  const enemyPart = src.slice(src.indexOf('/* ------------------------------------------------------------------ enemies */'));
  for (const word of ['guest', 'kin_ids', 'old_boss_id', 'old_gang', 'anger', 'rival_ids', "'posse'", 'slot']) assert.ok(!enemyPart.includes(word), `enemy AI mentions ${word}`);
});

const angerRun = (stage, soggyAt, D) => {
  const enc = createEncounter({ Name: 't_anger', arena: 'wash_tub_kit', opener: 'standoff', posse: ['kinako'], enemies: ['daifuku'], guest: null, tutorial: false },
    { seed: 3, anger: { daifuku: stage }, data: D });
  const b = enc.byId.get('daifuku');
  for (const p of enc.posse()) { p.nerve = p.nerveMax = 1e6; } // fixture: the fight must outlast the buff
  let soggy = 0, endT = null;
  for (let i = 0; i < T * 70 && enc.mode !== 'ended'; i++) {
    if (soggyAt != null && enc.mode === 'fight' && Math.abs(enc.fightT - soggyAt) < 0.5 / T) enc._applyStatus(b, 'soggy', 6, 'test');
    const before = b.status?.kind === 'soggy';
    enc.step({});
    if (endT == null && b.anger && b.anger.left <= 0) endT = enc.fightT;
    if (before) soggy += enc.DT * enc.timeScale;
  }
  return { enc, b, soggy, endT };
};

test('F11 Fired Up lasts 20 / 40 s of buff by stage, paused while Soggy, and Calm gives none', () => {
  // Riled with a bucket dunk at 5 s: 20 s of buff, ending after 20 s + the Soggy time.
  const r = angerRun('Riled', 5);
  assert.ok(Math.abs(r.b.angerBuffedS - 20) <= 1 / T + 1e-9, `buffed ${r.b.angerBuffedS}`);
  assert.ok(r.soggy >= 6 - 2 / T, 'the dunk happened');
  assert.ok(Math.abs(r.endT - (20 + r.soggy)) <= 2 / T, `ended at ${r.endT}`);
  const s = angerRun('Seething', null);
  assert.ok(Math.abs(s.b.angerBuffedS - 40) <= 1 / T + 1e-9);
  const f = angerRun('Furious', 5);
  assert.equal(f.endT, null, 'Furious never ends'); assert.ok(f.b.anger.left === Infinity);
  const c = angerRun('Calm', null);
  assert.equal(c.b.anger, null);
});

test('F11 with anger_fu_pause_under_status off, the first Soggy ends a Riled buff', () => {
  const r = angerRun('Riled', 5, buildData({ anger_fu_pause_under_status: false }));
  assert.ok(r.b.angerBuffedS < 5.1 && r.endT != null && r.endT < 5.1);
});

test('Old Gang Nerves: Kagi is Cowed 20 s and never targets Daifuku; a Tag-In clears it, a plain switch does not; Hige resists', () => {
  const def = { Name: 't_nerves', arena: 'wash_tub_kit', opener: 'standoff', posse: ['mikan', 'kagi', 'hige'], enemies: ['daifuku'], guest: null, tutorial: false };
  // Arrange + Act: through the Standoff.
  const enc = createEncounter(def, { seed: 4 });
  const evs = stepN(enc, T * 3 + 2);
  const kagi = enc.byId.get('kagi');
  // Assert
  assert.equal(kagi.status?.kind, 'cowed'); assert.equal(kagi.status.src, 'nerves'); assert.ok(Math.abs(kagi.status.total - 20) < 1e-9);
  assert.equal(enc.byId.get('hige').status, null);
  const st = enc.log.find(e => e.type === 'StandoffStart');
  assert.ok(st.barks.some(b => b.cat === 'hige' && b.kind === 'defiant' && b.text === 'Not your cat anymore.'));
  for (let i = 0; i < T * 5; i++) { enc.step({}); assert.notEqual(kagi.ai.targetId, 'daifuku'); }
  enc.step({ switchTo: 2 }); assert.equal(kagi.status?.kind, 'cowed', 'switching elsewhere leaves it');
  enc.step({ switchTo: 1 }); assert.equal(kagi.status?.kind, 'cowed', 'a plain switch leaves it');
  enc.step({ switchTo: 0 });
  enc._openTagWindow(enc.controlled, enc.byId.get('daifuku'), false);
  const tag = enc.step({ switchTo: 1 });
  assert.ok(tag.some(e => e.type === 'TagIn' && e.to === 'kagi'));
  assert.equal(kagi.status, null);
  assert.ok(tag.some(e => e.type === 'StatusEnded' && e.cat === 'kagi' && e.reason === 'tag_in'));
  // A Sworn Kagi (Loyalty 85) is never Cowed.
  const D2 = buildData(); D2.cats = { ...D2.cats, kagi: { ...D2.cats.kagi, loyalty: 85 } };
  const sworn = createEncounter(def, { seed: 4, data: D2 }); stepN(sworn, T * 3 + 2);
  assert.equal(sworn.byId.get('kagi').status, null);
});

test('in skilled sandbox fights, AI Kin, Hiss, Move and Relay rules all hold and Quick Pile-Ons are offered only per DR-30', () => {
  for (const seed of [1, 2, 3, 4]) {
    const enc = createEncounter('sandbox', { seed, showcase: true });
    const bot = withCommandQueue(skilledBot());
    const events = [];
    for (let i = 0; i < T * 120 && enc.mode !== 'ended'; i++) {
      const evs = enc.step(bot(enc, i)); events.push(...evs);
      const kin = enc.byId.get('kinako');
      if (enc.controlledId !== 'kinako') assert.notEqual(kin.ai.targetId, 'sasa', 'Kinako never targets her Kin');
      const o = enc.offer;
      if (o && o.type === 'quick') assert.ok(o.cluster.length >= 2 || enc.enemies().filter(e => enc.standing(e)).length === 1);
      for (const e of evs) if (e.type === 'MoveUsed' && e.authored === 'ai' && enc.byId.get(e.user).side !== 'enemy') {
        assert.notEqual(DATA.moves[e.move].ai_use, 'command_only'); assert.ok(e.paws_after >= 100 - 1e-9, 'AI never spends its last Paw');
      }
      for (const e of evs) if (e.type === 'HissInterrupt' && e.authored === 'ai') assert.equal(e.aimed_at, e.cat, 'AI Hisses only yellows aimed at itself');
    }
    // Relay bookkeeping (§3.3, edge 8).
    let r = null;
    for (const e of events.filter(e => e.type === 'TagIn')) {
      assert.ok(e.relay_count >= 1 && e.relay_count <= 4);
      if (e.relay_count === 1) r = { starter: e.from, members: [e.to], n: 1 };
      else { assert.equal(e.relay_count, r.n + 1); assert.ok(!r.members.includes(e.to) || e.to === r.starter); r.members.push(e.to); r.n++; }
    }
    for (const e of events.filter(e => e.type === 'PileOnEnd' && e.pile_type === 'quick')) assert.ok(e.routed.length >= 1);
    assert.equal(enc.outcome, 'win');
  }
});

test('a scripted Daifuku bout knocks him off deterministically, clamps at 70%, defers the break past Frazzle, and ends rival_fled', () => {
  const enc = createEncounter('daifuku_bout', { seed: 2, showcase: true });
  const b = enc.byId.get('daifuku');
  const { events } = run(enc, withCommandQueue(daifukuBot()), T * 200);
  const pb = events.findIndex(e => e.type === 'PhaseBreak');
  assert.ok(pb >= 0);
  assert.ok(events.filter(e => e.type === 'KnockOff').length >= 1);
  assert.ok(!events.some(e => e.type === 'Splat' && e.cat === 'daifuku'), 'a Boss is never Splatted');
  for (const e of events.slice(0, pb)) if (e.type === 'Hit' && e.target === 'daifuku') assert.ok(e.nerve >= Math.ceil(b.nerveMax * 0.7));
  const lastFr = events.slice(0, pb).filter(e => e.type === 'Frazzled' || e.type === 'FrazzleEnded').pop();
  assert.ok(!lastFr || lastFr.type === 'FrazzleEnded', 'no break while Frazzled');
  assert.equal(enc.outcome, 'rival_fled');
  const end = events.find(e => e.type === 'EncounterEnded');
  assert.equal(end.reason, 'phase_break'); assert.equal(end.rival, 'daifuku');
});

test('a wipe Gloats then hands off exactly one EncounterEnded(loss) naming the victor, and writes no data', () => {
  const before = hashOf(DATA.cats);
  const enc = createEncounter('lose_to_daifuku', { seed: 1, showcase: true });
  const { events } = run(enc, () => ({}), T * 300);
  const ends = events.filter(e => e.type === 'EncounterEnded');
  assert.equal(ends.length, 1); assert.equal(ends[0].outcome, 'loss'); assert.deepEqual(ends[0].victor_ids, ['daifuku']);
  const gl = events.find(e => e.type === 'Gloat');
  assert.ok(ends[0].t - gl.t <= 3 + 1e-9 && ends[0].t > gl.t);
  assert.equal(hashOf(DATA.cats), before, 'Combat writes no record');
});

test('tutorial fights cannot be lost and Scram ends player_fled after 3 s outside the ring', () => {
  const tut = createEncounter('two_strays', { seed: 1, showcase: true });
  const r = run(tut, () => ({}), T * 200);
  assert.notEqual(tut.outcome, 'loss');
  assert.ok(!r.events.some(e => e.type === 'Gloat'));
  const enc = createEncounter('toughs_2', { seed: 1 });
  const out = run(enc, (e) => ({ move: [0, 1] }), T * 30);
  assert.equal(enc.outcome, 'player_fled');
  const end = out.events.find(e => e.type === 'EncounterEnded'); assert.equal(end.by, 'ring');
});

test('Slow Blink runs the sim at 5% and commanded Moves spend Paws only when they commit', () => {
  const enc = createEncounter('tough_focus', { seed: 2 });
  stepN(enc, T * 3 + 1);
  enc.byId.get('mikan').paws = 150;
  enc.step({ slowBlink: true });
  const t0 = enc.simT; enc.step({}); assert.ok(Math.abs(enc.simT - t0 - (1 / T) * 0.05) < 1e-12);
  const q = enc.step({ command: { cat: 'mikan', move: 'face_swat', target: 'goma' } });
  assert.ok(q.some(e => e.type === 'CommandQueued'));
  const q2 = enc.step({ command: { cat: 'mikan', move: 'bunny_kick', target: 'goma' } });
  assert.ok(q2.some(e => e.type === 'CommandRejected' && e.reason === 'paws'), 'pending orders reserve Paws');
  const p = enc.byId.get('mikan').paws; assert.ok(p >= 150 && p < 151, `not spent before commit (${p})`);
  enc.step({ slowBlink: true });
  const evs = stepN(enc, T * 3);
  const used = evs.find(e => e.type === 'MoveUsed' && e.move === 'face_swat');
  assert.ok(used); assert.equal(used.authored, 'player');
  assert.ok(evs.some(e => e.type === 'Ruffled' && e.cat === 'goma'));
});

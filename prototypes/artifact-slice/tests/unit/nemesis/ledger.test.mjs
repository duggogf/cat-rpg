// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Grudge/Regard ledger against Nemesis §3.5 and F1 (per-encounter caps, Verdict overrides, rounding .5 up),
// with the §3.16 worked story and Crew F6/F8 as the Verdict prompt shows them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { ledger, applyLedger, round, bribe, startingLoyalty, drift, scarChance, joinChance } from '../../../src/sim/nemesis/formulas.js';
import { createTown, ARC, K, atL1D2Verdict, mark } from './helpers.mjs';

const E = K.ledger_events;
const it = (...rows) => rows.map(r => ({ row: r, ...E[r] }));

test('§3.5 table rows and F1 rounding (nearest, .5 up)', () => {
  assert.equal(round(9.6), 10); assert.equal(round(21.5), 22); assert.equal(round(5.6), 6); assert.equal(round(12.6), 13);
  assert.deepEqual([E.routed.g, E.by_pile_on.g, E.fear_this_fight.g, E.fear_this_fight.r, E.ambushed_by_player.g, E.ambushed_by_player.r,
    E.clean_win.r, E.keeper_marked.g, E.fled.g, E.won.g, E.won.r, E.won.r_stalwart, E.joined_in_win.r_flat, E.player_fled.r],
  [6, 3, 3, -2, 3, -3, 8, 6, 8, 5, -10, 10, 5, -8]);
  assert.equal(E.verdict_recruit.g, 'halve'); assert.equal(E.verdict_nose.g, 'zero'); assert.equal(E.verdict_nose.r, 25); assert.equal(E.verdict_recruit.r, 10);
});

test('F1 worked examples: Togemaru L1D1 flee 15 → 25; L1D2 pending 43 / Regard 16', () => {
  const L1 = ledger(K, 'braggart', 1, it('fled'));
  assert.equal(L1.dG, 10);
  assert.deepEqual(applyLedger(K, 15, 10, L1), { grudge: 25, regard: 10 });
  const L2 = ledger(K, 'braggart', 2, it('routed', 'by_pile_on', 'keeper_marked', 'clean_win'));
  assert.equal(L2.dG, 18); assert.equal(L2.dR, 6);
  assert.deepEqual(applyLedger(K, 25, 10, L2), { grudge: 43, regard: 16 });
});

test('Verdict overrides: Nose-Touch → G 0, R 33; Recruit → G 22, R 23 (§3.16)', () => {
  const rout = it('routed', 'by_pile_on', 'keeper_marked', 'clean_win');
  assert.deepEqual(applyLedger(K, 25, 10, ledger(K, 'braggart', 2, [...rout, ...it('verdict_nose')])), { grudge: 0, regard: 33 });
  assert.deepEqual(applyLedger(K, 25, 10, ledger(K, 'braggart', 2, [...rout, ...it('verdict_recruit')])), { grudge: 22, regard: 23 });
});

test('Per-encounter cap (DR-39): ≤ 35 on encounters 1–2, ≤ 20 after; the F1 extreme 21 × 1.2 = 25', () => {
  const extreme = it('routed', 'by_pile_on', 'fear_this_fight', 'ambushed_by_player', 'keeper_marked');
  assert.equal(ledger(K, 'braggart', 2, extreme).dG, 25);
  assert.equal(ledger(K, 'braggart', 3, extreme).dG, 20);
  assert.equal(ledger(K, 'braggart', 1, [...extreme, ...it('fled', 'routed')]).dG, 35);
  assert.deepEqual(applyLedger(K, 95, 98, ledger(K, 'stalwart', 1, [...it('clean_win', 'verdict_nose')])).regard, 100, 'clamped 0-100');
  assert.equal(ledger(K, 'stalwart', 1, it('clean_win', 'verdict_nose')).dR, 50, '(8 + 25) × 1.5 = 49.5 → 50');
  assert.equal(ledger(K, 'fraidy', 1, [{ row: 'won', g: 5, r: -10 }, ...it('ambushed_by_player', 'fear_this_fight')]).dR, -15);
});

test('Crew F8 Bribe and F6 starting Loyalty (worked examples)', () => {
  assert.deepEqual(bribe(K, { level: 6, role: 'captain', life: 2 }), { free: false, fair: 96, feast: 192 });
  assert.deepEqual(bribe(K, { level: 8, role: 'boss', life: 2 }), { free: false, fair: 256, feast: 512 });
  assert.equal(bribe(K, { level: 2, role: 'tough', life: 1 }).free, true);
  assert.deepEqual(startingLoyalty(K, { gPre: 43, regard: 23, personality: 'braggart', bribeStep: 1 }), { value: 44, tier: 'Aloof' });
  assert.equal(startingLoyalty(K, { gPre: 40, regard: 20, personality: 'schemer', bribeStep: 2 }).value, 45);
  assert.equal(startingLoyalty(K, { gPre: 30, regard: 60, personality: 'brooder', bribeStep: 1 }).value, 56);
});

test('F2 drift, F7 Scar chance, F11 join chance', () => {
  assert.equal(drift(K, { grudge: 46, personality: 'goofball', quiet: true, lead: false }), 44);
  assert.equal(drift(K, { grudge: 46, personality: 'brooder', quiet: true, lead: false }), 45);
  assert.equal(drift(K, { grudge: 46, personality: 'braggart', quiet: true, lead: true }), 46, 'the open arc lead does not decay');
  assert.equal(scarChance(K, { catId: 'goma', routsByPlayer: 1, byPileOn: true, scarsFromMikan: 0 }), 0.5);
  assert.equal(scarChance(K, { catId: 'goma', routsByPlayer: 2, byPileOn: false, scarsFromMikan: 0 }), 1);
  assert.equal(scarChance(K, { catId: 'togemaru', routsByPlayer: 1, byPileOn: false, scarsFromMikan: 0 }), 1);
  assert.equal(scarChance(K, { catId: 'goma', routsByPlayer: 3, byPileOn: true, scarsFromMikan: 2 }), 0);
  assert.equal(joinChance(K, { near: true, regard: 33 }), 0.5);
  assert.equal(joinChance(K, { near: true, regard: 80 }), 0.65);
});

test('The town ledger reproduces §3.16 by the rules (L1D1 → L1D2 pending)', () => {
  const t = createTown({ seed: 3 });
  ARC.l1d1(t);
  const tg = t.cat('togemaru');
  assert.deepEqual([tg.grudge, tg.regard, tg.encounters], [25, 10, 1]);
  assert.deepEqual(tg.memory.map(e => e.kind), ['FIRST_MEETING', 'FLED']);
  ARC.night(t, 1);
  assert.equal(tg.grudge, 25, 'no decay while his arc is open');
  ARC.l1d2(t);
  const o = t.verdictOffer();
  assert.equal(o.cat, 'togemaru'); assert.equal(o.g_pending, 43); assert.equal(o.r_pending, 16);
  assert.deepEqual(o.slipped_away, ['goma']);
  assert.equal(t.cat('daifuku').anger, 25, 'anger +5 +5 +15 (F10)');
});

test('Scram: Regard −8 × m_r for the cats present, Grudge 0; anger not spent', () => {
  const t = createTown({ seed: 2 });
  t.onTerritory([mark('LPY', 'counter_spray'), mark('LPY', 'counter_spray')]);
  const d = t.cat('daifuku'), g = t.cat('goma');
  const [G, R] = [g.grudge, g.regard];
  t.beginEncounter({ patch: 'PA', opponents: ['goma', 'daifuku'] });
  t.endEncounter({ outcome: 'player_fled' });
  assert.equal(g.grudge, G); assert.equal(g.regard, R + Math.round(0.8 * -8));
  assert.equal(d.anger, 30, 'Scram does not spend anger');
});

test('Loss: only the victor: +5 / −10 through F1, WON, its Glory Title; Boss anger spent; Mikan plastered tomorrow', () => {
  const t = createTown({ seed: 2 });
  t.onTerritory([mark('LPY', 'counter_spray'), mark('LPY', 'counter_spray')]);
  t.beginEncounter({ patch: 'LPY', opponents: ['daifuku', 'goma'] });
  t.routed('mikan', { by: 'daifuku' });
  const ev = t.endEncounter({ outcome: 'loss', victor_ids: ['daifuku', 'goma'] });
  const d = t.cat('daifuku');
  assert.equal(ev.find(e => e.type === 'VictorRecorded').cat, 'daifuku');
  assert.equal(d.grudge, 15 + Math.round(1.1 * 5)); assert.equal(d.regard, 10 + Math.round(0.8 * -10));
  assert.equal(d.title, 'Collar-Biter'); assert.equal(d.anger, 0); assert.equal(d.rematch_nerve, -0.1);
  assert.ok(d.memory.some(e => e.kind === 'WON'));
  assert.equal(t.s.mikan_plaster_day, t.day + 1);
});

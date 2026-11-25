// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// F4 Nose-Touch gate (OR-13.1; consistency pass F12; AC 30) and the three-card Verdict offer (key-screens §4.2).
import test from 'node:test';
import assert from 'node:assert/strict';
import { noseGate } from '../../../src/sim/nemesis/formulas.js';
import { createTown, ARC, K, atL1D2Verdict, mark, lifeTwo } from './helpers.mjs';

/** A Life 2 Tofu Shop Step take on Kagi (Keeper, Schemer, G 15) with n Counter-Sprays on his own post. */
function kagiTake(counterSprays, { otherPostSprays = 0 } = {}) {
  const t = lifeTwo(createTown({ seed: 4 }));
  t.onTerritory([mark('TSS', 'over_mark'), mark('TSS', 'over_mark')]);
  for (let i = 0; i < counterSprays; i++) t.onTerritory([mark('TSS', 'counter_spray')]);
  for (let i = 0; i < otherPostSprays; i++) t.onTerritory([mark('PA', 'counter_spray')]);
  t.beginEncounter({ patch: 'TSS', posse: ['mikan', 'hige'], opponents: ['kagi'] });
  t.routed('kagi', { by: 'mikan' });
  t.endEncounter({ outcome: 'win' });
  return t.verdictOffer();
}

test('Togemaru L1D2 after a clean Special finish: 43 < 45 → Nose-Touch open, tail still', () => {
  const o = atL1D2Verdict().verdictOffer();
  assert.equal(o.g_pending, 43); assert.equal(o.cards.nose.gate, 45);
  assert.equal(o.cards.nose.available, true); assert.equal(o.cards.nose.tell, 'tail_still');
  assert.equal(o.cards.nose.chip, '10 days');
});

test('Togemaru L1D2 with an Ambush opener: 25 + round(1.2 × 18) = 47 ≥ 45 → closed on Grudge', () => {
  const o = atL1D2Verdict({ ambush: true }).verdictOffer();
  assert.equal(o.g_pending, 47);
  assert.equal(o.cards.nose.available, false); assert.equal(o.cards.nose.reason, 'grudge');
  assert.equal(o.cards.nose.reason_text, 'Tail lashing. Not today.'); assert.equal(o.cards.nose.tell, 'tail_lashing');
});

test('Life 1 is exempt from the quiet-take clause: two Counter-Sprays on his own post keep the card open', () => {
  const o = atL1D2Verdict({ counterSprays: 2 }).verdictOffer();
  assert.equal(o.n_counter_own, 2); assert.equal(o.cards.nose.available, true);
});

test('A loud take closes a Life 2 Keeper\'s card: Kagi after 2 Counter-Sprays on his own post', () => {
  const quiet = kagiTake(1), loud = kagiTake(2);
  assert.ok(quiet.g_pending < 50 && loud.g_pending < 50, 'his Grudge is under the gate either way');
  assert.equal(quiet.cards.nose.available, true);
  assert.equal(loud.cards.nose.available, false); assert.equal(loud.cards.nose.reason, 'loud');
  assert.equal(loud.cards.nose.reason_text, 'Too much of your stink on its post.');
});

test('Counter-Sprays on another post do not count toward a Keeper\'s loud take', () => {
  assert.equal(kagiTake(1, { otherPostSprays: 3 }).cards.nose.available, true);
});

test('A Boss met Seething closes the card ("Still steaming"); met Riled it opens on his Grudge', () => {
  for (const [sprays, open] of [[2, true], [4, false]]) {
    const t = lifeTwo(createTown({ seed: 5 }));
    for (let i = 0; i < sprays; i++) t.onTerritory([mark('TSS', 'counter_spray')]);
    t.beginEncounter({ patch: 'LPY', opponents: ['daifuku'] });
    t.routed('daifuku', { by: 'mikan' });
    t.endEncounter({ outcome: 'win' });
    const o = t.verdictOffer();
    assert.equal(o.anger_stage_at_standoff, open ? 'Riled' : 'Seething');
    assert.equal(o.cards.nose.available, open);
    if (!open) assert.equal(o.cards.nose.reason_text, 'Still steaming. Not today.');
    assert.equal(t.cat('daifuku').anger, 0, 'the fight spent his anger');
  }
});

test('F4 formula: the gate is base 50 + personality shift; no roll', () => {
  const g = p => noseGate(K, { gPending: 0, personality: p, life: 1, keeper: false, nCounterOwn: 0, boss: false, angerStageAtStandoff: null }).gate;
  assert.deepEqual(['stalwart', 'goofball', 'fraidy', 'schemer', 'brooder', 'braggart'].map(g), [65, 60, 55, 50, 45, 45]);
});

test('The gate reads only the cat\'s own record: perturbing other cats changes nothing', () => {
  const a = atL1D2Verdict({ seed: 9 }).verdictOffer();
  const t = createTown({ seed: 9 });
  ARC.l1d1(t); ARC.night(t, 1);
  for (const id of ['goma', 'sasa', 'kagi']) { t.cat(id).grudge = 99; t.cat(id).regard = 0; }
  t.onTerritory([mark('TSS', 'counter_spray'), mark('PA', 'counter_spray')]);
  ARC.l1d2(t);
  const b = t.verdictOffer();
  assert.deepEqual(b.cards.nose, a.cards.nose); assert.equal(b.g_pending, a.g_pending);
});

test('Three cards: Chase Off always; Recruit free in Life 1 with its tier; greyed for a non-recruitable cat', () => {
  const o = atL1D2Verdict().verdictOffer();
  assert.equal(o.cards.chase.available, true); assert.equal(o.cards.chase.line, 'Gone from town for good.');
  assert.equal(o.cards.recruit.available, true); assert.equal(o.cards.recruit.chip, 'Free');
  assert.deepEqual(o.cards.recruit.tiers.map(x => [x.step, x.value, x.tier]), [['free', 44, 'Aloof']]);
  assert.equal(o.hint, 'Chasing off is for good.'); assert.ok(o.hint.split(/\s+/).length <= 6, 'first-Verdict hint ≤ 6 words');
  const t = createTown({ seed: 1 });
  t.beginEncounter({ patch: 'PA', opponents: ['goma'] }); t.routed('goma', { by: 'mikan' }); t.endEncounter({ outcome: 'win' });
  const g = t.verdictOffer().cards.recruit;
  assert.equal(g.available, false); assert.equal(g.reason_text, 'Turns its tail to the bell.'); assert.equal(g.tell, 'tail_to_bell');
});

test('Life 2 Recruit shows Fair and Feast prices with tiers; a short Stash greys it', () => {
  const t = lifeTwo(createTown({ seed: 4 }));
  t.setStash(72);
  t.beginEncounter({ patch: 'TSS', opponents: ['kagi'] }); t.routed('kagi', { by: 'mikan' }); t.endEncounter({ outcome: 'win' });
  const r = t.verdictOffer().cards.recruit;
  assert.deepEqual([r.bribe.fair, r.bribe.feast], [96, 192]); assert.equal(r.chip, 'from 96');
  assert.deepEqual(r.tiers.map(x => x.step), ['fair', 'feast']);
  assert.equal(r.available, false); assert.equal(r.reason_text, 'Stash short: 72 of 96.');
  assert.equal(r.tell, 'eyes_lean', 'a short Stash is not the cat refusing: it still eyes the fish (review round 1)');
});

/** Rout one cat in a Life 2 town and return its Recruit card. */
function lifeTwoRecruit(id, { stash = 150, seed = 4, patch = 'LPY' } = {}) {
  const t = lifeTwo(createTown({ seed }));
  t.setStash(stash);
  t.beginEncounter({ patch, posse: ['mikan', 'hige', 'pon', 'kinako'], opponents: [id] }); t.routed(id, { by: 'mikan' }); t.endEncounter({ outcome: 'win' });
  return t.verdictOffer().cards.recruit;
}

test('Life 2 Recruit is greyed per cat, not per Life: Goma and the challenger turn their tails; Togemaru is open (OR-15)', () => {
  const g = lifeTwoRecruit('goma');
  assert.equal(g.available, false); assert.equal(g.reason, 'recruit_not_slice'); assert.equal(g.tell, 'tail_to_bell');
  const s = createTown({ seed: 4, start: 'showcase_l2d2', branch: 'B' });
  s.setStash(150);
  s.beginEncounter({ patch: 'LPY', posse: ['mikan', 'hige', 'pon', 'kinako'], opponents: ['challenger'] }); s.routed('challenger', { by: 'mikan' }); s.endEncounter({ outcome: 'win' });
  const c = s.verdictOffer();
  assert.equal(c.life, 2); assert.equal(c.cards.recruit.reason, 'recruit_not_slice'); assert.equal(c.cards.recruit.tell, 'tail_to_bell');
  const tg = lifeTwoRecruit('togemaru');
  assert.equal(tg.available, true); assert.equal(tg.reason, null); assert.equal(tg.tell, 'eyes_lean');
  assert.deepEqual(tg.tiers.map(x => [x.step, x.price]), [['fair', 16], ['feast', 32]], 'Lv 2 Tough: fair 8 × 2 × 1, feast 2 × fair');
});

test('A refusing gate bares its teeth: Daifuku in Life 2 below Regard 50 ("doesn\'t rate you yet")', () => {
  const r = lifeTwoRecruit('daifuku');
  assert.equal(r.available, false); assert.equal(r.reason, 'recruit_boss'); assert.equal(r.tell, 'bares_teeth');
  assert.equal(r.reason_text, "Daifuku doesn't rate you yet.");
});

test('Test start test_l2_kagi_rout: a real Life 2 Bribe offer on Kagi (mock 07: Fair 96 open, Feast 192 short, Crew 4/6)', () => {
  const t = createTown({ seed: 42, start: 'test_l2_kagi_rout' });
  assert.equal(t.life, 2);
  const o = t.verdictOffer();
  assert.equal(o.cat, 'kagi'); assert.equal(o.life, 2);
  const r = o.cards.recruit;
  assert.equal(r.available, true); assert.equal(r.tell, 'eyes_lean'); assert.equal(r.chip, 'from 96');
  assert.deepEqual(r.tiers.map(x => [x.step, x.price]), [['fair', 96], ['feast', 192]]);
  assert.equal(r.stash, 150); assert.ok(r.tiers[0].price <= r.stash && r.tiers[1].price > r.stash, 'Fair affordable, Feast short');
  assert.deepEqual([r.crew, r.crew_cap], [4, 6]);
  assert.equal(o.cards.nose.available, true, 'a quiet take keeps his gate open');
  assert.equal(t.cat('togemaru').state, 'Crew', 'played from branch B by the rules');
});

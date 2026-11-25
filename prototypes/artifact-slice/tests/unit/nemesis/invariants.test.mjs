// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The patent working rule (nemesis-patent-analysis.md §5; Nemesis AC 26-28; plan §2.4, §5.2): a Verdict, a join-in,
// a loss and an anger change each leave every cat other than their subject(s) byte-identical. Every other cat is
// hashed before and after. Plus the night counterfactual (AC 28) and read-only display (AC 25).
import test from 'node:test';
import assert from 'node:assert/strict';
import { Stream } from '../../../src/sim/core/rng.js';
import { createTown, ARC, atL1D2Verdict, othersHash, mark, lifeTwo } from './helpers.mjs';

const changedIds = (a, b) => Object.keys(b).filter(id => a[id] !== b[id]);

for (const v of ['nose', 'recruit', 'chase']) {
  test(`Verdict ${v} on Togemaru (L1D2) changes no cat but Togemaru`, () => {
    const t = atL1D2Verdict({ seed: 11 });
    const before = t.catHashes();
    t.applyVerdict(v);
    const after = t.catHashes();
    assert.deepEqual(changedIds(before, after), ['togemaru']);
  });
}

test('Verdicts on Daifuku (a Boss) and on the challenger change no cat but their subject', () => {
  for (const v of ['nose', 'chase']) {
    const t = lifeTwo(createTown({ seed: 12 }));
    t.beginEncounter({ patch: 'LPY', opponents: ['daifuku'] }); t.routed('daifuku', { by: 'mikan' }); t.endEncounter({ outcome: 'win' });
    const before = t.catHashes(); t.applyVerdict(v);
    assert.deepEqual(changedIds(before, t.catHashes()), ['daifuku']);
    const s = createTown({ seed: 12, start: 'showcase_l2d2', branch: 'B' });
    s.beginEncounter({ patch: 'LPY', opponents: ['challenger', 'stray'] }); s.routed('challenger', { by: 'mikan' }); s.endEncounter({ outcome: 'win' });
    const b2 = s.catHashes(); s.applyVerdict(v);
    assert.deepEqual(changedIds(b2, s.catHashes()), ['challenger']);
  }
});

test('Join-in: the opposing Rival and every bystander are identical with or without the joiner (G7)', () => {
  const fight = withJoin => {
    const t = createTown({ seed: 13, start: 'showcase_l2d2', branch: 'A' });
    if (!withJoin) t.cat('togemaru').joined_day = t.day; // makes ONLY the joiner ineligible
    const ev = t.beginEncounter({ patch: 'LPY', posse: ['mikan', 'hige', 'pon', 'kinako'], opponents: ['challenger', 'stray'] });
    t.routed('challenger', { by: 'mikan', how: 'by_pile_on' });
    t.endEncounter({ outcome: 'win' });
    t.applyVerdict('chase');
    return { t, joined: ev.some(e => e.type === 'AllyJoined') };
  };
  const a = fight(true), b = fight(false);
  assert.equal(a.joined, true); assert.equal(b.joined, false);
  const ha = othersHash(a.t, ['togemaru']), hb = othersHash(b.t, ['togemaru']);
  assert.deepEqual(ha, hb);
  const j = a.t.cat('togemaru');
  assert.equal(j.regard, 33 + 5, '+5 Regard on the win, flat'); assert.ok(j.memory.some(e => e.kind === 'JOINED_IN'));
});

test('Join-in inside one encounter changes only the joiner and the cats in the fight', () => {
  const t = createTown({ seed: 14, start: 'showcase_l2d2', branch: 'A' });
  const before = t.catHashes();
  t.beginEncounter({ patch: 'LPY', opponents: ['challenger', 'stray'] });
  t.routed('challenger', { by: 'mikan' }); t.endEncounter({ outcome: 'win' }); t.applyVerdict('nose');
  assert.deepEqual(changedIds(before, t.catHashes()).sort(), ['challenger', 'togemaru']);
});

test('An anger change (MarkApplied on his own gang\'s post) changes no cat but the Boss; a Stray\'s post changes nobody', () => {
  const t = createTown({ seed: 15 });
  let before = t.catHashes();
  const ev = t.onTerritory([mark('LPY', 'counter_spray'), mark('LPY', 'counter_spray')]);
  assert.ok(ev.some(e => e.type === 'AngerChanged'));
  assert.deepEqual(changedIds(before, t.catHashes()), ['daifuku']);
  before = t.catHashes();
  t.onTerritory([mark('LWC', 'counter_spray', 'strays'), mark('LPY', 'claim_spray', 'bell'), mark('LPY', 'rescue_spray', 'bell')]);
  assert.deepEqual(changedIds(before, t.catHashes()), []);
});

test('A loss changes no cat but the victor', () => {
  const t = lifeTwo(createTown({ seed: 16 }));
  t.beginEncounter({ patch: 'PA', opponents: ['goma', 'sasa', 'kuri'] });
  t.routed('sasa', { by: 'mikan' }); t.routed('mikan', { by: 'goma' });
  const before = t.catHashes();
  t.endEncounter({ outcome: 'loss', victor_ids: ['goma', 'kuri'] });
  assert.deepEqual(changedIds(before, t.catHashes()), ['goma']);
});

test('Anger never moves on combat events except the reset to 0 (AC 26); Scram leaves it', () => {
  const t = createTown({ seed: 17 });
  t.onTerritory([mark('LPY', 'counter_spray')]);
  t.onCombat([{ type: 'EncounterStarted', opener: 'standoff', posse: ['mikan'], enemies: ['goma', 'daifuku'] }], { patch: 'LPY' });
  t.onCombat([{ type: 'CatRouted', cat: 'goma', by: 'mikan', how: 'by_pile_on', side: 'enemy' }, { type: 'FearTriggered', cat: 'daifuku', fear: 'water', source: 'bucket' }]);
  assert.equal(t.cat('daifuku').anger, 15);
  t.onCombat([{ type: 'EncounterEnded', outcome: 'player_fled', victor_ids: [] }]);
  assert.equal(t.cat('daifuku').anger, 15);
  t.onCombat([{ type: 'EncounterStarted', opener: 'standoff', posse: ['mikan'], enemies: ['daifuku'] }, { type: 'EncounterEnded', outcome: 'rival_fled' }], { patch: 'LPY' });
  assert.equal(t.cat('daifuku').anger, 0);
});

test('Property: 1,000 seeded encounters and Verdicts never change a cat outside their subjects', () => {
  const LANE = ['togemaru', 'goma', 'sasa', 'kuri', 'azuki', 'kagi', 'ohagi', 'daifuku', 'nori', 'tsubu'];
  const ROUND_SEEDS = 40;
  let checks = 0;
  for (let seed = 1; seed <= ROUND_SEEDS; seed++) {
    const t = createTown({ seed });
    const r = new Stream(seed, 'property');
    for (let n = 0; n < 25; n++) {
      if (r.chance(0.15)) ARC.night(t, t.day);
      const pool = LANE.filter(id => t._isTracked(id));
      if (!pool.length) break;
      const opp = pool.filter(() => r.chance(0.3)); if (!opp.length) opp.push(r.pick(pool));
      if (r.chance(0.3)) t.onTerritory([mark(r.pick(['LPY', 'PA', 'TSS']), r.pick(['over_mark', 'counter_spray']))]);
      const before = t.catHashes();
      t.beginEncounter({ patch: r.pick(['LPY', 'PA', 'TSS']), opener: r.pick(['standoff', 'standoff', 'ambush']), posse: ['mikan', 'hige'], opponents: opp });
      for (const id of opp) { if (r.chance(0.2)) t.fear(id, r.pick(['water', 'loud_noise'])); if (r.chance(0.7)) t.routed(id, { by: r.pick(['mikan', 'hige']), how: r.pick(['by_hit', 'by_pile_on']) }); }
      if (r.chance(0.1)) t.routed('mikan', { by: opp[0] });
      const outcome = r.pick(['win', 'win', 'win', 'loss', 'rival_fled', 'player_fled']);
      const enc = t.s.enc;
      t.endEncounter({ outcome, victor_ids: opp });
      const allowed = new Set([...opp, ...enc.posse, ...(enc.joiner ? [enc.joiner] : [])]); // the cats in the fight (a recruit's own Old Gang line is its own)
      const mid = t.catHashes();
      for (const id of changedIds(before, mid)) assert.ok(allowed.has(id), `seed ${seed} enc ${n}: ${id} changed outside the encounter`);
      checks++;
      const off = t.verdictOffer();
      if (off) {
        const avail = Object.entries(off.cards).filter(([, c]) => c.available).map(([k]) => k);
        t.applyVerdict(r.pick(avail));
        assert.deepEqual(changedIds(mid, t.catHashes()).filter(id => id !== off.cat), [], `seed ${seed}: a Verdict changed another cat`);
        checks++;
      }
    }
  }
  assert.ok(checks >= 1000, `ran ${checks} checks`);
});

test('Night counterfactual (AC 28): perturbing one cat\'s record changes no other cat after step 3', () => {
  for (const [seed, night] of [[21, 1], [22, 2], [23, 3], [24, 5]]) {
    for (const victim of ['goma', 'kagi', 'togemaru', 'daifuku', 'sasa']) {
      const build = () => { const t = createTown({ seed }); ARC.l1d1(t); while (t.day < night) ARC.night(t, t.day); return t; };
      const a = build(), b = build();
      Object.assign(b.cat(victim), { grudge: 88, regard: 3, encounters: 7, routs_by_player: 2 });
      b.cat(victim).scars.push({ type: 'kink', day: 0, serial: 0 });
      ARC.night(a, night); ARC.night(b, night);
      assert.deepEqual(othersHash(b, [victim]), othersHash(a, [victim]), `night ${night}, perturbed ${victim}`);
    }
  }
});

test('Display is read-only (AC 25): board, tags, cards, boardView and an unconsumed Sniff change nothing', () => {
  const t = createTown({ seed: 25, start: 'showcase_l2d2', branch: 'A' });
  const h = t.hash();
  t.board(); t.boardView(); t.sniff();
  for (const id of Object.keys(t.s.cats)) { t.tags(id); t.nameCard(id); t.rivalCard(id); t.combatProfile(id); }
  t.snapshot();
  assert.equal(t.hash(), h);
});

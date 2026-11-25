// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Togemaru's arc over L1D1-L1D2 and the three Life 2 snapshots (plan §2.2-§2.3; Nemesis §3.16; consistency pass F11):
// one run per Verdict (A Nose-Touch, B Recruit, C Chase Off) checks the stored state and the snapshot. Plus Scars,
// the memory line, Memory caps, the Declaration, the challenger and determinism.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createTown, ARC, K, atL1D2Verdict, ofType } from './helpers.mjs';

test('L1D1: STANDOFF_FIRST "Nice bell, Collar…", the uninterruptible flee, discovery by encounter', () => {
  const t = createTown({ seed: 1 });
  const ev = ARC.l1d1(t);
  const so = ofType(ev, 'Standoff')[0];
  assert.equal(so.trigger, 'STANDOFF_FIRST'); assert.equal(so.text, 'Nice bell, Collar. Does it ring when you run?');
  assert.deepEqual(ofType(ev, 'CatDiscovered').map(e => [e.cat_id, e.how]), [['togemaru', 'encounter']]);
  assert.equal(t.verdictOffer(), null, 'no Verdict on day 1');
  assert.equal(t.cat('daifuku').anger, 0, 'LWC is Stray-held: no anger (A-9)');
});

test('L1D2: a 1-item Sniff, the memory line (unskippable 1 s), the ear notch, the Verdict for Togemaru', () => {
  const t = createTown({ seed: 1 });
  ARC.l1d1(t); ARC.night(t, 1);
  const ev = ARC.l1d2(t);
  const sn = ofType(ev, 'Sniff')[0];
  assert.equal(sn.items.length, 1); assert.equal(sn.items[0].kind, 'arc_lead');
  const so = ofType(ev, 'Standoff')[0];
  assert.equal(so.text, 'I ran yesterday. Not off my own post, Collar.');
  assert.equal(so.n_mem, 1); assert.equal(so.unskippable_s, 1);
  assert.deepEqual(ofType(ev, 'ScarGained').filter(e => e.cat === 'togemaru').map(e => e.scar), ['notch'], 'his first Rout always scars; Claw → ear notch');
  assert.equal(ofType(ev, 'VerdictOffered')[0].cat, 'togemaru');
  assert.ok(t.cat('goma').memory.some(e => e.kind === 'SLIPPED_AWAY'));
});

const BR = { A: 'nose', B: 'recruit', C: 'chase' };
for (const b of ['A', 'B', 'C']) {
  test(`Branch ${b} (${BR[b]}): stored state and the Life 2 day 2 snapshot`, () => {
    const t = createTown({ seed: 31, start: 'showcase_l2d2', branch: b });
    const tg = t.cat('togemaru'), snap = t.snapshot();
    assert.equal(t.day, 4); assert.equal(t.life, 2); assert.equal(snap.day_label, 'L2 D2'); assert.equal(snap.branch, b);
    assert.deepEqual(tg.scars.map(s => s.type), ['notch']);
    assert.equal(tg.arc_achieved, true, 'every Verdict on him is an ending (F11)');
    assert.equal(t.cat('daifuku').anger, 95); assert.equal(snap.board.cats.find(c => c.id === 'daifuku').marks.puffs, 3);
    assert.equal(t.cat('kagi').state, 'Truce', 'plan §2.4 Kagi in truce');
    const ch = t.cat('challenger');
    assert.equal(ch.state, 'Challenging'); assert.equal(ch.challenge.patch_id, 'LPY'); assert.equal(ch.discovered, false);
    const sniff = t.sniff();
    assert.ok(sniff.items.length <= 3);
    assert.deepEqual(sniff.items.slice(1).map(i => i.kind), ['challenger', 'anger']);
    assert.equal(sniff.forecast.motive, 'challenge'); assert.equal(sniff.forecast.attackers[0].silhouette, true);
    const card = snap.board.cats.find(c => c.id === 'togemaru');
    if (b === 'A') {
      assert.deepEqual([tg.state, tg.grudge, tg.regard, tg.truce_until_day, tg.encounters], ['Truce', 0, 33, 12, 3]);
      assert.equal(tg.nemesis, true); assert.equal(tg.face, 'sworn_rival'); assert.equal(tg.declared_night, 3);
      assert.equal(sniff.items[0].kind, 'declaration'); assert.equal(sniff.items[0].title, 'Sworn Rival');
      assert.deepEqual(ch.relations.map(r => r.other_id), ['togemaru']);
      assert.equal(card.scene, 'lane'); assert.equal(card.drawn_mark, 'storm'); assert.equal(card.marks.sprig, 'truce');
    } else if (b === 'B') {
      assert.deepEqual([tg.state, tg.grudge, tg.regard, tg.loyalty], ['Crew', 22, 23, 44]);
      assert.equal(tg.arc_closed_how, 'crew'); assert.equal(tg.nemesis, false); assert.equal(tg.old_gang_nerves, false, 'a Braggart resists');
      assert.ok(tg.memory.some(e => e.kind === 'OLD_GANG' && e.other_id === 'daifuku'));
      assert.equal(sniff.items[0].title, 'Wears the bell now');
      assert.deepEqual(ch.relations.map(r => r.other_id), ['goma']);
      assert.equal(card.scene, 'bell'); assert.equal(card.old_spot.mark, 'knot');
      assert.equal(t.combatProfile('togemaru').old_boss_id, 'daifuku');
    } else {
      assert.equal(tg.state, 'Gone'); assert.equal(tg.arc_closed_how, 'gone');
      assert.equal(sniff.items[0].title, 'Run out of town');
      assert.deepEqual(ch.relations.map(r => r.other_id), ['goma']);
      assert.equal(card.legend, true); assert.equal(t.nameCard('togemaru').context.line, 'Run out of town');
    }
  });
}

test('Branch A L2D2: the challenger fight — Togemaru joins (p 1.0 showcase), the second Verdict has Recruit greyed', () => {
  const t = createTown({ seed: 32, start: 'showcase_l2d2', branch: 'A' });
  const ev = t.beginEncounter({ patch: 'LPY', posse: ['mikan', 'hige', 'pon', 'kinako'], opponents: ['challenger', 'stray'] });
  assert.equal(ofType(ev, 'Standoff')[0].trigger, 'CHALLENGE_STAKE');
  assert.equal(ofType(ev, 'AllyJoined')[0].cat, 'togemaru');
  assert.equal(t.cat('challenger').discovered, true);
  t.routed('challenger', { by: 'mikan' }); t.endEncounter({ outcome: 'win' });
  const o = t.verdictOffer();
  assert.equal(o.cards.recruit.available, false); assert.equal(o.cards.recruit.reason_text, 'Turns its tail to the bell.');
  const out = t.applyVerdict('chase');
  assert.equal(out[0].challenge_ended, true);
  assert.equal(t.cat('challenger').state, 'Gone');
});

test('Branch B: Togemaru in the Posse at Daifuku plays his own defiant line, no Cowed (§3.18)', () => {
  const t = createTown({ seed: 33, start: 'showcase_l2d2', branch: 'B' });
  const ev = t.beginEncounter({ patch: 'LPY', posse: ['mikan', 'hige', 'togemaru'], opponents: ['daifuku'] });
  const r = ofType(ev, 'OldGangReaction');
  assert.deepEqual(r.map(x => [x.cat, x.kind, x.cowed_s]), [['hige', 'defiant', 0], ['togemaru', 'defiant', 0]]);
  assert.equal(r[0].line.text, 'Not your cat anymore.');
});

test('Canon calendar (no showcase): Declaration on night 3 after the greeting; the challenger arrives night h + 2 = 5', () => {
  const t = createTown({ seed: 34 });
  ARC.l1d1(t); ARC.night(t, 1); ARC.l1d2(t); t.applyVerdict('nose'); ARC.night(t, 2);
  ARC.l2d1(t);
  const n3 = ARC.night(t, 3);
  assert.equal(ofType(n3, 'NemesisDeclared')[0].face, 'sworn_rival');
  assert.equal(ofType(n3, 'ChallengerArrived').length, 0);
  ARC.night(t, 4);
  const n5 = ARC.night(t, 5);
  assert.equal(ofType(n5, 'ChallengerArrived')[0].cat_id, 'challenger_5');
});

test('Deadline Declaration: a hostile Togemaru is declared at the night after L2D3 at the latest', () => {
  const t = createTown({ seed: 35 });
  ARC.l1d1(t);
  const evs = [];
  for (let n = 1; n <= 5; n++) evs.push(...ARC.night(t, n));
  assert.equal(ofType(evs, 'NemesisDeclared')[0].night, K.declaration.deadline_night);
});

test('Memory: ≤ 10 entries, ≤ 6 pinned, collapse of consecutive repeats (AC 18)', () => {
  const t = createTown({ seed: 36 });
  for (let n = 0; n < 30; n++) {
    t.beginEncounter({ patch: 'PA', opponents: ['goma'] }); t.endEncounter({ outcome: n % 3 ? 'rival_fled' : 'player_fled' });
    ARC.night(t, t.day);
  }
  const g = t.cat('goma');
  assert.ok(g.memory.length <= 10);
  assert.ok(g.memory.some(e => e.count > 1), 'consecutive repeats collapse');
  assert.equal(g.memory[0].kind, 'FIRST_MEETING', 'FIRST_MEETING is pinned');
});

test('Determinism: the same seed and inputs give the same hash; reloading reproduces Scars and join rolls', () => {
  const run = seed => { const t = createTown({ seed, start: 'showcase_l2d2', branch: 'A' });
    t.beginEncounter({ patch: 'LPY', opponents: ['challenger', 'stray'] }); t.routed('challenger', { by: 'hige', how: 'by_pile_on' }); t.endEncounter({ outcome: 'win' }); t.applyVerdict('nose');
    ARC.night(t, t.day); return t; };
  assert.equal(run(41).hash(), run(41).hash());
  assert.deepEqual(run(41).snapshot(), run(41).snapshot());
  const gen = seed => createTown({ seed }).cat('goma').grudge;
  const seen = new Set(); for (let s = 1; s <= 20; s++) seen.add(gen(s));
  assert.ok(seen.size > 1, 'procedural cats draw 10 + rng(0..10) per seed');
  for (let s = 1; s <= 20; s++) { const g = gen(s); assert.ok(g >= 10 && g <= 20); }
  assert.equal(createTown({ seed: 1 }).cat('togemaru').grudge, 15, 'Togemaru is fixed at 15 / 10');
});

test('Combat adapter: a real combat run (challenger_no_guest) feeds onCombat → a Verdict on the challenger', async () => {
  const { createEncounter } = await import('../../../src/sim/combat/index.js');
  const { skilledBot } = await import('../../smoke/combat/bots.mjs');
  const t = createTown({ seed: 51, start: 'showcase_l2d2', branch: 'C' });
  const enc = createEncounter('challenger_no_guest', { seed: 51, showcase: true });
  const bot = skilledBot();
  const out = [];
  for (let i = 0; i < 60 * 400 && enc.mode !== 'ended'; i++) out.push(...t.onCombat(enc.step(bot(enc, i)), { patch: 'LPY' }));
  const res = out.find(e => e.type === 'NemesisEncounterResolved');
  assert.ok(res, 'the encounter resolved');
  assert.equal(t.cat('challenger').discovered, true);
  assert.equal(res.outcome, 'win', 'the skilled bot wins on this seed');
  {
    assert.equal(t.verdictOffer().cat, 'challenger');
    const h = t.catHashes(); t.applyVerdict('chase');
    assert.deepEqual(Object.keys(h).filter(id => h[id] !== t.catHash(id)), ['challenger']);
  }
});

test('Each Verdict on Togemaru plays his own ending line (§3.15 / F11)', () => {
  const line = b => createTown({ seed: 52, start: 'showcase_l2d2', branch: b }).startLog.find(e => e.type === 'VerdictApplied' && e.rival_id === 'togemaru').line.text;
  assert.equal(line('A'), "Keep the post. I'll be back for it. Ten days.");
  assert.equal(line('C'), "Fine! I've got other walls. Better walls!");
  assert.match(line('B'), /crew|bell/i);
});

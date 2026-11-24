// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The marking verbs (Territory §3.3-3.4; OR-08): Rub/Over-mark, Counter-Spray, Claim Spray, Rescue Spray,
// the quiet and loud takes, the Keeper's arrival, the Den rule, PP-03, MarkApplied; Whisker Sense discovery.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createDistrict } from '../../../src/sim/territory/index.js';
import { districtWith, ofType, types } from './helpers.mjs';

const lane = () => districtWith({ LWC: 80 }, { day: 5 }); // L2D3: LPY, PA, TSS are the gang's at 80

test('Rubbing your own mark changes no Scent and marks only that Patch seen (AC 14)', () => {
  const t = lane();
  const ev = t.rub('LWC', 'LWC.rub1');
  assert.equal(t.scent('LWC'), 80);
  assert.deepEqual(types(ev), ['Rubbed']);
  assert.equal(t.s.patches.LWC.last_seen_day, 5);
  assert.equal(t.s.patches.PA.last_seen_day, null);
});

test('the quiet take: two unseen Over-marks (→ 60, no Bristle) and one Counter-Spray (→ 30) call the Keeper with one escort wave', () => {
  // Arrange
  const t = lane();
  // Act
  const e1 = t.rub('PA', 'PA.rub1'), e2 = t.rub('PA', 'PA.rub2');
  const scentAfterRubs = t.scent('PA');
  const e3 = t.spray('PA');
  // Assert
  assert.equal(scentAfterRubs, 60);
  assert.deepEqual([...e1, ...e2].filter(e => e.type === 'ContestBristled'), []);
  assert.equal(t.scent('PA'), 30);
  assert.deepEqual(ofType(e3, 'ContestBristled').map(e => e.waves), [0]);
  assert.deepEqual(ofType(e3, 'KeeperCalled').map(e => [e.keeper, e.escort_wave]), [['pa_tough', true]]);
});

test('the loud take: Counter-Spray → 50 Bristles with 2 waves; the second → 20 stops waves and calls the Keeper alone', () => {
  const t = lane();
  const e1 = t.spray('PA');
  const e2 = t.spray('PA');
  assert.deepEqual(ofType(e1, 'ContestBristled').map(e => e.waves), [2]);
  assert.equal(t.scent('PA'), 20);
  assert.deepEqual(types(e2).filter(x => /Waves|Keeper/.test(x)), ['TurfWavesStopped', 'KeeperCalled']);
  assert.equal(ofType(e2, 'KeeperCalled')[0].escort_wave, false);
});

test('a seen Over-mark Bristles (1 wave below 40); each Rub Mark is over-marked once per contest; a new contest resets it', () => {
  const t = districtWith({ LWC: 80, PA: ['wall_sitters', 45, 'pa_tough'] });
  const e1 = t.rub('PA', 'PA.rub1', { seen: true });
  assert.deepEqual(ofType(e1, 'ContestBristled').map(e => e.waves), [1]);
  assert.deepEqual(ofType(t.rub('PA', 'PA.rub1'), 'MarkRefused').map(e => e.reason), ['already_over_marked']);
  assert.equal(t.scent('PA'), 35);
  t.endContest('PA', 'left');
  t.rub('PA', 'PA.rub1');
  assert.equal(t.scent('PA'), 25);
});

test('Counter-Spray is repeatable and floors at 0; the Keeper stays until a Verdict', () => {
  const t = lane();
  for (let i = 0; i < 4; i++) t.spray('PA');
  assert.equal(t.scent('PA'), 0);
  assert.equal(t.patch('PA').keeper, 'pa_tough');
  assert.equal(t.sprayOffer('PA').kind, 'counter_spray');
});

test('every Verdict clears the post and offers the Claim Spray; the Claim makes it Mikan\'s at 70 with PatchChanged', () => {
  for (const v of ['chase', 'recruit', 'nose']) {
    // Arrange
    const t = lane();
    t.spray('PA'); t.spray('PA');
    // Act
    const ve = t.verdict('PA', v);
    const offer = t.sprayOffer('PA');
    const ce = t.spray('PA');
    // Assert
    assert.deepEqual(types(ve), ['PatchChanged', 'ClaimOffered']);
    assert.equal(offer.kind, 'claim_spray');
    assert.deepEqual([t.owner('PA'), t.scent('PA')], ['bell', 70]);
    assert.deepEqual(ofType(ce, 'MarkApplied')[0], { type: 'MarkApplied', district: 'hidamari', patch: 'PA', post: 'utility_pole', by: 'mikan', kind: 'claim_spray', target_clowder: 'wall_sitters' });
    assert.deepEqual(ofType(ce, 'PatchChanged').map(e => [e.owner, e.previous_owner, e.cause]), [['bell', 'wall_sitters', 'claim_spray']]);
  }
});

test('the own-post Spray is offered if and only if the post is below 60, and sets 90 (AC 13)', () => {
  for (let s = 1; s <= 100; s++) {
    const t = districtWith({ LWC: 80, PA: s });
    const offer = t.sprayOffer('PA');
    assert.equal(!!offer, s < 60, `scent ${s}`);
    const ev = t.spray('PA');
    if (s < 60) assert.equal(t.scent('PA'), 90);
    else { assert.equal(t.scent('PA'), s); assert.deepEqual(ofType(ev, 'MarkRefused').map(e => e.reason), ['not_offered']); }
  }
});

test('an Open (lapsed) Patch takes a Claim Spray at once, no fight', () => {
  const t = districtWith({ LWC: 80, PA: [null, 0, null] });
  t.spray('PA');
  assert.deepEqual([t.owner('PA'), t.scent('PA')], ['bell', 70]);
});

test('the Den post cannot be marked until the Boss\'s Verdict; then a Claim Spray claims the district', () => {
  const t = districtWith({ LWC: 80, LPY: 80, PA: 80, TSS: 80 });
  assert.deepEqual(ofType(t.spray('DEN'), 'MarkRefused').map(e => e.reason), ['den_unmarkable']);
  assert.equal(t.scent('DEN'), 100);
  t.verdict('DEN', 'nose');
  const ev = t.spray('DEN');
  assert.deepEqual([t.owner('DEN'), t.scent('DEN'), t.bossWindow().verdicted], ['bell', 70, true]);
  assert.deepEqual(ofType(ev, 'DistrictClaimed'), [{ type: 'DistrictClaimed', district: 'hidamari' }]);
});

test('PP-03 (Life 1, Low Wall Corner): one Over-mark and one Counter-Spray call the Stray Keeper with one wave, thresholds bypassed', () => {
  const t = createDistrict({ seed: 3 });
  t.rub('LWC', 'LWC.rub1');
  const ev = t.spray('LWC');
  assert.equal(t.scent('LWC'), 40);
  assert.deepEqual(ofType(ev, 'KeeperCalled').map(e => [e.keeper, e.escort_wave, e.scripted]), [['lwc_keeper_stray', true, true]]);
});

test('MarkApplied carries district, patch, post, by, kind and target_clowder for all four kinds', () => {
  const t = districtWith({ LWC: 50 });
  const kinds = [];
  const take = evs => kinds.push(...ofType(evs, 'MarkApplied').map(e => [e.kind, e.patch, e.post, e.target_clowder, e.by, e.district]));
  take(t.rub('PA', 'PA.rub1')); take(t.spray('PA')); take(t.spray('LWC'));
  t.spray('PA'); t.verdict('PA', 'chase'); take(t.spray('PA'));
  assert.deepEqual(kinds, [
    ['over_mark', 'PA', 'utility_pole', 'wall_sitters', 'mikan', 'hidamari'],
    ['counter_spray', 'PA', 'utility_pole', 'wall_sitters', 'mikan', 'hidamari'],
    ['rescue_spray', 'LWC', 'red_mailbox', 'bell', 'mikan', 'hidamari'],
    ['claim_spray', 'PA', 'utility_pole', 'wall_sitters', 'mikan', 'hidamari'],
  ]);
});

test('Whisker Sense: 1.0 s held on an undiscovered cat within 10 m discovers it; release, combat, >10 m or off screen cancel at no cost', () => {
  const cat = (pos, onScreen = true) => [{ id: 'daifuku', pos, onScreen }];
  const hold = (t, n, opts) => { const ev = []; for (let i = 0; i < n; i++) ev.push(...t.whisker(1 / 60, opts)); return ev; };
  // 59 frames then release: nothing
  const a = createDistrict();
  hold(a, 59, { held: true, pos: [0, 0], cats: cat([6, 7]) });
  a.whisker(1 / 60, { held: false });
  assert.deepEqual(hold(a, 59, { held: true, pos: [0, 0], cats: cat([6, 7]) }), []);
  // a full 60 frames (1.0 s): discovered once
  const ev = hold(a, 1, { held: true, pos: [0, 0], cats: cat([6, 7]) });
  assert.deepEqual(ev, [{ type: 'CatDiscovered', cat: 'daifuku', how: 'sniff' }]);
  assert.deepEqual(hold(a, 120, { held: true, pos: [0, 0], cats: cat([6, 7]) }), [], 'a discovered cat draws no ring');
  // out of range / off screen / in combat
  for (const opts of [{ held: true, pos: [0, 0], cats: cat([8, 7]) }, { held: true, pos: [0, 0], cats: cat([1, 1], false) }, { held: true, inCombat: true, pos: [0, 0], cats: cat([1, 1]) }]) {
    const b = createDistrict();
    assert.deepEqual(hold(b, 120, opts), []);
    assert.equal(b.isDiscovered('daifuku'), false);
  }
});

test('the snapshot shows wisps in the owner\'s colour, the fading stamp below Strong, the stake and the compass ticks', () => {
  const t = createDistrict({ start: 'showcase_l2d2' });
  t.whisker(0, { held: true, cats: [] });
  const s = t.snapshot();
  const lpy = s.posts.find(p => p.patch === 'LPY');
  assert.deepEqual([lpy.owner, lpy.colour, lpy.wisps, lpy.fading, lpy.staked_by, lpy.spray_offer], ['bell', '#F2B01E', 2, true, 'challenger_1', 'rescue_spray']);
  assert.deepEqual(s.posts.find(p => p.patch === 'DEN').wisps, 4);
  assert.deepEqual(s.whisker.ticks.map(k => k.kind), ['challenger', 'fading_post']);
  assert.equal(s.influence, 95);
});

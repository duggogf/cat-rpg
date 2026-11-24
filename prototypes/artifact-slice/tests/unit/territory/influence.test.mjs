// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Influence (Territory §3.2.2, §4.14; OR-08) and the Boss window (§3.5; OR-09; Day Loop F7, AC-F13).
import test from 'node:test';
import assert from 'node:assert/strict';
import { districtWith, ofType, types, K } from './helpers.mjs';
import { RAW, TDATA } from '../../../src/sim/territory/index.js';

test('every territory table row has a Name and a _src citation, and neighbours are symmetric', () => {
  // Arrange / Act
  for (const [table, rows] of Object.entries(RAW)) for (const r of rows) {
    // Assert
    assert.ok(r.Name, `${table} row without Name`);
    assert.ok(typeof r._src === 'string' && r._src.length > 3, `${table}.${r.Name} has no _src`);
  }
  for (const p of Object.values(TDATA.patches)) for (const n of p.neighbours) assert.ok(TDATA.patches[n].neighbours.includes(p.Name), `${p.Name}-${n}`);
  assert.equal(Object.values(TDATA.patches).reduce((a, p) => a + p.share, 0), 100, 'four outer shares of 25');
  assert.equal(Object.values(TDATA.patches).reduce((a, p) => a + p.base_yield, 0), 62, 'Territory §3.1 total base_yield');
});

test('Territory §4.14 worked example: LWC 80, LPY 66, PA 48, TSS 70 reads 95, and a Rescue Spray on PA makes 100 and opens the window', () => {
  // Arrange
  const t = districtWith({ LWC: 80, LPY: 66, PA: 48, TSS: 70 });
  // Act
  const before = t.influence();
  const ev = t.spray('PA');
  // Assert
  assert.equal(before, 95);
  assert.equal(t.scent('PA'), 90);
  assert.equal(t.influence(), 100);
  assert.deepEqual(ofType(ev, 'MarkApplied')[0], { type: 'MarkApplied', district: 'hidamari', patch: 'PA', post: 'utility_pole', by: 'mikan', kind: 'rescue_spray', target_clowder: 'bell' });
  assert.equal(ofType(ev, 'InfluenceChanged')[0].by_clowder.bell, 100);
  assert.deepEqual(ofType(ev, 'BossWindowChanged'), [{ type: 'BossWindowChanged', district: 'hidamari', open: true, influence: 100 }]);
  assert.equal(t.bossWindow().open, true);
});

test('influence is §4.14 for every Scent vector on a grid (round half up, capped at Strong, rivals count for nobody)', () => {
  const vals = [0, 1, 6, 12, 24, 30, 45, 48, 59, 60, 66, 90, 100];
  for (const a of vals) for (const b of vals) for (const c of [0, 30, 59, 60]) {
    // Arrange
    const t = districtWith({ LWC: Math.max(a, 10), LPY: b, PA: c, TSS: ['wall_sitters', 80, 'kagi'] });
    // Act
    const got = t.influence();
    // Assert: the formula written out independently
    const sum = [Math.max(a, 10), b, c].map(s => Math.min(s, 60) / 60).reduce((x, y) => x + y, 0);
    const exact = 100 * sum / 4;
    assert.equal(got, Math.floor(exact + 0.5 + 1e-9), `${a},${b},${c}`);
  }
});

test('Home Ground never gives less than 4 once Low Wall Corner is held (10/60 × 25 = 4.2)', () => {
  const t = districtWith({ LWC: 10, LPY: ['wall_sitters', 80, 'togemaru'], PA: ['wall_sitters', 80, 'pa_tough'], TSS: ['wall_sitters', 80, 'kagi'] });
  for (let n = 0; n < 6; n++) t.overnight();
  assert.equal(t.scent('LWC'), 10);
  assert.equal(t.influence(), 4);
});

test('the gang has a bar too: a Patch counts for its owner, the Open gap is the rest', () => {
  const t = districtWith({ LWC: 80, LPY: ['wall_sitters', 30, 'togemaru'], PA: ['outsiders', 60, 'newcomer_1'], TSS: [null, 0, null] });
  assert.deepEqual(t.influenceBar(), { bell: 25, wall_sitters: 13, strays: 0, outsiders: 25, open: 37 });
});

test('the window opens by day at 100 and the Boss goes to the current phase stop (Day Loop F7)', () => {
  for (const [phase, stop, patch] of [['morning', 'S_M', 'LPY'], ['day', 'S_D', 'TSS'], ['dusk', 'S_N', 'DEN']]) {
    // Arrange
    const t = districtWith({ LWC: 80, LPY: 66, PA: 48, TSS: 70 });
    t.setPhase(phase);
    // Act
    const ev = t.spray('PA');
    // Assert
    assert.deepEqual(ofType(ev, 'BossMoved').map(e => [e.at, e.patch]), [[stop, patch]], phase);
    assert.equal(t.bossWindow().roaming, true);
  }
});

test('while open, the Boss walks Morning → Day → Dusk/Night stops on PhaseChanged; closed, he sits at the Den and offers no Standoff', () => {
  // Arrange
  const t = districtWith({ LWC: 80, LPY: 66, PA: 90, TSS: 70 });
  const closed = districtWith({ LWC: 80, LPY: 66, PA: 48, TSS: 70 });
  t.s.patches.TSS.scent = 50; t.spray('TSS');
  // Act
  const seen = [];
  for (const c of [0, 240, 480]) { t.setClock(c); seen.push(t.bossWindow().at); }
  t.catFlap(); t.setClock(720); seen.push(t.bossWindow().at);
  // Assert
  assert.deepEqual(seen, ['S_M', 'S_D', 'S_N', 'S_N']);
  assert.deepEqual([closed.bossWindow().at, closed.bossWindow().standoff_offered, closed.bossWindow().roaming], ['den_wall', false, false]);
});

test('§4.14 hysteresis: a dip below 75 by day changes nothing; step 2 keeps it open at 75 and closes it at 74', () => {
  // Arrange: open window, then a turncoat flip takes a post by day (influence recomputed at once)
  const t = districtWith({ LWC: 100, LPY: 100, PA: 100, TSS: 100 });
  t.s.patches.PA.scent = 50; t.spray('PA');
  assert.equal(t.bossWindow().open, true);
  // Act: by day the bar drops to 50 (two turncoats); the window holds until step 2
  t.betrayal('PA', 'turncoat_a'); t.betrayal('TSS', 'turncoat_b');
  assert.equal(t.influence(), 50);
  assert.equal(t.bossWindow().open, true, 'never closes by day');
  const { events } = t.overnight();
  // Assert
  assert.deepEqual(ofType(events, 'BossWindowChanged').map(e => e.open), [false]);
  assert.equal(t.bossWindow().at, 'den_wall');
});

test('§4.14 examples: 90, 82 and 75 stay open at step 2; a bar that rounds below 75 closes it; it reopens only at 100', () => {
  // NB §4.14 says 'two posts at 30: 75; one more point lost closes'. Under its own round-half-up, 30 + 29 reads
  // 74.58 → 75 (still open); it takes 30 + 28 (74.17 → 74) to close. Both are asserted.
  for (const [scents, open] of [[[66, 66, 66, 36], true], [[66, 66, 40, 36], true], [[60, 60, 30, 30], true], [[60, 60, 30, 29], true], [[60, 60, 30, 28], false]]) {
    // Arrange: an open window; Watched by Criers with no rival neighbours so step 2 lands exactly on `scents`
    const t = districtWith({ LWC: 100, LPY: 100, PA: 100, TSS: 100, DEN: ['wall_sitters', 100, 'daifuku'] });
    t.s.window_open = true;
    ['LWC', 'LPY', 'PA', 'TSS'].forEach((id, i) => { t.s.patches[id].scent = scents[i]; });
    t.s.patches.DEN.owner = null; t.s.patches.DEN.scent = 0; // no rival neighbours, no decay noise
    for (const id of ['LPY', 'PA', 'TSS']) t.s.patches[id].scent += 10; // base_decay 10, unwatched
    t.s.patches.LWC.scent += 5;                                         // Home Ground 5
    // Act
    const { report } = t.overnight();
    // Assert
    assert.equal(report.window_open, open, `${scents} → ${report.influence}`);
  }
  // reopen needs 100, not 75
  const t = districtWith({ LWC: 60, LPY: 60, PA: 30, TSS: 30 });
  t.overnight();
  assert.equal(t.bossWindow().open, false);
});

test('an Unwatched post Sprayed to 90 holds its full 25 for three nights, then 20.8, 16.7 … and lapses on the ninth night', () => {
  // Arrange: PA alone, no rival neighbours (all its neighbours are Mikan's)
  const t = districtWith({ LWC: 100, LPY: 100, PA: 90, TSS: 100, DEN: [null, 0, null] });
  const seq = [];
  // Act
  for (let n = 0; n < 9; n++) { t.overnight(); seq.push(t.owner('PA') === 'bell' ? t.scent('PA') : 'open'); }
  // Assert
  assert.deepEqual(seq, [80, 70, 60, 50, 40, 30, 20, 10, 'open']);
});

test('InfluenceChanged carries from, delta and cause, and the Scent changes behind it, for the HUD to animate (M2 review fix 6)', () => {
  // Arrange: the §4.14 example at 95
  const t = districtWith({ LWC: 80, LPY: 66, PA: 48, TSS: 70 });
  // Act
  const inf = ofType(t.spray('PA'), 'InfluenceChanged')[0];
  // Assert
  assert.equal(inf.from.bell, 95);
  assert.equal(inf.by_clowder.bell, 100);
  assert.equal(inf.delta.bell, 5);
  assert.deepEqual(inf.cause, { kind: 'rescue_spray', patch: 'PA' });
  assert.deepEqual(inf.scent, [{ patch: 'PA', clowder: 'bell', from: 48, to: 90, delta: 42, cause: 'rescue_spray' }]);
});

test('Over-mark and Counter-Spray report the rival\'s loss: ScentChanged always, and the gang\'s bar delta once it is below Strong', () => {
  // Arrange: PA is the gang's at 80 (capped at 60 for influence)
  const t = districtWith({ LWC: 80, PA: ['wall_sitters', 80, 'pa_tough'] });
  // Act
  const e1 = t.rub('PA', 'PA.rub1');            // 80 → 70: Scent moves, the gang's share (capped) does not
  const e2 = t.spray('PA');                     // 70 → 40: PA's share 25 → 17 (LPY and TSS keep the gang's other 50)
  // Assert
  assert.deepEqual(ofType(e1, 'ScentChanged').map(e => [e.clowder, e.from, e.to, e.delta, e.cause]), [['wall_sitters', 80, 70, -10, 'over_mark']]);
  assert.deepEqual(ofType(e1, 'InfluenceChanged'), []);
  const inf = ofType(e2, 'InfluenceChanged')[0];
  assert.deepEqual([inf.from.wall_sitters, inf.by_clowder.wall_sitters, inf.delta.wall_sitters, inf.delta.bell], [75, 67, -8, 0]);
  assert.deepEqual(inf.cause, { kind: 'counter_spray', patch: 'PA' });
  assert.deepEqual(inf.scent.map(x => [x.patch, x.clowder, x.delta, x.cause]), [['PA', 'wall_sitters', -30, 'counter_spray']]);
});

test('overnight Scent changes carry their cause (decay, challenger_overmark, raid) and InfluenceChanged names the night', () => {
  const t = districtWith({ LWC: 80, LPY: 90, PA: 75, TSS: 70, DEN: ['wall_sitters', 100, 'daifuku'] });
  t.s.challenger = { id: 'challenger_1', patch: 'LPY', arrived_night: 3, repels: 0, origin: 'calendar', beaten: false };
  const { events } = t.overnight({ raid: { patch: 'LPY', motive: 'challenge', outcome: 'repelled' } });
  const lpy = ofType(events, 'ScentChanged').filter(e => e.patch === 'LPY').map(e => [e.cause, e.delta]);
  assert.deepEqual(lpy, [['decay', -12], ['challenger_overmark', -10], ['raid', -5]]);
  const inf = ofType(events, 'InfluenceChanged')[0];
  assert.deepEqual(inf.cause, { kind: 'overnight', night: 5 });
  assert.equal(inf.delta.bell, inf.by_clowder.bell - inf.from.bell);
});

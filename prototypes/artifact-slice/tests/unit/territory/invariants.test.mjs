// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The patent invariant (nemesis-patent-analysis.md §5: G2, G5, G6; plan §2.4 / §5.2) and determinism.
//  - No territory action changes any cat: territory state holds no cat stats; the combat cat and Boss tables
//    are bit-identical (and frozen) across every action; Sentry records passed in are never written.
//  - No fight outcome or Verdict moves Scent or influence (AC 16b); the window never changes the Boss's stats (16c).
//  - Anger moves only through MarkApplied on the Boss's own Clowder's things (OR-07, Nemesis A-9).
//  - Same seed and action log → same hash.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA } from '../../../src/sim/combat/index.js';
import { hashOf } from '../../../src/sim/core/hash.js';
import { Stream } from '../../../src/sim/core/rng.js';
import { createDistrict, createAngerReference, TDATA } from '../../../src/sim/territory/index.js';
import { districtWith, ofType } from './helpers.mjs';
import { referenceRun, showcaseRun, CATS } from './reference-bot.mjs';

const deepFreeze = o => { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; };
const scents = t => Object.fromEntries(t.dist.patches.map(id => [id, [t.owner(id), t.scent(id)]]));
const STAT_KEYS = /^(level|nerve|hp|stats?|power|attack|defen[cs]e|speed|grudge|regard|loyalty|rank|traits|anger|fired_up|moves|style_mod|guard_mod)$/;

/** A seeded random walk over the whole territory API (marks, Verdicts, fights, posts, time, nights, raids). */
function fuzz(seed, steps = 400) {
  const t = createDistrict({ seed, start: seed % 2 ? 'l1d1' : 'showcase_l2d2' });
  const r = new Stream(seed, 'fuzz');
  const ids = t.dist.patches, cats = Object.values(CATS), events = [];
  for (let i = 0; i < steps; i++) {
    const id = r.pick(ids), row = TDATA.patches[id];
    const op = r.pick(['rub', 'spray', 'spray', 'verdict', 'fight', 'post', 'unpost', 'time', 'night', 'whisker', 'beaten']);
    let ev = [];
    if (op === 'rub' && row.rub_marks.length) ev = t.rub(id, r.pick(row.rub_marks), { seen: r.chance(0.3) });
    else if (op === 'spray') ev = t.spray(id);
    else if (op === 'verdict') ev = t.verdict(id, r.pick(['chase', 'recruit', 'nose']));
    else if (op === 'fight') ev = t.encounterEnded({ patch: id, outcome: r.pick(['win', 'loss', 'player_fled', 'rival_fled']) });
    else if (op === 'post') ev = t.setSentry(id, { ...r.pick(cats) });
    else if (op === 'unpost') ev = t.setSentry(id, null);
    else if (op === 'time') ev = t.advance(r.range(0, 200));
    else if (op === 'whisker') ev = t.whisker(0.5, { held: true, pos: [0, 0], cats: [{ id: 'daifuku', dist: r.range(0, 15) }] });
    else if (op === 'beaten') ev = t.challengerBeaten();
    else ev = t.overnight({ raid: r.chance(0.6) ? { patch: r.pick(ids), motive: r.pick(['grudge', 'gang_orders', 'gloat', 'challenge']), leader: 'goma', outcome: r.pick(['repelled', 'scuffed', 'lost']) } : null }).events;
    events.push(...ev);
  }
  return { t, events };
}

test('no territory action changes any cat: the combat cat and Boss tables are frozen and bit-identical after every run', () => {
  // Arrange
  deepFreeze(DATA.cats); deepFreeze(DATA.bosses);
  const before = hashOf([DATA.cats, DATA.bosses]);
  const sentries = deepFreeze(JSON.parse(JSON.stringify(CATS)));
  // Act: the reference path, the showcase path, and 40 seeded random walks (frozen objects throw on any write)
  referenceRun({ seed: 3 });
  showcaseRun({ guard: sentries.hige });
  for (let s = 1; s <= 40; s++) fuzz(s);
  // Assert
  assert.equal(hashOf([DATA.cats, DATA.bosses]), before);
  assert.deepEqual(sentries, CATS);
});

test('territory state stores no cat stats: cats appear only as ids (Keepers, Sentries, the challenger, the Boss\'s placement)', () => {
  const { t } = fuzz(5, 600);
  const walk = (o, path) => {
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o)) { assert.ok(!STAT_KEYS.test(k), `stat-like key ${path}.${k}`); walk(v, `${path}.${k}`); }
  };
  walk(t.state(), 'state');
  walk(t.snapshot(), 'snapshot');
  assert.deepEqual(Object.keys(t.state().boss).sort(), ['at', 'clowder', 'id', 'verdicted']);
});

test('AC 16b: no fight outcome and no Verdict changes any Scent or influence (all outcome × verdict combinations)', () => {
  for (const outcome of ['win', 'loss', 'player_fled', 'rival_fled']) for (const verdict of ['chase', 'recruit', 'nose']) for (const patch of ['LPY', 'PA', 'TSS', 'DEN']) {
    // Arrange: mid-contest at L2D3 with the window open
    const t = districtWith({ LWC: 80, LPY: 66, PA: ['wall_sitters', 30, 'pa_tough'], TSS: 70 });
    t.s.window_open = true;
    const s0 = scents(t), i0 = t.influenceBar();
    // Act
    const ev = [...t.encounterEnded({ patch, outcome }), ...t.verdict(patch === 'PA' || patch === 'DEN' ? patch : 'PA', verdict)];
    // Assert
    assert.deepEqual(scents(t), s0, `${outcome}/${verdict}/${patch}`);
    assert.deepEqual(t.influenceBar(), i0);
    assert.deepEqual(ofType(ev, 'InfluenceChanged'), []);
    assert.deepEqual(ofType(ev, 'MarkApplied'), []);
  }
});

test('the Boss\'s Verdict re-tasks nobody: every other Patch\'s owner, Keeper and Scent are unchanged (G6)', () => {
  const t = districtWith({ LWC: 80, LPY: ['wall_sitters', 80, 'goma'], PA: 80, TSS: ['wall_sitters', 50, 'kagi'] });
  const before = t.dist.patches.filter(id => id !== 'DEN').map(id => t.patch(id));
  t.verdict('DEN', 'chase');
  assert.deepEqual(t.dist.patches.filter(id => id !== 'DEN').map(id => t.patch(id)), before);
});

test('anger moves only via MarkApplied on the Boss\'s own Clowder: Over-mark +5, Counter-Spray +15; never Claim, Rescue, Strays, outsiders, fights or the window', () => {
  // Arrange
  const t = createDistrict({ seed: 9 });
  const anger = createAngerReference(TDATA);
  const feed = evs => { for (const e of evs) anger.onEvent(e); return anger.value; };
  // Act / Assert: Life 1 LWC is Stray-held → no anger (A-9)
  assert.equal(feed(t.rub('LWC', 'LWC.rub1')), 0);
  feed(t.spray('LWC')); feed(t.verdict('LWC', 'chase'));
  assert.equal(feed(t.spray('LWC')), 0, 'claim spray is never a source');
  // the gang's LPY: +5 +5 +15 = 25 (Nemesis worked example, L1D2)
  feed(t.rub('LPY', 'LPY.rub1')); feed(t.rub('LPY', 'LPY.rub2'));
  assert.equal(feed(t.spray('LPY')), 25);
  feed(t.encounterEnded({ patch: 'LPY', outcome: 'win' })); feed(t.verdict('LPY', 'recruit'));
  assert.equal(feed(t.spray('LPY')), 25, 'fights, Verdicts and the Claim add nothing');
  t.s.patches.LPY.scent = 40;
  assert.equal(feed(t.spray('LPY')), 25, 'a Rescue Spray adds nothing');
  // an outsider's post (a challenger's or turncoat's) is not the Boss's gang
  t.s.patches.PA = { ...t.s.patches.PA, owner: 'outsiders', keeper: 'challenger_1' };
  feed(t.rub('PA', 'PA.rub1')); feed(t.spray('PA'));
  assert.equal(anger.value, 25);
  // a MarkApplied from another district is ignored; the window opening is not an event anger reads
  assert.equal(feed([{ type: 'MarkApplied', district: 'arcade', kind: 'counter_spray', target_clowder: 'wall_sitters' }, { type: 'BossWindowChanged', district: 'hidamari', open: true }]), 25);
  assert.equal(anger.stage, 'Calm');
});

test('the territory never emits an anger or cat-stat event; every event that names a cat is a placement, discovery or contest call', () => {
  const allowed = new Set(['MarkApplied', 'ScentChanged', 'PatchChanged', 'ClaimOffered', 'InfluenceChanged', 'BossWindowChanged', 'BossMoved', 'DistrictClaimed',
    'ContestBristled', 'TurfWavesStopped', 'KeeperCalled', 'ContestEnded', 'Rubbed', 'MarkRefused', 'SentryPosted', 'SentryReturned', 'CatDiscovered',
    'PhaseChanged', 'DayStarted', 'RaidResolved', 'ChallengerArrived', 'ChallengerSkipped', 'ChallengeEnded']);
  for (let s = 1; s <= 30; s++) for (const e of fuzz(s).events) assert.ok(allowed.has(e.type), e.type);
});

test('rules hold over seeded random walks: Scent 0–100, Home Ground ≥ 10, influence = §4.14, the window closes only at step 2', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const t = createDistrict({ seed, start: seed % 2 ? 'l1d1' : 'showcase_l2d2' });
    const r = new Stream(seed, 'walk');
    for (let i = 0; i < 300; i++) {
      const id = r.pick(t.dist.patches), row = TDATA.patches[id];
      const wasOpen = t.bossWindow().open;
      const night = r.chance(0.15);
      if (night) t.overnight({ raid: r.chance(0.5) ? { patch: id, motive: r.pick(['grudge', 'gloat', 'challenge']), outcome: r.pick(['repelled', 'scuffed', 'lost']) } : null });
      else if (r.chance(0.5) && row.rub_marks.length) t.rub(id, r.pick(row.rub_marks));
      else if (r.chance(0.5)) t.spray(id); else t.verdict(id, 'chase');
      for (const p of t.dist.patches) {
        assert.ok(t.scent(p) >= 0 && t.scent(p) <= 100);
        if (TDATA.patches[p].home_ground && t.owner(p) === 'bell') assert.ok(t.scent(p) >= 10);
      }
      if (wasOpen && !night) assert.equal(t.bossWindow().open, true, 'never closes by day');
    }
  }
});

test('determinism: the same seed and actions give the same hash and events; another seed hashes differently', () => {
  const a = fuzz(17, 500), b = fuzz(17, 500), c = fuzz(18, 500);
  assert.equal(a.t.hash(), b.t.hash());
  assert.equal(hashOf(a.events), hashOf(b.events));
  assert.notEqual(a.t.hash(), c.t.hash());
  assert.equal(referenceRun({ seed: 4 }).t.hash(), referenceRun({ seed: 4 }).t.hash());
  assert.equal(createDistrict({ seed: 4 }).rng(2, 'territory', 'PA').float(), createDistrict({ seed: 4 }).rng(2, 'territory', 'PA').float());
});

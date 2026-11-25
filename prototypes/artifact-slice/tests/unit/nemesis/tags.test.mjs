// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Relationship tags and the Rivals board (OR-03, OR-04; key-screens §2.2-§2.8; Nemesis AC 25). Tags show only
// between discovered cats; ≤ 3 in the scene, Rival > Kin > Old Boss / Old Gang; display never writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createTown, ARC } from './helpers.mjs';

const inScene = tg => tg.in_scene.map(t => `${t.cat}:${t.kind}`);
const chips = tg => tg.chips.map(t => `${t.scene}:${t.cat}:${t.kind}`);

test('No tag on, or from, an undiscovered cat', () => {
  const t = createTown({ seed: 1 });
  assert.deepEqual(t.tags('goma').all, [], 'Goma is unmet on L1D1');
  assert.deepEqual(t.tags('togemaru').all, []);
  ARC.l1d1(t);
  assert.deepEqual(t.tags('togemaru').all, [], 'Togemaru is met but Goma is not: no Rival tag yet');
  for (const id of Object.keys(t.s.cats)) for (const tg of t.tags(id).all) assert.equal(t.cat(tg.cat).discovered, true);
});

test('Kinako shows no tag while Sasa is unmet; Kin appears once both are discovered', () => {
  const t = createTown({ seed: 2, start: 'showcase_l2d2', branch: 'A' });
  assert.equal(t.cat('sasa').discovered, false);
  assert.deepEqual(t.tags('kinako').all, []);
  assert.equal(t.board().cats.find(c => c.id === 'sasa').silhouette, true);
  t.discover('sasa', 'sniff');
  assert.deepEqual(chips(t.tags('kinako')), ['lane:sasa:kin'], 'a cross-scene tie is one chip under the Lane tab');
  assert.deepEqual(chips(t.tags('sasa')), ['bell:kinako:kin']);
});

test('Plan 9:45: hover Togemaru → Goma Rival; hover Daifuku → Hige Old Gang (B: Togemaru too, read from the recruits)', () => {
  const a = createTown({ seed: 3, start: 'showcase_l2d2', branch: 'A' });
  assert.deepEqual(inScene(a.tags('togemaru')), ['goma:rival']);
  assert.deepEqual(chips(a.tags('daifuku')), ['bell:hige:old_gang']);
  assert.deepEqual(chips(a.tags('hige')), ['lane:daifuku:old_boss']);
  const b = createTown({ seed: 3, start: 'showcase_l2d2', branch: 'B' });
  assert.deepEqual(b.tags('togemaru').all.map(x => `${x.cat}:${x.kind}`), ['goma:rival', 'daifuku:old_boss']);
  assert.deepEqual(b.tags('daifuku').all.map(x => x.cat).sort(), ['hige', 'togemaru']);
  assert.deepEqual(b.cat('daifuku').relations, [], 'the Boss\'s record never holds Old Gang (derived from the recruits)');
});

test('The challenger\'s Rival tag shows only once it is discovered', () => {
  const t = createTown({ seed: 4, start: 'showcase_l2d2', branch: 'A' });
  assert.deepEqual(inScene(t.tags('togemaru')), ['goma:rival']);
  t.beginEncounter({ patch: 'LPY', opponents: ['challenger', 'stray'] });
  assert.deepEqual(t.tags('togemaru').all.map(x => `${x.cat}:${x.kind}`), ['goma:rival', 'challenger:rival']);
});

test('≤ 3 tags in the scene, Rival > Kin > Old Boss, the rest as overflow', () => {
  const t = createTown({ seed: 5 });
  for (const id of ['goma', 'sasa', 'kuri', 'azuki', 'togemaru']) t.discover(id, 'sniff');
  for (const [a, b, k] of [['togemaru', 'sasa', 'kin'], ['togemaru', 'kuri', 'rival'], ['togemaru', 'azuki', 'kin']]) t._tie(a, b, k, 'test');
  const tg = t.tags('togemaru');
  assert.equal(tg.in_scene.length, 3); assert.equal(tg.overflow, 1);
  assert.deepEqual(tg.in_scene.map(x => x.kind), ['rival', 'rival', 'kin']);
});

test('Board: six scenes in climbing order; unmet cats in the shade; Boss on the perch; roles fixed', () => {
  const t = createTown({ seed: 6, start: 'showcase_l2d2', branch: 'C' });
  const b = t.board();
  assert.deepEqual(b.scenes.map(s => s.id), ['lane', 'arcade', 'shiosai', 'summit', 'outsiders', 'bell']);
  const at = id => b.cats.find(c => c.id === id);
  assert.equal(at('daifuku').anchor, 'perch'); assert.equal(at('kagi').anchor, 'steps'); assert.equal(at('goma').anchor, 'path');
  assert.equal(at('ohagi').anchor, 'shade'); assert.equal(at('ohagi').name, null);
  assert.equal(at('challenger').scene, 'outsiders'); assert.equal(at('challenger').silhouette, true);
  assert.equal(at('botan').haze, true); assert.equal(at('mikan').anchor, 'truck_roof');
  assert.equal(at('togemaru').legend, true);
  assert.equal(at('goma').arrow_to, 'daifuku'); assert.equal(at('hige').arrow_to, 'mikan');
  const lane = b.scenes.find(s => s.id === 'lane');
  assert.equal(lane.perch.puffs, 3);
  assert.ok(b.cats.filter(c => c.discovered).every(c => !c.drawn_mark || ['storm', 'puffs', 'sprig', 'grumble', 'plaster'].includes(c.drawn_mark)));
});

test('boardView() gives the shape src/ui/rivals-model.js fromNemesis() reads', () => {
  const v = createTown({ seed: 7, start: 'showcase_l2d2', branch: 'A' }).boardView();
  assert.equal(v.branch, 'A'); assert.equal(v.anger, 3); assert.equal(v.discovered.sasa, false);
  const tg = v.cats.find(c => c.id === 'togemaru');
  assert.deepEqual([tg.state, tg.marks.storm, tg.marks.sprig], ['present', 'Sworn Rival', true]);
  assert.equal(tg.history.day, 'L1 D2');
  assert.ok(v.ties.some(x => x.kind === 'rival' && [x.a, x.b].sort().join() === 'goma,togemaru'));
  assert.ok(v.ties.some(x => x.kind === 'old_boss' && x.a === 'hige' && x.b === 'daifuku'));
  assert.ok(v.ties.some(x => x.kind === 'rival' && [x.a, x.b].sort().join() === 'challenger,togemaru'));
});

test('Cards: undiscovered "Not met yet"; an outsider silhouette names its stake; no numbers on Rivals', () => {
  const t = createTown({ seed: 8, start: 'showcase_l2d2', branch: 'A' });
  assert.equal(t.nameCard('ohagi').line, 'Not met yet. Sniff it out: hold Whisker Sense near it.');
  assert.equal(t.nameCard('challenger').line, "A stranger's scent. Staking Laundry Pole Yard.");
  const c = t.nameCard('togemaru');
  assert.equal(c.role_tag, 'Brawler'); assert.equal(c.face, 'Sworn Rival'); assert.equal(typeof c.grudge, 'string');
  assert.equal(t.nameCard('daifuku').context.fired, 'Fired Up all fight');
  assert.equal(t.nameCard('kagi').role_tag, 'Captain · Sneak');
  assert.equal(t.rivalCard('ohagi'), null, 'undiscovered cats have no Rival card');
});

test('Memory on the cards (review round 1 fix 6): pre-game entries say "Before you"; the full card keeps all five; closings do not repeat', () => {
  const a = createTown({ seed: 42, start: 'showcase_l2d2', branch: 'A' });
  assert.equal(a.nameCard('hige').history.day, 'Before you');
  assert.ok(!JSON.stringify(a.boardView()).includes('L1 D0'));
  const h = a.rivalCard('togemaru').history;
  assert.deepEqual(h.map(x => x.kind), ['FIRST_MEETING', 'SCAR', 'FLED', 'ROUTED', 'VERDICT'], 'pinned first, then the rest in order');
  for (const [b, title, line] of [['B', 'Wears the bell now', 'Aloof. Notched. On the Posse bench.'], ['C', 'Run out of town', 'Notched. Left Laundry Pole Yard behind.']]) {
    const it = createTown({ seed: 42, start: 'showcase_l2d2', branch: b }).sniff().items.find(x => x.kind === 'arc_closing');
    assert.equal(it.title, title); assert.equal(it.line, line);
    assert.ok(!it.line.toLowerCase().includes(title.toLowerCase()), 'the subtitle never repeats the headline');
  }
});

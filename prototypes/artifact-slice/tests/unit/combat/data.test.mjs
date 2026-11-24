// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The combat tables: every row cites its source, the Move catalogue obeys Combat AC 11, and the slice six exist.
import test from 'node:test';
import assert from 'node:assert/strict';
import { RAW, DATA } from '../../../src/sim/combat/index.js';

test('every row of every combat table has a Name and a _src citation', () => {
  for (const [table, rows] of Object.entries(RAW)) for (const r of rows) {
    assert.ok(r.Name, `${table} row without Name`);
    assert.ok(typeof r._src === 'string' && r._src.length > 3, `${table}.${r.Name} has no _src`);
  }
});

test('every Posse Move is a Set-up or Pay-off with a state, one Ruffle Move per Style at most, and none refunds itself', () => {
  const posseMoves = Object.values(DATA.moves).filter(m => m.role !== 'enemy');
  const ruffle = {};
  for (const m of posseMoves) {
    assert.ok(m.role === 'setup' || m.role === 'payoff', m.Name);
    assert.ok(m.role === 'setup' ? !!m.creates : m.pays_on.length > 0, `${m.Name} state`);
    assert.ok(!('refund' in m), `${m.Name} refunds`);
    if (m.creates === 'ruffled') ruffle[m.style] = (ruffle[m.style] || 0) + 1;
    if (m.role === 'setup') assert.equal(m.ai_use, 'command_only', `${m.Name}: Set-ups are command_only for AI`);
  }
  for (const n of Object.values(ruffle)) assert.ok(n <= 1);
});

test('the slice\'s six Moves are present and slotted on Mikan, Hige and Pon', () => {
  const six = ['face_swat', 'bunny_kick', 'shoulder_check', 'belly_flop', 'withering_hiss', 'purr'];
  assert.deepEqual(Object.values(DATA.moves).filter(m => m.slice).map(m => m.Name).sort(), six.slice().sort());
  assert.deepEqual(DATA.cats.mikan.moves, ['face_swat', 'bunny_kick']);
  assert.deepEqual(DATA.cats.hige.moves, ['shoulder_check', 'belly_flop']);
  assert.deepEqual(DATA.cats.pon.moves, ['withering_hiss', 'purr']);
  assert.deepEqual(DATA.cats.kinako.moves, []);
});

test('showcase-only values live only in showcase_overrides.json', () => {
  assert.equal(DATA.cats.daifuku.anger_stage, 'Calm');
  assert.equal(DATA.showcase.boss_phase_cap, 1);
  assert.equal(DATA.showcase.anger_stage.daifuku, 'Furious');
});

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// node:test wrapper over the smoke scenarios (3 seeds each); tools/sim-run.mjs runs the full report.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENARIOS, runOne } from './scenarios.mjs';

for (const sc of SCENARIOS) {
  test(`${sc.id} meets its expectation on seeds 1-3`, () => {
    const rs = [1, 2, 3].map(s => runOne(sc, s));
    for (const r of rs) assert.ok(sc.expect(r), `${sc.id} seed ${r.seed}: outcome ${r.outcome}, pileOns ${r.pileOns}, phaseBreak ${r.phaseBreak}`);
    if (sc.aggregate && sc.enc !== 'challenger' && sc.enc !== 'daifuku_bout') assert.ok(rs.some(r => r.pileOns > 0), `${sc.id}: no Pile-On on any seed`);
  });
}

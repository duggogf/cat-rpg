// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Headless combat smoke runner: every scenario in tests/smoke/combat/scenarios.mjs over N seeds.
// Prints fight lengths against the GDD's figures and exits 1 if any scenario's expectation fails.
//   node tools/sim-run.mjs [--seeds 20] [--only id] [--json out.json]
import fs from 'node:fs';
import { SCENARIOS, GDD, runOne, median } from '../tests/smoke/combat/scenarios.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const seeds = +arg('--seeds', 20), only = arg('--only', null), jsonOut = arg('--json', null);
const f1 = x => (x == null ? '   -  ' : x.toFixed(1).padStart(6));
let failed = 0;
const report = [];
console.log(`combat smoke: ${seeds} seeds per scenario (showcase overrides on; Alley)\n`);
console.log('scenario                         pass   median s  min..max s   PileOn  tags relay moves frazz  NerveLost  first PileOn s / phase break s');
for (const sc of SCENARIOS) {
  if (only && sc.id !== only) continue;
  const rs = [];
  for (let s = 1; s <= seeds; s++) rs.push(runOne(sc, s));
  const pass = rs.filter(r => sc.expect(r)).length;
  const aggOk = sc.aggregate ? sc.aggregate(rs) : true;
  if (pass < rs.length || !aggOk) failed++;
  const len = rs.map(r => r.fight_s);
  const row = {
    id: sc.id, enc: sc.enc, pass, of: rs.length, median_s: median(len), min_s: Math.min(...len), max_s: Math.max(...len),
    pile_runs: rs.filter(r => r.pileOns > 0).length, tagIns: median(rs.map(r => r.tagIns)), maxRelay: Math.max(...rs.map(r => r.maxRelay)),
    moves: median(rs.map(r => r.moves)), frazzles: median(rs.map(r => r.frazzles)), nerveLost: median(rs.map(r => r.posseNerveLost)),
    firstPile_s: median(rs.map(r => r.firstPile_s)), phaseBreak_s: median(rs.map(r => r.phaseBreak_s)),
    outcomes: rs.reduce((o, r) => ((o[r.outcome] = (o[r.outcome] || 0) + 1), o), {}), gdd: GDD[sc.enc],
  };
  report.push(row);
  console.log(`${sc.id.padEnd(32)} ${String(pass).padStart(2)}/${rs.length}  ${f1(row.median_s)}  ${f1(row.min_s)}..${f1(row.max_s)}  ${String(row.pile_runs).padStart(4)}   ${String(row.tagIns).padStart(4)} ${String(row.maxRelay).padStart(4)} ${String(row.moves).padStart(5)} ${String(row.frazzles).padStart(5)}  ${(row.nerveLost * 100).toFixed(0).padStart(6)}%    ${f1(row.firstPile_s)} / ${f1(row.phaseBreak_s)}`);
  console.log(`${''.padEnd(32)} outcomes ${JSON.stringify(row.outcomes)}${sc.aggregate ? (aggOk ? ' Pile-On>=90% ok' : ' Pile-On<90% FAIL') : ''}  | GDD ${row.gdd}`);
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1));
console.log(failed ? `\nFAILED: ${failed} scenario(s) below expectation` : '\nAll scenarios met their expectation.');
process.exit(failed ? 1 : 0);

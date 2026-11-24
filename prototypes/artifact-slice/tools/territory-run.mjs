// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Headless territory runner: a scripted bot plays the slice's territory beats day by day and prints
// influence, Scent per Patch, the window, the Boss's stop, the challenger and (reference consumer) Boss anger.
//   node tools/territory-run.mjs [--seed 1] [--json out.json]
// Part 1: Territory §4.11's reference player, checked night by night against the GDD's trace.
// Part 2: the browser slice's L2D2 owner beats (plan §2.2 10:15-14:20; M5's seeded check: TSS 70 → 58, bar 99).
// Exits 1 if any figure misses its GDD value.
import fs from 'node:fs';
import { referenceRun, showcaseRun, REFERENCE_TRACE, CATS } from '../tests/unit/territory/reference-bot.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const seed = +arg('--seed', 1), jsonOut = arg('--json', null);
const LIFE_DAY = n => (n <= 2 ? `L1D${n}` : `L2D${n - 2}`);
const pad = (x, w) => String(x ?? '-').padStart(w);
let failed = 0;

console.log(`territory: Hidamari Lane, seed ${seed}\n`);
console.log('Part 1 - reference player (Territory §4.11), Scent after night n (r = rival-held); GDD trace in brackets on a miss\n');
console.log('night day   LWC  LPY   PA  TSS  DEN  infl  window  boss@morning  anger (stage)    challenger        raid');
const ref = referenceRun({
  seed,
  onNight: (t, row) => {
    const want = REFERENCE_TRACE.find(r => r.night === row.night);
    const cell = k => (want && want[k] !== row[k] ? (failed++, `${row[k]}[${want[k]}]`) : row[k]);
    const w = t.bossWindow();
    console.log(`${pad(row.night, 5)} ${LIFE_DAY(row.night).padEnd(5)} ${['LWC', 'LPY', 'PA', 'TSS', 'DEN'].map(k => pad(cell(k), 4)).join(' ')} ${pad(cell('influence'), 5)}  ${(row.window_open ? 'OPEN' : 'shut').padEnd(6)}  ${(w.at ?? 'verdicted').padEnd(12)}  ${pad(row.anger, 3)} (${row.anger_stage.padEnd(8)})  ${(row.challenger ?? '-').padEnd(16)}  ${row.raid ?? '-'}`);
  },
});
const opened = ref.events.find(e => e.type === 'BossWindowChanged' && e.open);
const arrived = ref.events.find(e => e.type === 'ChallengerArrived');
console.log(`\n  window opened: ${opened ? `day ${ref.events.slice(0, ref.events.indexOf(opened)).filter(e => e.type === 'DayStarted').length + 1} (GDD F7: L2D3 = day 5, at the TSS Claim Spray)` : 'never'}`);
console.log(`  challenger: ${arrived ? `night ${arrived.night} at ${arrived.patch} (GDD §4.12: night 5, TSS)` : 'none'}`);
console.log(`  discovered: ${ref.t.snapshot().discovered.join(', ')}; district claimed: ${ref.t.s.claimed}`);
if (!opened || ref.events.slice(0, ref.events.indexOf(opened)).filter(e => e.type === 'DayStarted').length !== 4) failed++;
if (!arrived || arrived.night !== 5 || arrived.patch !== 'TSS') failed++;

console.log('\nPart 2 - showcase L2D2 (plan §2.2): snapshot → Rescue Spray the gatepost → the window → tonight\'s `challenge`\n');
const rows = [];
for (const [label, guard] of [['Hige on the gatepost', CATS.hige], ['Pon on the gatepost (no over-mark)', CATS.pon], ['nobody posted', null]]) for (const outcome of ['repelled', 'scuffed', 'lost']) {
  const r = showcaseRun({ seed, guard, outcome });
  const p = r.report.patches;
  rows.push({ label, outcome, before: r.before, after: r.after, LPY: `${p.LPY.from}→${p.LPY.to}`, TSS: `${p.TSS.from}→${p.TSS.to}`, influence: r.report.influence, window: r.report.window_open, raid: r.report.raid.outcome });
}
console.log('guard                                  rolled    bar before→Spray  LPY (gatepost)  TSS      bar next morning  window  raid applied');
for (const r of rows) console.log(`${r.label.padEnd(38)} ${r.outcome.padEnd(9)} ${pad(r.before, 6)} → ${pad(r.after, 3)}        ${r.LPY.padEnd(14)}  ${r.TSS.padEnd(7)}  ${pad(r.influence, 10)}        ${(r.window ? 'OPEN' : 'shut').padEnd(6)}  ${r.raid}`);
const m5 = rows.find(r => r.label.startsWith('Hige') && r.outcome === 'repelled');
const ok = m5.before === 95 && m5.after === 100 && m5.TSS === '70→58' && m5.influence === 99 && m5.window;
if (!ok) failed++;
console.log(`\n  M5 seeded check (gatepost guarded: TSS 70 → 58, bar 99, window open): ${ok ? 'PASS' : 'FAIL'}`);
console.log('  "lost" rolls apply as Scuffed: the window is open (OR-09), so nothing outer can be Lost.');

if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ seed, reference: ref.days, showcase: rows }, null, 2));
console.log(failed ? `\nFAIL: ${failed} figure(s) off the GDD` : '\nOK: every figure matches the GDD');
process.exit(failed ? 1 : 0);

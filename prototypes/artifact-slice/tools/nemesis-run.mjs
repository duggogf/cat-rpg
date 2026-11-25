// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Plays Togemaru's arc per branch (plan §2.2-§2.3; Nemesis §3.16) through the nemesis sim and prints each beat:
// L1D1 Standoff + flee, L1D2 Sniff, memory line, the take, the Scar, the three-card offer, the Verdict, the nights,
// the L2D2 Sniff, the board's Lane row and tags, and (A) the challenger fight with the join-in.
//   node tools/nemesis-run.mjs [--seed 1] [--branch A|B|C|all] [--json out.json]
import fs from 'node:fs';
import { createTown, ARC, BRANCH_VERDICT } from '../src/sim/nemesis/index.js';

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const seed = +arg('--seed', 1), which = arg('--branch', 'all'), jsonOut = arg('--json', null);
const branches = which === 'all' ? ['A', 'B', 'C'] : [which];
const out = {};
const say = (...a) => console.log(...a);
const gr = c => `G ${c.grudge} R ${c.regard}`;

for (const b of branches) {
  const t = createTown({ seed });
  const tg = t.cat('togemaru'), log = [];
  const note = (beat, ev) => { log.push({ beat, day: t.day, events: ev }); return ev; };
  say(`\n=== Branch ${b}: ${BRANCH_VERDICT[b]} (seed ${seed}) ===`);
  let ev = note('L1D1', ARC.l1d1(t));
  say(`L1D1  Standoff: "${ev.find(e => e.type === 'Standoff').text}" → flees (uninterruptible). Togemaru ${gr(tg)}, enc ${tg.encounters}`);
  note('night 1', ARC.night(t, 1));
  ev = note('L1D2', ARC.l1d2(t));
  const sn = ev.find(e => e.type === 'Sniff');
  say(`L1D2  Sniff (${sn.items.length}): ${sn.items.map(i => i.line).join(' | ')}`);
  const so = ev.find(e => e.type === 'Standoff');
  say(`      Memory line: "${so.text}" (${so.trigger}, unskippable ${so.unskippable_s} s)`);
  say(`      Daifuku anger after the take: ${t.cat('daifuku').anger} (${t.nameCard('daifuku').silhouette ? 'unmet' : 'met'})`);
  say(`      Scar: ${ev.filter(e => e.type === 'ScarGained').map(e => `${e.cat} ${e.scar}`).join(', ')}; slipped away: ${ev.find(e => e.type === 'SlippedAway')?.cat_ids.join(', ')}`);
  const o = t.verdictOffer();
  say(`      Verdict on ${o.cat}: G_pending ${o.g_pending} vs gate ${o.cards.nose.gate}`);
  for (const k of ['nose', 'chase', 'recruit']) { const c = o.cards[k]; say(`        ${c.dir.padEnd(5)} ${c.title.padEnd(10)} ${c.available ? 'open  ' : 'greyed'} tell ${c.tell}${c.chip ? ` [${c.chip}]` : ''}${c.reason_text ? ` "${c.reason_text}"` : ''}`); }
  ev = note('verdict', t.applyVerdict(BRANCH_VERDICT[b]));
  say(`      → ${BRANCH_VERDICT[b]}: "${ev[0].line?.text}"  Togemaru ${tg.state}, ${gr(tg)}${tg.loyalty != null && tg.state === 'Crew' ? `, Loyalty ${tg.loyalty}` : ''}${ev.some(e => e.type === 'NemesisArcClosed') ? `, arc closed (${tg.arc_closed_how})` : ''}, achieved ${tg.arc_achieved}`);
  note('sniff daifuku', ARC.sniffDaifuku(t));
  note('night 2', ARC.night(t, 2));
  ev = note('L2D1', ARC.l2d1(t));
  if (ev.length) say(`L2D1  Greeting: "${ev.find(e => e.type === 'Standoff').text}" (encounter ${tg.encounters})`);
  ev = note('night 3', ARC.night(t, 3));
  for (const e of ev.filter(x => x.type === 'NemesisDeclared')) say(`N3    Declared: ${e.face}`);
  say(`L2D2  (canon calendar: no challenger yet)  Togemaru ${tg.state} ${gr(tg)}`);

  // The showcase snapshot for the same branch (plan §2.4 seeds)
  const s = createTown({ seed, start: 'showcase_l2d2', branch: b });
  const sniff = s.sniff();
  say(`SHOWCASE L2D2 Sniff: ${sniff.items.map(i => `[${i.kind}] ${i.title}`).join(' · ')}; forecast ${sniff.forecast?.motive} on ${sniff.forecast?.patch_name}`);
  const board = s.board();
  say(`  Lane: ${board.cats.filter(c => c.scene === 'lane').map(c => (c.discovered ? `${c.name}@${c.anchor}${c.drawn_mark ? `(${c.drawn_mark})` : ''}` : `?@${c.anchor}`)).join(' ')}`);
  say(`  Bell: ${board.cats.filter(c => c.scene === 'bell').map(c => c.name).join(' ')} · Outsiders: ${board.cats.filter(c => c.scene === 'outsiders').map(c => c.name ?? '(silhouette)').join(' ')}`);
  for (const id of ['togemaru', 'daifuku', 'kinako']) {
    const tg2 = s.tags(id);
    say(`  hover ${id}: ${[...tg2.in_scene.map(x => `${x.word} on ${x.cat}`), ...tg2.chips.map(x => `${x.word} on ${x.cat} (chip under ${x.scene})`)].join(', ') || 'no tag'}`);
  }
  // The challenger fight
  ev = s.beginEncounter({ patch: 'LPY', posse: ['mikan', 'hige', 'pon', 'kinako'], opponents: ['challenger', 'stray'] });
  const join = ev.find(e => e.type === 'AllyJoined');
  say(`  Challenger Standoff: "${ev.find(e => e.type === 'Standoff').text}"${join ? `; ${join.cat} joins: "${join.line?.text}"` : '; no join-in'}`);
  s.routed('challenger', { by: 'mikan', how: 'by_pile_on' }); s.endEncounter({ outcome: 'win' });
  const o2 = s.verdictOffer();
  say(`  Second Verdict: ${['nose', 'chase', 'recruit'].map(k => `${k} ${o2.cards[k].available ? 'open' : `greyed "${o2.cards[k].reason_text}"`}`).join(' · ')}`);
  s.applyVerdict(o2.cards.nose.available ? 'nose' : 'chase');
  say(`  Togemaru after: ${s.cat('togemaru').state} ${gr(s.cat('togemaru'))}; hash ${s.hash()}`);
  out[b] = { canon_hash: t.hash(), showcase_hash: s.hash(), togemaru: t.snapshot().arc, log };
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(out, null, 1));

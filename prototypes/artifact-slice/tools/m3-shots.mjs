// PROTOTYPE - NOT FOR PRODUCTION
// M3 evidence harness (IMPLEMENTATION-PLAN §5 M3 row; §5.2): headless Chromium, SwiftShader WebGL, ?test=1 frames.
//   - the Rivals board: Lane rest and focus (Togemaru, Daifuku, a silhouette), the full Rival card, Outsiders, the Bell
//     (cross-scene chip), branches B (knot + Togemaru in the Crew) and C (legend card); hover by mouse ray
//   - timing: first open (build) and re-open (<= 300 ms), scene change; draw calls and triangles per scene (<= 200 / 250k)
//   - the Standoff with the memory line (confirm locked for 1 s), the three Verdict cards (L1 and a Life 2 Bribe row),
//     the Declaration (A) and closing cards (B, C), the Pause menu's Rivals tab, the combat Verdict hook
// Writes PNGs, results.json and README.md to production/qa/evidence/artifact-slice/M3/.
//   node tools/build.mjs && node tools/m3-shots.mjs [--only name]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const repo = path.resolve(root, '../..');
const OUT = path.join(repo, 'production/qa/evidence/artifact-slice/M3');
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null;
const srv = await serve(0), port = srv.address().port;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const R = { shots: {}, timing: {}, checks: {}, errors: [] };
const prev = fs.existsSync(path.join(OUT, 'results.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'results.json'), 'utf8')) : null;
if (only && prev) Object.assign(R, prev, { errors: [] });

async function page(query, w = 1920, h = 1080) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('request', (r) => { if (!r.url().startsWith('http://localhost')) errors.push('EXTERNAL REQUEST ' + r.url()); });
  await p.goto(`http://localhost:${port}/dist/dev.html?test=1&${query}`);
  await p.waitForFunction('window.__ready === true', null, { timeout: 180000 });
  return { p, ctx, errors };
}
const boardStats = (p) => p.evaluate(() => { const m = window.__cat.m3(), b = m.board; return { ...b.stats(), rest: document.querySelectorAll('.rb-nm').length, tagsDom: [...document.querySelectorAll('.rb-tag')].map((e) => e.textContent) }; });
/** Text items on screen at rest (key-screens §2.12: <= 16): place name, active tab name, ribbons, buttons. */
const textItems = (p) => p.evaluate(() => { const vis = (e) => e.offsetParent !== null && getComputedStyle(e).visibility !== 'hidden';
  return [...document.querySelectorAll('.rb-hdr .k-h, .rb-pill, .rb-nm .k-ribbon, .rb-tag, .rb-btns .k-prompt, .rb-card:not(.off) .r, .rb-card:not(.off) .head')].filter(vis).length; });

const SHOTS = [
  // name, query, note, after(p)
  ['board-lane-rest', 'board=lane&branch=A', 'Lane scene, rest (nothing focused): names only, faint arrows, steam puffs, silhouettes in the shade'],
  ['board-lane-focus-togemaru', 'board=lane&branch=A&focus=togemaru', 'Focus Togemaru (keys): lift + gold rim, his arrow bright, Goma Rival tag, others dim, card'],
  ['board-lane-focus-daifuku', 'board=lane&branch=A&focus=daifuku', 'Focus the Boss: every member arrow bright, "Old Gang: Hige · the Bell" line in the card, anger card'],
  ['board-lane-focus-silhouette', 'board=lane&branch=A&focus=sasa', 'Focus a silhouette: "?" pom, "Not met yet" card, no tags'],
  ['board-lane-full-card', 'board=lane&branch=A&focus=togemaru&full=1', 'South: the full Rival card, every history entry pinned first (first sniff, notch, fled, routed, nose)'],
  ['board-outsiders', 'board=outsiders&branch=A&focus=challenger', 'Outsiders: the challenger silhouette beside its stake stamp'],
  ['board-bell-focus-hige', 'board=bell&branch=A&focus=hige', 'Bell: Crew arrows to Mikan; Hige focused: "Before you" history, "Old Boss: Daifuku · the Lane" line in the card'],
  ['board-bell-focus-kinako', 'board=bell&branch=A&focus=kinako', 'Bell: Kinako shows no tag while Sasa is unmet'],
  ['board-lane-B', 'board=lane&branch=B', 'Branch B: Togemaru recruited, a named bell-cord knot card on his old spot'],
  ['board-bell-B', 'board=bell&branch=B&focus=togemaru', 'Branch B: Togemaru in the Bell scene'],
  ['board-lane-C', 'board=lane&branch=C', 'Branch C: Togemaru Chased Off, a legend card on his spot'],
  ['standoff-memory', 'vantage=1&m3=standoff&branch=L1', 'L1D2 Standoff: the sim’s memory line; the Fight prompt locked 1 s (ring)'],
  ['verdict-l1-none', 'vantage=1&m3=verdict&branch=L1', 'L1D2 Verdict on Togemaru: three cards, no focus, first-Verdict hint bubble (5 words); Togemaru low, ears back, fresh notch on his ear'],
  ['verdict-l1-up', 'vantage=1&m3=verdict&branch=L1&card=up', 'Nose-Touch raised: tell "Tail still." (Grudge 43 < 45)'],
  ['verdict-l1-left', 'vantage=1&m3=verdict&branch=L1&card=left', 'Chase Off raised: ears drop, Mikan turns away'],
  ['verdict-l1-right', 'vantage=1&m3=verdict&branch=L1&card=right', 'Recruit raised: Life 1 "Free" step, starts Aloof'],
  ['verdict-l2-right', 'vantage=1&m3=verdict&branch=A&focus=goma&card=right', 'Life 2 Verdict on Goma from the sim: Recruit greyed in place; the bubble agrees ("Turns its tail to the bell.") and Goma turns his back. Goma is not slice-recruitable (Nemesis §3.1 DR-01)'],
  ['verdict-l2-bribe', 'vantage=1&m3=verdict&branch=B&nemstart=test_l2_kagi_rout&focus=kagi&card=right&step=fair', 'The Bribe row from a real sim offer on Kagi (test start test_l2_kagi_rout): Fair 96 open, Feast 192 short (Stash 150), Crew 4/6, eyes on the fish'],
  ['verdict-l2-up', 'vantage=1&m3=verdict&branch=A&focus=goma&card=up', 'Life 2 Verdict on Goma: Nose-Touch tell from the sim'],
  ['declaration-A', 'm3=declaration&branch=A', 'L2D2 Sniff, branch A: the Declaration card (Sworn Rival)'],
  ['closing-B', 'm3=declaration&branch=B', 'L2D2 Sniff, branch B: "Wears the bell now"'],
  ['closing-C', 'm3=declaration&branch=C', 'L2D2 Sniff, branch C: "Run out of town"'],
  ['pause-rivals', 'm3=pause&branch=A', 'Pause: Mikan · Rivals · Options, the Rivals tab'],
];

for (const [name, q, note] of SHOTS) {
  if (only && !name.includes(only)) continue;
  const { p, ctx, errors } = await page(q);
  const buf = await p.screenshot(); fs.writeFileSync(path.join(OUT, `${name}.png`), buf);
  const rec = { query: q, note };
  if (q.startsWith('board')) { rec.board = await boardStats(p); rec.textItems = await textItems(p); }
  R.shots[name] = rec; R.errors.push(...errors.map((e) => `${name}: ${e}`)); await ctx.close();
  console.log(name, rec.board ? `${rec.board.calls} calls ${rec.board.triangles} tris` : '');
}

/* timing, hover and scene budget on one page */
if (!only || only === 'timing') {
  const { p, ctx, errors } = await page('branch=A');
  R.timing = await p.evaluate(() => {
    const m = window.__cat.m3(), out = {};
    let t = performance.now(); m.openBoard({ scene: 'lane' }); out.firstOpenMs = +(performance.now() - t).toFixed(1); m.board.frame(0);
    m.board.close(); t = performance.now(); m.openBoard({ scene: 'lane' }); m.board.frame(0); out.reopenMs = +(performance.now() - t).toFixed(1);
    const sc = {};
    for (const id of ['lane', 'outsiders', 'bell']) { t = performance.now(); m.board.goScene(id); m.board.frame(1); m.board.frame(0); sc[id] = { switchMs: +(performance.now() - t).toFixed(1), calls: m.board.scene3.stats.calls, triangles: m.board.scene3.stats.triangles }; }
    out.scenes = sc; m.board.goScene('lane'); m.board.frame(1);
    return out;
  });
  // hover: the mouse ray focuses a cat after 120 ms (key-screens §2.9)
  const pt = await p.evaluate(() => window.__cat.m3().board.screenOf('togemaru'));
  await p.mouse.move(pt.x, pt.y);
  R.timing.hover = await p.evaluate(() => { const b = window.__cat.m3().board; b.frame(0.05); const early = b.focus; b.frame(0.1); b.frame(0.05); return { before120ms: early, after: b.focus, tags: b.tagsInScene().map((x) => `${x.kind}:${x.to}`) }; });
  await p.screenshot({ path: path.join(OUT, 'board-lane-hover-togemaru.png') });
  // keys: J closes, arrows walk focus toward the perch
  R.timing.keys = await p.evaluate(() => { const b = window.__cat.m3().board; b.setFocus(null); b.key('ArrowUp'); const first = b.focus; b.key('ArrowUp'); const second = b.focus; b.key('ArrowUp'); return { first, second, third: b.focus }; });
  R.errors.push(...errors.map((e) => `timing: ${e}`)); await ctx.close();
  console.log('timing', JSON.stringify(R.timing));
}

/* rules checks shown on the board (tags never on an undiscovered cat; Kinako none while Sasa is unmet) */
if (!only || only === 'checks') {
  const { p, ctx, errors } = await page('branch=A');
  R.checks = await p.evaluate(() => {
    const m = window.__cat.m3(), b = m.board; m.openBoard({ scene: 'lane' }); const model = b.model, out = { tagOnUndiscovered: [], perCat: {} };
    for (const c of Object.values(model.cats)) {
      if (c.scene !== 'lane' && c.scene !== 'bell' && c.scene !== 'outsiders') continue;
      b.goScene(c.scene, c.id); b.frame(0);
      const tags = b.tagsInScene(); out.perCat[c.id] = tags.map((t) => `${t.kind}:${t.to}`);
      for (const t of tags) if (!model.cats[t.to].discovered || !c.discovered) out.tagOnUndiscovered.push(`${c.id}->${t.to}`);
    }
    out.kinakoTags = out.perCat.kinako; out.ok = out.tagOnUndiscovered.length === 0 && (out.kinakoTags || []).length === 0;
    return out;
  });
  R.errors.push(...errors.map((e) => `checks: ${e}`)); await ctx.close();
  console.log('checks', R.checks.ok);
}

await browser.close(); srv.close();
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(R, null, 2));
const lines = Object.entries(R.shots).map(([n, r]) => `| \`${n}.png\` | ${r.note}${r.board ? ` (${r.board.calls} calls, ${(r.board.triangles / 1000).toFixed(0)}k tris, ${r.textItems} text items)` : ''} |`);
const prevReadme = fs.existsSync(path.join(OUT, 'README.md')) ? fs.readFileSync(path.join(OUT, 'README.md'), 'utf8') : '';
const kept = prevReadme.includes('\n## Round 1 fixes') ? prevReadme.slice(prevReadme.indexOf('\n## Round 1 fixes')) : '';   // hand-written review sections survive a re-run
fs.writeFileSync(path.join(OUT, 'README.md'), `<!-- PROTOTYPE - NOT FOR PRODUCTION -->
# M3 evidence: Rivals, Verdict, the Rivals board

Generated by \`node tools/m3-shots.mjs\` (prototypes/artifact-slice), headless Chromium with SwiftShader at 1920x1080, \`?test=1\`.
Facts come from the nemesis simulation (\`src/sim/nemesis/\`, \`createTown({start: 'showcase_l2d2', branch})\` and the L1 arc played by its rules).

| Shot | What it shows |
|---|---|
${lines.join('\n')}
| \`board-lane-hover-togemaru.png\` | Mouse hover (ray against the cat capsules) focuses Togemaru after 120 ms |

## Timing and budget

- First open (builds the three sets and the cats): **${R.timing.firstOpenMs} ms** (SwiftShader); re-open: **${R.timing.reopenMs} ms** (budget 300 ms).
- Per scene (calls / triangles / switch ms): ${Object.entries(R.timing.scenes || {}).map(([k, v]) => `${k} ${v.calls} / ${v.triangles} / ${v.switchMs}`).join(' · ')} (budget 200 calls, 250k tris).
- Hover: before 120 ms \`${R.timing.hover && R.timing.hover.before120ms}\`, after \`${R.timing.hover && R.timing.hover.after}\`, tags ${JSON.stringify(R.timing.hover && R.timing.hover.tags)}.
- Keys from rest (Up x3): ${JSON.stringify(R.timing.keys)}.

## Checks

- No tag on an undiscovered cat: ${R.checks.tagOnUndiscovered && R.checks.tagOnUndiscovered.length === 0 ? 'PASS' : 'FAIL ' + JSON.stringify(R.checks.tagOnUndiscovered)}.
- Kinako shows no tag while Sasa is unmet: ${R.checks.kinakoTags && R.checks.kinakoTags.length === 0 ? 'PASS' : 'FAIL'}.
- Console errors and external requests: ${R.errors.length ? R.errors.length + ' (see results.json)' : 'none'}.
${kept}`);
console.log('errors', R.errors.length ? R.errors : 'none');

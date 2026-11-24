// PROTOTYPE - NOT FOR PRODUCTION
// M0 look-dev harness. Renders (headless Chromium, SwiftShader WebGL, fixed settings):
//   - the comparison: our ?view=01 in Day and Dusk beside design/previews/01-exploration.png
//   - 8 orbit shots 45° apart around Mikan × Day and Dusk (+ a contact sheet per phase)
//   - pixel checks: silhouette line width (1080p and 85% render scale), ink ΔE2000,
//     E-5 separation, no neutral-grey shadows; the "best on desktop" card at 390 × 844 touch
// and writes PNGs + README.md to production/qa/evidence/artifact-slice/M0/env/.
//   node tools/build.mjs && node tools/m0-shots.mjs [--quick]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve.mjs';
import { readPNG, writePNG, shrink, blit, blank, lineCheck, separation, shadowTint } from './pixel-checks.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const repo = path.resolve(root, '../..');
const OUT = path.join(repo, 'production/qa/evidence/artifact-slice/M0/env');
fs.mkdirSync(OUT, { recursive: true });
const quick = process.argv.includes('--quick');

const srv = await serve(0), port = srv.address().port;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const log = [];
async function shot(query, { w = 1920, h = 1080, touch = false, save, evalFn } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  const p = await ctx.newPage(); const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('request', (r) => { if (!r.url().startsWith('http://localhost')) errors.push('EXTERNAL REQUEST ' + r.url()); });
  const t0 = Date.now();
  await p.goto(`http://localhost:${port}/dist/dev.html?${query}`);
  await p.waitForFunction('window.__ready === true', null, { timeout: 180000 });
  const buf = await p.screenshot();
  const state = await p.evaluate(() => (window.__cat ? window.__cat.state() : null));
  const extra = evalFn ? await p.evaluate(evalFn) : null;
  await ctx.close();
  if (save) fs.writeFileSync(path.join(OUT, save), buf);
  log.push({ query, ms: Date.now() - t0, errors, save });
  if (errors.length) console.error(query, errors);
  console.log('shot', query, save || '', ((Date.now() - t0) / 1000).toFixed(1) + 's');
  return { img: readPNG(buf), state, extra, errors };
}

const R = { compare: {}, orbit: {}, line: {}, sep: {}, shadow: {}, perf: {}, card: {} };

/* 1. comparison at the 01 framing */
const target = readPNG(fs.readFileSync(path.join(repo, 'design/previews/01-exploration.png')));
const v = {};
for (const ph of ['day', 'dusk']) {
  const r = await shot(`view=01&phase=${ph}&test=1`, { save: `view01-${ph}.png` });
  v[ph] = r; R.perf[ph] = r.state.stats;
}
{
  const t = shrink(target, 2), d = shrink(v.day.img, 2), k = shrink(v.dusk.img, 2);
  const sheet = blank(960 * 3 + 40, 540 + 20); blit(sheet, t, 10, 10); blit(sheet, d, 960 + 20, 10); blit(sheet, k, 1920 + 30, 10);
  fs.writeFileSync(path.join(OUT, 'compare-01.png'), writePNG(sheet));
  for (const ph of ['day', 'dusk']) { // full-size pair for close reading
    const s2 = blank(1920 * 2 + 30, 1080 + 20); blit(s2, target, 10, 10); blit(s2, v[ph].img, 1920 + 20, 10);
    fs.writeFileSync(path.join(OUT, `compare-01-${ph}-full.png`), writePNG(shrink(s2, 2)));
  }
}

/* 2. orbit shots */
for (const ph of ['day', 'dusk']) {
  const sheet = blank(480 * 4 + 50, 270 * 2 + 30);
  for (let k = 0; k < 8; k++) {
    if (quick && k % 2) continue;
    const r = await shot(`orbit=${k}&phase=${ph}&test=1`, { save: `orbit-${ph}-${k}.png` });
    R.orbit[`${ph}-${k}`] = { camera: r.state.camera, dist: r.state.dist, calls: r.state.stats.calls };
    blit(sheet, shrink(r.img, 4), 10 + (k % 4) * 490, 10 + Math.floor(k / 4) * 280);
  }
  fs.writeFileSync(path.join(OUT, `orbit-${ph}-sheet.png`), writePNG(sheet));
}

/* 3. pixel checks */
for (const ph of ['day', 'dusk']) {
  const mask = await shot(`view=01&phase=${ph}&test=1&mask=cats`, { save: `mask-cats-${ph}.png` });
  R.line[`${ph}-100`] = lineCheck(v[ph].img, mask.img);
  R.sep[`${ph}-view01`] = separation(v[ph].img, mask.img);
  const o = await shot(`orbit=0&phase=${ph}&test=1`); const om = await shot(`orbit=0&phase=${ph}&test=1&mask=cats`);
  R.sep[`${ph}-orbit0`] = separation(o.img, om.img);
  R.line[`${ph}-orbit0`] = lineCheck(o.img, om.img);
}
{
  const s85 = await shot('view=01&phase=day&test=1&res=0.85', { save: 'view01-day-res85.png' });
  const m85 = await shot('view=01&phase=day&test=1&res=0.85&mask=cats');
  R.line['day-85'] = lineCheck(s85.img, m85.img);
}
for (const [ph, q] of [['day', 'view=01'], ['dusk', 'view=01'], ['day', 'orbit=2'], ['dusk', 'orbit=5']]) {
  const a = await shot(`${q}&phase=${ph}&test=1&post=0`), s = await shot(`${q}&phase=${ph}&test=1&mask=shade`, { save: `mask-shade-${ph}-${q.replace('=', '')}.png` }), al = await shot(`${q}&phase=${ph}&test=1&mask=albedo`);
  R.shadow[`${ph}-${q}`] = shadowTint(a.img, s.img, al.img, ph === 'day' ? '#6E6AA8' : '#7A4E8C');
}

/* 4. desktop gate */
{
  const isCard = () => ({ card: !!document.getElementById('desktop-card'), scrollW: document.scrollingElement.scrollWidth, innerW: innerWidth });
  const small = await shot('', { w: 390, h: 844, touch: true, save: 'desktop-card-390x844.png', evalFn: isCard });
  const big = await shot('', { w: 1920, h: 1080, evalFn: isCard });
  R.card = { small: small.extra, big: big.extra };
}
await browser.close(); srv.close();

/* ---------------------------------------------------------------- report */
const texDir = path.join(root, 'assets/tex'), man = JSON.parse(fs.readFileSync(path.join(texDir, 'manifest.json'), 'utf8'));
const texBytes = Object.values(man).reduce((a, m) => a + m.bytes, 0);
const gameJs = fs.statSync(path.join(root, 'dist/game.js')).size;
const ok = (b) => (b ? 'within' : '**outside**');
const L = (k) => R.line[k] || {};
const errs = log.filter((l) => l.errors.length);
const md = `# M0 environment look-dev: evidence

PROTOTYPE - NOT FOR PRODUCTION. Generated by \`prototypes/artifact-slice/tools/m0-shots.mjs\` on ${new Date().toISOString().slice(0, 10)}
(headless Chromium, SwiftShader WebGL, 1920 × 1080, \`?test=1\` deterministic frames). Numbers are measurements;
each is shown beside the plan's threshold (IMPLEMENTATION-PLAN §5 M0 row, art bible L-2/L-3/E-1/E-5).

## How to re-run

\`\`\`
cd prototypes/artifact-slice
node tools/bake-textures.mjs     # kit -> assets/tex/*.webp (only when tools/bake/tex-defs.js changes)
node tools/build.mjs
node tools/m0-shots.mjs          # writes this folder
\`\`\`

Live: \`node tools/serve.mjs\` then open \`/dist/dev.html\` (drag to orbit, wheel zoom, WASD walk, 1/2 Day/Dusk, O toggles the paint post).

## Comparison (judged by the art and creative directors, then the user)

| File | What |
|---|---|
| \`compare-01.png\` | 01-exploration.png (target) · our Day · our Dusk at the 01 framing (half size) |
| \`compare-01-day-full.png\`, \`compare-01-dusk-full.png\` | target beside ours |
| \`view01-day.png\`, \`view01-dusk.png\` | our frames at full size |
| \`orbit-day-sheet.png\`, \`orbit-dusk-sheet.png\` | 8 orbit shots 45° apart (yaw 0 = behind Mikan); singles are \`orbit-<phase>-<k>.png\` |

## Pixel checks

| Check | Measurement | Threshold | |
|---|---|---|---|
| Silhouette line width, Day, 1080p (cats) | median ${L('day-100').widthMedian} px (p10 ${L('day-100').widthP10}, p90 ${L('day-100').widthP90}; ${L('day-100').samples} samples) | 2.0 ± 0.5 px | ${ok(Math.abs(L('day-100').widthMedian - 2) <= 0.5)} |
| Silhouette line width, Dusk, 1080p | median ${L('dusk-100').widthMedian} px (${L('dusk-100').samples} samples) | 2.0 ± 0.5 px | ${ok(Math.abs(L('dusk-100').widthMedian - 2) <= 0.5)} |
| Silhouette line width, Day, 85% render scale | median ${L('day-85').widthMedian} px (${L('day-85').samples} samples) | 2.0 ± 0.5 px at output | ${ok(Math.abs(L('day-85').widthMedian - 2) <= 0.5)} |
| Silhouette line width, orbit 0 (Explore 3.0 m), Day / Dusk | ${L('day-orbit0').widthMedian} / ${L('dusk-orbit0').widthMedian} px | 2.0 ± 0.5 px | ${ok(Math.abs(L('day-orbit0').widthMedian - 2) <= 0.5 && Math.abs(L('dusk-orbit0').widthMedian - 2) <= 0.5)} |
| Ink ΔE2000 of line-core pixels vs #33273B, Day / Dusk | median ${L('day-100').inkDEMedian} / ${L('dusk-100').inkDEMedian} (p90 ${L('day-100').inkDEP90} / ${L('dusk-100').inkDEP90}) | ≤ 3 | ${ok(L('day-100').inkDEMedian <= 3 && L('dusk-100').inkDEMedian <= 3)} |
${Object.entries(R.sep).map(([k, s]) => `| E-5 separation, ${k} | cat L* ${s.catL} vs ring ${s.ringL}: Δ ${s.diff} | ≥ 20 L* | ${ok(s.diff >= 20)} |`).join('\n')}
${Object.entries(R.shadow).map(([k, s]) => `| No neutral-grey shadow, ${k} | ${s.neutralPct}% of ${s.shadedPx} shaded px neutral; mean shade multiplier (R,G,B) ${s.meanTint.join(', ')}; hue agreement with the phase shadow colour cos ${s.hueCos} | 0% neutral; tint toward the phase shadow (cos > 0.5) | ${ok(s.neutralPct < 1 && s.hueCos > 0.5)} |`).join('\n')}
| "Best on desktop" card, 390 × 844 touch | card ${R.card.small.card ? 'shown' : 'NOT shown'}; scrollWidth ${R.card.small.scrollW} / viewport ${R.card.small.innerW} | shown, no horizontal scroll | ${ok(R.card.small.card && R.card.small.scrollW <= R.card.small.innerW)} |
| Card at 1920 × 1080, fine pointer | card ${R.card.big.card ? 'shown' : 'not shown'} | not shown | ${ok(!R.card.big.card)} |

Method notes. Line width: from each edge pixel of the cat mask (\`?mask=cats\`), walk outward along the mask normal in 0.5 px steps
and integrate line coverage \`(L*bg − L*) / (L*bg − L*ink)\` (anti-aliasing counted fractionally). Ink ΔE: pixels with coverage > 0.92.
E-5: greyscale L*, Gaussian σ = 4 px, cat interior (eroded 3 px) vs a ring 6–24 px outside. Shadows: \`?mask=shade\` marks shaded
environment pixels, \`?mask=albedo\` gives the unlit albedo with the same haze; the shade multiplier actual / albedo is "neutral" when its
channel spread is under 6% of its mean (very light shade or heavy haze, multiplier > 0.93, is skipped and counted: ${Object.values(R.shadow).map((s) => s.skippedHazed).join(' / ')}).
These run on the environment as built; the cat checks measure whatever \`src/render/cats/\` currently draws.

## Performance (SwiftShader counts; frame time needs a real laptop, plan §4.8)

| | Day 01 view | Dusk 01 view | Budget |
|---|---|---|---|
| Draw calls per frame (env + post + cats + lantern + wires) | ${R.perf.day.calls} | ${R.perf.dusk.calls} | ≤ 350 street |
| Shadow-map pass draw calls (re-rendered only on phase change) | ${R.perf.day.shadowCalls} | ${R.perf.dusk.shadowCalls} | |
| Triangles per frame | ${R.perf.day.triangles} | ${R.perf.dusk.triangles} | ≤ 500k |
| Texture memory (GPU estimate incl. mips, shadow map, post target) | ${R.perf.day.texMB} MB | ${R.perf.dusk.texMB} MB | ≤ 160 MB |
| Baked environment textures (download) | ${(texBytes / 1048576).toFixed(2)} MB in ${Object.keys(man).length} WebP files | | ≤ 8 MB |
| game.js | ${(gameJs / 1024).toFixed(0)} KB | | ≤ 1.5 MB |

## Run log

${log.length} page loads; ${errs.length ? errs.map((e) => `- ${e.query}: ${e.errors.join('; ')}`).join('\n') : 'no console errors, no external requests.'}
`;
fs.writeFileSync(path.join(OUT, 'README.md'), md);
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(R, null, 1));
console.log(md);

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
import { readPNG, writePNG, shrink, blit, blank, lineCheck, separation, shadowTint, e5Ink, litGround } from './pixel-checks.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const repo = path.resolve(root, '../..');
const OUT = path.join(repo, 'production/qa/evidence/artifact-slice/M0/env');
fs.mkdirSync(OUT, { recursive: true });
const quick = process.argv.includes('--quick'), motionOnly = process.argv.includes('--motion');

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

const R = { compare: {}, orbit: {}, line: {}, sep: {}, e5: {}, ground: {}, lens: {}, shadow: {}, perf: {}, card: {}, motion: {} };
const lensFn = () => window.__cat.lensCheck();

/* 0. orbit-and-walk capture: Mikan walks down the lane toward the sea while the camera swings round */
async function motion(ph) {
  const dir = path.join(OUT, 'motion'); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, recordVideo: { dir, size: { width: 1280, height: 720 } } });
  const p = await ctx.newPage(); const errors = []; p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto(`http://localhost:${port}/dist/dev.html?test=1&phase=${ph}`);
  await p.waitForFunction('window.__ready === true', null, { timeout: 180000 });
  const sheet = blank(320 * 4 + 50, 180 * 3 + 40), frames = 12;
  for (let i = 0; i < frames; i++) {
    if (i) await p.evaluate(() => window.__cat.drive({ x: 0, z: -1, frames: 15, yaw: 13 }));
    await p.waitForTimeout(150);
    const buf = await p.screenshot(); fs.writeFileSync(path.join(dir, `walk-${ph}-${String(i).padStart(2, '0')}.png`), buf);
    R.lens[`walk-${ph}-${String(i).padStart(2, '0')}`] = await p.evaluate(lensFn);
    blit(sheet, shrink(readPNG(buf), 4), 10 + (i % 4) * 330, 10 + Math.floor(i / 4) * 190);
  }
  for (let i = 0; i < 24; i++) { await p.evaluate(() => window.__cat.drive({ x: 0.3, z: -1, frames: 4, yaw: 3 })); await p.waitForTimeout(60); }
  const vid = p.video(); await ctx.close();
  const vpath = await vid.path(), dst = path.join(dir, `orbit-walk-${ph}.webm`); fs.renameSync(vpath, dst);
  fs.writeFileSync(path.join(dir, `walk-${ph}-sheet.png`), writePNG(sheet));
  R.motion[ph] = { frames, webm: path.basename(dst), bytes: fs.statSync(dst).size, errors };
  console.log('motion', ph, errors.length ? errors : 'ok');
}
for (const ph of ['day', 'dusk']) await motion(ph);
if (motionOnly) { await browser.close(); srv.close(); process.exit(0); }

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
    const r = await shot(`orbit=${k}&phase=${ph}&test=1`, { save: `orbit-${ph}-${k}.png`, evalFn: lensFn });
    R.lens[`orbit-${ph}-${k}`] = r.extra;
    R.orbit[`${ph}-${k}`] = { camera: r.state.camera, dist: r.state.dist, calls: r.state.stats.calls };
    blit(sheet, shrink(r.img, 4), 10 + (k % 4) * 490, 10 + Math.floor(k / 4) * 280);
  }
  fs.writeFileSync(path.join(OUT, `orbit-${ph}-sheet.png`), writePNG(sheet));
}

/* 3. pixel checks */
async function figureChecks(key, q, _img, opts = {}) {
  // the frame is re-shot back-to-back with its masks: the cat module is being edited in parallel, so a frame from
  // minutes earlier can disagree with a fresh mask
  const img = (await shot(q, opts)).img;
  const mk = (m) => shot(`${q}&mask=${m}`, opts);
  const [mc, mt, mb] = [await mk('cats'), await mk('catsTop'), await mk('blobs')];
  if (opts.saveMasks) for (const [n, r] of [['cats', mc], ['catsTop', mt], ['blobs', mb]]) fs.writeFileSync(path.join(OUT, `mask-${n}-${key}.png`), writePNG(r.img));
  R.line[key] = lineCheck(img, mc.img);
  R.sep[key] = separation(img, mc.img);       // the retired coat-vs-ground number, kept for reference
  R.e5[key] = e5Ink(img, mc.img, mt.img, mb.img);
  return mc;
}
for (const ph of ['day', 'dusk']) {
  const mc = await figureChecks(`${ph}-view01`, `view=01&phase=${ph}&test=1`, v[ph].img, { saveMasks: true });
  const sh = await shot(`view=01&phase=${ph}&test=1&mask=shade`);
  R.ground[`${ph}-view01`] = litGround(v[ph].img, sh.img, mc.img, [760, 620, 1460, 920]);
  const o = await shot(`orbit=0&phase=${ph}&test=1`);
  await figureChecks(`${ph}-orbit0`, `orbit=0&phase=${ph}&test=1`, o.img);
}
{ // worst cases (review-final): white coat on the fully lit lane at the Explore 3 m camera, at 85% scale and at 390 px width
  const s85 = await shot('view=01&phase=day&test=1&res=0.85', { save: 'view01-day-res85.png' });
  await figureChecks('day-view01-85', 'view=01&phase=day&test=1&res=0.85', s85.img);
  const o85 = await shot('orbit=0&phase=day&test=1&res=0.85', { save: 'orbit-day-0-res85.png' });
  await figureChecks('day-orbit0-85', 'orbit=0&phase=day&test=1&res=0.85', o85.img);
  const n390 = await shot('orbit=0&phase=day&test=1', { w: 390, h: 844, save: 'orbit-day-0-390w.png' });
  await figureChecks('day-orbit0-390w', 'orbit=0&phase=day&test=1', n390.img, { w: 390, h: 844 });
  R.line['day-85'] = R.line['day-view01-85'];
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

## Fix pass 2 (art-director and creative-director reviews, GO WITH FIXES)

- **Sunlight:** animated dappled leaf-light (komorebi): every foliage clump casts its shadow through sun-flecks cut in sun-view space,
  re-rendered each frame and drifting with the wind; crisper cast light on upright planes (the Dusk wall banding); a warm glow at the sea gap.
- **Set dressing on every side:** inked bucket and pots (aloe and a clipped shrub), drain covers, two posters and the notice, rain-streak
  and moss stains, drainpipes, a wall gate and a fence gate, a broom, ivy over the fence, more tree mass over the coping, a vending machine
  (lit at Dusk), an air-con unit, a layered mountain skyline, and the passer-by's legs (a kit-drawn stand-in card, shown only when the
  camera looks down the lane, its one valid side).
- **Stone lantern repainted:** round lathe parts with no facets, painted moss patches and a green drip, a softer painted terminator.
- **Ground:** lit lane re-valued toward #D2C4A4; the paint post's Kuwahara radius halved and its wobble reduced (no vertical streaks).
- **Fixes:** no half-transparent set pieces (camera-soft props are hidden outright; foliage cards the lens would pass through are dropped);
  the end-of-lane town repainted as two crisp layers with dusk-lit windows.
- **Wind:** foliage sway, laundry flutter, grass bend, cloud drift (sim time, so test frames stay deterministic).
- **Cats and the dapple:** the dapple falls on the environment only; the cat module is lit through \`setLighting\` and was not changed.

**Carry-over pass (owner approved the look; review-final "carry into M1", environment items).** Look unchanged. Lit lane raised to
L* ≥ 79; the paint post no longer runs Kuwahara on upright planes and the plaster stains are flat hard-edged shapes (no vertical
smear); a grazing sun no longer smears the shadow map into soft bands (the Dusk wall is one clean tone, cast light on upright planes
is hard-edged); low foliage cards near the lens are culled, with a lens-proximity test over every orbit and walk frame; leaf litter,
cracks, a puddle, sandy patches and bricks break up the lane in orbits 1, 2, 5 and 6; E-5 is tested under the rewritten inked-figure rule.

## Motion

| File | What |
|---|---|
| \`motion/walk-day-sheet.png\`, \`motion/walk-dusk-sheet.png\` | 12 frames: Mikan walks down the lane toward the sea while the camera orbits from behind to her side |
| \`motion/walk-<phase>-NN.png\` | the frames at 1280 × 720 |
| \`motion/orbit-walk-day.webm\`, \`motion/orbit-walk-dusk.webm\` | the same, recorded headlessly (SwiftShader, so the frame rate is not representative) |

## Pixel checks

| Check | Measurement | Threshold | |
|---|---|---|---|
| Silhouette line width, Day / Dusk, 01 framing (cats) | median ${L('day-view01').widthMedian} / ${L('dusk-view01').widthMedian} px | 2.0 ± 0.5 px (L-3) | ${ok(Math.abs(L('day-view01').widthMedian - 2) <= 0.5 && Math.abs(L('dusk-view01').widthMedian - 2) <= 0.5)} |
| Silhouette line width, Day, 85% render scale | median ${L('day-85').widthMedian} px | 2.0 ± 0.5 px at output | ${ok(Math.abs(L('day-85').widthMedian - 2) <= 0.5)} |
| Ink ΔE2000 of line-core pixels vs #33273B, Day / Dusk | median ${L('day-view01').inkDEMedian} / ${L('dusk-view01').inkDEMedian} | ≤ 3 (L-2) | ${ok(L('day-view01').inkDEMedian <= 3 && L('dusk-view01').inkDEMedian <= 3)} |
${Object.entries(R.e5).map(([k, e]) => `| **E-5 (inked figures)**, ${k} | ink L* ${e.lineL} vs ring ${e.ringL}: Δ ${e.diff}; line ≥ 1.5 px on ${(e.fracGe15 * 100).toFixed(1)}% of ${e.samples} samples (median ${e.widthMedian}, p10 ${e.widthP10}); excluded: ${e.excluded.occluded} occluded, ${e.excluded.hole} interior gap, ${e.excluded.contact} on the blob; blobs ${e.figures.map((f) => (f.blob ? 'yes' : '**no**') + ' (' + f.blobPx + ' px)').join(', ')} | Δ ≥ 35 L*; ≥ 90% ≥ 1.5 px; a blob under every cat | ${ok(e.diff >= 35 && e.fracGe15 >= 0.9 && e.figures.every((f) => f.blob))} |`).join('\n')}
${Object.entries(R.ground).map(([k, g]) => `| Lit lane value, ${k} | median L* ${g.Lmedian} (p25 ${g.Lp25}; ${g.px} lit px) | ${k.startsWith('day') ? '≥ 79 (carry-over 2; the high-key Day lane)' : 'observation (the Dusk key #FFC27A darkens the lane by design)'} | ${k.startsWith('day') ? ok(g.Lmedian >= 79) : '—'} |`).join('\n')}
| Lens proximity, all orbit and walk frames | worst: ${(() => { const w = Object.entries(R.lens).sort((a, b) => b[1].frac - a[1].frac)[0]; return w ? `${w[1].frac} of screen height (${w[0]}${w[1].what ? ', ' + w[1].what : ''})` : 'n/a'; })()} | no low foliage card over 0.6 of screen height; no visible prop within 0.8 m of the lens | ${ok(Object.values(R.lens).every((l) => l.frac <= 0.6))} |
${Object.entries(R.shadow).map(([k, s]) => `| No neutral-grey shadow, ${k} | ${s.neutralPct}% of ${s.shadedPx} shaded px neutral; mean shade multiplier (R,G,B) ${s.meanTint.join(', ')}; hue agreement with the phase shadow colour cos ${s.hueCos} | 0% neutral; tint toward the phase shadow (cos > 0.5) | ${ok(s.neutralPct < 1 && s.hueCos > 0.5)} |`).join('\n')}
| "Best on desktop" card, 390 × 844 touch | card ${R.card.small.card ? 'shown' : 'NOT shown'}; scrollWidth ${R.card.small.scrollW} / viewport ${R.card.small.innerW} | shown, no horizontal scroll | ${ok(R.card.small.card && R.card.small.scrollW <= R.card.small.innerW)} |
| Card at 1920 × 1080, fine pointer | card ${R.card.big.card ? 'shown' : 'not shown'} | not shown | ${ok(!R.card.big.card)} |

Method notes. Line width: from each edge pixel of the cat mask (\`?mask=cats\`), walk outward along the mask normal in 0.5 px steps
and integrate line coverage \`(L*bg − L*) / (L*bg − L*ink)\` (anti-aliasing counted fractionally). Ink ΔE: pixels with coverage > 0.92.
E-5 (rewritten for inked figures; the old coat-vs-ground number stays in \`results.json\` as \`sep\` for reference): the ink line's L*
(line-core pixels) vs the mean L* of a ring 6–24 px outside the figure; the share of silhouette samples whose line is ≥ 1.5 px; and a
contact blob (\`?mask=blobs\`) under each figure. **The p10 = 0 px of earlier runs is closed:** those samples were measurement
artefacts, now classified and excluded with counts shown: (a) *occluded* edges, where the figure continues behind environment
(the Wall Sitter's base behind the coping; \`?mask=catsTop\` draws the cats over everything to detect it), which correctly carry no line;
(b) *interior gaps* where the ray re-enters the figure within 16 px (between the back and the pom); (c) ear tips where the fill mask is
a pixel or two larger than the drawn ear, closed by starting the walk 3 px inside the mask; and (d) downward edges resting on the contact
blob. Each frame is shot back-to-back with its three masks. What remains below 1.5 px is reported in the "line ≥ 1.5 px" share. Lit lane value: median L* of lit, non-figure lane pixels
(\`?mask=shade\`) in the 01 framing. Lens proximity: \`__cat.lensCheck()\` replays the card shader's lens cull and reports the largest
remaining low foliage card (as a share of screen height) and any visible prop within 0.8 m. Shadows: \`?mask=shade\` marks shaded
environment pixels, \`?mask=albedo\` gives the unlit albedo with the same haze; the shade multiplier actual / albedo is "neutral" when its
channel spread is under 6% of its mean (very light shade or heavy haze, multiplier > 0.93, is skipped and counted: ${Object.values(R.shadow).map((s) => s.skippedHazed).join(' / ')}).
These run on the environment as built; the cat checks measure whatever \`src/render/cats/\` currently draws.

## Performance (SwiftShader counts; frame time needs a real laptop, plan §4.8)

| | Day 01 view | Dusk 01 view | Budget |
|---|---|---|---|
| Draw calls per frame (env + post + cats + lantern + wires) | ${R.perf.day.calls} | ${R.perf.dusk.calls} | ≤ 350 street |
| Sun shadow-map pass draw calls (re-rendered every frame for the moving dapple) | ${R.perf.day.shadowCalls} | ${R.perf.dusk.shadowCalls} | |
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

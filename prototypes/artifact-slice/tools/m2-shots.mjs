// PROTOTYPE - NOT FOR PRODUCTION
// M2 evidence harness (IMPLEMENTATION-PLAN §5 M2 row; §5.2): headless Chromium, SwiftShader WebGL, ?test=1 frames.
//   - 6 vantage shots x Day and Dusk (street HUD on)
//   - the 5-minute bot walk (3 seeds): camera-in-geometry frames (must be 0) and cat-in-frame % (must be >= 98)
//   - scripted flows driven through window.__cat on the territory simulation: Rescue Spray -> influence 100 -> the
//     Boss window -> Daifuku's climb to his stop; Over-mark -> Counter-Spray -> Keeper called -> (M3 Verdict stand-in)
//     -> Claim Spray; the 1 s sniff from the High Perch; Day -> Dusk with the lamp wave, the Call and the Head Home
//     thread; the garden-wall blend; the High Road
// Writes PNGs, results.json and README.md to production/qa/evidence/artifact-slice/M2/.
//   node tools/build.mjs && node tools/m2-shots.mjs [--quick]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve.mjs';
import { readPNG, writePNG, shrink, blit, blank } from './pixel-checks.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const repo = path.resolve(root, '../..');
const OUT = path.join(repo, 'production/qa/evidence/artifact-slice/M2');
fs.mkdirSync(OUT, { recursive: true });
const quick = process.argv.includes('--quick');
const srv = await serve(0), port = srv.address().port;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const R = { vantage: {}, bot: [], flows: {}, errors: [] };

async function page(query, w = 1920, h = 1080) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('request', (r) => { if (!r.url().startsWith('http://localhost')) errors.push('EXTERNAL REQUEST ' + r.url()); });
  await p.goto(`http://localhost:${port}/dist/dev.html?${query}`);
  await p.waitForFunction('window.__ready === true', null, { timeout: 180000 });
  return { p, ctx, errors };
}
const st = (p) => p.evaluate(() => window.__cat.state());
const brief = (s) => ({ influence: s.influence, window: s.window, boss: s.boss, mode: s.mode, home: s.home, phase: s.phase, discovered: s.discovered,
  posts: Object.fromEntries(s.patches.map((x) => [x.id, `${x.simOwner}:${x.scent}:${x.wisps}w${x.keeper ? '' : ':nokeeper'}`])), hash: s.hash });

/* 1. vantage shots */
for (const ph of ['day', 'dusk']) {
  const sheet = blank(640 * 3 + 40, 360 * 2 + 30);
  for (let k = 0; k < 6; k++) {
    const { p, ctx, errors } = await page(`vantage=${k}&phase=${ph}&test=1&hud=1`);
    const buf = await p.screenshot(); fs.writeFileSync(path.join(OUT, `vantage-${k}-${ph}.png`), buf);
    const s = await st(p); R.vantage[`${k}-${ph}`] = { calls: s.stats.calls, shadowCalls: s.stats.shadowCalls, triangles: s.stats.triangles, texMB: s.stats.texMB, mikan: s.mikan, mode: s.mode };
    blit(sheet, shrink(readPNG(buf), 3), 10 + (k % 3) * 650, 10 + Math.floor(k / 3) * 370);
    R.errors.push(...errors.map((e) => `vantage ${k} ${ph}: ${e}`)); await ctx.close();
    console.log('vantage', k, ph);
  }
  fs.writeFileSync(path.join(OUT, `vantages-${ph}-sheet.png`), writePNG(sheet));
}

/* 2. the 5-minute bot walk */
for (const seed of quick ? [7] : [7, 11, 23, 41]) {   // each seed on a fresh page
  const { p, ctx, errors } = await page('test=1&hud=0', 1280, 720);
  const r = await p.evaluate((sd) => window.__cat.botWalk(300, sd), seed);
  R.bot.push({ seed, ...r, fails: (r.fails || []).slice(0, 12) }); console.log('bot', seed, r.camInsideGeometry, r.catInFramePct);
  R.errors.push(...errors.map((e) => `bot: ${e}`)); await ctx.close();
}

/* 3. scripted flows (1280 x 720, HUD on) */
async function flow(name, query, steps) {
  const { p, ctx, errors } = await page(query, 1280, 720);
  const out = [];
  for (const [i, s] of steps.entries()) {
    await p.evaluate((js) => { eval(js); }, s.js);
    await p.waitForTimeout(60);
    const file = `flow-${name}-${String(i).padStart(2, '0')}.png`;
    if (s.shot !== false) fs.writeFileSync(path.join(OUT, file), await p.screenshot());
    out.push({ step: s.note, js: s.js, shot: s.shot !== false ? file : null, state: brief(await st(p)) });
  }
  const log = (await st(p)).log;
  R.flows[name] = { query, steps: out, lastEvents: log.map((e) => e.type + (e.kind ? ':' + e.kind : '') + (e.at ? ':' + e.at : '') + (e.cat ? ':' + e.cat : '')) };
  R.errors.push(...errors.map((e) => `${name}: ${e}`)); await ctx.close(); console.log('flow', name);
}
await flow('rescue', 'test=1&hud=1&start=showcase_l2d2', [
  { note: 'At Laundry Pole Yard: the post is Mikan\u2019s but fading (48: 2 drooping gold wisps at the cap); the influence bar under the Patch tag shows 95 with the crown unlit; the challenger stakes the post from the fence top', js: '__cat.teleport(0.05, -0.9, 20)' },
  { note: 'Holding E: the Rescue Spray hold ring fills around the key (1.2 s)', js: '__cat.input({ e: true, frames: 18 })' },
  { note: 'Rescue Spray lands: sparkle cloud at the cap, "48 \u2192 90", wisps sprout to 4, a tilt-up; the bar fills to 100, the crown lights, "Hidamari 95 \u2192 100"', js: '__cat.input({ e: true, frames: 20 })' },
  { note: 'The Boss window opens: the camera eases toward the lane wall (control kept); the edge badge points to Daifuku while the garden hides him', js: '__cat.input({ frames: 40 })' },
  { note: 'Daifuku (larger, crown pom, steam puffs) walks the coping, the High Road, in view', js: '__cat.input({ frames: 40 })' },
  { note: 'He drops to his Morning stop (S_M) at the yard', js: '__cat.input({ frames: 60 })' },
  { note: 'Whisker Sense: the compass ring with the roaming-Boss crown tick and the challenger stake', js: '__cat.input({ frames: 40, tab: true })' },
]);
await flow('rival', 'test=1&hud=1&start=l1d1', [
  { note: 'Life 1: Laundry Pole Yard is the Wall Sitters’ (80, 3 sage wisps). Whisker Sense shows the Rub Marks and the Keeper’s trail', js: '__cat.teleport(-1.25, -1.3, 300); __cat.input({ frames: 10, tab: true })' },
  { note: 'Over-mark LPY.rub1 (0.4 s rub): a sage puff and "\u221210"; the Wall Sitter on the coping sees it (seen = loud); anger puff on the tag', js: '__cat.input({ e: true, frames: 16 })' },
  { note: 'Counter-Spray the post (\u221230, always loud): a sage sparkle cloud at the cap, wisps wither one by one', js: '__cat.teleport(0.05, -0.9, 20); __cat.input({ e: true, frames: 40 })' },
  { note: 'A second Counter-Spray (\u221230): at <= 30 the Keeper is called ("Fight to clear, spray to claim.")', js: '__cat.input({ e: true, frames: 40 })' },
  { note: 'M3 stand-in: a Verdict clears the Keeper (verdict() is M3’s; called here only to show the Claim). Claim Spray offered', js: '__cat.verdict("LPY", "chase"); __cat.input({ frames: 4 })' },
  { note: 'Claim Spray: the post is Mikan’s at 70, gold wisps', js: '__cat.input({ e: true, frames: 40 })' },
]);
await flow('sniff', 'test=1&hud=1&start=l1d1&vantage=2', [
  { note: 'On the High Perch (wall coping), Daifuku on the Den wall within 10 m, undiscovered', js: '__cat.input({ frames: 2 })' },
  { note: 'Hold Whisker Sense with him on screen: the fill ring closes over 1.0 s', js: '__cat.input({ frames: 18, tab: true })' },
  { note: 'Discovered (sim CatDiscovered): tape star', js: '__cat.input({ frames: 14, tab: true })' },
]);
await flow('dusk', 'test=1&hud=1&vantage=0', [
  { note: 'Low Wall Corner, Day', js: '__cat.input({ frames: 2 })' },
  { note: 'Nap on the Sunspot (E): the phase blends Day -> Dusk', js: '__cat.teleport(0.45, 44.2, 200); __cat.input({ e: true, frames: 18 }); __cat.input({ frames: 40 })' },
  { note: 'The lamp wave runs uphill (lamps light one after another; the camera tilts up so the heads are in frame)', js: '__cat.input({ frames: 40, look: [0, -0.12] }); __cat.input({ frames: 60 })' },
  { note: 'Dusk; the Call; the Head Home thread runs from Mikan up the lane to Haru’s gate (H also shows it)', js: '__cat.input({ frames: 70, home: true })' },
  { note: 'Following the thread into Haru’s garden: the wall blend lowers and tightens the camera and fades the street HUD', js: '__cat.teleport(-0.2, 54.3, 90); __cat.input({ f: 1, frames: 45 })' },
]);
await flow('highroad', 'test=1&hud=1', [
  { note: 'Beside the left plaster wall uphill of the corner', js: '__cat.teleport(-1.2, 9.0, 0)' },
  { note: 'Space: hop onto the coping, the High Road ribbon (camera 3.4 m, +16°)', js: '__cat.input({ space: true, frames: 20 })' },
  { note: 'Walk the ribbon toward the High Perch', js: '__cat.input({ f: 1, frames: 60 })' },
]);
await browser.close(); srv.close();

/* ---------------------------------------------------------------- report */
const man = JSON.parse(fs.readFileSync(path.join(root, 'assets/tex/manifest.json'), 'utf8'));
const texBytes = Object.values(man).reduce((a, m) => a + m.bytes, 0), gameJs = fs.statSync(path.join(root, 'dist/game.js')).size;
const V = Object.values(R.vantage), mx = (k) => Math.max(...V.map((v) => v[k]));
const botOk = R.bot.every((b) => b.camInsideGeometry === 0 && b.catInFramePct >= 98);
const ok = (b) => (b ? 'within' : '**outside**');
const VN = ['Low Wall Corner: red-mailbox post, Sunspot, Haru’s garden wall', 'Laundry Pole Yard from up-lane: the post (approved M0 lantern), wisps', 'The High Perch on the wall: the Den wall and Daifuku within 10 m', 'Down the slope into the lower town, toward the sea', 'Looking back uphill at the stepped walls and the crest', 'Haru’s garden gate: the wall blend'];
const flowMd = Object.entries(R.flows).map(([n, f]) => `### ${n} (\`?${f.query}\`)\n\n| # | Step | Shot | Territory state after |\n|---|---|---|---|\n` + f.steps.map((s, i) => `| ${i} | ${s.step} | ${s.shot ? `\`${s.shot}\`` : '—'} | influence ${s.state.influence}, window ${s.state.window ? 'open' : 'shut'}, boss \`${s.state.boss}\`; LPY ${s.state.posts.LPY}${s.state.home ? '; home' : ''}${s.state.discovered && s.state.discovered.daifuku ? '; Daifuku discovered' : ''} |`).join('\n') + `\n\nEvents (last 20, from the sim): ${f.lastEvents.slice(-20).join(' · ') || '—'}\n`).join('\n');
const md = `# M2 Lane, exploration, territory (world side): evidence

PROTOTYPE - NOT FOR PRODUCTION. Generated by \`prototypes/artifact-slice/tools/m2-shots.mjs\` on ${new Date().toISOString().slice(0, 10)} (headless Chromium,
SwiftShader WebGL, \`?test=1\` deterministic frames). The territory rules, numbers and events come from the simulation
(\`src/sim/territory/\`, its own tests); this folder shows the street driving it.

## Acceptance (plan §5 M2 row, world side)

| Check | Result | Bar | |
|---|---|---|---|
${R.bot.map((b) => `| 5-min bot walk, seed ${b.seed} (${b.frames} frames at 30 Hz; ${b.hops} High Road hops; ${b.waypointsReached} waypoints over the ≈ 120 m lane) | camera inside geometry: **${b.camInsideGeometry}** frames; cat in frame **${b.catInFramePct}%** (out of frustum ${b.catOutOfFrustum}, behind camera-solid ${b.catBehindSolid}) | 0 frames; ≥ 98% | ${ok(b.camInsideGeometry === 0 && b.catInFramePct >= 98)} |`).join('\n')}
| 6 vantage shots × 2 phases | \`vantages-day-sheet.png\`, \`vantages-dusk-sheet.png\`; singles \`vantage-<k>-<phase>.png\` | 12 shots | ${ok(V.length === 12)} |
| Real-laptop frame log | **Not captured here** (headless SwiftShader cannot measure GPU time). Open the page with \`?fps=1\` on the laptop, walk the lane, then run \`__frameLog()\` in the console | manual | pending |
| Scent and influence unit tests (Territory §4.14 worked example 95 -> 100) | owned by the territory simulation (\`node --test 'tests/unit/territory/*.test.mjs'\`); reproduced live by the \`rescue\` flow below | — | see flow |

Bot method: a scripted player steers toward waypoints in camera space with WASD (30% running), bursts of random mouse look,
and random hops onto and off the wall/fence ribbons; the camera runs its real rule (collision, whisker probe, ground clamp).
"Camera inside geometry" = the lens inside any camera-solid box or below the lane; "cat in frame" = Mikan's head inside the frustum and not
behind a camera-solid box.

## Vantages

| k | What |
|---|---|
${VN.map((n, k) => `| ${k} | ${n} |`).join('\n')}

## Flows

${flowMd}

## Performance (SwiftShader counts; frame time needs the laptop log)

| | Worst vantage | Budget |
|---|---|---|
| Draw calls per frame (env + post + cats + inked props + VFX + HUD-free 3D) | ${mx('calls')} | ≤ 350 street |
| Sun shadow-map pass draw calls (every frame, for the moving dapple) | ${mx('shadowCalls')} | |
| Triangles per frame | ${mx('triangles')} | ≤ 500k |
| Texture memory (GPU estimate) | ${mx('texMB')} MB | ≤ 160 MB |
| Baked environment textures (download) | ${(texBytes / 1048576).toFixed(2)} MB | ≤ 8 MB |
| game.js | ${(gameJs / 1024).toFixed(0)} KB | ≤ 1.5 MB |

## Notes and flags

- **LPY's post id is \`gatepost\`** in the simulation; the street draws it with the approved M0 stone lantern (the 01 frame's Scent Post).
  Art should either rename the landmark or the id.
- **Claim Spray needs a Verdict** (M3). The \`rival\` flow calls \`verdict()\` as a stand-in only to show the Claim; the street never calls it.
- **The passer-by** stand-in card is kept for the approved 01 framing only; live play has none until the M4 leg rig.
- The Outsiders wisp colour is the simulation's placeholder (#4E9DA6).

## Run log

${R.errors.length ? R.errors.map((e) => '- ' + e).join('\n') : 'No console errors, no external requests.'}
`;
fs.writeFileSync(path.join(OUT, 'README.md'), md);
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(R, null, 1));
console.log(md.split('## Vantages')[0]);

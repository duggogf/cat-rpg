// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// M1 combat presentation harness. Bundles src/entries/combat.js -> dist/combat.js (+ dist/combat.html,
// the same files tools/build.mjs makes), then drives deterministic ?test=1 runs in headless Chromium
// (SwiftShader WebGL) through window.__cat and writes PNG evidence + README.md + results.json to
// production/qa/evidence/artifact-slice/M1/:
//   - 10 random-pause frames (seeded fights, seeds and pause frames; bots drive the controlled cat)
//   M1.1: a stagger cinematic, the Special cut-ins and the Team finisher, the skill bar (R), three rapid clicks
//   (latency + one-slot buffer), AI stalking, the guest, Daifuku, a 10-cat brawl, a WebM clip
//   - flash screening on the Special-chain capture: every frame at 60 fps, relative-luminance frame differencing
//     against the DR-50 caps (a screening tool, NOT a certified Harding test)
//   node tools/m1-shots.mjs [--only pile,flash,...] [--no-build]
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './serve.mjs';
import { readPNG, writePNG, shrink, blit, blank } from './pixel-checks.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const repo = path.resolve(root, '../..');
const OUT = path.join(repo, 'production/qa/evidence/artifact-slice/M1');
fs.mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const want = (k) => !only || only.includes(k);

/* ---------------------------------------------------------------- build (combat entry only) */
if (!args.includes('--no-build')) {
  const esbuild = require('esbuild');
  const threeGlobal = { name: 'three-global', setup(b) { b.onResolve({ filter: /^three$/ }, () => ({ path: 'three', namespace: 'three-global' })); b.onLoad({ filter: /.*/, namespace: 'three-global' }, () => ({ contents: 'module.exports = globalThis.THREE;', loader: 'js' })); } };
  await esbuild.build({ entryPoints: [path.join(root, 'src/entries/combat.js')], bundle: true, format: 'iife', outfile: path.join(root, 'dist/combat.js'), plugins: [threeGlobal], target: 'es2020', legalComments: 'none', logLevel: 'warning' });
  const frag = fs.readFileSync(path.join(root, 'page/index.html'), 'utf8');
  const CDN = '<script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>';
  const dev = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>:root{color-scheme:light}body{margin:0}</style></head><body>' +
    frag.replace(CDN, '<script src="/node_modules/three/build/three.min.js"></script>').replace('<script src="game.js"></script>', '<script src="combat.js"></script>') + '</body></html>';
  fs.writeFileSync(path.join(root, 'dist/combat.html'), dev);
  console.log('built dist/combat.js', fs.statSync(path.join(root, 'dist/combat.js')).size, 'bytes');
}

/* ---------------------------------------------------------------- browser */
const srv = await serve(0), port = srv.address().port;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const log = [], R = { shots: [], flash: null, perf: [], brawl: null };
async function open(query, { w = 1920, h = 1080 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/GPU stall|useProgram/.test(m.text())) errors.push(m.text()); });
  p.on('request', (r) => { if (!r.url().startsWith('http://localhost')) errors.push('EXTERNAL REQUEST ' + r.url()); });
  await p.goto(`http://localhost:${port}/dist/combat.html?test=1&${query}`);
  await p.waitForFunction('window.__ready === true', null, { timeout: 180000 });
  p.errors = errors; p.ctx = ctx;
  return p;
}
const ev = (p, js) => p.evaluate(js);
async function shot(p, name, note) {
  const buf = await p.screenshot({ timeout: 180000 });
  fs.writeFileSync(path.join(OUT, name), buf);
  const st = await ev(p, '__cat.state()');
  R.shots.push({ name, note, tick: st.tick, mode: st.mode, controlled: st.controlled, calls: st.stats.calls, triangles: st.stats.triangles, errors: p.errors.slice() });
  R.perf.push(st.stats);
  console.log('shot', name, '-', note);
  return readPNG(buf);
}
function sheet(imgs, cols, k, name) {
  const w = imgs[0].width / k, h = imgs[0].height / k, rows = Math.ceil(imgs.length / cols);
  const S = blank(cols * (w + 8) + 8, rows * (h + 8) + 8, [51, 39, 59]);
  imgs.forEach((im, i) => blit(S, shrink(im, k), 8 + (i % cols) * (w + 8), 8 + Math.floor(i / cols) * (h + 8)));
  fs.writeFileSync(path.join(OUT, name), writePNG(S));
}
function rng(seed) { let a = seed | 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------------------------------------------------------------- 1. random-pause frames (M1.1: Mikan only, the demo player bot) */
if (want('random')) {
  const r = rng(2026), runs = [['toughs3', 'demo'], ['toughs3', 'demo'], ['sandbox', 'demo'], ['captain', 'demo'], ['challenger', 'demo'], ['daifuku', 'demo'], ['toughs3', 'demo'], ['sandbox', 'demo'], ['captain', 'demo'], ['daifuku', 'demo']];
  const imgs = [];
  for (let i = 0; i < runs.length; i++) {
    const [fight, script] = runs[i], seed = 1 + Math.floor(r() * 50), at = 260 + Math.floor(r() * 1200);
    const p = await open(`fight=${fight}&seed=${seed}&script=${script}`);
    const st = await ev(p, `__cat.frames(${at})`);
    imgs.push(await shot(p, `random-${String(i + 1).padStart(2, '0')}.png`, `random pause: ${fight}, seed ${seed}, ${script} bot, frame ${at} (${st.mode})`));
    await p.ctx.close();
  }
  sheet(imgs, 5, 4, 'random-sheet.png');
}

/* ---------------------------------------------------------------- 2. stagger cinematic + Special chain + Team finisher */
if (want('chain')) {
  const p = await open('fight=toughs3&seed=3&script=demo');
  const st = []; 
  await ev(p, `__cat.until('Staggered')`);
  for (const [n, label] of [[1, 'zoom-in + shattered-glass blink, drawing 1 (Cream shard tints <= 0.16 alpha)'], [3, 'blink off (cracks only)'], [6, 'shards drift apart, time slowed'], [24, 'the cinematic settling (bars, barks and hit effects held back until it ends)']]) {
    await ev(p, `__cat.frames(${n - (st.lastN || 0)})`); st.lastN = n;
    st.push(await shot(p, `stagger-${String(st.length + 1).padStart(2, '0')}.png`, `stagger cinematic +${n} frames: ${label}`));
  }
  // a later stagger with Mikan's meter full: the F SPECIAL prompt, clear over the staggered cat
  const pr = (await ev(p, `__cat.untilWhere((s) => !!(s.special_prompt && s.special_prompt.ready), 3000)`)).ok;
  if (pr) { st.push(await shot(p, 'stagger-05-prompt.png', 'staggered enemy + Mikan ready: the F SPECIAL prompt')); }
  sheet(st, 5, 4, 'stagger-sheet.png');
  const ch = [];
  await ev(p, `__cat.until('SpecialChainStart')`);
  const info = await ev(p, `JSON.stringify(__cat.events('SpecialChainStart'))`);
  for (let k = 0; k < 4; k++) {
    const ok = await ev(p, `__cat.until('SpecialStart', 900, ${k})`); if (!ok.ok) break;
    await ev(p, '__cat.frames(2)'); ch.push(await shot(p, `special-cutin-${k + 1}a.png`, `Special cut-in ${k + 1}: halftone wipe / band sliding in`));
    await ev(p, '__cat.frames(16)'); ch.push(await shot(p, `special-cutin-${k + 1}b.png`, `Special ${k + 1}: cut-in held (only this cat over the impact-frame panel, colour value-matched)`));
    await ev(p, `__cat.until('SpecialEnd', 900, ${k})`); await ev(p, '__cat.frames(0)');
  }
  const tf = await ev(p, `__cat.until('TeamFinisher', 600)`);
  if (tf.ok) { await ev(p, '__cat.frames(14)'); ch.push(await shot(p, 'team-finisher-1.png', 'Team finisher (all four landed): the Pile-On cloud, each cat one beat with its face and word'));
    await ev(p, '__cat.frames(30)'); ch.push(await shot(p, 'team-finisher-2.png', 'Team finisher: a later beat')); }
  await ev(p, `__cat.until('SpecialChainEnd', 600)`); await ev(p, '__cat.frames(6)');
  ch.push(await shot(p, 'team-finisher-3.png', 'chain end: KA-BLAM, the cloud blows apart'));
  sheet(ch, 4, 4, 'special-chain-sheet.png');
  R.chain = { start: JSON.parse(info), teamFinisher: tf.ok };
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 3. skill bar (R) */
if (want('skillbar')) {
  const p = await open('fight=captain&seed=3');
  for (let i = 0; i < 80; i++) {
    const ok = await ev(p, `(() => { __cat.frames(30); const s = __cat.snapshot(); const m = s.entities.find(e => e.id === 'mikan'); return s.mode === 'fight' && m && !m.routed && m.paws - m.paws_reserved >= 1; })()`);
    if (ok) break;
  }
  await ev(p, '__cat.inject({ skillBar: true })'); await ev(p, '__cat.frames(16)');
  await shot(p, 'skillbar-menu.png', 'skill bar (R): time slowed, the low view behind Mikan, Move costs, Q/E to pick a crew cat and force its skill');
  await ev(p, `__cat.menu('nextCat')`); await ev(p, '__cat.frames(2)');
  await shot(p, 'skillbar-crew.png', 'skill bar on a crew cat: forcing its skill');
  await ev(p, `__cat.menu('confirm')`); await ev(p, '__cat.frames(2)');
  await shot(p, 'skillbar-target.png', 'target step: brackets on the target cat');
  await ev(p, `__cat.menu('confirm')`); await ev(p, '__cat.frames(2)'); await ev(p, '__cat.inject({ skillBar: true })');
  // wait for the COMMANDED cat's cast (not any AI cast): the crew cat picked with E is the second plate
  const who = await ev(p, `__cat.snapshot().entities.filter(e => e.side === 'posse' && !e.routed).sort((a, b) => b.controlled - a.controlled || a.slot - b.slot)[1].id`);
  const n0 = await ev(p, `__cat.events('MoveUsed').length`);
  const cast = await ev(p, `__cat.untilWhere((s, log) => log.filter(e => e.type === 'MoveUsed').slice(${n0}).some(e => e.user === '${who}'), 1500)`);
  await ev(p, '__cat.frames(4)');
  await shot(p, 'skillbar-cast.png', `the forced skill CAST by ${who} (${cast.ok ? 'cast seen' : 'cast NOT seen'}): name banner in the cat colour, its Move VFX, plate highlight`);
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 3b. three rapid clicks: latency and the one-slot buffer */
if (want('latency')) {
  const p = await open('fight=toughs3&seed=7');
  await ev(p, '__cat.frames(200)');
  // walk Mikan to her nearest enemy, then three light presses 4 ticks apart
  await ev(p, `(() => { for (let i = 0; i < 240; i++) { const s = __cat.snapshot(); const c = s.entities.find(e => e.controlled), t = s.entities.filter(e => e.side === 'enemy' && !e.routed).sort((a, b) => Math.hypot(a.pos[0]-c.pos[0], a.pos[2]-c.pos[2]) - Math.hypot(b.pos[0]-c.pos[0], b.pos[2]-c.pos[2]))[0]; const d = Math.hypot(t.pos[0]-c.pos[0], t.pos[2]-c.pos[2]); if (d < 1.2) break; __cat.inject({ move: [t.pos[0]-c.pos[0], t.pos[2]-c.pos[2]] }); __cat.frames(1); } })()`);
  // wait for a free Mikan (no attack, not flinched/knocked down, full movement) so the test measures the press, not a stun
  await ev(p, `__cat.untilWhere((s) => { const c = s.entities.find((e) => e.controlled); return c && !c.attack && c.can_move >= 1 && !['flinch', 'splat', 'knocked_down', 'evade', 'skitter'].includes(c.anim); }, 600)`);
  const t0 = (await ev(p, '__cat.state()')).tick;
  const imgs = [];
  for (let k = 0; k < 3; k++) { await ev(p, '__cat.inject({ light: true })'); await ev(p, '__cat.frames(1)'); if (k === 0) { await ev(p, '__cat.frames(2)'); imgs.push(await shot(p, 'latency-click1-plus3.png', 'click 1, +3 ticks: the light hit is on screen')); await ev(p, '__cat.frames(1)'); } else await ev(p, '__cat.frames(3)'); }
  await ev(p, '__cat.frames(70)');
  imgs.push(await shot(p, 'latency-after.png', 'after three rapid clicks: one or two hits landed, not three queued'));
  const log = await ev(p, `JSON.stringify(__cat.latency().filter(x => x.tick >= ${t0}))`);
  R.latency = { pressTicks: [t0 + 1, t0 + 5, t0 + 9], log: JSON.parse(log) };
  console.log('latency', log);
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 3c. AI stalking: cats squaring off */
if (want('stalk')) {
  const p = await open('fight=sandbox&seed=4');
  const imgs = [];
  await ev(p, '__cat.frames(230)');
  for (let k = 0; k < 4; k++) { await ev(p, '__cat.frames(40)'); imgs.push(await shot(p, `stalk-${k + 1}.png`, `AI intents (+${40 * (k + 1)} frames, player idle): circling, stalking, posturing (arched puff, hiss), flanking, dash-in`)); }
  R.intents = JSON.parse(await ev(p, `JSON.stringify(__cat.debug().cats.map(c => c.id + ':' + c.intent))`));
  sheet(imgs, 4, 4, 'stalk-sheet.png');
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 4. guest + Daifuku */
if (want('guest')) {
  const p = await open('fight=challenger&seed=4&script=demo');
  await ev(p, `__cat.until('GuestEntered')`); await ev(p, '__cat.frames(40)');
  await shot(p, 'guest-join.png', 'challenger with the Nose-Touch guest: dashed-gold guest plate, sprig tick');
  await p.ctx.close();
}
if (want('daifuku')) {
  const p = await open('fight=daifuku&seed=7&script=demo');
  await ev(p, '__cat.frames(150)');
  await shot(p, 'daifuku-standoff.png', 'Daifuku Standoff: name-card slam, speed-line bands, push-in');
  await ev(p, '__cat.frames(120)');
  await shot(p, 'daifuku-wall.png', 'Daifuku on his yard wall over the wash tub, the free third-person camera');
  await ev(p, `__cat.until('Staggered', 4000)`); await ev(p, '__cat.frames(2)');
  await shot(p, 'daifuku-stagger.png', 'Daifuku staggered: the full stagger treatment');
  await p.ctx.close();
}

/* ---------------------------------------------------------------- M1.2: camera pan at 120 Hz, damage numbers, final KO, shockwave */
if (want('pan')) {
  // the controlled cat walking while the camera turns 60°/s, stepped at 1/120 s (a 120 Hz display): its screen
  // position should advance smoothly every frame (no repeated positions = no 60 Hz double image)
  const p = await open('fight=toughs3&seed=3');
  await ev(p, '__cat.frames(240)');
  const series = await ev(p, `__cat.drive({ move: [0.6, -1], yaw: 60, n: 60 })`);
  const imgs = [];
  for (let k = 0; k < 6; k++) { await ev(p, `__cat.drive({ move: [0.6, -1], yaw: 60, n: 1, draw: true })`); imgs.push(await shot(p, `pan120-${k + 1}.png`, `camera pan at 120 Hz stepping, consecutive frame ${k + 1}: one crisp image of every cat (all interpolated), paint wobble eased under motion`)); }
  sheet(imgs, 3, 4, 'pan120-sheet.png');
  const dx = series.slice(1).map((q, i) => Math.hypot(q[0] - series[i][0], q[1] - series[i][1]));
  R.pan = { frames: series.length, dt: 1 / 120, yawDegRequested: 30, yawDegApplied: +(series[series.length - 1][2] - series[0][2]).toFixed(2), stepPx: dx.map((d) => +d.toFixed(2)),
    repeatedPositions: dx.filter((d) => d < 0.05).length, meanStepPx: +(dx.reduce((a, b) => a + b, 0) / dx.length).toFixed(2), maxAdjacentStepChangePx: +Math.max(...dx.slice(1).map((d, i) => Math.abs(d - dx[i]))).toFixed(2) };
  console.log('pan', JSON.stringify({ ...R.pan, stepPx: undefined }));
  await p.ctx.close();
}
if (want('dmg')) {
  const p = await open('fight=toughs3&seed=3&script=demo');
  await ev(p, `__cat.until('Hit', 3000, 14)`); await ev(p, '__cat.frames(5)');
  await shot(p, 'damage-numbers.png', 'damage numbers (on by default, N toggles): merged per target, Cream-on-Ink for the Posse\'s hits, Ink-on-Cream for hits taken; the 133 ms character-local hit flash; allies yellow, enemies red + red wedge');
  await p.ctx.close();
}
if (want('ko')) {
  const p = await open('fight=toughs3&seed=3&script=demo');
  // the KO cinematic starts at FinalKO, or after the Special chain if the last enemy fell to a chained Special
  const k = await ev(p, `__cat.untilWhere(() => __cat.state().ko != null, 7000)`);
  const imgs = [];
  for (const [n, label] of [[2, 'freeze frame over the impact background (halftone wipe in), only the KO\'d cat and its attacker, K.O.!'], [12, 'freeze held'], [30, 'slow motion, the camera turning on the two-shot'], [60, 'slow motion'], [92, 'back to normal speed: the outcome card']]) {
    await ev(p, `__cat.frames(${n - (imgs.lastN || 0)})`); imgs.lastN = n;
    imgs.push(await shot(p, `finalko-${String(imgs.length + 1).padStart(2, '0')}.png`, `final KO +${n} frames: ${label}`));
  }
  sheet(imgs, 5, 4, 'finalko-sheet.png'); R.ko = k.ok;
  await p.ctx.close();
}
if (want('shock')) {
  const p = await open('fight=daifuku&seed=7&script=demo');
  const t1 = await ev(p, `__cat.untilWhere((s) => s.telegraphs.some((t) => /belly|flop|slam|shock/.test(t.move || '')), 6000)`);
  await ev(p, '__cat.frames(20)');
  await shot(p, 'daifuku-bellyflop-telegraph.png', `Daifuku on the ground: the belly-flop telegraph (red, growing over the windup) ${t1.ok ? '' : '(NOT reached)'}`);
  await ev(p, `__cat.until('ShockwaveStart', 900)`);
  await ev(p, '__cat.frames(24)');
  await shot(p, 'daifuku-shockwave.png', 'the slam + 0.4 s: the shockwave ring expanding at the sim\'s front speed (evade it or be knocked down), THOOM!, dust and crack');
  await ev(p, `__cat.untilWhere((s) => s.mode === 'ended', 9000)`); await ev(p, '__cat.frames(100)');
  await shot(p, 'daifuku-phase1-end.png', 'phase 1 ends cleanly: KO cinematic, then the bout end card');
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 4b. 10-cat brawl triangle budget (0.5 M) */
if (want('brawl')) {
  const p = await open('fight=brawl10&seed=5&script=demo');
  const samples = [];
  for (let i = 0; i < 8; i++) { const st = await ev(p, '__cat.frames(150)'); if (st.mode === 'fight') samples.push({ tick: st.tick, calls: st.stats.calls, triangles: st.stats.triangles }); }
  await shot(p, 'brawl10.png', '10-cat brawl (Mikan + 3 vs 6) for the triangle budget');
  await p.ctx.close();
  const t = samples.map((x) => x.triangles).sort((a, b) => a - b);
  R.brawl = { samples, triangles: { min: t[0], median: t[t.length >> 1], max: t[t.length - 1] }, budget: 500000 };
  console.log('brawl', JSON.stringify(R.brawl.triangles));
}

/* ---------------------------------------------------------------- 4c. a short WebM of a fight (shake and hit-stop judged in motion) */
if (want('clip')) {
  const W = 960, H = 540, dir = path.join(OUT, '.clip'); fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
  const p = await open('fight=toughs3&seed=3&script=demo', { w: W, h: H });
  // ~10 s up to and through the first Special chain (strings, stagger, cut-ins, Team finisher), at a fixed 60 fps
  const st = await ev(p, `__cat.until('SpecialChainStart')`); await p.ctx.close();
  const q = await open('fight=toughs3&seed=3&script=demo', { w: W, h: H });
  await ev(q, `__cat.frames(${Math.max(1, st.tick - 300)})`);
  for (let i = 0; i < 600; i++) { await ev(q, '__cat.frames(1)'); fs.writeFileSync(path.join(dir, `f${String(i).padStart(4, '0')}.png`), await q.screenshot()); }
  await q.ctx.close();
  const { execFileSync } = await import('node:child_process');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '60', '-i', path.join(dir, 'f%04d.png'), '-c:v', 'libvpx-vp9', '-b:v', '2M', '-pix_fmt', 'yuv420p', path.join(OUT, 'fight-clip.webm')]);
  for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f)); fs.rmdirSync(dir);
  console.log('clip fight-clip.webm (600 frames @ 60 fps)');
}

/* ---------------------------------------------------------------- 5. flash screening on a Pile-On capture */
if (want('flash')) {
  const W = 480, H = 270;
  const p = await open('fight=toughs3&seed=3&script=demo', { w: W, h: H });
  // start 2 s before the Special chain (stagger, hits) and run through the cut-ins and the Team finisher
  await ev(p, `(() => { const r = __cat.until('SpecialChainStart'); return r; })()`);
  const startTick = (await ev(p, '__cat.state()')).tick;
  // rewind is impossible: re-open and stop 120 frames earlier
  await p.ctx.close();
  const q = await open('fight=toughs3&seed=3&script=demo', { w: W, h: H });
  const pre = Math.max(0, startTick - 120 - 2);
  await ev(q, `__cat.frames(${pre})`);
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const LUT = new Float32Array(256); for (let i = 0; i < 256; i++) LUT[i] = lin(i);
  const frames = [], N = 120 + 360 + 120;
  let prevL = null, prevRed = null;
  for (let i = 0; i < N; i++) {
    await ev(q, '__cat.frames(1)');
    const img = readPNG(await q.screenshot());
    const n = W * H, L = new Float32Array(n), red = new Uint8Array(n);
    let mean = 0;
    for (let k = 0; k < n; k++) {
      const r = LUT[img.data[k * 4]], g = LUT[img.data[k * 4 + 1]], b = LUT[img.data[k * 4 + 2]];
      L[k] = 0.2126 * r + 0.7152 * g + 0.0722 * b; mean += L[k];
      red[k] = r / (r + g + b + 1e-6) >= 0.8 && r > 0.05 ? 1 : 0;
    }
    let up = 0, down = 0, redCh = 0;
    if (prevL) for (let k = 0; k < n; k++) {
      const d = L[k] - prevL[k], dark = Math.min(L[k], prevL[k]);
      if (dark < 0.8) { if (d >= 0.1) up++; else if (d <= -0.1) down++; }
      if (red[k] !== prevRed[k]) redCh++;
    }
    const st = await ev(q, '__cat.state()');
    frames.push({ i, tick: st.tick, mode: st.mode, pile: st.pile, impact: st.impact, mean: +(mean / n).toFixed(4), up: +(up / n).toFixed(4), down: +(down / n).toFixed(4), redChange: +(redCh / n).toFixed(4) });
    if (i % 30 === 0) { fs.writeFileSync(path.join(OUT, `flash-frame-${String(i).padStart(3, '0')}.png`), writePNG(img)); }
    prevL = L; prevRed = red;
  }
  await q.ctx.close();
  // transitions: a frame whose same-direction luminance change (>= 0.10, darker < 0.80) covers > 20% of the screen
  // (art bible §10.9's area rule; WCAG's 25% of a 10° field is stricter in area). A flash = a pair of opposing transitions.
  const AREA = 0.2;
  const tr = frames.map((f) => (f.up > AREA ? 1 : f.down > AREA ? -1 : 0));
  const flashesInWindow = (a, b) => { let c = 0, last = 0; for (let i = a; i < b; i++) if (tr[i]) { if (last && tr[i] === -last) { c++; last = 0; } else last = tr[i]; } return c; };
  let max1 = 0, max5 = 0;
  for (let i = 0; i < frames.length; i++) { max1 = Math.max(max1, flashesInWindow(i, Math.min(frames.length, i + 60))); max5 = Math.max(max5, flashesInWindow(i, Math.min(frames.length, i + 300))); }
  const transitions = tr.filter(Boolean).length, maxArea = Math.max(...frames.map((f) => Math.max(f.up, f.down))), maxRed = Math.max(...frames.map((f) => f.redChange));
  const meanRange = [Math.min(...frames.map((f) => f.mean)), Math.max(...frames.map((f) => f.mean))];
  R.flash = { frames: frames.length, fps: 60, viewport: [W, H], areaRule: AREA, transitions, maxFlashesPer1s: max1, maxFlashesPer5s: max5, maxChangeArea: maxArea, maxRedChangeArea: maxRed, meanLuminanceRange: meanRange,
    verdict: { wcag_3_per_s: max1 <= 3, design_2_per_s: max1 <= 2, design_6_per_5s: max5 <= 6, red_5pct: maxRed <= 0.05 }, perFrame: frames };
  console.log('flash', JSON.stringify({ ...R.flash, perFrame: undefined }));
}

/* ---------------------------------------------------------------- write */
await browser.close(); srv.close();
const prev = fs.existsSync(path.join(OUT, 'results.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'results.json'), 'utf8')) : {};
const merged = { ...prev, date: new Date().toISOString().slice(0, 10) };
if (R.shots.length) { const keep = (prev.shots || []).filter((s) => !R.shots.some((x) => x.name === s.name)); merged.shots = keep.concat(R.shots).sort((a, b) => a.name.localeCompare(b.name)); }
if (R.flash) merged.flash = R.flash;
if (R.brawl) merged.brawl = R.brawl;
if (R.chain) merged.chain = R.chain;
if (R.latency) merged.latency = R.latency;
if (R.intents) merged.intents = R.intents;
if (R.pan) merged.pan = R.pan;
if (R.ko != null) merged.finalKO = R.ko;
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(merged, null, 1));
const errs = (merged.shots || []).flatMap((s) => s.errors || []);
console.log('wrote', OUT, errs.length ? `ERRORS: ${errs.length}` : 'no page errors');
if (errs.length) { console.error(errs.slice(0, 10).join('\n')); process.exitCode = 1; }

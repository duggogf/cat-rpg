// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// M1 combat presentation harness. Bundles src/entries/combat.js -> dist/combat.js (+ dist/combat.html,
// the same files tools/build.mjs makes), then drives deterministic ?test=1 runs in headless Chromium
// (SwiftShader WebGL) through window.__cat and writes PNG evidence + README.md + results.json to
// production/qa/evidence/artifact-slice/M1/:
//   - 10 random-pause frames (seeded fights, seeds and pause frames; bots drive the controlled cat)
//   - a Pile-On sequence (+ contact sheet), a full-screen impact frame (T4 Rout), a Tag-In frame,
//     Slow Blink (menu + target step), the ally guest join, Daifuku's knock-off and phase break
//   - flash screening on a Pile-On capture: every frame at 60 fps, relative-luminance frame differencing
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
const log = [], R = { shots: [], flash: null, perf: [] };
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

/* ---------------------------------------------------------------- 1. random-pause frames */
if (want('random')) {
  const r = rng(2026), runs = [['toughs3', 'bot'], ['toughs3', 'median'], ['sandbox', 'bot'], ['captain', 'bot'], ['challenger', 'bot'], ['daifuku', 'daifuku'], ['toughs3', 'bot'], ['sandbox', 'median'], ['captain', 'median'], ['daifuku', 'daifuku']];
  const imgs = [];
  for (let i = 0; i < runs.length; i++) {
    const [fight, script] = runs[i], seed = 1 + Math.floor(r() * 50), at = 260 + Math.floor(r() * 1200);
    const p = await open(`fight=${fight}&seed=${seed}&script=${script}`);
    const st = await ev(p, `__cat.frames(${at})`);
    imgs.push(await shot(p, `random-${String(i + 1).padStart(2, '0')}.png`, `random pause: ${fight}, seed ${seed}, ${script} bot, frame ${at} (${st.mode}, controlled ${st.controlled})`));
    await p.ctx.close();
  }
  sheet(imgs, 5, 4, 'random-sheet.png');
}

/* ---------------------------------------------------------------- 2. Pile-On sequence, impact frame, Tag-In */
if (want('pile')) {
  const p = await open('fight=toughs3&seed=7&script=bot');
  await ev(p, `__cat.until('CatRouted')`);
  await shot(p, 'impact-t4-rout-inversion.png', 'T4 Tough Rout: drawing 1 of the full-screen impact frame (mid tone matched to the frame mean, Ink silhouettes, effect keeps its colour), radial lines, lettered word');
  await ev(p, '__cat.frames(4)');
  await shot(p, 'impact-t4-rout-after.png', 'the same Rout 4 frames later: normal colours, radial focus lines (40% of the edge), the word, the routed Tough taking off');
  await ev(p, `__cat.until('TagIn')`); await ev(p, '__cat.frames(5)');
  await shot(p, 'tagin.png', 'Tag-In: bell-gold streak with the Relay pip, Relay chain over the plates, 0.3 s camera retarget');
  await ev(p, `__cat.until('PileOnStart')`);
  const seq = [];
  for (const [n, label] of [[1, 'wipe in (halftone, drawing 1)'], [5, 'panel + full-field lines'], [12, 'cloud boiling'], [24, 'a beat'], [40, 'the target bolts out of the cloud']]) {
    await ev(p, `__cat.frames(${n === 1 ? 1 : n - (seq.lastN || 1)})`); seq.lastN = n;
    seq.push(await shot(p, `pileon-${String(seq.length + 1).padStart(2, '0')}.png`, `Pile-On +${n} frames: ${label}`));
  }
  await ev(p, `__cat.until('PileOnEnd')`); await ev(p, '__cat.frames(2)');
  seq.push(await shot(p, 'pileon-06.png', 'Pile-On end: one big burst drawing, the giant word, the cloud blowing apart into four puffs'));
  await ev(p, '__cat.frames(14)');
  seq.push(await shot(p, 'pileon-07.png', 'Pile-On reveal: the Posse over the routed target'));
  await ev(p, '__cat.frames(70)');
  seq.push(await shot(p, 'pileon-08.png', 'outcome card'));
  sheet(seq, 4, 4, 'pileon-sheet.png');
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 3. Slow Blink */
if (want('slowblink')) {
  // nobody drives Mikan (the Posse AI fights); run until she banks a Paw, then open Slow Blink
  const p = await open('fight=captain&seed=3');
  for (let i = 0; i < 80; i++) {
    const ok = await ev(p, `(() => { __cat.frames(30); const s = __cat.snapshot(); const m = s.entities.find(e => e.id === 'mikan'); return s.mode === 'fight' && m && !m.routed && m.paws - m.paws_reserved >= 1 && !s.pile_on; })()`);
    if (ok) break;
  }
  await ev(p, '__cat.inject({ slowBlink: true })'); await ev(p, '__cat.frames(16)');
  await shot(p, 'slowblink-menu.png', 'Slow Blink: time x5%, lifted three-quarter view, grade -30% sat / -10% value, the command menu with Move costs, Set-up / Pay-off diamonds, props highlighted');
  await ev(p, `__cat.menu('confirm')`); await ev(p, '__cat.frames(2)');
  await shot(p, 'slowblink-target.png', 'Slow Blink target step: bell-gold brackets on the target; a Pay-off whose condition the target meets lights in the menu');
  await ev(p, `__cat.menu('confirm')`); await ev(p, '__cat.frames(2)');
  await shot(p, 'slowblink-queued.png', 'command queued: the menu moves to the next cat that can afford a Move; the queued pom shows on the plate');
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 4. guest + Daifuku */
if (want('guest')) {
  const p = await open('fight=challenger&seed=4&script=bot');
  await ev(p, `__cat.until('GuestEntered')`); await ev(p, '__cat.frames(40)');
  await shot(p, 'guest-join.png', 'challenger + Stray with the Nose-Touch guest: dashed gold guest plate above the stack (no glyph, no Paws), sprig tick, identity ribbon');
  await p.ctx.close();
}
if (want('daifuku')) {
  const p = await open('fight=daifuku&seed=7&script=daifuku');
  await ev(p, '__cat.frames(150)');
  await shot(p, 'daifuku-standoff.png', 'Daifuku Standoff: name-card slam, speed-line bands, push-in');
  await ev(p, '__cat.frames(90)');
  await shot(p, 'daifuku-wall.png', 'Daifuku on his yard wall over the wash tub: identity ribbon with 3-phase Nerve, anger puffs (Furious) and the Fired Up pom');
  await ev(p, `__cat.until('KnockOff')`); await ev(p, '__cat.frames(8)');
  await shot(p, 'daifuku-knockoff.png', 'knock-off: Hige shoves Daifuku off the wall toward the tub');
  await ev(p, `__cat.until('BossLanded')`); await ev(p, '__cat.frames(6)');
  await shot(p, 'daifuku-tub.png', 'he lands in the tub: opaque cream-and-cyan blob splat, dust and crack decal');
  await ev(p, `__cat.until('PhaseBreak')`); await ev(p, '__cat.frames(1)');
  await shot(p, 'daifuku-phasebreak-1.png', 'phase break (T5): impact frame, giant word');
  await ev(p, '__cat.frames(24)');
  await shot(p, 'daifuku-phasebreak-2.png', 'phase break +25 frames');
  await ev(p, `__cat.until('EncounterEnded')`); await ev(p, '__cat.frames(90)');
  await shot(p, 'daifuku-flees.png', 'phase-1 cap: Daifuku bolts for the Den (rival_fled)');
  await p.ctx.close();
}

/* ---------------------------------------------------------------- 5. flash screening on a Pile-On capture */
if (want('flash')) {
  const W = 480, H = 270;
  const p = await open('fight=toughs3&seed=7&script=bot', { w: W, h: H });
  // start 2 s before the Pile-On (includes the preceding hits) and run 2.5 s past its end
  await ev(p, `(() => { const r = __cat.until('PileOnStart'); return r; })()`);
  const startTick = (await ev(p, '__cat.state()')).tick;
  // rewind is impossible: re-open and stop 120 frames earlier
  await p.ctx.close();
  const q = await open('fight=toughs3&seed=7&script=bot', { w: W, h: H });
  const pre = Math.max(0, startTick - 120 - 2);
  await ev(q, `__cat.frames(${pre})`);
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const LUT = new Float32Array(256); for (let i = 0; i < 256; i++) LUT[i] = lin(i);
  const frames = [], N = 120 + 150 + 150;
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
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(merged, null, 1));
const errs = (merged.shots || []).flatMap((s) => s.errors || []);
console.log('wrote', OUT, errs.length ? `ERRORS: ${errs.length}` : 'no page errors');
if (errs.length) { console.error(errs.slice(0, 10).join('\n')); process.exitCode = 1; }

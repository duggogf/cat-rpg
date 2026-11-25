// PROTOTYPE - NOT FOR PRODUCTION
// M3: the Verdict after a won rival fight in a combat chapter (src/ui/m3-combat.js hook): the skilled smoke bot plays
// ?chapter=combat&fight=toughs2 to a win; the nemesis town receives Combat's events and offers the Verdict.
// Writes production/qa/evidence/artifact-slice/M3/verdict-combat.png and combat-verdict.json.
import { createRequire } from 'node:module'; import fs from 'node:fs'; import path from 'node:path';
import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.resolve(root, '../../production/qa/evidence/artifact-slice/M3');
const srv = await serve(0); const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); const errors = [];
p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await p.goto(`http://localhost:${srv.address().port}/dist/combat.html?chapter=combat&fight=${process.argv[2] || 'toughs2'}&test=1&script=bot&seed=1`);
await p.waitForFunction('window.__ready === true', null, { timeout: 180000 });
const r = await p.evaluate(() => window.__cat.until('EncounterEnded', 30000));
await p.evaluate(() => window.__cat.frames(330));
const v = await p.evaluate(() => ({ open: !!document.querySelector('.vd.on'), cards: [...document.querySelectorAll('.vd-card .t')].map((e) => e.textContent.trim()), strip: (document.querySelector('.vd-strip') || {}).textContent }));
await p.screenshot({ path: path.join(OUT, 'verdict-combat.png') });
fs.writeFileSync(path.join(OUT, 'combat-verdict.json'), JSON.stringify({ fight: r, verdict: v, errors }, null, 2));
console.log(JSON.stringify({ outcome: r.outcome, verdict: v, errors }));
await b.close(); srv.close();

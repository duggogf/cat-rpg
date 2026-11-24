// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Screenshot a page in headless Chromium with software WebGL.
// node tools/shot.mjs <path-under-root, e.g. dist/dev.html?view=01> <out.png> [width height]
// The page sets window.__ready = true once the frame is drawn (and may expose window.__cat for tests).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { serve } from './serve.mjs';
const [url, out, w = '1920', h = '1080'] = process.argv.slice(2);
const s = await serve(0);
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const errors = [];
p.on('pageerror', e => errors.push(String(e)));
p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
p.on('request', r => { const u = r.url(); if (!u.startsWith('http://localhost')) errors.push('EXTERNAL REQUEST ' + u); });
await p.goto(`http://localhost:${s.address().port}/${url}`);
await p.waitForFunction('window.__ready === true', null, { timeout: 120000 });
await p.screenshot({ path: out });
await b.close(); s.close();
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
console.log('wrote', out);

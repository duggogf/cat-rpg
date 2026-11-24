// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Pre-publish check: loads dist/index.html the way the Artifact host does — the fragment wrapped in a
// skeleton, three.js from the real jsDelivr URL, every other file relative — and fails on any console
// error, page error, failed request or a frame that never becomes ready. Prints the publish file list
// (JSON) on success: node tools/publish-check.mjs [query] > /dev/null
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../dist');
const query = process.argv[2] || '';
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f);
  if (fs.statSync(p).isDirectory()) walk(p); else files.push(path.relative(root, p)); } })(root);
// Stale build output (e.g. a mesh whose source was removed from assets/) is never published:
// a dist/mesh or dist/tex file goes out only if its source still exists under assets/.
const assets = path.resolve(root, '../assets');
const hasSource = f => !/^(mesh|tex|data)\//.test(f) || fs.existsSync(path.join(assets, f));
const publish = files.filter(f => !/^(index|dev|catlab|combat)\.html$/.test(f) && !/^(catlab|combat)\.js$/.test(f) && hasSource(f)).sort();
const frag = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + frag + '</body></html>';
const types = { '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
const srv = await new Promise(r => { const s = http.createServer((q, res) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname).slice(1);
  if (p === '' ) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page); }
  // Only files in the publish set are served, exactly as on the host.
  if (!publish.includes(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(path.join(root, p)).pipe(res);
}).listen(0, () => r(s)); });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errs = [];
pg.on('pageerror', e => errs.push('pageerror ' + e));
pg.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
pg.on('response', r => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
pg.on('request', r => { const u = r.url(); if (!u.startsWith('http://localhost') && !u.startsWith('https://cdn.jsdelivr.net/npm/three@0.160.1/')) errs.push('DISALLOWED ' + u); });
await pg.goto(`http://localhost:${srv.address().port}/${query}`);
try { await pg.waitForFunction('window.__ready === true', null, { timeout: 90000 }); } catch { errs.push('never ready'); }
await pg.screenshot({ path: path.join(root, '..', 'publish-check.png') });
await b.close(); srv.close();
if (errs.length) { console.error('PUBLISH CHECK FAILED\n' + errs.join('\n')); process.exit(1); }
console.error(`publish check OK (${publish.length} files)`);
console.log(JSON.stringify(publish));

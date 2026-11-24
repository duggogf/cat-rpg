// PROTOTYPE - NOT FOR PRODUCTION
// Bake the preview kit's painting helpers (design/previews/kit/kit.js) into textures.
//   node tools/bake-textures.mjs [name ...]      -> assets/tex/<name>.webp (+ manifest.json)
// Definitions live in tools/bake/tex-defs.js (browser script). Each SVG is rendered by
// headless Chromium at its exact pixel size, then encoded to WebP in the page (alpha kept;
// the runtime uploads alpha textures premultiplied, so colour under alpha=0 does not matter).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const repo = path.resolve(root, '../..');
const out = path.join(root, 'assets/tex');
fs.mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);

const b = await chromium.launch();
const p = await b.newPage({ deviceScaleFactor: 1 });
await p.setContent('<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block}</style></head><body></body></html>');
await p.addScriptTag({ path: path.join(repo, 'design/previews/kit/kit.js') });
await p.addScriptTag({ path: path.join(root, 'tools/bake/tex-defs.js') });
const names = await p.evaluate(() => Object.keys(window.TEX));
const manifest = fs.existsSync(path.join(out, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'manifest.json'), 'utf8')) : {};
let total = 0;
for (const name of names) {
  if (only.length && !only.includes(name)) continue;
  const { w, h, alpha } = await p.evaluate((n) => { const t = window.TEX[n]; document.body.innerHTML = t.svg(); return { w: t.w, h: t.h, alpha: !!t.alpha }; }, name);
  await p.setViewportSize({ width: w, height: h });
  const png = await p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  const webp = await p.evaluate(async ({ b64, w, h }) => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.86).split(',')[1];
  }, { b64: png.toString('base64'), w, h });
  const buf = Buffer.from(webp, 'base64');
  fs.writeFileSync(path.join(out, name + '.webp'), buf);
  manifest[name] = { w, h, alpha, bytes: buf.length };
  total += buf.length;
  console.log(name.padEnd(12), `${w}x${h}`, alpha ? 'alpha' : '     ', (buf.length / 1024).toFixed(0) + ' KB');
}
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 1));
const all = Object.values(manifest).reduce((a, m) => a + m.bytes, 0);
console.log('baked', (total / 1048576).toFixed(2), 'MB this run; set total', (all / 1048576).toFixed(2), 'MB');
await b.close();

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Bundles src/main.js -> dist/game.js (IIFE). `three` resolves to the global THREE,
// which the page loads first: jsDelivr in the published page, the npm copy in dev.
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname) + '/..';
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
const threeGlobal = {
  name: 'three-global',
  setup(b) {
    b.onResolve({ filter: /^three$/ }, () => ({ path: 'three', namespace: 'three-global' }));
    b.onLoad({ filter: /.*/, namespace: 'three-global' }, () => ({ contents: 'module.exports = globalThis.THREE;', loader: 'js' }));
  },
};
// Every file in src/entries/ is an entry. `main` -> dist/game.js (the published game);
// any other entry X (e.g. a lab page) -> dist/X.js plus a dev page dist/X.html.
const entries = fs.readdirSync(path.join(root, 'src/entries')).filter(f => f.endsWith('.js'));
for (const f of entries) {
  const name = f.replace(/\.js$/, '');
  await esbuild.build({
    entryPoints: [path.join(root, 'src/entries', f)], bundle: true, format: 'iife',
    outfile: path.join(dist, name === 'main' ? 'game.js' : name + '.js'), plugins: [threeGlobal], target: 'es2020',
    minify: process.argv.includes('--min'), sourcemap: false, legalComments: 'none',
  });
}
// Copy runtime assets (baked textures, meshes, data) into dist.
for (const dir of ['tex', 'mesh', 'data']) {
  const src = path.join(root, 'assets', dir);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(dist, dir), { recursive: true });
}
// Artifacts do not serve .bin: pack each mesh binary into its JSON as base64.
const meshDir = path.join(dist, 'mesh');
if (fs.existsSync(meshDir)) {
  for (const f of fs.readdirSync(meshDir).filter(f => f.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(meshDir, f), 'utf8'));
    if (j.bin && fs.existsSync(path.join(meshDir, j.bin))) {
      j.binB64 = fs.readFileSync(path.join(meshDir, j.bin)).toString('base64');
      fs.writeFileSync(path.join(meshDir, f), JSON.stringify(j));
      fs.unlinkSync(path.join(meshDir, j.bin));
    }
  }
}
const frag = fs.readFileSync(path.join(root, 'page/index.html'), 'utf8');
const CDN = '<script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>';
if (!frag.includes(CDN)) throw new Error('page/index.html must contain the pinned three CDN tag');
// Published fragment: written as-is (the Artifact host adds doctype/head/body).
fs.writeFileSync(path.join(dist, 'index.html'), frag);
// Dev document: same fragment, local three copy, full skeleton.
const dev = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>:root{color-scheme:light}body{margin:0}</style></head><body>' +
  frag.replace(CDN, '<script src="/node_modules/three/build/three.min.js"></script>') + '</body></html>';
fs.writeFileSync(path.join(dist, 'dev.html'), dev);
for (const f of entries) {
  const name = f.replace(/\.js$/, '');
  if (name !== 'main') fs.writeFileSync(path.join(dist, name + '.html'), dev.replace('<script src="game.js"></script>', `<script src="${name}.js"></script>`));
}
console.log('built', entries.join(', '), '- game.js', fs.statSync(path.join(dist, 'game.js')).size, 'bytes');

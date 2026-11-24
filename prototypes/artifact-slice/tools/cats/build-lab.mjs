// PROTOTYPE - NOT FOR PRODUCTION
// Builds ONLY the cat lab (dist/catlab.js + dist/catlab.html) and copies assets/mesh -> dist/mesh,
// so cat look-dev does not depend on the game entry compiling while it is being edited in parallel.
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname) + '/../..';
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
const threeGlobal = { name: 'three-global', setup(b) {
  b.onResolve({ filter: /^three$/ }, () => ({ path: 'three', namespace: 'three-global' }));
  b.onLoad({ filter: /.*/, namespace: 'three-global' }, () => ({ contents: 'module.exports = globalThis.THREE;', loader: 'js' }));
} };
await esbuild.build({ entryPoints: [path.join(root, 'src/entries/catlab.js')], bundle: true, format: 'iife', outfile: path.join(dist, 'catlab.js'), plugins: [threeGlobal], target: 'es2020' });
fs.cpSync(path.join(root, 'assets/mesh'), path.join(dist, 'mesh'), { recursive: true });
const frag = fs.readFileSync(path.join(root, 'page/index.html'), 'utf8');
const CDN = '<script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>';
const dev = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<style>:root{color-scheme:light}body{margin:0}</style></head><body>' + frag.replace(CDN, '<script src="/node_modules/three/build/three.min.js"></script>') + '</body></html>';
fs.writeFileSync(path.join(dist, 'catlab.html'), dev.replace('<script src="game.js"></script>', '<script src="catlab.js"></script>'));
console.log('built catlab');

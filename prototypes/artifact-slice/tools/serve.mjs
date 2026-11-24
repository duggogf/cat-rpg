// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Tiny static server for local dev and tests. Root = prototype folder.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.json':'application/json',
  '.png':'image/png', '.webp':'image/webp', '.bin':'application/octet-stream', '.woff2':'font/woff2', '.css':'text/css' };
export function serve(port = 0) {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(new URL(q.url, 'http://x').pathname);
      if (p === '/') p = '/dist/dev.html';
      const f = path.join(root, p);
      if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(r);
    }).listen(port, () => res(s));
  });
}
if (process.argv[1] && process.argv[1].endsWith('serve.mjs')) {
  const s = await serve(Number(process.argv[2] || 5173));
  console.log('http://localhost:' + s.address().port + '/');
}

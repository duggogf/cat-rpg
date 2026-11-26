// Serve this folder, open the scene in headless Chromium (SwiftShader), capture the shots, run the checks.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = __dirname, out = path.join(root, 'outputs');
const types = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
srv.listen(0, async () => {
  const port = srv.address().port;
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text().slice(0, 400)); });
  p.on('pageerror', (e) => console.log('[pageerror]', e.message));
  const phase = process.argv[2] || 'dusk';
  await p.goto(`http://localhost:${port}/index.html?phase=${phase}`);
  await p.waitForFunction('window.__ready === true', null, { timeout: 240000 });
  if (process.argv[3] === 'orbit') {
    const dir = path.join(root, 'orbit'); fs.mkdirSync(dir, { recursive: true });
    const list = [0, 45, 90, 135, 180, 225, 270, 315].map((y) => [y, 1.1, 2.4]).concat([[20, 0.22, 2.2], [20, 3.2, 2.6]]);
    for (const [y, h, d] of list) { await p.evaluate(([y, h, d]) => { window.setOrbit(y, h, d); window.render(); }, [y, h, d]); await p.screenshot({ path: path.join(dir, `o-${y}-${h}.png`) }); }
    console.log('orbit done'); await b.close(); srv.close(); return;
  }
  const shots = (process.argv[3] || 'behind:shot-behind,34:shot-34,side:shot-side').split(',');
  const report = [];
  for (const s of shots) {
    const [view, name] = s.split(':');
    if (process.env.ANALYZE) report.push(await p.evaluate((v) => window.analyze(v), view));
    await p.evaluate((v) => { window.setView(v); window.render(); }, view);
    await p.screenshot({ path: path.join(out, name + '.png') });
    console.log('saved', name);
  }
  if (report.length) { console.log(JSON.stringify(report, null, 1)); fs.writeFileSync(path.join(out, `checks-${phase}.json`), JSON.stringify(report, null, 1)); }
  await b.close(); srv.close();
});

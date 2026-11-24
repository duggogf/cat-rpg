#!/usr/bin/env node
// Render a mock-screenshot HTML page to PNG at 1920x1080 (deviceScaleFactor 1).
// Usage: node design/previews/render.js <file.html> <out.png> [width] [height]
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const [, , input, output, w = '1920', h = '1080'] = process.argv;
  if (!input || !output) {
    console.error('Usage: node design/previews/render.js <file.html> <out.png> [width] [height]');
    process.exit(1);
  }
  const width = parseInt(w, 10);
  const height = parseInt(h, 10);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('[page error]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('[console]', m.text()); });
  await page.goto('file://' + path.resolve(input), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  // Full page if the document is taller than the viewport (model sheets), else the viewport.
  const fullPage = await page.evaluate((vh) => document.documentElement.scrollHeight > vh + 4, height);
  await page.screenshot({ path: path.resolve(output), fullPage });
  await browser.close();
  console.log('wrote', output);
})();

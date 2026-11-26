// Painted textures for the bus-stop scene, baked at load time from SVG (flat shapes + turbulence
// displacement + mottle/brush/grain overlays), adapted from the skill's svg-paint-filters/helpers.
// Albedo only: gentle top-light, no cast shadows, no ink lines.
import * as THREE from 'three';

let _uid = 0; const uid = (p) => p + (_uid++);
const r1 = (v) => Math.round(v * 10) / 10;
function rng(seed) { let s = (seed >>> 0) || 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
function hex2(c) { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function mix(a, b, k) { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
const C = { wisteria: '#6E6AA8', cloudShade: '#C9D8F0', skyHorizon: '#F7A45A' };

function defs() {
  const disp = (id, f, oct, sc, seed, blur) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="${oct}" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${sc}" xChannelSelector="R" yChannelSelector="G"${blur ? ' result="d"' : ''}/>${blur ? `<feGaussianBlur in="d" stdDeviation="${blur}"/>` : ''}</filter>`;
  const ov = (id, f, oct, seed, m) => `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="${oct}" seed="${seed}" stitchTiles="stitch"/><feColorMatrix values="${m}"/></filter>`;
  const dark = '0 0 0 0 0.43  0 0 0 0 0.41  0 0 0 0 0.66';
  return `<defs>
    ${disp('k-rough', 0.022, 2, 6, 3)}${disp('k-wobble', 0.008, 2, 14, 5)}
    ${disp('k-leaf', 0.038, 2, 26, 7)}${disp('k-leaf-fine', 0.075, 2, 13, 11)}${disp('k-leaf-far', 0.02, 2, 16, 4, 0.8)}
    ${disp('k-cloud', 0.0075, 3, 46, 9, 1.1)}${disp('k-cloud-fine', 0.02, 2, 16, 2, 0.6)}
    ${disp('k-dab', 0.05, 1, 5, 13)}
    <filter id="k-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="k-soft2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
    ${ov('k-grain', 0.9, 2, 21, '0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0 0.5  0.9 0.5 0 0 -0.52')}
    ${ov('k-brush', '0.004 0.09', 3, 8, dark + '  1.5 0 0 0 -0.62')}
    ${ov('k-brush-v', '0.07 0.005', 3, 18, dark + '  1.5 0 0 0 -0.62')}
    ${ov('k-mottle', 0.012, 4, 31, dark + '  1.6 0 0 0 -0.7')}
    ${ov('k-mottle-light', 0.016, 3, 44, '0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 0.9  0 1.7 0 0 -0.78')}
  </defs>`;
}
const svg = (w, h, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${defs()}${content}</svg>`;
function texture(x, y, w, h, kind, opacity) {
  const light = kind === 'mottle-light';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#k-${kind})" opacity="${opacity}" style="mix-blend-mode:${light ? 'screen' : 'multiply'}"/>`;
}
const vgrad = (x, y, w, h, top, bot) => { const id = uid('vg'); return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`; };

/* ---------- foliage (gouache clumps) and clouds: from the kit helpers ---------- */
function foliage(o) {
  o = Object.assign({ x: 0, y: 0, w: 300, h: 200, seed: 1, dabs: true, density: 1 }, o);
  const T = Object.assign({ dark: '#2F6E4A', mid: '#5A9E4B', light: '#8DC65C', hi: '#CFE585' }, o.tones || {}), R = rng(o.seed * 131 + 17);
  const n = Math.round((9 + (o.w * o.h) / 9000) * o.density), cs = [];
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * 0.82;
    const r = (0.16 + R() * 0.16) * Math.min(o.w, o.h) * (1.1 - rr * 0.45);
    cs.push([o.x + Math.cos(a) * rr * o.w / 2, o.y + Math.sin(a) * rr * o.h / 2, r]);
  }
  const f = o.far ? 'k-leaf-far' : 'k-leaf';
  const c = (list, dx, dy, k, fill) => list.map((p) => `<circle cx="${r1(p[0] + dx)}" cy="${r1(p[1] + dy)}" r="${r1(p[2] * k)}" fill="${fill}"/>`).join('');
  const top = cs.filter((p) => p[1] < o.y + o.h * 0.12), hi = cs.filter((p, i) => p[1] < o.y - o.h * 0.02 && i % 2 === 0);
  let s = `<g filter="url(#${f})">${c(cs, 0, 0, 1, T.dark)}</g><g filter="url(#${f})">${c(cs, -o.w * 0.025, -o.h * 0.07, 0.8, T.mid)}</g>`
    + `<g filter="url(#${o.far ? f : 'k-leaf-fine'})">${c(top, -o.w * 0.045, -o.h * 0.13, 0.5, T.light)}</g>`;
  if (!o.far) s += `<g filter="url(#k-leaf-fine)">${c(hi, -o.w * 0.06, -o.h * 0.18, 0.22, T.hi)}</g>`;
  if (o.dabs && !o.far) {
    let d = '';
    for (let i = 0; i < n * 5; i++) {
      const p = cs[Math.floor(R() * cs.length)], a = R() * Math.PI * 2, rad = p[2] * (0.5 + R() * 0.62);
      const x = p[0] + Math.cos(a) * rad, y = p[1] + Math.sin(a) * rad, up = Math.sin(a) < 0.1 && Math.cos(a) < 0.5;
      const sz = (5 + R() * 7) * (o.dabScale || 1); const col = up ? (R() < 0.35 ? T.hi : T.light) : (R() < 0.5 ? T.dark : T.mid);
      d += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(sz)}" ry="${r1(sz * 0.52)}" fill="${col}" transform="rotate(${Math.round(R() * 180)} ${r1(x)} ${r1(y)})"/>`;
    }
    s += `<g filter="url(#k-dab)">${d}</g>`;
  }
  return `<g>${s}</g>`;
}
function cloud(o) {
  o = Object.assign({ x: 0, y: 0, w: 400, h: 300, seed: 1, shade: C.cloudShade, light: '#FFFFFF' }, o);
  const R = rng(o.seed * 97 + 5), puffs = [];
  const n = Math.round(16 + o.w / 26);
  for (let i = 0; i < n; i++) {
    const u = R() * 2 - 1;
    const lobe = 0.55 + 0.45 * Math.cos(u * 2.2 + o.seed) * Math.cos(u * 5.1 + o.seed * 1.7);
    const prof = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 1.7)), 0.7) * (0.55 + 0.45 * lobe);
    const v = Math.pow(R(), 0.75) * prof;
    const r = (0.11 + R() * 0.12) * o.w * (0.65 + 0.5 * prof) * (1 - v * 0.42);
    puffs.push([o.x + u * o.w * 0.44, o.y - r * 0.55 - v * o.h * 0.86, r]);
  }
  puffs.sort((a, b) => b[1] - a[1]);
  const circ = (dx, dy, k, fill, sel) => puffs.filter(sel || (() => true)).map((p) => `<circle cx="${r1(p[0] + dx)}" cy="${r1(p[1] + dy)}" r="${r1(p[2] * k)}" fill="${fill}"/>`).join('');
  const id = uid('cl');
  const mid = mix(o.shade, o.light, 0.5);
  const inner = `<g filter="url(#k-cloud)">${circ(0, 0, 1, o.shade)}</g><g filter="url(#k-cloud)">${circ(-o.w * 0.022, -o.h * 0.05, 0.9, o.light)}</g>`
    + `<g filter="url(#k-cloud-fine)">${circ(o.w * 0.03, o.h * 0.035, 0.5, mid, (p, i) => i % 3 === 0)}${circ(-o.w * 0.012, -o.h * 0.01, 0.44, o.light, (p, i) => i % 3 === 0)}</g>`;
  return `<clipPath id="${id}"><rect x="${o.x - o.w}" y="${o.y - o.h * 2}" width="${o.w * 2}" height="${o.h * 2}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
}
function tufts(cx, by, w, h, seed) {
  const R = rng(seed * 71 + 9), G = ['#2F6E4A', '#5A9E4B', '#8DC65C', '#A9D46A']; let s = '';
  for (let i = 0; i < 26; i++) {
    const x = cx + (R() - 0.5) * w, k = 0.6 + R() * 0.6, lean = (R() - 0.5) * 50 * k, hh = h * k * (0.5 + R() * 0.5), wd = 5 * k + 2;
    const col = G[Math.min(3, Math.floor(R() * 3 + (hh / h) * 1.2))];
    s += `<path d="M${r1(x - wd)} ${by}Q${r1(x + lean * 0.3)} ${r1(by - hh * 0.6)} ${r1(x + lean)} ${r1(by - hh)}Q${r1(x + lean * 0.4 + 1)} ${r1(by - hh * 0.5)} ${r1(x + wd)} ${by}Z" fill="${col}"/>`;
  }
  return `<g filter="url(#k-dab)">${s}</g>`;
}

/* ---------- bake ---------- */
async function bake(w, h, content, o = {}) {
  const url = URL.createObjectURL(new Blob([svg(w, h, content)], { type: 'image/svg+xml' }));
  const img = new Image(); img.src = url; await img.decode();
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  cv.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.NoColorSpace; t.premultiplyAlpha = !!o.alpha;
  t.wrapS = t.wrapT = o.clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  t.anisotropy = 4; t.needsUpdate = true;
  return t;
}
/** Value noise data texture; channel g holds the value, mean ~= mean, used by grain (g/0.83) and sky brush (g/0.9). */
function noiseCanvas(w, h, mean, amp, fx, fy, seed) {
  const R = rng(seed), G = 64, g = []; for (let i = 0; i < G * G; i++) g.push(R());
  const at = (x, y) => g[(((y % G) + G) % G) * G + (((x % G) + G) % G)];
  const vn = (x, y, per) => { const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
    const w0 = (a) => ((a % per) + per) % per;
    const a = at(w0(xi), w0(yi)), b = at(w0(xi + 1), w0(yi)), c = at(w0(xi), w0(yi + 1)), d = at(w0(xi + 1), w0(yi + 1));
    return a + (b - a) * su + (c - a) * sv + (a - b - c + d) * su * sv; };
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g2 = cv.getContext('2d'); const im = g2.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let n = 0, k = 1, tot = 0;
    for (let o = 0; o < 4; o++) { const pf = fx * (1 << o); n += vn(x / w * pf, y / h * fy * (1 << o), pf) * k; tot += k; k *= 0.55; }
    n = n / tot - 0.5 + (R() - 0.5) * 0.25;
    const v = Math.max(0, Math.min(255, Math.round(255 * (mean + n * amp))));
    const i = (y * w + x) * 4; im.data[i] = v; im.data[i + 1] = v; im.data[i + 2] = v; im.data[i + 3] = 255;
  }
  g2.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.needsUpdate = true;
  return t;
}

export async function bakeAll() {
  const T = {};
  T.grain = noiseCanvas(512, 512, 0.83, 0.32, 16, 16, 7);
  T.brush = noiseCanvas(512, 256, 0.9, 0.22, 4, 32, 11);

  // grass verge, 512 px = 4 m (tiles)
  {
    const R = rng(5); let dabs = '';
    for (let i = 0; i < 520; i++) {
      const x = R() * 512, y = R() * 512, sz = 3 + R() * 6, col = ['#76A050', '#90B05B', '#7FA653', '#99B862', '#6C964C'][Math.floor(R() * 5)];
      for (const ox of [-512, 0, 512]) for (const oy of [-512, 0, 512]) if (x + ox > -20 && x + ox < 532 && y + oy > -20 && y + oy < 532)
        dabs += `<ellipse cx="${r1(x + ox)}" cy="${r1(y + oy)}" rx="${r1(sz)}" ry="${r1(sz * 0.45)}" fill="${col}" transform="rotate(${Math.round(R() * 40 - 110)} ${r1(x + ox)} ${r1(y + oy)})"/>`;
    }
    T.grass = await bake(512, 512, `<rect width="512" height="512" fill="#86A957"/>${texture(0, 0, 512, 512, 'mottle', 0.55)}<g filter="url(#k-dab)" opacity="0.55">${dabs}</g>${texture(0, 0, 512, 512, 'mottle-light', 0.35)}${texture(0, 0, 512, 512, 'grain', 0.16)}`);
  }
  // road: 512 px across 4.5 m, 1024 px along 9 m; worn verge edges, faded cream centre dashes
  {
    const R = rng(9); let cracks = '';
    for (let i = 0; i < 14; i++) { const x = 60 + R() * 392, y = R() * 1024, l = 20 + R() * 60; cracks += `<path d="M${r1(x)} ${r1(y)}l${r1((R() - 0.5) * l)} ${r1(l)}l${r1((R() - 0.5) * 10)} 3z" fill="#7E737E" opacity="0.5"/>`; }
    const edge = (x) => `<rect x="${x}" y="-40" width="44" height="1104" fill="#B3A386" filter="url(#k-rough)"/>`;
    T.road = await bake(512, 1024, `<rect width="512" height="1024" fill="#978A90"/>${texture(0, 0, 512, 1024, 'mottle', 0.5)}${texture(0, 0, 512, 1024, 'brush-v', 0.35)}`
      + `<g filter="url(#k-soft)" opacity="0.5"><rect x="0" y="0" width="70" height="1024" fill="#A59783"/><rect x="442" y="0" width="70" height="1024" fill="#A59783"/></g>`
      + `${edge(-24)}${edge(492)}${cracks}`
      + `<g filter="url(#k-rough)" opacity="0.8"><rect x="249" y="40" width="14" height="300" fill="#EADCBE"/><rect x="249" y="552" width="14" height="300" fill="#EADCBE"/></g>`
      + `${texture(0, 0, 512, 1024, 'mottle-light', 0.3)}${texture(0, 0, 512, 1024, 'grain', 0.16)}`);
  }
  // packed-earth pad at the stop (alpha, wobbled edge)
  T.dirt = await bake(512, 512, `<clipPath id="dc"><ellipse cx="256" cy="256" rx="236" ry="226"/></clipPath><g filter="url(#k-wobble)"><g clip-path="url(#dc)"><rect width="512" height="512" fill="#B5A890"/>${texture(0, 0, 512, 512, 'mottle', 0.45)}${texture(0, 0, 512, 512, 'brush', 0.25)}${texture(0, 0, 512, 512, 'grain', 0.18)}</g></g>`, { alpha: true, clamp: true });
  // shelter planks, 512 px = 1 m; plank seams are value shapes (darker wood), never lines of ink
  {
    let planks = ''; const R = rng(3);
    for (let i = 0; i < 4; i++) {
      planks += `<rect x="${i * 128}" y="0" width="128" height="512" fill="${mix('#A9764C', ['#B78456', '#9E6C45', '#AD7A4F', '#A27049'][i], 0.8)}"/>`;
      planks += `<rect x="${i * 128 - 2}" y="-10" width="5" height="532" fill="#7E5A3E" filter="url(#k-rough)" opacity="0.9"/>`;
      for (let k = 0; k < 2; k++) { const y = R() * 480, x = i * 128 + 30 + R() * 60; planks += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="7" ry="11" fill="#8C6242" opacity="0.6" filter="url(#k-rough)"/>`; }
    }
    T.wood = await bake(512, 512, `${planks}${vgrad(0, 0, 512, 512, 'rgba(255,240,215,0.18)', 'rgba(255,240,215,0)')}${texture(0, 0, 512, 512, 'brush-v', 0.4)}${texture(0, 0, 512, 512, 'mottle', 0.3)}${texture(0, 0, 512, 512, 'mottle-light', 0.3)}${texture(0, 0, 512, 512, 'grain', 0.16)}`);
    T.woodFoot = await bake(512, 512, `${planks}${vgrad(0, 0, 512, 512, 'rgba(255,240,215,0.15)', 'rgba(255,240,215,0)')}${texture(0, 0, 512, 512, 'brush-v', 0.4)}${texture(0, 0, 512, 512, 'mottle', 0.3)}`
      + `<rect x="-20" y="420" width="552" height="120" fill="#8A6F7E" opacity="0.45" filter="url(#k-soft)" style="mix-blend-mode:multiply"/>${texture(0, 0, 512, 512, 'grain', 0.16)}`);
  }
  // corrugated roof, painted slate-blue tin with soft rust
  {
    let rib = ''; for (let i = 0; i < 16; i++) rib += `<rect x="${i * 32}" y="0" width="12" height="512" fill="#8296A8" opacity="0.7"/><rect x="${i * 32 + 22}" y="0" width="7" height="512" fill="#5E7086" opacity="0.6"/>`;
    T.roof = await bake(512, 512, `<rect width="512" height="512" fill="#6F8296"/><g filter="url(#k-rough)">${rib}</g><ellipse cx="380" cy="470" rx="90" ry="40" fill="#B0704A" opacity="0.45" filter="url(#k-soft2)" style="mix-blend-mode:multiply"/>${texture(0, 0, 512, 512, 'mottle', 0.35)}${texture(0, 0, 512, 512, 'grain', 0.16)}`);
  }
  // bus-stop sign: invented scribble glyph (no real language)
  T.sign = await bake(256, 256, `<g filter="url(#k-rough)"><circle cx="128" cy="128" r="118" fill="#3F7FC0"/><circle cx="128" cy="128" r="94" fill="#F6EDD6"/>`
    + `<rect x="74" y="92" width="108" height="62" rx="16" fill="#3F7FC0"/><rect x="86" y="102" width="26" height="20" rx="4" fill="#F6EDD6"/><rect x="118" y="102" width="26" height="20" rx="4" fill="#F6EDD6"/><rect x="150" y="102" width="20" height="20" rx="4" fill="#F6EDD6"/>`
    + `<circle cx="98" cy="158" r="11" fill="#3F7FC0"/><circle cx="158" cy="158" r="11" fill="#3F7FC0"/><path d="M92 186q18 -10 36 0t36 0" stroke="#3F7FC0" stroke-width="7" fill="none"/></g>${texture(0, 0, 256, 256, 'grain', 0.2)}`, { alpha: true, clamp: true });
  // foliage atlas 4x2: canopy clumps 0-3, hedge clumps 4-5, grass tufts 6-7
  {
    let s = '';
    for (let i = 0; i < 4; i++) s += foliage({ x: 128 + i * 256, y: 132, w: 210, h: 180, seed: 3 + i * 7 });
    const hedge = { dark: '#2C5E45', mid: '#4D8A48', light: '#77AE52', hi: '#B5D778' };
    s += foliage({ x: 128, y: 384, w: 220, h: 170, seed: 41, tones: hedge, density: 1.3 });
    s += foliage({ x: 384, y: 384, w: 220, h: 170, seed: 53, tones: hedge, density: 1.3 });
    s += tufts(640, 500, 190, 150, 2) + tufts(896, 500, 190, 120, 5);
    T.foliage = await bake(1024, 512, s, { alpha: true, clamp: true });
  }
  // backdrop strips (wrap 360 degrees: integer sine cycles)
  const ridge = (w, h, base, amps, seed) => { const R = rng(seed), ph = amps.map(() => R() * 6.28); let d = `M${-0.15 * w} ${h}`;
    for (let x = -0.15 * w; x <= 1.15 * w; x += 16) { let y = base; amps.forEach((a, i) => { y -= a[1] * Math.sin((x / w) * a[0] * 6.2832 + ph[i]); }); d += `L${x} ${r1(y)}`; }
    return d + `L${1.15 * w} ${h}Z`; };
  {
    const W = 4096, H = 512; let trees = ''; const R = rng(77);
    for (let i = 0; i < 70; i++) { const x0 = R() * W, y = 300 + R() * 40, w = 26 + R() * 30, h = 22 + R() * 20; for (const x of [x0 - W, x0, x0 + W]) trees += foliage({ x, y, w, h, seed: i + 5, far: true, tones: { dark: '#3F7650', mid: '#5E9450', light: '#7FAE5C' } }); }
    const near = ridge(W, H, 250, [[3, 60], [7, 34], [13, 14]], 4), fields = ridge(W, H, 330, [[5, 30], [11, 16]], 8);
    const id = uid('hc');
    T.hillsNear = await bake(W, H, `<clipPath id="${id}"><path d="${near}"/></clipPath><g filter="url(#k-wobble)"><path d="${near}" fill="#6E9F58"/></g>`
      + `<g clip-path="url(#${id})">${vgrad(0, 120, W, 392, '#86B565', '#5D8E4E')}<path d="${fields}" fill="#7FA95E" opacity="0.7" filter="url(#k-wobble)"/>${trees}${texture(0, 0, W, H, 'brush', 0.25)}${texture(0, 0, W, H, 'grain', 0.12)}</g>`, { alpha: true });
    const far = ridge(W, H, 230, [[2, 90], [5, 40], [9, 18]], 12), far2 = ridge(W, H, 320, [[4, 40], [9, 20]], 19);
    T.hillsFar = await bake(W, H, `<g filter="url(#k-wobble)"><path d="${far}" fill="#8C92C2"/><path d="${far2}" fill="#7E8BB8"/></g>${texture(0, 0, W, H, 'brush', 0.15)}`, { alpha: true });
  }
  {
    const W = 4096, H = 1024; let s = ''; const R = rng(31);
    for (let i = 0; i < 7; i++) { const c = { x: 280 + i * 560 + R() * 160, y: 900 - R() * 120, w: 240 + R() * 200, h: 200 + R() * 260, seed: i + 2 }; for (const dx of [-W, 0, W]) s += cloud({ ...c, x: c.x + dx }); }
    T.clouds = await bake(W, H, s, { alpha: true });
  }
  return T;
}

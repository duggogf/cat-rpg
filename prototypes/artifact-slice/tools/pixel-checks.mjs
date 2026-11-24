// PROTOTYPE - NOT FOR PRODUCTION
// Pixel-check helpers for the M0 harness (plan §5.2). They measure; the runner compares the
// measurements with the plan's thresholds and prints both, so a reader sees the number.
import { PNG } from 'pngjs';

export const readPNG = (buf) => PNG.sync.read(buf);
export const writePNG = (img) => PNG.sync.write(img);
export function blank(w, h, rgb = [255, 246, 227]) {
  const p = new PNG({ width: w, height: h }); for (let i = 0; i < w * h; i++) { p.data[i * 4] = rgb[0]; p.data[i * 4 + 1] = rgb[1]; p.data[i * 4 + 2] = rgb[2]; p.data[i * 4 + 3] = 255; } return p;
}
/** Box-downscale by an integer factor. */
export function shrink(img, k) {
  const w = Math.floor(img.width / k), h = Math.floor(img.height / k), o = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 4; c++) {
    let s = 0; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) s += img.data[((y * k + j) * img.width + x * k + i) * 4 + c];
    o.data[(y * w + x) * 4 + c] = Math.round(s / (k * k));
  }
  return o;
}
export function blit(dst, src, dx, dy) {
  for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) {
    const X = dx + x, Y = dy + y; if (X < 0 || Y < 0 || X >= dst.width || Y >= dst.height) continue;
    for (let c = 0; c < 4; c++) dst.data[(Y * dst.width + X) * 4 + c] = src.data[(y * src.width + x) * 4 + c];
  }
}

/* ------------------------------------------------------------ colour */
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
export function lab(r, g, b) {
  const R = lin(r), G = lin(g), B = lin(b);
  let X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, Y = R * 0.2126 + G * 0.7152 + B * 0.0722, Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t) => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
  X = f(X); Y = f(Y); Z = f(Z);
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
}
export function dE2000(a, b) {
  const [L1, a1, b1] = a, [L2, a2, b2] = b, rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cm, 7) / (Math.pow(Cm, 7) + Math.pow(25, 7))));
  const a1p = a1 * (1 + G), a2p = a2 * (1 + G), C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h = (x, y) => { if (x === 0 && y === 0) return 0; const t = Math.atan2(y, x) / rad; return t < 0 ? t + 360 : t; };
  const h1p = h(a1p, b1), h2p = h(a2p, b2);
  const dLp = L2 - L1, dCp = C2p - C1p;
  let dhp = 0; if (C1p * C2p !== 0) { dhp = h2p - h1p; if (dhp > 180) dhp -= 360; else if (dhp < -180) dhp += 360; }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * rad / 2);
  const Lpm = (L1 + L2) / 2, Cpm = (C1p + C2p) / 2;
  let hpm = h1p + h2p; if (C1p * C2p !== 0) { if (Math.abs(h1p - h2p) > 180) hpm += (h1p + h2p < 360 ? 360 : -360); hpm /= 2; }
  const T = 1 - 0.17 * Math.cos((hpm - 30) * rad) + 0.24 * Math.cos(2 * hpm * rad) + 0.32 * Math.cos((3 * hpm + 6) * rad) - 0.2 * Math.cos((4 * hpm - 63) * rad);
  const dTh = 30 * Math.exp(-Math.pow((hpm - 275) / 25, 2)), Rc = 2 * Math.sqrt(Math.pow(Cpm, 7) / (Math.pow(Cpm, 7) + Math.pow(25, 7)));
  const Sl = 1 + 0.015 * Math.pow(Lpm - 50, 2) / Math.sqrt(20 + Math.pow(Lpm - 50, 2)), Sc = 1 + 0.045 * Cpm, Sh = 1 + 0.015 * Cpm * T, Rt = -Math.sin(2 * dTh * rad) * Rc;
  return Math.sqrt(Math.pow(dLp / Sl, 2) + Math.pow(dCp / Sc, 2) + Math.pow(dHp / Sh, 2) + Rt * (dCp / Sc) * (dHp / Sh));
}
const px = (img, x, y) => { const i = (y * img.width + x) * 4; return [img.data[i], img.data[i + 1], img.data[i + 2]]; };
export function Lstar(img) { const o = new Float32Array(img.width * img.height); for (let i = 0; i < o.length; i++) o[i] = lab(img.data[i * 4], img.data[i * 4 + 1], img.data[i * 4 + 2])[0]; return o; }
export function maskOf(img, thr = 128) { const o = new Uint8Array(img.width * img.height); for (let i = 0; i < o.length; i++) o[i] = img.data[i * 4] > thr ? 1 : 0; return o; }
function dilate(m, w, h, r) {
  let a = m; for (let k = 0; k < r; k++) { const o = new Uint8Array(a); for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; if (!a[i] && (a[i - 1] || a[i + 1] || a[i - w] || a[i + w])) o[i] = 1; } a = o; } return a;
}
function erode(m, w, h, r) { const inv = m.map((v) => 1 - v); return dilate(inv, w, h, r).map((v) => 1 - v); }
function blur(f, w, h, sigma) {
  const r = Math.ceil(sigma * 3), k = []; let s = 0; for (let i = -r; i <= r; i++) { const v = Math.exp(-i * i / (2 * sigma * sigma)); k.push(v); s += v; } k.forEach((v, i) => { k[i] = v / s; });
  const t = new Float32Array(f.length), o = new Float32Array(f.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let a = 0; for (let i = -r; i <= r; i++) a += f[y * w + Math.min(w - 1, Math.max(0, x + i))] * k[i + r]; t[y * w + x] = a; }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let a = 0; for (let i = -r; i <= r; i++) a += t[Math.min(h - 1, Math.max(0, y + i)) * w + x] * k[i + r]; o[y * w + x] = a; }
  return o;
}
const median = (a) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pct = (a, p) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };

/**
 * Silhouette line width (L-3) and ink colour (L-2) around a character mask.
 * From each mask-edge pixel, walk outward along the mask normal in 0.5 px steps and sum line
 * coverage = (L_bg − L) / (L_bg − L_ink), with L_bg sampled 7 px out. Width = covered length.
 */
export function lineCheck(img, maskImg, inkHex = '#33273B') {
  const w = img.width, h = img.height, m = maskOf(maskImg), L = Lstar(img);
  const n = parseInt(inkHex.slice(1), 16), inkLab = lab((n >> 16) & 255, (n >> 8) & 255, n & 255), Lk = inkLab[0];
  const mb = blur(Float32Array.from(m), w, h, 1.5);
  const S = (f, x, y) => { const xi = Math.floor(x), yi = Math.floor(y); if (xi < 0 || yi < 0 || xi >= w - 1 || yi >= h - 1) return NaN; const u = x - xi, v = y - yi; return f[yi * w + xi] * (1 - u) * (1 - v) + f[yi * w + xi + 1] * u * (1 - v) + f[(yi + 1) * w + xi] * (1 - u) * v + f[(yi + 1) * w + xi + 1] * u * v; };
  const widths = [], cores = [];
  for (let y = 8; y < h - 8; y += 1) for (let x = 8; x < w - 8; x += 1) {
    const i = y * w + x; if (!m[i] || (m[i - 1] && m[i + 1] && m[i - w] && m[i + w])) continue;
    if ((x * 7 + y * 13) % 3) continue; // subsample edge pixels
    let gx = mb[i + 1] - mb[i - 1], gy = mb[i + w] - mb[i - w]; const gl = Math.hypot(gx, gy); if (gl < 1e-3) continue; gx /= -gl; gy /= -gl; // outward
    const Lbg = S(L, x + gx * 7, y + gy * 7); if (!(Lbg - Lk > 25)) continue; // need contrast to measure
    if (S(mb, x + gx * 7, y + gy * 7) > 0.01) continue; // background must be clear of the cat
    let cov = 0, core = null;
    for (let t = 0; t <= 5; t += 0.5) {
      const c = Math.max(0, Math.min(1, (Lbg - S(L, x + gx * t, y + gy * t)) / (Lbg - Lk))); cov += c * 0.5;
      if (c > 0.92 && !core) core = [Math.round(x + gx * t), Math.round(y + gy * t)];
    }
    widths.push(cov);
    if (core) { const p = px(img, core[0], core[1]); cores.push(dE2000(lab(...p), inkLab)); }
  }
  return { samples: widths.length, widthMedian: +median(widths).toFixed(2), widthP10: +pct(widths, 0.1).toFixed(2), widthP90: +pct(widths, 0.9).toFixed(2), inkSamples: cores.length, inkDEMedian: +median(cores).toFixed(2), inkDEP90: +pct(cores, 0.9).toFixed(2) };
}

/** E-5: greyscale (L*), Gaussian σ = 4 px, cat mean L* vs a ring of surrounding ground. */
export function separation(img, maskImg) {
  const w = img.width, h = img.height, m = maskOf(maskImg), L = blur(Lstar(img), w, h, 4);
  const inner = erode(m, w, h, 3), outer = dilate(m, w, h, 24), near = dilate(m, w, h, 6);
  let a = 0, na = 0, b = 0, nb = 0;
  for (let i = 0; i < m.length; i++) { if (inner[i]) { a += L[i]; na++; } else if (outer[i] && !near[i]) { b += L[i]; nb++; } }
  const cat = a / na, ring = b / nb;
  return { catL: +cat.toFixed(1), ringL: +ring.toFixed(1), diff: +Math.abs(cat - ring).toFixed(1), catPx: na };
}

/**
 * No neutral-grey shadows (E-1): in pixels the shade mask marks as shaded (R high, G = B = 0),
 * the shading factor actual / albedo must be a colour, not a grey. Neutral = channel spread < 6%.
 */
export function shadowTint(actual, shade, albedo, shadowHex = '#6E6AA8') {
  const sn = parseInt(shadowHex.slice(1), 16), SH = [(sn >> 16) & 255, (sn >> 8) & 255, sn & 255].map((v) => v / 255), shm = (SH[0] + SH[1] + SH[2]) / 3, sdev = SH.map((v) => v - shm);
  const n = actual.width * actual.height; let cnt = 0, neutral = 0, hazed = 0; const sum = [0, 0, 0], dEs = [];
  for (let i = 0; i < n; i++) {
    const s = shade.data[i * 4], g = shade.data[i * 4 + 1], b = shade.data[i * 4 + 2];
    if (s < 200 || g > 6 || b > 6) continue;
    const A = [albedo.data[i * 4], albedo.data[i * 4 + 1], albedo.data[i * 4 + 2]]; if (Math.min(...A) < 25) continue;
    const X = [actual.data[i * 4], actual.data[i * 4 + 1], actual.data[i * 4 + 2]];
    const r = X.map((v, k) => v / A[k]), mean = (r[0] + r[1] + r[2]) / 3;
    if (mean > 0.93) { hazed++; continue; }
    cnt++; sum[0] += r[0]; sum[1] += r[1]; sum[2] += r[2];
    if ((Math.max(...r) - Math.min(...r)) / mean < 0.06) neutral++;
    const la = lab(...X); dEs.push(Math.hypot(la[1], la[2]));
  }
  const mt = sum.map((v) => v / Math.max(1, cnt)), mm = (mt[0] + mt[1] + mt[2]) / 3, dev = mt.map((v) => v - mm);
  const cos = (dev[0] * sdev[0] + dev[1] * sdev[1] + dev[2] * sdev[2]) / (Math.hypot(...dev) * Math.hypot(...sdev) || 1);
  return { shadedPx: cnt, skippedHazed: hazed, neutralPct: +(100 * neutral / Math.max(1, cnt)).toFixed(2), meanTint: mt.map((v) => +v.toFixed(3)), hueCos: +cos.toFixed(2), chromaMedian: +median(dEs).toFixed(1) };
}

/**
 * E-5 for inked figures (art bible, rewritten 2026-11-24): the ink line carries separation.
 *  (1) ink line vs a ring of surrounding ground ≥ 35 L*; (2) ≥ 90% of silhouette samples have a line ≥ 1.5 px;
 *  (3) a contact blob under every grounded cat.
 * Samples that cannot carry a line are classified and excluded, never silently dropped:
 *  - occluded: the cat continues behind environment there (maskTop, drawn over everything, extends past the edge);
 *  - hole: the ray re-enters the cat within 16 px (a gap inside the figure, e.g. between body and tail);
 *  - contact: a downward edge resting on the contact blob (excluded only where the blob covers it).
 * The walk starts 3 px inside the mask (inward pixels count only if ink-dark) because the fill mask can be a
 * pixel or two larger than the drawn figure at ear tips.
 */
export function e5Ink(img, maskImg, topImg, blobImg, inkHex = '#33273B') {
  const w = img.width, h = img.height, m = maskOf(maskImg), top = maskOf(topImg), bl = maskOf(blobImg, 60), L = Lstar(img);
  const n = parseInt(inkHex.slice(1), 16), Lk = lab((n >> 16) & 255, (n >> 8) & 255, n & 255)[0];
  const at = (f, x, y) => { const xi = Math.round(x), yi = Math.round(y); return xi < 0 || yi < 0 || xi >= w || yi >= h ? 0 : f[yi * w + xi]; };
  const widths = [], cores = [], ex = { occluded: 0, hole: 0, contact: 0 }; let gaps = [];
  for (let y = 8; y < h - 8; y++) for (let x = 8; x < w - 8; x++) {
    const i = y * w + x; if (!m[i] || (m[i - 1] && m[i + 1] && m[i - w] && m[i + w])) continue;
    if ((x * 7 + y * 13) % 3) continue;
    let gx = 0, gy = 0; for (let j = -2; j <= 2; j++) for (let k = -2; k <= 2; k++) { gx += m[i + j * w + k] * k; gy += m[i + j * w + k] * j; }
    const gl = Math.hypot(gx, gy); if (gl < 1e-3) continue; gx /= -gl; gy /= -gl;
    if (at(top, x + gx * 3, y + gy * 3) && !at(m, x + gx * 3, y + gy * 3)) { ex.occluded++; continue; }
    let reenter = false; for (let t = 5; t <= 16; t++) if (at(m, x + gx * t, y + gy * t)) { reenter = true; break; }
    if (reenter) { ex.hole++; continue; }
    const Lbg = at(L, x + gx * 8, y + gy * 8);
    let cov = 0, core = null;
    for (let t = -3; t <= 5; t += 0.5) {
      const l = at(L, x + gx * t, y + gy * t);
      const c = t < 0 ? (l < Lk + 15 ? 1 : 0) : Math.max(0, Math.min(1, (Lbg - l) / Math.max(1, Lbg - Lk)));
      cov += c * 0.5; if (c > 0.92 && !core) core = l;
    }
    if (cov < 1.5 && gy > 0.6 && at(bl, x + gx * 4, y + gy * 4)) { ex.contact++; continue; }
    widths.push(cov); if (core != null) cores.push(core);
    if (cov < 1.5) gaps.push([x, y]);
  }
  // ring of ground around the figure (outside the over-everything mask), un-blurred
  const outer = dilate(top, w, h, 24), near = dilate(top, w, h, 6); let rs = 0, rn = 0;
  for (let i = 0; i < m.length; i++) if (outer[i] && !near[i]) { rs += L[i]; rn++; }
  const ringL = rs / rn, lineL = median(cores);
  // contact blobs: one per grounded figure (connected components of the over-everything mask)
  const lab2 = new Int32Array(w * h).fill(-1), comps = [];
  for (let s = 0; s < w * h; s++) if (top[s] && lab2[s] < 0) {
    const st = [s], c = { n: 0, x0: w, x1: 0, y0: h, y1: 0 }; lab2[s] = comps.length;
    while (st.length) { const q = st.pop(), qx = q % w, qy = (q / w) | 0; c.n++; c.x0 = Math.min(c.x0, qx); c.x1 = Math.max(c.x1, qx); c.y0 = Math.min(c.y0, qy); c.y1 = Math.max(c.y1, qy);
      for (const r of [q - 1, q + 1, q - w, q + w]) if (r >= 0 && r < w * h && top[r] && lab2[r] < 0) { lab2[r] = comps.length; st.push(r); } }
    comps.push(c);
  }
  const figs = comps.filter((c) => c.n > 400).map((c) => {
    let b = 0; const yA = Math.round(c.y0 + (c.y1 - c.y0) * 0.6), yB = Math.min(h - 1, c.y1 + Math.round((c.y1 - c.y0) * 0.25) + 6);
    for (let y = yA; y <= yB; y++) for (let x = Math.max(0, c.x0 - 10); x <= Math.min(w - 1, c.x1 + 10); x++) if (bl[y * w + x]) b++;
    return { box: [c.x0, c.y0, c.x1, c.y1], px: c.n, blobPx: b, blob: b >= 30 };
  });
  const ge = widths.filter((v) => v >= 1.5).length;
  return { samples: widths.length, fracGe15: +(ge / Math.max(1, widths.length)).toFixed(3), widthMedian: +median(widths).toFixed(2), widthP10: +pct(widths, 0.1).toFixed(2),
    lineL: +lineL.toFixed(1), ringL: +ringL.toFixed(1), diff: +(ringL - lineL).toFixed(1), excluded: ex, gaps: gaps.length, figures: figs };
}

/** Median L* of lit, non-figure pixels in a region (lit = the shade mask's red channel low). */
export function litGround(img, shade, catMask, [x0, y0, x1, y1]) {
  const v = []; const m = maskOf(catMask);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = y * img.width + x; if (m[i] || shade.data[i * 4] > 40 || shade.data[i * 4 + 1] > 6) continue; v.push(lab(img.data[i * 4], img.data[i * 4 + 1], img.data[i * 4 + 2])[0]); }
  return { px: v.length, Lmedian: +median(v).toFixed(1), Lp25: +pct(v, 0.25).toFixed(1) };
}

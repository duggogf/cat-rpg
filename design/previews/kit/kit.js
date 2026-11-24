/* Cat RPG — preview art kit (static mock screenshots only; not game code).
 * Plain functions returning SVG strings. Load with <script src="kit/kit.js"></script>
 * and use the global `Kit`, or require() it from Node.
 * Rule of the look (art bible §1.1): INK WHAT ACTS, PAINT WHAT STAYS.
 *   - cats, humans, interactive props, VFX  -> flat two-tone cel + even Aubergine Ink line
 *   - walls, foliage, sky, ground            -> unlined, layered paint through SVG filters
 */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------------ palette */
  const C = {
    ink: '#33273B', cream: '#FFF6E3', cocoa: '#6B4A35', ginger: '#F28C28', crimson: '#D02A45',
    gold: '#F2B01E', haru: '#FFD23F', wisteria: '#6E6AA8', sky: '#3F9BE6', green: '#5A9E4B',
    sage: '#A8C878', magenta: '#FF3D8B', reverseInk: '#8C82A8',
    // lane swatches
    plaster: '#F3E3C3', lane: '#B9AC93', hydrangea: '#7E8FD8', roof: '#6F8296', wood: '#C28A52',
    laundry: '#FFFDF4', lamp: '#FFD98A', skyHorizon: '#A9DBF5', cloudShade: '#C9D8F0',
    // semantic
    nerve: '#5CC46B', pad: '#F6809A', staticYellow: '#FFE14A', claw: '#39C6F0', clawCore: '#EAFBFF',
    yowl: '#B9A0FF', purr: '#FFB3C1', fish: '#9CC7E0', recessed: '#F4E6C8', whiteShade: '#D8D2EA',
  };
  /** The ten generator coat fills + Mikan's reserved ginger. */
  const COATS = {
    white: '#FFF8EC', cream: '#F4DDAA', silver: '#CDD1DC', grey: '#8E93A8', charcoal: '#514D60',
    black: '#37323F', marmalade: '#C98A4A', chocolate: '#7C5438', fawn: '#E3C39A', seal: '#5E4636',
    ginger: C.ginger,
  };
  const EYES = { amber: '#FFB52E', green: '#7CC25A', yellowgreen: '#C9D64A', blue: '#5BB4F0', copper: '#D9772E' };

  /* ------------------------------------------------------------------ utils */
  let _uid = 0;
  const uid = (p) => `${p || 'k'}${++_uid}`;
  const r1 = (n) => Math.round(n * 10) / 10;
  function rng(seed) {
    let a = (seed | 0) + 0x6D2B79F5;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hexToRgb(h) { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); }
  function rgbToHex(r, g, b) { return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  /** Linear mix of two hex colours. */
  function mix(a, b, t) { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
  /** Authored-style cel shade of a colour: multiply by lavender (whites go to #D8D2EA, never grey). */
  function shade(hex, k) { const A = hexToRgb(hex), S = hexToRgb(C.whiteShade); k = k == null ? 1 : k; return rgbToHex(...A.map((v, i) => v * (1 - k + k * S[i] / 255) * (1 - 0.04 * k))); }

  /** Smooth closed/open path through points (Catmull-Rom). A point [x,y,1] is a soft corner. */
  function blob(pts, closed, tension) {
    closed = closed !== false; tension = tension == null ? 1 : tension;
    const n = pts.length; if (n < 2) return '';
    const P = (i) => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const k1 = p1[2] ? 0.22 : 1, k2 = p2[2] ? 0.22 : 1;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6 * tension * k1, p1[1] + (p2[1] - p0[1]) / 6 * tension * k1];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6 * tension * k2, p2[1] - (p3[1] - p1[1]) / 6 * tension * k2];
      d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  }
  function sampleCR(pts, per) {
    const out = []; const n = pts.length; per = per || 8;
    const P = (i) => pts[Math.max(0, Math.min(n - 1, i))];
    for (let i = 0; i < n - 1; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      for (let s = 0; s < per; s++) {
        const t = s / per, t2 = t * t, t3 = t2 * t;
        const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1]), (i + t) / (n - 1)]);
      }
    }
    out.push([pts[n - 1][0], pts[n - 1][1], 1]);
    return out;
  }
  /** A tapered tube (tail, leg, ribbon) along a centre line. widths: array (per control point) or fn(t).
   *  opts.zig > 0 makes a bottle-brush (puffed) edge. Returns a path `d`. */
  function tube(pts, widths, opts) {
    opts = opts || {};
    const S = sampleCR(pts, opts.per || 8);
    const wAt = (t) => {
      if (typeof widths === 'function') return widths(t);
      if (typeof widths === 'number') return widths;
      const x = t * (widths.length - 1), i = Math.min(widths.length - 2, Math.floor(x)), f = x - i;
      return widths[i] + (widths[i + 1] - widths[i]) * f;
    };
    const L = [], R = [];
    for (let i = 0; i < S.length; i++) {
      const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
      let w = wAt(S[i][2]) / 2;
      if (opts.zig && i > 0) w += (i % 2 ? opts.zig : -opts.zig * 0.15);
      L.push([S[i][0] - dy * w, S[i][1] + dx * w, opts.zig ? 1 : 0]);
      R.push([S[i][0] + dy * w, S[i][1] - dx * w, opts.zig ? 1 : 0]);
    }
    const cap = (i, i2, flipDir) => {
      const p = S[i], q = S[i2]; let dx = p[0] - q[0], dy = p[1] - q[1]; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
      const w = wAt(p[2]) / 2 * (opts.capRound == null ? 0.85 : opts.capRound);
      return [p[0] + dx * w, p[1] + dy * w];
    };
    const endCap = cap(S.length - 1, S.length - 2), startCap = cap(0, 1);
    const poly = [startCap, ...L, endCap, ...R.reverse()];
    return blob(poly, true);
  }
  /** Transform a point list: scale (sx, sy), rotate (deg), translate. */
  function xf(pts, o) {
    const r = (o.r || 0) * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), sx = o.sx == null ? (o.s || 1) : o.sx, sy = o.sy == null ? (o.s || 1) : o.sy;
    return pts.map((p) => { const x = p[0] * sx, y = p[1] * sy; const q = [x * c - y * s + (o.x || 0), x * s + y * c + (o.y || 0)]; if (p[2]) q.push(p[2]); return q; });
  }
  const ell = (cx, cy, rx, ry, rot) => {
    const pts = []; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; pts.push([Math.cos(a) * rx, Math.sin(a) * ry]); }
    return blob(xf(pts, { r: rot || 0, x: cx, y: cy }));
  };
  const mirror = (pts) => pts.map((p) => { const q = [-p[0], p[1]]; if (p[2]) q.push(p[2]); return q; }).reverse();
  /** Scalloped pom (Mikan's tail, dust puffs). */
  function pomPts(cx, cy, r, bumps, depth, rot) {
    const pts = []; bumps = bumps || 7; depth = depth == null ? 0.14 : depth;
    for (let i = 0; i < bumps * 2; i++) { const a = (i / (bumps * 2)) * Math.PI * 2 + (rot || 0); const rr = r * (i % 2 ? 1 - depth : 1.04); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    return pts;
  }

  /* ------------------------------------------------------------------ outline engine */
  const OUTLINES = {
    ink: { ink: C.ink }, reverse: { ink: C.reverseInk },
    gold: { ink: C.ink, key: C.gold, rim: C.cream }, sage: { ink: C.ink, key: C.sage, rim: C.cream, keyW: 2.5 },
    stray: { ink: C.ink, rim: C.cream }, magenta: { ink: C.magenta, rim: C.cream },
  };
  /** Draw one silhouette group: uniform outer line (inverted-hull look), flat fills, clipped overlays, shade. */
  function celGroup(g, o) {
    const lw = o.lw, ol = o.ol, id = uid('c');
    const ds = g.parts.map((p) => p.d);
    const all = ds.join(' ');
    const st = (w, col) => `<path d="${all}" fill="none" stroke="${col}" stroke-width="${r1(w * 2)}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
    let s = '';
    const keyW = ol.key ? (ol.keyW || 2) : 0, rimW = ol.rim ? 1.2 : 0;
    if (ol.rim) s += st(lw + keyW + rimW, ol.rim);
    if (ol.key) s += st(lw + keyW, ol.key);
    s += st(lw, ol.ink);
    s += g.parts.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`).join('');
    const inner = (g.overlays || []).map((v) => `<path d="${v.d}" fill="${v.fill}"${v.op ? ` opacity="${v.op}"` : ''}/>`).join('')
      + (g.shade ? `<path d="${g.shade}" fill="${C.whiteShade}" style="mix-blend-mode:multiply"/>` : '')
      + (g.shadeAll ? `<path d="${all}" fill="${C.whiteShade}" style="mix-blend-mode:multiply"/>` : '');
    if (inner) s += `<clipPath id="${id}"><path d="${all}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
    if (g.lines) s += g.lines.map((d) => `<path d="${d}" fill="none" stroke="${ol.ink}" stroke-width="${r1(Math.max(1.25, lw * 0.6))}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join('');
    if (g.extra) s += g.extra;
    return s;
  }
  const inkLine = (d, w, col) => `<path d="${d}" fill="none" stroke="${col || C.ink}" stroke-width="${w || 1.5}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
  const inked = (d, fill, w, col) => `<path d="${d}" fill="${fill}" stroke="${col || C.ink}" stroke-width="${w || 2.5}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;

  /* ------------------------------------------------------------------ cat parts */
  const BUILD = { round: { bx: 1.2, by: 1.1, leg: 0.86, head: 1.06 }, standard: { bx: 1, by: 1, leg: 1, head: 1 }, long: { bx: 0.86, by: 0.93, leg: 1.2, head: 0.92 } };

  /** Tail centre line + widths for a tail type and carriage, from a base point, `dir` = +1 tail to the right. */
  function tailShape(type, carry, bx, by, dir, view) {
    // carriage curves are authored for a tail leaving the rump to the LEFT (dir=-1 flips), y up = negative
    const K = {
      flag:   [[0, 0], [-8, -22], [-9, -50], [-5, -74], [8, -84]],
      post:   [[0, 0], [-6, -24], [-7, -52], [-7, -80]],
      spring: [[0, 0], [-12, -20], [-10, -46], [-22, -62], [-34, -52], [-30, -40]],
      blade:  [[0, 0], [-22, -6], [-46, -4], [-68, -8]],
      anchor: [[0, 0], [-14, 8], [-22, 28], [-34, 38], [-48, 36]],
      comma:  [[0, 0], [-12, 6], [-14, 22], [-4, 32], [8, 30]],
      level:  [[0, 0], [-20, -8], [-42, -4], [-60, -16]],
      wrap:   [[0, 0], [-10, 14], [4, 26], [30, 30], [52, 26]],
    };
    let pts = (K[carry] || K.level).map((p) => [p[0], p[1]]);
    if (view === 'back') { // seen from behind: sideways spread is foreshortened, tail rises in front of the rump
      pts = pts.map((p) => [p[0] * (carry === 'blade' ? 0.9 : 0.55), p[1] * (p[1] > 0 ? 0.6 : 1)]);
    }
    let w, zig = 0, len = 1;
    if (type === 'plume') { w = [9, 17, 21, 19, 10]; }
    else if (type === 'ringed') { w = [13, 14, 14, 13, 11]; }
    else if (type === 'stub') { len = 0.34; w = [13, 13, 11]; }
    else if (type === 'pom') { len = 0.2; w = [10, 10]; }
    else { w = [9, 8, 7, 6, 4.5]; } // whip
    if (len < 1) { // shorten: keep the first part of the curve
      const S = sampleCR(pts, 6); const keep = Math.max(2, Math.round(S.length * len)); pts = [S[0], S[Math.floor(keep / 2)], S[keep]].map((p) => [p[0], p[1]]);
    }
    return { pts, w, zig };
  }
  function tailParts(o, bx, by, dir, view) {
    const T = tailShape(o.tail, o.carry, 0, 0, dir, view);
    let pts = T.pts.map((p) => [bx + p[0] * (dir < 0 ? 1 : -1), by + p[1]]);
    const sc = o.scars || [];
    if (sc.includes('kink') && pts.length >= 3) { // one lightning bend
      const m = Math.floor(pts.length / 2); const a = pts[m - 1], b = pts[m];
      pts.splice(m, 0, [b[0] + (b[1] - a[1]) * 0.45, b[1] - (b[0] - a[0]) * 0.45, 1]);
    }
    const puff = sc.includes('puff') || o._puff;
    const out = { parts: [], overlays: [], rings: [] };
    if (o.tail === 'pom') {
      const e = pts[pts.length - 1];
      out.parts.push({ d: blob(pomPts(e[0], e[1] - 2, 12.5, 7, 0.13, 0.3)) });
      out.tip = e;
    } else {
      const w = T.w.map((v) => v * (puff ? 1.45 : 1));
      out.parts.push({ d: tube(pts, w, { zig: puff ? 3.2 : 0, per: puff ? 5 : 8 }) });
      // ring bands / tip region, as fat cross-strokes clipped to the tail
      const S = sampleCR(pts, 8);
      for (let i = 3; i < S.length - 1; i += 6) {
        const a = S[i - 1], b = S[i + 1]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
        const nx = -dy / l * 16, ny = dx / l * 16, tx = dx / l * 2.6, ty = dy / l * 2.6;
        out.rings.push(`M${r1(S[i][0] + nx - tx)} ${r1(S[i][1] + ny - ty)}L${r1(S[i][0] - nx - tx)} ${r1(S[i][1] - ny - ty)}L${r1(S[i][0] - nx + tx)} ${r1(S[i][1] - ny + ty)}L${r1(S[i][0] + nx + tx)} ${r1(S[i][1] + ny + ty)}Z`);
      }
      const e = S[S.length - 1], q = S[Math.max(0, S.length - 7)];
      out.tipD = ell((e[0] + q[0]) / 2 + (e[0] - q[0]) * 0.35, (e[1] + q[1]) / 2 + (e[1] - q[1]) * 0.35, 16, 16);
      out.tip = e;
    }
    return out;
  }

  function earPts(type, side, view) {
    // left ear in a head-local frame where the head top is around y=-22 and half-width ~28; side=+1 mirrors
    let p;
    if (type === 'tall') p = [[-27, -10], [-29, -28], [-25, -46, 1], [-15, -30], [-7, -19]];
    else if (type === 'round') p = [[-27, -10], [-30, -22], [-24, -30], [-15, -27], [-9, -19]];
    else p = [[-28, -10], [-30, -24], [-26, -37, 1], [-15, -27], [-7, -19]];
    return side > 0 ? mirror(p) : p;
  }
  function applyEarScar(pts, scar, side) {
    if (scar === 'notch') { // V bite out of the top outer edge
      const tip = pts.findIndex((p) => p[2]) >= 0 ? pts.findIndex((p) => p[2]) : 2;
      const a = pts[tip], b = pts[tip + 1] || pts[tip - 1];
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const inn = [mid[0] + (side > 0 ? -5 : 5) * -1, mid[1] + 9, 1];
      const res = pts.slice(); res.splice(tip + 1, 0, [mid[0] - (b[0] - a[0]) * 0.22, mid[1] - (b[1] - a[1]) * 0.22, 1], inn, [mid[0] + (b[0] - a[0]) * 0.22, mid[1] + (b[1] - a[1]) * 0.22, 1]);
      return res;
    }
    if (scar === 'fold') { // tip folded forward: lop the top and round it
      return pts.map((p) => p[2] ? [p[0] * 0.86, p[1] * 0.66] : p);
    }
    return pts;
  }

  /* Face decals (front view), drawn in head-local coords: eyes at (+-12, 0). */
  function faceFront(o, s) {
    const eye = o.eye, e = o.expr || 'neutral', ink = C.ink; let out = '';
    const L = (d, w) => inkLine(d, w || 1.5);
    const eyeDisc = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${eye}" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><ellipse cx="${x}" cy="${y + 0.5}" rx="${rx * 0.42}" ry="${ry * 0.78}" fill="${ink}"/><circle cx="${x - rx * 0.36}" cy="${y - ry * 0.4}" r="${rx * 0.3}" fill="#fff"/>`;
    if (e === 'spiral') {
      [-12, 12].forEach((x) => { let d = ''; for (let i = 0; i <= 26; i++) { const a = i * 0.55, r = 0.6 + i * 0.26; d += (i ? 'L' : 'M') + r1(x + Math.cos(a) * r) + ' ' + r1(Math.sin(a) * r); } out += `<circle cx="${x}" cy="0" r="8" fill="#fff" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>` + L(d, 1.4); });
    } else if (e === 'happy' || e === 'purr') {
      out += L('M-18 1Q-12 -7 -6 1') + L('M6 1Q12 -7 18 1');
    } else if (e === 'sleepy' || e === 'blink') {
      out += L('M-18 0Q-12 4 -6 0') + L('M6 0Q12 4 18 0');
    } else if (e === 'shock') {
      out += `<circle cx="-12" cy="-1" r="8.5" fill="#fff" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="12" cy="-1" r="8.5" fill="#fff" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="-12" cy="-1" r="2.2" fill="${ink}"/><circle cx="12" cy="-1" r="2.2" fill="${ink}"/>`;
    } else {
      out += eyeDisc(-12, 0, 6.6, 7.4) + eyeDisc(12, 0, 6.6, 7.4);
      if (e === 'smug') out += `<path d="M-20 -8.5H-4V-2.4Q-12 -4.4 -20 -2.4Z M4 -8.5H20V-2.4Q12 -4.4 4 -2.4Z" fill="${o._lid}"/>` + L('M-19.5 -2.6Q-12 -4.6 -4.5 -2.6') + L('M4.5 -2.6Q12 -4.6 19.5 -2.6');
      if (e === 'angry' || e === 'hiss') out += `<path d="M-21 -10L-3 -9.5L-3 -2.2Z M21 -10L3 -9.5L3 -2.2Z" fill="${o._lid}"/>` + L('M-20.5 -9.6L-3.4 -2.8', 2) + L('M20.5 -9.6L3.4 -2.8', 2);
    }
    // nose wedge + mouth
    out += `<path d="M-3.2 8.2Q0 7.2 3.2 8.2Q2 12 0 12.4Q-2 12 -3.2 8.2Z" fill="${C.pad}" stroke="${ink}" stroke-width="1.25" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    if (e === 'hiss' || e === 'shock') out += `<path d="M-7.5 15Q0 12.5 7.5 15Q7 26 0 27Q-7 26 -7.5 15Z" fill="#B8344E" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="M-5.6 15.2L-4 19.6L-2.4 14.6Z M5.6 15.2L4 19.6L2.4 14.6Z" fill="#fff" stroke="${ink}" stroke-width="1" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    else if (e === 'smug') out += L('M0 12.4Q-1 17 -7 16.4') + L('M0 12.4Q1 17.6 8.5 14.6');
    else out += L('M0 12.4Q-0.6 17 -6.4 16.6Q-9 16.2 -9.8 14') + L('M0 12.4Q0.6 17 6.4 16.6Q9 16.2 9.8 14');
    // whiskers
    out += L('M-22 9L-39 6', 1.25) + L('M-22 13L-38 15.5', 1.25) + L('M22 9L39 6', 1.25) + L('M22 13L38 15.5', 1.25);
    return out;
  }

  /* ------------------------------------------------------------------ cat poses
   * Every pose is authored facing RIGHT (or square to camera) with the ground at y=0 and the
   * cat's centre at x=0, about 100 units tall. Each returns silhouette groups in paint order;
   * groups carry named pattern REGIONS that the coat generator fills and clips to the silhouette. */
  const POSES = {};

  /* --- back: standing, seen from behind and a little above (the exploration camera) --- */
  POSES.back = function (o) {
    const B = BUILD[o.build], hw = B.bx, hs = B.head;
    const hy = -70 * B.by - (B.leg - 1) * 14; // head centre y
    const legY = -(B.leg - 1) * 14;
    const body = xf([[-27, -8], [-32, -24], [-31, -42], [-25, -57], [-13, -66], [0, -68], [13, -66], [25, -57], [31, -42], [32, -24], [27, -8], [12, -4], [0, -8], [-12, -4]], { sx: hw, sy: B.by, y: legY });
    const legL = tube([[-17 * hw, -20 + legY], [-18 * hw, -4]], [15, 13]), legR = tube([[17 * hw, -20 + legY], [18 * hw, -4]], [15, 13]);
    const footL = ell(-19 * hw, -3.6, 10, 5.4), footR = ell(19 * hw, -3.6, 10, 5.4);
    const head = xf([[-25, 9], [-29, 0], [-27, -12], [-18, -21], [0, -24], [18, -21], [27, -12], [29, 0], [25, 9], [12, 14], [0, 15], [-12, 14]], { s: hs, y: hy });
    const sc = o.scars || [];
    let eL = earPts(o.ears, -1), eR = earPts(o.ears, 1);
    if (sc.includes('notch')) eR = applyEarScar(eR, 'notch', 1);
    if (sc.includes('fold')) eL = applyEarScar(eL, 'fold', -1);
    eL = xf(eL, { s: hs, y: hy }); eR = xf(eR, { s: hs, y: hy });
    const parts = [{ d: legL }, { d: legR }, { d: footL }, { d: footR }, { d: blob(body) }, { d: blob(eL) }, { d: blob(eR) }, { d: blob(head) }];
    if (sc.includes('cowlick')) parts.push({ d: blob(xf([[-5, -22], [-2, -36, 1], [3, -29], [8, -33, 1], [6, -21]], { s: hs, y: hy })) });
    const hb = hy + 15 * hs; // head bottom
    const R = {
      cap: [blob(xf([[-36, -4], [-22, 1], [-9, -3], [0, 2], [9, -3], [22, 1], [36, -4], [36, -60], [-36, -60]], { s: hs, y: hy }))],
      ears: [blob(xf([[-36, -17], [0, -24], [36, -17], [36, -60], [-36, -60]], { s: hs, y: hy }))],
      mask: [blob(xf([[-36, -17], [0, -22], [36, -17], [36, -60], [-36, -60]], { s: hs, y: hy }))],
      saddle: [blob(xf([[-24, -70], [-27, -48], [-16, -33], [0, -28], [16, -33], [27, -48], [24, -70]], { sx: hw, sy: B.by, y: legY }))],
      stripes: [-58, -46, -34, -22].map((y, i) => { const w = 34 - i * 1.5; return blob(xf([[-w, y + 9], [-w * 0.5, y + 1], [-3, y - 3, 1], [-w * 0.5, y + 6], [-w, y + 15]], { sx: hw, sy: B.by, y: legY })) + blob(xf([[w, y + 9], [w * 0.5, y + 1], [3, y - 3, 1], [w * 0.5, y + 6], [w, y + 15]], { sx: hw, sy: B.by, y: legY })); })
        .concat([blob(xf([[-12, -30], [-9, -18], [-6, -30, 1]], { s: hs, y: hy })), blob(xf([[-2, -32], [0, -17], [2, -32, 1]], { s: hs, y: hy })), blob(xf([[12, -30], [9, -18], [6, -30, 1]], { s: hs, y: hy }))]),
      socks: [ell(-19 * hw, -4, 14, 9), ell(19 * hw, -4, 14, 9)],
      belly: [], muzzle: [blob(xf([[-40, 4], [-22, 2], [-22, 20], [-40, 20]], { s: hs, y: hy })), blob(xf([[40, 4], [22, 2], [22, 20], [40, 20]], { s: hs, y: hy }))], bib: [],
      patchA: [blob(xf([[-40, -52], [-14, -56], [-2, -40], [-10, -22], [-40, -18]], { sx: hw, sy: B.by, y: legY })), blob(xf([[2, -8], [14, -26], [36, -22], [40, 16], [8, 18]], { s: hs, y: hy }))],
      patchB: [blob(xf([[40, -40], [12, -44], [4, -24], [16, -6], [40, -6]], { sx: hw, sy: B.by, y: legY })), blob(xf([[-40, -30], [-8, -32], [-4, -12], [-22, -6], [-40, -8]], { s: hs, y: hy }))],
      eyePatch: [],
    };
    const shadeD = blob(xf([[14, -66], [24, -54], [25, -34], [20, -14], [6, -4], [40, 0], [40, -70]], { sx: hw, sy: B.by, y: legY })) // right flank
      + blob([[-30 * hs, hb - 4], [0, hb + 2], [30 * hs, hb - 4], [28 * hw, hb + 5], [0, hb + 9], [-22 * hw, hb + 3]]) // under the head
      + blob(xf([[10, 14], [21, 2], [24, -12], [20, -22], [36, -22], [36, 20]], { s: hs, y: hy }));
    const lines = [
      blob([[-24.5 * hs, hy + 10 * hs], [-14 * hs, hb - 1], [-3 * hs, hb + 0.5]], false), blob([[24.5 * hs, hy + 10 * hs], [14 * hs, hb - 1], [3 * hs, hb + 0.5]], false), // jaw over shoulders
      blob([[-14 * hw, -19 + legY * 0.5], [-9 * hw, -9], [-11 * hw, -3]], false), blob([[14 * hw, -19 + legY * 0.5], [9 * hw, -9], [11 * hw, -3]], false), // inner thighs
    ];
    const whisk = inkLine(`M${-27 * hs} ${hy + 5 * hs}L${-41 * hs} ${hy + 1 * hs}M${-26 * hs} ${hy + 9 * hs}L${-40 * hs} ${hy + 10 * hs}M${27 * hs} ${hy + 5 * hs}L${41 * hs} ${hy + 1 * hs}M${26 * hs} ${hy + 9 * hs}L${40 * hs} ${hy + 10 * hs}`, 1.25);
    const tail = tailParts(o, 0, -24 * B.by + legY, -1, 'back');
    const collar = { back: [[-21 * hs, hb - 6], [-10 * hs, hb + 1], [0, hb + 2.5], [10 * hs, hb + 1], [21 * hs, hb - 6]], bell: null };
    return { groups: [{ name: 'main', parts, R, shade: shadeD, lines, extra: whisk }], tail: { ...tail, over: true }, collar, plaster: [0, hy - 20 * hs], hx: 0, hy, cord: [0, -24 * B.by + legY], w: 34 * hw, top: hy - 40 * hs };
  };

  /* --- shared side-view head (facing right), head-local: skull centre at 0,0 --- */
  function sideHead(o, st) {
    st = st || {};
    const skull = [[-22, 4], [-23, -9], [-15, -20], [0, -24], [14, -21], [22, -12], [25, -4], [30, 2], [29, 8], [22, 13], [10, 16], [-6, 16], [-17, 12]];
    let near = [[-15, -17], [-14, -31], [-8, -41, 1], [0, -31], [6, -21]];
    let far = [[4, -21], [11, -33], [17, -39, 1], [20, -29], [21, -16]];
    if (o.ears === 'tall') { near = [[-15, -17], [-14, -36], [-9, -50, 1], [0, -34], [6, -21]]; far = [[4, -21], [12, -37], [18, -47, 1], [21, -32], [21, -16]]; }
    if (o.ears === 'round') { near = [[-16, -16], [-17, -27], [-10, -34], [0, -30], [5, -21]]; far = [[5, -21], [10, -30], [17, -33], [21, -26], [21, -15]]; }
    if (st.earsBack) { near = [[-20, -10], [-33, -17], [-40, -15, 1], [-30, -6], [-18, 0]]; far = [[-10, -20], [-24, -28], [-31, -27, 1], [-22, -18], [-12, -12]]; }
    const sc = o.scars || [];
    if (sc.includes('notch') && !st.earsBack) near = [near[0], near[1], [near[2][0] - 1, near[2][1] + 3, 1], [near[2][0] + 3, near[2][1] + 12, 1], [near[2][0] + 6, near[2][1] + 4, 1], near[3], near[4]];
    if (sc.includes('fold') && !st.earsBack) far = far.map((p) => p[2] ? [p[0] + 3, p[1] + 13] : p);
    const eye = o.eye, e = o.expr || 'neutral';
    let face = '';
    if (e === 'happy' || e === 'sleepy' || e === 'blink') face += inkLine('M8 -3Q13 -8 18 -3', 1.5);
    else if (e === 'spiral') face += `<circle cx="13" cy="-4" r="6" fill="#fff" stroke="${C.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>` + inkLine('M13 -4q2 -2 3 0q1 3 -3 3q-5 0 -4 -4', 1.2);
    else {
      face += `<ellipse cx="13" cy="-4" rx="5" ry="6.2" fill="${eye}" stroke="${C.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><ellipse cx="14.2" cy="-3.6" rx="2.2" ry="4.6" fill="${C.ink}"/><circle cx="11.6" cy="-6.6" r="1.6" fill="#fff"/>`;
      if (e === 'angry' || e === 'hiss') face += `<path d="M6 -13L20 -9L20 -4.5Z" fill="${o._lid}"/>` + inkLine('M6.5 -12.6L19.6 -5', 2);
      if (e === 'smug') face += `<path d="M7 -11H19.5V-5.6Q13 -7.6 7 -5.6Z" fill="${o._lid}"/>` + inkLine('M7.6 -5.8Q13 -7.8 18.8 -5.8', 1.5);
    }
    face += `<path d="M27.4 -0.6Q30.6 -0.4 30.4 2.6Q28.4 3.4 26.8 1.4Z" fill="${C.pad}" stroke="${C.ink}" stroke-width="1.25" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    if (st.mouthOpen) face += `<path d="M28.6 5.4L16 6.6Q17 15 24 16.4Q27.6 12 28.6 5.4Z" fill="#B8344E" stroke="${C.ink}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="M26.4 5.8L25 10.4L23.4 6.2Z M19.6 13.6L21 9.4L22.6 14.6Z" fill="#fff" stroke="${C.ink}" stroke-width="1" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    else face += inkLine('M28.4 4Q26 8.4 20.6 7.6', 1.5);
    face += inkLine('M21 3L4 1M21 6L5 9.5', 1.25) + inkLine('M26 4L43 0M26 6L42 9', 1.25);
    const R = {
      cap: [blob([[-32, -8], [-12, -5], [0, -9], [12, -5], [34, -10], [34, -60], [-32, -60]])],
      ears: [blob([[-32, -19], [0, -23], [34, -17], [34, -60], [-32, -60]])],
      mask: [blob([[2, -14], [16, -18], [34, -8], [36, 12], [16, 20], [4, 8]]), blob([[-44, -19], [0, -23], [34, -17], [34, -60], [-44, -60]])],
      muzzle: [blob([[10, 3], [20, -1], [36, -3], [36, 22], [-26, 24], [-22, 9], [-4, 11]])],
      eyePatch: [ell(12, -6, 12, 12)],
      stripes: [blob([[-8, -30], [-5, -14], [-2, -30, 1]]), blob([[2, -30], [4, -15], [7, -30, 1]]), blob([[-26, -2], [-12, -1, 1], [-26, 3]])],
    };
    return { skull, near, far, face, R };
  }
  function placeHead(H, T) { // apply a transform to all head geometry; returns parts + regions + face group
    const tr = `translate(${r1(T.x)} ${r1(T.y)}) rotate(${T.r || 0}) scale(${T.s || 1})`;
    const R = {}; Object.keys(H.R).forEach((k) => { R[k] = H.R[k].map((d) => ({ d, tr })); });
    return { skull: blob(xf(H.skull, T)), near: blob(xf(H.near, T)), far: blob(xf(H.far, T)), face: `<g transform="${tr}">${H.face}</g>`, R, tr };
  }
  const mergeR = (A, B) => { const o = {}; new Set([...Object.keys(A), ...Object.keys(B)]).forEach((k) => { o[k] = [...(A[k] || []), ...(B[k] || [])]; }); return o; };

  /* --- side-walk: profile, mid-stride --- */
  POSES['side-walk'] = function (o) {
    const B = BUILD[o.build], L = B.leg, top = -30 - 26 * L; // belly line height depends on leg length
    const by = top - 18 * B.by;
    const body = xf([[-46, 2], [-49, -12], [-40, -24], [-20, -27], [6, -25], [28, -24], [41, -16], [44, -2], [38, 12], [22, 17], [0, 18], [-24, 18], [-40, 13]], { sx: B.bx, sy: B.by, y: by });
    const fx = 30 * B.bx, hx = -34 * B.bx, g = -4;
    const leg = (x0, y0, x1, x2, w) => tube([[x0, y0], [x1, (y0 + g) / 2], [x2, g]], w);
    const paw = (x) => ell(x + 3.5, -3.6, 9, 5);
    const nf = leg(fx, by + 4, fx + 9, fx + 16, [15, 12, 10.5]), nh = tube([[hx, by + 2], [hx - 10, by + 22], [hx - 3, g - 12], [hx - 14, g]], [22, 16, 11, 10]);
    const ff = leg(fx - 6, by + 4, fx - 13, fx - 22, [14, 12, 10.5]), fh = tube([[hx + 8, by + 4], [hx + 20, by + 22], [hx + 14, g - 10], [hx + 22, g]], [18, 14, 11, 10]);
    const H = placeHead(sideHead(o), { x: 47 * B.bx, y: by - 21 * B.by, s: B.head, r: -4 });
    const hxp = 47 * B.bx, hyp = by - 21 * B.by;
    const tail = tailParts(o, -44 * B.bx, by - 10 * B.by, -1, 'side');
    const R = mergeR({
      saddle: [blob(xf([[-52, -6], [-30, 0], [0, -4], [30, -1], [46, -8], [46, -40], [-52, -40]], { sx: B.bx, sy: B.by, y: by }))],
      belly: [blob(xf([[-44, 10], [-20, 6], [8, 9], [30, 3], [50, 6], [50, 40], [-44, 40]], { sx: B.bx, sy: B.by, y: by }))],
      bib: [blob(xf([[26, -22], [34, -4], [28, 10], [44, 30], [60, 0], [50, -24]], { sx: B.bx, sy: B.by, y: by }))],
      socks: [`M-200 -15H200V10H-200Z`],
      stripes: [-34, -18, -2, 14, 28].map((x) => blob(xf([[x - 5, -32], [x + 1, -8], [x + 5, 4, 1], [x + 8, -10], [x + 6, -32]], { sx: B.bx, sy: B.by, y: by }))),
      patchA: [blob(xf([[-56, -34], [-22, -34], [-12, -10], [-26, 8], [-56, 10]], { sx: B.bx, sy: B.by, y: by })), { d: blob([[-30, -30], [0, -34], [10, -8], [-6, 8], [-30, 6]]), tr: H.tr }],
      patchB: [blob(xf([[0, -34], [36, -34], [40, -6], [22, 6], [6, -6]], { sx: B.bx, sy: B.by, y: by }))],
    }, H.R);
    const shadeD = blob(xf([[-52, 8], [-36, 9], [-10, 12], [16, 11], [36, 5], [48, -4], [52, 30], [-52, 30]], { sx: B.bx, sy: B.by, y: by })) + `M-200 ${by + 24}H200V10H-200Z` + blob(xf([[-24, 10], [-4, 13], [14, 12], [26, 6], [34, 20], [-24, 24]], { x: hxp, y: hyp, s: B.head, r: -4 }));
    const lines = [blob([[hx - 14, by - 8], [hx + 6, by - 4], [hx + 8, by + 12], [hx - 2, by + 20]], false), blob([[fx - 8, by + 2], [fx - 6, by + 12]], false)];
    return {
      groups: [
        { name: 'far', parts: [{ d: ff }, { d: paw(fx - 22) }, { d: fh }, { d: paw(hx + 22) }, { d: H.far }], R, shadeAll: true },
        { name: 'main', parts: [{ d: blob(body) }, { d: nf }, { d: paw(fx + 16) }, { d: nh }, { d: paw(hx - 14) }, { d: H.skull }, { d: H.near }], R, shade: shadeD, lines, extra: H.face },
      ],
      tail: { ...tail, over: false },
      collar: { side: [[hxp - 16 * B.head, hyp + 7], [hxp - 6 * B.head, hyp + 22 * B.head]], bell: [hxp - 2 * B.head, hyp + 24 * B.head] },
      plaster: [hxp - 2, hyp - 21 * B.head], cord: [-44 * B.bx, by - 10 * B.by], hx: hxp, hy: hyp,
    };
  };

  /* --- side-pounce: full-stretch leap, up and to the right --- */
  POSES['side-pounce'] = function (o) {
    const B = BUILD[o.build], rot = -24, T = { r: rot, x: 0, y: -62 };
    const body = xf(xf([[-54, 0], [-56, -11], [-42, -20], [-16, -21], [14, -19], [38, -17], [50, -9], [52, 2], [42, 11], [20, 13], [-6, 12], [-32, 13], [-48, 9]], { sx: B.bx, sy: B.by }), T);
    const P = (x, y) => xf([[x * B.bx, y]], T)[0];
    const fl = (dx, dy, w) => tube([P(40, 4), P(60 + dx, 10 + dy), P(84 + dx, 6 + dy)], w || [15, 12, 10]);
    const hl = (dx, dy, w) => tube([P(-44, 2), P(-66 + dx, 12 + dy), P(-92 + dx, 8 + dy)], w || [20, 14, 10]);
    const pawAt = (p, r) => ell(p[0], p[1], 8.5, 5.6, r);
    const hp = P(58, -18);
    const H = placeHead(sideHead(o, { mouthOpen: o.expr === 'hiss' }), { x: hp[0], y: hp[1], s: B.head, r: rot + 14 });
    const tb = P(-52, -8);
    const tail = tailParts(Object.assign({}, o, { carry: o.carry === 'level' ? 'blade' : o.carry }), tb[0], tb[1], -1, 'side');
    const R = mergeR({
      saddle: [blob(xf([[-60, -4], [-30, 0], [0, -3], [30, 0], [56, -6], [56, -40], [-60, -40]].map((p) => [p[0] * B.bx, p[1] * B.by]), T))],
      belly: [blob(xf([[-60, 8], [-20, 4], [20, 6], [60, 2], [60, 40], [-60, 40]].map((p) => [p[0] * B.bx, p[1] * B.by]), T))],
      bib: [blob(xf([[32, -18], [40, 0], [34, 12], [60, 22], [66, -18]].map((p) => [p[0] * B.bx, p[1] * B.by]), T))],
      socks: [ell(P(86, 10)[0], P(86, 10)[1], 20, 16), ell(P(-94, 12)[0], P(-94, 12)[1], 22, 16), ell(P(88, 0)[0], P(88, 0)[1], 18, 12)],
      stripes: [-38, -20, -2, 16, 32].map((x) => blob(xf([[x - 5, -28], [x + 1, -8], [x + 5, 2, 1], [x + 8, -10], [x + 6, -28]].map((p) => [p[0] * B.bx, p[1] * B.by]), T))),
      patchA: [blob(xf([[-62, -30], [-26, -30], [-14, -8], [-30, 6], [-62, 8]].map((p) => [p[0] * B.bx, p[1] * B.by]), T)), { d: blob([[-30, -30], [0, -34], [10, -8], [-6, 8], [-30, 6]]), tr: H.tr }],
      patchB: [blob(xf([[4, -30], [40, -30], [44, -6], [26, 4], [10, -6]].map((p) => [p[0] * B.bx, p[1] * B.by]), T))],
    }, H.R);
    const shadeD = blob(xf([[-60, 6], [-30, 7], [0, 8], [30, 7], [56, 0], [60, 40], [-60, 40]].map((p) => [p[0] * B.bx, p[1] * B.by]), T));
    const p1 = P(84, 6), p2 = P(84, -2), p3 = P(-92, 8), p4 = P(-90, 0);
    return {
      groups: [
        { name: 'far', parts: [{ d: tube([P(36, 0), P(58, -2), P(84, -8)], [14, 12, 10]) }, { d: pawAt(P(88, -8), rot) }, { d: tube([P(-40, 0), P(-64, 2), P(-90, -4)], [18, 13, 10]) }, { d: pawAt(P(-95, -4), rot) }, { d: H.far }], R, shadeAll: true },
        { name: 'main', parts: [{ d: blob(body) }, { d: fl(0, 0) }, { d: pawAt(P(89, 6), rot) }, { d: hl(0, 0) }, { d: pawAt(P(-97, 8), rot) }, { d: H.skull }, { d: H.near }], R, shade: shadeD, lines: [blob([P(-54, -10), P(-36, -2), P(-44, 10)], false)], extra: H.face },
      ],
      tail: { ...tail, over: false },
      collar: { side: [[hp[0] - 17 * B.head, hp[1] + 2], [hp[0] - 12 * B.head, hp[1] + 19 * B.head]], bell: [hp[0] - 9 * B.head, hp[1] + 22 * B.head] },
      plaster: [hp[0] - 6, hp[1] - 20 * B.head], cord: tb, hx: hp[0], hy: hp[1],
    };
  };

  /* --- front-sit: sitting square to camera (close-ups, name-cards, wall-top watchers) --- */
  function frontHeadPts() { return [[-27, 10], [-31, 1], [-29, -12], [-19, -21], [0, -24], [19, -21], [29, -12], [31, 1], [27, 10], [14, 16], [0, 17.5], [-14, 16]]; }
  function frontRegions(hs, hy) {
    const t = (pts) => blob(xf(pts, { s: hs, y: hy }));
    return {
      cap: [t([[-40, -10], [-24, -7], [-12, -10], [-4, -6], [0, -2], [4, -6], [12, -10], [24, -7], [40, -10], [40, -60], [-40, -60]])],
      ears: [t([[-40, -18], [0, -24], [40, -18], [40, -60], [-40, -60]])],
      mask: [ell(0, hy + 4 * hs, 17 * hs, 15 * hs), t([[-40, -18], [0, -23], [40, -18], [40, -60], [-40, -60]])],
      muzzle: [t([[-15, 4], [-6, 2], [0, -8], [6, 2], [15, 4], [26, 12], [20, 30], [-20, 30], [-26, 12]])],
      eyePatch: [t([[2, -30], [8, -6], [16, 9], [27, 8], [36, -6], [30, -30]])],
      stripes: [t([[-9, -30], [-7, -13], [-4, -30, 1]]), t([[-1.6, -32], [0, -11], [1.6, -32, 1]]), t([[9, -30], [7, -13], [4, -30, 1]]), t([[-36, -2], [-21, -1, 1], [-36, 3]]), t([[36, -2], [21, -1, 1], [36, 3]]), t([[-34, 7], [-22, 6, 1], [-33, 11]]), t([[34, 7], [22, 6, 1], [33, 11]])],
    };
  }
  POSES['front-sit'] = function (o) {
    const B = BUILD[o.build], hs = B.head, bw = B.bx, hy = -74 * (0.9 + 0.1 * B.leg) - (B.by - 1) * 6;
    const body = xf([[-22, -62], [-28, -44], [-33, -24], [-35, -10], [-28, -2], [0, -1], [28, -2], [35, -10], [33, -24], [28, -44], [22, -62]], { sx: bw });
    const lgL = tube([[-9, -50], [-10, -6]], [13, 12]), lgR = tube([[9, -50], [10, -6]], [13, 12]);
    const pwL = ell(-10.5, -4.6, 9.6, 5.6), pwR = ell(10.5, -4.6, 9.6, 5.6);
    const hfL = ell(-27 * bw, -4.6, 9.5, 5.4), hfR = ell(27 * bw, -4.6, 9.5, 5.4);
    const head = xf(frontHeadPts(), { s: hs, y: hy });
    const sc = o.scars || [];
    let eL = earPts(o.ears, -1), eR = earPts(o.ears, 1);
    if (sc.includes('notch')) eR = applyEarScar(eR, 'notch', 1);
    if (sc.includes('fold')) eL = applyEarScar(eL, 'fold', -1);
    const innerEar = (pts, s) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length + 3; return blob(xf(pts.map((p) => [(p[0] - cx) * 0.52 + cx + s * 1.5, (p[1] - cy) * 0.6 + cy, p[2]]), { s: hs, y: hy })); };
    const inner = `<path d="${innerEar(eL, 1)} ${innerEar(eR, -1)}" fill="${C.purr}"/>`;
    const headParts = [{ d: blob(xf(eL, { s: hs, y: hy })) }, { d: blob(xf(eR, { s: hs, y: hy })) }, { d: blob(head) }];
    if (sc.includes('cowlick')) headParts.push({ d: blob(xf([[-5, -22], [-2, -36, 1], [3, -29], [8, -33, 1], [6, -21]], { s: hs, y: hy })) });
    const FR = frontRegions(hs, hy);
    const R = mergeR({
      saddle: [], belly: [ell(0, -30, 15 * bw, 30)], bib: [blob([[-16 * bw, -66], [-13 * bw, -44], [0, -30], [13 * bw, -44], [16 * bw, -66]])],
      socks: ['M-200 -15H200V10H-200Z'],
      stripes: [-46, -32, -18].map((y) => blob([[-40 * bw, y - 3], [-22 * bw, y + 1, 1], [-40 * bw, y + 5]]) + blob([[40 * bw, y - 3], [22 * bw, y + 1, 1], [40 * bw, y + 5]])),
      patchA: [blob([[-44 * bw, -70], [-12 * bw, -66], [-14 * bw, -36], [-44 * bw, -30]]), FR.eyePatch[0]],
      patchB: [blob([[44 * bw, -44], [16 * bw, -40], [14 * bw, -10], [44 * bw, -6]]), blob(xf([[-40, -30], [-6, -32], [-12, -4], [-40, 2]], { s: hs, y: hy }))],
    }, FR);
    const hb = hy + 17.5 * hs;
    const tail = tailParts(Object.assign({}, o, { carry: 'wrap' }), 30 * bw, -8, -1, 'side');
    const eyeY = hy + 1 * hs;
    const face = `<g transform="translate(0 ${r1(eyeY)}) scale(${hs})">${faceFront(o)}</g>`;
    return {
      groups: [
        { name: 'body', parts: [{ d: hfL }, { d: hfR }, { d: blob(body) }], R, shade: blob([[10 * bw, -66], [20 * bw, -40], [22 * bw, -14], [10 * bw, -2], [50, 0], [50, -70]]) + blob([[-30, hb - 6], [0, hb + 1], [30, hb - 6], [30, hb + 6], [0, hb + 12], [-26, hb + 5]]) },
        { name: 'legs', parts: [{ d: lgL }, { d: lgR }, { d: pwL }, { d: pwR }], R, shade: blob([[-30, hb - 6], [0, hb + 1], [30, hb - 6], [30, hb + 6], [0, hb + 12], [-26, hb + 5]]) + `M12 -60H30V0H12Z`, lines: [`M-10.5 -8.6V-5`, `M10.5 -8.6V-5`] },
        { name: 'head', parts: headParts, R, shade: blob(xf([[12, 17], [23, 6], [26, -10], [22, -22], [40, -22], [40, 24]], { s: hs, y: hy })), extra: inner + face },
      ],
      tail: { ...tail, over: true, afterGroup: 0 },
      collar: { front: [[-19 * hs, hb - 5], [0, hb + 1.5], [19 * hs, hb - 5]], bell: [0, hb + 5] },
      plaster: [10 * hs, hy - 15 * hs], cord: null, hx: 0, hy,
    };
  };

  /* --- loaf: tucked up on a wall top, front three-quarter (Daifuku's default) --- */
  POSES.loaf = function (o) {
    const B = BUILD[o.build], hs = B.head, bw = B.bx, hy = -44 * B.by;
    const body = xf([[-44, -4], [-48, -18], [-42, -36], [-24, -47], [0, -50], [24, -47], [42, -36], [48, -18], [44, -4], [20, -1], [-20, -1]], { sx: bw, sy: B.by });
    const head = xf(frontHeadPts(), { s: hs, y: hy });
    const sc = o.scars || [];
    let eL = earPts(o.ears, -1), eR = earPts(o.ears, 1);
    if (sc.includes('notch')) eR = applyEarScar(eR, 'notch', 1);
    if (sc.includes('fold')) eL = applyEarScar(eL, 'fold', -1);
    const FR = frontRegions(hs, hy);
    const R = mergeR({
      saddle: [blob(xf([[-52, -8], [-40, -22], [-52, -60], [52, -60], [40, -22], [52, -8], [60, -70], [-60, -70]], { sx: bw, sy: B.by })), blob(xf([[-60, -14], [-34, -20], [-30, -60], [-60, -60]], { sx: bw, sy: B.by })), blob(xf([[60, -14], [34, -20], [30, -60], [60, -60]], { sx: bw, sy: B.by }))],
      belly: [ell(0, -8, 22 * bw, 12)], bib: [ell(0, -10, 20 * bw, 16)], socks: [ell(-12, -4, 10, 6), ell(12, -4, 10, 6)],
      stripes: [-34, -22].map((y) => blob([[-52 * bw, y - 3], [-34 * bw, y + 1, 1], [-52 * bw, y + 5]]) + blob([[52 * bw, y - 3], [34 * bw, y + 1, 1], [52 * bw, y + 5]])),
      patchA: [blob([[-60 * bw, -60], [-22 * bw, -56], [-26 * bw, -22], [-60 * bw, -14]]), FR.eyePatch[0]], patchB: [blob([[60 * bw, -40], [28 * bw, -36], [24 * bw, -6], [60 * bw, -2]])],
    }, FR);
    const hb = hy + 17.5 * hs;
    const face = `<g transform="translate(0 ${r1(hy + hs)}) scale(${hs})">${faceFront(o)}</g>`;
    const innerEar = (pts, s) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length + 3; return blob(xf(pts.map((p) => [(p[0] - cx) * 0.52 + cx + s * 1.5, (p[1] - cy) * 0.6 + cy, p[2]]), { s: hs, y: hy })); };
    const tail = tailParts(Object.assign({}, o, { carry: 'wrap' }), 42 * bw, -8, -1, 'side');
    return {
      groups: [
        { name: 'body', parts: [{ d: blob(body) }, { d: ell(-12, -4.4, 10, 5.4) }, { d: ell(12, -4.4, 10, 5.4) }], R, shade: blob([[20 * bw, -50], [34 * bw, -30], [34 * bw, -10], [16 * bw, -2], [70, 0], [70, -50]]) + blob([[-34, hb - 6], [0, hb + 1], [34, hb - 6], [34, hb + 5], [0, hb + 10], [-28, hb + 4]]), lines: [`M-2 -4.4Q0 -7 2 -4.4`] },
        { name: 'head', parts: [{ d: blob(xf(eL, { s: hs, y: hy })) }, { d: blob(xf(eR, { s: hs, y: hy })) }, { d: blob(head) }], R, shade: blob(xf([[12, 17], [23, 6], [26, -10], [22, -22], [40, -22], [40, 24]], { s: hs, y: hy })), extra: `<path d="${innerEar(eL, 1)} ${innerEar(eR, -1)}" fill="${C.purr}"/>` + face },
      ],
      tail: { ...tail, over: true, afterGroup: 0 },
      collar: { front: [[-19 * hs, hb - 5], [0, hb + 1.5], [19 * hs, hb - 5]], bell: [0, hb + 5] }, plaster: [10 * hs, hy - 15 * hs], cord: null, hx: 0, hy,
    };
  };

  /* --- hiss: the Halloween arch, side on, fur up, tail bottle-brushed --- */
  POSES.hiss = function (o) {
    const B = BUILD[o.build], by = -58;
    const spike = (pts) => pts; // hackle ridge is authored as corner points
    const body = xf(spike([[-40, 14], [-46, 0], [-42, -14], [-34, -24, 1], [-29, -21], [-22, -31, 1], [-16, -27], [-8, -36, 1], [-2, -31], [7, -37, 1], [12, -31], [21, -33, 1], [24, -26], [33, -24, 1], [35, -16], [41, -6], [40, 8], [30, 15], [8, 10], [-12, 10], [-28, 17]]), { sx: B.bx, sy: B.by, y: by });
    const fx = 32 * B.bx, hx = -34 * B.bx, g = -4;
    const leg = (x0, x1, w) => tube([[x0, by + 6], [(x0 + x1) / 2 + 1, (by + g) / 2], [x1, g]], w);
    const paw = (x) => ell(x + 3.5, -3.6, 9, 5);
    const H = placeHead(sideHead(Object.assign({}, o, { expr: 'hiss' }), { earsBack: true, mouthOpen: true }), { x: 50 * B.bx, y: by + 6, s: B.head, r: 8 });
    const hxp = 50 * B.bx, hyp = by + 6;
    const tail = tailParts(Object.assign({}, o, { carry: o.tail === 'pom' || o.tail === 'stub' ? 'post' : 'flag', _puff: true }), -42 * B.bx, by - 4, -1, 'side');
    const R = mergeR({
      saddle: [blob(xf([[-52, -6], [-30, -2], [0, -8], [30, -4], [46, -8], [46, -50], [-52, -50]], { sx: B.bx, sy: B.by, y: by }))],
      belly: [blob(xf([[-44, 12], [-20, 4], [8, 4], [30, 6], [50, 6], [50, 40], [-44, 40]], { sx: B.bx, sy: B.by, y: by }))],
      bib: [blob(xf([[26, -10], [34, 0], [28, 12], [44, 30], [60, 0], [50, -14]], { sx: B.bx, sy: B.by, y: by }))],
      socks: [`M-200 -15H200V10H-200Z`],
      stripes: [-32, -16, 0, 16, 30].map((x) => blob(xf([[x - 5, -40], [x + 1, -14], [x + 5, 0, 1], [x + 8, -14], [x + 6, -40]], { sx: B.bx, sy: B.by, y: by }))),
      patchA: [blob(xf([[-56, -40], [-22, -40], [-12, -10], [-26, 8], [-56, 10]], { sx: B.bx, sy: B.by, y: by })), { d: blob([[-30, -30], [0, -34], [10, -8], [-6, 8], [-30, 6]]), tr: H.tr }],
      patchB: [blob(xf([[0, -40], [36, -40], [40, -8], [22, 4], [6, -8]], { sx: B.bx, sy: B.by, y: by }))],
    }, H.R);
    return {
      groups: [
        { name: 'far', parts: [{ d: leg(fx - 9, fx - 14, [14, 11, 10]) }, { d: paw(fx - 14) }, { d: leg(hx + 12, hx + 16, [16, 12, 10]) }, { d: paw(hx + 16) }, { d: H.far }], R, shadeAll: true },
        { name: 'main', parts: [{ d: blob(body) }, { d: leg(fx, fx + 5, [15, 12, 10.5]) }, { d: paw(fx + 5) }, { d: leg(hx, hx - 6, [19, 13, 10.5]) }, { d: paw(hx - 6) }, { d: H.skull }, { d: H.near }], R, shade: blob(xf([[-52, 6], [-30, 2], [0, 2], [30, 4], [52, 0], [52, 40], [-52, 40]], { sx: B.bx, sy: B.by, y: by })) + `M-200 ${by + 26}H200V10H-200Z`, lines: [blob([[hx - 12, by - 4], [hx + 6, by + 2], [hx + 5, by + 16]], false)], extra: H.face },
      ],
      tail: { ...tail, over: false },
      collar: { side: [[hxp - 19 * B.head, hyp - 2], [hxp - 13 * B.head, hyp + 17 * B.head]], bell: [hxp - 10 * B.head, hyp + 20 * B.head] },
      plaster: [hxp - 4, hyp - 21 * B.head], cord: [-42 * B.bx, by - 4], hx: hxp, hy: hyp,
    };
  };

  /* --- frazzled: staggered, front on, puffed ~15% into a zigzag silhouette (must read in pure black) --- */
  POSES.frazzled = function (o) {
    const B = BUILD[o.build], hs = B.head * 1.04, bw = B.bx, hy = -70;
    const zig = (pts, amp) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; const S = sampleCR([...pts, pts[0]], 3); S.pop(); return S.map((p, i) => { const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1, k = i % 2 ? amp : -amp * 0.2; return [p[0] + dx / l * k, p[1] + dy / l * k, 1]; }); };
    const body = zig(xf([[-22, -58], [-33, -34], [-39, -12], [-30, -2], [0, -1], [30, -2], [39, -12], [33, -34], [22, -58]], { sx: bw }), 5);
    const head = zig(xf(frontHeadPts(), { s: hs, y: hy }), 4.6);
    let eL = xf(earPts(o.ears, -1), { s: hs, y: hy, r: -16 }), eR = xf(earPts(o.ears, 1), { s: hs, y: hy, r: 14 });
    const FR = frontRegions(hs, hy);
    const R = mergeR({ saddle: [], belly: [ell(0, -28, 15 * bw, 28)], bib: [blob([[-16 * bw, -62], [-13 * bw, -42], [0, -28], [13 * bw, -42], [16 * bw, -62]])], socks: ['M-200 -14H200V10H-200Z'], stripes: [-44, -30, -16].map((y) => blob([[-46 * bw, y - 3], [-24 * bw, y + 1, 1], [-46 * bw, y + 5]]) + blob([[46 * bw, y - 3], [24 * bw, y + 1, 1], [46 * bw, y + 5]])), patchA: [blob([[-50 * bw, -66], [-12 * bw, -62], [-14 * bw, -34], [-50 * bw, -28]]), FR.eyePatch[0]], patchB: [blob([[50 * bw, -42], [16 * bw, -38], [14 * bw, -8], [50 * bw, -4]])] }, FR);
    const legL = tube([[-12, -44], [-19, -6]], [13, 12]), legR = tube([[12, -44], [20, -6]], [13, 12]);
    const face = `<g transform="translate(0 ${r1(hy + hs)}) scale(${hs})">${faceFront(Object.assign({}, o, { expr: 'spiral' }))}</g>`;
    const tail = tailParts(Object.assign({}, o, { carry: 'spring', _puff: true }), 30 * bw, -14, 1, 'side');
    return {
      groups: [
        { name: 'body', parts: [{ d: blob(body) }], R, shade: blob([[12 * bw, -62], [22 * bw, -40], [24 * bw, -14], [10 * bw, -2], [60, 0], [60, -70]]) },
        { name: 'legs', parts: [{ d: legL }, { d: legR }, { d: ell(-20, -4.6, 10, 5.6) }, { d: ell(21, -4.6, 10, 5.6) }], R },
        { name: 'head', parts: [{ d: blob(eL) }, { d: blob(eR) }, { d: blob(head) }], R, shade: blob(xf([[12, 20], [23, 6], [27, -10], [22, -26], [44, -26], [44, 26]], { s: hs, y: hy })), extra: face },
      ],
      tail: { ...tail, over: false }, collar: { front: [[-18 * hs, hy + 13 * hs], [0, hy + 19 * hs], [18 * hs, hy + 13 * hs]], bell: [0, hy + 22 * hs] }, plaster: [10, hy - 16 * hs], cord: null, hx: 0, hy,
    };
  };

  /* ------------------------------------------------------------------ coat generator */
  function patternOverlays(o, R, tail) {
    const c = o.coat, P = o.pattern, out = [], dark = mix(c.base, C.ink, 0.42);
    const add = (name, fill) => (R[name] || []).forEach((r) => out.push(typeof r === 'string' ? { d: r, fill } : { d: r.d, fill, tr: r.tr }));
    if (P === 'mikan') { add('cap', c.patch); add('ears', c.patch); add('eyePatch', c.patch); }
    else if (P === 'bicolour') { add('muzzle', c.white); add('bib', c.white); add('belly', c.white); add('socks', c.white); }
    else if (P === 'tuxedo') { add('muzzle', c.white); add('bib', c.white); add('socks', c.white); }
    else if (P === 'tabby') { add('stripes', c.patch || dark); add('muzzle', mix(c.base, '#FFF8EC', 0.6)); }
    else if (P === 'patched') { add('patchA', c.patch); add('patchB', c.patch2 || C.ink); }
    else if (P === 'pointed') { add('mask', c.patch); add('socks', c.patch); }
    else if (P === 'saddle') { add('saddle', c.patch); add('cap', c.patch); }
    return out;
  }
  function tailFill(o) {
    const c = o.coat, P = o.pattern;
    if (P === 'mikan' || P === 'pointed' || P === 'saddle') return c.patch;
    if (P === 'patched') return c.patch2 || c.patch;
    return c.base;
  }

  const DEFAULT_COAT = { base: COATS.grey, white: COATS.white, patch: COATS.charcoal, patch2: COATS.marmalade };
  /**
   * Draw a cat. Returns an SVG <g> string, origin at the ground point under the cat's centre.
   * @param {object} o
   * @param {string} [o.pose='back'] back | side-walk | side-pounce | front-sit | loaf | hiss | frazzled
   * @param {object|string} [o.coat] {base, white, patch, patch2} hexes, or a COATS key for `base`
   * @param {string} [o.pattern='solid'] solid | bicolour | tabby | patched | pointed | tuxedo | saddle | mikan
   * @param {string} [o.tail='whip'] whip | plume | ringed | stub | pom (pom is Mikan's alone)
   * @param {string} [o.carry] tail carriage (personality): flag | anchor | blade | comma | post | spring | level
   * @param {string} [o.ears='standard'] standard | tall | round
   * @param {string} [o.build='standard'] round | standard | long
   * @param {string[]} [o.scars] notch | fold | kink | puff | cowlick | plaster
   * @param {string} [o.collar] bell (red collar + brass bell; Mikan only) | cord (Bell Clowder gold cord)
   * @param {string|object} [o.outline='ink'] ink | gold | sage | stray | magenta | reverse | {ink,key,rim}
   * @param {string} [o.eye] amber | green | yellowgreen | blue | copper, or a hex
   * @param {string} [o.expr] neutral | smug | angry | happy | sleepy | shock | hiss | spiral
   * @param {number} [o.scale=1] 1 = about 100 px tall. @param {boolean} [o.flip] mirror to face left
   * @param {number} [o.x=0] @param {number} [o.y=0] ground position. @param {boolean} [o.shadow=true] contact shadow
   * @param {number} [o.lw=2.5] silhouette line width in screen px
   */
  function cat(o) {
    o = Object.assign({ pose: 'back', pattern: 'solid', tail: 'whip', ears: 'standard', build: 'standard', scars: [], outline: 'ink', scale: 1, x: 0, y: 0, shadow: true, lw: 2.5, eye: 'amber' }, o || {});
    if (typeof o.coat === 'string') o.coat = Object.assign({}, DEFAULT_COAT, { base: COATS[o.coat] || o.coat });
    o.coat = Object.assign({}, DEFAULT_COAT, o.coat || {});
    o.eye = EYES[o.eye] || o.eye;
    if (!o.carry) o.carry = o.pose === 'back' ? 'post' : 'level';
    if (o.pose === 'frazzled' && o.outline === 'ink') o.outline = 'magenta';
    const ol = typeof o.outline === 'string' ? (OUTLINES[o.outline] || OUTLINES.ink) : o.outline;
    const pose = (POSES[o.pose] || POSES.back)(o);
    // eyelid colour = whatever coat colour surrounds the eye
    o._lid = o.pattern === 'mikan' ? o.coat.base : (o.pattern === 'pointed' ? o.coat.patch : o.coat.base);
    const G = { lw: o.lw, ol };
    let body = '';
    const tailG = pose.tail ? (() => {
      const f = tailFill(o), t = pose.tail, ov = [];
      if (o.pattern === 'tabby' || o.tail === 'ringed') t.rings.forEach((d) => ov.push({ d, fill: o.pattern === 'tabby' ? (o.coat.patch || mix(o.coat.base, C.ink, 0.42)) : mix(f, C.ink, 0.4) }));
      if ((o.pattern === 'bicolour' || o.pattern === 'tuxedo') && t.tipD) ov.push({ d: t.tipD, fill: o.coat.white });
      return celGroup({ parts: t.parts.map((p) => ({ d: p.d, fill: f })), overlays: ov, shade: o.tail === 'pom' && t.tip ? ell(t.tip[0] + 7, t.tip[1] + 5, 10, 9) : null }, G);
    })() : '';
    if (pose.tail && !pose.tail.over) body += tailG;
    pose.groups.forEach((g, i) => {
      const fill = o.coat.base;
      const overlays = patternOverlays(o, g.R || {}, pose.tail).map((v) => v.tr ? { d: v.d, fill: v.fill, tr: v.tr } : v);
      // overlays with their own transform are wrapped individually
      const flat = overlays.filter((v) => !v.tr), trd = overlays.filter((v) => v.tr);
      const gg = { parts: g.parts.map((p) => ({ d: p.d, fill: p.fill || fill })), overlays: flat, shade: g.shade, shadeAll: g.shadeAll, lines: g.lines, extra: g.extra };
      if (trd.length) { // bake transformed overlays as nested groups inside the clip via a custom overlay string
        gg.overlays = flat; gg._trd = trd;
      }
      body += celGroupT(gg, G);
      if (pose.tail && pose.tail.over && pose.tail.afterGroup === i) body += tailG;
    });
    if (pose.tail && pose.tail.over && pose.tail.afterGroup == null) body += tailG;
    // history + regalia
    const sc = o.scars || [];
    if (sc.includes('plaster') && pose.plaster) { const [px, py] = pose.plaster; body += `<g transform="translate(${r1(px)} ${r1(py)}) rotate(-18)">${inked('M-9 -3H9V3H-9Z', C.cream, 1.6)}${inked('M-3 -9H3V9H-3Z', C.cream, 1.6)}<path d="M-2.8 -2.8H2.8V2.8H-2.8Z" fill="${C.cream}"/></g>`; }
    if (o.collar === 'bell' && pose.collar) {
      const k = pose.collar;
      if (k.back) body += `<path d="${blob(k.back, false)}" fill="none" stroke="${C.ink}" stroke-width="${6.2 + o.lw * 0.9}" stroke-linecap="butt"/><path d="${blob(k.back, false)}" fill="none" stroke="${C.crimson}" stroke-width="5.4" stroke-linecap="butt"/>`;
      if (k.front) body += `<path d="${blob(k.front, false)}" fill="none" stroke="${C.ink}" stroke-width="${6.2 + o.lw * 0.9}"/><path d="${blob(k.front, false)}" fill="none" stroke="${C.crimson}" stroke-width="5.4"/>`;
      if (k.side) body += `<path d="M${r1(k.side[0][0])} ${r1(k.side[0][1])}Q${r1(k.side[0][0] + 1)} ${r1(k.side[1][1] - 4)} ${r1(k.side[1][0])} ${r1(k.side[1][1])}" fill="none" stroke="${C.ink}" stroke-width="${6.2 + o.lw * 0.9}"/><path d="M${r1(k.side[0][0])} ${r1(k.side[0][1])}Q${r1(k.side[0][0] + 1)} ${r1(k.side[1][1] - 4)} ${r1(k.side[1][0])} ${r1(k.side[1][1])}" fill="none" stroke="${C.crimson}" stroke-width="5.4"/>`;
      if (k.bell) body += `<g transform="translate(${r1(k.bell[0])} ${r1(k.bell[1])})"><circle r="5.6" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.6" vector-effect="non-scaling-stroke"/><path d="M-3.4 1.2H3.4M0 1.2V4.6" stroke="${C.ink}" stroke-width="1.25" fill="none" vector-effect="non-scaling-stroke"/><circle cx="-1.8" cy="-2" r="1.4" fill="${C.cream}"/></g>`;
    }
    if (o.collar === 'cord' && pose.cord) { const [cx, cy] = pose.cord; body += `<g transform="translate(${r1(cx)} ${r1(cy)})"><ellipse rx="7.5" ry="3.6" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="M4 2l5 7M6 1l8 4" stroke="${C.ink}" stroke-width="3.6" stroke-linecap="round"/><path d="M4 2l5 7M6 1l8 4" stroke="${C.gold}" stroke-width="1.8" stroke-linecap="round"/></g>`; }
    const sh = o.shadow ? shadow({ x: 0, y: -1, rx: (pose.w || 44) * 1.25, ry: 9 }) : '';
    return `<g class="k-cat" transform="translate(${o.x} ${o.y}) scale(${o.flip ? -o.scale : o.scale} ${o.scale})">${sh}${body}</g>`;
  }
  /** celGroup that also supports overlays carrying their own transform (head-local regions). */
  function celGroupT(g, G) {
    if (!g._trd) return celGroup(g, G);
    const extraOv = g._trd.map((v) => `<g transform="${v.tr}"><path d="${v.d}" fill="${v.fill}"/></g>`).join('');
    // inject by temporarily treating as raw overlay markup
    const id = uid('c'); const all = g.parts.map((p) => p.d).join(' ');
    const base = celGroup({ parts: g.parts }, G);
    const inner = (g.overlays || []).map((v) => `<path d="${v.d}" fill="${v.fill}"/>`).join('') + extraOv
      + (g.shade ? `<path d="${g.shade}" fill="${C.whiteShade}" style="mix-blend-mode:multiply"/>` : '')
      + (g.shadeAll ? `<path d="${all}" fill="${C.whiteShade}" style="mix-blend-mode:multiply"/>` : '');
    let s = base + `<clipPath id="${id}"><path d="${all}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
    if (g.lines) s += g.lines.map((d) => inkLine(d, Math.max(1.25, G.lw * 0.6), G.ol.ink)).join('');
    if (g.extra) s += g.extra;
    return s;
  }

  /** The recurring cast. Spread into cat(): Kit.cat({...Kit.CAST.mikan, pose:'back'}). */
  const CAST = {
    mikan: { coat: { base: COATS.white, patch: COATS.ginger }, pattern: 'mikan', tail: 'pom', ears: 'standard', build: 'standard', collar: 'bell', eye: 'amber' },
    daifuku: { coat: { base: COATS.white, patch: '#A9AEC0' }, pattern: 'saddle', tail: 'stub', ears: 'round', build: 'round', eye: 'copper', carry: 'anchor', expr: 'smug', scale: 1.6 },
    oldWallCat: { coat: { base: COATS.grey, patch: COATS.charcoal }, pattern: 'solid', tail: 'whip', ears: 'tall', build: 'long', scars: ['notch'], eye: 'yellowgreen', carry: 'anchor', expr: 'sleepy' },
    braggart: { coat: { base: COATS.cream, patch: '#D9A55E' }, pattern: 'tabby', tail: 'plume', ears: 'standard', build: 'standard', eye: 'green', carry: 'flag', expr: 'smug' },
    schemer: { coat: { base: COATS.black, white: COATS.white }, pattern: 'tuxedo', tail: 'whip', ears: 'tall', build: 'long', eye: 'yellowgreen', carry: 'blade', expr: 'smug', scars: ['kink'] },
    goofball: { coat: { base: COATS.white, patch: COATS.marmalade, patch2: COATS.charcoal }, pattern: 'patched', tail: 'plume', ears: 'round', build: 'round', eye: 'green', carry: 'spring', expr: 'happy', scars: ['fold'] },
    fraidy: { coat: { base: COATS.fawn, patch: COATS.seal }, pattern: 'pointed', tail: 'whip', ears: 'tall', build: 'long', eye: 'blue', carry: 'comma', expr: 'shock' },
    brooder: { coat: { base: COATS.chocolate, patch: '#4E3526' }, pattern: 'tabby', tail: 'ringed', ears: 'round', build: 'round', eye: 'copper', carry: 'anchor', expr: 'angry', scars: ['notch'] },
    stalwart: { coat: { base: COATS.silver, white: COATS.white }, pattern: 'bicolour', tail: 'stub', ears: 'standard', build: 'standard', eye: 'blue', carry: 'post', expr: 'neutral', scars: ['cowlick'] },
  };

  /* ------------------------------------------------------------------ humans, from cat height
   * Same units as the cats (a cat is ~100 tall, so a knee is ~150 and a hip ~285). Drawn from the
   * hip down plus one hanging hand: faces stay out of frame (art bible §5.5). */
  const HUMAN_PALETTES = {
    // street humans are "weather": muted lane colours, no signature hues
    street: { skin: '#F0C9A4', bottom: '#8E9A84', top: '#E9E2D2', sock: '#F4EFE3', shoe: '#8A6A54', sole: '#F1E7D2', bag: '#D9C9A0', accent: '#7F9A6A' },
    streetB: { skin: '#E8BF99', bottom: '#77819A', top: '#DCD7CC', sock: '#D8D2C2', shoe: '#5F5A66', sole: '#ECE4D4', bag: '#B9A98C', accent: '#9AA0B8' },
    haruUniform: { skin: '#F6D2B0', bottom: '#2F3E63', top: '#FFFDF4', sock: C.haru, shoe: '#5B3F33', sole: '#3C2B26', bag: '#3A486E', accent: C.haru },
    haruHome: { skin: '#F6D2B0', bottom: '#8FA7C9', top: '#FFFDF4', sock: C.haru, shoe: C.haru, sole: '#E9B92E', bag: '#FFFDF4', accent: C.haru },
    gran: { skin: '#E9C3A2', bottom: '#6E6470', top: '#8E4A7B', sock: '#F1E9DC', shoe: '#8A6048', sole: '#5A4034', bag: '#8E4A7B', accent: '#8E4A7B' },
  };
  /**
   * Draw a human as a cat sees them: legs, hem, shoes, and one hand. Origin = ground between the feet.
   * @param {object} o
   * @param {string} [o.pose='walk'] walk (side, mid-stride, facing right) | stand (front on) | reach (crouched hand offered low)
   * @param {object|string} [o.palette='street'] HUMAN_PALETTES key or {skin,bottom,top,sock,shoe,sole,bag,accent}
   * @param {string} [o.garment='skirt'] skirt | trousers | shorts
   * @param {string} [o.carry] bag | none   @param {number} [o.scale=1] @param {boolean} [o.flip]
   */
  function human(o) {
    o = Object.assign({ pose: 'walk', palette: 'street', garment: 'skirt', carry: 'bag', scale: 1, x: 0, y: 0, lw: 2.5, shadow: true }, o || {});
    const p = typeof o.palette === 'string' ? HUMAN_PALETTES[o.palette] : Object.assign({}, HUMAN_PALETTES.street, o.palette);
    const G = { lw: o.lw, ol: OUTLINES.ink };
    let s = '';
    const shoeSide = (ax, ay, rot) => { // ankle at ax,ay; toe to the right
      const pts = xf([[-17, -30], [-19, -12], [-15, -1], [10, 0], [34, 0], [45, -5], [43, -14], [28, -22], [12, -30], [4, -40], [-8, -42]], { r: rot || 0, x: ax, y: ay + 30 });
      const sole = xf([[-17, -6], [10, -5], [44, -7], [45, -2], [34, 1], [-14, 1]], { r: rot || 0, x: ax, y: ay + 30 });
      return { d: blob(pts), sole: blob(sole) };
    };
    const legSide = (hip, knee, ankle, far) => {
      const g = { parts: [], overlays: [], lines: [] };
      const thighW = 50, kneeW = 37, calfW = 39, ankW = 23;
      const legD = tube([hip, knee, [(knee[0] + ankle[0]) / 2 - 5, (knee[1] + ankle[1]) / 2], ankle], [thighW, kneeW, calfW, ankW], { capRound: 0.2 });
      const lean = Math.atan2(ankle[0] - knee[0], ankle[1] - knee[1]) * -180 / Math.PI;
      const sh = shoeSide(ankle[0], ankle[1] - 4, far ? Math.min(34, Math.max(0, lean * 0.9)) : Math.min(0, lean * 0.2));
      if (o.garment === 'trousers') {
        const tr = tube([hip, knee, [(knee[0] + ankle[0]) / 2 - 3, (knee[1] + ankle[1]) / 2], [ankle[0] - 1, ankle[1] - 14]], [58, 46, 44, 40], { capRound: 0.05 });
        g.parts.push({ d: legD, fill: p.sock }, { d: sh.d, fill: p.shoe }, { d: tr, fill: p.bottom });
        g.lines.push(blob([[knee[0] + 14, knee[1] - 6], [knee[0] + 2, knee[1] + 4], [knee[0] - 8, knee[1] + 2]], false));
      } else {
        const sockTop = [ankle[0] + (knee[0] - ankle[0]) * 0.36, ankle[1] + (knee[1] - ankle[1]) * 0.36];
        const sock = tube([sockTop, [(sockTop[0] + ankle[0]) / 2 - 2, (sockTop[1] + ankle[1]) / 2], ankle], [35, 30, 24], { capRound: 0.1 });
        g.parts.push({ d: legD, fill: p.skin }, { d: sock, fill: p.sock }, { d: sh.d, fill: p.shoe });
        if (o.garment === 'shorts') g.parts.push({ d: tube([hip, [hip[0] + (knee[0] - hip[0]) * 0.5, hip[1] + (knee[1] - hip[1]) * 0.5]], [62, 60], { capRound: 0.05 }), fill: p.bottom });
        g.lines.push(blob([[knee[0] + 13, knee[1] - 8], [knee[0] + 16, knee[1] + 2], [knee[0] + 11, knee[1] + 10]], false));
      }
      g.overlays.push({ d: sh.sole, fill: p.sole });
      if (far) g.shadeAll = true; else g.shade = tube([[hip[0] - 22, hip[1]], [knee[0] - 17, knee[1]], [(knee[0] + ankle[0]) / 2 - 22, (knee[1] + ankle[1]) / 2], [ankle[0] - 13, ankle[1]], [ankle[0] - 16, ankle[1] + 30]], 18);
      return celGroup(g, G);
    };
    if (o.pose === 'walk') {
      const hip = [0, -300];
      s += legSide([-6, -300], [-30, -168], [-78, -52], true);
      if (o.garment === 'skirt') { /* skirt drawn between the legs' layers below */ }
      s += legSide([8, -300], [40, -160], [44, -30], false);
      if (o.garment === 'skirt') {
        const sk = blob([[-44, -400], [-56, -300], [-74, -196], [-40, -186], [0, -190], [44, -184], [84, -196], [60, -300], [44, -400]]);
        s += celGroup({ parts: [{ d: sk, fill: p.bottom }], shade: blob([[-80, -420], [-50, -300], [-70, -180], [-30, -180], [-12, -300], [-16, -420]]) + blob([[20, -186], [28, -260], [36, -186]]), lines: [blob([[10, -196], [14, -250], [10, -310]], false), blob([[-36, -192], [-30, -240]], false), blob([[54, -192], [46, -250]], false)] }, G);
      } else {
        s += celGroup({ parts: [{ d: blob([[-40, -400], [-44, -300], [-36, -268], [0, -262], [44, -268], [52, -300], [44, -400]]), fill: p.bottom }], shade: blob([[-50, -410], [-48, -260], [-18, -262], [-14, -410]]) }, G);
      }
      // shirt hem
      s += celGroup({ parts: [{ d: blob([[-50, -470], [-54, -384], [-20, -374], [20, -372], [54, -380], [50, -470]]), fill: p.top }], shade: blob([[-60, -480], [-58, -370], [-22, -372], [-18, -480]]) }, G);
      if (o.carry === 'bag') s += handBag(p, G, 26, -292);
    } else if (o.pose === 'stand') {
      const leg = (sx) => {
        const g = { parts: [], overlays: [], lines: [] };
        const hip = [sx * 30, -300], knee = [sx * 29, -160], ank = [sx * 27, -34];
        const legD = tube([hip, knee, [ank[0], -96], ank], [50, 38, 39, 24], { capRound: 0.1 });
        const shoe = blob(xf([[-18, -30], [-21, -12], [-17, -1], [0, 1], [17, -1], [21, -12], [18, -30], [9, -40], [-9, -40]], { x: ank[0] + sx * 2, y: 0 }));
        if (o.garment === 'trousers') g.parts.push({ d: legD, fill: p.sock }, { d: shoe, fill: p.shoe }, { d: tube([hip, knee, [ank[0], -50]], [58, 47, 42], { capRound: 0.05 }), fill: p.bottom });
        else { g.parts.push({ d: legD, fill: p.skin }, { d: tube([[ank[0] + sx, -82], ank], [36, 25], { capRound: 0.1 }), fill: p.sock }, { d: shoe, fill: p.shoe }); g.lines.push(blob([[knee[0] - 9, knee[1] - 2], [knee[0], knee[1] + 5], [knee[0] + 9, knee[1] - 2]], false)); }
        g.overlays.push({ d: `M${ank[0] - 30} -7H${ank[0] + 30}V4H${ank[0] - 30}Z`, fill: p.sole }, { d: ell(ank[0] + sx * 2, -8, 13, 6), fill: mix(p.shoe, '#ffffff', 0.25) });
        g.shade = `M${ank[0] + 6} -420H${ank[0] + 40}V4H${ank[0] + 6}Z`;
        return celGroup(g, G);
      };
      s += leg(-1) + leg(1);
      if (o.garment === 'skirt') s += celGroup({ parts: [{ d: blob([[-52, -400], [-66, -300], [-80, -190], [-40, -182], [0, -186], [40, -182], [80, -190], [66, -300], [52, -400]]), fill: p.bottom }], shade: blob([[30, -410], [40, -300], [44, -180], [90, -180], [70, -410]]), lines: [blob([[-22, -190], [-18, -250]], false), blob([[24, -190], [20, -260]], false)] }, G);
      else s += celGroup({ parts: [{ d: blob([[-56, -400], [-60, -300], [-52, -262], [0, -256], [52, -262], [60, -300], [56, -400]]), fill: p.bottom }], shade: blob([[26, -410], [30, -256], [70, -256], [64, -410]]), lines: ['M0 -258V-300'] }, G);
      s += celGroup({ parts: [{ d: blob([[-58, -470], [-62, -384], [-24, -374], [24, -374], [62, -384], [58, -470]]), fill: p.top }], shade: blob([[28, -480], [30, -370], [70, -370], [66, -480]]) }, G);
      if (o.carry === 'bag') s += handBag(p, G, 78, -292);
    } else { // reach: a crouching knee, a forearm and an open hand at cat-nose height
      s += celGroup({ parts: [{ d: blob([[-150, -330], [-160, -200], [-140, -60], [-110, -8], [-60, -4], [-40, -60], [-20, -150], [-10, -250], [-40, -330]]), fill: p.bottom }], shade: blob([[-170, -340], [-166, -60], [-120, 0], [-112, -120], [-120, -340]]) }, G);
      s += celGroup({ parts: [{ d: blob(xf([[-17, -30], [-19, -12], [-15, -1], [10, 0], [34, 0], [45, -5], [43, -14], [28, -22], [12, -30], [4, -40], [-8, -42]], { x: -84, y: 0 })), fill: p.shoe }], overlays: [{ d: 'M-110 -7H-30V3H-110Z', fill: p.sole }] }, G);
      const arm = tube([[-40, -300], [0, -200], [44, -120]], [42, 34, 26], { capRound: 0.2 });
      const sleeve = tube([[-46, -314], [-14, -232]], [56, 50], { capRound: 0.1 });
      const hand = blob([[34, -128], [50, -112], [78, -96], [104, -88], [112, -80], [100, -74], [74, -76], [86, -66], [82, -58], [62, -62], [42, -74], [28, -96], [26, -116]]);
      const thumb = blob([[50, -116], [70, -122], [88, -116], [86, -106], [68, -104], [54, -104]]);
      s += celGroup({ parts: [{ d: arm, fill: p.skin }, { d: hand, fill: p.skin }], shade: blob([[30, -100], [50, -72], [84, -56], [60, -50], [20, -80]]), lines: [blob([[74, -76], [60, -80]], false), blob([[86, -84], [104, -82]], false)] }, G);
      s += celGroup({ parts: [{ d: thumb, fill: p.skin }] }, G) + celGroup({ parts: [{ d: sleeve, fill: p.top }] }, G);
    }
    const sh = o.shadow ? shadow({ x: -10, y: -2, rx: 120, ry: 20 }) : '';
    return `<g class="k-human" transform="translate(${o.x} ${o.y}) scale(${o.flip ? -o.scale : o.scale} ${o.scale})">${sh}${s}</g>`;
  }
  function handBag(p, G, hx, hy) { // a hanging forearm, a fist on tote handles, a leek poking out
    let s = '';
    const bag = blob([[hx - 44, hy + 60], [hx - 52, hy + 150], [hx - 40, hy + 196], [hx + 44, hy + 198], [hx + 58, hy + 150], [hx + 50, hy + 60]]);
    s += inked(blob([[hx - 20, hy + 70], [hx - 34, hy - 20], [hx - 22, hy - 78, 1], [hx - 8, hy - 16], [hx - 2, hy + 70]]), '#8DB86E', 2.5) + inked(blob([[hx + 2, hy + 70], [hx + 6, hy], [hx + 26, hy - 50, 1], [hx + 22, hy + 6], [hx + 20, hy + 70]]), '#EDEFD8', 2.5);
    s += inkLine(`M${hx - 30} ${hy + 64}Q${hx - 16} ${hy + 6} ${hx - 4} ${hy + 8}M${hx + 34} ${hy + 64}Q${hx + 18} ${hy + 6} ${hx + 6} ${hy + 8}`, 7, C.ink) + inkLine(`M${hx - 30} ${hy + 64}Q${hx - 16} ${hy + 6} ${hx - 4} ${hy + 8}M${hx + 34} ${hy + 64}Q${hx + 18} ${hy + 6} ${hx + 6} ${hy + 8}`, 3, p.accent);
    s += celGroup({ parts: [{ d: bag, fill: p.bag }], shade: blob([[hx + 14, hy + 50], [hx + 22, hy + 150], [hx + 12, hy + 204], [hx + 70, hy + 204], [hx + 70, hy + 50]]), overlays: [{ d: `M${hx - 60} ${hy + 104}H${hx + 70}V${hy + 122}H${hx - 60}Z`, fill: p.accent }] }, G);
    const arm = tube([[hx - 6, hy - 190], [hx - 2, hy - 90], [hx + 1, hy - 14]], [40, 32, 25], { capRound: 0.2 });
    const fist = blob([[hx - 15, hy - 20], [hx - 18, hy], [hx - 13, hy + 16], [hx + 2, hy + 21], [hx + 15, hy + 14], [hx + 18, hy - 2], [hx + 13, hy - 20]]);
    s += celGroup({ parts: [{ d: arm, fill: p.skin }, { d: fist, fill: p.skin }], shade: `M${hx + 5} ${hy - 200}H${hx + 40}V${hy + 30}H${hx + 5}Z`, lines: [`M${hx - 9} ${hy + 6}Q${hx} ${hy + 10} ${hx + 11} ${hy + 5}`, `M${hx - 4} ${hy + 14}V${hy + 20}M${hx + 5} ${hy + 14}V${hy + 20}`] }, G);
    return s;
  }

  /* ------------------------------------------------------------------ painted world (never inked) */
  /** Shared <defs>: paint filters. Put Kit.defs() once at the top of every <svg>. */
  function defs() {
    const disp = (id, f, oct, sc, seed, blur) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="${oct}" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${sc}" xChannelSelector="R" yChannelSelector="G"${blur ? ' result="d"' : ''}/>${blur ? `<feGaussianBlur in="d" stdDeviation="${blur}"/>` : ''}</filter>`;
    return `<defs>
      ${disp('k-rough', 0.022, 2, 6, 3)}${disp('k-wobble', 0.008, 2, 14, 5)}
      ${disp('k-leaf', 0.038, 2, 26, 7)}${disp('k-leaf-fine', 0.075, 2, 13, 11)}${disp('k-leaf-far', 0.02, 2, 16, 4, 0.8)}
      ${disp('k-cloud', 0.0075, 3, 46, 9, 1.1)}${disp('k-cloud-fine', 0.02, 2, 16, 2, 0.6)}
      ${disp('k-dab', 0.05, 1, 5, 13)}
      <filter id="k-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="k-soft2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
      <filter id="k-soft3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="42"/></filter>
      <filter id="k-contact" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>
      <filter id="k-grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="21"/><feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0 0.5  0.9 0.5 0 0 -0.52"/></filter>
      <filter id="k-brush" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 0.43  0 0 0 0 0.41  0 0 0 0 0.66  1.5 0 0 0 -0.62"/></filter>
      <filter id="k-brush-v" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.07 0.005" numOctaves="3" seed="18"/><feColorMatrix values="0 0 0 0 0.43  0 0 0 0 0.41  0 0 0 0 0.66  1.5 0 0 0 -0.62"/></filter>
      <filter id="k-mottle" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="31"/><feColorMatrix values="0 0 0 0 0.43  0 0 0 0 0.41  0 0 0 0 0.66  1.6 0 0 0 -0.7"/></filter>
      <filter id="k-mottle-light" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="44"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 0.9  0 1.7 0 0 -0.78"/></filter>
      <filter id="k-dry" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
    </defs>`;
  }
  /** Wrap content in a full <svg>. */
  function svg(w, h, content, attrs) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ${attrs || ''}>${defs()}${content}</svg>`; }
  const clipTo = (d, content) => { const id = uid('p'); return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${content}</g>`; };
  const polyD = (pts) => 'M' + pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'Z';
  const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); const x = Math.min(...xs), y = Math.min(...ys); return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }; };
  /** Paint-texture overlay rectangle. kind: grain | brush | brush-v | mottle | mottle-light. */
  function texture(x, y, w, h, kind, opacity) {
    const light = kind === 'mottle-light';
    return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" filter="url(#k-${kind || 'grain'})" opacity="${opacity == null ? 0.5 : opacity}" style="mix-blend-mode:${light ? 'screen' : 'multiply'}"/>`;
  }
  /** Soft contact shadow blob (E-4): Shadow Wisteria at 45%. */
  function shadow(o) { o = Object.assign({ x: 0, y: 0, rx: 50, ry: 10, opacity: 0.45 }, o); return `<ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" fill="${C.wisteria}" opacity="${o.opacity}" filter="url(#k-contact)" style="mix-blend-mode:multiply"/>`; }
  /** A coloured cast shadow painted over the ground/walls (path d). Never grey. */
  function castShadow(d, opacity, soft) { return `<path d="${d}" fill="${C.wisteria}" opacity="${opacity == null ? 0.42 : opacity}" filter="url(#k-${soft || 'soft'})" style="mix-blend-mode:multiply"/>`; }
  /** A soft pool of warm light (sun patch, lamp glow). */
  function glow(x, y, rx, ry, color, opacity) { return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color || '#FFF3C4'}" opacity="${opacity == null ? 0.5 : opacity}" filter="url(#k-soft3)" style="mix-blend-mode:screen"/>`; }

  const PHASES = {
    morning: { zenith: '#BFE3F2', horizon: '#FFE9C7', key: '#FFF4DC', shadow: '#8FA0CF' },
    day: { zenith: '#3F9BE6', horizon: '#A9DBF5', key: '#FFFBEF', shadow: '#6E6AA8' },
    dusk: { zenith: '#8E6FB0', horizon: '#F7A45A', key: '#FFC27A', shadow: '#7A4E8C' },
    night: { zenith: '#1F2F6B', horizon: '#3F5FB0', key: '#BFD4FF', shadow: '#2A3470' },
  };
  /** Soft-gradient sky. o: {x,y,w,h,phase|zenith,horizon} */
  function sky(o) {
    o = Object.assign({ x: 0, y: 0, w: 1920, h: 600, phase: 'day' }, o); const P = PHASES[o.phase] || PHASES.day; const id = uid('g');
    const z = o.zenith || P.zenith, hz = o.horizon || P.horizon;
    return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(z, '#1E5FC0', 0.18)}"/><stop offset="0.42" stop-color="${z}"/><stop offset="0.8" stop-color="${mix(z, hz, 0.72)}"/><stop offset="1" stop-color="${hz}"/></linearGradient>`
      + `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="url(#${id})"/>` + texture(o.x, o.y, o.w, o.h, 'brush', 0.1);
  }
  /** Towering cumulus. o: {x (centre), y (base line), w, h, seed, shade, far}. */
  function cloud(o) {
    o = Object.assign({ x: 0, y: 0, w: 400, h: 300, seed: 1, shade: C.cloudShade, light: '#FFFFFF' }, o);
    const R = rng(o.seed * 97 + 5), puffs = [];
    const n = Math.round(16 + o.w / 26);
    for (let i = 0; i < n; i++) {
      const u = R() * 2 - 1; // -1..1 across
      const lobe = 0.55 + 0.45 * Math.cos(u * 2.2 + o.seed) * Math.cos(u * 5.1 + o.seed * 1.7);
      const prof = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 1.7)), 0.7) * (0.55 + 0.45 * lobe);
      const v = Math.pow(R(), 0.75) * prof;
      const r = (0.11 + R() * 0.12) * o.w * (0.65 + 0.5 * prof) * (1 - v * 0.42);
      puffs.push([o.x + u * o.w * 0.44, o.y - r * 0.55 - v * o.h * 0.86, r]);
    }
    puffs.sort((a, b) => b[1] - a[1]);
    const circ = (dx, dy, k, fill, sel) => puffs.filter(sel || (() => true)).map((p) => `<circle cx="${r1(p[0] + dx)}" cy="${r1(p[1] + dy)}" r="${r1(p[2] * k)}" fill="${fill}"/>`).join('');
    const base = `M${o.x - o.w}  ${o.y}H${o.x + o.w}V${o.y - o.h * 2}H${o.x - o.w}Z`;
    const mid = mix(o.shade, o.light, 0.5);
    let inner = `<g filter="url(#k-cloud)">${circ(0, 0, 1, o.shade)}</g>`
      + `<g filter="url(#k-cloud)">${circ(-o.w * 0.022, -o.h * 0.05, 0.9, o.light)}</g>`
      + `<g filter="url(#k-cloud-fine)">${circ(o.w * 0.03, o.h * 0.035, 0.5, mid, (p, i) => i % 3 === 0)}${circ(-o.w * 0.012, -o.h * 0.01, 0.44, o.light, (p, i) => i % 3 === 0)}</g>`
      + `<rect x="${o.x - o.w}" y="${o.y - o.h * 0.2}" width="${o.w * 2}" height="${o.h * 0.26}" fill="${mix(o.shade, C.skyHorizon, 0.6)}" opacity="0.75" filter="url(#k-soft2)"/>`;
    return `<g class="k-cloud" opacity="${o.opacity || 1}">${clipTo(base, inner)}</g>`;
  }
  const GREENS = { dark: '#2F6E4A', mid: '#5A9E4B', light: '#8DC65C', hi: '#CFE585', far: '#6FA98C' };
  /** Gouache foliage clump. o: {x,y (centre), w,h, seed, tones{dark,mid,light,hi}, far, dabs} */
  function foliage(o) {
    o = Object.assign({ x: 0, y: 0, w: 300, h: 200, seed: 1, dabs: true, density: 1 }, o);
    const T = Object.assign({}, GREENS, o.tones || {}), R = rng(o.seed * 131 + 17);
    const n = Math.round((9 + (o.w * o.h) / 9000) * o.density), cs = [];
    for (let i = 0; i < n; i++) {
      const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * 0.82;
      const r = (0.16 + R() * 0.16) * Math.min(o.w, o.h) * (1.1 - rr * 0.45);
      cs.push([o.x + Math.cos(a) * rr * o.w / 2, o.y + Math.sin(a) * rr * o.h / 2, r]);
    }
    const f = o.far ? 'k-leaf-far' : 'k-leaf';
    const c = (list, dx, dy, k, fill) => list.map((p) => `<circle cx="${r1(p[0] + dx)}" cy="${r1(p[1] + dy)}" r="${r1(p[2] * k)}" fill="${fill}"/>`).join('');
    const top = cs.filter((p) => p[1] < o.y + o.h * 0.12), hi = cs.filter((p, i) => p[1] < o.y - o.h * 0.02 && i % 2 === 0);
    let s = `<g filter="url(#${f})">${c(cs, 0, 0, 1, T.dark)}</g>`
      + `<g filter="url(#${f})">${c(cs, -o.w * 0.025, -o.h * 0.07, 0.8, T.mid)}</g>`
      + `<g filter="url(#${o.far ? f : 'k-leaf-fine'})">${c(top, -o.w * 0.045, -o.h * 0.13, 0.5, T.light)}</g>`;
    if (!o.far) s += `<g filter="url(#k-leaf-fine)">${c(hi, -o.w * 0.06, -o.h * 0.18, 0.22, T.hi)}</g>`;
    if (o.dabs && !o.far) { // crisp leaf dabs: light on the sunward rim, dark tucked below
      let d = '';
      for (let i = 0; i < n * 5; i++) {
        const p = cs[Math.floor(R() * cs.length)], a = R() * Math.PI * 2, rad = p[2] * (0.5 + R() * 0.62);
        const x = p[0] + Math.cos(a) * rad, y = p[1] + Math.sin(a) * rad, up = Math.sin(a) < 0.1 && Math.cos(a) < 0.5;
        const sz = 5 + R() * 7; const col = up ? (R() < 0.35 ? T.hi : T.light) : (R() < 0.5 ? T.dark : T.mid);
        d += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(sz)}" ry="${r1(sz * 0.52)}" fill="${col}" transform="rotate(${Math.round(R() * 180)} ${r1(x)} ${r1(y)})"/>`;
      }
      s += `<g filter="url(#k-dab)">${d}</g>`;
    }
    return `<g class="k-foliage">${s}</g>`;
  }
  /** Hydrangea / flower clusters: {x,y,w,h,seed,color} */
  function flowers(o) {
    o = Object.assign({ x: 0, y: 0, w: 200, h: 90, seed: 1, color: C.hydrangea, n: 6 }, o); const R = rng(o.seed * 53 + 3);
    let s = foliage({ x: o.x, y: o.y + o.h * 0.1, w: o.w, h: o.h, seed: o.seed + 9, tones: { dark: '#2F6E4A', mid: '#4C8F4A', light: '#79B556', hi: '#A8D06A' } });
    let f = '';
    for (let i = 0; i < o.n; i++) {
      const x = o.x + (R() - 0.5) * o.w * 0.86, y = o.y + (R() - 0.62) * o.h * 0.7, r = (0.13 + R() * 0.08) * o.h + 8;
      f += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${mix(o.color, C.wisteria, 0.45)}"/><circle cx="${r1(x - r * 0.12)}" cy="${r1(y - r * 0.16)}" r="${r1(r * 0.82)}" fill="${o.color}"/>`;
      for (let k = 0; k < 7; k++) { const a = R() * 6.28, q = R() * r * 0.6; f += `<circle cx="${r1(x - r * 0.15 + Math.cos(a) * q)}" cy="${r1(y - r * 0.22 + Math.sin(a) * q)}" r="${r1(r * 0.17)}" fill="${mix(o.color, '#FFFFFF', 0.45 + R() * 0.3)}"/>`; }
    }
    return s + `<g filter="url(#k-dab)">${f}</g>`;
  }
  /** Grass tufts along a line: {x1,y1,x2,y2,n,h,seed} */
  function grass(o) {
    o = Object.assign({ n: 18, h: 26, seed: 1 }, o); const R = rng(o.seed * 71 + 9); let s = '';
    for (let i = 0; i < o.n; i++) {
      const t = R(), x = o.x1 + (o.x2 - o.x1) * t, y = o.y1 + (o.y2 - o.y1) * t, k = (0.5 + R() * 0.8) * (o.scaleAt ? o.scaleAt(t) : 1);
      const col = [GREENS.dark, GREENS.mid, GREENS.light, '#A9D46A'][Math.floor(R() * 4)];
      for (let b = 0; b < 4; b++) { const lean = (R() - 0.5) * 22 * k, hh = o.h * k * (0.55 + R() * 0.6), wd = 3.2 * k + 1.5; const bx = x + (b - 1.5) * 4 * k; s += `<path d="M${r1(bx - wd)} ${r1(y)}Q${r1(bx + lean * 0.3)} ${r1(y - hh * 0.6)} ${r1(bx + lean)} ${r1(y - hh)}Q${r1(bx + lean * 0.5 + wd)} ${r1(y - hh * 0.5)} ${r1(bx + wd)} ${r1(y)}Z" fill="${col}"/>`; }
    }
    return `<g class="k-grass">${s}</g>`;
  }
  /** Painted surface: any polygon, gradient-lit, mottled, grime at the foot. o: {pts, color, top, bottom, grime, tex, wobble} */
  function surface(o) {
    o = Object.assign({ color: C.plaster, tex: 'mottle', texOpacity: 0.3, grime: 0.3, wobble: true }, o);
    const d = o.d || polyD(o.pts), b = o.pts ? bbox(o.pts) : o.box, id = uid('g');
    const top = o.top || mix(o.color, '#FFFFFF', 0.25), bot = o.bottom || mix(o.color, '#C9A27A', 0.24);
    let inner = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${b.y}" x2="0" y2="${b.y + b.h}"><stop offset="0" stop-color="${top}"/><stop offset="0.5" stop-color="${o.color}"/><stop offset="1" stop-color="${bot}"/></linearGradient><rect x="${b.x - 20}" y="${b.y - 20}" width="${b.w + 40}" height="${b.h + 40}" fill="url(#${id})"/>`;
    if (o.grime) inner += `<rect x="${b.x - 20}" y="${b.y + b.h * 0.72}" width="${b.w + 40}" height="${b.h * 0.4}" fill="${mix(C.wisteria, '#7A6A50', 0.45)}" opacity="${o.grime}" filter="url(#k-soft2)" style="mix-blend-mode:multiply"/>`;
    inner += texture(b.x - 20, b.y - 20, b.w + 40, b.h + 40, o.tex, o.texOpacity) + texture(b.x - 20, b.y - 20, b.w + 40, b.h + 40, 'mottle-light', 0.35) + texture(b.x - 20, b.y - 20, b.w + 40, b.h + 40, 'grain', 0.16);
    if (o.inner) inner += o.inner;
    return `<g class="k-surface"${o.wobble ? ' filter="url(#k-rough)"' : ''}>${clipTo(d, inner)}</g>`;
  }
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  /** Point inside a quad [tl,tr,br,bl] at u (along), v (down). Lets helpers follow perspective. */
  const quadPt = (q, u, v) => lerp(lerp(q[0], q[1], u), lerp(q[3], q[2], u), v);
  /** Plaster garden wall with a coping ribbon (the High Road reads as a pale ribbon). o: {quad:[tl,tr,br,bl], color, coping, lit} */
  function wall(o) {
    o = Object.assign({ color: C.plaster, coping: true, copingH: 0.07, base: true }, o); const q = o.quad;
    let s = surface({ pts: q, color: o.color, top: o.top, bottom: o.bottom, grime: o.grime == null ? 0.34 : o.grime, inner: o.inner });
    if (o.base) { const a = quadPt(q, 0, 0.9), b = quadPt(q, 1, 0.9); s += surface({ pts: [a, b, q[2], q[3]], color: mix(o.color, '#9A8C86', 0.5), grime: 0.2, texOpacity: 0.4 }); }
    if (o.coping) {
      const h = o.copingH, a = quadPt(q, 0, -h * 0.9), b = quadPt(q, 1, -h * 0.9), c = quadPt(q, 1, h * 0.6), d = quadPt(q, 0, h * 0.6);
      const ov = 0.012; const a2 = quadPt(q, -ov, -h * 0.9), b2 = quadPt(q, 1 + ov, -h * 0.9), c2 = quadPt(q, 1 + ov, h * 0.6), d2 = quadPt(q, -ov, h * 0.6);
      s += `<path d="${polyD([quadPt(q, 0, h * 0.6), quadPt(q, 1, h * 0.6), quadPt(q, 1, h * 2.1), quadPt(q, 0, h * 2.1)])}" fill="${C.wisteria}" opacity="0.3" filter="url(#k-soft)" style="mix-blend-mode:multiply"/>`;
      s += surface({ pts: [a2, b2, c2, d2], color: o.copingColor || '#8E9AA8', top: '#B9C4CE', bottom: '#66707F', grime: 0, texOpacity: 0.35 });
      s += `<path d="${polyD([a2, b2, quadPt(q, 1 + ov, -h * 0.55), quadPt(q, -ov, -h * 0.55)])}" fill="#EEF3F2" opacity="0.9" filter="url(#k-rough)"/>`;
    }
    return `<g class="k-wall">${s}</g>`;
  }
  /** Board fence in a quad. o: {quad, n (boards), color, rail} */
  function fence(o) {
    o = Object.assign({ n: 12, color: C.wood, rail: true, seed: 2, gap: 0.08 }, o); const q = o.quad, R = rng(o.seed * 11 + 1); let s = '';
    for (let i = 0; i < o.n; i++) {
      const u0 = i / o.n + o.gap / o.n / 2, u1 = (i + 1) / o.n - o.gap / o.n / 2, dv = (R() - 0.5) * 0.04;
      const col = mix(mix(o.color, '#8A5A34', R() * 0.3), '#F0C58A', R() * 0.22);
      const pts = [quadPt(q, u0, dv), quadPt(q, u1, dv), quadPt(q, u1, 1), quadPt(q, u0, 1)];
      s += `<path d="${polyD(pts)}" fill="${col}"/><path d="${polyD([quadPt(q, u0, dv), quadPt(q, u0 + (u1 - u0) * 0.16, dv), quadPt(q, u0 + (u1 - u0) * 0.16, 1), quadPt(q, u0, 1)])}" fill="#FFE2B0" opacity="0.4"/><path d="${polyD([quadPt(q, u1 - (u1 - u0) * 0.14, dv), quadPt(q, u1, dv), quadPt(q, u1, 1), quadPt(q, u1 - (u1 - u0) * 0.14, 1)])}" fill="#6B4630" opacity="0.32"/>`;
    }
    const back = `<path d="${polyD([quadPt(q, 0, 0.03), quadPt(q, 1, 0.03), q[2], q[3]])}" fill="#5C4034"/>`;
    let rails = '';
    if (o.rail) [0.2, 0.74].forEach((v) => { rails += `<path d="${polyD([quadPt(q, 0, v), quadPt(q, 1, v), quadPt(q, 1, v + 0.075), quadPt(q, 0, v + 0.075)])}" fill="${mix(o.color, '#7A5236', 0.35)}"/><path d="${polyD([quadPt(q, 0, v), quadPt(q, 1, v), quadPt(q, 1, v + 0.02), quadPt(q, 0, v + 0.02)])}" fill="#F3CB95" opacity="0.7"/><path d="${polyD([quadPt(q, 0, v + 0.075), quadPt(q, 1, v + 0.075), quadPt(q, 1, v + 0.12), quadPt(q, 0, v + 0.12)])}" fill="${C.wisteria}" opacity="0.35" style="mix-blend-mode:multiply"/>`; });
    const b = bbox(q);
    const tex = clipTo(polyD([quadPt(q, 0, -0.05), quadPt(q, 1, -0.05), q[2], q[3]]), texture(b.x, b.y - 30, b.w, b.h + 60, 'brush-v', 0.42) + texture(b.x, b.y - 30, b.w, b.h + 60, 'grain', 0.2) + `<rect x="${b.x}" y="${b.y + b.h * 0.78}" width="${b.w}" height="${b.h * 0.3}" fill="${C.wisteria}" opacity="0.3" filter="url(#k-soft2)" style="mix-blend-mode:multiply"/>`);
    return `<g class="k-fence" filter="url(#k-rough)">${back}${s}${rails}${tex}</g>`;
  }
  /** Tiled roof plane in a quad (ridge = top edge). o: {quad, rows, cols, color} */
  function roof(o) {
    o = Object.assign({ rows: 7, cols: 18, color: C.roof }, o); const q = o.quad; let s = `<path d="${polyD(q)}" fill="${o.color}"/>`;
    for (let r = 0; r < o.rows; r++) {
      const v0 = r / o.rows, v1 = (r + 1) / o.rows;
      s += `<path d="${polyD([quadPt(q, 0, v1 - 0.045), quadPt(q, 1, v1 - 0.045), quadPt(q, 1, v1), quadPt(q, 0, v1)])}" fill="#4F5F74" opacity="0.55"/>`;
      s += `<path d="${polyD([quadPt(q, 0, v0), quadPt(q, 1, v0), quadPt(q, 1, v0 + 0.03), quadPt(q, 0, v0 + 0.03)])}" fill="#B6C4D2" opacity="0.5"/>`;
      for (let c = 0; c < o.cols; c++) { const u = (c + (r % 2 ? 0.5 : 0)) / o.cols; if (u > 1) continue; const a = quadPt(q, u, v0), b = quadPt(q, u, v1); s += `<path d="M${r1(a[0])} ${r1(a[1])}L${r1(b[0])} ${r1(b[1])}" stroke="#4F5F74" stroke-width="2" opacity="0.4"/><path d="M${r1(a[0] + 3)} ${r1(a[1])}L${r1(b[0] + 3)} ${r1(b[1])}" stroke="#C9D5E0" stroke-width="2" opacity="0.35"/>`; }
    }
    const b = bbox(q);
    s += texture(b.x, b.y, b.w, b.h, 'mottle', 0.35) + texture(b.x, b.y, b.w, b.h, 'mottle-light', 0.4);
    const ridge = `<path d="${polyD([quadPt(q, -0.01, -0.07), quadPt(q, 1.01, -0.07), quadPt(q, 1.01, 0.03), quadPt(q, -0.01, 0.03)])}" fill="#5A6B80"/><path d="${polyD([quadPt(q, -0.01, -0.07), quadPt(q, 1.01, -0.07), quadPt(q, 1.01, -0.035), quadPt(q, -0.01, -0.035)])}" fill="#C4D0DB"/>`;
    return `<g class="k-roof" filter="url(#k-rough)">${clipTo(polyD(q), s)}${ridge}</g>`;
  }
  /** Sun-baked lane ground: polygon with a far->near gradient, worn patches, pebbles. o: {pts, color, seed, horizonY} */
  function ground(o) {
    o = Object.assign({ color: C.lane, seed: 4 }, o); const b = bbox(o.pts), id = uid('g'), R = rng(o.seed * 7 + 3);
    let inner = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${b.y}" x2="0" y2="${b.y + b.h}"><stop offset="0" stop-color="${mix(o.color, '#F3E7C8', 0.55)}"/><stop offset="0.4" stop-color="${mix(o.color, '#E8D9B8', 0.3)}"/><stop offset="1" stop-color="${mix(o.color, '#A8946F', 0.2)}"/></linearGradient><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="url(#${id})"/>`;
    inner += texture(b.x, b.y, b.w, b.h, 'brush', 0.4) + texture(b.x, b.y, b.w, b.h, 'mottle', 0.3) + texture(b.x, b.y, b.w, b.h, 'mottle-light', 0.5) + texture(b.x, b.y, b.w, b.h, 'grain', 0.22);
    let peb = '';
    for (let i = 0; i < 70; i++) { const t = Math.pow(R(), 0.6), y = b.y + t * b.h, x = b.x + R() * b.w, k = 0.25 + t * 1.1; peb += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1((3 + R() * 9) * k)}" ry="${r1((1.2 + R() * 2.4) * k)}" fill="${R() < 0.5 ? '#8F8470' : '#E9DFC6'}" opacity="${r1(0.25 + R() * 0.3)}"/>`; }
    return `<g class="k-ground">${clipTo(polyD(o.pts), inner + peb)}</g>`;
  }
  /** Painted utility pole with a crooked transformer and insulators. o: {x, y (foot), h, w} */
  function pole(o) {
    o = Object.assign({ x: 0, y: 0, h: 800, w: 30 }, o); const { x, y, h, w } = o;
    const col = '#8B8076', lit = '#C9BCA6', dk = '#5E5868';
    let s = `<path d="M${x - w / 2} ${y}L${x - w * 0.36} ${y - h}H${x + w * 0.36}L${x + w / 2} ${y}Z" fill="${col}"/><path d="M${x - w / 2} ${y}L${x - w * 0.36} ${y - h}H${x - w * 0.1}L${x - w * 0.14} ${y}Z" fill="${lit}"/><path d="M${x + w * 0.2} ${y}L${x + w * 0.16} ${y - h}H${x + w * 0.36}L${x + w / 2} ${y}Z" fill="${dk}" opacity="0.7"/>`;
    const arm = (yy, len) => `<rect x="${x - len / 2}" y="${yy}" width="${len}" height="${w * 0.32}" fill="${col}"/><rect x="${x - len / 2}" y="${yy}" width="${len}" height="${w * 0.1}" fill="${lit}"/>` + [-0.46, -0.2, 0.2, 0.46].map((k) => `<rect x="${x + k * len - w * 0.09}" y="${yy - w * 0.42}" width="${w * 0.18}" height="${w * 0.44}" rx="${w * 0.06}" fill="#E9E4D6"/>`).join('');
    s += arm(y - h * 0.94, w * 5.4) + arm(y - h * 0.83, w * 4.2);
    s += `<g transform="rotate(-5 ${x} ${y - h * 0.66})"><rect x="${x + w * 0.4}" y="${y - h * 0.74}" width="${w * 1.5}" height="${w * 2.3}" rx="${w * 0.3}" fill="#8996A4"/><rect x="${x + w * 0.4}" y="${y - h * 0.74}" width="${w * 0.5}" height="${w * 2.3}" rx="${w * 0.25}" fill="#C3CDD6"/><rect x="${x + w * 1.4}" y="${y - h * 0.74}" width="${w * 0.5}" height="${w * 2.3}" rx="${w * 0.25}" fill="#5F6B7E"/></g>`;
    const b = { x: x - w * 3, y: y - h, w: w * 6, h };
    return `<g class="k-pole" filter="url(#k-rough)">${s}</g>` + clipTo(`M${x - w / 2} ${y}L${x - w * 0.36} ${y - h}H${x + w * 0.36}L${x + w / 2} ${y}Z`, texture(b.x, b.y, b.w, b.h, 'brush-v', 0.4));
  }
  /** Sagging wires between points. o: {pts:[[x,y],...], sag, color, width} */
  function wires(o) {
    o = Object.assign({ sag: 30, color: '#4A4560', width: 2 }, o); let d = '';
    for (let i = 0; i < o.pts.length - 1; i++) { const a = o.pts[i], b = o.pts[i + 1]; d += `M${a[0]} ${a[1]}Q${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 + o.sag} ${b[0]} ${b[1]}`; }
    return `<path d="${d}" fill="none" stroke="${o.color}" stroke-width="${o.width}" opacity="${o.opacity || 0.8}" stroke-linecap="round"/>`;
  }
  /** Sea band with horizon haze and glitter. o: {x,y,w,h} */
  function sea(o) {
    o = Object.assign({ x: 0, y: 0, w: 600, h: 60, seed: 3 }, o); const id = uid('g'), R = rng(o.seed);
    let s = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0EC"/><stop offset="0.25" stop-color="#3FA2D8"/><stop offset="1" stop-color="#2B7FC2"/></linearGradient><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="url(#${id})"/>`;
    for (let i = 0; i < o.w / 9; i++) { const t = R(), y = o.y + 3 + t * (o.h - 4), x = o.x + R() * o.w, l = 8 + R() * 36 * (0.4 + t); s += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(l)}" height="${r1(1.2 + t * 2)}" rx="1" fill="#FFFFFF" opacity="${r1(0.35 + R() * 0.5)}"/>`; }
    return `<g class="k-sea">${s}</g>`;
  }
  /** Far hill / headland silhouette with painted tree texture. o: {pts (ridge line, left to right), baseY, color} */
  function hill(o) {
    o = Object.assign({ color: '#5F9F88', seed: 2 }, o); const R = rng(o.seed * 13);
    const pts = [...o.pts, [o.pts[o.pts.length - 1][0], o.baseY], [o.pts[0][0], o.baseY]];
    const d = blob(o.pts, false) + `L${o.pts[o.pts.length - 1][0]} ${o.baseY}L${o.pts[0][0]} ${o.baseY}Z`;
    const b = bbox(pts); let dabs = '';
    for (let i = 0; i < b.w / 6; i++) { const x = b.x + R() * b.w, y = b.y + R() * b.h, r = 8 + R() * 16; dabs += `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${R() < 0.5 ? mix(o.color, '#2F6E6A', 0.35) : mix(o.color, '#CFE8B0', 0.3)}" opacity="0.6"/>`; }
    return `<g class="k-hill" filter="url(#k-leaf-far)">${clipTo(d, `<path d="${d}" fill="${o.color}"/>${dabs}<rect x="${b.x}" y="${b.y + b.h * 0.6}" width="${b.w}" height="${b.h * 0.5}" fill="${C.skyHorizon}" opacity="0.5" filter="url(#k-soft2)"/>`)}</g>`;
  }

  /* ------------------------------------------------------------------ inked props */
  /** Scent Post: stone lantern (hero landmark prop, inked). Origin at ground centre, ~260 tall at scale 1. */
  function stoneLantern(o) {
    o = Object.assign({ x: 0, y: 0, scale: 1, lw: 2.5 }, o); const G = { lw: o.lw, ol: OUTLINES.ink };
    const st = '#B9B5B0', moss = '#8FB36A';
    const parts = [
      { d: blob([[-46, 0], [-50, -14], [-40, -22], [40, -22], [50, -14], [46, 0]], true, 0.5), fill: st }, // base
      { d: blob([[-17, -20], [-15, -70], [-19, -122], [19, -122], [15, -70], [17, -20]], true, 0.6), fill: st }, // shaft
      { d: blob([[-42, -120], [-48, -132], [-40, -142], [40, -142], [48, -132], [42, -120]], true, 0.5), fill: st }, // platform
      { d: blob([[-30, -140], [-32, -196], [32, -196], [30, -140]], true, 0.3), fill: st }, // fire box
      { d: blob([[-66, -190], [-72, -200, 1], [-44, -218], [-18, -236], [0, -240], [18, -236], [44, -218], [72, -200, 1], [66, -190]], true, 0.6), fill: st }, // roof
      { d: blob([[-9, -238], [-12, -252], [0, -268, 1], [12, -252], [9, -238]], true, 0.7), fill: st }, // jewel
    ];
    const g = celGroup({
      parts,
      overlays: [{ d: blob([[-70, -200], [-40, -222], [-10, -238], [6, -232], [-20, -212], [-50, -196]]), fill: moss }, { d: ell(-30, -18, 22, 7), fill: moss }, { d: ell(22, -143, 20, 5), fill: moss },
        { d: 'M-17 -184H17V-150H-17Z', fill: '#5B5566' }, { d: 'M-17 -184H17V-176H-17Z', fill: '#463F52' }],
      shade: 'M6 -300H100V10H6Z' + 'M-60 -196H60V-186H-60Z' + 'M-40 -122H40V-110H-40Z',
      lines: ['M-17 -184H17V-150H-17Z', 'M-48 -132H48', 'M-50 -14H50'],
    }, G);
    return `<g class="k-prop" transform="translate(${o.x} ${o.y}) scale(${o.scale})">${shadow({ x: 6, y: 0, rx: 70, ry: 12 })}${g}</g>`;
  }
  /** Knock-off prop: flowerpot | bucket. Inked because a cat can act on it. */
  function prop(o) {
    o = Object.assign({ kind: 'pot', x: 0, y: 0, scale: 1, lw: 2.5 }, o); const G = { lw: o.lw, ol: OUTLINES.ink }; let g = '';
    if (o.kind === 'bucket') g = celGroup({ parts: [{ d: blob([[-30, -56], [-24, -4], [-16, 0], [16, 0], [24, -4], [30, -56]], true, 0.4), fill: '#7FB2D9' }, { d: ell(0, -56, 31, 8), fill: '#A9D2EE' }], shade: 'M6 -80H60V10H6Z', lines: ['M-27 -34Q0 -28 27 -34'] }, G) + inkLine('M-30 -56Q0 -100 30 -56', 2);
    else g = inked(blob([[-10, -40], [-30, -74], [-14, -62], [-4, -92, 1], [6, -62], [28, -80], [12, -40]]), '#6FAE55', o.lw) + celGroup({ parts: [{ d: blob([[-24, -40], [-18, -3], [-12, 0], [12, 0], [18, -3], [24, -40]], true, 0.4), fill: '#C9764A' }, { d: blob([[-28, -46], [-28, -36], [28, -36], [28, -46]], true, 0.4), fill: '#D98A5C' }], shade: 'M5 -60H50V10H5Z' }, G);
    return `<g class="k-prop" transform="translate(${o.x} ${o.y}) scale(${o.scale})">${shadow({ x: 4, y: 0, rx: 36, ry: 7 })}${g}</g>`;
  }

  /* ------------------------------------------------------------------ VFX drawings (inked, flat, hard-edged) */
  /** Claw slash arc: three tapering crescents, Ice Cyan edge, pale core, Ink keystroke on the outer edge. */
  function slashArc(o) {
    o = Object.assign({ x: 0, y: 0, r: 120, a0: -150, a1: -20, thick: 16, color: C.claw, core: C.clawCore, count: 3 }, o);
    let s = '';
    for (let k = 0; k < o.count; k++) {
      const r = o.r - k * o.thick * 1.25, a0 = (o.a0 + k * 7) * Math.PI / 180, a1 = (o.a1 - k * 4) * Math.PI / 180, out = [], inn = [], n = 22;
      for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + (a1 - a0) * t; const th = o.thick * (1 - k * 0.14) * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.75)), 0.8); out.push([o.x + Math.cos(a) * r, o.y + Math.sin(a) * r]); inn.push([o.x + Math.cos(a) * (r - th), o.y + Math.sin(a) * (r - th)]); }
      const d = 'M' + out.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'L' + inn.reverse().map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'Z';
      const key = 'M' + out.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L');
      s += `<path d="${d}" fill="${o.core}" stroke="${o.color}" stroke-width="3.5" stroke-linejoin="round"/><path d="${key}" fill="none" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    return `<g class="k-vfx">${s}</g>`;
  }
  /** Speed / focus lines: Ink wedges of uneven length. mode: 'parallel' (in a box, along angle) | 'radial' (converging, centre clear). */
  function speedLines(o) {
    o = Object.assign({ mode: 'parallel', x: 0, y: 0, w: 400, h: 200, angle: 0, count: 14, color: C.ink, seed: 1, inner: 0.45 }, o); const R = rng(o.seed * 19 + 2); let s = '';
    if (o.mode === 'radial') {
      const cx = o.x + o.w / 2, cy = o.y + o.h / 2, rad = Math.hypot(o.w, o.h) / 2;
      for (let i = 0; i < o.count; i++) { const a = (i + R() * 0.7) / o.count * Math.PI * 2, r0 = rad * (o.inner + R() * 0.25), wd = 0.012 + R() * 0.03; s += `<path d="M${r1(cx + Math.cos(a) * r0)} ${r1(cy + Math.sin(a) * r0 * o.h / o.w)}L${r1(cx + Math.cos(a - wd) * rad * 1.1)} ${r1(cy + Math.sin(a - wd) * rad * 1.1)}L${r1(cx + Math.cos(a + wd) * rad * 1.1)} ${r1(cy + Math.sin(a + wd) * rad * 1.1)}Z" fill="${o.color}"/>`; }
      return `<g class="k-vfx">${clipTo(`M${o.x} ${o.y}h${o.w}v${o.h}h${-o.w}Z`, s)}</g>`;
    }
    for (let i = 0; i < o.count; i++) { const y = (i + 0.2 + R() * 0.6) / o.count * o.h, len = o.w * (0.35 + R() * 0.65), x0 = R() * (o.w - len) * 0.4, th = 2 + R() * 7; s += `<path d="M${r1(x0)} ${r1(y)}L${r1(x0 + len)} ${r1(y - th / 2)}L${r1(x0 + len)} ${r1(y + th / 2)}Z" fill="${o.color}"/>`; }
    return `<g class="k-vfx" transform="translate(${o.x} ${o.y}) rotate(${o.angle})">${s}</g>`;
  }
  /** Impact burst: zigzag star, Paper Cream with an Ink line, optional colour underprint and Ink four-point star (Thump). */
  function impactBurst(o) {
    o = Object.assign({ x: 0, y: 0, r: 90, points: 11, color: null, star: false, seed: 1, inner: 0.56 }, o); const R = rng(o.seed * 23 + 5), pts = [];
    for (let i = 0; i < o.points * 2; i++) { const a = i / (o.points * 2) * Math.PI * 2, rr = o.r * (i % 2 ? o.inner * (0.85 + R() * 0.3) : 0.8 + R() * 0.35); pts.push([o.x + Math.cos(a) * rr, o.y + Math.sin(a) * rr]); }
    const d = polyD(pts); let s = '';
    if (o.color) s += `<path d="${d}" fill="${o.color}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round" transform="translate(7 7)"/>`;
    s += `<path d="${d}" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    if (o.star) s += sparkle({ x: o.x, y: o.y, r: o.r * 0.42, fill: C.ink, stroke: 'none' });
    return `<g class="k-vfx">${s}</g>`;
  }
  /** Four-point sparkle / star. */
  function sparkle(o) {
    o = Object.assign({ x: 0, y: 0, r: 14, fill: C.cream, stroke: C.ink, pinch: 0.22 }, o); const r = o.r, k = r * o.pinch;
    return `<path d="M${o.x} ${o.y - r}Q${o.x + k} ${o.y - k} ${o.x + r} ${o.y}Q${o.x + k} ${o.y + k} ${o.x} ${o.y + r}Q${o.x - k} ${o.y + k} ${o.x - r} ${o.y}Q${o.x - k} ${o.y - k} ${o.x} ${o.y - r}Z" fill="${o.fill}" stroke="${o.stroke}" stroke-width="${o.lw || 2}" stroke-linejoin="round"/>`;
  }
  /** Scalloped dust cloud (the Pile-On cloud at large sizes): Paper Cream, lavender shade, heavy Ink line. */
  function dustCloud(o) {
    o = Object.assign({ x: 0, y: 0, r: 60, puffs: 5, seed: 1, lw: 3 }, o); const R = rng(o.seed * 29 + 1), parts = [];
    for (let i = 0; i < o.puffs; i++) { const a = i / o.puffs * Math.PI * 2 + R() * 0.5, d = i === 0 ? 0 : o.r * (0.45 + R() * 0.25), rr = o.r * (i === 0 ? 0.78 : 0.42 + R() * 0.22); parts.push({ d: blob(pomPts(o.x + Math.cos(a) * d, o.y + Math.sin(a) * d * 0.7, rr, 8, 0.1, R() * 3)), fill: C.cream }); }
    return `<g class="k-vfx">${celGroup({ parts, shade: blob(pomPts(o.x - o.r * 0.14, o.y - o.r * 0.2, o.r * 1.5, 9, 0.08)) + `M${o.x - o.r * 3} ${o.y - o.r * 3}h${o.r * 6}v${o.r * 6}h${-o.r * 6}Z`.replace(/^/, '') }, { lw: o.lw, ol: OUTLINES.ink }).replace(`fill="${C.whiteShade}" style`, `fill-rule="evenodd" fill="${C.whiteShade}" style`)}</g>`;
  }
  /** Scent wisps hanging above a Scent Post: 1-4 slow curling ribbons, Clowder colour, Cream rim, no glow. */
  function scentWisps(o) {
    o = Object.assign({ x: 0, y: 0, count: 3, color: C.sage, h: 120, seed: 1, rim: C.cream }, o); const R = rng(o.seed * 31 + 7); let s = '';
    for (let i = 0; i < o.count; i++) {
      const bx = o.x + (i - (o.count - 1) / 2) * o.h * 0.3, h = o.h * (0.72 + R() * 0.45), dir = i % 2 ? 1 : -1, a = h * 0.16;
      const pts = [[bx, o.y], [bx + dir * a, o.y - h * 0.22], [bx - dir * a * 0.9, o.y - h * 0.48], [bx + dir * a * 0.9, o.y - h * 0.74], [bx + dir * a * 0.2, o.y - h * 0.98], [bx - dir * a * 0.95, o.y - h * 0.95], [bx - dir * a * 0.75, o.y - h * 0.8], [bx - dir * a * 0.2, o.y - h * 0.82]];
      const d = tube(pts, (t) => (2 + 9 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (0.75 + 0.25 * Math.sin(t * 9))) * o.h / 120, { per: 7 });
      s += `<path d="${d}" fill="${o.color}" stroke="${o.rim}" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/>`;
    }
    return `<g class="k-vfx">${s}</g>`;
  }
  /** Ribbon along points (Head Home thread, Tag-In streak, Whisker Sense trail): colour with Cream rim. */
  function ribbon(o) {
    o = Object.assign({ pts: [[0, 0], [100, 0]], color: C.gold, width: 8, rim: C.cream, taper: true }, o);
    const d = tube(o.pts, o.taper ? (t) => o.width * (0.35 + 0.65 * Math.sin(Math.PI * (0.08 + t * 0.84))) * (typeof o.grow === 'function' ? o.grow(t) : 1) : o.width, { per: 8 });
    return `<path class="k-vfx" d="${d}" fill="${o.color}" stroke="${o.rim}" stroke-width="${o.rimW || 4}" stroke-linejoin="round" paint-order="stroke"/>`;
  }
  /** Hand-lettered sound word (T4/T5): Cream fill, Ink outline, offset second print, letters growing along the hit. */
  function sfx(o) {
    o = Object.assign({ text: 'WHAM', x: 0, y: 0, size: 130, rot: -10, color: C.ink, grow: 1.4, seed: 1 }, o); const R = rng(o.seed * 37 + 11);
    const n = o.text.length; let x = 0; const glyphs = [];
    for (let i = 0; i < n; i++) { const k = 1 + (o.grow - 1) * (n > 1 ? i / (n - 1) : 0), fs = o.size * k / ((1 + o.grow) / 2), dy = (R() - 0.5) * o.size * 0.14, rot = (R() - 0.5) * 14; glyphs.push({ ch: o.text[i], x, fs, dy, rot }); x += fs * (o.text[i] === 'I' ? 0.42 : o.text[i] === '-' ? 0.5 : 0.74); }
    const layer = (fill, stroke, sw, dx, dy) => glyphs.map((g) => `<text x="${r1(g.x + dx)}" y="${r1(g.dy + dy)}" font-size="${r1(g.fs)}" transform="rotate(${r1(g.rot)} ${r1(g.x + dx + g.fs * 0.35)} ${r1(g.dy + dy - g.fs * 0.3)})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke">${g.ch}</text>`).join('');
    const off = o.size * 0.045;
    return `<g class="k-vfx k-sfx" transform="translate(${o.x} ${o.y}) rotate(${o.rot}) translate(${-x / 2} 0)" font-family="'Dela Gothic One','M PLUS Rounded 1c',sans-serif" filter="url(#k-dry)">${layer(o.color, C.ink, o.size * 0.06, off, off)}${layer(C.cream, C.ink, o.size * 0.085, 0, 0)}</g>`;
  }
  /** Frazzled orbit: Static Yellow squiggles and stars circling a head. */
  function frazzleOrbit(o) {
    o = Object.assign({ x: 0, y: 0, r: 60 }, o); let s = `<ellipse cx="${o.x}" cy="${o.y}" rx="${o.r}" ry="${o.r * 0.3}" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="3 9" opacity="0.6"/>`;
    [0.3, 2.4, 4.4].forEach((a) => { const x = o.x + Math.cos(a) * o.r, y = o.y + Math.sin(a) * o.r * 0.3; s += `<path d="M${x - 12} ${y}l6 -7l6 7l6 -7l6 7" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x - 12} ${y}l6 -7l6 7l6 -7l6 7" fill="none" stroke="${C.staticYellow}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`; });
    [1.4, 3.5].forEach((a) => { s += sparkle({ x: o.x + Math.cos(a) * o.r, y: o.y + Math.sin(a) * o.r * 0.3, r: 11, fill: C.staticYellow }); });
    return `<g class="k-vfx">${s}</g>`;
  }
  /** Small motion ticks (tail quiver, startle). */
  function ticks(o) {
    o = Object.assign({ x: 0, y: 0, r: 26, n: 3, a0: -150, a1: -30, len: 10, color: C.ink, lw: 2.5 }, o); let d = '';
    for (let i = 0; i < o.n; i++) { const a = (o.a0 + (o.a1 - o.a0) * (o.n === 1 ? 0.5 : i / (o.n - 1))) * Math.PI / 180; d += `M${r1(o.x + Math.cos(a) * o.r)} ${r1(o.y + Math.sin(a) * o.r)}L${r1(o.x + Math.cos(a) * (o.r + o.len))} ${r1(o.y + Math.sin(a) * (o.r + o.len))}`; }
    return `<path class="k-vfx" d="${d}" fill="none" stroke="${o.color}" stroke-width="${o.lw}" stroke-linecap="round"/>`;
  }
  /** Telegraph ground decal: white (dodge) | yellow (Hiss it) | red (get out). Ellipse on the ground. */
  function telegraph(o) {
    o = Object.assign({ kind: 'white', x: 0, y: 0, rx: 120, ry: 40 }, o); const id = uid('h');
    if (o.kind === 'yellow') return `<ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" fill="none" stroke="${C.ink}" stroke-width="8" stroke-dasharray="26 16"/><ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" fill="none" stroke="${C.cream}" stroke-width="5" stroke-dasharray="26 16"/>`;
    if (o.kind === 'red') { const pts = []; for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2, k = i % 2 ? 1 : 0.88; pts.push([o.x + Math.cos(a) * o.rx * k, o.y + Math.sin(a) * o.ry * k]); } return `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="${C.magenta}"/><rect width="3" height="14" fill="${C.ink}"/></pattern><path d="${polyD(pts)}" fill="url(#${id})" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`; }
    return `<pattern id="${id}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.7" fill="#fff"/></pattern><ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" fill="url(#${id})" stroke="${C.ink}" stroke-width="3"/>`;
  }

  /* ------------------------------------------------------------------ UI drawings (SVG strings; boxes live in kit.css) */
  const ui = {
    /** Phase dial: a sun (or moon) pom travelling over a Lane roofline. No digits. o: {phase, t 0..1, size} */
    phaseDial(o) {
      o = Object.assign({ phase: 'day', t: 0.5, size: 150 }, o); const w = 200, h = 128, night = o.phase === 'night';
      const a = Math.PI * (1 - o.t), sx = 100 + Math.cos(a) * 66, sy = 92 - Math.sin(a) * 58;
      const skyc = { morning: '#CFE9F2', day: '#9FD3F2', dusk: '#F5B27A', night: '#3F5FB0' }[o.phase] || '#9FD3F2';
      const roofs = 'M14 128V92l14 -10l14 10v-8l22 -16l22 16v10l12 -8l16 12v-18l20 -14l20 14v14l14 -10l18 14V128Z';
      const body = blob([[16, 66], [22, 28], [60, 10], [104, 6], [150, 12], [182, 34], [188, 72], [180, 108], [150, 122], [100, 124], [48, 122], [20, 106]]);
      const id = uid('d');
      return `<svg class="k-dial" viewBox="0 0 200 128" width="${o.size}" height="${o.size * h / w}" overflow="visible"><path d="${body}" fill="${C.wisteria}" opacity="0.55" transform="translate(3 4)"/><clipPath id="${id}"><path d="${body}"/></clipPath><path d="${body}" fill="${skyc}"/><g clip-path="url(#${id})"><path d="M34 92A66 58 0 0 1 166 92" fill="none" stroke="${C.cream}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`
        + (night ? `<circle cx="${r1(sx)}" cy="${r1(sy)}" r="15" fill="#EAF0FF" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${r1(sx + 6)}" cy="${r1(sy - 4)}" r="11" fill="${skyc}"/>` : `<path d="${blob(pomPts(sx, sy, 22, 9, 0.2))}" fill="${C.cream}" opacity="0.9"/><circle cx="${r1(sx)}" cy="${r1(sy)}" r="14" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${r1(sx - 4)}" cy="${r1(sy - 5)}" r="4" fill="${C.cream}"/>`)
        + `<path d="${roofs}" fill="${C.cocoa}"/><path d="M64 96h10v10h-10zM142 94h10v10h-10z" fill="${night || o.phase === 'dusk' ? C.lamp : mix(C.cocoa, C.cream, 0.25)}"/></g><path d="${body}" fill="none" stroke="${C.cocoa}" stroke-width="5" stroke-linejoin="round"/></svg>`;
    },
    /** Paw-pad pictogram (Paws / cursor / Head Home). */
    paw(o) { o = Object.assign({ size: 40, fill: C.pad, stroke: C.ink }, o); return `<svg viewBox="-22 -22 44 44" width="${o.size}" height="${o.size}" overflow="visible"><g stroke="${o.stroke}" stroke-width="2.5" fill="${o.fill}" stroke-linejoin="round"><path d="${blob([[-11, 12], [-13, 3], [-6, -3], [0, -5], [6, -3], [13, 3], [11, 12], [4, 10], [0, 12], [-4, 10]])}"/><ellipse cx="-13" cy="-7" rx="4.6" ry="6" transform="rotate(-24 -13 -7)"/><ellipse cx="-4.6" cy="-14" rx="4.6" ry="6.2" transform="rotate(-8 -4.6 -14)"/><ellipse cx="4.6" cy="-14" rx="4.6" ry="6.2" transform="rotate(8 4.6 -14)"/><ellipse cx="13" cy="-7" rx="4.6" ry="6" transform="rotate(24 13 -7)"/></g></svg>`; },
    /** Face-button diamond with one button lit (default north), for prompts. */
    faceButtons(o) { o = Object.assign({ size: 56, lit: 'n' }, o); const P = { n: [0, -13], e: [13, 0], s: [0, 13], w: [-13, 0] }; return `<svg viewBox="-26 -26 52 52" width="${o.size}" height="${o.size}"><circle r="24" fill="${C.cream}" stroke="${C.cocoa}" stroke-width="3"/>${Object.keys(P).map((k) => `<circle cx="${P[k][0]}" cy="${P[k][1]}" r="${k === o.lit ? 7.5 : 5.4}" fill="${k === o.lit ? C.gold : C.recessed}" stroke="${k === o.lit ? C.ink : C.cocoa}" stroke-width="${k === o.lit ? 2.5 : 1.5}"/>`).join('')}</svg>`; },
    /** D-pad with one direction lit. */
    dpad(o) { o = Object.assign({ size: 56, lit: 's' }, o); const R = { n: 0, e: 90, s: 180, w: 270 }; return `<svg viewBox="-26 -26 52 52" width="${o.size}" height="${o.size}"><circle r="24" fill="${C.cream}" stroke="${C.cocoa}" stroke-width="3"/><path d="M-6 -17h12v11h11v12h-11v11h-12v-11h-11v-12h11z" fill="${C.recessed}" stroke="${C.cocoa}" stroke-width="2" stroke-linejoin="round"/><g transform="rotate(${R[o.lit]})"><path d="M-6 -17h12v11l-6 5l-6 -5z" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/></g></svg>`; },
    /** Verb pictograms for world prompts: spray | sniff | nap | bell | brick (Wall Sitters emblem) | fish | heart. */
    icon(o) {
      o = Object.assign({ name: 'spray', size: 48, color: C.gold }, o); let g = '';
      const st = `stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
      if (o.name === 'spray') g = `<path d="${blob(pomPts(0, 2, 15, 7, 0.16))}" fill="${o.color}" ${st}/>` + sparkle({ x: 13, y: -13, r: 8, lw: 2 }) + sparkle({ x: -15, y: -10, r: 5, lw: 2 });
      else if (o.name === 'sniff') g = `<path d="M-12 -6Q0 -12 12 -6Q8 10 0 12Q-8 10 -12 -6Z" fill="${C.pad}" ${st}/><path d="M-18 14q4 -6 8 0M10 14q4 -6 8 0" fill="none" ${st}/>`;
      else if (o.name === 'nap') g = `<path d="M-16 -4h13l-13 16h13" fill="none" ${st}/><path d="M4 -16h10l-10 12h10" fill="none" ${st}/>`;
      else if (o.name === 'bell') g = `<circle r="15" fill="${C.gold}" ${st}/><path d="M-9 3H9M0 3V12" fill="none" ${st}/><circle cx="-5" cy="-6" r="3.4" fill="${C.cream}"/>`;
      else if (o.name === 'brick') g = `<path d="M-17 -12h34v24h-34z" fill="${C.sage}" ${st}/><path d="M-17 0h34M0 -12v12M-8 0v12M9 0v12" fill="none" ${st}/>`;
      else if (o.name === 'fish') g = `<path d="M-16 0Q-4 -13 8 0Q-4 13 -16 0ZM8 0l10 -9v18z" fill="${C.fish}" ${st}/><circle cx="-8" cy="-2" r="1.8" fill="${C.ink}"/>`;
      else if (o.name === 'heart') g = `<path d="M0 14Q-18 0 -15 -9Q-11 -17 0 -7Q11 -17 15 -9Q18 0 0 14Z" fill="${C.crimson}" ${st}/>`;
      else if (o.name === 'storm') g = `<path d="${blob(pomPts(0, -4, 14, 6, 0.14))}" fill="${C.ink}"/><path d="M-2 4l-6 10h6l-3 8l10 -12h-6l4 -6z" fill="${C.staticYellow}" ${st}/>`;
      return `<svg viewBox="-24 -24 48 48" width="${o.size}" height="${o.size}" overflow="visible">${g}</svg>`;
    },
    /** A wisp glyph row for the Patch tag (1-4 = scent strength). */
    wispRow(o) { o = Object.assign({ n: 2, max: 4, color: C.sage, size: 34 }, o); let s = ''; for (let i = 0; i < o.max; i++) s += `<path d="M${10 + i * 22} 30q-9 -8 0 -14q9 -6 1 -13" fill="none" stroke="${C.ink}" stroke-width="8.5" stroke-linecap="round" opacity="${i < o.n ? 1 : 0.25}"/><path d="M${10 + i * 22} 30q-9 -8 0 -14q9 -6 1 -13" fill="none" stroke="${i < o.n ? o.color : C.recessed}" stroke-width="5" stroke-linecap="round"/>`; return `<svg viewBox="0 0 ${o.max * 22} 34" height="${o.size}" width="${o.size * o.max * 22 / 34}">${s}</svg>`; },
    /** Chestnut portrait window with a cat inside. o: {cat: cat() options, size, ring} */
    portrait(o) {
      o = Object.assign({ size: 120, ring: C.cocoa, bg: C.recessed }, o); const id = uid('q');
      const shape = blob([[-44, 30], [-48, 4], [-40, -20], [-30, -34], [-34, -50, 1], [-14, -40], [0, -42], [14, -40], [34, -50, 1], [30, -34], [40, -20], [48, 4], [44, 30], [24, 44], [0, 47], [-24, 44]]);
      return `<svg viewBox="-54 -56 108 108" width="${o.size}" height="${o.size}" overflow="visible"><path d="${shape}" fill="${C.wisteria}" opacity="0.5" transform="translate(3 4)"/><clipPath id="${id}"><path d="${shape}"/></clipPath><path d="${shape}" fill="${o.bg}"/><g clip-path="url(#${id})">${cat(Object.assign({ pose: 'front-sit', shadow: false, scale: 1.02, y: 92, lw: 2 }, o.cat))}</g><path d="${shape}" fill="none" stroke="${o.ring}" stroke-width="5" stroke-linejoin="round"/></svg>`;
    },
  };

  const Kit = { C, COATS, EYES, CAST, PHASES, HUMAN_PALETTES, GREENS, OUTLINES,
    mix, shade, rng, blob, tube, xf, ell, pomPts, polyD, quadPt, inked, inkLine, celGroup, clipTo,
    defs, svg, cat, human, stoneLantern, prop,
    sky, cloud, foliage, flowers, grass, surface, wall, fence, roof, ground, pole, wires, sea, hill, shadow, castShadow, glow, texture,
    slashArc, speedLines, impactBurst, sparkle, dustCloud, scentWisps, ribbon, sfx, frazzleOrbit, ticks, telegraph, ui };
  if (typeof module !== 'undefined' && module.exports) module.exports = Kit;
  root.Kit = Kit;
})(typeof window !== 'undefined' ? window : globalThis);

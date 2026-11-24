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
    const all = g.parts.map((p) => p.d).join(' ');
    const st = (w, col) => `<path d="${all}" fill="none" stroke="${col}" stroke-width="${r1(w * 2)}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
    let s = '';
    const keyW = ol.key ? (ol.keyW || 2) : 0, rimW = ol.rim ? 1.2 : 0;
    if (ol.rim) s += st(lw + keyW + rimW, ol.rim);
    if (ol.key) s += st(lw + keyW, ol.key);
    s += st(lw, ol.ink);
    // fills live INSIDE the clip group: a clip-path isolates blending, so the multiply shade needs its base in the same group
    const fills = g.parts.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`).join('');
    const pth = (v, fill) => `<path d="${v.d}" fill="${fill}"${v.tr ? ` transform="${v.tr}"` : ''}${v.evenodd ? ' fill-rule="evenodd"' : ''}/>`;
    let inner = (g.overlays || []).map((v) => pth(v, v.fill)).join('');
    const sh = g.shade ? (typeof g.shade === 'string' ? { d: g.shade } : g.shade) : null;
    if (sh || g.shadeAll) inner += `<g style="mix-blend-mode:multiply">${sh ? pth(sh, C.whiteShade) : ''}${g.shadeAll ? g.parts.map((p) => `<path d="${p.d}" fill="${C.whiteShade}"/>`).join('') : ''}</g>`;
    s += inner ? `<clipPath id="${id}">${g.parts.map((p) => `<path d="${p.d}"/>`).join('')}</clipPath><g clip-path="url(#${id})">${fills}${inner}</g>` : fills;
    if (g.lines) s += g.lines.map((d) => `<path d="${d}" fill="none" stroke="${ol.ink}" stroke-width="${r1(Math.max(1.25, lw * 0.6))}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`).join('');
    if (g.extra) s += g.extra;
    return s;
  }
  const inkLine = (d, w, col) => `<path d="${d}" fill="none" stroke="${col || C.ink}" stroke-width="${w || 1.5}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
  const inked = (d, fill, w, col) => `<path d="${d}" fill="${fill}" stroke="${col || C.ink}" stroke-width="${w || 2.5}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;

  /* ------------------------------------------------------------------ cat parts */
  const BUILD = { round: { bx: 1.2, by: 1.1, leg: 0.86, head: 1.06 }, standard: { bx: 1, by: 1, leg: 1, head: 1 }, long: { bx: 0.88, by: 0.94, leg: 1.22, head: 0.93 } };

  /* Tail carriage = personality (art bible §3.3). Curves leave the rump at 0,0; y up is negative. */
  const CARRY_SIDE = { // tail streams to the LEFT of a cat facing right
    flag: [[0, 0], [-10, -20], [-12, -48], [-8, -72], [4, -84], [14, -80]],
    post: [[0, 0], [-8, -24], [-9, -52], [-9, -82]],
    spring: [[0, 0], [-12, -20], [-10, -46], [-22, -62], [-34, -54], [-30, -42]],
    blade: [[0, 0], [-22, -4], [-46, -2], [-70, -6]],
    anchor: [[0, 0], [-14, 10], [-22, 26], [-34, 34], [-48, 32]],
    comma: [[0, 0], [-10, 8], [-10, 24], [0, 32], [10, 28]],
    level: [[0, 0], [-20, -8], [-42, -4], [-60, -16]],
  };
  const CARRY_BACK = { // seen from behind: each carriage must leave the body silhouette differently
    flag: [[0, 0], [-16, -12], [-34, -34], [-43, -64], [-41, -92], [-28, -104]],
    post: [[0, 0], [9, -18], [15, -46], [16, -88]],
    spring: [[0, 0], [16, -10], [34, -28], [46, -54], [44, -78], [31, -82], [30, -68]],
    blade: [[0, 0], [-22, -5], [-46, -3], [-70, -9]],
    anchor: [[0, 0], [12, 9], [30, 13], [48, 10], [60, 1]],
    comma: [[0, 0], [-12, 8], [-28, 12], [-39, 5], [-37, -6]],
    level: [[0, 0], [-16, -10], [-36, -12], [-54, -22]],
  };
  function tailParts(o, bx, by, dir, view, ptsAbs) {
    let pts, type = o.tail;
    if (ptsAbs) pts = ptsAbs.map((p) => [p[0], p[1]]);
    else {
      const K = view === 'back' ? CARRY_BACK : CARRY_SIDE;
      pts = (K[o.carry] || K.level).map((p) => [bx + p[0] * (dir < 0 ? 1 : -1), by + p[1]]);
    }
    let w, len = 1;
    if (type === 'plume') w = view === 'back' ? [8, 12, 15, 14, 9] : [10, 17, 21, 19, 11];
    else if (type === 'ringed') w = [14, 15, 15, 14, 12];
    else if (type === 'stub') { len = 0.36; w = [15, 14, 12]; }
    else if (type === 'pom') { len = ptsAbs ? 1 : (view === 'back' ? 0.1 : 0.2); w = [10, 10]; }
    else w = [10, 9, 8, 7, 5.5]; // whip
    if (len < 1) { const S = sampleCR(pts, 6); const keep = Math.max(2, Math.round(S.length * len)); pts = [S[0], S[Math.floor(keep / 2)], S[keep]].map((p) => [p[0], p[1]]); }
    const sc = o.scars || [];
    if (sc.includes('kink') && pts.length >= 4) { // one lightning bend
      const m = Math.floor(pts.length / 2) + 1; const a = pts[m - 1], b = pts[m];
      pts.splice(m, 0, [a[0] + (b[0] - a[0]) * 0.5 + (b[1] - a[1]) * 0.7, a[1] + (b[1] - a[1]) * 0.5 - (b[0] - a[0]) * 0.7, 1]);
    }
    const puff = sc.includes('puff') || o._puff;
    const out = { parts: [], rings: [] };
    if (type === 'pom') {
      const e = pts[pts.length - 1];
      out.parts.push({ d: blob(pomPts(e[0], e[1] - 2, 13, 7, 0.13, 0.3)) });
      out.tip = e; out.pom = true;
    } else {
      const wd = w.map((v) => puff ? Math.min(v * 1.45, 21) : v);
      out.parts.push({ d: tube(pts, wd, { zig: puff ? 3.4 : 0, per: puff ? 5 : 8 }) });
      const S = sampleCR(pts, 8);
      for (let i = 4; i < S.length - 1; i += 6) { // ring bands as fat cross-strokes, clipped to the tail
        const a = S[i - 1], b = S[i + 1]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
        const nx = -dy / l * 20, ny = dx / l * 20, tx = dx / l * 2.8, ty = dy / l * 2.8;
        out.rings.push(`M${r1(S[i][0] + nx - tx)} ${r1(S[i][1] + ny - ty)}L${r1(S[i][0] - nx - tx)} ${r1(S[i][1] - ny - ty)}L${r1(S[i][0] - nx + tx)} ${r1(S[i][1] - ny + ty)}L${r1(S[i][0] + nx + tx)} ${r1(S[i][1] + ny + ty)}Z`);
      }
      const e = S[S.length - 1], q = S[Math.max(0, S.length - 6)];
      out.tipD = ell(e[0] + (e[0] - q[0]) * 0.2, e[1] + (e[1] - q[1]) * 0.2, 15, 15);
      out.tip = e;
    }
    return out;
  }

  function earPts(type, side) { // left ear in head-local coords (head top ~ y=-23, half-width ~29); side=+1 mirrors
    let p;
    if (type === 'tall') p = [[-28, -8], [-30, -28], [-26, -47, 1], [-15, -31], [-6, -19]];
    else if (type === 'round') p = [[-28, -8], [-31, -22], [-25, -31], [-15, -28], [-8, -19]];
    else p = [[-29, -8], [-31, -24], [-27, -38, 1], [-15, -28], [-6, -19]];
    return side > 0 ? mirror(p) : p;
  }
  function applyEarScar(pts, scar) {
    if (scar === 'notch') { // V bite out of the inner top edge
      const tip = Math.max(0, pts.findIndex((p) => p[2])) || 2;
      const a = pts[tip], b = pts[tip + 1] || pts[tip - 1];
      const at = (t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const m = at(0.42), nrm = [-(b[1] - a[1]), b[0] - a[0]], l = Math.hypot(nrm[0], nrm[1]) || 1, cx = (pts[0][0] + pts[pts.length - 1][0]) / 2, sgn = ((cx - m[0]) * nrm[0] + (-20 - m[1]) * nrm[1]) > 0 ? 1 : -1;
      const res = pts.slice(); res.splice(tip + 1, 0, [...at(0.2), 1], [m[0] + nrm[0] / l * 9 * sgn, m[1] + nrm[1] / l * 9 * sgn, 1], [...at(0.62), 1]);
      return res;
    }
    if (scar === 'fold') return pts.map((p) => p[2] ? [p[0] * 0.84, p[1] * 0.62] : p); // tip folded forward
    return pts;
  }
  function headEars(o) {
    const sc = o.scars || []; let eL = earPts(o.ears, -1), eR = earPts(o.ears, 1);
    if (sc.includes('notch')) eR = applyEarScar(eR, 'notch');
    if (sc.includes('fold')) eL = applyEarScar(eL, 'fold');
    return [eL, eR];
  }
  const COWLICK = [[-6, -21], [-3, -37, 1], [2, -29], [8, -34, 1], [7, -21]];

  /* Face decals (front view), head-local: eyes at (+-12, 0). */
  function faceFront(o) {
    const eye = o.eye, e = o.expr || 'neutral', ink = C.ink; let out = '';
    const L = (d, w) => inkLine(d, w || 1.5);
    const eyeDisc = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${eye}" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><ellipse cx="${x}" cy="${y + 0.5}" rx="${rx * 0.42}" ry="${ry * 0.78}" fill="${ink}"/><circle cx="${x - rx * 0.36}" cy="${y - ry * 0.4}" r="${rx * 0.3}" fill="#fff"/>`;
    if (e === 'spiral') {
      [-12, 12].forEach((x) => { let d = ''; for (let i = 0; i <= 26; i++) { const a = i * 0.55, r = 0.6 + i * 0.26; d += (i ? 'L' : 'M') + r1(x + Math.cos(a) * r) + ' ' + r1(Math.sin(a) * r); } out += `<circle cx="${x}" cy="0" r="8" fill="#fff" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>` + L(d, 1.4); });
    } else if (e === 'happy' || e === 'purr') out += L('M-18 1Q-12 -7 -6 1', 2) + L('M6 1Q12 -7 18 1', 2);
    else if (e === 'sleepy' || e === 'blink') out += L('M-18 0Q-12 4 -6 0', 2) + L('M6 0Q12 4 18 0', 2);
    else if (e === 'shock') out += `<circle cx="-12" cy="-1" r="8.5" fill="#fff" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="12" cy="-1" r="8.5" fill="#fff" stroke="${ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="-12" cy="-1" r="2.4" fill="${ink}"/><circle cx="12" cy="-1" r="2.4" fill="${ink}"/>`;
    else {
      out += eyeDisc(-12, 0, 6.8, 7.6) + eyeDisc(12, 0, 6.8, 7.6);
      if (e === 'smug') out += `<path d="M-20 -9H-4V-2.2Q-12 -4.2 -20 -2.2Z M4 -9H20V-2.2Q12 -4.2 4 -2.2Z" fill="${o._lid}"/>` + L('M-19.6 -2.4Q-12 -4.4 -4.4 -2.4', 2) + L('M4.4 -2.4Q12 -4.4 19.6 -2.4', 2);
      if (e === 'angry' || e === 'hiss') out += `<path d="M-21 -10.5L-3 -10L-3 -2Z M21 -10.5L3 -10L3 -2Z" fill="${o._lid}"/>` + L('M-20.5 -9.4L-3.4 -2.6', 2.2) + L('M20.5 -9.4L3.4 -2.6', 2.2);
    }
    out += `<path d="M-3.2 8.2Q0 7.2 3.2 8.2Q2 12 0 12.4Q-2 12 -3.2 8.2Z" fill="${C.pad}" stroke="${ink}" stroke-width="1.25" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    if (e === 'hiss' || e === 'shock') out += `<path d="M-7 15Q0 12.8 7 15Q6.6 25 0 26Q-6.6 25 -7 15Z" fill="#B8344E" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="M-5.4 15.2L-4 19.4L-2.6 14.8Z M5.4 15.2L4 19.4L2.6 14.8Z" fill="#fff" stroke="${ink}" stroke-width="1" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    else if (e === 'smug') out += L('M0 12.4Q-1 17 -7 16.4') + L('M0 12.4Q1 17.6 8.5 14.6');
    else out += L('M0 12.4Q-0.6 17 -6.4 16.6Q-9 16.2 -9.8 14') + L('M0 12.4Q0.6 17 6.4 16.6Q9 16.2 9.8 14');
    out += L('M-23 9L-40 6', 1.25) + L('M-23 13L-39 15.5', 1.25) + L('M23 9L40 6', 1.25) + L('M23 13L39 15.5', 1.25);
    return out;
  }

  /* ------------------------------------------------------------------ cat poses
   * Authored facing RIGHT (or square to camera), ground at y=0, centre at x=0, ~105 units to the ear tips.
   * A pose returns `layers` in paint order: silhouette groups (each with one even outer line), the tail,
   * the collar. Groups carry named pattern REGIONS that the coat generator fills, clipped to the silhouette. */
  const POSES = {};
  const FRONT_HEAD = [[-27, 12], [-33, 7, 1], [-30, -1], [-28, -12], [-19, -20.5], [0, -23.5], [19, -20.5], [28, -12], [30, -1], [33, 7, 1], [27, 12], [14, 17], [0, 18.5], [-14, 17]];
  const headShade = (hs, hx, hy) => blob(xf([[11, 19], [22, 9], [25.5, -6], [22, -19], [40, -22], [40, 26]], { s: hs, x: hx, y: hy }));

  /* --- back: standing, seen from behind and a little above (the exploration camera) --- */
  POSES.back = function (o) {
    const B = BUILD[o.build], bw = B.bx, hs = B.head, lift = Math.max(0, (B.leg - 1) * 36), T = { sx: bw, sy: B.by, y: -lift };
    // a pear: narrow shoulders under the head, flaring into round haunches (three-quarter back: head turned a touch to the right)
    const body = xf([[-30, -8], [-38, -21], [-37, -33], [-28, -44], [-21, -54], [-13, -62], [0, -65], [13, -62], [20, -54], [26, -45], [35, -34], [37, -21], [30, -8], [15, -4], [0, -9], [-15, -4]], T);
    const fx = 18 * bw, hy = -69 * B.by - lift, hb = hy + 18.5 * hs;
    const parts = [{ d: tube([[-fx, -18 - lift], [-fx - 1, -6]], [18, 15]) }, { d: tube([[fx, -18 - lift], [fx + 1, -6]], [18, 15]) }, { d: ell(-fx - 1.5, -4.6, 11, 6) }, { d: ell(fx + 2, -8.2, 9.6, 8.6) }, { d: blob(body) }];
    const [eL, eR0] = headEars(o), hxo = 3 * hs, H = { s: hs, x: hxo, y: hy, r: 4 };
    const eR = eR0.map((p) => [(p[0] - 18) * 0.84 + 19, p[1], p[2]]); // far ear foreshortened
    const head = [{ d: blob(xf(eL, H)) }, { d: blob(xf(eR, H)) }, { d: blob(xf([[24, 1], [33, 1.5], [38.5, 6.5], [35, 12.5], [25, 14]], H)) }, { d: blob(xf(FRONT_HEAD, H)) }];
    if ((o.scars || []).includes('cowlick')) head.push({ d: blob(xf(COWLICK, H)) });
    const tb = (p) => blob(xf(p, T)), th = (p) => blob(xf(p, H));
    const RB = {
      saddle: [tb([[-27, -72], [-30, -44], [-19, -28], [0, -23], [19, -28], [30, -44], [27, -72]])],
      stripes: [-52, -41, -30, -19].map((y, i) => { const w = 38; return tb([[-w, y + 9], [-w * 0.5, y + 2], [-3, y - 2, 1], [-w * 0.5, y + 7], [-w, y + 15]]) + tb([[w, y + 9], [w * 0.5, y + 2], [3, y - 2, 1], [w * 0.5, y + 7], [w, y + 15]]); }),
      socks: [ell(-fx - 1, -3, 15, 8), ell(fx + 2, -7, 15, 11)],
      patchA: [tb([[-44, -50], [-14, -56], [-3, -40], [-10, -22], [-44, -16]])], patchB: [tb([[44, -36], [12, -42], [5, -24], [16, -8], [44, -4]])],
    };
    const RH = {
      cap: [th([[-42, 2], [-24, 6], [-10, 2], [0, 7], [10, 2], [24, 6], [42, 2], [42, -60], [-42, -60]])],
      ears: [th([[-42, -17], [0, -23], [42, -17], [42, -60], [-42, -60]])], mask: [th([[-42, -17], [0, -22], [42, -17], [42, -60], [-42, -60]])],
      muzzle: [th([[-44, 7], [-19, 6], [-21, 26], [-44, 26]]), th([[44, 7], [19, 6], [21, 26], [44, 26]])],
      stripes: [th([[-12, -30], [-9, -14], [-6, -30, 1]]), th([[-2, -32], [0, -12], [2, -32, 1]]), th([[12, -30], [9, -14], [6, -30, 1]]), th([[-40, -4], [-21, -2, 1], [-40, 3]]), th([[40, -4], [21, -2, 1], [40, 3]])],
      patchA: [th([[2, -6], [14, -28], [44, -24], [44, 20], [8, 22]])], patchB: [th([[-44, -30], [-8, -32], [-4, -12], [-22, -5], [-44, -6]])],
    };
    const whisk = `<g transform="translate(${r1(hxo)} ${r1(hy)}) rotate(4) scale(${hs})">${inkLine('M-30 6L-43 3M-29 10L-42 12M36 8L52 3M35.5 10.5L52 10M34 12.5L49 17', 1.25)}<path d="M36.6 5.2Q39.6 5.6 39 8.2Q37 8.6 36 7Z" fill="${C.pad}" stroke="${C.ink}" stroke-width="1.1" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></g>`;
    const tail = o.tail === 'pom' ? tailParts(o, 0, 0, -1, 'back', [[-1, -17 - lift * 0.6], [-1, -19 - lift * 0.6]]) : tailParts(o, 0, -19 * B.by - lift * 0.6, -1, 'back');
    if (o.tail === 'pom') tail.parts = [{ d: blob(pomPts(-1, -22 - lift * 0.6, 13.5, 8, 0.055, 0.2)) }]; // round, softly scalloped pom at the base of the spine
    // the lifted hind paw shows its pads: the instant "this cat is walking away from you" read
    const pc = o.coat.pads || C.pad, pads = `<path d="${ell(fx + 2, -5.6, 4.8, 3.3)}${ell(fx - 3.2, -10.6, 2.1, 2.3)}${ell(fx + 2, -12.2, 2.1, 2.3)}${ell(fx + 7.2, -10.6, 2.1, 2.3)}" fill="${pc}"/>`;
    return {
      layers: [
        { parts, R: RB, shade: tb([[13, -64], [18, -53], [23, -44], [30, -33], [31, -21], [25, -11], [13, -5], [46, 0], [46, -66]]) + ell(hxo, hb + 3, 25 * hs, 6.5),
          lines: [blob([[-11 * bw, -19 - lift], [-8 * bw, -11], [-10.5 * bw, -5]], false), blob([[11 * bw, -20 - lift], [8.5 * bw, -14], [9.5 * bw, -9]], false),
            blob(xf([[-26, -40], [-18, -33], [-15, -22]], T), false), blob(xf([[25, -41], [18, -34], [15.5, -24]], T), false), // haunch curves
            blob(xf([[-11, -51], [-7.5, -46], [-8, -41]], T), false), blob(xf([[10, -51], [7.5, -46], [8.5, -41]], T), false)], extra: pads }, // shoulder blades
        { collar: 'band', pts: [[-22 * hs + hxo, hb - 8], [-11 * hs + hxo, hb - 1], [hxo, hb + 1], [11 * hs + hxo, hb - 0.5], [22 * hs + hxo, hb - 6]] },
        { parts: head, R: RH, shade: headShade(hs, hxo, hy), extra: whisk },
        { tail }, { cord: [0, -19 * B.by - lift * 0.6] },
      ],
      plaster: [1, hy - 17 * hs], w: 37 * bw,
    };
  };

  /* --- shared side-view head (facing right), head-local: skull centre at 0,0 --- */
  function sideHead(o, st) {
    st = st || {};
    const skull = [[-23, 5], [-24, -8], [-16, -19.5], [0, -24], [14, -21.5], [22.5, -13], [25.5, -5], [30.5, 1], [30, 7.5], [23, 13], [10, 17], [-7, 17], [-18, 13]];
    let near = [[-17, -15], [-16, -31], [-10, -42, 1], [-1, -31], [6, -20]];
    let far = [[3, -21], [10, -34], [16, -40, 1], [20, -29], [21.5, -15]];
    if (o.ears === 'tall') { near = [[-17, -15], [-16, -36], [-11, -51, 1], [-1, -34], [6, -20]]; far = [[3, -21], [11, -38], [17, -48, 1], [21, -32], [21.5, -15]]; }
    if (o.ears === 'round') { near = [[-18, -14], [-19, -27], [-12, -34.5], [-2, -30], [5, -20]]; far = [[4, -21], [10, -30.5], [17, -33.5], [21, -26], [21.5, -14]]; }
    if (st.earsBack) { near = [[-19, -12], [-33, -20], [-41, -18, 1], [-30, -8], [-19, -1]]; far = [[-9, -21], [-24, -30], [-32, -29, 1], [-22, -19], [-11, -13]]; }
    const sc = o.scars || [];
    if (sc.includes('notch') && !st.earsBack) near = applyEarScar(near, 'notch');
    if (sc.includes('fold') && !st.earsBack) far = far.map((p) => p[2] ? [p[0] + 4, p[1] + 14] : p);
    const eye = o.eye, e = st.expr || o.expr || 'neutral';
    let face = '';
    if (e === 'happy' || e === 'sleepy' || e === 'blink' || e === 'purr') face += inkLine(e === 'happy' || e === 'purr' ? 'M8 -3Q13 -9 18 -3' : 'M8 -5Q13 -1 18 -5', 2);
    else if (e === 'spiral') face += `<circle cx="13" cy="-4" r="6.4" fill="#fff" stroke="${C.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>` + inkLine('M13 -4q2 -2 3 0q1 3 -3 3q-5 0 -4 -4', 1.2);
    else if (e === 'shock') face += `<circle cx="13" cy="-5" r="7" fill="#fff" stroke="${C.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="14.5" cy="-5" r="2.2" fill="${C.ink}"/>`;
    else {
      face += `<ellipse cx="13" cy="-4.5" rx="5.4" ry="6.6" fill="${eye}" stroke="${C.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><ellipse cx="14.3" cy="-4.1" rx="2.3" ry="4.9" fill="${C.ink}"/><circle cx="11.4" cy="-7.3" r="1.7" fill="#fff"/>`;
      if (e === 'angry' || e === 'hiss') face += `<path d="M5.5 -14.5L20.5 -10L20.5 -5Z" fill="${o._lid}"/>` + inkLine('M6 -14L20 -5.6', 2.2);
      if (e === 'smug') face += `<path d="M6.5 -12H20V-6Q13 -8 6.5 -6Z" fill="${o._lid}"/>` + inkLine('M7 -6.2Q13 -8.2 19.4 -6.2', 2);
    }
    face += `<path d="M27.8 -1.6Q31.2 -1.2 30.9 1.8Q28.8 2.6 27.2 0.6Z" fill="${C.pad}" stroke="${C.ink}" stroke-width="1.25" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    if (st.mouthOpen) face += `<path d="M29 4.6L16 6Q17 15 24 16.6Q28 12 29 4.6Z" fill="#B8344E" stroke="${C.ink}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="M26.6 5L25.2 9.8L23.6 5.4Z M19.8 13.8L21.2 9.6L22.8 14.8Z" fill="#fff" stroke="${C.ink}" stroke-width="1" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    else face += inkLine('M28.8 3.2Q26.4 8 20.6 7.2', 1.5);
    face += inkLine('M20 2.6L3 0.6M20 5.6L4 9', 1.25) + inkLine('M27 3L44 -1M27 5L43 8.4', 1.25);
    const R = {
      cap: [blob([[-34, -7], [-12, -4], [0, -9], [12, -5], [36, -11], [36, -60], [-34, -60]])],
      ears: [blob([[-34, -19], [0, -23], [36, -17], [36, -60], [-34, -60]])],
      mask: [blob([[1, -15], [16, -19], [36, -9], [38, 12], [16, 21], [3, 8]]), blob([[-46, -19], [0, -23], [36, -17], [36, -60], [-46, -60]])],
      muzzle: [blob([[9, 3], [20, -2], [38, -4], [38, 24], [-28, 26], [-24, 10], [-5, 12]])],
      eyePatch: [ell(12.5, -6, 12, 12)],
      stripes: [blob([[-9, -30], [-6, -13], [-3, -30, 1]]), blob([[2, -30], [4, -14], [7, -30, 1]]), blob([[-28, -3], [-12, -1, 1], [-28, 4]]), blob([[-26, 6], [-13, 6, 1], [-25, 11]])],
      patchA: [blob([[-34, -32], [0, -36], [9, -9], [-6, 8], [-34, 6]])], patchB: [blob([[-34, 2], [-8, 4], [-6, 24], [-34, 26]])],
    };
    return { skull, near, far, face, R, shade: blob([[-26, 9], [-8, 12.5], [12, 12], [25, 7.5], [36, 16], [20, 26], [-26, 26]]) };
  }
  /** Place the side head: returns two silhouette layers (far ear, then head) with regions and face baked in. */
  function placeHead(o, st, T) {
    const H = sideHead(o, st), tr = `translate(${r1(T.x)} ${r1(T.y)}) rotate(${T.r || 0}) scale(${T.s || 1})`;
    const R = {}; Object.keys(H.R).forEach((k) => { R[k] = H.R[k].map((d) => ({ d, tr })); });
    return {
      far: { parts: [{ d: blob(xf(H.far, T)) }], R, shadeAll: true },
      head: { parts: [{ d: blob(xf(H.near, T)) }, { d: blob(xf(H.skull, T)) }], R, shade: { d: H.shade, tr }, extra: `<g transform="${tr}">${H.face}<path d="${blob(xf(H.near, { s: 0.5, x: -5.6, y: -12.5 }))}" fill="${C.purr}"/></g>` },
    };
  }
  const SIDE_BODY = [[-44, 1], [-46.5, -11], [-37, -19.5], [-14, -21.5], [10, -19.5], [30, -17], [40, -9], [42, 3], [36, 15], [18, 20], [-6, 20.5], [-28, 20.5], [-40, 13.5]];

  /* --- side-walk: profile, mid-stride --- */
  POSES['side-walk'] = function (o) {
    const B = BUILD[o.build], L = B.leg, by = -45 - (L - 1) * 26 - (B.by - 1) * 16, T = { sx: B.bx, sy: B.by, y: by };
    const fx = 27 * B.bx, hx = -30 * B.bx, g = -4.5, ty = by + 8 * B.by;
    const paw = (x) => ell(x + 3, -4.4, 9.8, 5.4);
    const nf = tube([[fx, ty], [fx + 6, (ty + g) / 2 + 1], [fx + 10, g]], [18, 14, 12.5]);
    const nh = tube([[hx, ty - 6], [hx - 9, ty + 6], [hx - 2, g - 9], [hx - 9, g]], [28, 21, 14, 12.5]);
    const ff = tube([[fx - 5, ty], [fx - 11, (ty + g) / 2], [fx - 18, g]], [16, 13, 12]);
    const fh = tube([[hx + 8, ty - 2], [hx + 18, ty + 8], [hx + 13, g - 8], [hx + 20, g]], [22, 16, 13, 12]);
    const hp = [45 * B.bx, by - 25 * B.by], hs = B.head * 1.04, HD = placeHead(o, {}, { x: hp[0], y: hp[1], s: hs, r: -4 });
    const tbp = [-43 * B.bx, by - 9 * B.by], tail = tailParts(o, tbp[0], tbp[1], -1, 'side');
    const t = (p) => blob(xf(p, T));
    const R = {
      saddle: [t([[-52, -5], [-30, 0], [0, -4], [30, -1], [48, -8], [48, -40], [-52, -40]])],
      belly: [t([[-50, 11], [-20, 7], [8, 9], [30, 4], [52, 6], [52, 40], [-50, 40]])],
      bib: [t([[24, -22], [33, -4], [27, 10], [44, 30], [60, 0], [50, -24]])],
      socks: [`M-200 -13H200V10H-200Z`],
      stripes: [-34, -19, -4, 11, 25].map((x) => t([[x - 5, -32], [x + 1, -8], [x + 5, 5, 1], [x + 8, -10], [x + 6, -32]])),
      patchA: [t([[-56, -34], [-22, -34], [-11, -10], [-25, 9], [-56, 11]])], patchB: [t([[0, -34], [36, -34], [40, -6], [22, 7], [6, -6]])],
    };
    return {
      layers: [
        { tail }, HD.far,
        { parts: [{ d: ff }, { d: paw(fx - 18) }, { d: fh }, { d: paw(hx + 20) }], R, shadeAll: true },
        { parts: [{ d: blob(xf(SIDE_BODY, T)) }, { d: nf }, { d: paw(fx + 10) }, { d: nh }, { d: paw(hx - 9) }], R, shade: t([[-50, 13], [-30, 14.5], [-6, 15], [18, 14], [35, 9], [44, 1], [52, 30], [-50, 30]]), lines: [blob([[hx - 13, ty - 16], [hx + 7, ty - 11], [hx + 9, ty + 2], [hx + 1, ty + 9]], false), blob([[fx - 9, ty - 4], [fx - 8, ty + 6]], false)] },
        { collar: 'band', pts: [[hp[0] - 20 * hs, hp[1] + 4 * hs], [hp[0] - 15 * hs, hp[1] + 14 * hs], [hp[0] - 5 * hs, hp[1] + 21 * hs]] },
        HD.head, { collar: 'bell', at: [hp[0] - 2 * hs, hp[1] + 22.5 * hs] }, { cord: tbp },
      ],
      plaster: [hp[0] - 3, hp[1] - 21 * hs], w: 50 * B.bx,
    };
  };

  /* --- side-pounce: full-stretch leap, up and to the right --- */
  POSES['side-pounce'] = function (o) {
    const B = BUILD[o.build], rot = -22, T0 = { r: rot, x: -4, y: -64 };
    const P = (x, y) => xf([[x * B.bx, y * B.by]], T0)[0], t = (p) => blob(p.map((q) => P(q[0], q[1]).concat(q[2] ? [1] : [])));
    const body = [[-52, 1], [-55, -10], [-42, -19], [-16, -20], [14, -18], [36, -16], [48, -8], [50, 3], [42, 13], [20, 16], [-6, 15], [-32, 15.5], [-46, 11]];
    const pawAt = (p) => ell(p[0], p[1], 9.4, 6, rot);
    const hp = P(54, -19), hs = B.head * 1.04, HD = placeHead(o, { mouthOpen: o.expr === 'hiss' }, { x: hp[0], y: hp[1], s: hs, r: rot + 12 });
    const tbp = P(-52, -7), tail = tailParts(Object.assign({}, o, { carry: o.carry === 'level' ? 'blade' : o.carry }), tbp[0], tbp[1], -1, 'side');
    const R = {
      saddle: [t([[-60, -4], [-30, 0], [0, -3], [30, 0], [56, -6], [56, -40], [-60, -40]])], belly: [t([[-60, 9], [-20, 5], [20, 7], [60, 3], [60, 40], [-60, 40]])],
      bib: [t([[30, -18], [38, 0], [32, 13], [60, 24], [66, -18]])],
      socks: [ell(P(84, 9)[0], P(84, 9)[1], 17, 14), ell(P(-92, 12)[0], P(-92, 12)[1], 18, 14), ell(P(84, -1)[0], P(84, -1)[1], 16, 11), ell(P(-90, 1)[0], P(-90, 1)[1], 16, 11)],
      stripes: [-38, -21, -4, 13, 29].map((x) => t([[x - 5, -28], [x + 1, -8], [x + 5, 3, 1], [x + 8, -10], [x + 6, -28]])),
      patchA: [t([[-62, -30], [-26, -30], [-14, -8], [-30, 7], [-62, 9]])], patchB: [t([[4, -30], [40, -30], [44, -6], [26, 5], [10, -6]])],
    };
    return {
      layers: [
        { tail }, HD.far,
        { parts: [{ d: tube([P(34, 2), P(56, 0), P(80, -5)], [16, 13, 11.5]) }, { d: pawAt(P(85, -5)) }, { d: tube([P(-38, 2), P(-62, 4), P(-86, -1)], [20, 15, 12]) }, { d: pawAt(P(-91, -1)) }], R, shadeAll: true },
        { parts: [{ d: t(body) }, { d: tube([P(36, 6), P(58, 11), P(80, 8)], [18, 14, 12]) }, { d: pawAt(P(86, 8)) }, { d: tube([P(-40, 5), P(-64, 13), P(-88, 10)], [26, 17, 12.5]) }, { d: pawAt(P(-94, 10)) }], R, shade: t([[-60, 9], [-30, 10.5], [0, 11], [30, 10], [50, 3], [60, 40], [-60, 40]]), lines: [blob([P(-52, -8), P(-36, -1), P(-40, 9)], false)] },
        { collar: 'band', pts: [[hp[0] - 21 * hs, hp[1] - 2 * hs], [hp[0] - 18 * hs, hp[1] + 10 * hs], [hp[0] - 11 * hs, hp[1] + 18 * hs]] },
        HD.head, { collar: 'bell', at: [hp[0] - 9 * hs, hp[1] + 21 * hs] }, { cord: tbp },
      ],
      plaster: [hp[0] - 7, hp[1] - 20 * hs], w: 60 * B.bx, shadowY: 26,
    };
  };

  /* --- front-sit: sitting square to camera (close-ups, name-cards, wall-top watchers) --- */
  function frontRegions(hs, hy) {
    const t = (pts) => blob(xf(pts, { s: hs, y: hy }));
    return {
      cap: [t([[-42, -9], [-24, -6], [-12, -9], [-4, -5], [0, -1], [4, -5], [12, -9], [24, -6], [42, -9], [42, -60], [-42, -60]])],
      ears: [t([[-42, -18], [0, -24], [42, -18], [42, -60], [-42, -60]])],
      mask: [ell(0, hy + 5 * hs, 17 * hs, 15 * hs), t([[-42, -18], [0, -23], [42, -18], [42, -60], [-42, -60]])],
      muzzle: [t([[-15, 5], [-6, 3], [0, -7], [6, 3], [15, 5], [25, 13], [20, 30], [-20, 30], [-25, 13]])],
      eyePatch: [t([[1, -30], [3, -8], [10, 9], [22, 10], [36, 2], [44, -30]])],
      stripes: [t([[-9, -30], [-7, -13], [-4, -30, 1]]), t([[-1.6, -32], [0, -11], [1.6, -32, 1]]), t([[9, -30], [7, -13], [4, -30, 1]]), t([[-38, -3], [-21, -1, 1], [-38, 3]]), t([[38, -3], [21, -1, 1], [38, 3]]), t([[-36, 7], [-22, 6.5, 1], [-35, 11.5]]), t([[36, 7], [22, 6.5, 1], [35, 11.5]])],
      patchA: [t([[1, -30], [3, -8], [10, 9], [22, 10], [36, 2], [44, -30]])], patchB: [t([[-44, -30], [-6, -32], [-12, -3], [-44, 3]])],
    };
  }
  function frontHead(o, hs, hy, expr) {
    const [eL, eR] = headEars(o), H = { s: hs, y: hy };
    const innerEar = (pts, s) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length + 3; return blob(xf(pts.map((p) => [(p[0] - cx) * 0.5 + cx + s * 1.5, (p[1] - cy) * 0.58 + cy, p[2]]), H)); };
    const parts = [{ d: blob(xf(eL, H)) }, { d: blob(xf(eR, H)) }, { d: blob(xf(FRONT_HEAD, H)) }];
    if ((o.scars || []).includes('cowlick')) parts.push({ d: blob(xf(COWLICK, H)) });
    const face = `<g transform="translate(0 ${r1(hy + hs)}) scale(${hs})">${faceFront(Object.assign({}, o, expr ? { expr } : {}))}</g>`;
    return { parts, R: frontRegions(hs, hy), shade: headShade(hs, 0, hy), extra: `<path d="${innerEar(eL, 1)} ${innerEar(eR, -1)}" fill="${C.purr}"/>` + face };
  }
  POSES['front-sit'] = function (o) {
    const B = BUILD[o.build], hs = B.head, bw = B.bx, hy = -75 - (B.leg - 1) * 14, hb = hy + 18.5 * hs, top = hy + 10;
    const body = [[-21 * bw, top], [-28 * bw, top + 18], [-34 * bw, -26], [-37 * bw, -11], [-29 * bw, -2.5], [0, -1.5], [29 * bw, -2.5], [37 * bw, -11], [34 * bw, -26], [28 * bw, top + 18], [21 * bw, top]];
    const lg = (s) => tube([[s * 8.5, top + 12], [s * 10, -7]], [14, 13]);
    const R = {
      belly: [blob([[-17 * bw, top], [-15 * bw, -30], [0, -6], [15 * bw, -30], [17 * bw, top]])], bib: [blob([[-19 * bw, top], [-14 * bw, top + 22], [0, top + 36], [14 * bw, top + 22], [19 * bw, top]])],
      socks: ['M-200 -14H200V10H-200Z'], saddle: [],
      stripes: [-46, -33, -20].map((y) => blob([[-44 * bw, y - 3], [-23 * bw, y + 1, 1], [-44 * bw, y + 5]]) + blob([[44 * bw, y - 3], [23 * bw, y + 1, 1], [44 * bw, y + 5]])),
      patchA: [blob([[-46 * bw, top - 6], [-13 * bw, top], [-15 * bw, -34], [-46 * bw, -28]])], patchB: [blob([[46 * bw, -46], [17 * bw, -42], [15 * bw, -10], [46 * bw, -5]])],
    };
    const tail = o.tail === 'pom' || o.tail === 'stub' ? tailParts(o, 0, 0, -1, 'side', o.tail === 'pom' ? [[30 * bw, -12], [36 * bw, -13]] : [[28 * bw, -10], [38 * bw, -8], [46 * bw, -12]])
      : tailParts(o, 0, 0, -1, 'side', [[30 * bw, -12], [43 * bw, -5], [36 * bw, 3], [18, 5.5], [3, 3.5]]);
    return {
      layers: [
        o.tail === 'pom' || o.tail === 'stub' ? { tail } : null,
        { parts: [{ d: ell(-28 * bw, -4.8, 10, 5.6) }, { d: ell(28 * bw, -4.8, 10, 5.6) }, { d: blob(body) }], R, shade: blob([[14 * bw, top], [24 * bw, top + 20], [27 * bw, -22], [25 * bw, -6], [12 * bw, -2], [60, 0], [60, top]]) + ell(0, hb + 2, 26 * hs, 7) },
        { parts: [{ d: lg(-1) }, { d: lg(1) }, { d: ell(-10.5, -5, 10, 5.8) }, { d: ell(10.5, -5, 10, 5.8) }], R, shade: ell(0, hb + 2, 26 * hs, 7) + 'M13.5 -70H30V0H13.5Z', lines: ['M-10.5 -8.8V-5.4', 'M10.5 -8.8V-5.4'] },
        o.tail === 'pom' || o.tail === 'stub' ? null : { tail },
        { collar: 'band', pts: [[-21 * hs, hb - 6], [-10 * hs, hb + 0.5], [0, hb + 2.5], [10 * hs, hb + 0.5], [21 * hs, hb - 6]] },
        frontHead(o, hs, hy), { collar: 'bell', at: [0, hb + 4.5] },
      ].filter(Boolean),
      plaster: [10 * hs, hy - 16 * hs], w: 40 * bw,
    };
  };

  /* --- loaf: tucked up, front on (Daifuku's default; wall-top Brooders) --- */
  POSES.loaf = function (o) {
    const B = BUILD[o.build], hs = B.head, bw = B.bx, hy = -43 * B.by, hb = hy + 18.5 * hs, T = { sx: bw, sy: B.by };
    const body = xf([[-44, -4], [-49, -18], [-43, -36], [-25, -47], [0, -50], [25, -47], [43, -36], [49, -18], [44, -4], [20, -1.5], [-20, -1.5]], T), t = (p) => blob(xf(p, T));
    const R = {
      saddle: [t([[-60, -16], [-36, -22], [-30, -62], [-60, -62]]), t([[60, -16], [36, -22], [30, -62], [60, -62]]), t([[-40, -40], [0, -44], [40, -40], [40, -70], [-40, -70]])],
      belly: [ell(0, -8, 22 * bw, 12)], bib: [ell(0, -10, 20 * bw, 16)], socks: [ell(-12, -4, 11, 6), ell(12, -4, 11, 6)],
      stripes: [-34, -22].map((y) => blob([[-56 * bw, y - 3], [-34 * bw, y + 1, 1], [-56 * bw, y + 5]]) + blob([[56 * bw, y - 3], [34 * bw, y + 1, 1], [56 * bw, y + 5]])),
      patchA: [blob([[-60 * bw, -60], [-22 * bw, -56], [-26 * bw, -22], [-60 * bw, -14]])], patchB: [blob([[60 * bw, -40], [28 * bw, -36], [24 * bw, -6], [60 * bw, -2]])],
    };
    const tail = o.tail === 'pom' || o.tail === 'stub' ? tailParts(o, 0, 0, -1, 'side', o.tail === 'pom' ? [[44 * bw, -12], [49 * bw, -13]] : [[40 * bw, -9], [50 * bw, -7], [58 * bw, -10]]) : tailParts(o, 0, 0, -1, 'side', [[42 * bw, -12], [52 * bw, -3], [34 * bw, 3.5], [12, 5], [-8, 3]]);
    return {
      layers: [
        o.tail === 'pom' || o.tail === 'stub' ? { tail } : null,
        { parts: [{ d: blob(body) }, { d: ell(-12, -4.6, 10.5, 5.6) }, { d: ell(12, -4.6, 10.5, 5.6) }], R, shade: blob([[22 * bw, -50 * B.by], [36 * bw, -32 * B.by], [37 * bw, -12], [18 * bw, -2], [70, 0], [70, -52 * B.by]]) + ell(0, hb + 2, 27 * hs, 7), lines: ['M-1.6 -4.6Q0 -7.6 1.6 -4.6'] },
        o.tail === 'pom' || o.tail === 'stub' ? null : { tail },
        { collar: 'band', pts: [[-21 * hs, hb - 6], [-10 * hs, hb + 0.5], [0, hb + 2.5], [10 * hs, hb + 0.5], [21 * hs, hb - 6]] },
        frontHead(o, hs, hy), { collar: 'bell', at: [0, hb + 4.5] },
      ].filter(Boolean),
      plaster: [10 * hs, hy - 16 * hs], w: 52 * bw,
    };
  };

  /* --- hiss: the Halloween arch, side on, hackles up, tail bottle-brushed --- */
  POSES.hiss = function (o) {
    const B = BUILD[o.build], by = -56, T = { sx: B.bx, sy: B.by, y: by }, t = (p) => blob(xf(p, T));
    const body = [[-40, 15], [-46, 1], [-43, -13], [-36, -25, 1], [-30, -21], [-24, -33, 1], [-17, -28], [-9, -38, 1], [-3, -32], [6, -39, 1], [11, -32], [20, -35, 1], [23, -27], [32, -26, 1], [34, -17], [41, -6], [40, 9], [30, 16], [8, 11], [-12, 11], [-28, 18]];
    const fx = 31 * B.bx, hx = -33 * B.bx, g = -4.5, ty = by + 9 * B.by;
    const leg = (x0, x1, w) => tube([[x0, ty], [(x0 + x1) / 2 + 1, (ty + g) / 2], [x1, g]], w), paw = (x) => ell(x + 3, -4.4, 9.8, 5.4);
    const hp = [49 * B.bx, by + 5 * B.by], hs = B.head * 1.04, HD = placeHead(o, { earsBack: true, mouthOpen: true, expr: 'hiss' }, { x: hp[0], y: hp[1], s: hs, r: 9 });
    const tbp = [-42 * B.bx, by - 3 * B.by], tail = tailParts(Object.assign({}, o, { carry: 'flag', _puff: true }), tbp[0], tbp[1], -1, 'side');
    const R = {
      saddle: [t([[-52, -6], [-30, -2], [0, -8], [30, -4], [46, -8], [46, -50], [-52, -50]])], belly: [t([[-46, 13], [-20, 5], [8, 5], [30, 7], [50, 7], [50, 40], [-46, 40]])],
      bib: [t([[26, -10], [34, 0], [28, 13], [44, 30], [60, 0], [50, -14]])], socks: [`M-200 -13H200V10H-200Z`],
      stripes: [-32, -17, -2, 13, 27].map((x) => t([[x - 5, -42], [x + 1, -14], [x + 5, 1, 1], [x + 8, -14], [x + 6, -42]])),
      patchA: [t([[-56, -40], [-22, -40], [-12, -10], [-26, 9], [-56, 11]])], patchB: [t([[0, -40], [36, -40], [40, -8], [22, 5], [6, -8]])],
    };
    return {
      layers: [
        { tail },
        { parts: [{ d: leg(fx - 8, fx - 13, [15, 12, 11.5]) }, { d: paw(fx - 13) }, { d: leg(hx + 11, hx + 15, [17, 13, 11.5]) }, { d: paw(hx + 15) }], R, shadeAll: true },
        { parts: [{ d: t(body) }, { d: leg(fx, fx + 5, [17, 13.5, 12.5]) }, { d: paw(fx + 5) }, { d: leg(hx, hx - 6, [21, 15, 12.5]) }, { d: paw(hx - 6) }], R, shade: t([[-52, 10], [-30, 6.5], [0, 6], [30, 8], [52, 3], [52, 19], [-52, 21]]), lines: [blob([[hx - 12, ty - 14], [hx + 6, ty - 8], [hx + 6, ty + 6]], false)] },
        HD.far, { collar: 'band', pts: [[hp[0] - 22 * hs, hp[1] - 5 * hs], [hp[0] - 21 * hs, hp[1] + 8 * hs], [hp[0] - 14 * hs, hp[1] + 17 * hs]] },
        HD.head, { collar: 'bell', at: [hp[0] - 12 * hs, hp[1] + 20 * hs] }, { cord: tbp },
      ],
      plaster: [hp[0] - 4, hp[1] - 21 * hs], w: 50 * B.bx,
    };
  };

  /* --- frazzled: staggered, front on, puffed ~15% into a zigzag silhouette (must read in pure black) --- */
  POSES.frazzled = function (o) {
    const B = BUILD[o.build], hs = B.head * 1.05, bw = B.bx, hy = -70;
    const zig = (pts, amp) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; const S = sampleCR([...pts, pts[0]], 3); S.pop(); return S.map((p, i) => { const dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1, k = i % 2 ? amp : -amp * 0.2; return [p[0] + dx / l * k, p[1] + dy / l * k, 1]; }); };
    const body = zig(xf([[-22, -58], [-33, -34], [-40, -12], [-30, -2], [0, -1], [30, -2], [40, -12], [33, -34], [22, -58]], { sx: bw }), 5.5);
    const [e0, e1] = headEars(o), eL = xf(e0, { s: hs, y: hy, r: -16 }), eR = xf(e1, { s: hs, y: hy, r: 14 });
    const R = { belly: [ell(0, -28, 15 * bw, 28)], bib: [blob([[-16 * bw, -62], [-13 * bw, -42], [0, -28], [13 * bw, -42], [16 * bw, -62]])], socks: ['M-200 -14H200V10H-200Z'], stripes: [-44, -30, -16].map((y) => blob([[-50 * bw, y - 3], [-24 * bw, y + 1, 1], [-50 * bw, y + 5]]) + blob([[50 * bw, y - 3], [24 * bw, y + 1, 1], [50 * bw, y + 5]])), patchA: [blob([[-50 * bw, -66], [-12 * bw, -62], [-14 * bw, -34], [-50 * bw, -28]])], patchB: [blob([[50 * bw, -42], [16 * bw, -38], [14 * bw, -8], [50 * bw, -4]])] };
    const FH = frontHead(o, hs, hy, 'spiral');
    FH.parts = [{ d: blob(eL) }, { d: blob(eR) }, { d: blob(zig(xf(FRONT_HEAD.map((p) => [p[0], p[1]]), { s: hs, y: hy }), 4.8)) }]; FH.extra = FH.extra.replace(/<path d="[^"]*" fill="#FFB3C1"\/>/, '');
    const tail = tailParts(Object.assign({}, o, { _puff: true }), 0, 0, 1, 'side', o.tail === 'pom' ? [[32 * bw, -16], [40 * bw, -22]] : [[30 * bw, -14], [46 * bw, -24], [54 * bw, -48], [46 * bw, -70], [34 * bw, -66]].slice(0, o.tail === 'stub' ? 3 : 5));
    return {
      layers: [
        { tail },
        { parts: [{ d: blob(body) }], R, shade: blob([[12 * bw, -62], [24 * bw, -40], [27 * bw, -14], [10 * bw, -2], [60, 0], [60, -70]]) },
        { parts: [{ d: tube([[-12, -44], [-19, -7]], [14, 13]) }, { d: tube([[12, -44], [20, -7]], [14, 13]) }, { d: ell(-20, -5, 10.5, 5.8) }, { d: ell(21, -5, 10.5, 5.8) }], R },
        { collar: 'band', pts: [[-20 * hs, hy + 12 * hs], [0, hy + 21 * hs], [20 * hs, hy + 12 * hs]] }, FH, { collar: 'bell', at: [0, hy + 23 * hs] },
      ],
      plaster: [10, hy - 16 * hs], w: 44 * bw,
    };
  };

  /* ------------------------------------------------------------------ coat generator */
  function patternOverlays(o, R) {
    const c = o.coat, P = o.pattern, out = [], dark = mix(c.base, C.ink, 0.42);
    const add = (name, fill) => (R[name] || []).forEach((r) => out.push(typeof r === 'string' ? { d: r, fill } : { d: r.d, fill, tr: r.tr }));
    if (P === 'mikan') { add('cap', c.patch); add('ears', c.patch); add('eyePatch', c.patch); }
    else if (P === 'bicolour') { add('muzzle', c.white); add('bib', c.white); add('belly', c.white); add('socks', c.white); }
    else if (P === 'tuxedo') { add('muzzle', c.white); add('bib', c.white); add('socks', c.white); }
    else if (P === 'tabby') { add('muzzle', mix(c.base, '#FFF8EC', 0.6)); add('stripes', c.patch || dark); }
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
    o._lid = o.pattern === 'pointed' ? o.coat.patch : o.coat.base; // eyelid = the coat colour around the eye
    const ol = typeof o.outline === 'string' ? (OUTLINES[o.outline] || OUTLINES.ink) : o.outline;
    const pose = (POSES[o.pose] || POSES.back)(o), G = { lw: o.lw, ol };
    const band = (pts) => { const d = blob(pts, false); return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${r1(7 + o.lw * 1.6)}" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:calc(7px * var(--k,1))"/>`; };
    let body = '';
    pose.layers.forEach((L) => {
      if (L.tail) {
        const f = tailFill(o), t = L.tail, ov = [];
        const ringCol = o.pattern === 'tabby' ? (o.coat.patch || mix(o.coat.base, C.ink, 0.42)) : mix(f, C.ink, 0.38);
        if (o.pattern === 'tabby' || o.tail === 'ringed') t.rings.forEach((d) => ov.push({ d, fill: ringCol }));
        if ((o.pattern === 'bicolour' || o.pattern === 'tuxedo') && t.tipD) ov.push({ d: t.tipD, fill: o.coat.white });
        body += celGroup({ parts: t.parts.map((p) => ({ d: p.d, fill: f })), overlays: ov, shade: t.pom && t.tip ? ell(t.tip[0] + 8, t.tip[1] + 5, 9, 9) : null }, G);
      } else if (L.collar === 'band') {
        if (o.collar === 'bell') { const d = blob(L.pts, false); body += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="10.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.crimson}" stroke-width="6.4" stroke-linecap="round"/>`; }
      } else if (L.collar === 'bell') {
        if (o.collar === 'bell') body += `<g transform="translate(${r1(L.at[0])} ${r1(L.at[1])})"><circle r="6" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.8" vector-effect="non-scaling-stroke"/><path d="M-3.6 1.3H3.6M0 1.3V5" stroke="${C.ink}" stroke-width="1.25" fill="none" vector-effect="non-scaling-stroke"/><circle cx="-2" cy="-2.2" r="1.5" fill="${C.cream}"/></g>`;
      } else if (L.cord) {
        if (o.collar === 'cord') body += `<g transform="translate(${r1(L.cord[0])} ${r1(L.cord[1])})"><path d="M4 2l4 9M6 1l9 5" stroke="${C.ink}" stroke-width="5.4" stroke-linecap="round"/><path d="M4 2l4 9M6 1l9 5" stroke="${C.gold}" stroke-width="2.6" stroke-linecap="round"/><ellipse rx="8.5" ry="4.4" fill="${C.gold}" stroke="${C.ink}" stroke-width="1.8" vector-effect="non-scaling-stroke"/></g>`;
      } else if (L.parts) {
        const ovs = patternOverlays(o, L.R || {});
        body += celGroup({ parts: L.parts.map((p) => ({ d: p.d, fill: p.fill || o.coat.base })), overlays: ovs, shade: L.shade, shadeAll: L.shadeAll, lines: L.lines, extra: L.extra }, G);
      }
    });
    if ((o.scars || []).includes('plaster') && pose.plaster) { const [px, py] = pose.plaster; body += `<g transform="translate(${r1(px)} ${r1(py)}) rotate(-18)">${inked('M-9 -3H9V3H-9Z', C.cream, 1.6)}${inked('M-3 -9H3V9H-3Z', C.cream, 1.6)}<path d="M-2.6 -2.6H2.6V2.6H-2.6Z" fill="${C.cream}"/></g>`; }
    const sh = o.shadow ? shadow({ x: 0, y: -1 + (pose.shadowY || 0), rx: (pose.w || 44) * (pose.shadowY ? 0.9 : 1.2), ry: pose.shadowY ? 7 : 8.5, opacity: pose.shadowY ? 0.32 : 0.45 }) : '';
    return `<g class="k-cat" transform="translate(${o.x} ${o.y}) scale(${o.flip ? -o.scale : o.scale} ${o.scale})">${sh}${body}</g>`;
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
        const sk = blob([[-44, -400, 1], [-56, -300], [-74, -196, 1], [-40, -186], [0, -190], [44, -184], [84, -196, 1], [60, -300], [44, -400, 1]]);
        s += celGroup({ parts: [{ d: sk, fill: p.bottom }], shade: blob([[-80, -420], [-58, -300], [-78, -180], [-50, -184], [-38, -300], [-36, -420]]), lines: [blob([[10, -196], [14, -250], [10, -310]], false), blob([[-36, -192], [-30, -240]], false), blob([[54, -192], [46, -250]], false)] }, G);
      } else {
        s += celGroup({ parts: [{ d: blob([[-40, -400], [-44, -300], [-36, -268], [0, -262], [44, -268], [52, -300], [44, -400]]), fill: p.bottom }], shade: blob([[-50, -410], [-50, -260], [-32, -262], [-28, -410]]) }, G);
      }
      // shirt hem
      s += celGroup({ parts: [{ d: blob([[-52, -680, 1], [-56, -384], [-20, -372], [20, -370], [56, -380], [52, -680, 1]], true, 0.6), fill: p.top }], shade: 'M-70 -700H-37V-360H-70Z' }, G);
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
        g.shade = `M${ank[0] + 13} -420H${ank[0] + 40}V4H${ank[0] + 13}Z`;
        return celGroup(g, G);
      };
      s += leg(-1) + leg(1);
      if (o.garment === 'skirt') s += celGroup({ parts: [{ d: blob([[-52, -400, 1], [-66, -300], [-80, -190, 1], [-40, -182], [0, -186], [40, -182], [80, -190, 1], [66, -300], [52, -400, 1]]), fill: p.bottom }], shade: blob([[44, -410], [54, -300], [62, -180], [90, -180], [70, -410]]), lines: [blob([[-22, -190], [-18, -250]], false), blob([[24, -190], [20, -260]], false)] }, G);
      else s += celGroup({ parts: [{ d: blob([[-56, -400], [-60, -300], [-52, -262], [0, -256], [52, -262], [60, -300], [56, -400]]), fill: p.bottom }], shade: blob([[42, -410], [46, -256], [70, -256], [64, -410]]), lines: ['M0 -258V-300'] }, G);
      s += celGroup({ parts: [{ d: blob([[-60, -680, 1], [-64, -384], [-24, -372], [24, -372], [64, -384], [60, -680, 1]], true, 0.6), fill: p.top }], shade: 'M45 -700H80V-360H45Z' }, G);
      if (o.carry === 'bag') s += handBag(p, G, 78, -292);
    } else { // reach: a squatting figure, forearm and open palm offered at cat-nose height
      const hip = [-170, -150], knee = [-52, -178], ank = [-92, -34];
      s += celGroup({ parts: [{ d: tube([[-176, -150], [-166, -300], [-128, -440]], [96, 104, 104], { capRound: 0.05 }), fill: p.top }], shade: `M-240 -460H-176L-196 -140H-240Z` }, G);
      s += celGroup({ parts: [{ d: tube([knee, [ank[0] + 8, -100], ank], [50, 44, 30], { capRound: 0.2 }), fill: o.garment === 'trousers' ? p.bottom : p.skin }, { d: blob(xf([[-17, -30], [-19, -12], [-15, -1], [10, 0], [34, 0], [45, -5], [43, -14], [28, -22], [12, -30], [4, -40], [-8, -42]], { x: ank[0], y: 0 })), fill: p.shoe }], overlays: [{ d: `M${ank[0] - 30} -7H${ank[0] + 60}V3H${ank[0] - 30}Z`, fill: p.sole }], shade: tube([[knee[0] - 20, knee[1]], [ank[0] - 12, -100], [ank[0] - 14, -30]], 16) }, G);
      s += celGroup({ parts: [{ d: tube([hip, [-110, -190], knee], [78, 66, 54], { capRound: 0.35 }), fill: p.bottom }], shade: tube([[hip[0], hip[1] + 30], [-110, -160], [knee[0] - 4, knee[1] + 24]], 16) }, G);
      const arm = tube([[-104, -372], [-40, -262], [40, -126]], [44, 36, 26], { capRound: 0.2 });
      const sleeve = tube([[-122, -400], [-84, -338], [-58, -292]], [60, 56, 52], { capRound: 0.1 });
      const hand = blob([[30, -134], [48, -116], [78, -98], [104, -90], [113, -82], [101, -75], [76, -77], [88, -67], [84, -59], [62, -63], [40, -76], [26, -98], [23, -120]]);
      const thumb = blob([[48, -120], [68, -127], [88, -121], [87, -110], [68, -107], [53, -107]]);
      s += celGroup({ parts: [{ d: arm, fill: p.skin }, { d: hand, fill: p.skin }], shade: blob([[-110, -350], [-46, -240], [30, -100], [50, -72], [84, -56], [60, -50], [16, -80], [-70, -230], [-130, -340]]), lines: [blob([[76, -77], [61, -81]], false), blob([[88, -86], [105, -84]], false)] }, G);
      s += celGroup({ parts: [{ d: thumb, fill: p.skin }] }, G) + celGroup({ parts: [{ d: sleeve, fill: p.top }], shade: tube([[-136, -390], [-98, -328], [-74, -284]], 16) }, G);
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
    const arm = tube([[hx - 8, hy - 380], [hx - 6, hy - 190], [hx - 2, hy - 90], [hx + 1, hy - 14]], [46, 40, 32, 25], { capRound: 0.2 });
    const fist = blob([[hx - 15, hy - 20], [hx - 18, hy], [hx - 13, hy + 16], [hx + 2, hy + 21], [hx + 15, hy + 14], [hx + 18, hy - 2], [hx + 13, hy - 20]]);
    s += celGroup({ parts: [{ d: arm, fill: p.skin }, { d: fist, fill: p.skin }], shade: `M${hx + 9} ${hy - 400}H${hx + 40}V${hy + 30}H${hx + 9}Z`, lines: [`M${hx - 9} ${hy + 6}Q${hx} ${hy + 10} ${hx + 11} ${hy + 5}`, `M${hx - 4} ${hy + 14}V${hy + 20}M${hx + 5} ${hy + 14}V${hy + 20}`] }, G);
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
  function glow(x, y, rx, ry, color, opacity) {
    const id = uid('g'), c = color || '#FFF3C4';
    return `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="1"/><stop offset="0.45" stop-color="${c}" stop-opacity="0.55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${id})" opacity="${opacity == null ? 0.5 : opacity}" style="mix-blend-mode:screen"/>`;
  }

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
    o = Object.assign({ color: C.plaster, tex: 'mottle', texOpacity: 0.14, grime: 0.3, wobble: true }, o);
    const d = o.d || polyD(o.pts), b = o.pts ? bbox(o.pts) : o.box, id = uid('g');
    const top = o.top || mix(o.color, '#FFFFFF', 0.25), bot = o.bottom || mix(o.color, '#C9A27A', 0.24);
    let inner = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${b.y}" x2="0" y2="${b.y + b.h}"><stop offset="0" stop-color="${top}"/><stop offset="0.5" stop-color="${o.color}"/><stop offset="1" stop-color="${bot}"/></linearGradient><rect x="${b.x - 20}" y="${b.y - 20}" width="${b.w + 40}" height="${b.h + 40}" fill="url(#${id})"/>`;
    if (o.grime) inner += `<rect x="${b.x - 20}" y="${b.y + b.h * 0.72}" width="${b.w + 40}" height="${b.h * 0.4}" fill="${mix(C.wisteria, '#B08A5A', 0.6)}" opacity="${o.grime * 0.6}" filter="url(#k-soft2)" style="mix-blend-mode:multiply"/>`;
    inner += texture(b.x - 20, b.y - 20, b.w + 40, b.h + 40, o.tex, o.texOpacity) + texture(b.x - 20, b.y - 20, b.w + 40, b.h + 40, 'mottle-light', 0.35) + texture(b.x - 20, b.y - 20, b.w + 40, b.h + 40, 'grain', 0.16);
    if (o.inner) inner += o.inner;
    return `<g class="k-surface"${o.wobble ? ' filter="url(#k-rough)"' : ''}>${clipTo(d, inner)}</g>`;
  }
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  /** Point inside a quad [tl,tr,br,bl] at u (along), v (down). Lets helpers follow perspective. */
  const quadPt = (q, u, v) => lerp(lerp(q[0], q[1], u), lerp(q[3], q[2], u), v);
  /** Plaster garden wall with a coping ribbon (the High Road reads as a pale ribbon). o: {quad:[tl,tr,br,bl], color, coping, lit} */
  function wall(o) {
    o = Object.assign({ color: C.plaster, coping: true, copingH: 0.09, base: true }, o); const q = o.quad;
    let s = surface({ pts: q, color: o.color, top: o.top, bottom: o.bottom, grime: o.grime == null ? 0.34 : o.grime, inner: o.inner });
    if (o.base) { const a = quadPt(q, 0, 0.9), b = quadPt(q, 1, 0.9); s += surface({ pts: [a, b, q[2], q[3]], color: mix(o.color, '#9A8C86', 0.5), grime: 0.2, texOpacity: 0.4 }); }
    if (o.coping) {
      const h = o.copingH, a = quadPt(q, 0, -h * 0.9), b = quadPt(q, 1, -h * 0.9), c = quadPt(q, 1, h * 0.6), d = quadPt(q, 0, h * 0.6);
      const ov = 0.012; const a2 = quadPt(q, -ov, -h * 0.9), b2 = quadPt(q, 1 + ov, -h * 0.9), c2 = quadPt(q, 1 + ov, h * 0.6), d2 = quadPt(q, -ov, h * 0.6);
      s += `<path d="${polyD([quadPt(q, 0, h * 0.6), quadPt(q, 1, h * 0.6), quadPt(q, 1, h * 2.1), quadPt(q, 0, h * 2.1)])}" fill="${C.wisteria}" opacity="0.3" filter="url(#k-soft)" style="mix-blend-mode:multiply"/>`;
      s += surface({ pts: [a2, b2, c2, d2], color: o.copingColor || '#B4BFC8', top: '#E4EAEA', bottom: '#8794A6', grime: 0, texOpacity: 0.2 });
      s += `<path d="${polyD([a2, b2, quadPt(q, 1 + ov, -h * 0.55), quadPt(q, -ov, -h * 0.55)])}" fill="#FBFAF0" opacity="0.95" filter="url(#k-rough)"/>`;
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
    // gouache strokes: flat, wide dabs that shrink toward the horizon (no smoky noise)
    let strokes = '';
    for (let i = 0; i < 46; i++) { const t = Math.pow(R(), 0.7), y = b.y + t * b.h, x = b.x + R() * b.w, k = 0.18 + t * 1.2, lightTone = R() < 0.55; strokes += `<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1((60 + R() * 150) * k)}" ry="${r1((5 + R() * 9) * k)}" fill="${lightTone ? '#FFF2D2' : '#A8977A'}" opacity="${r1(lightTone ? 0.2 + R() * 0.16 : 0.1 + R() * 0.1)}"/>`; }
    inner += `<g filter="url(#k-rough)">${strokes}</g>` + texture(b.x, b.y, b.w, b.h, 'grain', 0.16);
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
      shade: 'M9 -300H100V10H9Z' + 'M-60 -196H60V-187H-60Z' + 'M-40 -122H40V-113H-40Z',
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
    const lit = blob(pomPts(o.x - o.r * 0.13, o.y - o.r * 0.17, o.r * 0.98, 9, 0.08, 0.4));
    return `<g class="k-vfx">${celGroup({ parts, shade: { d: `M${o.x - o.r * 3} ${o.y - o.r * 3}h${o.r * 6}v${o.r * 6}h${-o.r * 6}Z` + lit, evenodd: true } }, { lw: o.lw, ol: OUTLINES.ink })}</g>`;
  }
  /** Scent wisps hanging above a Scent Post: 1-4 slow curling ribbons, Clowder colour, Cream rim, no glow. */
  function scentWisps(o) {
    o = Object.assign({ x: 0, y: 0, count: 3, color: C.sage, h: 120, seed: 1, rim: C.cream, ink: true }, o); const R = rng(o.seed * 31 + 7); let s = '';
    for (let i = 0; i < o.count; i++) {
      const bx = o.x + (i - (o.count - 1) / 2) * o.h * 0.3, h = o.h * (0.72 + R() * 0.45), dir = i % 2 ? 1 : -1, a = h * 0.16;
      const pts = [[bx, o.y], [bx + dir * a, o.y - h * 0.22], [bx - dir * a * 0.9, o.y - h * 0.48], [bx + dir * a * 0.9, o.y - h * 0.74], [bx + dir * a * 0.2, o.y - h * 0.98], [bx - dir * a * 0.95, o.y - h * 0.95], [bx - dir * a * 0.75, o.y - h * 0.8], [bx - dir * a * 0.2, o.y - h * 0.82]];
      const d = tube(pts, (t) => (2 + 9 * Math.sin(Math.PI * Math.min(1, t * 1.15)) * (0.75 + 0.25 * Math.sin(t * 9))) * o.h / 120, { per: 7 });
      s += (o.ink ? `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="8.5" stroke-linejoin="round"/>` : '') + `<path d="${d}" fill="${o.color}" stroke="${o.rim}" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/>`;
    }
    return `<g class="k-vfx">${s}</g>`;
  }
  /** Ribbon along points (Head Home thread, Tag-In streak, Whisker Sense trail): colour with Cream rim. */
  function ribbon(o) {
    o = Object.assign({ pts: [[0, 0], [100, 0]], color: C.gold, width: 8, rim: C.cream, taper: true }, o);
    const d = tube(o.pts, o.taper ? (t) => o.width * (0.35 + 0.65 * Math.sin(Math.PI * (0.08 + t * 0.84))) * (typeof o.grow === 'function' ? o.grow(t) : 1) : o.width, { per: 8 });
    return (o.ink ? `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${(o.rimW || 4) + 3}" stroke-linejoin="round"/>` : '') + `<path class="k-vfx" d="${d}" fill="${o.color}" stroke="${o.rim}" stroke-width="${o.rimW || 4}" stroke-linejoin="round" paint-order="stroke"/>`;
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

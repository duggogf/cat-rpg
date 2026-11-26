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

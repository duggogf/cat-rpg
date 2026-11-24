// PROTOTYPE - NOT FOR PRODUCTION
/* Browser-side texture definitions for tools/bake-textures.mjs.
 * Runs in Chromium after design/previews/kit/kit.js; every entry returns an SVG string
 * of exactly {w,h}. Painted with the kit's own helpers and filters (paint what stays:
 * no ink anywhere here). Albedo only: the 3D shader adds sun, shade and haze, so the
 * kit's baked-in lighting is kept gentle (top-light in foliage and clouds is wanted;
 * cast shadows are not baked). */
(function () {
  const K = window.Kit, C = K.C;
  const R1 = (n) => Math.round(n * 10) / 10;
  const svg = (w, h, body) => K.svg(w, h, body);
  const rect = (x, y, w, h, fill, extra) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra || ''}/>`;

  const T = {};

  /* Plaster garden wall face, 3 m x 1.5 m (u along the wall, v down). Gentle gradient,
   * brush-v, mottles, a darker base course and grime at the foot (kit wall + surface). */
  T.wall = { w: 1024, h: 512, svg: () => {
    const W = 1024, H = 512;
    const q = [[-40, -10], [W + 40, -10], [W + 40, H + 10], [-40, H + 10]];
    let inner = '';
    // soft stains and repairs, like the 01 wall
    inner += `<path d="M120 60h220v180h-220z" fill="#EFE1CC" opacity="0.5" filter="url(#k-soft2)"/>`;
    inner += `<path d="M640 230h260v210h-260z" fill="#E2CDB4" opacity="0.4" filter="url(#k-soft2)"/>`;
    inner += `<path d="M420 120h120v300h-120z" fill="#C6B8C0" opacity="0.28" filter="url(#k-soft)"/>`;
    inner += K.texture(-40, -10, W + 80, H + 20, 'mottle', 0.16);
    { const R = K.rng(77); let st = ''; // rain stains under the coping as flat, hard-edged value shapes (no vertical brush)
      for (let i = 0; i < 7; i++) { const x = R() * W, w = 30 + R() * 60, h = 50 + R() * 110; st += `<path d="M${x.toFixed(0)} -4h${w.toFixed(0)}q-6 ${(h * 0.6).toFixed(0)} -${(w * 0.25).toFixed(0)} ${h.toFixed(0)}q-${(w * 0.2).toFixed(0)} 12 -${(w * 0.4).toFixed(0)} 0q-4 -${(h * 0.5).toFixed(0)} -${(w * 0.35).toFixed(0)} -${h.toFixed(0)}z" fill="#C9BCC4" opacity="${(0.28 + R() * 0.14).toFixed(2)}"/>`; }
      inner += `<g filter="url(#k-rough)">${st}</g>`;
      let mo = ''; for (let i = 0; i < 70; i++) { const x = R() * W, y = H * (0.8 + R() * 0.1), r = 6 + R() * 16; mo += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(r * 1.6).toFixed(0)}" ry="${r.toFixed(0)}" fill="${R() < 0.5 ? '#8FAE6A' : '#6F9A5A'}" opacity="${(0.35 + R() * 0.3).toFixed(2)}"/>`; }
      inner += `<g filter="url(#k-leaf-fine)">${mo}</g>`; }
    let s = K.surface({ pts: q, color: C.plaster, top: K.mix(C.plaster, '#FFFFFF', 0.18), bottom: K.mix(C.plaster, '#D9BF98', 0.35), grime: 0.32, inner });
    // base course (kit wall: lower ~10%)
    s += K.surface({ pts: [[-40, H * 0.88], [W + 40, H * 0.88], [W + 40, H + 10], [-40, H + 10]], color: K.mix(C.plaster, '#9A8C86', 0.45), grime: 0.25, texOpacity: 0.4 });
    s += `<rect x="-40" y="${H * 0.88 - 3}" width="${W + 80}" height="5" fill="#FBF3E0" opacity="0.7" filter="url(#k-rough)"/>`;
    return svg(W, H, s);
  } };

  /* Board fence, 2.6 m x 1.3 m, 8 boards, two rails. Ragged top (alpha). */
  T.fence = { w: 1024, h: 512, alpha: true, svg: () => {
    const W = 1024, H = 512;
    return svg(W, H, K.fence({ quad: [[-16, 6], [W + 16, 6], [W + 16, H + 30], [-16, H + 30]], n: 8, seed: 5 }));
  } };

  /* Sun-baked lane ground, top-down tile 4 m x 4 m: flat gouache strokes, pebbles, cracks. */
  T.ground = { w: 1024, h: 1024, svg: () => {
    const W = 1024, H = 1024, R = K.rng(41);
    let s = rect(0, 0, W, H, K.mix(C.lane, '#EFE2C4', 0.5));
    let big = '';
    for (let i = 0; i < 26; i++) { const x = R() * W, y = R() * H, rx = 90 + R() * 200; big += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(rx)}" ry="${R1(rx * (0.4 + R() * 0.4))}" fill="${R() < 0.5 ? '#F6EBD0' : '#C9B999'}" opacity="${R1(0.25 + R() * 0.2)}"/>`; }
    s += `<g filter="url(#k-soft2)">${big}</g>`;
    let st = '';
    for (let i = 0; i < 90; i++) { const x = R() * W, y = R() * H, lt = R() < 0.55; st += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(40 + R() * 110)}" ry="${R1(6 + R() * 12)}" fill="${lt ? '#FFF2D2' : '#A8977A'}" opacity="${R1(lt ? 0.22 + R() * 0.18 : 0.1 + R() * 0.12)}" transform="rotate(${Math.round(R() * 30 - 15)} ${R1(x)} ${R1(y)})"/>`; }
    s += `<g filter="url(#k-rough)">${st}</g>`;
    s += K.texture(0, 0, W, H, 'mottle', 0.12) + K.texture(0, 0, W, H, 'mottle-light', 0.35) + K.texture(0, 0, W, H, 'grain', 0.2);
    let peb = '';
    for (let i = 0; i < 260; i++) { const x = R() * W, y = R() * H; peb += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(2 + R() * 7)}" ry="${R1(1.5 + R() * 4)}" fill="${R() < 0.5 ? '#8F8470' : '#F1E8D2'}" opacity="${R1(0.3 + R() * 0.35)}"/>`; }
    s += `<g filter="url(#k-dab)">${peb}</g>`;
    s += `<g filter="url(#k-rough)" fill="none" stroke="#9A8C78" stroke-width="3" opacity="0.5"><path d="M180 300l60 40l-18 60l70 90"/><path d="M700 640l90 40l40 90"/><path d="M560 120l24 18l-8 22"/></g>`;
    return svg(W, H, s);
  } };

  /* Garden earth and grass behind walls (seen from high pitch), 4 m tile. */
  T.garden = { w: 512, h: 512, svg: () => {
    const W = 512, H = 512, R = K.rng(7);
    let s = rect(0, 0, W, H, '#7E9A58');
    let d = '';
    for (let i = 0; i < 140; i++) { const x = R() * W, y = R() * H, r = 10 + R() * 34; d += `<ellipse cx="${R1(x)}" cy="${R1(y)}" rx="${R1(r)}" ry="${R1(r * 0.6)}" fill="${['#5A8A48', '#9AB86A', '#8C7A58', '#6F9A52'][Math.floor(R() * 4)]}" opacity="0.6"/>`; }
    s += `<g filter="url(#k-leaf)">${d}</g>` + K.texture(0, 0, W, H, 'mottle', 0.2) + K.texture(0, 0, W, H, 'grain', 0.2);
    return svg(W, H, s);
  } };

  /* Generic paint-grain detail map (multiplied onto flat-coloured meshes), mean ≈ 0.88. */
  T.grain = { w: 512, h: 512, svg: () => {
    const W = 512, H = 512;
    return svg(W, H, rect(0, 0, W, H, '#E0E0E0') + K.texture(0, 0, W, H, 'brush-v', 0.35) + K.texture(0, 0, W, H, 'mottle', 0.25) + K.texture(0, 0, W, H, 'mottle-light', 0.5) + K.texture(0, 0, W, H, 'grain', 0.3));
  } };

  /* Sky brush (horizontal strokes) for the dome. */
  T.skybrush = { w: 512, h: 512, svg: () => {
    const W = 512, H = 512;
    return svg(W, H, rect(0, 0, W, H, '#E8E8E8') + K.texture(0, 0, W, H, 'brush', 0.5) + K.texture(0, 0, W, H, 'mottle-light', 0.5));
  } };

  /* Foliage atlas: 4 x 2 cells of 512, gouache clumps (top-left sunward dabs). */
  T.foliage = { w: 2048, h: 1024, alpha: true, svg: () => {
    let s = '';
    const tones = [
      null,
      { dark: '#2F6E4A', mid: '#4C8F4A', light: '#7DB857', hi: '#B5D873' },
      { dark: '#2A6245', mid: '#4C8F4A', light: '#7DB857', hi: '#B5D873' },
      null,
      { dark: '#3F8463', mid: '#5E9F6A', light: '#93C77A', hi: '#C4E07E' },
      null,
      { dark: '#2F6E4A', mid: '#5A9E4B', light: '#8DC65C', hi: '#CFE585' },
      { dark: '#356F48', mid: '#55964E', light: '#86C25A', hi: '#C4E07E' },
    ];
    for (let i = 0; i < 8; i++) {
      const cx = (i % 4) * 512 + 256, cy = Math.floor(i / 4) * 512 + 262;
      s += K.foliage({ x: cx, y: cy, w: 400, h: 360, seed: 51 + i * 7, tones: tones[i] || undefined, density: 1.1 });
    }
    return svg(2048, 1024, s);
  } };

  /* Hydrangea bushes: 2 cells 512 x 512. */
  T.flowers = { w: 1024, h: 512, alpha: true, svg: () => {
    return svg(1024, 512, K.flowers({ x: 256, y: 270, w: 400, h: 300, seed: 6, n: 7 }) + K.flowers({ x: 768, y: 270, w: 400, h: 300, seed: 9, n: 6 }));
  } };

  /* Grass tufts: 4 cells of 128 x 128. */
  T.grass = { w: 512, h: 128, alpha: true, svg: () => {
    let s = '';
    for (let i = 0; i < 4; i++) s += K.grass({ x1: i * 128 + 30, y1: 124, x2: i * 128 + 98, y2: 124, n: 4 + i, h: 70, seed: 21 + i });
    return svg(512, 128, s);
  } };

  /* Cumulus atlas: a towering one (1024 x 1024) and two smaller (1024 x 512). Base line flat. */
  T.clouds = { w: 2048, h: 1024, alpha: true, svg: () => {
    return svg(2048, 1024, K.cloud({ x: 512, y: 1000, w: 500, h: 620, seed: 3 }) + K.cloud({ x: 1536, y: 500, w: 560, h: 260, seed: 12 }) + K.cloud({ x: 1536, y: 1010, w: 440, h: 230, seed: 21 }));
  } };

  /* Hill ring panoramas. u = azimuth (0 at the sea, -Z; increasing toward +X). */
  // Near hills: the hillside the town sits on, 4096 x 1024 for 360°, elevation band −4°..+20°.
  // Painted with small gouache dabs (the ring is magnified ~2x on screen, so marks stay small).
  const paintHill = (ridge, x, y, W, H, base, seed, crowns) => {
    const R = K.rng(seed), pts = ridge.map(([a, e]) => [x(a), y(e)]);
    const d = K.blob(pts, false) + `L${pts[pts.length - 1][0]} ${H + 20}L${pts[0][0]} ${H + 20}Z`;
    let inner = `<path d="${d}" fill="${base}"/>`;
    const top = Math.min(...pts.map((p) => p[1]));
    inner += `<rect x="0" y="${top}" width="${W}" height="${H - top}" fill="${K.mix(base, '#D6ECF6', 0.5)}" opacity="0.5" filter="url(#k-soft3)" transform="translate(0 ${(H - top) * 0.55})"/>`;
    let dabs = '';
    const xs = pts.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
    for (let i = 0; i < (x1 - x0) * 1.6; i++) {
      const px = x0 + R() * (x1 - x0), py = top + Math.pow(R(), 0.8) * (H - top), r = 3 + R() * 7;
      const t = R(); const col = t < 0.4 ? K.mix(base, '#1F5A48', 0.35) : t < 0.8 ? K.mix(base, '#CFE8B0', 0.32) : K.mix(base, '#6E6AA8', 0.25);
      dabs += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(r * 1.6).toFixed(1)}" ry="${r.toFixed(1)}" fill="${col}" opacity="0.55"/>`;
    }
    inner += `<g filter="url(#k-leaf-fine)">${dabs}</g>`;
    if (crowns) for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 6; k++) {
      const t = R(), p = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t];
      inner += K.foliage({ x: p[0], y: p[1] + 10 + R() * 30, w: 50 + R() * 60, h: 34 + R() * 26, seed: seed * 100 + i * 7 + k, far: true, tones: { dark: K.mix(base, '#1F5A48', 0.4), mid: base, light: K.mix(base, '#CFE8B0', 0.3) } });
    }
    return `<g filter="url(#k-leaf-far)">${K.clipTo(d, inner)}</g>`;
  };
  T.hillsNear = { w: 4096, h: 1024, alpha: true, svg: () => {
    const W = 4096, H = 1024, el0 = -4, el1 = 20;
    const y = (deg) => H * (el1 - deg) / (el1 - el0);
    const x = (az) => (az / 360) * W;
    // back range (bluer, higher) then the near shoulder (greener); open window over the sea at az -28..6
    const back = [[-40, 2.6], [-30, 0.4], [-27, -5], [4, -5], [8, 0.5], [24, 2.6], [50, 4.6], [85, 5.6], [120, 6.4], [160, 7.0], [190, 7.2], [225, 6.4], [260, 5.2], [290, 4.2], [320, 3.4], [330, 2.6]];
    const near = [[60, -5], [80, 1.6], [105, 3.0], [140, 4.2], [175, 4.6], [205, 4.1], [240, 3.0], [270, 1.6], [295, -5]];
    const peaks = [[-40, 3.6], [-30, -5], [8, -5], [20, 2.6], [36, 6.2], [48, 4.6], [70, 8.4], [92, 5.8], [118, 7.6], [150, 9.4], [172, 7.2], [205, 10.2], [232, 7.0], [262, 8.2], [290, 5.4], [312, 6.6], [330, 3.6]];
    let s = '';
    for (const off of [0, 360]) {
      const sx = (a) => x(a + off);
      s += paintHill(peaks, sx, y, W, H, '#8FB8C8', 4, false);
      s += paintHill(back, sx, y, W, H, '#6FAE98', 5, false);
      s += paintHill(near, sx, y, W, H, '#4F9E6E', 6, true);
    }
    return svg(W, H, s);
  } };
  // Far headlands: 4096 x 256, elevation band −1°..+5°, hazy blue-green, gap over the open sea.
  T.hillsFar = { w: 4096, h: 256, alpha: true, svg: () => {
    const W = 4096, H = 256, el0 = -1, el1 = 5;
    const y = (deg) => H * (el1 - deg) / (el1 - el0);
    const x = (az) => (az / 360) * W;
    let s = '';
    s += K.hill({ pts: [[x(-28), y(-0.6)], [x(-24), y(0.6)], [x(-19), y(1.0)], [x(-14), y(0.8)], [x(-9), y(0.2)], [x(-6), y(-0.6)]].map(([a, b]) => [a + W, b]), baseY: H + 10, color: '#7DBBA6', seed: 9 });
    s += K.hill({ pts: [[x(-28), y(-0.6)], [x(-24), y(0.6)], [x(-19), y(1.0)], [x(-14), y(0.8)], [x(-9), y(0.2)], [x(-6), y(-0.6)]], baseY: H + 10, color: '#7DBBA6', seed: 9 });
    s += K.hill({ pts: [[x(40), y(-1)], [x(60), y(2.5)], [x(90), y(3.5)], [x(150), y(4.2)], [x(210), y(3.8)], [x(260), y(2.8)], [x(300), y(1.4)], [x(318), y(-1)]], baseY: H + 10, color: '#86BFAE', seed: 5 });
    return svg(W, H, s);
  } };

  /* The lower town beyond the crest: roofs and trees stepping down to the sea. 2048 x 512, ring strip. */
  const townStrip = (W, H, seed, scale, rows) => {
    const R = K.rng(seed); let s = '';
    const roofCols = ['#7E93A8', '#8799AC', '#6F8296', '#5F7088', '#93A3B4', '#8A7A70', '#6E7F92'];
    const wallCols = ['#EFE3C8', '#F3E9D6', '#E7D7BA', '#F0DCC0', '#E2D8C8'];
    const house = (x, y, w, h) => {
      const rc = roofCols[Math.floor(R() * roofCols.length)], wc = wallCols[Math.floor(R() * wallCols.length)], hip = R() < 0.5;
      let g = `<rect x="${x + w * 0.05}" y="${y + h}" width="${w * 0.9}" height="${h * 1.25}" fill="${wc}"/><rect x="${x + w * 0.05}" y="${y + h}" width="${w * 0.9}" height="${h * 0.3}" fill="${C.wisteria}" opacity="0.32"/>`;
      const nw = Math.max(1, Math.floor(w / (24 * scale)));
      for (let k = 0; k < nw; k++) if (R() < 0.75) g += `<rect x="${x + w * 0.12 + k * (w * 0.76 / nw)}" y="${y + h * 1.45}" width="${w * 0.76 / nw * 0.55}" height="${h * 0.5}" fill="#5E7F9A"/>`;
      g += hip ? `<path d="M${x + w * 0.16} ${y}L${x + w * 0.84} ${y}L${x + w} ${y + h}L${x} ${y + h}Z" fill="${rc}"/>` : `<path d="M${x + w * 0.5} ${y - h * 0.35}L${x + w} ${y + h}L${x} ${y + h}Z" fill="${rc}"/>`;
      g += `<path d="M${x} ${y + h - 3 * scale}L${x + w} ${y + h - 3 * scale}L${x + w} ${y + h}L${x} ${y + h}Z" fill="${K.mix(rc, '#33273B', 0.35)}"/>`;
      for (let t = 1; t < 4; t++) g += `<path d="M${x + w * (0.08 * t)} ${y + h * t / 4}H${x + w * (1 - 0.08 * t)}" stroke="#C9D5E0" stroke-width="${1.4 * scale}" opacity="0.45"/>`;
      return g;
    };
    for (let row = 0; row < rows; row++) {
      let x = -20 + R() * 30;
      while (x < W) {
        const w = (46 + R() * 50) * scale, h = (13 + R() * 8) * scale, y = (8 + row * 30 + R() * 8) * scale;
        if (R() < 0.16) s += K.foliage({ x: x + w / 2, y: y + h, w: w * 0.9, h: h * 2.2, seed: seed * 100 + Math.floor(x), tones: { dark: '#3F7A55', mid: '#5E9A60', light: '#8CC070', hi: '#B8DA86' }, dabs: false });
        else s += house(x, y, w, h);
        x += w * (0.82 + R() * 0.3);
      }
    }
    return `<g filter="url(#k-rough)">${s}</g>`;
  };
  T.town = { w: 4096, h: 192, alpha: true, svg: () => svg(4096, 192, townStrip(4096, 192, 17, 1.6, 3)) };
  T.townFar = { w: 4096, h: 128, alpha: true, svg: () => svg(4096, 128, townStrip(4096, 128, 23, 0.9, 4)) };

  /* Sea band, 2048 x 256 (top = horizon). */
  T.sea = { w: 2048, h: 256, svg: () => svg(2048, 256, K.sea({ x: 0, y: 0, w: 2048, h: 256, seed: 3 }) + `<rect x="0" y="0" width="2048" height="22" fill="#DDF1FA" opacity="0.7" filter="url(#k-soft)"/>`) };

  /* Roof tiles, 512 x 512, ridge at top. */
  T.roof = { w: 512, h: 512, svg: () => svg(512, 512, K.roof({ quad: [[-10, 20], [522, 20], [522, 522], [-10, 522]], rows: 8, cols: 9 }) + rect(-10, -10, 532, 34, '#5A6B80')) };

  /* House wall: plaster above a brushed wood skirt, 512 x 512 = 3 m x 3 m. */
  T.house = { w: 512, h: 512, svg: () => {
    let s = K.surface({ pts: [[-20, -20], [532, -20], [532, 532], [-20, 532]], color: '#EFDDBB', grime: 0.15 });
    s += K.surface({ pts: [[-20, 300], [532, 300], [532, 532], [-20, 532]], color: '#B98552', grime: 0.12, tex: 'brush-v', texOpacity: 0.35 });
    let b = ''; for (let i = 0; i < 9; i++) b += `<path d="M${i * 60 + 10} 300V512" stroke="#8A5A36" stroke-width="3" opacity="0.5"/>`;
    s += `<g filter="url(#k-rough)">${b}</g><rect x="-20" y="294" width="552" height="10" fill="#8A5A36" filter="url(#k-rough)"/>`;
    return svg(512, 512, s);
  } };

  /* Window: wood frame, blue-grey glass with a sky glint. 256 x 256. */
  T.window = { w: 256, h: 256, svg: () => svg(256, 256, `<g filter="url(#k-rough)"><rect x="6" y="6" width="244" height="244" fill="#5E7F9A"/><path d="M16 16L130 16L24 230Z" fill="#CFE6F2" opacity="0.5"/><rect x="6" y="6" width="244" height="244" fill="none" stroke="#8A5A36" stroke-width="14"/><path d="M128 6V250M6 128H250" stroke="#8A5A36" stroke-width="9"/></g>`) };

  /* Paper notice with Scribble (E-8), 256 x 320. */
  T.notice = { w: 256, h: 320, alpha: true, svg: () => {
    let sc = ''; for (let i = 0; i < 7; i++) sc += `<path d="M40 ${70 + i * 32}Q120 ${66 + i * 32} ${150 + (i % 3) * 25} ${70 + i * 32}" stroke="#7A6E86" stroke-width="5" fill="none" stroke-dasharray="${18 + i * 3} 8 ${10 + i} 6" opacity="0.75"/>`;
    return svg(256, 320, `<g filter="url(#k-rough)"><rect x="20" y="20" width="216" height="280" fill="#EFE7D2"/><rect x="20" y="20" width="216" height="34" fill="#7E93B6" opacity="0.85"/>${sc}</g>`);
  } };


  /* Stain decals (alpha): 0 rain streak + moss patch, 1 water stain, 2 a patched repair. 3 cells of 256 x 512. */
  T.stains = { w: 768, h: 512, alpha: true, svg: () => {
    const R = K.rng(5); let s = '';
    let a = ''; for (let i = 0; i < 7; i++) { const x = 70 + R() * 110, w = 8 + R() * 20; a += `<path d="M${x} 0h${w}l-4 ${260 + R() * 200}h-${w * 0.6}z" fill="#9C8E9E" opacity="${0.2 + R() * 0.2}"/>`; }
    s += `<g filter="url(#k-soft)">${a}</g>`;
    let m = ''; for (let i = 0; i < 26; i++) { const x = 60 + R() * 140, y = 420 + R() * 80, r = 8 + R() * 18; m += `<ellipse cx="${x}" cy="${y}" rx="${r * 1.5}" ry="${r}" fill="${R() < 0.5 ? '#8FAE6A' : '#6A955A'}" opacity="0.7"/>`; }
    s += `<g filter="url(#k-leaf-fine)">${m}</g>`;
    s += `<g filter="url(#k-rough)"><path d="M300 120q90 -30 160 30q40 90 -20 170q-90 60 -150 -20q-40 -100 10 -180z" fill="#B9A890" opacity="0.35"/><path d="M330 160q60 -10 100 30q20 60 -20 110q-60 30 -90 -20q-20 -70 10 -120z" fill="#A8977E" opacity="0.25"/></g>`;
    s += `<g filter="url(#k-rough)"><rect x="560" y="150" width="150" height="110" fill="#F7EEDC"/><rect x="560" y="150" width="150" height="110" fill="none" stroke="#C9B89C" stroke-width="5" opacity="0.6"/><path d="M590 300l40 60l-20 40" stroke="#9A8C9C" stroke-width="3" fill="none"/></g>`;
    return svg(768, 512, s);
  } };
  /* A second poster (lost-cat flyer look, Scribble only). */
  T.poster = { w: 256, h: 340, alpha: true, svg: () => {
    let sc = ''; for (let i = 0; i < 4; i++) sc += `<path d="M44 ${232 + i * 22}Q120 ${228 + i * 22} ${170 + (i % 2) * 30} ${232 + i * 22}" stroke="#6E6476" stroke-width="5" fill="none" stroke-dasharray="${14 + i * 4} 7 ${8 + i} 5" opacity="0.8"/>`;
    return svg(256, 340, `<g filter="url(#k-rough)"><rect x="22" y="18" width="212" height="304" fill="#F6E7C9"/><rect x="44" y="40" width="168" height="160" fill="#E9B98E"/><ellipse cx="128" cy="140" rx="52" ry="40" fill="#FFF6E3"/><path d="M92 106l14 -30l18 26M150 102l20 -26l10 32" fill="#FFF6E3"/>${sc}<rect x="22" y="18" width="212" height="304" fill="none" stroke="#D9C5A0" stroke-width="4"/></g>`);
  } };
  /* Drain / manhole cover, top-down, alpha. */
  T.manhole = { w: 512, h: 512, alpha: true, svg: () => {
    let bars = ''; for (let i = -4; i <= 4; i++) bars += `<rect x="${246 + i * 34}" y="130" width="16" height="252" rx="8" fill="#5E5868"/>`;
    return svg(512, 512, `<g filter="url(#k-rough)"><circle cx="256" cy="256" r="238" fill="#8C8074"/><circle cx="256" cy="256" r="212" fill="#A69C90"/><circle cx="256" cy="256" r="188" fill="#B8AFA2"/><clipPath id="mh"><circle cx="256" cy="256" r="172"/></clipPath><g clip-path="url(#mh)">${bars}</g></g>` + K.texture(0, 0, 512, 512, 'grain', 0.25));
  } };
  /* Vending machine front (painted, not interactive): body, drink rows, lit panel. */
  T.vending = { w: 512, h: 1024, svg: () => {
    const R = K.rng(9); let cans = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const x = 70 + c * 64, y = 140 + r * 150; cans += `<rect x="${x}" y="${y}" width="40" height="78" rx="12" fill="${['#E86A5A', '#F2C14E', '#6FB0E0', '#7CC27A', '#F3EEE4', '#9C7CC0'][Math.floor(R() * 6)]}"/><rect x="${x + 6}" y="${y + 10}" width="8" height="56" rx="4" fill="#FFFFFF" opacity="0.5"/><rect x="${x - 6}" y="${y + 96}" width="52" height="18" rx="5" fill="#2F3E58"/>`; }
    return svg(512, 1024, `<g filter="url(#k-rough)"><rect x="0" y="0" width="512" height="1024" fill="#3F78B8"/><rect x="28" y="40" width="456" height="540" rx="18" fill="#F7FAFF"/>${cans}<rect x="28" y="620" width="300" height="70" rx="10" fill="#2B3448"/><path d="M50 640h220M50 664h160" stroke="#9FD6FF" stroke-width="6" stroke-dasharray="20 8"/><rect x="370" y="620" width="96" height="190" rx="12" fill="#DDE4EE"/><rect x="60" y="820" width="392" height="140" rx="14" fill="#25304A"/><rect x="0" y="980" width="512" height="44" fill="#2E5C91"/></g>` + K.texture(0, 0, 512, 1024, 'grain', 0.15));
  } };
  /* Air-con outdoor unit face. */
  T.aircon = { w: 256, h: 192, svg: () => svg(256, 192, `<g filter="url(#k-rough)"><rect x="0" y="0" width="256" height="192" fill="#E9E5DA"/><circle cx="96" cy="96" r="70" fill="#8E96A6"/><circle cx="96" cy="96" r="58" fill="#5F6778"/><path d="M38 96h116M96 38v116M55 55l82 82M137 55l-82 82" stroke="#A9B0BE" stroke-width="5"/><rect x="184" y="30" width="52" height="132" fill="#D6D1C4"/></g>` + K.texture(0, 0, 256, 192, 'grain', 0.2)) };
  /* The passer-by, as a cat sees them: legs, hem, shoes, shopping (inked; M0 stand-in card). */
  T.legs = { w: 512, h: 1024, alpha: true, svg: () => svg(512, 1024, K.human({ pose: 'walk', palette: 'street', garment: 'skirt', carry: 'bag', x: 250, y: 1010, scale: 1.9, flip: true, shadow: false, lw: 4 })) };


  /* Ground bits (top-down, alpha), 4 cells of 512: leaf litter, cracks, a puddle, a sandy patch with pebbles. */
  T.groundbits = { w: 2048, h: 512, alpha: true, svg: () => {
    const R = K.rng(31); let s = '';
    let lv = ''; for (let i = 0; i < 26; i++) { const x = 256 + (R() - 0.5) * 380, y = 256 + (R() - 0.5) * 300, r = 10 + R() * 16; lv += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${r.toFixed(0)}" ry="${(r * 0.5).toFixed(0)}" fill="${['#9DB45E', '#C9A85A', '#7FA052', '#B98A4E'][Math.floor(R() * 4)]}" transform="rotate(${Math.round(R() * 180)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; }
    s += `<g filter="url(#k-dab)">${lv}</g>`;
    s += `<g filter="url(#k-rough)" fill="none" stroke="#8E8070" stroke-width="5" opacity="0.75"><path d="M560 120l70 60l-20 70l90 80l40 90"/><path d="M630 180l80 -20l60 40"/><path d="M700 330l-60 50"/></g>`;
    s += `<g filter="url(#k-rough)"><ellipse cx="1280" cy="256" rx="210" ry="120" fill="#9AAFC4" opacity="0.85"/><ellipse cx="1250" cy="236" rx="150" ry="70" fill="#C8DCEB" opacity="0.8"/><path d="M1150 230q80 -30 170 -10" stroke="#FFFFFF" stroke-width="8" opacity="0.7" fill="none"/><ellipse cx="1280" cy="256" rx="226" ry="134" fill="none" stroke="#8E8474" stroke-width="10" opacity="0.4"/></g>`;
    let pb = ''; for (let i = 0; i < 60; i++) { const x = 1792 + (R() - 0.5) * 360, y = 256 + (R() - 0.5) * 300; pb += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(3 + R() * 8).toFixed(0)}" ry="${(2 + R() * 5).toFixed(0)}" fill="${R() < 0.5 ? '#8F8470' : '#F1E8D2'}"/>`; }
    s += `<g filter="url(#k-rough)"><ellipse cx="1792" cy="256" rx="200" ry="130" fill="#E9DCBE" opacity="0.7"/></g><g filter="url(#k-dab)">${pb}</g>`;
    return svg(2048, 512, s);
  } };

  window.TEX = T;
})();

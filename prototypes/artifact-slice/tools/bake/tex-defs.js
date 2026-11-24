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
    inner += K.texture(-40, -10, W + 80, H + 20, 'brush-v', 0.12) + K.texture(-40, -10, W + 80, H + 20, 'mottle', 0.18);
    inner += `<g fill="none" stroke="#9A8C9C" stroke-width="2.5" opacity="0.6" filter="url(#k-rough)"><path d="M300 0l10 46l-8 38l14 50"/><path d="M820 20l6 22l-5 18l9 30"/></g>`;
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
    let s = '';
    for (const off of [0, 360]) {
      const sx = (a) => x(a + off);
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
  T.town = { w: 4096, h: 160, alpha: true, svg: () => {
    const W = 4096, H = 160, R = K.rng(17);
    let s = '';
    const farRoof = (x, y, w, h, c) => K.roof({ quad: [[x + w * 0.14, y], [x + w * 0.86, y], [x + w, y + h], [x, y + h]], rows: 2, cols: 5, color: c }) + `<rect x="${x + w * 0.06}" y="${y + h}" width="${w * 0.88}" height="${h * 1.3}" fill="#EFE3C8"/><rect x="${x + w * 0.06}" y="${y + h}" width="${w * 0.88}" height="${h * 0.35}" fill="${C.wisteria}" opacity="0.35" style="mix-blend-mode:multiply"/>`;
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 62; i++) {
        const w = 40 + R() * 34, x = i * 66 + R() * 20 - 10 + (row % 2) * 33, y = 6 + row * 34 + R() * 8, h = 12 + R() * 6;
        if (R() < 0.18) { s += K.foliage({ x: x + w / 2, y: y + 16, w: 46 + R() * 30, h: 26 + R() * 12, seed: 700 + row * 70 + i, far: true }); continue; }
        s += farRoof(x, y, w, h, ['#7E93A8', '#8799AC', '#74889E', '#6F8296'][Math.floor(R() * 4)]);
      }
    }
    return svg(W, H, s);
  } };

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

  window.TEX = T;
})();

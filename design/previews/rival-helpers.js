/* REFERENCE DESIGNS — use these in every frame (spread RV.CAST.togemaru / RV.CAST.kagi into Kit.cat()).
 *
 * TOGEMARU, the First Thorn (Tough, Braggart, Wall Sitters: Sage outline; Bell-Gold never, he is not Posse)
 *  - Coat: lean black tom (#37323F) with warm tan (#D9A060) muzzle, chest bib, paws and tail tip.
 *  - Pattern: 'tuxedo' (black base, tan where a tuxedo is white); build 'long'; eyes yellow-green.
 *  - Ears: 'standard', pointed; spiky cheek ruff / raised hackles (RV.hackles) on front views.
 *  - Tail: 'plume', black with a tan tip, carried high like a flag ('flag').
 *  - Scars: a deep V notch in the outer edge of his right ear (viewer's right; RV.notched + RV.frontNotch).
 *
 * KAGI, Captain of Tofu Shop Step (Captain, Schemer, Wall Sitters: Sage outline)
 *  - Coat: pale silver (#CDD1DC) with slate-grey (#7D8397) stripes.
 *  - Pattern: 'tabby' (bold bands on back, tail and crown); build 'long'; narrow yellow-green eyes, smug.
 *  - Ears: 'tall'; regalia: a cream clothes-peg clipped to one ear.
 *  - Tail: 'whip', ringed by the tabby bands, held level and twitching ('blade').
 *  - Scars: none yet (clean coat; any future Scar is history from Mikan).
 *
 * Cat RPG preview frames 05-07 (Rivals): local helpers layered on top of kit/kit.js.
 * Not part of the shared kit (kit/ is read-only for these frames). Everything here uses the kit's
 * palette, outline engine and blob/tube helpers so the frames stay in the same visual language.
 *
 *  RV.CAST            the Hidamari Lane rivals used in frames 05-07 (spread into Kit.cat())
 *  RV.notched(svg, cuts)  a stronger, silhouette-reading ear notch (DR-40.4): cuts a V bite out of a
 *                     drawn cat with an SVG mask and re-inks the bite edges. The kit's 'notch' scar is
 *                     too small to read at Fence Line / Standoff distance.
 *  RV.storm(o)        the Nemesis storm mark: a scribbled Ink cloud with a Static Yellow bolt.
 *  RV.leafSprig, RV.plaster, RV.crate, RV.duskSea, RV.pawPrints, RV.chalkScratch, RV.stamp ...
 */
(function (root) {
  const K = root.Kit, C = K.C;
  let uidN = 0; const uid = (p) => `rv${p}${++uidN}`;
  const r1 = (v) => Math.round(v * 10) / 10;

  /* ------------------------------------------------------------ the Lane's rivals (Wall Sitters) */
  const CAST = {
    // Tough, the First Thorn, now the Lane's Nemesis. Braggart (flag tail), lean black-and-tan tom.
    togemaru: { coat: { base: '#37323F', white: '#D9A060', patch: '#D9A060' }, pattern: 'tuxedo', tail: 'plume', ears: 'standard', build: 'long', eye: 'yellowgreen', carry: 'flag' },
    // Captain of Tofu Shop Step. Schemer (blade tail), long-bodied silver tabby, narrow eyes.
    kagi: { coat: { base: '#CDD1DC', patch: '#7D8397' }, pattern: 'tabby', tail: 'whip', ears: 'tall', build: 'long', eye: 'yellowgreen', carry: 'blade', expr: 'smug' },
    // Captain 2: Stalwart, cream-and-white bicolour (Respectful: upright, ears forward).
    ohagi: { coat: { base: '#F4DDAA', white: '#FFF8EC' }, pattern: 'bicolour', tail: 'ringed', ears: 'standard', build: 'round', eye: 'copper', carry: 'post', expr: 'neutral' },
    // The Boss. Canon: enormous white-and-grey tom who never leaves his wall.
    daifuku: Object.assign({}, K.CAST.daifuku),
    // Toughs (procedural look; Wall Sitters lean white / cream / silver).
    goma: { coat: { base: '#514D60', white: '#FFF8EC' }, pattern: 'bicolour', tail: 'ringed', ears: 'round', build: 'round', eye: 'copper', carry: 'anchor', expr: 'angry' },        // Brooder, Bitter
    sasa: { coat: { base: '#FFF8EC', patch: '#C98A4A', patch2: '#514D60' }, pattern: 'patched', tail: 'plume', ears: 'round', build: 'standard', eye: 'green', carry: 'spring', expr: 'happy' }, // Goofball
    kuri: { coat: { base: '#E3C39A', patch: '#5E4636' }, pattern: 'pointed', tail: 'whip', ears: 'tall', build: 'long', eye: 'blue', carry: 'comma', expr: 'shock' },               // Fraidy
    hanpen: { coat: { base: '#FFF8EC', patch: '#CDD1DC' }, pattern: 'saddle', tail: 'stub', ears: 'standard', build: 'standard', eye: 'blue', carry: 'level', expr: 'sleepy' },       // Indifferent
    // A Roamer on the wire.
    nori: { coat: { base: '#37323F', white: '#FFF8EC' }, pattern: 'bicolour', tail: 'whip', ears: 'tall', build: 'long', eye: 'yellowgreen', carry: 'blade', expr: 'smug' },
  };

  /** Cut V-shaped ear notches out of an already drawn cat (stage coordinates) and re-ink the bite.
   *  cuts: [{x, y, a, d, w}]  x,y = point on the ear edge, a = direction INTO the ear (deg), d = depth, w = mouth width. */
  function notched(svg, cuts, o) {
    o = Object.assign({ lw: 2.5, rim: null }, o || {}); const id = uid('m');
    let tris = '', lines = '';
    cuts.forEach((c) => {
      const a = c.a * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux;
      const ap = [c.x + ux * c.d, c.y + uy * c.d];
      const b1 = [c.x - ux * c.d * 0.9 + px * c.w * 0.9, c.y - uy * c.d * 0.9 + py * c.w * 0.9];
      const b2 = [c.x - ux * c.d * 0.9 - px * c.w * 0.9, c.y - uy * c.d * 0.9 - py * c.w * 0.9];
      tris += `<path d="M${r1(ap[0])} ${r1(ap[1])}L${r1(b1[0])} ${r1(b1[1])}L${r1(b2[0])} ${r1(b2[1])}Z" fill="#000"/>`;
      const e1 = [c.x + px * c.w * 0.5, c.y + py * c.w * 0.5], e2 = [c.x - px * c.w * 0.5, c.y - py * c.w * 0.5];
      const d = `M${r1(e1[0])} ${r1(e1[1])}L${r1(ap[0])} ${r1(ap[1])}L${r1(e2[0])} ${r1(e2[1])}`;
      if (o.rim) lines += `<path d="${d}" fill="none" stroke="${o.rim}" stroke-width="${o.lw * 2.6}" stroke-linejoin="round" stroke-linecap="round"/>`;
      lines += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${o.lw}" stroke-linejoin="round" stroke-linecap="round"/>`;
    });
    return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000"><rect x="-2000" y="-2000" width="6000" height="6000" fill="#fff"/>${tris}</mask><g mask="url(#${id})">${svg}<g>${lines}</g></g>`;
  }

  /** Nemesis storm mark: scribbled Ink cloud + Static Yellow bolt. o: {x, y, s, aim:[x,y] optional scribble glare line} */
  function storm(o) {
    o = Object.assign({ x: 0, y: 0, s: 1, seed: 3 }, o); const R = K.rng(o.seed);
    let scrib = ''; for (let i = 0; i < 26; i++) { const a = i * 0.9 + R() * 0.4, rx = 38 + R() * 10, ry = 15 + R() * 6; scrib += `${i ? 'L' : 'M'}${r1(Math.cos(a) * rx + Math.sin(i * 2.1) * 6)} ${r1(Math.sin(a) * ry - 4 + Math.cos(i * 1.7) * 4)}`; }
    const cloud = K.blob(K.pomPts(0, -6, 34, 6, 0.18), true);
    let aim = '';
    if (o.aim) {
      const dx = o.aim[0] - o.x, dy = o.aim[1] - o.y, L = Math.hypot(dx, dy), n = Math.max(6, Math.round(L / 34));
      let d = `M${o.x} ${o.y}`; for (let i = 1; i <= n; i++) { const t = i / n, w = (i % 2 ? 1 : -1) * 9 * Math.sin(Math.PI * t); d += `L${r1(o.x + dx * t - dy / L * w)} ${r1(o.y + dy * t + dx / L * w)}`; }
      aim = `<path d="${d}" fill="none" stroke="${C.cream}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/><path d="${d}" fill="none" stroke="${C.ink}" stroke-width="3.2" stroke-dasharray="14 9" stroke-linecap="round" stroke-linejoin="round"/>`;
      const ang = Math.atan2(dy, dx) * 180 / Math.PI;
      aim += `<g transform="translate(${r1(o.aim[0])} ${r1(o.aim[1])}) rotate(${r1(ang)})"><path d="M-22 -13L2 0L-22 13" fill="none" stroke="${C.cream}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M-22 -13L2 0L-22 13" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }
    return `${aim}<g class="k-vfx" transform="translate(${o.x} ${o.y}) scale(${o.s})">
      <path d="${cloud}" fill="${C.cream}" stroke="${C.cream}" stroke-width="10" stroke-linejoin="round"/>
      <path d="${cloud}" fill="#4A3F55" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
      <path d="${scrib}" fill="none" stroke="#6E6382" stroke-width="2.4" stroke-linejoin="round" opacity="0.9"/>
      <path d="M-4 4L-16 28H-3L-10 48L16 16H2L10 4Z" fill="${C.staticYellow}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
    </g>`;
  }

  /** Truce leaf sprig (inked). */
  function leafSprig(o) {
    o = Object.assign({ x: 0, y: 0, s: 1, rot: -20 }, o);
    return `<g transform="translate(${o.x} ${o.y}) rotate(${o.rot}) scale(${o.s})">${K.inked('M0 0Q10 -14 26 -12Q18 4 0 0Z', '#7DB857', 2)}${K.inked('M0 0Q-4 -16 6 -28Q14 -14 0 0Z', '#5A9E4B', 2)}</g>`;
  }

  /** A fish crate (Undermark seat), inked prop. o: {x, y (foot centre), s} */
  function crate(o) {
    o = Object.assign({ x: 0, y: 0, s: 1, color: '#C8A06A' }, o);
    const w = 120, h = 62, dk = K.mix(o.color, '#6E6AA8', 0.35);
    const body = K.celGroup({ parts: [{ d: `M${-w / 2} ${-h}H${w / 2}V0H${-w / 2}Z`, fill: o.color }, { d: `M${-w / 2 + 6} ${-h - 16}H${w / 2 + 8}L${w / 2} ${-h}H${-w / 2}Z`, fill: K.mix(o.color, '#FFF6E3', 0.35) }],
      lines: [`M${-w / 2} ${-h * 0.5}H${w / 2}`, `M${-w / 2 + 30} ${-h}V0`, `M${w / 2 - 30} ${-h}V0`] }, { lw: 2.5, ol: K.OUTLINES.ink });
    return `<g transform="translate(${o.x} ${o.y}) scale(${o.s})">${K.shadow({ x: 0, y: 0, rx: 72, ry: 9 })}${body}<path d="M${-w / 2 + 2} -2H${w / 2 - 2}V${-h * 0.45}H${-w / 2 + 2}Z" fill="${dk}" opacity="0.35" style="mix-blend-mode:multiply"/></g>`;
  }

  /** Head plaster on a cat's crown (stage coords). */
  function plaster(o) {
    o = Object.assign({ x: 0, y: 0, s: 1, rot: -18 }, o);
    return `<g transform="translate(${o.x} ${o.y}) rotate(${o.rot}) scale(${o.s})">${K.inked('M-9 -3H9V3H-9Z', C.cream, 1.6)}${K.inked('M-3 -9H3V9H-3Z', C.cream, 1.6)}<path d="M-2.6 -2.6H2.6V2.6H-2.6Z" fill="${C.cream}"/></g>`;
  }

  /** Paw-print trail (Away cats): o {pts:[[x,y]...], s, color, opacity} */
  function pawPrints(o) {
    o = Object.assign({ s: 1, color: '#6E6AA8', opacity: 0.6 }, o); let g = '';
    o.pts.forEach((p, i) => { const k = o.s * (p[2] || 1); g += `<g transform="translate(${p[0]} ${p[1]}) scale(${k}) rotate(${i % 2 ? 12 : -12})"><ellipse cx="0" cy="4" rx="7" ry="6"/><circle cx="-7" cy="-5" r="3"/><circle cx="-2" cy="-9" r="3"/><circle cx="4" cy="-9" r="3"/><circle cx="8" cy="-4" r="3"/></g>`; });
    return `<g fill="${o.color}" opacity="${o.opacity}">${g}</g>`;
  }

  /** Chalk feud scratch between two points (cream scribble with a thin ink edge). */
  function chalkScratch(a, b, o) {
    o = Object.assign({ n: 7 }, o); let d = `M${a[0]} ${a[1]}`;
    for (let i = 1; i <= o.n; i++) { const t = i / o.n; d += `L${r1(a[0] + (b[0] - a[0]) * t)} ${r1(a[1] + (b[1] - a[1]) * t + (i % 2 ? -12 : 12) * (i < o.n ? 1 : 0))}`; }
    return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" opacity="0.8"/><path d="${d}" fill="none" stroke="${C.cream}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  }

  /** Dusk sea band: violet-to-apricot water with a sun road. o {x,y,w,h, sunX} */
  function duskSea(o) {
    o = Object.assign({ x: 0, y: 0, w: 800, h: 80, sunX: 400, seed: 5 }, o); const id = uid('g'), R = K.rng(o.seed);
    let s = `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6B98A"/><stop offset="0.35" stop-color="#C98AA4"/><stop offset="1" stop-color="#7C6CA8"/></linearGradient><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="url(#${id})"/>`;
    for (let i = 0; i < o.w / 6; i++) {
      const t = R(), y = o.y + 2 + t * (o.h - 3), spread = 30 + t * 180, x = o.sunX + (R() - 0.5) * spread * 2, l = 8 + R() * 30 * (0.4 + t);
      s += `<rect x="${r1(x - l / 2)}" y="${r1(y)}" width="${r1(l)}" height="${r1(1.4 + t * 2.4)}" rx="1.2" fill="#FFF1C9" opacity="${r1(0.5 + R() * 0.45)}"/>`;
    }
    for (let i = 0; i < o.w / 14; i++) { const t = R(), y = o.y + 3 + t * (o.h - 4), x = o.x + R() * o.w, l = 6 + R() * 26 * (0.4 + t); s += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(l)}" height="${r1(1 + t * 1.5)}" rx="1" fill="#FFE2C4" opacity="${r1(0.2 + R() * 0.3)}"/>`; }
    return `<g>${s}</g>`;
  }

  /** The low dusk sun: a cream disc with a warm halo. */
  function sun(o) {
    o = Object.assign({ x: 0, y: 0, r: 46 }, o);
    return K.glow(o.x, o.y, o.r * 9, o.r * 5, '#FFD9A0', 0.55) + K.glow(o.x, o.y, o.r * 3.2, o.r * 2.6, '#FFF0C8', 0.8) + `<circle cx="${o.x}" cy="${o.y}" r="${o.r}" fill="#FFF7DE"/>`;
  }

  /** Stamp roundel (Title / memory pictogram): inked circle in a colour with an inner glyph (svg string at 0,0). */
  function stamp(glyph, o) {
    o = Object.assign({ size: 56, color: C.sage, ring: C.ink }, o);
    return `<svg viewBox="-30 -30 60 60" width="${o.size}" height="${o.size}" overflow="visible"><circle r="26" fill="${o.color}" stroke="${o.ring}" stroke-width="3"/><circle r="20.5" fill="none" stroke="${C.cream}" stroke-width="2" stroke-dasharray="4 3" opacity="0.9"/>${glyph}</svg>`;
  }

  /** Small pictogram glyphs (draw at 0,0 inside a ~40px box). */
  const st = `stroke="${C.ink}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
  const GLYPH = {
    claw: `<path d="M-12 12L-2 -14M-3 14L7 -12M6 14L15 -8" fill="none" stroke="${C.ink}" stroke-width="4.5" stroke-linecap="round"/>`,
    clawLight: `<path d="M-12 12L-2 -14M-3 14L7 -12M6 14L15 -8" fill="none" stroke="${C.cream}" stroke-width="4" stroke-linecap="round"/>`,
    bell: `<circle r="12" fill="${C.gold}" ${st}/><path d="M-7 3H7M0 3V10" fill="none" ${st}/><circle cx="-4" cy="-5" r="2.6" fill="${C.cream}"/>`,
    flag: `<path d="M-8 14V-14" fill="none" ${st}/><path d="M-8 -14Q4 -18 12 -12Q4 -6 -8 -4Z" fill="${C.cream}" ${st}/>`,
    crown: `<path d="M-14 8L-14 -8L-6 0L0 -12L6 0L14 -8L14 8Z" fill="${C.gold}" ${st}/>`,
    fist: `<path d="M-12 -2Q-12 -12 -2 -12H8Q14 -12 14 -4V4Q14 12 4 12H-6Q-12 12 -12 4Z" fill="${C.cream}" ${st}/><path d="M-4 -12V-2M4 -12V-2" fill="none" ${st}/>`,
    cucumber: `<path d="M-14 8Q-16 0 -6 -8Q4 -16 12 -12Q16 -6 8 2Q-2 12 -14 8Z" fill="#7DB857" ${st}/><path d="M-6 0l2 2M2 -6l2 2M4 2l2 1" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`,
    water: `<path d="M0 -15Q12 0 10 6Q8 14 0 14Q-8 14 -10 6Q-12 0 0 -15Z" fill="${C.fish}" ${st}/><path d="M-4 4Q-4 9 1 10" fill="none" stroke="${C.cream}" stroke-width="2.4" stroke-linecap="round"/>`,
    horn: `<path d="M-14 -5H-6L8 -13V13L-6 5H-14Z" fill="#E9D27A" ${st}/><path d="M12 -6Q16 0 12 6" fill="none" ${st}/>`,
    fuel: `<path d="M0 -15Q11 -3 9 5Q7 14 0 14Q-7 14 -9 5Q-10 -2 -3 -7Q-3 0 1 1Q4 -6 0 -15Z" fill="#F28C5A" ${st}/>`,
    question: `<text x="0" y="10" text-anchor="middle" font-family="'M PLUS Rounded 1c'" font-weight="800" font-size="30" fill="${C.cocoa}">?</text>`,
    ear: `<path d="M-12 12L-6 -14L12 6Z" fill="${C.cream}" ${st}/><path d="M-6 6L-4 -4L4 4Z" fill="${C.pad}"/>`,
    earsBack: `<path d="M-16 0Q-12 -8 0 -10L-2 0Z" fill="${C.cream}" ${st}/><path d="M16 0Q12 -8 0 -10L2 0Z" fill="${C.cream}" ${st}/><path d="M-14 4Q0 14 14 4" fill="none" ${st}/>`,
    hackles: `<path d="M-16 10Q-14 -2 -8 -6L-6 -14L-2 -6L2 -15L5 -6L9 -13L10 -4Q16 0 16 10Z" fill="#4A3F55" ${st}/>`,
    knocked: `<path d="M-14 6Q0 -6 14 6" fill="none" ${st}/><path d="M-6 -8l4 4m0 -4l-4 4M6 -8l4 4m0 -4l-4 4" fill="none" ${st}/>`,
    burst: `<path d="M0 -16L4 -6L14 -8L8 1L15 9L4 8L0 16L-4 8L-15 9L-8 1L-14 -8L-4 -6Z" fill="${C.cream}" ${st}/>`,
    run: `<path d="M-14 8H6M-10 0H10M-14 -8H4" fill="none" ${st}/><path d="M10 -10L18 0L10 10" fill="none" ${st}/>`,
    gate: `<path d="M-14 14V-6Q0 -18 14 -6V14" fill="none" ${st}/><path d="M-7 14V-6M0 14V-10M7 14V-6" fill="none" ${st}/>`,
  };

  /** Raised hackles + spiky cheek ruff for a FRONT-facing cat (front-sit), drawn BEHIND the cat.
   *  The kit has no front 'hackles up' pose; this zigzag mane in the coat colour reads as bristling fur
   *  (and as Togemaru's spiky cheek ruff). o: {x, y, scale, fill, outline, puff (0..1 size)} */
  function hackles(o) {
    o = Object.assign({ x: 0, y: 0, scale: 1, fill: '#37323F', puff: 1, flip: false, rim: C.sage }, o);
    const k = o.puff, pts = [];
    // a ring of short spikes hugging the neck and cheeks (the head covers the middle)
    const n = 22;
    for (let i = 0; i <= n * 2; i++) {
      const t = i / (n * 2), a = Math.PI * (0.62 + t * 1.76); // from lower-left, over the top, to lower-right
      const outer = i % 2 === 0, side = Math.abs(Math.cos(a));
      const rx = (outer ? 39 + 3 * k * side : 31), ry = (outer ? 34 + 2 * k : 27);
      pts.push([Math.cos(a) * rx, -68 + Math.sin(a) * ry * (Math.sin(a) < 0 ? 0.9 : 1.15)]);
    }
    const d = K.polyD(pts);
    const g = `<path d="${d}" fill="${o.rim}" stroke="${o.rim}" stroke-width="${7 / o.scale}" stroke-linejoin="round"/><path d="${d}" fill="${o.fill}" stroke="${C.ink}" stroke-width="${2.5 / o.scale}" stroke-linejoin="round"/>`;
    return `<g transform="translate(${o.x} ${o.y}) scale(${o.flip ? -o.scale : o.scale} ${o.scale})">${g}</g>`;
  }
  /** Ear-notch cut for a front-sit cat (kit geometry), in stage coords. side: 'r' (viewer's right ear) | 'l'. */
  function frontNotch(x, y, sc, side) {
    const sgn = side === 'l' ? -1 : 1;
    return { x: x + sgn * 28.4 * sc, y: y - 103 * sc, a: side === 'l' ? 15 : 165, d: 7.5 * sc, w: 4.8 * sc };
  }

  root.RV = { CAST, notched, storm, hackles, frontNotch, leafSprig, crate, plaster, pawPrints, chalkScratch, duskSea, sun, stamp, GLYPH };
})(typeof window !== 'undefined' ? window : globalThis);

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Screen-space combat layer, one SVG over the canvas (below the HUD), rebuilt on twos from kit drawings
// (art bible §10.4–§10.7): radial focus lines (T3 20% / T4 40% of the edge, centre third clear), local
// streaks (T2), the Ink halftone edge pulse for incoming hits, edge arrows, the Tag-In bell-gold streak with
// Relay pips, telegraph overhead glyphs, Fear bubbles, the ONE lettered word (never over the controlled
// cat or the HUD), and the Pile-On set-piece (static Bell-Gold panel behind full-field Ink lines, the
// scalloped cloud boiling on twos with paws/tails/ears popping out, the giant word, four-puff reveal).
import { Kit } from './sprites.js';

const C = Kit.C, TWO = 1 / 30;
const r1 = (v) => Math.round(v * 10) / 10;
export const WORDS = {
  scratch: ['SKRITCH!', 'SHNK!', 'SWISH!'], thud: ['WHAM!', 'THOOM!', 'BOFF!', 'KRAK!'], yowl: ['YOWWL!', 'MRRAOW!'],
  pop: ['FWOOMP!', 'BZZT!'], bolt: ['ZOOM!', 'FWIP!'], hiss: ['FWIP!'], dust_cloud: ['KA-BLAM!', 'POW!', 'BAP-BAP-BAP!'], crash: ['KA-BLAM!', 'THOOM!'],
};
const WORD_COL = { claw: C.claw, thump: C.ink, yowl: C.yowl };

function rng(seed) { let a = seed | 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** Radial focus lines converging on (cx, cy): Ink wedges from beyond the screen edge to `inner` x the edge distance. */
function radialLines(w, h, cx, cy, edgeShare, seed, color = C.ink, count = 46) {
  const R = rng(seed * 31 + 7), far = Math.hypot(w, h); let s = '';
  for (let i = 0; i < count; i++) {
    const a = (i + R() * 0.8) / count * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    // distance from the focus to the screen edge along this ray
    const tx = ca > 0 ? (w - cx) / ca : ca < 0 ? -cx / ca : 1e9, ty = sa > 0 ? (h - cy) / sa : sa < 0 ? -cy / sa : 1e9;
    const edge = Math.min(tx, ty);
    const r0 = Math.max(edge * (1 - edgeShare * (0.7 + R() * 0.6)), Math.min(w, h) * 0.17), wd = (0.008 + R() * 0.022);
    s += `<path d="M${r1(cx + ca * r0)} ${r1(cy + sa * r0)}L${r1(cx + Math.cos(a - wd) * far)} ${r1(cy + Math.sin(a - wd) * far)}L${r1(cx + Math.cos(a + wd) * far)} ${r1(cy + Math.sin(a + wd) * far)}Z" fill="${color}"/>`;
  }
  return s;
}
/** Parallel streak wedges behind a moving cat (screen space, angle in degrees). */
function streak(x, y, ang, seed, len = 170, color = C.ink) {
  return Kit.speedLines({ mode: 'parallel', x: 0, y: -45, w: len, h: 90, count: 9, seed, color }).replace('<g class="k-vfx" transform="translate(0 -45) rotate(0)">', `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(ang)}) translate(${-len - 30} -45)">`);
}

export class ScreenFX {
  constructor(parent) {
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:2';
    this.el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible">${Kit.defs()}<defs>
      <pattern id="sx-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="4.2" fill="${C.ink}"/></pattern>
      <pattern id="sx-dots2" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="${C.ink}"/></pattern></defs><g id="sx"></g></svg>`;
    parent.appendChild(this.el);
    this.g = this.el.querySelector('#sx');
    this.fx = [];          // {kind, t, dur, ...}
    this.word = null;      // the one lettered word
    this.pile = null;
    this.lastDrawing = -1;
    this.w = 1920; this.h = 1080;
  }
  add(o) { this.fx.push({ t: -(o.delay || 0), ...o }); }

  /** The one lettered word (DR-49). o: {cls, ms, tier, hitType, at (world V3), seed} */
  letter(o) { this.word = { t: 0, ...o, text: (WORDS[o.cls] || WORDS.scratch)[(o.seed || 0) % (WORDS[o.cls] || WORDS.scratch).length] }; }

  /** Per frame. ctx: {w, h, project(v3)->{x,y,on}, controlledBox {x,y,w,h}, hudRects[], pile, offscreen[], tw} */
  update(dt, ctx) {
    this.w = ctx.w; this.h = ctx.h;
    for (const f of this.fx) f.t += dt;
    this.fx = this.fx.filter((f) => f.t < f.dur);
    if (this.word) { this.word.t += dt; if (this.word.t > this.word.ms / 1000 + 0.1) this.word = null; }
    const di = Math.floor(ctx.tw / TWO);
    if (ctx.skip) { this.stale = true; return; }
    if (di === this.lastDrawing && !ctx.force && !this.stale) return;
    this.stale = false;   // drawings change on twos
    this.lastDrawing = di;
    this.g.innerHTML = this.draw(ctx, di);
  }

  draw(ctx, di) {
    const { w, h } = ctx; let s = '';
    const seed = di % 3 + 1;
    // Pile-On set-piece owns the screen
    if (ctx.pile) s += this.drawPile(ctx, di);
    for (const f of this.fx) {
      if (f.t < 0) continue;
      const k = f.t / f.dur;
      if (f.kind === 'radial') {
        const p = f.at ? ctx.project(f.at) : { x: w / 2, y: h / 2 };
        s += radialLines(w, h, p.x, p.y, f.share * (k > 0.66 ? 0.6 : 1), seed + f.seed, f.color || C.ink);
      } else if (f.kind === 'streak') {
        const a = ctx.project(f.from), b = ctx.project(f.to);
        const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        s += streak(a.x, a.y, ang, seed + f.seed, f.len || 160);
      } else if (f.kind === 'edge') {
        // Ink halftone edge pulse (rule 7): never coral, two drawings
        const band = Math.min(w, h) * 0.09;
        s += `<path d="M0 0H${w}V${h}H0Z M${band} ${band}V${h - band}H${w - band}V${band}Z" fill="url(#sx-dots)" fill-rule="evenodd" opacity="0.35"/>`;
      } else if (f.kind === 'tagstreak') {
        const a = ctx.project(f.from), b = ctx.project(f.to);
        const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - Math.abs(b.x - a.x) * 0.25 - 40;
        const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([(1 - u) * (1 - u) * a.x + 2 * u * (1 - u) * mx + u * u * b.x, (1 - u) * (1 - u) * a.y + 2 * u * (1 - u) * my + u * u * b.y]); }
        const grow = Math.min(1, k * 2.2), cut = Math.max(1, Math.round(grow * 12));
        s += Kit.ribbon({ pts: pts.slice(0, cut + 1), color: C.gold, width: 26, rimW: 5, ink: true });
        const tip = pts[cut];
        s += streak(tip[0], tip[1], Math.atan2(pts[cut][1] - pts[Math.max(0, cut - 1)][1], pts[cut][0] - pts[Math.max(0, cut - 1)][0]) * 180 / Math.PI, seed, 140);
        // Relay chain: one paw-pad pip per tag at the top of the streak
        for (let i = 0; i < (f.relay || 1); i++) s += `<g transform="translate(${r1(mx - (f.relay - 1) * 22 + i * 44)} ${r1(my - 46)})">${Kit.ui.paw({ size: 40, fill: C.gold }).replace(/^<svg/, '<svg x="-20" y="-20"')}</g>`;
      } else if (f.kind === 'fear') {
        const p = ctx.project(f.at); if (!p.on) continue;
        const pts = []; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, rr = i % 2 ? 46 : 60; pts.push([p.x + Math.cos(a) * rr, p.y - 90 + Math.sin(a) * rr * 0.85]); }
        s += `<path d="M${pts.map((q) => r1(q[0]) + ' ' + r1(q[1])).join('L')}Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
        s += `<path d="M${r1(p.x)} ${r1(p.y - 118)}Q${r1(p.x + 22)} ${r1(p.y - 86)} ${r1(p.x + 14)} ${r1(p.y - 76)}Q${r1(p.x)} ${r1(p.y - 62)} ${r1(p.x - 14)} ${r1(p.y - 76)}Q${r1(p.x - 22)} ${r1(p.y - 86)} ${r1(p.x)} ${r1(p.y - 118)}Z" fill="${C.claw}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
      } else if (f.kind === 'splash') {
        // bucket splat: opaque Cream-and-cyan blob shapes, no liquid (art bible §10.1 rule 6)
        const p = ctx.project(f.at); const R = rng(f.seed * 13 + di), sc = 1 + k * 0.6;
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + R() * 0.5, d = (40 + R() * 40) * sc; s += `<path d="${Kit.blob(Kit.pomPts(p.x + Math.cos(a) * d, p.y - 30 + Math.sin(a) * d * 0.55, 22 + R() * 16, 7, 0.14, R() * 3))}" fill="${i % 2 ? C.cream : '#7FC4E8'}" stroke="${C.ink}" stroke-width="4"/>`; }
      } else if (f.kind === 'band') {
        // wedge-ended band (Standoff name-card / outcome) slamming in: one drawing at 115%, then settled
        const sc = k < 0.06 ? 1.15 : 1, y = f.y * h;
        s += `<g transform="translate(${r1(w / 2)} ${r1(y)}) scale(${sc})">${f.lines ? radialLines(0, 0, 0, 0, 0, 1, C.ink, 0) : ''}<path d="M${-f.bw / 2} -46H${f.bw / 2}L${f.bw / 2 - 40} 46H${-f.bw / 2}Z" fill="${f.fill || C.ink}"/><text x="0" y="16" text-anchor="middle" font-family="'M PLUS Rounded 1c',sans-serif" font-weight="800" font-size="46" fill="${f.ink || C.cream}">${f.text}</text></g>`;
      } else if (f.kind === 'bands') {
        // Standoff: horizontal band of parallel lines behind each cat
        for (const at of f.ats) { const p = ctx.project(at); s += Kit.speedLines({ mode: 'parallel', x: p.x - 230, y: p.y - 120, w: 460, h: 110, count: 10, seed: seed + 3, color: f.color || C.ink }); }
      }
    }
    s += this.drawOverheads(ctx, di);
    if (this.word) s += this.drawWord(ctx, di);
    return s;
  }

  /** Telegraph overhead glyphs, edge arrows. */
  drawOverheads(ctx, di) {
    let s = '';
    for (const o of ctx.overheads || []) {
      const p = ctx.project(o.at); if (!p.on) continue;
      if (o.cls === 'white') s += `<g transform="translate(${r1(p.x)} ${r1(p.y - 34)})"><path d="M-22 -10l10 10l-10 10M2 -10l10 10l-10 10" fill="none" stroke="${C.cream}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" transform="rotate(90)"/><path d="M-22 -10l10 10l-10 10M2 -10l10 10l-10 10" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" transform="rotate(90)"/></g>`;
      else if (o.cls === 'yellow') s += `<g transform="translate(${r1(p.x)} ${r1(p.y - 44)})"><path d="M0 -30L28 20H-28Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>${o.cracked ? `<path d="M-4 -30L4 -6L-4 8L4 20" fill="none" stroke="${C.ink}" stroke-width="5"/>` : `<path d="M0 -14V4" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="13" r="4" fill="${C.ink}"/>`}</g>`;
      else if (o.cls === 'red') { const j = di % 2 ? 1.06 : 1; s += `<g transform="translate(${r1(p.x)} ${r1(p.y - 46)}) scale(${j})">${Kit.impactBurst({ r: 36, points: 9, seed: 3 }).replace(new RegExp(C.cream, 'g'), C.magenta)}</g>`; }
    }
    for (const a of ctx.arrows || []) {
      const ang = Math.atan2(a.y - ctx.h / 2, a.x - ctx.w / 2);
      const x = Math.min(ctx.w - 40, Math.max(40, a.ex)), y = Math.min(ctx.h - 40, Math.max(40, a.ey));
      s += `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(ang * 180 / Math.PI)})"><path d="M22 0L-14 -20L-6 0L-14 20Z" fill="${a.color}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></g>`;
    }
    return s;
  }

  /** Lettered word: Cream fill, Ink outline, offset print in the damage colour; pops at 120% for one drawing,
   * jitters between two drawings, breaks into three wedges. Placed near the contact point, away from the
   * controlled cat, pushed inside the frame and off the HUD rectangles. */
  drawWord(ctx, di) {
    const W = this.word, k = W.t / (W.ms / 1000);
    const size = (W.tier >= 5 ? 0.3 : 0.12) * ctx.h * 0.78;   // letter height ~= font-size x 0.78 for Dela Gothic caps
    const est = W.text.length * size * 0.82, ht = size * 1.25;
    const anchor = W.screen || ctx.project(W.at);
    if (!W.place) {
      const cb = ctx.controlledBox, hud = ctx.hudRects || [];
      const cands = [[0.25, -1.1], [-0.25, -1.1], [0.6, -0.6], [-0.6, -0.6], [0, -1.5], [0.8, 0.1], [-0.8, 0.1]];
      let best = null, bestScore = -1e9;
      for (const [ox, oy] of cands) {
        let x = anchor.x + ox * est, y = anchor.y + oy * ht;
        x = Math.min(ctx.w - est / 2 - 24, Math.max(est / 2 + 24, x)); y = Math.min(ctx.h - ht / 2 - 24, Math.max(ht / 2 + 24, y));
        const box = { x: x - est / 2, y: y - ht / 2, w: est, h: ht };
        const ov = (r) => Math.max(0, Math.min(box.x + box.w, r.x + r.w) - Math.max(box.x, r.x)) * Math.max(0, Math.min(box.y + box.h, r.y + r.h) - Math.max(box.y, r.y));
        let score = -ov(cb) * 4 - hud.reduce((a, r) => a + ov(r) * 3, 0) - Math.hypot(x - anchor.x, y - anchor.y) * 0.2;
        if (score > bestScore) { bestScore = score; best = { x, y }; }
      }
      W.place = best; W.rot = W.tier >= 5 ? -10 : (W.dir && W.dir[0] < 0 ? 10 : -10);
    }
    const sc = di === Math.floor(W.firstDi ?? (W.firstDi = di)) ? 1.2 : 1;
    const jit = di % 2 ? 1 : -1;
    const sfx = Kit.sfx({ text: W.text, x: 0, y: 0, size, rot: W.rot + jit * 0.8, color: WORD_COL[W.hitType] || C.ink, seed: W.seed || 1 });
    const base = `translate(${r1(W.place.x + jit * 1.5)} ${r1(W.place.y + size * 0.35)}) scale(${sc})`;
    if (k < 0.82) return `<g transform="${base}">${sfx}</g>`;
    // break into three wedges flying apart
    const u = (k - 0.82) / 0.18, d = u * size * 0.8, R = est;
    const wedges = [[`M0 0L${-R} ${-R}L${R} ${-R}Z`, 0, -d], [`M0 0L${R} ${-R}L${R} ${R}L0 ${R}Z`, d, d * 0.4], [`M0 0L0 ${R}L${-R} ${R}L${-R} ${-R}Z`, -d, d * 0.4]];
    return wedges.map(([path, dx, dy], i) => `<clipPath id="sxw${i}"><path d="${path}"/></clipPath><g transform="${base} translate(${r1(dx)} ${r1(dy)}) rotate(${(i - 1) * u * 14})"><g clip-path="url(#sxw${i})">${sfx}</g></g>`).join('');
  }

  /** Pile-On: ctx.pile = {t, dur, type, center (screen px), coats[], phase:'in'|'main'|'out', outT, word} */
  drawPile(ctx, di) {
    const P = ctx.pile, { w, h } = ctx; let s = '';
    const cx = P.center.x, cy = P.center.y;
    const full = P.type === 'full', R0 = Math.min(w, h) * (full ? 0.27 : 0.22);
    if (P.phase !== 'out') {
      // static Bell-Gold backing enters behind a halftone wipe of 3 drawings (art bible §10.4 panel luminance rule)
      const wipe = Math.min(3, Math.floor(P.t / TWO));
      if (wipe < 3) {
        const rr = [3, 6, 9][wipe];
        s += `<pattern id="sx-wipe" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="${rr}" fill="${P.panel}"/></pattern><rect width="${w}" height="${h}" fill="url(#sx-wipe)"/>`;
      } else s += `<rect width="${w}" height="${h}" fill="${P.panel}"/>`;
      s += radialLines(w, h, cx, cy, 0.62, di % 3 + 1, C.ink, 70);
      // the cloud: big scalloped Paper Cream cloud, lavender shade, heavy Ink line, 8-drawing boil loop
      const boil = di % 8, sc = wipe < 3 ? 0.6 + wipe * 0.15 : 1;
      // starburst behind
      s += Kit.impactBurst({ x: cx, y: cy - R0 * 0.1, r: R0 * 1.55 * sc, points: 14, seed: 5 + (di % 2), inner: 0.62 }).replace(/fill="#FFF6E3"/, `fill="${C.cream}"`);
      // pop-outs behind the cloud edge: paws (coat colours of the cats inside), tails, ears, stars
      const R = rng(1000 + Math.floor(di / 2));
      const coats = P.coats.length ? P.coats : ['#FFF8EC'];
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI * 0.95 + (i / 6) * Math.PI * 1.9 + (R() - 0.5) * 0.3, len = R0 * (0.35 + R() * 0.25);
        if (R() < 0.3) continue;
        const bx = cx + Math.cos(a) * R0 * 0.82, by = cy + Math.sin(a) * R0 * 0.62, ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
        const coat = coats[i % coats.length], wpx = R0 * 0.1;
        const kind = i % 3;
        if (kind === 2) { // a tail
          const d = Kit.tube([[bx, by], [bx + Math.cos(a + 0.5) * len * 0.5, by + Math.sin(a + 0.5) * len * 0.5], [ex, ey]], (t) => wpx * 0.8 * (1 - t * 0.3), { per: 6 });
          s += `<path d="${d}" fill="${coat}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`;
        } else { // a paw with pads
          s += `<path d="${Kit.tube([[bx, by], [ex, ey]], () => wpx, { per: 4 })}" fill="${coat}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`;
          s += `<circle cx="${r1(ex)}" cy="${r1(ey)}" r="${r1(wpx * 1.15)}" fill="${coat}" stroke="${C.ink}" stroke-width="5"/>`;
          s += `<circle cx="${r1(ex + Math.cos(a) * wpx * 0.2)}" cy="${r1(ey + Math.sin(a) * wpx * 0.2)}" r="${r1(wpx * 0.45)}" fill="${C.pad}"/>`;
          for (let j = -1; j <= 1; j++) s += `<circle cx="${r1(ex + Math.cos(a + j * 0.7) * wpx * 0.85)}" cy="${r1(ey + Math.sin(a + j * 0.7) * wpx * 0.85)}" r="${r1(wpx * 0.22)}" fill="${C.pad}"/>`;
        }
      }
      for (let i = 0; i < 5; i++) { const a = R() * Math.PI * 2, d = R0 * (1.05 + R() * 0.5); s += Kit.sparkle({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.8, r: 14 + R() * 12, fill: i % 2 ? C.staticYellow : C.cream, lw: 3 }); }
      for (let i = 0; i < 3; i++) { const a = R() * Math.PI * 2, d = R0 * (1.0 + R() * 0.4); s += `<g transform="translate(${r1(cx + Math.cos(a) * d)} ${r1(cy + Math.sin(a) * d * 0.8)}) rotate(${r1(R() * 60 - 30)})">${Kit.ui.paw({ size: 54 }).replace(/^<svg/, '<svg x="-27" y="-27"')}</g>`; }
      // Mikan's head and the Posse chevrons bob on top
      const bob = (di % 2) * 6;
      if (P.mikan) s += `<g transform="translate(${r1(cx)} ${r1(cy - R0 * 0.62 - bob)}) scale(${r1(R0 / 260)})">${Kit.cat({ ...Kit.CAST.mikan, pose: 'front-sit', x: 0, y: 160, scale: 1.6, expr: 'angry', shadow: false, outline: 'gold' })}</g>`;
      for (let i = 0; i < P.chevrons; i++) { const x = cx + (i - (P.chevrons - 1) / 2) * R0 * 0.42, y = cy - R0 * 0.55 + ((i + di) % 2) * 6; s += `<path d="M${r1(x - 14)} ${r1(y - 8)}l14 12l14 -12" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M${r1(x - 14)} ${r1(y - 8)}l14 12l14 -12" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`; }
      s += `<g transform="translate(${r1(cx)} ${r1(cy)}) scale(${r1(sc)})">${Kit.dustCloud({ x: 0, y: 0, r: R0, puffs: 9, seed: 1 + boil, lw: 6 })}`;
      // curly ink strokes on the cloud
      const R2 = rng(77 + boil);
      for (let i = 0; i < 6; i++) { const x = (R2() - 0.5) * R0 * 1.1, y = (R2() - 0.5) * R0 * 0.8, r = R0 * 0.09; s += `<path d="M${r1(x - r)} ${r1(y)}a${r1(r)} ${r1(r)} 0 1 1 ${r1(r * 1.4)} ${r1(r * 0.8)}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`; }
      s += '</g>';
      // beat flash: a burst pops on each beat (a T3 local beat)
      if (P.beatT != null && P.beatT < 0.14) s += Kit.impactBurst({ x: cx + P.beatDx * R0, y: cy - R0 * 0.3, r: R0 * 0.32, points: 10, seed: P.beat + 1, color: C.gold });
      // the routed target bolts off (a stretched smear with a three-puff trail)
      if (P.bolter && P.t > P.dur * 0.55) {
        const u = (P.t - P.dur * 0.55) / (P.dur * 0.45), bx = cx + R0 * (0.9 + u * 2.4), by = cy - R0 * (0.3 + u * 0.8);
        for (let i = 1; i <= 3; i++) s += Kit.dustCloud({ x: bx - i * 46, y: by + i * 16, r: 26 - i * 5, puffs: 3, seed: i, lw: 3 });
        s += `<g transform="translate(${r1(bx)} ${r1(by)}) rotate(-18) scale(1.25 0.85)">${Kit.cat({ ...P.bolter, pose: 'side-pounce', x: 0, y: 30, scale: 0.85, expr: 'shock', shadow: false, outline: 'sage' })}</g>`;
      }
    } else {
      // out: one big burst drawing, then the cloud blows apart into four puffs over the revealed scene
      const u = P.outT / 0.4;
      if (u < 0.2) s += Kit.impactBurst({ x: cx, y: cy, r: R0 * 1.3, points: 14, seed: 9, color: C.gold });
      for (let i = 0; i < 4; i++) { const a = Math.PI * (0.25 + i * 0.5), d = R0 * (0.3 + u * 1.3); if (u < 1) s += Kit.dustCloud({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.7, r: R0 * 0.42 * (1 - u * 0.5), puffs: 5, seed: i + 2, lw: 5 }); }
    }
    return s;
  }
}

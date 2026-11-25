// PROTOTYPE - NOT FOR PRODUCTION
// Street (exploration) HUD, design/ux/hud.md §3: phase dial (TR), Patch tag = the street's influence readout
// (TL: stamp, Keeper's Clowder emblem, 1-4 wisps, cracked-wisp when your post is below Strong; NO number, NO bar,
// OR-08), the anger puff, world-anchored interact prompts with the Spray hold ring (E), the Head Home prompt and
// hint cards (BC keep-out band only), the roaming-Boss call on the edge ring, the sniff-to-discover fill ring and
// tape star, and the pickup tick. Kit CSS (kit-assets.js); sizes are 1080p values scaled by min(vw/1920, vh/1080).
// Crossing the garden wall fades the street HUD (hud.md §3.5: 800 ms in, 400 ms out).
import { KIT_CSS } from './combat/kit-assets.js';
import { Kit } from '../render/vfx/sprites.js';
import { GLYPH } from '../render/scent.js';

const C = Kit.C;
const CSS = `
.sh { position:fixed; inset:0; pointer-events:none; font-family:var(--font); color:var(--ink); z-index:30; transition:opacity .8s; }
.sh * { box-sizing:border-box; }
.sh-c { position:absolute; }
.sh-tr { right:0; top:0; transform-origin:100% 0; }
.sh-tl { left:0; top:0; transform-origin:0 0; }
.sh-bc { left:50%; bottom:0; transform-origin:50% 100%; }
.sh-dial { position:absolute; right:34px; top:26px; filter:drop-shadow(3px 4px 0 rgba(110,106,168,.45)); transition:transform .4s; transform-origin:100% 0; }
.sh-dial.big { transform:scale(1.35); }
.sh-tag { position:absolute; left:34px; top:92px; transition:opacity .35s, transform .35s; }
.sh-tag.off { opacity:0; transform:translateY(-10px); }
.sh-tag .nm { font:800 26px/1 var(--font); color:var(--cocoa); max-width:340px; }
.sh-tag .crack { margin-left:-6px; }
.sh-puff { position:absolute; left:360px; top:64px; opacity:0; }
.sh-puff.go { animation:shpuff 1.2s steps(6) forwards; }
@keyframes shpuff { 0% { opacity:1; transform:translate(0,0) scale(.6); } 60% { opacity:1; transform:translate(16px,-34px) scale(1); } 100% { opacity:0; transform:translate(26px,-60px) scale(1.15); } }
.sh-world > * { position:absolute; transform:translate(-50%,-100%); white-space:nowrap; }
.sh-prompt { transform-origin:50% 100%; }
.sh-key { display:inline-flex; align-items:center; justify-content:center; min-width:46px; height:46px; padding:0 8px; border-radius:14px; background:var(--cocoa); color:var(--cream); font:800 26px/1 var(--font); }
.sh-ring { position:absolute; left:-17px; top:-17px; z-index:2; pointer-events:none; }
.sh-hint { position:absolute; left:50%; bottom:150px; transform:translateX(-50%); transition:opacity .4s; white-space:nowrap; }
.sh-home { position:absolute; left:50%; bottom:236px; transform:translateX(-50%); transition:opacity .4s; white-space:nowrap; }
.sh-off { opacity:0; }
.sh-edge { position:absolute; transform:translate(-50%,-50%); transition:opacity .4s; }
.sh-edge .arrow { position:absolute; left:50%; top:50%; width:0; height:0; }
.sh-sniff { position:absolute; transform:translate(-50%,-50%); }
.sh-tape { position:absolute; transform:translate(-50%,-100%); animation:shtape .9s steps(4) forwards; }
@keyframes shtape { 0% { transform:translate(-50%,-80%) scale(.4); } 50% { transform:translate(-50%,-110%) scale(1.15); } 100% { transform:translate(-50%,-100%) scale(1); } }
.sh-tick { position:absolute; right:40px; top:178px; transition:opacity .3s; }
.sh-infl { position:absolute; left:40px; top:176px; display:flex; align-items:center; gap:10px; transition:opacity .4s, transform .4s; }
.sh-infl.off { opacity:0; transform:translateY(-8px); }
.sh-bar { position:relative; width:330px; height:22px; border-radius:12px 14px 12px 14px; background:var(--recessed); border:4px solid var(--cocoa); overflow:hidden; box-shadow:3px 4px 0 rgba(110,106,168,.45); }
.sh-bar i { position:absolute; top:0; bottom:0; transition:width .9s cubic-bezier(.3,1.4,.5,1), left .9s; }
.sh-bar .b { left:0; background:var(--gold); border-right:3px solid var(--ink); }
.sh-bar.pulse { animation:shpulse .5s steps(3) 2; }
@keyframes shpulse { 50% { transform:scale(1.06); } }
.sh-crown { filter:grayscale(1) opacity(.45); transition:filter .4s, transform .4s; }
.sh-crown.lit { filter:none; transform:scale(1.18) rotate(-6deg); }
.sh-card { font:800 24px/1 var(--font); color:var(--cocoa); background:var(--cream); border:3px solid var(--cocoa); border-radius:16px; padding:6px 12px; white-space:nowrap; }
.sh-num { position:absolute; transform:translate(-50%,-100%); font:900 44px/1 var(--font); -webkit-text-stroke:7px var(--ink); paint-order:stroke fill; white-space:nowrap; animation:shnum 1.7s steps(10) forwards; }
@keyframes shnum { 0% { transform:translate(-50%,-60%) scale(.5); opacity:1; } 15% { transform:translate(-50%,-100%) scale(1.15); } 70% { opacity:1; } 100% { transform:translate(-50%,-190%) scale(1); opacity:0; } }
.sh-edge .arr { position:absolute; left:50%; top:50%; width:0; height:0; border-left:14px solid transparent; border-right:14px solid transparent; border-bottom:22px solid var(--ink); transform-origin:50% 0; }
`;
const svgOf = (inner, s = 48) => `<svg viewBox="-24 -24 48 48" width="${s}" height="${s}" overflow="visible">${inner}</svg>`;

export class StreetHUD {
  constructor() {
    if (!document.getElementById('kit-css')) { const st = document.createElement('style'); st.id = 'kit-css'; st.textContent = KIT_CSS; document.head.appendChild(st); }
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const el = this.el = document.createElement('div'); el.className = 'sh';
    el.innerHTML = `<div class="sh-c sh-tr"><div class="sh-dial"></div><div class="sh-tick k-pill k-pill--cream sh-off"></div></div>
      <div class="sh-c sh-tl"><div class="sh-tag k-patchtag off"></div><div class="sh-infl off"><div class="sh-bar"><i class="b"></i><i class="r1"></i><i class="r2"></i><i class="r3"></i></div><span class="sh-crown"></span><span class="sh-card" style="display:none"></span></div><div class="sh-puff"></div></div>
      <div class="sh-world"></div>
      <div class="sh-c sh-bc"><div class="sh-hint k-bubble k-bubble--notail sh-off" style="padding:16px 30px;font-size:30px"></div><div class="sh-home k-prompt k-prompt--hold sh-off"></div></div>
      <div class="sh-edges"></div>`;
    document.body.appendChild(el);
    this.q = (s) => el.querySelector(s);
    this.prompts = new Map(); this.dialKey = ''; this.tagUntil = 0; this.tagKey = ''; this.hintUntil = 0; this.tickUntil = 0; this.edgeUntil = 0; this.t = 0; this.scaleK = 1;
    this.layout(); addEventListener('resize', () => this.layout());
  }
  layout() {
    const k = this.scaleK = Math.min(innerWidth / 1920, innerHeight / 1080) * Math.max(1, 0.85 / Math.max(0.5, Math.min(innerWidth / 1920, innerHeight / 1080)) ** 0.25);
    for (const s of ['.sh-tr', '.sh-tl', '.sh-bc']) this.q(s).style.transform = (s === '.sh-bc' ? 'translateX(-50%) ' : '') + `scale(${k})`;
  }
  /** The whole street HUD fades crossing the garden wall (hud.md §3.5). */
  setHome(home) { this.el.style.transition = `opacity ${home ? 0.8 : 0.4}s`; this.el.style.opacity = home ? 0 : 1; }
  dial(phase, t, big) {
    const key = `${phase}:${(t * 40) | 0}`; if (key !== this.dialKey) { this.dialKey = key; this.q('.sh-dial').innerHTML = Kit.ui.phaseDial({ phase, t, size: 150 }); }
    this.q('.sh-dial').classList.toggle('big', !!big);
  }
  /** Patch tag: shown 3 s on entering a Patch and 2 s after any mark (the wisps change in place). */
  tag(p, secs) {
    const col = p.clowder ? p.clowder.color : C.cream, emb = p.owner === 'bell' ? GLYPH.bell() : p.owner === 'wallSitters' ? GLYPH.brick() : '';
    const fading = p.fading != null ? p.fading : (p.owner === 'bell' && p.scent < 60);
    const key = `${p.id}:${p.owner}:${p.wisps}:${fading}`;
    if (key !== this.tagKey) {
      this.tagKey = key;
      this.q('.sh-tag').innerHTML = `${svgOf(`<path d="M-20 14V-6l20 -12l20 12V14Z" fill="${C.recessed}" stroke="${C.cocoa}" stroke-width="3" stroke-linejoin="round"/><path d="M-8 14v-12h16v12" fill="${C.cream}" stroke="${C.cocoa}" stroke-width="3"/>`, 52)}<span class="nm">${p.name}</span>${emb ? svgOf(emb, 44) : ''}${Kit.ui.wispRow({ n: p.wisps, color: col, size: 40 })}${fading ? `<span class="crack">${svgOf(GLYPH.cracked(), 40)}</span>` : ''}`;
    }
    this.tagUntil = Math.max(this.tagUntil, this.t + secs);
  }
  /** District influence on the street (owner C-direction, review M2-r1 fix 3): Bell gold from the left, rival Clowders from the
   *  right, the open gap between, the Boss's crown at the full end (lit at 100). Shown with the Patch tag and 4 s after a change. */
  influence(bar, change, secs = 4) {
    const q = (s) => this.q('.sh-infl ' + s), W = 100, rivals = [['wall_sitters', C.sage], ['strays', '#5A4E66'], ['outsiders', '#4E9DA6']];
    q('.b').style.width = `${bar.bell / W * 100}%`;
    let right = 0; rivals.forEach(([k, col], i) => { const v = bar[k] || 0; const e = q('.r' + (i + 1)); e.style.background = col; e.style.width = `${v / W * 100}%`; e.style.left = `${100 - (right + v) / W * 100}%`; right += v; });
    const cr = q('.sh-crown'); if (!cr.innerHTML) cr.innerHTML = svgOf(GLYPH.crown(), 46); cr.classList.toggle('lit', bar.bell >= 100);
    const card = q('.sh-card');
    if (change && change.from != null && change.from !== bar.bell) { card.textContent = `Hidamari ${change.from} \u2192 ${bar.bell}`; card.style.display = ''; const b = q('.sh-bar'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); this.cardUntil = this.t + secs; }
    this.inflUntil = Math.max(this.inflUntil || 0, this.t + secs);
  }
  /** A Scent change pops at the post: "48 \u2192 90" or "\u221230", in the band's Clowder colour. */
  scentPop(screen, text, color) {
    if (!screen) return; const e = document.createElement('div'); e.className = 'sh-num'; e.textContent = text; e.style.color = color;
    e.style.left = screen.x + 'px'; e.style.top = screen.y + 'px'; e.style.fontSize = `${Math.max(34, 64 * this.scaleK)}px`; this.el.appendChild(e); setTimeout(() => e.remove(), 1800);
  }
  angerPuff(big) {
    const e = this.q('.sh-puff'); e.innerHTML = svgOf(Kit.dustCloud({ x: 0, y: 0, r: big ? 20 : 14, puffs: 5, seed: 3, lw: 3 }), big ? 76 : 58); e.classList.remove('go'); void e.offsetWidth; e.classList.add('go');
  }
  hint(text, secs = 4) { const h = this.q('.sh-hint'); h.textContent = text; this.hintUntil = this.t + secs; }
  pickup(text) { const e = this.q('.sh-tick'); e.innerHTML = `${svgOf(GLYPH.sparkle(), 34)} ${text}`; this.tickUntil = this.t + 1.5; }
  /** World-anchored prompts: list of {id, x, y (screen px), verb: 'spray'|'sniff'|'nap'|'rub'|'home', hold 0..1, label}. */
  prompts_(list) {
    const host = this.q('.sh-world'), seen = new Set();
    for (const p of list) {
      seen.add(p.id); let e = this.prompts.get(p.id);
      if (!e) { e = document.createElement('div'); e.className = 'sh-prompt k-prompt'; host.appendChild(e); this.prompts.set(p.id, e); e.dataset.key = ''; }
      const key = `${p.verb}:${p.label || ''}`;
      if (e.dataset.key !== key) {
        e.dataset.key = key;
        const icon = p.verb === 'rub' ? GLYPH.brick() : Kit.ui.icon({ name: p.verb === 'claim' || p.verb === 'counter' || p.verb === 'rescue' ? 'spray' : p.verb, size: 40, color: C.gold }).replace(/^<svg[^>]*>|<\/svg>$/g, '');
        e.innerHTML = `<span style="position:relative;display:inline-flex"><span class="sh-key">E</span><svg class="sh-ring" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="none" stroke="${C.ink}" stroke-width="11" opacity=".25"/><circle class="hr" cx="40" cy="40" r="34" fill="none" stroke="${C.gold}" stroke-width="8" stroke-linecap="round" stroke-dasharray="214" stroke-dashoffset="214" transform="rotate(-90 40 40)"/></svg></span>${svgOf(icon, 42)}${p.label ? `<span style="font:800 24px/1 var(--font);color:var(--cocoa)">${p.label}</span>` : ''}`;
      }
      const k = this.scaleK; e.style.left = p.x + 'px'; e.style.top = p.y + 'px'; e.style.transform = `translate(-50%,-100%) scale(${k})`;
      e.querySelector('.hr').setAttribute('stroke-dashoffset', String(214 * (1 - (p.hold || 0))));
      e.querySelector('.sh-ring').style.opacity = p.hold > 0 ? 1 : 0.55;
    }
    for (const [id, e] of this.prompts) if (!seen.has(id)) { e.remove(); this.prompts.delete(id); }
  }
  homePrompt(on) { const h = this.q('.sh-home'); if (on && !h.innerHTML) h.innerHTML = `${Kit.ui.paw({ size: 38, fill: C.gold })}<span class="sh-key">H</span>`; h.classList.toggle('sh-off', !on); }
  /** Edge ring cue toward a world point (screen-projected): the roaming-Boss call (crown pom + yowl contour). */
  edgeCall(screen, secs) { this.edge = screen; this.edgeUntil = this.t + secs; }
  /** Pinned edge badge toward a world target: {x, y, behind} from the projector; null hides it. */
  edgeTrack(screen) { this.edgeT = screen; }
  sniffRing(screen, k) {
    let e = this.q('.sh-sniff');
    if (!screen) { if (e) e.remove(); return; }
    if (!e) { e = document.createElement('div'); e.className = 'sh-sniff'; this.el.appendChild(e); e.innerHTML = `<svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="${C.ink}" stroke-width="7" opacity=".35"/><circle class="f" cx="60" cy="60" r="48" fill="none" stroke="${C.cream}" stroke-width="5" stroke-dasharray="302" stroke-dashoffset="302" transform="rotate(-90 60 60)"/></svg>`; }
    e.style.left = screen.x + 'px'; e.style.top = screen.y + 'px'; e.querySelector('.f').setAttribute('stroke-dashoffset', String(302 * (1 - k)));
  }
  tapeStar(screen) {
    const e = document.createElement('div'); e.className = 'sh-tape'; e.style.left = screen.x + 'px'; e.style.top = screen.y + 'px';
    e.innerHTML = svgOf(`${Kit.sparkle({ x: 0, y: 0, r: 20, fill: C.gold, lw: 3 })}<path d="M-26 6l52 -12" stroke="${C.cream}" stroke-width="9" opacity=".9"/>`, 70); this.el.appendChild(e); setTimeout(() => e.remove(), 2600);
  }
  update(dt) {
    this.t += dt;
    this.q('.sh-tag').classList.toggle('off', this.t > this.tagUntil);
    this.q('.sh-hint').classList.toggle('sh-off', this.t > this.hintUntil);
    this.q('.sh-tick').classList.toggle('sh-off', this.t > this.tickUntil);
    this.q('.sh-infl').classList.toggle('off', this.t > Math.max(this.inflUntil || 0, this.tagUntil));
    if (this.t > (this.cardUntil || 0)) this.q('.sh-card').style.display = 'none';
    // the roaming-Boss call: pinned on the edge ring toward him, with an arrow (hud.md §3.1), while he is off-screen
    const edges = this.q('.sh-edges'), tgt = this.edgeT || (this.t < this.edgeUntil ? this.edge : null);
    if (tgt && (tgt.off || this.t < this.edgeUntil)) {
      if (!edges.innerHTML) edges.innerHTML = `<div class="sh-edge k-prompt" style="padding:6px"><span class="arr"></span>${svgOf(GLYPH.crown(), 56)}${svgOf(`<path d="M-18 -6q6 -10 12 0t12 0t12 0" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M-18 -6q6 -10 12 0t12 0t12 0" fill="none" stroke="${C.yowl}" stroke-width="2.6" stroke-linecap="round"/>`, 44)}</div>`;
      const e = edges.firstChild, cx = innerWidth / 2, cy = innerHeight / 2;
      let dx = tgt.x - cx, dy = tgt.y - cy; if (tgt.behind) { dx = -dx; dy = -dy; } if (Math.abs(dx) + Math.abs(dy) < 1) dy = 1;
      const mx = cx - 90, my = cy - 90 * this.scaleK - 60, k = Math.min(mx / Math.abs(dx || 1e-3), my / Math.abs(dy || 1e-3), tgt.behind || tgt.off ? 1e9 : 1);
      const px = cx + dx * Math.min(k, 1e6), py = cy + dy * Math.min(k, 1e6);
      e.style.left = Math.min(innerWidth - 90, Math.max(90, px)) + 'px'; e.style.top = Math.min(innerHeight - 150, Math.max(330 * this.scaleK, py)) + 'px'; e.style.opacity = 1;
      e.querySelector('.arr').style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI + 90}deg) translate(-50%, -64px)`;
    } else if (edges.firstChild) edges.firstChild.style.opacity = 0;
  }
}

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
.sh-ring { position:absolute; left:-6px; top:-6px; }
.sh-hint { position:absolute; left:50%; bottom:150px; transform:translateX(-50%); transition:opacity .4s; }
.sh-home { position:absolute; left:50%; bottom:236px; transform:translateX(-50%); transition:opacity .4s; }
.sh-off { opacity:0; }
.sh-edge { position:absolute; transform:translate(-50%,-50%); transition:opacity .4s; }
.sh-edge .arrow { position:absolute; left:50%; top:50%; width:0; height:0; }
.sh-sniff { position:absolute; transform:translate(-50%,-50%); }
.sh-tape { position:absolute; transform:translate(-50%,-100%); animation:shtape .9s steps(4) forwards; }
@keyframes shtape { 0% { transform:translate(-50%,-80%) scale(.4); } 50% { transform:translate(-50%,-110%) scale(1.15); } 100% { transform:translate(-50%,-100%) scale(1); } }
.sh-tick { position:absolute; right:40px; top:178px; transition:opacity .3s; }
`;
const svgOf = (inner, s = 48) => `<svg viewBox="-24 -24 48 48" width="${s}" height="${s}" overflow="visible">${inner}</svg>`;

export class StreetHUD {
  constructor() {
    if (!document.getElementById('kit-css')) { const st = document.createElement('style'); st.id = 'kit-css'; st.textContent = KIT_CSS; document.head.appendChild(st); }
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const el = this.el = document.createElement('div'); el.className = 'sh';
    el.innerHTML = `<div class="sh-c sh-tr"><div class="sh-dial"></div><div class="sh-tick k-pill k-pill--cream sh-off"></div></div>
      <div class="sh-c sh-tl"><div class="sh-tag k-patchtag off"></div><div class="sh-puff"></div></div>
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
    const fading = p.owner === 'bell' && p.scent < 60;
    const key = `${p.id}:${p.owner}:${p.wisps}:${fading}`;
    if (key !== this.tagKey) {
      this.tagKey = key;
      this.q('.sh-tag').innerHTML = `${svgOf(`<path d="M-20 14V-6l20 -12l20 12V14Z" fill="${C.recessed}" stroke="${C.cocoa}" stroke-width="3" stroke-linejoin="round"/><path d="M-8 14v-12h16v12" fill="${C.cream}" stroke="${C.cocoa}" stroke-width="3"/>`, 52)}<span class="nm">${p.name}</span>${emb ? svgOf(emb, 44) : ''}${Kit.ui.wispRow({ n: p.wisps, color: col, size: 40 })}${fading ? `<span class="crack">${svgOf(GLYPH.cracked(), 40)}</span>` : ''}`;
    }
    this.tagUntil = Math.max(this.tagUntil, this.t + secs);
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
        e.innerHTML = `<span style="position:relative;display:inline-flex"><svg class="sh-ring" width="58" height="58" viewBox="0 0 58 58"><circle cx="29" cy="29" r="25" fill="none" stroke="${C.gold}" stroke-width="6" stroke-dasharray="157" stroke-dashoffset="157" transform="rotate(-90 29 29)"/></svg><span class="sh-key">E</span></span>${svgOf(icon, 42)}${p.label ? `<span style="font:800 24px/1 var(--font);color:var(--cocoa)">${p.label}</span>` : ''}`;
      }
      const k = this.scaleK; e.style.left = p.x + 'px'; e.style.top = p.y + 'px'; e.style.transform = `translate(-50%,-100%) scale(${k})`;
      e.querySelector('circle').setAttribute('stroke-dashoffset', String(157 * (1 - (p.hold || 0))));
    }
    for (const [id, e] of this.prompts) if (!seen.has(id)) { e.remove(); this.prompts.delete(id); }
  }
  homePrompt(on) { const h = this.q('.sh-home'); if (on && !h.innerHTML) h.innerHTML = `${Kit.ui.paw({ size: 38, fill: C.gold })}<span class="sh-key">H</span>`; h.classList.toggle('sh-off', !on); }
  /** Edge ring cue toward a world point (screen-projected): the roaming-Boss call (crown pom + yowl contour). */
  edgeCall(screen, secs) { this.edge = screen; this.edgeUntil = this.t + secs; }
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
    const edges = this.q('.sh-edges');
    if (this.t < this.edgeUntil && this.edge) {
      if (!edges.innerHTML) edges.innerHTML = `<div class="sh-edge k-prompt" style="padding:6px">${svgOf(GLYPH.crown(), 56)}${svgOf(`<path d="M-18 -6q6 -10 12 0t12 0t12 0" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M-18 -6q6 -10 12 0t12 0t12 0" fill="none" stroke="${C.yowl}" stroke-width="2.6" stroke-linecap="round"/>`, 44)}</div>`;
      const e = edges.firstChild, m = 70; e.style.left = Math.min(innerWidth - m, Math.max(m, this.edge.x)) + 'px'; e.style.top = Math.min(innerHeight - m, Math.max(m, this.edge.y)) + 'px'; e.style.opacity = 1;
    } else if (edges.firstChild) edges.firstChild.style.opacity = 0;
  }
}

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Standoff on the street (hud.md §4.5 Standoff row; plan §2.2 4:45 and 7:05; mock design/previews/05-rival-standoff.png):
// the rival steps into the lane and blocks the way; its name-card slams into the upper third (slanted Clowder banner,
// chestnut portrait, claw pips for its role, the sting contour, its storm mark if it is the arc lead) and one taunt
// balloon carries its line. A memory-citing line cannot be skipped for 1 s: a fill ring runs on the confirm glyph.
// Lines come from the nemesis bark selector when the town is present; otherwise the slice's fixed lines (plan §2.2).
import * as THREE from 'three';
import { Kit } from '../render/vfx/sprites.js';
import '../../../../design/previews/rival-helpers.js';

const K = Kit, C = Kit.C, RV = globalThis.RV;
const CSS = `
.so { position:fixed; inset:0; z-index:34; pointer-events:none; font-family:var(--font); color:var(--ink); display:none; }
.so.on { display:block; }
.so.test * { animation:none !important; transition:none !important; }
.so-tl { position:absolute; left:0; top:0; transform-origin:0 0; }
.so-tr { position:absolute; right:0; top:0; transform-origin:100% 0; }
.so-br { position:absolute; right:0; bottom:0; transform-origin:100% 100%; }
.so-card { position:absolute; left:40px; top:36px; display:flex; align-items:center; animation:soslam .2s steps(3); }
@keyframes soslam { 0% { transform:translateX(-140px) scale(1.25); } 66% { transform:translateX(12px) scale(.98); } 100% { transform:none; } }
.so-por { position:relative; z-index:2; filter:drop-shadow(3px 4px 0 rgba(110,106,168,.5)); }
.so-ban { position:relative; margin-left:-30px; height:124px; padding:0 110px 0 54px; display:flex; flex-direction:column; justify-content:center; background:var(--sage); border:4px solid var(--ink); border-left:0;
  clip-path:polygon(0 0,100% 0,calc(100% - 50px) 100%,0 100%); }
.so-ban.gold { background:var(--gold); }
.so-ban .nm { font:800 58px/1 var(--font); letter-spacing:.01em; display:flex; align-items:center; gap:14px; }
.so-ban .ti { font:700 30px/1.1 var(--font); margin-top:6px; display:flex; align-items:center; gap:10px; white-space:nowrap; }
.so-ban .pips { display:inline-flex; gap:4px; margin-left:6px; }
.so-sting { position:absolute; right:58px; top:16px; }
.so-storm { position:absolute; left:86px; top:-6px; z-index:3; }
.so-bub { position:absolute; right:180px; top:72px; width:720px; animation:sopop .18s steps(3) .12s both; }
.so-bub .k-ribbon { height:42px; font-size:28px; }
@keyframes sopop { 0% { transform:scale(.3); opacity:0; } 66% { transform:scale(1.06); opacity:1; } 100% { transform:none; } }
.so-bub .mem { display:inline-flex; align-items:center; gap:6px; margin-left:12px; font:800 20px/1 var(--font); color:var(--cocoa); vertical-align:middle; }
.so-go { position:absolute; right:34px; bottom:30px; display:flex; gap:12px; pointer-events:auto; }
.so-go .k-prompt { position:relative; white-space:nowrap; }
.so-go .lock { opacity:.55; }
.so-ring { position:absolute; left:2px; top:50%; transform:translateY(-50%); }
.so-bands { position:absolute; inset:0; pointer-events:none; }
.so-band { position:absolute; height:180px; top:42%; opacity:.0; animation:soband .25s steps(3) forwards; }
.so-band.l { left:0; width:44%; background:linear-gradient(90deg, rgba(242,176,30,.0), rgba(242,176,30,.32)); clip-path:polygon(0 0,92% 0,100% 50%,92% 100%,0 100%); }
.so-band.r { right:0; width:44%; background:linear-gradient(270deg, rgba(255,61,139,.0), rgba(255,61,139,.26)); clip-path:polygon(8% 0,100% 0,100% 100%,8% 100%,0 50%); }
@keyframes soband { to { opacity:1; } }
`;
const ROLE_PIPS = { tough: 1, captain: 2, boss: 3 };
/** Slice lines (plan §2.2): L1D1 first meeting; L1D2 the memory line; Life 2 greetings by branch. */
const FALLBACK = {
  l1d1: { text: 'Nice bell, Collar. Does it ring when you run?', memory: false },
  l1d2: { text: 'I ran yesterday. Not off my own post, Collar.', memory: true },
  A: { text: 'Noses still good, Collar. My post, though.', memory: true },
};

export class Standoff {
  constructor() {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    this.el = document.createElement('div'); this.el.className = 'so'; this.el.setAttribute('role', 'dialog'); this.el.setAttribute('aria-label', 'Standoff');
    if (new URLSearchParams(location.search).get('test') === '1') this.el.classList.add('test');
    document.body.appendChild(this.el); this.isOpen = false; this.t = 0;
  }
  /** The line: the nemesis selector's standoff pick when present (its memory family is unskippable), else the seeds. */
  lineFor(town, id, branch, day = 2) {
    try {
      const B = globalThis.__nemesisBarks;
      if (town && B && B.standoffTrigger && B.selectLine) {
        const cat = town.cats ? (town.cats[id] || (town.cat && town.cat(id))) : null;
        const trig = B.standoffTrigger(town, cat || id, {});
        const pick = B.selectLine(town, id, trig, {}, { record: false });
        if (pick && pick.text) return { text: pick.text, memory: (pick.family || B.familyOf && B.familyOf(pick.tag || '')) === 'memory' || !!pick.memory };
      }
    } catch (e) { console.warn('nemesis line unavailable; using the slice line', e); }
    if (branch === 'A') return FALLBACK.A;
    return day <= 1 ? FALLBACK.l1d1 : FALLBACK.l1d2;
  }
  /** o: { cat (board model cat), line {text, memory}, onFight, rival3d (optional cat to stage), title } */
  open(o) {
    this.o = o; this.isOpen = true; this.t = 0; this.done = false; this.t0 = performance.now(); this.test = this.el.classList.contains('test');
    const c = o.cat, k = Math.min(innerWidth / 1920, innerHeight / 1080);
    const pips = '<span class="pips">' + '/'.repeat(ROLE_PIPS[c.role] || 1).split('').map(() => `<svg width="14" height="30" viewBox="-7 -15 14 30"><path d="M3 -13L-3 13" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/></svg>`).join('') + '</span>';
    const sting = `<svg width="120" height="44" viewBox="0 -22 120 44"><path d="M2 8L18 8L26 -10L34 12L44 -2L58 -2L66 -16L76 14L86 2L118 2" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const storm = c.marks && c.marks.storm ? `<div class="so-storm">${RV.storm({ x: 0, y: 0, s: 0.7 }).replace(/^/, '<svg width="110" height="90" viewBox="-55 -52 110 90" overflow="visible">') + '</svg>'}</div>` : '';
    this.el.innerHTML = `<div class="so-bands"><div class="so-band l"></div><div class="so-band r"></div></div>
      <div class="so-tl" style="transform:scale(${k})"><div class="so-card"><div class="so-por">${K.ui.portrait({ size: 150, ring: C.cream, bg: '#F7C99A', cat: { ...c.kit, expr: 'angry', outline: 'ink', scars: c.scars } })}</div>${storm}
        <div class="so-ban${c.clowder === 'bell' ? ' gold' : ''}"><div class="nm">${c.name.toUpperCase()}</div><div class="ti">${c.title || ''}${c.titleWord ? ` · ${c.titleWord}` : ''}${pips}<span style="margin-left:10px">${sting}</span></div></div></div></div>
      <div class="so-tr" style="transform:scale(${k})"><div class="k-bubble so-bub"><span class="k-ribbon k-ribbon--${c.clowder === 'bell' ? 'gold' : 'sage'}">${c.name}</span>${o.line.text}${o.line.memory ? `<span class="mem">${RV.stamp(RV.GLYPH.burst, { size: 30, color: C.cream })}remembers</span>` : ''}</div></div>
      <div class="so-br" style="transform:scale(${k})"><div class="so-go"><span class="k-prompt" data-a="fight"><span class="so-ring"></span>${K.ui.faceButtons({ size: 42, lit: 's' })}Fight</span></div></div>`;
    this.el.querySelector('[data-a=fight]').onclick = () => this.confirm();
    this.el.classList.add('on'); this.frame(0);
  }
  /** The memory line holds the confirm for 1 s (hud.md §4.5). */
  get locked() { return this.o && this.o.line.memory && this.t < (this.o.line.unskippable || 1.0); }
  confirm() { if (!this.isOpen || this.locked) return false; this.close(); if (this.o.onFight) this.o.onFight(); return true; }
  close() { this.isOpen = false; this.el.classList.remove('on'); this.el.innerHTML = ''; }
  key(code) { if (!this.isOpen) return false; if (code === 'Enter' || code === 'Space') this.confirm(); return true; }
  frame(dt) {
    if (!this.isOpen) return;
    // wall-clock, so a slow frame never stretches the 1 s lock (the frame dt is capped at 50 ms)
    this.t = this.test ? this.t + dt : (performance.now() - this.t0) / 1000;
    const ring = this.el.querySelector('.so-ring'), go = this.el.querySelector('[data-a=fight]');
    if (!ring) return;
    if (this.o.line.memory) {
      const f = Math.min(1, this.t / 1.0), a = f * Math.PI * 2, R = 25, x = Math.sin(a) * R, y = -Math.cos(a) * R, large = f > 0.5 ? 1 : 0;
      ring.innerHTML = f >= 1 ? '' : `<svg width="58" height="58" viewBox="-29 -29 58 58"><circle r="${R}" fill="none" stroke="${C.cream}" stroke-width="7"/><path d="M0 ${-R}A${R} ${R} 0 ${large} 1 ${x.toFixed(2)} ${y.toFixed(2)}" fill="none" stroke="${C.gold}" stroke-width="7" stroke-linecap="round"/></svg>`;
      go.classList.toggle('lock', f < 1);
    }
  }
  /** Stage the rival in the lane, blocking the way: ~1.8 m ahead of Mikan, facing her (plan §2.2 7:05). */
  static stage(ctx, cat3d, dist = 1.8) {
    const m = ctx.mikanPos, fwd = new THREE.Vector3(0, 0, -1);
    const p = m.clone().addScaledVector(fwd, dist); p.y = ctx.gAt(p.x, p.z);
    cat3d.object3D.position.copy(p); cat3d.object3D.rotation.y = 0; cat3d.object3D.lookAt(m.x, p.y, m.z);
    cat3d.setGait('idle', 0); if (cat3d.lookAt) cat3d.lookAt(m.clone().add(new THREE.Vector3(0, 0.3, 0)));
    return p;
  }
}

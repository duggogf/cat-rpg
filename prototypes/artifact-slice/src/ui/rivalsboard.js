// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Rivals board: the DOM layer and controller over the 3D diorama (src/render/boardscene.js).
// design/ux/key-screens.md §2 (decluttered per the owner, rivals-board-cleanup.md): at rest only the place name, the
// compact scene strip, one name ribbon per discovered cat, faint answers-to arrows, <= 1 drawn mark per cat and the
// steam puffs; on focus the cat lifts with a Bell-Gold rim, unrelated cats dim toward Wisteria, <= 3 relationship tags
// appear and the card slides up bottom-left. South opens the full Rival card (§3). No fact column, no influence bar.
// Read-only: nothing here changes a cat (§2.11). Labels are DOM positioned each frame from projected 3D anchors.
import * as THREE from 'three';
import { KIT_CSS } from './combat/kit-assets.js';
import { Kit } from '../render/vfx/sprites.js';
import '../../../../design/previews/rival-helpers.js';
import { BoardScene, BOARD } from '../render/boardscene.js';
import { ROLE_WORD, PERS_NAME, ANGER_WORD } from './rivals-model.js';

const K = Kit, C = Kit.C, RV = globalThis.RV;
const ink = C.ink, st2 = `stroke="${ink}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;
const svg = (w, h, vb, inner) => `<svg width="${w}" height="${h}" viewBox="${vb}" overflow="visible">${inner}</svg>`;
/* ------------------------------------------------------------------ pictograms (kit look) */
export const EMBLEM = {
  stone: `<path d="M-11 9V-4Q-11 -11 0 -11Q11 -11 11 -4V9Z" fill="#C8BEB4" ${st2}/><path d="M-6 0H6" ${st2}/>`,
  lantern: `<path d="M-8 -4Q-9 -11 0 -11Q9 -11 8 -4Q9 7 0 9Q-9 7 -8 -4Z" fill="#E8604A" ${st2}/><path d="M-8 -1H8" ${st2}/>`,
  anchor: `<path d="M0 -11V9M-6 -6H6M-10 2Q-8 9 0 9Q8 9 10 2" fill="none" ${st2}/><circle cy="-11" r="2.6" fill="none" ${st2}/>`,
  lighthouse: `<path d="M-5 10L-3 -6H3L5 10Z" fill="${C.cream}" ${st2}/><path d="M-4 -1H4" stroke="#B8738E" stroke-width="3"/><path d="M-4 -6L0 -11L4 -6Z" fill="#B8738E" ${st2}/>`,
  bus: `<path d="M0 10V-2" ${st2}/><circle cy="-6" r="6.5" fill="${C.cream}" ${st2}/><path d="M-3 -6H3" ${st2}/>`,
  bell: `<circle r="9" fill="${C.gold}" ${st2}/><path d="M-5 2H5M0 2V7" fill="none" ${st2}/><circle cx="-3" cy="-4" r="2" fill="${C.cream}"/>`,
};
const TAGICON = {
  rival: svg(28, 28, '-14 -14 28 28', `<path d="M-10 -10L10 10M10 -10L-10 10" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/><path d="M-10 -10l5 1M10 -10l-1 5" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`),
  kin: svg(30, 28, '-15 -14 30 28', `<path d="M-13 10L-8 -11L1 6Z" fill="${C.cream}" ${st2}/><path d="M13 10L8 -11L-1 6Z" fill="${C.cream}" ${st2}/><path d="M-7 3L-6 -4L-2 2ZM7 3L6 -4L2 2Z" fill="${C.pad}"/>`),
  old_boss: svg(30, 26, '-15 -13 30 26', `<path d="M-13 9L-13 -7L-6 1L0 -10L6 1L13 -7L13 9Z" fill="${C.gold}" ${st2}/><path d="M3 -6L8 -2" stroke="${C.cream}" stroke-width="3"/>`),
  old_gang: svg(34, 24, '-17 -12 34 24', `<g fill="${ink}"><circle cx="-11" cy="2" r="3.4"/><circle cx="-3" cy="-2" r="3.4"/><circle cx="5" cy="2" r="3.4"/></g><circle cx="12" cy="-3" r="5" fill="${C.gold}" ${st2}/>`),
};
const TAGWORD = { rival: 'Rival', kin: 'Kin', old_boss: 'Old Boss', old_gang: 'Old Gang' };
const STYLEICON = {
  Bruiser: `<path d="M-11 -2Q-11 -11 -2 -11H7Q12 -11 12 -4V4Q12 11 3 11H-5Q-11 11 -11 4Z" fill="${C.cream}" ${st2}/><path d="M-3 -11V-2M4 -11V-2" fill="none" ${st2}/>`,
  Scrapper: `<path d="M-9 9L-2 -10M-1 10L6 -9M7 9L11 -4" fill="none" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`,
  Prowler: `<path d="M-8 -9Q0 -4 8 -9L3 10Q0 4 -3 10Z" fill="${C.cream}" ${st2}/>`,
  Yowler: `<path d="M-10 6Q-2 0 -10 -6M-3 10Q9 0 -3 -10M4 12Q18 0 4 -12" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`,
  Trickster: `<rect x="-9" y="-9" width="18" height="18" rx="4" fill="${C.cream}" ${st2} transform="rotate(14)"/><circle cx="-3" cy="-3" r="2" fill="${ink}"/><circle cx="3" cy="3" r="2" fill="${ink}"/>`,
};
const PERSGLYPH = {
  braggart: `<path d="M-8 14V-14" fill="none" ${st2}/><path d="M-8 -14Q4 -18 12 -12Q4 -6 -8 -4Z" fill="${C.cream}" ${st2}/>`,
  brooder: `<path d="M0 -14V10M-8 -8H8M-12 2Q-10 12 0 12Q10 12 12 2" fill="none" ${st2}/>`,
  schemer: `<path d="M-14 6L10 -8L14 -4L-10 10Z" fill="${C.cream}" ${st2}/>`,
  fraidy: `<path d="M-2 -12Q10 -12 8 0Q6 10 -4 12" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`,
  stalwart: `<path d="M-10 -12H10V4Q10 12 0 14Q-10 12 -10 4Z" fill="${C.cream}" ${st2}/>`,
  goofball: `<path d="M-12 10Q-12 0 -4 2Q4 4 4 -4Q4 -12 12 -10" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>`,
};
const MOOD = {
  smooth: `<path d="M-15 8Q0 -8 15 8" fill="none" ${st2}/>`,
  bristled: `<path d="M-15 8Q-12 -2 -6 -4L-4 -10L-1 -4L3 -11L5 -4Q14 -2 15 8Z" fill="#8C7FA0" ${st2}/>`,
  arched: `<path d="M-16 10Q-14 -2 -8 -6L-6 -14L-2 -6L2 -15L5 -6L9 -13L10 -4Q16 0 16 10Z" fill="#4A3F55" ${st2}/>`,
  storm: `<path d="M-16 10Q-14 -2 -8 -6L-6 -14L-2 -6L2 -15L5 -6L9 -13L10 -4Q16 0 16 10Z" fill="#2A2232" ${st2}/>`,
  back: `<path d="M-16 0Q-12 -8 0 -10L-2 0Z" fill="${C.cream}" ${st2}/><path d="M16 0Q12 -8 0 -10L2 0Z" fill="${C.cream}" ${st2}/><path d="M-14 4Q0 14 14 4" fill="none" ${st2}/>`,
  level: `<path d="M-14 4L-10 -10L-3 0ZM14 4L10 -10L3 0Z" fill="${C.cream}" ${st2}/><path d="M-12 8Q0 14 12 8" fill="none" ${st2}/>`,
  forward: `<path d="M-12 6L-8 -14L0 2ZM12 6L8 -14L0 2Z" fill="${C.cream}" ${st2}/>`,
  nose_out: `<path d="M-12 6L-8 -14L0 2ZM12 6L8 -14L0 2Z" fill="${C.cream}" ${st2}/><circle cy="9" r="3" fill="${C.pad}" ${st2}/>`,
};
const stamp = (g, col) => RV.stamp(g, { size: 40, color: col || C.cream });
const moon = () => RV.stamp(`<path d="M4 -12A12 12 0 1 0 12 4A9 9 0 1 1 4 -12Z" fill="${C.cream}" ${st2}/>`, { size: 40, color: '#4A3F6E' });
const stormIco = () => svg(30, 26, '-15 -13 30 26', `<path d="${K.blob(K.pomPts(0, -3, 10, 5, 0.16))}" fill="#4A3F55"/><path d="M-1 2L-5 10H0L-2 15L6 5H1L3 2Z" fill="${C.staticYellow}" stroke="${ink}" stroke-width="1.6"/>`);
const sprigIco = (s = 1) => svg(34 * s, 34 * s, '-6 -30 34 34', RV.leafSprig({ x: 0, y: 0, s: 1, rot: -10 }));
const tapeStar = `<svg class="rb-star" width="30" height="22" viewBox="-15 -11 30 22"><path d="M-14 -7H14V7H-14Z" fill="#F6E7B8"/><path d="M0 -6l2 4.4l4.8 .6l-3.5 3.4l.9 4.8l-4.2 -2.3l-4.2 2.3l.9 -4.8l-3.5 -3.4l4.8 -.6z" fill="${C.gold}" stroke="${ink}" stroke-width="1.3"/></svg>`;
const crownSvg = (lit) => svg(60, 40, '-30 -20 60 40', K.inked('M-26 10L-26 -10L-13 0L0 -18L13 0L26 -10L26 10Z', lit ? C.gold : 'none', 2.6));
const puffsSvg = (n, furious) => { let s = ''; const P = [[-92, -10, 22, 2], [92, -22, 25, 7], [0, -56, 21, 4]]; for (let i = 0; i < n; i++) { const [x, y, r, sd] = P[i]; s += K.dustCloud({ x, y, r: r * (furious ? 1.22 : 1), puffs: 4, seed: sd }); } return svg(260, 120, '-130 -90 260 120', s); };
const btn = (lit, label) => `<span class="k-prompt">${K.ui.faceButtons({ size: 42, lit })}${label}</span>`;
const clowderRibbon = (c) => (c.clowder === 'bell' ? 'gold' : c.clowder === 'outsiders' ? 'stray' : 'sage');
const gPict = (g) => (g >= 75 ? 'storm' : g >= 50 ? 'arched' : g >= 25 ? 'bristled' : 'smooth');
const rPict = (r) => (r >= 75 ? 'nose_out' : r >= 50 ? 'forward' : r >= 25 ? 'level' : 'back');

const CSS = `
.rb { position:fixed; inset:0; z-index:35; font-family:var(--font); color:var(--ink); user-select:none; display:none; }
.rb.on { display:block; }
.rb.test *, .rb.test { animation:none !important; transition:none !important; }
.rb .k-prompt { white-space:nowrap; }
.rb-nm .rb-tagslot { position:absolute; left:calc(100% - 4px); top:0; display:flex; }
.rb * { box-sizing:border-box; }
.rb-world, .rb-arrows, .rb-grade { position:absolute; inset:0; pointer-events:none; }
.rb-grade { background:radial-gradient(ellipse 42% 38% at 50% 36%, rgba(255,214,150,.42), rgba(255,214,150,0) 100%), radial-gradient(ellipse 75% 75% at 50% 42%, rgba(110,90,160,0) 60%, rgba(110,90,160,.30) 100%); mix-blend-mode:soft-light; }
.rb-world > * { position:absolute; left:0; top:0; will-change:transform; }
.rb-corner { position:absolute; }
.rb-tl { left:0; top:0; transform-origin:0 0; width:1920px; }
.rb-bl { left:0; bottom:0; transform-origin:0 100%; }
.rb-br { right:0; bottom:0; transform-origin:100% 100%; }
.rb-c { left:50%; top:50%; transform-origin:0 0; }
.rb-hdr { position:absolute; left:24px; top:20px; width:1872px; height:72px; padding:0 22px 0 30px; display:flex; align-items:center; justify-content:space-between; }
.rb-hdr .k-h { font-size:44px; }
.rb-strip { display:flex; align-items:flex-start; gap:10px; pointer-events:auto; }
.rb-sc { position:relative; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; }
.rb-sc.lock { cursor:default; }
.rb-em { width:44px; height:44px; border-radius:50%; background:var(--cream); border:3px solid var(--cocoa); display:flex; align-items:center; justify-content:center; }
.rb-em svg { display:block; }
.rb-sc.lock .rb-em { opacity:.5; }
.rb-pill { display:flex; align-items:center; gap:8px; height:46px; padding:0 18px 0 4px; border-radius:24px 22px 25px 21px; background:var(--cocoa); font:800 28px/1 var(--font); color:var(--cream); }
.rb-pill .rb-em { border-color:var(--ink); }
.rb-dots { display:flex; gap:3px; height:8px; }
.rb-dots i { width:8px; height:8px; border-radius:50%; }
.rb-dots .m { background:var(--cocoa); } .rb-dots .s { border:1.5px solid var(--cocoa); }
.rb-tip { position:absolute; top:58px; left:50%; transform:translateX(-50%); white-space:nowrap; font:700 22px/1 var(--font); background:var(--cream); border:3px solid var(--cocoa); border-radius:12px; padding:6px 10px; display:none; }
.rb-sc:hover .rb-tip { display:block; }
.rb-chip { position:absolute; top:58px; left:50%; transform:translateX(-50%); display:flex; align-items:center; gap:4px; height:36px; padding:0 10px 0 2px; background:var(--cream); border:3px solid var(--ink); border-radius:18px; font:800 20px/1 var(--font); white-space:nowrap; box-shadow:2px 3px 0 rgba(110,106,168,.6); }
.rb-sh { min-width:46px; height:40px; font-size:22px; padding:0 8px; }
.rb-nm { display:flex; align-items:center; transform-origin:50% 0; transition:opacity .12s; }
.rb-nm .k-ribbon { height:40px; font-size:28px; padding:0 26px 0 14px; }
.rb-nm.dim { opacity:.55; }
.rb-nm.focus { filter:drop-shadow(3px 0 0 var(--gold)) drop-shadow(-3px 0 0 var(--gold)) drop-shadow(0 3px 0 var(--gold)) drop-shadow(0 -3px 0 var(--gold)); }
.rb-star { position:absolute; right:8px; top:-12px; }
.rb-tag { margin-left:-4px; display:flex; align-items:center; gap:6px; height:40px; padding:0 14px 0 8px; background:var(--cream); border:3px solid var(--ink); border-radius:8px 12px 10px 12px; box-shadow:2px 3px 0 rgba(110,106,168,.6); font:800 28px/1 var(--font); animation:rbpop .15s steps(3); }
@keyframes rbpop { 0% { transform:scale(.4); } 66% { transform:scale(1.12); } 100% { transform:scale(1); } }
.rb-mark { transform-origin:50% 100%; transition:opacity .12s; }
.rb-mark.dim { opacity:.5; }
.rb-q { width:44px; height:44px; border-radius:50%; background:var(--cream); border:3px solid var(--cocoa); font:800 28px/38px var(--font); text-align:center; color:var(--cocoa); animation:rbpop .15s steps(3); }
.rb-legend { width:150px; padding:10px 12px; background:#EFE3C8; border:3px solid #9C8A72; border-radius:10px 14px 12px 14px; transform-origin:50% 100%; text-align:center; font:800 22px/1.1 var(--font); color:#6E5E4E; box-shadow:2px 3px 0 rgba(110,106,168,.45); }
.rb-legend small { display:block; font:700 18px/1.2 var(--font); margin-top:4px; }
.rb-card { position:absolute; left:24px; bottom:24px; width:676px; min-height:256px; padding:0 0 14px; overflow:visible; transition:transform .1s steps(3), opacity .1s steps(3); }
.rb-card.off { transform:translateY(60px); opacity:0; pointer-events:none; }
.rb-card .head { position:relative; display:flex; align-items:center; gap:12px; margin:-26px 0 0 -10px; height:80px; padding:0 56px 0 12px; width:max-content; max-width:700px;
  background:var(--k-clowder, var(--sage)); color:var(--ink); border:4px solid var(--ink); border-right:0; clip-path:polygon(0 0,100% 0,calc(100% - 36px) 100%,0 100%); font:800 36px/1 var(--font); white-space:nowrap; }
.rb-card .head small { font:700 28px/1 var(--font); }
.rb-card .r { display:flex; align-items:center; gap:10px; padding:6px 24px 0; font:700 28px/1.1 var(--font); color:var(--ink); white-space:nowrap; }
.rb-card .r svg { display:block; flex:none; }
.rb-card .r.rb-cross { white-space:normal; align-items:flex-start; font-size:25px; line-height:1.2; }
.rb-card .r.rb-cross .q { font-weight:600; }
.rb-card .sep { width:3px; height:28px; background:#D9C3A0; margin:0 4px; }
.rb-card .sw { display:inline-flex; align-items:center; height:38px; padding:0 14px; border-radius:20px; background:var(--ink); color:var(--cream); font:800 26px/1 var(--font); }
.rb-card .sp { display:inline-flex; align-items:center; gap:4px; height:38px; padding:0 14px 0 6px; border-radius:20px; background:#E4F0D2; border:3px solid var(--ink); font:800 24px/1 var(--font); }
.rb-card .day { font:800 24px/1 var(--font); color:var(--cocoa); }
.rb-card .q { font-weight:500; overflow:hidden; text-overflow:ellipsis; }
.rb-card .more { margin-left:auto; height:34px; padding:0 12px; border-radius:17px; background:var(--cocoa); color:var(--cream); font:800 20px/34px var(--font); }
.rb-btns { position:absolute; right:24px; bottom:24px; display:flex; gap:12px; align-items:center; pointer-events:auto; }
.rb-btns .k-prompt { cursor:pointer; }
.rb-caption { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); }
.rb-full { position:absolute; left:-760px; top:-470px; width:1520px; height:940px; padding:0; display:none; }
.rb-full.on { display:block; }
.rb-full .ban { display:flex; align-items:center; gap:16px; margin:-26px 0 0 -12px; height:96px; padding:0 70px 0 14px; width:max-content; background:var(--k-clowder,var(--sage)); border:4px solid var(--ink); border-right:0; clip-path:polygon(0 0,100% 0,calc(100% - 44px) 100%,0 100%); font:800 48px/1 var(--font); }
.rb-full .ban small { font:700 32px/1 var(--font); }
.rb-full .cols { display:grid; grid-template-columns:520px 1fr; gap:34px; padding:22px 40px 0; }
.rb-full .lab { font:800 22px/1 var(--font); letter-spacing:.08em; color:var(--cocoa); margin:18px 0 8px; }
.rb-full .row { display:flex; flex-wrap:wrap; align-items:center; gap:10px; font:700 28px/1.2 var(--font); }
.rb-full .pt { display:inline-flex; align-items:center; gap:6px; height:42px; padding:0 14px 0 6px; background:var(--cream); border:3px solid var(--ink); border-radius:8px 12px 10px 12px; font:800 24px/1 var(--font); }
.rb-full .hist { display:flex; flex-direction:column; gap:10px; font:600 26px/1.2 var(--font); }
.rb-full .hist b { font:800 22px/1 var(--font); color:var(--cocoa); min-width:70px; margin-right:10px; display:inline-block; white-space:nowrap; }
.rb-full .stage { height:470px; border-radius:30px; background:var(--recessed); display:flex; align-items:center; justify-content:center; overflow:hidden; }
.rb-full .foot { position:absolute; right:36px; bottom:26px; display:flex; gap:12px; }
.rb-full .legend { position:absolute; left:40px; bottom:30px; font:800 30px/1 var(--font); color:#8C6E58; transform:rotate(-6deg); border:4px solid #B04A3A; color:#B04A3A; padding:8px 18px; border-radius:10px; }
`;

/** Which cats a cat relates to (discovered, ties worded from its own side), capped at 3 tags by priority. */
function relationsOf(m, id) {
  const ties = m.tiesOf(id); const c = m.cats[id];
  return { ties, boss: c && c.answersTo };
}

export class RivalsBoard {
  /** o: { renderer, tex, post, model: () => model, onClose, test } */
  constructor(o) {
    this.o = o; this.scene3 = new BoardScene(o.renderer, o.tex, o.post);
    this.isOpen = false; this.sceneId = 'lane'; this.focus = null; this.hoverT = 0; this.hoverId = null; this.full = false; this.reduceMotion = false;
    if (!document.getElementById('kit-css')) { const st = document.createElement('style'); st.id = 'kit-css'; st.textContent = KIT_CSS; document.head.appendChild(st); }
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const el = this.el = document.createElement('div'); el.className = 'rb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Rivals');
    el.innerHTML = `<div class="rb-grade"></div><svg class="rb-arrows"></svg><div class="rb-world"></div>
      <div class="rb-corner rb-tl"><div class="k-panel k-panel--sm rb-hdr"><span class="k-h"></span><div class="rb-strip"></div></div></div>
      <div class="rb-corner rb-bl"><div class="k-panel rb-card off"></div></div>
      <div class="rb-corner rb-br"><div class="rb-btns"></div></div>
      <div class="rb-corner rb-c"><div class="k-bubble k-bubble--notail rb-caption" style="display:none;padding:16px 30px;font-size:30px"></div><div class="k-panel rb-full"></div></div>`;
    document.body.appendChild(el);
    this.q = (s) => el.querySelector(s);
    this.labels = new Map();
    if (new URLSearchParams(location.search).get('test') === '1') el.classList.add('test');
    el.addEventListener('mousemove', (e) => { this.mouse = { x: e.clientX, y: e.clientY }; });
    el.addEventListener('mousedown', (e) => {
      if (e.target.closest('.rb-strip, .rb-btns, .rb-full')) return;
      if (e.button === 2) { this.back(); return; }
      if (this.full) return;
      const c = this.scene3.pick(e.clientX, e.clientY); if (c) { this.setFocus(c.id, 'mouse'); this.south(); }
    });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('wheel', (e) => { if (!this.full) this.cycle(Math.sign(e.deltaY)); e.preventDefault(); }, { passive: false });
  }
  get model() { return this.m; }
  /** Open on a scene (default: the focused cat's, else the Lane). Returns the ms it took to the first frame. */
  open({ scene, focus = null, model } = {}) {
    const t0 = performance.now();
    this.m = model || (this.o.model && this.o.model());
    this.saved = this.o.saveGlobals ? this.o.saveGlobals() : null;
    this.scene3.build();
    this.scene3.setRoster(this.roster());
    const fc = focus && this.m.cats[focus];
    this.sceneId = scene || (fc ? fc.scene : 'lane');
    this.scene3.setScene(this.sceneId, false);
    this.scene3.layout(innerWidth, innerHeight);
    this.scene3.applyLight(this.o.phase || BOARD.phase);
    this.isOpen = true; this.full = false; this.el.classList.add('on');
    this.focus = null; this.focusBy = null;
    this.drawStatic(); if (focus) this.setFocus(focus, 'key');
    this.frame(0);
    this.openMs = performance.now() - t0;
    return this.openMs;
  }
  close() { if (!this.isOpen) return; this.isOpen = false; this.el.classList.remove('on'); if (this.o.restoreGlobals) this.o.restoreGlobals(this.saved); if (this.o.onClose) this.o.onClose(); }
  /** The roster for the 3D scene: discovered cats on role anchors; unmet ones in the wall shade (a Boss on his perch). */
  roster() {
    const out = [], shadeN = {};
    for (const c of Object.values(this.m.cats)) {
      const def = BOARD.scenes.find((s) => s.id === c.scene); if (!def) continue;
      if (c.state === 'gone') continue;
      const r = { scene: c.scene, id: c.id, cast: c.cast, discovered: c.discovered, role: c.role };
      if (!c.discovered && c.role !== 'boss') {
        const i = shadeN[c.scene] = (shadeN[c.scene] || 0); shadeN[c.scene]++;
        const sh = def.shade && def.shade[i % Math.max(1, def.shade.length)];
        if (sh) { r.at = sh; r.face = sh[0] < 0 ? 0.7 : -0.7; }
      }
      out.push(r);
    }
    return out;
  }
  sceneCats(id = this.sceneId) { return Object.values(this.m.cats).filter((c) => c.scene === id && c.state !== 'gone'); }
  cycle(d) { const order = this.m.scenes.map((s) => s.id), i = order.indexOf(this.sceneId); this.goScene(order[(i + d + order.length) % order.length]); }
  goScene(id, focus = null) {
    if (!id || (id === this.sceneId && !focus)) return;
    this.sceneId = id; this.scene3.setScene(id, true); this.full = false; this.focus = null;
    for (const l of this.labels.values()) l.el.remove(); this.labels.clear();
    this.drawStatic(); if (focus) this.setFocus(focus, 'key'); else this.applyFocus();
  }
  back() { if (this.full) { this.full = false; this.q('.rb-full').classList.remove('on'); this.drawButtons(); return; } if (this.focus && this.focusBy === 'key') { this.setFocus(null); return; } this.close(); }
  south() { const c = this.focus && this.m.cats[this.focus]; if (!c || !c.discovered) return; this.full = true; this.drawFull(c); }
  west() { const x = this.crossTie(); if (x) this.goScene(x.scene, x.id); }
  crossTie() { if (!this.focus) return null; const t = this.m.tiesOf(this.focus).find((t) => this.m.cats[t.to].scene !== this.sceneId); return t ? { scene: this.m.cats[t.to].scene, id: t.to, kind: t.kind } : null; }
  /** Keyboard (and pad, mapped onto the same codes by the caller). Returns true when consumed. */
  key(code) {
    if (!this.isOpen) return false;
    if (code === 'Escape' || code === 'Backspace' || code === 'KeyJ') { if (code === 'KeyJ' && !this.full) { this.close(); return true; } this.back(); return true; }
    if (this.full) { if (code === 'Enter' || code === 'Space') { this.back(); } return true; }
    if (code === 'KeyQ' || code === 'PageUp') { this.cycle(-1); return true; }
    if (code === 'KeyE' || code === 'PageDown') { this.cycle(1); return true; }
    if (code === 'Enter' || code === 'Space') { this.south(); return true; }
    if (code === 'KeyR') { this.west(); return true; }
    const dir = { ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1], ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0] }[code];
    if (dir) { this.move(dir); return true; }
    return true;   // the board is modal: nothing reaches the street
  }
  /** Spatial focus: up walks toward the perch, down toward the camera (§2.9). First press: nearest the camera. */
  move([dx, dy]) {
    const pts = this.sceneCats().map((c) => ({ id: c.id, p: this.screenOf(c.id) })).filter((x) => x.p);
    if (!pts.length) return;
    const cur = this.focus && pts.find((x) => x.id === this.focus);
    if (!cur) { pts.sort((a, b) => b.p.y - a.p.y || Math.abs(a.p.x - innerWidth / 2) - Math.abs(b.p.x - innerWidth / 2)); this.setFocus(pts[0].id, 'key'); return; }
    let best = null, bs = Infinity;
    for (const x of pts) { if (x.id === cur.id) continue; const vx = x.p.x - cur.p.x, vy = x.p.y - cur.p.y, along = vx * dx + vy * dy; if (along <= 4) continue; const across = Math.abs(vx * dy - vy * dx), s = along + across * 2.2; if (s < bs) { bs = s; best = x; } }
    if (best) this.setFocus(best.id, 'key');
  }
  screenOf(id) { const e = this.scene3.entry(this.sceneId, id); if (!e) return null; const p = e.base.clone(); p.y += this.scene3.heightOf(e) * 0.5; return this.scene3.project(p); }
  setFocus(id, by) {
    if (id === this.focus) return; this.focus = id; this.focusBy = by;
    const drift = BOARD.camera.driftPx || 3; if (id) { const p = this.screenOf(id); if (p) this.scene3.setDriftTo((p.x / innerWidth - 0.5) * -2 * drift, (p.y / innerHeight - 0.5) * -2 * drift); } else this.scene3.setDriftTo(0, 0);
    this.applyFocus();
  }
  /** Who stays at full colour on focus: the focused cat, its Boss (by the arrow), the cats its tags point at. */
  related() {
    if (!this.focus) return null; const c = this.m.cats[this.focus]; const keep = new Set();
    if (!c || !c.discovered) return keep;
    if (c.answersTo) keep.add(c.answersTo);
    if (c.role === 'boss' || c.role === 'mikan') for (const o of this.sceneCats()) if (o.answersTo === c.id && o.discovered) keep.add(o.id);
    for (const t of this.tagsInScene()) keep.add(t.to);
    return keep;
  }
  tagsInScene() {
    if (!this.focus) return [];
    const c = this.m.cats[this.focus]; if (!c || !c.discovered) return [];
    return this.m.tiesOf(this.focus).filter((t) => this.m.cats[t.to].scene === this.sceneId && this.m.cats[t.to].state !== 'gone').slice(0, 3);
  }
  applyFocus() {
    const rel = this.related();
    this.scene3.setFocus(this.focus, rel, !!this.focus);
    this.drawCard(); this.drawButtons(); this.drawStrip();
    this.tagMap = new Map(this.tagsInScene().map((t) => [t.to, t.kind]));
    for (const [id, l] of this.labels) { l.dirty = true; }
  }
  /* ------------------------------------------------------------------ DOM: header, strip, buttons, card */
  drawStatic() {
    const def = this.m.scenes.find((s) => s.id === this.sceneId);
    this.q('.rb-hdr .k-h').textContent = def ? def.name : '';
    const cap = this.q('.rb-caption'); cap.style.display = 'none';
    // labels for this scene's cats: name ribbon, mark, silhouette "?" pom, legend cards for the Gone
    const world = this.q('.rb-world'); world.innerHTML = ''; this.labels.clear();
    for (const c of Object.values(this.m.cats)) {
      const sameScene = c.scene === this.sceneId, oldSpot = c.homeScene === this.sceneId && c.homeScene !== c.scene;
      if (!sameScene && !oldSpot && !(c.state === 'gone' && (c.homeScene || c.scene) === this.sceneId)) continue;
      const l = { id: c.id, el: document.createElement('div'), mark: null, dirty: true };
      if (c.state === 'gone' || (oldSpot && c.state === 'crew')) {
        l.el.className = 'rb-legend'; l.kind = c.state === 'gone' ? 'legend' : 'knot';
        l.el.innerHTML = c.state === 'gone' ? `${c.name}<small>Run out of town</small>` : `${svg(44, 30, '-22 -15 44 30', `<path d="M-18 0Q-8 -12 0 0Q8 12 18 0" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linecap="round"/><path d="M-18 0Q-8 -12 0 0Q8 12 18 0" fill="none" stroke="${ink}" stroke-width="1.5"/><circle r="6" fill="${C.gold}" ${st2}/>`)}${c.name}<small>Wears the bell now</small>`;   // the name, as on the Run-out card (review round 1, fix 5)
        if (c.state === 'gone') l.el.innerHTML += `<div style="position:absolute;right:-70px;bottom:-6px">${svg(80, 40, '0 -20 80 40', RV.pawPrints({ pts: [[10, 6, 0.8], [30, -2, 0.8], [50, 8, 0.8], [70, 0, 0.8]], s: 1 }))}</div>`;
        world.appendChild(l.el); this.labels.set('legend:' + c.id, l); continue;
      }
      if (c.discovered) {
        l.el.className = 'rb-nm';
        l.el.innerHTML = `<span class="k-ribbon k-ribbon--${clowderRibbon(c)}">${c.role === 'boss' ? c.name.toUpperCase() : c.name}</span>${c.tapeStar ? tapeStar : ''}<span class="rb-tagslot"></span>`;
      } else l.el.className = 'rb-silq';
      world.appendChild(l.el);
      // <= 1 drawn mark per cat at rest: storm > puffs > sprig > grumble > plaster (§2.5)
      const mk = this.markOf(c);
      if (mk) { l.mark = document.createElement('div'); l.mark.className = 'rb-mark'; l.mark.innerHTML = mk.html; l.markKind = mk.kind; world.appendChild(l.mark); }
      if (c.role === 'outsider' && c.stake) { l.stake = document.createElement('div'); l.stake.className = 'rb-mark'; l.stake.title = c.stake;
        l.stake.innerHTML = RV.stamp(`<path d="M-9 14V-13M7 14V-13M-9 -9H7" fill="none" ${st2}/><path d="M-6 -9V-1H-1V-9M1 -9V-3H5V-9" fill="${C.cream}" ${st2}/><path d="M10 14V-4" ${st2}/><path d="M10 -4H20L17 1L20 6H10Z" fill="${C.crimson}" ${st2}/>`, { size: 64, color: '#E8D8B8' }); world.appendChild(l.stake); }
      if (c.role === 'boss') { l.crown = document.createElement('div'); l.crown.className = 'rb-mark'; l.crown.innerHTML = crownSvg(c.discovered); world.appendChild(l.crown); }
      this.labels.set(c.id, l);
    }
    this.drawStrip(); this.drawButtons(); this.drawCard();
  }
  markOf(c) {
    if (!c.discovered) return null;
    const mk = c.marks || {};
    if (mk.storm) return { kind: 'storm', html: svg(150, 120, '-75 -70 150 120', RV.storm({ x: 0, y: 0, s: 0.8 })) };
    if (c.role === 'boss' && mk.puffs) return { kind: 'puffs', html: puffsSvg(mk.puffs, mk.puffs >= 3) };
    if (mk.sprig) return { kind: 'sprig', html: sprigIco(1.3) };
    if (mk.grumble) return { kind: 'grumble', html: svg(70, 50, '-35 -30 70 50', K.dustCloud({ x: 0, y: 0, r: 18, puffs: 5, seed: 9 })) };
    if (mk.plaster) return { kind: 'plaster', html: svg(40, 40, '-20 -20 40 40', RV.plaster({ s: 1.6 })) };
    return null;
  }
  drawStrip() {
    const m = this.m;
    const order = [['lane'], ['arcade', 'lantern'], ['shiosai', 'anchor'], ['summit', 'lighthouse'], ['outsiders'], ['bell']];
    let h = `<span class="k-btn k-key rb-sh" data-k="prev">L1</span>`;
    for (const [id, emLock] of order) {
      const def = m.scenes.find((s) => s.id === id), cats = Object.values(m.cats).filter((c) => c.scene === id && c.state !== 'gone');
      const em = def ? EMBLEM[def.emblem] : EMBLEM[emLock];
      const simS = m.simScenes && m.simScenes.find((x) => x.id === id);
      const dots = !def && simS ? simS.dots.slice(0, 10).map((d) => `<i class="${d.met ? 'm' : 's'}"></i>`).join('') : def ? cats.slice(0, 10).map((c) => `<i class="${c.discovered ? 'm' : 's'}"></i>`).join('') + (cats.length > 10 ? '+' : '') : '<i class="s"></i>'.repeat(id === 'summit' ? 2 : 3);
      const name = def ? def.tab : { arcade: 'Akane Arcade', shiosai: 'Shiosai', summit: 'The Lighthouse Summit' }[id];
      const emH = `<span class="rb-em">${svg(30, 30, '-13 -13 26 26', em)}</span>`;
      const chip = '';   // review round 1, fix 5: cross-scene ties are a line in the focus card, not a chip under a tab
      if (id === this.sceneId) h += `<span class="rb-sc" data-s="${id}"><span class="rb-pill">${emH}${name}</span><span class="rb-dots">${dots}</span>${chip}</span>`;
      else h += `<span class="rb-sc${def ? '' : ' lock'}" data-s="${def ? id : ''}">${emH}<span class="rb-dots">${dots}</span>${chip || `<span class="rb-tip">${def ? name : name + ': further up the hill.'}</span>`}</span>`;
    }
    h += `<span class="k-btn k-key rb-sh" data-k="next">R1</span>`;
    const s = this.q('.rb-strip'); s.innerHTML = h;
    s.querySelectorAll('[data-s]').forEach((e) => { if (e.dataset.s) e.onclick = () => { const cr = this.crossTie(); this.goScene(e.dataset.s, cr && cr.scene === e.dataset.s ? cr.id : null); }; });
    s.querySelector('[data-k=prev]').onclick = () => this.cycle(-1); s.querySelector('[data-k=next]').onclick = () => this.cycle(1);
  }
  drawButtons() {
    const b = this.q('.rb-btns');
    if (this.full) b.innerHTML = '';
    else if (this.focus) { const c = this.m.cats[this.focus]; b.innerHTML = (c && c.discovered ? `<span data-b="s">${btn('s', 'Card')}</span>` : '') + (this.crossTie() ? `<span data-b="w">${btn('w', 'Go to')}</span>` : '') + `<span data-b="e">${btn('e', 'Back')}</span>`; }
    else b.innerHTML = `<span data-b="e">${btn('e', 'Back')}</span>`;
    b.querySelectorAll('[data-b]').forEach((e) => { e.onclick = () => ({ s: () => this.south(), w: () => this.west(), e: () => this.back() })[e.dataset.b](); });
  }
  cardLines(c) {
    const role = c.role === 'boss' ? `${K.inked ? svg(30, 24, '-15 -12 30 24', K.inked('M-13 8L-13 -7L-6 1L0 -10L6 1L13 -7L13 8Z', C.gold, 2.2)) : ''}${c.title || 'Boss'}`
      : c.role === 'outsider' ? `${svg(28, 28, '-14 -14 28 28', `<path d="M-6 13V-12" ${st2}/><path d="M-6 -12H10L6 -6L10 0H-6Z" fill="${C.crimson}" ${st2}/>`)}${c.situation || 'Outsider'} · ${c.stake || ''}`
      : c.role === 'mikan' ? `${stamp(RV.GLYPH.bell)}${c.clout || 'Known Face'}`
      : `${svg(28, 28, '-13 -13 26 26', STYLEICON[c.style] || STYLEICON.Scrapper)}${c.role === 'captain' ? 'Captain · ' : ''}${ROLE_WORD[c.personality] || ''}`;
    const pers = c.personality ? `<span class="sep"></span>${stamp(PERSGLYPH[c.personality] || '')}${PERS_NAME[c.personality]}` : '';
    const g = c.gWord || gPict(c.grudge ?? (c.marks && c.marks.storm ? 80 : 30)), r = c.rWord || rPict(c.regard ?? 20);
    let mood = c.role === 'mikan' || c.state === 'crew' || c.clowder === 'bell' ? '' : `${stamp(MOOD[g] || MOOD.smooth)}${stamp(MOOD[r] || MOOD.back)}`;
    if (c.marks && c.marks.storm) mood += `<span class="sw">${stormIco()}&nbsp;${c.marks.storm}</span>`;
    if (c.marks && c.marks.sprig) mood += `<span class="sp">${sprigIco(0.9)}${c.marks.storm ? '' : 'Truce'}</span>`;
    if (c.state === 'crew' && c.mood) mood += `<span class="sp" style="background:#FFF0C8">${stamp(RV.GLYPH.bell, C.gold)}${c.mood}</span>`;
    const hist = c.history ? `<div class="r"><span class="day">${c.history.day.replace('L2 ', '').replace('L1 ', '')}</span><span class="q">${/^["“]/.test(c.history.line) ? c.history.line : `"${c.history.line}"`}</span></div>` : '';
    let ctx = '';
    const x = c.context;
    if (x && x.kind === 'anger') ctx = `<div class="r">${svg(70, 40, '-35 -26 70 40', K.dustCloud({ x: -14, y: 0, r: 11, puffs: 4, seed: 2 }) + ((c.marks.puffs || 0) > 1 ? K.dustCloud({ x: 12, y: -4, r: 12, puffs: 4, seed: 7 }) : ''))}<b>${x.stage}</b><span class="sep"></span>__MOOD__</div><div class="r" style="white-space:normal;font-size:24px;line-height:1.15;font-weight:600">${x.line}</div>`;
    else if (x && x.kind === 'raid') ctx = `<div class="r">${moon()}<span class="q">${x.line}</span></div>`;
    else if (x && x.kind === 'stake') ctx = `<div class="r">${stamp(`<path d="M-6 13V-12" ${st2}/><path d="M-6 -12H10L6 -6L10 0H-6Z" fill="${C.crimson}" ${st2}/>`)}<span class="q" style="font-size:25px">${x.line.replace(/ · leaves after 2 repels/, '')}</span>${(x.pips || [0, 2]).length ? `<span style="display:flex;gap:4px">${'<i style="width:16px;height:16px;border-radius:50%;border:3px solid var(--ink)"></i>'.repeat(2)}</span>` : ''}</div>`;
    else if (x && x.kind === 'assign') ctx = `<div class="r">${stamp(x.post ? `<path d="M-2 14V-12M-2 -12Q8 -12 10 -4" fill="none" ${st2}/>` : RV.GLYPH.bell, x.post ? C.cream : C.gold)}<span class="q">${x.line}</span></div>`;
    else if (x && x.kind === 'truce') ctx = `<div class="r">${sprigIco(1)}<span class="q">${x.line}</span></div>`;
    return { role, pers, mood, hist, ctx };
  }
  drawCard() {
    const card = this.q('.rb-card'); const c = this.focus && this.m.cats[this.focus];
    if (!c || this.full) { card.classList.add('off'); return; }
    card.classList.remove('off');
    card.style.setProperty('--k-clowder', `var(--${clowderRibbon(c) === 'stray' ? 'cream' : clowderRibbon(c)})`);
    if (!c.discovered) {
      const line = c.role === 'outsider' ? `A stranger’s scent. Staking ${c.stake || 'a post'}.` : 'Not met yet. Sniff it out: hold Whisker Sense near it.';
      card.innerHTML = `<div class="head" style="background:#C9C0D6">${svg(76, 76, '-38 -38 76 76', `<circle r="34" fill="#4A3657" stroke="${ink}" stroke-width="4"/><text y="14" text-anchor="middle" font-family="M PLUS Rounded 1c" font-weight="800" font-size="40" fill="${C.cream}">?</text>`)}???</div><div class="r" style="white-space:normal;padding-top:24px;font-size:30px">${line}</div>`;
      return;
    }
    const L = this.cardLines(c), over = this.m.tiesOf(c.id).length - 3;
    if (L.ctx.includes('__MOOD__')) { L.ctx = L.ctx.replace('__MOOD__', L.mood); L.mood = ''; }
    card.innerHTML = `<div class="head">${K.ui.portrait({ size: 76, ring: c.clowder === 'bell' ? C.gold : C.gold, bg: '#F7C99A', cat: { ...c.kit, expr: c.kit.expr || 'neutral', outline: 'ink', scars: c.scars } })}${c.name.toUpperCase()} ${c.title && c.role !== 'boss' ? `<small>· ${c.title}</small>` : ''}</div>
      <div class="r">${L.role}${L.pers}${over > 0 ? `<span class="more">+${over} ties</span>` : ''}</div>
      ${L.mood ? `<div class="r">${L.mood}</div>` : ''}${L.hist}${L.ctx}${this.crossLine(c)}`;
  }
  /** Ties to cats in another scene, as one card line: "Old Gang: Hige · the Bell" (review round 1, fix 5). */
  crossLine(c) {
    const SCN = { lane: 'the Lane', bell: 'the Bell', outsiders: 'the bus stop' };
    const xs = this.m.tiesOf(c.id).filter((t) => this.m.cats[t.to].scene !== this.sceneId);
    if (!xs.length) return '';
    // grouped by scene, then by tie: "Rival: Goma / Old Boss: Daifuku · the Lane"
    const by = new Map(); for (const t of xs) { const sc = this.m.cats[t.to].scene; if (!by.has(sc)) by.set(sc, new Map()); const g = by.get(sc); if (!g.has(t.kind)) g.set(t.kind, []); g.get(t.kind).push(this.m.cats[t.to].name); }
    const parts = [...by].map(([sc, g]) => `${[...g].map(([kind, names]) => `${TAGWORD[kind]}: ${names.join(', ')}`).join(' / ')} · ${SCN[sc] || sc}`);
    return `<div class="r rb-cross">${TAGICON[xs[0].kind] || ''}<span class="q">${parts.join(' / ')}</span></div>`;
  }
  drawFull(c) {
    const f = this.q('.rb-full'); f.classList.add('on'); this.q('.rb-card').classList.add('off'); this.drawButtons();
    f.style.setProperty('--k-clowder', `var(--${clowderRibbon(c) === 'stray' ? 'cream' : clowderRibbon(c)})`);
    const L = this.cardLines(c), m = this.m; L.ctx = L.ctx.replace('__MOOD__', '');
    const ties = []; if (c.answersTo && m.cats[c.answersTo] && m.cats[c.answersTo].discovered) ties.push(`<span class="pt">${K.ui.portrait({ size: 34, ring: C.cream, bg: '#F7C99A', cat: m.cats[c.answersTo].kit })}${c.answersTo === 'mikan' ? 'Crew of' : 'Boss'}: ${m.cats[c.answersTo].name}</span>`);
    if (c.role === 'boss') for (const o of Object.values(m.cats)) if (o.answersTo === c.id && o.discovered && o.state !== 'gone') ties.push(`<span class="pt">${K.ui.portrait({ size: 34, ring: C.cream, bg: '#F7C99A', cat: o.kit })}Gang: ${o.name}</span>`);
    for (const t of m.tiesOf(c.id)) ties.push(`<span class="pt">${TAGICON[t.kind]}${TAGWORD[t.kind]}: ${m.cats[t.to].name}</span>`);
    const hist = (c.historyAll || (c.history ? [c.history] : [])).map((h) => `<div><b>${h.day}</b>${h.line}</div>`).join('') || '<div>—</div>';
    const anger = c.role === 'boss' && c.context && c.context.kind === 'anger' ? `<div class="lab">ANGER</div><div class="row">${puffsSvg(c.marks.puffs || 0, c.marks.puffs >= 3).replace('width="160" height="120"', 'width="110" height="82"')}<b>${c.context.stage}</b></div><div class="row" style="font-size:24px;font-weight:600">Rises when you over-mark or counter-spray in the Lane. Cools each night.</div><div class="row" style="font-size:24px;font-weight:600">Next fight with him: ${({ Calm: 'not Fired Up', Riled: 'Fired Up for a while', Seething: 'Fired Up for a long while', Furious: 'Fired Up all fight' })[c.context.stage]}. Spent after his next fight.</div><div class="lab">OBJECTIVE</div><div class="row">Mark the Lane until he comes down.</div>` : '';
    const fears = (c.fears || []).map((x) => stamp(RV.GLYPH[x] || RV.GLYPH.question)).join('') + stamp(RV.GLYPH.question);
    f.innerHTML = `<div class="ban">${K.ui.portrait({ size: 88, ring: C.gold, bg: '#F7C99A', cat: { ...c.kit, outline: 'ink', scars: c.scars } })}${c.name.toUpperCase()} ${c.title ? `<small>${c.title}</small>` : ''}</div>
      <div class="cols"><div><div class="stage">${K.ui.portrait({ size: 360, ring: C.cream, bg: '#F7E3C0', cat: { ...c.kit, outline: 'ink', scars: c.scars } })}</div>
        <div class="row" style="margin-top:16px">${L.role}${c.role === 'boss' ? L.pers : ''}</div></div>
      <div><div class="lab">PERSONALITY</div><div class="row">${L.pers.replace('<span class="sep"></span>', '') || '—'}</div>
        ${L.mood ? `<div class="lab">MOOD</div><div class="row">${L.mood}</div>` : ''}
        <div class="lab">TIES</div><div class="row">${ties.join('') || '—'}</div>
        ${c.clowder === 'bell' ? '' : `<div class="lab">FEARS</div><div class="row">${fears}</div>`}
        ${anger}
        <div class="lab">HISTORY</div><div class="hist">${hist}</div></div></div>
      ${c.state === 'gone' ? '<div class="legend">Run out of town</div>' : ''}
      <div class="foot">${btn('e', 'Back')}</div>`;
    f.querySelector('.foot').onclick = () => this.back();
  }
  /* ------------------------------------------------------------------ per frame */
  frame(dt) {
    if (!this.isOpen) return;
    const s3 = this.scene3, W = innerWidth, H = innerHeight, k = Math.min(W / 1920, H / 1080);
    if (s3.w !== W || s3.h !== H) s3.layout(W, H);
    // hover: the mouse focuses after 120 ms over the same cat (§2.9)
    if (this.mouse && !this.full) {
      const c = s3.pick(this.mouse.x, this.mouse.y), id = c ? c.id : null;
      if (id !== this.hoverId) { this.hoverId = id; this.hoverT = 0; }
      else { this.hoverT += dt; if (this.hoverT >= 0.12 && (id !== this.focus) && (id || this.focusBy === 'mouse')) this.setFocus(id, 'mouse'); }
    }
    s3.update(dt); s3.render();
    for (const sel of ['.rb-tl', '.rb-bl', '.rb-br']) this.q(sel).style.transform = `scale(${k})`;
    this.q('.rb-c').style.transform = `scale(${k})`;
    // labels from projected anchors
    const rel = this.related(), F = this.focus;
    for (const [key, l] of this.labels) {
      const c = this.m.cats[l.id];
      let base, head;
      if (l.kind === 'legend' || l.kind === 'knot') {
        const def = BOARD.scenes.find((s) => s.id === this.sceneId), a = def.anchors[l.id]; if (!a) { l.el.style.display = 'none'; continue; }
        base = new THREE.Vector3(def.x + a.at[0], a.at[1], a.at[2]);
        const p = s3.project(base); if (!p) continue; l.el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-100%) scale(${k})`; continue;
      }
      const e = s3.entry(this.sceneId, l.id); if (!e) { l.el.style.display = 'none'; if (l.mark) l.mark.style.display = 'none'; continue; }
      l.el.style.display = ''; base = e.cat.object3D.position.clone(); head = base.clone(); head.y += s3.heightOf(e);
      const pf = s3.project(base), ph = s3.project(head); if (!pf || !ph) continue;
      const dim = !!F && F !== l.id && !(rel && rel.has(l.id));
      if (c.discovered) {
        l.el.style.transform = `translate(${pf.x}px,${pf.y + 6 * k}px) translateX(-50%) scale(${k})`; l.el.style.transformOrigin = '50% 0';
        l.el.classList.toggle('dim', dim); l.el.classList.toggle('focus', F === l.id);
        if (l.dirty) { const kind = this.tagMap && this.tagMap.get(l.id); l.el.querySelector('.rb-tagslot').innerHTML = kind ? `<span class="rb-tag">${TAGICON[kind]}${TAGWORD[kind]}</span>` : ''; l.dirty = false; }
      } else {
        l.el.innerHTML = F === l.id ? '<div class="rb-q">?</div>' : '';
        l.el.style.transform = `translate(${ph.x}px,${ph.y - 10 * k}px) translate(-50%,-100%) scale(${k})`;
      }
      if (l.mark) {
        const off = l.markKind === 'puffs' ? 30 : l.markKind === 'storm' ? -2 : -4;
        const mx = l.markKind === 'storm' ? ph.x + 30 * k : l.markKind === 'sprig' ? ph.x + 26 * k : ph.x;
        l.mark.style.transform = `translate(${mx}px,${ph.y + off * k}px) translate(-50%,-100%) scale(${k})`; l.mark.classList.toggle('dim', dim);
      }
      if (l.stake) l.stake.style.transform = `translate(${pf.x + 90 * k}px,${pf.y}px) translate(-50%,-100%) scale(${k})`;
      if (l.crown) { l.crown.style.transform = `translate(${ph.x}px,${ph.y + 4 * k}px) translate(-50%,-100%) scale(${k})`; l.crown.classList.toggle('dim', dim); }
    }
    this.drawArrows(k, rel);
    const cap = this.q('.rb-caption');
    if (this.sceneId === 'outsiders' && !this.sceneCats().length) { cap.style.display = ''; cap.textContent = 'Nobody at the bus stop yet.'; } else cap.style.display = 'none';
  }
  /** Dashed answers-to arrows (review round 1, fix 5): ONE smooth curve per cat, from the top of its head to its
   *  superior's ribbon (no shared trunk or kink), ending in a head that points into the ribbon (§2.3). */
  drawArrows(k, rel) {
    const s3 = this.scene3, def = BOARD.scenes.find((s) => s.id === this.sceneId), out = [];
    const g = this.q('.rb-arrows'); g.setAttribute('width', innerWidth); g.setAttribute('height', innerHeight);
    if (!def.perch) { g.innerHTML = ''; return; }
    const boss = this.m.cats[def.perch], F = this.focus, fc = F && this.m.cats[F];
    const dash = (d, w, op, dotted) => `<path d="${d}" fill="none" stroke="${C.cream}" stroke-width="${(w + 4) * k}" stroke-linecap="round" opacity="${op}"/><path d="${d}" fill="none" stroke="${ink}" stroke-width="${w * k}" stroke-dasharray="${(dotted ? 3 : 12) * k} ${(dotted ? 9 : 10) * k}" stroke-linecap="round" opacity="${op}"/>`;
    const head = (a, b, w, op) => { const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI; return `<g transform="translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${k})" opacity="${op}"><path d="M-14 -10L4 0L-14 10" fill="none" stroke="${C.cream}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="M-14 -10L4 0L-14 10" fill="none" stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`; };
    const emptyPerch = !!boss && !!boss.state && boss.state !== 'present';
    const bossFocus = fc && fc.id === def.perch;
    // the superior's ribbon (its name label), else its feet on the perch
    const lab = [...this.labels.values()].find((l) => l.id === def.perch && l.el && l.el.style.display !== 'none' && l.el.isConnected);
    const r = lab ? lab.el.querySelector('.k-ribbon') || lab.el : null, rc = r ? r.getBoundingClientRect() : null;
    const be = s3.entry(this.sceneId, def.perch), bp = be ? s3.project(be.cat.object3D.position.clone()) : (def.perchAt ? s3.project(new THREE.Vector3(def.x + def.perchAt[0], def.perchAt[1], def.perchAt[2])) : null);
    const target = (a) => {
      if (rc && rc.width > 0) {
        const mid = (rc.left + rc.right) / 2, cx = mid + Math.max(-rc.width * 0.35, Math.min(rc.width * 0.35, a.x - mid));   // each cat lands on its own side of the ribbon
        return a.y > rc.bottom ? { x: cx, y: rc.bottom + 3 * k } : { x: a.x < rc.left ? rc.left - 3 * k : rc.right + 3 * k, y: (rc.top + rc.bottom) / 2 };
      }
      return bp ? { x: bp.x, y: bp.y + 8 * k } : null;
    };
    const members = this.sceneCats().filter((c) => c.answersTo === def.perch && c.discovered && c.id !== def.perch);
    for (const c of members) {
      const e = s3.entry(this.sceneId, c.id); if (!e) continue;
      const a = s3.project(e.cat.object3D.position.clone().add(new THREE.Vector3(0, s3.heightOf(e) * 1.05, 0))); if (!a) continue;
      const b = target(a); if (!b) continue;
      const mine = c.id === F || bossFocus, op = F ? (mine ? 1 : 0.18) : 0.35, w = mine ? 4 : 2;
      // one cubic: leaves the head straight up, arrives straight into the ribbon (vertical tangents at both ends)
      const dy = Math.max(24 * k, a.y - b.y), side = b.y > (rc ? rc.top : b.y - 1) && rc && a.y <= rc.bottom;
      const c1 = { x: a.x, y: a.y - dy * 0.55 }, c2 = side ? { x: b.x + (a.x < b.x ? -40 : 40) * k, y: b.y } : { x: b.x, y: b.y + dy * 0.45 };
      const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)}C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      out.push(dash(d, w, op, emptyPerch));
      out.push(head(c2, b, w, op));
    }
    g.innerHTML = out.join('');
  }
  stats() { return { ...(this.scene3.stats || {}), openMs: this.openMs, scene: this.sceneId, focus: this.focus, tags: this.tagsInScene().map((t) => `${t.kind}:${t.to}`), full: this.full }; }
}

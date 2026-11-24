// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat HUD in DOM with the preview kit's CSS (design/ux/hud.md §4; plan §3.4): Posse plates (BL, fixed
// D-pad order, controlled plate x1.3 with the hiss pom, Nerve, 2 Paw pips with partial fill, one status
// pom with its Cowed / Fired Up badge, queued-command pom, can-act bell), the Tag-In cue (glyph pop + gold
// rim for the 0.35 s window) and Relay chain, the ally guest plate, the identity ribbon (TC, Captains and
// Daifuku only: 3-phase Nerve, anger puffs, Fired Up pom), world-anchored enemy bars (Nerve + zigzag
// Frazzle on the enemy), overhead ticks (bell / chevron / sprig), the Pile-On prompt, and the Slow Blink
// command menu (one level, Move costs, Set-up / Pay-off diamonds, target step, Scram).
// The HUD never shakes and is never inverted by impact frames (hud.md §4.6). Sizes are 1080p values,
// scaled by min(vw/1920, vh/1080).
// kit-assets.js is generated: kit.css with its fonts inlined (regenerate by re-running the node one-liner in
// the M1 evidence README if kit.css changes).
import { KIT_CSS } from './kit-assets.js';
import { Kit } from '../../render/vfx/sprites.js';
import { portraitFor } from '../../render/vfx/fighters.js';
import { styleOf } from '../../render/vfx/cinematics.js';

const C = Kit.C;
const DPAD = ['n', 'w', 's', 'e'], KEYS = ['Z', 'X', 'C', 'V'];
const kc = (k, big) => `<span class="ch-kc${big ? ' big' : ''}">${k}</span>`;
const TITLES = { daifuku: ['DAIFUKU', 'Boss of Hidamari Lane'], captain: ['CAPTAIN', 'of the Wall Sitters'], challenger: ['THE CHALLENGER', 'at the Gatepost'] };

const CSS = `
.ch { position:absolute; inset:0; pointer-events:none; font-family:var(--font); color:var(--ink); z-index:3; }
.ch * { box-sizing:border-box; }
.ch-corner { position:absolute; }
.ch-bl { left:0; bottom:0; transform-origin:0 100%; }
.ch-tc { left:50%; top:0; transform-origin:50% 0; }
.ch-world { position:absolute; inset:0; }
.ch-world > * { position:absolute; transform:translate(-50%,-100%); }
.ch-hide { opacity:0; transition:opacity 200ms; }
.ch-show { opacity:1; transition:opacity 200ms; }
.ch-plates { position:absolute; left:34px; bottom:30px; display:flex; flex-direction:column; gap:12px; width:560px; }
.ch-plate { position:relative; display:flex; align-items:center; gap:12px; height:84px; width:460px; padding:6px 18px 6px 8px; background:var(--cream); border:var(--frame) solid var(--cocoa);
  border-radius:var(--bean-sm); box-shadow:var(--drop); transform-origin:0 50%; transition:transform 120ms; }
.ch-plate.ctl { width:500px; height:100px; border-width:4px; box-shadow: 0 0 0 4px var(--gold), var(--drop); margin-bottom:6px; }
.ch-plate .glyph { flex:0 0 56px; width:56px; height:56px; border-radius:50%; transition:transform 90ms; }
.ch-plate .glyph.cue { transform:scale(1.15); box-shadow:0 0 0 5px var(--gold), 0 0 0 8px var(--ink); }
.ch-plate .glyph.pulse { animation: chpulse 1s steps(2) infinite; }
@keyframes chpulse { 50% { transform:scale(1.12); } }
.ch-plate .por { flex:0 0 72px; width:72px; height:72px; }
.ch-plate.ctl .por { flex-basis:84px; width:84px; height:84px; }
.ch-plate .mid { flex:1; display:flex; flex-direction:column; gap:4px; min-width:0; }
.ch-plate .nm { font:800 30px/1 var(--font); color:var(--ink); white-space:nowrap; }
.ch-plate.ctl .nm { font-size:34px; }
.ch-plate .k-gauge { width:100%; max-width:220px; height:20px; }
.ch-plate .pads { display:flex; gap:2px; align-items:center; }
.ch-pad { position:relative; width:40px; height:40px; }
.ch-pad > div { position:absolute; inset:0; }
.ch-pad .fill { clip-path: inset(var(--c,100%) 0 0 0); }
.ch-pad.full svg { filter: drop-shadow(0 0 0 var(--ink)); }
.ch-plate .poms { display:flex; gap:4px; align-items:center; min-width:40px; }
.ch-pom { position:relative; width:40px; height:40px; border-radius:50%; background:var(--cream); border:3px solid var(--cocoa); display:flex; align-items:center; justify-content:center; }
.ch-pom.gold { background:var(--gold); border-color:var(--ink); }
.ch-pom .ring { position:absolute; inset:-6px; border-radius:50%; background:conic-gradient(var(--ink) var(--a,360deg), transparent 0); -webkit-mask: radial-gradient(circle, transparent 23px, #000 24px); mask: radial-gradient(circle, transparent 23px, #000 24px); }
.ch-pom .badge { position:absolute; right:-10px; top:-12px; }
.ch-hiss { position:absolute; right:-26px; top:-22px; width:52px; height:52px; border-radius:50%; background:var(--cream); border:4px solid var(--cocoa); display:flex; align-items:center; justify-content:center; box-shadow:var(--drop); }
.ch-hiss .ring { position:absolute; inset:-5px; border-radius:50%; background:conic-gradient(var(--gold) var(--a,360deg), transparent 0); -webkit-mask: radial-gradient(circle, transparent 25px, #000 26px); mask: radial-gradient(circle, transparent 25px, #000 26px); }
.ch-hiss.ready.alert { background:var(--gold); border-color:var(--ink); animation: chpulse 0.5s steps(2) infinite; }
.ch-plate.routed { background: var(--recessed); }
.ch-plate.routed::after { content:''; position:absolute; inset:0; border-radius:inherit; background-image: radial-gradient(var(--disabled) 2.2px, transparent 2.6px); background-size:9px 9px; opacity:.55; }
.ch-plate.routed .glyph::after { content:''; position:absolute; left:4px; right:4px; top:26px; height:5px; background:var(--ink); transform:rotate(-35deg); }
.ch-plate.routed .por { filter:grayscale(1) contrast(.7); }
.ch-plate .glyph { position:relative; }
.ch-plate.flash { background: var(--gold); }
.ch-plate.bump { transform: translateY(-3px); }
.ch-plate.guest { width:380px; height:70px; border-style:dashed; border-color:var(--gold); box-shadow: 0 0 0 2px var(--ink), var(--drop); }
.ch-plate.guest .por { flex-basis:60px; width:60px; height:60px; }
.ch-relay { display:flex; gap:8px; padding-left:10px; height:52px; align-items:center; }
.ch-relay .f { width:48px; height:48px; border-radius:50%; background:var(--recessed); border:3px solid var(--cocoa); overflow:hidden; display:flex; align-items:center; justify-content:center; }
.ch-relay .f.on { background:var(--gold); border-color:var(--ink); }
.ch-relay .drain { height:6px; background:var(--ink); border-radius:3px; margin-left:12px; }
.ch-ribbon { position:absolute; top:22px; left:-330px; width:660px; height:72px; display:flex; align-items:center; gap:16px; padding:0 46px 0 26px; background:var(--sage); border:4px solid var(--ink);
  clip-path: polygon(0 0, 100% 0, calc(100% - 24px) 50%, 100% 100%, 0 100%); font:800 40px/1 var(--font); color:var(--ink); white-space:nowrap; }
.ch-ribbon small { font:700 26px/1 var(--font); }
.ch-ribbon-sub { position:absolute; top:102px; left:-300px; width:600px; display:flex; gap:12px; justify-content:center; align-items:center; }
.ch-seg { display:flex; gap:4px; width:300px; height:22px; }
.ch-seg > div { flex:1; background:var(--recessed); border:3px solid var(--ink); border-radius:8px; overflow:hidden; }
.ch-seg > div > i { display:block; height:100%; background:var(--nerve); }
.ch-puff { width:30px; height:30px; }
.ch-ebar { display:flex; flex-direction:column; gap:3px; align-items:flex-start; }
.ch-ebar .row { display:flex; gap:5px; align-items:center; }
.ch-ebar .nerve { width:120px; height:14px; border-width:3px; }
.ch-ebar .fz { width:132px; height:22px; }
.ch-ebar .emb { width:22px; height:18px; }
.ch-tick { width:44px; height:44px; }
.ch-prompt { padding:6px 16px 6px 8px; }
.ch-sb { position:absolute; left:520px; bottom:30px; width:560px; background:var(--cream); border:4px solid var(--cocoa); border-radius:var(--bean); box-shadow:var(--drop); overflow:hidden; pointer-events:auto; }
.ch-sb .hd { display:flex; align-items:center; justify-content:space-between; gap:12px; background:var(--cocoa); color:var(--cream); padding:10px 18px; font:800 34px/1 var(--font); }
.ch-sb .hd .who { display:flex; align-items:center; gap:10px; }
.ch-sb .key { background:var(--cream); color:var(--cocoa); border-radius:12px; padding:6px 10px; font:800 22px/1 var(--font); }
.ch-sb .row { display:flex; align-items:center; gap:12px; height:66px; padding:0 18px; border-bottom:2.5px dashed var(--recessed); font:700 32px/1 var(--font); color:var(--ink); }
.ch-sb .row .nm { flex:1; white-space:nowrap; }
.ch-sb .row.pin { background:var(--recessed); font-weight:800; letter-spacing:.02em; }
.ch-sb .row.focus { background:var(--gold); border:4px solid var(--ink); border-radius:16px; margin:2px 6px; padding:0 12px; }
.ch-sb .row.poor { color:var(--disabled); }
.ch-sb .row.poor .ic, .ch-sb .row.poor .cost { opacity:.5; }
.ch-sb .row.lit .dia { filter: drop-shadow(0 0 0 var(--gold)); }
.ch-sb .ft { display:flex; align-items:center; justify-content:space-between; padding:10px 18px; font:700 28px/1 var(--font); color:var(--cocoa); }
.ch-sb .ft .k { display:flex; align-items:center; gap:6px; }
.ch-sb .tstep { padding:8px 18px; font:700 26px/1.2 var(--font); color:var(--cocoa); background:var(--recessed); }
.ch-bracket { width:150px; height:150px; }
.ch-card { position:absolute; left:50%; top:30%; transform:translate(-50%,-50%); }
.ch-meter { position:relative; flex:0 0 56px; width:56px; height:56px; border-radius:50%; background:conic-gradient(var(--mc) var(--a,0deg), var(--recessed) 0); border:3px solid var(--ink); box-sizing:border-box; display:flex; align-items:center; justify-content:center; }
.ch-meter::before { content:''; position:absolute; inset:7px; border-radius:50%; background:var(--cream); border:2.5px solid var(--ink); }
.ch-meter svg { position:relative; }
.ch-meter.full { box-shadow:0 0 0 4px var(--gold), 0 0 0 7px var(--ink); animation: chpulse 0.6s steps(2) infinite; }
.ch-plate.cast { box-shadow:0 0 0 5px var(--castc), var(--drop); }
.ch-lock { width:150px; height:150px; }
.ch-spec { display:flex; align-items:center; gap:8px; padding:6px 16px 6px 8px; background:var(--ink); border:3px solid var(--cream); border-radius:30px; color:var(--cream); font:800 30px/1 'Dela Gothic One',var(--font); letter-spacing:.03em; }
.ch-kc { display:inline-flex; align-items:center; justify-content:center; min-width:40px; height:40px; padding:0 8px; border-radius:10px 12px 11px 13px; background:var(--cream); border:3px solid var(--cocoa); box-shadow:0 3px 0 var(--cocoa); font:800 24px/1 var(--font); color:var(--cocoa); box-sizing:border-box; }
.ch-kc.big { min-width:52px; height:52px; font-size:30px; border-radius:14px 16px 15px 17px; }
.ch-plate .glyph .ch-kc { width:52px; height:52px; font-size:30px; }
.ch-evade { position:absolute; right:-30px; top:-24px; width:56px; height:56px; border-radius:50%; background:var(--recessed); border:4px solid var(--cocoa); display:flex; align-items:center; justify-content:center; box-shadow:var(--drop); }
.ch-evade.ready { background:var(--cream); border-color:var(--ink); }
.ch-evade .ring { position:absolute; inset:-5px; border-radius:50%; background:conic-gradient(var(--gold) var(--a,360deg), transparent 0); -webkit-mask: radial-gradient(circle, transparent 27px, #000 28px); mask: radial-gradient(circle, transparent 27px, #000 28px); }
.ch-evade .kc { position:absolute; right:-26px; bottom:-16px; }
.ch-hiss .kc { position:absolute; right:-14px; bottom:-14px; }
.ch-bark { padding:8px 14px 6px; border-radius:26px 30px 28px 32px; }
.ch-bark::before, .ch-bark::after { left:30px; }
.ch-keys { position:absolute; right:22px; top:18px; display:flex; gap:8px; align-items:center; font:700 22px/1 var(--font); color:var(--cocoa); background:var(--cream); border:3px solid var(--cocoa); border-radius:22px; padding:6px 12px 6px 8px; box-shadow:var(--drop); transform-origin:100% 0; }
.ch-hint { position:absolute; right:24px; bottom:18px; max-width:560px; padding:8px 16px; border-radius:22px; background:var(--cream); border:3px solid var(--cocoa); font:700 18px/1.35 var(--font); color:var(--cocoa); }
`;

const svgIcon = {
  hiss: `<svg viewBox="-20 -20 40 40" width="30" height="30"><path d="M-14 -4Q0 -16 14 -4L10 10Q0 4 -10 10Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M-8 -2l3 6l3 -6l3 6l3 -6" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
  bell: `<svg viewBox="-20 -22 40 44" width="34" height="36"><path d="M-14 10Q-14 -14 0 -16Q14 -14 14 10Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-17 10H17" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="15" r="4" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/><circle cx="-5" cy="-6" r="3" fill="${C.cream}"/></svg>`,
  chevron: `<svg viewBox="-20 -14 40 28" width="40" height="28"><path d="M-14 -6l14 12l14 -12" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M-14 -6l14 12l14 -12" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sprig: `<svg viewBox="-20 -20 40 40" width="36" height="36"><path d="M-10 14Q0 0 10 -14" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M0 0Q12 -2 12 -12Q0 -10 0 0ZM-4 6Q-16 6 -16 -4Q-4 -4 -4 6Z" fill="${C.green}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></svg>`,
  brick: `<svg viewBox="-17 -12 34 24" width="22" height="16"><path d="M-17 -12h34v24h-34z" fill="${C.sage}" stroke="${C.ink}" stroke-width="3"/><path d="M-17 0h34M0 -12v12M-8 0v12M9 0v12" fill="none" stroke="${C.ink}" stroke-width="2.5"/></svg>`,
  crown: `<svg viewBox="-20 -16 40 32" width="34" height="28"><path d="M-16 10L-14 -10L-6 0L0 -12L6 0L14 -10L16 10Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></svg>`,
  nickCrown: `<svg viewBox="-20 -16 40 32" width="26" height="22"><path d="M-16 10L-14 -10L-6 0L0 -12L6 0L14 -10L16 10Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M2 -8l-6 10" stroke="${C.ink}" stroke-width="3"/></svg>`,
  cowed: `<svg viewBox="-20 -20 40 40" width="30" height="30"><circle r="14" fill="${C.recessed}" stroke="${C.ink}" stroke-width="3"/><path d="M-14 -6L-22 4L-10 -2M14 -6L22 4L10 -2" fill="${C.recessed}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M-6 4q6 -4 12 0" fill="none" stroke="${C.ink}" stroke-width="2.5"/></svg>`,
  firedUp: `<svg viewBox="-20 -20 40 40" width="30" height="30"><path d="M-14 14Q-16 -4 0 -16Q16 -4 14 14Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M-6 8L0 -6L6 8" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></svg>`,
  soggy: `<svg viewBox="-20 -20 40 40" width="30" height="30"><path d="M0 -16Q14 2 10 10Q6 16 0 16Q-6 16 -10 10Q-14 2 0 -16Z" fill="${C.claw}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></svg>`,
  ruffled: `<svg viewBox="-20 -20 40 40" width="30" height="30"><path d="M-16 8L-10 -6L-4 6L2 -10L8 6L14 -6L16 8" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
  splat: `<svg viewBox="-20 -20 40 40" width="30" height="30"><ellipse rx="16" ry="6" cy="6" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><path d="M-10 -4l-4 -8M0 -6v-9M10 -4l4 -8" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></svg>`,
  clumped: `<svg viewBox="-20 -20 40 40" width="30" height="30"><circle cx="-6" cy="2" r="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><circle cx="7" cy="0" r="8" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/></svg>`,
  frazzled: `<svg viewBox="-20 -20 40 40" width="30" height="30"><path d="M0 0m-2 0a2 2 0 1 1 4 0a5 5 0 1 1 -10 0a8 8 0 1 1 16 0a11 11 0 1 1 -22 0" fill="none" stroke="${C.magenta}" stroke-width="3.5"/></svg>`,
  pileon: `<svg viewBox="-24 -24 48 48" width="40" height="40">${Kit.dustCloud({ r: 16, puffs: 5, seed: 2, lw: 2.5 })}</svg>`,
  queued: `<svg viewBox="-20 -20 40 40" width="30" height="30"><path d="M-12 -12h24v18h-14l-8 8v-8h-2z" fill="${C.gold}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><circle cx="-4" cy="-3" r="2.5" fill="${C.ink}"/><circle cx="5" cy="-3" r="2.5" fill="${C.ink}"/></svg>`,
  steam: (n) => `<svg viewBox="0 0 ${n * 26 + 4} 26" width="${n * 26 + 4}" height="26">${Array.from({ length: n }, (_, i) => `<path d="${Kit.blob(Kit.pomPts(15 + i * 26, 13, 10, 6, 0.18, i))}" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.5"/>`).join('')}</svg>`,
};
/** Bark pictograms by personality (icon-only in fights). */
const STAR = `<svg viewBox="-20 -20 40 40" width="34" height="34">${Kit.sparkle({ r: 15, fill: C.staticYellow, lw: 3, pinch: 0.3 })}</svg>`;
/** Special meter 0..1 for a cat: the sim's field once it publishes one (special / special_meter / zoomies). */
export const specialOf = (e) => { const v = e.special ?? e.special_meter ?? e.zoomies ?? 0; return Math.max(0, Math.min(1, v > 1 ? v / 100 : v)); };
export const BARK_ICON = {
  Mikan: svgIcon.bell, Stalwart: `<svg viewBox="-20 -20 40 40" width="36" height="36"><path d="M0 -16L14 -10V2Q14 12 0 17Q-14 12 -14 2V-10Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></svg>`,
  Goofball: `<svg viewBox="-20 -20 40 40" width="36" height="36"><circle r="15" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><path d="M-7 -3l3 -3l3 3M2 -3l3 -3l3 3" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/><path d="M-6 5Q0 11 6 5" fill="${C.pad}" stroke="${C.ink}" stroke-width="2.5"/></svg>`,
  Fraidy: `<svg viewBox="-20 -20 40 40" width="36" height="36"><path d="M0 -15Q12 2 9 9Q5 15 0 15Q-5 15 -9 9Q-12 2 0 -15Z" fill="${C.claw}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></svg>`,
  Braggart: `<svg viewBox="-20 -20 40 40" width="36" height="36">${Kit.sparkle({ r: 15, fill: C.staticYellow, lw: 3 })}</svg>`,
  Schemer: `<svg viewBox="-20 -20 40 40" width="36" height="36"><path d="M-14 0Q0 -12 14 0Q0 12 -14 0Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><circle r="5" fill="${C.ink}"/></svg>`,
  Brooder: Kit.ui.icon({ name: 'storm', size: 36 }),
  bang: `<svg viewBox="-20 -20 40 40" width="36" height="36"><path d="M-4 -16h8l-2 20h-4z" fill="${C.ink}"/><circle cy="11" r="4" fill="${C.ink}"/></svg>`,
  heart: Kit.ui.icon({ name: 'heart', size: 34 }),
};

const diamond = (filled, lit) => `<svg class="dia" viewBox="-16 -16 32 32" width="34" height="34"><path d="M0 -13L13 0L0 13L-13 0Z" fill="${filled ? (lit ? C.gold : C.ink) : 'none'}" stroke="${lit && !filled ? C.gold : C.ink}" stroke-width="${lit ? 4.5 : 3.5}" stroke-linejoin="round"/></svg>`;
const STATE_ICON = { ruffled: 'ruffled', splat: 'splat', soggy: 'soggy', frazzled: 'frazzled', clumped: 'clumped', cowed: 'cowed' };

function padSVG(fill) { return Kit.ui.paw({ size: 40, fill }); }

export class CombatHUD {
  constructor(parent, data) {
    this.D = data;
    const st = document.createElement('style'); st.textContent = KIT_CSS + CSS; document.head.appendChild(st);
    this.el = document.createElement('div'); this.el.className = 'ch'; parent.appendChild(this.el);
    this.world = document.createElement('div'); this.world.className = 'ch-world'; this.el.appendChild(this.world);
    this.bl = document.createElement('div'); this.bl.className = 'ch-corner ch-bl ch-show'; this.el.appendChild(this.bl);
    this.tc = document.createElement('div'); this.tc.className = 'ch-corner ch-tc ch-show'; this.el.appendChild(this.tc);
    this.cards = document.createElement('div'); this.cards.className = 'ch-corner'; this.cards.style.cssText = 'inset:0'; this.el.appendChild(this.cards);
    this.plates = new Map(); this.wEls = new Map(); this.portraits = {};
    this.sb = { open: false, cat: 0, row: 0, step: 'rows', target: 0 };
    this.lastHit = new Map(); this.flash = new Map(); this.scale = 1; this.hint = null;
  }

  /** Chestnut portrait from the same table as the 3D cast (fighters.js CAST_MAP), so plate and cat match. */
  portrait(catId, size, entId = catId) {
    const k = entId + ':' + size;
    if (!this.portraits[k]) this.portraits[k] = Kit.ui.portrait({ cat: { ...portraitFor(catId, entId), scale: 1.02 }, size, ring: catId === 'mikan' ? C.gold : C.cocoa });
    return this.portraits[k];
  }

  /** Build plates for the encounter's Posse and guest. */
  setup(s) {
    this.bl.innerHTML = '<div class="ch-plates"><div class="ch-relay" style="visibility:hidden"></div><div class="ch-guest"></div></div><div class="ch-sbwrap"></div>';
    const stack = this.bl.querySelector('.ch-plates');
    this.relayEl = stack.querySelector('.ch-relay'); this.guestEl = stack.querySelector('.ch-guest'); this.sbEl = this.bl.querySelector('.ch-sbwrap');
    const posse = s.entities.filter((e) => e.side === 'posse').sort((a, b) => a.slot - b.slot);
    for (const e of posse) {
      const d = document.createElement('div'); d.className = 'ch-plate';
      d.style.setProperty('--mc', styleOf(e.cat).col);
      d.innerHTML = `<div class="ch-meter" title="Special">${STAR}</div><div class="por">${this.portrait(e.cat, 72, e.id)}</div>
        <div class="mid"><div class="nm">${e.name}</div><div class="k-gauge"><i></i></div></div>
        <div class="pads">${[0, 1].map(() => `<div class="ch-pad"><div>${padSVG(C.recessed)}</div><div class="fill">${padSVG(C.pad)}</div></div>`).join('')}</div>
        <div class="poms"></div>`;
      stack.appendChild(d); this.plates.set(e.id, d);
    }
    this.posseIds = posse.map((e) => e.id);
    const boss = s.entities.find((e) => e.side === 'enemy' && (e.rank === 'boss' || e.rank === 'captain' || e.cat === 'challenger'));
    this.boss = boss ? boss.id : null;
    if (boss) {
      const [nm, title] = TITLES[boss.cat] || [boss.name.toUpperCase(), ''];
      this.tc.innerHTML = `<div class="ch-ribbon">${svgIcon.brick.replace('width="22" height="16"', 'width="46" height="34"')}<span>${nm}</span><small>${title}</small><span style="margin-left:auto">${boss.rank === 'boss' ? svgIcon.crown : '<b>|||</b>'}</span></div>
        <div class="ch-ribbon-sub"><div class="ch-seg">${boss.rank === 'boss' ? '<div><i></i></div><div><i></i></div><div><i></i></div>' : '<div><i></i></div>'}</div><div class="anger"></div><div class="fu"></div></div>`;
      this.tc.style.visibility = 'hidden';
    }
  }

  layout(w, h) {
    this.scale = Math.min(w / 1920, h / 1080);
    this.bl.style.transform = `scale(${this.scale})`;
    this.tc.style.transform = `translateX(-50%) scale(${this.scale})`; this.tc.style.left = '50%';
    this.w = w; this.h = h;
  }
  /** Screen rectangles the lettering must avoid (BL plates, TC ribbon, Slow Blink menu). */
  rects() {
    const out = [];
    for (const el of [this.bl.querySelector('.ch-plates'), this.tc.firstElementChild, this.sbEl && this.sbEl.firstElementChild]) {
      if (!el) continue; const r = el.getBoundingClientRect(); if (r.width) out.push({ x: r.left, y: r.top, w: r.width, h: r.height });
    }
    return out;
  }

  showChrome(on) { if (this.keysEl) this.keysEl.style.visibility = on ? 'visible' : 'hidden'; for (const el of [this.bl, this.tc]) el.className = el.className.replace(/ch-(hide|show)/, on ? 'ch-show' : 'ch-hide'); this.world.style.visibility = on ? 'visible' : 'hidden'; }

  onEvent(ev, s, t) {
    if (ev.type === 'Hit' && ev.target) this.lastHit.set(ev.target, t);
    if (ev.type === 'TagIn' || (ev.type === 'Switch')) { const p = this.plates.get(ev.to); if (p) this.flash.set(ev.to, t + 0.12); }
    if (ev.type === 'Hit' && ev.target === s.controlled && ev.feel && ev.feel.tier >= 4) this.bumpUntil = t + 0.08;
    if (ev.type === 'FightStarted' && this.boss) this.tc.style.visibility = 'visible';
  }

  /** Swap every input glyph to the device in use: keycaps on keyboard + mouse, pad glyphs on a gamepad. */
  setDevice(dev) {
    if (dev === this.device) return; this.device = dev;
    if (!this.keysEl) { this.keysEl = document.createElement('div'); this.keysEl.className = 'ch-keys'; this.el.appendChild(this.keysEl); }
    this.keysEl.innerHTML = dev === 'pad' ? `<span class="ch-kc">R3</span>Lock <span class="ch-kc">R2</span>Skills <span class="ch-kc">☰</span>Pause` : `${kc('Tab')}Lock ${kc('R')}Skills ${kc('P')}Pause`;
    this.keysEl.style.transform = `scale(${this.scale})`;
    if (this.sbEl) this.sbEl._h = null;
  }

  /** Per-frame update. ctx: {s, t, project(v3)->{x,y,on}, fighters, menuEvents[], sendCommand(cmd), device} */
  update(ctx) {
    const { s, t } = ctx;
    this.setDevice(ctx.device || 'kbm');
    const byId = new Map(s.entities.map((e) => [e.id, e]));
    // plates
    for (const id of this.posseIds) {
      const e = byId.get(id), p = this.plates.get(id); if (!e || !p) continue;
      const ctl = e.controlled;
      p.classList.toggle('ctl', ctl); p.classList.toggle('routed', e.routed);
      p.classList.toggle('flash', (this.flash.get(id) || 0) > t);
      p.classList.toggle('bump', ctl && (this.bumpUntil || 0) > t);
      const g = p.querySelector('.k-gauge'), nv = e.nerve / e.nerve_max;
      g.querySelector('i').style.width = (nv * 100).toFixed(1) + '%'; g.classList.toggle('k-gauge--low', nv < 0.25);
      const pads = p.querySelectorAll('.ch-pad'), free = e.paws;
      pads.forEach((pd, i) => { const f = Math.max(0, Math.min(1, free - i)); pd.querySelector('.fill').style.setProperty('--c', ((1 - f) * 100).toFixed(0) + '%'); pd.classList.toggle('full', f >= 1); });
      // Special meter (M1.1 §6: Zoomies folded into the Special): a ring in the cat's colour around a star
      const glyph = p.querySelector('.ch-meter'), mv = specialOf(e);
      glyph.style.setProperty('--a', Math.round(360 * mv) + 'deg'); glyph.classList.toggle('full', mv >= 1 && !e.routed);
      const castT = this.moveTag && this.moveTag.get(id);
      p.classList.toggle('cast', !!(castT && t < castT.until)); if (castT) p.style.setProperty('--castc', castT.col || C.gold);
      const cowedNerves = e.status && e.status.kind === 'cowed' && e.status.source === 'nerves';
      glyph.classList.toggle('pulse', false); void cowedNerves;
      // poms: status (+ badge), queued command, can-act bell, hiss
      let poms = '';
      if (e.status) {
        const ic = svgIcon[e.status.kind === 'fired_up' ? 'firedUp' : e.status.kind] || '';
        const tot = e.status.source === 'nerves' ? (e.personality === 'Fraidy' ? 30 : 20) : e.status.kind === 'soggy' ? 6 : 8;
        const a = e.status.left_s > 0 ? Math.round(360 * Math.min(1, e.status.left_s / tot)) : 360;
        poms += `<div class="ch-pom"><div class="ring" style="--a:${a}deg"></div>${ic}${cowedNerves ? `<div class="badge">${svgIcon.nickCrown}</div>` : ''}</div>`;
      }
      const mt = this.moveTag && this.moveTag.get(id); if (mt && t < mt.until) poms += `<div class="ch-pom gold" style="width:46px;height:46px">${mt.icon}</div>`;
      if (e.orders && e.orders.length) poms += `<div class="ch-pom gold">${svgIcon.queued}</div>`;
      if (!ctl && !e.routed && e.paws - (e.paws_reserved || 0) >= 1) poms += `<div class="ch-pom gold" style="width:34px;height:34px">${svgIcon.bell.replace('width="34" height="36"', 'width="24" height="26"')}</div>`;
      const pe = p.querySelector('.poms'); if (pe._h !== poms) { pe.innerHTML = poms; pe._h = poms; }
      // evade cooldown (M1.2 §2): a pom on the controlled plate draining over the cooldown, with the Space key
      let ev = p.querySelector('.ch-evade');
      if (ctl && !e.routed) {
        if (!ev) { ev = document.createElement('div'); ev.className = 'ch-evade'; ev.innerHTML = `<div class="ring"></div><svg viewBox="-20 -20 40 40" width="30" height="30"><path d="M-14 6Q-2 -14 14 -6" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><path d="M8 -12L15 -5L6 0" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg><span class="kc"></span>`; p.appendChild(ev); }
        const cd = e.evade_cd_s ?? e.evade_cd ?? 0, mx = (this.D.k.evade && this.D.k.evade.cooldown_s) || this.D.k.evade_cooldown_s || 0.8;
        ev.querySelector('.ring').style.setProperty('--a', Math.round(360 * (1 - Math.min(1, cd / mx))) + 'deg'); ev.classList.toggle('ready', cd <= 0);
        const kk = ev.querySelector('.kc'), want = this.device === 'pad' ? Kit.ui.faceButtons({ size: 30, lit: 'e' }) : kc('Space'); if (kk._h !== want) { kk.innerHTML = want; kk._h = want; }
      } else if (ev) ev.remove();
      let hs = p.querySelector('.ch-hiss');
      if (false) {
        if (!hs) { hs = document.createElement('div'); hs.className = 'ch-hiss'; hs.innerHTML = `<div class="ring"></div>${svgIcon.hiss}<span class="kc"></span>`; p.appendChild(hs); }
        const a = e.hiss_cd_s > 0 ? Math.round(360 * (1 - e.hiss_cd_s / 8)) : 360;
        hs.querySelector('.ring').style.setProperty('--a', a + 'deg');
        hs.classList.toggle('ready', e.hiss_cd_s <= 0);
        const hk = hs.querySelector('.kc'); const want = this.device === 'pad' ? Kit.ui.faceButtons({ size: 34, lit: 'n' }) : kc('F'); if (hk._h !== want) { hk.innerHTML = want; hk._h = want; }
        hs.classList.toggle('alert', s.telegraphs.some((tl) => tl.cls === 'yellow' && tl.aimed_at === e.id));
      } else if (hs) hs.remove();
    }
    // Relay chain
    if (s.relay && s.relay.count > 0) {
      this.relayEl.style.visibility = 'visible';
      const faces = s.relay.members.map((id) => `<div class="f on">${this.portrait(byId.get(id)?.cat || id, 44, id)}</div>`).join('') + Array.from({ length: Math.max(0, 4 - s.relay.members.length) }, () => '<div class="f"></div>').join('');
      if (this.relayEl._h !== faces) { this.relayEl.innerHTML = faces; this.relayEl._h = faces; }
    } else this.relayEl.style.visibility = 'hidden';
    // guest plate
    const guest = s.entities.find((e) => e.side === 'guest');
    if (guest && guest.guest && guest.guest.state !== 'waiting' && guest.present !== false) {
      if (!this.guestEl.firstChild) this.guestEl.innerHTML = `<div class="ch-plate guest"><div class="por">${this.portrait(guest.cat, 60, guest.id)}</div><div class="mid"><div class="nm">${svgIcon.sprig} ${guest.name}</div><div class="k-gauge"><i></i></div></div></div>`;
      this.guestEl.querySelector('.k-gauge i').style.width = (100 * guest.nerve / guest.nerve_max).toFixed(1) + '%';
      this.guestEl.firstChild.classList.toggle('routed', guest.routed);
    }
    // identity ribbon (boss / captain)
    if (this.boss) {
      const b = byId.get(this.boss);
      if (b) {
        const segs = this.tc.querySelectorAll('.ch-seg > div > i'), nv = b.nerve / b.nerve_max;
        if (segs.length === 3) segs.forEach((el, i) => { el.style.width = (Math.max(0, Math.min(1, (nv - (2 - i) / 3) * 3)) * 100).toFixed(1) + '%'; });
        else if (segs[0]) segs[0].style.width = (nv * 100).toFixed(1) + '%';
        const af = b.anger_fired_up, fuEl = this.tc.querySelector('.fu'), anEl = this.tc.querySelector('.anger');
        const stage = af ? af.stage : null, n = { Riled: 1, Seething: 2, Furious: 3 }[stage] || 0;
        const html = (n ? svgIcon.steam(n) : '') + '|' + (b.status && b.status.kind === 'fired_up' || (af && af.active) ? `<div class="ch-pom"><div class="ring" style="--a:${af && af.left_s > 0 ? 360 : 360}deg"></div>${svgIcon.firedUp}</div>` : (b.status ? `<div class="ch-pom">${svgIcon[b.status.kind === 'fired_up' ? 'firedUp' : b.status.kind] || ''}</div>` : ''));
        if (this.tc._h !== html) { const [a1, f1] = html.split('|'); anEl.innerHTML = a1; fuEl.innerHTML = f1; this.tc._h = html; }
      }
    }
    this.updateSlowBlink(ctx, byId);
    this.updateWorld(ctx, byId);
  }

  wEl(key, cls, html) {
    let el = this.wEls.get(key);
    if (!el) { el = document.createElement('div'); el.className = cls; this.world.appendChild(el); this.wEls.set(key, el); }
    if (html != null && el._h !== html) { el.innerHTML = html; el._h = html; }
    el._seen = true; return el;
  }
  place(el, p, dy = 0) { el.style.left = p.x.toFixed(1) + 'px'; el.style.top = (p.y + dy).toFixed(1) + 'px'; el.style.display = p.on ? '' : 'none'; }

  updateWorld(ctx, byId) {
    const { s, t, fighters } = ctx;
    for (const el of this.wEls.values()) el._seen = false;
    const sc = Math.max(0.6, this.scale);
    for (const e of s.entities) {
      const f = fighters.get(e.id); if (!f || !f.root.visible || s.mode === 'pileon') continue;
      const head = ctx.project(f.head);
      if (e.side === 'enemy' && !e.routed) {
        const show = e.id !== ctx.quietId && (s.lock === e.id || (t - (this.lastHit.get(e.id) || -9) < 3) || e.frazzled_s > 0);
        if (show && e.id !== this.boss || (show && e.id === this.boss)) {
          const nv = e.nerve / e.nerve_max, fz = e.frazzled_s > 0 ? 100 : (e.frazzle || 0);
          const el = this.wEl('bar:' + e.id, 'ch-ebar', `<div class="row"><span class="emb">${svgIcon.brick}</span><div class="k-gauge nerve"><i style="--v:${(nv * 100).toFixed(0)}%"></i></div></div><div class="row"><div class="k-gauge k-gauge--frazzle fz" style="--k-fill:${e.frazzled_s > 0 ? C.magenta : C.staticYellow}"><i style="--v:${fz.toFixed(0)}%"></i></div></div>`);
          el.style.transform = `translate(-50%,-100%) scale(${sc})`;
          this.place(el, head, -16 * sc);
        }
      }
      // overhead ticks: the controlled cat's bell, Posse chevrons, the guest's sprig
      // enemies: a small red downward wedge over the head (a shape cue, so red is not the only signal)
      if (!e.routed && e.side === 'enemy' && e.id !== ctx.quietId) {
        const el = this.wEl('etick:' + e.id, 'ch-tick', `<svg viewBox="-20 -14 40 28" width="34" height="24"><path d="M-12 -9H12L0 9Z" fill="#E2453F" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></svg>`);
        el.style.transform = `translate(-50%,-100%) scale(${sc})`;
        this.place(el, head, (e.id === s.lock || (t - (this.lastHit.get(e.id) || -9) < 3) || e.frazzled_s > 0 ? -62 : -8) * sc);
      }
      if (!e.routed && e.side !== 'enemy') {
        const icon = e.controlled ? svgIcon.bell : e.side === 'guest' ? svgIcon.sprig : svgIcon.chevron;
        const el = this.wEl('tick:' + e.id, 'ch-tick', icon);
        el.style.transform = `translate(-50%,-100%) scale(${sc * (e.controlled ? 1.2 : 1)})`;
        this.place(el, head, -8 * sc);
      }
    }
    // the one bark balloon
    if (this.barkMsg && t < this.barkMsg.until && s.mode !== 'pileon' && !ctx.quietId) {
      const f = fighters.get(this.barkMsg.id);
      if (f && f.root.visible) { const el = this.wEl('bark', 'k-bubble ch-bark', BARK_ICON[this.barkMsg.icon] || this.barkMsg.icon); el.style.transform = `translate(-30%,-100%) scale(${sc * 0.9})`; this.place(el, ctx.project(f.head), -60 * sc); }
    }
    // Special prompt (M1.1 §6): F on a staggered enemy while Mikan's Special is ready
    if (ctx.specialTarget && s.mode !== 'pileon' && !ctx.cinematic) {
      const f = fighters.get(ctx.specialTarget);
      if (f) {
        const k2 = Math.floor(t * 15) % 2 ? 1.06 : 1;
        const bonus = s.special_prompt && s.special_prompt.staggered;
        const el = this.wEl('special', 'ch-spec', `${this.device === 'pad' ? Kit.ui.faceButtons({ size: 46, lit: 's' }) : kc('F', true)}${STAR.replace('width="34" height="34"', 'width="40" height="40"')}SPECIAL${bonus ? '<span style="font-size:22px;color:var(--gold);margin-left:6px">×1.3 STAGGER</span>' : ''}`);
        el.style.transform = `translate(-50%,-100%) scale(${(sc * k2).toFixed(3)})`;
        const p = ctx.project(f.head); this.place(el, p, -112 * sc);
      }
    }
    // lock-on indicator (Tab): four Bell-Gold corner ticks around the locked enemy's body, stepping on twos
    if (ctx.lockId && !s.slow_blink && s.mode !== 'pileon' && ctx.lockId !== ctx.quietId) {
      const f = fighters.get(ctx.lockId);
      if (f && f.root.visible) {
        const feet = ctx.project(f.pos), head = ctx.project(f.head), hpx = Math.max(40, feet.y - head.y) * 1.7;
        const pop = this.lockFlash && t - this.lockFlash < 0.1 ? 1.25 : 1, rot = (Math.floor(t * 15) % 2) * 6;
        const el = this.wEl('lock', 'ch-lock', `<svg viewBox="0 0 150 150" width="150" height="150"><g transform="rotate(${45 + rot} 75 75)"><g fill="${C.gold}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"><path d="M75 4l10 16h-20z"/><path d="M75 146l10 -16h-20z"/><path d="M4 75l16 10v-20z"/><path d="M146 75l-16 10v-20z"/></g></g><circle cx="75" cy="75" r="58" fill="none" stroke="${C.gold}" stroke-width="3" stroke-dasharray="8 10"/></svg>`);
        el.style.transform = `translate(-50%,-50%) scale(${(hpx / 150 * pop).toFixed(3)})`; this.place(el, { x: (feet.x + head.x) / 2, y: (feet.y + head.y) / 2, on: feet.on }, 0);
      }
    }
    // Slow Blink: props and known Fears highlighted in the world (replaces Whisker Sense in combat)
    if (s.slow_blink) for (const pr of s.props) {
      if (!pr.uses_left) continue;
      const el = this.wEl('prop:' + pr.id, 'ch-pom', svgIcon.soggy);
      el.style.transform = `translate(-50%,-100%) scale(${sc * 1.3})`; el.style.background = 'var(--cream)';
      this.place(el, ctx.project({ x: pr.pos[0], y: (pr.id === 'wash_tub' ? 0.5 : 0.4), z: pr.pos[2], clone() { return this; } }), -6);
    }
    // Slow Blink target cursor: bell-gold corner brackets
    if (this.sb.open && this.sb.step === 'target' && this.sb.targets && this.sb.targets[this.sb.target]) {
      const f = fighters.get(this.sb.targets[this.sb.target]);
      if (f) { const el = this.wEl('bracket', 'ch-bracket', `<svg viewBox="0 0 150 150" width="150" height="150"><g fill="none" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"><path d="M10 50V10H50M100 10H140V50M140 100V140H100M50 140H10V100"/></g><g fill="none" stroke="${C.gold}" stroke-width="6" stroke-linecap="round"><path d="M10 50V10H50M100 10H140V50M140 100V140H100M50 140H10V100"/></g></svg>`);
        // bracket the cat's BODY: centred between feet and head, sized to its projected height
        const feet = ctx.project(f.pos), head = ctx.project(f.head), hpx = Math.max(40, feet.y - head.y) * 1.5;
        el.style.transform = `translate(-50%,-50%) scale(${(hpx / 150).toFixed(3)})`; this.place(el, { x: (feet.x + head.x) / 2, y: (feet.y + head.y) / 2, on: feet.on }, 0); }
    }
    for (const [k, el] of this.wEls) if (!el._seen) { el.remove(); this.wEls.delete(k); }
  }

  /* ------------------------------------------------------------------ Slow Blink command menu */
  updateSlowBlink(ctx, byId) {
    const { s } = ctx, sb = this.sb;
    if (!s.slow_blink) { if (sb.open) { sb.open = false; this.sbEl.innerHTML = ''; } return; }
    const posse = this.posseIds.map((id) => byId.get(id)).filter((e) => e && !e.routed);
    if (!sb.open) { sb.open = true; sb.step = 'rows'; sb.row = 0; sb.cat = Math.max(0, posse.findIndex((e) => e.controlled)); }
    const cat = posse[sb.cat % posse.length]; if (!cat) return;
    const D = this.D;
    const rows = [];
    if (s.pile_on_offer) rows.push({ kind: 'pile' });
    for (const m of cat.moves || []) rows.push({ kind: 'move', id: m, row: D.moves[m] });
    rows.push({ kind: 'scram' });
    sb.rows = rows; sb.row = Math.min(sb.row, rows.length - 1);
    const free = cat.paws - (cat.paws_reserved || 0);
    const lock = byId.get(s.lock);
    const conds = (t) => { const o = new Set(); if (!t) return o; if (t.ruffled_s > 0 || t.ruffled_s === -1) o.add('ruffled'); if (t.splat_s > 0) o.add('splat'); if (t.status && t.status.kind === 'soggy') o.add('soggy'); if (t.frazzled_s > 0) o.add('frazzled'); if (t.clumped_s > 0) o.add('clumped'); return o; };
    // input
    for (const m of ctx.menuEvents) {
      if (m === 'close') { ctx.send({ slowBlink: true }); continue; }
      if (sb.step === 'rows') {
        if (m === 'up') sb.row = (sb.row + rows.length - 1) % rows.length;
        if (m === 'down') sb.row = (sb.row + 1) % rows.length;
        if (m === 'prevCat' || m === 'left') { sb.cat = (sb.cat + posse.length - 1) % posse.length; sb.row = 0; }
        if (m === 'nextCat' || m === 'right') { sb.cat = (sb.cat + 1) % posse.length; sb.row = 0; }
        if (m === 'back') ctx.send({ slowBlink: true });
        if (m === 'confirm') {
          const r = rows[sb.row];
          if (r.kind === 'pile') ctx.send({ command: { action: 'pile_on' } });
          else if (r.kind === 'scram') ctx.send({ command: { action: 'scram' } });
          else if (r.row && free >= r.row.cost) {
            const allies = r.row.target === 'ally' || r.row.target === 'self';
            const pool = s.entities.filter((e) => e.present && !e.routed && (allies ? e.side !== 'enemy' : e.side === 'enemy'));
            sb.targets = pool.map((e) => e.id); sb.target = Math.max(0, sb.targets.indexOf(allies ? cat.id : s.lock)); sb.step = 'target'; sb.move = r.id;
          }
        }
      } else {
        if (m === 'left' || m === 'up' || m === 'prevCat') sb.target = (sb.target + sb.targets.length - 1) % sb.targets.length;
        if (m === 'right' || m === 'down' || m === 'nextCat') sb.target = (sb.target + 1) % sb.targets.length;
        if (m === 'back') sb.step = 'rows';
        if (m === 'confirm') {
          ctx.send({ command: { cat: cat.id, move: sb.move, target: sb.targets[sb.target] } });
          sb.step = 'rows'; sb.row = 0;
          // chain: move to the next cat that can afford a Move
          for (let i = 1; i <= posse.length; i++) { const c = posse[(sb.cat + i) % posse.length]; if (c.paws - (c.paws_reserved || 0) >= 1 && (c.moves || []).length) { sb.cat = (sb.cat + i) % posse.length; break; } }
        }
      }
    }
    const tgt = sb.step === 'target' ? byId.get(sb.targets[sb.target]) : lock;
    const tc = conds(tgt);
    const costPips = (n) => Array.from({ length: n }, () => Kit.ui.paw({ size: 30 })).join('');
    const pad = this.device === 'pad';
    let html = `<div class="ch-sb"><div class="tstep" style="background:var(--ink);color:var(--cream);font-weight:800">SKILLS · time slowed · ${pad ? 'L1 / R1' : kc('Q') + ' ' + kc('E')} pick a cat to force its skill</div><div class="hd"><span class="key">${pad ? 'L1' : 'Q'}</span><span class="who">${this.portrait(cat.cat, 46, cat.id)}${cat.name}</span><span class="key">${pad ? 'R1' : 'E'}</span></div>`;
    rows.forEach((r, i) => {
      const focus = i === sb.row && sb.step === 'rows' ? ' focus' : '';
      if (r.kind === 'pile') html += `<div class="row pin${focus}"><span class="ic">${svgIcon.pileon}</span><span class="nm">PILE-ON</span>${pad ? Kit.ui.faceButtons({ size: 40, lit: 'n' }) : kc('F')}</div>`;
      else if (r.kind === 'scram') html += `<div class="row${focus}" style="border-bottom:0"><span class="nm" style="font-weight:700;color:var(--cocoa)">Scram</span></div>`;
      else {
        const mv = r.row || { name: r.id, cost: 1, role: 'setup' }, poor = free < mv.cost;
        const payoff = mv.role === 'payoff', lit = payoff && (mv.pays_on || []).some((c) => tc.has(c));
        const st = payoff ? (mv.pays_on || [])[0] : mv.creates;
        html += `<div class="row${focus}${poor ? ' poor' : ''}${lit ? ' lit' : ''}"><span class="ic">${svgIcon[mv.type === 'thump' ? 'splat' : mv.type === 'yowl' ? 'cowed' : 'ruffled'] || ''}</span><span class="nm">${mv.name}</span><span class="cost">${costPips(mv.cost)}</span>${diamond(payoff, lit)}<span class="st">${svgIcon[STATE_ICON[st]] || ''}</span></div>`;
      }
    });
    if (sb.step === 'target') html += `<div class="tstep">Target: <b>${tgt ? tgt.name : '-'}</b> · ${pad ? '◀ ▶' : kc('A') + ' ' + kc('D')} pick</div>`;
    html += `<div class="ft"><span>${sb.step === 'target' ? '' : ''}</span><span class="k">${pad ? Kit.ui.faceButtons({ size: 40, lit: 's' }) : kc('Space')}OK</span><span class="k">${pad ? Kit.ui.faceButtons({ size: 40, lit: 'e' }) : kc('Esc')}Back</span><span class="key" style="background:var(--cocoa);color:var(--cream)">${pad ? 'R2' : 'R'} close</span></div></div>`;
    if (this.sbEl._h !== html) { this.sbEl.innerHTML = html; this.sbEl._h = html; }
  }

  /** A cat (AI or commanded) just used a Move: its plate shows the Move's pom for 1.4 s, so the player sees who did what. */
  moveUsed(id, move, t) {
    const mv = (move && this.D.moves[move]) || {}; this.moveTag = this.moveTag || new Map();
    const icon = svgIcon[mv.creates ? STATE_ICON[mv.creates] : mv.type === 'thump' ? 'splat' : mv.type === 'yowl' ? 'cowed' : 'ruffled'] || svgIcon.ruffled;
    this.moveTag.set(id, { icon: mv.target === 'ally' ? BARK_ICON.heart : icon, until: t + 1.4, col: styleOf(this.catOf ? this.catOf(id) : id).col }); this.flash.set(id, t + 0.12);
  }

  /** Icon-only fight bark (DR-44): one balloon at a time over a cat, ~0.9 s. */
  bark(id, icon, t, force = false) { if (!force && this.barkMsg && t < this.barkMsg.until - 0.3) return; this.barkMsg = { id, icon, until: t + 0.9 }; }

  /** Centre card (Standoff name-card / outcome): a wedge-ended band slamming into the upper third. */
  card(text, sub, ms, t, clowder = 'ink', y = 0.3) {
    this.cards.innerHTML = `<div class="ch-card" style="top:${y * 100}%;"transform:translate(-50%,-50%) scale(${this.scale * 1.15})"><div class="k-band" style="${clowder === 'sage' ? 'background:var(--sage);color:var(--ink)' : clowder === 'gold' ? 'background:var(--gold);color:var(--ink)' : ''}">${text}${sub ? `<span style="font-size:30px;font-weight:700;opacity:.9">${sub}</span>` : ''}</div></div>`;
    this.cardStart = t; this.cardEnd = t + ms / 1000;
  }
  tickCard(t) {
    const el = this.cards.firstElementChild; if (!el) return;
    if (t > this.cardEnd) { this.cards.innerHTML = ''; return; }
    el.style.transform = `translate(-50%,-50%) scale(${this.scale * (t - this.cardStart < 1 / 30 ? 1.15 : 1)})`;
  }
  setHint(text) {
    if (!this.hintEl) { this.hintEl = document.createElement('div'); this.hintEl.className = 'ch-hint'; this.el.appendChild(this.hintEl); }
    this.hintEl.textContent = text; this.hintEl.style.display = text ? '' : 'none';
  }
}

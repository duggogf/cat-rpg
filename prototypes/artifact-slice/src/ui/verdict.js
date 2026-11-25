// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The three-card Verdict (design/ux/key-screens.md §4; mock design/previews/07-verdict.png; owner C4):
// Up = Nose-Touch (truce chip), Left = Chase Off, Right = Recruit (Bribe row: Life 1 "Free"; Life 2 Fair · Feast).
// No Down card, no default focus; a 500 ms input lock as the cards fan in; a direction or hover raises a card and plays
// its honest tell (Up: the Rival's tail, lashing = closed / still = open; Right: the card's own tell: eyes on the Bribe
// and a forward lean when open or only short of Stash, a turned tail when the cat is not recruitable, bared teeth on a gate;
// Left: Mikan turns away, the Rival's ears drop); hold South / Enter / LMB 600 ms to commit, or press then confirm.
// An unavailable card is halftoned in place with its reason. Every choice clears the post.
// Facts (gate, prices, tiers) come from the nemesis simulation when it is present (verdictView), else the slice seeds.
import { Kit } from '../render/vfx/sprites.js';
import '../../../../design/previews/rival-helpers.js';
import { NDATA } from '../sim/nemesis/data.js';

const K = Kit, C = Kit.C, RV = globalThis.RV;
const st2 = `stroke="${C.ink}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const arrow = (rot) => `<svg width="48" height="48" viewBox="-24 -24 48 48"><circle r="21" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><path d="M0 11V-9M-8 -1L0 -10L8 -1" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${rot})"/></svg>`;
const ICON = {
  nose: RV.stamp(`<path d="M-12 -2Q-12 -12 -4 -12Q0 -12 0 -6Q0 -12 4 -12Q12 -12 12 -2Q12 8 0 12Q-12 8 -12 -2Z" fill="${C.pad}" ${st2}/><path d="M-6 0Q0 5 6 0" fill="none" ${st2}/>`, { size: 48, color: C.cream }),
  chase: RV.stamp(RV.GLYPH.run, { size: 48, color: C.cream }),
  recruit: RV.stamp(`<path d="M-14 6Q-8 -12 0 -4Q8 -12 14 6" fill="none" ${st2}/><circle cx="0" cy="8" r="5" fill="${C.gold}" ${st2}/>`, { size: 48, color: C.cream }),
};
const fish = `<svg width="30" height="18" viewBox="-15 -9 30 18"><path d="M-12 0Q-4 -8 6 -3L13 -8V8L6 3Q-4 8 -12 0Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="-6" cy="-1" r="1.6" fill="${C.ink}"/></svg>`;
const CSS = `
.vd { position:fixed; inset:0; z-index:37; font-family:var(--font); color:var(--ink); display:none; user-select:none; }
.vd.on { display:block; }
.vd * { box-sizing:border-box; }
.vd.test *, .vd.test { animation:none !important; transition:none !important; }
.vd-st { position:absolute; left:50%; top:50%; width:1920px; height:1080px; margin:-540px 0 0 -960px; transform-origin:50% 50%; }
.vd-card { position:absolute; background:var(--cream); border:4px solid var(--cocoa); border-radius:var(--bean); box-shadow:var(--drop); padding:22px 30px 22px; transition:transform .1s steps(3), box-shadow .1s; animation:vdfan .3s steps(4) both; cursor:pointer; }
@keyframes vdfan { 0% { transform:translateY(60px) scale(.6); opacity:0; } 100% { transform:none; opacity:1; } }
.vd-card .t { display:flex; align-items:center; gap:12px; font:800 46px/1 var(--font); color:var(--cocoa); white-space:nowrap; }
.vd-card .t svg { flex:none; }
.vd-card .t .chip { margin-left:auto; padding:6px 14px; border:3px solid var(--cocoa); border-radius:22px; font:800 30px/1 var(--font); background:#FFF0C8; display:inline-flex; align-items:center; gap:6px; }
.vd-card .l { font:500 32px/1.3 var(--font); margin-top:14px; }
.vd-card.up { left:650px; top:30px; width:620px; }
.vd-card.left { left:40px; top:380px; width:480px; }
.vd-card.right { left:1350px; top:290px; width:540px; }
.vd-card.raised { border-color:var(--gold); box-shadow:0 0 0 6px var(--gold), var(--drop); transform:scale(1.04); z-index:2; }
.vd-card.off { color:#8C8494; }
.vd-card.off::after { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none; background-image:radial-gradient(rgba(110,106,168,.42) 22%, transparent 26%); background-size:9px 9px; }
.vd-card.off .t { color:#8C8494; }
.vd-card .why { margin-top:10px; font:800 28px/1.2 var(--font); color:var(--crimson); }
.vd-steps { display:flex; gap:14px; margin-top:16px; }
.vd-step { flex:1; text-align:center; border:4px solid var(--cocoa); border-radius:18px; padding:10px 8px; font:800 30px/1.15 var(--font); background:var(--cream); }
.vd-step b { display:flex; align-items:center; justify-content:center; gap:6px; font:800 40px/1 var(--font); }
.vd-step small { display:block; font:700 26px/1.1 var(--font); }
.vd-step.on { background:var(--gold); border-color:var(--ink); }
.vd-step.short { color:#9A90A2; background-image:repeating-linear-gradient(45deg, rgba(110,106,168,.18) 0 6px, transparent 6px 12px); }
.vd-meta { display:flex; justify-content:space-between; margin-top:12px; font:700 30px/1 var(--font); }
.vd-meta .warn { color:#B0607A; font-size:26px; display:block; text-align:right; margin-top:10px; }
.vd-strip { position:absolute; left:50%; top:900px; transform:translateX(-50%); white-space:nowrap; max-width:none; padding:14px 34px; font:800 36px/1 var(--font); }
.vd-foot { position:absolute; left:40px; right:40px; top:976px; display:flex; justify-content:space-between; align-items:center; }
.vd-foot .k-prompt { white-space:nowrap; cursor:pointer; }
.vd-tell { position:absolute; left:var(--tx,1120px); top:var(--ty,520px); max-width:none; white-space:nowrap; transform:translate(-50%,-100%); padding:14px 22px; font:800 28px/1.15 var(--font); text-align:center; }
.vd-tell svg { display:block; margin:0 auto 6px; }
.vd-tell--r { left:min(calc(var(--tx,1120px) + 130px), 1320px); transform:translate(-100%,-100%); }
.vd-pay { position:absolute; left:50%; top:420px; transform:translate(-50%,-50%) rotate(-5deg); padding:20px 46px; font:800 64px/1 var(--font); border:6px solid var(--ink); border-radius:18px; background:var(--cream); animation:vdslam .2s steps(3); display:flex; align-items:center; gap:18px; }
@keyframes vdslam { 0% { transform:translate(-50%,-50%) rotate(-5deg) scale(1.6); } 100% { transform:translate(-50%,-50%) rotate(-5deg) scale(1); } }
.lash { animation:vdlash .5s steps(2) infinite; transform-origin:4px 30px; }
@keyframes vdlash { 50% { transform:rotate(28deg); } }
`;
const TAIL = (lash) => `<svg width="90" height="70" viewBox="-20 -40 90 70"><g class="${lash ? 'lash' : ''}"><path d="M4 30Q-10 -6 14 -30Q30 -40 40 -26" fill="none" stroke="${C.ink}" stroke-width="15" stroke-linecap="round"/><path d="M4 30Q-10 -6 14 -30Q30 -40 40 -26" fill="none" stroke="#37323F" stroke-width="9" stroke-linecap="round"/></g>${lash ? `<path d="M50 -20l10 -6M54 -4l12 0M50 10l10 6" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>` : ''}</svg>`;
const EYES = `<svg width="120" height="50" viewBox="-60 -25 120 50"><ellipse cx="-22" cy="0" rx="16" ry="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/><ellipse cx="22" cy="0" rx="16" ry="18" fill="${C.cream}" stroke="${C.ink}" stroke-width="4"/><circle cx="-14" cy="2" r="7" fill="${C.ink}"/><circle cx="30" cy="2" r="7" fill="${C.ink}"/><path d="M44 -6l10 -4M46 8l10 2" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></svg>`;
const TAILTURN = `<svg width="120" height="64" viewBox="-60 -34 120 64"><path d="M-40 22Q-46 -4 -20 -10Q8 -14 22 2Q30 14 26 24Z" fill="${C.cream}" ${st2}/><path d="M24 14Q44 6 40 -14Q36 -28 50 -30" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/><path d="M24 14Q44 6 40 -14Q36 -28 50 -30" fill="none" stroke="#37323F" stroke-width="5" stroke-linecap="round"/><circle cx="-34" cy="-22" r="9" fill="${C.gold}" ${st2}/><path d="M-50 -34l6 5M-18 -34l-6 5" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></svg>`;
const TEETH = `<svg width="120" height="52" viewBox="-60 -26 120 52"><path d="M-44 -8Q0 -22 44 -8Q40 18 0 20Q-40 18 -44 -8Z" fill="#B0607A" ${st2}/><path d="M-34 -9L-28 6L-22 -12L-14 6L-6 -14L2 6L10 -14L18 6L26 -12L32 6L36 -9" fill="${C.cream}" stroke="${C.ink}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-52 -18l-6 -6M52 -18l6 -6" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></svg>`;
const EARS = `<svg width="110" height="50" viewBox="-55 -25 110 50"><path d="M-46 4Q-36 -14 -12 -10L-16 6Z" fill="${C.cream}" ${st2}/><path d="M46 4Q36 -14 12 -10L16 6Z" fill="${C.cream}" ${st2}/><path d="M-40 14Q0 26 40 14" fill="none" ${st2}/></svg>`;

/** The slice's Verdict facts (key-screens §4.2; plan §2.2 7:05): Togemaru's first Rout in Life 1 — Nose-Touch open
 *  (Grudge 43 < 45, tail still), Recruit "Free", Chase Off always. Life 2 prices (Fair · Feast) come only from a sim offer
 *  (e.g. Kagi, createTown({start: 'test_l2_kagi_rout'}): Fair 96 / Feast 192, Stash 150, Crew 4/6). */
export function verdictFacts(cat, life, town) {
  try {
    const off = town && typeof town.verdictOffer === 'function' ? town.verdictOffer() : null;
    if (off && off.cat === cat.id) {
      const n = off.cards.nose, ch = off.cards.chase, r = off.cards.recruit, LBL = { free: 'Free', fair: 'Fair', feast: 'Feast' };
      return {
        nose: { open: !!n.available, days: n.truce_days || 10, why: n.reason_text, tell: n.tell },
        chase: { open: ch.available !== false, tell: ch.tell },
        recruit: { open: !!r.available || r.reason === 'stash_short', steps: (r.tiers || []).map((x) => ({ id: x.step, label: LBL[x.step] || x.step, price: x.price, tier: x.tier })), stash: r.stash ?? null,
          crew: `${r.crew}/${r.crew_cap || 6}`, why: r.reason_text, tell: r.tell },
        firstEver: !!off.hint, hint: off.hint, strip: off.strip, sim: true,
      };
    }
  } catch (e) { console.warn('nemesis verdict offer unavailable; using the slice seeds', e); }
  // No sim offer: Recruit follows the sim's own recruitable list (NDATA.cats[id].recruitable_slice; Nemesis §3.1 DR-01),
  // never the Life. Life 1 is free for a recruitable non-Boss; without the sim's Stash and price a Life 2 card is greyed.
  // (Review round 1, fix 3: the old Life 2 open-Recruit fallback showed a state the rules forbid.)
  const boss = cat.role === 'boss', row = NDATA.cats[cat.id], recruitable = !!(row && row.recruitable_slice) && cat.role !== 'outsider';
  const free = { open: true, steps: [{ id: 'free', label: 'Free', price: 0, tier: 'Aloof' }], stash: null, crew: '3/6', why: null, tell: 'eyes_lean' };
  const grey = (why, tell) => ({ open: false, steps: [], stash: null, crew: '', why, tell });
  const v = {
    nose: { open: true, days: 10, why: null },
    chase: { open: true },
    recruit: !recruitable ? grey(NDATA.k.verdict.reasons.recruit_not_slice, 'tail_to_bell')
      : boss ? grey(NDATA.k.verdict.reasons.recruit_boss.replace('{name}', cat.name), 'bares_teeth')
        : life <= 1 ? free : grey(NDATA.k.verdict.reasons.recruit_gate, 'bares_teeth'),
    firstEver: life <= 1, hint: NDATA.k.verdict.first_hint,
  };
  if (cat.verdictGate === 'closed') v.nose = { open: false, days: 10, why: 'Tail lashing. Not today.' };
  return v;
}

/** The Recruit tell the bubble shows: always the card's own (review round 1, fix 1). */
export function recruitTell(r, step) {
  const t = r.tell || (r.open ? 'eyes_lean' : 'tail_to_bell');
  if (t === 'tail_to_bell') return { kind: t, glyph: TAILTURN, text: 'Turns its tail to the bell.' };
  if (t === 'bares_teeth') return { kind: t, glyph: TEETH, text: r.why || 'Bares its teeth.' };
  return { kind: 'eyes_lean', glyph: EYES, text: `Eyes on the ${step && step.price ? 'fish' : 'bell'}.` };
}

export class Verdict {
  constructor() {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    this.el = document.createElement('div'); this.el.className = 'vd'; this.el.setAttribute('role', 'dialog'); this.el.setAttribute('aria-label', 'Verdict');
    if (new URLSearchParams(location.search).get('test') === '1') this.el.classList.add('test');
    document.body.appendChild(this.el); this.isOpen = false;
    this.el.addEventListener('mouseup', () => this.release());
  }
  /** o: { cat, life, town, onChoose({kind, step}), raise (test: 'up'|'left'|'right'), step } */
  open(o) {
    this.o = o; this.f = verdictFacts(o.cat, o.life, o.town); this.isOpen = true; this.t = 0; this.t0 = performance.now(); this.test = this.el.classList.contains('test'); this.raised = null; this.hold = 0; this.holding = false; this.armed = false; this.paid = null;
    this.stepI = Math.max(0, this.f.recruit.steps.findIndex((s) => s.id === o.step));
    this.el.classList.add('on'); this.draw();
    if (o.raise) { this.t = 1; this.raise(o.raise); }
  }
  close() { this.isOpen = false; this.el.classList.remove('on'); this.el.innerHTML = ''; }
  get locked() { return this.t < 0.5; }
  available(d) { return d === 'up' ? this.f.nose.open : d === 'left' ? this.f.chase.open : d === 'right' ? this.f.recruit.open && this.canAfford() : false; }
  canAfford() { const s = this.f.recruit.steps[this.stepI]; return !s || this.f.recruit.stash == null || s.price <= this.f.recruit.stash; }
  raise(d) { if (this.locked || this.paid) return; if (d === this.raised) return; this.raised = d; this.armed = false; this.hold = 0; this.draw(); if (this.o.onRaise) this.o.onRaise(d, this.f); }
  stepBribe(n) { if (this.raised !== 'right' || this.paid) return; const L = this.f.recruit.steps.length; this.stepI = Math.max(0, Math.min(L - 1, this.stepI + n)); this.draw(); }
  press() { if (this.locked || !this.raised || this.paid) return; if (!this.available(this.raised)) { this.bump(); return; } if (this.armed) { this.commit(); return; } this.holding = true; this.holdT0 = performance.now(); this.hold = 0; }
  release() { if (this.holding && !this.test) this.hold = (performance.now() - this.holdT0) / 1000; if (this.holding && this.hold >= 0.6 && this.raised && this.available(this.raised)) { this.commit(); return; } if (this.holding && this.hold < 0.6 && this.raised && this.available(this.raised)) { this.armed = true; this.draw(); } this.holding = false; this.hold = 0; }
  bump() { const c = this.el.querySelector('.vd-card.raised'); if (c) { c.style.transform = 'translateX(8px)'; setTimeout(() => { c.style.transform = ''; }, 90); } }
  commit() {
    const kind = { up: 'nose', left: 'chase', right: 'recruit' }[this.raised], step = kind === 'recruit' ? this.f.recruit.steps[this.stepI] : null;
    this.paid = { kind, step, t: 0 }; this.holding = false; this.draw();
  }
  key(code, e) {
    if (!this.isOpen) return false;
    if (e && e.type === 'keyup') { if (code === 'Enter' || code === 'Space') this.release(); return true; }
    if (e && e.repeat) return true;
    const d = { ArrowUp: 'up', KeyW: 'up', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right' }[code];
    if (d) this.raise(d);
    else if (code === 'KeyQ') this.stepBribe(-1); else if (code === 'KeyE') this.stepBribe(1);
    else if (code === 'Enter' || code === 'Space') this.press();
    return true;
  }
  draw() {
    const f = this.f, c = this.o.cat, k = Math.min(innerWidth / 1920, innerHeight / 1080), R = this.raised;
    const card = (d, cls, title, icon, chip, line, extra = '') => { const off = !this.available(d) && !(d === 'right' && f.recruit.open && !this.canAfford());
      return `<div class="vd-card ${cls}${R === d ? ' raised' : ''}${off ? ' off' : ''}" data-d="${d}"><div class="t">${arrow({ up: 0, left: -90, right: 90 }[d])}${icon}${title}${chip ? `<span class="chip">${chip}</span>` : ''}</div><div class="l">${line}</div>${extra}</div>`; };
    const r = f.recruit, s = r.steps[this.stepI];
    // the short note names the raised step if it is short, else the first step the Stash cannot cover (mock 07)
    const short = r.stash == null ? null : (s && s.price > r.stash ? s : r.steps.find((x) => x.price > r.stash)) || null;
    const steps = r.open ? `<div class="vd-steps">${r.steps.map((x, i) => `<div class="vd-step${i === this.stepI ? ' on' : ''}${r.stash != null && x.price > r.stash ? ' short' : ''}" data-i="${i}">${x.label}<b>${x.price ? fish + x.price : ''}</b><small>starts ${x.tier}</small></div>`).join('')}</div>
      <div class="vd-meta"><span>${r.stash != null ? `${fish} Stash ${r.stash}` : ''}</span><span>Crew ${r.crew}</span></div>${short ? `<span class="vd-meta"><span class="warn">Stash short: ${r.stash} of ${short.price}</span></span>` : ''}` : `<div class="why">${r.why || ''}</div>`;
    const chipR = r.open ? (r.steps[0].price ? `${fish}from ${r.steps[0].price}` : 'Free') : '';
    let tell = '';
    if (R === 'up') tell = `<div class="k-bubble k-bubble--notail vd-tell">${TAIL(f.nose.tell ? f.nose.tell === 'tail_lashing' : !f.nose.open)}${(f.nose.tell ? f.nose.tell === 'tail_lashing' : !f.nose.open) ? 'Tail lashing.' : 'Tail still.'}</div>`;
    else if (R === 'right') { const rt = recruitTell(r, s); tell = `<div class="k-bubble k-bubble--notail vd-tell vd-tell--r" data-tell="${rt.kind}">${rt.glyph}${rt.text}</div>`; }
    else if (R === 'left') tell = `<div class="k-bubble k-bubble--notail vd-tell">${EARS}Ears drop. You turn away.</div>`;
    const ring = (fr) => { const a = fr * Math.PI * 2, Rr = 17, x = Math.sin(a) * Rr, y = -Math.cos(a) * Rr; return `<svg width="44" height="44" viewBox="-22 -22 44 44"><circle r="${Rr}" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/>${fr > 0 ? (fr >= 1 ? `<circle r="${Rr}" fill="${C.gold}"/>` : `<path d="M0 0L0 ${-Rr}A${Rr} ${Rr} 0 ${fr > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}Z" fill="${C.gold}"/>`) : ''}<circle r="${Rr}" fill="none" stroke="${C.ink}" stroke-width="3"/></svg>`; };
    const pay = this.paid ? ({ nose: `${RV.leafSprig({ x: 0, y: 0, s: 2.2 }).replace(/^/, '<svg width="80" height="70" viewBox="-10 -60 80 70">') + '</svg>'}Noses touched`, chase: `${RV.stamp(RV.GLYPH.run, { size: 70, color: C.cream })}Gone from town`, recruit: `${RV.stamp(RV.GLYPH.bell, { size: 70, color: C.gold })}Wears the bell now` })[this.paid.kind] : '';
    const ta = this.o.tellAt || { x: 1120, y: 520 }, tx = Math.max(700, Math.min(1180, ta.x)), ty = Math.max(400, Math.min(760, ta.y));
    this.el.innerHTML = `<div class="vd-st" style="transform:scale(${k});--tx:${tx}px;--ty:${ty}px">
      ${card('up', 'up', 'Nose-Touch', ICON.nose, `${f.nose.days} days`, 'Steps down in peace. May side with you against its rival.', f.nose.open ? '' : `<div class="why">${f.nose.why}</div>`)}
      ${card('left', 'left', 'Chase Off', ICON.chase, '', 'Gone from town for good.')}
      ${card('right', 'right', 'Recruit', ICON.recruit, chipR, 'Joins your Crew with everything it remembers.', steps)}
      ${tell}
      <div class="k-bubble k-bubble--notail vd-strip">${f.firstEver ? `${f.hint || NDATA.k.verdict.first_hint} ` : ''}${f.strip || 'Every choice clears the post. Then spray it.'}</div>
      <div class="vd-foot"><span class="k-prompt">${K.ui.faceButtons({ size: 42, lit: 'n' })}Their card</span>
        ${r.open && r.steps.length > 1 && R === 'right' ? `<span class="k-prompt"><span class="k-btn k-key" style="height:44px;min-width:56px;font-size:24px">Q</span><span class="k-btn k-key" style="height:44px;min-width:56px;font-size:24px">E</span>Bribe</span>` : '<span></span>'}
        <span class="k-prompt vd-hold">${K.ui.faceButtons({ size: 42, lit: 's' })}${this.armed ? 'Press again to decide' : 'Hold to decide'}<span class="ring">${ring(this.holding ? Math.min(1, this.hold / 0.6) : this.armed ? 1 : 0)}</span></span></div>
      ${pay ? `<div class="vd-pay">${pay}</div>` : ''}</div>`;
    // a centred tell bubble never runs under the Recruit card (review round 2, fix 3): keep its right edge 24 px clear
    const tb = this.el.querySelector('.vd-tell:not(.vd-tell--r)');
    if (tb) { const rc = this.el.querySelector('.vd-card.right'), w = tb.offsetWidth, lim = (rc ? rc.offsetLeft : 1350) - 24 - w / 2; if (tx > lim) tb.style.left = `${Math.max(540 + w / 2, lim)}px`; }
    this.el.querySelectorAll('.vd-card').forEach((e) => {
      e.onmouseenter = () => this.raise(e.dataset.d);
      e.onmousedown = (ev) => { if (ev.button === 0) { this.raise(e.dataset.d); this.press(); } };
    });
    this.el.querySelectorAll('.vd-step').forEach((e) => { e.onmousedown = (ev) => { ev.stopPropagation(); this.stepI = +e.dataset.i; this.draw(); }; });
    const hb = this.el.querySelector('.vd-hold'); if (hb) { hb.onmousedown = () => this.press(); }
  }
  frame(dt) {
    if (!this.isOpen) return;
    const now = performance.now(), rdt = this.test ? dt : Math.min(0.25, (now - (this.tl || now)) / 1000); this.tl = now;
    this.t += rdt; dt = rdt;
    if (this.holding) { this.hold = this.test ? this.hold + dt : (now - this.holdT0) / 1000; if (this.hold >= 0.6) { this.commit(); return; } const r = this.el.querySelector('.vd-hold .ring'); if (r) this.draw(); }
    if (this.paid) { this.paid.t += dt; if (this.paid.t > 1.8) { const p = this.paid; this.close(); if (this.o.onChoose) this.o.onChoose(p); } }
  }
}

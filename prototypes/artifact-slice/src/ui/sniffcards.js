// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Declaration card and the closing cards (plan §2.2 9:20; Nemesis §3.13; board.json sniff_cards): the Life 2 day 2
// Doorstep Sniff, in canon priority. Branch A: the Declaration ("Sworn Rival": storm mark drawn toward the camera,
// sprig, ear notch). B: "Wears the bell now". C: "Run out of town" (a faded legend card). Then the day's other items:
// "A stranger's scent" (tape star) and "The big wall is seething." (steam puffs). North opens the Rivals board on the
// card's scene, focused on its cat (key-screens §2.1). Display only.
import { Kit } from '../render/vfx/sprites.js';
import '../../../../design/previews/rival-helpers.js';

const K = Kit, C = Kit.C, RV = globalThis.RV;
const CSS = `
.sn { position:fixed; inset:0; z-index:37; font-family:var(--font); color:var(--ink); display:none; background:radial-gradient(ellipse at 50% 45%, rgba(51,39,59,.12), rgba(51,39,59,.55)); }
.sn.on { display:block; }
.sn.test *, .sn.test { animation:none !important; transition:none !important; }
.sn-st { position:absolute; left:50%; top:50%; width:1920px; height:1080px; margin:-540px 0 0 -960px; }
.sn-head { position:absolute; left:50%; top:60px; transform:translateX(-50%); white-space:nowrap; padding:12px 34px; font:800 34px/1 var(--font); }
.sn-main { position:absolute; left:560px; top:170px; width:800px; height:640px; padding:0; overflow:visible; animation:snin .24s steps(4) both; text-align:center; }
@keyframes snin { 0% { transform:translateY(80px) rotate(4deg); opacity:0; } 100% { transform:rotate(-1.5deg); opacity:1; } }
.sn-main { transform:rotate(-1.5deg); }
.sn-main .por { position:relative; margin:46px auto 0; width:300px; height:300px; }
.sn-main .por .storm { position:absolute; right:-70px; top:-50px; }
.sn-main .por .sprig { position:absolute; left:-40px; bottom:16px; }
.sn-main .ti { margin-top:22px; font:400 76px/1 'Dela Gothic One', var(--font); color:var(--ink); letter-spacing:.01em; }
.sn-main .ln { margin-top:14px; font:600 38px/1.2 var(--font); }
.sn-main .tag { position:absolute; left:-18px; top:-24px; transform:rotate(-6deg); }
.sn-main.legend { background:#EFE3C8; border-color:#9C8A72; }
.sn-main.legend .por { filter:sepia(.6) saturate(.6) opacity(.85); }
.sn-main .stampx { position:absolute; left:calc(50% + 175px); top:250px; transform:translateX(-50%) rotate(-12deg); padding:8px 18px; border:6px solid #B04A3A; border-radius:12px; color:#B04A3A; background:rgba(255,246,227,.6); line-height:0; }
.sn-side { position:absolute; width:400px; height:300px; padding:18px 22px; text-align:center; animation:snin .24s steps(4) .1s both; }
.sn-side .ti { font:800 34px/1.1 var(--font); margin-top:8px; }
.sn-side .ln { font:600 26px/1.2 var(--font); margin-top:8px; }
.sn-side.a { left:100px; top:330px; transform:rotate(-4deg); }
.sn-side.b { left:1420px; top:330px; transform:rotate(3deg); }
.sn-foot { position:absolute; right:40px; bottom:34px; display:flex; gap:14px; }
.sn-foot .k-prompt { white-space:nowrap; cursor:pointer; }
`;
// closing C's stamp: the Chase Off glyph (speed lines and a chevron: gone) in the stamp's red, so the headline is not said twice (review round 2, fix 4)
const RUNGLYPH = `<svg width="96" height="64" viewBox="-24 -16 48 32">${RV.GLYPH.run.split(C.ink).join('#B04A3A').replace('stroke-width="2.6"', 'stroke-width="3.4"')}</svg>`;
const tape = `<svg width="60" height="40" viewBox="-30 -20 60 40"><path d="M-28 -14H28V14H-28Z" fill="#F6E7B8" transform="rotate(-8)"/><path d="M0 -12l4 8.8l9.6 1.2l-7 6.8l1.8 9.6l-8.4 -4.6l-8.4 4.6l1.8 -9.6l-7 -6.8l9.6 -1.2z" fill="${C.gold}" stroke="${C.ink}" stroke-width="2"/></svg>`;

export class SniffCards {
  constructor() {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    this.el = document.createElement('div'); this.el.className = 'sn'; this.el.setAttribute('role', 'dialog'); this.el.setAttribute('aria-label', 'Morning Sniff');
    if (new URLSearchParams(location.search).get('test') === '1') this.el.classList.add('test');
    document.body.appendChild(this.el); this.isOpen = false;
  }
  /** o: { branch: 'A'|'B'|'C', onBoard(scene, focus), onClose } */
  open(model, o = {}) {
    this.m = model; this.o = o; this.isOpen = true; this.el.classList.add('on'); this.draw();
  }
  close() { this.isOpen = false; this.el.classList.remove('on'); this.el.innerHTML = ''; if (this.o && this.o.onClose) this.o.onClose(); }
  key(code, type) {
    if (!this.isOpen) return false; if (type === 'keyup') return true;
    if (code === 'KeyN' || code === 'KeyJ') { const f = this.focusOf(); this.close(); if (this.o.onBoard) this.o.onBoard(f.scene, f.id); }
    else if (code === 'Enter' || code === 'Space' || code === 'Escape') this.close();
    return true;
  }
  focusOf() { const t = this.m.cats.togemaru; return { scene: t.state === 'gone' ? 'lane' : t.scene, id: t.state === 'gone' ? null : 'togemaru' }; }
  draw() {
    const m = this.m, t = m.cats.togemaru, b = this.o.branch || m.branch, k = Math.min(innerWidth / 1920, innerHeight / 1080);
    const it = (kind) => (this.o.items || []).find((x) => x.kind === kind) || {};
    const main0 = it('declaration').title ? it('declaration') : it('arc_closing'), chI = it('challenger'), anI = it('anger');
    const por = (cat, size, extra = {}) => K.ui.portrait({ size, ring: cat.clowder === 'bell' || cat.state === 'crew' ? C.gold : C.sage, bg: '#F7C99A', cat: { ...cat.kit, outline: 'ink', scars: ['notch'], ...extra } });
    let main;
    if (b === 'A') main = `<div class="k-panel sn-main"><div class="tag">${RV.stamp(RV.GLYPH.burst, { size: 70, color: C.cream })}</div>
        <div class="por">${por(t, 300, { expr: 'smug' })}<div class="storm">${'<svg width="200" height="170" viewBox="-100 -90 200 170" overflow="visible">' + RV.storm({ x: 0, y: 0, s: 1.5 }) + '</svg>'}</div><div class="sprig">${'<svg width="90" height="80" viewBox="-10 -60 90 80">' + RV.leafSprig({ x: 0, y: 0, s: 2.4 }) + '</svg>'}</div></div>
        <div class="ti">${main0.title || 'Sworn Rival'}</div><div class="ln">${main0.line || `${t.name} has chosen you.`}</div>${main0.best_line ? `<div class="ln" style="font-size:28px;font-weight:500;color:var(--cocoa)">${main0.best_line.day} “${main0.best_line.line}”</div>` : ''}</div>`;
    else if (b === 'B') main = `<div class="k-panel sn-main"><div class="por">${por(t, 300, { expr: 'neutral', collar: 'cord' })}</div>
        <div class="ti">${main0.title || 'Wears the bell now'}</div><div class="ln">${main0.line || 'On the Posse bench.'}</div></div>`;   // subtitle: his own record, never the headline again (review round 1, fix 6)
    else main = `<div class="k-panel sn-main legend"><div class="por">${por(t, 300, { expr: 'angry' })}</div><div class="stampx">${RUNGLYPH}</div>
        <div class="ti">${main0.title || 'Run out of town'}</div><div class="ln">${main0.line || 'Gone from the Lane.'}</div></div>`;
    const ch = m.cats.challenger, df = m.cats.daifuku;
    const side = `<div class="k-panel sn-side a">${tape}<div style="height:110px;display:flex;align-items:center;justify-content:center">${'<svg width="110" height="110" viewBox="-55 -55 110 110"><circle r="50" fill="#4A3657"/><text y="18" text-anchor="middle" font-family="M PLUS Rounded 1c" font-weight="800" font-size="56" fill="#FFF6E3">?</text></svg>'}</div><div class="ti">${chI.title || 'A stranger\u2019s scent'}</div><div class="ln">${chI.line || `A stranger is staking ${ch.stake || 'Laundry Pole Yard'}.`}</div></div>
      <div class="k-panel sn-side b"><div style="height:118px">${'<svg width="240" height="118" viewBox="-120 -80 240 118">' + K.dustCloud({ x: -60, y: -10, r: 26, puffs: 4, seed: 2 }) + K.dustCloud({ x: 0, y: -36, r: 26, puffs: 4, seed: 4 }) + K.dustCloud({ x: 60, y: -14, r: 28, puffs: 4, seed: 7 }) + '</svg>'}</div><div class="ti">${anI.title || 'The big wall is seething.'}</div><div class="ln">${anI.line || 'Angry at your marks in his Lane.'}</div></div>`;
    this.el.innerHTML = `<div class="sn-st" style="transform:scale(${k})"><div class="k-bubble k-bubble--notail sn-head">Life 2 · day 2 · The Doorstep: the Sniff</div>${side}${main}
      <div class="sn-foot"><span class="k-prompt" data-a="n">${K.ui.faceButtons({ size: 42, lit: 'n' })}See the Rivals</span><span class="k-prompt" data-a="s">${K.ui.faceButtons({ size: 42, lit: 's' })}Off to the Lane</span></div></div>`;
    this.el.querySelector('[data-a=n]').onclick = () => this.key('KeyN');
    this.el.querySelector('[data-a=s]').onclick = () => this.key('Enter');
  }
  frame() {}
}

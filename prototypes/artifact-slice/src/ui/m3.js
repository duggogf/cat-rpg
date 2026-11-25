// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// M3 presentation hooks for the Lane (src/entries/main.js): the Rivals board (View / J, Pause > Rivals), the Pause
// menu (Mikan · Rivals · Options, key-screens §2.1), the Standoff on the street (rival blocks the way; memory line;
// memory-tagged lines unskippable for 1 s), the three-card Verdict over the street (after the Togemaru fight), and the
// Declaration / closing Sniff cards. Facts come from the nemesis simulation through the adapter in rivals-model.js.
// Query hooks (evidence): ?board=lane|outsiders|bell&focus=<id>&branch=A|B|C|L1 · ?m3=standoff|verdict|declaration|pause
//   &rival=<id> &card=up|left|right &step=fair|feast
import * as THREE from 'three';
import { RivalsBoard } from './rivalsboard.js';
import { boardModel, nemesisTown } from './rivals-model.js';
import { Standoff } from './standoff.js';
import { Verdict } from './verdict.js';
import { SniffCards } from './sniffcards.js';
import { KIT_CSS } from './combat/kit-assets.js';
import { Kit } from '../render/vfx/sprites.js';
import { PHASES } from '../render/phases.js';

const K = Kit, C = Kit.C;
const PAUSE_CSS = `
.m3p { position:fixed; inset:0; z-index:36; display:none; align-items:center; justify-content:center; background:rgba(51,39,59,.35); font-family:var(--font); color:var(--ink); }
.m3p.on { display:flex; }
.m3p .k-panel { width:760px; transform-origin:50% 50%; }
.m3p .tabs { display:flex; gap:10px; margin:6px 0 22px; }
.m3p .tab { padding:10px 26px; border-radius:24px 22px 25px 21px; font:800 30px/1 var(--font); border:3px solid var(--cocoa); cursor:pointer; color:var(--cocoa); background:var(--cream); }
.m3p .tab.on { background:var(--cocoa); color:var(--cream); }
.m3p .tab.lock { opacity:.5; cursor:default; }
.m3p .bd { font:600 28px/1.35 var(--font); min-height:120px; }
.m3p .ft { display:flex; justify-content:flex-end; gap:12px; margin-top:16px; }
`;

export class M3 {
  constructor(ctx) {
    this.ctx = ctx; const o = ctx.opt;
    this.branch = o.branch === 'L1' ? null : (o.branch || 'A');
    this.board = new RivalsBoard({ renderer: ctx.renderer, tex: ctx.tex, post: ctx.post, model: () => this.model(), saveGlobals: ctx.saveGlobals, restoreGlobals: ctx.restoreGlobals,
      onClose: () => { this.showStreetUI(true); }, phase: 'dusk' });
    this.standoff = new Standoff(); this.verdict = new Verdict(); this.sniff = new SniffCards();
    if (!document.getElementById('kit-css')) { const st = document.createElement('style'); st.id = 'kit-css'; st.textContent = KIT_CSS; document.head.appendChild(st); }
    const st = document.createElement('style'); st.textContent = PAUSE_CSS; document.head.appendChild(st);
    this.pause = document.createElement('div'); this.pause.className = 'm3p'; document.body.appendChild(this.pause);
    this.pauseTab = 'mikan';
  }
  model() { return boardModel({ branch: this.branch, life: this.branch ? 2 : 1, newIds: this.branch ? ['sasa'] : [] }); }
  modal() { return this.board.isOpen || this.pause.classList.contains('on') || this.verdict.isOpen || this.sniff.isOpen || this.standoff.isOpen; }
  /** A low side two-shot for the Standoff and the Verdict (key-screens §4.4 "camera low two-shot"): Mikan left, the
   *  rival right, both in the centre band the cards leave free. The street clock is paused while it holds. */
  twoShot(lowK = 0) {
    const ctx = this.ctx, m = ctx.mikanPos, r = this.rival3d && this.rival3d.object3D.position; if (!r) return;
    const mid = m.clone().lerp(r, 0.5), side = new THREE.Vector3(1, 0, 0);
    if (ctx.mikan) { ctx.mikan.object3D.rotation.y = Math.atan2(r.x - m.x, r.z - m.z); ctx.mikan.setGait('idle', 0); }
    const cam = ctx.cam; cam.clearViewOffset(); cam.fov = 40; cam.updateProjectionMatrix();
    cam.position.copy(mid).addScaledVector(side, 1.55).add(new THREE.Vector3(0, 0.55 - 0.15 * lowK, 1.75));
    cam.lookAt(mid.x - 0.1, mid.y + 0.32, mid.z - 0.15); cam.updateMatrixWorld();
  }
  rivalTell() { const p = this.rival3d && this.ctx.project(this.rival3d.object3D.position.clone().add(new THREE.Vector3(0, 0.75, 0))); if (!p) return null; const k = Math.min(innerWidth / 1920, innerHeight / 1080); return { x: 960 + (p.x - innerWidth / 2) / k, y: 540 + (p.y - innerHeight / 2) / k }; }
  showStreetUI(on) { if (this.ctx.hud) this.ctx.hud.el.style.visibility = on ? '' : 'hidden'; document.querySelectorAll('nav[aria-label=Chapters]').forEach((e) => { e.style.visibility = on ? '' : 'hidden'; }); }
  openBoard(o = {}) { this.closePause(); this.showStreetUI(false); return this.board.open(o); }
  /** Evidence and first-open hooks from the query string. */
  boot() {
    const o = this.ctx.opt;
    if (o.board) this.openBoard({ scene: o.board, focus: o.focus || null });
    else if (o.m3 === 'pause') this.openPause('rivals');
    else if (o.m3 === 'standoff') this.startStandoff(o.focus || 'togemaru');
    else if (o.m3 === 'verdict') this.openVerdict(o.focus || 'togemaru');
    else if (o.m3 === 'declaration') this.openSniff();
    if (o.test) { if (!this.board.isOpen) this.ctx.renderStreet(); this.frame(0); }
  }
  /** Keyboard: returns true when an M3 screen consumed the key. */
  key(e) {
    const c = e.code;
    if (this.sniff.isOpen) return this.sniff.key(c, e.type);
    if (this.verdict.isOpen) return this.verdict.key(c, e);
    if (this.board.isOpen) { if (!e.repeat) this.board.key(c); return true; }
    if (this.pause.classList.contains('on')) { if (c === 'Escape') this.closePause(); else if (c === 'KeyQ') this.tabStep(-1); else if (c === 'KeyE') this.tabStep(1); else if ((c === 'Enter' || c === 'Space') && this.pauseTab === 'rivals' && this.branch) this.openBoard(); return true; }
    if (this.standoff.isOpen) return this.standoff.key(c);
    if (e.repeat) return false;
    if (c === 'KeyT' && !this.ctx.opt.test) { this.startStandoff('togemaru'); return true; }
    if (c === 'KeyJ') { if (this.branch) this.openBoard(); else this.ctx.hud && this.ctx.hud.hint('Rivals open in Life 2.', 2); return true; }
    if (c === 'Escape') { this.openPause('mikan'); return true; }
    return false;
  }
  /* ------------------------------------------------------------------ Pause: Mikan · Rivals · Options */
  openPause(tab) { this.pauseTab = tab || 'mikan'; this.showStreetUI(false); this.pause.classList.add('on'); this.drawPause(); }
  closePause() { if (!this.pause.classList.contains('on')) return; this.pause.classList.remove('on'); if (!this.board.isOpen) this.showStreetUI(true); }
  tabStep(d) { const t = ['mikan', 'rivals', 'options'], i = t.indexOf(this.pauseTab); this.pauseTab = t[(i + d + 3) % 3]; this.drawPause(); }
  drawPause() {
    const k = Math.min(innerWidth / 1920, innerHeight / 1080), locked = !this.branch;
    const body = { mikan: 'Mikan · Scrapper · Known Face<br>Crew: Hige, Pon, Kinako' + (this.branch === 'B' ? ', Togemaru' : ''),
      rivals: locked ? `${K.ui.icon({ name: 'brick', size: 40 })} The Rivals board opens in Life 2.` : 'Every cat in town you have met, one gang at a time.<br><b>Enter</b> to open the board (or press <b>J</b> on the street).',
      options: 'Reduce Flashes · Reduce Motion · Shake · Sound words' }[this.pauseTab];
    this.pause.innerHTML = `<div class="k-panel" style="transform:scale(${Math.max(0.5, k)})"><span class="k-h">Paused</span>
      <div class="tabs">${['mikan', 'rivals', 'options'].map((t) => `<span class="tab${t === this.pauseTab ? ' on' : ''}${t === 'rivals' && locked ? ' lock' : ''}" data-t="${t}">${{ mikan: 'Mikan', rivals: 'Rivals', options: 'Options' }[t]}</span>`).join('')}</div>
      <div class="bd">${body}</div>
      <div class="ft">${this.pauseTab === 'rivals' && !locked ? `<span class="k-prompt" data-a="open">${K.ui.faceButtons({ size: 42, lit: 's' })}Open</span>` : ''}<span class="k-prompt" data-a="back">${K.ui.faceButtons({ size: 42, lit: 'e' })}Back</span></div></div>`;
    this.pause.querySelectorAll('[data-t]').forEach((e) => { e.onclick = () => { this.pauseTab = e.dataset.t; this.drawPause(); }; });
    this.pause.querySelectorAll('[data-a]').forEach((e) => { e.onclick = () => (e.dataset.a === 'open' ? this.openBoard() : this.closePause()); });
  }
  /* ------------------------------------------------------------------ Standoff on the street */
  startStandoff(id) {
    const town = nemesisTown();
    const m = this.model(), c = m.cats[id];
    const line = this.standoff.lineFor(town, id, this.branch, this.ctx.opt.day ? +this.ctx.opt.day : 2);
    this.stageRival(id); this.showStreetUI(false); this.twoShot(0);
    this.standoff.open({ cat: c, line, onFight: () => this.openVerdict(id), onDone: () => {} });
  }
  /** The rival steps into the lane ahead of Mikan and blocks the way (a live cat; idle, looking at her). */
  stageRival(id) {
    const ctx = this.ctx, m = this.model(), c = m.cats[id];
    if (!this.rival3d) {
      try { this.rival3d = ctx.createCat({ ...(c.cast.opts || {}), cast: c.cast.cast, scale: 1.25 * (c.cast.extra || 1) }); } catch (e) { console.warn('standoff rival skipped', e); return; }
      ctx.lateScene.add(this.rival3d.object3D); ctx.catRoots.add(this.rival3d.object3D);
      const p = PHASES[ctx.phase] || PHASES.day;
      this.rival3d.setLighting({ keyDir: new THREE.Vector3(...p.catDir).normalize(), keyColor: new THREE.Color(p.catKey), shadeColor: new THREE.Color(p.shadow ? p.catShade : p.catShade), rimColor: new THREE.Color(p.catRim) });
    }
    Standoff.stage(ctx, this.rival3d, 2.1);
  }
  keyUp(e) { if (this.verdict.isOpen) return this.verdict.key(e.code, e); return false; }
  openVerdict(id) {
    const m = this.model(), c = m.cats[id];
    if (!this.rival3d) this.stageRival(id);
    this.showStreetUI(false); this.twoShot(1); this.ctx.renderStreet();
    this.verdict.open({ cat: c, life: this.branch ? 2 : 1, town: nemesisTown(), raise: this.ctx.opt.test ? new URLSearchParams(location.search).get('card') : null, step: new URLSearchParams(location.search).get('step'),
      tellAt: this.rivalTell(),
      onChoose: (v) => {
        this.lastVerdict = v; this.branch = { nose: 'A', recruit: 'B', chase: 'C' }[v.kind] || this.branch;
        const town = nemesisTown(); try { if (town && town.applyVerdict) town.applyVerdict(id, v.kind, v.step && v.step.id); } catch (e) { console.warn('nemesis verdict not applied', e); }
        if (this.rival3d) this.rival3d.object3D.visible = false;
        this.openSniff(); } });
  }
  openSniff() {
    this.showStreetUI(false);
    this.sniff.open(this.model(), { branch: this.branch, onBoard: (scene, focus) => this.openBoard({ scene, focus }), onClose: () => { if (!this.board.isOpen) this.showStreetUI(true); } });
  }
  frame(dt) {
    if (this.board.isOpen) this.board.frame(dt);
    else if (this.verdict.isOpen || this.sniff.isOpen || this.standoff.isOpen) { if (this.rival3d && this.rival3d.object3D.visible) { this.rival3d.update(dt); if (this.ctx.mikan) this.ctx.mikan.update(dt); } this.ctx.renderStreet(); }
    this.standoff.frame(dt, this.ctx); this.verdict.frame(dt); this.sniff.frame(dt);
  }
}

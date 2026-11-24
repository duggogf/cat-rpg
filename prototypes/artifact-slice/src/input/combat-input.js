// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat action map (Combat §3.1 / HUD §8, DR-08), desktop only: keyboard + mouse and a standard-mapping
// gamepad. Presses are latched between sim ticks (a press is "pressed this tick" for exactly one step()),
// holds are sampled. Camera-relative move -> world ground vector. Inside Slow Blink the same devices
// drive the command menu (stick/WS = cursor, L1/R1 or Q/E = cat, South/Space/Enter = confirm,
// East/Esc/Backspace = back, R2/Tab = close).
//   KB/M: WASD move · LMB attack · Space hop · Shift skitter · RMB brace (hold; toggle option) ·
//         F hiss / Pile-On · Tab Slow Blink · 1-4 shortcut Moves · Z X C V switch · wheel / MMB next lock ·
//         mouse drag (or pointer lock, double-click) orbits · P pause
//   Pad:  LS move · RS orbit (flick = next lock) · West attack · South hop · East skitter · R1 brace ·
//         North hiss · R2 Slow Blink · L1 + W/N/E/S Moves 1-4 · D-pad Up/Left/Down/Right switch · R3 lock

const KEYMAP = {
  KeyF: 'hiss', Space: 'hop', ShiftLeft: 'skitter', ShiftRight: 'skitter', Tab: 'slowBlink',
  Digit1: 'm0', Digit2: 'm1', Digit3: 'm2', Digit4: 'm3', KeyZ: 's0', KeyX: 's1', KeyC: 's2', KeyV: 's3',
};

export class CombatInput {
  constructor(el, { braceToggle = false } = {}) {
    this.el = el; this.braceToggle = braceToggle;
    this.keys = new Set(); this.latched = new Set(); this.menu = [];
    this.mouse = { l: false, r: false, dragging: false, dx: 0, dy: 0, lastMove: -1e9 };
    this.braceOn = false; this.padPrev = []; this.padLook = [0, 0]; this.flickArmed = true;
    this.slowBlinkOpen = false; this.lastInputT = -1e9; this.now = 0; this.enabled = true;
    this.lastDevice = 'kbm';
  }

  bind() {
    const el = this.el;
    el.addEventListener('mousedown', (e) => {
      if (e.button === 0) { this.press('attack'); this.mouse.l = true; }
      if (e.button === 2) { this.mouse.r = true; if (this.braceToggle) this.braceOn = !this.braceOn; }
      if (e.button === 1) { this.press('lockNext'); e.preventDefault(); }
      this.mouse.dragging = true; this.lastDevice = 'kbm';
    });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.mouse.l = false; if (e.button === 2) this.mouse.r = false; this.mouse.dragging = false; });
    addEventListener('mousemove', (e) => {
      const locked = document.pointerLockElement === el;
      if (!(locked || (this.mouse.dragging && (e.buttons & 4 || e.buttons & 1 || e.buttons & 2)))) return;
      this.mouse.dx += e.movementX; this.mouse.dy += e.movementY; this.lastInputT = this.now;
    });
    el.addEventListener('dblclick', () => { if (document.pointerLockElement === el) document.exitPointerLock(); else el.requestPointerLock && el.requestPointerLock(); });
    el.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > 2) this.press('lockNext'); e.preventDefault(); }, { passive: false });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    addEventListener('keydown', (e) => {
      if (e.repeat) { if (e.code === 'Tab') e.preventDefault(); return; }
      this.keys.add(e.code); this.lastDevice = 'kbm';
      if (e.code === 'Tab' || e.code === 'Space') e.preventDefault();
      if (this.slowBlinkOpen) {
        const m = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
          KeyQ: 'prevCat', KeyE: 'nextCat', Space: 'confirm', Enter: 'confirm', KeyF: 'confirm', Escape: 'back', Backspace: 'back', Tab: 'close' }[e.code];
        if (m) { this.menu.push(m); return; }
      }
      if (e.code === 'KeyP' || e.code === 'Escape') { this.menu.push('pause'); return; }
      const a = KEYMAP[e.code]; if (a) this.press(a);
      if (e.code === 'KeyR' && this.braceToggle) this.braceOn = !this.braceOn;
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; });
  }

  press(a) { this.latched.add(a); this.lastInputT = this.now; }

  /** Poll the gamepad once per rendered frame (edges become latched presses). */
  pollPad() {
    const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
    const p = Array.from(pads).find((x) => x && x.connected);
    if (!p) return null;
    const b = p.buttons.map((x) => x.pressed), prev = this.padPrev, edge = (i) => b[i] && !prev[i];
    this.padPrev = b;
    const ax = p.axes, dz = (v) => (Math.abs(v) < 0.18 ? 0 : v);
    const any = b.some(Boolean) || ax.some((v) => Math.abs(v) > 0.3);
    if (any) this.lastDevice = 'pad';
    const L1 = b[4];
    if (this.slowBlinkOpen) {
      if (edge(12) || (dz(ax[1]) < -0.6 && this._stickEdge(-1))) this.menu.push('up');
      if (edge(13) || (dz(ax[1]) > 0.6 && this._stickEdge(1))) this.menu.push('down');
      if (Math.abs(ax[1]) < 0.3) this.stickHeld = 0;
      if (edge(14)) this.menu.push('left'); if (edge(15)) this.menu.push('right');
      if (edge(4)) this.menu.push('prevCat'); if (edge(5)) this.menu.push('nextCat');
      if (edge(0)) this.menu.push('confirm'); if (edge(1)) this.menu.push('back'); if (edge(7)) this.menu.push('close');
    } else {
      if (L1) { if (edge(2)) this.press('m0'); if (edge(3)) this.press('m1'); if (edge(1)) this.press('m2'); if (edge(0)) this.press('m3'); }
      else { if (edge(2)) this.press('attack'); if (edge(0)) this.press('hop'); if (edge(1)) this.press('skitter'); if (edge(3)) this.press('hiss'); }
      if (edge(7)) this.press('slowBlink');
      if (edge(12)) this.press('s0'); if (edge(14)) this.press('s1'); if (edge(13)) this.press('s2'); if (edge(15)) this.press('s3');
      if (edge(11)) this.press('lockNext');
      if (edge(9)) this.menu.push('pause');
    }
    // right stick: orbit; a hard flick (> 0.9) picks the next target once
    const rx = dz(ax[2] || 0), ry = dz(ax[3] || 0);
    this.padLook = [rx, ry];
    if (Math.hypot(rx, ry) > 0.92 && this.flickArmed && b[10] === false && Math.abs(rx) > 0.9) { this.flickArmed = false; }
    if (Math.hypot(rx, ry) < 0.3) this.flickArmed = true;
    if (rx || ry) this.lastInputT = this.now;
    return { lx: dz(ax[0]), ly: dz(ax[1]), brace: b[5] };
  }
  _stickEdge() { if (this.stickHeld) return false; this.stickHeld = 1; return true; }

  /** Camera orbit delta for this frame (degrees), from mouse and right stick. */
  takeLook(dt) {
    const d = [-this.mouse.dx * 0.22 - this.padLook[0] * 150 * dt, this.mouse.dy * 0.15 + this.padLook[1] * 90 * dt];
    this.mouse.dx = this.mouse.dy = 0;
    return d;
  }

  /** Slow Blink menu events since the last call. */
  takeMenu() { const m = this.menu; this.menu = []; return m; }

  /**
   * Build one sim InputFrame and consume the latched presses.
   * @param {number} yawDeg camera yaw (OrbitRig convention: camera sits at +dir(yaw) from its pivot)
   */
  frame(yawDeg, pad) {
    if (!this.enabled) { this.latched.clear(); return {}; }
    const k = this.keys;
    let f = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    let r = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    if (pad && (pad.lx || pad.ly)) { r = pad.lx; f = -pad.ly; }
    const out = {};
    if (f || r) {
      const y = yawDeg * Math.PI / 180, fw = [-Math.sin(y), -Math.cos(y)], rt = [Math.cos(y), -Math.sin(y)];
      let mx = fw[0] * f + rt[0] * r, mz = fw[1] * f + rt[1] * r; const l = Math.hypot(mx, mz);
      if (l > 1) { mx /= l; mz /= l; }
      out.move = [mx, mz];
    }
    const L = this.latched;
    if (L.has('attack')) out.attack = true;
    if (L.has('hop')) out.hop = true;
    if (L.has('skitter')) out.skitter = true;
    if (L.has('hiss')) out.hiss = true;
    if (L.has('slowBlink')) out.slowBlink = true;
    if (L.has('lockNext')) out.lockNext = true;
    for (let i = 0; i < 4; i++) { if (L.has('m' + i)) out.moveSlot = i; if (L.has('s' + i)) out.switchTo = i; }
    out.brace = this.braceToggle ? this.braceOn : (this.mouse.r || (pad && pad.brace));
    L.clear();
    return out;
  }
}

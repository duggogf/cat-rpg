// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat action map, M1.1 (owner direction 2026-11-24, design/reviews/owner-feedback/combat-m1.1-spec.md §1).
// The player controls MIKAN ONLY (no switching, no Tag-In). Desktop: keyboard + mouse, gamepad mirrors it.
//   KB+M (M1.2): WASD move · mouse = free third-person camera (click captures the pointer; drag also works) ·
//         LMB light · RMB heavy (hold to charge) · Space evade (cancels anything; cooldown) · Tab lock / unlock
//         (a horizontal mouse flick while locked picks the next enemy on that side) ·
//         F Special (prompt, only on a staggered enemy) · R skill bar (time slows) · Esc / P pause
//   Pad:  LS move · RS camera (flick while locked) · West light · North heavy (hold) · East evade · R3 lock / unlock ·
//         South Special · R2 skill bar · Menu pause
// Inside the skill bar: W/S (stick) rows · Q/E (L1/R1) cat · Space/Enter/LMB (South) confirm ·
//   Esc/Backspace (East) back · R (R2) close.
// Presses are latched and handed out ONCE, on the next sim tick (a press is never repeated, never queued
// here: the sim's one-slot buffer decides whether it counts). The InputFrame carries the M1.1 semantic fields
// (light, heavy, heavyHeld, dodge, dash, special, skillBar) and the presentation's adapter maps them onto
// whatever the sim's API accepts (src/entries/combat.js `toSim`).

export class CombatInput {
  constructor(el) {
    this.el = el;
    this.keys = new Set(); this.latched = new Set(); this.menu = [];
    this.mouse = { l: false, r: false, dragging: false, dx: 0, dy: 0 };
    this.padPrev = []; this.padLook = [0, 0];
    this.skillBarOpen = false; this.lastInputT = -1e9; this.now = 0; this.enabled = true;
    this.lastDevice = 'kbm'; this.pressLog = [];   // [realT, action] for the latency capture
    this.heavyDown = false;
  }

  bind() {
    const el = this.el;
    el.addEventListener('mousedown', (e) => {
      this.lastDevice = 'kbm';
      if (this.skillBarOpen) { if (e.button === 0) this.menu.push('confirm'); if (e.button === 2) this.menu.push('back'); return; }
      if (e.button === 0) { this.press('light'); this.mouse.l = true; }
      if (e.button === 2) { this.press('heavy'); this.mouse.r = true; }
      if (e.button === 1) e.preventDefault();
      this.mouse.dragging = true;
      if (document.pointerLockElement !== el && el.requestPointerLock) { try { el.requestPointerLock(); } catch (err) { /* drag still orbits */ } }
    });
    addEventListener('mouseup', (e) => { if (e.button === 0) this.mouse.l = false; if (e.button === 2) this.mouse.r = false; this.mouse.dragging = false; });
    addEventListener('mousemove', (e) => {
      if (!(document.pointerLockElement === el || this.mouse.dragging)) return;
      this.mouse.dx += e.movementX; this.mouse.dy += e.movementY; this.lastInputT = this.now;
    });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    addEventListener('keydown', (e) => {
      if (['Tab', 'Space'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code); this.lastDevice = 'kbm';
      if (this.skillBarOpen) {
        const m = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
          KeyQ: 'prevCat', KeyE: 'nextCat', Space: 'confirm', Enter: 'confirm', Escape: 'back', Backspace: 'back', KeyR: 'close' }[e.code];
        if (m) { this.menu.push(m); return; }
      }
      if (e.code === 'KeyP' || e.code === 'Escape') { this.menu.push('pause'); return; }
      const a = { Space: 'evade', Tab: 'lock', KeyF: 'special', KeyR: 'skillBar', KeyJ: 'light', KeyK: 'heavy' }[e.code];   // M1.2: Space = Evade; Shift unused in combat
      if (a) this.press(a);
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; });
  }

  press(a) { this.latched.add(a); this.lastInputT = this.now; this.pressLog.push([this.now, a]); if (this.pressLog.length > 64) this.pressLog.shift(); }

  /** Poll the gamepad once per rendered frame (edges become latched presses). */
  pollPad() {
    const pads = (navigator.getGamepads && navigator.getGamepads()) || [];
    const p = Array.from(pads).find((x) => x && x.connected);
    if (!p) return null;
    const b = p.buttons.map((x) => x.pressed), prev = this.padPrev, edge = (i) => b[i] && !prev[i];
    this.padPrev = b;
    const ax = p.axes, dz = (v) => (Math.abs(v) < 0.18 ? 0 : v);
    if (b.some(Boolean) || ax.some((v) => Math.abs(v) > 0.3)) this.lastDevice = 'pad';
    if (this.skillBarOpen) {
      if (edge(12) || (dz(ax[1]) < -0.6 && !this.stickHeld)) { this.menu.push('up'); this.stickHeld = 1; }
      if (edge(13) || (dz(ax[1]) > 0.6 && !this.stickHeld)) { this.menu.push('down'); this.stickHeld = 1; }
      if (Math.abs(ax[1]) < 0.3) this.stickHeld = 0;
      if (edge(14)) this.menu.push('left'); if (edge(15)) this.menu.push('right');
      if (edge(4)) this.menu.push('prevCat'); if (edge(5)) this.menu.push('nextCat');
      if (edge(0)) this.menu.push('confirm'); if (edge(1)) this.menu.push('back'); if (edge(7)) this.menu.push('close');
    } else {
      if (edge(2)) this.press('light'); if (edge(3)) this.press('heavy'); if (edge(1)) this.press('evade');
      if (edge(0)) this.press('special'); if (edge(7)) this.press('skillBar'); if (edge(11)) this.press('lock'); if (edge(9)) this.menu.push('pause');
    }
    this.padLook = [dz(ax[2] || 0), dz(ax[3] || 0)];
    if (this.padLook[0] || this.padLook[1]) this.lastInputT = this.now;
    return { lx: dz(ax[0]), ly: dz(ax[1]), heavy: b[3] };
  }

  /** Camera orbit delta for this frame (degrees), from mouse and right stick. */
  takeLook(dt) {
    const d = [-this.mouse.dx * 0.18 - this.padLook[0] * 150 * dt, this.mouse.dy * 0.12 + this.padLook[1] * 90 * dt];
    this.mouse.dx = this.mouse.dy = 0;
    return d;
  }
  takeMenu() { const m = this.menu; this.menu = []; return m; }

  /** One semantic InputFrame; consumes the latched presses. yawDeg: camera yaw (camera sits at +dir(yaw)). */
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
    for (const a of this.latched) out[a] = true;
    out.heavyHeld = this.mouse.r || !!(pad && pad.heavy) || k.has('KeyK');
    this.latched.clear();
    return out;
  }
}

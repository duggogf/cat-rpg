// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat camera (camera-system.md §3.5–§3.7, §4.2, §4.4, §4.5; plan §4.5).
//  - Combat: framing point P = lerp(C, T, 0.35); frame width W = clamp(1.4|C-T| + 3, 8.8, 10.6) m;
//    D = W / (2 tan(hFOV/2)) with the aspect capped at 16:9, clamped 4.5–7.2 m; pitch +25° (up to +40°
//    when one of the pair is on a High Road); vFOV 45°. Soft lock: yaw re-aims (≤ 120°/s) only when the
//    target leaves the central 60% of width or the cat leaves the safe frame; free orbit, soft lock pulls
//    back after 1.0 s without camera input. Pivot follows with smootherstep blends (§4.4).
//  - Switch / Tag-In: 0.3 s retarget blend that keeps yaw; during a Relay distance holds at the larger
//    of current and solved.  - Slow Blink: 8.5 m, +50° over the controlled cat, 0.2 s blends.
//  - Standoff: a push-in toward the opponents.  - Pile-On: wide +40° over the cloud.
//  - Overlays: stepped shake from Combat's tier table via sampleShake (screen-space translation, no
//    roll, no FOV change, held ≥ 2 frames, 1.8% clamp), punch-in dolly (in over the hit-stop, out over
//    150 ms, never stacks, skipped if it would push the controlled cat out of the safe frame).
//    The camera runs on unscaled (real) time; during global hit-stop the pivot is frozen.
import * as THREE from 'three';
import { sampleShake } from '../sim/combat/index.js';

const D2R = Math.PI / 180;
const ss = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
const hl = (dt, h) => 1 - Math.pow(2, -dt / h);
const wrap = (a) => ((a + 540) % 360) - 180;
// fixed unit-vector pattern for stepped shake (deterministic; camera-system §4.5)
const PATTERN = [[0.2, 1], [-0.35, -0.94], [0.8, 0.6], [-0.9, 0.42], [0.55, -0.83], [-0.15, 0.99], [0.98, -0.2], [-0.7, -0.71]];

export const COMBAT_CAM = { fov: 45, pitch: 25, pitchHigh: 40, k: 1.4, m: 3.0, wMin: 8.8, wMax: 10.6, dMin: 4.5, dMax: 7.2,
  sbDist: 8.5, sbPitch: 50, sbBlend: 0.2, tagBlend: 0.3, enterBlend: 0.6, yawRate: 120, softLockDelay: 1.0, punchOut: 0.15, shakeClamp: 1.8 };

export class CombatCamera {
  constructor(cam) {
    this.cam = cam; cam.fov = COMBAT_CAM.fov;
    this.pose = { px: 0, py: 0.5, pz: 0, yaw: 0, pitch: 34, dist: 9 };
    this.from = null; this.blendT = 0; this.blendDur = 0;
    this.shakes = []; this.shakeDir = [0, 1]; this.punch = null; this.holdUntil = -1;
    this.lastUserT = -99; this.userYaw = 0; this.state = 'combat'; this.relayHold = 0;
    this.solved = { ...this.pose };
    this.tmp = new THREE.Vector3();
  }
  /** Start a blend from the current pose (Tag-In 0.3 s, Slow Blink 0.2 s, entry 0.6 s). */
  blend(dur) { this.from = { ...this.pose }; this.blendT = 0; this.blendDur = dur; }
  /** Feel overlays. pattern = feel.shake; t = real seconds when it should start. */
  addShake(sh, t, dir) { if (!sh) return; this.shakes.push({ ...sh, start: t }); if (dir) this.shakeDir = dir; }
  addPunch(pt, pct, t, holdS) { if (this.punch && t < this.punch.end) return; if (!pct) return; this.punch = { pt: pt.clone(), k: Math.min(0.15, pct / 100), t0: t, tin: Math.max(0.05, holdS), end: t + Math.max(0.05, holdS) + COMBAT_CAM.punchOut }; }
  hold(untilT) { this.holdUntil = Math.max(this.holdUntil, untilT); }
  userOrbit(dYaw, dPitch, t) { if (!dYaw && !dPitch) return; this.userYaw += dYaw; this.lastUserT = t; }

  /** Solve the state's target pose. ctx: {C, T (Vector3|null), mode, slowBlink, highRoad, enemiesCentroid, aspect, pileCenter, standoffFocus} */
  solve(ctx, dt, t) {
    const c = COMBAT_CAM, s = this.solved;
    if (ctx.mode === 'pileon' && ctx.pileCenter) {
      s.px = ctx.pileCenter.x; s.py = 0.5; s.pz = ctx.pileCenter.z; s.pitch = 40; s.dist = 6.4; return s;
    }
    if (ctx.mode === 'standoff' && ctx.standoffFocus) {
      // push-in: from wide over the Posse toward the opponents over the standoff (≈ 3 s)
      const k = ss(ctx.standoffK);
      const P = ctx.C.clone().lerp(ctx.standoffFocus, 0.35 + 0.4 * k);
      s.px = P.x; s.py = 0.45 + 0.2 * k; s.pz = P.z; s.pitch = 22 - 8 * k; s.dist = 7.2 - 3.4 * k;
      const want = Math.atan2(ctx.C.x - ctx.standoffFocus.x, ctx.C.z - ctx.standoffFocus.z) / D2R;
      s.yaw = want; return s;
    }
    if (ctx.slowBlink) {
      s.px = ctx.C.x; s.py = ctx.C.y + 0.3; s.pz = ctx.C.z; s.pitch = c.sbPitch; s.dist = c.sbDist; return s;
    }
    const C = ctx.C, T = ctx.T || ctx.enemiesCentroid || C;
    const P = C.clone().lerp(T, 0.35);
    const sep = Math.hypot(C.x - T.x, C.z - T.z);
    const W = THREE.MathUtils.clamp(c.k * sep + c.m, c.wMin, c.wMax);
    const aspect = Math.min(16 / 9, ctx.aspect);
    const hf = 2 * Math.atan(Math.tan(c.fov * D2R / 2) * aspect);
    let D = THREE.MathUtils.clamp(W / (2 * Math.tan(hf / 2)), c.dMin, c.dMax);
    if (this.relayHold > t) D = Math.max(D, this.pose.dist);
    s.px = P.x; s.pz = P.z; s.py = Math.max(C.y, T.y) * 0.5 + 0.35;
    s.pitch = ctx.highRoad ? c.pitchHigh : c.pitch; s.dist = D;
    // soft lock: re-aim yaw only when needed; free orbit wins for 1 s after input
    const ideal = Math.atan2(C.x - T.x, C.z - T.z) / D2R;   // camera behind C, looking past it at T
    if (t - this.lastUserT < c.softLockDelay) { s.yaw = this.pose.yaw + this.userYaw; this.userYaw = 0; }
    else {
      this.userYaw = 0;
      const need = ctx.offFrame || sep < 0.2 ? 1 : 0;
      const diff = wrap(ideal - s.yaw);
      const rate = need ? c.yawRate : (Math.abs(diff) > 70 ? 40 : 12);   // gentle drift toward the over-shoulder line
      s.yaw += Math.sign(diff) * Math.min(Math.abs(diff), rate * dt);
    }
    return s;
  }

  update(dtReal, t, ctx) {
    const frozen = t < this.holdUntil || ctx.globalStop;
    if (!frozen) this.solve(ctx, dtReal, t);
    const s = this.solved, p = this.pose;
    if (!frozen) {
      if (this.from) {
        this.blendT += dtReal; const k = ss(this.blendT / this.blendDur), f = this.from;
        p.px = f.px + (s.px - f.px) * k; p.py = f.py + (s.py - f.py) * k; p.pz = f.pz + (s.pz - f.pz) * k;
        p.yaw = f.yaw + wrap(s.yaw - f.yaw) * k; p.pitch = f.pitch + (s.pitch - f.pitch) * k; p.dist = f.dist + (s.dist - f.dist) * k;
        if (this.blendT >= this.blendDur) this.from = null;
      } else {
        const a = hl(dtReal, 0.12), b = hl(dtReal, 0.25);
        p.px += (s.px - p.px) * a; p.py += (s.py - p.py) * a; p.pz += (s.pz - p.pz) * a;
        p.yaw += wrap(s.yaw - p.yaw) * b; p.pitch += (s.pitch - p.pitch) * b; p.dist += (s.dist - p.dist) * b;
      }
    }
    // place
    const cam = this.cam, y = p.yaw * D2R, pi = p.pitch * D2R;
    const dir = new THREE.Vector3(Math.sin(y) * Math.cos(pi), Math.sin(pi), Math.cos(y) * Math.cos(pi));
    const pivot = new THREE.Vector3(p.px, p.py, p.pz);
    let dist = p.dist;
    // punch-in: dolly toward the impact point by a share of distance
    if (this.punch) {
      const q = this.punch, u = t - q.t0;
      const k = u < q.tin ? ss(u / q.tin) : 1 - ss((u - q.tin) / COMBAT_CAM.punchOut);
      if (u > q.tin + COMBAT_CAM.punchOut) this.punch = null;
      else { dist *= 1 - q.k * Math.max(0, k); pivot.lerp(q.pt, 0.25 * Math.max(0, k)); }
    }
    cam.position.copy(pivot).addScaledVector(dir, dist);
    cam.up.set(0, 1, 0); cam.lookAt(pivot);
    // stepped shake (screen-space translation, % of viewport height at the pivot distance)
    this.shakes = this.shakes.filter((sh) => t - sh.start < sh.steps * sh.step_ms / 1000 + 0.05);
    let amt = 0, step = 0;
    if (!(t < this.holdUntil) && this.shakes.length) {
      amt = sampleShake(this.shakes, t, COMBAT_CAM.shakeClamp);
      const last = this.shakes[this.shakes.length - 1]; step = Math.max(0, Math.floor((t - last.start) / (last.step_ms / 1000)));
    }
    this.shakeNow = amt;
    if (amt) {
      const hWorld = 2 * dist * Math.tan(cam.fov * D2R / 2);
      const pat = PATTERN[step % PATTERN.length], d = this.shakeDir;
      // bias the pattern along the hit direction (screen space), mostly vertical-ish jolts
      const ux = pat[0] * 0.5 + d[0] * 0.5, uy = pat[1] * 0.5 + d[1] * 0.5, l = Math.hypot(ux, uy) || 1;
      const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
      cam.position.addScaledVector(right, (ux / l) * amt / 100 * hWorld).addScaledVector(up, (uy / l) * amt / 100 * hWorld);
    }
    cam.updateMatrixWorld();
  }
}

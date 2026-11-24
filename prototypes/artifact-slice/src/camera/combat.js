// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat camera (camera-system.md §3.5–§3.7, §4.2, §4.4, §4.5; plan §4.5), round 2 per owner direction
// (2026-11-24): a THIRD-PERSON rig BEHIND the controlled cat, FF7 Remake style.
//  - Combat: camera on the target->cat line behind the controlled cat, 3.8 m from a pivot at the cat's head
//    height (biased 20% toward the lock target), +12° pitch, a 0.45 m shoulder offset so the cat sits
//    left of centre and the target reads ahead of it; the cat is >= 20% of screen height. It pulls out
//    (to <= 6 m, +16°) only while the target is far (> 4.5 m) and eases back. Soft lock recentres behind
//    the cat (60°/s; 120°/s when the target leaves the frame); free orbit wins for 1 s after input.
//    Never through camera-solid geometry: distance pulls in, and if a wall still hides the cat or target the
//    yaw turns the minimum needed (<= 90°).
//  - Switch / Tag-In: 0.3 s smootherstep blend to the new cat's pose; during a Relay distance holds.
//  - Slow Blink: pushes IN, low behind the cat (4.6 m, +18°, pivot 40% toward the target), 0.2 s blends.
//  - Standoff: a push-in toward the opponents.  - Pile-On: wide +40° over the cloud (behind the panel).
//  - Overlays: stepped shake from Combat's tier table via sampleShake (screen-space translation, no
//    roll, no FOV change, held >= 2 frames, 1.8% clamp), punch-in dolly (in over the hit-stop, out over
//    150 ms, never stacks). The camera runs on unscaled (real) time; during global hit-stop the pivot is frozen.
import * as THREE from 'three';
import { sampleShake } from '../sim/combat/index.js';

const D2R = Math.PI / 180;
const ss = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10); };
const hl = (dt, h) => 1 - Math.pow(2, -dt / h);
const wrap = (a) => ((a + 540) % 360) - 180;
// fixed unit-vector pattern for stepped shake (deterministic; camera-system §4.5)
const PATTERN = [[0.2, 1], [-0.35, -0.94], [0.8, 0.6], [-0.9, 0.42], [0.55, -0.83], [-0.15, 0.99], [0.98, -0.2], [-0.7, -0.71]];

export const COMBAT_CAM = { fov: 45, dist: 3.8, distFar: 6.0, farFrom: 4.5, pitch: 12, pitchFar: 16, pitchHigh: 20, shoulder: 0.45, lead: 0.2, pivotH: 0.42,
  sbDist: 4.6, sbPitch: 20, sbLead: 0.3, sbShoulder: -1.15, sbPivotH: -0.05, sbBlend: 0.2, tagBlend: 0.3, enterBlend: 0.6, yawRate: 120, yawFollow: 60, softLockDelay: 1.0, punchOut: 0.15, shakeClamp: 1.8, minDist: 1.6 };

export class CombatCamera {
  constructor(cam) {
    this.cam = cam; cam.fov = COMBAT_CAM.fov;
    this.pose = { px: 0, py: 0.5, pz: 0, yaw: 0, pitch: 14, dist: 5, shoulder: 0.45 };
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
  userOrbit(dYaw, dPitch, t) { if (!dYaw && !dPitch) return; this.userYaw += dYaw; this.freePitch = Math.max(-4, Math.min(40, (this.freePitch ?? COMBAT_CAM.pitch) + dPitch)); this.lastUserT = t; }

  /** Solve the state's target pose. ctx: {C, T (Vector3|null), mode, slowBlink, highRoad, enemiesCentroid, aspect, pileCenter, standoffFocus, occluded, clearance} */
  solve(ctx, dt, t) {
    const c = COMBAT_CAM, s = this.solved;
    if (ctx.mode === 'pileon' && ctx.pileCenter) {
      s.px = ctx.pileCenter.x; s.py = 0.5; s.pz = ctx.pileCenter.z; s.pitch = 40; s.dist = 6.4; s.shoulder = 0; return s;
    }
    const C = ctx.C, T = ctx.T || ctx.enemiesCentroid || null;
    const behind = T && Math.hypot(C.x - T.x, C.z - T.z) > 0.15 ? Math.atan2(C.x - T.x, C.z - T.z) / D2R : null;
    if (ctx.mode === 'standoff' && ctx.standoffFocus) {
      // push-in from wide over the Posse toward the opponents (≈ 3 s), ending on the behind-the-cat pose
      const k = ss(ctx.standoffK);
      const P = C.clone().lerp(ctx.standoffFocus, 0.5 - 0.3 * k);
      s.px = P.x; s.py = 0.5; s.pz = P.z; s.pitch = 18 - 6 * k; s.dist = 6.5 - 2.7 * k; s.shoulder = c.shoulder * k;
      s.yaw = Math.atan2(C.x - ctx.standoffFocus.x, C.z - ctx.standoffFocus.z) / D2R; return s;
    }
    // M1.1: UNLOCKED (default) = a free third-person orbit around Mikan, driven only by the mouse / right stick
    if (ctx.free && !ctx.slowBlink) {
      s.px = C.x; s.pz = C.z; s.py = C.y + c.pivotH; s.dist = c.dist; s.shoulder = c.shoulder * 0.6;
      s.pitch = this.freePitch ?? c.pitch; s.yaw = this.pose.yaw + this.userYaw; this.userYaw = 0;
      return s;
    }
    const sep = T ? Math.hypot(C.x - T.x, C.z - T.z) : 0;
    let lead = ctx.slowBlink ? c.sbLead : c.lead;
    const P = T ? C.clone().lerp(T, lead) : C.clone();
    s.px = P.x; s.pz = P.z;
    s.py = C.y + c.pivotH + (T ? Math.max(0, T.y - C.y) * 0.45 : 0);
    if (ctx.slowBlink) { s.pitch = c.sbPitch; s.dist = c.sbDist; s.shoulder = c.sbShoulder; s.py = C.y + c.sbPivotH; }
    else {
      const far = Math.max(0, Math.min(1, (sep - c.farFrom) / 3));
      s.dist = c.dist + (c.distFar - c.dist) * far;
      s.pitch = ctx.highRoad ? c.pitchHigh : c.pitch + (c.pitchFar - c.pitch) * far;
      s.shoulder = c.shoulder;
      if (this.relayHold > t) s.dist = Math.max(s.dist, this.pose.dist);
    }
    // yaw: behind the cat on the target->cat line; free orbit wins for 1 s after input
    if (t - this.lastUserT < c.softLockDelay) { s.yaw = this.pose.yaw + this.userYaw; this.userYaw = 0; }
    else if (behind != null) {
      this.userYaw = 0;
      const diff = wrap(behind - s.yaw), rate = ctx.slowBlink ? 400 : ctx.offFrame ? c.yawRate : c.yawFollow;
      s.yaw += Math.sign(diff) * Math.min(Math.abs(diff), rate * dt * (Math.abs(diff) > 20 ? 1 : 0.6));
    }
    // never through camera-solid geometry: if a wall hides the cat or the target, turn the minimum needed
    if (ctx.occluded && ctx.occluded(s)) {
      const y0 = s.yaw; let best = null;
      for (let k = 10; k <= 90 && best == null; k += 10) for (const sg of [1, -1]) { s.yaw = y0 + sg * k; if (!ctx.occluded(s)) { best = y0 + sg * k; break; } }
      s.yaw = y0;
      if (best != null) { const d = wrap(best - y0); s.yaw = y0 + Math.sign(d) * Math.min(Math.abs(d), c.yawRate * 1.5 * dt); }
      else s.pitch = Math.max(s.pitch, 28);
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
        p.yaw = f.yaw + wrap(s.yaw - f.yaw) * k; p.pitch = f.pitch + (s.pitch - f.pitch) * k; p.dist = f.dist + (s.dist - f.dist) * k; p.shoulder = f.shoulder + (s.shoulder - f.shoulder) * k;
        if (this.blendT >= this.blendDur) this.from = null;
      } else {
        const a = hl(dtReal, 0.12), b = hl(dtReal, 0.25);
        p.px += (s.px - p.px) * a; p.py += (s.py - p.py) * a; p.pz += (s.pz - p.pz) * a;
        p.yaw += wrap(s.yaw - p.yaw) * b; p.pitch += (s.pitch - p.pitch) * b; p.dist += (s.dist - p.dist) * b; p.shoulder += (s.shoulder - p.shoulder) * b;
      }
    }
    // place
    const cam = this.cam, y = p.yaw * D2R, pi = p.pitch * D2R;
    const dir = new THREE.Vector3(Math.sin(y) * Math.cos(pi), Math.sin(pi), Math.cos(y) * Math.cos(pi));
    const pivot = new THREE.Vector3(p.px, p.py, p.pz);
    // shoulder offset: slide the pivot along the camera's right so the cat sits left of centre
    pivot.x += Math.cos(y) * p.shoulder; pivot.z += -Math.sin(y) * p.shoulder;
    let dist = p.dist;
    if (ctx.clearance) dist = Math.max(COMBAT_CAM.minDist, Math.min(dist, ctx.clearance(pivot, dir, dist)));
    // punch-in: dolly toward the impact point by a share of distance
    if (this.punch) {
      const q = this.punch, u = t - q.t0;
      const k = u < q.tin ? ss(u / q.tin) : 1 - ss((u - q.tin) / COMBAT_CAM.punchOut);
      if (u > q.tin + COMBAT_CAM.punchOut) this.punch = null;
      else { dist *= 1 - q.k * Math.max(0, k); pivot.lerp(q.pt, 0.25 * Math.max(0, k)); }
    }
    // stagger focus (M1.1 §5): a brief zoom onto the staggered cat, in over 2 drawings, out over the rest
    if (this.focus && t < this.focus.until) {
      const F = this.focus, u = (t - F.from) / (F.until - F.from), kk = u < 0.2 ? ss(u / 0.2) : 1 - ss((u - 0.2) / 0.8);
      pivot.lerp(F.pt, 0.6 * kk); dist *= 1 - F.k * kk;
    } else this.focus = null;
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

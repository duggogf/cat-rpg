// PROTOTYPE - NOT FOR PRODUCTION
// Explore camera (camera-system.md §3.2–§3.4, §4.4): free orbit around Mikan's pivot,
// 3.0 m / +10° / vFOV 45°, pitch −10°..+55°, distance 0.8–3.6 m. Collision: five rays
// approximate a 0.15 m sphere-cast against the level boxes; snap in at once, ease out with a
// 0.4 s half-life; below 1.2 m pitch rises by up to +20°.
import * as THREE from 'three';

const D2R = Math.PI / 180;
export const EXPLORE = { dist: 3.0, pitch: 10, fov: 45, pitchMin: -10, pitchMax: 55, distMin: 0.8, distMax: 3.6, radius: 0.15, easeOut: 0.4, pivotH: 0.45 };

/** Ray (origin o, unit dir d) vs Box3; returns entry distance or Infinity. Origin inside -> Infinity (ignored). */
function rayBox(o, d, b) {
  let t0 = -Infinity, t1 = Infinity;
  for (const k of ['x', 'y', 'z']) {
    if (Math.abs(d[k]) < 1e-9) { if (o[k] < b.min[k] || o[k] > b.max[k]) return Infinity; continue; }
    let a = (b.min[k] - o[k]) / d[k], c = (b.max[k] - o[k]) / d[k]; if (a > c) [a, c] = [c, a];
    t0 = Math.max(t0, a); t1 = Math.min(t1, c);
  }
  return t1 >= t0 && t0 > 0 ? t0 : Infinity;
}

export class OrbitRig {
  constructor(camera, colliders) {
    this.cam = camera; this.col = colliders;
    this.yaw = 0; this.pitch = EXPLORE.pitch; this.want = EXPLORE.dist; this.dist = EXPLORE.dist;
    this.pivot = new THREE.Vector3();
  }
  /** Distance the camera may sit at along dir from pivot (min over five rays). */
  clearance(pivot, dir, want) {
    const right = new THREE.Vector3(dir.z, 0, -dir.x).normalize(), up = new THREE.Vector3().crossVectors(dir, right).normalize();
    const r = EXPLORE.radius; let best = want;
    for (const [a, b] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const o = pivot.clone().addScaledVector(right, a * r * 0.7).addScaledVector(up, b * r * 0.7);
      for (const box of this.col) { if (box.soft) continue; const t = rayBox(o, dir, box); if (t < best + r) best = Math.min(best, t - r); }
    }
    return Math.max(EXPLORE.distMin, best);
  }
  update(dt, target, snap = false) {
    this.pivot.set(target.x, target.y + EXPLORE.pivotH, target.z);
    this.pitch = THREE.MathUtils.clamp(this.pitch, EXPLORE.pitchMin, EXPLORE.pitchMax);
    this.want = THREE.MathUtils.clamp(this.want, EXPLORE.distMin, EXPLORE.distMax);
    const dirOf = (p) => new THREE.Vector3(Math.sin(this.yaw * D2R) * Math.cos(p * D2R), Math.sin(p * D2R), Math.cos(this.yaw * D2R) * Math.cos(p * D2R));
    let pitch = this.pitch, dir = dirOf(pitch);
    let free = this.clearance(this.pivot, dir, this.want);
    if (free < 1.2) { pitch = Math.min(EXPLORE.pitchMax, pitch + 20 * (1.2 - free) / 0.4); dir = dirOf(pitch); free = this.clearance(this.pivot, dir, this.want); }
    if (snap || free < this.dist) this.dist = free;                                   // snap in
    else this.dist = Math.min(free, this.dist + (free - this.dist) * (1 - Math.pow(2, -dt / EXPLORE.easeOut))); // ease out
    this.cam.position.copy(this.pivot).addScaledVector(dir, this.dist);
    this.cam.lookAt(this.pivot);
  }
}

/** Push a circle (x,z,r) out of boxes that span its height band. */
export function collideCircle(p, r, boxes, footY = 0, headY = 0.4) {
  for (const b of boxes) {
    if (b.max.y < footY + 0.05 || b.min.y > footY + headY) continue;
    const cx = THREE.MathUtils.clamp(p.x, b.min.x, b.max.x), cz = THREE.MathUtils.clamp(p.z, b.min.z, b.max.z);
    const dx = p.x - cx, dz = p.z - cz, d = Math.hypot(dx, dz);
    if (d < r) { if (d > 1e-6) { p.x = cx + dx / d * r; p.z = cz + dz / d * r; } else p.x += r; }
  }
}

/**
 * M2 Explore rig (camera-system.md §3.2–§3.4; owner M1.2 feel rules shared with combat):
 *  - look input is applied 1:1 to yaw/pitch (never through a smoothing filter)
 *  - the pivot follows Mikan on a critically damped spring (no snaps, no overshoot); vertical tracking holds the
 *    last landing height during a Hop
 *  - sub-states blend 0.4 s: Explore (3.0 m, +10°), High Road (3.4 m, +16°), Home inside the garden wall
 *    (1.8 m, low, −2°; hud.md §3.5 wall blend)
 *  - collision: five rays (0.15 m sphere-cast), snap in, ease out with a 0.4 s half-life; under 1.2 m pitch lifts;
 *    the lens never goes below the ground (the lane slopes)
 *  - auto-recentre after 1.5 s without look input while moving, ≤ 90°/s, never while running toward the lens
 */
export const STATES = { explore: { dist: 3.0, pitch: 10, pivotH: 0.45 }, highroad: { dist: 3.4, pitch: 16, pivotH: 0.45 }, home: { dist: 1.8, pitch: -2, pivotH: 0.3 } };
export class ExploreRig extends OrbitRig {
  constructor(camera, colliders, groundAt) {
    super(camera, colliders); this.groundAt = groundAt;
    this.state = 'explore'; this.k = { ...STATES.explore }; this.zoom = 1; this.pv = [0, 0, 0]; this.p = null; this.lastLook = -99; this.t = 0; this.inside = false;
  }
  look(dYaw, dPitch) { if (!dYaw && !dPitch) return; this.yaw += dYaw; this.pitch = THREE.MathUtils.clamp(this.pitch + dPitch, EXPLORE.pitchMin, EXPLORE.pitchMax); this.lastLook = this.t; }
  setState(s) { if (s !== this.state) { this.state = s; if (this.t - this.lastLook > 1.0) this.pitchTarget = STATES[s].pitch; } }
  update(dt, target, snap = false, ctx = {}) {
    this.t += dt; const S = STATES[this.state], b = snap ? 1 : 1 - Math.pow(2, -dt / 0.13);   // 0.4 s blend ≈ 3 half-lives
    for (const k of ['dist', 'pivotH']) this.k[k] += (S[k] - this.k[k]) * b;
    if (this.pitchTarget != null) { this.pitch += (this.pitchTarget - this.pitch) * b; if (Math.abs(this.pitchTarget - this.pitch) < 0.2) this.pitchTarget = null; }
    // auto-recentre
    if (ctx.moveDir && this.t - this.lastLook > 1.5 && !snap) {
      const want = Math.atan2(-ctx.moveDir.x, -ctx.moveDir.z) * 180 / Math.PI;   // camera sits behind the movement
      let d = ((want - this.yaw + 540) % 360) - 180;
      if (Math.abs(d) < 135) this.yaw += Math.sign(d) * Math.min(Math.abs(d), 90 * dt * Math.min(1, (this.t - this.lastLook - 1.5) / 0.3));
    }
    // pivot spring (hold the landing height while airborne)
    const ty = ctx.airborne ? (this.p ? this.p.y - this.k.pivotH : target.y) : target.y;
    const tgt = [target.x, ty + this.k.pivotH, target.z];
    if (!this.p || snap) { this.p = new THREE.Vector3(...tgt); this.pv = [0, 0, 0]; }
    else { const w = 11, h = Math.min(dt, 1 / 30); const P = ['x', 'y', 'z']; for (let i = 0; i < 3; i++) { const x = this.p[P[i]]; this.pv[i] += (w * w * (tgt[i] - x) - 2 * w * this.pv[i]) * h; this.p[P[i]] = x + this.pv[i] * h; } }
    this.pivot.copy(this.p);
    const want = THREE.MathUtils.clamp(this.k.dist * this.zoom, EXPLORE.distMin, EXPLORE.distMax);
    const dirOf = (p) => new THREE.Vector3(Math.sin(this.yaw * D2R) * Math.cos(p * D2R), Math.sin(p * D2R), Math.cos(this.yaw * D2R) * Math.cos(p * D2R));
    let pitch = this.pitch, dir = dirOf(pitch), free = this.clearance(this.pivot, dir, want);
    if (free < 1.2) { pitch = Math.min(EXPLORE.pitchMax, pitch + 20 * (1.2 - free) / 0.4); dir = dirOf(pitch); free = this.clearance(this.pivot, dir, want); }
    if (snap || free < this.dist) this.dist = free; else this.dist = Math.min(free, this.dist + (free - this.dist) * (1 - Math.pow(2, -dt / EXPLORE.easeOut)));
    // ground clamp: raise the pitch until the lens clears the lane by 0.25 m
    for (let i = 0; i < 12; i++) {
      const c = this.pivot.clone().addScaledVector(dir, this.dist), gy = this.groundAt ? this.groundAt(c.x, c.z) : 0;
      if (c.y >= gy + 0.25) break; pitch += 3; dir = dirOf(pitch);
    }
    this.cam.position.copy(this.pivot).addScaledVector(dir, this.dist);
    this.cam.lookAt(this.pivot);
    this.solvedPitch = pitch;
  }
}

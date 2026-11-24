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

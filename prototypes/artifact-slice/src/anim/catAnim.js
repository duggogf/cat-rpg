// PROTOTYPE - NOT FOR PRODUCTION
// Procedural cat animation.
//  idle: breathing, blinks, ear flicks, tail swish + occasional tip curl, glances (or lookAt).
//  walk: lateral-sequence gait (LH, LF, RH, RF) with a big stride, a two-beat body bounce with a
//        squash-settle on each contact, a head bob a beat late, and a tail that lags and overlaps
//        (spring-followed bones + a travelling wave down the chain).
// Locomotion is on ones; secondary acts (blink, ear flick, glances) step on twos (art bible §8.4).
// Tail carriage is a pose layer per personality (art bible §3.3), so it works on any tail.

const D = Math.PI / 180;
export const CARRIAGES = {
  // [pitch, yaw] per bone; pitch + = up/forward curl, yaw + = toward the cat's LEFT (+X).
  // From behind, each carriage must leave the body silhouette differently (kit CARRY_BACK).
  // Braggart: straight up, leaning out, tip hooked forward like a flag
  flag: { bones: [[20, 84], [0, 0], [72, 0], [12, 0], [-26, 0], [-44, 0]], sway: 5, speed: 1.1, tip: 0.6 },
  // Brooder: low, level with the hocks, dead still apart from one slow tip flick
  anchor: { bones: [[-40, -52], [18, -10], [14, -8], [10, -6], [8, 0], [6, 0]], sway: 1.5, speed: 0.35, tip: 1 },
  // Schemer: horizontal, swept out to the side, tip twitching fast
  blade: { bones: [[10, 50], [-3, 12], [-2, 6], [0, 4], [0, 0], [0, 0]], sway: 3, speed: 3.6, tip: 1 },
  // Fraidy: tucked low and curved under, the tip curling up
  comma: { bones: [[-30, 86], [-8, 0], [0, 0], [28, 0], [38, 0], [32, 0]], sway: 1.5, speed: 1.6, tip: 0.6 },
  // Stalwart: upright and straight, steady, no sway
  post: { bones: [[-4, -88], [0, 0], [0, 0], [80, 0], [12, 0], [0, 0]], sway: 0, speed: 0, tip: 0 },
  // Goofball: up with a loose wobbling curl to the side, never still
  spring: { bones: [[12, -86], [0, 0], [4, 0], [58, 0], [62, 0], [64, 0]], sway: 9, speed: 2.4, tip: 0.3 },
  // Mikan's pom: a perky stub
  pom: { bones: [[30, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], sway: 6, speed: 1.6, tip: 0 },
};

/** Personality posture (art bible §3.3: ears, head and stance read from behind, in silhouette). Radians.
 *  earX: + forward / − back; earZ: outward splay ("airplane"); head: + low / − high; crouch: 0..1 (bent legs). */
export const POSTURE = {
  flag: { earX: 0.18, earZ: -0.05, head: -0.12, chest: -0.06, crouch: 0 },        // Braggart: forward, high, chest out
  post: { earX: 0.05, earZ: 0, head: -0.03, chest: 0, crouch: 0 },                // Stalwart: upright, steady
  spring: { earX: 0.05, earZ: 0.1, head: 0.0, chest: 0, crouch: 0, oddEar: 0.55 }, // Goofball: one ear out of sync
  blade: { earX: -0.1, earZ: 0.3, head: 0.12, chest: 0.04, crouch: 0.3 },        // Schemer: low slink, ears swivel
  anchor: { earX: -0.25, earZ: 0.75, head: 0.2, chest: 0.05, crouch: 0.12 },     // Brooder: airplane ears, head low
  comma: { earX: -0.45, earZ: 0.38, head: 0.16, chest: 0.06, crouch: 0.5 },      // Fraidy: ears flat back, half-crouched
  pom: { earX: 0, earZ: 0, head: 0, chest: 0, crouch: 0 },                        // Mikan: the player's personality
};

function mulberry(seed) {
  let a = seed | 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const easeOut = (t) => 1 - (1 - t) * (1 - t);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const TAU = Math.PI * 2;

/**
 * @param {Record<string, THREE.Bone>} B bones by name (rest rotation = identity)
 * @param {{carry:string, legLen:number, seed:number}} o  legLen in world metres (scaled)
 */
export function createAnimator(B, o) {
  const rnd = mulberry(o.seed || 7);
  const rest = {}; for (const k in B) rest[k] = B[k].position.clone();
  let t = 0, gait = 'idle', speed = 0, phase = 0, walkW = 0;
  let carry = CARRIAGES[o.carry] || CARRIAGES.pom;
  const pose = POSTURE[o.posture] || POSTURE[o.carry] || POSTURE.pom;
  const isPom = carry === CARRIAGES.pom;
  let nextBlink = 1.2 + rnd() * 2.5, blinkT = -1;
  let nextFlick = 1.5 + rnd() * 2.5, flickT = -1, flickSide = 1;
  let nextCurl = 2.5 + rnd() * 3, curlT = -1;
  let nextGlance = 2 + rnd() * 3, glanceT = -1, glanceYaw = 0, glancePitch = 0, glanceHold = 2;
  let lookTarget = null;                   // cat-local (unscaled) point, or null
  let lookYaw = 0, lookPitch = 0;
  const tailCur = Array.from({ length: 6 }, () => [0, 0]), tailVel = Array.from({ length: 6 }, () => [0, 0]);
  let tailInit = false;
  const state = { faceFrame: 0 };
  const step2 = (x) => Math.floor(x * 12) / 12; // sample on twos (12 poses/s)
  const setRot = (name, x, y, z) => { const b = B[name]; if (b) b.rotation.set(x, y, z); };
  const headPivot = rest.head.clone().add(rest.neck).add(rest.chest).add(rest.hips); // approx model-space pivot

  return {
    state,
    setCarry(name) { carry = CARRIAGES[name] || carry; },
    setGait(name, spd) { gait = name; speed = spd || 0; },
    /** p: {x,y,z} in the cat's local, unscaled space (origin at the feet, +Z forward), or null. */
    setLook(p) { lookTarget = p ? { x: p.x, y: p.y, z: p.z } : null; },
    update(dt) {
      t += dt;
      const walking = gait === 'walk' && speed > 0.01;
      walkW += ((walking ? 1 : 0) - walkW) * Math.min(1, dt * 7);
      const A = 34 * D;                                        // stride sweep (doubled from M0 v1)
      const freq = walking ? speed * 0.62 / (2 * o.legLen * Math.sin(A)) : 0;
      phase = (phase + dt * freq) % 1;
      const p2 = phase * 2 * TAU;                              // two beats per cycle
      const k = o.legLen / 0.15;

      // ---- body: breathing (idle) / bounce + squash-settle on each contact (walk)
      const br = Math.sin(t * TAU / 3.4) * (1 - walkW);
      const bounce = walkW * (0.5 - 0.5 * Math.cos(p2));       // 0 at contact, 1 at passing
      const settle = walkW * Math.max(0, Math.cos(p2)) ** 6;   // sharp, at contact
      const cr = pose.crouch * (1 - 0.5 * walkW), lh = (o.legRest || 0.14) * 0.5;
      B.hips.position.y = rest.hips.y + (bounce * 0.016 - 0.008 * walkW - settle * 0.004) * k - 2 * lh * (1 - Math.cos(cr));
      const sq = settle * 0.05;
      B.chest.scale.set(1 + br * 0.018 + sq * 0.6, 1 + br * 0.03 - sq, 1);
      const inv = [1 / (1 + br * 0.018 + sq * 0.6), 1 / (1 + br * 0.03 - sq), 1];
      B.neck.scale.set(...inv); B.fUL.scale.set(...inv); B.fUR.scale.set(...inv);
      const sway = Math.sin(phase * TAU);
      setRot('hips', walkW * (0.04 * Math.sin(p2 + 0.6)), walkW * 0.07 * sway, walkW * 0.05 * sway);
      setRot('chest', pose.chest - 0.03 * br - walkW * 0.05 + walkW * 0.03 * Math.sin(p2 - 0.4), -walkW * 0.1 * sway, -walkW * 0.06 * sway);

      // ---- legs (lateral sequence); swing is quick and lifted high
      const legs = { hUL: 0, fUL: 0.25, hUR: 0.5, fUR: 0.75 };
      for (const [up, off] of Object.entries(legs)) {
        const lo = up[0] + 'L' + up[2];
        const p = (phase + off) % 1, stance = 0.62;
        let a, bend = 0;
        if (p < stance) a = -A + 2 * A * (p / stance);
        else { const s = (p - stance) / (1 - stance); a = A - 2 * A * easeOut(s); bend = Math.sin(Math.PI * Math.min(1, s * 1.1)); }
        const front = up[0] === 'f';
        // lift comes mostly from the shoulder/hip; the wrist/hock bend stays under ~55° so the skin never folds through
        // crouch: a Z-bend (front: elbow back, wrist forward; hind: knee forward, hock back)
        setRot(up, walkW * (a - (front ? bend * 0.25 : bend * 0.45)) + (front ? cr : -cr), 0, 0);
        setRot(lo, walkW * bend * (front ? 0.95 : 0.85) + (front ? -2 * cr : 2 * cr), 0, 0);
      }

      // ---- head: look target, else idle glances (on twos); a head bob a beat behind the bounce
      let ty = 0, tp = 0;
      if (lookTarget) {
        const dx = lookTarget.x - headPivot.x, dy = lookTarget.y - headPivot.y, dz = lookTarget.z - headPivot.z;
        ty = clamp(Math.atan2(dx, dz), -1.25, 1.25);
        tp = clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.45, 0.5);
      } else {
        if (glanceT < 0 && t > nextGlance && walkW < 0.5) { glanceT = 0; glanceYaw = (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.45); glancePitch = (rnd() - 0.6) * 0.3; glanceHold = 1.2 + rnd() * 1.4; }
        if (glanceT >= 0) {
          glanceT += dt;
          if (glanceT < glanceHold) { ty = glanceYaw; tp = glancePitch; }
          else { glanceT = -1; nextGlance = t + 3 + rnd() * 4; }
        }
        ty += (1 - walkW) * 0.12 * Math.sin(t * 0.37);
      }
      const ls = Math.min(1, dt * (lookTarget ? 6 : 9));
      lookYaw += (ty - lookYaw) * ls; lookPitch += (tp - lookPitch) * ls;
      const headBob = walkW * Math.sin(p2 - 1.3);              // late: overlaps the body bounce
      setRot('neck', walkW * 0.08 + lookPitch * 0.35, lookYaw * 0.35, 0);
      setRot('head', 0.04 * br + lookPitch * 0.65 - headBob * 0.07 + pose.head, lookYaw * 0.65, 0.04 * Math.sin(t * 0.29) * (1 - walkW) + lookYaw * 0.08);
      B.head.position.y = rest.head.y - headBob * 0.004 * k;

      // ---- tail: carriage pose + sway + idle tip curl + walk wave, followed by lagging springs
      if (curlT < 0 && t > nextCurl && walkW < 0.5) curlT = 0;
      let curl = 0;
      if (curlT >= 0) { curlT += dt; curl = Math.sin(Math.PI * Math.min(1, curlT / 1.4)); if (curlT > 1.4) { curlT = -1; nextCurl = t + 3 + rnd() * 4; } }
      const swayA = carry.sway * D;
      for (let i = 0; i < 6; i++) {
        const [pi, ya] = carry.bones[i];
        const kk = i / 5, w = (1 - carry.tip) + carry.tip * kk;
        const s = Math.sin(t * carry.speed * TAU - i * 0.6) * swayA * w;
        const wave = walkW * Math.sin(p2 - 1.0 - i * 0.7) * (isPom ? 0.22 : 0.1 + 0.05 * kk);   // pom bounces a beat behind
        const side = walkW * Math.sin(phase * TAU - 0.8 - i * 0.5) * 0.12 * (0.3 + kk);
        const tgt = [pi * D + wave + (i >= 3 ? curl * 0.45 : 0), -ya * D + s + side];
        if (!tailInit) { tailCur[i][0] = tgt[0]; tailCur[i][1] = tgt[1]; }
        // critically-damped follow, softer toward the tip = lag and overlap
        const wN = 26 - i * 3;
        for (let j = 0; j < 2; j++) {
          const a = wN * wN * (tgt[j] - tailCur[i][j]) - 2 * wN * tailVel[i][j];
          tailVel[i][j] += a * Math.min(dt, 1 / 30); tailCur[i][j] += tailVel[i][j] * Math.min(dt, 1 / 30);
        }
        setRot('tail' + (i + 1), tailCur[i][0], tailCur[i][1], 0);
      }
      tailInit = true;

      // ---- blink (on twos): half, closed, closed, half
      if (blinkT < 0 && t > nextBlink) blinkT = 0;
      state.faceFrame = 0;
      if (blinkT >= 0) {
        blinkT += dt; const f = Math.floor(blinkT * 12);
        state.faceFrame = f === 0 || f === 3 ? 1 : f < 3 ? 2 : 0;
        if (f > 3) { blinkT = -1; nextBlink = t + 2.2 + rnd() * 3.2; }
      }
      // ---- ear flick (on twos): one ear snaps back and returns
      let fl = 0;
      if (flickT < 0 && t > nextFlick) { flickT = 0; flickSide = rnd() < 0.5 ? 1 : -1; }
      if (flickT >= 0) {
        flickT += dt; const s = step2(flickT);
        fl = s < 0.17 ? 1 : s < 0.33 ? 0.5 : 0;
        if (flickT > 0.42) { flickT = -1; nextFlick = t + 1.8 + rnd() * 3; }
      }
      const earWalk = -0.1 * walkW + walkW * 0.06 * Math.sin(p2 - 1.6);
      const swivel = o.posture === 'blade' ? 0.35 * Math.sin(t * 1.3) : 0; // Schemer: ears swivel independently
      setRot('earL', pose.earX + earWalk - (flickSide > 0 ? fl * 0.55 : 0), swivel, -pose.earZ + (flickSide > 0 ? fl * 0.5 : 0) - (pose.oddEar || 0));
      setRot('earR', pose.earX + earWalk - (flickSide < 0 ? fl * 0.55 : 0), -swivel * 0.7, pose.earZ - (flickSide < 0 ? fl * 0.5 : 0));
    },
  };
}

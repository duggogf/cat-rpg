// PROTOTYPE - NOT FOR PRODUCTION
// Procedural cat animation: idle (breathing, blink, tail sway, ear flick) and walk (lateral-sequence
// gait: LH, LF, RH, RF). Locomotion is on ones but pose-to-pose in feel: quick snappy swings, a
// held contact, a two-beat bob. Secondary acts (blink, ear flick) step on twos (art bible §8.4).
// Tail carriage is a pose layer per personality (art bible §3.3), so it works on any tail.

const D = Math.PI / 180;
/** Per-bone [pitch, yaw] in degrees for tail1..tail6 (pitch + = up, yaw + = to the cat's right). */
export const CARRIAGES = {
  // Braggart: straight up, tip hooked forward like a flag
  flag: { bones: [[78, 4], [12, 3], [4, 2], [0, 0], [-22, 0], [-46, 0]], sway: 5, speed: 1.1, tip: 0.6 },
  // Brooder: low, level with the hocks, dead still apart from one slow tip flick
  anchor: { bones: [[-52, 0], [16, 0], [16, 0], [12, 0], [8, 0], [6, 0]], sway: 1.5, speed: 0.35, tip: 1 },
  // Schemer: horizontal, tip twitching fast
  blade: { bones: [[8, 0], [-3, 0], [-2, 0], [0, 0], [0, 0], [0, 0]], sway: 3, speed: 3.6, tip: 1 },
  // Fraidy: tucked low and curved under
  comma: { bones: [[-70, -18], [-20, -14], [-16, -16], [-14, -18], [-10, -20], [-10, -14]], sway: 1.5, speed: 1.6, tip: 0.6 },
  // Stalwart: upright and straight, steady, no sway
  post: { bones: [[86, 0], [2, 0], [0, 0], [0, 0], [0, 0], [-2, 0]], sway: 0, speed: 0, tip: 0 },
  // Goofball: up with a loose wobbling curl, never still
  spring: { bones: [[62, -10], [14, -14], [16, -10], [30, -6], [44, 0], [52, 0]], sway: 9, speed: 2.4, tip: 0.3 },
  // Mikan's pom: a perky stub
  pom: { bones: [[30, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], sway: 6, speed: 1.6, tip: 0 },
};

function mulberry(seed) {
  let a = seed | 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const ease = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - (1 - t) * (1 - t);

/**
 * @param {Record<string, THREE.Bone>} B bones by name (rest rotation = identity)
 * @param {{carry:string, legLen:number, seed:number, restY:object}} o
 */
export function createAnimator(B, o) {
  const rnd = mulberry(o.seed || 7);
  const restY = {}; for (const k in B) restY[k] = B[k].position.clone();
  let t = 0, gait = 'idle', speed = 0, phase = 0, walkW = 0;
  let carry = CARRIAGES[o.carry] || CARRIAGES.pom;
  let nextBlink = 1.2 + rnd() * 2.5, blinkT = -1;
  let nextFlick = 2 + rnd() * 3, flickT = -1, flickSide = 1;
  const state = { faceFrame: 0 };
  const step2 = (x) => Math.floor(x * 12) / 12; // sample on twos (12 poses/s)

  function setRot(name, x, y, z) { const b = B[name]; if (b) b.rotation.set(x, y, z); }

  return {
    state,
    setCarry(name) { carry = CARRIAGES[name] || carry; },
    setGait(name, spd) { gait = name; speed = spd || 0; },
    update(dt) {
      t += dt;
      const walking = gait === 'walk' && speed > 0.01;
      walkW += ((walking ? 1 : 0) - walkW) * Math.min(1, dt * 8);
      // cadence from speed: stride sweep held near ±24° so planted paws do not skate (≈ 2 Hz at 0.6 m/s)
      const A = 24 * D, freq = walking ? speed * 0.62 / (2 * o.legLen * Math.sin(A)) : 0;
      phase = (phase + dt * freq) % 1;

      // ---- breathing (idle) and two-beat bob (walk)
      const br = Math.sin(t * 2 * Math.PI / 3.4) * (1 - walkW);
      const bob = walkW * (Math.abs(Math.cos(phase * 2 * Math.PI * 2)) - 0.6);
      B.hips.position.y = restY.hips.y + bob * 0.007 * o.legLen / 0.14 - 0.003 * walkW;
      B.chest.scale.set(1 + br * 0.018, 1 + br * 0.03, 1);
      B.neck.scale.set(1 / (1 + br * 0.018), 1 / (1 + br * 0.03), 1);
      for (const n of ['fUL', 'fUR']) B[n].scale.set(1 / (1 + br * 0.018), 1 / (1 + br * 0.03), 1);
      setRot('hips', walkW * 0.025 * Math.sin(phase * 2 * Math.PI * 2), walkW * 0.05 * Math.sin(phase * 2 * Math.PI), walkW * 0.03 * Math.sin(phase * 2 * Math.PI));
      setRot('chest', -0.03 * br - walkW * 0.03, -walkW * 0.07 * Math.sin(phase * 2 * Math.PI), -walkW * 0.04 * Math.sin(phase * 2 * Math.PI));

      // ---- legs (lateral sequence)
      const legs = { hUL: 0, fUL: 0.25, hUR: 0.5, fUR: 0.75 };
      for (const [up, off] of Object.entries(legs)) {
        const lo = up[0] + 'L' + up[2];
        const p = (phase + off) % 1, stance = 0.62;
        let a, bend = 0;
        if (p < stance) a = -A + 2 * A * (p / stance);              // planted, sweeping back
        else { const s = (p - stance) / (1 - stance); a = A - 2 * A * easeOut(s); bend = Math.sin(Math.PI * Math.min(1, s * 1.15)); }
        const front = up[0] === 'f';
        setRot(up, walkW * (a - (front ? 0 : bend * 0.35)), 0, 0);
        setRot(lo, walkW * bend * (front ? 1.25 : 0.9), 0, 0);
      }

      // ---- head: steady (cats hold the head level), a slow look in idle
      const look = (1 - walkW) * (0.22 * Math.sin(t * 0.37) + 0.08 * Math.sin(t * 0.93));
      setRot('head', 0.04 * br - walkW * 0.05 * Math.cos(phase * 2 * Math.PI * 2), look, 0.05 * Math.sin(t * 0.29) * (1 - walkW));
      setRot('neck', walkW * 0.06, 0, 0);

      // ---- tail: carriage pose + sway with a lag down the chain; on the walk it swings with the hips
      const swayA = carry.sway * D, ws = walkW * Math.sin(phase * 2 * Math.PI) * 6 * D;
      for (let i = 0; i < 6; i++) {
        const [pi, ya] = carry.bones[i];
        const k = i / 5, w = (1 - carry.tip) + carry.tip * k;
        const s = Math.sin(t * carry.speed * 2 * Math.PI - i * 0.6) * swayA * w;
        setRot('tail' + (i + 1), pi * D + (i === 0 ? walkW * 0.05 * Math.sin(phase * 4 * Math.PI) : 0), -ya * D + s + ws * (0.4 + k), 0);
      }

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
        if (flickT > 0.4) { flickT = -1; nextFlick = t + 2.5 + rnd() * 4; }
      }
      setRot('earL', -0.08 * walkW - (flickSide > 0 ? fl * 0.5 : 0), 0, flickSide > 0 ? fl * 0.5 : 0);
      setRot('earR', -0.08 * walkW - (flickSide < 0 ? fl * 0.5 : 0), 0, flickSide < 0 ? -fl * 0.5 : 0);
    },
  };
}

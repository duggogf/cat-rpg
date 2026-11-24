// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combatants on screen: one cat per sim entity (via the cat contract, src/render/cats/index.js), placed and
// posed from interpolated snapshots. The cats only have idle/walk gaits, so combat poses are procedural
// transforms on a wrapper (lunge, recoil, squash, arch, puff, splat, bolt), stepped on twos.
// Identity (art bible §4.3 "outline order"): Ink line -> 2 px Clowder keyline (Bell-Gold Posse, Sage Wall
// Sitters, dashed-look gold for the guest, Frazzle Magenta when Frazzled) -> 1 px Paper Cream rim. The cat
// contract has no keyline hook, so it is added here as two extra hull shells sharing the cat's skinned
// geometry (defensive: skipped if the mesh layout changes).
import * as THREE from 'three';
import { createCat } from '../cats/index.js';

/**
 * THE cast mapping table: sim catalogue id -> render cast. Only 'mikan' and 'wallSitter' exist today;
 * when the slice's other cats land, change the `cast` here (nothing else keys off cat ids).
 * `scale` multiplies the art-bible 1.25x (Daifuku's sim radius is 0.6 m vs 0.35 m).
 */
export const CAST_MAP = {
  mikan: { cast: 'mikan', scale: 1.0 },
  hige: { cast: 'wallSitter', scale: 1.08 }, pon: { cast: 'wallSitter', scale: 0.96 }, kinako: { cast: 'wallSitter', scale: 0.92 },
  togemaru: { cast: 'wallSitter', scale: 1.0 }, kagi: { cast: 'wallSitter', scale: 0.98 },
  goma: { cast: 'wallSitter', scale: 1.12 }, sasa: { cast: 'wallSitter', scale: 1.0 }, stray: { cast: 'wallSitter', scale: 0.94 },
  challenger: { cast: 'wallSitter', scale: 1.05 }, captain: { cast: 'wallSitter', scale: 1.15 },
  daifuku: { cast: 'wallSitter', scale: 1.7 },
};
const DEFAULT = { cast: 'wallSitter', scale: 1.0 };

const hexV = (h) => { const n = parseInt(h.slice(1), 16); return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
export const COL = { ink: '#33273B', cream: '#FFF6E3', gold: '#F2B01E', sage: '#A8C878', magenta: '#FF3D8B' };

/** Extra hull shells for the keyline + cream rim. */
function addKeyline(cat, rim = true) {
  const sk = cat.object3D.getObjectByProperty('isSkinnedMesh', true);
  if (!sk || !Array.isArray(sk.material) || !sk.material[1] || !sk.material[1].uniforms || !sk.material[1].uniforms.uLinePx) return null;
  const base = sk.material[1];
  const hide = new THREE.MeshBasicMaterial({ visible: false });
  const shells = [['key', 2.2, 1], ['rim', 3.4, 2]].filter((x) => rim || x[0] === 'key').map(([name, extra, off]) => {
    const m = base.clone();
    m.uniforms.uInk.value = hexV(name === 'rim' ? COL.cream : COL.gold);
    m.polygonOffset = true; m.polygonOffsetFactor = 2 * off; m.polygonOffsetUnits = 40 * off;
    const mesh = new THREE.SkinnedMesh(sk.geometry, [hide, m]);
    mesh.bind(sk.skeleton, sk.bindMatrix); mesh.frustumCulled = false; mesh.name = 'keyline-' + name;
    mesh.onBeforeRender = () => {
      m.uniforms.uRes.value.copy(base.uniforms.uRes.value);
      const k = base.uniforms.uRes.value.y / 1080;
      m.uniforms.uLinePx.value = base.uniforms.uLinePx.value + extra * k * mesh.userData.w;
    };
    mesh.userData.w = 1;
    sk.parent.add(mesh);
    return { mesh, mat: m };
  });
  const noRim = { mesh: { userData: {}, visible: true }, mat: null };
  return { key: shells[0], rim: shells[1] || noRim, fill: sk.material[0], hull: base, inkHull: base.uniforms.uInk.value.clone() };
}

const ss = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const lerpAngle = (a, b, k) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;

export class Fighter {
  constructor(ent, o = {}) {
    this.id = ent.id; this.side = ent.side; this.catId = ent.cat;
    const m = CAST_MAP[ent.cat] || DEFAULT;
    this.cat = createCat({ cast: m.cast, scale: 1.25 * m.scale });
    this.scaleK = m.scale;
    this.root = new THREE.Group(); this.pose = new THREE.Group();
    this.root.add(this.pose); this.pose.add(this.cat.object3D);
    this.root.name = 'fighter:' + ent.id;
    this.kl = addKeyline(this.cat, o.rim !== false);
    this.setClowder(ent.side === 'enemy' ? 'sage' : 'gold');
    this.yaw = Math.atan2(ent.facing[0], ent.facing[1]);
    this.prevPos = new THREE.Vector3(...ent.pos); this.pos = this.prevPos.clone(); this.vel = new THREE.Vector3();
    this.impulses = []; this.look = 'normal'; this.flashUntil = 0; this.hidden = false; this.routedAt = null; this.boltDir = [0, 1];
    this.head = new THREE.Vector3();
  }
  setClowder(c) {
    if (!this.kl) return;
    this.clowder = c;
    this.kl.key.mat.uniforms.uInk.value.copy(hexV(COL[c] || COL.gold));
  }
  /** Event-driven pose impulses: 'strike' (lunge), 'hurt' (recoil), 'take' (eyes-wide hold), 'hiss' (arch). */
  impulse(kind, t, o = {}) { this.impulses.push({ kind, t0: t, dur: o.dur || ({ strike: 0.2, hurt: 0.22, take: 0.18, hiss: 0.45, land: 0.2 }[kind] || 0.2), mag: o.mag || 1, dir: o.dir }); }
  flash(t, frames = 2) { this.flashUntil = t + frames / 60 + 1e-4; }

  /** Look overrides for impact frames: 'normal' | 'flash' (Cream silhouette) | 'ink' (Ink silhouette, Cream line). */
  setLook(mode) {
    if (!this.kl || this.look === mode) return;
    this.look = mode; const f = this.kl.fill.uniforms, h = this.kl.hull.uniforms;
    if (!f.uSil) return;
    if (mode === 'normal') { f.uSil.value = 0; h.uInk.value.copy(this.kl.inkHull); this.kl.key.mesh.visible = this.kl.rim.mesh.visible = true; }
    if (mode === 'flash') { f.uSil.value = 1; f.uSilCol.value.copy(hexV(COL.cream)); h.uInk.value.copy(this.kl.inkHull); }
    if (mode === 'ink') { f.uSil.value = 1; f.uSilCol.value.copy(hexV(COL.ink)); h.uInk.value.copy(hexV(COL.cream)); this.kl.key.mesh.visible = this.kl.rim.mesh.visible = false; }
  }

  /**
   * @param e interpolated entity (pos, facing, anim, ...), @param dtAnim cat animation dt (sim-scaled),
   * @param t real seconds, @param tw "on twos" clock (seconds quantised to 1/30)
   */
  update(e, dtAnim, t, tw, dtReal) {
    const show = e.present && e.anim !== 'gone' && e.anim !== 'offstage' && e.anim !== 'yowl_offstage' && !this.hidden;
    this.root.visible = show;
    this.pos.set(...e.pos);
    if (dtReal > 0) this.vel.subVectors(this.pos, this.prevPos).divideScalar(Math.max(1e-3, dtReal));
    this.prevPos.copy(this.pos);
    this.root.position.copy(this.pos);
    const wantYaw = Math.atan2(e.facing[0], e.facing[1]);
    this.yaw = lerpAngle(this.yaw, wantYaw, Math.min(1, dtReal * 18));
    this.root.rotation.y = this.yaw;

    // base pose by sim anim
    const P = this.pose; let lean = 0, fwd = 0, sy = 1, sxz = 1, up = 0, roll = 0;
    const a = e.anim || 'idle', at = e.anim_t || 0;
    const speed = Math.hypot(this.vel.x, this.vel.z);
    if (a === 'run' || (speed > 0.4 && (a === 'idle' || a === 'skitter'))) this.cat.setGait('walk', Math.min(3.2, Math.max(1.2, speed)));
    else this.cat.setGait('idle', 0);
    const vy = this.vel.y;
    switch (a) {
      case 'brace': sy = 0.88; sxz = 1.06; lean = -0.12; break;
      case 'skitter': lean = -0.18; sy = 0.86; sxz = 1.1; roll = 0.0; break;
      case 'hop': case 'mantle': case 'pounce': case 'leap': case 'tagin': case 'drop': case 'fall': case 'climb':
        lean = THREE.MathUtils.clamp(-vy * 0.12, -0.6, 0.6); sy = 1 + Math.min(0.12, Math.abs(vy) * 0.03); sxz = 1 / Math.sqrt(sy); break;
      case 'knockback': lean = -0.4; fwd = -0.05; sy = 0.92; break;
      case 'flinch': lean = -0.22; break;
      case 'splat': case 'piled': sy = 0.42; sxz = 1.3; lean = 0; break;
      case 'frazzled': { const j = Math.floor(tw * 30) % 2; sy = 1.15; sxz = 1.15; roll = j ? 0.06 : -0.06; break; }
      case 'hiss': sy = 1.1; lean = -0.16; break;
      case 'windup_white': sy = 0.94; lean = -0.12; break;
      case 'windup_yellow': sy = 0.9; lean = -0.2; break;
      case 'windup_red': { const j = Math.floor(tw * 30) % 2; sy = 0.86; lean = -0.26; roll = j ? 0.035 : -0.035; break; }
      case 'break': { const j = Math.floor(tw * 15) % 2; roll = j ? 0.12 : -0.12; sy = 0.95; break; }
      case 'routed': sy = 0.9; sxz = 1.18; lean = 0.2; break;
      case 'drop_recover': case 'recover': sy = 0.95; break;
      case 'yowl': sy = 1.06; lean = -0.1; break;
      default: if (a.startsWith('move_')) { sy = 1.04; } break;
    }
    if (a === 'string' || a.startsWith('move_')) { /* strikes come from Hit/MoveUsed impulses */ }
    // impulses (on twos: quantised time)
    this.impulses = this.impulses.filter((im) => tw - im.t0 < im.dur);
    for (const im of this.impulses) {
      const k = (tw - im.t0) / im.dur;
      if (k < 0) continue;
      if (im.kind === 'strike') { const s = k < 0.35 ? ss(k / 0.35) : 1 - ss((k - 0.35) / 0.65); fwd += 0.28 * im.mag * s; lean += 0.22 * s; sxz *= 1 + 0.12 * s; sy *= 1 - 0.08 * s; }
      if (im.kind === 'hurt') { const s = 1 - ss(k); fwd -= 0.16 * im.mag * s; lean -= 0.3 * im.mag * s; sy *= 1 - 0.1 * s; }
      if (im.kind === 'take') { const s = k < 0.5 ? 1 : 1 - ss((k - 0.5) * 2); sy *= 1 + 0.14 * s; sxz *= 1 - 0.05 * s; }
      if (im.kind === 'hiss') { const s = Math.sin(Math.PI * k); sy *= 1 + 0.12 * s; lean -= 0.2 * s; }
      if (im.kind === 'land') { const s = 1 - ss(k); sy *= 1 - 0.2 * s; sxz *= 1 + 0.12 * s; }
    }
    if (e.ruffled_s > 0 || e.ruffled_s === -1) { sy *= 1.04; }
    P.position.set(0, up, fwd);
    P.rotation.set(lean, 0, roll);
    P.scale.set(sxz, sy, sxz);
    // keyline: Frazzle Magenta while Frazzled; the Ruffled rim pulses in two steps (≤ 3 Hz)
    if (this.kl) {
      const want = e.frazzled_s > 0 ? 'magenta' : (this.side === 'enemy' ? 'sage' : 'gold');
      if (want !== this.clowder) this.setClowder(want);
      const ruff = e.ruffled_s > 0 || e.ruffled_s === -1;
      this.kl.rim.mesh.userData.w = ruff ? (Math.floor(tw * 5) % 2 ? 1.0 : 2.2) : 1.0;
      this.kl.key.mesh.userData.w = e.controlled ? 1.25 : 1.0;
    }
    if (this.look !== 'ink') this.setLook(t < this.flashUntil ? 'flash' : 'normal');
    this.cat.update(dtAnim);
    // head point for overhead marks (world)
    const h = 0.62 * this.scaleK * sy;
    this.head.set(this.pos.x, this.pos.y + h, this.pos.z);
  }
}

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

/** Read an AI intent from motion: circle / stalk / flank (lateral or slow creep), posture (still, squared off),
 * retreat (backing off), dash_in (fast toward the opponent), else 'neutral'. opp = {dir:[x,z] unit, dist}. */
export function deriveIntent(e, vel, opp) {
  if (!opp || e.controlled || e.routed || opp.dist > 6.5) return 'neutral';
  const sp = Math.hypot(vel.x, vel.z); if (sp < 0.15) return opp.dist < 5 && opp.dist > 1.2 ? 'posture' : 'neutral';
  const along = (vel.x * opp.dir[0] + vel.z * opp.dir[1]) / sp;
  if (along > 0.6 && sp > 2.0) return 'dash_in';
  if (along < -0.5) return 'retreat';
  if (Math.abs(along) < 0.55) return opp.dist < 3.2 ? 'circle' : 'flank';
  return sp < 1.3 ? 'stalk' : 'neutral';
}

/**
 * THE cast mapping table: sim catalogue id -> render cast (src/render/cats/index.js contract) and the matching
 * kit portrait, so the 3D coat and the HUD plate are one design. Named cats use their own casts; gang members
 * use the generic 'tough' with coat/pattern/tail/ears/build/personality/rank, and repeated ids (Strays) take
 * the next variant, so no two gang members share a coat and none shares a Posse coat
 * (Posse: Mikan white+ginger, Hige grey, Pon calico, Kinako fawn point, Togemaru black-and-tan, Kagi silver tabby).
 * `rank` is the cast's own scale on top of the 1.25x art-bible scale (Captain 1.15, Daifuku 1.6, Pon 0.9).
 */
export const CAST_MAP = {
  mikan: { cast: 'mikan', rank: 1, kit: { coat: { base: '#FFF8EC', patch: '#F28C28' }, pattern: 'mikan', tail: 'pom', ears: 'standard', build: 'standard', collar: 'bell', eye: 'amber' } },
  hige: { cast: 'hige', rank: 1, kit: { coat: { base: '#8E93A8', patch: '#514D60' }, pattern: 'solid', tail: 'whip', ears: 'tall', build: 'long', carry: 'post', eye: 'yellowgreen', expr: 'sleepy', scars: ['notch'] } },
  pon: { cast: 'pon', rank: 0.9, kit: { coat: { base: '#FFF8EC', patch: '#C98A4A', patch2: '#514D60' }, pattern: 'patched', tail: 'plume', ears: 'round', build: 'round', carry: 'spring', eye: 'green', expr: 'happy', scars: ['fold'] } },
  kinako: { cast: 'kinako', rank: 1, kit: { coat: { base: '#E3C39A', patch: '#5E4636' }, pattern: 'pointed', tail: 'whip', ears: 'tall', build: 'long', carry: 'comma', eye: 'blue', expr: 'shock' } },
  togemaru: { cast: 'togemaru', rank: 1, kit: { coat: { base: '#37323F', white: '#D9A060', patch: '#D9A060' }, pattern: 'tuxedo', tail: 'plume', ears: 'standard', build: 'long', carry: 'flag', eye: 'yellowgreen', expr: 'smug', scars: ['notch'] } },
  kagi: { cast: 'kagi', rank: 1.15, kit: { coat: { base: '#CDD1DC', patch: '#7D8397' }, pattern: 'tabby', tail: 'whip', ears: 'tall', build: 'long', carry: 'blade', eye: 'yellowgreen', expr: 'smug' } },
  daifuku: { cast: 'daifuku', rank: 1.6, extra: 1.35, kit: { coat: { base: '#FFF8EC', patch: '#A9AEC0' }, pattern: 'saddle', tail: 'stub', ears: 'round', build: 'round', carry: 'anchor', eye: 'copper', expr: 'smug' } },
  goma: { cast: 'tough', opts: { coat: 'chocolate', pattern: 'tabby', tail: 'ringed', ears: 'round', build: 'round', personality: 'brooder', rank: 1.08, eye: 'copper', seed: 11 } },
  sasa: { cast: 'tough', opts: { coat: { base: 'cream', patch: '#C99A55' }, pattern: 'tabby', tail: 'plume', ears: 'tall', build: 'long', personality: 'schemer', eye: 'yellowgreen', seed: 12 } },
  stray: [
    { cast: 'tough', opts: { coat: { base: 'charcoal', white: 'white' }, pattern: 'bicolour', tail: 'stub', ears: 'standard', build: 'standard', personality: 'stalwart', seed: 21 } },
    { cast: 'tough', opts: { coat: 'marmalade', pattern: 'solid', tail: 'whip', ears: 'standard', build: 'standard', personality: 'fraidy', eye: 'green', seed: 22 } },
    { cast: 'tough', opts: { coat: { base: 'seal', patch: 'black' }, pattern: 'tabby', tail: 'whip', ears: 'tall', build: 'long', personality: 'goofball', seed: 23 } },
    { cast: 'tough', opts: { coat: { base: 'black', white: 'white' }, pattern: 'bicolour', tail: 'plume', ears: 'round', build: 'round', personality: 'brooder', seed: 24 } },
  ],
  challenger: { cast: 'tough', opts: { coat: { base: 'marmalade', patch: '#8C5A2E' }, pattern: 'tabby', tail: 'plume', ears: 'standard', build: 'long', personality: 'braggart', eye: 'amber', rank: 1.05, seed: 31 } },
  captain: { cast: 'tough', opts: { coat: { base: 'chocolate', white: 'white', patch: 'chocolate' }, pattern: 'saddle', tail: 'plume', ears: 'tall', build: 'long', personality: 'braggart', rank: 1.15, seed: 41 } },
};
const KITCOAT = { white: '#FFF8EC', cream: '#F4DDAA', silver: '#CDD1DC', grey: '#8E93A8', charcoal: '#514D60', black: '#37323F', marmalade: '#C98A4A', chocolate: '#7C5438', fawn: '#E3C39A', seal: '#5E4636' };
const PERS_CARRY = { braggart: 'flag', stalwart: 'post', goofball: 'spring', schemer: 'blade', brooder: 'anchor', fraidy: 'comma' };
const used = new Map();
/** Resolve the cast entry for a sim entity (variants for repeated catalogue ids, in creation order). */
export function castFor(catId, entId) {
  let m = CAST_MAP[catId] || { cast: 'tough', opts: { coat: 'grey', pattern: 'tabby', seed: 99 } };
  if (Array.isArray(m)) { const k = `${catId}`; const list = used.get(k) || []; let i = list.indexOf(entId); if (i < 0) { list.push(entId); used.set(k, list); i = list.length - 1; } m = m[i % m.length]; }
  if (!m.kit && m.opts) {
    const o = m.opts, coat = typeof o.coat === 'string' ? { base: KITCOAT[o.coat] || o.coat } : Object.fromEntries(Object.entries(o.coat).map(([k, v]) => [k, KITCOAT[v] || v]));
    m = { ...m, rank: o.rank || 1, kit: { coat, pattern: o.pattern, tail: o.tail, ears: o.ears, build: o.build, carry: PERS_CARRY[o.personality] || 'anchor', eye: o.eye || 'copper', expr: 'angry' } };
  }
  return m;
}
/** Kit portrait options for an entity (same table as the 3D cast). */
export function portraitFor(catId, entId) { return castFor(catId, entId).kit; }

const hexV = (h) => { const n = parseInt(h.slice(1), 16); return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
export const COL = { ink: '#33273B', cream: '#FFF6E3', gold: '#F2B01E', sage: '#A8C878', magenta: '#FF3D8B', red: '#E2453F' };

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

/** Dither-fade (M1.2 §6): patch a cat material with an ordered-Bayer discard driven by its own uFade (1 = solid).
 * Screen-space and static, so a fading cat never shimmers; never a half-transparent blend. */
function ditherPatch(m) {
  if (!m || !m.isShaderMaterial || m.userData.dither) return m;
  m.uniforms.uFade = { value: 1 };
  const fn = 'uniform float uFade; float ditherB4(vec2 p){ ivec2 i = ivec2(mod(p, 4.0)); int b[16] = int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(b[i.y * 4 + i.x]) + 0.5) / 16.0; }\n';
  const src = m.fragmentShader, k = src.lastIndexOf('void main');
  if (k < 0) return m;
  const open = src.indexOf('{', k) + 1;
  m.fragmentShader = src.slice(0, k) + fn + src.slice(k, open) + ' if (uFade < 0.999 && ditherB4(gl_FragCoord.xy) > uFade) discard; ' + src.slice(open);
  m.userData.dither = true; m.needsUpdate = true;
  return m;
}

const ss = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const lerpAngle = (a, b, k) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;

export class Fighter {
  constructor(ent, o = {}) {
    this.id = ent.id; this.side = ent.side; this.catId = ent.cat;
    const m = castFor(ent.cat, ent.id);
    // `extra`: the Boss reads as the heavyweight (art bible's biggest build) on top of his cast rank
    this.cat = createCat({ cast: m.cast, scale: 1.25 * (m.extra || 1), ...(m.opts || {}), lod: 'auto' });
    this.scaleK = (m.rank || 1) * (m.extra || 1); this.lodMode = 'auto';
    this.root = new THREE.Group(); this.pose = new THREE.Group();
    this.root.add(this.pose); this.pose.add(this.cat.object3D);
    this.root.name = 'fighter:' + ent.id;
    this.kl = addKeyline(this.cat, o.rim !== false);
    this.setClowder(ent.side === 'enemy' ? 'red' : 'gold');   // M1.2 §5: allies yellow, enemies red
    this.yaw = Math.atan2(ent.facing[0], ent.facing[1]);
    this.prevPos = new THREE.Vector3(...ent.pos); this.pos = this.prevPos.clone(); this.vel = new THREE.Vector3();
    this.impulses = []; this.look = 'normal'; this.flashUntil = 0; this.hidden = false; this.routedAt = null; this.boltDir = [0, 1];
    this.head = new THREE.Vector3();
    this.fade = 1; this.fadeTarget = 1; this.ditherMats = [];
    this.root.traverse((o) => { if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m.isShaderMaterial) this.ditherMats.push(ditherPatch(m)); });
  }
  /** Ease the dither fade toward `k` (0..1); steps on twos (quantised to 8 levels). */
  stepFade(dt) {
    this.fade += Math.sign(this.fadeTarget - this.fade) * Math.min(Math.abs(this.fadeTarget - this.fade), dt * 4);
    const q = Math.round(this.fade * 8) / 8;
    for (const m of this.ditherMats) if (m.uniforms.uFade) m.uniforms.uFade.value = q;
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
    if (e.pos.every(Number.isFinite)) this.pos.set(...e.pos);   // a non-finite sim position (seen once at a Daifuku FinalKO) keeps the last good one
    if (dtReal > 0) this.vel.subVectors(this.pos, this.prevPos).divideScalar(Math.max(1e-3, dtReal));
    this.prevPos.copy(this.pos);
    this.root.position.copy(this.pos);
    // AI intent (M1.1 §4): the sim's `intent` when it publishes one, else read from motion vs the nearest opponent
    const SIM_INTENT = { cornered: 'posture', circle: 'circle', posture: 'posture', flank: 'flank', dash_in: 'dash_in', retreat: 'retreat', feint: 'feint', strut: 'strut', hold: 'hold', sidestep: 'circle', stalk: 'stalk', pace: 'stalk', attack: 'neutral', ground: 'neutral' };
    // the sim's intent when it is specific; its default 'stalk' (or none) is refined from motion
    const intent = this.intent = (e.intent && SIM_INTENT[e.intent]) || deriveIntent(e, this.vel, e._opp);
    // cats square off: while circling, stalking, posturing or backing off, the body faces the opponent
    let wantYaw = e.facing.every(Number.isFinite) ? Math.atan2(e.facing[0], e.facing[1]) : this.yaw;
    if (e._opp && ['circle', 'stalk', 'posture', 'flank', 'retreat', 'strut', 'hold', 'feint'].includes(intent)) wantYaw = Math.atan2(e._opp.dir[0], e._opp.dir[1]);
    this.yaw = lerpAngle(this.yaw, wantYaw, Math.min(1, dtReal * 9));
    this.root.rotation.y = this.yaw;

    // base pose by sim anim
    const P = this.pose; let lean = 0, fwd = 0, sy = 1, sxz = 1, up = 0, roll = 0, sz = 1;
    const a = e.anim || 'idle', at = e.anim_t || 0;
    const speed = Math.hypot(this.vel.x, this.vel.z);
    // move-out gradient: after an attack the walk cadence ramps up over ~0.25 s instead of snapping
    const attacking = a === 'string' || a === 'atk' || a === 'charge' || a.startsWith('move_');
    if (e.can_move != null) this.walkRamp = e.can_move;   // the sim's move-out gradient (0 in startup/hit/early recovery, ramps to 1)
    else if (attacking) this.walkRamp = 0; else this.walkRamp = Math.min(1, (this.walkRamp ?? 1) + dtReal * 4);
    const stalkSlow = ['circle', 'stalk', 'flank', 'retreat'].includes(intent) ? 0.75 : 1;
    if (speed > 0.25 && (!attacking || this.walkRamp > 0.05) && a !== 'skitter') this.cat.setGait('walk', Math.min(3.2, Math.max(0.9, speed * stalkSlow)) * (0.35 + 0.65 * this.walkRamp));
    else this.cat.setGait('idle', 0);
    const vy = this.vel.y;
    switch (a) {
      case 'brace': sy = 0.88; sxz = 1.06; lean = -0.12; break;
      case 'dash': sz = 1.3; sy = 0.86; lean = 0.25; break;
      case 'skitter': lean = -0.18; sy = 0.86; sxz = 1.1; roll = 0.0; break;
      case 'hop': case 'mantle': case 'pounce': case 'leap': case 'tagin': case 'drop': case 'fall': case 'climb':
        lean = THREE.MathUtils.clamp(-vy * 0.12, -0.6, 0.6); sy = 1 + Math.min(0.12, Math.abs(vy) * 0.03); sxz = 1 / Math.sqrt(sy); break;
      case 'knockback': lean = -0.4; fwd = -0.05; sy = 0.92; break;
      case 'flinch': lean = -0.22; break;
      case 'splat': case 'piled': case 'knocked_down': case 'knockdown': sy = 0.42; sxz = 1.3; lean = 0; break;
      case 'evade': lean = -0.18; sy = 0.86; sxz = 1.1; break;
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
    // intent postures (cats squaring off): low creep while circling/stalking/flanking, the arched-back puff while
    // posturing (tail lash and hiss glyphs come from the entry), stretched dash-in, crouched back-off
    if (a === 'idle' || a === 'run') {
      if (intent === 'posture') { const j = Math.floor(tw * 6) % 2; sy *= 1.13; sxz *= 1.07; lean -= 0.14; roll += j ? 0.025 : -0.025; }
      else if (intent === 'circle' || intent === 'stalk' || intent === 'flank') { sy *= 0.86; sxz *= 1.05; lean += 0.1; roll += (e._side || 1) * 0.05; }
      else if (intent === 'retreat') { sy *= 0.84; lean -= 0.16; }
      else if (intent === 'dash_in') { sz *= 1.22; sy *= 0.9; lean += 0.22; }
      else if (intent === 'strut') { const j = Math.floor(tw * 4) % 2; sy *= 1.08; lean -= 0.1; roll += j ? 0.04 : -0.04; }   // Braggart: chest out, swaggering
      else if (intent === 'hold') { sy *= 0.94; sxz *= 1.05; }                                                              // Stalwart: planted
      else if (intent === 'feint') { const j = Math.floor(tw * 8) % 2; fwd += j ? 0.08 : -0.02; lean += j ? 0.12 : -0.05; }
    }
    // anticipation: the attack anim's first frames coil back (light: 2 frames; heavy / Moves: longer wind-up)
    if (a.startsWith('move_') && this.lastAnim !== a) this.impulse('coil', tw, { dur: 0.3 });
    if (a === 'charge') { const ch = (e.attack && e.attack.charge) || 0; sy *= 1 - 0.18 * ch; sxz *= 1 + 0.08 * ch; lean -= 0.12 * ch; roll += (Math.floor(tw * 30) % 2 ? 0.02 : -0.02) * ch; }
    this.lastAnim = a;
    // impulses (on twos: quantised time)
    this.impulses = this.impulses.filter((im) => tw - im.t0 < im.dur);
    for (const im of this.impulses) {
      const k = (tw - im.t0) / im.dur;
      if (k < 0) continue;
      if (im.kind === 'strike') { // stretched lunge (>= 1.4x along the strike on the key drawing), then settle
        const s = k < 0.3 ? ss(k / 0.3) : 1 - ss((k - 0.3) / 0.7); fwd += 0.34 * im.mag * s; lean += 0.28 * s; sz *= 1 + 0.42 * im.mag * s; sxz *= 1 - 0.1 * s; sy *= 1 - 0.14 * s; }
      if (im.kind === 'hurt') { const s = 1 - ss(k); fwd -= 0.2 * im.mag * s; lean -= 0.36 * im.mag * s; sy *= 1 - 0.16 * im.mag * s; sxz *= 1 + 0.1 * im.mag * s; roll += (Math.floor(tw * 30) % 2 ? 0.08 : -0.08) * s * im.mag; }
      if (im.kind === 'take') { const s = k < 0.5 ? 1 : 1 - ss((k - 0.5) * 2); sy *= 1 + 0.14 * s; sxz *= 1 - 0.05 * s; }
      if (im.kind === 'hiss') { const s = Math.sin(Math.PI * k); sy *= 1 + 0.12 * s; lean -= 0.2 * s; }
      if (im.kind === 'coil') { // anticipation: light = a 1-2 frame twitch; heavy (mag 2) = a readable crouch-and-rear, held, then released
        const s = im.mag > 1.5 ? (k < 0.75 ? ss(k / 0.75) : 1 - ss((k - 0.75) / 0.25)) : Math.sin(Math.PI * Math.min(1, k));
        fwd -= 0.07 * s * im.mag; lean -= 0.16 * s * im.mag; sy *= 1 - 0.1 * s * Math.min(1.6, im.mag); sxz *= 1 + 0.05 * s * im.mag;
        if (im.mag > 1.5) roll += (Math.floor(tw * 30) % 2 ? 0.015 : -0.015) * s; }
      if (im.kind === 'land') { const s = 1 - ss(k); sy *= 1 - 0.2 * s; sxz *= 1 + 0.12 * s; }
    }
    if (e.ruffled_s > 0 || e.ruffled_s === -1) { sy *= 1.04; }
    // follow-through: the pose chases its target through a damped spring (weight; overshoot settles in ~0.25 s)
    const S = this.spring || (this.spring = { v: [0, 0, 0, 0, 0, 0], x: [fwd, lean, roll, sy, sxz, sz] });
    const tgt = [fwd, lean, roll, sy, sxz, sz], k = 240, c = 22, hs = Math.min(dtReal, 1 / 30);
    for (let i = 0; i < 6; i++) { const acc = k * (tgt[i] - S.x[i]) - c * S.v[i]; S.v[i] += acc * hs; S.x[i] += S.v[i] * hs; }
    // strikes stay snappy (hit on the first active frame): fwd and stretch use the target directly while striking
    const striking = this.impulses.some((im) => im.kind === 'strike' && (tw - im.t0) / im.dur < 0.3);
    const [ff, ll, rr, yy, xx, zz] = striking ? [fwd, lean, roll, sy, sxz, sz] : S.x;
    if (striking) { S.x = tgt.slice(); S.v = [0, 0, 0, 0, 0, 0]; }
    P.position.set(0, up, ff);
    P.rotation.set(ll, 0, rr);
    P.scale.set(xx, yy, xx * zz);
    // keyline: Frazzle Magenta while Frazzled; the Ruffled rim pulses in two steps (≤ 3 Hz)
    if (this.kl) {
      const want = this.side === 'enemy' ? 'red' : 'gold';   // the agreed side colours always; stagger reads from spirals and the ring
      if (want !== this.clowder) this.setClowder(want);
      const ruff = e.ruffled_s > 0 || e.ruffled_s === -1;
      this.kl.rim.mesh.userData.w = ruff ? (Math.floor(tw * 5) % 2 ? 1.0 : 2.2) : 1.0;
      this.kl.key.mesh.userData.w = e.controlled ? 1.25 : 1.0;
    }
    if (this.look !== 'ink') this.setLook(t < this.flashUntil ? 'flash' : 'normal');
    const want = e.controlled ? 'full' : (this.lodCap || 'auto');
    if (want !== this.lodMode && this.cat.setLod) { this.cat.setLod(want); this.lodMode = want; }
    this.cat.update(dtAnim);
    // head point for overhead marks (world)
    const h = 0.62 * this.scaleK * sy;
    this.head.set(this.pos.x, this.pos.y + h, this.pos.z);
  }
}

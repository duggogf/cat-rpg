// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Mikan's input model. M1.1 (design/reviews/owner-feedback/combat-m1.1-spec.md) as amended by M1.2
// (combat-m1.2-spec.md, NieR: Automata as the reference):
// - Five strings: L-L-L, L-L-L-H finisher, L-H launcher, hold-H charged heavy, Evade-L lunge.
// - A light is active on the next tick; heavies wind up.
// - The one-slot buffer accepts a press only in the last ~150 ms before an attack's chain point.
// - Reduced steering from an attack's first frame, full movement from 60% of its total animation.
// - One Evade (cooldown, i-frames) cancels any attack at any frame and keeps the combo.
// - A perfect evade (an enemy hit imminent) gives a slow-mo and a counter window.
import { norm, len, dist, clamp, closestOnSeg, inShape } from './geom.js';

const rowOf = (enc, id) => enc.D.strings[id];
const total = r => r.startup_s + r.active_s + r.recovery_s;

/** Fraction (0..1) of walk speed a cat may use now (exposed as `can_move`). */
export function canMoveFraction(enc, e) {
  const a = e.act, k = enc.k;
  if (!enc.standing(e) || e.splatT > 0 || e.flinchT > 0 || e.frazzledT > 0 || e.bracing) return 0;
  if (!a || a.kind === 'posture') return 1;
  if (a.kind === 'charge') return k.attack_steer;
  if (a.kind !== 'atk') return 0;
  return a.t >= k.move_out_from * total(rowOf(enc, a.id)) - 1e-9 ? 1 : k.attack_steer;
}

const free = (enc, c) => enc.standing(c) && c.splatT <= 0 && c.flinchT <= 0 && c.frazzledT <= 0 && (!c.act || c.act.kind === 'posture');
const comboAlive = (enc, c) => !!c.combo && enc.simT - c.combo.endT <= enc.k.combo_grace_s + 1e-9;

/** Handle one tick of the player's input for Mikan (fight mode, skill bar closed). */
export function playerInput(enc, c, inp) {
  const mv = inp.move ? norm(inp.move[0], inp.move[1]) : [0, 0];
  const mag = inp.move ? Math.min(1, len(inp.move[0], inp.move[1])) : 0;
  c.moveIntent = [mv[0] * mag, mv[1] * mag];
  c.stick = mag > 0.2 ? mv : null;
  const heavyHeld = !!inp.heavy;
  const heavyPress = heavyHeld && !c.heavyHeld, heavyRelease = !heavyHeld && c.heavyHeld;
  c.heavyHeld = heavyHeld;
  if (!enc.standing(c)) return;
  if (inp.aim && free(enc, c) && (inp.aim[0] || inp.aim[1])) { const [x, z] = norm(inp.aim[0], inp.aim[1]); c.fx = x; c.fz = z; }
  c.bracing = !!inp.brace && free(enc, c);
  const evade = inp.evade || inp.dodge || inp.skitter || inp.dash; // Space; the M1.1 names alias to it
  const a = c.act;
  if (evade) { tryEvade(enc, c, mv); return; }
  if (a?.kind === 'charge') {
    const HC = rowOf(enc, 'HC');
    if (heavyRelease || a.t >= HC.charge_max_s - 1e-9) {
      if (a.t < HC.charge_min_s) startAttack(enc, c, 'H');
      else startAttack(enc, c, 'HC', Math.min(1, a.t / HC.charge_max_s));
    }
    return;
  }
  if (inp.hop && free(enc, c)) { enc._hop(c, mv); return; }
  if (inp.hiss && free(enc, c)) { enc._hiss(c, 'player'); return; }
  const press = inp.light || inp.attack ? 'light' : heavyPress ? 'heavy' : null;
  if (press) handlePress(enc, c, press);
}

/** Evade (M1.2 §1-2): any time but knocked down or launched, cooldown permitting. Cancels any attack at any frame. */
function tryEvade(enc, c, mv) {
  const k = enc.k, E = k.evade;
  if (c.evadeCd > 1e-9) { enc._emit({ type: 'EvadeRejected', cat: c.id, cooldown_left_s: +c.evadeCd.toFixed(4) }); return; }
  if (c.splatT > 0 || c.frazzledT > 0 || c.act?.kind === 'launched') return;
  let [dx, dz] = mv; if (!dx && !dz) { dx = -c.fx; dz = -c.fz; }
  const a = c.act;
  // The combo survives: the next light continues from the last attack that landed.
  const last = a?.kind === 'atk' ? (a.hit ? a.id : a.prev) : comboAlive(enc, c) ? c.combo.lastId : null;
  c.buf = null;
  if (c.onHR) { enc._hop(c, [dx, dz]); return; }
  for (const hr of enc.hrs) { // evading into a High Road edge mantles
    const p = closestOnSeg(hr.a, hr.b, c), toward = (p.x - c.x) * dx + (p.z - c.z) * dz;
    if (len(c.x - p.x, c.z - p.z) <= k.mantle_reach_m && toward > 0) { enc._hop(c, [dx, dz]); return; }
  }
  c.act = { kind: 'evade', t: 0, dur: E.s, vx: dx * E.m / E.s, vz: dz * E.m / E.s, cancelled: a?.kind === 'atk' ? a.id : null };
  c.evadeCd = E.cooldown_s; c.flinchT = 0;
  c.combo = last ? { lastId: last, endT: enc.simT + E.s } : null;
  const perfect = perfectEvade(enc, c);
  enc._emit({ type: 'Evade', cat: c.id, cooldown_s: E.cooldown_s, cancelled: c.act.cancelled, combo_kept: last, perfect: !!perfect });
  if (perfect) {
    const P = k.perfect_evade;
    enc.slowMo = { scale: P.slow.scale, left: P.slow.ms / 1000 };
    c.counterUntil = enc.simT + P.counter_window_s; c.counterTarget = perfect;
    enc._emit({ type: 'PerfectEvade', cat: c.id, attacker: perfect, slow: { ...P.slow }, counter_window_s: P.counter_window_s });
  }
}

/** A hit is imminent: a telegraph on Mikan resolving within the window, or a shockwave front about to reach her. */
function perfectEvade(enc, c) {
  const W = enc.k.perfect_evade.window_s;
  for (const tl of enc.teles) {
    const left = tl.dur - (enc.simT - tl.t0);
    if (left > W + 1e-9) continue;
    if (tl.aimedAt === c.id || inShape(tl.shape, c, c.radius)) return tl.attackerId;
  }
  for (const h of enc.hazards || []) {
    const d = len(c.x - h.center[0], c.z - h.center[1]);
    if (d > h.r && d - h.r <= h.speed * W + h.width / 2 + c.radius) return h.attacker;
  }
  return null;
}

function handlePress(enc, c, kind) {
  const k = enc.k, a = c.act;
  c.pressTick = enc.tick;
  if (c.counterUntil != null && enc.simT <= c.counterUntil + 1e-9 && (!a || a.kind === 'evade' || a.kind === 'posture')) {
    c.counterUntil = null; startAttack(enc, c, 'CTR', 0, 0, c.counterTarget); return; // the perfect-evade counter
  }
  if (a?.kind === 'atk') {
    const r = rowOf(enc, a.id);
    if (a.t < r.chain_s - 1e-9) {
      if (a.t >= r.chain_s - k.input_buffer_s - 1e-9) { c.buf = kind; enc._emit({ type: 'InputBuffered', cat: c.id, input: kind, attack: a.id }); }
      else enc._emit({ type: 'InputDropped', cat: c.id, input: kind, attack: a.id });
      return;
    }
    startNext(enc, c, a.id, kind);
    return;
  }
  const afterEvade = a?.kind === 'evade' || (c.evadeEndT != null && enc.simT - c.evadeEndT <= k.evade.light_window_s + 1e-9 && free(enc, c));
  if (afterEvade) {
    if (comboAlive(enc, c) || (a?.kind === 'evade' && c.combo)) { startNext(enc, c, c.combo.lastId, kind, k.evade.m * 0.8); return; } // the string goes on, with a lunge
    if (kind === 'light') { startAttack(enc, c, 'DL'); return; }
  }
  if (!free(enc, c) && a?.kind !== 'evade') { enc._emit({ type: 'InputDropped', cat: c.id, input: kind, attack: a?.kind ?? null }); return; }
  if (comboAlive(enc, c)) { startNext(enc, c, c.combo.lastId, kind); return; }
  if (kind === 'light') startAttack(enc, c, 'L1');
  else c.act = { kind: 'charge', t: 0 };
}

function startNext(enc, c, fromId, kind, lunge = 0) {
  const nxt = rowOf(enc, fromId).next?.[kind] ?? (kind === 'light' ? 'L1' : null);
  if (!nxt) { if (kind === 'heavy') c.act = { kind: 'charge', t: 0 }; return; }
  startAttack(enc, c, nxt, 0, lunge, null, fromId);
}

/** Begin one of Mikan's strings. The press tick is the first tick, so a light (startup 0.02 s) is active on the next. */
export function startAttack(enc, c, id, charge = 0, lungeBonus = 0, targetId = null, prev = null) {
  c.buf = null; c.combo = null;
  const t = (targetId && enc.standing(enc.byId.get(targetId)) ? enc.byId.get(targetId) : null) || enc._meleeTarget(c, 3.0 + lungeBonus);
  let dir = c.stick || (t ? norm(t.x - c.x, t.z - c.z) : [c.fx, c.fz]);
  if (c.stick && t) { const tt = norm(t.x - c.x, t.z - c.z); if (tt[0] * c.stick[0] + tt[1] * c.stick[1] > 0.5) dir = tt; }
  if (t && !c.stick) dir = norm(t.x - c.x, t.z - c.z);
  if (dir[0] || dir[1]) { c.fx = dir[0]; c.fz = dir[1]; }
  c.act = { kind: 'atk', id, t: 0, hit: false, charge, targetId: t?.id ?? null, pressTick: c.pressTick ?? enc.tick, lunge: rowOf(enc, id).lunge_m + lungeBonus, prev };
  enc._emit({ type: 'AttackStart', cat: c.id, attack: id, charge: +charge.toFixed(3), target: t?.id ?? null, lunge_m: +c.act.lunge.toFixed(3) });
}

/** Advance Mikan's attack act by d seconds (called from Encounter._acts). */
export function atkTick(enc, e, a, d) {
  const k = enc.k, r = rowOf(enc, a.id), hitEnd = r.startup_s + r.active_s, end = total(r);
  if (!a.hit || a.t < hitEnd) { // step in during startup and the active frames
    const t = enc.byId.get(a.targetId);
    const room = t && enc.standing(t) ? dist(e, t) - e.radius - t.radius - 0.15 : Infinity;
    const step = Math.min(a.lunge / hitEnd * d, Math.max(0, room));
    if (step > 0) { e.x += e.fx * step; e.z += e.fz * step; }
  }
  if (!a.hit && a.t >= r.startup_s - 1e-9) {
    a.hit = true;
    enc._emit({ type: 'AttackActive', cat: e.id, attack: a.id, latency_ticks: enc.tick - a.pressTick });
    impact(enc, e, a, r);
  }
  // Steering: reduced from the first frame, full from 60% of the total animation (M1.2 §1, §3).
  const f = canMoveFraction(enc, e);
  if (f > 0 && e.moveIntent && (e.moveIntent[0] || e.moveIntent[1])) {
    const sp = k.move_speed_mps * f * d;
    e.x += e.moveIntent[0] * sp; e.z += e.moveIntent[1] * sp;
  }
  if (e.buf && a.t >= r.chain_s - 1e-9) { const b = e.buf; e.buf = null; startNext(enc, e, a.id, b); return; }
  if (a.t >= end - 1e-9) { e.act = null; e.combo = { lastId: a.id, endT: enc.simT }; }
}

function impact(enc, e, a, r) {
  const k = enc.k;
  const mv = r.mv_full ? r.mv + (r.mv_full - r.mv) * a.charge : r.mv;
  const fz = r.fz_full ? r.fz + (r.fz_full - r.fz) * a.charge : r.fz;
  const t = enc._meleeTarget(e, k.string_reach_m + 0.3);
  const kind = r.kind === 'finisher' ? 'finisher' : r.kind === 'heavy' ? 'heavy' : 'string';
  if (t && enc.standing(t) && enc._sameLevel(e, t)) {
    enc._face(e, t);
    const kb = r.knockback_m ? { m: r.knockback_m, source: 'heavy', dir: [e.fx, e.fz] } : null;
    enc._hit(e, t, { mv, fz, kind, attack: r.Name, authored: 'player', knockback: kb, launch: r.launch_s || 0 });
  } else enc._whiffOrProp(e, { targetId: a.targetId, authored: 'player' });
}

export function evadeTick(enc, e, a, d) {
  // Steerable like NieR: Automata (M1.3, owner C12): the stick pivots the dash within it, at a limited turn rate.
  // The speed is kept, so the distance (2 m), i-frames and cooldown do not change.
  const m = e.moveIntent;
  if (m && (m[0] || m[1]) && d > 0) {
    const sp = len(a.vx, a.vz), u = norm(a.vx, a.vz), st = norm(m[0], m[1]), beta = enc.k.evade.steer_per_s * d;
    const [ux, uz] = norm(u[0] + st[0] * beta, u[1] + st[1] * beta);
    if (ux || uz) { a.vx = ux * sp; a.vz = uz * sp; e.fx = ux; e.fz = uz; }
  }
  e.x += a.vx * d; e.z += a.vz * d;
  if (a.t >= a.dur - 1e-9) { e.act = null; e.evadeEndT = enc.simT; }
}

/** Tab (M1.2 §6): lock the nearest enemy; Tab again unlocks. */
export function lockOn(enc) {
  const c = enc.controlled;
  if (!c) return;
  if (enc.lockId) { enc.lockId = null; enc._emit({ type: 'LockTarget', target: null, locked: false }); return; }
  let best = null, bd = Infinity;
  for (const e of enc.enemies()) if (enc.standing(e)) { const dd = dist(c, e); if (dd < bd) { bd = dd; best = e; } }
  enc.lockId = best?.id ?? null;
  enc._emit({ type: 'LockTarget', target: enc.lockId, locked: !!enc.lockId });
}

/**
 * While locked, a mouse flick past a threshold switches to the next enemy on that side of the screen (M1.2 §6).
 * `right` is the camera's right vector on the ground plane; side is 'left' or 'right'.
 */
export function lockSwitch(enc, side, right) {
  const c = enc.controlled, cur = enc.byId.get(enc.lockId);
  if (!c || !cur) return;
  const fwd = norm(cur.x - c.x, cur.z - c.z), rv = right ? norm(right[0], right[1]) : [-fwd[1], fwd[0]];
  const sgn = side === 'left' ? -1 : 1;
  const lat = e => { const [x, z] = norm(e.x - c.x, e.z - c.z); return (x - fwd[0]) * rv[0] + (z - fwd[1]) * rv[1]; };
  const cands = enc.enemies().filter(e => enc.standing(e) && e !== cur && lat(e) * sgn > 1e-6).sort((p, q) => lat(p) * sgn - lat(q) * sgn || dist(c, p) - dist(c, q));
  if (!cands.length) return;
  enc.lockId = cands[0].id;
  enc._emit({ type: 'LockTarget', target: enc.lockId, locked: true, switched: side });
}

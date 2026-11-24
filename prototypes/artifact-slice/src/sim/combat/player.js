// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Mikan's input model (M1.1 spec §2-3; design/reviews/owner-feedback/combat-m1.1-spec.md): the player controls
// Mikan only. Five strings (L-L-L, L-L-L-H finisher, L-H launcher, hold-H charged heavy, Dash-L lunge), a one-slot
// buffer accepted only in the last ~150 ms before an attack's chain point, a light's first active frame within
// 3 ticks of the press, and a move-out gradient from ~60% of recovery. Pure functions over the Encounter.
import { norm, len, dist, clamp, inCone, closestOnSeg } from './geom.js';

const rowOf = (enc, id) => enc.D.strings[id];

/** Fraction (0..1) of normal movement a cat may use in its current state (exposed as `can_move`). */
export function canMoveFraction(enc, e) {
  const a = e.act;
  if (!enc.standing(e) || e.splatT > 0 || e.flinchT > 0 || e.frazzledT > 0 || e.bracing) return 0;
  if (!a || a.kind === 'posture') return 1;
  if (a.kind !== 'atk') return 0;
  const r = rowOf(enc, a.id), hitEnd = r.startup_s + r.active_s, end = hitEnd + r.recovery_s;
  let from = hitEnd + enc.k.move_out_from * r.recovery_s;
  if (r.commit_s) from = Math.max(from, hitEnd + r.commit_s);
  return clamp((a.t - from) / Math.max(1e-6, end - from), 0, 1);
}

/** May a dodge cancel the current state? (Any time after the hit; the heavy finisher commits first.) */
function canDodge(enc, c) {
  const a = c.act;
  if (!enc.standing(c) || c.splatT > 0 || c.frazzledT > 0) return false;
  if (!a || a.kind === 'posture' || a.kind === 'dash' || a.kind === 'charge') return true;
  if (a.kind !== 'atk') return false;
  const r = rowOf(enc, a.id), hitEnd = r.startup_s + r.active_s;
  return a.t >= hitEnd - 1e-9 && (!r.commit_s || a.t >= hitEnd + r.commit_s - 1e-9);
}

function free(enc, c) { return enc.standing(c) && c.splatT <= 0 && c.flinchT <= 0 && c.frazzledT <= 0 && (!c.act || c.act.kind === 'posture'); }

/** Handle one tick of the player's input for Mikan (fight mode, skill bar closed). */
export function playerInput(enc, c, inp) {
  const k = enc.k;
  const mv = inp.move ? norm(inp.move[0], inp.move[1]) : [0, 0];
  const mag = inp.move ? Math.min(1, len(inp.move[0], inp.move[1])) : 0;
  c.moveIntent = [mv[0] * mag, mv[1] * mag];
  c.stick = mag > 0.2 ? mv : null;
  const heavyHeld = !!inp.heavy;
  const heavyPress = heavyHeld && !c.heavyHeld, heavyRelease = !heavyHeld && c.heavyHeld;
  c.heavyHeld = heavyHeld;
  if (!enc.standing(c)) return;
  const a = c.act;
  if (inp.aim && free(enc, c) && (inp.aim[0] || inp.aim[1])) { const [x, z] = norm(inp.aim[0], inp.aim[1]); c.fx = x; c.fz = z; }
  c.bracing = !!inp.brace && free(enc, c);

  // Holding heavy from neutral charges; release (or the cap) fires H or the charged heavy.
  if (a?.kind === 'charge') {
    const HC = rowOf(enc, 'HC');
    if (inp.dodge || inp.skitter) { c.act = null; enc._skitter(c, mv); return; }
    if (heavyRelease || a.t >= HC.charge_max_s - 1e-9) {
      if (a.t < HC.charge_min_s) startAttack(enc, c, 'H');
      else startAttack(enc, c, 'HC', Math.min(1, a.t / HC.charge_max_s));
    }
    return;
  }
  if (inp.dodge || inp.skitter) { if (canDodge(enc, c)) { c.combo = null; c.buf = null; enc._skitter(c, mv); } return; }
  if (inp.dash) { if (free(enc, c) || canDodge(enc, c)) startDash(enc, c, mv); return; }
  if (inp.hop && free(enc, c)) { enc._hop(c, mv); return; }
  if (inp.hiss && free(enc, c)) { enc._hiss(c, 'player'); return; }
  const press = inp.light || inp.attack ? 'light' : heavyPress ? 'heavy' : null;
  if (press) handlePress(enc, c, press);
}

function handlePress(enc, c, kind) {
  const k = enc.k, a = c.act;
  c.pressTick = enc.tick;
  if (a?.kind === 'atk') {
    const r = rowOf(enc, a.id);
    if (a.t < r.chain_s - 1e-9) {
      // One-slot buffer: only in the last input_buffer_s before the chain point; earlier presses are dropped.
      if (a.t >= r.chain_s - k.input_buffer_s - 1e-9) { c.buf = kind; enc._emit({ type: 'InputBuffered', cat: c.id, input: kind, attack: a.id }); }
      else enc._emit({ type: 'InputDropped', cat: c.id, input: kind, attack: a.id });
      return;
    }
    startNext(enc, c, a.id, kind);
    return;
  }
  if (a?.kind === 'dash' || (kind === 'light' && c.dashEndT != null && enc.simT - c.dashEndT <= k.dash.light_window_s + 1e-9 && free(enc, c))) {
    if (kind === 'light') { startAttack(enc, c, 'DL'); return; }
  }
  if (!free(enc, c)) { enc._emit({ type: 'InputDropped', cat: c.id, input: kind, attack: a?.kind ?? null }); return; }
  if (c.combo && enc.simT - c.combo.endT <= k.combo_grace_s + 1e-9) { startNext(enc, c, c.combo.lastId, kind); return; }
  if (kind === 'light') startAttack(enc, c, 'L1');
  else c.act = { kind: 'charge', t: 0 };
}

function startNext(enc, c, fromId, kind) {
  const nxt = rowOf(enc, fromId).next?.[kind] ?? (kind === 'light' ? 'L1' : null);
  if (!nxt) { if (kind === 'heavy' && !c.act) c.act = { kind: 'charge', t: 0 }; return; }
  startAttack(enc, c, nxt);
}

/** Begin one of Mikan's strings. The first tick of the attack is the press tick, so a light is active on tick 3. */
export function startAttack(enc, c, id, charge = 0) {
  const r = rowOf(enc, id);
  c.buf = null; c.combo = null;
  const t = enc._meleeTarget(c, 3.0);
  let dir = c.stick || (t ? norm(t.x - c.x, t.z - c.z) : [c.fx, c.fz]);
  if (c.stick && t) { const tt = norm(t.x - c.x, t.z - c.z); if (tt[0] * c.stick[0] + tt[1] * c.stick[1] > 0.5) dir = tt; } // steer toward the stick, snap to a target near it
  if (dir[0] || dir[1]) { c.fx = dir[0]; c.fz = dir[1]; }
  c.act = { kind: 'atk', id, t: 0, hit: false, charge, targetId: t?.id ?? null, pressTick: c.pressTick ?? enc.tick };
  enc._emit({ type: 'AttackStart', cat: c.id, attack: id, charge: +charge.toFixed(3), target: t?.id ?? null });
}

function startDash(enc, c, mv) {
  const k = enc.k;
  let [dx, dz] = mv; if (!dx && !dz) { dx = c.fx; dz = c.fz; }
  if (c.onHR) { enc._hop(c, [dx, dz]); return; }
  for (const hr of enc.hrs) { // dashing into a High Road edge mantles (Hop has no key in M1.1)
    const p = closestOnSeg(hr.a, hr.b, c), toward = (p.x - c.x) * dx + (p.z - c.z) * dz;
    if (len(c.x - p.x, c.z - p.z) <= k.mantle_reach_m && toward > 0) { enc._hop(c, [dx, dz]); return; }
  }
  c.act = { kind: 'dash', t: 0, dur: k.dash.s, vx: dx * k.dash.m / k.dash.s, vz: dz * k.dash.m / k.dash.s };
  c.fx = dx; c.fz = dz; c.combo = null;
  enc._emit({ type: 'Dash', cat: c.id });
}

/** Advance Mikan's attack act by d seconds (called from Encounter._acts). */
export function atkTick(enc, e, a, d) {
  const r = rowOf(enc, a.id), hitEnd = r.startup_s + r.active_s, end = hitEnd + r.recovery_s;
  // Step forward during startup and active frames (light strings step in and steer toward the stick).
  if (!a.hit || a.t < hitEnd) {
    const t = enc.byId.get(a.targetId);
    const room = t && enc.standing(t) ? dist(e, t) - e.radius - t.radius - 0.15 : Infinity;
    const step = Math.min(r.lunge_m / hitEnd * d, Math.max(0, room));
    if (step > 0) { e.x += e.fx * step; e.z += e.fz * step; }
  }
  if (!a.hit && a.t >= r.startup_s - 1e-9) {
    a.hit = true;
    enc._emit({ type: 'AttackActive', cat: e.id, attack: a.id, latency_ticks: enc.tick - a.pressTick });
    impact(enc, e, a, r);
  }
  // Move-out gradient: the stick steers the tail of the recovery.
  const f = canMoveFraction(enc, e);
  if (f > 0 && e.moveIntent && (e.moveIntent[0] || e.moveIntent[1])) {
    const sp = enc.k.move_speed_mps * f * d;
    e.x += e.moveIntent[0] * sp; e.z += e.moveIntent[1] * sp;
  }
  if (e.buf && a.t >= r.chain_s - 1e-9) { const b = e.buf; e.buf = null; startNext(enc, e, a.id, b); return; }
  if (a.t >= end - 1e-9) { e.act = null; e.combo = { lastId: a.id, endT: enc.simT }; }
}

function impact(enc, e, a, r) {
  const k = enc.k;
  const mv = r.mv_full ? r.mv + (r.mv_full - r.mv) * a.charge : r.mv;
  const fz = r.fz_full ? r.fz + (r.fz_full - r.fz) * a.charge : r.fz;
  const reach = k.string_reach_m + (r.Name === 'DL' ? 0.6 : 0.2);
  const t = enc._meleeTarget(e, reach);
  const kind = r.kind === 'finisher' ? 'finisher' : r.kind === 'heavy' ? 'heavy' : 'string';
  if (t && enc.standing(t) && enc._sameLevel(e, t)) {
    enc._face(e, t);
    const kb = r.knockback_m ? { m: r.knockback_m, source: r.knockoff_source || 'heavy', dir: [e.fx, e.fz] } : null;
    enc._hit(e, t, { mv, fz, kind, attack: r.Name, authored: 'player', knockback: kb, launch: r.launch_s || 0 });
  } else enc._whiffOrProp(e, { targetId: a.targetId, authored: 'player' });
}

export function dashTick(enc, e, a, d) {
  e.x += a.vx * d; e.z += a.vz * d;
  if (a.t >= a.dur - 1e-9) { e.act = null; e.dashEndT = enc.simT; }
}

/** Tab (M1.1 §1): lock the nearest enemy; again: lock the new nearest if it changed, otherwise unlock. */
export function lockOn(enc) {
  const c = enc.controlled;
  if (!c) return;
  let best = null, bd = Infinity;
  for (const e of enc.enemies()) if (enc.standing(e)) { const dd = dist(c, e); if (dd < bd) { bd = dd; best = e; } }
  const prev = enc.lockId;
  enc.lockId = !prev ? best?.id ?? null : best && best.id !== prev ? best.id : null;
  enc._emit({ type: 'LockTarget', target: enc.lockId, locked: !!enc.lockId });
}

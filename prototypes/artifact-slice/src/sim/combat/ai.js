// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// AI decisions: Posse cats by personality (Combat §3.11), the allied guest (§3.14), enemies with attack
// tokens and telegraphs (§3.12) and Daifuku on his wall (§3.13). Each actor draws only from its own RNG
// substream, and an enemy's inputs never include Posse membership or the guest's identity (G4, G7).
import { dist, len, norm, inShape, closestOnSeg } from './geom.js';

const RANK_ORDER = { boss: 4, captain: 3, tough: 2, stray: 1, crow: 0, posse: 0 };

/* ------------------------------------------------------------------ Posse and guest */

export function posseThink(enc, e) {
  const k = enc.k, P = e.pers, rng = e.aiStream;
  if (!e.present || enc.mode !== 'fight') return;
  if (!enc._canAct(e) || (e.act && e.act.kind === 'string')) return;
  e.goal = null; e.ai.faceId = null;
  e.ai.avengeT = Math.max(0, e.ai.avengeT - e.edt);
  e.ai.rollWait = Math.max(0, e.ai.rollWait - e.edt);
  e.ai.moveGap = Math.max(0, (e.ai.moveGap || 0) - e.edt);

  // 1. React to telegraphs aimed at itself (AI Hisses only yellows aimed at itself, CX-8).
  let bracing = false;
  for (const tl of enc.teles) {
    const inRed = tl.cls === 'red' && inShape(tl.shape, e, e.radius);
    if (tl.aimedAt !== e.id && !inRed) continue;
    const left = tl.dur - (enc.simT - tl.t0);
    const a = enc.byId.get(tl.attackerId);
    if (tl.cls === 'yellow' && tl.aimedAt === e.id && e.hissCd <= 0 && a && dist(e, a) <= k.hiss_reach_m && left <= 0.45) { enc._face(e, a); enc._hiss(e, 'ai'); return; }
    if (left > 0.3) continue;
    if (!(tl.id in e.ai.decided)) {
      e.ai.decided[tl.id] = tl.cls === 'red' ? 'skitter' : rng.chance(P.white_dodge_p) ? 'skitter' : rng.chance(P.brace_p) ? 'brace' : 'none';
    }
    const dec = e.ai.decided[tl.id];
    if (dec === 'skitter') {
      const from = tl.shape.type === 'circle' ? { x: tl.shape.center[0], z: tl.shape.center[1] } : a || { x: e.x - e.fx, z: e.z - e.fz };
      let away = norm(e.x - from.x, e.z - from.z); if (!away[0] && !away[1]) away = [-e.fx, -e.fz];
      enc._skitter(e, away); return;
    }
    if (dec === 'brace' && a) { enc._face(e, a); bracing = true; }
  }
  if (bracing) { e.bracing = true; return; }
  e.bracing = false;
  for (const id in e.ai.decided) if (!enc.teles.some(t => String(t.id) === id)) delete e.ai.decided[id];

  // 2. Target set: Kin exclusion (OR-05), Old Boss exclusion while Cowed by nerves (OR-06).
  const opp = enc.opponentsOf(e).filter(x => x.present);
  let cands = opp.filter(x => !(e.row.kin_ids || []).includes(x.cat));
  if (e.status?.kind === 'cowed' && e.status.src === 'nerves') cands = cands.filter(x => x.cat !== e.row.old_boss_id);
  if (!opp.length) return;
  if (!cands.length) { // its Kin or its Old Boss is the only opponent: posture at 4-6 m and Brace
    const near = opp.slice().sort((p, q) => dist(e, p) - dist(e, q))[0];
    hold(enc, e, near, (k.kin_posture_m[0] + k.kin_posture_m[1]) / 2);
    if (dist(e, near) < k.kin_posture_m[1] + 0.5) { e.bracing = true; enc._face(e, near); }
    return;
  }
  e.ai.retarget -= e.edt;
  let t = enc.byId.get(e.ai.targetId);
  if (!t || !cands.includes(t) || e.ai.retarget <= 0) {
    t = pickTarget(enc, e, cands);
    e.ai.targetId = t.id; e.ai.retarget = P.target === 'props_or_random2' ? 3 : 0.5;
  }

  // 3. Goofball: go for a prop that would catch an enemy (6 m).
  if (P.target === 'props_or_random2') {
    const prop = enc.props.find(p => p.usesLeft > 0 && len(p.x - e.x, p.z - e.z) <= k.ai_prop_m && opp.some(x => x.y < 0.5 && len(x.x - p.x, x.z - p.z) <= p.splash_m));
    if (prop && e.ai.cd <= 0 && e.y < 0.5) {
      if (len(prop.x - e.x, prop.z - e.z) <= k.string_reach_m + prop.radius - 0.2) { e.fx = norm(prop.x - e.x, prop.z - e.z)[0]; e.fz = norm(prop.x - e.x, prop.z - e.z)[1]; enc._startString(e, 'ai', false); e.act.targetId = null; e.ai.cd = postureTime(enc, e); return; }
      e.goal = { x: prop.x, z: prop.z, stopAt: k.string_reach_m + prop.radius - 0.4 }; return;
    }
  }

  // 4. Paw habit: auto Pay-offs / support only, never the last Paw (Combat §3.11 base).
  if (tryPawHabit(enc, e, t)) return;

  // 5. High Road rule.
  if (t.onHR && !e.onHR) {
    const hr = enc.hr(t.onHR);
    const allowed = P.highroad === 'always' || (P.highroad === 'avenging' && e.ai.avengeId === t.id && e.ai.avengeT > 0);
    const room = !hr.boss_wall || enc._onWallCount(hr.id, e) < k.max_on_boss_wall;
    if (allowed && room) {
      const p = closestOnSeg(hr.a, hr.b, t);
      const foot = { x: p.x + hr.drop_side[0] * 0.6, z: p.z + hr.drop_side[1] * 0.6 };
      if (len(foot.x - e.x, foot.z - e.z) < 0.35) { e.ai.hrWait += e.edt; if (e.ai.hrWait >= k.ai_highroad_hop_delay_s) { e.ai.hrWait = 0; enc._hop(e, [0, 0]); } return; }
      e.goal = { ...foot, stopAt: 0.2 }; return;
    }
    // Cannot climb: wait below at the personality's distance.
    e.ai.hrWait = 0;
    const p = closestOnSeg(hr.a, hr.b, t);
    hold(enc, e, { x: p.x + hr.drop_side[0] * 2.5, z: p.z + hr.drop_side[1] * 2.5, radius: 0 }, 0.2);
    e.ai.faceId = t.id;
    return;
  }
  e.ai.hrWait = 0;
  if (e.onHR && !t.onHR) { enc._hop(e, [0, 0]); return; }

  // 6. Cadence: a full string at ~35% uptime, posture between strings.
  e.ai.cd -= e.edt;
  const reach = k.string_reach_m + t.radius;
  const wantsAttack = P.target !== 'avenge' || (e.ai.avengeId === t.id && e.ai.avengeT > 0);
  if (e.ai.cd <= 0 && wantsAttack) {
    if (dist(e, t) <= reach && enc._sameLevel(e, t)) { enc._face(e, t); enc._startString(e, 'ai', true); e.act.targetId = t.id; e.ai.cd = postureTime(enc, e); return; }
    e.goal = { x: t.x, z: t.z, stopAt: reach - 0.35 }; e.ai.faceId = t.id; return;
  }
  // Posture at the personality's distance band.
  const c = enc.controlled;
  if (P.target === 'guard_controlled' && c && c !== e) {
    const [dx, dz] = norm(t.x - c.x, t.z - c.z);
    e.goal = { x: c.x + dx * 1.4, z: c.z + dz * 1.4, stopAt: 0.3 }; e.ai.faceId = t.id; return;
  }
  if (P.target === 'rear_opportunist') { e.goal = { x: t.x - t.fx * 1.8, z: t.z - t.fz * 1.8, stopAt: 0.3 }; e.ai.faceId = t.id; return; }
  const band = P.target === 'avenge' && !(e.ai.avengeT > 0) ? P.band_m : P.target === 'keep_distance' || P.target === 'controlled_lock' ? P.band_m : [1.8, 2.6];
  hold(enc, e, t, (band[0] + band[1]) / 2);
  e.ai.faceId = t.id;
}

function postureTime(enc, e) {
  const k = enc.k, u = k.ai_attack_uptime;
  return k.string_cycle_s * (1 - u) / u * e.aiStream.range(0.8, 1.2);
}

/** Move to distance d from target t along the current bearing. */
function hold(enc, e, t, d) {
  let [dx, dz] = norm(e.x - t.x, e.z - t.z);
  if (!dx && !dz) { dx = 0; dz = 1; }
  e.goal = { x: t.x + dx * d, z: t.z + dz * d, stopAt: 0.3 };
}

function pickTarget(enc, e, cands) {
  const P = e.pers, k = enc.k, rng = e.aiStream;
  const nearest = (from, list) => list.slice().sort((a, b) => dist(from, a) - dist(from, b) || (a.id < b.id ? -1 : 1))[0];
  // Guest bias (OR-13): its own Rival while the Rival stands.
  if (e.side === 'guest') { const riv = cands.find(x => (e.row.rival_ids || []).includes(x.cat)); if (riv) return riv; }
  switch (P.target) {
    case 'biggest': return cands.slice().sort((a, b) => RANK_ORDER[b.rank] - RANK_ORDER[a.rank] || b.nerveMax - a.nerveMax || dist(e, a) - dist(e, b))[0];
    case 'avenge': { const a = enc.byId.get(e.ai.avengeId); return a && cands.includes(a) && e.ai.avengeT > 0 ? a : nearest(e, cands); }
    case 'rear_opportunist': { const op = cands.filter(x => (x.ruffledT > 0 || x.frazzledT > 0) && dist(e, x) <= (P.switch_m ?? 6)); return op.length ? nearest(e, op) : nearest(e, cands); }
    case 'guard_controlled': {
      const c = enc.controlled;
      const att = cands.find(x => enc.teles.some(t => t.attackerId === x.id && t.aimedAt === c?.id)) || cands.find(x => x.ai.tokenOn === c?.id);
      return att || nearest(c || e, cands);
    }
    case 'props_or_random2': { const two = cands.slice().sort((a, b) => dist(e, a) - dist(e, b)).slice(0, 2); return two.length > 1 ? rng.pick(two) : two[0]; }
    case 'controlled_lock': { const l = enc.byId.get(enc.lockId); return l && cands.includes(l) ? l : nearest(e, cands); }
    default: return nearest(e, cands);
  }
}

/** Combat §3.11 base rule, with Combat B-17: an AI cat keeps a Paw banked unless the rest of the Posse already banks one. */
function canAfford(enc, e, cost) {
  const k = enc.k, pts = cost * k.paw_points;
  if (e.paws < pts - 1e-9) return false;
  if (e.side === 'guest') return true; // a guest is never commanded, so it banks nothing for the conductor
  if (e.paws - pts >= k.paw_points - 1e-9) return true;
  const need = k.ai_last_paw_if_posse_paws;
  if (need == null) return false;
  const banked = enc.posse().filter(p => p !== e && enc.standing(p)).reduce((sum, p) => sum + Math.floor((p.paws - p.reserved) / k.paw_points), 0);
  return banked >= need;
}

function lowestAlly(enc, below) {
  const k = enc.k;
  const list = enc.allies().filter(a => !a.routed && a.nerve / a.nerveMax < below && a.healed < k.heal_cap * a.nerveMax - 1);
  return list.sort((a, b) => a.nerve / a.nerveMax - b.nerve / b.nerveMax || (a.id < b.id ? -1 : 1))[0] || null;
}

/** Is there a wall, prop, other enemy or the ring edge within `m` metres behind t, seen from e? (A Shoulder Check Splats.) */
function obstacleBehind(enc, e, t, m) {
  const [dx, dz] = norm(t.x - e.x, t.z - e.z);
  const far = { x: t.x + dx * m, z: t.z + dz * m };
  if (len(far.x - enc.ringC.x, far.z - enc.ringC.z) > enc.ringR) return true;
  for (const h of enc.halfPlanes) if ((far.x - h.point[0]) * h.normal[0] + (far.z - h.point[1]) * h.normal[1] < 0) return true;
  const onLine = o => { const vx = o.x - t.x, vz = o.z - t.z, along = vx * dx + vz * dz; return along > 0 && along <= m && Math.abs(vx * dz - vz * dx) <= 0.8; };
  return enc.props.some(onLine) || enc.enemies().some(o => o !== t && enc.standing(o) && onLine(o));
}

/** When a personality self-casts a Set-up (personalities.json self_setup). */
function setupWhen(enc, e, t, when, m) {
  const c = enc.controlled;
  switch (when) {
    case 'threatens_controlled': {
      if (!c || c === e) return false;
      const threat = t.ai.tokenOn === c.id || enc.teles.some(x => x.attackerId === t.id && x.aimedAt === c.id) || dist(t, c) <= 3;
      if (!threat) return false;
      if (m.splat_on_collision) return t.boss ? !!t.onHR && t.onHR === e.onHR : obstacleBehind(enc, e, t, enc.k.ai_setup_obstacle_m);
      return true;
    }
    case 'two_in_cone': {
      if (t.row.immune_status?.includes(m.creates)) return false;
      const dir = norm(t.x - e.x, t.z - e.z);
      const n = enc.opponentsOf(e).filter(x => x.present && enc._sameLevel(e, x) && inShape({ type: 'cone', origin: [e.x, e.z], dir, range: m.range, angle_deg: m.angle_deg || 90 }, x, x.radius)).length;
      return n >= 2 || (n >= 1 && (t.rankRow.leader || e.paws >= 2 * enc.k.paw_points - 1e-9));
    }
    case 'leader': return !!t.rankRow.leader && t.ruffledT <= 0;
    case 'frazzle_half': return t.fzg >= 50 && t.ruffledT <= 0 && t.frazzledT <= 0;
    default: return false;
  }
}

/**
 * Paw habit by personality (Combat §3.11 + personalities.json move_pref / self_setup): in preference order, the
 * cat looks for a support, Pay-off or Set-up Move whose condition holds and that it may afford, then casts it.
 */
function tryPawHabit(enc, e, t) {
  const k = enc.k, P = e.pers, D = enc.D;
  const guest = e.side === 'guest';
  if (e.ai.moveGap > 0) return false;
  for (const kind of P.move_pref || ['payoff']) {
    for (const id of e.moves) {
      const m = D.moves[id];
      if (!m || !canAfford(enc, e, m.cost) || e.moveCd[id] > 0) continue;
      if (guest && m.ai_use !== 'auto') continue; // a guest spends only on auto Pay-offs (§3.14)
      let tgt = null;
      if (kind === 'support' && m.ai_use === 'support') tgt = lowestAlly(enc, k.purr_ally_pct);
      else if (kind === 'payoff' && m.ai_use === 'support' && m.ai_payoff_ally_pct) {
        const cowedNear = enc.opponentsOf(e).some(x => x.status?.kind === 'cowed' && dist(x, e) <= k.cowed_heal_radius_m);
        if (cowedNear) tgt = lowestAlly(enc, m.ai_payoff_ally_pct);
      } else if (kind === 'payoff' && m.ai_use === 'auto') {
        if (m.pays_on.some(st => enc._hasState(t, st))) tgt = t;
      } else if (kind === 'setup' && m.role === 'setup') {
        const rule = (P.self_setup || []).find(r => r.move === id);
        if (rule && setupWhen(enc, e, t, rule.when, m)) tgt = t;
      }
      if (!tgt) continue;
      if (P.paw_habit === 'support_first' && kind !== 'support' && e.moves.some(x => D.moves[x]?.ai_use === 'support')) continue;
      if (!habitAllows(enc, e, m, tgt)) return false;
      if (tgt.side === 'enemy') {
        const reachHR = m.flags?.includes('reaches_high_road') || m.shape === 'ring';
        if (!reachHR && !enc._sameLevel(e, tgt)) continue;
        const range = m.shape === 'ring' ? Infinity : m.range + tgt.radius + 0.4;
        if (dist(e, tgt) > range) { e.goal = { x: tgt.x, z: tgt.z, stopAt: Math.max(0.5, m.range - 0.2) }; e.ai.faceId = tgt.id; return true; }
      }
      e.ai.moveGap = m.role === 'setup' ? k.ai_followup_gap_s : (P.move_gap_s ?? k.ai_move_gap_s);
      enc._startMove(e, id, tgt, 'ai');
      return true;
    }
  }
  return false;
}

function habitAllows(enc, e, m, t) {
  const P = e.pers, k = enc.k;
  switch (P.paw_habit) {
    case 'roll50':
      if (e.ai.rollWait > 0) return false;
      if (e.aiStream.chance(k.ai_goofball_p)) return true;
      e.ai.rollWait = k.ai_goofball_wait_s; return false;
    case 'avenge_target': return m.ai_use === 'support' || t.side !== 'enemy' || (e.ai.avengeId === t.id && e.ai.avengeT > 0);
    case 'frazzled': return m.ai_use === 'support' || t.side !== 'enemy' || t.frazzledT > 0 || m.role === 'setup';
    case 'attacker_of_controlled': { const c = enc.controlled; return m.ai_use === 'support' || !c || t.side !== 'enemy' || enc.teles.some(x => x.attackerId === t.id && x.aimedAt === c.id) || t.ai.tokenOn === c.id || dist(t, c) <= 4; }
    default: return true; // first_chance, base, support_first fallback
  }
}

/* ------------------------------------------------------------------ enemies */

function tokenCap(enc, c) { return c.id === enc.controlledId ? enc.diff.tokens_controlled : enc.k.tokens_ai; }

function acquireToken(enc, e) {
  const k = enc.k;
  const cands = enc.opponentsOf(e).filter(x => x.present);
  const c = enc.controlled;
  const score = x => {
    let s = dist(e, x);
    // Stalwart perk: takes attack-token priority (the perk of the target, not Posse membership).
    if (x.pers?.perk === 'guard_allies' && c && dist(x, c) <= k.stalwart_guard_m) s -= 1.5;
    return s;
  };
  cands.sort((a, b) => score(a) - score(b) || (a.id < b.id ? -1 : 1));
  for (const x of cands) {
    const held = enc.enemies().filter(o => o !== e && o.ai.tokenOn === x.id && enc.standing(o)).length;
    if (held < tokenCap(enc, x)) { e.ai.tokenOn = x.id; return x; }
  }
  return null;
}

export function enemyThink(enc, e) {
  const k = enc.k, D = enc.D, rng = e.aiStream;
  if (enc.mode !== 'fight' || e.act || e.splatT > 0 || e.frazzledT > 0 || e.flinchT > 0) return;
  e.goal = null; e.ai.faceId = null;
  if (e.row.flee_threshold != null && !e.ai.fled && e.nerve / e.nerveMax <= e.row.flee_threshold) { e.ai.fled = true; enc._enemyWindup(e, 'rival_bolt', null); return; }
  e.ai.cd -= e.edt;
  let t = enc.byId.get(e.ai.tokenOn);
  if (!t || !enc.standing(t) || !t.present) { e.ai.tokenOn = null; t = null; }
  if (!t && e.ai.cd <= 0) t = acquireToken(enc, e);
  const opp = enc.opponentsOf(e).filter(x => x.present);
  if (!opp.length) return;
  if (!t) { const n = opp.slice().sort((a, b) => dist(e, a) - dist(e, b))[0]; hold(enc, e, n, e.pers.band_m[1]); e.ai.faceId = n.id; return; }
  if (e.ai.cd > 0) { hold(enc, e, t, (e.pers.band_m[0] + e.pers.band_m[1]) / 2); e.ai.faceId = t.id; return; }
  if (!e.ai.plan) {
    const redActive = enc.teles.some(x => x.cls === 'red');
    const usable = e.moves.map(id => D.moves[id]).filter(m => m && e.enemyPaws >= m.cost * k.paw_points - 1e-9 && !(e.moveCd[m.Name] > 0)
      && (m.cost < 2 || !redActive)
      && (m.ai_use === 'support' ? e.nerve / e.nerveMax < k.purr_ally_pct && e.healed < k.enemy_heal_cap * e.nerveMax - 1 : true)
      && (m.role === 'payoff' && m.ai_use !== 'support' ? m.pays_on.some(s => enc._hasState(t, s)) : true));
    e.ai.plan = usable.length && rng.chance(0.6) ? rng.pick(usable).Name : 'enemy_swipe';
  }
  const mv = D.moves[e.ai.plan];
  if (mv.ai_use === 'support') { enc._enemyWindup(e, mv.Name, e); e.ai.plan = null; e.ai.cd = k.enemy_attack_period_s * rng.range(0.8, 1.2); return; }
  const range = mv.shape === 'ring' ? 99 : mv.range;
  if (dist(e, t) - t.radius > range - 0.25 || !enc._sameLevel(e, t)) { e.goal = { x: t.x, z: t.z, stopAt: Math.max(0.5, range - 0.4) }; e.ai.faceId = t.id; return; }
  enc._face(e, t);
  enc._enemyWindup(e, mv.Name, t);
  e.ai.plan = null; e.ai.cd = k.enemy_attack_period_s * rng.range(0.8, 1.2);
}

/* ------------------------------------------------------------------ Daifuku (phase 1 kit) */

export function bossThink(enc, b) {
  const k = enc.k, B = b.boss, kit = enc.D.bosses[b.row.boss_kit], rng = b.aiStream;
  if (enc.mode !== 'fight' || b.act || b.frazzledT > 0 || b.flinchT > 0) return;
  b.goal = null; b.ai.faceId = null;
  B.swingCd -= b.edt;
  const opp = enc.opponentsOf(b).filter(x => x.present);
  if (!opp.length) return;
  if (B.state === 'wall' && b.onHR) {
    const perched = opp.filter(x => x.onHR === b.onHR).sort((p, q) => dist(b, p) - dist(b, q));
    const ground = opp.filter(x => !x.onHR && x.y < 0.5).sort((p, q) => dist(b, p) - dist(b, q));
    const stop = enc.arena.boss_stop;
    if (perched.length) { b.goal = { x: perched[0].x, z: perched[0].z, stopAt: 1.2 }; b.ai.faceId = perched[0].id; }
    else if (ground.length) {
      const cx = ground.reduce((s, x) => s + x.x, 0) / ground.length;
      b.goal = { x: Math.max(stop.pace_x[0], Math.min(stop.pace_x[1], cx)), z: stop.pos[1], stopAt: 0.2 };
    }
    if (B.swingCd <= 0) {
      if (perched.length && dist(b, perched[0]) <= kit.paw_swat_reach_m && !(b.moveCd.paw_swat > 0)) { enc._face(b, perched[0]); enc._enemyWindup(b, 'paw_swat', perched[0]); B.swingCd = k.boss_swing_period_s * rng.range(0.85, 1.15); return; }
      const g = ground.find(x => dist(b, x) <= kit.belly_drop_max_m);
      if (g) { enc._enemyWindup(b, 'belly_drop', g); B.swingCd = k.boss_swing_period_s * rng.range(0.85, 1.15); return; }
    }
    return;
  }
  if (B.state === 'ground' || B.state === 'drop') {
    B.state = 'ground';
    B.groundT -= b.edt;
    if (B.groundT <= 0) { enc._enemyWindup(b, 'climb_back', null); return; }
    const near = opp.filter(x => enc._sameLevel(b, x)).sort((p, q) => dist(b, p) - dist(b, q))[0];
    if (!near) return;
    b.ai.faceId = near.id;
    if (B.swingCd <= 0) {
      if (dist(b, near) - near.radius <= enc.D.moves.enemy_swipe.range) { enc._face(b, near); enc._enemyWindup(b, 'enemy_swipe', near); B.swingCd = k.boss_swing_period_s * rng.range(0.85, 1.15); return; }
      b.goal = { x: near.x, z: near.z, stopAt: 1.2 };
    }
  }
}

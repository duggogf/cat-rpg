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
      if (len(prop.x - e.x, prop.z - e.z) <= k.string_reach_m + prop.radius - 0.2) { e.fx = norm(prop.x - e.x, prop.z - e.z)[0]; e.fz = norm(prop.x - e.x, prop.z - e.z)[1]; enc._startString(e, 'ai', false); e.act.targetId = null; e.ai.cd = 2; e.ai.intent = 'attack'; e.ai.comboLeft = 0; return; }
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

  // 6. Engagement (M1.1 §4): circle, stalk, posture, flank; dash in for a combo when a slot is free; back out.
  const S = P.ai_style, c = enc.controlled;
  const reach = k.string_reach_m + t.radius;
  if (S.hold_near_controlled_m && c && c !== e && enc.standing(c) && !ENGAGED.has(e.ai.intent) && e.ai.intent !== 'attack' && dist(t, c) > S.hold_near_controlled_m + 0.5) {
    const [dx, dz] = norm(t.x - c.x, t.z - c.z); // the Stalwart holds its ground beside the controlled cat
    e.ai.intent = 'hold'; e.ai.engageOn = null;
    e.goal = { x: c.x + dx * 1.4, z: c.z + dz * 1.4, stopAt: 0.3, speed: 0.8 }; e.ai.faceId = t.id; return;
  }
  const aggr = P.target === 'avenge' ? (e.ai.avengeId === t.id && e.ai.avengeT > 0 ? S.avenge_aggression : S.aggression) : S.aggression;
  engage(enc, e, t, S, aggr, reach, () => {
    enc._face(e, t); enc._startString(e, 'ai', (S.combo ?? 3) > 1); e.act.targetId = t.id; e.ai.comboLeft = 0;
  });
}

/* ------------------------------------------------------------------ engagement (shared by both sides) */

export const ENGAGED = new Set(['dash_in', 'attack', 'feint']);
const ROT = 0.45, COS_R = Math.cos(ROT), SIN_R = Math.sin(ROT);

/** How many fighters are engaging t right now (dashing in, attacking or feinting). */
export function engagersOf(enc, t, except = null) {
  return enc.entities.filter(x => x !== except && enc.standing(x) && x.ai.engageOn === t.id && ENGAGED.has(x.ai.intent)).length;
}

/** Engagement slots on a target: the controlled cat 2 (1-2 enemies engage the player at once), an AI cat 1, an enemy 2. */
function engageCap(enc, t) {
  const E = enc.k.engage;
  if (t.id === enc.controlledId) return enc.diff.tokens_controlled;
  return t.side === 'enemy' ? E.crew_per_enemy : E.per_ai_cat;
}

const pickInt = (rng, v) => (Array.isArray(v) ? Math.floor(rng.range(v[0], v[1] + 1 - 1e-9)) : v);

function retreat(enc, e, t, S) {
  const A = e.ai, rng = e.aiStream, E = enc.k.engage;
  A.intent = 'retreat'; A.phaseT = rng.range(E.retreat_s[0], E.retreat_s[1]);
  A.engageOn = null; A.engageCd = rng.range(S.engage_cd[0], S.engage_cd[1]);
  hold(enc, e, t, (S.band[0] + S.band[1]) / 2 + 0.4); e.ai.faceId = t.id;
}

/**
 * One tick of the engagement loop for a fighter e against its focus t. attackFn starts one attack and must
 * leave e.act set (crew string or enemy windup).
 */
function engage(enc, e, t, S, aggression, reach, attackFn) {
  const E = enc.k.engage, A = e.ai, rng = e.aiStream;
  A.phaseT -= e.edt; A.engageCd -= e.edt; A.decideT -= e.edt;
  const d = dist(e, t), bandMid = (S.band[0] + S.band[1]) / 2;
  A.faceId = t.id;
  switch (A.intent) {
    case 'dash_in':
      if (d <= reach && enc._sameLevel(e, t)) { A.intent = 'attack'; attackFn(); return; }
      if (A.phaseT <= 0) { retreat(enc, e, t, S); return; }
      e.goal = { x: t.x, z: t.z, stopAt: Math.max(0.3, reach - 0.3), speed: E.dash_speed_mult }; return;
    case 'feint':
      if (d <= Math.max(reach + 0.5, S.band[0] * 0.6) || A.phaseT <= 0) { retreat(enc, e, t, S); return; }
      e.goal = { x: t.x, z: t.z, stopAt: reach, speed: E.dash_speed_mult }; return;
    case 'attack':
      if (A.comboLeft > 0 && d <= reach + 0.3 && enc.standing(t) && enc._sameLevel(e, t)) { attackFn(); return; }
      retreat(enc, e, t, S); return;
    case 'retreat':
      if (A.phaseT > 0) { hold(enc, e, t, bandMid + 0.4); return; }
      A.intent = 'circle'; A.phaseT = 0; A.engageOn = null; break;
    default: break;
  }
  A.engageOn = null;
  if (A.decideT <= 0) {
    A.decideT = E.decide_s;
    if (A.engageCd <= 0 && engagersOf(enc, t, e) < engageCap(enc, t) && rng.chance(aggression)) {
      A.engageOn = t.id;
      if (rng.chance(S.feint_p)) { A.intent = 'feint'; A.phaseT = 1.5; }
      else { A.intent = 'dash_in'; A.phaseT = 2.5; A.comboLeft = pickInt(rng, S.combo ?? 1); }
      return;
    }
    if (A.phaseT <= 0) {
      const r = rng.float();
      A.intent = r < S.posture_p ? 'posture' : r < S.posture_p + S.flank_p ? 'flank' : S.front ? 'strut' : rng.chance(0.5) ? 'circle' : 'stalk';
      A.phaseT = A.intent === 'posture' ? rng.range(E.posture_s[0], E.posture_s[1]) : rng.range(E.circle_switch_s[0], E.circle_switch_s[1]);
      A.circleSign = rng.chance(0.5) ? 1 : -1;
    }
  }
  let vx = e.x - t.x, vz = e.z - t.z; const l = len(vx, vz) || 1; vx /= l; vz /= l;
  switch (A.intent) {
    case 'posture': e.goal = null; break; // arched back, tail lash, hiss: hold still and face it
    case 'flank': e.goal = { x: t.x - t.fx * bandMid, z: t.z - t.fz * bandMid, stopAt: 0.3, speed: 0.75 }; break;
    case 'strut': e.goal = { x: t.x + t.fx * bandMid + (-t.fz) * A.circleSign * 0.8, z: t.z + t.fz * bandMid + t.fx * A.circleSign * 0.8, stopAt: 0.3, speed: 0.6 }; break;
    case 'stalk': e.goal = { x: t.x + vx * S.band[0], z: t.z + vz * S.band[0], stopAt: 0.2, speed: 0.4 }; break;
    default: { // circle: step round the target at the band's middle
      const sg = A.circleSign, rx = vx * COS_R - vz * SIN_R * sg, rz = vx * SIN_R * sg + vz * COS_R;
      e.goal = { x: t.x + rx * bandMid, z: t.z + rz * bandMid, stopAt: 0.1, speed: 0.6 };
    }
  }
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

/** The enemy's focus: the nearest opponent (a Stalwart beside the controlled cat draws it, its perk), kept ~2 s. */
function focusTarget(enc, e) {
  const k = enc.k, c = enc.controlled;
  let t = enc.byId.get(e.ai.tokenOn);
  if (t && enc.standing(t) && t.present && e.ai.retarget > 0) return t;
  const cands = enc.opponentsOf(e).filter(x => x.present);
  const score = x => dist(e, x) - (x.pers?.perk === 'guard_allies' && c && dist(x, c) <= k.stalwart_guard_m ? 1.5 : 0);
  cands.sort((a, b) => score(a) - score(b) || (a.id < b.id ? -1 : 1));
  t = cands.find(x => engagersOf(enc, x, e) < engageCapOf(enc, x)) || cands[0] || null;
  e.ai.tokenOn = t ? t.id : null; e.ai.retarget = 2;
  return t;
}
const engageCapOf = (enc, t) => (t.id === enc.controlledId ? enc.diff.tokens_controlled : enc.k.engage.per_ai_cat);

function planAttack(enc, e, t) {
  const k = enc.k, D = enc.D, rng = e.aiStream;
  const redActive = enc.teles.some(x => x.cls === 'red');
  const usable = e.moves.map(id => D.moves[id]).filter(m => m && e.enemyPaws >= m.cost * k.paw_points - 1e-9 && !(e.moveCd[m.Name] > 0)
    && (m.cost < 2 || !redActive) && m.ai_use !== 'support'
    && (m.role === 'payoff' ? m.pays_on.some(st => enc._hasState(t, st)) : true));
  return usable.length && rng.chance(0.5) ? rng.pick(usable).Name : 'enemy_swipe';
}

/**
 * Cornered cat (M1.2 §8): outnumbered or surrounded, an enemy stops hovering, hisses, and lashes out at the weakest
 * (below half Nerve) or else the nearest attacker. Attack-token limits do not apply to it. Returns true if it acted.
 */
function corneredThink(enc, e) {
  const k = enc.k, C = k.cornered, A = e.ai, rng = e.aiStream;
  const near = enc.opponentsOf(e).filter(x => x.present && enc._sameLevel(e, x) && dist(e, x) <= C.opponents_m);
  const friends = enc.enemies().filter(x => x !== e && enc.standing(x) && dist(e, x) <= C.ally_m).length;
  if (!(near.length >= C.min_opponents && near.length > friends + 1)) { if (A.intent === 'cornered') A.intent = 'circle'; return false; }
  if (A.intent !== 'cornered') { A.intent = 'cornered'; A.cornerT = C.hiss_s; A.engageOn = null; enc._emit({ type: 'Cornered', cat: e.id, opponents: near.length }); }
  const weak = near.filter(x => x.nerve / x.nerveMax < 0.5).sort((p, q) => p.nerve / p.nerveMax - q.nerve / q.nerveMax)[0];
  const tgt = weak || near.sort((p, q) => dist(e, p) - dist(e, q) || (p.id < q.id ? -1 : 1))[0];
  A.faceId = tgt.id; A.engageOn = tgt.id;
  A.cornerT -= e.edt;
  if (A.cornerT > 0) { e.goal = null; return true; } // the hiss: arched back, then it lashes out
  const plan = planAttack(enc, e, tgt), mv = enc.D.moves[plan];
  if (dist(e, tgt) - tgt.radius > mv.range - 0.1) { e.goal = { x: tgt.x, z: tgt.z, stopAt: Math.max(0.3, mv.range - 0.4), speed: k.engage.dash_speed_mult }; return true; }
  enc._face(e, tgt); enc._enemyWindup(e, plan, tgt);
  A.cornerT = rng.range(C.attack_gap_s[0], C.attack_gap_s[1]);
  return true;
}

export function enemyThink(enc, e) {
  const k = enc.k, D = enc.D, rng = e.aiStream, A = e.ai;
  if (enc.mode !== 'fight' || e.act || e.splatT > 0 || e.frazzledT > 0 || e.flinchT > 0) return;
  e.goal = null; A.faceId = null; A.retarget -= e.edt;
  if (e.row.flee_threshold != null && !A.fled && e.nerve / e.nerveMax <= e.row.flee_threshold) { A.fled = true; enc._enemyWindup(e, 'rival_bolt', null); return; }
  // Self-heal when low (a support Move), outside the engagement loop.
  const heal = e.moves.map(id => D.moves[id]).find(m => m?.ai_use === 'support' && e.enemyPaws >= m.cost * k.paw_points && e.nerve / e.nerveMax < k.purr_ally_pct && e.healed < k.enemy_heal_cap * e.nerveMax - 1);
  if (heal && !ENGAGED.has(A.intent)) { enc._enemyWindup(e, heal.Name, e); return; }
  const t = focusTarget(enc, e);
  if (!t) return;
  if (corneredThink(enc, e)) return;
  // Side-step the controlled cat's swing when not engaged (cats watch each other).
  const c = enc.controlled;
  if (c && c.act?.kind === 'atk' && c.act.targetId === e.id && !c.act.hit && A.sideFor !== c.act && !ENGAGED.has(A.intent)) {
    A.sideFor = c.act;
    if (rng.chance(e.pers.ai_style.sidestep_p)) {
      const [dx, dz] = norm(e.x - c.x, e.z - c.z), sg = rng.chance(0.5) ? 1 : -1, E = k.engage;
      e.act = { kind: 'sidestep', t: 0, dur: 0.3, vx: (-dz * sg) * E.sidestep_m / 0.3, vz: (dx * sg) * E.sidestep_m / 0.3 };
      A.intent = 'sidestep'; return;
    }
  }
  if (A.intent === 'sidestep') A.intent = 'circle';
  if (A.intent === 'dash_in' && !A.plan) A.plan = planAttack(enc, e, t);
  const reach = A.plan ? D.moves[A.plan].range + t.radius - 0.1 : D.moves.enemy_swipe.range + t.radius - 0.1;
  engage(enc, e, t, e.pers.ai_style, e.pers.ai_style.aggression, reach, () => {
    const plan = A.plan || planAttack(enc, e, t);
    enc._face(e, t); enc._enemyWindup(e, plan, t);
    A.plan = null; A.comboLeft = Math.max(0, A.comboLeft - 1);
  });
}

/* ------------------------------------------------------------------ Boss pattern (M1.2 §9, data-driven) */

/**
 * A universal ground Boss (bosses.json): per phase, weighted signature and basic attacks with ranges and
 * cooldowns, a swing period, and rage thresholds that speed it up. Daifuku is the first instance. The Boss reads
 * only positions, its own Nerve and its data (G4: never who is in the Posse).
 */
export function bossThink(enc, b) {
  const k = enc.k, B = b.boss, kit = enc.D.bosses[b.row.boss_kit], rng = b.aiStream, A = b.ai;
  if (enc.mode !== 'fight' || b.act || b.frazzledT > 0 || b.flinchT > 0 || b.splatT > 0) return;
  const ph = kit.phases[B.phase - 1];
  if (!ph || !ph.attacks.length) return;
  b.goal = null;
  // Rage thresholds: crossing one speeds the pattern up (and the signature comes round sooner).
  const pct = b.nerve / b.nerveMax;
  const rages = (ph.rage || []).filter(r => pct <= r.at);
  if (rages.length > B.rage) { B.rage = rages.length; enc._emit({ type: 'BossRage', cat: b.id, level: B.rage, phase: B.phase }); }
  const rage = rages[rages.length - 1];
  B.swingCd -= b.edt; B.sigCd -= b.edt; A.retarget -= b.edt;
  const opp = enc.opponentsOf(b).filter(x => x.present && x.y < 0.5);
  if (!opp.length) return;
  let t = enc.byId.get(A.tokenOn);
  if (!t || !enc.standing(t) || A.retarget <= 0) { t = opp.slice().sort((p, q) => dist(b, p) - dist(b, q) || (p.id < q.id ? -1 : 1))[0]; A.tokenOn = t.id; A.retarget = 2.5; }
  A.faceId = t.id;
  const d = dist(b, t);
  if (B.swingCd > 0) { // between swings he stalks in and postures
    A.intent = d > kit.approach_m + 1 ? 'stalk' : 'posture';
    if (d > kit.approach_m) b.goal = { x: t.x, z: t.z, stopAt: kit.approach_m, speed: 0.8 };
    return;
  }
  const ok = ph.attacks.filter(a => d >= (a.min_m ?? 0) && d <= a.max_m + t.radius && (a.move !== kit.signature || B.sigCd <= 0));
  if (!ok.length) { A.intent = 'stalk'; b.goal = { x: t.x, z: t.z, stopAt: kit.approach_m, speed: 1.0 }; return; }
  let r = rng.float() * ok.reduce((s, a) => s + a.weight, 0), pick = ok[0];
  for (const a of ok) { r -= a.weight; if (r <= 0) { pick = a; break; } }
  A.intent = 'attack';
  enc._face(b, t);
  enc._enemyWindup(b, pick.move, t);
  B.swingCd = ph.swing_period_s * (rage?.period_mult ?? 1) * rng.range(0.85, 1.15);
  if (pick.move === kit.signature) B.sigCd = (pick.cooldown_s ?? 6) * (rage?.signature_cd_mult ?? 1);
}

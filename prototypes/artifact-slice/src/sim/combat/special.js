// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Special meter (Zoomies folded in), Mikan's Special on a staggered enemy (F), the automatic crew chain and the
// Team finisher (the old Pile-On payoff). M1.1 spec §6. While a chain plays, sim time is stopped; the chain runs on
// real time and every step is emitted with its duration.
import * as F from './formulas.js';
import { BASE_TIER } from './feel.js';
import { dist, norm, len, closestOnSeg } from './geom.js';

/** Add Special meter to a Posse cat (guests and enemies have none). */
export function gainSpecial(enc, e, amt) {
  if (!e || e.side !== 'posse' || !(amt > 0)) return;
  const max = enc.k.special.max, before = e.special;
  e.special = Math.min(max, e.special + amt);
  if (before < max && e.special >= max) enc._emit({ type: 'SpecialReady', cat: e.id });
}

/** The context prompt: a staggered enemy in range, and whether Mikan's meter is ready. */
export function specialPrompt(enc) {
  const c = enc.controlled, k = enc.k;
  if (!c || !enc.standing(c) || enc.mode !== 'fight') return null;
  const cands = enc.enemies().filter(e => enc.standing(e) && e.frazzledT > 0 && dist(c, e) <= k.special.range_m);
  if (!cands.length) return null;
  const lock = enc.byId.get(enc.lockId);
  const t = cands.includes(lock) ? lock : cands.sort((a, b) => dist(c, a) - dist(c, b) || (a.id < b.id ? -1 : 1))[0];
  return { target: t.id, ready: c.special >= k.special.max - 1e-9 };
}

/** F pressed. Returns true if a chain started. */
export function trySpecial(enc) {
  const p = specialPrompt(enc);
  if (!p) { enc._emit({ type: 'SpecialRejected', reason: 'no_staggered_target' }); return false; }
  if (!p.ready) { enc._emit({ type: 'SpecialRejected', reason: 'meter', target: p.target }); return false; }
  startChain(enc, enc.byId.get(p.target));
  return true;
}

function startChain(enc, t) {
  const k = enc.k, S = k.special, c = enc.controlled;
  const crew = enc.posse().filter(p => p !== c && enc.standing(p) && p.present && p.special >= S.max - 1e-9 && dist(p, t) <= S.range_m)
    .sort((a, b) => a.slot - b.slot);
  const cats = [c, ...crew];
  const team = cats.length >= 4 && enc.posse().length >= 4;
  const short = enc.chainCount > 0;
  const cut = short ? S.cutin_short_s : S.cutin_s, teamS = team ? (short ? S.team_short_s : S.team_s) : 0;
  const steps = cats.map((x, i) => ({ cat: x.id, start: i * cut, dur: cut, done: false, begun: false }));
  const total = Math.min(S.chain_max_s, steps.length * cut + teamS);
  enc.chain = { target: t.id, steps, team, teamStart: steps.length * cut, teamS, teamDone: false, t: 0, total, short, tRem: t.frazzledT };
  enc.mode = 'special'; enc.skillBar = false;
  enc._emit({ type: 'SpecialChainStart', target: t.id, cats: cats.map(x => x.id), team_finisher: team, shortened: short, cutin_s: cut, team_s: teamS, total_s: total, stagger_left_s: +t.frazzledT.toFixed(4) });
}

/** Advance the chain by one real tick (sim time is stopped). */
export function chainTick(enc) {
  const ch = enc.chain, k = enc.k;
  ch.t += enc.DT;
  for (const [i, s] of ch.steps.entries()) {
    const cat = enc.byId.get(s.cat), row = enc.D.specials[cat.style];
    if (!s.begun && ch.t >= s.start - 1e-9) {
      s.begun = true;
      enc._emitFeel({ type: 'SpecialCutIn', cat: cat.id, special: row.special, style: cat.style, index: i + 1, of: ch.steps.length, duration_s: s.dur, target: ch.target },
        { tier: 5, authored: 'player', victim: 'enemy', kind: 'zoomies', authoredT5: true }, null, null, true);
    }
    if (!s.done && ch.t >= s.start + s.dur - 1e-9) { s.done = true; applySpecial(enc, cat, row, enc.byId.get(ch.target)); }
  }
  if (ch.team && !ch.teamDone && ch.t >= ch.teamStart - 1e-9) {
    ch.teamDone = true;
    teamFinisher(enc, ch);
  }
  if (ch.t >= ch.total - 1e-9) endChain(enc);
}

function applySpecial(enc, cat, row, t) {
  const k = enc.k;
  cat.special = 0;
  const opp = enc.enemies().filter(e => enc.standing(e));
  const spec = (mv, fz) => ({ mv, fz, kind: 'special', authored: 'player', noStop: true, attack: row.special });
  const hits = [];
  if (row.target === 'all_enemies') {
    for (const x of opp) {
      for (let h = 0; h < row.hits; h++) if (enc.standing(x)) enc._hit(cat, x, spec(row.mv, row.fz));
      if (row.status && enc.standing(x)) enc._applyStatus(x, row.status, k.status_s[row.status], row.special);
      hits.push(x.id);
    }
    if (row.heal_pct) for (const a of enc.posse().filter(p => enc.standing(p))) enc._healCat(a, a.nerveMax * row.heal_pct, cat);
  } else { // 'line': the first target, then others near the path
    if (t && enc.standing(t)) {
      enc._hit(cat, t, { ...spec(row.mv, row.fz), knockback: row.knock_off && t.onHR ? { m: 1.5, source: 'landslide' } : null }); hits.push(t.id);
      const [dx, dz] = norm(t.x - cat.x, t.z - cat.z);
      for (const x of opp) if (x !== t && enc.standing(x)) {
        const vx = x.x - cat.x, vz = x.z - cat.z, along = vx * dx + vz * dz;
        if (along > 0 && Math.abs(vx * dz - vz * dx) <= 1.2) { enc._hit(cat, x, spec(row.others_mv, 0)); hits.push(x.id); }
      }
    }
  }
  enc._emit({ type: 'SpecialUsed', cat: cat.id, special: row.special, targets_hit: hits });
}

/** All four landed: the Team finisher (the old Pile-On payoff; Combat F5 value at the stagger time left). */
function teamFinisher(enc, ch) {
  const k = enc.k, t = enc.byId.get(ch.target), cats = ch.steps.map(s => s.cat);
  const tRem = t ? t.frazzledT : 0;
  const routed = [];
  const value = F.pileOnMV(cats.map(() => 1), tRem, k);
  enc._emitFeel({ type: 'TeamFinisher', target: ch.target, cats, duration_s: ch.teamS, t_rem: +tRem.toFixed(4), value_mv: +value.toFixed(3) },
    { tier: BASE_TIER.pile_on, authored: 'player', victim: 'enemy', kind: 'pile_on', authoredT5: true }, null, null, true);
  if (!t || !enc.standing(t)) return;
  if (t.rankRow.leader) {
    for (const id of cats) { const c = enc.byId.get(id); if (enc.standing(t)) enc._hit(c, t, { mv: F.pileOnBeatMV(tRem, k), fz: 0, kind: 'pile_on_beat', authored: 'player', noPaw: true, noStop: true }); }
  } else { // below Captain the team finisher always Routs (DR-30), with any staggered trash clustered within 3 m
    const cluster = enc.enemies().filter(e => enc.standing(e) && !e.rankRow.leader && e.frazzledT > 0 && dist(e, t) <= k.quick_cluster_m + 1e-9);
    for (const e of cluster) { enc._rout(e, enc.controlled, 'by_pile_on'); routed.push(e.id); }
  }
  if (enc.standing(t)) { t.frazzledT = 0; t.fzg = 0; enc._emit({ type: 'StaggerEnded', cat: t.id, reason: 'team_finisher' }); }
  ch.routed = routed;
}

function endChain(enc) {
  const ch = enc.chain;
  enc.chain = null; enc.mode = 'fight'; enc.chainCount++;
  enc._emit({ type: 'SpecialChainEnd', target: ch.target, team_finisher: ch.team, routed: ch.routed || [] });
  const t = enc.byId.get(ch.target);
  if (t?.boss?.pendingBreak && t.frazzledT <= 0) enc._phaseBreak(t);
}

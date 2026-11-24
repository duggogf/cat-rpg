// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Special meter (Zoomies folded in), Mikan's Special (F), the automatic crew chain and the Team finisher
// ("full burst"). M1.1 §6 as amended by M1.2 §7:
// - F works at any time (meter permitting); a staggered target takes bonus Special damage.
// - The chain is sequential: each Special starts only after the previous one's animation ends.
// - The full burst is extra damage on top; repeat chains in a fight play faster.
// Sim time is stopped through the chain; the chain runs on real time and every step is emitted with its duration.
import * as F from './formulas.js';
import { BASE_TIER } from './feel.js';
import { dist, norm } from './geom.js';

/** Add Special meter to a Posse cat (guests and enemies have none). */
export function gainSpecial(enc, e, amt) {
  if (!e || e.side !== 'posse' || !(amt > 0)) return;
  const max = enc.k.special.max, before = e.special;
  e.special = Math.min(max, e.special + amt);
  if (before < max && e.special >= max) enc._emit({ type: 'SpecialReady', cat: e.id });
}

/** The Special's target and whether F would fire: the lock target, else the nearest enemy (staggered ones first in range). */
export function specialPrompt(enc) {
  const c = enc.controlled, k = enc.k;
  if (!c || !enc.standing(c) || enc.mode !== 'fight') return null;
  const all = enc.enemies().filter(e => enc.standing(e) && e.present);
  if (!all.length) return null;
  const lock = enc.byId.get(enc.lockId);
  const near = (list) => list.slice().sort((a, b) => dist(c, a) - dist(c, b) || (a.id < b.id ? -1 : 1))[0];
  const stag = all.filter(e => e.frazzledT > 0 && dist(c, e) <= k.special.range_m);
  const t = lock && all.includes(lock) ? lock : stag.length ? near(stag) : near(all);
  return { target: t.id, ready: c.special >= k.special.max - 1e-9, staggered: t.frazzledT > 0 };
}

/** F pressed. Returns true if a chain started. */
export function trySpecial(enc) {
  const p = specialPrompt(enc);
  if (!p) { enc._emit({ type: 'SpecialRejected', reason: 'no_target' }); return false; }
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
  const repeat = enc.chainCount > 0, m = repeat ? S.repeat_mult : 1;
  const cut = S.cutin_s * m, act = S.action_s * m, step = cut + act, teamS = team ? S.team_s * m : 0;
  const steps = cats.map((x, i) => ({ cat: x.id, start: i * step, cut, act, begun: false, done: false }));
  const total = Math.min(S.chain_max_s, steps.length * step + teamS);
  enc.chain = { target: t.id, steps, team, teamStart: steps.length * step, teamS, teamBegun: false, teamDone: false, t: 0, total, short: repeat, staggered: t.frazzledT > 0 };
  enc.mode = 'special'; enc.skillBar = false;
  enc._emit({ type: 'SpecialChainStart', target: t.id, cats: cats.map(x => x.id), team_finisher: team, shortened: repeat, staggered: t.frazzledT > 0,
    special_s: step, cutin_s: cut, action_s: act, team_s: teamS, total_s: total, stagger_left_s: +t.frazzledT.toFixed(4) });
}

/** Advance the chain by one real tick (sim time is stopped). */
export function chainTick(enc) {
  const ch = enc.chain;
  ch.t += enc.DT;
  for (const [i, s] of ch.steps.entries()) {
    const cat = enc.byId.get(s.cat), row = enc.D.specials[cat.style];
    if (!s.begun && ch.t >= s.start - 1e-9 && (i === 0 || ch.steps[i - 1].done)) { // only after the previous animation has ended
      s.begun = true;
      enc._emitFeel({ type: 'SpecialStart', cat: cat.id, special: row.special, style: cat.style, index: i + 1, of: ch.steps.length, cutin_s: s.cut, action_s: s.act, duration_s: s.cut + s.act, target: ch.target },
        { tier: 5, authored: 'player', victim: 'enemy', kind: 'zoomies', authoredT5: true }, null, null, true);
    }
    if (s.begun && !s.done && ch.t >= s.start + s.cut + s.act - 1e-9) {
      s.done = true;
      applySpecial(enc, cat, row, enc.byId.get(ch.target));
      enc._emit({ type: 'SpecialEnd', cat: cat.id, index: i + 1 });
    }
  }
  if (ch.team && !ch.teamBegun && ch.steps.every(s => s.done)) {
    ch.teamBegun = true;
    const t = enc.byId.get(ch.target);
    enc._emitFeel({ type: 'TeamFinisher', target: ch.target, cats: ch.steps.map(s => s.cat), duration_s: ch.teamS, t_rem: +(t?.frazzledT ?? 0).toFixed(4) },
      { tier: BASE_TIER.pile_on, authored: 'player', victim: 'enemy', kind: 'pile_on', authoredT5: true }, null, null, true);
  }
  if (ch.teamBegun && !ch.teamDone && ch.t >= ch.teamStart + ch.teamS - 1e-9) { ch.teamDone = true; teamFinisher(enc, ch); }
  if (ch.t >= ch.total - 1e-9 && ch.steps.every(s => s.done) && (!ch.team || ch.teamDone)) endChain(enc);
}

function applySpecial(enc, cat, row, t) {
  const k = enc.k;
  cat.special = 0;
  const opp = enc.enemies().filter(e => enc.standing(e));
  const bonus = x => (x.frazzledT > 0 ? k.special.stagger_bonus : 1); // a staggered target takes bonus Special damage
  const spec = (x, mv, fz) => ({ mv: mv * bonus(x), fz, kind: 'special', authored: 'player', noStop: true, attack: row.special });
  const hits = [];
  if (row.target === 'all_enemies') {
    for (const x of opp) {
      for (let h = 0; h < row.hits; h++) if (enc.standing(x)) enc._hit(cat, x, spec(x, row.mv, row.fz));
      if (row.status && enc.standing(x)) enc._applyStatus(x, row.status, k.status_s[row.status], row.special);
      hits.push(x.id);
    }
    if (row.heal_pct) for (const a of enc.posse().filter(p => enc.standing(p))) enc._healCat(a, a.nerveMax * row.heal_pct, cat);
  } else if (t && enc.standing(t)) { // 'line': the first target, then others near the path
    enc._hit(cat, t, spec(t, row.mv, row.fz)); hits.push(t.id);
    const [dx, dz] = norm(t.x - cat.x, t.z - cat.z);
    for (const x of opp) if (x !== t && enc.standing(x)) {
      const vx = x.x - cat.x, vz = x.z - cat.z, along = vx * dx + vz * dz;
      if (along > 0 && Math.abs(vx * dz - vz * dx) <= 1.2) { enc._hit(cat, x, spec(x, row.others_mv, 0)); hits.push(x.id); }
    }
  }
  enc._emit({ type: 'SpecialUsed', cat: cat.id, special: row.special, targets_hit: hits });
}

/** All four landed: the Team finisher, extra damage on top (Combat F5 at the stagger time left + the full-burst bonus). */
function teamFinisher(enc, ch) {
  const k = enc.k, t = enc.byId.get(ch.target), cats = ch.steps.map(s => s.cat);
  const routed = [];
  if (!t || !enc.standing(t)) { ch.routed = routed; return; }
  const tRem = t.frazzledT;
  if (!t.rankRow.leader && tRem > 0) { // a staggered Tough always goes down, with staggered trash within 3 m (DR-30)
    const cluster = enc.enemies().filter(e => enc.standing(e) && !e.rankRow.leader && e.frazzledT > 0 && dist(e, t) <= k.quick_cluster_m + 1e-9);
    for (const e of cluster) { enc._rout(e, enc.controlled, 'by_pile_on'); routed.push(e.id); }
  } else {
    for (const id of cats) if (enc.standing(t)) enc._hit(enc.byId.get(id), t, { mv: F.pileOnBeatMV(tRem, k) + k.special.full_burst_mv, fz: 0, kind: 'pile_on_beat', authored: 'player', noPaw: true, noStop: true });
  }
  if (enc.standing(t) && t.frazzledT > 0) { t.frazzledT = 0; t.fzg = 0; enc._emit({ type: 'StaggerEnded', cat: t.id, reason: 'team_finisher' }); }
  ch.routed = routed;
}

function endChain(enc) {
  const ch = enc.chain;
  enc.chain = null; enc.mode = 'fight'; enc.chainCount++;
  enc._emit({ type: 'SpecialChainEnd', target: ch.target, team_finisher: ch.team, routed: ch.routed || [] });
  const t = enc.byId.get(ch.target);
  if (t?.boss?.pendingBreak && t.frazzledT <= 0) enc._phaseBreak(t);
}

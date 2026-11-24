// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Pure formulas: Crew F1 (stats) and Combat F1-F7, F11. No state, no randomness. Every constant comes from `k`
// (the indexed combat_constants table) so the worked examples in the GDD are reproducible in tests.

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const STATS = ['nerve', 'bite', 'hide', 'voice', 'zip'];

/** Crew F1: style-neutral Nerve at level L. */
export const nRef = (L, k) => k.nerve_l1 + (k.nerve_l30 - k.nerve_l1) * (L - 1) / 29;
/** Crew F1: style-neutral other stat at level L. */
export const sRef = (L, k) => k.stat_l1 + (k.stat_l30 - k.stat_l1) * (L - 1) / 29;
/** Combat F1: B(L) = basic_hit_pct x N_ref(L). 1 MV at level L in Nerve points. */
export const baseHit = (L, k) => k.basic_hit_pct * nRef(L, k);

/** Crew F1: stat(cat, s) = round(base_s(L) x STYLE_W[style][s]). */
export function stat(styleRow, s, L, k) {
  const base = s === 'nerve' ? nRef(L, k) : sRef(L, k);
  return Math.round(base * styleRow[s]);
}

/** All five stats of a combatant row. Rank Nerve (Combat §3.12) is applied on top. */
export function statsFor(catRow, D) {
  const st = D.styles[catRow.style], rank = D.ranks[catRow.rank], k = D.k;
  const out = {};
  for (const s of STATS) out[s] = stat(st, s, catRow.level, k);
  if (!rank.style_nerve) out.nerve = Math.round(nRef(catRow.level, k)); // captain_style_nerve = off
  out.nerve = Math.round(out.nerve * rank.nerve_mult * (catRow.perk_nerve_mult || 1));
  return out;
}

/** Combat §3.8: x0.8 if the defender's Style resists the hit's type, x1.2 if weak, else 1. */
export function typeMult(hitType, defStyleRow, k) {
  if (!defStyleRow || !hitType) return 1;
  if (hitType === defStyleRow.resists) return k.type_resist;
  if (hitType === defStyleRow.weak_to) return k.type_weak;
  return 1;
}
export const isWeak = (hitType, defStyleRow) => !!defStyleRow && hitType === defStyleRow.weak_to;

/**
 * Combat F1. dmg = round(MV x B(L_a) x (Off_a/S_ref(L_a)) x clamp(S_ref(L_d)/Hide_d) x A x R x F x G)
 * @param {object} p {mv, La, off, Ld, hide, type, status, perk, ambush, rank, frazzled, guard[]}
 * @returns {{dmg:number, raw:number, A:number, G:number}}
 */
export function damage(p, k) {
  const off = p.off / sRef(p.La, k);
  const hide = clamp(sRef(p.Ld, k) / p.hide, k.hide_clamp[0], k.hide_clamp[1]);
  const A = clamp((p.type ?? 1) * (p.status ?? 1) * (p.perk ?? 1) * (p.ambush ?? 1), k.amp_clamp[0], k.amp_clamp[1]);
  const G = Math.max(k.dr_floor, (p.guard || []).reduce((a, b) => a * b, 1));
  const F = p.frazzled ? k.frazzled_dmg : 1;
  const raw = p.mv * baseHit(p.La, k) * off * hide * A * (p.rank ?? 1) * F * G;
  return { dmg: Math.round(raw), raw, A, G };
}

/** Combat F2. ΔFZ = FZ x r_rank x (2 if Ruffled) x OldScore x Weak + flat chunks. */
export function frazzleGain(p, k) {
  return p.fz * p.rRank * (p.ruffled ? k.ruffled_fz_mult : 1) * (p.oldScore ?? 1) * (p.weak ? k.weak_fz : 1) + (p.flat ?? 0);
}

/** Combat F3 steady-state Paw rate in points/s for an attack uptime and fill (string of 3 hits per cycle). */
export function pawRate(uptime, fill, k, cycleS = k.string_cycle_s) {
  const hitsPerS = uptime * 3 / cycleS;
  const perHit = (2 * k.paw_per_hit + k.paw_per_finisher) / 3;
  return fill * (k.paw_passive + hitsPerS * perHit);
}

/** Combat F4: heal in Nerve points. */
export function heal(healMV, L, voice, cowedNear, k, cowedMult = 1.5) {
  return healMV * baseHit(L, k) * (voice / sRef(L, k)) * (cowedNear ? cowedMult : 1);
}

/** Combat F5 Full Pile-On value in MV (neutral); in M1.1 this is the Team finisher's value: Σ (base + k x T_rem) x TypeMod x frazzled_dmg. */
export function pileOnMV(typeMods, tRem, k) {
  return typeMods.reduce((s, tm) => s + (k.pile_on_base + k.pile_on_k * tRem) * tm * k.frazzled_dmg, 0);
}
/** Per-cat MV of a Full Pile-On beat before F1 (the sim routes it through F1 with F = 1.5). */
export const pileOnBeatMV = (tRem, k) => k.pile_on_base + k.pile_on_k * tRem;
/** Combat F5 pips: ceil(T_rem / 1.2). */
export const pips = (tRem, k) => Math.max(0, Math.ceil(tRem / k.pip_s - 1e-9));

/**
 * Combat F5 decision value (the worked example): spend `wait` seconds of the window on basics at
 * `basicsRate` MV/s and `paws` banked Moves at `moveMV` each, then cash in a Pile-On with `cats` cats.
 */
export function windowValue({ cats, wait, basicsRate, paws = 0, moveMV = 3.5, windowS }, k) {
  const fr = k.frazzled_dmg, W = windowS ?? k.frazzled_s;
  const basics = wait * basicsRate * fr;
  const moves = paws * moveMV * fr;
  const pile = pileOnMV(new Array(cats).fill(1), Math.max(0, W - wait), k);
  return { basics, moves, pile, total: basics + moves + pile };
}

// Combat F6 (Tag-In and Relay) is retired by the M1.1 owner direction: the player controls Mikan only.

/** Combat F7: High Road Pounce MV/FZ for time aloft (s) and time since mantling (s). */
export function pounce(tAloft, sinceMantle, k) {
  const p = k.pounce, t = clamp(tAloft, 0, p.cap_s);
  const pen = sinceMantle < p.mantle_penalty_s;
  return { mv: (p.base_mv + p.mv_per_s * t) * (pen ? p.mantle_mult : 1), fz: p.base_fz + p.fz_per_s * t, noPaw: pen };
}

/** Combat F11: seconds of anger Fired Up by stage (Infinity = the whole fight). */
export function angerFiredUpSeconds(stage, k) {
  const v = k.anger_fu_s[stage] ?? 0;
  return v === 'whole_fight' ? Infinity : v;
}
/** Combat F11: seconds Cowed by Old Gang Nerves for a personality. */
export const nervesSeconds = (personality, k) => k.nerves_s[personality] ?? k.nerves_s.default;
/** Combat F11 applies-iff: old_gang_nerves, Loyalty below the Sworn ceiling, and the Old Boss among opponents. */
export function nervesApply(catRow, opponentIds, D) {
  const pers = D.personalities[catRow.personality];
  return !!catRow.old_gang_nerves && pers?.old_gang === 'susceptible' && (catRow.loyalty ?? 0) < D.k.nerves_loyalty_ceiling
    && !!catRow.old_boss_id && opponentIds.includes(catRow.old_boss_id);
}

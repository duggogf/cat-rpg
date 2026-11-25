// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Pure Nemesis formulas (design/gdd/nemesis-system.md §4) and the Crew numbers the Verdict shows (crew F6, F8).
// Every function reads only its arguments: the cat's own record and the constants bundle `k`.

/** Nemesis §4: nearest integer, .5 up. */
export const round = x => Math.floor(x + 0.5 + 1e-9);
export const clamp = (lo, hi, x) => Math.max(lo, Math.min(hi, x));

/** Life from the day index (F12 night numbering: day 1-2 Life 1, day 3+ Life 2). */
export const lifeOf = (k, day) => (day <= k.life.life1_last_day ? 1 : 2);

/** Anger stage row for a value (F10). */
export function angerStage(k, a) {
  if (a == null) return null;
  return k.anger.stages.filter(s => a >= s.min).pop();
}
export const stageIndex = (k, name) => k.anger.stages.findIndex(s => s.stage === name);

/**
 * F1 ledger for one cat and one encounter.
 * @param items [{row, g, r, r_flat?}] the §3.5 rows the cat itself took part in (verdict rows included or not)
 * @returns {sumG, sumR, dG (capped, before override), dR, cap, override}
 */
export function ledger(k, pers, encounters, items) {
  const P = k.personalities[pers] || { m_g: 1, m_r: 1 };
  const cap = encounters <= k.cap_enc.first_encounters ? k.cap_enc.early : k.cap_enc.late;
  let sumG = 0, sumR = 0, flat = 0, override = null;
  for (const it of items) {
    if (typeof it.g === 'number') sumG += it.g;
    else if (it.g === 'halve' || it.g === 'zero') override = it.g;
    sumR += it.r || 0;
    flat += it.r_flat || 0;
  }
  const dG = Math.min(cap, round(P.m_g * sumG));
  const dR = round(P.m_r * sumR) + flat;
  return { sumG, sumR, flat, dG, dR, cap, override, m_g: P.m_g, m_r: P.m_r };
}

/** Apply a ledger result to (G, R); returns the new pair, clamped 0-100. */
export function applyLedger(k, G, R, L) {
  const [lo, hi] = k.meter_range;
  let g = clamp(lo, hi, G + L.dG);
  if (L.override === 'halve') g = round(g / 2);
  if (L.override === 'zero') g = 0;
  return { grudge: clamp(lo, hi, g), regard: clamp(lo, hi, R + L.dR) };
}

/**
 * F4 Nose-Touch gate. Reads only the cat's own pending Grudge and personality, its own post's Counter-Spray
 * count and its own anger stage at the Standoff (G2, G8).
 */
export function noseGate(k, { gPending, personality, life, keeper, nCounterOwn, boss, angerStageAtStandoff }) {
  const V = k.verdict;
  const shift = (k.personalities[personality] || { gate_shift: 0 }).gate_shift;
  const gate = V.nose_base + shift;
  const grudgeOk = gPending < gate;
  const quiet = life >= V.quiet_take_from_life;
  const loudKeeper = quiet && keeper && nCounterOwn >= V.loud_counter_own;
  const loudBoss = quiet && boss && angerStageAtStandoff != null && stageIndex(k, angerStageAtStandoff) >= stageIndex(k, V.loud_boss_stage);
  const open = grudgeOk && !loudKeeper && !loudBoss;
  const reason = !grudgeOk ? 'grudge' : loudKeeper ? 'loud' : loudBoss ? 'boss_anger' : null;
  return { open, gate, reason, tell: open ? 'tail_still' : 'tail_lashing' };
}

/** F7 Scar chance on a Rout by the Posse. */
export function scarChance(k, { catId, routsByPlayer, byPileOn, scarsFromMikan }) {
  const S = k.scar_chance;
  if (scarsFromMikan >= S.max_from_mikan) return 0;
  if (routsByPlayer === 1 && S.authored_first_rout.includes(catId)) return 1;
  if (routsByPlayer >= 2 && scarsFromMikan === 0) return 1;
  return Math.min(1, S.base + S.by_pile_on * (byPileOn ? 1 : 0) + S.second_rout * (routsByPlayer >= 2 ? 1 : 0));
}

/** F11 join-in chance. */
export function joinChance(k, { near, regard }) {
  const J = k.join_in;
  return Math.min(J.cap, J.base + J.near * (near ? 1 : 0) + J.regard * (regard >= J.regard_ge ? 1 : 0));
}

/** Crew F8 Bribe prices (Life 1 free). */
export function bribe(k, { level, role, life }) {
  const B = k.bribe;
  if (life === 1 && B.life1_free) return { free: true, fair: 0, feast: 0 };
  const fair = round(B.per_level * level * (B.rank_mult[role] ?? 1));
  return { free: false, fair, feast: round(B.feast_mult * fair) };
}

/** Crew F6 starting Loyalty (floored, as F7 displays it) and its tier word. */
export function startingLoyalty(k, { gPre, regard, personality, bribeStep, returned = false }) {
  const F = k.loyalty_f6;
  const pm = (k.personalities[personality] || { p_mod: 0 }).p_mod;
  const raw = F.base + F.g * gPre + F.r * regard + pm + F.bribe_step * bribeStep + (returned ? F.returned : 0);
  const value = Math.floor(clamp(F.min, F.max, raw) + 1e-9);
  return { value, tier: loyaltyTier(k, value) };
}
export const loyaltyTier = (k, v) => k.loyalty_tiers.filter(t => v >= t.min).pop().tier;

/** F2 nightly drift. */
export function drift(k, { grudge, personality, quiet, lead }) {
  const d = (k.personalities[personality] || { decay: 2 }).decay;
  return clamp(0, 100, grudge - d * (quiet ? 1 : 0) * (lead ? 0 : 1));
}

/** F3 arc score (compared only, never shown). */
export function arcScore({ enc, marks, grudge, regard, beatMikan, daysUnseen }) {
  return 12 * enc + 10 * marks + 0.3 * Math.max(grudge, regard) + 15 * (beatMikan ? 1 : 0) - 3 * Math.min(daysUnseen, 10);
}

/** Day label for history lines and cards: day 1 → "L1 D1", day 3 → "L2 D1" (F12 night numbering). */
export function dayLabel(k, day) {
  const l1 = k.life.life1_last_day;
  return day <= l1 ? `L1 D${day}` : `L2 D${day - l1}`;
}

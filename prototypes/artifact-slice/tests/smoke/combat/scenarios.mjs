// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat smoke scenarios: bots x encounters x seeds. Used by tools/sim-run.mjs and smoke.test.mjs.
import { createEncounter } from '../../../src/sim/combat/index.js';
import { engagersOf } from '../../../src/sim/combat/ai.js';
import { passiveBot, skilledBot, medianBot, daifukuBot, withCommandQueue } from './bots.mjs';

/** GDD reference figures (Combat F9 sim table, owner-feedback pass, plan §2.2) for the report. */
export const GDD = {
  tough_focus: 'F9: Tough focused in a group 9.7-10.7 s (band 6-10); last enemy 5.6-5.7 s',
  toughs_2: 'F9: skirmish 2 Toughs 18-21 s',
  toughs_3: 'F9: skirmish 3 Toughs 25-28 s',
  sandbox: 'F9: 4 Toughs 33-36 s (band 30-60)',
  captain: 'F9: Captain 37 s (band 30-45)',
  daifuku_bout: 'F9: full fight 166-176 s, so phase 1 (30% of Nerve) about 55-60 s; plan §2.2: bout <= 1:30',
  lose_to_daifuku: 'plan §2.3: Mikan + Pon, the loss flow is near-certain',
  challenger: 'review Fix 1 (showcase): Captain-rank challenger with Water Fear + 1 Stray + the guest, 23-34 s',
};

/** A Special chain is reached in at least 90% of the seeds. */
const PILE_90 = rs => rs.filter(r => r.chains_ > 0).length >= Math.ceil(0.9 * rs.length);
/** A Special chain in >= 90% of seeds and a Team finisher in at least one. */
const CHAIN = rs => PILE_90(rs) && rs.some(r => r.teams > 0);

export const SCENARIOS = [
  { id: 'skilled_tough_focus', enc: 'tough_focus', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' },
  { id: 'skilled_toughs_2', enc: 'toughs_2', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' },
  { id: 'skilled_toughs_3', enc: 'toughs_3', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' },
  { id: 'skilled_sandbox', enc: 'sandbox', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win', aggregate: CHAIN },
  { id: 'skilled_captain', enc: 'captain', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' },
  { id: 'skilled_challenger_guest', enc: 'challenger', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' && r.guestJoined, aggregate: rs => { const m = median(rs.map(r => r.fight_s)); return m >= 23 && m <= 34; } },
  { id: 'median_tough_focus', enc: 'tough_focus', bot: () => withCommandQueue(medianBot()), expect: r => r.outcome === 'win' },
  { id: 'median_toughs_2', enc: 'toughs_2', bot: () => withCommandQueue(medianBot()), expect: r => r.outcome === 'win' },
  { id: 'median_toughs_3', enc: 'toughs_3', bot: () => withCommandQueue(medianBot()), expect: r => r.outcome === 'win' },
  { id: 'median_sandbox', enc: 'sandbox', bot: () => withCommandQueue(medianBot()), expect: r => r.outcome === 'win' },
  { id: 'median_captain', enc: 'captain', bot: () => withCommandQueue(medianBot()), expect: r => r.outcome === 'win' },
  { id: 'scripted_daifuku_phase_break', enc: 'daifuku_bout', bot: () => withCommandQueue(daifukuBot()), expect: r => r.phaseBreak && r.outcome === 'rival_fled' },
  { id: 'passive_lose_to_daifuku', enc: 'lose_to_daifuku', bot: () => passiveBot(), expect: r => r.outcome === 'loss' },
];

/** Run one scenario on one seed and summarise it. */
export function runOne(sc, seed, opts = {}) {
  const enc = createEncounter(sc.enc, { seed, showcase: true, ...opts });
  const bot = sc.bot(), events = [];
  let maxEngaging = 0;
  const mikan = enc.byId.get('mikan');
  for (let i = 0; i < 60 * 400 && enc.mode !== 'ended'; i++) {
    for (const e of enc.step(bot(enc, i))) events.push(e);
    maxEngaging = Math.max(maxEngaging, engagersOf(enc, mikan));
  }
  const count = t => events.filter(e => e.type === t).length;
  const ended = events.find(e => e.type === 'EncounterEnded');
  const pb = events.find(e => e.type === 'PhaseBreak');
  const firstPile = events.find(e => e.type === 'SpecialChainStart');
  // Posse-side damage to enemies by source (Quick Pile-On Routs count the Nerve they removed).
  const src = { basics: 0, moves: 0, special: 0, pile_on: 0, other: 0 };
  const allyIds = new Set(enc.allies().map(a => a.id).concat(enc.entities.filter(e => e.side !== 'enemy').map(e => e.id)));
  const SRC = { string: 'basics', finisher: 'basics', heavy: 'basics', pounce: 'basics', move1: 'moves', move2: 'moves', move_mid: 'moves', special: 'special', pile_on_beat: 'pile_on' };
  const nerveBefore = {};
  for (const e of events) {
    if (e.type === 'Hit' && allyIds.has(e.attacker) && enc.byId.get(e.target)?.side === 'enemy') { src[SRC[e.kind] || 'other'] += e.dmg; nerveBefore[e.target] = e.nerve; }
    if (e.type === 'CatRouted' && e.how === 'by_pile_on') src.pile_on += nerveBefore[e.cat] ?? enc.byId.get(e.cat).nerveMax;
  }
  const dmgTotal = Object.values(src).reduce((a, b) => a + b, 0) || 1;
  const moveUse = {};
  for (const e of events) if (e.type === 'MoveUsed' && enc.byId.get(e.user)?.side !== 'enemy') {
    const u = moveUse[e.user] = moveUse[e.user] || { ai: 0, player: 0, moves: {} };
    u[e.authored === 'player' ? 'player' : 'ai']++; u.moves[e.move] = (u.moves[e.move] || 0) + 1;
  }
  // Set-up -> Pay-off pairs: a Pay-off Move that landed on its condition within 4 s of a Set-up on the same target.
  const chains = { shoulder_check_bunny_kick: 0, splat_belly_flop: 0, withering_hiss_purr: 0 };
  const lastSetup = {};
  for (const e of events) {
    if (e.type !== 'MoveUsed') continue;
    for (const t of e.targets_hit) if (['shoulder_check', 'withering_hiss', 'face_swat'].includes(e.move)) lastSetup[t] = { move: e.move, t: e.sim_t };
    const t0 = e.targets_hit[0], ls = lastSetup[t0];
    if (e.move === 'bunny_kick' && ls?.move === 'shoulder_check' && e.sim_t - ls.t <= 4) chains.shoulder_check_bunny_kick++;
    if (e.move === 'belly_flop' && ls?.move === 'shoulder_check' && e.sim_t - ls.t <= 4) chains.splat_belly_flop++;
    if (e.move === 'purr' && Object.values(lastSetup).some(x => x.move === 'withering_hiss' && e.sim_t - x.t <= 4)) chains.withering_hiss_purr++;
  }
  const posse = enc.posse();
  const lost = posse.reduce((s, p) => s + (p.nerveMax - p.nerve), 0) / posse.reduce((s, p) => s + p.nerveMax, 0);
  return {
    id: sc.id, enc: sc.enc, seed, outcome: enc.outcome, fight_s: enc.fightT, real_s: enc.realT,
    phaseBreak: !!pb, phaseBreak_s: pb ? pb.sim_t - 3 : null, chains_: count('SpecialChainStart'), pileOns: count('SpecialChainStart'), teams: count('TeamFinisher'), firstPile_s: firstPile ? firstPile.sim_t - 3 : null,
    tagIns: 0, maxRelay: 0, maxEngaging, specials: count('SpecialUsed'),
    moves: count('MoveUsed'), knockOffs: count('KnockOff'), frazzles: count('Staggered'), guestJoined: count('GuestEntered') > 0,
    posseNerveLost: lost, dmgShare: Object.fromEntries(Object.entries(src).map(([k, v]) => [k, v / dmgTotal])), moveUse, chains, hash: enc.hash(), events,
  };
}

export const median = xs => { const s = xs.filter(x => x != null).slice().sort((a, b) => a - b); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

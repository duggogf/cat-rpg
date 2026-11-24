// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat smoke scenarios: bots x encounters x seeds. Used by tools/sim-run.mjs and smoke.test.mjs.
import { createEncounter, run } from '../../../src/sim/combat/index.js';
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
  challenger: 'Combat §3.14: challenger + 1 Stray as a normal encounter, with the Nose-Touch guest',
};

/** A Pile-On is reached in at least 90% of the seeds. */
const PILE_90 = rs => rs.filter(r => r.pileOns > 0).length >= Math.ceil(0.9 * rs.length);

export const SCENARIOS = [
  { id: 'skilled_tough_focus', enc: 'tough_focus', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' },
  { id: 'skilled_toughs_2', enc: 'toughs_2', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win', aggregate: PILE_90 },
  { id: 'skilled_toughs_3', enc: 'toughs_3', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' },
  { id: 'skilled_sandbox', enc: 'sandbox', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win', aggregate: PILE_90 },
  { id: 'skilled_captain', enc: 'captain', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' },
  { id: 'skilled_challenger_guest', enc: 'challenger', bot: () => withCommandQueue(skilledBot()), expect: r => r.outcome === 'win' && r.guestJoined },
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
  const { events } = run(enc, sc.bot(), 60 * 400);
  const count = t => events.filter(e => e.type === t).length;
  const ended = events.find(e => e.type === 'EncounterEnded');
  const pb = events.find(e => e.type === 'PhaseBreak');
  const firstPile = events.find(e => e.type === 'PileOnStart');
  const posse = enc.posse();
  const lost = posse.reduce((s, p) => s + (p.nerveMax - p.nerve), 0) / posse.reduce((s, p) => s + p.nerveMax, 0);
  return {
    id: sc.id, enc: sc.enc, seed, outcome: enc.outcome, fight_s: enc.fightT, real_s: enc.realT,
    phaseBreak: !!pb, phaseBreak_s: pb ? pb.sim_t - 3 : null, pileOns: count('PileOnStart'), firstPile_s: firstPile ? firstPile.sim_t - 3 : null,
    tagIns: count('TagIn'), maxRelay: Math.max(0, ...events.filter(e => e.type === 'TagIn').map(e => e.relay_count)),
    moves: count('MoveUsed'), knockOffs: count('KnockOff'), frazzles: count('Frazzled'), guestJoined: count('GuestEntered') > 0,
    posseNerveLost: lost, hash: enc.hash(), events,
  };
}

export const median = xs => { const s = xs.filter(x => x != null).slice().sort((a, b) => a - b); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

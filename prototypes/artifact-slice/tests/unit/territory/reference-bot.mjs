// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Scripted bots that play the slice's territory beats day by day.
//  - referenceRun: Territory §4.11's reference player (claim path LWC d1, LPY d2, PA d3, TSS d5, Den d7; every
//    raid Repelled; challenger beaten by day on d6; Daifuku lost on d6 and won on d7). Its night table is
//    REFERENCE_TRACE, copied from Territory §4.11 "Scent and posting, night by night".
//  - showcaseRun: the browser slice's L2D2 owner beats (plan §2.2 10:55-11:15 and the tribute morning).
// Raid outcomes are injected (M5 rolls them with §4.5); this file only drives territory acts.
import { createDistrict, createAngerReference, TDATA } from '../../../src/sim/territory/index.js';

/** Sentries the reference posts (Crew §3.3 / Territory §4.11): style → guard role, personality → guard column. */
export const CATS = {
  togemaru: { cat: 'togemaru', style: 'scrapper', personality: 'braggart' },
  pon: { cat: 'pon', style: 'yowler', personality: 'goofball' },
  hige: { cat: 'hige', style: 'bruiser', personality: 'stalwart' },
  kagi: { cat: 'kagi', style: 'yowler', personality: 'schemer' },
};

/** Territory §4.11 trace: Scent after decay and raids, and influence, for nights 1-7 ('r' = rival-held). */
export const REFERENCE_TRACE = [
  { night: 1, LWC: 63, LPY: 'r', PA: 'r', TSS: 'r', DEN: 'r', influence: 25 },
  { night: 2, LWC: 57, LPY: 56, PA: 'r', TSS: 'r', DEN: 'r', influence: 47 },
  { night: 3, LWC: 85, LPY: 78, PA: 58, TSS: 'r', DEN: 'r', influence: 74 },
  { night: 4, LWC: 80, LPY: 76, PA: 87, TSS: 'r', DEN: 'r', influence: 75 },
  { night: 5, LWC: 75, LPY: 69, PA: 77, TSS: 68, DEN: 'r', influence: 100 },
  { night: 6, LWC: 70, LPY: 67, PA: 67, TSS: 66, DEN: 'r', influence: 100 },
  { night: 7, LWC: 65, LPY: 57, PA: 67, TSS: 65, DEN: 60, influence: 99 },
];

/** A quiet take of an outer gang Patch (§3.4): two unseen Over-marks, one Counter-Spray, Keeper, Verdict, Claim. */
export function quietTake(t, id, verdict, log) {
  const row = TDATA.patches[id];
  for (const m of row.rub_marks) log(t.rub(id, m));
  log(t.spray(id));                 // Counter-Spray → Keeper comes with one escort wave
  log(t.encounterEnded({ patch: id, outcome: 'win' }));
  log(t.verdict(id, verdict));
  log(t.spray(id));                 // Claim Spray → 70
}

export function rescueAllFading(t, log) {
  for (const p of t.snapshot().posts) if (p.spray_offer === 'rescue_spray') log(t.spray(p.patch));
}

/**
 * Play the §4.11 reference path. `onDay(t, day, ctx)` is called each morning. Returns {t, anger, days[], events[]}.
 */
export function referenceRun({ seed = 1, onNight = null } = {}) {
  const t = createDistrict({ seed, start: 'l1d1' });
  const anger = createAngerReference(TDATA);
  const events = [];
  const log = evs => { for (const e of evs) { events.push(e); anger.onEvent(e); } return evs; };
  const days = [];
  const night = raid => {
    const { events: ev, report } = t.overnight({ raid });
    log(ev);
    anger.night();
    const row = { night: report.night, influence: report.influence, window_open: report.window_open, anger: anger.value, anger_stage: anger.stage,
      challenger: t.s.challenger ? `${t.s.challenger.id}@${t.s.challenger.patch}` : null, raid: report.raid ? `${report.raid.motive}→${report.raid.patch}: ${report.raid.outcome}` : null };
    for (const id of t.dist.patches) row[id] = t.owner(id) === 'bell' ? t.scent(id) : 'r';
    days.push(row);
    if (onNight) onNight(t, row);
  };

  // Day 1 (L1D1): Low Wall Corner, the PP-03 tutorial escalation
  log(t.discover('hige', 'crew'));
  log(t.rub('LWC', 'LWC.rub1'));
  log(t.spray('LWC'));
  log(t.encounterEnded({ patch: 'LWC', outcome: 'win' }));
  log(t.verdict('LWC', 'chase'));
  log(t.spray('LWC'));
  log(t.discover('togemaru', 'encounter'));
  night(null);

  // Day 2 (L1D2): Laundry Pole Yard from Togemaru (quiet), Recruit (free in Life 1); sniff Daifuku from the perch
  quietTake(t, 'LPY', 'recruit', log);
  for (let i = 0; i < 60; i++) log(t.whisker(1 / 60, { held: true, pos: [0, 0], cats: [{ id: 'daifuku', pos: [6, 7], onScreen: true }] }));
  log(t.whisker(0, { held: false }));
  night(null);

  // Day 3 (L2D1): rescue Sprays, then Persimmon Alley (quiet)
  rescueAllFading(t, log);
  quietTake(t, 'PA', 'chase', log);
  night(null);

  // Day 4 (L2D2): the first forecast raid (grudge → PA); posts taught; PA rescue Sprayed; Caterwaul answered
  rescueAllFading(t, log);
  log(t.setSentry('LPY', CATS.togemaru));
  log(t.setSentry('PA', CATS.pon));
  log(t.catFlap());
  night({ patch: 'PA', motive: 'grudge', leader: 'goma', outcome: 'repelled', presence: true });

  // Day 5 (L2D3): Tofu Shop Step from Kagi (quiet); the Claim Spray fills the bar by Day → the window opens
  rescueAllFading(t, log);
  log(t.setPhase('day'));
  quietTake(t, 'TSS', 'recruit', log);
  log(t.setSentry('PA', null));
  log(t.setSentry('LPY', CATS.hige));
  log(t.setSentry('TSS', CATS.togemaru));
  night({ patch: 'LPY', motive: 'gloat', leader: 'goma', outcome: 'repelled' });

  // Day 6 (L2D4): the challenger beaten by day; Daifuku attempted and lost (no territory change)
  rescueAllFading(t, log);
  log(t.challengerBeaten());
  log(t.encounterEnded({ patch: t.bossWindow().patch, outcome: 'loss' }));
  anger.encounterEnded({ outcome: 'loss', participants: ['daifuku'] });
  night({ patch: 'TSS', motive: 'challenge', leader: 'challenger_1', outcome: 'repelled' }); // declined: beaten by day

  // Day 7 (L2D5): the rematch won, Verdict, Den Claim Spray; posts moved for tonight's grudge raid on TSS
  rescueAllFading(t, log);
  log(t.encounterEnded({ patch: t.bossWindow().patch, outcome: 'win' }));
  anger.encounterEnded({ outcome: 'win', participants: ['daifuku'] });
  log(t.verdict('DEN', 'chase'));
  anger.verdict();
  log(t.spray('DEN'));
  log(t.setSentry('LPY', null));
  log(t.setSentry('PA', CATS.togemaru));
  log(t.setSentry('TSS', CATS.pon));
  night({ patch: 'TSS', motive: 'grudge', leader: 'goma', outcome: 'repelled' });

  return { t, anger, days, events };
}

/**
 * The showcase's L2D2 owner beats: snapshot influence 95 → Rescue Spray the gatepost → 100 (the window);
 * a Sentry on the gatepost; tonight's `challenge` raid with `outcome`. Returns {t, events, before, after, report}.
 */
export function showcaseRun({ seed = 1, guard = CATS.hige, outcome = 'repelled' } = {}) {
  const t = createDistrict({ seed, start: 'showcase_l2d2' });
  const events = [];
  const log = evs => { events.push(...evs); return evs; };
  const before = t.influence();
  log(t.setSentry('LPY', guard));
  log(t.setPhase('morning'));
  const rescue = log(t.spray('LPY'));
  const after = t.influence();
  const { events: ev, report } = t.overnight({ raid: { patch: 'LPY', motive: 'challenge', leader: 'challenger_1', outcome } });
  log(ev);
  return { t, events, rescue, before, after, report };
}

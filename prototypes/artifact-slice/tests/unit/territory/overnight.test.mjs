// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Overnight step 2 (Territory §4.1, §3.7) and the challenger (§3.7.2, §4.15; OR-16; AC 10-12, 16d).
import test from 'node:test';
import assert from 'node:assert/strict';
import { districtWith, ofType } from './helpers.mjs';
import { referenceRun, showcaseRun, REFERENCE_TRACE, CATS } from './reference-bot.mjs';

const RIVAL = { LPY: ['wall_sitters', 80, 'togemaru'], PA: ['wall_sitters', 80, 'pa_tough'], TSS: ['wall_sitters', 80, 'kagi'], DEN: ['wall_sitters', 100, 'daifuku'] };

test('§4.1 example: a fresh claim (70), Unwatched, two rival neighbours drops to 56 after one night', () => {
  // Arrange: PA held; LPY and TSS rival (LWC Mikan's)
  const t = districtWith({ ...RIVAL, LWC: 80, PA: 70 });
  // Act
  const { report } = t.overnight();
  // Assert
  assert.equal(report.patches.PA.decay, 14);
  assert.equal(t.scent('PA'), 56);
});

test('§4.1 examples: Watched with one rival neighbour is −2 a night; staked Schemer Crier −8; staked Goofball Crier +2', () => {
  // Arrange: TSS held (one rival neighbour: the Den), PA held
  const mk = (sentry, staked) => {
    const t = districtWith({ ...RIVAL, LWC: 80, LPY: 80, PA: 80, TSS: 70 });
    t.setSentry('TSS', sentry);
    if (staked) t.s.challenger = { id: 'challenger_1', patch: 'TSS', arrived_night: 1, repels: 0, origin: 'calendar', beaten: false };
    t.overnight();
    return t.scent('TSS') - 70;
  };
  // Act / Assert
  assert.equal(mk({ cat: 'hige', style: 'bruiser', personality: 'stalwart' }, false), -2);
  assert.equal(mk(CATS.kagi, true), -8);
  assert.equal(mk(CATS.pon, true), 2);
});

test('Home Ground: decay halved, never below 10; a rival Keeper recovers +8 to 80; a keeperless rival post fades −10 and lapses at 0', () => {
  // Arrange
  const t = districtWith({ LWC: 12, LPY: ['wall_sitters', 30, 'togemaru'], PA: ['wall_sitters', 10, null], TSS: ['wall_sitters', 78, 'kagi'] });
  // Act
  const { events } = t.overnight();
  // Assert
  assert.equal(t.scent('LWC'), 10, 'floor 10 (12 − floor((10+2+2)×0.5)=7 → 5 → floor)');
  assert.equal(t.scent('LPY'), 38);
  assert.equal(t.scent('TSS'), 80);
  assert.equal(t.owner('PA'), null);
  assert.deepEqual(ofType(events, 'PatchChanged').map(e => [e.patch, e.cause]), [['PA', 'lapsed']]);
});

test('decay over the slice\'s nights reproduces Territory §4.11\'s night-by-night trace (nights 1–7, Scent and influence)', () => {
  // Arrange / Act
  const { days } = referenceRun({ seed: 7 });
  // Assert
  for (const want of REFERENCE_TRACE) {
    const got = days.find(d => d.night === want.night);
    for (const key of ['LWC', 'LPY', 'PA', 'TSS', 'DEN', 'influence']) assert.equal(got[key], want[key], `night ${want.night} ${key}`);
  }
  assert.deepEqual(days.map(d => d.window_open), [false, false, false, false, true, true, true]);
});

test('the reference opens the window at the L2D3 Tofu Shop Step Claim Spray (F7) and the challenger arrives on night 5 at TSS', () => {
  const { events } = referenceRun();
  const opened = events.findIndex(e => e.type === 'BossWindowChanged' && e.open);
  const cause = events.slice(0, opened).filter(e => e.type === 'MarkApplied').pop();
  assert.deepEqual([cause.kind, cause.patch], ['claim_spray', 'TSS']);
  assert.equal(events.slice(0, opened).filter(e => e.type === 'DayStarted').length, 4, 'during day 5 = L2D3');
  assert.deepEqual(ofType(events, 'ChallengerArrived').map(e => [e.night, e.patch]), [[5, 'TSS']]);
  assert.deepEqual(ofType(events, 'DistrictClaimed').length, 1);
});

test('showcase night (plan §5 M5): gatepost guarded, TSS 70 → 58, bar 99, window open', () => {
  // Arrange / Act
  const r = showcaseRun({ guard: CATS.hige, outcome: 'repelled' });
  // Assert
  assert.equal(r.before, 95);
  assert.equal(r.after, 100);
  assert.ok(ofType(r.rescue, 'BossWindowChanged')[0].open);
  assert.equal(r.report.patches.TSS.from, 70);
  assert.equal(r.report.patches.TSS.to, 58);
  assert.equal(r.report.influence, 99);
  assert.equal(r.report.window_open, true);
});

test('raid outcomes: Repelled −5, Scuffed −20 (Anchor −10, Sentry Routed-for-a-night), Lost flips to 40 Stale Claim', () => {
  const run = (outcome, sentry, scent = 40) => {
    const t = districtWith({ ...RIVAL, LWC: 80, LPY: 80, PA: 80, TSS: scent + 2 }); // TSS: −12 + 10 if Watched
    if (sentry) t.setSentry('TSS', sentry);
    const { events } = t.overnight({ raid: { patch: 'TSS', motive: 'grudge', leader: 'goma', outcome } });
    return { t, events };
  };
  const hige = { cat: 'hige', style: 'bruiser', personality: 'stalwart' }, toge = CATS.togemaru;
  assert.equal(run('repelled', toge).t.scent('TSS'), 35);
  assert.equal(run('scuffed', toge).t.scent('TSS'), 20);
  assert.equal(run('scuffed', hige).t.scent('TSS'), 30);
  const lost = run('lost', toge);
  assert.deepEqual([lost.t.owner('TSS'), lost.t.patch('TSS').keeper, lost.t.scent('TSS')], ['wall_sitters', 'goma', 40]);
  assert.deepEqual(ofType(lost.events, 'SentryReturned').map(e => e.cat), ['togemaru']);
});

test('a Routed Sentry leaves its Patch Unwatched for exactly the next night', () => {
  const t = districtWith({ ...RIVAL, LWC: 80, LPY: 80, PA: 80, TSS: 70 });
  t.setSentry('TSS', CATS.togemaru);
  const n1 = t.overnight({ raid: { patch: 'TSS', motive: 'grudge', leader: 'goma', outcome: 'scuffed' } }).report.patches.TSS.watched;
  const n2 = t.overnight().report.patches.TSS.watched;
  const n3 = t.overnight().report.patches.TSS.watched;
  assert.deepEqual([n1, n2, n3], [true, false, true]);
});

test('AC 10–12: Strong at resolution is never Lost; nothing is Lost while the window is open; gloat is never Lost; LWC is never admissible', () => {
  const strong = districtWith({ ...RIVAL, LWC: 80, LPY: 80, PA: 80, TSS: 75 });
  assert.equal(strong.overnight({ raid: { patch: 'TSS', motive: 'grudge', leader: 'goma', outcome: 'lost' } }).report.raid.outcome, 'scuffed');
  const open = districtWith({ ...RIVAL, LWC: 80, LPY: 80, PA: 80, TSS: 40 });
  open.s.window_open = true;
  assert.equal(open.overnight({ raid: { patch: 'TSS', motive: 'grudge', leader: 'goma', outcome: 'lost' } }).report.raid.outcome, 'scuffed');
  const gloat = districtWith({ ...RIVAL, LWC: 80, LPY: 80, PA: 80, TSS: 40 });
  assert.equal(gloat.overnight({ raid: { patch: 'TSS', motive: 'gloat', leader: 'goma', outcome: 'lost' } }).report.raid.outcome, 'scuffed');
  const lwc = districtWith({ ...RIVAL, LWC: 20 });
  assert.equal(lwc.overnight({ raid: { patch: 'LWC', motive: 'grudge', leader: 'goma', outcome: 'lost' } }).report.raid.outcome, 'declined');
  assert.equal(lwc.owner('LWC'), 'bell');
  const life1 = districtWith({ ...RIVAL, LWC: 80, PA: 20 }, { day: 2 });
  assert.equal(life1.raidInadmissible('PA', 'grudge'), 'life_1');
});

test('admissibility: claimed today is immune; no Patch two nights running except a challenge; a held Den only below 75', () => {
  const t = districtWith({ ...RIVAL, LWC: 80, LPY: 50, PA: 50 });
  t.s.patches.TSS.keeper = null; t.spray('TSS');
  assert.equal(t.raidInadmissible('TSS', 'grudge'), 'claimed_today');
  t.overnight({ raid: { patch: 'PA', motive: 'grudge', leader: 'goma', outcome: 'repelled' } });
  assert.equal(t.raidInadmissible('PA', 'grudge'), 'two_nights_running');
  t.s.challenger = { id: 'challenger_1', patch: 'PA', arrived_night: 4, repels: 0, origin: 'calendar', beaten: false };
  assert.equal(t.raidInadmissible('PA', 'challenge'), null);
  const den = districtWith({ LWC: 80, LPY: 80, PA: 80, TSS: 80, DEN: 70 });
  assert.equal(den.raidInadmissible('DEN', 'grudge'), 'den_influence');
});

test('challenger calendar: N3 + 2, then every 4th night, skipped while active; target = lowest Scent held (not LWC/Den), ties → higher yield', () => {
  // Arrange: Mikan first holds 3 Patches at night 3's step 2
  const t = districtWith({ ...RIVAL, LWC: 100, LPY: 100, PA: 100 }, { day: 3, calendar: true });
  t.s.calendar.first_night = null;
  const arrivals = [];
  // Act: seven nights; a Goofball Crier is posted on the stake as soon as it arrives (+2 a night), so the
  // challenge stays active and night 9's arrival is skipped
  for (let n = 0; n < 7; n++) for (const e of t.overnight().events) {
    if (/^Challenger(Arrived|Skipped)/.test(e.type)) arrivals.push([e.night, e.type, e.patch ?? e.reason]);
    if (e.type === 'ChallengerArrived') t.setSentry(e.patch, CATS.pon);
  }
  // Assert
  assert.equal(t.s.calendar.n3, 3);
  assert.deepEqual(arrivals, [[5, 'ChallengerArrived', 'PA'], [9, 'ChallengerSkipped', 'active']], 'LPY and PA tie at 64: the richer PA');
  const tie = districtWith({ LWC: 80, LPY: 66, PA: 66, TSS: 66 });
  assert.equal(tie.challengerTarget(), 'TSS');
});

test('challenger: over-mark −10 from the night after arrival (0 with a posted Goofball), Repelled twice → leaves, Lost → Keeper, beaten → raid declined, no Scent', () => {
  const ch = (night) => ({ id: 'challenger_1', patch: 'PA', arrived_night: night, repels: 0, origin: 'calendar', beaten: false });
  // arrival night: no over-mark
  const a = districtWith({ LWC: 80, LPY: 80, PA: 80, TSS: 80 }); a.s.challenger = ch(5);
  assert.equal(a.overnight().report.patches.PA.overmark, undefined);
  // repelled twice
  const b = districtWith({ LWC: 80, LPY: 80, PA: 80, TSS: 80 }); b.s.challenger = ch(4);
  b.overnight({ raid: { patch: 'PA', motive: 'challenge', outcome: 'repelled' } });
  const second = b.overnight({ raid: { patch: 'PA', motive: 'challenge', outcome: 'repelled' } }).events;
  assert.deepEqual(ofType(second, 'ChallengeEnded').map(e => e.reason), ['repelled_twice']);
  assert.equal(b.s.challenger, null);
  // lost → it is the Keeper
  const c = districtWith({ LWC: 80, LPY: 80, PA: 35, TSS: 80 }); c.s.challenger = ch(4);
  c.overnight({ raid: { patch: 'PA', motive: 'challenge', outcome: 'lost' } });
  assert.deepEqual([c.owner('PA'), c.patch('PA').keeper, c.scent('PA')], ['outsiders', 'challenger_1', 40]);
  // beaten by day → declined; the win adds no Scent
  const d = districtWith({ LWC: 80, LPY: 80, PA: 50, TSS: 80 }); d.s.challenger = ch(4);
  const before = d.scent('PA');
  d.encounterEnded({ patch: 'PA', outcome: 'win' }); d.challengerBeaten();
  assert.equal(d.scent('PA'), before);
  const r = d.overnight({ raid: { patch: 'PA', motive: 'challenge', outcome: 'lost' } }).report;
  assert.equal(r.raid.outcome, 'declined');
  assert.equal(r.patches.PA.overmark, undefined);
  // its target lapses first → it settles as Keeper at 60
  const e = districtWith({ LWC: 80, LPY: 80, PA: 15, TSS: 80 }); e.s.challenger = ch(4);
  e.overnight();
  assert.deepEqual([e.owner('PA'), e.patch('PA').keeper, e.scent('PA')], ['outsiders', 'challenger_1', 60]);
});

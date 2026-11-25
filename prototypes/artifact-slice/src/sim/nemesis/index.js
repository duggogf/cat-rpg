// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Nemesis ("Rivals") simulation entry point. See API.md. Pure, deterministic, headless: no DOM, no Math.random,
// no wall clock. The presentation calls verbs, reads snapshot()/board()/boardView() and plays the returned events.
import { Town, dayLabel } from './town.js';
import { NDATA, buildNemesisData } from './data.js';
import { board, boardView, nameCard, rivalCard, tags, sniff, pose, placement, marks, historyLine } from './board.js';
import * as F from './formulas.js';

// Display queries (read-only) mixed onto the Town.
Object.assign(Town.prototype, {
  board() { return board(this); },
  boardView() { return boardView(this); },
  nameCard(id) { return nameCard(this, id); },
  rivalCard(id) { return rivalCard(this, id); },
  tags(id) { return tags(this, id); },
  sniff(o) { return sniff(this, o); },
  /** Clears the tape stars ("new since last night") when the board is opened (key-screens §2.5). */
  boardOpened() { this.s.changed = {}; return []; },
  /** Plain snapshot for rendering and saving. */
  snapshot() {
    const s = this.s;
    const lead = this.leadCat();
    return {
      day: s.day, life: s.life, day_label: dayLabel(this.k, s.day), phase: s.phase, clout: s.clout, branch: this.branch(),
      cats: JSON.parse(JSON.stringify(s.cats)), offer: this.verdictOffer(), encounter: s.enc ? { ...s.enc } : null, raid: s.raid,
      arc: lead ? { cat: lead.id, open: lead.arc_role === 'lead', declared: lead.nemesis, face: lead.face, declared_night: lead.declared_night,
        closed_how: lead.arc_closed_how, achieved: lead.arc_achieved, encounters: lead.encounters, marks: Math.min(2, lead.scars.length) + (lead.title_from_mikan ? 1 : 0) } : null,
      verdicts: [...s.verdicts], board: this.board(),
    };
  },
  /**
   * Feed one tick's (or one fight's) Combat events. ctx: {patch, opener?, alias?: {combatId: nemesisId}}.
   * EncounterStarted → beginEncounter; CatRouted → routed; FearTriggered (a prop, not the tell) → fear;
   * BossFlee → fled; EncounterEnded → endEncounter. AllyJoined is already decided by beginEncounter (its `joiner`).
   */
  onCombat(events, ctx = {}) {
    const al = id => (ctx.alias?.[id] ?? this.D.combatAlias[id] ?? id);
    const out = [];
    for (const e of events || []) {
      if (e.type === 'EncounterStarted') out.push(...this.beginEncounter({ patch: ctx.patch ?? null, opener: ctx.opener ?? e.opener ?? 'standoff',
        posse: (e.posse || []).map(al), opponents: (e.enemies || []).map(al) }));
      else if (e.type === 'CatRouted') {
        if (e.side === 'enemy') out.push(...this.routed(al(e.cat), { by: e.by ? al(e.by) : null, how: e.how }));
        else if (al(e.cat) === 'mikan') out.push(...this.routed('mikan', { by: e.by ? al(e.by) : null }));
      } else if (e.type === 'FearTriggered' && e.source !== 'tell') out.push(...this.fear(al(e.cat), e.fear));
      else if (e.type === 'BossFlee') out.push(...this.fled(al(e.cat ?? e.boss)));
      else if (e.type === 'EncounterEnded') out.push(...this.endEncounter({ outcome: e.outcome, victor_ids: (e.victor_ids || []).map(al) }));
    }
    return out;
  },
});

const mark = (patch, kind, target_clowder, rub = null) => ({ type: 'MarkApplied', district: 'hidamari', patch, post: null, by: 'mikan', kind, target_clowder, rub_mark: rub });

/**
 * The reference arc, played by the rules (plan §2.2; Nemesis §3.16). Each step returns its events.
 * Used by createTown({start: 'showcase_l2d2'}), tools/nemesis-run.mjs and the tests.
 */
export const ARC = {
  /** L1D1: the LWC claim (a Stray's post: no anger), then Togemaru's Standoff and his uninterruptible flee. */
  l1d1(t) {
    const ev = [];
    ev.push(...t.onTerritory([mark('LWC', 'over_mark', 'strays', 'LWC.rub1'), mark('LWC', 'counter_spray', 'strays'), mark('LWC', 'claim_spray', 'bell')]));
    ev.push(...t.beginEncounter({ patch: 'LWC', opener: 'standoff', posse: ['mikan', 'hige'], opponents: ['togemaru'] }));
    ev.push(...t.endEncounter({ outcome: 'rival_fled' }));
    return ev;
  },
  night(t, n) { return t.night({ mikan_patches: n, challenger_target: 'LPY', raid_target: 'LPY' }); },
  /** L1D2: the Sniff, the memory line, a typical take (2 Over-marks + 1 Counter-Spray), the two-cat fight, the Verdict offer. */
  l1d2(t, { ambush = false, counterSprays = 1 } = {}) {
    const ev = [];
    ev.push({ type: 'Sniff', ...t.sniff({ consume: true }) });
    ev.push(...t.onTerritory([mark('LPY', 'over_mark', 'wall_sitters', 'LPY.rub1'), mark('LPY', 'over_mark', 'wall_sitters', 'LPY.rub2')]));
    for (let i = 0; i < counterSprays; i++) ev.push(...t.onTerritory([mark('LPY', 'counter_spray', 'wall_sitters')]));
    ev.push(...t.beginEncounter({ patch: 'LPY', opener: ambush ? 'ambush' : 'standoff', posse: ['mikan', 'hige'], opponents: ['togemaru', 'goma'] }));
    ev.push(...t.routed('goma', { by: 'hige', how: 'by_hit' }));
    ev.push(...t.routed('togemaru', { by: 'mikan', how: 'by_pile_on' }));
    ev.push(...t.endEncounter({ outcome: 'win' }));
    return ev;
  },
  /** L1D2 8:35: the Whisker Sense sniff on Daifuku (Territory emits CatDiscovered; fed here). */
  sniffDaifuku(t) { return t.onTerritory([{ type: 'CatDiscovered', cat: 'daifuku', how: 'sniff' }]); },
  /** Showcase L2D1 (plan §2.4 'Kagi in truce'): a quiet Tofu Shop Step take and a Nose-Touch on Kagi, by the rules. */
  kagiTruce(t) {
    const K = t.D.showcase.l2d1_kagi_truce, ev = [];
    if (!K || t.cat('kagi').state !== 'Seated') return ev;
    for (let i = 0; i < K.over_marks; i++) ev.push(...t.onTerritory([mark(K.patch, 'over_mark', 'wall_sitters', `${K.patch}.rub${i + 1}`)]));
    for (let i = 0; i < K.counter_sprays; i++) ev.push(...t.onTerritory([mark(K.patch, 'counter_spray', 'wall_sitters')]));
    ev.push(...t.beginEncounter({ patch: K.patch, posse: K.posse, opponents: ['kagi'] }));
    ev.push(...t.routed('kagi', { by: K.finisher, how: 'by_hit' }));
    ev.push(...t.endEncounter({ outcome: 'win' }));
    ev.push(...t.applyVerdict(K.verdict));
    return ev;
  },
  /**
   * TEST / SHOWCASE ONLY (review round 1, fix 2): a Life 2 Rout of Kagi so the Bribe row comes from a real offer (mock 07).
   * A quiet Tofu Shop Step take (his gate stays open), the Posse Routs him, Stash set before the fight ends (F8 reads it at
   * the offer). The offer is left pending for the Verdict. Kagi is slice-recruitable (Nemesis §3.1 DR-01).
   */
  kagiRout(t, { stash = 150 } = {}) {
    const K = t.D.showcase.l2d1_kagi_truce, ev = [];
    for (let i = 0; i < K.over_marks; i++) ev.push(...t.onTerritory([mark(K.patch, 'over_mark', 'wall_sitters', `${K.patch}.rub${i + 1}`)]));
    for (let i = 0; i < K.counter_sprays; i++) ev.push(...t.onTerritory([mark(K.patch, 'counter_spray', 'wall_sitters')]));
    ev.push(...t.setStash(stash));
    ev.push(...t.beginEncounter({ patch: K.patch, posse: K.posse, opponents: ['kagi'] }));
    ev.push(...t.routed('kagi', { by: K.finisher, how: 'by_hit' }));
    ev.push(...t.endEncounter({ outcome: 'win' }));
    return ev;
  },
  /** L2D1 (A): his truce greeting at the gatepost (encounter 3, F11). */
  l2d1(t) { return t.cat('togemaru').state === 'Truce' ? t.greet('togemaru', { patch: 'LPY' }) : []; },
};

/** Togemaru's L1D2 Verdict by branch letter. */
export const BRANCH_VERDICT = { A: 'nose', B: 'recruit', C: 'chase' };

/**
 * Create the town.
 * @param o {seed, start: 'l1d1' | 'showcase_l2d2' | 'test_l2_kagi_rout', branch: 'A'|'B'|'C' (showcase_l2d2), showcase
 *          (seeds; implied by showcase_l2d2), overrides (constants merged over rivals.json)}
 * The showcase_l2d2 start plays L1D1–L2D1 by the rules from the chosen Verdict, then applies the showcase seeds
 * (Daifuku Furious 95, the night-3 challenger with its forced Rival tag, join-in p 1.0). `town.startLog` keeps the events.
 */
export function createTown({ seed = 1, start = 'l1d1', branch = 'A', showcase = false, overrides = null } = {}) {
  const data = overrides ? buildNemesisData(overrides) : NDATA;
  const sc = showcase || start === 'showcase_l2d2';
  const t = new Town({ seed, showcase: sc, data });
  t.startLog = [];
  if (start === 'showcase_l2d2') {
    if (!BRANCH_VERDICT[branch]) throw new Error(`branch must be A, B or C (got ${branch})`);
    const L = t.startLog;
    L.push(...ARC.l1d1(t), ...ARC.night(t, 1), ...ARC.l1d2(t), ...t.applyVerdict(BRANCH_VERDICT[branch]), ...ARC.sniffDaifuku(t), ...ARC.night(t, 2));
    t.sniff({ consume: false }); // L2D1's Sniff is not seen in the jump (the closing card waits for L2D2)
    L.push(...ARC.l2d1(t), ...ARC.kagiTruce(t), ...ARC.night(t, 3));
    const S = t.D.showcase;
    const d = t.cat('daifuku'); if (d && d.anger != null) d.anger = S.daifuku_anger; // seeded snapshot (Nemesis A-9), not the anger rule
    for (const id of S.discovered) L.push(...t.discover(id, 'showcase'));
    t.s.day = S.l2d2_day; // already day 4 after night 3: asserted, not forced
  } else if (start === 'test_l2_kagi_rout') {
    // TEST / SHOWCASE ONLY: branch B's Life 1 (Togemaru recruited free, so the Crew is 4/6 on L2D1), then Kagi Routed on
    // L2D1 with Stash 150 and his Verdict offer pending: Fair 96 open, Feast 192 short (mock 07). Played by the rules.
    const L = t.startLog;
    L.push(...ARC.l1d1(t), ...ARC.night(t, 1), ...ARC.l1d2(t), ...t.applyVerdict('recruit'), ...ARC.sniffDaifuku(t), ...ARC.night(t, 2));
    t.sniff({ consume: false });
    L.push(...ARC.kagiRout(t));
  } else if (start !== 'l1d1') throw new Error(`unknown start ${start}`);
  return t;
}

export { Town, NDATA, buildNemesisData, F, pose, placement, marks, historyLine };

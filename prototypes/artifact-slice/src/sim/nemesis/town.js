// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The town's Rivals state (design/gdd/nemesis-system.md, owner-feedback + consistency passes 2026-11-24).
// Pure, deterministic, headless. The binding working rule (nemesis-patent-analysis.md §5; consistency pass):
// NOTHING MIKAN DOES TO ONE CAT MAY CHANGE A DIFFERENT CAT. Every write below lands on the record of the cat the
// rule is about (the Verdict cat, the victor, the joiner, the Boss on a mark of his own gang's thing). Town-level
// fields (day, contest counters, bark anti-repeat, Sniff queue, tape stars) are presentation and calendar state.
import { Stream } from '../core/rng.js';
import { hashOf } from '../core/hash.js';
import { NDATA, buildNemesisData } from './data.js';
import { round, clamp, lifeOf, angerStage, stageIndex, ledger, applyLedger, noseGate, scarChance, joinChance, bribe,
  startingLoyalty, drift, arcScore, dayLabel } from './formulas.js';
import { entry, remember, hasKind, lastOf } from './memory.js';
import { selectLine, standoffTrigger } from './barks.js';

const HOSTILE = new Set(['Seated', 'Roaming', 'Challenging']);
const RESIST = new Set(['braggart', 'stalwart', 'brooder']);
const clone = o => JSON.parse(JSON.stringify(o));

export { dayLabel };

export class Town {
  /**
   * @param {object} o {seed, showcase (apply showcase_overrides seeds), data (a buildNemesisData() bundle)}
   */
  constructor({ seed = 1, showcase = false, data = null } = {}) {
    this.D = data || NDATA;
    this.seed = seed >>> 0;
    this.showcase = !!showcase;
    const k = this.D.k;
    this.s = {
      day: 1, life: 1, phase: 'morning', clout: k.clout.by_life['1'], clout_set: null, serial: 0, stash: null,
      cats: {}, barks: { said: {}, recent: [], retired: {} }, contest: {}, enc: null, offer: null,
      sniff_queue: [], changed: {}, discovery_seq: 0, mikan_plaster_day: null, window_open: false,
      calendar: { h: null, next: null }, raid: null, verdicts: [],
    };
    for (const row of Object.values(this.D.cats)) this.s.cats[row.Name] = this._fresh(row);
    for (const r of this.D.relations) this._tie(r.a, r.b, r.kind, r.source);
    this._dayStart();
  }

  /* ------------------------------------------------------------------ records */

  _fresh(row) {
    const k = this.D.k, st = row.start || {};
    let g = st.grudge;
    if (g == null) { const r = new Stream(this.seed, `gen:${row.Name}`); g = k.generation.grudge_base + Math.floor(r.float() * (k.generation.grudge_rng + 1)); }
    const pers = row.personality ? k.personalities[row.personality] : null;
    const c = {
      id: row.Name, display: row.display, title: row.title ?? null, title_from_mikan: false, scene: row.scene, clowder: row.clowder,
      home_scene: row.scene, home_clowder: row.clowder, role: row.role, personality: row.personality, style: row.style, level: row.level,
      fears: [...(row.fears || [])], fears_known: [], strengths: [...(row.strengths || [])], scars: [], keeper_of: row.keeper_of ?? null,
      old_patch: null, origin: row.origin, tracked: !!row.tracked, uphill: !!row.uphill, recruitable_slice: !!row.recruitable_slice,
      state: st.state || 'Seated', grudge: g, regard: st.regard ?? k.generation.regard,
      discovered: !!st.discovered, discovered_how: st.discovered ? 'crew' : null, discovered_day: st.discovered ? 0 : null, discovered_order: st.discovered ? 0 : null,
      memory: [], relations: [], encounters: 0, routs_by_player: 0, last_enc_day: null,
      anger: row.anger ?? null, truce_until_day: null, challenge: null,
      arc_role: row.arc_role || 'none', nemesis: false, face: null, declared_night: null, arc_closed_how: null, arc_achieved: false,
      flee_threshold: row.flee_threshold ?? pers?.flee ?? null, loyalty: row.loyalty ?? null, old_gang_nerves: false,
      former_rank: null, former_clowder: row.former_clowder ?? null, signature_strength: null, joined_day: null,
      plaster_until_day: null, rematch_nerve: 0, ex_crew: false, crew_from_day: row.crew_from_day ?? null,
      recruit_day: null, bribe_paid: null,
    };
    for (const m of row.memory_authored || []) c.memory.push(entry(m.day, m.kind, { other_id: m.other_id }));
    if (c.state === 'Crew' && c.id !== 'mikan' && c.memory.some(e => e.kind === 'OLD_GANG')) c.old_gang_nerves = pers ? !RESIST.has(row.personality) : false;
    return c;
  }

  _tie(a, b, kind, source) {
    const A = this.s.cats[a], B = this.s.cats[b];
    if (!A || !B) return;
    if (!A.relations.some(r => r.other_id === b && r.kind === kind)) A.relations.push({ kind, other_id: b, source });
    if (!B.relations.some(r => r.other_id === a && r.kind === kind)) B.relations.push({ kind, other_id: a, source });
  }

  cat(id) { return this.s.cats[id] ?? null; }
  get k() { return this.D.k; }
  get day() { return this.s.day; }
  get life() { return this.s.life; }
  /** The fixed arc lead (Togemaru), open or closed: the slot stays his as a record (§3.6). */
  leadCat() { return Object.values(this.s.cats).find(c => c.arc_role === 'lead' || c.arc_closed_how) ?? null; }
  _isTracked(id) { const c = this.s.cats[id]; return !!c && c.tracked && !c.uphill && c.state !== 'Crew' && c.state !== 'Gone' && c.state !== 'Offstage'; }
  _rank(c) { return this.k.rank_order[c.role] ?? 0; }
  _marks(c) { return Math.min(2, c.scars.length) + (c.title_from_mikan ? 1 : 0); }
  _changed(id) { this.s.changed[id] = this.s.day; }
  _bossOf(clowder) { return Object.values(this.s.cats).find(c => c.role === 'boss' && c.home_clowder === clowder && clowder !== 'bell') ?? null; }

  /* ------------------------------------------------------------------ time */

  _dayStart() {
    const s = this.s, k = this.k;
    s.life = lifeOf(k, s.day);
    s.clout = s.clout_set ?? k.clout.by_life[String(s.life)] ?? k.clout.by_life['2'];
    s.phase = 'morning';
    s.contest = {};
    const ev = [];
    // Story recruits and the Friend Stray join on their fixed beat (Crew §3.4.2-3.4.3; plan §2.1).
    for (const c of Object.values(s.cats)) if (c.state === 'Offstage' && c.crew_from_day != null && c.crew_from_day <= s.day) ev.push(...this.crewJoin(c.id));
    return ev;
  }

  setPhase(p) { this.s.phase = p; return []; }
  setClout(c) { this.s.clout_set = c; this.s.clout = c; return []; }
  setStash(n) { this.s.stash = n; return []; }

  /** A story beat or the Friend Stray: the cat joins the Crew (Crew §3.4.2-3.4.3) and is discovered (Crew always are). */
  crewJoin(id) {
    const c = this.s.cats[id];
    if (!c || c.state === 'Crew') return [];
    c.state = 'Crew'; c.scene = 'bell'; c.clowder = 'bell';
    const ev = [{ type: 'CrewJoined', cat: id, how: 'story' }];
    ev.push(...this.discover(id, 'crew'));
    this._changed(id);
    return ev;
  }

  /* ------------------------------------------------------------------ discovery (§3.13) */

  /** A player-knowledge flag: changes nothing else about the cat. */
  discover(id, how = 'encounter', { emit = true } = {}) {
    const c = this.s.cats[id];
    if (!c || c.discovered || c.uphill) return [];
    c.discovered = true; c.discovered_how = how; c.discovered_day = this.s.day; c.discovered_order = ++this.s.discovery_seq;
    this._changed(id);
    return emit ? [{ type: 'CatDiscovered', cat_id: id, cat: id, how }] : [];
  }

  /* ------------------------------------------------------------------ territory events in */

  /** Feed Territory's events: MarkApplied (anger F10, F4 count, the Keeper row), CatDiscovered, BossWindowChanged, ContestEnded. */
  onTerritory(events) {
    const out = [];
    for (const e of events || []) {
      if (e.type === 'MarkApplied') out.push(...this.markApplied(e));
      else if (e.type === 'CatDiscovered') out.push(...this.discover(this.D.territoryAlias[e.cat] ?? e.cat, e.how || 'sniff', { emit: false }));
      else if (e.type === 'BossWindowChanged') {
        const was = this.s.window_open; this.s.window_open = !!e.open;
        if (e.open && !was) { const b = this._bossOf('wall_sitters'); if (b && b.anger !== null) this.s.sniff_queue.push({ kind: 'boss_window', cat: b.id, day: this.s.day }); }
      } else if (e.type === 'ContestEnded') delete this.s.contest[e.patch];
    }
    return out;
  }

  /**
   * MarkApplied(patch, district, kind, target_clowder). Anger: +5 over_mark / +15 counter_spray on the Boss's OWN
   * Clowder's objects in his district (A-9); never claim or rescue sprays. Only the Boss's record changes.
   */
  markApplied(e) {
    const k = this.k, ev = [];
    const ct = (this.s.contest[e.patch] ||= { over: 0, counter: 0, marked: false });
    if (e.kind === 'counter_spray') { ct.counter++; ct.marked = true; }
    if (e.kind === 'over_mark') { ct.over++; ct.marked = true; }
    if (k.anger.never_sources.includes(e.kind)) return ev;
    const boss = this._bossOf(e.target_clowder);
    if (!boss || boss.anger === null || boss.state === 'Gone' || boss.state === 'Crew') return ev;
    const add = e.kind === 'over_mark' ? k.anger.over_mark : e.kind === 'counter_spray' ? k.anger.counter_spray : 0;
    if (!add) return ev;
    ev.push(...this._setAnger(boss, Math.min(k.anger.max, boss.anger + add), e.kind));
    return ev;
  }

  _setAnger(boss, v, cause) {
    const k = this.k, before = angerStage(k, boss.anger).stage;
    boss.anger = v;
    const after = angerStage(k, v).stage;
    if (before !== after) { this._changed(boss.id); return [{ type: 'AngerChanged', boss_id: boss.id, stage: after, from: before, puffs: angerStage(k, v).puffs, cause }]; }
    return [];
  }

  /* ------------------------------------------------------------------ encounters */

  /**
   * Start an encounter (a Standoff or a Rival Ambush). Discovers tracked participants, counts the encounter, picks the
   * Standoff line, rolls the join-in (F11) and plays Old Gang reactions.
   * @param o {patch, opener: 'standoff'|'ambush'|'ambushed', posse: [ids], opponents: [ids incl. untracked], combatants?}
   * @returns events; `this.s.enc` holds the encounter (`joiner` for the director: pick the combat def with the guest)
   */
  beginEncounter({ patch = null, opener = 'standoff', posse = ['mikan'], opponents = [], combatants = null } = {}) {
    const s = this.s, k = this.k, ev = [];
    if (s.enc) ev.push(...this.endEncounter({ outcome: 'aborted' }));
    s.serial++;
    const tracked = opponents.filter(id => this._isTracked(id));
    const enc = s.enc = { serial: s.serial, day: s.day, patch, opener, posse: [...posse], opponents: [...opponents], tracked,
      routed: [], fear: {}, fled: [], joiner: null, lick_in: [], mikan_routed_by: null, anger_at_standoff: {}, headline: null };
    for (const id of tracked) {
      const c = s.cats[id];
      ev.push(...this.discover(id, 'encounter'));
      this._meet(c, patch, false);
      if (c.anger !== null && c.anger !== undefined) enc.anger_at_standoff[id] = angerStage(k, c.anger).stage;
    }
    // Standoff headline: the highest-ranked tracked opponent; ties: earlier first meeting, then lower id (§5).
    const head = [...tracked].sort((a, b) => this._cmpRank(s.cats[a], s.cats[b]))[0];
    if (head) {
      enc.headline = head;
      const line = this.standoff(head, { patch, posse, opponents, opener });
      ev.push({ type: 'Standoff', cat: head, ...line, card: this.nameCard(head) });
    }
    // Old Gang Nerves (§3.18): only the recruit's own reaction, from its own memory.
    for (const pid of posse) {
      const p = s.cats[pid];
      const og = p && p.state === 'Crew' && lastOf(p, 'OLD_GANG');
      if (!og || !opponents.includes(og.other_id)) continue;
      const resists = !p.old_gang_nerves || (p.loyalty ?? 0) >= k.nerves.sworn_loyalty;
      const trig = resists ? 'OLD_GANG_DEFIANT' : 'OLD_GANG_FLINCH';
      const line = selectLine(this, pid, trig, { patch, opponents });
      ev.push({ type: 'OldGangReaction', cat: pid, old_boss: og.other_id, kind: resists ? 'defiant' : 'flinch',
        cowed_s: resists ? 0 : (p.personality === 'fraidy' ? k.nerves.cowed_s_fraidy : k.nerves.cowed_s), line });
    }
    // Join-in (F11; §3.17): Life 2+, a Truce/Friend cat in the district holding a Rival tag on an opponent.
    if (s.life >= k.join_in.from_life) {
      const count = combatants ?? (posse.length + opponents.length);
      const cands = Object.values(s.cats).filter(c => (c.state === 'Truce' || c.state === 'Friend') && c.home_scene === 'lane'
        && c.joined_day !== s.day && !posse.includes(c.id) && !opponents.includes(c.id)
        && c.relations.some(r => r.kind === 'rival' && opponents.includes(r.other_id))).sort((a, b) => (a.id < b.id ? -1 : 1));
      for (const c of cands) {
        if (count + 1 > k.join_in.max_combatants) break;
        const near = !!patch && !!c.old_patch && (patch === c.old_patch || (this.D.patches[c.old_patch]?.neighbours || []).includes(patch));
        const p = this.showcase ? this.D.showcase.join_in_p : joinChance(k, { near, regard: c.regard });
        const roll = new Stream(this.seed, `join:${enc.serial}:${c.id}`).float();
        const joined = roll < p;
        ev.push({ type: 'JoinRolled', cat: c.id, p: +p.toFixed(4), near, joined });
        if (!joined) continue;
        enc.joiner = c.id;
        c.joined_day = s.day;
        ev.push(...this.discover(c.id, 'encounter'));
        this._meet(c, patch, true);
        this._changed(c.id);
        const line = selectLine(this, c.id, 'ALLY_JOIN', { patch, opponents });
        ev.push({ type: 'AllyJoined', cat_id: c.id, cat: c.id, encounter_id: enc.serial, yowl_s: k.join_in.yowl_s, line });
        break;
      }
    }
    return ev;
  }

  /** A counted meeting (§3.7): FIRST_MEETING once; a greeting or join-in counts only if no meeting counted today. */
  _meet(c, patch, soft) {
    if (!hasKind(c, 'FIRST_MEETING')) remember(this.k, c, entry(this.s.day, 'FIRST_MEETING', { patch }));
    if (soft && c.last_enc_day === this.s.day) return false;
    c.encounters++; c.last_enc_day = this.s.day;
    return true;
  }

  _cmpRank(a, b) {
    const r = this._rank(b) - this._rank(a);
    if (r) return r;
    const fa = lastOf(a, 'FIRST_MEETING')?.day ?? 1e9, fb = lastOf(b, 'FIRST_MEETING')?.day ?? 1e9;
    if (fa !== fb) return fa - fb;
    return a.id < b.id ? -1 : 1;
  }

  /**
   * A non-hostile Standoff-group meeting (`TRUCE_GREET`) with a Truce cat or Friend: counts as an encounter (F11),
   * at most one counted meeting a day. Changes only that cat.
   */
  greet(id, { patch = null } = {}) {
    const c = this.s.cats[id];
    if (!c || (c.state !== 'Truce' && c.state !== 'Friend')) return [];
    const ev = [...this.discover(id, 'encounter')];
    const counted = this._meet(c, patch, true);
    const line = this.standoff(id, { patch });
    ev.push({ type: 'Standoff', cat: id, ...line, greeting: true, counted, card: this.nameCard(id) });
    return ev;
  }

  /** CatRouted (Combat): `by` the finisher's id, `how` 'by_hit'|'by_pile_on'|'by_back_down'; optional damage_type. */
  routed(id, { by = null, how = 'by_hit', damage_type = null } = {}) {
    const enc = this.s.enc;
    if (!enc) return [];
    if (id === 'mikan') { enc.mikan_routed_by = by; if (by && enc.tracked.includes(by) && !enc.lick_in.includes(by)) enc.lick_in.push(by); return []; }
    if (!enc.tracked.includes(id) || enc.routed.some(r => r.cat === id)) return [];
    const byPileOn = how === 'by_pile_on';
    const style = by ? (this.s.cats[by]?.style ?? this.D.combatStyle[by] ?? null) : null;
    enc.routed.push({ cat: id, by, by_pile_on: byPileOn, damage_type: damage_type ?? this.k.damage_by_style[style] ?? 'claw' });
    return [];
  }

  /** FearTriggered (Combat, a prop hit, not the 'tell'). */
  fear(id, fear) {
    const enc = this.s.enc;
    if (!enc || !enc.tracked.includes(id)) return [];
    (enc.fear[id] ||= []).includes(fear) || enc.fear[id].push(fear);
    const c = this.s.cats[id]; // a Fear is revealed when triggered (§3.13): that cat's own known-Fear flag
    if (!c.fears_known.includes(fear)) c.fears_known.push(fear);
    return [];
  }

  /** A tracked opponent fled mid-encounter (normal flee). */
  fled(id) { const enc = this.s.enc; if (enc && enc.tracked.includes(id) && !enc.fled.includes(id)) enc.fled.push(id); return []; }

  /** The §3.5 rows this cat took part in this encounter (verdict rows excluded). */
  _items(c, enc, outcome, { routedRow = null, fledNow = false } = {}) {
    const L = this.k.ledger_events, it = [];
    if (enc.opener === 'ambush') it.push({ row: 'ambushed_by_player', ...L.ambushed_by_player });
    if (routedRow) {
      it.push({ row: 'routed', ...L.routed });
      if (routedRow.by_pile_on) it.push({ row: 'by_pile_on', ...L.by_pile_on });
      if ((enc.fear[c.id] || []).length) it.push({ row: 'fear_this_fight', ...L.fear_this_fight });
      if (outcome === 'win' && (enc.opener === 'standoff' || enc.opener === 'ambushed') && !(enc.fear[c.id] || []).length) it.push({ row: 'clean_win', ...L.clean_win });
    }
    if (enc.patch && c.keeper_of === enc.patch && this.s.contest[enc.patch]?.marked) it.push({ row: 'keeper_marked', ...L.keeper_marked });
    if (fledNow) it.push({ row: 'fled', ...L.fled });
    if (outcome === 'player_fled') it.push({ row: 'player_fled', ...L.player_fled });
    return it;
  }

  _apply(c, items) {
    const L = ledger(this.k, c.personality, c.encounters, items);
    const r = applyLedger(this.k, c.grudge, c.regard, L);
    const before = { grudge: c.grudge, regard: c.regard };
    c.grudge = r.grudge; c.regard = r.regard;
    return { ...L, before, after: { grudge: c.grudge, regard: c.regard }, rows: items.map(i => i.row) };
  }

  _encEntry(kind, c, enc, extra = {}) {
    return entry(this.s.day, kind, { patch: enc.patch, opener: enc.opener, serial: enc.serial, own_post: !!enc.patch && c.keeper_of === enc.patch, ...extra });
  }

  /** Scar on a Rout by the Posse (F7; §3.8 table; Togemaru's first Rout always scars). */
  _scar(c, rr, enc) {
    const k = this.k;
    c.routs_by_player++;
    const p = scarChance(k, { catId: c.id, routsByPlayer: c.routs_by_player, byPileOn: rr.by_pile_on, scarsFromMikan: c.scars.length });
    const roll = new Stream(this.seed, `scar:${enc.serial}:${c.id}`).float();
    if (!(roll < p)) return null;
    const type = (enc.fear[c.id] || []).includes('water') ? k.scar_by_damage.water : k.scar_by_damage[rr.damage_type] ?? 'notch';
    c.scars.push({ type, day: this.s.day, serial: enc.serial });
    remember(k, c, this._encEntry('SCAR', c, enc, { scar: type, damage_type: rr.damage_type }));
    return { type, p };
  }

  _glory(c) {
    if (c.title) return null;
    const t = this.k.personalities[c.personality]?.glory_title;
    if (!t) return null;
    c.title = t; c.title_from_mikan = true;
    remember(this.k, c, entry(this.s.day, 'TITLE', { title: t }));
    return t;
  }

  /**
   * EncounterEnded. outcome: 'win' | 'loss' | 'rival_fled' | 'player_fled'. On a win with a Routed tracked Rival it
   * holds the Verdict for the highest-ranked one (`verdictOffer()`); others slip away now with their rout items.
   * @param o {outcome, victor_ids (loss)}
   */
  endEncounter({ outcome, victor_ids = [] } = {}) {
    const s = this.s, k = this.k, enc = s.enc, ev = [];
    if (!enc) return ev;
    s.enc = null;
    if (outcome === 'aborted') return ev;
    const report = { serial: enc.serial, outcome, ledgers: {}, scars: {}, slipped_away: [], verdict_cat: null };
    const fears = id => (enc.fear[id] || []);

    if (outcome === 'loss') {
      // Only the victor changes (§3.10, G1).
      const vid = (enc.mikan_routed_by && enc.tracked.includes(enc.mikan_routed_by) && victor_ids.includes(enc.mikan_routed_by)) ? enc.mikan_routed_by
        : victor_ids.filter(id => enc.tracked.includes(id)).sort((a, b) => this._cmpRank(s.cats[a], s.cats[b]))[0];
      s.mikan_plaster_day = s.day + k.plaster.mikan_plaster_days;
      if (vid) {
        const c = s.cats[vid];
        const L = k.ledger_events.won;
        report.ledgers[vid] = this._apply(c, [{ row: 'won', g: L.g, r: c.personality === 'stalwart' ? L.r_stalwart : L.r }]);
        remember(k, c, this._encEntry('WON', c, enc));
        const title = this._glory(c);
        if (c.role === 'boss') c.rematch_nerve = Math.max(k.plaster.boss_stack_max, round((c.rematch_nerve + k.plaster.boss_rematch_nerve) * 100) / 100);
        if (c.anger !== null && k.anger.spent_on.includes('loss')) ev.push(...this._setAnger(c, 0, 'spent'));
        const gloat = selectLine(this, vid, k.personalities[c.personality]?.gloat || 'GLOAT_SWAT', { patch: enc.patch });
        this._changed(vid);
        ev.push({ type: 'VictorRecorded', cat: vid, title, gloat });
        report.victor = vid;
      }
      ev.push({ type: 'NemesisEncounterResolved', ...report });
      return ev;
    }

    const routedIds = enc.routed.map(r => r.cat);
    const standing = enc.tracked.filter(id => !routedIds.includes(id));
    const fledIds = outcome === 'rival_fled' ? [...new Set([...enc.fled, ...standing])] : enc.fled.filter(id => !routedIds.includes(id));

    // The Verdict cat: the highest-ranked Routed tracked Rival in a won fight (§3.11).
    let vcat = null;
    if (outcome === 'win' && routedIds.length) vcat = [...routedIds].sort((a, b) => this._cmpRank(s.cats[a], s.cats[b]))[0];
    report.verdict_cat = vcat;

    for (const id of enc.tracked) {
      const c = s.cats[id];
      const rr = enc.routed.find(r => r.cat === id) || null;
      const isFled = fledIds.includes(id);
      if (rr) {
        const sc = this._scar(c, rr, enc);
        if (sc) { report.scars[id] = sc; ev.push({ type: 'ScarGained', cat: id, scar: sc.type }); }
      }
      const items = this._items(c, enc, outcome, { routedRow: rr, fledNow: isFled });
      if (enc.opener === 'ambush') remember(k, c, this._encEntry('AMBUSHED_BY_PLAYER', c, enc));
      if (id === vcat) {
        remember(k, c, this._encEntry('ROUTED', c, enc, { damage_type: rr.damage_type, by_pile_on: rr.by_pile_on, fear: fears(id)[0] ?? null, finisher_move: rr.by }));
        report.pending = { cat: id, items };
        continue;
      }
      report.ledgers[id] = this._apply(c, items);
      if (rr) {
        remember(k, c, this._encEntry(outcome === 'win' ? 'SLIPPED_AWAY' : 'ROUTED', c, enc, { damage_type: rr.damage_type, by_pile_on: rr.by_pile_on, fear: fears(id)[0] ?? null }));
        if (outcome === 'win') report.slipped_away.push(id);
      } else if (isFled) remember(k, c, this._encEntry('FLED', c, enc, { fear: fears(id)[0] ?? null }));
      else if (outcome === 'player_fled') remember(k, c, this._encEntry('PLAYER_FLED', c, enc));
      if (enc.lick_in.includes(id) && outcome === 'win') { remember(k, c, this._encEntry('LICK_IN', c, enc)); this._glory(c); }
      this._changed(id);
    }
    // Lick In on the Verdict cat itself (chin-up tell).
    if (vcat && enc.lick_in.includes(vcat)) { const c = s.cats[vcat]; remember(k, c, this._encEntry('LICK_IN', c, enc)); this._glory(c); }

    // Boss anger is spent at EncounterEnded with outcome win, loss or rival_fled (F10); not on Scram.
    if (k.anger.spent_on.includes(outcome)) for (const id of enc.tracked) { const c = s.cats[id]; if (c.anger !== null && c.anger !== undefined && c.anger > 0) ev.push(...this._setAnger(c, 0, 'spent')); }

    // The joiner alone changes (§3.17): +5 Regard on a win, a JOINED_IN entry.
    if (enc.joiner) {
      const j = s.cats[enc.joiner];
      if (outcome === 'win') {
        report.ledgers[j.id] = this._apply(j, [{ row: 'joined_in_win', ...k.ledger_events.joined_in_win }]);
        remember(k, j, entry(s.day, 'JOINED_IN', { patch: enc.patch, serial: enc.serial }));
      }
    }

    if (vcat) {
      s.offer = this._buildOffer(vcat, enc, report.pending.items, report.slipped_away);
      this._changed(vcat);
      if (report.slipped_away.length) ev.push({ type: 'SlippedAway', cat_ids: [...report.slipped_away] });
      ev.push({ type: 'VerdictOffered', ...clone(s.offer) });
    }
    if (enc.patch && outcome !== 'win') delete s.contest[enc.patch];
    delete report.pending;
    ev.unshift({ type: 'NemesisEncounterResolved', ...report });
    return ev;
  }

  /* ------------------------------------------------------------------ the Verdict (§3.11, F4, crew F6/F8) */

  _buildOffer(id, enc, items, slipped) {
    const s = this.s, k = this.k, c = s.cats[id], V = k.verdict;
    const Lrout = ledger(k, c.personality, c.encounters, items);
    const pend = applyLedger(k, c.grudge, c.regard, Lrout);
    const gPending = pend.grudge, rPending = pend.regard;
    const keeper = !!enc.patch && c.keeper_of === enc.patch;
    const gate = noseGate(k, { gPending, personality: c.personality, life: s.life, keeper, nCounterOwn: keeper ? (s.contest[enc.patch]?.counter ?? 0) : 0,
      boss: c.role === 'boss', angerStageAtStandoff: enc.anger_at_standoff[id] ?? null });
    // Recruit
    const crewN = Object.values(s.cats).filter(x => x.state === 'Crew' && x.id !== 'mikan').length;
    const price = bribe(k, { level: c.level ?? 1, role: c.role, life: s.life });
    const recruitItems = [...items, { row: 'verdict_recruit', ...k.ledger_events.verdict_recruit }];
    const Lrec = ledger(k, c.personality, c.encounters, recruitItems);
    const afterRec = applyLedger(k, c.grudge, c.regard, Lrec);
    const tiers = (price.free ? [1] : [1, 2]).map(step => ({ step: step === 1 ? (price.free ? 'free' : 'fair') : 'feast', price: price.free ? 0 : step === 1 ? price.fair : price.feast,
      ...startingLoyalty(k, { gPre: gPending, regard: afterRec.regard, personality: c.personality, bribeStep: step }) }));
    let recruitReason = null;
    if (!c.recruitable_slice) recruitReason = 'recruit_not_slice';
    else if (c.role === 'boss' && rPending < V.boss_recruit_regard_ge) recruitReason = 'recruit_boss';
    else if (!(gPending < V.recruit_grudge_lt || rPending >= V.recruit_regard_ge)) recruitReason = 'recruit_gate';
    else if (!price.free && s.stash !== null && s.stash < price.fair) recruitReason = 'stash_short';
    const fill = t => t.replace('{name}', c.display ?? '').replace('{stash}', String(s.stash)).replace('{fair}', String(price.fair));
    const first = !s.verdicts.length;
    const lick = enc.lick_in.includes(id);
    return {
      cat: id, serial: enc.serial, day: s.day, life: s.life, patch: enc.patch, slipped_away: [...slipped],
      g_pending: gPending, r_pending: rPending, rout_rows: items.map(i => i.row), keeper, n_counter_own: keeper ? (s.contest[enc.patch]?.counter ?? 0) : 0,
      anger_stage_at_standoff: enc.anger_at_standoff[id] ?? null,
      cards: {
        nose: { dir: 'up', title: 'Nose-Touch', available: gate.open, line: V.lines.nose, chip: V.chips.nose, reason: gate.reason, reason_text: gate.reason ? fill(V.reasons[gate.reason]) : null,
          tell: gate.tell, gate: gate.gate, truce_days: V.truce_days },
        chase: { dir: 'left', title: 'Chase Off', available: true, line: V.lines.chase, chip: null, reason: null, reason_text: null, tell: 'mikan_turns_away' },
        recruit: { dir: 'right', title: 'Recruit', available: !recruitReason, line: V.lines.recruit,
          chip: price.free ? V.chips.recruit_free : V.chips.recruit_from.replace('{fair}', String(price.fair)),
          reason: recruitReason, reason_text: recruitReason ? fill(V.reasons[recruitReason]) : null, make_room: crewN >= V.crew_cap,
          tell: recruitReason ? (recruitReason === 'recruit_not_slice' ? 'tail_to_bell' : 'bares_teeth') : 'eyes_lean', bribe: price, tiers,
          stash: s.stash, crew: crewN, crew_cap: V.crew_cap },
      },
      chin_up: lick, strip: V.strip, hint: first ? V.first_hint : null,
    };
  }

  verdictOffer() { return this.s.offer ? clone(this.s.offer) : null; }

  /**
   * Resolve the held Verdict. Changes ONLY the Verdict cat (patent working rule; AC 27).
   * @param v 'nose' | 'chase' | 'recruit'
   * @param o {bribe: 'fair'|'feast'} (Life 2+; Life 1 is free)
   */
  applyVerdict(v, { bribe: step = 'fair' } = {}) {
    const s = this.s, k = this.k, off = s.offer;
    if (!off) throw new Error('no Verdict is held');
    if (!['nose', 'chase', 'recruit'].includes(v)) throw new Error(`unknown verdict ${v}`);
    const card = off.cards[v];
    if (!card.available) throw new Error(`${v} is not available: ${card.reason}`);
    const c = s.cats[off.cat], ev = [];
    const enc = { patch: off.patch, serial: off.serial };
    // the farewell / yield line is picked while the cat still holds its post (own_patch)
    const trig = { nose: 'VERDICT_NOSE', chase: 'VERDICT_CHASE', recruit: 'VERDICT_RECRUIT' }[v];
    const line = selectLine(this, c.id, trig, { patch: off.patch });
    // rout items + the Verdict row through F1 (Chase Off: the cat is Gone, no meter row)
    const rows = (this._lastItems = this._itemsFromOffer(off));
    if (v === 'nose') rows.push({ row: 'verdict_nose', ...k.ledger_events.verdict_nose });
    if (v === 'recruit') rows.push({ row: 'verdict_recruit', ...k.ledger_events.verdict_recruit });
    const L = v === 'chase' ? null : this._apply(c, rows);
    remember(k, c, entry(s.day, 'VERDICT', { patch: off.patch, verdict: v, serial: off.serial, own_post: off.keeper }));
    const out = { type: 'VerdictApplied', rival_id: c.id, verdict: v, slipped_away_ids: [...off.slipped_away], patch: off.patch, clears_post: true, line,
      ledger: L ? { g: L.after.grudge, r: L.after.regard, dG: L.dG, dR: L.dR } : null };
    if (c.keeper_of) { c.old_patch = c.keeper_of; c.keeper_of = null; }
    if (c.challenge) { out.challenge_ended = true; c.old_patch = c.old_patch ?? c.challenge.patch_id; c.challenge = null; }
    if (c.anger !== null && c.anger !== undefined) c.anger = null; // a Verdicted Boss's anger store is removed
    if (v === 'nose') {
      c.state = 'Truce'; c.truce_until_day = s.day + k.verdict.truce_days;
    } else if (v === 'chase') {
      c.state = 'Gone';
    } else {
      const tier = off.cards.recruit.tiers.find(t => t.step === (off.cards.recruit.bribe.free ? 'free' : step)) || off.cards.recruit.tiers[0];
      c.former_rank = c.role; c.state = 'Crew'; c.scene = 'bell'; c.clowder = 'bell'; c.loyalty = tier.value; c.bribe_paid = tier.price; c.recruit_day = s.day;
      const boss = this._bossOf(c.home_clowder);
      if (boss && boss.id !== c.id) {
        remember(k, c, entry(s.day, 'OLD_GANG', { other_id: boss.id }));
        c.old_gang_nerves = !RESIST.has(c.personality);
      }
      c.signature_strength = c.strengths[c.strengths.length - 1] ?? null;
      out.loyalty = { value: tier.value, tier: tier.tier }; out.bribe = { step: tier.step, price: tier.price };
      out.old_gang = boss && boss.id !== c.id ? { boss: boss.id, nerves: c.old_gang_nerves } : null;
    }
    // Togemaru's arc (§3.6, §3.7; consistency pass F11): each Verdict on him is an ending.
    if (c.arc_role === 'lead') {
      if (v !== 'nose') {
        c.arc_role = 'closed'; c.arc_closed_how = v === 'chase' ? 'gone' : 'crew';
        ev.push({ type: 'NemesisArcClosed', cat_id: c.id, how: c.arc_closed_how });
        s.sniff_queue.push({ kind: 'arc_closing', cat: c.id, how: c.arc_closed_how, day: s.day });
      }
      if (!c.arc_achieved && c.encounters >= k.arc_achieved.min_encounters && this._marks(c) >= k.arc_achieved.min_marks) {
        c.arc_achieved = true; ev.push({ type: 'NemesisArcAchieved', cat_id: c.id, by: `verdict_${v}` });
      }
    }
    s.verdicts.push({ cat: c.id, verdict: v, day: s.day, serial: off.serial });
    s.offer = null;
    if (off.patch) delete s.contest[off.patch];
    this._changed(c.id);
    ev.unshift(out);
    return ev;
  }

  _itemsFromOffer(off) {
    const L = this.k.ledger_events;
    return off.rout_rows.map(r => ({ row: r, ...L[r] }));
  }

  /* ------------------------------------------------------------------ barks */

  /** The Standoff line for a cat (F8 over its own trigger group). Recorded for the anti-repeat rule. */
  standoff(id, ctx = {}, { record = true } = {}) {
    const c = this.s.cats[id];
    if (!c) return null;
    const trigger = standoffTrigger(this, c, ctx);
    const line = selectLine(this, id, trigger, ctx, { record }) || { template: null, trigger, text: '', n_mem: 0, unskippable_s: 0 };
    return { trigger, template: line.template, text: line.text, intent: line.intent ?? null, n_mem: line.n_mem, unskippable_s: line.unskippable_s, other: line.other ?? null };
  }

  /* ------------------------------------------------------------------ night (Night Shuffle step 3, §3.12) */

  /**
   * Run step 3 for night n = today, then open day n + 1.
   * @param o {mikan_patches (count Mikan holds at step 2, for F12's h), challenger_target (Territory's challengerTarget()),
   *           raid_target (Territory's lowest-Scent admissible held Patch)}
   */
  night({ mikan_patches = null, challenger_target = null, raid_target = null } = {}) {
    const s = this.s, k = this.k, n = s.day, ev = [];
    if (s.enc) ev.push(...this.endEncounter({ outcome: 'aborted' }));
    s.offer = null;
    // 3a betrayals, 3b town events, 3d adaptation: OUT of the slice (plan §2.5).
    // 3c truce expiry, then the challenger calendar (F12)
    for (const c of this._ordered()) {
      if (c.state !== 'Truce' || c.truce_until_day == null || c.truce_until_day > n + 1) continue;
      c.truce_until_day = null;
      if (c.regard >= k.verdict.friend_regard_ge) { c.state = 'Friend'; ev.push({ type: 'TruceEnded', cat: c.id, became: 'Friend' }); }
      else { c.state = 'Roaming'; c.challenge_due = true; ev.push({ type: 'TruceEnded', cat: c.id, became: 'waiting_challenger' }); }
      s.sniff_queue.push({ kind: 'truce_end', cat: c.id, day: n + 1 });
      this._changed(c.id);
    }
    ev.push(...this._calendar(n, { mikan_patches, challenger_target }));
    // 3e decay (F2) for every non-Crew tracked cat; anger −15 for each un-Verdicted Boss (F10)
    for (const c of this._ordered()) {
      if (!c.tracked || c.uphill || c.state === 'Crew' || c.state === 'Gone' || c.state === 'Offstage') continue;
      c.grudge = drift(k, { grudge: c.grudge, personality: c.personality, quiet: c.last_enc_day !== n, lead: c.arc_role === 'lead' });
      if (c.anger !== null && c.anger !== undefined && c.anger > 0) ev.push(...this._setAnger(c, Math.max(0, c.anger - k.anger.nightly_decay), 'night'));
    }
    // 3f the Declaration (§3.6): Togemaru only, his own record; the face is re-read each night
    for (const c of this._ordered()) {
      if (c.arc_role !== 'lead') continue;
      const face = c.grudge >= c.regard ? 'sworn_enemy' : 'sworn_rival';
      if (c.nemesis) { if (c.face !== face) { c.face = face; this._changed(c.id); } continue; }
      if ((c.encounters >= k.declaration.min_encounters && this._marks(c) >= k.declaration.min_marks) || n >= k.declaration.deadline_night) {
        c.nemesis = true; c.face = face; c.declared_night = n;
        ev.push({ type: 'NemesisDeclared', cat_id: c.id, face, night: n });
        s.sniff_queue.push({ kind: 'declaration', cat: c.id, face, day: n + 1 });
        if (!c.arc_achieved && c.encounters >= k.arc_achieved.min_encounters && this._marks(c) >= k.arc_achieved.min_marks) {
          c.arc_achieved = true; ev.push({ type: 'NemesisArcAchieved', cat_id: c.id, by: 'declaration' });
        }
        this._changed(c.id);
      }
    }
    // 3g raid request (one a night from night 3): challenge > the arc lead > others > gang_orders
    s.raid = this._raidRequest(n, raid_target);
    if (s.raid) ev.push({ type: 'RaidRequested', ...s.raid });
    // the next day
    s.day = n + 1;
    ev.push(...this._dayStart());
    ev.push({ type: 'NemesisDayStarted', day: s.day, life: s.life });
    return ev;
  }

  _ordered() { return Object.keys(this.s.cats).sort().map(id => this.s.cats[id]); }

  _calendar(n, { mikan_patches, challenger_target }) {
    const s = this.s, k = this.k, ev = [], cal = s.calendar;
    const active = Object.values(s.cats).some(c => c.state === 'Challenging' && c.home_scene === 'lane' || (c.challenge && c.state !== 'Gone'));
    let due = false;
    if (this.showcase) due = n === this.D.showcase.challenger.night && !s.cats[this.D.showcase.challenger.id];
    else {
      if (cal.h == null && mikan_patches != null && mikan_patches >= 3) { cal.h = n; cal.next = n + 2; }
      if (cal.next != null && n === cal.next) { due = true; cal.next = n + 4; }
    }
    if (!due || active) return ev;
    const tracked = Object.values(s.cats).filter(c => this._isTracked(c.id)).length;
    // a waiting truce-end cat first (A-12: keeps its own record)
    const waiting = this._ordered().find(c => c.challenge_due);
    if (waiting) {
      const patch = waiting.old_patch && challenger_target ? waiting.old_patch : challenger_target;
      if (!patch) return ev;
      waiting.challenge_due = false; waiting.state = 'Challenging'; waiting.challenge = { patch_id: patch, arrived_night: n, repelled: 0 }; waiting.origin = waiting.origin;
      ev.push({ type: 'ChallengerArrived', cat_id: waiting.id, district_id: 'hidamari', patch_id: patch, origin: 'truce_end' });
      s.sniff_queue.push({ kind: 'challenger', cat: waiting.id, patch, day: n + 1 });
      this._changed(waiting.id);
      return ev;
    }
    if (tracked >= 12) return ev;
    const sc = this.showcase ? this.D.showcase.challenger : null;
    const patch = sc ? sc.patch : challenger_target;
    if (!patch) return ev;
    const id = sc ? sc.id : `challenger_${n}`;
    const r = new Stream(this.seed, `gen:${id}`);
    const C = k.challenger;
    const wpick = w => { const tot = Object.values(w).reduce((a, b) => a + b, 0); let x = r.float() * tot; for (const [kk, v] of Object.entries(w)) { x -= v; if (x < 0) return kk; } return Object.keys(w)[0]; };
    const personality = sc?.personality ?? wpick(C.personality_weights);
    const row = {
      Name: id, display: sc ? C.display : C.display, title: null, scene: 'outsiders', clowder: 'outsiders', role: 'challenger', personality,
      style: sc?.style ?? r.pick(C.styles), level: sc?.level ?? 8, fears: sc?.fears ?? [r.pick(C.fears)], strengths: [], keeper_of: null,
      origin: 'challenger', tracked: true, recruitable_slice: C.recruitable_slice, start: { state: 'Challenging', grudge: null, regard: k.generation.regard, discovered: false },
    };
    const c = s.cats[id] = this._fresh(row);
    c.challenge = { patch_id: patch, arrived_night: n, repelled: 0 };
    ev.push({ type: 'ChallengerArrived', cat_id: id, district_id: 'hidamari', patch_id: patch, origin: sc?.origin ?? 'calendar' });
    // one Rival tag, p 0.5, to a non-Gone non-Crew town cat drawn uniformly (forced in the showcase, plan §2.4)
    let rival = null;
    if (sc) rival = sc.rival_by_branch[this.branch() ?? 'A'] ?? null;
    else if (r.chance(C.rival_tag_p)) {
      const pool = this._ordered().filter(x => x.id !== id && x.tracked && !x.uphill && x.state !== 'Gone' && x.state !== 'Crew' && x.state !== 'Offstage' && x.home_scene === 'lane');
      rival = pool.length ? r.pick(pool).id : null;
    }
    if (rival) { this._tie(id, rival, 'rival', 'challenger'); ev.push({ type: 'RivalTagDrawn', cat: id, other: rival }); }
    s.sniff_queue.push({ kind: 'challenger', cat: id, patch, day: n + 1 });
    this._changed(id);
    return ev;
  }

  _raidRequest(n, target) {
    const s = this.s, k = this.k;
    if (n < 3) return null;
    const ch = this._ordered().find(c => c.state === 'Challenging' && c.challenge);
    if (ch) return { attacker_ids: [ch.id], patch_id: ch.challenge.patch_id, motive: 'challenge', night: n };
    if (!target) return null;
    const host = c => (c.state === 'Seated' || c.state === 'Roaming') && c.tracked && !c.uphill && c.role !== 'boss';
    const lead = this._ordered().find(c => c.arc_role === 'lead');
    const won = c => hasKind(c, 'WON') || hasKind(c, 'LICK_IN');
    if (lead && host(lead)) return { attacker_ids: [lead.id], patch_id: target, motive: won(lead) ? 'gloat' : 'grudge', night: n };
    const score = c => arcScore({ enc: c.encounters, marks: this._marks(c), grudge: c.grudge, regard: c.regard, beatMikan: won(c), daysUnseen: c.last_enc_day == null ? 10 : n - c.last_enc_day });
    const cands = this._ordered().filter(c => host(c) && c.grudge >= 40).sort((a, b) => score(b) - score(a) || (a.id < b.id ? -1 : 1));
    if (cands.length) return { attacker_ids: [cands[0].id], patch_id: target, motive: won(cands[0]) ? 'gloat' : 'grudge', night: n };
    const toughs = this._ordered().filter(c => host(c) && c.role === 'tough' && c.home_clowder === 'wall_sitters');
    if (!toughs.length) return null;
    const t = new Stream(this.seed, `raid:${n}`).pick(toughs);
    return { attacker_ids: [t.id], patch_id: target, motive: 'gang_orders', night: n };
  }

  /** Togemaru's branch from his own Verdict memory: A nose, B recruit, C chase, null before his first Verdict. */
  branch() {
    const t = this.s.cats.togemaru;
    const v = t && t.memory.find(e => e.kind === 'VERDICT');
    return v ? { nose: 'A', recruit: 'B', chase: 'C' }[v.verdict] : null;
  }

  /* ------------------------------------------------------------------ queries */

  /** RivalCombatProfile (§6.1 query out) for Combat at fight start. */
  combatProfile(id) {
    const c = this.s.cats[id];
    if (!c) return null;
    const og = lastOf(c, 'OLD_GANG');
    return { id, level: c.level, style: c.style, personality: c.personality, strengths: [...c.strengths], fears: [...c.fears], title: c.title,
      scars: c.scars.map(x => x.type), flee_threshold: c.flee_threshold, anger_stage: c.anger == null ? null : angerStage(this.k, c.anger).stage,
      fired_up_s: c.anger == null ? 0 : angerStage(this.k, c.anger).fired_up_s, rematch_nerve: c.rematch_nerve,
      old_gang_nerves: c.state === 'Crew' ? c.old_gang_nerves : false, old_boss_id: c.state === 'Crew' ? (og?.other_id ?? null) : null,
      kin_ids: c.relations.filter(r => r.kind === 'kin').map(r => r.other_id), rival_ids: c.relations.filter(r => r.kind === 'rival').map(r => r.other_id) };
  }

  /** Hash of one cat's record plus the lines it has said (its own anti-repeat list). */
  catHash(id) { return hashOf({ cat: this.s.cats[id] ?? null, said: this.s.barks.said[id] ?? [] }); }
  catHashes() { return Object.fromEntries(Object.keys(this.s.cats).sort().map(id => [id, this.catHash(id)])); }
  hash() { return hashOf(this.s); }
  state() { return this.s; }
}

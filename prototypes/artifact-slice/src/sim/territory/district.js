// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The territory simulation for one district (Hidamari Lane): Scent per Patch, the marking verbs,
// overnight step 2 (decay, refresh, challenger over-mark, a raid result), influence (Territory §4.14),
// the Boss window (OR-09) and the challenger calendar (Territory §4.15, hosted here until M3).
// Pure and headless: no DOM, no wall clock, no Math.random. All tuning comes from TDATA (JSON).
//
// Patent rule (nemesis-patent-analysis.md §5, G2/G5/G6): this module stores NO cat stats. It holds cat
// ids only as Keepers and Sentries of Patches, and reads a Sentry's style/personality as given. Nothing
// here writes to any cat; Boss anger is Nemesis's and is fed only by the MarkApplied events emitted below.
import { hashOf } from '../core/hash.js';
import { Stream } from '../core/rng.js';

const PLAYER = 'mikan';

export class District {
  /**
   * @param {object} D a buildTerritoryData() bundle
   * @param {object} opts {seed, district:'hidamari', start:'l1d1'|'showcase_l2d2', showcase:bool}
   */
  constructor(D, opts = {}) {
    this.D = D;
    const k = D.k;
    const dist = D.districts[opts.district || 'hidamari'];
    if (!dist) throw new Error(`unknown district ${opts.district}`);
    this.dist = dist;
    const showcase = !!opts.showcase || opts.start === 'showcase_l2d2';
    this.showcase = showcase;
    const s = this.s = {
      district: dist.Name, seed: (opts.seed ?? 1) >>> 0, day: 1, clock: 0, phase: 'morning', cat_flap: false,
      patches: {}, window_open: false, claimed: false,
      boss: { id: dist.boss, clowder: dist.gang, verdicted: false, at: 'den_wall' },
      challenger: null, gone_challengers: [], calendar: { n3: null, first_night: null, arrivals: 0 },
      discovered: [], whisker: { held: false, rings: {} }, influence: {}, night_log: [],
    };
    for (const id of dist.patches) {
      const p = D.patches[id];
      s.patches[id] = {
        owner: p.start.owner, keeper: p.start.keeper, scent: p.start.scent,
        claimed_day: null, last_seen_day: null, last_raided_night: null, stale_until_night: null,
        sentry: null, routed_night: null, contest: null,
      };
    }
    if (opts.start === 'showcase_l2d2') {
      const snap = D.showcase.l2d2_snapshot;
      s.day = snap.day;
      for (const [id, v] of Object.entries(snap.patches)) Object.assign(s.patches[id], v);
      s.calendar.n3 = snap.first_three_night;
      const c = D.showcase.challenger;
      s.challenger = { id: c.id, patch: c.patch, arrived_night: c.arrived_night, repels: 0, origin: c.origin, beaten: false };
      s.calendar.arrivals = 1;
      s.discovered = [...D.showcase.discovered].sort();
    }
    if (showcase && D.showcase.challenger_first_night != null) s.calendar.first_night = D.showcase.challenger_first_night;
    s.influence = this._influenceAll();
    s.window_open = false;
  }

  // ---------------------------------------------------------------- queries

  get day() { return this.s.day; }
  get life() { return this.s.day >= this.D.k.life2_first_day ? 2 : 1; }
  get phase() { return this.s.phase; }

  /** Per-Patch read: owner, keeper, Scent, band, wisps. */
  patch(id) {
    const p = this._p(id);
    const b = this.band(p.scent);
    return { id, owner: p.owner, keeper: p.keeper, scent: p.scent, band: b.band, wisps: b.wisps, sentry: p.sentry ? { ...p.sentry } : null };
  }
  scent(id) { return this._p(id).scent; }
  owner(id) { return this._p(id).owner; }

  /** Band and wisp count for a Scent value (Territory §3.2.1). 0 = Open, no wisps. */
  band(scent) {
    if (scent <= 0) return { band: 'open', wisps: 0 };
    for (const b of this.D.k.bands) if (scent >= b.min && scent <= b.max) return { band: b.band, wisps: b.wisps };
    return { band: 'pungent', wisps: 4 };
  }

  /** District influence for a Clowder (Territory §4.14): round_half_up(100 × Σ min(s,60)/60 ÷ n_outer). */
  influence(clowder = this.dist.player_clowder) {
    const k = this.D.k, outer = this.dist.outer;
    let sum = 0;
    for (const id of outer) { const p = this.s.patches[id]; if (p.owner === clowder) sum += Math.min(p.scent, k.strong); }
    // exact integer round-half-up of (100 × sum) / (strong × n_outer)
    const x = 100 * sum, y = k.strong * outer.length;
    return Math.floor((2 * x + y) / (2 * y));
  }

  /** The tug-of-war bar: each Clowder's value, plus the Open gap (OR-08 'shown'). */
  influenceBar() {
    const v = this._influenceAll();
    const total = Object.values(v).reduce((a, b) => a + b, 0);
    return { ...v, open: Math.max(0, 100 - total) };
  }

  /** The Boss window and where the Boss is (Territory §3.5; Day Loop F7). */
  bossWindow() {
    const s = this.s;
    const stop = this.D.patrol[s.boss.at];
    return {
      open: s.window_open, crown_lit: s.window_open, claimed: s.claimed,
      boss: s.boss.id, verdicted: s.boss.verdicted, at: s.boss.verdicted ? null : s.boss.at,
      patch: s.boss.verdicted ? null : stop.patch, roaming: !s.boss.verdicted && stop.roaming,
      standoff_offered: !s.boss.verdicted && s.window_open,
    };
  }

  /** What a Spray at this post would do now, or null (Territory §3.3). */
  sprayOffer(id) {
    const k = this.D.k, p = this._p(id), row = this.D.patches[id];
    if (row.boss_seat && !this.s.boss.verdicted) return null;
    if (p.owner === this.dist.player_clowder) return p.scent < k.rescue_offered_below ? { kind: 'rescue_spray', hold_s: k.spray_hold_s } : null;
    if (p.keeper == null) return { kind: 'claim_spray', hold_s: k.spray_hold_s };
    return { kind: 'counter_spray', hold_s: k.spray_hold_s };
  }

  /** Admissibility of a raid request (Territory §3.7). Returns null if admissible, else the reason. */
  raidInadmissible(id, motive, night = this.s.day) {
    const s = this.s, p = s.patches[id], row = this.D.patches[id];
    if (this.life < this.D.k.raids_from_life) return 'life_1';
    if (!p || p.owner !== this.dist.player_clowder) return 'not_held';
    if (row.home_ground) return 'home_ground';
    if (p.claimed_day === night) return 'claimed_today';
    if (motive !== 'challenge' && p.last_raided_night === night - 1) return 'two_nights_running';
    if (row.boss_seat && this.influence() >= this.D.k.i_close) return 'den_influence';
    if (motive === 'challenge' && (!s.challenger || s.challenger.beaten || s.challenger.patch !== id)) return 'no_active_challenge';
    return null;
  }

  /** The challenger-target query (Territory §3.7.2 / §4.15): lowest Scent held, not LWC or the Den; ties: higher yield. */
  challengerTarget() {
    let best = null;
    for (const id of this.dist.patches) {
      const p = this.s.patches[id], row = this.D.patches[id];
      if (p.owner !== this.dist.player_clowder || row.home_ground || row.boss_seat) continue;
      if (!best || p.scent < best.scent || (p.scent === best.scent && row.base_yield > best.y)) best = { id, scent: p.scent, y: row.base_yield };
    }
    return best ? best.id : null;
  }

  /** Counter-seeded substream (Day Loop §3.5: rng(save_seed, day, step, subsystem, key)), for M5's raid resolver. */
  rng(step, subsystem, key = '', day = this.s.day) { return new Stream(this.s.seed, `${day}|${step}|${subsystem}|${key}`); }

  isDiscovered(cat) { return this.s.discovered.includes(cat); }

  // ---------------------------------------------------------------- marking verbs (by day)

  /**
   * Rub a Rub Mark (Territory §3.3). Own Patch: no Scent, counts as seen. Rival Patch: Over-mark −10,
   * once per mark per contest; quiet unless `seen` (a rival cat within 8 m saw it) → Bristle.
   */
  rub(id, mark, { seen = false } = {}) {
    const k = this.D.k, p = this._p(id), row = this.D.patches[id], ev = [];
    if (row.boss_seat && !this.s.boss.verdicted) return [this._refuse(id, 'rub', 'den_unmarkable')];
    if (!row.rub_marks.includes(mark)) return [this._refuse(id, 'rub', 'no_such_mark')];
    if (p.owner === this.dist.player_clowder) { p.last_seen_day = this.s.day; return [{ type: 'Rubbed', district: this.s.district, patch: id, mark, effect: 'seen' }]; }
    if (p.owner == null) return [{ type: 'Rubbed', district: this.s.district, patch: id, mark, effect: 'none' }];
    const c = this._contest(id);
    if (c.over_marked.includes(mark)) return [this._refuse(id, 'rub', 'already_over_marked')];
    c.over_marked.push(mark);
    const target = p.owner;
    p.scent = Math.max(0, p.scent - k.over_mark);
    p.last_seen_day = this.s.day;
    ev.push(this._mark(id, 'over_mark', target, mark));
    this._afterErosion(id, seen, ev);
    this._afterScentChange(ev);
    return ev;
  }

  /**
   * Complete a Spray at a post (call when the 1.2 s hold finishes uninterrupted; Territory §3.3).
   * Own post below Strong → Rescue (90). Keeperless post → Claim (yours at 70). Rival post with a Keeper →
   * Counter-Spray (−30, always loud). The Den only after the Boss's Verdict. Never anything else.
   */
  spray(id) {
    const k = this.D.k, s = this.s, p = this._p(id), row = this.D.patches[id], ev = [];
    const offer = this.sprayOffer(id);
    if (!offer) return [this._refuse(id, 'spray', row.boss_seat && !s.boss.verdicted ? 'den_unmarkable' : 'not_offered')];
    p.last_seen_day = s.day;
    if (offer.kind === 'rescue_spray') {
      const from = p.scent;
      p.scent = k.rescue_scent;
      ev.push(this._mark(id, 'rescue_spray', p.owner), { type: 'ScentChanged', district: s.district, patch: id, from, to: p.scent, cause: 'rescue_spray' });
    } else if (offer.kind === 'claim_spray') {
      const prev = p.owner, from = p.scent;
      p.owner = this.dist.player_clowder; p.keeper = PLAYER; p.scent = k.claim_scent;
      p.claimed_day = s.day; p.contest = null; p.stale_until_night = null; p.sentry = null; p.routed_night = null;
      ev.push(this._mark(id, 'claim_spray', prev),
        { type: 'ScentChanged', district: s.district, patch: id, from, to: p.scent, cause: 'claim_spray' },
        { type: 'PatchChanged', district: s.district, patch: id, owner: p.owner, previous_owner: prev, keeper: PLAYER, cause: 'claim_spray' });
      if (row.boss_seat) { s.claimed = true; ev.push({ type: 'DistrictClaimed', district: s.district }); }
    } else {
      const target = p.owner, from = p.scent;
      this._contest(id).counter_sprays++;
      p.scent = Math.max(0, p.scent - k.counter_spray);
      ev.push(this._mark(id, 'counter_spray', target), { type: 'ScentChanged', district: s.district, patch: id, from, to: p.scent, cause: 'counter_spray' });
      this._afterErosion(id, true, ev);
    }
    this._afterScentChange(ev);
    return ev;
  }

  /**
   * A Verdict on a Patch's Keeper (Nemesis VerdictApplied ∈ {chase, recruit, nose}; Territory §3.4 step 5).
   * Clears the post's Keeper and offers the Claim Spray. Changes NO Scent and no other Patch (G3, G5, G6).
   * On the Den it is the Boss's Verdict: he leaves the patrol; nobody replaces him (§3.5 item 8).
   */
  verdict(id, verdict) {
    const s = this.s, p = this._p(id), row = this.D.patches[id];
    if (!['chase', 'recruit', 'nose'].includes(verdict)) throw new Error(`bad verdict ${verdict}`);
    if (p.owner === this.dist.player_clowder || p.keeper == null) return [this._refuse(id, 'verdict', 'no_keeper')];
    const keeper = p.keeper;
    p.keeper = null;
    if (p.contest) p.contest.keeper_called = true;
    const ev = [{ type: 'PatchChanged', district: s.district, patch: id, owner: p.owner, keeper: null, previous_keeper: keeper, cause: `verdict_${verdict}` },
      { type: 'ClaimOffered', district: s.district, patch: id }];
    if (row.boss_seat) { s.boss.verdicted = true; s.boss.at = 'den_wall'; ev.push({ type: 'BossMoved', district: s.district, boss: s.boss.id, at: null, verdicted: true }); }
    if (s.challenger && s.challenger.id === keeper) this._endChallenge('verdict', ev);
    return ev;
  }

  /**
   * An encounter ended on a Patch (Combat's EncounterEnded). Territory's only reaction: the Patch is `seen`
   * (§3.9 item 2). No outcome moves Scent or influence (G5, AC 16b).
   */
  encounterEnded({ patch = null, outcome } = {}) {
    if (patch) this._p(patch).last_seen_day = this.s.day;
    return [];
  }

  /** The challenger was beaten by day and given a Verdict: the challenge ends; adds no Scent (§3.7.2). */
  challengerBeaten() {
    const ev = [];
    if (this.s.challenger && !this.s.challenger.beaten) this._endChallenge('verdict', ev);
    return ev;
  }

  /** End a contest without a claim (left for 20 s, went home, or a wipe). Scent stays; it recovers overnight. */
  endContest(id, reason = 'left') {
    const p = this._p(id);
    if (!p.contest) return [];
    p.contest = null;
    return [{ type: 'ContestEnded', district: this.s.district, patch: id, reason }];
  }

  /** Post (or unpost with null) a Sentry: {cat, style, personality}. Territory §3.6; slice clamp 2 slots. */
  setSentry(id, sentry) {
    const p = this._p(id), k = this.D.k;
    if (sentry == null) { const was = p.sentry; p.sentry = null; p.routed_night = null; return was ? [{ type: 'SentryReturned', district: this.s.district, patch: id, cat: was.cat, cause: 'unposted' }] : []; }
    if (p.owner !== this.dist.player_clowder) return [this._refuse(id, 'post', 'not_held')];
    for (const [oid, op] of Object.entries(this.s.patches)) if (oid !== id && op.sentry && op.sentry.cat === sentry.cat) { op.sentry = null; op.routed_night = null; }
    const used = Object.entries(this.s.patches).filter(([oid, op]) => oid !== id && op.sentry).length;
    if (used >= k.sentry_slots) return [this._refuse(id, 'post', 'no_slot')];
    p.sentry = { cat: sentry.cat, style: sentry.style, personality: sentry.personality };
    p.routed_night = null;
    return [{ type: 'SentryPosted', district: this.s.district, patch: id, cat: sentry.cat }];
  }

  /** Town event (Nemesis F6/OR-10): a freshly generated cat becomes a keeperless Patch's Keeper at 60. */
  townEventNewcomer(id, cat, clowder = 'outsiders') {
    const p = this._p(id), row = this.D.patches[id];
    if (p.keeper != null || p.owner === this.dist.player_clowder || row.boss_seat) return [this._refuse(id, 'newcomer', 'not_keeperless')];
    const prev = p.owner;
    Object.assign(p, { owner: clowder, keeper: cat, scent: this.D.k.newcomer_scent, contest: null });
    const ev = [{ type: 'PatchChanged', district: this.s.district, patch: id, owner: clowder, previous_owner: prev, keeper: cat, cause: 'newcomer' }];
    this._afterScentChange(ev, { atStep2: false });
    return ev;
  }

  /** BetrayalTriggered (Crew/Nemesis, OR-11): the guarded Patch flips to the turncoat at 40. Never LWC or the Den. */
  betrayal(id, cat) {
    const p = this._p(id), row = this.D.patches[id], k = this.D.k;
    if (row.home_ground || row.boss_seat) { if (p.sentry && p.sentry.cat === cat) p.sentry = null; return [this._refuse(id, 'betrayal', 'declined')]; }
    if (p.owner !== this.dist.player_clowder) return [this._refuse(id, 'betrayal', 'not_held')];
    Object.assign(p, { owner: 'outsiders', keeper: cat, scent: k.turncoat_scent, sentry: null, routed_night: null, stale_until_night: this.s.day + k.stale_claim_nights });
    const ev = [{ type: 'PatchChanged', district: this.s.district, patch: id, owner: 'outsiders', previous_owner: 'bell', keeper: cat, cause: 'turncoat' }];
    this._afterScentChange(ev, { atStep2: false });
    return ev;
  }

  // ---------------------------------------------------------------- Whisker Sense

  /**
   * One frame of Whisker Sense (hud.md §3.2; Nemesis §3.13 discovery b). `cats`: [{id, pos:[x,z]|dist, onScreen}].
   * Each undiscovered cat on screen within 10 m fills its own ring; 1.0 s held → CatDiscovered(how 'sniff').
   * Releasing, going into combat, or the cat leaving range/screen cancels its ring at no cost.
   */
  whisker(dt, { held = false, inCombat = false, pos = null, cats = [] } = {}) {
    const k = this.D.k, w = this.s.whisker, ev = [];
    w.held = held && !inCombat;
    if (!w.held) { w.rings = {}; return ev; }
    const keep = {};
    for (const c of cats) {
      if (this.isDiscovered(c.id)) continue;
      const d = c.dist != null ? c.dist : (pos && c.pos ? Math.hypot(c.pos[0] - pos[0], c.pos[1] - pos[1]) : Infinity);
      if (c.onScreen === false || d > k.whisker_range_m) continue;
      const t = (w.rings[c.id] || 0) + dt;
      if (t >= k.whisker_sniff_s - 1e-9) ev.push(...this.discover(c.id, 'sniff'));
      else keep[c.id] = t;
    }
    w.rings = keep;
    return ev;
  }

  /** Mark a cat discovered (an encounter, a sniff, or Crew). A player-knowledge flag: it changes nothing about the cat. */
  discover(cat, how = 'encounter') {
    if (this.isDiscovered(cat)) return [];
    this.s.discovered.push(cat); this.s.discovered.sort();
    return [{ type: 'CatDiscovered', cat, how }];
  }

  // ---------------------------------------------------------------- time

  /** Open the cat flap (K2.3, L2D2 Dusk): Night becomes roamable (C_open 960). */
  catFlap() { this.s.cat_flap = true; return []; }

  /** Advance the roaming clock by `dt` clock seconds (paused by the caller in combat, menus, at home). */
  advance(dt) { return this.setClock(this.s.clock + dt); }

  /** Jump the clock (naps, beats, the loss jump). Emits PhaseChanged and, while roaming, BossMoved. */
  setClock(clock) {
    const k = this.D.k, s = this.s, ev = [];
    const cap = s.cat_flap ? k.c_open.after_flap : k.c_open.before_flap;
    s.clock = Math.max(0, Math.min(cap, clock));
    const ph = this._phaseAt(s.clock);
    if (ph !== s.phase) {
      s.phase = ph;
      ev.push({ type: 'PhaseChanged', district: s.district, phase: ph, clock: s.clock });
      this._placeBoss(ev);
    }
    return ev;
  }

  setPhase(phase) { const r = this.D.k.phases.find(p => p.phase === phase); if (!r) throw new Error(`bad phase ${phase}`); return this.setClock(r.start); }

  /**
   * The Night Shuffle's Territory step 2 (Territory §3.7 resolution order; Day Loop §3.5), then the hosted
   * challenger calendar (Nemesis step 3 part), then the next morning. `raid`: tonight's forecast raid with its
   * outcome already rolled by M5's §4.5 resolver: {patch, motive, leader, outcome:'repelled'|'scuffed'|'lost',
   * clowder?, presence?, leader_home?}. Returns {events, report}.
   */
  overnight({ raid = null } = {}) {
    const k = this.D.k, s = this.s, night = s.day, ev = [], report = { night, patches: {}, raid: null, upkeep: 0 };
    const bell = this.dist.player_clowder;
    const owners = Object.fromEntries(Object.entries(s.patches).map(([id, p]) => [id, p.owner]));
    for (const id of this.dist.patches) report.patches[id] = { from: s.patches[id].scent, owner: s.patches[id].owner };

    // a) decay and refresh (from tonight's owners, simultaneously)
    for (const id of this.dist.patches) {
      const p = s.patches[id], row = this.D.patches[id], r = report.patches[id];
      if (p.owner === bell) {
        const rn = row.neighbours.filter(n => owners[n] != null && owners[n] !== bell).length;
        const brooder = p.sentry && p.sentry.personality === 'brooder' && this._watched(p, night);
        const decay = Math.floor((k.base_decay + k.border * rn) * (row.home_ground ? k.home_mult : 1) * (brooder ? k.brooder_mult : 1));
        const refresh = this._watched(p, night) ? (p.sentry.style === 'yowler' ? k.crier_refresh : k.sentry_refresh) : 0;
        const floor = row.home_ground ? k.home_floor : 0;
        p.scent = Math.max(floor, Math.min(k.scent_max, p.scent - decay + refresh));
        Object.assign(r, { decay, refresh, rival_neighbours: rn, watched: this._watched(p, night) });
        if (p.sentry) report.upkeep += k.upkeep_per_post;
      } else if (p.owner != null) {
        if (p.keeper != null) {
          const ceil = p.stale_until_night != null && night <= p.stale_until_night ? k.stale_claim_ceiling : row.boss_seat ? k.ceiling_den : k.ceiling_outer;
          if (p.scent < ceil) p.scent = Math.min(ceil, p.scent + k.rival_recovery);
          r.recovery = true;
        } else {
          p.scent = Math.max(0, p.scent - k.keeperless_fade);
          r.fade = true;
        }
        if (p.contest) p.contest = null; // the night ends any contest
      }
    }

    // b) challenger over-mark (from the night after it arrives; a posted Goofball: 0)
    const ch = s.challenger;
    if (ch && !ch.beaten && night > ch.arrived_night && s.patches[ch.patch].owner === bell) {
      const p = s.patches[ch.patch];
      const om = p.sentry && p.sentry.personality === 'goofball' && this._watched(p, night) ? k.challenger_overmark_goofball : k.challenger_overmark;
      p.scent = Math.max(0, p.scent - om);
      report.patches[ch.patch].overmark = om;
    }

    // c) upkeep: reported only (the Stash is M5's)

    // d) tonight's raid against the post-decay Scent and tonight's posts
    if (raid) report.raid = this._resolveRaid(raid, night, ev);

    // e) lapses: a held Patch at 0 is Open and keeperless; a rival Patch faded to 0 too
    for (const id of this.dist.patches) {
      const p = s.patches[id];
      if (p.scent > 0 || p.owner == null) continue;
      const prev = p.owner, sentry = p.sentry;
      Object.assign(p, { owner: null, keeper: null, sentry: null, routed_night: null, contest: null, stale_until_night: null });
      ev.push({ type: 'PatchChanged', district: s.district, patch: id, owner: null, previous_owner: prev, keeper: null, cause: 'lapsed' });
      if (sentry) ev.push({ type: 'SentryReturned', district: s.district, patch: id, cat: sentry.cat, cause: 'lapsed' });
      if (prev === bell && ch && !ch.beaten && ch.patch === id) {
        Object.assign(p, { owner: 'outsiders', keeper: ch.id, scent: k.newcomer_scent });
        ev.push({ type: 'PatchChanged', district: s.district, patch: id, owner: 'outsiders', previous_owner: null, keeper: ch.id, cause: 'challenger_settled' });
        this._endChallenge('settled', ev);
      }
    }
    for (const id of this.dist.patches) Object.assign(report.patches[id], { to: s.patches[id].scent, owner_after: s.patches[id].owner });

    // f) recompute influence and the Boss window (opens at 100, closes below 75: step 2 only)
    this._afterScentChange(ev, { atStep2: true });
    report.influence = this.influence();
    report.window_open = s.window_open;

    // step 3 (hosted until M3): the challenger calendar
    const held = this.dist.patches.filter(id => s.patches[id].owner === bell).length;
    if (s.calendar.n3 == null && held >= k.challenger_min_patches) s.calendar.n3 = night;
    const first = s.calendar.first_night ?? (s.calendar.n3 != null ? s.calendar.n3 + k.challenger_first_after : null);
    if (first != null && night >= first && (night - first) % k.challenger_every === 0 && this.life >= k.raids_from_life) {
      const active = s.challenger && !s.challenger.beaten;
      const target = this.challengerTarget();
      if (!active && target) {
        s.calendar.arrivals++;
        s.challenger = { id: `challenger_${s.calendar.arrivals}`, patch: target, arrived_night: night, repels: 0, origin: 'calendar', beaten: false };
        ev.push({ type: 'ChallengerArrived', cat: s.challenger.id, district: s.district, patch: target, origin: 'calendar', night });
      } else ev.push({ type: 'ChallengerSkipped', district: s.district, night, reason: active ? 'active' : 'no_target' });
    }

    // step 6: open the next day
    if (s.challenger && s.challenger.beaten) { s.gone_challengers.push(s.challenger.id); s.challenger = null; }
    s.day++;
    s.clock = 0; s.phase = 'morning';
    ev.push({ type: 'DayStarted', district: s.district, day: s.day, life: this.life });
    this._placeBoss(ev);
    s.night_log.push({ night, influence: report.influence, window_open: report.window_open, scents: Object.fromEntries(this.dist.patches.map(id => [id, s.patches[id].scent])) });
    return { events: ev, report };
  }

  // ---------------------------------------------------------------- snapshot and hash

  /** Read-only plain object for rendering: wisps per post, owner colours, the bar, the Boss, Whisker Sense. */
  snapshot() {
    const s = this.s, D = this.D, bell = this.dist.player_clowder;
    const posts = this.dist.patches.map(id => {
      const p = s.patches[id], row = D.patches[id], b = this.band(p.scent);
      return {
        patch: id, display: row.display, post: row.post, post_display: row.post_display,
        owner: p.owner, colour: p.owner ? D.clowders[p.owner].colour : null, keeper: p.keeper,
        scent: p.scent, band: b.band, wisps: b.wisps, droop: p.scent < D.k.strong,
        fading: p.owner === bell && p.scent < D.k.strong, home_ground: !!row.home_ground, boss_seat: !!row.boss_seat,
        sentry: p.sentry ? p.sentry.cat : null, staked_by: s.challenger && !s.challenger.beaten && s.challenger.patch === id ? s.challenger.id : null,
        contested: !!(p.contest && p.contest.bristled), keeper_called: !!(p.contest && p.contest.keeper_called),
        spray_offer: this.sprayOffer(id)?.kind ?? null,
        rub_marks: row.rub_marks.map(m => ({ id: m, over_marked: !!(p.contest && p.contest.over_marked.includes(m)) })),
      };
    });
    return {
      district: s.district, display: this.dist.display, day: s.day, life: this.life, phase: s.phase, clock: s.clock,
      influence: this.influence(), bar: this.influenceBar(), window: this.bossWindow(),
      posts, challenger: s.challenger ? { ...s.challenger } : null,
      whisker: { held: s.whisker.held, rings: Object.entries(s.whisker.rings).map(([cat, t]) => ({ cat, t, of: D.k.whisker_sniff_s })), ticks: s.whisker.held ? this._ticks() : [] },
      discovered: [...s.discovered],
    };
  }

  /** 16 hex chars over the canonical territory state. */
  hash() { return hashOf(this.s); }

  /** A deep copy of the raw state (tests, save). */
  state() { return JSON.parse(JSON.stringify(this.s)); }

  // ---------------------------------------------------------------- internals

  _p(id) { const p = this.s.patches[id]; if (!p) throw new Error(`unknown patch ${id}`); return p; }
  _refuse(patch, verb, reason) { return { type: 'MarkRefused', district: this.s.district, patch, verb, reason }; }
  _phaseAt(c) { const ph = this.D.k.phases; for (const r of ph) if (c >= r.start && c < r.end) return r.phase; return ph[ph.length - 1].phase; }
  _watched(p, night) { return !!p.sentry && p.routed_night !== night - 1; }

  _mark(id, kind, target, rub_mark = null) {
    const ev = { type: 'MarkApplied', district: this.s.district, patch: id, post: this.D.patches[id].post, by: PLAYER, kind, target_clowder: target ?? null };
    if (rub_mark) ev.rub_mark = rub_mark;
    return ev;
  }

  _contest(id) {
    const p = this.s.patches[id];
    if (!p.contest) p.contest = { bristled: false, keeper_called: false, over_marked: [], counter_sprays: 0 };
    return p.contest;
  }

  /** Bristle, turf waves and the Keeper's arrival after an erosion act (Territory §3.4 steps 3–4; PP-03). */
  _afterErosion(id, loud, ev) {
    const k = this.D.k, p = this.s.patches[id], c = p.contest, row = this.D.patches[id], d = this.s.district;
    if (p.keeper == null) return;
    const tutorial = row.tutorial_life === this.life;
    if (tutorial) {
      // PP-03: one Rub, one Counter-Spray, one wave of two Strays, then the Keeper's Standoff (thresholds bypassed)
      if (loud && !c.bristled) { c.bristled = true; ev.push({ type: 'ContestBristled', district: d, patch: id, waves: 1, scripted: true }); }
      if (loud && !c.keeper_called) { c.keeper_called = true; ev.push({ type: 'KeeperCalled', district: d, patch: id, keeper: p.keeper, escort_wave: true, scripted: true }); }
      return;
    }
    const low = p.scent <= k.keeper_threshold;
    if (loud && !c.bristled) {
      c.bristled = true;
      const waves = low ? 0 : p.scent >= k.waves_two_at ? 2 : 1;
      ev.push({ type: 'ContestBristled', district: d, patch: id, waves });
      if (low) { c.keeper_called = true; ev.push({ type: 'KeeperCalled', district: d, patch: id, keeper: p.keeper, escort_wave: true }); }
      return;
    }
    if (low && !c.keeper_called) {
      // the Keeper keys off Scent only (OR-08); after waves it comes alone, after an all-quiet take with one escort wave
      c.keeper_called = true;
      if (c.bristled) ev.push({ type: 'TurfWavesStopped', district: d, patch: id });
      ev.push({ type: 'KeeperCalled', district: d, patch: id, keeper: p.keeper, escort_wave: !c.bristled });
    }
  }

  _influenceAll() {
    const out = {};
    for (const c of Object.keys(this.D.clowders)) out[c] = this.influence(c);
    return out;
  }

  /** After any Scent change: InfluenceChanged if a value moved; open the window at 100; close only at step 2 < 75. */
  _afterScentChange(ev, { atStep2 = false } = {}) {
    const s = this.s, k = this.D.k;
    const now = this._influenceAll();
    if (Object.keys(now).some(c => now[c] !== s.influence[c])) ev.push({ type: 'InfluenceChanged', district: s.district, by_clowder: { ...now } });
    s.influence = now;
    const mine = now[this.dist.player_clowder];
    if (!s.window_open && !s.claimed && !s.boss.verdicted && mine >= k.i_full) {
      s.window_open = true;
      ev.push({ type: 'BossWindowChanged', district: s.district, open: true, influence: mine });
      this._placeBoss(ev);
    } else if (atStep2 && s.window_open && mine < k.i_close) {
      s.window_open = false;
      ev.push({ type: 'BossWindowChanged', district: s.district, open: false, influence: mine });
      this._placeBoss(ev);
    }
  }

  /** Place the Boss for the current phase (Day Loop F7; showcase may hold him at the Morning stop). */
  _placeBoss(ev) {
    const s = this.s;
    if (s.boss.verdicted) return;
    let at = 'den_wall';
    if (s.window_open) {
      const over = this.showcase ? this.D.showcase.boss_stop_by_phase : null;
      at = over ? over[s.phase] : Object.values(this.D.patrol).find(r => r.phases.includes(s.phase)).Name;
    }
    if (at !== s.boss.at) {
      s.boss.at = at;
      ev.push({ type: 'BossMoved', district: s.district, boss: s.boss.id, at, patch: this.D.patrol[at].patch, roaming: this.D.patrol[at].roaming, phase: s.phase });
    }
  }

  _endChallenge(reason, ev) {
    const c = this.s.challenger;
    if (!c || c.beaten) return;
    c.beaten = true;
    ev.push({ type: 'ChallengeEnded', district: this.s.district, cat: c.id, patch: c.patch, reason });
  }

  /** Apply a rolled raid outcome (Territory §3.7 outcomes, Strong rule, window rule, gloat, Anchor, Scrapper). */
  _resolveRaid(raid, night, ev) {
    const k = this.D.k, s = this.s, d = s.district;
    const { patch, motive, leader = null } = raid;
    const why = this.raidInadmissible(patch, motive, night);
    if (why) { const r = { patch, motive, outcome: 'declined', reason: why }; ev.push({ type: 'RaidResolved', district: d, ...r, presence: !!raid.presence }); return r; }
    const p = s.patches[patch], row = this.D.patches[patch];
    let outcome = raid.outcome;
    const atResolution = p.scent;
    if (outcome === 'lost' && (atResolution >= k.strong || (s.window_open && row.outer) || k.motives[motive]?.never_lost)) outcome = 'scuffed';
    const sentry = p.sentry && this._watched(p, night) ? p.sentry : null;
    if (outcome === 'repelled') {
      p.scent = Math.max(0, p.scent + k.raid_repelled);
      if (sentry && sentry.style === 'scrapper' && raid.leader_home && s.patches[raid.leader_home]?.owner && s.patches[raid.leader_home].owner !== this.dist.player_clowder) {
        const h = s.patches[raid.leader_home]; h.scent = Math.max(0, h.scent - k.scrapper_repel);
      }
      if (motive === 'challenge' && s.challenger) {
        s.challenger.repels++;
        if (s.challenger.repels >= k.challenger_repels_to_leave) this._endChallenge('repelled_twice', ev);
      }
    } else if (outcome === 'scuffed') {
      p.scent = Math.max(0, p.scent + (sentry && sentry.style === 'bruiser' ? k.raid_scuffed_anchor : k.raid_scuffed));
      if (sentry && sentry.personality !== 'brooder') p.routed_night = night;
    } else if (outcome === 'lost') {
      const clowder = raid.clowder || (motive === 'challenge' ? 'outsiders' : this.dist.gang);
      const keeper = motive === 'challenge' && s.challenger ? s.challenger.id : leader;
      if (p.sentry) ev.push({ type: 'SentryReturned', district: d, patch, cat: p.sentry.cat, cause: 'lost' });
      Object.assign(p, { owner: clowder, keeper, scent: k.raid_lost_scent, sentry: null, routed_night: null, stale_until_night: night + k.stale_claim_nights, contest: null });
      ev.push({ type: 'PatchChanged', district: d, patch, owner: clowder, previous_owner: this.dist.player_clowder, keeper, cause: 'raid_lost' });
      if (motive === 'challenge') this._endChallenge('took_post', ev);
    }
    p.last_raided_night = night;
    const r = { patch, motive, requested_outcome: raid.outcome, outcome, scent_at_resolution: atResolution, scent_after: p.scent };
    ev.push({ type: 'RaidResolved', district: d, ...r, presence: !!raid.presence });
    return r;
  }

  _ticks() {
    const s = this.s, bell = this.dist.player_clowder, t = [];
    if (s.window_open && !s.boss.verdicted) t.push({ kind: 'roaming_boss', target: s.boss.at, patch: this.D.patrol[s.boss.at].patch });
    if (s.challenger && !s.challenger.beaten) t.push({ kind: 'challenger', target: this.D.patches[s.challenger.patch].post, patch: s.challenger.patch });
    for (const id of this.dist.patches) { const p = s.patches[id]; if (p.owner === bell && p.scent < this.D.k.strong) t.push({ kind: 'fading_post', target: this.D.patches[id].post, patch: id }); }
    for (const id of this.dist.patches) {
      const p = s.patches[id], row = this.D.patches[id];
      if (p.owner == null || p.owner === bell || (row.boss_seat && !s.boss.verdicted)) continue;
      t.push({ kind: 'rival_mark', target: row.post, patch: id });
    }
    return t.slice(0, this.D.k.compass_ticks_max);
  }
}

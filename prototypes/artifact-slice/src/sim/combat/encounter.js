// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The combat encounter: a deterministic fixed-tick simulation of design/gdd/combat-system.md for the
// M1 grey box. Pure logic, no rendering. See API.md for the contract the presentation layer builds on.
import { Rng } from '../core/rng.js';
import { hashOf } from '../core/hash.js';
import * as F from './formulas.js';
import { Arbiter, BASE_TIER } from './feel.js';
import { dist, len, norm, clamp, inCone, inShape, closestOnSeg } from './geom.js';
import { posseThink, enemyThink, bossThink } from './ai.js';
import { playerInput, atkTick, dashTick, canMoveFraction, lockOn } from './player.js';
import { gainSpecial, specialPrompt, trySpecial, chainTick } from './special.js';

const INF = Infinity;

export class Encounter {
  /**
   * @param {object} D indexed data (data.js buildData)
   * @param {object} def encounter row (encounters.json) or an inline object of the same shape
   * @param {object} opts {seed, showcase, difficulty, reduceFlashes, motionScale, anger:{id:stage}, controlled}
   */
  constructor(D, def, opts = {}) {
    this.D = D; this.k = D.k; this.def = def; this.opts = opts;
    this.seed = (opts.seed ?? 1) >>> 0;
    this.rng = new Rng(this.seed);
    this.arena = D.arenas[def.arena];
    this.diff = this.k.difficulty[opts.difficulty || 'Alley'];
    this.show = opts.showcase ? D.showcase : {};
    this.phaseCap = this.show.boss_phase_cap ?? 3;
    this.arbiter = new Arbiter(D, { reduceFlashes: opts.reduceFlashes, motionScale: opts.motionScale });
    this.DT = 1 / this.k.tick_hz;
    this.tick = 0; this.realT = 0; this.simT = 0; this.fightT = 0; this.timeScale = 1;
    this.mode = def.opener === 'standoff' ? 'standoff' : 'fight';
    this.modeT = 0;
    this.skillBar = false;
    this.chain = null; this.chainCount = 0; this.slowMo = null; this.firstStagger = true;
    this.globalStop = 0;
    this.events = []; this.log = [];
    this.entities = []; this.byId = new Map();
    this.teles = []; this.teleSeq = 0;
    this.orderSeq = 0; this.orderState = new Map(); this.sbChain = [];
    this.pile = null; // the old Pile-On (M1); replaced by the Special chain in M1.1
    this.lockId = null;
    this.scramT = 0; this.fedUp = false;
    this.outcome = null; this.victorIds = [];
    this.props = (this.arena.props || []).map(p => ({ ...p, x: p.pos[0], z: p.pos[1], usesLeft: p.uses }));
    this.hrs = this.arena.high_roads || [];
    this.ringC = { x: this.arena.ring_center[0], z: this.arena.ring_center[1] };
    this.ringR = this.arena.ring_radius_m ?? this.k.ring_radius_m;
    // Ring bounds: the circle, cut by each High Road wall on its playable (drop) side, so fights stay in front of walls.
    this.halfPlanes = this.hrs.map(h => { const off = h.width / 2 + this.k.cat_radius_m + 0.05;
      return { point: [h.a[0] + h.drop_side[0] * off, h.a[1] + h.drop_side[1] * off], normal: h.drop_side.slice(), wall: h.id }; });
    this.ambushPending = def.opener === 'ambush_by_player';

    def.posse.forEach((id, i) => this._spawn(id, 'posse', i, this.arena.spawns.posse[i]));
    def.enemies.forEach((id, i) => this._spawn(id, 'enemy', i, this.arena.spawns.enemy[i % this.arena.spawns.enemy.length]));
    if (def.guest) {
      const g = this._spawn(def.guest.cat, 'guest', -1, this.arena.spawns.guest_edge);
      g.present = false; g.guest = { state: 'waiting', t: 0, cue: def.guest.cue };
    }
    this.controlledId = this.posse()[0].id; // M1.1: the player controls Mikan only
    const sp = this.show.special_start;
    for (const p of this.posse()) p.special = opts.special?.[p.cat] ?? (sp ? (p.cat === 'mikan' ? sp.mikan : sp.crew) : this.k.special_start);
    this._emit({ type: 'EncounterStarted', encounter_id: def.Name, opener: def.opener, arena: def.arena,
      posse: def.posse.slice(), enemies: this.enemies().map(e => e.id), guest: def.guest?.cat ?? null });
    if (this.mode === 'standoff') this._standoffStart(); else this._fightStart();
    this._carry = this.events; // constructor events are returned by the first step()
  }

  /* ------------------------------------------------------------ setup */

  _spawn(catId, side, slot, at) {
    const base = this.D.cats[catId];
    if (!base) throw new Error(`unknown combatant ${catId}`);
    const row = { ...base, ...(this.show.combatant_overrides?.[catId] || {}) }; // showcase-only (never transfers)
    let id = catId, n = 2;
    while (this.byId.has(id)) id = `${catId}_${n++}`;
    const stats = F.statsFor(row, this.D);
    if (side === 'enemy') stats.nerve = Math.round(stats.nerve * this.diff.enemy_nerve);
    const boss = row.boss_kit ? this.D.bosses[row.boss_kit] : null;
    const facing = side === 'enemy' ? [0, 1] : [0, -1];
    const e = {
      id, cat: catId, row, side, slot, name: row.display, rank: row.rank, rankRow: this.D.ranks[row.rank],
      style: row.style, styleRow: this.D.styles[row.style], pers: this.D.personalities[row.personality], level: row.level, stats,
      x: at[0], z: at[1], y: 0, fx: facing[0], fz: facing[1], vx: 0, vz: 0,
      radius: boss ? this.k.boss_radius_m : this.k.cat_radius_m,
      nerve: stats.nerve, nerveMax: stats.nerve, healed: 0,
      paws: 0, fzg: 0, frazzledT: 0, lastFzGainT: -INF,
      ruffledT: 0, reruffleCd: 0, splatT: 0, clumpedT: 0, flinchT: 0, flinchImmuneT: 0, leaderFlinchCd: 0,
      status: null, anger: null, angerBuffedS: 0, puffT: 0, special: 0, specialLost: 0, launchedT: 0,
      act: null, hitstop: 0, routed: false, gone: false, present: true,
      onHR: null, mantleAt: -INF, hrSince: 0, bracing: false,
      hissCd: 0, moveCd: {}, enemyPaws: 0, healedEnemy: 0,
      lastHitT: -INF, lastAttackerId: null, firstLeaderHit: false, fearCount: {},
      moves: (row.moves || []).slice(0, 4), orders: [], reserved: 0,
      ai: { targetId: null, cd: 0, retarget: 0, hrWait: 0, avengeId: null, avengeT: 0, rollWait: 0, decided: {}, tokenOn: null, strings: 0, intent: 'stalk', phaseT: 0, engageOn: null, engageCd: 0, comboLeft: 0, circleSign: 1, decideT: 0 },
      boss: boss ? { kit: boss, phase: 1, state: 'wall', groundT: 0, swingCd: 2, pendingBreak: false, carry: 0, wasFrazzled: false } : null,
      guest: null, aiStream: this.rng.sub(`ai:${id}`),
    };
    if (boss) { const hr = this.hrs.find(h => h.boss_wall) || this.hrs[0]; const st = this.arena.boss_stop?.pos || [e.x, e.z];
      e.x = st[0]; e.z = st[1]; e.onHR = hr.id; e.y = hr.y; e.hrSince = 0; }
    this.entities.push(e); this.byId.set(id, e);
    return e;
  }

  posse() { return this.entities.filter(e => e.side === 'posse'); }
  enemies() { return this.entities.filter(e => e.side === 'enemy'); }
  guestE() { return this.entities.find(e => e.side === 'guest') || null; }
  get controlled() { return this.byId.get(this.controlledId); }
  /** Cats fighting on the Posse's side and present in the ring. */
  allies() { return this.entities.filter(e => (e.side === 'posse' || e.side === 'guest') && e.present && !e.gone); }
  standing(e) { return e && e.present && !e.gone && !e.routed; }
  opponentsOf(e) { return e.side === 'enemy' ? this.allies().filter(a => !a.routed) : this.enemies().filter(x => this.standing(x)); }
  hr(id) { return this.hrs.find(h => h.id === id); }

  /* ------------------------------------------------------------ events */

  _emit(ev) { ev.t = +this.realT.toFixed(6); ev.sim_t = +this.simT.toFixed(6); ev.tick = this.tick; this.events.push(ev); this.log.push(ev); return ev; }

  /** Emit with a feel request; applies the arbiter's hit-stop to the sim. */
  _emitFeel(ev, req, att, tgt, noStop = false) {
    ev.feel = this.arbiter.filter(req, this.realT);
    const hs = noStop ? { scope: 'none' } : ev.feel.hitstop;
    if (hs.scope === 'global') this.globalStop = Math.max(this.globalStop, hs.ms / 1000);
    else if (hs.scope === 'local') { for (const x of [att, tgt]) if (x) x.hitstop = Math.max(x.hitstop, hs.ms / 1000); }
    return this._emit(ev);
  }

  /* ------------------------------------------------------------ step */

  /**
   * Advance one fixed tick (1/60 s real time).
   * @param {object} input see API.md InputFrame
   * @returns {object[]} events emitted this tick (already filtered by the safety arbiter)
   */
  step(input = {}) {
    if (this.mode === 'ended') return [];
    this.events = this._carry || []; this._carry = null;
    this.tick++; this.realT = this.tick * this.DT;
    if (this.mode === 'special') { chainTick(this); this.timeScale = 0; return this.events; } // time stops for the chain
    let scale = 1;
    if (this.slowMo) { scale = this.slowMo.scale; this.slowMo.left -= this.DT; if (this.slowMo.left <= 1e-9) this.slowMo = null; }
    if (this.globalStop > 1e-9) { this.globalStop = Math.max(0, this.globalStop - this.DT); scale = 0; }
    else if (this.skillBar) scale = Math.min(scale, this.k.slow_blink_scale);
    this.timeScale = scale;
    const dt = this.DT * scale;
    this.simT += dt; this.modeT += this.DT;

    if (this.mode === 'standoff') {
      if (this.modeT >= this.k.standoff_s - 1e-9) this._fightStart();
    } else if (this.mode === 'gloat') {
      if (this.modeT >= this.k.gloat_s - 1e-9) this._end('loss');
    } else {
      if (this.mode === 'fight') this.fightT += dt;
      this._input(input, dt);
      for (const e of this.entities) { e.edt = e.hitstop > 1e-9 ? 0 : dt; e.hitstop = Math.max(0, e.hitstop - this.DT); }
      this._timers(dt);
      this._guestTick(dt);
      if (!this.pile) this._think();
      this._acts();
      this._orders();
      this._integrate();
      this._telegraphs();
      this._bossBreakCheck();
      this._fedUpCheck();
      this._endCheck(dt);
    }
    return this.events;
  }

  /* ------------------------------------------------------------ standoff / start */

  _standoffStart() {
    const lines = [];
    const opp = this.enemies().map(e => e.cat);
    for (const p of this.posse().concat(this.guestE() ? [this.guestE()] : [])) {
      if (p.row.old_boss_id && opp.includes(p.row.old_boss_id) && p.pers.old_gang === 'resist')
        lines.push({ cat: p.id, kind: 'defiant', text: p.pers.defiant_line || null });
      for (const kin of p.row.kin_ids || []) if (opp.includes(kin)) lines.push({ cat: p.id, kind: 'kin', of: kin });
    }
    this._emit({ type: 'StandoffStart', duration_s: this.k.standoff_s, enemies: this.enemies().map(e => e.id), barks: lines });
  }

  _fightStart() {
    this.mode = 'fight'; this.modeT = 0;
    const oppCats = this.enemies().map(e => e.cat);
    // Fired Up by anger stage (OR-07): Boss only, read once here.
    for (const e of this.enemies()) {
      if (e.rank !== 'boss') continue;
      const stage = this.opts.anger?.[e.cat] ?? this.show.anger_stage?.[e.cat] ?? e.row.anger_stage ?? 'Calm';
      const s = F.angerFiredUpSeconds(stage, this.k);
      e.angerStage = stage;
      if (s > 0) { e.anger = { left: s, total: s }; this._emit({ type: 'StatusApplied', cat: e.id, status: 'fired_up', source: 'anger', stage, duration_s: s === INF ? null : s }); }
    }
    // Old Gang Nerves -> Cowed on a susceptible recruit (OR-06).
    for (const p of this.posse()) {
      if (F.nervesApply(p.row, oppCats, this.D)) {
        const s = F.nervesSeconds(p.pers.Name, this.k);
        this._applyStatus(p, 'cowed', s, 'nerves');
      }
    }
    if (this.ambushPending) for (const p of this.posse()) this._grantPaw(p, this.k.ambush_grant);
    if (this.mode === 'fight' && this.tick > 0) this._emit({ type: 'StandoffEnd' });
    this._emit({ type: 'FightStarted' });
    const g = this.guestE();
    if (g && g.guest.cue === 'start') this._guestJoin(g);
  }

  /* ------------------------------------------------------------ guest (OR-13) */

  _guestJoin(g) {
    g.guest.state = 'yowl'; g.guest.t = 0;
    this._emit({ type: 'AllyJoined', cat_id: g.id, encounter_id: this.def.Name });
    this._emit({ type: 'AllyYowl', cat: g.id, from: [g.x, g.z], duration_s: this.k.guest_entry_yowl_s });
  }

  _guestTick(dt) {
    const g = this.guestE();
    if (!g || !g.guest) return;
    if (g.guest.state === 'yowl') {
      g.guest.t += dt;
      const count = this.entities.filter(e => e.present && !e.gone).length;
      if (g.guest.t >= this.k.guest_entry_yowl_s - 1e-9 && count < this.k.max_combatants) {
        g.guest.state = 'in'; g.present = true;
        const [dx, dz] = norm(this.ringC.x - g.x, this.ringC.z - g.z);
        g.fx = dx; g.fz = dz;
        g.act = { kind: 'enter', t: 0, dur: 0.6, vx: dx * 3, vz: dz * 3 };
        this._emit({ type: 'GuestEntered', cat: g.id });
      }
    }
  }

  /* ------------------------------------------------------------ input (controlled cat + meta) */

  _input(inp, dt) {
    // Skill bar (R; M1.1): time slows, Mikan's Moves and forced crew skills are commanded. Aliases: slowBlink.
    if (inp.skillBar || inp.slowBlink) {
      if (this.skillBar) this._skillBarClose('input');
      else if (this.mode === 'fight') { this.skillBar = true; this.sbChain = []; this._emit({ type: 'SkillBarOpen' }); }
    }
    if (inp.command) this._command(inp.command);
    if (inp.lockOn) lockOn(this);
    if (inp.lockId !== undefined && (inp.lockId === null || (this.standing(this.byId.get(inp.lockId)) && this.byId.get(inp.lockId).side === 'enemy'))) this.lockId = inp.lockId;
    const l = this.byId.get(this.lockId); if (this.lockId && !this.standing(l)) { this.lockId = null; this._emit({ type: 'LockTarget', target: null, locked: false, reason: 'target_gone' }); }
    const c = this.controlled;
    if (!this.standing(c) || this.skillBar) { if (c) { c.bracing = false; c.moveIntent = [0, 0]; } return; }
    if (this.pendingHiss && this._canAct(c)) { this.pendingHiss = false; this._hiss(c, 'player'); }
    if (inp.special) { if (trySpecial(this)) return; } // F on a staggered enemy
    playerInput(this, c, inp);
  }

  /** Can this cat start a new verb now? Strings cancel into anything (Combat §3.2). */
  _canAct(e) {
    if (!this.standing(e) || e.splatT > 0 || e.flinchT > 0 || e.frazzledT > 0) return false;
    if (!e.act) return true;
    return e.act.kind === 'string' || e.act.kind === 'posture';
  }

  /* ------------------------------------------------------------ verbs */

  _face(e, t) { const [x, z] = norm(t.x - e.x, t.z - e.z); if (x || z) { e.fx = x; e.fz = z; } }

  _startString(e, authored, auto = false) {
    const t = e.side === 'enemy' ? null : this._meleeTarget(e);
    if (t) this._face(e, t);
    e.act = { kind: 'string', idx: 0, t: 0, hit: false, queued: auto, auto, authored, targetId: t?.id ?? null };
  }

  /** Lock target if in reach and on the same level, else the nearest opponent in front within reach. */
  _meleeTarget(e, reachIn) {
    const reach = reachIn ?? this.k.string_reach_m + 0.6;
    const lock = e.id === this.controlledId ? this.byId.get(this.lockId) : this.byId.get(e.ai.targetId);
    const ok = t => this.standing(t) && t.present && this._sameLevel(e, t) && dist(e, t) <= reach + t.radius;
    if (ok(lock)) return lock;
    let best = null, bd = INF;
    for (const t of this.opponentsOf(e)) { if (!ok(t)) continue; const d = dist(e, t); if (d < bd) { bd = d; best = t; } }
    return best;
  }

  _sameLevel(a, b) { return Math.abs(a.y - b.y) < 0.5; }

  _skitter(e, dirIn) {
    let [dx, dz] = dirIn;
    if (!dx && !dz) { dx = -e.fx; dz = -e.fz; }
    e.act = { kind: 'skitter', t: 0, dur: this.k.skitter_s, vx: dx * this.k.skitter_m / this.k.skitter_s, vz: dz * this.k.skitter_m / this.k.skitter_s };
    this._emit({ type: 'Skitter', cat: e.id });
  }

  _hop(e, dirIn) {
    const k = this.k;
    if (e.onHR) {
      const hr = this.hr(e.onHR);
      let side = hr.drop_side;
      if (dirIn[0] || dirIn[1]) side = (dirIn[0] * hr.drop_side[0] + dirIn[1] * hr.drop_side[1]) >= 0 ? hr.drop_side : [-hr.drop_side[0], -hr.drop_side[1]];
      if (hr.boss_wall) side = hr.drop_side; // the yard side; the far side is out of the arena
      e.act = { kind: 'drop', t: 0, dur: 0.35, from: [e.x, e.z, e.y], to: [e.x + side[0] * 0.8, e.z + side[1] * 0.8, 0] };
      e.onHR = null; this._emit({ type: 'HopDown', cat: e.id });
      return;
    }
    for (const hr of this.hrs) {
      const p = closestOnSeg(hr.a, hr.b, e);
      if (len(e.x - p.x, e.z - p.z) <= k.mantle_reach_m) {
        if (hr.boss_wall && e.side !== 'enemy' && this._onWallCount(hr.id, e) >= k.max_on_boss_wall && e.id !== this.controlledId) return;
        e.act = { kind: 'mantle', t: 0, dur: k.mantle_s, from: [e.x, e.z, 0], to: [p.x, p.z, hr.y], hr: hr.id };
        this._emit({ type: 'Mantle', cat: e.id, high_road: hr.id });
        return;
      }
    }
    e.act = { kind: 'hop', t: 0, dur: k.hop_s };
    this._emit({ type: 'Hop', cat: e.id });
  }

  _onWallCount(hrId, except) {
    return this.allies().filter(a => a !== except && !a.routed && (a.onHR === hrId || (a.act?.kind === 'mantle' && a.act.hr === hrId))).length;
  }

  _pounce(e, t, authored, tAloft, sinceMantle) {
    const p = F.pounce(e.onHR ? tAloft : 0, e.onHR ? sinceMantle : INF, this.k);
    this._face(e, t);
    const [dx, dz] = norm(e.x - t.x, e.z - t.z);
    e.act = { kind: 'pounce', t: 0, dur: 0.35, from: [e.x, e.z, e.y], to: [t.x + dx * 0.7, t.z + dz * 0.7, t.y], targetId: t.id, authored, mv: p.mv, fz: p.fz, noPaw: p.noPaw };
    if (e.onHR) e.onHR = null;
    this._emit({ type: 'Pounce', cat: e.id, target: t.id, mv: p.mv, fz: p.fz, wind_up_s: e.onHR ? Math.min(3, tAloft) : 0 });
  }

  _hiss(e, authored) {
    const k = this.k;
    if (e.hissCd > 0) return false;
    e.hissCd = k.hiss_cd_s;
    e.act = { kind: 'hiss', t: 0, dur: 0.4 };
    const fwd = [e.fx, e.fz];
    // 1. A yellow telegraph in front within 4 m: interrupt the nearest one only (edge 12).
    let best = null, bd = INF, red = false;
    for (const tl of this.teles) {
      const a = this.byId.get(tl.attackerId);
      if (!a || !inCone(e, fwd, k.hiss_reach_m, k.hiss_arc_deg, a, a.radius)) continue;
      if (tl.cls === 'red') { red = true; continue; }
      if (tl.cls !== 'yellow') continue;
      const d = dist(e, a); if (d < bd) { bd = d; best = tl; }
    }
    if (best) { this._hissInterrupt(e, best, authored); return true; }
    // 2. Toughs: Back Down at low Nerve, else flinch.
    let any = false;
    for (const t of this.opponentsOf(e)) {
      if (!inCone(e, fwd, k.hiss_reach_m, k.hiss_arc_deg, t, t.radius)) continue;
      const bd = this.fedUp && (t.rank === 'tough' || t.rank === 'stray') ? Math.max(k.fed_up_back_down_pct, t.rankRow.back_down_pct ?? 0) : t.rankRow.back_down_pct;
      if (bd != null && t.nerve / t.nerveMax <= bd + 1e-9) {
        any = true;
        this._emitFeel({ type: 'BackDown', cat: t.id, by: e.id }, { tier: BASE_TIER.back_down, authored, victim: 'enemy', kind: 'back_down' }, e, t);
        this._rout(t, e, 'by_back_down');
      } else if (!t.rankRow.leader && t.side === 'enemy' && !this._armoured(t)) { t.flinchT = k.trash_flinch_s; any = true; }
    }
    this._emit({ type: red && !any ? 'HissFizzle' : 'Hiss', cat: e.id });
    return true;
  }

  _hissInterrupt(e, tl, authored) {
    const a = this.byId.get(tl.attackerId);
    const k = this.k;
    this._removeTele(tl.id, 'interrupted');
    if (a.boss && a.act?.moveId === 'climb_back') {
      a.boss.groundT += k.climbback_hiss_extra_s; a.act = null;
      this._emitFeel({ type: 'HissInterrupt', tele: tl.id, aimed_at: tl.aimedAt, authored, cat: e.id, target: a.id, move: 'climb_back' }, { tier: BASE_TIER.hiss_interrupt, authored, victim: 'enemy', kind: 'hiss_interrupt' }, e, a);
    } else if (a.act?.moveId === 'rival_bolt') {
      a.act = null;
      this._emitFeel({ type: 'HissInterrupt', tele: tl.id, aimed_at: tl.aimedAt, authored, cat: e.id, target: a.id, move: 'rival_bolt' }, { tier: BASE_TIER.hiss_interrupt, authored, victim: 'enemy', kind: 'hiss_interrupt' }, e, a);
    } else {
      const mv = this.D.moves[a.act?.moveId];
      if (mv && mv.cost > 0) a.enemyPaws = Math.max(0, a.enemyPaws - mv.cost * k.paw_points); // the interrupted enemy spends the Paw
      if (a.act?.moveId) a.moveCd[a.act.moveId] = k.hiss_interrupt_move_cd_s;
      a.act = null; this._releaseToken(a);
      this._ruffle(a, e);
      this._flinch(a, 'hiss');
      this._emitFeel({ type: 'HissInterrupt', tele: tl.id, aimed_at: tl.aimedAt, authored, cat: e.id, target: a.id, move: tl.moveId }, { tier: BASE_TIER.hiss_interrupt, authored, victim: 'enemy', kind: 'hiss_interrupt' }, e, a);
    }
  }

  _slotOrder() { return this.posse().slice().sort((a, b) => a.slot - b.slot); }

  /* ------------------------------------------------------------ skill bar and orders */

  _skillBarClose(reason) { if (!this.skillBar) return; this.skillBar = false; this._emit({ type: 'SkillBarClose', reason }); }

  _command(cmd) {
    if (!this.skillBar) { this._emit({ type: 'CommandRejected', reason: 'skill_bar_closed', command: cmd }); return; }
    if (cmd.action === 'scram') { this._end('player_fled', { by: 'skill_bar' }); return; }
    if (cmd.action === 'hiss') { const c = this.controlled; if (this.standing(c)) { this.pendingHiss = true; this._emit({ type: 'CommandQueued', id: null, cat: c.id, move: 'hiss', target: null }); } return; }
    const cat = this.byId.get(cmd.cat);
    if (!cat || cat.side !== 'posse' || !this.standing(cat)) { this._emit({ type: 'CommandRejected', reason: 'bad_cat', command: cmd }); return; }
    const moveId = typeof cmd.slot === 'number' ? cat.moves[cmd.slot] : cmd.move;
    const mv = this.D.moves[moveId];
    if (!mv || !cat.moves.includes(moveId)) { this._emit({ type: 'CommandRejected', reason: 'bad_move', command: cmd }); return; }
    const target = cmd.target ? this.byId.get(cmd.target) : (mv.target === 'ally' ? cat : this.byId.get(this.lockId));
    if (!target || !this.standing(target)) { this._emit({ type: 'CommandRejected', reason: 'bad_target', command: cmd }); return; }
    if (mv.shape === 'heal' && target.healed >= this.k.heal_cap * target.nerveMax - 1e-9) { this._emit({ type: 'CommandRejected', reason: 'heal_capped', command: cmd }); return; }
    // Commands chain (Combat §3.4): a command on a target another cat was just ordered onto in this Slow Blink waits
    // for that order to resolve, so a Set-up lands before its Pay-off (Shoulder Check -> Bunny-Kick).
    const prev = (this.sbChain || []).filter(o => o.target === target.id && o.cat !== cat.id && this.orderState.get(o.id) !== 'dropped').pop();
    const o = { move: moveId, target: target.id, authored: 'player', waitFor: prev ? prev.id : null };
    if (!this._queueOrder(cat, o)) { this._emit({ type: 'CommandRejected', reason: 'paws', command: cmd }); return; }
    // A skill-bar command to a cat steadies it: it clears Old Gang Nerves' Cowed (M1.1 §8; was the Tag-In).
    if (cat.status?.kind === 'cowed' && cat.status.src === 'nerves') { cat.status = null; this._emit({ type: 'StatusEnded', cat: cat.id, status: 'cowed', reason: 'command' }); this._emit({ type: 'Bark', cat: cat.id, kind: 'steeled' }); }
    (this.sbChain = this.sbChain || []).push({ id: o.id, cat: cat.id, target: target.id });
  }

  _queueOrder(cat, o) {
    const cost = this.D.moves[o.move].cost * this.k.paw_points;
    if (cat.paws - cat.reserved < cost - 1e-9) return false;
    o.id = ++this.orderSeq; this.orderState.set(o.id, 'queued');
    cat.reserved += cost; cat.orders.push(o);
    this._emit({ type: 'CommandQueued', id: o.id, cat: cat.id, move: o.move, target: o.target, shortcut: !!o.shortcut, after: o.waitFor ?? null });
    return true;
  }

  /** Execute the front order of every cat: path to range (or leap if the target is Frazzled), then cast. */
  _orders() {
    for (const e of this.entities) {
      if (!e.orders.length || !this.standing(e)) continue;
      const o = e.orders[0], t = this.byId.get(o.target), mv = this.D.moves[o.move];
      if (!this.standing(t)) { e.orders.shift(); e.reserved -= mv.cost * this.k.paw_points; this.orderState.set(o.id, 'dropped'); this._emit({ type: 'CommandDropped', id: o.id, cat: e.id, move: o.move, reason: 'target_gone' }); continue; }
      if (o.waitFor) { // wait for the Set-up to resolve: its Move finished and the target is no longer flying back
        const st = this.orderState.get(o.waitFor);
        const settled = t.act?.kind !== 'knockback' && t.act?.kind !== 'fall';
        if (!(st === 'dropped' || (st === 'done' && settled))) { e.goal = null; continue; }
      }
      if (!this._canAct(e) || (e.act && e.act.kind !== 'string' && e.act.kind !== 'posture')) continue;
      if (e.act && e.act.kind === 'string' && !(e.act.hit || e.act.t < 0.05)) continue;
      const reachHR = mv.flags?.includes('reaches_high_road') || mv.shape === 'ring' || mv.shape === 'heal' || mv.shape === 'self';
      const range = (mv.shape === 'charge' ? mv.range : Math.max(mv.range, 0.5)) + t.radius;
      const d = dist(e, t);
      const levelOk = reachHR || this._sameLevel(e, t);
      if (mv.target !== 'self' && mv.shape !== 'ring' && (d > range || !levelOk)) {
        if (t.frazzledT > 0 && levelOk) { // skip pathing: leap to range (Combat §3.4)
          const [dx, dz] = norm(e.x - t.x, e.z - t.z);
          e.act = { kind: 'leap', t: 0, dur: 0.2, from: [e.x, e.z, e.y], to: [t.x + dx * Math.min(range - 0.2, 1.2), t.z + dz * Math.min(range - 0.2, 1.2), e.y] };
        } else if (!levelOk && t.onHR && !e.onHR) {
          const hr = this.hr(t.onHR), p = closestOnSeg(hr.a, hr.b, e);
          if (len(e.x - p.x, e.z - p.z) <= this.k.mantle_reach_m) this._hop(e, [0, 0]); else e.goal = { x: p.x + hr.drop_side[0] * 0.6, z: p.z + hr.drop_side[1] * 0.6 };
        } else if (!levelOk && e.onHR && !t.onHR) {
          this._hop(e, [0, 0]);
        } else e.goal = { x: t.x, z: t.z, stopAt: range - 0.3 };
        continue;
      }
      e.orders.shift(); e.reserved -= mv.cost * this.k.paw_points; e.goal = null;
      this.orderState.set(o.id, 'started');
      this._startMove(e, o.move, t, o.authored, o.id);
    }
  }

  /* ------------------------------------------------------------ Moves (Combat §3.10) */

  _startMove(e, moveId, t, authored, orderId = null) {
    const mv = this.D.moves[moveId], k = this.k;
    if (t && t !== e) this._face(e, t);
    if (e.side === 'enemy') { this._enemyWindup(e, moveId, t); return; }
    e.act = { kind: 'move', moveId, t: 0, windup: k.move_windup_s, dur: k.move_windup_s + k.move_recovery_s, committed: false, targetId: t?.id ?? null, authored, orderId };
  }

  _commitMove(e) {
    const a = e.act, mv = this.D.moves[a.moveId], k = this.k;
    const t = this.byId.get(a.targetId);
    const cost = mv.cost * k.paw_points;
    if (e.side !== 'enemy' && e.paws < cost - 1e-9) { e.act = null; this._emit({ type: 'MoveFizzled', cat: e.id, move: mv.Name, reason: 'paws' }); return; }
    if (e.side !== 'enemy') e.paws -= cost; else e.enemyPaws = Math.max(0, e.enemyPaws - cost);
    a.committed = true;
    if (a.orderId) this.orderState.set(a.orderId, 'committed');
    const hits = this._applyMove(e, mv, t, a.authored, null);
    this._emit({ type: 'MoveUsed', user: e.id, move: mv.Name, targets_hit: hits, authored: a.authored, paws_after: e.side === 'enemy' ? null : e.paws });
  }

  /** Resolve a Move's effect. `shape` (enemy telegraphs) restricts targets to the drawn shape. */
  _applyMove(e, mv, t, authored, shape) {
    const k = this.k, hits = [];
    const opp = this.opponentsOf(e);
    const tierKind = mv.cost >= 2 ? 'move2' : 'move1';
    const payoff = x => mv.pays_on?.some(s => this._hasState(x, s));
    const specFor = x => {
      const po = payoff(x) ? (mv.payoff || {}) : {};
      return { mv: mv.mv * (po.mv_mult ?? 1), fz: mv.fz * (po.fz_mult ?? 1), flatFz: po.fz_add ?? 0, type: mv.type, kind: tierKind, moveId: mv.Name, authored,
        creates: mv.creates, status: mv.status, splatExtend: po.splat_extend_s, cls: shape?.cls };
    };
    switch (mv.shape) {
      case 'single': {
        const tgt = shape ? opp.find(x => inShape(shape, x, x.radius) && this._sameLevel(e, x)) : t;
        if (tgt && this.standing(tgt) && (shape || dist(e, tgt) <= mv.range + tgt.radius + 0.6)) {
          if (mv.no_boss && tgt.boss) break;
          const kb = mv.knockback_m ? { m: mv.knockback_m, splatOnCollision: mv.splat_on_collision, bonusMv: mv.collision_bonus_mv } : null;
          this._hit(e, tgt, { ...specFor(tgt), knockback: kb }); hits.push(tgt.id);
        }
        break;
      }
      case 'charge': {
        const dir = shape ? shape.dir : norm(t.x - e.x, t.z - e.z);
        let tgt = null, bd = INF;
        for (const x of opp) {
          if (!this._sameLevel(e, x)) continue;
          const ok = shape ? inShape(shape, x, x.radius) : x === t && dist(e, x) <= mv.range + x.radius + 0.3;
          if (ok) { const d = dist(e, x); if (d < bd) { bd = d; tgt = x; } }
        }
        const travel = tgt ? Math.max(0, bd - (e.radius + tgt.radius)) : mv.range;
        e.x += dir[0] * travel; e.z += dir[1] * travel; e.fx = dir[0]; e.fz = dir[1];
        if (tgt) {
          const kb = tgt.boss ? { m: mv.boss_push_m, source: 'shoulder_check', dir } : { m: mv.knockback_m, splatOnCollision: true, dir, source: 'shoulder_check' };
          this._hit(e, tgt, { ...specFor(tgt), knockback: kb }); hits.push(tgt.id);
        }
        break;
      }
      case 'radius': {
        const c = mv.target === 'self' ? e : (t || e);
        if (mv.target !== 'self' && t) { e.x = t.x - e.fx * 0.5; e.z = t.z - e.fz * 0.5; if (t.onHR && mv.flags?.includes('reaches_high_road')) { e.y = t.y; e.onHR = t.onHR; } }
        for (const x of opp) {
          if (len(x.x - c.x, x.z - c.z) > mv.radius + x.radius) continue;
          if (mv.target !== 'self' && !mv.flags?.includes('reaches_high_road') && !this._sameLevel(e, x)) continue;
          if (mv.self_dr) { this._ruffle(x, e); hits.push(x.id); continue; }
          this._hit(e, x, specFor(x)); hits.push(x.id);
        }
        if (mv.self_dr) { e.puffT = mv.self_dr.s; }
        break;
      }
      case 'cone': {
        const dir = shape ? shape.dir : (t ? norm(t.x - e.x, t.z - e.z) : [e.fx, e.fz]);
        for (const x of opp) {
          const ok = shape ? inShape(shape, x, x.radius) : inCone(e, dir, mv.range, mv.angle_deg, x, x.radius);
          if (!ok) continue;
          if (mv.pull_m && !x.rankRow.leader) { const [px, pz] = norm(e.x - x.x, e.z - x.z); x.x += px * mv.pull_m; x.z += pz * mv.pull_m; }
          this._hit(e, x, specFor(x)); hits.push(x.id);
          if (mv.creates === 'clumped') x.clumpedT = k.clumped_s;
        }
        break;
      }
      case 'ring': {
        const list = opp.slice().sort((a, b) => dist(e, a) - dist(e, b)).slice(0, mv.max_targets || 6);
        for (const x of list) {
          if (len(x.x - this.ringC.x, x.z - this.ringC.z) > this.ringR + 1) continue;
          const kb = mv.flags?.includes('knock_off') && x.onHR ? { m: 1.5, source: 'banshee_screech' } : null;
          this._hit(e, x, { ...specFor(x), knockback: kb }); hits.push(x.id);
        }
        break;
      }
      case 'heal': {
        const allies = e.side === 'enemy' ? [e] : this.allies().filter(a => !a.routed);
        const cowedNear = this.opponentsOf(e).some(x => x.status?.kind === 'cowed' && dist(x, e) <= k.cowed_heal_radius_m);
        const area = e.side !== 'enemy' && allies.filter(a => dist(a, e) <= mv.heal_area_m && a.nerve < a.nerveMax).length >= 2;
        const targets = area ? allies.filter(a => dist(a, e) <= mv.heal_area_m) : [t && t.side !== 'enemy' ? t : e];
        for (const a of targets) {
          const amt = F.heal(area ? mv.heal_area_mv : mv.heal_mv, e.level, e.stats.voice, cowedNear, k, mv.heal_cowed_mult);
          this._healCat(a, amt, e); hits.push(a.id);
        }
        break;
      }
    }
    return hits;
  }

  _healCat(a, amt, by) {
    const cap = (a.side === 'enemy' ? this.k.enemy_heal_cap : this.k.heal_cap) * a.nerveMax;
    const room = Math.max(0, Math.min(cap - a.healed, a.nerveMax - a.nerve));
    const h = Math.round(Math.min(room, amt));
    a.nerve += h; a.healed += h;
    this._emit({ type: 'Healed', cat: a.id, by: by.id, amount: h, capped: h < Math.round(amt) });
  }

  _hasState(x, s) {
    switch (s) {
      case 'splat': return x.splatT > 0;
      case 'soggy': return x.status?.kind === 'soggy';
      case 'cowed': return x.status?.kind === 'cowed';
      case 'ruffled': return x.ruffledT > 0;
      case 'frazzled': return x.frazzledT > 0;
      case 'clumped': return x.clumpedT > 0;
      default: return false;
    }
  }

  /* ------------------------------------------------------------ hits (F1, F2, F3, poise, states) */

  _invuln(t) {
    const a = t.act;
    if (!t.present || t.routed) return true;
    if (this.pile && this.pile.cats.includes(t.id)) return true;
    if (!a) return false;
    if (a.kind === 'skitter' && a.t <= this.k.skitter_iframe_s + 1e-9) return true;
    return a.kind === 'tagin' || a.kind === 'break' || a.kind === 'enter' || a.kind === 'leap';
  }

  _armoured(t) { return t.act?.kind === 'windup'; }

  _victimKind(t) { return t.side === 'enemy' ? 'enemy' : t.id === this.controlledId ? 'controlled' : 'ai_cat'; }

  /**
   * Land one hit. spec: {mv, fz, flatFz, type, kind, moveId, authored, knockback, creates, status, cls, noPaw, splatExtend}
   */
  _hit(att, tgt, spec) {
    const k = this.k;
    const authored = spec.authored || (att.side === 'enemy' ? 'enemy' : 'ai');
    if (this._invuln(tgt)) {
      let perfect = false;
      if (tgt.act?.kind === 'skitter' && tgt.act.t <= k.perfect_skitter_s + 1e-9) {
        perfect = true;
        if (tgt.pers?.perk === 'perfect_skitter') this._grantPaw(tgt, k.fraidy_perfect_grant);
      }
      this._emitFeel({ type: 'Whiff', attacker: att.id, target: tgt.id, perfect_skitter: perfect }, { tier: 0, authored, victim: this._victimKind(tgt), kind: 'whiff' }, null, null);
      return null;
    }
    const type = spec.type === 'style' || !spec.type ? att.styleRow.type : spec.type;
    // Guard (G).
    const guard = [];
    let blocked = false;
    if (tgt.bracing && spec.cls !== 'red') {
      const [dx, dz] = norm(att.x - tgt.x, att.z - tgt.z);
      if (dx * tgt.fx + dz * tgt.fz >= Math.cos(Math.PI * k.brace_arc_deg / 360) - 1e-9) { guard.push(k.brace_mult); blocked = true; }
    }
    if (tgt.puffT > 0) guard.push(0.7);
    if (tgt.side !== 'enemy') {
      const st = this.allies().find(a => a !== tgt && !a.routed && a.pers?.perk === 'guard_allies' && dist(a, tgt) <= k.stalwart_guard_m);
      if (st) guard.push(k.stalwart_guard_mult);
    }
    // Amplifier (A).
    const statusMult = this._dmgStatusMult(att);
    const perk = att.pers?.perk === 'frazzled_dmg' && tgt.frazzledT > 0 ? k.schemer_frazzled_dmg : 1;
    let ambush = 1;
    if (this.ambushPending && att.id === this.controlledId && att.side === 'posse') { ambush = k.ambush_dmg; this.ambushPending = false; this._ruffle(tgt, att); }
    const rank = att.rankRow.dmg_mult * (att.side === 'enemy' ? this.diff.enemy_dmg : 1);
    const off = type === 'yowl' ? att.stats.voice : att.stats.bite;
    const r = F.damage({ mv: spec.mv, La: att.level, off, Ld: tgt.level, hide: tgt.stats.hide, type: F.typeMult(type, tgt.styleRow, k),
      status: statusMult, perk, ambush, rank, frazzled: tgt.frazzledT > 0, guard }, k);
    let dmg = r.dmg;
    // Boss phase clamp (DR-32).
    if (tgt.boss) dmg = this._phaseClamp(tgt, dmg);
    tgt.nerve = Math.max(0, tgt.nerve - dmg);
    tgt.lastHitT = this.simT;
    if (tgt.side !== 'enemy') this._noteAttack(att, tgt);

    // Frazzle (F2).
    let frazzling = false, fzGain = 0;
    if (tgt.side === 'enemy' && tgt.frazzledT <= 0 && !this._invuln(tgt)) {
      let flat = spec.flatFz || 0;
      if (att.pers?.perk === 'first_hit_leader_fz' && tgt.rankRow.leader && !att.firstLeaderHit) { flat += k.braggart_first_hit_fz; att.firstLeaderHit = true; }
      const oldScore = this._oldScore(att, tgt);
      fzGain = F.frazzleGain({ fz: spec.fz || 0, rRank: tgt.rankRow.fz_res, ruffled: tgt.ruffledT > 0, oldScore, weak: F.isWeak(type, tgt.styleRow) }, k) + flat;
      const boost = this.show.tutorial_frazzle_boost;
      if (this.def.tutorial && boost && this.fightT >= boost.after_s) fzGain *= boost.mult;
      frazzling = this._addFz(tgt, fzGain, att);
    }
    // Paws (F3).
    if (att.side !== 'enemy' && !spec.noPaw) {
      const per = spec.kind === 'string' ? k.paw_per_hit : (spec.kind === 'finisher' || spec.kind === 'pounce' || spec.kind === 'heavy') ? k.paw_per_finisher : 0;
      if (per) this._grantPaw(att, per * this._fill(att));
    }
    // Poise.
    if (tgt.side === 'enemy') this._poiseFlinch(tgt, spec.kind);
    else if (!blocked && !this._armoured(tgt) && tgt.act?.kind !== 'pileon') { tgt.flinchT = k.posse_flinch_s; if (tgt.act && tgt.act.kind !== 'move') tgt.act = null; }
    // States.
    if (spec.creates === 'ruffled') this._ruffle(tgt, att);
    if (spec.status) this._applyStatus(tgt, spec.status.kind, spec.status.s, spec.moveId);
    if (spec.splatExtend && tgt.splatT > 0) tgt.splatT += spec.splatExtend;
    let splat = false;
    if (spec.knockback) splat = this._knockback(att, tgt, spec.knockback);

    const tierKind = frazzling ? 'frazzling' : (splat && BASE_TIER[spec.kind] < 2 ? 'splat' : spec.kind);
    const ev = { type: 'Hit', attacker: att.id, target: tgt.id, kind: spec.kind, move: spec.moveId ?? null, attack: spec.attack ?? null, dmg, mv: spec.mv, fz: +fzGain.toFixed(3),
      hit_type: type, blocked, frazzled: tgt.frazzledT > 0, nerve: tgt.nerve, cls: spec.cls ?? null, authored };
    this._emitFeel(ev, { tier: BASE_TIER[tierKind] ?? 1, authored, victim: this._victimKind(tgt), kind: tierKind, hitType: type }, att, tgt, spec.noStop);
    // Special meter (Zoomies folded in): hits landed and Nerve lost (Combat F8 + M1.1 per-hit gains).
    const G = this.k.special_gain;
    if (att.side === 'posse' && tgt.side === 'enemy' && spec.kind !== 'special' && spec.kind !== 'pile_on_beat')
      gainSpecial(this, att, att.id === this.controlledId ? (spec.kind === 'string' ? G.light : spec.kind.startsWith('move') ? G.move : G.heavy) : (spec.kind.startsWith('move') ? G.move : G.crew_hit));
    if (tgt.side === 'posse' && dmg > 0) { const pct = Math.min(G.lost_cap - tgt.specialLost, 100 * dmg / tgt.nerveMax * G.per_pct_lost); if (pct > 0) { tgt.specialLost += pct; gainSpecial(this, tgt, pct); } }
    if (spec.launch && tgt.side === 'enemy' && !tgt.rankRow.leader && this.standing(tgt) && tgt.frazzledT <= 0) { this._removeTeleOf(tgt); this._releaseToken(tgt); tgt.act = { kind: 'launched', t: 0, dur: spec.launch }; }
    if (tgt.nerve <= 0 && !tgt.routed) {
      if (tgt.side !== 'enemy' && this.def.tutorial && this.posse().filter(p => this.standing(p)).length <= 1 && tgt.side === 'posse') tgt.nerve = 1; // tutorial fights cannot be lost
      else this._rout(tgt, att, spec.kind === 'pile_on' ? 'by_pile_on' : 'by_hit');
    }
    // Enemy-side: a landed hit stops a bolting Rival.
    if (tgt.act?.moveId === 'rival_bolt' && !tgt.row.flee_uninterruptible) { this._removeTeleOf(tgt); tgt.act = null; }
    return ev;
  }

  _fill(e) { const ai = this.show.ai_fill ?? this.k.ai_fill; return e.side === 'guest' ? Math.min(this.k.guest_ai_fill, ai) * (ai / this.k.ai_fill) : e.id === this.controlledId ? 1 : ai; }

  _dmgStatusMult(e) {
    const k = this.k;
    let m = 1;
    if (e.status?.kind === 'cowed') m *= k.cowed_dmg;
    if (e.status?.kind === 'fired_up') m *= k.fu_dmg;
    if (this._angerActive(e)) m *= k.fu_dmg;
    return m;
  }

  _angerActive(e) { return !!e.anger && e.anger.left > 0 && !e.status; }

  _oldScore(att, tgt) {
    const pairs = this.def.old_scores || [];
    if (!pairs.some(([a, b]) => (a === att.cat && b === tgt.cat))) return 1;
    return att.pers?.old_score ?? this.k.old_score;
  }

  _noteAttack(att, tgt) {
    for (const b of this.allies()) if (b.pers?.target === 'avenge' && b !== tgt) { b.ai.avengeId = att.id; b.ai.avengeT = this.k.ai_avenge_s; }
  }

  _addFz(tgt, amount, att) {
    const k = this.k;
    if (amount <= 0 || tgt.frazzledT > 0) return false;
    tgt.fzg += amount; tgt.lastFzGainT = this.simT;
    if (tgt.fzg >= k.frazzle_max - 1e-9) {
      tgt.fzg = k.frazzle_max; tgt.frazzledT = k.frazzled_s; tgt.frazzleTotal = k.frazzled_s;
      if (tgt.act && tgt.act.kind !== 'routed') { this._removeTeleOf(tgt); tgt.act = null; }
      this._releaseToken(tgt);
      const full = tgt.rankRow.leader || this.firstStagger; this.firstStagger = false;
      const slow = k.stagger_slow[full ? 'full' : 'light'];
      this.slowMo = { scale: slow.scale, left: slow.ms / 1000 };
      this._emit({ type: 'Staggered', cat: tgt.id, by: att?.id ?? null, window_s: k.frazzled_s, treatment: full ? 'full' : 'light', slow: { scale: slow.scale, ms: slow.ms } });
      for (const p of this.posse()) if (this.standing(p)) gainSpecial(this, p, k.special_gain.per_stagger);
      return true;
    }
    return false;
  }

  _grantPaw(e, pts) {
    if (!pts || e.side === 'enemy') return;
    const k = this.k, before = Math.floor(e.paws / k.paw_points);
    e.paws = Math.min(k.paw_cap, e.paws + pts);
    const after = Math.floor(e.paws / k.paw_points);
    if (after > before) this._emit({ type: 'PawFilled', cat: e.id, paws: after });
  }

  _poiseFlinch(t, kind) {
    const k = this.k;
    if (this._armoured(t) || t.frazzledT > 0 || t.splatT > 0) return;
    if (!t.rankRow.leader) {
      const stringHit = kind === 'string' || kind === 'finisher' || kind === 'heavy';
      if (stringHit && t.flinchImmuneT > 0) return;
      this._flinch(t, kind);
    } else if (kind === 'finisher' || kind === 'heavy' || kind === 'tag_in') {
      if (t.leaderFlinchCd > 0) return;
      t.leaderFlinchCd = k.leader_flinch_cd_s; this._flinch(t, kind);
    }
  }

  _flinch(t, why) {
    const k = this.k;
    t.flinchT = t.rankRow.leader ? k.leader_flinch_s : k.trash_flinch_s;
    t.flinchWhy = why;
    if (t.act && t.act.kind !== 'routed' && !(t.boss && (t.boss.state === 'falling'))) { this._removeTeleOf(t); t.act = null; this._releaseToken(t); }
  }

  _ruffle(t, by) {
    const k = this.k;
    if (t.side !== 'enemy') return;
    if (t.rankRow.leader && t.reruffleCd > 0 && !this.fedUp) { this._emit({ type: 'RuffleIgnored', cat: t.id, reason: 'wise_to_it' }); return; }
    const fresh = t.ruffledT <= 0;
    t.ruffledT = this.fedUp ? INF : k.ruffled_s;
    if (fresh) this._emit({ type: 'Ruffled', cat: t.id, by: by?.id ?? null, duration_s: this.fedUp ? null : k.ruffled_s });
  }

  _applyStatus(t, kind, s, src) {
    if (t.row.immune_status?.includes(kind)) { this._emit({ type: 'StatusImmune', cat: t.id, status: kind }); return; }
    if (t.anger && t.anger.left > 0 && !t.status) {
      if (this.k.anger_fu_pause_under_status) this._emit({ type: 'StatusPaused', cat: t.id, status: 'fired_up', source: 'anger', left_s: t.anger.left === INF ? null : +t.anger.left.toFixed(4) });
      else { t.anger.left = 0; this._emit({ type: 'StatusEnded', cat: t.id, status: 'fired_up', source: 'anger', reason: 'replaced' }); }
    }
    t.status = { kind, t: s, total: s, src };
    this._emit({ type: 'StatusApplied', cat: t.id, status: kind, source: src, duration_s: s });
  }

  _splat(t, by) {
    const k = this.k;
    if (t.boss) { this._ruffle(t, by); return false; }
    if (t.side !== 'enemy') { t.splatT = k.posse_splat_s; t.act = null; this._emit({ type: 'Splat', cat: t.id, by: by?.id ?? null }); return true; }
    t.splatT = k.splat_s; this._removeTeleOf(t); t.act = null; this._releaseToken(t);
    this._addFz(t, k.splat_fz, by);
    this._emit({ type: 'Splat', cat: t.id, by: by?.id ?? null, duration_s: k.splat_s });
    return true;
  }

  /** Knockback; Boss knock-offs; ledge falls; Splat on collision. Returns true if it Splatted. */
  _knockback(att, t, kb) {
    const k = this.k;
    const dir = kb.dir || norm(t.x - att.x, t.z - att.z);
    if (t.boss) {
      if (t.onHR && t.boss.state === 'wall' && t.frazzledT <= 0 && this.D.bosses[t.row.boss_kit].knockoff_sources.includes(kb.source)) { this._knockOff(t, att, dir); }
      return false;
    }
    if (t.onHR) { // pushed off a High Road edge: a Splat for a non-Boss (Combat §3.3, §3.10)
      const hr = this.hr(t.onHR); t.onHR = null; t.y = 0; t.x += hr.drop_side[0] * 0.9; t.z += hr.drop_side[1] * 0.9;
      return this._splat(t, att);
    }
    t.act = { kind: 'knockback', t: 0, dur: kb.m / k.knockback_speed_mps, vx: dir[0] * k.knockback_speed_mps, vz: dir[1] * k.knockback_speed_mps, splat: !!kb.splatOnCollision, by: att.id, bonusMv: kb.bonusMv || 0 };
    this._removeTeleOf(t); this._releaseToken(t);
    return false;
  }

  _knockOff(b, att, dir) {
    const k = this.k, hr = this.hr(b.onHR);
    const along = (hr.b[0] - hr.a[0]) * dir[0] + (hr.b[1] - hr.a[1]) * dir[1] >= 0 ? 1 : -1;
    const ax = norm(hr.b[0] - hr.a[0], hr.b[1] - hr.a[1]);
    const land = [b.x + ax[0] * 0.5 * along + hr.drop_side[0] * k.knockoff_land_m, b.z + ax[1] * 0.5 * along + hr.drop_side[1] * k.knockoff_land_m];
    this._removeTeleOf(b);
    b.onHR = null; b.boss.state = 'falling';
    b.act = { kind: 'fall', t: 0, dur: 0.5, from: [b.x, b.z, b.y], to: [land[0], land[1], 0], by: att.id };
    this._emitFeel({ type: 'KnockOff', cat: b.id, by: att.id, land: land.slice() }, { tier: BASE_TIER.splat, authored: att.id === this.controlledId ? 'player' : 'ai', victim: 'enemy', kind: 'splat' }, att, b);
  }

  _landBoss(b, a) {
    const k = this.k, by = this.byId.get(a.by);
    b.x = a.to[0]; b.z = a.to[1]; b.y = 0; b.act = null;
    b.boss.state = 'ground'; b.boss.groundT = k.boss_ground_s;
    this._ruffle(b, by);
    this._addFz(b, k.knockoff_fz, by);
    this._flinch(b, 'knock_off');
    const tub = this.props.find(p => p.kind === 'water_bucket' && p.usesLeft > 0 && len(p.x - b.x, p.z - b.z) <= p.radius + k.bucket_catch_m);
    if (tub) { this._addFz(b, k.bucket_fz, by); const hr = this.hrs.find(h => h.boss_wall) || this.hrs[0]; this._triggerProp(tub, by, b, hr ? hr.drop_side : null); }
    this._emit({ type: 'BossLanded', cat: b.id, in_bucket: !!tub });
  }

  _rout(t, by, how) {
    if (t.routed) return;
    t.routed = true; t.nerve = 0; this._removeTeleOf(t); this._releaseToken(t); t.orders = []; t.reserved = 0;
    t.status = null; t.anger = t.anger ? { ...t.anger, left: 0 } : null; t.frazzledT = 0; t.splatT = 0; t.bracing = false;
    if (t.side === 'enemy') { const [dx, dz] = norm(t.x - this.ringC.x, t.z - this.ringC.z); t.act = { kind: 'routed', t: 0, dur: 1.2, vx: (dx || 1) * 6, vz: dz * 6 }; t.onHR = null; t.y = 0; }
    else t.act = { kind: 'routed', t: 0, dur: INF };
    const kind = t.side !== 'enemy' ? 'string' : t.rankRow.leader ? 'leader_rout' : 'tough_rout';
    const authored = by && by.id === this.controlledId ? 'player' : how === 'by_pile_on' || how === 'by_back_down' ? 'player' : by?.side === 'enemy' ? 'enemy' : 'ai';
    this._emitFeel({ type: 'CatRouted', cat: t.id, by: by?.id ?? null, how, side: t.side }, { tier: t.side === 'enemy' ? BASE_TIER[kind] : 0, authored, victim: this._victimKind(t), kind }, null, null);
    // M1.1: control never passes to another cat; with Mikan Routed the crew fight on (skill bar still open to the player).
    if (t.side === 'guest') this._emit({ type: 'GuestLeft', cat: t.id, reason: 'routed' });
  }

  /* ------------------------------------------------------------ props and Fears (Combat §3.9) */

  /** The splash cone: from the prop, away from whatever set it off (Combat §3.9: '3 m cone'). */
  splashShape(p, dir) { return { type: 'cone', origin: [p.x, p.z], dir, range: p.splash_cone.range_m, angle_deg: p.splash_cone.angle_deg }; }

  _triggerProp(p, by, caught, dirIn) {
    const k = this.k;
    if (p.usesLeft <= 0) { this._emit({ type: 'PropHit', prop: p.id, by: by?.id ?? null, empty: true }); return; }
    p.usesLeft--;
    const goof = by?.pers?.perk === 'prop_mult' ? k.goofball_prop_mult : 1;
    let dir = dirIn || (by ? norm(p.x - by.x, p.z - by.z) : [0, 1]);
    if (!dir[0] && !dir[1]) dir = [0, 1];
    const shape = this.splashShape(p, dir);
    this._emitFeel({ type: 'PropTriggered', prop: p.id, kind: p.kind, by: by?.id ?? null, goofball: goof > 1, splash: shape }, { tier: 0, authored: by?.id === this.controlledId ? 'player' : 'ai', victim: 'enemy', kind: 'prop_hit' }, null, null);
    for (const x of this.entities) {
      if (!this.standing(x) || x.y > 0.5) continue;
      const d = len(x.x - p.x, x.z - p.z);
      const wet = x === caught || d <= p.radius + x.radius || inShape(shape, x, x.radius);
      if (wet) this._applyStatus(x, 'soggy', k.status_s.soggy, p.id);
      if (x.row.fears?.includes(p.fear)) {
        if (wet) this._fear(x, p.fear, p, goof);
        else if (d <= p.splash_cone.range_m + x.radius) this._emit({ type: 'FearTriggered', cat: x.id, fear: p.fear, source: 'tell' });
      }
    }
  }

  _fear(x, fear, p, goof = 1) {
    const k = this.k;
    const n = x.fearCount[fear] = (x.fearCount[fear] || 0) + 1;
    if (n >= 3) { this._emit({ type: 'FearTriggered', cat: x.id, fear, source: p.id, effect: 'none' }); return; }
    if (x.side === 'enemy') {
      if (n === 1) this._ruffle(x, null);
      this._addFz(x, (k.fear_chunk[x.rank] ?? 30) * (n === 1 ? 1 : 0.5) * goof, null);
      if (x.act && x.act.cls !== 'red' && x.act.kind !== 'fall') { this._removeTeleOf(x); if (x.act.kind === 'windup') x.act = null; }
    }
    this._emitFeel({ type: 'FearTriggered', cat: x.id, fear, source: p.id, effect: n === 1 ? 'full' : 'half' }, { tier: BASE_TIER.fear, authored: 'ai', victim: this._victimKind(x), kind: 'fear' }, null, x);
  }

  /* ------------------------------------------------------------ telegraphs (enemy windups) */

  _enemyWindup(e, moveId, t) {
    const k = this.k, mv = this.D.moves[moveId];
    const cls = mv.telegraph || (mv.cost >= 2 ? 'red' : 'yellow');
    let dur = cls === 'white' ? (e.rankRow.leader ? k.telegraph_s.white_leader : k.telegraph_s.white_tough)
      : cls === 'yellow' ? (moveId === 'rival_bolt' ? k.rival_bolt_s : k.telegraph_s.yellow)
      : (e.boss ? k.telegraph_s.red_boss : k.telegraph_s.red);
    // >= 300 ms between two hits landing on the same cat (Combat §3.12).
    if (t && t.side !== 'enemy') {
      for (const o of this.teles) if (o.aimedAt === t.id) { const end = o.t0 + o.dur; const mine = this.simT + dur; if (Math.abs(mine - end) < k.token_min_gap_s) dur = end - this.simT + k.token_min_gap_s; }
    }
    const shape = this._shapeFor(e, mv, t);
    const tl = { id: ++this.teleSeq, attackerId: e.id, cls, moveId, shape: { ...shape, cls }, aimedAt: t ? t.id : null, t0: this.simT, dur };
    this.teles.push(tl);
    e.act = { kind: 'windup', moveId, t: 0, dur, teleId: tl.id, targetId: t?.id ?? null, cls };
    this._emit({ type: 'TelegraphStart', id: tl.id, attacker: e.id, cls, move: moveId, aimed_at: tl.aimedAt, shape: tl.shape, windup_s: dur });
  }

  _shapeFor(e, mv, t) {
    const o = [e.x, e.z];
    const dir = t ? norm(t.x - e.x, t.z - e.z) : [e.fx, e.fz];
    switch (mv.shape) {
      case 'cone': return { type: 'cone', origin: o, dir, range: mv.range, angle_deg: mv.angle_deg };
      case 'single': return { type: 'cone', origin: o, dir, range: mv.range + 0.4, angle_deg: 70 };
      case 'charge': return { type: 'line', origin: o, dir, length: mv.range + 0.6, width: 1.2 };
      case 'circle': return { type: 'circle', center: t ? [t.x, t.z] : o, radius: mv.radius };
      case 'radius': return { type: 'circle', center: t ? [t.x, t.z] : o, radius: mv.radius };
      case 'ring': return { type: 'circle', center: [this.ringC.x, this.ringC.z], radius: this.ringR };
      case 'heal': case 'self': default: return { type: 'self', origin: o };
    }
  }

  _removeTele(id, reason) {
    const i = this.teles.findIndex(t => t.id === id);
    if (i >= 0) { this.teles.splice(i, 1); this._emit({ type: 'TelegraphEnd', id, reason }); }
  }
  _removeTeleOf(e) { if (e.act?.teleId) this._removeTele(e.act.teleId, 'cancelled'); }
  _releaseToken(e) { if (e.ai) e.ai.tokenOn = null; }

  _resolveWindup(e) {
    const a = e.act, mv = this.D.moves[a.moveId], tl = this.teles.find(x => x.id === a.teleId);
    const t = this.byId.get(a.targetId);
    this._removeTele(a.teleId, 'resolved');
    e.act = null;
    if (a.moveId === 'rival_bolt') { this._end('rival_fled', { rival: e.id }); return; }
    if (a.moveId === 'climb_back') { this._bossClimb(e); return; }
    if (a.moveId === 'belly_drop') { this._bellyDrop(e, tl.shape); return; }
    const shape = tl?.shape;
    if (mv.role === 'enemy') {
      const kindTier = a.cls === 'red' ? 'enemy_red' : a.cls === 'yellow' ? 'enemy_yellow' : 'enemy_white';
      const targets = this.opponentsOf(e).filter(x => this._sameLevel(e, x) && inShape(shape, x, x.radius));
      targets.sort((p, q) => dist(e, p) - dist(e, q));
      const hitList = mv.shape === 'cone' && a.cls === 'white' ? targets.slice(0, 1) : targets;
      if (!hitList.length) this._emitFeel({ type: 'Whiff', attacker: e.id, target: a.targetId }, { tier: 0, authored: 'enemy', victim: 'enemy', kind: 'whiff' }, null, null);
      for (const x of hitList) this._hit(e, x, { mv: mv.mv, fz: 0, type: mv.type, kind: kindTier, moveId: mv.Name, authored: 'enemy', cls: a.cls });
    } else {
      if (mv.cost > 0) e.enemyPaws = Math.max(0, e.enemyPaws - mv.cost * this.k.paw_points);
      const hits = this._applyMove(e, mv, t, 'enemy', shape);
      this._emit({ type: 'MoveUsed', user: e.id, move: mv.Name, targets_hit: hits, authored: 'enemy' });
    }
    this._releaseToken(e);
    e.act = { kind: 'recover', t: 0, dur: this.k.enemy_recover_s };
  }

  _bellyDrop(b, shape) {
    b.x = shape.center[0]; b.z = shape.center[1] - 0.01; b.y = 0; b.onHR = null; b.boss.state = 'drop';
    const targets = this.opponentsOf(b).filter(x => x.y < 0.5 && inShape(shape, x, x.radius));
    if (!targets.length) this._emitFeel({ type: 'Whiff', attacker: b.id, target: null }, { tier: 0, authored: 'enemy', victim: 'enemy', kind: 'whiff' }, null, null);
    for (const x of targets) this._hit(b, x, { mv: this.D.moves.belly_drop.mv, fz: 0, type: 'thump', kind: 'enemy_red', moveId: 'belly_drop', authored: 'enemy', cls: 'red' });
    b.act = { kind: 'drop_recover', t: 0, dur: this.D.moves.belly_drop.recover_s };
  }

  _bossClimb(b) {
    const hr = this.hrs.find(h => h.boss_wall) || this.hrs[0];
    const p = closestOnSeg(hr.a, hr.b, b);
    b.act = { kind: 'climb', t: 0, dur: 0.5, from: [b.x, b.z, b.y], to: [p.x, p.z, hr.y], hr: hr.id };
    this._emit({ type: 'ClimbBack', cat: b.id });
  }

  _telegraphs() {
    for (const tl of this.teles.slice()) if (!this.byId.get(tl.attackerId) || this.byId.get(tl.attackerId).act?.teleId !== tl.id) this._removeTele(tl.id, 'orphan');
  }

  /* ------------------------------------------------------------ boss phases (DR-32) */

  _phaseClamp(b, dmg) {
    const k = this.k, phases = this.D.bosses[b.row.boss_kit].phases;
    const ph = phases[b.boss.phase - 1];
    const floor = Math.ceil(b.nerveMax * ph.nerve_to);
    if (ph.nerve_to <= 0) return dmg;
    if (b.nerve - dmg < floor) {
      const over = floor - (b.nerve - dmg);
      if (b.frazzledT > 0) b.boss.carry = Math.min(k.phase_overflow_cap * b.nerveMax, b.boss.carry + over);
      b.boss.pendingBreak = true;
      return Math.max(0, b.nerve - floor);
    }
    return dmg;
  }

  _bossBreakCheck() {
    for (const b of this.enemies()) {
      if (!b.boss || !b.boss.pendingBreak || b.routed) continue;
      if (b.frazzledT > 0 || this.chain?.target === b.id) continue;
      this._phaseBreak(b);
    }
  }

  _phaseBreak(b) {
    const k = this.k;
    b.boss.pendingBreak = false;
    this._removeTeleOf(b);
    b.act = { kind: 'break', t: 0, dur: k.phase_break_s };
    for (const p of this.posse()) if (this.standing(p)) this._grantPaw(p, k.phase_break_grant);
    const capped = b.boss.phase >= this.phaseCap;
    this._emitFeel({ type: 'PhaseBreak', cat: b.id, phase: b.boss.phase, capped, carry: Math.round(b.boss.carry) }, { tier: BASE_TIER.phase_break, authored: 'player', victim: 'enemy', kind: 'phase_break', authoredT5: true }, null, null);
    b.boss.breakCapped = capped;
  }

  _afterBreak(b) {
    if (b.boss.breakCapped) { // showcase: he leaps back to the Den (rival_fled)
      this._emit({ type: 'BossFlee', cat: b.id, to: 'den' });
      b.gone = true; this._end('rival_fled', { rival: b.id, reason: 'phase_break' });
      return;
    }
    b.boss.phase++;
    b.nerve = Math.max(1, b.nerve - Math.round(b.boss.carry)); b.boss.carry = 0;
    const ph = this.D.bosses[b.row.boss_kit].phases[b.boss.phase - 1];
    if (ph.bucket_refill) for (const p of this.props) if (p.refill_each_phase) p.usesLeft = p.uses;
    this._emit({ type: 'PhaseStarted', cat: b.id, phase: b.boss.phase });
  }

  /* ------------------------------------------------------------ per-tick systems */

  _timers(dt) {
    const k = this.k;
    for (const e of this.entities) {
      if (e.gone) continue;
      const d = dt; // timers stop in global hit-stop and run at 5% in Slow Blink (rule 6); local hit-stop freezes only the action
      e.hissCd = Math.max(0, e.hissCd - d);
      for (const m in e.moveCd) e.moveCd[m] = Math.max(0, e.moveCd[m] - d);
      e.flinchT = Math.max(0, e.flinchT - d);
      if (e.flinchT === 0 && e.flinchWhy) { if (e.flinchWhy === 'string' || e.flinchWhy === 'finisher') e.flinchImmuneT = k.trash_flinch_immune_s; e.flinchWhy = null; }
      e.flinchImmuneT = Math.max(0, e.flinchImmuneT - d);
      e.leaderFlinchCd = Math.max(0, e.leaderFlinchCd - d);
      e.clumpedT = Math.max(0, e.clumpedT - d);
      e.puffT = Math.max(0, e.puffT - d);
      if (e.splatT > 0) { e.splatT = Math.max(0, e.splatT - d); }
      if (e.ruffledT > 0 && e.ruffledT !== INF) { e.ruffledT -= d; if (e.ruffledT <= 0) { e.ruffledT = 0; if (e.rankRow.leader) e.reruffleCd = k.leader_reruffle_cd_s; this._emit({ type: 'RuffledEnded', cat: e.id }); } }
      else if (e.reruffleCd > 0) e.reruffleCd = Math.max(0, e.reruffleCd - d);
      // Statuses: the newest one ticks; anger's Fired Up ticks only when no newer status is on (F11).
      if (e.status) { e.status.t -= d; if (e.status.t <= 0) { const s = e.status; e.status = null; this._emit({ type: 'StatusEnded', cat: e.id, status: s.kind, source: s.src });
        if (e.anger && e.anger.left > 0) this._emit({ type: 'StatusResumed', cat: e.id, status: 'fired_up', source: 'anger', left_s: e.anger.left === INF ? null : +e.anger.left.toFixed(4) }); } }
      else if (e.anger && e.anger.left > 0 && !e.routed) {
        e.angerBuffedS += d;
        if (e.anger.left !== INF) { e.anger.left -= d; if (e.anger.left <= 1e-9) { e.anger.left = 0; this._emit({ type: 'StatusEnded', cat: e.id, status: 'fired_up', source: 'anger' }); } }
      }
      // Frazzle window and decay.
      if (e.side === 'enemy' && !e.routed) {
        if (e.frazzledT > 0) { e.frazzledT -= d; if (e.frazzledT <= 1e-9) { e.frazzledT = 0; e.fzg = 0; this._emit({ type: 'StaggerEnded', cat: e.id, reason: 'window' }); } }
        else if (e.fzg > 0 && this.simT - e.lastFzGainT >= e.rankRow.fz_decay_after_s) e.fzg = Math.max(0, e.fzg - e.rankRow.fz_decay * d);
        const ps = k.enemy_paw_s[e.rank] / this.diff.enemy_paw;
        e.enemyPaws = Math.min(k.paw_cap, e.enemyPaws + k.paw_points / ps * d);
      }
      // Passive Paw fill (F3): 0 while perched; AI at ai_fill.
      if (e.side !== 'enemy' && this.standing(e) && !e.onHR && this.mode === 'fight') this._grantPaw(e, k.paw_passive * this._fill(e) * d);
    }
  }

  _think() {
    for (const e of this.entities) {
      if (!this.standing(e) || e.edt <= 0) continue;
      if (e.side === 'enemy') { if (e.boss) bossThink(this, e); else enemyThink(this, e); }
      else if (e.id !== this.controlledId && !e.orders.length) posseThink(this, e);
    }
  }

  /** Advance every action and resolve impacts. */
  _acts() {
    const k = this.k;
    for (const [id, st] of this.orderState) if ((st === 'started' || st === 'committed') && !this.entities.some(e => e.act?.kind === 'move' && e.act.orderId === id)) this.orderState.set(id, st === 'committed' ? 'done' : 'dropped');
    for (const e of this.entities) {
      const a = e.act; if (!a || e.gone) continue;
      const rate = e.status?.kind === 'soggy' ? k.soggy_mult : 1;
      const d = e.edt * (a.kind === 'routed' || a.kind === 'pileon' || a.kind === 'piled' ? 1 : rate);
      if (a.kind === 'pileon' || a.kind === 'piled') continue;
      a.t += d;
      switch (a.kind) {
        case 'string': {
          const len_ = k.string_hit_len_s[a.idx], imp = k.string_impact_s[a.idx];
          const t = this.byId.get(a.targetId);
          if (!a.hit && t && this.standing(t) && dist(e, t) > e.radius + t.radius + 0.25) { const [dx, dz] = norm(t.x - e.x, t.z - e.z); const step = Math.min(k.string_lunge_m / imp * d, dist(e, t) - e.radius - t.radius - 0.2); if (step > 0) { e.x += dx * step; e.z += dz * step; } }
          if (!a.hit && a.t >= imp - 1e-9) { a.hit = true; this._stringImpact(e, a); }
          if (a.t >= len_ - 1e-9) {
            if (a.queued && a.idx < 2 && this.standing(e)) { const tgt = this._meleeTarget(e); if (tgt) this._face(e, tgt); e.act = { kind: 'string', idx: a.idx + 1, t: 0, hit: false, queued: a.auto, auto: a.auto, authored: a.authored, targetId: tgt?.id ?? a.targetId }; }
            else { e.act = null; if (a.auto) e.ai.strings++; }
          }
          break;
        }
        case 'atk': atkTick(this, e, a, d); break;
        case 'dash': dashTick(this, e, a, d); break;
        case 'charge': break;
        case 'launched': e.y = 1.2 * 4 * Math.min(1, a.t / a.dur) * (1 - Math.min(1, a.t / a.dur)); if (a.t >= a.dur - 1e-9) { e.act = null; e.y = 0; } break;
        case 'sidestep': e.x += a.vx * d; e.z += a.vz * d; if (a.t >= a.dur - 1e-9) e.act = null; break;
        case 'move': if (!a.committed && a.t >= a.windup - 1e-9) this._commitMove(e); if (e.act === a && a.t >= a.dur - 1e-9) { e.act = null; if (a.orderId) this.orderState.set(a.orderId, 'done'); } break;
        case 'windup': if (a.t >= a.dur - 1e-9) this._resolveWindup(e); break;
        case 'skitter': case 'enter': case 'knockback': case 'routed': {
          if (e.onHR && a.kind === 'skitter') { const hr = this.hr(e.onHR), ax = norm(hr.b[0] - hr.a[0], hr.b[1] - hr.a[1]); const al = a.vx * ax[0] + a.vz * ax[1]; e.x += ax[0] * al * d; e.z += ax[1] * al * d; const p = closestOnSeg(hr.a, hr.b, e); e.x = p.x; e.z = p.z; }
          else { e.x += a.vx * d; e.z += a.vz * d; }
          if (a.kind === 'knockback') this._knockCollide(e, a);
          if (a.t >= a.dur - 1e-9) { if (a.kind === 'routed' && e.side === 'enemy') { e.gone = true; } if (e.act === a) e.act = a.kind === 'routed' ? (e.side === 'enemy' ? null : a) : null; }
          break;
        }
        case 'mantle': case 'drop': case 'leap': case 'tagin': case 'pounce': case 'fall': case 'climb': {
          const u = Math.min(1, a.t / a.dur);
          e.x = a.from[0] + (a.to[0] - a.from[0]) * u; e.z = a.from[1] + (a.to[1] - a.from[1]) * u;
          e.y = a.from[2] + (a.to[2] - a.from[2]) * u + (a.kind === 'pounce' || a.kind === 'tagin' || a.kind === 'leap' ? 0.8 * 4 * u * (1 - u) : 0);
          if (u >= 1) {
            e.act = null;
            if (a.kind === 'mantle') { e.onHR = a.hr; e.mantleAt = this.simT; e.hrSince = this.simT; }
            if (a.kind === 'climb') { e.onHR = a.hr; e.boss.state = 'wall'; e.boss.swingCd = Math.max(e.boss.swingCd, 1.5); }
            if (a.kind === 'fall') this._landBoss(e, a);
            if (a.kind === 'tagin') { const tg = this.byId.get(a.targetId); e.onHR = tg && tg.onHR ? tg.onHR : null; if (e.onHR) { e.mantleAt = this.simT; e.hrSince = this.simT; } e.act = null; this._tagStrike(e, a); }
            if (a.kind === 'pounce') this._pounceLand(e, a);
            if (a.kind === 'drop') e.y = 0;
          }
          break;
        }
        case 'hop': e.y = 0.6 * 4 * Math.min(1, a.t / a.dur) * (1 - Math.min(1, a.t / a.dur)); if (a.t >= a.dur - 1e-9) { e.act = null; e.y = 0; } break;
        case 'break': if (a.t >= a.dur - 1e-9) { e.act = null; this._afterBreak(e); } break;
        case 'drop_recover': if (a.t >= a.dur - 1e-9) { e.act = null; this._bossClimb(e); } break;
        default: if (a.dur != null && a.t >= a.dur - 1e-9) e.act = null;
      }
    }
  }

  _stringImpact(e, a) {
    const k = this.k, idx = a.idx, fin = idx === 2;
    const spec = { mv: k.string_mv[idx], fz: k.string_fz[idx], kind: fin ? 'finisher' : 'string', authored: a.authored || 'ai' };
    if (fin && e.style === 'Yowler') {
      let any = false;
      for (const x of this.opponentsOf(e)) if (this._sameLevel(e, x) && inCone(e, [e.fx, e.fz], k.yowl_cone.range_m, k.yowl_cone.angle_deg, x, x.radius)) { this._hit(e, x, spec); any = true; }
      if (!any) this._whiffOrProp(e, a);
      return;
    }
    const t = this._meleeTarget(e) || this.byId.get(a.targetId);
    if (t && this.standing(t) && this._sameLevel(e, t) && dist(e, t) <= k.string_reach_m + t.radius + 0.2) {
      this._face(e, t);
      const kb = fin && e.style === 'Bruiser' ? { m: k.shove_m, source: 'shove', dir: [e.fx, e.fz] } : null;
      this._hit(e, t, { ...spec, knockback: kb });
    } else this._whiffOrProp(e, a);
  }

  _whiffOrProp(e, a) {
    // A prop is hit only by a swing aimed at it: no target at the swing's start and the prop in front (Combat §3.9).
    const p = a.targetId == null && e.y < 0.5 ? this.props.find(p => inCone(e, [e.fx, e.fz], this.k.string_reach_m + p.radius, 90, p)) : null;
    if (p) this._triggerProp(p, e, null);
    else this._emitFeel({ type: 'Whiff', attacker: e.id, target: null }, { tier: 0, authored: a.authored || 'ai', victim: 'enemy', kind: 'whiff' }, null, null);
  }

  _pounceLand(e, a) {
    e.y = 0;
    const t = this.byId.get(a.targetId);
    const p = this.props.find(p => len(p.x - e.x, p.z - e.z) <= p.radius + 0.3);
    if (p) this._triggerProp(p, e, null, norm(a.to[0] - a.from[0], a.to[1] - a.from[1]));
    if (t && this.standing(t) && dist(e, t) <= t.radius + e.radius + 0.9) this._hit(e, t, { mv: a.mv, fz: a.fz, kind: 'pounce', authored: a.authored, noPaw: a.noPaw });
    else this._emitFeel({ type: 'Whiff', attacker: e.id, target: a.targetId }, { tier: 0, authored: a.authored, victim: 'enemy', kind: 'whiff' }, null, null);
  }

  _knockCollide(e, a) {
    if (a.collided) return;
    let hit = null;
    for (const o of this.entities) if (o !== e && o.side === e.side && this.standing(o) && o.id !== a.by && dist(o, e) < o.radius + e.radius) { hit = o; break; }
    const prop = this.props.find(p => len(p.x - e.x, p.z - e.z) < p.radius + e.radius);
    const wall = this.hrs.some(h => { const c = closestOnSeg(h.a, h.b, e); return len(e.x - c.x, e.z - c.z) < h.width / 2 + e.radius; });
    const out = len(e.x - this.ringC.x, e.z - this.ringC.z) > this.ringR;
    if (hit || prop || wall || out) {
      a.collided = true;
      if (prop) this._triggerProp(prop, this.byId.get(a.by), e, norm(a.vx, a.vz));
      if (prop && prop.kind === 'water_bucket') this._addFz(e, this.k.bucket_fz, this.byId.get(a.by));
      if (a.splat) { e.act = null; this._splat(e, this.byId.get(a.by));
        if (hit && a.bonusMv) { const by = this.byId.get(a.by); this._hit(by, hit, { mv: a.bonusMv, fz: 0, kind: 'move_mid', authored: 'ai' }); } }
    }
  }

  /** Locomotion for the controlled cat (move input) and AI goals, plus separation and the ring clamp. */
  _integrate() {
    const k = this.k;
    for (const e of this.entities) {
      e.vx = 0; e.vz = 0;
      if (!this.standing(e) || e.edt <= 0) continue;
      if (e.act && e.act.kind !== 'posture') continue;
      if (e.splatT > 0 || e.flinchT > 0 || e.frazzledT > 0 || e.bracing) continue;
      let vx = 0, vz = 0;
      const speed = k.move_speed_mps * (e.status?.kind === 'soggy' ? k.soggy_mult : 1) * (e.id === this.controlledId ? 1 : k.ai_speed_mult) * (e.boss ? 0.5 : 1);
      if (e.id === this.controlledId && !e.orders.length) { vx = (e.moveIntent?.[0] || 0) * speed; vz = (e.moveIntent?.[1] || 0) * speed; }
      else if (e.goal) {
        const dx = e.goal.x - e.x, dz = e.goal.z - e.z, l = len(dx, dz), stop = e.goal.stopAt ?? 0.05, sp = speed * (e.goal.speed ?? 1);
        if (l > stop) { const s = Math.min(sp, (l - stop) / e.edt); vx = dx / l * s; vz = dz / l * s; }
      }
      if (e.onHR) { // constrained to the High Road line
        const hr = this.hr(e.onHR), ax = norm(hr.b[0] - hr.a[0], hr.b[1] - hr.a[1]);
        const along = vx * ax[0] + vz * ax[1]; vx = ax[0] * along; vz = ax[1] * along;
      }
      e.x += vx * e.edt; e.z += vz * e.edt; e.vx = vx; e.vz = vz;
      if (vx || vz) { const [fx, fz] = norm(vx, vz); if (!(e.ai.faceLock && e.id !== this.controlledId)) { e.fx = fx; e.fz = fz; } }
      if (e.onHR) { const hr = this.hr(e.onHR), p = closestOnSeg(hr.a, hr.b, e); e.x = p.x; e.z = p.z; e.y = hr.y; }
      if (e.ai.faceId) { const f = this.byId.get(e.ai.faceId); if (f) this._face(e, f); }
    }
    // Separation (deterministic order).
    const list = this.entities.filter(e => this.standing(e) && !e.act?.kind?.match(/^(pileon|piled|tagin|leap|pounce|fall|climb|mantle)$/));
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      if (Math.abs(a.y - b.y) > 0.5) continue;
      const dx = b.x - a.x, dz = b.z - a.z, l = len(dx, dz), m = a.radius + b.radius;
      if (l < m && l > 1e-6) {
        const push = (m - l) / 2, nx = dx / l, nz = dz / l;
        if (!a.onHR) { a.x -= nx * push; a.z -= nz * push; }
        if (!b.onHR) { b.x += nx * push; b.z += nz * push; }
      }
    }
    // Ring clamp: enemies and AI cats stay in the ring; nobody passes a wall; the controlled cat may leave the circle (Scram).
    for (const e of this.entities) {
      if (!this.standing(e) || e.onHR || this._airborne(e)) continue;
      if (e.id !== this.controlledId) {
        const dx = e.x - this.ringC.x, dz = e.z - this.ringC.z, l = len(dx, dz), R = this.ringR;
        if (l > R) { e.x = this.ringC.x + dx / l * R; e.z = this.ringC.z + dz / l * R; }
      }
      this._clampHalfPlanes(e);
    }
  }

  _airborne(e) { return !!e.act && /^(mantle|drop|leap|tagin|pounce|fall|climb|hop)$/.test(e.act.kind); }

  _clampHalfPlanes(e) {
    for (const h of this.halfPlanes) {
      const d = (e.x - h.point[0]) * h.normal[0] + (e.z - h.point[1]) * h.normal[1];
      const hr = this.hr(h.wall), c = closestOnSeg(hr.a, hr.b, e);
      if (d < 0 && (c.t > 0 && c.t < 1)) { e.x -= h.normal[0] * d; e.z -= h.normal[1] * d; }
    }
  }

  /** The fight ring for the presentation: circle plus the walls' half-planes (keep walls and set dressing outside). */
  ringBounds() {
    return { center: [this.ringC.x, this.ringC.z], radius: this.ringR, scram_radius: this.ringR + this.k.scram_out_m,
      half_planes: this.halfPlanes.map(h => ({ point: h.point.slice(), normal: h.normal.slice(), wall: h.wall })), origin: this.arena.origin };
  }

  _fedUpCheck() {
    if (this.fedUp || this.enemies().some(e => e.boss) || this.fightT < this.k.fed_up_s) return;
    this.fedUp = true;
    for (const e of this.enemies()) if (this.standing(e)) { e.ruffledT = INF; }
    this._emit({ type: 'FedUp' });
  }

  _ensureLock() { /* M1.1: not locked by default; Tab (lockOn) locks */ }

  _endCheck(dt) {
    if (this.mode === 'ended' || this.mode === 'gloat') return;
    if (this.chain) return;
    const enemiesLeft = this.enemies().some(e => !e.routed && !e.gone);
    if (!enemiesLeft) { this._end('win'); return; }
    if (this.posse().every(p => p.routed) && !this.def.tutorial) {
      this.mode = 'gloat'; this.modeT = 0; this.skillBar = false;
      this.victorIds = this.enemies().filter(e => this.standing(e)).map(e => e.id);
      for (const t of this.teles.slice()) this._removeTele(t.id, 'gloat');
      this._emit({ type: 'Gloat', victors: this.victorIds, duration_s: this.k.gloat_s });
      const g = this.guestE(); if (g && g.present && !g.gone) { g.gone = true; this._emit({ type: 'GuestLeft', cat: g.id, reason: 'gloat' }); }
      return;
    }
    // Scram: the controlled cat held > 2 m outside the ring for 3 s.
    const c = this.controlled;
    if (c && this.standing(c) && len(c.x - this.ringC.x, c.z - this.ringC.z) > this.ringR + this.k.scram_out_m) { this.scramT += dt; if (this.scramT >= this.k.scram_hold_s) this._end('player_fled', { by: 'ring' }); }
    else this.scramT = 0;
  }

  _end(outcome, extra = {}) {
    if (this.mode === 'ended') return;
    const k = this.k;
    if (outcome === 'win') {
      for (const p of this.posse()) {
        if (p.routed && p.cat === 'mikan') { p.routed = false; p.act = null; p.nerve = Math.round(p.nerveMax * k.mikan_getup); }
        else if (!p.routed) p.nerve = Math.min(p.nerveMax, p.nerve + Math.round((p.nerveMax - p.nerve) * k.lick_wounds));
      }
    }
    this.skillBar = false; this.chain = null;
    for (const t of this.teles.slice()) this._removeTele(t.id, 'ended');
    const g = this.guestE(); if (g && g.present && !g.gone) { g.gone = true; this._emit({ type: 'GuestLeft', cat: g.id, reason: 'encounter_ended' }); }
    this.outcome = outcome;
    this._emit({ type: 'EncounterEnded', encounter_id: this.def.Name, outcome, victor_ids: outcome === 'loss' ? this.victorIds : [],
      boss_ids: this.enemies().filter(e => e.boss).map(e => e.id), fight_s: +this.fightT.toFixed(4), real_s: +this.realT.toFixed(4), ...extra });
    this.mode = 'ended';
  }

  /* ------------------------------------------------------------ read-only views */

  snapshot() {
    const k = this.k;
    const ent = e => ({
      id: e.id, cat: e.cat, name: e.name, side: e.side, slot: e.slot, rank: e.rank, style: e.style, personality: e.pers?.Name ?? null,
      pos: [e.x, e.y, e.z], facing: [e.fx, e.fz], present: e.present && !e.gone, routed: e.routed,
      anim: this._anim(e), anim_t: e.act?.t ?? 0, string_idx: e.act?.kind === 'string' ? e.act.idx : null,
      controlled: e.id === this.controlledId, invulnerable: this._invuln(e), bracing: e.bracing, on_high_road: e.onHR,
      nerve: e.nerve, nerve_max: e.nerveMax, paws: e.side === 'enemy' ? null : +(e.paws / k.paw_points).toFixed(4), paw_points: e.side === 'enemy' ? null : e.paws,
      paws_reserved: e.reserved / k.paw_points, orders: e.orders.map(o => ({ move: o.move, target: o.target })),
      stagger: e.side === 'enemy' ? e.fzg : null, staggered_s: e.frazzledT, pips: e.frazzledT > 0 ? F.pips(e.frazzledT, k) : 0,
      can_move: canMoveFraction(this, e), intent: e.id === this.controlledId ? null : e.ai.intent, engaging: e.ai.engageOn,
      attack: e.act?.kind === 'atk' ? { id: e.act.id, t: e.act.t, charge: e.act.charge } : e.act?.kind === 'charge' ? { id: 'charging', t: e.act.t, charge: Math.min(1, e.act.t / this.D.strings.HC.charge_max_s) } : null,
      special: e.side === 'posse' ? e.special : null, special_ready: e.side === 'posse' ? e.special >= k.special.max - 1e-9 : null,
      ruffled_s: e.ruffledT === INF ? -1 : e.ruffledT, splat_s: e.splatT, clumped_s: e.clumpedT,
      status: e.status ? { kind: e.status.kind, left_s: e.status.t, source: e.status.src } : null,
      anger_fired_up: e.anger ? { active: this._angerActive(e), left_s: e.anger.left === INF ? -1 : e.anger.left, stage: e.angerStage } : null,
      hiss_cd_s: e.hissCd, moves: e.moves.slice(), target: e.side === 'enemy' ? e.ai.tokenOn : e.ai.targetId,
      boss: e.boss ? { phase: e.boss.phase, state: e.boss.state, ground_s: e.boss.groundT, pending_break: e.boss.pendingBreak } : null,
      guest: e.guest ? { state: e.guest.state, t: e.guest.t } : null,
    });
    return {
      tick: this.tick, t: this.realT, sim_t: this.simT, fight_t: this.fightT, time_scale: this.timeScale, mode: this.mode,
      skill_bar: this.skillBar, controlled: this.controlledId, lock: this.lockId, locked: !!this.lockId,
      arena: { id: this.def.arena, origin: this.arena.origin, ring_center: [this.ringC.x, this.ringC.z], ring_radius: this.ringR, high_roads: this.hrs, bounds: this.ringBounds() },
      props: this.props.map(p => ({ id: p.id, kind: p.kind, pos: [p.x, 0, p.z], uses_left: p.usesLeft })),
      entities: this.entities.map(ent),
      telegraphs: this.teles.map(t => ({ id: t.id, attacker: t.attackerId, cls: t.cls, move: t.moveId, aimed_at: t.aimedAt, shape: t.shape, t: this.simT - t.t0, dur: t.dur, fill: Math.min(1, (this.simT - t.t0) / t.dur) })),
      special_prompt: specialPrompt(this),
      special_chain: this.chain ? { target: this.chain.target, t: this.chain.t, total_s: this.chain.total, team_finisher: this.chain.team, shortened: this.chain.short,
        steps: this.chain.steps.map(x => ({ cat: x.cat, start_s: x.start, dur_s: x.dur, done: x.done })) } : null,
      chains_this_fight: this.chainCount, next_chain_shortened: this.chainCount > 0,
      stagger_slow: this.slowMo ? { scale: this.slowMo.scale, left_s: this.slowMo.left } : null,
      fed_up: this.fedUp, outcome: this.outcome,
    };
  }

  _anim(e) {
    if (e.gone) return 'gone';
    if (e.routed) return 'routed';
    if (!e.present) return e.guest?.state === 'yowl' ? 'yowl_offstage' : 'offstage';
    if (e.frazzledT > 0) return e.act?.kind === 'piled' ? 'piled' : 'frazzled';
    if (e.splatT > 0) return 'splat';
    if (e.flinchT > 0) return 'flinch';
    if (e.act) return e.act.kind === 'windup' ? `windup_${e.act.cls}` : e.act.kind === 'move' ? `move_${e.act.moveId}` : e.act.kind;
    if (e.bracing) return 'brace';
    return len(e.vx, e.vz) > 0.1 ? 'run' : 'idle';
  }

  /** Canonical state for hashing (no event log, no derived values). */
  state() {
    const ent = e => ({ id: e.id, x: e.x, y: e.y, z: e.z, fx: e.fx, fz: e.fz, n: e.nerve, p: e.paws, fzg: e.fzg, fr: e.frazzledT, ru: e.ruffledT === INF ? -1 : e.ruffledT,
      sp: e.splatT, st: e.status, an: e.anger ? { l: e.anger.left === INF ? -1 : e.anger.left } : null, act: e.act ? { k: e.act.kind, t: e.act.t, i: e.act.idx, m: e.act.moveId } : null,
      r: e.routed, g: e.gone, pr: e.present, hr: e.onHR, ep: e.enemyPaws, ai: { t: e.ai.targetId, cd: e.ai.cd, tok: e.ai.tokenOn, in: e.ai.intent, eo: e.ai.engageOn, ph: e.ai.phaseT }, spc: e.special, act2: e.act?.id ?? null, b: e.boss ? { s: e.boss.state, ph: e.boss.phase, gt: e.boss.groundT, sw: e.boss.swingCd } : null,
      rng: e.aiStream.draws });
    return { tick: this.tick, simT: this.simT, mode: this.mode, ctl: this.controlledId, lock: this.lockId, sb: this.skillBar, gs: this.globalStop, ch: this.chain ? [this.chain.target, this.chain.t] : null, cc: this.chainCount, sm: this.slowMo,
      ents: this.entities.map(ent), teles: this.teles.map(t => [t.id, t.attackerId, t.moveId, t.t0, t.dur]), props: this.props.map(p => p.usesLeft),
      out: this.outcome, arb: this.arbiter.state() };
  }

  hash() { return hashOf(this.state()); }
}

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Feel tiers (Combat §3.17) and the DR-50 safety arbiter as pure, deterministic event filtering.
// The arbiter's only inputs are the request and the real (wall-tick) time, so it can be unit-tested alone.

/** Base tier for a sim hit kind (Combat §3.17 'Events' row). */
export const BASE_TIER = {
  whiff: 0, prop_hit: 0, blocked: 0,
  string: 1, move_mid: 1,
  finisher: 2, heavy: 2, pounce: 2, tag_in: 2, splat: 2, special: 4,
  move1: 3, hiss_interrupt: 3, fear: 3,
  move2: 4, frazzling: 4, tough_rout: 4, back_down: 4,
  pile_on: 5, zoomies: 5, phase_break: 5, leader_rout: 5,
  enemy_white: 1, enemy_yellow: 3, enemy_red: 4,
};

/** Lettered onomatopoeia class by event (Combat §3.17 DR-49). */
export function wordClassFor(kind, hitType) {
  switch (kind) {
    case 'frazzling': return 'pop';
    case 'back_down': return 'hiss';
    case 'pile_on': return 'dust_cloud';
    case 'phase_break': return 'crash';
    case 'leader_rout': case 'tough_rout': return 'bolt';
    default: return hitType === 'thump' ? 'thud' : hitType === 'yowl' ? 'yowl' : 'scratch';
  }
}

export class Arbiter {
  /** @param {object} D indexed data; @param {object} options {reduceFlashes, reduceMotion (0..1 shake scale)} */
  constructor(D, options = {}) {
    this.tiers = D.tiers; this.s = D.safety;
    this.reduceFlashes = !!options.reduceFlashes;
    this.motion = options.motionScale ?? 1;
    this.globalLog = [];   // [t, ms] non-T5 global hit-stop grants
    this.flashLog = [];    // start times of full-screen flashes
    this.channel = null;   // {tier, start, end}
    this.word = null;      // {tier, end}
    this.stats = { requests: 0, downgradedFullscreen: 0, droppedHitstopMs: 0, droppedWords: 0, queued: 0 };
  }

  _prune(now) {
    this.globalLog = this.globalLog.filter(([t]) => now - t < 1 - 1e-9);
    this.flashLog = this.flashLog.filter(t => now - t < 5 - 1e-9);
  }

  /** Global hit-stop granted in the rolling second ending at `now` (ms, non-T5). */
  globalUsed(now) { this._prune(now); return this.globalLog.reduce((s, [, ms]) => s + ms, 0); }
  /** Full-screen flashes whose start lies in (now - window, now]. */
  flashesIn(now, windowS) { return this.flashLog.filter(t => t <= now + 1e-9 && now - t < windowS - 1e-9).length; }

  /**
   * Filter one feel request.
   * @param {object} r {tier, authored:'player'|'ai', victim:'enemy'|'controlled'|'ai_cat', kind, hitType, authoredT5}
   * @param {number} now real seconds
   * @returns feel descriptor for the presentation layer
   */
  filter(r, now) {
    this.stats.requests++;
    this._prune(now);
    const s = this.s;
    let tier = r.tier;
    const ai = r.authored === 'ai';
    const incoming = r.victim === 'controlled';
    const onAiCat = r.victim === 'ai_cat';
    if (ai && !incoming && !onAiCat) tier -= s.ai_tier_drop;
    if (onAiCat) tier -= s.hit_on_ai_tier_drop;
    tier = Math.max(0, Math.min(5, tier));
    const row = this.tiers[tier];
    const out = { tier, base_tier: r.tier, authored: r.authored, hitstop: { scope: 'none', ms: 0, dropped_ms: 0 },
      shake: null, impact: 'none', impact_frames: 0, delay_ms: 0, lines: row.lines, lines_ms: row.lines_ms,
      glyph: row.glyph, dust: row.dust, punch_in_pct: row.punch_in_pct, time_dip: row.time_dip, rumble: row.rumble,
      word: null, edge_pulse: null };

    // Hit-stop.
    let scope = row.hitstop_scope, ms = row.hitstop_ms;
    if (incoming) { scope = ms > 0 ? 'local' : 'none'; ms = Math.round(ms * s.incoming_hitstop_mult); }
    if (ai && scope === 'global') scope = 'local';
    if (onAiCat && scope === 'global') scope = 'local';
    if (scope === 'global') {
      const exempt = tier === 5 && (r.authoredT5 ?? row.authored);
      if (!exempt) {
        const left = Math.max(0, s.global_hitstop_ms_per_s - this.globalUsed(now));
        const grant = Math.min(ms, left);
        out.hitstop.dropped_ms = ms - grant; this.stats.droppedHitstopMs += ms - grant;
        ms = grant;
        if (grant > 0) this.globalLog.push([now, grant]);
        if (grant <= 0) scope = 'none';
      }
    }
    out.hitstop.scope = ms > 0 ? scope : 'none'; out.hitstop.ms = ms > 0 ? ms : 0;

    // Shake: none on hits on AI cats; T0/T1 rows have none.
    if (row.shake_peak_pct > 0 && !onAiCat && this.motion > 0) {
      out.shake = { peak_pct: row.shake_peak_pct * this.motion, steps: row.shake_steps, step_ms: s.shake_step_ms, decay: s.shake_decay };
    }

    // Impact frame / the one screen-wide channel.
    if (incoming) {
      out.impact = 'none'; out.edge_pulse = { ...s.edge_pulse };
    } else if (row.impact === 'fullscreen') {
      let full = !ai && !onAiCat;
      if (full && r.kind === 'tough_rout' && this.flashesIn(now, s.tough_rout_fullscreen_gap_s) > 0) full = false;
      let start = now;
      if (full && this.channel && now < this.channel.end) {
        if (tier < this.channel.tier) full = false;
        else if (tier === this.channel.tier) {
          start = Math.max(now, this.channel.start + s.screen_queue_ms / 1000);
          if (start > now) this.stats.queued++;
        }
      }
      if (full && !this.reduceFlashes) {
        const fs1 = this.flashesIn(start, 1), fs5 = this.flashesIn(start, 5);
        if (fs1 >= s.fullscreen_per_s || fs1 >= s.flashes_per_s || fs5 >= s.flashes_per_5s) full = false;
      }
      if (full) {
        out.impact = this.reduceFlashes ? 'line_hold' : 'fullscreen';
        out.impact_frames = row.impact_frames;
        out.delay_ms = Math.round((start - now) * 1000);
        if (!this.reduceFlashes) this.flashLog.push(start);
        this.channel = { tier, start, end: start + Math.max(row.lines_ms, 170) / 1000 };
      } else {
        out.impact = 'local_disc'; this.stats.downgradedFullscreen++;
        if (row.lines === 'full_field') out.lines = 'radial_40';
      }
    } else if (row.impact === 'local_disc') {
      out.impact = 'local_disc';
    }

    // Lettering: only player-authored T4/T5, one word on screen.
    if (tier >= s.lettering_min_tier && r.authored === 'player' && !incoming && !onAiCat) {
      if (this.word && now < this.word.end && this.word.tier >= tier) { this.stats.droppedWords++; }
      else { out.word = { cls: wordClassFor(r.kind, r.hitType), ms: row.word_ms }; this.word = { tier, end: now + row.word_ms / 1000 }; }
    }
    return out;
  }

  state() { return { g: this.globalLog, f: this.flashLog, c: this.channel, w: this.word }; }
}

/**
 * Combat §3.17 rule 3, for the camera: sum the stepped shake patterns active at time t and clamp.
 * @param {Array<{start:number, peak_pct:number, steps:number, step_ms:number, decay:number}>} patterns
 * @returns {number} signed displacement in % of viewport height
 */
export function sampleShake(patterns, t, clampPct = 1.8) {
  let sum = 0;
  for (const p of patterns) {
    const i = Math.floor((t - p.start) / (p.step_ms / 1000));
    if (i < 0 || i >= p.steps) continue;
    sum += p.peak_pct * Math.pow(p.decay, i) * (i % 2 === 0 ? 1 : -1);
  }
  return Math.max(-clampPct, Math.min(clampPct, sum));
}

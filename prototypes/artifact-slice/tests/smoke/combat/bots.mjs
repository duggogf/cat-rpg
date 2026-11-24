// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Input bots for the combat smoke runs (tools/sim-run.mjs), M1.1 controls: the player drives Mikan only
// (light, heavy, dodge, dash, Tab lock-on, R skill bar, F Special). A bot is (enc) -> InputFrame and reads only the
// public snapshot plus the string table, as a player reads the screen.

const d2 = (a, b) => Math.hypot(a.pos[0] - b.pos[0], a.pos[2] - b.pos[2]);
const toward = (a, b) => [b.pos[0] - a.pos[0], b.pos[2] - a.pos[2]];
const away = (a, b) => [a.pos[0] - b.pos[0], a.pos[2] - b.pos[2]];

/** Passive: no input at all. */
export const passiveBot = () => () => ({});

function dodgeIfNeeded(s, c, inp, every = 1, memo = new Map(), counter = { n: 0 }) {
  for (const tl of s.telegraphs) {
    const aimed = tl.aimed_at === c.id;
    const inRed = tl.cls === 'red' && tl.shape.type === 'circle' && Math.hypot(c.pos[0] - tl.shape.center[0], c.pos[2] - tl.shape.center[1]) < tl.shape.radius + 0.5;
    if (!(aimed || inRed) || tl.dur - tl.t > 0.25) continue;
    if (!memo.has(tl.id)) memo.set(tl.id, (counter.n++ % every) === 0);
    if (!memo.get(tl.id)) continue;
    const att = s.entities.find(e => e.id === tl.attacker);
    const from = tl.shape.type === 'circle' ? { pos: [tl.shape.center[0], 0, tl.shape.center[1]] } : att;
    if (from) return { ...inp, dodge: true, move: away(c, from) };
  }
  return null;
}

/** The next string press: light, or heavy after L3 (L-L-L-H finisher), timed into the buffer window. */
function stringPress(enc, c, inp, lock) {
  const a = c.attack;
  if (!a || a.id === 'charging') return { ...inp, move: toward(c, lock), light: true };
  const r = enc.D.strings[a.id];
  if (a.t < r.chain_s - 0.1) return inp; // a player waits for the window; mashing earlier is dropped anyway
  return a.id === 'L3' ? { ...inp, heavy: true } : { ...inp, move: toward(c, lock), light: true };
}

/** Would a Shoulder Check from `from` Splat `t`? (A wall, prop, other enemy or the ring edge within 3.6 m behind it.) */
function obstacleBehind(s, from, t, m = 3.6) {
  let dx = t.pos[0] - from.pos[0], dz = t.pos[2] - from.pos[2]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
  const fx = t.pos[0] + dx * m, fz = t.pos[2] + dz * m, b = s.arena.bounds;
  if (Math.hypot(fx - b.center[0], fz - b.center[1]) > b.radius) return true;
  if (b.half_planes.some(h => (fx - h.point[0]) * h.normal[0] + (fz - h.point[1]) * h.normal[1] < 0)) return true;
  const onLine = p => { const vx = p[0] - t.pos[0], vz = p[2] - t.pos[2], along = vx * dx + vz * dz; return along > 0 && along <= m && Math.abs(vx * dz - vz * dx) <= 0.8; };
  return s.props.some(p => onLine(p.pos)) || s.entities.some(e => e.side === 'enemy' && e.id !== t.id && e.present && !e.routed && onLine(e.pos));
}

/**
 * One skill-bar opening's commands: Set-up -> Pay-off chains first (Shoulder Check -> Bunny-Kick, Withering Hiss ->
 * Purr); the sim holds a Pay-off until its Set-up resolves. Crew skills are forced; Hige's Paw is spent only in a chain.
 */
function planCommands(enc, s, lock) {
  const cmds = [];
  const posse = s.entities.filter(e => e.side === 'posse' && !e.routed);
  const free = e => e.paws - e.paws_reserved;
  const by = id => posse.find(e => e.id === id);
  const mikan = by('mikan'), hige = by('hige'), pon = by('pon');
  const level = e => Math.abs(e.pos[1] - lock.pos[1]) < 0.5;
  const hurt = posse.filter(e => e.nerve / e.nerve_max < 0.7).sort((a, b) => a.nerve / a.nerve_max - b.nerve / b.nerve_max)[0];
  if (hige && mikan && free(hige) >= 1 && free(mikan) >= 1 && lock.rank !== 'boss' && level(hige) && lock.splat_s <= 0 && obstacleBehind(s, hige, lock)) {
    cmds.push({ cat: 'hige', move: 'shoulder_check', target: lock.id }, { cat: 'mikan', move: 'bunny_kick', target: lock.id });
  } else if (pon && free(pon) >= 2 && hurt && lock.status?.kind !== 'cowed') {
    cmds.push({ cat: 'pon', move: 'withering_hiss', target: lock.id }, { cat: 'pon', move: 'purr', target: hurt.id });
  } else if (mikan && free(mikan) >= 1 && (lock.splat_s > 0 || lock.status?.kind === 'soggy')) {
    cmds.push({ cat: 'mikan', move: 'bunny_kick', target: lock.id });
  } else if (mikan && free(mikan) >= 1 && lock.ruffled_s <= 0 && lock.staggered_s <= 0 && level(mikan)) {
    cmds.push({ cat: 'mikan', move: 'face_swat', target: lock.id });
  } else if (pon && free(pon) >= 1 && hurt && hurt.nerve / hurt.nerve_max < 0.45) {
    cmds.push({ cat: 'pon', move: 'purr', target: hurt.id });
  }
  return cmds;
}

/**
 * Skilled bot: focuses the most-staggered enemy, strings L-L-L-H into the buffer windows, dashes in with a lunge,
 * dodges telegraphs, chains Set-ups into Pay-offs from the skill bar, and fires the Special (F) on every stagger.
 * Options make it the median policy: `uptime` (share of time attacking), `dodgeEvery` (answer 1 in N telegraphs).
 */
export function skilledBot({ commands = true, uptime = 1, dodgeEvery = 1, specials = true } = {}) {
  let sbPhase = 0, lastCmdT = -99;
  const memo = new Map(), counter = { n: 0 };
  return enc => {
    const s = enc.snapshot();
    if (s.mode !== 'fight') return {};
    const c = s.entities.find(e => e.controlled);
    const foes = s.entities.filter(e => e.side === 'enemy' && e.present && !e.routed);
    if (!c || c.routed || !foes.length) return {};
    if (sbPhase === 1) { sbPhase = 2; return { skillBar: true }; }
    if (specials && s.special_prompt?.ready) return { special: true };
    const lock = foes.slice().sort((a, b) => (b.staggered_s > 0) - (a.staggered_s > 0) || b.stagger - a.stagger || d2(c, a) - d2(c, b))[0];
    const inp = s.lock === lock.id ? {} : { lockId: lock.id };
    const def = dodgeIfNeeded(s, c, inp, dodgeEvery, memo, counter);
    if (def) return def;
    if (commands && s.fight_t - lastCmdT > 1.5 && !c.attack) {
      const cmds = planCommands(enc, s, lock);
      if (cmds.length) { lastCmdT = s.fight_t; sbPhase = 1; return { ...inp, skillBar: true, commands: cmds }; }
    }
    const dd = d2(c, lock), sameLevel = Math.abs(c.pos[1] - lock.pos[1]) < 0.5;
    if (!sameLevel) return { ...inp, move: toward(c, lock) };
    if (dd > 3.2 && !c.attack && c.anim !== 'dash') return { ...inp, move: toward(c, lock), dash: true };
    if (c.anim === 'dash' && dd < 2.4) return { ...inp, light: true }; // Dash -> L lunge
    if (dd > 1.6 && !c.attack) return { ...inp, move: toward(c, lock) };
    const cyc = enc.k.string_cycle_s / uptime;
    if (uptime < 1 && (s.fight_t % cyc) > enc.k.string_cycle_s && !c.attack) return { ...inp, aim: toward(c, lock) };
    return stringPress(enc, c, inp, lock);
  };
}

/** Combat F9's median policy: 65% attack uptime, half the telegraphs answered. */
export const medianBot = () => skilledBot({ uptime: 0.65, dodgeEvery: 2 });

/**
 * Scripted Daifuku bot (Mikan only): dash into the wall below him to mantle, L-L-L-H him off (the heavy finisher
 * knocks back), force Hige's Shoulder Check from the skill bar when Hige is up there, fight him on the ground, and
 * fire the Special on every stagger.
 */
export function daifukuBot() {
  let sbPhase = 0, lastCmdT = -99;
  const memo = new Map(), counter = { n: 0 };
  return enc => {
    const s = enc.snapshot();
    if (s.mode !== 'fight') return {};
    const c = s.entities.find(e => e.controlled);
    const b = s.entities.find(e => e.id === 'daifuku');
    if (!c || c.routed || !b || !b.present) return {};
    if (sbPhase === 1) { sbPhase = 2; return { skillBar: true }; }
    if (s.special_prompt?.ready) return { special: true };
    const inp = s.lock === b.id ? {} : { lockId: b.id };
    const def = dodgeIfNeeded(s, c, inp, 1, memo, counter);
    if (def) return def;
    const onWall = b.boss.state === 'wall' && b.on_high_road;
    const hige = s.entities.find(e => e.id === 'hige' && !e.routed), mikanE = c;
    if (s.fight_t - lastCmdT > 1.5 && !c.attack) {
      const cmds = [];
      if (onWall && hige && hige.on_high_road && hige.paws - hige.paws_reserved >= 1 && Math.hypot(hige.pos[0] - b.pos[0], hige.pos[2] - b.pos[2]) < 4) cmds.push({ cat: 'hige', move: 'shoulder_check', target: b.id });
      if (!onWall && b.pos[1] < 0.5 && mikanE.paws - mikanE.paws_reserved >= 1) {
        if (b.status?.kind === 'soggy') cmds.push({ cat: 'mikan', move: 'bunny_kick', target: b.id });
        else if (b.ruffled_s <= 0 && b.staggered_s <= 0) cmds.push({ cat: 'mikan', move: 'face_swat', target: b.id });
      }
      if (cmds.length) { lastCmdT = s.fight_t; sbPhase = 1; return { ...inp, skillBar: true, commands: cmds }; }
    }
    if (onWall && !c.on_high_road) {
      if (c.anim === 'mantle') return inp;
      const hr = s.arena.high_roads.find(h => h.boss_wall);
      const foot = [b.pos[0], hr.a[1] + hr.drop_side[1] * 0.6];
      const fromWall = Math.abs(c.pos[2] - hr.a[1]);
      if (fromWall <= 0.85 && Math.abs(c.pos[0] - b.pos[0]) <= 1.5) return { ...inp, dash: true, move: [-hr.drop_side[0], -hr.drop_side[1]] };
      return { ...inp, move: [foot[0] - c.pos[0], foot[1] - c.pos[2]] };
    }
    if (!onWall && c.on_high_road && !c.attack) return { ...inp, dash: true, move: [0, 1] };
    if (d2(c, b) > 1.7 && !c.attack) return { ...inp, move: toward(c, b) };
    return stringPress(enc, c, inp, b);
  };
}

/** Wrap a bot so that a list of skill-bar commands in its frame is sent one per tick. */
export function withCommandQueue(bot) {
  const q = [];
  return (enc, i) => {
    if (q.length && enc.skillBar) return { command: q.shift() };
    const f = bot(enc, i) || {};
    if (f.commands) { q.push(...f.commands); delete f.commands; }
    return f;
  };
}

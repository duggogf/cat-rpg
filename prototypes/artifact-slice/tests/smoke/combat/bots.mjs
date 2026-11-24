// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Input bots for the combat smoke runs (tools/sim-run.mjs), M1.2 controls: the player drives Mikan only
// (light, heavy, Evade on Space with a cooldown, Tab lock-on, R skill bar, F Special at any time). A bot is (enc) -> InputFrame and reads only the
// public snapshot plus the string table, as a player reads the screen.

const d2 = (a, b) => Math.hypot(a.pos[0] - b.pos[0], a.pos[2] - b.pos[2]);
const toward = (a, b) => [b.pos[0] - a.pos[0], b.pos[2] - a.pos[2]];
const away = (a, b) => [a.pos[0] - b.pos[0], a.pos[2] - b.pos[2]];

/** Passive: no input at all. */
export const passiveBot = () => () => ({});

function dodgeIfNeeded(s, c, inp, every = 1, memo = new Map(), counter = { n: 0 }) {
  if (!c.evade_ready) return null;
  for (const tl of s.telegraphs) {
    const aimed = tl.aimed_at === c.id;
    const inRed = tl.cls === 'red' && tl.shape.type === 'circle' && Math.hypot(c.pos[0] - tl.shape.center[0], c.pos[2] - tl.shape.center[1]) < tl.shape.radius + 0.5;
    if (!(aimed || inRed) || tl.dur - tl.t > 0.2) continue;
    if (!memo.has(tl.id)) memo.set(tl.id, (counter.n++ % every) === 0);
    if (!memo.get(tl.id)) continue;
    const att = s.entities.find(e => e.id === tl.attacker);
    const from = tl.shape.type === 'circle' ? { pos: [tl.shape.center[0], 0, tl.shape.center[1]] } : att;
    if (from) return { ...inp, evade: true, move: away(c, from) };
  }
  for (const h of s.hazards || []) { // a shockwave ring about to reach Mikan: evade through it (i-frames)
    const d = Math.hypot(c.pos[0] - h.center[0], c.pos[2] - h.center[1]);
    if (d > h.radius && d - h.radius <= h.speed * 0.12 + h.width / 2 + 0.35) return { ...inp, evade: true, move: [h.center[0] - c.pos[0], h.center[1] - c.pos[2]] };
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
  const low = posse.filter(e => e.nerve / e.nerve_max < 0.4).sort((a, b) => a.nerve / a.nerve_max - b.nerve / b.nerve_max)[0];
  if (pon && free(pon) >= 1 && low) return [{ cat: 'pon', move: 'purr', target: low.id }]; // heal first when someone is low
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
export function skilledBot({ commands = true, uptime = 1, dodgeEvery = 1, specials = true, focus = null } = {}) {
  let sbPhase = 0, lastCmdT = -99, readySince = null, evadeDir = null, approachEvade = false;
  const memo = new Map(), counter = { n: 0 };
  return enc => {
    const s = enc.snapshot();
    if (s.mode !== 'fight') return {};
    const c = s.entities.find(e => e.controlled);
    const foes = s.entities.filter(e => e.side === 'enemy' && e.present && !e.routed);
    if (!c || c.routed || !foes.length) return {};
    if (sbPhase === 1) { sbPhase = 2; return { skillBar: true }; }
    // The Special at any time (M1.2): on a staggered target, when the whole crew is ready, or after holding it 4 s.
    if (c.special_ready) readySince = readySince ?? s.fight_t; else readySince = null;
    const crewReady = s.entities.filter(e => e.side === 'posse' && !e.routed && e.special_ready).length;
    if (specials && s.special_prompt?.ready && (s.special_prompt.staggered || crewReady >= 4 || s.fight_t - readySince > 4)) return { special: true };
    const lock = (focus && foes.find(e => e.id === focus)) || foes.slice().sort((a, b) => (b.staggered_s > 0) - (a.staggered_s > 0) || b.stagger - a.stagger || d2(c, a) - d2(c, b))[0];
    const inp = s.lock === lock.id ? {} : { lockId: lock.id };
    // The evade is steerable (M1.3): hold the escape direction through it, as a player does.
    if (c.anim === 'evade' && approachEvade && d2(c, lock) < 3.0) return { ...inp, light: true }; // Evade -> L lunge
    if (c.anim === 'evade' && evadeDir) return { ...inp, move: evadeDir };
    const def = dodgeIfNeeded(s, c, inp, dodgeEvery, memo, counter);
    if (def) { evadeDir = def.move; approachEvade = false; return def; }
    if (c.counter_window_s > 0) return { ...inp, light: true }; // the perfect-evade counter
    if (commands && s.fight_t - lastCmdT > 1.5 && !c.attack) {
      const cmds = planCommands(enc, s, lock);
      if (cmds.length) { lastCmdT = s.fight_t; sbPhase = 1; return { ...inp, skillBar: true, commands: cmds }; }
    }
    const dd = d2(c, lock), sameLevel = Math.abs(c.pos[1] - lock.pos[1]) < 0.5;
    if (!sameLevel) return { ...inp, move: toward(c, lock) };
    if (dd > 3.0 && dd < 4.2 && !c.attack && c.evade_ready && c.anim !== 'evade') { evadeDir = toward(c, lock); approachEvade = true; return { ...inp, move: evadeDir, evade: true }; }
    if (dd > 1.6 && !c.attack) return { ...inp, move: toward(c, lock) };
    const cyc = enc.k.string_cycle_s / uptime;
    if (uptime < 1 && (s.fight_t % cyc) > enc.k.string_cycle_s && !c.attack) return { ...inp, aim: toward(c, lock) };
    return stringPress(enc, c, inp, lock);
  };
}

/** Combat F9's median policy: 65% attack uptime, half the telegraphs answered. */
export const medianBot = () => skilledBot({ uptime: 0.65, dodgeEvery: 2 });

/** Scripted Daifuku bot (M1.2: he fights on the ground): the skilled policy focused on him, evading the slam and its ring. */
export const daifukuBot = () => skilledBot({ focus: 'daifuku' });

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

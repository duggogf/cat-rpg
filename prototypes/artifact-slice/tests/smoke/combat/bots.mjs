// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Input bots for the combat smoke runs (tools/sim-run.mjs). A bot is (enc) -> InputFrame, using only
// the public snapshot plus the encounter's read-only fields, as a player would see the screen.

const d2 = (a, b) => Math.hypot(a.pos[0] - b.pos[0], a.pos[2] - b.pos[2]);
const toward = (a, b) => [b.pos[0] - a.pos[0], b.pos[2] - a.pos[2]];
const away = (a, b) => [a.pos[0] - b.pos[0], a.pos[2] - b.pos[2]];

/** Passive: no input at all. */
export const passiveBot = () => () => ({});

function reactDefensively(s, c, inp) {
  for (const tl of s.telegraphs) {
    const aimed = tl.aimed_at === c.id;
    const left = tl.dur - tl.t;
    const att = s.entities.find(e => e.id === tl.attacker);
    if (!att) continue;
    const inRed = tl.cls === 'red' && tl.shape.type === 'circle' && Math.hypot(c.pos[0] - tl.shape.center[0], c.pos[2] - tl.shape.center[1]) < tl.shape.radius + 0.5;
    if (tl.cls === 'yellow' && aimed && c.hiss_cd_s <= 0 && d2(c, att) <= 3.8 && left < 0.6) return { ...inp, aim: toward(c, att), hiss: true };
    if (tl.move === 'climb_back' && c.hiss_cd_s <= 0 && d2(c, att) <= 3.8) return { ...inp, aim: toward(c, att), hiss: true };
    if ((aimed || inRed) && left < 0.25) {
      const from = tl.shape.type === 'circle' ? { pos: [tl.shape.center[0], 0, tl.shape.center[1]] } : att;
      return { ...inp, skitter: true, move: away(c, from) };
    }
  }
  return null;
}

/**
 * Skilled bot: focuses the enemy with the most Frazzle, dodges and Hisses telegraphs, Tag-Ins on every
 * window, commands Set-up -> Pay-off pairs from Slow Blink, and cashes in Pile-Ons.
 */
export function skilledBot({ tagIns = true, commands = true, uptime = 1, tagPeriod = 0, dodgeEvery = 1 } = {}) {
  let sbPhase = 0, lastCmdT = -99, lastTagT = -99, seen = 0;
  const dodged = new Map();
  return enc => {
    const s = enc.snapshot();
    if (s.mode !== 'fight') return {};
    const c = s.entities.find(e => e.controlled);
    const foes = s.entities.filter(e => e.side === 'enemy' && e.present && !e.routed);
    if (!c || !foes.length) return {};
    // Slow Blink: open, issue the commands, close.
    if (sbPhase === 1) { sbPhase = 2; return { slowBlink: true }; }
    if (s.pile_on_offer) return { hiss: true, slowBlink: s.slow_blink };
    // Lock: a Frazzled enemy first, then the one with the most Frazzle.
    const lock = foes.slice().sort((a, b) => (b.frazzled_s > 0) - (a.frazzled_s > 0) || b.frazzle - a.frazzle || d2(c, a) - d2(c, b))[0];
    const inp = { lockId: lock.id };
    let def = reactDefensively(s, c, inp);
    if (def && dodgeEvery > 1) { // the median policy answers only some telegraphs
      const tl = s.telegraphs.find(t => t.aimed_at === c.id) || s.telegraphs[0];
      if (tl && !dodged.has(tl.id)) dodged.set(tl.id, (seen++ % dodgeEvery) === 0);
      if (tl && !dodged.get(tl.id)) def = null;
    }
    if (def) return def;
    if (tagIns && s.tag_window && s.fight_t - lastTagT >= tagPeriod) {
      lastTagT = s.fight_t;
      const order = s.entities.filter(e => e.side === 'posse').sort((a, b) => a.slot - b.slot);
      const members = new Set(s.relay?.members || []);
      for (let i = 1; i < order.length; i++) {
        const n = order[(c.slot + i) % order.length];
        if (!n.routed && !members.has(n.id) && d2(n, lock) <= 7.5) return { ...inp, switchTo: n.slot };
      }
      if (s.relay && s.relay.starter !== c.id) { const st = order.find(e => e.id === s.relay.starter); if (st && !st.routed) return { ...inp, switchTo: st.slot }; }
    }
    if (commands && s.fight_t - lastCmdT > 1.5) {
      const cmds = planCommands(enc, s, lock);
      if (cmds.length) { lastCmdT = s.fight_t; sbPhase = 1; return { ...inp, slowBlink: true, commands: cmds }; }
    }
    if (d2(c, lock) > 1.4 || Math.abs(c.pos[1] - lock.pos[1]) > 0.5) return { ...inp, move: toward(c, lock) };
    const cyc = enc.k.string_cycle_s / uptime;
    if (uptime < 1 && (s.fight_t % cyc) > enc.k.string_cycle_s) return { ...inp, aim: toward(c, lock) };
    return { ...inp, aim: toward(c, lock), attack: true };
  };
}

/** Combat F9's median policy: 65% attack uptime, about one Tag-In per 10 s, half the telegraphs answered. */
export const medianBot = () => skilledBot({ uptime: 0.65, tagPeriod: 10, dodgeEvery: 2 });

/** Set-up -> Pay-off pairs within what each cat can afford (Combat §3.10). */
function planCommands(enc, s, lock) {
  const cmds = [];
  const posse = s.entities.filter(e => e.side === 'posse' && !e.routed);
  const free = e => e.paws - e.paws_reserved;
  const by = id => posse.find(e => e.id === id);
  const mikan = by('mikan'), hige = by('hige'), pon = by('pon');
  const splatOrSoggy = lock.splat_s > 0 || lock.status?.kind === 'soggy';
  if (mikan && free(mikan) >= 1 && splatOrSoggy) cmds.push({ cat: 'mikan', move: 'bunny_kick', target: lock.id });
  else if (hige && free(hige) >= 1 && lock.rank !== 'boss' && Math.abs(hige.pos[1] - lock.pos[1]) < 0.5) cmds.push({ cat: 'hige', move: 'shoulder_check', target: lock.id });
  else if (mikan && free(mikan) >= 1 && lock.ruffled_s <= 0 && lock.frazzled_s <= 0 && Math.abs(mikan.pos[1] - lock.pos[1]) < 0.5) cmds.push({ cat: 'mikan', move: 'face_swat', target: lock.id });
  const hurt = posse.filter(e => e.nerve / e.nerve_max < 0.45).sort((a, b) => a.nerve / a.nerve_max - b.nerve / b.nerve_max)[0];
  if (pon && free(pon) >= 1 && hurt) cmds.push({ cat: 'pon', move: 'purr', target: hurt.id });
  return cmds;
}

/**
 * Scripted Daifuku bot: drive Hige onto the wall, Shove Daifuku off into the tub (the Bruiser finisher is a
 * knock-off), fight him on the ground with Face Swat / Bunny-Kick commands, Hiss Paw Swats and Climb Backs,
 * Tag-In Mikan and back, and cash in every Pile-On.
 */
export function daifukuBot() {
  let sbPhase = 0, lastCmdT = -99, started = false;
  return enc => {
    const s = enc.snapshot();
    if (s.mode !== 'fight') return {};
    if (!started) { started = true; return { switchTo: 1 }; }
    const c = s.entities.find(e => e.controlled);
    const b = s.entities.find(e => e.id === 'daifuku');
    if (!c || !b || !b.present) return {};
    if (sbPhase === 1) { sbPhase = 2; return { slowBlink: true }; }
    if (s.pile_on_offer) return { hiss: true };
    const inp = { lockId: b.id };
    const def = reactDefensively(s, c, inp);
    if (def) return def;
    const onWall = b.boss.state === 'wall' && b.on_high_road;
    if (s.tag_window && !onWall) {
      const mikan = s.entities.find(e => e.id === 'mikan'), hige = s.entities.find(e => e.id === 'hige');
      if (c.id === 'hige' && mikan && !mikan.routed && (!s.relay || !s.relay.members.includes('mikan'))) return { ...inp, switchTo: mikan.slot };
      if (c.id === 'mikan' && hige && !hige.routed && s.relay) return { ...inp, switchTo: hige.slot };
    }
    if (!onWall && s.fight_t - lastCmdT > 1.5 && b.pos[1] < 0.5) {
      const mikan = s.entities.find(e => e.id === 'mikan' && !e.routed);
      const cmds = [];
      if (mikan && mikan.paws - mikan.paws_reserved >= 1) {
        if (b.status?.kind === 'soggy') cmds.push({ cat: 'mikan', move: 'bunny_kick', target: b.id });
        else if (b.ruffled_s <= 0 && b.frazzled_s <= 0) cmds.push({ cat: 'mikan', move: 'face_swat', target: b.id });
      }
      if (cmds.length) { lastCmdT = s.fight_t; sbPhase = 1; return { ...inp, slowBlink: true, commands: cmds }; }
    }
    // Hige (or whoever is controlled) goes to Daifuku's level.
    if (onWall && !c.on_high_road) {
      if (c.anim === 'mantle') return inp;
      const hr = s.arena.high_roads.find(h => h.boss_wall);
      const foot = [b.pos[0], hr.a[1] + hr.drop_side[1] * 0.6];
      const dx = foot[0] - c.pos[0], dz = foot[1] - c.pos[2];
      const fromWall = Math.abs(c.pos[2] - hr.a[1]);
      if (fromWall <= 0.85 && Math.abs(c.pos[0] - b.pos[0]) <= 1.5) return { ...inp, hop: true };
      return { ...inp, move: [dx, dz] };
    }
    if (!onWall && c.on_high_road) return { ...inp, hop: true };
    if (d2(c, b) > 1.6) return { ...inp, move: toward(c, b) };
    return { ...inp, aim: toward(c, b), attack: true };
  };
}

/** Wrap a bot so that a list of Slow Blink commands in its frame is sent one per tick. */
export function withCommandQueue(bot) {
  const q = [];
  return (enc, i) => {
    if (q.length && enc.slowBlink) return { command: q.shift() };
    const f = bot(enc, i) || {};
    if (f.commands) { q.push(...f.commands); delete f.commands; }
    return f;
  };
}

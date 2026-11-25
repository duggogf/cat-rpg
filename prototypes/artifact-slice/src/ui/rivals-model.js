// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Rivals board's view model: who stands in which scene, discovered or not, their marks, one card's worth of
// facts, and their ties. Facts come from the nemesis simulation (src/sim/nemesis/, when present) through
// fromNemesis(); until then the slice's fixed seeds (plan §2.1-§2.4, key-screens §2.7 "Slice seeds you can see")
// stand in. Presentation only: nothing here changes a cat (key-screens §2.11).
import { castFor, portraitFor } from '../render/vfx/fighters.js';

/** Role tag words (key-screens §2.4) by personality. */
export const ROLE_WORD = { braggart: 'Brawler', brooder: 'Enforcer', schemer: 'Sneak', fraidy: 'Lookout', stalwart: 'Shield', goofball: 'Prankster' };
export const PERS_NAME = { braggart: 'Braggart', brooder: 'Brooder', schemer: 'Schemer', fraidy: 'Fraidy', stalwart: 'Stalwart', goofball: 'Goofball' };
export const ANGER_WORD = ['Calm', 'Riled', 'Seething', 'Furious'];

// board-only casts the combat cast map does not hold (Ohagi, Kuri: key-screens wireframe names; Narrative polishes)
const EXTRA_CAST = {
  ohagi: { cast: 'tough', opts: { coat: { base: '#F4DDAA', white: '#FFF8EC' }, pattern: 'bicolour', tail: 'ringed', ears: 'standard', build: 'round', personality: 'stalwart', rank: 1.15, eye: 'copper', expr: 'neutral', seed: 51 },
    kit: { coat: { base: '#F4DDAA', white: '#FFF8EC' }, pattern: 'bicolour', tail: 'ringed', ears: 'standard', build: 'round', eye: 'copper', carry: 'post', expr: 'neutral' } },
  kuri: { cast: 'tough', opts: { coat: { base: '#8A6248', patch: '#4E3526' }, pattern: 'tabby', tail: 'whip', ears: 'tall', build: 'long', personality: 'goofball', eye: 'green', expr: 'happy', seed: 52 },
    kit: { coat: { base: '#8A6248', patch: '#4E3526' }, pattern: 'tabby', tail: 'whip', ears: 'tall', build: 'long', eye: 'green', carry: 'spring', expr: 'happy' } },
};
function castOf(id) {
  if (EXTRA_CAST[id]) return { cast: EXTRA_CAST[id].cast, opts: EXTRA_CAST[id].opts };
  const m = castFor(id, id);
  return m.opts ? { cast: m.cast, opts: m.opts } : { cast: m.cast, extra: m.extra || 1 };
}
export function kitOf(id) { return EXTRA_CAST[id] ? EXTRA_CAST[id].kit : portraitFor(id, id); }

/**
 * The slice's cats. scene/role are fixed for life (OR-19). `answersTo` is the Gang/Boss relation drawn as an arrow.
 * Per-branch states for Togemaru (plan §2.3): A Nose-Touch (truce, Sworn Rival), B Recruit (in the Crew), C Chase Off (Gone).
 */
const BASE = {
  daifuku: { name: 'Daifuku', title: 'Boss of Hidamari Lane', scene: 'lane', role: 'boss', personality: 'brooder', style: 'Bruiser', clowder: 'wall_sitters' },
  kagi: { name: 'Kagi', title: 'Captain of Tofu Shop Step', scene: 'lane', role: 'captain', personality: 'schemer', style: 'Yowler', clowder: 'wall_sitters', answersTo: 'daifuku' },
  ohagi: { name: 'Ohagi', title: 'Captain of Persimmon Alley', scene: 'lane', role: 'captain', personality: 'stalwart', style: 'Bruiser', clowder: 'wall_sitters', answersTo: 'daifuku' },
  goma: { name: 'Goma', scene: 'lane', role: 'tough', personality: 'brooder', style: 'Bruiser', clowder: 'wall_sitters', answersTo: 'daifuku' },
  togemaru: { name: 'Togemaru', title: 'the First Thorn', scene: 'lane', role: 'tough', personality: 'braggart', style: 'Scrapper', clowder: 'wall_sitters', answersTo: 'daifuku', arcLead: true },
  sasa: { name: 'Sasa', scene: 'lane', role: 'tough', personality: 'schemer', style: 'Yowler', clowder: 'wall_sitters', answersTo: 'daifuku' },
  kuri: { name: 'Kuri', scene: 'lane', role: 'tough', personality: 'goofball', style: 'Trickster', clowder: 'wall_sitters', answersTo: 'daifuku' },
  challenger: { name: 'The stranger', scene: 'outsiders', role: 'outsider', personality: 'braggart', style: 'Scrapper', clowder: 'outsiders', situation: 'Challenger', stake: 'Laundry Pole Yard' },
  mikan: { name: 'Mikan', scene: 'bell', role: 'mikan', personality: null, style: 'Scrapper', clowder: 'bell', clout: 'Known Face' },
  hige: { name: 'Hige', scene: 'bell', role: 'crew', personality: 'stalwart', style: 'Bruiser', clowder: 'bell', answersTo: 'mikan' },
  pon: { name: 'Pon', scene: 'bell', role: 'crew', personality: 'goofball', style: 'Yowler', clowder: 'bell', answersTo: 'mikan' },
  kinako: { name: 'Kinako', scene: 'bell', role: 'crew', personality: 'fraidy', style: 'Scrapper', clowder: 'bell', answersTo: 'mikan' },
};
/** Fixed ties (generation facts; key-screens §2.7 slice seeds). Old Boss/Old Gang read from the recruit's own Memory. */
const TIES = [
  ['togemaru', 'goma', 'rival'], ['kagi', 'ohagi', 'rival'], ['kinako', 'sasa', 'kin'], ['hige', 'daifuku', 'old_boss'],
];

/**
 * Build the fallback model.
 * o: { branch: 'A'|'B'|'C'|null (Togemaru's first Verdict; null = Life 1, not yet), day, life,
 *      discovered: {id: bool}, anger: 0..3, challengerKnown: bool, window: bool }
 */
export function fallbackModel(o = {}) {
  const branch = o.branch === undefined ? 'A' : o.branch;
  const disc = { daifuku: true, kagi: true, ohagi: true, goma: true, togemaru: true, sasa: false, kuri: true, challenger: false, mikan: true, hige: true, pon: true, kinako: true, ...(o.discovered || {}) };
  const anger = o.anger ?? 3;
  const cats = {};
  for (const [id, b] of Object.entries(BASE)) {
    cats[id] = { id, ...b, homeScene: b.scene, discovered: !!disc[id], cast: castOf(id), kit: kitOf(id), state: 'present', marks: {}, history: null, context: null, tapeStar: false, scars: [] };
  }
  const c = cats;
  // own-history lines (each cat's own Memory of its dealings with Mikan; G8)
  c.daifuku.history = { day: 'L2 D1', line: 'Sniffed from the yard perch.' };
  c.daifuku.marks.puffs = anger;
  c.daifuku.context = { kind: 'anger', stage: ANGER_WORD[anger], line: 'Angry at your marks in his Lane. Spent in his next fight.' };
  c.kagi.marks.sprig = true; c.kagi.history = { day: 'L2 D1', line: '"A truce, then. For now."' }; c.kagi.context = { kind: 'truce', line: 'Truce: 6 days left' };
  c.ohagi.history = { day: 'L1 D2', line: '"You keep to your posts. I keep to mine."' };
  c.goma.history = { day: 'L1 D2', line: '"You and your bell. Next time it’s me."' };
  c.kuri.history = { day: 'L1 D2', line: '"Was that a bell? Do it again!"' };
  c.togemaru.scars = ['notch'];
  if (branch === 'A') {
    c.togemaru.marks.storm = 'Sworn Rival'; c.togemaru.marks.sprig = true;
    c.togemaru.history = { day: 'L1 D2', line: '"We touched noses. Ten days."' };
    c.togemaru.context = { kind: 'truce', line: 'Truce: 7 days left' };
    c.challenger.rivalOf = 'togemaru';
  } else if (branch === 'B') {
    c.togemaru.state = 'crew'; c.togemaru.scene = 'bell'; c.togemaru.role = 'crew'; c.togemaru.answersTo = 'mikan'; c.togemaru.mood = 'Aloof';
    c.togemaru.history = { day: 'L1 D2', line: '"Fine. I’ll wear your cord. Not your bell."' };
    c.challenger.rivalOf = 'goma';
  } else if (branch === 'C') {
    c.togemaru.state = 'gone';
    c.togemaru.history = { day: 'L1 D2', line: '"You’ll hear of me, Collar."' };
    c.challenger.rivalOf = 'goma';
  } else {
    c.togemaru.marks.storm = 'Sworn Enemy';
    c.togemaru.history = { day: 'L1 D1', line: '"Faster than a kitten. Remember that."' };
  }
  c.challenger.context = { kind: 'stake', line: 'Staking Laundry Pole Yard · leaves after 2 repels', pips: [0, 2] };
  c.hige.history = { day: 'L1 D1', line: '"Use your whiskers, Collar."' };
  c.hige.context = { kind: 'assign', line: 'Posse' }; c.pon.context = { kind: 'assign', line: 'Posse' }; c.kinako.context = { kind: 'assign', line: 'Lounging at the Lot' };
  if (branch === 'B') c.togemaru.context = { kind: 'assign', line: 'Lounging · new to the bell' };
  c.mikan.context = null;
  c.pon.history = { day: 'L1 D2', line: '"Ha! Did you hear him yowl?"' };
  c.kinako.history = { day: 'L1 D2', line: '"I’m only here for the fish."' };
  c.mikan.history = null;
  if (o.newIds) for (const id of o.newIds) if (c[id]) c[id].tapeStar = true;
  const ties = TIES.map(([a, b, kind]) => ({ a, b, kind }));
  if (c.challenger.rivalOf) ties.push({ a: 'challenger', b: c.challenger.rivalOf, kind: 'rival' });
  return finish({ cats, ties, life: o.life || 2, day: o.day || 2, branch });
}

function finish(m) {
  m.scenes = [
    { id: 'lane', name: 'Hidamari Lane', tab: 'Lane', emblem: 'stone' },
    { id: 'outsiders', name: 'Outsiders', tab: 'Outsiders', emblem: 'bus' },
    { id: 'bell', name: 'The Bell', tab: 'Bell', emblem: 'bell' },
  ];
  /** ties of one cat, worded from its point of view, discovered cats only (OR-04). */
  m.tiesOf = (id) => {
    const out = [];
    for (const t of m.ties) {
      let other = null, kind = t.kind;
      if (t.a === id) other = t.b; else if (t.b === id) { other = t.a; if (kind === 'old_boss') kind = 'old_gang'; }
      if (!other) continue;
      const me = m.cats[id], ot = m.cats[other];
      if (!me || !ot || !me.discovered || !ot.discovered || ot.state === 'gone') continue;
      out.push({ to: other, kind });
    }
    const pri = { rival: 0, kin: 1, old_boss: 2, old_gang: 2 };
    return out.sort((x, y) => pri[x.kind] - pri[y.kind]);
  };
  return m;
}

/**
 * Adapter for the nemesis simulation's API (src/sim/nemesis/API.md): boardView() for discovery, state, marks, history,
 * tape stars and ties; nameCard() (through boardView's `card`) for the mood pictograms and the context line; board()
 * for the strip dots of the uphill silhouette scenes. Names, casts and titles stay this file's (presentation only).
 */
const CTX_KIND = { anger: 'anger', truce: 'truce', friend: 'truce', stake: 'stake', raid: 'raid', roaming: 'raid' };
export function fromNemesis(nem, o = {}) {
  try {
    if (!nem) return fallbackModel(o);
    const view = typeof nem.boardView === 'function' ? nem.boardView() : null;
    if (!view) return fallbackModel(o);
    const branch = view.life >= 2 ? (view.branch ?? o.branch) : null;
    const m = fallbackModel({ ...o, branch: branch || o.branch, anger: view.anger ?? o.anger });
    m.branch = branch; m.life = view.life; m.day = view.day;
    for (const cv of view.cats || []) {
      let c = m.cats[cv.id];
      if (!c) {
        if (!['lane', 'outsiders', 'bell'].includes(cv.scene)) continue;
        c = m.cats[cv.id] = { id: cv.id, name: cv.id[0].toUpperCase() + cv.id.slice(1), scene: cv.scene, homeScene: cv.scene, role: cv.anchor === 'wall' ? 'roamer' : 'tough', clowder: cv.scene === 'lane' ? 'wall_sitters' : 'outsiders',
          answersTo: cv.scene === 'lane' ? 'daifuku' : null, personality: null, style: 'Scrapper', cast: { cast: 'tough' }, kit: kitOf('goma'), marks: {}, scars: [], state: 'present', history: null, context: null };
      }
      c.discovered = !!cv.discovered; c.state = cv.state || c.state; c.tapeStar = !!cv.tapeStar;
      if (cv.state === 'crew' && c.clowder !== 'bell') { c.scene = 'bell'; c.role = 'crew'; c.answersTo = 'mikan'; }
      if (cv.state === 'gone') c.scene = c.homeScene;
      c.marks = { ...(cv.marks || {}) }; if (c.marks.sprig === undefined) delete c.marks.sprig;
      c.history = cv.history || null; if (cv.scars) c.scars = cv.scars;
      const k = cv.card;
      if (k) {
        c.gWord = k.grudge; c.rWord = k.regard;
        const x = k.context;
        if (x && CTX_KIND[x.kind]) c.context = { kind: CTX_KIND[x.kind], line: x.line, stage: x.stage, pips: x.pips };
        else if (x && x.kind === 'crew' && c.context && c.context.kind === 'assign') { /* keep the Posse / Lounging line */ }
        else if (x && x.kind === 'crew') c.context = { kind: 'assign', line: x.line };
        else if (!x && c.context && c.context.kind !== 'assign') c.context = null;
      }
    }
    if (Array.isArray(view.ties)) m.ties = view.ties.map((t) => ({ a: t.a ?? t.from, b: t.b ?? t.to, kind: t.kind }));
    try { const b = nem.board(); m.simScenes = b.scenes; } catch (e) { /* strip dots fall back to the model */ }
    m.sim = true;
    return m;
  } catch (e) { console.warn('nemesis board view unreadable; using the fixed seeds', e); return fallbackModel(o); }
}

/* ------------------------------------------------------------------ the thin adapter the screens call */
let NEM = null;
/** Hand the board a nemesis town (src/sim/nemesis/, once its API lands); null keeps the fixed seeds. */
export function setNemesis(town) { NEM = town; }
export function nemesisTown() { return NEM; }
/** The board's model: the sim's view when present, else the slice seeds. */
export function boardModel(o = {}) { return fromNemesis(NEM, o); }

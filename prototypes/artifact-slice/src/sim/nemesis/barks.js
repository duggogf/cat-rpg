// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Bark selection (Nemesis §3.15 grammar, F8 score). Every fact a template can require is read from the
// SPEAKER's own record (Memory, relations, state) or Mikan's visible routine/Clout: the own-history rule (G8).
import { Stream } from '../core/rng.js';
import { angerStage } from './formulas.js';

export const FAMILY = {
  memory: new Set(['last_verdict', 'last_finisher_type', 'by_pile_on', 'fear_exploited', 'ambushed', 'lick_in', 'scar_from_mikan', 'patch_lost', 'fled', 'count_routs', 'adapted', 'mikan_plastered', 'joined_in', 'old_gang']),
  relationship: new Set(['nemesis', 'sworn_rival', 'bitter', 'friend', 'truce', 'grudge', 'regard', 'rival_of', 'kin_of', 'old_boss', 'ex_crew']),
  context: new Set(['phase', 'own_patch', 'rank', 'clout', 'life', 'evenings_home', 'nights_out', 'posse_size', 'anger']),
};
export const SLOT_MAX = { address: 8, mikan: 8, other: 8, patch: 16, title: 16, when: 14 };
export const MAX_CHARS = 60;

/** Parse "self.name:value" / "name>=3". */
export function parseTag(tag) {
  const t = tag.replace(/^self\./, '');
  const m = t.match(/^([a-z_]+)(?:(>=|<=|:)(.+))?$/);
  if (!m) return null;
  return { scope: tag.startsWith('other.') ? 'other' : 'self', name: m[1], op: m[2] || null, value: m[3] ?? null };
}
export const familyOf = name => (FAMILY.memory.has(name) ? 'memory' : FAMILY.relationship.has(name) ? 'relationship' : FAMILY.context.has(name) ? 'context' : null);

/**
 * The speaker's facts. `ctx`: {patch, posse, opponents, encounterOther} for the current scene.
 * Reads only cat (the speaker; its own slot fields), the town's day/life/clout/phase, Mikan's plaster day
 * (read only through the speaker's own WON entry) and the scene context.
 */
export function speakerFacts(town, cat, ctx = {}) {
  const k = town.D.k, s = town.s;
  const set = new Set(), nums = {};
  const mem = cat.memory;
  const last = kind => [...mem].reverse().find(e => e.kind === kind);
  const lastVerdict = last('VERDICT');
  if (lastVerdict) set.add(`last_verdict:${lastVerdict.verdict}`);
  const lastRout = last('ROUTED');
  if (lastRout) { if (lastRout.damage_type) set.add(`last_finisher_type:${lastRout.damage_type}`); if (lastRout.by_pile_on) set.add('by_pile_on'); }
  for (const e of mem) {
    if (e.fear) set.add(`fear_exploited:${e.fear}`);
    if (e.kind === 'AMBUSHED_BY_PLAYER') set.add('ambushed');
    if (e.kind === 'LICK_IN') set.add('lick_in');
    if (e.kind === 'PATCH_LOST') set.add('patch_lost');
    if (e.kind === 'FLED') set.add('fled');
    if (e.kind === 'JOINED_IN') set.add('joined_in');
    if (e.kind === 'OLD_GANG') { set.add('old_gang'); set.add('old_boss'); }
    if (e.kind === 'ADAPTED') set.add(`adapted:${e.strength}`);
  }
  for (const sc of cat.scars) set.add(`scar_from_mikan:${sc.type}`);
  nums.count_routs = cat.routs_by_player;
  const won = last('WON');
  if (won && s.mikan_plaster_day === s.day && won.day === s.day - 1) set.add('mikan_plastered');
  // relationship
  const holdsSlot = cat.nemesis && cat.arc_role === 'lead';
  if (holdsSlot) { set.add('nemesis'); if (cat.face === 'sworn_rival') set.add('sworn_rival'); }
  if (cat.grudge >= k.bitter && !holdsSlot) set.add('bitter');
  if (cat.state === 'Friend') set.add('friend');
  if (cat.state === 'Truce') set.add('truce');
  nums.grudge = cat.grudge; nums.regard = cat.regard;
  if (cat.relations.some(r => r.kind === 'rival')) set.add('rival_of');
  if (cat.relations.some(r => r.kind === 'kin')) set.add('kin_of');
  if (cat.ex_crew) set.add('ex_crew');
  // context
  if (s.phase) set.add(`phase:${s.phase}`);
  if (ctx.patch && cat.keeper_of === ctx.patch) set.add('own_patch');
  set.add(`rank:${cat.role}`);
  set.add(`clout:${s.clout}`);
  set.add(`life:${town.life}`);
  nums.posse_size = (ctx.posse || []).length;
  if (cat.anger != null) set.add(`anger:${angerStage(k, cat.anger).stage.toLowerCase()}`);
  return { set, nums };
}

export function tagHolds(tag, facts) {
  const p = parseTag(tag);
  if (!p) return false;
  if (p.op === '>=' || p.op === '<=') {
    const v = facts.nums[p.name];
    if (v == null) return false;
    return p.op === '>=' ? v >= +p.value : v <= +p.value;
  }
  return facts.set.has(p.op === ':' ? `${p.name}:${p.value}` : p.name);
}

/** {other} binding: only the speaker's own Rival (in the scene if any), Kin, or OLD_GANG boss. */
function bindOther(town, cat, tpl, ctx) {
  const needs = tpl.requires.map(parseTag).filter(Boolean).map(p => p.name);
  const rel = kind => {
    const ids = cat.relations.filter(r => r.kind === kind).map(r => r.other_id);
    return ids.find(id => (ctx.opponents || []).includes(id)) ?? ids[0] ?? null;
  };
  let id = null;
  if (needs.includes('rival_of')) id = rel('rival');
  else if (needs.includes('kin_of')) id = rel('kin');
  else if (needs.includes('old_boss')) id = cat.memory.find(e => e.kind === 'OLD_GANG')?.other_id ?? null;
  return id;
}

export function fill(town, text, cat, bind) {
  const k = town.D.k, s = town.s;
  let address = k.clout.address[s.clout] || 'Collar';
  if (cat && cat.regard >= 50 && (s.clout === 'known_face' || s.clout === 'boss')) address = '{mikan}';
  const other = bind.other ? (town.s.cats[bind.other]?.display ?? '') : '';
  return text
    .replaceAll('{address}', address)
    .replaceAll('{mikan}', 'Mikan')
    .replaceAll('{other}', other)
    .replaceAll('{patch}', bind.patch ? (town.D.board.patch_names[bind.patch] || bind.patch) : '')
    .replaceAll('{title}', cat?.title ?? '')
    .replaceAll('{when}', bind.when ?? '');
}

/** F8 score for a template that matches. */
export function scoreOf(town, cat, tpl, facts) {
  let nMem = 0, nRel = 0, nCtx = 0;
  for (const t of tpl.requires) {
    const f = familyOf(parseTag(t).name);
    if (f === 'memory') nMem++; else if (f === 'relationship') nRel++; else nCtx++;
  }
  const said = (town.s.barks.said[cat.id] || []).includes(tpl.Name) ? 1 : 0;
  const recent = town.s.barks.recent.includes(tpl.Name) ? 1 : 0;
  return { S: 3 * nMem + 2 * nRel + nCtx - 4 * said - 2 * recent, nMem };
}

/**
 * Select and record a line. Returns {template, trigger, text, unskippable_s, n_mem, score, other} or null.
 * Recording (said_to_player, recent, STANDOFF_FIRST retirement) lives in town.s.barks, never on a cat record.
 */
export function selectLine(town, catId, trigger, ctx = {}, { record = true } = {}) {
  const cat = town.s.cats[catId];
  if (!cat) return null;
  const facts = speakerFacts(town, cat, ctx);
  const day = town.s.day;
  const cands = town.D.barks.filter(t => t.trigger === trigger
    && (t.personality === 'any' || t.personality === cat.personality)
    && !(town.s.barks.retired[t.Name] > day)
    && t.requires.every(tag => tagHolds(tag, facts))
    && !t.forbids.some(tag => tagHolds(tag, facts)));
  if (!cands.length) return null;
  const scored = cands.map(t => ({ t, ...scoreOf(town, cat, t, facts) }));
  const top = Math.max(...scored.map(x => x.S));
  // Ties at the top S: a line written for the speaker's personality beats an 'any' floor (ASSUMPTION: F8 is silent;
  // this keeps the GDD's per-personality lines, e.g. Togemaru's farewell, from losing a coin flip to a floor).
  let best = scored.filter(x => x.S === top).sort((a, b) => (a.t.Name < b.t.Name ? -1 : 1));
  if (best.some(x => x.t.personality !== 'any')) best = best.filter(x => x.t.personality !== 'any');
  const r = new Stream(town.seed, `bark:${town.s.serial}:${day}:${catId}:${trigger}`);
  const pick = best.length === 1 ? best[0] : r.pick(best);
  const other = bindOther(town, cat, pick.t, ctx);
  let text = fill(town, pick.t.text, cat, { other, patch: ctx.patch });
  if (text.length > MAX_CHARS) text = fill(town, pick.t.short_text, cat, { other, patch: ctx.patch });
  if (record) {
    const B = town.s.barks;
    (B.said[catId] ||= []).push(pick.t.Name);
    B.recent.push(pick.t.Name); if (B.recent.length > 10) B.recent.shift();
    if (trigger === 'STANDOFF_FIRST') B.retired[pick.t.Name] = day + 20;
  }
  return { cat: catId, template: pick.t.Name, trigger, intent: pick.t.intent, text, n_mem: pick.nMem, score: pick.S, unskippable_s: pick.nMem >= 1 ? 1.0 : 0, other };
}

/** Which Standoff trigger a cat speaks (Nemesis §3.15 Standoff group), from its own record only. */
export function standoffTrigger(town, cat, ctx = {}) {
  if (cat.state === 'Truce' || cat.state === 'Friend') return 'TRUCE_GREET';
  if (cat.challenge && ctx.patch === cat.challenge.patch_id) return 'CHALLENGE_STAKE';
  if (cat.role === 'boss' && cat.anger != null && cat.anger >= town.D.k.anger.stages[1].min) return 'BOSS_POSTS';
  const enc = cat.memory.filter(e => !['FIRST_MEETING', 'OLD_GANG', 'SCAR', 'TITLE', 'ADAPTED', 'PATCH_LOST'].includes(e.kind));
  if (!enc.length) return 'STANDOFF_FIRST';
  if (cat.memory.some(e => e.kind === 'ADAPTED' && e.day === town.s.day - 1)) return 'RETURNED';
  const lastE = enc[enc.length - 1];
  if (lastE.kind === 'WON' || lastE.kind === 'LICK_IN') return 'REMATCH_I_WON';
  if (lastE.kind === 'FLED') return 'REMATCH_I_FLED';
  if (lastE.kind === 'SLIPPED_AWAY') return 'RETURNED';
  return 'REMATCH_I_LOST';
}

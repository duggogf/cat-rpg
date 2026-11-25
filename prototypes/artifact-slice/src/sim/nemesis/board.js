// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Display queries over the town (key-screens §2-§4; Nemesis §3.6, §3.13, §3.17). READ-ONLY: nothing here writes
// a cat (AC 25: hovering changes no saved field). Ties are facts fixed at generation, a challenger's arrival draw,
// or the recruit's own OLD_GANG memory; every history line comes from that cat's own Memory (G8).
import { angerStage, dayLabel } from './formulas.js';
import { lastOf } from './memory.js';

const band = (bands, v) => bands.filter(b => v >= b.min).pop().p;

/** Disposition pose (§3.6 table; first match wins). */
export function pose(town, c) {
  if (!c.discovered) return null;
  if (c.state === 'Crew') return 'crew';
  if (c.state === 'Gone') return 'legend';
  if (c.nemesis && c.arc_role === 'lead') return 'nemesis';
  if (c.state === 'Friend') return 'friend';
  if (c.state === 'Truce') return 'truce';
  if (c.grudge >= town.k.bitter) return 'bitter';
  if (c.regard >= 50 && c.grudge < 50) return 'respectful';
  if (c.grudge >= 40 && c.grudge <= 74) return 'wary';
  return 'indifferent';
}

/** Where a cat is drawn: its scene and its role anchor (or the shade while unmet). Fixed role, never earned. */
export function placement(town, c) {
  const A = town.D.board.anchors;
  if (c.id === 'mikan') return { scene: 'bell', anchor: A.mikan };
  if (c.uphill) return { scene: c.home_scene, anchor: A.uphill_gang, haze: true };
  if (c.state === 'Crew') return { scene: 'bell', anchor: A.crew, old_spot: { scene: c.home_scene, mark: 'knot' } };
  const outsider = ['challenger', 'newcomer', 'turncoat'].includes(c.origin);
  const scene = outsider ? 'outsiders' : c.home_scene;
  if (!c.discovered) return { scene, anchor: c.role === 'boss' ? A.boss : A.undiscovered };
  if (c.state === 'Gone') return { scene, anchor: outsider ? A.outsider : (A[c.role] ?? A.tough), legend: true };
  if (c.role === 'boss') {
    if (c.state === 'Truce' || c.state === 'Friend') return { scene, anchor: A.truce_boss };
    if (town.s.window_open) return { scene, anchor: A.roaming_boss };
    return { scene, anchor: A.boss };
  }
  if (outsider) return { scene, anchor: A.outsider };
  return { scene, anchor: A[c.role] ?? A.tough };
}

/** The marks a cat carries, plus the ≤ 1 drawn at rest by key-screens §2.5 priority. */
export function marks(town, c) {
  if (!c.discovered) return { drawn: null };
  const k = town.k, m = {};
  if (c.nemesis && c.arc_role === 'lead') m.storm = { face: c.face, word: town.D.board.sniff_cards.faces[c.face], large: c.face === 'sworn_enemy' && c.grudge >= k.declaration.storm_large_grudge };
  if (c.anger != null) { const st = angerStage(k, c.anger); m.puffs = st.puffs; m.stage = st.stage; }
  if (c.state === 'Truce') m.sprig = 'truce';
  if (c.state === 'Friend') m.sprig = 'flower';
  if (c.grudge >= k.bitter && !m.storm && c.state !== 'Crew' && c.state !== 'Gone') m.grumble = true;
  if (c.plaster_until_day != null && c.plaster_until_day >= town.s.day) m.plaster = true;
  if (c.nemesis && c.arc_closed_how === 'crew') m.bell = true; // the storm mark became a bell (§3.6)
  const pri = { storm: 'storm', puffs: 'puffs', sprig: 'sprig', grumble: 'grumble', plaster: 'plaster' };
  m.drawn = town.D.board.mark_priority.find(p => (p === 'puffs' ? m.puffs > 0 : !!m[pri[p]])) ?? null;
  return m;
}

/** One own-history line (its latest Memory entry), in its own voice, with the day (key-screens §2.8 item 4). */
export function historyLine(town, c) {
  if (!c.discovered || !c.memory.length) return null;
  const H = town.D.board.history_lines, k = town.k;
  const pick = [...c.memory].reverse().find(x => x.kind !== 'OLD_GANG' && x.kind !== 'FIRST_MEETING') ?? c.memory[c.memory.length - 1];
  const e = pick;
  let key = e.kind;
  if (e.kind === 'ROUTED' && e.own_post) key = 'ROUTED_OWN';
  if (e.kind === 'SCAR') key = `SCAR_${e.scar}`;
  if (e.kind === 'VERDICT') key = `VERDICT_${e.verdict}`;
  const tpl = H[key] ?? H[e.kind];
  if (!tpl) return null;
  const address = k.clout.address[town.s.clout] === '{mikan}' ? 'Mikan' : (k.clout.address[town.s.clout] || 'Collar');
  const line = tpl.replace('{patch}', town.D.board.patch_names[e.patch] ?? e.patch ?? 'the Lane')
    .replace('{other}', town.s.cats[e.other_id]?.display ?? '').replace('{title}', c.title ?? '').replace('{address}', address);
  return { day: dayLabel(k, e.day), kind: e.kind, line };
}

function roleTag(town, c) {
  const RT = town.D.board.role_tags, P = town.k.personalities;
  const word = c.personality ? P[c.personality]?.word : null;
  const district = town.D.board.district_names.hidamari;
  const patch = c.challenge ? town.D.board.patch_names[c.challenge.patch_id] : c.keeper_of ? town.D.board.patch_names[c.keeper_of] : '';
  if (c.id === 'mikan') return town.k.clout.words[town.s.clout];
  const key = c.state === 'Crew' ? 'crew' : c.origin === 'challenger' ? 'challenger' : c.role;
  const tpl = RT[key] ?? '{word}';
  return tpl.replace('{district}', district).replace('{word}', word ?? '').replace('{patch}', patch ?? '').replace('{clout}', '');
}

/** The short name-card (focus) for a cat (key-screens §2.8). */
export function nameCard(town, id) {
  const c = town.s.cats[id];
  if (!c) return null;
  const k = town.k, B = town.D.board;
  if (!c.discovered && c.id !== 'mikan') {
    const outsider = c.origin === 'challenger';
    return { id, silhouette: true, crown: c.role === 'boss' || c.role === 'great_boss', name: null,
      line: outsider ? B.card_text.outsider_not_met.replace('{patch}', B.patch_names[c.challenge?.patch_id] ?? '') : c.uphill ? null : B.card_text.not_met };
  }
  const m = marks(town, c);
  let context = null;
  if (c.anger != null) {
    const st = angerStage(k, c.anger);
    context = town.s.window_open && c.role === 'boss' ? { kind: 'roaming', line: B.card_text.roaming.replace('{stop}', 'his patrol stop'), puffs: st.puffs, stage: st.stage }
      : { kind: 'anger', line: B.card_text.boss_anger, puffs: st.puffs, stage: st.stage, fired: B.card_text.fired[st.stage] };
  } else if (c.state === 'Truce') context = { kind: 'truce', line: B.card_text.truce_days.replace('{n}', String(Math.max(0, c.truce_until_day - town.s.day))) };
  else if (c.state === 'Friend') context = { kind: 'friend', line: B.card_text.friend };
  else if (c.state === 'Gone') context = { kind: 'gone', line: B.card_text.gone };
  else if (c.challenge) context = { kind: 'stake', line: B.card_text.staking.replace('{patch}', B.patch_names[c.challenge.patch_id] ?? ''), pips: [c.challenge.repelled, k.challenger.repels_to_leave] };
  else if (town.s.raid && town.s.raid.attacker_ids.includes(id)) context = { kind: 'raid', line: `Tonight: raids ${B.patch_names[town.s.raid.patch_id] ?? town.s.raid.patch_id}.` };
  else if (c.state === 'Crew' && c.id !== 'mikan') context = { kind: 'crew', line: B.card_text.crew };
  const t = tags(town, id);
  return {
    id, silhouette: false, name: c.display, title: c.title, role_tag: roleTag(town, c), style: c.style, style_icon: B.style_icons[c.style] ?? null,
    personality: c.personality, personality_word: c.personality ? c.personality[0].toUpperCase() + c.personality.slice(1) : null,
    grudge: c.id === 'mikan' || c.state === 'Crew' ? null : band(B.pictograms.grudge, c.grudge),
    regard: c.id === 'mikan' || c.state === 'Crew' ? null : band(B.pictograms.regard, c.regard),
    face: m.storm?.word ?? null, bitter: !!m.grumble, sprig: m.sprig ?? null, puffs: m.puffs ?? null,
    scars: c.scars.map(x => x.type), history: historyLine(town, c), context, ties_overflow: t.overflow,
  };
}

/**
 * Relationship tags on focus (key-screens §2.7; Nemesis §3.17). Only between DISCOVERED cats. Gang/Boss are arrows,
 * not tags. Rival > Kin > Old Boss / Old Gang; ≤ 3 drawn in the focused cat's scene; ties in another scene are one
 * chip under that scene's tab. Read-only.
 */
export function tags(town, focusId) {
  const s = town.s, T = town.D.board.tags;
  const f = s.cats[focusId];
  const empty = { focus: focusId, all: [], in_scene: [], chips: [], overflow: 0 };
  if (!f || !f.discovered || f.uphill) return empty;
  const fScene = placement(town, f).scene;
  const all = [];
  const push = (id, kind) => {
    const o = s.cats[id];
    if (!o || !o.discovered || o.uphill || id === focusId) return;
    if (all.some(t => t.cat === id && t.kind === kind)) return;
    all.push({ cat: id, kind, word: T.words[kind], icon: T.icons[kind], scene: placement(town, o).scene, other_state: o.state, order: o.discovered_order ?? 0 });
  };
  for (const r of f.relations) push(r.other_id, r.kind);
  if (f.state === 'Crew') { const og = lastOf(f, 'OLD_GANG'); if (og) push(og.other_id, 'old_boss'); }
  if (f.role === 'boss') for (const o of Object.values(s.cats)) if (o.state === 'Crew' && o.memory.some(e => e.kind === 'OLD_GANG' && e.other_id === focusId)) push(o.id, 'old_gang');
  const pri = k => T.priority.indexOf(k === 'old_gang' ? 'old_gang' : k);
  all.sort((a, b) => pri(a.kind) - pri(b.kind) || a.order - b.order || (a.cat < b.cat ? -1 : 1));
  const here = all.filter(t => t.scene === fScene);
  const in_scene = here.slice(0, T.max_in_scene);
  const chips = [];
  for (const t of all.filter(x => x.scene !== fScene)) {
    const ch = chips.find(c => c.scene === t.scene);
    if (ch) ch.more++; else chips.push({ scene: t.scene, cat: t.cat, kind: t.kind, word: t.word, icon: t.icon, more: 0 });
  }
  return { focus: focusId, all, in_scene, chips, overflow: Math.max(0, here.length - T.max_in_scene) };
}

/** The full Rival card (key-screens §3.2). */
export function rivalCard(town, id) {
  const c = town.s.cats[id];
  if (!c || !c.discovered) return null;
  const k = town.k, B = town.D.board;
  const nc = nameCard(town, id);
  const pinKinds = new Set(['FIRST_MEETING', 'OLD_GANG', 'SCAR', 'TITLE']);
  const lines = c.memory.map(e => ({ ...historyLine(town, { ...c, memory: [e] }), pinned: pinKinds.has(e.kind) }));
  const ties = tags(town, id).all.map(t => ({ cat: t.cat, kind: t.kind, word: t.word, name: town.s.cats[t.cat].display }));
  const boss = c.home_clowder && c.role !== 'boss' && c.state !== 'Crew' ? Object.values(town.s.cats).find(x => x.role === 'boss' && x.home_clowder === c.home_clowder && x.discovered) : null;
  if (boss) ties.unshift({ cat: boss.id, kind: 'boss', word: 'Boss', name: boss.display });
  let anger = null;
  if (c.anger != null) { const st = angerStage(k, c.anger); anger = { puffs: st.puffs, stage: st.stage, lines: B.card_text.boss_anger_rival_card.map(l => l.replace('{fired}', B.card_text.fired[st.stage])) }; }
  return { ...nc, as_rival: c.personality ? k.personalities[c.personality].as_rival : null, history: [...lines.filter(l => l.pinned), ...lines.filter(l => !l.pinned)],
    ties, fears: c.fears.map(f => (c.fears_known.includes(f) ? f : '?')), strengths: c.strengths.map(() => '?'), anger,
    recruit_gate: c.recruitable_slice && c.grudge < k.verdict.recruit_grudge_lt ? 'open' : 'shut',
    challenger_pips: c.challenge ? [c.challenge.repelled, k.challenger.repels_to_leave] : null, legend: c.state === 'Gone' };
}

/** The whole Rivals board (scenes, cats on role anchors, discovery, marks, cards on demand). */
export function board(town) {
  const s = town.s, B = town.D.board;
  const cats = [];
  const seenTiers = {};
  const ordered = Object.values(s.cats).filter(c => c.state !== 'Offstage').sort((a, b) =>
    (a.discovered === b.discovered ? 0 : a.discovered ? -1 : 1) || (a.discovered_order ?? 1e9) - (b.discovered_order ?? 1e9) || (a.id < b.id ? -1 : 1));
  for (const c of ordered) {
    const pl = placement(town, c);
    const key = `${pl.scene}:${pl.anchor}`;
    const order = (seenTiers[key] = (seenTiers[key] ?? -1) + 1);
    const m = marks(town, c);
    const arrow = c.id === 'mikan' ? null : c.state === 'Crew' ? 'mikan' : (pl.scene !== 'outsiders' && c.role !== 'boss' && !c.uphill && c.discovered)
      ? (Object.values(s.cats).find(x => x.role === 'boss' && x.home_clowder === c.home_clowder)?.id ?? null) : null;
    cats.push({
      id: c.id, scene: pl.scene, anchor: pl.anchor, order, haze: !!pl.haze, discovered: !!c.discovered || c.id === 'mikan',
      name: c.discovered || c.id === 'mikan' ? c.display : null, title: c.discovered ? c.title : null, role: c.role, state: c.state,
      silhouette: !c.discovered && c.id !== 'mikan', crown: !c.discovered && (c.role === 'boss' || c.role === 'great_boss'),
      pose: pose(town, c), marks: m, drawn_mark: m.drawn, scars: c.discovered ? c.scars.map(x => x.type) : [],
      legend: !!pl.legend, old_spot: pl.old_spot ?? null, arrow_to: arrow, tape_star: s.changed[c.id] != null && c.discovered,
      personality: c.discovered ? c.personality : null, style: c.discovered ? c.style : null,
    });
  }
  const scenes = B.scenes.map(sc => {
    const here = cats.filter(c => c.scene === sc.id);
    const perch = sc.kind === 'gang' ? Object.values(s.cats).find(c => c.role === 'boss' && c.home_scene === sc.id) : null;
    return { ...sc, dots: here.filter(c => c.id !== 'mikan').map(c => ({ id: c.id, met: c.discovered })),
      perch: perch ? { cat: perch.id, empty: perch.state !== 'Seated' || s.window_open, mark: perch.state === 'Crew' ? 'knot' : perch.state === 'Gone' ? 'legend' : perch.state === 'Truce' ? 'sprig' : null,
        puffs: perch.discovered && perch.anger != null ? angerStage(town.k, perch.anger).puffs : 0 } : null };
  });
  return { day: s.day, life: s.life, day_label: dayLabel(town.k, s.day), branch: town.branch(), unlocked: s.life >= 2, scenes, cats };
}

/**
 * The shape src/ui/rivals-model.js's fromNemesis() adapter reads (`nem.boardView()`): state 'present'|'crew'|'gone',
 * marks {storm, sprig, puffs}, history {day, line}, ties [{a, b, kind}] between discovered cats.
 */
export function boardView(town) {
  const s = town.s, b = board(town);
  const boss = s.cats.daifuku;
  const cats = b.cats.filter(c => c.id !== 'mikan' || true).map(c => {
    const rec = s.cats[c.id];
    const out = { id: c.id, discovered: c.discovered, state: rec.state === 'Crew' && c.id !== 'mikan' ? 'crew' : rec.state === 'Gone' ? 'gone' : 'present', tapeStar: c.tape_star,
      scene: c.scene, anchor: c.anchor, pose: c.pose, scars: c.scars, marks: {} };
    if (c.marks.storm) out.marks.storm = c.marks.storm.word;
    if (c.marks.sprig) out.marks.sprig = true;
    if (c.marks.puffs != null) out.marks.puffs = c.marks.puffs;
    const h = historyLine(town, rec);
    if (h) out.history = { day: h.day, line: h.line };
    if (c.discovered && c.id !== 'mikan') out.card = nameCard(town, c.id);
    return out;
  });
  const ties = [];
  for (const c of Object.values(s.cats)) {
    for (const r of c.relations) if (c.id < r.other_id) ties.push({ a: c.id, b: r.other_id, kind: r.kind });
    const og = c.state === 'Crew' ? lastOf(c, 'OLD_GANG') : null;
    if (og) ties.push({ a: c.id, b: og.other_id, kind: 'old_boss' });
  }
  const discovered = Object.fromEntries(Object.values(s.cats).map(c => [c.id, !!c.discovered || c.id === 'mikan']));
  return { branch: b.branch, day: s.day, life: s.life, anger: boss && boss.anger != null ? angerStage(town.k, boss.anger).puffs : 0, discovered, cats, ties };
}

/**
 * The Morning Sniff's nemesis items (§3.13): ≤ 3 (Life 1 day 2: exactly 1), one priority order, plus the forecast.
 * consume=true removes the shown queued items (call once when the Doorstep plays it).
 */
export function sniff(town, { consume = false } = {}) {
  const s = town.s, k = town.k, B = town.D.board, SC = B.sniff_cards;
  if (s.day <= 1) return { items: [], forecast: null };
  const pool = s.sniff_queue.map((q, i) => ({ ...q, _i: i }));
  // district card: anger at Seething or Furious (a computed card, not queued)
  const boss = Object.values(s.cats).find(c => c.role === 'boss' && c.anger != null && c.home_scene === 'lane');
  if (boss && angerStage(k, boss.anger) && k.anger.stages.findIndex(x => x.stage === angerStage(k, boss.anger).stage) >= k.anger.stages.findIndex(x => x.stage === k.sniff.anger_min_stage))
    pool.push({ kind: 'anger', cat: boss.id });
  // the arc lead's fresh mark over his own post (L1D2's single item, §3.8.1)
  const lead = Object.values(s.cats).find(c => c.arc_role === 'lead');
  if (lead && lead.keeper_of && (lead.state === 'Seated') && s.life === 1) pool.push({ kind: 'arc_lead', cat: lead.id, patch: lead.keeper_of });
  const pri = kind => { const i = k.sniff.priority.indexOf(kind === 'truce_end' ? 'other' : kind); return i < 0 ? 99 : i; };
  pool.sort((a, b) => pri(a.kind) - pri(b.kind) || (a._i ?? 99) - (b._i ?? 99));
  const max = s.life === 1 ? k.sniff.life1_items : k.sniff.max_items;
  const shown = pool.slice(0, max);
  const items = shown.map(q => {
    const c = s.cats[q.cat], known = c?.discovered;
    const name = known ? c.display : null;
    const patchName = B.patch_names[q.patch] ?? q.patch;
    switch (q.kind) {
      case 'declaration': return { kind: q.kind, cat: q.cat, title: SC.faces[c.face], face: c.face, line: SC.declaration.line.replace('{name}', c.display),
        storm: true, scars: c.scars.map(x => x.type), cat_title: c.title, best_line: bestLine(town, c), sprig: c.state === 'Truce' };
      case 'arc_closing': return { kind: q.kind, cat: q.cat, how: q.how, title: (q.how === 'crew' ? SC.arc_closing_crew : SC.arc_closing_gone).title,
        line: (q.how === 'crew' ? SC.arc_closing_crew : SC.arc_closing_gone).line.replace('{name}', c.display), scars: c.scars.map(x => x.type) };
      case 'challenger': return { kind: q.kind, cat: q.cat, silhouette: !known, name, title: SC.challenger.title, line: SC.challenger.line.replace('{patch}', patchName), patch: q.patch, tape_star: true };
      case 'boss_window': return { kind: q.kind, cat: q.cat, title: SC.boss_window.title, line: SC.boss_window.line.replace('{name}', name ?? 'The big wall'), silhouette: !known };
      case 'anger': { const st = angerStage(k, c.anger); return { kind: q.kind, cat: q.cat, title: SC.anger.title, line: SC.anger.line, puffs: st.puffs, stage: st.stage, silhouette: !known }; }
      case 'arc_lead': return { kind: q.kind, cat: q.cat, title: SC.arc_lead.title, line: SC.arc_lead.line.replace('{name}', c.display), patch: q.patch };
      default: return { kind: q.kind, cat: q.cat, title: q.kind === 'truce_end' ? `${c.display}'s truce is over.` : q.kind, line: '' };
    }
  });
  if (consume) {
    const drop = new Set(shown.filter(q => q._i != null).map(q => q._i));
    s.sniff_queue = s.sniff_queue.filter((_, i) => !drop.has(i));
  }
  const r = s.raid;
  const forecast = r ? { motive: r.motive, patch: r.patch_id, patch_name: B.patch_names[r.patch_id] ?? r.patch_id,
    attackers: r.attacker_ids.map(id => ({ id, silhouette: !s.cats[id]?.discovered, name: s.cats[id]?.discovered ? s.cats[id].display : null })) } : null;
  return { items, forecast };
}

/** The Declaration card's "best memory line": its highest-weight own Memory line (a Scar, else the latest). */
function bestLine(town, c) {
  const scar = [...c.memory].reverse().find(e => e.kind === 'SCAR');
  return historyLine(town, { ...c, memory: [scar ?? c.memory[c.memory.length - 1]] });
}

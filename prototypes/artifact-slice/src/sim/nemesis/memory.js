// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Per-cat Memory (Nemesis §3.7): <= 10 entries, <= 6 pinned, eviction of the oldest unpinned, consecutive repeats
// of the same kind and patch collapse into one entry with count + 1. Every function reads and writes ONE cat.

export const ENCOUNTER_KINDS = new Set(['ROUTED', 'FLED', 'WON', 'LICK_IN', 'PLAYER_FLED', 'SLIPPED_AWAY', 'AMBUSHED_BY_PLAYER',
  'AMBUSHED_PLAYER', 'JOINED_IN', 'VERDICT', 'GREETED', 'MET']);

/** A blank entry with the §3.7 fields. */
export function entry(day, kind, f = {}) {
  return { day, kind, patch: f.patch ?? null, opener: f.opener ?? null, finisher_move: f.finisher_move ?? null,
    damage_type: f.damage_type ?? null, fear: f.fear ?? null, verdict: f.verdict ?? null, by_pile_on: !!f.by_pile_on,
    count: 1, other_id: f.other_id ?? null, own_post: !!f.own_post, scar: f.scar ?? null, title: f.title ?? null, serial: f.serial ?? null };
}

/** Pinned: FIRST_MEETING, OLD_GANG, each SCAR and TITLE source, and the latest encounter entry. */
export function pinnedIdx(mem) {
  const pins = new Set();
  mem.forEach((e, i) => { if (['FIRST_MEETING', 'OLD_GANG', 'SCAR', 'TITLE'].includes(e.kind)) pins.add(i); });
  for (let i = mem.length - 1; i >= 0; i--) if (ENCOUNTER_KINDS.has(mem[i].kind)) { pins.add(i); break; }
  return pins;
}

/**
 * Append to one cat's own Memory (`cat.memory`), applying collapse and eviction.
 * @param k rivals constants (k.memory.max)
 */
export function remember(k, cat, e) {
  const mem = cat.memory;
  const last = mem[mem.length - 1];
  const collapsible = !['FIRST_MEETING', 'OLD_GANG', 'SCAR', 'TITLE', 'VERDICT'].includes(e.kind);
  if (collapsible && last && last.kind === e.kind && last.patch === e.patch && last.serial !== e.serial && e.day - last.day <= 1 && last.day !== e.day) {
    last.count += 1; last.day = e.day; last.serial = e.serial;
    for (const f of ['opener', 'finisher_move', 'damage_type', 'fear', 'by_pile_on', 'own_post']) if (e[f]) last[f] = e[f];
    return last;
  }
  mem.push(e);
  while (mem.length > k.memory.max) {
    const pins = pinnedIdx(mem);
    const i = mem.findIndex((_, j) => !pins.has(j));
    if (i < 0) break;
    mem.splice(i, 1);
  }
  return e;
}

export const hasKind = (cat, kind) => cat.memory.some(e => e.kind === kind);
export const lastOf = (cat, kind) => [...cat.memory].reverse().find(e => e.kind === kind) ?? null;

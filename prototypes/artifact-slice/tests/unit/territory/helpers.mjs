// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Factory helpers for the territory tests: build a district with a given Scent vector.
import { createDistrict, TDATA } from '../../../src/sim/territory/index.js';

/**
 * A Life 2 district (day 5 by default) whose Patches are set from `patches`: {LWC: 80} means Mikan holds it
 * at 80; {PA: ['wall_sitters', 80, 'pa_tough']} sets a rival owner, Scent and Keeper. The challenger calendar is
 * off unless `calendar: true` (so decay fixtures are not over-marked by a challenger that arrives mid-test).
 */
export function districtWith(patches, { day = 5, seed = 1, showcase = false, calendar = false } = {}) {
  const t = createDistrict({ seed, showcase });
  t.s.day = day;
  if (!calendar) t.s.calendar.first_night = Infinity;
  for (const [id, v] of Object.entries(patches)) {
    const p = t.s.patches[id];
    if (Array.isArray(v)) Object.assign(p, { owner: v[0], scent: v[1], keeper: v[2] ?? null });
    else Object.assign(p, { owner: 'bell', keeper: 'mikan', scent: v });
  }
  t.s.influence = t._influenceAll();
  return t;
}

export const types = evs => evs.map(e => e.type);
export const ofType = (evs, type) => evs.filter(e => e.type === type);
export const K = TDATA.k;

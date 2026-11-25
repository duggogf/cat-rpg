// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Factories for the nemesis tests.
import { createTown, ARC, Town, NDATA } from '../../../src/sim/nemesis/index.js';

export { createTown, ARC, Town, NDATA };
export const K = NDATA.k;
export const ofType = (evs, type) => evs.filter(e => e.type === type);
export const mark = (patch, kind, target_clowder = 'wall_sitters') => ({ type: 'MarkApplied', district: 'hidamari', patch, post: null, by: 'mikan', kind, target_clowder });

/** A town played to the L1D2 Verdict offer (the reference path), optionally with an Ambush opener. */
export function atL1D2Verdict({ seed = 1, ambush = false, counterSprays = 1 } = {}) {
  const t = createTown({ seed });
  ARC.l1d1(t); ARC.night(t, 1); ARC.l1d2(t, { ambush, counterSprays });
  return t;
}

/** Every cat's hash except the listed subjects. */
export function othersHash(t, subjects) {
  const h = t.catHashes();
  for (const id of subjects) delete h[id];
  return h;
}

/** Put a cat into a Life 2 contest state quickly: day 3+, the cat Seated and discovered. */
export function lifeTwo(t, day = 5) {
  while (t.day < day) ARC.night(t, t.day);
  return t;
}

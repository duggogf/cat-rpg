// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// A REFERENCE consumer of MarkApplied for Boss anger (Nemesis F10 / OR-07), used by the territory tests and
// tools/territory-run.mjs until M3's nemesis module owns anger. It reads ONLY MarkApplied events (acts on
// objects) on the Boss's own Clowder in his district, never a fight, a Verdict or influence (patent G2, A-9).

/**
 * @param {object} D a buildTerritoryData() bundle (reads D.anger)
 * @param {object} who {boss:'daifuku', clowder:'wall_sitters', district:'hidamari', anger:0}
 */
export function createAngerReference(D, { boss = 'daifuku', clowder = 'wall_sitters', district = 'hidamari', anger = 0 } = {}) {
  const A = D.anger;
  let value = anger, verdicted = false;
  const stage = v => A.stages.filter(s => v >= s.min).pop().stage;
  return {
    boss,
    get value() { return value; },
    get stage() { return stage(value); },
    /** Feed any event; returns AngerChanged on a stage change. Only MarkApplied can move it. */
    onEvent(e) {
      if (verdicted || e.type !== 'MarkApplied' || e.district !== district || e.target_clowder !== clowder) return [];
      if (A.never_sources.includes(e.kind)) return [];
      const add = A[e.kind] || 0;
      const before = stage(value);
      value = Math.min(A.max, value + add);
      return stage(value) !== before ? [{ type: 'AngerChanged', boss, stage: stage(value) }] : [];
    },
    /** Nemesis step 3e: −15 a night. */
    night() { const before = stage(value); value = Math.max(0, value - A.nightly_decay); return stage(value) !== before ? [{ type: 'AngerChanged', boss, stage: stage(value) }] : []; },
    /** EncounterEnded with the Boss in it: spent on win, loss or rival_fled; not on Scram. */
    encounterEnded({ outcome, participants = [] }) { if (participants.includes(boss) && A.spent_on.includes(outcome)) value = 0; },
    verdict() { verdicted = true; value = 0; },
  };
}

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Loads the combat tables (src/data/combat/*.json, rows keyed by Name) and indexes them.
// The JSON is the only source of tuning: code reads `D.k.<constant>` and `D.moves.<id>` etc.
import constants from '../../data/combat/combat_constants.json' with { type: 'json' };
import styles from '../../data/combat/styles.json' with { type: 'json' };
import ranks from '../../data/combat/ranks.json' with { type: 'json' };
import moves from '../../data/combat/moves.json' with { type: 'json' };
import personalities from '../../data/combat/personalities.json' with { type: 'json' };
import combatants from '../../data/combat/combatants.json' with { type: 'json' };
import bosses from '../../data/combat/bosses.json' with { type: 'json' };
import tiers from '../../data/combat/tiers.json' with { type: 'json' };
import safety from '../../data/combat/safety.json' with { type: 'json' };
import arenas from '../../data/combat/arenas.json' with { type: 'json' };
import encounters from '../../data/combat/encounters.json' with { type: 'json' };
import showcase from '../../data/combat/showcase_overrides.json' with { type: 'json' };

const byName = rows => Object.fromEntries(rows.filter(r => !r.Name.startsWith('_')).map(r => [r.Name, r]));
const valuesByName = rows => Object.fromEntries(rows.filter(r => !r.Name.startsWith('_')).map(r => [r.Name, r.value]));

/** Raw tables exactly as on disk (for tests and tools). */
export const RAW = { constants, styles, ranks, moves, personalities, combatants, bosses, tiers, safety, arenas, encounters, showcase };

/** Build the indexed data bundle. `overrides` (optional) is merged over the constants, for tuning in tests. */
export function buildData(overrides = {}) {
  return {
    k: { ...valuesByName(constants), ...overrides },
    styles: byName(styles), ranks: byName(ranks), moves: byName(moves), personalities: byName(personalities),
    cats: byName(combatants), bosses: byName(bosses), tiers: tiers.slice().sort((a, b) => a.tier - b.tier),
    safety: valuesByName(safety), arenas: byName(arenas), encounters: byName(encounters), showcase: valuesByName(showcase),
  };
}

export const DATA = buildData();

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Loads the territory tables (src/data/territory/*.json, rows keyed by Name, each citing `_src`).
// The JSON is the only source of tuning: code reads `D.k.<constant>`, `D.patches.<id>` etc.
import constants from '../../data/territory/territory_constants.json' with { type: 'json' };
import district from '../../data/territory/district.json' with { type: 'json' };
import clowders from '../../data/territory/clowders.json' with { type: 'json' };
import patches from '../../data/territory/patches.json' with { type: 'json' };
import patrol from '../../data/territory/boss_patrol.json' with { type: 'json' };
import anger from '../../data/territory/anger_reference.json' with { type: 'json' };
import showcase from '../../data/territory/showcase_overrides.json' with { type: 'json' };

const rows = t => t.filter(r => !r.Name.startsWith('_'));
const byName = t => Object.fromEntries(rows(t).map(r => [r.Name, r]));
const valuesByName = t => Object.fromEntries(rows(t).map(r => [r.Name, r.value]));

/** Raw tables exactly as on disk (for tests and tools). */
export const RAW = { constants, district, clowders, patches, patrol, anger, showcase };

/** Build the indexed bundle. `overrides` (optional) is merged over the constants, for tuning in tests. */
export function buildTerritoryData(overrides = {}) {
  return {
    k: { ...valuesByName(constants), ...overrides },
    districts: byName(district),
    clowders: byName(clowders),
    patches: byName(patches),
    patrol: byName(patrol),
    anger: valuesByName(anger),
    showcase: valuesByName(showcase),
  };
}

export const TDATA = buildTerritoryData();

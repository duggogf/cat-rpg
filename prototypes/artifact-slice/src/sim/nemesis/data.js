// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Loads the nemesis tables (src/data/nemesis/*.json, rows keyed by Name, each citing `_src`).
// Reads territory's patches.json (neighbours, display names) and combat's combatants.json (Styles, for the
// finisher's damage type) read-only: their files are never edited from here.
import cats from '../../data/nemesis/cats.json' with { type: 'json' };
import relations from '../../data/nemesis/relations.json' with { type: 'json' };
import rivals from '../../data/nemesis/rivals.json' with { type: 'json' };
import barks from '../../data/nemesis/barks.json' with { type: 'json' };
import board from '../../data/nemesis/board.json' with { type: 'json' };
import showcase from '../../data/nemesis/showcase_overrides.json' with { type: 'json' };
import patches from '../../data/territory/patches.json' with { type: 'json' };
import combatants from '../../data/combat/combatants.json' with { type: 'json' };

const rows = t => t.filter(r => !r.Name.startsWith('_'));
const byName = t => Object.fromEntries(rows(t).map(r => [r.Name, r]));
const valuesByName = t => Object.fromEntries(rows(t).map(r => [r.Name, r.value]));

export const RAW = { cats, relations, rivals, barks, board, showcase };

/** Build the indexed bundle. `overrides` is merged over rivals.json constants (tests, tuning). */
export function buildNemesisData(overrides = {}) {
  const k = { ...valuesByName(rivals), ...overrides };
  const catRows = byName(cats);
  const territoryAlias = {};
  for (const c of Object.values(catRows)) if (c.territory_id) territoryAlias[c.territory_id] = c.Name;
  return {
    k,
    cats: catRows,
    relations: rows(relations),
    barks: rows(barks),
    board: valuesByName(board),
    showcase: valuesByName(showcase),
    patches: byName(patches),
    combatStyle: Object.fromEntries(rows(combatants).map(r => [r.Name, r.style])),
    combatAlias: k.combat_ids || {},
    territoryAlias,
  };
}

export const NDATA = buildNemesisData();

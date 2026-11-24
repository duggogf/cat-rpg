// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Public API of the territory simulation for the presentation layer and the director. See API.md.
import { TDATA, buildTerritoryData, RAW } from './data.js';
import { District } from './district.js';
import { createAngerReference } from './anger-reference.js';

export { TDATA, buildTerritoryData, RAW, District, createAngerReference };

/**
 * Create a district state from data and a seed.
 * @param {object} [opts] {seed, district:'hidamari', start:'l1d1'|'showcase_l2d2', showcase:bool, data}
 * @returns {District}
 */
export function createDistrict(opts = {}) {
  return new District(opts.data || TDATA, opts);
}

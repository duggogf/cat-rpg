// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Public API of the combat simulation for the presentation layer. See API.md.
import { DATA, buildData, RAW } from './data.js';
import { Encounter } from './encounter.js';
import { sampleShake, BASE_TIER } from './feel.js';
import * as formulas from './formulas.js';

export { DATA, buildData, RAW, Encounter, sampleShake, BASE_TIER, formulas };

/**
 * Create an encounter.
 * @param {string|object} def an encounters.json Name (e.g. 'sandbox', 'daifuku_bout') or an inline row
 * @param {object} [opts] {seed, showcase, difficulty:'Kitten'|'Alley'|'Feral', reduceFlashes, motionScale,
 *   anger:{daifuku:'Riled'}, controlled:'hige', data (a buildData() bundle)}
 * @returns {Encounter} call `step(input)` once per 1/60 s; read `snapshot()`; `hash()`
 */
export function createEncounter(def, opts = {}) {
  const D = opts.data || DATA;
  const row = typeof def === 'string' ? D.encounters[def] : def;
  if (!row) throw new Error(`unknown encounter ${def}`);
  return new Encounter(D, row, opts);
}

/** Run an encounter with a per-tick input function until it ends or maxTicks. Returns {enc, events}. */
export function run(enc, inputFn = () => ({}), maxTicks = 60 * 600) {
  const events = [];
  for (let i = 0; i < maxTicks && enc.mode !== 'ended'; i++) {
    const evs = enc.step(inputFn(enc, i) || {});
    for (const e of evs) events.push(e);
  }
  return { enc, events };
}

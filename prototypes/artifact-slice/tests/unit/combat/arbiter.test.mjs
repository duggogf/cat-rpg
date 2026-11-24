// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Feel tiers and the DR-50 safety arbiter (Combat §3.17).
import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA, Encounter, sampleShake } from '../../../src/sim/combat/index.js';
import { Arbiter } from '../../../src/sim/combat/feel.js';

const flood = (arb, req, every, seconds) => {
  const out = [];
  for (let t = 0; t < seconds; t += every) out.push([t, arb.filter({ ...req }, +t.toFixed(6))]);
  return out;
};
const maxInWindow = (times, w) => { let m = 0; for (const t of times) m = Math.max(m, times.filter(u => u >= t && u < t + w - 1e-9).length); return m; };

test('a flood of player T4 hits gives at most 1 full-screen frame per second and 6 per 5 s', () => {
  // Arrange
  const arb = new Arbiter(DATA);
  // Act: a Frazzling hit every 100 ms for 10 s
  const out = flood(arb, { tier: 4, authored: 'player', victim: 'enemy', kind: 'frazzling' }, 0.1, 10);
  // Assert
  const fs = out.filter(([, f]) => f.impact === 'fullscreen').map(([t, f]) => t + f.delay_ms / 1000);
  assert.ok(fs.length > 0);
  assert.ok(maxInWindow(fs, 1) <= 1, 'full-screen per 1 s');
  assert.ok(maxInWindow(fs, 5) <= 6, 'flashes per 5 s');
  assert.ok(out.filter(([, f]) => f.impact === 'local_disc').length > 0, 'excess downgrades to local');
});

test('global hit-stop outside T5 never exceeds 200 ms in any rolling second, and T5 is exempt', () => {
  const arb = new Arbiter(DATA);
  const out = flood(arb, { tier: 4, authored: 'player', victim: 'enemy', kind: 'move2' }, 0.05, 6);
  const g = out.filter(([, f]) => f.hitstop.scope === 'global').map(([t, f]) => [t, f.hitstop.ms]);
  for (const [t] of g) assert.ok(g.filter(([u]) => u > t - 1 + 1e-9 && u <= t).reduce((s, [, ms]) => s + ms, 0) <= 200);
  assert.ok(out.some(([, f]) => f.hitstop.dropped_ms > 0), 'excess is dropped');
  const t5 = arb.filter({ tier: 5, authored: 'player', victim: 'enemy', kind: 'pile_on', authoredT5: true }, 6.0);
  assert.equal(t5.hitstop.scope, 'global'); assert.equal(t5.hitstop.ms, 230);
});

test('an AI cat acting on its own renders one tier lower with no global hit-stop, full-screen or lettering', () => {
  const arb = new Arbiter(DATA);
  const f = arb.filter({ tier: 5, authored: 'ai', victim: 'enemy', kind: 'leader_rout' }, 0);
  assert.equal(f.tier, 4);
  assert.notEqual(f.hitstop.scope, 'global');
  assert.notEqual(f.impact, 'fullscreen');
  assert.equal(f.word, null);
});

test('an incoming hit on the controlled cat gets local hit-stop at 75% and an Ink edge pulse, never an impact frame', () => {
  const arb = new Arbiter(DATA);
  const f = arb.filter({ tier: 4, authored: 'enemy', victim: 'controlled', kind: 'enemy_red' }, 0);
  assert.equal(f.hitstop.scope, 'local'); assert.equal(f.hitstop.ms, 135);
  assert.equal(f.impact, 'none'); assert.equal(f.edge_pulse.colour, 'ink');
});

test('a hit on an AI cat renders two tiers lower with no shake', () => {
  const f = new Arbiter(DATA).filter({ tier: 3, authored: 'enemy', victim: 'ai_cat', kind: 'enemy_yellow' }, 0);
  assert.equal(f.tier, 1); assert.equal(f.shake, null);
});

test('lettering appears only on player T4/T5 and only one word is on screen at a time', () => {
  const arb = new Arbiter(DATA);
  assert.equal(arb.filter({ tier: 3, authored: 'player', victim: 'enemy', kind: 'move1' }, 0).word, null);
  const w1 = arb.filter({ tier: 4, authored: 'player', victim: 'enemy', kind: 'frazzling' }, 1);
  const w2 = arb.filter({ tier: 4, authored: 'player', victim: 'enemy', kind: 'move2', hitType: 'thump' }, 1.2);
  const w3 = arb.filter({ tier: 4, authored: 'player', victim: 'enemy', kind: 'move2', hitType: 'thump' }, 1.6);
  assert.equal(w1.word.cls, 'pop'); assert.equal(w2.word, null); assert.equal(w3.word.cls, 'thud');
});

test('a Tough Rout gets a full-screen frame only if none played in the last second', () => {
  const arb = new Arbiter(DATA);
  arb.filter({ tier: 4, authored: 'player', victim: 'enemy', kind: 'frazzling' }, 0);
  const r1 = arb.filter({ tier: 4, authored: 'player', victim: 'enemy', kind: 'tough_rout' }, 0.5);
  const r2 = arb.filter({ tier: 4, authored: 'player', victim: 'enemy', kind: 'tough_rout' }, 2.0);
  assert.equal(r1.impact, 'local_disc'); assert.equal(r2.impact, 'fullscreen');
});

test('Reduce Flashes turns impact frames into a line hold and logs no flashes', () => {
  const arb = new Arbiter(DATA, { reduceFlashes: true });
  const f = arb.filter({ tier: 5, authored: 'player', victim: 'enemy', kind: 'pile_on', authoredT5: true }, 0);
  assert.equal(f.impact, 'line_hold'); assert.equal(arb.flashLog.length, 0);
});

test('summed shake patterns clamp at 1.8% of viewport height', () => {
  const p = { start: 0, peak_pct: 1.6, steps: 7, step_ms: 33, decay: 0.6 };
  assert.equal(sampleShake([p, { ...p }, { ...p }], 0.001), 1.8);
  assert.equal(sampleShake([p], 1.0), 0);
});

test('a skilled sandbox fight respects every arbiter cap in its filtered event stream', async () => {
  // Arrange
  const { skilledBot, withCommandQueue } = await import('../../smoke/combat/bots.mjs');
  for (const seed of [1, 2, 3]) {
    const enc = new Encounter(DATA, DATA.encounters.sandbox, { seed, showcase: true });
    const bot = withCommandQueue(skilledBot());
    const feels = [];
    // Act
    for (let i = 0; i < 60 * 90 && enc.mode !== 'ended'; i++) for (const e of enc.step(bot(enc, i))) if (e.feel) feels.push([e.t + e.feel.delay_ms / 1000, e.feel, e]);
    // Assert
    const fs = feels.filter(([, f]) => f.impact === 'fullscreen').map(([t]) => t);
    assert.ok(maxInWindow(fs, 1) <= 1 && maxInWindow(fs, 5) <= 6, `seed ${seed} flashes`);
    const g = feels.filter(([, f, e]) => f.hitstop.scope === 'global' && f.tier < 5).map(([t, f]) => [t, f.hitstop.ms]);
    for (const [t] of g) assert.ok(g.filter(([u]) => u > t - 1 + 1e-9 && u <= t).reduce((s, [, ms]) => s + ms, 0) <= 200, `seed ${seed} hit-stop`);
    const words = feels.filter(([, f]) => f.word);
    for (const [, f, e] of words) assert.ok(f.tier >= 4 && e.type !== 'Whiff');
  }
});

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Combat F1-F7 and F11 worked examples (design/gdd/combat-system.md §4) plus Crew F1.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DATA, formulas as F } from '../../../src/sim/combat/index.js';

const D = DATA, k = D.k;
const near = (a, b, eps, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg ?? ''} expected ${b} ± ${eps}, got ${a}`);

test('Crew F1 Hige Lv 5 Bruiser worked example gives Nerve 381 Bite 22 Hide 28 Voice 17 Zip 16', () => {
  // Arrange
  const row = { style: 'Bruiser', rank: 'posse', level: 5 };
  // Act
  const s = F.statsFor(row, D);
  // Assert
  assert.deepEqual([s.nerve, s.bite, s.hide, s.voice, s.zip], [381, 22, 28, 17, 16]);
});

test('F1 unrounded B(L) / N_ref(L) is 0.045 at every level 1-10', () => {
  for (let L = 1; L <= 10; L++) near(F.baseHit(L, k) / F.nRef(L, k), 0.045, 1e-12, `L${L}`);
});

test('F1 Mikan Lv 8 string hit 1 deals 19 / 21 / 30 to a Bruiser / Scrapper / Yowler Tough', () => {
  // Arrange: Mikan Scrapper Lv 8 (Bite 38), Toughs at Lv 8 with Crew stats.
  const mikan = F.statsFor({ style: 'Scrapper', rank: 'posse', level: 8 }, D);
  const cases = [['Bruiser', 19], ['Scrapper', 21], ['Yowler', 30]];
  for (const [style, want] of cases) {
    const def = F.statsFor({ style, rank: 'tough', level: 8 }, D);
    // Act
    const r = F.damage({ mv: 1.0, La: 8, off: mikan.bite, Ld: 8, hide: def.hide, type: F.typeMult('claw', D.styles[style], k), rank: 1 }, k);
    // Assert
    assert.equal(r.dmg, want, `${style}`);
  }
  assert.equal(mikan.bite, 38);
  assert.equal(F.statsFor({ style: 'Bruiser', rank: 'tough', level: 8 }, D).nerve, 569);
});

test('F1 amplifier of an Ambush on a Yowler by a Fired Up cat clamps 2.25 to 1.6', () => {
  const r = F.damage({ mv: 1, La: 8, off: F.sRef(8, k), Ld: 8, hide: F.sRef(8, k), type: 1.2, status: 1.25, ambush: 1.5 }, k);
  near(1.5 * 1.2 * 1.25, 2.25, 1e-12);
  assert.equal(r.A, 1.6);
});

test('F1 guard stacking 0.3 x 0.7 x 0.85 floors at 0.30 (edge 16)', () => {
  const r = F.damage({ mv: 1, La: 8, off: 31.7, Ld: 8, hide: 31.7, guard: [0.3, 0.7, 0.85] }, k);
  assert.equal(r.G, 0.3);
});

test('F2 a full string gives a Tough 30 FZ and a Captain 6 FZ, doubled while Ruffled', () => {
  const s = k.string_fz.reduce((a, b) => a + b, 0);
  assert.equal(F.frazzleGain({ fz: s, rRank: 1.0 }, k), 30);
  near(F.frazzleGain({ fz: s, rRank: 0.2 }, k), 6, 1e-9);
  near(F.frazzleGain({ fz: s, rRank: 0.2, ruffled: true }, k), 12, 1e-9);
  near(F.frazzleGain({ fz: 10, rRank: 1, weak: true, oldScore: 1.25, flat: 20 }, k), 10 * 1.2 * 1.25 + 20, 1e-9);
});

test('F3 controlled cat fills 9.1 points/s and an AI cat 3.4 points/s', () => {
  // The worked example's 1.8 s string (M1.1 slows the crew cycle to 2.2 s; the formula is unchanged).
  near(F.pawRate(0.65, 1.0, k, 1.8), 9.1, 0.06);
  near(F.pawRate(0.35, k.ai_fill, k, 1.8), 3.4, 0.06);
});

test('F4 Purr heals 13.5% of neutral Nerve, 20.3% with a Cowed enemy, 15.6% of a Bruiser bar', () => {
  const L = 8, v = F.sRef(L, k);
  const h = F.heal(3.0, L, v, false, k), hc = F.heal(3.0, L, v, true, k);
  near(h / F.nRef(L, k), 0.135, 1e-9);
  near(hc / F.nRef(L, k), 0.2025, 1e-9);
  near(hc / (F.nRef(L, k) * 1.3), 0.156, 0.001);
});

test('F5 Team finisher (formerly Full Pile-On) decision worked example gives 48 / 34.3 / 55.1 MV', () => {
  // (a) cash in at once, 4 cats
  const a = F.windowValue({ cats: 4, wait: 0, basicsRate: 2.48 }, k);
  // (b) no Paws, wait to the end of the 6 s window
  const b = F.windowValue({ cats: 4, wait: 6, basicsRate: 2.48 }, k);
  // (c) 2 Paws banked, 1.5 s spent dumping them, then cash in at T_rem 4.5
  const c = F.windowValue({ cats: 4, wait: 1.5, basicsRate: 2.48, paws: 2, moveMV: 3.5 }, k);
  assert.equal(+a.total.toFixed(1), 48.0);
  assert.equal(+b.total.toFixed(1), 34.3);
  assert.equal(+c.total.toFixed(1), 55.1);
  assert.ok(c.total > a.total && a.total > b.total);
  near(F.pileOnMV([1, 1, 1, 1], 6, k), 48, 1e-9);
});

test('F5 a Full Pile-On is worth more at T_rem 6 than at 0, and pips run 5 to 0', () => {
  assert.ok(F.pileOnMV([1, 1, 1, 1], 6, k) > F.pileOnMV([1, 1, 1, 1], 0, k));
  assert.deepEqual([6, 4.8, 3.6, 2.4, 1.2, 0.5, 0].map(t => F.pips(t, k)), [5, 4, 3, 2, 1, 1, 0]);
});

test('F7 High Road Pounce caps at MV 3.0 / FZ 45 and pays x0.6 with no Paw within 1.5 s of mantling', () => {
  const full = F.pounce(5, 10, k), early = F.pounce(1, 1, k);
  assert.deepEqual([full.mv, full.fz, full.noPaw], [3.0, 45, false]);
  near(early.mv, 2.0 * 0.6, 1e-9); assert.equal(early.noPaw, true);
});

test('F11 Fired Up seconds by anger stage are 0 / 20 / 40 / the whole fight', () => {
  assert.deepEqual(['Calm', 'Riled', 'Seething', 'Furious'].map(s => F.angerFiredUpSeconds(s, k)), [0, 20, 40, Infinity]);
});

test('F11 Old Gang Nerves: 20 s (Fraidy 30 s), only on a susceptible recruit below Sworn facing its Old Boss', () => {
  assert.equal(F.nervesSeconds('Schemer', k), 20);
  assert.equal(F.nervesSeconds('Fraidy', k), 30);
  assert.equal(F.nervesApply(D.cats.kagi, ['daifuku'], D), true);
  assert.equal(F.nervesApply({ ...D.cats.kagi, loyalty: 80 }, ['daifuku'], D), false);
  assert.equal(F.nervesApply(D.cats.kagi, ['goma'], D), false);
  assert.equal(F.nervesApply({ ...D.cats.hige, old_gang_nerves: true }, ['daifuku'], D), false, 'Stalwart resists');
});

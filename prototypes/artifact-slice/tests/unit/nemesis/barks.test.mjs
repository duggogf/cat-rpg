// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Bark lint (Nemesis AC 24, the slice subset) and F8 selection: own-history only (G8).
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTag, familyOf, SLOT_MAX, MAX_CHARS } from '../../../src/sim/nemesis/barks.js';
import { NDATA, createTown, ARC } from './helpers.mjs';

const T = NDATA.barks;
const atMax = s => s.replace(/\{(\w+)\}/g, (_, n) => 'x'.repeat(SLOT_MAX[n] ?? 99));
const BANNED = /\b(haru|gran|human|owner|girl|woman|grandma)\b/i;

test('Every tag is a §3.15 tag; memory-family tags are self-scoped', () => {
  for (const t of T) for (const tag of [...t.requires, ...t.forbids]) {
    const p = parseTag(tag);
    assert.ok(p && familyOf(p.name), `${t.Name}: unknown tag ${tag}`);
    if (familyOf(p.name) === 'memory') assert.equal(p.scope, 'self', `${t.Name}: memory tag ${tag} must be self.`);
  }
});

test('≤ 60 characters at maximum slot length (or a valid short_text); no human named', () => {
  for (const t of T) {
    assert.ok(atMax(t.text).length <= MAX_CHARS || atMax(t.short_text).length <= MAX_CHARS, `${t.Name} overflows`);
    assert.ok(!BANNED.test(t.text + ' ' + t.short_text), `${t.Name} names a human`);
  }
});

test('{other} only with an own-relation tag; mikan_plastered only with the speaker\'s own WON; no boss-voiced defector tag', () => {
  for (const t of T) {
    if (t.text.includes('{other}')) assert.ok(t.requires.some(r => ['rival_of', 'kin_of', 'old_boss'].includes(parseTag(r).name)), `${t.Name}`);
    if (t.trigger === 'BOSS_POSTS') assert.ok(!t.requires.some(r => ['old_gang', 'ex_crew'].includes(parseTag(r).name)));
  }
});

test('Every trigger the slice fires has an "any" floor or per-personality floors', () => {
  const triggers = [...new Set(T.map(t => t.trigger))];
  for (const tr of triggers) {
    const floors = T.filter(t => t.trigger === tr && t.requires.length === 0);
    const special = ['OLD_GANG_FLINCH', 'OLD_GANG_DEFIANT', 'STEELED', 'KIN_SPARE'].includes(tr);
    assert.ok(special || floors.length > 0, `${tr} has no floor`);
  }
  assert.ok(T.length <= 240);
});

test('F8: the memory-tagged line wins over the floor and plays unskippable; no repeat while an unused line exists', () => {
  const t = createTown({ seed: 1 });
  ARC.l1d1(t); ARC.night(t, 1);
  const a = t.standoff('togemaru', { patch: 'LPY' });
  assert.equal(a.template, 'rf_braggart_own'); assert.equal(a.unskippable_s, 1);
  const b = t.standoff('togemaru', { patch: 'LPY' });
  assert.notEqual(b.template, 'rf_braggart_own', 'said once: −4');
});

test('Only the victor may cite the plaster (mikan_plastered needs its own WON)', () => {
  const t = createTown({ seed: 2 });
  ARC.l1d1(t); ARC.night(t, 1);
  t.beginEncounter({ patch: 'LPY', opponents: ['togemaru', 'goma'] });
  t.routed('mikan', { by: 'togemaru' });
  t.endEncounter({ outcome: 'loss', victor_ids: ['togemaru', 'goma'] });
  ARC.night(t, 2);
  assert.equal(t.standoff('togemaru', { patch: 'LPY' }).template, 'rw_plaster');
  assert.ok(!/plaster/i.test(t.standoff('goma', { patch: 'LPY' }).text), 'Goma did not win: no plaster line');
});

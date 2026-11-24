// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Canonical hashing of plain data: keys sorted, numbers rounded to 1e-6, two FNV-1a lanes -> 16 hex chars.
import { fnv1a } from './rng.js';

export function canon(v) {
  if (v === null || v === undefined) return 'n';
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return v > 0 ? 'inf' : v < 0 ? '-inf' : 'nan';
    const r = Math.round(v * 1e6) / 1e6;
    return (Object.is(r, -0) ? 0 : r).toString();
  }
  if (typeof v === 'boolean') return v ? 't' : 'f';
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (v instanceof Set) return canon([...v].sort());
  if (v instanceof Map) return canon(Object.fromEntries([...v.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))));
  const keys = Object.keys(v).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
}

export function hashOf(v) {
  const s = canon(v);
  const a = fnv1a(s), b = fnv1a(s, 0x01234567 ^ a);
  return a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0');
}

// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Seeded RNG with named substreams. sfc32 core; a substream is seeded from (seed, name) so
// adding a consumer (e.g. a join-in guest) never shifts another consumer's draws (Combat AC 24).

/** 32-bit FNV-1a of a string. */
export function fnv1a(str, h = 0x811c9dc5) {
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

function sfc32(a, b, c, d) {
  return function next() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    const t = (a + b | 0) + d | 0;
    d = d + 1 | 0;
    a = b ^ (b >>> 9);
    b = c + (c << 3) | 0;
    c = (c << 21) | (c >>> 11);
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
}

/** A deterministic stream. `float()` in [0,1); `range(a,b)`; `pick(arr)`; `chance(p)`. Counts draws for hashing. */
export class Stream {
  constructor(seed, name) {
    const s = fnv1a(`${seed}|${name}`);
    this.next = sfc32(s, fnv1a(name, s), s ^ 0x9e3779b9, fnv1a(String(seed), 0x1234567));
    for (let i = 0; i < 12; i++) this.next();
    this.draws = 0;
  }
  float() { this.draws++; return this.next(); }
  range(a, b) { return a + (b - a) * this.float(); }
  chance(p) { return this.float() < p; }
  pick(arr) { return arr[Math.floor(this.float() * arr.length) % arr.length]; }
}

/** Root RNG: `sub(name)` returns (and caches) the named substream. */
export class Rng {
  constructor(seed) { this.seed = seed >>> 0; this.streams = new Map(); }
  sub(name) {
    let s = this.streams.get(name);
    if (!s) { s = new Stream(this.seed, name); this.streams.set(name, s); }
    return s;
  }
}

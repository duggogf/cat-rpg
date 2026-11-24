// PROTOTYPE - NOT FOR PRODUCTION
// Street-side territory adapter. The world, wisps, prompts and HUD talk ONLY to this interface. Until the
// territory simulation lands at src/sim/territory/ (being built in parallel; see its API.md), this file applies
// territory-management.md's rules itself (§3.2 bands, §3.3 marking verbs, §3.4 contest, §4.14 influence,
// §3.5 window). When the sim lands, replace the body of createTerritory() with calls into it; the shape stays.
//
//   const T = createTerritory(patchesFromLayout)
//   T.patch(id) -> { id, name, scent, owner: 'bell'|'wallSitters'|'outsider'|null, keeper, band, wisps }
//   T.offer(id) -> 'rescue_spray' | 'counter_spray' | 'claim_spray' | null      (what E-hold would do now)
//   T.rubOffer(id, k) -> 'over_mark' | 'rub' | null
//   T.spray(id) / T.rub(id, k) -> MarkApplied event (or null)
//   T.influence() -> 0..100 for the bell Clowder (district Hidamari Lane)   T.window -> boolean
//   T.on(fn) -> fn(event) for MarkApplied | PatchChanged | InfluenceChanged | BossWindowChanged | AngerRaised | KeeperCleared
export const CLOWDER = {
  bell: { name: 'Bell Clowder', color: '#F2B01E', emblem: 'bell' },
  wallSitters: { name: 'Wall Sitters', color: '#A8C878', emblem: 'brick' },
  outsider: { name: 'Outsiders', color: '#B9A0FF', emblem: 'storm' },
};
export const band = (s) => (s <= 0 ? 'open' : s < 25 ? 'faint' : s < 60 ? 'clear' : s < 90 ? 'strong' : 'pungent');
export const wispsOf = (s) => (s <= 0 ? 0 : s < 25 ? 1 : s < 60 ? 2 : s < 90 ? 3 : 4);

export function createTerritory(layoutPatches, seed = {}) {
  // showcase seed (IMPLEMENTATION-PLAN §2.4: Life 2 snapshot, adapted so every M2 verb can be shown in one walk):
  // Low Wall Corner is Mikan's but faded (Rescue Spray), Laundry Pole Yard is the Wall Sitters' at its ceiling
  // (Over-mark, Counter-Spray, then Claim Spray), Persimmon Alley 75 and Tofu Shop Step 70 are held off-screen.
  const start = { LWC: { scent: 48, owner: 'bell', keeper: 'mikan' }, LPY: { scent: 80, owner: 'wallSitters', keeper: 'togemaru' }, ...seed };
  const P = {};
  for (const lp of layoutPatches) P[lp.id] = { id: lp.id, name: lp.name, rubbed: new Set(), contested: false, ...start[lp.id] };
  const offscreen = { PA: { scent: 75, owner: 'bell' }, TSS: { scent: 70, owner: 'bell' } };
  const subs = []; let anger = 0, win = false;
  const emit = (e) => { for (const f of subs) f(e); };
  const share = (p) => (p.owner === 'bell' ? (p.scent >= 60 ? 25 : (p.scent / 60) * 25) : 0);
  const influence = () => Math.round([...Object.values(P), ...Object.values(offscreen)].reduce((a, p) => a + share(p), 0));
  const view = (p) => ({ id: p.id, name: p.name, scent: p.scent, owner: p.owner, keeper: p.keeper, contested: p.contested, band: band(p.scent), wisps: wispsOf(p.scent), clowder: p.owner ? CLOWDER[p.owner] : null });
  const after = (p, kind, before) => {
    const inf0 = T._inf; const inf = influence(); T._inf = inf;
    const ev = { type: 'MarkApplied', patch_id: p.id, district_id: 'hidamari', kind, before, after: p.scent, target_clowder: p.owner };
    emit(ev);
    if (inf !== inf0) emit({ type: 'InfluenceChanged', district_id: 'hidamari', bell: inf, before: inf0 });
    // Boss anger (Nemesis, OR-07): an Over-mark +5, a Counter-Spray +15; Claim and Rescue Sprays never raise it
    const dA = kind === 'over_mark' ? 5 : kind === 'counter_spray' ? 15 : 0;
    if (dA) { const st0 = Math.floor(anger / 25); anger += dA; emit({ type: 'AngerRaised', boss: 'daifuku', by: dA, stageUp: Math.floor(anger / 25) > st0 }); }
    // the window opens at 100 and holds at >= 75 (§3.5); M2 checks after every Scent change
    if (!win && inf >= 100) { win = true; emit({ type: 'BossWindowChanged', district_id: 'hidamari', open: true }); }
    else if (win && inf < 75) { win = false; emit({ type: 'BossWindowChanged', district_id: 'hidamari', open: false }); }
    // the contest (§3.4): once marking takes the rival to <= 30 the Keeper comes; the Standoff and Verdict are M3's.
    // M2 stand-in: the Keeper is cleared at once so Claim Spray can be shown (logged as such).
    if (p.owner !== 'bell' && p.keeper && p.scent <= 30) { const k = p.keeper; p.keeper = null; emit({ type: 'KeeperCleared', patch_id: p.id, keeper: k, standIn: 'M2: the Standoff and Verdict land in M3' }); }
    return ev;
  };
  const T = {
    _inf: 0,
    on(f) { subs.push(f); return () => subs.splice(subs.indexOf(f), 1); },
    patch: (id) => view(P[id]),
    patches: () => Object.values(P).map(view),
    influence, get window() { return win; }, get anger() { return anger; },
    offer(id) {
      const p = P[id]; if (!p) return null;
      if (p.owner === 'bell') return p.scent < 60 ? 'rescue_spray' : null;        // DR-18: own Spray only below Strong
      if (!p.keeper) return 'claim_spray';                                         // no Keeper: Open, lapsed or cleared
      return 'counter_spray';                                                      // rival post: always loud, repeatable
    },
    rubOffer(id, k) { const p = P[id]; if (!p) return null; if (p.owner === 'bell') return 'rub'; return p.rubbed.has(k) ? null : 'over_mark'; },
    spray(id) {
      const p = P[id], kind = T.offer(id); if (!kind) return null; const before = p.scent;
      if (kind === 'rescue_spray') p.scent = 90;
      else if (kind === 'counter_spray') { p.scent = Math.max(0, p.scent - 30); p.contested = true; }
      else if (kind === 'claim_spray') { p.owner = 'bell'; p.keeper = 'mikan'; p.scent = 70; p.contested = false; p.rubbed.clear(); emit({ type: 'PatchChanged', patch_id: id, owner: 'bell' }); }
      return after(p, kind, before);
    },
    rub(id, k) {
      const p = P[id], kind = T.rubOffer(id, k); if (!kind) return null; const before = p.scent;
      if (kind === 'over_mark') { p.scent = Math.max(0, p.scent - 10); p.rubbed.add(k); }
      return after(p, kind, before);                                               // own Rub: no Scent, a `seen` visit
    },
  };
  T._inf = influence();
  return T;
}

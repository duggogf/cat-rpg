// PROTOTYPE - NOT FOR PRODUCTION
// Street-side adapter over the territory SIMULATION (src/sim/territory/, API.md). The world, wisps, prompts,
// compass and HUD talk only to this interface; every rule and number comes from the sim (and its data JSON).
// It adds only presentation glue: owner keys for the baked wisp colours, layout positions for posts / Rub Marks /
// Boss stops, and the reference anger consumer (until M3's nemesis module) for the HUD's anger puff.
import { createDistrict, createAngerReference, TDATA } from '../sim/territory/index.js';

export const OWNER_KEY = { bell: 'bell', wall_sitters: 'wallSitters', strays: 'strays', outsiders: 'outsider' };
export const CLOWDER = {
  bell: { name: 'Bell Clowder', color: '#F2B01E', emblem: 'bell' },
  wallSitters: { name: 'Wall Sitters', color: '#A8C878', emblem: 'brick' },
  strays: { name: 'Strays', color: '#33273B', emblem: null },
  outsider: { name: 'Outsiders', color: '#4E9DA6', emblem: 'stake' },   // sim placeholder colour (clowders.json)
};

export function createTerritory(layout, { seed = 42, start = 'showcase_l2d2' } = {}) {
  const D = createDistrict({ seed, start });
  const anger = createAngerReference(TDATA);
  const subs = [];
  const dispatch = (evs) => {
    for (const e of evs || []) {
      for (const f of subs) f(e);
      for (const a of anger.onEvent(e)) for (const f of subs) f(a);
      if (e.type === 'MarkApplied' && e.target_clowder === 'wall_sitters' && (e.kind === 'over_mark' || e.kind === 'counter_spray')) for (const f of subs) f({ type: 'AngerRaised', kind: e.kind });
    }
    return evs || [];
  };
  let snap = D.snapshot(), dirty = false;
  const S = () => { if (dirty) { snap = D.snapshot(); dirty = false; } return snap; };
  const touch = (evs) => { dirty = true; return dispatch(evs); };
  const post = (id) => S().posts.find((p) => p.patch === id);
  const view = (p) => ({ id: p.patch, name: p.display, post: p.post, scent: p.scent, owner: p.owner ? OWNER_KEY[p.owner] : null, simOwner: p.owner, keeper: p.keeper,
    wisps: p.wisps, droop: p.droop, fading: p.fading, staked_by: p.staked_by, contested: p.contested, keeper_called: p.keeper_called, colour: p.colour,
    clowder: p.owner ? { ...CLOWDER[OWNER_KEY[p.owner]], color: p.colour } : null, rub_marks: p.rub_marks, boss_seat: p.boss_seat });
  const markId = (id, k) => (typeof k === 'string' ? k : `${id}.rub${k + 1}`);
  return {
    sim: D,
    on(f) { subs.push(f); return () => subs.splice(subs.indexOf(f), 1); },
    patch: (id) => view(post(id)),
    patches: () => S().posts.map(view),
    snapshot: S,
    influence: () => D.influence(),
    get window() { return D.bossWindow().open; },
    bossWindow: () => D.bossWindow(),
    offer(id) { const o = D.sprayOffer(id); return o ? o.kind : null; },
    rubOffer(id, k) { const p = post(id); if (!p) return null; const m = p.rub_marks.find((r) => r.id === markId(id, k)); if (!m) return null; if (p.owner === 'bell') return 'rub'; return m.over_marked ? null : 'over_mark'; },
    spray(id) { const ev = touch(D.spray(id)); return ev.find((e) => e.type === 'MarkApplied') || null; },
    rub(id, k, o = {}) { const ev = touch(D.rub(id, markId(id, k), o)); return ev.find((e) => e.type === 'MarkApplied' || e.type === 'Rubbed') || null; },
    whisker(dt, o) { const ev = D.whisker(dt, o); if (ev && ev.length) touch(ev); else dirty = true; return S().whisker; },
    setPhase(name) { return touch(D.setPhase(name)); },
    verdict(id, v) { return touch(D.verdict(id, v)); },   // M3 owns the Verdict; exposed for test scripts only
    endContest(id, why) { return touch(D.endContest ? D.endContest(id, why) : []); },
    ticks: () => S().whisker.ticks,
    hash: () => D.hash(),
  };
}

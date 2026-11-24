#!/usr/bin/env python3
"""Value of the daily posting decision (Territory §4.5 / §4.12) under nightly raids (rule T = recommended fix).
Compares the engaged player's posting (Stalwart on the forecast Patch, Braggart on the richest other Patch)
with: no posts, random posts, and 'Braggart on the forecast'.  Usage: python3 -I posting_decision_value.py"""
import random, sys, os, statistics as st
sys.path.insert(0, os.path.dirname(__file__))
import territory_slice_sim as t

def post_random(held, raid_req, d, _r=random.Random(7)):
    cand = [p for p in held if p != "LWC"]
    if d < 3 or not cand: return {}
    cats = [t.STALWART, t.BRAGGART, t.FRAIDY]; _r.shuffle(cats)
    ps = _r.sample(cand, min(2, len(cand)))
    return {p: c for p, c in zip(ps, cats)}

def post_braggart_first(held, raid_req, d):
    p = t.post_engaged(held, raid_req, d)
    return {k: (t.BRAGGART if v is t.STALWART else t.STALWART) for k, v in p.items()}

print("| Posting policy (engaged player otherwise) | Tribute days 1-7 | Scuffed nights | Lost nights | Day-6 Tribute (anchor) |")
print("|---|---|---|---|---|")
for nm, fn in (("Stalwart on forecast + Braggart richest (doc's answer)", t.post_engaged),
               ("Swapped: Braggart on forecast, Stalwart richest", post_braggart_first),
               ("Random 2 of Hige/Togemaru/Kinako", post_random), ("No posts", t.post_none)):
    pol = dict(t.ENGAGED, post=fn)
    runs = [t.run(pol, "T", s, 7) for s in range(2000)]
    tot = st.mean(sum(r["tribute"] for r in x) for x in runs)
    sc = st.mean(sum(1 for r in x if r["raid"].endswith("Scuffed")) for x in runs)
    lo = st.mean(sum(1 for r in x if r["raid"].endswith("Lost")) for x in runs)
    d6 = st.mean(x[5]["tribute"] for x in runs)
    print(f"| {nm} | {tot:.0f} | {sc:.2f} | {lo:.2f} | {d6:.1f} |")

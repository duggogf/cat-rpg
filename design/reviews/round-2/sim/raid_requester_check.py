#!/usr/bin/env python3
"""How often does Nemesis §3.12 3f have a requester (active, non-truce cat with Grudge >= 60)
on nights 4-7?  Uses nemesis_slice_sim.py as written.  Usage: python3 -I raid_requester_check.py"""
import sys
sys.path.insert(0, __import__("os").path.dirname(__file__))
import nemesis_slice_sim as m
print("| Policy | Night 4 | Night 5 | Night 6 | Night 7 |")
print("|---|---|---|---|---|")
for pol in ("chase", "humble", "mixed", "pacifist", "lose40"):
    hits = {4: 0, 5: 0, 6: 0, 7: 0}; n = 500
    for s in range(n):
        w = m.World(s, pol)
        for d in range(1, 8):
            w.play_day(); w.night()
            if d in hits and w.raid_req is not None:
                hits[d] += 1
    print(f"| {pol} | " + " | ".join(f"{hits[d]/n:.0%}" for d in (4, 5, 6, 7)) + " |")

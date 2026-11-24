#!/usr/bin/env python3
"""Round-2 check: does a slice day fit DR-16 once Territory, Nemesis and Day-loop demands are summed?

Minutes per segment, typical (median-ish) and heavy (75th-pct-ish) estimates.
Encounter minutes use 1.1 min per fight incl. approach-free paused time, +0.35 per Verdict
prompt (tell + 4 options + Bribe tier), +0.25 per Standoff with an unskippable memory line.
Fight counts come from the docs: a Patch take = 1-2 turf waves + the Keeper (Territory §3.4);
the arc-lead presence placement (Nemesis §3.7, daily from L2D1 until the arc is achieved);
<= 1 Rival Ambush (Nemesis §3.10); the Caterwaul defence on raid nights (Territory §3.8);
one Night Roamer when out at Night.  Observations only.  Usage: python3 -I day_budget_check.py
"""
DAYS = {
    # name: (wake, door, lot, clock_min, naps, fights, verdicts, memory_standoffs, home_way, evening)
    "L1D1 tutorial (day-loop §3.10)":            ((4.0, 4.0), (0, 0), (0, 0), (6, 6), (0, 0), (4, 4), (0, 0), (0, 0), (1, 1), (2, 2)),
    "L1D2 Thorn + LPY take":                     ((0.25, 1.5), (0.5, 0.5), (1.0, 1.5), (12, 12), (1, 1), (3, 5), (1, 1), (1, 1), (1, 1), (1.5, 2)),
    "L2D1 PA take, Ambush, Turf Board first use": ((1.5, 1.5), (0.5, 0.75), (1.0, 2.0), (12, 12), (1, 1), (4, 6), (2, 2), (1, 2), (1, 1), (1.5, 2)),
    "L2D2 flap, first Night, raid + Caterwaul":  ((1.5, 1.5), (0.5, 0.75), (1.0, 1.5), (13, 16), (1, 1), (4, 6), (2, 3), (1, 2), (1, 1), (1, 1)),
    "L2D3 TSS take, first Lessons, out all Night": ((0.25, 0.25), (0.5, 0.75), (1.0, 2.0), (16, 16), (1, 1), (5, 7), (2, 3), (1, 2), (1, 1), (1, 1)),
    "L2D3 same, home by Dusk":                   ((0.25, 0.25), (0.5, 0.75), (1.0, 2.0), (12, 12), (1, 1), (4, 6), (2, 3), (1, 2), (1, 1), (2, 2)),
    "L2D4 Daifuku (wipe -> Dusk jump)":          ((0.25, 0.25), (0.5, 0.75), (1.0, 1.0), (4, 6), (0, 1), (3, 4), (0, 1), (1, 1), (1, 1), (2.5, 3)),
}


def total(row, k):
    wake, door, lot, clock, naps, fights, verd, mem, way, eve = (x[k] for x in row)
    roam = max(0, clock - 2 * naps) + 0.25 * naps
    enc = 1.1 * fights + 0.35 * verd + 0.25 * mem
    return wake + door + lot + roam + enc + way + eve, enc


print("| Day | Typical total (min) | Heavy total (min) | Encounter minutes typical / heavy | vs DR-16 (<= 25 median, 30 cap) |")
print("|---|---|---|---|---|")
for name, row in DAYS.items():
    t, e = total(row, 0); h, eh = total(row, 1)
    flag = "fits" if t <= 25 and h <= 30 else ("tight" if t <= 25 else "OVER median")
    print(f"| {name} | {t:.1f} | {h:.1f} | {e:.1f} / {eh:.1f} | {flag} |")

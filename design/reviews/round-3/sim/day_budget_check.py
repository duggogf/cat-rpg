#!/usr/bin/env python3
"""Round-3 re-run (iteration 3): Sentries/Turf Board first use moves to L2D2 (key-screens §7.4); K2.2 + Late Home land on L2D3 and K2.5 on the L2D4 morning (Narrative §3.3, presentation R1). Round-2 check: does a slice day fit DR-16 once Territory, Nemesis and Day-loop demands are summed?

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
    "L1D1 tutorial (K1.1+garden 6; tutorial fights run long)": ((6.0, 6.0), (0, 0), (0, 0), (6, 6), (0, 0), (8, 8), (0, 0), (0, 0), (1, 1), (2, 2)),
    "L1D2 Thorn + LPY take":                     ((0.25, 1.5), (0.5, 0.5), (1.0, 1.5), (12, 12), (1, 1), (3, 5), (1, 1), (1, 1), (1, 1), (1.5, 2)),
    "L2D1 Kinako favour, PA take, Ambush (no Turf Board)": ((1.5, 1.5), (0.5, 0.75), (0.5, 1.0), (12, 12), (1, 1), (4, 6), (2, 2), (1, 2), (1, 1), (1.5, 2)),
    "L2D2 Declaration + first forecast, Turf Board first use, flap, first Night, raid + Caterwaul": ((1.5, 1.5), (0.75, 1.0), (1.5, 2.0), (13, 16), (1, 1), (4, 6), (2, 3), (1, 2), (1, 1), (1, 1)),
    "L2D3 TSS take, first Lessons, out all Night, Late Home Call from the street, K2.2 on the late arrival (no Night Roamer)": ((0.25, 0.25), (0.5, 0.75), (1.5, 2.0), (16, 16), (1, 1), (4, 6), (2, 3), (1, 2), (1, 1), (2.0, 2.5)),
    "L2D3 same, home by Dusk: Late Home wait + K2.2": ((0.25, 0.25), (0.5, 0.75), (1.5, 2.0), (12, 12), (1, 1), (4, 6), (2, 3), (1, 2), (1, 1), (3.0, 3.5)),
    "L2D4 K2.5 morning + Daifuku (wipe -> Dusk jump), Dusk tail": ((2.5, 3.0), (0.5, 0.75), (1.0, 1.0), (4, 6), (0, 1), (3, 4), (0, 1), (1, 1), (1, 1), (1.5, 2)),
    "L2D5 Daifuku rematch, victory lap, Life-end sleep in the suitcase": ((0.25, 0.25), (0.5, 0.75), (1.0, 1.0), (8, 12), (1, 1), (3, 4), (1, 1), (1, 1), (1, 1), (1.5, 2)),
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

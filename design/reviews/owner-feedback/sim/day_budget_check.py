#!/usr/bin/env python3
"""Owner-feedback pass (2026-11-24) re-run of the day-budget check (copied from round-3/sim/day_budget_check.py;
its output is day_budget_check.before.out.txt).

What changed (design/reviews/owner-feedback-rulings.md OR-01, OR-02, OR-09, OR-16; day-loop.md sec. 3.6, 3.10, 3.11):
  - A loss ends the day: the clock jumps to Night (720), the street closes, Mikan walks home (<= 1 min,
    autopilot at 60 s) to the Routed Evening (plaster beat 0.5 min, then free home play until sleep).
    No Dusk tail, no Night roam, no Sunspot, no Lot after the wipe.
  - L2D4 is the window-and-loss day: two rescue Sprays take influence 89 -> 100, Daifuku's reveal (0.25 min,
    paused), the attempt at his Day stop, the wipe, the walk home. The challenger is announced in its Sniff
    (its fight is optional: heavy column only).
  - The Boss fight is now costed explicitly from combat_slice_sim.out.txt (win 157-176 s, a lost attempt
    ~190 s, + 0.3 min Standoff and Gloat) instead of as one 1.1-minute fight (a correction to round 3,
    which under-costed L2D4/L2D5 by ~2 min each).
Minutes per segment, typical (median-ish) and heavy (75th-pct-ish). Same per-fight costs as round 3:
1.1 min per fight, +0.35 per Verdict prompt, +0.25 per Standoff with an unskippable memory line.
Observations only.  Usage: python3 -I day_budget_check.py
"""
F = ("wake", "door", "lot", "clock", "naps", "fights", "verdicts", "mem", "boss", "beats", "way", "eve", "c_open")
# boss = Daifuku fight minutes incl. Standoff/Gloat; beats = other paused authored street beats (reveal)
# c_open = minutes of roaming clock available that day (12 before the flap, 16 after); clock must fit it.
def day(**kw):
    return {k: kw.get(k, (0, 0)) if k != "c_open" else kw.get(k, 16) for k in F}

DAYS = {
    "L1D1 tutorial (unchanged)": day(wake=(6.0, 6.0), clock=(6, 6), fights=(8, 8), way=(1, 1), eve=(2, 2), c_open=12),
    "L1D2 Thorn + LPY take (unchanged)": day(wake=(0.25, 1.5), door=(0.5, 0.5), lot=(1.0, 1.5), clock=(12, 12), naps=(1, 1),
        fights=(3, 5), verdicts=(1, 1), mem=(1, 1), way=(1, 1), eve=(1.5, 2), c_open=12),
    "L2D1 Kinako, PA take, Ambush, Rivals board (was Fence Line)": day(wake=(1.5, 1.5), door=(0.5, 0.75), lot=(0.5, 1.0),
        clock=(12, 12), naps=(1, 1), fights=(4, 6), verdicts=(2, 2), mem=(1, 2), way=(1, 1), eve=(1.5, 2), c_open=12),
    "L2D2 Declaration, Turf Board first use, flap, first Night, Caterwaul": day(wake=(1.5, 1.5), door=(0.75, 1.0),
        lot=(1.5, 2.0), clock=(13, 16), naps=(1, 1), fights=(4, 6), verdicts=(2, 3), mem=(1, 2), way=(1, 1), eve=(1, 1)),
    "L2D3 TSS take, Lessons, out all Night, Late Home, K2.2": day(wake=(0.25, 0.25), door=(0.5, 0.75), lot=(1.5, 2.0),
        clock=(16, 16), naps=(1, 1), fights=(4, 6), verdicts=(2, 3), mem=(1, 2), way=(1, 1), eve=(2.0, 2.5)),
    "L2D4 K2.5; rescue Sprays -> window; challenger Sniff; Daifuku LOST -> Night, walk home, Routed Evening":
        day(wake=(2.5, 3.0), door=(0.5, 0.75), lot=(1.0, 1.0), clock=(4.5, 7.0), naps=(0, 0), fights=(0, 2),
            verdicts=(0, 1), mem=(0, 0), boss=(3.5, 3.7), beats=(0.25, 0.25), way=(1, 1), eve=(2.0, 2.5)),
    "L2D5 Daifuku rematch (-10%, Calm), Den Claim Spray, victory lap, Life-end sleep": day(wake=(0.25, 0.25),
        door=(0.5, 0.75), lot=(1.0, 1.0), clock=(8, 12), naps=(1, 1), fights=(2, 4), verdicts=(0, 1), mem=(0, 1),
        boss=(3.0, 3.3), way=(1, 1), eve=(1.5, 2)),
}

# Loss-day variants: the same day with one wipe at the clock shown (the lost fight is one of `fights`).
LOSS = {
    "L2D2 normal (above)": DAYS["L2D2 Declaration, Turf Board first use, flap, first Night, Caterwaul"],
    "L2D2 with a wipe at clock 6:00 (Day): K2.3 in its Late form at the Routed Evening; first Night moves to L2D3":
        day(wake=(1.5, 1.5), door=(0.75, 1.0), lot=(1.5, 2.0), clock=(6, 6), naps=(0, 1), fights=(3, 4), verdicts=(1, 2),
            mem=(1, 1), way=(1, 1), eve=(2.0, 2.5)),
    "L2D3 normal (above)": DAYS["L2D3 TSS take, Lessons, out all Night, Late Home, K2.2"],
    "L2D3 with a wipe at clock 13:00 (Night): clock stays, walk home, plaster, K2.2": day(wake=(0.25, 0.25),
        door=(0.5, 0.75), lot=(1.5, 2.0), clock=(13, 13), naps=(1, 1), fights=(4, 5), verdicts=(2, 2), mem=(1, 2),
        way=(1, 1), eve=(2.5, 3.0)),
    "Worst real-time case: a wipe at clock 2:00 (Morning), the accepted OR-02 residue": day(wake=(0.25, 0.25),
        door=(0.5, 0.75), lot=(1.0, 1.5), clock=(2, 2), fights=(2, 2), verdicts=(0, 0), way=(1, 1), eve=(2.0, 2.5)),
    "L1D3 bonus morning after a L1D2 loss: K1.4 Closing in the morning slot, Settle In at once, Life-end sleep":
        day(wake=(1.5, 1.5), door=(0.5, 0.5), clock=(0.5, 1.0), way=(0.5, 0.5), eve=(1.0, 1.5), c_open=12),
}


def total(d, k):
    v = {f: (d[f][k] if f != "c_open" else d[f]) for f in F}
    roam = max(0, v["clock"] - 2 * v["naps"]) + 0.25 * v["naps"]
    enc = 1.1 * v["fights"] + 0.35 * v["verdicts"] + 0.25 * v["mem"] + v["boss"] + v["beats"]
    fits_clock = v["clock"] <= v["c_open"]
    return v["wake"] + v["door"] + v["lot"] + roam + enc + v["way"] + v["eve"], enc, fits_clock


def table(rows):
    print("| Day | Typical (min) | Heavy (min) | Encounter min typ / heavy | Clock used / open (heavy) | vs DR-16 (<= 25 median, 30 cap) |")
    print("|---|---|---|---|---|---|")
    out = {}
    for name, d in rows.items():
        t, e, c0 = total(d, 0); h, eh, c1 = total(d, 1)
        flag = "fits" if t <= 25 and h <= 30 else ("tight" if t <= 25 else "OVER median")
        print(f"| {name} | {t:.1f} | {h:.1f} | {e:.1f} / {eh:.1f} | {d['clock'][1]} / {d['c_open']} {'ok' if c0 and c1 else 'OVER'} | {flag} |")
        out[name] = (t, h)
    return out

print("## Reference days (budget check)\n")
ref = table(DAYS)
print("\n## Normal day vs loss day\n")
table(LOSS)

# The pacing graph (day-loop sec. 3.11) uses the worked-day reference minutes, not the budget check.
GRAPH_BEFORE = {"L1D1": 25, "L1D2": 20, "L2D1": 20, "L2D2": 23, "L2D3": 24, "L2D4": 21, "L2D5": 16}
GRAPH_AFTER = dict(GRAPH_BEFORE, L2D4=15.5)       # day-loop sec. 3.10 worked day L2D4 (loss -> Night)
print("\n## Slice clock (target 120-150 min, DR-03 / F6)\n")
b, a = sum(GRAPH_BEFORE.values()), sum(GRAPH_AFTER.values())
fast_before, fast_after = 132, sum(v for k, v in GRAPH_AFTER.items() if k != "L2D5") - 15.5 + 16.0
print(f"- Reference path (7 days, L2D4 lost): before {b} min, after {a} min ({'fits' if 120 <= a <= 150 else 'OUT'})")
print(f"- Fast path (Daifuku won on L2D4, 6 days; L2D4 then runs like L2D5, 16 min): before {fast_before}, after {fast_after:.1f}")
extra = GRAPH_AFTER["L2D5"]
print(f"- Each extra Boss wipe: before +16-20 min (a Dusk-to-sleep evening plus a rematch day); after: the lost day "
      f"was already played, so it adds one rematch day: {ref['L2D5 Daifuku rematch (-10%, Calm), Den Claim Spray, victory lap, Life-end sleep'][0]:.1f} min "
      f"(budget typical) to {extra:.0f} min (worked day). Reference + 1 extra wipe = {a + extra:.1f} min "
      f"({'fits' if a + extra <= 150 else 'over the 150 median target; AC-P2 is a median, as before (149 + 16-20)'})")
print(f"- Budget-check typical sum (7 days): {sum(v[0] for v in ref.values()):.1f} min; heavy sum {sum(v[1] for v in ref.values()):.1f} min")

print("\n## L2D4 script clock check (clock seconds; Daifuku's stop follows PhaseChanged)\n")
EVENTS = [(0, "street; Whisker Sense"), (90, "rescue Spray Laundry Pole Yard 56 -> 90 (influence ~89 -> 91; illustrative Scent, Territory owns it)"),
          (180, "rescue Spray Persimmon Alley 38 -> 90: influence 100, BossWindowChanged(open); reveal (paused)"),
          (240, "PhaseChanged Day: Daifuku at his Day stop, Tofu Shop's back wall (rain barrel)"),
          (270, "Standoff within 8 m; the fight (clock paused ~3.5 real min)"),
          (270, "wipe -> clock 720 (Night); street closed; Head Home thread"), (720, "walk home <= 60 s -> HomeArrived(routed)")]
prev = -1
for c, what in EVENTS:
    ok = c >= prev and c <= 960
    print(f"  clock {c:3d}  {'ok ' if ok else 'BAD'} {what}")
    prev = c

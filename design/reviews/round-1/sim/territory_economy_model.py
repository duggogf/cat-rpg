#!/usr/bin/env python3
"""
Round-1 economy model for design/gdd/territory-management.md (v0.1).

Deterministic expected-value model (no RNG). It encodes the draft's own
formulas (sections 3.1, 3.2, 4.1-4.6, 4.8-4.9, 5.3) and checks:

  1. The section 5.2 Tribute anchors, as the draft computes them and as the
     Clout table actually allows (Sentry caps), and for an optimiser who takes
     Full House, Pungent and Settled.
  2. Three player types across the nine Lives: optimiser, casual, idler.
  3. Morsels per real minute for the draft's strategies A-E plus two
     exploits found in review: E' (walk to Low Wall Corner, mark it, roam
     10 min with loyal Wardens) and W (deliberate Posse wipe to force
     rounds = 1.0).
  4. Raid outcome odds for Watched / Unwatched Patches and Life 8 Vigil
     survival.

Usage:  python3 -I territory_economy_model.py
All tunables are at the top so a reviser can re-run after changes.
"""

# --------------------------------------------------------------------------
# Draft data (territory-management.md v0.1)
# --------------------------------------------------------------------------
YIELD = {  # district: (outer base_yields, den base_yield)   section 3.1
    1: ([8, 9, 11, 12], 16),
    2: ([20, 18, 22, 28], 36),
    3: ([22, 18, 16, 24], 32),
    4: ([50, 55, 60, 75], 100),
    5: ([38, 42, 46, 50], 72),
    6: ([44, 56, 52, 48], 80),
}
SENTRY_CAP = {"House Pet": 1, "Lane Cat": 2, "Known Face": 3, "Boss": 5,
              "Two-Street Boss": 8, "Big Whisker": 12, "Great Boss": 18}

# Reference player per Life, copied from section 5.3:
# (days, tribute/day, fights/day, scavenge/day, spend_total)
REF = {
    1: (3, 3, 20, 8, 60),
    2: (7, 28, 60, 15, 650),
    3: (8, 105, 100, 30, 1850),
    4: (8, 225, 160, 45, 3400),
    5: (8, 440, 230, 70, 5810),
    6: (8, 750, 307, 85, 8700),
    7: (9, 1030, 420, 100, 10150),
    8: (6, 650, 300, 80, 9100),
    9: (3, 700, 100, 40, 2000),
}
FINITE_SINK_SHARE = {1: 0.3, 2: 0.4, 3: 0.4, 4: 0.4, 5: 0.4, 6: 0.4, 7: 0.4, 8: 0.1, 9: 0.0}
STASH_CAP_BY_LIFE_REF = {1: 400, 2: 1200, 3: 1200, 4: 1200, 5: 3000, 6: 3000,
                         7: 6000, 8: 6000, 9: 6000}


def scent_mult(s):
    if s >= 90:
        return 1.1
    if s >= 60:
        return 1.0
    if s >= 25:
        return 0.8
    if s >= 1:
        return 0.5
    return 0.0


# --------------------------------------------------------------------------
# 1. Tribute anchors
# --------------------------------------------------------------------------
def tribute(districts, sentries, watched_scent=70, unwatched_scent=70,
            bonus=0.0, warden=True):
    dens = sum(YIELD[d][1] for d in districts)
    outer = sorted((y for d in districts for y in YIELD[d][0]), reverse=True)
    watched, unwatched = outer[:sentries], outer[sentries:]
    wm = 0.8 if warden else 0.6
    t_w = scent_mult(watched_scent) * (1 + bonus) * (dens + sum(watched))
    t_u = scent_mult(unwatched_scent) * (1 + bonus) * wm * sum(unwatched)
    return t_w + t_u


def anchors():
    print("== 1. Tribute anchors (canon: L2 60, L4 300, L7 1,200) ==")
    rows = [
        ("L4 draft (7 Sentries)", [1, 2, 3], 7, 70, 70, 0.0),
        ("L4 Clout cap (8)", [1, 2, 3], 8, 70, 70, 0.0),
        ("L7 draft (9 Sentries)", [1, 2, 3, 4, 5, 6], 9, 70, 70, 0.0),
        ("L7 Clout cap (12)", [1, 2, 3, 4, 5, 6], 12, 70, 70, 0.0),
        # optimiser: Full House +0.10, Settled +0.10, avg Humbled/Scrounger/Larder +0.15,
        # Watched Patches in a Full House net +3/night -> Pungent.
        ("L7 optimiser, Big Whisker", [1, 2, 3, 4, 5, 6], 12, 95, 70, 0.35),
        ("Great Boss optimiser", [1, 2, 3, 4, 5, 6], 18, 95, 70, 0.35),
    ]
    for name, ds, s, ws, us, b in rows:
        print(f"  {name:28s} {tribute(ds, s, ws, us, b):7.0f}")


# --------------------------------------------------------------------------
# 2. Player types across the Lives
# --------------------------------------------------------------------------
def run_player(name, tribute_factor, spend_factor, stash_caps, extra_daily_sink=None):
    stash, spoiled = 0, 0
    print(f"  -- {name}")
    for life, (days, trib, fights, scav, spend) in REF.items():
        inc = days * (trib * tribute_factor.get(life, 1.0) + fights + scav)
        sp = spend * spend_factor.get(life, 1.0)
        if extra_daily_sink:
            sp += days * extra_daily_sink.get(life, 0)
        net = inc - sp
        cap = stash_caps[life]
        new = stash + net
        if new > cap:
            spoiled += new - cap
            new = cap
        stash = max(0, new)
        print(f"     L{life}: income {inc:7.0f}  spend {sp:7.0f}  stash {stash:6.0f}  spoiled so far {spoiled:6.0f}")
    return stash, spoiled


def players():
    print("\n== 2. Player types ==")
    run_player("Reference (draft section 5.3)", {}, {}, STASH_CAP_BY_LIFE_REF)
    # Optimiser: more Tribute (anchors above); buys finite sinks a Life early, so
    # Life 7 wants fall by the share already bought.
    opt_t = {2: 1.1, 3: 1.2, 4: 1.2, 5: 1.3, 6: 1.3, 7: 1.3, 8: 1.0, 9: 1.0}
    opt_s = {5: 1.1, 6: 1.25, 7: 0.7}
    caps_opt = dict(STASH_CAP_BY_LIFE_REF)
    caps_opt[6] = 6000
    run_player("Optimiser, no Crew meals", opt_t, opt_s, caps_opt)
    # Same optimiser using Crew GDD's Share a Meal (2 x level per cat per day)
    # on half the Crew: L5 ~8 cats Lv 28, L6 ~10 Lv 36, L7 ~9 Lv 44.
    meals = {5: 8 * 2 * 28, 6: 10 * 2 * 36, 7: 9 * 2 * 44, 8: 9 * 2 * 48}
    run_player("Optimiser feeding half the Crew (Crew F8 meal)", opt_t, opt_s, caps_opt, meals)
    # Casual: never re-posts, no upgrades, no Crate Stack -> cap 400 all game.
    cas_t = {3: 0.6, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.6, 8: 0.6, 9: 0.6}
    cas_s = {2: 0.6, 3: 0.6, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.55, 8: 0.3, 9: 0.3}
    run_player("Casual (no Lot upgrades, cap 400)", cas_t, cas_s, {k: 400 for k in REF})


# --------------------------------------------------------------------------
# 3. Morsels per real minute (Life 7 end: Tribute 1,200, upkeep 276)
# --------------------------------------------------------------------------
def seen(days_since, grace=2, step=0.15, floor=0.4):
    if days_since <= grace:
        return 1.0
    return max(floor, 1.0 - step * (days_since - grace))


def per_minute():
    print("\n== 3. Morsels per real minute, end of Life 7 ==")
    T, UP, HID = 1200, 276, 60
    rows = [
        ("A full day", 1200 + 420 + 100 - UP, 30),
        ("B home by Dusk", 1200 + 210 + 60 - UP, 18),
        ("C patrol only", 1200 + 40 - UP, 12),
        ("D sleep-skip (rounds 0)", -UP, 2),
    ]
    for n, net, m in rows:
        print(f"  {n:34s} net {net:6.0f}  min {m:3d}  per-min {net / m:6.1f}")
    for label, floor, step in (("E' loyal Wardens (floor .7)", 0.7, 0.10),
                               ("E' no Warden floor (.4)", 0.4, 0.15)):
        for day in (1, 3, 5, 7):
            t = HID + (T - HID) * seen(day, 2, step, floor)
            print(f"  {label:34s} day {day}: tribute {t:6.0f} net {t - UP:6.0f} per-min {(t - UP) / 11:5.1f}")
    # W: walk out, Rub Low Wall Corner, lose a fight on purpose: rounds forced 1.0
    t = HID + (T - HID) * 0.7
    print(f"  {'W wipe-skip (steady state)':34s} net {t - UP:6.0f}  min   3  per-min {(t - UP) / 3:6.1f}")


# --------------------------------------------------------------------------
# 4. Raids and the Vigil
# --------------------------------------------------------------------------
def p_hold(R):
    p = R ** 3 / (R ** 3 + 1)
    return min(0.95, max(0.05, p))


def raid(sentries, attack, scent, fixed=0.0, warden=None, rations=1.0):
    st = 1.5 * rations * sum(pr * sm * (0.6 + 0.4 * loy / 100) for pr, sm, loy in sentries) / attack
    wt = 0.25 * warden[0] * (0.6 + 0.4 * warden[1] / 100) / attack if warden else 0.0
    R = st + wt + 0.005 * scent + fixed
    p = p_hold(R)
    return R, p * p, p - p * p, 1 - p


def raids():
    print("\n== 4. Raid odds (attackers: two Toughs PR 400, grudge x1.15) ==")
    atk = 1.15 * 800
    cases = [
        ("Example A (Bruiser, Warden, Settled)", [(400, 1.25, 80)], 80, 0.10, (480, 70)),
        ("Example B (Unwatched, no Warden)", [], 80, 0.10, None),
        ("Unwatched under Warden, Scent 70", [], 70, 0.10, (480, 70)),
        ("Watched, plain Sentry, Scent 80", [(400, 1.0, 60)], 80, 0.0, (480, 70)),
        ("Vigil: Watched, Short Rations, Sc 40", [(400, 1.0, 60)], 40, 0.0, (480, 62)),
    ]
    for n, s, sc, fx, w in cases:
        R, rep, scf, lost = raid(s, atk, sc, fx, w, 0.8 if "Vigil" in n else 1.0)
        print(f"  {n:40s} R {R:4.2f}  Rep {rep:4.2f} Scuff {scf:4.2f} Lost {lost:4.2f}")

    print("\n  Vigil scent after 4 nights (x3 decay, no rival neighbours):")
    for n, decay, refresh, start in (("Watched + Warden", 30, 13, 100),
                                     ("Unwatched + Warden", 30, 3, 100),
                                     ("Hidamari Watched (Home Turf)", 15, 13, 100),
                                     ("Hidamari Unwatched (Home Turf)", 15, 3, 100)):
        s = start
        for _ in range(4):
            s = max(0, min(100, s - decay + refresh))
        print(f"     {n:32s} {s:4d}")


if __name__ == "__main__":
    anchors()
    players()
    per_minute()
    raids()

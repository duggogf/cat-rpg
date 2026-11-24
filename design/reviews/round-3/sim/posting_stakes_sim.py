#!/usr/bin/env python3
"""Round-3 check: how much is the daily posting decision worth (Territory §3.6-§3.7, §4.2, §4.5)?

Self-contained successor to round-2 territory_slice_sim.py + posting_decision_value.py.
Same economy (yields, bands, decay, seen, Spray, Share, Lessons, Bribe, field haul) and the
same engaged reference player, with Nemesis fix 2's raid rule (one raid every night from
night 4 against the lowest-Scent admissible held Patch).  Two rule sets:

  R2  round-2 Territory as written: guard_mod by personality only; Scuffed steals the
      Patch's own Tribute; raiders at PR ratio 1 (round-2 S7 assumption).
  R3  iteration-3 proposal:
      - Sentries are taught on L2D2 (key-screens §7.4 ruling), so posts start night 4;
      - motive counters: a Sentry whose personality counters tonight's motive x1.5 guard
        (boss_orders: Stalwart; gloat: Braggart; grudge: Goofball; pretender: Schemer, Brooder;
        uprising: Goofball);
      - neighbour pairs: Sentries on ADJACENT Patches (Low Wall Corner included) that are
        bonded each get +0.25 guard; clashing each get -0.25 guard and both Patches -10% Tribute;
      - Scuffed: loot_held = 2x the Patch's Tribute (its own pay + the same again off the pile);
      - raid parties per motive with real PR: Tough leader 1.0, Captain leader 1.5, escort 0.6
        (x the Sentry's PR); motive mix grudge 40 / boss_orders 25 / gloat 20 / pretender 15,
        Captain-led 30%; Braggart pay perk +20% (was +10%).

Posting policies compared (engaged player otherwise):
  best    - reads the forecast (motive known: Schemer posted, or the party portraits) and
            picks the expected-best pair of cats and Patches for tonight;
  habit   - round-2's answer every night: Stalwart on the forecast, Braggart on the richest;
  random  - 2 random cats on 2 random held Patches;
  none    - no posts.
Also: day-6 Tribute (the post-claim anchor, canon ~60, target 54-66), Scuffed/Lost nights,
the casual player and the sleep-skip floor.  Observations only.
Usage: python3 -I posting_stakes_sim.py
"""
import random, statistics as st, itertools

YIELD = {"LWC": 8, "LPY": 10, "PA": 12, "TSS": 14, "DEN": 18}
NEIGH = {"LWC": ["LPY", "PA"], "LPY": ["LWC", "PA", "DEN"], "PA": ["LWC", "LPY", "TSS"],
         "TSS": ["PA", "DEN"], "DEN": ["LPY", "TSS"]}
OUTER = ["LWC", "LPY", "PA", "TSS"]
# Crew §3.3 sheets: (personality, style_mod, guard_mod, refresh)
CATS = {
    "Hige": ("stalwart", 1.25, 1.50, 10),
    "Togemaru": ("braggart", 1.10, 1.25, 10),
    "Kinako": ("fraidy", 1.10, 0.75, 10),
    "Pon": ("goofball", 1.00, 1.00, 14),
    "Kagi": ("schemer", 1.00, 1.00, 14),
}
# Crew §3.2 bond/clash matrix restricted to the slice six
CLASH = {frozenset(p) for p in [("stalwart", "schemer"), ("braggart", "fraidy"), ("brooder", "schemer"),
                                 ("brooder", "goofball"), ("braggart", "braggart")]}
BOND = {frozenset(p) for p in [("stalwart", "fraidy"), ("stalwart", "goofball"), ("stalwart", "brooder"),
                                ("goofball", "braggart"), ("goofball", "fraidy"), ("goofball", "schemer"),
                                ("fraidy", "schemer"), ("goofball", "goofball")]}
COUNTER = {"boss_orders": {"stalwart"}, "gloat": {"braggart"}, "grudge": {"goofball"},
           "pretender": {"schemer", "brooder"}, "uprising": {"goofball"}}
MOTIVE_MOD = {"grudge": 1.15, "boss_orders": 1.10, "gloat": 1.00, "pretender": 1.10, "uprising": 1.00}
SHARE = {1: 0, 2: 3, 3: 10, 4: 17, 5: 21, 6: 32, **{d: 37 for d in range(7, 15)}}
FIELD = {1: 14, 2: 25, 3: 30, 4: 35, 5: 56, 6: 90, **{d: 50 for d in range(7, 15)}}
CACHE_DAYS = {2, 3, 4, 5}


COUNTER_MULT = 2.0
ESCORTS = {"grudge": 1, "boss_orders": 2, "gloat": 0, "pretender": 1, "uprising": 0}


def band(s): return 0.6 if s < 25 else (0.9 if s < 60 else 1.0)
def seen_mult(dsv): return 1.0 if dsv <= 2 else max(0.0, 1.0 - 0.2 * (dsv - 2))


def pair(a, b):
    """+1 bonded, -1 clashing, 0 neutral (Crew §3.2 rule: clash beats bond; symmetric)."""
    x, y = CATS[a][0], CATS[b][0]
    k = frozenset((x, y))
    if k in CLASH: return -1
    if k in BOND: return 1
    return 0


class Rules:
    def __init__(s, r3, post_from=4):
        s.r3, s.post_from = r3, post_from
        s.steal_mult = 2.0 if r3 else 1.0
        s.braggart_pay = 0.20 if r3 else 0.10


def social(rules, posts, p):
    """guard multiplier and Tribute bonus from adjacent posted neighbours (R3 only)."""
    if not rules.r3 or p not in posts: return 1.0, 0.0
    g, b = 1.0, 0.0
    for q in NEIGH[p]:
        if q in posts:
            rel = pair(posts[p], posts[q])
            if rel > 0: g += 0.25
            elif rel < 0: g -= 0.25; b -= 0.10
    return g, b


def p_hold(rules, posts, p, scent, raid):
    motive, attack = raid["motive"], raid["attack"]
    cat = posts.get(p)
    if cat is None: st_term = 0.0
    else:
        pers, style, guard, _ = CATS[cat]
        cm = COUNTER_MULT if (rules.r3 and pers in COUNTER[motive]) else 1.0
        sg, _ = social(rules, posts, p)
        st_term = 1.5 * style * guard * cm * sg / attack
    R = st_term + (0 if motive == "uprising" else 0.005 * scent) + (0.15 if p == "LPY" else 0)
    return min(0.95, max(0.05, R ** 3 / (R ** 3 + 1)))


def patch_pay(rules, p, s, posts, humbled, full_house, dsv):
    _, soc_b = social(rules, posts, p)
    bonus = (rules.braggart_pay if (p in posts and CATS[posts[p]][0] == "braggart") else 0) + \
            (0.15 if p in humbled else 0) + (0.10 if full_house else 0)
    bonus = min(bonus, 0.35) + soc_b
    wm = 1.0 if p in posts else 0.8
    return seen_mult(dsv[p]) * YIELD[p] * band(s) * wm * (1 + bonus)


def make_raid(rules, rng, tgt, d):
    if not rules.r3:
        return dict(patch=tgt, motive="grudge" if rng.random() < 0.5 else "boss_orders",
                    attack=1.15 if rng.random() < 0.5 else 2.2)
    if d == 3:   # scripted first raid: the arc lead, a Tough, motive grudge (+0-1 escort)
        motive, lead = "grudge", 1.0
    else:
        x = rng.random()
        motive = "grudge" if x < 0.40 else "boss_orders" if x < 0.65 else "gloat" if x < 0.85 else "pretender"
        lead = 1.5 if rng.random() < 0.30 else 1.0
    esc = 0.6 * ESCORTS[motive]
    return dict(patch=tgt, motive=motive, attack=MOTIVE_MOD[motive] * (lead + esc))


def expected_night(rules, held, posts, raid, humbled, dsv):
    """Expected Tribute tonight for a candidate posting (used by the 'best' policy)."""
    full_house = len(held) == 5
    tot = 0.0
    for p, s in held.items():
        sc = s - int((10 + 2 * sum(1 for q in NEIGH[p] if q not in held)) * (0.5 if p == "LWC" else 1)) + \
             (CATS[posts[p]][3] if p in posts else 0)
        pay = patch_pay(rules, p, sc, posts, humbled, full_house, dsv)
        if raid and raid["patch"] == p:
            ph = p_hold(rules, posts, p, sc, raid)
            lost_ok = not (sc >= 60 or (len([q for q in OUTER if q in held]) >= 3 and "DEN" not in held and p != "DEN"))
            rep = ph * ph; scuff = ph - rep if lost_ok else 1 - rep; lost = (1 - ph) if lost_ok else 0
            tot += rep * pay + scuff * (pay - rules.steal_mult * pay) + lost * 0
        else:
            tot += pay
    return tot


def post_best(rules, held, raid, d, crew, humbled, dsv, rng):
    best, bv = {}, expected_night(rules, held, {}, raid, humbled, dsv)
    pats = list(held)
    for k in (1, 2):
        for ps in itertools.permutations(pats, k):
            for cs in itertools.permutations(crew, k):
                posts = dict(zip(ps, cs))
                v = expected_night(rules, held, posts, raid, humbled, dsv)
                if v > bv + 1e-9: best, bv = posts, v
    return best


def post_habit(rules, held, raid, d, crew, humbled, dsv, rng):
    cand = [p for p in held if p != "LWC"]
    if not cand: return {}
    first = raid["patch"] if (raid and raid["patch"] in held) else min(cand, key=lambda q: held[q])
    order = [c for c in ("Hige", "Togemaru", "Pon", "Kagi", "Kinako") if c in crew]
    if not order: return {}
    posts = {first: order[0]}
    rest = [p for p in cand if p not in posts]
    if rest and len(order) > 1: posts[max(rest, key=lambda q: YIELD[q])] = order[1]
    return posts


def post_random(rules, held, raid, d, crew, humbled, dsv, rng):
    cand = list(held)
    if not cand: return {}
    ps = rng.sample(cand, min(2, len(cand))); cs = rng.sample(crew, min(2, len(crew)))
    return dict(zip(ps, cs))


def post_none(*a): return {}


def crew_on(d):
    c = ["Hige", "Togemaru", "Kinako", "Pon"] if d >= 3 else ["Hige", "Togemaru"]
    if d >= 5: c.append("Kagi")
    return c


def run(rules, poster, seed, days=7, claims=None, visit_p=1.0, spray_p=1.0, field_mult=1.0, goes_out=lambda d: True):
    rng = random.Random(seed); prng = random.Random(seed * 7 + 1)
    claims = claims or {1: "LWC", 2: "LPY", 3: "PA", 5: "TSS", 6: "DEN"}
    held, dsv = {}, {p: 99 for p in YIELD}
    stash, log, raid, humbled, den_claimed = 0, [], None, set(), False
    routed = set()   # Sentries Routed-for-a-night by last night's Scuffed (§3.6): not postable tonight
    for d in range(1, days + 1):
        trib = log[-1]["tribute"] if log else 0
        stash = min(400, stash + trib)
        if d >= 2 and stash >= SHARE[d]: stash -= SHARE[d]
        visited = set()
        if goes_out(d):
            if d in claims:
                p = claims[d]; held[p] = 70; visited.add(p)
                if p == "DEN": den_claimed = True; humbled.add("DEN")
            for p in list(held):
                if rng.random() < visit_p:
                    visited.add(p)
                    if held[p] < 60 and rng.random() < spray_p: held[p] = 90
        for p in YIELD: dsv[p] = 0 if p in visited else dsv[p] + 1
        stash = min(400, stash + round(FIELD[d] * field_mult * goes_out(d)) + (10 if d in CACHE_DAYS and goes_out(d) else 0))
        posts = poster(rules, held, raid if (raid and raid["patch"] in held) else None, d,
                       [c for c in crew_on(d) if c not in routed], humbled, dsv, prng) \
            if d >= rules.post_from else {}
        # step 2
        for p in list(held):
            rivals = sum(1 for q in NEIGH[p] if q not in held)
            dec = int((10 + 2 * rivals) * (0.5 if p == "LWC" else 1))
            held[p] = min(100, max(10 if p == "LWC" else 0, held[p] - dec + (CATS[posts[p]][3] if p in posts else 0)))
            if held[p] == 0: del held[p]
        stash -= min(2 * len(posts), stash)
        outcome, scuffed, raided, new_routed = None, set(), None, set()
        if raid and raid["patch"] in held:
            raided = raid["patch"]
            p = raid["patch"]
            outer_held = sum(1 for q in OUTER if q in held)
            den_open = (not den_claimed) and outer_held >= 3
            ph = p_hold(rules, posts, p, held[p], raid)
            u = rng.random()
            outcome = "Repelled" if u < ph * ph else ("Scuffed" if u < ph else "Lost")
            if outcome == "Lost" and (held[p] >= 60 or (den_open and p != "DEN") or raid["motive"] == "gloat"):
                outcome = "Scuffed"
            if outcome == "Repelled": held[p] = max(0, held[p] - 5)
            elif outcome == "Scuffed":
                held[p] = max(0, held[p] - 20); scuffed.add(p)
                if p in posts and CATS[posts[p]][0] not in ("fraidy", "brooder"): new_routed.add(posts[p])
            else: del held[p]
        routed = new_routed
        # step 3: tomorrow's raid (Nemesis fix 2: every night from night 3, lowest-Scent admissible)
        raid = None
        outer_held = sum(1 for q in OUTER if q in held)
        adm = [q for q in held if q != "LWC" and (q != "DEN" or outer_held < 3) and q != raided]
        if d >= 3 and adm:
            raid = make_raid(rules, rng, min(adm, key=lambda q: held[q]), d)
        # step 4
        full_house = len(held) == 5
        t = 0.0
        for q, s in held.items():
            pay = patch_pay(rules, q, s, posts, humbled, full_house, dsv)
            t += pay * (1 - rules.steal_mult) if q in scuffed else pay
        log.append(dict(day=d, tribute=max(0, int(t)), stash=stash, raid=(outcome or "-")))
    return log


def table(rules, label, n=2000):
    print(f"\n### {label}")
    print("| Posting policy | Tribute days 1-7 | Tribute nights 4-7 | Scuffed nights | Lost nights | Day-6 Tribute (anchor) | Min Stash |")
    print("|---|---|---|---|---|---|---|")
    out = {}
    for nm, fn in (("best (reads the forecast)", post_best), ("habit (Stalwart on forecast + Braggart richest)", post_habit),
                   ("random 2 cats on 2 Patches", post_random), ("no posts", post_none)):
        runs = [run(rules, fn, s) for s in range(n)]
        tot = st.mean(sum(r["tribute"] for r in x) for x in runs)
        t47 = st.mean(sum(r["tribute"] for r in x[3:7]) for x in runs)
        sc = st.mean(sum(1 for r in x if r["raid"] == "Scuffed") for x in runs)
        lo = st.mean(sum(1 for r in x if r["raid"] == "Lost") for x in runs)
        d6 = st.mean(x[5]["tribute"] for x in runs)
        ms = min(min(r["stash"] for r in x) for x in runs)
        out[nm.split()[0]] = (tot, t47)
        print(f"| {nm} | {tot:.0f} | {t47:.0f} | {sc:.2f} | {lo:.2f} | {d6:.1f} | {ms} |")
    b, r_, h, z = out["best"], out["random"], out["habit"], out["no"]
    print(f"best vs random: +{(b[0]/r_[0]-1):.0%} slice, +{(b[1]/r_[1]-1):.0%} nights 4-7 | "
          f"best vs habit: +{(b[0]/h[0]-1):.0%} / +{(b[1]/h[1]-1):.0%} | best vs none: +{(b[0]/z[0]-1):.0%} / +{(b[1]/z[1]-1):.0%}")
    return out


if __name__ == "__main__":
    table(Rules(False, post_from=3), "R2 as written (posts from night 3; round-2 S7 baseline)")
    table(Rules(False, post_from=4), "R2 rules, posts from night 4 (Sentries taught on L2D2)")
    table(Rules(True, post_from=4), "R3 proposal (posts from night 4)")
    # casual and sleep-skip under R3
    R3 = Rules(True)
    cas = [run(R3, post_random, s, 8, claims={1: "LWC", 2: "LPY", 4: "PA", 6: "TSS", 8: "DEN"}, visit_p=0.6, spray_p=0.5,
               field_mult=0.75) for s in range(2000)]
    print("\nR3 casual (random posts, slower claims, 60% visits, half the Sprays): Tribute per night d3-d8 =",
          [round(st.mean(x[i]["tribute"] for x in cas), 1) for i in range(2, 8)],
          "min Stash", min(min(r["stash"] for r in x) for x in cas))
    sk = [run(R3, post_none, s, 10, claims={1: "LWC", 2: "LPY"}, goes_out=lambda d: d <= 2) for s in range(2000)]
    print("R3 sleep-skip from day 3: Tribute per night d3-d10 =", [round(st.mean(x[i]["tribute"] for x in sk), 1) for i in range(2, 10)])
    # which cats does 'best' pick, by motive (night 4-7)?
    from collections import Counter
    pick = Counter()
    for s in range(400):
        rng = random.Random(s)
        held = {"LWC": 60, "LPY": 70, "PA": 66, "TSS": 64}
        for motive in ("grudge", "boss_orders", "gloat", "pretender"):
            raid = dict(patch="TSS", motive=motive, attack=MOTIVE_MOD[motive] * (1.0 + (0.6 if motive == "boss_orders" else 0)))
            posts = post_best(R3, held, raid, 5, crew_on(5), set(), {p: 0 for p in YIELD}, rng)
            pick[(motive, posts.get("TSS", "-"))] += 1
    print("R3 best guard on the forecast Patch, by motive (night-5 board):",
          ", ".join(f"{m}: {c}" for (m, c), _ in sorted(pick.items())))

#!/usr/bin/env python3
"""Owner-feedback pass (2026-11-24): Territory and the food-tax economy under the owner rulings.

Successor to round-3 `posting_stakes_sim.py` (copied, then updated).  Encodes
`design/gdd/territory-management.md` as revised for `design/reviews/owner-feedback-rulings.md`:

  OR-01/02  a Posse wipe ends the day: 20% of the day's field haul is lost (none in Life 1),
            the Stash and Tribute are untouched, no Mark Over, no Snatch, no territory change.
  OR-08     district influence I = round(100 * sum_{outer held} min(scent,60)/60 / 4); Scent moves
            only through territory acts, NPC raids, challenger over-marks and time.  No Rout
            erosion, no wipe +30, no Caterwaul +10 (the presence rule instead: Sentry term x1.5,
            Mikan stands in for an Unwatched post, whatever happens in the brawl).
  OR-09     influence 100 opens the Boss window (checked after any Scent change and at step 2);
            it stays open while I >= 75 at step 2; no outer Patch is Lost while it is open; the
            Boss is fought on his patrol, then the Den is Claim Sprayed.  The Den gate is gone.
  OR-10/14  newcomers: a keeperless Patch still keeperless on a town-event night (F6: n+2+b)
            gets a freshly generated Keeper at rival Scent 60.
  OR-15     Humble removed: no Humbled Tribute bonus; the Goofball "laughs off a challenge".
  OR-16     challengers: first on the 2nd night after Mikan first holds >= 3 Lane Patches, then
            every 4th night after the first (skipped while one is active); <= 1 active; target =
            lowest-Scent held Patch (never LWC or the Den; ties: higher yield); over-mark -10 a
            night from the night after arrival (a posted Goofball: 0); takes the raid slot
            (`challenge`, leader + 1 Stray, motive_mod 1.10, counters Schemer and Brooder);
            Lost -> it is the Keeper; Repelled twice -> Gone; Routed by day -> Verdict, Gone.
  OR-19/21  `boss_orders` -> `gang_orders`; `pretender` and `uprising` deleted.

Players: engaged reference (Day Loop path: Daifuku lost on L2D4, claimed on L2D5), posting
variants (best / habit / random / none), casual, and exploit seekers (sleep-skip, rub-skip,
patrol-skip with Settle In, deliberate wipe-skip, struggler).  Observations only, no verdicts.
Usage: python3 -I territory_economy_sim.py   (2,000 seeds per table; about 2-4 minutes)
"""
import random, statistics as st, itertools
from collections import Counter

YIELD = {"LWC": 8, "LPY": 10, "PA": 12, "TSS": 14, "DEN": 18}
NEIGH = {"LWC": ["LPY", "PA"], "LPY": ["LWC", "PA", "DEN"], "PA": ["LWC", "LPY", "TSS"],
         "TSS": ["PA", "DEN"], "DEN": ["LPY", "TSS"]}
OUTER = ["LWC", "LPY", "PA", "TSS"]          # the influence Patches (the Den is the Boss's seat)
CATS = {  # Crew §3.3 sheets: (personality, style_mod, guard_mod, refresh)
    "Hige": ("stalwart", 1.25, 1.50, 10),
    "Togemaru": ("braggart", 1.10, 1.25, 10),
    "Kinako": ("fraidy", 1.10, 0.75, 10),
    "Pon": ("goofball", 1.00, 1.00, 14),
    "Kagi": ("schemer", 1.00, 1.00, 14),
}
MIKAN = ("mikan", 1.10, 1.00, 0)              # presence rule stand-in on an Unwatched post
CLASH = {frozenset(p) for p in [("stalwart", "schemer"), ("braggart", "fraidy"), ("brooder", "schemer"),
                                 ("brooder", "goofball"), ("braggart", "braggart")]}
BOND = {frozenset(p) for p in [("stalwart", "fraidy"), ("stalwart", "goofball"), ("stalwart", "brooder"),
                                ("goofball", "braggart"), ("goofball", "fraidy"), ("goofball", "schemer"),
                                ("fraidy", "schemer"), ("goofball", "goofball")]}
COUNTER = {"gang_orders": {"stalwart"}, "gloat": {"braggart"}, "grudge": {"goofball"},
           "challenge": {"schemer", "brooder"}}
MOTIVE_MOD = {"grudge": 1.15, "gang_orders": 1.10, "gloat": 1.00, "challenge": 1.10}
ESCORTS = {"grudge": 1, "gang_orders": 2, "gloat": 0, "challenge": 1}
MIX = (("grudge", 0.45), ("gang_orders", 0.30), ("gloat", 0.25))   # pretender share folded in (Nemesis owns it)
COUNTER_MULT, PRESENCE = 2.0, 1.5
SHARE = {1: 0, 2: 3, 3: 10, 4: 17, 5: 21, 6: 32, **{d: 37 for d in range(7, 15)}}
FIELD = {1: 14, 2: 25, 3: 30, 4: 35, 5: 56, 6: 40, 7: 40, **{d: 50 for d in range(8, 15)}}  # Boss loot added on the win
BOSS_LOOT, CHALLENGER_LOOT = 50, 4
CACHE_DAYS = {2, 3, 4, 5}
STEAL = 2.0


def band(s): return 0.6 if s < 25 else (0.9 if s < 60 else 1.0)
def seen_mult(dsv): return 1.0 if dsv <= 2 else max(0.0, 1.0 - 0.2 * (dsv - 2))
def influence(held): return round(100 * sum(min(held[p], 60) / 60 for p in OUTER if p in held) / 4)


def pair(a, b):
    k = frozenset((CATS[a][0], CATS[b][0]))
    return -1 if k in CLASH else (1 if k in BOND else 0)


def social(posts, p):
    if p not in posts: return 1.0, 0.0
    g, b = 1.0, 0.0
    for q in NEIGH[p]:
        if q in posts:
            r = pair(posts[p], posts[q])
            if r > 0: g += 0.25
            elif r < 0: g -= 0.25; b -= 0.10
    return g, b


def p_hold(posts, p, scent, raid, presence=False):
    guard = CATS[posts[p]] if p in posts else (MIKAN if presence else None)
    if guard is None: st_term = 0.0
    else:
        pers, style, gm, _ = guard
        cm = COUNTER_MULT if pers in COUNTER[raid["motive"]] else 1.0
        sg = social(posts, p)[0] if p in posts else 1.0
        st_term = 1.5 * style * gm * cm * sg / raid["attack"] * (PRESENCE if presence else 1.0)
    R = st_term + 0.005 * scent + (0.15 if p == "LPY" else 0)
    return min(0.95, max(0.05, R ** 3 / (R ** 3 + 1)))


def patch_pay(p, s, posts, full_house, dsv):
    soc_b = social(posts, p)[1]
    bonus = (0.10 if (p in posts and CATS[posts[p]][0] == "braggart") else 0) + (0.10 if full_house else 0)
    return seen_mult(dsv[p]) * YIELD[p] * band(s) * (1.0 if p in posts else 0.8) * (1 + min(bonus, 0.35) + soc_b)


def rivals_next_to(p, held, other):
    return sum(1 for q in NEIGH[p] if q not in held and other[q]["kind"] != "open")


def decay(p, held, other, posts):
    brooder = 0.5 if (p in posts and CATS[posts[p]][0] == "brooder") else 1.0
    return int((10 + 2 * rivals_next_to(p, held, other)) * (0.5 if p == "LWC" else 1) * brooder)


def lost_blocked(p, scent, window, motive):
    return scent >= 60 or (window and p in OUTER) or motive == "gloat"


def make_raid(rng, tgt, d):
    if d == 3: motive, lead = "grudge", 1.0          # scripted first raid (Nemesis names the requester)
    else:
        x, acc = rng.random(), 0.0
        motive = MIX[-1][0]
        for m, w in MIX:
            acc += w
            if x < acc: motive = m; break
        lead = 1.5 if rng.random() < 0.30 else 1.0
    return dict(patch=tgt, motive=motive, attack=MOTIVE_MOD[motive] * (lead + 0.6 * ESCORTS[motive]))


def challenge_raid(tgt):
    return dict(patch=tgt, motive="challenge", attack=MOTIVE_MOD["challenge"] * (1.0 + 0.6))


# ---------------------------------------------------------------- posting policies
def expected_night(held, other, posts, raid, ch, window, dsv):
    full_house = len(held) == 5
    tot = -2.0 * len(posts)
    for p, s in held.items():
        sc = max(0, s - decay(p, held, other, posts) + (CATS[posts[p]][3] if p in posts else 0))
        if ch and ch["target"] == p and not (p in posts and CATS[posts[p]][0] == "goofball"): sc = max(0, sc - 10)
        pay = patch_pay(p, sc, posts, full_house, dsv)
        if raid and raid["patch"] == p:
            ph = p_hold(posts, p, sc, raid)
            rep = ph * ph
            if lost_blocked(p, sc, window, raid["motive"]): tot += rep * pay + (1 - rep) * (1 - STEAL) * pay
            else: tot += rep * pay + (ph - rep) * (1 - STEAL) * pay - (1 - ph) * (STEAL * pay + pay)
        else: tot += pay
    return tot


def post_best(held, other, raid, ch, window, crew, dsv, rng):
    best, bv = {}, expected_night(held, other, {}, raid, ch, window, dsv)
    for k in (1, 2):
        for ps in itertools.permutations(list(held), k):
            for cs in itertools.permutations(crew, k):
                posts = dict(zip(ps, cs))
                v = expected_night(held, other, posts, raid, ch, window, dsv)
                if v > bv + 1e-9: best, bv = posts, v
    return best


def post_habit(held, other, raid, ch, window, crew, dsv, rng):
    cand = [p for p in held if p != "LWC"]
    order = [c for c in ("Hige", "Togemaru", "Pon", "Kagi", "Kinako") if c in crew]
    if not cand or not order: return {}
    first = raid["patch"] if raid else min(cand, key=lambda q: held[q])
    posts = {first: order[0]}
    rest = [p for p in cand if p not in posts]
    if rest and len(order) > 1: posts[max(rest, key=lambda q: YIELD[q])] = order[1]
    return posts


def post_random(held, other, raid, ch, window, crew, dsv, rng):
    if not held or not crew: return {}
    ps = rng.sample(list(held), min(2, len(held))); cs = rng.sample(crew, min(2, len(crew)))
    return dict(zip(ps, cs))


def post_none(*a): return {}


# ---------------------------------------------------------------- one run
def run(pol, seed, days=7):
    rng = random.Random(seed)                  # world (raids, motives, schedule)
    prng = random.Random(seed * 7 + 1)         # player behaviour
    held, dsv = {}, {p: 99 for p in YIELD}
    other = {p: dict(kind="gang", scent=(100 if p == "DEN" else 80), stale=0) for p in YIELD}
    stash, log, raid = 0, [], None
    window, den_claimed, boss_tries, window_day, claim_day = False, False, 0, None, None
    ch, ch_seen_day, first3, next_ch, ch_log = None, None, None, None, Counter()
    next_te = 3 + rng.randint(0, 1)
    lessons, bribed, routed, last_raided = 0, False, set(), None
    crew = ["Hige", "Togemaru"]
    claims = pol["claims"]
    for d in range(1, days + 1):
        row = dict(day=d, spend=0, rot=0, wiped=False, field=0)
        trib = log[-1]["tribute"] if log else 0
        stashed = min(trib, 400 - stash); stash += stashed; row["rot"] = trib - stashed
        if d >= 2 and pol["share"](d) and stash >= SHARE[d]: stash -= SHARE[d]; row["spend"] += SHARE[d]
        if d in pol["lesson_days"] and lessons < len(pol["lesson_days"]):
            price = 40 if lessons < 2 else 120
            if stash >= price: stash -= price; row["spend"] += price; lessons += 1
        if d >= 3:
            for c in ("Kinako", "Pon"):
                if c not in crew: crew.append(c)
        if ch:
            ch["armed"] = True                                 # active from the morning after it arrives
            if ch_seen_day is None: ch_seen_day = d            # the Sniff announces it this morning
        out = pol["goes_out"](d)
        # ---- the street
        visited, claimed_today, field_frac, extra_loot = set(), set(), 1.0, 0
        if out:
            # reclaim keeperless posts (Claim Spray, no fight) and retake taken ones (Stale Claim / newcomer)
            for p in list(other):
                o = other[p]
                if p == "DEN" or p in held: continue
                was_ours = o.get("was_ours", False)
                if o["kind"] == "open" and was_ours and prng.random() < pol["visit_p"]:
                    held[p] = 70; del other[p]; visited.add(p); claimed_today.add(p)
                elif o["kind"] in ("outsider", "gang") and was_ours and prng.random() < pol["retake_p"]:
                    held[p] = 70; del other[p]; visited.add(p); claimed_today.add(p); extra_loot += 3
            if d in claims and claims[d] not in held and pol["wins"](d):
                p = claims[d]; held[p] = 70; other.pop(p, None); visited.add(p); claimed_today.add(p)
                if p == "TSS" and "Kagi" not in crew:
                    if pol["bribe"] and stash >= 96: stash -= 96; row["spend"] += 96; bribed = True
                    crew.append("Kagi")
            for p in list(held):
                if (pol.get("visit_only") is None or p in pol["visit_only"]) and prng.random() < pol["visit_p"]:
                    visited.add(p)
                    if held[p] < 60 and prng.random() < pol["spray_p"]: held[p] = 90
            if not den_claimed and influence(held) >= 100 and not window:
                window = True
            if window and window_day is None: window_day = d
            # the challenger by day (optional fight; beating it adds no Scent, G5)
            if ch and ch["armed"] and prng.random() < pol["fight_ch_p"]:
                visited.add(ch["target"]); ch_log["beaten_by_day"] += 1; extra_loot += CHALLENGER_LOOT
                if raid and raid["motive"] == "challenge": raid = None
                ch = None
            # deliberate or forced wipes (OR-01: the day ends; -20% of the haul; Life 1 exempt)
            if pol.get("wipe_from") and d >= pol["wipe_from"]:
                field_frac = pol["wipe_frac"] * (0.8 if d >= 3 else 1.0); row["wiped"] = True
            elif pol.get("settle_from") and d >= pol["settle_from"]:
                field_frac = pol["settle_frac"]
            # the Boss on his patrol
            if window and not den_claimed and pol["boss_win_on"] and not row["wiped"] and d >= pol.get("boss_from", 1):
                boss_tries += 1
                if boss_tries >= pol["boss_win_on"]:
                    held["DEN"] = 70; other.pop("DEN", None); den_claimed = True; window = False
                    claim_day = d; claimed_today.add("DEN"); visited.add("DEN"); extra_loot += BOSS_LOOT
                else:
                    field_frac *= 0.75 * 0.8; row["wiped"] = True
        for p in YIELD: dsv[p] = 0 if p in visited else dsv[p] + 1
        # ---- posting for tonight (Turf Board, taught on L2D2 = day 4; the post-claim prompt included)
        tonight = raid if (raid and raid["patch"] in held) else None
        posts = pol["post"](held, other, tonight, ch, window, [c for c in crew if c not in routed], dsv, prng) \
            if (d >= 4 and out and pol["posts"]) else {}
        if out:
            row["field"] = round(FIELD[d] * pol["field_mult"] * field_frac) + extra_loot + \
                (10 if (d in CACHE_DAYS and pol["caches"] and not row["wiped"]) else 0)
            stash = min(400, stash + row["field"])
        # ---- night step 2: decay and refresh, challenger over-mark, upkeep, raid, influence/window
        for p in list(held):
            ref = CATS[posts[p]][3] if p in posts else 0
            held[p] = min(100, max(10 if p == "LWC" else 0, held[p] - decay(p, held, other, posts) + ref))
        if ch and ch["armed"] and ch["target"] in held:
            p = ch["target"]
            if not (p in posts and CATS[posts[p]][0] == "goofball"):
                held[p] = max(0, held[p] - 10)
        for p in list(held):
            if held[p] == 0:
                del held[p]; other[p] = dict(kind="open", scent=0, stale=0, was_ours=True)
        stash -= min(2 * len(posts), stash)
        outcome, scuffed, lost_pay, new_routed = None, set(), 0.0, set()
        if raid and raid["patch"] in held and raid["patch"] not in claimed_today:
            p = raid["patch"]
            pres = pol["presence"](d) and prng.random() < 0.8
            ph = p_hold(posts, p, held[p], raid, pres)
            u = rng.random()
            outcome = "Repelled" if u < ph * ph else ("Scuffed" if u < ph else "Lost")
            if outcome == "Lost" and lost_blocked(p, held[p], window, raid["motive"]): outcome = "Scuffed"
            if outcome == "Repelled":
                held[p] = max(0, held[p] - 5)
            elif outcome == "Scuffed":
                held[p] = max(0, held[p] - 20); scuffed.add(p)
                if p in posts and CATS[posts[p]][0] not in ("fraidy", "brooder"): new_routed.add(posts[p])
            else:
                lost_pay = STEAL * patch_pay(p, held[p], posts, False, dsv)
                del held[p]
                other[p] = dict(kind="outsider" if raid["motive"] == "challenge" else "gang", scent=40, stale=3,
                                was_ours=True)
            if raid["motive"] == "challenge" and ch:
                ch_log["challenge_raids"] += 1
                if outcome == "Repelled":
                    ch["repelled"] += 1
                    if ch["repelled"] >= 2: ch_log["left_after_2_repels"] += 1; ch = None
                elif outcome == "Lost":
                    ch_log["took_the_patch"] += 1; ch = None
            if p in held and held[p] == 0:
                del held[p]; other[p] = dict(kind="open", scent=0, stale=0, was_ours=True)
        routed, last_raided = new_routed, (raid["patch"] if outcome else None)
        if ch and ch["target"] not in held and ch["armed"]:            # its post lapsed or fell: it settles there
            other[ch["target"]] = dict(kind="outsider", scent=60, stale=0, was_ours=True); ch_log["took_the_patch"] += 1
            ch = None
        for p, o in other.items():
            if o["kind"] in ("gang", "outsider"):
                ceil = 60 if o["stale"] > 0 else (100 if p == "DEN" else 80)
                o["scent"] = min(ceil, o["scent"] + 8); o["stale"] = max(0, o["stale"] - 1)
        I = influence(held)
        if window and I < 75: window = False
        if not den_claimed and I >= 100: window = True
        # ---- night step 3: town events (newcomers), the challenger calendar, tomorrow's raid
        if d == next_te:
            opens = [p for p in OUTER if p in other and other[p]["kind"] == "open"]
            if opens:
                p = max(opens, key=lambda q: YIELD[q])
                other[p] = dict(kind="outsider", scent=60, stale=0, was_ours=other[p].get("was_ours", False))
                ch_log["newcomers"] += 1
            next_te = d + 2 + rng.randint(0, 1)
        if first3 is None and len(held) >= 3: first3 = d; next_ch = d + 2
        if next_ch is not None and d == next_ch:
            if ch is None:
                cand = [p for p in held if p not in ("LWC", "DEN")]
                if cand:
                    tgt = min(cand, key=lambda q: (held[q], -YIELD[q]))
                    ch = dict(target=tgt, repelled=0, armed=False, night=d); ch_log["arrivals"] += 1
                    ch_log.setdefault("first_night", d)
            next_ch = d + 4
        raid = None
        if ch and ch["target"] in held:
            raid = challenge_raid(ch["target"])
        elif d >= 3:
            adm = [q for q in held if q != "LWC" and q != last_raided and (q != "DEN" or I < 75)]
            if adm: raid = make_raid(rng, min(adm, key=lambda q: held[q]), d)
        # ---- night step 4: Tribute
        full_house = len(held) == 5
        t = 0.0
        for q, s in held.items():
            pay = patch_pay(q, s, posts, full_house, dsv)
            t += pay * (1 - STEAL) if q in scuffed else pay
        t -= lost_pay
        row.update(tribute=max(0, int(t)), stash=stash, held=len(held), infl=I, window=window,
                   den=den_claimed, raid=outcome or "-", ch_active=ch is not None, posts=len(posts))
        log.append(row)
    return log, dict(window_day=window_day, claim_day=claim_day, ch_seen_day=ch_seen_day, ch=ch_log,
                     first_ch_night=ch_log.get("first_night"))


# ---------------------------------------------------------------- players
ENGAGED = dict(claims={1: "LWC", 2: "LPY", 3: "PA", 5: "TSS"}, wins=lambda d: True, share=lambda d: True,
               lesson_days=(4, 6, 7), bribe=True, goes_out=lambda d: True, visit_p=1.0, spray_p=1.0,
               field_mult=1.0, caches=True, post=post_best, posts=True, fight_ch_p=0.7, retake_p=1.0,
               boss_win_on=2, boss_from=6, presence=lambda d: d == 4)
CASUAL = dict(ENGAGED, claims={1: "LWC", 2: "LPY", 4: "PA", 6: "TSS"}, share=lambda d: d % 2 == 0,
              lesson_days=(5, 8), bribe=False, visit_p=0.6, spray_p=0.5, field_mult=0.75, post=post_random,
              fight_ch_p=0.3, retake_p=0.5, boss_from=1, presence=lambda d: False)
SLEEP_SKIP = dict(ENGAGED, claims={1: "LWC", 2: "LPY"}, share=lambda d: False, lesson_days=(), bribe=False,
                  goes_out=lambda d: d <= 2, posts=False, boss_win_on=None, fight_ch_p=0.0, retake_p=0.0)
RUB_SKIP = dict(SLEEP_SKIP, goes_out=lambda d: True, visit_p=1.0, spray_p=0.0, field_mult=1.0, caches=False,
                settle_from=3, settle_frac=0.0, visit_only={"LWC"})
PATROL_SETTLE = dict(ENGAGED, claims={1: "LWC", 2: "LPY", 3: "PA"}, lesson_days=(), bribe=False,
                     settle_from=4, settle_frac=0.10, boss_win_on=None, fight_ch_p=0.0, caches=False)
WIPE_SKIP = dict(PATROL_SETTLE, settle_from=None, wipe_from=4, wipe_frac=0.10)   # same morning, then throws the 1st fight
STRUGGLER = dict(CASUAL, claims={1: "LWC", 2: "LPY", 5: "PA", 8: "TSS"}, posts=False, wipe_from=3, wipe_frac=0.5,
                 boss_win_on=None, fight_ch_p=0.0)


def runs(pol, n=2000, days=7): return [run(pol, s, days) for s in range(n)]


def m(xs): return st.mean(xs) if xs else float("nan")


def day_table(title, rs, days):
    print(f"\n### {title}  ({len(rs)} seeds; means)")
    print("| Day | Tribute (that night) | Field+cache | Spend | Stash end (min) | Patches held | Influence | Window open | Challenger active | Raid: Rep/Scuff/Lost | Wiped |")
    print("|---|---|---|---|---|---|---|---|---|---|---|")
    n = len(rs)
    for i in range(days):
        rows = [r[0][i] for r in rs]
        c = Counter(r["raid"] for r in rows)
        print(f"| {i+1} | {m([r['tribute'] for r in rows]):.1f} | {m([r['field'] for r in rows]):.0f} | {m([r['spend'] for r in rows]):.0f} | "
              f"{m([r['stash'] for r in rows]):.0f} ({min(r['stash'] for r in rows)}) | {m([r['held'] for r in rows]):.2f} | "
              f"{m([r['infl'] for r in rows]):.0f} | {sum(r['window'] for r in rows)/n:.2f} | {sum(r['ch_active'] for r in rows)/n:.2f} | "
              f"{c['Repelled']/n:.2f}/{c['Scuffed']/n:.2f}/{c['Lost']/n:.2f} | {sum(r['wiped'] for r in rows)/n:.2f} |")
    meta = [r[1] for r in rs]
    wd = [x["window_day"] for x in meta if x["window_day"]]; cd = [x["claim_day"] for x in meta if x["claim_day"]]
    cs = [x["ch_seen_day"] for x in meta if x["ch_seen_day"]]
    tot = m([sum(r["tribute"] for r in x[0]) for x in rs]); inc = m([sum(r["tribute"] + r["field"] for r in x[0]) for x in rs])
    print(f"Tribute computed {tot:.0f}; income (Tribute + field + caches) {inc:.0f}; rotted {m([sum(r['rot'] for r in x[0]) for x in rs]):.0f}; "
          f"window opened in {len(wd)/n:.0%} of runs (mean day {m(wd):.2f}); District claimed in {len(cd)/n:.0%} (mean day {m(cd):.2f}); "
          f"challenger announced in {len(cs)/n:.0%} (mean Sniff day {m(cs):.2f})")
    agg = Counter()
    for x in meta: agg.update(x["ch"])
    print("Challenger outcomes per run: " + ", ".join(f"{k} {v/n:.2f}" for k, v in sorted(agg.items()) if k != "first_night"))
    return rs


def posting_table(n=2000):
    print("\n### Posting stakes under the owner rulings (engaged player otherwise; posts from night 4)")
    print("| Posting policy | Tribute days 1-7 | Tribute nights 4-7 | Scuffed nights | Lost nights | Claim-night Tribute (night 7) | Min Stash | Window open nights 6-7 | Challenger left (2 repels) |")
    print("|---|---|---|---|---|---|---|---|---|")
    out = {}
    for nm, fn in (("best (reads the forecast)", post_best), ("habit (Stalwart on forecast + Braggart richest)", post_habit),
                   ("random 2 cats on 2 Patches", post_random), ("no posts", post_none)):
        rs = runs(dict(ENGAGED, post=fn, fight_ch_p=0.0), n)       # challenger left to the night, to expose posting
        tot = m([sum(r["tribute"] for r in x[0]) for x in rs]); t47 = m([sum(r["tribute"] for r in x[0][3:7]) for x in rs])
        sc = m([sum(1 for r in x[0] if r["raid"] == "Scuffed") for x in rs]); lo = m([sum(1 for r in x[0] if r["raid"] == "Lost") for x in rs])
        d7 = m([x[0][6]["tribute"] for x in rs]); ms = min(min(r["stash"] for r in x[0]) for x in rs)
        wn = m([sum(1 for r in x[0][5:7] if r["window"] or r["den"]) for x in rs])
        left = m([x[1]["ch"]["left_after_2_repels"] for x in rs])
        out[nm.split()[0]] = (tot, t47)
        print(f"| {nm} | {tot:.0f} | {t47:.0f} | {sc:.2f} | {lo:.2f} | {d7:.1f} | {ms} | {wn:.2f} | {left:.2f} |")
    b, r_, h, z = out["best"], out["random"], out["habit"], out["no"]
    print(f"best vs random: +{(b[0]/r_[0]-1):.0%} slice, +{(b[1]/r_[1]-1):.0%} nights 4-7 | best vs habit: +{(b[0]/h[0]-1):.0%} / "
          f"+{(b[1]/h[1]-1):.0%} | best vs none: +{(b[0]/z[0]-1):.0%} / +{(b[1]/z[1]-1):.0%}")


def defence_table(n=2000):
    print("\n### The challenger: what defending is worth (10 days; challenger 1 arrives night 5, the next is due night 9)")
    print("| Player | Defence | Staked Patch taken | Challenger left after 2 Repels | Beaten by day | Tribute nights 6-10 | Patches held night 10 | Influence night 10 | Window/claim by day 7 |")
    print("|---|---|---|---|---|---|---|---|---|")
    for who, base in (("engaged", ENGAGED), ("casual", CASUAL)):
        for nm, mod in (("posts + fights it by day", dict()), ("posts only (never fights it)", dict(fight_ch_p=0.0)),
                        ("ignores it (no posts, no fight)", dict(fight_ch_p=0.0, post=post_none))):
            rs = runs(dict(base, **mod), n, days=10)
            tk = m([x[1]["ch"]["took_the_patch"] for x in rs]); lf = m([x[1]["ch"]["left_after_2_repels"] for x in rs])
            bd = m([x[1]["ch"]["beaten_by_day"] for x in rs])
            t = m([sum(r["tribute"] for r in x[0][5:10]) for x in rs])
            h = m([x[0][9]["held"] for x in rs]); I = m([x[0][9]["infl"] for x in rs])
            wc = sum(1 for x in rs if x[1]["window_day"] and x[1]["window_day"] <= 7) / n
            print(f"| {who} | {nm} | {tk:.2f} | {lf:.2f} | {bd:.2f} | {t:.0f} | {h:.2f} | {I:.0f} | {wc:.0%} |")


def exploit_table(n=2000):
    print("\n### Exploit seekers vs the engaged player (days 1-7)")
    print("| Player | Income d1-7 (Tribute + field) | Stash end day 7 | Tribute night 7 | Patches held night 7 | District claimed by day 7 | Wiped days |")
    print("|---|---|---|---|---|---|---|")
    for nm, pol in (("engaged reference", ENGAGED), ("casual", CASUAL), ("sleep-skip from day 3", SLEEP_SKIP),
                    ("rub-skip LWC from day 3", RUB_SKIP), ("patrol + one fight + Settle In, from day 4", PATROL_SETTLE),
                    ("patrol + throw the first fight (wipe), from day 4", WIPE_SKIP), ("struggler (wipes every day from day 3, never posts)", STRUGGLER)):
        rs = runs(pol, n)
        inc = m([sum(r["tribute"] + r["field"] for r in x[0]) for x in rs])
        print(f"| {nm} | {inc:.0f} | {m([x[0][6]['stash'] for x in rs]):.0f} | {m([x[0][6]['tribute'] for x in rs]):.1f} | "
              f"{m([x[0][6]['held'] for x in rs]):.2f} | {sum(1 for x in rs if x[1]['claim_day'])/n:.0%} | {m([sum(r['wiped'] for r in x[0]) for x in rs]):.2f} |")


def struggler_floor(n=2000):
    rs = runs(STRUGGLER, n, days=12)
    print("\nStruggler, 12 days: min Stash", min(min(r["stash"] for r in x[0]) for x in rs),
          "| min Patches held", min(min(r["held"] for r in x[0]) for x in rs),
          "| min influence", min(min(r["infl"] for r in x[0]) for x in rs),
          "| Tribute per night d3-d12 =", [round(m([x[0][i]["tribute"] for x in rs]), 1) for i in range(2, 12)])
    sk = runs(SLEEP_SKIP, n, days=10)
    print("Sleep-skip from day 3: Tribute per night d3-d10 =", [round(m([x[0][i]["tribute"] for x in sk]), 1) for i in range(2, 10)],
          "| influence night 10", round(m([x[0][9]["infl"] for x in sk]), 1))


def picks():
    held = {"LWC": 60, "LPY": 70, "PA": 66, "TSS": 54}
    other = {p: dict(kind="gang", scent=80, stale=0) for p in YIELD if p not in held}
    crew = ["Hige", "Togemaru", "Kinako", "Pon", "Kagi"]
    for motive in ("grudge", "gang_orders", "gloat", "challenge"):
        for lead in ((1.0,) if motive == "challenge" else (1.0, 1.5)):
            raid = dict(patch="TSS", motive=motive, attack=MOTIVE_MOD[motive] * (lead + 0.6 * ESCORTS[motive]))
            ch = dict(target="TSS", armed=True) if motive == "challenge" else None
            for win in (False, True):
                posts = post_best(held, other, raid, ch, win, crew, {p: 0 for p in YIELD}, random.Random(1))
                print(f"Best posting, raid on TSS (Scent 54), motive {motive}, leader PR {lead}, window {'open' if win else 'shut'}: {posts}")


def wipe_vs_settle():
    # One day, same morning and the same first fight: throw it (wipe) vs win it and Settle In (clock >= 240).
    for lv, life2 in ((4, True), (8, True)):
        haul = round(1 * (1 + 0.5 * lv)) * 2     # two Toughs Routed before the choice
        print(f"Wipe vs Settle In after the same fight (Lv {lv}): Settle In keeps {haul} field + Well-Fed + Bond; "
              f"a wipe keeps {haul * 0.8:.1f}, no Well-Fed, -3 Loyalty per Routed Posse cat, clock to Night; Tribute identical")


if __name__ == "__main__":
    day_table("Engaged reference (Day Loop path: L2D4 Daifuku lost, L2D5 claim; best posting)", runs(ENGAGED, 2000, 7), 7)
    day_table("Engaged reference, extra days 8-10 (post-claim shape)", runs(ENGAGED, 2000, 10), 10)
    day_table("Casual (slower claims, 60% visits, half the rescue Sprays, random posts)", runs(CASUAL, 2000, 10), 10)
    posting_table()
    defence_table()
    exploit_table()
    struggler_floor()
    wipe_vs_settle()
    picks()

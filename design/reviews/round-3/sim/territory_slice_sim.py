#!/usr/bin/env python3
"""Round-2 check: territory-management.md slice economy (Lives 1-2, ~7 days).

Encodes the round-2 formulas: §3.1 yields, §3.2 bands, §3.3 Spray, §3.6 guard
mods, §4.1 nightly Scent, §4.2 Patch Tribute, §4.3 seen, §4.4 upkeep, §4.5 raid
auto-resolve, §4.7/§4.11 field haul, §4.8 prices, §4.9 Stash cap.

Two raid-request rules are compared, because the docs disagree:
  T = Territory §4.11 reference: one raid every night from night 3 (fires night 4)
      against the lowest-Scent admissible held Patch.
  N = Nemesis §3.12 3f: a raid only if some admissible held Patch is BELOW
      Strong (< 60) when step 3 runs, and a requester with Grudge >= 60 exists
      (p_requester, taken from nemesis_slice_sim.py output, default 0.8).

Observations only (no verdicts).  Usage: python3 -I territory_slice_sim.py
"""
import random, statistics as st

YIELD = {"LWC": 8, "LPY": 10, "PA": 12, "TSS": 14, "DEN": 18}
NEIGH = {"LWC": ["LPY", "PA"], "LPY": ["LWC", "PA", "DEN"], "PA": ["LWC", "LPY", "TSS"],
         "TSS": ["PA", "DEN"], "DEN": ["LPY", "TSS"]}
OUTER = ["LWC", "LPY", "PA", "TSS"]
STALWART = dict(style=1.25, guard=1.5, refresh=10)   # Hige, Stalwart Bruiser
BRAGGART = dict(style=1.10, guard=1.25, refresh=10)  # Togemaru, Braggart Scrapper
FRAIDY = dict(style=1.10, guard=0.75, refresh=10)    # Kinako, Fraidy Scrapper
SHARE = {1: 0, 2: 3, 3: 10, 4: 17, 5: 21, 6: 32, **{d: 37 for d in range(7, 15)}}   # Σ Crew levels (Territory §4.11)
FIELD = {1: 14, 2: 25, 3: 30, 4: 35, 5: 56, 6: 90, **{d: 50 for d in range(7, 15)}}   # §4.11 reference haul
CACHE_DAYS = {2, 3, 4, 5}


def band(s):
    return 0.6 if s < 25 else (0.9 if s < 60 else 1.0)


def seen_mult(dsv):
    return 1.0 if dsv <= 2 else max(0.0, 1.0 - 0.2 * (dsv - 2))


def p_hold(sentry, scent, attack, uprising=False, perch=False):
    st_term = 0.0 if sentry is None else 1.5 * sentry["style"] * sentry["guard"] / attack
    R = st_term + (0 if uprising else 0.005 * scent) + (0.15 if perch else 0)
    return min(0.95, max(0.05, R ** 3 / (R ** 3 + 1)))


def run(policy, rule, seed, days=7, p_requester=0.8):
    rng = random.Random(seed)
    held = {}                       # patch -> scent
    dsv = {p: 99 for p in YIELD}    # days since visit
    stash, log = 0, []
    raid_req = None                 # (patch, attack) requested last night
    humbled = set()
    den_claimed = False
    lessons_bought = 0
    captain_bribed = False
    sched = policy["claims"]        # day -> patch claimed that day
    for d in range(1, days + 1):
        row = dict(day=d)
        # --- morning: Doorstep (Tribute computed last night) ---
        trib = log[-1]["tribute"] if log else 0
        stashed = min(trib, 400 - stash); stash += stashed
        row["rot"] = trib - stashed
        # --- Lot: Share, Lessons ---
        spend = 0
        if policy["share"](d) and stash >= SHARE[d]:
            stash -= SHARE[d]; spend += SHARE[d]
        if policy["lessons"] and d >= 4:
            reserve = 96 if (d == 5 and policy["bribe"] and not captain_bribed) else 0
            price = 40 if lessons_bought < 2 else 120
            if lessons_bought < 3 and stash - price >= reserve and (d in (4, 6, 7)):
                stash -= price; spend += price; lessons_bought += 1
        # --- street ---
        visited = set()
        if policy["goes_out"](d):
            if d in sched:
                p = sched[d]; held[p] = 70; visited.add(p)
                if p == "DEN":
                    den_claimed = True
                    if policy["humble_daifuku"]:
                        humbled.add("DEN")
            for p in list(held):
                if rng.random() < policy["visit_p"](p, d):
                    visited.add(p)
                    if held[p] < 60 and policy["spray"] and rng.random() < policy["spray_p"]:
                        held[p] = 90
        for p in YIELD:
            dsv[p] = 0 if p in visited else dsv[p] + 1
        # field haul, caches, Bribe (paid at the day's Verdict)
        field = FIELD[d] * policy["field_mult"](d) if policy["goes_out"](d) else 0
        if policy.get("wipe_every_day") and d >= 3:
            field *= 0.8 * 0.3   # wipe early: ~30% of a day's fights, minus 20%
        cache = 10 if (d in CACHE_DAYS and policy["goes_out"](d) and policy["caches"]) else 0
        if d == 5 and policy["bribe"] and not captain_bribed and stash >= 96:
            stash -= 96; spend += 96; captain_bribed = True
        stash = min(400, stash + round(field) + cache)
        # --- posts for tonight ---
        posts = policy["post"](held, raid_req, d)
        # --- night step 2: decay, refresh, upkeep, raid ---
        for p in list(held):
            rivals = sum(1 for q in NEIGH[p] if q not in held)
            dec = (10 + 2 * rivals) * (0.5 if p == "LWC" else 1)
            dec = int(dec)
            ref = posts[p]["refresh"] if p in posts else 0
            held[p] = min(100, max(10 if p == "LWC" else 0, held[p] - dec + ref))
            if held[p] == 0:
                del held[p]
        up = 2 * len(posts); stash -= min(up, stash)
        outcome, scuffed = None, set()
        if raid_req and raid_req[0] in held:
            p, attack = raid_req
            outer_held = sum(1 for q in OUTER if q in held)
            den_open = (not den_claimed) and outer_held >= 3
            ph = p_hold(posts.get(p), held[p], attack, perch=(p == "LPY"))
            u = rng.random()
            outcome = "Repelled" if u < ph * ph else ("Scuffed" if u < ph else "Lost")
            if outcome == "Lost" and (held[p] >= 60 or (den_open and p != "DEN")):
                outcome = "Scuffed"
            if outcome == "Repelled":
                held[p] = max(0, held[p] - 5)
            elif outcome == "Scuffed":
                held[p] = max(0, held[p] - 20); scuffed.add(p)
            else:
                del held[p]
        row["raid"] = (raid_req[0] + ":" + outcome) if outcome else "-"
        # --- night step 3: tomorrow's raid request ---
        raid_req = None
        outer_held = sum(1 for q in OUTER if q in held)
        adm = [q for q in held if q != "LWC" and (q != "DEN" or outer_held < 3)]
        if d >= 3 and adm:
            if rule == "T":
                tgt = min(adm, key=lambda q: held[q])
            else:
                below = [q for q in adm if held[q] < 60]
                if d == 3:   # scripted first raid (arc lead), still needs a below-Strong target
                    tgt = min(below or adm, key=lambda q: held[q])
                else:
                    tgt = min(below, key=lambda q: held[q]) if (below and rng.random() < p_requester) else None
            if tgt:
                attack = 1.15 if rng.random() < 0.5 else 2.2
                raid_req = (tgt, attack)
        # --- night step 4: Tribute ---
        full_house = len(held) == 5
        t = 0.0
        for p, s in held.items():
            if p in scuffed:
                continue
            bonus = (0.10 if (p in posts and posts[p] is BRAGGART) else 0) + \
                    (0.15 if p in humbled else 0) + (0.10 if full_house else 0)
            wm = 1.0 if p in posts else 0.8
            t += seen_mult(dsv[p]) * YIELD[p] * band(s) * wm * (1 + min(bonus, 0.35))
        row.update(tribute=int(t), spend=spend, field=round(field) + cache, stash=stash,
                   held=len(held), upkeep=up)
        log.append(row)
    return log


def post_engaged(held, raid_req, d):
    posts = {}
    cats = [STALWART, BRAGGART] if d >= 3 else []
    if not cats:
        return posts
    cand = [p for p in held if p != "LWC"]
    if not cand:
        return posts
    first = raid_req[0] if (raid_req and raid_req[0] in held) else min(cand, key=lambda q: held[q])
    posts[first] = STALWART
    rest = [p for p in cand if p not in posts]
    if rest:
        posts[max(rest, key=lambda q: YIELD[q])] = BRAGGART
    return posts


def post_casual(held, raid_req, d):
    cand = [p for p in held if p != "LWC"]
    return {cand[0]: FRAIDY} if (cand and d >= 3) else {}


def post_none(held, raid_req, d):
    return {}


ENGAGED = dict(claims={1: "LWC", 2: "LPY", 3: "PA", 5: "TSS", 6: "DEN"}, share=lambda d: d >= 2,
               lessons=True, bribe=True, humble_daifuku=True, goes_out=lambda d: True,
               visit_p=lambda p, d: 1.0, spray=True, spray_p=1.0, field_mult=lambda d: 1.0,
               caches=True, post=post_engaged)
CASUAL = dict(claims={1: "LWC", 2: "LPY", 4: "PA", 6: "TSS", 8: "DEN"}, share=lambda d: d % 2 == 0,
              lessons=True, bribe=False, humble_daifuku=True, goes_out=lambda d: True,
              visit_p=lambda p, d: 0.6, spray=True, spray_p=0.5, field_mult=lambda d: 0.75,
              caches=True, post=post_casual)
SLEEP_SKIP = dict(ENGAGED, claims={1: "LWC", 2: "LPY"}, share=lambda d: False, lessons=False,
                  bribe=False, goes_out=lambda d: d <= 2, post=post_none)
RUB_SKIP = dict(SLEEP_SKIP, goes_out=lambda d: True, visit_p=lambda p, d: 1.0 if (p == "LWC" or d <= 2) else 0.0,
                field_mult=lambda d: 1.0 if d <= 2 else 0.0, caches=False)
PATROL_SKIP = dict(ENGAGED, claims={1: "LWC", 2: "LPY", 3: "PA"}, lessons=False, bribe=False,
                   field_mult=lambda d: 1.0 if d <= 3 else 0.0)
WIPE_SKIP = dict(ENGAGED, wipe_every_day=True)


def summarise(name, pol, rule, days=7, n=2000, p_req=0.8):
    runs = [run(pol, rule, s, days, p_req) for s in range(n)]
    print(f"\n### {name}  (raid rule {rule}, {n} seeds; means)")
    print("| Day | Tribute (that night) | Field+cache | Spend (Share/Lessons/Bribe) | Upkeep | Stash end | Patches held | Raid nights (share of seeds) |")
    print("|---|---|---|---|---|---|---|---|")
    for i in range(days):
        rows = [r[i] for r in runs]
        rn = sum(1 for r in rows if r["raid"] != "-") / n
        lost = sum(1 for r in rows if r["raid"].endswith("Lost")) / n
        print(f"| {i+1} | {st.mean(r['tribute'] for r in rows):.1f} | {st.mean(r['field'] for r in rows):.0f} | "
              f"{st.mean(r['spend'] for r in rows):.0f} | {st.mean(r['upkeep'] for r in rows):.1f} | "
              f"{st.mean(r['stash'] for r in rows):.0f} (min {min(r['stash'] for r in rows)}) | "
              f"{st.mean(r['held'] for r in rows):.2f} | {rn:.2f} (Lost {lost:.2f}) |")
    tot_t = st.mean(sum(r["tribute"] for r in run_) for run_ in runs)
    raids = st.mean(sum(1 for r in run_ if r["raid"] != "-") for run_ in runs)
    rot = st.mean(sum(r["rot"] for r in run_) for run_ in runs)
    print(f"Totals: Tribute computed {tot_t:.0f}; raids resolved per slice {raids:.2f}; rotted {rot:.0f}")
    return runs


if __name__ == "__main__":
    for rule in ("T", "N"):
        summarise("Engaged (Territory §4.11 reference player)", ENGAGED, rule)
    summarise("Casual (slower claims, 60% visits, 1 Fraidy post, half the rescue Sprays)", CASUAL, "N", days=8)
    summarise("Casual", CASUAL, "T", days=8)
    summarise("Exploit: sleep-skip from day 3", SLEEP_SKIP, "T", days=10)
    summarise("Exploit: rub-skip (LWC only) from day 3", RUB_SKIP, "T", days=10)
    summarise("Exploit: patrol-skip from day 4 (3 Patches, posts, Sprays, no fights)", PATROL_SKIP, "T", days=10)
    summarise("Exploit: wipe-skip (wipe early every day from day 3)", WIPE_SKIP, "T")
    # Decision value: expected Tribute at stake per raid night, and the posting choice
    print("\n### Raid odds by Sentry (post-decay Scent 50 / 80; PR ratio 1)")
    print("| Sentry | 1 raider grudge, Scent 50: Rep/Scuff/Lost | 2 raiders, Scent 50 | 1 raider, Scent 80 (Strong): Rep/Scuff |")
    print("|---|---|---|---|")
    for nm, s in (("Unwatched", None), ("Fraidy Scrapper (Kinako)", FRAIDY), ("Braggart Scrapper (Togemaru)", BRAGGART),
                  ("Stalwart Bruiser (Hige)", STALWART)):
        a = p_hold(s, 50, 1.15); b = p_hold(s, 50, 2.2); c = p_hold(s, 80, 1.15)
        print(f"| {nm} | {a*a:.2f}/{a-a*a:.2f}/{1-a:.2f} | {b*b:.2f}/{b-b*b:.2f}/{1-b:.2f} | {c*c:.2f}/{1-c*c:.2f} |")

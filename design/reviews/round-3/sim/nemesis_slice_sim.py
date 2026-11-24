#!/usr/bin/env python3
"""Round-2 check: nemesis-system.md over the slice (7 days) and a 30-day extrapolation.

Encodes §3.3 generation, §3.4 personality table, §3.5 event table + F1 cap,
F2 decay (Brooder 1, arc lead exempt, simmer, Stewing cap 74), §3.6 slots
(1 Lane + arc lead, threshold 75), §3.7 arc lead / arc achieved, F4 Nose-Touch,
F5 comebacks (Away cap 2), F6 wall events, F7 Scars, §3.10 loss/promotion,
§3.11 Verdicts, §3.12 3f raid requests, §3.13 Sniff admission.

Encounter schedule (assumption, mirrors the docs' reference path once the
Thorn is the Keeper of Laundry Pole Yard - see review fix N1):
  D1 L1D1  Thorn Standoff (flees 75%: busy kitten) ; LWC tutorial Keeper is untracked
  D2 L1D2  LPY contest: Keeper = Thorn (or its replacement)
  D3 L2D1  PA contest: Keeper = Tough seat 1 ; arc-lead placement ; waves 50% hold a tracked Tough
  D4 L2D2  flap ; scripted raid by the arc lead (Caterwaul answered 60%) ; 2 roaming fights 50% tracked ; Night Roamer 60%
  D5 L2D3  TSS contest: Keeper = Captain Kagi (Schemer) ; arc-lead placement ; waves
  D6 L2D4  Den: Daifuku (won 50%, else wipe, he Gloats) ; waves 50% hold Captain B
  D7 L2D5  Daifuku if not yet beaten
  Days 8-30 (extrapolation): 3 encounters/day with tracked cats + arc-lead placement.
Policies: chase, humble, mixed, pacifist, lose40 (mixed + 40% of days end in a wipe).
Observations only.  Usage: python3 -I nemesis_slice_sim.py
"""
import random, statistics as st, sys
FIX3 = "--fix3" in sys.argv   # iteration 3: FIX2 + raid rule N2 (Grudge>=40 requester / boss_orders) + the Declaration (one slot in Lives 1-2, held by the declared arc lead at any Grudge; deadline night 5; Recruit greyed on the declared Nemesis; Boss never lead)
FIX2 = "--fix2" in sys.argv or FIX3   # N3 as recommended: Humbled lead stays lead (its uprising is the scripted raid), arc = 3 enc + 1 mark + any Verdict state
FIX = "--fix" in sys.argv or FIX2   # proposed fixes N3/N4 (lead re-naming, Humbled lead, simmer 8)
SIMMER = 8 if FIX else 2
from collections import Counter

P = {  # m_g, m_r, decay, flee_p (prob it bolts before Rout), p_ret, p_mod
    "braggart": (1.2, 0.7, 2, 0.00, -1, -0.20), "brooder": (1.1, 0.8, 1, 0.00, 1, -0.10),
    "schemer": (1.0, 0.9, 2, 0.20, 0, 0.00), "fraidy": (0.7, 1.0, 2, 0.40, 1, 0.10),
    "stalwart": (0.8, 1.5, 2, 0.00, 0, 0.30), "goofball": (0.6, 1.2, 2, 0.12, 0, 0.15)}
WEIGHTS = [("braggart", 12), ("brooder", 16), ("schemer", 16), ("fraidy", 16), ("stalwart", 16), ("goofball", 24)]


class Cat:
    def __init__(s, cid, name, pers, rank, seat=None, g=15, r=10, recruitable=False):
        s.id, s.name, s.pers, s.rank, s.seat = cid, name, pers, rank, seat
        s.g, s.r, s.enc, s.routs, s.marks_scar, s.title_mikan = g, r, 0, 0, 0, 0
        s.state, s.away_nights, s.chased, s.snubs = "Seated" if rank != "Roamer" else "Roaming", 0, 0, 0
        s.recruitable, s.truce_until, s.friend, s.beat_mikan = recruitable, -1, False, False
        s.first_meet, s.last_enc_day, s.humbled_settled, s.restless = 999, -99, False, False
        s.recruited_after3, s.plaster = False, 0

    @property
    def marks(s): return min(2, s.marks_scar) + min(1, s.title_mikan)


def wpick(rng, items):
    tot = sum(w for _, w in items); x = rng.random() * tot
    for k, w in items:
        x -= w
        if x < 0: return k
    return items[-1][0]


def gen(rng):
    cats, cid = [], 0
    def mk(name, pers, rank, seat=None, g=None, r=10, rec=False):
        nonlocal cid
        c = Cat(cid, name, pers, rank, seat, g if g is not None else 10 + rng.randint(0, 10), r, rec); cid += 1
        cats.append(c); return c
    mk("Daifuku", "brooder", "Boss", rec=True)
    mk("Kagi", "schemer", "Captain", rec=True)
    mk("CaptainB", wpick(rng, WEIGHTS), "Captain")
    for seat in (1, 2, 3, 4):
        mk(f"Tough{seat}", wpick(rng, WEIGHTS), "Tough", seat)
    mk("Thorn", "braggart", "Tough", 5, g=15, r=10, rec=True)
    for i in range(2):
        mk(f"Roamer{i}", wpick(rng, WEIGHTS), "Roamer")
    return cats


class World:
    def __init__(s, seed, policy):
        s.rng = random.Random(seed); s.policy = policy
        s.cats = gen(s.rng); s.by = {c.name: c for c in s.cats}
        s.lead = s.by["Thorn"]; s.lead_role = "lead"; s.arc = False
        s.day = 1; s.next_wall = None; s.crates = set(); s.verdicts = Counter()
        s.slot_holders, s.ever_nemesis, s.max_nem = {}, set(), 0
        s.wall_events = 0; s.rank_changes = 0; s.sniff_items = []; s.share75 = []
        s.uprisings = 0; s.away_count = 0; s.fresh_id = 100; s.today_items = 0
        s.arc_day = None; s.l1_callback = False; s.wipes = 0; s.stew_on = False
        s.raid_req = None
        s.declared = None; s.decl_day = None; s.decl_deadline = False; s.decl_enc = 0; s.raids = 0

    # ---------- helpers ----------
    def seated(self): return [c for c in self.cats if c.state == "Seated"]
    def active(self): return [c for c in self.cats if c.state in ("Seated", "Roaming")]

    def arc_score(s, c):
        return 12 * c.enc + 10 * c.marks + 0.3 * max(c.g, c.r) + 15 * c.beat_mikan - 3 * min(s.day - c.last_enc_day, 10)

    def item(s, n=1): s.today_items += n

    # ---------- one encounter that the Posse wins (or the cat flees) ----------
    def fight(s, c, keeper=False, verdict_ok=True, opener=None):
        rng = s.rng; mg, mr, _, flee, _, pmod = P[c.pers]
        life2 = s.day >= 3
        cap = 35 if c.enc < 2 else 20
        if c.enc == 0: c.first_meet = s.day
        c.enc += 1; c.last_enc_day = s.day
        flee_p = 0.75 if (c.name == "Thorn" and s.day == 1) else flee
        if rng.random() < flee_p:
            g = 8 + (6 if keeper else 0)
            c.g = min(100, c.g + min(cap, round(mg * g)))
            return "fled"
        ambush = (opener == "player_ambush") or (opener is None and life2 and rng.random() < 0.3)
        fear = life2 and rng.random() < 0.3
        pile = rng.random() < 0.5
        g = 6 + 3 * pile + 3 * fear + 3 * ambush + (6 if keeper else 0)
        r = -2 * fear - 3 * ambush + (8 if not (ambush or fear) else 0)
        c.routs += 1
        if c.marks_scar < 2 and (c.routs >= 2 or rng.random() < 0.35 + 0.15 * pile):
            c.marks_scar += 1
        if life2 and rng.random() < 0.08:          # Lick In (it flattened Mikan in a won fight)
            c.title_mikan = 1; c.beat_mikan = True
        g_pend = min(100, c.g + min(cap, round(mg * g))); r_pend = max(0, min(100, c.r + round(mr * r)))
        if not verdict_ok:  # SLIPPED_AWAY
            c.g, c.r = g_pend, r_pend; return "slipped"
        v = s.choose(c, keeper, g_pend, r_pend)
        s.verdicts[v] += 1
        if v == "chase":
            c.g = min(100, c.g + min(cap, round(mg * (g + 10)))); c.r = r_pend
            s.vacate(c); c.state = "Away"; c.chased += 1
            c.away_nights = max(1, min(3, 2 + P[c.pers][4] - (c.g >= 50)))
            if sum(1 for x in s.cats if x.state == "Away") > 2:
                old = [x for x in s.cats if x.state == "Away" and x is not c]
                old.sort(key=lambda x: x.first_meet)
                nm = [x for x in old if x.marks == 0 and not (FIX3 and x is s.declared)]
                if nm: nm[0].state = "Gone"
                else: old[0].away_nights = 1
            if c.chased >= 2 and not c.title_mikan: c.title_mikan = 1
        elif v == "humble":
            c.g = min(100, c.g + min(cap, round(mg * (g + 10)))); c.r = max(0, min(100, c.r + round(mr * (r - 5))))
            s.vacate(c); c.state = "Humbled"; s.crates.add(c.id)
        elif v == "recruit":
            c.g = round(g_pend / 2); c.r = min(100, c.r + round(mr * (r + 10)))
            s.vacate(c); c.state = "Crew"
            if c.enc >= 3: c.recruited_after3 = True
        elif v == "nose":
            clean = not (ambush or fear)
            p = max(0.05, min(0.95, 0.40 + pmod + 0.006 * r_pend - 0.006 * g_pend + 0.15 * clean + 0.25 * min(3, c.snubs)))
            if rng.random() < p:
                c.g = 0; c.r = min(100, c.r + round(mr * (r + 25))); c.truce_until = s.day + 5
                if c.r >= 75 or True: c.friend = True   # friend arc = accepted Nose-Touch (§3.7)
                s.verdicts["nose_accept"] += 1
            else:
                c.g = round(g_pend / 2); c.r = min(100, c.r + round(mr * (r + 5))); c.snubs += 1
                s.verdicts["nose_snub"] += 1
        return v

    def choose(s, c, keeper, gp, rp):
        pol, rng = s.policy, s.rng
        can_humble = keeper and len(s.crates) < 4
        can_recruit = (not (FIX3 and s.declared is c)) and c.recruitable and (gp < 90 or rp >= 50) and (c.rank != "Boss" or rp >= 50) and \
            sum(1 for x in s.cats if x.state == "Crew") < 3
        if c.rank == "Boss" and not can_recruit and pol == "recruit": pass
        if pol == "chase": return "chase"
        if pol == "humble": return "humble" if can_humble else "chase"
        if pol == "pacifist": return "nose"
        opts = [("chase", 30), ("nose", 25)] + ([("humble", 25)] if can_humble else []) + \
               ([("recruit", 20)] if can_recruit else [])
        return wpick(rng, opts)

    def vacate(s, c):
        if c.state == "Seated" and c.seat is not None:
            c.vac_seat = c.seat
        c.seat_empty_since = s.day

    def loss(s, c):
        s.wipes += 1
        c.enc += 1; c.last_enc_day = s.day; c.beat_mikan = True; c.title_mikan = 1
        mg, mr = P[c.pers][0], P[c.pers][1]
        c.g = min(100, c.g + round(mg * 5)); c.r = max(0, min(100, c.r + (10 if c.pers == "stalwart" else round(-10 * mr))))
        s.promote(c)

    def promote(s, c):
        if c.rank == "Tough" and c.seat and c.seat > 1:
            other = next((x for x in s.seated() if x.rank == "Tough" and x.seat == c.seat - 1), None)
            if other: other.seat = c.seat
            c.seat -= 1; s.rank_changes += 1
        elif c.rank == "Roamer" and c.state == "Roaming":
            c.rank, c.state, c.seat = "Tough", "Seated", 5; s.rank_changes += 1
            low = next((x for x in s.seated() if x.rank == "Tough" and x.seat == 5 and x is not c), None)
            if low: low.rank, low.state, low.seat = "Roamer", "Roaming", None

    # ---------- the director's daily placements ----------
    def lead_placement(s):
        L = s.lead
        if FIX3 and s.declared is not None: L = s.declared   # the declared Nemesis keeps its daily placement
        if L is None or (s.arc and not FIX3) or s.day < 3: return
        if L.state not in ("Seated", "Roaming") and not (FIX2 and L.state == "Humbled"): return   # crate challenge
        if s.day <= L.truce_until: return
        opener = "rival_ambush" if (L.g >= 50 and s.rng.random() < 0.5) else None
        s.fight(L, opener=opener if opener else None)

    def tracked_wave(s, exclude):
        pool = [c for c in s.active() if c.rank in ("Tough", "Roamer") and c not in exclude and s.day > c.truce_until]
        if pool and s.rng.random() < 0.5:
            c = s.rng.choice(pool); s.fight(c)

    def keeper_fight(s, name_pref, fallback_seat=None):
        c = s.by.get(name_pref)
        if c is None or c.state != "Seated" or s.day <= c.truce_until:
            pool = [x for x in s.seated() if x.rank == "Tough" and s.day > x.truce_until]
            if not pool: return
            c = min(pool, key=lambda x: x.seat)
        s.fight(c, keeper=True)

    def wipe_day(s):
        return s.policy == "lose40" and s.rng.random() < 0.4 and s.day >= 2

    def play_day(s):
        d, rng = s.day, s.rng
        s.today_items = 0
        if d == 1:
            s.fight(s.by["Thorn"])
            return
        if d == 2:
            s.l1_callback = s.by["Thorn"].enc >= 1   # §3.8: day-2 placement within 30 s of the door
        if s.wipe_day():
            foes = [c for c in s.active() if c.rank != "Boss"] or s.active()
            s.loss(rng.choice(foes)); return
        if d == 2:
            s.keeper_fight("Thorn")
        elif d == 3:
            s.lead_placement(); s.tracked_wave([s.lead]); s.keeper_fight("Tough1")
        elif d == 4:
            if s.raid_req and rng.random() < 0.6 and (s.raid_req.state in ("Seated", "Roaming") or (FIX2 and s.raid_req.state == "Humbled")):
                s.fight(s.raid_req)
            elif not s.arc: s.lead_placement()
            s.tracked_wave([]); s.tracked_wave([])
            r = [c for c in s.cats if c.state == "Roaming"]
            if r and rng.random() < 0.6: s.fight(rng.choice(r))
        elif d == 5:
            s.lead_placement(); s.tracked_wave([s.lead]); s.keeper_fight("Kagi")
        elif d in (6, 7):
            if s.lead is not s.by["Daifuku"]: s.lead_placement()   # §3.7 presence guarantee holds every day
            D = s.by["Daifuku"]
            if D.state == "Seated":
                if rng.random() < 0.5 and d == 6:
                    s.loss(D); return
                cb = s.by["CaptainB"]
                if cb.state in ("Seated", "Roaming") and rng.random() < 0.5: s.fight(cb, verdict_ok=True)
                s.fight(D, keeper=True)
            else:
                s.lead_placement(); s.tracked_wave([]); s.tracked_wave([])
        else:   # extrapolation days
            s.lead_placement()
            for _ in range(3): s.tracked_wave([])

    # ---------- Night Shuffle step 3 ----------
    def night(s):
        d, rng = s.day, s.rng
        items = s.today_items
        # 3b comebacks
        for c in s.cats:
            if c.state == "Away":
                c.away_nights -= 1
                if c.away_nights <= 0:
                    seats = {x.seat for x in s.seated() if x.rank == "Tough"}
                    free = [k for k in (1, 2, 3, 4, 5) if k not in seats]
                    if c.rank == "Tough" and free:
                        c.state = "Seated"; c.seat = max(free)
                        if c.chased >= 2 and c.seat > 1: c.seat -= 1
                    elif c.rank in ("Captain", "Boss"):
                        c.state = "Seated"
                    else:
                        c.state = "Roaming"
                    s.rank_changes += 1
                    if c.enc >= 1: items += 1
        # 3c wall event (from the night after L2D1 = night 3)
        if d >= 3:
            if s.next_wall is None: s.next_wall = d
            if d >= s.next_wall:
                kinds = []
                st_ = s.seated(); toughs = [x for x in st_ if x.rank == "Tough"]
                if len(toughs) >= 2: kinds += [("promotion", 2), ("scuffle", 2)]
                if len([x for x in toughs]) < 5 or any(x.state == "Roaming" for x in s.cats): kinds.append(("refill", 3))
                hum = [x for x in s.cats if x.state == "Humbled" and x.g >= 80 and not x.restless]
                if hum: kinds.append(("restless", 4))
                if kinds:
                    k = wpick(rng, kinds); s.wall_events += 1
                    if k in ("promotion", "scuffle", "refill"): s.rank_changes += 1
                    if k == "promotion" and toughs:
                        c = rng.choice([x for x in toughs if x.seat and x.seat > 1] or toughs); s.promote(c)
                        if c.enc >= 1: items += 1
                    elif k == "scuffle":
                        a, b = rng.sample(toughs, 2); b.plaster = 2
                        if a.enc or b.enc: items += 1
                    elif k == "restless":
                        hum[0].restless = True; items += 1
                    elif k == "refill":
                        s.refill(force=True)
                s.next_wall = d + 2 + rng.randint(0, 1)
        # 3d refills
        s.refill()
        # 3e decay, simmer, stewing
        for c in s.cats:
            if c.state in ("Crew", "Gone"): continue
            quiet = c.last_enc_day != d
            lead = (c is s.lead and not s.arc and s.lead_role == "lead")
            if c.state == "Humbled" and not c.humbled_settled:
                watched = s.policy != "chase" and rng.random() < 0.5
                if not watched:
                    c.g = min(100, c.g + SIMMER)
                    if c.restless or c.g >= 80:
                        if not c.restless: c.restless = True; items += 1
                        s.uprisings += 1; c.humbled_settled = True
                    continue
            if quiet and not lead: c.g = max(0, c.g - P[c.pers][2])
        if d >= 5 and not any(c.g >= 60 for c in s.active()):
            el = [c for c in s.active() if c.enc >= 1 and not c.friend and d > c.truce_until and c.r < 50]
            if el:
                c = max(el, key=s.arc_score); c.g = min(74, c.g + 5); items += 1
        # slots
        old = dict(s.slot_holders)
        s.slot_holders = {}
        L = s.lead
        if FIX3:
            if s.declared is not None and s.declared.state not in ("Crew", "Gone"):
                s.slot_holders["arc"] = s.declared.id
        else:
            if L and L.state not in ("Crew", "Gone") and L.g >= 75: s.slot_holders["arc"] = L.id
            cand = [c for c in s.cats if c.state not in ("Crew", "Gone") and c.g >= 75 and c.id not in s.slot_holders.values()]
            if cand: s.slot_holders["lane"] = max(cand, key=lambda c: (s.arc_score(c), -c.first_meet)).id
        for v in s.slot_holders.values(): s.ever_nemesis.add(v)
        if s.slot_holders != old: items += 1
        s.max_nem = max(s.max_nem, len(s.slot_holders))
        # arc lead resolution / achievement
        if FIX and not s.arc and (L is None or L.state == "Gone"):
            pool = [c for c in s.active() if c.enc >= 1 and not (FIX3 and c.rank == "Boss")] or ([c for c in s.seated() if c.rank == "Tough"] if FIX2 else [])
            s.lead = max(pool, key=s.arc_score) if pool else None; L = s.lead
        if L and not s.arc:
            if (FIX3 and s.declared is L): pass   # the declared Nemesis stays the lead for the rest of the slice
            elif L.state == "Crew" or (L.friend and L.enc < 3) or (FIX and not FIX2 and L.state == "Humbled" and L.enc < 3):
                if L.enc < 3 or (FIX3 and L.state == "Crew"):   # FIX3: a Recruited lead always hands the lead on
                    s.lead_role = "resolved"
                    pool = [c for c in (s.active() if FIX else s.seated()) if c.enc >= 1 and c is not L and not (FIX3 and c.rank == "Boss")]
                    if FIX2 and not pool:   # name a stranger rather than nobody
                        pool = [c for c in s.seated() if c.rank == "Tough" and c is not L]
                    s.lead = max(pool, key=s.arc_score) if pool else None
                    s.lead_role = "lead"
            L = s.lead
            if L and L.enc >= 3 and L.marks >= 1 and (FIX2 or "arc" in s.slot_holders or L.friend or L.recruited_after3):
                s.arc = True; s.arc_day = d
        # the Declaration (FIX3): the lead's arc conditions, or the night-5 deadline, name the one Nemesis of Lives 1-2
        if FIX3 and s.declared is None:
            L = s.lead
            if L is None or L.state in ("Crew", "Gone"):   # a Recruited lead always hands the lead on
                pool = [c for c in s.active() if c.enc >= 1 and c.rank != "Boss"] or [c for c in s.seated() if c.rank == "Tough"]
                s.lead = L = max(pool, key=s.arc_score) if pool else None
            if L is not None and d >= 5 and L.enc == 0:      # deadline: prefer a cat Mikan has met
                met = [c for c in s.active() if c.enc >= 1 and c.rank != "Boss"]
                if met: s.lead = L = max(met, key=s.arc_score)
            if L is not None and ((L.enc >= 3 and L.marks >= 1) or d >= 5):
                s.declared = L; s.decl_day = d; s.decl_deadline = not s.arc; s.decl_enc = L.enc
                s.slot_holders["arc"] = L.id; s.ever_nemesis.add(L.id); items += 1
                s.max_nem = max(s.max_nem, len(s.slot_holders))
        # 3f raid request for tomorrow (≤1): first = arc lead on night 3
        s.raid_req = None
        if d == 3 and s.lead and (s.lead.state in ("Seated", "Roaming") or (FIX2 and s.lead.state == "Humbled")):
            s.raid_req = s.lead
        elif d >= 4:
            thr = 40 if FIX3 else 60
            req = [c for c in s.active() if c.g >= thr and d > c.truce_until]
            if req: s.raid_req = max(req, key=s.arc_score)
            elif FIX3:
                t = [c for c in s.seated() if c.rank == "Tough"]
                if t: s.raid_req = max(t, key=lambda c: c.seat)   # boss_orders: Daifuku sends the lowest-seat Tough
        if s.raid_req is not None and d >= 3: s.raids += 1
        # metrics
        if d >= 3:
            seat = s.seated()
            s.share75.append(sum(1 for c in seat if c.g >= 75) / max(1, len(seat)))
        if d >= 2: s.sniff_items.append(min(3, items))
        s.day += 1

    def refill(s, force=False):
        toughs = [x for x in s.seated() if x.rank == "Tough"]
        seats = {x.seat for x in toughs}
        free = [k for k in (1, 2, 3, 4, 5) if k not in seats]
        if not free: return
        tracked = sum(1 for c in s.cats if c.state not in ("Gone",))
        if not force and s.rng.random() < 0.5: return     # "empty ≥ 2 nights" approximated
        roam = [c for c in s.cats if c.state == "Roaming"]
        if roam:
            c = max(roam, key=s.arc_score); c.state, c.rank, c.seat = "Seated", "Tough", max(free)
        elif tracked < 12:
            c = Cat(s.fresh_id, f"Fresh{s.fresh_id}", wpick(s.rng, WEIGHTS), "Tough", max(free)); s.fresh_id += 1
            s.cats.append(c); s.by[c.name] = c
        s.rank_changes += 1


def run(seed, policy, days):
    w = World(seed, policy)
    for _ in range(days):
        w.play_day(); w.night()
    return w


def report(days, label, n=500):
    pols = ["chase", "humble", "mixed", "pacifist", "lose40"]
    print(f"\n### {label}: {days} days, {n} seeds per policy")
    print("| Policy | Share seated at G>=75 (L2 nights, mean / p95) | Distinct Nemeses (median / max) | Max simultaneous slots | Arc achieved (by end) | Arc day (median) | Wall events per night | Visible rank changes per night | L2 mornings with >=1 Sniff item | Uprisings (mean) | Bitter cats at end (mean) |")
    print("|---|---|---|---|---|---|---|---|---|---|---|")
    allv = {}
    for pol in pols:
        ws = [run(s, pol, days) for s in range(n)]
        sh = [st.mean(w.share75) for w in ws]
        nem = [len(w.ever_nemesis) for w in ws]
        arc = sum(w.arc for w in ws) / n
        ad = [w.arc_day for w in ws if w.arc_day]
        nights_l2 = max(1, days - 2)
        we = st.mean(w.wall_events / nights_l2 for w in ws)
        rc = st.mean(w.rank_changes / days for w in ws)
        sn = st.mean(sum(1 for x in w.sniff_items[1:] if x >= 1) / max(1, len(w.sniff_items[1:])) for w in ws)
        up = st.mean(w.uprisings for w in ws)
        bit = st.mean(sum(1 for c in w.cats if c.state not in ("Crew", "Gone") and c.g >= 75 and c.id not in w.slot_holders.values()) for w in ws)
        sh_sorted = sorted(sh)
        if FIX3:
            end1 = sum(1 for w in ws if len(w.slot_holders) == 1) / n
            dd = [w.decl_day for w in ws if w.decl_day]
            dl = sum(w.decl_deadline for w in ws) / n
            de = st.mean(w.decl_enc for w in ws if w.declared)
            nd = sum(1 for w in ws if w.declared is None) / n
            dmin = min((w.decl_enc for w in ws if w.declared), default=0)
            print(f"    [{pol}] never declared {nd:.1%}; min encounters at declaration {dmin}; end states of slot holders: " + str(Counter(len(w.slot_holders) for w in ws)))
            face = sum(1 for w in ws if w.declared and w.declared.g >= w.declared.r) / max(1, sum(1 for w in ws if w.declared))
            bucket = Counter(w.declared.state for w in ws if w.declared)
            print(f"    [{pol}] exactly 1 Nemesis at slice end: {end1:.1%}; declaration night median {st.median(dd) if dd else '-'} (deadline used {dl:.0%}); encounters at declaration {de:.1f}; Sworn Enemy face (G>=R) {face:.0%} / Sworn Rival {1-face:.0%}; Nemesis state at end {dict(bucket)}; raid requests per slice {st.mean(w.raids for w in ws):.2f}")
        print(f"| {pol} | {st.mean(sh):.1%} / {sh_sorted[int(.95*n)]:.1%} | {st.median(nem):.0f} / {max(nem)} | {max(w.max_nem for w in ws)} | {arc:.1%} | {st.median(ad) if ad else '-'} | {we:.2f} | {rc:.2f} | {sn:.0%} | {up:.2f} | {bit:.2f} |")
        tot = Counter(); [tot.update(w.verdicts) for w in ws]
        allv[pol] = tot
        if days <= 7:
            cb = sum(w.l1_callback for w in ws) / n
            allv[pol]["_l1cb"] = cb
    return allv


if __name__ == "__main__":
    print("Variant:", "FIX3 = iteration 3 (FIX2 + Grudge>=40 raid requester with boss_orders fallback + the Declaration: one slot in Lives 1-2 held by the declared arc lead at any Grudge, declared at arc achieved or the night-5 deadline; Recruit greyed on it; Boss never lead)" if FIX3 else "FIX2 = recommended N3 (Humbled lead stays lead: its uprising is the scripted first raid and the presence guarantee places it as a crate-challenge Standoff; arc = >=3 enc + >=1 mark, any Verdict state) + nightly re-naming + simmer 8" if FIX2 else "PROPOSED FIXES (lead re-named nightly from active cats; Humbled lead with <3 enc resolves; simmer +8)" if FIX else "AS WRITTEN")
    v = report(7, "Slice (Lives 1-2)")
    print("\nLife-1 remembered-rival callback (Thorn has Memory of Mikan at the day-2 placement):",
          ", ".join(f"{p} {v[p]['_l1cb']:.0%}" for p in v))
    m = v["mixed"]; tot = sum(m[k] for k in ("chase", "humble", "recruit", "nose"))
    print("Mixed-policy Verdict availability-weighted shares:",
          ", ".join(f"{k} {m[k]/tot:.0%}" for k in ("chase", "humble", "recruit", "nose")),
          f"(Nose-Touch accepted {m['nose_accept']/(m['nose_accept']+m['nose_snub']):.0%})")
    p = v["pacifist"]
    print(f"Pacifist Nose-Touch acceptance: {p['nose_accept']/(p['nose_accept']+p['nose_snub']):.0%} of offers")
    report(30, "Extrapolation (one district, 30 days)", n=300)

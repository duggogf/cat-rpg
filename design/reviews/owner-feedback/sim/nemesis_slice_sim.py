#!/usr/bin/env python3
"""Owner-feedback pass (2026-11-24): nemesis-system.md over the slice (7 days) and a 30-day extrapolation.

Rewritten from design/reviews/round-3/sim/nemesis_slice_sim.py (--fix3) to the rules of
design/reviews/owner-feedback-rulings.md (OR-01..OR-21) as written into nemesis-system.md.
The round-3 run under the old rules is kept beside this file as nemesis_slice_sim.before.out.txt.

What changed against round 3 (rules encoded here):
  * Three Verdicts (Recruit / Chase Off / Nose-Touch). Humble, simmer, Restless, uprisings removed.
  * Chase Off = Gone for good (no Away, no F5 comebacks, no escorts, no Grand Standoff).
  * Nose-Touch: deterministic gate (pending Grudge < 50 + shift), Grudge 0, Regard +25 (x m_r),
    the cat steps down into a 10-day Truce; after it, Friend at Regard >= 75, else a truce_end challenger.
  * Join-in: from Life 2, a Truce or Friend cat whose own Rival tag is on an opponent may join,
    p = 0.35 + 0.15 [on/adjacent to its old Patch] + 0.15 [Regard >= 75], cap 0.65, <= 1 per encounter,
    <= 1 per cat per day. Only the joiner changes (+1 encounter, +5 Regard on a win).
  * Fixed arc lead Togemaru, never re-named. Declaration at >= 3 encounters + >= 1 mark, or the night-5
    deadline, unless he is already Gone or Crew (then his arc closes and the slot stays his as a record).
  * Loss (OR-01/02): the day ends; only the victor changes (WON, Title, +5 G / -10 R x m_r); a Boss victor's
    anger is spent. No promotion, no Mark Over, no Snatch.
  * Fixed roles: no seats, no promotions, no refills by Roamers. Town events (F6 timing): newcomer or feud
    scuffle; the kind is never weighted by Mikan's history.
  * Newcomers (fresh Toughs) fill empty gang places / keeperless Patches on town-event nights only.
  * Challengers (F-challenger): first on night h+2 (h = first night Mikan holds >= 3 Patches), then every
    4th night, skipped while one is active; Rival tag p 0.5 to a uniform non-Gone, non-Crew town cat.
  * Boss anger (F-anger): Over-mark +5, Counter-Spray +15 on posts of the Boss's own Clowder; -15 a night;
    spent by any win / loss / rival_fled fight with the Boss. Never moved by a fight.
  * Discovery: any encounter (fight, Standoff, Ambush, join-in), a 1 s Whisker Sense sniff, or Crew.
  * Adaptation runs the night after a fled or slipped-away encounter (Life 2 on).
  * Every draw comes from a counter-based substream rng(seed, day, step, subsystem, cat_id, ordinal),
    as nemesis-system.md section 3.3 requires, so counterfactual checks are not polluted by draw order.

Invariant checks (the patent working rule: nothing Mikan does to one cat may change a different cat):
  (1) Every interaction (fight + Verdict, loss, join-in, marking act) snapshots every cat that is not a
      participant (or, for marking acts, not the district Boss) and counts any change as a VIOLATION.
  (2) Every night, a counterfactual copy perturbs one existing cat's Mikan-history (Grudge, Regard,
      encounters, marks) and re-runs Night Shuffle step 3 with the same substreams; any change to a
      different pre-existing cat's record is a VIOLATION. A change in WHO is picked as tomorrow's raid
      requester is counted separately as the OR-19 RESIDUAL (enemy selection), not as a violation.

Encounter schedule (assumption; mirrors the docs' reference path, Territory section 4 and OR-09 pacing):
  D1 L1D1  LWC tutorial (Stray-held: no anger) ; Togemaru Standoff, flee cannot be interrupted (OR-14.5)
  D2 L1D2  Togemaru at his gatepost (memory line) ; LPY contest (marking acts, Keeper fight, Verdict) ;
           prompted sniff of Daifuku from the gatepost
  D3 L2D1  Rivals board ; lead presence ; a wave (50% holds a tracked Tough/Roamer) ; PA contest
  D4 L2D2  cat flap ; the night-3 raid answered 60% ; presence ; 2 waves ; a Roamer at Night 60%
  D5 L2D3  presence ; wave ; TSS contest (Kagi)
  D6 L2D4  Boss window if all four outer Patches held ; Daifuku at his patrol stop (lose p 0.5 + 0.1 per
           anger stage: an assumption for Combat to replace) ; challenger at its post 60% ; presence
  D7 L2D5  Daifuku rematch if not beaten (plastered -10%: lose p 0.35) ; challenger 60% ; presence
  D8-30    presence ; 3 waves ; challenger 60% ; raid answered 30% (extrapolation)
Policies: chase, recruit, mixed, pacifist, lose40 (mixed + 40% of days from day 2 end in a wipe).
Marking styles (anger): quiet (2 Over-marks + 1 Counter-Spray per contest), typical (+ 50% chance of one
extra Counter-Spray on a gang post per day), loud (2 Counter-Sprays per contest + 1 extra a day).
Observations only.  Usage: python3 -I nemesis_slice_sim.py [--quick]
"""
import copy, hashlib, statistics as st, sys
from collections import Counter

QUICK = "--quick" in sys.argv
INJECT = set()          # --selftest re-injects deleted rules to prove the invariant checks catch them
GREET_COUNTS = False    # lever run: a truce/Friend lead's daily greeting counts as an arc encounter (NOT the ruling)

# personality: m_g, m_r, decay, flee_p (chance it bolts before the Rout), gate shift (OR-13)
P = {"braggart": (1.2, 0.7, 2, 0.00, -5), "brooder": (1.1, 0.8, 1, 0.00, -5),
     "schemer": (1.0, 0.9, 2, 0.20, 0), "fraidy": (0.7, 1.0, 2, 0.40, 5),
     "stalwart": (0.8, 1.5, 2, 0.00, 15), "goofball": (0.6, 1.2, 2, 0.12, 10)}
WEIGHTS = [("braggart", 12), ("brooder", 16), ("schemer", 16), ("fraidy", 16), ("stalwart", 16), ("goofball", 24)]
RESIST_NERVES = {"braggart", "stalwart", "brooder"}
NEIGH = {"LWC": {"LPY", "PA"}, "LPY": {"LWC", "PA", "DEN"}, "PA": {"LWC", "LPY", "TSS"},
         "TSS": {"PA", "DEN"}, "DEN": {"LPY", "TSS"}}
OUTER = ["LWC", "LPY", "PA", "TSS"]
STAGES = ["Calm", "Riled", "Seething", "Furious"]


def stage(a): return 0 if a < 30 else 1 if a < 60 else 2 if a < 90 else 3


class Sub:
    """Counter-based substream: rng(seed, day, step, subsystem, cat_id, ordinal) -> uniform [0,1)."""
    def __init__(s, seed): s.seed = seed

    def u(s, *key):
        h = hashlib.blake2b(repr((s.seed,) + key).encode(), digest_size=8).digest()
        return int.from_bytes(h, "big") / 2 ** 64

    def pick(s, items, *key):   # weighted pick
        tot = sum(w for _, w in items); x = s.u(*key) * tot
        for k, w in items:
            x -= w
            if x < 0: return k
        return items[-1][0]

    def choice(s, seq, *key):
        return seq[min(len(seq) - 1, int(s.u(*key) * len(seq)))]


class Cat:
    def __init__(s, cid, name, pers, rank, g, r=10, rec=False, clowder="wall", origin="prehistory"):
        s.id, s.name, s.pers, s.rank, s.clowder, s.origin = cid, name, pers, rank, clowder, origin
        s.g, s.r, s.enc, s.routs, s.scars, s.title = g, r, 0, 0, 0, 0
        s.state = "Roaming" if rank == "Roamer" else "Seated"
        s.recruitable, s.truce_until, s.beat_mikan = rec, -1, False
        s.first_meet, s.last_enc_day = 999, -99
        s.keeper_of, s.rivals, s.kin = None, set(), set()
        s.memory, s.discovered, s.old_gang, s.nerves = [], False, None, False
        s.anger, s.plaster_until, s.strengths = 0, -1, []
        s.adapt_due, s.joined_day, s.old_patch = False, -1, None
        s.ch_patch, s.ch_repelled, s.arrived = None, 0, None

    @property
    def marks(s): return min(2, s.scars) + min(1, s.title)

    def snap(s):
        return (s.g, s.r, s.state, s.rank, s.enc, s.routs, s.scars, s.title, s.truce_until, s.keeper_of,
                tuple(sorted(s.rivals)), tuple(sorted(s.kin)), tuple(s.memory), s.discovered, s.old_gang,
                s.nerves, s.anger, s.plaster_until, tuple(s.strengths), s.beat_mikan, s.clowder)


class World:
    def __init__(s, seed, policy, style="typical", p_ws=0.5):
        s.seed, s.policy, s.style, s.p_ws = seed, policy, style, p_ws
        s.R = Sub(seed); s.day = 1
        s.cats, s.by, s.fresh = [], {}, 100
        s.gen()
        s.patches = {"LWC": "stray", "LPY": "wall", "PA": "wall", "TSS": "wall", "DEN": "wall"}
        s.window, s.window_day, s.den_claimed, s.daifuku_beaten = False, None, False, False
        s.h3 = None; s.next_ch = None; s.next_town = None
        s.raid_req = None; s.raid_motive = None; s.raid_patch = None
        s.declared = False; s.decl_day = None; s.decl_deadline = False; s.arc_closed = None
        s.arc = False; s.arc_day = None
        s.verdicts = Counter(); s.gate_open = Counter()
        s.viol = 0; s.viol_notes = Counter(); s.checks = 0; s.night_checks = 0; s.residual = 0
        s.joins = 0; s.join_ops = 0; s.join_days = set(); s.join_by = Counter()
        s.l1_callback = False; s.wipes = 0
        s.anger_peak = 0; s.anger_at_fight = None; s.anger_cards = 0
        s.town_events = Counter(); s.challengers = 0; s.ch_outcomes = Counter(); s.first_ch_night = None
        s.share75 = []; s.raids = 0; s.adapts = 0; s.l2_antag_days = 0; s.l2_days = 0
        s.sniff_items = []; s.today_items = 0; s.today_ops = 0
        s.daifuku_fights = 0; s.nerve_moments = 0

    # ---------------- generation ----------------
    def mk(s, name, pers, rank, g=None, r=10, rec=False, clowder="wall", origin="prehistory"):
        cid = s.fresh if origin != "prehistory" else len(s.cats)
        if origin != "prehistory": s.fresh += 1
        if g is None: g = 10 + int(s.R.u(0, 0, "gen", cid, "g") * 11)
        c = Cat(cid, name, pers, rank, g, r, rec, clowder, origin)
        s.cats.append(c); s.by[name] = c; return c

    def gen(s):
        R = s.R
        s.mk("Daifuku", "brooder", "Boss", rec=True)
        s.mk("Kagi", "schemer", "Captain", rec=True)
        s.mk("CaptainB", R.pick(WEIGHTS, 0, 0, "gen", 2, "p"), "Captain")
        for i, n in enumerate(("Goma", "Sasa", "Tough3", "Tough4")):
            s.mk(n, R.pick(WEIGHTS, 0, 0, "gen", 3 + i, "p"), "Tough")
        s.mk("Togemaru", "braggart", "Tough", g=15, r=10, rec=True)
        for i in range(2):
            s.mk(f"Roamer{i}", R.pick(WEIGHTS, 0, 0, "gen", 8 + i, "p"), "Roamer")
        D, K, CB, G, T = s.by["Daifuku"], s.by["Kagi"], s.by["CaptainB"], s.by["Goma"], s.by["Togemaru"]
        T.rivals.add(G.id); G.rivals.add(T.id)             # OR-04 slice seeds
        K.rivals.add(CB.id); CB.rivals.add(K.id)
        D.keeper_of = "DEN"; T.keeper_of = "LPY"; K.keeper_of = "TSS"
        pa = s.by[R.choice(["Goma", "Sasa", "Tough3", "Tough4"], 0, 0, "gen", "pa_keeper")]
        pa.keeper_of = "PA"
        for c in s.cats: c.old_patch = c.keeper_of
        s.tracked_prehistory = [c.id for c in s.cats]

    # ---------------- helpers ----------------
    def cat(s, cid): return next(c for c in s.cats if c.id == cid)
    def active(s): return [c for c in s.cats if c.state in ("Seated", "Roaming", "Challenging")]
    def hostile(s, c): return c.state in ("Seated", "Roaming", "Challenging")
    def held(s): return [p for p, o in s.patches.items() if o == "mikan"]
    def daifuku(s): return s.by["Daifuku"]

    def arc_score(s, c):
        return 12 * c.enc + 10 * c.marks + 0.3 * max(c.g, c.r) + 15 * c.beat_mikan - 3 * min(s.day - c.last_enc_day, 10)

    def discover(s, c):
        if not c.discovered: c.discovered = True

    def guarded(s, allowed, fn, *a, **k):
        """Invariant (1): only the participants of an interaction may change."""
        allowed_ids = {c.id for c in allowed}
        before = {c.id: c.snap() for c in s.cats if c.id not in allowed_ids}
        out = fn(*a, **k)
        s.checks += 1
        for c in s.cats:
            if c.id in before and c.snap() != before[c.id]:
                s.viol += 1; s.viol_notes[fn.__name__] += 1
        return out

    # ---------------- marking acts (objects) -> Boss anger only ----------------
    def mark_acts(s, patch, extra=0):
        """One contest's marking acts on a post of the Boss's Clowder, plus `extra` Counter-Sprays elsewhere."""
        D = s.daifuku()
        n_over, n_counter = {"quiet": (2, 1), "typical": (2, 1), "loud": (0, 2)}[s.style]
        gain = 0
        if patch is not None and s.patches.get(patch) == "wall" and patch != "DEN":
            gain += 5 * n_over + 15 * n_counter
        gain += 15 * extra
        if D.state == "Seated" and gain:
            D.anger = min(100, D.anger + gain)
        s.anger_peak = max(s.anger_peak, D.anger)

    def harass(s, step):
        """Extra Counter-Sprays on gang-held outer posts (style)."""
        gang = [p for p in OUTER if s.patches[p] == "wall"]
        if not gang: return 0
        if s.style == "loud": return 1
        if s.style == "typical" and s.R.u(s.day, "D", "harass", step) < 0.5: return 1
        return 0

    # ---------------- join-in (OR-13.4) ----------------
    def join_check(s, opp, patch, enc_key):
        if s.day < 3: return None
        cands = []
        for j in s.cats:
            if j.state not in ("Truce", "Friend") or opp.id not in j.rivals or j.joined_day == s.day: continue
            near = 1 if (patch is not None and j.old_patch is not None and
                         (patch == j.old_patch or patch in NEIGH.get(j.old_patch, ()))) else 0
            p = min(0.65, 0.35 + 0.15 * near + 0.15 * (j.r >= 75))
            cands.append((j, p))
        if not cands: return None
        s.join_ops += 1
        for j, p in sorted(cands, key=lambda x: x[0].id):
            if s.R.u(s.day, "D", "join", j.id, enc_key) < p:
                return j
        return None

    # ---------------- one encounter the Posse wins (or the cat flees) ----------------
    def fight(s, c, keeper=False, opener=None, patch=None, verdict_ok=True, force_flee=None):
        joiner = s.join_check(c, patch, ("f", c.id, s.today_ops))
        allowed = [c] + ([joiner] if joiner else [])
        s.today_ops += 1
        return s.guarded(allowed, s._fight, c, keeper, opener, patch, verdict_ok, force_flee, joiner)

    def _fight(s, c, keeper, opener, patch, verdict_ok, force_flee, joiner):
        R, d = s.R, s.day
        mg, mr, _, flee, shift = P[c.pers]
        k = ("fight", c.id, s.today_ops)
        cap = 35 if c.enc < 2 else 20
        if c.enc == 0: c.first_meet = d; c.memory.append("FIRST_MEETING")
        c.enc += 1; c.last_enc_day = d; s.discover(c)
        if joiner:
            joiner.enc += 1; joiner.joined_day = d; joiner.memory.append("JOINED_IN"); s.discover(joiner)
            s.joins += 1; s.join_days.add(d); s.join_by[joiner.name] += 1
        fled = force_flee if force_flee is not None else (R.u(d, "D", "flee", *k) < flee)
        if c.rank == "Boss": fled = False
        if fled:
            c.g = min(100, c.g + min(cap, round(mg * (8 + (6 if keeper else 0)))))
            c.memory.append("FLED"); c.adapt_due = d >= 3
            if joiner: joiner.r = min(100, joiner.r + 5)
            return "fled"
        life2 = d >= 3
        ambush = (opener == "player_ambush") or (opener is None and life2 and R.u(d, "D", "amb", *k) < 0.3)
        fear = life2 and d >= 4 and R.u(d, "D", "fear", *k) < 0.3
        pile = R.u(d, "D", "pile", *k) < 0.5
        g = 6 + 3 * pile + 3 * fear + 3 * ambush + (6 if keeper else 0)
        r = -2 * fear - 3 * ambush + (8 if not (ambush or fear) else 0)
        c.routs += 1; c.memory.append("ROUTED")
        if c.scars < 2 and (c.routs >= 2 or R.u(d, "D", "scar", *k) < 0.35 + 0.15 * pile):
            c.scars += 1; c.memory.append("SCAR")
        if life2 and R.u(d, "D", "lick", *k) < 0.08 and not c.title:
            c.title = 1; c.beat_mikan = True; c.memory.append("LICK_IN")
        g_pend = min(100, c.g + min(cap, round(mg * g)))
        if joiner: joiner.r = min(100, joiner.r + 5)
        if c.rank == "Boss":    # anger spent at EncounterEnded (win)
            s.daifuku_fights += 1; c.anger = 0
        if not verdict_ok:
            c.g = g_pend; c.r = max(0, min(100, c.r + round(mr * r)))
            c.memory.append("SLIPPED_AWAY"); c.adapt_due = d >= 3
            return "slipped"
        nose_open = g_pend < 50 + shift
        s.gate_open["open" if nose_open else "closed"] += 1
        can_recruit = c.recruitable and (g_pend < 90 or c.r >= 50) and (c.rank != "Boss" or c.r >= 50) and \
            sum(1 for x in s.cats if x.state == "Crew") < 3
        v = s.choose(c, nose_open, can_recruit, k)
        s.verdicts[v] += 1
        c.memory.append("VERDICT")
        post = c.keeper_of
        if v == "chase":
            c.g = g_pend; c.r = max(0, min(100, c.r + round(mr * r)))
            c.state = "Gone"
        elif v == "recruit":
            c.g = round(g_pend / 2); c.r = min(100, c.r + round(mr * (r + 10)))
            c.state = "Crew"
            if c.clowder == "wall": c.old_gang = s.daifuku().id; c.memory.append("OLD_GANG")
            c.nerves = c.pers not in RESIST_NERVES
        else:  # nose
            c.g = 0; c.r = min(100, c.r + round(mr * (r + 25)))
            c.state = "Truce"; c.truce_until = d + 10
        c.keeper_of = None
        if post: s.clear_post(post)
        return v

    def clear_post(s, post):
        # all three Verdicts clear the post; the reference player Claim Sprays it at once (territory act)
        s.patches[post] = "mikan"
        if post == "DEN": s.den_claimed = True

    def choose(s, c, nose_open, can_recruit, k):
        pol = s.policy
        if pol == "chase": return "chase"
        if pol == "recruit": return "recruit" if can_recruit else ("nose" if nose_open else "chase")
        if pol == "pacifist": return "nose" if nose_open else ("recruit" if can_recruit else "chase")
        opts = [("chase", 40)] + ([("nose", 35)] if nose_open else []) + ([("recruit", 25)] if can_recruit else [])
        return s.R.pick(opts, s.day, "D", "verdict", *k)

    # ---------------- loss (OR-01/02): only the victor changes ----------------
    def loss(s, c):
        s.today_ops += 1
        return s.guarded([c], s._loss, c)

    def _loss(s, c):
        s.wipes += 1
        if c.enc == 0: c.first_meet = s.day; c.memory.append("FIRST_MEETING")
        c.enc += 1; c.last_enc_day = s.day; c.beat_mikan = True; s.discover(c)
        c.memory.append("WON")
        if not c.title: c.title = 1; c.memory.append("TITLE")
        mg, mr = P[c.pers][0], P[c.pers][1]
        c.g = min(100, c.g + round(mg * 5))
        c.r = max(0, min(100, c.r + (10 if c.pers == "stalwart" else round(-10 * mr))))
        if c.rank == "Boss": c.anger = 0; s.daifuku_fights += 1; c.plaster_until = s.day + 99  # -10% Nerve for the rematch
        if "loss_demote" in INJECT:   # DELETED rule (old 3.10): the victor climbs, another cat drops with a feud
            other = next((x for x in s.cats if x is not c and x.state == "Seated" and x.rank == "Tough"), None)
            if other: other.rank = "Roamer"; other.state = "Roaming"; other.rivals.add(c.id)
        return "loss"

    # ---------------- daily placements ----------------
    def presence(s):
        """OR-15.5: Togemaru turns up once a day from L2D1 until his arc closes."""
        T = s.by["Togemaru"]
        if s.day < 3 or T.state in ("Gone", "Crew"): return
        if T.state in ("Truce", "Friend"):                 # a non-hostile greeting (no encounter) or a join-in
            if GREET_COUNTS and T.joined_day != s.day:
                T.enc += 1; T.last_enc_day = s.day; s.discover(T)
            return
        if T.keeper_of and s.patches.get(T.keeper_of) != "mikan": return   # today's contest places him
        opener = "rival_ambush" if (T.g >= 50 and s.R.u(s.day, "D", "ambush_roll") < 0.5) else None
        s.fight(T, keeper=(T.keeper_of is not None), opener=opener, patch=T.keeper_of)

    def wave(s, exclude=(), tag=0):
        pool = [c for c in s.active() if c.rank in ("Tough", "Roamer") and c not in exclude and c.state != "Challenging"]
        if pool and s.R.u(s.day, "D", "wave", tag) < 0.5:
            c = s.R.choice(sorted(pool, key=lambda x: x.id), s.day, "D", "wavepick", tag)
            s.fight(c, patch=c.keeper_of)

    def contest(s, patch):
        if s.patches[patch] == "mikan": return
        if s.patches[patch] == "wall":
            s.guarded([s.daifuku()], s.mark_acts, patch, s.harass("c" + patch))
        keeper = next((c for c in s.cats if c.keeper_of == patch and c.state in ("Seated", "Roaming", "Challenging")), None)
        if keeper is None:
            s.patches[patch] = "mikan"    # Claim Spray a post with no Keeper
            return
        s.fight(keeper, keeper=True, patch=patch)

    def sniffs(s):
        """Discovery by a 1 s Whisker Sense sniff within 10 m (assumed sighting rates x p_ws)."""
        for c in s.cats:
            if c.discovered or c.state in ("Gone",): continue
            if c.state == "Crew": c.discovered = True; continue
            if c.rank == "Boss":
                seen = 0.9 if s.day == 2 else (0.3 if s.day >= 3 else 0.0)   # L1D2 prompt from the gatepost
                p = seen if s.day == 2 else seen * s.p_ws
            else:
                seen = {"Seated": 0.35, "Roaming": 0.2, "Challenging": 0.6, "Truce": 0.5, "Friend": 0.5}.get(c.state, 0)
                p = seen * s.p_ws
            if s.R.u(s.day, "D", "sniff", c.id) < p: c.discovered = True

    def wipe_day(s):
        return s.policy == "lose40" and s.day >= 2 and s.R.u(s.day, "D", "wipe") < 0.4

    def challenger_day(s):
        ch = next((c for c in s.cats if c.state == "Challenging"), None)
        if ch and s.R.u(s.day, "D", "chday") < 0.6:
            s.fight(ch, keeper=False, patch=ch.ch_patch)

    def daifuku_fight(s):
        D = s.daifuku()
        if not s.window or D.state != "Seated": return False
        s.anger_at_fight = stage(D.anger) if s.anger_at_fight is None else s.anger_at_fight
        for c in s.cats:   # Old Gang Nerves moments (recruit-side only)
            if c.state == "Crew" and c.old_gang == D.id: s.nerve_moments += 1 if c.nerves else 0
        p_lose = 0.35 if D.plaster_until >= s.day else 0.5 + 0.1 * stage(D.anger)
        if s.R.u(s.day, "D", "dlose") < p_lose:
            s.loss(D); return "loss"
        s.fight(D, keeper=True, patch="DEN")
        s.daifuku_beaten = True
        return "win"

    def play_day(s):
        d, R = s.day, s.R
        s.today_items = 0; s.today_ops = 0
        s.sniffs()
        T = s.by["Togemaru"]
        if d == 1:
            s.patches["LWC"] = "mikan"
            s.fight(T, opener="standoff", patch="LPY", force_flee=True)   # OR-14.5: cannot be interrupted
            return
        if d == 2:
            s.l1_callback = T.enc >= 1 and "FLED" in T.memory   # memory line at the gatepost Standoff
        if d >= 3:
            s.l2_days += 1
            antag = T.state in ("Seated", "Roaming", "Truce", "Friend") or \
                any(c.state == "Challenging" for c in s.cats) or s.window or stage(s.daifuku().anger) >= 1
            s.l2_antag_days += antag
        if s.wipe_day():
            foes = [c for c in s.active() if c.rank != "Boss"] or s.active()
            if d == 2 and T.state == "Seated": foes = [T]
            if foes:
                s.loss(R.choice(sorted(foes, key=lambda x: x.id), d, "D", "victor")); return
        if d == 2:
            s.contest("LPY")
        elif d == 3:
            s.presence(); s.wave([T], 1); s.next_contest()
        elif d == 4:
            rq = s.raid_req
            if rq is not None and rq.state in ("Seated", "Roaming", "Challenging") and R.u(d, "D", "cater") < 0.6:
                s.fight(rq, patch=s.raid_patch)
            s.presence(); s.wave([], 1); s.wave([], 2)
            s.guarded([s.daifuku()], s.mark_acts, None, s.harass("h4"))
            r = [c for c in s.cats if c.state == "Roaming"]
            if r and R.u(d, "D", "roam") < 0.6:
                c = R.choice(sorted(r, key=lambda x: x.id), d, "D", "roampick"); s.fight(c)
        elif d == 5:
            s.presence(); s.wave([T], 1); s.next_contest()
        elif d in (6, 7):
            s.presence()
            if not s.next_contest():
                if not s.window: s.window = True; s.window_day = d   # rescue Sprays: all four outer Strong -> 100
                s.daifuku_fight()
            s.challenger_day()
        else:
            s.presence()
            for i in range(3): s.wave([], i)
            s.challenger_day()
            if not s.next_contest():
                if not s.window: s.window = True; s.window_day = d
                if not s.daifuku_beaten and s.daifuku().state == "Seated": s.daifuku_fight()
            rq = s.raid_req
            if rq is not None and rq.state in ("Seated", "Roaming", "Challenging") and R.u(d, "D", "cater") < 0.3:
                s.fight(rq, patch=s.raid_patch)

    def next_contest(s):
        for p in ("LPY", "PA", "TSS"):
            if s.patches[p] != "mikan":
                s.contest(p) if s.patches[p] in ("wall", "open") else s.stale_claim(p)
                return True
        return False

    def stale_claim(s, p):
        keeper = next((c for c in s.cats if c.keeper_of == p and c.state in ("Seated", "Roaming", "Challenging")), None)
        if keeper is None: s.patches[p] = "mikan"; return
        s.fight(keeper, keeper=True, patch=p)

    # ---------------- Night: step 2 (Territory, coarse) and step 3 (Nemesis) ----------------
    def night(s):
        d = s.day
        s.step2()
        if not QUICK: s.counterfactual()
        s.step3(s)
        D = s.daifuku()
        if stage(D.anger) >= 2 and D.state == "Seated": s.anger_cards += 1
        if d >= 3:
            seat = [c for c in s.cats if c.state == "Seated"]
            s.share75.append(sum(1 for c in seat if c.g >= 75) / max(1, len(seat)))
        s.day += 1

    def step2(s):
        d, R = s.day, s.R
        # tonight's raid / challenge (requested last night)
        if s.raid_req is not None and s.raid_patch in s.held() and s.raid_patch not in ("LWC",):
            x = R.u(d, 2, "raid", s.raid_req.id)
            strong_or_window = s.window
            lost_p = 0.0 if strong_or_window else (0.10 if s.raid_motive == "challenge" else 0.05)
            out = "lost" if x < lost_p else "scuffed" if x < lost_p + 0.30 else "repelled"
            rq = s.raid_req
            if s.raid_motive == "challenge" and rq.state == "Challenging":
                if out == "lost":
                    s.patches[s.raid_patch] = "outsider"; rq.keeper_of = s.raid_patch; rq.state = "Seated"
                    s.ch_outcomes["took_patch"] += 1
                elif out == "repelled":
                    rq.ch_repelled += 1
                    if rq.ch_repelled >= 2: rq.state = "Gone"; s.ch_outcomes["left_town"] += 1
            elif out == "lost" and rq.state in ("Seated", "Roaming") and rq.keeper_of is None:
                s.patches[s.raid_patch] = "wall"; rq.keeper_of = s.raid_patch
        # the Boss window opens in play_day (rescue Sprays on the morning all four outer Patches are held); hysteresis ignored
        if s.h3 is None and len(s.held()) >= 3:
            s.h3 = d

    @staticmethod
    def step3(s):
        d, R = s.day, s.R
        D = s.daifuku()
        # 3a betrayals: Crew-owned Loyalty; not modelled here (Crew's sim)
        # 3b town event (F6 timing; kind never weighted by Mikan's history)
        if d >= 3:
            if s.next_town is None: s.next_town = d
            if d >= s.next_town:
                kinds = []
                gang = [c for c in s.cats if c.clowder == "wall" and c.state in ("Seated", "Roaming", "Truce") and c.rank != "Boss"]
                keeperless = [p for p in OUTER if s.patches[p] == "open"]
                tracked = sum(1 for c in s.cats if c.state in ("Seated", "Roaming", "Truce", "Challenging", "Friend"))
                if (len([c for c in gang if c.rank in ("Tough", "Captain")]) < 7 or keeperless) and tracked < 12:
                    kinds.append(("newcomer", 3))
                pairs = sorted({tuple(sorted((a.id, b))) for a in s.cats for b in a.rivals
                                if a.state in ("Seated", "Roaming", "Truce", "Friend", "Challenging")
                                and s.cat(b).state in ("Seated", "Roaming", "Truce", "Friend", "Challenging")})
                if pairs: kinds.append(("feud_scuffle", 2))
                if kinds:
                    k = R.pick(kinds, d, 3, "town", "kind")
                    s.town_events[k] += 1
                    if k == "newcomer":
                        n = s.mk(f"New{s.fresh}", R.pick(WEIGHTS, d, 3, "town", "pers"), "Tough", origin="newcomer",
                                 g=10 + int(R.u(d, 3, "town", "g") * 11))
                        if keeperless: s.patches[keeperless[0]] = "wall"; n.keeper_of = keeperless[0]
                    else:
                        a, b = R.choice(pairs, d, 3, "town", "pair")
                        loser = s.cat(a if R.u(d, 3, "town", "loser") < 0.5 else b)
                        loser.plaster_until = d + 2
                s.next_town = d + 2 + (1 if R.u(d, 3, "town", "jitter") < 0.5 else 0)
        # 3c challenger calendar and truce expiry
        for c in s.cats:
            if c.state == "Truce" and d >= c.truce_until:
                if c.r >= 75: c.state = "Friend"
                else: c.state = "Waiting"   # becomes a challenger (truce_end) on the next free calendar slot
        if s.h3 is not None:
            if s.next_ch is None: s.next_ch = s.h3 + 2
            if d == s.next_ch:
                s.next_ch += 4
                if not any(c.state == "Challenging" for c in s.cats):
                    waiting = sorted([c for c in s.cats if c.state == "Waiting"], key=lambda x: (x.truce_until, x.id))
                    if waiting:
                        ch = waiting[0]; origin = "truce_end"
                        target = ch.old_patch if ch.old_patch in s.held() and ch.old_patch not in ("LWC", "DEN") else s.ch_target()
                    else:
                        target = s.ch_target(); ch = None; origin = "calendar"
                        tracked = sum(1 for c in s.cats if c.state in ("Seated", "Roaming", "Truce", "Challenging", "Friend"))
                        if target and tracked < 12:
                            ch = s.mk(f"Challenger{s.fresh}", R.pick(WEIGHTS, d, 3, "ch", "pers"), "Tough",
                                      clowder="outsider", origin="challenger", g=10 + int(R.u(d, 3, "ch", "g") * 11))
                            if R.u(d, 3, "ch", "rival") < 0.5:
                                pool = sorted([c for c in s.cats if c.state not in ("Gone", "Crew") and c is not ch
                                               and c.clowder != "outsider"], key=lambda x: x.id)
                                if pool:
                                    t = R.choice(pool, d, 3, "ch", "rivalpick")
                                    ch.rivals.add(t.id); t.rivals.add(ch.id)
                    if ch is not None and target:
                        ch.state = "Challenging"; ch.ch_patch = target; ch.ch_repelled = 0; ch.arrived = d
                        s.challengers += 1
                        if s.first_ch_night is None: s.first_ch_night = d
                        s.ch_outcomes[origin] += 1
        # 3d adaptation (own history only), 3e decay and anger decay
        for c in s.cats:
            if c.adapt_due and c.state in ("Seated", "Roaming", "Challenging") and len(c.strengths) < 3:
                c.strengths.append("adapt"); s.adapts += 1
            c.adapt_due = False
            if c.state in ("Crew", "Gone"): continue
            if c.last_enc_day != d and not (c.name == "Togemaru" and s.arc_closed is None):
                c.g = max(0, c.g - P[c.pers][2])
        if D.state == "Seated": D.anger = max(0, D.anger - 15)
        if "stewing" in INJECT and d >= 5 and not any(c.g >= 60 for c in s.active()):   # DELETED rule (old 3.12 Stewing)
            el = [c for c in s.active() if c.enc >= 1 and c.r < 50]
            if el: y = max(el, key=lambda c: (s.arc_score(c), -c.id)); y.g = min(74, y.g + 5)
        # 3f the Declaration (fixed lead, OR-15)
        T = s.by["Togemaru"]
        if s.arc_closed is None and T.state in ("Gone", "Crew"):
            s.arc_closed = "gone" if T.state == "Gone" else "crew"
        if not s.declared and s.arc_closed is None and ((T.enc >= 3 and T.marks >= 1) or d >= 5):
            s.declared = True; s.decl_day = d; s.decl_deadline = not (T.enc >= 3 and T.marks >= 1)
        if not s.arc and T.enc >= 3 and T.marks >= 1 and (s.declared or T.state in ("Truce", "Friend", "Crew", "Gone")):
            s.arc = True; s.arc_day = d
        # 3g raid request for tomorrow (<= 1): challenge > arc lead > others; gang_orders fallback
        s.raid_req = None; s.raid_motive = None; s.raid_patch = None
        held = [p for p in s.held() if p not in ("LWC", "DEN")]
        if d >= 3 and held:
            ch = next((c for c in s.cats if c.state == "Challenging" and c.ch_patch in held and d >= c.arrived), None)
            if ch: s.raid_req, s.raid_motive, s.raid_patch = ch, "challenge", ch.ch_patch
            elif d == 3 and T.state in ("Seated", "Roaming"):
                s.raid_req, s.raid_motive = T, "grudge"
            else:
                req = sorted([c for c in s.cats if c.state in ("Seated", "Roaming") and c.g >= 40 and c.rank != "Boss"],
                             key=lambda c: (-s.arc_score(c), c.id))
                if req: s.raid_req, s.raid_motive = req[0], "grudge"
                else:
                    t = sorted([c for c in s.cats if c.state == "Seated" and c.rank == "Tough" and c.clowder == "wall"], key=lambda x: x.id)
                    if t: s.raid_req, s.raid_motive = R.choice(t, d, 3, "raid", "gang"), "gang_orders"
            if s.raid_req is not None and s.raid_patch is None:
                s.raid_patch = held[-1]
            if s.raid_req is not None: s.raids += 1

    def ch_target(s):
        held = [p for p in s.held() if p not in ("LWC", "DEN")]
        return held[-1] if held else None   # lowest Scent ~ most recently claimed (coarse proxy)

    # ---------------- invariant (2): counterfactual night ----------------
    def counterfactual(s):
        pre = [c for c in s.cats if c.state not in ("Gone",)]
        if not pre: return
        x = s.R.choice(sorted(pre, key=lambda c: c.id), s.day, "CF", "pick")
        a = copy.deepcopy(s); b = copy.deepcopy(s)
        xb = b.cat(x.id)
        xb.g = min(100, xb.g + 30); xb.r = min(100, xb.r + 30); xb.enc += 2; xb.scars = min(2, xb.scars + 1)
        World.step3(a); World.step3(b)
        s.night_checks += 1
        ids = [c.id for c in pre if c.id != x.id]
        for cid in ids:
            ca, cb = a.cat(cid), b.cat(cid)
            if ca.snap() != cb.snap():
                # the only permitted dependency: the lead's own Declaration reads only Togemaru's own record
                s.viol += 1; s.viol_notes["night_step3"] += 1
        if (a.raid_req.id if a.raid_req else None) != (b.raid_req.id if b.raid_req else None):
            s.residual += 1


def run(seed, policy, days, style="typical", p_ws=0.5):
    w = World(seed, policy, style, p_ws)
    for _ in range(days):
        w.play_day(); w.night()
    return w


def pct(x): return f"{x:.0%}"


def report(days, n, label):
    pols = ["chase", "recruit", "mixed", "pacifist", "lose40"]
    styles = ["quiet", "typical", "loud"]
    print(f"\n### {label}: {days} days, {n} seeds per policy (marking style cycles quiet/typical/loud by seed)")
    print("| Policy | L1 memory line | Verdicts chase / recruit / nose | Nose gate open | Nemesis record = Togemaru | Declared (night median; by deadline) | Face Sworn Rival | Arc closed early (Gone / Crew) | Arc achieved | Join-ins per run (mean; runs >= 1) | Lane cats discovered at end (mean / of present) | Daifuku discovered | Seated at G>=75 (mean) | L2 days with an antagonist | Violations / checks |")
    print("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    out = {}
    for pol in pols:
        ws = [run(sd, pol, days, styles[sd % 3]) for sd in range(n)]
        out[pol] = ws
        v = Counter(); [v.update(w.verdicts) for w in ws]; tv = max(1, sum(v.values()))
        go = Counter(); [go.update(w.gate_open) for w in ws]
        l1 = sum(w.l1_callback for w in ws) / n
        rec = sum(1 for w in ws if w.declared or w.arc_closed)   # the one record: Togemaru declared, or his arc closed (Gone / Crew)
        decl = [w for w in ws if w.declared]
        dn = st.median([w.decl_day for w in decl]) if decl else "-"
        dd = sum(w.decl_deadline for w in decl) / max(1, len(decl))
        face = sum(1 for w in decl if w.by["Togemaru"].r > w.by["Togemaru"].g) / max(1, len(decl))
        cg = sum(1 for w in ws if w.arc_closed == "gone") / n; cc = sum(1 for w in ws if w.arc_closed == "crew") / n
        arc = sum(w.arc for w in ws) / n
        jm = st.mean(w.joins for w in ws); j1 = sum(1 for w in ws if w.joins) / n
        lane = [w for w in ws]
        disc = st.mean(sum(1 for c in w.cats if c.discovered and c.clowder == "wall" and c.state != "Crew") for w in ws)
        present = st.mean(sum(1 for c in w.cats if c.clowder == "wall" and c.state != "Crew") for w in ws)
        dfk = sum(1 for w in ws if w.daifuku().discovered) / n
        s75 = st.mean(st.mean(w.share75) for w in ws if w.share75)
        ant = st.mean(w.l2_antag_days / max(1, w.l2_days) for w in ws)
        viol = sum(w.viol for w in ws); chk = sum(w.checks + w.night_checks for w in ws)
        print(f"| {pol} | {pct(l1)} | {pct(v['chase']/tv)} / {pct(v['recruit']/tv)} / {pct(v['nose']/tv)} | {pct(go['open']/max(1,sum(go.values())))} | {pct(rec/n)} | {pct(len(decl)/n)} (night {dn}; {pct(dd)}) | {pct(face)} | {pct(cg)} / {pct(cc)} | {pct(arc)} | {jm:.2f}; {pct(j1)} | {disc:.1f} / {present:.1f} | {pct(dfk)} | {s75:.1%} | {pct(ant)} | {viol} / {chk} |")
    return out


def anger_table(out):
    print("\n#### Boss anger by marking style (all policies pooled)")
    print("| Style | Peak stage reached (Calm / Riled / Seething / Furious) | Stage at the first Daifuku fight (Calm / Riled / Seething / Furious) | Mornings with a Seething+ Sniff card (mean) | Daifuku fights per run (mean) | Old Gang Nerves moments per run |")
    print("|---|---|---|---|---|---|")
    for sty in ("quiet", "typical", "loud"):
        ws = [w for pol in out for w in out[pol] if w.style == sty]
        pk = Counter(stage(w.anger_peak) for w in ws)
        af = Counter(w.anger_at_fight for w in ws if w.anger_at_fight is not None)
        naf = max(1, sum(af.values()))
        print(f"| {sty} | " + " / ".join(pct(pk[i] / len(ws)) for i in range(4)) + " | " +
              " / ".join(pct(af[i] / naf) for i in range(4)) + f" (n={naf}) | {st.mean(w.anger_cards for w in ws):.2f} | "
              f"{st.mean(w.daifuku_fights for w in ws):.2f} | {st.mean(w.nerve_moments for w in ws):.2f} |")


def world_table(out, days):
    print("\n#### Town, challengers, residual")
    print("| Policy | Town events per L2 night (newcomer / feud scuffle) | Newcomers per run | Challengers per run (first arrival night median) | Challenger outcomes (took a Patch / left town / truce_end) | Raid requests per run | Adaptations per run | Wipes per run | Residual: raid requester changes under counterfactual (per night) |")
    print("|---|---|---|---|---|---|---|---|---|")
    for pol, ws in out.items():
        nights = max(1, days - 2)
        te = Counter(); [te.update(w.town_events) for w in ws]
        co = Counter(); [co.update(w.ch_outcomes) for w in ws]
        fcn = [w.first_ch_night for w in ws if w.first_ch_night]
        res = sum(w.residual for w in ws) / max(1, sum(w.night_checks for w in ws))
        print(f"| {pol} | {te['newcomer']/len(ws)/nights:.2f} / {te['feud_scuffle']/len(ws)/nights:.2f} | {te['newcomer']/len(ws):.2f} | "
              f"{st.mean(w.challengers for w in ws):.2f} ({st.median(fcn) if fcn else '-'}) | "
              f"{co['took_patch']/len(ws):.2f} / {co['left_town']/len(ws):.2f} / {co['truce_end']/len(ws):.2f} | "
              f"{st.mean(w.raids for w in ws):.2f} | {st.mean(w.adapts for w in ws):.2f} | {st.mean(w.wipes for w in ws):.2f} | {res:.1%} |")


def join_detail(out):
    print("\n#### Join-ins (OR-13.4)")
    print("| Policy | Join opportunities per run | Joins per run | Joins per opportunity | Runs with >= 1 join | Joiners |")
    print("|---|---|---|---|---|---|")
    for pol, ws in out.items():
        ops = st.mean(w.join_ops for w in ws); jn = st.mean(w.joins for w in ws)
        by = Counter(); [by.update(w.join_by) for w in ws]
        print(f"| {pol} | {ops:.2f} | {jn:.2f} | {jn/ops if ops else 0:.0%} | {sum(1 for w in ws if w.joins)/len(ws):.0%} | {dict(by.most_common(4))} |")


def sniff_sensitivity(n):
    print("\n#### Discovery sensitivity (mixed policy, typical style): Whisker Sense sniff success per sighting")
    print("| p_ws | Lane cats discovered (mean / present) | All prehistory Lane cats discovered | Daifuku discovered | Silhouettes left on the Lane row (mean) |")
    print("|---|---|---|---|---|")
    for p in (0.25, 0.5, 0.75):
        ws = [run(sd, "mixed", 7, "typical", p) for sd in range(n)]
        disc = st.mean(sum(1 for c in w.cats if c.discovered and c.clowder == "wall" and c.state != "Crew") for w in ws)
        pres = st.mean(sum(1 for c in w.cats if c.clowder == "wall" and c.state != "Crew") for w in ws)
        allp = sum(1 for w in ws if all(w.cat(i).discovered for i in w.tracked_prehistory)) / n
        sil = st.mean(sum(1 for c in w.cats if not c.discovered and c.clowder == "wall" and c.state not in ("Crew", "Gone")) for w in ws)
        print(f"| {p} | {disc:.1f} / {pres:.1f} | {allp:.0%} | {sum(1 for w in ws if w.daifuku().discovered)/n:.0%} | {sil:.1f} |")


def selftest(n=200):
    global INJECT, QUICK
    QUICK = False
    print("\n#### Self-test: deleted rules re-injected (the checks must catch them)")
    print("| Injected rule | Runs | Violations caught | Where |")
    print("|---|---|---|---|")
    for rule, pol in (("loss_demote", "lose40"), ("stewing", "mixed")):
        INJECT = {rule}
        ws = [run(sd, pol, 7, ("quiet", "typical", "loud")[sd % 3]) for sd in range(n)]
        notes = Counter(); [notes.update(w.viol_notes) for w in ws]
        print(f"| {rule} ({pol}) | {n} | {sum(w.viol for w in ws)} | {dict(notes)} |")
    INJECT = set()


def greet_lever(n=500):
    global GREET_COUNTS, QUICK
    QUICK = True; GREET_COUNTS = True
    print("\n#### Lever (not the ruling): a truce lead's daily greeting counts as an arc encounter")
    print("| Policy | Arc achieved (ruling) -> (lever) |")
    print("|---|---|")
    for pol in ("mixed", "pacifist"):
        GREET_COUNTS = False
        a = sum(run(sd, pol, 7, ("quiet", "typical", "loud")[sd % 3]).arc for sd in range(n)) / n
        GREET_COUNTS = True
        b = sum(run(sd, pol, 7, ("quiet", "typical", "loud")[sd % 3]).arc for sd in range(n)) / n
        print(f"| {pol} | {a:.0%} -> {b:.0%} |")
    GREET_COUNTS = False


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        selftest(); sys.exit()
    n7 = 150 if QUICK else 500
    n30 = 60 if QUICK else 300
    print("Variant: OWNER-FEEDBACK (OR-01..OR-21) as written into nemesis-system.md, 2026-11-24")
    out = report(7, n7, "Slice (Lives 1-2)")
    anger_table(out); world_table(out, 7); join_detail(out)
    sniff_sensitivity(n7)
    selftest(n7 // 2 if not QUICK else 60)
    greet_lever(n7)
    QUICK = True   # the counterfactual check runs on the slice; the 30-day extrapolation skips it for speed
    out30 = report(30, n30, "Extrapolation (one district, 30 days; counterfactual check off)")
    world_table(out30, 30); join_detail(out30)

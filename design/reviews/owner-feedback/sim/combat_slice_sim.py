#!/usr/bin/env python3
"""Owner-feedback pass (2026-11-24) copy of the round-2 combat sim (round-2/sim/combat_slice_sim.py;
there is no round-3 successor). Everything up to `main()` is the round-2 model, unchanged, so its
figures are the "before" (combat_slice_sim.before.out.txt). The new section `owner_feedback()` adds,
for Daifuku only:
  - an incoming-damage model (Combat F10: one attack per 4 s, 2 MV x rank 1.6, a landed fraction set
    by dodge quality; held while he is Frazzled, during Pile-Ons and phase breaks; each 2-Tough wave
    adds 4 MV), Purr heals (HealMV 3.0, commanded when an ally is < 40%, 60% cap), Routs and the wipe;
  - Fired Up from Boss anger (OR-07): x1.25 to his damage for 20 s / 40 s / the whole fight,
    suspended (timer running) while the bucket's Soggy is on him (Combat sec. 3.5 rule);
  - Old Gang Nerves (OR-06): a Cowed recruit's AI will not target the Old Boss (deals 0 basics to
    him) and its commanded Moves deal x0.75, for 20 s unless a Tag-In to it clears it;
  - a Nose-Touch join-in ally (OR-13): an allied AI guest, basics only, no Paws, no Pile-On, takes
    hits like an AI Posse cat, arriving 3 s after the yowl (at the start, or with the phase-2 wave).
Deterministic: no random numbers. Observations, not verdicts.

Round-2 header follows.
Round-2 combat check: time-stepped expected-value sim of combat-system.md (slice).

Uses only Combat's own rules and tables (F1-F9, sec. 3.x) plus Crew's stat curve/weights
(crew-and-progression.md F1, sec. 3.6). Deterministic: no random numbers.

Two model variants:
  doc   - Combat F9's own assumptions: neutral stats, every Paw = 3.5 MV + 30 FZ.
  slice - Crew's Style stat weights (Bite/Voice/Hide) at Lv 8, the slice Posse
          (Mikan Scrapper, Hige Bruiser, Pon Yowler, Thorn Scrapper), DR-06 type chart,
          and per-Paw Move values read off Combat's 12-Move catalogue (sec. 3.10).

Run: python3 combat_slice_sim.py
"""

DT = 0.05
MV_PCT = 0.045                     # 1 MV = 4.5% of a same-level neutral Nerve bar
BAR = 1 / MV_PCT                   # 22.22 MV per neutral bar

# ---- Combat sec. 3.2 / F2 / F3 ----
STRING_MV, STRING_FZ, CYCLE = 3.5, 30.0, 1.8
UP_CTRL, UP_AI = 0.65, 0.35
PAW_PASSIVE, PAW_HIT, PAW_FIN = 4.0, 4.0, 6.0
AI_FILL = 0.5
TAG_PERIOD, TAG_MV, TAG_FZ, TAG_GRANT = 10.0, 1.5, 20.0, 25.0
R_RANK = {"tough": 1.0, "captain": 0.20, "boss": 0.15}
FRAZ_S, FRAZ_DMG = 6.0, 1.5
WALL_S = 8.0                       # assumed time Daifuku stays on his wall before a knock-off
QUICK_PILE_S, FULL_PILE_S, PILE_BASE, PILE_K = 1.2, 2.5, 2.0, 1.0
RUFFLE_S, RUFFLE_CD = 4.0, 6.0

def hits_per_s(up):            # 3 hits per 1.8 s cycle
    return up * 3 / CYCLE

def paw_rate(up, fill):        # points / s  (F3)
    per_hit = (2 * PAW_HIT + PAW_FIN) / 3
    return fill * (PAW_PASSIVE + hits_per_s(up) * per_hit)

# ---- Crew F1 stats (Lv 8) ----
STYLE_W = {  # nerve, bite, hide, voice, zip
    "bruiser": (1.30, 1.00, 1.25, 0.75, 0.70),
    "scrapper": (1.00, 1.20, 0.90, 0.75, 1.15),
    "yowler": (0.90, 0.75, 0.95, 1.35, 1.05),
}
TYPE_OF = {"bruiser": "thump", "scrapper": "claw", "yowler": "yowl"}
WEAK_TO = {"bruiser": "fang", "scrapper": "thump", "yowler": "claw"}

def n_ref(L): return 100 + 1400 * (L - 1) / 29
def s_ref(L): return 10 + 90 * (L - 1) / 29
def rnd(x): return int(x + 0.5)

def stat(style, idx, L):
    base = n_ref(L) if idx == 0 else s_ref(L)
    return rnd(base * STYLE_W[style][idx])

def type_mult(att, dfn):
    t = TYPE_OF[att]
    if t == TYPE_OF[dfn]: return 0.8
    if t == WEAK_TO[dfn]: return 1.2
    return 1.0

def dmg_factor(att, dfn, L=8):
    off = stat(att, 3 if att == "yowler" else 1, L) / s_ref(L)
    hide = min(1.25, max(0.75, s_ref(L) / stat(dfn, 2, L)))
    return off * hide * type_mult(att, dfn)

def fz_factor(att, dfn):
    return 1.2 if TYPE_OF[att] == WEAK_TO[dfn] else 1.0

# ---- Combat sec. 3.10 catalogue: per-Paw single-target value (unconditional / conditional) ----
CATALOGUE = {  # id: (style, paws, mv, fz, mv_cond, fz_cond, damage_move?)
    "face_swat": ("scrapper", 1, 2.0, 20, 2.0, 20, True),
    "scruff_toss": ("scrapper", 1, 2.0, 25, 3.0, 25, True),
    "bunny_kick": ("scrapper", 1, 3.0, 25, 4.5, 45, True),
    "shred": ("scrapper", 2, 7.0, 50, 9.1, 50, True),
    "shoulder_check": ("bruiser", 1, 2.5, 30, 2.5, 30, True),
    "belly_flop": ("bruiser", 1, 2.0, 25, 3.0, 40, True),
    "puff_up": ("bruiser", 1, 0.0, 0, 0.0, 0, False),
    "sit_on_it": ("bruiser", 2, 7.0, 50, 9.1, 80, True),
    "withering_hiss": ("yowler", 1, 1.5, 0, 1.5, 0, True),
    "howl": ("yowler", 1, 1.0, 15, 1.0, 15, True),
    "purr": ("yowler", 1, 0.0, 0, 0.0, 0, False),
    "banshee_screech": ("yowler", 2, 2.5, 35, 3.75, 52.5, True),
}

def per_paw(moves, cond_share=0.5):
    mv = fz = 0.0
    for m in moves:
        _, p, a, b, ac, bc, _ = CATALOGUE[m]
        mv += ((1 - cond_share) * a + cond_share * ac) / p
        fz += ((1 - cond_share) * b + cond_share * bc) / p
    return mv / len(moves), fz / len(moves)

SLICE_KITS = {  # Lv 8 Posse at Daifuku, Moves from Crew instinct ranks remapped to Combat ids
    "Mikan": ("scrapper", ["face_swat", "bunny_kick", "scruff_toss", "shred"]),
    "Hige": ("bruiser", ["shoulder_check", "belly_flop", "puff_up", "sit_on_it"]),
    "Pon": ("yowler", ["withering_hiss", "purr", "howl", "banshee_screech"]),
    "Thorn": ("scrapper", ["face_swat", "bunny_kick", "scruff_toss", "shred"]),
}

class Model:
    def __init__(self, variant, target_style="scrapper", mikan_only=False, tag_period=TAG_PERIOD,
                 ruffle_period=16.0, relay_flat=10.0):
        self.variant = variant
        self.mikan_only = mikan_only
        self.tag_period = None if mikan_only else tag_period
        self.ruffle_period = ruffle_period
        self.relay_flat = relay_flat
        names = list(SLICE_KITS)
        if variant == "doc":
            self.dmgf = [1.0] * 4; self.fzf = [1.0] * 4
            self.paw_mv = [3.5] * 4; self.paw_fz = [30.0] * 4; self.typemod = [1.0] * 4
        else:
            styles = [SLICE_KITS[n][0] for n in names]
            if target_style == "mixed":
                ts = ["bruiser", "scrapper", "yowler"]
                self.dmgf = [sum(dmg_factor(s, t) for t in ts) / 3 for s in styles]
                self.fzf = [sum(fz_factor(s, t) for t in ts) / 3 for s in styles]
                self.typemod = [sum(type_mult(s, t) for t in ts) / 3 for s in styles]
            else:
                self.dmgf = [dmg_factor(s, target_style) for s in styles]
                self.fzf = [fz_factor(s, target_style) for s in styles]
                self.typemod = [type_mult(s, target_style) for s in styles]
            pp = [per_paw(SLICE_KITS[n][1]) for n in names]
            self.paw_mv = [p[0] for p in pp]; self.paw_fz = [p[1] for p in pp]

def run(kind, model, n_toughs=0, tough_style_nerve=1.0, captain_nerve=1.0, boss_nerve=1.3,
        expert=False, verbose=False):
    """kind: 'tough_focus' | 'tough_alone' | 'group' | 'captain' | 'boss'."""
    m = model
    t = 0.0
    paws = [0.0] * 4                       # points per cat (0 = controlled = Mikan)
    src = dict(ctrl_basics=0.0, ai_basics=0.0, moves_ctrl=0.0, moves_ai=0.0, tagin=0.0, pileon=0.0)
    stats = dict(frazzles=0, moves=0, paws_earned=0.0, first_paw=[None] * 4, fz_per_phase=[0, 0, 0],
                 zoomies_fz_events=0)
    tag_clock = 0.0; ruffle_clock = 0.0
    earned = [0.0] * 4                     # passive+hit income per cat (excl. grants), for first-Paw time
    active = [0, 1, 2, 3] if kind != "tough_focus" else [0, 1]
    overhead = {"tough_focus": 1.0, "tough_alone": 1.0, "group": 3.0, "captain": 2.0, "boss": 3.0}[kind]

    # enemy list
    if kind in ("tough_focus", "tough_alone"):
        enemies = [dict(rank="tough", nerve=BAR * tough_style_nerve)]
    elif kind == "group":
        enemies = [dict(rank="tough", nerve=BAR * tough_style_nerve) for _ in range(n_toughs)]
    elif kind == "captain":
        enemies = [dict(rank="captain", nerve=8 * BAR * captain_nerve)]
    else:
        enemies = [dict(rank="boss", nerve=20 * BAR * boss_nerve)]
    for e in enemies:
        e.update(max=e["nerve"], fz=0.0, fraz=0.0, ruf=0.0, rufcd=0.0)

    boss_max = enemies[0]["max"] if kind == "boss" else None
    phase = 0; thresholds = [0.70, 0.35]
    boss_state = "wall"; boss_clock = 0.0; pending_break = False; carry = 0.0
    if kind == "group": focus_base = 0.55
    elif kind == "captain": focus_base = 1.0 if expert else 0.75
    else: focus_base = 1.0
    reserve = 200.0 if kind in ("captain", "boss") else 0.0
    if expert:
        m.relay_flat = 45.0; m.tag_period = 10.0; m.ruffle_period = 10.0

    def deal(e, mv, key):
        nonlocal pending_break, carry
        if mv <= 0: return
        mult = FRAZ_DMG if e["fraz"] > 0 else 1.0
        amt = mv * mult
        if kind == "boss" and phase < 2:
            floor_ = boss_max * thresholds[phase]
            if e["nerve"] - amt < floor_:
                over = floor_ - (e["nerve"] - amt)
                if e["fraz"] > 0:      # break deferred; overflow (<=10%) carried
                    carry = min(0.10 * boss_max, carry + over)
                amt = e["nerve"] - floor_
                pending_break = True
        e["nerve"] -= amt
        src[key] += amt

    def add_fz(e, fz, flat=0.0):
        if e["fraz"] > 0: return
        mult = R_RANK[e["rank"]] * (2.0 if e["ruf"] > 0 else 1.0)
        e["fz"] += fz * mult + flat
        if e["fz"] >= 100:
            e["fz"] = 0.0; e["fraz"] = FRAZ_S; stats["frazzles"] += 1; stats["zoomies_fz_events"] += 1
            if kind == "boss": stats["fz_per_phase"][phase] += 1

    def ruffle(e):
        if e["ruf"] > 0 or e["rufcd"] > 0: return
        e["ruf"] = RUFFLE_S

    def spend_moves(e, focus, all_in=False):
        """Commanded Moves: spend whole Paws above the reserve (or everything if all_in)."""
        spent = False
        for i in active:
            while paws[i] >= 100 and (all_in or sum(paws) - 100 >= reserve):
                paws[i] -= 100; stats["moves"] += 1
                deal(e, m.paw_mv[i] * m.dmgf[i] * focus, "moves_ctrl" if i == 0 else "moves_ai")
                add_fz(e, m.paw_fz[i] * m.fzf[i] * focus)
                spent = True
        return spent

    def pile_on_value(T_rem):
        return sum((PILE_BASE + PILE_K * T_rem) * FRAZ_DMG * m.typemod[i] for i in active)

    while enemies and t < 600:
        e = enemies[0]
        last = len(enemies) == 1
        # --- focus by context ---
        if kind == "boss":
            if pending_break and e["fraz"] <= 0:
                # phase break: 3.5 s invulnerable, +50 Pounce to every cat
                t += 3.5; pending_break = False; phase += 1
                e["nerve"] = min(e["nerve"], boss_max * thresholds[phase - 1]) - carry; carry = 0.0
                for i in active: paws[i] = min(200, paws[i] + 50)
                # Tough wave (2 Toughs) cleared at group focus before the knock-off cycle resumes
                sub = run("group", Model(m.variant, "mixed", m.mikan_only), n_toughs=2)
                t += sub["time"] - 3.0
                boss_state = "wall"; boss_clock = 0.0
                continue
            focus = 0.5 if boss_state == "wall" else 0.85
        elif kind == "tough_focus":
            focus = 1.0
        else:
            focus = focus_base
        # --- Frazzle window handling (leaders): dump Paws, then Pile-On ---
        if e["fraz"] > 0 and e["rank"] in ("captain", "boss"):
            T_rem = e["fraz"]
            # F5(c) policy: dump banked Paws while >= 4.5 s remain, then cash in
            if e["nerve"] <= pile_on_value(T_rem) or sum(paws) < 100 or T_rem <= 4.5:
                val = pile_on_value(T_rem)
                deal(e, val / FRAZ_DMG, "pileon")   # deal() re-applies the x1.5
                t += FULL_PILE_S; e["fraz"] = 0.0; e["fz"] = 0.0
                if e["nerve"] <= 1e-6: enemies.pop(0)
                continue
            # dump one Paw per 0.75 s
            for i in active:
                if paws[i] >= 100:
                    paws[i] -= 100; stats["moves"] += 1
                    deal(e, m.paw_mv[i] * m.dmgf[i], "moves_ctrl" if i == 0 else "moves_ai")
                    break
            step = 0.75
        elif e["fraz"] > 0 and last and e["rank"] == "tough" and kind != "tough_focus":
            t += QUICK_PILE_S; src["pileon"] += e["nerve"]; enemies.pop(0); continue
        else:
            step = DT
        # --- continuous output over `step` ---
        ctrl = STRING_MV / CYCLE * UP_CTRL * m.dmgf[0] * focus * step
        ai = sum(STRING_MV / CYCLE * UP_AI * m.dmgf[i] * focus * step for i in active[1:])
        fz = (STRING_FZ / CYCLE * UP_CTRL * m.fzf[0] + sum(STRING_FZ / CYCLE * UP_AI * m.fzf[i]
              for i in active[1:])) * focus * step
        deal(e, ctrl, "ctrl_basics"); deal(e, ai, "ai_basics"); add_fz(e, fz)
        # Paw income (not focus-scaled: hits land on someone)
        for i in active:
            inc = paw_rate(UP_CTRL, 1.0) if i == 0 else paw_rate(UP_AI, AI_FILL)
            before = paws[i]; paws[i] = min(200, paws[i] + inc * step); stats["paws_earned"] += (paws[i] - before) / 100
            earned[i] += inc * step
            if stats["first_paw"][i] is None and earned[i] >= 100: stats["first_paw"][i] = round(t, 1)
        # Tag-Ins
        if m.tag_period:
            tag_clock += step
            if tag_clock >= m.tag_period:
                tag_clock -= m.tag_period
                deal(e, TAG_MV * focus, "tagin")
                add_fz(e, TAG_FZ * focus, flat=m.relay_flat if e["rank"] != "tough" else 0.0)
                for i in active[:2]:
                    before = paws[i]; paws[i] = min(200, paws[i] + TAG_GRANT); stats["paws_earned"] += (paws[i] - before) / 100
        # Ruffle opportunities on leaders (Hiss on a yellow / Face Swat / prop)
        if e["rank"] != "tough":
            ruffle_clock += step
            if ruffle_clock >= m.ruffle_period:
                ruffle_clock = 0.0; ruffle(e)
        # Boss knock-off cycle (8 s wall, knock-off, 6 s ground)
        if kind == "boss" and e["fraz"] <= 0:
            boss_clock += step
            if boss_state == "wall" and boss_clock >= WALL_S:
                boss_state = "ground"; boss_clock = 0.0
                add_fz(e, 0.0, flat=30.0)          # knock-off 20 + bucket 10
                ruffle(e)
            elif boss_state == "ground" and boss_clock >= 6.0:
                boss_state = "wall"; boss_clock = 0.0
        # Moves
        spend_moves(e, focus)
        # timers
        if e["ruf"] > 0:
            e["ruf"] -= step
            if e["ruf"] <= 0 and e["rank"] != "tough": e["rufcd"] = RUFFLE_CD
        elif e["rufcd"] > 0: e["rufcd"] -= step
        if e["fraz"] > 0 and e["rank"] == "tough":
            e["fraz"] -= step
        elif e["fraz"] > 0:
            e["fraz"] -= step
            if e["fraz"] <= 0: e["fz"] = 0.0
        t += step
        if e["nerve"] <= 1e-6:
            enemies.pop(0)
    total = sum(src.values())
    return dict(time=t + overhead, src=src, total=total, **stats)

def shares(r):
    s, tot = r["src"], r["total"]
    return {k: v / tot for k, v in s.items()}

def crew_share(r):
    s, tot = r["src"], r["total"]
    return (s["ai_basics"] + s["moves_ai"] + s["tagin"] + 0.75 * s["pileon"]) / tot

def main():
    print("== F1 check: Lv 8 Mikan string hit 1 (MV 1.0) with Crew stats ==")
    B = MV_PCT * n_ref(8)
    for dfn, claim in (("bruiser", 20), ("scrapper", 16), ("yowler", 24)):
        d = rnd(B * dmg_factor("scrapper", dfn))
        print(f"  vs {dfn:8s} Tough: Crew stats -> {d:3d}   (Combat F1 example claims {claim})")
    print("  neutral hit% by level (integer damage):",
          ", ".join(f"L{L} {100 * rnd(MV_PCT * n_ref(L)) / n_ref(L):.2f}%" for L in range(1, 9)))
    print("  Style basic-hit power vs a neutral defender (Off/S_ref):",
          {s: round(stat(s, 3 if s == 'yowler' else 1, 8) / s_ref(8), 3) for s in STYLE_W})

    print("\n== Catalogue per-Paw value (single target, 50% conditional uptime) ==")
    allm = list(CATALOGUE)
    mv, fz = per_paw(allm)
    dm = [k for k in allm if CATALOGUE[k][6]]
    mv2, fz2 = per_paw(dm)
    print(f"  all 12: {mv:.2f} MV, {fz:.1f} FZ per Paw | damage Moves only: {mv2:.2f} MV, {fz2:.1f} FZ"
          f"  (F9 assumes 3.5 MV, 30 FZ)")
    for n, (s, ks) in SLICE_KITS.items():
        a, b = per_paw(ks); print(f"  {n:6s} ({s}): {a:.2f} MV / {b:.1f} FZ per Paw")

    print("\n== Gauge income (F3) ==")
    c, a = paw_rate(UP_CTRL, 1), paw_rate(UP_AI, AI_FILL)
    print(f"  controlled {c:.2f} pts/s (1 Paw / {100 / c:.1f} s); AI {a:.2f} pts/s (1 Paw / {100 / a:.1f} s);"
          f" AI's first self-spend needs 2 Paws = {200 / a:.0f} s")
    print(f"  Posse incl. Tag-Ins: {(c + 3 * a + 5) / 100:.3f} Paws/s")

    rows = []
    cases = [
        ("Tough, focused (in a group)", "tough_focus", {}, "6-10 s", "7.9 s"),
        ("Tough, alone (Quick Pile-On)", "tough_alone", {}, "6-10 s", "-"),
        ("2 Toughs", "group", {"n_toughs": 2}, "skirmish (A2)", "16 s"),
        ("3 Toughs", "group", {"n_toughs": 3}, "skirmish (A2)", "24 s"),
        ("4 Toughs", "group", {"n_toughs": 4}, "30-60 s", "31 s"),
        ("6 Toughs", "group", {"n_toughs": 6}, "30-60 s", "44 s"),
        ("Captain (neutral)", "captain", {}, "30-45 s", "36.7 s"),
        ("Captain, Bruiser x1.3", "captain", {"captain_nerve": 1.3}, "30-45 s", "44 s"),
        ("Captain, Yowler x0.9 (Kagi)", "captain", {"captain_nerve": 0.9}, "30-45 s", "33 s"),
        ("Captain, expert policy", "captain", {"expert": True}, ">= 21 s", "25 s"),
        ("Daifuku (Boss, x26)", "boss", {}, "120-180 s", "140 s"),
    ]
    print("\n== Fight lengths, damage share, gauge ==")
    hdr = f"{'case':30s} {'variant':6s} {'time':>7s} {'target':>13s} {'doc':>7s} {'Frz':>4s} {'Moves':>5s} " \
          f"{'Paws':>5s} {'ldrBas':>6s} {'aiBas':>6s} {'Moves%':>6s} {'Tag':>5s} {'Pile':>5s} {'Crew%':>6s}"
    print(hdr)
    for label, kind, kw, target, doc in cases:
        for var in ("doc", "slice"):
            tstyle = {"captain": {0.9: "yowler", 1.3: "bruiser"}.get(kw.get("captain_nerve", 1.0), "scrapper"),
                      "boss": "bruiser"}.get(kind, "mixed")
            mdl = Model(var, tstyle)
            r = run(kind, mdl, **kw)
            mo = Model(var, tstyle, mikan_only=True)
            ro = run(kind, mo, **kw)
            sh = shares(r)
            fpp = "/".join(str(x) for x in r["fz_per_phase"]) if kind == "boss" else str(r["frazzles"])
            line = (f"{label:30s} {var:6s} {r['time']:6.1f}s {target:>13s} {doc:>7s} {fpp:>4s} {r['moves']:5d} "
                    f"{r['paws_earned']:5.1f} {100 * sh['ctrl_basics']:5.0f}% {100 * sh['ai_basics']:5.0f}% "
                    f"{100 * (sh['moves_ctrl'] + sh['moves_ai']):5.0f}% {100 * sh['tagin']:4.0f}% "
                    f"{100 * sh['pileon']:4.0f}% {100 * crew_share(ro):5.0f}%")
            print(line)
            rows.append((label, var, r, ro))
    print("\n  Crew% = Crew share of Posse damage under a Mikan-only policy (no Tag-Ins), DR-33 target >= 55%.")
    print("  Frz = Frazzles in the fight (Boss: per phase 1/2/3), DR-32 target >= 1 per phase.")

    print("\n== Zoomies pace (F8: +10 per enemy Frazzle to every standing cat, + up to 40 from damage) ==")
    for label, var, r, _ in rows:
        if var == "doc" and label in ("4 Toughs", "6 Toughs", "3 Toughs"):
            gain = 10 * r["zoomies_fz_events"] + 21   # ~21% Nerve lost (F10)
            print(f"  {label}: {r['zoomies_fz_events']} Frazzles -> +{gain} per cat "
                  f"(doc claims ~+50, i.e. 1 Zoomies per 2 encounters)")

    print("\n== Commanded-Move supply in short fights (DR-02: >= 3 commanded Moves per encounter) ==")
    for label, var, r, _ in rows:
        if var == "doc" and label in ("Tough, focused (in a group)", "2 Toughs", "3 Toughs", "4 Toughs"):
            print(f"  {label}: {r['moves']} Moves castable; first Paw per cat (s): {r['first_paw']}")

def sensitivity():
    global WALL_S
    print("\n== Sensitivity: Daifuku vs time between knock-offs (wall time before each knock-off) ==")
    for w in (8.0, 12.0, 16.0, 24.0, 1e9):
        WALL_S = w
        r = run("boss", Model("slice", "bruiser"))
        lab = "never knocked off" if w > 1e6 else f"wall {w:.0f} s"
        print(f"  {lab:18s}: {r['time']:6.1f} s, Frazzles per phase {r['fz_per_phase']}")
    WALL_S = 8.0
    print("\n== Sensitivity: Bruiser Captain (x1.3) vs Captain Frazzle resistance r_rank ==")
    for rr in (0.20, 0.25, 0.30):
        R_RANK["captain"] = rr
        r = run("captain", Model("slice", "bruiser"), captain_nerve=1.3)
        r2 = run("captain", Model("slice", "yowler"), captain_nerve=0.9)
        print(f"  r_rank {rr:.2f}: Bruiser Captain {r['time']:5.1f} s ({r['frazzles']} Frz) | Yowler Captain {r2['time']:5.1f} s")
    R_RANK["captain"] = 0.20

# =====================================================================================
# Owner-feedback pass (2026-11-24): incoming damage, Fired Up (anger), Cowed recruit, join-in ally
# =====================================================================================
KITS = dict(SLICE_KITS)
KITS["Kagi"] = ("yowler", ["withering_hiss", "purr", "howl", "banshee_screech"])     # Schemer Yowler Captain
KITS["Kinako"] = ("scrapper", ["face_swat", "bunny_kick", "scruff_toss", "shred"])  # Fraidy Scrapper
NERVE_BONUS = {"Thorn": 1.15}          # Togemaru's Signature Strength: +15% Nerve (Crew R-2)
BOSS_SWING_S, BOSS_SWING_MV, BOSS_RANK_DMG = 4.0, 2.0, 1.6
WAVE_IN_MV = 4.0                       # F10: the two Tough waves add ~8 MV at the median landed share
FIRED_UP, COWED = 1.25, 0.75
SOGGY_S = 6.0
PURR_MV, HEAL_CAP, PURR_BELOW = 3.0, 0.60, 0.40

def run_boss(posse=("Mikan", "Hige", "Pon", "Thorn"), fired_up_s=0.0, land=0.5, boss_nerve=1.3,
             cowed=None, cowed_s=20.0, clear_by_tag=False, guest=None, guest_from="start",
             incoming=True, variant="slice"):
    """Daifuku, 3 phases, slice variant. Returns time, outcome, Routs, incoming as % of Posse Nerve."""
    names = list(posse)
    styles = [KITS[n][0] for n in names]
    dmgf = [dmg_factor(st, "bruiser") for st in styles] if variant == "slice" else [1.0] * 4
    fzf = [fz_factor(st, "bruiser") for st in styles] if variant == "slice" else [1.0] * 4
    typemod = [type_mult(st, "bruiser") for st in styles] if variant == "slice" else [1.0] * 4
    pp = [per_paw(KITS[n][1]) for n in names]
    paw_mv = [p[0] for p in pp]; paw_fz = [p[1] for p in pp]
    yowlers = [i for i, st in enumerate(styles) if st == "yowler"]
    hpmax = [BAR * (STYLE_W[st][0] if variant == "slice" else 1.0) * NERVE_BONUS.get(n, 1.0)
             for n, st in zip(names, styles)]
    hp = hpmax[:]; healed = [0.0] * 4
    g = None
    if guest:
        gst = KITS[guest][0]
        g = dict(name=guest, dmgf=dmg_factor(gst, "bruiser"), fzf=fz_factor(gst, "bruiser"),
                 hpmax=BAR * STYLE_W[gst][0] * NERVE_BONUS.get(guest, 1.0), present=False)
        g["hp"] = g["hpmax"]
    t = 0.0; paws = [0.0] * 4; standing = [0, 1, 2, 3]; ctrl = 0
    cow_until = cowed_s if cowed is not None else 0.0
    tag_clock = 0.0; ruffle_clock = 0.0; swing_clock = 0.0; soggy_until = -1.0
    taken = 0.0; fired_dealt = 0.0; frz = [0, 0, 0]; routs = []
    e = dict(rank="boss", nerve=20 * BAR * boss_nerve, fz=0.0, fraz=0.0, ruf=0.0, rufcd=0.0)
    boss_max = e["nerve"]; e["max"] = boss_max
    phase = 0; thresholds = [0.70, 0.35]; state = "wall"; bclock = 0.0; pending = False; carry = 0.0
    if g and guest_from == "start": g["present"] = True; g["arrive"] = 3.0
    reserve = 200.0

    fu = dict(left=fired_up_s)

    def fired(now):
        return fu["left"] > 0 and now >= soggy_until

    def is_cowed(i, now):
        return cowed is not None and names[i] == cowed and now < cow_until

    def deal(mv):
        nonlocal pending, carry
        mult = FRAZ_DMG if e["fraz"] > 0 else 1.0
        amt = mv * mult
        if phase < 2:
            floor_ = boss_max * thresholds[phase]
            if e["nerve"] - amt < floor_:
                if e["fraz"] > 0: carry = min(0.10 * boss_max, carry + floor_ - (e["nerve"] - amt))
                amt = e["nerve"] - floor_; pending = True
        e["nerve"] -= amt

    def add_fz(fz, flat=0.0):
        if e["fraz"] > 0: return
        e["fz"] += fz * R_RANK["boss"] * (2.0 if e["ruf"] > 0 else 1.0) + flat
        if e["fz"] >= 100: e["fz"] = 0.0; e["fraz"] = FRAZ_S; frz[phase] += 1

    def hurt(total_mv):
        nonlocal taken, ctrl, standing
        targets = [(i, 0.4 if i == ctrl else 0.2) for i in standing]
        if g and g["present"] and g["hp"] > 0: targets.append(("g", 0.2))
        wsum = sum(w for _, w in targets)
        for i, w in targets:
            amt = total_mv * w / wsum
            if i == "g":
                g["hp"] -= amt
                if g["hp"] <= 0: routs.append((round(t, 1), g["name"] + " (guest)"))
            else:
                hp[i] -= amt; taken += amt
                if hp[i] <= 0: routs.append((round(t, 1), names[i]))
        standing = [i for i in standing if hp[i] > 0]
        if standing and ctrl not in standing: ctrl = standing[0]
        # commanded Purr: any Yowler standing with a Paw heals the lowest ally under 40%
        for y in yowlers:
            if y not in standing or paws[y] < 100: continue
            low = [i for i in standing if hp[i] < PURR_BELOW * hpmax[i] and healed[i] < HEAL_CAP * hpmax[i]]
            if not low: continue
            i = min(low, key=lambda k: hp[k] / hpmax[k])
            amt = min(PURR_MV, HEAL_CAP * hpmax[i] - healed[i], hpmax[i] - hp[i])
            paws[y] -= 100; hp[i] += amt; healed[i] += amt

    def pile_value(T_rem):
        return sum((PILE_BASE + PILE_K * T_rem) * FRAZ_DMG * typemod[i] for i in standing)

    while t < 900:
        if not standing:
            return dict(time=t, outcome="loss", routs=routs, taken_pct=100 * taken / sum(hpmax),
                        frz=frz, boss_left=e["nerve"] / boss_max)
        if e["nerve"] <= 1e-6: break
        if g and not g["present"] and guest_from == "phase2" and phase >= 1:
            g["present"] = True
        if pending and e["fraz"] <= 0:
            t += 3.5; pending = False; phase += 1
            e["nerve"] = min(e["nerve"], boss_max * thresholds[phase - 1]) - carry; carry = 0.0
            for i in standing: paws[i] = min(200, paws[i] + 50)
            sub = run("group", Model(variant, "mixed"), n_toughs=2)
            t += sub["time"] - 3.0
            if incoming: hurt(WAVE_IN_MV * land / 0.5 * (FIRED_UP if phase == 1 else 1.0))  # Wall Yowl fires up phase-2 Toughs
            state = "wall"; bclock = 0.0
            continue
        focus = 0.5 if state == "wall" else 0.85
        if e["fraz"] > 0:
            T_rem = e["fraz"]
            if len(standing) >= 2 and (e["nerve"] <= pile_value(T_rem) or sum(paws[i] for i in standing) < 100 or T_rem <= 4.5):
                deal(pile_value(T_rem) / FRAZ_DMG); t += FULL_PILE_S; e["fraz"] = 0.0; e["fz"] = 0.0
                continue
            for i in standing:
                if paws[i] >= 100:
                    paws[i] -= 100; deal(paw_mv[i] * dmgf[i] * (COWED if is_cowed(i, t) else 1.0)); break
            step = 0.75
        else:
            step = DT
        out = fz = 0.0
        for i in standing:
            up = UP_CTRL if i == ctrl else UP_AI
            if is_cowed(i, t) and i != ctrl: continue        # its AI will not target the Old Boss
            k = COWED if is_cowed(i, t) else 1.0
            out += STRING_MV / CYCLE * up * dmgf[i] * focus * step * k
            fz += STRING_FZ / CYCLE * up * fzf[i] * focus * step
        if g and g["present"] and g["hp"] > 0 and t >= g.get("arrive", 0):
            out += STRING_MV / CYCLE * UP_AI * g["dmgf"] * focus * step
            fz += STRING_FZ / CYCLE * UP_AI * g["fzf"] * focus * step
        deal(out); add_fz(fz)
        if fired(t): fu["left"] -= step              # the anger timer runs only while he is not Soggy
        for i in standing:
            if i == ctrl: inc = paw_rate(UP_CTRL, 1.0)
            elif is_cowed(i, t): inc = AI_FILL * PAW_PASSIVE
            else: inc = paw_rate(UP_AI, AI_FILL)
            paws[i] = min(200, paws[i] + inc * step)
        tag_clock += step
        if tag_clock >= TAG_PERIOD and len(standing) >= 2:
            tag_clock -= TAG_PERIOD
            deal(TAG_MV * focus); add_fz(TAG_FZ * focus, flat=10.0)
            nxt = [i for i in standing if i != ctrl]
            to = nxt[0]
            if clear_by_tag and cowed is not None and t < cow_until:
                ci = names.index(cowed)
                if ci in standing: to = ci; cow_until = t        # the Tag-In clears it ("steeled")
            for i in (ctrl, to): paws[i] = min(200, paws[i] + TAG_GRANT)
        ruffle_clock += step
        if ruffle_clock >= 16.0:
            ruffle_clock = 0.0
            if e["ruf"] <= 0 and e["rufcd"] <= 0: e["ruf"] = RUFFLE_S
        if e["fraz"] <= 0:
            bclock += step
            if state == "wall" and bclock >= WALL_S:
                state = "ground"; bclock = 0.0; add_fz(0.0, flat=30.0); soggy_until = t + SOGGY_S
                if e["ruf"] <= 0 and e["rufcd"] <= 0: e["ruf"] = RUFFLE_S
            elif state == "ground" and bclock >= 6.0:
                state = "wall"; bclock = 0.0
            if incoming:
                swing_clock += step
                if swing_clock >= BOSS_SWING_S:
                    swing_clock -= BOSS_SWING_S
                    mv = BOSS_SWING_MV * BOSS_RANK_DMG * land * (FIRED_UP if fired(t) else 1.0)
                    if fired(t): fired_dealt += mv * (1 - 1 / FIRED_UP)
                    hurt(mv)
        # commanded Moves above the reserve (Purr is kept for heals)
        for i in standing:
            while paws[i] >= 100 and sum(paws[j] for j in standing) - 100 >= reserve:
                if i in yowlers and any(hp[j] < 0.55 * hpmax[j] for j in standing): break
                paws[i] -= 100
                deal(paw_mv[i] * dmgf[i] * focus * (COWED if is_cowed(i, t) else 1.0))
                add_fz(paw_fz[i] * fzf[i] * focus)
        if e["ruf"] > 0:
            e["ruf"] -= step
            if e["ruf"] <= 0: e["rufcd"] = RUFFLE_CD
        elif e["rufcd"] > 0: e["rufcd"] -= step
        if e["fraz"] > 0:
            e["fraz"] -= step
            if e["fraz"] <= 0: e["fz"] = 0.0
        t += step
    return dict(time=t + 3.0, outcome="win" if e["nerve"] <= 1e-6 else "timeout", routs=routs,
                taken_pct=100 * taken / sum(hpmax), frz=frz, boss_left=max(0.0, e["nerve"]) / boss_max,
                fired_extra=fired_dealt)

def fmt(r):
    rs = ", ".join(f"{n} @{tt:.0f}s" for tt, n in r["routs"]) or "none"
    tail = f"{100 * (1 - r['boss_left']):.0f}% of his Nerve gone" if r["outcome"] == "loss" else f"Frz {r['frz']}"
    return f"{r['time']:6.1f} s  {r['outcome']:7s} Posse Nerve lost {r['taken_pct']:5.1f}%  Routed: {rs}  ({tail})"

TIERS = (("Calm (no Fired Up)", 0.0), ("Riled: 20 s", 20.0), ("Seething: 40 s", 40.0), ("Furious: whole fight", 1e9))
LANDS = (("good dodging, 35% lands", 0.35), ("median, 50% lands", 0.50), ("poor dodging, 65% lands", 0.65))

def wipe_threshold(fu, **kw):
    lo, hi = 0.3, 1.5
    for _ in range(30):
        mid = (lo + hi) / 2
        if run_boss(fired_up_s=fu, land=mid, **kw)["outcome"] == "loss": hi = mid
        else: lo = mid
    return hi

def owner_feedback():
    print("\n\n######## OWNER-FEEDBACK PASS (2026-11-24): Daifuku with incoming damage, anger, nerves, join-in ########")
    print("\n== A. Check: incoming model off reproduces the round-2 Daifuku figure (slice, wall 8 s) ==")
    r = run_boss(incoming=False)
    print(f"  {r['time']:.1f} s (round-2 before: 175.6 s; the new model adds 3 s of opening overhead the same way)")
    print("\n== B. Fired Up tier x dodge quality (rival Posse: Mikan, Hige, Pon, Togemaru; same level; Alley) ==")
    for lab, land in LANDS:
        print(f"  -- {lab}")
        for tl, fu in TIERS:
            print(f"     {tl:22s} {fmt(run_boss(fired_up_s=fu, land=land))}")
    print("\n== C. Rematch at -10% max Nerve (plastered), anger spent -> Calm ==")
    for lab, land in LANDS:
        print(f"  {lab:24s} {fmt(run_boss(boss_nerve=1.3 * 0.9, land=land))}")
    print("\n== D. Old Gang Nerves: Kagi (Schemer, susceptible) Cowed at the Standoff; Posse Mikan, Hige, Togemaru, Kagi ==")
    base = run_boss(posse=("Mikan", "Hige", "Kagi", "Thorn"))
    print(f"  no nerves (Kagi Sworn / resisting)   {fmt(base)}")
    for lab, kw in (("Cowed 20 s, cleared by the first Tag-In (t=10 s)", dict(cowed="Kagi", clear_by_tag=True)),
                    ("Cowed 20 s, no answer", dict(cowed="Kagi")),
                    ("Cowed 30 s (Fraidy value), no answer", dict(cowed="Kagi", cowed_s=30.0))):
        r = run_boss(posse=("Mikan", "Hige", "Kagi", "Thorn"), **kw)
        print(f"  {lab:38s} {fmt(r)}   cost {r['time'] - base['time']:+.1f} s")
    for tl, fu in TIERS[1:]:
        b2 = run_boss(posse=("Mikan", "Hige", "Kagi", "Thorn"), fired_up_s=fu)
        r = run_boss(posse=("Mikan", "Hige", "Kagi", "Thorn"), fired_up_s=fu, cowed="Kagi")
        print(f"  {tl:22s} no nerves {b2['time']:6.1f} s | Kagi Cowed 20 s, no answer {r['time']:6.1f} s ({r['outcome']}) cost {r['time'] - b2['time']:+.1f} s")
    print("\n== E. Nose-Touch join-in ally: Togemaru (truce) as an AI guest; family Posse Mikan, Hige, Pon, Kinako ==")
    for tl, fu in TIERS:
        b = run_boss(posse=("Mikan", "Hige", "Pon", "Kinako"), fired_up_s=fu)
        a1 = run_boss(posse=("Mikan", "Hige", "Pon", "Kinako"), fired_up_s=fu, guest="Thorn", guest_from="start")
        a2 = run_boss(posse=("Mikan", "Hige", "Pon", "Kinako"), fired_up_s=fu, guest="Thorn", guest_from="phase2")
        print(f"  {tl:22s} no ally {b['time']:6.1f} s ({b['outcome']}, lost {b['taken_pct']:4.1f}%) | ally from the start "
              f"{a1['time']:6.1f} s ({a1['outcome']}, lost {a1['taken_pct']:4.1f}%) | ally with the phase-2 wave "
              f"{a2['time']:6.1f} s ({a2['outcome']}, lost {a2['taken_pct']:4.1f}%)")
    print("  (a join-in needs an opponent tagged the truce cat's Rival: in the slice Daifuku has none, so the")
    print("   reachable case is the phase-2 wave holding Goma, a seeded pick never chosen by who is in truce)")
    print("\n== F. Where Fired Up bites: the landed share at which the expected-value Posse wipes ==")
    print("   (Fired Up never changes the Posse's output, so a win takes the same time; it moves the wipe line)")
    for tl, fu in TIERS:
        th = wipe_threshold(fu)
        r = run_boss(fired_up_s=fu, land=min(1.5, th + 0.05))
        print(f"  {tl:22s} wipes once >= {100 * th:5.1f}% of his swings land | a wipe just past it: {fmt(r)}")
    th = wipe_threshold(0.0, boss_nerve=1.3 * 0.9)
    print(f"  {'Rematch -10%, Calm':22s} wipes once >= {100 * th:5.1f}% of his swings land")
    print("\n== G. Context: anger stage reached on L2D4 by marking policy (Nemesis owns F-anger; acts per day assumed) ==")
    for lab, per_day in (("quiet: Rubs only, 2 over-marks a day", 10), ("reference path: 1 Counter-Spray + 1 over-mark", 20),
                         ("loud: 2 Counter-Sprays + 2 over-marks", 40)):
        a = 0
        days = []
        for d in range(6):                     # L1D1..L2D3 daytime, each followed by a night of -15
            a = min(100, a + per_day); days.append(a); a = max(0, a - 15)
        stage = "Calm" if a < 30 else "Riled" if a < 60 else "Seething" if a < 90 else "Furious"
        print(f"  {lab:46s} L2D4 morning anger {a:3d} -> {stage}  (peaks by day: {days})")

if __name__ == "__main__":
    sensitivity()
    main()
    owner_feedback()

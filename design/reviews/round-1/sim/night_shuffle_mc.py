"""Compact Monte Carlo of nemesis-system.md (round-1 draft) Night Shuffle step 2 + daytime ledger.

Uses the doc's own formulas: F1 level, F2 Grudge (cap 35, witnesses), F3 drift, F4 Regard,
F5 comeback, F6 duel, F7 challenge weight, F8 level growth/cap, F9 scars, F10 Nose-Touch,
F11 turncoat (with Crew F8 Loyalty tick), F13 arc score, F14 uprising, R4.4 vacancies,
R4.5 replacement, R9.3 exile destination, R12 director (lead, hunt slots, escalation),
R12.5 breaking points, R13.3 time-skips. Territory 4.6 raid auto-resolve for raids/uprisings.

Simplifications (stated in the critique): no Scent model, no damage types / Always-a-Way-In,
Captains cannot challenge (the Boss is unchallengeable, R4.6), Toughs challenge Captains only,
player fights ENC tracked Rivals per day in the frontier district.
Run: python3 night_shuffle_mc.py [runs]
"""
import random, sys, statistics as st

LIFE_DAYS = [3, 7, 8, 8, 8, 8, 9, 6, 3]           # territory doc reference player, 60 days
LV_END = [3, 8, 16, 24, 32, 40, 48, 50, 50]
BANDS = [(1, 8), (8, 16), (16, 24), (24, 32), (32, 40), (40, 48)]
TEMPS = {  # m_g, m_r, flee, A, T, nose_mod, t_L
    'Braggart': (1.2, .7, 0, 1.4, 1.0, -.2, -5), 'Brooder': (1.5, .8, 0, 1.0, 1.2, -.1, -5),
    'Schemer': (1.0, .9, .15, 1.6, 1.5, 0, -10), 'Fraidy': (.7, 1.0, .25, .5, .5, .1, 0),
    'Stalwart': (.8, 1.5, 0, .8, .25, .3, 10), 'Goofball': (.6, 1.2, .1, .7, .6, .15, 5)}
TW = [22, 16, 16, 14, 16, 16]
POLICIES = {  # verdict weights chase, humble, recruit, nose ; p_win ; crew attentive
    'chase': ((1, 0, 0, 0), .95, True), 'humble': ((0, 1, 0, 0), .95, True),
    'recruit_neglect': ((0, 0, 1, 0), .95, False), 'lose40': ((.35, .25, .2, .2), .60, True),
    'pacifist': ((0, 0, 0, 1), .95, True), 'mixed': ((.35, .25, .2, .2), .85, True)}
ENC = 3          # tracked-Rival fights per day from Life 2 (crew doc A-7 assumes ~9 encounters/day)
NAMES_D, NAMES_C = 30, 40

def PR(L, cap=False):
    return (10 + 4.9 * (L - 1) + 40 + 12.24 * (L - 1)) * (1.2 if cap else 1.08)

class Cat:
    __slots__ = ('id', 'd', 'rank', 'lv', 'temp', 'G', 'R', 'state', 'ret', 'feud', 'routs', 'piles',
                 'chased', 'nm', 'marks', 'losses', 'streak', 'esc', 'last', 'rest', 'lead', 'nem',
                 'was_nem', 'met', 'bp', 'away', 'loy', 'idle', 'wav', 'honey', 'restless', 'upfail',
                 'settled', 'born', 'lives', 'truce', 'dwin', 'fr', 'sentry', 'fed', 'first', 'nofleenext', 'hunt')
    def __init__(s, i, d, rank, lv, temp, day):
        s.id, s.d, s.rank, s.lv, s.temp = i, d, rank, lv, temp
        s.G, s.R, s.state, s.ret, s.feud = 0, 0, 'perched', 0, {}
        s.routs = s.piles = s.chased = s.nm = s.marks = s.losses = s.streak = s.esc = 0
        s.last, s.rest, s.lead, s.nem, s.was_nem, s.met, s.bp = -99, -1, False, False, False, False, False
        s.away = 0; s.loy = 50; s.idle = 0; s.wav = -1; s.honey = 0; s.restless = -1; s.upfail = 0
        s.settled = False; s.born = day; s.lives = 0; s.truce = -1; s.dwin = -9; s.fr = rank
        s.sentry = False; s.fed = False; s.first = -1; s.nofleenext = False; s.hunt = False

def run(policy, seed):
    rng = random.Random(seed)
    vw, pwin, attentive = POLICIES[policy]
    cats, nid = [], [0]
    names = {'d': [NAMES_D] * 6, 'c': [NAMES_C], 'fail': 0}
    M = {'gen': [0] * 6, 'nem_by_life': [set() for _ in range(9)], 'rank_changes': 0, 'district_nights': 0,
         'min_hostile': 99, 'over_cap': 0, 'arc_by_L2': False, 'bp_days': [], 'away_overflow': 0,
         'uprisings': [0] * 9, 'upr_success': 0, 'turncoats': 0, 'raids_req': 0, 'raids_lost': 0,
         'faded': 0, 'peak_tracked': 0, 'nem_concurrent_max': 0, 'quiet_mornings': 0, 'mornings': 0,
         'frac_nem_perched': [], 'gloats': 0, 'losses': 0, 'oldtimer_overflow': 0, 'greater_than_cap_gen': 0}
    held = [0] * 6
    life_turncoat = [0] * 9

    def name():
        return True
    def gen(d, rank, day, M_lv, life):
        b0, b1 = BANDS[d]
        f = {'tough': .25, 'captain': .65}[rank]
        lv = max(1, min(50, b0 + round(f * (b1 - b0)) + rng.choice((-1, 0, 1))))
        t = rng.choices(list(TEMPS), TW)[0]
        c = Cat(nid[0], d, rank, lv, t, day); nid[0] += 1
        c.G = 10 + rng.randint(0, 10); c.R = 10 + 5 * min(6, max(0, life - 1))
        if rng.random() < .7 and names['d'][d] > 0: names['d'][d] -= 1
        elif names['c'][0] > 0: names['c'][0] -= 1
        elif names['d'][d] > 0: names['d'][d] -= 1
        else: names['fail'] += 1
        M['gen'][d] += 1; cats.append(c); return c

    def perched(d): return [c for c in cats if c.d == d and c.state == 'perched']
    def hostile(c): return not (c.G < 25 and c.R >= 50)
    def F2(c, B, wit=0, K=1.0):
        if B > 0: c.G = max(0, min(100, c.G + min(35, round(B * TEMPS[c.temp][0] * min(1.5, 1 + .1 * wit) * K))))
        else: c.G = max(0, min(100, c.G + B))
    def F4(c, P, N): c.R = max(0, min(100, c.R + round(P * TEMPS[c.temp][1]) + N))
    def capL(c, Ml, g):
        c.lv = min(min(50, max(c.lv, Ml + 3)), max(c.lv + g, (Ml - 3) if (c.lead or (c.nem and c.hunt)) else 0))
    def arc(c, day):
        return (8 * c.losses + 5 * c.routs + 6 * c.esc + 4 * min(7, c.marks) + .4 * c.G + .2 * c.R
                + 10 * (day - c.last <= 2) - 2 * min(max(0, day - c.last), 15))
    def nemcheck(c, life):
        if not c.nem and c.G >= 75: c.nem = True; c.was_nem = True; M['nem_by_life'][life].add(c.id)
        elif c.nem and c.G < 60: c.nem = False
    def place(c, d, day, ranks=('tough',)):
        """R9.3 / R4.5 landing."""
        ps = perched(d); nT = sum(1 for x in ps if x.rank == 'tough'); nC = sum(1 for x in ps if x.rank == 'captain')
        if 'captain' in ranks and nC < 2: c.rank = 'captain'
        elif nT < 5: c.rank = 'tough'
        else:
            cand = [x for x in ps if x.rank == 'tough' and x.marks == 0 and not x.lead]
            if cand:
                v = min(cand, key=lambda x: arc(x, day)); v.state = 'faded'; M['faded'] += 1; c.rank = 'tough'
            else:
                c.rank = 'tough'  # soft cap above 5 (R4.5); replace lowest after 3 nights (approximated: now)
                v = min([x for x in ps if x.rank == 'tough'], key=lambda x: arc(x, day))
                v.state = 'faded'; M['faded'] += 1
        c.d = d; c.state = 'perched'

    day, Ml = 0, 1
    for life in range(9):
        if life >= 1:  # time-skip shuffle (R13.3), simplified
            for c in cats:
                if c.state == 'exiled': c.ret = day
                if c.state not in ('faded',): c.lives += 1
            ret_all = True
            ot = sum(1 for c in cats if c.state == 'oldtimer')
            for c in cats:
                if c.state == 'perched' and c.rank != 'boss' and not c.nem and not c.lead and c.lives >= 3:
                    if rng.random() < (.4 if c.lives >= 5 else .2):
                        if ot >= 6: M['oldtimer_overflow'] += 1
                        c.state = 'oldtimer'; ot += 1
                if c.state in ('perched', 'humbled', 'restless'):
                    k = .9 if (c.nem or c.lead) else (.25 if c.state != 'perched' else .5)
                    capL(c, LV_END[life - 1] if life else 1, round(k * (LV_END[life - 1] - (LV_END[life - 2] if life > 1 else 1))))
        unlocked = list(range(min(6, max(1, life))))
        if life == 0: unlocked = [0]
        claimed = [d for d in range(6) if life >= d + 2]
        for d in unlocked:  # generate districts on unlock (prehistory skipped)
            if M['gen'][d] == 0:
                for r in ['captain'] * 2 + ['tough'] * 5: gen(d, r, day, Ml, life)
        frontier = max([d for d in unlocked if d not in claimed], default=unlocked[-1])
        for dd in range(LIFE_DAYS[life]):
            lv0 = 1 if life == 0 else LV_END[life - 1]
            Ml = round(lv0 + (LV_END[life] - lv0) * (dd + 1) / LIFE_DAYS[life])
            for d in range(6): held[d] = 5 if d in claimed else (min(4, dd // 2 + (life > 0)) if d == frontier else 0)
            K = 1.5 if life == 7 else 1.0
            # ---------------- DAY ----------------
            n_enc = 1 if life == 0 else ENC
            pool = [c for c in perched(frontier) if hostile(c) and c.truce < day]
            hunters = [c for c in cats if c.state == 'perched' and c.hunt and c.d == frontier]
            if hunters and life > 0 and rng.random() < .51:  # F15, one hunter, full day
                pool = hunters[:1] + pool
            fought = set()
            for _ in range(n_enc):
                pool = [c for c in pool if c.id not in fought and c.state == 'perched']
                if not pool: break
                c = pool[0] if (hunters and pool[0] in hunters and not fought) else rng.choice(pool)
                fought.add(c.id); c.met = True; c.last = day
                if c.first < 0: c.first = day
                p = pwin - .04 * max(0, c.lv - Ml) + (.1 if c.streak >= 2 else 0)
                if rng.random() < TEMPS[c.temp][2] and not c.nofleenext:  # rival fled
                    F2(c, 8, K=K); c.esc += 1; c.nofleenext = True; nemcheck(c, life); continue
                c.nofleenext = False
                if rng.random() < p:  # WIN
                    pile, fear, amb, mr = rng.random() < .6, rng.random() < .4, rng.random() < .3, rng.random() < .15
                    wit = sum(rng.random() < .15 for _ in perched(frontier))
                    B = 10 + 5 * pile + 5 * fear + 3 * amb - 5 * mr
                    P = 8 * (not amb and not fear); N = -3 * fear - 3 * amb
                    c.routs += 1; c.piles += pile; c.streak = 0
                    ps = .5 + .25 * (rng.random() < .8) + .25 * pile
                    ps = 1 if (c.routs >= 2 and c.nm == 0) else ps * .5 ** max(0, c.nm - 1)
                    if rng.random() < ps: c.nm += 1; c.marks += 1
                    if c.bp:  # Grand Standoff win: arc resolved by the verdict
                        c.lead = False; c.bp = False; c.hunt = False
                    w = list(vw)
                    if held[frontier] == 0: w[1] = 0
                    nT = sum(1 for x in cats if x.state == 'crew')
                    crewcap = [6, 7, 8, 10, 13, 18, 24, 24, 24][life]
                    if nT >= crewcap - 3: w[2] = 0
                    if sum(w) == 0: w = [1, 0, 0, 0]
                    v = rng.choices(['chase', 'humble', 'recruit', 'nose'], w)[0]
                    if v == 'recruit' and min(100, c.G + 35) >= 90 and c.R < 50: v = 'chase'
                    if v == 'chase':
                        F2(c, B + 15, wit, K); F4(c, P, N); c.chased += 1
                        nAway = sum(1 for x in cats if x.state == 'exiled')
                        if nAway >= 6:
                            o = min([x for x in cats if x.state == 'exiled'], key=lambda x: x.away); o.ret = day; M['away_overflow'] += 1
                        c.state = 'exiled'; c.away = day
                        c.ret = day + max(2, min(8, 3 + (c.rank == 'captain') - c.G // 40 + rng.randint(0, 2)))
                    elif v == 'humble':
                        F2(c, B + 20, wit, K); F4(c, P, N - 5)
                        res = [x for x in cats if x.state in ('humbled', 'restless') and x.d == frontier]
                        if len(res) >= held[frontier]:
                            o = res[0]; o.state = 'exiled'; o.G = min(100, o.G + 10); o.ret = day + 2; o.away = day
                        c.state = 'humbled'; c.fr = c.rank; c.sentry = rng.random() < .5
                    elif v == 'recruit':
                        F2(c, B, wit, K); c.G = round(c.G / 2); F4(c, P + 10, N)
                        c.state = 'crew'; c.fr = c.rank; c.honey = day + 3; c.lead = False
                        c.loy = max(5, min(80, round(50 - .4 * c.G + .3 * c.R + TEMPS[c.temp][6])))
                    else:
                        pa = max(.05, min(.95, .35 + .006 * c.R - .003 * c.G + TEMPS[c.temp][5] + .15 * (P > 0)))
                        if rng.random() < pa: c.G = 0; F4(c, P + 25, N); c.truce = day + 5; c.lead = False
                        else: F2(c, B, wit, K); c.G = round(c.G / 2); F4(c, P + 5, N)
                    nemcheck(c, life)
                    if c.state == 'perched' and c.nem and c.routs >= 3 and not c.bp:
                        c.bp = True
                    if c.chased >= 3 and not c.bp: c.bp = True
                    if c.bp and c.state != 'perched' and v != 'chase': c.bp = False
                    if c.bp and c.first >= 0: M['bp_days'].append(day - c.first)
                else:  # LOSS
                    M['losses'] += 1; c.losses += 1; c.streak += 1; c.marks += 1
                    F2(c, 5, K=K); F4(c, 10 if c.temp == 'Stalwart' else 0, 0 if c.temp == 'Stalwart' else -10)
                    if c.rank == 'tough':
                        caps = [x for x in perched(c.d) if x.rank == 'captain']
                        if len(caps) >= 2:
                            lo = min(caps, key=lambda x: x.lv); lo.rank = 'tough'; lo.feud[c.id] = 30
                        c.rank = 'captain'; M['rank_changes'] += 1
                    capL(c, Ml, 0 if c.streak >= 2 else 2)
                    if c.bp: c.bp = False; c.lead = False; c.G = 50; c.hunt = False
                    nemcheck(c, life); break  # day ends
            # ---------------- NIGHT (step 1 raids then step 2) ----------------
            day += 1; M['mornings'] += 1; news = 0
            sim = unlocked
            # 2b drift
            for c in cats:
                if c.d not in sim: continue
                if c.state == 'perched':
                    if day - c.last >= 3 and c.G < 75 and c.temp != 'Brooder' and not c.lead and life != 7: c.G = max(0, c.G - 2)
                elif c.state == 'exiled':
                    if day - c.away <= 5: c.G = min(100, c.G + 2)
                elif c.state in ('humbled', 'restless') and not c.settled:
                    f = rng.random() < (.3 if policy != 'humble' else .1)
                    c.G = min(100, c.G + max(0, min(3, 1 + (not c.sentry) + (c.temp in ('Brooder', 'Braggart')) - 2 * f)) * (2 if life == 7 else 1))
                nemcheck(c, life)
            # 2c returns
            for c in cats:
                if c.state == 'exiled' and c.ret <= day:
                    capL(c, Ml, 1 + c.G // 50 + (c.fr == 'captain')); news += 1
                    tgt = frontier if (c.lead or (c.G >= 50 and rng.random() < .4)) else c.d
                    place(c, tgt, day, ('captain', 'tough') if c.fr == 'captain' else ('tough',))
                    c.hunt = c.G >= 50 and c.R < 50
            # 2d duels
            for d in sim:
                M['district_nights'] += 1
                ps = perched(d)
                M['min_hostile'] = min(M['min_hostile'], sum(1 for c in ps if hostile(c)))
                if rng.random() < .35:
                    caps = [c for c in ps if c.rank == 'captain']
                    ch = [c for c in ps if c.rank == 'tough' and c.rest < day and c.last != day - 1]
                    if caps and ch:
                        def tgt(c): return max(caps, key=lambda t: (c.feud.get(t.id, 0), -t.lv))
                        w = [TEMPS[c.temp][3] * max(.25, min(2, 1 + .15 * (c.lv - tgt(c).lv))) * (1.5 if c.feud.get(tgt(c).id, 0) >= 40 else 1) for c in ch]
                        a = rng.choices(ch, w)[0]; b = tgt(a)
                        ea, eb = PR(a.lv), PR(b.lv, True) * 1.1
                        if rng.random() < ea ** 3 / (ea ** 3 + eb ** 3):
                            a.rank, b.rank = 'captain', 'tough'; M['rank_changes'] += 1; win, lose = a, b
                            b.feud[a.id] = b.feud.get(a.id, 0) + 20
                            if a.met or b.met: news += 1
                        else:
                            win, lose = b, a; a.feud[b.id] = a.feud.get(b.id, 0) + 10
                        lose.rest = day + 3
                        if day - win.dwin >= 3: capL(win, Ml, 1); win.dwin = day
                # 2e vacancies (fresh generations; delay ignored except floor)
                ps = perched(d)
                cap_h = 3 if d in claimed else 7
                nC = sum(1 for c in ps if c.rank == 'captain')
                if nC < 2 and d not in claimed:
                    ts = [c for c in ps if c.rank == 'tough']
                    if ts:
                        mt = st.mean(c.lv for c in ts)
                        max(ts, key=lambda c: TEMPS[c.temp][3] * max(.25, min(2, 1 + .15 * (c.lv - mt)))).rank = 'captain'
                        M['rank_changes'] += 1
                ps = perched(d)
                if d in claimed:
                    if sum(1 for c in ps if hostile(c)) < cap_h and day % 3 == 0: gen(d, 'tough', day, Ml, life)
                else:
                    nT = sum(1 for c in ps if c.rank == 'tough')
                    floor = sum(1 for c in ps if hostile(c)) < 3
                    for _ in range(5 - nT):
                        if floor or rng.random() < .5: gen(d, 'tough', day, Ml, life)
            # 2f crew (Crew F8 tick + Lure + Wavering + F11)
            crew = [c for c in cats if c.state == 'crew']
            for c in crew:
                if attentive:
                    g = (2 + 1) * (rng.random() < min(1, 3 / max(3, len(crew)))) + 3 * (rng.random() < .3)
                    c.idle = 0
                else:
                    g = 0; c.idle += 1
                l = (1 * {'tough': 1, 'captain': 2}.get(c.fr, 1)) if c.idle > 2 else 0
                if life == 7 and dd < 4: l += 2
                c.loy = max(0, min(100, c.loy + g - l))
                if c.loy < 30 and c.wav < 0: c.wav = day
                if c.loy >= 30: c.wav = -1
                if (c.wav >= 0 and day - c.wav >= 2 and day > c.honey and life in range(1, 7)
                        and life_turncoat[life] < 1 and (M['turncoats'] > 0 or len(crew) >= 4)):
                    T = TEMPS[c.temp][4]
                    pt = min(.5, .3 * ((30 - c.loy) / 30) ** 1.5 * T * 1.0 * (1 + c.G / 100))
                    if rng.random() < pt:
                        M['turncoats'] += 1; life_turncoat[life] += 1; c.G = max(c.G, 60); news += 1
                        place(c, c.d if c.d not in claimed else frontier, day)
            # 2g undermark
            for c in cats:
                if c.state in ('humbled', 'restless') and not c.settled:
                    if c.G >= 70 and c.restless < 0: c.restless = day; c.state = 'restless'; news += 1
                    elif c.G < 60: c.restless = -1; c.state = 'humbled'
                    elif c.restless >= 0 and day - c.restless >= 2 and day >= c.ret:
                        pr = min(.5, .1 + .01 * (max(70, c.G) - 70) + .1 * (not c.sentry) + .15 * (life == 7))
                        if rng.random() < pr:
                            M['uprisings'][life] += 1; news += 1
                            att = PR(c.lv) + 2 * PR(max(1, c.lv - 2))
                            R = (1.5 * PR(max(1, Ml - 2)) * .88 / att if c.sentry else 0) + .1
                            ph = max(.05, min(.95, R ** 3 / (R ** 3 + 1)))
                            if rng.random() < ph:  # held
                                c.G -= 20; c.upfail += 1; c.ret = day + 5; c.restless = -1; c.state = 'humbled'
                                if c.upfail >= 2: c.settled = True
                            else:
                                M['upr_success'] += 1; place(c, c.d, day, (c.fr,))
            # 2h intents, raids (Territory 4.6, resolved next step 1 -> approximated tonight)
            hunt_c = [c for c in cats if c.state == 'perched' and c.G >= 50 and c.R < 50 and c.truce < day]
            hunt_c.sort(key=lambda c: -arc(c, day))
            for c in cats: c.hunt = False
            for c in hunt_c[:3]: c.hunt = True
            town = 0
            for d in sim:
                if held[d] == 0 or town >= (4 if life == 7 else 2) or life == 0: continue
                rs = [c for c in perched(d) if c.G >= 40 and hostile(c)]
                if rs and rng.random() < (2 + max(c.G for c in rs) / 50) / (2 + max(c.G for c in rs) / 50 + 9):
                    town += 1; M['raids_req'] += 1
                    a = max(rs, key=lambda c: c.G)
                    att = 1.15 * (PR(a.lv) + PR(max(1, a.lv - 2)))
                    sent = [1, 2, 3, 5, 8, 12, 18, 18, 18][min(6, life)]
                    watched = rng.random() < min(1, sent / max(1, sum(held)))
                    R = (1.5 * PR(max(1, Ml - 2)) * .88 / att if watched else 0) + (.25 * PR(Ml) * .9 / att if d in claimed else 0) + .35 + .1
                    ph = max(.05, min(.95, R ** 3 / (R ** 3 + 1)))
                    if rng.random() > ph: M['raids_lost'] += 1; news += 1
            # 2i director: arc lead + escalation
            nonc = [c for c in cats if c.state == 'perched']
            if not any(c.lead for c in cats) and nonc:
                b = max(nonc, key=lambda c: arc(c, day))
                if arc(b, day) >= 40: b.lead = True
                elif (life == 1 and dd == 3) or (life >= 2 and dd == 2):
                    b.G = max(b.G, 50)
            if life <= 1 and any(c.routs + c.losses + c.esc >= 3 and c.marks >= 1 and (c.was_nem or c.state == 'crew') for c in cats):
                M['arc_by_L2'] = True
            # metrics
            for c in cats:
                if c.state == 'perched' and c.lv > max(Ml + 3, 0) and c.lv > BANDS[c.d][1]: M['over_cap'] += 1
            tracked = sum(1 for c in cats if c.state not in ('faded',))
            M['peak_tracked'] = max(M['peak_tracked'], tracked)
            M['nem_concurrent_max'] = max(M['nem_concurrent_max'], sum(1 for c in cats if c.nem and c.state == 'perched'))
            pp = [c for c in cats if c.state == 'perched' and c.d in sim]
            M['frac_nem_perched'].append(sum(c.G >= 75 for c in pp) / max(1, len(pp)))
            if news == 0: M['quiet_mornings'] += 1
    M['names_fail'] = names['fail']; M['total_gen'] = sum(M['gen']); M['hid_gen'] = M['gen'][0]
    M['tracked_end'] = sum(1 for c in cats if c.state not in ('faded',))
    return M

if __name__ == '__main__':
    runs = int(sys.argv[1]) if len(sys.argv) > 1 else 300
    for pol in POLICIES:
        R = [run(pol, 1000 * i + 7) for i in range(runs)]
        q = lambda xs: (round(st.median(xs), 2), round(sorted(xs)[int(.95 * len(xs)) - 1], 2))
        nem_l = [len(s) for r in R for s in r['nem_by_life'][1:7]]
        print(f"\n== {pol} ({runs} runs, 60 days) ==")
        print(" nemeses reached per Life 2-7  median/p95:", q(nem_l), " max concurrent perched Nemeses:", q([r['nem_concurrent_max'] for r in R]))
        print(" late-game share of perched Rivals at Grudge>=75 (median over runs, last 20 days):",
              round(st.median(st.mean(r['frac_nem_perched'][-20:]) for r in R), 2))
        print(" NemesisArcAchieved by end of Life 2:", round(sum(r['arc_by_L2'] for r in R) / runs, 2))
        print(" rank changes / district-night:", round(st.mean(r['rank_changes'] / r['district_nights'] for r in R), 2),
              " min hostile perched (worst):", min(r['min_hostile'] for r in R))
        print(" days first meet -> breaking point median:", st.median([x for r in R for x in r['bp_days']] or [0]))
        print(" Away-list overflow returns:", q([r['away_overflow'] for r in R]), " faded cats:", q([r['faded'] for r in R]))
        print(" generations total / Hidamari:", q([r['total_gen'] for r in R]), q([r['hid_gen'] for r in R]),
              " name-table exhaustion events:", q([r['names_fail'] for r in R]))
        print(" peak tracked cats (non-faded):", q([r['peak_tracked'] for r in R]), " Old-Timer cap overflow:", q([r['oldtimer_overflow'] for r in R]))
        print(" uprisings per playthrough:", q([sum(r['uprisings']) for r in R]), " successful:", q([r['upr_success'] for r in R]))
        print(" turncoats per playthrough:", q([r['turncoats'] for r in R]), " losses:", q([r['losses'] for r in R]))
        print(" raids requested / lost per playthrough:", q([r['raids_req'] for r in R]), q([r['raids_lost'] for r in R]))
        print(" mornings with zero nemesis news:", round(st.mean(r['quiet_mornings'] / r['mornings'] for r in R), 2))

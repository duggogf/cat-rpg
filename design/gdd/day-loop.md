# Day Loop

*Owner: game-designer · Created 2026-11-23 · Status: round-2 draft, slice scope · Commissioned by DR-25 / DR-56*
*Canon: `design/creative-brief.md` v1.2 §5.2–5.3, §6; `design/reviews/round-1/director-rulings.md` DR-01, DR-03, DR-13, DR-15–DR-22. Where this doc and canon disagree, canon wins. Phase lengths and Life rules belong to the brief. This doc implements them.*

## 1. Overview

The day loop is the one system that owns **the day as a whole**. It runs the roaming clock (4 phases × 4 real minutes). It budgets every system's demands against a ≈ 20–25 minute real day. It moves Mikan between home and the street, and it guarantees the trip home. It audits the game's once-a-day actions and holds them at three. It runs the overnight hand-offs in canon order, decides what a lost fight does to the day, and sequences the slice's first hour. The doc exists because round 1 had no owner for the day (PP-13, PP-17, PP-30): four systems each added daily chores, and the day ran 30–55 minutes. Every other GDD must fit inside the budgets set here.

## 2. Player Fantasy

*Boss outside, pet at home* (Pillar 2, **Two Lives, One Clock**). The day should feel like a cat's day, not a shift. You wake, check the pile on the step, nod to your crew and go out. Then the light turns gold, a chime rolls up the hill, a voice sings three notes, and you **want** to go home. When you choose to stay out, the night belongs to you.

- **MDA aesthetics:** Submission (a reliable, comfortable rhythm), Challenge (fitting a goal into the clock), Narrative (the clock is also Haru's day).
- **SDT:** *Autonomy* comes from the curfew trade (home by Dusk or out all Night), and neither choice is punished. *Competence* comes from finishing a Patch take before the Dusk Call. *Relatedness* comes from home twice a day and the Crew at the Lot.
- **What it must never feel like:** a checklist (anti-pillar: at most 3 once-a-day actions), a commute (the way home is ≤ 60 s), or a timer (no time fail state).

## 3. Detailed Rules

### 3.1 Clock and phases (DR-15)

- **Phases:** Morning `[0, 240)` s · Day `[240, 480)` · Dusk `[480, 720)` · Night `[720, 960)`. These are clock seconds, not real seconds.
- **Open clock** `C_open` = 720 before the cat flap and 960 after it. The cat flap arrives with K2.3 on Life 2 day 2 as a morning beat, so Night is open from that day's Dusk.
- **The clock runs only while roaming.** It pauses:
  - in combat, Standoffs and Verdicts;
  - in menus (pause, Fence Line, Slow Blink);
  - at the Lot;
  - anywhere inside Haru's wall, garden and Doorstep included;
  - during authored street beats such as the old wall cat's lines. *This last pause is a day-loop addition.*
- **The clock starts each day** the first time Mikan crosses the wall line outward.
- **Phase dial:** always shown while roaming and hidden in combat and at home (DR-24). `PhaseChanged` fires at each boundary, and an autosave follows it.
- **Sunspot nap:** costs ≈ 15 real seconds and advances the clock by `min(120, C_open − clock)`. It may cross a phase boundary, in which case `PhaseChanged` fires. It fully heals the Posse. It is the only daytime heal.
- **Dusk Call:** at clock 480 the Yunagi chime sounds, the Call answers within one bar (DR-53), and the **Head Home thread** appears automatically.
- **Drowsy:** when the clock reaches `C_open`, Mikan becomes drowsy. This happens at the end of Dusk before the flap and at the end of Night after it. The clock holds at `C_open`, and a **60 s real-time grace** starts. When the grace ends, the thread walks Mikan home on autopilot (§3.3). A fight in progress always finishes first, and drowsiness starts at `EncounterEnded`.
- **No time fail state:** nothing is lost because the clock ran out.

### 3.2 Day structure and real-minute budget (DR-16)

A day runs **Wake → (morning slot) → Doorstep → Lot → street (Morning, Day, Dusk, [Night]) → home → evening → sleep → Night Shuffle**.

| Segment | Budget (75th pct) | System | Clock |
|---|---|---|---|
| Wake → door, no Keystone / with Keystone | ≤ 0.25 / ≤ 1.5 | Narrative | paused |
| Doorstep: Tribute and Morning Sniff | ≤ 0.5 | Economy, Nemesis, UX | paused |
| The Lot: Posse, Turf Board, Lessons, Share a Morsel | ≤ 1.0 | Crew, Territory | paused |
| Roaming clock (real) | 12 pre-flap / 16, minus 2 per nap | Territory, all | runs |
| Encounters: 4–6 fights, Standoffs, Verdicts | 5–7 | Combat, Nemesis | paused |
| Way home | ≤ 1.0 | Day loop | runs or grace |
| Evening at home (or the Late coda) | ≤ 2.0 | Narrative | paused |
| **Total** | **≈ 20–25; hard cap 30** | | |

**Design weight per day (DR-16):** ≈ 50% territory and roaming, ≈ 35% combat, ≈ 15% home and story. It is measured with the activity tags in F3.

### 3.3 Home ↔ street

- **Leaving:** Mikan crosses from the garden onto the low wall top and the lane. The camera makes a gentle lower-and-tighten move at the wall (DS ruling), in reverse on the way out. The clock resumes. The Lot sits behind the house through the back fence. It is outside the wall, but it pauses the clock and is reachable without starting it.
- **Head Home thread (DR-17):** a bell-gold scent thread along the High Road to Haru's wall. **≤ 60 s of travel from any reachable point in the Lane.** It appears at the Dusk Call and whenever the player holds Head Home (D-pad Down hold / H). It stays until arrival or until it is dismissed. Releasing it costs nothing.
- **Autopilot walk** (after the drowsy grace): Mikan follows the thread at sprint speed. Encounters, Ambushes and Caterwauls are suppressed, and any input other than the camera is ignored.
- **Arrival kinds** (`HomeArrived.kind`):

| Kind | When | Result |
|---|---|---|
| `on_time` | Mikan enters the wall with clock ∈ [480, 720], or before 480 via Settle In, or at any non-routed arrival before the flap | The evening plays, Bond, and Well-Fed tomorrow (DR-20) |
| `late` | Mikan enters with clock > 720 (after the flap only) | The Late coda (the covered plate, ≤ 1 min). No Well-Fed. Keystones in their Late form, but **Closings wait** for the next morning slot (DR-21) |
| `routed` | After a wipe (§3.6) | The evening with the plaster |

- **Mid-day visit:** Mikan may enter the wall before Dusk. The clock pauses, there is no heal and no vignette, and the house is empty.
- **Settle In:** curling up on the step ends the outing and jumps the clock to 480, giving an `on_time` arrival. It is offered only once the clock has reached 240. That floor guards against day-skipping (§5).

### 3.4 Once-a-day actions: the full audit (DR-18)

**The whole game has exactly three:**

| # | Action | System | How it is surfaced |
|---|---|---|---|
| 1 | **Tribute pick-up** (automatic) | Economy | The pile on the Doorstep. Crossing it banks the pile to the Stash, and the Sniff's Tribute line reads it. No prompt. |
| 2 | **Share a Morsel** (whole Crew; Σ Crew levels; +2 Loyalty) | Crew, Territory | The shared bowl at the Lot. While it is available, Crew cats sit round it and glance at Mikan. When the Stash is short, the bowl looks empty. No reminder anywhere else. |
| 3 | **"What changed today?" find** | Narrative | A fresh Home Scent trail inside the house, open morning and evening. It fills the day's Bond "other" slot. |

**Surfacing rules:**
- There is no daily list, no quest log, no badge and no Sniff nag.
- Nothing stacks or catches up: a missed day is simply gone.
- Missing an action costs only the gain it would have given.
- **Any new once-a-day proposal must replace one of these three, by creative-director ruling.**

**Near-dailies that are not resets** (audited so they never become chores):

| Item | Why it is not a daily reset |
|---|---|
| Lessons (Mikan teaches 3 a day, others 1) | A rate cap that costs Morsels. Doing it daily earns nothing. |
| Spray | State-based: offered only below Strong |
| Rub Marks / `seen` | 3-day window and 2-day grace (DR-46); they give no Scent |
| Caches, Gift curios, the Friend Stray favour | One-time |
| Sunspots | No reward that resets; a nap costs clock |
| Morning slot, auto-Feeding | Narrative and automatic, no reward |
| Routine verbs (Eat, Rub, Lap, Meow, Knock) | **Must give no once-per-day reward** beyond the find (Narrative to confirm) |
| Well-Fed | The outcome of the curfew choice, not a task |

### 3.5 Overnight step order (DR-13, canon steps 1–5)

| Step | Owner | Resolves |
|---|---|---|
| 0 · Close the day | **Day loop** | `HomeArrived` already fired. Territory banked the field haul on arrival. The Posse is fully healed. Routine tags are written (`evenings_home` / `nights_out`). The Well-Fed flag is set for an `on_time` arrival. Emits `DayEnded`. |
| 1 · Crew | Crew | Loyalty deltas; Sentry XP |
| 2 · Territory | Territory | Scent decay; flat upkeep; raids requested **last** night (forecast in today's Sniff); uprisings |
| 3 · Nemesis | Nemesis | Betrayals; comebacks; wall events; refills and promotions; Grudge decay and Nemesis slots; tomorrow's raid requests (≤ 1 per district) |
| 4 · Economy | Economy | Tribute to the Doorstep |
| 5 · Narrative | Narrative | Next morning slot; Life-end check (DR-21) |
| 6 · Open the next day | **Day loop** | Autosave; `day_index + 1`; then the Life-end montage (or the slice title card), or the wake. |

Every draw uses `rng(save_seed, day_index, step, subsystem, cat_id, ordinal)`. Steps never reorder, and no system reads another system's output from a later step.

### 3.6 Losing a fight (DR-19)

**A loss** is a Posse wipe, meaning every Posse cat is Routed. Scram and a Rival fleeing are not losses, and the outing continues after them. After a loss:

1. The victor Gloats (≤ 3 s) and is promoted (Nemesis). A Lick In applies only to a won fight.
2. Mikan slinks home on autopilot, with the thread and encounter suppression from §3.3.
3. **If the clock is before 480, it jumps to 480.** Skipped roaming time is not refunded.
4. Arrival is `routed`. The evening plays, Haru puts on the plaster, and `mikan_plastered` is set for tomorrow.
5. **The Night is forfeit**, so there is no Well-Fed decision to make.
6. 20% of the day's field haul is lost (rounded down). Nothing is lost in Life 1. The Stash is always safe.
7. The Posse heals at step 0, and the Crew's −3 Loyalty applies at step 1.
8. A Boss that wipes the Posse is plastered at −10% max Nerve for the rematch. This stacks to −30% (DR-21).

At most one loss per day is possible, because the outing ends.

### 3.7 Encounter density (owned here; values are tuning)

- **Opportunity floor:** in every phase, ≥ 2 engageable encounters lie within 30 s of travel from anywhere in the Lane. Territory and Nemesis place them, and the day loop checks the count.
- **Unsolicited pressure:**
  - Life 1: 0 Rival Ambushes.
  - Life 2: ≤ 1 per phase and ≤ 2 per day before the flap. Night adds ≤ 1.
  - Suppressed during the drowsy grace and the autopilot walk.
- **Target:** 4–6 fights and 5–7 paused minutes per day. This is the dial that keeps the day inside its cap.

### 3.8 Save and suspend

- **Suspend-on-quit anywhere.** Quitting mid-encounter resumes at that encounter's start. Seeded encounter rolls make the replay identical.
- **Autosave** at every `PhaseChanged`, after every Verdict, at `HomeArrived`, and at step 6.

### 3.9 Onboarding: the first 15 minutes and the first hour

**The first 15 minutes (DR-22)** follow the Day 1 table in §3.10: one new verb every 60–90 s, the second cat at about 0:10, and **the two-cat Quick Pile-On at about 0:14**.

**Requirement on Combat:** both scripted tutorial fights (the crow and the two Strays) cannot wipe. If no Frazzle has happened by 0:13:30, the last Stray's Frazzle fills faster (Combat sets the value).

**The first hour:**

| Time | Beat | System introduced |
|---|---|---|
| 0:00–0:15 | K1.1 → garden → crow → the old wall cat → two-Stray fight → Pile-On | Move, Hop, Swat, Skitter, Whisker Sense, switch, Paw, Slow Blink, command, Frazzle, Pile-On |
| 0:15–0:20 | Low Wall Corner short escalation: Rub, Counter-Spray, 1 wave, the Keeper; Claim Spray | Territory: Scent, Spray; **Hiss** on the wave's yellow telegraph |
| 0:20–0:25 | First Thorn Standoff (normal flee, DR-41); tutorial nap → Dusk; Head Home; **K1.3, the first Call** | Nemesis Standoff; nap; Head Home; home |
| 0:25–0:27 | Day 2 wake; first Tribute pile; 1-item Sniff ("the Thorn waits at the gatepost"); first Lot visit | Economy, Sniff, Lot, Share a Morsel |
| ≈ 0:28 | Thorn Standoff with **a memory-citing line** (DR-03, ≤ 0:60) | Nemesis memory |
| 0:28–0:32 | Thorn fight → **first Verdict** (a Life 1 Recruit is free) | **Tag-In**, **Back Down**, Verdict |
| 0:32–0:40 | **Second story recruit** joins (Crew and Narrative name the cat) → 3-cat Posse | **Brace**; Relay |
| 0:40–0:45 | K1.4; Life-end sleep (turf held, day 2, Closing played) | — |
| 0:45–0:46 | Montage Life 1 → 2 | — |
| 0:46–0:60 | L2D1: K2.1 (cicada-shell Gift); 3-item Sniff; **Fence Line**; Friend Stray favour (one-time) → 4th cat by L2D2; **Ambush** a Laundry Pole Yard Tough | Fence Line, Ambush |

**The Life 2 ladder, one system a day:**
- L2D2: Turf Board and Sentries, props and Fears, the cat flap and the first Night, the scripted first raid as **the Caterwaul**.
- L2D3: Lessons, the first forecast raid, Zoomies (Captain).
- L2D4: the Den and Daifuku.

### 3.10 Worked days

Columns: **Real** is mm:ss since the day began; **Clock** is phase-clock mm:ss; P means paused. Categories: C combat, T territory and roaming (Lot, Doorstep and travel included), H home routine, S story vignette.

**Day 1: Life 1 day 1 (25 min; this day also carries the tutorial's 6 minutes of home and K1.1)**

| Real | Clock | Activity | System | Cat |
|---|---|---|---|---|
| 0:00–4:00 | P | K1.1 *The Box in the Rain*; Haru hums (not the Call) | Narrative | S |
| 4:00–6:00 | P | Garden: move 4:00, Hop 4:45, onto the low wall 5:30 | Home | H |
| 6:00–7:30 | P | Crow on the lane-side wall top: Swat 6:15, Skitter 7:00 | Combat | C |
| 7:30–8:00 | 0:00–0:30 | Lane; the phase dial appears | Day loop | T |
| 8:00–10:00 | P / 0:30–1:30 / P | The old wall cat: line (P), Whisker Sense trail (runs), joins (P) | Crew, Narrative | T |
| 10:00–10:30 | 1:30–2:00 | Into the lane | — | T |
| 10:30–14:30 | P | Two Strays: switch 10:45, Paw 11:30, Slow Blink 12:15, command 13:00, Frazzle + **Quick Pile-On 14:00** | Combat | C |
| 14:30–16:00 | 2:00–3:30 | Low Wall Corner: Rub 15:00, Counter-Spray 15:45 | Territory | T |
| 16:00–17:00 | P | One wave; **Hiss** at 16:30 | Combat | C |
| 17:00–17:15 | 3:30–3:45 | — | — | T |
| 17:15–18:00 | P | The Keeper: Standoff and fight | Combat | C |
| 18:00–18:30 | 3:45–4:15 | **Claim Spray**: Low Wall Corner held (Life 1 turf goal) | Territory | T |
| 18:30–20:00 | P | **First Thorn** Standoff and fight; normal flee (a Rout gives a Verdict) | Nemesis, Combat | C |
| 20:00–21:30 | 4:15–5:45 | Roam; optional Gift curio | Territory | T |
| 21:30–22:00 | 5:45→8:00 | **Tutorial nap wakes at Dusk** (exception); chime and Call | Day loop | T |
| 22:00–23:00 | 8:00–9:00 | Head Home thread → `on_time` | Day loop | T |
| 23:00–25:00 | P | **K1.3** evening: the first Call; sleep | Narrative | S |

Totals: S 6 · H 2 · C 9 · T 8. The day's only exception is the tutorial nap, because tutorial pauses leave only ≈ 6 real roaming minutes.

**Mid-slice day: Life 2 day 3 (L2D3, post-flap, out all Night; 24 min, the longest reference day)**

| Real | Clock | Activity | System | Cat |
|---|---|---|---|---|
| 0:00–0:15 | P | Wake; auto-Feeding | Narrative | H |
| 0:15–0:45 | P | Doorstep: Tribute banked; Sniff: **raid forecast on Laundry Pole Yard** plus 2 items | Economy, Nemesis | T |
| 0:45–1:45 | P | Lot: Turf Board, post the Stalwart on the forecast Patch; first Lesson (Rank I, 40); Share a Morsel | Territory, Crew | T |
| 1:45–4:15 | 0:00–2:30 | Whisker Sense; Spray a post below Strong | Territory | T |
| 4:15–5:30 | P | **Ambush** a Tough pair from the High Road | Combat | C |
| 5:30–7:30 | 2:30–4:30 | To Persimmon Alley: Rub, Counter-Spray | Territory | T |
| 7:30–10:30 | P | Wave → Captain Standoff → fight (**first Zoomies**) → Verdict | Combat, Nemesis | C |
| 10:30–11:00 | 4:30–5:00 | Claim Spray: 3 outer Patches held, **the Den opens** | Territory | T |
| 11:00–11:15 | 5:00→7:00 | Sunspot nap | Day loop | T |
| 11:15–14:15 | 7:00–10:00 | Roam. **Dusk Call at 12:15**; the player stays out | Territory | T |
| 14:15–15:30 | P | Crow and Stray fight | Combat | C |
| 15:30–17:30 | 10:00–12:00 | Roam; **Night** begins (moon-blue) | Territory | T |
| 17:30–18:45 | P | Night-only Roamer Standoff and fight; a Shiny | Nemesis, Combat | C |
| 18:45–22:45 | 12:00–16:00 | Night roam; Fence Line check; drowsy at 16:00 | Territory | T |
| 22:45–23:15 | grace | Takes the thread (≤ 60 s) → `late` | Day loop | T |
| 23:15–24:00 | P | Late coda: the covered plate; sleep. Tonight Step 2 resolves the raid against the Stalwart | Narrative | H |

Totals: C 8 (6.75 paused + ≈ 1.25 stalking and approach) · T 15 · H 1. Five encounters. This day is the budget's worst realistic case and fits the 25-minute median with 1 minute to spare. A home-by-Dusk version of the same day is ≈ 20 min.

**Last slice day: Life 2 day 5 (L2D5, the Daifuku rematch; 18 min)**

| Real | Clock | Activity | System | Cat |
|---|---|---|---|---|
| 0:00–0:15 | P | Wake; Mikan wears the plaster (yesterday's wipe) | Narrative | H |
| 0:15–0:45 | P | Sniff: Daifuku plastered (−10%); a wall event | Nemesis | T |
| 0:45–1:45 | P | Lot: Yowler into the Posse; Share a Morsel | Crew | T |
| 1:45–3:15 | 0:00–1:30 | High Road to the Den | Territory | T |
| 3:15–6:45 | P | Daifuku Standoff, 3 phases, knock-off into the bucket, Full Pile-On, Verdict | Combat, Nemesis | C |
| 6:45–7:15 | 1:30–2:00 | Den Spray → `DistrictClaimed` | Territory | T |
| 7:15–7:30 | 2:00→4:00 | Nap | Day loop | T |
| 7:30–14:00 | 4:00–8:00 | Victory lap: 2 fights (2.5 P), approaches (1), roam | Combat, Territory | C/T |
| 14:00–14:45 | 8:00–8:45 | Dusk Call → thread → `on_time` | Day loop | T |
| 14:45–15:30 | P | Evening routine; home find | Home | H |
| 15:30–18:00 | P | **K2.5 The Envelope** (Closing); sleep → title card | Narrative | S |

Totals: C 7 · T 8 · H 1 · S 2.

### 3.11 Slice pacing graph (reference path: 7 days, 150 min)

| Day | Real | C | T | H | S | Beats |
|---|---|---|---|---|---|---|
| L1D1 | 25 | 9 | 8 | 2 | 6 | K1.1, Pile-On 0:14, Patch 1, K1.3 |
| L1D2 | 20 | 7 | 10 | 1.5 | 1.5 | Memory line, first Verdict, recruit 2, K1.4 |
| L2D1 | 21 | 7 | 10.5 | 1 | 2.5 | Montage, K2.1, Fence Line, Ambush, Patch 2 |
| L2D2 | 22 | 7.75 | 12 | 1 | 1.25 | K2.3 flap, Sentries, Fears, first Night, Caterwaul |
| L2D3 | 24 | 8 | 15 | 1 | 0 | Lessons, Captain, Zoomies, Patch 3, Den opens |
| L2D4 | 20 | 8.5 | 9 | 1 | 1.5 | Daifuku attempt lost in Day → Dusk, plaster, K2.2+K2.4 |
| L2D5 | 18 | 7 | 8 | 1 | 2 | Daifuku claimed, K2.5, title card |
| **Total** | **150** | **54.25 (36%)** | **72.5 (48%)** | **8.5 (6%)** | **14.75 (10%)** | |

```
cumulative minute 0         30        60        90        120       150
story beats       K1.1 K1.3 |K1.4 M K2.1 K2.3      Lamp      K2.5
combat   C  |##########|########|#######|########|########|#########|#######|
territory T |########|##########|##########|############|###############|#########|########|
           L1D1      L1D2      L2D1      L2D2        L2D3          L2D4      L2D5
```

Combat and territory alternate inside every day, because each Patch take is roam → escalate → fight → Spray → post. Neither one runs for more than ≈ 4 real minutes without the other, apart from the Daifuku fight. The **fast path** (Daifuku won on L2D4) is 6 days and ≈ 2 h 10. Each extra Boss wipe adds ≈ 20 min.

## 4. Formulas

**F1. Clock.** `clock(t+dt) = min(C_open, clock(t) + dt · running)`, where `running = 1` only while roaming (§3.1) and 0 otherwise. `phase = floor(clock / L_phase)`, with `L_phase = 240`.

**F2. Nap.** `clock ← clock + min(N_nap, C_open − clock)`, with `N_nap = 120`.
*Example:* a nap at clock 650 before the flap → 720, so Mikan is drowsy at once.

**F3. Real day length.**
`T_day = T_wake + T_door + T_lot + (C_open − N_nap·n_nap − C_skip)/60 + T_enc + T_home + T_eve`, in minutes.
`C_skip` is clock skipped by a loss jump or by Settle In.
*Example (L2D3):* 0.25 + 0.5 + 1 + (960 − 120)/60 + 6.75 + 0.5 + 0.75 = **23.75** (the table rounds the nap and walk to 24).

**F4. Activity shares.** `share_X = Σ tagged seconds_X / T_day`. Each second carries exactly one tag:
- **C:** paused encounter time, plus roaming while the player is locked onto or stalking a hostile within 15 m, or answering a Caterwaul.
- **S:** vignette time.
- **H:** other time inside the wall.
- **T:** everything else.

Targets: T 0.50 ± 0.05, C 0.35 ± 0.05, H + S 0.15 ± 0.05.

**F5. Loss.** `haul_lost = floor(f_loss · field_haul)`, with `f_loss = 0.2` (0 in Life 1). If `clock < 480`, `clock ← 480`.

**F6. Slice length.** `T_slice = Σ T_day(d)`. Target 120–150 min.
*Reference:* 7 days × 21.4 avg = 150. *Fast path:* 6 days ≈ 131.

## 5. Edge Cases

- **Nap with < 120 s left:** the clock goes to `C_open`, Mikan is drowsy, and the grace starts.
- **Fight running when the clock would end:** impossible, because the clock is paused in combat. Drowsiness starts at `EncounterEnded`.
- **Caterwaul during the grace or the autopilot walk:** suppressed. Territory resolves it as unattended.
- **Wipe during the grace:** impossible, because encounters are suppressed. **Wipe during Night:** `routed` arrival, no clock jump, the plaster shows, and the Night's Shinies already earned are kept (field haul −20%).
- **Wipe on Life 1 day 1 after the tutorial** (for example against the Thorn): jump to Dusk, K1.3 plays as normal, nothing is lost. If Low Wall Corner is not yet held, the turf goal carries to day 2. *Mio is never sent to bed before the first Call (PP-06).*
- **Day-skipping** (Settle In as soon as it is offered, to farm Tribute): the 240-clock-second floor, `seen` decay and Territory's DR-57 no-idle sim cover it. Day-skipping still cannot pass the turf goal.
- **Closing pending on a Late arrival** (for example staying out on the final day): K2.5 waits for the next morning slot. After a morning Closing, **Settle In is offered at once**, without the 240 floor, so the Life-end sleep costs ≤ 3 min.
- **Stalling in menus or at the Lot:** the clock is paused, so stalling gains nothing.
- **Head Home from a High Road dead end:** the thread is pathed on the traversal graph. A build check fails if any reachable node is more than 60 s away (AC-F4).
- **Quit mid-Slow Blink or mid-Verdict:** resumes at the encounter's start; seeded rolls make it identical.
- **Mid-day home visit used as a heal:** no heal is granted, so Sunspots keep their cost.
- **Encounter count overshoot** (an aggressive player taking 9 fights): there is no cap on player-started fights. Pressure is capped only on unsolicited encounters, so long days are the player's choice.

## 6. Dependencies

| System | Day loop provides | Day loop requires |
|---|---|---|
| **Combat** | Clock pause on `EncounterStarted` / `EncounterEnded`; the loss handling in §3.6 | `EncounterEnded.outcome`; tutorial fights cannot wipe; the Frazzle fail-safe by 0:13:30 |
| **Nemesis** | `PhaseChanged` and `DayEnded`; Ambush budget per phase; Step 3 slot | Sniff items; Standoff placement (Thorn on L1D1 and the L1D2 gatepost); memory line by 0:60 |
| **Territory & Economy** | Step 2 and 4 slots; `HomeArrived` (bank the haul); Caterwaul reach = current district, suppressed while drowsy | Encounter placement for the §3.7 floor; Tribute at the Doorstep; no idle exploit under Settle In |
| **Crew** | Step 1 slot; Lot time ≤ 1 min | Share a Morsel is the only daily Crew action; the second recruit by L1D2 |
| **Narrative** | `HomeArrived(kind)`; step 0 tags; Late and Closing handling | `day_gate`s consistent with §3.10 (K2.3 an L2D2 morning beat; K2.5 day 4+); Routine verbs give no daily reward; vignette lengths within budget |
| **UX** | The phase dial; the thread; Settle In | The beat sheet mirrors §3.9; no daily-list UI |
| **Audio** | `PhaseChanged`; the Dusk Call at clock 480 | The chime → Call within one bar |
| **Camera** | The wall transition | The lower-and-tighten move |

**Assumptions for creative-director review:**
1. The DR-22 crow is fought on the lane-side wall top, outside the wall, which keeps the garden combat-free.
2. Authored street beats pause the clock.
3. The tutorial nap wakes at Dusk.
4. Settle In exists.
5. Pre-flap arrivals are always `on_time`.

## 7. Tuning Knobs

All values live in `assets/data/day/day_loop.*`.

| Knob | Default | Range | Category | Rationale |
|---|---|---|---|---|
| `phase_len_s` | 240 | — | Gate | Canon (brief); listed so it is not hard-coded |
| `nap_advance_s` | 120 | — | Gate | Canon: half a phase |
| `drowsy_grace_s` | 60 | 30–90 | Feel | Canon 60; finish the moment, never a timer |
| `head_home_max_s` | 60 | ≤ 60 | Gate | DR-17 hard limit |
| `autopilot_speed` | sprint | walk–sprint | Feel | Arrival ≤ 60 s |
| `settle_in_min_clock_s` | 240 | 0–480 | Gate | Day-skip floor |
| `tutorial_nap_to_dusk` | true | bool | Gate | Day 1 fit |
| `encounter_opps_per_phase` | 2 | 1–3 | Gate | Holds 4–6 fights a day |
| `ambush_budget` (L1 / L2 phase / L2 day / Night extra) | 0 / 1 / 2 / 1 | 0–2 | Gate | Pressure without chores |
| `loss_haul_frac` (L1 / later) | 0 / 0.2 | 0–0.3 | Curve | Canon |
| `budget_*` (§3.2 rows) | as tabled | — | Gate | Playtest targets; alarms in telemetry |
| `share_targets` | 0.50 / 0.35 / 0.15 | ± 0.05 | Gate | DR-16 |

## 8. Acceptance Criteria

**Functional (automated):**
- **AC-F1:** The clock advances only while roaming. Unit tests cover every pause source in §3.1 and the wall line.
- **AC-F2:** A nap obeys F2, including at the `C_open` boundary, and fires `PhaseChanged` on crossing.
- **AC-F3:** Drowsy → 60 s grace → autopilot. Encounters are suppressed throughout, and a fight in progress delays the drowsy state.
- **AC-F4:** The Head Home path is ≤ 60 s from 100% of reachable traversal nodes in the Lane (build check).
- **AC-F5:** A wipe before 480 jumps the clock to 480, gives a `routed` arrival and loses 20% of the field haul (0 in Life 1). The Stash is unchanged.
- **AC-F6:** Night Shuffle steps run 0 → 6 in order with the seeded substreams. Two runs from the same save are identical.
- **AC-F7:** A daily-reset audit script finds exactly 3 once-a-day rewards in the data.
- **AC-F8:** Suspend and resume mid-encounter reproduces the encounter.

**Playtest (slice, unbriefed, n ≥ 12):**
- **AC-P1:** Median day ≤ 25 min (DR-03). Each §3.2 row is within budget at the 75th percentile. No day exceeds 30.
- **AC-P2:** The slice takes 120–150 min at the median.
- **AC-P3:** A two-cat Pile-On by 0:15 for ≥ 90% of testers, and a memory-citing line by 0:60 for 100%.
- **AC-P4:** F4 shares within ± 5 points of 50 / 35 / 15.
- **AC-P5:** Curfew trade: on post-flap days, 30–70% of days end `late`. Neither choice dominates.
- **AC-P6 (experiential):** ≤ 20% of testers describe the street as "chores" or "a checklist". ≥ 70% say they went home at Dusk "because I wanted to", not because of the clock.

## Backlog (post-slice)

- DR-16: the full-game day (≤ 35 min) and its budget with 3 districts, 12 Crew and more Sentries (PP-17).
- DR-17: Roof Run fast travel and multi-district Head Home, still ≤ 60 s (PP-30).
- Caterwaul reach beyond the current district (DR-17 keeps it current-district only).
- Life 8 day rules: Sleep only from Dusk, the wait days, Ambush budget 0, no Doorstep deliveries (DR-27, Narrative §9).
- Life 9 day: AI fill 70%; one walk with a farewell per district.
- Encounter density and Ambush budgets for Lives 3–7, including the night-heavy Arcade shrine end (PP-18 context).
- Telemetry dashboard for F4 shares and budget alarms.
- Handheld suspend and resume under platform rules (E-5).
- A mid-day home visit with a small reason to exist (a Texture slot), if playtests show the empty house reads as dead.

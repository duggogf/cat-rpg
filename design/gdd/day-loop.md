# Day Loop

*Owner: game-designer · Created 2026-11-23 · Iteration 3 (final fix pass) 2026-11-24 · Owner feedback pass 2026-11-24 · Status: slice spec · Commissioned by DR-25 / DR-56*
*Canon: the owner's comments C1–C5 (`design/reviews/user-comments-2026-11-24.md`) → `design/reviews/owner-feedback-rulings.md` OR-01…OR-21 (binding) → `design/creative-brief.md` v1.5 §5.2–5.3, §6 → `design/reviews/round-1/director-rulings.md` DR-01, DR-03, DR-13, DR-15–DR-22. Patent guardrails: `design/legal/nemesis-patent-analysis.md` v2 §5. Where this doc and canon disagree, canon wins. Phase lengths and Life rules belong to the brief. This doc implements them. **Day Loop owns the loss time-skip and the closed street (OR-20).***

## 1. Overview

The day loop is the one system that owns **the day as a whole**. It runs the roaming clock (4 phases × 4 real minutes). It budgets every system's demands against a ≈ 20–25 minute real day. It moves Mikan between home and the street, and it guarantees the trip home. It audits the game's once-a-day actions and holds them at three. It runs the overnight hand-offs in canon order, decides what a lost fight does to the day (since the owner's C2: **a loss ends the day**, the clock jumps to Night and the only thing left to do is walk home to Haru), and sequences the slice's first hour. The doc exists because round 1 had no owner for the day (PP-13, PP-17, PP-30): four systems each added daily chores, and the day ran 30–55 minutes. Every other GDD must fit inside the budgets set here.

## 2. Player Fantasy

*Boss outside, pet at home* (Pillar 2, **Two Lives, One Clock**). The day should feel like a cat's day, not a shift. You wake, check the pile on the step, nod to your crew and go out. Then the light turns gold, a chime rolls up the hill, a voice sings three notes, and you **want** to go home. When you choose to stay out, the night belongs to you.

- **MDA aesthetics:** Submission (a reliable, comfortable rhythm), Challenge (fitting a goal into the clock), Narrative (the clock is also Haru's day).
- **SDT:** *Autonomy* comes from the curfew trade (home by Dusk or out all Night), and neither choice is punished. *Competence* comes from finishing a Patch take before the Dusk Call. *Relatedness* comes from home twice a day and the Crew at the Lot.
- **What it must never feel like:** a checklist (anti-pillar: at most 3 once-a-day actions), a commute (the way home is ≤ 60 s), or a timer (no time fail state).
- **Losing is a bruise, not a game over** (the owner's C2, set against FF7 Remake's game-over): the lane goes moon-blue, the street falls quiet, and the only way left is home, where Haru is waiting with a sticking plaster. You lose the rest of the day, never the save.

## 3. Detailed Rules

### 3.1 Clock and phases (DR-15)

- **Phases:** Morning `[0, 240)` s · Day `[240, 480)` · Dusk `[480, 720)` · Night `[720, 960)`. These are clock seconds, not real seconds.
- **Open clock** `C_open` = 720 before the cat flap and 960 after it. The cat flap arrives with **K2.3, a Dusk beat on Life 2 day 2** (Narrative §3.3; Haru is at school in the morning). Mikan comes home at that Dusk, K2.3 plays, and **leaving through the flap afterwards resumes the clock into Night**. Night is open from then on.
- **The clock runs only while roaming.** It pauses:
  - in combat, Standoffs and Verdicts;
  - in menus (pause, the Rivals board, Slow Blink);
  - at the Lot;
  - anywhere inside Haru's wall, garden and Doorstep included;
  - during authored street beats such as the old wall cat's lines. *This last pause is a day-loop addition.*
- **The clock starts each day** the first time Mikan crosses the wall line outward.
- **Phase dial:** always shown while roaming and hidden in combat and at home (DR-24). `PhaseChanged` fires at each boundary, and an autosave follows it.
- **Sunspot nap:** costs ≈ 15 real seconds and advances the clock by `min(120, C_open − clock)`. It may cross a phase boundary, in which case `PhaseChanged` fires. It fully heals the Posse. It is the only daytime heal.
- **Dusk Call:** at clock 480 the Yunagi chime sounds, the Call answers within one bar (DR-53), and the **Head Home thread** appears automatically. **Late Home** (a Routine variant on Life 2 day 3 Dusk, presentation ruling R1): the chime and the bell glint sound with **no Call**; the thread still appears with the chime. Haru's late Call sounds from the house at Dusk + 2:30 on the street clock (clock 630) if Mikan is out, or ≈ 40 real seconds after the Feeding if Mikan is inside the wall (the clock is paused there). Gran lights the Veranda Lamp.
- **Drowsy:** when the clock reaches `C_open`, Mikan becomes drowsy. This happens at the end of Dusk before the flap and at the end of Night after it. The clock holds at `C_open`, and a **60 s real-time grace** starts. When the grace ends, the thread walks Mikan home on autopilot (§3.3). A fight in progress always finishes first, and drowsiness starts at `EncounterEnded`.
- **No time fail state:** nothing is lost because the clock ran out.
- **Loss jump (OR-01):** a Posse wipe sets `clock ← max(clock, 720)`, from any phase, before the cat flap too (§3.6). It is the only thing that moves the clock forward besides naps and Settle In.
- **The Boss's patrol follows the phases (OR-09):** while the Lane's Boss window is open, Daifuku stands at his Morning stop (Laundry Pole Yard's yard wall), his Day stop (Tofu Shop's back wall) and his Dusk-and-Night stop (the Den corner stone), moving on each `PhaseChanged`. The clock is paused in combat, so he never moves mid-fight.

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

**A loss day** runs the same segments up to the wipe, then **walk home (≤ 1.0, the street closed) → the Routed Evening (plaster beat ≤ 0.5, then home play to sleep, ≤ 2.0 in all)**. It is always shorter than the same day played out: the owner-feedback budget check gives L2D2 22.4 → 16.6 min typical with a wipe at clock 6:00, and L2D3 24.9 → 22.4 with a wipe in Night (`design/reviews/owner-feedback/sim/day_budget_check.out.txt`).

### 3.3 Home ↔ street

- **Leaving:** Mikan crosses from the garden onto the low wall top and the lane. The camera makes a gentle lower-and-tighten move at the wall (DS ruling), in reverse on the way out. The clock resumes. The Lot sits behind the house through the back fence. It is outside the wall, but it pauses the clock and is reachable without starting it.
- **Head Home thread (DR-17):** a bell-gold scent thread along the High Road to Haru's wall. **≤ 60 s of travel from any reachable point in the Lane.** It appears at the Dusk Call, **at once after a loss (it cannot be dismissed then)**, and whenever the player holds Head Home (D-pad Down hold / H). Otherwise it stays until arrival or until it is dismissed. Releasing it costs nothing.
- **The closed street (OR-01, after a loss):** under moonlight, nothing on the street responds. Closed: every encounter (player-started and unsolicited), Rival Ambushes, Caterwauls, Rub, every Spray, pickups (Shinies, curios, caches), Sunspots, Settle In, the Lot, challengers' and the Boss's Standoffs. Open: walking anywhere, the camera, Whisker Sense (display only), the pause menu and the Rivals board (read-only). Cats on the street keep to themselves (no Standoffs, no lines). **After 60 s real** without reaching the wall, the autopilot walks Mikan home. Before the flap the jump to 720 also reaches `C_open`, so the drowsy grace and this 60 s are one timer, never two.
- **Autopilot walk** (after the drowsy grace): Mikan follows the thread at sprint speed. Encounters, Ambushes and Caterwauls are suppressed, and any input other than the camera is ignored.
- **Arrival kinds** (`HomeArrived.kind`):

| Kind | When | Result |
|---|---|---|
| `on_time` | Mikan enters the wall with clock ∈ [480, 720], or before 480 via Settle In, or at any non-routed arrival before the flap | The evening plays, Bond, and Well-Fed tomorrow (DR-20) |
| `late` | Mikan enters with clock > 720 (after the flap only) | The Late coda (the covered plate, ≤ 1 min). No Well-Fed. Keystones in their Late form, but **Closings wait** for the next morning slot (DR-21) |
| `routed` | After a wipe (§3.6), whatever the clock | **The Routed Evening:** Haru is home and waiting (it is Night, so even on Late Home her key has turned); the plaster beat (≤ 30 s), then the normal home verbs until sleep (Lap, the piano, the daily find). A Keystone due that evening plays in its **Late form**; a Closing waits for the next morning slot (as `late`). Bond as for `late`. No Well-Fed |

- **Mid-day visit:** Mikan may enter the wall before Dusk. The clock pauses, there is no heal and no vignette. Haru is at school; Gran is home (on school days the house is quiet, not empty).
- **Settle In:** curling up on the step ends the outing and jumps the clock to 480, giving an `on_time` arrival. It is offered only once the clock has reached 240. That floor guards against day-skipping (§5). It is not offered on the closed street after a loss.

### 3.4 Once-a-day actions: the full audit (DR-18)

**The whole game has exactly three:**

| # | Action | System | How it is surfaced |
|---|---|---|---|
| 1 | **Tribute pick-up** (automatic) | Economy | The pile on the Doorstep. Crossing it banks the pile to the Stash, and the Sniff's Tribute line reads it. No prompt. **Tribute is unchanged by a loss** (OR-02). |
| 2 | **Share a Morsel** (whole Crew; Σ Crew levels; +2 Loyalty) | Crew, Territory | The shared bowl at the Lot. While it is available, Crew cats sit round it and glance at Mikan. When the Stash is short, the bowl looks empty. No reminder anywhere else. |
| 3 | **"What changed today?" find** | Narrative | A fresh Home Scent trail inside the house, open morning and evening. It fills the day's Bond "other" slot. |

**Surfacing rules:**
- There is no daily list, no quest log, no badge and no Sniff nag.
- Nothing stacks or catches up: a missed day is simply gone.
- Missing an action costs only the gain it would have given.
- **Any new once-a-day proposal must replace one of these three, by creative-director ruling.** The owner-feedback rulings add none (OR-18): influence, anger, challengers and the Boss window are state, not tasks.

**On a loss day** (OR-01): Tribute was banked that morning and is unaffected. **Share a Morsel** is at the Lot, which closes with the street: if it was not given before the wipe, the day's chance is simply gone (it costs only its gain; nothing stacks). **The "What changed today?" find** stays open in the Routed Evening. So a loss neither adds a chore nor creates a catch-up.

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

### 3.5 Overnight step order (DR-13, canon steps 1–5; amended by OR-20)

| Step | Owner | Resolves |
|---|---|---|
| 0 · Close the day | **Day loop** | `HomeArrived` already fired. Territory banked the field haul on arrival (less 20% after a loss, none in Life 1). The Posse is fully healed. Routine tags are written (`evenings_home` / `nights_out`). The Well-Fed flag is set for an `on_time` arrival. Emits `DayEnded`. |
| 1 · Crew | Crew | Loyalty deltas (−3 per Posse cat Routed in a lost fight); Sentry XP; **Wavering flags** |
| 2 · Territory | Territory | Scent decay and refresh; **challenger over-mark** (−10 on its target; a posted Goofball 0); flat upkeep; **tonight's raid or challenge**, requested **last** night and forecast in today's Sniff (a challenger takes its district's raid slot with motive `challenge`); then **recompute influence and the Boss window** (open at 100, stays open while ≥ 75, closes below 75) |
| 3 · Nemesis | Nemesis | Betrayals (live from Life 2); town events (newcomers, feud scuffles); **the challenger calendar and truce expiry**; adaptation; **Grudge and anger decay** (anger −15); the Declaration; **tomorrow's raid request** (≤ 1 per district, a challenger first) |
| 4 · Economy | Economy | Tribute to the Doorstep |
| 5 · Narrative | Narrative | Next morning slot; Life-end check (DR-21) |
| 6 · Open the next day | **Day loop** | Autosave; `day_index + 1`; then the Life-end montage (or the slice title card), or the wake. |

Every draw uses `rng(save_seed, day_index, step, subsystem, cat_id, ordinal)`. Steps never reorder, and no system reads another system's output from a later step. *(Deleted by OR-21: comebacks, promotions and refills at step 3; the uprising raid at step 2; Stewing.)*

**Influence, anger and the window across the day** (Day Loop sequences them; Territory and Nemesis own the values):
- **Influence** is a read-out of Scent (Territory), so it moves exactly when Scent moves: by day only through Mikan's marking acts (Claim, Rescue and Counter-Sprays, Over-marks), and overnight only at step 2 (decay for everyone, refresh, challenger over-mark, the raid result). A loss, a win or a Verdict never moves it.
- **The Boss window opens** the moment influence reaches 100: after a daytime Spray (Daifuku's yowl, the climb down, ≈ 15 s, clock paused as an authored street beat; he goes to the **current phase's stop**), or at step 2. **It closes only at step 2**, when influence is below 75; nothing by day can close it. A closed window means he is back at the Den the next morning. While it is open, held outer Patches cannot be Lost at step 2 (Lost becomes Scuffed).
- **Anger** rises only by day through marking acts in his district (Over-mark +5, Counter-Spray +15) and falls −15 at step 3; a win, loss or `rival_fled` with him spends it at `EncounterEnded` (Scram does not). The Sniff names it at Seething or Furious.

### 3.6 Losing a fight: the day ends (OR-01, OR-02; the owner's C2)

**A loss** is a Posse wipe, meaning every Posse cat is Routed. Scram (`player_fled`) and a Rival fleeing (`rival_fled`) are not losses, and the outing continues after them. Life 1 tutorial fights cannot be lost. Where FF7 Remake ends the game when the party falls, here **the day ends**. After a loss:

1. **The Gloat** (Combat, ≤ 3 s). Only the victor changes (OR-02, Nemesis): a `WON` Memory entry, its Glory Title if it has none, and for a Boss the −10% plaster for the rematch (stacking to −30%) and his anger spent. **No promotion, level, seat, feud or line for any other cat.**
2. **Nightfall.** At `EncounterEnded(outcome = loss)` the clock jumps to **720, the start of Night**, from any phase (F5). If the wipe happens during Night, the clock stays where it is. **Before the cat flap** (Lives 1–2 until K2.3) the jump stages a nightfall the player cannot stay out in: moon-blue light, an empty street. `PhaseChanged(Night)` fires if a boundary was crossed; an autosave follows. Skipped roaming time is not refunded.
3. **The street closes** (§3.3). Mikan comes to on the spot, ears down, and the Head Home thread is drawn at once (≤ 60 s from anywhere). The player walks Mikan home under moonlight; nothing else works. After 60 s real, the autopilot takes over.
4. **Home: the Routed Evening.** `HomeArrived(kind = routed)`. Haru is home and waiting. The evening opens with the **plaster beat** (≤ 30 s: she kneels and puts a sticking plaster on Mikan's ear; Narrative stages it). Then the normal home verbs are open until sleep: Lap, the piano, the daily find. A Keystone due that evening plays in its **Late form**; a Closing waits for the next morning slot, as for a `late` arrival. **A loss never plays a Closing sooner than walking home would.** `mikan_plastered` is set for tomorrow; only the victor may cite it.
5. **What the loss costs** (OR-02): no Dusk, so **no Well-Fed**; Bond as for a `late` evening; the Night is forfeit; **20% of the day's field haul** is lost (rounded down; none in Life 1). The Stash is always safe and **Tribute is unchanged**. **A loss changes no territory**: no Scent, influence, Patch or window moves (Mark Over and Snatch are cut).
6. **Overnight runs as normal** (§3.5): the Posse heals at step 0; −3 Loyalty per Routed Posse cat at step 1; tonight's forecast raid **auto-resolves** at step 2 with no Caterwaul, because Mikan is home; influence decays as on any night.

At most one loss per day is possible, because the street closes.

**Why losing on purpose does not pay** (OR-02; Territory §4.13 owns the economy check): a wipe is dominated by Settle In in every currency. Settle In (clock ≥ 240, `on_time`) gives the evening, Bond, Well-Fed and the full haul; a wipe gives a plaster, −20% haul, −3 Loyalty per Routed cat, no Well-Fed and a later clock. Tribute is invariant to wipes, and influence decays every night whatever happens, so a skipped day is one more night of decay. **Known residue, accepted (OR-02):** a wipe before clock 240 ends the outing sooner in *real time* than Settle In can (worst case ≈ 9–10 min for the whole day, budget check); its costs are real and the story's day gates are unchanged.

**How a loss meets the 7-day slice script** (Narrative owns the beats; `design/narrative/dual-story-progression.md` must follow OR-01, its "jump to Dusk" text is superseded):
- **Day gates never move.** A loss shortens the day it happens on; it never skips, delays or brings forward a `day_gate`.
- **L1D1** (after the tutorial): a wipe (rare; Togemaru's day-1 flee at 25% is uninterruptible) plays nightfall, the walk home and **K1.3 in its Late form, which keeps the Call**: Haru sings from the step into the moon-blue lane and the thread is the Call's thread (PP-06: the first Call is never lost). Nothing is lost in Life 1. If Low Wall Corner is not yet held, the turf goal carries to day 2.
- **L1D2:** K1.4 is the Life 1 **Closing**, so after a wipe it waits for the L1D3 morning slot; **Settle In is offered at once** after it (the existing Closing rule, §5), and the Life ends at that sleep. Cost: one ≈ 4–5 min bonus morning.
- **L2D2:** K2.3 (the flap) plays in its Late form at the Routed Evening; the flap is there from then on, but this day's Night and Caterwaul are gone (the raid auto-resolves). The first Night moves to L2D3.
- **L2D3:** a wipe by day or in Night lands in the Routed Evening with Haru home (the clock is Night, past her late Call at 630); then K2.2.
- **L2D4** is the reference loss (§3.10): K2.5, the Closing, already played that morning, so the loss costs no story beat; the Life ends at the first sleep after the claim (L2D5).
- **The Boss window survives a loss:** influence is unchanged, so if it was ≥ 75 at step 2 he is on patrol again tomorrow, Calm (anger spent) and plastered.

### 3.7 Encounter density (owned here; values are tuning)

- **Opportunity floor:** in every phase, ≥ 2 engageable encounters lie within 30 s of travel from anywhere in the Lane. Territory and Nemesis place them, and the day loop checks the count.
- **Unsolicited pressure:**
  - Life 1: 0 Rival Ambushes.
  - Life 2: ≤ 1 per phase and ≤ 2 per day before the flap. Night adds ≤ 1. These are ceilings: Nemesis §3.10 uses ≤ 1 Rival Ambush per day as the slice value inside them.
  - Suppressed during the drowsy grace, the autopilot walk and **the closed street after a loss**.
- **What counts toward the opportunity floor and the 4–6 fights (OR-09, OR-16):**
  - **A challenger** standing at its staked post by day is an engageable, optional encounter (challenger + 1 Stray); it is **not** unsolicited pressure (it never Ambushes), and it counts toward the day's 4–6.
  - **The roaming Boss** at his current patrol stop is one engageable encounter while the window is open; he never comes to Mikan. His fight is costed at ≈ 3–3.5 paused minutes (Combat F9), so a Boss day carries one or two other fights, not four.
  - **A join-in** adds no encounter: the ally arrives inside one.
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
| 0:00–0:15 | K1.1 → garden (move, hop) → crow on the **lane-side wall top**, outside the garden (presentation R4) → the old wall cat (Hige) → two-Stray fight → Pile-On | Move, Hop, Swat, Skitter, Whisker Sense, switch, Paw, Slow Blink, command, Frazzle, Pile-On |
| 0:15–0:20 | Low Wall Corner short escalation: Rub, Counter-Spray, 1 wave, the Keeper (an **untracked Stray**: no Verdict); Claim Spray (**Patch 1**) | Territory: Scent, Spray; **Hiss** on the wave's yellow telegraph |
| 0:20–0:25 | First Thorn (Togemaru) Standoff **after the claim** (normal flee, DR-41); tutorial nap → Dusk; Head Home; **K1.3, the first Call** | Nemesis Standoff; nap; Head Home; home |
| 0:25–0:27 | Day 2 wake; first Tribute pile; 1-item Sniff ("Togemaru waits at the Laundry Pole Yard gatepost"); first Lot visit | Economy, Sniff, Lot, Share a Morsel |
| ≈ 0:28 | Togemaru's Standoff on its own gatepost with **a memory-citing line** (DR-03, ≤ 0:60) | Nemesis memory |
| 0:28–0:32 | The contest for **Laundry Pole Yard**: Routing Togemaru, its Keeper → **first Verdict** (a Life 1 Recruit is free) → Claim Spray (**Patch 2**) | **Tag-In**, **Back Down**, Verdict |
| 0:32–0:40 | **Second story recruit, Pon**, joins after the crows corner her at the laundry poles (Crew §3.3) → 3-cat Posse | **Brace**; Relay |
| 0:40–0:45 | K1.4; Life-end sleep (turf held, day 2, Closing played) | — |
| 0:45–0:46 | Montage Life 1 → 2 | — |
| 0:46–0:60 | L2D1: K2.1 (cicada-shell Gift); 3-item Sniff; **the Rivals board** (unlocks today: the Lane row, uphill silhouettes, relationship tags on hover); **Kinako's scent-trail favour, the day's required first objective** (the Lot opens after it; Crew) → 4th cat; **Ambush** a Persimmon Alley Tough; take **Persimmon Alley (Patch 3)**; the influence bar now reads ≈ 75 (three outer posts Strong) | Rivals board, influence, Ambush |

**The Life 2 ladder, one headline a day** (UX owns it: `ux/key-screens.md` §7.4, as ruled in the presentation review; Combat §3.16 and Territory §3.12 agree):
- **L2D1:** Ambush (and the Rival yowl-sting counter); **the Rivals board** and **the influence bar**; 3-item Sniff. No posting yet.
- **L2D2:** the **first raid, forecast in that morning's Sniff** (DR-46: forecasts are always on), often beside the **Declaration card** (Nemesis §3.6); **Sentries and the Turf Board**, taught at the Lot as the answer to that forecast (one posting decision); **props and Fears**; Relay with a Posse of 4; K2.3 the cat flap at Dusk, the first Night, and the forecast raid offered as **the Caterwaul**.
- **L2D3:** **Lessons** (Rank I) and **Zoomies** (the hint fires the first time the gauge is full; first used on Captain Kagi at Tofu Shop Step). Late Home at Dusk; K2.2 that evening.
- **L2D4:** K2.5 in the morning (the Closing); **the first challenger** announced in that morning's Sniff (a silhouette staking a post; its fight is optional); **rescue Sprays fill the influence bar to 100 and the Boss window opens** (Daifuku's yowl, he climbs down onto his patrol); the first Daifuku attempt at his stop, with his anger read as Fired Up; on the reference path **the attempt is lost: nightfall, the walk home, the Routed Evening and the plaster** (the loss rule is taught by living it once).
- **L2D5:** the rematch (he is plastered −10% and Calm, his anger spent); **Claim Spray the Den post** → `DistrictClaimed`; the Life-end sleep.
- *Challenger timing note:* OR-16's calendar (Nemesis F-challenger) places the first challenger on the second night after Mikan first holds ≥ 3 Lane Patches. The rulings' slice expectation is the **L2D4** Sniff, used here. If Nemesis's count lands it a day earlier (the L2D3 Sniff), L2D3, the heaviest day, gains only an *optional* fight; skipping it costs one night's −10 over-mark on its target. Both fit (§3.11).

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
| 17:15–18:00 | P | The Keeper (an untracked Stray): Standoff and fight, no Verdict | Combat | C |
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
| 0:15–0:45 | P | Doorstep: Tribute banked; Sniff: **raid forecast on Laundry Pole Yard** (two portraits, motive "?") plus 2 items | Economy, Nemesis | T |
| 0:45–2:15 | P | Lot (first-use day, 1.5 min): Turf Board, post by the forecast's portraits and the neighbours; **first Lesson** (Rank I, 40); Share a Morsel | Territory, Crew | T |
| 2:15–4:45 | 0:00–2:30 | Whisker Sense; Spray a post below Strong | Territory | T |
| 4:45–6:00 | P | **Ambush** a Tough pair from the High Road | Combat | C |
| 6:00–8:00 | 2:30–4:30 | To **Tofu Shop Step**: Rub, Counter-Spray | Territory | T |
| 8:00–11:00 | P | Wave → **Captain Kagi** Standoff → fight (**first Zoomies**) → Verdict | Combat, Nemesis | C |
| 11:00–11:30 | 4:30–5:00 | Claim Spray: all 4 outer Patches held; **influence ≈ 95** (Persimmon Alley has slipped below Strong), so the Boss window stays shut | Territory | T |
| 11:30–11:45 | 5:00→7:00 | Sunspot nap | Day loop | T |
| 11:45–14:45 | 7:00–10:00 | Roam. **Dusk at 12:45: the chime and the bell glint, but no Call (Late Home)**; the thread appears with the chime; the player stays out | Territory | T |
| 14:45–16:00 | P | Crow and Stray fight | Combat | C |
| 16:00–18:00 | 10:00–12:00 | Roam. **Haru's late Call rises from the house at Dusk + 2:30 (clock 10:30, ≈ 16:30)**; **Night** begins (moon-blue) | Territory | T |
| 18:00–22:00 | 12:00–16:00 | Night roam; Rivals board check; a Shiny on the roofs; drowsy at 16:00 | Territory | T |
| 22:00–22:30 | grace | Takes the thread (≤ 60 s) → `late` | Day loop | T |
| 22:30–23:00 | P | Late coda: the covered plate | Narrative | H |
| 23:00–24:00 | P | **K2.2 The Lamp at Night** on the late arrival (Narrative: any hour; Gran lit the Lamp); sleep. Tonight step 2 resolves the raid against the posted Sentry | Narrative | S |

Totals: C 6.75 (5.5 paused + ≈ 1.25 stalking and approach) · T 15.5 · H 0.75 · S 1. Four encounters (the optional Night-only Roamer is left out of the reference so that K2.2 fits). This day is the budget's worst realistic case: round-3 budget check 24.9 typical / 28.9 heavy, so it fits the 25-minute median with almost no slack. A home-by-Dusk version (Late Home's wait inside the wall, then K2.2) is ≈ 22 min.

**The loss day: Life 2 day 4 (L2D4, the window opens and the first attempt is lost; 15.5 min).** The reference path's one planned loss (OR-01). Daifuku is fought at his Day stop; the Combat sim (F9 there) shows a same-level Posse with median dodging *wins*, so this row is the first-attempt case (variance, a lighter Posse, or a Riled-to-Furious Boss after loud marking).

| Real | Clock | Activity | System | Cat |
|---|---|---|---|---|
| 0:00–2:30 | P | Wake; **K2.5 *The Envelope*** (the Closing, morning) | Narrative | S |
| 2:30–3:00 | P | Doorstep: Tribute; Sniff: **"A stranger's scent"** (the challenger's silhouette staking a post; tape star), the raid forecast, one Nemesis item | Economy, Nemesis | T |
| 3:00–4:00 | P | Lot: Turf Board (post for the forecast); Share a Morsel | Crew, Territory | T |
| 4:00–5:30 | 0:00–1:30 | Whisker Sense; **rescue Spray** Laundry Pole Yard (slipped below Strong overnight) | Territory | T |
| 5:30–7:00 | 1:30–3:00 | To Persimmon Alley; **rescue Spray → influence 100** | Territory | T |
| 7:00–7:15 | P | **The Boss window opens:** a yowl rolls down from his wall, Daifuku climbs down to his Morning stop; the Turf Board crown lights | Territory, Nemesis | T |
| 7:15–8:45 | 3:00–4:30 | Toward him; **Day at 4:00**: he moves to Tofu Shop's back wall (rain barrel); a crown tick on the compass | Day loop | T |
| 8:45–12:15 | P | Daifuku Standoff and fight on the stop's kit (≈ 3.2 min), Fired Up if his anger is Riled or worse; **wipe** in phase 3; his Gloat | Combat, Nemesis | C |
| 12:15–13:15 | 4:30 → **12:00** | **Nightfall** (clock to 720); the street closes; the thread at once; walk home under moonlight → `routed` | Day loop | T |
| 13:15–13:45 | P | **The plaster beat** (Haru kneels; the ear) | Narrative | S |
| 13:45–15:30 | P | The Routed Evening: Lap, the piano, the daily find; sleep. Tonight step 2 auto-resolves the raid; the window stays open (influence still ≥ 75) | Home | H |

Totals: C 3.5 · T 7.25 · H 1.75 · S 3. Optional (heavy): the challenger fight at its post before Daifuku (+1.5 min with its Verdict). Budget check: 15.2 typical / 21.8 heavy. *Before this pass* the same day ran 21 min (the wipe jumped the clock to Dusk and the Dusk tail was played out).

**Last slice day: Life 2 day 5 (L2D5, the Daifuku rematch; 16 min).** K2.5 *The Envelope* (the Closing) already played on the L2D4 morning (Narrative §3.3), so the Life ends at tonight's sleep.

| Real | Clock | Activity | System | Cat |
|---|---|---|---|---|
| 0:00–0:15 | P | Wake; Mikan wears the plaster (yesterday's wipe) | Narrative | H |
| 0:15–0:45 | P | Sniff: Daifuku plastered (−10%); the raid forecast; a town event or the challenger's stamp | Nemesis | T |
| 0:45–1:45 | P | Lot: Yowler into the Posse; Share a Morsel | Crew | T |
| 1:45–3:15 | 0:00–1:30 | High Road to his Morning stop (Laundry Pole Yard's yard wall, the wash tub) | Territory | T |
| 3:15–6:45 | P | Daifuku Standoff (Calm: anger spent by yesterday's loss), 3 phases (sim 157 s at −10%), knock-off into the wash tub, Full Pile-On, Verdict (any of three) | Combat, Nemesis | C |
| 6:45–7:15 | 1:30–2:00 | The thread to the Den corner stone; **Claim Spray the Den post** → `DistrictClaimed` | Territory | T |
| 7:15–7:30 | 2:00→4:00 | Nap | Day loop | T |
| 7:30–14:00 | 4:00–8:00 | Victory lap: 2 fights (2.5 P, one is usually the Nemesis's daily placement), approaches (1), roam | Combat, Territory | C/T |
| 14:00–14:45 | 8:00–8:45 | Dusk Call → thread → `on_time` | Day loop | T |
| 14:45–15:15 | P | Evening routine; home find | Home | H |
| 15:15–16:00 | P | **The Life-end sleep in the suitcase** → the slice title card (the night's pile and the Rivals board with the Nemesis) | Narrative | S |

Totals: C 7 · T 7.5 · H 0.75 · S 0.75. (Owner-feedback budget check, with Daifuku now costed explicitly: 15.7 typical / 23.6 heavy; round 3 gave 14.4 / 20.2 by counting him as one 1.1-minute fight.)

### 3.11 Slice pacing graph (reference path: 7 days, 143.5 min; was 149)

| Day | Real | C | T | H | S | Beats |
|---|---|---|---|---|---|---|
| L1D1 | 25 | 9 | 8 | 2 | 6 | K1.1, crow on the lane-side wall, Pile-On 0:14, Patch 1 (Low Wall Corner), Togemaru flees, K1.3 |
| L1D2 | 20 | 7 | 10 | 1.5 | 1.5 | Memory line, first Verdict, Patch 2 (Laundry Pole Yard, Togemaru), Pon joins, K1.4 |
| L2D1 | 20 | 7 | 9.5 | 1 | 2.5 | Montage, K2.1, Rivals board, Kinako's favour, Ambush, Patch 3 (Persimmon Alley), influence ≈ 75 |
| L2D2 | 23 | 7.75 | 13 | 1 | 1.25 | Declaration card + first forecast, Sentries and Turf Board, props and Fears, K2.3 flap, first Night, Caterwaul |
| L2D3 | 24 | 6.75 | 15.5 | 0.75 | 1 | Lessons, Kagi, Zoomies, Patch 4 (Tofu Shop Step), influence ≈ 95, Late Home, K2.2 |
| L2D4 | **15.5** (was 21) | 3.5 | 7.25 | 1.75 | 3 | K2.5 (morning, the Closing), challenger Sniff, rescue Sprays → **the Boss window opens**, Daifuku attempt lost in Day → **Night**, walk home, the Routed Evening and the plaster |
| L2D5 | 16 | 7 | 7.5 | 0.75 | 0.75 | Daifuku rematch (−10%, Calm), Den Claim Spray → claimed, Life-end sleep in the suitcase, title card |
| **Total** | **143.5** (was 149) | **48 (33%)** | **70.75 (49%)** | **8.75 (6%)** | **16 (11%)** | |

```
cumulative minute 0         30        60        90        120       150
story beats       K1.1 K1.3 |K1.4 M K2.1 K2.3   K2.2 K2.5        end
combat   C  |##########|########|#######|########|#######|#########|#######|
territory T |########|##########|#########|#############|################|#########|#######|
           L1D1      L1D2      L2D1      L2D2        L2D3          L2D4      L2D5
```

Combat and territory alternate inside every day, because each Patch take is roam → escalate → fight → Spray → post. Neither one runs for more than ≈ 4 real minutes without the other, apart from the Daifuku fight. The **fast path** (Daifuku won on L2D4 after the window opens, then the Den Claim Spray) is 6 days and ≈ 2 h 08 (was 2 h 13). **Each extra Boss wipe** now adds one rematch day, ≈ 16 min (was 16–20: the lost day no longer plays out its Dusk tail), so reference + one extra wipe is ≈ 160 min, over the 150 median as before; AC-P2 is a median. *Owner-feedback re-run:* `design/reviews/owner-feedback/sim/day_budget_check.py` (output `.out.txt`; before `.before.out.txt`).

## 4. Formulas

**F1. Clock.** `clock(t+dt) = min(C_open, clock(t) + dt · running)`, where `running = 1` only while roaming (§3.1) and 0 otherwise. `phase = floor(clock / L_phase)`, with `L_phase = 240`.

**F2. Nap.** `clock ← clock + min(N_nap, C_open − clock)`, with `N_nap = 120`.
*Example:* a nap at clock 650 before the flap → 720, so Mikan is drowsy at once.

**F3. Real day length.**
`T_day = T_wake + T_door + T_lot + (C_open − N_nap·n_nap − C_skip)/60 + T_enc + T_home + T_eve`, in minutes.
`C_skip` is clock skipped by a loss jump or by Settle In.
*Example (L2D3):* 0.25 + 0.5 + 1.5 (first-use Lot) + (960 − 120)/60 + 5.5 + 0.5 + 1.5 (Late coda + K2.2) = **23.75** (the table adds the nap's 15 real seconds and rounds to 24).

**F4. Activity shares.** `share_X = Σ tagged seconds_X / T_day`. Each second carries exactly one tag:
- **C:** paused encounter time, plus roaming while the player is locked onto or stalking a hostile within 15 m, or answering a Caterwaul.
- **S:** vignette time.
- **H:** other time inside the wall.
- **T:** everything else.

Targets: T 0.50 ± 0.05, C 0.35 ± 0.05, H + S 0.15 ± 0.05.

**F5. Loss.** `haul_lost = floor(f_loss · field_haul)`, with `f_loss = 0.2` (0 in Life 1). If `clock < 480`, `clock ← 480`.

**F6. Slice length.** `T_slice = Σ T_day(d)`. Target 120–150 min.
*Reference:* 7 days × 21.3 avg = 149. *Fast path:* 6 days ≈ 132.

## 5. Edge Cases

- **Nap with < 120 s left:** the clock goes to `C_open`, Mikan is drowsy, and the grace starts.
- **Fight running when the clock would end:** impossible, because the clock is paused in combat. Drowsiness starts at `EncounterEnded`.
- **Caterwaul during the grace or the autopilot walk:** suppressed. Territory resolves it as unattended.
- **Wipe during the grace:** impossible, because encounters are suppressed. **Wipe during Night:** `routed` arrival, no clock jump, the plaster shows, and the Night's Shinies already earned are kept (field haul −20%).
- **Wipe on Life 1 day 1 after the tutorial** (for example against the Thorn): jump to Dusk, K1.3 plays as normal, nothing is lost. If Low Wall Corner is not yet held, the turf goal carries to day 2. *Mio is never sent to bed before the first Call (PP-06).*
- **Day-skipping** (Settle In as soon as it is offered, to farm Tribute): the 240-clock-second floor, `seen` decay and Territory's DR-57 no-idle sim cover it. Day-skipping still cannot pass the turf goal.
- **Closing timing:** K2.5 is a **morning** beat (L2D4, Narrative §3.3), so a Late arrival never delays it. A player who claims the Den before L2D4 plays on into the Plateau until K2.5's morning. If the claim is already made when a morning Closing plays, **Settle In is offered at once**, without the 240 floor, so the Life-end sleep costs ≤ 3 min. Otherwise the Life ends at the first sleep after the claim.
- **Late Home on L2D3, Mikan out all Night:** the chime and the bell sound at clock 480 with no Call; the thread appears as usual; Haru's late Call is heard from the street at Dusk + 2:30 (clock 630). K2.2 plays on the `late` arrival, after the covered plate.
- **Late Home on L2D3, Mikan inside the wall at Dusk:** the clock is paused, so Haru's key turns ≈ 40 real seconds after the Feeding; the evening and K2.2 then play as normal (`on_time`).
- **Late Home on L2D3 after a wipe** (`routed` arrival): the plaster evening plays with Gran; Haru comes home ≈ 40 s later and K2.2 plays as normal.
- **Stalling in menus or at the Lot:** the clock is paused, so stalling gains nothing.
- **Head Home from a High Road dead end:** the thread is pathed on the traversal graph. A build check fails if any reachable node is more than 60 s away (AC-F4).
- **Quit mid-Slow Blink or mid-Verdict:** resumes at the encounter's start; seeded rolls make it identical.
- **Mid-day home visit used as a heal:** no heal is granted, so Sunspots keep their cost.
- **Encounter count overshoot** (an aggressive player taking 9 fights): there is no cap on player-started fights. Pressure is capped only on unsolicited encounters, so long days are the player's choice.

## 6. Dependencies

| System | Day loop provides | Day loop requires |
|---|---|---|
| **Combat** | Clock pause on `EncounterStarted` / `EncounterEnded`; the loss handling in §3.6 | `EncounterEnded.outcome`; tutorial fights cannot wipe; the Frazzle fail-safe by 0:13:30 |
| **Nemesis** | `PhaseChanged` and `DayEnded`; Ambush budget per phase; Step 3 slot | Sniff items, incl. the Declaration card (L2D2 at the median); Standoff placement (Togemaru on L1D1 after the Low Wall Corner claim, and on L1D2 at its Laundry Pole Yard gatepost); memory line by 0:60; the first raid forecast in the L2D2 Sniff and one raid a night after it |
| **Territory & Economy** | Step 2 and 4 slots; `HomeArrived` (bank the haul); Caterwaul reach = current district, suppressed while drowsy | Encounter placement for the §3.7 floor; Tribute at the Doorstep; no idle exploit under Settle In |
| **Crew** | Step 1 slot; Lot time ≤ 1 min | Share a Morsel is the only daily Crew action; the second recruit by L1D2 |
| **Narrative** | `HomeArrived(kind)`; step 0 tags; Late and Closing handling | `day_gate`s consistent with §3.10 (K2.3 an L2D2 **Dusk** beat; K2.2 on L2D3 at any hour, with Late Home that Dusk; K2.5 the L2D4 **morning**; the slice ends at the Life-end sleep after the claim); Routine verbs give no daily reward; vignette lengths within budget |
| **UX** | The phase dial; the thread; Settle In | The beat sheet mirrors §3.9; no daily-list UI |
| **Audio** | `PhaseChanged`; the Dusk Call at clock 480 | The chime → Call within one bar |
| **Camera** | The wall transition | The lower-and-tighten move |

**Assumptions for creative-director review:**
1. The DR-22 crow is fought on the lane-side wall top, outside the wall, which keeps the garden combat-free. **Confirmed** (presentation ruling R4: no combat inside the wall).
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
- **AC-F9:** On L2D3 (Late Home), no Call plays at clock 480 and the thread still appears; Haru's late Call fires at clock 630 if Mikan is roaming, or 40 ± 2 real seconds after the Feeding if Mikan is inside the wall. On every other day the Call answers the chime within one bar.

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
- A mid-day home visit with a small reason to exist (a Texture slot), if playtests show the quiet house reads as dead.
- **(Iteration 3)** Budget the Lot at 1.5–2 minutes on first-use days: Turf Board on L2D2, Lessons on L2D3. Measure Lot and Doorstep time first; they are the assumptions most likely to break.
- **(Iteration 3)** L2D3 out all Night now carries Late Home and K2.2: round-3 budget check 24.9 typical / 28.9 heavy, so it has almost no slack at the median. If it overruns, move the Tofu Shop Step take earlier in the reference path or trim the Night roam.
- **(Iteration 3)** The first-hour clock times disagree with `ux/key-screens.md` §7.3 (K1.4 at ≈ 0:40–0:45 here, 0:52–0:57 there). Align when the grey box is timed.
- **(Iteration 3)** The round-2 territory review asked for Sentries and the Turf Board on L2D1; the presentation review ruled that UX's sheet keeps them on L2D2. This doc follows UX. If L2D2 (22.4 typical / 28.9 heavy) proves too heavy, moving the Turf Board back to L2D1 is the lever.

## Revision Log

**2026-11-24 — Iteration 3 (final fix pass; round-2 reviews `nemesis-territory-dayloop.md`, `presentation.md`, `combat-and-crew.md`).** Budget re-run: `design/reviews/round-3/sim/day_budget_check.py` (output `day_budget_check.out.txt`).

| Item | Status | How |
|---|---|---|
| D1 Life 2 ladder | FIXED | §3.9 follows UX's sheet (key-screens §7.4, presentation ruling): L2D1 Ambush and Fence Line; L2D2 the first raid **forecast in that morning's Sniff** (no longer also "the first forecast raid" on L2D3), Sentries and the Turf Board, props and Fears, the flap and the Caterwaul; L2D3 Lessons and Zoomies; L2D4 the Den. *Note:* the round-2 territory review asked for Sentries on L2D1; the presentation ruling wins (Backlog) |
| D2 Reference claim path | FIXED | L1D2 claims Laundry Pole Yard by Routing Togemaru, its Keeper; L2D1 claims Persimmon Alley (the Den opens); L2D3 claims Tofu Shop Step (Kagi); L2D4–5 Daifuku. The Ambush on L2D1 is a Persimmon Alley Tough. Low Wall Corner's Keeper is an untracked Stray |
| Crew names | APPLIED | Hige, Pon (second recruit, L1D2), Kinako (L2D1 favour, now the day's required first objective; Crew fix 5), Togemaru, Kagi |
| K2.3 is a Dusk beat | FIXED | §3.1: leaving through the flap after K2.3 resumes the clock into Night (presentation "also ruled") |
| Late Home on L2D3 | FIXED | §3.1, §3.10 (worked day), §5, AC-F9: no Call at the chime, the late Call at Dusk + 2:30 on the street or ≈ 40 s after the Feeding inside the wall; Gran lights the Lamp; K2.2 plays on that arrival |
| Narrative schedule | FIXED | K2.2 on L2D3; K2.5 on the L2D4 morning; the slice ends at the Life-end sleep in the suitcase after Daifuku is Routed (§3.10, §3.11, §5, §6) |
| Crow staging | CONFIRMED | Lane-side wall top (R4); Assumption 1 confirmed |
| Mid-day visit wording | FIXED | Gran is home on school days |
| Ambush budget note | FIXED | §3.7: Nemesis's ≤ 1 Rival Ambush a day is the slice value inside the ceilings |
| Day budget | RE-CHECKED | Typical / heavy minutes: L2D1 20.6 / 24.3 (was 21.1 / 25.3); L2D2 22.4 / 28.9 (was 21.6 / 28.1); L2D3 out all Night 24.9 / 28.9 (was 24.4 / 28.5); L2D4 14.1 / 17.0; L2D5 14.4 / 20.2. All fit DR-16; slice 149 min (was 150) |
| Not fixed | BACKLOG | First-use Lot budgets, L2D3 slack, K1.4 clock alignment with key-screens, Sentries day |

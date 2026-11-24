# Round-2 check: Nemesis, Territory, Day Loop

*Reviewer: senior systems designer · 2026-11-24 · Bar (REVIEW-PROTOCOL amendment): could a small team start prototyping the slice from this doc without contradicting another doc? `PASS` or `FIX`; only slice-blocking items are listed as fixes.*

**Read in full:** `nemesis-system.md`, `territory-management.md`, `day-loop.md`, `creative-brief.md`, and rulings §A, B, C, F, G, H plus the Part 2 lists for these docs. **Read in part:** `crew-and-progression.md` §3.2–3.5, §3.7, F6–F9 (the personality sheets and the six recruit sheets).
**Sims** are in `design/reviews/round-2/sim/`. Each `.py` file has a matching `.out.txt`. They report observations, not verdicts: `territory_slice_sim.py`, `posting_decision_value.py`, `nemesis_slice_sim.py` (run as written, then with `--fix` and `--fix2`), `raid_requester_check.py` and `day_budget_check.py`.

## Verdicts

| Doc | Verdict | Why, in one line |
|---|---|---|
| `nemesis-system.md` | **FIX** | The First Thorn is a different cat, on a different Patch, from the one in Crew, Territory and Day Loop. The raid-request rule makes raids almost disappear after the first one. Raid motives do not match Territory's. The arc lead has rule holes that break the doc's own 100% arc target. |
| `territory-management.md` | **FIX** | Small. Mark Over and Snatch are delegated to this doc but missing from it. Nothing says what a snubbed Nose-Touch does to the Patch. Lessons are taught on the wrong day relative to Day Loop. |
| `day-loop.md` | **FIX** | Small. Its Life 2 teaching ladder and its claim path contradict Territory and Nemesis, and the ladder contradicts itself about whether the first raid is forecast. |

The underlying design holds up. The economy hits its anchor, both exploits are closed, there is no death spiral, the day fits its clock, and the Life 1 memory callback is guaranteed. Every fix below is a rule or a number to change in a named doc. None needs a redesign.

---

## Fixes (slice-blocking only)

### `nemesis-system.md`

1. **One First Thorn, on Laundry Pole Yard.**
   - **Name.** "Kinako" is Crew's Friend Stray (Fraidy Scrapper, §3.3). Nemesis uses the same name for the Thorn. Adopt Crew's §3.3 sheet for the Thorn: working name **Togemaru**, **Braggart, Scrapper, Fear Cucumbers**. §3.1 already says "Crew confirms the final set".
   - **Post.** The Thorn is **Keeper of Laundry Pole Yard**, whose landmark is the old wooden yard gatepost (Territory §3.1). Delete A-3. The Low Wall Corner Keeper in DR-22's tutorial escalation is an **untracked Stray**, so Routing it gives no Verdict and the first Verdict stays on Life 1 day 2 (DR-22).
   - **Day 1.** The Thorn Standoff happens after the Low Wall Corner claim, and the Thorn flees as normal. Day 2 is the contest for its own post (Territory §3.12, Day Loop §3.9).
   - **Keeper table for §3.1:** Laundry Pole Yard = Thorn · Persimmon Alley = Tough seat 1 · Tofu Shop Step = Captain Kagi · Den = Daifuku.
   - **§3.16.** Re-derive it with no Fear prop in Life 1, because DR-22 introduces props and Fears in Life 2. Move the "Got Over It" adaptation to Cucumbers in Life 2. With Patch-lost moving from day 1 to day 2, the numbers barely change: G 25 → 59 → cap → Nemesis.

2. **Raid requests (§3.12 step 3f): request one raid every night from the cat flap.**
   - **Timing.** Change "requested on Life 2, day 2 … forecast in the next Sniff" to: **requested on night 3 (the night after Life 2 day 1), forecast in the Life 2 day 2 Sniff, fires that Night.** This matches Territory §3.7, the doc's own §3.16 and DR-13.
   - **Cadence.** From night 4, request one raid every night that an admissible target exists (≤ 1 per district).
   - **Target.** The **lowest-Scent admissible held Patch, Strong Patches included.** DR-46 and Territory §5 already admit Strong targets, where the worst case is Scuffed. Delete "below Strong".
   - **Requester.** The highest-F3 active, non-truce, non-Crew cat with **Grudge ≥ 40**. If there is none, Daifuku sends the lowest-seat Tough plus one escort under motive `boss_orders`.
   - **Why.** As written, a requester (Grudge ≥ 60) exists on only **0–14% of nights 4–7** for humble, mixed, pacifist and lose-40 players (table S5). The below-Strong rule then leaves an engaged player **1.8 raids per slice instead of the 4** that Territory's daily decision is built on (table S1). Without a forecast there is no daily posting decision, which is the user's core ask for territory.

3. **Raid motives: one list.** Adopt Territory §3.7's five motives in §3.12, §6.1 and the `RaidRequested` payload: `grudge`, `boss_orders`, `gloat`, `pretender`, `uprising`.
   - Map the old names: `comeback` → `grudge` (or `gloat` for a Braggart returner); `squat` → `pretender`.
   - State the party per motive: leader alone, leader + 1 escort, or leader + 0–1.
   - **An uprising uses the night's single raid slot.**

4. **Arc-lead holes (§3.7). As written, the arc target in AC 8 is unreachable.**
   - **(a) A Humbled lead stays the lead.** Its presence placement is a **crate-challenge Standoff** on its Patch (a normal fight and Verdict). If it is Humbled before night 3, its uprising is the scripted first raid.
   - **(b) Re-naming.** When the lead resolves with fewer than 3 encounters, name the new lead **the same night**, from all active non-Boss cats. Prefer cats with ≥ 1 encounter; otherwise take the highest-seat Tough. Re-check every night.
   - **(c) Arc achieved** = ≥ 3 encounters + ≥ 1 mark + any resolved state (Nemesis slot, Friend, Crew or Humbled).
   - **Restate AC 7 and AC 8** to what the sim supports:
     - AC 8: arc achieved for 100% of chase and humble players and **≥ 85%** of mixed, pacifist and lose-40 players inside 7 days; 100% by day 30.
     - AC 7: Nemeses max 2, median 1 for chase and humble players. A mixed player may end the slice with 0.
   - **Why.** As written, Humbling the Thorn on Life 1 day 2 orphans the arc: **0% arc for humble players, even over 30 days**. Re-naming draws only on seated cats that have already met Mikan, and on night 2 there are none. Results: mixed 49%, pacifist 63%. With (a)–(c): 100 / 100 / 91 / 85 / 85% (table S3).

5. **What a snubbed Nose-Touch does to the post (§3.11).** On a snub, the cat bolts, with no truce, and the **Patch is Open** (Claim Spray, as after a Chase Off). `VerdictApplied.verdict` takes `chase | humble | recruit | nose_accept | nose_snub`, so Territory can tell the two apart.

6. **Humble needs a cost the slice can show.** Raise simmer from +2 to **+8 per Unwatched night** (safe range 5–10; change the knob row). As written, an all-Humble player sees **0.00 uprisings per slice**: a Humbled cat starts at about G 55 and needs 13 Unwatched nights to reach Restless at 80. Humble then strictly beats Chase Off, giving the post and the money with no downside. That contradicts the "why no Verdict dominates" paragraph in §3.11. At +8: 0.38 uprisings per slice when the Patch is posted on half the nights.

### `territory-management.md`

1. **Add Mark Over and Snatch** to §3.7 or §3.9. Nemesis §3.10 and §6.2 delegate both to this doc.
   - **Mark Over** (a Brooder Gloat; Daifuku is a Brooder and wipes the Posse in Day Loop's reference path): −30 Scent on Mikan's nearest held outer Patch. Low Wall Corner never drops below 10.
   - **Snatch:** the wipe's lost 20% of the field haul becomes `loot_held` on the victor, returned in full by Routing it within 3 days.
   - **§3.2 conflict:** §3.2 says Scent changes "only through…" a fixed list. Add Mark Over to that list.
2. **Snubbed Nose-Touch:** add it to §3.4 step 5 and to §5. The Patch is Open, so Claim Spray it (mirrors Nemesis fix 5).
3. **Teaching order (§3.12):** move "Lessons open at the Lot" from Life 2 day 2 to **Life 2 day 3**, to match Day Loop §3.9. Life 2 day 2 already carries the cat flap, the first Night, the first raid and the first Caterwaul, and DR-22 asks for one new system a day. In §3.7's resolution order, delete the separate "uprisings" sub-step, because an uprising is the night's raid (mirrors Nemesis fix 3).

### `day-loop.md`

1. **§3.9 Life 2 ladder.**
   - **Life 2 day 1:** the Turf Board and Sentries, matching Territory §3.12. Sentries are taught on Laundry Pole Yard before the first raid.
   - **Life 2 day 2:** the cat flap, the first Night, and the first raid, which **is forecast in that morning's Sniff** (DR-46: forecasts are always on) and is offered as the Caterwaul. Props and Fears also land here.
   - **Life 2 day 3:** Lessons and Zoomies (the Captain). Delete "the first forecast raid" from Life 2 day 3; the Life 2 day 2 raid was already forecast.
2. **Reference claim path (§3.9 table, §3.10, §3.11 Beats).** Life 1 day 2 claims **Laundry Pole Yard by Routing the Thorn, its Keeper** (Patch 2). Life 2 day 1 claims Persimmon Alley (Patch 3), which opens the Den. Life 2 day 3 claims Tofu Shop Step (Kagi). Life 2 days 4–5 are Daifuku. This is Territory §4.11's path and Nemesis fix 1. Change "Ambush a Laundry Pole Yard Tough" (0:46–0:60) to Persimmon Alley. The day lengths in §3.11 still hold (table S6).

---

## Cross-doc consistency (what was checked)

| Item | Nemesis | Territory | Day Loop | Crew / rulings | Status |
|---|---|---|---|---|---|
| Overnight step order | 3a–3f inside step 3 | step 2 / step 4, raids from last night | steps 0–6 wrap DR-13 | DR-13 | **Consistent** |
| Once-a-day actions | none added | Tribute pick-up, Share a Morsel | the 3: Tribute, Share, the home find | DR-18 | **Consistent (3)** |
| First raid timing | §3.12 says requested L2D2; §3.16 says forecast L2D2 | requested night 3, forecast L2D2 | L2D2 "Caterwaul", L2D3 "first forecast raid" | DR-13, DR-46 | **Conflict** → N2, D1 |
| Raid motives | grudge / comeback / uprising / squat | grudge / boss_orders / gloat / pretender / uprising | — | brief §6.1 payload | **Conflict** → N3 |
| Raid targets | below Strong only | Strong admitted (worst case Scuffed) | — | DR-46 | **Conflict** → N2 |
| The Thorn | "Kinako", Yowler, Fear Water, Keeper of Low Wall Corner | First Thorn's post is the Laundry Pole Yard gatepost; L1D2 contest there | LWC Keeper and Thorn are separate beats | Crew: "Togemaru", Braggart Scrapper, Cucumbers; "Kinako" is the Friend Stray | **Conflict** → N1, D2 |
| Personalities of the six | Daifuku Brooder; Thorn Braggart; Captain = the remaining one | worked example uses Stalwart Bruiser and Braggart Scrapper (= Hige, Togemaru) | — | Hige Stalwart · Pon Goofball · Kinako Fraidy · Togemaru Braggart · Kagi Schemer · Daifuku Brooder | **Consistent** once the name is fixed |
| Verdict → Patch | Chase, Humble, Recruit: yours; Nose accept: truce; snub: silent | same; snub: silent | — | DR-42 | **Gap** → N5, T2 |
| Verdict → Clout | Chase Off +2 voided (A-4) | voids +2 | — | DR-14 milestones only | Consistent (both drop it) |
| Recruit / Bribe | availability per DR-09 | price sheet matches Crew F8 | — | DR-09, DR-14 | Consistent. Daifuku Lv 8 (256) vs Crew ≈ 9 (288): Backlog |
| Loyalty / betrayal | 3a no-op; reads < 30 | Warden True+, no Shifty on the Den | — | < 30 (Schemer < 35), locked until Life 3 | **Consistent** |
| Humble | +15%, simmer only if Unwatched, Restless at 80 | +15% (Goofball +25%, no simmer) | — | DR-42 | Consistent; tuning → N6 |
| Stash / prices | Bribe from the Stash | cap 400, Leftovers rot, never < 0 | — | DR-14 | **Consistent** |
| Rival Ambush budget | ≤ 1 per day | — | ≤ 1 per phase, ≤ 2 per day, +1 at Night | — | Compatible (Nemesis is stricter); Backlog |
| Mark Over / Snatch | delegates the Scent value to Territory | missing | — | — | **Gap** → T1 |

---

## Sims: key output

### S1. Territory economy, engaged player (2,000 seeds; means)

Raid rule T is Territory's assumption, which Nemesis fix 2 adopts: one raid a night from night 4. Rule N is Nemesis as written: below-Strong targets only, plus a requester gate.

| Day | Tribute that night (T) | Field + cache | Spend | Stash at end (T) | Raid nights (T / N) |
|---|---|---|---|---|---|
| 1 | 6 | 14 | 0 | 14 | 0 / 0 |
| 2 | 12 | 35 | 3 | 52 | 0 / 0 |
| 3 | 29 | 40 | 10 | 90 | 0 / 0 |
| 4 | 26 | 45 | 57 | 103 | 1.00 / 1.00 (scripted) |
| 5 | 38 | 66 | 117 | 74 (min 65) | 1.00 / **0.17** |
| 6 | **61.6** (N: 64.4) | 90 | 72 | 126 | 1.00 / **0.00** |
| 7 | 61 | 50 | 157 | 77 (min 47) | 1.00 / 0.62 |

- **Anchor:** about 62–64 Morsels on the night of the claim. Canon is about 60 and the doc's target 54–66, so it is met.
- **Stash:** never below 0. It ends around 80, so the sinks bite.
- **Raids:** 4.0 per slice under T and 1.8 under N.
- **Lost Patches:** none before the claim, under either rule. The Den-Open rule and the Strong rule together mean no outer Patch can be Lost while the player pushes for the Den.

### S2. Other players and exploits (2,000 seeds; Tribute per night)

| Player | d3 | d4 | d5 | d6 | d7 | d8 | d10 | Notes |
|---|---|---|---|---|---|---|---|---|
| Casual (slower claims, 60% visits, 1 Fraidy post, half the rescue Sprays) | 15 | 19 | 18 | 29 | 27 | 44 | — | Stash 76–159, min ≥ 75. Holds 4.3 Patches by day 8. No spiral |
| Sleep-skip from day 3 | 12 | 5 | 4 | 3 | 1 | 0 | 0 | **Closed.** Steady state 0 |
| Rub-skip (Low Wall Corner only) | 13 | 6 | 6 | 6 | 5 | 6 | 6 | ≈ 6/day if it also Sprays LWC. AC 3's "≤ 5" is off by one: Backlog |
| Patrol-skip (3 Patches, no fights) | 29 | 26 | 26 | 26 | 27 | 26 | 27 | No field haul. Stash *falls* (Share costs more than it earns). Legitimate play, not an exploit |
| Wipe-skip (wipe early every day) | 29 | 26 | 38 | 62 | 61 | — | — | Tribute identical. Stash −15 to −65 below engaged. **Dominated (closed)** |

### S3. Nemesis over the slice (500 seeds per policy, 7 days)

| Policy | Seated at G ≥ 75 (mean / p95) | Distinct Nemeses (median / max) | Arc achieved: as written → with fix 4 | Wall events per night | Visible rank changes per night | L2 mornings with ≥ 1 Sniff item | Uprisings: as written → +8 simmer |
|---|---|---|---|---|---|---|---|
| chase | 9.8% / 15.2% | 1 / 2 | 100% → 100% | 0.45 | 1.5 | 77% | 0 → 0 |
| humble | 0.0% / 0.0% | 0 / 1 | **0%** → 100% | 0.45 | 1.1 | 65% | **0.00** → 0.38 |
| mixed | 0.5% / 2.5% | **0** / 1 | **49%** → 91% | 0.46 | 1.0 | 73% | 0 → 0.07 |
| pacifist | 0% | 0 / 0 | **63%** → 85% | 0.45 | 0.4 | 65% | 0 |
| lose-40% | 0.3% / 2.2% | 0 / 1 | **45%** → 85% | 0.45 | 1.1 | 71% | 0 → 0.05 |

- **Life 1 remembered-rival callback:** 100% for every policy. The Thorn always has Memory of Mikan at its day-2 placement, which is ≈ 0:28–0:33 against the 0:60 target.
- **Targets met:** DR-39's ≤ 15% share, 0.33–0.5 wall events per night, and 60–95% of Sniff mornings with an item.
- **Verdict mix (mixed policy, among offered Verdicts):** Chase 44% · Nose 35% (39% accepted) · Humble 13% · Recruit 8%.

### S4. Nemesis, 30-day extrapolation, one district (300 seeds)

| Policy | Seated at G ≥ 75 (mean / p95) | Distinct Nemeses (median / max) | Arc: as written → fix | Bitter at day 30 |
|---|---|---|---|---|
| chase | 15.0% / 23.8% | 2 / 4 | 100% → 100% | 0.6 |
| humble | 12.1% / 23.0% | 3 / 5 | **0%** → 100% | 1.3 |
| mixed | 1.6% / 5.4% | 1 / 3 | 51% → 100% | 0.0 |
| pacifist | 0% | 0 / 0 | 63% → 100% | 0 |

Slots never exceed 2 at once. Aggressive policies drift to about 15% at G ≥ 75 by day 30. That is fine for the slice. The full game's per-district slots should be re-simmed with more cats (Backlog).

### S5. Does a raid requester exist under the 3f rule as written (Grudge ≥ 60)?

| Policy | Night 4 | Night 5 | Night 6 | Night 7 |
|---|---|---|---|---|
| chase | 100% | 100% | 100% | 100% |
| humble | 0% | 2% | 3% | 6% |
| mixed | 7% | 9% | 10% | 10% |
| pacifist | 0% | 0% | 0% | 0% |
| lose-40% | 8% | 11% | 13% | 14% |

### S6. Day budget (minutes; typical / heavy) against DR-16 (median ≤ 25, cap 30)

| Day | Typical | Heavy |
|---|---|---|
| L1D1 tutorial | 23.8 | 23.8 |
| L1D2 Thorn + Laundry Pole Yard take | 18.4 | 22.9 |
| L2D1 Persimmon Alley take, Ambush, first Turf Board | 21.1 | 25.3 |
| L2D2 flap, first Night, raid + Caterwaul | 21.6 | 28.1 |
| L2D3 Tofu Shop Step take, first Lessons, out all Night | **24.4** | **28.5** |
| L2D3, home by Dusk | 20.4 | 24.4 |
| L2D4 Daifuku wipe (jumps to Dusk) | 12.8 | 15.2 |

**The day fits.** Out-all-Night days have under 1 minute of slack at the median. The two assumptions most likely to break are the Lot at ≤ 1 minute and the Doorstep at ≤ 0.5 minutes. On first-use days (Turf Board on L2D1, Lessons on L2D3) the Lot realistically takes 1.5–2 minutes, which is already inside the heavy column. This doesn't block the slice. It is the first thing to measure.

### S7. What the daily posting decision is worth (nightly raids, 2,000 seeds)

| Posting policy | Tribute, days 1–7 | Scuffed nights | Lost nights | Day-6 Tribute |
|---|---|---|---|---|
| Stalwart on the forecast + Braggart on the richest Patch | 234 | 0.85 | 0 | 61.6 |
| Swapped | 224 | 1.38 | 0 | 58.9 |
| Random 2 of Hige / Togemaru / Kinako | 209 | 2.04 | 0.34 | 54.3 |
| No posts | 167 | 3.97 | 0 | 46.2 |

---

## The user's direction

**Territory as half the game.** After Nemesis fix 2 there is a forecast every night from Life 2 day 2, so the decision exists on 4 of the slice's 4 raid days. Personality decides the answer on guard:
- the Stalwart (Hige) holds;
- the Braggart (Togemaru) pays +10% but sulks off the Posse;
- the Fraidy (Kinako) is a weak guard but raises the early Caterwaul;
- the Goofball (Pon) silences a Humbled resident;
- the Schemer (Kagi) reads the motive.

The answer pulls against the Posse, because the cat on the wall isn't fighting and isn't earning Posse Loyalty. The decision is real but **low-stakes in money**: about 25 Morsels over the slice versus posting at random (≈ 11%), and 67 versus not posting (S7). Two things keep it low:
- **Lost cannot happen before the claim.** DR-46's Den-Open rule plus the Strong rule mean the stakes are only Scuffed versus Repelled.
- **"Stalwart on the forecast" is close to dominant.**

This is the slice's biggest *design* risk for territory, but it is a tuning question that the prototype answers with Territory's AC 17, 18 and 22. Levers are listed in the Backlog. The Brooder's guard perk never comes into play in the slice, because Daifuku can join only at the very end.

**Nemesis making the game stand out.**
- **Within Life 1:** every player gets the remembered-rival callback (100%, at about minute 30). Silhouette Scars, Lick In, the Fence Line (0.45 wall events a night, 1.0–1.5 visible rank changes a night) and the Sniff (65–77% of mornings) all reach the player.
- **The headline Nemesis state (storm mark) does not.** A typical *mixed* player has a median of **0 Nemeses** in the slice. Nose-Touch resets Grudge to 0, and Recruit halves it.
- **The arc reaches everyone only after fix 4.** Without it, any player who Humbles or befriends the Thorn early loses the slice's rival thread.

Recommendation: ship fix 4. Ask the director (Backlog) whether the arc lead may hold the arc slot at Grudge ≥ 60 in Lives 1–2, because the 75 threshold is ruled in DR-39.

---

## Backlog (non-blocking; append to the owning doc's `## Backlog (post-slice)`)

- **Territory: raid stakes before the claim.** No Lost is possible while the Den is Open (S1). Levers, if AC 17 or 22 fails:
  - `loot_held` = 2× the Patch's Tribute;
  - a Routed Sentry costs −3 Loyalty (Crew);
  - `boss_orders` raids led by a Captain at 1.5× a Sentry's Power Rating, so Hige is not automatically safe.
- **Territory AC 3:** a rub-skipper who also Sprays Low Wall Corner gets 6.4 a day (Strong). Restate as ≤ 7.
- **Territory §4.11:** name S1 and S2 as Hige and Togemaru from Crew §3.3, not "Nemesis assigns". The Daifuku level (8, Bribe 256) should match Crew (≈ 9, 288).
- **Territory §4.13 "wiping is strictly dominated":** true for Morsels. In real time, a wipe at clock < 240 skips the day sooner than Settle In can. The costs are real (Loyalty, promotion, the plaster), so accept it, but say so.
- **Day Loop:** budget the Lot at 2 minutes on first-use days (Turf Board on L2D1, Lessons on L2D3). State that Nemesis's ≤ 1 Rival Ambush a day is the slice value inside §3.7's ceiling.
- **Day Loop / Narrative:** pin K2.5's `day_gate`. Territory assumes L2D5; Day Loop says "day 4+".
- **Nemesis §3.16 pacifist variant:** "P(no friend arc) 0.2%" ignores the rule that a lead with fewer than 3 encounters is resolved early. Re-state it after fix 4.
- **Nemesis:** ask the director about a Lives 1–2 arc-lead slot at Grudge ≥ 60 (perception of the Nemesis state). Re-sim per-district slots for 3 districts; one district drifts to 15–18% at G ≥ 75 by day 30 under aggressive play.
- **Nemesis / Combat:** with Crew's sheet, the Thorn is a Scrapper and resists Mikan's Claw ×0.8. Check in the combat prototype that a Life 1 kitten can still beat it. Hige's Thump does ×1.2 against it, and on day 1 it flees at 25%.
- **Crew** (outside this review's docs): Kagi's "Laundry-Pole Captain" tag clashes with Laundry Pole Yard being the Thorn's post. Make Kagi Keeper of Tofu Shop Step, or retag him.
- **Brooder guard perk** unused in the slice. Acceptable: all six personalities still *appear* (DR-01).

## Sim caveats

- **Nemesis encounter schedule.** The schedule (which cats Mikan meets on which day, flee odds by personality, the 8% Lick In rate, a 50% tracked Tough in each wave) is an assumption that mirrors the docs' reference path. The relative results are the point; exact percentages will move.
- **Territory inputs.** The territory sim uses Territory's own field-haul and Crew-level inputs (§4.11) and a Power Rating ratio of 1 between raiders and Sentry.
- **Reproducing.** Run `python3 -I <script>` from `design/reviews/round-2/sim/`. The nemesis sim's `--fix` and `--fix2` flags reproduce the "with fix" columns.

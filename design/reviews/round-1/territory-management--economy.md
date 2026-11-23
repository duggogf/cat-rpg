# Round 1 Critique: `design/gdd/territory-management.md` (economy and management)

*Reviewer: systems-designer (economy critic) · Date: 2026-11-23 · Target: draft v0.1, read in full (lines 1–1006, every section)*
*Also read: `design/creative-brief.md`, `design/gdd/game-pillars.md`; the Morsel/Shiny/Tribute/Sentry/Warden/Clout passages of `design/gdd/crew-and-progression.md` (§3.3–3.6, F4, F6–F9, edge cases, open questions) and `design/gdd/nemesis-system.md` (R7.3, R9.8 with the raid caps, R5.4, R12, Humbled and Share a Morsel lines). I did not read those two docs in full.*

**Model:** `design/reviews/round-1/sim/territory_economy_model.py`. It encodes the draft's own formulas: the anchors, three player types across the nine Lives, Morsels per real minute, raid odds, and Vigil survival. **This review session had no shell tool, so I did not run the script.** I worked every figure below by hand from the formulas the script encodes, and checked each one twice. Round 2 should run it (`python3 -I territory_economy_model.py`) and correct any figure where it disagrees.

---

## 1. Verdict

**NEEDS REVISION**

The skeleton is good and should be kept. The problems are these:

- There is one softlock.
- The anti-idle mechanism (`rounds`) is exploitable, works as a timer, and charges the player for going home early.
- The anti-idle claim does not survive contact with the Crew doc, whose Warden eligibility rule pins every Warden at Loyalty 60 or more.
- The economy has only been modelled from this doc's side. With the Crew doc's sinks included, Life 7 swings between a deficit and about 5,000 Morsels rotting on the Doorstep, depending on a feeding rule that two docs price differently.

Most of the fixes are cuts.

## 2. What is strong (must survive)

- **The draft is honest about its weak spots.** §5.5–5.7 and §15 named most of what I found. The arithmetic I checked is correct, with one exception: the §5.4 hour-26 Stash reads 2,220, but §5.3 gives 2,120. Raid Example A, R = 1.365, p_hold = 0.718; Example B, p_hold = 0.111; §4.1 decay examples; §5.3 column sums 43,840 / 41,720; anchors 54 / 281 / 1,094.
- **The escalation flow in §3.4.** Sneaking skips a wave, no Patch falls without a Verdict, and the Stale Claim makes a lost Patch easier to retake. This is a cat-true siege loop.
- **Ignoring a Caterwaul is never worse than being asleep.** This rule is exactly right for Pillar 2.
- **Death-spiral brakes:** no debt, sticky ranks and Life goals, Home Ground, a nightly loss cap, and income from fights that does not depend on territory. Checked: the §5.6 worst case stays net positive.
- **Fixed, one-time Shiny sources.** No drop rates, and the total of 120 matches canon.
- **The Leftovers rot on the Doorstep while a baffled human sweeps them away.** This is the best piece of Pillar 1 economy in the doc. Keep it.
- **The concept of Life 8 rule C.** Tribute stays at the post and Mikan has to go and fetch it. It is the right mechanical expression of the inversion. Its gate is the problem (Issue 1), not the idea.

## 3. Issues

### 1. BLOCKER: Life 8 can be uncompletable for a player who looked after their Wardens (§3.13 C, D)

The Life 8 goal needs **3 Fresh Catch Offerings from 3 different districts**. Fresh Catch can only be picked up where uncollected Tribute is stored. Under rule C, a district stores nothing if its Warden has Loyalty ≥ 60 and you hold its Den: its Tribute is delivered to the Doorstep instead. Two rules from the Crew doc make that case the normal one:

- Crew §3.6 makes **Loyalty 60 (True) the minimum for appointing a Warden**.
- Crew F8 makes Sworn cats immune to the Life 8 absence drain. Others lose 2 a day, so 8 over the 4-night Vigil.

Dens with such Wardens cannot be raided during the Vigil. After it, the Symmetry rule protects any Den whose district still has 3 outer Patches held.

- If 4 or more districts keep delivering, at most 2 districts have Fresh Catch, so the goal cannot be completed.
- If all 6 keep delivering, Fresh Catch exists nowhere.

The only way out is for the player to work out, unprompted, that they must take their best Wardens off duty. The players who did best are the ones who get stuck, in the chapter that carries the USP.

**Fix:**

- In Life 8, **no district delivers to the Doorstep**. Every morning the Doorstep is empty. That is a staging beat Narrative will want: the pile stops.
- A Warden with Loyalty ≥ 60 instead **keeps the district's Tribute fresh**:
  - The district's stored Tribute is held at the Den for up to 5 days.
  - It does not spoil.
  - It can be picked up as Fresh Catch at the Den.
- Patches without such a Warden keep the draft's 3-day store.
- Add an acceptance criterion: with all six Wardens Sworn, the Life 8 goal completes.

### 2. MAJOR: `rounds` is a timer, charges the player for going home, and has a wipe exploit (§4.3, §6)

- **It is a session timer.** Tribute is scaled by `min(1, roam_minutes/10)`. The anti-pillar says "NOT a timed strategy game". A player who Sprays every post in 6 efficient minutes is paid 60%.
- **It fights Pillar 2.** "Sleeping at home ends the day at any time" (brief §5.2), and every day the player chooses when to go home. A player who answers a morning vignette early is paid half. The economy charges for exactly the behaviour the core fantasy asks for ("still comes running when one particular human calls").
- **It has a wipe exploit.** §4.3 and §6 force `rounds = 1.0` on a Posse wipe. Recipe: walk out, Rub Low Wall Corner, lose to the first Tough, and the day ends on full pay. Steady state at the end of Life 7 is about 582 net in about 3 real minutes, roughly **194 Morsels per minute against 48 for a full day**. The costs are trivial:
  - Loyalty −3 per Posse cat, which Share a Meal repairs.
  - A Rival is promoted.
  - Clout −5, but rank cannot drop.
- **It prevents little.** Without `rounds`, the harm from sleep-skipping is already bounded by `seen`, provided Issue 3 is fixed.

**Fix:**

- Delete `rounds`.
- Keep `seen` as the only presence rule. With Issue 3's numbers, a sleep-skipper is paid 2 full days, then 0.8, 0.6, 0.4 and 0.2, then nothing: 4 days' Tribute in total, while upkeep keeps draining.
- Delete the wipe forcing rule (it has nothing left to force).

### 3. MAJOR: Idling is viable in the late game, and the doc's own acceptance criterion fails (§4.3, §5.5, §13)

The §5.5 verdict, "pure idle (D, E) is not viable", uses `seen_floor = 0.4`. But every Warden is at Loyalty 60 or more by Crew's appointment rule, so every claimed district runs on the **0.7 floor with a 0.10 step**. On top of that, a Watched Patch inside a Full House nets **+3 Scent a night** (decay 10, Sentry 10, Warden 3), so the late-game empire keeps itself Pungent with nobody visiting.

Strategy E′, end of Life 7: walk to Low Wall Corner, Spray and Rub it (Hidamari is then `seen`), wander for 10 roaming minutes, go home. About 11 real minutes.

| Day | `seen`, other districts | Tribute | Net (upkeep 276) | Morsels per real minute |
|---|---|---|---|---|
| 1–2 | 1.0 | 1,200 | 924 | 84 |
| 3 | 0.9 | 1,086 | 810 | 74 |
| 5 onward | 0.7 (floor) | 858 | **582, indefinitely** | **53** (full day A: 48) |

The §13 criterion ("E earns less on day 7 than 35% of day-1 Tribute") fails: E′ earns 72%. Raids erode this slowly at best, because Nemesis caps requests at 2 town-wide and a full town has few raid vectors (§6, "holds all 30").

**Fix:**

- Set `seen_floor` to 0 and `seen_step` to 0.20.
- A Warden with Loyalty ≥ 60 gives **+1 grace day** instead of a higher floor. Keep the Heights bonus at +1 more.
- Re-run E′. Target: steady-state Tribute 0 by day 8; every district you have not marked in 3–4 days pays nothing.

### 4. MAJOR: The whole-economy sink picture is unreconciled, so the Life 7 surplus is undetermined (§4.9, §5.3, cross-doc)

This doc prices one feeding verb. Crew prices another for the same purpose:

- Territory **Treat**: `5 + level` per cat per day. §5.3 assumes almost nobody uses it, about 35 a day in Life 7.
- Crew **Share a Meal**: `2 × level` per cat per day, +3 Loyalty.
- Nemesis **Share a Morsel** for Humbled residents: price left to this doc and never set.

What the model gives:

| Player | Life 7 outcome | Enters Life 8 with |
|---|---|---|
| Reference (draft) | Stash 4,520, nothing spoils | 4,520 |
| Optimiser, no meals (Tribute ×1.3, see Issue 9; finite sinks bought a Life early) | 6,000 cap reached around Life 7 day 5; **about 5,000 Morsels rot** | 6,000 |
| Optimiser feeding half the Crew at Crew's price | Lives 5–6 in **deficit**; about 2,500 left in Life 7 | about 2,500 |
| Casual (never buys Crate Stack, cap 400) | **About 8,300 rotted by the end of Life 7** | 400 |

So "the Life 7 surplus is intended" (§5.3) is true only for the one play pattern the draft assumed.

Two more gaps:

- Recruit offerings come from **carried** Morsels (Crew §3.4 A2), but this doc auto-Stashes everything at the garden and defines no way to take Morsels back out. A Lv 40 Captain costs 640 fair, or 1,280 as a feast, so recruiting an expensive cat depends on that day's field haul.
- There are two recruit price formulas and two Lesson price tables (see §4 of this review).

**Fix:**

- One price sheet, owned here: delete Treat and adopt Crew's Share a Meal at **`level`** Morsels per cat. This is the designed late sink, and it also turns food into Loyalty, which Life 8 cares about ("feeding your Crew in the good years is why they stay in the bad"). Set Share a Morsel at `level` as well.
- Add a **Pack Lunch** at the Lot: choose an amount to carry out. It is exposed to the canon 20% wipe loss, which gives that canon rule some teeth.
- Then rebuild §5.3 with all three docs' sinks. Target: Stash 3,000–6,000 at the end of Life 7 for the reference player, and no spoilage beyond 15% for the casual.

### 5. MAJOR: The Life 8 Offerings undercut the gesture they exist for (§3.13 D, §4.9 Gifts)

- **Picking from the Stash beats carrying.** A Feast from the Stash (1,000 value, collected under the veranda 5 m from the door) is worth three to ten Fresh Catches. The richest Patch, Auction Shed at Clear Scent, gives 3 × 80 = 240. An optimiser reaches the 4,000 bowl threshold with 4 Stash Feasts in 2 days and never carries a fish across town. "Carry one piece of food in the mouth" worth 1,000 Morsels is also absurd as an image.
- **The thresholds are Morsel-based,** so the emotional centre of the game becomes an optimisation problem. §15 #12 saw this coming.
- **Food Gifts in Lives 1–7** (`8 × life_index`, carried into the house) pre-empt the inversion: Mikan has been carrying food home since Life 1, so Life 8 adds nothing new.
- **The casual reaches Life 8 with 400 in the Stash** (Issue 4), so the brief's "the Tribute that has piled up pointlessly all game finally has a use" misses the player who most needs the payoff to be automatic.

**Fix:**

- Offerings count, they are not valued. Each placed Offering is one, whatever its kind.
- The bowl returns on alternate evenings after 3 Offering days and every evening after 6. The thresholds are hidden.
- Cut the Small / Fine / Feast picker. A Stash Offering is "one fish from the pile", at most **one per day**. This is the pile's canon "use", and it guarantees every player one gesture a day.
- The other two daily Offerings must come from the street (Scrap or Fresh Catch).
- Food never enters the house before Life 8. Lives 1–7 Gifts become free Critter trophies (a beetle, a cicada shell) that Haru recoils from. That decision belongs to Narrative; see §5.
- Run the Life 7 Stash through spoilage on the Doorstep, so a casual still sees a pile, without making Life 8 depend on its size.

### 6. MAJOR: Guard assignment means filling every slot, with no real decision in it (§3.6, §4.5, cross-doc)

- **Posting is strictly dominant.** Crew F4 gives a posted cat about half a level per night (915 XP against 1,920 needed at Lv 18). Lounging gives 25% gossip and −1 Loyalty a day. There are 27 posts for 24 Crew. Nobody is ever benched, so the only choice is which cat goes on which wall.
- **That choice is a static puzzle.** Raids take the lowest-defence Patch first (intake rule 7), so the optimal answer is to spread defence evenly. Solve it once and it stays solved.
- **Upkeep does not create the "real choice" §4.5 claims.** A guard costs about 7–19 Morsels a night against 40–100 Tribute a Patch, and Feast costs only another 200–360 a day out of a surplus. Rations is a dial with an obvious setting, and Crew F8 does not read its Loyalty input.
- **The one thing that would make posting interesting is gated.** Forecasts are locked behind a Prowler Sentry, the Tsukimi Claim Bonus, or Truck-Roof II, even though Nemesis guarantees that "a raid is always discoverable the day before".

**Smallest surface that still delivers "organise cats to guard your territory and get paid in food":**

1. The Turf Board at the Lot: drag a portrait onto a Patch blob.
2. The Morning Sniff names **tonight's raid targets and raiders**, always.
3. The Doorstep pile.

The daily decision is then: read the Sniff, move zero to two cats ("Ikari's lot hit the net racks tonight, so put Buri there"). Style roles stay automatic.

**Fix:**

- Forecasts always on: the Morning Sniff names tonight's targets, matching Nemesis.
- Give the Prowler role a new effect: raiders arrive Ruffled in a live defence, and the post's Caterwaul window is ×1.5.
- Cut Rations.
- Make upkeep flat per post (`2 × district_index`), paid automatically, with Short Rations when the Stash is empty.
- Merge the Warden into the Den's first Sentry slot.
- Delete the "stronger guard costs more" sentence.

### 7. MAJOR: Raids nag through re-siege cost and can re-lock a Den during a multi-day siege (§3.4, §3.5, §4.6)

Odds against two grudge Toughs (the script's §4):

| Patch | R | Lost |
|---|---|---|
| Unwatched under a Warden, Scent 70 | 0.57 | **85%** |
| Watched, plain Sentry (Loyalty 60), Warden, Scent 80 | 1.06 | **45%** |
| Vigil: Watched, Short Rations, Scent 40 | 0.75 | 70% |

At Nemesis's rate (an intent weight of `2 + G/50` per Rival with Grudge ≥ 40, plus boss orders every 3 nights, capped at 2 a night), expect about 1 admitted raid a night. That means **0.45–0.85 Patches lost per night** whenever any Unwatched Patch exists, above the draft's 0.3–0.6 target.

Each retake is a full 3–6 minute siege: erosion, waves, Standoff. The casual, who holds the most Unwatched ground, spends a third of a session redoing yesterday.

Worse, a casual taking a Den over two days can have the Den **re-locked** overnight when one of their 3 fresh, unguarded outer Patches falls. That is a progression treadmill on the critical path.

**Fix:**

- **A raid can only take a Patch that is below Strong** (Scent < 60). On a Strong Patch a Lost result becomes Scuffed (−20). This is one readable rule: "it fell because it smelled faint". It gives a visible warning night first, and makes Scent the Patch's health bar.
- **Retake = revenge:** a Patch in Stale Claim skips erosion and waves. Entering it triggers a Standoff with the raid leader. Pillar 4 content in 60–90 s.
- While a district's Den is Open, its held outer Patches cannot be Lost.

### 8. MAJOR: Marking on your own ground becomes a checklist; Spraying stops meaning anything by the 100th time (§3.3, §4.1)

Your own Rub is worth +5, and each Rub Mark can be used once a day. Rubbing both marks on a Patch (+10) exactly cancels base decay (10), so the optimiser's best line is a daily walk past 60 Rub Marks that **does a Sentry's job by hand**: the checklist anti-pillar, built in.

Spraying your own Strong post (+40, capped at 100) is mostly wasted. The Scent change is invisible, because bands are wisps and the decay happens off-screen at night.

Contest verbs (Over-mark, Counter-Spray, Claim Spray) are the fun part, and the Splatoon comparison in §10 only holds for them. Nobody repaints their own turf in Splatoon.

**Fix:**

- Your own Rub gives **no Scent**. It counts only as a `seen` visit, and it can be done in passing.
- Your own Spray prompt **only appears when that post is below Strong**. It sets Scent to 90 at once, with a visible reaction: the Sentry chirps, any rival in view flinches.
- Every Spray is then a rescue or a conquest. Each Claim Spray still pops.

### 9. MAJOR: Tribute anchors are met only by a reference player who leaves easy multipliers unclaimed (§5.2)

- **§5.2 uses the wrong Sentry counts.** It uses 9 Sentries at Big Whisker, but the Clout table gives 12. It also lists Boss / 8 Crew / 3 Sentries, where the table gives 10 and 5.
- **"Typical upgrades about +10%" understates.** Full House alone is +10%, and Watched Patches in a Full House rise to Pungent (×1.1) on their own.
- **The optimiser lands far above canon.** With Full House, Settled and an average of +0.15 from Humbled residents, Scroungers and Larders, the result is **about 1,640 at the end of Life 7 and about 1,690 at Great Boss**, against canon 1,200: +37%. Every downstream table inherits this.

**Fix:**

- Cut `bonus_sum` to `upgrade + humbled + full_house`, with Larder, Scrounger and weather removed (see the cut list), and clamp it to +0.3.
- Cut the band multipliers to 0.6 / 0.9 / 1.0 / 1.0 (Pungent no longer pays extra).
- Then scale `base_yield` so that the **optimiser** lands at 1,200 ±10%. The reference player will sit about 15% under, which suits "Tribute funds choices".

### 10. MINOR: smaller problems

1. **Clout points never bind** (§15 #15). Gate on milestones only, and delete the points and §4.7.
2. **Crate Stack IV** is gated in §3.11 but does not exist in §3.12. Its tiers I–III already reach 6,000. Fix the gate names.
3. **§5.4, hour 26:** the Stash should read 2,120.
4. **"Lookout"** names both a Sentry role and a Specialisation. Specialisations are cut (see the cut list), which resolves it.
5. **Skim is dead before Life 8.** The Symmetry rule plus a 3-Patch periphery means Dens are almost never lost, so nothing is ever Usurped. Cut it.
6. **Strategy E is ambiguous.** Does the garden count as roaming? The brief pauses the clock "inside Haru's House". Moot once `rounds` is deleted.
7. **Vigil ordering is unspecified.** Is the Den protection for a Warden with Loyalty ≥ 60 checked before or after the Crew absence drain each night? Specify: before step 1, each night.
8. **Expected Vigil survivors** (answering §15 #11), with Great Boss posting:
   - Watched Patches end at Scent 32 (Clear).
   - Unwatched Patches lapse on night 4.
   - Hidamari Watched Patches end at 92, Unwatched at 52.
   - Nemesis's Life 8 cap of 4 requests a night, against a loss cap of 3, allows up to 12 raid losses.
   - So about 12–18 of 30 Patches survive with loyal Wardens, and 6–10 without.

   Write that target into the doc.
9. **Share a Morsel has no price.** Nemesis asked for one. Set it at `level` Morsels (see Issue 4).
10. **The return of `loot_held`** (Nemesis Snatch) is unanswered. Rule: Routing the thief returns it in full as carried Morsels.

## 4. Cross-doc conflicts

| # | This doc | Other doc | Resolution |
|---|---|---|---|
| X1 | Crew cap by rank 6/7/8/10/13/18/24 (§3.11) | Crew §3.5: "6 / 8 / 10 / 13 / 16 / 20 / 24" | Territory owns it. Adopt Crew's curve, which is smoother, so the middle Lives have the cats they need. Re-derive the Sentry caps as cap − 3 − Wardens. |
| X2 | `recruit_offering = 4 × level × rank_mult(1/1.5/3) × (1 + grudge/100)` | Crew F6: `ask = 8 × L × (0.75/1/2/4)`; half / fair / feast 2×; 75% returned on refusal | Adopt Crew F6 (its Willingness maths is built on it) and delete the §4.9 line. Grudge already lowers Willingness; pricing it again double-counts. |
| X3 | Lessons: 6 tiers, 40/90/180/360/750/1,500; Shinies 0,0,0,1,2,4; Knack ×1.5 | Crew F9: 4 Ranks, 40/150/450/1,000 × 1.5 cross-Style; Shinies III-cross 1, IV 2/3; Knacks flat 300 / 600 + 2 S; Elders 600 + 4 S | Adopt Crew's structure, which has both canon endpoints. Territory confirms it, and §4.12's Lesson Shiny budget of 60 drops to Crew's 35–45. Rebalance against the Lot and Established Shiny sinks (60). |
| X4 | Treat `5 + level` (§4.9) | Crew §3.6: Share a Meal `2 × level`, +3 Loyalty | One verb: Share a Meal at `level` (Issue 4). |
| X5 | Loyalty inputs `rations`, `nights_since_boss_visit`, `feature`, `hangout`, `lot_comfort` (§3.6, §3.8, §3.12) | Crew F8 reads none of them | Every Loyalty effect of Rations, the Sunspot "cushy post", Hangout and Cushion Pile II is currently dead. Cut them (cut list) rather than add terms to F8. |
| X6 | Raid intake cap `1 + floor(held/10)`, 1–4 a night | Nemesis R9.8: "capped at 1 per district per night and 2 town-wide (4 in Life 8)" | Use the Nemesis caps as the request budget. Territory keeps only the admissibility rules (immunity, no two nights running, Home Ground, Den symmetry). |
| X7 | Motives `grudge, comeback, uprising, squat` | Nemesis: `boss_orders, grudge, gloat, uprising, pretender` | Adopt Nemesis's list. Add `motive_mod`: boss_orders 1.10, gloat 1.0, pretender 1.10. `squat` is a Territory outcome, not a motive. |
| X8 | Forecasts only from a Prowler, Lantern Eyes or Truck-Roof II | Nemesis: "a raid is always discoverable the day before" (plus an acceptance criterion) | Forecasts always on (Issue 6). Re-purpose the three unlocks. |
| X9 | Shinies: a fixed 120 table (§4.12) | Nemesis proposes extra Shinies for Collectors, a first Clean Duel win, and Nemesis status | Nemesis sources come out of the "Nemeses, first Rout, capped at 15" line. The total stays 120. |
| X10 | Life 8 deliveries gated at Warden Loyalty ≥ 60 | Crew: True (60+) is the minimum for a Warden; Sworn are immune to the absence drain | This is Issue 1. No deliveries in Life 8. |
| X11 | "Offering" means the Life 8 food gift | Crew uses "Offering" for the recruit payment | Rename Crew's to **Bribe** in player-facing text. The brief's lower-case "recruit offering" allows it. Keep Offering for Life 8. |
| X12 | "Settled" is upgrade level 1 | Nemesis: a Humbled cat that fails twice becomes "Settled" | Rename the upgrade to **Claimed-In**. |
| X13 | No eligibility rules for posting | Crew: Shifty cats may not take Den Sentry or Warden posts; True needed for a Warden | Adopt them in §3.6 as hard rules, shown greyed out on the Turf Board. |
| X14 | No "patch level" defined | Crew A-16 / Turf XP reads `patch_level` | Define `patch_level` = the district band midpoint (4/12/20/28/36/44). |

## 5. Needs director ruling

1. **Is the Life 7 emptiness the point?** The draft says yes. I recommend no: make Share a Meal the late sink, and let the pile's meaning come from Life 8, not from boredom in Life 7. An economy that has to be broken for 4–6 hours to set up a beat is a poor trade (brief risk 5).
2. **Are Offerings mechanical or expressive?** I recommend count-based with hidden thresholds (Issue 5): the bowl comes back because you kept coming home with food, not because you deposited 4,000.
3. **Can food enter the house before Life 8?** I recommend no. Narrative owns what the Lives 1–7 Gifts become.
4. **Delete `rounds`.** This touches the "NOT timed" anti-pillar and Pillar 2, so the director should confirm it.
5. **The empty Doorstep in Life 8** as a staging beat. It needs Narrative's agreement.

## 6. Cut list

- **`rounds`**, and the rule that forces it on a wipe (Issue 2).
- **Skim**: dead before Life 8 (10.5).
- **Rations dial and Treats** (Issues 4 and 6). Flat upkeep; Crew's Share a Meal.
- **Specialisations** (Larder, Lookout, Hangout) and the Established tier. Keep a single upgrade level, which removes 36 Shinies of sink. Move those Shinies to Crew's Rank IV and Elder Lessons.
- **Lot upgrades:** cut Dry Crate (spoilage is the point), Fish Bucket (upkeep is flat) and Truck-Roof Lookout (forecasts are always on). Keep Crate Stack and Cushion Pile I.
- **Claim Bonuses that buff cut rules:** Full Nets (upkeep), Rust Runners' Road (Skim), Top of the Hill (`seen` grace). Replace them with one Caterwaul or traversal perk each, or leave those districts with Full House only.
- **Your own Rubs as Scent** (Issue 8).
- **Clout points** (10.1).
- **`bonus_sum` terms:** Larder, Scrounger (give Trickster Sentries a defence role instead), weather. Also cut the effects of weather on Tribute and Feeders entirely. Weather is unowned (§15 #17), and its interaction with story-forced rain is unfair.
- **The Offering size picker and the Morsel thresholds** (Issue 5).
- **Food Gifts in Lives 1–7** (Issue 5).
- **The Warden as a separate post**: merge it into the Den's first Sentry slot (Issue 6).

After these cuts the Morning Sniff has to explain only band, Watched, `seen`, Full House and Humbled residents. That fits the icon budget §15 #8 worries about.

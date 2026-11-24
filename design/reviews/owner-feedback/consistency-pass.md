# Consistency Pass: Owner Feedback, Iteration 2 (2026-11-24)

*Owner: creative-director · Status: **binding**; the last pass before the docs are compiled · Settles the revisers' follow-ups F1–F12 (`follow-ups.md`) on top of `design/reviews/owner-feedback-rulings.md` (OR-01…OR-21) · Patent guardrails: `design/legal/nemesis-patent-analysis.md` v2 §5. Working rule: **nothing Mikan does to one cat may change a different cat.** · Canon recorded in `design/creative-brief.md` **v1.6***

**Canon order from today:** owner comments C1–C5 → OR-01…OR-21 → **this pass (F1–F12)** → brief v1.6 → system docs. Where an OR's pacing note disagrees with a ruling here (OR-09's "window on L2D4"), this pass wins.

Nothing here is a legal conclusion. Counsel review still blocks scope lock and any public showing.

---

## 1. The two design problems

### F11 · Togemaru's arc rarely completed → every Verdict on him is an ending

**The problem.** After Chase Off became final and Humble was cut, "arc achieved" (≥ 3 encounters + ≥ 1 mark + a resolved state) fell to 0 / 0 / 5 / 15 / 41% (chase / recruit / mixed / pacifist / lose40). A Nose-Touched Togemaru reached his 3rd encounter only through a join-in, so 86% of his Declarations waited for the deadline. Chase-first and Recruit-first players were told their arc was "unachieved". That was a definition problem, not an experience problem: those players got a remembered rival, a choice and a consequence.

**Ruling (three small parts, all on Togemaru's own record):**
1. **Arc achieved = he has cited his memory (≥ 2 encounters) + ≥ 1 mark + an ending: any Verdict on him, or the Declaration.** Each Verdict is a whole ending:
   - **Chase Off:** gone, with his farewell line ("Fine! I've got other walls. Better walls!"), the "Run out of town" card and his legend card.
   - **Recruit:** he joins ("Wears the bell now"), and his story goes on in the Posse: he stares his old boss down in the Daifuku fight.
   - **Nose-Touch:** a truce that his daily greeting and any join-in carry; declared a Sworn Rival; the rematch when the truce ends.
2. **His first Rout by the Posse always leaves a Scar** (authored, like his fixed starting Grudge). Every player who Routs him has marked him.
3. **A truce greeting (`TRUCE_GREET`) counts as an encounter.** It is already a Standoff-group meeting. At most one counted meeting a day, so a join-in on a greeting day adds no second.

The owner's final Chase Off and the three-option Verdict are untouched. *Patent:* all three parts change only Togemaru (v2 §3.5: outside every independent claim). *Docs:* nemesis §3.6–3.8, §3.16, F7, §5, §8 AC 17, A-10 closed; brief §3.1; key-screens §7.6.

### F12 · Nose-Touch was nearly free → a loud take closes it

**The problem.** The deterministic gate (pending Grudge < 50 + shift) was open on 91–100% of slice Verdicts, because slice Grudge stays low. A free, always-open, upside-only option is not a choice.

**Options weighed:**
- *A clean fight (no Ambush opener, no Fear prop)*: rejected. Daifuku's fight is built on "knock him off into the bucket" (his Fear is Water), so the owner's main Nose-Touch case, the Boss stepping down, would almost never be available.
- *The rival's Regard earned in the fight*: rejected. Slice Regard is small and flat, so the threshold would be either always met or never.
- **A quiet take**: adopted. It reuses the sneak-versus-loud choice Territory and Boss anger already teach.

**Ruling.** From Life 2 (with the unlock ladder), Nose-Touch also needs a **quiet take**:
- **A Keeper** will not touch noses after **≥ 2 Counter-Sprays on its own post** in this contest. The quiet take (two unseen Over-marks, one Counter-Spray) keeps the card; the loud take (two Counter-Sprays) is faster and closes it.
- **A Boss** will not touch noses if he came to the fight **Seething or Furious** (anger read at the Standoff). The steam puffs already show it.
- Other cats (wave cats, Roamers, challengers) have no post in the contest: only the Grudge gate applies.
- **Life 1 is exempt**, so the first Verdict (Togemaru, L1D2) keeps all three cards and the showcase's Nose-Touch branch is safe.
- The halftoned card names its reason: "Tail lashing. Not today." (Grudge) · "Too much of your stink on its post." (loud take) · "Still steaming. Not today." (Boss). The first time, one hint: "Spray quietly to make peace."

`open = G_pending < 50 + shift ∧ ¬loud` · `loud = life ≥ 2 ∧ ((keeper ∧ n_counter_own ≥ 2) ∨ (boss ∧ anger_stage_at_standoff ≥ Seething))`

*Patent:* the gate reads only the cat's own Grudge, acts on its own post (objects) and its own anger (G2, G8). *Docs:* nemesis F4, §3.11, §3.14, §5, §7, §8 AC 30; territory §3.3–3.4; crew §3.3; key-screens §4.2, §7.4; brief §3.3, §7, §8.

### Sim before → after (`sim/nemesis_slice_sim.py`, 500 seeds × 5 policies × 7 days; 300 × 30 days)

The default run now carries F11/F12; `--or-pass` reproduces the revisers' run exactly (`nemesis_slice_sim.or-pass.out.txt`). The marking model is unchanged: quiet, typical and loud cycle by seed, and a typical player's extra Counter-Spray (50% of contests) lands on the contested post. Daifuku's Den, which cannot be marked, no longer gets the Keeper-mark Grudge row (a sim correction).

| Measure (slice) | Before (OR pass) | After (this pass) |
|---|---|---|
| Arc achieved, chase / recruit / mixed / pacifist / lose40 | 0 / 0 / 5 / 15 / 41% | **100 / 100 / 100 / 100 / 100%** |
| Mean encounters with Togemaru at slice end | 2.0 / 2.0 / 2.1 / 2.3 / 2.5 | 2.0 / 2.0 / **3.8 / 7.0** / 3.0 |
| Declared (share; night median; at the deadline) | mixed 37%, n5, 86% · pacifist 100%, n5, 86% · lose40 29%, n5, 78% | mixed 37%, **n3, 0%** · pacifist 100%, **n3, 0%** · lose40 29%, n4, 19% |
| Nose-Touch gate open: Life 1 / Life 2 / Daifuku | 100 / 100 / 100% (lose40 Life 2: 90%) | 100 / **82 / 81%** (lose40 Life 2: 71%) |
| Verdict shares, mixed (chase / recruit / nose) | 49 / 7 / 43 | **55 / 8 / 37** |
| Verdict shares, pacifist | 0 / 0 / 100 | 8 / 7 / 85 |
| Join-ins (mean; runs with ≥ 1), pacifist / mixed | 0.38 (34%) / 0.18 (17%) | 0.37 (34%) / 0.17 (16%) |
| Invariant: cats other than participants changed | 0 in ≈ 51,300 checks | 0 in ≈ 51,300 checks (self-test still catches re-injected loss promotion 623× and Stewing 83×) |
| Arc achieved, 30 days | 0 / 0 / 36 / 100 / 55% | 100% every policy |

Unchanged: the Life 1 memory line (100%), one Nemesis record (100%), anger by style, challengers (0.98 per slice, night 5), AC 16 join-ins (34% ≥ 25%). Nose-Touch still never exceeds 60% except under the pure-pacifist policy, which is AC 4's playtest question.

---

## 2. Rulings F1–F10

| # | Ruling | Applied in |
|---|---|---|
| **F1** Bribe tiers | **Adopt Crew's cut.** Life 1 recruits are free (PP-07 teaching); from Life 2 a Recruit costs **Fair or Feast**, and there is no "none" tier. If the Stash cannot cover Fair, Recruit is greyed and Chase Off is always open. This is the owner's "Recruit for a bribe" | brief §3.3; crew F8 (`bribe_none` deleted), assumption 1 closed; territory, key-screens already matched |
| **F2** Story doc's wipe | **Night, not Dusk.** `dual-story-progression.md` §3.6 rewritten as the **Routed Evening** (OR-01/02): the clock jumps to Night, the street closes, Haru is home and waiting, the plaster beat, Keystones Late, Closings wait, only the victor cites the plaster | narrative §3.6, §5 (L1D1, L1D2, L2D2 wipes), §8, Revision Log |
| **F3** Challenger's first day | **Night 5, announced in the L2D4 Sniff.** One count for every doc: night *n* is the Night Shuffle that ends day *n* (day 3 = L2D1, day 5 = L2D3). Mikan first holds 3 Lane Patches on night 3, so first = 3 + 2 = 5 | nemesis F12 (definition); day-loop §3.9 (hedge removed), Backlog; brief §5.3, §8 |
| **F4** Reviser decisions | **Both confirmed.** (a) Soggy *pauses* anger's Fired Up: the dunk still pays and the stages stay readable. (b) K1.3's Late form **keeps the Call**: PP-06 (the first Call is never lost) survives OR-01 | combat A5; day-loop assumption 6, §3.6; narrative §3.6, §5 |
| **F5** The L2D4 loss | **A budgeted branch, never scripted.** Day Loop's L2D4 stays the budget's long case, but nothing forces a wipe (the combat sim's median Posse wins). The browser showcase stages the loss on purpose (the optional Daifuku bout, rulings §2 item 6). In the slice the loss rule teaches itself the first time it happens | day-loop §3.6, §3.9, §3.10; key-screens §7.4 |
| **F6** UX open items | **A-5 confirmed:** Pause ▸ Rivals on the street (the closed street included) and at the Lot, never at home. **A-6 confirmed:** the L2D1 Turf Board tab is an unprompted ≤ 15 s look (bar and crown, no pegs) inside L2D1's Lot time | key-screens §8; day-loop §3.9 |
| **F7** Boss window day | **L2D3, at the Tofu Shop Step Claim Spray.** A player who answered the L2D2 raid at Persimmon Alley holds the other three outer posts Strong, so Kagi's post fills the bar (Territory sim: 100% of engaged runs). Daifuku climbs to his Day stop, the wall above that post, **in view, on the running clock, control kept**, so L2D3's real minutes do not grow. Fighting him that day is optional and unbudgeted. **The first attempt is L2D4**, beside the challenger. A player who let a post fade opens it on L2D4 morning instead (the same rule, a day later) | territory §3.5, §3.12, §6 note 7 (worked examples relabelled); day-loop §3.5, §3.9–3.11, §5; key-screens §7.4, §2.3; nemesis §3.14, §3.16; hud §5.3; brief §3.2, §10 |
| **F8** `MarkApplied` | **Adopted:** `MarkApplied(patch_id, district_id, kind ∈ {over_mark, counter_spray, claim_spray, rescue_spray}, target_clowder)`, Territory → Nemesis (anger; the F12 count) and Audio. Replaces Nemesis's `MarkingAct` | brief §6.1; nemesis §6.1; territory §3.3, §6 note 8 |
| **F9** Deferred items landed? | **Challenger visuals: landed** (key-screens §2.4, §2.8, §5.4, §5.6; hud §3.1–3.2, §5.3). **Betrayal thresholds and the Wavering UI: landed** (crew §3.7.4, F11; key-screens §5.4, §5.6). **Betrayal rate: not simulated by anyone.** Bounded analytically: the earliest defection is Life 2 night 13 for a neglected Togemaru and impossible for Kagi inside the slice, so AC-23 holds at 0% / 0% in the slice. The owner's "(rare)" holds; the measured rate stays owed (§5) | crew F11 example re-derived, Revision Log |
| **F10** Posting stakes | **Accepted.** +24% slice / +33% raid nights (from +34% / +45%) is still a real decision once fights stopped moving Scent. Watch the "stand out" score in playtest; no change | territory Revision Log |

---

## 3. Contradictions found and fixed

| # | Doc · section | Before | After |
|---|---|---|---|
| 1 | brief §3.3 Bribe | "none / fair / feast" | Free in Life 1; Fair or Feast from Life 2 (F1) |
| 2 | crew F8 | `bribe_none = 0`; output "0 (none, or Life 1)" | No none tier; 0 only in Life 1 |
| 3 | narrative §3.6 | A wipe jumps to **Dusk**; the evening plays as usual | The Routed Evening at **Night** (F2) |
| 4 | narrative §5 | "Wipe on L1 day 1 before Dusk: the clock jumps to Dusk" | Nightfall, then K1.3's Late form with the Call; rows added for L1D2 and L2D2 wipes |
| 5 | narrative §3.4 slice end, §5 | Life ends after "Daifuku Routed" | After the Lane is **claimed** (the Den post Claim Sprayed, OR-09) |
| 6 | narrative §5, §8 | "the Fence Line reacts" / "never shown in the house" | The Rivals board |
| 7 | day-loop §3.9 | Challenger "L2D4, or L2D3 if Nemesis counts differently; both fit" | Night 5, the L2D4 Sniff (F3) |
| 8 | day-loop §3.9–3.11, key-screens §7.4, nemesis §3.16 vs territory §3.5 | Window on L2D4 after rescue Sprays vs on L2D3 at the TSS Claim Spray (100% in Territory's sim) | L2D3 everywhere; first attempt L2D4 (F7) |
| 9 | day-loop §3.9, §3.10 | "On the reference path the attempt is lost… taught by living it once" | A budgeted loss branch, never scripted (F5) |
| 10 | nemesis §6.1 · territory §3.3 · brief §6.1 | `MarkingAct` vs "proposed" `MarkApplied` vs absent | `MarkApplied` in all three (F8) |
| 11 | nemesis §3.13 vs hud §5.3 | Sniff priority: Wavering 5th vs 1st; Declaration 1st vs 4th | One order: Wavering > Declaration/arc closing > challenger > Boss window > anger > arc lead > town events (hud wireframe re-ordered; brief §5.3) |
| 12 | nemesis §3.7, §3.16; key-screens §7.6 | A day-2 Chase Off / Recruit = "2 encounters, unachieved" | A complete ending (F11) |
| 13 | day-loop §3.9, §6 ("Declaration card on L2D2 at the median") vs nemesis sim | Truce Declaration median night 5 (the L2D4 Sniff) | Night 3, the L2D2 Sniff (the greeting counts, F11) |
| 14 | crew F6, §3.3, F11 vs nemesis F1 | Togemaru's starting Loyalty 36 from G_pre 55 (round-3 Grudge path) | G_pre 43, Regard 23 → **44** (Aloof); the neglect example's defection moves from night 9 to Life 2 night 13 |
| 15 | key-screens §7.3 vs day-loop §3.9; nemesis AC 1 | Memory line 0:32, K1.4 0:52–0:57; "expected ≈ minute 33" | Aligned to Day Loop: memory line ≈ 0:28, K1.4 0:40–0:45 (Backlog lines closed in both docs) |
| 16 | territory §6 Turf Board rule 3 vs key-screens §5.4 | Odds bar "with percentages" vs "no numbers" | Three segments sized by the odds, no percentages (UX owns the screen) |
| 17 | territory §4.15 vs nemesis F12 | `N3` read at "step 3" vs `h` at "step 2" | Step 2 |
| 18 | nemesis Backlog NS-C8 vs crew §3.4 | "Comes Knocking" kept as Backlog vs cut | Cut: a fourth recruit route would contradict C4 |
| 19 | brief §3.5 vs nemesis §3.4 | Goofball "easy to Recruit" | "Easy to Nose-Touch (gate +10)" |
| 20 | brief §11 | Q12–16 still listed as open | Settled by the owner's answers (rulings §5) |
| 21 | key-screens §2.3 | Wireframe "Life 2 day 3, Dusk" with Daifuku on his gatepost (impossible after F7) | "Life 2 day 2, Dusk; before the window opens" |
| 22 | territory §3.2.2, §4.14 | The OR-08 worked example (PA 48 on L2D3) read as the reference, against the doc's own sim trace (PA 77) | Relabelled "a player who let Persimmon Alley fade" |
| 23 | combat A5; key-screens A-5, A-6; day-loop assumption 6 | Pending creative-director review | Confirmed (F4, F6) |

**Swept and found consistent** (no edit needed): the three Verdicts and their consequences; recruitment routes (the Verdict, two story beats, the Friend Stray); betrayal eligibility (posted ex-Rival recruits from Life 2, < 30 / Schemer < 35, never Home Ground or the Den, 2 warning mornings); influence (0–100, 25 per Strong outer Patch, −10 a night, open at 100, close below 75 at step 2); challenger cadence (h + 2, then every 4th night, ≤ 1 active, Repelled twice → Gone); loss consequences (no promotion, Mark Over or Snatch; −20% haul; Tribute and Stash safe); Boss anger (+5 / +15, −15 a night, 20 s / 40 s / whole fight, spent on win, loss or `rival_fled`, not Scram); Cowed (20 s, Fraidy 30 s, Sworn resist, cleared by a Tag-In); the 10-day truce and join-in p 0.35–0.65; discovery (encounter, 1.0 s sniff within 10 m, Crew) and tags; the four-zone Turf Board.

---

## 4. The owner's comments: delivered?

| Comment | Verdict | Evidence, and anything not yet there |
|---|---|---|
| **C1** Rivals that remember | **DELIVERED** (with the owner-accepted substitution) | The Rivals board: every unique cat, silhouettes until discovered, hover tags only between discovered cats (Boss/Gang, Rival, Kin, Old Boss/Old Gang). Boss anger as steam puffs, with a Fired Up buff spent after the next real fight, win or lose. The boss's taunt at a defector is the recruit's own flinch (Old Gang Nerves); the owner accepted this pending counsel. Anger's sources are marking acts, not fights (patent G2); the owner's "something bad on its territory" reads as marking. Patent check done (v2, G1–G12) |
| **C2** You can lose | **DELIVERED** (after F2) | Day Loop §3.6, Combat, HUD §3.6, key-screens §4.6, and now Narrative §3.6: a wipe jumps to Night, the street closes, and home is the only way. No loss is scripted; it happens when you lose |
| **C3** District influence | **DELIVERED** | Fight to clear, spray to claim. The tug-of-war bar against the gang. Full influence brings the Boss down to roam (now on L2D3, at the moment the bar fills). Influence decays for everyone. Ground is taken back by raids, challengers, newcomers and, rarely, turncoats. *Watch:* the bar is on the Turf Board and the Sniff only (the street shows wisps); key-screens A-7, a street post strip, is the lever if playtesters lose track of it. Betrayal is ~0% inside the slice by construction, which is the owner's "rare" |
| **C4** The Verdict | **DELIVERED** (after F11, F12 and the Usurper rule) | Exactly three options. Recruit costs a Bribe from Life 2 (Life 1 is free as onboarding, PP-07: the one deliberate exception). Chase Off is final, now with a complete ending for Togemaru. Nose-Touch: a peaceful step-down, a 10-day truce and join-ins against the cat's own Rival, now a real choice (the quiet take). **Fixed this pass:** the owner's "new boss may appear, mainly when you lose influence" existed only as a Backlog line. It is now a written rule, **the Usurper** (Nemesis §3.20): a freshly generated Boss in a Boss-less district where Mikan's influence is below 25, who stakes the Den as a challenger. It is full-game: the slice ends at the claim, so it is unreachable there. Newcomers into lapsed Patches cover the slice's "new character … own that place" |
| **C5** The Turf Board | **DELIVERED** | Four zones, one decision, numbers in three places (previews redrawn). Challengers come to town on a calendar (one in the slice, about 7 in 30 days) and take the raid slot. OR-18 kept it lean. This pass removed one more inconsistency (the odds bar has no percentages) |

---

## 5. Left for the backlog

1. **Crew:** run the Lives 1–2 sim for AC-23 (betrayal rate) and AC-6 (pacing) under OR-01/02 and the fair-minimum Bribe. Deferred since the owner pass; the slice bound here is analytic.
2. **Playtest AC 4** with the quiet-take gate: Verdict shares, and whether testers can say why a Nose-Touch card closed. The sim's marking styles are not adaptive; a player who wants Nose-Touch can take quietly. If Nose-Touch still exceeds 60%, lower the gate base within 40–60.
3. **Usurper:** build and sim with Life 3 (Nemesis §3.20; Territory §3.7's Den admissibility exception).
4. **Audio:** the moon-blue Late form of K1.3 with the Call; Daifuku's yowl as an in-view, uninterrupted beat on L2D3.
5. **`production/artifact-slice/IMPLEMENTATION-PLAN.md`** (not in this pass's scope): its seeds stay showcase-only (challenger on L2D2, the snapshot influence 95). Branch A is safe (the quiet-take clause starts in Life 2). The optional Furious-Daifuku bout ends `rival_fled`, so no Verdict is offered.
6. **`design/GDD.md`** compile: carry brief v1.6 (F1, F3, F7, F8, F11, F12, the Usurper, the Sniff order) into §9, §10, §16–17.
7. **L2D3 budget:** still 24.9 typical with no slack. A paused reveal there would make it 25.1, so the reveal must stay in view.
8. **Counsel** (unchanged): review against `design/legal/claims/` before scope lock and any public showing. New items for the packet: the F12 gate (reads only the cat's own record, its own post and its own anger); the Usurper's "no Boss on the street" check (the same eligibility class as residual 2 in Nemesis §6.4).

*Sim artefacts:* `sim/nemesis_slice_sim.py` (default = this pass; `--or-pass` = before), outputs `nemesis_slice_sim.out.txt` / `.or-pass.out.txt`; `sim/day_budget_check.py`, outputs `day_budget_check.out.txt` / `.or-pass.out.txt`. The territory economy sim was not re-run: no Territory formula changed, and F7 adopts that sim's own result.

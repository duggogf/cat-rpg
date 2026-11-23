# Round 1 critique: `nemesis-system.md`, simulation and implementability

Reviewer: ai-programmer (simulation / implementability angle) · Date: 2026-11-23
Read in full: `nemesis-system.md` (all sections, appendices, open questions). Also read: `territory-management.md` §1–§8, §13–§15 (raids, Sentries/Wardens, Night Shuffle step 1, Life 8); `crew-and-progression.md` §3.1–3.6, States, Interactions, F1–F8, F11, Edge Cases, Dependencies and Assumptions (recruitment, Loyalty, Power Rating); `combat-system.md` grepped for every event, opener, flee and outcome rule (CR-19, CR-12.8, CR-16.2). Combat's other sections were not read.
Script: `design/reviews/round-1/sim/night_shuffle_mc.py`. It runs 200 seeds × 60 days × 6 policies, using the doc's own formulas. Its simplifications are listed in §7.

---

## 1. Verdict: **MAJOR REVISION NEEDED**

The parts are well made. Most worked examples recompute exactly, the safety rails are thoughtful, and the identity traits are distinct. But the simulation the doc asks to be validated does not meet its own targets when you run it. Grudge only ratchets upward, so the town fills with Nemeses. Uprisings and Patch losses run 5–10× over target. The pacifist path never produces an arc. At the same time, the two sibling docs make the flagship betrayal story impossible: Crew's Loyalty formula means Sentries and Wardens never drop in Loyalty. The data model also has a field-name collision and an unbounded pinned Memory. That is not one fix away from approval.

## 2. What is strong (must survive revision)

- **Grudge plus Regard as two axes**, with the conduct table (R6.3). This is the most original part, and it is what makes Nose-Touch, Clean Duels and Life 8 gratitude possible.
- **The Gloat** (R7.3) and the "loss is narrated in 3 s" rule.
- **Telegraphing guarantees**: two Wavering days before a Turncoat, one Restless day before an Uprising, raids fixed a night early, the 2.0 s Ambush sting, and Always a Way In. They are all testable as property tests, and they should stay as invariants.
- **Breaking points / Grand Standoff** (R12.5). These are the only mechanism that ends arcs, and the sim confirms they fire. The median time from first meeting to breaking point is 11–12 days, inside the 6–12 target.
- **Determinism intent**: `gen_seed` per perch, a seeded step 2, ascending id order, and the "byte-identical on 1,000 runs" acceptance criterion.
- **The Simulation spec section itself.** Few first drafts specify their own Monte Carlo. Keep it and make it a CI gate.
- **Worked examples recompute.** F1, F2, F4, F5, F6 (0.278), F7 (0.72), F8, F9, F10 (0.09 / 0.95), F11 (0.037 / 0.300), F12, F13 (57.2), F14 (0.22), F15 (0.51), F16 and F18 (43.7, 49.2) all check. So do almost all steps of A.1–A.3. The exceptions are listed in issue 14.

## 3. Simulation findings (what actually happens)

Policies follow the doc's spec, plus a "mixed" policy (35% Chase / 25% Humble / 20% Recruit / 20% Nose-Touch, wins 85%). The model assumes 3 tracked-Rival fights per day from Life 2.

| Metric (doc target) | chase | humble | recruit-neglect | lose 40% | pacifist | mixed |
|---|---|---|---|---|---|---|
| Rivals reaching Nemesis per Life 2–7, median / p95 (**1–2 / ≤4**) | **4 / 7** | **6 / 10** | 3 / 6 | 1 / 4 | 0 / 0 | **3 / 6** |
| Peak concurrent perched Nemeses (no target; cap of hunters is 3) | 25 | 37 | 20 | 10 | 0 | 17 |
| Share of perched Rivals at Grudge ≥ 75, last 20 days | **0.62** | **0.82** | 0.49 | 0.21 | 0 | 0.37 |
| `NemesisArcAchieved` by end of Life 2 (**100%**) | 99% | 100% | 69% | 61% | **0%** | 80% |
| Rank changes per district per night (**0.3–0.6**) | 0.22 | 0.22 | 0.24 | 0.26 | 0.10 | 0.24 |
| Uprisings per playthrough (**1–3 per Life, ≥ half fail**) | 0 | **29 (24 succeed)** | 0 | 11 (9 succeed) | 0 | 18 (15 succeed) |
| Turncoats per playthrough (**neglect 4–8; attentive 0–1**) | 0 | 0 | 4 | 0 | 0 | 0 |
| Raid-lost Patches per playthrough (Territory health 0.3–0.6/day ≈ 18–36) | 38 | 38 | 35 | 28 | 0 | 33 |
| Away-list forced early returns | **63** | 0 | 44 | 0 | 0 | 0 |
| Fresh generations per playthrough (doc: 90–110) | 78 | 79 | 96 | 73 | 55 | 89 |
| Tracked, non-faded cats at peak (brief frame: 48) | 48 | 56 | 68 | 61 | 55 | **70** |
| Mornings with no nemesis news (spec: 15–40% at most) | 9% | 6% | 15% | 26% | **72%** | 16% |

Reading these results:

1. **Snowball to "everyone is a Nemesis" (degenerate).** Almost every event adds Grudge. F3 decay is −2 only after 3 quiet days, and only for cats below 75 that are not Brooders and not arc cats. A Nemesis therefore never cools off. The only exits are player-chosen Recruit, Nose-Touch or a Grand Standoff. After one Life of play, most of a district sits above 75. Mordor's "named orc is special" reading collapses. The 3-hunter cap hides this in behaviour, but not on the Fence Line, in the barks or in the Nemesis audio state.
2. **Uprisings are a faucet, not a story.** Humble adds +20 base plus Rout items, so one Humble usually lands a cat at Grudge 55–65. Simmer is +1 to +3 per night, so the cat is Restless within a week. The Territory 4.6 uprising raid then ignores the Scent term and puts one Sentry against the resident plus two Hangers-on. p_hold is about 0.2–0.4 with a Sentry and 0.05 without one. Most uprisings succeed. The doc's target that half fail is unreachable with Territory's math.
3. **The pacifist path is empty.** Accepted Nose-Touch sets Grudge to 0. R12.2 escalation ("Stewing") only raises Grudge, and the next fight resets it again. 0% of seeds achieve an arc, and 72% of mornings have no news. Nose-Touch is a real strategy (good), but the "guarantee" is not one.
4. **The hierarchy rarely moves on its own.** Rank changes are 0.22–0.26 per district-night, below the 0.3–0.6 target. The causes:
   - Only Toughs can challenge, because the Boss is static and "directly above" a Captain is the Boss.
   - Captains are generated at f_rank 0.65 against 0.25 for Toughs.
   - F6 uses k = 3 with home advantage.
   - So challengers win about 25% of the time.
   Almost all the movement on the wall is caused by the player: losses, vacancies and returns.
5. **The Away list is a turnstile.** Under Chase Off play, 6 town-wide slots overflow about once a day. F5's 2–8 night delay effectively becomes "back in 1–3 nights", and each return grants levels plus an adaptation. That makes Chase Off a faster loop than designed.
6. **The hierarchy never empties permanently, and it never stalls.** The worst-case hostile-perched count of 0 is momentary, measured before step 2e refills. The R4.4 floor works. Fresh generation runs at 73–96 per game, within the 220-name budget. No name-table exhaustion was seen, even when names are treated as never released.
7. **Rival levels never exceed the M+3 cap through growth.** But the cap binds immediately at a frontier. When Mikan enters at band_min, frontier Captains already sit at band_min + 5, above the cap, so they never grow. The "Rivals adapt and get tougher" promise rests almost entirely on adaptations, not levels.
8. **The player's territory does not collapse overnight**, because Territory's loss cap and Home Ground hold. But raid losses (about 0.55–0.65 per day) exceed Territory's own health band, and Patch losses from uprisings come on top of that.

## 4. Issues

**1. BLOCKER: Grudge is a one-way ratchet; Nemesis status floods the town (R6.1, F2, F3, Tuning).**
Positive Grudge entries outnumber negative ones about 10 to 1. Decay is off for G ≥ 75, for Brooders and for arc cats. The result is that 37–82% of perched Rivals are Nemeses by late game (sim §3.1). The player-visible cost: "Nemesis" stops meaning anything, every Standoff draws from the same bitter/nemesis bark pool, and the Fence Line is a wall of claw-marks.
*Fix:*
- Scale the per-encounter cap with relationship. Use `cap_enc = 35` for a cat's first two encounters and 20 afterwards.
- Make Nemesis status a **slot**, not a threshold. At most 1 Nemesis per district plus the arc lead town-wide, chosen by F13 among cats with G ≥ 75. Others cap at "Bitter" (74) for display and barks.
- Decay applies at any G: −2 per quiet night, −1 for Brooders. Arc cats are exempt only while they are lead.
- Re-run the sim with the target "share of perched at G ≥ 75 ≤ 15%".

**2. BLOCKER: The flagship betrayal loop cannot fire under Crew's Loyalty formula (R9.6, R13.5, F11, A.2; Crew F8, §3.6).**
- Crew F8 gives Sentries and Wardens +1 Loyalty per night held. No neglect term applies to posted cats, and none of Territory's `SentryStatus` inputs (`nights_since_boss_visit`, rations, cushy post) appear in F8.
- Crew makes Wardens True (≥ 60) to be eligible at all, and Sworn cats "never betray" and are immune to absence drain.
- So the Life 8 Loyalty Test (thresholds 50/30) is passed by every Warden.
- Sumi's A.2 arc (posted, Loyalty 44 → 29 in 3 days, then 14 overnight) is impossible.
- In the sim, attentive policies produce 0 Turncoats. Only full neglect of Lounging ex-Rivals produces 4.

*Fix (joint with Crew):* add a posted-neglect term to Crew F8: `−1 per night when nights_since_boss_visit > 3`, ×former-rank multiplier. Make Lounging and posted neglect symmetrical. Pick **one** betrayal band: either Nemesis's 30 or Crew's Shifty < 20, not both. Then re-derive A.2 from real formulas.

**3. BLOCKER: Schema collision on `temperament` and `former_rank` (R2, R3.4; Crew §3.1–3.2).**
- Nemesis stores a 6-value personality temperament in `rival{}`.
- Crew adds a top-level `temperament` with 11 stat-nudge values, derived from `hash(coat_seed) mod 11`.
- Both use the same name with different enums. A Kit's mutated coat would silently change its Crew temperament.
- `former_rank` is defined in both docs, with different writers.

*Fix:* rename Crew's to `stat_bias` (or fold its ±8% into Nemesis temperament: 6 values × one stat pair each). Make `former_rank` Nemesis-owned in `rival{}`, read by Crew. Register both in `design/registry/entities.yaml`.

**4. MAJOR: Memory is not bounded; pinned entries can exceed capacity (R5.2–R5.3, F12).**
Pinned entries include:
- `FIRST_MEETING` and the latest encounter;
- the source entry of each of 4 Scars and 3 Titles, **plus** the `SCAR_GAINED` / `TITLE_GAINED` entries;
- every `LURED` / `HELD_FIRM` (Lure is 0.15 per night with a 5-day cooldown, about 1 per week while Crew);
- `JOINED_CREW`, `TURNED_COAT` and `KIN_TOLD`.

A veteran ex-Rival reaches about 21 pinned entries against a capacity of 16, and the eviction rule has no answer.
*Fix:* pin only `FIRST_MEETING`, the latest encounter and one entry per *displayed* Scar or Title (the Scar/Title records already carry `source_cat_id`; drop the separate `*_GAINED` pins). Collapse repeated Lure outcomes into one counter entry (`LURED ×n`). State the invariant "pinned ≤ 10" as an acceptance test.

**5. MAJOR: Uprisings succeed far too often (R9.7, F14; Territory §3.7, §4.6).**
The sim gives 29 uprisings per playthrough under always-Humble, with 24 successes, against a target of 1–3 per Life with at least half failing. Causes: one Humble lands at G 55–65, Simmer reaches 70 within a week, and Territory's uprising raid drops the Scent term while adding two attackers.
*Fix:*
- Humble's base becomes +10, not +20.
- Restless at 80.
- Uprising attackers are the resident alone, with no Hangers-on.
- Territory adds `home_adv` for the player's mark on an uprising (it is "an inside job" both ways).
- Settled after the first failure, not the second.
- Answer Open Question 3 now: delete Share a Morsel and Stare Down as daily verbs, and let the Sentry be the only lever. That removes a chore loop as well.

**6. MAJOR: The pacifist and lose-often policies miss the arc guarantee (R12.2.3–4).**
Results are 0% and 61% against a 100% target. Escalation only adds Grudge, which accepted Nose-Touch erases, and it fires on day 4 of Life 2, too late for a 7-day Life.
*Fix:*
- Count the Regard axis toward `NemesisArcAchieved`: a "friend arc" of 3 encounters, a mark, and accepted Nose-Touch or Clean Duel.
- Run escalation on day 2 of Life 2, choosing between Stewing (if the top candidate's Regard < 50) and an early `call_out` (if ≥ 50).
- Add the pacifist policy to the CI sim gate.

**7. MAJOR: The Away list is too small for Chase Off play (R4.3, R9.3, F5).**
There are 63 forced early returns per game. F5 is meaningless under overflow, and each return grants levels plus an adaptation.
*Fix:* make Away per district (3 each, 18 town-wide). On overflow, the *oldest* exile is offered Gone Over the Hill if it has no player marks, instead of returning early.

**8. MAJOR: The hierarchy is static off-screen (R4.6, R9 2d, F6, F7).**
- "Target = the cat directly above it" is undefined for Toughs. There is no order among the five, so the doc must say whether Tough-vs-Tough duels exist.
- Captains have nobody to challenge.
- The sim gives 0.22–0.26 rank changes per district-night against a 0.3–0.6 target, with challengers winning about 25% of the time.

*Fix:*
- Order the Tough perches (Fence Line positions 1–5) so Toughs duel the Tough above them.
- Let Captains duel each other for First Captain.
- Set k = 2.
- Drop `rest` to 2 nights.
- Re-measure.

**9. MAJOR: Determinism is specified for step 2 only, and with one shared stream (R9, R3, R13.3, F9/F10/F15).**
- `rng = seeded(hash(save_seed, day_index))` is a single stream. Adding one cat or one candidate shifts every later draw, so a bug report cannot be replayed after any data change.
- Territory says it uses "the Night Shuffle's seeded generator", so steps 1 and 2 are coupled.
- Prehistory (10 nights) and the Time-skip Shuffle (5 compressed nights) do not say which `day_index` they seed with. They will collide with real nights.
- Daytime rolls are unseeded: the Nose-Touch roll, Scar rolls, the Ambush moment, bark picks, Spat pre-rolls and Recruit Willingness. That leaves save-scumming policy undefined.
- `generation_counter` scope and constraint rerolls are unspecified.

*Fix:*
- Derive a counter-based substream per draw: `rng(save_seed, day_index, phase_or_step_id, subsystem_id, cat_id, draw_ordinal)`, for example via SplitMix/PCG with a hash.
- Give prehistory and skip nights negative or offset day indices.
- Seed daytime outcome rolls on `(save_seed, encounter_serial, cat_id)`, so reloading reproduces the same Nose-Touch result. That is anti-scum and reproducible.
- Specify a per-perch reroll counter.
- Log `(seed, day, step)` with every Morning Sniff item for bug reports.

**10. MAJOR: The tracked population and save size exceed the brief's frame (R4.3, Assumption 2, Acceptance "256 KB").**
- The sim peaks at 48–70 non-faded tracked cats over a 60-day game.
- The doc's own caps allow 48 perches + 30 Undermark + 6 Away + 6 Old-Timers + up to 24 Crew, plus **uncapped** Gone Over the Hill and the R4.5 soft cap. That is 114 or more.
- Old-Timer overflow (a 7th retiree) is undefined and happened in most seeds (median 3–14).
- Per cat: 16 Memory entries × about 40 B binary + 6 feuds + `rival{}` comes to about 1 KB. 120 cats is about 120 KB binary, which fits 256 KB. Naive JSON (3–5×) does not.

*Fix:* cap Gone Over the Hill at 6, and drop the oldest to name-only "legend" records (name, coat, one Memory line, about 64 B). Define Old-Timer overflow as "the oldest moves to the legend list". State binary or compact serialisation in the acceptance criterion. Take Assumption 2 to the director (see §6).

**11. MAJOR: The bark grammar cannot express its own examples, and the volume targets are arithmetically wrong (R10.3–R10.9, F16).**
- Examples use tags that are not in the taxonomy: `count_losses:1+`, `regard:respect+`, "strength Got Over It (water)", "assigned as Sentry", "knows another's Fear", "parent regard:respect+", "ex_crew of its Clowder present".
- The grammar needs:
  - comparison operators (`>=`);
  - `strength:<id>`, `assignment:<a>` and `knows_fear_of:<cat>`;
  - a `parent.` / `other.` scope prefix;
  - **slot-binding rules**: which matched tag binds `{other}`, and which Memory entry `{when}` cites.
- Volume: the floor rule alone is 47 triggers × 6 temperaments = **282 lines**. The slice target "Standoff + After × 6 × 2" = 25 × 6 × 2 = **300**. Both exceed the "about 250" slice budget.
- `GLOAT_*` triggers are temperament-locked, so 6 floors per Gloat waste 25 lines.
- Real exposure is dominated by Fight triggers. About 4 tracked fights a day × 3 fight barks × 60 days is about 700 lines heard. Standoffs add about 240 and world barks several hundred.

*Fix:*
- Floors by temperament only for the 8 Standoff and After triggers players hear most; `any` floors elsewhere.
- Slice: about 120 floors + 150 tagged = **about 270**.
- Full game: about 1,100. Put at least 10 lines per Fight trigger per temperament, or cut Fight barks to `ROUTED` and `FEAR_HIT` only.
- Specify the tag grammar formally (EBNF in the doc) with a lint tool as an acceptance criterion.

**12. MAJOR: The Ambush warning contradicts Combat (R8.3; Combat CR-19.2 line 583).**
- Nemesis: a 2.0 s sting, foiled by facing the attacker or reaching the High Road, which downgrades to a Standoff.
- Combat: 60 ticks (1.0 s), spoiled by Skitter or Brace in the last 30 ticks, which gives a neutral start rather than a Standoff.

*Fix:* adopt Combat's input (Skitter/Brace) with Nemesis's 2.0 s duration and Combat's "neutral start". Drop the Standoff downgrade, because it collides with Pillar 3 pacing. Update the `AMBUSH_FOILED` trigger to fire at neutral start.

**13. MAJOR: The `scattered` outcome does not exist (R7.5 row 11, R5.2; Combat CR-19.7, CR-19.8).**
Combat's Shoo hazard only Spooks cats. There is no break-up and no `scattered` outcome. Row 11, the `REMATCH_UNFINISHED` trigger, the A.1 Life 3 beat and the director's rematch rule all depend on it.
*Fix:* cut row 11 (preferred: humans as weather already work in Combat), or have Combat add `scattered` explicitly. Do not leave it as a request.

**14. MINOR: Worked-example and formula inconsistencies.**
- (a) A.1 night 5: Tansu *loses* as challenger but gets a Scar. Step 2d only scars the loser when the challenger wins.
- (b) A.1 day 4: the promotion should also trigger an adaptation evaluation (R6.7 rule 1) as well as Bell-Hunter, but the example omits it.
- (c) A.1 day 9: the Fear escalation (Got Over It) is applied the same night as the Rout. Rule 1 forbids that if escalation counts as an adaptation. Say whether it does.
- (d) A.3: Buri retires with `lives_active` 3 in Life 7, but he was generated in Life 5. `lives_active` is not in the R2 data model (only `born_life` is), and its initial value is undefined.
- (e) A.3: F17 uses parent Regard 95, but Buri was at 100 after the Clean Duel. That gives 50, not 48.
- (f) A.1 Life 1: two separate F2 applications (rival fled, then `PATCH_LOST`) give 32. A single ledger gives 31. State whether `PATCH_LOST` is in-encounter.
- (g) R8.5 cites "R9.4"; no such section exists.
- (h) F2's B range ignores out-of-encounter +12 (Littermate).

**15. MINOR: The duel/Spat timing double-books (R8.5, R9 2d).**
A duel rolled on night N is shown as a Spat on day N+1 and applied on night N+1. 2d on night N+1 also rolls a new duel. State one rule: the Spat roll *is* night N+1's duel, and 2d skips that district.

**16. MINOR: Humble ordering with Territory (R7.2; Territory §3.4).**
The Verdict happens before the Claim Spray, so a fight Patch is Open, not held, at Verdict time. A first Patch in a district can therefore never be Humbled onto. *Fix:* Humble is legal when the fight's Patch will become the player's (Holder Routed), and residence is created at Claim Spray.

**17. MINOR: Claimed districts with more than 3 hostile cats at claim time (R4.7).**
The holdout cap only throttles refills. The doc does not say what happens to 4–7 existing hostile perched cats when the district is claimed. *Fix:* the excess above 3 become Holdouts on the lowest perches. They are not deleted, and they drain naturally.

**18. MINOR: Untracked Open-Patch occupation.**
Territory says "Nemesis may move a Rival in during step 2" to an Open Patch, and Territory has a `squat` motive. Nemesis has no rule for this. Add it to 2e: a Roamer becomes Keeper of an Open Patch in its district with probability 0.5.

## 5. Cross-doc conflicts

| # | Nemesis says | Other doc says | Resolution |
|---|---|---|---|
| C1 | `temperament` = 6 personalities in `rival{}` (R3.4) | Crew §3.2: `temperament` = 11 stat nudges, top-level, from `coat_seed` | Rename Crew's to `stat_bias` (issue 3) |
| C2 | Starting Loyalty F18: `50 − 0.4G + 0.3R + t_L + 20s`, clamp 5–80 | Crew F7: `45 − 0.4G + offer + finish − return`, clamp 5–70; Grudge before or after halving unstated | Crew owns it. Adopt Crew F7, add F18's Regard and `settled` terms, and state "Grudge after halving" |
| C3 | Recruit gate: G < 90 or R ≥ 50; the Grand Standoff Recruit is "final", at any Grudge | Crew §3.4 / F5: a Willingness roll that can refuse (W about 20–45% for a high-Grudge Tough), re-opens the prompt, +15 per refusal | One gate. Recommend Crew's visible roll, with Grand Standoff forcing W = 95 and refusals written to Memory (`RECRUIT_REFUSED`, which Nemesis must add) |
| C4 | Betrayal band: Wavering < 30; Lure Hold Firm ≥ 60; Loyalty Test 50/30 | Crew: Shifty 0–19 betrayal-eligible, Sworn never betrays; Territory: Warden gate ≥ 60 for Life 8 deliveries and Vigil protection | One table in the registry: 20 (Waver), 40 (Loyalty Test pass), 60 (Warden / Life 8). Nemesis and Territory read it |
| C5 | Sentries are the betrayal opportunity (F11 O = 1.5; A.2) | Crew F8: posted cats gain +1 per night; no posted-neglect term | Issue 2 |
| C6 | Dismissal = Chase Off with no Rout items (+15 × m_g) | Crew §3.4: Grudge +30, or 0 if Loyalty ≥ 60 | Adopt Crew's numbers, apply through F2 with no witnesses |
| C7 | Recruiting a Humbled resident: "by interaction, Regard ≥ 50" (States table) | Crew §3.4 D: F5 with live Grudge, no Regard term | Crew's F5, plus a Nemesis gate R ≥ 50 shown as greyed with a reason |
| C8 | (absent) | Crew "Comes Knocking": a Nose-Touched cat at Grudge 0 joins later, "Nemesis decides when" | Nemesis adds the rule: a Nodding Cat with Regard ≥ 75 may knock, at most once per Life |
| C9 | Raid caps: 1 per district, 2 town-wide (4 in Life 8); motives `boss_orders, grudge, gloat, uprising, pretender` | Territory: intake `1 + floor(held/10)`; motives `grudge, comeback, uprising, squat` with `motive_mod`; `boss_orders`, `gloat` and `pretender` unvalued | Territory's intake cap governs. Nemesis's caps become request-side only. Merge the motive enums (add `comeback` and `squat` to Nemesis; give the others a `motive_mod` in Territory) |
| C10 | Holdouts = the Clowder of a claimed district (R4.7) | Territory: Holdout = a rival *Patch* inside a claimed district | Rename one. Recommend Territory's "Holdout Patch" and Nemesis's "Holdouts" (the cats) |
| C11 | Raid Lost: "lead raider becomes Keeper" (row 13) | Territory §3.4: `holder_id` "assigned by Nemesis" | Same concept, two names. Use `keeper_id` everywhere |
| C12 | Ambush warning 2.0 s; facing the attacker downgrades to a Standoff | Combat: 60 ticks; Skitter/Brace gives a neutral start | Issue 12 |
| C13 | `scattered` outcome | Combat: no such outcome; Shoo only Spooks | Issue 13 |
| C14 | State name `Perched`; breaking point "Cowed"; Title "the Soggy" | Combat: status "Perched" (High Road anti-stall), status "Cowed", status "Soggy" | Rename Nemesis's state to `Seated`; rename the breaking point to "Cowed Down" or reuse Combat's Cowed status deliberately |
| C15 | Turncoat takes the Patch only if posted (R9.6) | Territory §3.6: the Patch flips only if left Unwatched; the Den flips only if no other fit Sentry | Consistent once stated in both docs; Nemesis should cite Territory's rule |
| C16 | "Hold 3 of 5" (brief) | Territory reads it as 3 of the 4 outer Patches | Not Nemesis's to settle, but Den-lock timing affects when Captains appear (§3.5). Note only |

## 6. Needs director ruling

1. **Is "8 tracked Rivals per district, 48 total" a cap on all tracked cats or on perches?** The doc reads it as perches (Assumption 2). The sim shows 48–70 tracked in play, and the doc's caps allow over 114. This drives save size, Fence Line density and bark exposure.
2. **Is Nemesis a status earned by threshold (brief) or a scarce slot (issue 1)?** The brief says "a Rival whose Grudge crossed the threshold". Keeping it a pure threshold requires decay that the brief's "rivals remember" pillar may resist.
3. **Should a pacifist / Nose-Touch run have a guaranteed "arc"?** If yes, the Regard-arc definition in issue 6 is needed.
4. **Who owns the betrayal-band thresholds (C4)?** One number table across three docs.

## 7. Cut list (the cheapest version that keeps the player-visible drama)

The drama players actually see is a short list:
- a named cat with a mark it got from you;
- one sharp line that cites it;
- the Verdict choice;
- the cat coming back changed;
- one overnight surprise you could have seen coming.

Everything else is simulation the player never reads. Proposed slice and alpha "Rivals-lite":

- **Keep:** R2 (trimmed), R3 without quirks beyond 6, R5 (pinned ≤ 10), R6 Grudge/Regard/Scars/Titles, 6 Fears / 8 Strengths, R7 all four Verdicts and the Gloat, R10 with the formal tag grammar, R12 director, breaking points / Grand Standoff, Fence Line.
- **Replace off-screen duels (2d) with one scripted "wall event" per district per 2–3 nights,** chosen by the director from a weighted list: promotion, feud scuffle, return, Restless. Each is guaranteed visible in the Morning Sniff. This hits "the Fence Line changes overnight" deterministically, without F6/F7. The sim shows duels already contribute under 0.25 changes per night.
- **Cut:** Spats (R8.5), Crashers (R8.6), Clean Duels (R8.4, until after the slice), Wall Watch, Kits and F17, Old-Timers' gossip role, Littermate/Shadow quirks, `feuds[]` beyond 3 entries, Share a Morsel / Stare Down, the Lure roll (replace it with a Wavering trigger from Loyalty alone), First Captain, the Usurper (use the existing Pretender at Boss scale), Gossip and Chirper quirks (intel comes from sniffing and Nodding Cats only), the `scattered` outcome and row 11.
- **Collapse Undermark Simmer into a Sentry check:** Restless when Unwatched for 3 nights, Uprising rolled once.
- Expected result: about 40% less rule surface, the same five visible beats, a Night Shuffle step 2 of about 6 sub-steps instead of 10, and a bark budget that fits the slice.

---

### Sim method and limits (for the reviser to rerun)

`python3 design/reviews/round-1/sim/night_shuffle_mc.py 200`

Formulas are implemented as written: F1–F11, F13–F14, R4.4/4.5, R9.3, R12.2/12.5, R13.3, and Territory 4.6 for raids and uprisings. Power Rating is approximated from Crew F11 by level.

Simplifications:
- No Scent model.
- No damage types, so Always a Way In and resistance adaptations are not modelled.
- Toughs challenge Captains only.
- The player fights 3 tracked Rivals per day in the frontier district.
- The fresh-generation delay is approximated at 50% per night.
- Raids resolve the same night they are requested.
- Sentry presence is 50% for residents and scales with Clout's Sentry cap for raids.
- The "Loses 40%" policy wins 60% of fights.

The qualitative findings (ratchet, uprising faucet, pacifist hole, Away overflow, static wall) come from the rule structure, not from tuning. They held across the ENC 2–4 values tried during development.

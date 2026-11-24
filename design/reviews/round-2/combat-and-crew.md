# Round-2 Check — Combat System + Crew & Progression

*Reviewer: senior systems designer · 2026-11-24 · Bar (REVIEW-PROTOCOL amendment): could a small team start prototyping the vertical slice from these docs without contradicting another doc? `PASS` or `FIX`; FIX lists only slice-blocking items. Everything else is under Backlog.*

*Read in full: `REVIEW-PROTOCOL.md`, `creative-brief.md` v1.2, `director-rulings.md` §A, §B, §E, §F (plus the Part 2 action lists for both docs and DR-22's teaching line), `design/gdd/combat-system.md` (all sections, read in ranges because of the 40 KB read guard), `design/gdd/crew-and-progression.md` (all sections, in ranges). I grepped the archived combat draft only to confirm where Crew's old Move ids came from.*

*Sim: `design/reviews/round-2/sim/combat_slice_sim.py` (deterministic, `python3 -I combat_slice_sim.py`).*

| Doc | Verdict | Blocking fixes |
|---|---|---|
| `combat-system.md` | **FIX** | 4, all small, all in the text |
| `crew-and-progression.md` | **FIX** | 6, mostly find-and-replace against Combat |

**Overall.** Both docs are close. Combat does what the user asked for: it keeps the FF7R structure (switch, gauge, slow-motion commands, stagger, Pile-On), the feel table is rich and safety-bounded, and the mechanics stay light (one string per Style, 12 inputs, 3 statuses). Its maths holds up within the ruled bands for trash, the neutral and Yowler Captains, and Daifuku. Personality changes how each AI cat moves and picks targets, which a player can see. Crew's personality model, social matrix, Loyalty and recruitment rules match the rulings exactly. The blockers are almost all **cross-doc drift**: Crew was written against Combat's archived Move list, and it restates combat values that Combat later changed. On top of that, Combat leaves three rules a programmer cannot implement unambiguously (Relay membership, AI on the High Road, Mikan's AI) and has one formula example that Crew's stats contradict.

---

## 1. `combat-system.md` — **FIX**

1. **Relay membership is self-contradictory (§3.3, F6, §5 Edge 8).** §3.3 and Edge 8 say each cat can appear only once per Relay, and a revisited cat is greyed. With 4 cats that allows at most 3 Tag-Ins (A→B→C→D), so the "4th tag +20" and F6's "four-cat Relay = 4 strikes + 45 flat = 61 FZ" are unreachable. F9's "2-cat Relay every 10 s" (A→B→A) is impossible too. One programmer will build 3 tags and another 4. **Change §3.3 to:** *"Each Tag-In must start within 0.35 s of the previous strike landing and within 3 s of the previous Tag-In. Each cat may be the incoming cat once per Relay; the cat that started the Relay may also be the incoming cat of its final tag. Max 4 tags: tag 2 +10, tag 3 +15, tag 4 +20."* Rewrite Edge 8 to match: only non-starter revisits are greyed. This keeps F6 (61 FZ) and F9 as written.
2. **AI on the High Road is undefined, and Daifuku's fight depends on it (§3.2 Pounce, §3.11, §3.13, F9).** "On the wall, only High Road cats reach him" and F9's focus 0.5 both assume some AI cats climb, but no rule says which ones, when, or whether a Frazzled Daifuku on the wall can be Piled-On there. The sim shows the fight length swings from **176 s with a knock-off every 8 s on the wall to 187 s at 12 s, 206 s at 24 s, and 235 s if he is never knocked off**, so the 2–3 min band holds only if knock-offs come every ~10 s. **Add to §3.11 base AI:** *"If the AI's target stands on the High Road within 3 m of a reachable ledge, the cat Hops up after 1 s (Fraidy: never; Brooder: only once it has an avenge target). At most 2 Posse cats are on Daifuku's wall at once; the rest attack props and Toughs below."* **Add to §3.13:** *"Frazzled on the wall, he stays on the wall; the Pile-On plays on the wall top."* Keep focus 0.5 as the sim input to measure.
3. **Mikan has no AI row (§3.11).** Once the player switches away, Mikan is AI-driven. Crew §3.1 points to "Combat's neutral profile", but Combat never defines one. Switching is the core verb, so this needs a row. **Add a 7th row:** *"Mikan (no personality): stays 2–4 m from the controlled cat's lock target and attacks it; base Paw rule; no perk; no flourish beyond the Scrapper Pile-On beat."* In the same table, make two cells implementable: Schemer "in reach" = **6 m**; Goofball "spends erratically (seeded 50%)" = *"each time an `auto` Pay-off becomes eligible, fires it on a seeded 50% roll; otherwise waits 3 s"*. Fraidy with no `support` Move falls back to the base Pay-off rule.
4. **F1 examples and AC 7 contradict Crew's stats (F1, §8 AC 7).** F1 multiplies by `Off/S_ref` and `S_ref/Hide`, but the examples assume neutral stats. With Crew's Style weights (Scrapper Bite 1.20, Bruiser Hide 1.25, Scrapper Hide 0.90, Yowler Hide 0.95), Lv 8 Mikan's hit 1 deals **19 / 21 / 30**, not 20 / 16 / 24, so AC 7 fails against Crew's data. Separately, "hit% 4.5% ± 0.1 at every level" cannot pass with integer damage: L1 is 5.00%, L2 4.72%, L6 4.39%. **Change** the F1 example to 19 / 21 / 30 and say MV is defined for a neutral attacker against a neutral defender. **Change AC 7** to *"unrounded B(L)/N_ref(L) = 0.045 at Lv 1–10; F1 reproduces 19/21/30 at Lv 8"*.

## 2. `crew-and-progression.md` — **FIX**

1. **Move ids: 4 of 12 do not exist in Combat (§3.8.1).** Crew took them from the archived draft. Mismatches, with the replacement that keeps Crew's rank, instinct-level and cross-learner structure:

   | Crew id (archived) | → Combat id | Rank / instinct | Cross-Style learner |
   |---|---|---|---|
   | `claw_flurry` | `face_swat` | I / 1 | — |
   | `wall_kick` | `bunny_kick` | I / 1 | Yowler |
   | `loaf` | `puff_up` | II / 4 | **Change to none** (Combat gives the Yowler no Ruffle Move); give the Yowler's second cross slot to `belly_flop` |
   | `big_talk` | `howl` | II / 4 | Bruiser |

   The other 8 ids match Combat (`scruff_toss, shred, belly_flop, shoulder_check, sit_on_it, purr, withering_hiss, banshee_screech`). Propagate the replacements to: §3.3 Kinako "Arrives knowing: Claw Flurry, Wall-Kick" → **Face Swat, Bunny-Kick**; §3.8.5 example "Purr, Withering Hiss, Big Talk, Banshee Screech" → **…, Howl, …**; F9 worked example "Loaf (II), Big Talk (II)" → **Puff Up (II), Howl (II)** (result stays 136); F10 example "Big Talk to Hige" → **Howl** (stays 180). Delete "as named in Combat's archived starter list". The ★ prototype set and AC-3 then lint clean.
2. **Daifuku's proposed signature Strength breaks the Boss fight (§3.3).** "Immovable: cannot be knocked back or knocked off ledges" is the Strength Combat forbids on Daifuku (Combat §3.13, Edge 18, §6). His fight is "knock him off into the bucket", and the Strength applies while he is still a Rival. The other two proposals are not on Combat's §3.9 Strength menu either (Thorn "Quick Start ½ Paw", Kagi "Claw ×0.8"). **Replace with menu items:** Daifuku **immune to Cowed** (no effect on knock-offs or stagger); Thorn **+15% Nerve**; Kagi **resist Claw ×0.6**.
3. **The combat columns of the personality sheets contradict Combat §3.11, the owner (§3.2.1, §3.2.3, §3.2.2 Effects).** A team reading Crew builds the wrong numbers:
   - **Braggart.** Target: Crew says highest *current* Nerve; Combat says highest rank, then highest max Nerve. Perk: Crew says +25% of the hit's FZ against the "highest-ranked enemy"; Combat says **+20 FZ flat, Captain/Boss only**.
   - **Brooder.** Crew says Old Score ×2; Combat says **×1.5** (the +25% bonus doubled).
   - **Fraidy.** Crew says 5–7 m; Combat says **4–6 m**.
   - **Stalwart.** Crew adds body-blocking white telegraphs, which Combat does not have.
   - **Goofball.** Crew says props ×1.5; Combat says **×1.3**. The §3.2.3 table repeats "Props ×1.5" and "Old Score ×2".
   - **Bonded Tag-In.** Crew says +50% FZ; Combat says **MV ×1.25 and +10 FZ**.

   **Replace** every "Fights like" and "Combat perk" line, and the §3.2.3 "Because" cells, with Combat §3.11's values, or with a one-line pointer to §3.11. Crew keeps the Loyalty and social columns, which it owns.
4. **Kinako's recruit input collides with the control map (§3.4.3).** "Slow Blink at it from within 4 m (hold Sit)" breaks two rules: hold Sit is **Head Home** (DR-08), and Slow Blink is the combat tactical mode. **Change to:** *"Interact (North / E) within 4 m plays Mikan's slow-blink gesture; Kinako follows."*
5. **The 4-cat Posse "guarantee" depends on an optional beat (§3.5.1, §5 "never recruits a Rival").** Kinako's favour "persists until found", so a player who skips it and recruits no Rival reaches Life 2 day 2 with 3 cats. Combat §3.16 teaches the Relay on that day ("Posse of 4"), and DR-01 needs a Posse of 4 by then. **Make the favour Life 2 day 1's required first objective:** the Lot opens after it.
6. **Zoomies unlock day (§3.8.4).** Crew unlocks Mikan's Zoomies at the cat flap on Life 2 day 2. Combat §3.16, which owns what is taught (DR-22), teaches Zoomies on **Life 2 day 3**. **Change Crew to Life 2 day 3.** Keep Crew's Lv 6 unlock for Crew cats, and have Combat §3.7 cite it (Backlog C-12).

---

## 3. Sim — key output

The model uses Combat's F1–F9, §3.x tables, and Crew F1 stats at Lv 8, in two variants:
- **doc** uses Combat's own F9 assumptions: neutral stats, and every Paw worth 3.5 MV + 30 FZ.
- **slice** uses Crew's Style weights, the DR-06 chart, the slice Posse (Mikan, Hige, Pon, Thorn) and per-Paw values read off the 12-Move catalogue.

Both variants share these choices:
- Moves are spent only as whole Paws.
- Leaders keep a 2-Paw reserve.
- The F5(c) window policy is used: dump Paws while ≥ 4.5 s remain, then Pile-On.
- Daifuku is knocked off after 8 s on the wall, with phase clamps, deferred breaks and Tough waves.

**Crew%** is the Crew's share of Posse damage under a Mikan-only policy (no Tag-Ins); the DR-33 target is ≥ 55%. **Frz** is Frazzles per fight; for the Boss it is per phase.

| Fight (target) | Doc's hand claim | Sim, doc | Sim, slice | Frz | Moves cast | Leader basics / AI basics / Moves / Tag / Pile-On | Crew% |
|---|---|---|---|---|---|---|---|
| Tough, focused in a group (6–10 s) | 7.9 s | 10.7 s | 9.7 s | 1 | **0** | 65 / 35 / 0 / 0 / 0 | — |
| Tough, last enemy (Quick Pile-On) | — | 5.7 s | 5.6 s | 1 | 0 | 20 / 33 / 0 / 0 / 47 | 68% |
| 2 Toughs (skirmish, A2) | 16 s | 20.7 s | 17.9 s | 2 | **1** | 27 / 43 / 6 / 3 / 22 | 62% |
| 3 Toughs (skirmish, A2) | 24 s | 28.3 s | 24.7 s | 3 | 3 | 27 / 44 / 11 / 3 / 16 | 60% |
| 4 Toughs (30–60 s) | 31 s | 35.5 s | 33.3 s | 4 | 6 | 27 / 43 / 15 / 3 / 12 | 63% |
| 6 Toughs (30–60 s) | 44 s | 52.6 s | 47.7 s | 6 | 9 | 29 / 46 / 15 / 3 / 8 | 60% |
| Captain, neutral (30–45 s) | 36.7 s | 37.0 s | 37.0 s | 2 | 5 | 16 / 26 / 7 / 2 / 48 | 66% |
| Captain, Yowler ×0.9, Kagi (30–45 s) | 33 s | 37.0 s | 34.5 s | 2 | 5 | 28 / 37 / 8 / 2 / 25 | 60% |
| Captain, Bruiser ×1.3 (30–45 s) | 44 s | **55.4 s** | **57.9 s** | 3 | 8 | 17 / 27 / 9 / 2 / 46 | 65% |
| Captain, expert (≥ 21 s) | 25 s | 30.8 s | 27.8 s | 2 | 3 | — | — |
| Daifuku ×26 (120–180 s) | 140 s | 165.7 s | 175.6 s | 2/3/2 · 3/2/3 | 26–29 | 16 / 26 / 12 / 2 / 44 | 67% |

**Gauge income (F3):**
- The controlled cat earns 9.06 pts/s, one Paw every **11.0 s**.
- An AI cat earns 3.36 pts/s, one Paw every **29.8 s**. Because AI never spends its last Paw, its **first self-cast needs 60 s**.
- With Tag-Ins, the Posse earns **0.241 Paws/s**, which matches F3.

**Sensitivity:**
- **Daifuku, by time on the wall between knock-offs:** 8 s → 176 s · 12 s → 187 s · 16 s → 194 s · 24 s → 206 s · never knocked off → 235 s. Every case keeps **≥ 2 Frazzles per phase**.
- **Bruiser Captain, by Captain `r_rank`:** 0.20 → 58 s · 0.25 → 52 s · 0.30 → 52 s. It always takes 3 Frazzle cycles.

**What the numbers say:**
- **DR-32 stagger passes robustly.** Every phase has ≥ 2 Frazzles, even with no knock-offs at all.
- **DR-33 Crew share passes everywhere** (59–68%). Combat's AC 3 "conductor ≥ 45% vs leaders" passes: Moves + Tag-In + Pile-On come to 57–58% against the Captain and Daifuku.
- **The F9 hand model is optimistic by 0–25%**, because it treats Paw income as continuous Move damage. Combat's own F3 rates mean **no Move is affordable inside a Tough-length fight**, and a 2-Tough skirmish supports only 1. The catalogue also averages **2.1 MV / 19.7 FZ per Paw** (2.5 / 24 for damage Moves), not the 3.5 / 30 that F9 and the brief assume. Moves are only 6–17% of damage, so the bands mostly survive anyway.
- **Out of band:** the Bruiser Captain (55–58 s, against 30–45 and a hand claim of 44), and the focused Tough sits on the upper edge. Daifuku is in band but 25–35 s slower than claimed, and fragile to knock-off frequency (Combat fix 2).
- **The Pile-On is the dominant damage source against leaders** (44–48%), and commanded Moves are a minor one. That suits "conduct the brawl"; see Backlog C-3.

---

## 4. Answers to the brief's questions

**Cross-doc consistency**

| Topic | Result |
|---|---|
| Move ids/names/count | **4 of 12 ids wrong in Crew** (Crew fix 1); count 12 = 4 per Style matches; Paw costs match |
| Personality model | Six personalities, the same names, and DR-37's shape in both docs. Social matrix verified: 7 bonded, 4 clashing, 4 neutral; every character-sheet bond/clash cell is correct. **Combat-column values disagree** (Crew fix 3). Mikan has no row (Combat fix 3) |
| Control map | Combat §3.1 matches DR-08 exactly. Crew's Tail-Up matches. **Kinako's "hold Sit" collides** (Crew fix 4) |
| Stats / level range | Same curve (100→1,500, 10→100), and Style Nerve 1.3 / 1.0 / 0.9 matches. Combat's F1 examples ignore the Style weights (Combat fix 4). Crew caps the slice at Lv 10, while DR-38 and Combat AC 7 say Lv 1–8; harmless headroom (Backlog) |
| Style list | Bruiser / Scrapper / Yowler in both; the matchup chart is DR-06 in Combat, and Crew does not restate it ✓ |
| Loyalty / recruit | Crew matches DR-09/10/11/34/37: the F6 formula and its three worked examples check out (36 / 40–45 / 56–61); tiers, gates, the Bribe (96 / 288), the Life 1 free recruit, betrayal locked in the slice, and Schemer < 35 ✓ |

**The user's direction**
- *FF7R structure and flashy presentation with simple mechanics?* Yes: 12 inputs, one string, 3 statuses, the tier table and the safety layer.
- *Must not out-weigh territory and economy?* The docs largely respect this. Neither doc is over-weight in rules a player must learn. Both slice bodies are over the 50 KB size target, though (Combat ≈ 57 KB, Crew ≈ 54 KB), and Combat carries some optional sub-rules worth trimming (Backlog C-1).
- *Each cat's personality visibly affects how it fights?* Yes for movement and targeting: Braggart charges, Fraidy keeps distance, Stalwart sticks close, Goofball goes for props, Schemer flanks, Brooder holds back then avenges. Two gaps:
  - The **Paw-habit column is mostly invisible in trash fights**, because AI cats need 60 s to self-cast (Backlog C-4).
  - **The Brooder (Daifuku) joins only at the very end of the slice**, so no tester sees Brooder AI in their Posse (Backlog X-1).

---

## Backlog (non-blocking; append to the owning doc's `## Backlog (post-slice)`)

**Combat**
- **C-1 · Trim for the slice (optional, reduces rule count):**
  - Cut the 6 s Relay lockout; once-per-cat already caps a Relay.
  - Replace Wind-Up charging, the perch Paw-stop, "enemies prefer perched cats after 2 s" and the 1.5 s mantle penalty with one fixed High Road Pounce (MV 2.5, FZ 35) plus a 3 s re-use timer.
  - Make Fear diminishing "full once per encounter, then tell only".
  - Drop "Hiss spends the enemy's Paw + 6 s Move cooldown" unless the prototype shows a Hiss loop.
- **C-2 · Bruiser Captain over band** (55–58 s). Pick one: don't stack the Style Nerve multiplier on Captains, or widen the band to 30–55 s for Bruiser Captains. The sim shows `r_rank` alone cannot fix it, because it is a discrete third Frazzle cycle.
- **C-3 · F9 realism.**
  - Replace continuous Paw income with whole-Paw arrival in F9 and in AC 1's expected values.
  - Restate the Tough claim as "≈ 10 s in a group, ≈ 6 s as last enemy".
  - Restate Daifuku as ≈ 165–175 s at one knock-off per ≈ 14 s.
  - The catalogue's 1-Paw Moves average 2.1–2.5 MV per Paw against the 3.5 budget (Face Swat 2.0, Shoulder Check 2.5, Belly Flop 2.0, Withering Hiss 1.5). Either state that Set-ups trade damage for the state, or raise Pay-off MV.
- **C-4 · AI Paw habits rarely fire.** At 3.36 pts/s plus "never the last Paw", an AI cat's first self-cast takes 60 s, longer than most trash fights. If personality Paw habits should read, let AI self-cast at 1 Paw when the controlled cat holds ≥ 1 Paw, or raise `ai_fill` to 0.6 for the slice.
- **C-5 · DR-02 / AC 16 "≥ 3 commanded Moves per encounter".** Supply is 0 in a Tough-length fight, 1 in a 2-Tough skirmish, 3 at 3 Toughs, 6 at 4 Toughs. Scope the test to normal encounters (threat 4–6) and the Captain.
- **C-6 · Zoomies pace.** F8 gives +61–81 per cat in a 4–6 Tough encounter (one Frazzle per Tough), about 0.7 Zoomies per cat per encounter, against the claimed 1 per 2 encounters. That is up to 12–16 T5 Zoomies a day if used. Set `zoomies_per_frazzle` to 5, or count only Captain/Boss Frazzles.
- **C-7 · Yowler basics are the strongest.** Voice weight 1.35 makes the Yowl cone 1.36× neutral and multi-target. Watch it in the prototype, or normalise `Off` by the Style's offence weight.
- **C-8 · Leader level rule.** "Den Captains and Daifuku" at `max(band top, Posse mean − 2)` gives Daifuku Lv 8, but Crew's sheets use Lv ≈ 9 for Daifuku and Lv 6 for Kagi. Say which Lane Captains are "Den" Captains.
- **C-9 · Rival personality AI.** Enemies use archetype AI only, so a Braggart Tough does not fight like one. Add one cheap target-choice bias per personality for enemies.
- **C-10 · Adopt Crew's Stalwart idea** (step into white telegraphs aimed at the controlled cat) if the prototype wants the Stalwart to read more strongly.
- **C-11 · Slice body ≈ 57 KB** against the ≤ 50 KB target. Candidates to move: the feel-table rumble and punch-in rows into data, and the Revision Log detail.
- **C-12 · §3.7: cite Crew's Lv 6 unlock for Crew Zoomies.** AC 7: Lv 1–10, to match Crew's slice cap.

**Crew**
- **R-1 · Brooder dismissal arithmetic.** The edge case says −10 raw → −5, but F7 clamps to ±8 before halving, which gives −4. Set dismissal to −8 raw (→ −4), or exempt it from `DAILY_CAP`.
- **R-2 · Delete "Mikan's cross-Style Moves never gain the native Style's passive"** (§3.8.4). Combat has no Style passive.
- **R-3 · Daifuku Lv ≈ 9 and Kagi Lv 6** against Combat's leader-level rule (C-8). Bribe examples become 256/512 for Daifuku at Lv 8 once settled.
- **R-4 · Slice body ≈ 54 KB** against the 50 KB target. §3.2.1's combat lines shrink to pointers under Crew fix 3.
- **R-5 · AC-6 / F2 pacing** is a hand derivation; confirm in the Lives 1–2 economy sim together with Combat's real encounter lengths (skirmishes run 18–28 s, not 16–24).

**Both / cross-doc**
- **X-1 · Brooder visibility.** Daifuku is the only Brooder and joins at the end of Life 2, so no tester fights alongside Brooder AI. Pick DR-02's 3 prototype personalities from early Crew (Stalwart Hige, Goofball Pon, Braggart Thorn), and test the Brooder in the grey box.
- **X-2 · "Leader" means Captain/Boss in Combat but "highest-ranked enemy" in Crew (Braggart).** Resolved by Crew fix 3. Keep Combat's meaning.

# Round 1 Design Critique: `design/gdd/crew-and-progression.md`

*Reviewer: game-designer (round-1 critic) · Date: 2026-11-23 · Protocol: `design/reviews/REVIEW-PROTOCOL.md`*

**Coverage.** I read the whole target doc (lines 1–1161, every section). I also read, from `design/gdd/combat-system.md`: CR-7 (Pounce Gauge), CR-8, CR-9, CR-10 (Posse AI), CR-11 (Swagger/Ruffled/Frazzle), CR-12, CR-13 (Zoomies), CR-14 (damage types, Style matchups, Style passives), CR-15 (statuses), CR-16 (props/Fears/Strengths), CR-17 (Moves and Knacks), F-0 to F-10, and Open Questions. From `design/gdd/nemesis-system.md`: R3.4 and R3.7 (temperament, kits), R7 (Verdicts and the outcome matrix), R9.6 (Lure/Waver/Turncoat), F18, the feedback-loop table and the related edge cases. Canon: `design/creative-brief.md`, `design/gdd/game-pillars.md`.

**Balance-check inputs.** `assets/data/`: ABSENT (no data files exist). `design/balance/`: ABSENT. `design/registry/entities.yaml`: FOUND but an empty stub. Every number below is therefore checked against the targets the GDDs and the brief state. It is paper arithmetic, not measured data. **Balance health: CRITICAL ISSUES.** Under Combat's actual rules one family of Moves dominates (Issue 2), and the doc fails two of its own acceptance criteria (AC-7, and AC-22 against Combat's rules).

---

## 1. Verdict

**MAJOR REVISION NEEDED.**

The doc is ambitious, honest about its weak spots and arithmetically careful inside its own model. But that model is not the game Combat has specified. The two docs run two Move catalogues on two numeric scales with colliding names. Recruitment and Loyalty contradict Nemesis on the roll, the starting value, the betrayal band and the Grudge input. And under Combat's real rules (Swagger, CR-11.1) a cheap family of Moves, the "apply Ruffled" ones, breaks the doc's own dominance checks.

Against the user's bar ("interchangeable recruits you swap whenever you like and teach skills to, just like Pokémon"), the *teaching* half is overbuilt and the *collecting* half is underbuilt. Same-Style cats differ by ±8% Temperament. Any kit can be copied in a day through Mikan. The level catch-up flattens raising. So there is very little reason to want *this* cat over *that* one.

---

## 2. What is strong (must survive revision)

- **The budget-5 Style rule** (§3.2). Styles redistribute stats, never add power. It is clean, testable (AC-1) and keeps Power Rating honest.
- **The XP shape** (F2/F3): constant fights-per-level, full XP to every Posse cat with no split, and a level-difference multiplier that doubles as catch-up and anti-grind brake. No XP items. These are good decisions. The arithmetic checks out: I reproduced 125,832 total XP, the F3 worked examples (562 / 205) and the cumulative table.
- **Watching as a concept.** "He watched it land on him eight times" is the best Pillar 4 × Pokémon idea in the doc. Moves taken from Rivals by fighting them are this game's version of TMs. It needs fixing (Issue 7), not cutting.
- **Home Moves** (Biscuits, Bell Ringer, Come Running, Crib Guard). They are the only mechanical bridge between the two lives, with a no-miss fallback. They do real Pillar 2 work. Keep all four.
- **Mikan as the Crew's library**, and the elder-Mikan arc (Voice rises, everything else falls, the Crew carries). Both are strong fantasy expressed in numbers.
- **Tail-Up.** It is the right narrow reading of "swap anywhere, manage at the Lot".
- **The doc's self-criticism.** Open Questions 3, 4, 5, 8, 10 and 18 are correct, and several of my issues below confirm them with numbers.

---

## 3. Issues

### Issue 1 — BLOCKER — Two catalogues, two numeric scales, colliding names (§3.9, §3.10, F10 vs Combat CR-13/CR-14/CR-15/CR-17)

**What is wrong.**
- The brief (§6) gives Combat "all Move, Knack and Zoomies definitions and numbers". Combat defines 20 Moves and 10 Knacks with its own grammar: MV, FZ, startup ticks, flags. This doc defines 64 Moves and 20 Knacks with another grammar.
- **The scales disagree.**
  - Combat's 1-Paw budget is **MV 3.5 *and* FZ 35** (CR-17.1), so Frazzle is free on top of damage.
  - This doc's budget is **3.5 HE total, with Frazzle paid out of it** at 0.10 HE per point (F10). Head-Bonk is 2.0 Pow + 15 Frz = 3.5.
  - Under Combat's grammar, almost every Crew Move is badly under budget: Head-Bonk delivers 57% of the damage and 43% of the Frazzle a 1-Paw Move is allowed.
  - Bunny-Kick and Whirl have **0 Frazzle**, while a single basic Swipe string has FZ 40 (Combat F-3). Under this doc's numbers, spending a Paw Frazzles *less* than pressing Swipe. That inverts the Frazzle → Pile-On loop, the signature of Pillar 3.
- **Name collisions that will break data and readability:**
  - *Nine Shadows*: Crew's P7 Move vs Combat's **Prowler Zoomies**.
  - *Everything Off The Shelf*: Crew's T7 Move vs Combat's **Trickster Zoomies**.
  - *Pounce* (S3) vs Combat's basic Pounce verb (CR-5).
  - *Hiss* (Y1) vs Combat's universal Hiss action (CR-5, Auto-Hiss).
  - *Yowl* (Y3) vs the damage type and the Style name.
  - *Wall-Kick*: Crew's Thump that needs a wall vs Combat's Claw dash with invulnerability.
  - *Neck-Nip*: Crew's 1-Paw MV 2.5 vs Combat's **2-Paw MV 7.0**.
  - *Sit On It*: Crew's 1 Paw vs Combat's 2 Paws.
  - *Loaf* (5 s vs 6 s) and *Vanish* (4 s vs 2.5 s).
  - Knacks: *Thick Scruff*, *Motor* and *Pack Cat* each have different effects in the two docs. *Grudge-Holder* (+15%) vs *Grudge-Bearer* (+20%) is the same Knack at two values.
  - *Stubborn* is a Combat Knack and also a Crew Temperament.
  - Crew's *Lands On Feet* is Combat's *Stubborn* (once per encounter vs once per day).
  - Crew's *Nine Schemes* is Combat's *First Swipe* (+0.5 Paw = +50 points).
- **Statuses.** Combat closes the list at 5 debuffs and 3 buffs (CR-15, by Pillar 3's design test). This catalogue implies about 12 more: generic slow (Hind-Rake, Hamstring, Hairball, Lullaby-on-Boss), Hide-down (Scruff Grab, The Stare), enemy-damage-down that is not Cowed (Hiss, Hamstring, Queen's Scolding, Last Word), Blinded (Combat calls it Dirt-Eyed), doze, Nipped, marked, shield, self Zip-up, +25% aura (Combat has Fired Up at +20%), and "unseen".
- Quick Swat "refunds 0.25 Paw". Combat CR-7: "Moves never refund their own cost".

**Why it matters to the player.** A Lesson teaches a Move whose tooltip, damage and Frazzle come from whichever file loaded last. Two different things are called "Nine Shadows". The Slow Blink menu lists effects the HUD has no icon for. Pile-Ons come more slowly the more Moves you use.

**Fix.**
1. **One catalogue, one owner, one scale.** Combat owns `assets/data/combat/moves.*` and `knacks.*`. That means every number and effect, in Combat's CR-17 grammar: MV, a separate FZ budget, CR-15 statuses only. This doc owns a separate table `assets/data/crew/learnsets.*` keyed by `move_id`, with columns `styles[], source, rank, instinct_level, tier`. Delete the (P) columns from §3.9/§3.10 entirely. Do not keep them "as a proposal". Combat's OQ9 already delegates the remaining catalogue to systems-designer under the CR-17.1 budget, and that is the route.
2. **Merge, keeping Combat's 20 as canonical rows.** Use this mapping (Crew row → Combat row):

   | Crew | Combat |
   |---|---|
   | S1 Bunny-Kick | Claw Flurry |
   | B1 Head-Bonk / B8 Shoulder Check | Shoulder Check |
   | B3 Belly Flop | Belly Flop |
   | B2 Loaf | Loaf |
   | B4 Sit On It | Sit On It (2 Paw) |
   | P2 Vanish | Vanish |
   | P3 Drop In | Drop Strike |
   | P6 Shadow Step | Shadow Step |
   | P1 Neck-Nip | Combat's Neck Nip (2 Paw); Crew's 1-Paw version is renamed |
   | Y2 Purr | Purr |
   | Y1 Hiss | Withering Hiss |
   | Y4 Back-Talk | Big Talk |
   | T1 Knock It Off | Shelf Sweep |
   | T2 Dirt Kick | Dirt Devil |
   | T3 Bait | Bait |

   S7 Thousand Paws, Shred, Scruff Toss, Banshee Screech and Yarn Tangle are reconciled by Combat.
3. **Zoomies keep their names.** Rename P7 (proposal: "Ninefold Pounce") and T7 (proposal: "Shelf Avalanche", and drop "Avalanche" from B12 — see Issue 10).
4. **Knacks: one list of 20.** Union the two lists and dedupe: Grudge-Holder / Grudge-Bearer → one Knack at Combat's +15%; Stubborn / Lands On Feet → one, named *Lands On Feet*, once per encounter; First Swipe / Nine Schemes → one. Combat's Style passives make two more redundant: delete K13 Butterfingers (Trickster *Butterpaws* already does props ×1.5) and K10 Big Lungs (Yowler *Big Voice*).
5. **Status discipline.** Every effect maps to Combat's 8 statuses or to Ruffled:
   - −X% enemy damage → **Cowed**.
   - Slow → **Soggy** for water sources, **Tangled** for sticky ones; otherwise cut the slow.
   - Blinded → **Dirt-Eyed**.
   - +damage aura → **Fired Up**.
   - Hide-down: either Combat adds it in place of an existing status, or it is cut. Recommend cut: B5 and Y10 become Ruffled or Cowed riders.

### Issue 2 — BLOCKER — The F10 model is not Combat's game; under Combat's rules, "apply Ruffled" Moves dominate and one Posse tops two columns (F10, §3.13)

**What is wrong.**
1. **Swagger is missing** (Combat CR-11.1). A Captain takes ×0.70 and a Boss ×0.50 damage unless Ruffled or Frazzled. Ruffled also doubles Frazzle gain. So a Move that Ruffles a Boss for 6 s doubles the *whole Posse's* damage for 6 s.
   - F10 values Ruffled at "0.3 HE per second on a Captain/Boss".
   - Combat's sustained Posse output is about 4.65 MV/s (F-10: controlled cat 1.25 basics + 0.55 from Paws; each AI cat 0.75 + 0.2).
   - So 6 s of Ruffle on a Boss is worth about `4.65 × 0.5 × 6 ≈ 14 BH` of extra damage, plus about 1.4 HE of extra Frazzle.
   - **Y4 Back-Talk** (1 Paw, Ruffled 6 s) is therefore worth about **16 HE against a 3.5 budget, ×4.5**, on a Boss. On a Captain it is about 9 HE (×2.5).
2. **The Posse output rate is understated about 3×.** F10 assumes 6 HE of basic attacks per cat per minute (0.1 BH/s) and that Moves are about 70% of output. Combat says an AI cat's basic cadence is 0.75 MV/s (CR-10.1), so Moves are about 25% of output. Every utility value priced as "% × Posse output × t" is therefore undervalued by up to 3×: Rumble, Scent Mark, Feather Frenzy, Catnip Sermon, every Ruffle source. Raw-damage Moves are valued roughly correctly.
3. **Ruffle sources are flooded.** Combat deliberately kept Ruffled scarce: Ambush, Fear, interrupting a yellow action, Bap. This catalogue applies or causes Ruffled on **19 of 64 Moves**:
   - Direct: S8, S10, P2, P6, P10, P11, P12, Y4, Y6 (via Ambush wake), T3, T4, T9, T11, T12.
   - Via an interrupt: B1, Y8, T6, H2.
   - Plus P8's "treat as Ruffled".
4. Combat's Prowler passive (CR-14.3: "hits from behind on a Ruffled enemy are crits") and K8 Go For The Throat (+30% basics vs Ruffled) then pay off a permanently Ruffled target.

**The dominant Posse ("Needle")**, legal from early Life 3 apart from Shadow Step (Rank III, Lv 20+):

- **Mikan**: Back-Talk, Feint, Fish-Hook, Thousand Paws.
- **Yowler**: Back-Talk, Rumble, Purr, Spit.
- **Prowler**: Neck-Nip, Shadow Step, Pressure Point, Nine Shadows; Knack Go For The Throat.
- **Trickster**: Feint, Glint, Tin-Can Clatter, Knock It Off.

Spending about 65% of Posse Paws on 4–6 s Ruffles keeps a Boss un-Swaggered for about 65% of non-Frazzled time. Frazzle comes about twice as fast, so the Frazzled share rises from about 15% to about 23%.

My recomputation on Combat's rates:

| Posse | Captain (doc → recomputed) | Boss (doc → recomputed) | Mob (doc → recomputed) |
|---|---|---|---|
| 0 Lane Standard | 100 → 100 | 100 → 100 | 100 → 100 |
| 3 Night Shift | 113 → ~118 | 96 → ~120 | 108 → ~105 |
| 7 Herd & Dump | 104 → ~100 | 82 → ~80 | 124 → ~120 |
| 8 Mark & Execute | 104 → ~105 | 115 → ~110 | 86 → ~88 |
| **Needle** (new) | — → **~118** (105–130) | — → **~130** (115–145) | — → ~95 |

Derivation, Boss column:
- Effective damage multiplier = Swaggered share × 0.5 + Ruffled share × 1.0 + Frazzled share × 1.75.
- Lane: 0.68 × 0.5 + 0.17 + 0.15 × 1.75 = **0.77**.
- Needle: 0.27 × 0.5 + 0.50 + 0.23 × 1.75 = **1.04**.
- Needle then pays ×0.88 for Paws diverted from damage Moves and gains ×1.10 from Prowler crits and Go For The Throat.
- Net 0.77 → 1.04 × 0.88 × 1.10 ≈ ×1.30.

These are ±15-point estimates. The direction is not in doubt: **Needle tops both the Captain and the Boss columns**, which breaks the doc's claim "No build is best in more than one column" and AC-22's "no build above 115 in two or more columns". It is also boring optimal play: press the cheapest Ruffle, repeat. It makes Combat's OQ1 (fights already shorter than the brief's targets) worse.

**Why it matters to the player.** Every Boss and Captain becomes "chain taunts and feints". The flashy capstones are worth less than a 1-Paw taunt. Swagger (meant as "find the opening") becomes "never let it close".

**Fix.**
1. **Rebuild F10 on Combat's F-1, F-3, F-6 and F-10.** Include Swagger, Combat's AI cadence, Style passives, Frazzle as a separate budget, and the BuffMod additive clamp at 1.60 (which replaces this doc's proposed ×2.0 product cap). Rerun §3.13.
2. **Cap Ruffle sources in the catalogue.** At most **one native Ruffle Move per Style** (5) plus at most 3 Street Moves. Ruffled applied by a *Move* lasts **≤3 s on Captain-and-above** (Toughs keep the listed duration). Cut Ruffled from Back-Talk (it keeps the taunt and becomes Big Talk). Cut it from Fish-Hook, Switcheroo and Glint (on Bosses). Keep it on Feint, Counter-Swipe and Shadow Step (Combat's own row), and on Vanish's next hit.
3. **Propose to Combat a Ruffle diminishing rule on Captain+,** mirroring CR-16.2's Fear rule: within one Frazzle cycle, Move-sourced Ruffled applies at full, then half, then not at all until the next Frazzle resolves. This leaves Ambush, Fear and Bap as the strong openers, which is what Combat intended.
4. **Replace AC-22's bounds** with a simulation of Combat's formulas that includes a "Ruffle-spam" bot policy. Pass condition: Ruffle-spam ≤ 110 in every column.

### Issue 3 — BLOCKER — Recruitment and Loyalty contradict Nemesis on five points (§3.4, §3.6, F5, F7, edge cases; Nemesis R7.2, R9.6, F18)

**What is wrong.**
1. **Roll or no roll.** Nemesis R7.2: Recruit "Joins the Crew" when available (Grudge < 90 or Regard ≥ 50; Crew has room; offering paid). That is deterministic, which matches the brief's "joins the Crew with full Memory". Crew: a Willingness roll clamped to 5–95%.
2. **Two starting-Loyalty formulas.** Crew F7: `45 − 0.4G + offer + finish − return`, clamped 5–70. Nemesis F18: `50 − 0.4G + 0.3R + temperament + 20×settled`, clamped 5–80. Crew never reads **Regard**, Nemesis's respect meter, anywhere: not in Willingness, not in Loyalty. So Nose-Touch and clean fights earn nothing at recruitment.
3. **The Grudge input is undefined, and the thaw rule is dead.** Nemesis halves Grudge at Recruit and blocks Recruit at Grudge ≥ 90 unless Regard ≥ 50. If Crew freezes the post-halving value, `grudge_at_recruit` is below 45 in every normal case, so §3.6's thaw (≥ 50) never fires. If Crew freezes the pre-halving value, F7 penalises twice what Nemesis does.
4. **The betrayal band.** Crew's A-12 says Shifty (0–19) is betrayal-eligible and Sworn never betrays. Nemesis: Wavering below **30**, Lure checks at ≥ 60. The cat the Crew screen calls "Aloof, fine" (20–29) is the cat the Morning Sniff calls "Wavering".
5. **Dismissal.** Crew: becomes a Rival with Grudge +30, or a clean parting at Loyalty 60+. Nemesis: treated as a **Chase Off** (exiled, returns tougher with an adaptation).

**Why it matters to the player.** The Verdict is the emotional peak of Pillar 4. A 50% roll there overrides a deliberate choice: "I chose Recruit and the game said no." The courtship the doc wants already exists in Nemesis's gates and Regard. Contradictory tiers mean the warning the player reads on one screen is wrong on another.

**Fix.**
- **Delete the F5 roll.** Nemesis owns availability. Crew converts what F5 measured (Offering, Pile-On, Mikan's finish, Clout, familiar face, level gap) into **starting Loyalty**, built on Nemesis F18 plus an Offering term (+5 per step) and the return penalty (−20), clamped 5–80. Persistence is rewarded through Regard, not pity stacks.
- **Cut the Fear penalty entirely** (OQ9 is right: it punishes Combat's central trick).
- **Tiers:** Shifty becomes **0–29** and is aligned to Wavering. Sworn (80+) is immune to Lure.
- **Thaw** reads Grudge *before* halving, threshold ≥ 60.
- **Dismissal** uses Nemesis's rules, with one Crew addition: Loyalty ≥ 60 means a clean parting, which Nemesis treats as an accepted Nose-Touch (Grudge 0, Regard +10). It is not a Chase Off.
- Friend Strays keep their no-roll Trust route.

### Issue 4 — MAJOR — There is no strong reason to want *this* cat over *that* one (§3.2, §3.4, §3.7, F3)

**What is wrong.** Against the Pokémon bar:
- **Two same-Style, same-level cats** differ only by Temperament (±8% on two stats) and Loyalty (±5%). This is weaker than Pokémon natures, which come *on top of* species, abilities and IVs.
- **Kits are not identity.** A recruit's Street or Boss Move is taught to Mikan once, and then Mikan teaches it to anyone. The motive "recruit him for the Move he knows" lasts one in-game day.
- **Levels are not identity.** The catch-up takes a Lv 10 cat to Lv 18 in 73 Tough-equivalents (TE), about 3 days. Lot gossip pays 25%. A 6-day "raise" can be skipped.
- **Style matchups are worth little per slot.** Combat's matchup is ±25% *per cat*, and an AI companion is about 20% of Posse output, so swapping a companion moves Posse output about ±5%. The "pleasure of the swap" (Player Fantasy) is real only against Fears and Strengths, which this doc does not design for.
- **The strongest individuality lever already exists and is unused.** Recruited Rivals keep their Nemesis Strengths, Fears, Titles and Chase-Off adaptations (brief §6.1; Combat CR-16.3 gives a Strength a budget: resist a type ×0.5, +1 Paw, immunity to one status, +15% Nerve…). This doc only says they are "kept".

**Fix.**
1. **Trait slot.** A recruited Rival's Nemesis Strength becomes its **Crew perk**: always on, never teachable, never forgettable. Its Fear stays as a liability, per Combat CR-16.1. A twice-Chased-Off Nemesis arrives with two adaptations, so it *is* mechanically unique. That makes recruiting a Nemesis the premium catch, which is exactly Pillar 4.
2. **Signature Move.** Every generated Rival has one Street Move flagged `signature`. It can be taught **only by that cat** (not relayed through Mikan's Repertoire), and only while the cat is Steady+. Betrayal takes the source away. This puts the stakes back on Pillar 4 without the last-copy machinery.
3. **Merge Temperament** into Nemesis's `temperament` field, which has 6 values (see Issue 13). Give each a ±8% stat nudge, so the cat that taunts like a Braggart also fights like one.
4. **Strays carry no Strength and no signature** (see Issue 9).

### Issue 5 — MAJOR — The protagonist does out-damage every companion; the risk is real and quantified (§3.11, F10 check 4, OQ4)

**What is wrong.**
- **In the doc's own model**, Lane Standard Mikan contributes 29.7 of 79.2 HE (**37%**), about **1.8×** any companion (15.6–17.4). Control is the main driver: 6 Paws against 3, full-rate basics.
- **On Combat's rates** Mikan is 34–41% of output.
- **Like-for-like (both player-controlled), Mikan still wins.** From Life 5, Mikan has Bite 1.20 × Prime 1.05 = 1.26 against a Prowler's 1.30. Mikan also has a third Paw, the best four of 64 Moves, Bell Ringer, and the Scrapper Flurry passive (+20% Pounce from basics). By my estimate a fully kitted controlled Mikan is about **+15%** over the best controlled specialist.
- **And Mikan is controlled by default.** Control returns to Mikan when the controlled cat is Routed (Combat CR-9.5), so in practice the player rarely leaves Mikan.
- **What tempers it.** Combat's Style passives partly answer this. A Prowler crits every hit on a Frazzled target (×1.5), so a Prowler's Nine Shadows beats Mikan's in the Frazzle window. Bruiser Heft gives ×1.3 Frazzle. F10 check 4 ignores these passives.

**Why it matters to the player.** If Mikan carries every Posse, the companions become stat sticks, and "interchangeable companions" means "interchangeable spectators".

**Fix** (recommended; the director decides, see §5):
- Mikan may slot at most **two cross-Style Moves** (the other two are Scrapper or Home Moves).
- Mikan's cross-Style Moves never gain the specialist's Style passive (this is already true in Combat, so state it here).
- Do not add a hidden potency multiplier. A slot rule is readable on the cat sheet; ×0.9 is a number nobody sees.
- Make the Crew's contribution visible through Issue 4's traits.

### Issue 6 — MAJOR — The 4-slot limit binds for Mikan but barely for AI Crew, and forgetting is a fee, not a decision (§3.7)

**What is wrong.**
- **AI cats cannot use four Moves.** An AI cat earns about 3–4 Paws in a 60 s fight (doc: 3; Combat F-6: about 17 s per Paw, starting at 0.5). That is 2–3 Move uses per fight, often from one or two slots. For AI Crew, the 4-slot limit creates decisions mostly when the player re-kits at the Lot, not in the fight.
- **The real slot decision is Mikan's** (64 → 4) and the controlled cat's. That is good, and it is where the Pokémon sting lives.
- **Forgetting costs almost nothing.** Old Habits, the refresher Lesson at 50% and Mikan's permanent Repertoire make forgetting a small Morsel fee, as OQ5 suspects.
- **The machinery costs UI and data for that small fee:** a Pending list of 3, last-copy warnings, the "lost for the playthrough" Keepsake rule, and the refresher multiplier.

**Fix.**
- Keep 4 slots (canon).
- **Cut the Pending list.** Earned Moves go to a per-cat "Can learn" list, which is Old Habits extended to Watched Moves. The Moves are there at the Lot for free swap-in.
- **Cut the refresher multiplier and the last-copy rules.** With Issue 4's signature rule, the only Move that can truly be lost is a signature Move whose owner leaves. That is a Pillar 4 event, shown in the Morning Sniff.
- Propose to Combat that a Tactic spends slots in slot order (slot 1 is the AI's go-to). Then slot *order* is an AI-cat decision the player makes at the Lot.

### Issue 7 — MAJOR — Teaching is one system too many (two too many), and Watching cannot deliver Boss Moves (§3.7, §3.9)

**What is wrong.**
- **Seven acquisition routes** (Instinct, Lesson, Watching, Elders, Keepsakes, Boss recruit, heir) for 64 Moves. Elders (6 NPC cats, 600 Morsels + 4 Shinies) and Keepsakes (5 items) each exist to deliver 5 Moves.
  - **Elders** are a shop with whiskers. They duplicate Lessons with a Shiny gate.
  - **Keepsakes** are TMs. Their 5 Moves are the expensive conditional ones (Box Fort, Bag Lurk, Glint, Feather Frenzy, Catnip Sermon), which OQ16 itself flags.
  - Together they add 11 placements, 6 NPCs and a Shiny sink. They serve no pillar that Watching and Lessons do not already serve better.
- **Watching cannot reach Boss signatures.**
  - Rank IV needs Lv 30, and "no pips accrue" below a Move's Rank level. So Daifuku (Lv ≈ 8), Madam Sabi (≈ 16) and Oboro (≈ 24) **cannot be Watched at all** in their Den fights.
  - Even when Rank allows it, a Boss is fought once, the cap is 2 pips per Move per encounter, and the threshold is 8 (Mikan 4). Not even Mikan can complete a Boss Move in the Den fight.
  - The Player Fantasy's "watched it land on him eight times" is unreachable for Bosses. The vertical slice lists B12 Avalanche (Rank IV) in a slice that ends around Lv 8.
- **"2 pips if the Move hit that cat"** rewards being hit, which runs against "nothing may stall" (OQ10).

**Fix.**
- **Cut Elders and Keepsakes.** Three teaching routes remain: **Instinct, Watching, Lessons**. Rule: every Move a cat did not grow into, it took from another cat.
- Re-home the five Elder Moves to the Street pool, carried by Captains (Rivals now teach them). Re-home the Keepsake Moves the same way or cut them (see the cut list). The two Kasumi Elder Knacks become Captain-carried Street Knacks.
- **Pips accrue regardless of Rank.** The Move becomes learnable when the cat reaches its Rank level and shows as "grown into at Lv 30".
- **Boss fights allow 4 pips per Move.** Rank IV threshold becomes 6 (Mikan 3), so Mikan can take a Boss signature from the Den fight, while Crew cats need the Pretender rematch or the recruit.
- **Replace "2 pips if hit"** with "2 pips if the watcher Braced, Skittered or Hair's-Breadthed it". That rewards reading the telegraph, which is Pillar 3.

### Issue 8 — MAJOR — Recruiting at full Crew drops the Pillar 4 moment, and the cap does not create pressure (§3.4, §3.5, edge cases; Nemesis edge cases)

**What is wrong.**
- **The full-Crew Verdict.** At cap, Recruit is greyed in the field. Dismissal exists only at the Lot. Nemesis's edge case says "Crew's flow *may* offer a dismissal". Crew's edge case says "The Lot offers Dismissal first". So the player loses the cat they just fought for, in exactly the beat the game is built around.
- **Dead and duplicated rules:**
  - The cap block "Rival more than 5 levels above Mikan" never fires: Nemesis caps Rival level at Mikan + 3.
  - "Boss whose district is not yet claimed" is redundant: the Den Rout *is* the claim, and Nemesis adds Regard ≥ 50.
- **Neglect never fires.** With up to 36 Sentry/Warden posts against a cap of 24 (OQ8), no cat is ever idle. Neglect-driven betrayal goes quiet, and the cap never forces a choice.

**Fix.**
- **The Verdict prompt gets "Recruit — make room".** It opens a short list of Lounging cats.
  - Releasing one at Loyalty ≥ 60 is a clean parting (Grudge 0, Regard +10): a likely future Nodding Cat.
  - Below 60 it follows Nemesis's Chase Off rules.
  - Nobody is deleted, and the cap becomes a choice made where the stakes are highest.
- **Delete** the 5-level block and the "district not claimed" block.
- **Posting satisfies pride by rank.** An ordinary Sentry post satisfies only ex-Strays and ex-Toughs. Ex-Captains and ex-Bosses count as idle unless they are in the Posse, a Den Sentry, or Warden.

### Issue 9 — MAJOR — Strays are the dominant recruits, which inverts "enemies become family" (§3.4, F5, F7; Nemesis R9.6)

**What is wrong.** Strays have Willingness base 60 (Toughs 45). Friend Strays are guaranteed at Trust 3, with Loyalty 55, and **can never turn coat** (Nemesis R9.6 exempts Stray origin). The economically safe roster is therefore Strays plus story recruits. The design's best stories (the ex-Nemesis Warden) become the risky, worse option.

**Fix.**
- Strays have no trait slot and no signature (Issue 4).
- Friend Strays go down to **6** (one per district).
- Rival recruits carry the Strength perk.
- The risk/reward then points at Rivals: stronger, unique, possibly disloyal.

### Issue 10 — MAJOR — Catalogue audit: dead Moves, dominated pairs, outliers, and the doc's own rule (a) violated (§3.9, F10 check 1)

The row-by-row audit is in Appendix A. In summary:

- **Rule (a) violated.** F10 requires unconditional value within ±10% of budget. These Moves fail:

  | Move | Unconditional | Gap to budget |
  |---|---|---|
  | P1 Neck-Nip | 2.5 | −29% |
  | P7 Nine Shadows | 6.0 | −25% |
  | B8 Shoulder Check (floor) | 2.5 | −29% |
  | S9 Wall-Kick (floor) | 2.9 | −17% |
  | P11 Bag Lurk | 0 | — |

  The "reference HE" column averages conditions, which hides the failures.
- **Over budget, unconditionally:** **B11 Box Fort** is worth about 5–6 HE for 1 Paw (−60% damage taken, +25% Paw fill and lost targeting on one ally for 8 s): +50–70%.
- **Over budget under Combat's rules:** **Y4 Back-Talk** at about ×4.5 on Bosses (Issue 2), **S2 Quick Swat** (its refund is illegal under CR-7), and **Y5 Rumble** (+25% to a Posse that outputs 4.65 MV/s is about 11 MV over 10 s, about ×3).
- **Dead:**
  - **S6 Second Wind**: +30% Zip is +15% ZipFactor, so it refunds about 0.2 of its 1 Paw.
  - **P11 Bag Lurk**: 12 s of hiding in a 60 s fight, worth 0 if never triggered, and AI cats cannot use it.
  - **B6 Big Stretch**: a self-heal at Rank III, after Purr exists at Lv 1.
  - **T8 Play Dead**: niche, and an expensive animation.
  - **B12 Avalanche against Bosses**: 3.7 HE for 2 Paws (−54%). A Boss's own signature is useless in the Boss column.
- **Dominated pairs:**
  - **Glint ≥ Bait**: same gather, and Glint also Ruffles Bosses.
  - **Hamstring ≥ Hind-Rake**: same pools, Hamstring adds damage-down.
  - **Head-Bonk ≥ Shoulder Check** away from walls: same pool (B, S).
  - **Combat Purr's group mode (1 Paw, HealMV 1.8 to all within 3 m) ≥ Y7 Dawn Chorus** (2 Paws, 1.8 each).
- **Near-duplicate clusters:**
  - 7 Moves are "small hit + Ruffled 3–6 s": S8, S10, P6, P11, T9, T11, Y4.
  - 4 Moves are slows: S5, P4, T5, T10.
  - 2 Moves are Hide-downs: B5, Y10.
- **Prowler names are unreadable:** Shadow Step, Nine Shadows, Moonless, New Moon, Vanish. Five shadow/moon names for one Style.

**Fix.**
- Cut to **50 Style Moves (10 per Style) + 4 Home Moves**. That is inside the brief's "about 60", with full-vision Paw-budget rows checked against Combat's grammar. The cut list in §6 names the 14 Moves.
- Rename B12 to *Rooftop Drop*. Give it a Boss-specific Frazzle rider so it is not dead against single targets: FZ 70 on the primary target.

### Issue 11 — MINOR — XP is not grindy, but the pacing derivation omits Turf XP and AC-7 is wrong (F2, F3, AC-6, AC-7)

**Total fights.** Tough-equivalents to Lv 48 = 15 (Life 1) + 90 (Life 2) + 40 levels × 24 = **1,065 TE**. At the doc's 2.9 TE per encounter that is **≈ 367 encounters** (≈ 384 to Lv 50). At about 75 s each, including Standoff and Verdict, that is ≈ 7.6 h of combat in a 22–28 h game. At 26 TE/day it is ≈ 41 in-game days for Lives 1–7 against the brief's 55–65 days for all nine Lives. **Not grindy.** One level per day, roughly one per session, is a fair ARPG rhythm.

**But:**
- **Turf XP is missing from the derivation.** 30 Patches × 4 TE ≈ 120, plus 6 district claims × half a level ≈ 72: about **190 TE (≈ 18%)**. With it, Lives 3–7 take about 6.3 days, not 7.4, and the Posse sits above band. Combat's Mit uses the attacker's level reference and its Boss model already runs short (Combat OQ1, OQ15), so over-levelled Posses shorten Boss fights further.
- **AC-7 fails its own formula.** A Lv 10 cat in Lv 20 fights needs 5.24 + 6.03 + 6.94 + 7.98 + 9.19 + 10.60 + 12.27 + 14.30 = **72.6 TE** to reach Lv 18, not 60. To Lv 20 it needs about 109 TE (≈ 4 days). "Current again in about two days" (F3) is wrong.
- **Sensitivity.** At 15 TE/day, Lives 3–7 take 12.8 days each and the game overruns its day budget.

**Fix.**
- Include Turf XP in A-7's daily figure.
- Set `FPL_CAP` to **26**, so Turf XP is absorbed.
- Correct AC-7 to "Lv 18 within 75 TE".
- Add an AC: Posse level at each Boss is band-top ± 2.

### Issue 12 — MINOR — Loyalty is trivially maxed where it matters, and its stat coupling is invisible (§3.6, F8)

**What is wrong.** A Posse cat goes from 38 to Sworn (never betrays, heir-eligible) in about 6 days if fed (F8's own check). Benched cats get posted (Issue 8). So Loyalty is rarely a live tension outside Life 8. Meanwhile ±5% stats from Loyalty is menu-only depth (the Pillar 3 violation list) and a rich-get-richer loop (OQ7).

**Fix.**
- **Cut Loyalty → stats** (`LOY_MIN`/`LOY_SPAN`).
- Halve MEAL to +2 and LESSON_TAKEN to +1, so Sworn takes about a Life of real attention.
- Rename "Share a Meal" to Nemesis's **Share a Morsel**: one verb, two contexts.

### Issue 13 — MINOR — Schema collision on `temperament` (§3.1, §3.2; Nemesis R2, R3.4)

**What is wrong.** Both docs add `temperament` to the One Cat Schema: Crew with 11 stat natures, Nemesis with 6 personalities (Braggart, Brooder, Schemer, Fraidy, Stalwart, Goofball). OQ15 foresaw this.

**Fix.** Use one field, Nemesis's. Add a stat column to R3.4:

| Temperament | + | − |
|---|---|---|
| Braggart | Bite | Hide |
| Brooder | Nerve | Zip |
| Schemer | Zip | Nerve |
| Fraidy | Zip | Bite |
| Stalwart | Hide | Voice |
| Goofball | Voice | Bite |

Mikan stays neutral. Delete the Crew enum.

### Issue 14 — MINOR — Zoomies II and Crew gating conflict with Combat and cost 5 cinematics (§3.8)

**What is wrong.** Combat defines one Zoomies per Style with no tiers (CR-13). "3 a.m. Zoomies" means 5 more cut-ins, the most expensive VFX in the game, for a Loyalty reward.

**Fix.** Cut Zoomies II. Keep the Zoomies I unlock (Crew Lv 8; Mikan at the cat flap) as a growth beat. Mikan's Prime milestone (Life 5) becomes Combat's call (proposal: Zoomies gauge fill +15%).

### Issue 15 — MINOR — Cat flavour: strong where the verb matches the cat, generic or off-tone elsewhere (§3.9, §3.10)

**What works.** Loaf, Sit On It, Knock It Off, Box Fort, Biscuits, Bell Ringer, Chonk, Warm Lump, Motor and Lands On Feet are cat behaviour doing mechanical work (Pillar 1).

**What does not.** About 15 names are RPG convention with ears on: Pressure Point, Cheap Shot, Second Wind, Feint, Counter-Swipe, Lead Paw, Immovable, Shadow Step, Moonless, New Moon, Nine Shadows, Anchor Drag, Dawn Chorus. Three use wound vocabulary that clashes with brief §9 ("no wounds"): **Hamstring, Go For The Throat, Neck-Nip**.

**Fix** (renames, where the Move survives the cut):

| Current | Rename |
|---|---|
| Hamstring | Ankle Ambush |
| Go For The Throat | Pick On The Puffed |
| Neck-Nip | Scruff Nip |
| Feint | Fake-Out Hop |
| Counter-Swipe | Batting Practice |
| Cheap Shot | Tail Yank |
| Lead Paw | Big Wind-Up |
| Immovable | Dead Weight |

Combat's "Neck Nip" needs the same rename.

### Issue 16 — MINOR — Scope and slice mismatches (§3.9 tiers, OQ19)

**What is wrong.** Crew's MVP 8 (B1 B2 S1 S2 Y1 Y2 T1 T2) differs from Combat's MVP 8 (Claw Flurry, Shred, Belly Flop, Loaf, Drop Strike, Vanish, Purr, Shelf Sweep). The slice includes Avalanche, which no slice cat can learn (Issue 7).

**Fix.** Combat's MVP 8 is canonical. The slice uses Scrapper, Bruiser and Yowler with Combat's 12 starters for those Styles plus 4 Crew Moves. Avalanche stays a recruit-Daifuku-only bonus, if Bosses are recruitable (§5).

### Issue 17 — MINOR — Lesson throughput (§3.7)

**What is wrong.** "One give, one take per cat per day", with Mikan as the library, means Mikan teaches one Lesson a day. Re-kitting a Posse through Mikan takes up to 12 in-game days, about 6 h of play. That is slower than any Pokémon TM, and it discourages exactly the experimentation that "breed builds" needs. Morsel costs already gate it.

**Fix.** Mikan may teach **3 Lessons per day**. Other teachers keep 1.

---

## 4. Cross-doc conflicts

| # | This doc says | Other doc says | Resolution |
|---|---|---|---|
| X-1 | "type, Paw cost, Power, Frazzle and effect are a *proposal to Combat*" (§ Reading note); 64 Moves, 20 Knacks | Combat CR-17: "Combat owns every Move, Knack and Zoomies definition and number… this section fixes… the first 20 Moves and 10 Knacks" | Issue 1: Combat owns numbers in one data file; Crew owns learnsets keyed by id |
| X-2 | "Pow… 1-Paw ≈ 3–4× BH"; Frazzle is paid from the 3.5 HE budget (F10 `FRZ_HE`) | Combat CR-17.1: "1 Paw: MV 3.5… FZ 35" (both) | Combat's scale. Every Crew row is re-expressed |
| X-3 | P7 **Nine Shadows** (Move); T7 **Everything Off The Shelf** (Move) | Combat CR-13: Prowler Zoomies "**Nine Shadows**"; Trickster Zoomies "**Everything Off the Shelf**" | Zoomies keep the names; the Moves are renamed |
| X-4 | A-4: "Bruiser resists Thump… Scrapper resists Claw… Prowler resists Fang… Yowler resists Yowl… Trickster resists Thump, weak to Fang" | Combat CR-14.2: Bruiser resists **Claw**, Scrapper **Fang**, Prowler **Yowl**, Yowler **Thump**, Trickster **none/none** | Combat's table. §3.13's Boss rhythm must be redone: Daifuku (Bruiser) **resists Mikan's native Claw** in Life 2. That is the real first restructure moment, not Ikari. Ikari (Scrapper) is neutral to Claw |
| X-5 | Willingness roll, 5–95% (F5) | Nemesis R7.2: Recruit "Joins the Crew" when available | Deterministic (Issue 3) |
| X-6 | F7: `45 − 0.4G + …`, clamp 5–70 | Nemesis F18: `50 − 0.4G + 0.3R + t_L + 20s`, clamp 5–80 | F18 plus Crew's Offering and return terms (Issue 3) |
| X-7 | A-12: "Shifty (0–19) as the eligible band and Sworn as immune" | Nemesis R9.6: "Loyalty is below 30… enters Wavering"; Lure Holds Firm at ≥ 60 | Shifty = 0–29 |
| X-8 | Dismissal: "handed to Nemesis as a Rival; proposed Grudge +30, or a clean parting with Grudge 0 if Loyalty was 60+" | Nemesis edge cases: "dismissal, which Nemesis treats as a Chase Off" | Chase Off below Loyalty 60; accepted-Nose-Touch state at 60+ |
| X-9 | `DefaultKit`: "the four most recent Instinct Moves… 15% (Tough) / 60% (Captain)… Street" | Nemesis R3.7: "Tough 2 Moves and 1 Knack, Captain 4 and 2" | Nemesis's counts with Crew's selection rule. Every Rival gets one `signature` Street Move (Issue 4) |
| X-10 | Rival "more than 5 levels above Mikan" blocks Recruit | Nemesis F8 caps Rival level at Mikan + 3 | Delete the block |
| X-11 | Boss Recruit: blocked until district claimed; base Willingness 5 | Nemesis R7.4: Recruit "additionally requires Regard ≥ 50" | Nemesis's gate only |
| X-12 | `temperament` (11 stat natures) | Nemesis `temperament` (6 personalities) | One field (Issue 13) |
| X-13 | Comes Knocking: Nose-Touched Rival with Grudge 0 "may later appear at the Lot" | Nemesis has no such event; Nodding Cats (Regard ≥ 50, Grudge < 25) tip and duel | Nemesis adds: a Nodding Cat at Regard ≥ 70 may Come Knocking (Nemesis decides when) |
| X-14 | Quick Swat "refunds 0.25 Paw on hit" | Combat CR-7: "Moves never refund their own cost" | Cut the refund |
| X-15 | K1 Thick Scruff: "Damage from behind −30%"; K11 Motor: ally regen aura; K16 Pack Cat: +4% damage per ally | Combat CR-17.4: Thick Scruff "Brace blocks an extra 15 pp"; Motor "Zoomies gain +25%"; Pack Cat "AI Pounce ×0.65" | Combat's effects; Crew keeps names and learn data |
| X-16 | Old Boss raises AI Paw fill to 55/60/70% in Lives 7–9 | Brief §8: AI fill 50% (canon); Combat's Pack Cat Knack also edits it | Director ruling (§5) |
| X-17 | "Share a Meal" (+3 Loyalty) | Nemesis "Share a Morsel" (Humbled cats) | One verb, Share a Morsel |

---

## 5. Needs director ruling

1. **Catalogue size and owner.** Confirm Combat owns all Move/Knack numbers. Confirm the target is **50 Style Moves + 4 Home Moves** (inside "about 60") rather than 60/64.
2. **Mikan's cross-Style freedom** (Issue 5, OQ4). Recommended: at most 2 cross-Style slots and no potency penalty. The alternative is to accept "Mikan carries" as the protagonist fantasy, but then drop "interchangeable companions" from the pitch.
3. **Recruit is deterministic** (Issue 3, OQ6). Recommended: yes. Courtship lives in Regard and Nemesis's gates.
4. **Are Bosses recruitable?** (OQ14, Nemesis R7.4). Recommended: yes, from Daifuku on, at Regard ≥ 50. This is the only route to a Boss signature for Crew cats, and an ex-Boss Warden is a top-tier Pillar 4 story. Botan: Narrative's call.
5. **Old Boss** changes a canon number (50% AI fill). Recommended: approve 55/60/70%. It is the cleanest way to deliver Life 9's "the Crew does the fighting".
6. **Home Moves gated by Bond** (OQ11). Recommended: keep. They arrive one Life late at worst, which is a gentle nudge, not a punishment under §5.2.

---

## 6. Cut list

| Cut | Saves | Why |
|---|---|---|
| **Elders** (6 NPC cats, 600 Morsels + 4 Shinies each) | 6 characters, 6 placements, a Shiny sink, a UI flow | A shop that duplicates Lessons (Issue 7) |
| **Keepsakes** (5 items, permanent-loss rule) | 5 placements, 5 expensive conditional Moves | TMs with fur; route duplication (Issue 7) |
| **Zoomies II** | 5 cinematics | Combat has no tiers (Issue 14) |
| **F5 Willingness roll** and its 13 knobs | A formula, ear-posture-to-odds UI, refusal flow | Deterministic recruit (Issue 3) |
| **Loyalty → stats** | Two knobs, invisible ±5% | Menu-only depth (Issue 12) |
| **Crew Temperament enum** | 11 values | Merge into Nemesis temperament (Issue 13) |
| **Pending list, refresher multiplier, last-copy rules** | UI and data | Toothless forgetting (Issue 6) |
| **Friend Strays 12 → 6** | 6 placements | Strays dominate (Issue 9) |
| **14 Moves** → 50 + 4 Home | Animation, AI, VFX | Issue 10: **S6 Second Wind, B6 Big Stretch, P11 Bag Lurk, T8 Play Dead, S5 Hind-Rake, T3 Bait (keep Combat's Bait; cut the Crew duplicate row), B8 Shoulder Check (merged with Head-Bonk into Combat's Shoulder Check), Y7 Dawn Chorus, B11 Box Fort, S11 Feather Frenzy, P10 Moonless, T11 Glint, Y10 The Stare, B10 Immovable** |
| **Knacks K9 Night Eyes, K17 Lone Tom, K10 Big Lungs, K13 Butterfingers** | 4 Knacks, replaced by Combat's Always Lands, Alley Eyes, Loud Purr, Kick 'Em | Phase-only or Posse-dead (Lone Tom needs no ally within 5 m in a 12 m ring with 4 cats), or duplicates Style passives |

---

## Appendix A. Row-by-row catalogue audit

HE uses the doc's own formula (`pow × n + 0.10 × frz × n + utility`, reference n = 1.6 small AoE, 2.2 large). "Under Combat" is the direction the value moves once Swagger and Combat's output rate apply. Verdicts: **OK**, **Over**, **Under**, **Dead**, **Dominated**, **Dup** (near-duplicate).

| ID | Move | Doc HE | My HE | Under Combat | Verdict / note |
|---|---|---|---|---|---|
| B1 | Head-Bonk | 3.5 | 3.5 | ↑ (interrupt → Ruffled 4 s) | OK; merge with B8 into Combat's Shoulder Check |
| B2 | Loaf | 3.5 | 3.5 | = | OK; take Combat's numbers |
| B3 | Belly Flop | 3.8 | 3.84 (2.4–7.2) | FZ far below Combat's 45 | OK; Combat's numbers |
| B4 | Sit On It | 3.5 | 3.5 | Combat makes it 2 Paw | Combat's row |
| B5 | Scruff Grab | 3.7 | ≈3.4 | Hide-down is not a CR-15 status | Re-rider to Cowed or cut the debuff |
| B6 | Big Stretch | 3.5 | ≈2.9–3.5 | = | **Dead** (Purr exists at Lv 1); cut |
| B7 | Wrecking Loaf | 8.0 | 8.0 | = | OK |
| B8 | Shoulder Check | 3.0 | 2.5–3.5 | — | **Dominated** by B1 off-wall; fails rule (a); merge |
| B9 | Lead Paw | 3.5 | 3.5–5.0 | = | OK; rename |
| B10 | Immovable | 8.0 | 4–8 (hit-count dependent) | Unclear on Bosses | Cut (Elder route gone) |
| B11 | Box Fort | 3.5 | **5–6** | ↑ | **Over** +50–70%; cut |
| B12 | Avalanche | 8.1 | 3.7–18.5 | = | **Dead vs Bosses**; rename and add a primary-target FZ rider |
| S1 | Bunny-Kick | 3.5 | 3.5 | 0 FZ vs 35 | OK; becomes Combat's Claw Flurry |
| S2 | Quick Swat | 3.4 | 3.4 | Refund illegal | Cut the refund |
| S3 | Pounce | 3.5 | 3.5 | Name collides with verb | Rename "Leap" |
| S4 | Whirl | 3.2 | 3.2 (2.0–6.0) | = | OK |
| S5 | Hind-Rake | 3.4 | 3.4 | Slow is not a status | **Dominated** by P4; cut |
| S6 | Second Wind | 3.2 | **≈1.5** | = | **Dead**; cut |
| S7 | Thousand Paws | 8.0 | 8.0 | = | OK |
| S8 | Counter-Swipe | 3.5 | 0.9–5.2 | ↑↑ (Ruffle) | Keep as Scrapper's one Ruffle; ≤3 s on Captain+ |
| S9 | Wall-Kick | 3.5 | 2.9–3.5 | Name collides with Combat | Fails rule (a) floor; rename or merge into Combat's Wall-Kick |
| S10 | Fish-Hook | 3.2 | 3.2 | ↑↑ | Remove Ruffled; keep the yank |
| S11 | Feather Frenzy | 7.5 | 7.5 | ↑ | Cut (Keepsake) |
| S12 | Anchor Drag | 8.0 | 7.0–9.0 | = | OK |
| P1 | Neck-Nip | 3.25 | 2.5–4.0 | Collides with Combat's 2-Paw | Fails rule (a); rename, Combat reconciles |
| P2 | Vanish | 3.5 | 3.5 | ↑ | Combat's numbers; Prowler's one Ruffle |
| P3 | Drop In | 3.5 | 3.0–4.5 | = | Becomes Drop Strike |
| P4 | Hamstring | 3.2 | 3.2 | Cowed-equivalent | OK; rename; damage-down → Cowed |
| P5 | Pressure Point | 3.5 | 3.0–4.5 | Double-dips Ruffled's ×2 FZ | Make it +10 FZ flat; rename |
| P6 | Shadow Step | 3.1 | 3.1 | ↑↑ | Combat's row (extends Ruffled, does not apply it) |
| P7 | Nine Shadows | 7.2 | 6.0–9.0 | Name collides with Zoomies | Fails rule (a); rename |
| P8 | Scent Mark | 3.3 | ≈3.3 | ↑↑ (output ×3) | Over under Combat; +20% → Fired Up on allies vs that target, 6 s |
| P9 | Cheap Shot | 3.5 | 3.5 | = | OK; rename |
| P10 | Moonless | 7.6 | 7.6 | ↑↑ | Cut (Elder; Ruffle flood) |
| P11 | Bag Lurk | 3.3 | 0–4.7 | — | **Dead**; cut |
| P12 | New Moon | 7.8 | 6.9–7.8 | ↑ | OK; Ruffled ≤3 s on Captain+ |
| Y1 | Hiss | 3.2 | ≈3.7 | Collides with Hiss verb | Becomes Withering Hiss (Cowed) |
| Y2 | Purr | 3.5 | 3.5 | = | Combat's row |
| Y3 | Yowl | 3.5 | 3.5 (range free) | Combat charges 15% for range | Rename to "Howl" ("Caterwaul" is already a canon term) |
| Y4 | Back-Talk | 3.5 | 3.5 → **~16 on Boss** | ↑↑↑ | **Over** ×4.5; becomes Combat's Big Talk, no Ruffled |
| Y5 | Rumble | 3.25 | ≈3.25 → ~11 | ↑↑ | **Over** under Combat; becomes Fired Up (+20%) for 8 s |
| Y6 | Lullaby | 3.2 | 3.2 | ↑ (Ambush wake) | OK; doze → Combat's Startled or cut |
| Y7 | Dawn Chorus | 7.8 | 7.2–7.8 | = | **Dominated** by Combat Purr's group mode; cut |
| Y8 | Spit | 3.3 | 3.3 | ↑ (interrupt) | OK |
| Y9 | Chirrup | 3.3 | 2.6–4.0 | = | OK; good conductor tool |
| Y10 | The Stare | 8.0 | ≈8 | Hide-down not a status | Cut |
| Y11 | Catnip Sermon | 7.5 | ≈6.5 | Nipped is a new status | Move to Street; Nipped → Fired Up + Zoomies 10% |
| Y12 | Queen's Scolding | 8.0 | 3.7–17.0 | Cowed | OK |
| T1 | Knock It Off | 3.5 | 3.5–4.2 | = | Becomes Shelf Sweep |
| T2 | Dirt Kick | 3.1 | 1.8–5.4 | Dirt-Eyed | Becomes Dirt Devil |
| T3 | Bait | 3.3 | 3.3 | Combat's Bait is better specified | Use Combat's row; cut the Crew duplicate |
| T4 | Ledge Shove | 3.2 | 2.5–5.7 | ↑ | OK (Trickster's one Ruffle, terrain-gated) |
| T5 | Hairball | 3.4 | 2.5–5.5 | Slick → Soggy | OK |
| T6 | Tin-Can Clatter | 3.5 | 1.6–8.0 | ↑ (Fear source) | OK; good counter-pick |
| T7 | Everything Off The Shelf | 8.5 | 6.0–9.0 | Name collides with Zoomies | Rename |
| T8 | Play Dead | 3.3 | ≈3 | = | Cut (cost) |
| T9 | Feint | 3.3 | 3.3 | ↑↑ | Keep; ≤3 s on Captain+; rename |
| T10 | Bucket Brigade | 7.8 | 4.0–12.0 | ↑ (Water Fear) | Move to Street |
| T11 | Glint | 3.3 | 3.3 | ↑↑ | **Dominates** Bait; cut |
| T12 | Switcheroo | 8.0 | 8.0 | ↑ | Remove Ruffled; keep the swap |
| H1–H4 | Home Moves | 3.3–12.6 | ≈ as stated | Crib Guard needs a 3-Paw row in CR-17.1 | Keep all; Combat adds a 3-Paw budget row (MV 13 / FZ 105) |

## Appendix B. XP pacing arithmetic

| Span | Levels | TE per level | TE |
|---|---|---|---|
| Life 1 (Lv 1→3) | 2 | 6, 9 | 15 |
| Life 2 (Lv 3→8) | 5 | 12, 15, 18, 21, 24 | 90 |
| Lives 3–7 (Lv 8→48) | 40 | 24 | 960 |
| **Total to Lv 48** | | | **1,065** (≈ 367 encounters at 2.9 TE) |
| Turf XP over the game | | | ≈ +190 (not in the doc's pacing) |
| Days at 26 TE/day, fights only / with Turf XP | | | ≈ 41 / ≈ 34 |

**AC-7 check** (Lv 10 cat in Lv 20 fights, TE per level = need ÷ (88 × diff_mult)):

| Level | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
|---|---|---|---|---|---|---|---|---|
| TE | 5.24 | 6.03 | 6.94 | 7.98 | 9.19 | 10.60 | 12.27 | 14.30 |

Sum = **72.6 TE** to Lv 18 (AC-7 says 60).

# Crew & Progression

> **Status**: In Review (first draft, written in parallel with the other system GDDs)
> **Author**: systems-designer (Crew & Progression specialist)
> **Last Updated**: 2026-11-23
> **Last Verified**: 2026-11-23 against `design/creative-brief.md` v1.0
> **Implements Pillar**: 3 (Conduct the Brawl) and 4 (Rivals Remember); serves 2 (Two Lives, One Clock) through Mikan's Home Moves and ageing; obeys 1 (Cat's-Eye Truth)

## Summary

Crew & Progression is how cats get stronger and how the player's gang takes shape: recruiting cats, levelling them, teaching them Moves and Knacks from each other "like Pokémon", and keeping them loyal. It exists so that the four-cat Posse is a thing the player *built*, out of individuals with history, and so that Mikan's own growth from kitten to elder is felt in the numbers.

> **Quick reference** — Layer: `Core` · Priority: `Vertical Slice` (stat curves and 8 Moves' learn data needed at `MVP`) · Key deps: `Combat, Nemesis, Territory & Economy, Narrative (Bond, Life), Clock`

**Reading note on ownership.** The brief (§6) gives this doc: stat growth, XP, Power Rating, recruitment flow, Crew cap usage, learnsets, Lessons, slot rules, Mikan's cross-Style learning, Loyalty, Sentry XP, Mikan's ageing modifiers, the heir. It gives **Combat** "all Move, Knack and Zoomies definitions and numbers". The Move catalogue in §3.9 and the Knack list in §3.10 were requested here as a foundation, so they are split by column: **name-to-Style assignment, who can learn it, how it is obtained, and Rank are owned here; type, Paw cost, Power, Frazzle and effect are a *proposal to Combat*** and are overridden by the Combat GDD wherever they differ. Every such column is marked (P).

**Term note.** The request for this doc used "Bond" for closeness with companion cats. In canon, **Bond** is Mikan's closeness with the household (0–10 hearts) and the per-Crew-cat meter is **Loyalty** (0–100). This doc uses the canon terms: Loyalty for Crew, Bond only for Mikan's Home Moves.

---

## Overview

You start as one kitten with two Moves. Over nine Lives you gather a **Crew** of up to 24 known cats: Strays you befriended with food and slow blinks, Rivals you Routed and offered a place, a few who came with the story, and the odd old enemy who turned up at the Lot one morning because you once showed respect. Three of them walk with Mikan as the **Posse**; the rest lounge at the Lot, stand guard as **Sentries**, or run a district as **Warden**. Every cat has one of five **Styles**, five stats that grow from Lv 1 to 50 on a Style curve, exactly **4 Moves, 2 Knacks and 1 Zoomies**. Cats learn Moves by instinct as they level, by **Lessons** from other Crew cats at the Lot, by **Watching** enemies use them, from five old **Elders**, and from five **Keepsakes** (a cardboard box, a feather wand...). A cat that learns a fifth Move must forget one. Mikan is the exception to everything: a Scrapper who can learn any Style's Moves, never forgets one, learns four **Home Moves** from life with Haru's family, and whose stats shift with age until, as an elder, the bell-wearing boss mostly conducts while the Crew does the fighting. **Loyalty** decides who will teach, who can be trusted with a district, and (read by Nemesis) who might walk out with a Patch.

---

## Player Fantasy

**"These are MY cats."** The fantasy is the neighbourhood boss cat who knows every member of the gang by the notch in their ear. Not a collection: a crew.

- **Pride of authorship.** "My Posse" is a sentence the player says. The Bruiser knows Purr-adjacent tricks because *I* had the old Yowler teach her; the Prowler carries a Boss's signature Move because *he watched it land on him eight times*.
- **The pleasure of the swap.** Unlike a fixed cast, anyone can be benched today and star tomorrow. Meeting a wall (a Boss who shrugs off Claw) is answered by walking to the Lot, not by grinding.
- **The Pokémon itch, kept small.** Seeing a Rival use a Move you do not have, and wanting it: by Watching it, or by recruiting the cat who knows it.
- **Enemies become family.** The cat who humiliated you in Life 2 is your Warden in Life 6, and still has the Title he earned off you. Loyalty that starts at 8 and ends at 100 is a story.
- **Growing up, growing old.** Kitten Mikan is fast and weak. Prime Mikan is everything. Elder Mikan is slow, loud, and surrounded by cats who would do anything the bell tells them. The numbers should make the player feel that without a word.
- **Home leaks into the street.** Mikan kneads because of a lap. Mikan guards because of a crib. The four Home Moves are the only place the two lives touch mechanically, and they should feel like a secret between player and cat.

Emotional targets by system: **recruiting** = courtship with stakes (ears forward or ears back?); **Lessons** = two cats play-fighting in a vacant lot, one obviously showing off; **level-up** = a stretch and a shake, no fanfare bigger than a Pile-On; **betrayal** = "I should have fed him."

---

## Detailed Design

### Core Rules

Section map: 3.1 the cat sheet · 3.2 stats and Styles · 3.3 XP and levels · 3.4 recruitment · 3.5 Crew, Posse, guard duty · 3.6 Loyalty · 3.7 Moves: slots, learning, forgetting · 3.8 Zoomies unlocks · 3.9 Move catalogue · 3.10 Knacks · 3.11 Mikan · 3.12 the heir · 3.13 synergy, counters and example Posses.

#### 3.1 The cat sheet

All cats use the One Cat Schema (brief §6). This doc **writes** `level, xp, stats{}, moves[4], knacks[2], loyalty, assignment` and the *unlock tier* of `zoomies`; it **reads** `style, coat_seed, grudge, rank, traits, memory`.

Additional per-cat data this design needs (requested schema extensions, see Assumptions):

| Field | Type | Who has it | Purpose |
|---|---|---|---|
| `temperament` | enum (11) | all cats | ±8% stat nudge. May be derived from `coat_seed` instead of stored |
| `watch_pips{move_id: int}` | map | Crew + Mikan | Progress toward learning a Move by Watching |
| `pending_learn[≤3]` | list | Crew + Mikan | Moves/Knacks earned but not yet slotted |
| `repertoire[]`, `knack_repertoire[]` | lists | **Mikan only** | Everything Mikan has ever learned |
| `grudge_at_recruit` | int 0–100 | Crew | Frozen copy for the Loyalty "thaw" rule |
| `former_rank` | enum | Crew | Neglect multiplier in Loyalty |
| `days_idle` | int | Crew | Bench-neglect grace counter |
| `zoomies_tier` | 0/1/2 | all | Unlock state (definition is Combat's) |
| `stray_trust` | 0–3 | Friend Strays (not yet Crew) | Befriending progress |

#### 3.2 Stats, Styles and Temperament

1. Five stats: **Nerve, Bite, Hide, Voice, Zip** (brief §3.4). A stat is a pure function of level, Style, Temperament, and (Crew) Loyalty or (Mikan) age. It is never bought, equipped or rolled. See F1.
2. **Style weights** (multipliers on the Style-neutral base). Every row sums to **5.00** (the "budget-5 rule"): a Style is a redistribution, never a raw power difference.

| Style | Nerve | Bite | Hide | Voice | Zip | Sum | Reads as |
|---|---|---|---|---|---|---|---|
| **Bruiser** | 1.30 | 1.00 | 1.25 | 0.75 | 0.70 | 5.00 | A warm, immovable lump |
| **Scrapper** | 1.00 | 1.20 | 0.90 | 0.75 | 1.15 | 5.00 | All elbows |
| **Prowler** | 0.80 | 1.30 | 0.75 | 0.85 | 1.30 | 5.00 | Glass with claws |
| **Yowler** | 0.90 | 0.75 | 0.95 | 1.35 | 1.05 | 5.00 | A voice with a cat attached |
| **Trickster** | 0.90 | 0.95 | 0.90 | 1.15 | 1.10 | 5.00 | Good at everything a little |

   Nerve weights 0.80 (Prowler) and 1.30 (Bruiser) are canon. The rest are this doc's.

3. **Temperament**: every cat has one, fixed for life, giving +8% to one stat and −8% to another. Eleven exist. It makes two Bruisers of the same level different cats, cheaply.

| Temperament | + | − | | Temperament | + | − |
|---|---|---|---|---|---|---|
| Stubborn | Nerve | Zip | | Greedy | Nerve | Voice |
| Bitey | Bite | Hide | | Scrappy | Bite | Voice |
| Thick-Skinned | Hide | Voice | | Cagey | Hide | Bite |
| Mouthy | Voice | Bite | | Chatty | Voice | Hide |
| Skittish | Zip | Nerve | | Wired | Zip | Hide |
| Even | — | — | | | | |

   Mikan is always **Even**. Story recruits have authored Temperaments. Everyone else: `temperament = TEMPERAMENTS[hash(coat_seed) mod 11]`.

4. Stats are recomputed **only** at: level-up, recruitment, `DayEnded` (after the Loyalty tick), and `LifeAdvanced` (Mikan). Never mid-encounter.
5. When max Nerve changes, current Nerve keeps the same percentage of max.

#### 3.3 XP and levelling

1. Levels 1–50. XP needed for the next level: F2. XP awarded per Routed enemy: F3.
2. **XP is not split.** Every Posse cat receives the full award for every enemy Routed in an encounter the Posse **wins** (`EncounterEnded.outcome = win` or `rival_fled`). Awarded once, at encounter end.
3. A Posse cat that was itself **Routed** during the encounter receives **50%** ("watched the end from a fence").
4. On `loss` or `player_fled`: no XP for anyone.
5. **Level-difference multiplier** (F3): enemies above a cat's level pay more, enemies below pay less, down to 10% at 6+ levels under. This is both the catch-up system for benched cats and the anti-grind brake. There is **no hard level cap per Life**: a district's enemies top out at its band, so the multiplier self-limits a Posse to about band-top + 5.
6. **Lot gossip**: Crew cats who are Lounging (not in the Posse, not posted) receive **25%** of each award, computed against their own level.
7. **Sentry XP** (F4): a posted Sentry or Warden earns a flat nightly award for holding the post, plus full XP for raiders Routed in a successful raid defence. Posted cats do not also get Lot gossip.
8. **Turf XP**: when a Patch changes to the Bell Clowder (`PatchChanged`), the current Posse gains `4 × tough_yield(patch_level)`. On `DistrictClaimed`, **every** Crew cat gains 50% of its own `xp_to_next`.
9. Level-ups resolve at encounter end, in sequence (a cat can gain several). A single award is capped at 3 levels' worth of XP. No full heal on level-up.
10. At Lv 50, XP stops accumulating.
11. There are **no purchasable XP items**. Morsels buy Lessons, recruits and meals, never levels (protects brief risk 5: Tribute must fund choices, not replace fighting).
12. Rivals and Strays use the same curves: a Rival's stats at level L are this doc's stats; the enemy Nerve multipliers by rank (Captain ×4, etc.) are applied on top by Combat.

Expected pacing (derivation in F2): Life 1 ends at Lv 3, Life 2 at 8, then +8 per Life to Lv 48 at Life 7, about 1.1 levels per in-game day from Life 3 on.

#### 3.4 Recruitment

There are four ways a cat joins. All four end in the same **Join step**.

**A. From a fight: the Recruit Verdict (Rivals).**
1. UX's Verdict prompt asks this system for `RecruitWillingness(rival_id, offer)` (F5) and shows it as **ear posture** on the Routed Rival (ears flat / sideways / swivelling / forward = under 25% / 25–49% / 50–74% / 75%+) and as a number in system UI.
2. The player chooses an **Offering**: nothing, half, fair (1× the asking price, F6) or a feast (2×). Offerings come from *carried* Morsels.
3. Nemesis emits `VerdictApplied(recruit)`. This system rolls against Willingness.
4. **Accepted**: Offering is consumed; go to Join step.
5. **Refused**: the Rival eats **25%** of the Offering and turns its back; the rest is returned. This system emits `RecruitRefused(rival_id)`. Proposed to Nemesis: the Verdict prompt reopens with Recruit greyed out, and the refusal is written to Memory. Each refusal adds **+15** to that Rival's future Willingness (max +45): persistence is rewarded, and a wanted cat becomes a multi-fight courtship.
6. Hard blocks (Recruit option disabled, with reason shown): Crew is at cap; Rival is a Critter; Rival is more than **5 levels above Mikan**; Rival is a Boss whose district is not yet claimed; Rival is Botan (see Open Questions).

**B. From a defeated Stray.** Routing a Stray opens a one-line prompt (Recruit / Let go) using the same Willingness formula at the Stray base. Strays are not tracked by Nemesis, so there is no Verdict and no Memory yet. A refused Stray leaves; it can be met again.

**C. From friendship: Friend Strays.** About **2 hidden Strays per district** (12 in the full game) are found by scent trail and are not hostile.
1. Each has **Trust** 0–3. Each in-game day the player may earn **one** pip per Stray with one cat-true gesture: leave food (`10 × district_number` Morsels), hold a slow blink within 4 m for 3 s, or nap at a Sunspot within 10 m of them.
2. At Trust 3 the Stray follows Mikan to the Lot: guaranteed join, Loyalty 55.
3. A Friend Stray may instead be fought (path B) at any Trust; each Trust pip adds +10 Willingness.

**D. From story and from respect.**
- **Story recruits**: authored cats who join at scripted beats (this doc reserves **5 slots, one per Style**, the first in Life 1 so the Posse "grows one cat at a time"; who they are belongs to Narrative). Guaranteed, Loyalty 60, never refuse.
- **Comes Knocking**: a Rival given Nose-Touch whose Grudge is 0 may later appear at the Lot at morning (Nemesis decides when). The player accepts or declines for free. Loyalty 65.
- **Humbled cats**: a Rival living Humbled in a Patch you hold can be offered a place without a fight, using F5 with no fight-quality terms and their live Grudge.

**Join step.**
1. The cat keeps `name, title, coat_seed, style, level, xp, traits, memory, moves, knacks, zoomies` (canon: recruited Rivals keep everything).
2. `loyalty` is set by F7. `grudge_at_recruit` and `former_rank` are frozen. `rank` is cleared, `clowder` becomes the Bell Clowder, `assignment = lot`.
3. This system emits `CatRecruited(cat_id, source)`.
4. If the Posse has fewer than 3 Crew, the new cat is offered a Posse place on the spot.

**Rival kits (service to Nemesis/Combat).** `DefaultKit(style, level, rank, seed)` returns the Moves and Knacks a generated cat has: the four most recent **Instinct** Moves of its Style at its level; then, with probability **15% (Tough/Stray) / 60% (Captain)**, one of them is replaced by a **Street** Move of its Style (§3.9). Bosses are authored and always carry their signature. This is what makes "recruit him for the Move he knows" a real motive.

**Leaving the Crew.** Only three ways, none of them death: `BetrayalTriggered` (Nemesis), **Dismissal** (the player Chases Off their own cat at the Lot: the cat is handed to Nemesis as a Rival; proposed Grudge +30, or a clean parting with Grudge 0 if Loyalty was 60+), or being named heir's predecessor is not one of them (nobody leaves in Life 9). A departing cat takes its Moves with it.

#### 3.5 Crew, Posse and guard duty

1. **Crew cap** is read from Clout (Territory & Economy owns the thresholds). Canon endpoints are 6 and 24; this doc assumes **6 / 8 / 10 / 13 / 16 / 20 / 24** across the seven ranks. Mikan does not count toward the cap.
2. Every Crew cat has exactly one `assignment`:

| Assignment | Count | What the cat does | XP | Loyalty/day |
|---|---|---|---|---|
| **Posse** | 3 (fewer early) | Fights beside Mikan | Full | + for fighting |
| **Sentry** | 1 per Patch, 2 at a Den | Guards a Patch overnight; resolved by Territory using `PowerRating` | Sentry XP | +1 if post held |
| **Warden** | 1 per claimed district | Runs a district | Sentry XP ×1.25 | +1 |
| **Lounging** (at the Lot) | the rest | Nothing | 25% gossip | −1 after 2 idle days (×former-rank) |

3. **Changing the Posse**: at the Lot, freely. Anywhere else outside combat, by **Tail-Up**: Mikan raises tail and chirps, the outgoing cat peels off home and a chosen *Lounging* cat arrives over the High Road in about 5 s. Rules: not during an encounter or Standoff; not inside Haru's wall (Crew never enter); **30 s cooldown**; posted cats cannot be Tail-Upped (un-post them first, under Territory's rules); a **Routed** cat cannot be brought in until it recovers (Sunspot nap or home, canon).
4. A cat brought in arrives with the Nerve and Zoomies gauge it last had today. Zoomies gauges are per cat and reset on sleep (canon).
5. Mikan cannot leave the Posse. In Life 9 Mikan is still in the Posse (§3.11).
6. Slot changes: a **Crew** cat's Moves change only by learning (§3.7). **Mikan** re-slots from the Repertoire at the Lot, at any Sunspot, or at home.

#### 3.6 Loyalty

Loyalty (0–100) is updated once per day at `DayEnded`, **before** the Night Shuffle, from that day's events (F8), so Nemesis's betrayal step reads fresh values. It is displayed as five tiers.

| Tier | Range | Owned here: what it unlocks | Proposed to other docs |
|---|---|---|---|
| **Shifty** | 0–19 | Fights. Will not teach. Cannot be taught Rank III+ Moves. Stat multiplier about ×0.95–0.97 | Nemesis: betrayal-eligible band. Territory: not eligible for Den Sentry or Warden |
| **Aloof** | 20–39 | Can be taught anything it is compatible with | Territory: ordinary Sentry posts allowed |
| **Steady** | 40–59 | **Can teach Lessons** | — |
| **True** | 60–79 | **Zoomies II** eligible (with Lv 30). Clean parting if dismissed | Territory: Warden-eligible. Combat: "Got Your Back" (if Mikan is Routed, each True+ Posse cat gains +0.5 Paw, once per fight) |
| **Sworn** | 80–100 | **Heir-eligible**. Lessons this cat teaches cost −25%. Immune to Life 8 absence drain | Nemesis: never betrays |

Rules:
1. Loyalty also scales all five stats by `0.95 + 0.10 × loyalty/100` (F1): a cat whose heart is not in it fights at 95%; a Sworn cat at up to 105%.
2. **Thaw**: a cat recruited with Grudge 50+ earns Loyalty gains at half rate until its Loyalty first reaches 40. Old enemies come round slowly.
3. **Neglect scales with former rank**: idle losses are ×1 for ex-Strays and ex-Toughs, ×2 for ex-Captains, ×3 for ex-Bosses. A proud cat left on a crate is the one who walks out (brief §7).
4. **Share a Meal**: once per day per cat, at the Lot, Mikan may drop Morsels (`2 × cat level`, proposed) in front of a Crew cat for +3 Loyalty. This is the direct Morsel-to-Loyalty sink.
5. Loyalty never changes a cat's Moves, level or XP.
6. `Loyalty(cat_id)` is the read-only query for Nemesis. Tier changes emit `LoyaltyTierChanged`.

#### 3.7 Moves: slots, learning, forgetting

**Slots.** 4 Moves, 2 Knacks, 1 Zoomies per cat (canon). The first Knack slot opens at **Lv 3**, the second at **Lv 12**.

**Crew cats know only what they have slotted.** Four Moves is the whole cat. Learning a fifth means choosing one to forget. Mikan never forgets (§3.11).

**Rank.** Every Move and Knack has a Rank that sets the minimum level to *learn* it by any route other than its own Instinct level:

| Rank | Min level | Typical content |
|---|---|---|
| I | 1 | First three Instinct Moves of each Style |
| II | 10 | Mid Instinct Moves, Street Moves, Keepsake Moves |
| III | 20 | Late Instinct Move, Elder Moves |
| IV | 30 | Capstone (Lv 34 Instinct) and Boss signature Moves, all 2-Paw |

**Style compatibility.** Each Move lists the Styles that can learn it (§3.9). A cat can always learn all 12 Moves native to its Style, plus 9–14 cross-Style Moves. Mikan can learn everything.

**Five ways to learn a Move.**

| Route | Rule |
|---|---|
| **Instinct** (level-up) | Each Style learns 7 of its 12 Moves at Lv **1, 1, 5, 10, 17, 25, 34**. Free |
| **Lesson** (cat teaches cat) | At the Lot. Teacher has the Move slotted (Mikan: in Repertoire), is **Steady+**; student is compatible, meets Rank, is not Shifty for Rank III+. Costs Morsels (F9). Each cat may **give one and take one Lesson per day**. Instant; the teacher keeps the Move. Student +2 Loyalty, teacher +1. Any Move can be passed on this way, including Elder, Keepsake and Boss Moves, once one Crew cat knows it. Zoomies and Home Moves cannot |
| **Watching** (observing enemies) | While a cat is in the Posse and standing, each time an enemy **cat** (not a Critter) uses a compatible, Rank-eligible Move it does not know, it gains 1 **Watch pip**; **2 pips if the Move hit that cat** ("learned the hard way"). Max 2 pips per Move per encounter. Thresholds: Rank I **3**, II **4**, III **6**, IV **8**. Mikan needs half (round up). Pips never decay |
| **Elders** (special teachers, places) | Five old cats, one per district 1–5, each at a fixed spot, each teaching one Rank III Elder Move (one per Style) to one compatible cat per visit. First teaching: proposed **600 Morsels + 4 Shinies**; re-teaching the same Move later: 300, no Shinies. A sixth Elder at Kasumi Heights teaches two Street Knacks |
| **Keepsakes** (items) | Five found objects, each teaching one Rank II Move to one compatible cat, once: Cardboard Box, Feather Wand, Paper Bag, Catnip Sprig, Pocket Mirror. Placement is Level/Economy's |

**Pending.** A Move or Knack earned with no free slot goes to `pending_learn` (max 3; a fourth pushes out the oldest, with a warning). A small "!" sits over the cat. Pending items are resolved any time outside combat: pick a slotted Move to replace, or discard.

**Forgetting and getting it back.**
1. **Old Habits**: any *Instinct* Move or native Knack of the cat's own Style at or below its level can be re-learned at the Lot for free, any time.
2. A forgotten non-Instinct Move is gone from that cat. It can be re-taught by Lesson at **50%** cost (a "refresher") if any Crew cat or Mikan still knows it, or by its Elder.
3. **Last copy warning**: if a cat is about to forget (or is about to be dismissed while holding) the Crew's only copy of a non-Instinct Move, the game says so. A Keepsake Move whose last copy is lost is lost for the playthrough.
4. Consequence, intended: **Mikan is the Crew's library.** Teach the boss first and nothing is ever truly lost; let a Shifty ex-Captain hold your only copy of a Boss Move and a betrayal costs you more than a Patch.

**Knacks** follow the same rules: 3 native Knacks per Style learned at Lv **3, 12, 22**; 5 Street Knacks from special sources; Lessons for Knacks cost a flat proposed 300 Morsels (native) or 600 + 2 Shinies (Street). Native Knacks can be taught only within their Style (and to Mikan); Street Knacks to anyone.

#### 3.8 Zoomies unlocks (the limit-break track)

Combat owns what each Zoomies does. This doc owns when a cat has one.

| Tier | Crew cats | Mikan |
|---|---|---|
| **None** | Below Lv 8 | Life 1 and early Life 2 |
| **Zoomies I** (the Style's Zoomies) | **Lv 8** | The first night out through the cat flap (mid Life 2); fallback Lv 6 if the event is missed by a bug or a cut |
| **Zoomies II** ("3 a.m. Zoomies": the upgraded form, numbers by Combat) | **Lv 30 and Loyalty 60+**. Once unlocked it stays, even if Loyalty later drops | Start of **Life 5** (Prime) |
| **Unique Zoomies** | A recruited Rival or Boss with a unique Zoomies keeps it; it has only one tier and is already "II" | Mikan's cannot be replaced |

Zoomies cannot be taught, Watched or forgotten. The single exception is the heir (§3.12).

#### 3.9 The Move catalogue

**64 Moves: 60 Style Moves (12 per Style) + 4 Home Moves (Mikan only).**

Legend.
- **Type**: Claw / Fang / Thump / Yowl, or — for non-damaging. (P)
- **Pw**: Paw cost. (P)
- **Pow**: damage in multiples of one basic hit (**×BH**), before the attacker's stat and target's resist. Canon: 1-Paw ≈ 3–4× BH, 2-Paw ≈ 8×. (P)
- **Frz**: Frazzle points per target hit. (P)
- **Effect** (P). "small AoE" hits up to 3 targets, "large AoE" up to 5.
- **Styles**: who can learn it. B Bruiser, S Scrapper, P Prowler, Y Yowler, T Trickster. Mikan can learn all. **Owned here.**
- **Source / Rk**: how it is obtained and its Rank. **Owned here.** `Lv n` = Instinct. `Street` = carried by some Rivals (§3.4); obtained by Watching or by recruiting a carrier, then Lessons. `Elder (district)`. `Keepsake (item)`. `Boss (name)` = that Boss's signature: Watch it during the Boss fight, or recruit the Boss.
- **HE**: Hit-Equivalent value in the reference encounter, with (worst–best) where it varies. See F10. Budget: 1 Paw = 3.5, 2 Paws = 8.0, 3 Paws = 13.0.
- **Tier**: M = in the 8-Move prototype, V = in the 16-Move vertical slice, F = full vision, F✂ = cut first in the 40-Move fallback.

**Bruiser** (Thump and Fang; tank and Frazzle builder)

| ID | Move | Type | Pw | Pow | Frz | Effect (P) | Styles | Source | Rk | HE | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| B1 | **Head-Bonk** | Thump | 1 | 2.0 | 15 | Short charge; interrupts a wind-up | B S | Lv 1 | I | 3.5 | M |
| B2 | **Loaf** | — | 1 | — | — | Tucks paws for 5 s: damage taken −50%; enemies within 4 m must target this cat | B | Lv 1 | I | 3.5 | M |
| B3 | **Belly Flop** | Thump | 1 | 1.4 | 10 | Small AoE landing | B T | Lv 5 | I | 3.8 (2.4–7.2) | V |
| B4 | **Sit On It** | Thump | 1 | 1.0 | 0 | Sits on a Tough/Stray: pinned 4 s. Captains and Bosses are not pinned; Frz 25 instead | B | Lv 10 | II | 3.5 | V |
| B5 | **Scruff Grab** | Fang | 1 | 2.5 | 0 | Target Hide −20% for 8 s | B P | Lv 17 | II | 3.7 | F |
| B6 | **Big Stretch** | — | 1 | — | — | Self: restore 20% max Nerve, clear debuffs | B Y | Lv 25 | III | 3.5 | F✂ |
| B7 | **Wrecking Loaf** | Thump | 2 | 4.0 | 35 | Rolling slam; knockdown 2 s | B | Lv 34 | IV | 8.0 | F |
| B8 | **Shoulder Check** | Thump | 1 | 1.5 | 10 | Dash, knockback 4 m; into a wall or prop: +1.0× and the prop triggers | B S T | Street | II | 3.0 (2.5–4.0) | V |
| B9 | **Lead Paw** | Thump | 1 | 3.0 | 5 | 1.0 s wind-up haymaker; ×1.5 vs Frazzled | B S | Street | II | 3.5 (3.5–5.0) | F✂ |
| B10 | **Immovable** | — | 2 | — | — | 8 s: cannot be staggered or moved, damage taken −40%; each enemy that hits it gains 8 Frazzle | B | Elder (Hidamari) | III | 8.0 | F✂ |
| B11 | **Box Fort** | — | 1 | — | — | Drops a box for 8 s; the ally inside takes −60% damage, fills Paws +25% faster, and loses enemy targeting | B T Y | Keepsake (Cardboard Box) | II | 3.5 | F✂ |
| B12 | **Avalanche** | Thump | 2 | 2.2 | 15 | Falls off something tall: large AoE | B | Boss (Daifuku) | IV | 8.1 (3.7–18.5) | V |

**Scrapper** (Claw, some Fang and Thump; fast melee)

| ID | Move | Type | Pw | Pow | Frz | Effect (P) | Styles | Source | Rk | HE | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 | **Bunny-Kick** | Claw | 1 | 5×0.7 | 0 | Grab and rake, five hits | S P | Lv 1 | I | 3.5 | M |
| S2 | **Quick Swat** | Claw | 1 | 2.5 | 0 | Instant, usable mid-combo; refunds 0.25 Paw on hit | S T Y | Lv 1 | I | 3.4 | M |
| S3 | **Pounce** | Fang | 1 | 2.8 | 7 | 8 m gap-closer | S P B | Lv 5 | I | 3.5 | V |
| S4 | **Whirl** | Claw | 1 | 2.0 | 0 | Tail-chasing spin: small AoE ring | S T | Lv 10 | II | 3.2 (2.0–6.0) | V |
| S5 | **Hind-Rake** | Claw | 1 | 2.2 | 0 | Target slowed 30% for 6 s | S P | Lv 17 | II | 3.4 | F |
| S6 | **Second Wind** | — | 1 | — | — | Self: Zip +30% for 10 s | S T | Lv 25 | III | 3.2 | F✂ |
| S7 | **Thousand Paws** | Claw | 2 | 10×0.7 | 1/hit | Ten-hit flurry | S | Lv 34 | IV | 8.0 | F |
| S8 | **Counter-Swipe** | Claw | 1 | 3.5 | 0 | 1.5 s stance: if struck, negate the hit, counter, target Ruffled 4 s; if not struck, refund 0.25 Paw | S P | Street | II | 3.5 (0.9–5.2) | V |
| S9 | **Wall-Kick** | Thump | 1 | 2.6 | 9 | Needs a wall or prop within 3 m, else 2.0× | S T | Street | II | 3.5 (2.9–3.5) | F✂ |
| S10 | **Fish-Hook** | Fang | 1 | 2.0 | 0 | Yanks an enemy up to 10 m to this cat's feet; Ruffled 4 s | S B | Elder (Shiosai) | III | 3.2 | F✂ |
| S11 | **Feather Frenzy** | Claw | 2 | 6.0 | 0 | AI Posse cats focus this target and deal +25% to it for 6 s | S P | Keepsake (Feather Wand) | II | 7.5 | F✂ |
| S12 | **Anchor Drag** | Fang | 2 | 5.0 | 20 | Drags the target through up to 2 other enemies (1.0× each) | S B | Boss (Ikari) | IV | 8.0 (7.0–9.0) | F |

**Prowler** (Fang and Claw; burst that needs a set-up)

| ID | Move | Type | Pw | Pow | Frz | Effect (P) | Styles | Source | Rk | HE | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | **Neck-Nip** | Fang | 1 | 2.5 | 0 | ×1.6 vs Ruffled or Frazzled | P S | Lv 1 | I | 3.25 (2.5–4.0) | F |
| P2 | **Vanish** | — | 1 | — | — | Unseen for 4 s, drops enemy targeting; next hit counts as an Ambush (Ruffled 5 s) | P T | Lv 1 | I | 3.5 | F |
| P3 | **Drop In** | Fang | 1 | 3.0 | 0 | Leap strike; from the High Road or from Vanish: +15 Frz | P S | Lv 5 | I | 3.5 (3.0–4.5) | F |
| P4 | **Hamstring** | Claw | 1 | 2.0 | 0 | Target deals −20% damage and is slowed 20% for 8 s | P S | Lv 10 | II | 3.2 | F |
| P5 | **Pressure Point** | Fang | 1 | 2.0 | 10 | Frz 25 instead if target is Ruffled | P B | Lv 17 | II | 3.5 (3.0–4.5) | F |
| P6 | **Shadow Step** | Fang | 1 | 2.2 | 0 | Blinks behind the target; Ruffled 3 s | P S | Lv 25 | III | 3.1 | F✂ |
| P7 | **Nine Shadows** | Fang | 2 | 5.0 | 10 | ×1.6 vs Frazzled | P | Lv 34 | IV | 7.2 (6.0–9.0) | F |
| P8 | **Scent Mark** | — | 1 | — | — | Marks one enemy 10 s: Posse deals +20% to it; it cannot hide; this cat's Moves treat it as Ruffled | P T Y | Street | II | 3.3 | F |
| P9 | **Cheap Shot** | Claw | 1 | 2.8 | 7 | Cannot be dodged or guarded | P S | Street | II | 3.5 | F✂ |
| P10 | **Moonless** | — | 2 | — | — | Whole Posse unseen for 3 s; each cat's next hit is an Ambush hit | P | Elder (Tsukimi) | III | 7.6 | F✂ |
| P11 | **Bag Lurk** | Fang | 1 | 3.5 | 0 | Hides in a paper bag for up to 12 s; first enemy within 3 m is struck and Ruffled 4 s | P T | Keepsake (Paper Bag) | II | 3.3 (0–4.7) | F✂ |
| P12 | **New Moon** | Fang | 2 | 3×2.0 | 0 | Three strikes from nowhere on up to 3 targets (all on one if alone); each Ruffled 3 s | P | Boss (Oboro) | IV | 7.8 | F |

**Yowler** (Yowl; support, debuff, healing)

| ID | Move | Type | Pw | Pow | Frz | Effect (P) | Styles | Source | Rk | HE | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Y1 | **Hiss** | Yowl | 1 | 1.0 | 5 | Cone, small AoE; targets deal −20% damage for 8 s | Y T B | Lv 1 | I | 3.2 (2.3–5.5) | M |
| Y2 | **Purr** | — | 1 | — | — | Heals one ally for 3.5 BH-equivalents (Voice-scaled) | Y T | Lv 1 | I | 3.5 | M |
| Y3 | **Yowl** | Yowl | 1 | 2.0 | 15 | 12 m ranged blast | Y B | Lv 5 | I | 3.5 | V |
| Y4 | **Back-Talk** | Yowl | 1 | 1.0 | 0 | One enemy must target this cat for 6 s and is Ruffled for that time | Y B | Lv 10 | II | 3.5 | V |
| Y5 | **Rumble** | — | 1 | — | — | 10 s aura, 6 m: Posse deals +25% damage and Frazzle | Y | Lv 17 | II | 3.25 | F |
| Y6 | **Lullaby** | Yowl | 1 | — | — | A Tough/Stray dozes 6 s (broken by damage; the waking hit is an Ambush hit). Captain: 3 s. Boss: slowed 30% for 4 s | Y | Lv 25 | III | 3.2 | F✂ |
| Y7 | **Dawn Chorus** | — | 2 | — | — | Heals the whole Posse 1.8 BH-eq each; clears debuffs | Y | Lv 34 | IV | 7.8 (2.4–7.8) | F |
| Y8 | **Spit** | Yowl | 1 | 1.8 | 0 | Tough/Stray flees 3 s; Captain/Boss: interrupts a wind-up | Y T S | Street | II | 3.3 | F |
| Y9 | **Chirrup** | — | 1 | — | — | Another Posse cat gains +0.75 Paw. Cannot target self | Y | Street | II | 3.3 (2.6–4.0) | F✂ |
| Y10 | **The Stare** | Yowl | 2 | 4.0 | 20 | Unblinking: target Hide −30% for 10 s | Y P | Elder (Akane) | III | 8.0 | F✂ |
| Y11 | **Catnip Sermon** | — | 2 | — | — | Posse "Nipped" 8 s: Zip +40%, Hide −20%; each gains 10% Zoomies gauge | Y T | Keepsake (Catnip Sprig) | II | 7.5 | F✂ |
| Y12 | **Queen's Scolding** | Yowl | 2 | 2.0 | 12 | Large AoE; targets deal −25% damage for 8 s | Y | Boss (Madam Sabi) | IV | 8.0 (3.7–17.0) | F |

**Trickster** (Thump by thrown object, Yowl, Claw; range and area control)

| ID | Move | Type | Pw | Pow | Frz | Effect (P) | Styles | Source | Rk | HE | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|
| T1 | **Knock It Off** | Thump | 1 | 2.8 | 7 | Bats a pebble 12 m. If an arena prop is within 3 m, launches that instead: 3.5× and the prop's effect | T Y | Lv 1 | I | 3.5 (3.5–4.2) | M |
| T2 | **Dirt Kick** | Claw | 1 | 1.2 | 0 | Cone, small AoE; Blinded 4 s (basic attacks miss half the time) | T S P | Lv 1 | I | 3.1 (1.8–5.4) | M |
| T3 | **Bait** | — | 1 | — | — | A wiggling lure for 6 s: Toughs/Strays within 6 m gather on it; when it pops they are Ruffled 3 s | T P | Lv 5 | I | 3.3 | F |
| T4 | **Ledge Shove** | Thump | 1 | 2.0 | 5 | Knockback 5 m; off a ledge or into a prop: +20 Frz and Ruffled 4 s | T B | Lv 10 | II | 3.2 (2.5–5.7) | F |
| T5 | **Hairball** | Yowl | 1 | 1.5 | 0 | Lobbed, small AoE; leaves a slick for 5 s (slow 40%) | T Y B | Lv 17 | II | 3.4 (2.5–5.5) | F |
| T6 | **Tin-Can Clatter** | Yowl | 1 | 1.0 | 6 | Large AoE; interrupts wind-ups; counts as a Loud Noise Fear source | T Y | Lv 25 | III | 3.5 (1.6–8.0) | F✂ |
| T7 | **Everything Off The Shelf** | Thump | 2 | 6×0.9 | 6/hit | Six objects rain on a 6 m area, spread among enemies (max 4 on one target) | T | Lv 34 | IV | 8.5 (6.0–9.0) | F |
| T8 | **Play Dead** | — | 1 | — | — | Flops for 6 s: enemies ignore it, it restores 10% Nerve, and the first enemy to pass takes a 2.5× Claw surprise | T B Y | Street | II | 3.3 | F |
| T9 | **Feint** | Claw | 1 | 1.5 | 0 | Target's next attack whiffs; Ruffled 4 s | T S P | Street | II | 3.3 | F✂ |
| T10 | **Bucket Brigade** | Thump | 2 | 2.5 | 15 | Tips water in a line, small AoE; "Soggy" 8 s (Zip −30%); counts as a Water Fear source | T | Elder (Kurogane) | III | 7.8 (4.0–12.0) | F✂ |
| T11 | **Glint** | — | 1 | — | — | A dancing light spot for 5 s: Toughs/Strays within 5 m chase it, backs turned. Captain/Boss: Ruffled 3 s | T P Y | Keepsake (Pocket Mirror) | II | 3.3 | F✂ |
| T12 | **Switcheroo** | Thump | 2 | 2.5 | 0 | Swaps places with any ally or enemy within 12 m; enemies beside either end are hit and Ruffled 4 s | T P | Boss (Kiha & Moha) | IV | 8.0 | F |

**Home Moves** (Mikan only; cannot be taught; learned at home, see §3.11)

| ID | Move | Type | Pw | Pow | Frz | Effect (P) | Learned | Rk | HE | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| H1 | **Biscuits** | — | 1 | — | — | Kneads an ally or self: heal 2.5 BH-eq, Hide +20% for 8 s | Life 2 with Bond 3+ (else start of Life 3) | I | 3.3 | V |
| H2 | **Bell Ringer** | — | 1 | — | — | Shakes the collar bell: each Posse-mate +0.25 Paw; enemies within 6 m are interrupted and target Mikan 3 s | Life 3 with Bond 5+ (else start of Life 4) | II | 3.4 | F |
| H3 | **Come Running** | Claw | 1 | 2.5 | 0 | Sprints to any ally or enemy, hitting everything on the line; if the destination ally is under 30% Nerve, shields it for 2.0 BH-eq for 5 s | Life 5 with Bond 7+ (else start of Life 6) | III | 3.5 (2.5–7.0) | F |
| H4 | **Crib Guard** | Claw | **3** | 1.0 per counter | 4 per counter | 8 s: Mikan takes every hit aimed at a Posse-mate at −50%, and answers each with a counter-swipe | Life 6 after standing guard at the crib, with Bond 8+ (else start of Life 7) | IV | 12.6 | F |

Counts check: 5 × 12 = 60 Style Moves; Instinct 35, Street 10, Elder 5, Keepsake 5, Boss 5; 1-Paw 44, 2-Paw 16; plus 4 Home Moves (3 × 1-Paw, 1 × 3-Paw, the only 3-Paw Move in the game). Prototype set (M): 8. Vertical slice set (M+V, Styles Scrapper/Bruiser/Yowler plus two Trickster Moves from the prototype): S1 S2 S3 S4 S8, B1 B2 B3 B4 B8 B12, Y1 Y2 Y3 Y4, H1 = 16 (T1 and T2 exist in the prototype but leave the slice with their Style). Fallback 40: remove the 20 marked ✂.

**Learnable pool per Style** (native 12 + cross-Style):

| Style | Cross-Style Moves it can learn | Pool | Damage types reachable |
|---|---|---|---|
| Bruiser | S3 S10 S12 P5 Y1 Y3 Y4 T4 T5 T8 | 22 | Thump, Fang, Yowl |
| Scrapper | B1 B8 B9 P1 P3 P4 P6 P9 Y8 T2 T9 | 23 | Claw, Fang, Thump, Yowl |
| Prowler | B5 S1 S3 S5 S8 S11 Y10 T2 T3 T9 T11 T12 | 24 | Fang, Claw, Yowl, Thump |
| Yowler | B6 B11 S2 P8 T1 T5 T6 T8 T11 | 21 | Yowl, Claw, Thump |
| Trickster | B3 B8 B11 S2 S4 S6 S9 P2 P8 P11 Y1 Y2 Y8 Y11 | 26 | Thump, Yowl, Claw, Fang |
| Mikan | everything | 64 | all |

Every Style reaches at least three damage types, so no Style can be hard-walled by one resistance.

#### 3.10 Knacks (20)

Names, Style assignment and learn route are owned here; effects and numbers are (P).

| ID | Knack | Who | Source | Effect (P) |
|---|---|---|---|---|
| K1 | **Thick Scruff** | Bruiser | Lv 3 | Damage from behind −30%; cannot be Ruffled by an Ambush |
| K2 | **Chonk** | Bruiser | Lv 12 | Cannot be knocked back; Frazzle dealt by its Thump Moves +20% |
| K3 | **Warm Lump** | Bruiser | Lv 22 | Allies within 3 m take −10% damage |
| K4 | **Hot Paws** | Scrapper | Lv 3 | Each consecutive basic hit on one target +3% damage, to +15% |
| K5 | **Scrap Happy** | Scrapper | Lv 12 | Routing an enemy grants +0.5 Paw |
| K6 | **Lands On Feet** | Scrapper | Lv 22 | Once per encounter, a blow that would Rout leaves 1 Nerve |
| K7 | **Soft Paws** | Prowler | Lv 3 | Enemies notice this cat 40% later; Ruffled from its Ambushes lasts +2 s |
| K8 | **Go For The Throat** | Prowler | Lv 12 | Basic attacks +30% vs Ruffled or Frazzled targets (basics only) |
| K9 | **Night Eyes** | Prowler | Lv 22 | During the Night phase: Bite and Zip +10% |
| K10 | **Big Lungs** | Yowler | Lv 3 | Range and radius of its Yowl-type Moves +30% |
| K11 | **Motor** | Yowler | Lv 12 | Allies within 5 m regain 0.4% max Nerve per second |
| K12 | **Last Word** | Yowler | Lv 22 | When Routed: enemies within 6 m deal −20% for 8 s; each Posse-mate +0.5 Paw |
| K13 | **Butterfingers** | Trickster | Lv 3 | Props it launches deal +25%; Fear effects it triggers last +2 s |
| K14 | **Slippery** | Trickster | Lv 12 | Dodge window +20%; a good dodge grants +0.1 extra Paw |
| K15 | **Nine Schemes** | Trickster | Lv 22 | Starts every encounter with +0.5 Paw |
| K16 | **Pack Cat** | Street (any) | Carried by some Captains | +4% damage per standing Posse-mate (max +12%) |
| K17 | **Lone Tom** | Street (any) | Kasumi Elder | +15% damage, −10% damage taken while no ally is within 5 m. As a Sentry: +10% Power Rating |
| K18 | **Grudge-Bearer** | Street (any) | Carried by Nemeses | +20% damage to any cat whose Memory records it Routing this cat |
| K19 | **Well-Groomed** | Street (any) | Kasumi Elder | Debuffs on this cat last 40% less |
| K20 | **Quick Study** | Street (any) | Carried by some Captains | Watch pips count double; Lessons this cat takes cost −25% |

Rival kits (`DefaultKit`): a generated cat has the native Knacks its level allows; Captains have a 40% chance to carry K16 or K20 in place of one; a Rival that becomes a Nemesis gains K18 (proposed to Nemesis). Mikan learns Scrapper Knacks by level and any other by Lesson.

#### 3.11 Mikan

Mikan is a Scrapper on the same curves as everyone else, with seven differences.

1. **Any Style's Moves.** Mikan ignores the Styles column. Rank minimums still apply.
2. **The Repertoire.** Mikan keeps every Move and Knack ever learned and slots 4 + 2 from it at the Lot, a Sunspot or home. Mikan can teach anything in the Repertoire, slotted or not.
3. **Quick eyes.** Mikan's Watch thresholds are halved (2 / 2 / 3 / 4).
4. **Balance by stats, not by rules.** Mikan uses borrowed Moves with Scrapper stats. A Purr from Mikan heals `0.75 / 1.35 = 56%` of what a Yowler's does; a Wrecking Loaf from Mikan hits 20% harder than a Bruiser's but Mikan has 77% of the Bruiser's Nerve and 72% of its Hide to stand there with. Flexibility is paid for in potency (see F10 check 4).
5. **Home Moves.** Four Moves learned in Haru's House (§3.9). Each needs a Life and a Bond level; each has a **fallback**: if the Bond condition was never met, it is learned automatically at the start of the following Life. Nothing is missable; time at home only brings it sooner. The learning beat itself (a lap, a bell, a call from the veranda, a night beside a crib) is staged by Narrative.
6. **Paws.** 2 Paws, 3 from Life 4 (canon). H4 Crib Guard is the only thing that spends three at once.
7. **Ageing.** Mikan's stats are multiplied by a Life-stage row (F1). Voice rises as everything else falls.

| Life | Stage | Nerve | Bite | Hide | Voice | Zip | Old Boss (AI Posse Paw fill) |
|---|---|---|---|---|---|---|---|
| 1 | Kitten | 0.85 | 0.85 | 0.85 | 1.00 | 1.10 | 50% (canon) |
| 2 | Young adult | 1.00 | 1.00 | 1.00 | 1.00 | 1.05 | 50% |
| 3–4 | Adult | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 50% |
| 5–6 | Prime | 1.05 | 1.05 | 1.05 | 1.05 | 1.05 | 50% |
| 7 | Greying | 1.05 | 1.00 | 1.00 | 1.10 | 0.95 | 55% |
| 8 | Old | 0.95 | 0.90 | 0.95 | 1.20 | 0.85 | 60% |
| 9 | Elder | 0.85 | 0.75 | 0.90 | 1.30 | 0.70 | 70% |

   **Old Boss** is a proposal to Combat: in Lives 7–9 the canon 50% Paw-fill rate of AI-controlled Posse cats rises as shown. The elder does less and the Crew does more, and the Posse as a whole stays level (F10 check 5). If Combat declines, the Life 8–9 Bite/Zip penalties must be halved.

#### 3.12 The heir

In Life 9 the player names one Crew cat heir to the Bell Clowder.
1. **Eligible**: any **Sworn** cat. If none is Sworn, the three highest-Loyalty Crew cats are eligible (there is always a choice).
2. On naming, the heir: has Loyalty set to 100; gains Mikan's Zoomies in addition to its own (it may choose which is slotted); learns **one** Move of the player's choice from Mikan's Repertoire, ignoring Style compatibility (Home Moves included: this is the one time a Home Move is passed on); and wears a small bell (Art).
3. This system emits `HeirNamed(cat_id)`. Epilogue use is Narrative's.
4. The choice is permanent.

#### 3.13 Synergy, counters and example Posses

**Assumed Style matchup chart** (Combat owns it; see Cross-doc assumption A-4). Resist = ×0.75 taken, Weak = ×1.25 taken.

| Style | Resists | Weak to | So bring... |
|---|---|---|---|
| Bruiser | Thump | Yowl | Yowlers; Hairball, Tin-Can Clatter |
| Scrapper | Claw | Thump | Bruisers; Knock It Off, Wall-Kick |
| Prowler | Fang | Claw | Scrappers; Dirt Kick, Cheap Shot |
| Yowler | Yowl | Fang | Prowlers; Pounce, Scruff Grab, Fish-Hook |
| Trickster | Thump | Fang | Prowlers; Pounce, Anchor Drag |

This gives the district Bosses a readable rhythm: Daifuku (Bruiser) wants a Yowler you may not have yet; Madam Sabi (Yowler) shrugs off your new Yowler and wants Fang; Oboro (Prowler) is the one Mikan's native Claw is good against; **Ikari (Scrapper) resists Mikan's whole native kit**, the first Boss that forces the player to restructure the Posse or teach Mikan Thump Moves.

**How learnsets counter the chart.** Because every Style reaches 3+ damage types by Lesson (§3.9), a cat's *Style* sets its weakness but its *Moves* need not share its Style's damage type. Counter-teaching costs something real: an off-stat Move (a Yowler throwing Knock It Off uses Bite 0.75) deals about `0.75 × 1.25 = 0.94` of a neutral hit into a weakness, against `1.35 × 0.75 = 1.01` for its own Yowl into a resistance. Counter-teaching roughly breaks even on a mismatched cat; bringing the right *cat* is worth `×1.25`. Swapping cats is therefore better than re-teaching them, which is the intent: the roster is the answer.

**Set-up → pay-off pairs across Posse members**

| Set-up | Pay-off | Why it works |
|---|---|---|
| Bait (T) clumps Toughs | Belly Flop, Avalanche, Queen's Scolding, Whirl, Everything Off The Shelf | AoE reaches its target cap |
| Vanish, Back-Talk, Fish-Hook, Feint, Glint, Shadow Step (Ruffled) | Neck-Nip ×1.6, Pressure Point Frz 25, Go For The Throat | Ruffled is the Prowler's oxygen |
| Sit On It (pin 4 s) | Lead Paw (1 s wind-up lands free), Drop In | Removes the pay-off's risk |
| Lullaby (doze) | Bag Lurk, Drop In, any Ambush hit | The waking hit is an Ambush |
| Ledge Shove, Shoulder Check, Knock It Off into props | Whatever the prop does (water, noise): `FearTriggered` | The environment is how you hit Fears (brief §7) |
| Bucket Brigade (Soggy), Tin-Can Clatter (Loud Noise) | Rivals with Water or Loud Noise Fears | Portable Fear sources, at a 2-Paw or Rank III price |
| Chirrup, Bell Ringer (Paws) | Mikan's 2- and 3-Paw Moves; a controlled cat's capstone | Moves Paws from half-rate AI cats to the conductor |
| Scent Mark +20%, The Stare / Scruff Grab (Hide down), Rumble +25% | Nine Shadows, Thousand Paws, Feather Frenzy on a Frazzled Boss | The single-target stack (capped: F10 check 3) |
| Loaf, Back-Talk (pull targeting) | Box Fort, Purr, any fragile cat's uptime | Tank and shelter |
| Hairball slick, Hind-Rake slow | Whirl, Belly Flop, kiting for Yowlers and Tricksters | Enemies stay where the AoE is |
| Switcheroo | Rescues a cornered Yowler; drops a Bruiser into a clump before Avalanche | Position as a resource |

**Ten example Posses.** Mikan is a Scrapper in all; Mikan's listed Moves are slotted from the Repertoire. Index columns are from the paper model in F10 (Lane Standard = 100).

| # | Posse | Cats and key Moves | Plan | Weak spot | Captain | Boss | Mob |
|---|---|---|---|---|---|---|---|
| 0 | **Lane Standard** (baseline, Instinct Moves only) | Mikan (Bunny-Kick, Quick Swat, Pounce, Whirl) · Bruiser (Head-Bonk, Loaf, Belly Flop, Sit On It) · Yowler (Hiss, Purr, Yowl, Back-Talk) · Trickster (Knock It Off, Dirt Kick, Bait, Ledge Shove) | A bit of everything | Master of nothing | 100 | 100 | 100 |
| 1 | **Dust Cloud** (Frazzle rush) | Mikan (Head-Bonk, Bunny-Kick, Quick Swat, Bell Ringer) · Bruiser (Head-Bonk, Lead Paw, Wrecking Loaf, Loaf) · Prowler (Vanish, Pressure Point, Neck-Nip, Nine Shadows) · Yowler (Yowl, Back-Talk, Rumble, Purr) | Ruffle, Frazzle fast, Pile-On, dump capstones into the Frazzled window | Toughs are Routed before Frazzle pays off | 110 | 112 | 92 |
| 2 | **The Wall** (attrition) | Mikan (Biscuits, Crib Guard, Counter-Swipe, Bunny-Kick) · Bruiser (Loaf, Big Stretch, Immovable, Scruff Grab) · Yowler (Purr, Dawn Chorus, Hiss, Rumble) · Trickster (Box Fort, Play Dead, Hairball, Knock It Off) | Never lose a cat; win slowly | Slow; pushes the 90 s limit on Captains | 88 | 104 | 90 |
| 3 | **Night Shift** (Ambush burst) | Mikan (Drop In, Neck-Nip, Cheap Shot, Come Running) · Prowler (Vanish, Drop In, Scent Mark, New Moon) · Prowler (Moonless, Neck-Nip, Pressure Point, Shadow Step) · Trickster (Bait, Glint, Feint, Dirt Kick) | Open from the High Road; everything is always Ruffled | Two cats at Nerve ×0.8, no healer; collapses if the opener fails | 113 | 96 | 108 |
| 4 | **Clatter & Splash** (Fear hunting) | Mikan (Shoulder Check, Wall-Kick, Quick Swat, Bell Ringer) · Trickster (Knock It Off, Ledge Shove, Bucket Brigade, Tin-Can Clatter; Butterfingers) · Trickster (Bait, Hairball, Everything Off The Shelf, Switcheroo) · Yowler (Spit, Yowl, Purr, Back-Talk) | Turn the arena and the target's Fears into the weapon | Bare arenas; Rivals whose Fears are unknown or not Water/Noise | 104 | 98 (115 with a matching Fear) | 106 |
| 5 | **The Choir** (Yowl and Paw battery) | Mikan (Thousand Paws, Bunny-Kick, Quick Swat, Crib Guard) · Yowler (Chirrup, Rumble, The Stare, Yowl) · Yowler (Chirrup, Queen's Scolding, Purr, Hiss) · Trickster (Hairball, Tin-Can Clatter, Purr, Catnip Sermon) | Two cats feed Paws to the conductor; everything else is noise | 60% of its damage is Yowl: 88 into Yowlers, 118 into Bruisers | 103 | 106 | 97 |
| 6 | **All Elbows** (Scrapper swarm) | Mikan (Thousand Paws, Bunny-Kick, Second Wind, Catnip Sermon) · Scrapper (Bunny-Kick, Pounce, Hind-Rake, Feather Frenzy; Hot Paws) · Scrapper (Quick Swat, Whirl, Counter-Swipe, Anchor Drag) · Scrapper (Head-Bonk, Pounce, Wall-Kick, Thousand Paws) | Speed, flurries, constant Zoomies | No healing, no tank, all weak to Thump, mostly Claw: falls to 94 on Boss with attrition, worse into Scrappers | 109 | 107 (94 after attrition) | 101 |
| 7 | **Herd & Dump** (crowd control) | Mikan (Whirl, Belly Flop, Come Running, Dirt Kick) · Trickster (Bait, Hairball, Everything Off The Shelf, Glint) · Bruiser (Belly Flop, Avalanche, Loaf, Shoulder Check) · Yowler (Queen's Scolding, Hiss, Lullaby, Purr) | Gather them, then drop everything on the pile | A single big enemy: every AoE Move is at its floor | 104 | 82 | 124 |
| 8 | **Mark & Execute** (Boss killer) | Mikan (Feather Frenzy, Bunny-Kick, Neck-Nip, Bell Ringer) · Prowler (Scent Mark, Neck-Nip, Pressure Point, Nine Shadows) · Yowler (The Stare, Rumble, Purr, Chirrup) · Bruiser (Scruff Grab, Lead Paw, Loaf, Wrecking Loaf) | Stack every single-target amplifier, cash out on Frazzle | Crowds: nothing here hits two cats | 104 | 115 | 86 |
| 9 | **Old Boss** (Life 8–9 conductor) | Elder Mikan (Bell Ringer, Biscuits, Rumble by Lesson, Crib Guard) · any three Sworn Crew at 70% AI Paw fill | Mikan supports; the Crew carries | Mikan personally is slow and soft | 103 | 101 | 102 |

No build is best in more than one column; the best Captain build is 13% over baseline, the best Boss build 15%, and the one large outlier (Herd & Dump vs. a mob, +24%) is the worst build in the Boss column (−18%). See F10 and Open Questions.

### States and Transitions

**Crew membership and assignment**

| State | Entry Condition | Exit Condition | Behavior |
|---|---|---|---|
| Stray (unknown) | World spawn / authored | Seen with Whisker Sense or met | Not tracked |
| Friend Stray (Trust 0–3) | Found; non-hostile | Trust 3 (→ Lounging) or Routed-and-recruited (→ Lounging) or Routs Mikan (→ Rival, Nemesis) | One Trust pip per day max |
| Rival | Nemesis | Recruit accepted, Comes Knocking accepted | Owned by Nemesis |
| **Lounging** | Join step; removed from Posse or post | Assigned to Posse or post; dismissed; betrays | 25% gossip XP; idle counter runs |
| **Posse** | Chosen at Lot or by Tail-Up | Swapped out; dismissed; betrays | Fights; full XP; Watch pips accrue |
| **Sentry / Warden** | Posted under Territory's rules | Un-posted; betrays | Sentry XP; `PowerRating` read by Territory |
| *Routed* (overlay on Posse or Sentry) | Nerve 0 | Sunspot nap, sleep at home, or next morning (Sentry) | Cannot fight or be Tail-Upped in; still gets 50% XP for that encounter |
| Departed | `BetrayalTriggered` or Dismissal | Can be recruited again later as a Rival | Removed from Crew with Moves, Knacks, level intact |
| Heir | Named in Life 9 | — | Permanent flag |

**Learning**

| State | Entry | Exit | Behavior |
|---|---|---|---|
| Unseen | default | First Watch pip, or learned | — |
| Watching (n pips) | Enemy cat uses the Move while this cat stands in the Posse | pips ≥ threshold | Pips persist across days and through benching |
| Pending | Instinct level reached / Watch complete / Keepsake used, with no free slot | Slotted (replace) or discarded | Max 3 per cat; "!" marker |
| Known | Slotted | Forgotten (replaced) | Crew: Known = slotted. Mikan: Known = in Repertoire forever |
| Forgotten | Replaced | Old Habits (Instinct), refresher Lesson, Elder | Last-copy warning if applicable |

**Loyalty tier**: Shifty ↔ Aloof ↔ Steady ↔ True ↔ Sworn, moved only by the daily tick or the Join/Heir steps. Zoomies II, once granted, does not revert.

### Interactions with Other Systems

| System | Flows in (we consume) | Flows out (we provide) | Responsibility line |
|---|---|---|---|
| **Combat** | `EncounterEnded` (outcome, routed_ids, survivors) → XP; `CatRouted` → Loyalty, XP share; Move-use notifications for Watch pips (requested: `MoveUsed(user_id, move_id, targets_hit[])`) | Final stats per cat; slotted `moves[4]`, `knacks[2]`, `zoomies` + tier; `DefaultKit`; Mikan age row and Old Boss value | Combat owns what a Move does and every combat number. We own who has it |
| **Nemesis** | `VerdictApplied(recruit)` → recruit roll; `BetrayalTriggered` → remove cat; Rival `grudge`, `rank`, `memory` (read) | `Loyalty(cat_id)`; `PowerRating(cat_id)`; `RecruitWillingness()`; `DefaultKit()`; `CatRecruited`, `RecruitRefused`, `CrewDismissed` events | Nemesis decides *if and when* a cat betrays; we only supply the number |
| **Territory & Economy** | Clout rank → Crew cap; `RaidResolved` → Sentry XP and Loyalty; `PatchChanged`, `DistrictClaimed` → Turf XP; patch level | `PowerRating(cat_id)` for raid math; proposed prices (Lessons, Offerings, meals, Elders) for Economy to confirm; assignment eligibility hints by Loyalty tier | Economy sets every price. Territory sets who may be posted where |
| **Narrative** | `BondChanged` (0–10), `LifeAdvanced`, the cat-flap beat, the crib beat | `HeirNamed`; the list of Home Move learning moments to stage; 5 story-recruit slots (one per Style) | Narrative owns who the story recruits and Elders are, and all staging |
| **Clock** | `DayEnded` → Loyalty tick, daily Lesson/meal/Trust resets; `PhaseChanged` (Night Eyes) | — | — |
| **UX** | — | Everything on the Lot screens, the ear-posture Willingness readout, pending "!" markers, last-copy warnings | UX owns layout and flow |
| **Art / Audio** | — | Events: level-up, Lesson, recruit accept/refuse, tier change, heir | They own the look and sound |

---

## Formulas

Constants in `CAPS` are tuning knobs (see Tuning Knobs). `round()` is round-half-up.

### F1. Stat value

```
stat(cat, s) = round( base_s(level) × STYLE_W[style][s] × temper(cat, s) × bond_mod(cat, s) )

base_nerve(L) = NERVE_L1 + (NERVE_L50 − NERVE_L1) × (L − 1) / 49
base_other(L) = STAT_L1  + (STAT_L50  − STAT_L1)  × (L − 1) / 49

bond_mod = AGE_W[life][s]                       for Mikan
         = LOY_MIN + LOY_SPAN × loyalty / 100   for Crew
         = 1.0                                  for Rivals and Strays
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| level (L) | int | 1–50 | Cat's level |
| s | enum | nerve, bite, hide, voice, zip | Which stat |
| NERVE_L1, NERVE_L50 | int | 100, 2500 | Canon Style-neutral Nerve endpoints |
| STAT_L1, STAT_L50 | int | 10, 160 | Canon Style-neutral endpoints for the other four |
| STYLE_W | float | 0.70–1.35 | Style weight table, §3.2 |
| temper | float | 0.92, 1.00 or 1.08 | Temperament modifier for this stat |
| AGE_W | float | 0.70–1.30 | Mikan's Life-stage row, §3.11 |
| LOY_MIN, LOY_SPAN | float | 0.95, 0.10 | Loyalty multiplier endpoints |
| loyalty | int | 0–100 | Crew cat's Loyalty |
| stat | int | Nerve 70–3,686; others 6–245 | Final stat |

**Output range.** Bounded, not clamped, because every factor is bounded and positive. Nerve minimum **70** (Lv 1 Prowler, −8% Temperament, Loyalty 0: 100 × 0.80 × 0.92 × 0.95 = 69.9); maximum **3,686** (Lv 50 Bruiser, Stubborn or Greedy, Loyalty 100: 2500 × 1.30 × 1.08 × 1.05). Other stats minimum **6** (Lv 1, weight 0.70, −8%, Loyalty 0: 6.1); maximum **245** (Lv 50 Yowler Voice, +8%, Loyalty 100: 244.9). No value reaches zero or below. Well-Fed (Combat) multiplies max Nerve afterwards.

Style-neutral base at each Life's expected end level:

| Level | 1 | 3 | 8 | 16 | 24 | 32 | 40 | 48 | 50 |
|---|---|---|---|---|---|---|---|---|---|
| base_nerve | 100 | 198 | 443 | 835 | 1,227 | 1,618 | 2,010 | 2,402 | 2,500 |
| base_other | 10.0 | 16.1 | 31.4 | 55.9 | 80.4 | 104.9 | 129.4 | 153.9 | 160.0 |

**Worked example.** Lv 24 Bruiser, Stubborn (+Nerve, −Zip), Loyalty 70 → bond_mod = 0.95 + 0.10 × 0.70 = 1.02.
Nerve = 1226.5 × 1.30 × 1.08 × 1.02 = **1,756**. Bite = 80.41 × 1.00 × 1.00 × 1.02 = **82**. Hide = 80.41 × 1.25 × 1.02 = **103**. Voice = 80.41 × 0.75 × 1.02 = **62**. Zip = 80.41 × 0.70 × 0.92 × 1.02 = **53**.

### F2. XP to next level

```
xp_to_next(L) = tough_yield(L) × fights_per_level(L)

tough_yield(L)      = YIELD_BASE + YIELD_PER_LEVEL × L
fights_per_level(L) = min( FPL_CAP, FPL_START + FPL_RAMP × (L − 1) )
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| L | int | 1–49 | Current level (no value at 50) |
| YIELD_BASE, YIELD_PER_LEVEL | int | 8, 4 | XP for Routing one same-level Tough = 8 + 4L |
| FPL_START, FPL_RAMP, FPL_CAP | int | 6, 3, 24 | Same-level Tough-equivalents ("TE") needed per level: 6 at Lv 1, +3 per level, capped at 24 from Lv 7 |
| xp_to_next | int | 72–4,896 | XP required to go from L to L+1 |

**Output range.** Bounded: minimum **72** at Lv 1 (12 × 6), maximum **4,896** at Lv 49 (204 × 24). Strictly increasing.

| L | 1 | 2 | 3 | 5 | 7 | 8 | 16 | 24 | 32 | 40 | 48 | 49 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| xp_to_next | 72 | 144 | 240 | 504 | 864 | 960 | 1,728 | 2,496 | 3,264 | 4,032 | 4,800 | 4,896 |
| cumulative to reach L | 0 | 72 | 216 | 816 | 1,992 | 2,856 | 13,224 | 29,736 | 52,392 | 81,192 | 116,136 | 120,936 |

Total Lv 1 → 50: **125,832 XP**.

**Why this shape.** The design quantity is *fights per level*, held constant at 24 TE from Lv 7 so that pace does not sag late. Pacing check against the brief: with about **26 TE per day** for a Posse cat (assumption A-7: about 9 encounters a day × about 2.9 TE each including Captain weight), Lives 3–7 need 8 levels × 24 TE = 192 TE = **7.4 days per Life** (target 5–8). Life 2 needs Lv 3 → 8 = 2,640 XP at about 15 TE/day × 28 XP (no Night yet, small Posse) = **6.3 days**. Life 1 needs 216 XP = 13 fights against Lv 1–2 opponents: the tutorial.

**Worked example.** Lv 14: tough_yield = 8 + 56 = 64; fights_per_level = min(24, 6 + 39) = 24; xp_to_next = **1,536**.

### F3. XP award

```
xp_award(cat, enemy) = max( 1, round( tough_yield(L_enemy) × RANK_XP[rank] × diff_mult × share ) )

diff_mult = clamp( 1 + DIFF_SLOPE × (L_enemy − L_cat), DIFF_MIN, DIFF_MAX )

per encounter: total = min( Σ xp_award over routed enemies, AWARD_CAP_LEVELS × xp_to_next(L_cat) )
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| L_enemy, L_cat | int | 1–50 | Levels |
| RANK_XP | float | Stray/Tough 1 · Captain 6 · Boss 30 · Botan 50 · Critter = its Nerve multiplier (0.5–3) | Rank weight |
| DIFF_SLOPE, DIFF_MIN, DIFF_MAX | float | 0.15, 0.10, 2.50 | +15% per level the enemy is above the cat; floor 10% (6+ levels under), cap 250% (10+ over) |
| share | float | 1.0 standing in Posse · 0.5 Routed in Posse · 0.25 Lounging · 0 otherwise | Participation |
| AWARD_CAP_LEVELS | int | 3 | One encounter cannot pay more than three levels' worth |
| xp_award | int | 1–25,000 before cap | XP for one Routed enemy |

**Output range.** Clamped below at **1** (a Lv 1 Critter ×0.5 at the 10% floor would round to 1 or 0; a Routed enemy always pays something). Uncapped maximum **25,000** (Botan at Lv 48 seen by a cat 10+ levels under: 200 × 50 × 2.5), then limited by the per-encounter cap, at most 3 × 4,896 = **14,688**.

**Worked example.** A Lv 14 Yowler, standing, helps Rout a Lv 16 Captain. tough_yield(16) = 72; × 6 = 432; diff_mult = 1 + 0.15 × 2 = 1.30; share 1.0 → **562 XP**, 37% of its 1,536 to next. A Lounging Lv 10 Crew cat hears about it: diff_mult = 1 + 0.15 × 6 = 1.90; 432 × 1.90 × 0.25 = **205 XP**.

**Catch-up check.** A Lv 10 cat brought into Lv 20 fights earns 88 × 2.5 = 220 XP per Tough against a need of 1,152: **5.2 fights per level** instead of 24. A neglected cat is current again in about two days. **Grind check.** A Lv 13 cat farming Lv 8 Toughs earns 40 × 0.25 = 10 XP against a need of 1,440: 144 fights per level.

### F4. Sentry XP

```
sentry_xp(cat) = round( SENTRY_TE × role_mult × tough_yield(L_patch) × diff_mult(L_patch, L_cat) )   per night the post is held
               + Σ xp_award(cat, raider) with share = 1.0                                              on a successful raid defence
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| SENTRY_TE | int | 8 | Tough-equivalents paid per quiet night |
| role_mult | float | 1.0 Sentry · 1.25 Warden | Role weight |
| L_patch | int | 1–48 | The Patch's level: its district band midpoint unless Territory supplies one |
| diff_mult | float | 0.10–2.50 | As F3 |
| sentry_xp | int | 10–5,000 per quiet night | Nightly XP |

**Output range.** Bounded. Minimum **10** (Lv 4 Patch, cat 6+ levels over: 8 × 24 × 0.10 = 19; at L_patch 1: 8 × 12 × 0.10 = 9.6 → 10). Maximum **5,000** (Warden, L_patch 48, cat 10+ under: 8 × 1.25 × 200 × 2.5).

**Worked example.** A Lv 18 cat is Sentry in Tsukimi Hill (band 16–24, L_patch 20): 8 × 1.0 × 88 × 1.30 = **915 XP** per night against xp_to_next(18) = 1,920: about two nights per level, slower than the Posse's one, faster than the Lot's 0.25×.

### F5. Recruit Willingness

```
W = clamp( BASE_W[rank]
         + CLOUT_W × clout_index
         + OFFER_W × min( 2, offered / ask )
         + PILE_ON_W × by_pile_on  +  BOSS_FINISH_W × mikan_finisher
         − FEAR_W × fear_used
         − GRUDGE_W × grudge
         − LEVEL_W × max( 0, L_rival − L_mikan )
         + PITY_W × min( 3, refusals )
         + FAMILIAR_W × familiar_face
         + TRUST_W × trust ,
           W_MIN, W_MAX )            (percent chance the cat accepts)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| BASE_W[rank] | int | Stray 60 · Tough 45 · Captain 20 · Boss 5 | Starting willingness |
| CLOUT_W × clout_index | int | 4 × (0–6) = 0–24 | Mikan's Clout rank, House Pet = 0 |
| OFFER_W, offered, ask | int, int, int | 15; 0–1,600; 20–800 | Offering relative to the asking price (F6); worth 0 to +30 |
| by_pile_on | bool | 0/1 | From `CatRouted.by_pile_on`. PILE_ON_W = 10: beaten by the whole Posse, wants in |
| mikan_finisher | bool | 0/1 | Mikan landed the Routing blow. BOSS_FINISH_W = 5 |
| fear_used | bool | 0/1 | A `FearTriggered` on this cat during the encounter. FEAR_W = 10: humiliation is not respect |
| GRUDGE_W × grudge | float | 0.5 × (0–100) = 0–50 | The Rival's Grudge |
| LEVEL_W, levels | int | 3 per level; 0–5 levels (blocked above 5) | Will not follow a weaker boss |
| PITY_W, refusals | int | 15 × (0–3) | Earlier refusals by this cat |
| familiar_face | bool | 0/1 | A Posse cat used to be in this Rival's Clowder. FAMILIAR_W = 10 |
| TRUST_W, trust | int | 10 × (0–3) | Friend Strays only |
| W_MIN, W_MAX | int | 5, 95 | Clamp |
| W | int | 5–95 | Percent |

**Output range.** Clamped to **5–95**. Unclamped it runs from −60 (Boss, no Clout, no Offering, Grudge 100, Fear used, 5 levels over: 5 − 50 − 10 − 15) to +214 (Friend Stray at Trust 3 with everything), so the clamp is doing real work: there is always a chance and never a certainty in a fight recruit. Certainty exists only on the friendship, story and Comes Knocking routes, which do not roll.

**Worked example.** A Lv 12 Tough, Grudge 30. Mikan is Lv 11, Clout "Known Face" (index 2), offers the fair price, the Rout was a Pile-On not finished by Mikan, and the bucket was kicked (Water Fear triggered): 45 + 8 + 15 + 10 + 0 − 10 − 15 − 3 = **50%**. Had the player not used the bucket: 60%. With a feast: 75%.

**Design note.** The −10 for using a Fear is deliberate tension with Combat's optimal play: the easy win makes the worse recruit. It is small enough to be overridden by one Offering step.

### F6. Asking price (proposal; Economy confirms)

```
ask = clamp( round( ASK_PER_LEVEL × L_rival × RANK_PRICE[rank] ), ASK_MIN, ASK_MAX )
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| ASK_PER_LEVEL | int | 8 | Morsels per level |
| L_rival | int | 1–50 | Rival's level |
| RANK_PRICE | float | Stray 0.75 · Tough 1 · Captain 2 · Boss 4 | Rank weight |
| ASK_MIN, ASK_MAX | int | 20, 800 | Canon Offering range |
| ask | int | 20–800 | Morsels for a "fair" Offering; a feast is 2× |

**Output range.** Clamped to the canon **20–800**. The lower clamp binds for Toughs below Lv 3 and Strays below Lv 4; the upper for Captains at Lv 50 and Bosses from Lv 25. **Worked example.** Lv 12 Tough: 8 × 12 × 1 = **96**. Lv 40 Captain: 640. Against the Tribute anchors (60/day at end of Life 2, 300 at Life 4, 1,200 at Life 7), a fair Offering for an at-level Tough is roughly one to one-and-a-half days' Tribute early and under half a day late; a Captain is two to three days early, about half a day late.

### F7. Starting Loyalty

```
loyalty_start = clamp( SRC_LOY[source] − GRUDGE_L × grudge + OFFER_L × min(2, offered/ask) + FINISH_L × mikan_finisher − RETURN_L × was_crew_before, 5, 70 )
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| SRC_LOY | int | Fight recruit 45 · Friend Stray 55 · Story 60 · Comes Knocking 65 | By route |
| GRUDGE_L × grudge | float | 0.4 × (0–100) | Grudge at the moment of joining |
| OFFER_L | int | 5 per Offering step (0–10) | Generosity remembered |
| FINISH_L | int | 5 | Mikan beat this cat personally |
| RETURN_L | int | 20 | This cat was Crew once and left (betrayal or dismissal) |
| loyalty_start | int | 5–70 | |

**Output range.** Clamped **5–70**: never zero (they did say yes), never above Steady/True (trust is earned in play). Unclamped minimum is 45 − 40 − 20 = −15 (a returning traitor at Grudge 100), maximum 65 + 10 + 5 = 80. **Worked example.** The Tough above (Grudge 30, fair Offering, not Mikan's finish): 45 − 12 + 5 = **38**, Aloof: learns, cannot yet teach.

### F8. Daily Loyalty tick

```
loyalty' = clamp( loyalty + thaw × G − L , 0, 100 )

G = FOUGHT + min(2, rivals_routed_standing) + POST_HELD + RAID_DEFENDED + MEAL + LESSON_TAKEN + LESSON_GIVEN + LEVELLED + DISTRICT
L = neglect_mult × IDLE  +  min(2, times_routed)  +  WIPE  +  SENTRY_ROUTED  +  CREWMATE_DISMISSED  +  ABSENCE
thaw = 0.5 if (grudge_at_recruit ≥ 50 and loyalty has never reached 40) else 1.0
```

| Term | Value | When it applies (per day) |
|---|---|---|
| FOUGHT | +2 | Was in the Posse for at least one won encounter |
| rivals_routed_standing | +1 each, max +2 | A named Rival was Routed while this cat stood |
| POST_HELD | +1 | Sentry/Warden, not Routed overnight (applied next tick) |
| RAID_DEFENDED | +2 | Its post won a raid |
| MEAL | +3 | Share a Meal (once per cat per day) |
| LESSON_TAKEN / LESSON_GIVEN | +2 / +1 | |
| LEVELLED | +1 | Gained at least one level |
| DISTRICT | +5 | `DistrictClaimed` today (all Crew) |
| IDLE × neglect_mult | 1 × (1 / 2 / 3) | Lounging with `days_idle > 2`. Multiplier by former rank: Stray/Tough 1, Captain 2, Boss 3 |
| times_routed | 1 each, max 2 | Routed in the Posse |
| WIPE | 3 | Was in the Posse for a Posse wipe |
| SENTRY_ROUTED | 1 | Routed in a lost raid |
| CREWMATE_DISMISSED | 2 | The player dismissed any Crew cat today (all others) |
| ABSENCE | 2 | Life 8 waiting period, while Territory/Narrative flag Mikan as absent; Sworn cats exempt |

| Symbol | Type | Range | Description |
|---|---|---|---|
| G | float | 0–18 | Day's gains before thaw |
| L | int | 0–13 | Day's losses |
| loyalty' | int | 0–100 | Rounded after the sum |

**Output range.** Clamped **0–100**. Largest realistic daily gain is about +9 (Posse, two Rivals, a meal, a Lesson); largest loss about −8 (ex-Boss idle, plus a dismissal, plus absence). **Worked example.** An ex-Captain, Loyalty 34, recruited at Grudge 70 (thaw active). Today: in the Posse, two Rivals Routed, was Routed once, shared a meal. G = 2 + 2 + 3 = 7; × 0.5 = 3.5; L = 1. 34 + 3.5 − 1 = 36.5 → **37**. Left on a crate instead: after the 2-day grace, −2 a day; from 37 he is Shifty in 9 days.

**Time-to-trust check.** A fight recruit starting at 38, used daily and fed: +7 to +9 a day → Steady in 1 day, True in 3, Sworn in about 6 (one Life). A high-Grudge Nemesis starting at 5 with thaw: +3.5 to +4.5 a day to 40 (about 9 days), then full rate: Sworn in about 15 days of steady attention, two Lives. That is the intended price of turning a Nemesis.

### F9. Lesson cost (proposal; Economy confirms)

```
lesson_cost = round( LESSON_BASE[rank] × cross_mult × refresher_mult × sworn_mult × quick_study_mult )
shiny_cost  = LESSON_SHINY[rank][native or cross]
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| LESSON_BASE | int | I 40 · II 150 · III 450 · IV 1,000 | Morsels, native-Style Move |
| cross_mult | float | 1.0 native · 1.5 cross-Style (Mikan: Scrapper Moves are native, all others cross) | |
| refresher_mult | float | 1.0 or 0.5 | Student knew this Move before |
| sworn_mult | float | 1.0 or 0.75 | Teacher is Sworn |
| quick_study_mult | float | 1.0 or 0.75 | Student has K20 |
| LESSON_SHINY | int | III cross 1 · IV native 2 · IV cross 3 · else 0 | Shinies |
| lesson_cost | int | 11–1,500 | Morsels |

**Output range.** Bounded: minimum **11** (Rank I native refresher from a Sworn teacher to a Quick Study student: 40 × 0.5 × 0.75 × 0.75 = 11.25); maximum **1,500 + 3 Shinies** (Rank IV cross-Style), which is the canon top Lesson. The canon first Lesson (40) is Rank I native. **Worked example.** Teaching Yowl (Y3, Rank I) to a Bruiser: 40 × 1.5 = **60**. Teaching Avalanche (Rank IV) Bruiser-to-Bruiser from a Sworn teacher: 1,000 × 0.75 = **750 + 2 Shinies**. Fitting a full Posse (12 slots) entirely with cross-Style Rank II Moves costs 2,700 Morsels: about nine days' Tribute at the end of Life 4, a bit over two at the end of Life 7.

### F10. Move value budget and the dominance checks

This is the paper model used to place the proposed numbers in §3.9. It is the weakest part of the doc by construction (it models a combat system written in parallel) and exists so that reviewers can see and attack the assumptions.

```
HE(move) = pow × n_targets  +  FRZ_HE × frz × n_targets  +  utility_HE

BUDGET[paws] = { 1: 3.5, 2: 8.0, 3: 13.0 }
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| pow | float | 0–7.0 | Damage in basic hits (×BH), before stat and resist |
| n_targets | float | 1.0 single · 1.6 small AoE · 2.2 large AoE (reference encounter); 1 to 3 / 1 to 5 at the extremes | Expected enemies hit |
| frz | int | 0–35 | Frazzle points per target |
| FRZ_HE | float | 0.10 | Value of one Frazzle point (derivation below) |
| utility_HE | float | 0–8.0 | Value of the non-damage effect (table below) |
| HE | float | 0–18.5 | Hit-Equivalents: one HE = one basic hit's worth of fight progress |

**Output range.** Bounded by the catalogue: lowest is 0 (Bag Lurk never triggered), highest 18.5 (Avalanche on five clumped enemies). Reference-encounter values sit in **3.0–3.8** for 1-Paw Moves, **7.2–8.5** for 2-Paw, **12.6** for the 3-Paw.

Model assumptions:
- **Reference encounter**: one Captain and three Toughs, all same level = (4 + 3) × 11 BH ≈ **77 HE** of enemy Nerve (one BH ≈ 9% of neutral Nerve, brief §8), Routed in **60 s** (brief: 45–90 s).
- **Paw income over 60 s**: the player-controlled slot earns **6** (one per 10 s, between the canon 14 s passive and 6–7 s under pressure); each AI cat earns **3** (canon 50%). 15 Paws × 3.5 HE = 52.5 HE from Moves.
- **Basic attacks**: 6 HE per cat per 60 s (0.1 BH/s landed, after movement, dodging and animation) = 24 HE.
- 52.5 + 24 = **76.5 HE ≈ 77**: the model reproduces the brief's Captain-fight length, and says Moves are about 70% of a Posse's output. That is the "conductor" design showing up in the arithmetic.
- **Frazzle**: a full gauge buys 8 s of ×1.5 damage at about 1.0 HE/s on that target (4 HE) plus a Pile-On (assumed 6 HE) ≈ 10 HE per 100 points → `FRZ_HE = 0.10`.
- **Utility values**: +X% Posse damage for t s = X × 1.0 HE/s × t (Rumble: 0.25 × 10 = 2.5). Ruffled for t s ≈ 0.3 HE per second on a Captain/Boss (it doubles a Frazzle inflow of about 3 points/s). Enemy damage −X% for t s = X × 0.5 HE/s × t. Healing 1 BH-equivalent = 1 HE. +1 Paw to the controlled cat = 3.5 HE. Pulling targeting, pins, dozes and repositioning are valued at 1.0–2.5 HE by judgement.
- **Stat scaling**: a Move's HE is multiplied by the user's Bite weight (Claw/Fang/Thump) or Voice weight (Yowl, heals, buffs).

**Check 1: no Move is unconditionally above budget.**

| Class | Count | Budget | Reference HE (min–max) | Highest unconditional | Highest conditional best case | Its floor |
|---|---|---|---|---|---|---|
| 1-Paw single-target / utility | 33 | 3.5 | 3.0–3.7 | Scruff Grab 3.7 (+6%) | Ledge Shove 5.7 (needs a ledge or prop) | 2.5 |
| 1-Paw AoE | 8 | 3.5 | 3.1–3.8 | Belly Flop 3.8 at 1.6 targets | Tin-Can Clatter 8.0 (five enemies) | 1.6 |
| 1-Paw Home | 3 | 3.5 | 3.3–3.5 | — | Come Running 7.0 | 2.5 |
| 2-Paw single-target / utility | 11 | 8.0 | 7.2–8.5 | Everything Off The Shelf 8.5 (+6%) | Nine Shadows 9.0 (Frazzled target) | 6.0 |
| 2-Paw AoE | 5 | 8.0 | 7.8–8.1 | — | Avalanche 18.5 (five enemies) | 3.7 |
| 3-Paw | 1 | 13.0 | 12.6 | — | scales with incoming hits | about 5 |

Rules the catalogue obeys, and that any new Move must: (a) unconditional value within **±10%** of budget; (b) a Move whose best case exceeds budget by more than 15% must have a floor at least 15% under budget; (c) no single-target Move's best case exceeds **+65%** (Ledge Shove, needing terrain), and none exceeds +30% without needing terrain, a prior Move, or an enemy action; (d) the best a cat can do by pressing its strongest unconditional 1-Paw Move every time is 3.7 HE/Paw, 6% over the plainest Move in the game (Bunny-Kick, 3.5).

**Check 2: saving for 2 Paws is a choice, not an obligation.** 8.0 vs 2 × 3.5 = 7.0: a **14% premium** for banking, paid for by (i) a Crew cat's gauge holding only 2 Paws, so banking means sitting full and wasting fill, and (ii) AI cats needing about 40 s to bank two. Mikan's third Paw (Life 4) is what makes banking comfortable, and only for Mikan.

**Check 3: the worst-case stack is bounded.** Proposed stacking rules (to Combat): the same effect does not stack with itself (refresh duration, keep the stronger); Hide-down effects do not stack with each other; and the product of all outgoing-damage amplifiers on one hit, *including a Move's own conditional multiplier*, is capped at **×2.0**, applied before Frazzled's ×1.5–2.0. The best possible single hit is then Nine Shadows on a Frazzled, marked, stared-at target under Rumble: 5.0 × 2.0 (cap; uncapped it would be 1.6 × 1.25 × 1.2 × 1.22 = 2.93) × 2.0 = **20 BH for 2 Paws**, after four Paws of set-up by three other cats. Six Paws for 20 + the set-up Moves' own 10 HE = 5.0 HE/Paw, **+43% over budget at perfect play**, once per Frazzle window. A Boss has 132 BH of Nerve: this is 15% of a Boss. It is the game's biggest hit and it takes a whole Posse to make.

**Check 4: Mikan's freedom is paid for.** Effective weight of Mikan (Scrapper, Adult) using each Style's Moves against that Style's own specialist:

| Mikan using... | Stat | Mikan | Specialist | Mikan as % |
|---|---|---|---|---|
| Scrapper Moves | Bite | 1.20 | 1.20 | 100% |
| Bruiser Moves | Bite | 1.20 | 1.00 (with Nerve 1.30, Hide 1.25) | 120% damage, about 55% of the staying power |
| Prowler Moves | Bite | 1.20 | 1.30 | 92% |
| Yowler Moves | Voice | 0.75 | 1.35 | 56% |
| Trickster Yowl / utility | Voice | 0.75 | 1.15 | 65% |
| Trickster Thump | Bite | 1.20 | 0.95 | 126% |

Mikan is a better thrower than a Trickster and a better slammer than a Bruiser per hit, and a poor healer and buffer. The risk this exposes is listed under Open Questions (Mikan with borrowed Thump and Fang capstones).

**Check 5: the ten example Posses.** Per-cat output over the reference 60 s = `Paws × mean HE per Paw of its kit × stat weight × uptime + 6 × Bite weight × uptime`, with uptime (share of the fight spent standing and acting) assumed Bruiser 1.00, Scrapper 0.92, Prowler 0.85, Yowler 0.93, Trickster 0.93. Lane Standard: Mikan 29.7 + Bruiser 16.5 + Yowler 17.4 + Trickster 15.6 = **79.2 HE = index 100** (against 77 HE of enemy: a 58 s fight). Per-cat spread across Styles is 15.6–18.2 (±8%).

Three reference fights: **Captain** (above); **Boss** (one target, 240 s, AoE Moves at their single-target value, healing and mitigation counted at full value instead of half); **Mob** (six Toughs, AoE at 2.0 / 3.0 targets, Frazzle worth nothing because Toughs are Routed first). Results are in the §3.13 table. Reading them:

- Range across builds: Captain **88–113**, Boss **82–115**, Mob **86–124**.
- No build is top in two columns. The three column winners (Night Shift, Mark & Execute, Herd & Dump) are respectively below baseline on Boss, on Mob, and on Boss.
- Matchup swings (±25% by damage type, per the assumed chart) are larger than build swings in the Captain column. Who you bring matters more than what you taught them: the intended ordering.
- Ageing redistributes instead of nerfing: elder Mikan's personal share of Posse output falls from about 37% to about 22%, while the Posse index stays at 101–103 because of Old Boss.

**Confidence.** These indices are hand-estimated from the model above, not simulated. Treat differences under 10 points as noise. A spreadsheet or Monte Carlo pass is specified in Acceptance Criteria (AC-22) and should replace this table once Combat's real formulas exist.

### F11. Power Rating

```
PowerRating(cat) = round( ( nerve / PR_NERVE_DIV + bite + hide + voice + zip ) × kit_mult × knack_post_mult )

kit_mult = 1 + PR_MOVE × Σ rank(slotted moves) + PR_KNACK × n_knacks + PR_ZOOM × zoomies_tier
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| nerve, bite, hide, voice, zip | int | F1 ranges | Final stats (already include Temperament, Loyalty or age) |
| PR_NERVE_DIV | int | 10 | Puts Nerve on the same scale as the other stats |
| Σ rank | int | 0–16 | Sum of Ranks (I = 1 … IV = 4) of the 4 slotted Moves; empty slot = 0 |
| PR_MOVE, PR_KNACK, PR_ZOOM | float | 0.02, 0.03, 0.05 | Weights |
| n_knacks | int | 0–2 | Slotted Knacks |
| zoomies_tier | int | 0–2 | |
| knack_post_mult | float | 1.0, or 1.10 for a Sentry with Lone Tom | Post-specific Knack effect |
| PowerRating | int | about 45–1,600 | Single-number strength for Territory's raid math and Nemesis's simulation |

**Output range.** Bounded, not clamped. Minimum about **45** (Lv 1, two Rank I Moves, low Loyalty: stat sum about 44 × 1.04). Maximum about **1,600** (Lv 50 Bruiser, Loyalty 100: stat sum about 980 × 1.48 × 1.10 Lone Tom on post). Because of the budget-5 rule, same-level cats of different Styles differ by under 6% in stat sum (Bruiser 917, Prowler 872 at Lv 50 before modifiers); Power Rating mostly reads level, kit and Loyalty, as intended. It deliberately excludes Combat's enemy-rank Nerve multipliers: callers comparing a Sentry with a Captain must apply their own rank weight.

**Worked example.** The Lv 24 Bruiser from F1 with Head-Bonk (I), Loaf (I), Sit On It (II), Scruff Grab (II), two Knacks, Zoomies I: (175.6 + 82 + 103 + 62 + 53) = 475.6; kit_mult = 1 + 0.02 × 6 + 0.06 + 0.05 = 1.23 → **585**.

---

## Edge Cases

| Scenario | Expected Behavior | Rationale |
|---|---|---|
| Recruit accepted but the Crew is at cap | Cannot happen: Recruit is disabled at cap with the reason shown ("No room at the Lot"). The Lot offers Dismissal first | Never take the Offering and then fail |
| Carried Morsels are less than the chosen Offering | Offering steps above what Mikan carries are disabled; "nothing" is always available | Offerings come from carried Morsels, not the Stash, so going out to recruit is a planned trip |
| Recruit refused | 25% of the Offering is lost, 75% returned; `RecruitRefused` emitted; +15 future Willingness (max 3 times). Proposed: Verdict prompt reopens without Recruit | A refusal still moves the relationship forward |
| Rival is more than 5 levels above Mikan | Recruit disabled | Prevents carrying the game with one over-levelled catch |
| Recruited cat has fewer than 4 Moves | Empty slots stay empty until filled by Instinct, Lesson, Watching, Elder or Keepsake; no replace prompt needed | Early cats have 2–3 Moves; the first 40-Morsel Lessons fill them |
| A cat reaches an Instinct level with 4 Moves slotted | The Move goes to Pending; the cat is not interrupted. If never slotted, Old Habits lets it be learned free at any later time | No forced choice mid-patrol; nothing lost |
| Fourth item arrives in a full Pending list | Oldest Pending item is dropped, with a warning naming it. Instinct items are recoverable (Old Habits); a Watched Move's pips are kept at threshold so it can be re-claimed at the Lot | No silent loss |
| Player tries to forget the Crew's last copy of a non-Instinct Move | Confirmation naming the Move and stating whether it can ever be got again (Elder: yes, for a fee; Street: yes, from Rivals; Boss: only if that Boss is fought again or recruited; Keepsake: **no**) | Informed, reversible where possible |
| A cat betrays while holding the only copy of a Move | It leaves with it. The Morning Sniff entry (UX) should show the lost Move's icon | Pillar 4: betrayal costs something personal |
| A cat betrays while in the Posse | `BetrayalTriggered` is resolved in the Night Shuffle, so the cat is simply gone at morning; the Posse slot is empty and the Lot prompts for a replacement | Betrayals never occur mid-fight |
| Cat is recruited, leaves, is recruited again | Keeps level, Moves and Memory; starting Loyalty takes −20 (F7) | They have done this before |
| Teacher forgets a Move after teaching it | Student keeps it. Moves are copied, not lent | Simplicity |
| Teacher and student have both already used today's Lesson | Lesson option disabled with the reason; resets at `DayEnded` | The daily limit is the anti-spam rule: a 24-cat Crew can move at most 24 Moves a day |
| Lesson for a Move the student's Style cannot learn | Not offered in the list at all | Do not show impossible options |
| Mikan is taught a Move already in the Repertoire | Not offered | — |
| Watch pips for a Move the cat cannot learn (wrong Style, Rank too high) | No pips accrue | Avoids "ready but unusable" clutter. Pips start counting once the cat reaches the Rank level |
| The same enemy uses a Move ten times in one fight | Max 2 pips per Move per encounter per cat | Stops stall-farming, which would also break the 90 s rule |
| Watcher is Routed mid-fight | Pips earned before the Rout are kept; none after | Must be watching |
| A Critter uses something resembling a Move | No pips. Only cats teach cats | Brief: Critters are never Crew |
| XP award would raise a cat by more than 3 levels | Capped at 3 × xp_to_next of its current level; excess is discarded | Stops one Boss fight from power-levelling a kitten to the band |
| Posse wins but Mikan was Routed | Mikan gets 50% like any Routed Posse cat | Canon: the fight continues while any Posse cat stands |
| Posse wipe | No XP; −3 Loyalty to Posse cats; pips earned are kept | Losing is a nemesis event, not a progression reset |
| Level-up during a fight | Applied at `EncounterEnded`; current Nerve keeps its percentage | No mid-fight stat jumps |
| Loyalty crosses a tier and changes stats mid-day | Stats recompute only at `DayEnded` | Stable numbers within a day |
| Zoomies II unlocked, then Loyalty falls below 60 | Stays unlocked | Do not take toys away; the Loyalty stat multiplier is the ongoing consequence |
| Loyalty is 0 | Cat still fights at ×0.95. Nothing else happens here; whether it betrays is Nemesis's call | Clear ownership |
| All Crew are Routed or posted and Tail-Up is used | Tail-Up lists nobody; the button shows "Nobody's free" | — |
| Posse has fewer than 3 Crew (early game, or after betrayals) | Legal. Combat runs with whoever is there | Lives 1–2 grow the Posse one cat at a time |
| Sentry is Tail-Upped | Not allowed; must be un-posted first | Territory owns post changes |
| Share a Meal with exactly enough Morsels in the Stash but none carried | Meals at the Lot draw from the Stash (the Lot is next to the house); Offerings in the field draw from carried Morsels | Each sink uses the pocket that is physically there |
| Bond never reaches a Home Move's threshold | The Move is learned at the start of the following Life | Nothing missable (Pillar 2: home is wanted, not punished for) |
| Mikan reaches Life 4 with H1 and H2 both still unlearned | Both fallbacks have already fired (start of Life 3 and Life 4) | Fallbacks are per-Move and cumulative |
| Mikan at Lv 50 in Life 9 | Elder row applies to Lv 50 stats; Mikan's Nerve is 2,125, Bite 144, Zip 129 | Elder Mikan at the cap is about as tough as a Lv 43 adult |
| No Crew cat is Sworn when the heir is chosen | The three highest-Loyalty cats are eligible | There is always an heir |
| The heir already knows 4 Moves | Normal replace prompt for the inherited Move | — |
| Two cats share a `coat_seed` hash and so a Temperament | Fine: 11 Temperaments across 24 Crew will repeat | Temperament is flavour, not identity |
| Crew cap falls (Clout lost) below current Crew size | Nobody is removed; no new recruits until under cap | Never delete a cat by rule |
| Fallback cut (40 Moves) is taken | The 20 ✂ Moves are removed: Elders and Keepsakes disappear as sources; `DefaultKit` and every learn route still function | The cut was chosen to remove whole routes cleanly, not to leave holes |

---

## Dependencies

| System | Direction | Nature of Dependency |
|---|---|---|
| Combat | This depends on Combat | Needs the real damage/heal formulas, Paw rules, the Style resist/weak defaults, Frazzle values, and final Move/Knack/Zoomies numbers; needs a Move-use notification for Watching |
| Combat | Combat depends on this | Consumes final stats, slotted Moves/Knacks, Zoomies tier, `DefaultKit`, Mikan's age row |
| Nemesis | This depends on Nemesis | `VerdictApplied`, `BetrayalTriggered`; reads Grudge, rank, Memory; needs agreement on the refusal flow and Comes Knocking |
| Nemesis | Nemesis depends on this | `Loyalty()`, `PowerRating()`, `DefaultKit()` for generated Rivals; Rival levelling uses F1–F3 |
| Territory & Economy | This depends on it | Clout rank → Crew cap; `RaidResolved`, `PatchChanged`, `DistrictClaimed`; patch level; confirmation of every proposed price; Keepsake and Shiny sources |
| Territory & Economy | It depends on this | `PowerRating()` for raid resolution; Loyalty tier for posting eligibility; Morsel sinks defined here (Lessons, Offerings, meals, Elders) |
| Narrative | This depends on Narrative | `BondChanged`, `LifeAdvanced`, cat-flap and crib beats; identities of story recruits and Elders |
| Narrative | Narrative depends on this | `HeirNamed`; Home Move learning moments; Crew state for epilogue variations |
| Clock (brief §5) | This depends on Clock | `DayEnded`, `PhaseChanged`, `LifeAdvanced` |
| UX | UX depends on this | Data and rules behind the Lot screens, Verdict prompt's Willingness readout, pending markers, warnings |
| Level design | Level depends on this | Placement needs: 12 Friend Strays, 6 Elders, 5 Keepsakes; walls and props for S9, B8, T1, T4 |
| Art / Audio | They depend on this | Events needing feedback (below); Temperament and Loyalty tier may want idle-animation variants |

Bidirectionality note: the other GDDs are being written in parallel and cannot yet list this doc. Each row above must be mirrored in them at the cross-GDD review.

**Events this system emits (proposed additions to brief §6.1):** `CatRecruited(cat_id, source)`, `RecruitRefused(rival_id, refusals)`, `CrewDismissed(cat_id, loyalty)`, `CatLevelledUp(cat_id, new_level)`, `MoveLearned(cat_id, move_id, route, replaced_move_id)`, `LoyaltyTierChanged(cat_id, old, new)`, `HeirNamed(cat_id)`.
**Consumer additions requested:** Crew as a consumer of `RaidResolved`, `PatchChanged`, `DistrictClaimed`, `BondChanged`.
**Queries this system serves:** `PowerRating(cat_id)`, `Loyalty(cat_id)` (both canon), `RecruitWillingness(rival_id, offer)`, `AskPrice(rival_id)`, `DefaultKit(style, level, rank, seed)`, `StatsAt(style, level, temperament)`.

### Cross-doc assumptions

Written without sight of the other GDDs. Each must be checked at `/review-all-gdds`.

| # | Assumption | Owner | If wrong |
|---|---|---|---|
| A-1 | A basic hit (BH) on a same-level neutral target is about 9% of neutral Nerve at every level, and Move damage is `BH × Power`, scaling linearly with the user's Bite (Claw/Fang/Thump) or Voice (Yowl, heals, buffs) | Combat | Power values in §3.9 are re-expressed; learnsets and sources stand |
| A-2 | Combat accepts §3.9 and §3.10's type/cost/power/effect columns as a starting proposal, and keeps the 60 names and Style assignments so learnsets stay valid | Combat | If Combat authored its own list of 60, the two lists are merged by Combat for effects and by this doc for learn data |
| A-3 | Moves cost 1 or 2 Paws; one 3-Paw Move (Crib Guard) is acceptable for Mikan from Life 4 | Combat | Crib Guard becomes 2 Paws at 8.0 HE |
| A-4 | Style default resist/weak is the table in §3.13, at ×0.75 / ×1.25 | Combat | The Boss-counter rhythm and the "types reachable" check are redone against the real table |
| A-5 | "Ruffled" can be applied by Moves for a stated duration; interrupting a wind-up causes Ruffled; an Ambush hit can occur mid-fight from stealth | Combat | Prowler and Trickster kits lose their engine and need redesign |
| A-6 | AI-controlled cats use any slotted Move competently, including 2-Paw and set-up Moves, and the "Old Boss" raise of the AI Paw-fill rate in Lives 7–9 is acceptable | Combat | Elder penalties are halved; some set-up Moves become player-only in practice |
| A-7 | A day yields about 26 Tough-equivalents of XP for a Posse cat (about 9 encounters) from Life 3 on, about 15 in Life 2 | Combat (encounter composition), Level | Rescale `FPL_CAP` |
| A-8 | Combat can notify this system each time an enemy cat uses a Move and whom it hit (`MoveUsed`) | Combat | Watching falls back to "was in the Posse for an encounter where the Move was used": 1 pip per encounter |
| A-9 | Arena props and ledges exist in most arenas and can be triggered by knockback and by T1 | Combat, Level | Conditional values of B8, S9, T1, T4 drop to their floors; Clatter & Splash weakens |
| A-10 | The Verdict prompt can show Willingness before the choice, take an Offering amount, and reopen after a refusal with Recruit removed; the refusal is recorded in Memory | Nemesis, UX | If Recruit must be deterministic, replace the roll with a threshold: accepted when W ≥ 50, and show exactly what is missing |
| A-11 | Bosses can be given the Recruit Verdict only after their district is claimed; Botan's recruitability is undecided | Nemesis, Narrative | Remove the Boss row from F5/F6 |
| A-12 | Nemesis reads Loyalty for betrayal and treats Shifty (0–19) as the eligible band and Sworn as immune | Nemesis | Tier descriptions change; formula stands |
| A-13 | Generated Rivals get their Moves and Knacks from `DefaultKit`; a Rival that becomes a Nemesis may be given Grudge-Bearer | Nemesis | Street Moves need another delivery route |
| A-14 | Crew cap by Clout rank is 6 / 8 / 10 / 13 / 16 / 20 / 24 | Territory & Economy | Use their table |
| A-15 | Prices proposed in F6, F9, §3.6 (meal), §3.7 (Elders, Knack Lessons), §3.4 (Stray food) are confirmed or replaced by Economy; Shinies budget here is about 20 for Elders + about 15–25 for Rank IV Lessons, of 120 | Territory & Economy | Rescale; ratios between Ranks should be kept |
| A-16 | Territory supplies a level per Patch (default: district band midpoint), allows posting by Loyalty tier as proposed, and emits `RaidResolved` with `sentries_routed[]` | Territory & Economy | Sentry XP uses the district midpoint; tier gates become advisory |
| A-17 | Bond's Life minimums are low enough that the Home Move thresholds (3 / 5 / 7 / 8) are reachable in the stated Life by a player who comes home by Dusk about half the time | Narrative | Shift thresholds; fallbacks guarantee the Moves either way |
| A-18 | The cat-flap beat (mid Life 2) and a crib-guard beat (Life 6) exist as identifiable events | Narrative | Use the level and Life fallbacks only |
| A-19 | The One Cat Schema can take the extension fields in §3.1 | Technical director / all | Temperament derives from `coat_seed`; the rest live in a Crew-side table keyed by `id` |

### Assumptions for creative-director review

Things the brief did not cover and this doc decided inside its boundary.

1. **Temperament** (11 values, ±8% to two stats) exists. It adds individuality at near-zero cost, but it is a new named concept.
2. **Crew cats know only 4 Moves; Mikan never forgets.** The brief says "4 equipped". This doc reads that as "4 known" for Crew to honour the Pokémon request, and as "4 slotted from an unlimited Repertoire" for Mikan.
3. **Home Moves**: four Mikan-only Moves learned from home life, gated by Life and Bond with a no-miss fallback. This takes the total to 64 Moves ("about 60") and ties Bond to combat power beyond Well-Fed. It leans on Narrative to stage four small beats.
4. **Recruiting is a visible-odds roll**, softened by ear-posture display, partial refund, and +15 per refusal. A deterministic alternative is in A-10.
5. **Using a Fear in the fight lowers recruit Willingness.** Deliberate tension between winning easily and winning respect.
6. **Loyalty changes stats** by up to ±5%.
7. **Elders** (six non-combatant old cats) and **Keepsakes** (five found objects) as Move sources. Cat-true check: a box, a feather wand, a paper bag, catnip, a pocket mirror. No human technology is operated.
8. **Tail-Up**: swapping Posse members in the field by calling a Lounging cat, 30 s cooldown. Canon says "swappable any time outside combat"; the pillars doc says management happens at the Lot. This is the narrowest reading that satisfies both: *swap* anywhere, *manage* (teach, post, dismiss, re-slot) at the Lot.
9. **Old Boss**: elder Mikan raises the AI Paw-fill rate. Touches a canon number (50%) and so needs sign-off, not only Combat's agreement.
10. **Boss signature Moves are learnable** (one per Style, from the five district Bosses) by Watching or by recruiting the Boss.
11. **The heir inherits Mikan's Zoomies and one Move, including a Home Move.**
12. **No XP items, no purchasable levels.**
13. Vertical-slice Styles are proposed as **Scrapper, Bruiser, Yowler**.

---

## Tuning Knobs

| Parameter | Current Value | Safe Range | Effect of Increase | Effect of Decrease |
|---|---|---|---|---|
| `NERVE_L1 / NERVE_L50` | 100 / 2,500 (canon) | fixed by brief | — | — |
| `STAT_L1 / STAT_L50` | 10 / 160 (canon) | fixed by brief | — | — |
| `STYLE_W` rows | §3.2 | each weight 0.65–1.40; **row sum must stay 5.00** | Sharper Style identity, bigger matchup swings | Styles blur together |
| Temperament strength | ±8% | 0–12% | More individual cats; "bad nature" complaints above 10% | Cats of a Style feel identical |
| `LOY_MIN / LOY_SPAN` | 0.95 / 0.10 | span 0–0.15 | Loyalty matters in fights; stronger rich-get-richer loop | Loyalty is purely social/territorial |
| `AGE_W` rows | §3.11 | 0.65–1.30 per cell | Ageing is felt harder | Ageing is cosmetic |
| Old Boss AI fill (Lives 7/8/9) | 55 / 60 / 70% | 50–80% | Crew carries more; above 80% the player stops switching | Elder Mikan drags the Posse down |
| `YIELD_BASE / YIELD_PER_LEVEL` | 8 / 4 | keep ratio; scale both | No pacing change alone (need and yield move together) | — |
| `FPL_CAP` | 24 TE | 16–32 | Slower levelling; more days per Life | Faster; risk of out-levelling a district |
| `FPL_START / FPL_RAMP` | 6 / 3 | 4–10 / 2–5 | Slower tutorial levels | Life 1 over in minutes |
| `RANK_XP` (Captain / Boss / Botan) | 6 / 30 / 50 | 4–8 / 20–40 / 30–60 | Rivals are the XP; Toughs feel like filler | Fighting named cats is not worth the risk |
| `DIFF_SLOPE` | 0.15 | 0.08–0.20 | Faster catch-up, harsher anti-grind | Benched cats stay behind |
| `DIFF_MIN / DIFF_MAX` | 0.10 / 2.50 | 0.05–0.30 / 1.5–3.0 | (max) power-levelling by carry; (min) grinding viable | — |
| Routed share / Lot gossip share | 0.50 / 0.25 | 0.25–0.75 / 0.10–0.50 | Whole Crew stays level, swapping is free; less attachment to "my three" | Benched cats rot; swapping is punished |
| `AWARD_CAP_LEVELS` | 3 | 1–5 | Boss fights can rocket a low cat | Carrying is pointless |
| `SENTRY_TE` / Warden mult | 8 / 1.25 | 4–14 / 1.0–1.5 | Guard duty is the best training; Posse feels unnecessary above 14 | Posting a cat stunts it |
| Turf XP (Patch / District) | 4 TE / 50% of a level | 0–8 / 0–100% | Territory play levels the Crew | XP comes only from fights |
| `BASE_W` (Stray/Tough/Captain/Boss) | 60 / 45 / 20 / 5 | ±15 each | Easy recruiting; Crew fills fast; Rivals feel disposable | Courtship takes many fights |
| `CLOUT_W` | 4 per rank | 2–6 | Late game recruits anyone | Clout irrelevant to recruiting |
| `OFFER_W` | 15 per step | 8–20 | Morsels buy cats (risk 5) | Offerings feel pointless |
| `GRUDGE_W` | 0.5 | 0.3–0.7 | Nemeses nearly unrecruitable | Grudge does not matter |
| `FEAR_W` / `PILE_ON_W` / `BOSS_FINISH_W` | 10 / 10 / 5 | 0–15 each | How you win matters more | Only the outcome matters |
| `PITY_W` | 15 (max 3) | 5–20 | Persistence guarantees the cat | Bad luck streaks |
| `W_MIN / W_MAX` | 5 / 95 | 0–10 / 90–100 | — | — |
| Refusal loss | 25% of Offering | 0–50% | Failed recruits sting | Free retries with feasts |
| Max level gap for Recruit | 5 | 3–8 | Can catch stronger cats | Must out-level first |
| `ASK_PER_LEVEL` / `RANK_PRICE` | 8 / 0.75, 1, 2, 4 | Economy's call | — | — |
| `SRC_LOY` values / `GRUDGE_L` | 45, 55, 60, 65 / 0.4 | ±10 / 0.2–0.5 | Recruits arrive trustworthy | Every recruit is a flight risk |
| Loyalty gains (F8 table) | as listed | each 0–5 | Loyalty is trivial to max | Loyalty is a chore |
| Idle grace / `IDLE` / neglect mults | 2 days / 1 / 1, 2, 3 | 1–4 / 1–2 / up to 4 | Benching is dangerous; more betrayals | Betrayal never fires from neglect |
| Thaw multiplier / threshold | 0.5 / Grudge 50, until Loyalty 40 | 0.3–1.0 | Ex-Nemeses come round quickly | Turning a Nemesis takes most of the game |
| Meal Loyalty / cost | +3 / 2 × level | 1–5 / Economy | Morsels buy Loyalty outright | Only play earns Loyalty |
| Tier thresholds | 20 / 40 / 60 / 80 | ±10 | — | — |
| Instinct levels | 1, 1, 5, 10, 17, 25, 34 | last one 30–40 | — | — |
| Rank min levels | 1 / 10 / 20 / 30 | ±3 | Lessons lag behind Instinct | Lessons hand out capstones early |
| Knack slot levels / native Knack levels | 3, 12 / 3, 12, 22 | ±4 | — | — |
| Watch thresholds (I–IV) | 3 / 4 / 6 / 8 | 2–5 / 3–6 / 4–8 / 6–12 | Watching is a long project | Every fight teaches something; Lessons lose value |
| Pips per encounter cap / hit bonus | 2 / ×2 | 1–3 / ×1–×3 | Faster; encourages letting enemies act | — |
| Mikan Watch divisor | 2 | 1–3 | Mikan hoovers up Moves | Mikan learns like anyone |
| Lessons per cat per day (give / take) | 1 / 1 | 1–3 | A Move spreads through the Crew in a day | — |
| `LESSON_BASE` I–IV / cross mult | 40, 150, 450, 1,000 / 1.5 | Economy; keep about 3× steps / 1.2–2.0 | Kits are expensive; builds change rarely | Everyone knows everything |
| Refresher mult | 0.5 | 0.25–1.0 | Forgetting is costly | Forgetting is free; slot limits lose meaning |
| Pending list size | 3 | 2–5 | — | — |
| `DefaultKit` Street chance (Tough / Captain) | 15% / 60% | 5–30% / 40–80% | Street Moves are common; recruiting for Moves is easy | Street Moves are rumours |
| Zoomies I level / II level / II Loyalty | 8 / 30 / 60 | 5–10 / 24–36 / 40–80 | Limit breaks arrive late | — |
| Home Move Bond thresholds | 3 / 5 / 7 / 8 | Narrative's Bond curve decides | Home Moves usually arrive by fallback | Everyone gets them on time; Bond feels irrelevant to them |
| Tail-Up cooldown / arrival time | 30 s / 5 s | 10–120 s / 3–10 s | Swapping is a commitment | Free hot-swap between every fight |
| Crew cap by rank | 6…24 | Territory & Economy | — | — |
| `BUDGET` (1 / 2 / 3 Paws) | 3.5 / 8.0 / 13.0 HE | 3.0–4.0 / 7.0–9.0 / 11–14 | (2-Paw) banking becomes mandatory | 2-Paw Moves are traps |
| `FRZ_HE` | 0.10 | 0.06–0.14 (follows Pile-On value) | Frazzle Moves are undervalued by the model and get buffed | — |
| Amplifier cap (proposed to Combat) | ×2.0 | 1.5–2.5 | Mark & Execute dominates Bosses | Set-up Moves are not worth a slot |
| AoE secondary-target falloff (proposed) | 1.0 (none) | 0.6–1.0 | — | Tames Herd & Dump's +24% on mobs (recommended first lever if playtests agree with the model) |
| `PR_MOVE / PR_KNACK / PR_ZOOM` / `PR_NERVE_DIV` | 0.02 / 0.03 / 0.05 / 10 | 0–0.04 / 0–0.05 / 0–0.10 / 8–12 | Kits matter for Sentries; teaching your guards pays | Power Rating is just level |

All values live in data files (stat tables, learnsets, loyalty weights, recruit weights, price tables), none in code.

---

## Visual/Audio Requirements

| Event | Visual Feedback | Audio Feedback | Priority |
|---|---|---|---|
| Level-up | A long stretch and a full-body shake at encounter end; small bell-gold "+1" over the cat. No screen takeover | Rising three-note chirp in the cat's Style voice | High |
| Move learned (Instinct, Watch) | Ears prick, "!" pops; icon of the Move drifts to the cat's portrait | Curious "mrrp?" | High |
| Lesson | 3–4 s play-fight at the Lot: teacher demonstrates, student copies badly, then well | Two voices trading; a soft success sting | High |
| Watch pip gained | A tiny eye-glint on the watching cat, only when it is on screen | None in combat (mix is full); a tick in the post-fight summary | Low |
| Willingness readout | Ear posture on the Routed Rival, four clear poses; tail-tip flick rate as secondary cue | Hiss, grumble, uncertain mew, chirp | High |
| Recruit accepted | Nose-touch, then the Rival's outline tick turns bell-gold | Their personal yowl-sting resolved to major (Audio) | High |
| Recruit refused | Eats, turns its back, walks off with tail high | A dismissive "prrt" | Medium |
| Friend Stray Trust pip | Slow blink returned; the Stray sits one step closer each day | Quiet purr that gets a little louder each pip | Medium |
| Loyalty tier up / down | At the Lot next morning: the cat sits nearer to (or further from) Mikan's crate | — | Medium |
| Tail-Up | Mikan's tail goes straight up with a quiver; the incoming cat arrives along the nearest wall | Mikan's chirp, answered from off-screen | Medium |
| Mikan's Life-stage change | Silhouette and animation set change (canon: Lives 1, 2, 8, 9); stat row applied silently | — | High (Art-owned) |
| Home Move learned | Staged at home by Narrative; no UI until Mikan next leaves the wall, then a single small card | The Call motif fragment (Audio) | High |
| Heir named | Bell placed on the heir | Bell | High (Narrative-owned) |

## Game Feel

This system is menu- and world-interaction-driven; moment-to-moment feel belongs to Combat. Targets that are this system's own:

- **Feel reference**: the Lot should feel like visiting your party at a camp in *Final Fantasy VII Remake*'s quieter beats crossed with opening the Pokémon summary screen, without leaving the world: cats are physically there, on crates. Not a spreadsheet.
- **Input responsiveness**: Tail-Up menu opens within 100 ms; a Lesson is confirmed in two presses from selecting the student.
- **Never interrupt a patrol**: level-ups, Pending Moves and Watch completions are summarised in one strip at encounter end (under 2 s, dismissible), never a modal.
- **Weight**: learning is light and frequent; forgetting has one beat of friction (a confirm) and a last-copy warning; dismissal and heir are the only heavy, slow confirmations.
- **Feel acceptance**: playtesters can say which of their cats is "the loyal one" and "the one I don't trust" without opening a menu.

## UI Requirements

| Information | Display Location | Update Frequency | Condition |
|---|---|---|---|
| Cat sheet: name, Title, Style, level, XP bar, five stats, Temperament, Loyalty tier, 4 Moves, 2 Knacks, Zoomies tier, Scars/Fears (from Nemesis) | Lot roster screen; Posse quick-view in pause | On open | Always |
| Learnable list for a cat: each Move with source, Rank, who can teach it today, cost | Lot Lesson screen | On open | Filtered to compatible Moves only |
| Watch pips per Move | Cat sheet, as paw-pad pips | After each encounter | Only for Moves with at least 1 pip |
| Pending "!" | Over the cat in the world; on its portrait | Immediate | Pending list not empty |
| Willingness (ear posture + %) and Offering steps with prices | Verdict prompt (UX) | Live as Offering changes | Recruit highlighted |
| Crew count / cap | Lot screen header; Verdict prompt | On change | Always |
| Last-copy and unrecoverable warnings | Replace/Dismiss confirm | On action | When true |
| Idle days and former rank ("sulking") | Lot roster, as a small cloud icon | Daily | `days_idle > 2` |
| Mikan's Repertoire and Home Moves (locked ones shown as a silhouette of a home object, no text hint) | Mikan's sheet | On open | Always |
| Power Rating | Sentry assignment screen (Territory/UX) | On kit or level change | When posting |

## Cross-References

| This Document References | Target GDD | Specific Element Referenced | Nature |
|---|---|---|---|
| Move damage = BH × Power, scaled by Bite or Voice | Combat GDD (path TBD) | Core damage and heal formulas | Rule dependency |
| Paw costs, Paw fill rates, AI 50% fill | Combat GDD | Pounce Gauge rules | Rule dependency |
| Style default resist/weak table | Combat GDD | Damage types | Rule dependency |
| Ruffled, Frazzle, Pile-On, Ambush-in-combat | Combat GDD | Status definitions | Rule dependency |
| All (P) columns of §3.9 and §3.10 | Combat GDD | Move, Knack, Zoomies definitions | Ownership handoff |
| XP and Loyalty triggers | Combat GDD | `EncounterEnded`, `CatRouted`, requested `MoveUsed` | State trigger |
| Recruit flow start; refusal handling | Nemesis GDD (path TBD) | `VerdictApplied`, Verdict prompt rules | State trigger |
| Crew removal | Nemesis GDD | `BetrayalTriggered` | State trigger |
| Grudge, rank, Memory read at recruit and by K18 | Nemesis GDD | Rival fields | Data dependency |
| Loyalty and Power Rating outputs | Nemesis GDD; Territory & Economy GDD | `Loyalty()`, `PowerRating()` | Ownership handoff (we provide) |
| Crew cap | Territory & Economy GDD (path TBD) | Clout rank gates | Data dependency |
| Sentry XP and Loyalty triggers | Territory & Economy GDD | `RaidResolved`, `PatchChanged`, `DistrictClaimed`, patch level | State trigger |
| All proposed prices | Territory & Economy GDD | Morsel and Shiny sinks | Ownership handoff |
| Home Move gates; Zoomies I for Mikan; ageing | Narrative GDD (path TBD); creative brief §5 | `BondChanged`, `LifeAdvanced`, cat-flap and crib beats | State trigger |
| Level bands, expected level per Life, slots, content counts | `design/creative-brief.md` §4, §8 | Shared numeric frame | Rule dependency |

---

## Acceptance Criteria

Stats and levels
- [ ] AC-1: For every Style, `Σ STYLE_W` = 5.00 (data validation test fails the build otherwise).
- [ ] AC-2: A Style-neutral, Even, bond_mod 1.0 cat has Nerve 100 at Lv 1 and 2,500 at Lv 50, and other stats 10 and 160. A Lv 24 Stubborn Bruiser at Loyalty 70 has Nerve 1,756, Bite 82, Hide 103, Voice 62, Zip 53.
- [ ] AC-3: `xp_to_next` returns 72, 864, 1,536 and 4,896 at Lv 1, 7, 14 and 49; total XP for Lv 50 is 125,832.
- [ ] AC-4: A Lv 14 standing Posse cat receives 562 XP for a Lv 16 Captain; a Lounging Lv 10 cat receives 205 for the same Rout; a Routed Posse cat receives half its standing award; on `loss` nobody receives XP.
- [ ] AC-5: No single encounter raises any cat by more than 3 levels.
- [ ] AC-6: In a scripted playthrough bot run using district-appropriate encounters at 26 TE/day, Posse level at each Life's end is within ±2 of 3 / 8 / 16 / 24 / 32 / 40 / 48.
- [ ] AC-7: A Lv 10 cat placed in a Lv 20 Posse reaches Lv 18 within 60 Tough-equivalents.
- [ ] AC-8: Stats never change between `EncounterStarted` and `EncounterEnded`.

Recruitment and Crew
- [ ] AC-9: `RecruitWillingness` returns 50 for the F5 worked example and is always within 5–95.
- [ ] AC-10: Recruit is unavailable (with a visible reason) when Crew = cap, when the Rival is 6+ levels above Mikan, and for Critters.
- [ ] AC-11: After a refusal, 75% of the Offering is back in carried Morsels and the same Rival's Willingness is 15 higher next time (to +45).
- [ ] AC-12: A recruited Rival's name, Title, Scars, Fears, Strengths, Memory, level, Moves and Knacks are identical before and after joining.
- [ ] AC-13: A Friend Stray gains at most one Trust pip per in-game day and joins at Trust 3 without a roll.
- [ ] AC-14: Tail-Up cannot be triggered in an encounter, in a Standoff, inside Haru's wall, within 30 s of the last one, or for a posted or Routed cat.

Loyalty
- [ ] AC-15: The F8 worked example yields 37. Loyalty is always 0–100. The tick runs before the Night Shuffle on the same `DayEnded`.
- [ ] AC-16: A Lounging ex-Captain loses 2 per day from the third idle day; an ex-Tough loses 1.
- [ ] AC-17: Only Steady+ cats appear as teachers; only Sworn cats (or the top three if none) appear as heir candidates.

Moves, Knacks, Zoomies
- [ ] AC-18: Data validation: exactly 60 Style Moves, 12 per Style, 7 Instinct per Style at Lv 1, 1, 5, 10, 17, 25, 34; 4 Home Moves; 20 Knacks; every Move has at least its native Style in its Styles list.
- [ ] AC-19: A Crew cat never has more than 4 Moves or 2 Knacks; a cat's Style can never learn a Move not listing it (Mikan excepted); a cat below a Move's Rank level cannot learn it by Lesson, Watch, Elder or Keepsake.
- [ ] AC-20: Forgetting an Instinct Move and re-learning it via Old Habits costs nothing; forgetting the Crew's last copy of a non-Instinct Move always shows the warning; Mikan's Repertoire never shrinks.
- [ ] AC-21: Watch: 2 pips max per Move per encounter; a hit on the watcher counts 2; Mikan learns a Rank II Move after 2 pips, a Crew cat after 4; Critters give none.
- [ ] AC-22: **Balance simulation.** A Monte Carlo (or spreadsheet) run of the ten §3.13 Posses in the three reference fights, using Combat's final formulas, shows: no build above 115 in two or more columns; every build within 80–125 in every column; no single Move providing more than 35% of any build's damage; best unconditional HE/Paw within 10% of budget for every Move. Failures are fixed by re-proposing numbers to Combat or by changing learn data here.
- [ ] AC-23: Crew Zoomies I unlocks at Lv 8 and II at Lv 30 with Loyalty 60+, and II persists if Loyalty later drops. Mikan's unlock at the cat-flap beat (or Lv 6) and at Life 5.
- [ ] AC-24: Each Home Move is in the Repertoire no later than the start of the Life after its target Life, regardless of Bond.
- [ ] AC-25: `PowerRating` returns 585 for the F11 worked example; two same-level, same-kit cats of different Styles differ by under 8%.

General
- [ ] AC-26: Every number in this document is read from data; changing a table value changes behaviour without a code change.
- [ ] AC-27: Performance: the `DayEnded` Loyalty tick and stat recompute for 24 Crew complete within 1 ms; an XP award pass for 24 Crew within 0.5 ms.
- [ ] AC-28: Playtest (vertical slice, no briefing): at least 70% of players use a Lesson before the end of Life 2, at least 50% change their Posse to counter Daifuku or after losing to him, and at least half can name one Crew cat and something that happened to it.

---

## Open Questions / Known Weak Spots

Honest list. Items 1–6 are the ones most likely to need a redesign rather than a retune.

| # | Question / weak spot | Owner | Deadline | Resolution |
|---|---|---|---|---|
| 1 | **Ownership overlap on the Move catalogue.** The brief gives Combat all Move definitions and numbers; this doc proposes a complete catalogue because the learn data cannot exist without names. If Combat has written a different 60, someone must merge. The (P) columns here should lose every conflict | creative-director, Combat, this doc | Cross-GDD review | Open |
| 2 | **The balance math is a paper model.** F10's indices are hand-estimated from assumed uptime, Paw income and utility values, with roughly ±10 points of error. They show the *shape* is plausible, not that it is balanced. AC-22 replaces it once Combat's formulas exist | this doc, Combat | Before vertical-slice content lock | Open |
| 3 | **AoE scales too well.** Avalanche at 18.5 HE on five clumped enemies and Herd & Dump at 124 on mobs are the largest outliers. Bait makes clumping reliable. A secondary-target falloff (knob provided, default off) is the first lever; the second is making Bait gather fewer cats | Combat, this doc | Combat prototype | Open |
| 4 | **Mikan with borrowed capstones.** Mikan has Scrapper Bite 1.20, three Paws from Life 4, the Repertoire and Prime +5%. Mikan slotting Wrecking Loaf, Thousand Paws, Anchor Drag and Nine Shadows may simply be the best damage dealer in every Posse, which makes the "interchangeable companions" promise ring hollow. Options: a small cross-Style potency penalty (e.g. ×0.9), limiting Mikan to two cross-Style slots, or accepting it as the protagonist fantasy. Player-experience call | creative-director | Before alpha | Open |
| 5 | **Forgetting may be toothless, or may be annoying, and it is not clear which.** With Mikan as a permanent library and Old Habits, the only real loss is Morsels. That could make the 4-Move limit feel like Pokémon without the sting (good) or like a fee on experimentation (bad). An alternative is to let Crew cats keep a small bench of known Moves (say 6 known, 4 slotted) | game-designer, this doc | Vertical-slice playtest | Open |
| 6 | **Recruit roll vs. Pillar 4.** A Verdict is a weighty choice; a 50% roll on it may feel like the game overriding the player, even with pity. The deterministic variant (A-10) is cleaner but removes courtship. Needs a decision before UX builds the prompt | creative-director, Nemesis, UX | Before Verdict UX spec | Open |
| 7 | Loyalty-to-stats is a positive feedback loop (used cats get loyal, loyal cats are stronger, stronger cats get used). It is capped at a 10% span and dampened by the idle grace, but it will widen the gap between "my three" and the other 21. Lot gossip at 25% may be too low for a game that sells swapping | this doc | Playtest | Open |
| 8 | With up to 36 Sentry/Warden posts and a Crew cap of 24, almost no cat need ever be idle, so neglect-driven betrayal may never fire. If Nemesis depends on neglect as a betrayal source, either posts should not fully satisfy a proud ex-Captain (e.g. only Den posts or Posse count for ex-Captains and ex-Bosses) or the driver should be something else | Nemesis, Territory, this doc | Cross-GDD review | Open |
| 9 | The Fear penalty on recruiting fights Combat's central trick (use the environment to hit Fears). If playtesters avoid the fun play to protect recruit odds, cut it | game-designer | Vertical-slice playtest | Open |
| 10 | Watching rewards *letting enemies act*, and doubles pips for being hit. In a game where "nothing may stall", that incentive points the wrong way. The 2-per-encounter cap limits it; it may need to be 1, or pips could require Routing the user afterwards | Combat, this doc | Combat prototype | Open |
| 11 | Home Moves tie Bond to power. Fallbacks make them unmissable, but a player who never comes home by Dusk gets each one a Life late: is that an acceptable soft penalty under "neither is punished" (brief §5.2)? Also depends on Bond's Life minimums, which this doc has not seen | creative-director, Narrative | Narrative GDD review | Open |
| 12 | Crib Guard is named for, and learned from, a home scene one Life before the bereavement. It must never be used to make a joke of that scene, and Narrative may prefer the Home Moves carry no specific scene reference at all | Narrative | Narrative GDD review | Open |
| 13 | Old Boss changes a canon number (AI Paw fill 50%). If refused, elder Mikan needs gentler penalties, and Life 9's "the Crew does the fighting" needs another mechanism | creative-director, Combat | Cross-GDD review | Open |
| 14 | Are Bosses recruitable at all, and is Botan? Recruiting Daifuku is a delightful idea and a balance problem (a Boss-kit cat in Life 2 with Avalanche). Currently: after the district is claimed, at base 5, max level gap 5. Botan is blocked pending Narrative | Narrative, Nemesis | Before alpha | Open |
| 15 | Temperament is derived from `coat_seed`, while Nemesis owns "personality". Two systems may end up describing one cat's character differently ("Skittish" stats, bold personality). Mapping Nemesis personality → Temperament would be better if their list allows it | Nemesis | Cross-GDD review | Open |
| 16 | Scope. 64 Moves, 20 Knacks, 6 Elders, 5 Keepsakes, 12 Friend Strays, 5 story recruits. Each conditional Move (props, ledges, stealth, lures, light spots, boxes, paper bags) is real Combat, animation and AI work; Glint, Bait, Box Fort, Bag Lurk, Play Dead and Switcheroo are the expensive ones. The ✂ list removes 20 Moves but was chosen for clean learn data, not for production cost: Combat and Art should re-pick it | producer, Combat, Art | Scope review | Open |
| 17 | AI competence with set-up Moves (A-6). If AI cats cannot use Bait, Vanish or Scent Mark sensibly, half the synergy table is player-only and builds with three set-up cats collapse. Possibly needs per-Move "AI use hints" in the data, which Combat would own | Combat | Combat prototype | Open |
| 18 | The Yowler is the only native healer; Trickster can learn Purr and Mikan has Biscuits. A Posse without a Yowler may be unviable on Bosses (All Elbows drops to 94), which would quietly make one Style mandatory. Watch the Boss-column spread in AC-22 | this doc, Combat | Balance simulation | Open |
| 19 | Vertical-slice mismatch: the prototype's 8 Moves include two Trickster Moves, but the slice's three proposed Styles are Scrapper, Bruiser and Yowler. Either the prototype's fourth cat is a Trickster who does not ship in the slice, or the slice Styles change | producer, Combat | Slice planning | Open |
| 20 | XP pacing rests on one unverified number (26 Tough-equivalents a day). If real days hold 15 or 40, every Life's length moves. `FPL_CAP` is the single knob to retune | Combat, Level, this doc | First full-day playtest | Open |
| 21 | Prices are proposals without sight of the Economy GDD. In particular, whether Lessons plus Offerings plus meals actually absorb late-game Tribute (1,200 a day) has not been checked from this side | Territory & Economy | Cross-GDD review | Open |
| 22 | Registry: `design/registry/entities.yaml` is empty. The cross-system facts introduced here (Style weights, `PowerRating`, `Loyalty` tiers, Rank levels, the 64 Move names, 20 Knack names, Crew cap table, `xp_to_next`) should be registered once the user approves; this pass was told not to edit other files | user | After review | Open |
| 23 | `design/gdd/systems-index.md` and `production/session-state/active.md` were not updated in this pass, for the same reason | orchestrator | After review | Open |

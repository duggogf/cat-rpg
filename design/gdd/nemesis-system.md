# Nemesis System ("Rivals") — Vertical Slice

*Owner: systems-designer (nemesis/AI) · Round 2 rewrite · 2026-11-23 · Iteration 3 (final fix pass) 2026-11-24 · **Owner feedback pass 2026-11-24** · **Consistency pass (creative director) 2026-11-24** · Status: slice spec*
*Canon order: owner comments C1–C5 (`design/reviews/user-comments-2026-11-24.md`) → **`design/reviews/owner-feedback-rulings.md` (OR-01…OR-21, binding; owner answers in its §5)**, as settled by `design/reviews/owner-feedback/consistency-pass.md` (rulings F1–F12) → `design/creative-brief.md` v1.6 → round-1 DR-xx and round-2 R1–R5 → final-assessment R-A…R-K. Where an older ruling cited below disagrees with an OR, the OR wins. The first draft is archived at `design/backlog/first-drafts/nemesis-system.md` and is the content backlog.*
*In-project and UI name: **Rivals**. "Nemesis" is an internal design term only (G12, §6.4).*

> **Patent rule (brief v1.5; legal note v2 §5):** nothing Mikan does to one cat, and nothing that cat becomes because of it, may change a *different* cat. A change may land on the cat Mikan dealt with, on territory and objects, on the calendar, or on a newly generated cat. Cats speak only from their own history. Every rule below is written to that rule, and §8 AC 27–29 test it. Not legal advice: counsel review still blocks scope lock and any public showing (§6.4).

---

## 1. Overview

Rivals is the system that makes every named cat in Hidamari Lane remember Mikan. It covers the **≤ 12 tracked cats** of the slice: the 8 Wall Sitters (Daifuku the Boss, 2 Captains and 5 Toughs, one of whom is **Togemaru, the First Thorn**), 2 Roamers, and the **newcomers and challengers** the calendar brings to town. Each cat has a **personality** (the six-value model the Crew uses), two hidden feelings about Mikan (**Grudge** and **Regard**, 0–100, never shown as numbers), a 10-entry **Memory** of what Mikan did, and a few fixed **relationships** with other cats (Gang, Rival, Kin, and, for a recruit, its Old Boss). Cats wear their history where a third-person camera can see it: **silhouette Scars**, a **Title**, a disposition pose and one sharp line of cat speech drawn only from their own history. Every cat in town sits on the **Rivals board**, a painted roster by district that shows a flat silhouette until the cat is **discovered** (met, or sniffed for one second in Whisker Sense); hovering one discovered cat tags the other discovered cats it relates to. After every won fight against a Rival the player gives one of **three Verdicts**: **Recruit** (for a Bribe), **Chase Off** (gone for good) or **Nose-Touch** (offered after a quiet take: a 10-day truce, after which the cat may fight beside Mikan against its own Rival). Every Verdict clears the post, and Mikan Claim Sprays it. The district Boss carries **anger**, raised only by Mikan's marking of his gang's posts and spent in the next real fight with him. Rivals has **no ladder**: roles are fixed at generation, nobody is promoted, and empty places wait for **newcomers**. Off-screen, the town changes through cheap **town events** and a fixed **challenger calendar**, never through what Mikan did to some other cat. **Nemesis** is one slot in Lives 1–2, held by the fixed arc lead Togemaru and declared in the Sniff as a **Sworn Enemy** or **Sworn Rival**; if the player Recruits or Chases him off, his arc closes with a card and the slot stays his as a record. **Every Verdict on him is a complete ending of his arc** (F11). The slice must prove one thing: *within two hours, a player can name a Rival and say what they did to it.*

## 2. Player Fantasy

> "That one, with the kinked tail and the cowlick that never dries. I let him off with a nose-touch, and three days later he came yowling over the laundry poles to help me flatten Goma."

The Rival is a **petty, funny, persistent neighbour**, not an orc warlord. Nobody dies; a fled or spared cat comes back and brings the evidence, and a cat Mikan chases off is gone for good. The player should feel six things inside the slice:

1. **It remembers me** (Life 1, day 2, before minute 60): Togemaru sits on his own gatepost at Laundry Pole Yard and names the fight he ran from.
2. **I marked it** (Lives 1–2): a Scar Mikan gave a cat is visible on the cat in play, not just on a card.
3. **The cat I spared fights beside me** (Life 2): a cat Mikan Nose-Touched yowls in from its old Patch to join a fight against its own Rival.
4. **It got one over on me** (even for players who never wipe): Lick In gives a cat a Title for flattening Mikan in a fight the Posse won. It is smug about it for the rest of the slice.
5. **The town moved while I slept** (Life 2): a newcomer on the wall, a stranger staking my post, two old rivals with fresh plasters. The Rivals board shows it, and the Sniff mentions it when it touches me.
6. **It chose me** (Life 2, by the L2D3 night at the latest): the Sniff's Declaration card names Togemaru as *my* Sworn Enemy or Sworn Rival, with the Scars I gave him. If I Recruited or Chased him off instead, his closing card says so, and the storm mark became a bell or a legend card.

Two Boss and Crew beats sit alongside: **the Boss is angry because of what I did to his walls** (steam puffs on the board, a hotter fight), and **my recruit flinches at the sight of its old boss** until I Tag-In to it.

**Cat identity, not Mordor with fur.** Mordor supplies only the skeleton: a roster screen, persistence and adaptation. The organs are cat: Verdicts instead of kills, a respect axis (Regard) as well as hate, the Verdict tell read from ears and tail, the Gloat, "Collar" as the insult that tracks Clout, scent marks as intel, and Mikan's plaster from home being read by the cat that gave it. The design test for every rule below is **"can the player see it?"**, and since v1.5 a second one: **"does it change only the cat Mikan dealt with?"**

---

## 3. Detailed Rules

### 3.1 The slice cast

| Role | Count | Authored or procedural | Notes |
|---|---|---|---|
| Boss: **Daifuku** | 1 | Authored (Narrative: personality and voice; Nemesis: trait kit and patrol) | Brooder Bruiser. **Never comes down off the walls** until the Boss window opens (OR-09); then he walks a three-stop patrol (§3.19). Carries **anger** (§3.19) |
| Captains | 2 | **Kagi** (Schemer Yowler, coverage cat, `recruitable_slice`) + one procedural, "the second Captain" | Never share a Style. Kagi ↔ the second Captain are **Rival**-tagged |
| Toughs | 5 | **Togemaru** (authored) + 4 procedural, two of them named for the showcase: **Goma** (Togemaru's **Rival**) and **Sasa** (Kinako's **Kin**) | **Unordered** (OR-19: no seats). "A Tough" in any rule means a seeded pick among Toughs |
| Roamers | 2 | Procedural | Off-wall. Ambush and raid candidates; **never fill a place** in the gang |
| Newcomers | 0–n | Generated in play (§3.20) | Fill an empty gang place or a keeperless Patch on a town-event night. Always join as **Toughs** |
| Challengers | ≤ 1 active per district | Generated in play (§3.20) | Come to take one of Mikan's Patches on a fixed calendar |
| Gone | any | (Chased-Off cats) | A legend card on the Rivals board. Not counted as tracked |
| **Tracked total** | **≤ 12** | | Active non-Crew cats. Fresh generation (newcomers and calendar challengers) only while tracked < 12 |

- **Rival-recruitable cats in the slice (DR-01):** Togemaru, Kagi, and Daifuku (Regard ≥ 50 only). Every other Rival shows Recruit greyed, with the tell "turns its tail to the bell". **Togemaru may be Recruited at any time, declared or not** (OR-15).
- **Personality coverage (DR-01, DR-30/37).** Crew §3.3 fixes the six slice recruitables: Hige (Stalwart, the old wall cat, an **ex–Wall Sitter** whose Memory holds `OLD_GANG(daifuku)` from the start), Pon (Goofball), Kinako (Fraidy, the Friend Stray, **Kin** of Sasa) are Crew's; **Togemaru** is **Braggart, Scrapper, Fear Cucumbers**; **Kagi** is Schemer, Yowler; **Daifuku** is Brooder (A-1).
- **Keepers of the slice's Patches (Territory §3.1):** Low Wall Corner = an **untracked Stray** (Routing it gives no Verdict) · Laundry Pole Yard = **Togemaru** · Persimmon Alley = a **seeded pick among the four procedural Toughs** · Tofu Shop Step = **Kagi** · Den = **Daifuku** (the Den post cannot be marked; OR-09).
- **Styles (slice):** Scrapper, Bruiser, Yowler. Togemaru resists Mikan's Claw (×0.8); Hige's Thump does ×1.2 against him.
- **Fears (slice):** Water (bucket), Loud Noise (scooter horn), Cucumbers (ledge junk). Every procedural Rival has exactly one, drawn from these. Togemaru's is Cucumbers. Props and Fears are taught on Life 2 day 2 (DR-22), so no Fear prop is used in Life 1.
- **The uphill sections** of the Rivals board show only authored silhouettes in haze (Madam Sabi, Oboro, Ikari, Botan; others as Narrative authors them). They are not tracked and not discoverable in the slice.

### 3.2 Data (the `rival` block of the One Cat Schema)

Nemesis writes `personality`, `former_rank`, `grudge`, `regard`, `memory[]`, `title`, `traits{strengths[], fears[], scars[]}`, `signature_strength` (set on Recruit), `rank` (**fixed at generation, never changed by any outcome**, OR-19), `keeper_of` (patch_id or null), and the v1.5 fields `relations[]`, `discovered`, `old_gang_nerves`, `anger` (Bosses only) and `truce_until_day`. Rivals-local state:

| Field | Values |
|---|---|
| `state` | `Seated` (with its gang, on the walls) · `Roaming` · `Truce` · `Friend` · `Challenging` · `Crew` · `Gone` (a legend card). *Deleted: `Away`, `Humbled`* |
| `origin` | `authored` · `prehistory` · `newcomer` · `challenger` · `turncoat` (Rivals board section, §3.13) |
| `relations[]` | `{kind ∈ rival \| kin, other_id, source ∈ authored \| prehistory \| challenger}`. Fixed once written; never changed by an outcome (§3.17). Gang membership is the cat's `clowder` |
| `discovered` | bool, plus `discovered_how ∈ {encounter, sniff, crew}` (§3.13) |
| `old_gang_nerves` | bool, Crew cats only, written at the join (§3.18). `OLD_GANG(boss_id)` itself lives only in the recruit's own `memory[]` |
| `anger` | 0–100, district Bosses only, until the Boss is Verdicted (§3.19) |
| `truce_until_day` | int or null (10 days after a Nose-Touch) |
| `challenge` | `{patch_id, arrived_night, repelled}` or null (§3.20) |
| `arc_role` | `none` · `lead` (Togemaru, fixed) · `closed` |
| `nemesis` | bool (slot holder), `face ∈ {sworn_enemy, sworn_rival}` |
| `encounters`, `routs_by_player` | small ints |
| `flee_threshold` | default by personality (§3.4); authored 25% for Togemaru |
| `last_opener`, `last_props_used`, `last_finisher_type`, `adapt_due` | adaptation inputs, all from the cat's own encounters (§3.9) |
| `plaster_until_day` | a feud-scuffle head plaster (2 days); on a Boss victor, the rematch plaster |
| `joined_day` | ≤ 1 join-in per cat per day (§3.17) |

*Deleted:* `seat`, `chased_count`, `snubs`. `personality`, `former_rank`, `relations`, `discovered`, `old_gang_nerves`, `anger` and `truce_until_day` are Nemesis-owned; Crew reads them and does not write them (NS-3, DR-12). `keeper_id` on the Patch is Territory's field, and Nemesis assigns it (NS-C11).

### 3.3 Generation and relationships

- **Starting feelings:** `grudge = 10 + rng(0..10)`, `regard = 10`. **Togemaru is fixed at Grudge 15, Regard 10**, so that his Life 1–2 beats are reproducible.
- **Level:** F9. **Strengths at generation:** Tough 0 (60%) or 1 (40%); Captain 1; Daifuku authored (3). Drawn from the slice list (§3.9).
- **Personality weights for procedural Wall Sitters, newcomers and challengers:** Braggart 12, Brooder 16, Schemer 16, Fraidy 16, Stalwart 16, Goofball 24. At prehistory only: ≥ 4 distinct personalities among the procedural cats; ≥ 1 Stalwart or Goofball; ≥ 1 Brooder or Braggart besides Togemaru (reroll the last offender).
- **Coat:** the logical genome is packed into `coat_seed`; Art owns the look. No generated coat feature may resemble a slice Scar (no notched or folded ears, kinked tails or cowlicks at generation), so every Scar reads as history. The Mikan look is never generated.
- **Relationships (OR-04).** Written at generation and never changed by an outcome:
  - **Gang:** every Wall Sitter (and every newcomer) has `clowder = wall_sitters`; Daifuku is its Boss.
  - **Rival** (NPC–NPC, both cats hold it): authored, or **one seeded pair per district at prehistory** among procedural cats when no authored pair exists; a calendar challenger carries one with p 0.5 (§3.20).
  - **Kin** (both cats hold it): authored, or seeded at prehistory with p 0.15 per same-district pair of procedural cats, ≤ 1 Kin per cat. Authored cats carry only their authored tags.
  - **Old Gang:** only in a recruit's own Memory (`OLD_GANG(boss_id)`, §3.18).
  - **Slice seeds** (Narrative confirms names and fiction): every Wall Sitter has Daifuku as **Boss**; **Rival** Togemaru ↔ Goma, Kagi ↔ the second Captain; **Kin** Kinako ↔ Sasa; **Old Gang** Hige → Daifuku (authored). Togemaru and Kagi gain `OLD_GANG(daifuku)` if recruited. The Lane has authored Rival pairs, so no procedural pair is seeded.
- **No prehistory animation.** Two prehistory nights (day indices −2 and −1) may run the seeding above; the Rivals board opens **static** the first time.
- **Determinism (NS-9, DR-13):** every draw comes from `rng(save_seed, day_index, step, subsystem, cat_id, ordinal)` (counter-based, SplitMix/PCG over a hash). Daytime rolls (join-in, Scar, bark pick, Ambush moment) use `(save_seed, encounter_serial, cat_id)`, so reloading reproduces them. Because each cat draws from its own substream, changing one cat's record never shifts another cat's draws (the sim relies on this, §4 sim note). Every Morning Sniff item logs `(seed, day, step)`.

### 3.4 Personality: the Rival column (canon shape DR-37; numbers owned here)

| Personality | `m_g` (Grudge gain) | `m_r` (Regard gain) | Nightly decay | Flees at Nerve | Nose-Touch gate shift (F4) | Old Gang Nerves as a recruit (§3.18) | Gloat → Glory Title | As a Rival, shown as |
|---|---|---|---|---|---|---|---|---|
| **Braggart** | 1.2 | 0.7 | −2 | never | **−5** | resists | Swat the Bell → Bell-Ringer | Loud taunts; bolts and comes straight back after a flee |
| **Brooder** | 1.1 | 0.8 | **−1** | never | **−5** | resists | Loaf On → Collar-Biter | Silent stare; long memory |
| **Schemer** | 1.0 | 0.9 | −2 | 15% | **0** | susceptible | Sly Circle → Collar-Biter | Ambush candidate weight ×2 |
| **Fraidy** | 0.7 | 1.0 | −2 | 25% | **+5** | susceptible (30 s) | Bolt → Collar-Biter | Flees early |
| **Stalwart** | 0.8 | 1.5 | −2 | never | **+15** | resists | Turn Away → Bell-Stopper | Honourable; Regard +10 on its win |
| **Goofball** | 0.6 | 1.2 | −2 | 10% | **+10** | susceptible | Swat the Bell → Bell-Ringer | Clowns about; easy to Nose-Touch |

Flee is Combat's normal interruptible yellow windup; Nemesis supplies only the threshold (NX-09, DR-41). **One exception (OR-14.5):** Togemaru's Life 1 day 1 flee at 25% **cannot be interrupted** ("faster than a kitten"), so the first Verdict is always day 2's, after his memory line. Gloats are animations only (≤ 3 s): none moves Scent or takes Morsels (OR-02; Mark Over and Snatch are cut). The same personality drives the cat's idle, walk, bark intents and Pile-On flourish if it is recruited. **The Braggart who taunted you on the wall is the Braggart who charges first in your Posse, and stares his old boss down rather than flinching.**

### 3.5 Grudge and Regard

Grudge and Regard move only through the event table below, combined per encounter by F1, and decay nightly by F2. **Every row is an event in which the cat itself took part.** No row reads what happened to another cat.

| Event (from `CatRouted`, `EncounterEnded`, `FearTriggered`) | Grudge base `g` | Regard base `r` |
|---|---|---|
| Routed by the Posse | +6 | 0 |
| …by Pile-On (extra) | +3 | 0 |
| …after its Fear was triggered this fight (extra) | +3 | −2 |
| Player opened with an Ambush on it | +3 | −3 |
| Clean win (player opened with a Standoff or was Ambushed, and triggered no Fear prop) | 0 | +8 |
| It was Keeper and the player marked its post this contest | +6 | 0 |
| It fled (normal flee) | +8 | 0 |
| Verdict: **Chase Off** | — (the cat is Gone) | — |
| Verdict: **Recruit** | rout items, then **halved** | +10 |
| Verdict: **Nose-Touch** | **set to 0** | +25 |
| `SLIPPED_AWAY` (Routed, but not the Verdict cat) | rout items only | rout items only |
| It won (Posse wipe; it is the victor) | +5 | −10 (Stalwart: +10) |
| **Lick In** (it Routed Mikan; the Posse won anyway) | 0 | 0 |
| It **joined in** beside Mikan and the Posse won (§3.17) | 0 | **+5 flat** |
| Player fled (Scram) | 0 | −8 |

- **Per-encounter cap (DR-39):** a cat's total Grudge change in one encounter is ≤ 35 for its first two encounters with the player and ≤ 20 after.
- Both meters are clamped to 0–100. *Deleted (OR-21): the Humble row, the Nose-Touch snub row, the Chase Off +10 row.*

### 3.6 The Nemesis slot (fixed lead); dispositions are poses

- **One slot in Lives 1–2, held only by the fixed arc lead, Togemaru** (OR-15, amending A-6 and R-B). The Lane slot opens in **Life 3** (Backlog). Every other cat at Grudge ≥ 75 is **Bitter**.
- **The Declaration (step 3, §3.12).** On the first night Togemaru has **≥ 3 encounters and ≥ 1 mark** (a truce greeting counts as an encounter, §3.7), or at the **deadline** (the night after Life 2 day 3), he is **declared**, at any Grudge, unless his arc has already closed. The next morning's Sniff opens with the **Declaration card** (portrait, storm mark, Scars, Title and his best memory line; `NemesisDeclared(cat_id, face)`). The face is re-read each night from his own meters: **Sworn Enemy** (Grudge ≥ Regard) or **Sworn Rival** (Regard > Grudge: a friendly challenger that still wants the rematch). A Nose-Touched Togemaru is normally declared a **Sworn Rival on night 3** (the L2D2 Sniff), after his first greeting (sim: 100% of Nose-Touch runs, none at the deadline).
- **All three Verdicts stay open on him**, declared or not (Recruit is no longer greyed; his Crew hook is "your first enemy, now your loudest friend").
- **His arc closes** when he is **Chased Off** (closing Sniff card "Run out of town"; a legend card with the storm mark) or **Recruited** (closing card "Wears the bell now"; the storm mark becomes a bell on his Crew card). Closing can happen before or after the Declaration. **The slot stays his as a record. No other cat is ever promoted, re-named or declared into the role in Lives 1–2.** *(Deleted: the old §3.7 (b) re-naming and "a new lead the same night": that made cat Y's role, placement and Grudge decay change because of a Verdict on cat X, the '908 B3 / '303 C4 shape.)*
- **Disposition on the Rivals board** (one pose per discovered cat; first match wins; numbers never shown, NX-14):

| # | Disposition | Condition | Pose (Art) |
|---|---|---|---|
| 1 | **Nemesis** | holds the slot (declared, arc open) | **Sworn Enemy:** faces the camera, back arched. **Sworn Rival:** faces the camera, tail up, chin out. Both wear the **storm mark** (small below Grudge 90 or as a Sworn Rival, large at Grudge 90+) |
| 2 | **Friend** | `state = Friend` | Slow blink |
| 3 | **Truce** | `state = Truce` | Sits side-on with a **truce sprig** |
| 4 | **Bitter** | Grudge ≥ 75, no slot | Faces, tail lashing |
| 5 | **Respectful** | Regard ≥ 50, Grudge < 50 | Sits upright facing, ears forward |
| 6 | **Wary** | Grudge 40–74 | Side-on, ears flat |
| 7 | **Indifferent** | otherwise | Back turned, grooming |

A challenger shows a **staking stamp**; a Boss shows **anger puffs** (§3.19); a feud-scuffle loser wears a head plaster for 2 days; a Wavering posted recruit is turned away (Crew, OR-11). Gone cats are legend cards (§3.13).

### 3.7 Memory and the arc lead

- **Memory:** 10 entries, **≤ 6 pinned** (NS-4). An entry is `{day, kind, patch, opener, finisher_move, damage_type, fear, verdict, by_pile_on, count, other_id?}`. Kinds in the slice: `FIRST_MEETING, ROUTED, FLED, PATCH_LOST, VERDICT, AMBUSHED_BY_PLAYER, AMBUSHED_PLAYER, LICK_IN, WON, PLAYER_FLED, SCAR, TITLE, SLIPPED_AWAY, RAID, JOINED_IN, OLD_GANG`. `other_id` is set only on `OLD_GANG` (the recruit's own old boss). A repeat of the same kind and patch on consecutive encounters collapses into one entry with `count` +1. Every entry records an event the cat itself took part in.
- **Pinned:** `FIRST_MEETING`, `OLD_GANG`, the latest encounter, and the source entry of each displayed Scar and the displayed Title. ≤ 2 Scars come from Mikan in the slice and there is 1 Title, so pins ≤ 6 (the invariant). Eviction removes the oldest unpinned entry.
- **The arc lead is Togemaru, the First Thorn, for all of Lives 1–2** (OR-15). His Grudge **does not decay while his arc is open** (DR-39).
- **Arc achieved** (`NemesisArcAchieved`; DR-39 as amended by OR-15.4 and the consistency pass, F11) = Togemaru has **cited his memory** (≥ 2 encounters; his uninterruptible day-1 flee guarantees the day-2 line), carries **≥ 1 mark** (his first Rout by the Posse always leaves a Scar, §3.8; a wipe gives him his Title instead), and has reached **an ending: any Verdict on him, or the Declaration**. Each Verdict is a whole ending, not a cut-short arc:
  - **Chase Off:** he is gone, with his farewell line (`VERDICT_CHASE`: "Fine! I've got other walls. Better walls!"), the "Run out of town" closing card and his legend card.
  - **Recruit:** he joins ("Wears the bell now"; the storm mark becomes a bell), and his story goes on in the Posse: he stares his old boss down in the Daifuku fight.
  - **Nose-Touch:** a truce that his daily greeting and any join-in carry; normally declared a Sworn Rival; the rematch comes when the truce ends.
  Sim: arc achieved **100% for every policy** (the OR-pass definition, ≥ 3 encounters, gave 0 / 0 / 5 / 15 / 41%). The routes differ in depth, not in completeness: mean encounters with him by slice end are chase 2.0 · recruit 2.0 · mixed 3.8 · pacifist 7.0 · lose40 3.0 (§4). *(Supersedes A-10 and the "2 encounters, unachieved" price; the owner's final Chase Off is kept.)*
- **Presence guarantee (OR-15.5):** from Life 2 day 1, Togemaru turns up on Mikan's route **at least once a day until his arc closes**. Placements: Keeper of the Patch she is heading for, waiting at a Scent Post, a Rival Ambush (§3.10), the raid leader (counts only if he leads it), or, under a truce or as a Friend, a **non-hostile greeting** (`TRUCE_GREET`) or a **join-in**. **A greeting is a Standoff-group meeting and counts as an encounter** (F11): ≤ 1 counted meeting a day, so a join-in on a day he greeted adds no second. Placement is a spawn rule, never a scripted outcome (DR-41). For players whose arc closed early, Life 2's antagonist pressure comes from **Daifuku** (his anger, then his window) and the **challenger** (sim: 63–100% of Life 2 days have one of them on the street, §4 sim note).

### 3.8 Making memory visible (NX-01, NX-02, NX-03, NX-04, NX-15; DR-40)

1. **Togemaru returns inside Life 1** (DR-40.1, PP-05). On day 1 his Standoff comes **after** the Low Wall Corner claim, and his flee at 25% cannot be interrupted (§3.4). On day 2 the Morning Sniff's only item is his fresh scent mark over **his own post, the Laundry Pole Yard gatepost**; he is placed within 30 s of the door, on the route out, and his Standoff line is `REMATCH_I_FLED`: "I ran yesterday. Not off my own post, Collar." (memory-citing; unskippable for 1 s). Day 2 is the contest for that post. *(Deleted: the day-1 Verdict branches, OR-21.14.)* If the player wipes on day 2, the contest moves to Life 2 day 1 and his Standoff there is `REMATCH_I_WON` (`mikan_plastered`).
2. **Memory at the Rout after an Ambush.** If the player Ambushes a tracked Rival, the fight opens with a corner tag (name and Title only). At the Rout, the cat's best line (`AMBUSHED_REMATCH` if it has Memory of Mikan, `STANDOFF_FIRST` if not) plays over the flattened cat at the start of the Verdict prompt, while the clock is paused.
3. **Unskippable 1 s.** Any Standoff or Rout line whose selected template has `n_mem` ≥ 1 cannot be skipped for 1.0 s. Other lines skip instantly.
4. **Silhouette Scars (DR-40.4).** Four types, chosen by the `CatRouted` payload. A triggered Water Fear overrides the damage type.

| Cause | Silhouette Scar |
|---|---|
| Finisher damage type Claw | Ear notch |
| Thump | Kinked tail-tip |
| Yowl | Folded ear |
| Routed after its Water Fear this fight | Damp cowlick |

Scar chance is F7. **Togemaru's first Rout by the Posse always leaves a Scar** (authored, like his fixed starting Grudge; F11), so every player who Routs him has marked him. Every player-sourced Scar is a silhouette Scar; a cat displays ≤ 2 from Mikan in the slice. Off-screen feud scuffles give a **head plaster for 2 days**, never a Scar, so a Scar always means "Mikan did this".

5. **Lick In (DR-40.5).** A tracked Rival that Routs Mikan in an encounter the Posse wins earns its personality's Glory Title (no promotion, no levels). Its next Standoff draws `REMATCH_I_WON` with tag `lick_in`; its Verdict tell is **chin up**.
6. **The plaster (DR-40.6, OR-02).** After a wipe, Mikan wears Haru's plaster the next day. **Only the victor** may read it: tag `mikan_plastered` requires the speaker's own `WON` entry from the wipe. "Nice plaster, Collar. Fall off a cushion?" No other cat's line cites the loss.
7. **Routine tags (DR-40.7):** `evenings_home` and `nights_out` read Mikan's visible routine, not another cat. "Home by dusk, every day. We noticed." / "Bowl empty at home, Collar?"
8. **A personal 2-bar yowl-sting per Rival** (Audio), seeded by `(voice_body, personality, cat_id)`. It plays at the name-card and at a Rival Ambush.

### 3.9 Strengths and adaptation (slice)

Slice Strengths (Nemesis chooses them, Combat values them): **Thick Fur** (resists Claw), **Low Loaf** (resists Thump), **Deaf Ear** (resists Yowl), **Wriggler** (shorter Frazzled), **Roof-Wise** (not Ruffled by an Ambush), **Got Over It (fear)** (that Fear no longer Ruffles it), **Grudge Fuel** (hits Mikan harder), **Second Wind** (one Nerve slice on its first Frazzle), **Home Turf** (stronger on its own Patch).

- **When (OR-14.4):** a cat adapts **the night after an encounter in which it fled, or was Routed but not Verdicted (it slipped away)**, from Life 2 on. It never runs mid-fight, on a Verdict night, or for any reason involving another cat. *(Deleted: the comeback and promotion triggers.)*
- **What (one per evaluation, first that applies), answering the player's habits against this cat (NX-08):**
  1. The last opener was the player's Ambush → Roof-Wise.
  2. A Fear prop was used on it → Got Over It (that Fear).
  3. It was Routed twice by the same finisher type → resist that type.
  4. Pile-On'd twice → Wriggler.
  5. Otherwise, the personality pool: Braggart/Brooder Grudge Fuel; Schemer Roof-Wise; Stalwart/Goofball Second Wind; Fraidy Wriggler.
- **Always a Way In (invariant):** every Rival keeps ≥ 1 Fear that has not been overcome, **or** ≥ 2 of the 3 slice damage types unresisted. An adaptation that would break this is skipped and the next is tried.
- **Announced:** the cat's next encounter line must come from `RETURNED` with tag `adapted:<strength>`, and the Rivals board shows the new Strength icon at once. "Go on, tip the bucket. I like the rain now."
- Cap: 3 Strengths on a Tough or Captain in the slice. On Recruit, the most recently revealed Strength becomes the `signature_strength`. Strays have none (DR-37). Sim: ≈ 0.9 adaptations per slice (§4).

### 3.10 Encounters, the Ambush, and loss

- **Standoff** (2–4 s): name-card, Title, silhouette, sting and one line (F8). A Boss's name-card shows his anger puffs.
- **Rival Ambush (NX-17, NS-12, DR-36):** unlocks on Life 2, day 1. **≤ 1 per day.** Candidate: the highest-F3 active cat with Grudge ≥ 50 that is not in `Truce`, `Friend`, `Crew` or `Challenging` (Schemers ×2). On a day with a candidate the director rolls `p_ambush_day` (0.5) and places it at a seeded moment ≥ 60 s into a seeded phase. Never on the morning after a wipe, never in Life 1. Warning: a **2.0 s directional yowl-sting**; **Skitter or Brace in the final 0.75 s** gives a neutral start (`AMBUSH_FOILED` icon bark); otherwise Mikan starts Ruffled.
- **Fight barks are icon-only** (Fear hit, low Nerve, Routed, ally Routed, Old Score), no text (NX-12).
- **Routed tracked Rivals in a won fight** are held at the ring edge for the Verdict (DR-36, NX-C8).
- **Every encounter discovers** each tracked participant not yet discovered, including a joiner (§3.13).
- **Loss (Posse wipe; OR-01, OR-02).** The victor is the cat that Routed Mikan if it is standing, otherwise the highest-ranked standing tracked Rival. **Only the victor changes:**
  - it **Gloats** (≤ 3 s, inside UX's ≤ 6 s loss beat), gains a `WON` Memory entry, and its Glory Title if it has none;
  - Grudge +5, Regard −10 (Stalwart +10), through F1;
  - a **Boss** victor is **plastered at −10% max Nerve for the rematch** (stacks to −30%) and its **anger is spent** (§3.19);
  - **no promotion, no level gain, no seat change, no demotion, feud or swap for any other cat** (G1). *Deleted (OR-21.4): loss promotion and seat swaps, "drops to seat 1 with a feud", victor level +1, Mark Over, Snatch and `loot_held`.*
  - The day then ends: the clock jumps to Night and the street closes (Day Loop §3.6 owns it). A Rival whose turn it was to appear later that day simply does not.
- An **untracked** cat that wins a wipe Gloats generically and is not tracked; nothing else changes.
- **Scram** (`player_fled`) and a Rival fleeing are not losses. Scram does not spend a Boss's anger.

### 3.11 The three Verdicts (OR-12, OR-13, OR-14; DR-42, PP-14, PP-21)

**One full Verdict per fight**, for the highest-ranked Routed tracked Rival. Other Routed tracked cats get `SLIPPED_AWAY` and run (PP-14). The clock is paused, with no timer and no default. **All three Verdicts clear the post:** the Keeper leaves, and **Claim Spray** is offered at once (yours at 70, Territory). **Nothing else in the district changes:** no cat moves up, in or over (G3, G6).

| Verdict (compass card) | Available | The cat | Grudge / Regard | Later |
|---|---|---|---|---|
| **Recruit** (Right) | Grudge < 90 **or** Regard ≥ 50 (DR-09); slice-recruitable (§3.1); room, or "make room" (DR-34). Daifuku: Regard ≥ 50. **Togemaru may be Recruited, declared or not** | Joins the Crew with Memory, Scars, Title, Fear and personality; its Strength becomes its perk; its Memory gains `OLD_GANG(boss_id)` and `old_gang_nerves` is set (§3.18) | rout items, then halved / +10 | Costs a **Bribe** (Crew; free in Life 1, PP-07) and a slot. Starting Loyalty reads `G_pre` (NS-C2). May betray if neglected on a post from Life 2 (OR-11, §3.12) |
| **Chase Off** (Left) | Always | **Gone for good** (OR-14): it leaves Yunagi and keeps a legend card on the Rivals board | — | **Never returns.** Its empty gang place waits for a newcomer on the town-event calendar (§3.20); nothing is inherited from it |
| **Nose-Touch** (Up) | **Deterministic gate (F4):** pending Grudge < 50 + personality shift, **and, from Life 2, a quiet take** (F12): not after **≥ 2 Counter-Sprays on its own post** this contest, and, for a Boss, not if he came to the fight **Seething or Furious**. Otherwise the card is halftoned with the reason: "Tail lashing. Not today." (Grudge) · "Too much of your stink on its post." (loud take) · "Still steaming. Not today." (a Boss's anger) | **Steps down peacefully** into a **10-day truce** (`Truce`, a truce sprig): it leaves its post and roams its district, non-hostile | set to 0 / +25 | During the truce, and as a Friend after it, it **may join Mikan's fights against its own Rival** (F11). At truce end: Regard ≥ 75 → **Friend** for good; otherwise it becomes a **challenger** for its old Patch (§3.20) |

**The compass has no Down card.** The three cards fan Left, Up and Right. **Tells** (shown before choosing; honest): the **tail** lashes when the Nose-Touch gate is closed; **eyes and lean** show the Bribe band (Crew); **Mikan turns away** previews Chase Off; **chin up** means Lick In.

`VerdictApplied.verdict` ∈ {`chase`, `recruit`, `nose`} (OR-20).

**Why none dominates (OR-12):**
- **Recruit** is the only option that adds a fighter, and the only one that costs Morsels and a slot.
- **Chase Off** is free and final: the cat is lost as a future ally, recruit or story, and a stranger eventually fills the gap.
- **Nose-Touch** is free but **earned** (a quiet take and a low Grudge: loud Counter-Spraying, the fast way to take a post, closes it) and **deferred** (a possible rematch after 10 days, as a challenger).

Sim (mixed policy, availability-weighted): chase 55% / recruit 8% / nose 37% (was 49 / 7 / 43 before F12); the gate is open on 100% of Life 1 Verdicts and **82% of Life 2 Verdicts** (Daifuku 81%), closed by a loud take on 15% of all slice Verdicts (was 91–100% open; §4). Playtest acceptance is AC 4.

**Crew reactions (G10):** no *new* Crew reaction is keyed to a Verdict on another cat. The Stalwart's Humble dislike is gone with Humble; its new dislike is a Scuffed or Lost night on its own post (Crew). The Schemer's existing "dislikes Nose-Touch Verdicts" is a **'303 watch item**, held for counsel, not redesigned (§6.4).

**Daifuku's Verdict** (end of the slice): any of the three, then Mikan Claim Sprays the Den post (OR-09). Chase Off: Gone. Nose-Touch (open only if he came to the fight Calm or Riled, F12; a loss spends his anger, so a rematch usually meets him Calm): he steps down into a truce and roams the Lane's walls. Recruit needs Regard ≥ 50. **The gang is re-tasked by nobody** (G6): no gang cat is promoted or moves to the Den, and the raid fallback stays the gang's (`gang_orders`). A future new Boss is a newly generated cat (Backlog: Usurper).

### 3.12 Off-screen: Night Shuffle step 3 (OR-20 canon order)

Step 3 runs after Crew (step 1) and Territory (step 2: decay and refresh, challenger over-mark, upkeep, tonight's raid or challenge, influence and the Boss window). **Every sub-step reads only the calendar, territory state, the RNG, or the record of the one cat it changes.** It never reads what Mikan did to a different cat (§6.4 lists the residual enemy-selection items for counsel).

| Sub-step | Rule |
|---|---|
| **3a Betrayals** (OR-11) | Live **from Life 2**. Eligible: an **ex-Rival recruit posted as a Sentry** at Shifty Loyalty (< 30; Schemer < 35) at step 1 (Crew owns Loyalty, thresholds and the Wavering warning). If it is still eligible on the **third** night of Wavering, `BetrayalTriggered(crew_id, patch_id)`: it leaves the Crew and becomes the **Keeper of the Patch it guarded** at rival Scent 40 (`origin = turncoat`, Outsiders section). Never Low Wall Corner or the Den. Story recruits and the Friend Stray never betray. Changes only the defecting cat |
| **3b Town event** (F6) | One per district every 2–3 nights, from the night after Life 2 day 1. Kinds: **newcomer** (an empty gang place or a keeperless Patch gets a freshly generated cat, §3.20) or **feud scuffle** (a Rival-tagged pair scuffles; a seeded coin picks the loser, who wears a head plaster for 2 days; no role change). The kind is **never weighted by Mikan's history**. Emits `TownEvent(kind, cat_ids, patch_id?)` (replaces `RivalRankChanged` / `WallEvent`). *Deleted: promotion, return, refill-by-Roamer, Restless* |
| **3c Challenger calendar and truce expiry** (F12, §3.20) | A cat whose truce ends tonight becomes a `Friend` (Regard ≥ 75) or waits to challenge (otherwise). On a due calendar night with no active challenger in the district, a challenger arrives: a waiting truce-end cat first, else a freshly generated one. `ChallengerArrived(cat_id, district_id, patch_id, origin)` |
| **3d Adaptation** (§3.9) | For each cat with `adapt_due` (it fled or slipped away today) |
| **3e Decay** | F2 for every non-Crew tracked cat; anger −15 for each un-Verdicted Boss (F10) |
| **3f The Declaration** (§3.6) | If Togemaru's arc is open and he has ≥ 3 encounters + ≥ 1 mark, or it is the deadline night, declare him |
| **3g Raid requests** | **One raid or challenge every night from night 3, ≤ 1 per district.** **Priority: `challenge` > the arc lead > others.** **Timing:** the first is Togemaru's, requested on night 3 if he is hostile (Seated or Roaming), forecast in the Life 2 day 2 Sniff and fired that Night (the cat flap's first Night, DR-13); otherwise the normal rule applies. A challenger takes the slot from the night it arrives (fires the next Night) until it is gone or becomes a Keeper. **Target:** the challenger's staked Patch; otherwise the **lowest-Scent admissible held Patch** (Territory declines inadmissible ones). **Requester:** the highest-F3 cat that is Seated or Roaming, non-Boss, with **Grudge ≥ 40**; if none, the **district's gang sends a seeded Tough under `gang_orders`** (renamed from `boss_orders`; it works the same whether the Boss is present, Gone, in truce or Crew, G6). **Motive and party** (Territory §3.7 is the only list; escorts are untracked Strays): `grudge` (leader + 1 escort; the default), `gloat` (leader alone; a cat whose own Memory holds `WON` or `LICK_IN`), `challenge` (leader + 1 Stray; `motive_mod` 1.10; replaces `pretender`), `gang_orders` (leader + 2 escorts; the fallback, or any Captain-led raid). *Deleted: `uprising`, `pretender`, `boss_orders`* |

**Stewing is cut entirely** (OR-19): it raised one cat's Grudge because of how Mikan had treated other cats. The challenger calendar and the gang fallback supply its pressure. *Deleted with it:* the generated Roamer feuding with Mikan's Friend and its line "Buri went soft. I didn't."

### 3.13 Morning Sniff, discovery and the Rivals board (OR-03; NX-07, DR-43)

- **Sniff:** the Tribute line, tonight's raid or challenge forecast (always, when one is coming), and **≤ 3 nemesis items**. Life 1 day 2 has exactly 1 item. **Admission:** the cat has ≥ 1 encounter with the player, **or** the item touches a player Patch or Crew cat, **or** it is a district card (Boss window, Boss anger). **Card types (v1.5):** the Declaration; an **arc-closing card** ("Run out of town" / "Wears the bell now"); **"A stranger's scent"** (challenger arrival: silhouette until discovered, the target's landmark, a tape star); the **Boss window** ("The big wall's come down."); **Boss anger** at Seething or Furious ("The big wall is seething."); **Wavering** (Crew); a town event; a truce ending. **Priority (one order, shared with `hud.md` §5.3; consistency pass):** Wavering (always admitted; it is the one warning that cannot be undone) > Declaration > arc-closing > challenger arrival > Boss window > anger > arc lead > town event > other. Town events among strangers appear on the board only.
- **Discovered (OR-03).** A cat is discovered at the first of: (a) **any encounter** with it (a Standoff, a fight, a Rival Ambush, or a join-in); (b) a **Whisker Sense sniff**: holding Whisker Sense with the cat on screen within **10 m** for **1.0 s**, which plays a brief scent-outline confirmation; (c) it is **Crew** (always discovered). Discovery emits `CatDiscovered(cat_id, how)`. It is a player-knowledge flag: it changes nothing about the cat. **Life 1 day 2 prompt:** while Mikan stands at the Laundry Pole Yard gatepost, Daifuku's wall top is within range and the Whisker Sense read points at him once (Narrative/UX stage it; skippable). Sim: Daifuku discovered by the slice's end in 97–100% of runs.
- **An undiscovered cat** shows a flat silhouette, its section, and a crown outline if it is a Boss: no name, tags, pose or traits. Forecast and challenger cards show undiscovered cats as the same silhouette.
- **The Rivals board** (data here; screen by UX `key-screens.md` §2; replaces the Fence Line). Every cat in the game state, in sections from left to right, climbing the town:
  1. **District sections** (the Lane, the Arcade, Shiosai, the Summit). Each district's **Boss** sits on the section's gatepost (a role mark, not a height), and its gang is in **one row in order of discovery**, then its undiscovered silhouettes. In the slice the Lane holds its tracked cats; the other sections show their authored silhouettes in haze.
  2. **Outsiders** (a gate after the districts): cats with `origin` ∈ {newcomer, challenger, turncoat}.
  3. **The Bell fence** (far right): Mikan and every Crew cat.
  4. **Legends:** Gone cats stay in place as a faded card with paw prints leading off the edge.
- **A discovered cat shows:** its disposition pose (§3.6), name, Title, silhouette Scars, the storm mark (Nemesis), a truce sprig, anger puffs (Bosses), known Fear and Strength icons (a Fear is revealed when sniffed or triggered), and a "new since last night" tape star. **No rank ladder, no height = rank, no numbers.**
- **Hover tags** (§3.17): hovering (mouse) or focusing (pad) a discovered cat shows a small tag on every other **discovered** cat it relates to, worded from the hovered cat's point of view. Display only.
- **Access:** read-only; View / J on the street, at the Doorstep and at the Lot; never inside the house; unlocks on Life 2 day 1. Its **"Last night" replay** shows the night's town events, challenger arrival and truce endings (no ladder hops).

### 3.14 Unlock ladder (DR-23, NX-06, as amended)

| When | Switches on |
|---|---|
| Life 1 | Standoff, the three Verdicts, Togemaru, 1-item Sniff (day 2), Lick In, Gloat, discovery (Whisker Sense is taught on day 1), Boss anger accrues (shown from Life 2 day 1) |
| Life 2, day 1 | Rivals board (static first view), Rival Ambush, 3-item Sniff, town events (from that night), join-ins, adaptation, betrayal eligibility (Crew), **the quiet-take clause of the Nose-Touch gate** (F4, F12) |
| Cat flap (Life 2, day 2) | Night Rivals; the first raid (Togemaru's, if he is hostile), forecast that morning |
| Night h + 2 (h = the first night Mikan holds ≥ 3 Patches; normally night 5) | Challengers (announced in the Life 2 day 4 Sniff on the reference path) |
| Influence 100 (Territory) | The Boss window: Daifuku's patrol (§3.19). Reference path: the Tofu Shop Step Claim Spray on **L2D3** (F7 ruling) |
| Togemaru's arc conditions, or the night after Life 2 day 3 at the latest | The Declaration, unless his arc has closed (§3.6) |
| Life 3+ | The Lane slot; Captain-tier challengers; the rest (Backlog) |

### 3.15 Barks: triggers, tags, grammar, volume (NX-12, NS-11, DR-44, DR-53; G8)

Cats speak readable text in balloons of **≤ 60 characters after slot substitution**. Nemesis owns triggers, tags, slots and selection; Narrative owns every word. The lines below are placeholders that prove the grammar.

**The own-history rule (G8, OR-19).** Every line is selected from the **speaker's own** Memory, its own relationship tags, its own state, and Mikan's visible routine (`evenings_home`, `nights_out`). **No line cites what Mikan did to another cat.** The lint enforces it (AC 24): memory-family tags are always `self.`-scoped; `{other}` binds only to a cat named in the speaker's own `relations[]` or its own `OLD_GANG` entry; `mikan_plastered` requires the speaker's own `WON` entry from the wipe. *Deleted:* "Buri went soft. I didn't.", gossip-borne Titles, non-victor plaster lines, any boss-voiced line aimed at a defector (OR-06).

**24 slice triggers:**

| Group | Triggers |
|---|---|
| Standoff (6) | `STANDOFF_FIRST`, `REMATCH_I_LOST`, `REMATCH_I_WON` (it beat Mikan: wipe or `lick_in`), `REMATCH_I_FLED`, `RETURNED` (back after fleeing or slipping away; carries `adapted:*`), `TRUCE_GREET` (a truce cat or Friend, non-hostile) |
| After (8) | `GLOAT_SWAT`, `GLOAT_LOAF`, `GLOAT_CIRCLE`, `GLOAT_TURN_AWAY`, `GLOAT_BOLT`, `VERDICT_CHASE`, `VERDICT_RECRUIT`, `VERDICT_NOSE` |
| Special (10) | `AMBUSHED_REMATCH`, `CALL_HEARD`, `CREW_MEMORY`, `ALLY_JOIN` (the joiner's arrival yowl), `OLD_GANG_FLINCH` and `OLD_GANG_DEFIANT` (the recruit's own reaction, §3.18), `STEELED` (the recruit after the Tag-In), `KIN_SPARE` (a Crew cat's AI refusing its Kin, Combat), `CHALLENGE_STAKE` (a challenger at its post), `BOSS_POSTS` (Daifuku about his own posts, by anger stage) |

**Grammar (EBNF; a lint tool enforces it):**

```
template   = id trigger requires forbids personality text short_text ;
requires   = "[" [ tag { "," tag } ] "]" ;          (* forbids: same form *)
tag        = [ scope ] name [ op value ] ;
scope      = "self." | "other." ;                    (* default self.; memory-family tags may only be self. *)
op         = ":" | ">=" | "<=" ;
personality= "braggart"|"brooder"|"schemer"|"fraidy"|"stalwart"|"goofball"|"any" ;
```

| Family (weight) | Tag names |
|---|---|
| Memory (3; self only) | `last_verdict:<recruit\|nose>`, `last_finisher_type:<claw\|thump\|yowl>`, `by_pile_on`, `fear_exploited:<water\|loud_noise\|cucumbers>`, `ambushed`, `lick_in`, `scar_from_mikan:<notch\|kink\|fold\|cowlick>`, `patch_lost`, `fled`, `count_routs>=<n>`, `adapted:<strength>`, `mikan_plastered` (victor only), `joined_in`, `old_gang` |
| Relationship (2) | `nemesis`, `sworn_rival`, `bitter`, `friend`, `truce`, `grudge>=<n>`, `regard>=<n>`, `rival_of` (binds `{other}` to its own Rival), `kin_of` (binds `{other}` to its own Kin), `old_boss` (binds `{other}` to its own `OLD_GANG` boss), `ex_crew` |
| Context (1) | `phase:<p>`, `own_patch`, `rank:<r>`, `clout:<rank>`, `life:<1\|2>`, `evenings_home`, `nights_out`, `posse_size>=<n>`, `anger:<stage>` (Bosses, own) |

**Slot binding.** `{other}` binds per the rule above. `{when}` cites the Memory entry matched by the highest-weight memory tag (ties: the most recent), bucketed as "last night", "the other day", "ages ago". `{patch}` is that entry's patch. Slots: `{address}` 8, `{mikan}` 8, `{other}` 8, `{patch}` 16, `{title}` 16, `{when}` 14. Overflow uses `short_text`; if that also overflows, the template is dropped and logged as a content bug.

**Address.** House Pet / Lane Cat → "Collar"; Known Face → "Bell"; Boss → `{mikan}`. A cat with Regard ≥ 50 uses `{mikan}` from Known Face. Crew say "Boss".

**Selection** is F8. **No repeats:** a cat never repeats a line to the player while an unused candidate exists. **`STANDOFF_FIRST` lines are retired town-wide for 20 in-game days after use** (DR-44). **Content rules:** no human is ever named or explained; Lives 1–2 lines may cite the collar, bell, bowl, cushion, plaster and the Call, never a human (NX-C5, DR-44).

**Bark intents (DR-53):** each template maps to one of 8 intents per voice body: *Taunt, Boast, Threat, Grumble, Yield, Panic, Respect, Tease*. Standoff → Taunt/Threat (Bitter, Nemesis) or Respect (Respectful, Friend). Gloat → Boast. `VERDICT_CHASE` → Grumble. `VERDICT_NOSE`, `TRUCE_GREET` → Yield/Respect. `ALLY_JOIN`, `STEELED` → Respect. `OLD_GANG_FLINCH` → Panic; `OLD_GANG_DEFIANT` → Threat. Icon fight barks → Panic. Goofball lines default to Tease.

**Volume (≤ 240, DR-01):** `STANDOFF_FIRST` 6 × 3 = **18**. Seven floor triggers (`REMATCH_I_LOST`, `REMATCH_I_WON`, `REMATCH_I_FLED`, `RETURNED`, `TRUCE_GREET`, `VERDICT_CHASE`, `VERDICT_NOSE`) at 6 personalities × 2 = **84**. The other 16 triggers: Gloats 5 × 3 = 15, `VERDICT_RECRUIT` 6, `AMBUSHED_REMATCH` 6, `CALL_HEARD` 6, `CREW_MEMORY` 6, `ALLY_JOIN` 6, `OLD_GANG_FLINCH` 3, `OLD_GANG_DEFIANT` 3, `STEELED` 3, `KIN_SPARE` 3, `CHALLENGE_STAKE` 6, `BOSS_POSTS` 4 = **67**. Memory-tagged specials: **68**. **Total 237.**

**Example lines** (placeholders, all ≤ 60 characters at maximum slot length; Verdict-prompt lines first, per NX-16):

| Trigger | Requires | Pers. | Line |
|---|---|---|---|
| `VERDICT_CHASE` | — | Braggart | Fine! I've got other walls. Better walls! |
| `VERDICT_RECRUIT` | `fear_exploited:water` | Braggart | Fine. But you're never touching that bucket again. |
| `VERDICT_NOSE` | — | Stalwart | ...Fair. You fought fair. |
| `VERDICT_NOSE` | `own_patch` | Braggart | Keep the post. I'll be back for it. Ten days. |
| `STANDOFF_FIRST` | `clout:house_pet` | Braggart | Nice bell, Collar. Does it ring when you run? |
| `REMATCH_I_FLED` | `fled`, `own_patch` | Braggart | I ran yesterday. Not off my own post, Collar. |
| `REMATCH_I_LOST` | `fear_exploited:water`, `scar_from_mikan:cowlick` | Braggart | I still smell like that bucket. Soon, so will you. |
| `REMATCH_I_WON` | `lick_in` | any | Flat on your back, Collar. Your crew carried you. |
| `REMATCH_I_WON` | `mikan_plastered` | any | Nice plaster, Collar. Fall off a cushion? |
| `RETURNED` | `adapted:got_over_it_water` | any | Go on, tip the bucket. I like the rain now. |
| `TRUCE_GREET` | `truce` | Braggart | Don't get used to the nose thing, Collar. |
| `ALLY_JOIN` | `rival_of` | any | {other}! I've waited for this one. |
| `OLD_GANG_FLINCH` | `old_boss` | Schemer | ...That's {other}'s wall. |
| `OLD_GANG_DEFIANT` | `old_boss` | Stalwart | Not your cat anymore. |
| `STEELED` | `old_gang` | any | Right. Right. I'm with the bell. |
| `CHALLENGE_STAKE` | — | any | This post's mine now, Collar. |
| `BOSS_POSTS` | `anger:seething` | Brooder | My posts reek of you. Every one. |
| `AMBUSHED_REMATCH` | `ambushed` | any | The roof again? You never fight on the ground, Collar. |
| `GLOAT_TURN_AWAY` | — | Stalwart | Good scrap. Come back when the bell means something. |
| (tag) | `evenings_home` | any | Home by dusk, every day. We noticed. |

### 3.16 Worked Rival life-story: Togemaru through all three Verdicts (fits inside the slice)

**Togemaru**, the First Thorn: Wall Sitter Tough, **Keeper of Laundry Pole Yard**, **Scrapper, Braggart** (`m_g` 1.2, `m_r` 0.7, gate shift −5 → gate 45), Fear Cucumbers, Lv 2, Grudge 15, Regard 10 (fixed), Rival of Goma. No Fear prop in Life 1. The player's marking style is "typical" (2 Over-marks and a Counter-Spray per contest). Times are approximate.

| When | What the player sees | Rules at work | After |
|---|---|---|---|
| L1 D1 ≈ 0:20 | After the Low Wall Corner claim, Togemaru struts down from the laundry poles. "Nice bell, Collar. Does it ring when you run?" At 25% Nerve he bolts; the flee **cannot be interrupted** on day 1 | OR-14.5. F1: fled 8 × 1.2 = 9.6 → 10. Discovered (encounter). Low Wall Corner is Stray-held, so no anger | G 25, R 10. Memory FIRST_MEETING, FLED. Enc 1 |
| L1 D2 ≈ 0:28–0:33 | Sniff, 1 item: his fresh mark over the gatepost. He sits on it: "I ran yesterday. Not off my own post, Collar." (unskippable 1 s). **First memory line.** Mikan Over-marks both Rub Marks and Counter-Sprays the gatepost; at Scent 30 he comes down; a two-cat Pile-On Routs him. The Whisker Sense read points uphill: Mikan sniffs **Daifuku** on his wall | Daifuku's anger +5 +5 +15 = **25 (Calm)** (F10). F1 pending: (Rout 6 + Pile-On 3 + Keeper's post marked 6) × 1.2 = 18 → **G_p 43**; R_p 10 + round(0.7 × 8) = 16. **F4 gate 45: open** (tail still; the quiet-take clause starts in Life 2). His first Rout always scars (§3.8); Claw → **ear notch**. Daifuku discovered (sniff) | Enc 2, 1 Scar. The Verdict |
| L1 D2, Verdict **A: Nose-Touch** | He touches noses, hops off the gatepost and saunters up the lane with a truce sprig. Claim Spray: the gatepost is Mikan's at 70. "Keep the post. I'll be back for it. Ten days." | G ← 0; R 10 + round(0.7 × (8 + 25)) = **33**. `Truce` until day 12. Nobody takes his post or role (G6) | G 0, R 33. Truce |
| L1 D2, Verdict **B: Recruit** (free in Life 1) | He shakes himself off and follows Mikan to the Lot | G ← round(43 / 2) = 22; R 10 + round(0.7 × 18) = 23. Memory gains `OLD_GANG(daifuku)`; Braggart **resists**, so `old_gang_nerves` = false. Arc closes, **achieved** (an ending, F11) | Crew. Closing card "Wears the bell now" in the L2D1 Sniff |
| L1 D2, Verdict **C: Chase Off** | Mikan turns away; he slinks off over the far wall. "Fine! I've got other walls. Better walls!" | **Gone** (OR-14). Arc closes, **achieved**: 2 encounters, the notch, and his farewell (F11) | Legend card; closing card "Run out of town" |
| L2 D1 ≈ 1:05 | The Rivals board opens: the Lane row with Togemaru (A: truce sprig; B: on the Bell fence; C: legend card), Daifuku on the gatepost with **no puffs** (anger decayed to 10), and two silhouettes. Hovering Togemaru tags Goma **Rival** and Daifuku **Boss**. **A:** he greets Mikan at the gatepost (`TRUCE_GREET`). The Persimmon Alley contest: if **Goma** is in it, Togemaru yowls in from the laundry poles and fights beside the Posse | The greeting is his encounter 3 (F11 ruling). **F11 (join):** p = 0.35 + 0.15 (Persimmon Alley neighbours his old Patch) = **0.50**, seeded; a join the same day adds no second count but gives +5 Regard on the win (R 38). Goma's AI, targeting and lines are exactly as against any Posse (G7). Anger: the contest +25 → 35, **Riled** | A: enc 3 |
| Night 3 | — | **A:** 3 encounters (the greeting) + the notch → **the Declaration**, **Sworn Rival** (R 33–38 > G 0), in the L2D2 Sniff. **B/C:** no Declaration; the slot stays his record. **C:** the town event may draw **newcomer**, filling his empty gang place with a fresh Tough (nothing inherited) | — |
| L2 D2 | Sniff: the Declaration card (A). Tonight's raid forecast: Togemaru is not hostile (A/B/C), so the requester is the highest-F3 Grudge ≥ 40 cat, else `gang_orders` | §3.12 3g | — |
| L2 D3 | Tofu Shop Step contest with Kagi (anger +25). The Claim Spray fills the bar: **Daifuku's yowl rolls down and he climbs to his Day stop**, Tofu Shop's back wall (the window, OR-09; reference day per the F7 ruling); fighting him today is optional | Kagi's gate is 50 on Grudge, **and** the take must be quiet (F12): one Counter-Spray on his awning post keeps the card open; a second closes it whatever his Grudge | — |
| Night 5 → L2 D4 | Sniff: "A stranger's scent": a silhouette staking a held Patch. It is a fresh challenger, with a Rival tag (p 0.5) on a uniformly drawn town cat | F12: h = 3 → first arrival night 5 | — |
| L2 D4 | The Sniff carries "A stranger's scent" and "Daifuku has come down off the walls" (today's three stops). Mikan meets him at his Laundry Pole Yard stop. Fight: **Riled → Fired Up 20 s**; Riled is below Seething, so his Nose-Touch stays open (F12). **B:** Togemaru in the Posse sees his old boss: "Not your cat anymore." (no status). If Kagi was recruited, Kagi flinches, **Cowed 20 s**, until the player Tag-Ins to him ("Right. Right. I'm with the bell.") | §3.18, §3.19. Anger spent at `EncounterEnded`. Daifuku's own parameters never read who is in the Posse | Daifuku Verdict → Claim Spray the Den → `DistrictClaimed` (L2D4–L2D5) |
| After the slice (A) | Day 12: the truce ends with Regard 38 < 75, so Togemaru waits for the next free challenger night and stakes his old gatepost: "Back for my post, Collar." | §3.20, origin `truce_end`. Driven by his own timer and Regard | The rematch |

**What the sim says about this story (§4):** the Life 1 memory line plays for 100% of players. Under a Nose-Touch-first policy Togemaru is declared (Sworn Rival) in 100% of runs, **all on night 3** (the greeting counts; before the consistency pass 86% waited for the deadline), meets Mikan 7.0 times on average, and 34% of runs see at least one join-in inside the slice. Chase-first and Recruit-first players close his arc on Life 1 day 2 in 100% of runs, as the owner accepted, and that close is an achieved ending (F11).

---
### 3.17 Relationships and what each one does (OR-04, OR-05)

**Display (the owner's rule):** hover a discovered cat (mouse) or focus it (pad), and a small tag appears on **every other discovered cat it relates to**, worded from the hovered cat's point of view. If either cat is undiscovered, nothing shows. Tags are words, never numbers. **Showing a tag changes nothing** (v2 §6).

| Relation | Tag on the other cat | Stored on | Where it comes from | What it does in play (the whole list; every effect lands on the cat that holds the tag) | Owner of the effect |
|---|---|---|---|---|---|
| **Gang** | **Boss** (hovering a member) / **Gang** (hovering the Boss) | Each member (`clowder`) | Generation; a newcomer joining on a town-event night is the only later change | Says whose influence a Patch counts for (Territory). That is all. Raid escorts stay untracked Strays. **A member's behaviour never depends on what happened to its Boss, and the Boss's never on what happened to a member** | Territory |
| **Old Gang** | **Old Boss** (hovering the Crew cat) / **Old Gang** (hovering that Boss) | **Only the recruit**, as Memory `OLD_GANG(boss_id)`. The Boss's record never changes; its "Old Gang" tag is derived for display from the recruit's data | Written when the cat joins the Crew (Hige: authored) | **Old Gang Nerves** on the recruit (§3.18) | Nemesis, Combat |
| **Rival** | **Rival** | Both cats, fixed | Authored; one seeded pair per district at prehistory; a challenger's tag (p 0.5) | (1) The **join-in** (F11): a truce cat or Friend may join a fight against its Rival. **Only the joiner acts.** The opposing Rival's AI, targeting, buffs and lines are unchanged: the joiner is treated like any Posse cat (G7). (2) **Feud scuffles** on the town-event calendar (§3.12 3b), never player-triggered | Nemesis, Combat |
| **Kin** | **Kin** | Both cats, fixed | Authored; seeded at prehistory (p 0.15 per same-district procedural pair, ≤ 1 Kin per cat) | (1) **AI never targets its own Kin**: a Crew cat under AI control will not attack an opponent that is its Kin; the player can still drive it in. One `KIN_SPARE` bark, spoken by that cat. (2) Two Kin in the Crew are a **bonded pair** (Crew's matrix) | Combat (AI), Crew |

Mikan's own relationship with a cat (Grudge, Regard, truce, Nemesis) is **not** a tag; it stays as the pose, sprig and storm mark. **Tags never change because of what the player did to another cat.** They are facts fixed at generation, a challenger's arrival draw, or the recruit's own memory.

**Join-in rules (OR-13.4; formula F11):**
- At `EncounterStarted`, **from Life 2**, for each cat in `Truce` or `Friend` **in the same district** that holds a **Rival** tag on an opponent in the encounter, roll F11 (seeded per encounter). Candidates are rolled in order of `cat_id`; the first success joins. **≤ 1 joiner per encounter; ≤ 1 join per cat per day.** No join if the encounter is already at the 10-combatant cap.
- The joiner arrives after a **3 s yowl** (`ALLY_JOIN`, `AllyJoined(cat_id, encounter_id)`) as an **allied AI guest**: not controllable, no Pile-On, counts toward the cap (Combat's raid-defence guest rules). It is discovered if it was not.
- **The joiner alone changes:** the encounter counts toward its `encounters` (and toward Togemaru's arc); on a Posse win it gains **+5 Regard**; it gains a `JOINED_IN` Memory entry. On a wipe it gains nothing, and only the victor changes (§3.10).
- **The opposing Rival is untouched:** the same AI, targeting, buffs and lines as if the joiner were any Posse cat. It has no "traitor" bark.
- No Crew cat's Loyalty, assignment or AI reads a join-in (Crew §3.5.7, G10).

### 3.18 Old Gang Nerves: the owner's stare-down, from the recruit's side (OR-06)

1. **At the join** (any Crew join from a gang with a Boss, including authored Hige), the recruit's **own** Memory gains `OLD_GANG(boss_id)` (pinned), and Nemesis sets `old_gang_nerves` = **true** unless its personality resists. **Resist:** Braggart (too proud), Stalwart (steady), Brooder (hates the old boss more than it fears it). **Susceptible:** Schemer, Fraidy, Goofball.
2. **In an encounter** where the recruit is in the Posse and it **sees its Old Boss among the opponents** (at the start, or when a wave brings him in), the recruit's own reaction plays at the Standoff: ears flat, a flinch, and its own line (`OLD_GANG_FLINCH`, "…That's Daifuku's wall."), or a defiant line if it resists (`OLD_GANG_DEFIANT`, "Not your cat anymore."; no status).
3. **If `old_gang_nerves` is true and the recruit is below Sworn Loyalty (< 80)**, it is **Cowed** (Combat's status) for **20 s** (Fraidy **30 s**). While Cowed its AI will not target the Old Boss. **A Tag-In to that cat clears it at once** (`STEELED`): the player's answer, a conducting moment.
4. **The Old Boss runs its ordinary Standoff taunt and intimidation for whatever Posse it faces.** It has no defector-targeted taunt, stare, aggro or line, and its parameters never read who is in the Posse. The only cat whose parameters change is the recruit, by its own memory, after it has stopped opposing the avatar.
5. In the slice, **Hige** (Stalwart) and **Togemaru** (Braggart) resist; **Kagi** (Schemer) is susceptible, so the Daifuku fight can show both halves. If the Old Boss is Gone, in truce or in the Crew, nerves never fire (he is not among the opponents).
6. **What the owner gave up (accepted, rulings §5):** the boss's own trash-talk aimed at the defector. **Held for counsel:** if counsel clears a defector-targeted boss line, it can return as a line-only addition.

### 3.19 Boss anger and the Boss's patrol (OR-07, OR-09)

**Anger** (formula F10):

| | Rule |
|---|---|
| **Who has it** | District **Bosses** only (the slice: Daifuku), until the Boss has been Verdicted |
| **Scale** | 0–100, stored. **Shown as 0–3 steam puffs** on the Rivals board and the name-card (Calm 0, Riled 1, Seething 2, Furious 3). Never a number |
| **Sources** (marking acts on objects of the Boss's own Clowder in his district) | **Over-mark** a gang Rub Mark **+5** · **Counter-Spray** a gang post **+15** |
| **Never a source** | Fighting or Routing any cat, gang or Boss. Claim Spray (it follows a Verdict). Spraying Mikan's own posts. Marking a Stray's, a challenger's or a turncoat's post (they are not his gang's, A-9). The influence value |
| **Decay** | **−15 per night** (step 3e) |
| **Stages** | Calm 0–29 · Riled 30–59 · Seething 60–89 · Furious 90–100. `AngerChanged(boss_id, stage)` on a stage change |
| **The buff** (the Boss only) | At the start of a fight with that Boss, **Fired Up** (Combat's status) for **20 s** when Riled, **40 s** when Seething, **the whole fight** when Furious. Read through `RivalCombatProfile.anger_stage` |
| **Spent** | Reset to 0 at `EncounterEnded` of any fight the Boss took part in with outcome **win, loss or `rival_fled`**. **Not on Scram** |
| **Shown** | The puffs; one Sniff card at Seething or Furious ("The big wall is seething."); his own Standoff line about his own posts (`BOSS_POSTS`) |
| **Touches nobody else** | Gang members' parameters, spawns, escorts and lines never read anger |

**What this does to play:** quiet erosion (Rub Marks first, one Counter-Spray) keeps the Boss Calm by the time he comes down; loud Counter-Spraying brings a Seething or Furious Boss to the window. Territory's sneak-versus-loud choice now also sets how hard the Boss hits. The rematch after a loss meets a Calm Boss at −10% Nerve: the owner's "spent whether you lose or not". Sim (§4): a quiet player meets a Calm Daifuku 100% of the time; a typical player meets him Riled (53%) or Seething (34%); a loud player meets him Seething (92%), and 84% of loud runs touch Furious at some point.

**The Boss's patrol (placement owned here; the window is Territory's).**
1. **Before the window opens,** Daifuku stays at the Den corner stone and ignores Mikan ("Come back when the Lane smells of you, Collar."). The Den post cannot be marked.
2. **When `BossWindowChanged(lane, open = true)`** (influence 100, Territory), a yowl rolls down from his wall and he climbs down. He walks a fixed **three-stop patrol**, one stop per daytime phase, staying at the last through Night; each stop is one **arena kit** (a wall segment with a knock-off edge and a water prop): **Morning** Laundry Pole Yard's yard wall (wash tub) · **Day** Tofu Shop's back wall (rain barrel) · **Dusk and Night** the Den corner stone (the bucket). The current stop shows on the Turf Board map and as a crown tick on the Whisker Sense compass.
3. **Challenging:** approach within 8 m of his stop for a Standoff, then the Boss fight there (Combat's 3-phase design on the kit). While the window is open (it closes below influence 75 at step 2), he patrols; when it closes he returns to the Den.
4. **G5:** the window opens a place and a schedule only. His level, stats, traits and role never read influence; his only buff is anger, a separate store fed by objects.
5. After his Verdict he leaves the patrol (Gone, Crew, or `Truce` roaming the walls). Nobody replaces him in the slice (§3.11).

### 3.20 Challengers and newcomers (OR-10, OR-14, OR-16)

**Newcomers** (the owner's "a new character will be created and own that place").
- On a **town-event night** (§3.12 3b) whose drawn kind is `newcomer`, a **freshly generated** cat arrives if the district has an **empty gang place** (fewer than 7 non-Boss Wall Sitters on the street) or a **keeperless Patch** (one that lapsed to 0, or was cleared by a Verdict and not Claim Sprayed), and tracked < 12.
- It joins the gang **as a Tough** (never in a departed Captain's or Boss's role), with traits, personality, level and Memory **drawn fresh**. Nothing is inherited from, scaled by or chosen because of the cat that left, or Mikan's history with it. A keeperless Patch gets it as **Keeper at rival Scent 60** (Territory). **An existing cat is never moved up or in** (G3, G6). `origin = newcomer`; it sits at the Outsiders gate on the Rivals board.
- *Deleted (OR-21.5):* refills by Roamers (NS-18 and old §3.12 3d), seats.
- **The Usurper: a new Boss (OR-14.2, C4's "new boss may appear, mainly when you lose influence"; full game, consistency pass).** On a town-event night in a district that has **no Boss on the street** (its Boss is Gone, Crew, in truce or a Friend) and where **Mikan's influence is below 25** (less than one Strong post: the district has slipped away), the event is a **Usurper**: a **freshly generated** cat of Boss role (traits, personality, level and Memory drawn fresh; nothing from the old Boss; `origin = newcomer`). It **stakes the Den as a challenger** (§3.20 table, motive `challenge`, its target the Den whatever the influence); Lost, it becomes the Den's Keeper and the district's Boss, and the window rules (Territory §3.5) apply to it from scratch; Repelled twice, it leaves. It reads only territory state, the calendar and the RNG, and no existing cat moves up (G3, G6). **Unreachable in the slice**, which ends at the Lane claim; built and simmed with Life 3 (Backlog).

**Challengers** ("a raid leader with a face by day"; formula F12).

| | Rule |
|---|---|
| **Who** | A **freshly generated** cat with the Wall Sitter personality weights, **Tough tier** in Lives 1–2 (Captain tier from Life 3). `clowder = outsiders`. It carries one **Rival** tag with p **0.5** to a non-Gone, non-Crew town cat drawn **uniformly**, never weighted by Mikan's history. Origins: `calendar`, or `truce_end` (an existing cat whose own truce ended with Regard < 75; it keeps its own record and challenges for its old Patch if Mikan holds it) |
| **When** | A fixed calendar per district (F12): the first on the **second night after Mikan first holds ≥ 3 Patches there**, then **every 4th night after that one**. A due night with an active challenger in the district is skipped. **≤ 1 active per district.** A waiting truce-end cat takes the next free due night instead of a fresh cat. Slice expectation: one, arriving night 5 and announced in the **Life 2 day 4** Sniff (sim: median night 5, 0.98 per slice) |
| **Target** | Mikan's **lowest-Scent** held Patch in the district (never Low Wall Corner, never the Den; ties: the higher yield) |
| **Announced** | The next morning's Sniff card "A stranger's scent" (silhouette until discovered, the target's landmark, a tape star); the Outsiders gate on the Rivals board; a stamp on the Turf Board; a compass tick |
| **By day** (Morning–Dusk) | It stands at the target post in a staking pose. Approach for a Standoff (`CHALLENGE_STAKE`: "This post's mine now, Collar."), then a fight: challenger + 1 Stray escort. **Win: a Verdict** (Recruit is greyed in the slice: not slice-recruitable), and the challenge ends. Optional; counts toward the day's 4–6 encounters. **Beating it never adds Scent** (G5) |
| **By night** | **Over-mark −10** on the target each night it is active (a posted Goofball: 0; Territory). From the night it arrives it **takes the district's raid slot** with motive **`challenge`** (it fires the next Night). **Lost: it becomes that Patch's Keeper** (`state = Seated`, Outsiders). **Repelled twice: it leaves town** (`Gone`) |
| **Links** | C3: its over-mark is pressure on influence, and a Patch it takes gets a new Keeper. C4: Chase Off is final, so challengers and newcomers are how the town refills with faces. **The calendar never reads which cats were Chased Off** |

---

## 4. Formulas

Rounding is to the nearest integer, .5 up, at the end of each formula. Every `rng` follows §3.3.

### F1. Encounter ledger

`ΔG = min(cap_enc, round(m_g × Σ g_i))`, then the Verdict override (Recruit: `G ← round(G/2)`; Nose-Touch: `G ← 0`; Chase Off: the cat is Gone). `ΔR = round(m_r × Σ r_i)`, plus a flat +5 for a won join-in (§3.17). Both are clamped to 0–100. `G_pending = clamp(G + min(cap_enc, round(m_g × Σ g_rout)))` uses rout items only (no Verdict term) and feeds the tell and the F4 gate.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `g_i`, `r_i` | int | §3.5 table | Event bases this encounter, all from the cat's own participation |
| `m_g`, `m_r` | float | 0.6–1.2 / 0.7–1.5 | Personality multipliers (§3.4) |
| `cap_enc` | int | {35, 20} | 35 for the cat's encounters 1–2, 20 after |
| `ΔG` | int | 0–35 | Grudge change (before any override) |
| `ΔR` | int | −15 to +50 | Regard change |

**Output range:** ΔG is 0–25 in practice, under the 35 / 20 cap. The largest raw input is a Braggart Keeper that is Ambushed, Fear-hit and Pile-On'd: Σg = 6 + 3 + 3 + 3 + 6 = 21, × 1.2 = 25.2 → 25, which the 20 cap holds to 20 from its third encounter. ΔR runs from −15 (a Fraidy that wins a wipe after an Ambush and a Fear hit: (−10 −3 −2) × 1.0) to +50 (a Stalwart with a clean win and a Nose-Touch: (8 + 25) × 1.5 = 49.5 → 50).
**Worked example:** Togemaru, L1 D2 (Keeper of Laundry Pole Yard, clean Pile-On): Σg = 6 + 3 + 6 = 15, × 1.2 = 18 → G_pending 25 + 18 = **43**.

### F2. Nightly drift

`G' = clamp(0, 100, G − d · quiet · (1 − lead))`

| Symbol | Type | Range | Description |
|---|---|---|---|
| `d` | int | {1, 2} | 1 for Brooder, else 2 |
| `quiet` | bool | 0/1 | 1 if the cat had no encounter with the player today |
| `lead` | bool | 0/1 | 1 for Togemaru while his arc is open |

**Range:** 0 to −2 per night. *Deleted: `s_simmer`, `s_stew` (OR-21.1, .10).* **Example:** a Wary Goofball at 46, unseen for 3 nights: 46 → 40 (Indifferent; a pose change, no announcement).

### F3. Arc score (raid requester, Ambush candidate, Sniff priority)

`A = 12·enc + 10·marks + 0.3·max(G, R) + 15·beat_mikan − 3·min(days_unseen, 10)`

| Symbol | Type | Range | Description |
|---|---|---|---|
| `enc` | int | 0–15 (slice) | The cat's encounters with the player |
| `marks` | int | 0–3 | Player-sourced Scars (≤ 2) + a Title involving Mikan (≤ 1) |
| `G`, `R` | int | 0–100 | The cat's current meters |
| `beat_mikan` | bool | 0/1 | Its own Memory holds `WON` or `LICK_IN` |
| `days_unseen` | int | 0–∞ | Days since its last encounter (counted ≤ 10) |
| `A` | float | −30 to ≈ 255 | Higher = more "the player's cat" |

Every input is the scored cat's own record. It is only compared, never displayed. *No longer used for lead choice:* the lead is fixed (OR-15). **Example:** a Tough after 2 encounters, 1 Scar, G 55, seen today: 24 + 10 + 16.5 = 50.5.

### F4. Nose-Touch gate (deterministic; OR-13.1, F12)

`open = G_pending < 50 + shift(personality)  ∧  ¬loud`
`loud = life ≥ 2 ∧ ( (keeper ∧ n_counter_own ≥ 2) ∨ (boss ∧ anger_stage_at_standoff ≥ Seething) )`

| Symbol | Type | Range | Description |
|---|---|---|---|
| `G_pending` | int | 0–100 | The cat's Grudge after this encounter's rout items (F1) |
| `shift` | int | −5 … +15 | Stalwart +15 · Goofball +10 · Fraidy +5 · Schemer 0 · Brooder −5 · Braggart −5 |
| `n_counter_own` | int | 0+ | Counter-Sprays Mikan put on **this cat's own post** in this contest (from `MarkApplied`, kind `counter_spray`) |
| `anger_stage_at_standoff` | stage | Calm–Furious | A Boss's own anger stage at the Standoff, before the fight spends it (F10) |
| `open` | bool | — | Card offered; otherwise halftoned with its reason: "Tail lashing. Not today." (Grudge) · "Too much of your stink on its post." (Keeper) · "Still steaming. Not today." (Boss) |

**Range:** Grudge gate 45–65. No roll, no snubs; reloading changes nothing. Every input is the cat's own record, its own post's marking acts or its own anger (G2, G8: no other cat is read). *Deleted: F4 as a probability, snubs, `nose_accept` / `nose_snub` (OR-21.2).*
**Why the quiet-take clause (consistency pass, F12):** the Grudge gate alone was open on 91–100% of slice Verdicts, so Nose-Touch was free. The clause makes it something the player earns or forfeits during the take: the quiet take (two unseen Over-marks, one Counter-Spray) costs more sneaking and keeps the card; the loud take (two Counter-Sprays) is faster and closes it. For a Boss the same choice is already visible as his steam puffs. It starts in Life 2, so the first Verdict (Togemaru, L1D2) keeps all three cards.
**Worked checks:** Togemaru on L1D2 after a clean Pile-On: 43 < 45, Life 1 → **open**. With an Ambush opener as well: 25 + round(1.2 × 18) = 47 ≥ 45 → closed (Grudge). Kagi on L2D3 after the quiet take (G 15 + round(1.0 × 15) = 30 < 50, one Counter-Spray) → open; after two Counter-Sprays → **closed** (loud). Daifuku met Riled → open on his Grudge (gate 45); met Seething → **closed**; after a lost first attempt his anger is spent, so the rematch meets him Calm → open on his Grudge. A Stalwart Tough at its first Rout (G 15 + round(0.8 × 15) = 27 < 65), quiet take → open.
**Sim (§4):** open on 100% of Life 1 Verdicts, **82% of Life 2 Verdicts** and 81% of Daifuku Verdicts (before: 100 / 100 / 100%; lose40 71% of Life 2).

### F5. (Deleted: comeback delay)

Chase Off is final (OR-14). There is no Away state, no F5, no Away cap. The number is kept so external references do not silently re-point.

### F6. Town-event schedule and choice

The next event comes on night `n + 2 + b`, `b ∈ {0, 1}` seeded 50/50, from the night after L2 D1. The kind is chosen by weight among the **eligible**: newcomer 3, feud scuffle 2. **No weight reads Mikan's history** (the old ×2 for cats with `enc ≥ 1` is deleted: it made Mikan's history with cat X change the odds that cat Y got a plaster). Nothing eligible means no event, and the schedule still advances.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `n` | int | day index | Night of the last event |
| `b` | int | 0–1 | Seeded jitter |
| `w_k` | int | 0–3 | Weight of kind k (0 if ineligible) |

**Range:** 0.33–0.5 events per district-night. **Example:** night 3, an empty gang place and one Rival pair on the street → P(newcomer) = 3/5 = 0.6. Sim: 0.43–0.44 events per Life 2 night for every policy.

### F7. Scar chance (on a Rout by the Posse)

`p_scar = min(1, 0.35 + 0.15·by_pile_on + 0.50·[routs_by_player ≥ 2])`. A cat on its 2nd+ Rout with no Mikan Scar is **always** scarred, and **Togemaru's first Rout always scars** (`p_scar` = 1, authored; F11). No Scar if it already shows 2 from Mikan.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `by_pile_on` | bool | 0/1 | From `CatRouted` |
| `routs_by_player` | int | 1+ | Including this Rout |
| `p_scar` | float | 0.35–1.0 | |

**Example:** a Tough's first Rout, by Pile-On: 0.50; its second: 1.0. Togemaru's first: 1.0 (authored).

### F8. Bark score

`S = 3·n_mem + 2·n_rel + 1·n_ctx − 4·said_to_player − 2·recent_any`. Pick uniformly (seeded) among the top S. `n_mem ≥ 1` → unskippable 1.0 s.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `n_mem`, `n_rel`, `n_ctx` | int | 0–4 each | Matched required tags per family (memory tags are the speaker's own) |
| `said_to_player` | bool | 0/1 | This cat has said it to the player before |
| `recent_any` | bool | 0/1 | Any cat used it in the last 10 barks |
| `S` | int | −6 to 24 | |

**Example:** "Go on, tip the bucket…" with `adapted:*` → S = 3; a floor line → S = 0; the memory line wins.

### F9. Rival level

`L_gen = clamp(1, 8, L_mikan + o_rank + δ)`; **growth +1 on each adaptation** (its own experience); the cap is `L_mikan + 3`. Daifuku is authored. *Deleted: growth per comeback and per promotion.*

| Symbol | Type | Range | Description |
|---|---|---|---|
| `L_mikan` | int | 1–8 | Mikan's level at generation |
| `o_rank` | int | Roamer −1, Tough 0, Captain +2 | Role offset (newcomers and slice challengers are Toughs) |
| `δ` | int | −1..0 | Seeded |
| `L` | int | 1–8 (slice band) | |

**Example:** Togemaru, generated at L_mikan 2: 2 + 0 + 0 = 2; after one adaptation, 3.

### F10. Boss anger (F-anger; OR-07)

On a marking act: `A ← min(100, A + 5·n_over + 15·n_counter)`. Each night: `A ← max(0, A − 15)`. On `EncounterEnded` with the Boss present and outcome ∈ {win, loss, rival_fled}: `A ← 0`. `stage = Calm (< 30) · Riled (< 60) · Seething (< 90) · Furious`. Fired Up at fight start: Riled 20 s · Seething 40 s · Furious the whole fight (Combat owns the status values).

| Symbol | Type | Range | Description |
|---|---|---|---|
| `A` | int | 0–100 | The Boss's anger |
| `n_over` | int | 0–2 per Patch per contest | Over-marks on gang Rub Marks in his district |
| `n_counter` | int | 0+ | Counter-Sprays on gang posts in his district |

**Range:** 0–100. A contest's typical marks (2 Over-marks + 1 Counter-Spray) add **25**; a loud contest (2 Counter-Sprays) adds 30. **Worked example (reference path, typical):** L1 D2 contest 25 → night 10 → L2 D1 contest 35 (Riled) → night 20 → L2 D3 contest 45 → night **30** → he meets Mikan on L2 D4 **Riled** (Fired Up 20 s). A loud player who adds one extra Counter-Spray a day reaches 100 (Furious) on L2 D3 and meets him at 85 (**Seething**, 40 s). Six Counter-Sprays in one day reach Furious from Calm.

### F11. Join-in chance (F-join; OR-13.4)

`p_join = min(0.65, 0.35 + 0.15·near + 0.15·[R ≥ 75])`, seeded per `(encounter_serial, cat_id)`.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `near` | bool | 0/1 | The encounter is on, or on a neighbour of, the joiner's old Patch (Territory §3.1 neighbours) |
| `R` | int | 0–100 | The joiner's own Regard |
| `p_join` | float | 0.35–0.65 | |

**Eligibility:** Life 2+; the cat is in `Truce` or `Friend`, in the same district, holds a Rival tag on an opponent, has not joined today; ≤ 1 joiner per encounter. **Example:** Togemaru in truce (R 33) at the Persimmon Alley contest with Goma in it: 0.35 + 0.15 = **0.50**. A Friend (R ≥ 75) at his own old Patch: 0.65 (cap).

### F12. Challenger calendar (F-challenger; OR-16)

`first = h + 2`, `next_k = first + 4k` (k = 1, 2, …), where `h` is the first night at whose step 2 Mikan holds ≥ 3 Patches in the district. **Night numbering (one count for every doc; consistency pass, F3):** night *n* is the Night Shuffle that ends day *n* (day 1 = L1D1, day 2 = L1D2, day 3 = L2D1, day 5 = L2D3), and a cat that arrives on night *n* is announced in day *n* + 1's Sniff. On a due night: if no challenger is active in the district, a waiting truce-end cat arrives, else a fresh one (if tracked < 12 and an admissible target exists); otherwise the night is skipped.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `h` | int | night index | Territory state only |
| `first`, `next_k` | int | night index | Fixed once `h` is known; never reads Verdicts or which cats are Gone |

**Example (reference path):** Low Wall Corner (L1D1), Laundry Pole Yard (L1D2), Persimmon Alley (L2D1) → h = 3 → **first = night 5** (announced in the L2D4 Sniff); then nights 9, 13, … Over 30 days: ≈ 6.9 arrivals per district (sim), each resolved by a day fight, two Repels or a Lost night.

### Simulation results (owner-feedback pass, 2026-11-24)

`design/reviews/owner-feedback/sim/nemesis_slice_sim.py` (output `nemesis_slice_sim.out.txt`, which includes the consistency pass's F11/F12 rulings; `--or-pass` reproduces the revisers' run, kept as `nemesis_slice_sim.or-pass.out.txt`; before the owner pass: `nemesis_slice_sim.before.out.txt`, the round-3 `--fix3` model). 500 seeds × 5 policies × 7 days (the slice) and 300 seeds × 30 days; marking style cycles quiet / typical / loud by seed. Policies: **chase**, **recruit** (Recruit when allowed, else Nose-Touch, else Chase), **mixed** (random among available), **pacifist** (Nose-Touch when open), **lose40** (mixed, and 40% of days from day 2 end in a wipe). *Humble* is gone, so the round-3 humble policy is replaced by recruit. Encounter schedule and territory proxies as in the script's header; Territory's own sim owns Scent and raid outcomes, and Crew's owns betrayal.

| Measure (slice, 7 days) | Before (round 3, old rules) | **After (OR rules + consistency pass F11/F12)** | Note |
|---|---|---|---|
| Togemaru's memory line in Life 1 | 100% every policy | **100% every policy** | His day-1 flee cannot be interrupted, so day 2 always cites it |
| One Nemesis record (Togemaru declared, or his arc closed) | 100% declared | **100%** every policy; **never another cat** | Declared: chase 0% · recruit 0% · mixed 37% · pacifist 100% · lose40 29%. The rest closed early (Gone / Crew) on L1D2: the accepted price |
| Declaration night (when declared) | median 3 (lose40: 5) | **median 3** (the L2D2 Sniff); 0% at the deadline (lose40: median 4, 19%) | The truce greeting counts as an encounter (F11). OR pass alone: median 5, 78–86% at the deadline |
| Sworn Rival face (of declared) | pacifist 99% | pacifist **100%**, mixed 100%, lose40 73% | |
| Arc achieved (§3.7) | 100 / 100 / 89 / 100 / 80% | **100% every policy** (F11: every Verdict on him, or the Declaration, is an ending) | OR pass (≥ 3 encounters): 0 / 0 / 5 / 15 / 41%. Depth by route, mean encounters with Togemaru at slice end: chase 2.0 · recruit 2.0 · mixed 3.8 · pacifist 7.0 · lose40 3.0 (30 days: 2.0 / 2.0 / 7.8 / 30 / 4.3) |
| Verdict shares, mixed (availability-weighted) | chase 47 · humble 9 · recruit 5 · nose 39 | **chase 55 · recruit 8 · nose 37** | OR pass: 49 · 7 · 43. Recruit is rare because only 3 slice cats are recruitable |
| Nose-Touch gate open | (roll: 43–57% accepted) | **Life 1 100% · Life 2 82% · Daifuku 81%** (lose40 Life 2: 71%); closed by a loud take on 15% of all slice Verdicts | F12. OR pass: 100% (lose40 91%). The loud share follows the marking style (the sim cycles quiet / typical / loud); a player who wants Nose-Touch can keep it open by taking quietly |
| Join-ins per slice (mean; runs with ≥ 1) | — | chase 0; recruit 0.06 (6%); mixed 0.17 (16%); **pacifist 0.37 (34%)**; lose40 0.05 (5%) | 34–42% of join opportunities succeed. 30 days: pacifist 1.61 per run (85% of runs) |
| Lane cats discovered by slice end (mean / present) | — | **7.8–9.7 of 9.6–11.7 (81–92%)** | Sniff success 0.25 / 0.5 / 0.75 → 8.0 / 9.1 / 9.7 of 10.9 (mixed); 1.2–2.8 silhouettes left |
| Bosses discovered | — | **Daifuku: 97–100%** (the L1D2 prompt); the 4 uphill crowns stay silhouettes by design | |
| Boss anger: peak / at the first Daifuku fight | — | **quiet:** peak Riled 94%; Calm at the fight 100% · **typical:** peak Seething 51%, Furious 13%; at the fight Riled 53%, Seething 34% · **loud:** Furious 84%; Seething at the fight 92% | Anger tracks the sneak-versus-loud choice; the decay means nobody is Furious *at* the fight unless he marks loudly the same day |
| Challengers | — | **0.98 per slice**, first arrival median **night 5** (L2D4 Sniff); lose40 0.68 | 30 days ≈ 6.9 per district |
| Town events per Life 2 night | 0.45 | **0.44–0.45** (newcomer 0.12–0.34, scuffle 0.10–0.32) | Pacifist players rarely vacate a place, so most of their events are scuffles |
| Seated cats at Grudge ≥ 75 (AC 11) | 9.5 / 11.4 / 0.9 / 0.0 / 0.6% | **0.0%** every policy | No comebacks or uprisings feed Grudge any more |
| Life 2 days with an antagonist on the street (Togemaru, a challenger, the window, or Daifuku Riled+) | — | chase 67% · recruit 67% · mixed 79% · pacifist 100% · lose40 63% | 30 days: 91–100% |
| **Invariant (1): only participants change** | (old rules violated it: promotion, refills, Stewing) | **0 violations in ≈ 51,300 checks** (interactions + nightly counterfactuals) | Self-test: re-injecting loss promotion is caught 623 times; re-injecting Stewing 83 times |
| **Residual (OR-19): who raids tomorrow** | — | perturbing one cat's history changes the requester's identity on **8–13% of nights** | Enemy selection by each cat's own Grudge; listed for counsel (§6.4), not a rule that changes the other cat's record |

**Sim note.** The script draws every random number from a counter-based substream keyed by `(seed, day, step, subsystem, cat_id, ordinal)`, so the nightly counterfactual (perturb one cat's Grudge, Regard, encounters and marks, re-run step 3) cannot be polluted by draw order. **Consistency pass (F11, F12):** the counted greeting (formerly the A-10 lever), Togemaru's authored first Scar, the ending-based arc definition and the quiet-take clause are now the default rules; the F12 model keeps the marking styles unchanged (a typical player's extra Counter-Spray, 50% of contests, lands on the contested post), and the Den post, which cannot be marked, no longer adds the Keeper-mark Grudge row to Daifuku (a sim correction). Anger figures are unchanged by the pass.

---

## 5. Edge Cases

| Situation | Rule |
|---|---|
| The player tries to interrupt Togemaru's flee on Life 1 day 1 | It cannot be interrupted (OR-14.5). The first Verdict is day 2's |
| The player avoids the gatepost on Life 1 day 2 | His placement is on the only route out, within 30 s. By the High Road he is moved to the first Scent Post the player approaches |
| The player wipes against Togemaru on Life 1 day 2 | The day ends (OR-01; the moon-blue nightfall before the flap). Togemaru Gloats, gains `WON` and Bell-Ringer (a mark) and stays Keeper; nothing else changes. L2 D1: `REMATCH_I_WON` with `mikan_plastered`, and the gatepost contest moves to that day |
| Togemaru is Chased Off or Recruited (any time) | His arc closes with a closing card; the slot stays his as a record; **no other cat is declared, named lead or promoted** in Lives 1–2. Life 2 pressure comes from Daifuku and the challenger |
| Togemaru is Nose-Touched | He stays the lead, greets daily (`TRUCE_GREET`, each greeting an encounter, ≤ 1 counted a day), may join in against Goma (or a challenger tagged his Rival), and is declared on night 3 after his first greeting, normally as a Sworn Rival |
| Togemaru is declared, then Recruited or Chased Off | The arc closes; the storm mark becomes a bell (Crew card) or stays on his legend card |
| The highest-ranked Routed cat is not Togemaru | It gets the Verdict; Togemaru slips away (`SLIPPED_AWAY`, rout items only) and adapts that night from Life 2 |
| The Crew is full | "Recruit — make room" (DR-34) |
| Recruit blocked (G ≥ 90 and R < 50; or not slice-recruitable) | Greyed; tell: it bares its teeth at the bell / turns its tail to the bell |
| Nose-Touch gate closed | The Up card is halftoned with its reason ("Tail lashing. Not today." / "Too much of your stink on its post." / "Still steaming. Not today."); Recruit and Chase Off remain |
| A loud take in Life 2 (≥ 2 Counter-Sprays on the Keeper's own post this contest) | Nose-Touch closed for that Keeper's Verdict whatever its Grudge (F4). Counter-Sprays on other posts, Over-marks, and Claim or Rescue Sprays do not count |
| Daifuku met Seething or Furious | Nose-Touch closed for that fight's Verdict; his anger is spent by the fight (win, loss or `rival_fled`), so a rematch after a loss normally meets him Calm and the card can open |
| A Verdict on a cat that is not a Keeper or a Boss (a wave cat, a Roamer, a challenger, a raid leader) | Only the Grudge gate applies: it has no post of its own in the contest |
| Nose-Touch on a Keeper whose Patch the player needs | The post is cleared like any Verdict; Claim Spray it at once. Its truce never blocks the Patch |
| A cat in truce would be a raid requester, Ambusher, or in a group hostile to Mikan | Never (OR-13.3) |
| A truce ends while its old Patch is no longer Mikan's | A truce-end challenger targets its old Patch only if Mikan holds it; otherwise it targets per F12's rule |
| Two truce cats or Friends could join the same encounter | Rolled in `cat_id` order; the first success joins; ≤ 1 joiner |
| A join-in would exceed the 10-combatant cap | No join |
| A joiner's Rival is Gone or in the Crew | The tag is inert (it can never be among the opponents) |
| The Posse wipes in a fight with a joiner | The joiner gains nothing but the encounter; only the victor changes (§3.10) |
| The recruit's Old Boss is Gone, in truce or in the Crew | Old Gang Nerves never fire |
| A susceptible recruit is Sworn (Loyalty ≥ 80) | Defiant line only; no Cowed |
| Daifuku is Verdicted | His anger store is removed; marking acts no longer feed anything. The gang is re-tasked by nobody (G6) |
| Mikan Scrams from the Boss fight | Anger is **not** spent (no free reset) |
| Mikan marks a Stray's, a challenger's or a turncoat's post | No anger (they are not the Boss's gang, A-9). Territory effects as normal |
| Anger would exceed 100 | Clamped at 100 (Furious) |
| The window opens while Daifuku is Furious | He patrols Furious; the first fight with him spends it |
| No cat has Grudge ≥ 40 for a raid request | The gang sends a seeded Tough under `gang_orders`, whatever the Boss's state |
| A challenger arrival is due with tracked = 12, or with no admissible target | Skipped; the calendar advances |
| A challenger is Routed | Verdict: Chase Off (Gone) or Nose-Touch (truce, then Friend or a truce-end challenger); Recruit greyed in the slice. The challenge ends either way |
| A challenger takes a Patch (Lost) | It becomes that Patch's Keeper (Outsiders); the calendar is free again. Retaken by the Stale Claim Standoff, then a Claim Spray (Territory) |
| A newcomer is due but the gang is full and no Patch is keeperless | The newcomer kind is ineligible; a scuffle (if eligible) or no event |
| Tracked would exceed 12 | No fresh generation (newcomers or calendar challengers) |
| An adaptation would break Always a Way In | Skip to the next rule; if none applies, no adaptation |
| An `adapted` line is missing for a Strength | Lint fails the build |
| Ambush rolled on the morning after a wipe, in Life 1, or with a truce/Friend/Crew/challenger candidate | Not placed |
| The player Ambushes a cat it has never met | Corner tag; `STANDOFF_FIRST` at the Rout; logged as the first meeting; discovered |
| A cat is sniffed while it is behind a wall or beyond 10 m | No discovery; the sniff needs the cat on screen within 10 m for 1.0 s |
| An undiscovered challenger appears in the Sniff | Silhouette card; discovered at its Standoff or a sniff |
| The player Scrams | Grudge 0, Regard −8 for the cats present; nobody else changes; Togemaru's presence guarantee still holds |
| Reload to re-roll a join-in or a Scar | The same result: seeded on `encounter_serial`. The Nose-Touch gate has no roll |
| Mikan Routed by an untracked Stray in a won fight | No Lick In (tracked Rivals only) |
| `DistrictClaimed` (Lane) | Every gang cat stays as it is; nobody is promoted. Holdout rules are Backlog (NS-17) |
| Two cats tie for any pick | The earlier first meeting wins, then the lower `cat_id` |
| A line overflows at maximum slot length | `short_text`; else dropped and logged |

---

## 6. Dependencies

### 6.1 Events consumed and emitted (brief §6.1 names; OR-20)

| Direction | Event / query | Use |
|---|---|---|
| In | `EncounterStarted` (opener, participants) | Clean / Ambush flags, encounter counts, discovery, Standoff line, **the join-in roll**, Old Gang Nerves |
| In | `CatRouted` (finisher, damage_type, by_pile_on, was_frazzled) | Ledger, Scar type, Lick In (victim = Mikan) |
| In | `FearTriggered` | Fear item, Water cowlick, adaptation input |
| In | `EncounterEnded` (outcome, routed_ids) | Verdict cat, `SLIPPED_AWAY`, loss and victor, **anger spent**, joiner Regard |
| In | `PatchChanged`, `RaidResolved` (+ `presence`), `DistrictClaimed` | Keeper, challenger Lost / Repelled count |
| In | `MarkApplied(patch_id, district_id, kind ∈ {over_mark, counter_spray, claim_spray, rescue_spray}, target_clowder)` (Territory; brief §6.1, adopted in the consistency pass, F8) | Boss anger (F10: `over_mark` and `counter_spray` on the Boss's own Clowder only); the Nose-Touch quiet-take count (F4: `counter_spray` on the contested Keeper's own post) |
| In | `BossWindowChanged(district_id, open)` | Patrol placement (§3.19) |
| In | `HomeArrived`, `PhaseChanged`, `DayEnded`, `LifeAdvanced` | Routine tags, `mikan_plastered` (victor only), Night Shuffle |
| In | `CatRecruited` (Crew) | Writes `OLD_GANG` and `old_gang_nerves` |
| Out | `VerdictApplied(rival_id, verdict ∈ {chase, recruit, nose}, slipped_away_ids[])` | Territory, Crew, Economy, UX |
| Out | `TownEvent(kind ∈ {newcomer, feud_scuffle}, cat_ids, patch_id?)` (replaces `RivalRankChanged` / `WallEvent`) | UX, Territory, Narrative |
| Out | `CatDiscovered(cat_id, how ∈ {encounter, sniff, crew})` | UX, Audio |
| Out | `AngerChanged(boss_id, stage)` | UX, Audio, Combat (read at fight start) |
| Out | `ChallengerArrived(cat_id, district_id, patch_id, origin ∈ {calendar, truce_end})` | Territory, UX, Audio |
| Out | `AllyJoined(cat_id, encounter_id)` | Combat, UX, Audio |
| Out | `RaidRequested(attacker_ids, patch_id, motive ∈ {grudge, gang_orders, gloat, challenge}, night)` | Territory, UX |
| Out | `NemesisDeclared(cat_id, face ∈ {sworn_enemy, sworn_rival})`; `NemesisArcClosed(cat_id, how ∈ {gone, crew})` | UX (Declaration / closing cards), Narrative, Audio |
| Out | `BetrayalTriggered(crew_id, patch_id)` (reachable from Life 2) | Crew, Territory, UX |
| Query out | `RivalCombatProfile` (level, style, personality, moves, strengths, fears, title, scars, flee_threshold, **anger_stage**; on Crew cats **old_gang_nerves**, **old_boss_id** (from its own Memory), **kin_ids**) | Combat |
| Query in | `PowerRating`, `Loyalty`, Wavering nights (Crew) | Raid targeting, the betrayal step |

### 6.2 Owned by others (this doc does not set)

- **Combat:** Fear and Strength values; flee windup; Ambush counter timing; Old Score; Pile-On; Rival AI by personality; **the values of Cowed and Fired Up; the ally guest; the Kin targeting rule; the patrol arena kit**; Togemaru's uninterruptible day-1 flee animation.
- **Territory:** Scent, raid and challenge resolution, the challenger over-mark, Claim Spray, **influence and the Boss window**, the presence rule, the Keeper's arrival at Scent ≤ 30, Clout, Sentry and Watched rules, the Goofball's "Laughs off a challenge".
- **Crew:** the Bribe, starting Loyalty (input `G_pre`), the story recruits, signature-perk values, **Loyalty, Wavering and the betrayal thresholds**, Kin as a bonded pair, the G10 audit.
- **Day Loop:** phase timing; the loss time-skip to Night and the closed street; encounter density including the roaming Boss and challengers.
- **Narrative:** every line; Daifuku's personality; the Routed Evening and the plaster; Life gates; the L1D2 sniff prompt's staging.
- **UX:** the **Rivals board**, hover tags, the three-card Verdict prompt, the Sniff and the unified Turf Board.
- **Art:** 4 silhouette Scars, the head plaster, 7 disposition poses, the storm mark, the truce sprig, anger puffs, the old-gang stamp, 6 personality sets.
- **Audio:** 2 voice bodies × 8 intents, per-Rival stings, the join-in yowl.

### 6.3 Assumptions for creative-director review

- **A-1:** Daifuku is a Brooder (Narrative owns Boss personalities).
- **A-2 (amended):** Daifuku's Verdict (any of three) is followed by Mikan's Claim Spray of the Den post (OR-09); the automatic Den claim on a Boss Verdict is deleted.
- **A-4:** DR-42 lists "Clout +2" for Chase Off while DR-14 makes Clout milestones-only. This doc emits the Verdict and lets Territory decide.
- **A-5:** the Title "the Soggy" shares a word with Combat's Soggy status; kept as a callback (NS-C14).
- ~~A-6~~ superseded by OR-15 (one slot, fixed lead, never re-named).
- **A-7:** a Nemesis can be friendly (the **Sworn Rival** face). Narrative to confirm tone.
- **A-8 (new):** newcomers always join as **Toughs**: a departed Captain's or Boss's role is not refilled in the slice, so no newcomer's role is "chosen because of" the cat that left (OR-14.3).
- **A-9 (new):** anger counts only marks on **the Boss's own Clowder's** Rub Marks and posts. A Stray-held Low Wall Corner (the L1D1 tutorial) and challenger or turncoat posts do not count. The showcase's "Furious from the Life 1 Counter-Sprays" is a seeded snapshot, not this rule.
- ~~A-10~~ **Resolved by the creative director (consistency pass, F11):** every Verdict on Togemaru is an ending, so the arc counts as achieved at any Verdict (or the Declaration) once he has cited his memory and carries a mark; his first Rout always scars; and the truce greeting counts as an encounter. Sim: arc achieved 100% for every policy; truce Declarations on night 3.
- **A-11 (new):** the L1D2 Whisker Sense prompt toward Daifuku (§3.13) is a Narrative/UX staging request, so the Lane's Boss is discovered in Life 1 for ≈ 90%+ of players.
- **A-12 (new):** a truce-end challenger keeps its own record (Memory, Scars, Grudge 0 + its Regard), and targets its old Patch when Mikan holds it.

### 6.4 Patent risk (E-4) — not legal advice

**Source:** `design/legal/nemesis-patent-analysis.md` **v2** (2026-11-24), which quotes all 11 independent claims of the Warner Bros. family (US 10,926,179 B2; US 11,660,540 B2; US 12,201,908 B2; pending US 2025/0108303 A1; full text in `design/legal/claims/`). The binding design rules are `owner-feedback-rulings.md` (Appendix: guardrail → ruling map). **This section reaches no legal conclusion and is not a clearance.** It records, as observations, which claim elements each feature is designed to stay away from.

**The common core of every independent claim (v2 §3.5):** the avatar interacts with NPC #1 → an outcome (an event, a threshold, or a status change of NPC #1) → a **different** NPC #2 has its parameters or control changed. Shorthand: **2nd-NPC element** ('179 C1 · '540 C2 · '908 B3 · '303 C4), **outcome element** ('179 B1 · '540 B2 · '908 A3 · '303 B4), **output element** ('179 D1 only).

**Guardrails G1–G12 (v2 §5): all adopted.**

| Feature (this doc) | Guardrails | How it stays off the claim elements (observation) |
|---|---|---|
| Per-cat Memory, Grudge/Regard, Scars, Titles, Lick In, adaptation (§3.5–3.9) | (v2: "not needed") | Each changes only the cat Mikan dealt with; no second NPC. Adaptation now triggers on that cat's own flee or slip-away |
| Loss (§3.10) | **G1** | The wipe is an avatar–victor outcome; only the victor changes (Memory, Title, Gloat, its own rematch plaster, its own anger spent). No promotion, demotion, feud or Scent effect for anyone else: away from the 2nd-NPC element and the avatar-death dependents |
| Rivals board, silhouettes, discovery, hover tags (§3.13, §3.17) | **G11** (partial), **G12** | Display only (v2 §6). No second-NPC change exists for the board to output, so it supplies no '179 D1 |
| Relationship effects (§3.17) | **G4, G7, G10** | Each effect lands on the cat that holds the tag; no relationship lets an outcome with cat X alter cat Y |
| Old Gang Nerves (§3.18) | **G4, G8** | The only cat that changes is the recruit, by its own memory, after it stopped opposing the avatar. The Old Boss's parameters never read the Posse |
| Boss anger (§3.19) | **G2** (stricter) | Sources are acts on objects (no NPC interaction: the outcome element is absent); only the Boss changes. Fights are never a source, stricter than v2 G2 |
| The Boss window and patrol (§3.19) | **G5, G6** | Opened by the district's influence (territory acts) alone; a place and a schedule. The Boss's stats never read influence |
| Three Verdicts; Chase Off = Gone; no seats; newcomers only (§3.11, §3.12, §3.20) | **G3, G6, G11** | A Verdict changes cat X's status; no existing cat moves up, in or over. Vacancies wait for the calendar and only new cats fill them. The raid fallback is the gang's (`gang_orders`) |
| The fixed arc lead (§3.6) | **G3** | The deleted re-naming made cat Y's role change on a Verdict on cat X ('908 B3 / '303 C4 shape) |
| Nose-Touch and the join-in (§3.11, §3.17, F4, F11) | **G2**, **G7**; **G10 watch** | The gate reads only the cat's own Grudge, its own post's marking acts (objects) and its own anger. The joiner changes itself; the opposing Rival is unchanged. Watch item: under pending '303, an ally joining because of its own earlier truce is a Crew-side effect for counsel |
| Challengers, town events and the Usurper (§3.12, §3.20) | **G3, G5, G6** | Calendar- and territory-driven; never weighted by Mikan's history; only new cats appear (a truce-end challenger acts on its own timer). The Usurper is a newly generated Boss keyed to influence and the calendar; its "no Boss on the street" check is the same eligibility class as residual 2 |
| Barks (§3.15) | **G8** | Own history only, enforced by lint (AC 24) |
| No online features | **G9** | Single-player |
| Naming | **G12** | UI says "Rivals", "Sworn Enemy", "Sworn Rival"; never "nemesis", "vendetta", "fort" or "follower" in game, store or marketing text |

**Evidence (not a conclusion):** the owner-feedback sim checks, for every interaction and every night, that no cat other than the participants changes (0 violations in ≈ 51,300 checks), and its self-test shows the checks catch the deleted rules (§4).

**Residual items for counsel** (not redesigned; the same class as every enemy-selection rule):
1. The nightly raid requester and the daily Rival Ambush candidate are picked among eligible cats by each cat's own record (F3). Removing or changing one cat leaves another to be picked (sim: the requester's identity changes on 7–13% of nights when one cat's history is perturbed).
2. Eligibility filters read whether a cat is Gone, Crew or in truce: the challenger's Rival-tag draw (non-Gone, non-Crew town cats; an alternative is to draw from the fixed generation roster), feud-scuffle pairs, and the newcomer's empty-place check.
3. **G10 watch items:** the join-in; the Schemer's "dislikes Nose-Touch Verdicts" and Crew's W1/W2 Loyalty inputs (Crew §3.7.6).
4. v2 §8 question (b): whether a patrol or window state is a "character parameter" or "control parameter".

**Counsel review still blocks** scope lock of the Rivals system and any public showing (v2 §1, §8). Send counsel the v2 note, `design/legal/claims/`, this doc's §1–3 and §6.4, `territory-management.md`, the owner comments, and the rulings.

---

## 7. Tuning Knobs

| Knob | Default | Safe range | Effect |
|---|---|---|---|
| Event bases (§3.5) | Rout 6, Pile-On 3, Fear 3, Ambush 3, Keeper's post marked 6, fled 8 | ±50% | Speed to Bitter and to a closed Nose-Touch gate |
| `cap_enc` | 35 then 20 | ruled (DR-39) | — |
| `m_g` / `m_r` | §3.4 | 0.5–1.5 | Personality contrast |
| Decay `d` | 2 (Brooder 1) | ruled | — |
| Bitter threshold | 75 | ruled | — |
| Slots | Lives 1–2: 1 (Togemaru, fixed); Life 3+: + Lane | ruled (OR-15) | — |
| Declaration deadline | the night after L2 D3 | L2 D2–L2 D3 nights | Earlier = more deadline Declarations |
| Raid requester Grudge | 40 | 30–60 | Below 40 more raids are grudge-led; `gang_orders` keeps one a night |
| Nose-Touch gate base (F4) | 50 | 40–60 | Lower = Nose-Touch closes more often on Grudge (slice: Grudge alone closes 0–9%) |
| Quiet-take clause (F4, F12) | from Life 2; ≥ 2 Counter-Sprays on its own post; a Boss at Seething+ | 2–3 Counter-Sprays; Seething or Furious; Life 1–2 start | How often loud play closes Nose-Touch (slice: 15% of Verdicts, 18% of Life 2 Verdicts) |
| Truce greeting counts as an encounter | yes, ≤ 1 counted meeting a day | ruled (F11) | Declaration night for a truce lead (night 3) |
| Gate shifts | Stalwart +15 … Braggart −5 | ±5 each | Personality flavour; Togemaru's 45 must stay open after a clean L1D2 (G_p 43) |
| Truce length | 10 days | 7–14 (owner answer: 10) | Window for join-ins; when truce-end challengers arrive |
| Join-in base / near / Regard / cap (F11) | 0.35 / 0.15 / 0.15 / 0.65 | 0.25–0.45 / 0.1–0.2 / 0.1–0.2 / 0.5–0.75 | Slice join frequency (pacifist 34% of runs) |
| Anger: Over-mark / Counter-Spray (F10) | +5 / +15 | +3–8 / +10–20 | How fast loud play angers the Boss |
| Anger decay | −15/night | 10–20 | Lower = typical play reaches Seething at the fight more often |
| Anger stages | 30 / 60 / 90 | ruled | — |
| Fired Up by stage | 20 s / 40 s / whole fight | Combat | Boss difficulty by style |
| Old Gang Nerves resist set; Cowed 20 s (Fraidy 30 s) | §3.18 | ruled / Combat | — |
| Challenger first / interval (F12) | h + 2 / every 4th night | h+1–h+3 / 3–6 | Territory pressure; 30-day count ≈ 6.9 at 4 |
| Challenger Rival-tag chance | 0.5 | 0.3–0.7 | How often a challenger brings a join-in chance |
| Repelled-twice rule | 2 | 1–3 | Challenger persistence |
| Town-event gap | 2–3 nights | ruled | — |
| Town-event weights (newcomer / scuffle) | 3 / 2 | 1–4 each | Mix of new faces and plasters |
| Kin seeding | p 0.15 per pair, ≤ 1 per cat | 0.1–0.25 | — |
| Sniff-to-discover | 1.0 s within 10 m | 0.5–1.5 s / 6–12 m | Discovery pace (sim: 81–91% of Lane cats by slice end) |
| F7 base / Pile-On / 2nd Rout | 0.35 / 0.15 / 0.50 | 0.2–0.5 / 0–0.25 / fixed | Scar frequency |
| `p_ambush_day` | 0.5 | 0.3–0.7 | Rival Ambush frequency (≤ 1/day fixed) |
| Lead presence | ≥ 1/day from L2 D1 until his arc closes | fixed | — |
| Sniff nemesis items | 1 (L1) / 3 (L2) | ruled | — |
| `STANDOFF_FIRST` retirement | 20 days | ruled | — |
| Unskippable memory line | 1.0 s | ruled | — |
| Scars shown from Mikan | 2 | 2 (slice) | — |

*Deleted (OR-21):* simmer, Restless, Stew, F4's base/clean/snub, F5, Away cap, wall-event weights for return/Restless/refill/promotion.

---

## 8. Acceptance Criteria

**Experience (slice playtest, unbriefed testers)**
1. 100% of testers see a memory-citing Rival line (`n_mem ≥ 1`) **before minute 60** (DR-03). Expected ≈ minute 28 (Day Loop §3.9). *(Sim: 100% every policy.)*
2. ≥ 80% can name one Rival at 2 h and say one thing they did to it.
3. **Scar readability:** in a Rivals-board view of ≥ 8 cats and in third-person exploration at default FOV, a reviewer picks out the cat Mikan Scarred 8 times out of 8.
4. **Verdict variety (OR-12):** across testers, no single Verdict exceeds **60%** of all Verdicts given, and **≥ 70%** of testers use **≥ 2** of the three.
5. ≥ 70% of testers notice at least one overnight change on the Rivals board (a newcomer, a challenger, a plaster, a legend card), unprompted, by the end of Life 2.
6. **Rivals board read (OR-03):** a screenshot of the slice board (≤ 12 tracked + Crew + 5 uphill silhouettes, fitting the 1080p default framing without scrolling) lets 4 of 5 unbriefed viewers say who the Lane's Boss is, who hates the player, and which cats they have not met.
7. Of testers who get a join-in, ≥ 70% can say why that cat joined (its Rival was in the fight).
8. Of testers who face Daifuku with a susceptible recruit in the Posse, ≥ 70% say the recruit was scared of its old boss.

**Simulation (`design/reviews/owner-feedback/sim/nemesis_slice_sim.py`; 500 seeds × 5 policies × 7 days; 300 × 30 days)**
9. **Exactly 1 Nemesis record** (Togemaru declared, or his arc closed as Gone or Crew) for **100%** of seeds under every policy; **no other cat is ever declared**, named lead or promoted in Lives 1–2; every Declaration happens no later than the night after L2 D3. *(Sim: 100%; declared 0/0/37/100/29%, closed otherwise.)*
10. Togemaru's Life 1 memory line plays for 100% of seeds. *(Sim: 100%.)*
11. Share of Seated Rivals at Grudge ≥ 75, averaged over Life 2 nights: **≤ 15%** for every policy. *(Sim: 0.0%.)*
12. Town events per district-night 0.33–0.5. *(Sim: 0.43–0.44.)*
13. Challengers: the first arrives on night h + 2 (reference path: night 5, the L2D4 Sniff); ≤ 1 active per district at all times; Repelled twice → `Gone`. *(Sim: median night 5; 0.98 per slice.)*
14. **Discovery:** at sniff success 0.5, Daifuku is discovered by slice end in ≥ 95% of seeds and ≥ 75% of present Lane cats are discovered. *(Sim: 97–100%; 81–91%.)*
15. **Anger tracks the marking style:** a quiet player meets a Calm Daifuku in ≥ 90% of seeds; a loud player meets him Seething or Furious in ≥ 90%. *(Sim: 100%; 92%.)*
16. **Join-ins:** ≥ 25% of Nose-Touch-first runs see ≥ 1 join-in inside the slice; join success per opportunity is 35–65%. *(Sim: 34%; 39–43%.)*
17. **Arc achieved** (F11 definition) is **100%** for every policy, and the mean encounters with Togemaru at slice end are reported per policy each re-sim. *(Sim: 100%; 2.0 / 2.0 / 3.8 / 7.0 / 3.0.)*

**Rules and data (automated)**
18. Pinned Memory ≤ 6 and entries ≤ 10 for every cat over 1,000 seeded runs.
19. Always a Way In holds after every adaptation (property test).
20. One Verdict per encounter; every other Routed tracked cat gets exactly one `SLIPPED_AWAY`. `VerdictApplied.verdict` ∈ {chase, recruit, nose} only.
21. Determinism: the same seed and inputs give a byte-identical save after 7 days across 1,000 runs; reloading before a Verdict reproduces the join-in rolls and the Scar; the Nose-Touch gate has no roll.
22. No Sniff item about a cat with 0 encounters unless it touches a player Patch or Crew cat, or is a district card. **Never > 3 nemesis items.**
23. ≤ 1 Rival Ambush per day; none in Life 1 or on a post-wipe morning; never by a truce, Friend, Crew or challenger cat; 2.0 s warning; the counter window is the last 0.75 s.
24. **Bark lint:** every tag is in §3.15; memory-family tags are `self.` only; `{other}` binds only to the speaker's own `relations[]` or `OLD_GANG` entry; `mikan_plastered` only with the speaker's own `WON` entry; every template ≤ 60 characters at maximum slots (or a valid `short_text`); no banned human-reference words; ≥ 1 floor per (trigger, personality) for the 8 floor triggers and ≥ 1 `any` floor for the rest; total ≤ 240; no boss-voiced template requires `old_gang` or a defector tag.
25. A relationship tag is shown only when both cats are discovered; hovering changes no saved field (save diff before and after = 0 bytes).
26. Anger: **never changes on `EncounterStarted`, `CatRouted` or `EncounterEnded` except the reset to 0** (unit test over every combat event); it changes only on a marking act on the Boss's own Clowder's object, the nightly decay, and the reset; Scram leaves it unchanged.
27. **The patent working rule (unit tests on the full save):** a **join-in**, a **Verdict**, a **loss** and an **anger change** each leave every cat other than their subject(s) byte-identical (subjects: the Verdict cat; the victor; the joiner and the cats in the fight; the Boss). *(Sim analogue: 0 violations in ≈ 51,300 checks; the self-test catches re-injected loss promotion and Stewing.)*
28. **No rule reads what Mikan did to a different cat:** for every Night Shuffle step-3 sub-step, perturbing one cat's Grudge, Regard, encounters and marks changes no other pre-existing cat's record (counterfactual test, as in the sim). The raid requester and Ambush candidate are exempt and listed as residuals (§6.4).
29. **Fresh newcomers and challengers:** no field of a newcomer or calendar challenger is copied from, scaled by or chosen by a Gone or Crew cat (property test); the challenger calendar's inputs are `h`, the night index and the RNG only (lint).
30. **Nose-Touch gate (F4, F12; unit test):** in Life 1 only the Grudge gate applies; from Life 2, ≥ 2 Counter-Sprays on the Keeper's own post in the contest, or a Boss at Seething or Furious at the Standoff, closes the card whatever its Grudge; the gate reads only the cat's own Grudge and personality, its own post's `MarkApplied` events and its own anger (perturbing any other cat's record or post changes nothing). *(Sim: open Life 1 100%, Life 2 82%.)*

---

## Backlog (post-slice)

- NX-11: Kits (from cats with history only; "Mum"/"the old one"; ≤ 1 per Life).
- NX-13 / DR-27: the Life 8 Reckoning (state presented on return, gratitude first, Ambush budget 0, optional Usurper).
- NS-10: full population (27 gang places + ≤ 12 off-wall), legend records, save-size budget.
- NS-14: rewrite the archived A.2 (Sumi) and A.3 (Buri/Aji) stories for the full game under the v1.5 rules.
- NS-17: Holdouts in claimed districts.
- ~~NS-C8: "Comes Knocking"~~ **cut** (consistency pass): a Friend that asks to join would be a fourth recruit route, against C4's "Recruit for a bribe" (Crew §3.4).
- NX-C6: epilogue `wall_friend` / `wall_nemesis` candidates.
- **Usurper (OR-09.7):** the rule is now written (§3.20, consistency pass); build it and sim it with Life 3 (it is unreachable in the slice).
- Captain-tier challengers from Life 3; challengers in several districts at once.
- Ageing, retirement, Old-Timers.
- Multi-district behaviour and the Nemesis slot per district; the Lane slot (highest F3 at Grudge ≥ 75) from Life 3, re-simmed for 3 districts.
- Portrait Scars after two silhouette Scars; the full Scar catalogue.
- The full Titles list (Tail-First, Dust-Eater, the Unbudged, Post-Stealer, Sentry-Scatterer, the Faithful, …), each from the holder's own history.
- Fears beyond the 3 slice Fears and their escalation (Overcome/Dread).
- Strengths beyond the slice 9.
- Quirks (≤ 6 when they return; no Littermate, Gossip or Shadow).
- Clean Duels; a Standoff that resolves a Friend's status without a fight.
- A player-choice override for "which Routed cat gets the Verdict".
- Botan's Verdict (Nose-Touch only; the hand-bell calls her home).
- Botan's "Collar" hypocrisy payoff and the Secret Collar quirk.
- Full bark budget (≤ 700) and the `CREW_SPOTTED`, `WAVERING`, `LAST_WALK` triggers.
- **(Consistency pass)** The quiet-take clause (F12) makes Nose-Touch closable in Life 2 (open on 82% of Life 2 Verdicts in the sim, whose marking styles are not adaptive). Playtest AC 4 first; if Nose-Touch still exceeds 60% of Verdicts, lower the gate base within 40–60; if testers cannot say why the card closed, strengthen the card line before touching numbers.
- **(Owner feedback pass)** Typical play meets Daifuku Riled, not Furious (decay −15). If the owner wants the Furious Boss visible without loud play, lower decay within 10–20 or raise Counter-Spray within +10–20, and re-run the sim.
- **(Owner feedback pass, counsel)** The residual enemy-selection items and G10 watch items in §6.4; a defector-targeted boss line only if counsel clears it (§3.18).
- **(Owner feedback pass)** Betrayal rate (OR-11: 0% reference, ≤ 10% neglect) is simulated by Crew's sim, not this one.
- **(Iteration 3, Combat)** Togemaru is a Scrapper (resists Claw ×0.8): check in the combat prototype that a Life 1 kitten can beat him; reconcile Combat's "+15% Nerve" Strength with §3.9's slice list.
- NS-C10: the Holdout naming split with Territory.
- Wall Watch: the **victor** of a wipe sits on the wall opposite Haru's gate the next morning (victor only, G1/G8).
- ~~(Iteration 3) Deadline Declarations~~ resolved by the counted greeting (F11): truce Declarations now land on night 3; only lose-40 still declares 19% at the deadline.
- **(Iteration 3)** Rival Ambush budget: this doc's ≤ 1 per day sits inside Day Loop §3.7's ceiling (≤ 2 per day). Keep them aligned when Life 3+ budgets are set.

## Revision Log

**2026-11-23 — Round 2 (fresh slice rewrite).** Critiques: `nemesis-system--experience.md` (NX), `nemesis-system--simulation.md` (NS), `paper-playtest.md` (PP).

*Sim note (DR-57):* no shell was available in this session, so the Monte Carlo was **not run**. Every target in §8 is backed by a hand-derived bound shown in §3.16, F1, F4 and §8.12. Running the DR-57 sim is acceptance items 6–12, and the gate stays open until it passes.

| ID | Status | How |
|---|---|---|
| NX-01 | FIXED | The Thorn returns on Life 1, day 2 in every outcome (§3.8 table); 1-item Sniff; AC 1 |
| NX-02 | FIXED | Memory line at the Rout after an Ambush; unskippable 1 s; `ambushed` tag (§3.8) |
| NX-03 | FIXED | 4 silhouette Scar types; all player Scars silhouette; off-screen gives a plaster; readability AC 3 |
| NX-04 | FIXED | Lick In: Glory Title, smug tell, −5 row deleted (§3.8, §3.5) |
| NX-05 | FIXED | Nose-Touch keeps the post (truce, yield at Regard ≥ 75); no Clout; Verdict table (§3.11) |
| NX-06 | FIXED | Unlock ladder (§3.14) |
| NX-07 | FIXED | Sniff ≤ 3 items, admission filter, priority (§3.13) |
| NX-08 | BACKLOG (part FIXED) | The Lane forms (escorts → promoted → Grand Standoff) and adaptation to the player's opener are in; later forms are Backlog |
| NX-09 | FIXED | Normal interruptible flee; no scripted outcome (§3.4, §5) |
| NX-10 | FIXED | Stewing eligibility, cap 74, fallback antagonist (§3.12) |
| NX-11 | BACKLOG | Kits |
| NX-12 | FIXED | 20 triggers, icon fight barks, 20-day retirement, 237-line budget (§3.15) |
| NX-13 | BACKLOG | Life 8 (DR-27) |
| NX-14 | FIXED | One disposition pose plus storm mark (§3.6) |
| NX-15 | FIXED | `mikan_plastered`; Mark Over sprays, no raid (§3.8, §3.10) |
| NX-16 | FIXED | Slice lines rewritten, Verdict lines first (§3.15) |
| NX-17 | FIXED | 2.0 s sting, Skitter/Brace in the last 0.75 s, neutral start (§3.10) |
| NX-C1 | FIXED | Nose-Touch has no Clout credit; Territory owns Clout (A-4) |
| NX-C2 | FIXED | One resident per Patch |
| NX-C3 | FIXED | Combat's flee rule |
| NX-C4 | FIXED | = NX-17 |
| NX-C5 | FIXED | Rule 13 applies to Life 8; Lives 1–7 may cite the collar, bell, bowl, Call, never a human (§3.15) |
| NX-C6 | BACKLOG | Epilogue |
| NX-C7 | FIXED | Gloat ≤ 3 s inside UX's ≤ 6 s beat; the plaster tie |
| NX-C8 | FIXED | Held at the ring edge (DR-36) |
| NX-C9 | REJECTED | It is Keeper (DR-12) |
| NS-1 | FIXED | Decay at any G; cap 35/20; slots; ≤ 15% target (§3.5–3.6, AC 6) |
| NS-2 | BACKLOG | Betrayal is unreachable in the slice |
| NS-3 | FIXED | `personality` and `former_rank` are Nemesis-owned (§3.2) |
| NS-4 | FIXED | Pins ≤ 6 invariant, collapsed repeats (§3.7, AC 13) |
| NS-5 | FIXED | Humble +10, Restless 80, resident alone, Settled after one failure, no daily verbs (§3.11) |
| NS-6 | FIXED | Friend arc counts; lead presence guarantee; pacifist in the sim (§3.7, AC 8) |
| NS-7 | BACKLOG | Slice overflow rule in F5 |
| NS-8 | FIXED | Director wall events; Toughs ordered 1–5 (§3.12) |
| NS-9 | FIXED | Counter-based substreams, encounter-seeded daytime rolls, log tuple (§3.3) |
| NS-10 | BACKLOG | Slice capped at 12 tracked |
| NS-11 | FIXED | EBNF, slot binding, lint, volumes (§3.15, AC 17) |
| NS-12 | FIXED | = NX-17 |
| NS-13 | FIXED | `scattered` cut |
| NS-14 | BACKLOG (A.1 FIXED) | The new slice story (Togemaru since iteration 3) replaces A.1 (§3.16) |
| NS-15 | BACKLOG | Moot: duels and Spats cut |
| NS-16 | FIXED | Humble legal if the Patch will become the player's |
| NS-17 | FIXED (slice) / BACKLOG | Seated cats remain at claim; Holdouts Backlog |
| NS-18 | FIXED | Roamer becomes Keeper of an Open Patch, p 0.5 (§3.12 3d) |
| NS-C1 | FIXED | `personality` replaces both `temperament` fields |
| NS-C2 | FIXED | Crew owns L0; Nemesis supplies `G_pre` |
| NS-C3 | REJECTED | Deterministic gate (DR-09) |
| NS-C4 | REJECTED | 30/60/80 (DR-10) |
| NS-C5 | FIXED | Nemesis reads Crew's Loyalty only; betrayal is a slice no-op |
| NS-C6 | REJECTED | Dismissal per DR-34 |
| NS-C7 | FIXED | A Humbled resident's recruit uses the DR-09 gate on live Grudge |
| NS-C8 | BACKLOG | Comes Knocking |
| NS-C9 | REJECTED | Nemesis requests, Territory resolves (DR-13); motive enums merged (§3.12) |
| NS-C10 | BACKLOG | Holdout naming |
| NS-C11 | FIXED | `keeper_id` |
| NS-C12 | FIXED | = NX-17 |
| NS-C13 | FIXED | `scattered` cut |
| NS-C14 | FIXED | `Seated`; breaking point is the Grand Standoff; "the Soggy" flagged (A-5) |
| NS-C15 | BACKLOG | Turncoat Patch rule |
| NS-C16 | NOTED | Territory's Den gate (3 of 4 outer) is used in §3.11 |
| PP-05 | FIXED | = NX-09 / NX-01 |
| PP-14 | FIXED | One Verdict per fight; `SLIPPED_AWAY` |
| PP-21 | FIXED | One deterministic recruit gate; Crew prices |

**2026-11-24 — Iteration 3 (final fix pass; round-2 review `design/reviews/round-2/nemesis-territory-dayloop.md`, plus `presentation.md` and `combat-and-crew.md` rulings).** Sims: `design/reviews/round-3/sim/nemesis_slice_sim.py --fix3` (output `nemesis_slice_sim.fix3.out.txt`), 500 seeds per policy, 7 days, and 300 seeds over 30 days.

| Item | Status | How |
|---|---|---|
| N1 One First Thorn | FIXED | Togemaru (Braggart, Scrapper, Fear Cucumbers; Crew §3.3), Keeper of Laundry Pole Yard. Low Wall Corner's Keeper is an untracked Stray; A-3 deleted; Keeper table in §3.1; Day 1 Standoff after the LWC claim, Day 2 contest for its own post (§3.8). §3.16 re-derived with no Fear prop in Life 1 and Got Over It (Cucumbers) in Life 2: G 25 → 55 → 75 (cap) → declared on night 3 |
| N2 Raid requests | FIXED | §3.12 3f: one raid every night; first requested night 3, forecast in the L2D2 Sniff, fires that Night; lowest-Scent admissible target, Strong included; requester Grudge ≥ 40, else `boss_orders` |
| N3 One motive list | FIXED | Territory's five motives in §3.12, §6.1 and the `RaidRequested` payload, with the party per motive; an uprising uses the night's raid slot |
| N4 Arc-lead holes | FIXED | §3.7 (a)–(c); AC 7 and AC 8 restated against the sim |
| N5 Snubbed Nose-Touch | FIXED | The cat bolts; the Patch is Open; `nose_snub` in `VerdictApplied` (§3.11, §5) |
| N6 Humble's cost | FIXED (part) | Simmer +8 (5–10). The 7-day slice still shows mostly Restless warnings (Backlog) |
| Design risk: no Nemesis for a typical player | FIXED | **The Declaration** (§3.6): one slot in Lives 1–2, held by the declared arc lead at any Grudge, as a Sworn Enemy or Sworn Rival; deadline the night after L2D3; Recruit greyed on it; Boss never lead. **Before** (round-2 S3, as written): median Nemeses 1 for chase, **0** for humble, mixed, pacifist and lose-40 (pacifist max 0). With the round-2 fixes alone (`--fix2`): median 0 for mixed, pacifist and lose-40. **After** (`--fix3`): **exactly 1 Nemesis at slice end for 100% of every policy**, max 1 at once. Rarity holds: seated cats at G ≥ 75 average 9.5 / 11.4 / 0.9 / 0.0 / 0.6% (chase / humble / mixed / pacifist / lose-40; AC 6 ≤ 15%), and Bitter cats at the end average ≤ 0.02. Declaration night median 3 (the L2D2 Sniff; lose-40: night 5); faces: chase and humble 100% Sworn Enemy, pacifist 99% Sworn Rival, mixed about 50/50. Arc achieved: 100 / 100 / 89 / 100 / 80%. The Life 1 callback stays 100% |
| Presentation rulings | APPLIED | Late Home on L2D3 Dusk appears in §3.16 (Grand Standoff at Dusk with no Call); the L2D2 teaching order (props and Fears) is used for the first Fear prop |
| Not fixed | BACKLOG | Lane slot (Life 3), Humble cost inside 7 days, deadline Declarations with < 3 encounters, Togemaru's Strength vs Combat's menu, Kagi's Crew tag |

**2026-11-24 — Owner feedback pass (2026-11-24).** Implements `design/reviews/owner-feedback-rulings.md` (OR-01…OR-21; owner answers in its §5 all match the defaults) for the owner's comments C1–C5, under `design/legal/nemesis-patent-analysis.md` v2 §5 (G1–G12). Sim: `design/reviews/owner-feedback/sim/nemesis_slice_sim.py` (output `nemesis_slice_sim.out.txt`; before: `nemesis_slice_sim.before.out.txt`), 500 seeds × 5 policies × 7 days and 300 × 30 days, with an invariant checker and a self-test. Results and before/after are in §4 "Simulation results".

| Ruling | Status | How |
|---|---|---|
| OR-01 (a loss ends the day) | IMPLEMENTED (Nemesis side) | §3.10 hands the day's end to Day Loop; edge case for an L1D2 wipe. The time-skip and closed street are Day Loop's |
| OR-02 (only the victor changes) | IMPLEMENTED | §3.10 loss block rewritten: Gloat, `WON`, Title, a Boss's rematch plaster and anger spent; no promotion, level, seat, feud, Mark Over or Snatch. `mikan_plastered` victor-only (§3.8.6, §3.15). Gloats renamed Loaf On / Sly Circle (animations only) |
| OR-03 (Rivals board) | IMPLEMENTED (data) | §3.13: sections, discovery rule (encounter / 1 s sniff within 10 m / Crew), silhouettes, what a discovered cat shows, legends, the L1D2 Daifuku sniff prompt (A-11). `discovered` field; `CatDiscovered`. Screen is UX's |
| OR-04 (relationship tags) | IMPLEMENTED | §3.2 `relations[]`, §3.3 seeding and slice seeds, §3.17 display rule and table; `OLD_GANG` Memory kind (§3.7) |
| OR-05 (what relationships do) | IMPLEMENTED | §3.17 table: every effect lands on the tag holder |
| OR-06 (Old Gang Nerves) | IMPLEMENTED | §3.18; recruit-voiced `OLD_GANG_FLINCH` / `OLD_GANG_DEFIANT` / `STEELED`; no boss-voiced defector line (lint AC 24). Boss taunt held for counsel |
| OR-07 (Boss anger) | IMPLEMENTED | §3.19, F10, step 3e decay, `AngerChanged`, AC 15 and AC 26. A-9: only the Boss's own Clowder's objects count |
| OR-08 (influence) | N/A here (Territory) | Influence is read only through `BossWindowChanged`; no Nemesis value reads it (G5) |
| OR-09 (Boss window) | IMPLEMENTED (patrol placement) | §3.19: before-window behaviour, three-stop patrol on the arena kit, G5 note, no re-tasking after his Verdict (§3.11). A-2 amended (Claim Spray the Den) |
| OR-10 (taking territory back) | IMPLEMENTED (Nemesis side) | §3.20 newcomers into keeperless Patches on town-event nights; refill-by-Roamer deleted |
| OR-11 (rare betrayal) | IMPLEMENTED (event side) | §3.12 3a live from Life 2 for posted ex-Rival recruits; turncoat becomes Keeper (Outsiders). Rate is Crew's sim. NS-C15 is now this rule |
| OR-12 (three Verdicts) | IMPLEMENTED | §3.11 table, compass without Down, tells, `VerdictApplied` ∈ {chase, recruit, nose}, why none dominates; AC 4 |
| OR-13 (Nose-Touch gate, truce, join-in) | IMPLEMENTED | F4 rewritten as a deterministic gate; 10-day truce; F11 join-in; §3.17 join rules; truce end → Friend or challenger (§3.20). G10 watch item held for counsel |
| OR-14 (Chase Off final) | IMPLEMENTED | `Gone` with a legend card; F5, Away, comebacks, escorts, Grand Standoff, `chased_count` deleted; newcomers fresh (§3.20, A-8); adaptation re-triggered (§3.9); Togemaru's day-1 flee uninterruptible (§3.4, §3.8) |
| OR-15 (Humble removed; Nemesis slot) | IMPLEMENTED | Humble and everything on it deleted; fixed lead Togemaru never re-named (§3.6, §3.7); all three Verdicts open on him; closing cards; presence guarantee until his arc closes; new §3.16 worked story through all three Verdicts |
| OR-16 (challengers) | IMPLEMENTED | §3.20 table, F12, raid priority `challenge` > arc lead > others (§3.12 3g), `ChallengerArrived`, Sniff card |
| OR-17 (unified Turf Board) | N/A here (UX/Territory) | Nemesis supplies the challenger stamp and patrol stop only |
| OR-18 (not added) | IMPLEMENTED (compliance) | No anger for non-Bosses or from fights, no buffs from influence, no promotions, no cross-cat gossip, single-player |
| OR-19 (fixed roles; town events; Stewing cut) | IMPLEMENTED | Ranks fixed, seats deleted (§3.1, §3.2); town events (§3.12 3b, F6 without the history weight); `gang_orders`; Stewing deleted; the bark own-history rule (§3.15, AC 24); residuals listed for counsel (§6.4) |
| OR-20 (events and ownership) | IMPLEMENTED | §6.1 rewritten; step 3 order per OR-20 (§3.12); `RivalCombatProfile` fields |
| OR-21 (delete list) | IMPLEMENTED | Items 1–6, 9, 10, 13, 14 removed throughout (Undermark, Humbled, simmer, Restless, uprisings, the Down card, snubs, F4 roll, 5-day truce, Away/F5/Grand Standoff, loss promotion, Mark Over, Snatch, seats, the Fence Line, `RivalRankChanged` / `WallEvent`, re-naming, Recruit greyed for the Nemesis, Stewing, gossip, `pretender`, `boss_orders`, "betrayal unreachable", Botan's Humble, the L1D1 Verdict branch, "never leaves his wall") |
| §2 write list: v2 patent appendix | IMPLEMENTED | §6.4 rewritten: cites v2, G1–G12 adopted, per-feature claim-element table (observations only), OR-19 residuals with sim figures, counsel review still blocking |
| §2 write list: new ACs | IMPLEMENTED | AC 4 (≤ 60%; ≥ 70% use ≥ 2), AC 9 (exactly one record, 100%), AC 26–29 (unit and counterfactual tests that a join-in, Verdict, loss or anger change touches only its subject; anger never moves on a fight) |
| §2 re-sim: DR-57 policies; lose-40 under OR-01/02 | DONE | Humble policy replaced by Recruit. Key outputs: Life 1 memory line 100%; one Nemesis record 100% (declared chase 0 / recruit 0 / mixed 37 / pacifist 100 / lose40 29%); arc achieved 0/0/5/15/41% (was 100/100/89/100/80); join-ins pacifist 0.38 per slice (34% of runs); Daifuku discovered 97–100%, Lane cats 81–91%; anger at the Boss fight Calm 100% (quiet), Riled 53% (typical), Seething 92% (loud); 0 invariant violations in ≈ 51,300 checks |
| Arc-achieved collapse | DEFERRED (creative director, A-10) | A direct consequence of OR-14/OR-15 as written; lever simulated (greeting counts: pacifist 46%), not adopted |
| Nose-Touch effectively free in the slice | DEFERRED (Backlog) | Gate open on 91–100% of slice Verdicts; playtest AC 4 decides |
| Interpretations | NOTED | A-8 (newcomers join as Toughs), A-9 (anger counts only the Boss's own Clowder's objects), A-11 (L1D2 sniff prompt), A-12 (truce-end challenger target). The challenger Rival-tag pool (non-Gone, non-Crew) is implemented as ruled and listed as a counsel residual with an alternative |

**2026-11-24 — Consistency pass (creative director, iteration 2 of the owner-feedback change).** Rulings in `design/reviews/owner-feedback/consistency-pass.md`. Sim re-run: `nemesis_slice_sim.py` (default = the rulings below; `--or-pass` reproduces the revisers' run, kept as `nemesis_slice_sim.or-pass.out.txt`).

| Item | Status | How |
|---|---|---|
| F11 Togemaru's arc rarely completed | RULED, APPLIED | Every Verdict on him (or the Declaration) is an ending; arc achieved = memory line + ≥ 1 mark + an ending (§3.7); his first Rout always scars (§3.8, F7); a truce greeting counts as an encounter, ≤ 1 counted a day (§3.7). Sim: arc achieved 0 / 0 / 5 / 15 / 41% → **100%** every policy; truce Declarations night 5 (86% at the deadline) → **night 3** (0%). A-10 closed |
| F12 Nose-Touch nearly free | RULED, APPLIED | F4 gains the **quiet-take clause** from Life 2: ≥ 2 Counter-Sprays on the Keeper's own post, or a Boss at Seething+, closes the card (§3.11, F4, §5, AC 30, knobs). Sim: gate open 100% → Life 2 82% (Daifuku 81%); mixed Verdicts 49/7/43 → 55/8/37; join-ins unchanged (pacifist 34% of runs) |
| F3 challenger night | RULED | Night numbering defined in F12: night 5 = after L2D3 → the L2D4 Sniff |
| F7 window day | RULED | Reference day L2D3, at the Tofu Shop Step Claim Spray (§3.14, §3.16); the first attempt stays L2D4 |
| F8 `MarkApplied` | ADOPTED | §6.1 consumes it (renamed from `MarkingAct`) |
| Sniff priority | FIXED | One order shared with `hud.md` §5.3: Wavering first (§3.13) |
| C4 "new boss may appear" | WRITTEN | The Usurper rule (§3.20), full game; unreachable in the slice |
| AC 1 | FIXED | Expected memory line ≈ minute 28 (Day Loop §3.9), not 33 |
| Comes Knocking (NS-C8) | CUT | A fourth recruit route would contradict C4 and Crew §3.4 (Backlog line struck) |

# Territory Management and the Food-Tax Economy

*Owner: economy-designer (Territory & Economy) · Round 2 (vertical slice) · Date: 2026-11-23 · Iteration 3 (final fix pass) 2026-11-24 · Status: slice spec*
*Canon: `design/creative-brief.md` v1.2; binding rulings `design/reviews/round-1/director-rulings.md` (DR-01, DR-13, DR-14, DR-17–DR-19, DR-37, DR-42, DR-46, DR-47). First draft archived at `design/backlog/first-drafts/territory-management.md`.*
*Scope: **the vertical slice only.** Hidamari Lane (5 Patches), Lives 1–2, about 7 in-game days. Full-game material is listed in `## Backlog (post-slice)`.*

---

## 1. Overview

Territory is half of Mikan's day. Mikan takes ground by **Spraying** Scent Posts, becomes **Keeper** of a **Patch** by Routing the Rival who held it, and **posts recruited cats as Sentries** to hold that ground overnight. Every morning the cats on Mikan's turf pay a food tax, **Tribute**, which appears as a pile on Haru's **Doorstep** and goes into the **Stash**. The Stash pays for Lessons, Bribes and Share a Morsel. The management surface is deliberately small: three screens and one verb.

1. The **Morning Sniff** names tonight's raid: the target Patch, the raiders (portraits: how many, and who), and (if a Schemer is posted) the motive.
2. The **Turf Board** at the Lot: drag a portrait onto a Patch. It is the only map-like view and the only place numbers appear.
3. The **Doorstep pile**: how well the Lane paid.
4. **Spray**, out in the street: offered only on your own post when it has dropped below Strong. It is a rescue.

**Personality is what makes it a decision.** Each Crew cat guards in its own way: the Stalwart holds, the Braggart makes the Patch pay, the Brooder keeps Scent from fading, the Schemer reads the motive, the Fraidy raises the alarm early, and the Goofball keeps Humbled residents laughing. On top of that, **each raid motive has a counter personality** (the Stalwart against a gang under `boss_orders`, the Braggart against a show-off's `gloat`, the Goofball against a `grudge`, the Schemer against a `pretender`), and **cats posted on neighbouring Patches cover for each other if they are bonded and squabble if they clash**. There are two Sentry posts and a Posse that wants three cats. So every morning in Life 2 the player chooses which cats to post, where, beside whom, and who stays in the Posse, and the forecast changes the right answer each day. Posting well is worth about **+45% Tribute on raid nights** against posting at random, and about one Scuffed night in the slice instead of two and a half (§4.5, round-3 sim).

The slice economy is modelled day by day in §4.11. Tribute rises from 6 a day (Life 1, day 1) to **65 computed on the night of the claim** (shown on the slice's title card), against the canon anchor of ≈ 60. There is no debt, the Stash is never at risk, the Home Ground cannot fall, and no idle, sleep-skip or wipe strategy beats playing the day.

## 2. Player Fantasy

*"This wall is mine. That cat pays me in fish. And the big grey tom up the hill knows my name."*

- **The claim.** You sneak onto a rival's Patch, scuff out their marks, Counter-Spray their post (pop, sparkle cloud), brawl the waves they send, stare down their Keeper and then Spray the post as your own. The wisps over the post turn bell-gold. The ground has changed hands, and you can see it from the rooftops.
- **Being Boss.** You are not a cat who owns things; you are a cat other cats pay. The pile on the Doorstep is a daily, physical report card: a croquette end, two sardines, a fish head, and a baffled Haru stepping around it.
- **Your cats, your call.** At the Lot you look at the Sniff ("the Wall Sitters' Captain and one more are coming for Persimmon Alley tonight") and at your cats, and you know who belongs on that wall: the Stalwart, because she never gives ground. The Braggart can stay on the Tofu Shop Step, where the residents pay a loud cat extra. You would post the Fraidy nowhere near a fight, but she would scream the street down early enough for you to come running.
- **Rescue, not chores.** You never repaint your own turf for the sake of it. Your post only asks to be Sprayed when it has gone faint, so every Spray is either a conquest or a rescue.
- **The night is yours (from the cat flap).** A Caterwaul in your Sentry's voice rises over the roofs. You can answer it and win the defence in person, or stay home with Haru. Neither choice is punished: ignoring a Caterwaul is never worse than being asleep.

Pillar fit: **Cat's-Eye Truth** (scent, wisps, food piles, no spreadsheet outside the Turf Board); **Two Lives, One Clock** (Tribute arrives at home every morning; going home is never taxed); **Rivals Remember** (raiders are named cats with history; the thief who ate your Tribute is out there to be Routed); **Conduct the Brawl** (the cats you post are the cats you are not fighting with).

---

## 3. Detailed Rules

### 3.1 Hidamari Lane: the five Patches

The slice has one district and five Patches. Each Patch has one tall, landmark-shaped **Scent Post** (DR-47), two **Rub Marks** (shown only in Whisker Sense), a `keeper_id`, a `scent` value, and one Sentry slot. Names and posts are provisional for Level and Art; `base_yield` values are tuning starts.

| ID | Patch | Scent Post (landmark) | Feature | base_yield | Neighbours |
|---|---|---|---|---|---|
| LWC | **Low Wall Corner** (Home Ground; tutorial Patch) | red mailbox at Haru's wall | Sunspot | 8 | LPY, PA |
| LPY | **Laundry Pole Yard** | old wooden yard gatepost (the First Thorn's post) | High Perch | 10 | LWC, PA, DEN |
| PA | **Persimmon Alley** | utility pole under the persimmon tree | Cut-through | 12 | LWC, LPY, TSS |
| TSS | **Tofu Shop Step** | milk-crate stack | Back Door | 14 | PA, DEN |
| DEN | **Den: Daifuku's Wall** | the great wall's mossy corner stone | Sunspot | 18 | LPY, TSS |

Total `base_yield` is 62. The Den sits uphill, so the four outer Patches surround the approach.

**Features (only three have rules):**
- **Sunspot:** contains a Sunspot nap point (canon nap). No Scent effect.
- **High Perch:** raid defence `fixed_bonus` +0.15 (§4.5); a Caterwaul from this Patch gets +30 s.
- **Back Door:** the richest outer Patch. No targeting weight in the slice (Nemesis targets the lowest-Scent admissible Patch, §3.7); Territory still reports the Feature for later targeting rules.
- **Cut-through:** no rule. It touches three Patches, so it is the Patch most often on the frontier.

**Home Ground (LWC).** Once claimed, Low Wall Corner cannot be raided, Lost, or taken by a traitor. Its Scent decay is halved and never takes it below 10. The player always has one wall: this is the hard floor against a death spiral.

### 3.2 Scent

- `scent` is an integer 0–100 per Patch, owned by one Clowder. At 0 the Patch is **Open** (no owner).
- Bands are shown in the world as **1–4 wisps** in the owning Clowder's colour hanging at the post (DR-47), and on the Turf Board as the number.

| Band | Scent | Wisps | Tribute ×| Rules |
|---|---|---|---|---|
| Faint | 1–24 | 1 | 0.6 | Raidable; Spray offered |
| Clear | 25–59 | 2 | 0.9 | Raidable; Spray offered |
| **Strong** | 60–89 | 3 | 1.0 | **A raid cannot take it** (worst case Scuffed); no Spray offered |
| Pungent | 90–100 | 4 | 1.0 | As Strong (no extra pay) |

- Scent changes only through Spraying, contest erosion, raid outcomes, **Mark Over** (a Rival's Gloat after a wipe, §3.7) and the nightly decay and refresh (Night Shuffle step 2, §4.1). It never changes in real time while roaming.
- **Readability (DR-47):** below Strong, the wisps thin and droop. In Whisker Sense the scent compass ring points at any of your posts below Strong and at a forecast raider's sniffing trail on the target Patch.

### 3.3 Marking verbs

| Verb | Where | Input | On your own Patch | On a rival Patch |
|---|---|---|---|---|
| **Rub** | Rub Mark | tap, in passing (0.4 s) | **No Scent.** Counts as a `seen` visit for that Patch (§3.9) | **Over-mark:** −10 rival Scent. Quiet unless a rival cat within 8 m sees it; seen = Bristle |
| **Spray** | Scent Post | hold 1.2 s (tail-quiver; damage interrupts) | **Offered only when the post is below Strong.** Sets Scent to **90** at once; the Sentry chirps and any rival in view flinches. Counts as `seen` | **Counter-Spray:** −30 rival Scent, always loud (Bristle) |
| **Claim Spray** | post of an **Open** Patch | hold 1.2 s | Patch becomes yours at Scent **70** (Strong); `PatchChanged` | — |

Spraying is slapstick: a sparkle cloud and a pop, never liquid. There is **no daily limit** on any marking verb, and none needs one: Rubs give no Scent, and your own Spray exists only when it is needed (DR-18).

### 3.4 Taking a rival Patch

One number drives the contest: the rival Clowder's Scent on that Patch, `S_r` (80 on an outer Patch, 100 at the Den).

1. **Read.** Whisker Sense shows the post, the Rub Marks, the Keeper's trail and High Road routes onto the Patch.
2. **Erode.** In any mix: Over-mark a Rub Mark (−10, quiet if unseen; each rival Rub Mark once per contest); Counter-Spray the post (−30, loud); Rout a rival cat inside the Patch (−15 each).
3. **Bristle.** The first loud act puts the Patch in **Contested**. Territory asks Combat for **turf waves**: 2 if `S_r ≥ 40` at the moment of Bristling, otherwise 1; the Den adds +1. Composition is Combat's.
4. **Standoff.** When `S_r ≤ 30` and the current wave is cleared, the Keeper arrives. If quiet erosion alone brought `S_r ≤ 30`, the Keeper comes with one wave as escort and no further wave follows, so sneaking pays by skipping a fight.
5. **Verdict.** Rout the Keeper; Nemesis applies the Verdict (`VerdictApplied`). Chase Off, Humble, Recruit and a **snubbed Nose-Touch** (`nose_snub`: the Keeper bolts, no truce) leave the Patch **Open** (`S_r = 0`). An **accepted Nose-Touch** (`nose_accept`) leaves the Keeper on its post under a 5-day truce (§5).
6. **Claim Spray** → yours at 70. From Life 2 day 2 (once Sentries are taught, §3.12), a prompt offers to leave one Posse Crew cat as Sentry (the only posting outside the Lot); the Posse runs one cat short until the Lot.

**Humble** is offered only when the fight's Patch will become yours (DR-46).
**Interruptions:** a Posse wipe during a contest gives `S_r +30` (to its ceiling) plus the canon loss rules. Leaving a Contested Patch for 20 s, or going home, ends the contest, and the rival regains its normal +8 that night. Rival Scent regenerates +8 a night up to its ceiling.

**PP-03 — the Life 1 tutorial exception (Low Wall Corner).** A scripted short escalation: one Rub (Over-mark), one Counter-Spray, one wave of two Strays, then the Keeper's Standoff. The waves and thresholds above are bypassed. It fits inside DR-22's day-1 beat after the two-Stray Pile-On.

### 3.5 The Den and claiming Hidamari Lane

- The rival Den is **Locked** until the player holds **3 of the 4 outer Patches** (any three). While Locked, the post cannot be Counter-Sprayed and Daifuku is not on his seat.
- **While the Den is Open (unlocked, not yet claimed), the player's held outer Patches cannot be Lost** (DR-46). A Lost result becomes Scuffed. This kills the "re-locked overnight" treadmill.
- The Den contest is normal with +1 wave and ends in Daifuku's Standoff. Rout him (Combat: 3 phases, knock him into the bucket), give the Verdict, Claim Spray → `DistrictClaimed(hidamari)`. The Life 2 turf goal is met and Clout becomes **Boss**.
- **After the claim**, a raid on the Den is admissible only while the player holds fewer than 3 outer Patches (the symmetry rule). Outer Patches are raidable as normal again: being Boss is harder than becoming Boss. The Life goal stays met regardless (no fail state).
- **Full House:** holding all five Patches adds +10% Tribute on every Patch.

### 3.6 Sentries and the Warden

**Slots.** Sentry slots come from Clout (§3.10): 1 at House Pet, 2 from Lane Cat. **The slice is clamped at 2 slots** (DR-01). Each Patch takes at most one Sentry. The Low Wall Corner slot exists, but posting there only affects Tribute (it cannot be raided).

**The Warden is the Den's Sentry slot** (DR-46): the cat posted at a held Den is the Warden. It needs **True+ Loyalty (≥ 60)**. Cats below Shifty's ceiling (< 30) may not take a Den post (DR-10, TE-X13). Ineligible portraits are shown greyed on the Turf Board with the reason. Eligibility is checked only at posting; a Warden that later drops below 60 stays on its post (no surprise ejection).

**Posting** happens on the Turf Board at the Lot, or at the post-claim prompt. Posted cats leave the Posse and show as disabled in Tail-Up. A Patch is **Watched** if it has a posted Sentry that is not Routed-for-a-night; otherwise it is **Unwatched**.

**The daily tension.** Crew grows from 1 (day 1) to 5–6 (day 7). The Posse wants 3 Crew. With 2 posts filled, a Crew of 4 leaves Mikan with a Posse of 3. Posting is never free: the cat on the wall is not in the fight, and it is not getting Posse-time Loyalty.

**Guard behaviour = Style role (automatic) × personality (DR-37 guard column).** The player chooses nothing on the post; they choose the cat.

| Style (slice) | Role | `style_mod` | Extra |
|---|---|---|---|
| Bruiser | Anchor | 1.25 | On Scuffed, Scent loss is 10, not 20 |
| Scrapper | Scrapper-on-the-Wall | 1.10 | On a Repelled raid, the raid leader's home Patch loses 10 rival Scent |
| Yowler | Crier | 1.00 | Nightly refresh 14 instead of 10; Caterwaul window ×1.5 |

| Personality | `guard_mod` | On guard (Territory's numbers) |
|---|---|---|
| **Stalwart** | **1.50** | Best raid defence |
| **Braggart** | 1.25 | Patch Tribute **+10%** ("residents pay a loud cat") |
| **Brooder** | 1.00 | Scent decay on its Patch **×0.5**. Never leaves: it is never Routed-for-a-night (the Patch stays Watched after a Scuffed). Moving it off a post raises Crew's `dismissed_from_post` |
| **Schemer** | 1.00 | While posted anywhere in the Lane, the Sniff forecast **names the motive** (§3.7); without one, the motive shows "?" |
| **Fraidy** | 0.75 | Weak defence, but **raises the Caterwaul early**: the live raid fires at the start of Night and its window is ×1.5. On a Scuffed it bolts instead of being Routed (`sentries_routed` excludes it) |
| **Goofball** | 1.00 | A Humbled resident on its Patch never simmers, and pays **+25%** instead of +15% |

**Motive counters (iteration 3).** Every raid motive (§3.7) has a counter personality. A Sentry that counters tonight's motive defends at **`counter` = ×2.0** (`guard_mod` × 2; §4.5):

| Motive | Counter | Why (what the player is told on the Turf Board) |
|---|---|---|
| `boss_orders` (leader + 2 escorts) | **Stalwart** | "Holds against numbers" |
| `gloat` (leader alone, showing off) | **Braggart** | "Out-shouts a show-off" |
| `grudge` (leader + 1, after Mikan) | **Goofball** | "Laughs it off until it forgets why it came" |
| `pretender` (leader + 1, wants the post) | **Schemer**, **Brooder** | "Saw the plot coming" / "Never leaves the post" |
| `uprising` (the resident alone) | **Goofball** | Already declined at intake on a Goofball's Patch |

Without a Schemer posted the motive shows "?", and the player reads the forecast's portraits instead (three portraits = `boss_orders`; one = `gloat`; two = `grudge` or `pretender`, and the leader's personality hints which). The Schemer's guard perk is therefore worth real Morsels, and the Stalwart is the right answer on only one motive in four.

**Neighbours on the board (iteration 3).** Two Sentries on **adjacent** Patches (§3.1 neighbours; Low Wall Corner counts) affect each other by Crew's bond/clash matrix (Crew §3.2):
- **Bonded neighbours** cover each other's wall: each gets `pair` **+0.25** (`guard_mod × 1.25`).
- **Clashing neighbours** spend the night hissing over the fence: each gets `pair` **−0.25** (`guard_mod × 0.75`), and **both Patches pay −10% Tribute** that night.
- Neutral neighbours, and posts that are not adjacent, have no effect. A Sentry that is Routed-for-a-night or Unwatched gives no neighbour effect.
- Slice pairs that matter: Hige–Kinako, Hige–Pon, Togemaru–Pon, Kinako–Kagi, Pon–Kagi are bonded; **Togemaru–Kinako** and **Hige–Kagi** clash; Hige–Daifuku bond, Daifuku–Kagi and Daifuku–Pon clash. So the counter for tonight's motive may be the cat that clashes with the guard next door, and a Fraidy that is useless on a fight can sit on Low Wall Corner beside the Stalwart and make it stronger.

**Social pairs and Loyalty** (Crew owns the Loyalty numbers): for Territory, two cats are "posted in the same district" when both hold Lane posts. Bonded posted pairs gain and clashing posted pairs lose Loyalty per DR-37. That Loyalty effect covers any two Lane posts; the guard and Tribute effect above needs **adjacent** posts. In the slice Mikan's Posse is always in the Lane too, so Posse-pair effects follow Crew's Posse rule, not this one.

**Upkeep** is flat: **2 Morsels per post per night** (`2 × district_index`), auto-paid from the Stash in step 2. If the Stash is short, that post is on **Short Rations** for the night (`guard_mod ×0.8`). No debt is ever recorded.

**Sentry states:** Lounging → Posted → (Scuffed) Routed-for-a-night (Unwatched for one night, then resumes) → Posted. If the Patch is Lost, or lapses, its Sentry returns to the Lot. Territory reports per cat each night: `posted`, `nights_posted`, `district_seen`, `raid_outcome`, `routed`, `dismissed_from_post` (Crew reads these; Sentry XP is Crew's).

### 3.7 Raids and the forecast

**Who and why: Nemesis.** In step 3 of the Night Shuffle, Nemesis emits `RaidRequested(attacker_ids, patch_id, motive, night = tomorrow)`, at most **1 per district per night** (TE-X6). In the slice raids switch on with the cat flap (Life 2 day 2): the first one is **scripted from the arc lead**. It is requested on night 3, forecast in the day-4 (Life 2 day 2) Sniff, and fires on day 4's Night, the cat flap's first night out. From night 4 Nemesis requests **one raid every night** that an admissible target exists, against the **lowest-Scent admissible held Patch, Strong included** (Nemesis §3.12 3f).

**Forecasts are always on** (DR-46, TE-X8). Every raid that will resolve tonight appears in this morning's Sniff as a stamp card: the target Patch's landmark, the raiders' portraits, and the motive icon, or "?" unless a Schemer is posted.

**Admissibility (Territory may decline; a declined request returns `RaidResolved(outcome = declined)`):**
1. No raids in Life 1.
2. Low Wall Corner is never admissible.
3. A Patch claimed or retaken today is immune tonight.
4. No Patch is raided two nights running.
5. A held Den is admissible only while fewer than 3 outer Patches are held.
6. An `uprising` against a Goofball's Patch is declined (that resident never simmers).

**Motives** (Nemesis's list, TE-X7). Territory adds the resolution effect:

| Motive | `motive_mod` | Raid party (escorts are untracked Strays) | Counter (§3.6) | Effect at resolution |
|---|---|---|---|---|
| `grudge` | 1.15 | leader + 1 escort | Goofball | If the posted Sentry has an Old Score with the leader, its term ×1.25 |
| `boss_orders` | 1.10 | leader + 2 escorts | Stalwart | — (three attackers) |
| `gloat` | 1.00 | leader alone | Braggart | Never Lost (worst case Scuffed): it is showing off |
| `pretender` | 1.10 | leader + 1 escort | Schemer, Brooder | If Lost, the leader becomes the Patch's Keeper (Nemesis) |
| `uprising` | 1.00 | the Humbled resident alone | Goofball (declined) | `scent_term = 0` (an inside job); a posted Sentry defends as normal. **It uses the night's single raid slot** |

**Resolution order (step 2):** Scent decay and refresh → upkeep → resolve tonight's raid (an uprising is tonight's raid, not a separate sub-step) against the **post-decay** Scent and the Sentries posted tonight. The forecast names a Patch, not a guard, so moving cats after reading the Sniff is the point.

**Outcomes** (formula in §4.5):

| Outcome | Scent | Sentry | Patch | Tribute tonight from that Patch |
|---|---|---|---|---|
| **Repelled** | −5 | Unharmed; Crew logs a defence | Held | Paid |
| **Scuffed** | −20 (Anchor −10) | Routed-for-a-night (not Brooder; Fraidy bolts) | Held | **Stolen, twice over**: the raid leader carries off `loot_held` = **2 × the Patch's Tribute** (its own pay, plus the same again off the Doorstep pile) |
| **Lost** | Flips to the attacker at 40 | Returns to the Lot | Attacker's Clowder | None, and the raiders also carry off `loot_held` = 2 × the Patch's Tribute |

- **Strong rule (DR-46):** if the Patch's Scent is ≥ 60 at resolution, Lost becomes Scuffed.
- **Den-Open rule:** while the Den is Open, Lost becomes Scuffed on outer Patches.
- **Thief rule (DR-46):** Routing a raid leader who holds `loot_held`, in any daytime fight within 3 days, returns the Morsels in full to the field haul (the leader's trail glows in Whisker Sense). After 3 days the loot is eaten. Nothing else is lost.
- **Mark Over** (Nemesis §3.10; a Brooder victor's Gloat after a Posse wipe; Daifuku is a Brooder): **−30 Scent** on Mikan's nearest held **outer** Patch at once (Low Wall Corner never below 10). It requests no raid. A Patch it drops below 60 gets the Spray prompt and thin wisps like any other.
- **Snatch** (Nemesis §3.10; a Schemer victor's Gloat): the wipe's lost 20% of the field haul becomes `loot_held` on the victor, returned in full by Routing it within 3 days (the thief rule).
- **Retake = revenge (DR-46):** a Lost Patch is in **Stale Claim**. Entering it skips erosion and waves and triggers a Standoff with the raid leader. Rout → Verdict → Claim Spray. It takes 60–90 s.

### 3.8 The Caterwaul (live raid)

- If Mikan is **roaming during Night** (from the cat flap) when a forecast raid is due, it fires live at a seeded time in that Night as a **Caterwaul**: a yowl in the posted Sentry's voice (generic for Unwatched), a plume on the skyline, a ring around the scent compass, and a corner HUD marker. At most 1 per night; the Lane only (DR-17).
- **Window:** 120 s of roaming clock (the clock pauses in combat and menus, so the window pauses too). ×1.5 for a Crier or a Fraidy (×2.25 with both), +30 s on a High Perch Patch; cap 240 s. A Fraidy also moves the fire time to the first seconds of Night.
- **Arrive in time:** `EncounterStarted(opener = raid_defence)`. The posted Sentry joins as an AI guest within the 10-combatant cap (proposal to Combat). **Win:** Repelled *in person*: Scent **+10** instead of −5, plus a Verdict on the raid leader if it is a Rival (one Verdict per fight). **Lose:** canon wipe rules, then the raid auto-resolves as if Mikan had been asleep.
- **Ignore, go home, or miss the window:** the raid auto-resolves in step 2. **Ignoring a Caterwaul is never worse than being asleep.**
- Night pays no Morsels (canon). The rewards of a defence are the Verdict, Old Scores and Rival memory.

### 3.9 Tribute

1. **Per Patch** (step 4): `patch_tribute` (§4.2) for every held Patch, after tonight's raids.
2. **Seen** (§4.3), tracked **per Patch**: a Patch is seen if Mikan Rubbed or Sprayed there, or won a fight there, within the grace period. Full pay for 2 days after the last visit, then −20% a day, down to 0 (floor 0). Sentries do not count as a visit. "The district is seen" (Crew's Loyalty input) means any of its Patches is seen.
3. **Delivery:** `TributeDelivered(amount, by_district)`. The food is a physical pile on the Doorstep, with contents that reflect the Patches (tofu-shop okara, a persimmon, laundry-yard sparrow feathers wrapped round a sardine). Walking onto the Doorstep is the **automatic Tribute pick-up** (daily reset 3 of 3). It moves the Tribute into the Stash and opens the Morning Sniff.
4. **No `rounds`, no time scaling** (TE-2). Going home early, sleeping early, or losing a fight never changes Tribute. Only `seen` and Scent do.
5. **Life 1** pays Tribute (it is the hook). No raids happen in Life 1.

**Other Morsel sources:**
- **Field haul:** loot per Routed enemy in **daytime** fights (§4.7), carried until Mikan enters the garden, then Stashed. A wipe loses 20% of it (none in Life 1). Night fights pay no Morsels.
- **Caches:** 6 hidden one-time finds in the Lane (a dropped fish, a tipped bin), shown by the Whisker Sense compass, 10 Morsels each. They do not reseed (DR-18).
- No feeders, no daily scraps, no per-cat meals (DR-18 cuts).

**Shinies (slice):** 3 fixed one-time finds on Night rooftops, kept at the Stash. They have **no slice sink**: their sink (Rank III+ Lessons) is Backlog. There are only 3, they never accumulate, and they have no economic effect. They exist so the Night has its canon reward.

### 3.10 Clout (slice: milestones only; points cut, TE-10.1)

| Rank | Milestone | Sentry slots (full game → slice) | Crew cap (full → slice) |
|---|---|---|---|
| House Pet | start | 1 → 1 | 6 → 6 |
| Lane Cat | hold your first Patch | 2 → 2 | 7 → 6 |
| Known Face | hold 3 Patches | 3 → **2** | 8 → 6 |
| Boss | claim Hidamari Lane | 4 → **2** | 9 → 6 |

Rank never drops. The slice clamps follow DR-01 (2 Sentry slots, Crew cap 6). Rank changes are announced in the Sniff, Rivals react to them (Nemesis: "Collar" taunts stop at Known Face), and the Fence Line shows Mikan's place.

### 3.11 The Stash

- Mikan's Morsel bank under the veranda. **Capacity 400** in the slice (Lot upgrades are cut).
- Tribute and the field haul go in automatically. What does not fit stays on the Doorstep as **Leftovers** and is gone at the next morning's delivery: a baffled Haru sweeps it away (a Narrative staging hook; nothing is refunded). In the reference play the cap is never reached; a pure hoarder reaches it on day 7 (§4.11).
- **The Stash is always safe** (canon). Spending happens only at the Lot (Lessons, Share a Morsel) and at a Verdict (a Bribe is paid from the Stash; fair and feast are greyed if the Stash is short; "none" is always available, PP-12).
- **No food enters the house before Life 8** (DR-23). The Doorstep is outside.

### 3.12 Teaching order (Territory items; UX owns the beat sheet)

| Day | Life/day | Territory beat |
|---|---|---|
| 1 | L1 D1 | Low Wall Corner short escalation (PP-03; its Keeper is an untracked Stray), the Claim Spray, wisps. The first Tribute lands on the day-2 Doorstep |
| 2 | L1 D2 | Togemaru, the First Thorn, at Laundry Pole Yard's gatepost (its own post); a normal contest; Doorstep and the 1-item Sniff |
| 3 | L2 D1 | Persimmon Alley take (3 outer Patches held: **the Den opens**). The rescue Spray (Low Wall Corner and Laundry Pole Yard have dropped below Strong overnight). No posting yet |
| 4 | L2 D2 | **First forecast raid** in the Sniff (scripted from the arc lead). **Sentries and the Turf Board**, first taught as the answer to that forecast: one posting decision, on the forecast Patch (PP-11). Cat flap (K2.3 at Dusk) and the **first Caterwaul** that Night |
| 5 | L2 D3 | **Lessons** open at the Lot. Tofu Shop Step take (Captain Kagi) |
| 6+ | L2 D4+ | The full loop: forecast → post → rescue Spray → Night or home; the Den |

UX owns the beat sheet (`ux/key-screens.md` §7.4, presentation review ruling): one headline per day, with Sentries and the Turf Board on Life 2 day 2 and Lessons on Life 2 day 3.

### 3.13 Interactions summary

Territory consumes `EncounterEnded` (loot, `seen`, Routs inside a contested Patch), `VerdictApplied` (`chase`/`humble`/`recruit`/`nose_snub` → Patch Open; `nose_accept` → truce; Humbled resident), `RaidRequested`, `WallEvent` (Keeper changes), `BetrayalTriggered` (not reachable in the slice), `PhaseChanged`/`DayEnded`. It emits `PatchChanged`, `RaidResolved`, `DistrictClaimed` and `TributeDelivered`. It queries `PowerRating(cat_id)` and `Loyalty(cat_id)` from Crew.

---

## 4. Formulas

All values are tuning starts (see §7). Rounding: Scent is an integer (decays floor-rounded); Tribute is summed, then floored; loot rounds half up.

### 4.1 Nightly Scent (player-held Patch, step 2)

```
decay   = floor( (base_decay + border × rival_neighbours) × home_mult × brooder_mult )
refresh = sentry_refresh   if Watched, else 0
scent'  = clamp( scent − decay + refresh, floor, 100 )        then raid outcome
```

| Variable | Value / range | Meaning |
|---|---|---|
| base_decay | 10 | Lost per night |
| border | 2 | Per adjacent Patch held by a rival Clowder (0 for a truce Patch) |
| rival_neighbours | 0–3 | From §3.1 |
| home_mult | 0.5 LWC, else 1 | Home Ground |
| brooder_mult | 0.5 with a posted Brooder, else 1 | — |
| sentry_refresh | 10; Crier 14; 0 if Routed-for-a-night | — |
| floor | 10 LWC, else 0 | At 0 the Patch lapses to Open |

**Range:** −16 to +6 per night. **Examples:**
- A fresh claim (70), Unwatched, two rival neighbours: −14 → 56. **It drops below Strong after one night**, so a frontier claim wants a Sentry or a rescue Spray the next day.
- Watched, one rival neighbour: −12 + 10 = −2 a night. From 90 it takes 15 nights to drop below Strong.
- Unwatched, no rival neighbours, from 90: 80, 70, 60, then 50 on night 4 (below Strong).
- Rival-held: `S_r' = min(ceiling, S_r + 8)`. Ceilings: outer 80, Den 100, Stale Claim 60 for 3 nights.

### 4.2 Patch Tribute (step 4)

```
patch_tribute = base_yield × band_mult × watch_mult × (1 + min(bonus, 0.35) − clash)
bonus         = braggart + humbled + full_house
clash         = 0.10 per clashing Sentry posted on an adjacent Patch (§3.6), else 0
```

| Variable | Value | Source |
|---|---|---|
| base_yield | 8 / 10 / 12 / 14 / 18 | §3.1 |
| band_mult | 0.6 / 0.9 / 1.0 / 1.0 | Faint / Clear / Strong / Pungent (TE-9 shape) |
| watch_mult | 1.0 Watched · 0.8 Unwatched | §3.6 |
| braggart | 0.10 | Braggart posted |
| humbled | 0.15; 0.25 with a Goofball posted | One Undermark crate per Patch (DR-42) |
| full_house | 0.10 | All 5 Lane Patches held |
| clash | 0.10 per clashing posted neighbour | §3.6 (outside the clamp) |

A Scuffed Patch pays 0 tonight and loses the same again off the pile (`loot_held` = 2 × `patch_tribute`, §3.7); a Lost Patch pays nothing and also loses 2 × its `patch_tribute`. The night's total never goes below 0.
**Range per Patch:** 3 (LWC, Faint, Unwatched) to 24 (Den: Strong, Watched, Full House + Goofball-Humbled, at the 0.35 clamp: `18 × 1.35 = 24.3`).
**Example:** Tofu Shop Step, Strong, Braggart posted, Full House: `14 × 1.0 × 1.0 × 1.20 = 16.8`.

### 4.3 Seen and the nightly total

```
seen_p   = 1.0                                        if days_since_visit_p ≤ grace
         = max(0, 1.0 − step × (days_since_visit_p − grace))   otherwise
tribute  = floor( Σ_p  seen_p × patch_tribute_p )
```

grace = 2, step = 0.20, floor 0 (DR-46, TE-3). A Patch unvisited for 2 days still pays in full; then it pays 0.8, 0.6, 0.4 and 0.2, then nothing. **A total of 4 days' pay after the last visit**, while its Scent decays to lapse.

### 4.4 Upkeep

`upkeep_night = 2 × posts_filled` (Lane, `2 × district_index`). It is paid in step 2; any post the Stash cannot cover gets Short Rations (`guard_mod × 0.8`). Range in the slice: 0–4 per night.

### 4.5 Raid auto-resolve

```
attack      = motive_mod × Σ PR(raiders)
sentry_term = home_adv × PR(sentry) × style_mod × guard_mod × counter × pair × rations × old_score / attack   (0 if Unwatched)
scent_term  = 0.005 × scent                         (0 for an uprising)
R           = sentry_term + scent_term + fixed_bonus
p_hold      = clamp( R³ / (R³ + 1), 0.05, 0.95 )
u           = rng(save_seed, day_index, step=2, "territory", patch_id, 0)
outcome     = Repelled if u < p_hold² ; Scuffed if u < p_hold ; else Lost
              then: Lost → Scuffed if scent ≥ 60, or the Den is Open (outer), or motive = gloat
```

| Variable | Value | Notes |
|---|---|---|
| PR(x) | Crew's `PowerRating` | Only ratios matter |
| home_adv | 1.5 | A cat on its own wall |
| style_mod | Bruiser 1.25 · Scrapper 1.10 · Yowler 1.00 | §3.6 |
| guard_mod | Stalwart 1.5 · Braggart 1.25 · Brooder/Schemer/Goofball 1.0 · Fraidy 0.75 | §3.6 |
| old_score | 1.25 if `grudge` and the Sentry has an Old Score with the leader, else 1 | §3.7 |
| counter | 2.0 if the Sentry's personality counters tonight's motive, else 1 | §3.6 |
| pair | 1 + 0.25 × (bonded posted neighbours) − 0.25 × (clashing posted neighbours); range 0.5–1.75 | §3.6 |
| PR(raiders) | Slice assumption, as ratios of a Sentry's PR (Crew owns PowerRating): Tough leader 1.0, Captain leader 1.5, Stray escort 0.6 | Party per motive, §3.7 |
| rations | 1.0; 0.8 on Short Rations | §4.4 |
| fixed_bonus | High Perch 0.15, else 0 | §3.1 |
| motive_mod | 1.0–1.15 | §3.7 |

Loyalty does not enter the formula (DR-11: Loyalty no longer affects stats).

**Worked odds, base case** (no counter, no neighbours; raiders at the Sentry's PR; post-decay Scent 50, Clear, so Lost is possible):

| Sentry | vs 1 raider, `grudge` (attack 1.15) | vs 2 raiders, `boss_orders` (attack 2.2) |
|---|---|---|
| Unwatched | R 0.25 → Rep 0% · Scuff 5% · **Lost 95%** | same |
| Fraidy Yowler | R 1.23 → 42 / 23 / 35 | R 0.76 → 9 / 21 / **69** |
| Goofball/Schemer/Brooder Scrapper | R 1.69 → 68 / 14 / 17 | R 1.00 → 25 / 25 / 50 |
| Braggart Scrapper | R 2.04 → 80 / 9 / 11 | — |
| Stalwart Bruiser | R 2.70 → **90 / 5 / 5** (clamped) | R 1.53 → 61 / 17 / 22 |

Arithmetic (Stalwart Bruiser, single raider): `1.5 × 1.25 × 1.5 / 1.15 = 2.445`; `+ 0.25 = 2.695`; `R³ = 19.57`; `p = 0.951 → 0.95`; Repelled `0.95² = 0.9025`.
**If the same Patch had been Sprayed that morning** (Scent 80 after decay), every Lost becomes Scuffed. The rescue Spray removes the risk of losing the Patch. Only a good Sentry turns Scuffed (stolen Tribute, a Routed cat) into Repelled. **That split is the daily decision:** Spray decides whether you can lose the Patch; the cat decides whether you lose the night.

**Worked odds with counters (iteration 3).** An illustrative Life 2 night after Kagi has joined: a Strong Patch at 64 after decay is forecast. `grudge`, a Tough + 1 escort: `attack = 1.15 × 1.6 = 1.84`.
- Hige (Stalwart Bruiser): `1.5 × 1.25 × 1.5 / 1.84 = 1.53`, `+ 0.32 = 1.85` → p 0.86, **Repelled 75%**.
- Pon (Goofball Yowler, the counter): `1.5 × 1.0 × 1.0 × 2.0 / 1.84 = 1.63`, `+ 0.32 = 1.95` → p 0.88, **Repelled 78%**, and Hige is free for the Posse.
- Under `boss_orders` (a Tough + 2 escorts, `attack = 1.1 × 2.2 = 2.42`) the order flips back: Hige (counter) `2.32 + 0.32` → p 0.95, Repelled 90%; Pon `0.62 + 0.32` → p 0.45, Repelled 21%.
- Put Togemaru on Persimmon Alley next door to Pon (bonded, `pair` 1.25 each) and Pon's grudge defence rises to `2.04 + 0.32` → p 0.93.

**What the decision is worth** (round-3 sim `design/reviews/round-3/sim/posting_stakes_sim.py`, 2,000 seeds; engaged reference player; one raid every night from night 4; posts from night 4):

| Posting policy | Tribute, days 1–7 | Tribute, raid nights 4–7 | Scuffed nights | Lost nights | Night-6 Tribute |
|---|---|---|---|---|---|
| Best: reads the forecast, counters the motive, minds the neighbours | 225 | **184** | **0.53** | 0 | 60.8 |
| Habit: Stalwart on the forecast, Braggart on the richest | 218 | 177 | 0.83 | 0 | 58.2 |
| Random: 2 cats on 2 Patches | 169 | **128** | **2.50** | 0.26 | 41.3 |
| No posts | 129 | 88 | 3.99 | 0 | 32.1 |

Posting well beats posting at random by **+34% over the slice and +45% on raid nights** (round-2 rules: +15% / +19%; the round-2 review measured ≈ 11%), and beats not posting by +109% on raid nights. The habit answer is no longer always right: it trails the best posting by 4% and takes 57% more Scuffed nights, because the best guard changes with the motive (sim: `grudge` → Pon, `boss_orders` → Hige, `gloat` → Hige or Togemaru, `pretender` → Kagi).

### 4.6 Caterwaul window

`window = min(240, 120 × crier × fraidy + perch)` seconds of roaming clock, where crier = 1.5 if a Yowler is posted on the Patch, fraidy = 1.5 if a Fraidy is posted, and perch = 30 on a High Perch. Examples: plain 120 s; Fraidy Yowler on Laundry Pole Yard `120 × 2.25 + 30 = 300 → 240`.

### 4.7 Field haul (daytime fights only)

```
loot  = round_half_up( rank_mult × (1 + 0.5 × L) )
belly = 12 × (1 + 0.5 × L_mikan)     # Stray/Tough/Critter loot past this, today, pays ×0.25
```

rank_mult: Critter 0.5 · Stray/Tough 1 · Captain 4 · Boss 10. The first Rout of a named Captain or Boss is exempt from Full Belly. The same Rival Routed again today pays ×0.25.
Worked values: Lv 1 Tough 2 · Lv 4 Tough 3 · Lv 8 Tough 5 · Lv 6 Captain 16 · Daifuku (Lv 8) 50. Full Belly at Mikan Lv 2: 24; at Lv 8: 60. A grinder therefore gains at most about 25% over a normal day's haul, and the 12–16 min clock bounds it further.

### 4.8 Price sheet (one sheet, DR-14; TE-X2, TE-X3, TE-X4)

| Item | Price | Slice notes |
|---|---|---|
| Lesson | Rank I **40** · Rank II **120** · (III 300 · IV 600 Backlog); ×1.5 cross-Style (60 / 180) | Lessons I–II only. Mikan learns up to 3 a day, others 1 (DR-38) |
| Bribe (recruit) | none · **fair = 8 × level × rank_mult** · feast = 2 × fair; rank_mult Stray 0.75 · Tough 1 · Captain 2 · Boss 4 | Paid from the Stash at the Verdict. **Life 1 recruits are free.** Story recruits and the Friend Stray cost nothing |
| Share a Morsel | **Σ Crew levels**, once a day, whole Crew, +2 Loyalty | Daily reset 1 of 3 |
| Upkeep | 2 per post per night | Auto |

Examples: a Lv 6 Captain costs 96 fair / 192 feast; Daifuku at Lv 8 costs 256 / 512; a Crew of levels 8+7+7+7+8 costs 37 to Share.

### 4.9 Stash

`stashed = min(incoming, 400 − stash)`; `leftovers = incoming − stashed`, which rot at the next delivery. `stash ≥ 0` always: no purchase is allowed below 0, and upkeep degrades to Short Rations instead.

### 4.10 Patch level (TE-X14)

`patch_level = floor((band_lo + band_hi) / 2)` of the district's level band: Lane (1–8) **4**. Full game: Arcade 13, Shiosai 23, Summit 29. Crew's Turf XP reads it.

### 4.11 The slice economy, day by day (reference player)

**Reference player.** Plays every day to the clock, goes home by Dusk except on the cat-flap night, Shares a Morsel daily, buys 3 Lessons, Bribes the Captain (Kagi) at fair, Humbles Daifuku and recruits the First Thorn (Togemaru) on day 2 (free). Claim path (Day Loop §3.9, Nemesis §3.1): Low Wall Corner (day 1), Laundry Pole Yard by Routing Togemaru (day 2), Persimmon Alley (day 3, the Den opens), Tofu Shop Step from Kagi (day 5), the Den (day 6).

**Assumptions** (flagged to the owners):
- Crew levels (Crew owns): Posse level at Daifuku is 7–9.
- Daytime Routs: 8 on day 1, 10 a day after that.
- One cache a day on days 2–5.
- The Den falls on day 6 (Life 2 day 4, the fast path). K2.5 plays that morning (Narrative §3.3), so the Life ends at that night's sleep and the night-6 pile is computed for the title card. **Day 7 below is an extra day** for a player whose Den falls a day later (Day Loop's reference wins it on Life 2 day 5 after one wipe); it also shows the post-claim shape of the full game.
- The Sentries are Crew §3.3's cats: **S1 = Hige** (Stalwart Bruiser) and **S2 = Togemaru** (Braggart Scrapper). Sentries are taught on day 4 (§3.12), so nothing is posted on night 3.

**Scent and posting, night by night** (the Scent shown is after decay and raids):

| Night | Held | Posts (night) | Raid (forecast that morning) | LWC | LPY | PA | TSS | DEN | Tribute computed |
|---|---|---|---|---|---|---|---|---|---|
| 1 | LWC | — | — | 63 | r | r | r | r | **6** |
| 2 | +LPY | — | — | 57 | 56 | r | r | r | **12** |
| 3 | +PA (Den opens) | — (taught tomorrow) | — | 85 (Sprayed) | 78 (Sprayed) | 58 | r | r | **23** |
| 4 | 3 | Hige @PA | Arc lead + 1, `grudge` → PA (Sprayed to 90) → Repelled | 80 | 66 | 83 | r | r | **26** |
| 5 | +TSS | Hige @LPY, Togemaru @TSS | Tough + 2, `boss_orders` → LPY → Repelled | 75 | 59 | 73 | 68 | r | **40** |
| 6 | +DEN (claimed) | Hige Warden @DEN, Togemaru @TSS | Tough alone, `gloat` → TSS → Repelled (Togemaru, a Braggart, counters a gloat: p 0.95) | 70 | 80 (Sprayed) | 63 | 63 | 70 | **65** |

Tribute arithmetic:
- **Night 1:** `8 × 1.0 × 0.8 = 6.4` → 6.
- **Night 2:** LWC `8 × .9 × .8 = 5.76`; LPY `10 × .9 × .8 = 7.2` → 12.96 → 12.
- **Night 3:** LWC 6.4; LPY `10 × 1.0 × .8 = 8` (Strong, Unwatched); PA `12 × .9 × .8 = 8.64` → 23.04 → 23.
- **Night 4:** LWC 6.4; LPY 8; PA 12 → 26.
- **Night 5:** LWC 6.4; LPY `10 × .9 = 9` (Watched, Clear after the Repelled −5); PA 9.6; TSS `14 × 1.1 = 15.4` → 40.4 → 40. (Hige and Togemaru are not neighbours, so no pair effect.)
- **Night 6 (Full House):** LWC `8 × .8 × 1.1 = 7.04`; LPY `10 × .8 × 1.1 = 8.8` (rescue-Sprayed that morning); PA `12 × .8 × 1.1 = 10.56`; TSS `14 × 1.2 = 16.8`; DEN `18 × 1.25 = 22.5` (Humbled Daifuku; Hige and Togemaru on the adjacent Den and TSS are neutral) → 65.7 → **65**. (LPY, raided last night, and the Den, claimed today, are not admissible, so tonight's raid goes to TSS.) That is the end-of-Life-2 anchor: canon ≈ 60, +8%, inside 54–66.

Raid odds:
- **Night 4:** `grudge`, the arc lead + 1 escort: `attack = 1.15 × 1.6 = 1.84`; `sentry_term = 1.5 × 1.25 × 1.5 / 1.84 = 1.528`; `+ 0.005 × 88 = 1.968`; `p = 0.884`. Repelled 78%, otherwise Scuffed (PA is Strong and the Den is Open). The motive shows "?" (no Schemer yet); Pon, the counter, would have given Repelled 81%.
- **Night 5:** `boss_orders`, a Tough + 2 escorts: `attack = 1.1 × 2.2 = 2.42`; Hige counters it: `1.5 × 1.25 × 1.5 × 2.0 / 2.42 = 2.324`, `+ 0.005 × 64 + 0.15` (High Perch) `= 2.794`; `p = 0.95` (clamped). Repelled 90%.

**Stash, day by day.** Tribute arrives at the morning Doorstep; Share and Lessons are bought at the Lot; the Bribe is paid at the day's Verdict; the field haul and caches arrive at the garden; upkeep is taken that night.

| Day | Life | Doorstep Tribute | Share a Morsel (Crew levels) | Lessons / Bribes | Field haul | Cache | Upkeep | **Stash (end of day)** |
|---|---|---|---|---|---|---|---|---|
| 1 | L1 D1 | 0 | — | — | 14 | — | 0 | **14** |
| 2 | L1 D2 | 6 | −3 (3) | Thorn: free (Life 1) | 25 | 10 | 0 | **52** |
| 3 | L2 D1 | 12 | −10 (4+3+3) | Friend Stray: free | 30 | 10 | 0 | **94** |
| 4 | L2 D2 | 23 | −17 | Lesson I −40 | 35 | 10 | −2 | **103** |
| 5 | L2 D3 | 26 | −21 | Captain fair −96 (Stash 108 at the Verdict ≥ 96 ✓) | 56 | 10 | −4 | **74** |
| 6 | L2 D4 | 40 | −32 | Lesson I −40; Daifuku Humbled (free) | 90 | — | −4 | **128** |
| 7 | L2 D5 (extra day) | 65 | −37 | Lesson II −120 | 50 | — | −4 | **82** |

Field haul: day 1 is 2 crows (1 each) + 6 × 2 = 14. Days 2–4 are 10 Routs at 2.5 / 3 / 3.5 average. Day 5 is 40 + the Captain's 16. Day 6 is `5 × 4 + 4 × 5 = 40` + Daifuku's 50 = 90. Day 7 is 10 × 5.

**Totals (to the end of day 7):** income = Tribute 172 + field 300 + caches 40 = **512**. Sinks = Share 120 + Lessons 200 + Bribe 96 + upkeep 14 = **430**. 512 − 430 = **82** ✓. For the fast path the slice ends after day 6 with a Stash of **128**.

Night 7 (computed, not delivered) is illustrated in §4.12.

**What this does to pacing.**
- A Rank I Lesson costs 1.6 days of Tribute on day 4. A Rank II costs 1.9 days on day 7.
- The Captain's fair Bribe is almost the whole day-5 Stash. **A player who also bought a day-5 Lesson cannot afford it** (108 − 40 = 68 < 96) and must choose: Lesson or a loyal Captain ("none" is still offered).
- Daifuku's fair Bribe (256) is out of reach for the reference player. It needs a saver, or "none" at a lower starting Loyalty. Both are real choices.

**Other player types (same world assumptions):**

| Player | Policy | End Stash | What it shows |
|---|---|---|---|
| Reference | above | 82 | Every sink used; the anchor is met |
| Hoarder | no Share, no Lessons, Bribes "none" | **400 (cap) on day 7; ≈ 100 rots** (cumulative ≈ 386 by the end of day 6; day 7 adds 65 + 50) | The cap binds only on pure hoarding, and the pile rots visibly |
| Casual | home by Dusk, field ×0.75, one post, no rescue Sprays (Tribute ×≈ 0.85) | ≈ 160 after Share on alternate days, 2 Lessons, Captain "none" | Slower, never stuck |
| Struggler | wipes every Life 2 day (field ×0.8 on fewer fights ≈ ×0.6), never posts | ≥ 0 always; Tribute ≥ Home Ground floor (`8 × .6 × .8 = 3.8`/day) | No death spiral (§4.13) |

### 4.12 Night 7: the daily decision in numbers

*An extra day (§4.11): the fast-path Life ends on night 6, so this is the shape of every post-claim morning in the full game, and of day 7 for a player whose Den falls on day 7.*

Morning of day 7: the forecast says a Captain alone (PR 1.5× a Sentry's) is coming for **Persimmon Alley**, which is at 63 and Unwatched; tonight's decay takes it to 53 (Clear). Kagi is posted nowhere, so the motive shows "?". One portrait, a Captain who was a Keeper: the player guesses `pretender` (it is). The Den is claimed, so **Lost is possible again**. PA is at 63, so no rescue Spray is offered: the answer is a cat. `attack = 1.1 × 1.5 = 1.65`.

| Option | PA outcome | Night-7 Tribute (expected) | Other stakes |
|---|---|---|---|
| A: do nothing | Unwatched at 53: **Lost 95%** (the pretender becomes Keeper; Full House ends; `loot_held` 2 × 9.5) | ≈ 32 | Revenge Standoff tomorrow |
| B: move Togemaru (Braggart Scrapper) from TSS to PA | Watched, 63 at resolution, so never Lost. `1.5 × 1.1 × 1.25 / 1.65 + 0.32 = 1.56` → p 0.79: Repelled 63%, Scuffed 37% | ≈ 53 | TSS goes Unwatched and Clear |
| C: Kagi (Schemer, counters `pretender`) on PA in Togemaru's place | `1.5 × 1.0 × 2.0 / 1.65 + 0.005 × 67 = 2.15` → p 0.91: **Repelled 83%** | **≈ 58** | Kagi out of the Posse; the motive is shown from now on |
| C′: Kagi on PA, Togemaru stays on TSS, Hige leaves the Den | As C; the Den goes Unwatched (Kagi, at Loyalty 40–45, cannot be Warden) | ≈ 59 | Daifuku's old wall unguarded; Hige back in the Posse |
| D: Kinako (Fraidy) on PA beside Togemaru | Clashing neighbours: `pair` 0.75 each and both Patches −10%. p 0.40: Repelled 16% | ≈ 46 | The tempting "spare cat" is the worst post |
| E: C + go out at Night and answer the Caterwaul | Repelled in person (+10 Scent), a Verdict on the Captain | ≈ 66 + a Verdict | Gives up the evening at home (no penalty) |

The spread from the worst sensible post (D) to the best (C′) is ≈ 13 Morsels on a ≈ 60 night, and doing nothing costs ≈ 27 plus a Patch. The right cat depends on the motive, on who is next door and on who the Posse needs, and the player can read all three from the Sniff and the Turf Board in under a minute at the Lot.

### 4.13 Exploit and death-spiral checks (DR-57)

- **Sleep-skip** (sleep at wake, never go out): every Patch pays in full for 2 days, then 0.8 / 0.6 / 0.4 / 0.2, then 0. Total ≤ **4.0 × daily Tribute**, while unwatched Scent lapses and raids take the frontier. **Steady state 0** (LWC's seen also decays). No Clout, XP, Crew or story progress: Life 2 cannot end without the claim, so the house sits in its Plateau.
- **Rub-skip** (step outside, Rub Low Wall Corner, go home: about 1 min): only LWC stays seen. By the 7th skip day Tribute is at most LWC's `8 × 0.6 × 0.8 ≈ 4`/day. Per-Patch `seen` closes the one-district loophole that per-district `seen` would leave open.
- **Patrol-skip** (Rub all five Patches, rescue-Spray, go home: about 3 min): full Tribute (≈ 60) but no field haul (≈ 50), no XP, no Crew. This is legitimate management play, not an exploit. Morsels are not the slice's bottleneck (sinks are finite: Lessons I–II, 2–3 Bribes, Share), and the Stash cap of 400 turns hoarding into rot.
- **Wipe-skip:** deleting `rounds` removed the exploit (TE-2). A wipe never changes Tribute, costs 20% of the field haul, −3 Loyalty per Routed Posse cat (Crew) and a Rival promotion. Walking home is free. **Wiping is strictly dominated by walking home.**
- **Death spiral:**
  - No debt.
  - The Stash is always safe.
  - Home Ground can never be lost or raided (Tribute floor ≈ 4/day).
  - The Den-Open rule prevents losses while the player pushes for the claim.
  - The Strong rule means a Patch falls only after a visible warning night (thin wisps, Spray prompt, forecast).
  - A Lost Patch comes back in one 60–90 s revenge Standoff.
  - Field haul does not depend on territory.
  - Each wipe against Daifuku leaves him −10% max Nerve (canon).
  - The worst case is "slower", never "stuck".

---

## 5. Edge Cases

| Situation | Resolution |
|---|---|
| A raid is requested on a Patch the player loses or retakes before it resolves | Lost before it resolves: declined. Retaken today: immune, declined |
| A raid is requested on a Strong Patch | Admitted; worst case Scuffed. The Sniff still forecasts it, because the Sentry choice still matters |
| The player moves the Sentry away from the forecast target | The raid resolves against tonight's actual posts. The forecast names the Patch, never the guard |
| Two Patches are forecast | Cannot happen in the slice (≤ 1 per district per night). If Nemesis sends more, Territory keeps the one against the lowest Scent and declines the rest |
| Caterwaul fires during a fight, Standoff or menu | The window counts roaming clock only, so it waits |
| The raid's seeded time falls inside a Sunspot nap's skipped half-phase | Auto-resolves (never worse than asleep) |
| Mikan goes home, or is Routed elsewhere, during the window | Auto-resolves by formula |
| Wipe during a raid defence | Canon wipe costs, then auto-resolve as if absent. The defence never makes the outcome worse |
| Stash short of upkeep | Uncovered posts get Short Rations (`guard_mod × 0.8`); no debt |
| Stash short at a Verdict | Fair and feast greyed; "none" always available; feast never breaks the 0 floor |
| Stash full | Overflow stays on the Doorstep as Leftovers; gone next morning |
| Scent reaches 0 | Lapse: Patch Open, `PatchChanged(new = none)`, Sentry to the Lot. A rival may move in during step 3 (Nemesis) |
| Low Wall Corner | Never below 10, never admissible, never Lost, never taken by a traitor |
| Patches claimed in another order | Allowed. Any 3 outer Patches open the Den |
| Den held, then outer holdings drop below 3 | The Den becomes admissible to raids; the Life goal stays met |
| Nose-Touch **snubbed** (`nose_snub`) | The Keeper bolts with no truce. The Patch is **Open** (`S_r = 0`): Claim Spray it, as after a Chase Off |
| Nose-Touch accepted on a Keeper | The Patch stays rival for a 5-day truce: no erosion, no border pressure, not counted toward the Den. Afterwards Regard ≥ 75 → the Keeper yields with a nose (Patch Open, Claim Spray); otherwise a normal contest that adds no Grudge (DR-42) |
| Humble offered where the Patch would not become the player's | Not offered (DR-46) |
| `uprising` on a Goofball's Patch | Declined at intake |
| `uprising` resolution | `scent_term = 0`; a posted Sentry defends. Lost hands the Patch to the resident's old Clowder. The uprising is that night's single raid; no other raid resolves |
| Mark Over after a wipe | −30 Scent at once on the nearest held outer Patch (ties: lower Scent first); Low Wall Corner never below 10; a Patch it drops to 0 lapses to Open. No raid is requested |
| Snatch after a wipe | The lost 20% of the field haul is `loot_held` on the victor for 3 days (thief rule). Nothing is lost in Life 1, so there is nothing to Snatch |
| A counter cat is also a clashing neighbour | Both apply: `counter` 2.0 × `pair` 0.75 (and −10% Tribute on both Patches). The Turf Board preview shows the combined odds |
| Bonded neighbour Routed-for-a-night, or a post left empty | No neighbour effect from that Patch tonight |
| Raid-night total would go below 0 (2× loot on a small night) | Floored at 0; nothing is taken from the Stash (the Stash is always safe) |
| Thief's `loot_held` and the thief is recruited | The loot returns to the Stash at the Verdict |
| A Sentry is Routed-for-a-night | The Patch is Unwatched next night; the cat resumes the night after |
| The Warden's Loyalty falls below 60 | It stays; it simply cannot be re-posted to the Den until True again |
| Only one Crew cat, and the player posts it | Allowed, with a Turf Board warning: "Mikan fights alone" (no Pile-On) |
| A Brooder is moved off a post | Allowed; Territory raises `dismissed_from_post` (Crew applies the dislike) |
| `BetrayalTriggered` (unreachable in the slice, DR-10) | The post is vacated; if that leaves the Patch Unwatched, it flips to the traitor's Clowder at 40 (not LWC) |
| Tribute on the night of the claim | Computed in step 4; the slice ends at the Life-end check (step 5). The title card shows the pile |
| Reload during the day | Raid and outcome rolls are counter-seeded (DR-13), so a reload reproduces them |

---

## 6. Dependencies

| System (doc) | Territory needs | Territory provides |
|---|---|---|
| **Nemesis** (`nemesis-system.md`) | `RaidRequested` (one every night from night 3 when admissible, ≤ 1 per district; scripted first raid requested on night 3 from the arc lead; motive and party per §3.7); Keepers per Patch (LWC an untracked Stray, LPY Togemaru, PA Tough seat 1, TSS Kagi, Den Daifuku); `VerdictApplied` (incl. `nose_snub`); Mark Over and Snatch triggers; Humble simmer and Restless; truce state; wall events; personality per cat | `RaidResolved`, `PatchChanged`, `DistrictClaimed`; admissibility rules; Back Door Feature for targeting; `loot_held` |
| **Crew & Progression** (`crew-and-progression.md`) | `PowerRating`, `Loyalty`, personality; the bond/clash matrix (§3.2, read for the neighbour rule); Loyalty formula; Bribe tiers and starting Loyalty; Sentry XP; bonded/clashing effects | Per-cat night report (`posted`, `nights_posted`, `district_seen`, `raid_outcome`, `routed`, `dismissed_from_post`); price sheet; `patch_level` = 4; slot and cap clamps |
| **Combat** (`combat-system.md`) | Turf-wave encounters; `raid_defence` opener; a posted Sentry as an AI guest (proposal); `EncounterEnded` | Encounter requests (patch_id, waves, Den flag) |
| **Day loop** (`day-loop.md`) | Clock pauses; Night from the cat flap; Head Home; Caterwaul reach = current district; daily-reset audit | This doc's resets: Tribute pick-up and Share a Morsel only |
| **Narrative** (`dual-story-progression.md`) | K2.5 day gate (Life 2 day 4 morning, §3.3); the Life-end check; no food in the house before Life 8 | Doorstep pile states; the "Haru sweeps the Leftovers" hook; `TributeDelivered` |
| **UX** (`ux/key-screens.md`, `ux/hud.md`) | Turf Board, Sniff forecast card, Doorstep, Caterwaul HUD marker | The data on them (§3, §4) |
| **Art / Audio** | Scent wisps 1–4 in Clowder colours; landmark posts; pile dressing; Caterwaul yowl in the Sentry's voice body; Spray pop | Band thresholds, events |

**Turf Board spec (for UX):**
- A painted map of the Lane with 5 Patch blobs. Each shows Scent (number and wisps), Watched or Unwatched, last night's Tribute, any Humbled resident, and the forecast stamp (raiders plus motive or "?").
- A Crew strip shows each cat's portrait, personality pose and icon, Loyalty tier, bonded/clashing marks, and greyed eligibility.
- Dragging a portrait onto a Patch previews tonight's **Repelled / Scuffed / Lost bar with percentages** and the Patch's Tribute, including the motive counter (a counter icon when the motive is known) and the ♥/✗ link to any posted neighbour.
- Target: ≤ 1 min at the Lot (DR-16).

**Cross-doc notes:**
1. DR-42 lists "Chase Off: Clout +2", but Clout points are cut (DR-14). Territory treats the +2 as void; Nemesis should drop it.
2. DR-01's 2 Sentry slots against DR-14's Clout table: the slice clamps (§3.10).
3. Crew should confirm that a posted cat counts as **not benched** for the Braggart's dislike.
4. Crew should confirm that "same district" for posted pairs means both posted (§3.6).
5. UX's beat sheet (`ux/key-screens.md` §7.4) owns the teaching order: Sentries and the Turf Board on Life 2 day 2 (day 4), Lessons on Life 2 day 3 (day 5). §3.12 follows it.
6. The round-2 review's `territory_slice_sim.py` and the round-3 `posting_stakes_sim.py` (`design/reviews/round-3/sim/`) encode these formulas; §4.5 and §4.11 cite them. The Turf Board's preview bar must use the same `counter` and `pair` terms.

---

## 7. Tuning Knobs

| Knob | Start | Safe range | Affects |
|---|---|---|---|
| base_yield LWC/LPY/PA/TSS/DEN | 8/10/12/14/18 | ±25% | Tribute anchor (keep the full-hold reference at 54–66) |
| band_mult Faint/Clear/Strong/Pungent | .6/.9/1/1 | Faint .4–.7 | Cost of neglect |
| watch_mult Unwatched | 0.8 | 0.6–0.9 | Pay value of posting (lower = posting dominates more) |
| Braggart / Humbled / Goofball-Humbled / Full House | .10/.15/.25/.10 | ±.05 | Personality pay perks |
| bonus clamp | 0.35 | 0.3–0.4 | Ceiling per Patch |
| base_decay / border | 10 / 2 | 8–12 / 1–3 | How fast unwatched turf fades |
| home_mult, brooder_mult | 0.5, 0.5 | 0.4–0.7 | Home floor; Brooder perk |
| sentry_refresh / Crier | 10 / 14 | 8–12 / 12–16 | Whether Watched turf holds |
| claim / spray Scent | 70 / 90 | 60–80 / 85–100 | Nights until the Spray prompt |
| Strong threshold | 60 | canon | Raid-loss gate |
| seen grace / step / floor | 2 / .20 / 0 | canon (DR-46) | Idle bound |
| home_adv, scent coefficient | 1.5, 0.005 | 1.2–1.8, .003–.007 | Raid odds overall |
| style_mod, guard_mod | §3.6 | Stalwart 1.3–1.7; Fraidy .6–.9 | Personality on guard |
| motive `counter` | 2.0 | 1.5–2.5 | Whether reading the motive changes the right cat. At 1.5 the Stalwart is the best guard for every motive again (round-3 sweep) |
| neighbour `pair` (bonded / clashing) | +0.25 / −0.25 | 0.15–0.35 | Weight of the board's adjacency puzzle |
| clashing-neighbour Tribute | −10% per Patch | 5–15% | Pay cost of a bad pairing |
| `loot_held` multiple (Scuffed, Lost) | 2 × Patch Tribute | 1–3 | Money stake of a raid night: at 1 the slice gap is ≈ 15%, at 2 it is ≈ 34% |
| raider PR ratios (Tough / Captain / escort) | 1.0 / 1.5 / 0.6 | Captain 1.3–1.8; escort 0.4–0.8 | Whether a Stalwart is automatically safe (Crew owns PowerRating; these are assumptions) |
| p_hold clamp | .05–.95 | — | No certainties |
| Repelled / Scuffed / in-person Scent | −5 / −20 (Anchor −10) / +10 | — | Raid stakes |
| Caterwaul window / multipliers / cap | 120 s / ×1.5 / 240 s | 90–150 s | Live-defence reachability |
| raids per night (slice) | 1 every night, from night 4 (Nemesis §3.12) | 0–1 | Pressure; the daily posting decision exists only on raid nights |
| Stale Claim cap / nights | 60 / 3 | — | Retake ease |
| thief loot life | 3 days | 2–5 | Hunt window |
| upkeep per post | 2 | 0–4 | Trivial drain |
| Stash cap | 400 | 300–600 | Hoard rot point |
| loot base / per-level / Full Belly | 1 / 0.5 / 12 | — | Field-haul share (≈ 60% of slice income) |
| caches | 6 × 10 | 4–8 × 5–15 | Exploration reward |
| Lessons, Bribe, Share | §4.8 | canon (DR-14) | — |

---

## 8. Acceptance Criteria

**Model (an updated Lives 1–2 sim must reproduce these; DR-57):**
1. The reference player's Doorstep on the morning after the claim delivers **54–66 Morsels** (≈ 60 ± 10%).
2. A sleep-skipper receives ≤ 4.0 × one day's Tribute after the last visit, and **0** Tribute in steady state (Low Wall Corner included, once its seen decays).
3. A Rub-skipper's Tribute is ≤ 7/day by the 7th consecutive skip day (one who also Sprays Low Wall Corner keeps it Strong: 6.4/day, round-2 sim).
4. For every policy, ending the day by a wipe yields Tribute identical to walking home, and a lower field haul.
5. Under the struggler policy, the Stash never goes below 0 and Tribute never falls below the Home Ground floor; every Lost Patch can be retaken by one Standoff.
6. The reference player can afford the day-5 Captain at fair or a day-5 Lesson, but **not both**.
7. The hoarder reaches the cap no earlier than day 6.

**Rules (unit tests):**
8. A Patch with Scent ≥ 60 at resolution is never Lost.
9. No outer Patch is Lost while the Den is Open.
10. Low Wall Corner is never admissible, and never below 10.
11. The own-post Spray prompt appears **if and only if** the post is below 60.
12. Rubbing your own mark changes no Scent and sets `seen` for that Patch only.
13. Raid outcomes are identical across reloads and replays with the same seed.
14. Tribute is invariant to roaming minutes, time of return home, and wipes.
15. A `gloat` raid is never Lost; an `uprising` on a Goofball's Patch is declined.
15a. `counter` is 2.0 exactly when the Sentry's personality is in §3.6's counter list for tonight's motive; `pair` follows Crew's matrix for adjacent posted Sentries only; a clashing neighbour cuts both Patches' Tribute by 10%; Scuffed and Lost set `loot_held` = 2 × the Patch's Tribute.
15b. A snubbed Nose-Touch leaves the Patch Open; Mark Over takes −30 from the nearest held outer Patch and never takes Low Wall Corner below 10.

**Posting stakes (round-3 sim, `posting_stakes_sim.py`):**
15c. The best posting beats random posting by **≥ 30% Tribute on raid nights 4–7** (sim: +45%) and has **≤ half** the random policy's Scuffed nights (sim: 0.53 vs 2.50).
15d. Across the four raid motives, the best guard on the forecast Patch is **at least three different cats** (sim: Pon, Hige, Togemaru, Kagi), and the habit policy (Stalwart on the forecast) trails the best by ≥ 3% (sim: 4%).
15e. With the reference posting, the night-6 Tribute stays inside 54–66 (sim 60.8; hand reference 65).

**Slice playtest (UX and QA assemble):**
16. The scripted first raid is forecast on day 4 and offers a Caterwaul on the cat-flap night for 100% of testers who go out.
17. On ≥ 3 of the 4 raid-eligible days (4–7), ≥ 70% of testers change at least one post after reading the Sniff (**the daily decision exists**).
18. ≥ 60% of testers, asked "why that cat on that wall?", answer with a personality or Style reason.
19. Territory time at the Lot (Turf Board plus Share) is ≤ 1 min at the 75th percentile; the Doorstep is ≤ 0.5 min.
20. Muted-audio check: testers identify which of their Patches is "fading" from wisps alone (≥ 80%).
21. Numbers appear on no territory surface except the Turf Board.
22. "Is territory management fun at this scale?" (DR-01) is rated ≥ 4/5 by ≥ 60% of testers, and no tester calls it a chore list.

---

## Backlog (post-slice)

- **TE-1, TE-5 / DR-27:** Life 8 territory numbers (no Doorstep deliveries all Life; Fresh Catch from held Patches; Carry sources), owned by Narrative §9. Territory supplies the numbers later.
- **TE-4:** Whole-game sinks and the Life 7 surplus. Rebuild with Share a Morsel as the late sink. Target Stash 3,000–6,000 at the end of Life 7 and ≤ 15% casual spoilage.
- **TE-9:** Late Tribute anchors (L4, L7). Scale `base_yield` so that the optimiser lands on the anchor ±10% and the reference about 15% under.
- **TE-10.2:** Crate Stack / Stash cap tiers beyond 400 (with Lot upgrades).
- **TE-10.3:** The hour-26 figure is moot (the old model is retired).
- **TE-10.4 / 10.5:** Specialisations and Skim are cut; revisit only if multi-district play needs them.
- **TE-10.6:** Strategy E's ambiguity is moot (no `rounds`).
- **TE-10.7 / 10.8:** Vigil ordering and survivor targets (Life 8).
- **TE-X5:** Loyalty inputs from Rations, cushy posts, Hangout and Lot comfort. Those systems are gone; reintroduce only through Crew's formula.
- **TE-X9:** Shiny table (≈ 50 full game) and its sinks (Rank III–IV Lessons). The slice's 3 Shinies are placeholders.
- **TE-X10:** Life 8 Warden gate (superseded by DR-27).
- **PP-35, PP-36:** Multi-district territory pacing items from the paper playtest.
- Prowler (Lookout: raiders arrive Ruffled) and Trickster guard roles, when those Styles return.
- Patch upgrades (Claimed-In, the rename from Settled, TE-X12) and the surviving Lot upgrades (Cushion Pile I).
- Multi-district raids, request budgets above 1 a night, district-wide Claim Bonuses.
- The Turf Board across three districts and the Summit (UX).
- Roof Run fast travel (Day loop).
- Arcade, Shiosai and Summit Patch tables (the first draft's 30-Patch table is the content source, to be re-cut to 20).
- Food-pile dressing per district; the Leftover-sweeping vignette variants.
- Full Clout table effects (Crew cap 7–12, Sentry slots 3–8).
- **(Iteration 3)** Raid stakes before the claim: Lost is still impossible while the Den is Open (DR-46), so pre-claim stakes are Repelled vs Scuffed. Iteration 3 raised them with the 2× `loot_held` and motive counters instead; a Routed Sentry costing −3 Loyalty (Crew) remains an unused lever.
- **(Iteration 3)** The Brooder's guard perk (and its `pretender` counter) never comes into play in the slice: Daifuku can join only at the very end. Acceptable: all six personalities still appear (DR-01).
- **(Iteration 3)** §4.13 "wiping is strictly dominated" is true for Morsels. In real time, a wipe before clock 240 skips the day sooner than Settle In can; the costs (Loyalty, promotion, the plaster) are real, so this is accepted.
- **(Iteration 3)** Daifuku's level: this doc uses Lv 8 (Bribe 256); Crew uses ≈ 9 (288). Combat's leader-level rule decides (combat review C-8).
- **(Iteration 3)** The adjacency rule is spatial on a 5-Patch board; with 3 districts it needs a per-district board and a cap on stacked neighbour bonuses (Turf Board across districts, UX).
- **(Iteration 3)** The Turf Board's first use moves to Life 2 day 2, the heaviest pre-Den day (Day Loop budget 22.4 typical / 28.9 heavy). Measure Lot time on that day first.

## Revision Log

**2026-11-23: Round 2 (fresh slice rewrite; first draft archived).** Figures were computed by hand in §4.11–4.13; the Lives 1–2 sim needs updating to these formulas (flagged, §6 note 6).

| ID | Status | How / why |
|---|---|---|
| TE-1 | BACKLOG | Life 8 (DR-27; Narrative §9) |
| TE-2 | FIXED | `rounds` and its wipe-forcing rule deleted; Tribute invariant to time and wipes (§3.9, AC 4, 14) |
| TE-3 | FIXED | `seen` floor 0, step 0.20, grace 2, tracked per Patch, so a single Rub cannot hold the whole district (§4.3, §4.13) |
| TE-4 | BACKLOG | Whole-game sinks. Pack Lunch **REJECTED** (DR-14 / DR-09: Bribes come from the Stash) |
| TE-5 | BACKLOG | Life 8 Offerings (DR-27) |
| TE-6 | FIXED | Surface = Sniff forecast + Turf Board + Doorstep (+ rescue Spray). Forecast always on; Rations, Treats and Specialisations cut; upkeep flat and auto; Warden = the Den's slot; personality guard column makes posting a daily choice (§3.6–3.7, §4.12) |
| TE-7 | FIXED | Raids take only Patches below Strong; retake = revenge Standoff; Den-Open protection (§3.5, §3.7) |
| TE-8 | FIXED | Own Rub gives no Scent (`seen` only); own Spray only below Strong, sets 90 (§3.3) |
| TE-9 | BACKLOG | Late anchors. The slice anchor is met (64 vs ≈ 60) with the 0.6/0.9/1/1 bands and the bonus clamp |
| TE-10.1 | FIXED | Clout points cut; milestones only (§3.10) |
| TE-10.2–10.8 | BACKLOG | See Backlog lines |
| TE-10.9 | FIXED | Share a Morsel = Σ Crew levels (§4.8) |
| TE-10.10 | FIXED | Routing the thief returns `loot_held` in full (DR-46; §3.7) |
| TE-X1 | REJECTED | Crew-cap curve is set by DR-14 |
| TE-X2 | FIXED | Bribe = Crew/DR-09 formula; Territory's recruit formula deleted |
| TE-X3 | FIXED | Lessons 40/120 (/300/600) ×1.5 cross-Style; Territory's 6-tier table deleted |
| TE-X4 | FIXED | One feeding verb: Share a Morsel; Treat deleted |
| TE-X5 | BACKLOG | Inputs belonged to cut systems |
| TE-X6 | FIXED | Nemesis's request cap is the budget; Territory keeps admissibility only (§3.7) |
| TE-X7 | FIXED | Nemesis motives with `motive_mod` and resolution effects (§3.7) |
| TE-X8 | FIXED | Forecasts always on; Schemer adds the motive |
| TE-X9, TE-X10 | BACKLOG | Shinies; Life 8 |
| TE-X11 | FIXED | Bribe is the recruit payment; "Offering" reserved for Life 8 |
| TE-X12 | FIXED | Upgrade renamed Claimed-In (upgrades themselves Backlog) |
| TE-X13 | FIXED | Warden True+, no Shifty on Den posts, greyed on the Turf Board (§3.6) |
| TE-X14 | FIXED | `patch_level` = band midpoint (Lane 4) (§4.10) |
| PP-03 | FIXED | Scripted short escalation for Low Wall Corner (§3.4) |
| PP-11 | FIXED | Sentries first taught on Laundry Pole Yard in Life 2 (§3.12) |
| PP-12 | FIXED | Bribes paid from the Stash at the Verdict; "none" always available (§3.11) |
| PP-13 | FIXED | Territory contributes only Tribute pick-up and Share a Morsel to the 3-reset budget; no Rub limits, feeders, scraps or reseeding caches (§3.3, §3.9) |
| PP-34 | REJECTED | Crew-cap curve: DR-14 |
| PP-35, PP-36 | BACKLOG | Multi-district |

**2026-11-24 — Iteration 3 (final fix pass; round-2 review `design/reviews/round-2/nemesis-territory-dayloop.md`, plus the `presentation.md` teaching-order ruling).** Sim: `design/reviews/round-3/sim/posting_stakes_sim.py` (output `posting_stakes_sim.out.txt`, 2,000 seeds).

| Item | Status | How |
|---|---|---|
| T1 Mark Over and Snatch | FIXED | §3.7 (values), §3.2 (Mark Over added to the Scent list), §5 |
| T2 Snubbed Nose-Touch | FIXED | §3.4 step 5 and §5: the Patch is Open (mirrors Nemesis §3.11) |
| T3 Teaching order | FIXED | §3.12 follows UX's ruled sheet (key-screens §7.4): Sentries and the Turf Board move to **Life 2 day 2** (taught as the answer to the first forecast), Lessons to **Life 2 day 3**. The separate "uprisings" sub-step is deleted from step 2; an uprising is the night's raid. *Note:* the round-2 territory review asked for Sentries on L2D1; the presentation review rules that UX's sheet keeps them on L2D2. This doc follows the presentation ruling |
| Motive list and parties | FIXED | One list shared with Nemesis §3.12: `grudge` +1, `boss_orders` +2, `gloat` alone, `pretender` +1, `uprising` alone |
| §4.11 reference | UPDATED | S1/S2 named Hige and Togemaru (Crew §3.3); no posts on night 3; claim path per Day Loop. Night-6 anchor **65** (54–66 ✓); Stash 128 at the fast-path end, 82 after the extra day |
| AC 3 | FIXED | ≤ 7/day (round-2 sim 6.4) |
| Design risk: low territory stakes | FIXED | **Motive counters** (×2.0), **neighbour pairs** (bond +0.25 / clash −0.25 and −10% Tribute), **2× `loot_held`** on Scuffed and Lost, and real raid parties. **Before** (round-2 S7): best vs random posting ≈ +11% Tribute (234 vs 209); round-3 re-run of the round-2 rules: +15% over the slice, +19% on raid nights; "Stalwart on the forecast" equal to the best posting. **After:** **+34% over the slice, +45% on raid nights 4–7** (184 vs 128); Scuffed nights 0.53 vs 2.50; +109% vs no posts on raid nights; the habit answer trails the best by 4% and takes 57% more Scuffed nights; the best guard is Pon / Hige / Togemaru / Kagi by motive. Night-6 Tribute 60.8, Stash never below 0, sleep-skip steady state 0 |
| Not fixed | BACKLOG | Pre-claim Lost (DR-46 holds), Brooder perk unused, wipe real-time note, Daifuku level, multi-district adjacency |

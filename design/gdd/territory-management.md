# Territory Management and the Food-Tax Economy

*Owner: economy-designer (Territory & Economy) · Round 2 (vertical slice) · Date: 2026-11-23 · Iteration 3 (final fix pass) 2026-11-24 · **Owner feedback pass 2026-11-24** · Status: slice spec*
*Canon: `design/creative-brief.md` **v1.5**; binding rulings `design/reviews/owner-feedback-rulings.md` (**OR-01…OR-21**, which win over every older ruling), then `design/reviews/round-1/director-rulings.md` (DR-01, DR-13, DR-14, DR-17–DR-19, DR-37, DR-42, DR-46, DR-47). Patent guardrails: `design/legal/nemesis-patent-analysis.md` v2 §5 (G1–G12). First draft archived at `design/backlog/first-drafts/territory-management.md`.*
*Scope: **the vertical slice only.** Hidamari Lane (5 Patches), Lives 1–2, about 7 in-game days. Full-game material is listed in `## Backlog (post-slice)`.*

> **Patent rule for this doc (brief v1.5, OR appendix).** Nothing Mikan does to one cat, and nothing that cat becomes because of it, may change a *different* cat. Territory changes land on **Patches, posts and Morsels**, on the **calendar**, or on **newly generated cats** (Nemesis). **No fight outcome moves Scent or influence** (G5): fights matter because gang cats guard the posts you then spray. Not legal advice; counsel review still blocks scope lock and any public showing.

---

## 1. Overview

Territory is half of Mikan's day. Mikan takes ground the cat way: **fight to clear, spray to claim.** Gang cats guard each **Patch**; Mikan erodes their marks, brawls whoever comes to stop the spraying, faces the post's **Keeper**, gives a **Verdict**, and then **Claim Sprays** the post as his own. Every held outer Patch adds to Mikan's **district influence**, one tug-of-war bar per district, read straight off the Patches' **Scent**. Scent fades every night for everyone, Mikan included, so held ground has to be kept. When the bar is full the district **Boss comes down off his wall and roams** a three-stop patrol, and Mikan can challenge him there (the **Boss window**). Ground is never "done": overnight raids, **challengers** (new cats in town who stake one of Mikan's posts), **newcomers** who move into Patches Mikan let lapse, and, rarely, a neglected recruit who turns its coat, can all take it back.

Every morning the cats on Mikan's turf pay a food tax, **Tribute**, which appears as a pile on Haru's **Doorstep** and goes into the **Stash**. The Stash pays for Lessons, Bribes and Share a Morsel. The management surface stays small: three screens and one verb.

1. The **Morning Sniff** names tonight's threat: a raid (target, raiders, and the motive if a Schemer is posted) or a challenger's stake.
2. The **Turf Board** at the Lot (OR-17): four zones, **one decision a day**: *who guards the threatened Patch, and so who leaves the Posse*. It is the only place territory numbers appear.
3. The **Doorstep pile**: how well the Lane paid.
4. **Spray**, out in the street: your own post is offered only when it has dropped below Strong. It is a rescue, and it is how influence is kept.

**Personality is what makes it a decision.** Each Crew cat guards in its own way (the Stalwart holds, the Braggart makes the Patch pay, the Brooder slows the fade, the Schemer reads the motive, the Fraidy raises the alarm early, the Goofball **laughs off a challenger's over-mark**). Each raid motive has a counter personality (Stalwart against `gang_orders`, Braggart against `gloat`, Goofball against `grudge`, **Schemer and Brooder against a `challenge`**), and cats posted on neighbouring Patches cover for each other if bonded and squabble if they clash. Two Sentry posts against a Posse that wants three cats, and a threat that changes every night, mean the right cat changes every morning. Posting well is worth **+24% Tribute over the slice and +33% on raid nights** against posting at random, with a quarter of the Scuffed nights (§4.5; owner-feedback sim).

The slice economy is modelled day by day in §4.11 (2,000-seed sim). Tribute rises from 6 a day (Life 1, day 1) to **≈ 58 on the night of the claim** (canon anchor ≈ 60, target 54–66). There is no debt, the Stash is never at risk, Home Ground cannot fall, and **no idle, skip or lose-on-purpose strategy beats playing the day** (§4.13).

## 2. Player Fantasy

*"This wall is mine. That cat pays me in fish. And the big grey tom up the hill has finally come down off his wall to deal with me."*

- **The claim.** You sneak onto a rival's Patch, scuff out their marks, Counter-Spray their post (pop, sparkle cloud), brawl the cats who come to stop you, stare down their Keeper, decide what becomes of it, and then Spray the post as your own. The wisps over the post turn bell-gold, and the bar in the Lane's colours tips your way.
- **Filling the bar.** Four posts, four quarters of the bar. When the last one smells of you, a yowl rolls down from the great wall and Daifuku climbs down to walk his rounds. He is out there now, on the yard wall, at the tofu shop, by the corner stone, and you can go and find him.
- **It never stays won.** Your scent fades every night. A stranger turns up on the Sniff ("A stranger's scent") and sits on your weakest post, scuffing it nightly until you see it off. A Patch you let lapse is not empty for long: someone new moves in. Holding ground is a habit, not a trophy.
- **Being Boss.** You are not a cat who owns things; you are a cat other cats pay. The pile on the Doorstep is a daily, physical report card: a croquette end, two sardines, a fish head, and a baffled Haru stepping around it.
- **Your cats, your call.** At the Lot you read the Sniff ("a stranger is staking Persimmon Alley") and look at your cats: the Schemer saw this kind of plot coming, the Goofball would just laugh at the stranger's marks, and the Stalwart would be wasted there tonight. You pick one, and that cat is not in your Posse tomorrow.
- **Rescue, not chores.** You never repaint your own turf for the sake of it. Your post only asks to be Sprayed when it has gone faint, so every Spray is a conquest or a rescue.
- **The night is yours (from the cat flap).** A Caterwaul in your Sentry's voice rises over the roofs. If you get there in time, your being there is what counts; win or lose the scrap, the post is better guarded. Or stay home with Haru: ignoring a Caterwaul is never worse than being asleep.

Pillar fit: **Cat's-Eye Truth** (scent, wisps, food piles; the bar and its % only on the Turf Board); **Two Lives, One Clock** (Tribute arrives at home every morning; going home is never taxed; a lost fight sends you home to Haru); **Rivals Remember** (raiders and challengers are cats with faces and history); **Conduct the Brawl** (the cats you post are the cats you are not fighting with).

---

## 3. Detailed Rules

### 3.1 Hidamari Lane: the five Patches

The slice has one district and five Patches. Each Patch has one tall, landmark-shaped **Scent Post** (DR-47), two **Rub Marks** (shown only in Whisker Sense), a `keeper_id` (or none), a `scent` value owned by one Clowder, and one Sentry slot. Names and posts are provisional for Level and Art; `base_yield` values are tuning starts.

| ID | Patch | Scent Post (landmark) | Feature | base_yield | Neighbours | Influence share |
|---|---|---|---|---|---|---|
| LWC | **Low Wall Corner** (Home Ground; tutorial Patch) | red mailbox at Haru's wall | Sunspot | 8 | LPY, PA | 25 |
| LPY | **Laundry Pole Yard** | old wooden yard gatepost (the First Thorn's post) | High Perch | 10 | LWC, PA, DEN | 25 |
| PA | **Persimmon Alley** | utility pole under the persimmon tree | Cut-through | 12 | LWC, LPY, TSS | 25 |
| TSS | **Tofu Shop Step** | milk-crate stack | Back Door | 14 | PA, DEN | 25 |
| DEN | **Den: Daifuku's Wall** | the great wall's mossy corner stone | Sunspot | 18 | LPY, TSS | — (the Boss's seat) |

Total `base_yield` is 62. The Den sits uphill; the four **outer** Patches surround the approach and are the four quarters of the Lane's influence bar (§3.2.2).

**Features (only three have rules):**
- **Sunspot:** contains a Sunspot nap point (canon nap). No Scent effect.
- **High Perch:** raid defence `fixed_bonus` +0.15 (§4.5); a Caterwaul from this Patch gets +30 s. It is also the Boss's Morning patrol stop (§3.5).
- **Back Door:** the richest outer Patch. A challenger picks it over an equal-Scent Patch (§3.7.2). Its back wall is the Boss's Day patrol stop.
- **Cut-through:** no rule. It touches three Patches, so it is the Patch most often on the frontier.

**Home Ground (LWC).** Once claimed, Low Wall Corner cannot be raided, Lost, staked by a challenger or taken by a turncoat. Its Scent decay is halved and never takes it below 10, so it always gives at least 4 influence. The player always has one wall: this is the hard floor against a death spiral.

### 3.2 Scent and district influence

#### 3.2.1 Scent

- `scent` is an integer 0–100 per Patch, owned by one Clowder (the Wall Sitters, Mikan's bell Clowder, or an **outsider**: a challenger, newcomer or turncoat). At 0 the Patch is **Open** (no owner, no Keeper).
- Bands are shown in the world as **1–4 wisps** in the owning Clowder's colour hanging at the post (DR-47), and on the Turf Board's Tonight panel as the number.

| Band | Scent | Wisps | Tribute × | Rules |
|---|---|---|---|---|
| Faint | 1–24 | 1 | 0.6 | Raidable; Spray offered; worth `scent/60` of a share |
| Clear | 25–59 | 2 | 0.9 | Raidable; Spray offered; worth `scent/60` of a share |
| **Strong** | 60–89 | 3 | 1.0 | **A raid cannot take it** (worst case Scuffed); no Spray offered; **a full influence share** |
| Pungent | 90–100 | 4 | 1.0 | As Strong (no extra pay or influence) |

**What moves Scent (OR-08; the whole list).** Territory acts, NPC raids and time. **Never a fight outcome** (G5).

| Moves it | Effect | Who acts |
|---|---|---|
| **Claim Spray** a post with no Keeper (§3.3) | Yours at **70** | Mikan |
| **Rescue Spray** your own post (offered only below 60) | → **90** | Mikan |
| **Over-mark** a rival Rub Mark / **Counter-Spray** a rival post | Rival −10 / −30 | Mikan |
| Overnight raid result (NPCs against your Sentry, §4.5) | Repelled −5 · Scuffed −20 (Anchor −10) · Lost: flips to the attacker at 40 | NPCs, by formula |
| **Challenger over-mark** (an NPC act on the post, §3.7.2) | −10 a night (a posted Goofball: 0) | NPC |
| Nightly decay and refresh (§4.1) | Yours −10 (+2 per rival-held neighbour; ×0.5 Home Ground and with a posted Brooder), Sentry +10 (Crier +14); a Keeper's Scent recovers +8 to its ceiling; a keeperless post fades −10 | Time |

**Deleted (OR-21 item 8 and item 4):** Rout erosion ("−15 per rival Routed inside the Patch"), "a wipe during a contest gives the rival +30", the Caterwaul's "+10 in person", the Verdict setting `S_r = 0`, the Keeper waiting on a cleared wave, **Mark Over** and **Snatch**. Scent never changes in real time while roaming except by Mikan's own marking.

- **Readability (DR-47):** below Strong, the wisps thin and droop. In Whisker Sense the scent compass ring points at any of your posts below Strong, at a forecast raider's sniffing trail on the target Patch, at an active challenger and at the roaming Boss's current stop.

#### 3.2.2 District influence (OR-08)

Influence is **a read-out, not a second number**. Per-Patch Scent stays the only stored territory value; influence is derived from it per district and per Clowder (formula §4.14):

- **Scale 0–100.** The Lane has four outer Patches, so **each outer Patch held at Strong (≥ 60) is worth 25**; below Strong it is worth `scent/60` of 25. Open Patches count for nobody. The Den is the Boss's seat and is not a share.
- **One idea for the player: keep your posts Strong.** The bar drops exactly when a post's wisps thin and the Spray prompt appears, so the rescue Spray that protects a post from a raid is also the act that fills the bar.
- **It decays for everyone, you included.** Your posts fade −10 a night and an Unwatched post Sprayed to 90 holds its full 25 for three nights, then loses ≈ 4 a night until it lapses on the ninth. A gang's Patch recovers +8 a night, so erosion you leave half done fades back. Home Ground never gives less than 4, so **the Lane's bar never reaches 0 for Mikan** once Low Wall Corner is his.
- **Shown** as one tug-of-war bar per district (OR-17): bell gold from the left, the gang's colour from the right, outsiders after it, the Open gap between, and **the Boss's crown at the full end** (lit while the Boss window is open). **The % appears only in the Turf Board header.** The Morning Sniff may show the bar without a number (UX); the street shows wisps only.
- `InfluenceChanged(district_id, by_clowder{})` is emitted whenever a value changes (after any Scent change and at step 2).

**What influence drives, and what it never drives.** It opens and closes the **Boss window** (§3.5) and gates a held Den's raid admissibility (§3.7). It **never** buffs, levels or re-tasks any cat (OR-18: no buffs from influence; G5), and the Boss's level, stats, traits and rank never read it.

**Worked example (OR-08; Life 2 day 3 evening):** Low Wall Corner 80, Laundry Pole Yard 66, Persimmon Alley 48, Tofu Shop Step 70 (just claimed) → 25 + 25 + 20 + 25 = **95**. Rescue-Spray Persimmon Alley to 90 → **100: full influence** (§3.5).

### 3.3 Marking verbs

| Verb | Where | Input | On your own Patch | On a rival Patch |
|---|---|---|---|---|
| **Rub** | Rub Mark | tap, in passing (0.4 s) | **No Scent.** Counts as a `seen` visit for that Patch (§3.9) | **Over-mark:** −10 rival Scent. Quiet unless a rival cat within 8 m sees it; seen = Bristle. Each rival Rub Mark once per contest |
| **Spray** | Scent Post | hold 1.2 s (tail-quiver; **damage interrupts**) | **Rescue Spray, offered only when the post is below Strong.** Sets Scent to **90** at once; the Sentry chirps. Counts as `seen` | **Counter-Spray:** −30 rival Scent, always loud (Bristle). Repeatable |
| **Claim Spray** | the post of a Patch with **no Keeper** (Open, lapsed, or cleared by a Verdict) | hold 1.2 s | The Patch becomes yours at Scent **70** (Strong, a full share); `PatchChanged` | — |

Spraying is slapstick: a sparkle cloud and a pop, never liquid. There is **no daily limit** on any marking verb, and none needs one: Rubs give no Scent, and your own Spray exists only when it is needed (DR-18).

**Every marking act carries its district.** Territory emits `MarkApplied(patch_id, district_id, kind ∈ {over_mark, counter_spray, claim_spray, rescue_spray}, target_clowder)` (proposed contract, §6). Nemesis reads it for **Boss anger** (OR-07: an Over-mark of a rival mark +5, a Counter-Spray of a rival post +15; Claim and Rescue Sprays are never sources). This is how Territory's sneak-versus-loud choice also sets how hard the Boss hits.

**The Den post cannot be marked** (no Over-mark, Counter-Spray or Spray) until the Boss has been given a Verdict; then it takes a Claim Spray (§3.5).

### 3.4 Taking a rival Patch: fight to clear, spray to claim

One number drives the contest: the rival Clowder's Scent on that Patch, `S_r` (an outer gang Patch rests at its ceiling of 80). **Only marking moves it.** Fights matter because the gang's cats come to stop you, and a Spray's 1.2 s hold is broken by any hit.

1. **Read.** Whisker Sense shows the post, the Rub Marks, the Keeper's trail and High Road routes onto the Patch.
2. **Erode.** Over-mark the Rub Marks (−10 each, quiet if unseen) and Counter-Spray the post (−30, loud, repeatable).
3. **Bristle.** The first loud or seen act puts the Patch in **Contested**. Territory asks Combat for **turf waves**: up to **2** if `S_r ≥ 40` after the act that Bristled, otherwise 1. Waves keep coming only while `S_r > 30`; once marking brings it to ≤ 30, no further wave spawns. Composition is Combat's.
4. **Keeper.** When `S_r ≤ 30`, the Keeper arrives **at the next moment no encounter is running**. Its arrival keys off Scent only, never off which wave cats were beaten (OR-08). If the act that Bristled already took `S_r` to ≤ 30 (the quiet take below), the Keeper comes with one escort wave and no other wave follows: sneaking pays by skipping a fight.
5. **Verdict.** Rout the Keeper; Nemesis applies the Verdict (`VerdictApplied`, verdict ∈ {`chase`, `recruit`, `nose`}). **All three clear the post:** the Keeper leaves (Gone, Crew, or into a 10-day truce), and **Claim Spray is offered at once**. Nothing else in the district changes: no cat moves up, in or over (G3, G6). The residual rival Scent stays on the post but has no Keeper to refresh it (it fades −10 a night).
6. **Claim Spray** → yours at 70. From Life 2 day 2 (once Sentries are taught, §3.12), a prompt offers to leave one Posse Crew cat as Sentry (the only posting outside the Lot); the Posse runs one cat short until the Lot. A cleared post that is **not** Claim Sprayed stays keeperless, and a newcomer may move in on a town-event night (§3.7.3).

**Two ways to take an outer Patch (80):**
- **Quiet:** two unseen Over-marks (→ 60), then one Counter-Spray (→ 30): one escort wave, then the Keeper. Boss anger +25.
- **Loud:** two Counter-Sprays (→ 50, Bristle, two waves; → 20 once the waves let you finish the hold). Boss anger +30, and more fighting.

**Interruptions:** a Posse wipe during a contest is a loss (OR-01: the day ends, §3.9.1) and **changes no Scent**; the erosion already done stays and recovers +8 that night. Leaving a Contested Patch for 20 s, or going home, ends the contest the same way.

**PP-03 — the Life 1 tutorial exception (Low Wall Corner).** A scripted short escalation: one Rub (Over-mark), one Counter-Spray, one wave of two Strays, then the Keeper's Standoff (an untracked Stray). The thresholds above are bypassed. It fits inside DR-22's day-1 beat after the two-Stray Pile-On.

**Life 1 day 2 (Laundry Pole Yard).** Togemaru, the First Thorn, is its Keeper. His day-1 encounter always ends `rival_fled` (OR-14), so the post's first Verdict is day 2's.

### 3.5 The Boss window and claiming Hidamari Lane (OR-09; replaces the Den gate)

1. **Before the window** the Boss stays at the Den and ignores Mikan ("Come back when the Lane smells of you, Collar."). The Den post cannot be marked. There is no Locked/Open Den state and no "3 of 4" rule.
2. **Opening.** When Mikan's Lane influence reaches **100** (checked after any Scent change, and at step 2), the window opens: `BossWindowChanged(hidamari, open = true)`. A yowl rolls down from the great wall, Daifuku climbs down, and the Sniff and the Turf Board say so. **The trigger is the influence value alone**, never a fight outcome or a count of beaten cats (G5). In practice that means all four outer Patches Strong at once.
3. **The patrol** (Nemesis places him; Combat owns the arena kit). One stop per daytime phase, staying at the last through Night. Each stop is one arena kit (a wall segment with a knock-off edge and a water prop). Slice: **Morning** Laundry Pole Yard's yard wall (wash tub) · **Day** Tofu Shop's back wall (rain barrel) · **Dusk and Night** the Den corner stone (the bucket). The current stop shows on the Turf Board map (crown paw-marks) and as a crown tick on the Whisker Sense compass.
4. **Challenging.** Approach within 8 m of his current stop for a Standoff, then the Boss fight there (Combat's 3-phase design on the kit).
5. **Closing (hysteresis).** The window stays open while influence is **≥ 75** at step 2. Below that, he returns to the Den and the window closes (`open = false`); it reopens at 100.
6. **While the window is open, held outer Patches cannot be Lost** (a Lost result becomes Scuffed). This is what stops the run-up to the Boss becoming a treadmill.
7. **Claiming.** Rout the Boss, give any Verdict, then **Claim Spray the Den post** (the corner stone; a highlighted, Head Home–style thread leads there): `DistrictClaimed(hidamari)`. Fight to clear, spray to claim, same as every Patch. The Den is Mikan's at 70, the Life 2 turf goal is met, and Clout becomes **Boss**.
8. **The Boss's departure re-tasks nobody (G6).** After the Verdict, no gang cat is promoted, given the Den, or behaves differently, and the raid fallback is the gang's (`gang_orders`, OR-19). Any future new Boss is a newly generated cat (Backlog: the Usurper rule).
9. **After the claim:** the Den is the Warden's post (§3.6). A held Den is admissible to raids only while Mikan's Lane influence is **below 75** (the symmetry rule, now read off the same bar). Outer Patches are raidable as normal again, and challengers keep coming on their calendar (§3.7.2): being Boss is harder than becoming Boss. The Life goal stays met regardless (no fail state).
10. **Full House:** holding all five Patches adds +10% Tribute on every Patch.

**Pacing (sim, §4.11).** For a player who rescue-Sprays every prompt, the Claim Spray on Tofu Shop Step (Life 2 day 3) is the moment influence first reaches 100, so **Daifuku comes down on L2D3** (100% of engaged runs). Day Loop's reference attempts him on **L2D4** (the L2D3 clock is spent on Kagi's take) and, after that attempt's loss, claims on **L2D5**. A player who skipped L2D3's rescue Sprays sees the window open on L2D4 (OR-09's expectation). Flagged for Day Loop and UX (§6 note 7).

### 3.6 Sentries and the Warden

**Slots.** Sentry slots come from Clout (§3.10): 1 at House Pet, 2 from Lane Cat. **The slice is clamped at 2 slots** (DR-01). Each Patch takes at most one Sentry. The Low Wall Corner slot exists, but posting there only affects Tribute and neighbours (it cannot be raided or staked).

**The Warden is the Den's Sentry slot** (DR-46): the cat posted at a held Den is the Warden. It needs **True+ Loyalty (≥ 60)**. Cats below Shifty's ceiling (< 30) may not take a Den post (DR-10, TE-X13). Ineligible portraits are shown greyed on the Turf Board with the reason. Eligibility is checked only at posting; a Warden that later drops below 60 stays on its post (no surprise ejection).

**Posting** happens on the Turf Board at the Lot, or at the post-claim prompt. Posted cats leave the Posse and show as disabled in Tail-Up. A Patch is **Watched** if it has a posted Sentry that is not Routed-for-a-night; otherwise it is **Unwatched**.

**The daily tension.** Crew grows from 1 (day 1) to 5–6 (day 7). The Posse wants 3 Crew. With 2 posts filled, a Crew of 4 leaves Mikan with a Posse of 3. Posting is never free: the cat on the wall is not in the fight, it is not getting Posse-time Loyalty, and **an ex-Rival recruit left Shifty on a post may turn its coat** (§3.7.4).

**Guard behaviour = Style role (automatic) × personality (DR-37 guard column).** The player chooses nothing on the post; they choose the cat.

| Style (slice) | Role | `style_mod` | Extra |
|---|---|---|---|
| Bruiser | Anchor | 1.25 | On Scuffed, Scent loss is 10, not 20 |
| Scrapper | Scrapper-on-the-Wall | 1.10 | On a Repelled raid, the raid leader's home Patch loses 10 rival Scent (an NPC raid result, not a fight) |
| Yowler | Crier | 1.00 | Nightly refresh 14 instead of 10; Caterwaul window ×1.5 |

| Personality | `guard_mod` | On guard (Territory's numbers) |
|---|---|---|
| **Stalwart** | **1.50** | Best raw raid defence |
| **Braggart** | 1.25 | Patch Tribute **+10%** ("residents pay a loud cat") |
| **Brooder** | 1.00 | Scent decay on its Patch **×0.5**. Never leaves: it is never Routed-for-a-night (the Patch stays Watched after a Scuffed). Moving it off a post raises Crew's `dismissed_from_post` |
| **Schemer** | 1.00 | While posted anywhere in the Lane, the Sniff forecast **names the motive** (§3.7); without one, the motive shows "?" (a challenger's stake is always named) |
| **Fraidy** | 0.75 | Weak defence, but **raises the Caterwaul early**: the live raid fires at the start of Night and its window is ×1.5. On a Scuffed it bolts instead of being Routed (`sentries_routed` excludes it) |
| **Goofball** | 1.00 | **"Laughs off a challenge"** (OR-15): a challenger staking the Goofball's Patch over-marks **0** instead of −10 a night |

**Motive counters.** Every raid motive (§3.7) has a counter personality. A Sentry that counters tonight's motive defends at **`counter` = ×2.0** (`guard_mod` × 2; §4.5):

| Motive | Counter | Why (what the player is told on the Turf Board) |
|---|---|---|
| `gang_orders` (leader + 2 escorts) | **Stalwart** | "Holds against numbers" |
| `gloat` (leader alone, showing off) | **Braggart** | "Out-shouts a show-off" |
| `grudge` (leader + 1, after Mikan) | **Goofball** | "Laughs it off until it forgets why it came" |
| `challenge` (a challenger + 1 Stray, wants the post) | **Schemer**, **Brooder** | "Saw the plot coming" / "Never leaves the post" |

Without a Schemer posted, a raid's motive shows "?" and the player reads the forecast's portraits instead (three portraits = `gang_orders`; one = `gloat`; two = `grudge`). A challenger's stake is announced by its own Sniff card, so `challenge` is always known. Against a challenger the player weighs two answers: the **Schemer** (best odds on the raid) or the **Goofball** (no nightly over-mark, so the post keeps its Scent and influence share).

**Neighbours on the board.** Two Sentries on **adjacent** Patches (§3.1 neighbours; Low Wall Corner counts) affect each other by Crew's bond/clash matrix (Crew §3.2):
- **Bonded neighbours** cover each other's wall: each gets `pair` **+0.25** (`guard_mod × 1.25`).
- **Clashing neighbours** spend the night hissing over the fence: each gets `pair` **−0.25** (`guard_mod × 0.75`), and **both Patches pay −10% Tribute** that night.
- Neutral neighbours, and posts that are not adjacent, have no effect. A Sentry that is Routed-for-a-night or Unwatched gives no neighbour effect.
- Slice pairs that matter: Hige–Kinako, Hige–Pon, Togemaru–Pon, Kinako–Kagi, Pon–Kagi are bonded; **Togemaru–Kinako** and **Hige–Kagi** clash. So the counter for tonight's motive may be the cat that clashes with the guard next door, and a Fraidy that is useless on a fight can sit on Low Wall Corner beside the Stalwart and make it stronger. **Kin** (OR-04/05) are a bonded pair by Crew's matrix; no other relationship tag touches guarding.

**Social pairs and Loyalty** (Crew owns the Loyalty numbers): for Territory, two cats are "posted in the same district" when both hold Lane posts. Bonded posted pairs gain and clashing posted pairs lose Loyalty per DR-37. That Loyalty effect covers any two Lane posts; the guard and Tribute effect above needs **adjacent** posts.

**Upkeep** is flat: **2 Morsels per post per night** (`2 × district_index`), auto-paid from the Stash in step 2. If the Stash is short, that post is on **Short Rations** for the night (`guard_mod ×0.8`). No debt is ever recorded.

**Sentry states:** Lounging → Posted → (Scuffed) Routed-for-a-night (Unwatched for one night, then resumes) → Posted. **Wavering** (Crew's flag, OR-11) shows the posted cat turned away on the Turf Board. If the Patch is Lost or lapses, its Sentry returns to the Lot; if the Sentry turns its coat, the post goes with it (§3.7.4). Territory reports per cat each night: `posted`, `nights_posted`, `district_seen`, `raid_outcome` (Crew's Stalwart dislike reads a Scuffed or Lost night on its own post, OR-12), `routed`, `dismissed_from_post`.

### 3.7 Raids, challengers and losing ground

**Who and why: Nemesis.** In step 3 of the Night Shuffle, Nemesis emits `RaidRequested(attacker_ids, patch_id, motive, night = tomorrow)`, at most **1 per district per night** (TE-X6), **a challenger first** (Nemesis raid priority: `challenge` > arc lead > others). In the slice raids switch on with the cat flap: the first one is scripted (Nemesis names the requester), requested on night 3, forecast in the day-4 (Life 2 day 2) Sniff, and fires on day 4's Night, the cat flap's first night out. From night 4 Nemesis requests **one raid every night** that an admissible target exists, against the **lowest-Scent admissible held Patch, Strong included**.

**Forecasts are always on** (DR-46, TE-X8). Every raid that will resolve tonight appears in this morning's Sniff as a stamp card: the target Patch's landmark, the raiders' portraits (silhouettes if undiscovered, OR-03), and the motive icon, or "?" unless a Schemer is posted.

**Admissibility (Territory may decline; a declined request returns `RaidResolved(outcome = declined)`):**
1. No raids in Life 1.
2. Low Wall Corner is never admissible.
3. A Patch claimed or retaken today is immune tonight.
4. No Patch is raided two nights running, **except a challenger's `challenge` raid on the Patch it stakes**.
5. A held Den is admissible only while Mikan's Lane influence is below 75 (§3.5 item 9).

**Motives** (Nemesis's list, OR-16, OR-19). Territory adds the resolution effect:

| Motive | `motive_mod` | Raid party (escorts are untracked Strays) | Counter (§3.6) | Effect at resolution |
|---|---|---|---|---|
| `grudge` | 1.15 | leader + 1 escort | Goofball | If the posted Sentry has an Old Score with the leader, its term ×1.25 |
| `gang_orders` | 1.10 | leader + 2 escorts | Stalwart | — (three attackers). The gang's fallback: it does not depend on the Boss (G6) |
| `gloat` | 1.00 | leader alone | Braggart | Never Lost (worst case Scuffed): it is showing off |
| `challenge` | 1.10 | the challenger + 1 escort | Schemer, Brooder | **Lost: the challenger becomes the Patch's Keeper.** A **Repelled** counts toward its leaving (twice → `Gone`, Nemesis) |

**Resolution order (step 2):** Scent decay and refresh → **challenger over-mark** → upkeep → resolve tonight's raid against the **post-decay** Scent and the Sentries posted tonight → **recompute influence and the Boss window**. The forecast names a Patch, not a guard, so moving cats after reading the Sniff is the point.

**Outcomes** (formula in §4.5):

| Outcome | Scent | Sentry | Patch | Tribute tonight from that Patch |
|---|---|---|---|---|
| **Repelled** | −5 | Unharmed; Crew logs a defence | Held | Paid |
| **Scuffed** | −20 (Anchor −10) | Routed-for-a-night (not Brooder; Fraidy bolts) | Held | **Stolen, twice over**: the raid leader carries off `loot_held` = **2 × the Patch's Tribute** (its own pay, plus the same again off the Doorstep pile) |
| **Lost** | Flips to the attacker at 40 (**Stale Claim**) | Returns to the Lot | Attacker's Clowder; the raid leader is its Keeper | None, and the raiders also carry off `loot_held` = 2 × the Patch's Tribute |

- **Strong rule (DR-46):** if the Patch's Scent is ≥ 60 at resolution, Lost becomes Scuffed.
- **Window rule (OR-09; replaces the Den-Open rule):** while the Boss window is open, Lost becomes Scuffed on every outer Patch.
- **Thief rule (DR-46):** Routing a raid leader who holds `loot_held`, in any daytime fight within 3 days, returns the Morsels in full to the field haul (the leader's trail glows in Whisker Sense). After 3 days the loot is eaten. This moves Morsels on the cat that took them; it never moves Scent.
- **Mark Over and Snatch are deleted** (OR-02, OR-21 item 4). **A loss changes no territory.**
- **Retake (Stale Claim):** a Lost Patch's Keeper waits at the post. Entering the Patch skips erosion and waves and triggers a Standoff with that Keeper. Rout → Verdict → **Claim Spray**. It takes 60–90 s. Stale Claim rival Scent recovers to a ceiling of 60 for 3 nights, then 80.

#### 3.7.1 The four ways ground is taken back (OR-10)

| Route | Trigger | Result | Where |
|---|---|---|---|
| **Raid** | One forecast raid per district per night | Repelled / Scuffed / Lost. No Lost if the Patch is Strong, Home Ground, or the window is open | §3.7 |
| **Challenger** | A fixed calendar, or a truce that ended (Nemesis) | Over-marks a held Patch nightly and takes the raid slot; may take it | §3.7.2 |
| **Newcomer** | A Patch with **no Keeper** (it lapsed to 0, or was cleared by a Verdict and not Claim Sprayed) is still keeperless on a **town-event night** | A freshly generated cat becomes its Keeper at rival Scent 60 | §3.7.3 |
| **Turncoat** | A posted ex-Rival recruit's Loyalty over time (Crew, Nemesis) | It takes the Patch it guarded | §3.7.4 |

Every route ends in the same retake: a Standoff with the post's Keeper (Stale Claim for a Lost Patch or a turncoat; a normal contest for a newcomer at 60, whose `S_r` one Counter-Spray takes to 30), a Verdict, a Claim Spray. **No route moves an existing cat into a vacancy** (G3, G6): every new Keeper is the cat that took the post, or a newly generated one.

#### 3.7.2 Challengers (OR-16; Nemesis generates them, Territory resolves them)

A challenger is **a raid leader with a face by day**. It reuses the raid slot, raid resolution, the Standoff and the Verdict.

| | Rule (Territory's side in bold) |
|---|---|
| **Arrival** | Nemesis's calendar: the first in a district on the **second night after Mikan first holds ≥ 3 Patches there**, then every 4th night after that first one, skipped while one is active; ≤ 1 active per district. `ChallengerArrived(cat_id, district_id, patch_id, origin)`. Slice: Mikan first holds 3 Patches on night 3, so the challenger arrives on **night 5** and is announced in the **L2D4 Sniff** (sim: 100% of engaged runs) |
| **Target** | **Mikan's lowest-Scent held Patch in the district, never Low Wall Corner, never the Den; ties: the higher `base_yield`.** Territory answers Nemesis's query at step 3 |
| **By day** | It stands at the target post in a staking pose. Approach for a Standoff, then a fight (challenger + 1 Stray). **Win: a Verdict**, and the challenge ends. **Beating it never adds Scent** (G5): the reward is the Verdict and the end of its over-marking. Optional; it counts toward the day's encounters |
| **By night** | **Over-mark −10 on the target each night it is active** (from the night after it arrives; a posted Goofball: 0). From the night after it arrives it **takes the district's raid slot** with motive `challenge` against its target (exempt from "two nights running"). **Lost: it becomes the Patch's Keeper** (Stale Claim at 40). **Repelled twice: it leaves town** (Nemesis marks it `Gone`) |
| **If its post lapses or is Lost to a raid first** | It settles there as Keeper (rival Scent 60 if the post had lapsed). The challenge ends |
| **Links** | C3: its over-mark is decay pressure on influence, and a Patch it takes gets a new Keeper. C4: Chase Off is final, so challengers are how the town refills with faces. The calendar never reads which cats were Chased Off |

A truce cat whose 10-day truce ends with Regard < 75 comes back as a challenger for its old Patch (`origin = truce_end`, OR-13) on the next free calendar slot; Territory treats it exactly the same, except that its target is its old Patch if Mikan holds it (otherwise the rule above).

#### 3.7.3 Newcomers into keeperless Patches (OR-10, OR-14)

- A Patch is **keeperless** when its Scent lapsed to 0 (Open), or when a Verdict cleared its Keeper and nobody Claim Sprayed it. Territory reports it with `PatchChanged(keeper = none)`.
- Any keeperless Patch can be Claim Sprayed at once by Mikan (yours at 70, no fight).
- If it is still keeperless on a **town-event night** (Nemesis F6: one per district every 2–3 nights), Nemesis may fire a `TownEvent(newcomer, cat_id, patch_id)`: **a freshly generated cat** becomes its Keeper and Territory sets **rival Scent 60** in its Clowder (an outsider unless Nemesis seats it in the gang). Never an existing cat moved in (G3). This is the owner's "a new character will be created and own that place", and it fires exactly when Mikan lets a Patch lapse.
- The Den is never keeperless in the slice until the claim (the Boss is its Keeper; after his Verdict Mikan Claim Sprays it as part of the claim).

#### 3.7.4 Turncoats (OR-11; Crew and Nemesis own the trigger)

- **Eligible** (Crew/Nemesis): only an ex-Rival recruit, only while **posted as a Sentry**, only at Shifty Loyalty (< 30; a Schemer < 35) at step 1. Story recruits and the Friend Stray never betray.
- **Warning:** two consecutive mornings of **Wavering**: a Sniff item, the cat turned away on the Turf Board and the Rivals board, and a Turf Board line saying what fixes it ("Bring Kagi in off the post, or Share a Morsel").
- **Defection:** on the third night, `BetrayalTriggered(crew_id, patch_id)` (step 3). **Territory flips that Patch to the turncoat at rival Scent 40 (Stale Claim)**; the Sentry slot is vacated. It is shown in the Outsiders section of the Rivals board. **Never Low Wall Corner or the Den** (Territory declines the flip there and the cat simply leaves). The window and Strong rules do not block it: they protect against raids, and the two warning mornings are this route's protection.
- **Cancelled by** un-posting the cat, moving it to the Posse, or its Loyalty reaching 30+.
- **Rate** (Crew's sim, OR-11): 0% of reference runs; ≤ 10% under neglect.

### 3.8 The Caterwaul (live raid) and the presence rule (OR-08)

- If Mikan is **roaming during Night** (from the cat flap) when a forecast raid is due, it fires live at a seeded time in that Night as a **Caterwaul**: a yowl in the posted Sentry's voice (generic for Unwatched), a plume on the skyline, a ring around the scent compass, and a corner HUD marker. At most 1 per night; the Lane only (DR-17). A challenger's `challenge` raid is a Caterwaul like any other.
- **Window:** 120 s of roaming clock (the clock pauses in combat and menus, so the window pauses too). ×1.5 for a Crier or a Fraidy (×2.25 with both), +30 s on a High Perch Patch; cap 240 s. A Fraidy also moves the fire time to the first seconds of Night.
- **The presence rule.** If Mikan **reaches the Patch within the window**, `presence = true`: the raid resolves at step 2 by the normal formula (§4.5) with the guard term **×1.5**. On an Unwatched Patch, **Mikan is the guard** (his Style's `style_mod`, `guard_mod` 1.0, no counter, no pair). **This holds whatever happens in the brawl.** Arriving opens `EncounterStarted(opener = raid_defence)` with the posted Sentry as an AI guest within the 10-combatant cap (Combat). The fight decides only what fights decide: a Verdict on the raid leader if it is a Rival (one Verdict per fight) and Memory. A wipe in it is a loss (OR-01; at Night the clock stays where it is) and changes no Scent.
- **Ignore, go home, or miss the window:** the raid auto-resolves in step 2 as if Mikan were asleep. **Ignoring a Caterwaul is never worse than being asleep**, and showing up is never worse than ignoring it.
- Night pays no Morsels (canon). The rewards of a defence are a better-held post, the Verdict, Old Scores and Rival memory.

### 3.9 Tribute

1. **Per Patch** (step 4): `patch_tribute` (§4.2) for every held Patch, after tonight's raids.
2. **Seen** (§4.3), tracked **per Patch**: a Patch is seen if Mikan Rubbed or Sprayed there, or **had any encounter there (whatever its outcome)**, within the grace period. Full pay for 2 days after the last visit, then −20% a day, down to 0 (floor 0). Sentries do not count as a visit. "The district is seen" (Crew's Loyalty input) means any of its Patches is seen.
3. **Delivery:** `TributeDelivered(amount, by_district)`. The food is a physical pile on the Doorstep, with contents that reflect the Patches (tofu-shop okara, a persimmon, laundry-yard sparrow feathers wrapped round a sardine). Walking onto the Doorstep is the **automatic Tribute pick-up** (daily reset 3 of 3). It moves the Tribute into the Stash and opens the Morning Sniff.
4. **No `rounds`, no time scaling** (TE-2). Going home early, sleeping early, or **losing a fight** never changes Tribute. Only `seen` and Scent do.
5. **Life 1** pays Tribute (it is the hook). No raids happen in Life 1.

**Other Morsel sources:**
- **Field haul:** loot per Routed enemy in **daytime** fights (§4.7), carried until Mikan enters the garden, then Stashed. Night fights pay no Morsels. A challenger Routed by day pays as a Tough.
- **Caches:** 6 hidden one-time finds in the Lane (a dropped fish, a tipped bin), shown by the Whisker Sense compass, 10 Morsels each. They do not reseed (DR-18).
- No feeders, no daily scraps, no per-cat meals (DR-18 cuts).

**Shinies (slice):** 3 fixed one-time finds on Night rooftops, kept at the Stash. They have **no slice sink**: their sink (Rank III+ Lessons) is Backlog. There are only 3, they never accumulate, and they have no economic effect. They exist so the Night has its canon reward.

#### 3.9.1 Losing a fight: what it costs the economy (OR-01, OR-02)

A **loss** is a Posse wipe (every Posse cat Routed). Scram and a Rival fleeing are not losses; Life 1 tutorial fights cannot be lost. After a loss the clock jumps to Night (Day Loop), the street closes, and Mikan walks home to the Routed Evening.

| | Effect of a loss | Not done |
|---|---|---|
| **Field haul** | **20% of the day's field haul still carried is lost** (none in Life 1). The rest is banked when Mikan reaches the garden. Haul already banked earlier that day is in the Stash and safe | No `loot_held` from a loss (Snatch is cut) |
| **Stash** | Safe. Nothing is taken from it | — |
| **Tribute** | **Unchanged.** Tonight's Tribute is computed exactly as if Mikan had walked home (AC 4, AC 14) | — |
| **Territory** | **No change.** No Scent, influence, Keeper or Patch changes because of a loss | Mark Over, Snatch, the "+30 to the rival" contest rule are cut |
| **The day** | No Dusk, so **no Well-Fed** tomorrow; the rest of the day's marking, rescue Sprays, caches and Lot are lost to the closed street; the night runs as normal (tonight's raid resolves at step 2, with no Caterwaul because Mikan is home) | — |
| **Crew** | −3 Loyalty per Routed Posse cat (Crew) | — |

**The "lose on purpose" exploit stays closed** (§4.13): a wipe is dominated by Settle In in every currency, and it cannot touch Tribute.

### 3.10 Clout (slice: milestones only; points cut, TE-10.1)

| Rank | Milestone | Sentry slots (full game → slice) | Crew cap (full → slice) |
|---|---|---|---|
| House Pet | start | 1 → 1 | 6 → 6 |
| Lane Cat | hold your first Patch | 2 → 2 | 7 → 6 |
| Known Face | hold 3 Patches | 3 → **2** | 8 → 6 |
| Boss | claim Hidamari Lane (§3.5) | 4 → **2** | 9 → 6 |

Rank never drops. The slice clamps follow DR-01 (2 Sentry slots, Crew cap 6). Rank changes are announced in the Sniff and shown on Mikan's card on the Rivals board's Bell fence (UX). Cats may read Mikan's Clout as part of his visible standing (Nemesis: "Collar" taunts stop at Known Face); that is Mikan's own state, not what he did to another cat (G8).

### 3.11 The Stash

- Mikan's Morsel bank under the veranda. **Capacity 400** in the slice (Lot upgrades are cut).
- Tribute and the field haul go in automatically. What does not fit stays on the Doorstep as **Leftovers** and is gone at the next morning's delivery: a baffled Haru sweeps it away (a Narrative staging hook; nothing is refunded).
- **The Stash is always safe** (canon), including after a loss. Spending happens only at the Lot (Lessons, Share a Morsel) and at a Verdict (a **Recruit** costs a Bribe from the Stash).
- **Bribes (Crew, 2026-11-24):** Life 1 recruits are free. **From Life 2 a Recruit always costs Morsels** (fair or feast; the free "none" tier is cut). If the Stash is short of fair, the Recruit card is greyed with "Stash short"; **Chase Off is always available** and Nose-Touch follows its own gate, so a Verdict is never blocked (PP-12, amended).
- **No food enters the house before Life 8** (DR-23). The Doorstep is outside.

### 3.12 Teaching order (Territory items; UX owns the beat sheet)

| Day | Life/day | Territory beat |
|---|---|---|
| 1 | L1 D1 | Low Wall Corner short escalation (PP-03; its Keeper is an untracked Stray), the Claim Spray, wisps. The first Tribute lands on the day-2 Doorstep |
| 2 | L1 D2 | Togemaru, the First Thorn, at Laundry Pole Yard's gatepost; a normal "fight to clear, spray to claim" contest; the three-card Verdict; Doorstep and the 1-item Sniff |
| 3 | L2 D1 | Persimmon Alley take. The rescue Spray (Low Wall Corner and Laundry Pole Yard have dropped below Strong overnight). **The influence bar** first appears (key-screens §7.4: from L2D1). No posting yet |
| 4 | L2 D2 | **First forecast raid** in the Sniff. **Sentries and the Turf Board**, first taught as the answer to that forecast: one posting decision, on the forecast Patch (PP-11). Cat flap (K2.3 at Dusk) and the **first Caterwaul** that Night (the presence rule) |
| 5 | L2 D3 | **Lessons** open at the Lot. Tofu Shop Step take (Captain Kagi; Recruit costs a fair Bribe). For a player who rescue-Sprayed that morning, **the Claim Spray fills the bar and Daifuku comes down** (§3.5) |
| 6 | L2 D4 | **"A stranger's scent":** the challenger is announced (Sniff, Rivals board Outsiders gate, Turf Board stamp, compass tick) and stakes the weakest post. **Daifuku on his patrol** (Day Loop's reference attempt; a loss plays OR-01) |
| 7 | L2 D5 | The rematch at a patrol stop, the Verdict, **the Den Claim Spray** (`DistrictClaimed`). The claim-night pile is shown on the title card |

UX owns the beat sheet (`ux/key-screens.md` §7.4): one headline per day, with Sentries and the Turf Board on Life 2 day 2, Lessons on Life 2 day 3, and the window and the challenger on Life 2 day 4. The Turf Board's first use stays one decision (≤ 45 s, OR-17 trims).

### 3.13 Interactions summary

Territory consumes `EncounterEnded` (loot, `seen`; **never Scent**), `VerdictApplied` (`chase` / `recruit` / `nose`: the post is cleared and Claim Spray offered; a Boss Verdict enables the Den Claim Spray), `RaidRequested` (motive ∈ {`grudge`, `gang_orders`, `gloat`, `challenge`}), `ChallengerArrived`, `TownEvent(newcomer)` (a new Keeper at 60), `BetrayalTriggered` (live from Life 2), `HomeArrived` (banks the haul; `routed` applies the 20% loss first), `PhaseChanged` / `DayEnded`. It emits `PatchChanged`, `MarkApplied` (proposed), `RaidResolved` (+ `presence`), `InfluenceChanged`, `BossWindowChanged`, `DistrictClaimed` and `TributeDelivered`. It queries `PowerRating(cat_id)` and `Loyalty(cat_id)` from Crew, and answers Nemesis's challenger-target query.

---
## 4. Formulas

All values are tuning starts (see §7). Rounding: Scent is an integer (decays floor-rounded); influence rounds half up; Tribute is summed, then floored; loot rounds half up.

### 4.1 Nightly Scent (step 2)

```
decay   = floor( (base_decay + border × rival_neighbours) × home_mult × brooder_mult )
refresh = sentry_refresh   if Watched, else 0
scent'  = clamp( scent − decay + refresh, floor, 100 )
scent'' = scent' − overmark                   (challenger over-mark, if this Patch is staked)
          then the raid outcome (§4.5); at 0 the Patch lapses to Open (keeperless)
rival:   S_r' = min(ceiling, S_r + 8)   if the post has a Keeper;   S_r − 10 (floor 0) if keeperless
```

| Variable | Value / range | Meaning |
|---|---|---|
| base_decay | 10 | Lost per night, **for everyone's held posts, Mikan's included** |
| border | 2 | Per adjacent Patch held by a rival or outsider Clowder (Open Patches do not press) |
| rival_neighbours | 0–3 | From §3.1 |
| home_mult | 0.5 LWC, else 1 | Home Ground |
| brooder_mult | 0.5 with a posted Brooder, else 1 | — |
| sentry_refresh | 10; Crier 14; 0 if Routed-for-a-night | — |
| floor | 10 LWC, else 0 | — |
| overmark | 10 while a challenger stakes the Patch, from the night after it arrives; **0 with a posted Goofball** | OR-16, OR-15 |
| ceiling | outer 80; Den 100; Stale Claim 60 for 3 nights | Rival Keeper's resting Scent |

**Range:** −26 to +6 per night for a held Patch (−16 decay − 10 over-mark, before a raid). **Examples:**
- A fresh claim (70), Unwatched, two rival neighbours: −14 → 56. **It drops below Strong after one night** (its influence share drops from 25 to 23), so a frontier claim wants a Sentry or a rescue Spray the next day.
- Watched, one rival neighbour: −12 + 10 = −2 a night. From 90 it takes 15 nights to drop below Strong.
- Unwatched, no rival neighbours, from 90: 80, 70, 60, then 50 on night 4 (below Strong); 0 on night 9.
- Staked by a challenger, Watched by a Schemer Crier, one rival neighbour: −12 + 14 − 10 = −8 a night; by a Goofball Crier instead: −12 + 14 − 0 = **+2**.

### 4.2 Patch Tribute (step 4)

```
patch_tribute = base_yield × band_mult × watch_mult × (1 + min(bonus, 0.35) − clash)
bonus         = braggart + full_house
clash         = 0.10 per clashing Sentry posted on an adjacent Patch (§3.6), else 0
```

| Variable | Value | Source |
|---|---|---|
| base_yield | 8 / 10 / 12 / 14 / 18 | §3.1 |
| band_mult | 0.6 / 0.9 / 1.0 / 1.0 | Faint / Clear / Strong / Pungent (TE-9 shape) |
| watch_mult | 1.0 Watched · 0.8 Unwatched | §3.6 |
| braggart | 0.10 | Braggart posted |
| full_house | 0.10 | All 5 Lane Patches held |
| clash | 0.10 per clashing posted neighbour | §3.6 (outside the clamp) |

*(The Humbled bonuses, 0.15 and 0.25 with a Goofball, are deleted with Humble, OR-15. The clamp is kept for the full game's stacking perks.)*

A Scuffed Patch pays 0 tonight and loses the same again off the pile (`loot_held` = 2 × `patch_tribute`, §3.7); a Lost Patch pays nothing and also loses 2 × its `patch_tribute`. The night's total never goes below 0.
**Range per Patch:** 3 (LWC, Faint, Unwatched) to 21.6 (Den: Strong, Watched by a Braggart, Full House: `18 × 1.2`).
**Example:** Tofu Shop Step, Strong, Braggart posted, Full House: `14 × 1.0 × 1.0 × 1.20 = 16.8`.

### 4.3 Seen and the nightly total

```
seen_p   = 1.0                                        if days_since_visit_p ≤ grace
         = max(0, 1.0 − step × (days_since_visit_p − grace))   otherwise
tribute  = floor( Σ_p  seen_p × patch_tribute_p )
```

grace = 2, step = 0.20, floor 0 (DR-46, TE-3). A visit is a Rub, a Spray or **any encounter on the Patch, whatever its outcome**. A Patch unvisited for 2 days still pays in full; then it pays 0.8, 0.6, 0.4 and 0.2, then nothing. **A total of 4 days' pay after the last visit**, while its Scent decays to lapse.

### 4.4 Upkeep

`upkeep_night = 2 × posts_filled` (Lane, `2 × district_index`). It is paid in step 2; any post the Stash cannot cover gets Short Rations (`guard_mod × 0.8`). Range in the slice: 0–4 per night.

### 4.5 Raid auto-resolve

```
attack      = motive_mod × Σ PR(raiders)
guard_term  = home_adv × PR(guard) × style_mod × guard_mod × counter × pair × rations × old_score / attack
              (guard = the posted Sentry; if Unwatched: 0, or Mikan when presence = true)
sentry_term = guard_term × (presence_mult if presence else 1)
scent_term  = 0.005 × scent
R           = sentry_term + scent_term + fixed_bonus
p_hold      = clamp( R³ / (R³ + 1), 0.05, 0.95 )
u           = rng(save_seed, day_index, step=2, "territory", patch_id, 0)
outcome     = Repelled if u < p_hold² ; Scuffed if u < p_hold ; else Lost
              then: Lost → Scuffed if scent ≥ 60, or the Boss window is open (outer Patches), or motive = gloat
```

| Variable | Value | Notes |
|---|---|---|
| PR(x) | Crew's `PowerRating` | Only ratios matter |
| home_adv | 1.5 | A cat on its own wall |
| style_mod | Bruiser 1.25 · Scrapper 1.10 · Yowler 1.00 | §3.6 (Mikan: his Style's value) |
| guard_mod | Stalwart 1.5 · Braggart 1.25 · Brooder/Schemer/Goofball 1.0 · Fraidy 0.75 | §3.6 (Mikan: 1.0) |
| old_score | 1.25 if `grudge` and the Sentry has an Old Score with the leader, else 1 | §3.7 |
| counter | 2.0 if the Sentry's personality counters tonight's motive, else 1 | §3.6 (Mikan: 1) |
| pair | 1 + 0.25 × (bonded posted neighbours) − 0.25 × (clashing posted neighbours); range 0.5–1.75 | §3.6 (Mikan: 1) |
| presence_mult | **1.5** when Mikan reached the Patch within the Caterwaul window, whatever the brawl's result | §3.8, OR-08 |
| PR(raiders) | Slice assumption, as ratios of a Sentry's PR (Crew owns PowerRating): Tough leader 1.0, Captain leader 1.5, Stray escort 0.6; **a challenger is a Tough leader (Lives 1–2)** | Party per motive, §3.7 |
| rations | 1.0; 0.8 on Short Rations | §4.4 |
| fixed_bonus | High Perch 0.15, else 0 | §3.1 |
| motive_mod | 1.0–1.15 | §3.7 |

Loyalty does not enter the formula (DR-11: Loyalty no longer affects stats). **No term reads a fight's outcome.**

**Worked odds, base case** (no counter, no neighbours; raiders at the Sentry's PR; post-decay Scent 50, Clear, window shut, so Lost is possible):

| Sentry | vs 1 raider, `grudge` (attack 1.15) | vs 2 raiders, `gang_orders` (attack 2.2) |
|---|---|---|
| Unwatched | R 0.25 → Rep 0% · Scuff 5% · **Lost 95%** | same |
| Fraidy Yowler | R 1.23 → 42 / 23 / 35 | R 0.76 → 9 / 21 / **69** |
| Goofball/Schemer/Brooder Scrapper | R 1.69 → 68 / 14 / 17 | R 1.00 → 25 / 25 / 50 |
| Braggart Scrapper | R 2.04 → 80 / 9 / 11 | — |
| Stalwart Bruiser | R 2.70 → **90 / 5 / 5** (clamped) | R 1.53 → 61 / 17 / 22 |

Arithmetic (Stalwart Bruiser, single raider): `1.5 × 1.25 × 1.5 / 1.15 = 2.445`; `+ 0.25 = 2.695`; `R³ = 19.57`; `p = 0.951 → 0.95`; Repelled `0.95² = 0.9025`.
**If the same Patch had been Sprayed that morning** (Scent 80 after decay), every Lost becomes Scuffed. The rescue Spray removes the risk of losing the Patch **and keeps its full influence share**. Only a good Sentry turns Scuffed (stolen Tribute, a Routed cat, −20 Scent) into Repelled. **That split is the daily decision:** Spray decides whether you can lose the Patch; the cat decides whether you lose the night.

**Worked odds against a challenger.** `challenge`, a Tough challenger + 1 Stray: `attack = 1.10 × 1.6 = 1.76`. Its target at 54 after decay and over-mark (Clear; window shut):
- Kagi (Schemer Yowler, the counter): `1.5 × 1.0 × 1.0 × 2.0 / 1.76 = 1.70`, `+ 0.27 = 1.97` → p 0.89, **Repelled 78%**, Lost 12%. Best odds of ending the challenge (two Repels send it out of town).
- Pon (Goofball Yowler): he cancels tonight's over-mark, so the post sits at **64, Strong: it cannot be Lost**. `1.5 × 1.0 / 1.76 = 0.85`, `+ 0.32 = 1.17` → p 0.62: Repelled 38%, Scuffed 62%, **Lost 0%**, and the influence share stays full.
- Hige (Stalwart Bruiser): `1.5 × 1.25 × 1.5 / 1.76 = 1.60`, `+ 0.27 = 1.87` → p 0.87, Repelled 75%, Lost 13%. Nearly as good, but he is the Posse's anchor, and he clashes with Kagi if she is posted next door.
- Unwatched, Mikan answers the Caterwaul (Scrapper Mikan, presence): `1.5 × 1.10 × 1.5 / 1.76 = 1.41`, `+ 0.27 = 1.68` → p 0.83, Repelled 68%.

**Worked odds with the presence rule** (`grudge`, Tough + 1, `attack` 1.84, Scent 50): Hige posted, Mikan absent → p 0.85, Repelled 72%; Hige posted, Mikan present → `2.29 + 0.25 = 2.54` → p 0.94, **Repelled 89%**; Unwatched, Mikan present → `1.35 + 0.25 = 1.60` → p 0.80, Repelled 64% (instead of Lost 95%). A guarded post usually holds when Mikan shows up (OR-08).

### 4.6 Caterwaul window

`window = min(240, 120 × crier × fraidy + perch)` seconds of roaming clock, where crier = 1.5 if a Yowler is posted on the Patch, fraidy = 1.5 if a Fraidy is posted, and perch = 30 on a High Perch. Examples: plain 120 s; Fraidy Yowler on Laundry Pole Yard `120 × 2.25 + 30 = 300 → 240`. Reaching the Patch inside it sets `presence` (§4.5).

### 4.7 Field haul (daytime fights only)

```
loot  = round_half_up( rank_mult × (1 + 0.5 × L) )
belly = 12 × (1 + 0.5 × L_mikan)     # Stray/Tough/Critter loot past this, today, pays ×0.25
carried_after_loss = 0.8 × carried    # OR-02; Life 1: × 1.0
```

rank_mult: Critter 0.5 · Stray/Tough 1 · Captain 4 · Boss 10. A challenger pays as a Tough. The first Rout of a named Captain or Boss is exempt from Full Belly. The same Rival Routed again today pays ×0.25.
Worked values: Lv 1 Tough 2 · Lv 4 Tough 3 · Lv 8 Tough 5 · Lv 6 Captain 16 · Daifuku (Lv 8) 50. Full Belly at Mikan Lv 2: 24; at Lv 8: 60. A grinder therefore gains at most about 25% over a normal day's haul, and the 12–16 min clock bounds it further. A loss with 30 Morsels carried banks 24.

### 4.8 Price sheet (one sheet, DR-14; TE-X2, TE-X3, TE-X4)

| Item | Price | Slice notes |
|---|---|---|
| Lesson | Rank I **40** · Rank II **120** · (III 300 · IV 600 Backlog); ×1.5 cross-Style (60 / 180) | Lessons I–II only. Mikan learns up to 3 a day, others 1 (DR-38) |
| Bribe (the Recruit Verdict) | **fair = 8 × level × rank_mult** · feast = 2 × fair; rank_mult Stray 0.75 · Tough 1 · Captain 2 · Boss 4 | Paid from the Stash at the Verdict. **Life 1 recruits are free. From Life 2 there is no free tier** (Crew, 2026-11-24): Recruit is greyed below fair. Story recruits and the Friend Stray cost nothing |
| Share a Morsel | **Σ Crew levels**, once a day, whole Crew, +2 Loyalty | Daily reset 1 of 3 |
| Upkeep | 2 per post per night | Auto |

Examples: a Lv 6 Captain costs 96 fair / 192 feast; Daifuku at Lv 8 costs 256 / 512; a Crew of levels 8+7+7+7+8 costs 37 to Share. Chase Off and Nose-Touch cost nothing (OR-12).

### 4.9 Stash

`stashed = min(incoming, 400 − stash)`; `leftovers = incoming − stashed`, which rot at the next delivery. `stash ≥ 0` always: no purchase is allowed below 0, and upkeep degrades to Short Rations instead.

### 4.10 Patch level (TE-X14)

`patch_level = floor((band_lo + band_hi) / 2)` of the district's level band: Lane (1–8) **4**. Full game: Arcade 13, Shiosai 23, Summit 29. Crew's Turf XP reads it.

### 4.11 The slice economy, day by day (reference player)

*Source: `design/reviews/owner-feedback/sim/territory_economy_sim.py` (2,000 seeds; output `territory_economy_sim.out.txt`). Before-figures come from the round-3 and round-2 sims, kept beside it as `territory_*.before.out.txt`.*

**Reference player.** Plays every day to the clock, goes home by Dusk except on the cat-flap night (it answers that night's Caterwaul: presence), Shares a Morsel daily, buys Lessons when the Stash allows (days 4, 6, 7), Recruits Togemaru on day 2 (free, Life 1) and Kagi on day 5 (fair, 96), posts by reading the forecast, rescue-Sprays every prompt, and fights the challenger when it finds it (70% a day). Claim path (Day Loop §3.9): Low Wall Corner (day 1), Laundry Pole Yard from Togemaru (day 2), Persimmon Alley (day 3), Tofu Shop Step from Kagi (day 5; **the window opens at this Claim Spray**), Daifuku attempted on his patrol on day 6 and **lost** (OR-01; Day Loop's reference), the rematch and the Den Claim Spray on day 7. Daifuku's Verdict is free (Chase Off or Nose-Touch; his fair Bribe of 256 is out of reach).

**Assumptions** (flagged to the owners): Crew levels as Crew §3.3 (Posse level at Daifuku 7–9); daytime Routs 8 on day 1, 10 a day after that; one cache a day on days 2–5; field haul 14 / 25 / 30 / 35 / 56 / 40 / 40 + Daifuku's 50; the day-6 loss comes after 75% of the day's fights (`40 × 0.75 × 0.8 = 24`); raid motives `grudge` 45% / `gang_orders` 30% / `gloat` 25%, Captain-led 30% (Nemesis owns these); a challenger is a Tough leader + 1 Stray; only Hige is Warden-eligible (True at 60).

**Scent and posting, night by night** (one seeded run in which every raid is Repelled and the challenger is beaten on day 6; Scent after decay and raids; r = rival-held):

| Night | Held | Posts (night) | Raid | LWC | LPY | PA | TSS | DEN | Influence | Tribute computed |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | LWC | — | — | 63 | r | r | r | r | 25 | **6** |
| 2 | +LPY | — | — | 57 | 56 | r | r | r | 47 | **13** |
| 3 | +PA | — (taught tomorrow) | — | 85 (Sprayed) | 78 (Sprayed) | 58 | r | r | 74 | **23** |
| 4 | 3 | Togemaru @LPY, Pon @PA | `grudge` → PA (Sprayed to 90; Pon counters) → Repelled; Mikan present | 80 | 76 | 87 | r | r | 75 | **29** |
| 5 | +TSS (window opens) | Hige @LPY, Togemaru @TSS | `gloat` → LPY → Repelled | 75 | 69 | 77 | 68 | r | **100** | **41** |
| 6 | 4 (Daifuku lost) | Hige @LPY, Togemaru @TSS | challenger beaten by day: its `challenge` raid declined | 70 | 67 | 67 | 66 | r | 100 | **41** |
| 7 | +DEN (claimed) | Togemaru @PA, Pon @TSS | `grudge` → TSS → Repelled | 65 | 57 | 67 | 65 | 60 | 99 | **60** |

Tribute arithmetic, night 7 (Full House): LWC `8 × 1.0 × 0.8 × 1.1 = 7.04`; LPY `10 × 0.9 × 0.8 × 1.1 = 7.92`; PA `12 × 1.0 × 1.0 × 1.2 = 14.4` (Togemaru, Braggart); TSS `14 × 1.0 × 1.0 × 1.1 = 15.4`; DEN `18 × 1.0 × 0.8 × 1.1 = 15.84` → 60.6 → **60**. Inside 54–66 (canon ≈ 60). Togemaru and Pon are adjacent and bonded (`pair` 1.25 each), which pays nothing but guards better. Hige, the only Warden-eligible cat, went back to the Posse for the rematch, so the Den is Unwatched on its first night.

**The reference across 2,000 seeds** (means; minimum in brackets):

| Day | Life | Doorstep Tribute | Field + cache | Spend (Share, Lessons, Bribe) | **Stash (end of day)** | Patches held | Influence | Raid nights: Rep / Scuff / Lost |
|---|---|---|---|---|---|---|---|---|
| 1 | L1 D1 | 0 | 14 | 0 | **14** (14) | 1 | 25 | — |
| 2 | L1 D2 | 6 | 35 | 3 | **52** (52) | 2 | 47 | — |
| 3 | L2 D1 | 12 | 40 | 10 | **94** (94) | 3 | 74 | — |
| 4 | L2 D2 | 23 | 45 | 57 (Lesson I) | **101** (101) | 3 | 75 | .90 / .10 / 0 |
| 5 | L2 D3 | 26.5 | 66 | 107 (Kagi fair in 90% of runs) | **82** (75) | 4 | **100** | .85 / .15 / 0 |
| 6 | L2 D4 | 38 | 27 (the loss) | 72 (Lesson I) | **71** (43) | 4 | 99 | .25 / .04 / 0 (the rest: challenger beaten, raid declined) |
| 7 | L2 D5 | 39.3 | 91 (Daifuku 50) | 48 | **149** (88) | 5 | 98 | .69 / .11 / 0 |
| night 7 | claim night | **57.8** computed (title card) | | | | | | |

- **Totals (days 1–7):** Tribute delivered 145 + field and caches 318 = **463**, plus the claim-night pile of 58. Sinks used: Share 120, two Lessons 80, Kagi 96 (in 90% of runs; the other 10% buy Lesson II on day 7 instead), upkeep ≈ 14.
- **The Captain's Bribe binds.** In 10% of runs a Scuffed night 4 (2× `loot_held`) leaves the day-5 Stash below 96, and Kagi cannot be Recruited (no free tier in Life 2): the player Chases her off or Nose-Touches her, and the Lane has no Schemer. A day-4 Lesson and a day-5 Captain are both affordable only on a clean night 4 (AC 6).
- **Lesson II (120)** is affordable on day 8 (Stash ≈ 216), not inside the slice.

**Before → after (owner rulings).**

| Figure | Before (iteration 3) | After (this pass) | Why |
|---|---|---|---|
| District goal | Den opens at 3 of 4 outer Patches held (L2D1) | Boss window at influence 100 = all four outer Strong (L2D3, at the TSS Claim Spray) | OR-09 |
| Claim day (reference) | L2D4 fast path, L2D5 after one wipe | **L2D5** after one loss (Day Loop) | OR-01, OR-09 |
| Claim-night Tribute | 65 hand / 60.8 sim (night 6, with a Humbled Daifuku) | **57.8** sim mean / 60 trace (night 7) | Humble removed (OR-15) |
| Stash at the slice's end | 128 (day 6) / 82 (day 7, after Lesson II) | **149** (day 7; min 88; Lesson II on day 8) | Lesson II slips a day |
| Income days 1–7 (sim) | 574 (Tribute 234 + field 340; round-2 sim) | **520** (Tribute 203 + field 317) | Claim a day later; one lost day's haul |
| Pre-claim Lost risk | none after L2D1 (Den-Open rule) | possible on sub-Strong posts until the window opens; **0 for the reference**, ≈ 0.2 a night for the casual player | OR-09 replaces the Den gate |
| Challengers | none | 1 in the slice (L2D4 Sniff, 100% of runs); 2 by day 10 | OR-16 |

**Other player types (same world assumptions; 2,000 seeds; Stash at the end of each day, means):**

| Player | Policy | D1 | D2 | D3 | D4 | D5 | D6 | D7 | Income d1–7 | What it shows |
|---|---|---|---|---|---|---|---|---|---|---|
| Engaged reference | above | 14 | 52 | 94 | 101 | 82 | 71 | 149 | **520** | Every sink used; the anchor is met |
| Casual | claims PA d4, TSS d6; 60% visits; half the rescue Sprays; random posts; Shares on even days; fights the challenger 30% | 10 | 42 | 86 | 114 | 138 | 51 | 119 | 346 | Slower, never stuck (window by day 10 in 68% of runs, claim in 62%; 84% claim by day 14) |
| Sleep-skip | sleeps at wake from day 3 | 14 | 55 | 67 | 79 | 84 | 90 | 93 | 95 | Tribute → 0 by night 8; influence falls to 4 |
| Rub-skip | Rubs Low Wall Corner only from day 3 | 14 | 45 | 57 | 69 | 74 | 81 | 87 | 92 | ≤ 6 a day; Low Wall Corner only |
| Patrol + Settle In | 3 Patches, posts, rescue Sprays, one fight, Settle In from day 4 | 14 | 42 | 74 | 80 | 88 | 82 | 70 | 231 | Legitimate management play; no window, no claim |
| **Patrol + lose on purpose** | the same, but throws the first fight from day 4 | 14 | 42 | 74 | 79 | 85 | 78 | 65 | **226** | **Strictly worse than Settle In** (§4.13) |
| Struggler | casual claims two days later, wipes every day from day 3, never posts | 10 | 42 | 63 | 69 | 46 | 47 | 64 | 159 | No death spiral: Stash ≥ 10, ≥ 1 Patch, influence ≥ 4 |

The idlers' Stashes look close to the reference's only because they buy nothing: the reference has spent ≈ 310 on Share, Lessons, Kagi and upkeep by day 7. Income is the fair measure, and every idle or skip policy earns 18–45% of the reference's.

### 4.12 Night 6: the daily decision in numbers

*Life 2 day 4, the morning after the challenger arrived. The window is open (influence 100), so nothing can be Lost tonight; the stakes are Scuffed versus Repelled, the influence bar, and the challenger's clock. Today is also Daifuku's day: whoever is posted is not in the Posse that fights him.*

Morning of day 6: the Sniff shows "A stranger's scent" (a silhouette) staking **Tofu Shop Step** (68 last night, the weakest post; ties go to the richer Patch). Tonight TSS decays −12 (the Den next door is rival-held) and takes the challenger's −10 over-mark. `challenge`: `attack = 1.10 × 1.6 = 1.76`.

| Option | TSS at resolution | Odds | TSS Tribute tonight (expected) | Influence share (Repelled / Scuffed) | Other stakes |
|---|---|---|---|---|---|
| A: nobody on TSS | 46 (Clear) | p 0.05: Scuffed 95% | **−10** (2× `loot_held`) | 17 / 11 | The bar drops toward 75; the challenger stays |
| B: **Kagi** (Schemer Crier, the counter) | 60 (Strong) | p 0.89: **Repelled 79%** | **+7.3** | 23 / 17 | One more Repel sends the challenger out of town. Kagi is a fresh ex-Rival at Loyalty 40: leave her out there too long while she sours and she may Waver (OR-11) |
| C: **Pon** (Goofball Crier) | 70: **no over-mark** | p 0.63: Repelled 40% | −1.9 | **25** / 21 | Keeps the post Strong and the bar full; the challenger lingers |
| D: **Hige** (Stalwart Bruiser) | 56 | p 0.87: Repelled 75% | +6.4 | 21 / 15 | Nearly B's odds, but the Posse loses its anchor on Daifuku's day |
| E: **find it by day** and Rout it (≈ 2 min, before Daifuku) | 56 Unwatched (no over-mark, no raid); 66 with Togemaru posted | the raid is declined | +10 Unwatched; +15 with Togemaru | — | A Verdict on a new cat; ends the challenge; costs clock on the Boss day. **It adds no Scent** (G5) |

The spread between the worst answer (A) and the best (B, or E with a post) is ≈ 17–25 Morsels on a ≈ 40 night, plus the influence that keeps the window open. The right answer depends on the threat, on who is next door, and on who the Posse needs today, and the player can read all three from the Sniff and the Turf Board's Tonight panel in under a minute. Across the four motives the best guard on the threatened Patch is four different cats (sim: `grudge` → Pon, `gang_orders` → Hige, `gloat` → Hige or Togemaru, `challenge` → Kagi).

### 4.13 Exploit and death-spiral checks (DR-57, OR-02)

- **Sleep-skip** (sleep at wake, never go out): every Patch pays in full for 2 days, then 0.8 / 0.6 / 0.4 / 0.2, then 0. Sim: Tribute 12, 5, 6, 3, 2, then **0 from night 8**; influence decays to Home Ground's 4. No Clout, XP, Crew or story progress: Life 2 cannot end without the claim. Income days 1–7: 95 (reference 520).
- **Rub-skip** (step outside, Rub Low Wall Corner, go home): only LWC stays seen; ≤ 6 a day. Income 92.
- **Patrol-skip** (rescue-Spray the held Patches, post, one fight, Settle In): ≈ 25 a night, income 231, but no new Patches, no window and no claim. Legitimate management play, not an exploit: Morsels are not the slice's bottleneck (sinks are finite), and the Stash cap of 400 turns hoarding into rot.
- **Lose on purpose (wipe-skip), closed (OR-02):** the same patrol morning, then throwing the first fight. **Tribute is identical** (it cannot read a loss), the haul is ×0.8, and the day also loses Well-Fed, Bond and 3 Loyalty per Routed Posse cat. Sim income **226 vs 231** for Settle In. A wipe is dominated by Settle In in every currency. *Known residue, accepted (OR-02):* a wipe before clock 240 ends the outing sooner in real time than Settle In can; its costs are real and the day gates are unchanged.
- **Lose on purpose to the Boss:** it buys a −10% max-Nerve plaster and a Calm rematch (anger spent, OR-07), at the price of a whole day (the clock, −20% haul, no Well-Fed, Loyalty). This is the designed "spent whether you lose or not", and it changes no territory. **Scram does not spend anger** (Nemesis), so engage–flee–re-engage is no reset.
- **Influence decays every night whatever you do,** so every skipped day is one more night of decay, and a skipped Spray is a thinner bar.
- **Fight outcomes cannot be farmed for territory:** no Rout, wipe or win moves Scent or influence (G5; AC 16b).
- **Death spiral:**
  - No debt. The Stash is always safe, after a loss too.
  - Home Ground can never be lost, raided, staked or turned (Tribute floor ≈ 4 a day, influence ≥ 4).
  - The window rule removes Lost while the player is on the Boss; the Strong rule means a Patch falls only after a visible warning night (thin wisps, Spray prompt, forecast).
  - Every taken Patch comes back in one 60–90 s Standoff and a Claim Spray; a lapsed one comes back with a Claim Spray alone until a newcomer arrives.
  - Field haul does not depend on territory. Each Boss loss leaves him −10% max Nerve.
  - **Struggler** (wipes every day from day 3, never posts; 12 days): Stash never below 10, never fewer than 1 Patch, influence never below 4, Tribute 4–13 a night from night 6 (raid nights with 2× `loot_held` can floor a small night at 0).
  - **Challenger without defence** (§4.11 defence table): the engaged player who ignores it loses the staked post in 6% of runs (the window protects it) but 40% of nights 6–10 Tribute (no posts); the casual player who ignores it loses the post in 92% of runs and ends day 10 with 3.3 Patches and influence 63. Posting and fighting cut that to 47%. **A real decision, not a spiral:** the worst case is a Stale Claim Standoff, never a collapse.
  - The worst case is "slower", never "stuck". **Watch item:** the casual player's claim slips (window by day 10 in 68% of runs, claim in 62%; 84% by day 14) because the full-influence gate needs all four posts Strong at once (§7 `I_full`, owner question 5).

**The challenger: what defending is worth** (sim, 10 days; the second challenger is due on night 9):

| Player | Defence | Staked Patch taken | Left after 2 Repels | Beaten by day | Tribute nights 6–10 | Patches held, night 10 | Influence, night 10 |
|---|---|---|---|---|---|---|---|
| Engaged | posts + fights it by day | 0.01 | 0.08 | 1.61 | 270 | 4.99 | 99 |
| Engaged | posts only | 0.05 | 0.99 | 0 | 258 | 4.96 | 96 |
| Engaged | ignores it (no posts, no fight) | 0.06 | 0 | 0 | 164 | 4.97 | 93 |
| Casual | posts + fights it by day | 0.47 | 0.05 | 0.46 | 138 | 4.00 | 79 |
| Casual | posts only | 0.82 | 0.13 | 0 | 129 | 3.93 | 77 |
| Casual | ignores it | 0.92 | 0 | 0 | 64 | 3.27 | 63 |

### 4.14 District influence and the Boss window (OR-08, OR-09)

```
I(c, d) = round_half_up( 100 × Σ_{p ∈ outer(d), owner(p) = c}  min(scent_p, 60) / 60  ÷  n_outer(d) )

window_open' = true    if not claimed(d) and I(mikan, d) ≥ I_full          (after any Scent change, and at step 2)
             = false   if window_open and I(mikan, d) < I_close             (at step 2 only)
             = window_open otherwise
```

| Variable | Value / range | Meaning |
|---|---|---|
| `c` | a Clowder | Mikan's bell Clowder, a gang, or an outsider |
| `outer(d)` | the Lane: LWC, LPY, PA, TSS | The district's Patches minus its Den |
| `n_outer` | 4 in the Lane | Each Strong outer Patch is worth `100 / n_outer` = **25** |
| `scent_p` | 0–100 | Capped at 60 (Strong) for the share |
| `I_full` | **100** | Full influence: all four outer Patches Strong at once (owner question 5, default) |
| `I_close` | **75** | Hysteresis: one outer Patch may fade or fall without closing the window |
| Output | 0–100 | Mikan's Lane value never below 4 once LWC is his (`10/60 × 25 = 4.2`) |

**Examples:**
- Life 2 day 3 evening (OR-08): LWC 80, LPY 66, PA 48, TSS 70 → `25 + 25 + 20 + 25 = 95`. Rescue-Spray PA → 100: the window opens.
- The window is open; a challenger's over-mark and a Scuffed take TSS from 66 to 36: `25 + 25 + 25 + 15 = 90` → stays open. A second post fading to 40 too: `25 + 25 + 16.7 + 15 = 82` → still open. Two posts at 30: `75` → open; one more point lost → closes at step 2.
- A post Sprayed to 90 and left Unwatched (no rival neighbours): 25, 25, 25 for three nights, then 20.8, 16.7, 12.5, 8.3, 4.2, 0 (lapses on night 9).

### 4.15 Challenger pressure (OR-16; Territory's terms)

```
arrival_1   = N3 + 2            N3 = the first night at whose step 3 Mikan holds ≥ 3 Patches in the district
arrival_k   = arrival_1 + 4(k−1)   skipped while a challenger is active; ≤ 1 active per district
target      = argmin_{p held, p ∉ {LWC, Den}} (scent_p, −base_yield_p)
overmark_n  = 10 × [n > arrival night] × [no Goofball posted on target]
raid_n      = challenge (attack = 1.10 × (1.0 + 0.6)) on target, for n > arrival night
ends        = Verdict by day · 2nd Repelled (Gone) · Lost (it becomes Keeper) · target lapses (it settles as Keeper)
```

Slice values: N3 = 3 (Persimmon Alley claimed on L2D1), so arrival_1 = **night 5**, announced in the **L2D4** Sniff; arrival_2 = night 9 (outside the 7-day slice). With a Schemer Crier posted on a target with one rival neighbour, the target moves `−12 + 14 − 10 = −8` a night before the raid (−13 after a Repelled); with a Goofball Crier, `+2`. Left to the night with a sensible post, the challenger leaves after its second Repelled night in almost every engaged run (§4.11, the defence table).

---

## 5. Edge Cases

| Situation | Resolution |
|---|---|
| A raid is requested on a Patch the player loses or retakes before it resolves | Lost before it resolves: declined. Retaken today: immune, declined |
| A raid is requested on a Strong Patch | Admitted; worst case Scuffed. The Sniff still forecasts it, because the Sentry choice still matters |
| The player moves the Sentry away from the forecast target | The raid resolves against tonight's actual posts. The forecast names the Patch, never the guard |
| Two Patches are forecast | Cannot happen (≤ 1 per district per night, challenger first). If Nemesis sends more, Territory keeps the `challenge` raid, else the one against the lowest Scent, and declines the rest |
| Caterwaul fires during a fight, Standoff or menu | The window counts roaming clock only, so it waits |
| The raid's seeded time falls inside a Sunspot nap's skipped half-phase | Auto-resolves (never worse than asleep) |
| Mikan goes home, or is Routed elsewhere, during the window | Auto-resolves by formula, no presence |
| Mikan reaches the Caterwaul and the Posse is wiped in the brawl | **Presence still counts** (×1.5): reaching the Patch is the territory act. The wipe is a loss (OR-01; at Night the clock stays put) and changes no Scent. 20% of any haul still carried is lost (a player out at Night usually carries none: Night pays no Morsels) |
| Mikan reaches the Caterwaul and wins the brawl | Same ×1.5, no more. The win gives a Verdict on the raid leader (if a Rival) and Memory. If the raid leader is a challenger, the Verdict ends the challenge, and tonight's raid still resolves by formula with presence |
| A wipe during a contest | A loss (OR-01). No Scent changes; the rival's erosion recovers +8 that night as usual |
| A wipe on Life 1 day 1–2 | Tutorial fights cannot be lost; any other Life 1 loss costs no haul (none in Life 1) |
| Deliberately losing to the Boss | Allowed and costly: the day ends, −20% haul, no Well-Fed, −3 Loyalty per Routed Posse cat. The Boss is plastered (−10% max Nerve) and his anger is spent (OR-02, OR-07): the designed "spent whether you lose or not". It changes no territory; the window stays open if influence holds ≥ 75 overnight |
| Stash short of upkeep | Uncovered posts get Short Rations (`guard_mod × 0.8`); no debt |
| Stash short at a Verdict (Life 2) | Recruit greyed ("Stash short"); Chase Off always available; Nose-Touch per its gate. Feast never breaks the 0 floor |
| Stash full | Overflow stays on the Doorstep as Leftovers; gone next morning |
| Scent reaches 0 | Lapse: Patch Open and keeperless, `PatchChanged(new = none)`, Sentry to the Lot. Mikan may Claim Spray it again at once (no fight). If still keeperless on a town-event night, a newcomer moves in at rival Scent 60 |
| A Verdict cleared a post and Mikan walked away | The post is keeperless with its residual rival Scent, which fades −10 a night. Claim Spray any time; a newcomer may take it on a town-event night |
| Low Wall Corner | Never below 10, never admissible, never Lost, never staked, never taken by a turncoat |
| Patches claimed in another order | Allowed. Influence counts any outer Patch the same (25 at Strong) |
| Influence reaches 100 while Mikan is mid-contest elsewhere | The window opens at once (yowl, Sniff item next morning, Turf Board crown). The Boss starts his patrol at the current phase's stop |
| The window closes (influence < 75 at step 2) before the Boss is fought | Daifuku returns to the Den; held outer Patches can be Lost again. It reopens at 100 |
| Influence falls below 75 during the day | Nothing until step 2 (hysteresis is checked only then) |
| The Boss is Nose-Touched, Recruited or Chased Off | Any Verdict clears the Den; Mikan Claim Sprays the corner stone for `DistrictClaimed`. No gang cat moves into the Den (G6) |
| Den held, then influence falls below 75 | The Den becomes admissible to raids; the Life goal stays met |
| A challenger arrives while all held Patches are Low Wall Corner or the Den | No target: the arrival is skipped and the calendar advances (Nemesis) |
| A challenger's target lapses or is Lost to a raid before it is beaten | It settles there as the Keeper (lapsed: rival Scent 60; Lost: the raid result's 40). The challenge ends |
| A challenger's target is Lost to its own raid | It is the Keeper (Stale Claim at 40, ceiling 60 for 3 nights). Retake by Standoff → Verdict → Claim Spray |
| The challenger is beaten by day after tonight's `challenge` raid was forecast | The raid is declined (`RaidResolved(declined)`); no other raid replaces it tonight |
| A Goofball is posted on a challenger's target | Over-mark 0. The `challenge` raid still comes, and the Goofball is not its counter |
| The window is open and a challenger raids | Lost becomes Scuffed; the challenger keeps over-marking and raiding until beaten or Repelled twice |
| `BetrayalTriggered` on Low Wall Corner or the Den | Declined by Territory: the cat leaves the Crew (Crew/Nemesis) and the post stays Mikan's, Unwatched |
| `BetrayalTriggered` on an outer Patch while the window is open | The flip happens (it is not a raid). Influence and the window are recomputed at once; the window closes only if influence is below 75 at the next step 2 |
| A counter cat is also a clashing neighbour | Both apply: `counter` 2.0 × `pair` 0.75 (and −10% Tribute on both Patches). The Turf Board preview shows the combined odds |
| Bonded neighbour Routed-for-a-night, or a post left empty | No neighbour effect from that Patch tonight |
| Raid-night total would go below 0 (2× loot on a small night) | Floored at 0; nothing is taken from the Stash (the Stash is always safe) |
| Thief's `loot_held` and the thief is recruited | The loot returns to the Stash at the Verdict |
| A Sentry is Routed-for-a-night | The Patch is Unwatched next night; the cat resumes the night after |
| The Warden's Loyalty falls below 60 | It stays; it simply cannot be re-posted to the Den until True again |
| Only one Crew cat, and the player posts it | Allowed, with a Turf Board warning: "Mikan fights alone" (no Pile-On) |
| A Brooder is moved off a post | Allowed; Territory raises `dismissed_from_post` (Crew applies the dislike) |
| Tribute on the night of the claim | Computed in step 4; the slice ends at the Life-end check (step 5). The title card shows the pile |
| Reload during the day | Raid and outcome rolls are counter-seeded (DR-13), so a reload reproduces them |

---

## 6. Dependencies

| System (doc) | Territory needs | Territory provides |
|---|---|---|
| **Nemesis** (`nemesis-system.md`) | `RaidRequested` (one every night from night 3 when admissible, ≤ 1 per district, challenger first; motive ∈ {`grudge`, `gang_orders`, `gloat`, `challenge`}); Keepers per Patch (LWC an untracked Stray, LPY Togemaru, PA a seeded Tough, TSS Kagi, Den Daifuku); `VerdictApplied` ∈ {`chase`, `recruit`, `nose`}; `ChallengerArrived` and the challenger's fate (Gone after 2 Repels); `TownEvent(newcomer)`; `BetrayalTriggered`; Boss patrol placement on `BossWindowChanged`; Boss anger (reads `MarkApplied`); personality per cat | `RaidResolved` (+ `presence`); `PatchChanged` (incl. keeperless); `InfluenceChanged`; `BossWindowChanged`; `DistrictClaimed`; `MarkApplied` (proposed); admissibility rules; the challenger-target query; `loot_held` |
| **Crew & Progression** (`crew-and-progression.md`) | `PowerRating`, `Loyalty`, personality; the bond/clash matrix (§3.2, incl. Kin as bonded); Loyalty formula; Bribe tiers (no free tier from Life 2) and starting Loyalty; Sentry XP; Wavering flags and the betrayal thresholds | Per-cat night report (`posted`, `nights_posted`, `district_seen`, `raid_outcome`, `routed`, `dismissed_from_post`); price sheet; `patch_level` = 4; slot and cap clamps |
| **Combat** (`combat-system.md`) | Turf-wave encounters; `raid_defence` opener; a posted Sentry as an AI guest; the Boss patrol arena kit (three stops); `EncounterEnded` | Encounter requests (patch_id, waves); the Boss's current stop |
| **Day loop** (`day-loop.md`) | Clock pauses; Night from the cat flap; Head Home; the loss time-skip and the closed street (OR-01); Caterwaul reach = current district; daily-reset audit; `HomeArrived(kind)` | This doc's resets: Tribute pick-up and Share a Morsel only; the 20% haul loss on `routed`; the window-day and challenger-day pacing (§3.5, §3.12) |
| **Narrative** (`dual-story-progression.md`) | K2.5 day gate; the Life-end check; no food in the house before Life 8 | Doorstep pile states; the "Haru sweeps the Leftovers" hook; `TributeDelivered` |
| **UX** (`ux/key-screens.md`, `ux/hud.md`) | Turf Board (OR-17), Sniff cards (forecast, challenger, Boss window, Wavering), Doorstep, Caterwaul HUD marker, compass ticks (roaming Boss stop, challenger) | The data on them (§3, §4) and the Turf Board rules below |
| **Art / Audio** | Scent wisps 1–4 in Clowder colours (incl. an outsider colour); landmark posts; pile dressing; the Boss's yowl and climb-down; Caterwaul yowl in the Sentry's voice body; Spray pop | Band thresholds, events |

**Turf Board rules (for UX; OR-17 layout: four zones, one job each).**
1. **Header (one line):** the district name, the **influence bar** (bell gold from the left, the gang's colour from the right, outsiders after it, the Open gap between) with **its % (one number)** and the Boss crown (lit while the window is open), then the Lot tabs (Crew · Turf · Lessons · Share). No separate Sentry counter.
2. **Map = where. No numbers.** Five Patch stamps at fixed positions. Each stamp = landmark + owner ring + wisps + **one badge** + the seated Sentry. Badge priority: **raid or challenge tonight** > **fading** (below Strong) > Home. While the window is open, crown paw-marks sit on the three patrol stops. Neighbour links appear **only while carrying a cat**.
3. **Tonight panel = the one decision.** It opens **focused on tonight's threatened Patch** (the forecast raid, or the challenger's stake), so the first press is "pick a cat". It shows: the threat (portraits or silhouettes; motive icon or "?"; a challenger stamp), that Patch's **Scent** and "Strong at 60", and **tomorrow's Tribute** from it. While carrying a cat: the **Repelled / Scuffed / Lost bar with percentages** (from §4.5, the same `counter`, `pair` and over-mark terms), the counter icon, the ♥/✗ neighbour link, and "Laughs off the stranger's marks" for a Goofball on a staked post. On a quiet night it lists the fading posts.
4. **Crew strip = who.** Two Sentry pegs, then each cat's portrait, personality icon, Loyalty tier word and assignment chip (Posse / post / Lounging); **Wavering** shows the cat turned away with the fix line. Ineligible cats are greyed with the reason (Warden needs True). The strip ends with the **totals**: "Tomorrow T − upkeep = net · Stash S".
5. **Numbers appear in exactly three places:** the header %, the Tonight panel and the totals.
6. **The one decision a day:** who guards the threatened Patch, and so who leaves the Posse. First use (L2D2) is one decision. Target ≤ 1 min at the Lot (≤ 45 s on first use).

**Cross-doc notes:**
1. DR-42 lists "Chase Off: Clout +2", but Clout points are cut (DR-14). Territory treats the +2 as void.
2. DR-01's 2 Sentry slots against DR-14's Clout table: the slice clamps (§3.10).
3. Crew should confirm that a posted cat counts as **not benched** for the Braggart's dislike.
4. Crew should confirm that "same district" for posted pairs means both posted (§3.6).
5. UX's beat sheet (`ux/key-screens.md` §7.4) owns the teaching order; §3.12 follows it.
6. The owner-feedback sim `design/reviews/owner-feedback/sim/territory_economy_sim.py` (output `territory_economy_sim.out.txt`) encodes these formulas; §4.5, §4.11–4.13 cite it. The round-3 `posting_stakes_sim.py` and round-2 `territory_slice_sim.py` outputs are kept beside it as `territory_*.before.out.txt`. The Turf Board's preview bar must use the same `counter`, `pair` and over-mark terms.
7. **Pacing flag (Day Loop, UX):** under the ruled gate the window opens at the **L2D3** Tofu Shop Step Claim Spray for a player who rescue-Sprayed that morning (sim: 100% of engaged runs), one day earlier than OR-09's pacing note. The reference attempt stays on L2D4 and the claim on L2D5. Day Loop decides whether L2D3 shows the yowl as that day's second headline or the Sniff carries it on L2D4.
8. **Proposed contract (creative-director, brief §6.1):** `MarkApplied(patch_id, district_id, kind ∈ {over_mark, counter_spray, claim_spray, rescue_spray}, target_clowder)`, emitted by Territory, consumed by Nemesis (Boss anger, OR-07) and Audio. It is the "marking acts carry a district id" item of OR-07.
9. **Showcase seeding** (`IMPLEMENTATION-PLAN.md`, OR-21 showcase scope): the browser slice seeds its challenger on the L2D2 Sniff at Laundry Pole Yard and a snapshot influence of 95 with the gatepost below Strong. Those are showcase seeds; this doc's calendar puts the first challenger on L2D4.

---

## 7. Tuning Knobs

| Knob | Start | Safe range | Affects |
|---|---|---|---|
| base_yield LWC/LPY/PA/TSS/DEN | 8/10/12/14/18 | ±25% | Tribute anchor (keep the claim-night reference at 54–66) |
| band_mult Faint/Clear/Strong/Pungent | .6/.9/1/1 | Faint .4–.7 | Cost of neglect |
| watch_mult Unwatched | 0.8 | 0.6–0.9 | Pay value of posting (lower = posting dominates more) |
| Braggart / Full House | .10/.10 | ±.05 | Personality and holding pay perks |
| bonus clamp | 0.35 | 0.3–0.4 | Ceiling per Patch |
| base_decay / border | 10 / 2 | 8–12 / 1–3 | How fast held turf, and so influence, fades |
| home_mult, brooder_mult | 0.5, 0.5 | 0.4–0.7 | Home floor; Brooder perk |
| sentry_refresh / Crier | 10 / 14 | 8–12 / 12–16 | Whether Watched turf holds |
| claim / spray Scent | 70 / 90 | 60–80 / 85–100 | Nights until the Spray prompt; at claim 60 a fresh claim is already fading |
| rival recovery / ceiling | +8 / 80 | 6–10 / 70–90 | How fast half-done erosion fades; the size of a take (80 = one quiet or two loud acts) |
| Keeper threshold | ≤ 30 | 20–40 | Marking needed before the Keeper comes |
| Strong threshold | 60 | canon | Raid-loss gate; the influence share cap |
| `I_full` / `I_close` | 100 / 75 | 90–100 / 60–85 | When the Boss window opens and how much slack it gives. At `I_full` 90 one post may sit at Clear; at `I_close` 85 a single Scuffed closes it (owner question 5) |
| challenger over-mark | 10 | 5–15 | Influence pressure from a challenger; at 15 a staked Crier post loses ground nightly even when Repelled |
| challenger cadence | 1st: N3 + 2; then every 4 nights | gap 3–6 | Defence pressure; at 3 a second challenger reaches the slice |
| challenger Repels to leave | 2 | 1–3 | How long a well-defended challenge lasts |
| newcomer Keeper Scent | 60 | 50–70 | Cost of letting a Patch lapse (60 = one Counter-Spray to the Keeper) |
| turncoat Scent | 40 | 30–60 | Cost of a betrayal (Crew owns the trigger) |
| presence_mult | 1.5 | 1.25–2.0 | Value of answering a Caterwaul; "a guarded post usually holds" |
| seen grace / step / floor | 2 / .20 / 0 | canon (DR-46) | Idle bound |
| home_adv, scent coefficient | 1.5, 0.005 | 1.2–1.8, .003–.007 | Raid odds overall |
| style_mod, guard_mod | §3.6 | Stalwart 1.3–1.7; Fraidy .6–.9 | Personality on guard |
| motive `counter` | 2.0 | 1.5–2.5 | Whether reading the motive changes the right cat. At 1.5 the Stalwart is the best guard for every motive again (round-3 sweep) |
| neighbour `pair` (bonded / clashing) | +0.25 / −0.25 | 0.15–0.35 | Weight of the board's adjacency puzzle |
| clashing-neighbour Tribute | −10% per Patch | 5–15% | Pay cost of a bad pairing |
| `loot_held` multiple (Scuffed, Lost) | 2 × Patch Tribute | 1–3 | Money stake of a raid night |
| raider PR ratios (Tough / Captain / escort) | 1.0 / 1.5 / 0.6 | Captain 1.3–1.8; escort 0.4–0.8 | Whether a Stalwart is automatically safe (Crew owns PowerRating; these are assumptions) |
| p_hold clamp | .05–.95 | — | No certainties |
| Repelled / Scuffed Scent | −5 / −20 (Anchor −10) | — | Raid stakes |
| Caterwaul window / multipliers / cap | 120 s / ×1.5 / 240 s | 90–150 s | Live-defence reachability |
| raids per night (slice) | 1 every night, from night 4 | 0–1 | Pressure; the daily posting decision exists only on raid nights |
| Stale Claim cap / nights | 60 / 3 | — | Retake ease |
| thief loot life | 3 days | 2–5 | Hunt window |
| loss haul fraction | 20% | canon (OR-02) | The Morsel sting of a loss |
| upkeep per post | 2 | 0–4 | Trivial drain |
| Stash cap | 400 | 300–600 | Hoard rot point |
| loot base / per-level / Full Belly | 1 / 0.5 / 12 | — | Field-haul share (≈ 60% of slice income) |
| caches | 6 × 10 | 4–8 × 5–15 | Exploration reward |
| Lessons, Bribe, Share | §4.8 | canon (DR-14) | — |

---

---

## 8. Acceptance Criteria

**Model (the owner-feedback sim `territory_economy_sim.py` must reproduce these; DR-57):**
1. The reference player's claim-night pile (night 7, shown on the title card) is **54–66 Morsels** (≈ 60 ± 10%). *Sim: 57.8 mean; trace 60.*
2. A sleep-skipper receives ≤ 4.0 × one day's Tribute after the last visit, and **0** Tribute in steady state. *Sim: 0 from night 8.*
3. A Rub-skipper's Tribute is ≤ 7/day by the 7th consecutive skip day. *Sim: ≤ 6.*
4. **Losing on purpose never pays:** for every policy, ending the day by a wipe yields Tribute identical to Settle In and a field haul ×0.8 (×1.0 in Life 1); the "patrol + throw the first fight" player's income is below the "patrol + Settle In" player's. *Sim: 226 < 231.*
5. Under the struggler policy (12 days), the Stash never goes below 0, Mikan never holds fewer than 1 Patch, Lane influence never falls below 4, and every taken Patch can be retaken by one Standoff and a Claim Spray.
6. The reference player can afford the day-5 Captain at fair or a day-5 Lesson, but **not both**; a Scuffed night 4 can put the Captain out of reach (no free Bribe from Life 2). *Sim: Kagi affordable in 90% of runs.*
7. The hoarder (no sinks) reaches the 400 cap no earlier than day 6. *Estimate: ≈ 330 by the end of day 6, the cap on day 7.*
8. **The Boss window:** for the reference player it is open by the morning of L2D4 in ≥ 95% of runs, and the claim lands on L2D5 under Day Loop's one-loss reference. *Sim: 100% open at the L2D3 Claim Spray; claim day 7 in 100%.*
9. **The challenger:** the first one is announced in the L2D4 Sniff for ≥ 95% of reference runs, and no run has more than 1 active per district. *Sim: 100%, Sniff day 6.*

**Rules (unit tests):**
10. A Patch with Scent ≥ 60 at resolution is never Lost.
11. **No outer Patch is Lost while the Boss window is open.**
12. Low Wall Corner is never admissible to a raid, never staked, never taken by a turncoat, and never below 10.
13. The own-post Spray prompt appears **if and only if** the post is below 60.
14. Rubbing your own mark changes no Scent and sets `seen` for that Patch only.
15. Raid outcomes are identical across reloads and replays with the same seed.
16. Tribute is invariant to roaming minutes, time of return home, and wipes.
16a. A `gloat` raid is never Lost. `counter` is 2.0 exactly when the Sentry's personality is in §3.6's counter list for tonight's motive; `pair` follows Crew's matrix for adjacent posted Sentries only; a clashing neighbour cuts both Patches' Tribute by 10%; Scuffed and Lost set `loot_held` = 2 × the Patch's Tribute.
16b. **No fight outcome changes Scent or influence.** For every `EncounterEnded` outcome (win, loss, `player_fled`, `rival_fled`) and every `VerdictApplied`, every Patch's Scent and every district's influence are unchanged; a Verdict only clears the post's Keeper. (Unit test over all outcome × verdict combinations.)
16c. Influence equals §4.14 for every Scent vector; `BossWindowChanged(open = true)` fires the first time Mikan's value reaches 100 (after a Scent change or at step 2), **never closes while the value is ≥ 75 at step 2**, and closes at step 2 when it is below 75. The Boss's stats, level and traits are identical with the window open or shut.
16d. **Challengers:** ≤ 1 active per district; the target is the lowest-Scent held Patch other than Low Wall Corner and the Den (ties: higher yield); the over-mark is 10 a night from the night after arrival, and 0 with a posted Goofball; a challenger Repelled twice leaves (Gone) and its over-mark and raids stop; Lost makes it the Keeper; beating it by day declines that night's `challenge` raid and adds no Scent.
16e. **Presence:** with `presence = true` the guard term is ×1.5 (Mikan as guard on an Unwatched post), and `p_hold` is identical whether the brawl ended in a win or a loss.
16f. **A loss** emits no `PatchChanged` and no `InfluenceChanged`, leaves the Stash unchanged, leaves tonight's Tribute unchanged, and banks 80% of the carried haul (100% in Life 1).
16g. A keeperless Patch on a town-event night receives a **newly generated** Keeper at rival Scent 60 (Nemesis test: never an existing cat).
16h. From Life 2 the Recruit card is greyed when the Stash is below fair; Chase Off is always offered.

**Posting stakes (owner-feedback sim):**
17. The best posting beats random posting by **≥ 30% Tribute on raid nights 4–7** and has **≤ half** the random policy's Scuffed nights. *Sim: +33%; 0.51 vs 2.17.*
18. Across the four motives (including `challenge`), the best guard on the threatened Patch is **at least three different cats**, and the habit policy trails the best by ≥ 3%. *Sim: Pon, Hige, Togemaru, Kagi; habit −5% over the slice, −7% on raid nights.*
19. **Defending against a challenger is a real decision:** for the casual player, posting and fighting it at least halve the chance of losing the staked Patch compared with ignoring it, and no defence policy leaves fewer than 3 Patches held on night 10. *Sim: 0.47 vs 0.92; worst 3.27.*

**Slice playtest (UX and QA assemble):**
20. The scripted first raid is forecast on day 4 and offers a Caterwaul on the cat-flap night for 100% of testers who go out.
21. On ≥ 3 of the 4 raid-eligible days (4–7), ≥ 70% of testers change at least one post after reading the Sniff (**the daily decision exists**).
22. ≥ 60% of testers, asked "why that cat on that wall?", answer with a personality, Style or threat reason.
23. Territory time at the Lot (Turf Board plus Share) is ≤ 1 min at the 75th percentile (≤ 45 s on first use); the Doorstep is ≤ 0.5 min.
24. Muted-audio check: testers identify which of their Patches is "fading" from wisps alone (≥ 80%).
25. Numbers appear on no territory surface except the Turf Board, and there **only in the header %, the Tonight panel and the totals**.
26. ≥ 60% of testers can say, unprompted, what brings Daifuku down off his wall ("keep all my posts strong" or equivalent) after seeing the bar fill once.
27. ≥ 60% of testers who met the challenger can say what it wants and one way to see it off.
28. "Is territory management fun at this scale?" (DR-01) is rated ≥ 4/5 by ≥ 60% of testers, and no tester calls it a chore list.

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
- Patch upgrades (Claimed-In, TE-X12) and the surviving Lot upgrades (Cushion Pile I).
- Multi-district raids, request budgets above 1 a night.
- **Influence across three districts and the Summit:** one bar per district, the Summit's single Patch (`n_outer` = 1?), and whether a district Boss's window can open while another's is open (UX, Nemesis patrols).
- **The Usurper rule (full game, OR-09 item 7, G6):** a new district Boss is a newly generated cat arriving from territory state and time (total influence loss in a claimed district, days elapsed), with fresh traits and no inheritance. Nemesis generates; Territory supplies the trigger.
- **Challengers beyond the slice:** Captain tier from Life 3 (OR-16); the calendar across districts. No tiers, waves, escalation or factions (OR-18).
- **Casual pacing watch:** under the full-influence gate the casual player's window opens by day 10 in 68% of runs (claim 62%; 84% by day 14). If slice playtests confirm a stall, the levers are `I_full` 90 or a claim Scent of 75 (§7), both owner-visible (owner question 5).
- The Turf Board across three districts and the Summit (UX).
- Roof Run fast travel (Day loop).
- Arcade, Shiosai and Summit Patch tables (the first draft's 30-Patch table is the content source, to be re-cut to 20).
- Food-pile dressing per district; the Leftover-sweeping vignette variants.
- Full Clout table effects (Crew cap 7–12, Sentry slots 3–8).
- **(Iteration 3)** The Brooder's guard perk (and its `challenge` counter) never comes into play in the slice: Daifuku, the only Brooder, can join only at the very end, and his fair Bribe (256) is out of the reference's reach. Acceptable: all six personalities still appear (DR-01).
- **(Iteration 3, re-confirmed OR-02)** §4.13's "a wipe is dominated by Settle In" is true in every currency. In real time, a wipe before clock 240 ends the outing sooner than Settle In can; its costs are real, so this is accepted.
- **(Iteration 3)** Daifuku's level: this doc uses Lv 8 (Bribe 256); Crew uses ≈ 9 (288). Combat's leader-level rule decides (combat review C-8).
- **(Iteration 3)** The adjacency rule is spatial on a 5-Patch board; with 3 districts it needs a per-district board and a cap on stacked neighbour bonuses (Turf Board across districts, UX).
- **(Iteration 3)** The Turf Board's first use is on Life 2 day 2, the heaviest pre-window day. Measure Lot time on that day first.
- **Counsel watch (not redesigned):** the nightly raid requester and the challenger's Rival tag are Nemesis's (OR-19 residual items). Territory's own rules change only Patches, posts, Morsels and the calendar-driven window.

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

**2026-11-24 — Owner feedback pass (2026-11-24).** Implements `design/reviews/owner-feedback-rulings.md` (owner comments C1–C5) under the patent note v2 §5 guardrails, and the Crew reviser's coordination note of the same day (no free Bribe from Life 2). Sim: `design/reviews/owner-feedback/sim/territory_economy_sim.py` (copied from round-3 `posting_stakes_sim.py`, then updated; output `territory_economy_sim.out.txt`; 2,000 seeds). Before-figures: `territory_posting_stakes.before.out.txt` (round 3) and `territory_slice_sim.before.out.txt` (round 2).

| Ruling | Status | How / why |
|---|---|---|
| OR-01 A loss ends the day | IMPLEMENTED (Territory's side) | §3.9.1: the economy of a loss; the clock jump and closed street are Day Loop's. A wipe mid-contest or mid-Caterwaul changes no Scent (§3.4, §3.8, §5) |
| OR-02 What a loss costs | IMPLEMENTED | 20% of the carried haul (none in Life 1), Stash safe, Tribute unchanged, no Well-Fed (§3.9.1, §4.7). Mark Over and Snatch deleted (§3.2, §3.7, §5, AC). Lose-on-purpose stays closed: sim income 226 (throw the first fight) vs 231 (Settle In) vs 520 (reference); Tribute identical (§4.13, AC 4, AC 16f) |
| OR-03 Rivals board | N/A here | Territory's references to the Fence Line removed (§3.10); the board is UX/Nemesis |
| OR-04, OR-05 Relationship tags | IMPLEMENTED (Territory's side) | Gang membership says whose influence a Patch counts for (§3.2.2); Kin act only as a bonded pair through Crew's matrix (§3.6). No other tag touches territory |
| OR-06 Old Gang Nerves | N/A here | Combat/Nemesis/Crew |
| OR-07 Boss anger | IMPLEMENTED (Territory's side) | Every marking act carries its district: proposed `MarkApplied` event (§3.3, §6 note 8). Claim and Rescue Sprays are tagged so Nemesis can exclude them. The quiet/loud take arithmetic shows the anger cost (§3.4) |
| OR-08 District influence | IMPLEMENTED | §3.2.2 and §4.14: the ruled formula and scale (0–100, 25 per Strong outer Patch, read off Scent, no second number), the bar, the % only in the Turf Board header, decay for everyone (§4.1), worked example. **What moves Scent** is exactly the ruled list (§3.2.1): Rout −15, wipe +30, Caterwaul +10, the Verdict's `S_r = 0` and the Keeper waiting on a cleared wave are deleted; the Keeper arrives on `S_r ≤ 30` only (§3.4). The Caterwaul **presence rule** (×1.5 guard term, Mikan as guard on an Unwatched post, whatever the brawl) replaces +10 (§3.8, §4.5) |
| OR-09 The Boss window | IMPLEMENTED, with a pacing flag | §3.5 replaces the Den gate (Locked/Open at 3 of 4, Den-Open rule, automatic Den claim): opens at 100, patrol of three stops, closes below 75 at step 2, no Lost while open, Den Claim Spray after any Verdict, the departure re-tasks nobody, the Boss never reads influence. **Flag:** as written, the gate opens at the L2D3 Tofu Shop Step Claim Spray for any player who rescue-Sprayed that morning (sim: 100% of engaged runs), not on L2D4 as OR-09's pacing note expects. The rule is implemented as written; the reference still attempts Daifuku on L2D4 and claims on L2D5. Day Loop/UX to place the L2D3 yowl (§6 note 7) |
| OR-10 How ground is taken back | IMPLEMENTED | §3.7.1: raids, challengers, newcomers into keeperless Patches (rival Scent 60, freshly generated, §3.7.3), turncoats (§3.7.4). Every route retakes by Standoff + Claim Spray |
| OR-11 Rare recruit betrayal | IMPLEMENTED (Territory's side); rate DEFERRED to Crew | §3.7.4: the guarded Patch flips to the turncoat at 40 (never LWC or the Den), the Turf Board Wavering pose and fix line (§3.6, §6). The ≤ 10% neglect rate is Crew's sim (Loyalty is Crew's), so it is not re-simulated here |
| OR-12 Three Verdicts | IMPLEMENTED | `VerdictApplied` ∈ {`chase`, `recruit`, `nose`}; all three clear the post, Claim Spray offered at once (§3.4 step 5, §3.13). `nose_snub` / `nose_accept`, "keeps its post", the 5-day truce Patch and its "can't be Sprayed or counted" rule deleted. Stalwart's new dislike fed by `raid_outcome` (§3.6) |
| OR-13 Nose-Touch | IMPLEMENTED (Territory's side) | The cat steps down and the post is Claim Sprayed; a truce that ends below Regard 75 returns as a `truce_end` challenger, resolved like any other (§3.7.2) |
| OR-14 Chase Off is final; newcomers | IMPLEMENTED (Territory's side) | Keeperless posts wait for a town-event newcomer (§3.7.3); Territory never moves an existing cat into a post |
| OR-15 Humble removed | IMPLEMENTED | Humbled Tribute bonuses, the Undermark crate, `uprising`, Restless and the Goofball's "never simmer" perk deleted (§3.6, §3.7, §4.2, §5, AC). The Goofball's perk is now **"Laughs off a challenge"** (over-mark 0). The Tribute anchor is re-simmed without Humble: claim-night 57.8 (54–66 ✓), so `base_yield` is unchanged |
| OR-16 Challengers | IMPLEMENTED | §3.7.2 and §4.15: calendar (night 5 in the slice, L2D4 Sniff in 100% of runs), target rule, over-mark −10 (Goofball 0), the `challenge` motive (leader + 1, ×1.10, counters Schemer and Brooder) in the raid slot, Lost → Keeper, Repelled twice → leaves, beaten by day → no Scent. Defence sim: §4.13 table |
| OR-17 The unified Turf Board | IMPLEMENTED (rules); visuals DEFERRED to UX | §6 Turf Board rules rewritten as the four zones, one decision, numbers in exactly three places, Tonight panel focused on the threatened Patch. The re-rendered preview and layout are `key-screens.md` §5's |
| OR-18 Not added | RESPECTED | No second territory number, no buffs from influence, no challenger tiers, no NPC turf wars, no new currency or daily action |
| OR-19 Fixed roles; town events | IMPLEMENTED (Territory's side) | `boss_orders` → `gang_orders` (the gang's fallback, independent of the Boss); `WallEvent` → `TownEvent(newcomer)`; "Tough seat 1" Keeper of PA → a seeded Tough (§6) |
| OR-20 Event contracts | IMPLEMENTED | `InfluenceChanged`, `BossWindowChanged` (emitted), `ChallengerArrived`, `TownEvent`, `BetrayalTriggered` (consumed), `RaidResolved.presence`, motives {`grudge`, `gang_orders`, `gloat`, `challenge`} (§3.13, §6). New proposal `MarkApplied` flagged for the brief |
| OR-21 Delete list | IMPLEMENTED | Items 1 (Humble), 4 (Mark Over, Snatch, "losing ends the outing"), 7 (Den gate), 8 (fight-driven Scent), 11 (`pretender`, `boss_orders`), 12 (betrayal "unreachable") removed from rules, formulas, edge cases, ACs, Backlog and the sim. Older Revision Log rows below are kept as history |
| Crew note: no free Bribe from Life 2 | IMPLEMENTED | §3.11, §4.8, §5, AC 6, AC 16h: Recruit greyed below fair; Chase Off always offered. Sim: Kagi affordable on day 5 in 90% of reference runs |

**Sim results, before → after:**
- **Claim-night Tribute:** 65 hand / 60.8 sim (night 6, with a Humbled Daifuku) → **57.8** sim / 60 trace (night 7). Inside 54–66 without touching `base_yield`.
- **Stash at the slice's end:** 128 (day 6) / 82 (day 7, after Lesson II) → **149** on day 7 (min 88; Lesson II slips to day 8). Day by day, engaged 14 / 52 / 94 / 101 / 82 / 71 / 149; casual 10 / 42 / 86 / 114 / 138 / 51 / 119.
- **Idle and lose-on-purpose:** income days 1–7 reference 520; patrol + Settle In 231; **patrol + throwing the first fight 226**; sleep-skip 95; rub-skip 92; struggler 159. Sleep-skip Tribute reaches 0 by night 8 (before: 0 by night 8).
- **Posting stakes:** best vs random **+34% slice / +45% raid nights → +24% / +33%**; Scuffed nights 0.53 vs 2.50 → **0.51 vs 2.17**; habit trails best 4% → **5% / 7%**. The stakes fall because the window now removes Lost from night 5; the challenger and the Warden gate keep the habit answer wrong.
- **Challenger and roaming Boss in the slice:** the challenger is announced in the L2D4 Sniff in **100%** of reference runs (1 per slice; 2 by day 10); the casual player sees it on day 7.4 on average. The Boss window opens in **100%** of reference runs (on L2D3); the casual player sees it by day 10 in 68%.
- **Defence without a death spiral:** engaged player, posts only vs ignoring: staked Patch taken 5% vs 6% (the window protects it), Tribute nights 6–10 258 vs 164. Casual: posts + fights 47% vs ignores 92% taken; worst end state 3.3 Patches, influence 63. Struggler: Stash ≥ 10, ≥ 1 Patch, influence ≥ 4.
- **Watch item:** the casual claim slips under the all-four-Strong gate (62% by day 10, 84% by day 14). Backlog lists the levers; no change made, because the gate is owner question 5's default.

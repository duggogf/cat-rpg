# Territory Management and the Food-Tax Economy

> **Status**: In Review (first draft v0.1; no section has had user sign-off yet)
> **Author**: economy-designer (pre-approved design pass)
> **Last Updated**: 2026-11-23
> **Last Verified**: 2026-11-23 against `design/creative-brief.md` Draft v1.0
> **Implements Pillar**: 1 Cat's-Eye Truth (scent, food, naps as mechanics) · 2 Two Lives, One Clock (Doorstep, curfew, the Life 8 inversion) · 4 Rivals Remember (raids, Humbled residents, Wardens tested)

All canonical terms (Patch, Scent, Spray, Sentry, Warden, Tribute, Morsels, Shinies, Clout, Stash, Doorstep, Caterwaul, Night Shuffle, Verdict...) are used exactly as defined in `design/creative-brief.md` §3. Terms this document introduces are listed in §14 "Assumptions for creative-director review".

**Every number here is a paper-model tuning start. Nothing in this document has been simulated or playtested.** Where a figure comes from the brief's numeric frame (§8) it is marked *canon*; everything else is this document's proposal.

## Summary

Mikan takes Yunagi one Patch at a time by wearing down a rival Clowder's Scent, Routing the cat who holds the Patch, and Spraying its Scent Post. Held Patches pay a daily food Tribute to the Doorstep, but only while they smell of you, are watched by your Crew, and have seen their boss lately. This document owns the rules for holding ground, the raid math, and every source, sink and price of Morsels and Shinies, including how Life 8 turns the food tax into food carried home.

> **Quick reference** — Layer: `Core` · Priority: `Vertical Slice` (Lives 1–2 subset, see §3.14) then `Alpha` · Key deps: `Combat, Nemesis, Crew & Progression, Day clock (brief §5), Narrative, UX`

---

## 1. Overview

Yunagi has 30 Patches in 6 districts. Each Patch has one Scent Post and a Scent value (0–100) owned by one Clowder. To take a rival Patch the player erodes its Scent (quietly, by over-marking Rub Marks, or loudly, by Counter-Spraying the post or Routing its cats), which draws out the Rival who holds it; Routing that Rival and Spraying the post claims the Patch. Hold 3 of a district's 4 outer Patches and its Den opens; Rout the Boss there and the district is claimed. Scent decays every night, so ground is kept by walking it, by posting Crew as Sentries (whose Style sets their guard role) and by appointing one Warden per district. Rivals raid; raids the player does not answer in person resolve by formula in the Night Shuffle. Each morning the cats living on held Patches leave Tribute on the Doorstep. Morsels buy Lessons, recruits, Sentry rations, Patch and Lot upgrades; Shinies gate the top tier of each. The economy is deliberately scarce through Life 6, deliberately in surplus in Life 7, and in Life 8 the surplus becomes Offerings Mikan carries home to Sora and Koharu.

## 2. Player Fantasy

**"This whole street smells of me."** The fantasy is ownership a cat would recognise: not a flag on a map but a smell on a lamp post, a warm roof tile nobody else dares nap on, and a fish head waiting on the step every morning because the neighbourhood knows who is boss.

Emotional beats this system must deliver:

- **Cheek (30 seconds).** Rubbing your face on a rival's fence post behind their back is a small, deniable insult. Spraying their post in plain view is a declaration of war. The player should grin doing both.
- **Swagger (5 minutes).** Walking your rounds through streets that glow bell-gold in Whisker Sense, topping up a post with a tail-quiver, being greeted by your own Sentry.
- **The lord's breakfast (daily).** The Doorstep pile is the scoreboard. Its size, and which fish are in it, is the readout of yesterday's decisions.
- **The stretch (mid-game).** More ground than cats to watch it. Somewhere a Caterwaul goes up and you have to choose which wall matters.
- **The pointless pile (Life 7).** You have more food than you can use. It feels like winning and faintly like nothing.
- **The point (Life 8).** The pile has one use after all. You pick up a fish in your mouth and carry it home.

It should never feel like bookkeeping. If a rule here cannot be read from a smell, a cat on a wall, or a pile of fish, it is a candidate for cutting (Pillar 1).

---

## 3. Detailed Rules

### 3.1 Patches and Features

- 30 Patches, 5 per district; exactly one per district is the **Den** (*canon*).
- Each Patch has: `patch_id`, `district_id`, one **Scent Post**, two **Rub Marks**, a `neighbours[]` list (2–4 adjacent Patches, authored by level design), a `base_yield` (Morsels/day), one **Feature**, a `holder_clowder`, a `holder_id` (the Rival who holds it for a rival Clowder, assigned by Nemesis; the Boss at a Den), `scent`, an upgrade level, and Sentry slot(s): 1, or 2 at a Den (*canon*).
- **Rub Marks** are cheek-rub points (a fence corner, a crate edge, a step). They are visible only in Whisker Sense, have no completion tracking and no HUD count.
- A **Feature** is the cat-reason the Patch is worth having. Five types:

| Feature | What it is | Rule while you hold the Patch |
|---|---|---|
| **Sunspot** | Contains a Sunspot nap point | Napping here also adds +20 Scent (you slept on it). A Sentry posted here reports "cushy post" to Crew's Loyalty inputs. |
| **Back Door** | Fish shop, tofu shop, inn kitchen, ice crates | High `base_yield` (already in the table). One free scrap pickup per day in Morning/Day. Raid target weight ×1.5: rich ground is envied. |
| **Quiet Stones** | Shrine steps, lanterns, jizo, graves | Scent decay ×0.7 and Rain does not increase decay (sheltered, undisturbed). When a rival holds it, contests at Night get +1 turf wave. |
| **High Perch** | A High Road junction: gantry, torii, lighthouse stair | Raid defence +0.15 R here. Caterwauls from this Patch and its neighbours get +30 s response window (you can see and hear further). |
| **Feeder Corner** | A human who feeds strays | Contains a Feeder (§3.10). Tribute from this Patch is −20% on Rain nights (the human stayed in). |

**Patch table (names and Scent Posts are provisional; yields are the tuning start):**

| ID | Patch | Scent Post | Feature | base_yield |
|---|---|---|---|---|
| 1.1 | Low Wall Corner (tutorial Patch; Home Ground, §3.12) | red mailbox | Sunspot | 8 |
| 1.2 | Laundry Pole Yard | laundry-pole base | High Perch | 9 |
| 1.3 | Persimmon Alley | utility pole | Feeder Corner | 11 |
| 1.4 | Tofu Shop Step | milk-crate stack | Back Door | 12 |
| 1.D | **Den:** Daifuku's Wall | stone gatepost | Sunspot | 16 |
| 2.1 | Croquette Corner | stall leg | Feeder Corner | 20 |
| 2.2 | Awning Run | awning pole | High Perch | 18 |
| 2.3 | Bicycle Racks | shop-front cushion bench | Sunspot | 22 |
| 2.4 | Fishmonger's Back Door | polystyrene fish box | Back Door | 28 |
| 2.D | **Den:** The Arcade Clock | clock pillar | Feeder Corner | 36 |
| 3.1 | Box Steps (where Mikan was found) | lowest stone lantern | Quiet Stones | 22 |
| 3.2 | Torii Gate | torii leg | High Perch | 18 |
| 3.3 | Bamboo Path | jizo statue | Quiet Stones | 16 |
| 3.4 | Offering Hall Porch | offering-box corner | Feeder Corner | 24 |
| 3.D | **Den:** Moon-Viewing Stone | great stone lantern | Quiet Stones | 32 |
| 4.1 | Net Racks | net-drying post | Sunspot | 50 |
| 4.2 | Tetrapod Shore | mooring bollard | High Perch | 55 |
| 4.3 | Boat Ramp | upturned dinghy | Feeder Corner | 60 |
| 4.4 | Ice Crate Row | ice-crate stack | Back Door | 75 |
| 4.D | **Den:** The Auction Shed | weighing scale | Back Door | 100 |
| 5.1 | Vending Row | warm vending machine | Sunspot | 38 |
| 5.2 | Signal Gantry | signal post | High Perch | 42 |
| 5.3 | Platform End | platform bench | Feeder Corner | 46 |
| 5.4 | Freight Shed Door | pallet stack | Back Door | 50 |
| 5.D | **Den:** The Turntable | buffer stop | High Perch | 72 |
| 6.1 | Steam Vent Steps | vent grate | Sunspot | 44 |
| 6.2 | Inn Kitchen Door | sake crate | Back Door | 56 |
| 6.3 | Footbath Lane | footbath post | Feeder Corner | 52 |
| 6.4 | Lighthouse Stair | stair newel | High Perch | 48 |
| 6.D | **Den:** The Silk Cushion Veranda | carved veranda post | Sunspot | 80 |

District nominal yields (sum of `base_yield`): Hidamari 56 · Arcade 124 · Tsukimi 112 · Harbour 340 · Yard 248 · Heights 280 · **town 1,160**. Harbour is the richest (*canon*).

### 3.2 Scent

- `scent` is 0–100 per Patch and belongs to exactly one Clowder (*canon*). A Patch at 0 has no owner (**Open**).
- Bands, shown as the glow intensity of the post in Whisker Sense and as 1–4 scent-wisps on the Patch banner:

| Band | Scent | Tribute multiplier | Meaning |
|---|---|---|---|
| Faint | 1–24 | ×0.5 | About to lapse. Locals are testing you. |
| Clear | 25–59 | ×0.8 | Held, not respected. |
| Strong | 60–89 | ×1.0 | Baseline. |
| Pungent | 90–100 | ×1.1 | Nobody is in any doubt. |

- Scent changes only by: Spraying, Rub Marks, napping on a held Sunspot, raid outcomes, and the nightly decay/refresh in Night Shuffle step 1 (§4.1). It does not change in real time while roaming.

### 3.3 Marking verbs (moment to moment)

| Verb | Where | Input | Effect on your own Patch | Effect on a rival Patch | Limit |
|---|---|---|---|---|---|
| **Rub** | Rub Mark | Tap, 0.4 s, can be done while moving past | +5 Scent | **Over-mark**: −10 rival Scent. If no rival cat is alerted within 8 m, nobody notices. If seen, the Patch **Bristles** (§3.4). | Each Rub Mark once per day |
| **Spray** | Scent Post | Hold 1.2 s (tail-quiver), interruptible by damage | +40 Scent | **Counter-Spray**: −30 rival Scent, always loud: the Patch Bristles and the pop is heard across it | Each Scent Post once per day by Mikan (the Claim Spray counts) |
| **Claim Spray** | Scent Post of an **Open** Patch | Hold 1.2 s | Patch becomes yours at Scent 50 | — | — |
| **Nap** | Sunspot on a held Sunspot Patch | Canon nap (checkpoint, heal, half a phase) | +20 Scent | Not available on rival ground (they chase you off the tile) | Per nap |

Presentation is canon: coloured sparkle cloud and a pop, never liquid. Only Mikan Sprays for the player; Sentries refresh Scent passively overnight (§4.1).

### 3.4 Taking a rival Patch: escalation

One number drives the whole escalation: the rival Clowder's Scent on that Patch (`S_r`). It typically sits at 80 (100 at a Den).

1. **Read it.** Enter the Patch. Whisker Sense shows the post, the Rub Marks, the holders' footprints and the High Road routes.
2. **Erode it.** Any mix of:
   - Over-mark a Rub Mark: −10 each (quiet if unseen).
   - Counter-Spray the post: −30 (always loud).
   - Rout a rival cat inside the Patch: −15 each.
3. **Bristle.** The first loud act (a seen Rub, a Counter-Spray, or any fight) puts the Patch in **Contested**. Territory asks Combat for **turf waves**: `2` waves if `S_r ≥ 40` at the moment of Bristling, `1` wave if `S_r < 40`; a Den adds +1; Quiet Stones at Night adds +1. Wave composition is Combat's (encounter composition rules). Each cat Routed still reduces `S_r` by 15.
4. **Standoff.** When `S_r ≤ 30` and the current wave is cleared, the Patch's `holder_id` arrives for a Standoff. If erosion alone (no fight yet) brought `S_r ≤ 30`, the Holder arrives with one wave as escort and no second wave follows: sneaking pays by skipping a fight.
5. **Verdict.** Rout the Holder; Nemesis runs the Verdict and emits `VerdictApplied`. The Patch becomes **Open** (`S_r = 0`).
6. **Claim Spray.** Spray the post: `PatchChanged` fires, the Patch is yours at Scent 50. Rubbing both Rub Marks afterwards takes it to 60 (Strong) on the spot.
7. **Post or walk on.** A prompt offers to leave one Posse Crew cat here as Sentry (§3.6). Declining leaves the Patch **Unwatched**.

Proposed to Combat (their numbers): rival cats defending a Patch whose `S_r` is Faint (<25) at encounter start begin **Ruffled** ("a cat on fading turf is nervous"). Territory passes `turf_confidence = S_r` with the encounter request; whether and how it is used is Combat's call.

Failure and interruption:

- **Posse wipe** during a contest: canon loss rules; additionally `S_r += 30` (capped at its ceiling).
- **Player leaves** a Contested Patch (walks out of its bounds for 20 s or goes home): contest ends; `S_r += 20` in the next Night Shuffle on top of normal rival regeneration.
- **Open but unclaimed** at day's end: Territory reports it Open; Nemesis may move a Rival in during step 2.

Rival Scent regenerates +8 per night up to a ceiling: 80 (outer Patch), 100 (Den), 50 (a **Holdout**: a rival Patch inside a district you have claimed), 60 for 3 nights after a rival takes a Patch from you (**Stale Claim**: it is easier to take back what was yours).

### 3.5 Dens and claiming a district

- A rival Den is **Locked** until the player holds 3 of the district's 4 outer Patches (*canon: hold 3 of 5, which opens the Den*). Locked means the post cannot be Counter-Sprayed and the Boss is not at the seat (Bosses may still be met elsewhere, per Nemesis).
- While open, the Den is contested like any Patch (3 waves; Captains appear in them if they still hold rank), ending in a Standoff with the Boss. Rout the Boss, Verdict, Claim Spray → `DistrictClaimed`.
- If the player drops below 3 outer Patches before the Boss is Routed, the Den re-locks at the end of the current encounter.
- On claiming: the player may appoint a **Warden** at once from the Posse or later at the Lot. The district's **Claim Bonus** (§3.9) switches on.
- **Symmetry rule:** rivals can only raid a Den you hold if you hold fewer than 3 of that district's outer Patches. Your periphery protects your seat exactly as theirs protected theirs.
- Losing a Den makes the district **Usurped**: Claim Bonus off, Warden returns to the Lot. **Life turf goals are sticky**: a goal once met is never un-met (Pillar 2: no fail state).

### 3.6 Sentries and Wardens

**Slots and caps.** 1 Sentry slot per Patch, 2 at a Den, one Warden per claimed district (*canon*). The Warden is a separate post from the Den's Sentry slots. How many Sentries may be posted at once is gated by Clout (§3.11). At Great Boss: 18 Sentries + 6 Wardens + 3 Posse = 27 posts for 24 Crew. **There are never enough cats.** That shortage is the over-expansion mechanic.

**Posting.** Sentries and Wardens are assigned at the Lot (Pillar 2: management happens at the Lot and the Doorstep, never remotely). One exception: immediately after a Claim Spray or a won raid defence, a Posse Crew cat may be left on that Patch; the Posse runs one short until the Lot.

**A Patch is Watched** if it has at least one posted Sentry who is not Routed, or it is a Den with a Warden. Otherwise it is **Unwatched**.

**Guard role is set by Style** (no extra choice to manage):

| Style | Role | Effect as Sentry |
|---|---|---|
| Bruiser | **Anchor** | Sentry term in raid defence ×1.25. On a Scuffed hold, Scent loss is 10 instead of 20. |
| Scrapper | **Scrapper-on-the-Wall** | Sentry term ×1.10. On a Repelled raid, one adjacent rival Patch loses 10 Scent (chases them home). |
| Prowler | **Lookout** | Raids on this Patch are forecast in the Morning Sniff one day ahead. In a live defence, raiders start Ruffled (proposed to Combat). |
| Yowler | **Crier** | Nightly Scent refresh 14 instead of 10. Caterwaul window ×1.5. |
| Trickster | **Scrounger** | Tribute from this Patch +15%. Sentry term ×0.90. |

**Warden.** Posted to a claimed district; sits at the Den. Effects: +3 Scent per night on every Patch you hold in the district; reinforces any raid in the district (§4.6); Unwatched Patches in the district pay ×0.8 instead of ×0.6; `seen` decay is slower with a loyal Warden (§4.3). In Life 8 a Warden with Loyalty ≥ 60 keeps the district's deliveries running (§3.13).

**Rations (upkeep).** Each posted Sentry and Warden eats every night (Night Shuffle step 1). The player sets one Rations level for the whole Crew at the Lot:

| Rations | Upkeep | Raid defence | Reported to Crew's Loyalty inputs |
|---|---|---|---|
| Lean | ×0.5 | ×0.9 | `rations = lean` (negative) |
| Fair (default) | ×1.0 | ×1.0 | `rations = fair` (neutral) |
| Feast | ×2.0 | ×1.1 | `rations = feast` (positive) |

Upkeep is paid from the Stash. If the Stash cannot cover it, cats are fed in descending Loyalty order until it is empty; the rest go on **Short Rations** for that night (`rations = none`, raid defence ×0.8). No debt is ever recorded. Benched and Posse cats cost nothing.

**Loyalty.** The formula belongs to Crew & Progression. Territory supplies these per-cat inputs each Night Shuffle (proposed query `SentryStatus(cat_id)`, §6): `nights_posted`, `nights_since_boss_visit` (Mikan Sprayed or Rubbed in that Patch), `rations`, `last_raid_outcome`, `feature` (e.g. cushy Sunspot post), `was_routed`. Territory reads Loyalty only as a multiplier in raid defence (§4.6) and as the Life 8 Warden gate.

**Sentry states:** Benched → Posted → (raid) → Routed-for-a-night (contributes nothing to Scent, defence or Watched status for one Night Shuffle, then resumes; returns to the Lot instead if the Patch was lost). `BetrayalTriggered` removes the cat and vacates the post; if that leaves the Patch Unwatched, the Patch goes with the traitor: it flips to `new_clowder` at Scent 40 (*canon: "take a Patch with them"*).

### 3.7 Raids

Nemesis decides who raids and why and emits `RaidRequested`. Territory decides whether the request is admissible, when it happens, and how it resolves.

**Intake rules (Territory may decline; declined requests are returned as `RaidResolved` with outcome `declined`):**

1. No raids in Life 1.
2. Nightly cap: `1 + floor(patches_held / 10)` raids (1–4).
3. A Patch claimed or reclaimed today is immune tonight.
4. No Patch is raided two nights running.
5. A Den you hold is admissible only if you hold fewer than 3 of its district's outer Patches.
6. Low Wall Corner is never admissible (Home Ground, §3.12).
7. When more requests arrive than the cap allows, Territory keeps those against the lowest-defence Patches first (weighting ×1.5 for Back Door). Rivals pick on the weak: this is how over-expansion is punished.

**Timing.** Admitted raids are queued for the coming night.

- If Mikan is roaming during the Night phase (possible from the cat flap, Life 2), up to 1 queued raid (2 from Life 5) fires **live** at a seeded time in that phase as a **Caterwaul**. The rest resolve in Night Shuffle step 1.
- If Mikan went home at Dusk, all of them resolve in Night Shuffle step 1.

**Caterwaul (live raid).** A yowl in the posted Sentry's voice (or a generic one for an Unwatched Patch), a pulsing plume on the horizon in Whisker Sense, and a HUD edge-marker with the Patch's icon and a shrinking ring. Response window: 120 s of roaming clock (×1.5 with a Crier, +30 s High Perch, +30 s Truck-Roof Lookout, +30 s Yard Claim Bonus).

- **Arrive in time:** `EncounterStarted(opener = raid_defence)`. Proposed to Combat: posted Sentries fight as AI guest allies in addition to the Posse, within the 10-combatant cap. Win → outcome **Repelled (in person)**: Scent +10, Clout +3, normal loot, and a Verdict on the raid leader if they are a Rival. Lose → **Lost**, plus canon wipe rules.
- **Do not arrive:** when the window closes the raid resolves by the same formula as an overnight raid. Ignoring a Caterwaul is never worse than having been asleep. Going home at Dusk is not punished (brief §5.2).

**Auto-resolve outcomes** (formula in §4.6):

| Outcome | Scent | Sentries | Patch |
|---|---|---|---|
| **Repelled** | −5 | Unharmed | Held |
| **Scuffed** | −20 (−10 with an Anchor) | The lowest-Power Sentry is Routed-for-a-night | Held |
| **Lost** | Set to 40, now the attacker's | All Routed; return to the Lot | Flips to the attacker's Clowder; one upgrade level lost (§3.8) |

Loss cap: at most 2 Patches change hands against the player per Night Shuffle in Lives 2–7 (3 in Life 8), counting raids, lapses and betrayals together; raids beyond the cap are downgraded to Scuffed. `RaidResolved` and `PatchChanged` are emitted for each.

**Lapse.** A held Patch whose Scent reaches 0 in step 1 becomes Open (`PatchChanged`, `new_clowder = none`). Sentries on it return to the Lot.

**Motive modifiers** (motive is supplied by Nemesis): `grudge` attack ×1.15 · `comeback` ×1.20 · `uprising` (a Humbled resident) the Scent term is ignored, it is an inside job · `squat` (an Open Patch) auto-success, no roll.

### 3.8 Patch upgrades and specialisations

Bought at the Lot for a Patch you hold. Cat-scale dressing, not buildings.

| Level | Name | Cost | Effect | World dressing (Art) |
|---|---|---|---|---|
| 1 | **Settled** | `3 × base_yield` Morsels | Tribute +10%; raid defence +0.10 R | Claw marks on the post, flattened grass |
| 2 | **Established** | `8 × base_yield` Morsels + 1 Shiny (2 at a Den) | Unlocks one Specialisation (choose 1, can be re-chosen by paying the Morsel cost again) | A crate, an old cushion, a dish |

| Specialisation | Effect | Who wants it |
|---|---|---|
| **Larder** | Tribute +25% from this Patch; in Life 8 it stores 5 days of uncollected Tribute instead of 3 | Rich Patches deep in safe ground |
| **Lookout** | Raid defence +0.25 R; Caterwaul window +30 s; live raiders arrive in view (no Ambush on you) | Border Patches |
| **Hangout** | Scent decay ×0.7; a Routed Sentry here misses no night; reports `feature = hangout` to Loyalty inputs | Patches you cannot visit often; grumpy ex-Rivals |

When a Patch is **Lost**, it drops one upgrade level (Established → Settled → none). The Specialisation choice is remembered and returns when Established is bought again. A Lapse costs no level.

Morsel capacity of this sink if everything is bought: `11 × 1,160 = 12,760` Morsels and 36 Shinies. Payback on Tribute alone is 30+ days for Settled and longer for Larder, on purpose: upgrades are bought for safety and character, and are not a compounding investment (see §5.5).

### 3.9 District-wide bonuses

**Full House** (any district): holding all 5 Patches gives +10% Tribute in that district and zeroes its internal border pressure.

**Claim Bonus** (one per district; active while you hold its Den and a Warden is posted):

| District | Claim Bonus | Rule |
|---|---|---|
| Hidamari Lane | **Home Turf** | Scent decay ×0.5 on all Hidamari Patches (you walk through twice a day). |
| Akane Arcade | **Shopkeepers' Favourite** | All Feeders town-wide give ×1.5; the fishmonger becomes a second Arcade Feeder. |
| Tsukimi Hill | **Lantern Eyes** | Every admitted raid, anywhere, is forecast in the Morning Sniff by district (by Patch if a Lookout is posted there). |
| Shiosai Harbour | **Full Nets** | All upkeep −20%. |
| Kurogane Yard | **Rust Runners' Road** | Tribute Skim (§4.4) is zero town-wide; Caterwaul windows +30 s. |
| Kasumi Heights | **Top of the Hill** | `seen` grace +1 day in every district; nightly raid cap −1 (minimum 1). |

### 3.10 The Tribute pipeline

1. **Generation (Night Shuffle step 3).** After raids and the nemesis step, each Patch still held computes its Tribute (§4.2). Humbled Rivals living on a Patch add to it (§4.2); they are also the cats who can rise up.
2. **District roll-up.** Each district's total is multiplied by its `seen` factor (§4.3) and reduced by Skim for every district between it and home that you have not claimed (§4.4).
3. **Rounds.** The town total is multiplied by `rounds` (§4.3): a boss who did not walk the streets today collects from no one.
4. **Delivery.** `TributeDelivered(amount, by_district)` fires. The food appears on the Doorstep as a physical pile whose size and contents reflect amount and districts (harbour fish, a croquette, a shrine rice ball). Walking onto the Doorstep collects it as carried Morsels and opens the Morning Sniff.
5. **Stashing.** Carried Morsels move into the Stash automatically whenever Mikan enters the garden. The Stash has a capacity (§3.12). What does not fit stays on the Doorstep as **Leftovers**.
6. **Spoilage.** Leftovers still on the Doorstep at the next morning's delivery are gone: swept away by a baffled human (a vignette hook for Narrative; no Morsels are refunded). The running total `wasted_total` is exposed to Narrative and Art for Doorstep dressing. In Lives 1–7 this is the "pointless pile".
7. **Spending.** Only at the Lot (Lessons, recruits' offerings when the recruit flow calls for one, Rations, Treats, Patch and Lot upgrades) and at home (Gifts; Offerings in Lives 8–9).

**Other Morsel sources (all owned here):**

- **Fight loot**, paid on `EncounterEnded(outcome = win)` per Routed enemy (§4.8).
- **Feeders**: humans who feed strays. One per Feeder Corner Patch (6 in town, +1 with the Arcade Claim Bonus). Morning and Day only; absent in Rain except under the Arcade roof. Interact (sit and meow) once per day each. The Patch does not need to be yours, but on a rival Patch begging Bristles it.
- **Back Door scraps**: one pickup per day per Back Door Patch you hold, Morning/Day.
- **Caches**: hidden food found with Whisker Sense (a dropped fish, a bin worth tipping, a bird feeder). 3 per unlocked district per day, reseeded each Night Shuffle.

Home food (the bowl) is never Morsels. It is Bond and Well-Fed (Narrative and Combat). Food at home is love; food on the street is power. Life 8 is the only place the two meet.

### 3.11 Clout

Clout is a point total with seven ranks (*canon names*). A rank needs both its point threshold and its milestone. **Rank never drops** (points can fall, but not below the current rank's threshold), so Crew cap and Sentry slots are never lost to a bad week.

| Rank | Points | Milestone | Crew cap | Sentries postable | Also gates |
|---|---|---|---|---|---|
| House Pet | 0 | — | 6 *(canon)* | 1 | Rivals say "Collar" |
| Lane Cat | 10 | Hold your first Patch | 7 | 2 | Settled upgrades |
| Known Face | 40 | Hold 3 Patches | 8 | 3 | Crate Stack II; Rations choice |
| Boss | 120 | Claim Hidamari Lane | 10 | 5 | Wardens; Established upgrades |
| Two-Street Boss | 250 | Claim 2 districts | 13 | 8 | Crate Stack III; Lot tier-II upgrades |
| Big Whisker | 500 | Claim 4 districts | 18 | 12 | Crate Stack IV |
| Great Boss | 850 | Rout Botan | 24 *(canon)* | 18 | — |

Clout points: first-ever claim of a Patch +10 · `DistrictClaimed` +50 · first Rout of each Captain +5 · Rout of a Boss +30 · Rout of a Nemesis +10 · raid Repelled in person +3 · Verdict given: Chase Off +2, Humble +3, Recruit +2, Nose-Touch +4 · each Rival Routed during the Night phase +1 (max 5/day) · Patch Lost −5 · Posse wipe −5.

Minimum-effort check: a player who claims only 4 Patches per district earns `6 × (40 + 50 + 30 + 10) = 780` from claims and bosses and needs 70 more from Verdicts and night Routs over about 60 days. Milestones, not points, are the real gate.

### 3.12 The Stash, the Lot, and safety floors

- **Stash capacity:** 400 Morsels at start; raised by the Crate Stack upgrade. Shinies have no cap.
- **Carried Morsels** are the day's haul not yet Stashed; a Posse wipe loses 20% of them (*canon*). The Stash is always safe (*canon*).
- **Home Ground:** once claimed, Low Wall Corner (1.1) cannot be raided, cannot go with a traitor, and its Scent never decays below 10. The player always has one wall. This is the system's hard floor against a death spiral.

**Lot upgrades** (bought at the Lot; dressing appears on the kei truck and crates):

| Upgrade | Tier I | Tier II | Tier III | Effect |
|---|---|---|---|---|
| **Crate Stack** (Stash cap 400 →) | 1,200 cap: 150 M | 3,000 cap: 900 M + 3 S | 6,000 cap: 2,500 M + 6 S | Stash capacity |
| **Dry Crate** | 200 M | 800 M + 2 S | — | Leftovers survive 1 / 2 extra mornings |
| **Truck-Roof Lookout** | 300 M + 1 S | 1,200 M + 4 S | — | I: Caterwaul window +30 s. II: also raid forecast by district |
| **Fish Bucket** | 400 M + 1 S | 1,600 M + 4 S | — | Upkeep −10% / −20% |
| **Cushion Pile** | 250 M | 1,000 M + 3 S | — | I: Routed Sentries who return to the Lot are fit next morning. II: reports `lot_comfort` to Loyalty inputs |

Totals: 9,300 Morsels, 24 Shinies.

### 3.13 Lives 8 and 9: the inversion

Life 8 changes four rules. Each is announced by staging, never by text about the humans (Pillar 1).

**A. The Vigil.** Before Life 8 becomes playable, Mikan waits at the entryway (Narrative owns the scene). Territory runs `vigil_nights = 4` Night Shuffles back to back with: Scent decay ×3 (*canon*), `rounds = 0`, raids admitted at the normal cap with the Life 8 loss cap of 3, Short Rations for everyone (nobody is being fed). Tribute generated during the Vigil is not delivered; it sits uncollected on its Patch (see C). Two protections: Low Wall Corner (Home Ground) holds, and a Den whose Warden has Loyalty ≥ 60 cannot fall below Scent 25 or be raided during the Vigil. What a low-Loyalty Warden does is Nemesis's decision (betrayal). The first playable morning's Sniff is the longest and worst in the game.

**B. Triple decay continues** for the whole of Life 8 (`life_mult = 3`, weather ignored). A Watched Patch loses a net 17–20 Scent per night; an Unwatched one loses 30+. Mikan's Spray and Rubs (+50 per visit) keep roughly 8–10 Patches Strong if the player walks them. The empire cannot all be kept. Choosing which Patches matter is the gameplay.

**C. Tribute stops walking to you.** In Life 8, a district delivers to the Doorstep only if its Warden has Loyalty ≥ 60 and you hold its Den. Everywhere else, each held Patch keeps its own uncollected Tribute beside its Scent Post, up to 3 days' worth (5 with a Larder); the oldest day spoils first. Mikan collects it by going there.

**D. Offerings.** At home the bowl is forgotten: no evening bowl, so no Well-Fed (the buff is canon; its absence here is this document's proposal to Narrative and Combat). Mikan can now pick food up and carry it into the house.

- **Carry.** Mikan carries one piece of food in the mouth, visible on the model. While carrying: no Spray, no Rub, no Whisker Sense hold. If a fight starts the food is dropped on the spot and can be picked up afterwards; on a Posse wipe it is lost.
- **Three kinds of Offering:**

| Offering | Picked up at | Cost | Value toward the bowl |
|---|---|---|---|
| **Scrap** | Any Cache, Feeder or Back Door pickup | Free (you forgo its Morsels) | 50 |
| **From the Stash** | The Stash; player chooses size: Small / Fine / Feast | 100 / 400 / 1,000 Morsels | 100 / 400 / 1,000 |
| **Fresh Catch** | The Scent Post of a held Patch that has uncollected Tribute | Consumes one day of that Patch's stored Tribute | `3 × that day's Tribute` (walking it across town is the cost) |

- **Placing.** Inside the house, set it down at Sora's or Koharu's feet. Up to 3 Offerings per day (one per arrival home; coming home mid-day to deliver and going out again is allowed and does not end the day).
- **What it does.** `offering_value_total` accumulates. At 1,500 Koharu fills the bowl on alternate evenings (Well-Fed returns on those days). At 4,000 the bowl is filled every evening. How the household reacts is Narrative's; Territory only reports `offerings_delivered`, `offering_value_total` and the kinds given.
- **Life 8 turf goal (proposed; the brief leaves it open):** deliver 9 Offerings, of which at least 3 are Fresh Catch from 3 different districts. Always completable: Scraps are free, and Low Wall Corner cannot be lost. No territory count is required. "Retake what matters" is left to the player.

**Life 9.** Decay returns to ×1. Every district with a Warden delivers again regardless of Loyalty (the Crew carries the old boss). `rounds` is fixed at 1.0. Offerings remain available, one per day. Naming the heir is Crew & Progression's; Territory hands the heir the Stash total and the Patch map for the epilogue ("what is on the Doorstep").

### 3.14 Scope tiers

| Tier | In scope from this document |
|---|---|
| Vertical slice (Lives 1–2) | Hidamari's 5 Patches; Scent, Spray, Rub Marks, the escalation flow, Den lock; Sentries with Style roles; Warden at claim; one scripted and one systemic raid with Caterwaul; Tribute to the Doorstep with `rounds`; Stash and Crate Stack I; Clout to Boss; Settled upgrades; Fight loot, one Feeder, Caches |
| Alpha | All districts; `seen`; Rations; Established and Specialisations; Claim Bonuses; all Lot upgrades; weather effects; the Vigil and Offerings |
| Full vision | Skim; Humbled-resident uprisings; full Morning Sniff forecast |
| First to cut if territory depth must shrink (brief §10 protects it fourth) | Skim → Specialisations (keep Settled only) → Rub Marks (Counter-Spray and Routs alone still drive escalation) → Claim Bonuses beyond Full House |

### States and Transitions

**Patch**

| State | Entry condition | Exit condition | Behaviour |
|---|---|---|---|
| **Rival-Held** | Start of game; a raid is Lost; a `squat`; a traitor takes it | Player makes a loud act → Contested | Rival Scent regenerates to its ceiling. Pays you nothing. |
| **Den-Locked** (Dens only) | Player holds <3 outer Patches in the district | Player holds 3 → Rival-Held (contestable) | Post cannot be Counter-Sprayed. Boss absent. |
| **Contested** | Seen Rub, Counter-Spray, or a fight inside a rival Patch | Holder Routed and Verdict given → Open · Posse wipe or player leaves → Rival-Held | Turf waves, then Standoff at `S_r ≤ 30`. |
| **Open** | Holder Routed; or a held Patch's Scent hits 0 (Lapse) | Claim Spray → Held · Nemesis moves a Rival in overnight → Rival-Held | No owner, no Tribute. |
| **Held (Watched)** | Claim Spray plus a fit Sentry, or a Den with a Warden | Sentry removed/Routed → Held (Unwatched) · raid Lost → Rival-Held · Scent 0 → Open | Full Tribute; Sentry refresh nightly. |
| **Held (Unwatched)** | Claim Spray with no Sentry | Sentry posted → Held (Watched) · raid Lost → Rival-Held · Scent 0 → Open | Tribute ×0.6 (×0.8 under a Warden); no Sentry refresh. |
| **Under Raid** (live) | A queued raid fires as a Caterwaul | Player arrives → `raid_defence` encounter → Held or Rival-Held · window closes → auto-resolve | Response ring on HUD. |

Overlay flags on Held: **Threatened** (a raid is queued; shown only if forecast), **Lapsing** (Scent is Faint), **Immune** (claimed today).

**District**

| State | Entry condition | Exit condition | Behaviour |
|---|---|---|---|
| **Rival** | Start | Hold 3 outer Patches → Den Open | Normal. |
| **Den Open** | 3 of 4 outer Patches held | Boss Routed and Den claimed → Claimed · drop below 3 → Rival | Den contestable. |
| **Claimed** | `DistrictClaimed` | Den Lost → Usurped | Claim Bonus if a Warden is posted; remaining rival Patches are Holdouts. |
| **Usurped** | Den Lost after a claim | Retake the Den (no 3-Patch requirement the second time; the usurper is the Holder) → Claimed | Claim Bonus off. Life goal stays met. |

### Interactions with Other Systems

| System | In | Out | Responsibility split |
|---|---|---|---|
| Combat | `EncounterEnded` (outcome, routed_ids, patch_id) | Encounter requests: turf wave (patch, tier, `turf_confidence`), `raid_defence` (attackers, guest Sentries) | Combat owns composition, Ruffled values, guest-ally rules. Territory owns when a wave is called and what a Rout does to Scent. |
| Nemesis | `VerdictApplied`, `RaidRequested`, `RivalRankChanged`, `BetrayalTriggered`; `holder_id` per rival Patch | `PatchChanged`, `DistrictClaimed`, `RaidResolved` (incl. `declined`) | Nemesis owns who and why; Territory owns admissibility, timing, math, and the Patch result. |
| Crew & Progression | `PowerRating(cat_id)`, `Loyalty(cat_id)`, cat `style`, `level`, `assignment` | `SentryStatus(cat_id)` inputs; posting changes | Crew owns the Loyalty formula, Sentry XP and prices proposed for Lessons; Territory confirms prices and owns upkeep. |
| Clock (brief §5) | `PhaseChanged`, `DayEnded`, `LifeAdvanced` | — | Territory runs Night Shuffle step 1 and step 3 in canon order. |
| Narrative | `BondChanged`; Life state; forced weather on story days | `TributeDelivered`, `wasted_total`, Offering reports | Narrative owns every household reaction and the Life 8 beat sheet. |
| UX | — | All data in §11 | UX owns the screens. |
| Art / Audio | — | `PatchChanged` for world dressing and scent colour; Caterwaul trigger | Presentation only. |

---

## 4. Formulas

All randomness uses the Night Shuffle's seeded generator so that results are deterministic and testable (Pillar 4, Engineering row).

### 4.1 Nightly Scent (player-held Patch)

```
decay   = base_decay × env_mult × feature_mult × district_mult + border_pressure
refresh = Σ sentry_refresh + warden_refresh
scent'  = clamp(scent − decay + refresh, floor, 100)
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| base_decay | int | 10 | data | Scent lost per night |
| env_mult | float | 0.8–3.0 | weather / Life | Clear 1.0 · Rain 1.5 · Wind 1.2 · Fog 0.8. In Life 8 it is 3.0 and weather is ignored |
| feature_mult | float | 0.49–1.0 | Patch | Quiet Stones 0.7; Hangout 0.7; both multiply (0.49). Quiet Stones treats Rain as 1.0 |
| district_mult | float | 0.5–1.0 | Claim Bonus | 0.5 in Hidamari with Home Turf |
| border_pressure | int | 0–8 | neighbours | `2 ×` number of adjacent Patches held by a rival Clowder; 0 inside a Full House |
| sentry_refresh | int | 0–14 each | Crew | 10 per fit Sentry; 14 for a Crier; 0 if Routed |
| warden_refresh | int | 0 or 3 | posting | 3 if the district has a Warden |
| floor | int | 0 or 10 | Patch | 10 for Low Wall Corner, else 0 |

**Expected range:** −38 to +31 per night.
**Examples.** Unwatched Arcade Patch, clear night, one rival neighbour: `10 + 2 = −12`. From 100 it stays Strong for 3 nights (88, 76, 64) and lapses on the 9th. Same Patch with a Sentry and a Warden: `−12 + 13 = +1`. Life 8, Watched with Warden, no rival neighbours: `−30 + 13 = −17`. Life 8, Unwatched: `−30`.

Rival-held Patch: `S_r' = min(ceiling, S_r + 8 + contest_abandon_bonus)`, ceilings in §3.4.

### 4.2 Patch Tribute

```
patch_tribute = base_yield × scent_mult × watch_mult × (1 + bonus_sum)
bonus_sum     = upgrade + larder + scrounger + humbled + full_house + weather_feature
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| base_yield | int | 8–100 | §3.1 | Per Patch |
| scent_mult | float | 0.5 / 0.8 / 1.0 / 1.1 | §3.2 | By band |
| watch_mult | float | 0.6 / 0.8 / 1.0 | §3.6 | Unwatched / Unwatched under a Warden / Watched |
| upgrade | float | 0 or 0.10 | §3.8 | Settled or better |
| larder | float | 0 or 0.25 | §3.8 | Larder Specialisation |
| scrounger | float | 0 or 0.15 | §3.6 | Trickster Sentry |
| humbled | float | 0 / 0.15 / 0.30 | Nemesis | 0.15 per Humbled Rival living on the Patch, max 2 |
| full_house | float | 0 or 0.10 | §3.9 | All 5 Patches in the district |
| weather_feature | float | −0.20 or 0 | §3.1 | Feeder Corner on a Rain night |

**Expected range per Patch:** 2 (Low Wall Corner, Faint, Unwatched) to 209 (Auction Shed with everything). `bonus_sum` is clamped to [−0.2, +0.9].
**Example.** Ice Crate Row: `75 × 1.1 (Pungent) × 1.0 × (1 + 0.10 + 0.15) = 103`.

### 4.3 Seen, Rounds, and the nightly total

```
seen_d          = 1.0                                   if days_since_visit_d ≤ grace
                = max(seen_floor, 1.0 − seen_step × (days_since_visit_d − grace))   otherwise
rounds          = min(1.0, roam_minutes_today / rounds_minutes)
tribute_tonight = floor( rounds × Σ_d [ seen_d × (1 − skim_d) × Σ patch_tribute in d ] )
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| days_since_visit_d | int | 0+ | Territory | Days since Mikan last Sprayed or Rubbed one of their own marks, or won a fight, in district d |
| grace | int | 2–3 | data | 2 days; 3 with the Heights Claim Bonus |
| seen_step | float | 0.15 / 0.10 | data | Per day past grace; 0.10 if the district's Warden has Loyalty ≥ 60 |
| seen_floor | float | 0.4 / 0.7 | data | 0.7 if the district's Warden has Loyalty ≥ 60 |
| roam_minutes_today | float | 0–22 | Clock | Day-clock minutes actually spent roaming. Nap skips do not count |
| rounds_minutes | float | 10 | data | Two phases: a Morning-and-Day outing earns full Tribute |

**`rounds` is forced to 1.0** when the day ended in a Posse wipe or the automatic walk home, on any day Narrative flags as story-forced, in Life 1, and in Life 9. It is forced to 0 during the Vigil.
**Why:** `rounds` is what makes sleeping through days worthless; `seen` is what makes sitting in the garden worthless after two days. Going home at Dusk after a normal outing always pays in full.
**Example.** End of Life 4, three districts worth 54 + 124 + 108 = 286. Mikan roamed 12 minutes (rounds 1.0), has not visited Tsukimi for 4 days, Warden there has Loyalty 45: `seen = 1 − 0.15 × 2 = 0.70`. Tribute = `54 + 124 + 0.70 × 108 = 253`.

### 4.4 Skim

```
skim_d = min(0.45, 0.15 × unclaimed_districts_on_path(d, home))
```

Tribute walking home through a district you do not hold is taxed by the cats who live there. `unclaimed_districts_on_path` uses the district adjacency graph (assumed: Harbour–Arcade–Hidamari–Tsukimi–Heights in a line, Yard adjacent to Arcade and Harbour; to be confirmed by level design). Because Lives claim districts roughly outward from home, Skim is usually 0 before Life 8 and bites when a middle district is Usurped. Zero with the Yard Claim Bonus. **Example:** Arcade is Usurped; Harbour's 340 arrives as `340 × 0.85 = 289`.

### 4.5 Upkeep

```
upkeep_cat   = round( (1 + 0.25 × level) × post_mult × rations_mult × (1 − discount) )
upkeep_night = Σ upkeep_cat over posted Sentries and Wardens
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| level | int | 1–50 | Crew | The posted cat's level |
| post_mult | float | 1 / 2 | posting | Sentry 1, Warden 2 |
| rations_mult | float | 0.5 / 1 / 2 | Lot setting | Lean / Fair / Feast |
| discount | float | 0–0.40 | upgrades | Fish Bucket (0.10/0.20) + Full Nets (0.20) |

**Range per cat:** 1 (Lv 1 Sentry, Lean) to 54 (Lv 50 Warden, Feast, no discounts).
**Example.** Lv 24 Sentry, Fair: `1 + 6 = 7`. Lv 44 Warden, Fair, Full Nets: `12 × 2 × 0.8 = 19`.
A stronger guard costs more to feed: putting your best cat on a wall is a real choice.

### 4.6 Raid auto-resolve

```
sentry_term = home_adv × rations_def × Σ_s [ PR(s) × style_mod(s) × loyalty_mod(s) ] / attack
warden_term = 0.25 × PR(warden) × loyalty_mod(warden) / attack        (0 if no Warden)
scent_term  = 0.005 × scent                                           (0 for an uprising)
R           = sentry_term + warden_term + scent_term + fixed_bonus
attack      = motive_mod × Σ PR(attackers)
p_hold      = clamp( R³ / (R³ + 1), 0.05, 0.95 )
u           = seeded uniform [0,1)
outcome     = Repelled if u < p_hold² ; Scuffed if u < p_hold ; else Lost
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| PR(x) | float | Crew's scale | `PowerRating` query | Only ratios are used, so the formula does not depend on the scale |
| home_adv | float | 1.5 | data | A cat on its own wall |
| rations_def | float | 0.8 / 0.9 / 1.0 / 1.1 | §3.6 | Short / Lean / Fair / Feast |
| style_mod | float | 0.90–1.25 | §3.6 | Anchor 1.25 · Scrapper 1.10 · Scrounger 0.90 · others 1.0 |
| loyalty_mod | float | 0.6–1.0 | `Loyalty` query | `0.6 + 0.4 × Loyalty / 100` |
| fixed_bonus | float | 0–0.50 | Patch | Settled 0.10 · Lookout 0.25 · High Perch 0.15 |
| motive_mod | float | 1.0–1.2 | §3.7 | By motive |

**Expected R:** 0.0 to about 4. **p_hold** by R: 0.4 → 0.06 · 0.7 → 0.26 · 1.0 → 0.50 · 1.5 → 0.77 · 2.0 → 0.89 · 2.5 → 0.94.
**Example A (Watched, at par).** One Bruiser Sentry of Power 400, Loyalty 80, Fair rations; two Toughs of Power 400 each with a grudge; Scent 80; Settled; Warden of Power 480, Loyalty 70. `attack = 1.15 × 800 = 920`. `sentry_term = 1.5 × 400 × 1.25 × 0.92 / 920 = 0.75`. `warden_term = 0.25 × 480 × 0.88 / 920 = 0.11`. `scent_term = 0.40`. `R = 0.75 + 0.11 + 0.40 + 0.10 = 1.36`, `p_hold = 0.72`: Repelled 51%, Scuffed 20%, Lost 28%.
**Example B (same Patch, Unwatched, no Warden).** `R = 0.40 + 0.10 = 0.50`, `p_hold = 0.11`. An Unwatched Patch that gets raided is usually lost. That, plus intake rule 7, is the price of over-expansion.
**Edge:** `attack = 0` (empty attacker list) → request declined. No Sentries and Scent 0 cannot occur (the Patch would be Open; that is a `squat`).

### 4.7 Clout

`clout = Σ events` per §3.11, with `clout ≥ threshold(current_rank)` enforced after each change. Range 0 to about 1,400.

### 4.8 Morsel faucets

```
tough_loot(L)  = round(2 + 0.3 × L)
enemy_loot     = tough_loot(L) × rank_mult × night_mult × repeat_mult × belly_mult
```

| Variable | Range | Description |
|---|---|---|
| L | 1–50 | Enemy level |
| rank_mult | 0.5 / 1 / 5 / 25 | Critter / Stray or Tough / Captain / Boss |
| night_mult | 1.0 / 1.25 | Night phase |
| repeat_mult | 1.0 / 0.25 | 0.25 if this same Rival was already Routed today |
| belly_mult | 1.0 / 0.25 | 0.25 once today's fight loot exceeds `40 × tough_loot(Mikan's level)` (**Full Belly**: a soft daily cap against grinding) |

Worked values: `tough_loot` = 2 (Lv 1) · 4 (Lv 8) · 7 (Lv 16) · 9 (Lv 24) · 12 (Lv 32) · 14 (Lv 40) · 16 (Lv 48) · 17 (Lv 50). A Lv 48 Boss pays 400.

Scavenging: Feeder `= feeder_base[district]` = 4 / 10 / 8 / 20 / 14 / 18 for districts 1–6 (×1.5 with the Arcade Claim Bonus). Back Door scrap `= round(0.25 × base_yield)`. Cache `= round(tough_loot(district_mid_level) × U[1, 3])`.

### 4.9 Prices

```
lesson_price(tier)  = 40, 90, 180, 360, 750, 1,500 Morsels for tiers 1–6; Shinies 0, 0, 0, 1, 2, 4
knack_lesson        = 1.5 × lesson_price(tier) Morsels, same Shinies
recruit_offering    = clamp( round(4 × level × rank_mult × (1 + grudge / 100)), 20, 800 )
treat_cost          = 5 + level                      (one per Crew cat per day; feeds Crew's Loyalty inputs)
gift_cost           = 8 × life_index                 (one per day; carried into the house; Narrative decides what, if anything, it does to Bond)
settled_cost        = 3 × base_yield
established_cost    = 8 × base_yield  (+1 Shiny, +2 at a Den)
```

`rank_mult` for recruits: Stray 1 · Tough 1.5 · Captain 3. **Examples:** Lv 2 Stray, no Grudge: `8 → 20` (floor, *canon*). Lv 24 Tough, Grudge 50: `216`. Lv 48 Captain, Grudge 100: `1,152 → 800` (ceiling, *canon*). First Lesson 40 and top Lesson 1,500 + Shinies are *canon*; which Moves sit in which tier is Crew's proposal.

### 4.10 Stash and Leftovers

```
stashed   = min(carried, stash_cap − stash)
leftovers = carried − stashed            (stay on the Doorstep; spoil after 1 + dry_crate mornings)
```

`stash_cap` ∈ {400, 1,200, 3,000, 6,000}.

### 4.11 Offerings (Lives 8–9)

`offering_value` per §3.13 D; `fresh_catch_value = 3 × patch_tribute(day)`. Thresholds: 1,500 (bowl on alternate evenings), 4,000 (every evening). **Example:** one day of Ice Crate Row at Clear Scent in Life 8, `75 × 0.8 = 60`, carried home is worth 180.

### 4.12 Shinies

| Source | Each | Count | Total |
|---|---|---|---|
| Bosses (first Rout) | 5; Botan 10 | 6 | 35 |
| Captains (first Rout) | 1 | 12 | 12 |
| Nemeses (first Rout of each) | 1 | capped at 15 | 15 |
| Hidden finds by day (fixed pickups, Whisker Sense) | 1 | 40 | 40 |
| Hidden finds that appear only in the Night phase | 1 | 12 | 12 |
| The last walk, Life 9 (one per district) | 1 | 6 | 6 |
| **Total in game** | | | **120** *(canon ≈120)* |

All Shiny sources are fixed and one-time: no drop rates, no pity system needed. Sinks: Lot upgrades 24 · Established upgrades 36 · Lessons tier 4–6 (budget about 60, Crew to confirm) = **120 of sink capacity against 120 of supply**, and a reference player is expected to find about 95. Shinies are meant to stay scarce through to the end.

---

## 5. The economy across the whole game (paper model)

### 5.1 Reference player

60 in-game days over about 26 hours (*canon: 55–65 days, 22–28 h*): Lives 1–9 take 3, 7, 8, 8, 8, 8, 9, 6, 3 days. Plays most days into Night, posts as many Sentries as Clout allows, keeps Fair rations, loses a Patch every 2–3 days and retakes it.

### 5.2 Tribute against the canon anchors

Nominal Tribute at Strong Scent, before upgrades, with Wardens at Dens and the available Sentries on the richest outer Patches:

| Moment | Rank / Crew / Sentries | Held | Calculation | Nominal | With typical upgrades and bonuses (about +10%) | Canon anchor |
|---|---|---|---|---|---|---|
| End of Life 2 | Boss just earned / 8 / 3 | Hidamari | 16 + 32 (three Watched) + 8×0.8 | 54 | 59 | ≈ 60 |
| End of Life 4 | Two-Street Boss / 13 / 7 | + Arcade, Tsukimi | 48 + 124 + 108 | 280 | 308 | ≈ 300 |
| End of Life 7 | Big Whisker / 18 / 9 | all six | 48 + 106 + 96 + 340 + 230 + 270 | 1,090 | 1,199 | ≈ 1,200 |

At Great Boss (24 Crew) the same holdings reach about 1,300. The model lands within 10% of each anchor.

### 5.3 Faucets and sinks by Life

Income per day is the Life's average, not its end value.

| Life | Days | Tribute/day | Fights/day | Scavenge/day | **Income** | Upkeep | Lessons | Recruits | Patch upg. | Lot upg. | Treats, Gifts, losses | Offerings | **Spend** | Sink capacity ÷ income | Stash at end |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 3 | 20 | 8 | 93 | 0 | 40 | 20 | 0 | 0 | 0 | — | 60 | 0.8 | 33 |
| 2 | 7 | 28 | 60 | 15 | 721 | 35 | 170 | 120 | 90 | 150 | 85 | — | 650 | 1.25 | 104 |
| 3 | 8 | 105 | 100 | 30 | 1,880 | 190 | 700 | 320 | 300 | 200 | 140 | — | 1,850 | 1.3 | 134 |
| 4 | 8 | 225 | 160 | 45 | 3,440 | 575 | 1,400 | 600 | 400 | 250 | 175 | — | 3,400 | 1.4 | 174 |
| 5 | 8 | 440 | 230 | 70 | 5,920 | 960 | 2,600 | 1,000 | 700 | 350 | 200 | — | 5,810 | 1.4 | 284 |
| 6 | 8 | 750 | 307 | 85 | 9,136 | 1,600 | 3,600 | 1,400 | 1,100 | 800 | 200 | — | 8,700 | 1.15 | 720 |
| 7 | 9 | 1,030 | 420 | 100 | 13,950 | 2,485 | 3,500 | 1,100 | 1,300 | 1,450 | 315 | — | 10,150 | **0.73** | **4,520** |
| 8 | 6 | 650 | 300 | 80 | 6,180 | 2,105 | 1,490 | 1,340 | 410 | 100 | 105 | 3,550 | 9,100 | 1.8 | 1,600 |
| 9 | 3 | 700 | 100 | 40 | 2,520 | 1,050 | 0 | 0 | 0 | 0 | 0 | 950 | 2,000 | — | 2,120 |
| **Total** | 60 | 27,600 | 12,800 | 3,440 | **43,840** | 9,000 | 13,500 | 5,900 | 4,300 | 3,300 | 1,220 | 4,500 | **41,720** | | |

Tribute share of income: 27% in Life 2, 52% in Life 4, 66% across Life 7 and **70% at the end of Life 7** (1,200 of 1,720; *canon*).

**Sink capacity and exhaustion, per sink:**

| Sink | Capacity | Does it run out? |
|---|---|---|
| Upkeep | Recurring; about 16–23% of Tribute at Fair, double at Feast | Never. Scales with empire size. |
| Lessons | Catalogue is Crew's; tiers 1–3 are Morsel-only | Not in Morsels, but tiers 4–6 are Shiny-gated, so Morsel spend on Lessons stalls when Shinies do. |
| Recruit offerings | 20–800 each | Yes: stops when the Crew cap is full. |
| Patch upgrades | 12,760 Morsels, 36 Shinies | Yes: finite, and the second level is Shiny-gated. |
| Lot upgrades | 9,300 Morsels, 24 Shinies | Yes: finite. |
| Treats and Gifts | Up to about 80–150 per day late | Small, daily-limited. |
| Offerings (Lives 8–9) | 3 per day × up to 1,000 | Not within the length of Lives 8–9. |

**Reading the table honestly.** Through Life 6 the player wants more than they can afford (capacity ÷ income of 1.15–1.4): Tribute funds choices, as the brief requires. In Life 7 three sinks saturate together (Crew cap full, finite upgrades mostly bought, top Lessons waiting on Shinies), income keeps climbing, and the Stash fills toward its 6,000 cap. **That surplus is intended**, because the brief's Life 8 inversion needs a pile that has no use, and it is bounded by the Stash cap and Leftover spoilage. It is also the weakest joint in the model: if Life 7 runs long, about 1,700 Morsels a day have nowhere to go but the Doorstep. See §15.

### 5.4 Hour by hour

Rounded; Life boundaries fall mid-hour. Stash is the end-of-hour balance.

| Hour | Life | Income | Spend | Stash | What the player is buying / what is happening |
|---|---|---|---|---|---|
| 1 | 1 | 55 | 40 | 15 | First Lesson (40) |
| 2 | 1→2 | 118 | 100 | 33 | First recruit; first Patch pays 8 a day |
| 3 | 2 | 220 | 190 | 63 | Second and third Sentries; Settled on two Patches |
| 4 | 2 | 260 | 230 | 93 | Crate Stack I; Daifuku's loot |
| 5 | 2→3 | 341 | 330 | 104 | Hidamari claimed, first Warden; tier-2 Lessons |
| 6 | 3 | 440 | 430 | 114 | Arcade Patches; upkeep becomes noticeable |
| 7 | 3 | 560 | 550 | 124 | Tier-3 Lessons compete with recruits |
| 8 | 3 | 700 | 690 | 134 | Madam Sabi; Feeders ×1.5 |
| 9 | 4 | 800 | 790 | 144 | First Established upgrade; first real over-stretch |
| 10 | 4 | 950 | 930 | 164 | Tier-4 Lessons need the first Shinies |
| 11 | 4 | 1,080 | 1,060 | 184 | Raids on the Arcade while you are on the Hill |
| 12 | 4→5 | 1,260 | 1,240 | 204 | Oboro; raid forecasts switch on |
| 13 | 5 | 1,450 | 1,430 | 224 | Harbour Patches: one is worth all of Hidamari |
| 14 | 5 | 1,750 | 1,720 | 254 | Crate Stack II; Sentry cap bites (8) |
| 15 | 5 | 2,070 | 2,040 | 284 | Ikari; upkeep −20% |
| 16 | 6 | 2,350 | 2,300 | 334 | Tier-5 Lessons; Rations choices start to matter |
| 17 | 6 | 2,600 | 2,500 | 434 | Recruit offerings near the 800 ceiling |
| 18 | 6 | 2,800 | 2,650 | 584 | Upgrade list thinning |
| 19 | 6→7 | 2,886 | 2,600 | 870 | Kiha & Moha; Crew cap 18 nearly full |
| 20 | 7 | 3,300 | 2,500 | 1,670 | Shinies run short; Morsels start to pile |
| 21 | 7 | 3,550 | 2,500 | 2,720 | Crate Stack III; little left to want |
| 22 | 7 | 3,800 | 2,600 | 3,920 | Leftovers begin to rot on the Doorstep |
| 23 | 7→8 | 3,100 | 2,500 | 4,520 | Botan; then the Vigil |
| 24 | 8 | 2,300 | 3,900 | 2,920 | Offerings from the Stash; Feast rations to hold Wardens |
| 25 | 8 | 2,580 | 3,900 | 1,600 | Fresh Catch runs; the bowl is filled again |
| 26 | 9 | 2,520 | 1,900 | 2,220 | The Crew carries it; what is left goes to the epilogue |

No inflation mechanism exists in this economy: prices are fixed, there is no player-to-player trade, and no price scales with wealth. The only inflation-like risk is purchasing power outrunning the catalogue, which is the Life 7 surplus above.

### 5.5 Is there a dominant idle strategy?

Five ways to spend a day, evaluated at the end of Life 4 (nominal Tribute 300, upkeep 72) and the end of Life 7 (Tribute 1,200, upkeep 276):

| Strategy | Real minutes | Net Morsels, L4 | Net Morsels, L7 | XP, Clout, Shinies | What happens over a week |
|---|---|---|---|---|---|
| **A. Full day** (out through Night) | about 30 | 300 + 190 + 50 − 72 = **468** (15.6/min) | 1,200 + 420 + 100 − 276 = **1,444** (48/min) | All | Empire grows; raids answered in person |
| **B. Home by Dusk** | about 18 | 300 + 95 + 30 − 72 = **353** (19.6/min) | 1,200 + 210 + 60 − 276 = **1,194** (66/min) | XP about half; no Night Clout, Rivals or Night Shinies; gains Bond and Well-Fed | Stable; night raids auto-resolve |
| **C. Patrol only** (walk the rounds, avoid fights, 10 clock-minutes) | about 12 | 300 + 20 − 72 = **248** (20.7/min) | 1,200 + 40 − 276 = **964** (80/min) | None | Loses about one Patch every 2–3 days it never retakes; Tribute erodes; nothing new to buy |
| **D. Sleep-skip** (wake, collect, sleep) | about 2 | `rounds = 0` → 0 − 72 = **−72** | **−276** | None | Strictly negative from day one; Loyalty inputs worsen; Scent and `seen` fall |
| **E. Sit in the garden** for 10 clock-minutes | about 10 | 228 for two days, then `seen` decays: about **48** by day 6 | 924, falling to about **300** by day 6 | None | As D, more slowly |

Conclusions:

- **Pure idle (D, E) is not viable.** D loses Morsels every day; E decays to a fraction within a week while territory erodes.
- **Morsels per real minute is higher for B and C than for A.** This is inherent in a per-day income with a player-chosen day length, and it is accepted rather than fully removed, because (1) the brief requires that going home at Dusk is not punished, (2) Morsels are only useful with things to buy, and everything worth buying is gated by level, Clout, Crew cap or Shinies, which only A and B produce, and (3) C bleeds Patches. A player who patrols for ten minutes and goes home has still walked their streets and Sprayed their posts: that is playing the territory game, not idling. It is nonetheless listed in §15 as a risk to watch.
- **Upgrades do not compound.** Settled pays back in 30 days and Larder in 32, against a 60-day game, so no early "buy income, snowball" line exists; income growth comes from taking ground, which needs fights.

### 5.6 Is there a death spiral?

The feared loop: lose Patches → less Tribute → cannot pay upkeep → Loyalty falls → betrayals → lose more Patches.

| Brake | Rule | Section |
|---|---|---|
| Loss cap | At most 2 Patches lost per night (3 in Life 8) | §3.7 |
| Raid cap shrinks with the empire | `1 + floor(held / 10)` | §3.7 |
| Dens protected by periphery | Need <3 outer Patches before a Den can be raided | §3.5 |
| Upkeep shrinks with losses | Sentries of a lost Patch return to the Lot and cost nothing | §3.6 |
| No debt | Unpaid upkeep becomes Short Rations for one night, nothing carried forward | §3.6 |
| Territory-independent income | Fight loot and scavenging scale with level, not holdings: 230 + 70 a day in Life 5 with zero Patches | §4.8 |
| Easier retakes | Stale Claim: rival Scent ceiling 60 for 3 nights | §3.4 |
| Immunity | A Patch claimed today cannot be raided tonight | §3.7 |
| Sticky Clout rank and sticky Life goals | Crew cap, Sentry slots and story progress never regress | §3.5, §3.11 |
| Home Ground | Low Wall Corner cannot be lost | §3.12 |

**Worst-case walk-through, mid Life 5** (15 Patches held, Tribute 440, upkeep 120, fights and scavenging 300): the player ignores territory for 5 days and the maximum 2 Patches fall each night. After 5 nights: 5 Patches held, Tribute about 90, upkeep about 40 (most Sentries are at the Lot), fights and scavenging still 300 on any day the player plays. Daily net is still about +350. The raid cap is now 1 per night and three of the lost Patches have Stale Claim. Recovering at two Patches a day takes 5 days. Painful, never terminal, and the Fence Line is now full of promoted Rivals with new Titles: the setback is content (Pillar 4).

### 5.7 Economic health metrics

To be computed from simulation and playtest telemetry (coordinate with analytics-engineer):

| Metric | Healthy | Warning | Action |
|---|---|---|---|
| Stash ÷ one day's income, Lives 2–6 | 0.3–1.5 | >3 (nothing to buy) or <0.1 for 3+ days (starved) | Adjust Lesson tier prices or loot curve |
| Stash at end of Life 7 | 3,000–6,000 | <1,500 (no pile for Life 8) or cap hit before Life 7 day 4 | Adjust `stash_cap` IV or Shiny supply |
| Tribute share of income at end of Life 7 | 65–75% | <60% or >80% | Adjust `tough_loot` slope |
| Upkeep ÷ Tribute | 15–25% | >35% | Adjust upkeep slope |
| Patches lost per day, Lives 3–7 | 0.3–0.6 | >1.0 (churn) or <0.1 (raids toothless) | Adjust intake cap; ask Nemesis to adjust request rate |
| Share of raids answered in person (Night-roaming days) | 40–70% | <20% (Caterwaul ignored or unreachable) | Lengthen window |
| Unwatched share of held Patches | 20–40% | <10% (no stretch) or >60% | Adjust Sentry caps by Clout |
| Morsels per real minute, strategy C ÷ strategy A | ≤1.5 | >2 | Raise `rounds_minutes` or tie a share of Tribute to posts visited |
| Leftovers spoiled before Life 7 | <5% of Tribute | >15% | Stash caps too tight |
| Days from first affordability to purchase of Crate Stack tiers | 0–2 | >5 | Tier is mispriced or unexplained |

---

## 6. Edge Cases

| Scenario | Expected behaviour | Rationale |
|---|---|---|
| Player Sprays their own post twice in a day | Second attempt plays a short "nothing left" animation (a shake, no cloud); no Scent | Daily limit per post; comedy, not an error message |
| Player Counter-Sprays, then is hit during the 1.2 s hold | Spray is cancelled, no Scent change, the post's daily use is not consumed | Interruptible, never wasteful |
| `S_r` reaches 0 from erosion alone, Holder never fought | The Patch does not become Open. `S_r` floors at 1 until the Holder is Routed; the Standoff triggers as soon as Mikan is inside the Patch | No Patch is ever taken without a Verdict (Pillar 4) |
| The Holder is absent (already Chased Off, or in the Posse of another event) | Nemesis supplies a replacement `holder_id` at Bristle; if none exists, the highest-ranked cat of the final wave is promoted to Rival and becomes the Holder | A Patch always has a face |
| Holder Routed, player gives Recruit, Posse is full | The Verdict and recruit flow are Crew's; the Patch still becomes Open | Separation of ownership |
| Patch left Open at day's end and no Rival moves in | Stays Open; pays nobody; can be Claim-Sprayed any day | Open is a stable state |
| Two raids target the same Patch on one night | Intake admits only the first; the second is declined | Rule 4 |
| A raid is queued for a Patch that lapsed, was lost to a traitor, or was Usurped earlier in step 1 | Resolved in this order: decay → upkeep → betrayal vacancies → raids. A raid on a Patch no longer held is declined | Deterministic order inside step 1 |
| Loss cap reached and a third raid would be Lost | Downgraded to Scuffed | Death-spiral brake |
| Caterwaul fires while Mikan is in combat | The window's clock is paused with the day clock; it only counts roaming time | Clock canon |
| Caterwaul fires and Mikan goes home | Raid auto-resolves in step 1 as if never live | Dusk/Night choice not punished |
| Mikan arrives at a live raid with a Posse of 1–2 (left a cat as Sentry earlier) | Fight proceeds; posted Sentries join as guests | Consequence of on-the-spot posting |
| Both Den Sentries and the Warden are Routed in a Scuffed/Lost result | On Lost all are Routed and return to the Lot; on Scuffed only the lowest-Power Sentry is | One rule for all Patches |
| Warden's district is Usurped | Warden returns to the Lot unassigned; Claim Bonus off until the Den is retaken and a Warden posted | §3.5 |
| `BetrayalTriggered` for a Warden | Post vacated. The Den goes with the traitor only if it has no other fit Sentry; this counts toward the nightly loss cap | Canon betrayal, bounded |
| `BetrayalTriggered` for the Sentry on Low Wall Corner | Cat leaves; the Patch stays yours | Home Ground |
| Crew cap or Sentry cap exceeded after an event | Cannot happen by loss (ranks are sticky). If a data change causes it, no cat is removed; new postings are blocked until under the cap | Never take a cat away by rule |
| Stash is 0 at upkeep time | All posted cats on Short Rations tonight; no debt; Morning Sniff shows an empty-dish icon per cat | No hidden penalty |
| Stash full and Tribute arrives | Excess stays as Leftovers on the Doorstep; visible; spoils at the next delivery | The cap is the anti-hoard valve |
| Player buys something while Leftovers are on the Doorstep | Walking over the Doorstep again Stashes as much as now fits | Leftovers are real food until they spoil |
| Posse wipe while carrying 0 Morsels | No Morsel loss; other canon effects apply | 20% of zero |
| Posse wipe on a day with less than 10 roaming minutes | `rounds` forced to 1.0 | Do not double-punish a loss |
| Rain on a night when the only visited district was the roofed Arcade | Rain still raises decay town-wide except Quiet Stones; Arcade Feeders remain | Simple rule |
| Narrative forces weather on a story day | Territory uses the forced value | Narrative owns story staging |
| `seen` for Hidamari when Mikan only walked from house to Lot | Not a visit. A visit needs a Spray or Rub on your own mark, or a won fight, in the district | Passing through is not presence |
| Player holds 0 Patches | Tribute 0; raids impossible; upkeep 0; fight loot and scavenging unaffected. Before Life 2 this is normal | Economy must work at zero |
| Player holds all 30 Patches | Raid cap 4 (3 with Heights bonus); only comebacks and uprisings have vectors, since no rival Patch is adjacent | The end state is quiet on purpose, before Life 8 |
| Humbled Rival is later Recruited, Chased Off, or rises up | `humbled` bonus is recomputed from Nemesis's current residents each step 3 | Single source of truth |
| A Patch is Lost and retaken the same day | One upgrade level is already gone; Immune tonight | Loss has a cost; no ping-pong |
| Life advances while raids are queued | Queue is cleared; time-skips do not resolve raids. Scent is set to `max(scent, 60)` on all held Patches at the start of Lives 2–7 | Months pass; do not punish the montage. Life 8 is the exception (the Vigil) |
| Life 8: Mikan is carrying an Offering when a Caterwaul fires | Player chooses; dropping the food to run leaves it where it lies until the end of the phase | A real choice between turf and home |
| Life 8: carried Offering and the day ends by auto walk-home | Mikan carries it home; it counts | Never waste the walk |
| Life 8: every district's Warden is below Loyalty 60 | No Doorstep deliveries at all; all Tribute is collected on foot | The designed worst case; still playable |
| Life 8: Stash is 0 and no Patch but Low Wall Corner is held | Scrap Offerings (free) and Fresh Catch from Low Wall Corner complete the goal apart from the three-district rule, which needs two more Patches retaken | Completable from the floor |
| Difficulty mode Kitten / Feral | Modes scale enemy Nerve, damage and AI only (*canon*). Raid math, prices and Tribute are identical in all modes | Economy is not a difficulty lever |

---

## 7. Dependencies

| System | Direction | Nature of dependency |
|---|---|---|
| Day clock and Lives (brief §5) | This depends on it | Phases, `roam_minutes_today`, Night Shuffle order, Life index for decay, Vigil and Offerings |
| Combat | This depends on Combat | `EncounterEnded` for loot and Scent erosion; encounter composition for turf waves and raid defence |
| Combat | Combat depends on this | Receives encounter requests with `patch_id`, `turf_confidence`, guest Sentries; three proposals awaiting Combat's decision (defenders Ruffled on Faint Scent; raiders Ruffled with a Lookout; Sentries as guest allies) |
| Nemesis | This depends on Nemesis | `RaidRequested`, `VerdictApplied`, `BetrayalTriggered`, `RivalRankChanged`, `holder_id`, Humbled residents per Patch |
| Nemesis | Nemesis depends on this | `PatchChanged`, `DistrictClaimed`, `RaidResolved` (including `declined`), intake rules, the modelled raid request rate (§15) |
| Crew & Progression | This depends on Crew | `PowerRating`, `Loyalty`, level, Style, assignment field; Lesson catalogue and tiers; recruit flow that charges the offering |
| Crew & Progression | Crew depends on this | Crew cap and Sentry caps by Clout; upkeep; `SentryStatus` Loyalty inputs; confirmed prices; Treat purchase |
| Narrative | This depends on Narrative | Life 8 beat sheet and the Vigil's staging; `BondChanged`; story-forced days and weather; whether Gifts move Bond |
| Narrative | Narrative depends on this | `TributeDelivered`, `wasted_total`, Offering counts and kinds, `DistrictClaimed` for Life goals, proposed Life 8 goal |
| UX | UX depends on this | All data in §11 |
| Art | Art depends on this | Patch ownership and band for scent colour and dressing; upgrade dressing; Doorstep pile composition; carried-food model state |
| Audio | Audio depends on this | Spray/Rub events, Caterwaul trigger with Sentry id, `PatchChanged` |
| Level design | This depends on it | Patch bounds, `neighbours[]`, Rub Mark and Scent Post placement, district adjacency for Skim, Feeder and Cache placement |
| Weather (no owner in the brief) | This depends on it | Nightly weather state |

Bidirectional check: each of the other GDDs must list this document in return; none had been seen at the time of writing.

---

## 8. Tuning Knobs

| Parameter | Current | Safe range | Effect of increase | Effect of decrease |
|---|---|---|---|---|
| `base_decay` | 10 / night | 6–15 | More walking the rounds; Unwatched ground lapses faster | Empire holds itself; less reason to patrol |
| `sentry_refresh` (Crier) | 10 (14) | 8–14 (10–18) | Watched Patches climb without Mikan | Even Watched Patches need visits |
| `spray_gain` / `rub_gain` / `nap_gain` | 40 / 5 / 20 | 25–50 / 3–10 / 10–30 | Fewer visits needed | More visits needed |
| `life8_decay_mult` | 3.0 *(canon)* | fixed | — | — |
| `vigil_nights` | 4 | 2–6 | Harsher Life 8 opening | Gentler; less to retake |
| `claim_scent` | 50 | 40–60 | New ground pays and holds sooner | New ground is fragile |
| Erosion: rub / counter-spray / rout | 10 / 30 / 15 | 5–15 / 20–40 / 10–20 | Shorter contests | Longer contests; risk of exceeding the 5-minute target |
| `standoff_threshold` | 30 | 20–40 | Holder appears sooner | More waves first |
| Rival regen / ceiling | 8 / 80 | 5–12 / 70–90 | Less progress carried between days | Multi-day sieges easier |
| Scent band multipliers | 0.5 / 0.8 / 1.0 / 1.1 | ±0.1 each | Steeper reward for upkeep | Flatter |
| `watch_mult` (none / Warden) | 0.6 / 0.8 | 0.4–0.8 / 0.6–0.9 | Softer over-expansion penalty | Harsher |
| `rounds_minutes` | 10 | 5–10 | Must never exceed 10, or going home at Dusk is punished | Short patrol days pay in full |
| `seen` grace / step / floor | 2 / 0.15 / 0.4 | 1–3 / 0.10–0.25 / 0.25–0.6 | Slower or shallower neglect penalty | Faster or deeper |
| `skim_per_district` | 0.15 | 0–0.20 | Contiguity matters more | Set 0 to cut the rule |
| Upkeep slope / base | 0.25 / 1 | 0.15–0.40 / 0–3 | Bigger standing sink; strong guards costlier | Sentries are free money |
| Rations multipliers | 0.5 / 1 / 2 | — | Wider spread makes the dial matter | Narrower makes it noise |
| `home_adv` | 1.5 | 1.2–2.0 | Sentries hold more raids | More churn |
| `scent_term_coeff` | 0.005 | 0.003–0.008 | Scent alone deters raids | Only cats defend |
| Raid exponent | 3 | 2–4 | Outcomes more decisive around R = 1 | Swingier |
| Raid intake cap | `1 + floor(held/10)` | divisor 6–12 | Fewer raids | More pressure on large empires |
| Loss cap per night | 2 (3 in Life 8) | 1–3 (2–4) | Faster collapses possible | Raids matter less |
| `caterwaul_window` | 120 s | 90–180 s | More raids answered in person | Live defence becomes rare |
| Live raids per Night phase | 1 (2 from Life 5) | 0–2 | Busier nights | Quieter nights |
| `base_yield` table | §3.1 | district sums ±20% | Must be re-checked against canon anchors | Same |
| `tough_loot` base / slope | 2 / 0.3 | 1–4 / 0.2–0.4 | Fights fund more; Tribute share falls | Tribute dominates sooner |
| Full Belly cap | 40 × tough_loot | 30–60 | Grinding pays longer | Caps sooner |
| Feeder yields | 4–20 | ±50% | Begging matters | Begging is flavour |
| Lesson tier prices | 40…1,500 | ends fixed by canon; middle ±25% | Scarcer mid-game | Earlier surplus |
| Recruit offering coefficient | 4 | 3–6 | Recruits compete harder with Lessons | Cheaper Crew |
| Upgrade cost multipliers | 3× / 8× | 2–5 / 6–12 | Bigger finite sink | Earlier saturation |
| `stash_cap` tiers | 400 / 1,200 / 3,000 / 6,000 | each ±30% | Less spoilage; bigger Life 7 pile | More spoilage |
| Clout thresholds | §3.11 | points ±20%; milestones fixed | Ranks arrive later | Earlier |
| Sentry cap by rank | 1/2/3/5/8/12/18 | each ±2 | Less stretch | More stretch |
| Offering thresholds | 1,500 / 4,000 | 1,000–2,500 / 3,000–6,000 | Bowl returns later | Sooner |
| Offering goal | 9 total, 3 Fresh from 3 districts | 6–9 / 2–4 | Longer Life 8 | Shorter |
| Weather weights (proposed) | Clear 60 / Rain 15 / Wind 15 / Fog 10 % | Rain 5–25% | More decay and fewer Feeders | Weather becomes flavour |

All of these live in data files. Nothing above may be hardcoded.

---

## 9. Visual/Audio Requirements

| Event | Visual feedback | Audio feedback | Priority |
|---|---|---|---|
| Rub | Cheek-rub animation in stride; a small bell-gold shimmer on the mark | Soft purr-chirp, bell tinkle | High |
| Spray / Claim Spray | Tail-quiver, sparkle cloud in Clowder colour, pop; on Claim the colour sweeps outward across the Patch in Whisker Sense | Pop, then a short brass sting on Claim | High |
| Counter-Spray | As Spray, but the rival colour visibly recoils from the post | Pop plus distant offended yowls | High |
| Patch Bristles | Rival outlines flare; ears-up icons over alerted cats | Hiss stinger | High |
| Scent band change | Post glow steps up or down; wisps on the banner | Subtle tone up or down (Whisker Sense sonification) | Medium |
| Den unlock | Boss's silhouette appears at the seat in the distance | The Boss's yowl-sting, far off | High |
| Caterwaul | Horizon plume in Whisker Sense; HUD edge marker with shrinking ring | The posted Sentry's own voice, directional | High |
| Tribute on the Doorstep | A pile whose size and contents match amount and districts; flies on Leftovers | Morning ambience; a contented chirp scaled to the pile | High |
| Patch upgrade | Claw marks, crate, cushion, dish appear in the world | — | Medium |
| Carrying an Offering (Life 8) | Food in the mouth; head held high; slower trot | Bell only; music thins | High |

No readable text appears in any of these (Pillar 1). All colours follow the Clowder palette in the brief §4.

## 10. Game Feel

**Feel reference.** Spraying should feel like planting the flag in *Splatoon* turf: instant, a little rude, and the ground visibly becomes yours. Rubbing should feel like collecting a coin in passing: no stop, no menu. Not like capturing a point in a shooter by standing in a circle while a bar fills.

| Action | Max input-to-response | Notes |
|---|---|---|
| Rub | 50 ms (3 frames at 60 fps) | Does not interrupt movement |
| Spray (hold) | 50 ms to start the quiver; completes at 1.2 s | Releasing early cancels with no cost |
| Pick up / set down food (Life 8) | 100 ms | Set-down at home is deliberately slower (0.8 s) and cannot be cancelled |

**Impact moments.** Claim Spray: 100 ms hit-stop on the pop, the colour sweep takes 0.6 s, light rumble. District claimed: the sweep crosses the whole district and the camera lifts for 1.5 s. Caterwaul: no camera effect; it is a sound first. Setting down an Offering: no hit-stop, no shake, no sting. The street/home separation rule (brief §9) applies to feel as well.

**Weight.** Marking is light and frequent; holding ground is slow and cumulative. The player should always know why a Patch was lost: the Morning Sniff names the raider and shows whether the post was Faint or the wall was empty.

Feel acceptance:

- [ ] Playtesters Rub marks unprompted while passing by the second session.
- [ ] Nobody describes claiming a Patch as "waiting for a bar".
- [ ] Players can say, after reading one Morning Sniff, why a Patch fell.

## 11. UI Requirements

UX owns the screens; this is the information they must carry. Management is only available at the Lot and the Doorstep (Pillar 2).

| Information | Display location | Update frequency | Condition |
|---|---|---|---|
| Patch name, owner colour, Scent band (1–4 wisps), Watched/Unwatched | Banner on entering a Patch | On entry and on change | Always |
| Scent Posts, Rub Marks (used or fresh), trails, Caches | Whisker Sense | Live | While held |
| Rival Scent during a contest and the Standoff threshold | Small bar by the Patch banner | Live | Contested |
| Daily-use state of a post or mark | The prompt itself (greyed, with the shake) | On approach | Own marks |
| Caterwaul: Patch icon, direction, time left | HUD edge marker | Live | Under Raid |
| Carried Morsels and Shinies | HUD corner, shown on change, hidden otherwise | On change | Always |
| **Morning Sniff:** per district, Tribute delivered, `seen` state, Skim; per raid, attacker portrait, outcome, Sentry Routed; lapses; upkeep paid or short; Leftovers spoiled; raid forecast if unlocked | Doorstep | Each morning | Always |
| **Turf Board (Lot):** all 30 Patches as scent-coloured blobs by district; band, Sentry portrait and Style role, upgrade level, yesterday's Tribute; unlocked districts only | Lot | On open | Always |
| Sentry assignment: slots used versus Clout cap, Crew cap, each cat's level, Style role, upkeep, Loyalty (as Crew defines it) | Lot | On change | Always |
| Rations setting with tonight's projected upkeep against the Stash | Lot | On change | From Known Face |
| Patch upgrade and Specialisation purchase, with cost and effect | Lot, from the Turf Board | On open | Patch held |
| Lot upgrades, Stash amount and cap | Lot | On change | Always |
| Clout rank, progress to the next rank, what it unlocks | Lot and the Fence Line header | On change | Always |
| Projected Tribute for tonight (before raids) | Lot | On open | From Boss |
| Offering picker (Stash size), bowl progress as a dish filling | Stash and house | On change | Lives 8–9 |

Handheld legibility: Scent is always shown as 1–4 wisps and colour, never as a number, outside the Turf Board.

## 12. Cross-References

| This document references | Target GDD | Specific element | Nature |
|---|---|---|---|
| Night Shuffle step order; day phases; Life goals | `design/creative-brief.md` §5 | Resolution order, clock rules, Life table | Rule dependency |
| Canon anchors for Tribute, prices, Crew cap, Shinies, loss penalty | `design/creative-brief.md` §8 | Numeric frame | Data dependency |
| Turf waves and raid-defence encounters | Combat GDD (path not yet known) | Encounter composition rules; `EncounterStarted`, `EncounterEnded` | State trigger |
| Ruffled on Faint Scent / Lookout; guest Sentries | Combat GDD | Ruffled values; ally rules | Rule dependency (proposed) |
| Holder Rival, Verdict, raids, betrayal, Humbled residents | Nemesis GDD | `VerdictApplied`, `RaidRequested`, `BetrayalTriggered`, `holder_id` | State trigger |
| Power and Loyalty in raid math | Crew & Progression GDD | `PowerRating(cat_id)`, `Loyalty(cat_id)` | Data dependency |
| Loyalty inputs from posting | Crew & Progression GDD | Loyalty formula inputs | Ownership handoff |
| Lesson tiers and recruit flow | Crew & Progression GDD | Lesson catalogue; offering step | Data dependency |
| Vigil staging, household reactions, Gifts and Bond | Narrative GDD | Life 8 beat sheet; Bond rules | Rule dependency |
| Well-Fed absent in Life 8 until the bowl returns | Combat GDD / Narrative GDD | Well-Fed buff | Rule dependency (proposed) |
| Morning Sniff, Turf Board, HUD | UX specs | Screens | Data dependency |

## 13. Acceptance Criteria

Logic (automated unit tests, deterministic seeds):

- [ ] Nightly Scent: for each worked example in §4.1 the computed change equals the stated value; Scent never leaves 0–100; Low Wall Corner never goes below 10 once claimed.
- [ ] Erosion: Rub −10, Counter-Spray −30, Rout −15; the Holder's Standoff triggers exactly when `S_r ≤ 30` with the wave cleared; `S_r` never reaches 0 before the Holder is Routed.
- [ ] Den lock: with 2 outer Patches held the Den post rejects Counter-Spray; with 3 it accepts; dropping to 2 re-locks after the current encounter.
- [ ] Tribute: Ice Crate Row example returns 103; the §4.3 example returns 253; with `roam_minutes_today = 0` and no forcing condition the total is 0; with 10 or more it is unscaled.
- [ ] Reference holdings in §5.2 produce 54, 280 and 1,090 nominal Tribute.
- [ ] Raid formula: Example A returns `R = 1.36 ± 0.01`, `p_hold = 0.72 ± 0.01`; Example B returns `p_hold = 0.11 ± 0.01`; over 10,000 seeded rolls outcome frequencies match `p_hold²`, `p_hold − p_hold²`, `1 − p_hold` within 1.5 points.
- [ ] Same save and seed produce an identical Night Shuffle step 1 and step 3 result on repeated runs.
- [ ] Intake: every rule in §3.7 has a test that submits a violating `RaidRequested` and receives `RaidResolved(outcome = declined)`.
- [ ] Loss cap: no test scenario loses more than 2 Patches in one Night Shuffle in Lives 2–7, or more than 3 in Life 8.
- [ ] Upkeep: examples in §4.5 return 7 and 19; with Stash 0, no cat is charged, all are flagged Short Rations, and the Stash is not negative.
- [ ] Clout: rank never decreases under any sequence of −5 events; each rank's Crew cap and Sentry cap match §3.11.
- [ ] Prices: the three recruit examples return 20, 216, 800; Lesson tiers return the table values.
- [ ] Stash: Stashing never exceeds the cap; Leftovers equal the excess; Leftovers are removed at the next delivery (plus Dry Crate days).
- [ ] Shinies: the sum of all placed and scripted sources in data equals 120.
- [ ] Life 8: the Vigil runs exactly `vigil_nights` Shuffles with ×3 decay and no Doorstep delivery; a Den with a Loyalty ≥ 60 Warden ends the Vigil at Scent ≥ 25; a district with a Loyalty < 60 Warden delivers nothing to the Doorstep in Life 8.
- [ ] Offerings: values match §3.13; thresholds at 1,500 and 4,000 flip the bowl state; the Life 8 goal completes with 9 Offerings including 3 Fresh Catch from 3 districts.

Integration and playtest:

- [ ] Taking a non-Den Patch from first loud act to Claim Spray takes 3–6 minutes of real time for a level-appropriate Posse (5-minute loop target).
- [ ] A scripted bot playing strategy D (sleep-skip) for 10 days ends with fewer Morsels than it started; a bot playing strategy E earns less on day 7 than 35% of its day-1 Tribute.
- [ ] A simulated worst case (§5.6) never produces a day with negative net income when the player fights a reference day, and recovers to its prior Patch count within 8 days of resumed play.
- [ ] Simulated reference player: Stash ÷ daily income stays within 0.3–1.5 through Lives 2–6 and the Stash is 3,000–6,000 at the end of Life 7.
- [ ] Vertical slice playtest: at least 70% of unbriefed players can explain why Tribute went up or down after reading a Morning Sniff.
- [ ] Vertical slice playtest: at least half of players post a Sentry without being told to after their first raid.

Technical:

- [ ] Performance: Night Shuffle steps 1 and 3 complete within 5 ms for 30 Patches on the handheld target.
- [ ] No hardcoded values: every number in §8 is read from data.
- [ ] No readable human text is introduced by any screen or world object this system adds.

---

## 14. Assumptions for creative-director review

Terms introduced by this document (all inside the Territory & Economy boundary):

- **Rub Mark / Rub / Over-mark**, **Counter-Spray**, **Claim Spray**, **Bristle** (a Patch's alert), **Open** (unowned Patch), **Holdout**, **Stale Claim**, **Usurped**.
- **Feature** types: Sunspot (reusing the canon nap point), Back Door, Quiet Stones, High Perch, Feeder Corner. **Feeder**, **Cache**.
- Sentry role names: Anchor, Scrapper-on-the-Wall, Lookout, Crier, Scrounger.
- **Rations** (Lean / Fair / Feast / Short), **Treat**, **Gift**.
- **Settled / Established**, Specialisations **Larder / Lookout / Hangout**. Note that "Lookout" names both a role and a Specialisation; one should be renamed.
- **Full House**, **Claim Bonus** and its six names, **Home Ground**.
- `seen`, `rounds`, **Skim**, **Leftovers**, **Full Belly**.
- **the Vigil**, **Offering** (Scrap / From the Stash / Fresh Catch), **Carry**.
- Lot upgrade names; the **Turf Board**; all 30 Patch names and Scent Posts.

Decisions made outside or at the edge of this boundary, each needing confirmation:

1. The Den is one of the district's 5 Patches, so "hold 3 of 5" is read as "hold 3 of the 4 outer Patches".
2. The Warden is a separate post from the Den's 2 Sentry slots.
3. Raids can fire live during the Night phase as well as in the Night Shuffle; Territory may decline a `RaidRequested`, reported through `RaidResolved` with a new outcome value `declined`.
4. Proposed new read-only query `SentryStatus(cat_id)` for Crew's Loyalty inputs.
5. Three proposals to Combat (§7) and one to Combat and Narrative (no Well-Fed in Life 8 until Offerings bring the bowl back).
6. Proposed Life 8 turf goal (9 Offerings, 3 Fresh Catch from 3 districts) and the playable shape of the Vigil.
7. Weather has no owner in the brief. This document only defines what weather does to Scent, Feeders and Tribute and proposes frequencies.
8. District adjacency for Skim is assumed and needs level design.
9. Gifts in Lives 1–7 are priced here; whether they affect Bond is Narrative's.
10. Scent is set to at least 60 on held Patches across time-skips into Lives 2–7.
11. "Carried Morsels" has no cat-true explanation of how a cat carries them; it is left abstract until Life 8, where carrying becomes literal.

No registry entries exist yet (`design/registry/entities.yaml` is empty). Candidates for registration once approved: Morsels, Shinies, the Clout rank table, Crew and Sentry caps, `base_yield` per Patch, Lesson tier prices, `recruit_offering`, `tough_loot`, the raid formula, `stash_cap` tiers.

---

## 15. Open Questions / Known Weak Spots

| # | Weak spot or question | Why it matters | Owner | Suggested resolution |
|---|---|---|---|---|
| 1 | **Nothing here is simulated.** Every table in §5 is arithmetic on assumed play patterns (enemies per day, Lessons bought, Patches lost). | The balance claims are only as good as those assumptions. | economy-designer | Build a spreadsheet or script simulation of the Night Shuffle and five bot strategies before any number is treated as agreed. |
| 2 | **The Life 7 surplus is designed, not solved.** Sinks saturate and about 1,700 Morsels a day have no use; the model relies on the Stash cap and spoilage to bound it. A slow player could sit in surplus for hours. | It serves the Life 8 inversion but risks the "economy trivial" failure the brief warns about (risk 5). | economy-designer + creative-director | Decide whether Life 7 needs one prestige Morsel sink, or whether the emptiness is the point. |
| 3 | **Morsels per minute favours short days** (strategies B and C beat A). Accepted because progress gates sit elsewhere, but a player who notices may feel the Night is a bad deal. | Undercuts the Dusk/Night trade if Night's rewards are not felt. | economy-designer + Nemesis | Confirm Night-only Shinies and Clout are enough; consider tying a share of Tribute to posts visited that day. |
| 4 | **`rounds` is close to a time rule.** A player with five minutes gets half Tribute. | Sits near the "not timed" anti-pillar. | creative-director | Rule on whether this is acceptable or should be replaced by `seen` alone. |
| 5 | **Raid frequency is not mine.** The model assumes about one admitted raid per 10–12 held Patches per night and 0.3–0.6 Patches lost per day. | If Nemesis requests far more or fewer, churn and upkeep value both move. | Nemesis + economy-designer | Agree a request-rate budget when both GDDs are reviewed together. |
| 6 | **Power Rating scale unknown.** The raid formula uses ratios only, but `home_adv`, the Scent term and fixed bonuses were tuned assuming a Sentry roughly equals one same-level Tough. | If Captains are 4× a Tough in Power, single Sentries never hold against them. | Crew & Progression | Re-tune §4.6 once the Power Rating formula exists. |
| 7 | **Rub Marks add 60 world points.** | Edges toward the "checklist" anti-pillar and adds level-design load. | game-designer / level design | Playtest in the slice; first cut if they feel like chores. |
| 8 | **Too many Tribute multipliers** (band, watch, six bonuses, `seen`, Skim, `rounds`). | The Morning Sniff may not be able to explain a number with icons alone. | UX + economy-designer | Slice ships with band, watch and `rounds` only; add the rest only if they read. |
| 9 | **Upgrades are weak investments by design** (30-day payback). | Players may read them as traps and skip the sink entirely, bringing the surplus forward. | economy-designer | Watch purchase rates; shift their value further toward defence if skipped. |
| 10 | **Sentries in Hidamari barely pay for themselves** (gain 2–4 Morsels against upkeep 2–3). | The first posting decision, in the tutorial district, has almost no economic signal. | economy-designer | Consider zero upkeep below Boss rank. |
| 11 | **Life 8 difficulty is a guess.** Four Vigil nights at ×3 may leave nothing, or with loyal Wardens nearly everything. | The chapter's feel depends on how much is lost. | Narrative + economy-designer | Decide the intended range of Patches surviving the Vigil, then tune `vigil_nights` and the Warden protection to it. |
| 12 | **Offering optimisation.** The bowl thresholds give Offerings a mechanical purpose, which may cheapen the gesture; without them, optimisers give Scraps. | This is the emotional centre of the game. | creative-director + Narrative | Choose: mechanical reward, purely expressive, or hidden thresholds. |
| 13 | **Life 8 goal and Well-Fed removal are proposals in other owners' territory.** | Could conflict with the Narrative and Combat GDDs. | creative-director | Resolve at cross-GDD review. |
| 14 | **Caterwaul reachability.** 120 s may not cross a six-district hill town, and no fast travel is defined anywhere. | Live defence could be mostly unreachable. | level design + economy-designer | Measure traversal times in grey-box; consider firing live raids only within two districts of Mikan. |
| 15 | **Clout points are nearly redundant with milestones.** | A system that never binds is noise. | economy-designer | Either drop points and gate on milestones only, or make points bind (for example Night Clout needed for Big Whisker). |
| 16 | **Recruit offering ceiling is reached by Life 6**, flattening that sink exactly when income peaks. | Contributes to weak spot 2. | economy-designer + Crew | Canon ceiling is 800; ask whether late recruits may also cost Shinies. |
| 17 | **Weather is unowned and partly story-driven.** Rain on a story day could wipe Scent the player worked for. | Unfair-feeling losses. | creative-director | Assign an owner; consider exempting story-forced weather from decay. |
| 18 | **The Symmetry rule for Dens may make claimed districts too safe**, with losses falling only on outer Patches. | Reduces stakes for Wardens before Life 8. | Nemesis + economy-designer | Check against Nemesis's betrayal and uprising design. |
| 19 | **Scope.** This is a large system in the fourth-protected tier. | Brief §10. | producer | Hold to the cut order in §3.14. |
| 20 | **Sunny weather and the Sunspot Feature have no interaction yet**, and vertical routes matter only through High Perch. | The cat-ness brief asks for more than this delivers. | economy-designer + level design | Candidate: Sunspot Patches give a Loyalty input only on clear days; High Road adjacency shortening Caterwaul travel. |

# Nemesis System ("Rivals") — Vertical Slice

*Owner: systems-designer (nemesis/AI) · Round 2 rewrite · 2026-11-23 · Status: slice spec for review*
*Canon: `design/creative-brief.md` v1.2 and `design/reviews/round-1/director-rulings.md`. This is a fresh, slice-only rewrite. The first draft is archived at `design/backlog/first-drafts/nemesis-system.md` and is the content backlog.*
*In-project name: **Rivals**. Do not use the original game's system name in marketing until counsel has advised (§6.4).*

---

## 1. Overview

Rivals is the system that makes every named cat in Hidamari Lane remember Mikan. It covers the **≤ 12 tracked cats** of the slice: the 8 Wall Sitter seats (Daifuku, 2 Captains, 5 ordered Toughs, one of whom is the **First Thorn**), 2 Roamers and ≤ 2 Away. Each one has a **personality** (the same six-value model the Crew uses), two hidden feelings about Mikan (**Grudge** and **Regard**, 0–100, never shown as numbers) and a 10-entry **Memory** of what Mikan did. They wear the result where a third-person camera can see it: **silhouette Scars**, a **Title**, a disposition pose on the **Fence Line** and one sharp line of cat speech that cites what happened. After every won fight against a Rival the player gives one **Verdict**: Chase Off, Humble, Recruit or Nose-Touch. Each answers two questions, *what happens to the cat* and *what happens to the post*, so each costs something different. **Nemesis** is a scarce slot, not a threshold: one for the Lane plus the **arc lead**. Off-screen, the town moves through cheap **director wall events** (one every 2–3 nights) rather than a simulated duel economy. Every change is visible on the wall, and the Morning Sniff mentions it only if it concerns a cat the player knows. The slice must prove one thing: *within two hours, a player can name a Rival and say what they did to it.*

## 2. Player Fantasy

> "That one, with the kinked tail and the cowlick that never dries. I gave him both. He waited at my gate the next morning, and now he Ambushes me from the laundry poles and laughs at my bucket."

The Rival is a **petty, funny, persistent neighbour**, not an orc warlord. Nobody dies, so everyone comes back, and when they come back they bring the evidence. The player should feel five things, in this order, inside the slice:

1. **It remembers me** (Life 1, day 2, before minute 60): the First Thorn sits on Mikan's gatepost and names the post it lost.
2. **I marked it** (Life 1–2): a Scar Mikan gave it is visible on the cat in play, not just on a card.
3. **My choice mattered** (every Verdict): the cat I chased off came back with escorts and an answer to my trick. The cat I spared still holds the Patch I wanted.
4. **It got one over on me** (even for players who never wipe): Lick In gives a cat a Title for flattening Mikan in a fight the Posse won. It is smug about it for the rest of the slice.
5. **The wall moved while I slept** (Life 2): one change on the Fence Line every 2–3 nights. When it involves my cat, the Sniff tells me.

**Cat identity, not Mordor with fur.** Mordor supplies the skeleton: a hierarchy screen, persistence, adaptation and promotion on loss. The organs are cat: Verdicts instead of kills, a respect axis (Regard) as well as hate, the Verdict *tell* read from ears and tail, the Gloat, "Collar" as the insult that tracks Clout, scent marks as intel, and Mikan's own plaster from home being read by the street. The design test for every rule below is **"can the player see it?"** Simulation that produces no visible output was cut.

---

## 3. Detailed Rules

### 3.1 The slice cast

| Seat / role | Count | Authored or procedural | Notes |
|---|---|---|---|
| Boss: **Daifuku** | 1 | Authored (Narrative: personality and voice; Nemesis: trait kit) | Bruiser. Never leaves his wall. Proposed personality **Brooder** ("never leaves its post"). Narrative to confirm (A-1) |
| Captains | 2 | Procedural; one is flagged `recruitable_slice` | Never share a Style |
| Toughs, seats 1–5 (5 = lowest) | 5 | Procedural; the **First Thorn** starts at seat 5 as Keeper of Low Wall Corner | Ordered on the wall (NS-8) |
| Roamers | 2 | Procedural | Off-wall. Candidates to refill seats or to become Keeper of an Open Patch |
| Away | ≤ 2 | (Chased-Off cats) | Shown as an empty seat with paw prints |
| **Tracked total** | **≤ 12** | | Fresh generation only while tracked < 12 |

- **Rival-recruitable cats in the slice (DR-01):** the First Thorn, the flagged Captain, and Daifuku (Regard ≥ 50 only). Every other Rival shows Recruit greyed, with the tell "turns its tail to the bell".
- **Personality coverage (DR-01, DR-30/37).** Crew fixes the personalities of its two story recruits and the Friend Stray. Daifuku is Brooder (A-1). The Thorn and the flagged Captain are generated from the two personalities still uncovered, so the six slice recruits cover all six. **Default:** the Thorn is a **Braggart** (loud, comes back fast for revenge), which suits the Life 1 return. Crew confirms the final set.
- **Styles (slice):** Scrapper, Bruiser, Yowler only. Default for the Thorn: **Yowler**, which is weak to Mikan's Claw, so a kitten can win.
- **Fears (slice):** Water (bucket), Loud Noise (scooter horn) and Cucumbers (ledge junk). Every procedural Rival has exactly one Fear, drawn from those three. The Thorn's is Water.

### 3.2 Data (the `rival` block of the One Cat Schema)

Nemesis writes these fields: `personality`, `former_rank`, `grudge`, `regard`, `memory[]`, `title`, `traits{strengths[], fears[], scars[]}`, `signature_strength` (set on Recruit), `rank`, `seat` (1–5 for Toughs), `keeper_of` (patch_id or null), plus Rivals-local state:

| Field | Values |
|---|---|
| `state` | `Seated` · `Roaming` · `Away` · `Humbled` · `Crew` · `Gone` (a name-only legend record) |
| `truce_until_day` | int or null |
| `arc_role` | `none` · `lead` · `resolved` |
| `nemesis` | bool (slot holder) |
| `encounters`, `routs_by_player`, `chased_count`, `snubs` | small ints |
| `flee_threshold` | defaults by personality (§3.4); authored 25% for the First Thorn |
| `last_opener`, `last_props_used`, `last_finisher_type` | used for adaptation (§3.9) |

`personality` and `former_rank` are Nemesis-owned. Crew reads them; it does not write them (NS-3, DR-12). `keeper_id` on the Patch is Territory's field, and Nemesis assigns it (NS-C11).

### 3.3 Generation

- **Starting feelings:** `grudge = 10 + rng(0..10)`, `regard = 10`. **The First Thorn is fixed at Grudge 15, Regard 10**, so that its Life 1–2 beats are reproducible.
- **Level:** F9.
- **Strengths at generation:** Tough 0 (60%) or 1 (40%); Captain 1; Daifuku authored (3). Drawn from the slice list (§3.9).
- **Personality weights for the Wall Sitters (procedural, excluding the two coverage cats):** Braggart 12, Brooder 16, Schemer 16, Fraidy 16, Stalwart 16, Goofball 24. Constraints, rerolling the last offender: ≥ 4 distinct personalities among the procedural cats; ≥ 1 Stalwart or Goofball; ≥ 1 Brooder or Braggart besides the Thorn.
- **Coat:** the logical genome is packed into `coat_seed`; Art owns the look. No generated coat feature may resemble a slice Scar: no notched or folded ears, no kinked tails, no cowlicks at generation. That way every Scar reads as history. The Mikan look (Van + ginger-on-white + bobtail, or any collar) is never generated.
- **No prehistory animation.** Two prehistory nights (day indices −2 and −1) may seed one feud pair and one Roamer, but the Fence Line opens **static** the first time (NX cut list).
- **Determinism (NS-9, DR-13):** every draw comes from `rng(save_seed, day_index, step, subsystem, cat_id, ordinal)` (counter-based, SplitMix/PCG over a hash). Daytime rolls (Nose-Touch acceptance, Scar, bark pick, Ambush moment) use `(save_seed, encounter_serial, cat_id)`, so reloading reproduces them. Each seat has its own reroll counter. Every Morning Sniff item logs `(seed, day, step)`.

### 3.4 Personality: the Rival column (canon shape DR-37; numbers owned here)

| Personality | `m_g` (Grudge gain) | `m_r` (Regard gain) | Nightly decay | Flees at Nerve | Return `p_ret` | Nose-Touch `p_mod` | Gloat → Glory Title | As a Rival, shown as |
|---|---|---|---|---|---|---|---|---|
| **Braggart** | 1.2 | 0.7 | −2 | never | −1 (fast) | −0.20 | Swat the Bell → Bell-Ringer | Loud taunts; first to return |
| **Brooder** | 1.1 | 0.8 | **−1** | never | +1 | −0.10 | Mark Over → Collar-Biter | Silent stare; long memory |
| **Schemer** | 1.0 | 0.9 | −2 | 15% | 0 | 0.00 | Snatch → Collar-Biter | Ambush candidate weight ×2 |
| **Fraidy** | 0.7 | 1.0 | −2 | 25% | +1 (slow) | +0.10 | Bolt → Collar-Biter | Flees early |
| **Stalwart** | 0.8 | 1.5 | −2 | never | 0 | **+0.30** | Turn Away → Bell-Stopper | Honourable; Regard +10 on its win |
| **Goofball** | 0.6 | 1.2 | −2 | 10% | 0 | +0.15 | Swat the Bell → Bell-Ringer | Clowns; rarely reaches the Recruit block |

Flee is Combat's normal interruptible yellow windup; Nemesis only supplies the threshold (NX-09, NX-C3, DR-41). The same personality drives the cat's idle, walk, bark intents and Pile-On flourish if it is recruited (Art, Audio). **The Braggart who taunted you on the wall is the Braggart who charges first in your Posse.**

### 3.5 Grudge and Regard

Grudge and Regard move only through the event table below, combined per encounter by F1. They decay nightly by F2.

| Event (from `CatRouted`, `EncounterEnded`, `FearTriggered`, `PatchChanged`) | Grudge base `g` | Regard base `r` |
|---|---|---|
| Routed by the Posse | +6 | 0 |
| …by Pile-On (extra) | +3 | 0 |
| …after its Fear was triggered this fight (extra) | +3 | −2 |
| Player opened with an Ambush on it | +3 | −3 |
| Clean win (player opened with a Standoff or was Ambushed, and triggered no Fear prop) | 0 | +8 |
| It was Keeper and the player Sprays its Patch (in-encounter, NS-14f) | +6 | 0 |
| It fled (normal flee) | +8 | 0 |
| Verdict: **Chase Off** | +10 | 0 |
| Verdict: **Humble** | +10 | −5 |
| Verdict: **Recruit** | rout items, then **halved** | +10 |
| Verdict: **Nose-Touch accepted** | **set to 0** | +25 |
| Verdict: **Nose-Touch snubbed** | rout items, then **halved**; `snubs` +1 | +5 |
| `SLIPPED_AWAY` (Routed, but not the Verdict cat) | rout items only | rout items only |
| It won (Posse wipe; it is the victor) | +5 | −10 (Stalwart: +10) |
| **Lick In** (it Routed Mikan; the Posse won anyway) | 0 (the old −5 row is deleted) | 0 |
| Player fled | 0 | −8 |

- **Per-encounter cap (DR-39):** a cat's total Grudge change in one encounter is ≤ 35 for its first two encounters with the player and ≤ 20 after.
- Both meters are clamped to 0–100.

### 3.6 Nemesis is a slot; dispositions are poses

- **Slots (DR-39):** **one Lane slot plus the arc-lead slot.** Each night (step 3e), the arc lead holds the arc slot if its Grudge ≥ 75. The Lane slot goes to the highest arc score (F3) among the other non-Crew tracked cats with Grudge ≥ 75. Ties go to the earlier first meeting. Everyone else at ≥ 75 is **Bitter**. An empty slot stays empty; the director never manufactures a Nemesis.
- **Fence Line disposition** (one pose per cat; first match wins; numbers never shown, NX-14):

| # | Disposition | Condition | Pose (Art) |
|---|---|---|---|
| 1 | **Nemesis** | holds a slot | Faces the camera, back arched, plus the **storm mark** (small at 75–89, large at 90+) |
| 2 | **Friend** | accepted Nose-Touch, Regard ≥ 75, Grudge < 25 | Slow blink |
| 3 | **Bitter** | Grudge ≥ 75, no slot | Faces, tail lashing |
| 4 | **Respectful** | Regard ≥ 50, Grudge < 50 | Sits upright facing, ears forward |
| 5 | **Wary** | Grudge 40–74 | Side-on, ears flat |
| 6 | **Indifferent** | otherwise | Back turned, grooming |

A truce shows a small leaf sprig on the cat. Humbled residents sit on their crate at the foot of the wall, Crew are not on it, and Away cats leave paw prints on an empty seat.

### 3.7 Memory and the arc lead

- **Memory:** 10 entries, **≤ 6 pinned** (NS-4). An entry is `{day, kind, patch, opener, finisher_move, damage_type, fear, verdict, by_pile_on, count}`. Kinds in the slice: `FIRST_MEETING, ROUTED, FLED, PATCH_LOST, VERDICT, AMBUSHED_BY_PLAYER, AMBUSHED_PLAYER, LICK_IN, WON, PLAYER_FLED, SCAR, TITLE, SLIPPED_AWAY, RAID`. A repeat of the same kind and patch on consecutive encounters collapses into one entry with `count` +1.
- **Pinned:** `FIRST_MEETING`, the latest encounter, and the source entry of each displayed Scar and the displayed Title. At most 2 Scars come from Mikan in the slice and there is 1 Title, so pins ≤ 5. The invariant is pins ≤ 6. Eviction removes the oldest unpinned entry.
- **The arc lead** is the cat the director builds the slice's story around. **The First Thorn is the arc lead from Life 1, day 1.** If it leaves the arc early (Recruited or accepted Nose-Touch with < 3 encounters), it becomes `resolved` and the director names a new lead on the next night: the highest F3 among seated cats with ≥ 1 encounter. The arc lead's Grudge **does not decay while it leads** (DR-39).
- **Lead presence guarantee:** from Life 2, day 1, until the arc is achieved, the director places the arc lead on the player's route at least once per day. The placement is one of: Keeper of the Patch the player is heading for, waiting at a Scent Post, a Rival Ambush (§3.10), or the raid. Placement is a spawn rule, never a scripted outcome (DR-41).
- **Arc achieved** (`NemesisArcAchieved`, DR-39): the lead has ≥ 3 encounters and ≥ 1 **mark** (a player-sourced Scar or a Title involving Mikan), and **either** holds a Nemesis slot **or** completes a **friend arc** (an accepted Nose-Touch) **or** was Recruited after its third encounter.

### 3.8 Making memory visible (NX-01, NX-02, NX-03, NX-04, NX-15; DR-40)

1. **The First Thorn returns inside Life 1** (DR-40.1, PP-05). On day 2 the Morning Sniff's only item is the Thorn's scent mark over Mikan's gatepost. The Thorn is placed within 30 s of the door, on the route out, whatever happened on day 1:

| Day-1 outcome | Day-2 beat (always a memory-citing line) |
|---|---|
| It fled (expected for first-timers) | Standoff at the gatepost: `REMATCH_I_FLED` |
| Routed, then Chased Off | Back after 1 night (F5): `RETURNED` |
| Routed, then Humbled | Sits on its crate by the route; ambient `REMATCH_I_LOST` with `last_verdict:humble` (no fight) |
| Routed, then Recruited (free in Life 1) | At the Lot, `CREW_MEMORY` |
| Routed, then Nose-Touch accepted / snubbed | Greets / glares from the gatepost: `REMATCH_I_LOST` with `last_verdict:nose_*` |
| Mikan lost (wipe) | Standoff at the gatepost: `REMATCH_I_WON`, which may cite `mikan_plastered` |

2. **Memory at the Rout after an Ambush.** If the player Ambushes a tracked Rival, the fight opens with a corner tag (name and Title only). At the Rout, the cat's best line (`AMBUSHED_REMATCH` if it has Memory of Mikan, `STANDOFF_FIRST` if not) plays over the flattened cat at the start of the Verdict prompt, while the clock is paused. Tag `ambushed` lets a cat remark on *how* Mikan fights: "The roof again? You never fight on the ground, Collar."
3. **Unskippable 1 s.** Any Standoff or Rout line whose selected template has `n_mem` ≥ 1 cannot be skipped for 1.0 s. Other lines skip instantly.
4. **Silhouette Scars (DR-40.4).** The slice has four types, chosen by the `CatRouted` payload. A triggered Water Fear overrides the damage type.

| Cause | Silhouette Scar |
|---|---|
| Finisher damage type Claw | Ear notch |
| Thump | Kinked tail-tip |
| Yowl | Folded ear |
| Routed after its Water Fear this fight | Damp cowlick |

Scar chance is F7. Every player-sourced Scar is a silhouette Scar. A cat displays ≤ 2 from Mikan in the slice; portrait Scars are Backlog. Off-screen scuffles give a **head plaster for 2 days**, never a Scar, so a Scar always means "Mikan did this". Readability acceptance is in §8.

5. **Lick In (DR-40.5).** A tracked Rival that Routs Mikan in an encounter the Posse wins earns its personality's Glory Title (no promotion, no levels). Its next Standoff draws `REMATCH_I_WON` with tag `lick_in`, and its Verdict tell is **chin up**.
6. **The plaster (DR-40.6).** The day after a wipe, Mikan wears Haru's plaster (Narrative/Art). Tag `mikan_plastered` lets that day's Rival lines read it: "Nice plaster, Collar. Fall off a cushion?"
7. **Routine tags (DR-40.7):** `evenings_home` (home by Dusk on ≥ 3 consecutive days) and `nights_out` (out all Night ≥ 2 of the last 3 nights, from Life 2, day 2). Each feeds one tagged Standoff line: "Home by dusk, every day. We noticed." / "Bowl empty at home, Collar?"
8. **A personal 2-bar yowl-sting per Rival** (Audio). Nemesis supplies `(voice_body, personality, cat_id)` as the seed. It plays at the name-card and at a Rival Ambush.

### 3.9 Strengths and adaptation (slice)

Slice Strengths (Nemesis chooses them, Combat values them): **Thick Fur** (resists Claw), **Low Loaf** (resists Thump), **Deaf Ear** (resists Yowl), **Wriggler** (shorter Frazzled), **Roof-Wise** (not Ruffled by an Ambush), **Got Over It (fear)** (that Fear no longer Ruffles it), **Grudge Fuel** (hits Mikan harder), **Second Wind** (one Nerve slice on its first Frazzle), **Home Turf** (stronger on its own Patch).

- **When:** adaptation runs only on a comeback and on promotion. It never runs mid-fight or on the night of the Rout.
- **What (one per evaluation, first that applies), answering the player's habits (NX-08):**
  1. The last opener was the player's Ambush → Roof-Wise.
  2. A Fear prop was used on it → Got Over It (that Fear).
  3. It was Routed twice by the same finisher type → resist that type.
  4. Pile-On'd twice → Wriggler.
  5. Otherwise, the personality pool: Braggart/Brooder Grudge Fuel; Schemer Roof-Wise; Stalwart/Goofball Second Wind; Fraidy Wriggler.
- **Always a Way In (invariant):** every Rival keeps ≥ 1 Fear that has not been overcome, **or** ≥ 2 of the 3 slice damage types unresisted. An adaptation that would break this is skipped and the next one is tried.
- **Announced:** the cat's next encounter line must come from `RETURNED` with tag `adapted:<strength>`, and the Fence Line shows the new Strength icon at once. "Go on, tip the bucket. I like the rain now."
- Cap: 3 Strengths on a Tough or Captain in the slice. On Recruit, the most recently revealed Strength becomes the `signature_strength`, an always-on perk. Strays have none (DR-37).

### 3.10 Encounters, the Ambush, and loss

- **Standoff** (2–4 s): name-card, Title, silhouette, sting and one line (F8).
- **Rival Ambush (NX-17, NS-12, DR-36):** unlocks on Life 2, day 1, where the Thorn's comeback is the first one. **≤ 1 Rival Ambush per day.** Candidate: the highest-F3 active cat with Grudge ≥ 50 that is not under truce, not Humbled and not Crew (Schemers weighted ×2). On a day with a candidate the director rolls `p_ambush_day` (0.5), then places it at a seeded moment ≥ 60 s into a seeded phase. Never on the morning after a wipe, never in Life 1. The warning is a **2.0 s directional yowl-sting**, during which the attacker's selected line shows in its balloon. The counter is **Skitter or Brace in the final 0.75 s**, which gives a **neutral start** (an icon bark, `AMBUSH_FOILED`). Otherwise Mikan starts Ruffled. There is no Standoff downgrade.
- **Fight barks are icon-only** (Fear hit, low Nerve, Routed, ally Routed, Old Score): Sense-Icon-style pictograms, no text (NX-12).
- **Routed tracked Rivals in a won fight** are held at the ring edge for the Verdict (DR-36, NX-C8).
- **Loss (Posse wipe):** the victor is the cat that Routed Mikan if it is standing, otherwise the highest-ranked standing tracked Rival. It **Gloats** (≤ 3 s, inside UX's ≤ 6 s loss beat, NX-C7), gains its Glory Title and is **promoted**: Roamer → Tough seat 5 (the old seat-5 cat becomes a Roamer); Tough seat n → seat n−1, swapping; Tough seat 1 → Captain, swapping with the Captain of lower F3, who drops to seat 1 with a feud. A Captain's promotion is the Title only. Level +1 (F9 cap). **Mark Over** sprays over Mikan's nearest held post (Scent −30, Territory confirms) and requests **no** raid (NX-15). **Snatch** holds the lost field haul; Routing the cat returns it (DR-46). Nothing is lost in Life 1 (DR-19).
- An untracked cat that wins a wipe becomes a tracked Roamer if tracked < 12; otherwise it Gloats generically and is not promoted.

### 3.11 The four Verdicts (DR-42, NX-05, PP-14, PP-21)

**One full Verdict per fight**, for the highest-ranked Routed tracked Rival. Other Routed tracked cats get `SLIPPED_AWAY` and run (PP-14). The clock is paused, with no timer and no default.

**The tell (shown before choosing; honest):** ears give the Nose-Touch band (forward ≥ 0.6 · neutral 0.3–0.6 · back < 0.3, from F4). The tail lashes if pending Grudge ≥ 50. Chin up means Lick In.

| Verdict | Available when | The cat | The post | Grudge / Regard | What comes back |
|---|---|---|---|---|---|
| **Chase Off** | Always (Daifuku: see §5) | `Away`; seat vacated | **Yours** (Spray it) | +10 / 0 | Returns after F5 nights, **changed**: 1st return with 1–2 Stray escorts plus an adaptation; 2nd return **promoted** one seat (Tough 1 → Captain); 3rd return is the **Grand Standoff** (a call-out in the Sniff, the cat plus 2 escorts at Dusk, all four Verdicts). `chased_count` 2 → Title Twice-Chased if it has no Title |
| **Humble** | The fight's Patch will become the player's (NS-16), and its Undermark crate is empty (one per Patch, NX-C2) | `Humbled` resident on the crate; seat vacated; `former_rank` stored | **Yours**, +15% Tribute (Territory) | +10 / −5 | Simmers +2 per night **only while the Patch is Unwatched** (no Sentry). Normal decay while Watched. **Restless at 80**: a Sniff warning (scratched crate), and the next night an **uprising** raid request by the resident alone, only if still Unwatched. **Settled** after one failed uprising (no more simmer) (NS-5) |
| **Recruit** | DR-09: Grudge < 90 **or** Regard ≥ 50; the cat is slice-recruitable (§3.1); there is room (or "make room", DR-34). Daifuku: Regard ≥ 50 | Joins the Crew with Memory, Scars, Title, Fear, personality; Strength → signature perk | **Yours** | rout items then halved / +10 | Crew sets the Bribe (Life 1: free and fixed, PP-07) and starting Loyalty from `G_pre` = Grudge before halving (NS-C2). No roll, no refusal (PP-21) |
| **Nose-Touch** | Always | Accept (F4, seeded): Grudge 0, Regard +25, **5-day truce**. Snub: Grudge halved, Regard +5, the next offer +0.25 | **The cat keeps its post.** While the truce lasts, its Patch cannot be Sprayed by the player | see left | After the truce: Regard ≥ 75 → at the next meeting it **yields the post with a nose** (`TRUCE_YIELD`, no fight). Otherwise the next fight there adds **no Grudge**. No Clout credit (Territory, NX-C1) |

**Why no Verdict dominates (sim and playtest check, §8):** Chase Off wins the post but brings back a stronger cat in 1–3 nights. Humble wins the post and the money but costs a Sentry slot (of 2) to keep it quiet. Recruit wins the post and a Crew cat but is limited to 3 slice cats, a Bribe and the Crew cap. Nose-Touch wins a friend but **costs the Patch**: with the Den opening at 3 of 4 outer Patches, the player can afford to spare at most one Keeper and still claim the Lane on time.

### 3.12 Off-screen: Night Shuffle step 3 (DR-13, DR-43)

| Sub-step | Rule |
|---|---|
| 3a Betrayals | No-op in the slice (betrayal is unreachable, DR-10/23). Reads Crew's Loyalty only |
| 3b Comebacks | Away cats whose F5 delay has elapsed return (seat: their old seat if empty, else the lowest empty seat, else Roaming) |
| 3c **Wall event** | One per district every 2–3 nights (F6), starting on the night after Life 2 day 1. Kinds: **promotion** (a Tough moves up one seat, swapping), **feud scuffle** (the loser of a feud pair wears a head plaster for 2 days and, if it was the higher seat, swaps), **return** (shows a due comeback as the night's event), **Restless** (a Humbled resident at ≥ 80 turns Restless), **refill** (an empty seat, or an Open Patch's Keeper, is filled by a Roamer or a fresh cat; NS-18). Always visible on the wall |
| 3d Refills | A seat empty ≥ 2 nights is refilled by the top Roamer, or by fresh generation while tracked < 12. An Open Patch with no Keeper gets a Roamer as Keeper with p 0.5 (NS-18) |
| 3e Decay and slots | F2 for every non-Crew tracked cat. Stewing (below). Then Nemesis slot reassignment (§3.6) and arc-lead check (§3.7) |
| 3f Raid requests | ≤ 1 per district. The **first raid is the arc lead's** (requested on Life 2, day 2, after the cat flap, forecast in the next Sniff). Otherwise the requester is the highest-F3 cat with Grudge ≥ 60, targeting a held Patch below Strong (Territory resolves). Motive enum: `grudge`, `comeback`, `uprising`, `squat` |

**Stewing (NX-10).** If the player has not raised any cat to Grudge ≥ 60 by Life 2, day 3, the director Stews one eligible cat by +5 per night, **capped at 74**, so Stewing alone never makes a Nemesis. Eligible: ≥ 1 encounter with the player; not a Friend, not under truce, not Crew, Regard < 50. The Sniff shows it ("claw marks on your post"). If no cat is eligible, the director generates a Braggart or Brooder Roamer (if tracked < 12) with a feud against the player's Friend: "Buri went soft. I didn't."

### 3.13 Morning Sniff and the Fence Line (NX-07, DR-43, DR-24)

- **Sniff:** the Tribute line, plus tonight's raid forecast (always, if a raid is coming), plus **≤ 3 nemesis items**. Life 1, day 2 has exactly 1 item. **Admission:** the cat has ≥ 1 encounter with the player, **or** the item touches a player Patch or Crew cat. **Priority:** arc lead > Restless warning > comeback > wall event > other. Rank changes among strangers appear on the wall only.
- **Fence Line** (data here; screen by UX): one continuous wall, height = rank (Daifuku's wall top, Captains, Toughs 1–5 descending). No rank labels and no numbers. Each cat shows name, Title, silhouette Scars, disposition pose, storm mark, truce sprig, and known Fear/Strength icons once revealed (a Fear is revealed when sniffed or triggered). Read-only, on the street, at the Doorstep and at the Lot; never in the house. It changes visibly overnight: wall events, comebacks, promotions.

### 3.14 Unlock ladder (DR-23, NX-06)

| When | Switches on |
|---|---|
| Life 1 | Standoff, Verdict, First Thorn, 1-item Sniff (day 2), Lick In, Gloat |
| Life 2, day 1 | Fence Line (static first view), Rival Ambush (the Thorn), 3-item Sniff, wall events (from that night) |
| First Humble | Restless warnings and uprisings |
| Cat flap (Life 2, day 2) | Night Rivals; the first raid (the arc lead's) |
| Life 3+ | Wavering/Turncoat and the rest (Backlog) |

### 3.15 Barks: triggers, tags, grammar, volume (NX-12, NS-11, DR-44, DR-53)

Cats speak readable text in balloons of **≤ 60 characters after slot substitution**. Nemesis owns triggers, tags, slots and selection; Narrative owns every word. The lines below are placeholders that prove the grammar.

**20 slice triggers:**

| Group | Triggers |
|---|---|
| Standoff (6) | `STANDOFF_FIRST`, `REMATCH_I_LOST`, `REMATCH_I_WON` (it beat Mikan: wipe or `lick_in`), `REMATCH_I_FLED`, `RETURNED` (comeback; carries `adapted:*`), `GRAND_STANDOFF` |
| After (10) | `GLOAT_SWAT`, `GLOAT_SNATCH`, `GLOAT_MARK_OVER`, `GLOAT_TURN_AWAY`, `GLOAT_BOLT`, `VERDICT_CHASE`, `VERDICT_HUMBLE`, `VERDICT_RECRUIT`, `VERDICT_NOSE_ACCEPT`, `VERDICT_NOSE_SNUB` |
| Special (4) | `AMBUSHED_REMATCH`, `CALL_HEARD`, `CREW_MEMORY`, `TRUCE_YIELD` |

**Grammar (EBNF; a lint tool enforces it, acceptance §8):**

```
template   = id trigger requires forbids personality text short_text ;
requires   = "[" [ tag { "," tag } ] "]" ;          (* forbids: same form *)
tag        = [ scope ] name [ op value ] ;
scope      = "self." | "other." ;                    (* default self. *)
op         = ":" | ">=" | "<=" ;
personality= "braggart"|"brooder"|"schemer"|"fraidy"|"stalwart"|"goofball"|"any" ;
```

| Family (weight) | Tag names |
|---|---|
| Memory (3) | `last_verdict:<chase|humble|recruit|nose_accept|nose_snub>`, `last_finisher_type:<claw|thump|yowl>`, `by_pile_on`, `fear_exploited:<water|loud_noise|cucumbers>`, `ambushed`, `lick_in`, `scar_from_mikan:<notch|kink|fold|cowlick>`, `patch_lost`, `fled`, `count_routs>=<n>`, `adapted:<strength>`, `mikan_plastered` |
| Relationship (2) | `nemesis`, `bitter`, `friend`, `grudge>=<n>`, `regard>=<n>`, `feud_with` (binds `{other}`), `ex_crew` |
| Context (1) | `phase:<p>`, `own_patch`, `rank:<r>`, `clout:<rank>`, `life:<1|2>`, `evenings_home`, `nights_out`, `posse_size>=<n>` |

**Slot binding.** `{other}` binds to the cat in the first matched `other.`-scoped or `feud_with` tag. `{when}` cites the Memory entry matched by the highest-weight memory tag (ties: the most recent), bucketed as "last night", "the other day", "ages ago". `{patch}` is that entry's patch. Slots: `{address}` 8 (§below), `{mikan}` 8, `{other}` 8, `{patch}` 16, `{title}` 16, `{when}` 14. Overflow uses `short_text`. If that also overflows, the template is dropped and logged as a content bug.

**Address.** House Pet / Lane Cat → "Collar"; Known Face → "Bell"; Boss → `{mikan}`. A cat with Regard ≥ 50 uses `{mikan}` from Known Face. Crew say "Boss".

**Selection** is F8. **No repeats:** a cat never repeats a line to the player while an unused candidate exists. **`STANDOFF_FIRST` lines are retired town-wide for 20 in-game days after use** (DR-44); if a personality's pool is exhausted, the least recently used line is reused and logged. **Content rules:** no human is ever named or explained. In Lives 1–2 a line may cite the collar, bell, bowl, cushion, plaster and the Call, never a human (NX-C5, DR-44).

**Bark intents (DR-53):** each template maps to one of 8 intents per voice body: *Taunt, Boast, Threat, Grumble, Yield, Panic, Respect, Tease*. Standoff → Taunt/Threat (Bitter, Nemesis) or Respect (Respectful, Friend). Gloat → Boast. VERDICT_CHASE/HUMBLE → Grumble. NOSE_ACCEPT/TRUCE_YIELD → Yield/Respect. Snub → Threat. Icon fight barks → Panic. Goofball lines default to Tease.

**Volume (≤ 240, DR-01):** personality floors only for the 8 most-heard triggers. `STANDOFF_FIRST` gets 6 × 3 = 18; `REMATCH_I_LOST`, `REMATCH_I_WON`, `REMATCH_I_FLED`, `RETURNED`, `VERDICT_CHASE`, `VERDICT_HUMBLE` and `VERDICT_NOSE_SNUB` get 7 × 6 × 2 = 84. The other 12 triggers get 45 lines (Gloats 5 × 3, Recruit/Accept 2 × 3, Grand Standoff 3, Ambushed 6, Call 6, Crew memory 6, Truce yield 3). Memory-tagged specials: 90. **Total 237.**

**Example lines** (placeholders, all ≤ 60 characters at maximum slot length; Verdict-prompt lines first, per NX-16):

| Trigger | Requires | Pers. | Line |
|---|---|---|---|
| `VERDICT_CHASE` | — | Braggart | Fine! I've got other walls. Better walls! |
| `VERDICT_CHASE` | `chased_count>=2` | Brooder | Twice now. I'm counting, Collar. |
| `VERDICT_HUMBLE` | `own_patch` | Brooder | Your mark's on my post. I count the days. |
| `VERDICT_RECRUIT` | `fear_exploited:water` | Braggart | Fine. But you're never touching that bucket again. |
| `VERDICT_NOSE_ACCEPT` | — | Stalwart | ...Fair. You fought fair. |
| `VERDICT_NOSE_SNUB` | — | Braggart | Keep your nose to yourself, Collar. |
| `STANDOFF_FIRST` | `clout:house_pet` | Braggart | Nice bell, Collar. Does it ring when you run? |
| `REMATCH_I_FLED` | `fled`, `patch_lost` | Braggart | You got the post. I got away. Round two, Collar. |
| `REMATCH_I_LOST` | `last_verdict:chase` | Brooder | You chased me off {patch}. I walked back. |
| `REMATCH_I_LOST` | `fear_exploited:water`, `scar_from_mikan:cowlick` | Braggart | I still smell like that bucket. Soon, so will you. |
| `REMATCH_I_WON` | `lick_in` | any | Flat on your back, Collar. Your crew carried you. |
| `REMATCH_I_WON` | `mikan_plastered` | any | Nice plaster, Collar. Fall off a cushion? |
| `RETURNED` | `adapted:got_over_it_water` | any | Go on, tip the bucket. I like the rain now. |
| `RETURNED` | `adapted:roof_wise`, `ambushed` | Schemer | Roofs again? I've been practising looking up. |
| `AMBUSHED_REMATCH` | `ambushed` | any | The roof again? You never fight on the ground, Collar. |
| `GLOAT_TURN_AWAY` | — | Stalwart | Good scrap. Come back when the bell means something. |
| `CALL_HEARD` | `phase:dusk` | any | Hear that? Somebody's kitten is wanted. |
| `CREW_MEMORY` | `last_verdict:recruit` | Braggart | You won the corner. I'm still the loud one. |
| `TRUCE_YIELD` | `friend` | Stalwart | Your post now. I'll sit by it, if that's all right. |
| (tag) | `evenings_home` | any | Home by dusk, every day. We noticed. |

### 3.16 Worked Rival life-story (fits inside the slice)

**Kinako**, the First Thorn: Tough seat 5, Keeper of Low Wall Corner, **Yowler, Braggart** (`m_g` 1.2, `m_r` 0.7), Fear Water, Lv 2, Grudge 15, Regard 10 (fixed). The policy is a typical first-timer who chases and Humbles. Times are approximate.

| When | What the player sees | Rules at work | After |
|---|---|---|---|
| L1 D1 ≈ 0:20 | Standoff: "Nice bell, Collar. Does it ring when you run?" At 25% Nerve Kinako's yellow flee windup plays; the player is busy and does not interrupt. He bolts over the wall; Mikan Sprays the post | Normal flee (DR-41). F1: (fled 8 + Patch lost 6) × 1.2 = 16.8 → 17 (cap 35) | G 32, R 10. Memory: FIRST_MEETING, FLED, PATCH_LOST. Enc 1 |
| L1 D2 ≈ 0:33 | Sniff, 1 item: Kinako's mark over the gatepost. He is sitting on it. "You got the post. I got away. Round two, Collar." (unskippable 1 s). **First memory line, ≈ minute 33.** The player tips the bucket; Ruffled, Frazzle, a two-cat Pile-On. Tell: ears back, tail lashing. **Chase Off** | F1: (6 + 3 + 3 + 10) × 1.2 = 26.4 → 26. Regard −2 × 0.7 → −1. F7: 0.35 + 0.15 = 0.50, rolled yes → Water override → **damp cowlick**. Title **the Soggy**. F5: 2 − 1 − 1 → 1 night | G 58, R 9. Enc 2. Away |
| Night (montage 1→2) | — | 3b comeback. Adaptation: rule 2 (Fear prop used) → **Got Over It (Water)**. Way In holds (3 types unresisted). F9: Lv 3. Arc lead: no decay | Lv 3 |
| L2 D1 ≈ 1:05 | Fence Line opens (static): Kinako on seat 5 with his cowlick. A 2.0 s yowl-sting from the laundry poles: "Go on, tip the bucket. I like the rain now." The player Skitters late, so Mikan starts Ruffled. The bucket does nothing. Kinako flattens Mikan; the Posse wins anyway. Tell: **chin up. Chase Off** | Rival Ambush (lead placement). **Lick In** → Bell-Ringer (glory from Mikan outranks the Soggy for display). F1: (6 + 3 + 10) × 1.2 = 22.8 → 23 → **cap 20**. F7: 0.35 + 0.15 + 0.50 = 1.0; finisher Thump (Bruiser Crew cat) → **kinked tail** | **G 78**. Enc 3, 2 Scars. **Arc achieved** at the next slot pass |
| Night 1 | Next morning's Sniff: Kinako's portrait with a storm mark, "back already" | 3e: arc slot → **Nemesis** (storm mark, small). 3b: back after 1 night, 2nd return → **promoted** seat 5 → 4 (swap). Adaptation rule 5 → Grudge Fuel | Nemesis, seat 4 |
| L2 D2 ≈ 1:35 | The cat flap arrives. The Sniff forecast says Kinako's crew is coming for Laundry Pole Patch tonight. The player posts the old wall cat (Stalwart) as Sentry, answers the Caterwaul, wins, and this time chooses **Humble** | First raid = arc lead (3f). F1 cap 20: (6 + 3 + 10) × 1.2 → 20 | G 98, R 5 (Humble −5 × 0.7 = −3.5 → −4). Humbled on the Laundry Pole crate |
| L2 D3 | Sniff: scratches on the crate (Restless, ≥ 80). The Sentry stays, so there is no uprising. "Your mark's on my post. I count the days." | Watched → no simmer, no uprising; arc lead → no decay | G 98 |
| L2 D4 ≈ 2:20 | Daifuku's Den. Kinako is not there (residents do not escort). The Lane is claimed; K2.5; title card | — | Slice ends with a Nemesis on a crate, two Scars and two Titles' worth of history |

**Pacifist variant** (Nose-Touch every time, no props): enc 2 offer p = 0.19 → snub (G 22, R 20). Enc 3 p = 0.56. Enc 4 p = 0.90. Enc 5 is capped at 0.95. Enc 3 is the second Rout, so the Scar is guaranteed. P(no friend arc by enc 5) ≈ 0.2% (F4 worked example). The friend arc then lands on Life 2, day 1–2: Kinako on the gatepost with a leaf sprig, keeping Low Wall Corner for 5 days.

---

## 4. Formulas

Rounding is to the nearest integer, .5 up, at the end of each formula. Every `rng` follows §3.3.

### F1. Encounter ledger

`ΔG = min(cap_enc, round(m_g × Σ g_i))`, then the Verdict override (Recruit/snub: `G ← round(G/2)`; accept: `G ← 0`). `ΔR = round(m_r × Σ r_i)`. Both are clamped to 0–100. `G_pending = clamp(G + min(cap_enc, round(m_g × Σ g_rout)))` uses rout items only (no Verdict term) and feeds the tell and F4.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `g_i`, `r_i` | int | §3.5 table | Event bases this encounter |
| `m_g`, `m_r` | float | 0.6–1.2 / 0.7–1.5 | Personality multipliers (§3.4) |
| `cap_enc` | int | {35, 20} | 35 for the cat's encounters 1–2, 20 after |
| `ΔG` | int | 0–35 | Grudge change (before any override) |
| `ΔR` | int | −15 to +50 | Regard change |

**Output range:** ΔG is 0–35. The largest raw input is a Braggart Keeper that is Ambushed, Fear-hit, Pile-On'd and Chased Off: Σg = 31, × 1.2 = 37, which the cap holds to 35. ΔR runs from −15 up to +50:
- **−15:** a Stalwart that is Ambushed, Fear-hit and Humbled: (−3 −2 −5) × 1.5. Equally, a Fraidy that wins a wipe after an Ambush and a Fear hit: (−10 −3 −2) × 1.0.
- **+50:** a Stalwart with a clean win and an accepted Nose-Touch: (8 + 25) × 1.5 = 49.5 → 50.

Both meters are clamped to 0–100, so no value the system cannot use is reachable.
**Worked example:** Kinako, L1 D2: Σg = 6 + 3 + 3 + 10 = 22, × 1.2 = 26.4 → 26 ≤ 35. G 32 → 58.

### F2. Nightly drift

`G' = clamp(0, 100, G − d·quiet·(1 − lead) + s_simmer + s_stew)`

| Symbol | Type | Range | Description |
|---|---|---|---|
| `d` | int | {1, 2} | 1 for Brooder, else 2 |
| `quiet` | bool | 0/1 | 1 if the cat had no encounter with the player today (Away nights are quiet) |
| `lead` | bool | 0/1 | 1 while the cat is the arc lead |
| `s_simmer` | int | {0, 2} | 2 for a Humbled resident on an Unwatched, not-Settled Patch; then `quiet` is ignored (no decay) |
| `s_stew` | int | {0, 5} | Director Stewing; result capped at 74 |

**Range:** −2 to +5 per night. **Example:** a Wary Goofball at 46, unseen for 3 nights: 46 → 40, which crosses into Indifferent (pose change, no announcement).

### F3. Arc score (lead choice, Lane-slot choice, Sniff priority)

`A = 12·enc + 10·marks + 0.3·max(G, R) + 15·beat_mikan − 3·min(days_unseen, 10)`

| Symbol | Type | Range | Description |
|---|---|---|---|
| `enc` | int | 0–15 (slice) | Encounters with the player |
| `marks` | int | 0–3 | Player-sourced Scars (≤ 2) + a Title involving Mikan (≤ 1) |
| `G`, `R` | int | 0–100 | Current meters |
| `beat_mikan` | bool | 0/1 | Has ever won a wipe or a Lick In |
| `days_unseen` | int | 0–∞ | Days since the last encounter (counted ≤ 10) |
| `A` | float | −30 to ≈ 255 | Higher = more "the player's cat" |

**Range:** minimum −30 (a stranger unseen for 10 days); slice maximum ≈ 12·15 + 30 + 30 + 15 = 255. It is only compared, never displayed, so the bounds are harmless. **Example:** Kinako after L2 D1: 12·3 + 10·3 + 0.3·78 + 15 = 104.4.

### F4. Nose-Touch acceptance (seeded per encounter)

`p = clamp(0.05, 0.95, 0.40 + p_mod + 0.006·R_pending − 0.006·G_pending + 0.15·clean + 0.25·snubs)`

| Symbol | Type | Range | Description |
|---|---|---|---|
| `p_mod` | float | −0.20 to +0.30 | Personality (§3.4) |
| `R_pending`, `G_pending` | int | 0–100 | After rout items (F1) |
| `clean` | bool | 0/1 | The clean-win condition (§3.5) |
| `snubs` | int | 0–3 | Previous snubs by this cat (counted ≤ 3) |
| `p` | float | 0.05–0.95 | Acceptance probability |

**Range:** clamped to 0.05–0.95, so the player can never be sure, and a Nemesis is near the floor. Unclamped extremes: −0.60 (Braggart, G 100, R 0, dirty) and +2.20.
**Worked example (pacifist Kinako):** enc 2: G_p 32 + round(9 × 1.2) = 43, R_p 10 + round(8 × 0.7) = 16 → 0.40 − 0.20 + 0.096 − 0.258 + 0.15 = **0.19**. Snub → G 22, R 20. Enc 3: G_p 33, R_p 26, snubs 1 → **0.56**. Snub → G 17, R 30. Enc 4: G_p 28, R_p 36, snubs 2 → **0.90**. Enc 5: **0.95** (clamped). P(all snub) = 0.81 × 0.44 × 0.10 × 0.05 ≈ **0.0018**. A clean-fought Stalwart Tough at enc 1 (G_p 15 + 7 = 22, R_p 10 + 12 = 22): 0.40 + 0.30 + 0.132 − 0.132 + 0.15 = **0.85**.

### F5. Comeback delay

`nights = clamp(1, 3, 2 + p_ret − [G ≥ 50])`. If Away is full (2), the oldest exile with **no marks** leaves for good (`Gone`, a legend record); otherwise the oldest exile returns the next night.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `p_ret` | int | −1..+1 | Personality (§3.4) |
| `G` | int | 0–100 | Grudge after the Verdict |
| `nights` | int | 1–3 | Nights Away |

**Range:** 1–3. The unclamped low is 0 (Braggart at G ≥ 50), which is why the clamp exists. **Example:** Kinako, G 58, Braggart → 2 − 1 − 1 = 0 → **1**.

### F6. Wall-event schedule and choice

The next event comes on night `n + 2 + b`, `b ∈ {0, 1}` seeded 50/50. The kind is chosen by weight among the eligible: return 4, Restless 4, refill 3, feud scuffle 2, promotion 2. The weight is ×2 if the event involves a cat with `enc ≥ 1`. Nothing eligible means no event, and the schedule still advances.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `n` | int | day index | Night of the last event |
| `b` | int | 0–1 | Seeded jitter |
| `w_k` | int | 0–8 | Weight of kind k (0 if ineligible) |

**Range:** 0.33–0.5 events per district-night, which meets "one every 2–3 nights". **Example:** night 3, eligible: refill (stranger, 3), scuffle involving a cat the player Humbled (2 × 2 = 4), promotion (2) → P(scuffle) = 4/9 = 0.44.

### F7. Scar chance (on a Rout by the Posse)

`p_scar = min(1, 0.35 + 0.15·by_pile_on + 0.50·[routs_by_player ≥ 2])`. A cat on its 2nd+ Rout with no Mikan Scar is **always** scarred. No Scar is given if it already shows 2 from Mikan.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `by_pile_on` | bool | 0/1 | From `CatRouted` |
| `routs_by_player` | int | 1+ | Including this Rout |
| `p_scar` | float | 0.35–1.0 | |

**Range:** 0.35–1.0. **Example:** Kinako's first Rout, by Pile-On: 0.50. His second: 1.0.

### F8. Bark score

`S = 3·n_mem + 2·n_rel + 1·n_ctx − 4·said_to_player − 2·recent_any`. Pick uniformly (seeded) among the top S. `n_mem ≥ 1` → unskippable 1.0 s.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `n_mem`, `n_rel`, `n_ctx` | int | 0–4 each | Matched required tags per family |
| `said_to_player` | bool | 0/1 | This cat has said it to the player before |
| `recent_any` | bool | 0/1 | Any cat used it in the last 10 barks |
| `S` | int | −6 to 24 | |

**Range:** −6 to 24. Negatives are fine (it is a ranking). **Example:** "Go on, tip the bucket…" with `adapted:*` → S = 3. A floor line → S = 0. The memory line wins.

### F9. Rival level

`L_gen = clamp(1, 8, L_mikan + o_rank + δ)`; growth +1 per comeback and per promotion; the cap is `L_mikan + 3`. Daifuku is authored.

| Symbol | Type | Range | Description |
|---|---|---|---|
| `L_mikan` | int | 1–8 | Mikan's level |
| `o_rank` | int | Roamer −1, Tough 0, Captain +2 | Rank offset |
| `δ` | int | −1..0 | Seeded |
| `L` | int | 1–8 (slice band) | |

**Range:** 1–8 (Lane band). Growth stops at the cap. **Example:** Kinako, generated at L_mikan 2: 2 + 0 + 0 = 2; after a comeback, 3.

---

## 5. Edge Cases

| Situation | Rule |
|---|---|
| The player interrupts the Thorn's flee on Life 1, day 1 | Normal Rout and Verdict (the first Verdict lands on the cat that matters). Day 2 follows §3.8 table 1 |
| The Thorn is Recruited or accepts Nose-Touch in Life 1 | `arc_role = resolved`; a new lead is named on the next night (§3.7). The day-2 memory line still plays (`CREW_MEMORY` / greeting) |
| The player avoids the gatepost on Life 1, day 2 | The placement is on the only route out, within 30 s. If the player leaves by the High Road, the Thorn is moved to the first Scent Post the player approaches |
| The player loses to the Thorn in Life 1 | Mikan home at Dusk, nothing lost (DR-19). The Thorn Gloats, takes Bell-Ringer and moves up a seat. Day 2: `REMATCH_I_WON` |
| The highest-ranked Routed cat is not the arc lead | It gets the Verdict; the lead slips away (`SLIPPED_AWAY`, rout items only) and stays the lead. (A player-choice override is Backlog) |
| The Undermark crate is occupied | Humble is greyed, with a reason icon (crate taken) |
| The Crew is full | "Recruit — make room" (DR-34) |
| Recruit is blocked (G ≥ 90, R < 50) | Greyed; tell: it bares its teeth at the bell |
| Nose-Touch on a Keeper whose Patch the player needs | Allowed; the Patch stays the cat's for 5 days. The Den gate is Territory's (3 of 4 outer) |
| Daifuku's Verdict (end of the slice) | Routing Daifuku claims the Lane whatever the Verdict (Territory). Chase Off: he leaves the wall (his return is Backlog). Nose-Touch: he keeps his wall top on the Fence Line, but the Den is claimed. Recruit needs Regard ≥ 50. Humble is legal (the Den becomes the player's) (A-2) |
| Two cats tie for a slot or lead | The earlier first meeting wins, then the lower `cat_id` |
| No cat ≥ 75 | The Lane slot stays empty. A pacifist slice may end with zero Nemeses (the friend arc covers the guarantee) |
| Away full on a Chase Off | F5 overflow rule |
| A comeback finds its seat taken | The lowest empty seat, else Roaming |
| Tracked would exceed 12 | No fresh generation; refills use Roamers only. The oldest `Gone`-eligible Roamer with no marks retires to legend |
| An adaptation would break Always a Way In | Skip to the next rule; if none applies, no adaptation |
| An `adapted` line is missing for a Strength | Lint fails the build (acceptance §8) |
| Ambush rolled on the morning after a wipe, in Life 1, or with a truce/Humbled/Crew candidate | Not placed |
| The player Ambushes a cat it has never met | Corner tag; `STANDOFF_FIRST` plays at the Rout; logged as the first meeting |
| The player flees | Grudge 0, Regard −8; no promotion. The arc lead's presence guarantee still holds |
| A raid by a cat under truce | Never requested |
| A Humbled resident whose Patch is lost to a raid | The resident returns to `Seated` (lowest empty seat) or Roaming, Grudge unchanged |
| A line overflows at maximum slot length | `short_text`; else dropped and logged |
| Reload to re-roll Nose-Touch or a Scar | The same result: seeded on `encounter_serial` |
| Mikan Routed by an untracked Stray in a won fight | No Lick In (tracked Rivals only) |
| `DistrictClaimed` (Lane) | All seated cats remain on the wall in the slice. Holdout rules are Backlog (NS-17) |

---

## 6. Dependencies

### 6.1 Events consumed and emitted (brief §6.1 names)

| Direction | Event / query | Use |
|---|---|---|
| In | `EncounterStarted` (opener, participants) | Clean / Ambush flags, encounter counts, Standoff line |
| In | `CatRouted` (finisher, damage_type, by_pile_on, was_frazzled) | Ledger, Scar type, Lick In (victim = Mikan) |
| In | `FearTriggered` | Fear item, Water cowlick, adaptation input |
| In | `EncounterEnded` (outcome, routed_ids) | Verdict cat, `SLIPPED_AWAY`, loss and victor |
| In | `PatchChanged`, `RaidResolved`, `DistrictClaimed` | Patch-lost item, Keeper, Humble residence, uprising result |
| In | `HomeArrived`, `PhaseChanged`, `DayEnded`, `LifeAdvanced` | Routine tags, `mikan_plastered`, Night Shuffle |
| Out | `VerdictApplied`, `RivalRankChanged` / `WallEvent`, `RaidRequested`, `BetrayalTriggered` (unreachable in the slice) | Territory, Crew, UX, Narrative |
| Query out | `RivalCombatProfile` (level, style, personality, moves, strengths, fears, title, scars, flee_threshold) | Combat |
| Query in | `PowerRating`, `Loyalty` (Crew) | Raid targeting, the betrayal step (slice no-op) |

### 6.2 Owned by others (this doc does not set)

- **Combat:** Fear and Strength values, flee windup, Ambush counter timing, Old Score Frazzle, Pile-On, Rival AI by personality, the fight-bark icons' VFX.
- **Territory:** raid resolution, Scent, the Undermark +15% Tribute, Clout, the Mark Over Scent value, Sentry and Watched rules, the Den gate.
- **Crew:** the Bribe, starting Loyalty (DR-09 formula, input `G_pre`), the story recruits' personalities, signature-perk values.
- **Narrative:** every line, Daifuku's personality, Life gates, the plaster.
- **UX:** the Fence Line, Verdict prompt and Sniff screens.
- **Art:** 4 silhouette Scars, the head plaster, 6 disposition poses, the storm mark, 6 personality sets.
- **Audio:** 2 voice bodies × 8 intents, per-Rival stings.
- **Day loop:** phase timing.

### 6.3 Assumptions for creative-director review

- **A-1:** Daifuku is a Brooder (Narrative owns Boss personalities).
- **A-2:** a Nose-Touched or Chased-Off Daifuku still yields the Lane claim, because the Rout claims it.
- **A-3:** the Keeper of Low Wall Corner in DR-22's escalation *is* the First Thorn.
- **A-4:** DR-42 lists "Clout +2" for Chase Off while DR-14 makes Clout milestones-only. This doc emits the Verdict and lets Territory decide.
- **A-5:** the Title "the Soggy" shares a word with Combat's Soggy status. Kept deliberately as a callback (NS-C14); Narrative may rename it.

### 6.4 Patent risk (E-4) — not legal advice

The acknowledged inspiration, the Nemesis System of *Middle-earth: Shadow of Mordor / Shadow of War*, is covered by a Warner Bros. patent. The first draft cited US 10,926,179; counsel should verify the number, claims, status and territories. **This document reaches no legal conclusion about what the patent covers.** **Recommendation:** qualified patent counsel should review this design against the actual claims before the slice's Rivals scope is locked and again before any public showing (brief risk 9). Marketing does not use the original system's name.

- **Design differences, for counsel to weigh:** nobody dies, and fights end in a player-chosen Verdict. There are two meters (Grudge and Regard), and respect leads to friendship and truce. The hierarchy is seats on a wall tied to scent-marked Patches. Off-screen change is a small number of director wall events, not simulated duels. Followers come from a Bribe after a Verdict, not a domination power. The street reads a household routine.
- **Close to the inspiration (counsel should look first):** persistent enemies that remember encounters; appearance, ability and rank changes driven by those encounters; promotion of the enemy that beats the player; a hierarchy screen.
- **Levers if counsel asks for distance:** each has a cost, and none should be pulled without advice. Title-only on a loss (no promotion) needs creative-director approval. Wall events could be driven only by the player's actions. The Fence Line could be presented unranked.

---

## 7. Tuning Knobs

| Knob | Default | Safe range | Effect |
|---|---|---|---|
| Event bases (§3.5) | Rout 6, Pile-On 3, Fear 3, Ambush 3, Patch lost 6, fled 8, Chase 10, Humble 10 | ±50% | Speed to Bitter. Above +30% → non-arc cats Bitter after 2 encounters |
| `cap_enc` | 35 then 20 | ruled (DR-39) | — |
| `m_g` / `m_r` | §3.4 | 0.5–1.5 | Personality contrast |
| Decay `d` | 2 (Brooder 1) | ruled | — |
| Nemesis threshold | 75 | ruled | — |
| Slots | 1 + arc lead | ruled | — |
| Restless | 80 | ruled | — |
| Simmer | +2/night Unwatched | 1–3 | Uprising pressure |
| Stew | +5/night, cap 74, from L2 D3 | 3–8; cap ≤ 74 | Pacifist pressure |
| F4 base / clean / snub bonus | 0.40 / 0.15 / 0.25 | 0.3–0.5 / 0.1–0.2 / 0.15–0.35 | Friend-arc speed; pacifist guarantee needs snub ≥ 0.2 |
| F5 base | 2 nights | 1–3 | Return cadence |
| Away cap | 2 | ruled | — |
| Wall-event gap | 2–3 nights | ruled | — |
| F7 base / Pile-On / 2nd Rout | 0.35 / 0.15 / 0.50 | 0.2–0.5 / 0–0.25 / guarantee fixed | Scar frequency |
| `p_ambush_day` | 0.5 | 0.3–0.7 (Life 2) | Rival Ambush frequency (≤ 1/day fixed) |
| Lead presence | ≥ 1 encounter/day from L2 D1 | fixed for the slice | Arc guarantee |
| Sniff nemesis items | 1 (L1) / 3 (L2) | ruled | — |
| `STANDOFF_FIRST` retirement | 20 days | ruled | — |
| Unskippable memory line | 1.0 s | ruled | — |
| Scars shown from Mikan | 2 | 2 (slice) | — |

---

## 8. Acceptance Criteria

**Experience (slice playtest, unbriefed testers)**
1. 100% of testers see a memory-citing Rival line (template `n_mem ≥ 1`) **before minute 60** (DR-03). Expected ≈ minute 33.
2. ≥ 80% can name one Rival at 2 h and say one thing they did to it.
3. **Scar readability:** in an 8-cat Fence Line view and in third-person exploration at default FOV, a reviewer picks out the cat Mikan Scarred 8 times out of 8.
4. **Verdict variety:** across testers, no single Verdict exceeds 60% of all Verdicts given, and ≥ 70% of testers use ≥ 3 different Verdicts.
5. ≥ 70% of testers notice at least one overnight Fence Line change, unprompted, by the end of Life 2.

**Simulation (DR-57: Monte Carlo, 7 days, one district, 1,000 seeds; policies chase, humble, mixed, pacifist, lose-40%)**
6. Share of seated Rivals at Grudge ≥ 75, averaged over Life 2 nights: **≤ 15%** for every policy.
7. Nemeses (slot holders) per slice: median 1, **max 2**.
8. `NemesisArcAchieved` by the end of Life 2: **100%** for chase, humble, mixed and lose-40%; **≥ 99%** for pacifist (the F4 bound is 99.8%).
9. Wall events per district-night: 0.33–0.5. Rank changes visible on the wall per night: ≥ 0.3.
10. Life 2 mornings with ≥ 1 admitted nemesis item: 60–95%. **Never > 3 items.**
11. Uprisings per slice: 0 when the Humbled Patch is Watched; ≤ 1 under neglect.
12. Hand-check reference values the sim must reproduce: the Kinako chase path gives G 32 → 58 → 78, Nemesis on the night of L2 D1. For non-arc cats under typical play (Pile-On, Chase, no Fear, no Ambush, start 15), two encounters give ≤ 70. Worst case (Braggart, start 20, Keeper, Fear and Ambush on both encounters) is 83. That is the only two-encounter route to Bitter, and it is intended.

**Rules and data (automated)**
13. Pinned Memory ≤ 6 and entries ≤ 10 for every cat over 1,000 seeded runs.
14. Always a Way In holds after every adaptation (property test).
15. One Verdict per encounter. Every other Routed tracked cat gets exactly one `SLIPPED_AWAY` entry.
16. Determinism: the same seed and inputs give a byte-identical save after 7 days across 1,000 runs. Reloading before a Verdict reproduces the Nose-Touch result and the Scar.
17. **Bark lint:** every tag is in §3.15. Every template renders ≤ 60 characters at maximum slots (or has a valid `short_text`). Every `{other}`/`{when}` slot is bound. No banned human-reference words. ≥ 1 floor per (trigger, personality) for the 8 floor triggers and ≥ 1 `any` floor for the rest. Total ≤ 240.
18. No Sniff item about a cat with 0 encounters unless it touches a player Patch or Crew cat.
19. Stewing never raises a cat above 74 and never selects a Friend, a truce cat, Crew or a cat with Regard ≥ 50.
20. ≤ 1 Rival Ambush per day; none in Life 1 or on a post-wipe morning; 2.0 s warning; the counter window is the last 0.75 s.

---

## Backlog (post-slice)

- NX-08: the 2nd and 3rd comeback forms beyond the Lane (moving uphill, a Captain in the next district, gossip-borne Titles).
- NX-11: Kits (from cats with history only; "Mum"/"the old one"; ≤ 1 per Life).
- NX-13 / DR-27: the Life 8 Reckoning (state presented on return, gratitude first, Ambush budget 0, optional Usurper).
- NS-2: betrayal tuning (Wavering < 30, Turncoat) and Lure replacement; the Loyalty formula is Crew's.
- NS-7: Away per district for 3 districts.
- NS-10: full population (27 seats + ≤ 12 off-wall), legend records, save-size budget.
- NS-14: rewrite the archived A.2 (Sumi) and A.3 (Buri/Aji) stories for the full game.
- NS-15: moot (Spats and duels cut); keep the note in case duels return.
- NS-17: Holdouts in claimed districts (the excess above 3 become Holdouts on the lowest seats).
- NS-C8: "Comes Knocking" (a Friend with Regard ≥ 75 asks to join, ≤ 1 per Life).
- NS-C10: the Holdout naming split with Territory.
- NS-C15: Turncoat takes the Patch only if it was posted and left Unwatched (cite Territory).
- NX-C6: epilogue `wall_friend` / `wall_nemesis` candidates.
- Wall Watch (a Rival on the wall opposite Haru's gate after a loss).
- Ageing, retirement, Old-Timers.
- Multi-district behaviour and the Nemesis slot per district.
- Portrait Scars (whiskers, nose, eye) after two silhouette Scars; the full Scar catalogue.
- The full Titles list (Tail-First, Dust-Eater, the Unbudged, Post-Stealer, Sentry-Scatterer, the Faithful, …).
- Fears beyond the 3 slice Fears (Being Outnumbered, Brooms, Dogs, The Bell, …) and their escalation (Overcome/Dread).
- Strengths beyond the slice 9 (Pack Caller, Night Eyes, Rain Cat, Street-Smart, Sentry-Breaker, Bell-Hunter).
- Quirks (cut to ≤ 6 when they return; no Littermate, Gossip or Shadow).
- Clean Duels; the Standoff that resolves status without a fight for every Friend (the slice has only `TRUCE_YIELD`).
- A player-choice override for "which Routed cat gets the Verdict".
- Botan's Verdict (DR-45: Humble or Nose-Touch only; the hand-bell).
- Botan's "Collar" hypocrisy payoff and the Secret Collar quirk.
- Full bark budget (≤ 700) and the `CREW_SPOTTED`, `WAVERING`, `LAST_WALK` triggers.

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
| NS-14 | BACKLOG (A.1 FIXED) | The new slice story Kinako replaces A.1 (§3.16) |
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

# Nemesis System ("Rivals")

> **Status**: In Review (first draft, not yet reviewed or playtested)
> **Author**: systems-designer (first-draft pass commissioned by the user)
> **Last Updated**: 2026-11-23
> **Last Verified**: 2026-11-23
> **Implements Pillar**: Pillar 4 "Rivals Remember" (primary); constrained by Pillars 1, 2, 3 in that priority order

Canon terms (Rival, Nemesis, Verdict, Grudge, Memory, Fence Line, Night Shuffle, Standoff, Routed, Patch, Clowder, Crew, Posse, Sentry, Warden, Clout, Life...) are used exactly as defined in `design/creative-brief.md`. Terms this document introduces are marked **(new)** on first use and collected in section "Assumptions for creative-director review".

All numbers are tuning starts. Nothing here has been simulated or playtested yet.

## Summary

Every named enemy cat in Yunagi is a persistent Rival with a face, a temper, fears, a rank on a wall of cats, and a log of everything that has passed between it and Mikan. Nobody dies, so every fight ends in a Verdict the player chooses and every Verdict comes back: as an exile returning tougher, a tribute-payer plotting, a Crew cat who may turn its coat, or an old enemy who nods as you pass. The system exists so that each player finishes the game with enemies and friends nobody else had.

> **Quick reference** — Layer: `Core` · Priority: `Vertical Slice` · Key deps: `Combat, Territory & Economy, Crew & Progression, Day Clock / Lives (creative brief), Narrative (bark voice), UX (Fence Line, Morning Sniff, Verdict prompt)`

## Overview

Yunagi's six Clowders are made of individual cats. Each district tracks eight of them as Rivals (one authored Boss, two Captains, five Toughs), generated procedurally with a name, a coat, a Style, a temperament, quirks, Strengths and Fears. When the player fights one, the fight is recorded in that cat's Memory and changes the cat: a cartoon Scar, an earned Title, a higher Grudge, a new Strength, a lost or deepened Fear. When the player wins, they choose one of four Verdicts (Chase Off, Humble, Recruit, Nose-Touch); when the player loses, the winner is promoted, takes a Title at Mikan's expense and performs a small Verdict of its own on Mikan. Every night, while Mikan sleeps in Haru's House, the Night Shuffle moves the Rivals without the player: they duel each other for perches, come back from exile, raid the player's Patches, stir up tribute-payers, and test the loyalty of ex-Rivals in the Crew. The result is read each morning on the Doorstep and on the Fence Line, a wall with every known Rival sitting on it in rank order. A pacing layer makes sure the drama arrives at a readable rate, that it cannot snowball against a struggling player, and that every player gets at least one full nemesis arc.

## Player Fantasy

**"That cat. That one, with the bent whisker. I gave him that."**

The player should feel:

1. **Known.** The town has opinions about Mikan. A cat the player humiliated last week says so, to their face, in one sharp line, wearing the mark of it.
2. **Authored by their own play.** The Fence Line is a portrait of the player's choices: who was shown mercy, who was sat on, who was bought with fish, who was driven out and came back.
3. **Fond of their enemies.** Rivals are villains you enjoy. The street is a comedy of status, and a good Nemesis is a running joke with teeth.
4. **Never safe from consequences, never cheated by them.** Betrayals, raids and comebacks are always telegraphed at least a day ahead to a player who is paying attention, and always traceable to something the player did or neglected.
5. **Small against time.** Rivals grey between Lives, retire to sunny walls, and send their kits to settle the family account. The grudges outlive their owners, like everything else in this game.

The governing metaphor is not a military hierarchy. It is **a neighbourhood's cats sorting out who sits where**: status is public, lost face is funny, territory is smell, and a nose-touch means more than a win.

## Detailed Design

### Core Rules

#### R1. Identity of this system (what makes it ours)

These seven traits are the system's identity. Any change that removes one must be escalated to the creative-director. They are also the elements the risk section (Appendix B) relies on as deliberate differentiation.

| # | Identity trait | Where it lives |
|---|---|---|
| I1 | **No death. The engine is face, not lives.** Outcomes are Verdicts chosen by the player, and the system's two currencies are Grudge and **Regard (new)** | R6, R7 |
| I2 | **Verdicts run both ways.** When Mikan loses, the Rival performs a **Gloat (new)** on Mikan | R7.3 |
| I3 | **Rank is a seat on a wall, tied to smell.** Rivals keep Patches; the hierarchy is the Fence Line; knowledge comes from sniffing marks and from cats who owe you, not from interrogation | R4, R11 |
| I4 | **The player's own Crew is inside the simulation.** Ex-Rivals keep Memory, hold posts, get lured, waver, turn coat, or stand firm | R9.6 |
| I5 | **Two lives.** Rivals react to the collar, the bell, the bowl, the curfew, the Call and the garden wall. The house is a sanctuary they cannot enter and will not let Mikan forget | R13 |
| I6 | **Generations.** Time-skips between Lives age the Rivals, retire some, and bring their kits onto the wall with an inherited account | R13.3 |
| I7 | **Gratitude is simulated as carefully as spite.** Life 8 pays out both ledgers | R13.5 |

#### R2. The Rival data model

Rivals use the brief's One Cat Schema unchanged. This document owns the fields marked N and adds one extension record, `rival`, that is kept for the cat's whole existence (including while it is Crew).

**Shared schema fields and who writes them**

| Field | Writer | Notes for Rivals |
|---|---|---|
| `id` | Nemesis (at generation) | Stable for the save's lifetime, never reused |
| `name`, `title`, `coat_seed` | **N** | `title` is the one displayed Title (R6.5) |
| `style`, `level` | **N** selects; Crew owns growth curves | Rival level changes follow F8 while non-Crew |
| `xp`, `stats{}` | Crew | Derived from style and level by Crew's curves |
| `moves[4]`, `knacks[2]`, `zoomies` | **N** selects from Combat's catalogue via Crew's learnsets | Selection rule R3.7 |
| `traits{strengths[], fears[], scars[]}` | **N** | Effects valued by Combat |
| `loyalty` | Crew | Read by Nemesis for R9.6 |
| `grudge` | **N** | Grudge toward Mikan, 0–100 |
| `memory[]` | **N** | R5 |
| `rank` | **N** | `untracked, tough, captain, boss, great_boss` |
| `clowder` | **N** for Rivals; Crew sets Bell Clowder on recruit | |
| `assignment` | Territory/Crew while Crew; **N** while Rival | For Rivals: `keeper:<patch_id>`, `roamer`, `resident:<patch_id>` (Humbled), `away` |

**Extension record `rival{}` (new, owned by Nemesis)**

| Field | Type | Range / set | Purpose |
|---|---|---|---|
| `gen_seed` | int | 32-bit | Reproduces everything generated |
| `origin` | enum | `clowder_born, promoted_stray, promoted_hanger_on, kin, authored_boss` | How it entered tracking |
| `pronoun` | enum | `he, she, they` | UI text only |
| `temperament` | enum | 6 values (R3.4) | Behaviour weights and bark voice |
| `quirks[]` | enum list | 1–2 of the catalogue (R3.5) | Flavour with a small systemic hook |
| `regard` | int | 0–100 | Respect for Mikan (R6.2) |
| `state` | enum | R "States and Transitions" | Lifecycle state |
| `home_district`, `home_patch` | id | | Where it belongs on the Fence Line and in the world |
| `active_phases` | bitmask | 2–3 of Morning/Day/Dusk/Night | When it is in the world |
| `intent` | enum | R9.8 | Tomorrow's plan, set each night |
| `feuds[]` | list of `{cat_id, grudge, regard, last_event_day}` | max 6 entries | Relations with other Rivals and with individual Crew cats |
| `bonds[]` | list of `{cat_id, kind}` | kind = `littermate, shadow, parent, kit` | Positive ties |
| `titles_earned[]` | list of `{title_id, source_cat_id, day}` | max 3 | Display rule R6.5 |
| `counters` | record | `routs_by_player, routs_of_player, player_fled, rival_fled, scattered, fights_total, fear_exploits{fear_id:n}, rout_types{claw,fang,thump,yowl}, pile_ons, ambushed_by_player` | Drives adaptation, titles and the director |
| `intel` | bitmask | R11.1 | What the player knows |
| `sting_seed` | int | | Seed for the personal 2-bar yowl-sting (Audio owns the generator) |
| `born_life`, `former_rank` | int, enum | | Ageing, kin, and restoring rank after Humbled/Crew |
| `director` | record | `arc_role (none, seed, lead), protected_until_day, last_forced_day, loss_streak` | Pacing layer bookkeeping (R12) |
| `timers` | record | `return_day, truce_until_day, rest_until_day, honeymoon_until_day, restless_since_day, wavering_since_day` | |
| `loot_held` | int | 0+ Morsels | Morsels taken from Mikan in a Gloat (R7.3) |

**Untracked cats.** Fights also contain nameless cats. The brief defines **Stray** (unaffiliated). This document needs a word for nameless members of a Clowder and uses **Hanger-on (new)**. Neither is tracked, neither receives a Verdict, and either becomes a tracked Rival the moment it earns it (R4.5).

#### R3. Procedural generation

Generation is deterministic from `gen_seed = hash(save_seed, district_id, perch_index, generation_counter)`. Order: rank → level → Style → temperament → quirks → coat → name → Fears → Strengths → Moves/Knacks → schedule → starting Grudge/Regard → prehistory.

**R3.1 Names.** One given name, 2–8 characters (hard limit, because of the 60-character bark rule). Drawn without replacement from the home district's table (70%) or the common table (30%). A name is never shared by two cats that exist in the save, and never matches the exclusion list: every authored name in the brief (Mikan, Daifuku, Sabi, Oboro, Ikari, Kiha, Moha, Botan, Haru, Sora, Koharu, Gran), the player's chosen name for Mikan, and a legal/IP blocklist maintained by Narrative (it must include every character name of the art-style reference IP). Content target: 30 names per district table plus 40 common = 220, against an expected 90–110 Rivals generated per playthrough.

Placeholder tables (the theme of each table is the design; the entries are for Narrative and localisation to replace):

| Table | Theme (cat-true: strays get named after what is nearby) | Example entries |
|---|---|---|
| Hidamari Lane | Things in an old house | Zabuton, Futon, Tatami, Yakan, Tansu, Geta, Furin, Sudare, Engawa, Kotatsu, Noren, Tsubo |
| Akane Arcade | Stall food | Korokke, Menchi, Tofu, Oden, Taiyaki, Dango, Kinako, Anko, Senbei, Negi, Gyoza, Ramune |
| Tsukimi Hill | Shrine and night | Koma, Sumi, Hotaru, Toro, Ema, Sasa, Take, Yoru, Kage, Susuki, Higan, Omamori |
| Shiosai Harbour | The catch | Saba, Iwashi, Nori, Wakame, Fugu, Tako, Ika, Aji, Kombu, Shirasu, Buri, Sazae |
| Kurogane Yard | Metal and soot | Tetsu, Kugi, Jari, Kemuri, Kan, Semento, Hagane, Kippu, Senro, Susu, Renga, Doro |
| Kasumi Heights | Inn luxuries | Yuzu, Matcha, Tsubaki, Ume, Sango, Yukimi, Hisui, Mochi, Kohaku, Ohagi, Shinju, Kinu |
| Common | Short pet and street names | Mame, Chibi, Goma, Kuri, Nabe, Tama, Pochi, Momo |

**R3.2 Rank and level.** Rank comes from the perch being filled (R4). Level from F1.

**R3.3 Style.** Weighted by Clowder so each district has a fighting character, with the Boss's Style favoured. Weights are renormalised over the Styles enabled in the current build (the vertical slice ships 3).

| Clowder | Bruiser | Scrapper | Prowler | Yowler | Trickster |
|---|---|---|---|---|---|
| Wall Sitters | 35 | 25 | 10 | 15 | 15 |
| Awning Gang | 15 | 20 | 10 | 35 | 20 |
| Lantern Eyes | 10 | 15 | 35 | 20 | 20 |
| Salt Paws | 25 | 35 | 15 | 10 | 15 |
| Rust Runners | 15 | 20 | 20 | 10 | 35 |
| Steam Court | 20 | 20 | 20 | 20 | 20 |

Constraints: the two Captains of a district never share a Style; the seven procedural Rivals of a district show at least 3 Styles (reroll the last-generated offender).

**R3.4 Temperament (new).** One per Rival. It is the personality: it sets how the cat feels about events, what it does off-screen, and which bark voice it uses.

| Temperament | In one line | Grudge gain × `m_g` | Regard gain × `m_r` | Flees a fight at Nerve | Ambition `A` | Turncoat factor `T` | Nose-Touch mod | Gloat (R7.3) |
|---|---|---|---|---|---|---|---|---|
| **Braggart** | Loud, vain, lives for an audience | 1.2 | 0.7 | never | 1.4 | 1.0 | −0.20 | Swat the Bell |
| **Brooder** | Silent, counts every slight | 1.5 | 0.8 | never | 1.0 | 1.2 | −0.10 | Mark Over |
| **Schemer** | Patient opportunist | 1.0 | 0.9 | 15% | 1.6 | 1.5 | 0.00 | Snatch |
| **Fraidy** | All puff, no stomach | 0.7 | 1.0 | 25% | 0.5 | 0.5 | +0.10 | Bolt |
| **Stalwart** | Plays fair, expects the same | 0.8 | 1.5 | never | 0.8 | 0.25 | +0.30 | Turn Away |
| **Goofball** | Cannot stay angry or focused | 0.6 | 1.2 | 10% | 0.7 | 0.6 | +0.15 | Swat the Bell |

Base generation weights (%): Braggart 22, Brooder 16, Schemer 16, Fraidy 14, Stalwart 16, Goofball 16. Each Clowder shifts +10 to one temperament and −5 from two:

| Clowder | +10 | −5, −5 |
|---|---|---|
| Wall Sitters | Goofball | Braggart, Schemer |
| Awning Gang | Braggart | Fraidy, Stalwart |
| Lantern Eyes | Schemer | Goofball, Braggart |
| Salt Paws | Stalwart | Fraidy, Goofball |
| Rust Runners | Brooder | Stalwart, Fraidy |
| Steam Court | Braggart | Goofball, Brooder |

Constraints per district (reroll the last-generated offender): at least 4 distinct temperaments among the 7 procedural Rivals; at least one Stalwart or Goofball (a cat that can become a friend); at least one Brooder or Braggart (a cat that can become a Nemesis).

**R3.5 Quirks (new).** Every Rival has one quirk; 30% have a second. Quirks are cat behaviours with one small systemic hook each.

| Quirk | Weight | Hook |
|---|---|---|
| Box-Sitter | 10 | Found in crates and boxes; when it Ambushes, it comes out of one. Its location is given away by any box in Whisker Sense |
| Glutton | 10 | Share a Morsel (R7.2) works double; Snatch replaces its Gloat; proposes a lower Recruit offering to Economy |
| Roof-Walker | 8 | Lives on the High Road; cannot be Ambushed from above |
| Sun-Chaser | 8 | `active_phases` = Morning+Day; found at or near Sunspots |
| Night Owl | 8 | `active_phases` = Dusk+Night (never assigned in Hidamari Lane before the cat flap, R13.1) |
| Loaf | 8 | Never roams; always at its Patch; +1 nightly to hold it in duels (`H` in F6 becomes 1.20) |
| Chirper | 7 | Talks constantly; ambient barks from it reveal one extra intel fact per day |
| Gossip | 7 | Sniffing its mark reveals a fact about a different Rival as well |
| Littermate | 7 | Generated as a bonded pair with another Rival of the district (shared coat palette). Humiliating one raises the other's Grudge (R6.1) |
| Shadow | 6 | Bonds to the highest-ranked Rival it does not feud with; requests to appear as that cat's escort |
| Sore Loser | 6 | Never accepts a first Nose-Touch; comeback delay −1 night |
| Show-Off | 6 | Always opens with a Standoff, never an Ambush; witnesses count double for it (F2) |
| Collector | 5 | Sits on a hoard; proposes a Shiny drop to Economy on first Rout |
| Secret Collar | 4 | Has a human home it hides (an echo of Botan). Absent at Dusk. If the player discovers it (follow its scent trail at Dusk), it gains the gained-only Fear "The Carrier" and can never again use the address "Collar" |

**R3.6 Coat.** Nemesis owns the logical genome packed into `coat_seed`; Art owns what each value looks like. Parameters and weights:

| Parameter | Values (weight %) |
|---|---|
| Build | Standard 35, Slim 20, Chonk 20, Lanky 15, Small 10 |
| Pattern | Mackerel tabby 22, Solid 20, Bicolour 18, Classic tabby 12, Calico/tortie 12, Van (cap and tail) 8, Colourpoint 8 |
| Palette | Brown 22, Black 18, Grey 18, Ginger 14, Cream 10, White 10, Rust 8 |
| Fur | Short 60, Scruffy 25, Long 15 |
| Tail | Long 50, Fluffy 20, Kinked 15, Bobtail 15 |
| Eyes | Yellow 35, Green 30, Amber 15, Blue 12, Odd-eyed 8 |
| Mark (one) | None 30, Nose smudge 12, Socks 12, Moustache 10, Eyebrow dots 10, Chin spot 8, Tail ring 8, Bib 6, Heart patch 4 |

Constraints: (a) no two cats on the same district's perches share the triple (Build, Pattern, Palette); (b) every Rival differs from every other tracked cat in the district in at least 2 of the 7 parameters; (c) **Mikan protection**: the combination Van + Ginger-on-white + Bobtail is never generated, and no Rival is generated with a collar except by the Secret Collar quirk or Boss authoring; (d) authored Boss looks are reserved; (e) no generated coat feature may resemble a Scar from the catalogue (in particular, no notched or tipped ears at generation), so that every Scar reads as history. Clowder skews (for example more Black in Lantern Eyes, more White and Long fur in Steam Court) are an Art request, capped at ±10 points per value.

**R3.7 Moves, Knacks, Zoomies.** Nemesis picks from the Style's learnset (Crew) at the cat's level: Tough 2 Moves and 1 Knack, Captain 4 and 2, Boss authored. Zoomies is the Style default. A Recruited cat therefore arrives with a real, teachable kit (the player's reason to Recruit "for a Move they want to copy").

**R3.8 Fears and Strengths at generation.** Counts by rank:

| Rank | Fears | Strengths |
|---|---|---|
| Tough | 1 (70%) or 2 (30%) | 0 (60%) or 1 (40%) |
| Captain | 1 (60%) or 2 (40%) | 2 |
| Boss | authored: 1, hidden until earned (R11.2) | authored: 3–4 |

Catalogues are in R6.6 and R6.7. A generated Fear must appear in the district's `fear_sources` list (supplied by Level Design/Combat: which props exist there), so no Rival is generated with a Fear the player cannot trigger at home.

**R3.9 Starting feelings.** `grudge = 10 + rng(0..10)`; `regard = 10 + 5 × clout_index` (F4 defines `clout_index`). A town that has heard of Mikan starts out warier, not friendlier.

**R3.10 Prehistory.** When a district unlocks, run 10 simulated nights of R9 steps 2c–2e for that district alone, with no player-related steps. Rivals therefore meet the player with existing feuds, a few Scars, and (for Captains) one earned Title. Prehistory may not change who holds the Boss perch.

#### R4. Hierarchy: perches, Patches and how seats fill

**R4.1 Perches (new).** Each district has 8 perches on the Fence Line: 1 Boss, 2 Captain, 5 Tough. A perch is a seat, not a cat. The brief's "8 tracked Rivals per district, 48 town-wide" is the perch count and is an upper bound on hostile tracked Rivals.

**R4.2 Patches.** While a district is unclaimed by the player:

| Patch | Keeper |
|---|---|
| The Den | The Boss |
| 2 Patches | One Captain each |
| 2 Patches | Two of the five Toughs (the two highest level) |
| — | The other three Toughs are **Roamers**: the pool for patrols, Ambushes and raids |

Territory owns which Clowder holds a Patch. Nemesis owns which Rival is its **Keeper (new)**. When the player takes a Patch, its Keeper becomes a Roamer (and remembers: R6.1 `PATCH_LOST`). When a Rival Clowder retakes a Patch (`PatchChanged`), the highest-ranked participating raider becomes Keeper.

**R4.3 Off-perch lists.** Tracked cats that are not sitting on a perch:

| List | Cap | Who |
|---|---|---|
| **Undermark (new)** | 1 per player-held Patch (30 town-wide) | Humbled residents |
| **Away** | 6 town-wide | Chased-Off exiles waiting to return |
| Crew | Crew cap | Recruited ex-Rivals (owned by Crew; Nemesis keeps `rival{}`) |
| **Old-Timers (new)** | 6 town-wide | Retired Rivals (R13.3). Non-hostile, memory compacted to pinned entries |

**R4.4 Vacancies.** A perch empties by Chase Off, Humble, Recruit, promotion, demotion or retirement. Filling happens only in Night Shuffle step 2e, in this priority order:

1. **Captain perch empty**: promote the Tough with the highest `w_promo` (F7). A Tough who Routed Mikan in the last 5 days wins automatically.
2. **Tough perch empty**: (a) an exile whose `return_day` has come and whose home this is; (b) an untracked cat that earned tracking (R4.5); (c) at the start of a Life only, a Kit (R13.3); (d) a fresh generation.
3. Fresh generations and Kits are delayed: the perch stays visibly empty for `rng(1..2)` nights first, so the player sees the gap they made.
4. Floor: an unclaimed district never has fewer than 3 hostile perched Rivals at dawn; if it would, step 3's delay is skipped.

**R4.5 Earning tracking.** An untracked cat becomes a tracked Tough immediately (name-card generated on the spot) when it: Routs Mikan (canon); is the last enemy standing in a Posse wipe; Routs one of the player's Sentries in a live raid defence; or flees from the player twice (a Stray that keeps getting away). If no Tough perch is free it takes the perch of the Tough with the lowest arc score (F13) and zero player-caused Scars or Titles, who "fades into the crowd" (becomes untracked; Memory discarded). If every Tough has player history, the new cat waits as a Roamer above the cap for up to 3 nights (soft cap 6 Toughs), then replaces whoever is lowest.

**R4.6 The Boss perch.** Authored Bosses are not challenged or deposed off-screen while their district is unclaimed (Narrative's Life goals depend on them). Captains compete instead for **First Captain (new)**: the Captain with the most duel wins, who stands at the Boss's right in the Den fight. See Open Questions.

**R4.7 Claimed districts.** After `DistrictClaimed`: the Boss receives a Verdict like any Rival (R7.4); the Warden's portrait takes the Boss seat on the Fence Line; the Clowder becomes **Holdouts (new)**. Perches persist as data but hostile refills slow to 1 per 3 nights up to `holdout_cap` (3) hostile cats. A Holdout whose Grudge is at least 60 and who has the highest arc score in the district becomes its **Pretender (new)**, the only cat allowed to order raids there (R9.8). Claimed districts go quiet, never dead.

#### R5. Memory

**R5.1 Entry format.** `{day_index, life_index, phase, patch_id, event, other_ids[], outcome, verdict, finisher_id, finisher_move, damage_type, fear_id, flags[], salience}`.

**R5.2 Recorded events.**

| Event | Trigger (source) | Base salience |
|---|---|---|
| `FIRST_MEETING` | First `EncounterStarted` containing this Rival and Mikan | 60 (pinned) |
| `ROUTED_BY_POSSE` | `CatRouted` victim = this Rival, finisher in Posse. Flags: `by_mikan`, `by_pile_on`, `was_frazzled`, `ambushed`, `fear_exploited`, `witnessed(n)`, `clean` | 40 |
| `ROUTED_MIKAN` | `CatRouted` victim = Mikan, finisher = this Rival | 50 |
| `WIPED_POSSE` | `EncounterEnded` outcome = loss and this Rival is the designated victor (R7.3) | 70 |
| `VERDICT_RECEIVED` | `VerdictApplied` (stores which, and for Nose-Touch whether accepted) | 55 |
| `GLOATED` | Gloat performed on Mikan (stores which) | 45 |
| `PLAYER_FLED`, `RAN_HOME` | `EncounterEnded` outcome = player_fled (`RAN_HOME` if Mikan next enters Haru's House wall within 60 s) | 30 |
| `SLIPPED_AWAY` | `EncounterEnded` outcome = rival_fled | 35 |
| `SCATTERED` | Proposed outcome `scattered` (R7.5) | 30 |
| `FEAR_FOUND` | First `FearTriggered` for each Fear | 35 |
| `SCAR_GAINED`, `TITLE_GAINED`, `STRENGTH_GAINED`, `FEAR_CHANGED` | R6 (stores `source_cat_id`) | 50 (pinned while the Scar/Title exists) |
| `PATCH_LOST`, `PATCH_TAKEN` | `PatchChanged` on a Patch it kept / it now keeps | 30 |
| `RAID_WON`, `RAID_REPELLED` | `RaidResolved` (stores Sentry ids) | 30 |
| `EXILED`, `RETURNED` | State changes | 40 |
| `RANK_UP`, `RANK_DOWN` | `RivalRankChanged` (stores cause and the other cat) | 40 |
| `DUEL_WON`, `DUEL_LOST` | Off-screen or witnessed duel with another Rival | 20 |
| `SHARED_MORSEL`, `STARED_DOWN` | R7.2 Humbled interactions | 15 |
| `JOINED_CREW`, `TURNED_COAT`, `HELD_FIRM`, `LURED` | R9.6 | 60 (pinned) |
| `KIN_TOLD` | Kit creation: copy of the parent's top entry | 45 (pinned) |
| `LIFE_SKIP` | `LifeAdvanced` (stores what changed: greyer, promoted, retired parent) | 10 |

**R5.3 Capacity.** 16 entries per cat. When full, evict the unpinned entry with the lowest current salience (F12). `FIRST_MEETING`, the most recent encounter, and the source of every current Scar and Title are always pinned, so every visible mark can always be explained by a bark.

**R5.4 Crew cats have Memory too.** Each Crew cat (whatever its origin) accumulates `feuds[]` entries from `RaidResolved` and from `CatRouted` where it was finisher or victim. A Rival's feud with a Sentry reaching 75 makes that Rival the Sentry's own nemesis: it prefers that Sentry's Patch when choosing a raid target (R9.8), and the two exchange a line if they meet in a fight.

#### R6. How events change a Rival

**R6.1 Grudge.** Events add to an **encounter ledger** that is applied once, when the encounter closes (at `VerdictApplied`, or at `EncounterEnded` if there is no Verdict), through F2. Events outside encounters apply individually through F2.

| Event | Base Grudge `b` |
|---|---|
| Routed by the Posse | +10 |
| ...by Pile-On | +5 more |
| ...after one of its Fears was triggered in that fight | +5 (once per fight) |
| ...in a fight the player opened by Ambush | +3 |
| Mikan was Routed during a fight the Posse still won | −5 ("got my lick in") |
| Verdict: Chase Off | +15 |
| Verdict: Humble | +20 |
| Verdict: Recruit | Grudge is halved after the ledger is applied |
| Verdict: Nose-Touch | Accepted: set to 0. Snubbed: halved |
| Fled from the player (`SLIPPED_AWAY`) | +8 |
| Scattered | +5 |
| Beat the player (`WIPED_POSSE`) | +5 ("got a taste for it") |
| Player fled | 0 |
| Its kept Patch was taken by the player | +8 |
| Its raid was repelled by a Sentry | +4 toward Mikan, +10 on its feud with that Sentry |
| A Littermate was Humbled or Chased Off | +12 |
| Any Clowder-mate was Humbled at a fight it witnessed | +5 |
| Stewing in exile | +2 per night away, max +10, not multiplied |
| Humbled Simmer | F3, nightly |
| Share a Morsel | −8 (−16 Glutton) |
| Stare Down | +3, and no Simmer tonight |
| Quiet nights | F3 decay |

Grudge tiers: **Cool** 0–24, **Sore** 25–49, **Bitter** 50–74, **Nemesis** 75–100. A Rival becomes a Nemesis at 75 and stops being one only below 60 (hysteresis), emitting the proposed `NemesisStatusChanged`.

**R6.2 Regard (new).** 0–100: how much the Rival respects Mikan as a cat. It is the second axis that Mordor-style systems do not have and that a face-based society needs. Positive deltas are multiplied by `m_r`; negative deltas are not.

| Event | Base Regard |
|---|---|
| Routed in a **clean** fight (no player Ambush, none of its Fears triggered) | +8 |
| Routed after a Fear was triggered | −3 |
| Routed in a fight opened by player Ambush | −3 |
| Verdict: Humble | −5 |
| Verdict: Recruit | +10 |
| Verdict: Nose-Touch | Accepted +25, Snubbed +5 |
| Beat the player | −10 (Stalwart: +10 instead) |
| Player fled | −8 |
| Scattered | +5 |
| Player defended a Patch in person against its raid (Caterwaul answered) | +6 |
| Share a Morsel | +4 |
| Mikan's Clout rank rose | +3 to every tracked Rival |
| Player won a Clean Duel (R8.4) | +10; lost one: +5 |

Regard tiers: **Scorn** 0–24, **Wary** 25–49, **Respect** 50–74, **Esteem** 75–100.

**R6.3 Disposition.** Grudge and Regard together decide how a Rival conducts itself.

| | Regard < 50 | Regard ≥ 50 |
|---|---|---|
| **Grudge ≥ 75** | **Nemesis, dirty conduct**: Ambushes, raids, Gloats, Wall Watch | **Nemesis, clean conduct**: never Ambushes; calls Mikan out (R8.4); brings no more cats than the Posse has |
| **Grudge 25–74** | Hostile by Clowder duty; opportunist | Hostile by duty; opens with Standoff; will not raid a Patch Mikan personally defended in the last 3 days |
| **Grudge < 25** | Indifferent: fights only when Mikan enters its Patch | **Nodding Cat (new)**: non-hostile unless attacked. Tips the player off (R11.2), sits out its Boss's Den fight, may ask for a Clean Duel |

**R6.4 Scars.** Cosmetic, permanent, sourced. Awarded at encounter close when the Rival was Routed.

| Cause (from `CatRouted` and flags) | Scar pool (Art kit ids) |
|---|---|
| Finisher damage type Claw | Notched ear · sticking-plaster cross on the nose |
| Fang | Nicked ear-tip · missing fur tuft on the scruff |
| Thump | Bent whisker · lump with a plaster · crooked tail-tip |
| Yowl | One ear permanently flat · tail that never quite un-puffs |
| Routed after its Water Fear | Damp cowlick that never dries |
| Routed after any other Fear | Wide-eye (one eye permanently startled) |
| Pile-On | Dust-grey smudge · ruffled crest |
| Lost an off-screen duel | Any of the damage-type pools by the winner's Style |

Rules: chance per F9; the Scar stores `source_cat_id` and the event. At most 4 Scars are displayed (Art budget); a fifth replaces the oldest whose source is not Mikan. A Rival Routed twice by the player always has at least one player-sourced Scar (F9 guarantee), so history is always on the model by the third meeting. Crew cats receive Scars by the same rules from raids and lost fights. Whether Mikan can be Scarred is an Open Question.

**R6.5 Titles.** Earned, never generated (Captains may earn one in prehistory). A Rival keeps up to 3 in `titles_earned[]` and displays one: the most recent, except that a **glory** Title earned from Mikan outranks any **shame** Title for display. Other cats' barks may still use the shame Title. Name-card format: `{name} {title}`, title at most 16 characters.

| Kind | Title (placeholder wording; Narrative owns) | Earned when |
|---|---|---|
| Shame | the Soggy | Routed after its Water Fear was triggered |
| Shame | Cucumber-Shy / Broom-Shy / Jumpy | Routed after that Fear (Cucumbers / Brooms / Loud Noise) |
| Shame | Notch-Ear, Bent-Whisker, Plaster-Nose | Gained that Scar from Mikan as finisher, and has no Title yet |
| Shame | Dust-Eater | Routed by Pile-On twice |
| Shame | Twice-Chased / Thrice-Chased | Chased Off 2 / 3 times |
| Shame | Tail-First | Fled from the player twice |
| Shame | the Humbled | Humbled for 10 nights without rising |
| Glory | Bell-Ringer | Beat the player; Gloat = Swat the Bell |
| Glory | Collar-Biter | Beat the player; finisher damage type Fang |
| Glory | Morsel-Thief | Beat the player; Gloat = Snatch |
| Glory | Post-Stealer | Beat the player; Gloat = Mark Over. Or retook a Patch by raid |
| Glory | Bell-Stopper | Beat the player; Gloat = Turn Away |
| Glory | the Lucky | Beat the player; Gloat = Bolt |
| Glory | Boss-Tripper | Beat the player while Mikan's Clout is Boss or higher (replaces the above) |
| Glory | Sentry-Scatterer | Routed 3 Sentries across raids |
| Glory | Wall-Climber | Promoted twice |
| Glory | the Unbudged | Kept one Patch for 10 nights against at least one attempt |
| Tie | the Nodding | Became a Nodding Cat |
| Tie | the Turncoat / Twice-Turned | Turned coat once / twice |
| Tie | the Faithful | Held Firm in a Lure or a Life 8 Loyalty Test |
| Tie | Kit of {parent} | Generated as a Kit (until it earns its own) |
| Tie | the Pretender, the Usurper | Holds that role (R4.7, R13.5) |

One Title per encounter at most. If several qualify, priority is Glory-from-Mikan > Fear shame > Scar shame > count shame.

**R6.6 Fears.** Nemesis decides who has which and when one is gained, deepened or lost. Combat decides what a triggered Fear does (brief: the cat becomes Ruffled) and which props or Moves count as a source.

| Fear | Gen weight | Typical source (proposal to Combat/Level) | Slice? |
|---|---|---|---|
| Water | 16 | Bucket, watering can, sprinkler, hose, harbour spray | Yes |
| Loud Noise | 16 | Scooter horn, dropped pan, shrine bell, train | Yes |
| Being Outnumbered | 12 | Enemy side has fewer standing cats than the Posse | Yes |
| Dogs | 10 | The chained dog set-piece; a bark from behind a gate | |
| Cucumbers | 8 | Greengrocer crates, garden plots | Yes |
| Brooms | 8 | Shopkeeper sweeps; a leaning broom knocked over | Yes |
| Vacuum | 8 | Open house or inn doors by day | |
| Heights | 6 | Fighting on the High Road; being knocked onto it | |
| Own Reflection | 6 | Shop glass, puddles, a propped mirror | |
| Humans Underfoot | 6 | Any human hazard entering the ring (Morning/Day) | |
| Citrus | 4 | Peel piles, fruit crates. (Mikan is named after one. Barks may use this.) | |
| **The Bell** (gained only) | — | Mikan's own collar bell: triggered when Mikan lands the fight's first hit | |
| **The Carrier** (gained only) | — | A pet carrier prop. Only for a discovered Secret Collar | |

Gaining and changing Fears:
- **The Bell** is gained when `routs_by_player` reaches 3 with Mikan as finisher at least twice (2 and 1 for a Fraidy). It is this system's "fear of the player", worn on Mikan's neck.
- **Being Outnumbered** is gained when `pile_ons` reaches 2, if the Rival has fewer than 3 Fears.
- **Escalation**: when the same Fear has been triggered in 2 separate fights that the Rival lost, roll once: **Overcome** (the Fear is removed and the Strength *Got Over It* is gained for that source) or **Dread** (the Fear deepens: proposal to Combat that Ruffled lasts longer, and the Rival's flee threshold becomes 25% while the source is active). Overcome chance: Stalwart 80%, Braggart 50%, Brooder 50%, Schemer 50%, Goofball 40%, Fraidy 20%.
- Maximum 3 Fears.

**R6.7 Strengths.** Nemesis proposes the effect; Combat owns every number.

| Strength | Proposed effect | How it is obtained |
|---|---|---|
| Thick Fur / Tough Scruff / Low Loaf / Deaf Ear | Resists Claw / Fang / Thump / Yowl (resist, never immunity) | Generation (weight 2 for the Style's natural counter); **adaptation**: Routed twice with that damage type as finisher |
| Wriggler | Frazzled lasts shorter on it; first Pile-On of a fight does reduced damage | Adaptation: `pile_ons` ≥ 2 |
| Roof-Wise | Not Ruffled by an Ambush | Adaptation: `ambushed_by_player` ≥ 2; Roof-Walker quirk at generation |
| Got Over It ({fear}) | That source no longer Ruffles it | Fear escalation: Overcome |
| Grudge Fuel | Deals more to Mikan specifically, scaling with Grudge tier | Comeback pool: Braggart, Brooder |
| Bell-Hunter | Its AI prefers Mikan as target; faster Zoomies gain when hitting Mikan | Comeback pool: Brooder, Schemer; awarded with any Glory Title from Mikan if the Rival has room |
| Pack Caller | Calls 1–2 Hangers-on once per fight (within Combat's 10-cat cap) | Generation (Captains); comeback pool: Schemer, Fraidy |
| Second Wind | Once per fight, recovers a slice of Nerve when first Frazzled | Generation; comeback pool: Stalwart, Goofball |
| Home Turf | Stronger on its own kept Patch | Generation; gained with the Title "the Unbudged" |
| Night Eyes | Stronger at Night | Generation (Night Owl, Lantern Eyes) |
| Rain Cat | Stronger when wet or near water; can never have Fear of Water | Generation (Salt Paws) |
| Sentry-Breaker | Proposal to Territory: bonus in raid resolution | Gained with the Title "Sentry-Scatterer" |
| Street-Smart | Ignores bait and distraction props | Generation (Schemer, Trickster) |

Adaptation rules (the Rival "adapts to how you beat them"):
1. Adaptation is evaluated only on **comeback** (return from exile), on **promotion**, and at a **Life transition**. Never mid-fight, never the same night as the triggering Rout.
2. One adaptation per evaluation. Priority: damage-type resist → Wriggler → Roof-Wise → temperament comeback pool (uniform random).
3. Maximum 5 Strengths (Boss 6). At the cap, a new adaptation replaces the oldest generated (non-adapted) Strength.
4. **Always a Way In (invariant).** At every moment each Rival has at least one un-overcome Fear, or at least 2 of the 4 damage types unresisted. An adaptation that would break this is skipped and the next in priority is tried.
5. Every adaptation is announced: the Rival's next Standoff bark must be drawn from the `ADAPTED` trigger (R10), and the new Strength is revealed on the Fence Line at once. The player is never ambushed by an invisible rule change.

#### R7. Encounter outcomes and Verdicts

**R7.1 Which cats get a Verdict.** Only tracked Rivals. When the Posse wins, each Routed tracked Rival is held in place (flattened in the settling dust) and the Verdict prompt opens for them one at a time, highest rank first. The clock is paused (menu rule). There is no timer and no default. Untracked cats bolt; Strays may trigger Crew's recruitment flow, which is not a Verdict.

**The tell.** Before choosing, the player sees the Routed cat's body language, which honestly signals how it will take each Verdict: ears (Nose-Touch acceptance band from F10), tail (flee/uprising risk: lashing = Brooder/Braggart with Grudge ≥ 50), eyes on food (Glutton). A cat can be read; that is the skill.

**R7.2 The four Verdicts (player wins).**

| Verdict | Available when | Immediate result | State after | What comes back |
|---|---|---|---|---|
| **Chase Off** | Always | Leaves the district in a dust trail. Perch and any kept Patch vacated. Ledger +15 Grudge | `Exiled` | Returns after F5 nights, level up (F8), +2 Grudge per night away, one adaptation (R6.7). Destination R9.3. Third Chase Off of the same cat triggers its breaking point (R12.5) |
| **Humble** | The player holds at least one Patch in that district | Stays as a tribute-paying resident of the Patch where the fight happened (or the nearest player-held Patch in the district). Perch vacated, `former_rank` stored. Ledger +20 Grudge, −5 Regard | `Humbled` | Pays (Economy sets the amount). Simmers nightly (F3). Gossips (R11.2). May become Restless and rise (F14). One interaction per day when visited: **Share a Morsel** (cost set by Economy; −8 Grudge, +4 Regard) or **Stare Down** (+3 Grudge, no Simmer tonight). If the Patch already has a resident, the old one is **Turfed Out**: treated as a Chase Off with comeback delay 2 and +10 Grudge |
| **Recruit** | Grudge (after ledger) below 90, or Regard ≥ 50, or it is a Grand Standoff (R12.5). Crew has room. Economy's offering paid | Joins the Crew with Memory, Scars, Title, Fears, Strengths and `rival{}` intact. Grudge halved, +10 Regard. Reveals intel (R11.2). `honeymoon_until_day` = today + 3 | `Crew` | Loyalty is Crew's (this doc proposes the starting value, F18). Can be Lured, can Waver, can turn coat (R9.6), can Hold Firm |
| **Nose-Touch** | Always | Mikan offers a nose. The Rival **accepts** (F10): Grudge 0, +25 Regard, keeps rank and perch, `truce_until_day` = today + 5. Or **snubs**: Grudge halved, +5 Regard, no truce; the next Nose-Touch offered to it gets +0.25. Either way the player forgoes this Rival's loot and Clout (Economy) | `Perched` (unchanged) | Accepted with Regard ≥ 50 and Grudge < 25: a Nodding Cat. Otherwise a calmer enemy |

Patch control is independent of the Verdict: if the fight was for a Patch and the Posse won, the player may Spray it whatever they chose. A Nose-Touched or Humbled Keeper simply no longer keeps it.

**R7.3 When the player loses: promotion and the Gloat.** On `EncounterEnded` outcome = loss (Posse wipe), the brief's canon applies: Mikan slinks home, the day ends, 20% of carried Morsels are lost, and the victor is promoted and gains a Title at Mikan's expense.

1. **Victor** = the cat that Routed Mikan if it is still standing; otherwise the highest-ranked standing tracked Rival; otherwise the standing untracked cat that dealt the last Rout, which becomes tracked on the spot (R4.5). Exactly one victor per loss.
2. **Promotion.** Untracked → Tough. Tough → Captain: into a vacancy if there is one, otherwise it displaces the Captain with the lower `w_promo`, who is demoted to Tough and opens a feud at 30 with the victor (the player's loss starts a quarrel on the wall). Captain → First Captain. A Boss cannot be promoted. Every victor also gains levels (F8).
3. **Gloat (new).** The victor performs its temperament's Gloat. It is shown in 3 seconds or less on the loss screen and is the only place a loss is narrated.

| Gloat | Who | Effect |
|---|---|---|
| Swat the Bell | Braggart, Goofball | Bats Mikan's bell and struts. Title: Bell-Ringer |
| Snatch | Schemer; any Glutton | Carries off the Morsels Mikan lost: stored in `loot_held`. Proposal to Economy: Routing this Rival later returns them. Title: Morsel-Thief |
| Mark Over | Brooder | Emits `RaidRequested` (motive `gloat`) on the player-held Patch nearest the fight, resolved by Territory tonight. Title: Post-Stealer |
| Turn Away | Stalwart | Sits, waits for Mikan to get up, leaves. Regard +10 instead of −10. Title: Bell-Stopper |
| Bolt | Fraidy | Cannot believe it; runs. Title: the Lucky |

4. Ledger: +5 Grudge, −10 Regard (except Turn Away). `loss_streak` +1 on that Rival (R12.4).

**R7.4 Bosses.** Authored Bosses use the same Memory, Scar, Title, Grudge and Regard rules. Differences: their Fear is hidden until earned (R11.2); they do not flee; after their Den fight all four Verdicts are offered, but Recruit additionally requires Regard ≥ 50. A Chased-Off Boss returns as that district's Pretender. Botan's Verdict options are an Open Question for Narrative.

**R7.5 The full outcome matrix.** Ledger values are base values before F2/F4 multipliers. "Rout items" = the R6.1/R6.2 rows for how the Rout happened.

| # | Outcome | Choice | Grudge base | Regard base | Rank, perch, Patch | Scar / Title | Follow-up |
|---|---|---|---|---|---|---|---|
| 1 | Win | Chase Off | Rout items +15 | Rout items | Perch and Patch vacated | F9; Twice/Thrice-Chased | Exile and comeback |
| 2 | Win | Humble | Rout items +20 | Rout items −5 | Perch vacated; resident | F9; the Humbled after 10 nights | Tribute, Simmer, gossip, possible rising |
| 3 | Win | Recruit | Rout items, then halved | Rout items +10 | Perch vacated; joins Crew | F9 | Intel dump; Loyalty story |
| 4 | Win | Nose-Touch, accepted | Set to 0 | Rout items +25 | Unchanged; 5-day truce | F9 (a Scar is still a Scar) | Possible Nodding Cat |
| 5 | Win | Nose-Touch, snubbed | Rout items, then halved | Rout items +5 | Unchanged | F9 | Next offer +0.25 |
| 6 | Win, but Mikan was Routed | Any of 1–5 | As chosen, −5 | As chosen | As chosen | As chosen | Bark flag `mikan_carried` ("your crew carried you") |
| 7 | Loss | (Rival's Gloat) | +5 | −10 (Turn Away +10) | Victor promoted, levels up | Glory Title, always | Loss streak rules; Morsels may be held |
| 8 | Player fled | — | 0 | −8 | None | Third time: all cats present may use the `YOU_FLED` barks; no Title is taken from Mikan | Fleeing is always allowed and never promotes anyone |
| 9 | Player fled into Haru's House | — | 0 | −8 | None | — | `RAN_HOME` flag; unlocks curfew taunts (R13.2) and may queue a Wall Watch |
| 10 | Rival fled | — | +8 | 0 | None | Scar at 50% if it left below 30% Nerve; second time: Tail-First | It cannot flee from the player in its next encounter |
| 11 | Scattered (a human hazard broke the fight up) | — | +5 | +5 | None | — | `unfinished` flag: the director schedules a rematch within 2 days |
| 12 | Raid defended in person (Caterwaul answered), Posse wins | Verdict as 1–5 | As chosen | As chosen +6 | As chosen | As chosen | The Sentry on that Patch also gains a feud entry |
| 13 | Raid resolved off-screen, raiders win | — | 0 | −3 | Lead raider becomes Keeper | Post-Stealer on a second success | Feud +10 with each Routed Sentry |
| 14 | Raid resolved off-screen, Sentries win | — | +4 | 0 | None | Sentry may Scar the raider (F9 at base) | Feud +10 toward that Sentry; `rest_until_day` = +2 |
| 15 | Clean Duel (R8.4), player wins / loses | No Verdict | 0 / 0 | +10 / +5 | None; no promotion on a Clean Duel loss | None | Proposal to Economy: 1 Shiny on a first win |
| 16 | Grand Standoff (R12.5), player wins | Any Verdict | Arc resolved: see R12.5 | | | | |

Row 8 note: brief canon says losing promotes the victor; fleeing is deliberately not losing. Fleeing costs face (Regard), never rank.

#### R8. Rivals in the world

**R8.1 Presence.** A Rival is in the world only during its `active_phases` and only where its `intent` puts it (R9.8): Keepers at their Patch, Roamers on the district's patrol paths (Level Design supplies paths), exiles nowhere, Humbled cats at their Patch, Old-Timers at a fixed sunny spot. Its footprints and marks show in Whisker Sense in its Clowder colour.

**R8.2 Standoff card.** At `EncounterStarted` with opener `standoff`, Nemesis supplies: name, displayed Title, rank, known Scars, sting seed, and one bark chosen by R10. First sight: 2–4 s (canon). Later: skippable.

**R8.3 Ambush by a Rival.** A Rival with intent `hunt` may Ambush Mikan while roaming, under F15 and all of these conditions: budget available (1 per day; 2 in Life 8); the Posse's average Nerve is at least 50%; at least 90 s since the last encounter ended; Mikan is more than 40 m from Haru's House wall, not napping, and not in the drowsy walk-home state; it is not Life 1. **The warning is mandatory**: the Rival's yowl-sting plays from its direction 2.0 s before contact and its trail appears in Whisker Sense. Proposal to Combat: if the player faces the attacker (or reaches the High Road) inside that window, the opener is downgraded from `ambush_by_rival` to `standoff` ("Heard You Coming"), and the bark comes from the `AMBUSH_FOILED` trigger.

**R8.4 Clean Duel (new).** A Nemesis with clean conduct, or a Nodding Cat with Regard ≥ 70, issues a call-out instead of Ambushing: a mark on the gatepost outside Haru's wall, reported in the Morning Sniff with place and phase. If the player attends, the Rival brings no more cats than the Posse, opens with a Standoff, and the result follows matrix row 15. If the player does not attend within 2 days: −5 Regard, no other penalty.

**R8.5 Spats (new): Rival against Rival, in view.** Each rank duel rolled for tonight (R9.4) is pre-scheduled as a Spat at a place and phase of the coming day. If the player comes across it they may:

| Player choice | Result |
|---|---|
| Watch (from the High Road or 8 m away) | The pre-rolled result plays out as a 6–10 s scuffle. The player gains one intel fact on each cat |
| Wade in, no side | A three-way fight; both cats treat the Posse as the enemy. Normal outcomes for each |
| Back one of them (interact with it first) | That cat fights beside the Posse for this encounter (Combat: counts toward the 10-cat cap, AI ally). It gains +15 Regard; the other gains +10 Grudge and a feud +20 with the cat the player backed. If the backed cat's opponent is Routed, the backed cat wins the duel |
| Never arrives | The pre-rolled result is applied in tonight's step 2d |

**R8.6 Crashers.** A dirty-conduct Nemesis with intent `hunt` may join a fight in progress instead of Ambushing, only if: the fight has run less than 30 s, it contains no Boss, the combatant count is 8 or fewer, and no crash has happened today. Its sting plays first. It counts as the day's Ambush.

**R8.7 Escorts and requests to Combat.** Nemesis names which tracked Rivals take part in an encounter (the Keeper; a Shadow with its bonded cat; Littermates within 30 m; both non-Nodding Captains at a Den fight). Combat fills the rest with Hangers-on and enforces group size and the 10-cat cap. A Nodding Captain does not attend its Boss's Den fight.

#### R9. The Night Shuffle, step 2 (off-screen simulation)

Canon order is fixed by the brief: step 1 Territory, **step 2 Nemesis**, step 3 Economy, step 4 Narrative. Step 2 is deterministic: `rng = seeded(hash(save_seed, day_index))`, districts processed in ascending id, cats in ascending id. Only unlocked districts simulate. Sub-steps:

**2a. Take in step 1.** For each `RaidResolved`: write Memory and feuds for raiders and Sentries (matrix rows 13–14); set new Keepers.

**2b. Drift.** Apply F3 to every tracked non-Crew Rival (decay, Simmer, exile stewing). Update Nemesis status with hysteresis. Expire truces and rests.

**2c. Returns.** Each exile with `return_day ≤ today` returns: apply F8 and one adaptation; choose destination (R9.3); set intent bias toward `hunt`. A return is always reported in the Morning Sniff.

**2d. Duels.** Per district, with probability `p_duel` (0.35) one rank duel happens tonight unless it was already settled as a Spat. Challenger = weighted pick by F7 among eligible Rivals; target = the cat directly above it with whom it has the highest feud (ties: lower level). Resolve by F6. Challenger wins: the two swap rank (and Patch if both keep one); `RivalRankChanged` with cause `duel`; loser gets a Scar at F9 base chance, feud +20, `rest_until_day` = +3. Challenger loses: feud +10, rest +3. Independently, with probability 0.5, one **scuffle** between the two perched cats with the highest mutual feud changes no rank and adds a feud +10 and a Memory entry (colour for barks). Limit: at most 1 rank change per district per night from duels (2 in Life 8).

**2e. Vacancies.** R4.4.

**2f. The Crew.** For each ex-Rival in the Crew, in order: Lure → Wavering → Turncoat (R9.6).

**2g. The Undermark.** For each Humbled resident: Restless and Uprising (R9.7).

**2h. Intents.** Every hostile Rival chooses tomorrow's intent (R9.8). Raid intents are fixed now and resolved tomorrow, which is what makes them discoverable in advance.

**2i. Director.** Apply R12 limits and guarantees; this step may veto or add, never rewrite history already rolled.

**2j. Report.** Emit events; compile up to 5 Morning Sniff items for UX, by priority: Turncoat > Patch lost to a named Rival > return from exile > Uprising/Restless warning > rank change involving a Rival the player has met > Wavering warning > Clean Duel call-out > gossip (R11.2) > other rank changes.

**R9.3 Where an exile returns.** (1) If it is the arc lead (R12.2) or its Grudge is 50 or more, with probability 0.4 (arc lead: always) it has "moved uphill": it joins the Clowder of the highest unlocked, unclaimed district as a Tough, taking a vacancy or the R4.5 replacement rule. A Nemesis follows the player to the frontier. (2) Otherwise it returns to its home district: to a free perch of its old rank or lower, or as a Holdout if the district is claimed. (3) If the Away list is full when a Chase Off happens, the longest-away exile returns tonight regardless of timer.

**R9.6 Ex-Rivals in the Crew: Lure, Waver, Turncoat, Hold Firm.** Applies to Crew cats with `origin` other than Stray recruitment (see Open Questions for whether Stray recruits should ever be eligible). Nemesis reads `Loyalty(cat_id)` from Crew; it never writes it.

1. **Lure.** If the cat's old Clowder still has a hostile Captain or Boss and the cat has not been Lured in 5 days, with probability 0.15 per night it is approached. Loyalty ≥ 60: it **Holds Firm** (Memory `HELD_FIRM`; Morning Sniff item; proposal to Crew: Loyalty input event). Loyalty 30–59: nothing visible; Memory `LURED`. Loyalty < 30: counts as one extra night of Wavering.
2. **Wavering (new).** A cat whose Loyalty is below 30 at step 2f enters `Wavering` and `wavering_since_day` is set. Wavering is always visible the next morning: a sour-scent icon on its portrait in the Morning Sniff; at the Lot or its post it sits facing away with a flicking tail; its barks come from the `WAVERING` trigger. Loyalty back at 30 or above clears it.
3. **Turncoat check.** Eligible only if: Wavering for at least 2 full days (so the player has seen two warnings); `honeymoon_until_day` has passed; the Life's Turncoat budget is not spent (R12.3); the player did not lose a fight today; the cat was not in the Posse for any encounter today (a cat fighting beside Mikan today does not leave tonight). Roll F11.
4. **Turning coat.** Emit `BetrayalTriggered {crew_id, new_clowder}` with proposed extra field `patch_id` if it was a Sentry or Warden (Territory vacates the post and decides what happens to the Scent; this doc requests that the Patch flips to `new_clowder`). `new_clowder` = its old Clowder if that district is unclaimed, else the Holdouts of the district where it was posted. It takes a vacant Captain perch if it was ever a Captain, else a Tough perch (R4.5 rule). It keeps every Move and Knack it was taught. Grudge = max(current, 60). Title: the Turncoat. Memory `TURNED_COAT`.
5. **Re-recruiting** a Turncoat requires Regard ≥ 60. A second turning is allowed (Title: Twice-Turned); a third is not: after a second re-recruit the cat is exempt.
6. **Dismissal.** If the player dismisses a Crew cat (Crew's flow), Nemesis treats it as a Chase Off Verdict with no Rout items.

**R9.7 Humbled residents: Restless and Uprising.** A resident with Grudge ≥ 70 at step 2g becomes `Restless` (visible: lashing tail, `RESTLESS` barks, Morning Sniff warning). From the night after it has been Restless for a full day, roll F14. On success emit `RaidRequested {attacker_ids:[it, plus up to 2 Hangers-on], patch_id: its own Patch, motive: uprising}`, resolved by Territory tomorrow night (or live as a Caterwaul if the player is out at Night). Success: it becomes Keeper, hostile, regains `former_rank` if a perch is free, Title Post-Stealer. Failure: it stays Humbled, Grudge −20, no further Uprising for 5 nights. A second failed Uprising makes it **Settled**: it never Simmers or rises again outside Life 8. Grudge falling below 60 ends Restless.

**R9.8 Intent.** Chosen at step 2h for the coming day, by weight; unavailable intents have weight 0.

| Intent | Meaning | Requires | Base weight |
|---|---|---|---|
| `hold` | At its Patch all day | Is a Keeper | 5 (Loaf: always) |
| `prowl` | Walks the patrol paths; Standoff if it meets Mikan | Perched | 4 |
| `lie_low` | Not in the world | Routed by the player today, or resting | forced |
| `hunt` | Seeks an Ambush or crash (R8.3, R8.6) | Grudge ≥ 50, dirty conduct, no truce | 1 + Grudge/25 |
| `call_out` | Clean Duel (R8.4) | Clean-conduct Nemesis, or Nodding Cat with Regard ≥ 70, none in the last 6 days | 3 |
| `raid` | `RaidRequested` on a player Patch tomorrow night | Under orders, or Grudge ≥ 40. District raid cap not reached | 2 + Grudge/50 |
| `challenge` | Marks it as a preferred challenger tomorrow night | Not resting | Ambition `A` × 2 |
| `wall_watch` | R13.2 | R13.2 | director only |

Raid requests are capped at 1 per district per night and 2 town-wide (4 in Life 8), never on a Patch the player took that same day, none in Life 1. Motives: `boss_orders` (a Boss whose district the player has entered orders one raid every 3 nights against the player's Patches in it), `grudge` (target: the Patch it used to keep, else the Patch guarded by the Sentry it feuds with most, else the player Patch with the lowest Scent), `gloat`, `uprising`, `pretender`.

#### R10. Barks and taunts

Cats speak readable text (brief §5.5): short balloons over vocalisations, 60 characters or fewer **after** slot substitution. Nemesis owns the trigger taxonomy, the tags, the slots and the selection rule. Narrative owns every word. The example lines below are placeholders that show the grammar working.

**R10.1 Template record.** `{id, trigger, requires[tags], forbids[tags], temperament (or any), text, short_text}`.

**R10.2 Triggers.**

| Group | Triggers |
|---|---|
| Standoff | `STANDOFF_FIRST`, `REMATCH_I_LOST`, `REMATCH_I_WON`, `REMATCH_YOU_FLED`, `REMATCH_I_FLED`, `REMATCH_UNFINISHED`, `ADAPTED`, `RETURNED_FROM_EXILE`, `PROMOTED_SINCE`, `DEMOTED_SINCE`, `LIFE_SKIP_REUNION`, `KIN_INTRO`, `CREW_SPOTTED`, `CALL_OUT`, `GRAND_STANDOFF` |
| Fight | `AMBUSH_OPEN`, `AMBUSH_FOILED`, `CRASH_IN`, `FEAR_HIT`, `LOW_NERVE`, `FLEEING`, `ROUTED`, `ALLY_ROUTED` |
| After | `GLOAT_*` (one per Gloat), `VERDICT_REACT_CHASE`, `_HUMBLE`, `_RECRUIT`, `_NOSE_ACCEPT`, `_NOSE_SNUB` |
| World | `IDLE_GOSSIP`, `HUMBLED_IDLE`, `RESTLESS`, `NODDING_GREET`, `OLD_TIMER`, `SPAT_LINE`, `CURFEW`, `CALL_HEARD`, `WALL_WATCH` |
| Crew | `WAVERING`, `HELD_FIRM`, `TURNCOAT_REVEAL`, `CREW_MEMORY` (an ex-Rival at the Lot recalling its past with Mikan), `LAST_WALK` |

**R10.3 Tags** (conditions a template may require or forbid).

| Family | Tags |
|---|---|
| Memory (weight 3) | `last_verdict:<v>`, `last_finisher_move:<id>`, `last_damage:<type>`, `by_pile_on`, `fear_exploited:<fear>`, `ambushed`, `mikan_carried`, `ran_home`, `scar_from_mikan:<scar>`, `title_from_mikan`, `holds_loot`, `count_routs:<n>`, `count_losses:<n>` |
| Relationship (weight 2) | `grudge:<tier>`, `regard:<tier>`, `nemesis`, `clean`, `nodding`, `ex_crew`, `kin`, `feud_with:<present cat>`, `littermate_present` |
| Context (weight 1) | `phase:<p>`, `district:<d>`, `own_patch`, `rank:<r>`, `clout:<rank>`, `well_fed`, `life:<n>`, `mikan_age:<stage>`, `posse_size:<n>`, `witnesses` |
| Voice (weight 1) | `temperament:<t>`, `quirk:<q>` |

**R10.4 Slots.** Maximum rendered lengths are enforced by the tool that builds the bark table.

| Slot | Content | Max chars |
|---|---|---|
| `{mikan}` | The player's name for Mikan (proposal to UX: 8-character limit on renaming) | 8 |
| `{address}` | How this cat addresses Mikan (R10.6) | 16 |
| `{self_title}`, `{other_title}` | A Title | 16 |
| `{crew}`, `{other}` | A cat's name | 8 |
| `{patch}` | Short Patch name (Territory supplies a 16-character short form) | 16 |
| `{move}` | Move name (Combat supplies) | 16 |
| `{scar}`, `{fear}` | Noun phrase from the catalogue | 12 |
| `{when}` | Bucketed time since the cited Memory: "last night", "the other day", "ages ago", "when you were small" | 20 |

**R10.5 Selection.** Candidates = templates for the trigger whose `requires` all hold, whose `forbids` none hold, and whose temperament matches or is `any`. Score each by F16. Pick uniformly (seeded) among the top-scoring candidates. A Rival never repeats a line it has said to the player before while an unused candidate exists; a line used by any cat in the last 10 barks is penalised. If the rendered line exceeds 60 characters, use `short_text`; if that also fails, drop the candidate (and log it: this is a content bug). Every trigger has at least one untagged `any` line per temperament as a floor.

**R10.6 Address.** Default by Mikan's Clout rank (Economy owns the ranks): House Pet and Lane Cat → "Collar"; Known Face → "Bell"; Boss and Two-Street Boss → `{mikan}`; Big Whisker → "Big Whisker"; Great Boss → "Great Boss". Overrides: a dirty-conduct Nemesis says "Collar" at any Clout (spite); Regard ≥ 50 uses `{mikan}` from Known Face up; ex-Crew and current Crew say "Boss"; a discovered Secret Collar and Botan never say "Collar" again once exposed or Routed.

**R10.7 Hard content rules (Pillar 1 and tone, enforced by lint tags on every template).** No bark refers to a human event, a human's absence, illness or death, or explains anything a human does (brief §5.5 rule 5). Barks may refer to what a cat can perceive about Mikan: the collar, the bell, the bowl, smelling of a house, going home at Dusk, being called, getting fat, going grey, looking thin. No cruelty; insults are petty. In Life 8, Rivals notice only that Mikan has been away or looks thin, and react with opportunism or gruff kindness, never grief.

**R10.8 Example lines** (placeholder text, all at or under 60 characters at maximum slot length).

| Trigger | Requires | Temp. | Line |
|---|---|---|---|
| `STANDOFF_FIRST` | `clout:house_pet` | Braggart | Nice bell, Collar. Does it ring when you run? |
| `REMATCH_I_WON` | `count_losses:1+` | any | Still wearing that bell? I can hear you lose from here. |
| `REMATCH_I_LOST` | `last_verdict:chase_off` | Brooder | You chased me off {patch}. I walked back. |
| `REMATCH_I_LOST` | `fear_exploited:water`, `scar_from_mikan` | Braggart | I still smell like that bucket. You'll pay for it. |
| `REMATCH_I_FLED` | `count_routs:0` | Braggart | You got the post. I got away. Round two, Collar. |
| `ADAPTED` | strength Got Over It (water) | any | Go on, tip the bucket. I like the rain now. |
| `REMATCH_YOU_FLED` | `ran_home` | any | Run home to your bowl, Collar. I'll keep your post warm. |
| `PROMOTED_SINCE` | `feud_with` | Schemer | Captain now. {other} is licking a bent whisker. |
| `CREW_SPOTTED` | `ex_crew` of its Clowder present | Brooder | {crew}? You wear the bell's stink now? Shame on you. |
| `TURNCOAT_REVEAL` | `ex_crew` | Schemer | I know every trick you taught me, {address}. |
| `IDLE_GOSSIP` | knows another's Fear | Chirper quirk | {other} flinches at brooms. You didn't hear it from me. |
| `GLOAT_TURN_AWAY` | — | Stalwart | Good scrap. Come back when the bell means something. |
| `VERDICT_REACT_NOSE_SNUB` | — | Braggart | Keep your nose to yourself, Collar. |
| `ROUTED` | — | Goofball | Ow! Okay! Okay! I was leaving anyway! |
| `HUMBLED_IDLE` | `grudge:bitter` | Brooder | Your mark's on my post. I count the days. |
| `WAVERING` | assigned as Sentry | Schemer | Quiet post. Lots of time to think, Boss. |
| `CALL_HEARD` | `phase:dusk` | any | That's your human singing, Collar. Better trot. |
| `LIFE_SKIP_REUNION` | `life:2` | any | Look who grew into the bell. |
| `KIN_INTRO` | `kin`, parent `regard:respect+` | any | Dad says you fight fair. Show me. |
| `NODDING_GREET` | `life:8` | Stalwart | You look thin, Boss. Eat something. |

**R10.9 Volume targets.** Vertical slice: about 250 templates (every Standoff and After trigger × 6 temperaments × at least 2, plus tagged specials). Full vision: about 1,200. Pillar 4's design test says this is where the writing budget goes.

#### R11. Surfacing: intel and the Fence Line

**R11.1 What can be known.** Each Rival has an `intel` bitmask. An unknown Rival is a silhouette on its perch (canon).

| Fact | Revealed by |
|---|---|
| Look (coat, Scars) | Seeing it in the world or in a Spat; it appears on the Fence Line as "a cat with no name" |
| Identity (name, Title, rank, Clowder) | Any Standoff; any bark by or about it; Morning Sniff item naming it |
| Style and level | First fight; sniffing one of its marks |
| Temperament | Second encounter; any Verdict; gossip |
| Each Fear (per slot) | `FearTriggered` on it; gossip; an ex-Clowder-mate joining the Crew; watching it flinch in the world (a Rival with Fear of Water visibly avoids puddles: Level/Art hook) |
| Each Strength (per slot) | The Strength taking effect in a fight; adaptation announcement (R6.7 rule 5); gossip |
| Schedule and home Patch | Sniffing its mark twice on different days; following its trail in Whisker Sense to where it sleeps |
| Feuds and bonds | Watching a Spat; gossip; ex-Clowder-mate |
| Intent for today (expires at day end) | A Nodding Cat's tip; a Sentry with a feud against it; a Humbled resident with Grudge < 25 |
| Secret (Boss Fear; Secret Collar home) | Boss Fear: Recruit or Nose-Touch one of its Captains, or watch the Boss in the world during a scripted flinch (Narrative). Secret Collar: follow its trail at Dusk |

**R11.2 Sources (all cat-true; there is no interrogation verb).**

| Source | Rule |
|---|---|
| **Sniffing a mark** | Hold Whisker Sense at a rival Scent Post or a fresh trail: reveals one unknown fact about the cat that left it (order: identity, Style/level, schedule). Once per mark per day |
| **Gossip** | Each morning, each Humbled resident with Grudge < 50 and each Old-Timer contributes one fact about a Rival of its district to a pool; the Morning Sniff shows up to 2, preferring Rivals whose intent targets the player |
| **Recruits** | On joining, an ex-Rival reveals everything about every cat in its `feuds[]` and `bonds[]`, and its old Boss's schedule. If it was a Captain: the Boss's hidden Fear |
| **Nodding Cats** | When any cat of its Clowder has intent `raid` or `hunt` against the player, a Nodding Cat reveals that intent in the Morning Sniff (who, where, which phase). It does not warn about itself |
| **Sentries** | A Sentry reports the identity of every raider it saw; a Sentry with a feud ≥ 50 against a Rival reveals that Rival's intent when it is `raid` |
| **Overhearing** | `IDLE_GOSSIP` and `SPAT_LINE` barks in the world reveal the fact they state |

**R11.3 The Fence Line (data contract; UX owns the screen).** Per district, top to bottom: Boss seat (Boss, or the Warden once claimed), 2 Captain perches (First Captain on the Boss's right), 5 Tough perches, then the crate row below the wall (the Undermark, one crate per player-held Patch). Off to one side: pawprints leading away for each exile (count known, identity known only if the player Chased them Off), and a sunny ledge for Old-Timers. The player's own gatepost shows Crew ex-Rivals. Per cat Nemesis supplies: silhouette or coat, displayed Title, Scars, rank, state pose (sitting tall / flattened Humbled / turned away Wavering / empty perch), a **mood** in four steps for Grudge and four for Regard (never the raw numbers), known Fears and Strengths, feud glances (a hissing arc between two cats with mutual feud ≥ 50), today's intent if known, and a Memory strip: up to 5 highest-salience entries as icons with one line each. After each Night Shuffle the first opening of the screen animates the night's changes (cats hopping between perches), at most 5, in the 2j priority order.

#### R12. The pacing layer ("the director")

The simulation produces events; the director decides how many reach the player and guarantees the minimum. It has no fiction and is never visible. It can schedule, delay, veto and protect. It cannot change a rolled fight result, a Verdict, or Loyalty.

**R12.1 Daily budgets (from Life 2).**

| Budget | Value |
|---|---|
| Rivals with Memory of Mikan placed on the player's likely route (the patrol path nearest the player's frontier Patch), not forced | at least 1 per day |
| Forced Rival appearances (Ambush, crash, Wall Watch, Uprising raid answered live) | at most 2 per day |
| Ambush or crash | at most 1 per day (2 in Life 8); never by the same Rival two days running |
| Rivals allowed intent `hunt` at once, town-wide | 3 (the highest arc scores); the rest are banked, not forgotten |
| Bad-news items in one Morning Sniff (Turncoat, Patch lost, Uprising success) outside Life 8 | at most 2; the excess is postponed one night, never cancelled |
| Rank changes animated per district per morning | at most 1 from duels plus any caused by the player |

**R12.2 The arc lead and the First Thorn (the guarantee).**

1. **First Thorn (new).** The Keeper of the first Patch Mikan fights for in Life 1 is flagged `arc_role = seed`. It is a normal procedural Rival; only its first exit is staged: at 25% Nerve it bolts (a forced `rival_fled`, the system's one scripted outcome), teaching that Rivals come back. It returns within the first 2 days of Life 2 by Ambush, with a `REMATCH_I_FLED` bark. From then on it is fully systemic.
2. **Arc lead.** Each night the director computes F13 for every tracked non-Crew Rival. If none is flagged `lead` and the best score is at least 40, that Rival becomes `arc_role = lead`. A lead is: exempt from retirement and from fading into the crowd; level-floored (F8); always returns to the frontier (R9.3); first in line for `hunt` and `call_out`. There is one lead at a time. The lead flag is released when its arc resolves (R12.5 or a Recruit or an accepted Nose-Touch), after which the next candidate may rise.
3. **Checkpoint.** `NemesisArcAchieved` is true once any Rival has all of: 3 or more encounters with Mikan; at least one Scar or Title sourced from Mikan or the Crew; Nemesis status reached at least once, or resolution by Recruit or accepted Nose-Touch. Target: true for every player by the end of Life 2 (the vertical slice's question).
4. **Escalation if behind.** If on day 4 of Life 2 no Rival has F13 ≥ 40, the director takes the highest scorer and applies **Stewing**: +10 Grudge per night until Bitter, intent forced to `hunt` (or `call_out` if clean), `protected_until_day` = +5. The same check runs on day 3 of every later Life whenever there is no lead.

**R12.3 Hard limits (anti-frustration).**

- A Rival's level never exceeds Mikan's level + 3 (F8).
- Fleeing is always possible for the player and never promotes anyone. A Rival cannot flee from the player twice in a row.
- No Ambush in the Morning phase of the day after a Posse wipe.
- **Turncoat budget**: Life 1: none. Lives 2–7: at most 1 per Life, and the first one ever requires a Crew of at least 4. Life 8: by Loyalty Test only (R13.5). Life 9: none.
- A Turncoat needs two visible warning days (R9.6); an Uprising needs one (R9.7); a comeback is always in the Morning Sniff; a raid is always discoverable the day before (R9.8, R11.2).
- Always a Way In (R6.7).
- Arcs end (R12.5): no Rival can be a hunting Nemesis forever.

**R12.4 When a Rival keeps winning.** `loss_streak` counts consecutive player losses to the same Rival.

| Streak | Effect |
|---|---|
| 1 | Normal (matrix row 7) |
| 2 | **Overconfident**: all its Fears are revealed on the Fence Line; proposal to Combat: it spends the first 5 s of its next fight against Mikan taunting instead of attacking (a free opening). No further level gain from beating the player |
| 3 or more | It stops hunting (`hunt` weight 0): it considers the matter closed and waits at its Patch. A Nodding Cat or a Humbled resident with Grudge < 25, if one exists, gossips its schedule and one Strength. No further promotions or Titles from beating the player |

A win against it resets the streak.

**R12.5 Breaking points: how arcs end.** A Rival reaches its breaking point when it is a Nemesis and `routs_by_player` ≥ 3, or on its third Chase Off. This is checked when an encounter closes, after the Verdict. If that Verdict was Recruit or an accepted Nose-Touch, the arc is already resolved. If it left the Rival Perched or Exiled, its next appearance (after any return) is the breaking point below. If it left the Rival Humbled, the breaking point replaces its first Uprising: when it would rise, it calls Mikan out instead. What happens depends on temperament:

| Temperament | Breaking point |
|---|---|
| Fraidy | **Cowed.** Gains The Bell at Dread level. On seeing Mikan it flattens and the Verdict prompt opens with no fight. Arc resolved by that Verdict |
| All others | **Grand Standoff (new).** Announced in the Morning Sniff. The Rival waits at a district landmark (Level Design: one per district) at Dusk, every Dusk, until the player comes; it does nothing else meanwhile. Every perched Rival of the district watches from the High Road and counts as a witness. It brings escorts equal to Posse size − 1 |

Grand Standoff results. Player wins: every Verdict is available and each is final. Chase Off: it is **Gone Over the Hill**, removed from the simulation until Life 8 (it returns in the Reckoning if Regard < 25) or Life 9 (Last Walk). Humble: **Settled**, it never Simmers or rises outside Life 8. Recruit: allowed at any Grudge, with the `settled` bonus in F18. Nose-Touch: accepted automatically. Player loses: matrix row 7, then its Grudge is set to 50 and its `hunt` weight to 0; it has had its satisfaction and will be found, Titled and smug, at its Patch whenever the player wants it. In every case the arc is resolved and the lead flag released.

#### R13. Rivals and the owner story

**R13.1 What each Life switches on.**

| Life | Districts simulating | Nemesis features introduced | Notes |
|---|---|---|---|
| 1 The Box in the Rain | Hidamari Lane (prehistory done; only the first Patch's Keeper and 2 Roamers are active) | Standoff, Memory, first Verdict (or first loss and Gloat), First Thorn | No Ambush, raid, Night, Turncoat. Kitten Mikan: every address is "Collar" |
| 2 Uniform | Hidamari Lane | Everything in R1–R12 at district scale; Night Rivals after the cat flap; first raid; first possible Turncoat | Before the flap, no Lane Rival is Night-only |
| 3 The Empty Room | + Akane Arcade | Exiles moving uphill; cross-district feuds; first time-skip of years (first retirements possible from Life 4) | |
| 4 Two Pairs of Shoes | + Tsukimi Hill | Night-centred Clowder (Lantern Eyes); Pretenders in claimed districts | |
| 5 White Day | + Shiosai Harbour | First Kits may appear | |
| 6 The Small Loud One | + Kurogane Yard | — | |
| 7 The Long Summer | + Kasumi Heights | Botan; Secret Collar quirk common in Steam Court | Peak: the player should hold a town full of settled accounts |
| 8 The Door | All | The Reckoning (R13.5) | |
| 9 Nine | All | The Last Walk (R13.6) | Hostile intents limited to `call_out` aimed at the heir |

**R13.2 The double life.** Rules that tie Rivals to Mikan being a pet:

1. **Sanctuary.** No Rival, bark, Ambush or raid ever occurs inside Haru's wall (canon safe zone). No nemesis content plays during a home vignette; the Morning Sniff is read at the Doorstep after it. This is the street/home separation rule in system form.
2. **Running home counts.** Entering the wall within 60 s of fleeing sets `RAN_HOME` (matrix row 9): the Rival taunts about it next time.
3. **Wall Watch (new).** The morning after a dirty-conduct Nemesis beat Mikan or saw Mikan run home, the director may seat it on the lane wall opposite the gate. It cannot come in. It delivers one `WALL_WATCH` bark when Mikan reaches the Doorstep, then follows on the far side; a Standoff (never an Ambush) opens when Mikan passes 15 m beyond the wall. Leaving through the Lot avoids it. Once per Rival per Life; once per 5 days overall; never in Life 1, 8 or 9.
4. **Curfew.** When Mikan disengages from a Standoff range and heads for home during Dusk, any Rival within 20 m may deliver a `CURFEW` bark. No mechanical effect: the trade is already in the clock (brief §5.2).
5. **The Call.** If the Call is sung while a Rival is within 30 m and not in a fight, it delivers a `CALL_HEARD` bark. The system never makes the player answer.
6. **The bowl.** While Mikan has Well-Fed, the `well_fed` tag is set: barks may mock the smell of a full bowl. Rivals met at Night after the player skipped the evening bowl get the opposite tag.
7. **The collar.** Address rules R10.6. "Collar" fading from the town's mouth is the audible track of Clout.
8. **Secret Collars.** The quirk seeds Botan's hypocrisy in the procedural population long before Life 7.

**R13.3 Time-skips.** On `LifeAdvanced`, before the first morning of the new Life, run the **Time-skip Shuffle**:

1. All exiles return (R9.3).
2. Run `skip_nights` (5) compressed nights of steps 2b–2e; at most 3 rank changes per district in total.
3. Ageing: `lives_active` +1 for every tracked cat. At 3 or more, Art's grey-muzzle flag is set.
4. Retirement: each non-Boss, non-Nemesis, non-lead, non-Crew Rival with `lives_active` ≥ 3 retires with probability 0.20 (0.40 at 5 or more) to the Old-Timers: non-hostile, found on a sunny ledge, gossips, greets. Nobody dies; cats just stop bothering.
5. **Kits (new).** For each cat retired this skip, and with probability 0.25 for each other Rival with `lives_active` ≥ 3, generate a Kit into a Tough vacancy of the same district (at most 2 Kits per Life, from Life 5; a Rival has at most one Kit). The Kit inherits Build, Pattern and Palette (one of the three mutated), has the parent's temperament at 50%, a `parent` bond, a pinned `KIN_TOLD` Memory, and inherited feelings by F17.
6. Level growth (F8 skip term) and one adaptation evaluation per Rival.
7. Each surviving Rival gets a `LIFE_SKIP` Memory; its first Standoff in the new Life prefers `LIFE_SKIP_REUNION`.
8. The first Fence Line opening of the Life plays a "while you were away" reshuffle of at most 5 changes.

**R13.4 Hooks offered to Narrative, Audio and Economy (suggestions, not requirements).** Before the cat flap, the yowl-stings of Night Rivals can be heard from inside the house at night. A Humbled resident's mood can show in what it leaves on the Doorstep (Economy/Art). A Wall Watcher scatters if a human steps out of the gate ("humans are weather").

**R13.5 Life 8: the Reckoning.** Every debt comes due, in both directions. On `LifeAdvanced(8)` and for as long as Territory's Life 8 decay state is active:

| Rule | Detail |
|---|---|
| Returns | Every exile and every Gone-Over-the-Hill Rival with Regard < 25 returns at once |
| Grudges | F3 decay is off. Simmer is doubled. Settled residents may Simmer again |
| Pretenders | In every claimed district the non-Crew, non-Nodding cat with the highest F13 score and Grudge ≥ 50 becomes Pretender and takes the Boss seat's shadow (shown seated beside the Warden). Motive `pretender` raids are allowed |
| The Usurper | The Pretender with the highest F13 town-wide is **the Usurper (new)**: fought at Boss scale (brief: Boss Nerve ×12). Routing it ends the Reckoning's raid pressure. If Botan was Chased Off, whether Botan must be the Usurper is Narrative's call (Open Questions) |
| Loyalty Tests | Each Warden is tested once, deterministically, on the third night: Loyalty ≥ 50: **Holds Firm** (Title the Faithful; its district's raid requests are halved). 30–49: holds the Den, but one Patch in its district is conceded to the Pretender. Below 30: turns coat and becomes that district's Pretender. No dice: fifteen years of how the player treated this cat decide it |
| Gratitude | Each Nodding Cat, each Old-Timer with Regard ≥ 50, and each Humbled resident with Grudge < 25 and Regard ≥ 50 **keeps a post warm**: Nemesis sets the proposed flag `kept_by_friend` on its Patch, asking Territory to exempt that Patch from the tripled decay. Each greets Mikan on return with a `NODDING_GREET` bark |
| Limits | Budgets rise as noted (2 Ambushes per day, 4 raid requests per night, 2 duel rank changes). The bad-news cap is lifted: this is the one Life where the Morning Sniff is allowed to be grim on the street side |
| Tone | R10.7 holds without exception. The street does not know why Mikan was gone. It only knows the Boss was not on the wall |

The Reckoning does not add a fail state: what Territory lets fall can always be retaken, and the Usurper waits.

**R13.6 Life 9: the Last Walk.** As Mikan walks the six districts, every surviving Rival with player history (arc score ≥ 20), every Old-Timer and every Kit stands on the Fence Line route and gives one gesture, chosen from its final disposition: Regard ≥ 75: a nose-touch offered. Regard 50–74: a slow blink. Grudge ≥ 75 and Regard < 25: sits with its back turned. Otherwise: watches. Each may speak one `LAST_WALK` bark. Nemesis supplies Narrative with two epilogue candidates: **wall companion** (the non-Crew cat with the highest Regard + arc score, for "who sits on the wall with you") and **heir note** (whether the chosen heir is an ex-Rival, an ex-Nemesis, a Turncoat forgiven, or a Kit of an old enemy).

### States and Transitions

One `state` per tracked cat. Disposition (R6.3) and Nemesis status are overlays, not states.

| State | Entry condition | Exit condition | Behaviour |
|---|---|---|---|
| `Untracked` | Default for Strays and Hangers-on; a Tough that faded into the crowd | Earns tracking (R4.5) → `Perched` | No Memory, no Verdict |
| `Perched` | Generated; promoted from Untracked; returned; rose from Humbled; turned coat | Routed by Posse → `AwaitingVerdict`. Retirement → `OldTimer`. Fades → `Untracked` | Has a perch, an intent, simulates nightly |
| `AwaitingVerdict` | Routed in a fight the Posse won | Verdict → `Exiled` / `Humbled` / `Crew` / `Perched` | Held on screen; clock paused |
| `Exiled` | Chase Off; Turfed Out; dismissed from Crew | `return_day` reached, Away list overflow, or Life transition → `Perched` (or Holdout perch) | Not in the world; stews (+2 Grudge per night) |
| `Humbled` | Humble Verdict; failed Uprising | Grudge ≥ 70 → `Restless`. Displaced → `Exiled`. Player Recruits it by interaction (Crew's flow, Regard ≥ 50) → `Crew` | Resident; pays; gossips; Simmers |
| `Restless` | Humbled with Grudge ≥ 70 | Grudge < 60 → `Humbled`. Uprising succeeds → `Perched`. Fails → `Humbled` | Visible warning; rolls F14 after one full day |
| `Crew` | Recruit Verdict (or Crew's flows) | Loyalty < 30 at step 2f → `Wavering`. Dismissed → `Exiled` | Owned by Crew; Nemesis keeps `rival{}` and runs Lures |
| `Wavering` | Crew with Loyalty < 30 | Loyalty ≥ 30 → `Crew`. F11 succeeds → `Perched` (Turncoat) | Visible warning; eligible for Turncoat check after 2 days |
| `OldTimer` | Retirement at a time-skip | None (permanent; appears in the Last Walk) | Non-hostile; gossip source |
| `GoneOverTheHill` | Chase Off at a Grand Standoff | Life 8 (if Regard < 25) → `Perched`; Life 9 → Last Walk cameo | Removed from simulation |

Invalid transitions (must be rejected and logged): any state → deleted; `Crew` → `Humbled`; `OldTimer` → any hostile state; `AwaitingVerdict` persisting past the end of the encounter flow (if the game is interrupted, the Verdict prompt reopens on load before anything else).

### Interactions with Other Systems

**Events consumed** (names from brief §6.1)

| Event | From | Nemesis does |
|---|---|---|
| `EncounterStarted` | Combat | Opens the encounter ledger; `FIRST_MEETING`; picks Standoff/Ambush bark; counts witnesses; sets `ambushed` flags |
| `CatRouted` | Combat | Ledger rows; counters (`rout_types`, `pile_ons`); Scar cause; if victim is Mikan, records the candidate victor; if victim or finisher is Crew, updates feuds |
| `FearTriggered` | Combat | `FEAR_FOUND`; reveals the Fear; ledger rows; `fear_exploits` counter |
| `EncounterEnded` | Combat | Chooses the matrix row; opens Verdict flow or performs Gloat; applies ledger (F2, F4) |
| `RaidResolved` | Territory | Step 2a |
| `PatchChanged` | Territory | Keeper bookkeeping; `PATCH_LOST` / `PATCH_TAKEN` |
| `DistrictClaimed` | Territory | R4.7: Holdouts, Warden seat |
| `PhaseChanged`, `DayEnded`, `LifeAdvanced` | Clock | Presence by `active_phases`; Night Shuffle step 2; Time-skip Shuffle; Reckoning; Last Walk |
| `BondChanged` | Narrative | Not consumed. (`well_fed` is read from Combat's buff state) |

**Events emitted**

| Event | Payload | Notes |
|---|---|---|
| `VerdictApplied` | rival_id, verdict | Canon. Proposed extra fields: `accepted` (Nose-Touch), `patch_id` (Humble residence) |
| `RivalRankChanged` | rival_id, old_rank, new_rank, cause | Canon. Causes: `duel, vacancy, beat_player, displaced, turncoat, uprising, retired, time_skip` |
| `RaidRequested` | attacker_ids[], patch_id, motive | Canon. Motives: `boss_orders, grudge, gloat, uprising, pretender` |
| `BetrayalTriggered` | crew_id, new_clowder | Canon. Proposed extra field: `patch_id` |
| `RivalTracked` **(proposed)** | rival_id, origin | A nameless cat got a name; UX shows the name-card |
| `RivalTraitChanged` **(proposed)** | rival_id, kind (scar/title/strength/fear), id, change, source_cat_id | Art (model kit), UX, Combat (profile cache) |
| `RivalStateChanged` **(proposed)** | rival_id, old_state, new_state | UX (Fence Line poses), Territory (resident present or gone), Economy (tribute-payer list) |
| `NemesisStatusChanged` **(proposed)** | rival_id, is_nemesis, conduct | Audio (sting variant), UX, Economy (Shiny source) |
| `IntelGained` **(proposed)** | rival_id, fact | UX |

**Queries**

| Query | Direction | Content |
|---|---|---|
| `RivalCombatProfile(rival_id)` | Combat ← Nemesis | Canon fields (level, style, moves, knacks, strengths, fears, title, scars). Proposed additions: `zoomies`, `flee_threshold`, `may_flee` (false when R12.3 forbids), `overconfident`, `sting_seed`, `conduct` |
| `EncounterCast(patch_id, context)` **(proposed)** | Combat ← Nemesis | Which tracked Rivals are present (R8.7) |
| `PowerRating(cat_id)` | Nemesis ← Crew | F6, F7 |
| `Loyalty(cat_id)` | Nemesis ← Crew | R9.6, R13.5 |
| `FenceLine(district_id)`, `MorningSniffItems()` | UX ← Nemesis | R11.3, step 2j |
| `BarkFor(rival_id, trigger, context)` | Narrative/UX ← Nemesis | R10.5 |

**Responsibility lines.** Nemesis proposes and narrates; Combat owns what a Strength, Fear, Dread, Overconfident or foiled Ambush does in numbers. Nemesis requests raids and names Keepers and residents; Territory resolves raids and owns Scent. Nemesis reads Loyalty and decides when a cat turns; Crew owns the Loyalty formula and the recruit flow. Nemesis owns triggers, tags, slots; Narrative owns words. Nemesis supplies data; UX owns the screens. Economy owns every Morsel, Shiny and Clout number mentioned here as a "proposal".

## Formulas

Conventions: `round()` rounds half away from zero. `clamp(x, lo, hi)`. `[cond]` is 1 if true, else 0. Every constant below is a data value listed again under Tuning Knobs. `PR` is Crew's `PowerRating`, whose scale this document does not know; formulas using it are ratio-based so they are scale-free.

### F1. Level at generation

```
L_gen = clamp(band_min + round(f_rank × (band_max − band_min)) + j, 1, 50)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| band_min, band_max | int | 1–48 | District level band (brief §4) |
| f_rank | float | Tough 0.25, Captain 0.65, Boss 1.0 | Position in the band by rank |
| j | int | −1, 0, +1 (Boss: 0) | Seeded jitter |
| L_gen | int | 2–48 | Level of the generated Rival |

**Output range**: minimum 2 (Hidamari Lane Tough, j = −1), maximum 48 (Botan). Clamp never binds with canon bands; it is a guard for edited data.
**Example**: Akane Arcade Captain, band 8–16, j = +1: 8 + round(0.65 × 8) + 1 = 8 + 5 + 1 = **14**.

### F2. Grudge update

```
if B > 0:  G' = clamp(G + min(cap_enc, round(B × m_g × W × K)), 0, 100)
if B ≤ 0:  G' = clamp(G + B, 0, 100)
W = min(1.5, 1 + 0.1 × n_wit)
then, if the Verdict says so: G' = round(G' / 2) (Recruit, snub)  or  G' = 0 (accepted Nose-Touch)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| G | int | 0–100 | Grudge before |
| B | int | about −16 to +58 | Sum of base values (R6.1) in the encounter ledger (largest: Rout 10 + Pile-On 5 + Fear 5 + Ambush 3 + Humble 20 + backed-opponent 10 + witnessed Clowder-mate 5), or one out-of-encounter event |
| m_g | float | 0.6–1.5 | Temperament multiplier (R3.4) |
| n_wit | int | 0–8 | Other tracked Rivals present or watching (doubled for a Show-Off) |
| W | float | 1.0–1.5 | Witness multiplier: lost face is public |
| K | float | 1.0, or 1.5 in Life 8 | Reckoning multiplier |
| cap_enc | int | 35 | Largest gain from one encounter |
| G' | int | 0–100 | Grudge after |

**Output range**: clamped 0–100. Largest single gain 35 (the cap), largest single loss the whole value (accepted Nose-Touch).
**Example**: Brooder (1.5), G = 30, Routed by Pile-On after a Fear, then Humbled: B = 10 + 5 + 5 + 20 = 40; two witnesses, W = 1.2; 40 × 1.5 × 1.2 = 72, capped to 35; **G' = 65**. A Goofball (0.6) Routed plainly and Chased Off from G = 12: B = 25, 25 × 0.6 = 15, **G' = 27**.
**Pacing consequence**: at the cap a Rival goes from a fresh 10–20 to Nemesis (75) in two to three defeats; a Goofball needs about five.

### F3. Nightly Grudge drift

```
Perched:  dG = −d × [days_since_contact ≥ 3] × [G < 75] × [not Brooder] × [arc_role = none] × [not Reckoning]
Exiled:   dG = +2 × [nights_away ≤ 5]
Humbled:  dG = clamp(1 + u + t − 2f, 0, 3) × K_sim × [not Stared Down today] × [not Settled]
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| d | int | 2 | Decay per quiet night |
| days_since_contact | int | 0+ | Days since any encounter, raid or interaction involving Mikan or the Crew |
| u | bool | 0/1 | The resident's Patch has no Sentry |
| t | bool | 0/1 | Temperament is Brooder or Braggart |
| f | bool | 0/1 | Shared a Morsel in the last 3 days |
| K_sim | int | 1, or 2 in the Reckoning | Simmer multiplier |
| dG | int | −2 to +6 | Change applied tonight (result clamped 0–100) |

**Output range**: −2 (quiet Perched) to +6 (unsentried Brooder resident in Life 8).
**Example**: a Humbled Braggart on an unsentried Patch, never fed: 1 + 1 + 1 = +3 per night; from 55 it is Restless (70) after 5 nights. Fed every third day: 1 + 1 + 1 − 2 = +1 per night and −8 per Morsel: it never gets there.

### F4. Regard update and starting Regard

```
R' = clamp(R + round(P × m_r) + N, 0, 100)
R_start = 10 + 5 × c
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| R | int | 0–100 | Regard before |
| P | int | 0 to +49 | Sum of positive base values (R6.2) |
| N | int | −21 to 0 | Sum of negative base values (not multiplied) |
| m_r | float | 0.7–1.5 | Temperament multiplier |
| c | int | 0–6 | `clout_index`: Mikan's Clout rank, House Pet = 0 … Great Boss = 6 |
| R', R_start | int | 0–100; 10–40 | Regard after; Regard at generation |

**Output range**: clamped 0–100.
**Example**: Stalwart (1.5) at R = 45, Routed cleanly (+8) and Nose-Touch accepted (+25): 33 × 1.5 = 49.5 → 50; **R' = 95**.

### F5. Comeback delay

```
N_away = clamp(d0 + r_rank − floor(G / 40) + j − q, 2, 8)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| d0 | int | 3 | Base nights away |
| r_rank | int | Tough 0, Captain 1, Boss 3 | Bigger cats sulk longer |
| G | int | 0–100 | Grudge when exiled: hate hurries them home |
| j | int | 0–2 | Seeded jitter |
| q | bool | 0/1 | Sore Loser quirk |
| N_away | int | 2–8 | Nights before return |

**Output range**: 2 to 8 (raw minimum 0 is clamped up to 2 so an exile is always felt; raw maximum 8). A Life transition returns every exile regardless.
**Example**: Tough, G = 67, j = 1: 3 + 0 − 1 + 1 = **3 nights**.

### F6. Duel win probability (Rival against Rival)

```
P_A = E_A^k / (E_A^k + E_B^k)
E = max(1, PR) × H × (1 + 0.05 × min(streak, 3))
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| PR | float | > 0 (Crew's scale) | `PowerRating(cat_id)` |
| H | float | 1.0; defender on its own kept Patch 1.10; Loaf 1.20 | Home advantage |
| streak | int | 0+ | Consecutive duel wins |
| k | float | 3 | Steepness: how much strength matters |
| P_A | float | 0–1 exclusive | Chance A wins |

**Output range**: strictly between 0 and 1; equal E gives 0.5. `max(1, PR)` prevents 0/0.
**Example**: challenger PR 80 against a defending Captain PR 100 on its Patch: E_B = 110. 80³ = 512,000; 110³ = 1,331,000; P_A = 512,000 / 1,843,000 = **0.278**.

### F7. Challenge and promotion weight

```
w = A × clamp(1 + 0.15 × (L_c − L_t), 0.25, 2.0) × F × V × [not resting] × [not lie_low]
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| A | float | 0.5–1.6 | Temperament Ambition (R3.4) |
| L_c | int | 1–50 | Candidate's level |
| L_t | int | 1–50 | Target's level (for a vacancy: mean level of the district's Toughs) |
| F | float | 1.0, or 1.5 if its feud with the target ≥ 40 | Bad blood |
| V | float | 1.0, or 2.0 if it beat the player in the last 5 days | Momentum from Mikan's loss |
| w | float | 0, or 0.125–9.6 | Selection weight; pick probability = w / Σw |

**Output range**: 0 when ineligible, else 0.125 (Fraidy, far lower level) to 9.6 (Schemer, far higher, feuding, just beat the player).
**Example**: Schemer Tough Lv 6 against a Captain Lv 7 it feuds with: 1.6 × 0.85 × 1.5 = 2.04. Stalwart Tough Lv 7, no feud: 0.8 × 1.0 = 0.8. The Schemer is picked with probability 2.04 / 2.84 = **0.72**.

### F8. Rival level growth, floor and cap

```
L' = min(L_cap, max(L + g, L_floor))
L_cap   = min(50, max(L, M + 3))
L_floor = (M − 3) × [arc lead, or Nemesis with intent hunt]
g = comeback:    1 + floor(G / 50) + [former rank ≥ Captain]
    beat player: 2 (Boss: 1; 0 if loss_streak ≥ 2)
    duel win:    1 (at most once per 3 nights)
    time-skip:   round(k_skip × dL_life)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| L, L' | int | 1–50 | Level before and after |
| M | int | 1–50 | Mikan's level |
| G | int | 0–100 | Grudge at the moment of return |
| k_skip | float | 0.5 ordinary, 0.9 Nemesis or lead, 0.25 Humbled | Share of the player's expected growth |
| dL_life | int | 2, 5, 8, 8, 8, 8, 8, 2 for Lives 1–8 | Canon expected level gain of the Life just ended (brief §8) |
| g | int | 0–7 | Levels gained |

**Output range**: 1–50. Growth can never take a Rival above Mikan + 3, and never lowers a level (a Rival generated above that by its district band keeps it).
**Example**: Tough Lv 4 returning with G = 73, Mikan Lv 5: g = 1 + 1 + 0 = 2, L_cap = 8; **L' = 6**. Ex-Captain Lv 8 returning with G = 100, Mikan Lv 7: g = 4 → 12, capped to **10**.

### F9. Scar chance

```
p_scar = clamp((p0 + 0.25 × z + 0.25 × q) × 0.5^max(0, n_m − 1), 0, 1)
forced to 1 if routs_by_player ≥ 2 and n_m = 0
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| p0 | float | 0.50 Routed by the Posse; 0.30 off-screen (duel, Sentry) | Base chance |
| z | bool | 0/1 | `was_frazzled` |
| q | bool | 0/1 | `by_pile_on` |
| n_m | int | 0–4 | Scars it already has that were sourced from Mikan or the Crew |
| p_scar | float | 0.0375–1.0 | Chance this Rout leaves a Scar |

**Output range**: 0.0375 (off-screen, already has 4 Posse Scars) to 1.0.
**Example**: first Rout, Frazzled, by Pile-On: 0.5 + 0.25 + 0.25 = **1.0**. Third Posse Scar candidate on a cat with 2 already: 1.0 × 0.5 = **0.5**.

### F10. Nose-Touch acceptance

```
p_accept = clamp(0.35 + 0.006 × R − 0.003 × G + t_n + 0.15 × c + 0.25 × o, 0.05, 0.95)
overrides: Sore Loser on its first offer → 0;  Grand Standoff → 1
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| R, G | int | 0–100 | Regard and Grudge including this encounter's pending ledger |
| t_n | float | −0.20 to +0.30 | Temperament modifier (R3.4) |
| c | bool | 0/1 | The fight was clean |
| o | bool | 0/1 | It has snubbed a previous offer |
| p_accept | float | 0.05–0.95 (0 or 1 under overrides) | Chance it accepts |

**Output range**: raw −0.15 to 1.65, clamped to 0.05–0.95 so it is never certain either way outside the overrides. The tell shown to the player: ≥ 0.70 ears forward; 0.30–0.69 one ear back; < 0.30 ears flat.
**Example**: Braggart, R = 20, G = 60, not clean: 0.35 + 0.12 − 0.18 − 0.20 = **0.09** (ears flat). Stalwart, R = 57, G = 22, clean: 0.35 + 0.342 − 0.066 + 0.30 + 0.15 = 1.076 → **0.95** (ears forward).

### F11. Turncoat probability (nightly, per eligible Wavering cat)

```
p_turn = min(p_cap, p_max × ((W_t − Y) / W_t)^1.5 × T × O × (1 + G / 100))
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| Y | float | 0 to < 30 | `Loyalty(cat_id)` from Crew (only cats below W_t are eligible) |
| W_t | int | 30 | Wavering threshold |
| p_max | float | 0.30 | Scale |
| T | float | 0.25–1.5 | Temperament Turncoat factor |
| O | float | 1.5 Sentry or Warden; 1.0 benched at the Lot | Opportunity (a cat in today's Posse is not eligible at all) |
| G | int | 0–100 | Its residual Grudge |
| p_cap | float | 0.50 | Ceiling |
| p_turn | float | 0 to 0.50 | Chance it leaves tonight |

**Output range**: approaches 0 as Loyalty approaches 30; raw maximum 1.35 (Loyalty 0, Schemer, posted, Grudge 100) capped to 0.50, so even the worst case usually gives a third warning day.
**Example**: Schemer Sentry, G = 14. At Loyalty 26: (4/30)^1.5 = 0.0487; × 0.30 × 1.5 × 1.5 × 1.14 = **0.037**. At Loyalty 14: (16/30)^1.5 = 0.3895; × 0.30 × 1.5 × 1.5 × 1.14 = **0.300**.

### F12. Memory salience (for eviction and for the Fence Line strip)

```
S = S0 × max(0.25, 1 − 0.02 × age_days) + 15 × [entry is the source of a current Scar or Title]
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| S0 | int | 10–70 | Base salience (R5.2) |
| age_days | int | 0+ | In-game days since the entry |
| S | float | 2.5–85 | Current salience; pinned entries are never evicted whatever S is |

**Output range**: 2.5 (oldest trivial entry) to 85.
**Example**: a 20-day-old `ROUTED_BY_POSSE`: 40 × 0.6 = 24. A 2-day-old `DUEL_LOST`: 20 × 0.96 = 19.2. The duel is evicted first.

### F13. Arc score (the director's measure of "this is the player's cat")

```
S_arc = 8 × n_loss + 5 × n_rout + 6 × n_esc + 4 × n_mark + 0.4 × G + 0.2 × R
        + 15 × b_turn + 10 × b_kin + 10 × b_recent − 2 × min(d_idle, 15)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| n_loss | int | 0+ | Times it beat the player |
| n_rout | int | 0+ | Times the Posse Routed it |
| n_esc | int | 0+ | Fights that ended with either side fleeing, or Scattered |
| n_mark | int | 0–7 | Its Scars and Titles sourced from Mikan or the Crew |
| G, R | int | 0–100 | Grudge, Regard |
| b_turn, b_kin, b_recent | bool | 0/1 | Is a Turncoat; is Kit or Littermate of a past lead; met Mikan in the last 2 days |
| d_idle | int | 0+ | Days since its last encounter with Mikan |
| S_arc | float | −30 upward | Used only for ranking and against thresholds 20 and 40 |

**Output range**: minimum −30 (no history, 15 idle days). No upper bound in principle because counters are unbounded; in practice below 200. It is never shown and never used as a magnitude, so no clamp is needed.
**Example**: one escape, one Rout, a Scar and a Title from Mikan, G = 67, R = 7, met today: 6 + 5 + 8 + 26.8 + 1.4 + 10 = **57.2** → becomes arc lead.

### F14. Uprising probability (nightly, per Restless resident after one full Restless day)

```
p_rise = min(0.50, 0.10 + 0.01 × (G − 70) + 0.10 × u + 0.15 × k)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| G | int | 70–100 | Grudge (Restless requires ≥ 70; ends below 60) |
| u | bool | 0/1 | Its Patch has no Sentry |
| k | bool | 0/1 | The Reckoning is active |
| p_rise | float | 0.10–0.50 | Chance it rises tonight |

**Output range**: 0.10 to 0.50 (raw maximum 0.65, capped). While Restless with G between 60 and 69, the formula is evaluated with G = 70.
**Example**: G = 82, Sentry present, normal Life: 0.10 + 0.12 = **0.22**.

### F15. Ambush chance (one roll per phase, at a seeded moment after its first 60 s)

```
p_amb = min(0.60, p_phase × (1 + 0.25 × n_h)) × [n_h ≥ 1] × [all R8.3 conditions hold]
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| p_phase | float | Morning 0.05, Day 0.08, Dusk 0.12, Night 0.25 | Night belongs to cats |
| n_h | int | 0–3 | Rivals with intent `hunt` whose home is Mikan's current district |
| p_amb | float | 0–0.4375 | Chance an Ambush or crash is launched this phase |

**Output range**: 0 to 0.4375 (Night, 3 hunters); the 0.60 cap exists for retuned data.
**Example**: one hunter, a full day outside: 0.0625, 0.10, 0.15, 0.3125 per phase; chance of at least one = 1 − 0.9375 × 0.90 × 0.85 × 0.6875 = **0.51**, limited to one per day by budget.

### F16. Bark specificity

```
score = 3 × n_mem + 2 × n_rel + 1 × n_ctx + 1 × n_voice − 2 × u
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| n_mem, n_rel, n_ctx, n_voice | int | 0–4 each | Count of the template's required tags, by family (R10.3), all of which matched |
| u | bool | 0/1 | The line was used by any cat within the last 10 barks |
| score | int | −2 to about 28 | Highest score wins; ties broken by seeded pick |

**Output range**: −2 (untagged floor line, just used) upward; bounded by how many tags a template lists.
**Example**: template A requires `fear_exploited:water`, `scar_from_mikan` and temperament Braggart: 3 + 3 + 1 = 7. Template B requires only `grudge:bitter`: 2. A is said. The most specific true thing a cat can say is the thing it says.

### F17. Kit inheritance

```
G_kit = round(0.4 × G_parent)        R_kit = round(0.5 × R_parent)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| G_parent, R_parent | int | 0–100 | The parent's values at the time-skip |
| G_kit, R_kit | int | 0–40; 0–50 | The Kit's starting values (replacing R3.9) |

**Output range**: Grudge 0–40, Regard 0–50: a Kit can arrive Sore or Respectful but never a ready-made Nemesis or Nodding Cat.
**Example**: parent G = 0, R = 95: Kit starts at **G 0, R 48**.

### F18. Starting Loyalty of a recruited Rival (proposal to Crew, who own Loyalty)

```
Y0 = clamp(50 − 0.4 × G + 0.3 × R + t_L + 20 × s, 5, 80)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| G, R | int | 0–100 | Grudge (after halving) and Regard (after +10) at recruitment |
| t_L | int | Stalwart +10, Goofball +5, Fraidy 0, Braggart −5, Brooder −5, Schemer −10 | Temperament |
| s | bool | 0/1 | Recruited at a Grand Standoff (`settled`) |
| Y0 | int | 5–80 | Proposed starting Loyalty |

**Output range**: clamped 5–80. In normal play Grudge after halving is at most 50, so the practical minimum is 20; below the Wavering threshold of 30 is reachable (a furious Schemer), and is meant to be: such a cat arrives already needing attention, protected only by its 3-day honeymoon.
**Example**: Schemer, G = 14, R = 31: 50 − 5.6 + 9.3 − 10 = 43.7 → **44**.

### Feedback loops

| Loop | Kind | Intentional? | Dampener |
|---|---|---|---|
| Player wins → Grudge up → Rival hunts → more fights → Grudge up | Positive | Yes: this is the nemesis arc | Encounter cap 35; 3 hunters town-wide; breaking point at 3 Routs ends it |
| Player loses → Rival promoted and levelled → harder → player loses | Positive | Partly: one loss should sting | Level cap Mikan + 3; no growth from streak 2; Overconfident; stops hunting at streak 3 |
| Chase Off → returns stronger and adapted → harder to Rout | Positive | Yes: Chase Off is "peace now, trouble later" | One adaptation per return; Always a Way In; third Chase Off forces resolution |
| Humble → income → Simmer → Uprising → lost Patch | Negative on the player's economy | Yes: the price of safe income | Sentries, Share a Morsel, visible Restless, failed Uprising cools it, second failure Settles it |
| Recruit many ex-Rivals → neglect → Turncoats → Rivals with the player's Moves | Negative on roster hoarding | Yes: supports "Crew are few and known" | Budget of 1 per Life; two warning days; Posse cats exempt |
| Nose-Touch → Nodding Cats → tips and absent Captains → easier districts | Positive for merciful play | Yes: mercy must be a real strategy | Forgoes loot and Clout; snubs; Nodding Cats still serve their Clowder otherwise |
| Rivals duel each other → winners level → stronger hierarchy | Positive, slow | Tolerated | 1 level per 3 nights; cap Mikan + 3 |

### Simulation spec (to validate before implementation)

Headless Monte Carlo over the Night Shuffle with a scripted player policy. 1,000 seeds × 65 days × 5 policies: *always-win Chase-Off*, *always-win Humble*, *recruit-everything-and-neglect*, *loses 40% of Rival fights*, *Nose-Touch pacifist*.

| Metric | Target |
|---|---|
| Rivals reaching Nemesis status per Life (Lives 2–7) | median 1–2, 95th percentile ≤ 4 |
| `NemesisArcAchieved` by end of Life 2 | 100% of seeds under every policy |
| Mornings with at least one nemesis item in the Morning Sniff | 60–85% |
| Rank changes per district per night (mean) | 0.3–0.6 |
| Turncoats per playthrough (neglect policy) | 4–8; (attentive policy) 0–1 |
| Uprisings per Life (always-Humble policy) | 1–3, of which at least half fail against a Sentry |
| Days from first meeting to breaking point for the arc lead | median 6–12 |
| Invariant violations (perch counts, duplicate names, Always a Way In, level cap, caps in R4.3) | 0 |
| Rivals above Mikan + 3 because of growth | 0 |

## Edge Cases

| Scenario | Expected Behavior | Rationale |
|---|---|---|
| Two tracked Rivals are Routed in one fight | Verdict prompts open one after another, highest rank first; each has its own ledger | Every Rival fight ends in a choice (Pillar 4) |
| The Posse wins but the Rival was Routed by a prop, a Critter or another Rival | Counts as Routed by the Posse; `finisher_id` is recorded as given; Scar cause falls back to Thump; Grudge ledger uses the Rout row without Pile-On | The player still gets the Verdict; history stays truthful |
| The player loses to a group with several tracked Rivals | Exactly one victor (R7.3 rule 1). The others get a `ROUTED_MIKAN` or witness Memory and +3 Regard for the victor in their feud ledger | One promotion per loss keeps losses legible |
| The player loses to a Critter-only encounter | No victor, no promotion, no Gloat. Canon loss penalty still applies | Critters are never Rivals |
| The victor of a loss is a Boss | No promotion; Title and +1 level (within cap) | Bosses have nowhere to go |
| A Tough beats the player and both Captains have beaten the player more recently | It displaces the Captain with the lower `w_promo`; ties: the one with fewer player-sourced Marks | Preserve the cats with more history |
| Grudge would exceed 100 or fall below 0 | Clamped | F2 |
| Nemesis status flickers around 75 | Hysteresis: on at 75, off below 60 | Stable UI and audio state |
| Humble chosen in a district where the player holds no Patch | The option is greyed with the reason "No mark of yours here" | Humble means "under your mark" |
| Humble chosen on a Patch that already has a resident | Confirmation prompt; the old resident is Turfed Out (R7.2) | One resident per Patch; displacement is drama, not a block |
| Recruit chosen with a full Crew | Greyed with the reason; Crew's flow may offer a dismissal, which Nemesis treats as a Chase Off of the dismissed cat | Crew cap is Economy/Crew canon |
| Recruit chosen while Grudge ≥ 90 and Regard < 50 | Greyed: "Too furious to listen". The tell shows flattened ears and a lashing tail | Gives Nose-Touch and Humble a reason to exist before Recruit |
| Nose-Touch on a Sore Loser's first offer | Always snubbed; the tell shows ears flat, so it is readable in advance | Quirk identity without a hidden trap |
| A Rival flees and R12.3 says it may not flee twice running | `may_flee` = false in its profile; it fights to the Rout | No un-catchable cats |
| The First Thorn is Routed in one burst from above 25% Nerve to 0 | The staged flee is skipped; it receives a normal Verdict; `arc_role` stays `seed` and R12.2 escalation covers the guarantee | Never rewrite a result the player earned |
| The First Thorn beats the player in that first fight | Normal loss row; the staged flee is cancelled; it is already a story | Same |
| Away list is full at a Chase Off | The longest-away exile returns tonight (R9.3) | Bounded population |
| An exile's home perch is taken and its district is unclaimed | It takes any lower free perch; if none, R4.5 replacement rule | Returns must always land |
| A Rival is due to return on a night the player lost a fight | Return is postponed one night if it would be the third bad-news item | Bad-news cap |
| The same cat is chosen as duel challenger and raid attacker on one night | Raid intent was fixed the previous night and wins; it is ineligible as challenger | Intents are commitments |
| A scheduled Spat's participant is Routed by the player earlier that day | The Spat is cancelled; no duel for that district tonight | The day's real events outrank pre-rolls |
| The player backs a cat in a Spat and then attacks it | It becomes hostile at once; the +15 Regard is reversed and −10 applied | Treachery is remembered |
| A Wavering cat is put in the Posse and fights | Not eligible to turn tonight (R9.6). Wavering itself continues until Loyalty ≥ 30 | The player always has an immediate lever |
| A Wavering cat is the Warden of a district | Turning coat requests that the Den Patch flips; Territory decides whether the district stays claimed | Territory owns claiming |
| Turncoat budget is spent and another cat qualifies | It stays Wavering, visibly, until the next Life or until Loyalty recovers | Budget postpones; it does not forgive |
| An ex-Rival is the player's chosen heir and Wavering at Life 9 | No Turncoat in Life 9; the heir note records it | Life 9 is gentle |
| A Kit's parent later un-retires | Cannot happen: `OldTimer` has no exit | State table |
| A Rival's name collides with the player's new name for Mikan | Renaming Mikan to a name in use is refused by UI with a list check; names are reserved at generation | Barks must be unambiguous |
| A rendered bark exceeds 60 characters | `short_text`; else the candidate is dropped and logged as a content bug; the floor line is used | Brief §5.5 is a hard rule |
| No template matches a trigger | The untagged temperament floor line; if that is missing the cat vocalises without a balloon and the gap is logged | Never show a blank balloon or an error |
| A fourth Title is earned | The oldest is dropped, except that the first Title earned from Mikan is never dropped. Counted Titles upgrade in place (Twice-Chased becomes Thrice-Chased) and do not use a new slot | The first mark the player left is the story |
| A fifth Scar is earned | Replaces the oldest not sourced from Mikan; if all four are Mikan's, no new Scar | R6.4 |
| An adaptation would break Always a Way In | Skipped; next priority tried; if none is legal, no adaptation this time | Invariant |
| Mikan's level is far below the district band (sequence break) | Generated levels stand (F1); growth is still capped at max(L, M + 3), so they cannot rise further | The band is level design; the cap is fairness |
| The district is claimed while its Rivals are mid-truce, exiled or Humbled | States are kept; perches switch to Holdout rules at the next step 2e | No state is lost at a claim |
| The player saves and quits during the Verdict prompt | On load the prompt reopens before anything else | A Verdict can never be skipped |
| A raid is requested on a Patch that changes hands before it resolves | Territory resolves against the current holder; if the requester's own Clowder now holds it, the request is void | Territory owns resolution |
| Difficulty mode is changed | No effect on anything in this document | Brief §8: nemesis is identical across modes |
| Every Rival of a district is Humbled, Recruited or exiled | R4.4 floor refills to 3 hostile perched Rivals at dawn (unclaimed district only) | A district must be able to be fought for |
| Life 8 begins while a Grand Standoff is pending | It stays pending; that Rival is excluded from Pretender selection until it resolves | One arc, one ending |

## Dependencies

No sibling GDD existed when this draft was written, so every dependency below is stated from the creative brief's ownership table and must be mirrored in the other document when it is written.

| System | Direction | Nature of Dependency |
|---|---|---|
| Day clock and Lives (creative brief §5) | This depends on it | `PhaseChanged`, `DayEnded`, `LifeAdvanced` drive presence, the Night Shuffle, time-skips, the Reckoning and the Last Walk. Night Shuffle order is canon |
| Combat | Both ways | Nemesis consumes `EncounterStarted`, `CatRouted`, `FearTriggered`, `EncounterEnded`. Combat queries `RivalCombatProfile` and (proposed) `EncounterCast`; values every Strength, Fear, Dread, Overconfident, foiled Ambush, Spat ally; must add the `scattered` outcome and expose finisher damage type for Pile-On |
| Territory & Economy | Both ways | Nemesis emits `VerdictApplied`, `RaidRequested`, `BetrayalTriggered`, `RivalRankChanged`; consumes `RaidResolved`, `PatchChanged`, `DistrictClaimed`. Territory resolves raids and Scent; must accept Keeper and resident ids and (proposed) `kept_by_friend`. Economy sets Humbled tribute, Share a Morsel cost, Recruit offering, loot return, Shiny proposals, and owns Clout ranks read as `clout_index` |
| Crew & Progression | Both ways | Nemesis reads `PowerRating` and `Loyalty`; selects Rival kits from learnsets; hands a recruited cat over intact. Crew owns Loyalty (F18 is a proposal), the recruit and dismissal flows, and should take `HELD_FIRM`, `LURED`, Posse time and posting as Loyalty inputs |
| Narrative | Both ways | Narrative writes every bark template against R10's triggers, tags and slots; authors Boss kits within R7.4; decides Botan and Usurper questions; consumes the Last Walk and epilogue candidates. Nemesis enforces R10.7 |
| Art | Art depends on this | Coat genome (R3.6), Scar and Title kits, state poses, grey-muzzle flag, Kit inheritance, Fence Line dressing |
| Audio | Audio depends on this | `sting_seed`, temperament and Style for the personal yowl-sting; sting pre-roll for Ambush; Nemesis status variant |
| UX | UX depends on this | Fence Line data, Morning Sniff items, Verdict prompt and tell, Standoff card, loss screen Gloat, name-card on `RivalTracked` |
| Level Design | This depends on it | Patrol paths per district, Grand Standoff landmark per district, `fear_sources` per district, Old-Timer ledges, lane wall opposite Haru's gate |
| Save system | This depends on it | All of `rival{}`, Memory, perches, lists, director state and the RNG seed are core save data; the Verdict prompt must survive a quit |

## Tuning Knobs

All values live in data. "Safe range" is a first estimate, to be confirmed by the simulation spec.

| Parameter | Current Value | Safe Range | Effect of Increase | Effect of Decrease |
|---|---|---|---|---|
| `nemesis_threshold` / `nemesis_release` | 75 / 60 | 65–85 / 50–70 | Fewer, later Nemeses | More Nemeses, sooner; risk of noise |
| `cap_enc` (Grudge per encounter) | 35 | 25–45 | Nemesis in 2 fights | Arcs take 4+ fights |
| `m_g` per temperament | 0.6–1.5 | 0.5–1.75 | Sharper personality differences | Temperaments feel alike |
| `m_r` per temperament | 0.7–1.5 | 0.5–1.75 | Friends easier to make | Regard matters less |
| Witness step / cap | 0.1 / 1.5 | 0–0.2 / 1.0–2.0 | Public fights matter more | Witnesses are flavour only |
| `d` (quiet-night decay) | 2 | 0–4 | Town forgives quickly | Grudges only ever rise |
| Simmer base and clamp | 1, max 3 | 0–2, max 2–4 | Humble becomes risky upkeep | Humble is free income (brief risk 5) |
| Share a Morsel Grudge / Regard | −8 / +4 | −4 to −12 / +2 to +6 | Feeding trivialises Simmer | Feeding not worth the trip |
| Restless threshold / release | 70 / 60 | 60–80 / 50–70 | Fewer Uprisings | More |
| F14 base, slope, cap | 0.10, 0.01, 0.50 | 0.05–0.20, 0.005–0.02, 0.3–0.7 | Faster Uprisings | Longer warnings |
| `d0` comeback base | 3 | 2–5 | Exiles gone longer; Chase Off stronger | Exiles back before they are missed |
| Stew per night / max | +2 / +10 | 0–4 / 0–20 | Chase Off always breeds a Nemesis | Chase Off is nearly free |
| `p_duel` per district per night | 0.35 | 0.15–0.6 | Lively wall; risk of unreadable churn | Static hierarchy |
| `k` duel steepness | 3 | 1–6 | Stronger cat nearly always wins | Upsets common |
| Home advantage `H` | 1.10 | 1.0–1.3 | Keepers entrenched | Perches swap freely |
| Level cap offset (Mikan + n) | 3 | 1–5 | Scarier Nemeses; frustration risk | Rivals feel harmless |
| Level floor offset (Mikan − n) | 3 | 1–6 | Old Nemeses fall behind | Nemeses always near parity |
| `k_skip` (ordinary / Nemesis / Humbled) | 0.5 / 0.9 / 0.25 | 0.25–1.0 each | Old districts stay dangerous | Old districts become trivial |
| F9 `p0` (Posse / off-screen) | 0.50 / 0.30 | 0.3–0.8 / 0.1–0.5 | History visible sooner; busier models | Cats look unmarked |
| F10 base / Regard slope / Grudge slope | 0.35 / 0.006 / 0.003 | 0.2–0.5 / 0.003–0.01 / 0.001–0.006 | Nose-Touch reliable | Nose-Touch a gamble |
| Truce length | 5 days | 2–8 | Mercy buys real quiet | Truce barely noticed |
| `W_t` Wavering threshold | 30 | 20–40 | More cats Waver | Turncoats rare |
| `p_max` / `p_cap` Turncoat | 0.30 / 0.50 | 0.1–0.5 / 0.3–0.8 | Shorter warning in practice | Wavering drags on |
| Wavering warning days | 2 | 1–4 | Safer, less surprising | Feels unfair below 2 |
| Honeymoon | 3 days | 1–5 | Recruits safe longer | Furious recruits may leave at once |
| Turncoat budget per Life | 1 | 0–2 | Betrayal becomes a chore | May never be seen |
| Lure chance per night | 0.15 | 0.05–0.3 | More Hold Firm stories | Loyalty rarely tested |
| `hunt` slots town-wide | 3 | 1–4 | Crowded with Nemeses | One Nemesis at a time |
| Ambush per day (normal / Life 8) | 1 / 2 | 0–2 / 1–3 | Roaming feels unsafe | Nemeses feel passive |
| F15 `p_phase` (M/D/Du/N) | 0.05/0.08/0.12/0.25 | ×0.5–×2 | More Ambushes, mostly at Night | Fewer |
| Ambush warning time | 2.0 s | 1.5–3.0 | Easy to foil | Feels like a cheap shot |
| Raid requests per night (district / town / Life 8) | 1 / 2 / 4 | 0–2 / 1–4 / 2–6 | Defence dominates the day | Sentries idle |
| Boss-ordered raid interval | 3 nights | 2–6 | Rarer pressure | Constant pressure |
| Breaking point (Routs) | 3 | 2–5 | Longer arcs; fatigue risk | Arcs end before they bite |
| Arc lead threshold (F13) | 40 | 25–60 | Lead chosen later, more earned | Lead chosen on thin history |
| Loss streak steps | 2 / 3 | 2–3 / 3–5 | More punishing | More merciful |
| Bad-news cap per morning | 2 | 1–3 | Grimmer mornings | Softer |
| `holdout_cap` (claimed district) | 3 | 1–5 | Old districts stay busy | Old districts are dead |
| Retirement chance (≥ 3 / ≥ 5 Lives) | 0.20 / 0.40 | 0–0.4 / 0.2–0.6 | More turnover, more Kits | Same faces all game |
| Kits per Life | 2 | 0–4 | Generations more visible | Rare treat |
| F17 inheritance (Grudge / Regard) | 0.4 / 0.5 | 0.2–0.6 each | Kits arrive with strong feelings | Kits are blank |
| Memory capacity | 16 | 10–24 | Richer barks; larger saves | History forgotten |
| Away / Old-Timer caps | 6 / 6 | 4–10 | More cats in play | Fewer |
| Gossip items per morning | 2 | 0–3 | Player well informed | Raids feel sudden |
| Reckoning multipliers (Grudge K, Simmer) | 1.5 / 2 | 1.0–2.0 / 1–3 | Life 8 collapses faster | Life 8 barely differs |
| Loyalty Test thresholds | 50 / 30 | 40–60 / 20–40 | More Wardens fail | Fewer |

## Visual/Audio Requirements

| Event | Visual Feedback | Audio Feedback | Priority |
|---|---|---|---|
| Standoff | Arched backs, name-card (name, Title, rank pip, Scars visible on model), one balloon | The Rival's personal 2-bar yowl-sting | Must |
| Rival Ambush warning | Whisker Sense trail approaching; a shadow on the High Road | The sting from the Rival's direction, 2.0 s ahead | Must |
| Scar gained | The Scar pops onto the model in the settling dust with a small sparkle | Short "plaster" pop | Must |
| Title gained | The Title stamps under the name on the card (Verdict screen or loss screen) | Stamp thud | Must |
| Nameless cat becomes tracked (`RivalTracked`) | Name-card assembles letter by letter over the cat | Its sting plays for the first time | Must |
| Verdict tell | Ear, tail and eye poses on the Routed cat (F10 bands) | Low growl, uncertain chirp or purr-trill to match | Must |
| Each Verdict | Chase Off: dust trail to the district edge. Humble: flattens, then sits small by the post. Recruit: steps behind Mikan, tail up. Nose-Touch: accepted = noses meet, a small spark; snubbed = head turned away | Distinct stinger each | Must |
| Gloat | 3 s or less on the loss screen, one per Gloat type | The victor's sting, triumphant variant | Must |
| Nemesis status reached | Card frame changes; the perch on the Fence Line gains a claw-mark | Sting gains a darker harmony (Audio) | Should |
| Adaptation | The new Strength icon on the card pulses during the `ADAPTED` bark | — | Must |
| Wavering | Sits turned away, tail flicking; sour-scent wisps in Whisker Sense | Flat, short meow set | Must |
| Restless | Lashing tail; scratched marks on its post | Low growl loop near the Patch | Must |
| Turncoat | Morning Sniff: its portrait flips to the rival Clowder colour; empty spot at the Lot | Its sting, inverted | Must |
| Fence Line overnight changes | Cats hop between perches, at most 5 animations | Soft thumps; a hiss on a feud glance | Must |
| Greying, Old-Timers, Kits | Grey muzzle; Old-Timers loaf in sun; Kits share the parent's palette | Old-Timer purr; the Kit's sting quotes the parent's | Should |
| Last Walk gestures | Nose offered, slow blink, back turned, watching | Per Narrative/Audio; no stings | Must |

## Game Feel

The nemesis system has almost no direct input; its feel is pacing and punctuation around Combat's.

### Feel Reference

The moment in *Middle-earth: Shadow of Mordor* when a captain you had forgotten steps out and names what you did to him, compressed to the length of a *Punch-Out!!* between-rounds taunt, with the status comedy of neighbourhood cats staring each other down on a fence. NOT the feel of a cutscene: Pillar 3 outranks Pillar 4, so nothing here may hold the player longer than 4 seconds without input.

### Input Responsiveness

| Action | Max Input-to-Response Latency (ms) | Frame Budget (at 60fps) | Notes |
|---|---|---|---|
| Skip Standoff (after first sight) | 100 | 6 | Fight starts on the skip |
| Select a Verdict | 100 | 6 | Highlight and tell preview follow the cursor |
| Confirm a Verdict | 100 | 6 | Result animation begins at once |
| Turn to foil an Ambush | Combat's movement latency | — | The 2.0 s window is world time |
| Open the Fence Line (at the Lot or Doorstep) | 150 | 9 | Overnight animation is skippable per hop |

### Animation Feel Targets

Durations are proposals at 60 fps; Combat and Art own final timings.

| Animation | Startup Frames | Active Frames | Recovery Frames | Feel Goal | Notes |
|---|---|---|---|---|---|
| Standoff card, first sight | 12 | 120–216 | 12 | A held breath, then go | 2–4 s canon |
| Standoff card, repeat | 6 | up to 90 | 6 | Skippable instantly | |
| Verdict result | 6 | 60–90 | 12 | Crisp, final, funny | Never longer than 2 s |
| Gloat | 6 | up to 168 | 12 | A sting, not a punishment | 3 s cap |
| Scar/Title stamp | 4 | 20 | 8 | A rubber stamp | |
| Fence Line hop | 6 | 24 | 10 | Cats rearranging themselves | |

### Impact Moments

| Impact Type | Duration (ms) | Effect Description | Configurable? |
|---|---|---|---|
| Sting pre-roll before Ambush | 2000 | Directional audio, trail in Whisker Sense | Yes |
| Name-card slam at Standoff | 150 | Card snaps in with a small camera push | Yes |
| Title stamp | 120 | Stamp, 2-frame hit-stop on the card only | Yes |
| Nose-Touch accepted | 400 | Time eases to 50%, a spark where noses meet, music holds one note | Yes |
| Nose-Touch snubbed | 300 | A beat of silence; Mikan's ears drop | Yes |
| Controller rumble | 80 | On stamp, on Gloat swat, on Turncoat reveal in the Morning Sniff | Yes |

### Weight and Responsiveness Profile

- **Weight**: light on the hands, heavy in consequence. Choices take a second to make and a week to pay for.
- **Player control**: total at every decision point (no timers, clock paused); none over what the town does overnight, and that contrast is the point.
- **Snap quality**: binary and stamped. A Verdict is chosen and done; there is no undo.
- **Acceleration model**: instant. Cards, stamps and prompts appear on the frame budget above; nothing eases in slowly.
- **Failure texture**: a loss must read as "that cat got one over on me", never "the system punished me". The Gloat is short, specific and a little funny, and the Morning Sniff the next day shows exactly what it cost.

### Feel Acceptance Criteria

- [ ] Playtesters refer to at least one Rival by name, unprompted, within two hours
- [ ] No playtester describes a Turncoat, Uprising or comeback as "random" or "out of nowhere" when asked why it happened
- [ ] Playtesters laugh or groan at a Standoff line at least once per session
- [ ] No playtester reports Standoffs or Verdicts as "slowing the fight down"
- [ ] After a loss, playtesters can say which cat beat them and what it gained

## UI Requirements

| Information | Display Location | Update Frequency | Condition |
|---|---|---|---|
| Name, Title, rank, taunt | Standoff card | Per encounter | Any tracked Rival |
| Known Fears and Strengths | Target panel in Slow Blink (UX/Combat); Fence Line card | On reveal | Intel bit set |
| The tell and the four Verdicts with availability reasons | Verdict prompt | Per Routed Rival | Posse won |
| Victor's name, promotion, new Title, Gloat | Loss screen | Per loss | Posse wipe |
| Overnight nemesis items (up to 5) with portraits | Morning Sniff at the Doorstep | Daily | From Life 2 |
| Hierarchy, moods, states, feuds, intents, Memory strip | Fence Line (opened at the Doorstep and the Lot, per the pillars' "management happens at the Lot and the Doorstep") | After each Night Shuffle | Per district unlocked |
| Wavering and Restless warnings | Morning Sniff; the cat itself in the world; Lot roster | Daily | State active |
| Grand Standoff and Clean Duel call-outs (who, where, which phase) | Morning Sniff; a mark on the gatepost; Whisker Sense trail to the place | Until attended | Pending |
| Loot held by a Rival | Fence Line card (a small fish icon) | On change | `loot_held` > 0 |
| "While you were away" changes | Fence Line, first opening of a Life | Once per Life | After a time-skip |

Grudge and Regard are shown as moods, never numbers. No nemesis information is shown inside Haru's House.

## Cross-References

Target paths are assumed; none of these documents existed at the time of writing.

| This Document References | Target GDD | Specific Element Referenced | Nature |
|---|---|---|---|
| Night Shuffle order, day phases, Life goals, loss penalty, event names | `design/creative-brief.md` | §5.2, §5.3, §5.4, §6.1, §8 | Rule dependency |
| Routs, Fears, outcomes drive Memory | Combat GDD (path TBD) | `CatRouted`, `FearTriggered`, `EncounterEnded`, `EncounterStarted` | State trigger |
| Strength/Fear/Dread/Overconfident effects; foiled Ambush; `scattered` outcome; Spat ally | Combat GDD (path TBD) | Status and encounter rules | Ownership handoff |
| Enemy Nerve multipliers by rank (Usurper at Boss scale) | `design/creative-brief.md` | §8 | Rule dependency |
| Raid resolution, Scent, Patch holder, Den opening | Territory & Economy GDD (path TBD) | `RaidResolved`, `PatchChanged`, `DistrictClaimed` | State trigger |
| Tribute from Humbled residents; Morsel costs; Clout ranks; Shiny proposals; loot return | Territory & Economy GDD (path TBD) | Tribute formula, price table, Clout table | Ownership handoff |
| Duel and promotion odds | Crew & Progression GDD (path TBD) | `PowerRating(cat_id)` | Data dependency |
| Wavering, Turncoat, Loyalty Tests, Lure | Crew & Progression GDD (path TBD) | `Loyalty(cat_id)` | Data dependency |
| Starting Loyalty of recruits (F18) | Crew & Progression GDD (path TBD) | Loyalty formula inputs | Ownership handoff |
| Rival kits | Crew & Progression GDD (path TBD) | Learnsets per Style and level | Data dependency |
| Bark text, Boss kits, Botan, epilogue | Narrative docs (path TBD) | Bark templates against R10; Life beat sheets | Ownership handoff |
| Coat, Scar, Title, pose kits | Art bible (path TBD) | Coat-seed visual parameters | Ownership handoff |
| Yowl-stings | Audio direction (path TBD) | Sting generator | Ownership handoff |
| Fence Line, Morning Sniff, Verdict prompt | `design/ux/` specs (TBD) | Screen specs | Ownership handoff |

## Acceptance Criteria

**Determinism and integrity**
- [ ] Given the same save, seed and day inputs, Night Shuffle step 2 produces byte-identical state on 1,000 consecutive runs
- [ ] The simulation spec passes with 0 invariant violations across 5,000 simulated playthroughs (perch counts per district never exceed 1/2/5 plus the documented soft cap; list caps hold; no duplicate names; no Rival above max(L, Mikan + 3) through growth; Always a Way In true for every Rival every night)
- [ ] No tracked cat is ever deleted while it has a player-sourced Scar or Title; the only removals are fading (no player history) and the documented states

**Generation**
- [ ] 1,000 generated districts: every district meets the Style, temperament and coat-distinctness constraints of R3; no generated cat matches the Mikan protection rule; no name exceeds 8 characters or appears on the exclusion list
- [ ] Every generated Fear exists in its district's `fear_sources`

**Memory and change**
- [ ] After one fight ending in each of the 16 matrix rows, the Rival's Grudge, Regard, state, rank, Scars and Titles match R7.5 exactly (unit tests per row, both multiplier extremes)
- [ ] A Rival Routed twice by the Posse always carries at least one Posse-sourced Scar
- [ ] Every displayed Scar and Title has a pinned Memory entry naming its source
- [ ] After any adaptation, the Rival's next Standoff line comes from `ADAPTED` and the Strength is visible on the Fence Line beforehand

**Verdicts and losses**
- [ ] Quitting during a Verdict prompt and reloading reopens the same prompt
- [ ] A Posse wipe always yields exactly one victor, one promotion (or the Boss exception), one Glory Title and one Gloat of 3 s or less
- [ ] Fleeing never changes any Rival's rank

**Off-screen simulation**
- [ ] No Turncoat ever fires with fewer than two prior Morning Sniff warnings for that cat, inside its honeymoon, on a day it fought in the Posse, or beyond the Life's budget (property test over the simulation spec)
- [ ] No Uprising fires without one full prior Restless day
- [ ] Every raid requested on night N is discoverable through at least one intel source on day N+1 whenever the player has any eligible source (Nodding Cat, feuding Sentry, calm resident), verified by test fixtures
- [ ] Rank-change animations per district per morning never exceed the R12.1 budget

**Barks**
- [ ] Automated check: every template, rendered with maximum-length slot values, is 60 characters or fewer, or has a `short_text` that is
- [ ] Every trigger has an untagged floor line for each of the 6 temperaments
- [ ] Lint: 0 templates contain terms on Narrative's human-story blocklist (R10.7)
- [ ] In a 10-day scripted session no Rival repeats a line to the player while an unused candidate exists

**Pacing guarantees**
- [ ] `NemesisArcAchieved` is true by the end of Life 2 in 100% of simulated playthroughs under all five policies
- [ ] Vertical-slice playtest, no briefing: at least 80% of players can, after two hours, name one Rival and state one thing that happened between them; at least 60% can point to a Scar or Title and say how it was earned
- [ ] Under the "loses 40%" policy no Rival beats the player more than 3 times running while still hunting

**Owner-story rules**
- [ ] No nemesis event, bark or UI appears while Mikan is inside Haru's wall or during a home vignette (automated zone test)
- [ ] After each time-skip the Fence Line shows at most 5 highlighted changes and every surviving Rival has a `LIFE_SKIP` entry
- [ ] Life 8: each Warden's Loyalty Test result matches the thresholds exactly for Loyalty 0, 29, 30, 49, 50, 100

**Performance and data**
- [ ] Night Shuffle step 2 for 6 districts and up to 120 tracked cats completes within 50 ms on the handheld target; bark selection within 1 ms; `RivalCombatProfile` within 0.1 ms
- [ ] Save data for the whole system stays under 256 KB
- [ ] No hardcoded values: every number in Formulas and Tuning Knobs is read from data

---

## Appendix A. Three worked Rival life-stories

These trace the rules above with real numbers. Loyalty values after recruitment and raid results are Crew's and Territory's and are illustrative; every Grudge, Regard, level and probability is computed from this document.

### A.1 Kinako the Soggy: the one who kept coming back

Hidamari Lane Tough, Scrapper, **Braggart** (`m_g` 1.2, `m_r` 0.7), quirk Box-Sitter, Fear: Water. Level 3. Start Grudge 12, Regard 10. Keeper of the first Patch Mikan ever fights for, so flagged First Thorn.

| When | What the player sees | Rules at work | Values after |
|---|---|---|---|
| Life 1, day 2 | Kitten Mikan nearly wins; at 25% Nerve Kinako bolts out of his crate and over the wall. Mikan Sprays the post | R12.2 staged flee; matrix row 10 (+8 × 1.2 → +10; Scar roll at 50%: no); `PATCH_LOST` (+8 × 1.2 → +10) | Grudge 32, Regard 10 |
| Time-skip to Life 2 | — | F8 time-skip: round(0.5 × 2) = +1. No decay (`arc_role` = seed) | Level 4 |
| Life 2, day 1, Dusk | A yowl-sting from the laundry poles. The player turns in time: Standoff, not Ambush. "You got the post. I got away. Round two, Collar." The player kicks over a watering can; Kinako freezes, Frazzles, Pile-On. Verdict: Chase Off | R8.3 foiled Ambush. Ledger B = 10 + 5 + 5 + 15 = 35; × 1.2 = 42, capped 35. Regard −3. F9 = 1.0 → Scar: damp cowlick. Title: the Soggy. F13 = 57.2 → arc lead | Grudge 67, Regard 7. Exiled: F5 = 3 + 0 − 1 + 1 = 3 nights |
| Day 4, morning | Morning Sniff: pawprints leading back to an empty perch. Fence Line: a new Strength icon on his card | Stew +6 → 73. F8: g = 1 + 1 = 2. Adaptation: no repeat pattern yet → Braggart pool: Grudge Fuel | Level 6, Grudge 73 |
| Day 4, Dusk | The player misses the sting. Ambush. The Posse is wiped. On the loss screen Kinako bats Mikan's bell and struts. He takes a Captain's perch; the Captain he pushed off, Tansu, glares from below | Row 7: +5 × 1.2 → +6; Regard −10. Gloat: Swat the Bell. Title: Bell-Ringer (now displayed). Tough → Captain by displacement; Tansu demoted, feud 30. +2 levels (cap Mikan 6 + 3 = 9). Glory Title from Mikan with room to spare: Bell-Hunter (R6.7) | Grudge 79: **Nemesis**. Regard 0. Level 8. Strengths: Grudge Fuel, Bell-Hunter |
| Day 5, morning | Kinako is sitting on the lane wall opposite Haru's gate. "Morning, Collar. Sleep well on your cushion?" The player slips out through the Lot | R13.2 Wall Watch; no Ambush in the Morning after a wipe (R12.3) | — |
| Night 5 | Morning Sniff: Tansu went for Kinako and lost. Tansu now has a bent whisker | R9 step 2d. F6: 80³ / (80³ + 110³) = 0.278; rolled a loss. Scar at 0.30: yes. Tansu rests 3 nights | Tansu–Kinako feud 40 |
| Day 9, Morning | The player has sniffed Kinako's mark twice and knows his hours. Sprinkler, Frazzle, Pile-On, Chase Off again | Ledger 35 → capped 35 → clamp. Second Chase Off: Twice-Chased (Bell-Ringer still displayed). Second Pile-On: gains Fear of Being Outnumbered. Water triggered in two lost fights: escalation roll, Braggart 50%: **Overcome** | Grudge 100, Regard 0. Fears: Being Outnumbered. Strengths: Grudge Fuel, Bell-Hunter, Got Over It (Water). Exile: 3 + 1 − 2 + 0 = 2 nights. Tansu gets the vacant perch back |
| Life 2 ends; time-skip to Life 3 | — | Exiles return at the skip; the arc lead moves uphill to the frontier. Two evaluations (the return, then the skip): two Routs by Claw → Thick Fur; two Pile-Ons → Wriggler. He is now at the cap of 5 Strengths with one Fear left, so Always a Way In still holds. F8: comeback g = 4 and skip g = 5, both capped at Mikan 8 + 3 | Level 11, a Tough of the Awning Gang |
| Life 3, day 1 | Akane Arcade. A familiar cowlick under a vermilion awning. The player tips the fishmonger's bucket over him. He stands in the puddle: "Go on, tip the bucket. I like the rain now." The fishmonger's broom breaks the fight up | `ADAPTED` bark (R6.7 rule 5). Row 11 Scattered: Regard +5 × 0.7 → +4. `unfinished` | Regard 4 |
| Day 2 | The rematch. The Posse changes its finisher and wins the hard way. Verdict: Chase Off | Clean Rout: Regard +8 × 0.7 → +6. Third Rout as a Nemesis and third Chase Off: **breaking point** | Regard 10. Thrice-Chased |
| Day 5 | Morning Sniff: Kinako is waiting at the Arcade crossing at Dusk. Every Awning Gang cat is on the awnings. He has three escorts. When two of them go down he panics: a Fear the player never knew. Pile-On. All four Verdicts are open. The player picks Recruit | R12.5 Grand Standoff. `FEAR_FOUND` Being Outnumbered: Regard −3. Recruit allowed at any Grudge: Grudge 100 → 50; Regard +10 × 0.7 → +7. F18: 50 − 20 + 4.2 − 5 + 20 = 49.2 | Crew. Grudge 50, Regard 14, proposed Loyalty 49 |
| Lives 3–7 | Awning Gang cats greet the Posse with "Kinako? You wear the bell's stink now? Shame on you." He is in the Posse most days | `CREW_SPOTTED`; Loyalty rises by Crew's rules | Loyalty 72 (illustrative) |
| Life 8 | Kinako is Warden of Akane Arcade when the Boss stops coming out. Third night: he holds. When Mikan finally walks back under the awnings: "Kept your awnings dry, Boss." | R13.5 Loyalty Test, 72 ≥ 50: Holds Firm. Title: the Faithful (the Soggy is kept as the first Title Mikan gave him) | Kinako the Faithful |
| Life 9 | He is one of the names offered as heir | R13.6 heir note: ex-Nemesis | — |

### A.2 Sumi the Turncoat: the one the player forgot

Tsukimi Hill Captain of the Lantern Eyes, Prowler, **Schemer** (`m_g` 1.0, `m_r` 0.9, `T` 1.5), quirk Night Owl. Life 4; Mikan's Clout is Boss (index 3). Start Grudge 15, Regard 25.

| When | What the player sees | Rules at work | Values after |
|---|---|---|---|
| Day 2, Night | The player drops on her from the torii. A short fight, a Frazzle, a Rout. She has a Move the player wants. Verdict: Recruit | Ledger B = 10 + 3 = 13 → Grudge 28, halved on Recruit. Regard −3 (Ambush), +10 × 0.9 → +9. F9 = 0.75 → notched ear; Title: Notch-Ear. F18 = 43.7 | Crew. Grudge 14, Regard 31, proposed Loyalty 44. Honeymoon to day 5 |
| Day 2 | Her knowledge lands on the Fence Line: her feud with a Tough called Hotaru, Oboro's hours, Oboro's hidden Fear | R11.2 recruit intel (ex-Captain). Hotaru takes her empty perch (R4.4) | — |
| Days 3–5 | The player takes her Move in a Lesson, posts her as Sentry at the bamboo-grove Patch, and pushes on toward the Den | Loyalty falls by Crew's rules (illustrative) | Loyalty 29 on night 5: **Wavering** |
| Days 6–7 | Morning Sniff, twice: a sour-scent mark on her portrait. At her post she sits facing the bamboo. "Quiet post. Lots of time to think, Boss." The player does not put her in the Posse | Two warning days (R9.6). Night 6: a Lure from the Lantern Eyes; Loyalty 26, so it only hardens her. Night 7: F11 = 0.037, no | Loyalty 26 |
| Night 8 | Morning Sniff: Sumi's portrait flips to indigo. The bamboo grove is Lantern Eyes ground again | Loyalty 14: F11 = 0.300, yes. `BetrayalTriggered` with the Patch. Grudge = max(14, 60). Title: the Turncoat. Takes a Tough perch | Perched, Grudge 60 |
| Day 9 | Standoff at the grove. "I know every trick you taught me, Boss." She does: the Lesson went both ways. The player retreats | `TURNCOAT_REVEAL`; she keeps taught Moves. Row 8: Regard −8 | Regard 23 |
| Day 10, Night | A Spat on the grove path: Sumi is challenging Hotaru for her old perch. The player steps in beside Hotaru. Sumi is Routed between them. The player Sprays the post and chooses Humble | R8.5 backing a side: Hotaru Regard +15 × 0.7 → +11 and wins the duel. Sumi's ledger B = 10 + 10 + 20 = 40; one witness, W = 1.1; 44, capped 35. Regard +8 × 0.9 → +7, −5 | Humbled at the grove. Grudge 95, Regard 25. **Restless** |
| Night 12 | Morning Sniff the day before: scratched marks on the grove post. The player posted a Sentry in time. She rises and is thrown back | Simmer +1 on each of two nights (Sentry present, Schemer) → 97. F14 = 0.10 + 0.27 = 0.37, yes. `RaidRequested` (uprising); Territory: Sentry holds (illustrative). One more night of Simmer, then Grudge −20; feud +10 with that Sentry | Grudge 78, no rising for 5 nights |
| Days 13–15 | Three visits, three Morsels | Share a Morsel −8 each, +4 Regard each; fed, so Simmer is 0 | Grudge 54, Regard 37. Restless ends |
| Lives 5–6 | The player stops visiting. She pays her fish and counts | Simmer +1 per night: Restless again after 16 nights; a second Uprising at 74 fails | Grudge 54; **Settled** |
| Life 8 | The Boss is not on the wall. The Sentry is called away. Within a week the grove is indigo and Sumi is sitting in the Den's shadow beside the Warden | Reckoning: Settled cats Simmer again, doubled: (1 + 1) × 2 = +4 per night from 54; Restless at 70; after a full day, F14 at 78 = 0.10 + 0.08 + 0.10 + 0.15 = 0.43, yes; one more night before Territory resolves it. Highest F13 on the Hill: **Pretender** | Grudge 82. Title: Post-Stealer |
| Life 8, later | Mikan comes back up the shrine steps, thin and slow, and wins. The tell: one ear back. The player offers a nose anyway. She turns her head | Clean Rout in Life 8: +10 × 1.0 × 1.5 = +15 → pending Grudge 97; pending Regard 37 + 7 = 44. F10 = 0.35 + 0.264 − 0.291 + 0 + 0.15 = 0.47. Rolled: snub. Grudge halved; Regard +5 × 0.9 | Grudge 49, Regard 49. No longer a Nemesis |
| Life 9 | On the Last Walk she is on the shrine roof. She does not turn her back. She does not come down | R13.6: Grudge below 75, Regard below 50 → watches | — |

### A.3 Buri the Nodding and Aji, Kit of Buri: the one who was fair

Shiosai Harbour Captain of the Salt Paws, Bruiser, **Stalwart** (`m_g` 0.8, `m_r` 1.5), quirk Loaf. Life 5; Mikan's Clout is Two-Street Boss (index 4). Start Grudge 10, Regard 30.

| When | What the player sees | Rules at work | Values after |
|---|---|---|---|
| Day 1 | Buri is sitting on the ice crates and will not move. The Posse breaks on him. On the loss screen he waits for Mikan to stand up, then walks away. "Good scrap. Come back when the bell means something." | Row 7 with Turn Away: Grudge +5 × 0.8 → +4; Regard +10 × 1.5 → +15. Title: Bell-Stopper. Captain → First Captain | Grudge 14, Regard 45 |
| Day 3 | The player comes back in daylight, opens with a Standoff, uses no props, and wins. The tell: ears forward. Nose-Touch. Noses meet | Clean Rout: pending Grudge 22, Regard 57. F10 = 1.076 → 0.95, accepted. Grudge 0. Regard: (8 + 25) × 1.5 = 49.5 → +50 | Grudge 0, Regard 95: a **Nodding Cat**, still First Captain of the Salt Paws. Title: the Nodding. Truce 5 days |
| Day 5 | Morning Sniff: Buri's portrait, a net-shed icon, a moon. Ikari has ordered a raid on the player's net-shed Patch tonight. The player is there when the Caterwaul goes up | R9.8 `boss_orders`; R11.2 Nodding Cat tip; row 12 for the raiders | — |
| Day 7 | The Den. Ikari has one Captain beside him, not two. "Buri went soft. I didn't." | R8.7: a Nodding Captain does not attend | — |
| Life 5–6 | Once a Life a mark appears on the gatepost: Buri, the breakwater, Dusk. Equal numbers, no tricks. The player loses one of these and nothing bad happens | R8.4 Clean Duel; row 15: Regard +5 × 1.5 → +8 on a loss; no promotion, no Title | Regard 100 |
| Time-skip to Life 7 | The Fence Line reshuffles: Buri climbs down from his perch and onto the sunny ledge. A small broad kitten with his markings takes a Tough's perch | R13.3: `lives_active` 3, retirement at 0.20: yes → Old-Timer. Kit generated. F17: Grudge 0, Regard round(47.5) = 48 | Aji, Kit of Buri: Stalwart, Grudge 0, Regard 48 |
| Life 7 | "Dad says you fight fair. Show me." The player does, and offers a nose | `KIN_INTRO`. Clean Rout and accepted Nose-Touch: 48 + 50 | Aji: Regard 98, a Nodding Cat |
| Life 8 | When Mikan finally comes down to the harbour, two posts still smell of bell-gold. Buri is asleep against one. Aji is sitting on the other. "You look thin, Boss. Eat something." | R13.5 Gratitude: an Old-Timer with Regard ≥ 50 and a Nodding Cat each keep a post warm (`kept_by_friend`) | — |
| Life 9 | On the Last Walk Buri gets up, slowly, and offers his nose. In the epilogue, he is the cat on the wall | R13.6: Regard ≥ 75; wall companion candidate | — |

---

## Appendix B. Risk: prior art and the Warner Bros. patent

**This section states design facts and a recommendation. It is not legal advice and reaches no legal conclusion.**

The Nemesis System of *Middle-earth: Shadow of Mordor* and *Shadow of War* is the acknowledged inspiration for this system, and Warner Bros. Interactive Entertainment holds a United States patent on it (US 10,926,179). The author of this document has not analysed the patent's claims and is not qualified to; nothing here should be read as a statement about what the patent does or does not cover, nor about its status in any territory.

**Recommendation (blocking):** before the vertical slice's nemesis scope is locked, and again before any public showing, have qualified patent counsel review this document against the actual claims, in every territory where the game will be sold. Marketing should avoid using the trademarked or descriptive name of the original system for ours until counsel has advised; in-project the system is "Rivals".

**What this design deliberately does differently** (facts for counsel to weigh; see R1 for where each lives):

| Area | The well-known inspiration (as commonly described) | This design |
|---|---|---|
| What ends a fight | Enemies are killed or the player dies | Nobody dies. The player chooses one of four Verdicts; the Rival performs a Gloat when it wins |
| What drives change | Death, survival and vengeance | Two meters, Grudge and Regard, moved by loss of face and shows of respect |
| Hierarchy | A military chain of command | Seats on a wall, tied to Patches and scent; top seats are authored and static; changes are capped per night |
| Acquiring followers | A domination ability | Paying an offering after a Verdict; followers keep full Memory and can be Lured, Waver visibly and leave under a budget with warnings |
| Information | Interrogating enemies, finding documents | Sniffing scent marks; gossip from cats who owe you; tips from cats who respect you |
| Time | Continuous | A day clock shared with a household story; time-skips that age and retire Rivals and bring in their kits with inherited feelings |
| The player's other life | None | Sanctuary at home, Wall Watch, curfew, the Call, the collar as an insult that fades with Clout |
| Endgame | Escalating war | A Reckoning that pays out gratitude and spite together, and a Last Walk of gestures |

**Elements that remain close to the inspiration** and that counsel should look at first: enemies that persist and remember encounters with the player; changes to an enemy's appearance, abilities and rank that depend on those encounters; promotion of an enemy that defeats the player; enemies fighting each other for rank while the player is absent; a screen showing the hierarchy.

**Levers available if counsel asks for more distance** (each has a design cost noted): remove promotion-on-player-loss in favour of Title only (weakens the brief's canon loss rule; needs creative-director approval); remove off-screen rank duels and keep only player-caused rank changes (flattens "cats hold a town in common"); present the Fence Line as a non-ranked gathering (weakens readability); move adaptation from individual Rivals to Clowder-wide habits. None of these should be pulled without advice.

---

## Assumptions for creative-director review

Things this document decided inside its boundary because the brief was silent, plus requests that cross a boundary.

**New terms introduced:** Regard; Gloat; temperament (Braggart, Brooder, Schemer, Fraidy, Stalwart, Goofball); quirk; Hanger-on; perch; Keeper; Roamer; Undermark; Old-Timer; Holdout; Pretender; Usurper; First Captain; First Thorn; Nodding Cat; Clean Duel; Spat; Wall Watch; Wavering; Restless; Settled; Turfed Out; Turncoat (as a Title and as the name of the betrayal outcome); Kit; Grand Standoff; Gone Over the Hill; Dread; Always a Way In; the Reckoning; the Last Walk.

**Decisions that touch canon:**
1. **A second meter, Regard,** alongside Grudge, stored in `rival{}` rather than in the One Cat Schema's top level. It is what makes Nose-Touch, clean conduct and Life 8 gratitude work.
2. **"8 tracked Rivals per district" is read as 8 perches** and an upper bound on hostile Rivals; Humbled, exiled, retired and Crew cats are tracked off-perch. Total tracked cats can reach about 120.
3. **Nameless Clowder members exist** (Hangers-on), because 8 Rivals cannot fill groups of up to 6 across 5 Patches. Combat should confirm the term.
4. **Authored Bosses cannot be deposed off-screen** while their district is unclaimed.
5. **Patch control does not depend on the Verdict.** Nose-Touch forgoes loot and Clout, not the post.
6. **Humble requires a player-held Patch in the district** and allows one resident per Patch.
7. **Fleeing never promotes a Rival.**
8. **A director-forced flee** exists exactly once (the First Thorn), and is cancelled if the player's result contradicts it.
9. **Rivals age, retire and have kits** across time-skips. Nobody dies on the streets; retirement is the only exit.
10. **Rival levels are capped at Mikan + 3** for growth, and grow at time-skips.
11. **The Usurper** in Life 8 is fought at Boss scale; its identity when Botan was Chased Off is left to Narrative.
12. **Address by Clout** (R10.6) assumes Economy's seven rank names as written in the brief.

**Requests to other owners (proposals, not decisions):**
- Combat: add `scattered` to `EncounterEnded.outcome`; give Pile-On a finisher damage type; value Dread, Overconfident, foiled Ambush, Spat allies, Wriggler; expose `well_fed`; honour `may_flee`.
- Contracts: new events `RivalTracked`, `RivalTraitChanged`, `RivalStateChanged`, `NemesisStatusChanged`, `IntelGained`; extra fields on `VerdictApplied` and `BetrayalTriggered`; new query `EncounterCast`.
- Territory: accept Keeper and resident ids; the `kept_by_friend` exemption in Life 8; a Sentry-Breaker modifier; decide what a Warden's Turncoat does to a claimed district.
- Economy: Humbled tribute value; Share a Morsel cost; return of `loot_held`; one Shiny for a first Clean Duel win and for Collectors; a cheaper offering for Gluttons.
- Crew: F18 as the starting Loyalty; Loyalty inputs from `HELD_FIRM`, `LURED`, posting and Posse time; recruiting a Humbled resident by interaction at Regard ≥ 50.
- UX: 8-character limit on renaming Mikan; Fence Line opened at the Doorstep and the Lot only.
- Level Design: patrol paths, a Grand Standoff landmark and `fear_sources` per district; the lane wall opposite Haru's gate.

**Cross-system facts that should go into `design/registry/entities.yaml`** (not added; needs approval): `nemesis_threshold` 75; `wavering_threshold` 30; perches per district 1/2/5; `rival_level_cap_offset` 3; Humbled residents 1 per Patch; the six temperaments; the Fear and Strength catalogues; formulas F2, F6, F11, F18.

## Open Questions / Known Weak Spots

Honest list. Items marked **(weak)** are places where the author expects the design to be wrong or thin.

| # | Question or weak spot | Owner | Needed by | Resolution |
|---|---|---|---|---|
| 1 | **(weak) Nothing here has been simulated.** Every number is a reasoned first guess. The simulation spec must run before any of this is implemented; expect the Grudge cap, Simmer and `p_duel` to move | systems-designer | Before vertical-slice implementation | Open |
| 2 | **(weak) Too many moving parts for the slice.** Temperaments, quirks, two meters, 13 Fears, 16 Strengths, Spats, Clean Duels, Kits, Wall Watch. A slice cut is needed: proposed minimum is R2–R7, R9 without Spats, R10, R11, R12; no Kits, no Clean Duels, 5 Fears, 8 Strengths, 8 quirks | producer + creative-director | Slice scope lock | Open |
| 3 | **(weak) Humbled residents may become upkeep.** Share a Morsel and Stare Down are a daily visit loop, which leans toward the chores the anti-pillars forbid. The Settled rule dampens it; it may not be enough. Alternative: no interactions, Simmer handled only by Sentries | creative-director | Slice playtest | Open |
| 4 | **(weak) The top of the wall is static.** Authored Bosses cannot be deposed off-screen, so the most visible seat never changes without the player. First Captain is a thin substitute | narrative-director + systems-designer | Alpha | Open |
| 5 | **(weak) The First Thorn's forced flee is a scripted cheat** in a system whose promise is that results are earned. It is cancelled when the player's play contradicts it, but players may still feel robbed of a first win. Alternative: let the first fight resolve and rely on R12.2 escalation only | game-designer | Slice playtest | Open |
| 6 | **(weak) Players who never lose** still miss promotion, Gloats and Glory Titles, half the system's colour. Verdicts and comebacks carry them, but whether that is enough is unproven. Should Feral mode, or a streak of wins, raise Rival aggression? The brief says modes do not touch nemesis | creative-director | Slice playtest | Open |
| 7 | **(weak) Readability from above.** Scars are small and cats are small. If Scars and coats cannot be told apart at bird's-eye distance, Memory is carried by the card and the bark alone. Needs an art test before the Scar catalogue is locked | art-director | Art bible | Open |
| 8 | **(weak) Bark volume and repetition.** About 250 lines for the slice and 1,200 for full vision are guesses. Without voice, repetition will show quickly, and 60 characters with slots is tight in languages longer than English. Localisation may need per-language slot budgets | narrative-director + localisation | Slice | Open |
| 9 | **(weak) Regard is invisible in fiction until late.** Players may not understand why a Nose-Touch was snubbed. The tell is the only teaching tool; it may need a one-time tutorial line | ux-designer | Slice playtest | Open |
| 10 | **(weak) The Reckoning could feel like punishment for grief.** Life 8 raises every pressure exactly when the home story is at its saddest. The brief wants this ("the empire rots"); the tuning must make it melancholy and recoverable, not frustrating. No numbers here are validated for that | creative-director + narrative-director | Alpha | Open |
| 11 | **(weak) Fifteen years of cats.** Rivals met in Life 2 would be very old by Life 8. Retirement and Kits paper over it; whether Crew cats age, retire or are simply cartoon-immortal is undecided and affects the Loyalty Test fantasy | creative-director + Crew owner | Alpha | Open |
| 12 | **(weak) Old districts and level relevance.** The time-skip growth factor is the only thing keeping Holdouts meaningful against a Lv 40 Posse. Raid math is Territory's; the two documents must be tuned together | systems-designer + Territory owner | Cross-GDD review | Open |
| 13 | **(weak) Name tables** are placeholder romanised Japanese nouns. They need a native-speaker and cultural review, a check for unintended meanings, and a legal/IP blocklist | narrative-director | Slice | Open |
| 14 | Can Mikan be Scarred or Titled by Rivals? It would mirror the system on the protagonist, but touches the fixed iconic design and the ageing arc | creative-director + art-director | Art bible | Open |
| 15 | Botan: which Verdicts are offered after the final Den fight, and can Botan be Recruited? Is a Chased-Off Botan the Usurper? | narrative-director | Alpha | Open |
| 16 | Should Crew cats recruited as Strays ever Waver, or is betrayal reserved for ex-Rivals as drafted? | Crew owner + creative-director | Cross-GDD review | Open |
| 17 | Should Nose-Touch acceptance be deterministic (thresholds on the tell) rather than a roll? A roll adds stories; a threshold adds mastery | game-designer | Slice playtest | Open |
| 18 | Spat allies and crashers push against Combat's 10-cat cap and 45–90 s target. Combat may reject either | Combat owner | Cross-GDD review | Open |
| 19 | Is a Peeve trait category (things that enrage a Rival, the opposite of a Fear) worth adding later? Left out to respect the brief's four trait categories | creative-director | Post-slice | Open |
| 20 | Does the Fence Line show Rival moods as faces, tails or something more cat-true? Data supports any; UX to decide | ux-designer | UX spec | Open |
| 21 | Patent review (Appendix B). Blocking for public showing; advisable before slice scope lock | producer + legal counsel | Before slice scope lock | Open |
| 22 | Secret Collar discovery relies on following a trail at Dusk into a human home's garden. Does that conflict with level boundaries or with "humans are never enemies"? | level-designer + narrative-director | Alpha | Open |
| 23 | Save size and performance figures in Acceptance Criteria are estimates with no engine chosen | technical-director | After engine decision | Open |





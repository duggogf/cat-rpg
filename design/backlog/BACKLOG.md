# Consolidated Post-Slice Backlog — Cat RPG

*Compiled by the producer, 2026-11-24, from every `## Backlog (post-slice)` section in the design set and the Backlog sections of `design/reviews/round-2/*.md`. **Updated 2026-11-24 for the owner-feedback pass** (comments C1–C6, rulings OR-01…OR-21 in `design/reviews/owner-feedback-rulings.md`, consistency pass F1–F12 in `design/reviews/owner-feedback/consistency-pass.md`, brief v1.6): new items are marked **(OF)**, and items the pass made moot are moved to "Cut or moot" at the end. The source docs remain the owners; this file is an index, de-duplicated and prioritised. When an item ships or is cut, update the owning doc first, then this file.*

**Priority key**
- **Next**: open questions and tuning levers the slice prototype or first playable must settle; doc alignments; anything a playtest acceptance criterion depends on.
- **Later**: full mechanical scope after the slice (Alpha): three districts, more Styles, more Rivals and Crew, handheld.
- **Full game**: Lives 3–9 content, Life 8–9 systems, content-complete catalogues.

**Source abbreviations** (all paths under `design/`): **OR** [`reviews/owner-feedback-rulings.md`](../reviews/owner-feedback-rulings.md) · **CP** [`reviews/owner-feedback/consistency-pass.md`](../reviews/owner-feedback/consistency-pass.md) · **CB** [`gdd/combat-system.md`](../gdd/combat-system.md) · **CR** [`gdd/crew-and-progression.md`](../gdd/crew-and-progression.md) · **NM** [`gdd/nemesis-system.md`](../gdd/nemesis-system.md) · **TE** [`gdd/territory-management.md`](../gdd/territory-management.md) · **DL** [`gdd/day-loop.md`](../gdd/day-loop.md) · **CA** [`gdd/camera-system.md`](../gdd/camera-system.md) · **DS** [`narrative/dual-story-progression.md`](../narrative/dual-story-progression.md) · **AB** [`art/art-bible.md`](../art/art-bible.md) · **SB** [`audio/sound-bible.md`](../audio/sound-bible.md) · **HUD** [`ux/hud.md`](../ux/hud.md) · **KS** [`ux/key-screens.md`](../ux/key-screens.md) · **AX** [`accessibility-requirements.md`](../accessibility-requirements.md) · **R2-CC** [`reviews/round-2/combat-and-crew.md`](../reviews/round-2/combat-and-crew.md) · **R2-NTD** [`reviews/round-2/nemesis-territory-dayloop.md`](../reviews/round-2/nemesis-territory-dayloop.md) · **R2-P** [`reviews/round-2/presentation.md`](../reviews/round-2/presentation.md)

---

## Cross-doc alignments (Next)

| Item | Priority | Source |
|---|---|---|
| First-hour clock: now aligned (K1.4 at ≈ 0:40–0:45 in DL and KS §7.3); re-time both together against the first playable | Next | DL, KS |
| **(OF)** C6 Rivals board: KS §2 is done as per-gang perspective scenes with final role tags and the preview is redrawn; remaining: rename the preview file `06-fence-line.*` to `06-rivals-board.*` (gallery and GDD links follow) | Later | KS, NM, `GDD.md` §9 |
| **(OF)** Showcase-only seeds (challenger on L2D2, influence 95, forced Rival tag and join-in, a phase-1 Furious Daifuku) live in the plan's `showcase_overrides.json` and must never port as tuning | Next | `production/artifact-slice/IMPLEMENTATION-PLAN.md` §2.4, CP §5 item 5 |
| Daifuku and Kagi levels: Lv 8 / Bribe 256 (TE) vs Lv ≈ 9 / 288 (CR) vs Combat's leader-level rule; say which Lane Captains are "Den" Captains | Next | CB B-21, CR R-3, TE, R2-CC C-8 |
| Pile-On prompt word on its first 3 showings (CB §3.17) vs HUD hint card only: pick one after the combat prototype | Next | CB B-25, HUD, R2-P |
| Togemaru's Strength: Combat's ruling gives +15% Nerve, which is not on NM §3.9's slice Strength list. Reconcile the two lists | Next | NM, CR |
| Pon's join beat (crows at the laundry poles) sits on Laundry Pole Yard, Togemaru's Patch, on the same day: Narrative to confirm the beats don't collide | Next | CR |
| Confirm Audio §16.6: piano lid closed in Life 8 | Later | DS, R2-P |
| Life title cards: confirm "Uniform" and the others are written from the cat's side | Next | DS, R2-P |

---

## Owner-feedback pass: deferred (OF)

Carried from CP §5 and the revisers' hand-backs. The design docs, `GDD.md` v1.2 and the showcase plan v2 are already compiled.

| Item | Priority | Source |
|---|---|---|
| **Crew sim:** run Lives 1–2 for AC-23 (betrayal rate: 0% reference, ≤ 10% neglect) and AC-6 (pacing) under OR-01/02 and the fair-minimum Bribe. The slice bound is analytic only | Next | CP §5.1, CR |
| **Playtest AC 4** with the quiet-take gate: Verdict shares (none > 60%; ≥ 70% use ≥ 2) and whether testers can say why a Nose-Touch card closed. If Nose-Touch still exceeds 60%, lower the gate base within 40–60; if they can't say why, strengthen the card line first | Next | CP §5.2, NM |
| **Audio:** the moon-blue Late form of K1.3 with the Call; Daifuku's yowl as an in-view, uninterrupted beat on L2D3 | Next | CP §5.4, SB |
| **L2D3 budget:** 24.9 min typical with no slack; a paused reveal makes it 25.1, so the window reveal must stay in view on the running clock | Next | CP §5.7, DL |
| **Counsel packet additions:** the F12 gate (reads only the cat's own record, post and anger); the Usurper's "no Boss on the street" check; the C6 board's role tags and answers-to arrows (a more visible hierarchy, display only); plus the standing G10 watch items and OR-19 residuals. Counsel review still blocks scope lock and any public showing | Next | CP §5.8, NM §6.4, legal v2 §8 |
| Influence legibility: if playtesters lose track of the bar, add KS A-7's street post strip (gold = held Strong) | Next (playtest) | CP §4 C3, KS A-7 |
| Typical play meets Daifuku Riled, not Furious: if the owner wants a Furious Boss without loud play, lower anger decay within 10–20 or raise Counter-Spray within +10–20, then re-sim | Next (owner call) | NM |
| Posting stakes fell to +24% slice / +33% raid nights: watch the "stand out" score in playtest; no change now | Next (watch) | CP F10, TE |
| A boss-voiced, line-only taunt at a defector, only if counsel clears it (owner accepted the recruit-side flinch meanwhile) | Later (counsel) | OR-06, NM §3.18, CB B-26, KS |
| **Usurper:** build and sim with Life 3 (NM §3.20; TE §3.7's Den admissibility exception); unreachable in the slice | Later | CP §5.3, NM, TE |
| Captain-tier challengers from Life 3; challenger calendars across districts (no tiers, waves or factions, OR-18) | Later | NM, TE |
| Influence across three districts and the Summit (one bar per district; can two windows be open at once?) | Later | TE, KS, NM |
| Casual pacing watch: under the all-four-Strong gate the casual window opens by day 10 in 68% of runs; levers `I_full` 90 or claim Scent 75 (owner-visible) | Later (watch) | TE |
| A loss-day budget per Life for Lives 3–7 (Night-heavy districts lose more roaming to the Night jump) | Later | DL |
| If the closed walk home reads as dead air: one Mikan inner beat or an ambient cat glance (no line keyed to other cats, G8) | Next (playtest) | DL |
| A variance model for the Daifuku sim so the wipe rate can be read per anger stage | Next | CB B-29 |

---

## Combat

| Item | Priority | Source |
|---|---|---|
| Optional rule trim for the slice: cut the 6 s Relay lockout; one fixed High Road Pounce (MV 2.5, FZ 35, 3 s re-use) replacing Wind-Up, perch Paw-stop, "enemies prefer perched cats" and the mantle penalty; Fear diminishing "full once, then tell only"; drop the Hiss Paw-spend unless a Hiss loop appears | Next | CB B-15, R2-CC C-1 |
| F9 realism: whole-Paw arrival in F9 and AC 1; decide whether 1-Paw Set-ups trade damage for the state (catalogue ≈ 2.1–2.5 MV/Paw vs 3.5 budget) or Pay-off MV rises | Next | CB B-16, R2-CC C-3 |
| AI Paw habits rarely fire (first self-cast ≈ 60 s): AI may self-cast at 1 Paw when the controlled cat holds ≥ 1, or `ai_fill` 0.6 for the slice | Next | CB B-17, R2-CC C-4 |
| Scope AC 16's "≥ 3 commanded Moves per encounter" to normal encounters (threat 4–6) and Captains | Next | CB B-18, R2-CC C-5 |
| Zoomies pace (F8 ≈ 0.7 per cat per encounter, not 0.5): `zoomies_per_frazzle` 5, or count only Captain/Boss Frazzles | Next | CB B-19, R2-CC C-6 |
| Yowler basics strongest (Voice 1.35, multi-target cone): watch, or normalise `Off` by Style offence weight | Next | CB B-20, R2-CC C-7 |
| Rival personality AI: one target-choice bias per personality for enemies | Next | CB B-22, R2-CC C-9 |
| Stalwart reads weakly → adopt "step into white telegraphs aimed at the controlled cat" | Next | CB B-23, R2-CC C-10 |
| Check in the prototype that a Life 1 kitten can beat Togemaru (Scrapper, resists Claw) | Next | NM, R2-NTD |
| Final Frazzle decay values (interim rank-scaled defaults in §3.5) | Next | CB B-5 |
| Hit-stop 0% option ships only once fairness is confirmed | Next | CB B-25, AX, R2-P |
| Shake model: if Combat ever keeps both the stepped ×0.6 decay and a trauma accumulator, re-run camera test T5 on the combined output | Next | CA, R2-P |
| Showpiece safety capture: Harding test on a Pile-On whose final beat is a Boss phase break (densest allowed moment) | Next | R2-P |
| Slice body ≈ 57 KB vs 50 KB target: move rumble/punch-in rows to data, trim the log | Later | CB B-24, R2-CC C-11 |
| Damage-display ceiling at Lv 30 with the 1.6 amplifier cap | Later | CB B-7 |
| Zoomies budget audit for area and prop-activating Zoomies | Later | CB B-9 |
| Arithmetic slips in deleted first-draft formulas (reference path now in CR) | Later | CB B-8 |
| FF7R/Rebirth reference table corrections | Later | CB B-6 |
| Full catalogue: ≈ 45 Style Moves + 4 Home Moves; Prowler and Trickster strings, Tag-In strikes and Zoomies (*Nine Shadows*, *Everything Off The Shelf* reserved); 3-Paw budget row; Mikan's third Paw from Life 4 | Later | CB B-1 |
| Non-slice Moves re-specified as Set-up or Pay-off: Dirt Kick, Loaf, Neck Nip, Vanish, Shadow Step, Wall-Kick, Bait, Leap | Later | CB B-2 |
| Knacks (merge duplicates; +10–15% of one channel; no new verbs) and Tactics | Later | CB B-3, CR |
| PG ×0.7 on ranged basics (once the Trickster ships) | Later | CB B-4 |
| Crowd-fight readability beyond 6 enemies; one-handed presets | Later | CB B-13, CA, AB, HUD |
| Handheld feel scaling (shake ×0.8, glyphs ×1.2) | Later | CB B-12 |
| Over-level tuning across Lv 1–30 (re-derive K from Crew's full curve) | Later | CB B-14 |
| Botan (4–5 min, four phases), Madam Sabi, Oboro, Ikari Boss kits; rats, weasel, chained dog; the Usurper | Full game | CB B-10 |
| **(OF)** Rival personality AI for join-in guests beyond the own-Rival bias (with B-22) | Later | CB B-27 |
| **(OF)** Boss anger for Madam Sabi, Oboro, Ikari (same F11 tiers) | Later | CB B-28 |
| Life 8–9: AI fill 60/70/100% and Carry escort combat | Full game | CB B-11 |

## Crew and Progression

| Item | Priority | Source |
|---|---|---|
| Brooder dismissal arithmetic: −10 raw → −5 conflicts with the ±8 daily clamp (→ −4). Set dismissal to −8 raw, or exempt it from `DAILY_CAP` | Next | CR R-1, R2-CC R-1 |
| Confirm AC-6 / F2 pacing in the Lives 1–2 economy sim with Combat's real encounter lengths | Next | CR R-5, R2-CC R-5 |
| Brooder visibility: no tester fights beside Brooder AI in the slice; prototype with Stalwart Hige, Goofball Pon, Braggart Togemaru and test the Brooder in the grey box | Next | CR X-1, R2-CC X-1 |
| Slice body ≈ 79 KB after the owner pass (≈ 54 KB before) vs 50 KB target | Later | CR R-4 |
| Watching (learn a Move by watching it used) | Later | CR CP-7, KS |
| Full catalogue audit and learnsets for Prowler and Trickster; Lesson Ranks III–IV (300/600) | Later | CR CP-10 |
| Signature Moves (teachable only by their owner) | Later | CR |
| Knack slots and learn routes | Later | CR, KS |
| Stat and XP curves for Lv 1–30; `FPL_CAP` | Later | CR |
| Generic Stray recruiting; one Friend Stray per district | Later | CR |
| **(OF)** Kin content: a recruitable Kin pair (e.g. Sasa with Kinako) so the Kin bond plays | Later | CR |
| **(OF)** G10 watch items (CR §3.7.6 W1–W3, the join-in): revisit when the '303 claims are final; the betrayal firewall stays until counsel relaxes it | Later (counsel) | CR, NM §6.4 |
| Neglect pride by rank (ex-Captains and Bosses wanting prestige posts) | Later | CR |
| Multi-district social rules; a Warden per district | Later | CR |
| Prowler and Trickster personality AI notes | Later | CR |
| AI fill by Life (ruled in DR-35: 50/60/70/100%); Crew adds no modifiers | Full game | CR |
| Home Moves (Biscuits, Bell Ringer, Come Running, Crib Guard), Bond-gated | Full game | CR, AB, SB, KS |
| Mikan's ageing: Life-stage stat rows, the elder arc | Full game | CR, AB, SB |
| The heir (Life 9), Sworn eligibility | Full game | CR, KS, HUD |
| Life 8 Loyalty (no absence drain) and Life 9 Crew-carries numbers | Full game | CR |

## Rivals (Nemesis)

| Item | Priority | Source |
|---|---|---|
| Deadline Declarations: only lose-40 players still declare at the deadline (19%) after the counted greeting (F11); playtest whether they read as earned | Next (watch) | NM, CP F11 |
| Keep NM's ≤ 1 Rival Ambush a day aligned with DL's ceiling when Life 3+ budgets are set | Later | NM, DL, R2-NTD |
| The Lane slot returns in Life 3: re-sim per-district slots for 3 districts (one district drifts to 15–18% at Grudge ≥ 75 by day 30) | Later | NM, R2-NTD |
| Betrayal beyond the slice (live from Life 2 for posted ex-Rivals; OR-11): multi-district tuning once the Crew sim reports the rate | Later | NM, CR |
| Full population (27 gang places + ≤ 12 off-wall), legend records, save-size budget | Later | NM NS-10 |
| Holdouts in claimed districts and the naming split with Territory | Later | NM NS-17, NS-C10 |
| Multi-district behaviour and a Nemesis slot per district | Later | NM |
| Portrait Scars after two silhouette Scars; full Scar catalogue; full Titles list | Later | NM, AB |
| Fears beyond the 3 slice Fears (Outnumbered, Brooms, Dogs, The Bell…) with Overcome/Dread; Strengths beyond the slice 9 | Later | NM |
| Quirks (≤ 6 when they return) | Later | NM |
| Clean Duels and a status-resolving Standoff for every Friend | Later | NM |
| A player-choice override for which Routed cat gets the Verdict | Later | NM |
| Wall Watch: the **victor** of a wipe sits opposite Haru's gate the next morning (victor only, G1/G8) | Later | NM, KS |
| Kits (from cats with history, ≤ 1 per Life) | Later | NM NX-11, AB, KS |
| Ageing, retirement, Old-Timers | Full game | NM |
| Botan's Verdict (Nose-Touch only; the hand-bell calls her home); her "Collar" hypocrisy payoff and Secret Collar quirk | Full game | NM, KS |
| Life 8 Reckoning (state on return, gratitude first, Ambush budget 0, optional Usurper) | Full game | NM NX-13 |
| Rewrite the archived A.2 (Sumi) and A.3 (Buri/Aji) stories | Full game | NM NS-14 |
| Epilogue `wall_friend` / `wall_nemesis` candidates | Full game | NM NX-C6 |
| Full bark budget (≤ 700) and the `CREW_SPOTTED`, `WAVERING`, `LAST_WALK` triggers | Full game | NM |
| Note kept: NS-15 moot while Spats and duels are cut | — | NM |

## Territory and Economy

| Item | Priority | Source |
|---|---|---|
| Raid stakes before the claim (Lost impossible while the Boss window is open). Unused lever if territory AC 17/22 fail: a Routed Sentry costs −3 Loyalty; or Captain-led `gang_orders` at 1.5× a Sentry's PR so Hige is not automatically safe | Next | TE, R2-NTD |
| Measure Lot time on L2D2, the first Turf Board day (DL 22.4 typical / 28.9 heavy) | Next | TE, DL |
| Brooder guard perk never comes into play in the slice (accepted) | Next (watch) | TE, R2-NTD |
| §4.13 "wiping is strictly dominated" holds for Morsels; a wipe before clock 240 skips the day sooner than Settle In (accepted, costs are real) | Next (watch) | TE, R2-NTD |
| Adjacency rule across 3 districts: per-district boards and a cap on stacked neighbour bonuses | Later | TE |
| Whole-game sinks and the Life 7 surplus (Stash 3,000–6,000 at end of Life 7; ≤ 15% spoilage) | Later | TE TE-4 |
| Late Tribute anchors (L4, L7) | Later | TE TE-9 |
| Stash cap tiers beyond 400 (Lot upgrades) | Later | TE TE-10.2 |
| Shiny table (≈ 50) and sinks (Rank III–IV Lessons) | Later | TE TE-X9 |
| Prowler (Lookout) and Trickster guard roles | Later | TE |
| Patch upgrades (Claimed-In) and Lot upgrades (Cushion Pile I) | Later | TE |
| Multi-district raids, request budgets above 1 a night, district Claim Bonuses; Caterwaul beyond the current district | Later | TE, DL, HUD |
| Turf Board across three districts and the Summit | Later | TE, KS |
| Arcade, Shiosai and Summit Patch tables (re-cut the first draft's 30 to 20) | Later | TE |
| Full Clout table effects (Crew cap 7–12, Sentry slots 3–8) | Later | TE |
| Multi-district pacing items from the paper playtest (PP-35, PP-36) | Later | TE |
| Loyalty inputs from the cut systems (Rations, cushy posts, Lot comfort): reintroduce only through Crew's formula | Later | TE TE-X5 |
| Food-pile dressing per district; Leftover-sweeping vignette variants | Full game | TE |
| Life 8 territory numbers (no Doorstep deliveries; Fresh Catch; Carry sources); Vigil ordering and survivor targets | Full game | TE TE-1/5, TE-10.7/10.8 |
| Moot or cut, kept for the record: hour-26 figure, Specialisations and Skim, Strategy E, the Life 8 Warden gate | — | TE |

## Day Loop

| Item | Priority | Source |
|---|---|---|
| Budget the Lot at 1.5–2 min on first-use days; measure Lot and Doorstep time first | Next | DL, R2-NTD |
| L2D3 out all Night (Late Home + K2.2) has almost no slack (24.9 typical / 28.9 heavy): if it overruns, move the Tofu Shop Step take earlier or trim the Night roam | Next | DL |
| A mid-day home visit with a small reason to exist (a Texture slot), if the quiet house reads as dead | Next (playtest) | DL |
| Telemetry dashboard for activity shares and budget alarms | Later | DL |
| The full-game day (≤ 35 min) with 3 districts, 12 Crew and more Sentries | Later | DL |
| Roof Run fast travel and multi-district Head Home, still ≤ 60 s | Later | DL, TE, CA, HUD, SB |
| Encounter density and Ambush budgets for Lives 3–7 (incl. the night-heavy shrine end) | Later | DL |
| Handheld suspend and resume under platform rules | Later | DL |
| Life 8 day rules (Sleep only from Dusk, the wait days, Ambush budget 0, no deliveries); Life 9 day (AI fill 70%, one farewell walk) | Full game | DL |

## Camera

| Item | Priority | Source |
|---|---|---|
| Dynamic Posse-wide framing as an option, if test T1 shows players want it | Next (playtest) | CA |
| Handheld tuning (30 fps step timing, lower FOV default, collision cast budget) | Later | CA |
| Arcade covered street, shrine stairs, Shiosai harbour collision profiles | Later | CA |
| Mouse smoothing and raw-input options | Later | CA |
| Per-character face heights for Sora, Koharu (child) and Gran | Later | CA |
| Lap/lift two-shot authoring tool; the ≈ 58-vignette shot library | Full game | CA |
| Summit and Botan fight framing; Life 8 Carry camera; Life 9 farewell shots | Full game | CA |
| Photo mode; a capture-friendly trailer camera (must pass the flash test) | Full game | CA, AB |

## Dual Story Progression

| Item | Priority | Source |
|---|---|---|
| Content-note wording (opt-in, Options) | Next | DS DS-C9.3 |
| Full vocabulary table (incl. the Life 4 sock-on-sock idiom; "black shoes = gone for good") | Later | DS DS-C3 |
| The ring and white dress as Tier B only (ruled; content later) | Later | DS |
| Full Sense Icon set (empty bowl, jagged burst, coral blob, paw) | Later | DS |
| Witness/Forensic dual staging for ≤ 1 evening Keystone per Life from Life 3; ≥ 70% morning-rule audit | Later | DS |
| Full House Memory and Echo prop states; a second Doorstep saucer for "Mikan's friends" | Full game | DS |
| Lives 3–9 vignettes: K3.1–K3.5 (the phone carries the complete Call), K4.2–K4.5 (Sora whistles), K5.1 Black Shoes, K6.x (Koharu, the Guard verb), K7.x (Fireworks; Botan's inverted Call), K9.x (the ending: Mikan alive in the morning, the bell last) | Full game | DS |
| Life 8 full spec to DR-27: Carries and escort numbers, Sleep-from-Dusk, Stash fail-safe, difficulty assist, the Season Turn hero image, Koharu's pathos cap, yellow and shoe rules, music return, comprehension staircase | Full game | DS |
| Montages 2→3 through 7→8 (Stage A instead of a montage before Life 8) | Full game | DS |
| Cuts confirmed: Sightings, essential-cut forms, Waiting-up vignettes, Echo vignettes | — | DS |

## Art

| Item | Priority | Source |
|---|---|---|
| Raincoat "bloom" as a Melody-presence twin: decide after the home mock (a stepped tone change, never a glow) | Next | AB, SB, R2-P |
| Whisker compass pointer count: keep 5 unless the compass test needs more | Next | AB, R2-P |
| Look-dev spike in Unreal Engine 5.8: prove the reference-close look (user decision 2026-11-24) against R-1–R-6 and E-1–E-9; record the shading/outline method in an ADR | Next | AB |
| Handheld budgets (1,800 triangles per cat, pass timings, streaming); handheld outlines and AA | Later | AB AB-10, AB-11 |
| Crowd readability below 6% screen height; readable axes at 48 px | Later | AB AB-2/3 |
| Arcade, Shiosai and Summit palettes; their Clowder colours under the ΔE 15 rule | Later | AB |
| Fang damage type and Prowler/Trickster drawings; Bite Violet vs Yowl Lilac | Later | AB, SB |
| Generator expansion (tails, ears, patterns, portrait head axis) | Later | AB |
| More lettering languages beyond English and Japanese | Later | AB |
| Madam Sabi, Oboro, Ikari, Botan hero designs | Full game | AB |
| Sora (teal, stripes) and Koharu (coral, dots); Pad Pink vs Koharu Coral | Full game | AB |
| Lives 3–9 colour script; Life 8 desaturation; montage look; Life 8 street look | Full game | AB |
| Mikan's ageing beyond Life 2 | Full game | AB |
| Home Moves, Knacks, Kits visual language; key-art compositions | Full game | AB |

## Audio

| Item | Priority | Source |
|---|---|---|
| Wide and Handheld loudness profiles; handheld memory budget | Later | SB |
| Yowl-sting states beyond 4 (a Gone farewell, a Nose-Touch truce, Scar crack, Betrayal, a challenger's stake) | Later | SB |
| Fang body, Trickster sounds, Knacks, Home Moves | Later | SB |
| More generic voice bodies (≈ 10); Mikan voice set C (greying to elder) | Later | SB |
| Lot theme second level; multi-district bleed; Night spatialised stings (only with a listening mechanic) | Later | SB |
| Full-game music ≤ 75 min; Arcade, Shiosai, Summit themes and colour instruments; Boss themes | Full game | SB DR-04 |
| Life 8 Stage A scoring; Carry cues; "Haru late" Melody rule across Lives 3–7 | Full game | SB SB-N1, N2, N4 |
| Non-slice beat cues (Lives 3–9) and Tap-Tap, Home Scent and glyph twins for Sora and Koharu; Sora is whistle and hum only | Full game | SB SB-N6, N7, N12, N14 |
| Cello and toy-piano lines; the Waiting form of the Call | Full game | SB |
| Translated ultrasound and Life 8 decay sounds; credits as a rearrangement | Full game | SB |

## UX: HUD and key screens

| Item | Priority | Source |
|---|---|---|
| Diamond plate cluster mirroring the D-pad: test against the stack after the prototype | Next | HUD |
| Rival card history lines: re-cut once Nemesis's day-1 flee / day-2 gatepost schedule is in the prototype | Next | KS |
| Rivals board "Last night" replay: one held hero frame (a newcomer landing at the Outsiders gate) for trailer capture; re-run the flash test on the replay beats | Next | KS, R2-P |
| Random-pause test at 10 combatants (full-game stress test) | Later | HUD |
| Per-screen split of the HUD and key-screen specs after the slice build | Later | HUD, KS |
| Handheld presets and the 720p check; per-device HUD scale | Later | HUD, AX |
| Full-game Rivals board: the Arcade, Shiosai and Summit gang scenes populated and discoverable; 20+ tracked cats; Botan on the lighthouse rail | Later | KS |
| Full-game Turf Board: one header bar per district, more Sentry slots, Roof Run hooks | Later | KS, TE |
| Kits, Wall Watch and the Usurper on the Rivals board | Later | KS |
| Handheld-console framing check for the Rivals board (fit at 720p) | Later | KS |
| Watching, Knack slots, Home Moves, Repertoire view; Tactics icons; Knack indicators | Later | KS, HUD |
| Mikan's third Paw pip | Later | HUD |
| Roof Run prompt | Later | HUD |
| Botan's ribbon variant and Verdict screen | Full game | HUD, KS |
| Life 8 HUD (Carry state, silenced Call glyph, Season Turn); Life 9 HUD and screens (AI fill, the heir) | Full game | HUD, KS |

## Accessibility

| Item | Priority | Source |
|---|---|---|
| Agree and implement the four Combat REQUESTs (Auto Slow Blink, wider Tag-In window, combat speed 70/85%, hold-to-string) | Next | AX |
| One-handed presets (prototype the right-stick-moves preset first) | Later | AX, HUD, KS, CB |
| Colour-blind palette presets (only if the shape twins fail testing) | Later | AX |
| Handheld (720p) verification of text and safety rules | Later | AX |
| Screen-reader / menu narration for system UI (never human content) | Later | AX |
| Full-game audit against a named accessibility tier | Later | AX |
| Life 8 carriers (the silenced Call; Home Scent note) | Full game | AX |

---

## Review items already resolved in iteration 3 (not open)

Recorded so nobody re-files them. Each was a round-2 Backlog item that the owning doc took in its final pass (see that doc's Revision Log).

- **Combat:** Bruiser Captain over band → `captain_style_nerve` off (R2-CC C-2); Crew Zoomies unlock at Lv 6 cited, AC 7 at Lv 1–10 (C-12); "leader" keeps Combat's meaning (X-2).
- **Crew:** the "no Style passive" line deleted (R2-CC R-2); Kagi retagged Captain of Tofu Shop Step (R2-NTD).
- **Territory:** AC 3 restated as ≤ 7 a day; S1/S2 named Hige and Togemaru; K2.5 day gate pinned to L2D4 (R2-NTD).
- **Day loop:** Nemesis's ≤ 1 Ambush a day stated as the slice value inside §3.7's ceiling; mid-day visit wording (Gran is home) (R2-NTD, R2-P).
- **Narrative:** storyboard metres stated as camera heights (R2-P).
- **Art:** SCRAMBLE replaced by a sound-word; Titles shown as stamp plus readable text (R2-P).
- **Audio:** collar-on beat follows Narrative; K2.2 desk humming resolved (R2-P).
- **HUD:** Tag-In ease cites Camera's 0.3 s; random-pause test at 6 enemies + Posse (R2-P).
- **Accessibility:** Reduce Flashes wording now Combat's; hit-stop 0% marked REQUEST (R2-P).
- **Camera:** size table restated at Art's 1.25× scale (R2-P).
- **Nemesis:** the Lives 1–2 Grudge ≥ 60 arc-slot question was superseded by the Declaration rule (one declared Nemesis per slice) (R2-NTD).

- **Owner-feedback and consistency passes (2026-11-24):** the K1.4 clock time and the Turf Board day (aligned); the challenger's first night (night 5, the L2D4 Sniff, F3); the Boss window's reference day (L2D3, F7); `MarkApplied` (F8); the Bribe tiers (no free tier from Life 2, F1); the story doc's wipe (Night, not Dusk, F2); the Sniff priority order; Togemaru's arc as three complete endings (F11); the Nose-Touch gate as a real choice (F12); deadline Declarations for Nose-Touch players (now night 3); the GDD and showcase-plan compiles (CP §5 items 5–6).

## Cut or moot (owner-feedback pass)

Recorded so nobody re-files them (OR-21 is the full delete list).

- **Humble** and all of it: simmer, Restless, uprisings, the Undermark crate, Humbled Tribute, the Goofball's "never simmer" perk, the Stalwart's Humble dislike, the crate challenge, "Humble's visible cost" (was a Next item), Botan's "Humble or Nose-Touch".
- **The Fence Line** (height = rank, seats, Away paw prints), `RivalRankChanged` / `WallEvent` (now `TownEvent`).
- **Comes Knocking** (NM NS-C8; a fourth recruit route against C4).
- **Chase Off comebacks:** Away, the Grand Standoff, "2nd and 3rd comeback forms", "Away per district".
- **Seats and promotions:** loss promotion, refill by Roamer, lead re-naming, "recruiting the declared Nemesis: how the slot passes on" (Recruit is open on him; the slot stays his as a record).
- **Stewing** and gossip-borne Titles; the Nose-Touch roll and snubs, and the pacifist snub bound; Mark Over and Snatch; the Den gate; fight-driven Scent; `pretender` and `boss_orders` (now `challenge` and `gang_orders`).
- **Phone support for the browser showcase** (owner decision): touch controls, the phone tier and phone tests.

---

## Content reservoir and history

- **[`first-drafts/`](first-drafts/)** holds the archived full-game first drafts of nine docs (art bible, combat, crew, dual story, HUD, key screens, nemesis, sound bible, territory). They predate the slice cut and the round-1 rulings, so they are **not canon**, but they are the content reservoir for every "Later" and "Full game" item above: Lives 3–9 vignette drafts, the 30-Patch table, the wider Move, Title, Fear and Strength lists, Boss kits, and the archived Rival stories. Re-cut anything taken from them against the current brief.
- **[`../reviews/`](../reviews/)** holds the critique history: [`REVIEW-PROTOCOL.md`](../reviews/REVIEW-PROTOCOL.md), round 1 (specialist critiques, the paper playtest and [`director-rulings.md`](../reviews/round-1/director-rulings.md), the binding DR-xx rulings), round 2 (cross-doc checks with rulings R1–R5 and the sims in `round-2/sim/`), and round 3 (final sims in `round-3/sim/`). Read a review when a Backlog item cites it, or before reopening a ruled decision.

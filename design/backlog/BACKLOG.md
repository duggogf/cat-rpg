# Consolidated Post-Slice Backlog — Cat RPG

*Compiled by the producer, 2026-11-24, from every `## Backlog (post-slice)` section in the design set and the Backlog sections of `design/reviews/round-2/*.md`. The source docs remain the owners; this file is an index, de-duplicated and prioritised. When an item ships or is cut, update the owning doc first, then this file.*

**Priority key**
- **Next**: open questions and tuning levers the slice prototype or first playable must settle; doc alignments; anything a playtest acceptance criterion depends on.
- **Later**: full mechanical scope after the slice (Alpha): three districts, more Styles, more Rivals and Crew, handheld.
- **Full game**: Lives 3–9 content, Life 8–9 systems, content-complete catalogues.

**Source abbreviations** (all paths under `design/`): **CB** [`gdd/combat-system.md`](../gdd/combat-system.md) · **CR** [`gdd/crew-and-progression.md`](../gdd/crew-and-progression.md) · **NM** [`gdd/nemesis-system.md`](../gdd/nemesis-system.md) · **TE** [`gdd/territory-management.md`](../gdd/territory-management.md) · **DL** [`gdd/day-loop.md`](../gdd/day-loop.md) · **CA** [`gdd/camera-system.md`](../gdd/camera-system.md) · **DS** [`narrative/dual-story-progression.md`](../narrative/dual-story-progression.md) · **AB** [`art/art-bible.md`](../art/art-bible.md) · **SB** [`audio/sound-bible.md`](../audio/sound-bible.md) · **HUD** [`ux/hud.md`](../ux/hud.md) · **KS** [`ux/key-screens.md`](../ux/key-screens.md) · **AX** [`accessibility-requirements.md`](../accessibility-requirements.md) · **R2-CC** [`reviews/round-2/combat-and-crew.md`](../reviews/round-2/combat-and-crew.md) · **R2-NTD** [`reviews/round-2/nemesis-territory-dayloop.md`](../reviews/round-2/nemesis-territory-dayloop.md) · **R2-P** [`reviews/round-2/presentation.md`](../reviews/round-2/presentation.md)

---

## Cross-doc alignments (Next)

| Item | Priority | Source |
|---|---|---|
| First-hour clock: K1.4 at ≈ 0:40–0:45 (DL) vs 0:52–0:57 (KS §7.3). Re-time both against the first playable | Next | DL, KS, DS, R2-P |
| Turf Board / Sentries teaching day: L2D2 per the presentation ruling (DL, TE, NM follow it) vs L2D1 in KS §7.4's table. Align; L2D1 is also DL's lever if L2D2 runs heavy | Next | DL, TE, KS, R2-NTD |
| Daifuku and Kagi levels: Lv 8 / Bribe 256 (TE) vs Lv ≈ 9 / 288 (CR) vs Combat's leader-level rule; say which Lane Captains are "Den" Captains | Next | CB B-21, CR R-3, TE, R2-CC C-8 |
| Pile-On prompt word on its first 3 showings (CB §3.17) vs HUD hint card only: pick one after the combat prototype | Next | CB B-25, HUD, R2-P |
| Togemaru's Strength: Combat's ruling gives +15% Nerve, which is not on NM §3.9's slice Strength list. Reconcile the two lists | Next | NM, CR |
| Pon's join beat (crows at the laundry poles) sits on Laundry Pole Yard, Togemaru's Patch, on the same day: Narrative to confirm the beats don't collide | Next | CR |
| Confirm Audio §16.6: piano lid closed in Life 8 | Later | DS, R2-P |
| Life title cards: confirm "Uniform" and the others are written from the cat's side | Next | DS, R2-P |

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
| Life 8–9: AI fill 60/70/100% and Carry escort combat | Full game | CB B-11 |

## Crew and Progression

| Item | Priority | Source |
|---|---|---|
| Brooder dismissal arithmetic: −10 raw → −5 conflicts with the ±8 daily clamp (→ −4). Set dismissal to −8 raw, or exempt it from `DAILY_CAP` | Next | CR R-1, R2-CC R-1 |
| Confirm AC-6 / F2 pacing in the Lives 1–2 economy sim with Combat's real encounter lengths | Next | CR R-5, R2-CC R-5 |
| Brooder visibility: no tester fights beside Brooder AI in the slice; prototype with Stalwart Hige, Goofball Pon, Braggart Togemaru and test the Brooder in the grey box | Next | CR X-1, R2-CC X-1 |
| Slice body ≈ 54 KB vs 50 KB target | Later | CR R-4, R2-CC R-4 |
| Watching (learn a Move by watching it used) | Later | CR CP-7, KS |
| Full catalogue audit and learnsets for Prowler and Trickster; Lesson Ranks III–IV (300/600) | Later | CR CP-10 |
| Signature Moves (teachable only by their owner) | Later | CR |
| Knack slots and learn routes | Later | CR, KS |
| Stat and XP curves for Lv 1–30; `FPL_CAP` | Later | CR |
| Generic Stray recruiting; one Friend Stray per district | Later | CR |
| Comes Knocking (a high-Regard friend asks to join, ≤ 1 per Life; Nemesis decides when) | Later | CR, NM NS-C8, KS |
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
| Humble's visible cost inside 7 days (mostly Restless warnings, ≈ 0.01 uprisings per slice): if Humble dominates, raise simmer within 5–10 or start at +12 on the first Unwatched night | Next | NM |
| Deadline Declarations name a lead with < 3 encounters for 37–48% of mixed and lose-40 players: playtest whether they read as earned; levers are the deadline night and a guaranteed L2D2 placement | Next | NM |
| Restate the pacifist "P(no friend arc)" bound as a pacing figure (the Declaration carries the guarantee) | Next | NM, R2-NTD |
| Keep NM's ≤ 1 Rival Ambush a day aligned with DL's ceiling when Life 3+ budgets are set | Later | NM, DL, R2-NTD |
| The Lane slot returns in Life 3: re-sim per-district slots for 3 districts (one district drifts to 15–18% at Grudge ≥ 75 by day 30) | Later | NM, R2-NTD |
| Recruiting the declared Nemesis after the slice ("the score is settled"): how the slot passes on | Later | NM |
| Betrayal tuning (Wavering < 30, Turncoat) and the Lure replacement; Turncoat takes a Patch only if posted and Unwatched | Later | NM NS-2, NS-C15, KS |
| 2nd and 3rd comeback forms beyond the Lane | Later | NM NX-08 |
| Away per district; full population (27 seats + ≤ 12 off-wall), legend records, save-size budget | Later | NM NS-7, NS-10 |
| Holdouts in claimed districts and the naming split with Territory | Later | NM NS-17, NS-C10 |
| Multi-district behaviour and a Nemesis slot per district | Later | NM |
| Portrait Scars after two silhouette Scars; full Scar catalogue; full Titles list | Later | NM, AB |
| Fears beyond the 3 slice Fears (Outnumbered, Brooms, Dogs, The Bell…) with Overcome/Dread; Strengths beyond the slice 9 | Later | NM |
| Quirks (≤ 6 when they return) | Later | NM |
| Clean Duels and a status-resolving Standoff for every Friend | Later | NM |
| A player-choice override for which Routed cat gets the Verdict | Later | NM |
| Wall Watch (a Rival opposite Haru's gate after a loss) | Later | NM, KS |
| Kits (from cats with history, ≤ 1 per Life) | Later | NM NX-11, AB, KS |
| Ageing, retirement, Old-Timers | Full game | NM |
| Botan's Verdict (Humble or Nose-Touch only; the hand-bell); her "Collar" hypocrisy payoff and Secret Collar quirk | Full game | NM, KS |
| Life 8 Reckoning (state on return, gratitude first, Ambush budget 0, optional Usurper) | Full game | NM NX-13 |
| Rewrite the archived A.2 (Sumi) and A.3 (Buri/Aji) stories | Full game | NM NS-14 |
| Epilogue `wall_friend` / `wall_nemesis` candidates | Full game | NM NX-C6 |
| Full bark budget (≤ 700) and the `CREW_SPOTTED`, `WAVERING`, `LAST_WALK` triggers | Full game | NM |
| Note kept: NS-15 moot while Spats and duels are cut | — | NM |

## Territory and Economy

| Item | Priority | Source |
|---|---|---|
| Raid stakes before the claim (Lost impossible while the Den is Open). Unused lever if territory AC 17/22 fail: a Routed Sentry costs −3 Loyalty; or Captain-led `boss_orders` at 1.5× a Sentry's PR so Hige is not automatically safe | Next | TE, R2-NTD |
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
| Reference-closeness decision beyond the default, once mock frames are seen | Next | AB |
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
| Yowl-sting states beyond 4 (Humbled ending, Chase-Off return, Nose-Touch fifth, Scar crack, Betrayal) | Later | SB |
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
| Fence Line "Last night" replay: one held hero frame for trailer capture; re-run the flash test on the replay hops | Next | KS, R2-P |
| Random-pause test at 10 combatants (full-game stress test) | Later | HUD |
| Per-screen split of the HUD and key-screen specs after the slice build | Later | HUD, KS |
| Handheld presets and the 720p check; per-device HUD scale | Later | HUD, AX |
| Full-game Fence Line (scrolling district stretches, whole-town zoom, Botan's perch) | Later | KS |
| Wavering/Turncoat, Comes Knocking, Kits, Wall Watch, Usurper presentation | Later | KS |
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

---

## Content reservoir and history

- **[`first-drafts/`](first-drafts/)** holds the archived full-game first drafts of nine docs (art bible, combat, crew, dual story, HUD, key screens, nemesis, sound bible, territory). They predate the slice cut and the round-1 rulings, so they are **not canon**, but they are the content reservoir for every "Later" and "Full game" item above: Lives 3–9 vignette drafts, the 30-Patch table, the wider Move, Title, Fear and Strength lists, Boss kits, and the archived Rival stories. Re-cut anything taken from them against the current brief.
- **[`../reviews/`](../reviews/)** holds the critique history: [`REVIEW-PROTOCOL.md`](../reviews/REVIEW-PROTOCOL.md), round 1 (specialist critiques, the paper playtest and [`director-rulings.md`](../reviews/round-1/director-rulings.md), the binding DR-xx rulings), round 2 (cross-doc checks with rulings R1–R5 and the sims in `round-2/sim/`), and round 3 (final sims in `round-3/sim/`). Read a review when a Backlog item cites it, or before reopening a ruled decision.

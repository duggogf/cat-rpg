# Owner-feedback pass — cross-doc follow-ups

Collected by the orchestrating session from reviser hand-backs, for the consistency pass.

| # | Item | Raised by | Owner doc(s) |
|---|---|---|---|
| F1 | Bribe "none" (free) tier cut from Life 2: Recruit always costs Morsels. Brief and Territory price sheet must match | crew reviser | `creative-brief.md`, `territory-management.md` |
| F2 | `dual-story-progression.md` still says a wipe jumps to Dusk; rulings OR-01/02 say Night, street closed, plaster evening | combat/day-loop reviser | `narrative/dual-story-progression.md` |
| F3 | Challenger lands on the L2D3 or L2D4 Sniff depending on how Nemesis counts nights; pick one and align Nemesis, Territory, Day Loop, key-screens | combat/day-loop reviser | nemesis, territory, day-loop, key-screens |
| F4 | Reviser decisions needing a ruling: Soggy pauses the Fired Up buff; K1.3's Late form keeps the Call | combat/day-loop reviser | combat, narrative, sound |
| F5 | The planned L2D4 loss is an assumption: the EV sim wipes only under very poor dodging. The showcase should stage the loss (optional Daifuku bout) rather than rely on it | combat/day-loop reviser | day-loop, implementation plan |
| F6 | UX open items: Pause ▸ Rivals placement (A-5); the L2D1 influence-bar "look only" (A-6) | UX reviser | key-screens |
| F7 | OR-09 roaming-boss window can open on L2D3 (not L2D4) for a player who rescue-Sprays that morning; Day Loop and key-screens assume L2D4 | territory reviser | day-loop, key-screens, territory |
| F8 | New `MarkApplied` event (carries district) proposed for OR-07 boss anger; add to the brief's event contracts and the nemesis doc | territory reviser | creative-brief, nemesis |
| F9 | OR-11 recruit-betrayal rate and OR-17 challenger visuals deferred from Territory to Crew and UX — confirm they landed there | territory reviser | crew, key-screens |
| F10 | Posting stakes dropped to +24% slice / +33% raid nights (from +34% / +45%) after fights stopped moving Scent — still a real decision, but watch the "stand out" score | territory reviser | territory |
| F11 | Togemaru arc-achieved collapsed to 0/0/5/15/41% (chase/recruit/mixed/pacifist/lose-40) after Chase Off became final and Humble was cut; a Nose-Touched Togemaru reaches his third encounter only via a join-in. Doc open question A-10 (count the daily greeting as an encounter → pacifist 46%) | nemesis reviser | nemesis (creative-director ruling) |
| F12 | Nose-Touch gate open on 91–100% of Verdicts because Grudge stays low in the slice: Nose-Touch is nearly free, so the three-way Verdict is not yet a real choice | nemesis reviser | nemesis (creative-director ruling) |

**Status (2026-11-24):** all twelve items are ruled and applied in `consistency-pass.md` (§1 for F11–F12, §2 for F1–F10).
| F13 | M1 sim fight lengths vs GDD: Toughs fights run 20–30% short (2T 14.2 s vs 18–21; 3T 21.1 vs 25–28; 4T 26.1 vs 33–36); Captain 41.4 vs 37; Daifuku phase 1 39 s vs ~55–60, full fight 128–195 s vs 166–176. Tuning call for the game designer in the M1 review | M1 sim | combat-system (tuning), src/data/combat |
| F14 | M1.1 doc sweep leftovers: brief §4.1/§6.1/§7/§8/§10 and GDD §6, §17–§21 still mention Tag-In/Relay/Pile-On inputs; crew lines 23/45/618; nemesis "clean Pile-On" and `by_pile_on` | M1.1 docs agent | brief, GDD, crew, nemesis |
| F15 | M1.1 doc vs sim: docs specify a bonded-chain bonus and Special values the sim does not use; reconcile when the sim lands (sim data wins for numbers) | M1.1 docs agent | combat-system, src/data/combat |
| F16 | Designer rulings for owner awareness: no jump in combat (Dash mantles); Brace AI-only; Hiss moved to the skill bar; Specials have no unlock level | M1.1 docs agent | combat-system |

**Closed 2026-11-24 (M1.2):** F14 (Tag-In/Relay/Pile-On leftovers cleared by the docs agent; wall/wash-tub lines in day-loop, sound bible and art bible cleared by the orchestrator, plus Mikan's tail/face description updated to C8/C9). F13 accepted for the showcase (game designer, M1 review).
| F17 | Territory §4.14 says one point below "two posts at 30" closes the window, but under its own rounding 30 + 29 reads 75 and stays open; 28 closes it. Fix the doc's wording or the threshold | M2 territory sim | territory-management |
| F18 | Nemesis F10 worked example skips the L2D2 night's −15 anger decay; the reference reaches L2D4 Calm (15), not Riled (30). Fix the example | M2 territory sim | nemesis-system |
| F19 | Outsiders' wisp colour is a placeholder `#4E9DA6`; art director to set | M2 territory sim | art-bible |

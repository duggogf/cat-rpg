# Systems Index: Cat RPG

> **Status**: Approved for the vertical slice (design final, round 3; revised for the owner-feedback pass)
> **Created**: 2026-11-24
> **Last Updated**: 2026-11-24 (owner comments C1–C6, rulings OR-01…OR-21, consistency pass F1–F12)
> **Source Concept**: `design/creative-brief.md` v1.6 (canon), which supersedes `design/gdd/game-concept.md` where they disagree
> **Master overview**: `design/GDD.md` v1.2 · **Patent rule** (every system): nothing Mikan does to one cat may change a different cat (`design/legal/nemesis-patent-analysis.md` v2 §5)

---

## Overview

Cat RPG is a third-person action RPG on one clock: a street game (real-time four-cat combat where a lost fight ends the day, a remembering-Rivals system shown on the Rivals board, territory with district influence, challengers and a food-tax economy) and a home game (a wordless human story told through vignettes, a Routine layer and Bond). The vertical slice covers Lives 1–2 in Hidamari Lane. The day loop is the spine: every system runs inside its 16-minute roaming clock and hands off in a fixed overnight order (Night Shuffle steps 0–6). Pillar 3 (Conduct the Brawl) and Pillar 4 (Rivals Remember) make the game stand out in play. Pillar 2 (Two Lives, One Clock) is the USP. Territory carries half the play time and gets equal design weight. Every system below has a slice spec with a `## Backlog (post-slice)` section; the consolidated backlog is `design/backlog/BACKLOG.md`.

---

## Systems Enumeration

Status values: **Approved** = slice spec final after three review rounds (not yet prototyped). **In Review** = final text, owner sign-off pending. Nothing is implemented yet; the engine is Unreal Engine 5.8 (user decision 2026-11-24).

| # | System Name | Category | Priority | Status | Design Doc | Owner role | Depends On |
|---|---|---|---|---|---|---|---|
| 1 | Day Loop (clock, phases, day budget, home ↔ street, the loss time-skip and closed street, overnight order, save/suspend) | Core | MVP | Approved | `design/gdd/day-loop.md` | game-designer | Creative brief (phase lengths, Life rules); consumes Combat, Territory, Nemesis, Crew, Narrative events |
| 2 | Camera System | Core | MVP | Approved | `design/gdd/camera-system.md` | technical-artist | Combat (framing targets, feel events), Art (1.25× cat scale), UX (safe frame) |
| 3 | Input and Control Map | Core | MVP | Approved | `design/ux/hud.md` §8 (map); `design/gdd/combat-system.md` §3.1 (actions) | ux-designer (map), game-designer (actions) | Combat, Accessibility (remapping, toggles) |
| 4 | One Cat Schema and seeded RNG (inferred) | Persistence | MVP | Approved (specified in canon) | `design/creative-brief.md` §5.3, §6 | technical-director (to assign) | — (foundation for Combat, Crew, Nemesis, Territory) |
| 5 | Combat (real-time rules, Moves, Tag-In/Relay, Pile-On, Posse and enemy AI, feel tier table, Daifuku on the patrol arena kit, Fired Up / Cowed at fight start, the allied guest) | Gameplay | MVP | Approved | `design/gdd/combat-system.md` | game-designer (combat) | Cat Schema, Crew (stats, learnsets, bonds), Nemesis (`RivalCombatProfile`), Camera |
| 6 | Crew and Progression (personality model, three recruitment routes, Bribe tiers, stats/XP, Loyalty, rare betrayal from Life 2, Lessons, Tail-Up) | Progression | MVP | Approved | `design/gdd/crew-and-progression.md` | systems-designer | Cat Schema, Combat (Move ids, perks), Nemesis (personality, recruit availability), Territory (prices, slots) |
| 7 | Rivals / Nemesis (generation with fixed roles, Grudge/Regard, Memory, Scars, the three Verdicts, Boss anger, Old Gang Nerves, join-ins, town events, the Declaration, raid requests) | Gameplay | MVP | Approved (owner-feedback pass) | `design/gdd/nemesis-system.md` | systems-designer (nemesis/AI) | Cat Schema, Combat (encounter events), Crew (Loyalty, PowerRating), Territory (Patches), Day loop (step 3) |
| 8 | Territory and Economy (Patches, Scent, marking, Sentries, raids, the Caterwaul presence rule, Tribute, Stash, prices, Clout) | Economy | MVP | Approved (owner-feedback pass) | `design/gdd/territory-management.md` | economy-designer | Nemesis (raid requests, Keepers, Verdicts), Crew (PowerRating, personality guard column), Combat (waves, haul), Day loop (steps 2, 4) |
| 9 | Dual Story Progression (rulebook, vignettes, Routine layer, daily find, piano, Bond, Life gates) | Narrative | Vertical Slice | Approved | `design/narrative/dual-story-progression.md` | narrative-director | Day loop (`HomeArrived`, day gates), Audio (Call system), Art (colour script), Camera (Home/Vignette states) |
| 10 | Art Direction (line and shader, palette, characters, coat generator, environments, combat VFX, lettering) | Meta (presentation) | Vertical Slice | In Review (art-director sign-off pending) | `design/art/art-bible.md` | art-director | Combat (tier table), Camera (scale, size floors), Accessibility (colour twins, flash safety) |
| 11 | Audio (music and the Call, Murmur, cat vocals and barks, combat mix, adaptive music, scent sonification) | Audio | Vertical Slice | Approved | `design/audio/sound-bible.md` | audio-director | Narrative (cue list), Combat (tiers, events), Day loop (`PhaseChanged`), Nemesis (bark triggers, sting seeds) |
| 12 | HUD (street, combat, home; Morning Sniff) | UI | Vertical Slice | Approved | `design/ux/hud.md` | ux-designer | All gameplay systems (read-only values), Camera, Art |
| 13 | Key Screens (Rivals board, Rival card, three-card Verdict and the loss walk home, unified Turf Board, Lot and Crew, onboarding sheet) | UI | Vertical Slice | Approved | `design/ux/key-screens.md` | ux-designer | Nemesis, Territory, Crew, Combat, Narrative |
| 14 | Onboarding / teaching ladder | Meta | MVP | Approved | `design/ux/key-screens.md` §7 (owner); `design/gdd/day-loop.md` §3.9 (clock times) | ux-designer | Combat (§3.16), Territory (§3.12), Narrative (K beats) |
| 15 | Accessibility (flash and motion safety, colour twins, deaf/HoH parity, holds, remapping, assists) | Meta | MVP (safety) / Vertical Slice (options) | Approved | `design/accessibility-requirements.md` | ux-designer | Combat (tier table, REQUESTs), Art, Audio, Camera |
| 16 | Barks and cat voice (trigger taxonomy and grammar; the words) | Narrative | Vertical Slice | Approved (split ownership) | `design/gdd/nemesis-system.md` §3.15 (triggers); narrative-director (lines); `design/audio/sound-bible.md` §8 (voices) | systems-designer / narrative-director / audio-director | Nemesis, Narrative, Audio |
| 17 | Telemetry and day-budget alarms (inferred) | Meta | Alpha | Not Started (Backlog) | — (`design/gdd/day-loop.md` Backlog) | analytics-engineer | Day loop |
| 18 | Life 8 and Life 9 systems (Carries, the wait, the heir) | Narrative | Full Vision | Not Started (framing only) | `design/narrative/dual-story-progression.md` §3.2 (framing) | narrative-director | Territory, Combat, Crew, Day loop |
| 19 | **Rivals board** (new; replaces the Fence Line): every unique cat; per-gang perspective scenes (C6); discovery; relationship tags; anger puffs | UI | Vertical Slice | Approved (C6 layout in revision) | `design/ux/key-screens.md` §2 (screen); `design/gdd/nemesis-system.md` §3.13, §3.17 (discovery, tags) | ux-designer / systems-designer | Nemesis (`CatDiscovered`, relations, anger), Crew (`OLD_GANG`), Territory (influence in the header), Art (the diorama set) |
| 20 | **District influence and the Boss window** (new; replaces the Den gate): influence read off Scent, decay, the roaming Boss's three-stop patrol, hysteresis | Economy | MVP | Approved | `design/gdd/territory-management.md` §3.2.2, §3.5, §4.14 | economy-designer | Territory Scent (only territory acts move it, G5); Nemesis (patrol placement); Combat (arena kit); Day loop (step 2) |
| 21 | **Challengers and newcomers** (new): a fixed challenger calendar, the `challenge` raid, newcomers into empty places, the Usurper (full game) | Gameplay | Vertical Slice | Approved | `design/gdd/nemesis-system.md` §3.20, F12; `design/gdd/territory-management.md` §3.7, §4.15 | systems-designer / economy-designer | Nemesis (generation), Territory (raid slot, over-mark), UX (Sniff, board, Turf Board) |

Supporting, non-system docs: `design/gdd/game-concept.md` and `design/gdd/game-pillars.md` (Draft; pillars hold, facts partly superseded by the brief), `design/registry/entities.yaml` (cross-doc entity registry), `design/legal/nemesis-patent-analysis.md` v2 (risk note, not a system).

### Removed systems (owner-feedback pass, 2026-11-24)

| Removed | Replaced by | Ruling |
|---|---|---|
| **Humble** Verdict and everything on it (Undermark crate, simmer, Restless, uprising raids, Humbled Tribute, the Down card) | Three Verdicts; challengers and visible decay supply the pressure | OR-12, OR-15, OR-21.1 |
| **The Fence Line** screen (height = rank, seats) | The Rivals board (#19) | OR-03, C6 |
| **Comes Knocking** recruit route | Exactly three routes: the Recruit Verdict for a Bribe, story beats, the Friend Stray | Consistency pass §3 #18 |
| Chase Off comebacks (Away, the Grand Standoff) | Chase Off = Gone; newcomers and challengers | OR-14 |
| Seats, promotions, loss promotion, wall events, Stewing, lead re-naming | Fixed roles; town events (newcomer, feud scuffle); a fixed arc lead | OR-19, OR-15 |
| The Den gate; Mark Over and Snatch; fight-driven Scent | The Boss window (#20); "fight to clear, spray to claim" | OR-08, OR-09, OR-02 |

---

## Categories

| Category | Systems here |
|---|---|
| **Core** | Day Loop, Camera, Input and Control Map |
| **Gameplay** | Combat, Rivals / Nemesis, Challengers and newcomers |
| **Progression** | Crew and Progression |
| **Economy** | Territory and Economy, District influence and the Boss window |
| **Persistence** | One Cat Schema and seeded RNG; save/suspend (inside Day Loop §3.8) |
| **UI** | HUD, Key Screens, Rivals board |
| **Audio** | Audio |
| **Narrative** | Dual Story Progression, Barks, Life 8–9 |
| **Meta** | Art Direction (presentation), Onboarding, Accessibility, Telemetry |

---

## Priority Tiers

| Tier | Definition | Target Milestone | Design Urgency |
|---|---|---|---|
| **MVP** | Needed to test "is the brawl and the day fun?" | Combat grey box and first playable day | Designed; prototype first |
| **Vertical Slice** | Needed for the polished Lives 1–2 experience | Vertical slice build | Designed |
| **Alpha** | Full mechanical scope for 3 districts | Alpha | Backlog |
| **Full Vision** | Content-complete nine Lives | Beta / Release | Backlog |

---

## Dependency Map

### Foundation Layer (no dependencies)

1. One Cat Schema and seeded RNG — every cat and every overnight draw uses them; determinism is an acceptance criterion in Day Loop and Nemesis.
2. Input and Control Map — the DR-08 map; Combat's actions and Accessibility's remapping hang off it.
3. Day Loop clock — the 16-minute roaming clock, pause rules and overnight step order that every system plugs into.

### Core Layer (depends on foundation)

1. Camera — depends on: Input, Cat Schema (scale)
2. Combat — depends on: Cat Schema, Input, Camera
3. Crew and Progression — depends on: Cat Schema, Combat (Move ids)

### Feature Layer (depends on core)

1. Rivals / Nemesis — depends on: Combat, Crew, Day Loop
2. Territory and Economy — depends on: Nemesis, Crew, Combat, Day Loop
3. District influence and the Boss window — depends on: Territory (Scent), Nemesis (patrol), Combat (arena kit)
4. Challengers and newcomers — depends on: Nemesis (generation, calendar), Territory (raid slot)
5. Dual Story Progression — depends on: Day Loop, Camera (Home/Vignette states)

### Presentation Layer (depends on features)

1. HUD, Key Screens and the Rivals board — depend on: every gameplay system
2. Audio — depends on: Combat, Narrative, Day Loop, Nemesis
3. Art Direction — depends on: Combat (tier table), Camera, Narrative

### Polish Layer (depends on everything)

1. Accessibility — depends on: Combat, Art, Audio, Camera, UX
2. Onboarding — depends on: Combat, Territory, Narrative, UX
3. Telemetry — depends on: Day Loop and every system's activity tags

---

## Recommended Design Order

The design pass is complete for the slice. This table is now the **prototype and build order** for the slice (brief §10 "Before the slice", `design/GDD.md` §18). **The browser showcase runs first** (`production/artifact-slice/IMPLEMENTATION-PLAN.md`, starting with the M0 look-dev go/no-go); its data tables seed this order.

| Order | System | Priority | Layer | Agent(s) | What to build / prove first |
|---|---|---|---|---|---|
| 1 | Combat | MVP | Core | game-designer, gameplay-programmer, ai-programmer | Grey box: Mikan + 3, 3 Styles, 8 Moves, Tag-In, Pile-On, a Captain, 3-phase Daifuku, personality AI for Hige, Pon, Togemaru |
| 2 | Camera | MVP | Core | technical-artist | Explore/Combat/Slow Blink/Cinematic states in the grey box (test T1) |
| 3 | Input and Control Map | MVP | Foundation | ux-designer, gameplay-programmer | DR-08 map with remapping and toggles |
| 4 | Accessibility (safety arbiter) | MVP | Polish (built early) | technical-artist, ux-designer | Flash/hit-stop budget arbiter and a Harding capture on the grey box |
| 5 | Crew and Progression | MVP | Core | systems-designer | Stat curves, learnsets, personality AI hooks; Lives 1–2 economy sim |
| 6 | Rivals / Nemesis | MVP | Feature | systems-designer, ai-programmer | Memory, Standoff lines, Verdicts, Scars; the 7-day Night Shuffle sim |
| 7 | Day Loop | MVP | Foundation | game-designer, gameplay-programmer | Clock, pause rules, Head Home, overnight steps; time the first playable day |
| 8 | Territory and Economy | MVP | Feature | economy-designer | Patches, Scent, marking, influence and the Boss window, raids, challengers, the unified Turf Board; posting-stakes check |
| 9 | Art Direction (look-dev) | Vertical Slice | Presentation | art-director, technical-artist | One-alley look-dev test (camera test T2) |
| 10 | Dual Story Progression | Vertical Slice | Feature | narrative-director, writer | Home mock (camera test T3); K1.1 and K1.3 first |
| 11 | HUD and Key Screens | Vertical Slice | Presentation | ux-designer, ui-programmer | Combat HUD in the grey box first; the Rivals board scene, the three-card Verdict and the unified Turf Board next |
| 12 | Audio | Vertical Slice | Presentation | audio-director, sound-designer | The Call and Dusk pull; combat tier mix in the grey box |
| 13 | Onboarding | Vertical Slice | Polish | ux-designer | The first 15 minutes, timed against the first playable |

---

## Circular Dependencies

- **Combat ↔ Nemesis:** Combat needs Nemesis's `RivalCombatProfile`; Nemesis consumes Combat's encounter events. Broken by the query/event split (brief §6.1): a profile is read at `EncounterStarted`, and results flow back only through events.
- **Nemesis ↔ Territory:** Nemesis requests raids, assigns Keepers and generates challengers; Territory resolves raids and challenges and reports Patch changes. By day Territory emits `MarkApplied` (Nemesis stores anger) and `BossWindowChanged` (Nemesis places the patrol). Broken by the fixed overnight order (Territory step 2 before Nemesis step 3) and by one-way day events: Nemesis never writes Scent or influence.
- **Crew ↔ Nemesis:** Crew reads personality and Memory; Nemesis reads Loyalty for betrayals (live from Life 2). Broken by field ownership in the One Cat Schema (each field has one writer; Crew owns the thresholds, Nemesis the event).

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|---|---|---|---|
| Combat | Design / Technical | Four-cat readability under a third-person camera; AI Paw habits rarely fire; Daifuku length fragile to knock-off frequency | Grey box first; random-pause test; levers in the combat Backlog (B-15–B-20) |
| Accessibility (flash safety) | Technical | A VFX-heavy feel budget against WCAG 2.3.1 | Runtime arbiter; Harding gate before any public footage |
| Rivals / Nemesis, Rivals board | Legal / Design | The Warner Bros. family (US 10,926,179; 11,660,540; 12,201,908; pending 2025/0108303), now read against the full claim text (`design/legal/claims/`, v2 note). The C6 board shows the gang hierarchy more plainly (role tags, answers-to arrows). Nose-Touch could dominate | Guardrails G1–G12 applied; no legal conclusion; **counsel review blocks scope lock and any public showing**. The quiet-take gate; playtest AC 4 (no Verdict > 60%) |
| Territory, influence | Design | Posting stakes fell to +24% / +33% once fights stopped moving Scent; the influence bar may be hard to track on the street | Motive counters, neighbours, challengers; key-screens A-7 (a street post strip) as the lever |
| Crew | Design | The betrayal rate is unmeasured (analytic slice bound 0%) | Crew's Lives 1–2 sim owed (AC-23) |
| Day Loop | Scope / Design | L2D3 (24.9 typical / 28.9 heavy) has no slack; the window reveal there must stay in view | Measure Lot and Doorstep time first; move the Turf Board or the Tofu Shop Step take |
| Dual Story Progression | Design | Wordless legibility | Vocabulary before use; 90%-muted Tier A tests |
| Art Direction | Scope | Third-person environments show sky and every angle | One-alley look-dev test; one district first |

---

## Progress Tracker

| Metric | Count |
|---|---|
| Total systems identified | 21 (18 + the Rivals board, district influence and the Boss window, challengers and newcomers); 3 removed (Humble, the Fence Line, Comes Knocking) |
| Design docs started | 15 (systems 1–16 and 19–21; 3, 14 and 19–21 live inside other docs) |
| Design docs reviewed | 15 (rounds 1–3, the owner-feedback pass and the consistency pass) |
| Design docs approved | 14 (Art bible awaiting art-director sign-off; the C6 board layout in revision) |
| MVP systems designed | 10 / 10 |
| Vertical Slice systems designed | 9 / 9 |

---

## Next Steps

- [x] Engine, title and reference closeness decided by the user (2026-11-24): Unreal Engine 5.8, "Cat RPG", reference-close
- [x] Owner comments C1–C5 ruled (OR-01…OR-21), the owner's five answers recorded, the consistency pass (F1–F12) applied; `design/GDD.md` v1.2 and the showcase plan v2 compiled
- [x] K1.4 clock time and Turf Board day aligned (consistency pass)
- [ ] Finish the C6 Rivals board layout in `design/ux/key-screens.md` §2 and settle the role-tag words
- [ ] User decides the remaining open questions in `design/GDD.md` §20
- [ ] Commission the patent counsel review (full claims in `design/legal/claims/`) before the Rivals scope locks and before any showing outside the team
- [ ] Run Crew's Lives 1–2 sim for betrayal rate (AC-23) and pacing (AC-6)
- [ ] Showcase M0 (look-dev go/no-go), then the combat grey box
- [ ] `/setup-engine unreal 5.8` on the development machine: probe the editor install, set `engine.path` and `commands.*`, refresh the engine reference
- [ ] `/gate-check` before moving the slice into production

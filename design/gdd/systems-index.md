# Systems Index: Cat RPG (working title)

> **Status**: Approved for the vertical slice (design final, round 3)
> **Created**: 2026-11-24
> **Last Updated**: 2026-11-24
> **Source Concept**: `design/creative-brief.md` v1.3 (canon), which supersedes `design/gdd/game-concept.md` where they disagree
> **Master overview**: `design/GDD.md`

---

## Overview

Cat RPG is a third-person action RPG on one clock: a street game (real-time four-cat combat, a remembering-Rivals system, territory and a food-tax economy) and a home game (a wordless human story told through vignettes, a Routine layer and Bond). The vertical slice covers Lives 1–2 in Hidamari Lane. The day loop is the spine: every system runs inside its 16-minute roaming clock and hands off in a fixed overnight order (Night Shuffle steps 0–6). Pillar 3 (Conduct the Brawl) and Pillar 4 (Rivals Remember) make the game stand out in play. Pillar 2 (Two Lives, One Clock) is the USP. Territory carries half the play time and gets equal design weight. Every system below has a slice spec with a `## Backlog (post-slice)` section; the consolidated backlog is `design/backlog/BACKLOG.md`.

---

## Systems Enumeration

Status values: **Approved** = slice spec final after three review rounds (not yet prototyped). **In Review** = final text, owner sign-off pending. Nothing is implemented yet; the engine is not chosen.

| # | System Name | Category | Priority | Status | Design Doc | Owner role | Depends On |
|---|---|---|---|---|---|---|---|
| 1 | Day Loop (clock, phases, day budget, home ↔ street, overnight order, save/suspend) | Core | MVP | Approved | `design/gdd/day-loop.md` | game-designer | Creative brief (phase lengths, Life rules); consumes Combat, Territory, Nemesis, Crew, Narrative events |
| 2 | Camera System | Core | MVP | Approved | `design/gdd/camera-system.md` | technical-artist | Combat (framing targets, feel events), Art (1.25× cat scale), UX (safe frame) |
| 3 | Input and Control Map | Core | MVP | Approved | `design/ux/hud.md` §8 (map); `design/gdd/combat-system.md` §3.1 (actions) | ux-designer (map), game-designer (actions) | Combat, Accessibility (remapping, toggles) |
| 4 | One Cat Schema and seeded RNG (inferred) | Persistence | MVP | Approved (specified in canon) | `design/creative-brief.md` §5.3, §6 | technical-director (to assign) | — (foundation for Combat, Crew, Nemesis, Territory) |
| 5 | Combat (real-time rules, Moves, Tag-In/Relay, Pile-On, Posse and enemy AI, feel tier table, Daifuku) | Gameplay | MVP | Approved | `design/gdd/combat-system.md` | game-designer (combat) | Cat Schema, Crew (stats, learnsets, bonds), Nemesis (`RivalCombatProfile`), Camera |
| 6 | Crew and Progression (personality model, recruits, stats/XP, Loyalty, Lessons, Tail-Up) | Progression | MVP | Approved | `design/gdd/crew-and-progression.md` | systems-designer | Cat Schema, Combat (Move ids, perks), Nemesis (personality, recruit availability), Territory (prices, slots) |
| 7 | Rivals / Nemesis (generation, Grudge/Regard, Memory, Scars, Verdicts, wall events, the Declaration, raid requests) | Gameplay | MVP | Approved | `design/gdd/nemesis-system.md` | systems-designer (nemesis/AI) | Cat Schema, Combat (encounter events), Crew (Loyalty, PowerRating), Territory (Patches), Day loop (step 3) |
| 8 | Territory and Economy (Patches, Scent, Spray, Sentries, raids, Caterwaul, Tribute, Stash, prices, Clout) | Economy | MVP | Approved | `design/gdd/territory-management.md` | economy-designer | Nemesis (raid requests, Keepers, Verdicts), Crew (PowerRating, personality guard column), Combat (waves, haul), Day loop (steps 2, 4) |
| 9 | Dual Story Progression (rulebook, vignettes, Routine layer, daily find, piano, Bond, Life gates) | Narrative | Vertical Slice | Approved | `design/narrative/dual-story-progression.md` | narrative-director | Day loop (`HomeArrived`, day gates), Audio (Call system), Art (colour script), Camera (Home/Vignette states) |
| 10 | Art Direction (line and shader, palette, characters, coat generator, environments, combat VFX, lettering) | Meta (presentation) | Vertical Slice | In Review (art-director sign-off pending) | `design/art/art-bible.md` | art-director | Combat (tier table), Camera (scale, size floors), Accessibility (colour twins, flash safety) |
| 11 | Audio (music and the Call, Murmur, cat vocals and barks, combat mix, adaptive music, scent sonification) | Audio | Vertical Slice | Approved | `design/audio/sound-bible.md` | audio-director | Narrative (cue list), Combat (tiers, events), Day loop (`PhaseChanged`), Nemesis (bark triggers, sting seeds) |
| 12 | HUD (street, combat, home; Morning Sniff) | UI | Vertical Slice | Approved | `design/ux/hud.md` | ux-designer | All gameplay systems (read-only values), Camera, Art |
| 13 | Key Screens (Fence Line, Rival card, Verdict, Turf Board, Lot and Crew, onboarding sheet) | UI | Vertical Slice | Approved | `design/ux/key-screens.md` | ux-designer | Nemesis, Territory, Crew, Combat, Narrative |
| 14 | Onboarding / teaching ladder | Meta | MVP | Approved | `design/ux/key-screens.md` §7 (owner); `design/gdd/day-loop.md` §3.9 (clock times) | ux-designer | Combat (§3.16), Territory (§3.12), Narrative (K beats) |
| 15 | Accessibility (flash and motion safety, colour twins, deaf/HoH parity, holds, remapping, assists) | Meta | MVP (safety) / Vertical Slice (options) | Approved | `design/accessibility-requirements.md` | ux-designer | Combat (tier table, REQUESTs), Art, Audio, Camera |
| 16 | Barks and cat voice (trigger taxonomy and grammar; the words) | Narrative | Vertical Slice | Approved (split ownership) | `design/gdd/nemesis-system.md` §3.15 (triggers); narrative-director (lines); `design/audio/sound-bible.md` §8 (voices) | systems-designer / narrative-director / audio-director | Nemesis, Narrative, Audio |
| 17 | Telemetry and day-budget alarms (inferred) | Meta | Alpha | Not Started (Backlog) | — (`design/gdd/day-loop.md` Backlog) | analytics-engineer | Day loop |
| 18 | Life 8 and Life 9 systems (Carries, the wait, the heir) | Narrative | Full Vision | Not Started (framing only) | `design/narrative/dual-story-progression.md` §3.2 (framing) | narrative-director | Territory, Combat, Crew, Day loop |

Supporting, non-system docs: `design/gdd/game-concept.md` and `design/gdd/game-pillars.md` (Draft; pillars hold, facts partly superseded by the brief), `design/registry/entities.yaml` (cross-doc entity registry).

---

## Categories

| Category | Systems here |
|---|---|
| **Core** | Day Loop, Camera, Input and Control Map |
| **Gameplay** | Combat, Rivals / Nemesis |
| **Progression** | Crew and Progression |
| **Economy** | Territory and Economy |
| **Persistence** | One Cat Schema and seeded RNG; save/suspend (inside Day Loop §3.8) |
| **UI** | HUD, Key Screens |
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
3. Dual Story Progression — depends on: Day Loop, Camera (Home/Vignette states)

### Presentation Layer (depends on features)

1. HUD and Key Screens — depend on: every gameplay system
2. Audio — depends on: Combat, Narrative, Day Loop, Nemesis
3. Art Direction — depends on: Combat (tier table), Camera, Narrative

### Polish Layer (depends on everything)

1. Accessibility — depends on: Combat, Art, Audio, Camera, UX
2. Onboarding — depends on: Combat, Territory, Narrative, UX
3. Telemetry — depends on: Day Loop and every system's activity tags

---

## Recommended Design Order

The design pass is complete for the slice. This table is now the **prototype and build order** for the slice (brief §10 "Before the slice", `design/GDD.md` §18).

| Order | System | Priority | Layer | Agent(s) | What to build / prove first |
|---|---|---|---|---|---|
| 1 | Combat | MVP | Core | game-designer, gameplay-programmer, ai-programmer | Grey box: Mikan + 3, 3 Styles, 8 Moves, Tag-In, Pile-On, a Captain, 3-phase Daifuku, personality AI for Hige, Pon, Togemaru |
| 2 | Camera | MVP | Core | technical-artist | Explore/Combat/Slow Blink/Cinematic states in the grey box (test T1) |
| 3 | Input and Control Map | MVP | Foundation | ux-designer, gameplay-programmer | DR-08 map with remapping and toggles |
| 4 | Accessibility (safety arbiter) | MVP | Polish (built early) | technical-artist, ux-designer | Flash/hit-stop budget arbiter and a Harding capture on the grey box |
| 5 | Crew and Progression | MVP | Core | systems-designer | Stat curves, learnsets, personality AI hooks; Lives 1–2 economy sim |
| 6 | Rivals / Nemesis | MVP | Feature | systems-designer, ai-programmer | Memory, Standoff lines, Verdicts, Scars; the 7-day Night Shuffle sim |
| 7 | Day Loop | MVP | Foundation | game-designer, gameplay-programmer | Clock, pause rules, Head Home, overnight steps; time the first playable day |
| 8 | Territory and Economy | MVP | Feature | economy-designer | Patches, Scent, raids and the forecast, Turf Board; posting-stakes check |
| 9 | Art Direction (look-dev) | Vertical Slice | Presentation | art-director, technical-artist | One-alley look-dev test (camera test T2) |
| 10 | Dual Story Progression | Vertical Slice | Feature | narrative-director, writer | Home mock (camera test T3); K1.1 and K1.3 first |
| 11 | HUD and Key Screens | Vertical Slice | Presentation | ux-designer, ui-programmer | Combat HUD in the grey box first; Fence Line and Turf Board next |
| 12 | Audio | Vertical Slice | Presentation | audio-director, sound-designer | The Call and Dusk pull; combat tier mix in the grey box |
| 13 | Onboarding | Vertical Slice | Polish | ux-designer | The first 15 minutes, timed against the first playable |

---

## Circular Dependencies

- **Combat ↔ Nemesis:** Combat needs Nemesis's `RivalCombatProfile`; Nemesis consumes Combat's encounter events. Broken by the query/event split (brief §6.1): a profile is read at `EncounterStarted`, and results flow back only through events.
- **Nemesis ↔ Territory:** Nemesis requests raids and assigns Keepers; Territory resolves raids and reports Patch changes. Broken by the fixed overnight order: Territory (step 2) resolves last night's request before Nemesis (step 3) makes tomorrow's.
- **Crew ↔ Nemesis:** Crew reads personality and Memory; Nemesis reads Loyalty for betrayals (off in the slice). Broken by field ownership in the One Cat Schema (each field has one writer).

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|---|---|---|---|
| Combat | Design / Technical | Four-cat readability under a third-person camera; AI Paw habits rarely fire; Daifuku length fragile to knock-off frequency | Grey box first; random-pause test; levers in the combat Backlog (B-15–B-20) |
| Accessibility (flash safety) | Technical | A VFX-heavy feel budget against WCAG 2.3.1 | Runtime arbiter; Harding gate before any public footage |
| Rivals / Nemesis | Legal / Design | Patent proximity (US 10,926,179 cited, to verify); a deadline-declared Nemesis may feel unearned for mixed players | Counsel review before scope lock (user decision); playtest the Declaration |
| Territory | Design | Posting decision low-stakes or one dominant answer | Motive counters and neighbour effects; territory AC 17, 18, 22 in the slice playtest |
| Day Loop | Scope / Design | L2D2 and L2D3 have almost no budget slack (28.9 min heavy) | Measure Lot and Doorstep time first; move the Turf Board or the Tofu Shop Step take |
| Dual Story Progression | Design | Wordless legibility | Vocabulary before use; 90%-muted Tier A tests |
| Art Direction | Scope | Third-person environments show sky and every angle | One-alley look-dev test; one district first |

---

## Progress Tracker

| Metric | Count |
|---|---|
| Total systems identified | 18 |
| Design docs started | 15 (systems 1–16; 3 and 14 live inside other docs) |
| Design docs reviewed | 15 (rounds 1–3) |
| Design docs approved | 14 (Art bible awaiting art-director sign-off) |
| MVP systems designed | 9 / 9 |
| Vertical Slice systems designed | 7 / 7 |

---

## Next Steps

- [ ] User decides the open questions in `design/GDD.md` §20 (engine first)
- [ ] `/setup-engine` once the engine is chosen
- [ ] Build the combat grey box and the three sims (`/prototype`, then `/vertical-slice`)
- [ ] Commission the patent review before the Rivals scope is locked
- [ ] Align the two known timing disagreements (K1.4 clock time; Turf Board day) against the first playable
- [ ] `/gate-check` before moving the slice into production

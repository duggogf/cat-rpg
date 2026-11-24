# Design Folder — Map and Reading Order

Everything here describes **Cat RPG** (working title), a third-person action RPG about a house cat who is a boss outside and a pet at home. The current target is the **vertical slice** (Lives 1–2, Hidamari Lane, ≈ 2–2.5 h). The design is final for the slice; nothing is implemented yet and the engine is not chosen.

## Read in this order

1. **[`GDD.md`](GDD.md)**: the master Game Design Document. Start here. One file covers the game, the slice, every system in summary, the cross-system map, pacing, the prototype plan, risks and the open decisions for the user.
2. **[`creative-brief.md`](creative-brief.md)**: the binding canon (v1.3): terms, numbers, ownership, event contracts, rulings R1–R5. Read it in full before writing or revising any design doc. It wins every disagreement.
3. **[`gdd/systems-index.md`](gdd/systems-index.md)**: every system, its doc, owner, status, dependencies and the prototype/build order.
4. **The system specs** you need, each with its own `## Backlog (post-slice)`:

| Order | Doc | What it is |
|---|---|---|
| a | [`gdd/day-loop.md`](gdd/day-loop.md) | The clock, day budget, home ↔ street, the three dailies, overnight order, first-hour timing |
| b | [`gdd/combat-system.md`](gdd/combat-system.md) | Real-time four-cat combat, the 12 Moves, Tag-In, Pile-On, AI, Daifuku, the feel tier table |
| c | [`gdd/crew-and-progression.md`](gdd/crew-and-progression.md) | The six personalities, the six slice cats, stats, Loyalty, recruitment, Lessons |
| d | [`gdd/nemesis-system.md`](gdd/nemesis-system.md) | Rivals: Memory, Scars, Verdicts, the Declaration, wall events, raid requests, patent note |
| e | [`gdd/territory-management.md`](gdd/territory-management.md) | Patches, Scent, Sentries, raids, Tribute, the price sheet, the slice economy |
| f | [`narrative/dual-story-progression.md`](narrative/dual-story-progression.md) | The wordless home story: rulebook, 11 vignettes, home verbs, Bond, the nine Lives |
| g | [`gdd/camera-system.md`](gdd/camera-system.md) | The one third-person rig: states, collision, combat framing, home rules, comfort |
| h | [`art/art-bible.md`](art/art-bible.md) | "Ink what acts, paint what stays": line, palette, characters, environments, combat VFX |
| i | [`audio/sound-bible.md`](audio/sound-bible.md) | Street and house sound worlds, the Call, Murmur, cat voices, the mix |
| j | [`ux/hud.md`](ux/hud.md) | Street, combat and home HUDs; the Morning Sniff; **the control map (§8)** |
| k | [`ux/key-screens.md`](ux/key-screens.md) | Fence Line, Rival card, Verdict, Turf Board, the Lot; **the onboarding sheet (§7)** |
| l | [`accessibility-requirements.md`](accessibility-requirements.md) | The project-wide floor: flash safety, colour twins, deaf/HoH parity, remapping (kept outside `ux/` on purpose) |

5. **[`backlog/BACKLOG.md`](backlog/BACKLOG.md)**: everything after the slice, de-duplicated and prioritised (Next / Later / Full game) with source links.

## Background and history

| Path | What it is |
|---|---|
| [`gdd/game-concept.md`](gdd/game-concept.md), [`gdd/game-pillars.md`](gdd/game-pillars.md) | The original concept and the four pillars. The pillars hold; several facts (bird's-eye camera, six districts, 22–28 h) are superseded by the brief |
| [`reviews/`](reviews/) | The critique history: the review protocol, round 1 (critiques, paper playtest, **director rulings DR-xx**), round 2 (cross-doc checks and sims), round 3 (final sims) |
| [`backlog/first-drafts/`](backlog/first-drafts/) | Archived full-game first drafts: not canon; the content reservoir for post-slice work |
| [`previews/`](previews/) | Mock-up frames of the slice (1920×1080 PNG, built from HTML with the drawing kit in `previews/kit/` and `render.js`); frames 01 exploration · 02–04 combat (clash, Slow Blink, Pile-On) · 05 Rival Standoff · 06 Fence Line · 07 Verdict · 08 Turf Board · 09 Tribute Doorstep · 10 home evening |
| [`registry/entities.yaml`](registry/entities.yaml) | Cross-doc entity registry used by the consistency and review skills |
| [`CLAUDE.md`](CLAUDE.md) | Authoring standards for this folder (GDD sections, naming, validation) |

## Rules of thumb

- **Canon order:** creative brief → director rulings → system docs. The GDD and this README summarise; they never override.
- One owner per doc and per number (brief §6). To change a rule, change the owning doc, then update `GDD.md`, `systems-index.md` and `BACKLOG.md` if they quote it.
- Large docs (25–80 KB): grep headings (`^#`) and read by section.

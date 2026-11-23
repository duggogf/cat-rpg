# UX Spec: Key Screens (Fence Line, Rival Card, Verdict, Turf, Crew / Posse / Lessons, Pause)

> **Status**: In Design (Draft v0.1 — first pass for review; nothing here is approved)
> **Author**: ux-designer (pre-approved design pass; user review pending)
> **Last Updated**: 2026-11-23
> **Journey Phase(s)**: First hour (onboarding) through endgame; daily loop (Doorstep → Lot → town → home)
> **Screen / Flow Names**: `FenceLineScreen`, `CatCard` (Rival and Crew variants), `VerdictPrompt`, `TurfScreen` (+ `SentryPicker`, `TributeOverview`), `CrewScreen` (+ `PosseBuilder`, `LessonFlow`), `PauseMenu`, `MorningSniff` (stub only)
> **Platform Target**: PC (gamepad primary, full keyboard/mouse); Switch-class handheld at 1280x720. No touch in this pass.
> **Related GDDs**: `design/creative-brief.md` (binding canon), `design/gdd/game-pillars.md`, `design/gdd/game-concept.md`. Combat, Nemesis, Territory & Economy, Crew & Progression GDDs are in parallel drafting and were **not available** — see §13 Assumptions.
> **Related ADRs**: None yet (engine undecided).
> **Related UX Specs**: `design/ux/hud.md` (HUD, Slow Blink menu, full control map). No interaction pattern library or `design/accessibility-requirements.md` exists yet.
> **Accessibility Tier**: Comprehensive (proposed target; accessibility-specialist sets it)
> **Template**: UX Spec (combined)

> **About this document's shape.** The project convention is one spec per screen (`design/ux/[screen-name].md`). This pass was commissioned as a single file covering six screens, so each screen gets a condensed version of the template (need, context, entry/exit, wireframe, states, interactions, data and events) and the cross-cutting sections (navigation model, onboarding, accessibility, localisation, acceptance) are shared. **Before `/ux-review`, split this into per-screen specs** and expand the per-screen tables that are abbreviated here.

> **Notation**: face buttons by position — South / East / West / North; L1/R1, L2/R2, L3/R3, Menu, View. South confirms and East goes back in the tables; swap per platform convention. Sizes at 1920x1080 reference. Rival, Crew, Move, Strength and Patch names inside wireframes are **illustrative placeholders**, not canon; only the six Bosses, districts and Clowders are canon names.

---

## 1. Shared Foundations

### 1.1 Four rules every screen obeys

1. **Language veto (Pillar 1).** No screen names, quotes, summarises or translates anything human. Haru's dev-facing name never appears. Life goals are stated as turf goals only ("Claim Hidamari Lane"), never as home events. There is no codex and no story log.
2. **Management lives at the Lot and the Doorstep (Pillar 2, worked example in the pillars doc).** Screens opened from the pause menu are **viewable anywhere but editable only where a cat could act**: Sentry and Warden assignment and Lessons are editable at the Lot only. The one exception is canon: the Posse is swappable any time outside combat.
3. **One cat, one card (Pillar 4, One Cat Schema).** Mikan, Crew, Rivals and Bosses are the same data type, so they share one component, the **Cat Card**, in every context: Standoff name-card, Target Plate, Fence Line seat, Rival detail, Crew detail, Verdict, Sentry picker, Lesson flow. A recruited Nemesis's card visibly keeps its Scars, Title, Fears and history; nothing is reset by changing sides.
4. **The hierarchy is a wall, not a table (Pillar 4 violation list: "hiding the hierarchy in a spreadsheet UI").** Where a place can carry the information, use the place: Rivals sit on the Fence Line; turf is seen from above the town; Crew lounge on the crates.

### 1.2 Screen map

```
 Title
  └── First-run setup (one screen) ── Cold open
 Gameplay
  ├── Pause Menu (Menu / Esc)                    overlay, game paused
  │     ├── Mikan        (landing: Life, turf goal, Clout, Bond, loadout)
  │     ├── Posse        (PosseBuilder — editable anywhere outside combat)
  │     ├── Crew         (CrewScreen — view; edit at the Lot)
  │     │     └── Cat Card (Crew variant) ── LessonFlow (Lot only)
  │     ├── Turf         (TurfScreen — view; assign at the Lot)
  │     │     ├── SentryPicker (Lot only; or field-post at a Scent Post)
  │     │     └── TributeOverview
  │     ├── Fence Line   (also direct: View / Tab)
  │     │     └── Cat Card (Rival variant)
  │     ├── Sniff        (re-read today's Morning Sniff)
  │     └── Options      (Controls, Accessibility, Audio, Display, Tips)
  ├── Verdict Prompt     (system-triggered after Routing a Rival)
  ├── Standoff Name-Card (HUD; hud.md)
  ├── The Lot            (physical stations deep-link into the tabs above, editable)
  └── The Doorstep       (Morning Sniff; Tribute pile)
```

Maximum depth from gameplay: three (Pause → tab → card or picker). East always goes up exactly one level; Menu always returns to the game.

### 1.3 The Lot as a physical menu

The Lot (rusting kei truck, stacked crates) is the Crew headquarters. Each management function is a place a cat would go, and each deep-links into the same tabbed screens as the pause menu, in editable mode:

| Station (proposal) | Opens | Why here |
|---|---|---|
| The crates, where Crew cats lounge | Crew tab (walk up to a specific cat to open its card directly) | The roster is visible as actual cats before it is a grid |
| The truck roof (highest point) | Turf tab | A cat surveys territory from height; the screen is the view from the roof |
| The truck bed | Lesson flow | Teacher and student are shown sparring there after a Lesson |
| The gap in the Lot fence | Leaves for town with the current Posse | Posse confirmation happens by walking out |

A returning player who wants speed can press Menu at the Lot and use the tabs directly; the stations are the teaching path, not a toll.

### 1.4 Controller navigation model

Reasoning: these screens are visited every in-game day by a player holding a gamepad on a sofa or a handheld. The model is **focus-based with spatial navigation and no virtual cursor**, with the same six verbs on the same buttons everywhere (consistency lowers the learning cost of five dense screens to one).

| Input (gamepad) | Keyboard / Mouse | Meaning on every screen |
|---|---|---|
| D-pad or left stick | Arrow keys / W A S D; mouse hover | Move focus spatially. D-pad and stick are always equivalent; nothing needs analogue precision |
| South | Enter / Space / left click | Confirm, open, drill in |
| East | Esc / right click | Back exactly one level. Never discards silently: screens that hold a pending change ask |
| North | F | Secondary view of the focused thing (info, "last night", Tribute detail) |
| West | R | Tertiary action on the focused thing (pin, sort, Warden) |
| L1 / R1 | Q / E | Previous / next sibling: pause tabs at top level; district or cat inside a screen |
| L2 / R2 | Page Up / Page Down; mouse wheel | Zoom out / in, or page a long list |
| Right stick | Mouse wheel over a panel | Scroll the detail panel without moving focus |
| View | Tab | Legend overlay: every icon, pattern and emblem on the current screen, with words |
| Menu | Esc (held) | Close everything and return to the game |

Rules:

- **Focus is always visible** (thick dark-brown ring plus a small paw pointer; not colour-only) and **always remembered** per screen for the session.
- **Lists wrap; grids do not** (wrapping in a 2-D grid disorients).
- **Disabled is focusable and explains itself.** A locked action shows why in the footer ("Change this at the Lot", "Crew is full 6/6"). Nothing is hidden because it is unavailable, so positions are stable and muscle memory holds.
- **Footer legend** on every screen lists only the actions valid for the current focus.
- **Hold-to-confirm** is reserved for irreversible choices (Verdict, forgetting a Move, sleeping). Every hold has a press-then-confirm alternative.
- **Repeat**: 350 ms initial delay, 90 ms repeat (tunable; slower preset for motor accessibility).
- **Mouse** never moves gamepad focus by hover alone once the gamepad has been used in the last second (prevents fighting inputs).
- The clock is paused in every screen (canon), so nothing here is ever timed.

---

## 2. Fence Line (`FenceLineScreen`)

### 2.1 Purpose and context

**Player need**: "Who runs this town, where do I stand with each of them, and what changed while I slept?" The Fence Line is where the nemesis system becomes a picture the player can read in two seconds and gossip about.

**Player goal**: find any known Rival and open their card within three inputs; see every overnight change without hunting.

**Game goal**: make rank, Grudge and history legible so the player forms intentions ("tonight I go after Goma"), and deliver `RivalRankChanged` events as theatre.

| Question | Answer |
|---|---|
| Just doing? | Reading the Morning Sniff; or just finished a Verdict; or planning at the Lot; or idly checking mid-prowl |
| Emotional state | Curious, scheming; sometimes stung after a loss |
| Cognitive load | Low — out of combat, clock paused |
| Already knows | Names from Standoffs; maybe that "someone rose last night" |
| Most likely doing | Checking one specific Rival; scanning for changes; choosing a target |
| Afraid of | Not understanding why something changed; missing a returning exile |

**Emotional target**: gleeful nosiness — a cat on a wall watching the neighbours.

### 2.2 Entry and exit

| Trigger | Source | Transition | Data in | Notes |
|---|---|---|---|---|
| View / Tab | Roaming | Pause opens on this tab | Current district | Unavailable in combat and at home vignettes |
| Pause → Fence Line | Pause | Tab switch | Last focused Rival | |
| Morning Sniff portrait selected | Doorstep | Deep link | `rival_id` | Opens focused on that Rival with the change replaying |
| After a Verdict (optional, "See the wall") | Verdict payoff | Deep link | `rival_id` | Shows the consequence landing on the wall |
| First Rival encounter (onboarding) | System | Scripted pan | `rival_id` | One time only |

| Exit action | Destination | Data out |
|---|---|---|
| East / Menu | Previous state | Pinned Rival, if changed |
| South on a Rival | Cat Card (Rival) | `rival_id` |
| L1/R1 at pause level | Sibling tab | — |

### 2.3 Wireframe — district view

```
┌──────────────────────────────────────────────────────────────────────────┐
│ FENCE LINE            Mikan · Lane Cat (Clout 2 of 7)     Day 15 · Morning│
│ L1 < (bell)1 Hidamari  [(stripes) 2 Akane Arcade]  3 ░░  4 ░░  5 ░░  6 ░░ > R1│
├──────────────────────────────────────────────────────────────────────────┤
│                               ╭───────╮                                  │
│  BOSS                         │ (cat) │ Madam Sabi                       │
│                           ____│ Yowler│____        <- gatepost           │
│          ╭───────╮       |    ╰───────╯    |      ╭───────╮              │
│  CAPTAINS│ (cat) │^      |                 |      │  (?)  │              │
│   _______│ Goma  │_______|                 |______│  ???  │_______       │
│  |       ╰─spiked╯  rose last night                ╰───────╯      |      │
│  |                                                                |      │
│  | ╭─────╮  ╭─────╮  ╭─────╮  ╭─────╮  ╭─────╮                    |      │
│  | │(cat)│  │(cat)│  │ . . │  │ (?) │  │(cat)│   TOUGHS (crates)  |      │
│  | │Kinako│ │Azuki│  │away │  │ ??? │  │Mame │                    |      │
│  | ╰─bell╯  ╰─────╯  ╰prints╯ ╰─────╯  ╰─new─╯                    |      │
│  |  Humbled           Chased Off         arrived last night       |      │
├──────────────────────────────────────────────────────────────────────────┤
│ GOMA "the Soggy" · Captain · Scrapper Lv 9 (^ above you)                 │
│ Grudge ▮▮▮▮▯ NEMESIS      Last: Routed you at the Fish Crates, Day 14    │
│ (S) Card   (W) Pin trail   (N) Last night   L2 Whole town   (E) Back     │
└──────────────────────────────────────────────────────────────────────────┘
```

One district fills one screen: 1 Boss on the gatepost, 2 Captains on the wall top, 5 Toughs on the crates below (canon population: 8 per district). Height is rank; the eye reads the pecking order without a label.

**Whole-town view (L2)**: all six wall sections side by side as one long wall, harbour end to hilltop end, each cat reduced to a head silhouette with its state pip; Botan's seat is the highest point at the far end with the Great Boss marker. Locked districts are mist with a count of silhouettes only if the brief's "unknown Rivals are silhouettes" applies to locked districts too (assumption: locked districts show mist, not counts).

```
┌──────────────────────────────────────────────────────────────────────────┐
│ FENCE LINE · WHOLE TOWN                                   (crown) Botan  │
│                                                                    ▲     │
│  1 Hidamari     2 Arcade      3 Hill     4 Harbour   5 Yard   6 Heights  │
│     ▲              ▲            ░           ░          ░         ░       │
│    ▲ ▲            ▲!▲          ░ ░         ░ ░        ░ ░       ░ ░      │
│  ▲▲▲▲▲          ▲▲.▲▲        ░░░░░       ░░░░░      ░░░░░     ░░░░░     │
│  (bell) claimed  [focus]      mist        mist       mist      mist      │
│ 3 changes last night: Arcade 2, Hidamari 1          (S) Open district    │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Seat states

Every state has a shape or prop, never only a tint.

| State | How the seat shows it | Source |
|---|---|---|
| Known Rival | Full portrait with Scars, name, Style glyph | Nemesis |
| Unknown Rival | Dark silhouette, "???"; rank still readable from seat height | Nemesis |
| Nemesis | Spiked seat frame, hackles icon | Grudge over threshold |
| Humbled (pays you Tribute) | A small bell tag hangs from the seat | Verdict |
| Chased Off | Empty seat, paw prints leading off the wall, faint outline, "away" | Verdict |
| Recruited | Gone from the wall; a bell-gold ribbon on the seat until the slot refills; the cat is now in Crew | Verdict |
| Nose-Touched ally | A nose-boop pip | Verdict |
| Turncoat (ex-Crew) | A torn bell tag | `BetrayalTriggered` |
| Rose / fell last night | Up or down chevron chip; hop animation on open | `RivalRankChanged` |
| New arrival / returned exile | "new" or "back" chip; returning exiles walk in along the wall top | Nemesis |
| Stronger / equal / weaker than Mikan | Double-up, up, equals, down marker by the level | Crew `PowerRating` |
| Pinned | A pin with a paw-print | UX (see below) |
| District claimed by you | Bell on the district tab; the gatepost shows your Warden (or an empty bell cushion) | `DistrictClaimed` |
| Feuding pair | On focus, a thin dotted line links the focused cat to the cats it is feuding with | Nemesis |

### 2.5 "Last night" replay (North)

Opening the Fence Line for the first time after a Night Shuffle auto-plays each change in the visible district in sequence (0.6 s each: the hop up, the tumble down, the walk-in), with a one-line caption per change ("Goma Routed Azuki and took the wall top"). North replays it on demand and lists the changes as a column so nothing depends on catching an animation. Reduced motion: no hops; the list opens directly with before/after seat markers.

### 2.6 Pin trail (West)

Pinning one Rival (one at a time) marks their footprints in Whisker Sense with their portrait chip (see `hud.md` E5). This is the game's only "objective marker", it is player-set, and it works through scent. Needs Nemesis/Territory support (assumption).

### 2.7 States and variants

| State | Trigger | Visual | Behaviour |
|---|---|---|---|
| First visit (onboarding) | First Rival met | Only that Rival lit; the rest silhouettes | Scripted focus; one hint card |
| Populated | Default | As wireframe | Full navigation |
| Changes pending | After Night Shuffle | Change chips; replay auto-plays once | Replay skippable with any input |
| District locked | Not yet unlocked | Mist over the section | Focusable tab; footer: "Nobody you know lives here yet" |
| District claimed | `DistrictClaimed` | Bell on tab; Warden on gatepost | Remaining Rivals still shown |
| Read-only at home / in the house | Pause at home | Same | Same (viewing is always allowed) |
| Life 8 | Empire decaying | More chevrons, more spikes; no special UI | Same |
| Data unavailable | Error | Wall with empty seats and "Nobody's about" | East only |

---

## 3. Rival Detail Card (`CatCard`, Rival variant)

### 3.1 Purpose and context

**Player need**: "Remind me what there is between me and this cat, and how I beat him." This is where "Rivals Remember" is proven on demand: the card is the receipt for every Scar and Title.

**Player goal**: within one screen and no scrolling, learn this Rival's known Fears, current Grudge and last encounter; with scrolling, read the whole history.

**Game goal**: surface Memory, traits and Grudge so players plan around Fears and feel authorship of the Rival's story.

**Arrival context**: calm, out of combat, usually from the Fence Line or mid-Verdict. Cognitive load low. Fear: "I can't tell what I've discovered versus what the game is hiding."

**Emotional target**: fond malice — reading a rival's file and smirking.

### 3.2 Wireframe

```
╔══════════════════════════════════════════════════════════════════════════╗
║ ╭──────────╮  GOMA  "the Soggy"                  (stripes) Awning Gang   ║
║ │ portrait │  Captain · Scrapper · Lv 9   ^ above you                    ║
║ │ + Scars  │  Now: holds Croquette Corner, Akane Arcade                  ║
║ ╰──────────╯  Sting: (N) play   _/‾\__/‾‾\_   <- contour of his yowl     ║
║──────────────────────────────────────────────────────────────────────────║
║ GRUDGE   ▮▮▮▮▮▮▮▯▯▯  72            |<- Nemesis line        NEMESIS       ║
║ Says: "Still wearing that bell? I can hear you lose from here."          ║
║──────────────────────────────────────────────────────────────────────────║
║ FEARS                               STRENGTHS                            ║
║ [v Water]   found Day 9             [^ Thick Hide]  found Day 14         ║
║ [ ? ]       not found yet           [ ? ]           not found yet        ║
║ SCARS   notched left ear (you, Day 9) · sticking plaster (Azuki, Day 13) ║
║──────────────────────────────────────────────────────────────────────────║
║ HISTORY WITH YOU                              3 meetings · you 1 · him 1 ║
║ ● Day 14 Night  Routed you at the Fish Crates. Rose to Captain.          ║
║   Day 9  Dusk   You Routed him with a Pile-On. Verdict: Chase Off.       ║
║   Day 9  Dusk   Soaked by the sprinkler. Earned "the Soggy".             ║
║   Day 6  Day    First met. Called you "Collar".                          ║
║   ...                                                                    ║
║ WITH YOUR CREW   Mochi: fought him off at Laundry-Pole Corner, Day 12    ║
║ FEUDS            Azuki (Tough, Awning Gang)                              ║
╟──────────────────────────────────────────────────────────────────────────╢
║ (W) Pin trail   (N) Play sting   L1/R1 Previous / next cat   (E) Back    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### 3.3 Information hierarchy

1. **Identity** — portrait with Scars, name, Title, rank. Recognition first; the model *is* the history.
2. **Grudge** — the one meter on the card, with the Nemesis threshold drawn on the track so the player sees how close a Rival is to turning personal, and a text state.
3. **Fears and Strengths** — the actionable part. Known traits show an icon, name and when it was found; unknown ones show "?".
4. **History** — reverse-chronological, one line per Memory entry (60 characters or fewer, same budget as barks), each with day, phase and an event pictogram. First screen shows four lines; the rest scroll.
5. **Crew entanglements and feuds** — one line each; the proof that the system runs without you.

### 3.4 Design notes

- **The yowl-sting has a visual signature.** Canon says a Rival is recognisable with eyes closed; for players who cannot hear, each sting is also drawn as a short contour line generated from its melody. The same contour appears on the Sting Flare chip in the HUD, so a deaf player can learn "that shape is Goma".
- **Discovered versus hidden.** A "?" slot says a trait exists and is unknown. Whether the *number* of unknown slots is shown is a design leak that Nemesis must rule on (open question); the fallback is a single "?" meaning "there may be more".
- **Where learned.** "found Day 9" ties knowledge to the player's own play, reinforcing that intel is earned.
- **Unknown Rival variant**: silhouette portrait, rank and Clowder only, "You haven't met." History empty state: "No history. Yet."
- **Boss variant**: same card. Authored personality line in place of a procedural taunt until first met.
- **Crew variant** (see §6): same layout; Grudge is replaced by Loyalty, "History with you" continues unbroken from when the cat was a Rival, and the Scars from your own bites are still listed. This continuity is the point.
- **No raw schema dump.** Stats (Nerve, Bite, Hide, Voice, Zip), Moves and Knacks for a Rival are behind L2 "More" as a second page, and only for what has been seen in a fight (assumption). Depth lives on the wall and in history, not in a stat sheet.

### 3.5 States

| State | Trigger | Visual / behaviour |
|---|---|---|
| Known | Met at least once | Full card |
| Unknown | Silhouette on the wall | Reduced card; no pin |
| Mid-Verdict | Opened from the Verdict prompt | Footer shows only "(E) Back to the Verdict" |
| Chased Off | In exile | "Now: gone from the Arcade. He'll be back." No location |
| Recruited | Now Crew | Redirects to the Crew variant |
| Long history | More than 4 entries | Scroll indicator; right stick or wheel scrolls |

---

## 4. Verdict Prompt (`VerdictPrompt`)

### 4.1 Purpose and context

**Player need**: "I won. Now I decide what this cat becomes." The Verdict is the engine of the nemesis system and the game's main act of authorship.

**Player goal**: understand the immediate and later consequence of each of the four Verdicts well enough to choose on purpose, in under ten seconds once learned.

**Game goal**: capture exactly one Verdict per Routed Rival and never let it be chosen by accident.

| Question | Answer |
|---|---|
| Just doing? | Mashing attack; a Pile-On dust cloud has just cleared |
| Emotional state | Triumphant, adrenal, thumbs still moving |
| Cognitive load | High residual; dropping fast |
| Already knows | Who this is, roughly how the fight went |
| Most likely doing | Picking the Verdict they already had in mind for this cat |
| Afraid of | Pressing the wrong thing in the mash; not understanding a cost; losing a cat they wanted |

**Emotional target**: the swagger of a small tyrant with all the time in the world.

### 4.2 Options considered

| Option | For | Against |
|---|---|---|
| A. Vertical list, cursor, confirm | Familiar; scales if a fifth Verdict appears | Default-highlighted item invites mash-through; no spatial memory; reads as a menu, not a moment |
| **B. Four-way compass, direction selects, hold to commit (recommended)** | Four choices fit four directions exactly; each Verdict gets a fixed place that becomes muscle memory; no default focus so mashing cannot choose; direction mnemonics carry meaning | Does not scale past four; needs a non-directional fallback for some assistive controllers |
| C. Face-button diamond, one press each | Fastest | The player's thumb is on those buttons mid-mash; highest accident risk for an irreversible choice |
| D. Act it out in the world (walk away = Chase Off, touch noses = Nose-Touch) | Most cat-true | Ambiguous, hard to make accessible, cannot show costs |

Recommendation: **B**, with a list-mode fallback in accessibility options. Final choice is the user's.

### 4.3 Wireframe

```
┌──────────────────────────────────────────────────────────────────────────┐
│                  GOMA "the Soggy" is Routed.                   1 of 2    │
│                                                                          │
│                      ╭────────────────────────────╮                      │
│                      │ (Up)  NOSE-TOUCH           │                      │
│                      │ Respect. Grudge cleared.   │                      │
│                      │ No reward.                 │                      │
│                      ╰────────────────────────────╯                      │
│ ╭────────────────────────╮                    ╭────────────────────────╮ │
│ │ (Left)  CHASE OFF      │   (Goma, puffed    │ (Right)  RECRUIT       │ │
│ │ Out of the Arcade now. │    and cowering;   │ Joins the Crew  (5/6)  │ │
│ │ He'll be back, tougher │    Mikan standing  │ Offering 120 (m)       │ │
│ │ and angrier.           │    over him)       │ You carry 85 — short   │ │
│ ╰────────────────────────╯                    │ Loyalty would start low│ │
│                                               ╰── unavailable: why ────╯ │
│                      ╭────────────────────────────╮                      │
│                      │ (Down)  HUMBLE             │                      │
│                      │ Stays and pays Tribute.    │                      │
│                      │ Grudge simmers.            │                      │
│                      ╰────────────────────────────╯                      │
│ Grudge ▮▮▮▮▮▮▮▯▯▯ 72 NEMESIS        (N) His card      Hold (S) to decide │
└──────────────────────────────────────────────────────────────────────────┘
```

Direction mnemonics (fixed forever): **Up** = Nose-Touch (lift them up), **Down** = Humble (put them beneath you), **Left** = Chase Off (out of the frame), **Right** = Recruit (over to your side).

### 4.4 Flow

```
 Rout animation (Combat)
   └─> world freezes on the cowering Rival; HUD hidden; camera low two-shot
        └─> 500 ms input lock (drains the mash)
             └─> four cards fan in; NO card is focused
                  ├─ direction (D-pad / stick / W A S D / hover) -> card raises,
                  │    Rival and Mikan preview the pose for that Verdict
                  ├─ (N) His card -> Cat Card -> (E) back here, same focus
                  └─ hold (S) 600 ms on a raised card (or press, then confirm)
                       └─> `VerdictChosen` request -> Nemesis -> `VerdictApplied`
                            └─> payoff animation, 2–3 s (skippable after first sight
                                 of each Verdict type)
                                 ├─ Recruit -> Crew's recruitment flow (owned by Crew)
                                 ├─ more Routed Rivals -> next Verdict ("2 of 2")
                                 └─ else -> encounter tally -> roaming
```

### 4.5 Rules

- **It cannot be dismissed.** Justified by Pillar 4's design rule: a fight with a Rival always ends in a choice. There is no timer and the clock is paused, so an undismissable modal costs the player nothing but a decision. Pause (Options only) remains reachable.
- **Consequence in two beats.** Each card says what happens now and what it risks later, in at most three short lines. The card states direction of effect, not numbers the player cannot yet interpret; exact values belong to Nemesis and Economy and may be shown on the info layer.
- **Unavailable Verdicts stay in place and say why** ("Crew is full 6/6", "You carry 85 of 120", or a rule from Nemesis such as a Boss who cannot be recruited). They are never hidden, so positions never move.
- **Recruit shows its real price** before commitment: the Recruit offering in Morsels (canon range 20–800), Crew count against cap, and the starting Loyalty band (low if Grudge was high, canon).
- **First-time teaching**: the first Verdict ever shows a one-line hint under the title ("Nobody is gone for good. Choose what he becomes."). No options are locked for tutorial purposes (recommendation; Nemesis may script the first Rival).
- **Preview poses** let the player read each Verdict without text: Mikan turns away (Chase Off), sits tall over the Rival (Humble), beckons with a tail flick (Recruit), leans in (Nose-Touch).
- **Losing has no Verdict screen.** On a Posse wipe the Rival passes a verdict on *you*: a short non-interactive beat (their taunt, their new Title) before Mikan slinks home (canon). Specified by Nemesis/Narrative; UX asks only that it reuse the Standoff name-card component and last under 6 s.

### 4.6 States

| State | Trigger | Behaviour |
|---|---|---|
| Input lock | First 500 ms | No input accepted; cards animate in |
| Unfocused | After lock | Hold-to-decide disabled; footer: "Choose a direction" |
| Card raised | Direction held or tapped | Hold ring available on that card; other cards dim |
| Unavailable card raised | Direction onto a disabled Verdict | Reason shown; hold ring absent |
| Queue | More than one Rival Routed | "1 of N"; order = order Routed |
| List mode (accessibility) | Setting | Vertical list, no default focus, press then confirm |
| Reduced motion | Setting | No fan-in; preview poses cut instead of blend |

---

## 5. Turf (`TurfScreen`) — territory map, Sentry assignment, Tribute overview

### 5.1 Purpose and context

**Player need**: "What's mine, what's slipping, who's guarding it, and what's it feeding me?" This is the planning screen for the 5-minute and daily loops.

**Player goal**: in one view, see which of 30 Patches are held and by whom and which are weakening; post or move a Sentry in four inputs; see what Tribute arrived and why.

**Game goal**: capture Sentry and Warden assignments; make Scent decay and Tribute legible so passive income funds choices rather than replacing play (brief risk 5).

**Framing**: canon says Whisker Sense is the only minimap overlay, so this is not a map the player carries. It is **the view from the truck roof at the Lot**: Yunagi is a hill town with six districts stacked from harbour to hilltop, so from a height the town really is six bands, drawn as a scent-picture rather than a street plan. Opened from pause elsewhere, it is Mikan's memory of that view, and read-only.

| Question | Answer |
|---|---|
| Just doing? | Morning routine after the Doorstep; or checking after a Caterwaul |
| Emotional state | Proprietary, mildly anxious about losses |
| Cognitive load | Low to medium — comparing several Patches |
| Afraid of | Stripping a Sentry by accident; not seeing a Patch about to flip; not understanding where Tribute went |

**Emotional target**: a landlord's satisfaction, with one or two itches to scratch.

### 5.2 Wireframe — main view (editable, at the Lot)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ TURF     Life 2 · Claim Hidamari Lane (2 of 3 Patches for the Den)       │
│          Patches 2/30 · Sentries 1/2 · Clout: Lane Cat                   │
├────────────────────────────────────────────────┬─────────────────────────┤
│ hilltop                                        │ LAUNDRY-POLE CORNER     │
│ 6 Kasumi Heights    ░░░░░░ mist ░░░░░░         │ Hidamari Lane · Patch   │
│ 5 Kurogane Yard     ░░░░░░ mist ░░░░░░         │ Held by (bell) Bell     │
│ 4 Shiosai Harbour   ░░░░░░ mist ░░░░░░         │   Clowder               │
│ 3 Tsukimi Hill      ░░░░░░ mist ░░░░░░         │ Scent (62)  v fading    │
│ 2 Akane Arcade      (S)──(S)──<D>──(S)──(S)    │ Sentry   [ + empty ]    │
│   Awning Gang        stripes on every node     │ Lives here: Kinako      │
│   Boss: Madam Sabi                             │   (Humbled, pays you)   │
│ 1 Hidamari Lane     (B)──[B]──<D>──(W)──(W)    │ Tribute  9 (m) a day    │
│   Wall Sitters       ^focus  Den  brick hatch  │ Last raid: Day 13, held │
│   Warden: — (not claimed)                      │ ! Next to a rival Patch │
│   [House] [Lot]                                │                         │
│ harbour                                        │                         │
├────────────────────────────────────────────────┴─────────────────────────┤
│ TRIBUTE this morning  22 (m)     Hidamari ██ 22   others —               │
│ Stash 212 (m) · Carried 85 (m) · Shinies 3                               │
│ (S) Post Sentry  (W) Warden  (N) Tribute detail  L1/R1 District  (E) Back│
└──────────────────────────────────────────────────────────────────────────┘
 Node legend: (B) bell = yours   (W)/(S)/... = holder's emblem + pattern
              <D> = Den   node ring = Scent 0–100   cat-head pip = Sentry
              [ ] = focus   ! = at risk (if Territory exposes a risk value)
```

Each district band holds exactly 5 Patch nodes (one Den), laid out left to right in a fixed authored order with lines for adjacency. Thirty nodes, six rows: navigable with a D-pad in at most 9 moves corner to corner, and the whole empire is visible without scrolling. Locked districts are mist.

### 5.3 Node anatomy

| Channel | Encodes | Non-colour carrier |
|---|---|---|
| Fill colour | Holder Clowder | Emblem in the node and a fill pattern (§9.1) |
| Ring around node | Scent 0–100 | Arc length; number in the detail panel |
| Ring style | Scent trend | Solid = steady or rising; dashed = fading; flashing is never used |
| Shape | Patch vs. Den | Round vs. angular with a cushion pip |
| Cat-head pip(s) | Sentry posted (1 per Patch, 2 at a Den — canon) | Filled vs. hollow pip |
| "!" tag | Raided last night, or at risk | Tag shape + text in the panel |
| Small bell tag | Has Humbled residents paying Tribute | Tag |

### 5.4 Sentry assignment flow

```
 Focus a Patch you hold ──(S) Post Sentry──> SentryPicker
   ├─ list of Crew, sorted by Power Rating (default) | Loyalty | Style
   │    each row: portrait · name · Style · Lv · Power · Loyalty mood ·
   │              current job (Posse / Sentry at … / Warden of … / Idle)
   ├─ focus a cat -> right side shows before/after for BOTH Patches
   │    if the cat is already posted elsewhere
   ├─ (S) on a cat
   │    ├─ Idle cat -> posted immediately, undoable
   │    ├─ cat in the Posse -> confirm: "Mochi leaves the Posse."
   │    └─ cat posted elsewhere -> confirm: "Fish Crates loses its Sentry."
   └─ (W) Clear post -> Patch unguarded
 ──> `SentryAssignRequested` -> Territory validates -> screen updates on its event
```

```
╔══════════════════════════════════════════════════════════════════════════╗
║ POST A SENTRY · Laundry-Pole Corner        Sentry slots used 1 of 2      ║
║──────────────────────────────────────────┬───────────────────────────────║
║ Sort: [Power]  Loyalty  Style            │ IF YOU POST KURI HERE         ║
║ ● Kuri   Prowler  Lv 7  Pw 41  content   │ Laundry-Pole Corner           ║
║          Idle at the Lot                 │   guard: none -> Kuri (41)    ║
║   Mochi  Bruiser  Lv 8  Pw 52  loyal     │   likely raiders: Goma (58)   ║
║          In the Posse                    │                               ║
║   Suzu   Yowler   Lv 6  Pw 33  restless  │ Kuri                          ║
║          Sentry at Fish Crates           │   earns Sentry XP             ║
║   Azuki  Trickster Lv 5 Pw 29  wary      │   feud: none here             ║
║          Idle at the Lot                 │                               ║
╟──────────────────────────────────────────┴───────────────────────────────╢
║ (S) Post   (W) Clear this post   (N) Cat card   (E) Back                 ║
╚══════════════════════════════════════════════════════════════════════════╝
```

- **Slots are visible before the attempt.** Sentry slots are gated by Clout (canon); the header shows used/available, and when full, Post is disabled with "Raise your Clout for another Sentry."
- **Comparison, not prediction.** The panel shows the guard's Power Rating next to known likely raiders' Power Rating if Territory/Nemesis can name them. It does not show a win percentage (raid math is Territory's, and a percentage would turn the wall of cats into a spreadsheet).
- **Warden** (West on a claimed district's band header): same picker, one per claimed district (canon). An ex-Rival Captain as Warden shows their history badge: the betrayal risk in the brief should be *readable in advance* through the Loyalty mood, never a surprise with no tell.
- **Field posting.** After Spraying a Scent Post in the world, a Context Prompt offers "Post Sentry" with the current Posse cats only (canon 5-minute loop: "decide whether a Crew cat stays as Sentry"). That is a three-input version of this flow and uses the same confirm copy.
- **Read-only mode** (pause, away from the Lot): identical view; South opens the Patch detail only; footer: "Post Sentries at the Lot or at the Scent Post."

### 5.5 Tribute overview (North)

```
╔══════════════════════════════════════════════════════════════════════════╗
║ TRIBUTE · this morning                                       total 22 (m)║
║──────────────────────────────────────────────────────────────────────────║
║ Hidamari Lane   ██████████████  22     2 Patches · 1 Humbled resident    ║
║ Akane Arcade    —                      not yours                         ║
║ ...                                                                      ║
║──────────────────────────────────────────────────────────────────────────║
║ WHY IT CHANGED SINCE YESTERDAY                                  -6       ║
║  v Fish Crates raided by Goma — Sentry Suzu Routed         -9            ║
║  ^ Laundry-Pole Corner Scent rose                          +3            ║
║──────────────────────────────────────────────────────────────────────────║
║ LAST 7 MORNINGS   . : | | | : |        Stash 212 (m)  Carried 85 (m)     ║
║ Carried Morsels are lost if the Posse is wiped (1 in 5). The Stash is    ║
║ safe.                                                                    ║
╟──────────────────────────────────────────────────────────────────────────╢
║ (S) Go to that Patch   (E) Back                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

- "Why it changed" lists the top causes with signed deltas and arrows; each line deep-links to its Patch. Cause-and-effect is the cure for "the overnight simulation is unfair" (concept technical risk).
- The Stash and carried split is stated once in plain words because the 20% carried-loss rule (canon) is otherwise invisible.
- Life 8: this panel is where the player sees Tribute piling up unused. UX does not add a prompt telling the player what to do with it; that discovery belongs to Narrative and the world.

### 5.6 Morning Sniff (stub — full spec owed)

The Morning Sniff at the Doorstep reports Night Shuffle steps 1–3 as scent icons and cat portraits (canon). It is the daily entry point into this screen and the Fence Line, so the three must agree. Minimum contract set here:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ MORNING SNIFF · Day 15                                                   │
│ 1 TURF     (!) Fish Crates raided — (Goma) Routed (Suzu) — Patch held    │
│ 2 RIVALS   (Goma) ^ Captain     (Mame) new on the Arcade wall            │
│ 3 TRIBUTE  22 (m) on the Doorstep                 (v 6 from yesterday)   │
│ (S) on any line -> jumps to the Patch / the Fence Line seat / Tribute    │
└──────────────────────────────────────────────────────────────────────────┘
```

Order matches the canon resolution order (Territory, Nemesis, Economy). Portraits lead, text follows; at most six lines before "and N more". It is re-readable all day from Pause → Sniff. Step 4 (Narrative) is never reported: the next vignette is seen, not announced.

### 5.7 States

| State | Trigger | Behaviour |
|---|---|---|
| Editable | Opened at the Lot | All actions enabled |
| Read-only | Opened from pause elsewhere | Assign actions disabled with reason |
| Early game | Life 1, one Patch | Only the Hidamari band is drawn large; other bands are thin mist strips so the screen does not look like an empty spreadsheet |
| No Sentry slots | Clout gate | Post disabled with reason |
| Raid in progress (Caterwaul) | Live event | The Patch node shows the yowl pictogram; the panel says "Under attack now"; no remote action (go there or do not) |
| After betrayal | `BetrayalTriggered` | The vacated post shows a torn bell tag until acknowledged |
| Life 8 | Triple decay | Many dashed rings; no extra alarm UI |

---

## 6. Crew (`CrewScreen`), Posse Builder, Lesson Flow

### 6.1 Purpose and context

**Player need**: "Who's with me, who's coming out tonight, and what can they teach each other?" Crew are few and known (anti-pillar: not a 150-entry dex), so the screen must present individuals, not inventory.

**Player goals**: change a Posse member in three inputs; teach a Move in one guided flow without accidentally destroying one; notice a restless cat before it leaves.

**Game goal**: capture Posse composition, Move/Knack loadouts and Lessons; surface Loyalty honestly.

**Arrival context**: morning at the Lot, calm, planning; or a quick Posse swap mid-prowl after a cat was Routed. Fears: forgetting a Move for good; breaking a Sentry post by pulling its cat; missing that someone is unhappy.

**Emotional target**: a boss looking over their people — affection with an eye for usefulness.

### 6.2 Wireframe — Crew roster

```
┌──────────────────────────────────────────────────────────────────────────┐
│ CREW  5 of 6 (Clout: Lane Cat)        Show: [All] Posse Sentries Idle    │
├───────────────────────────────────────────┬──────────────────────────────┤
│ ╭────────╮ ╭────────╮ ╭────────╮          │ MOCHI  "Wall-Warmer"         │
│ │ MIKAN  │ │●Mochi  │ │ Suzu   │          │ Bruiser · Lv 8 · Power 52    │
│ │Scrapper│ │Bruiser │ │Yowler  │          │ Was: Wall Sitters Tough      │
│ │(Posse) │ │(Posse) │ │Sentry  │          │ Loyalty ▮▮▮▮▯ loyal  ^       │
│ ╰────────╯ ╰────────╯ ╰────────╯          │ Nerve 380  Bite 31  Hide 40  │
│ ╭────────╮ ╭────────╮ ╭ ─ ─ ─ ─╮          │ Voice 18   Zip 22            │
│ │ Kuri   │ │ Azuki  │   empty             │ MOVES                        │
│ │Prowler │ │Trickst.│ │        │          │ 1 Belly Flop    ●  [thump]   │
│ │ Idle   │ │ Idle ! │   1 free            │ 2 Sit On It     ●● [thump]   │
│ ╰────────╯ ╰────────╯ ╰ ─ ─ ─ ─╯          │ 3 Bucket Shove  ●  [thump]   │
│                                           │ 4 Big Yawn      ●  [yowl]    │
│  ! = restless (Loyalty low)               │ KNACKS  Heavy Sleeper · —    │
│                                           │ ZOOMIES Bruiser's            │
│                                           │ Fears [v Vacuum] Scars 1     │
├───────────────────────────────────────────┴──────────────────────────────┤
│ (S) Card   (W) Put in Posse   (N) Teach…   L2 Reorder Moves   (E) Back   │
└──────────────────────────────────────────────────────────────────────────┘
```

- Grid of up to 24 cards (canon cap at Great Boss), 6 by 4 at full size; at the early cap of 6 the cards are drawn larger. Empty slots up to the current cap are shown; slots beyond the cap are not.
- **Loyalty** (0–100) is shown as a five-step mood with a word (devoted / loyal / content / wary / restless), a trend arrow, and the number on the card. A restless cat carries a "!" on the roster. The UI never shows betrayal odds; it shows the mood and, on the card, the top reasons Crew's formula reports ("hasn't been out with you in 6 days") if that data exists (assumption).
- **Job** is always visible: Posse, Sentry at …, Warden of …, Idle.
- **Move order** (L2) sets which Move sits on which Shortcut Diamond button and menu row (see `hud.md` C3).
- Mikan's card is first and cannot be removed; it shows the "any Style" badge (canon: the only cat who can equip Moves from any Style) and, at Lives 8–9, age modifiers if Crew exposes them.
- Away from the Lot the grid is the same; Teach is disabled with "Lessons happen at the Lot."

### 6.3 Wireframe — Posse Builder

```
┌──────────────────────────────────────────────────────────────────────────┐
│ POSSE                                                     Power 148      │
│ ╭────────╮  ╭────────╮  ╭────────╮  ╭ ─ ─ ─ ─╮                           │
│ │ MIKAN  │  │●Mochi  │  │ Kuri   │    + empty                            │
│ │Scrapper│  │Bruiser │  │Prowler │  │        │                           │
│ │(always)│  │412/520 │  │Routed  │                                       │
│ ╰────────╯  ╰────────╯  ╰──rest──╯  ╰ ─ ─ ─ ─╯                           │
│ Styles: Scrapper · Bruiser · Prowler · —      Types: Claw Thump (no Yowl,│
│                                                      no Fang)            │
├──────────────────────────────────────────────────────────────────────────┤
│ SWAP MOCHI FOR…                              Sort: [Power] Style Loyalty │
│ ● Suzu   Yowler    Lv 6  Pw 33  restless   Sentry at Fish Crates  (!)    │
│   Azuki  Trickster Lv 5  Pw 29  wary       Idle                          │
│   (leave this spot empty)                                                │
├──────────────────────────────────────────────────────────────────────────┤
│ (S) Swap in   (N) Cat card   (E) Back                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

- Four slots; Mikan's is locked (canon: Mikan is always in the Posse). Select a slot, then a cat: two decisions, three inputs.
- The summary line reports **coverage, not advice**: Styles present and damage types available. It never says "you need a healer".
- A Routed Crew cat (recovers at the next Sunspot or at home — canon) is shown as "Routed, resting" and can be swapped out anywhere outside combat.
- Pulling a posted Sentry into the Posse warns and confirms: "Fish Crates loses its Sentry." Away from the Lot this is still permitted because Posse swapping is canon-anywhere, but see open question 9 — it lets the player move a Sentry remotely, which bends the Lot rule.
- In combat: not reachable.

### 6.4 Lesson flow (move-teaching)

Canon: a Lesson teaches a Move or Knack from one cat to another, at the Lot; first Lesson about 40 Morsels, top Lessons up to 1,500 plus Shinies; 4 Moves and 2 Knacks per cat. Learnsets, slot rules and Mikan's cross-Style learning are Crew's.

**Options considered for the flow's starting point**

| Option | For | Against |
|---|---|---|
| **A. Student first ("Who learns?") — recommended** | Matches the player's intent ("I want Mochi to get something new"); one list of everything that cat can learn, from whom, for how much | Hides "what can Kuri teach?" unless added as a filter |
| B. Teacher first ("Who teaches?") | Matches the fiction (a cat shows another) | Player must hunt teachers to find a Move; more steps |
| C. Move first (catalogue) | Good for min-maxers | Reads as a shop; drifts toward a dex (anti-pillar) |

Recommendation: **A**, entered from a cat's card (North: Teach…), with the teacher shown as a portrait on every row so the fiction stays present.

```
 LESSON     1 Who learns  ›  2 What  ›  3 Which slot  ›  4 Confirm
```

**Step 2 — What**

```
╔══════════════════════════════════════════════════════════════════════════╗
║ LESSON  › MOCHI learns…                         Stash 212 (m) · Shinies 3║
║──────────────────────────────────────────┬───────────────────────────────║
║ MOVES Mochi can learn                    │ LOUD PURR        [yowl]  ●    ║
║ ● Loud Purr     ● [yowl]   from (Suzu)   │ Steady purr that restores a   ║
║                             65 (m)       │ little Nerve to nearby Posse. ║
║   Roof Drop     ●● [claw]  from (Kuri)   │ Target: ring around self      ║
║                             Prowler only │                               ║
║   Dirt Kick     ● [thump]  from (Azuki)  │ Taught by Suzu (keeps it)     ║
║                             40 (m)       │ Cost 65 (m) from the Stash    ║
║ KNACKS Mochi can learn                   │                               ║
║   Light Sleeper            from (Kuri)   │ Mochi's Moves now: 4 of 4     ║
║                             90 (m)       │ -> you will choose one to     ║
║ ALREADY KNOWN  Belly Flop, Sit On It …   │    replace                    ║
╟──────────────────────────────────────────┴───────────────────────────────╢
║ (S) Choose   (W) Filter by teacher   (N) Why can't I?   (E) Back         ║
╚══════════════════════════════════════════════════════════════════════════╝
```

**Step 3 — Which slot** (only if all slots are full; otherwise the first empty slot is preselected and the step is skipped)

**Step 4 — Confirm**

```
╔══════════════════════════════════════════════════════════════════════════╗
║ LESSON  › CONFIRM                                                        ║
║                                                                          ║
║   (Suzu)  ──teaches──>  (Mochi)                                          ║
║                                                                          ║
║   MOCHI BEFORE                     MOCHI AFTER                           ║
║   1 Belly Flop    ●  [thump]       1 Belly Flop    ●  [thump]            ║
║   2 Sit On It     ●● [thump]       2 Sit On It     ●● [thump]            ║
║   3 Bucket Shove  ●  [thump]       3 Bucket Shove  ●  [thump]            ║
║   4 Big Yawn      ●  [yowl]   ──>  4 LOUD PURR     ●  [yowl]   new       ║
║                                                                          ║
║   ! Mochi forgets Big Yawn.                                              ║
║     Nobody else in the Crew knows Big Yawn. It will be gone.             ║
║                                                                          ║
║   Cost 65 (m)     Stash 212 -> 147                                       ║
╟──────────────────────────────────────────────────────────────────────────╢
║ Hold (S) Teach      (E) Back                                             ║
╚══════════════════════════════════════════════════════════════════════════╝
```

- **The forgetting warning is the most important line in the flow.** The One Cat Schema has `moves[4]` and no "known but unequipped" list, so replacing a Move appears to destroy it. The confirm step states what is forgotten and whether any other Crew cat could re-teach it. When nobody else knows it, commit requires hold-to-confirm; when someone does, a single press suffices ("Kuri can teach it again").
- **Ineligible Moves are listed with the reason** ("Prowler only", "Needs Lv 10", "Costs 2 Shinies — you have 1") under North: "Why can't I?". Reasons come from Crew's rules; the UI invents none.
- **Mikan as student** shows every Style's Moves, with the "any Style" badge explaining why.
- **After commit**: a 2-second beat in the truck bed (teacher demonstrates, student copies, small sparkle), skippable; the student's card opens with the new Move marked "new" and a prompt to set Move order.
- **Costs** are shown before the list is entered and again at confirm; an unaffordable row shows the shortfall, not just a grey price.
- **Does the teacher keep the Move?** Assumed yes ("keeps it"). If Crew decides Lessons *transfer*, step 4 needs a second forgetting warning for the teacher.

### 6.5 States

| State | Trigger | Behaviour |
|---|---|---|
| Solo | Life 1, no Crew | Roster shows Mikan and empty slots; hint: "Cats you win over will gather here." Posse tab shows Mikan alone |
| Populated | Default | As wireframes |
| Crew full | At cap | Header "6 of 6"; empty slots absent; card footer explains cap and Clout |
| Restless cat | Loyalty low | "!" on roster; card shows reasons |
| After betrayal | `BetrayalTriggered` | The empty slot shows a torn bell tag and "left for the Awning Gang"; (S) opens their Rival card on the Fence Line |
| Read-only | Away from the Lot | Teach disabled with reason; Posse swap still enabled |
| Nothing to learn | No eligible Moves | "Nobody here can teach Mochi anything new yet." |
| Cannot afford | Any | Shortfall shown; confirm disabled |
| Life 9 heir selection | Narrative trigger | Out of scope for this pass; expected to reuse the roster with one-cat selection and a hold-to-confirm |

---

## 7. Pause Menu (`PauseMenu`)

### 7.1 Purpose and context

**Player need**: "Stop the world, tell me where I am in the game, and let me get to anything in two presses."

**Player goal**: resume in one press; reach any tab in at most two; find the current turf goal without reading a log.

**Game goal**: one stable hub for all on-demand information the HUD refuses to show (see `hud.md` §2.2), plus options.

**Arrival context**: any moment. May be mid-fight (a breather), mid-prowl (a check), or at home (the doorbell rang in real life). Fear: losing progress; missing a home scene.

**Emotional target**: a calm, warm pause — the game holding its breath.

### 7.2 Wireframe — landing tab ("Mikan")

```
┌──────────────────────────────────────────────────────────────────────────┐
│ L1 < [MIKAN]  POSSE  CREW  TURF  FENCE LINE  SNIFF  OPTIONS > R1         │
├──────────────────────────────────────────────────────────────────────────┤
│ ╭────────────╮  MIKAN                              Day 15 · Dusk         │
│ │  portrait  │  Scrapper · Lv 8                    (sky disc, large)     │
│ │ (ages with │  Life 2                                                   │
│ │  each Life)│  Claim Hidamari Lane                                      │
│ ╰────────────╯  ▮▮▯ 2 of 3 Patches to open the Den · then Rout Daifuku   │
│                                                                          │
│ CLOUT   House Pet ─ [Lane Cat] ─ Known Face ─ Boss ─ … ─ Great Boss      │
│         next: more Crew, another Sentry                                  │
│ HOME    ♥ ♥ ♥ ♥ ♡ ♡ ♡ ♡ ♡ ♡        (bowl) Well-Fed today                 │
│ FOOD    Carried 85 (m)   Stash 212 (m)   Shinies 3                       │
│ MOVES   1 Bunny-Kick ● · 2 Claw Flurry ● · 3 Hiss ● · 4 —     (S) Change │
│                                                                          │
│ Last nap: warm roof tile, Akane Arcade — a little while ago              │
├──────────────────────────────────────────────────────────────────────────┤
│ (E) Resume   (S) Select   L1/R1 Tabs   (View) Legend    Quit to title…   │
└──────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Design notes

- **Resume is the Back button**, not a menu item to travel to: East or Menu resumes from any top-level tab.
- **The turf goal is the only objective text in the game.** It is phrased as turf, with a small progress bar. Life is shown as a number; whether the Lives' names are player-facing is Narrative's call (several of them name human events — open question).
- **Bond is shown as hearts only**, labelled with a house pictogram and the word "Home". No names, no explanation of what raised it. Well-Fed appears as a bowl.
- **Clout ladder** shows all seven canon ranks with the current one raised and the next rank's gates in a few words (from Economy).
- **Save model is stated, not offered.** Canon saves are Sunspot naps and sleeping at home; the pause menu shows the last nap and warns on Quit: "You'll wake where you last napped." Whether an autosave or save-and-quit exists is an open question for technical-director; without one, real-life interruptions lose up to a phase of play, which is an accessibility problem.
- **No "skip home scene" anywhere** (Pillar 2 violation list). During a home vignette the pause menu offers only Resume and Options.
- **Tips** (under Options) holds every hint card already seen, as a re-readable list, plus the control map with live remapping.

### 7.4 Variants by context

| Context | Tabs available | Notes |
|---|---|---|
| Roaming | All | Posse editable; Crew/Turf read-only away from the Lot |
| At the Lot | All, editable | Same screens the stations open |
| In combat | Mikan (read-only), Options, Controls | No management, no Fence Line. "Slink away" (flee) is not placed here pending Combat's design |
| Slow Blink | Same as combat | Returns to Slow Blink, not real time |
| Verdict pending | Options only | Returns to the Verdict |
| Home, free roaming | All, read-only except Posse | World behind is dimmed, not blurred, so the room stays present |
| Home vignette playing | Resume, Options | No skip |
| Time-skip montage | Options only | No skip on first viewing (recommendation; Narrative decides) |

### 7.5 States

| State | Trigger | Behaviour |
|---|---|---|
| Open | Menu / Esc | World pauses and dims 150 ms; focus on last-used tab this session (Mikan on first open) |
| Controller disconnected | System | Pause opens automatically with a reconnect card |
| Quit confirm | Quit to title | Modal with last-nap information; default focus on Cancel |
| Options dirty | Changed settings | Applied live; no "apply" step; Back keeps them |

---

## 8. Onboarding and Tutorialisation — the first hour

### 8.1 Principles

1. **The game teaches like a cat learns: by doing it once, with something soft at stake.** Every mechanic is introduced in a situation where the worst outcome is comedy.
2. **One new verb per beat**, and no new verb in the 60 seconds after another.
3. **The HUD grows with the player.** A HUD element does not exist on screen until the beat that teaches it (progressive disclosure). The first fight shows a one-row Posse Panel and no Paw pads until the first pad fills.
4. **Prompts are a glyph and at most three words** on the street. **At home there are no words at all**: glyph plus pictogram.
5. **Cats may teach cats** (canon: cats understand cats). Where a sentence is needed, it comes from a cat's balloon, in voice, 60 characters or fewer, not from a system text box. System hint cards are the fallback and never exceed two short lines.
6. **Nothing is gated behind reading.** Each hint has a "do it" completion condition; text dismisses itself when the action is performed.
7. **Re-teach on evidence, not on a timer.** If a player demonstrably is not using a core verb, a contextual nudge returns (table in §8.3).
8. **Everything taught is kept** in Pause → Options → Tips.
9. **The human story is never tutorialised.** No hint ever points at a human, a suitcase or a pair of shoes.

### 8.2 First-run setup (before the cold open)

One screen, six choices, all changeable later, each previewed live: text size, HUD size, screen shake and flashes, hold or toggle inputs, "I play without sound" (turns on the non-verbal twins in `hud.md` §10.4 and haptic twins), and difficulty (Kitten / Alley / Feral). Default focus is "Start" so a player who wants no setup presses once.

### 8.3 Beat sheet

Times follow the concept document's onboarding curve (walk and wall at minute 1, crow at 3, first Paw at 6, first Spray at 10, first Rival and Verdict within 20). Later times are estimates that depend on Life 1's authored length. Life 1 is a kitten with a turf goal of "the garden, then 1 Patch", and Night is locked until the cat flap in Life 2 (canon).

| Time | Beat | Teaches | How it is taught | HUD / screen introduced | Safety net |
|---|---|---|---|---|---|
| 0:00 | Cold open: the box in the rain on the shrine steps | Move | A stick glyph, nothing else. Yellow raincoat approaches | H1 pictogram prompt | Cannot fail; the scene waits |
| 0:01 | Home, first morning: the house and garden | Interact; jump onto the garden wall | Bowl pictogram; a ledge that invites; first Sense Icon (fish) | H2 Sense Icons | Free play; no clock shown |
| 0:02 | The Call, first time | Being called; where home is | Sung from the veranda while Mikan is at the far end of the garden; the three note-dots appear and Mikan's ears turn | Call Ripple | Running to it gives the first Bond heart (H3) |
| 0:03 | A crow on the lane side of the wall | Swat, Dodge | Glyph + "Swat"; the crow telegraphs a slow peck with a ground shape | Command Stub (two lines); one-row Posse Panel; first damage numbers and Thump glyph burst | Critter with tiny Nerve; a loss just scatters the crow |
| 0:06 | Second crow, or two | Paws; Slow Blink; first Move | The first paw pad fills with its pop and haptic; **time slows by itself** and the South glyph pulses on the pad: "Slow Blink". The menu has one Move in it | Paw pads; Slow Blink menu (one entry); Target Plate with Frazzle gauge | Slow Blink has no timer; the only possible action is the right one |
| 0:08 | An older cat on the wall notices the kitten (staging proposal for Narrative) | Whisker Sense | A cat balloon in voice ("Use your whiskers, Collar."); hold L2: the lane lights up with a moss-green mark on the lamp post | Whisker Sense layer; Patch Tag | Hold or toggle per setup; hint persists until used |
| 0:10 | The lamp post | Spray; Scent; a Patch can be yours | Glyph + "Spray"; the Patch Tag ring fills live; the border wisps turn bell-gold | Patch Tag Scent ring | Cannot fail |
| 0:12 | Frazzle and Pile-On, on a single Stray | Frazzle gauge; Ruffled; Pile-On | The Stray is set up next to a water bucket; knocking it over Ruffles; the gauge fills; the Pile-On Prompt appears large (solo "Pile-On" in Life 1 is Mikan alone in the dust cloud — assumption) | Frazzle states; Pile-On Prompt | The Frazzled window is extended for this fight (request to Combat) |
| 0:15 | A warm roof tile | Sunspot nap: heal, save, costs half a phase | Glyph + "Nap" with the half-phase mark; on waking, the Sky Disc shows the jump | Sky Disc | — |
| 0:17 | First Rival | Standoff; a named cat; winning or losing both continue the story | Standoff name-card with "Collar!" taunt; not skippable the first time | Standoff Name-Card; full Target Plate identity row | Loss is canon content: the day ends at home and the Rival gains a Title at your expense. The game says so through the Rival's line, not a tutorial |
| 0:20 | First Verdict (on first win over a Rival; may come a day later if the player lost) | The four Verdicts; nobody is gone for good | Verdict Prompt with the one-line first-time hint; all four visible | Verdict Prompt | 500 ms input lock; hold to commit; nothing here is wrong |
| 0:22 | Dusk: the Call | The pull home; the curfew trade (Night is still locked) | The Call Ripple and Sky Disc with its bowl pip; the home thread in Whisker Sense | — | End-of-day auto-walk exists as a fallback |
| 0:24 | Evening vignette; sleep | Home verbs; ending the day | Pictograms only; Sleep Ring | H4 Sleep Ring | Hold or press-twice |
| 0:27 | Morning: the Doorstep | Tribute; Morning Sniff; the world moved overnight | The first small pile of fish; the Sniff has two or three lines | Morning Sniff; Pause → Sniff | Each line deep-links |
| 0:29 | The Fence Line reveal | The hierarchy; who is above you | From the Sniff's Rival line, the camera goes to the wall: one lit cat among silhouettes, Daifuku on the gatepost | Fence Line; Rival card | Scripted focus, one hint |
| 0:32 | First recruit arrives at the Lot (from a Recruit Verdict or a Stray, per Crew) | The Lot; Crew; Posse of two | Walk to the crates; the cat's card; walk out through the gap together | Crew tab; Posse tab; two-row Posse Panel | If the player never chose Recruit, a Stray encounter provides the first Crew cat (assumption) |
| 0:35 | First fight with two cats | **Conducting**: the ally-command glyph; commanding an ally in Slow Blink | The Crew cat's pads fill; its row shows the R2 glyph; pressing it opens Slow Blink on that cat. The Crew cat barks ("Say the word, boss.") | Conductor cue; cat tabs in the menu | AI cat fights on its own meanwhile |
| 0:38 | Same or next fight | Switching leader; bell ping | A hint when the leader is far from the action or below half Nerve: D-pad glyph + "Switch" | Leader marker; bell ping | Optional; never forced |
| 0:42 | A wall above an unaware Tough | High Road; Stalk; Ambush | Awareness mark (closed-eye crescent) and the Ambush Prompt | Awareness Marks | Failing the Ambush just starts a Standoff |
| 0:46 | The Shortcut Diamond | Moves without slow-mo | Offered only after the player has used Slow Blink five times: "Hold L1: same Moves, no pause" | Shortcut Diamond | Entirely optional |
| 0:50 | Life 1's turf goal met; sleep; first time-skip montage | A Life ends when you sleep on a met goal | No UI at all | — | — |
| 0:55 | Life 2 opens: Mikan is a young adult; a Patch is raided or at risk | Sentries; Turf screen | From the truck roof; post the first Sentry; the picker's before/after | Turf; Sentry Picker | Slots and reasons always shown |
| Later in Life 2 | Second recruit | Lessons | From a cat's card at the Lot; the truck-bed beat | Lesson flow | The forgetting warning |
| Later in Life 2 | The cat flap | Night; staying out versus going home | A home vignette shows the flap; no text. On the first Night the Sky Disc shows its fourth segment lit | — | — |
| When it first happens | A Caterwaul | Optional live defence | The flare; a Crew bark ("That's our corner!") | Caterwaul Flare | Ignoring it is a legitimate choice |
| When it first happens | Zoomies full | The limit-break | The portrait ring goes jagged; the menu entry appears with a one-time pulse | Zoomies ring and entry | Persists between fights, so no rush |

**Evidence-based nudges**

| Evidence | Nudge |
|---|---|
| A Posse cat has held full Paws for 15 s of combat, in two consecutive fights | The conductor cue enlarges once and the cat barks a request |
| The player has not opened Slow Blink in three fights with Paws available | The Command Stub's Slow Blink line pulses at the next full pad |
| Leader Routed twice in a day without switching beforehand | Switch hint at the next low-Nerve moment |
| Three Frazzled windows expired without a Pile-On | The Pile-On Prompt enlarges for the next one |
| Whisker Sense unused for a whole day | A Crew bark while roaming ("Smell that?") near a trail |
| Lost to the same Rival twice | The Rival card's Fear slot glints on the Fence Line; no advice text |
| Dusk reached three days running without going home, in Lives 1–2 | Nothing. Staying out is a legitimate choice (canon: neither is punished) |

### 8.4 What the first hour deliberately does not teach

Wardens, Humbled uprisings, betrayal, Shinies, Clout gates beyond the first, the duo Boss, and anything about the house. These arrive when they first occur, through the Morning Sniff and a Crew bark.

---

## 9. Accessibility

`design/accessibility-requirements.md` does not exist yet. This section is UX's input to it; accessibility-specialist sets the tier and audits. Every option below is reachable from Pause → Options → Accessibility and from first-run setup where noted. **No accessibility option may translate, caption or explain human speech or writing; the language veto applies to assistive features too**, so everything below is designed to give access by other routes.

### 9.1 Colour-blind-safe territory colours

Canon assigns each Clowder a scent colour, and the brief's readability rules lean on those colours for enemy outlines. Seven hues cannot be made safe by palette choice alone, so **colour is never the only carrier**:

| Clowder | Canon colour | Emblem (proposal for art-director) | Map fill pattern | Scent particle shape (Whisker Sense) |
|---|---|---|---|---|
| Bell Clowder (player) | bell-gold | Bell | Solid, no pattern | Round sparkle with a tick |
| Wall Sitters | moss green | Brick | Brick hatch | Small squares |
| Awning Gang | vermilion | Awning scallop | Diagonal stripes | Short dashes |
| Lantern Eyes | indigo | Two lit eyes | Dots | Paired dots |
| Salt Paws | sea blue | Wave | Wavy lines | Curls |
| Rust Runners | orange-brown | Rail and sleepers | Ladder hatch | Chevrons |
| Steam Court | white-violet | Steam swirl | Scallops | Spirals |
| Unclaimed | none | Empty ring | No fill | None |

Known confusions the patterns must cover: moss green / vermilion / orange-brown (red-green deficiencies); indigo / sea blue (close hue for everyone at small sizes); bell-gold / orange-brown; white-violet against pale backgrounds.

Additional requirements:

- **Value ladder.** Ask art-director to separate the seven colours by lightness as well as hue (suggested order, light to dark: Steam Court, Bell, Salt Paws, Awning, Wall Sitters, Rust Runners, Lantern Eyes) so they survive greyscale.
- **Emblems travel with the colour** everywhere: enemy overhead bars and Target Plate, Patch Tag, Turf nodes, Fence Line tabs, Standoff card.
- **Palette presets**: Default; red-green tuned; blue-yellow tuned; **Two-Tone** (mine = one colour, everyone else = one contrasting colour, emblems tell rivals apart). Custom per-Clowder colours are a stretch goal.
- **Legend** on View / Tab on every screen that uses the colours.
- **Human signature colours are a second, unsolved colour dependency.** Yellow, teal, coral and plum carry the wordless story, and their redundant channel is an instrument — which is audio. A player who is both colour-blind and deaf loses both. UX asks Narrative and Art to give each household member a consistent non-colour signature as well (a garment silhouette, a pattern, a carried object). Flagged in open questions.

### 9.2 Shake and flash reduction

| Setting | Range | Default | Effect |
|---|---|---|---|
| Screen shake | 0–100% | 100% | World camera only; the HUD never shakes (`hud.md` §7) |
| Reduce flashes | Off / On | Off (offered at first run) | Impact frames become outline-only; no full-screen inversion or white frames |
| Flash safety cap | Always on | — | No more than 3 full-screen luminance flashes per second in any mode; Art and Combat must author within it |
| Camera pull-ins (Slow Blink, Zoomies, Pile-On) | Full / Reduced / Cut | Full | Reduced halves the zoom; Cut replaces motion with a cross-fade |
| Action lines and glyph bursts | 100 / 50 / Minimal | 100 | |
| Hit-stop | Full / Short | Full | Short halves durations; never fully off by default because it is also a readability beat |
| Whisker Sense transition | Sweep / Instant | Sweep | |
| Reduced motion (menus) | Off / On | Off | Screens cut instead of sliding; Fence Line replay becomes a list; Verdict cards do not fan |
| Pile-On dust cloud | Animated / Calm | Animated | Calm holds a static cloud with stars |

### 9.3 Hold-to-toggle

Every hold in the game has an alternative, set per action or all at once:

| Hold input | Alternative |
|---|---|
| Whisker Sense (L2 / Q) | Toggle |
| Stalk (R1 / Ctrl) | Toggle |
| Sprint (hold East / Shift) | Toggle, or auto-sprint after 1 s of full stick |
| Guard (R1 / right mouse) | Toggle |
| Shortcut layer (L1) | Toggle (press L1, then a face button) |
| Slow Blink | Toggle by default; hold-mode available |
| Hold-to-confirm (Verdict, forget a Move, sleep) | Press, then confirm in a two-button dialog with default on Cancel |
| Hold attack for heavy | Double-tap alternative (request to Combat) |
| Hold for info in menus | Toggle |
| Repeated presses (combo strings) | Hold-to-combo option (request to Combat) |

Hold durations are adjustable (300–1500 ms) for players who need shorter or longer.

### 9.4 Slow-mo as accessibility

Slow Blink is already the game's largest accessibility feature: it converts reaction into decision. The options extend it rather than adding a separate "easy mode", and none changes nemesis or story (canon: difficulty modes scale combat only).

| Setting | Options | What it does |
|---|---|---|
| Slow Blink speed | 5% (canon default) / 2% / Full stop | Full stop makes every command untimed |
| Auto Slow Blink | Off / When any Paw fills / When the leader's Paw fills / When an enemy starts a big Move | The game opens the decision moment for you |
| Slow Blink on danger | Off / On | Opens automatically when the leader drops below 25% Nerve |
| Chain commands | Off / On | Stay in Slow Blink until you leave it |
| Combat speed | 100 / 85 / 70% | Global combat time scale (request to Combat) |
| Auto-Scrap | Off / On | The leader performs basic attacks and basic dodges; the player only conducts. With Full stop, combat becomes effectively turn-based and one-button |
| Crew initiative | Off (default) / On | AI Crew spend their own Paws sensibly (request to Combat; changes the conductor fantasy, so opt-in) |
| Wider dodge and Pile-On windows | Normal / Wide | Request to Combat |
| Standoff hold | Off / On | Standoffs wait for a press |

These are assists, independent of Kitten / Alley / Feral, and are never labelled as lesser play.

### 9.5 Text size and legibility

- **Base sizes** at 1080p: body 28 px, labels 26 px minimum, headings 36–44 px. At 1280x720 handheld that is roughly 18–19 px physical for body — the floor. Nothing in the game goes below 18 px at 720p.
- **Text scale**: 100 / 125 / 150%. Screens reflow rather than shrink: Cat Card history shows three lines instead of four; Turf's right panel becomes a pop-over; the Crew grid goes from six to four columns.
- **Typeface requirements** (art-director chooses): rounded to match the look, but with distinct I / l / 1 and O / 0, open counters, and full coverage for target languages. An alternative high-legibility face is offered as a toggle.
- **Contrast**: 7:1 target for body text on cream panels, 4.5:1 minimum; focus ring 3:1 against both panel and background.
- **Line length**: 60 characters or fewer for cat lines (canon); menus keep descriptions to two lines of about 38 characters.
- **No all-caps body text.** Capitals are used for short titles only (they are used heavily in these wireframes only to mark headings in ASCII).
- **Numbers**: tabular figures so values do not jitter.
- **Icons never stand alone** in menus: every icon has a word beside it or on the Legend overlay.
- **Menu narration**: all menu text, focus changes and state changes are exposed for narration (platform-dependent; feasibility with ui-programmer). Cat balloons are narrated; Murmur is not, by rule.

### 9.6 Deaf and hard-of-hearing support — when music carries the story

The problem, stated plainly: this game forbids subtitling the humans, tells their story largely through music and tone of voice, and gives each human an instrument. A deaf player gets staging, costume colour, objects, light and weather — the canon's other channels — but loses the Call, Murmur tone and the score. That gap cannot be closed with captions without breaking Pillar 1, so it must be closed with **non-verbal visual and haptic twins**, authored with the same care as the audio.

**Street: every gameplay-relevant sound and its twin**

| Sound | What it tells the player | Visual twin | Haptic twin |
|---|---|---|---|
| The Call | Home is calling; where home is | Call Ripple (three note-dots on the home bearing) | Three pulses in the motif's rhythm |
| Caterwaul | A Patch of yours is being raided now | Caterwaul Flare with Patch name | Long rising rumble |
| A Rival's yowl-sting off-screen | An Ambush or approach, and by whom | Sting Flare with portrait; the sting's contour glyph | Short double pulse |
| A Rival's yowl-sting in a Standoff | Identity | Name-card; contour glyph on the Rival card | — |
| Paw fills | You can act | Pad pop; conductor cue | Light tick |
| Frazzle break | Pile-On window open | Prompt, label, countdown | Strong pulse |
| Enemy wind-up vocal | Incoming Move | Ground shape and named ribbon | — |
| Cat vocalisations (barks, taunts) | Character, Memory | Readable balloons (canon) | — |
| Whisker Sense sonification | Scent strength and proximity | Wisp density and column height | Optional proximity pulse |
| Human footsteps, broom, scooter horn | Hazards that scatter fights; ways to hit Fears | Hazard ground shapes; prop glint | — |
| Hit weight (taiko and brass stabs) | Feel | Hit-stop, glyph bursts, action lines | Impact rumble scaled to the hit |
| Low Nerve audio | Danger | Row notch, numerals, corner tint | Slow soft pulse (opt-in) |
| Drowsiness at end of Night | The day is ending | Yawn animation, vignette, pictogram | — |
| Phase-change music shift | Time of day | Sky Disc, light | — |

**Home: the story channels and their twins** (see `hud.md` §10.4 for the element definitions)

| Sound | What a hearing player gets | Twin, and the limit on it |
|---|---|---|
| Murmur (tone of human speech) | Warmth, tension, laughter, grief — never words | **Murmur Ribbons**: wordless shapes whose form and motion carry tone. Tone only. Off by default, offered at first run |
| The Call | Mikan's name; Haru's theme; later sung by others | Call Ripple in the singer's signature colour; three-pulse haptic. On for everyone |
| Per-human instrument and leitmotif | "The music is about this person" even when they are absent | **Music Motes** in that person's signature colour and pattern; authored per vignette |
| Score mood | The emotional reading of the scene | Carried by the canon's visual channels — light, weather, colour — which Narrative and Art should treat as primary rather than supporting. Optional: a slow breathing vignette whose tempo follows the score |
| Can opener, key in the door, phone, rain, a door that does not open | Events a cat reacts to | **Sound Cues**: an ear chip with a pictogram and bearing; Mikan's ear-turn animation is always present regardless of settings |
| Purring (Mikan's own) | Contentment, lap time | Soft continuous haptic; visible flank movement |
| Silence (Life 8) | Absence | The twins fall silent too: no ripple, no motes. Absence must be legible as absence — the house's empty interaction prompts carry it |

**Requirements on other departments**

- Narrative and Art: stage every beat so that it reads with the sound off. The brief already commits to "early playtests with no briefing"; add **playtests with no audio**, and playtests with deaf and hard-of-hearing players, before the vertical slice gate.
- Audio: mono option; separate sliders for music, Murmur, cat voices, effects and the Call; a dynamic-range option so the quiet house is not inaudible to hard-of-hearing players.
- Haptics: a designed vocabulary, not generic rumble; intensity slider; on platforms without haptics the visual twins must be sufficient on their own.

### 9.7 One-handed and reduced-input play

The camera has an authored yaw (canon), so the game never needs a second stick. That makes one-handed play unusually achievable and worth committing to.

- **Full remapping** of every action on gamepad and keyboard/mouse, including chords; remaps show conflicts and allow one input to serve different actions in exploration and combat.
- **No required chords.** L1 + face (Shortcut Diamond) and L1 + R1 (Zoomies) are conveniences; both actions are always in the Slow Blink menu.
- **No required holds** (§9.3) and **no required rapid presses** (hold-to-combo).
- **No required right stick.** Soft auto-target chooses targets; target cycling can be moved to the D-pad or done inside Slow Blink.
- **Presets**: "Left hand" (left stick, D-pad, L1, L2, L3, View — face-button actions move to D-pad and bumper layers) and "Right hand" (right stick moves; face buttons, R1, R2, R3, Menu). Each preset relies on Slow Blink for Moves and leaves real-time needs at three: move, attack, dodge.
- **Minimum-input mode**: Auto-Scrap + Auto Slow Blink + Full stop (§9.4) reduces combat to a stick and one button.
- **Keyboard-only and mouse-only**: keyboard-only is fully supported by the model in §1.4. Mouse-only (click to move, click to target, menus by click) is a stretch goal and unverified.
- **Menus** need only directions, confirm and back; L1/R1 tab switching has an on-screen arrow equivalent.
- **Stick sensitivity and dead zones** adjustable; stick navigation in menus can be turned off in favour of D-pad only (tremor).
- **Sticky leader option**: disables accidental leader switching (D-pad left/right needs a confirm).

### 9.8 Cognitive load and comfort

- **Nothing is timed outside real-time combat**; the clock is paused in every screen and in Slow Blink (canon).
- **The game remembers for you**: the Morning Sniff is re-readable; the Fence Line replays changes; the Rival card keeps the history; the turf goal is one line in pause.
- **One decision per screen step**: Lesson flow and Sentry picker each ask one question at a time and show before/after.
- **Concurrent streams** per screen: Fence Line 4 (rank, state, Grudge, change); Rival card 4; Verdict 4 options with two consequences each — the heaviest moment, mitigated by fixed positions and no timer; Turf 5 (holder, Scent, Sentry, risk, Tribute) — at the upper end, mitigated by the detail panel carrying the numbers; Crew 4. All are within 7 plus or minus 2.
- **Consistent places**: the footer legend, the detail panel on the right, back on East, tabs on L1/R1 — on every screen.
- **Content note.** The game's emotional centre is a bereavement (Life 8) that the player is not told about in advance. Whether to offer an opt-in content note at first run is a creative-director and Narrative decision; UX recommends an optional, unspoilery line in the first-run setup ("This story includes loss.") that the player can choose to reveal.
- **Photosensitivity**: §9.2 caps apply in all modes; a warning screen is shown at boot per platform requirements.

---

## 10. Data and Events (shared)

UI reads; systems own. UI fires requests; systems validate and answer with their own events. Canon event names (brief §6.1) are used as given; **request names below are UX proposals** for the owning systems to rename or replace.

### 10.1 Data read

| Data element | Source | Updates on | Used by | Missing-data behaviour |
|---|---|---|---|---|
| Cat record (One Cat Schema) | Nemesis (Rivals), Crew (Crew, Mikan) | Open; `RivalRankChanged`; `VerdictApplied`; `BetrayalTriggered` | All screens | Silhouette card |
| Known/unknown flags per trait | Nemesis | `FearTriggered`; open | Rival card, Target Plate, Slow Blink | Trait shown as "?" |
| Memory entries (display lines) | Nemesis (events), Narrative (wording) | Open | Rival and Crew cards | "No history. Yet." |
| Grudge, Nemesis threshold | Nemesis | Open; `VerdictApplied` | Fence Line, Rival card, Verdict | Meter hidden |
| Yowl-sting id and contour | Audio / Nemesis | Open | Rival card, Sting Flare | No contour; play button hidden |
| Fence Line seating (district → rank → slot) | Nemesis | `RivalRankChanged`; Night Shuffle | Fence Line | Empty seats |
| Overnight change list | Nemesis, Territory, Economy | `DayEnded` → morning | Fence Line replay, Morning Sniff, Tribute detail | "A quiet night." |
| `PowerRating(cat_id)` | Crew | Open | Fence Line, pickers | Marker hidden |
| `Loyalty(cat_id)`, trend, reasons | Crew | Open; day start | Crew, pickers | Mood hidden |
| Patch record (holder, Scent, trend, Den flag, Sentry, residents, last raid, adjacency, risk) | Territory | Open; `PatchChanged`; `RaidResolved` | Turf, Patch Tag | Node drawn as unknown |
| Sentry / Warden slots used and allowed | Territory (rules), Economy (Clout gates) | Open; Clout change | Turf | Post disabled |
| Tribute by district; deltas with causes | Economy | `TributeDelivered` | Tribute overview, Sniff | "No Tribute yet." |
| Morsels carried / Stash; Shinies | Economy | On change | Pause, Turf, Lessons, Verdict | Dashes |
| Clout rank and next-rank gates | Economy | On change | Pause, Fence Line header | Rank only |
| Bond (0–10) | Narrative | `BondChanged` | Pause (hearts only) | Row hidden |
| Life index, turf goal and progress | Clock, Territory | `LifeAdvanced`; `PatchChanged`; `DistrictClaimed` | Pause, Turf header | Row hidden |
| Learnable Moves/Knacks per student, teacher, price, ineligibility reason | Crew (rules), Combat (Move data), Economy (prices) | Open | Lesson flow | "Nothing to learn yet." |
| Verdict availability and reasons; Recruit offering; starting Loyalty band | Nemesis, Economy, Crew | On prompt | Verdict | Card disabled with a generic reason |

### 10.2 Requests fired

| Player action | Request (proposed name) | Payload | Receiver | Expected answer |
|---|---|---|---|---|
| Commit a Verdict | `VerdictChosen` | `{rival_id, verdict}` | Nemesis | `VerdictApplied` |
| Post / move / clear a Sentry | `SentryAssignRequested` | `{crew_id or null, patch_id}` | Territory | `PatchChanged` or a refusal with reason |
| Appoint a Warden | `WardenAssignRequested` | `{crew_id or null, district_id}` | Territory | Territory's own event |
| Change the Posse | `PosseChangeRequested` | `{slot, crew_id or null}` | Crew | Crew's own event |
| Teach | `LessonRequested` | `{teacher_id, student_id, skill_id, slot}` | Crew (then Economy for payment) | Crew's own event |
| Reorder Moves | `MoveOrderChanged` | `{cat_id, order[4]}` | Crew | — |
| Pin a Rival | `RivalPinChanged` | `{rival_id or null}` | UX state, read by Whisker Sense | — |
| Acknowledge overnight changes | `ChangesSeen` | `{day_index, screen}` | UX state | — |
| Screen opened / closed | analytics only | `{screen, duration_ms}` | Analytics | — |

No screen writes to a system directly.

---

## 11. Transitions and Localisation

### 11.1 Transitions

| Transition | Type | Duration (ms) | Interruptible | Reduced motion |
|---|---|---|---|---|
| Pause open / close | World dim; panel rises | 150 / 120 | Yes | Cut |
| Tab change | Cross-slide in tab direction | 150 | Yes | Cut |
| Fence Line district change | The wall scrolls sideways | 250 | Yes | Cut |
| Fence Line whole-town zoom | Zoom out / in | 300 | Yes | Cross-fade 100 |
| Fence Line overnight replay | Hop, tumble, walk-in | 600 each | Any input skips | List instead |
| Cat Card open | Card flips up from the seat or grid cell | 180 | No | Cut |
| Verdict cards fan in | Scale and fade after input lock | 250 | No | Cut; lock remains |
| Verdict hold ring | Radial fill | 600 (adjustable) | Release cancels | Unchanged (it is feedback) |
| Sentry posted | Portrait hops onto the node | 300 | Yes | Cut |
| Lesson beat | Truck-bed vignette | 2000 | Skippable | Static card |
| Focus move | Ring travels | 60 | Yes | Cut |

### 11.2 Localisation

- All strings from the localisation table; no text in images. 40% expansion tolerated everywhere; the two-line Verdict cards and the footer legend are the tightest.
- **Procedural text is the risk**: Titles ("the Soggy"), Memory lines and Sniff lines are assembled from templates with names inside. Grammar (gender, case, articles, word order) must be handled by the template system per language; UX reserves 60 characters per line in every language and requires wrap rather than truncation for Memory lines.
- Canon terms (Posse, Paws, Slow Blink, Frazzle, Pile-On, Verdict names, Clout ranks) need a per-language glossary agreed before any screen is built.
- **Scribble is not localised** and never becomes real script in any territory, including Japanese-language builds, where real signage would be readable (Pillar 1).
- RTL: mirror layouts and the Fence Line's reading direction; the Verdict compass does **not** mirror (Left stays Chase Off) so guides and muscle memory are universal.
- CJK: check that shorter strings do not leave the Cat Card looking empty; allow larger type.

| Text element | English baseline | Max | Overflow | Risk |
|---|---|---|---|---|
| Rival name + Title | about 20 | 32 | Title wraps under the name | Medium |
| Memory line | 60 or fewer | 60 | Wraps to two lines | High (templates) |
| Verdict card body | 3 lines of about 26 | 3 lines of 34 | Font steps down one size, then wraps to 4 | High |
| Footer legend entry | about 12 | 18 | Second footer row | Medium |
| Patch name | about 22 | 30 | Wraps in panel; ellipsis on node | Medium |
| Move name | about 14 | 20 | Ellipsis with full name on info | Medium |
| Clout rank names | up to 14 | 20 | Ladder becomes two rows | Low |

---

## 12. Acceptance Criteria

**Navigation and input**
- [ ] Every screen is fully operable with gamepad D-pad and face buttons only; with keyboard only; with mouse only (menus).
- [ ] East goes back exactly one level on every screen; Menu returns to the game from any depth.
- [ ] Focus is visible at all times and is restored when returning to a screen within a session.
- [ ] Every disabled action is focusable and shows a reason in the footer.
- [ ] Every hold-to-confirm has a working press-then-confirm alternative.
- [ ] Controller disconnect on any screen opens the reconnect card without losing screen state.

**Fence Line**
- [ ] One district (8 seats) is fully visible without scrolling at 1280x720.
- [ ] Any known Rival's card opens in three inputs or fewer from the screen's opening state.
- [ ] After a Night Shuffle with N rank changes in a district, opening that district shows N change chips and the replay lists N lines.
- [ ] Every seat state in §2.4 is distinguishable in a greyscale capture.
- [ ] Unknown Rivals reveal no name, Style, traits or history.

**Rival card**
- [ ] Known Fears, Grudge with Nemesis line, and the latest Memory entry are visible without scrolling at 1280x720 and at 150% text.
- [ ] A recruited Rival's Crew card shows the same Scars, Title, Fears and prior Memory entries as their Rival card did.
- [ ] The sting contour on the card matches the contour on that Rival's Sting Flare.

**Verdict**
- [ ] No input is accepted for 500 ms after the prompt appears; no card has focus when input unlocks.
- [ ] Mashing any single button for 10 s from the end of a fight never commits a Verdict.
- [ ] Each Verdict occupies the same direction in every instance, including when disabled.
- [ ] A disabled Verdict shows its reason; Recruit shows offering, carried Morsels, Crew count and starting Loyalty band before commit.
- [ ] `VerdictChosen` fires exactly once per Routed Rival; with two Rivals Routed, two prompts appear in Rout order.
- [ ] The prompt cannot be dismissed without a Verdict and has no timer.

**Turf**
- [ ] All 30 Patches are visible on one screen at 1280x720 when all districts are unlocked.
- [ ] Posting an idle Crew cat to a held Patch takes four inputs or fewer from the screen's opening state.
- [ ] Moving a posted Sentry or pulling a Posse cat shows a confirmation naming what is lost.
- [ ] Away from the Lot, no Sentry or Warden assignment can be made from this screen.
- [ ] The Tribute overview total equals the `TributeDelivered` amount, and listed causes sum to the day-on-day difference (or show "other").
- [ ] Holder is identifiable on every node without colour (emblem and pattern).

**Crew, Posse, Lessons**
- [ ] A Posse member can be swapped in three inputs from the Posse tab.
- [ ] Mikan cannot be removed from the Posse.
- [ ] A Lesson that would overwrite a Move names the forgotten Move at confirm; if no other Crew cat knows it, commit requires hold or two-step confirm.
- [ ] Ineligible Moves display a reason supplied by Crew's rules.
- [ ] Lessons cannot be started away from the Lot.
- [ ] Cost and resulting Stash are shown before commit; an unaffordable Lesson cannot be committed.
- [ ] A cat with low Loyalty is marked on the roster without opening its card.

**Pause**
- [ ] Opens within 150 ms from any state where it is allowed; resumes in one press.
- [ ] Shows Life number, turf goal and progress, Clout, Bond hearts, food totals and last nap.
- [ ] During a home vignette only Resume and Options are offered; no skip exists.
- [ ] In combat no management tab is reachable.

**Language rule**
- [ ] No string on any screen names, quotes or describes a human or a human event (localisation audit of the full string table).
- [ ] Bond is shown as hearts with no explanatory text beyond the "Home" label.

**Onboarding**
- [ ] In a no-briefing playtest, 80% of first-time players have used Slow Blink, issued a command to a Crew cat, performed a Pile-On, Sprayed a Scent Post, given a Verdict and gone home when called, within their first 60 minutes. (Playtest criterion; threshold is a proposal.)
- [ ] No hint card contains more than two lines; no hint with text appears inside Haru's House.
- [ ] Every hint seen is listed in Options → Tips.

**Accessibility**
- [ ] All seven Clowders are distinguishable on the Turf screen, in Whisker Sense and on enemy markers in greyscale and in simulated red-green and blue-yellow deficiency captures.
- [ ] With audio muted and the non-verbal twins enabled, every row of the street table in §9.6 produces its visual twin.
- [ ] With Screen shake 0%, Reduce flashes On and Reduced motion On, no full-screen flash, camera shake or sliding transition occurs.
- [ ] With the "Left hand" or "Right hand" preset, a tester completes a Captain fight and posts a Sentry using one hand.
- [ ] With Auto-Scrap, Auto Slow Blink and Full stop enabled, a tester completes a Tough encounter using one stick and one button.
- [ ] At 150% text, no screen in this document clips or overlaps at 1280x720.
- [ ] All text meets 4.5:1; focus ring meets 3:1.

---

## 13. Assumptions for creative-director review

Decided inside the UX boundary because the systems GDDs were unavailable. Each needs its owner's confirmation.

| # | Assumption | Owner |
|---|---|---|
| K1 | Screens are viewable from pause anywhere; Sentry/Warden assignment and Lessons are editable only at the Lot (plus field-posting a Posse cat at a Scent Post just Sprayed). Posse swapping is allowed anywhere outside combat, per the glossary. | Creative-director, Territory, Crew |
| K2 | The Lot has physical stations (crates, truck roof, truck bed, fence gap) that deep-link into the screens. | Narrative, Level, Art |
| K3 | The territory screen is framed as the view from the truck roof, drawn as six stacked district bands, and is not a carried map. Working names "Turf", "Sniff" and "Mikan" for pause tabs are not canon. | Creative-director |
| K4 | Each district's Patches have a fixed authored order and adjacency that can be drawn as five nodes in a row. | Territory, Level |
| K5 | Territory can expose per Patch: Scent trend, residents (Humbled Rivals), last raid, and optionally a risk flag and likely raiders. Economy can expose Tribute deltas with causes. | Territory & Economy |
| K6 | When a district is claimed its eight Rival slots persist on the Fence Line; the Boss seat shows the player's Warden. | Nemesis |
| K7 | A recruited Rival leaves the Fence Line; a betraying Crew cat returns to it. | Nemesis |
| K8 | Locked districts show mist rather than silhouettes; silhouettes are for unmet Rivals in unlocked districts. | Nemesis |
| K9 | Nemesis can provide display-ready Memory entries (day, phase, place, event type, other cat) and Narrative provides the wording templates at 60 characters or fewer. | Nemesis, Narrative |
| K10 | Traits have a known/unknown flag and a "when found" day. A Rival's stats, Moves and Knacks become viewable once seen in a fight. | Nemesis, Combat |
| K11 | Each yowl-sting can be given a deterministic visual contour. | Audio |
| K12 | A single pinned Rival can be highlighted in Whisker Sense. | Nemesis, Territory |
| K13 | All four Verdicts are normally offered; any restriction (e.g. Bosses) comes with a reason string. Multiple Rivals Routed in one fight each get a Verdict, in Rout order. | Nemesis |
| K14 | The Recruit offering is paid from carried Morsels at the moment of the Verdict. (If it can be paid from the Stash, the card text changes.) | Economy, Crew |
| K15 | If Crew is full, Recruit is unavailable at the Verdict; there is no inline "release a cat" flow. | Crew |
| K16 | Lessons are paid from the Stash; the teacher keeps the Move; a replaced Move is forgotten (schema has `moves[4]` only) and can be re-taught only if another Crew cat knows it. | Crew, Economy |
| K17 | Loyalty can be shown as a five-step mood with trend and top reasons. | Crew |
| K18 | A Stray encounter guarantees a first Crew cat in Life 1 if the player never chooses Recruit. An older cat is available as an early teaching voice. | Crew, Narrative |
| K19 | In Life 1, a solo Pile-On exists (Mikan alone in the dust cloud) so the signature image is taught early. | Combat |
| K20 | The first crow encounter happens outside the wall of Haru's House (canon: no combat inside the wall). | Level, Narrative |
| K21 | Requests to Combat for assist options (combat speed, Auto-Scrap, Crew initiative, wide windows, hold-to-combo, extended first Frazzle window) are proposals, not commitments. | Combat |
| K22 | Saving is only by Sunspot nap and sleeping at home. | Technical-director, creative-director |
| K23 | Life numbers are player-facing; Life names are not, pending Narrative. | Narrative |
| K24 | Clowder emblems and patterns in §9.1 are proposals for art-director; the canon colours are unchanged. | Art |
| K25 | Rival, Crew, Move, Knack, Strength, Title and Patch names in wireframes are illustrative and carry no canon weight. | All |

---

## 14. Open Questions / Known Weak Spots

Items marked **WEAK** are where this draft is most likely wrong or thinnest.

| # | Question or weak spot | Owner | Deadline | Resolution |
|---|---|---|---|---|
| 1 | **WEAK — designed blind to four GDDs.** Every screen here binds to data shapes that Nemesis, Territory, Crew and Combat have not confirmed (§10, §13). Expect rework after `/review-all-gdds`. | All system designers, ux-designer | Cross-GDD review | Pending |
| 2 | **WEAK — one file for six screens.** The template's per-screen tables (component inventory, full interaction maps, contrast tables, screen-reader announcements, focus orders) are abbreviated or absent. This must be split and completed before `/ux-review` or `/team-ui`. | ux-designer | Next pass | Pending |
| 3 | **WEAK — the Morning Sniff has only a stub**, yet it is the daily entry point to two of these screens and is UX-owned by the brief. | ux-designer | Next pass | Pending |
| 4 | **Does the Fence Line scale?** Eight seats per district reads well. Forty-eight on the whole-town strip at 720p is unproven, and late-game walls full of chevrons, spikes, tags and pips may become noise. | ux-designer | Vertical slice (1 district), Alpha (6) | Pending |
| 5 | **Where is Mikan on the Fence Line?** The wall shows Rivals; Mikan's standing is only a Clout line in the header. A seat for Mikan among them might land the fantasy better but mixes two scales (Rival rank and Clout). | creative-director, nemesis designer | GDD review | Pending |
| 6 | **Should the Rival card show how many traits remain unknown?** Showing "?" slots leaks the count; hiding them makes discovery feel bottomless. | nemesis designer | GDD review | Pending |
| 7 | **WEAK — Verdict consequence copy.** The cards promise outcomes ("comes back tougher", "Grudge simmers") without knowing Nemesis's actual rules or probabilities. Vague copy protects against that but may leave players feeling the choice is uninformed; precise copy may over-promise. | nemesis designer, writer | GDD review | Pending |
| 8 | **Recruit with a full Crew is a dead end** in this draft (K15). The moment a player most wants a Nemesis is exactly when the cap bites. Options: allow a swap inline (breaks the Lot rule and adds a Chase-Off-your-own-cat decision mid-triumph); warn on the Standoff card that Crew is full; or let the Rival "wait at the Lot" for a day. | crew designer, nemesis designer, creative-director | GDD review | Pending |
| 9 | **The Posse loophole.** Canon lets the Posse change anywhere; pulling a Sentry into the Posse from across town therefore moves a guard remotely, which the Lot rule is meant to prevent. Either restrict remote swaps to idle and Posse cats, or accept it. | creative-director, territory designer | GDD review | Pending |
| 10 | **WEAK — the Turf screen is the closest thing here to a spreadsheet.** Thirty nodes, rings, pips and a numbers panel sit uneasily beside Pillar 1 and the "hierarchy is a wall" rule. A more diegetic version (an actual view over painted rooftops with scent rising from each Patch) would be truer and far more expensive. Needs art-director and a cost call. | art-director, producer, ux-designer | Art bible | Pending |
| 11 | **Raid comparison without odds.** Showing guard Power beside likely raiders' Power invites players to compute odds anyway; if raid math includes hidden factors, the display will feel dishonest. Territory must say what is safe to show. | territory designer | GDD review | Pending |
| 12 | **Forgetting Moves for good** may simply be the wrong rule for a game about attachment to individuals. If Crew adds a per-cat "known" list, the Lesson confirm step gets simpler and the hold-to-confirm goes away. | crew designer | GDD review | Pending |
| 13 | **Lesson flow starts student-first** by recommendation; teacher-first and catalogue-first were rejected on reasoning, not evidence. | ux-designer, user | User review | Pending |
| 14 | **Loyalty transparency versus surprise.** The UI makes a coming betrayal readable (restless mood, reasons). That honours fairness but may defuse the drama the brief wants from betrayal. How much warning is right? | nemesis designer, crew designer, creative-director | GDD review | Pending |
| 15 | **No save-and-quit.** With saves only at naps and bedtime, an interruption can cost up to a phase. This is a real accessibility and handheld-play problem; an invisible suspend-on-quit would fix it without touching the fiction. | technical-director, creative-director | Architecture | Pending |
| 16 | **Are Life names player-facing?** "Two Pairs of Shoes" and "White Day" describe the human story, which the pillars say is never told in words. A chapter card could be read as system UI or as a violation. | narrative director, creative-director | Narrative review | Pending |
| 17 | **Deaf and hard-of-hearing access to the home story is unproven.** Murmur Ribbons and Music Motes are untested inventions, add authored work to every vignette, and may themselves strain Pillar 1. Without them, the commitment that "music carries the story" excludes players. This needs a ruling and consultation with deaf and hard-of-hearing players, not just a designer's guess. | creative-director, accessibility-specialist, narrative, audio | Before vertical slice | Pending |
| 18 | **Colour-blind plus deaf players lose both identity channels for the humans** (signature colour and instrument). A third, shape-based signature per human is requested from Narrative and Art. | narrative director, art-director | Art bible | Pending |
| 19 | **Seven patterned Clowder fills may be ugly or noisy** against a flat-colour cel look, and particle shapes may be illegible at bird's-eye distance on a handheld. The fallback is emblem-only plus Two-Tone mode. | art-director, technical-artist | Art bible | Pending |
| 20 | **One-handed presets are paper designs.** They have not been tried on hardware, and "Right hand" depends on moving with the right stick in a game tuned for the left. | ux-designer, accessibility-specialist | Prototype | Pending |
| 21 | **Assist options change the fantasy.** Crew initiative and Auto-Scrap remove, respectively, the conducting and the brawling. They are offered as opt-in assists, but Combat may object, and their interaction with Feral difficulty is undefined. | combat designer | GDD review | Pending |
| 22 | **First-hour timings are estimates** built on the concept's minute marks and an assumed Life 1 length. If Life 1 is shorter, the Lot, ally commands and the Fence Line slip into Life 2 and the "Posse grows one cat at a time across Lives 1–2" pacing must be re-cut. | narrative director, crew designer, ux-designer | Vertical slice plan | Pending |
| 23 | **The first Rival fight can be lost at minute 17.** Canon makes loss content, but a brand-new player losing 20% of carried Morsels and the day, before understanding either, may read it as punishment. Consider a waived penalty on the first loss. | economy designer, nemesis designer | GDD review | Pending |
| 24 | **A tutorial voice needs a cat.** The "older cat on the wall" is a UX convenience that creates a character Narrative has not asked for; it could be Daifuku himself, which would be better and is not UX's call. | narrative director | Narrative review | Pending |
| 25 | **Content note for bereavement**: offer one, and how, without spoiling the game's centre? | creative-director, narrative director | Before vertical slice | Pending |
| 26 | **Menu narration and screen-reader support** are stated as a goal with no feasibility check; engine is undecided. | technical-director, ui-programmer, accessibility-specialist | After `/setup-engine` | Pending |
| 27 | **Heir selection (Life 9)** and the "bring food home" interaction (Life 8) need UX and are not covered here. | ux-designer, narrative director | Alpha | Pending |
| 28 | **Pause at home.** Letting the player open the Fence Line and Turf from inside the house is convenient and arguably undercuts the home veto in `hud.md`. Restricting the pause menu at home to Mikan and Options would be purer. | creative-director | User review | Pending |
| 29 | **Procedural text and localisation.** Titles and Memory lines built from templates are a known source of broken grammar in gendered and case-marked languages; no localisation lead has reviewed the 60-character budget. | localization-lead, writer | Before content lock | Pending |
| 30 | **No user decisions were taken in this pass.** Recommendations (Verdict compass, student-first Lessons, contextual clock, flat Slow Blink menu, read-only-away-from-the-Lot) are the designer's and all await the user. | user | Review | Pending |

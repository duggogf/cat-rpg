# UX Spec: Key Screens — Cat RPG (vertical slice, round 2)

*Owner: ux-designer · Date: 2026-11-23, revised 2026-11-24 (owner feedback pass; consistency pass by the creative director; Rivals board declutter, `design/ux/rivals-board-cleanup.md`) · Status: round-2 slice rewrite, revised to the owner's comments C1–C5 (the first draft is archived at `design/backlog/first-drafts/key-screens.md`)*
*Canon order: owner comments `design/reviews/user-comments-2026-11-24.md` → `design/reviews/owner-feedback-rulings.md` (OR-xx, binding), as settled by `design/reviews/owner-feedback/consistency-pass.md` (F1–F12) → `design/creative-brief.md` v1.6 → round-1 DR-xx and round-2 R1–R5. Patent guardrails: `design/legal/nemesis-patent-analysis.md` v2 §5 (binding). Companions: `design/ux/hud.md` (HUD, control map), `design/accessibility-requirements.md`.*

**Scope.** The slice screens: the **Rivals board** (§2, replaces the Fence Line), the **Rival card** (§3), the **Verdict** and the **loss-to-night walk home** (§4), the **unified Turf Board** (§5), the **Crew roster, Posse and Lessons** (§6) and the **first-15-minutes and first-hour onboarding plan** (§7). Every number, threshold and rule shown is read from its owning GDD; this doc decides only what is shown, where, and how the player moves through it.

**Platform.** Desktop (PC) only: gamepad first, full keyboard and mouse. There is no touch or phone layout (the owner dropped phone support). The handheld-console check stays in Backlog.

---

## 1. Shared foundations

### 1.1 Six rules every screen obeys

1. **One Cat Card.** Every cat, Rival or Crew, is shown by one card component with context variants. A recruited Rival keeps its Memory, Scars, Title, Fears and personality on the same card.
2. **Personality is shown, not listed.** The personality is the cat's *pose and idle animation* first, an icon second, a one-line description third. It is the largest thing on every cat card.
3. **Unavailable actions stay in place, focusable, halftoned, and say why** (one line, cat-voiced where a cat refuses, system text where a rule blocks). Positions never move.
4. **Numbers policy (R3).** Grudge, Regard and Scent are **never numbers outside the Turf Board**. Loyalty is shown as its **tier word** (Shifty / Aloof / Steady / True / Sworn) and the gate it opens, never a numeral. **Boss anger is 0–3 steam puffs and a stage word, never a number** (OR-07). **District influence shows its % only in the Turf Board header** (OR-08); the street shows wisps only. The Turf Board is the only screen with territory numbers. Currency counts (Morsels, Shinies) appear where they are spent; levels appear on Crew cards.
5. **Language veto.** No screen renders human speech or writing. Cat speech is readable text (≤ 60 characters per balloon). System UI is normal localised text.
6. **Own-history rule (patent, v2 G1/G8; OR-02, OR-19).** No screen states or implies that a cat changed **because of what Mikan did to a different cat**. Captions, tags, lines, stamps and replays describe what a cat is and what it remembers of *its own* dealings with Mikan. Changes may be shown on the cat Mikan dealt with, on territory and objects, on the calendar ("a newcomer arrived"), and on newly generated cats. A caption never gives a cause in terms of another cat ("took the Thorn's old post", "angry because you recruited Hige" are both forbidden). Every new string on §2–§5 passes this audit (§2.11).

### 1.2 Screen map (slice)

```
 STREET ──View/J, or Pause ▸ Rivals──> RIVALS BOARD ──South──> RIVAL CARD
   │      (read-only: street, Doorstep, Lot, walk home; never inside the wall)
   │                                     ^ North on a Sniff card / the Rivals chip
   │ fight won                           │
   v                                     │
 VERDICT ─Recruit─> Bribe row ──> (make room) ──> Crew
   │ every Verdict ──> Claim Spray prompt at the post ("fight to clear, spray to claim")
   │
   │ fight lost ──> GLOAT ──> NIGHTFALL ──> WALK HOME (closed street) ──> ROUTED EVENING
   │
 DOORSTEP (Morning Sniff, hud.md §5.3) ──> THE LOT
                                             │
            ┌────────────────┬───────────────┼────────────────┐
            v                v               v                v
       CREW & POSSE     TURF BOARD       LESSONS        SHARE A MORSEL
       (roster, card)   (one decision)   (teach)        (once a day)
```

### 1.3 The Lot hub

Arriving at the Lot (budget ≤ 1 min, DR-16) does not make the player walk between stations. The Crew lounge in a diorama of the vacant lot (the kei truck, crates, the fence), each cat idling in its personality set. The hub's tabs are **Crew & Posse · Turf Board · Lessons · Share a Morsel**; on the Turf Board they sit in its one-line header (§5.3), on the other tabs in the same position. L1/R1 or Q/E switch tabs. The tab with something new carries a pom ("!" = a Lesson available; a moon pom on the Turf Board when a raid or challenge is forecast tonight). The clock is paused at the Lot.

### 1.4 Navigation model (desktop: gamepad, keyboard, mouse)

One mapping for every menu screen in this doc. Glyphs on screen always read from the player's current binding.

| Menu action | Gamepad | Keyboard | Mouse |
|---|---|---|---|
| Move focus | Left stick / D-pad (spatial) | Arrows / WASD | Hover (focuses after 120 ms) |
| Confirm / pick up / open | South | Enter / Space | LMB |
| Back / cancel / close | East | Esc / Backspace | RMB |
| Cat card / context info | North | F | Click the card's "card" pom, or LMB on a focused cat that has no other action |
| Secondary (unpost, "Last night") | West | R | Its on-screen pom |
| Prev / next tab or section | L1 / R1 | Q / E | Click the tab / section sign; wheel moves between sections |
| Legend (hold) | View (hold) | Tab (hold) | The "?" pom (toggle) |
| Hold-to-commit (Verdict) | Hold South 600 ms | Hold Enter / Space 600 ms | Hold LMB 600 ms on the raised card |

Every hold has a press-then-confirm alternative (accessibility doc §4). Mouse hover never commits anything; it only focuses and previews.

### 1.5 Shared components (one kit, used the same way on every screen)

The owner's note on the old Turf Board ("the UI are all over the place") applies to every screen here. Each screen is assembled from these and nothing else (`design/previews/kit/README.md`):

| Component | Kit part | Used for | Never used for |
|---|---|---|---|
| **Bean panel** | `.k-panel` | One panel per job: the Rival card, Verdict cards, the Tonight panel, the name-card | Decoration, floating labels |
| **Cat chip** | `ui.portrait` (chestnut) + `.k-ribbon` name tag in the Clowder colour + personality icon | Every small cat: Crew strip, Tonight panel, Sniff cards, tags' owner, ally plate | — |
| **Paper tag** | `.k-pill --cream`, icon + one word | Relationship tags on the Rivals board; assignment chips | Numbers |
| **Badge** | One pom-backed icon in the top-right of whatever it marks | Tonight (moon), Challenge (stake flag), Fading (cracked wisp), Home (house), Window (crown), New (tape star) | More than one per object |
| **Bar** | `.k-gauge` | Influence (Turf Board header), Repelled/Scuffed/Lost odds (Tonight panel) | Feelings (Grudge, Regard, Loyalty, anger) |
| **Buttons** | `.k-btn`: one **primary** (Cocoa) or **confirm** (Collar Crimson) per screen, plus pom secondaries | "Post Hige", "Hold to decide" | Two primaries on one screen |
| **Control footer** | `.k-prompt` row, bottom-left, binding glyph + verb | Every menu | — |

**Reading order** on every management screen is the same Z: **header (how am I doing) → the lit object (where) → the one panel (what) → the strip (who) → the one button**. Focus is pre-placed on the step the player most likely needs.

---

## 2. The Rivals board (showpiece; replaces the Fence Line; staged scenes per owner C6)

### 2.1 Purpose and access

**Every unique cat in Yunagi, one gang at a time, each gang staged as a scene** (OR-03, owner C1 and C6). The owner asked for a roster of every unique cat (C1), and then for it to be shown "similarly to this instead of a line from left to right. This shows more dynamic" (C6, `design/reviews/refs/rivals-board-layout-ref.webp`). So each gang is shown **in its own place, in deep perspective**: its Boss on a raised perch at the far end, its cats down the steps and the path toward the camera, each with a name ribbon, and faint dashed arrows showing who they answer to. Cats you have not met are **silhouettes** in the shade. At rest each cat carries only its name; pointing at one cat dims the rest, tags at most 3 rare ties and slides up its card (§2.7, §2.8). It must read as *a gang with a pecking order and a place of its own, who know each other and know you*, at a glance.

The UI name is **"Rivals"**. "Nemesis" is never shown (G12); the arc lead's face is *Sworn Enemy* or *Sworn Rival*.

**Access (OR-03, plus the pause menu):**
- **View / J** anywhere on the street, at the Lot and on the walk home after a loss (read-only).
- **Pause ▸ Rivals** tab on the street and at the Lot (pause tabs there: **Mikan · Rivals · Options**).
- **North on a Sniff card** at the Doorstep (opens on that card's scene, focused on that cat).
- **The Rivals chip** after a key event (§2.9).
- **Never inside Haru's wall** (the home pause is Mikan · Options only; View is inert at home).
- **Unlocks on Life 2 day 1.** In Life 1 the binding and the pause tab show a closed-gate pictogram.
- The clock is paused while it is open. It is **read-only**: nothing on it changes the game.

### 2.2 The town roster as scenes (how C1's "every unique cat" fits C6's staging)

**One scene per gang, plus Outsiders and your own Crew: six scenes, cycled with L1/R1 (Q/E, or a click on the scene strip).** The **scene strip** in the header is the whole-town roster at a glance: L1 glyph · **six emblem poms** (48 px; Wall Sitters' corner stone, Awning Gang's lantern, Salt Paws' anchor, Steam Court's lighthouse, Outsiders' bus-stop sign, the Bell) · R1 glyph. **Only the active tab is named** (a Cocoa pill with its name beside the emblem); inactive tabs are emblems only, and hovering or focusing one shows its name in a small tooltip. Under each emblem sits **one row of 8 px dots**, one per cat in that scene, **filled when met, hollow when not** (up to 10, then "+"). A silhouette scene has a **hazed emblem** and hollow dots, so "which gangs have I not met" still reads from the strip in one glance. No counts or numbers.

| # | Scene (tab) | Staged in | Perch (far end) | Down the steps and path | In the slice |
|---|---|---|---|---|---|
| 1 | **Hidamari Lane** (Wall Sitters) | The narrow alley up to the Den corner stone, laundry poles, garden walls, Dusk light | **Daifuku** on the raised porch over the corner stone | Captains on the stone steps; Toughs on the path; Roamers up on a wall or wire at the side | Fully populated and discoverable (≤ 10 tracked). **The default scene** |
| 2 | **Akane Arcade** (Awning Gang) | The covered arcade rising to the shrine steps and torii | Madam Sabi on the shrine step landing (crown outline) | Oboro and the gang as silhouettes | **Silhouette scene**: painted in haze, authored silhouettes only, not discoverable in the slice |
| 3 | **Shiosai** (Salt Paws) | The harbour stone stairs, nets, tetrapods | Ikari on the net-shed roof (crown outline) | Silhouettes | Silhouette scene |
| 4 | **The Lighthouse Summit** (Steam Court) | The lighthouse stair from below | Botan on the lantern rail (crown outline) | Silhouettes (Narrative authors any) | Silhouette scene |
| 5 | **Outsiders** | The bus stop at the edge of town, a torn timetable poster (Scribble), the coast road | **No perch** (nobody answers to anyone) | Challengers, newcomers and turncoats, each beside a small stamp of the Patch it stakes or keeps | Populated as they arrive (challenger on L2D4) |
| 6 | **The Bell** (your Crew) | The Lot: the kei truck, crates, the back fence | **Mikan** on the kei truck roof | Crew on the truck bed and crates (Posse nearest the camera), Sentries by the fence gate | Always discovered |

**Locked scenes in Life 2:** tabs 2–4 are visible and openable, painted in haze with an unlit perch, so the climb ahead is part of the roster; each shows one centred caption, "Further up the hill." The scene strip's order is the town climbing: Lane → Arcade → Shiosai → Summit, then Outsiders, then the Bell.

**Opening scene:** the scene of the cat it was opened for; otherwise the district Mikan is in (the Lane in the slice).

**Cross-scene ties:** a tie to a discovered cat in **another** scene shows, **during focus only**, as **one mini chip** (the cat's chip + the tag word) under that scene's tab in the strip (max one per tab; "+1" if there are more); the full Rival card lists every tie (§3.2). West / R ("Go to") or a click on the chip jumps to that scene focused on that cat. Example: focusing Hige in the Bell scene hangs one **Old Boss** chip with Daifuku's portrait under the Hidamari Lane tab.

### 2.3 How a scene is staged

**Depth = fixed role, never earned.** The Boss is on the perch at the vanishing point; **Captains** stand on the steps just below it; **Toughs** stand on the path toward the camera. **Roles are fixed at generation and never change** (OR-19): no seats, no promotions, no demotions, so a cat's place in its scene never moves because of anything Mikan does to any cat. **Within a tier, cats stand in order of discovery** (the first met nearest the centre line). When a cat leaves (Recruit, Gone, a Boss's truce), its spot keeps a mark (§2.5) and **nobody steps up into it**.

**Undiscovered cats wait in the shade.** An unmet cat is a flat Ink silhouette standing **in the shadow along the alley walls**, not on its role spot, so its position gives nothing away (OR-03: no name, tags, pose or traits). A Boss silhouette sits on its perch with a crown outline. On discovery the cat **steps out of the shade onto its spot** (the pin beat, §2.9).

**Dashed arrows = who answers to whom.** One dashed cream arrow (Ink-edged) runs from each discovered gang member **up the path to its Boss's perch**: the Gang/Boss relation of OR-04 and nothing more. There is **no Tough-to-Captain chain**: no such relation exists in the rules, and drawing one would invent a hierarchy that G11 tells us to keep flat. **At rest the arrows are faint:** cream dashes with an Ink edge, **2 px at 35% opacity**; cats left of the centre line merge into **one left trunk** up the steps, cats right of it into **one right trunk**, and no arrow crosses the centre line or runs behind a ribbon, so the picture stays a few quiet lines, not a web. **On focus** the focused cat's arrow (and its trunk to the perch) goes to **4 px at full opacity**; focusing a Boss brings every member's arrow to full. Outsiders have no arrows. In the Bell scene, Crew arrows run to Mikan. Roamers have an arrow only if they belong to that gang.

**Arrows to an empty perch:** if the Boss is Gone, in the Crew or in truce, the arrows still point to the perch (membership is a fixed fact), drawn dotted, and the perch shows his mark (§2.5). No gang cat is ever drawn on it (G6).

**The arc lead** (Togemaru) carries his storm mark aimed **out of the picture at the camera**, i.e. at the player, wherever his scene is.

### 2.4 Role tags (one short label per cat, on its card, fixed for life)

The focused cat's card carries its **role tag** (§2.8; never hung on the cat in the scene, where depth already shows rank): a short word that says the cat's own job in its gang, plus a **Style icon** for the combat hint. The word comes from the cat's **personality** (how it fights, brief §3.5); the icon from its **Style**; the prefix from its **fixed role**. All three are set at generation and never change, so **the tag can never change because of what Mikan did to another cat**.

| Personality | Tag word | Why (its own "fights like" and "on guard") |
|---|---|---|
| Braggart | **Brawler** | Charges the biggest enemy |
| Brooder | **Enforcer** | Hangs back, avenges its allies, never leaves |
| Schemer | **Sneak** | Flanks; hunts the Ruffled and Frazzled; ambushes |
| Fraidy | **Lookout** | Keeps its distance; raises the alarm early |
| Stalwart | **Shield** | Guards the others; braces |
| Goofball | **Prankster** | Plays; goes for props |

| Role (fixed) | Tag format | Example |
|---|---|---|
| Boss | "Boss of *district*" + crown (Style icon on the card only) | "Boss of Hidamari Lane" |
| Captain | "Captain · *word*" + Style icon | "Captain · Sneak (Yowler arc)" |
| Tough | "*word*" + Style icon | "Brawler (Scrapper claw)" |
| Great Boss | "Great Boss" | Botan (full game) |
| Outsider | Its situation: **Challenger** / **Newcomer** / **Turncoat** / **Roamer**, + the Patch stamp it stakes or keeps | "Challenger · Laundry Pole Yard" |
| Crew (Bell scene) | The same personality word + Style icon; its assignment (Posse, a post, Lounging) is on its card, not the tag | "Shield (Bruiser fist)" for Hige |
| Mikan | The Clout word | "Known Face" |

Style icons: Bruiser fist · Scrapper claw · Prowler fang · Yowler sound arc · Trickster tumbling die. An Outsider's situation word changes only by that cat's own story (a challenger that takes a post becomes "Keeper"; one that leaves becomes a legend), never because of another cat.

Words are a vocabulary for Narrative to polish; "Sentry", "Warden" and "Keeper" are reserved for the posting system and are **not** role tags.

### 2.5 Cats and marks

Every discovered cat stands in **one disposition pose** (Nemesis owns the mapping) with its name ribbon and these marks. Each mark has a shape twin, never colour alone.

**At rest, ≤ 1 drawn mark per cat**, in priority: storm mark (arc lead) > steam puffs (Boss) > truce sprig > grumble cloud > head plaster; every mark the cat carries is listed on its card (§2.8). The **tape star** is a corner sticker on the cat's ribbon, not a separate mark. Marks sit **on or touching their own cat** (the storm mark attached to Togemaru's head, aimed at the camera). **Silhouettes** are flat Ink at 70% in the wall shade with **no "?" and no ribbon** (a Boss silhouette keeps its crown outline); on focus a "?" pom pops over it and the card reads "Not met yet."

| Mark | Meaning | Who can carry it |
|---|---|---|
| Disposition pose (glare · side-eye · yawn · upright nod · nose to the sky) | How it feels about Mikan (Grudge and Regard as a pose) | Any discovered non-Crew cat |
| **Storm mark** aimed at the camera | The arc lead / *Sworn Enemy* or *Sworn Rival* | Togemaru only, in Lives 1–2 |
| Grumble cloud | Bitter (Grudge ≥ 75, not the lead) | Any |
| **Truce sprig** | Nose-Touched: in truce, or a Friend (sprig in flower) | Any |
| **Steam puffs** (0–3) over the perch | Boss anger stage (§2.7) | District Bosses only |
| Title, silhouette Scars | Its history worn on the model | Any |
| **Tape star** | New since last night (discovered, arrived, changed state) | Any; cleared on next open |
| Head plaster (2 days) | Lost a feud scuffle (a town event) | Any |
| **Bell-cord knot** on its empty spot | It joined your Crew (it now stands in the Bell scene) | Its old spot |
| Faded legend card + paw prints off the frame edge | **Gone** for good (Chased Off) | Its old spot |
| Turned away + two-pip morning mark | Wavering (Crew only) | Bell scene |

**Roaming Boss** (window open, OR-09): the perch is **empty** (cushion still dented, crown notch), Daifuku is drawn **halfway down the steps, walking out of the scene** with a short line of crown paw-marks, and his card says where he is now. The empty perch is the picture of the owner's "the boss will now start to roam the streets". A Boss who is Recruited, Chased Off or Nose-Touched leaves the perch empty with his knot, legend card or sprig; no gang cat ever takes it (G6).

### 2.6 Layout and wireframes (1080p, Hidamari Lane scene, Life 2 day 3, Dusk)

**A quiet painting at rest, one cat's story on focus** (owner declutter, 2026-11-24, `design/ux/rivals-board-cleanup.md`). At rest the player sees the place, the pecking order (by depth) and who is who (names); everything else answers a question the player asks by pointing at a cat. Territory lives on the Turf Board (§5). Four regions, the same Z reading order as every screen (§1.5): **header → scene → card (on focus) → buttons**.

| Layer | Shown | Never shown here |
|---|---|---|
| **Rest** (nothing focused; the default on open) | Header (place name, compact scene strip); the scene; **one name ribbon per discovered cat** (Boss: name only, the crown is on the perch); silhouettes in the shade (no "?"); faint arrows; **≤ 1 drawn mark per cat** (§2.5); steam puffs over the perch; ≤ 2 contextual buttons | Role tags, relationship tags, the card, facts, the influence bar, inactive tab names |
| **Focus** (hover with the mouse after 120 ms; at once with the pad or keys) | The focused cat lifts 4 px with a Bell-Gold rim; its arrow brightens. **≤ 3 relationship tags** on related cats, one each; unrelated cats dim (§2.7). **The card** slides up bottom-left (§2.8). A cross-scene tie shows as **one chip** under its tab (§2.2). Buttons switch to Card · Go to (if any) · Back | The same facts in two places |
| **Secondary** (South: the full Rival card, §3) | Full Ties list (a Boss's whole gang), history strip, Strengths, Fears, Old Score, both anger lines, the Objective, Tonight, Challenger pips | — |
| **Moved to the Turf Board** (§5) | Influence bar, Your posts, Tonight (raid or challenge) panel, Sentries, Posse | — |

**Label budget:** at rest each cat has **one** label (its name ribbon). On focus the focused cat keeps its one ribbon (its details are on the card), and each related cat gets **one** tag clipped to its ribbon. No cat ever shows more than two text items. **≤ 16 text items on screen at rest.**

**Layout grid and safe zones** (1920×1080; scales with UI Scale):

```
 x:0        360          700                      1220        1560      1920
 y:0   +-------------------------------------------------------------+
       | HEADER bean (24 px margin, 72 px tall)                       |
  96   +-------------------------------------------------------------+
       |  WALL    |           PERCH ZONE  (x 760-1160, y 120-420)     |  WALL   |
       |  shade:  |           Boss + puffs + crown                    |  shade: |
       | silhou-  |  STEPS ZONE (x 560-1360, y 420-640): Captains     | silhou- |
       |  ettes,  |  PATH ZONE  (x 480-1440, y 640-900): Toughs       |  ettes, |
       | scenery  |                                                   | Roamers |
  780  |  ........+..........+                                       |  on wall|
       | CARD ZONE           |                       +-----------------------+
       | x 24-700, y 800-1056|                       | BUTTON BAR x 1360-1896 |
 1080  +---------------------+-----------------------+-----------------------+
```

| Region | Rule |
|---|---|
| **Header** | One bean, 72 px tall: **place name** (44 px, left) and the **scene strip** (right, §2.2). Nothing else: no influence bar, no crown, no % (all on the Turf Board, OR-08) |
| **Scene** | Full bleed behind everything. **Discovered cats stand only in the perch, steps and path zones** (the centre wedge, x 480–1440). The side walls (x < 360, x > 1560) are kept for scenery, shade silhouettes and wall-top Roamers: that is the negative space. ≤ 10 discovered cats plus silhouettes, every focusable cat ≥ 64 px tall |
| **Card zone** | Bottom-left 676 × 256 px. **Empty at rest** (painted foreground: stones, a plant); the card slides up only on focus (§2.8). The scene is authored so no cat's spot, feet or ribbon falls inside it |
| **Button bar** | Bottom-right, one row of ≤ 3 pom buttons with binding glyphs, right-aligned (§2.9). No cat feet or ribbons below y 960 in x > 1360 |
| **Ribbon placement** | Each ribbon sits centred **under its own cat's feet**, ≤ 16 px below the paws, never on another cat's body; ≥ 48 px clear between any two ribbons. If two spots would collide, the spot moves (art staging), not the ribbon |

**Rest state** (opened from the street; nothing focused; Lane scene, Life 2 day 3, Dusk)

```
+--------------------------------------------------------------------------------------------+
|  HIDAMARI LANE                              L1 [(stone) Lane] (lan) (anc) (lht) (bus) (bel) R1 |
|                                                ●●●●●●○○    ○○○   ○○○   ○○    ·     ●●●●●     |
+--------------------------------------------------------------------------------------------+
|  ░░ wall ░░                         ( ) ( )   <- 2 steam puffs                   ░░ wall ░░ |
|  ░░       ░░                    .--------------.                                 ░░       ░░ |
|  ░ [sil] ░░                     |  (Daifuku)   |  porch perch, crown                ░░ [sil] ░ |
|  ░░ shade ░░                    '--------------'                                 ░░ shade ░░ |
|  ░░       ░░                        [DAIFUKU]                                   ░░       ░░ |
|  ░░       ░░                      :          :    <- faint trunks (35%)          ░░       ░░ |
|  ░░       ░░             (Kagi)   :          :   (Ohagi)                         ░░       ░░ |
|  ░░       ░░             [KAGI]   :          :   [OHAGI]                         ░░       ░░ |
|  ░░       ░░        (Goma)        :          :        (Togemaru)~~storm~~>       ░░       ░░ |
|  ░░       ░░        [GOMA]        :          :        [TOGEMARU]                 ░░       ░░ |
|                                                                                              |
|                         (Sasa)                         (Kuri)                                |
|   (stones, plant:       [SASA*]                        [KURI]                                |
|    empty card zone)                                                                          |
|                                                                 (N) Last night   (E) Back    |
+--------------------------------------------------------------------------------------------+
  Text at rest: 1 place name + 1 tab name + 7 names + 2 buttons = 11. * = tape star sticker.
  ● met  ○ silhouette  · empty (no outsider yet)   arrows: each member -> its Boss only
```

**Focus state** (Togemaru focused with the pad; his tie: Rival → Goma)

```
+--------------------------------------------------------------------------------------------+
|  HIDAMARI LANE                              L1 [(stone) Lane] (lan) (anc) (lht) (bus) (bel) R1 |
|                                                ●●●●●●○○    ○○○   ○○○   ○○    ·     ●●●●●     |
+--------------------------------------------------------------------------------------------+
|  ░░ wall ░░                         ( ) ( )                                      ░░ wall ░░ |
|  ░ (sil) ░░  dim                .--------------.   full colour (his Boss)        ░░ (sil) ░ |
|  ░░       ░░                    |  (Daifuku)   |                                 ░░  dim  ░░ |
|  ░░       ░░                    '------^-------'                                 ░░       ░░ |
|  ░░       ░░                        [DAIFUKU]   \  <- bright 4 px arrow          ░░       ░░ |
|  ░░       ░░             (kagi)  dim             \   (ohagi) dim                 ░░       ░░ |
|  ░░       ░░             [kagi]                   \  [ohagi]                     ░░       ░░ |
|  ░░       ░░        (Goma) full                    \                             ░░       ░░ |
|  ░░       ░░        [GOMA][x Rival]            ==(TOGEMARU)== lifted, gold rim ~~storm~~>   |
|                                                   [TOGEMARU]                                 |
|  +--------------------------------------------+                                              |
|  | (portrait) [TOGEMARU · the First Thorn]    |   (sasa) dim          (kuri) dim             |
|  | Brawler (claw)   Braggart (icon)           |   [sasa*]             [kuri]                 |
|  | hackles: storm  ears: back  ~ SWORN ENEMY  |                                              |
|  | D3 "My post smells of bell."               |                                              |
|  | (moon) Tonight: raids Persimmon Alley.     |          (S) Card              (E) Back      |
|  +--------------------------------------------+                                              |
+--------------------------------------------------------------------------------------------+
  Text on focus: 11 at rest - Last night + 1 tag + 6 card lines + Card = 18. One tag in the scene.
```

**Where the facts went** (the left fact column is removed; owner declutter 2026-11-24, D1). No fact on this screen ever shows a number or says a cat changed because of another cat (R3, §1.1 rule 6).

| Old fact | Now |
|---|---|
| **Tonight** (raid or challenge) | The Turf Board's Tonight panel (§5); the raider's card context line ("Tonight: raids Persimmon Alley.", §2.8) and its full Rival card (§3.2) |
| **Your posts** | The Turf Board (§5) |
| **The Boss** (anger stage, roaming, Gone / in your Crew / in truce) | The steam puffs over the perch (or his empty perch and mark, §2.5) + the Boss's card (§2.8) |
| **Objective** | The Boss's full Rival card (§3.2) |
| Outsiders scene (Staking, Repelled pips) | Each Outsider's card context line (§2.8) and its full Rival card (§3.2) |
| Bell scene (Posse, On guard, Wavering) | Those cats' cards (§6.2); Posse and Sentries also on the Turf Board (§5); Wavering also as the turned-away pose (§2.5) |
| Silhouette scenes | One centred caption, "Further up the hill." |

### 2.7 Relationship tags (hover or focus)

The owner's rule (C1, OR-04): **hover one discovered cat (mouse) or focus it (pad / keys), and the other discovered cats it relates to are shown**, worded from the hovered cat's point of view. After the declutter pass (2026-11-24) the common ties (Gang / Boss) are shown by the **arrows**, and only the rare ties get a **paper tag**. If either cat is undiscovered, nothing shows. Tags are words with an icon, never numbers. They are a **different object from the role tag** (which is on the card only): a paper tag clipped to the cat's ribbon, in cream with an Ink border, that appears only while hovering.

| Hovered cat | Shown on the other cat | Icon |
|---|---|---|
| A gang member | Its arrow to its Boss brightens; the Boss stays full colour (**no tag**) | — |
| A Boss | Every member's arrow brightens (**no tag**) | — |
| Either of a Rival pair | **Rival** | Crossed claws |
| Either of a Kin pair | **Kin** | Two touching ears |
| A Crew cat with `OLD_GANG` in its own Memory | **Old Boss** on that Boss | Crown with a nick |
| That Boss | **Old Gang** on that Crew cat (read from the recruit's own data) | Paw row with a bell |

**How it looks:**
1. **Dim, don't label.** On hover/focus (after 120 ms with the mouse, at once with pad/keys), every **unrelated** discovered cat, silhouette and arrow drops to **45% toward the Wisteria shade** (flat colour, not halftone: art bible §7.7, menus use flat colour). The focused cat, its related cats and its own arrow stay full colour.
2. **Gang and Boss are shown by arrows, never by tags.** Focusing a gang cat brightens its arrow to the perch and keeps the Boss at full colour. Focusing the Boss brightens every member's arrow.
3. **Tags only for the rare ties:** Rival, Kin, Old Boss / Old Gang. One paper tag per related cat, clipped to the right end of its ribbon (icon + word, 28 px floor), popping in over 3 drawings (instant under Reduce Motion). **At most 3 in the scene**, in priority order Rival > Kin > Old Boss / Old Gang, nearest first.
4. **Overflow:** a 4th or later tie is not drawn; the card shows a small "+n ties" pom that opens the full Rival card at its Ties row (§3.2).
5. **Other scenes:** one chip under the tab (§2.2); West / R or a click on it jumps there.
6. **Never** shown: a tie with an undiscovered cat, Mikan's own relationship as a tag (that stays the pose, sprig and storm mark), any number.

The card has **no Ties line**: the tags and the tab chips carry the ties on focus, and the full Rival card lists them all, so nothing depends on hover.

**Not tags:** Mikan's own relationship with a cat (Grudge, Regard, truce, Sworn) stays the pose, sprig and storm mark. Tags never change because of what Mikan did to another cat; they are generation facts or the recruit's own memory (OR-04), and showing them changes nothing.

**Slice seeds you can see** (Narrative confirms names): every Wall Sitter → Daifuku **Boss** (by arrow); Togemaru ↔ Goma **Rival**; Kagi ↔ the second Captain **Rival**; Kinako ↔ Sasa **Kin** (cousins, across the Bell and Lane scenes); Hige → Daifuku **Old Boss** (authored, from the start; across scenes).

### 2.8 The card, and the Boss anger readout

The **name-card** (bottom-left card zone) is the focused cat's short card; South opens the full Rival card (§3). It slides up in 3 drawings on focus (instant under Reduce Motion) and is **gone at rest**. Content, top to bottom:

1. Chestnut portrait · name ribbon (Clowder colour) + Title.
2. **Role tag** (word + Style icon, §2.4), personality icon + word. *(The role tag lives here only, not on the cat in the scene.)*
3. Grudge and Regard pictograms (hackles, ears); storm mark + *Sworn Enemy* / grumble cloud / sprig if any.
4. **One** own-history line (its latest, from its own Memory, with the day).
5. **One** context line, only if it applies: Boss: puffs + stage word + "Angry at your marks in his Lane. Spent in his next fight." (roaming: "Roaming: Tofu Shop's back wall" with a crown paw-mark); raider: moon + "Tonight: raids Persimmon Alley."; Outsider: stake stamp + "Staking Laundry Pole Yard · leaves after 2 repels" (as pips).
6. "+n ties" pom only on overflow (§2.7).

No Ties line (the tags and the tab chips carry it, and the full card lists them all), no "Boss of …" repeated on the cat, no Objective line except on the Boss's full card (§3.2). Undiscovered: the silhouette and "Not met yet. Sniff it out: hold Whisker Sense near it." Outsider silhouette: "A stranger's scent. Staking Laundry Pole Yard."

**Boss anger** (C1, OR-07): what the owner asked to see "every time you do something bad on its territory".
- **In the scene:** 0–3 **steam puffs** rising over the perch: none = Calm, 1 = Riled, 2 = Seething, 3 = Furious. At Furious the puffs are bigger and the perch's crown notch glows Collar Crimson (zigzag edge as its shape twin). At rest the puffs are the only anger readout.
- **On the card:** the puffs, the **stage word** and one line: "Angry at your marks in his Lane. Spent in his next fight."
- **On the Rival card (§3.2):** the puffs, the **stage word**, and two fixed lines of system text: "Rises when you over-mark or counter-spray in the Lane. Cools each night." and "Next fight with him: Fired Up for a while / for a long while / all fight. Spent after his next fight."
- **Never shown:** a number, a cause that is a fight, or any effect on another cat (G2).
- **On the street** the act gets a one-beat answer (a steam puff on the Patch tag; `hud.md` §3.1) and the Sniff gets a card at Seething or Furious (`hud.md` §5.3).

### 2.9 Focus, input, and opening after key events

| Input (gamepad / keys / mouse) | Result |
|---|---|
| Stick, D-pad / arrows, WASD / hover | Spatial focus between cats in the scene, including silhouettes, legend cards, knots and the perch. Up the stick walks focus toward the perch, down toward the camera |
| L1 / R1 · Q / E · click a tab · wheel | Previous / next scene. The scene slides sideways like turning a corner (a cut under Reduce Motion) |
| Focus | The cat lifts 4 px with a Bell-Gold rim; its arrow brightens and unrelated cats dim; ≤ 3 relationship tags appear (§2.7); the card slides up (§2.8); the buttons switch to the focus set (below) |
| South / Enter / LMB | Full Rival card (§3); Crew card for a Crew cat (§6.2, read-only); legend card for a Gone cat; nothing on a silhouette (a soft bump) |
| West / R / click a tab chip | **Go to tie**: jump to the related cat's scene and focus it |
| North / F | The **Last night** replay (§2.10), when there is one |
| View hold / Tab hold / "?" pom | Legend: role tag words, pose meanings, marks, tag words, anger puffs, the arrows |
| East / Esc / RMB | Close; back to where it was opened |

**Initial focus:** the cat it was opened for; otherwise none, and **the card is hidden** (no default Boss card), so the first frame is the clean rest screenshot (§2.12).

**Button bar** (bottom-right, ≤ 3 pom buttons with binding glyphs, right-aligned):

| State | Buttons |
|---|---|
| Rest | (N) Last night *(only when there is one)* · (E) Back |
| Focus | (S) Card · (W) Go to *(only with a cross-scene tie)* · (E) Back |

The legend stays on View hold / Tab hold / "?" and is not a button.

**The Rivals chip.** The board never opens itself during play. After a key event, a small chip sits under the phase dial for 4 s (`hud.md` §3.1); pressing View opens the board on that cat's scene and its change plays once as a ≤ 1.5 s pin beat:

| Event | Pin beat |
|---|---|
| `CatDiscovered` | The silhouette steps out of the shade onto its spot and inks in from the feet up; its ribbon drops in; tape star sticker |
| `VerdictApplied` · Recruit | The cat walks down the path past the camera, leaving a bell-cord knot; the Bell scene tab's dot fills |
| `VerdictApplied` · Chase Off | Its figure fades to a legend card; paw prints run off the frame edge |
| `VerdictApplied` · Nose-Touch | A sprig is pinned on it (a Boss: he steps down off the perch and sits beside it) |
| Declaration (Sniff card) | The storm mark draws toward the camera; the ribbon reads *Sworn Enemy* or *Sworn Rival* |
| `ChallengerArrived` (Sniff card) | Outsiders scene: a silhouette steps off the bus beside a stake-flag Patch stamp |
| `BossWindowChanged(open)` | Daifuku climbs down off the perch and walks out of the scene |
| `AllyJoined`, first time per cat | The sprig on that cat flowers once |
| `BetrayalTriggered` (Sniff card) | The cat leaves the Bell scene; it appears in the Outsiders scene as "Turncoat" beside the Patch it now keeps |

Each beat moves **only the cat Mikan dealt with** (or a newly generated cat). At the **end-of-Life card** the board plays a 5 s non-interactive pan through the Lane scene with the session's tape stars. After a **loss** no chip appears; the board stays openable on the walk home, where the victor carries a tape star and its new `WON` line.

### 2.10 The Last night replay

After a night with **town events** (OR-19), the first opening that day plays them: **≤ 5 beats**, each ≤ 1.5 s, in the scene where each happens, with a one-line caption in a slim paper strip at the bottom. Skippable with any button; Reduce Motion shows a static list. Only events the Sniff admits are replayed (cats with history with Mikan, or touching Mikan's Patches or Crew); others simply appear with a tape star.

| Town event | Beat | Caption (system text; Narrative words it) |
|---|---|---|
| **Newcomer** into a keeperless Patch | A new silhouette steps off the bus in the Outsiders scene; its Patch stamp flips to its ring | "New face at Persimmon Alley." |
| **Feud scuffle** (a Rival-tagged pair) | A dust pom between the two on the path; the loser comes out wearing a head plaster; both return to their own spots | "Goma and Sasa scuffled." |
| Challenger arrival / leaving | Steps off the bus / walks off down the coast road | "A stranger is staking Laundry Pole Yard." / "The stranger left town." |
| Truce ended | Sprig falls (a Friend: the sprig flowers instead) | "Togemaru's truce is over." |

Captions state **what** happened, never **why** in terms of another cat (§1.1 rule 6).

### 2.11 Own-history audit (patent display rule)

The board would serve as '179's output element for any second-cat change it displayed; the design keeps there being none (OR-03). UX's part is to never draw one:
- No caption, tag, role tag, arrow, line, stamp or animation says or implies that cat Y changed because of Mikan's dealings with cat X.
- **Staging by role is a display of fixed facts.** Roles, personality and Style never change (OR-19), so no cat's spot, tag or arrow ever moves because of an outcome; an empty spot or perch stays empty. This display keeps '908 A3's "hierarchy" present as a picture (G11 partial, as before); v2 §6 places display-only rosters outside the independent claims. Counsel to confirm with the rest of the design.
- Ties are shown as facts ("Rival"), never as consequences.
- Card and Rival card history lines come from **that cat's own Memory** of its dealings with Mikan (G8).
- String audit before any build shown outside the team, and before counsel review (which still blocks scope lock and any public showing).

### 2.12 Acceptance

1. **Fit:** each scene fits its gang (Lane: ≤ 10 tracked + silhouettes) at the 1080p default framing without scrolling; every focusable cat ≥ 64 px tall; every ribbon, role tag and relationship tag ≥ 28 px text. At rest each discovered cat shows exactly one text label; ≤ 16 text items on screen at rest; no label overlaps another cat; no arrow crosses the centre line.
2. **Screenshot test (OR-03):** a 1080p capture of the Lane scene's **rest** frame (nothing focused) lets 4 of 5 unbriefed viewers say who the Lane's Boss is, who hates the player, and which cats they have not met.
3. **Roster test (C1):** asked "how many gangs are there, and which have you not met?", ≥ 80% of testers answer from the scene strip within 10 s.
4. **Tag test:** asked "who is Togemaru's rival?" and "who was Hige's old boss?", ≥ 80% of testers answer in ≤ 10 s, with the mouse and with the pad (the second needs Go to tie or the tab chip).
5. **Role test:** ≥ 70% of testers, shown a role tag on the focused cat's **card**, can guess how that cat fights (e.g. "Shield: protects the others").
6. **Anger test:** shown the Lane scene's rest frame with Daifuku Seething, plus the Boss's card, ≥ 80% of testers can say what made him angry (marking in his Lane) and that it will be spent in his next fight.
7. Opening from the street takes ≤ 300 ms to the first interactive frame; changing scene ≤ 200 ms; the clock is paused while it is open.
8. The §2.11 audit passes with zero findings.

---

## 3. The Rival card

### 3.1 Purpose

Everything the player knows about one discovered Rival, presented as a cat with a history, not a stat block. Opened from the Rivals board (South), the Verdict (North) and a Sniff card. Undiscovered cats have no card.

### 3.2 What it shows (and what it never shows)

| Shown | How | Owner |
|---|---|---|
| Name, Title, Clowder | Slanted banner, emblem | Nemesis |
| **Personality** | The cat's animated idle in its personality set, large; icon + name; one line "As a Rival" (e.g. "Loud; comes back fast for revenge") | Nemesis (brief §3.5 shape) |
| Role and **role tag** | Crown (Boss), two claw marks (Captain), one claw mark (Tough), and the role tag of §2.4 ("Captain · Sneak" + Style icon) under the banner. Fixed for life; there is no "former rank" | Nemesis (role, personality, Style); UX (the tag words) |
| **History (Memory)** | Stamp strip of up to 6 pinned entries, then the rest (≤ 10): each a pictogram stamp (Routed by you, Routed you, Ambushed, Fled, Nose-Touched, truce, Lick In, Spray over its mark, Old Score) + one line in its own voice ≤ 60 characters + the day. **Only its own dealings with Mikan** (G8) | Nemesis |
| **Grudge** and **Regard** | Two 4-step moods as pictograms: Grudge = hackles (smooth → bristled → arched → storm); Regard = ears (back → level → forward → nose-out). **No numbers, no bars** | Nemesis |
| Sworn / Bitter | Storm mark around the portrait with *Sworn Enemy* or *Sworn Rival* / grumble cloud | Nemesis |
| **Ties** (OR-04) | One row of paper tags for discovered cats only, the full list, including a Boss's whole gang (the board shows Gang/Boss by arrows only, and at most 3 tags): "Boss: Daifuku · Rival: Goma · Kin: Sasa". Each tag's portrait is focusable and jumps the board's focus to that cat | Nemesis |
| **Anger** (Bosses only, OR-07) | Steam puffs, stage word and the two system lines of §2.8 | Nemesis |
| **Tonight** | Moon (raid) or stake flag (challenge) + the target Patch ("Tonight: raids Persimmon Alley."), when a raid or challenge by this cat is forecast. Moved from the deleted fact column | Territory |
| **Objective** (Bosses only) | One line from the turf goal: "Mark the Lane until he comes down." → "He roams: find him." → "Spray the Den corner stone." → "The Lane is yours." Moved from the deleted fact column | Territory |
| **Truce** (Nose-Touched) | Sprig + "Truce: 6 days left" (days are calendar counts, not feelings) or "Friend" | Nemesis |
| **Strengths** | Known Strengths as stamps; unknown as "?". Line: "If recruited: always-on perk" under the Strength | Nemesis chooses, Combat values |
| **Fears** | Known Fears as stamps (Water, Loud Noise, Cucumbers in the slice); unknown "?" | Nemesis chooses, Combat values |
| Scars | Silhouette on the portrait; listed as small icons | Nemesis |
| Relative threat | Paw-print size versus your Posse: smaller / even / bigger. **No level numeral on Rivals** | Derived from Crew's Power Rating |
| **Old Score** | Portraits of your Crew cats it has Routed or been Routed by (its own fights) | Nemesis / Combat |
| Recruit openness | A gate stamp: open ("would hear an offer") or shut. No numbers | Nemesis |
| Sting contour | The Rival's 2-bar yowl-sting as a drawn contour (DR-54) | Audio / Art |
| Challenger (Outsiders only) | Patch stamp it stakes + two pips "Repelled 0 / 2: then it leaves town" | Nemesis / Territory |

Never shown: Grudge, Regard or anger numerals, recruit thresholds, the join-in odds, AI weights, combat values of traits, or any line about another cat's dealings with Mikan.

**Legend card** (Gone): the same card, faded, with a "Run out of town" stamp across it, its last history line, and its Memory frozen. Read-only; nothing on it changes again.

### 3.3 Wireframe

```
+--------------------------------------------------------------------------+
| /=[ (sage) TOGEMARU  the First Thorn  "the Soggy" / ]=\   claw: /        |
|      [Brawler (Scrapper claw)]  <- role tag                              |
|  +------------------------+   PERSONALITY                                |
|  |                        |   [Braggart icon]  BRAGGART                   |
|  |    (animated idle:     |   "Loud. Comes back fast for revenge."       |
|  |     chest out, tail    |                                              |
|  |     high, kneading)    |   GRUDGE  [arched]     REGARD  [ears back]    |
|  |   ear-notch scar ->    |   ~~storm~~ SWORN ENEMY                       |
|  +------------------------+                                              |
|   threat: (paw)(PAW) bigger       sting: _/\_/\__/^\_                    |
|                                                                          |
|  TIES       [crown Boss: Daifuku]  [x Rival: Goma]                       |
|  STRENGTHS  [+15% Nerve]  [?]     -> if recruited: always-on perk        |
|  FEARS      [Cucumber]  [?]                                              |
|  OLD SCORE  [Hige]  "Still owe you for the gutter."                      |
|                                                                          |
|  HISTORY  (pinned)                                                       |
|  [Fled  ] D1  "Faster than a kitten. Remember that."                     |
|  [Routed] D2  "You knocked me off my own wall."                          |
|  [Spray ] D3  "My post smells of bell."                                  |
|  ...                                                                     |
|  gate: [shut]                    (E) back    (L1/R1, Q/E) prev/next cat  |
+--------------------------------------------------------------------------+
 (all names, lines and traits illustrative; Nemesis and Narrative own them)
```

Boss variant: the anger block (puffs, stage word, two lines) sits under GRUDGE / REGARD; while the window is open, a crown paw-mark line reads "Roaming · now at Tofu Shop's back wall".

---

## 4. The Verdict, and the loss

### 4.1 Purpose and rules

After the Posse Routs a tracked Rival in a won fight, **one full Verdict per fight**, for the highest-role tracked Rival (OR-12). Other Routed tracked cats **slip away**: their silhouettes slink off at the ring edge with a "slipped away" stamp before the cards fan in. The clock is paused; the prompt cannot be dismissed (Pillar 4: a Rival fight always ends in a choice); pause (Options only) stays reachable.

**Three options, and every one clears the post** (OR-12): the Keeper leaves, and the **Claim Spray** prompt appears at the post at once (yours at 70). Nothing else in the district changes, and the screen never suggests it does.

### 4.2 The compass (three cards)

Fixed directions with mnemonic meaning: **Up = Nose-Touch** (lift them up), **Left = Chase Off** (out of the frame), **Right = Recruit** (over to your side). **There is no Down card** (Humble is removed, OR-15); Down does nothing.

- 500 ms input lock as the cards fan in (drains attack mashing).
- **No default focus.** A direction (stick, D-pad, arrows/WASD, or mouse hover on a card) raises a card; hold South / Enter / LMB for 600 ms to commit, or press then confirm.
- **Tells on the raised card,** one per direction so they never collide: Up shows the Rival's **tail** (lashing = Nose-Touch closed; still = open); Right shows **eyes tracking the Bribe and a forward lean** (the starting Loyalty band); Left shows **Mikan turning away** and the Rival's ears dropping. Mikan previews too: leans in (Nose-Touch), tail-beckon (Recruit), turns away (Chase Off).
- Each card: **title, one line of consequence, and at most one chip.** The only numbers are the Bribe prices and the truce length.

| Card | One line (system text; Narrative words it) | Chip | When unavailable (halftoned, in place) |
|---|---|---|---|
| **Nose-Touch** (Up) | "Steps down in peace. May side with you against its rival." | **10 days** truce | Pending Grudge ≥ its gate (OR-13): "Tail lashing. Not today." · From Life 2, a loud take (≥ 2 Counter-Sprays on its own post; Nemesis F4): "Too much of your stink on its post." · A Boss that came to the fight Seething or Furious: "Still steaming. Not today." |
| **Chase Off** (Left) | "Gone from town for good." | — | Always available |
| **Recruit** (Right) | "Joins your Crew with everything it remembers." | **from 96** (the Fair price; "Free" in Life 1) | Gate shut: "Too bitter to join." / Boss: "Daifuku doesn't rate you yet." / Stash below the Fair price: "Stash short: 72 of 96." / Crew full: the card reads "Recruit — make room" (§4.3) |

Under all three cards, one slim strip: **"Every choice clears the post. Then spray it."**

### 4.3 The Bribe row (Recruit raised)

Raising Recruit opens the Bribe row inside the card. **From Life 2 a recruit always costs Morsels** (Crew: the free tier is cut), so the row has two steps, **Fair · Feast**, each showing the Morsel price (Crew's formula) and the **starting Loyalty tier** it would produce, as a tier word ("starts Aloof"). The Stash count and Crew count sit at the end of the row. A step the Stash cannot cover is halftoned ("Stash short: 72 of 192"); if it cannot cover Fair, the whole Recruit card is halftoned with that line (§4.2). **Life 1 recruits are free:** the row is a single "Free" step with the fixed tier. **Move along the row** with L1/R1, Q/E, the mouse wheel or a click on a step (Left/Right stay the compass). It starts on **Fair**. The Rival's lean and eyes respond as the step changes.

Recruitment routes in the slice are only this Recruit Verdict, the story recruits (Hige, Pon) and the Friend Stray (Kinako). No other screen offers a recruit.

**Full Crew (cap 6):** committing opens a strip of **Lounging** cats to release (posted and Posse cats are not listed). Each shows its Loyalty tier: **True/Sworn shows "Clean parting"**; below that shows "Leaves for good" (it becomes Gone, Crew's rule). Release then Recruit is one confirm.

### 4.4 Wireframe

```
+--------------------------------------------------------------------------+
|              (camera low two-shot; Kagi flattened in the dust;           |
|               HUD hidden; slipped-away silhouettes already gone)         |
|                   .--------------------------------.                     |
|                   | (Up)  NOSE-TOUCH     [10 days] |                     |
|                   | Steps down in peace. May side  |                     |
|                   | with you against its rival.    |                     |
|                   '--------------------------------'                     |
| .------------------------.                    .-------------------------.|
| | (Left)  CHASE OFF      |    (Kagi: tail,    | (Right) RECRUIT [from 96]||
| | Gone from town for     |     eyes, lean     | Joins your Crew with    ||
| | good.                  |     react to the   | everything it remembers.||
| '------------------------'     raised card)   |    FAIR    |   Feast    ||
|                                               |     96     |    192     ||
|                                               |   Aloof    |   Steady   ||
|                                               | Stash 150     Crew 4/6  ||
|                                               '-------------------------'|
|           [ Every choice clears the post. Then spray it. ]               |
|   (N) Their card        (L1/R1) Bribe            Hold (S) to decide (o)  |
+--------------------------------------------------------------------------+
```

### 4.5 Flow

```
Rout (Combat) -> slipped-away beat (<=1 s) -> HUD hides -> 500 ms lock
  -> three cards (Left, Up, Right), no focus
     |- direction / hover: card raises, tells play
     |    '- Right: Bribe row (L1/R1) or make-room strip
     |- North: Rival card -> East returns, same raised card
     '- hold South 600 ms on a raised available card
          -> VerdictChosen -> Nemesis -> VerdictApplied
          -> payoff 2-3 s (skippable after first sight of each type):
               Recruit: falls in at Mikan's heel, bell cord tied
               Chase Off: bolts out of frame; paw prints; "Gone" stamp
               Nose-Touch: noses touch; sprig; it walks off to roam
          -> HUD returns; Claim Spray prompt on the post (Boss: a gold
             thread to the Den corner stone)
          -> encounter tally -> Rivals chip (4 s) -> roaming
```

**First Verdict ever** (Life 1 day 2, Togemaru): one hint line under the cards, "Choose what they become. Chasing off is for good." No option is locked for teaching.

### 4.6 Loss: nightfall and the walk home (OR-01, OR-02)

A **loss** is a Posse wipe (every Posse cat Routed). Scram and a Rival fleeing are not losses. Life 1 tutorial fights cannot be lost. A loss ends the day; this is a sting, not a punishment screen, so there is **no "defeat" card and no text**.

```
Last Posse cat Routed
 -> screen-anchored HUD hides (200 ms)
 -> GLOAT (<= 3 s): the victor's name-card slams in, one taunt balloon from
    its own Memory ("Off my wall, Collar."); its new Title stamp if it earned one
 -> NIGHTFALL (2.0 s; skippable after the first time):
      a pom iris closes on Mikan lying in the dust
      inside the iris: the phase dial's sun drops behind the roofline,
      the moon rises (no digits, no words)
      the iris opens on the same spot in moon-blue light, the street empty
      (before the cat flap: the same staging; the player cannot stay out)
 -> HAUL TALLY (TR, 2 s): fish icons scatter off a small pile, "fish -6"
    (20% of today's field haul; not shown in Life 1, where nothing is lost)
 -> Mikan gets up (1 s). The Head Home thread is already drawn.
 -> WALK HOME on the closed street (HUD: hud.md §3.6), <= 60 s;
    after 60 s the drowsy autopilot walks Mikan home
 -> the garden wall: HUD falls away -> ROUTED EVENING (Narrative):
    the plaster beat (Haru kneels, a sticking plaster on Mikan's ear),
    then the normal home verbs until sleep
```

| What the player sees | Rule it reflects |
|---|---|
| Only the victor gloats, and only the victor's card gains a `WON` line and a tape star on the Rivals board | OR-02 / G1: nobody else changes |
| No territory stamp, no Scent change, no "Mark Over" | A loss changes no territory (OR-02) |
| Posse plates gone; the Posse cats limp after Mikan in the world | They heal at step 0; Loyalty −3 each is shown at the Lot as a cloud with its cause ("Routed yesterday") |
| The Rivals board opens read-only from View / J or Pause | OR-01.3 |
| Next morning's Sniff may carry the victor's line citing the plaster | Victor only (OR-02, G8) |

---

## 5. The Turf Board, unified (OR-17)

### 5.1 Purpose

The Lot's territory screen and the **only map-like view and only place territory numbers appear**. With the Sniff forecast and the Doorstep pile it is the entire management surface. **One decision a day: who guards the threatened Patch, and so who leaves the Posse.** Target ≤ 1 min at the Lot (≤ 45 s in the showcase).

**What the owner reacted to** (`previews/08-turf-board.png`): seven regions competing (title, tab bar, a separate Sentry counter, floating Scent pills, a right panel, a clothesline Crew strip, a totals box, a legend); Scent shown twice per Patch; numbers in five places; the one decision split across three regions. **The fix: four zones, each with one job, read in one order.**

### 5.2 The four zones

| # | Zone | Its one job | What is in it | Numbers? |
|---|---|---|---|---|
| 1 | **Header** (one line) | *How am I doing?* | District name · the **influence bar** with its % and the Boss crown at the full end · the Lot tabs | **The influence %** |
| 2 | **Map** (≈ 65% width) | *Where?* | 5 Patch stamps at fixed positions on the painted terraced Lane (the view from the kei truck roof). Each stamp = landmark + owner ring + wisps + **one badge** + the seated Sentry | None |
| 3 | **Tonight panel** (right) | *What do I do?* | The selected Patch (pre-selected: tonight's threatened one): the threat, its Scent, tomorrow's Tribute; while carrying a cat, the odds bar and the **one button** | **Scent, Tribute** |
| 4 | **Crew strip** (bottom) | *Who?* | Two Sentry pegs, then each Crew cat's chip; ends with the totals | **The totals** |

Plus the shared control footer under it. There is no other region: no separate Sentry counter, no floating pills, no legend box (the legend is View-hold).

### 5.3 Wireframe (1080p; Life 2 day 3, a raid forecast)

```
+------------------------------------------------------------------------------------------+
| HIDAMARI LANE  [BELL ███████████████░░ 88% |· open ·|▓▓▓ sage ▓▓]( crown )  Q< Crew TURF Lessons Share >E |
+--------------------------------------------------------+---------------------------------+
|   (painted terraced Lane, Dusk light, the sea below)   | TONIGHT                         |
|                                                        |  [Persimmon Alley stamp]        |
|          [ DEN: corner stone ]   (crown)               |  Raid: [Togemaru][Stray] grudge |
|           sage ring ~~~~  Daifuku at home              |  Scent 48 · Strong at 60        |
|                                                        |  Tribute tomorrow  12           |
|   [ Laundry Pole Yard ]          [ Tofu Shop Step ]    |  ------------------------------ |
|    bell ring ~~~  (Pon seated)    bell ring ~~~~       |  Carrying HIGE  Stalwart · True |
|                                                        |  Repelled ██████ Scuffed ██ Lost ▁ |
|                 [ Persimmon Alley ]  (moon)  <- pulses |  (shield) counters a grudge raid |
|                  bell ring ~~ cracked   ( empty seat ) |  (heart) Pon next door           |
|   [ Low Wall Corner ] (house)                          |                                 |
|    bell ring ~~~~                                      |        [  Post Hige  ]          |
+--------------------------------------------------------+---------------------------------+
| SENTRIES (•)(o) | [Hige  Stalwart True  carrying] [Kinako Fraidy Steady Posse]           |
|                 | [Pon Goofball Steady Laundry P.] [Kagi Schemer Aloof Posse]  ... |  Tomorrow 43 − 4 = 39 · Stash 128 |
+------------------------------------------------------------------------------------------+
  (S) pick up / post    (N) cat card    (W) unpost    (View) legend    (E) leave
```

### 5.4 Zone details

**1. Header: influence (OR-08).** One tug-of-war bar: **Bell Gold from the left** (Mikan), the **gang's colour from the right**, any outsider's colour after it, the **Open** gap between them, and **Daifuku's crown at the full end**. The % beside it is Mikan's influence (0–100). Two quiet extras:
- **Fades by morning:** a hatched sliver at the end of the gold segment shows how much of the bar will fade overnight if nothing changes (decay minus refresh). It shrinks live while you carry a Sentry onto a fading post, so the player sees posting hold the bar up. No second number.
- **Window open:** the crown lights and a small tick appears at **75** ("He goes back to the Den below here"). Den claimed: the crown becomes a bell stamp; the bar stays, because decay never stops.
Legend line (View-hold): "Keep your posts Strong to fill the bar. Full: Daifuku comes down off the walls."

**2. Map: where.** One **Patch stamp** component for all five Patches:
- landmark silhouette in a bean; **owner ring** in the Clowder colour with its emblem pip (shape twin);
- **wisps 1–4** (the street's own read, same art);
- **one badge**, top-right, by priority: **raid or challenge tonight** (moon / stake flag) > **fading** (held below Strong: cracked wisp) > **Home** (Low Wall Corner: house). A Patch never shows two badges;
- the **seated Sentry** as a small cat chip, or an empty-seat outline;
- **no numbers.** The threatened stamp pulses gently once on open (Reduce Motion: a static rim).
- **Neighbour links** (heart for a bonded pair, crossed claws for a clash) appear **only while carrying a cat**.
- **Boss window open:** three **crown paw-marks** on the map at the patrol stops (Laundry Pole Yard's yard wall, Tofu Shop's back wall, the Den corner stone), the current phase's stop lit with Daifuku's chip on it, and the Den stamp reading "out". Held outer Patches carry a small shield under the ring ("can't be lost while he roams").
- **Challenger:** its stake flag is the badge; its chip (silhouette until met) stands beside the stamp.
- **Lost Patch:** the stamp's ring flips to the new Keeper's colour with a torn-paper edge.

**3. Tonight panel: the one decision.** It always shows the **selected Patch**; on open, that is **tonight's threatened Patch** (a forecast raid or a challenger), so the first press is "pick a cat".
- **Threat row:** the raiders as cat chips (undiscovered = silhouette), the motive icon (`grudge`, `gang_orders`, `gloat`, `challenge`; shown when Territory's rule allows, currently when a Schemer is posted in the district; `challenge` is always shown because it was announced). For a challenger: "Staking this post. By day it waits here: go and face it." and its Repelled pips (0 / 2).
- **Patch row:** "Scent 48 · Strong at 60" and "Tribute tomorrow 12".
- **While carrying a cat:** the **Repelled / Scuffed / Lost** bar (three segments, no numbers; Territory's raid-defence odds incl. `counter` and `pair`), the cat's guard line from its personality (one line), the counter icon if it counters the motive, the neighbour link, and the window shield ("Lost becomes Scuffed while Daifuku roams") when it applies. Then the **one button: "Post Hige"**.
- **Quiet night** (nothing forecast): the panel reads "Quiet tonight" and lists the **fading posts** (stamp + "fades to 3 wisps by morning"), pre-selecting the most faded. Posting there refreshes it.
- **Wavering cat** on the selected Patch (OR-11: posted ex-Rival recruits only, two warning mornings before it leaves): the **warning slot** sits at the top of the Tonight panel, above the threat row, and outranks it, because it is the one thing tonight that cannot be undone. It holds the cat's chip turned away, a **two-pip morning mark** (one pip lit on the first Wavering morning, both on the second: "last warning"), and one line saying what fixes it: "Kagi is wavering. Bring it into the Posse, or off this post." On the second morning the panel **opens on this Patch** even when a raid is forecast elsewhere; the raid stays one press away. Fixing it (unpost, Posse, or Loyalty back to Aloof) clears the slot at once.
- **Lost Patch selected:** "Take it back: face its Keeper there, then spray it."

**4. Crew strip: who.** Two **Sentry pegs** (filled = used), then every Crew cat as a cat chip: portrait, personality icon, **Loyalty tier word**, **assignment chip** (Posse · post name · Lounging · carrying). Wavering cats sit turned away. Cats that cannot take the selected post are halftoned in place with the reason ("Needs True loyalty" for the Warden slot). The strip ends with the **totals**: "Tomorrow 43 − 4 = 39 · Stash 128" (Tribute − upkeep = net).

**Numbers appear in exactly three places:** the header %, the Tonight panel, the totals.

### 5.5 Posting flow (two presses at best)

```
Open Turf tab
  -> threatened Patch pre-selected (map stamp lit, Tonight panel on it)
  -> focus in the Crew strip on the leftmost cat that can take the post
     (no recommendation: the player chooses)
     |
     |- South / Enter / LMB on a cat chip: pick it up -> it is carried
     |     onto the selected Patch at once; the odds bar, neighbour link
     |     and the hatched "fades by morning" sliver update live
     |     |- stick / arrows / mouse over the map: snap to another stamp
     |     |- South / Enter / click "Post Hige" (or drop the dragged chip
     |     |     on a stamp): posted. The cat walks off the Lot toward
     |     |     the Patch in the diorama; the peg fills
     |     '- East / Esc / RMB: put it back
     |- stick up / arrows / mouse into the map (not carrying): select
     |     another Patch; the Tonight panel follows
     |- West / R on a posted cat (strip or map seat): unpost
     |     (a Brooder's dislike is warned first)
     '- North / F: cat card
```

- **Mouse:** drag a chip onto a stamp, or click a chip then click "Post". Hover never posts.
- **One assignment per cat** (Posse, Posted or Lounging; A-2). Posting a Posse cat takes it out of the Posse; the chip says so before the press ("leaves the Posse").
- **Field posting** (Territory §3.6): after a **Claim Spray** from Life 2 day 2, a compact strip of Lounging chips offers "Leave someone here?" with the same Tonight preview, one press.

### 5.6 States and unlock

| State | Behaviour |
|---|---|
| Life 1 | Tab hidden; the Lot shows Crew only |
| **Life 2 day 1** (first look) | The tab opens for a **look, not a decision**: the header bar fills from empty to Mikan's influence and the crown glints; one hint card: "Fill the bar. Daifuku comes down." Sentry pegs are not shown yet; the Tonight panel reads "Quiet tonight" with any fading posts. ≤ 15 s |
| **Life 2 day 2** (first posting) | The pegs pop in. Opens on the forecast Patch with a hint card on the Tonight panel: "Raiders tonight. Pick a cat to guard it." The first-use decision is exactly one posting |
| Raid forecast | Moon badge; threat row; as §5.4 |
| Challenger active | Stake badge; challenger chip; `challenge` motive from the night after it arrives |
| Quiet night | "Quiet tonight" + fading posts |
| Boss window open | Crown lit + 75 tick; three stop marks; shields on held outer Patches |
| Patch Lost overnight | Torn ring in the new Keeper's colour; Tonight line "Take it back…" |
| Wavering (morning 1 / morning 2) | Turned-away chip with the two-pip mark in the Crew strip and on its map seat; the Tonight warning slot (§5.4); on morning 2 the board opens on that Patch |
| Turncoat (the third night) | The Patch's ring flips to the turncoat's colour with a torn edge; the cat appears at the Outsiders gate on the Rivals board; Tonight line "Take it back: face it there, then spray it." |
| Den claimed | Crown → bell stamp; the Warden slot opens on the Den (True+) |
| Not at the Lot | Unavailable; the street shows wisps only |

### 5.7 Acceptance

1. **Glance test:** shown the board for 5 s, ≥ 80% of testers can say which Patch is threatened tonight and roughly how full the Lane's bar is.
2. **First posting** on Life 2 day 2 takes ≤ 45 s median and ≤ 1 min at the 75th percentile, from tab open to "Post".
3. A frame audit finds numbers only in the header %, the Tonight panel and the totals, and **one badge at most per Patch**.
4. Every element on the screen is one of the §1.5 components.

---

## 6. Crew roster, Posse and Lessons

### 6.1 Crew roster

Six cats at most (cap 6). Each is a large tile with the cat **animated in its personality idle** (the first thing seen), the personality icon and name, its Style icon, and its assignment. Lines between tiles show **social pairs** whenever the roster is open: heart-link for bonded (Kin in the Crew are always a bonded pair, OR-05), crossed claws for clashing. Pom states: **"!" = a Lesson or Instinct Move is available**; **cloud = sulking** (a Loyalty dislike fired recently); **turned away = Wavering** (OR-11).

```
+--------------------------------------------------------------------------+
| CREW 6/6                                     (L1 R1) tabs   (E) leave    |
|                                                                          |
|  +-----------+   <3   +-----------+        +-----------+                 |
|  | (sits in  |--------| (peeks    |        | (chest    |                 |
|  |  front,   |        |  from a   |   X    |  out,     |                 |
|  |  braced)  |        |  crate)   |--------|  prancing)|                 |
|  | STALWART  |        | FRAIDY    |        | BRAGGART !|                 |
|  | HIGE      |        | KINAKO    |        | TOGEMARU  |                 |
|  | old wall  |        | Friend    |        | the Thorn |                 |
|  | Bruiser   |        | Scrapper  |        | Scrapper  |                 |
|  | POSSE <   |        | POSSE v   |        | lounging  |                 |
|  +-----------+        +-----------+        +-----------+                 |
|  +-----------+        +-----------+        +-----------+                 |
|  | BROODER   |        | SCHEMER   |        | GOOFBALL ~|  ~ = cloud      |
|  | DAIFUKU   |        | KAGI      |        | PON posted|                 |
|  |           |        |           |        | Laundry P.|                 |
|  +-----------+        +-----------+        +-----------+                 |
|  <3 bonded   X clashing    (S) open card   (W) Posse builder             |
+--------------------------------------------------------------------------+
 (slice six per Crew §3.3 / brief v1.5: Hige Stalwart · Kinako Fraidy · Togemaru Braggart · Daifuku Brooder · Kagi Schemer · Pon Goofball; Daifuku joins only if Recruited at his Verdict)
```

### 6.2 The Crew card (One Cat Card, Crew variant)

Top half is personality; bottom half is the build.

| Area | Content |
|---|---|
| **Personality panel** (largest) | Animated idle; icon and name; three one-liners in the brief §3.5 shape: **Fights like** · **On guard** · **Likes / dislikes**; bonds with / clashes with (portraits of Crew who match) |
| Loyalty | **Tier word** (Shifty / Aloof / Steady / True / Sworn) on a 5-segment tier bar with the current tier lit, no numeral, plus **what it opens**: "Can be taught" (Steady+), "Can be Warden" (True+). Recent change shown as a heart pop or cloud with its cause ("Shared a Morsel", "Benched 2 days", "Its post was Scuffed") |
| **Old Gang stamp** (OR-06) | For a recruit whose own Memory holds `OLD_GANG`: the Old Boss's chip and one of two words: **"Nerves"** (it flinches at the sight of him: Cowed until you Tag-In to it) or **"Steady"** (its personality resists: Braggart, Stalwart, Brooder, or it is Sworn). Hige: "Old Boss: Daifuku · Steady" |
| Ties | Its relationship tags to discovered cats (Kin, Rival), as on the Rival card |
| Style and level | Style icon; level; XP pips |
| Moves | 4 slots: icon, name, Paw cost, Set-up/Pay-off mark |
| Signature perk | Ex-Rivals only: their Strength, now always on. Strays have none |
| History | Ex-Rivals keep their Memory strip, Scars and Title; Old Score marks against current Rivals |
| Assignment | Posse (with its D-pad slot) / Posted (Patch) / Lounging |
| Wavering (OR-11) | Posted ex-Rival recruits only. A turned-away pose, the two-pip morning mark ("last warning" on the second) and the fix line ("Bring it into the Posse, or off its post.") |
| Zoomies | Its Style Zoomies (read-only) |

### 6.3 Posse builder

At the Lot: Mikan is fixed on **Up**; three slots on **Left / Down / Right** match the D-pad switch and the combat plates (`hud.md` §4.1). Slots unlock as recruits arrive; four cats by Life 2 day 2 (DR-01).

Each slot shows the cat's personality icon, Style, Moves. The builder draws **bonded pair links** ("stronger Tag-In between these two") and **clashing warnings** ("−1 Loyalty each per day together"), and an **Old Gang note** when a slotted cat has Nerves ("Flinches at Daifuku"), so the player can plan the Tag-In. A posted cat placed here leaves its post (confirm shows the Patch it vacates).

**Away from the Lot: Tail-Up only** (DR-38). D-pad Left/Right (V) in exploration opens the compact picker; only Lounging cats appear selectable; posted cats are halftoned: "On guard at Gatepost. Change at the Lot." Not usable inside Haru's wall or on the walk home after a loss. There is no Posse editing from the pause menu.

### 6.4 Lessons (teaching flow)

Rules read from Crew (DR-38) and the price sheet (DR-14): routes in the slice are **Instinct** (Moves arriving with level) and **Lessons**. Mikan teaches 3 Lessons a day, other cats 1. The student must be **Steady+**. Prices: Rank I 40, Rank II 120 Morsels, ×1.5 cross-Style, from the Stash. Mikan may slot at most 2 cross-Style Moves. A Lesson gives +1 Loyalty (Schemer: a liked event).

Flow:
```
LESSONS tab
  -> pick TEACHER (portraits; shows Lessons left today: Mikan ooo, others o)
     -> pick STUDENT (below Steady halftoned: "Not ready to learn from you.")
        -> pick MOVE (teacher's known Moves the student can learn;
                      price, Rank, cross-Style x1.5 stamp,
                      Set-up/Pay-off mark, the state it makes or uses)
           -> pick SLOT (empty, or replace: one-line confirm showing
                         the Move leaving; Crew owns what happens to it)
              -> confirm: price leaves the Stash
                 -> teaching beat (2 s; the teacher's personality
                    flourish; skippable) -> heart pop on the student
```

**Instinct:** a "!" on the cat. The new Move appears in its card; slotting uses the same Slot step, free. Mikan re-slots at the Lot and at Sunspots only (not at home: home veto).

### 6.5 Share a Morsel

A single button on its tab: the cost (Σ Crew levels), the Stash, and a preview of the hearts (+2 Loyalty to all; the Goofball's counts double, marked). Once per day; after use the tab shows the empty bowl until tomorrow. The diorama plays the Crew eating together (each personality eats differently).

---

## 7. Onboarding: the first 15 minutes and the first hour

### 7.1 Principles

1. **One new verb every 60–90 s**, never two at once (DR-22). A verb is taught when it is needed, by the situation first and a hint card second.
2. **Hint cards** sit bottom-centre: binding glyph + pictogram + ≤ 6 words of system text. One at a time; East dismisses; a hint stops appearing after two successes. A hint log lives in Options.
3. **No locked choices for teaching.** The Verdict offers all three; outcomes are never scripted (DR-41).
4. **The home teaches nothing with text.** Home verbs are taught by prompt pictograms and Haru's staging.
5. **New systems that are state, not verbs** (influence, anger, tags, discovery, challengers, the Boss window) are taught by **one look on the screen that shows them**, the first time they matter, never by a tutorial page.
6. The order is ruled: Narrative owns the K beats, Combat owns what is taught, UX owns this sheet; the days follow `day-loop.md` §3.9 and the rulings.

### 7.2 First 15 minutes (DR-22; unchanged by the owner pass)

| Time | Beat | New verb / element | How it is taught | Success check |
|---|---|---|---|---|
| 0:00–0:04 | **K1.1 The Box in the Rain.** Haru **hums** (not the Call). | Camera orbit (right stick / mouse) at the very end | The kitten looks up at the yellow raincoat; a stick pictogram fades in once | Player orbits |
| 0:04–0:05 | The garden | **Move**, **Jump/Hop** to the low wall (South / Space) | A butterfly lands on the wall; South glyph on first approach | Reaches the wall |
| 0:05–0:06:30 | A crow on the **lane-side wall top**, outside the garden (R4: no combat inside the wall) | **Swat / Attack** (West / LMB): the 3-hit string | West glyph as the crow lands; the third hit's finisher gets its T2 burst | Crow hit |
| 0:06:30–0:08 | The crow dives (still on the lane-side wall top) | **Skitter** (East / Shift) on a white telegraph | Slow first dive; white ring decal + East glyph | One Skitter |
| ≈ 0:08–0:10 | **The old wall cat**: "Use your whiskers, Collar." | **Whisker Sense** (R2 / Tab hold): trail and compass ring | The cat says it; R2 glyph; the trail leads to the cat's spot | Follows the trail; **Hige joins** (free) |
| 0:10–0:11 | Two Strays in the lane | **Switch** (D-pad Left / X to Hige, Up / Z back to Mikan) | Hige gets cornered; his plate pulses with its D-pad glyph | One switch |
| 0:11–0:12 | | **First Paw** fills | Paw pip pops with a bell tick; hint "Paws buy Moves" | — |
| 0:12–0:13 | | **Slow Blink** (R2 / Tab): choose a Move | Slow Blink opens itself once the first time a Paw fills, cursor on Move 1 | One Move used |
| 0:13–0:14 | | **Command the other cat** (L1/R1 in Slow Blink) | Hige's "can act" bell lights; hint "L1/R1: other cats" | One commanded Move |
| 0:14–0:15 | Last Stray | **Frazzle → Quick Pile-On** (North / F) | Frazzled ring on the last enemy; dust-pom prompt; hint card "North: PILE-ON" | **Two-cat Pile-On** by minute 15 |

### 7.3 The rest of the first hour (Life 1, days 1–2)

| ≈ Time | Beat | New verb / element |
|---|---|---|
| 0:15–0:17 | Low Wall Corner, scripted short escalation: 1 Rub, 1 Counter-Spray on the rival mark | **Rub**, reading **scent wisps** (the first marking acts; Daifuku's anger starts here, unseen until the board opens) |
| 0:17–0:19 | One wave, then the Keeper (an **untracked Stray**: Routing it gives no Verdict) | **Hiss** on the Keeper's **yellow** telegraph |
| 0:19–0:20 | A Tough at low Nerve in the wave | **Back Down** (Hiss at ≤ 15%). Hint after, not before |
| 0:20–0:21 | The post has no Keeper now | **Spray** (North / E): **Claim Spray**, Patch claimed; the tag flips to the Bell. "Fight to clear, spray to claim" is taught by doing it |
| 0:21–0:22 | **The First Thorn Standoff**: **Togemaru** (Braggart Scrapper), after the claim (name-card, sting contour) | **Brace** (R1 / RMB hold) against his string. **His flee at 25% cannot be interrupted on day 1** (OR-14), so the first Verdict is always day 2's |
| 0:22–0:23 | Sunspot | **Nap**: the **phase dial** jumps half a phase; heal |
| 0:23–0:25 | Dusk chime, the lamp wave; **K1.3 The first Call**; evening at home; sleep | **Call glyph**; **Head Home** thread (D-pad Down / H hold); home verbs by pictogram; Bond hearts |
| 0:25–0:26 | **Day 2 Doorstep**: the first 1-item Sniff ("the Thorn waits at the gatepost") + first Tribute | **Doorstep Sniff**, the pile |
| 0:26–0:27 | The Lot (Crew tab only) | **Crew card**: personality front and centre for Hige |
| ≈ 0:28–0:31 | **The Thorn at the Laundry Pole Yard gatepost**: memory-citing Standoff line ("I ran yesterday. Not off my own post, Collar."), unskippable for 1 s; the contest | **Tag-In** (spark ring + plate glyph pop; hint on the first two windows) |
| 0:31–0:32 | Togemaru Routed | **First Verdict**: three cards; hint line "Choose what they become. Chasing off is for good." Then the **Claim Spray** of the gatepost (the prompt appears at once) |
| 0:32–0:33 | From the yard, Daifuku is on his wall; Hige: "That's Daifuku up there." | **Sniff to discover** (hold Whisker Sense on him for 1 s within 10 m): the scent-outline confirmation (`hud.md` §3.2). In Life 1 there is no Rivals chip: the payoff is on Life 2 day 1, when he is the only coloured cat on his perch in the Lane scene |
| 0:33–0:40 | **Pon** joins (story recruit 2); free roaming, 1–2 fights | Posse of three; **Relay** happens if it happens (not taught by card) |
| 0:40–0:45 | Dusk, home, **K1.4** (Life 1 Closing); sleep | Life 1 ends |
| 0:45–0:47 | Montage 1→2; **Life 2 day 1** Doorstep: the 3-item Sniff | **Rivals board** reveal: "(N) See the Rivals" on a Sniff card (§7.4) |

*Times follow `day-loop.md` §3.9 (the budget owner; aligned in the consistency pass).*

**Slice tests covered:** two cats and a Pile-On by 0:15; first memory-citing Rival line at ≈ 0:28 (target < 1:00, 100% of testers).

### 7.4 Life 2: one headline per day (DR-22; days per `day-loop.md` §3.9 and the rulings)

**The old Turf Board day mismatch is fixed here.** This sheet said Sentries and the Turf Board on L2D1 while `day-loop.md` §3.9 and `territory-management.md` §3.12 both put them on **L2D2**, as the answer to the first forecast raid. They agree, so this sheet now follows them: **posting is taught on L2D2.** The rulings ask for **the influence bar from L2D1**, so on L2D1 the Turf Board tab opens for a look only (§5.6): the bar and the crown, no decision. The first posting is still one decision.

| Day | Headline teach | Also switching on (each one look, no extra verb) |
|---|---|---|
| **L2D1** | **Ambush** (from the High Road, Pounce opener; the Rival yowl-sting with its Skitter/Brace counter) | **The Rivals board** from the 3-item Sniff: opens focused on the Sniff's cat; one hint card "Hover a cat: see who it knows." The first ties the player can see: Hige → Daifuku **Old Boss** (if sniffed), Togemaru ↔ Goma **Rival** once Goma is met, Daifuku's **anger puffs** if Life 1's Counter-Sprays left him Riled. **Kinako's favour**, the required first objective (Interact / E within 4 m); the Lot opens after it. **Turf Board look**: the influence bar as Life 2's goal ("Fill the bar. Daifuku comes down."). Persimmon Alley taken |
| **L2D2** | **Props and Fears** (bucket, scooter horn, cucumber junk) | **The first raid forecast** in that morning's Sniff, often beside the Declaration card → **Sentries and the Turf Board's one decision** at the Lot. Relay with the Posse of 4; **Share a Morsel**; K2.3 the cat flap at Dusk → **Night**; the raid fires as **the Caterwaul**, with one hint "Get there in time: your guard holds better" (the presence rule) |
| **L2D3** | **Zoomies** (the hint fires the first time the gauge is full; Captain **Kagi** at Tofu Shop Step) | **Lessons** (Rank I). **The Tofu Shop Step Claim Spray fills the bar: Daifuku comes down** (the Boss window; reference day per the consistency pass): his yowl rolls down and he climbs to the wall above the post, in view, with control kept; the compass crown tick appears (`hud.md` §3.2). Fighting him today is optional. If Daifuku reaches Seething, the Sniff's anger card ("The big wall is seething.") and a puff on the board. Recruiting Kagi writes his **Old Gang** (Nerves) on his Crew card |
| **L2D4** | **The Daifuku fight** at his patrol stop (the Sniff's Boss-window card lists today's three stops): "knock him off into the bucket" at any stop | **The challenger**, announced in that morning's Sniff (silhouette, stake flag on the Turf Board, a tick on the compass); optional by day. **Old Gang Nerves** first seen in the Daifuku fight: Kagi flinches and is Cowed → hint "Tag-In to steady it."; Hige resists with his own line. A lost attempt plays the loss-to-night (§4.6) |
| **L2D5** | **The claim:** Rout Daifuku at any stop, give a Verdict, **Claim Spray the Den corner stone** (a gold thread leads there) | No new verbs |

**Taught when they first happen (no fixed day):**

| Event | Teaching |
|---|---|
| **A Nose-Touch join-in** (from Life 2, a truce cat whose Rival is in the fight) | No hint before. The ally guest plate appears with its sprig (`hud.md` §4.1); after the fight, one hint "Your truce cat joined in." and the Rivals chip |
| **The first loss** | The nightfall plays itself; on the walk home one hint "Day's over. Head home." (Head Home glyph). No loss is scripted in the slice (consistency pass F5) |
| **A Nose-Touch card closed by a loud take** (from Life 2) | The halftoned card names the reason (§4.2); the first time only, one hint under the cards: "Spray quietly to make peace." |
| **First discovery by encounter** | The Rivals chip after the fight (from L2D1) |
| **First Gone cat** | The legend card's pin beat on the board (§2.9) |
| **First Wavering morning** | The Sniff card, then the Turf Board fix line |

### 7.5 First-hour and Life 2 acceptance

1. ≥ 80% of first-hour testers, unprompted, have: used Slow Blink, commanded the second cat, performed a Pile-On, Sprayed, given a Verdict, and gone home when called.
2. ≥ 80% of testers open the Rivals board on L2D1 and hover or focus at least one cat; ≥ 60% can name one tie afterwards.
3. ≥ 80% of testers can say on L2D2, after the Lot, which Patch they guarded and why (the threat).
4. ≥ 70% of testers use at least two of the three Verdicts across the slice (OR-12; Nemesis owns the measure, UX logs it).
5. Hint cards dismissed without the action (a teaching failure signal) are logged per beat.

### 7.6 Edge cases

| Case | Handling |
|---|---|
| Togemaru on day 1 | His flee at 25% cannot be interrupted (OR-14), so there is never a day-1 Verdict; his day-2 gatepost line cites the day-1 flee |
| Togemaru is Chased Off on day 2 | Gone, with his farewell line; a closing Sniff card "Run out of town" next morning; the legend card on the board. His arc closes as a complete ending (Nemesis §3.7, F11). Life 2 pressure comes from Daifuku's anger and window and the challenger. The < 60 min memory-line test was already met at 0:32 |
| Togemaru is Recruited / Nose-Touched on day 2 | Recruit: "Wears the bell now" card; his storm mark becomes a bell in the Bell scene. Nose-Touch: a truce greeting at the gatepost each day; declared a Sworn Rival in the L2D2 Sniff; he may join a fight against Goma |
| The player loses a Life 1 fight | Tutorial fights cannot be lost. Any other Life 1 loss plays §4.6 (staged nightfall), with no haul lost; Haru's plaster |
| The player never sniffs Daifuku | He stays a crowned silhouette until met; the name-card says how to discover him |
| The player skips Hige's trail | Hige walks to Mikan after 60 s; the recruit is not optional |
| Slow Blink's self-opening collides with a telegraph | It waits until no telegraph is live within 3 m |
| Player ignores Dusk | Drowsy at end of Dusk, 1-minute grace, then the thread walks Mikan home (DR-15) |
| L2D1 Turf Board look with no fading posts | The bar fill and the crown are the whole look; "Quiet tonight" |

---

## 8. Assumptions for creative-director review

- **A-1 Numbers. CONFIRMED (round-2 R3, brief v1.3).** Numbers count what the cat owns or pays; they never measure a feeling, a relationship or a human. v1.5 adds: anger as puffs and a stage word; influence % only in the Turf Board header; truce days and challenger Repelled pips are calendar counts.
- **A-2 One assignment per cat** (Posse, Posted or Lounging); posting a Posse cat removes it from the Posse. Territory and Crew to confirm.
- **A-3** The slice's Patch names follow Territory (Low Wall Corner, Laundry Pole Yard, Persimmon Alley, Tofu Shop Step, the Den).
- **A-4** The disposition pose set (§2.5) is an example; Nemesis owns the mapping from Grudge/Regard to pose.
- **A-5 (new) Pause ▸ Rivals. CONFIRMED (consistency pass F6).** The owner asked for the board from the pause menu; the rulings list View / J, the Doorstep and the Lot. The pause tab is added on the street (the closed street included) and at the Lot only (never at home), with the same read-only board.
- **A-6 (new) L2D1 Turf Board look. CONFIRMED (consistency pass F6).** The rulings want the influence bar from L2D1; Day Loop and Territory want posting on L2D2. The tab opens on L2D1 for an unprompted ≤ 15 s look with no Sentry pegs, inside L2D1's Lot time (Day Loop §3.9).
- **A-7 (new, not built) A post strip on the street.** A tiny 4-post strip on the Patch tag (gold = held Strong) would let the player track influence on the street without a number. OR-08 says the street shows wisps only, so it is **not** in this spec; offered for the owner's "ease to use" if the L2D4 window proves hard to read in playtest.
- **A-8 (new) The Rivals chip** rather than auto-opening the board after key events: it never interrupts a fight or a walk.
- **A-9 (owner C6) Staged scenes.** Depth by **fixed role** (Boss perch, Captains on the steps, Toughs on the path), discovery order within a tier, arrows only from each member to its Boss, unmet cats in the shade. This reintroduces a visible pecking order that OR-03 had flattened into one row; it is a display of fixed roles that never move (OR-19), and is flagged for counsel with the rest of the Rivals scope (§2.11).
- **A-10 (owner C6) Role tag words** (Brawler, Enforcer, Sneak, Lookout, Shield, Prankster) are UX's proposal from the brief §3.5 "fights like" column; Narrative may re-word them, keeping them short and keeping Sentry, Warden and Keeper out.

---

## Backlog (post-slice)

- Full-game Rivals board: the Arcade, Shiosai and Summit scenes populated and discoverable (7-Patch districts need a deeper path or a second landing for their Toughs); Botan on the lighthouse rail.
- Full-game Turf Board: one header bar per district (tabs per district), more Sentry slots, Roof Run hooks.
- Watching (Lesson route), Knacks slots, Home Moves, Repertoire view beyond the slice.
- Botan's Verdict (Nose-Touch only; the hand-bell).
- Life 8 and Life 9 screens (Carries, the heir).
- Per-screen split of this doc after the slice build.
- One-handed presets.
- Kits, Wall Watch, the Usurper newcomer on the Rivals board.
- Rivals board "Last night" replay: one held hero frame (a newcomer stepping off the bus in the Outsiders scene) for trailer capture; re-run the flash test on the replay beats.
- First-hour clock: §7.3 now follows `day-loop.md` §3.9 (K1.4 at ≈ 0:40–0:45). Re-time both together against the first playable.
- Rival card history lines in §3.3 are illustrative; re-cut them once Nemesis's day-1 flee / day-2 gatepost schedule is in the prototype.
- If counsel clears a line-only boss bark at a defector (OR-06), it plays in the Standoff with no UI change.
- Handheld-console framing check for the Rivals board (fit at 720p).

## Revision Log

**Owner: Rivals board declutter (2026-11-24).** Owner on preview 06: 'very crowded and cramped'. `design/ux/rivals-board-cleanup.md`: names only at rest (one label per cat), role tags and ties on focus only (≤ 3 tags, Gang/Boss by arrows), card on focus only, fact column and influence bar removed (Turf Board owns them), compact emblem scene strip, faint merged arrows, ≤ 1 mark per cat; §2.1–2.9, §2.12, §3.2 updated; §2.6.1 deleted.

**2026-11-24, Consistency pass (creative director; `design/reviews/owner-feedback/consistency-pass.md`).**

| Item | How |
|---|---|
| F6 · A-5, A-6 | Confirmed (§8): Pause ▸ Rivals on the street and at the Lot; the L2D1 Turf Board look, unprompted, ≤ 15 s |
| F7 · window day | §7.4: Daifuku comes down on **L2D3** at the Tofu Shop Step Claim Spray (in view, control kept); L2D4 is the fight day with the challenger and the Boss-window Sniff card |
| F11 · Togemaru's arc | §7.6: a Chase Off on day 2 is a complete ending, not "unachieved"; a Nose-Touched Togemaru is declared in the L2D2 Sniff |
| F12 · Nose-Touch gate | §4.2: the halftoned card names its reason (Grudge, a loud take, a steaming Boss); §7.4: a one-time hint "Spray quietly to make peace." |
| F5 · the loss | §7.4: no loss is scripted; the first loss teaches itself |
| First-hour clock | §7.3 re-timed to `day-loop.md` §3.9 (memory line ≈ 0:28, K1.4 ≈ 0:40–0:45) |

**Owner C6 (2026-11-24): Rivals board as staged scenes.** §2 reworked to the owner's layout reference (`design/reviews/refs/rivals-board-layout-ref.webp`): one scene per gang in deep perspective (Boss on a raised perch at the vanishing point, Captains on the steps, Toughs on the path, by fixed role, discovery order within a tier), unmet cats as silhouettes in the shade, a name ribbon and a fixed **role tag** per cat (personality word Brawler / Enforcer / Sneak / Lookout / Shield / Prankster + Style icon; "Boss of …", "Captain · …"; Outsiders: Challenger / Newcomer / Turncoat / Roamer), dashed arrows from each member to its Boss only. Header with place name, influence bar (no %) and a **scene strip** (Lane · Arcade · Shiosai · Summit · Outsiders · Bell, cycled with L1/R1, dots per cat as the town-wide roster); left fact column (Tonight, Your posts, the Boss, Objective; no numbers); card bottom-left; buttons bottom-right; cross-scene ties hang on the strip's tabs with Go to tie (West / R). Relationship tags, anger, own-history lines and the patent audit kept (§2.7, §2.8, §2.11). §3.2/§3.3 gain the role tag. A-9, A-10 added; Backlog line updated.

**2026-11-24, Owner feedback pass (2026-11-24): C1, C3, C4, C5 through `owner-feedback-rulings.md` OR-01…OR-21 and patent note v2 §5.**

| Item | How |
|---|---|
| C1 / OR-03, OR-04 · Rivals board | §2 rewritten: the Fence Line is replaced by **the Rivals board**: every unique cat by section (the Lane with Daifuku on its gatepost and the gang in order of discovery; up the hill in haze; Outsiders; the Bell fence), silhouettes until discovered, legend cards for Gone cats, no rank ladder. Hover/focus tags (six words, icon twins) with chalk threads and a halftone dim, also listed on the name-card. Opens from View / J, **Pause ▸ Rivals**, Sniff cards and a **Rivals chip** after key events, with pin beats; never in the house. Acceptance per OR-03 plus tag and anger tests |
| C1 / OR-07 · Boss anger | §2.6 and §3.2: 0–3 steam puffs, stage word, two system lines; never a number or a fight cause |
| C1 / OR-06 · Old Gang Nerves | §6.2 Crew card Old Gang stamp (Nerves / Steady); §6.3 builder note; first seen L2D4 (§7.4) |
| C4 / OR-12–15 · Verdict | §4 rewritten: three cards (Left Chase Off, Up Nose-Touch with **10 days**, Right Recruit with price), one-line consequences, the shared "Every choice clears the post. Then spray it." strip; Down card, Humble, "comes back changed", 5-day truce and the snub roll deleted; Bribe row on L1/R1; payoffs end at the Claim Spray prompt; first-Verdict hint now says Chase Off is final |
| C2 / OR-01, OR-02 · Loss | §4.6 new: Gloat → nightfall iris → haul tally → walk home on the closed street (`hud.md` §3.6) → Routed Evening; victor-only changes |
| C5 / OR-16, OR-17 · Turf Board | §5 rewritten to the four-zone layout: header with the influence bar (% only here, a "fades by morning" sliver, the 75 tick when the window is open), map with one badge per Patch and the patrol's crown marks, Tonight panel with the one decision and the one button, Crew strip with pegs and totals; numbers in three places; shared component table (§1.5); two-press posting flow with mouse drag; challenger, window, Wavering, Lost and quiet-night states |
| Onboarding · day mismatch | §7.4: posting moves to **L2D2** to match `day-loop.md` §3.9 and `territory-management.md` §3.12; the influence bar shows from L2D1 as a look (rulings); the Rivals board on L2D1; window and challenger on L2D4; claim on L2D5; event-taught list for join-ins, first loss, discovery. §7.3: Togemaru's uninterruptible day-1 flee, the Claim Spray after the first Verdict, the sniff-to-discover beat at 0:40. §7.6 rewritten |
| Patent (v2 G1, G8, G12) | §1.1 rule 6 (own-history rule) and §2.10 audit; "Rivals" as the UI name; *Sworn Enemy / Sworn Rival* pills; no re-ordering of rows; replay captions without cross-cat causes |
| Crew coordination (same day) | Bribe row is **Fair · Feast** from Life 2 (the free tier is cut; Life 1 stays "Free"); recruit routes are the Verdict, story recruits and the Friend Stray only (Comes Knocking removed from Backlog); betrayal warning slot designed: two-pip morning mark on the chip, map seat and Crew card, and the Tonight panel's top slot, which opens on that Patch on the last-warning morning |
| Platform | Desktop only; §1.4 navigation table for gamepad, keyboard and mouse; no touch layout |
| Deleted (OR-21) | The Fence Line, height = rank, Clout seat, Undermark crates, Away paw prints, Restless, promotions and seat states, the Down card, Humble copy, Den gate states (Locked/Open 3 of 4), "Last night" promotion hops, Backlog items on the Fence Line and Wavering in Life 3+ |

**2026-11-24, Iteration 3 (round-2 presentation review, final pass; also `combat-and-crew.md` and `nemesis-territory-dayloop.md`).**

| Item | How |
|---|---|
| Fix 1 · Life 2 teaching ladder | §7.4 re-ordered: L2D1 Ambush (+ Friend Stray favour as required first objective, Turf Board and Sentries), L2D2 Props and Fears (+ Relay, first forecast raid as the Caterwaul, K2.3 at Dusk), L2D3 Zoomies (+ Lessons), L2D4+ Den and Daifuku. Matches Combat §3.16 and Day-loop; Turf Board/Sentries on L2D1 follow Territory §3.12 and the nemesis review rather than the presentation review's "keep on L2D2", so all three system docs agree. §5.5 unlock rows follow; the "raids only take weak Patches" hint removed (Strong Patches are raidable) *(superseded by the owner feedback pass: posting on L2D2)* |
| Fix 2 · Crow (R4) | §7.2 crow beat on the lane-side wall top, outside the garden |
| A-1 | CONFIRMED by R3 |
| Names and Moves | First Thorn = Togemaru (Braggart Scrapper, Fear Cucumbers, Strength +15% Nerve) in §3.3 and §7.3; roster names the slice six; Kinako is a Scrapper; recruit input is Interact within 4 m (not hold Sit); Low Wall Corner Keeper is an untracked Stray, so the first Verdict stays on day 2 |

**2026-11-23, round 2 (fresh slice rewrite; issues from `design/reviews/round-1/ux--art-direction.md` and director-rulings Part 2 §8).**

| ID | Status | How |
|---|---|---|
| UX-1 | FIXED | All prompts use DR-08 (`hud.md` §8). |
| UX-3 | FIXED | §2: one continuous painted panorama; Toughs on the wall, Undermark crates for Humbled residents, Away paw prints, ex-Rivals on the Bell fence, Mikan's seat by Clout; no header, labels or footer; pills on Nemesis and focus only; name-card slide-up; seat states; ≤ 5-hop replay; screenshot test. Old-Timers and First Captain REJECTED (cut, DR-44). Full-town scroll to Backlog. *(§2 replaced by the Rivals board in the owner feedback pass.)* |
| UX-4 | FIXED | §7 rebuilt on DR-22: first recruit at ≈ 0:08–0:10, two-cat Pile-On by 0:15, Hiss/Back Down/Brace/Tag-In in Life 1, Ambush/props/Sentries/Lessons/Zoomies/Night in Life 2, one per day; Fence Line from the Life 2 Sniff (DR-23 ladder). |
| UX-5 | FIXED | Grudge/Regard 4-step moods, no numbers; Scent number on the Turf Board only; DR-10 tier names; "!" = Lesson, cloud = sulking; Bribe row; one Verdict per fight, highest rank; Gloat ≤ 3 s; Nose-Touch copy; field posting narrowed; Caterwaul ring (`hud.md`). Willingness %, Rations, upgrades, Specialisations REJECTED (cut systems). Mikan's re-slot limited to Lot/Sunspot. Watch pips, Pending REJECTED (DR-38). |
| UX-6a, 6b | REJECTED | DR-38 (forgetting rules cut), DR-34 ("make room" replaces the gate crate; §4.3). |
| UX-6c | FIXED | §6.3: Tail-Up only away from the Lot; posted cats disabled; no Posse editing from pause or at home. |
| UX-7 | FIXED | Paper-goods language; claw pips; storm mark; halftone disabled; Turf Board as a painted terraced strip, not nodes; panels opaque. |
| UX-8 | FIXED | Fence Line, Turf Board and Crew never at home; Doorstep exception (`hud.md` §5). |
| UX-11 | FIXED | Field-post and Turf Board names per Territory; sparkline cut; Fence Line access per ruling. |
| UX-X2 | FIXED | Pile-On needs two cats; first one at 0:14. |
| UX-X3 | FIXED | First recruit in Life 1 per DR-22. |
| UX-X4 | FIXED | Toughs on the wall; crates = Undermark. |
| UX-X5 | FIXED | Moods, Regard added. |
| UX-X6 | FIXED | Wisps on the street. |
| UX-X7 | FIXED | Crew's Tail-Up wins. |
| UX-X8 | REJECTED | DR-34 "make room" (not the gate crate). |
| UX-X9 | FIXED | Tells split by Verdict direction (§4.2). |
| UX-X10 | FIXED | Street, Doorstep and Lot; never in the house. |
| UX-X19 | FIXED | Field posting only after a Claim Spray or won raid defence. |
| UX-X20 | FIXED | Mikan re-slots at the Lot and Sunspots; not at home. |
| PP-31 | FIXED | One rule: Tail-Up in the field, Posse builder at the Lot. |
| CX-C1, CX-C6 | FIXED | In `hud.md`. |

# Rivals board: declutter pass (owner, 2026-11-24)

> **Trigger.** The owner on preview `design/previews/06-fence-line.png`: *"The new Rivals board looks very crowded and cramped. Everything is everywhere, please evaluate it again, clean it up."*
> **Keep:** the staged alley from C6 (`design/reviews/refs/rivals-board-layout-ref.webp`): Boss on a perch at the far end, gang down the alley by role, depth and movement.
> **Rulings kept:** silhouettes until discovered (OR-03), ties only between discovered cats (OR-04), Boss anger shown (OR-07), own-history lines only (G8, §2.11), no numbers for feelings (R3).
> **Spec status:** `design/ux/key-screens.md` §2 and §3 are **not yet edited**. The edits are listed in §4 below and wait for the owner's approval (and answers to D1–D4).

---

## 1. Evaluation of the current frame

### 1.1 Everything on screen (06-fence-line.png, 1920×1080)

| Zone | Elements | Text items | Icons / marks |
|---|---|---|---|
| Header | "Hidamari Lane", pom icon, influence bar, crown, L1, 6 tabs (Lane, Arcade, Shiosai, Summit, Outsiders, Bell), 6 dot rows, R1 | 9 | ~30 (bar, crown, ≈ 27 dots) |
| Cross-scene chip (top right, under the header) | Hige mini chip + "Old Gang" tag | 1 | 2 |
| Left fact column | Tonight (moon, Togemaru chip → Persimmon Alley), Your posts (4 stamps), The Boss (ring icon, Seething), Objective (crown, "Fill the bar: he comes down.") | 7 | 9 |
| Scene: Boss | "DAIFUKU" ribbon, "Boss of Hidamari Lane" tag, crown, 2 steam puffs, unexplained pink paw icon, cushion | 2 | 5 |
| Scene: 6 gang cats | Per cat: "Gang" relationship tag + name ribbon + role tag with Style icon (Goma, Kagi, Ohagi, Togemaru, Sasa, Kuri) | 18 | 12 |
| Scene: other | 2 silhouettes with "?" bubbles, ~6 dashed arrows, storm cloud, tape star | 0 | ~10 |
| Name-card (bottom left) | Portrait, ribbon "DAIFUKU", "Boss of Hidamari Lane", crown, Brooder + 2 icons, ring + Seething, "D4 …" line, divider, Ties: Gang: Kagi, Ohagi +4 · Old Gang: Hige | 8 | 8 |
| Button bar | Last night · Card · Go to · Back | 4 | 4 |
| **Total** | **7 panels or panel groups competing at once** | **≈ 49** | **≈ 80** |

The reference shows ≈ 25 text items, two per cat, with wide empty walls. The target below is **≤ 16 text items at rest**.

### 1.2 Problems

| # | Problem | Where in the frame | Why it hurts |
|---|---|---|---|
| P1 | **Three labels on every cat** (Gang + name + role) | All six gang cats | 18 label beans in the middle third; the cats are smaller than their labels. The "Gang" tags are a *hover* state (Boss focused) shown in what is meant to be the rest frame, so rest and focus are mixed up |
| P2 | **Labels sit on other cats** | Ohagi's "Captain · Shield" crosses Togemaru's body; Sasa's stack floats ~150 px right of Sasa, nearer Kuri; Goma's stack sits on the plant pot, away from Goma | You cannot tell which label belongs to which cat. That breaks the screenshot test (§2.12 #2) |
| P3 | **Arrows cross each other and run through labels** | Goma's arc crosses Kagi; Sasa's line runs straight up through Kagi's tag column; the storm cloud floats between Ohagi and Togemaru | The "few strong lines" rule (§2.3) is broken: it reads as a web |
| P4 | **Boss shown three times** | Scene ribbon (DAIFUKU / Boss of Hidamari Lane), card header (the same two lines), "The Boss" fact | Same weight three times, so the eye bounces between the perch and the card |
| P5 | **Anger shown three times** | Puffs over the perch, "Seething" in the fact column, "Seething" on the card | Redundant; the puffs alone carry it at rest |
| P6 | **Four crowns** | Header bar end, perch, card banner, Objective chip | The crown stops meaning "the Boss is here" |
| P7 | **Gang membership encoded three ways** | Arrows, 6 "Gang" tags, card Ties "Gang: Kagi, Ohagi +4" | The arrows already say it |
| P8 | **Territory on the wrong screen** | Header bar, Your posts stamps, Objective "Fill the bar", Tonight raid | All of it is on the unified Turf Board (08), with numbers. Here it is a second, number-free copy that competes with the cats |
| P9 | **The scene is squeezed** | The fact column takes the left ~26%, the card ~40% of the bottom-left, buttons the bottom-right | The gang is pushed into the centre and right, so labels pile up (the root cause of P1–P3) |
| P10 | **Seven competing focal points** | Perch, green card banner, foreground Sasa (largest figure), fact column headings, storm cloud, gold header bar, the Old Gang chip | The perch should be the one focal point at rest; the card banner is as loud as the Boss's ribbon |
| P11 | **Text a resting player does not need** | Role tags (6), Gang tags (6), "Boss of …" (2), fact column (7), card (8), Card/Go to with nothing focused, 5 inactive tab names, "?" bubbles | ≈ 37 of 49 items are on-demand information shown all the time |
| P12 | **Header crowding** | Bar, crown, 6 word tabs, 6 dot rows, L1/R1; the Old Gang chip hangs off the corner | The strip is the widest element on screen and reads as a second menu |

---

## 2. The cleaned-up screen

### 2.1 Principle: a quiet painting at rest, one cat's story on focus

The Rivals board is a **portrait of a gang**, not a dashboard. At rest the player sees the place, the pecking order (by depth) and who is who (names). Everything else answers a question the player asks by pointing at a cat. Territory lives on the Turf Board.

### 2.2 Information hierarchy

| Layer | Shown | Never shown here |
|---|---|---|
| **Rest** (nothing focused; the default on open) | Header (place name, compact scene strip); the scene; **one name ribbon per discovered cat** (Boss: name only, the crown is on the perch); silhouettes in the shade (no "?"); faint arrows; **drawn marks only** (≤ 1 per cat, see 2.6); steam puffs over the perch; ≤ 2 contextual buttons | Role tags, relationship tags, the card, facts, the influence bar, inactive tab names |
| **Focus** (hover with the mouse after 120 ms; at once with the pad or keys) | The focused cat lifts 4 px with a Bell-Gold rim; its arrow brightens. **≤ 3 relationship tags** on related cats, one each; unrelated cats dim. **The card** slides up bottom-left with role tag, personality, mood, one history line and context lines. A cross-scene tie shows as **one chip** under its tab. Buttons switch to Card · Go to (if any) · Back | The same facts in two places |
| **Secondary** (South: the full Rival card, §3) | Full Ties list (a Boss's whole gang), history strip, Strengths, Fears, Old Score, both anger lines, the Objective, Tonight, Challenger pips | — |
| **Moved to the Turf Board** (§5) | Influence bar and %, Your posts, Tonight (raid or challenge) panel, Sentries, Posse | — |

**Label budget:** at rest each cat has **one** label (its name ribbon). On focus the focused cat keeps its one ribbon (its details are on the card), and each related cat gets **one** tag clipped to its ribbon. No cat ever shows more than two text items.

### 2.3 Layout grid and safe zones (1920×1080; scale with UI Scale)

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
| **Header** | One bean, 72 px tall: **place name** (44 px, left) and the **scene strip** (right). Nothing else: no influence bar, no crown, no % (all on the Turf Board) |
| **Scene** | Full bleed behind everything. **Discovered cats stand only in the perch, steps and path zones** (the centre wedge, x 480–1440). The side walls (x < 360, x > 1560) are kept for scenery, shade silhouettes and wall-top Roamers: that is the negative space |
| **Card zone** | Bottom-left 676 × 256 px. **Empty at rest** (painted foreground: stones, a plant). The scene is authored so no cat's spot, feet or ribbon falls inside it |
| **Button bar** | Bottom-right, one row of ≤ 3 pom buttons, right-aligned. No cat feet or ribbons below y 960 in x > 1360 |
| **Ribbon placement** | Each ribbon sits centred **under its own cat's feet**, ≤ 16 px below the paws, never on another cat's body; ≥ 48 px clear between any two ribbons. If two spots would collide, the spot moves (art staging), not the ribbon |
| **The fact column** | **Removed.** Tonight and Your posts are already on the Turf Board; the Boss's stage is the puffs plus his card; the Objective moves to the Boss's card and the full Rival card. Outsider and Bell facts move to those cats' cards; silhouette scenes show one centred caption, "Further up the hill." |

### 2.4 Header and scene strip

- **Place name**, left, 44 px.
- **Scene strip**, right: L1 glyph · **six emblem poms** (48 px; Wall Sitters' corner stone, Awning Gang's lantern, Salt Paws' anchor, Steam Court's lighthouse, Outsiders' bus-stop sign, the Bell) · R1 glyph.
- The **active** tab is a Cocoa pill with its **name** beside the emblem (the only tab with text). Inactive tabs are emblems only; hovering or focusing one shows its name in a small tooltip.
- **Dots:** a single row of 8 px dots under each emblem, one per cat (filled = met, hollow = silhouette); up to 10, then "+". A **silhouette scene** (Arcade, Shiosai, Summit in the slice) has a hazed emblem and hollow dots, so "which gangs have I not met" still reads from the strip in one glance (roster test).
- **Cross-scene tie:** during focus only, one mini chip with the tag word hangs under that tab (max one per tab; "+1" if there are more).

### 2.5 Relationship display on focus

1. **Dim, don't label.** Every unrelated discovered cat, silhouette and arrow drops to 45% toward the Wisteria shade (flat colour, not halftone: art bible §7.7, menus use flat colour). The focused cat, its related cats and its own arrow stay full colour.
2. **Gang and Boss are shown by arrows, never by tags.** Focusing a gang cat brightens its arrow to the perch and keeps the Boss at full colour. Focusing the Boss brightens every member's arrow. (This alone removes the six "Gang" tags in the current frame.)
3. **Tags only for the rare ties:** Rival, Kin, Old Boss / Old Gang. One paper tag per related cat, clipped to the right end of its ribbon (icon + word, 28 px floor). **At most 3 in the scene**, in priority order Rival > Kin > Old Boss / Old Gang, nearest first.
4. **Overflow:** a 4th or later tie is not drawn; the card shows a small "+n ties" pom that opens the full Rival card at its Ties row.
5. **Other scenes:** one chip under the tab (2.4); West / R or a click on it jumps there.
6. **Never** shown: a tie with an undiscovered cat, Mikan's own relationship as a tag (that stays the pose, sprig and storm mark), any number.

### 2.6 Silhouettes, arrows and marks at rest

| Element | At rest | On focus |
|---|---|---|
| **Silhouettes** | Flat Ink silhouette at 70% in the wall shade, no "?" bubble, no ribbon. A Boss silhouette keeps the crown outline | A "?" pom pops over it; the card reads "Not met yet. Sniff it out: hold Whisker Sense near it." |
| **Arrows** | Cream dashes with an Ink edge, **2 px, 35% opacity**. Cats left of the centre line merge into **one left trunk** up the steps, cats right of it into **one right trunk**; no arrow crosses the centre line or runs behind a ribbon. Empty perch: dotted | Focused cat's arrow: 4 px, full opacity, its trunk to the perch; others dim with their cats. Boss focus: all member arrows to full |
| **Marks** | **≤ 1 drawn mark per cat**, in priority: storm mark (arc lead) > steam puffs (Boss) > truce sprig > grumble cloud > head plaster. The tape star ("new") is a corner sticker on the ribbon, not a separate mark. Marks sit **on or touching their own cat** (the storm mark attached to Togemaru's head, aimed at the camera) | Every mark the cat carries is listed on its card |
| **Steam puffs** | 0–3 over the perch: the only anger readout at rest (OR-07) | Card: puffs + stage word + one line |

### 2.7 The card (focus only)

Bottom-left card zone, slides up in 3 drawings on focus (instant under Reduce Motion), gone at rest. Content, top to bottom:

1. Chestnut portrait · name ribbon (Clowder colour) + Title.
2. **Role tag** (word + Style icon), personality icon + word. *(The role tag lives here only, not on the cat in the scene.)*
3. Grudge and Regard pictograms (hackles, ears); storm mark + *Sworn Enemy* / grumble cloud / sprig if any.
4. **One** own-history line (its latest, from its own Memory, with the day).
5. **One** context line, only if it applies: Boss: puffs + stage word + "Angry at your marks in his Lane. Spent in his next fight."; raider: moon + "Tonight: raids Persimmon Alley."; Outsider: stake stamp + "Staking Laundry Pole Yard · leaves after 2 repels" (as pips).
6. "+n ties" pom only on overflow.

No Ties line (the tags and the tab chips carry it, and the full card lists them all), no "Boss of …" repeated on the cat, no Objective line except on the Boss's full card.

### 2.8 Button bar

| State | Buttons (≤ 3, right-aligned) |
|---|---|
| Rest | (N) Last night *(only when there is one)* · (E) Back |
| Focus | (S) Card · (W) Go to *(only with a cross-scene tie)* · (E) Back |

The legend stays on View hold / Tab hold / "?" and is not a button.

### 2.9 Wireframes

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
  Text at rest: 1 place name + 1 tab name + 7 names + 2 buttons = 11 (vs ≈ 49). * = tape star sticker.
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

### 2.10 Open decisions for the owner

| # | Decision | Chosen here | Alternative |
|---|---|---|---|
| D1 | The left fact column | **Removed**: its facts are on the Turf Board or the cat's card | Keep a single caption line under the header: the Objective only |
| D2 | The influence bar in the Rivals header | **Removed** (the Turf Board owns territory, R3) | Keep a thin bar with no crown and no % |
| D3 | Role tags at rest | **Hidden**: on the card only; depth already shows rank | Show the role word under the name like the reference (2 labels per cat) |
| D4 | The card when nothing is focused | **Hidden**: the rest frame is the screenshot | Show the Boss's card (the previous rule) |

---

## 3. Artist brief: ONE frame, focus state on Togemaru

Redraw `06-fence-line.png` as the **focus** state. Checklist:

- [ ] **Canvas:** 1920×1080, Hidamari Lane at Dusk, the same deep alley as the reference: Daifuku on the porch perch at the far end, Kagi and Ohagi on the steps, Goma, Togemaru, Sasa and Kuri on the path. All cats inside the centre wedge (x 480–1440); the side walls carry only scenery and **two flat silhouettes in the shade with no "?"**.
- [ ] **Header:** one cream bean, 72 px: "Hidamari Lane" on the left; on the right L1 · six emblem poms (only the active **Lane** pill has its name) · R1, one row of tiny dots under each emblem. **No influence bar, no crown, no %.**
- [ ] **One name ribbon per cat**, centred under its own feet, never on another cat. Daifuku's ribbon says only **DAIFUKU**; the crown sits on the perch with **2 steam puffs** above it. Sasa's ribbon has a small tape-star sticker. **No role tags and no "Gang" tags on any cat.**
- [ ] **Togemaru focused:** lifted 4 px with a Bell-Gold rim, the storm mark attached to his head and aimed at the camera, **his one arrow** bright (4 px) up the right trunk to the perch.
- [ ] **Goma:** full colour, with **one** paper tag "Rival" (crossed claws) clipped to the end of his ribbon. **Daifuku:** full colour, no tag.
- [ ] **Everyone else** (Kagi, Ohagi, Sasa, Kuri, silhouettes) and their arrows dimmed to ~45% toward Wisteria, in flat colour (no halftone).
- [ ] **Card, bottom-left (≈ 676 × 256):** chestnut portrait; ribbon "TOGEMARU · the First Thorn"; "Brawler" + claw icon; Braggart icon + word; hackles and ears pictograms + "Sworn Enemy" storm; one line `D3 "My post smells of bell."`; moon + "Tonight: raids Persimmon Alley." Nothing else.
- [ ] **Buttons, bottom-right:** (S) Card · (E) Back. Nothing else.
- [ ] **Absent:** left fact column, Old Gang chip, Ties line, "Boss of Hidamari Lane", "?" bubbles, the stray pink paw icon, any number.
- [ ] Clear 48 px between all ribbons; no arrow crosses the centre line or passes behind a ribbon; no cat's feet inside the card or button zones.

---

## 4. Proposed edits to `design/ux/key-screens.md` (pending owner approval)

| Section | Edit |
|---|---|
| §2.1 | Last sentences: "Hovering one cat hangs relationship tags…" becomes "At rest each cat carries only its name; pointing at one cat dims the rest, tags at most 3 rare ties and slides up its card (§2.7, §2.8)." |
| §2.2 | Scene strip: six **emblem poms**, only the active tab named, one 8 px dot row each, hazed emblem for silhouette scenes; cross-scene tie = one chip under its tab during focus only (this doc §2.4) |
| §2.3 | Arrows: at rest 2 px, 35% opacity, merged into a left and a right trunk, never crossing the centre line or a ribbon; focused cat's arrow 4 px, full opacity (§2.6 here) |
| §2.4 | The role tag moves **from the cat to the card**: "Under each cat's name ribbon hangs a role tag" becomes "The focused cat's card carries its role tag". Table unchanged |
| §2.5 | Add: ≤ 1 drawn mark per cat at rest (priority storm > puffs > sprig > grumble > plaster); the tape star is a ribbon sticker; marks touch their own cat; silhouettes have no "?" until focused. Roaming Boss: "the fact column says where he is" becomes "his card says where he is" |
| §2.6 | Region table and wireframe replaced by this doc's §2.3 grid and the §2.9 rest and focus wireframes. Header = place name + scene strip only (D2). Card hidden at rest (D4) |
| §2.6.1 | **Deleted** (D1). Replaced by a "Where the facts went" table: Tonight and Your posts → Turf Board §5; The Boss → steam puffs + Boss card; Objective → Boss's full Rival card; Outsider and Bell facts → those cats' cards; silhouette scenes → one centred caption "Further up the hill." |
| §2.7 | Rules 1–5 replaced by this doc's §2.5: flat 45% dim (not halftone), Gang/Boss shown by arrows only, tags only for Rival / Kin / Old Boss / Old Gang, max 3 in the scene, overflow "+n ties" on the card; the card's Ties line is removed |
| §2.8 | The card's contents replaced by this doc's §2.7 (role tag, personality, moods, one history line, one context line); the anger readout's "The fact column repeats the stage word" deleted; the card line becomes "Angry at your marks in his Lane. Spent in his next fight." |
| §2.9 | Initial focus: none, and **the card is hidden** (no default Boss card). Buttons per this doc §2.8 (rest: Last night if any · Back; focus: Card · Go to if any · Back) |
| §2.12 | #1 add: "At rest each discovered cat shows exactly one text label; ≤ 16 text items on screen at rest; no label overlaps another cat; no arrow crosses the centre line." #2 runs on the **rest** frame. #5 (role test) runs on the **card**. #6 (anger test) on the rest frame plus the Boss's card |
| §3.2 | Ties row: "the full list, including a Boss's whole gang (the board shows Gang/Boss by arrows only, and at most 3 tags)". New rows: **Tonight** (moon + target Patch, when forecast) and **Objective** (Bosses: "Mark the Lane until he comes down." → "He roams: find him." → …), both moved from the deleted fact column |
| Revision Log | New entry: "**Owner: Rivals board declutter (2026-11-24).** Owner on preview 06: 'very crowded and cramped'. `design/ux/rivals-board-cleanup.md`: names only at rest (one label per cat), role tags and ties on focus only (≤ 3 tags, Gang/Boss by arrows), card on focus only, fact column and influence bar removed (Turf Board owns them), compact emblem scene strip, faint merged arrows, ≤ 1 mark per cat; §2.1–2.9, §2.12, §3.2 updated; §2.6.1 deleted." |

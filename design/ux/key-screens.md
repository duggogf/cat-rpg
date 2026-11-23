# UX Spec: Key Screens — Cat RPG (vertical slice, round 2)

*Owner: ux-designer · Date: 2026-11-23 · Status: round-2 slice rewrite (the first draft is archived at `design/backlog/first-drafts/key-screens.md`)*
*Canon: `design/creative-brief.md` v1.2 and `design/reviews/round-1/director-rulings.md` (DR-xx). Companions: `design/ux/hud.md` (HUD, control map), `design/accessibility-requirements.md`.*

**Scope.** The slice screens: the **Fence Line** (§2), the **Rival card** (§3), the **Verdict** (§4), the **Turf Board** (§5), the **Crew roster, Posse and Lessons** (§6) and the **first-15-minutes and first-hour onboarding plan** (§7). Every number, threshold and rule shown is read from its owning GDD; this doc decides only what is shown, where, and how the player moves through it.

---

## 1. Shared foundations

### 1.1 Five rules every screen obeys

1. **One Cat Card.** Every cat, Rival or Crew, is shown by one card component with context variants. A recruited Rival keeps its Memory, Scars, Title, Fears and personality on the same card.
2. **Personality is shown, not listed.** The personality is the cat's *pose and idle animation* first, an icon second, a one-line description third. It is the largest thing on every cat card.
3. **Unavailable actions stay in place, focusable, halftoned, and say why** (one line, cat-voiced where a cat refuses, system text where a rule blocks). Positions never move.
4. **Numbers policy.** Grudge, Regard and Scent are **never numbers outside the Turf Board** (DR-39, DR-47). Loyalty is shown as its **tier word** (Shifty / Aloof / Steady / True / Sworn, DR-10) and the gate it opens, never a numeral. The Turf Board is the only screen with territory numbers (Scent, Tribute, upkeep). Currency counts (Morsels, Shinies) appear where they are spent; levels appear on Crew cards (Assumption A-1).
5. **Language veto.** No screen renders human speech or writing. Cat speech is readable text (≤ 60 characters per balloon). System UI is normal localised text.

### 1.2 Screen map (slice)

```
 STREET ──View/J──> FENCE LINE ──South──> RIVAL CARD
   │                    ^  (read-only; never inside the wall)
   │ fight won          │ North on a Sniff card
   v                    │
 VERDICT ─Recruit─> Bribe row ──> (make room) ──> Crew
   │
 DOORSTEP (Morning Sniff, hud.md §5.3) ──> THE LOT
                                             │
            ┌────────────────┬───────────────┼────────────────┐
            v                v               v                v
       CREW & POSSE     TURF BOARD       LESSONS        SHARE A MORSEL
       (roster, card)   (posting)        (teach)        (once a day)
```

### 1.3 The Lot hub

Arriving at the Lot (budget ≤ 1 min, DR-16) does not make the player walk between stations. The Crew lounge in a diorama of the vacant lot (the kei truck, crates, the fence), each cat idling in its personality set; the hub panel opens on the right third with four tabs: **Crew & Posse · Turf Board · Lessons · Share a Morsel**. L1/R1 or Q/E switch tabs. The tab with something new carries a pom ("!" = a Lesson available, a raid stamp on the Turf Board when a raid is forecast). The clock is paused at the Lot.

### 1.4 Navigation model

Stick/D-pad move focus spatially; South confirm; East back; North = context info (cat card); View held = legend. Keyboard: arrows/WASD, Enter/Space, Esc, Tab legend. Mouse: hover focuses, LMB confirms, drag where noted. Every hold has a press-then-confirm alternative.

---

## 2. The Fence Line (showpiece)

### 2.1 Purpose

The nemesis hierarchy as **one continuous painted panorama** of Hidamari Lane's walls: a side-on view, height = rank, cats as real models in their disposition poses, lit by the current phase. It is the nemesis system's face and the slice's most important screenshot. It must read as a picture of a town's cats, not a roster with a fence drawn on it.

**Access (ruled, X10):** read-only; opened with View / J anywhere on the street, at the Doorstep (North on a Sniff card) and at the Lot. **Never inside Haru's House.** Unlocked on Life 2 day 1 (DR-23 ladder); in Life 1 the binding shows a closed-gate pictogram.

### 2.2 Composition

- **Painted backdrop:** sky in the phase's light (morning cream, day blue, Dusk gold, Night moon-blue), the hills, and the sea. Behind the Lane, the rest of Yunagi climbs the hill in haze: the Arcade's awnings, the harbour, the lighthouse on the summit. Those stretches of wall are **unlit, empty and out of focus**: the climb ahead, visible but not yet the player's.
- **The Lane wall** runs right to left and rises: five **Toughs** spaced along the low run (ordered 1–5 from low to high, DR-43), two **Captains** on the higher garden wall, **Daifuku** alone on the top of his wall at the left, big enough to block the sky.
- **The Undermark:** a row of fish crates below the wall, **one crate per player-held Patch**, where Humbled residents sit.
- **Away cats:** paw prints leading off the left end of the wall into the haze (≤ 2 Away).
- **Roamers:** on the telephone wire / laundry pole above the run, outside the ranks.
- **The Bell section:** at the right end, the Lot's fence and the kei truck. **Mikan sits on the gatepost at a height set by Clout**, with one small Clout stamp beside them. Crew ex-Rivals sit on the Bell fence around Mikan.
- **No header bar, no rank labels, no footer text.** Phase is the light; rank is the height; Clout is Mikan's seat.
- **Name pills appear only on the Nemesis (and the arc lead) and on the focused cat.**
- **Parallax:** three layers (backdrop, wall, foreground weeds and crates); 2–4 px drift on focus change (off under Reduce Motion).

### 2.3 Wireframe — default framing (1080p)

```
+------------------------------------------------------------------------------------+
|   . . haze: Arcade awnings . . harbour . .  lighthouse /\  (unlit, empty perches)  |
|                         ~ ~ sea ~ ~ ~ ~ ~ ~ ~ ~ ~        (Dusk gold light)         |
|  ___________                                                                       |
| |  DAIFUKU  |  <- sits like a loaf, blocks the sky                                  |
| |   (zz)    |______________                                                         |
| |###########|  CAPT   CAPT  |         ~~~ telephone wire ~~~  (roamer) (roamer)    |
| |###########|  (sneer) (nod)|____________                                          |
| |###########|##############|  T5   T4    |________                                 |
| |###########|##############| (glare)(yawn)| T3   T2 |_________                       |
| |###########|##############|##############|(wary)  |  T1     |       __            |
|<.. paw prints (Away)       |  ~storm~ <---+---------|-[THORN]-|      |  | (Clout)    |
|  ..                         \_ scribble glares right at Mikan ->      |MI| gatepost  |
|____________________________________________________________|________|KA|__________|
|      [crate]        [crate]                                  Bell fence: ex-Rivals |
|     (Humbled)      (empty)      <- Undermark: one per held Patch       |N |  truck  |
+------------------------------------------------------------------------------------+
   only pills: the Nemesis (THORN) and the focused cat (none focused yet)
```

### 2.4 Cats and states

**One disposition pose per cat** (DR-39), Nemesis data, each a distinct silhouette at ≈ 120 px tall:

| Pose (example set; Nemesis owns the mapping) | Reads as |
|---|---|
| Glare, hackles up | Bitter: high Grudge |
| Side-eye, tail lashing | Wary |
| Yawn, back turned | Indifferent |
| Upright nod toward Mikan | High Regard |
| Nose to the sky, paws tucked | Under truce (Nose-Touch) |

| State | Mark |
|---|---|
| **Nemesis** (the slot holder, and the arc lead) | Scribbled storm mark aimed at Mikan's seat; its size follows Grudge |
| Bitter (high Grudge, no slot) | Pose only |
| Restless (Humbled resident) | Crate rattles; puffed tail |
| Wavering (Crew; not reachable in the slice) | Turned away on the Bell fence |
| Loot held | Fish stamp |
| Feud between two Rivals | Chalk scratch between them; both turned away |
| Raid intent known | Small paw-arrow stamp toward the target Patch |
| Promoted / new arrival overnight | Paper-tape star on the perch for that day |
| Silhouette Scars | Visible on the model (ear notch, folded ear, kinked tail, puffed tail, cowlick, head plaster) |

### 2.5 Focus and interaction

| Input | Result |
|---|---|
| Stick / D-pad / mouse hover | Spatial focus between cats (Away paw prints and Undermark crates are focusable) |
| Focus | The cat lifts 4 px, gets a Bell-Gold rim and a name pill; the **Standoff name-card component slides up** from the bottom edge: slanted Clowder banner, portrait, claw-mark rank pips, personality icon, Grudge and Regard moods, the 5-stamp Memory strip |
| South | Full Rival card (§3) |
| North | **Last night** replay (if there was a wall event) |
| View (hold) / Tab | Legend: rank words, pose meanings, state marks |
| L2 / R2 | **Look up the hill**: the camera pulls back to the whole-town backdrop and returns. In the slice only the Lane is populated; the rest is the hazy climb |
| East / Esc | Close, back to where it was opened |

**Last night replay.** After a wall event (one per district every 2–3 nights, DR-43), the first opening of the Fence Line plays the change: **≤ 5 hops**, each cat leaping between perches, with one-line captions in a slim paper strip at the bottom ("Goma took the Thorn's old perch"). Skippable with any button; Reduce Motion shows a static before/after list instead.

### 2.6 Acceptance

1. **Screenshot test:** a 1080p capture of the Lane with no text except the Nemesis pill lets 4 of 5 no-briefing viewers say who is the boss, who hates the player, and where the player sits.
2. 100% of tracked slice cats (≤ 12) fit the default framing without scrolling.
3. Opening the Fence Line from the street takes ≤ 300 ms to first interactive frame; the clock is paused while open.

---

## 3. The Rival card

### 3.1 Purpose

Everything the player knows about one Rival, presented as a cat with a history, not a stat block. Opened from the Fence Line, the Verdict (North) and the Sniff.

### 3.2 What it shows (and what it never shows)

| Shown | How | Owner |
|---|---|---|
| Name, Title, Clowder | Slanted banner, emblem | Nemesis |
| **Personality** | The cat's animated idle in its personality set, large; icon + name; one line "As a Rival" (e.g. "Loud; comes back fast for revenge") | Nemesis (brief §3.5 shape) |
| Rank | Claw-mark pips; former rank as a faded pip | Nemesis |
| **History (Memory)** | Stamp strip of up to 6 pinned entries, then the rest (≤ 10): each a pictogram stamp (Routed by you, Routed you, Ambushed, Humbled, Chased Off, Nose-Touched, Lick In, Spray over its mark) + one cat-voice line ≤ 60 characters + the day | Nemesis |
| **Grudge** and **Regard** | Two 4-step moods as pictograms: Grudge = hackles (smooth → bristled → arched → storm); Regard = ears (back → level → forward → nose-out). **No numbers, no bars** | Nemesis |
| Nemesis / Bitter | Storm mark around the portrait / glare pose | Nemesis |
| **Strengths** | Known Strengths as stamps; unknown as a "?" stamp. Line: "If recruited: always-on signature perk" under the Strength | Nemesis chooses, Combat values |
| **Fears** | Known Fears as stamps (Water, Loud Noise, Cucumbers in the slice); unknown "?" | Nemesis chooses, Combat values |
| Scars | Silhouette on the portrait; listed as small icons | Nemesis |
| Relative threat | Paw-print size versus your Posse: smaller / even / bigger. **No level numeral on Rivals** | Derived from Crew's Power Rating |
| **Old Score** | Portraits of your Crew cats who have Routed it or been Routed by it | Nemesis / Combat |
| Recruit openness | A gate stamp: open ("would hear an offer") or shut. Derived from Nemesis's availability gate (DR-09) without exposing the numbers | Nemesis |
| Sting contour | The Rival's 2-bar yowl-sting as a drawn contour (deaf/HoH learnability, DR-54) | Audio / Art |

Never shown: Grudge or Regard numerals, recruit thresholds, AI weights, combat values of traits.

### 3.3 Wireframe

```
+--------------------------------------------------------------------------+
| /=[ (sage) THE FIRST THORN   "the Soggy"   /  ]=\       claw: /          |
|                                                                          |
|  +------------------------+   PERSONALITY                                |
|  |                        |   [Braggart icon]  BRAGGART                   |
|  |    (animated idle:     |   "Loud. Comes back fast for revenge."       |
|  |     chest out, tail    |                                              |
|  |     high, kneading)    |   GRUDGE  [arched]     REGARD  [ears back]    |
|  |   ear-notch scar ->    |   ~~storm~~ your Nemesis                      |
|  +------------------------+                                              |
|   threat: (paw)(PAW) bigger       sting: _/\_/\__/^\_                    |
|                                                                          |
|  STRENGTHS  [Iron Chin]  [?]      -> if recruited: always-on perk        |
|  FEARS      [Water]  [?]                                                 |
|  OLD SCORE  [old wall cat]  "Still owe you for the gutter."              |
|                                                                          |
|  HISTORY  (pinned)                                                       |
|  [Routed] D1  "You knocked me off my own wall."                          |
|  [Ambush] D3  "From the roof? Coward."                                   |
|  [Spray ] D3  "My post smells of bell."                                  |
|  ...                                                                     |
|  gate: [shut]                    (East) back    (L1/R1) prev/next cat    |
+--------------------------------------------------------------------------+
 (all names, lines and traits illustrative; Nemesis owns them)
```

---

## 4. The Verdict

### 4.1 Purpose and rules

After the Posse Routs a tracked Rival in a won fight, **one full Verdict per fight**, for the highest-rank tracked Rival (DR-42). Other Routed tracked cats **slip away**: their silhouettes slink off at the ring edge with a "slipped away" stamp before the cards fan in. The clock is paused; the prompt cannot be dismissed (Pillar 4: a Rival fight always ends in a choice); pause (Options only) stays reachable.

### 4.2 The compass (kept from draft 1)

Fixed directions with mnemonic meaning, forever: **Up = Nose-Touch** (lift them up), **Down = Humble** (put them beneath you), **Left = Chase Off** (out of the frame), **Right = Recruit** (over to your side).

- 500 ms input lock as the cards fan in (drains attack mashing).
- **No default focus.** A direction raises a card; holding South for 600 ms commits (press-then-confirm alternative).
- **Preview poses on the raised card,** one tell per direction so tells never collide (UX-X9): Up shows the Rival's **ears** (the Nose-Touch acceptance band, Nemesis's seeded roll); Right shows **eyes tracking the Bribe and a forward lean** (the starting Loyalty band); Left and Down show the **tail** (return or uprising risk). Mikan previews too: turns away (Chase Off), sits tall over the Rival (Humble), tail-beckon (Recruit), leans in (Nose-Touch).
- Each card: what happens now, what it risks later, ≤ 3 short lines, no numbers except the Bribe.

| Card | Copy (system text; final wording by Narrative) | Availability |
|---|---|---|
| **Nose-Touch** (Up) | "Offer respect. They may accept. They keep their post: 5 days of truce." | Always offered |
| **Humble** (Down) | "They stay on the crate and pay. They simmer unless the Patch is guarded." | Only when the fight's Patch will become yours (DR-46); otherwise halftoned: "Not your Patch to keep." |
| **Chase Off** (Left) | "Gone from the Lane. They'll come back changed." | Always |
| **Recruit** (Right) | "Joins your Crew with everything it remembers." + the **Bribe row** | Nemesis gate (DR-09); shut gate shows "Too bitter to join." / Boss: "Daifuku doesn't rate you yet." |

### 4.3 The Bribe row (Recruit raised)

Raising Recruit opens a 3-step row inside the card: **None · Fair · Feast**, each showing the Morsel price (Crew's formula) and the **starting Loyalty tier** it would produce (Crew's L0, shown as a tier word: "starts Aloof", "starts Steady"). The Stash count sits at the end of the row. A step the Stash cannot cover is halftoned ("Stash short: 72 of 96"). Life 1 recruits are free: the row shows "Free" and the fixed tier. The Rival's lean and eyes respond as the player moves along the row.

**Full Crew (cap 6):** the card reads **"Recruit — make room"**. Committing opens a strip of **Lounging** cats to release (posted and Posse cats are not listed). Each shows its Loyalty tier; **Loyalty ≥ 60 (True/Sworn) shows "Clean parting"**; below 60 shows "Leaves bitter (as if Chased Off)" (DR-34). Release then Recruit is one confirm. Nobody is deleted.

### 4.4 Wireframe

```
+--------------------------------------------------------------------------+
|              (camera low two-shot; Thorn flattened in the dust;          |
|               HUD hidden; slipped-away silhouettes already gone)         |
|                      .----------------------------.                      |
|                      | (Up)  NOSE-TOUCH           |                      |
|                      | Offer respect. They may    |                      |
|                      | accept. 5-day truce.       |                      |
|                      '----------------------------'                      |
| .------------------------.                     .------------------------.|
| | (Left)  CHASE OFF      |    (Thorn: ears,    | (Right)  RECRUIT       ||
| | Gone from the Lane.    |     eyes, tail      | Joins with everything  ||
| | Comes back changed.    |     react to the    | it remembers.          ||
| '------------------------'     raised card)    |  None | FAIR | Feast   ||
|                                                |   0   |  24  |  48     ||
|                      .----------------------------. Aloof|Steady|Steady ||
|                      | (Down)  HUMBLE             | Stash 61    Crew 3/6 ||
|                      | Stays on the crate, pays.  '------------------------'
|                      | Simmers unless guarded.    |                      |
|                      '----------------------------'                      |
|   (N) Their card                         Hold (S) to decide  ( o  )      |
+--------------------------------------------------------------------------+
```

### 4.5 Flow

```
Rout (Combat) -> slipped-away beat (<=1 s) -> HUD hides -> 500 ms lock
  -> four cards, no focus
     |- direction: card raises, preview poses play
     |    '- Right: Bribe row (or make-room strip)
     |- North: Rival card -> East returns, same focus
     '- hold South 600 ms on a raised available card
          -> VerdictChosen -> Nemesis -> VerdictApplied
          -> payoff animation 2-3 s (skippable after first sight of each type)
          -> encounter tally -> roaming
```

**Loss:** no Verdict. The victor's **Gloat (≤ 3 s)** reuses the name-card (taunt + any new Title from Lick In), then Mikan slinks home (DR-19). **First Verdict ever:** one hint line under the title, "Nobody is gone for good. Choose what they become." No option is locked for teaching.

---

## 5. The Turf Board (the whole management surface)

### 5.1 Purpose

The Lot's territory screen and the **only map-like view and only place territory numbers appear** (DR-47). With the Sniff forecast and the Doorstep pile it is the entire management surface (DR-46). One daily decision: **who guards which Patch tonight, given the forecast and their personalities.**

Framing: the view from the kei truck roof. One painted terraced strip of Hidamari Lane with **5 Patch stamps at fixed positions**: the Den (Daifuku's wall), Low Wall Corner (Home Ground) and three outer Patches (slice placeholders "Gatepost", "Laundry Poles", "Bathhouse Back"; names owned by Territory/Level).

### 5.2 What each Patch shows

| Field | Display |
|---|---|
| Keeper | Clowder emblem + Keeper portrait (Rival or Mikan's Bell) |
| **Scent** | Wisps in the Clowder colour **and the number 0–100**, with a tick at **60 (Strong)** |
| **Raidable** | Below Strong: a cracked wisp stamp. "Only Patches below Strong can be taken" is the legend line |
| Sentry slot | Empty post outline, or the posted cat's portrait with its **personality icon** and the **automatic Style role stamp** |
| Warden | The Den's first Sentry slot; locked badge until the Den is held; requires True+ Loyalty |
| Undermark | Crate icon if a Humbled resident lives here; Restless rattle if near uprising |
| Raid forecast | Paw-arrow from the raider's portrait, "tonight" stamp; **motive icon only if a Schemer is posted in the district** |
| Tribute | Tomorrow's Morsels from this Patch, with modifiers as small stamps (+15% Humbled, +10% Braggart) |
| Den state | Locked / Open (3 of 4 outer held) / Claimed; while the Den is Open, held outer Patches show a shield: "Can't be lost while the Den is open" |

**Footer:** tomorrow's Tribute total · flat upkeep (auto-paid) · net · Stash · Sentry slots used (x / 2).

### 5.3 Wireframe

```
+--------------------------------------------------------------------------+
| TURF BOARD - Hidamari Lane                       Sentries 1/2   (L1 R1)  |
|   (painted terraced lane, Dusk light; the sea at the bottom edge)        |
|                                                                          |
|     [DEN: Daifuku's wall]                                                |
|      (sage) Daifuku   ~~~~ 88   [Warden: locked]   Den: OPEN (3/4)       |
|                                                                          |
|            [Laundry Poles]               [Bathhouse Back]                |
|            (bell) ~~~ 72 Strong           (bell) ~~ 54 cracked!          |
|            post: [Goofball|Bruiser]       post: [ empty ]                |
|            Tribute 14 (+crate 15%)        Tribute 9                      |
|                                              ^                           |
|                                              | <== [Goma] RAID tonight   |
|   [Low Wall Corner - Home Ground]   [Gatepost]                           |
|    (bell) ~~~~ 91                    (bell) ~~~ 66                       |
|    Tribute 12                        Tribute 11                          |
|                                                                          |
|  CREW  [Stalwart] [Fraidy] [Braggart]* [Brooder] [Schemer] [Goofball]    |
|         lounging   posse    lounging    posse     posse     posted       |
|                                                                          |
| Tomorrow: Tribute 46  - upkeep 6  = 40      Stash 61                     |
| (S) pick up cat  (N) cat card  (W) unpost  (View) legend   (E) leave     |
+--------------------------------------------------------------------------+
```

### 5.4 Posting flow

1. **Pick up** a Crew portrait: mouse drag, or South on a portrait (pad/keys). Posse cats and Lounging cats are both pickable; a Posse cat posted leaves the Posse (one assignment per cat: Posse, Posted or Lounging; Assumption A-2).
2. **Carry:** the stick/D-pad snaps between Patch stamps. Hovering a Patch shows the **drop preview card** beside it:
   - Style role (automatic) and the personality's guard perk on this Patch, in one line ("Fraidy: weak defence, raises the Caterwaul early").
   - Tribute delta (Braggart "+10% here").
   - **Social pairs:** a heart-link line to a bonded cat posted in the district (+1 Loyalty each per night) or a crossed-claw line to a clashing one (−1 each per day). In the slice every posting is in the same district, so this always applies.
   - **Loyalty reaction:** the cat's like/dislike if triggered (a Braggart taken out of the Posse shows a cloud: "Benched? Me?" after 2 days; a Brooder moved off a post shows a cloud).
   - Gate: the Warden slot rejects a cat below True with "Needs True loyalty."
   - Forecast fit: if the Patch is forecast for a raid, a one-line verdict from Territory's raid defence ("Good against the Thorn" / "Will struggle") as a pictogram scale.
3. **Drop** with South (or release the mouse). The cat walks off the Lot toward the Patch in the diorama. East cancels.
4. **Unpost** with West on a posted Sentry (Brooder dislike warned in the preview).

**Field posting** (Territory §3.6): after a **Claim Spray or a won raid defence**, a compact strip of Lounging portraits offers "Leave someone here?" with the same drop preview, one press. Never after an ordinary Spray.

### 5.5 States and unlock

| State | Behaviour |
|---|---|
| Life 1 | Tab hidden; the Lot shows Crew only |
| Life 2 day 2 (first visit) | Opens with a hint card on the forecast Patch: "Raids only take weak Patches. Guard it, or Spray it Strong." |
| No raid forecast | Forecast row empty; the posting decision is about Tribute and Loyalty |
| Patch lost overnight | Stamp flips to the raider's emblem with a torn-paper edge; preview line: "Take it back: a Standoff with the raid leader" |
| Not at the Lot | Turf Board unavailable (management stays at the Lot); street shows wisps only |

---

## 6. Crew roster, Posse and Lessons

### 6.1 Crew roster

Six cats at most (cap 6). Each is a large tile with the cat **animated in its personality idle** (the first thing seen), the personality icon and name, its Style icon, and its assignment. Lines between tiles show **social pairs** whenever the roster is open: heart-link for bonded, crossed claws for clashing. Pom states: **"!" = a Lesson or Instinct Move is available**; **cloud = sulking** (a Loyalty dislike fired recently).

```
+--------------------------------------------------------------------------+
| CREW 6/6                                     (L1 R1) tabs   (E) leave    |
|                                                                          |
|  +-----------+   <3   +-----------+        +-----------+                 |
|  | (sits in  |--------| (peeks    |        | (chest    |                 |
|  |  front,   |        |  from a   |   X    |  out,     |                 |
|  |  braced)  |        |  crate)   |--------|  prancing)|                 |
|  | STALWART  |        | FRAIDY    |        | BRAGGART !|                 |
|  | old wall  |        | Friend    |        | the Thorn |                 |
|  | cat       |        | Stray     |        | (ex-Rival)|                 |
|  | Bruiser   |        | Yowler    |        | Scrapper  |                 |
|  | POSSE <   |        | POSSE v   |        | lounging  |                 |
|  +-----------+        +-----------+        +-----------+                 |
|  +-----------+        +-----------+        +-----------+                 |
|  | BROODER   |        | SCHEMER   |        | GOOFBALL ~|  ~ = cloud      |
|  | ...       |        | ...       |        | posted:   |                 |
|  |           |        |           |        | Laundry P.|                 |
|  +-----------+        +-----------+        +-----------+                 |
|  <3 bonded   X clashing    (S) open card   (W) Posse builder             |
+--------------------------------------------------------------------------+
 (who is which personality is illustrative; Crew/Nemesis assign one per personality)
```

### 6.2 The Crew card (One Cat Card, Crew variant)

Top half is personality; bottom half is the build.

| Area | Content |
|---|---|
| **Personality panel** (largest) | Animated idle; icon and name; three one-liners in the brief §3.5 shape: **Fights like** · **On guard** · **Likes / dislikes**; bonds with / clashes with (portraits of Crew who match) |
| Loyalty | **Tier word** (Shifty / Aloof / Steady / True / Sworn) on a 5-segment tier bar with the current tier lit, no numeral, plus **what it opens**: "Can be taught" (Steady+), "Can be Warden" (True+). Recent change shown as a heart pop or cloud with its cause ("Shared a Morsel", "Benched 2 days") |
| Style and level | Style icon; level (Assumption A-1); XP pips |
| Moves | 4 slots: icon, name, Paw cost, Set-up/Pay-off mark |
| Signature perk | Ex-Rivals only: their Nemesis Strength, now always on. Strays have none |
| History | Ex-Rivals keep their Memory strip, Scars and Title; Old Score marks against current Rivals |
| Assignment | Posse (with its D-pad slot) / Posted (Patch) / Lounging |
| Zoomies | Its Style Zoomies (read-only) |

### 6.3 Posse builder

At the Lot: Mikan is fixed on **Up**; three slots on **Left / Down / Right** match the D-pad switch and the combat plates (`hud.md` §4.1). Slots unlock as recruits arrive; four cats by Life 2 day 2 (DR-01).

Each slot shows the cat's personality icon, Style, Moves. The builder draws **bonded pair links** ("stronger Tag-In between these two") and **clashing warnings** ("−1 Loyalty each per day together"). A posted cat placed here leaves its post (confirm shows the Patch it vacates).

**Away from the Lot: Tail-Up only** (DR-38, PP-31). D-pad Left/Right in exploration opens the compact picker; only Lounging cats appear selectable; posted cats are halftoned: "On guard at Gatepost. Change at the Lot." Not usable inside Haru's wall. There is no Posse editing from the pause menu.

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
3. **No locked choices for teaching.** The Verdict offers all four; outcomes are never scripted (DR-41).
4. **The home teaches nothing with text.** Home verbs are taught by prompt pictograms and Haru's staging.
5. The order is ruled: Narrative owns the K beats, Combat owns what is taught, UX owns this sheet.

### 7.2 First 15 minutes (DR-22)

| Time | Beat | New verb / element | How it is taught | Success check |
|---|---|---|---|---|
| 0:00–0:04 | **K1.1 The Box in the Rain.** Haru **hums** (not the Call). | Camera orbit (right stick) at the very end | The kitten looks up at the yellow raincoat; a stick pictogram fades in once | Player orbits |
| 0:04–0:05 | The garden | **Move**, **Jump/Hop** to the low wall (South) | A butterfly lands on the wall; South glyph on first approach | Reaches the wall |
| 0:05–0:06:30 | A crow on the path | **Swat / Attack** (West): the 3-hit string | West glyph as the crow lands; the third hit's finisher gets its T2 burst | Crow hit |
| 0:06:30–0:08 | The crow dives | **Skitter** (East) on a white telegraph | Slow first dive; white ring decal + East glyph | One Skitter |
| ≈ 0:08–0:10 | **The old wall cat**: "Use your whiskers, Collar." | **Whisker Sense** (R2 hold): trail and compass ring | The cat says it; R2 glyph; the trail leads to the cat's spot | Follows the trail; **first story recruit joins** (free) |
| 0:10–0:11 | Two Strays in the lane | **Switch** (D-pad Left to the wall cat, Up back to Mikan) | The wall cat gets cornered; its plate pulses with its D-pad glyph | One switch |
| 0:11–0:12 | | **First Paw** fills | Paw pip pops with a bell tick; hint "Paws buy Moves" | — |
| 0:12–0:13 | | **Slow Blink** (R2): choose a Move | Slow Blink opens itself once the first time a Paw fills, with the menu cursor on Move 1 | One Move used |
| 0:13–0:14 | | **Command the other cat** (L1/R1 in Slow Blink) | The wall cat's "can act" bell lights; hint "L1/R1: other cats" | One commanded Move |
| 0:14–0:15 | Last Stray | **Frazzle → Quick Pile-On** (North) | Frazzled ring on the last enemy; dust-pom prompt; hint card "North: PILE-ON" | **Two-cat Pile-On** (slice test: by minute 15) |

### 7.3 The rest of the first hour (Life 1, days 1–2)

| ≈ Time | Beat | New verb / element |
|---|---|---|
| 0:15–0:17 | Low Wall Corner, scripted short escalation: 1 Rub, 1 Counter-Spray on the rival mark | **Rub** (a `seen` visit), reading **scent wisps** |
| 0:17–0:19 | One wave, then the Keeper | **Hiss** on the Keeper's **yellow** telegraph (Hiss pom glows; North glyph) |
| 0:19–0:20 | A Tough at low Nerve in the wave | **Back Down** (Hiss at ≤ 15%): the Tough bolts. Hint after, not before |
| 0:20–0:21 | The post is below Strong | **Spray** (North): **Patch claimed**, Life 1 turf goal met; Patch tag flips to the Bell |
| 0:21–0:24 | **The First Thorn Standoff** (name-card, sting contour) | **Brace** (R1 hold) against its string; normal interruptible flee (DR-41). If Routed, the first Verdict happens here (see §7.6) |
| 0:24–0:25 | Sunspot | **Nap**: the **phase dial** jumps half a phase; heal |
| 0:25–0:27 | Dusk chime, the lamp wave; **K1.3 The first Call** | **Call glyph**; **Head Home** thread (D-pad Down hold) |
| 0:27–0:30 | Evening at home; sleep | Home verbs by pictogram (Eat, Rub, Lap, Meow); Bond hearts |
| 0:30–0:31 | **Day 2 Doorstep**: the first 1-item Sniff ("the Thorn waits at the gatepost") + first Tribute | **Doorstep Sniff**, the pile |
| 0:31–0:32 | The Lot (Crew tab only) | **Crew card**: personality front and centre for the old wall cat |
| 0:32–0:38 | **The Thorn at the gatepost**: memory-citing Standoff line, unskippable for 1 s | **Tag-In** (spark ring + plate glyph pop; hint on the first two windows) |
| 0:38–0:40 | Thorn Routed | **First Verdict** (all four; Humble legal only if the gatepost becomes yours) |
| 0:40–0:45 | The second story recruit joins | Posse of three; **Relay** happens if it happens (not taught by card) |
| 0:45–0:52 | Free roaming, 2–3 fights | Practice; no new verbs |
| 0:52–0:57 | Dusk, home, **K1.4** (Life 1 Closing); sleep | Life 1 ends (turf goal, day 2 ≥ 2, Closing played) |
| 0:57–1:00 | Montage 1→2; **Life 2 day 1** Doorstep: the 3-item Sniff | **Fence Line** reveal: "(N) See the wall" from a Sniff card |

**Slice tests covered:** two cats and a Pile-On by 0:15; first memory-citing Rival line at ≈ 0:32 (target < 1:00, 100% of testers).

### 7.4 Life 2: one headline per day (DR-22, DR-23)

| Day | Headline teach | Also switching on |
|---|---|---|
| Life 2 day 1 | **Ambush** (from the High Road, Pounce opener; and the Rival yowl-sting with the Skitter/Brace counter) | Fence Line, 3-item Sniff |
| Life 2 day 2 | **Sentries and the Turf Board** (one posting decision) + **Share a Morsel** | Posse of 4; K2.3 the cat flap → **Night** |
| Life 2 day 3 | **Lessons** (Rank I) | First raid forecast in the Sniff (scripted from the arc lead); the night raid resolves |
| Life 2 day 4 | **Props and Fears** (bucket, scooter horn, cucumber junk) | **Zoomies** (the gauge has been filling; the hint fires the first time it is full); the one Caterwaul |
| Life 2 day 5+ | Daifuku: "knock him off into the bucket" | No new verbs |

### 7.5 First-hour acceptance

≥ 80% of first-hour testers, unprompted, have: used Slow Blink, commanded the second cat, performed a Pile-On, Sprayed, given a Verdict, and gone home when called. Hint cards dismissed without the action (a teaching failure signal) are logged per beat.

### 7.6 Edge cases

| Case | Handling |
|---|---|
| The Thorn is Routed on day 1 | The first Verdict moves to 0:24. If Chased Off or Humbled, it is still the day-2 returner (DR-41) and its gatepost line cites the Verdict. If Recruited or Nose-Touched, Nemesis supplies the memory-citing line from the new relationship (Recruit bark at the Lot / a truce greeting at the gatepost) so the < 60 min test holds |
| The player loses a Life 1 fight | Gloat ≤ 3 s; Mikan slinks home; nothing lost in Life 1; Haru's plaster |
| The player skips the old wall cat's trail | The cat walks to Mikan after 60 s; the recruit is not optional |
| Slow Blink's self-opening collides with a telegraph | It waits until no telegraph is live within 3 m |
| Player ignores Dusk | Drowsy at end of Dusk, 1-minute grace, then the thread walks Mikan home (DR-15) |

---

## 8. Assumptions for creative-director review

- **A-1 Numbers.** Read "the Turf Board is the only place numbers appear" as governing territory, nemesis and Loyalty values. Currency counts appear where spent (Bribe row, Lessons, Share a Morsel, Stash) and Crew levels appear on Crew cards. If the strict reading is intended, Bribe steps become fish-pile sizes and levels become pips.
- **A-2 One assignment per cat** (Posse, Posted or Lounging); posting a Posse cat removes it from the Posse. Territory and Crew to confirm.
- **A-3** The slice's three outer Patch names are placeholders.
- **A-4** Disposition pose set in §2.4 is an example; Nemesis owns the mapping from Grudge/Regard to pose.

---

## Backlog (post-slice)

- Full-game Fence Line: L1/R1 scrolling between district stretches, the populated whole-town zoom with Botan on the lighthouse perch (UX-3.1).
- Full-game Turf Board: multi-district bands, more Sentry slots, Roof Run hooks.
- Wavering/Turncoat presentation on the roster and Fence Line (Life 3+).
- Comes Knocking presentation.
- Watching (Lesson route), Knacks slots, Home Moves, Repertoire view beyond the slice.
- Botan's Verdict (Humble / Nose-Touch only; the hand-bell).
- Life 8 and Life 9 screens (Carries, the heir).
- Per-screen split of this doc after the slice build.
- One-handed presets.
- Kits, Wall Watch, Usurper on the Fence Line.

## Revision Log

**2026-11-23, round 2 (fresh slice rewrite; issues from `design/reviews/round-1/ux--art-direction.md` and director-rulings Part 2 §8).**

| ID | Status | How |
|---|---|---|
| UX-1 | FIXED | All prompts use DR-08 (`hud.md` §8). |
| UX-3 | FIXED | §2: one continuous painted panorama; Toughs on the wall, Undermark crates for Humbled residents, Away paw prints, ex-Rivals on the Bell fence, Mikan's seat by Clout; no header, labels or footer; pills on Nemesis and focus only; name-card slide-up; seat states; ≤ 5-hop replay; screenshot test. Old-Timers and First Captain REJECTED (cut, DR-44). Full-town scroll to Backlog. |
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

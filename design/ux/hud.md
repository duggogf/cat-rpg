# HUD Design — Cat RPG (vertical slice, round 2)

*Owner: ux-designer · Date: 2026-11-23 · Status: round-2 slice rewrite (the first draft is archived at `design/backlog/first-drafts/hud.md`)*
*Canon: `design/creative-brief.md` v1.2 and `design/reviews/round-1/director-rulings.md` (DR-xx). Where this doc and a ruling disagree, the ruling wins and this doc is wrong.*
*Companions: `design/ux/key-screens.md` (Fence Line, Rival card, Verdict, Turf Board, Crew, onboarding) and `design/accessibility-requirements.md` (the project-wide floor every element here must meet).*

**Scope.** The slice HUD for the three contexts of Lives 1–2: **street** (exploration), **combat** and **home**, under the **third-person camera behind the cat** (brief §4.1, DR-48). It also holds the **control map** (DR-08; UX owns the map, Combat owns the actions). It does not define any system rule: every value shown here is read from the owning system.

---

## 1. Overview and philosophy

There are three HUDs because there are three ways of being a cat:

- **On the street, the world is the interface.** Scent wisps on the Scent Post, the sun over the roofline, a Rival's posture. The screen holds one small dial and nothing else unless asked.
- **In a brawl, the HUD is a conductor's score.** The player directs four cats; the HUD may be dense, but it lives in the **corners**, keeps the **bottom-centre clear**, and puts the stagger decision **on the enemy**, where the eye already is.
- **At home, there is no interface.** No panels, bars, numbers, clocks or system text inside Haru's wall. Pictograms only (hearts, Sense Icons, the Call glyph), plus one licensed exception: the Doorstep Morning Sniff (DR-24).

The HUD **falls away at the garden wall over 800 ms** and returns when Mikan crosses it outward. That disappearance is a designed Pillar 2 beat, not a side effect.

**Rule of Necessity.** An element earns its place when (a) a cat could perceive the thing it reports, (b) the player would decide worse in the next five seconds without it, and (c) the world, animation or sound (with a visual twin) cannot carry it.

**Two vetoes above the rule:**
1. **Language veto (brief §5.6).** No HUD element, caption, tooltip or accessibility aid renders, translates, paraphrases or summarises a human utterance or human writing. Haru's name never appears as text.
2. **Home veto (DR-24).** Inside the wall: pictograms only, except the Doorstep Sniff.

**Visual language.** Art bible "paper goods": opaque flat-print panels (no translucency, no gradients, no glossy bubbles, no brown name pills), Aubergine Ink outlines, halftone as the only disabled/tone treatment (contrast ≥ 3:1, DR-51), focus = Bell-Gold fill plus a 2-frame squash. Text floor **28 px at 1080p / 18 px at 720p** for every glyph-bearing element (DR-51). Visual style decisions are Art's; this doc fixes positions, priorities and behaviour.

---

## 2. The camera and the frame

Third-person, behind and above (DR-48): explore ≈ 3 m back / 1 m up; combat pulls to ≈ 6–8 m to frame the controlled cat and its lock target; Slow Blink lifts to a tactical three-quarter view; home is the same camera at 0.3–0.6 m.

Consequences for the HUD:
- The controlled cat sits in the lower-middle of the frame and is large (≈ 10–20% of screen height exploring). **The bottom-centre band (middle 40% width, bottom 25% height) is a permanent keep-out** for screen-anchored elements; it belongs to the cat, hint cards and accessibility cues.
- The **centre 40% of the screen** never holds a persistent screen-anchored element.
- The old top-down "ring under the corner panels" problem (UX-2.1) is moot: the ring is now in depth, ahead of the camera. The corners are genuinely free.
- **Edge arrows** (Combat/Camera own the rule) point to off-screen Posse cats (bell-gold, with the cat's D-pad glyph) and off-screen attackers (Clowder colour, with a halftone pulse when a telegraph is winding up).

### 2.1 Zone map (all contexts)

```
+--------------------------------------------------------------------------+
| TL  status tag zone          TC  identity ribbon          TR  phase dial |
|     (Patch tag, Caterwaul        (named Rivals only,          (street    |
|      flare)                       combat)                      only)     |
|                                                                          |
| EDGE RING: edge arrows, Ambush sting flare, Call glyph (street)          |
|                                                                          |
|                     . . . centre 40%: no persistent HUD . . .            |
|                                                                          |
|                                                                          |
| BL  Posse plates (combat)     BC  KEEP-OUT: hint cards,     BR  Zoomies  |
|     Slow Blink menu               Head Home prompt,            pom,      |
|     shortcut diamond              accessibility cues           tallies   |
+--------------------------------------------------------------------------+
```

**Draw order** (back to front): world → VFX and dust → glyph bursts and lettered words → enemy outlines and telegraph decals → overhead bars, Frazzle ring, lock mark → controlled-cat marker → damage numerals → screen-anchored panels. A screen-wide effect never draws over the last four.

---

## 3. Street (exploration) HUD

### 3.1 Elements

| Element | Zone | Shows | Visibility | Owner of data |
|---|---|---|---|---|
| **Phase dial** | TR, 48 px at 1080p | Sun pom over a roofline; no digits; moon-blue at Night | **Always while roaming** (setting: Always / Contextual / Off). Enlarges for 4 s at phase change and through the last 60 s of a phase. Hidden in combat, at home and whenever the clock is paused (DR-24) | Clock |
| **Patch tag** | TL | Patch silhouette stamp, Keeper's Clowder emblem, 1–4 wisps. **No number** (DR-47) | 3 s on entering a Patch; dropped if a fight starts | Territory |
| **Caterwaul flare** | TL + edge arrow | Distress-yowl pom, Patch stamp, **shrinking ring = time left** | While the raid is defendable; current district only (DR-17) | Territory |
| **Ambush sting flare** | Edge ring, direction of the attacker | Jagged pom + a 2.0 s draining arc; the last 0.75 s turns Ink (the Skitter/Brace window) | During a Rival Ambush (DR-36) | Combat |
| **Call glyph** | Edge ring toward the singer | Three smooth Haru-Yellow arcs drawn as the Call's contour, Ink-outlined | When the Call sounds (always on; DR-54) | Audio / Narrative |
| **Head Home prompt** | BC (just above the cat) | Bell-gold paw on a thread + D-pad Down hold glyph | First 4 s after the Dusk Call, and while drowsy | Day loop |
| **Interact prompt** | World-anchored at the object | North / E glyph + a verb pictogram (Spray puff, Sniff nose, Nap zZ) | In range; Spray only when the post is below Strong (DR-18) | Territory / Day loop |
| **Tail-Up picker** | BL, compact portrait poms | Lounging cats only; posted cats halftoned with a guard-post stamp | D-pad Left/Right pressed (DR-38) | Crew |
| **Pickup tick** | TR under the dial | Fish icon + count (Morsels), shiny icon (Shinies) | 1.5 s, merged within 500 ms | Economy |
| **Bark balloon** | World-anchored over the speaking cat | Readable cat speech ≤ 60 characters, Clowder-colour tab with emblem, three-pom tail | One at a time | Nemesis / Narrative |

### 3.2 Whisker Sense (R2 hold / Tab hold)

The world desaturates; scent trails glow; the **scent compass ring** sits on the ground around Mikan (world-anchored, not screen) with up to 6 ticks: rival marks (Clowder emblem), Rivals (rank claw-marks), hidden finds (sparkle). Scent Posts in view show their wisps brighter. The phase dial enlarges. Nothing else appears. Not usable in combat (DR-08).

### 3.3 Wireframe — street, roaming

```
+--------------------------------------------------------------------------+
| [Low Wall Corner stamp ~~~ (Wall Sitters)]                    (sun)/\/\  |
|                                                                 roofline |
|                                                                          |
|          ~ ~ ~   <- 3 sage wisps hang at the Scent Post (in world)       |
|           |##|                                                           |
|           |##|                                                           |
|                                                                          |
|                               /\_/\                                      |
|                              ( o.o )   <- Mikan, ~15% of screen height   |
|                               > ^ <      camera 3 m back, 1 m up         |
|                                                                          |
+--------------------------------------------------------------------------+
```

### 3.4 Wireframe — street, Whisker Sense held

```
+--------------------------------------------------------------------------+
|                                                              ( SUN )     |
|                                                            /\/\/\/\/\    |
|    . . . . glowing scent trail . . . .                                   |
|                                       .                                  |
|                                        .                                 |
|                  ~ Thorn's mark          .                               |
|                                           .                              |
|                        .  -  ~  -  .                                     |
|                     (sage)  /\_/\  (sparkle)                             |
|                     .      ( o.o )      .      <- scent compass ring     |
|                        '  -  -  -  '            on the ground            |
+--------------------------------------------------------------------------+
```

### 3.5 Garden wall transition

Crossing inward: phase dial, Patch tag and pickup ticks fade over 800 ms in that order; the camera gently lowers and tightens (DR-48 allows this move). Crossing outward: the dial fades back in over 400 ms. A Caterwaul that fires while Mikan is home is **not** flared; its result comes in the next Sniff.

---

## 4. Combat HUD

Goal: under T4/T5 VFX, shake and dust, the player must always find (1) the controlled cat, (2) the Frazzle window, (3) who can act, (4) the incoming red telegraph. Everything else is secondary.

### 4.1 Elements

| Element | Zone | Shows | Rules |
|---|---|---|---|
| **Posse plates** (×4) | BL, stacked | One bean plate per cat: portrait, D-pad glyph, Nerve bar, **2 Paw pips** (partial fill visible), 1 status pom (Soggy / Cowed / Fired Up, max 1, DR-28), queued-command pom | **Fixed order by slot = D-pad order: Up (Mikan), Left (Crew 1), Down (Crew 2), Right (Crew 3).** Rows never reorder. The controlled cat's plate enlarges in place (×1.3) and gains the hiss-mouth pom. Routed cat: plate halftoned, portrait flattened, glyph struck through |
| **Hiss pom** | On the controlled plate | Hiss-mouth icon that refills over the 8 s cooldown | Glows when a yellow telegraph is live and Hiss is ready |
| **"Can act" bell** (conductor cue) | On each Crew plate | A small pad-bell lights when that cat can afford a Move (≥ 1 Paw) | The cue is the cat's D-pad direction plus the bell, not a command-button glyph (CX-C1) |
| **Shortcut diamond** | Beside the controlled plate | Four Move icons at W/N/E/S with Paw cost pips, Set-up/Pay-off mark | Appears only while L1 is held. Life 1 shows it after the first Slow Blink lesson; never shown otherwise |
| **Zoomies pom** (limit gauge) | BR | A round pom filling clockwise; Style icon in the centre; at full it bursts a crown and shows the L1+R1 / R glyph | Persists within a day; Well-Fed start shows as pre-filled segments with a small sun stamp, no status icon (DR-20) |
| **Controlled-cat marker** | World, on the cat | Bell over the head (replaces its chevron) + Combat's ground ring | One overhead mark per Posse cat: allies keep the bell-gold chevron tick |
| **Enemy overhead bar** | World, over the enemy | Thin Nerve bar + **zigzag Frazzle bar** beneath it | Shown on the lock target, on any enemy hit in the last 3 s, and on any Frazzled enemy; otherwise hidden. Handheld: non-target bars drop first |
| **Frazzled ring** | World, around the Frazzled enemy | Countdown ring over the 6 s window; on Captains and the Boss, **5 pips** that drain as the window passes (earlier Pile-On = worth more, DR-30) | No numeral, ever. Trash shows the ring without pips (Pile-On always Routs below Captain) |
| **Pile-On prompt** | World, over the Frazzled enemy | North / F glyph inside a dust-cloud pom | Appears only when the Pile-On is legal (≥ 2 standing Posse cats; trash: 2+ Frazzled within 3 m or the last enemy). **No world text**: the word "Pile-On" is taught by a BC hint card |
| **Identity ribbon** | TC | Slanted Clowder banner, name, Title, claw-mark rank pips (Tough 1, Captain 2, Boss 3), ≤ 3 known Fear/Strength stamps, storm mark if Nemesis, Old Score stamp if active. Boss: **segmented Nerve bar (3 phases)** | **Named Rivals, Captains and Daifuku only.** Strays and Crows get no ribbon. It is the Standoff name-card shrinking into place (one component) |
| **Red callout** | Docked under the identity ribbon | Telegraph pictogram (zigzag) for a Captain's or Boss's red move | Never over the cat; no text |
| **Telegraphs** | World decals + overhead glyph | White = dodge (solid ring), yellow = Hiss it (Paper Cream dashed + triangle), red = get out (Frazzle Magenta zigzag edge) | Owned by Combat/Art; render above the Pile-On dust |
| **Damage numerals** | World | Size by hit tier, not magnitude; frame shape encodes weakness/resist | Default **"Big hits"** (player-authored T3+); options All / Big hits / Off. AI basic hits never show. Multi-hits merge. Max 6 on screen |
| **Lettered onomatopoeia** | World-anchored | One hand-lettered word at T4 (≈ 12% height) / T5 (≈ 30%) | Max one on screen; never over the controlled cat or the HUD (DR-49); T5 giant word only while the HUD is hidden for the cinematic |
| **Bark balloon** | World | Fight barks are **icon-only** (DR-44); the Old Score bark and Standoff lines are text | One at a time |
| **Tag-In cue** | Crew plates + world | See §4.3 | — |
| **Relay chain** | Above the plate stack | Up to 4 cat-face poms lighting in order; 3 s drain line | Only during a Relay |

**Rule of no world text (UX-2.5, as ruled):** in real-time combat the only world-space text is damage numerals, one bark balloon and onomatopoeia. Ally Move ribbons are cut; the cut-in and VFX carry them.

### 4.2 Wireframe — combat, real time (1080p)

```
+--------------------------------------------------------------------------+
|                  /=[ (sage) THE FIRST THORN  "Soggy"  /// ]=\            |
|                   \ [Water] [?]   ~storm~                  /             |
|                                                                          |
|   <(C2)  edge arrow: Crew 2 off-screen left                              |
|                         [====----] Nerve                                 |
|                         [/\/\/\/\/] Frazzle (zigzag)                     |
|                           /\_/\  <- lock target, sage outline            |
|                          ( >.< )      + cream rim                        |
|                                                                          |
|          ^ chevron              (bell)                  ^ chevron        |
|         Crew 1                  /\_/\  <- controlled    Crew 3           |
|                                ( o.o )    ground ring                    |
|+-----------------------+                                      .--.      |
|| ^ [Mikan ] ===== oo  )|                                     ( ** )     |
||   hiss(*)             |      <- BC keep-out: clear ->        '--'      |
|| < [Crew 1] ===-- o.  b|                                    Zoomies     |
|| v [Crew 2] ====- o.   |                                                |
|| > [Crew 3] ===== oo  b|                                                |
|+-----------------------+                                                 |
+--------------------------------------------------------------------------+
 oo = Paw pips (o. = half)   b = "can act" bell   ) = queued command
```

### 4.3 Tag-In and switching

The switch is the D-pad (Up = Mikan, Left/Down/Right = Crew 1/2/3) or Z/X/C/V. A switch within ≈ 0.35 s after the controlled cat lands a string finisher, a Pounce or a Hiss interrupt is a **Tag-In** (DR-29). The window is too short to read new information, so the cue is **peripheral, spatial and audible**:

1. On the qualifying hit, a **bell-gold spark ring** pops on the controlled cat (world) and a bell tick sounds (Audio).
2. Simultaneously, the D-pad glyphs on every standing Crew plate **pop to 115% with a bell-gold rim** for the window. A bonded partner's glyph adds a small heart-link stamp (stronger Tag-In, DR-37).
3. On a successful Tag-In, the incoming plate flashes once, the camera eases over 150 ms (never cuts) and the **Relay chain** lights its first two faces. Each further tag within 3 s lights the next face; a cat already in the chain shows its glyph halftoned (each cat once per Relay).
4. A plain switch outside the window gives no spark and no Relay.

Teaching note: the Life 1 hint card shows the timing on the first two windows only; after that the cue alone carries it. Accessibility requests a wider window option (see `design/accessibility-requirements.md` §5).

### 4.4 Slow Blink (the slow-mo command menu)

Opened by R2 / Tab. Time drops to 5%; the camera lifts to the tactical three-quarter view; the HUD rearranges into the **command menu** in BL beside the plate stack. Props and known Fears are highlighted in the world (this replaces Whisker Sense in combat).

**Controls (DR-08, verbatim):** stick = cursor; L1/R1 = change cat; South = confirm; East = back; R2 = close. Commands **chain** while any cat can afford one (CX-C6: chaining is the default). Scram (flee) is a menu entry.

**Menu structure (one level):**
1. Pinned on top when present: **Pile-On** (when legal) and **Zoomies** (when full, for the selected cat).
2. **Moves 1–4** of the selected cat, each row: icon, name, Paw cost (1–2 pips), Set-up (hollow diamond) or Pay-off (filled diamond), and the state icon it creates or exploits (Ruffled, Soggy, Cowed, Clumped, Splat).
3. Footer: **Scram**.

**Target step.** After a Move is confirmed, the stick moves a snapping target cursor between valid targets. On the hovered target, any Pay-off whose condition is met is **lit** (Bell-Gold) in the menu, so the Set-up → Pay-off chain is legible without reading rules. South confirms; the command pom appears on that cat's plate; the menu returns to the next cat that can afford a Move.

```
+--------------------------------------------------------------------------+
|              (tactical 3/4 view, world at 5%, desaturated 20%)           |
|        [bucket: Water!]                 /\_/\  [Ruffled]  <- target      |
|              ^ prop highlight          ( >.< )  cursor (bell-gold ring)  |
|                                                                          |
|   +--------------------------------+                                     |
|   | < L1   [Crew 1: Goofball] R1 > |                                     |
|   |--------------------------------|                                     |
|   |  * PILE-ON                     |  (pinned, only when legal)          |
|   |--------------------------------|                                     |
|   | > Tail Slap     o   <> Ruffle  |  <> hollow = Set-up                 |
|   |   Pounce Drop   oo  <*> Splat  |  <*> filled = Pay-off (lit if met)  |
|   |   ...           o              |                                     |
|   |   ...           oo  (greyed:   |                                     |
|   |                  not enough Paws: halftone, still focusable)         |
|   |--------------------------------|                                     |
|   |  Scram                         |   S confirm  E back  R2 close       |
|   +--------------------------------+                                     |
|   [plates stay visible at the left edge; queued poms show the plan]      |
+--------------------------------------------------------------------------+
```
*(Move names are placeholders; Combat owns the 12 slice Moves.)*

Unaffordable rows stay in place, focusable, halftoned, with the reason as an icon (missing Paw pip). Routed cats are skipped by L1/R1.

### 4.5 Combat states

| State | HUD |
|---|---|
| **Standoff** (2–4 s) | Name-card slams into the upper third: slanted banner, portrait, claw pips, sting contour glyph, one taunt balloon. A memory-citing line cannot be skipped for 1 s (a fill ring on the skip glyph). Then it shrinks into the identity ribbon. |
| **Ambush by player** | The target's identity ribbon slams in with a Ruffled stamp (no separate corner tag). |
| **Ambush by Rival** | Sting flare from the attacker's direction (§3.1). |
| **Real time** | §4.1–4.3 |
| **Slow Blink** | §4.4 |
| **Pile-On / Zoomies / Boss phase break** | Authored cuts: **all screen-anchored HUD hides** for the cinematic, returns over 200 ms. |
| **Leader Routed** | Control passes to the next slot (not Mikan, DR-33); that plate enlarges; 1.5 s plate flash. |
| **Fed Up (75 s)** | Combat owns the behaviour; HUD shows nothing new. |
| **Win** | HUD fades; Verdict prompt for the one highest-rank tracked Rival (`key-screens.md` §4); other tracked cats slip away. Then the encounter tally (BR, 2.5 s, any input dismisses): XP pips, Morsels, level-up pip. |
| **Wipe** | HUD hides; the victor's **Gloat ≤ 3 s** reuses the name-card; Mikan slinks home (DR-19). |

### 4.6 Readability under heavy VFX

1. **The HUD does not shake.** Camera shake hits the world camera only; screen-anchored HUD is exempt. With Reduce Motion off, the controlled plate may bump ≤ 3 px for 80 ms on a T4+ hit taken.
2. **Hit-stop freezes the world, not the HUD.** Bars keep animating so a frozen frame still reads as responsive.
3. **Impact frames** never invert screen-anchored panels, the Frazzled ring or the controlled-cat marker.
4. **Identity channels have non-colour twins:** Posse = bell-gold keyline + chevron + D-pad glyph; enemies = Clowder outline + emblem pip on the overhead bar; controlled cat = bell + ground ring.
5. **Dust may hide the cats in a Pile-On (that is the joke), never a telegraph.**
6. **Glyph-burst cap:** ≤ 3 bursts on screen, at most one T3+ size; one screen-wide effect at a time (brief §4.1).
7. **Acceptance:** random-pause test, 19 of 20 testers find the controlled cat in < 1 s, with 10 combatants and T4 effects, at 1080p and at 720p (PC window; handheld check is Backlog).

### 4.7 Visual budget (combat)

| Constraint | Limit |
|---|---|
| Screen-anchored elements, real time | 4 (plates, Zoomies pom, identity ribbon, 1 hint card) |
| HUD screen area, real time / Slow Blink | ≤ 15% / ≤ 28% |
| Centre 40%, screen-anchored | 0% |
| Damage numerals on screen | 6 |
| Lettered words | 1 |
| Panel opacity | 100% (opaque paper) |
| Text contrast on panels | 7:1 target, 4.5:1 minimum |
| World-anchored numerals and balloons | Own backing or 3 px Ink outline |

---

## 5. Home HUD

### 5.1 Rules

- **Near zero.** Inside the wall the only on-screen elements are: **Bond hearts** (over Mikan, 2 s, when Bond changes), **Sense Icons** over Mikan (fish, heart, rain cloud, ear, question mark and the tone set: sun-pom warm, rain-cloud sad, zigzag sharp, bouncing notes laughter), the **Call glyph**, and context prompts for home verbs as pictograms (Eat, Rub, Lap, Meow, Knock, piano paw).
- **Nothing translates human speech.** Murmur Ribbons are cut (DR-54). Tone Sense Icons show what Mikan *felt*, authored per vignette, never what a human *meant*. No subtitle track exists for Murmur, in any setting.
- **Off-screen sound at home:** Mikan's ear-and-head turn plus an **ear Sense Icon** pointing at the source. No edge chips.
- **The daily find:** a fresh Home Scent trail (faint, the household's textile motif) leads to the "What changed today?" object; no marker, no text.
- **Pause at home** offers only the **Mikan tab** (hearts, the turf goal as a picture) and **Options** (DR-24). No Fence Line, Turf Board or Crew.
- **No street notification** of any priority shows inside the wall. No toast ever reports a human event.
- No damage numerals, phase dial or lettered words at home.

### 5.2 Wireframe — home, Main Room (cat height, 0.4 m)

```
+--------------------------------------------------------------------------+
|                                                                          |
|        ___________________                                               |
|       |  upright piano    |       (Haru: knees, hands, yellow hem)       |
|       |  _ _ _ _ _ _ _ _  |              ||    ||                        |
|       |_|_|_|_|_|_|_|_|_|_|              ||    ||                        |
|                                                                          |
|                         (sun-pom)  <- tone Sense Icon, over Mikan        |
|                          /\_/\                                           |
|                         ( o.o )                                          |
|                                                                          |
|                         (paw)  <- piano verb pictogram, at the keys      |
+--------------------------------------------------------------------------+
   no panels, no text, no dial
```

### 5.3 The Doorstep Morning Sniff (the single licensed exception)

At the Doorstep each morning, **stamp cards unroll from scent wisps** (Art draws them). Order, top to bottom, max 5 cards:
1. **Tribute line:** the Doorstep pile (the pile is in the world; the card shows fish count).
2. **Raid forecast** (always, when one is coming): the target Patch stamp, the raider's portrait, a paw-arrow; the motive icon only if a Schemer is posted in the district (DR-37).
3. **≤ 3 nemesis items:** portrait + one pictogram (promoted, returned, Restless, Wavering) + at most one cat-voice line ≤ 60 characters. Admitted only for cats with history with the player or that touch the player's Patches or Crew (DR-43).

Life 1 shows one card (day 1: Tribute only; day 2: the Thorn at the gatepost). The 3-item Sniff opens on Life 2 day 1 (unlock ladder). North on a nemesis card opens the Fence Line focused on that cat. The cards roll back up as Mikan steps off the Doorstep. Budget ≤ 0.5 min (DR-16).

```
+--------------------------------------------------------------------------+
|                          ~ ~  scent wisps  ~ ~                           |
|              +---------------------------------------+                   |
|              | (fish) Doorstep pile        x 34      |                   |
|              +---------------------------------------+                   |
|              | RAID  [Gatepost stamp] <== [Thorn]    |  tonight          |
|              |        (paw-arrow)   (motive: grudge) |                   |
|              +---------------------------------------+                   |
|              | [Captain] ^ promoted  "Wall's mine."  |                   |
|              +---------------------------------------+                   |
|                (N) See the wall           step off to close              |
+--------------------------------------------------------------------------+
```

---

## 6. Information-priority table

Priority 1 is read first and must survive every VFX state; lower priorities hide first when space or attention runs out.

| P | Information | Why it matters in the next 5 s | Channel (primary + non-colour twin) | Context |
|---|---|---|---|---|
| 1 | Which cat I control | Every input depends on it | Bell + ground ring; enlarged plate | Combat |
| 1 | Incoming red telegraph / Ambush sting | Avoid a big hit | Zigzag decal + overhead glyph; edge flare with drain arc; vocal | Combat, street |
| 2 | Frazzle window open / Pile-On legal | The signature payoff | Frazzled ring (+ pips on Captain/Boss); dust-pom prompt over the enemy | Combat |
| 2 | Tag-In window | Conducting skill | Spark ring + plate glyph pop + bell tick | Combat |
| 3 | Yellow telegraph + Hiss ready | Interrupt and Ruffle | Dashed triangle decal; glowing hiss pom | Combat |
| 3 | Who can act (Paws) | Slow Blink decision | Paw pips + "can act" bell | Combat |
| 4 | Posse Nerve | Switch or protect | Bars on plates | Combat |
| 4 | Named Rival identity, known Fears | Use the bucket, the horn | Identity ribbon stamps | Combat |
| 5 | Zoomies ready | Limit break | Pom crown burst + glyph | Combat |
| 5 | Caterwaul / raid in progress | Optional defence | TL flare + shrinking ring + edge arrow | Street |
| 6 | Time of day | Curfew trade | Phase dial; world light | Street |
| 6 | Patch ownership and strength | Spray or post | World wisps; Patch tag | Street |
| 7 | Morsels picked up | Low stakes | Pickup tick | Street |
| 8 | Damage numerals | Feedback only | Size by tier; frame shape | Combat |
| — | Haru's life | Never HUD | Staging, light, music, Sense Icons | Home |

---

## 7. Notifications

| Notification | Zone | Duration | Max | Priority | Queue |
|---|---|---|---|---|---|
| Ambush sting flare | Edge | 2.0 s | 2 | Critical | Never queued |
| Caterwaul flare | TL + edge | While defendable | 1 (+N count) | Critical | Never queued; collapses in combat |
| Pile-On prompt | World | Frazzle window | 1 per enemy | Critical | Never queued |
| Call glyph | Edge | Motif length | 1 | High | In combat: suppressed, replayed once after |
| Leader Routed | Plates | 1.5 s | 1 | High | Immediate |
| Phase change | TR dial enlarges | 4 s | 1 | Medium | Clock is paused in combat anyway |
| Encounter tally | BR | 2.5 s | 1 | Medium | After the Verdict |
| Clout rank-up | Centre card | Until dismissed | 1 | High | Held until roaming and outside the wall |
| Hint card | BC | Until done or dismissed | 1 | Medium | Queued in combat unless it is a combat hint |
| Patch tag / pickup tick | TL / TR | 3 s / 1.5 s | 1 / 2 merged | Low | Dropped if a fight starts |
| Bond hearts | Over Mikan | 2 s | 1 | Low | Home only |

Rules: Low and Medium items are held in combat and flushed after the tally (≤ 3 in sequence; stale Low items dropped). Same-type items within 500 ms merge. Rival rank changes and betrayals are never toasts: they arrive by bark, the Sniff or the Fence Line.

---

## 8. Control map (DR-08, verbatim; UX owns the map, Combat owns the actions)

Everything is remappable, and every chord or hold has a one-button or toggle alternative. Positional naming: West = X/□, North = Y/△, South = A/×, East = B/○. Prompt glyphs in every screen read from the player's current binding, never from this table.

| Gamepad | Exploration | Combat |
|---|---|---|
| Left stick | Move | Move |
| Right stick / R3 | Camera orbit / recentre | Camera orbit (soft-lock keeps the target framed) / **lock-on toggle**; flick = next target |
| West | Swat | **Attack** (3-hit string; airborne or from the High Road = **Pounce**) |
| South | Jump / Hop | Hop |
| East | Dash (hold to sprint) | Skitter (dodge) |
| North | Interact (Spray, Sniff, Nap, pick up/put down) | **Hiss**; becomes **Pile-On** while one is available |
| R1 | — | Brace (hold) |
| R2 | **Whisker Sense** (hold) | **Slow Blink** |
| L2 | Stalk (hold) | — |
| L1 hold + face button | — | Shortcut Move 1/2/3/4 (W/N/E/S) |
| L1 + R1 | — | Zoomies |
| D-pad | Left/Right = Tail-Up picker; Up = Meow; Down = Sit (hold = **Head Home** thread) | Direct switch: Up = Mikan, Left/Down/Right = Crew 1/2/3 (a switch at the right moment is a **Tag-In**) |
| View / Menu | Fence Line / Pause | — / Pause |

Inside Slow Blink: stick = cursor; L1/R1 = change cat; South = confirm; East = back; R2 = close. Commands **chain** while any cat can afford one. Scram (flee) is a menu entry.

| Keyboard & mouse | Exploration | Combat |
|---|---|---|
| WASD / mouse | Move / camera | Move / camera |
| LMB | Swat | Attack |
| RMB | — | Brace |
| Space / Shift | Jump / Dash | Hop / Skitter |
| E / F | Interact / — | — / Hiss (Pile-On when available) |
| Tab | Whisker Sense (hold) | Slow Blink |
| Ctrl | Stalk | — |
| 1–4 / R | — | Shortcut Moves / Zoomies |
| Z X C V | — | Switch Mikan / Crew 1 / 2 / 3 |
| MMB / wheel | Recentre | Lock-on / next target |
| V / T / C / H | Tail-Up / Meow / Sit / Head Home (hold) | — |
| J / Esc | Fence Line / Pause | — / Pause |

Cut (DR-08): Whack, Bap, Righting input, hold-charge attacks, Tactics (slice), L3+R3 chord, Whisker Sense in combat, the bell ping, the Posse directive, right-stick peek.

**UX notes on the map (no redefinition):**
- At home, combat-only and Fence Line bindings are inert; View does nothing (DR-24).
- Menu navigation everywhere: stick/D-pad move, South confirm, East back; keyboard arrows/WASD, Enter/Space, Esc. Mouse hover focuses; LMB confirms.
- Hold-to-commit (the Verdict) uses South / Space with a 600 ms ring; a press-then-confirm alternative exists (accessibility doc §4).

---

## 9. Tuning knobs

| Knob | Default | Range | Notes |
|---|---|---|---|
| HUD fade at the garden wall | 800 ms | 400–1200 | Pillar 2 beat; playtest the feel |
| Phase dial size / emphasis | 48 px / 4 s | 40–64 px / 2–6 s | Setting: Always / Contextual / Off |
| Enemy bar linger after hit | 3 s | 1–5 s | Clutter vs info |
| Damage numerals default | Big hits | All / Big / Off | |
| Tag-In plate glyph pop | 115%, window length | 105–130% | Window length is Combat's |
| Relay chain drain | 3 s | Combat's value | Read, not owned |
| Controlled plate scale | ×1.3 | ×1.15–1.5 | |
| HUD scale | 100% | 80–150% | Accessibility doc §6 |
| Sniff card max | 5 | 3–5 | Canon caps the nemesis items at 3 |

---

## 10. Acceptance criteria

1. Random-pause test: 19 of 20 testers find the controlled cat in < 1 s with 10 combatants and T4 effects, at 1080p and 720p.
2. In the combat prototype, ≥ 80% of testers can say, unprompted after one fight, "when the ring is on an enemy, press North for the Pile-On".
3. ≥ 75% of testers perform ≥ 1 Tag-In per encounter without a hint after the Life 1 teaching (supports DR-02).
4. No screen-anchored element enters the centre 40% or the bottom-centre keep-out, verified on capture at 16:9, 16:10 and 21:9.
5. Inside Haru's wall, a frame audit of every slice vignette finds zero panels, bars, numerals or system text outside the Doorstep Sniff.
6. No human utterance or writing is rendered, captioned or paraphrased in any HUD element, in any setting (string audit).
7. Every colour-coded HUD signal has a named non-colour twin (§6) and passes deuteranopia, protanopia and tritanopia simulation.
8. Every glyph-bearing element measures ≥ 28 px at 1080p / 18 px at 720p.
9. A median-skill tester reads the Sniff and leaves the Doorstep in ≤ 30 s (DR-16).
10. No playtester in the no-briefing test reports missing Dusk without noticing the dial.

---

## Backlog (post-slice)

- Handheld presets and the 720p device check (E-5); per-device HUD scale defaults.
- Mikan's third Paw pip (Life 4+).
- Multi-district Caterwaul and raid flares (DR-17 limits the slice to the current district).
- Life 8 HUD: Carry state, the silenced Call glyph rules, the Season Turn at the Doorstep (DR-27; Narrative §9 owns).
- Life 9 HUD: 70% AI fill indication, the heir.
- Tactics icons on plates (Tactics are Backlog).
- Knack indicators.
- Roof Run fast-travel prompt.
- Diamond-shaped plate cluster mirroring the D-pad (test against the stack after the prototype).
- One-handed control presets (UX-10; prototype before promising).
- Per-screen split of HUD specs once the slice HUD is built.
- Botan's identity ribbon variant (hand-bell, Trickster stamps).

## Revision Log

**2026-11-23, round 2 (fresh slice rewrite; issues from `design/reviews/round-1/ux--art-direction.md` and director-rulings Part 2 §8).**

| ID | Status | How |
|---|---|---|
| UX-1 | FIXED | §8 is DR-08 verbatim; conductor cue is the D-pad direction + "can act" bell; UX-1's Whack, Bap and chord layout REJECTED per DR-08. |
| UX-2 | FIXED | Redone for third-person: corner HUD with bottom-centre keep-out (§2); no world text except numerals, one balloon, onomatopoeia (§4.1); Frazzle on the enemy; identity ribbon for named Rivals only; Frazzle bonus as 5 pips; plates fixed by D-pad; Command Stub cut; text floor 28/18 px; numerals default Big hits; burst cap 1 large + 2 small. UX-2.1 camera keep-out REJECTED as moot (DR-48). |
| UX-3 | FIXED | In `key-screens.md` §2. |
| UX-4 | FIXED | In `key-screens.md` §7. |
| UX-5 | FIXED | Scent never a number on the street (§3.1); Grudge/Regard/Loyalty in `key-screens.md`; Gloat ≤ 3 s (§4.5). Willingness % and Rations REJECTED (cut systems). |
| UX-6c | FIXED | Tail-Up picker lists Lounging cats only; posted cats halftoned (§3.1). UX-6a/6b REJECTED (DR-38, DR-34). |
| UX-7 | FIXED | Paper-goods language, claw-mark pips, storm mark, halftone disabled, bean plates, Standoff card in the upper third morphing into the ribbon. |
| UX-8 | FIXED | Home pause = Mikan + Options; ear Sense Icon replaces sound chips; tone Sense Icons replace Murmur Ribbons; Doorstep Sniff written as the single exception (§5). |
| UX-9 | FIXED | Phase dial always on while roaming, enlarges at change and last 60 s, setting Always/Contextual/Off (§3.1). |
| UX-10 | FIXED | Moved to `design/accessibility-requirements.md`. |
| UX-11 | FIXED | Slow Blink one level with pinned entries (§4.4); Pile-On prompt over the enemy; Ambush tag = ribbon slam; Hiss pom; names Turf Board / phase dial; sparkline cut; numeral frames + tint both stand. |
| UX-X1 | FIXED | DR-08. |
| UX-X11 | FIXED | Always-on dial. |
| UX-X12 | FIXED | Frazzle in world, ribbon at top. |
| UX-X13 | FIXED | Standoff card upper third. |
| UX-X14 | FIXED | 28 px / 18 px floor. |
| UX-X15 | FIXED | Five pips, no number. |
| UX-X18 | FIXED | Whisker Sense unavailable in combat; Slow Blink shows props and Fears. |
| UX-X2–X10, X19, X20 | FIXED | In `key-screens.md` (see its log). |
| UX-X16, X17 | REJECTED (not UX's) | Crew cap is DR-14; tier table is DR-07 (Combat). |
| CX-C1 | FIXED | Control map adopted; the conductor cue shows the cat's D-pad direction (§4.1). |
| CX-C6 | FIXED | Slow Blink chains by default (§4.4). |
| PP-31 | FIXED | One Posse-swap rule: Tail-Up in the field, the Posse Builder at the Lot (§3.1; `key-screens.md` §6). |

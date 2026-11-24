# HUD Design — Cat RPG (vertical slice, round 2)

*Owner: ux-designer · Date: 2026-11-23, revised 2026-11-24 (owner feedback pass) · Status: round-2 slice rewrite (the first draft is archived at `design/backlog/first-drafts/hud.md`)*
*Canon: owner comments C1–C5 → `design/reviews/owner-feedback-rulings.md` (OR-xx, binding) → `design/creative-brief.md` v1.5 → `design/reviews/round-1/director-rulings.md` (DR-xx). Patent guardrails: `design/legal/nemesis-patent-analysis.md` v2 §5. Where this doc and a ruling disagree, the ruling wins and this doc is wrong.*
*Companions: `design/ux/key-screens.md` (Rivals board, Rival card, Verdict and loss, Turf Board, Crew, onboarding) and `design/accessibility-requirements.md` (the project-wide floor every element here must meet).*

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
- The controlled cat sits in the lower-middle of the frame and is large (≈ 10–20% of screen height exploring; ≈ 18% at default, ≥ 6.7% in combat). All world-anchored marker sizes assume Art's **one global cat scale, 1.25× a real cat (≈ 0.56 m)** (`art-bible.md` §3.4, `camera-system.md` §4.1). **The bottom-centre band (middle 40% width, bottom 25% height) is a permanent keep-out** for screen-anchored elements; it belongs to the cat, hint cards and accessibility cues.
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
| **Patch tag** (the street's influence readout) | TL | Patch silhouette stamp, Keeper's Clowder emblem, 1–4 wisps. **No number, no bar** (OR-08: the street shows wisps only; the influence % lives in the Turf Board header). On your own post below Strong the wisp row carries the **cracked-wisp** stamp (the same "fading" badge as the Turf Board), which is exactly when the Spray prompt appears | 3 s on entering a Patch, and 2 s after any Spray, Rub or Counter-Spray, showing the wisps change; dropped if a fight starts | Territory |
| **Anger puff** (on the Patch tag) | TL, beside the wisps | One steam puff pops off the tag with a distant grumble (Audio) when the act just done raised the district Boss's anger (Over-mark, Counter-Spray in his district, OR-07). A second, larger puff when that act crossed into a new stage. **No number, no meter** | With the Patch tag after the act | Nemesis |
| **Rivals chip** | TR, under the phase dial | The Rivals board icon + the cat's chip (silhouette until met) + View glyph. Pressing View opens the board focused on that cat (`key-screens.md` §2.8) | 4 s after a key event (discovery, Verdict, first join-in); never in combat, at home or on the walk home | UX |
| **Roaming-Boss call** | Edge ring toward the Boss's stop | A crown pom with a yowl contour (the Boss's sting, drawn) pointing to his current patrol stop | 3 s when the Boss window opens and at each phase change while it is open (he moves stop), current district only; the persistent cue is the compass tick (§3.2) | Territory (window), Nemesis (stop) |
| **Caterwaul flare** | TL + edge arrow | Distress-yowl pom, Patch stamp, **shrinking ring = time left** | While the raid is defendable; current district only (DR-17) | Territory |
| **Ambush sting flare** | Edge ring, direction of the attacker | Jagged pom + a 2.0 s draining arc; the last 0.75 s turns Ink (the Skitter/Brace window) | During a Rival Ambush (DR-36) | Combat |
| **Call glyph** | Edge ring toward the singer | Three smooth Haru-Yellow arcs drawn as the Call's contour, Ink-outlined | When the Call sounds (always on; DR-54) | Audio / Narrative |
| **Head Home prompt** | BC (just above the cat) | Bell-gold paw on a thread + D-pad Down hold glyph | First 4 s after the Dusk Call, and while drowsy | Day loop |
| **Interact prompt** | World-anchored at the object | North / E glyph + a verb pictogram (Spray puff, Sniff nose, Nap zZ) | In range; Spray only when the post is below Strong (DR-18) | Territory / Day loop |
| **Tail-Up picker** | BL, compact portrait poms | Lounging cats only; posted cats halftoned with a guard-post stamp | D-pad Left/Right pressed (DR-38); not on the walk home after a loss | Crew |
| **Pickup tick** | TR under the dial | Fish icon + count (Morsels), shiny icon (Shinies) | 1.5 s, merged within 500 ms | Economy |
| **Bark balloon** | World-anchored over the speaking cat | Readable cat speech ≤ 60 characters, Clowder-colour tab with emblem, three-pom tail | One at a time | Nemesis / Narrative |

### 3.2 Whisker Sense (R2 hold / Tab hold)

The world desaturates; scent trails glow; the **scent compass ring** sits on the ground around Mikan (world-anchored, not screen) with up to 6 ticks, in this priority when more than 6 compete:

| Tick | Shape (colour is the second channel) | When |
|---|---|---|
| **Roaming Boss** | Crown with paw-marks, in his Clowder colour; larger than other ticks | While the Boss window is open: points to his current patrol stop (OR-09) |
| **Challenger** | Stake flag, Outsiders colour | While a challenger is active in the district: points to the post it stakes (OR-16) |
| **Your fading post** | Cracked wisp, Bell Gold | Your held posts below Strong (the posts that are dragging influence down) |
| Rival mark | Clowder emblem | As before |
| Rival | Role claw-mark | As before |
| Hidden find | Sparkle | As before |

Scent Posts in view show their wisps brighter. The phase dial enlarges. Not usable in combat (DR-08).

**Sniff to discover** (OR-03). Holding Whisker Sense with an undiscovered cat on screen within **10 m** draws a thin **fill ring** around that cat (world-anchored, 1.0 s). When it closes, the cat's **scent outline** pulses once in its Clowder colour and a **tape star** pops over its head: discovered (`CatDiscovered`). Then the Rivals chip (from Life 2 day 1). Releasing early cancels the ring with no cost. A cat already discovered draws no ring. No text appears; the legend (View hold) on the Rivals board explains it, and the board's name-card for a silhouette says how.

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

### 3.6 The closed street: walking home after a loss (OR-01)

After a Posse wipe the clock jumps to Night (the nightfall transition, `key-screens.md` §4.6) and **the street closes**: Mikan can only walk home. The HUD says so by what it removes, not with text.

| Element | On the walk home |
|---|---|
| **Phase dial** | The moon, at Night, with a small **closed-door notch** cut into the roofline (shape twin of "the street is closed"). Stays until the garden wall |
| **Head Home thread** | Drawn at once from where Mikan comes to (≤ 60 s long); brighter than at Dusk |
| **Head Home prompt** (BC) | Persistent, with a **60 s drain ring** around the paw pom. When it empties, the drowsy autopilot walks Mikan home (existing rule). Pressing Head Home starts the autopilot at once |
| Interact prompts | None appear (no Spray, Rub, Sniff, Nap, pickups); the Lot's back fence has no prompt |
| Patch tags, Caterwaul flares, Ambush stings, pickup ticks, Rivals chip | Off. Tonight's raid auto-resolves overnight; its result comes in the next Sniff |
| **Whisker Sense** | Shows the thread only: no compass ticks, no sniff-to-discover ring |
| Tail-Up picker | Off |
| Posse plates | Hidden (no combat). The Posse limps after Mikan in the world |
| Other cats | Non-hostile in the world: they turn away or watch (Nemesis/AI); no overhead marks |
| **Pause** | Mikan · Rivals (read-only) · Options |
| View / J | Opens the Rivals board (read-only) |
| First loss only | One hint card: "Day's over. Head home." with the Head Home glyph |

Before the cat flap (Lives 1–2 up to L2D2 Dusk) the same HUD plays over the staged nightfall. Crossing the garden wall, everything falls away as usual (§3.5) and the Routed Evening begins.

```
+--------------------------------------------------------------------------+
|                                                        (moon) roofline   |
|   (moon-blue street, empty; no tags, no flares)          with door notch |
|                                                                          |
|        . . . . gold Head Home thread . . . . . . . . . . . ->  (wall)    |
|                                                                          |
|                     (Pon, Hige limping behind)                           |
|                               /\_/\                                      |
|                              ( -.- )   <- Mikan                          |
|                                                                          |
|                         ( paw )  <- Head Home prompt, 60 s drain ring    |
+--------------------------------------------------------------------------+
```

---

## 4. Combat HUD

Goal: under T4/T5 VFX, shake and dust, the player must always find (1) the controlled cat, (2) the Frazzle window, (3) who can act, (4) the incoming red telegraph. Everything else is secondary.

### 4.1 Elements

| Element | Zone | Shows | Rules |
|---|---|---|---|
| **Posse plates** (×4) | BL, stacked | One bean plate per cat: portrait, D-pad glyph, Nerve bar, **2 Paw pips** (partial fill visible), 1 status pom (Soggy / Cowed / Fired Up, max 1, DR-28; see §4.1.1), queued-command pom | **Fixed order by slot = D-pad order: Up (Mikan), Left (Crew 1), Down (Crew 2), Right (Crew 3).** Rows never reorder. The controlled cat's plate enlarges in place (×1.3) and gains the hiss-mouth pom. Routed cat: plate halftoned, portrait flattened, glyph struck through |
| **Hiss pom** | On the controlled plate | Hiss-mouth icon that refills over the 8 s cooldown | Glows when a yellow telegraph is live and Hiss is ready |
| **"Can act" bell** (conductor cue) | On each Crew plate | A small pad-bell lights when that cat can afford a Move (≥ 1 Paw) | The cue is the cat's D-pad direction plus the bell, not a command-button glyph (CX-C1) |
| **Shortcut diamond** | Beside the controlled plate | Four Move icons at W/N/E/S with Paw cost pips, Set-up/Pay-off mark | Appears only while L1 is held. Life 1 shows it after the first Slow Blink lesson; never shown otherwise |
| **Zoomies pom** (limit gauge) | BR | A round pom filling clockwise; Style icon in the centre; at full it bursts a crown and shows the L1+R1 / R glyph | Persists within a day; Well-Fed start shows as pre-filled segments with a small sun stamp, no status icon (DR-20) |
| **Controlled-cat marker** | World, on the cat | Bell over the head (replaces its chevron) + Combat's ground ring | One overhead mark per Posse cat: allies keep the bell-gold chevron tick |
| **Enemy overhead bar** | World, over the enemy | Thin Nerve bar + **zigzag Frazzle bar** beneath it | Shown on the lock target, on any enemy hit in the last 3 s, and on any Frazzled enemy; otherwise hidden. Handheld: non-target bars drop first |
| **Frazzled ring** | World, around the Frazzled enemy | Countdown ring over the 6 s window; on Captains and the Boss, **5 pips** that drain as the window passes (earlier Pile-On = worth more, DR-30) | No numeral, ever. Trash shows the ring without pips (Pile-On always Routs below Captain) |
| **Pile-On prompt** | World, over the Frazzled enemy | North / F glyph inside a dust-cloud pom | Appears only when the Pile-On is legal (≥ 2 standing Posse cats; trash: 2+ Frazzled within 3 m or the last enemy). **No world text**: the word "Pile-On" is taught by a BC hint card |
| **Identity ribbon** | TC | Slanted Clowder banner, name, Title, role mark (Tough 1 claw, Captain 2, Boss crown), ≤ 3 known Fear/Strength stamps, storm mark on the arc lead (*Sworn Enemy / Sworn Rival*), Old Score stamp if active, **1 status pom** (Fired Up from anger, §4.1.1). Boss: **segmented Nerve bar (3 phases)** and his **anger puffs** (0–3) beside the name | **Named Rivals, Captains and Daifuku only.** Strays and Crows get no ribbon. It is the Standoff name-card shrinking into place (one component) |
| **Red callout** | Docked under the identity ribbon | Telegraph pictogram (zigzag) for a Captain's or Boss's red move | Never over the cat; no text |
| **Telegraphs** | World decals + overhead glyph | White = dodge (solid ring), yellow = Hiss it (Paper Cream dashed + triangle), red = get out (Frazzle Magenta zigzag edge) | Owned by Combat/Art; render above the Pile-On dust |
| **Damage numerals** | World | Size by hit tier, not magnitude. Weakness and resistance read from the **spark shape** (Art §10.3: extra crack wedge / blunted spark), not the numeral frame | Default **Off** in the slice (R3; the manga feel lives in glyphs and the single lettered word); options Off / Big hits (player-authored T3+) / All. AI basic hits never show. Multi-hits merge. Max 6 on screen |
| **Lettered onomatopoeia** | World-anchored | One hand-lettered word at T4 (≈ 12% height) / T5 (≈ 30%) | Max one on screen; never over the controlled cat or the HUD (DR-49); T5 giant word only while the HUD is hidden for the cinematic |
| **Bark balloon** | World | Fight barks are **icon-only** (DR-44); the Old Score bark and Standoff lines are text | One at a time |
| **Tag-In cue** | Crew plates + world | See §4.3 | — |
| **Relay chain** | Above the plate stack | Up to 4 cat-face poms lighting in order; 3 s drain line | Only during a Relay |
| **Ally guest plate** (Nose-Touch join-in) | BL, **above** the plate stack, separate from it | See §4.1.2 | Only while a truce cat or Friend fights beside the Posse (OR-13) |

#### 4.1.1 Cowed and Fired Up from the Rivals rules

Both reuse Combat's existing statuses and the one status pom (no new HUD element). What the HUD adds is **why**, shown as a small badge on the pom, so the player can act on it.

| State | Where | Shows | Clears |
|---|---|---|---|
| **Cowed by Old Gang Nerves** (OR-06) | The recruit's own Posse plate | The Cowed pom (drooped ears) with a **small crown-with-a-nick badge** (its Old Boss) and a **drain ring** for the 20 s (Fraidy 30 s). The plate's D-pad glyph pulses gently: the answer is a Tag-In | **Tag-In to that cat** clears it at once: the pom pops off with a bell tick and the cat's own "steeled" bark. Or the ring runs out |
| The flinch itself | World, at the Standoff | The recruit's ears flatten and it flinches; its **own** line in its balloon ("…That's Daifuku's wall."). A resisting cat instead plays its own defiant line ("Not your cat anymore.") and gets no pom | — |
| **Fired Up from Boss anger** (OR-07) | The Boss's identity ribbon | The Fired Up pom (puffed chest) with his **steam-puff badge** (1–3 puffs = Riled / Seething / Furious) and a drain arc for 20 s / 40 s; **no arc when Furious** (all fight) | Runs out, or the fight ends. After any win, loss or `rival_fled` his ribbon's puffs empty on the next Standoff (anger spent) |

**What the HUD never shows:** any mark on the Old Boss pointing at the recruit (he behaves as with any Posse, G4), or any link line between the two. The Cowed cat's badge is its own memory, not his reaction.

#### 4.1.2 The ally guest plate (Nose-Touch join-in, OR-13)

- **Arrival:** a 3 s yowl from off-screen; an **edge arrow** with the sprig icon points where it comes from; then the plate pops in above the stack and the cat leaps into the ring.
- **The plate:** a smaller bean (×0.8) with a **dashed Bell-Gold keyline** (allied, not yours), the cat's chestnut portrait with its **truce sprig**, its name ribbon, a Nerve bar. **No D-pad glyph, no Paw pips, no "can act" bell, no command pom:** it cannot be switched to, commanded or join a Pile-On, and the plate says so by what it lacks.
- **In the world:** a sprig tick over its head instead of the Posse chevron, and the same dashed gold keyline, so it never reads as a sage-outlined enemy (colour twin: the dashed line and the sprig shape).
- **Slow Blink:** it is not in the L1/R1 cycle; it shows in the tactical view with its sprig tick only.
- **Routed:** its plate halftones and slides off after 1.5 s.
- **The opposing Rival:** nothing on its ribbon, outline or overhead changes (G7). No tag or line ties the two on screen in combat.
- **Max one guest** per encounter (OR-13).

**Rule of no world text (UX-2.5, as ruled; R3):** in real-time combat the only world-space text is **one bark balloon plus one lettered word** (Combat §3.17). Damage numerals are added only if the player turns them on. Ally Move ribbons are cut; the cut-in and VFX carry them.

### 4.2 Wireframe — combat, real time (1080p)

```
+--------------------------------------------------------------------------+
|                  /=[ (sage) TOGEMARU  the First Thorn  /// ]=\           |
|                   \ [Cucumber] [?]   ~storm~               /             |
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

**Variant: the Daifuku fight with the Rivals states** (Kagi Cowed by Old Gang Nerves; Daifuku Fired Up while Seething; Togemaru, in truce, joined in against his Rival Goma in the wave):

```
+--------------------------------------------------------------------------+
|        /=[ (sage) DAIFUKU  ( )( )  [FiredUp: puffs 2, arc 40 s] ]=\       |
|         \ [Water] [?]   Nerve [=====|=====|=====]  3 phases     /        |
|                                                                          |
|   <(sprig) edge arrow: guest arriving from the left (3 s yowl)           |
|                                                                          |
|                        DAIFUKU on the wall-top kit                       |
|                                                                          |
|   (sprig) dashed gold keyline           (bell)          ^ chevron        |
|    Togemaru, guest                      /\_/\           Hige             |
|                                        ( o.o )                          |
|+---------------------------+                                    .--.     |
|| (sprig) [Togemaru] ====-  |  <- guest plate: no glyph, no Paws ( ** )   |
|+---------------------------+                                    '--'     |
|| ^ [Mikan ] ===== oo  )    |                                             |
|| < [Hige  ] ===-- o.  b    |                                             |
|| v [Kagi  ] ====- o.  [Cowed + nicked crown, ring 20 s]  <- glyph pulses |
|| > [Pon   ] ===== oo  b    |                                             |
|+---------------------------+                                             |
+--------------------------------------------------------------------------+
```

### 4.3 Tag-In and switching

The switch is the D-pad (Up = Mikan, Left/Down/Right = Crew 1/2/3) or Z/X/C/V. A switch within ≈ 0.35 s after the controlled cat lands a string finisher, a Pounce or a Hiss interrupt is a **Tag-In** (DR-29). The window is too short to read new information, so the cue is **peripheral, spatial and audible**:

1. On the qualifying hit, a **bell-gold spark ring** pops on the controlled cat (world) and a bell tick sounds (Audio).
2. Simultaneously, the D-pad glyphs on every standing Crew plate **pop to 115% with a bell-gold rim** for the window. A bonded partner's glyph adds a small heart-link stamp (stronger Tag-In, DR-37).
3. On a successful Tag-In, the incoming plate flashes once, the camera eases over Camera's Tag-In blend (0.3 s, `camera-system.md` §3.5; never cuts) and the **Relay chain** lights its first two faces. Each further tag within 3 s lights the next face; a cat already in the chain shows its glyph halftoned (each cat once per Relay).
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
| **Standoff** (2–4 s) | Name-card slams into the upper third: slanted banner, portrait, claw pips, sting contour glyph, one taunt balloon. A memory-citing line cannot be skipped for 1 s (a fill ring on the skip glyph). Then it shrinks into the identity ribbon. **Old Gang Nerves:** if a Posse recruit sees its Old Boss among the opponents, its own flinch and line play here, after the Boss's ordinary taunt, and the Cowed pom lands on its plate as the fight starts (§4.1.1). A Boss's anger puffs and Fired Up pom are on the name-card from the slam. |
| **Ally joins** | The guest's yowl, edge arrow and plate (§4.1.2); the fight does not pause. |
| **Ambush by player** | The target's identity ribbon slams in with a Ruffled stamp (no separate corner tag). |
| **Ambush by Rival** | Sting flare from the attacker's direction (§3.1). |
| **Real time** | §4.1–4.3 |
| **Slow Blink** | §4.4 |
| **Pile-On / Zoomies / Boss phase break** | Authored cuts: **all screen-anchored HUD hides** for the cinematic, returns over 200 ms. |
| **Leader Routed** | Control passes to the next slot (not Mikan, DR-33); that plate enlarges; 1.5 s plate flash. |
| **Fed Up (75 s)** | Combat owns the behaviour; HUD shows nothing new. |
| **Win** | HUD fades; Verdict prompt for the one highest-rank tracked Rival (`key-screens.md` §4); other tracked cats slip away. Then the encounter tally (BR, 2.5 s, any input dismisses): XP pips, Morsels, level-up pip. |
| **Wipe** (a loss, OR-01) | HUD hides; the victor's **Gloat ≤ 3 s** reuses the name-card (its own line only); then the nightfall transition and the closed-street walk home (§3.6; `key-screens.md` §4.6). |

### 4.6 Readability under heavy VFX

1. **The HUD does not shake.** Camera shake hits the world camera only; screen-anchored HUD is exempt. With Reduce Motion off, the controlled plate may bump ≤ 3 px for 80 ms on a T4+ hit taken.
2. **Hit-stop freezes the world, not the HUD.** Bars keep animating so a frozen frame still reads as responsive.
3. **Impact frames** never invert screen-anchored panels, the Frazzled ring or the controlled-cat marker.
4. **Identity channels have non-colour twins:** Posse = bell-gold keyline + chevron + D-pad glyph; enemies = Clowder outline + emblem pip on the overhead bar; controlled cat = bell + ground ring.
5. **Dust may hide the cats in a Pile-On (that is the joke), never a telegraph.**
6. **Glyph-burst cap:** ≤ 3 bursts on screen, at most one T3+ size; one screen-wide effect at a time (brief §4.1).
7. **Acceptance:** random-pause test, 19 of 20 testers find the controlled cat in < 1 s, with 6 enemies plus the Posse (the slice maximum) and T4 effects, at 1080p and at 720p (PC window; handheld check is Backlog).

### 4.7 Visual budget (combat)

| Constraint | Limit |
|---|---|
| Screen-anchored elements, real time | 4 (plates, Zoomies pom, identity ribbon, 1 hint card); +1 ally guest plate when a join-in is live, stacked with the plates (same zone) |
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

- **Near zero.** Inside the wall the only on-screen elements are: **Bond hearts** (over Mikan, 2 s, when Bond changes), **Sense Icons** over Mikan (fish, heart, rain cloud, ear, question mark and the four **tone puffs** from Narrative §3.1: **Round** = warm · **Spiky** = sharp · **Drooping** = low, unhappy · **Bouncing** = bright, excited), the **Call glyph**, and context prompts for home verbs as pictograms (Eat, Rub, Lap, Meow, Knock, piano paw).
- **Nothing translates human speech.** Murmur Ribbons are cut (DR-54). Tone Sense Icons show what Mikan *felt*, authored per vignette, never what a human *meant*. No subtitle track exists for Murmur, in any setting.
- **Off-screen sound at home:** Mikan's ear-and-head turn plus an **ear Sense Icon** pointing at the source. No edge chips.
- **The daily find:** a fresh Home Scent trail (faint, the household's textile motif) leads to the "What changed today?" object; no marker, no text.
- **Pause at home** offers only the **Mikan tab** (hearts, the turf goal as a picture) and **Options** (DR-24). No Rivals board, Turf Board or Crew.
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
|                         (round puff) <- tone puff Sense Icon, over Mikan |
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
3. **≤ 3 Rivals items:** a cat chip (silhouette if undiscovered) + one pictogram + at most one line ≤ 60 characters in that cat's **own** voice, from its own history (G8). Admitted only for cats with history with the player or that touch the player's Patches or Crew (DR-43). Priority when more than 3 compete:

| P | Card type (v1.5) | Pictogram | Shows |
|---|---|---|---|
| 1 | **Wavering** (OR-11) | Turned-away chip + **two-pip morning mark** ("last warning" on the 2nd) | The posted ex-Rival recruit, its post's stamp, the fix in one line ("Bring it into the Posse, or off its post."). Always admitted; on the 2nd morning it sits first, above the raid forecast |
| 2 | **Boss window** (OR-09) | Crown with paw-marks | "Daifuku has come down off the walls." + today's three stop landmarks; the Morning stop lit |
| 3 | **Challenger arrived** (OR-16) | Stake flag | "A stranger's scent." Silhouette + the staked Patch's stamp + tape star |
| 4 | Declaration / arc closing | Storm mark / bell / paw prints off the edge | *Sworn Enemy* / *Sworn Rival* / "Wears the bell now" / "Run out of town" |
| 5 | **Boss anger** at Seething or Furious (OR-07) | 2–3 steam puffs | "The big wall is seething." (his own Standoff voice; never a cause other than marking) |
| 6 | Town event, truce over, victor's plaster line | Tape star / sprig / plaster | One line, the cat's own; never a cause in terms of another cat |

Deleted card types (OR-21): promoted, returned, Restless.

Life 1 shows one card (day 1: Tribute only; day 2: the Thorn at the gatepost). The 3-item Sniff opens on Life 2 day 1 (unlock ladder). North on a Rivals card opens the Rivals board focused on that cat (`key-screens.md` §2). The cards roll back up as Mikan steps off the Doorstep. Budget ≤ 0.5 min (DR-16).

```
+--------------------------------------------------------------------------+
|                          ~ ~  scent wisps  ~ ~                           |
|              +---------------------------------------+                   |
|              | (fish) Doorstep pile        x 34      |                   |
|              +---------------------------------------+                   |
|              | RAID  [Persimmon Alley] <== [Thorn]   |  tonight          |
|              |        (paw-arrow)   (motive: grudge) |                   |
|              +---------------------------------------+                   |
|              | (crown) Daifuku has come down off the |                   |
|              |  walls.  [yard wall][back wall][Den]  |                   |
|              +---------------------------------------+                   |
|              | (flag) [ ? ] A stranger's scent.      |                   |
|              |        staking [Laundry Pole Yard] *  |                   |
|              +---------------------------------------+                   |
|                (N) See the Rivals         step off to close              |
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
| 6 | Patch ownership and strength (the street's influence read) | Spray or post | World wisps; Patch tag with the cracked-wisp fading stamp; compass fading-post ticks | Street |
| 4 | **Cowed by Old Gang Nerves** on a Posse cat | Tag-In to steady it | Cowed pom + nicked-crown badge + drain ring; pulsing D-pad glyph | Combat |
| 4 | **Boss Fired Up** (anger) | Respect the bigger hits; time the Pile-On | Fired Up pom + puff badge + drain arc on the ribbon | Combat |
| 5 | **Ally guest** in the fight | Know who is on your side | Dashed gold keyline + sprig tick (world); guest plate | Combat |
| 5 | **Roaming Boss's stop** (window open) | Where to challenge him | Compass crown tick; edge crown pom at phase change | Street |
| 6 | Challenger's staked post | Optional fight by day | Compass stake-flag tick | Street |
| 7 | Anger rose (after a marking act) | Sneak or go loud | Puff off the Patch tag + grumble | Street |
| 7 | A new face discovered / a key Rivals event | Look at the board later | Sniff fill ring + scent outline + tape star; Rivals chip | Street |
| 7 | Morsels picked up | Low stakes | Pickup tick | Street |
| 8 | Damage numerals (Off by default) | Feedback only | Size by tier; weakness/resist in the spark shape | Combat |
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
| Boss window opens (yowl) | Edge crown pom + Sniff next morning | 3 s | 1 | High | Never in combat; replayed once after the tally |
| Roaming Boss moves stop | Edge crown pom | 3 s | 1 | Medium | At phase change; dropped in combat |
| Ally joins | Edge arrow + guest plate | 3 s yowl | 1 | High | In combat only; never queued |
| Rivals chip | TR under the dial | 4 s | 1 | Low | Held in combat, flushed after the tally; dropped on the walk home |
| Anger puff | TL, on the Patch tag | With the tag | 1 | Low | Merged with the Patch tag |
| Hint card | BC | Until done or dismissed | 1 | Medium | Queued in combat unless it is a combat hint |
| Patch tag / pickup tick | TL / TR | 3 s / 1.5 s | 1 / 2 merged | Low | Dropped if a fight starts |
| Bond hearts | Over Mikan | 2 s | 1 | Low | Home only |

Rules: Low and Medium items are held in combat and flushed after the tally (≤ 3 in sequence; stale Low items dropped). Same-type items within 500 ms merge. Town events, challengers and betrayals are never toasts: they arrive by bark, the Sniff or the Rivals board. No notification states that a cat changed because of what Mikan did to another cat (`key-screens.md` §1.1 rule 6).

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
| View / Menu | **Rivals** board / Pause | — / Pause |

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
| J / Esc | **Rivals** board / Pause | — / Pause |

Cut (DR-08): Whack, Bap, Righting input, hold-charge attacks, Tactics (slice), L3+R3 chord, Whisker Sense in combat, the bell ping, the Posse directive, right-stick peek.

**UX notes on the map (no redefinition):**
- At home, combat-only and Rivals bindings are inert; View does nothing (DR-24). On the walk home after a loss, View / J opens the Rivals board read-only (§3.6).
- Desktop only: gamepad and keyboard/mouse. There is no touch layout.
- Menu navigation everywhere: stick/D-pad move, South confirm, East back; keyboard arrows/WASD, Enter/Space, Esc. Mouse hover focuses; LMB confirms.
- Hold-to-commit (the Verdict) uses South / Space with a 600 ms ring; a press-then-confirm alternative exists (accessibility doc §4).

---

## 9. Tuning knobs

| Knob | Default | Range | Notes |
|---|---|---|---|
| HUD fade at the garden wall | 800 ms | 400–1200 | Pillar 2 beat; playtest the feel |
| Phase dial size / emphasis | 48 px / 4 s | 40–64 px / 2–6 s | Setting: Always / Contextual / Off |
| Enemy bar linger after hit | 3 s | 1–5 s | Clutter vs info |
| Damage numerals default | **Off** | Off / Big hits / All | R3 |
| Tag-In plate glyph pop | 115%, window length | 105–130% | Window length is Combat's |
| Relay chain drain | 3 s | Combat's value | Read, not owned |
| Controlled plate scale | ×1.3 | ×1.15–1.5 | |
| HUD scale | 100% | 80–150% | Accessibility doc §6 |
| Sniff card max | 5 | 3–5 | Canon caps the Rivals items at 3 |
| Rivals chip duration | 4 s | 3–6 s | Long enough to press View without stopping |
| Sniff-to-discover hold | 1.0 s within 10 m | Nemesis's values | Read, not owned |
| Walk-home autopilot | 60 s | Day Loop's value | Drain ring on the Head Home prompt |

---

## 10. Acceptance criteria

1. Random-pause test: 19 of 20 testers find the controlled cat in < 1 s with 6 enemies plus the Posse (the slice maximum) and T4 effects, at 1080p and 720p (10 combatants is the full-game stress test, Backlog).
2. In the combat prototype, ≥ 80% of testers can say, unprompted after one fight, "when the ring is on an enemy, press North for the Pile-On".
3. ≥ 75% of testers perform ≥ 1 Tag-In per encounter without a hint after the Life 1 teaching (supports DR-02).
4. No screen-anchored element enters the centre 40% or the bottom-centre keep-out, verified on capture at 16:9, 16:10 and 21:9.
5. Inside Haru's wall, a frame audit of every slice vignette finds zero panels, bars, numerals or system text outside the Doorstep Sniff.
6. No human utterance or writing is rendered, captioned or paraphrased in any HUD element, in any setting (string audit).
7. Every colour-coded HUD signal has a named non-colour twin (§6) and passes deuteranopia, protanopia and tritanopia simulation.
8. Every glyph-bearing element measures ≥ 28 px at 1080p / 18 px at 720p.
9. A median-skill tester reads the Sniff and leaves the Doorstep in ≤ 30 s (DR-16).
10. No playtester in the no-briefing test reports missing Dusk without noticing the dial.
11. In the Daifuku fight with a Cowed recruit, ≥ 70% of testers Tag-In to it before its ring runs out after the first hint; ≥ 80% can say afterwards why it was scared ("its old boss").
12. In a fight with an ally guest, ≥ 90% of testers never mistake the guest for an enemy (no attacks aimed at it; post-fight question), at 1080p and in deuteranopia simulation.
13. With the Boss window open, ≥ 80% of testers find Daifuku's current stop within 60 s of roaming using the compass tick.
14. On the walk home after a loss, ≥ 90% of testers reach the garden wall or start the autopilot without trying another verb more than once.
15. String and frame audit: no HUD element states or implies that a cat changed because of what Mikan did to a different cat; the Old Boss shows no defector-targeted mark.

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
- Pile-On prompt word: HUD teaches "Pile-On" by hint card only; Combat §3.17 also letters the word on its first 3 showings. Pick one after the combat prototype (the hint card is enough for UX).
- Random-pause test at 10 combatants (full-game stress test; the slice test runs at 6 enemies + Posse).

## Revision Log

**2026-11-24, Owner feedback pass (2026-11-24): only the elements the rulings touch (OR-01, OR-03, OR-06, OR-07, OR-08, OR-09, OR-11, OR-13, OR-16; patent note v2 §5).**

| Item | How |
|---|---|
| Influence on the street (OR-08) | §3.1: the Patch tag stays wisps-only (no bar, no %), gains the cracked-wisp "fading" stamp on your posts below Strong and a 2 s re-show after any marking act; §3.2 compass ticks for your fading posts |
| Boss anger (OR-07) | §3.1 anger puff off the Patch tag after an anger-raising marking act; §4.1 identity ribbon puffs; §5.3 Seething/Furious Sniff card |
| Roaming Boss (OR-09) | §3.1 edge crown pom when the window opens and at each stop change; §3.2 compass crown tick (top priority); §5.3 Boss-window Sniff card; §7 notifications |
| Challenger (OR-16) | §3.2 stake-flag compass tick; §5.3 "A stranger's scent" card |
| Discovery (OR-03) | §3.2 sniff-to-discover fill ring, scent outline and tape star; §3.1 Rivals chip after key events |
| Cowed and Fired Up (OR-06, OR-07) | §4.1.1: one status pom each, with a "why" badge (nicked crown / steam puffs) and drain ring; Tag-In clears Cowed; the Old Boss carries no defector-targeted mark (G4); §4.2 Daifuku-fight wireframe; §4.5 Standoff and Ally joins rows |
| Nose-Touch ally plate (OR-13) | §4.1.2: separate guest plate above the stack, dashed gold keyline and sprig, no glyph or Paws; nothing changes on the opposing Rival (G7) |
| Loss (OR-01) | §3.6 new: the closed street on the walk home (moon dial with door notch, thread at once, 60 s autopilot ring, everything else off, Rivals read-only); §4.5 Wipe row |
| Sniff cards (OR-11, OR-16, OR-19) | §5.3 priority table: Wavering (two-pip morning mark; first on the last-warning morning), Boss window, challenger, Declaration/arc closing, anger, town events; promoted/returned/Restless deleted; own-voice lines only (G8) |
| Naming (G12) | Fence Line → **Rivals** board throughout (§5.1, §5.3, §8); arc lead shown as *Sworn Enemy / Sworn Rival* |
| Platform | Desktop only (gamepad, keyboard/mouse; §8 note) |
| Acceptance | §10 items 11–15 |

**2026-11-24, Iteration 3 (round-2 presentation review, final pass).**

| Item | How |
|---|---|
| Fix 1 · Damage numerals (R3) | Default **Off** (§4.1, §6 P8, §9); option Off / Big hits / All kept; weakness/resist moved to Art's spark shape; no-world-text rule = one bark balloon + one lettered word |
| Fix 2 · Tone Sense Icons | Narrative's four tone puffs (Round, Spiky, Drooping, Bouncing) replace sun-pom / rain-cloud / zigzag / notes (§5.1, §5.2 wireframe) |
| Cat scale | World-anchored sizes assume Art's 1.25× (§2) |
| Backlog taken | Tag-In ease cites Camera's 0.3 s; random-pause test at 6 enemies + Posse |
| Names | Combat wireframe ribbon shows Togemaru, the First Thorn, Fear Cucumber |

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

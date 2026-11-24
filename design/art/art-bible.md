# Art Bible: Cat RPG

> **Status**: Round 2 (vertical-slice rewrite), Under Review
> **Owned By**: art-director
> **Last Updated**: 2026-11-24 (Iteration 3b: user decisions on engine, title, art style)
> **Art Director Sign-Off (AD-ART-BIBLE)**: Not yet reviewed
> **Canon**: `design/creative-brief.md` v1.4, then `design/reviews/round-1/director-rulings.md` (DR-xx). The first draft is archived at `design/backlog/first-drafts/art-bible.md` and is a content backlog, not canon.
> **Scope**: the vertical slice (DR-01): Lives 1–2, Hidamari Lane, Haru's House, the Lot. Full-game material is one line each in the Backlog section.

**Style reference.** The user's reference is the look of *Shin chan: Shiro and the Coal Town*: flat cel-shaded figures with a thin, even dark line, soft contact shadows, lush painted backgrounds with a soft-gradient sky, and warm, rounded, cream UI. **User ruling (2026-11-24): reference-close.** We match that look 1:1 on the visuals — 3D cel-shaded characters that read like 2D cartoon cels, in environments that read like 2D painted anime backgrounds — but in full 3D, under a free-rotating third-person camera; the reference's 3C is not copied. This is a rendering/look target only: all characters, names, locations and assets are original, and that game's characters, layouts and trade dress are never drawn, named or reused (brief §9 originality rule). Engine: Unreal Engine 5.8 (§6.1 rendering requirements).

**Ownership boundary.** Combat owns the game-feel/VFX tier table and every timing number (DR-07). The camera doc owns camera numbers (DR-48). UX owns HUD layout. This bible owns how things **look**: drawings, shapes, colours, line, materials, and the look-dev acceptance tests.

---

## 1. Visual Identity Statement

### 1.0 Visual identity in one paragraph

**A 2D anime cartoon you can walk around in.** Every frame should look like the reference: a flat, near-shadeless cel character with a thin even line, laid over a soft painted background with a gradient sky — a hand-made TV-anime frame. The difference is that the frame is fully 3D: the player walks Mikan anywhere and swings the camera freely, and from every angle the character still reads as a cel and the town still reads as a painting. Characters are 3D cel-shaded meshes made to read as 2D cels; environments are 3D geometry painted and lit to read as 2D anime backgrounds.

### 1.1 The one-line rule

> **Ink what acts, paint what stays.**
> Everything that moves, fights, can be knocked over, or loves you is a flat two-tone cel with an ink line. Everything that stays put is a soft, unlined painting. When a visual decision is unclear, ask which of the two it is.

This is the oldest tell of hand-made TV anime: the thing about to move is visibly a cel laid over a painted background. We turn it into grammar:
- **Readability:** cats pop off the town in any light and from any camera angle.
- **Affordance:** an inked bucket on a painted wall is obviously the bucket you can knock off.
- **Tone:** Haru, Gran and the cat are drawn in the same simple ink; the house around them is painted like a memory.

The third-person camera makes the rule more valuable than it was under the old bird's-eye view: the sky, the hills, distant roofs and human legs are all in frame now, so the separation between cel and paint is what keeps the cat the clear subject of every frame.

### 1.2 The line rule (testable)

| ID | Rule | Test |
|---|---|---|
| L-1 | **Inked:** all characters (cats, humans, crows), every interactive prop (knock-off items, Fear props, buckets, Scent Posts, the Stash, the cat flap, the piano lid and keys), and all VFX drawings. **Never inked:** terrain, buildings, foliage, sky, backdrop cards, set dressing a cat cannot affect. | Point at any inked object in a look-dev capture: a cat must be able to act on it. Point at any interactive object: it must be inked. Zero exceptions in the capture. |
| L-2 | Line colour **Aubergine Ink `#33273B`**, a single flat colour. No lighting, no texture, no gradient on the line. | Pixel-sample the line in Day, Dusk and Night captures: ΔE2000 ≤ 3 from `#33273B` (the exception is L-6). |
| L-3 | **Thin and even, like the reference.** Silhouette line 2.0 px at 1080p; interior lines (ear inner, mouth, toe splits, pattern-free creases) 1.25 px. Width is computed in screen pixels against the **current render-target height**, so it holds under dynamic resolution. | Measure at 1080p and at 85% resolution scale: the silhouette line is 2.0 ± 0.5 px and interior lines are 1.25 ± 0.5 px at output resolution. |
| L-4 | **Distance clamp.** Constant screen width from the close-up (cat ≥ 40% of screen height) down to the combat framing. If a character is smaller than 4% of screen height, its line drops to 1 px and interior lines switch off. | Dolly the camera from 0.5 m to 12 m from a cat: there is no hairline in close-up and no black blob at distance. |
| L-5 | Method: inverted-hull silhouette with smoothed normals baked per mesh, plus authored interior lines (mesh-strip or texture). No full-screen edge-detect post pass on characters, because it would ink the environment and break L-1. | A technical-artist review confirms no screen-space edge pass touches environment pixels. |
| L-6 | **Dark coats at Night**: cats with Charcoal or Black coats swap their silhouette line to Reverse Ink `#8C82A8` in the Night key only, so the silhouette survives a dark ground. | Night capture of a black cat on Night ground: silhouette-to-ground contrast ≥ 3:1. |
| L-7 | Patterns, socks and coat patches are **borderless flat shapes**: there is never an ink line around a coat patch. | Visual review. |

### 1.3 Supporting principles

| # | Principle | Design test | Pillar |
|---|---|---|---|
| P1 | **Read from behind.** The gameplay camera sits behind the cat. Identity is built on the back three-quarter view first: tail carriage, ear set, back pattern, gait. The face is for close-ups, Standoffs and home shots. | When a cat needs more identity, change tail, ears or back pattern before the face. | 4 Rivals Remember; 3 Conduct the Brawl |
| P2 | **Thirty centimetres tall.** Detail is spent where a cat looks: floors, wall bases, under verandas, shoes, hands. Above about 1.2 m the world simplifies into larger painted shapes, then sky. | When budgeting texture, modelling or animation on a human or a room, spend it below 60 cm. | 1 Cat's-Eye Truth |
| P3 | **Colour says what words cannot.** Every household human owns one colour, every Clowder owns one, every phase owns a key. | When a home beat does not read, change a colour, an object or the light. Never add a readable sign, and never add a gag. | 1; 2 Two Lives, One Clock |
| P4 | **Loud street, quiet house.** The street gets the action-anime toolbox (§10). The house gets none of it: held shots, soft light, small gestures. | A flat home scene gets slower and better lit, never VFX. A flat street scene gets timing contrast and a bigger drawing, never melancholy. | 2; 3; tone guardrails |
| P5 | **Cel characters, painted world.** Characters look like 2D cels, as in the reference: near-flat two-tone fills, hard edges, no glow. Combat VFX and combat UI (our own content; the reference has no combat) use the same flat language, with halftone instead of alpha fades. Environments and sky are soft painting: gradients, brush texture and soft shadow edges are allowed and wanted (DR-51; reference-close, user ruling 2026-11-24). | If an effect or character needs to soften, use a stepped tone or halftone. If a background feels harsh, soften it with paint. | 3 (readability) |

### 1.4 What makes this look ours (differentiation)

**The rendering style is not where we differ.** By the user's ruling (2026-11-24) we match the reference's look as closely as we can: cel characters, thin even line, painted backgrounds, soft gradient sky, warm cream UI. We do not push shading, line or texture away from it to look different. Differentiation comes from **what is drawn and how it is played**, in order of weight:
1. **Our original characters:** a cat cast built from bean, chestnut and pom shapes (Mikan, the Crew, the Rivals), the household seen from the knee, with no human caricature and nothing taken from the reference's cast.
2. **Our original world:** Yunagi, a cat-height seaside hill town where the sea or the hill is in the backdrop of every exterior view and Dusk is the signature hour; Haru's House, the Lot and the High Road.
3. **The free third-person camera:** the reference composes fixed 2D-looking frames; we let the player walk anywhere and orbit freely (`design/gdd/camera-system.md`), so the painted world must hold from every angle (§6.1).
4. **Our own UI content and shapes:** bean panels, pom buttons, a paw-pad cursor, chestnut portrait windows (§7), and screens nobody else has — Whisker Sense (scent made visible), Slow Blink, the Fence Line, the Turf Board. Cream and brown are warmth we share; shapes and content are ours.
5. **Action-anime combat staging** (§10): impact frames, smears, speed lines, a dust-cloud Pile-On, hand-lettered sound words. The reference has no combat.

Line hue is **not** a differentiator (aubergine and brown are indistinguishable at 2 px; AB-14). **Composition rule (DR-51):** home key art never uses the inside-looking-out veranda-to-garden frame with a pet in the yard. The veranda is shot from the garden side or along its length at floor level, and Mikan's ginger cap is in every home key frame. Concept art that could be mistaken for a still from the reference *because it shows that game's characters, places or compositions* fails review even if every other rule is met; matching its rendering style is the target, not a failure.

---

## 2. Mood & Atmosphere

Each state must be tellable from a thumbnail. Energy is the density of motion and effects on screen.

| State | Emotional target | Lighting character | Carrier element | Descriptors | Energy |
|---|---|---|---|---|---|
| **Explore, Morning** | A town waking | Low warm sun, long lavender shadows, mist cards in low lanes | Long shadows of laundry poles and fence slats across the lane | dewy, pale, airy | Measured |
| **Explore, Day** | Swagger, summer holiday | High near-white sun, short wisteria shadows, tall cumulus in a deep sky | The postcard: saturated sky over plaster walls and gardens | bright, crisp, saturated | Lively |
| **Explore, Dusk** | The pull toward home | Low orange sun, long plum shadows; windows switch on; the lamp wave runs uphill with the chime | Warm window rectangles in cooling streets; the bell-gold Head Home thread | golden, nostalgic, tender | Slowing |
| **Explore, Night** (from Life 2 day 2) | The town belongs to cats | Bright moon-blue; nothing truly dark (value floor L* 22); warm lamp pools | Cat eyes glint; roof edges silvered; no humans | cool, luminous, secret | Tense, sparse |
| **Whisker Sense** | Seeing the hidden map | World drops to lavender-grey; scent drawn flat and saturated | Clowder-coloured trails; the scent compass ring around Mikan | hushed, drained, legible | Still |
| **Standoff** | A comic showdown | Scene dims 15% outside the two cats; a hard light wedge between them | Name-card in the upper third (UX-X13); speed-line bands behind each cat | theatrical, cheeky | A held breath |
| **Combat** | A loud, readable cartoon brawl | Scene light unchanged (no scene transition); one screen-wide effect at a time | Keylines, slash arcs, dust, lettered words on big hits | punchy, clear, percussive | Frenetic |
| **Slow Blink** | Calm control inside chaos | Town saturation −30%, value −10%; cats keep full colour; eyelid vignette | The eyelid shape closing top and bottom | suspended, focused | Near-still |
| **Pile-On / Zoomies** | The crowd-pleaser | Flat graphic panels replace the scene for a beat | The scalloped dust cloud; the cut-in band | explosive, silly, triumphant | Peak |
| **Verdict** | Status settled | Scene light; the loser centred and small; a flat spotlight shape on the ground | Four choice bubbles around the Routed cat | deliberate, smug | Low |
| **Defeat (slinking home)** | A sting, not a punishment | Scene light with a 10% cool dip; no red; no flashing | Mikan small in frame, ears flat; the victor high on a wall | sheepish, bruised ego | Low |
| **Home** | Safety and tenderness | Softer contrast than the street; one motivated light source; Life 1–2 colour script (§4.6) | Haru's yellow at knee height; the piano; the bowl | warm, still, observed | Contemplative |
| **The Lot** | Clubhouse pride | Same phase key as the street; rust and tarp colours | The rusting kei truck as a throne | scruffy, cosy | Relaxed |
| **Doorstep / Morning Sniff** | "What happened overnight?" | Morning key, low angle; the Tribute pile catches the first sun | Stamp cards unrolling from scent wisps (DR-24) | curious, rewarding | Low, rising |

Rule: the street is never tragic and the house is never slapstick in the same beat.

---

## 3. Shape Language

### 3.1 The primitives

| Primitive | Looks like | Used for | Says |
|---|---|---|---|
| **Bean** | A soft asymmetric capsule | Cat bodies, UI panels, bark balloons, dust clouds | Soft, alive, friendly |
| **Chestnut** | Rounded, wider at the bottom, soft point on top | Cat heads, portrait windows, icons | Cat |
| **Pom** | A small imperfect circle | Mikan's tail, the bell, paw-pads, Paws on the gauge, buttons | Ours: the hero accent |
| **Wedge** | A triangle with one soft corner | Ears, claws, slash arcs, speed lines, warnings | Sharp, fast, threat |

- **Cats** are beans and chestnuts with wedge ears. No straight lines on a cat; at most one sharp point per feature.
- **Humans** are longer, straighter and calmer than cats: columns for legs, soft boxes for torsos. Hands are the exception: fully articulated and expressive.
- **Town:** straight but never ruled. Architecture has a slight hand wobble and paint-softened corners. Wall tops, fences and roof ridges run as long horizontals, because they are the High Road and must read as walkable ribbons.
- **Danger and impact** are wedges and zigzags. The only spiky shapes in the game are claws, slash arcs, the Frazzled fur-puff, impact bursts and the red telegraph's edge.
- **UI** echoes the cats (beans, chestnuts, poms), never the architecture.

**Hero shapes** belong to one owner only: Mikan's pom tail and ginger cap; the bell; Daifuku's silhouette; the Pile-On's scalloped dust cloud; the Slow Blink eyelid. Supporting shapes stay lower in contrast and saturation than any hero shape on screen.

### 3.2 Cats in third person: what carries identity

The cat is large on screen (≈ 10–20% of screen height in exploration, DR-48), and the camera sees it from behind and slightly above. Identity is carried, in order, by:

1. **Tail**: the biggest moving shape in a behind-the-cat frame. Shape comes from the generator; **carriage** (height, curve, motion) comes from personality (§3.3).
2. **Ears**: shape from the generator; set and motion from personality; Scars modify them.
3. **Back pattern**: the dorsal coat read, designed on the top view first.
4. **Body build and gait**: build is one of three base meshes; gait comes from personality; stance in a fight comes from Style.
5. **Face**: close-ups, Standoff name-cards, Verdicts and home only.

**Separation of carriers (the rule that keeps 6 × 3 combinations legible):**
- **Style** owns the *body mesh weighting, combat stance and attack animation* (Bruiser plants wide and low; Scrapper bounces on its toes; Yowler stands chest-out, head high).
- **Personality** owns *tail carriage, ear set, idle, walk, bark poses and the Pile-On flourish*.
- **History** owns *Scars and regalia*.
- **Clowder** owns the *outline colour* in combat.

So a Braggart Yowler and a Fraidy Yowler fight from the same stance but walk, idle and hold their tails completely differently.

### 3.3 The six personalities: silhouette signatures

Each personality gets one animation set (DR-37: idle, walk, posture, bark intents, Pile-On flourish). The signature must read **from behind at exploration distance, in silhouette, with the tail shape varied**. Tail carriage is a pose, so it works on any generated tail. For stub tails, ears and gait carry the read.

| Personality | Tail carriage | Ears | Posture and walk | Idle (loops ≈ 4 s) | Pile-On flourish | Silhouette keyword |
|---|---|---|---|---|---|---|
| **Braggart** | Straight up, tip hooked forward like a flag; sways with the stride | Forward, high | Chest out, shoulders rolling, a strut with a hitch in every fourth step | Sits tall on the highest nearby surface; licks a paw and flicks it at the camera | Pops out of the cloud on top, striking a pose | **Flag** |
| **Brooder** | Low, level with the hocks, dead still apart from one slow tip flick | Half-sideways ("airplane") | Head low, slow heavy steps, stops to stare back | Loaf with tail wrapped tight round the feet; eyes half shut and tracking | The last to leave the cloud, slowly, dusting itself off | **Anchor** |
| **Schemer** | Horizontal, tip twitching fast | Swivel independently | Low slink, belly near the ground; sidesteps along walls | Crouches at a corner, peeks round it, ducks back | Slips out of the cloud sideways before it ends | **Blade** |
| **Fraidy** | Tucked low and curved under; bottle-brushes at loud noises | Back, flattened | Crouched, stop-start trot; looks over its shoulder every few steps | Hunches small; startles at a leaf and freezes | Bolts out early, then peeks back in | **Comma** |
| **Stalwart** | Upright and straight, steady, no sway | Upright, steady | Square, even gait; turns its whole body to face things; stays beside the controlled cat | Sits squarely facing the controlled cat; slow blink at the camera | Steps out last but one and stands guard over the target | **Post** |
| **Goofball** | Up with a loose wobbling curl, never still | One ear flicks out of sync | Bouncy, a skip every few steps; zigzags toward props | Rolls on its back; bats at its own tail; head tilt | Tumbles out of the cloud rolling, tail first | **Spring** |

**Acceptance (personality read test):** render the six personalities on one identical generated cat (same mesh, tail and coat), from the exploration camera behind and above, as flat black silhouettes, walking and then idling, 4 s each. Testers who saw a one-page key once must match ≥ 5 of 6 (≥ 80% of testers). Repeat with two different tail shapes (long and stub): ≥ 4 of 6.

### 3.4 The coat generator (slice)

The slice tracks ≤ 12 Rivals plus Strays and generated Crew, so the generator is deliberately small (AB-13; DR-48 relaxes the old 48 px rules).

| Axis | Options | Notes |
|---|---|---|
| **Base mesh** | 3 on one skeleton: **Round** (heavy, Bruiser-weighted), **Standard**, **Long** (lean) | Size, fur puff and kitten proportions come from bone scale; smoothed outline normals baked per mesh |
| **Tail shape** | 4: **long whip**, **plume**, **thick ringed**, **short stub** | The round **pom** is reserved for Mikan. "Kinked" and "puffed" are Scars, not generator options |
| **Ears** | 3: **standard**, **tall narrow**, **small round** | "Notched" and "folded" are Scars |
| **Pattern class** | 6: **solid**, **bicolour with white**, **tabby** (3–5 bold bands), **patched** (calico/tortie, large blocks), **pointed**, **tuxedo** | Borderless flat shapes. The dominant mark is ≥ 8% of dorsal area. Max 3 coat colours |
| **Coat colour** | 10 fills (§4.3), each with an authored shade | Mikan Ginger never generated |
| **Eyes** | amber (Mikan's family), green, yellow-green, blue, copper, odd-eyed | Flat disc, ink pupil, one hard white highlight |

**Distinctness rules (generator enforces):**
1. No two tracked cats in the district share (base mesh × dominant colour × pattern class).
2. Never generated: a ginger cap over both ears on a white body; a pom tail; a red collar; Daifuku's signature silhouette.
3. Wall Sitters bias ≈ 60% toward White, Cream and Silver coats, so the gang reads as a family.

**Rank scale:** Tough ×1.0 · Captain ×1.15 · Daifuku ×1.6 (authored). Bigger always means higher rank.

**Global cat scale (iteration 3; brief v1.3).** **One cat scale for every cat: 1.25× a real cat (≈ 0.56 m nose to rump), the same on the street and at home, with no per-context swap.** Humans, furniture and props are true scale. The Life 1 kitten comes from bone scale (§5.1), and the rank scale above multiplies on top of 1.25×. Camera (`camera-system.md` §4.1) and HUD size their floors against this value. Confirmed by Camera's home mock (T3): Mikan in a 16-year-old's lap and on the piano bench must read as a cat, not a dog.

### 3.5 History worn on the model: silhouette Scars and Titles

Scars are cartoon-cosmetic and never read as wounds: no red, no open marks, no blood (tone guardrails). DR-40: every player-sourced Scar is a **silhouette Scar** until the cat has two. All six are placed to read **from the behind-and-above camera**.

| Silhouette Scar | Build | Where it reads from behind |
|---|---|---|
| **Ear notch** | Ear mesh swap: a V bite from the top edge | Ear outline against the sky or wall |
| **Folded ear** | Ear bone pose plus mesh swap, tip folded forward | Asymmetric ear pair |
| **Kinked tail** | Two tail bones locked at 40° (one lightning bend) | Tail line |
| **Puffed tail** | Permanent bottle-brush tail shell (zigzag contour) | Tail mass |
| **Cowlick** | A flat wedge tuft standing up from the crown | Top of the head, between the ears |
| **Head plaster** | A cream cross-plaster (Paper Cream, inked) on the crown, between the ears | High-contrast cream mark on top of the head |

Non-silhouette Scars (third and later; close-up only): three pale scratch lines on a flank (lighter than the coat, never red), a bald patch, a bent whisker. At most 4 Scars shown. The first Scar goes to the side the finishing hit came from where data allows. **Mikan's plaster** after a wipe (DR-40.6, tag `mikan_plastered`) uses the head-plaster asset, placed over the ginger eye patch at the brow.

**Titles (6 in the slice)** appear as a **stamp emblem** on the Standoff name-card and the Fence Line: an inked roundel in the Clowder colour with one pictogram (no letters). The HUD ribbon and Rival card show the stamp **and** the Title as readable text: Titles are cat language, which is allowed. Captains and Daifuku also wear one piece of **regalia**, a found object: a frayed rope loop, a clothes-peg on one ear, a bottle-cap pendant, a leaf that never falls off. **Collars mean pets:** in the slice only Mikan wears one. Bell Clowder Crew wear a knotted **bell-gold cord** at the tail base (a gang mark, not a collar), so Sentries read as yours in the world without UI.

### 3.6 Environment and UI shape rules

- High Road surfaces read as **continuous pale ribbons** with a lighter top edge, visible from below as a skyline of walkable lines. Anything you cannot walk on is broken up, darker or foliage-covered.
- **Scent Posts** are tall, landmark-shaped hero props, inked, standing clear of clutter on ≥ 1 m of quiet ground, with a silhouette that reads against the sky from 30 m (DR-47).
- UI shapes are in §7.2.

---

## 4. Color System

All hex values are sRGB as they must arrive on screen under the neutral Day key. Tone-mapping must not shift them (ΔE2000 ≤ 2 after compression and grading, AB-15). Contrast ratios are WCAG 2.x; colour-vision checks use CIEDE2000 under Machado 2009 full-severity simulation.

### 4.1 Core palette (12)

| # | Name | Hex | Meaning |
|---|---|---|---|
| 1 | **Aubergine Ink** | `#33273B` | Every character, prop and VFX line; UI body text. Our black. |
| 2 | **Paper Cream** | `#FFF6E3` | UI ground, balloon fill, dust clouds, the rim on every keyline and outline. |
| 3 | **Cocoa** | `#6B4A35` | UI frames, headers and button fills (with Cream text). The brown in "cream and brown". |
| 4 | **Mikan Ginger** | `#F28C28` | The protagonist. Reserved; never generated, never used in the Lane palette. |
| 5 | **Collar Crimson** | `#D02A45` | The collar, Bond hearts, the single "confirm" UI accent (always with Cream text). Never damage or danger. |
| 6 | **Bell-Gold** | `#F2B01E` | The Bell Clowder: Posse keyline, overhead tick, Head Home thread, everything that is the player's. |
| 7 | **Haru Yellow** | `#FFD23F` | Haru. Exclusive inside the house. |
| 8 | **Shadow Wisteria** | `#6E6AA8` | The shadow family on cels and paint. No grey or black shadows anywhere. |
| 9 | **Summer Sky** | `#3F9BE6` | The Day sky zenith; outdoors, freedom. |
| 10 | **Garden Green** | `#5A9E4B` | Lane gardens, hedges and hills. |
| 11 | **Wall Sitter Sage** | `#A8C878` | The slice's enemy Clowder (DR-51). |
| 12 | **Frazzle Magenta** | `#FF3D8B` | Frazzled state and the red-class telegraph. The loudest colour in combat. |

**Bell-Gold and Haru Yellow are a deliberate family:** the bell came from Haru. They are kept apart by context (gold on the street and in UI; yellow at home), by value and hue (gold darker and more orange, ΔE 9.4), and by form (gold is always poms, bells, threads and marks; yellow is always cloth, plastic or light).

### 4.2 Tone rules

- Every cel colour has exactly **two tones**, lit and shade. The shade is **authored**, not computed: hue rotated 8–15° toward violet, saturation +5 to +10 points, value −18 to −24 points (HSV). Whites shade to lavender `#D8D2EA`, never grey.
- **Shade share:** under the Day key, the shade tone covers 15–25% of a character's visible area, with a hard terminator. This is closer to the reference's nearly flat fills than the first draft's 25–35%.
- **Value bands:** walkable painted ground stays inside L* 35–80 with local contrast ≤ 15 L* points. Cels own the extremes (near-white coats, the ink). This is the main reason cats read on any ground.
- **Saturation ceiling:** painted backgrounds ≤ 70% HSV saturation, the sky and backdrop cards ≤ 75%. Cels, VFX and signature objects may reach 90%.

### 4.3 Semantic colour (corrected)

Shape always backs colour. Fixes from AB-7 and DR-51 are marked ✱.

| Meaning | Colour | Hex | Shape backup |
|---|---|---|---|
| Posse / Bell Clowder | Bell-Gold keyline + 1 px Paper Cream rim ✱ | `#F2B01E` | Overhead **chevron** tick on allies; the **controlled cat** carries the **bell** tick (HUD §4.1 priority 1) |
| Wall Sitters (enemy) | Sage outline + 1 px Paper Cream rim ✱ | `#A8C878` | Brick-block emblem on name-card and Fence Line |
| Stray (untracked) | Ink outline + Cream rim | `#33273B` | No emblem |
| Nerve | Nerve Green ✱ | `#5CC46B` | Bar length. Below 25% the fill becomes Ink-hatched Paper Cream and wobbles (the coral low state is removed: coral is Koharu's) |
| Paws | Pad Pink | `#F6809A` | Paw-pad segments; a full pad pops and gains a highlight dot |
| Frazzle gauge | Static Yellow | `#FFE14A` | Zigzag-edged bar |
| Frazzled | Frazzle Magenta | `#FF3D8B` | Fur-puff silhouette, spiral eyes, orbiting squiggles |
| Ruffled ✱ | **No hue**: Ink and Cream only (Ruffle Orange is retired; ΔE 4.0 from Mikan Ginger) | — | Raised hackle ridge, cream sweat-drop mark, steady 2-step rim pulse ≤ 3 Hz |
| Claw | Ice Cyan | edge `#39C6F0`, core `#EAFBFF` | Three parallel thin crescents |
| Thump ✱ | **Cream and Ink only** (moved off Bell-Gold: Thump Amber was ΔE 4.0 from the keyline) | core `#FFF6E3`, star `#33273B` | Thick ring plus four-point Ink star and dust skirt |
| Yowl ✱ | Yowl Lilac (Yowl Lime retired: it collapsed with Wall Sitter Sage for deutan players) | `#B9A0FF` | Wavy concentric arcs |
| Heal / purr | Purr Rose | `#FFB3C1` | Rising soft rings, small heart |
| Incoming hit cue ✱ | Ink halftone edge pulse | `#33273B` @ 40% dot | Directional wedge at the screen edge |
| Morsels | Fish Silver-blue | `#9CC7E0` | Fish icon |
| Shinies | White + three-colour glint | `#FFFFFF` | Four-point sparkle |
| Bond | Collar Crimson | `#D02A45` | Hearts |

**Telegraphs** (DR-28, DR-51; class names are canon, rendering is ours). Each is a ground decal plus an overhead glyph:

| Class | Decal | Overhead glyph |
|---|---|---|
| **White: dodge it** | Solid white `#FFFFFF` fill at 35% halftone, Ink rim, chevrons pointing outward | Ink chevron pair |
| **Yellow: Hiss it** | **Paper Cream dashed** outline, no fill | Cream **triangle** with an Ink "!" bar |
| **Red: get out** | **Frazzle Magenta** fill, **zigzag edge**, Ink diagonal hatching | Magenta zigzag burst |

Frazzle Magenta's linear red ratio is 0.77, under the 0.8 saturated-red threshold, so a telegraph appearing is not a red flash. Collar Crimson (0.88) never changes over more than 5% of the screen; in practice it is only ever the collar and small UI accents.

**Outline order on every combatant**, inside to outside: Aubergine Ink silhouette line (L-3) → keyline or Clowder outline (2 px at 1080p) → **1 px Paper Cream rim**. Contrast against the ground comes from cream against ground, not hue against ground, so the Posse keyline survives warm lamp pools (it was 1.08:1 against lamp glow before the rim).

### 4.4 Hidamari Lane palette and phase keys

**Lane swatches** (painted environment):

| Role | Name | Hex |
|---|---|---|
| Dominant | Plaster | `#F3E3C3` |
| Ground | Sun-baked lane | `#B9AC93` |
| Secondary | Garden Green | `#5A9E4B` (darkened from the draft's `#6FB552` to separate it from Sage) |
| Accent | Hydrangea | `#7E8FD8` (replaces Persimmon `#F0803C`, which sat on Mikan Ginger) |
| Deep | Roof tile | `#6F8296` |
| Wood | Warm wood | `#C28A52` |
| Glow | Laundry white | `#FFFDF4` |
| Night glow | Lamp | `#FFD98A` |

**Clowder separation rule (automated):** no Clowder outline colour may lie within ΔE2000 15 of any swatch in its own district palette, under normal vision and under protan, deutan and tritan simulation. Sage against Garden Green and against the lane ground are the pairs to watch. If either fails in the look-dev capture, the **swatch** moves; the Clowder colour is canon (DR-51).

**Phase keys** (town-wide, biased by the Lane palette):

| Phase | Sky zenith | Sky horizon | Key light | Shadow | Cel tint | Notes |
|---|---|---|---|---|---|---|
| **Morning** | `#BFE3F2` | `#FFE9C7` | `#FFF4DC` | `#8FA0CF` | `#FFF6E8` | Sun ≈ 20°; mist cards; dew glints |
| **Day** | `#3F9BE6` | `#A9DBF5` | `#FFFBEF` | `#6E6AA8` | `#FFFFFF` | Sun ≈ 65°; tall cumulus with `#C9D8F0` shade |
| **Dusk** | `#8E6FB0` | `#F7A45A` | `#FFC27A` | `#7A4E8C` | `#FFDDB5` | Sun ≈ 12°; windows `#FFD98A`; the key-art hour |
| **Night** | `#1F2F6B` | `#3F5FB0` | `#BFD4FF` (moon) | `#2A3470` | `#B8C8F5` | Value floor L* 22 in the play space; warm lamp pools |

Phases blend over ≈ 20 s of roaming time. The drowsy end-of-phase state adds a soft cream edge vignette, never a dark one.

### 4.5 The household in the slice

| Human | Colour | Hex | L* | Textile motif (backup cue) | Slice objects |
|---|---|---|---|---|---|
| **Haru** (16–18) | Yellow | `#FFD23F` | ≈ 86 | Plain block colour, round forms | Raincoat, round hair clip, slippers, socks, mug, study-lamp shade, bag charm |
| **Gran** | Plum | `#8E4A7B` | ≈ 41 | Small cross-hatch weave | Cushion, apron, shawl, the cloth under the Grandpa photo |

Haru's school uniform is navy `#2F3E63` with yellow socks: from cat height, uniform legs plus yellow socks are her Life 2 silhouette. Rules: a signature hue at full saturation is never used on any other object inside the house. Haru and Gran differ by 45 L* as well as hue, and each has a motif, so the story survives colour-blindness and greyscale. Sora (teal) and Koharu (coral) are Backlog; their hues are already reserved.

### 4.6 Life 1–2 colour script (home)

| Life | Key and light | Haru Yellow presence | Gran Plum presence | The image |
|---|---|---|---|---|
| **1 The Box in the Rain** | Rain blue-grey `#7C8FA6` outside (exterior saturation −30%); lamp amber `#FFC98A` inside | The only saturated thing in the rain: the raincoat (≈ 10% of frame) | Present, stern, large blocks (≈ 8%) | A yellow shape bending over a wet box; the red collar arrives |
| **2 Uniform** | Spring-clear greens; desk-lamp pool `#FFE7A3` at night | Small and everywhere: clip, bag charm, mug, socks (≈ 6%) | Warm, softened (≈ 8%) | Navy legs and yellow socks; a lit window late at night (K2.2+K2.4 "Lamp at Night") |

Presence figures are set-dressing direction, not metrics. Rule held for the full game: Life 1's raincoat composition must be reproducible (Life 8 rhymes with it; Backlog).

### 4.7 UI palette

| Role | Hex | Contrast |
|---|---|---|
| Panel ground | Paper Cream `#FFF6E3` | — |
| Panel recessed | `#F4E6C8` | — |
| Body text | Ink `#33273B` | 13.1:1 on Paper Cream |
| Frames, headers, primary buttons | Cocoa `#6B4A35` | 7.4:1 against Paper Cream; Cream text on Cocoa 7.4:1 |
| Secondary text | Cocoa `#6B4A35` | 6.4:1 on recessed |
| Panel drop shadow | Shadow Wisteria `#6E6AA8`, 3 px offset, 2 px soft edge | — |
| Player accent | Bell-Gold `#F2B01E` | Ink text on it 7.4:1 |
| Confirm accent | Collar Crimson `#D02A45` | **Cream text only** (4.8:1); Ink on it fails at 2.7:1 ✱ |
| Disabled ✱ | Text `#8C7A70` on `#F4E6C8` | 3.3:1 (was 1.45:1) |
| Positive | `#5CC46B` | Ink text 6.4:1 |

The UI never uses the household hues at full saturation, and never painted texture.

### 4.8 Colour-vision safety

| Risk pair | Backup |
|---|---|
| Posse keyline vs. Sage outline | Gold has the overhead chevron tick (bell on the controlled cat); enemies carry the Frazzle gauge; outline widths differ in greyscale (gold keyline 2 px, Sage outline 2.5 px) |
| Bell-Gold vs. Static Yellow vs. Haru Yellow | Context: gold is street and keyline, Static Yellow is gauge only, Haru Yellow is home only. Shapes differ (tick, zigzag bar, cloth) |
| Claw vs. Summer Sky | Claw arcs always carry an Ink keystroke on their outer edge |
| Yowl Lilac vs. Shadow Wisteria | Lilac is lighter by ≈ 25 L* and is always a wavy arc |
| Frazzle Magenta vs. Collar Crimson | Magenta is never on Mikan; Crimson is never an effect |
| Nerve state | Length plus hatching and wobble at low Nerve |
| Telegraph classes | Solid / dashed / zigzag edge plus three glyphs: distinct in greyscale |

**Acceptance:** every combat capture in look-dev passes a greyscale review (all three telegraphs, Posse and enemy, Frazzled vs. normal told apart) and a deutan/protan simulation review.

---

## 5. Character Design Direction

### 5.1 Mikan (fixed design; canon brief §3.1)

A ginger-and-white Japanese bobtail: white body `#FFF8EC`, ginger cap over both ears and a ginger patch over the left eye in Mikan Ginger, **pom-pom stub tail** (a hero shape), amber eyes `#FFB52E`, **red collar with one small brass bell**. From behind, the read is: ginger cap and two ginger ears, the red collar line, white back, pom tail. That read must survive every lighting key.

- **Kitten (Life 1):** big head (≈ 1.35× bone scale on the head), short legs, the bell oversized on the collar, a wobble in the walk.
- **Young adult (Life 2):** standard Scrapper proportions, bouncing toes in a fight.
- One rig and one mesh; kitten proportions come from bone scale and a head-mesh variant.
- The bell catches a **glint on the fourth beat** after the Call (DR-53, DR-54): a four-point Paper Cream sparkle for two rendered frames, no luminance flash.
- Mikan's personality is the player's, so Mikan has no personality set. Mikan has the Scrapper stance plus a "pet" home set (Rub, Lap, Meow, Knock, Eat, walk on the piano keys).

### 5.2 Hero cats in the slice (authored)

| Cat | Read from behind | Notes |
|---|---|---|
| **Daifuku** (Boss) | An enormous white-and-grey loaf: ×1.6 scale, Round mesh at maximum puff, grey saddle like a dumpling dusting, thick short tail, folded jowls visible past the cheeks from behind | Never leaves his wall voluntarily; his silhouette on the wall top is the Lane's skyline landmark. Knock-off and bucket-splat poses are hero animations. Wears no regalia: he is the wall |
| **The old wall cat** | A lean grey elder on the Long mesh, the only generator-exempt notched ear in the slice, a slow tail | Look is final; personality comes from Crew/Narrative, and the design must not depend on it |
| **Second story recruit, Friend Stray** | Generated within the rules, then hand-tuned for contrast with Mikan and the old wall cat | Each must differ from the others on base mesh and pattern class |

### 5.3 Telling cats apart at a glance

| Who | Exploration (cat 10–20% of screen height) | Combat (camera at 6–8 m) |
|---|---|---|
| Controlled cat | Centre of frame | Bell-Gold keyline + tick; never covered by effects |
| Other Posse cats | Gold cord at the tail base | Bell-Gold keyline + tick; edge arrows when off screen (UX) |
| Wall Sitters | Sage-tinted scent wisps at their posts; posture | Sage outline + Cream rim; Frazzle gauge; Captains ×1.15 with regalia |
| Nemesis / arc lead | Storm-mark glyph above the head in Standoff and on the Fence Line | Same outline; a storm-mark stamp on its Frazzle gauge (UX) |
| Strays | Ink outline only, no emblem | Ink outline + Cream rim |
| Crows (Critters) | Inked cel birds, glossy blue-black `#2B2F4A` with Reverse Ink line | Ink outline; no Clowder colour |

**Combat size floor (art requirement to the camera doc):** in the default combat framing, a Tough is ≥ 6% of screen height (≈ 65 px at 1080p). The silhouette tests run at that size, moving, at 60 fps, with T2 effects on screen. Crowd-fight readability below that size is Backlog (DR-48).

### 5.4 Expression and pose

- **Faces:** two flat eyes with an ink pupil and one hard highlight, a small nose wedge, a line mouth. Expressions swap as drawn face decals (12 per cat: neutral, smug, angry, shocked "take", hurt, happy, sleepy, Frazzled spiral, sad, purr, hiss, slow blink).
- **Poses are graphic first:** the silhouette of every key pose must read in solid black. Arches, puffed tails, bunny-kicks and loafs are the vocabulary.
- **Comedy marks** (sweat drop, anger cross, tear drop, stars) are flat cream or Ink shapes, never liquid-looking.

### 5.5 Humans from cat height

The camera is at cat height at home and low on the street, so humans are mostly **knees, shins, shoes and hands**, unless they bend down (DR-48).

- **Proportion:** naturalistic anime, adults 7–7.5 heads, Haru at 16 slightly less; correct, simplified anatomy. Never caricature.
- **Detail lives below 60 cm:** shoes, slippers, socks, hems, trouser creases, bag bottoms, hands. **Shoes are character design.** Each household member has a readable shoe wardrobe; the genkan's shoe line-up is a story display.
- **Hands are the faces.** Best topology, a pose library, the most animation time. A slow palm-down approach is how a human "speaks" to Mikan.
- **Faces are rare and plain:** two eyes with one highlight, a small nose mark, a line mouth, a blush shape. Shown only when a human crouches, bends or lifts Mikan; never large on screen for more than a few seconds, and never to deliver information that staging could carry.
- **Signature colour sits low:** each household human shows their colour below 60 cm in every costume (socks, slippers, hem, cuff, apron edge) plus their textile motif.
- **Mouths stay closed** for Murmur (DR-53: household actors closed-mouth).
- **Street humans are weather:** simpler models, muted Lane colours at −30% saturation, no signature hues, no faces designed to be read. Seen as legs, bags, bicycle wheels and the occasional crouching hand with a treat (begging).

### 5.6 LOD philosophy

| Distance band | What survives |
|---|---|
| Close-up / home (cat ≥ 30% of screen height) | Everything: face decals, whiskers, the bell, non-silhouette Scars, gold cord knot |
| Exploration (10–20%) | Tail, ears, back pattern, silhouette Scars, regalia, collar and bell, personality gait |
| Combat (≥ 6%) | Outline colour, rank scale, tail carriage, Frazzled/Ruffled silhouettes, silhouette Scars as a shape change |
| Far (< 4%) | Silhouette and dominant colour only; line drops to 1 px (L-4) |

---

## 6. Environment Design Language

### 6.1 The environment method (DR-48, E-2 default) and the look-dev spike

**Method:** 3D geometry, toon-shaded, **unlined**, with stylised hand-painted textures and trim sheets plus vertex colour for variation and grime; **painted skydome and painted backdrop cards** for sky, hills and sea. The camera-aligned paint-over plate method is withdrawn because the camera rotates (AB-1 moot).

**Engine rendering requirements (Unreal Engine 5.8; for the look-dev spike to prove).** These are requirements, not verified API claims: each names a plausible UE approach for the spike to try, and the chosen method goes into an ADR checked against `docs/engine-reference/unreal/`. If an approach fails its pass criterion, the spike tries the alternative named in the same row.

| ID | Requirement | Candidate UE 5.8 approach (to verify in the spike) | Pass criterion |
|---|---|---|---|
| R-1 | **Characters read as 2D cels:** near-flat two-tone fill with a hard terminator, lit by the decoupled character key (E-3) | A custom toon shading model, or a post-process cel pass driven by a character stencil/custom-depth mask; the material route (unlit/emissive with computed bands) as fallback | Day capture: the shade tone covers 15–25% of the character's visible area with a hard terminator (§4.2 shade share); no third tone or gradient on the fill |
| R-2 | **Character line** per L-1–L-7 | Inverted-hull outline mesh/material per character (L-5); a post-process outline restricted to the character stencil as the alternative | L-3/L-4 measurements pass; no line pixel on environment geometry |
| R-3 | **Environments read as 2D painted backgrounds:** painted texture carries the light; no outlines; no PBR look | Unlit or near-unlit environment materials sampling painted albedo, with the 2-band phase ramp and tint (E-1) baked or computed in-material; no Lumen GI/reflection dependence for the look | E-1, E-2 pass; zero ink pixels on environment (L-1) |
| R-4 | **Painted sky** | Painted skydome mesh plus 2–3 parallax backdrop cards (E-6), not a physical sky/atmosphere | E-6 passes from every orbit angle |
| R-5 | **The look holds from any camera angle** (free orbit) | Spike captures on a 360° orbit at Explore distance and from the High Road | No angle where a cel loses its line, the sky shows a seam or a backdrop card reads as flat |
| R-6 | Post-processing does not repaint the cels | Tonemapper, auto-exposure, bloom, motion blur and film grain set so cel colours stay on-palette | Pixel samples of palette swatches within ΔE2000 3 in Day, Dusk and Night (as L-2) |

`project.yaml` records `engine.rendering` as `/setup-engine`'s Unreal default (`Lumen + Nanite (deferred)`); the spike decides whether the look keeps or drops Lumen/Nanite, and the ADR updates that key.

**Environment rendering requirements (testable in the look-dev spike):**

| ID | Requirement | Pass criterion |
|---|---|---|
| E-1 | Environment shading is a soft 2-band ramp from one directional sun per phase, with a **painted, soft terminator** (band edge ≈ 10–15% of the ramp), shadows tinted to the phase's shadow colour, never grey | Shadow pixels sampled across the alley lie within ΔE 10 of the phase shadow colour mixed with the albedo; no neutral-grey shadow |
| E-2 | Painted textures carry brush direction and soft gradients; no photo sources, no PBR roughness or metal look | Art review against the reference board |
| E-3 | **Characters are lit separately**: a decoupled character key light with hard two-tone terminator; environment shadow on a character is a **zone tint** sampled at the cat's root (the whole cat steps into shade together, no shadow-map stripes on cels) | A cat walking through a fence-slat shadow changes tone as a whole cel, ≤ 2 tone changes per slat |
| E-4 | **Contact shadow:** a soft-edged blob under every character and inked prop (2–4 px feather at 1080p, Shadow Wisteria at 45%), matching the reference | Visual check in all four keys |
| E-5 | **Separation test:** the cat reads off the painted ground (rewritten 2026-11-24 for inked figures, owner-approved) | The **ink line carries separation**, not the coat: in a 1080p capture, the ink line differs from a ring of surrounding ground by ≥ 35 L*; ≥ 90% of silhouette samples have a visible line ≥ 1.5 px; every cat has its contact blob. Checked in all four phase keys. White and pale coats on the lit lane are allowed (the reference-matched ground is light) |
| E-6 | Painted skydome + 2–3 parallax backdrop cards (hills, sea horizon, far town) per phase; clouds drift | Sky is visible in ≥ 30% of exploration frames when the camera is level; no tiling seams visible |
| E-7 | Texel density: the **ground band** (0–1.2 m) at 512 px/m, walls above at 256 px/m, roofs at 128 px/m | Measured in the alley build |
| E-8 | All visible writing is **Scribble** (§6.5) | Language-rule review of every capture |
| E-9 | Stepped character animation (§8.4) composites without ghosting under the chosen AA/upscaler | A 10 s capture of a stepped cat shows no ghost trails |

**The spike:** one alley of Hidamari Lane (≈ 40 m, including a garden wall, a laundry pole, a High Road run and a Scent Post), in Day and Dusk, with Mikan, one generated Wall Sitter, a crow, and Haru's legs. It runs in **Unreal Engine 5.8**. The user has already chosen reference-close (2026-11-24), so the spike no longer produces a choice of mock frames; it proves the method and fixes the environment budget (§8.3).

**Look-dev test list:**
1. **Side-by-side with the reference board:** Day and Dusk captures of our alley next to reference stills (look only; no reference character or location is reproduced). Pass: the art director judges cel fill, line weight, painted texture and sky gradient to match; failures are named per R-/E-/L- item.
2. **R-1–R-6** above, each with its pass criterion.
3. **E-1–E-9** below.
4. **L-1–L-7** (§1.2) on Mikan, the Wall Sitter, the crow and Haru's legs.
5. **Free-orbit sweep (R-5):** a 360° yaw sweep at pitch −10°, +10° and +55° at Explore distance, plus a High Road run; recorded as video and frame grabs.
6. **Camera collision** in 1–2 m corridors and on roofs (camera doc T2), checking the cel/paint read survives close-in camera positions.
7. **Separation and colour-vision checks** (E-5, §4.8) in all four phase keys.
8. **Frame time** at 1080p60 on the slice PC target with the chosen shading and outline methods (§8.3 budgets).
Evidence is retained in `production/qa/evidence/`.

### 6.2 Hidamari Lane (the slice district)

A Showa-nostalgic hillside lane of old wooden houses and plaster garden walls stepping down toward the sea. The sea horizon and the green hill are in the backdrop of every exterior view.
- **Architecture:** low wooden houses with grey-blue tile roofs, plaster and board garden walls, sliding glass doors with wooden frames, laundry poles, potted plants on steps, a utility pole web, stone steps, a small shrine at a corner, vending machines (Scribble labels), a post box.
- **High Road:** wall tops, fence tops, laundry-pole rails, eaves and a run of roofs give a continuous upper route. From cat height, these are skylines: the High Road is always readable as a lighter ribbon against the sky or a darker wall.
- **Scent Post kit** (inked hero props; Territory/Level assign them to Patches): a persimmon tree trunk, a laundry pole, a stone lantern, a utility pole with a crooked transformer box, a roadside Jizo-style stone post. Each stands on quiet ground and is visible at 30 m.
- **Scent wisps** (DR-47): 1–4 drawn, slowly curling ribbons in the Clowder colour with a Cream rim, hanging above the post. Wisp count is the strength read. Flat colour, no glow.
- **Den:** Daifuku's wall, the tallest garden wall in the Lane with a knock-off ledge, a bucket below and a sightline to the sea.
- **Low Wall Corner** (Home Ground, tutorial): the corner by Haru's wall, the friendliest light in the district.
- **Sunspots (4):** a warm painted light patch (`#FFE7A3` with a halftone rim) on a flat surface, with a cushion-like prop (a folded towel, a sunlit step, a warm car bonnet, a tin roof).
- **Prop density:** dense at the ground band (pots, bikes, buckets, crates, cats' ledges); sparse above 1.2 m, so the sky and roofs read as calm masses. Every fight space keeps a ≈ 10 m ring of mid-value ground clear of high-contrast clutter.

### 6.3 Haru's House (slice rooms)

An old wooden house with a veranda, garden and low wall. Inside the wall: no combat, no VFX, no onomatopoeia, soft contrast. Rooms in the slice: **garden**, **entryway (genkan)**, **kitchen/Main Room with the upright piano**, **Haru's room**, and the **Alcove** for the morning rin ritual.

**Witness objects** (the dual story told by things; P3). Each is inked if Mikan can act on it, painted if not:
- **The Box** from the shrine steps (Life 1): below the entryway step at first, then **beside Gran's cushion in the Main Room** from K1.4 for the rest of the game (Narrative §3.5).
- **The saucer** (day 1, chipped, in the entryway), then **the blue-and-white Bowl** from K1.3 with a **chip state** (unchipped → chipped; same Bowl all game), on its mat in the Main Room.
- **The upright piano** (inked keys and lid; Mikan can walk on the keys), with Scribble sheet music.
- **The raincoat hook** in the genkan, yellow raincoat on it.
- **Haru's desk and study lamp** (the lamp pool is the Life 2 night image).
- **The cat flap** (Life 2, K2.3): a new, slightly too-bright inked panel in the **veranda door**.
- **The envelope** (K2.5): plain cream, a Scribble address, never readable.
- **The Grandpa photo** and its plum cloth in the Alcove; the rin bowl beside it.
- **The genkan shoe line-up:** Haru's **loafers**, Gran's **plum sandals**, and **yellow rain boots on day 1 only** (Narrative §3.5).

**The daily find** (DR-23): one object per day changes and gets a Home Scent trail. Art builds **Narrative §3.6's pool of 8 daily finds** (for example the ginger-cat charm on Haru's school bag, Gran's new reading glasses, a towel warm from the line, the Scribble score with a pencil circle); there is no separate Art swap list.

**Camera grammar at home:** the same third-person camera at cat height (0.3–0.6 m). Rooms are dressed for that view: floor, skirting, furniture undersides and table legs are the hero surfaces; ceilings are simple. Vignettes use authored shots; the composition rule in §1.4 applies.

### 6.4 The Lot, the Doorstep, the Stash

- **The Lot:** a weedy vacant lot behind the house. A rusting kei truck (the throne), a blue tarp, stacked crates, a broken bench, tall grass edges. The **Turf Board** is framed diegetically as a weathered plank fence where Crew portraits pin on with clothes-pegs (the screen itself is UX's).
- **The Doorstep:** a stone step with the Tribute pile catching the morning sun. The **Morning Sniff** stamp cards unroll from scent wisps (DR-24): bean-shaped cards in Paper Cream with Ink pictograms.
- **The Stash:** a gap under the veranda boards; Morsels as a heap of painted-then-inked fish shapes that grows visibly.

### 6.5 Scribble (human writing)

Every visible human mark is **Scribble**: thin, regular, human-looking strokes that resemble no real script, no letters, no numerals (language rule §5.6). Signs, labels, the envelope, sheet music, school notebooks and the calendar all use it. Scribble is thin and orderly; combat lettering (§10.7) is fat, wild and feline, so the two can never be confused. Review: every Scribble sheet is checked by two readers of different scripts for accidental letters.

---

## 7. UI/HUD Visual Direction

### 7.1 Concept: warm, rounded, bubbly paper

The user's direction is **rounded, cream-and-brown, bubbly**. We take the reference's warmth (cream panels, brown frames, friendly rounded type) and build it from our shapes (UX-7):
- **Panels** are **beans**: soft asymmetric capsules in Paper Cream with a Cocoa frame (3 px at 1080p) and a soft Wisteria drop shadow. Not cloud-edged, not translucent.
- **Buttons** are **poms** and pill-beans; the primary button is a Cocoa fill with Cream text; the confirm accent is Collar Crimson with Cream text.
- **Cursor:** a paw-pad that squashes on press.
- **Portrait windows** are **chestnuts** (cat-head shaped), never circles.
- **Speaker names** sit on a short **ribbon in the speaker's Clowder colour** with Ink text, folded over the balloon's top edge. **No brown pill name tags** (UX-7).
- **Cat bark balloons** are opaque Paper Cream beans with a wedge tail and a Cocoa frame. Cat speech is readable text (canon §5.6.4). Humans never get balloons; their Murmur shows as Sense Icons over Mikan.

### 7.2 Shape grammar

| Element | Shape |
|---|---|
| Panels, cards, balloons | Bean |
| Portraits, Crew cards | Chestnut window |
| Buttons, toggles, Paws, selection dots | Pom |
| Warnings, Standoff name-card banner | Wedge-ended band |
| Pounce Gauge | A row of paw-pads |
| Frazzle gauge | Zigzag-edged bar above the enemy |
| Phase dial | A painted sun or moon travelling over a Lane roofline silhouette (no digits) |

### 7.3 Diegetic versus screen-space

- **In the world:** scent wisps, Scent Posts, the Head Home thread, telegraph decals, the Doorstep stamp cards, the Turf Board fence, the gold Crew cord.
- **Screen-space** (UX places it; corners only, bottom-centre clear, DR-48): Posse portraits and gauges, the phase dial, the bark balloon, Slow Blink menu, edge arrows.
- **Home:** no HUD apart from the Doorstep Sniff (the only licensed HUD space), Sense Icons over Mikan and the always-on Call glyph (DR-54; Haru's is three smooth yellow arcs).

### 7.4 Typography

- **UI and cat speech:** one rounded sans family with full CJK coverage (candidate: M PLUS Rounded 1c, OFL), two weights. Ink on Cream for body text.
- **Hierarchy at 1080p:** headers 44 px bold; body 32 px; **floor 28 px** (UX-X14; 18 px at 720p for the later handheld check). Barks ≤ 60 characters in 32 px.
- **Numbers** (round-2 R3; brief v1.3): *numbers count what the cat owns or pays; they never measure a feeling, a relationship or a human.* Allowed: Morsels, Shinies, Tribute, the Stash, prices, Crew levels and XP pips (Lot tabs, Turf Board, Verdict Bribe row, Pause, the Doorstep Tribute card, the street pickup tick and encounter tally). Territory numbers only on the Turf Board. Never: Grudge, Regard, Loyalty, Rival levels, anything inside the house except the Doorstep card, anything in the world (Scribble). Combat damage numerals are **Off by default** (UX option); weakness and resistance read from the spark shape (§10.3).
- **Combat onomatopoeia is not a font** (§10.7).

### 7.5 Iconography and UI motion

- Icons: chunky, 2 tones plus Ink, built from primitives; readable at 32 px.
- **Sense Icons** (fish, heart, rain cloud, ear, tone icons, question mark): pom-backed, pop over Mikan's head.
- **Motion is bouncy and stepped:** panels pop in at 110% → 100% over 3 drawings on twos; buttons squash 92% on press; nothing slides on a smooth ease longer than 200 ms. Transitions use a halftone wipe or a pom iris, not a cross-fade (P5).
- **The Standoff name-card** slams into the **upper third** (UX-X13): wedge-ended band, chestnut portrait, Title stamp, Clowder ribbon, the Rival's sting contour glyph (DR-54); it morphs into the enemy identity ribbon when the fight starts.

### 7.6 The Fence Line (slice: one district)

One continuous painted Lane wall in the current phase light. Each cat stands at a height equal to its rank, in one **disposition pose** (Nemesis data) drawn from its personality set. No rank labels. The storm mark sits over the Nemesis; Bitter cats have a small grumble cloud. Wall events animate overnight changes (a cat climbs, one leaves a gap). It never appears in the house.

### 7.7 Art vs. readability decisions

| Conflict | Decision |
|---|---|
| The reference's translucent cloud balloon vs. readability over a busy painted scene | Opaque bean balloon with a soft shadow |
| Brown text (reference warmth) vs. contrast | Ink body text; Cocoa for frames, headers and secondary text (≥ 6.4:1) |
| Halftone UI tones vs. "warm and bubbly" | Halftone only in transitions and combat UI; menus use flat colour (reference-close, user ruling 2026-11-24) |

---

## 8. Asset Standards (slice; PC, 1080p60)

### 8.1 Naming

`[category]_[name]_[variant]_[size].[ext]`, lower snake case.
- `char_mikan_kitten_lod0.fbx` · `char_cat_round_base.fbx` · `char_tail_plume_01.fbx` · `char_scar_earnotch_l.fbx`
- `anim_pers_braggart_walk_01.anim` · `anim_style_bruiser_finisher.anim`
- `env_lane_wall_plaster_trim_2k.png` · `env_sky_dusk_dome_4k.png`
- `vfx_claw_arc_t3_sheet.png` · `vfx_lettering_en_wham_t4.svg`
- `ui_btn_primary_hover.png`

### 8.2 Formats and colour

- Source textures 16-bit PNG/PSD, sRGB for albedo and UI; linear for masks. Runtime BC7 (albedo), BC5 (normals, only where needed), BC4 (masks).
- Meshes FBX, Y-up, metres, one material slot per character body plus one for the hull.
- Lettering and UI vectors as SVG, compiled to SDF atlases.
- Colour acceptance: on-screen colour within ΔE2000 ≤ 2 of the swatch under the neutral Day key (AB-15).

### 8.3 Budgets (PROPOSED; fixed after the look-dev spike)

Target: 1080p60 on a GTX 1060 / RX 580-class PC (min spec, proposed). The handheld floor is Backlog (E-5).

| Category | LOD0 tris | LODs | Texture | Notes |
|---|---|---|---|---|
| Mikan | 6,000 | 3,000 / 1,200 | 1× 1024² flat-colour atlas + face decal sheet 1024² | Hero; close-ups at home |
| Generated cat (3 base meshes + parts) | 4,000 | 2,000 / 800 | Coat colours by palette index, pattern masks 512² | Silhouette edge loops prioritised |
| Daifuku | 7,000 | 3,500 / 1,500 | 1024² | |
| Household human (Haru ×2 outfits, Gran) | 12,000 (hands ≈ 30%) | 6,000 / 2,500 | 2048² | Below-knee detail first |
| Street human (4 leg-and-bag sets) | 5,000 | 2,000 | 1024² shared | |
| Crow | 1,500 | 600 | 512² | |
| Inked interactive prop | 300–2,000 | 1 LOD | Flat colour atlas | |
| Environment (visible per frame) | ≤ 1.5 M | HLOD per block | Trim sheets 2048², densities per E-7 | Merged static blocks; culling by block |
| Sky | dome + 3 cards per phase | — | 4096×2048 dome, 4096×1024 cards | 4 phases × Lane |

**Frame budget (16.6 ms):** environment 5 ms · characters and outlines 3.5 ms · VFX 2.5 ms · UI 1 ms · post 1.5 ms · headroom 3 ms. **Draw calls** ≤ 2,000. **VRAM** ≤ 3 GB total, of which VFX ≤ 200 MB and lettering ≤ 32 MB.

**Recorded trade-off:** an art preference for unique painted surfaces vs. the trim-sheet budget. Chosen: trim sheets plus vertex colour, with ≤ 6 unique hero paintings in the Lane (Daifuku's wall, the shrine corner, Haru's wall and gate, the Lot truck, the sea vista, the Den sightline).

### 8.4 Animation standards

- **Stepped animation:** combat actions, VFX and comedy takes play **on twos (12 poses/s)**; locomotion and camera stay smooth (on ones), so movement never feels sluggish. The step clock runs on **simulation time**, so hit-stop and Slow Blink lengthen holds instead of strobing. Input is never delayed by stepping.
- **Every look event lasts ≥ 2 rendered frames** (DR-50).
- **Stepped frames write zero motion vectors on holds** and the true delta on steps (protects TAA/upscalers; E-9).

### 8.5 Slice asset list

| Group | Items |
|---|---|
| **Cats** | Mikan (kitten + adult proportions, pet set, Scrapper set) · Daifuku (3 phases' hero poses, knock-off, bucket splat) · the old wall cat · 3 base meshes · 4 tails · 3 ears · 6 silhouette Scars + 3 close-up Scars · 6 regalia · gold Crew cord · 10 coat fills · 6 pattern masks · 12 face decals |
| **Animation** | **6 personality sets** × (2 idles, walk, trot, sit, 3 bark poses, Fence Line pose, Pile-On flourish) = 60 clips · **3 Style sets** (Scrapper, Bruiser, Yowler) × (3-hit string, Pounce, Tag-In strike, Hop, Skitter, Brace, Hiss, 4 Move poses, Zoomies, hit-react ×2, Frazzled, Routed bolt, Back Down) ≈ 57 clips · shared (Spray, Sniff, nap, climb, ledge-hang, knock-off fall, Splat) |
| **Humans** | Haru (raincoat, uniform, home clothes) · Gran · 4 street sets · hand pose library (≈ 20 poses) |
| **Critters** | Crow (walk, hop, peck, take-off, hit, flee) |
| **Environment** | Hidamari Lane (5 Patches, High Road, Den, 4 Sunspots, 5 Scent Post types) · Haru's House (garden, genkan, Main Room with piano, Haru's room, Alcove) · the Lot · 4 phase skies and backdrop sets · Narrative's 8 daily-find states |
| **VFX** | §10 drawings: 3 damage-type sets (Claw, Thump, Yowl), hit sparks, slash arcs, speed-line sets ×3, impact frame masks, Pile-On cloud loop, Frazzled/Ruffled states, 3 Style cut-in layouts, Tag-In streak, telegraph decals ×3, dust family, Spray puff, scent wisps, Whisker Sense trails and compass ring, Head Home thread, Fear drawings ×3 |
| **Lettering** | 16 words × 2 sizes (T4/T5) per language: **English and Japanese** for the slice |
| **UI** | Panel kit, balloon kit, 6 personality icons, 6 Title stamps, brick-block and bell emblems, Sense Icons, Call glyph, phase dial, Fence Line wall |

---

## 9. Reference Direction

| Reference | Take | Avoid |
|---|---|---|
| **Shin chan: Shiro and the Coal Town** (the user's reference; reference-close on the look, user ruling 2026-11-24) | The look, matched closely: 3D characters that read as flat, near-shadeless 2D cels; thin even line; soft contact shadows; backgrounds that read as 2D painted anime art; lush painted foliage; soft-gradient summer sky; warm cream UI | Its characters, names, locations and assets; its brown name tags, cloud balloons, layouts, the veranda-to-garden pet composition; its 3C (our camera orbits freely in third person) |
| **Studio Ghibli background painting** (*Kiki's Delivery Service*, *Ponyo*) | Seaside hill towns, laundry and tiled roofs, cumulus over a sea horizon, Dusk light | Copying specific vistas or architecture shots |
| **Action anime impact staging** (Trigger, *Mob Psycho 100*) | Impact frames, smears, speed lines, timing contrast, held poses | Seizure-risk strobing, saturated red flashes (DR-50) |
| **Final Fantasy VII Remake** (camera and combat readability) | A behind-the-shoulder camera that pulls back in a fight; clear lock target framing; cut-ins for limit breaks | Realistic rendering, PBR, particle-heavy effects |
| **Manga sound-effect lettering** (Japanese manga, and Western comics' hand-lettered SFX) | Brush-lettered sound words that grow along the hit's direction | Typed fonts; words that read as human speech |

---

## 10. Combat VFX Language (showcase)

Combat owns the tier table and every number in it: hit-stop, shake, impact frame lengths, durations and caps (DR-07, `design/gdd/combat-system.md` Impact Moments). This section owns **how each tier looks**. Where a cell below mentions a size, it is the look; where it needs a duration, it cites Combat's table.

### 10.1 Rules of the language

1. **Every effect is a drawing:** hard-edged, 2–3 flat tones (a Paper Cream core, one colour, Ink), on twos, 3–8 drawings long. No soft particles, additive glows, gradients or fading sprite trails.
2. **Shape first, colour second.** Damage types are told apart by shape (§4.3).
3. **Effects end by breaking** into 2–3 wedges or dots, or with a halftone dissolve; never an alpha fade.
4. **One screen-wide effect at a time** (canon). Combat arbitrates priority.
5. **The controlled cat is never covered**, and lettering never covers the controlled cat or the HUD (DR-49). Effects draw beneath the controlled cat's outline and tick, apart from the full-screen part of a T4–T5 impact frame.
6. **No liquid, ever:** no splashes, droplets or stains (water is opaque flat blobs; see Fear drawings).
7. **AI-autonomous hits render one tier lower** (DR-07 player-authorship rule).
8. **Safety overrides every drawing** (§10.9).

### 10.2 How each tier looks

| Tier (events per DR-07) | Hit spark | Lines | Impact frame | Glyph / lettering | Dust |
|---|---|---|---|---|---|
| **T0** whiff, prop, blocked | Whiff: one wedge flick. Blocked: a Cream wedge-shield flick with two motion ticks | — | — | — | 2 puffs |
| **T1** string hits | Damage-type spark, ≈ 0.3 m, 4 drawings; target flashes Cream for 1 drawing (≥ 2 frames) | — | — | Spark only | 3-puff ring |
| **T2** finisher, Pounce, Tag-In strike, Splat | Type spark ×1.5 and a short smear on the attacker | Local streak behind the attacker (2 drawings) | — | 1 shape glyph | 5-puff ring |
| **T3** 1-Paw Move, Hiss interrupt, Fear trigger | The Move's full type drawing (slash arc, ring, sound arcs) up to 3 m | Radial focus lines on 20% of the screen edge, centre third clear | **Local** disc ≤ 15% of the screen (§10.4) | Glyph burst, 2–3 shapes | Ring plus trail |
| **T4** 2-Paw Move, Frazzle hit, Tough Rout, Back Down | Largest type drawing; the target's take pose | Radial lines on 40% of the edge | **Full-screen** inverted drawing, then an effect-shape flash | **One lettered word**, ≈ 12% of screen height | Ring plus ground crack |
| **T5** Pile-On, Zoomies, Boss phase break, leader Rout | Set-piece drawing (§10.5) | Full-field lines, Ink or Cream only, behind a flat panel | Full-screen (rate-limited, §10.9) | **One giant lettered word**, ≈ 30% of screen height | Pile-On cloud or a full dust bloom |

**Shape glyphs (T1–T3)** are the non-word marks: paw-pads, claw strokes (1–3), stars, zigzags, spirals, the bell. Chunky brush forms with Ink outline and an offset second print in the damage-type colour. At most 3 bursts on screen (Combat's caps rule).

### 10.3 Damage-type drawings and slash arcs

| Type (slice Style) | Hit spark | Move drawing | Colour | Motion character |
|---|---|---|---|---|
| **Claw** (Scrapper, Mikan) | Three short parallel nicks | **Slash arc:** three parallel thin crescents sweeping 90–180° along the paw's path, tapering to needle points, with an Ink keystroke on the outer edge; leaves three pale scratch lines on the ground for ≈ 0.5 s | Ice Cyan edge `#39C6F0`, core `#EAFBFF` | Fastest: full arc in 1 drawing, lingers 3, breaks into 3 wedges |
| **Thump** (Bruiser) | A four-point Ink star inside a Cream ring | **Shockwave:** a thick Cream ring with an Ink outline expanding over 5 drawings, a flattened dust skirt in the ground's colour, nearby inked props hop | Cream + Ink only | Heaviest: slow expand, biggest shake |
| **Yowl** (Yowler) | Two wavy arcs | **Sound arcs:** concentric wavy crescents travelling out in a cone, small spiral glyphs riding them | Yowl Lilac `#B9A0FF`, Cream core, Ink edge | Rhythmic: 2–3 pulses |
| Heal / purr | A small heart | Soft rings rising with hearts | Purr Rose `#FFB3C1` | Slow; the only gentle effect |

**Weakness and resistance twins (R3; numerals default Off):** a **weakness** hit adds one extra Ink **crack wedge** breaking out of the type spark; a **resisted** hit draws a **blunted spark** at 70% size with rounded tips. Shape-only, so it reads in greyscale and with damage numerals Off (HUD §4.1, Accessibility §2).

**Slash-arc rules:** the arc follows the actual paw path (authored per string hit, not a generic sprite), so a 3-hit Scrapper string reads as three different arcs (low right, high left, and a full-circle flurry finisher). The arc sits in world space, camera-facing, thickness ≥ 4 px at the combat framing. On the finisher the arc thickens and a second, offset arc in Ink trails one drawing behind.

### 10.4 Speed lines, action lines and impact frames

**Speed and action lines** are Ink wedges of uneven length and weight (Paper Cream on Night and dark grounds). They swap between 3 drawings on twos and never scroll smoothly.
- **Local streak (T2):** parallel lines trailing a dashing or leaping cat, Tag-In leaps included.
- **Radial focus (T3–T4):** lines converging on the target from the screen edge; the centre third stays clear, so the hit is framed, not hidden.
- **Full-field (T5):** the scene is replaced by a flat panel (the acting Clowder's colour as a **static** backing) with Ink or Cream lines over it. The lines are never in a Clowder colour (DR-50). **Panel luminance rule (iteration 3):** every T5 flat-panel backing (Clowder colour here, static Bell-Gold under the Pile-On, the coat colour behind the Zoomies cut-in) is **value-matched to the current phase key within ±0.10 relative luminance of the frame's mean** (Night uses a darkened shade of the hue), **or** it enters behind a halftone wipe of ≥ 3 drawings. The panel's arrival **counts as one flash** in the §10.9 budget.
- **Standoff bands:** a horizontal band of parallel lines behind each cat.

**Impact frames:** the classic hit emphasis, built to be flash-safe.
- **Drawing 1 (the inversion; within Combat §3.17's cap):** the image reduces to three flat values: the background flattens to **one mid-value tone matched to the current frame's mean luminance (±0.10)**, figures become solid Ink silhouettes with Cream lines, and the effect shape keeps its damage colour. A limited-palette inverted drawing, not a mathematical negative, and never a full-screen jump to Paper Cream or Ink.
- **Drawing 2:** a Cream flash limited to the effect shape and a radial burst (local); the scene returns beneath it, so it is not a full-screen flash.
- Then the hit-stop hold on the normal-colour impact pose, with the line thickened by +1 px for the hold.
- **Local** (T3): masked to a burst shape around the contact point, **≤ 15% of the screen**. **Full-screen** (T4–T5): lengths per Combat; rate limit per §10.9.
- **Reduce Flashes** option: the impact frame becomes a +1 px line hold and a freeze, with no luminance change.

**Screen shake** looks like a camera operator's jolt: stepped offsets (one new offset per 33 ms) in the hit's direction, amounts per Combat's tier table, never continuous jitter.

### 10.5 Signature states and set-pieces

**Tag-In.** The incoming cat leaps in along a **bell-gold streak** (a wedge ribbon with a Cream rim) from the edge of the frame, with local speed lines; its Tag-In strike is a T2 drawing. During a **Relay** each consecutive tag adds one **paw-pad pip** to a short-lived row at the top of the streak (1–4), so a four-cat Relay draws a visible chain. Bonded pairs (DR-37): the two streaks briefly braid.

**Ruffled.** A ridge of raised fur along the spine (silhouette change), one Cream sweat-drop mark, the outline rim pulses in two steps at ≤ 3 Hz. Ink and Cream only. A tell, not a celebration.

**Frazzled (stagger).** The silhouette **puffs by ≈ 15%** into a zigzag-edged shape (every tail bottle-brushes), spiral eyes, three Static Yellow squiggles and two stars orbiting the head on twos; the outline becomes Frazzle Magenta. On trigger (T4): radial lines, the impact frame, a lettered word. **It must read in pure silhouette.** On recovery the fur deflates over 3 drawings with a puff of loose fur wedges. A Frazzled enemy is the Pile-On invitation: its orbiting stars are the visual hook; the prompt itself is UX's.

**Pile-On (the signature image).** A hand-drawn **scalloped dust cloud**: Paper Cream with a lavender shade `#D8D2EA` and a heavy 5 px Ink line, **3.5 m across (Full) / 2.5 m (Quick)**, boiling through an 8-drawing loop on twos. Out of it pop, at irregular intervals: paws, tails and ears **in the real coat colours of the cats inside** (from their coat seeds), stars, paw-pad glyphs, a flying tuft, the Posse's chevron ticks (and the controlled cat's bell) bobbing on top. Each Posse cat gets one beat with its **personality flourish** (§3.3). The background drops to a flat panel of full-field Ink lines on a static Bell-Gold backing, value-matched to the phase per the §10.4 panel luminance rule. It ends on one big burst drawing, the giant lettered word, and the cloud blowing apart into four puffs to reveal the Posse posed over the Routed target. Duration per Combat; shake only on the beats.

**Routed.** No injury, no collapse: a take (eyes wide, one drawing), then the cat bolts in a stretched smear with a dust-puff trail of three shrinking clouds and a small spinning star where it stood. For a remembered Rival Routed from an Ambush, the memory line's balloon appears over the flattened cat (DR-40.2). **Back Down:** the Tough's ears flatten, its tail tucks, it shrinks 10% and backs away in three hops before bolting.

**Zoomies cut-in (the limit break).** A diagonal wedge-ended band (6 px Ink border) wipes across the upper two-fifths of the screen, showing the cat through the portrait rig (a close-up 3D shot of the same cel model) over full-field Ink lines on a static backing in the cat's coat colour (value-matched per the §10.4 panel luminance rule), eyes flashing a four-point glint. In over 3 drawings, hold, out over 2; Combat owns the length and the skip. **3 layouts in the slice**, one per Style: Scrapper (low diagonal, claws raised), Bruiser (straight horizontal band, chest-out roar), Yowler (rising diagonal, mouth open, sound arcs spilling out of the band). The Zoomies that follows owns the screen as T5.

**Boss phase break (Daifuku).** Daifuku slides off his ledge in a held "take", the bucket splat (opaque Cream-and-cyan blob shapes, no liquid), plaster cross on his head if the player is on a rematch (DR-21), and the giant lettered word.

**Fear triggered (T3).** A jagged pom bubble over the victim with the Fear pictogram (water drop, horn, cucumber), the victim's fur-puff take, and a source drawing: flat cyan blob-splash for the bucket, Ink sound arcs for the scooter horn, a comic cucumber "boing" with motion ticks.

**Hiss.** A jagged Cream burst from the acting cat's mouth with Ink zigzags, plus the cat's arched pose. On an interrupt the attacker's yellow-class triangle glyph cracks in two.

**Spray.** Tail-quiver pose, a soft scalloped puff in the Clowder colour with four-point sparkles and a single pop ring; the puff settles on the Scent Post as a wisp. Never liquid, never a stream, never a stain (canon).

**Standoff.** Both cats arch; speed-line bands behind each; the name-card slams into the upper third; a hard light wedge between them. On the Nemesis the band behind it is Frazzle Magenta and the storm mark appears.

### 10.6 Telegraph decals

Per §4.3: white (solid, chevrons), yellow (Cream dashed, triangle), red (Magenta, zigzag edge, hatching). Decals are flat, drawn on twos, and grow from the attacker toward their full shape across the windup, so the shape itself shows the timing. They are never covered by dust or sparks: telegraph decals draw above ground VFX.

### 10.7 Hand-lettered onomatopoeia (DR-49; readable)

**What it is:** one hand-lettered manga sound word on **T4 and T5** events only, **at most one on screen**. It is the sound of the cat brawl, never a human word or utterance (sanctioned exception). It never appears at home and has no voiced reading (DR-53).

**Look (house style):**
- Thick brush lettering with dry-brush ends, slightly irregular baseline, letters overlapping like a shout.
- **Paper Cream fill, 4 px Ink outline** (at 1080p, T4 size), and an **offset second print** (3–5 px) in the damage-type colour, or Ink for Thump. DR-50: lettering is Ink/Cream or the damage colour only.
- Tilted 8–15° along the hit direction; letters grow in size along that direction (the last letter ≈ 1.4× the first).
- **Size:** T4 ≈ 12% of screen height; T5 ≈ 30%.
- **Placement:** world-anchored near the contact point, offset away from the controlled cat, pushed inward if it would leave the frame; never over the HUD corners or the controlled cat.
- **Motion:** pops in at 120% over one drawing, settles to 100%, jitters between two drawings while held, then breaks into wedges. Hold length per Combat.

**Readability (the user chose readable):**
- Upright-enough letterforms: no letter rotated more than 20° from the word's baseline; no stacking that changes reading order.
- Minimum stroke thickness ≥ 6% of the letter height.
- **Acceptance:** at T4 size in a live combat capture, ≥ 90% of testers read the word correctly from a 0.5 s exposure; at T5, ≥ 95%.

**The English set (16, by event family; draft for the lettering artist):**

| Family | Words |
|---|---|
| Claw (slash) | **SKRITCH · SHNK · SWISH** |
| Thump (heavy) | **WHAM · THOOM · BOFF · KRAK** |
| Yowl (voice) | **YOWWL · MRRAOW** |
| Frazzle / stagger | **FWOOMP · BZZT** |
| Rout / bolt | **ZOOM · FWIP** |
| Pile-On / Zoomies | **POW · KA-BLAM · BAP-BAP-BAP** |

**The Japanese set (16, native onomatopoeia; draft):** ズバッ · シャッ · ザシュッ · ドカッ · ドーン · バキッ · ボフッ · ギャオー · ニャーッ · ボワッ · ビリッ · ピューッ · サッ · ドカーン · バババッ · ドタバタ.

**Localisation brief (Art owns):**
1. Each shipped language gets its own hand-lettered set in the house style, as vector/SDF assets, not a typed font.
2. 16 words, mapped to the same event slots as the English set.
3. Words must be sound-words in that language's comics tradition; no real words that read as speech, insults or brand names; reviewed by a native reader.
4. Same size, colour, outline and motion rules; legibility acceptance as above, run per language.
5. Delivered at two sizes (T4, T5) with SDF spread ≥ 8 px so outlines stay crisp from 12% to 30% of screen height.

### 10.8 Whisker Sense and other non-combat effects

- **Whisker Sense:** the world desaturates to lavender-grey (saturation −80%, value −10%); scent trails are flat ribbons in the Clowder colour with a 1 px Cream edge; the **scent compass ring** is a thin Cream ring on the ground around Mikan with up to 5 wedge pointers in the target's Clowder colour (rival marks, Rivals) or Bell-Gold (hidden finds), each with an emblem. Not usable in combat.
- **Head Home thread:** a bell-gold scent ribbon with a Cream rim, curling along the High Road toward Haru's wall, drawn on twos.
- **The Dusk lamp wave** (DR-54): windows and lamps switch on in a wave running uphill toward Haru's house with the chime, one house per beat.

### 10.9 Safety (DR-50 mirror; overrides every drawing)

- ≤ 3 flashes in any 1 s (WCAG 2.3.1 definition, counting any luminance pair over > 20% of the screen).
- ≤ 1 full-screen impact frame per second; a second one in the window is downgraded to the local disc.
- Local impact frames ≤ 15% of the screen.
- No saturated red (linear R/(R+G+B) ≥ 0.8) changing over > 5% of the screen. Full-field lines in Ink or Cream only. Lettering in Ink/Cream or the damage colour.
- Every look event ≥ 2 rendered frames; stepped shake; global hit-stop ≤ 20% of any second (Combat enforces).
- Reduce Flashes and Reduce Motion options ship.
- **Acceptance:** the default configuration passes an automated Harding-style analysis on captured slice combat (a Daifuku fight with ≥ 2 Pile-Ons and 1 Zoomies) before any public footage.

---

## Backlog (post-slice)

- AB-10: handheld budgets (Switch 1-class floor, E-5): triangles 1,800 per cat, frame-time per pass, streaming.
- AB-11: handheld outlines and AA (anti-aliasing and upscaler choice, outline exclusion from the upscaler, render-pass/stencil notes), to be re-scoped for Unreal Engine 5.8 after the look-dev spike.
- AB-2/AB-3: crowd-fight readability below 6% screen height; readable-axis distinctness at 48 px.
- Districts 2–3 and the Summit: Akane Arcade, Shiosai, Lighthouse Summit palettes; Awning Gang, Salt Paws, Steam Court colours re-checked under the ΔE 15 rule.
- Fang damage type and Prowler/Trickster drawings; re-check Bite Violet against Yowl Lilac.
- Madam Sabi, Oboro, Ikari, Botan hero designs; Steam Court silk-ribbon collar.
- Sora (teal, stripes) and Koharu (coral, dots) designs; Pad Pink vs Koharu Coral check.
- Lives 3–9 colour script (draft §4.7), Life 8 desaturation and the raincoat rhyme, Life 9 "yellow as light".
- Mikan's ageing beyond Life 2 (prime, greying, old, elder).
- Time-skip montage look; Life 8 street look (neglected, after-rain keys).
- Home Moves, Knacks, Kits visual language.
- More lettering languages beyond English and Japanese.
- Generator expansion: more tails, ears, patterns and the head axis for portraits.
- Photo mode and key-art compositions.
- Raincoat "bloom" (Audio §11) as an optional Melody-presence twin: decide after the home mock; if kept, a stepped tone change, never a glow (P5).
- Whisker compass ring pointer count (Art ≤ 5): HUD does not restate it; keep 5 unless the compass test shows a need.

---

## Revision Log

### 2026-11-24: Iteration 3b — user decisions

| Decision | How |
|---|---|
| Engine: Unreal Engine 5.8 | §6.1 gains engine rendering requirements R-1–R-6 (custom toon shading model or post-process cel pass; inverted-hull or stencil-masked post outlines; unlit painted-texture environments with no outlines; painted sky dome and cards), stated as spike items, not verified API claims; AB-11 Backlog line made engine-neutral |
| Title: "Cat RPG" (final) | Header title no longer "working title" |
| Art style: reference-close on the visuals, not the 3C | Style reference paragraph and new §1.0 restate the target (3D cel characters reading as 2D cels, environments reading as 2D painted backgrounds, free third-person camera). P5 renamed "Cel characters, painted world". §1.4 rewritten: differentiation comes from original characters, world, UI content and the free camera, not from pushing the rendering away from the reference. §6.1 spike no longer produces "reference-close vs print-stylised" mock frames; it gets a look-dev test list. §9 reference row updated. Backlog line for the reference-closeness decision removed. Originality guardrail unchanged |

### 2026-11-24: Iteration 3 (round-2 presentation review, final pass)

| Fix | How |
|---|---|
| 1 Impact frame vs Combat luminance cap | §10.4 Drawing 1 background is a mid-value tone matched to frame mean (±0.10); Drawing 2 stays local; every T5 flat panel (Clowder, Pile-On Bell-Gold, Zoomies coat) value-matched within 0.10 or brought in by a ≥ 3-drawing halftone wipe, and counted as a flash (§10.4, §10.5) |
| 2 Cat scale | One global scale 1.25× (≈ 0.56 m), street and home, no swap; humans and props true scale; kitten from bone scale (§3.4) |
| 3 Posse tick | Chevron on allies, bell on the controlled cat (§4.3, §4.8, Pile-On) |
| 4 Witness objects | Box beside Gran's cushion from K1.4; saucer then blue-and-white Bowl with chip state; flap in the veranda door; loafers, plum sandals, rain boots day 1 only; Narrative's 8 daily finds replace the 7 swap states (§6.3, §8.5) |
| 5 Numbers (R3) | §7.4 restated as the one-line rule; weakness crack wedge and resisted blunted spark added (§10.3) |
| Backlog taken | SCRAMBLE replaced by BAP-BAP-BAP (§10.7); Titles shown as stamp plus readable text (§3.5) |

### 2026-11-23: Round 2 (slice rewrite)

Fresh rewrite under DR-01 and DR-48. The first draft is archived; kept from it: "ink what acts, paint what stays", the primitives, the palette core, the tone rules, the household colours, the Pile-On, Frazzled and impact-frame drawings.

| ID | Status | How |
|---|---|---|
| AB-1 | REJECTED (moot, DR-48) | Paint-over plates withdrawn because the camera rotates. Replaced by the third-person environment method and the look-dev spike with E-1–E-9 pass criteria (§6.1) |
| AB-2 | REJECTED (DR-48) / BACKLOG | Cats are 10–20% of screen height in exploration; combat floor ≥ 6% stated as a requirement to the camera doc (§5.3); crowd readability in Backlog |
| AB-3 | BACKLOG (DR-48) | Readable-axis rules relaxed. The distinctness rule still uses visible axes (§3.4); the dominant mark raised to 8% |
| AB-4 | FIXED | Sky in frame; P5 limited to characters, VFX and combat UI; soft painted sky and environments; mock frames for E-1 from the spike |
| AB-5 | FIXED | The tier table is Combat's (DR-07); §10 keeps only the drawings and cites it |
| AB-6 | REJECTED (DR-48) | One third-person camera; home at cat height |
| AB-7 | FIXED | 1 px Cream rim on every keyline and outline; Wall Sitters `#A8C878`; Thump moved to Cream + Ink; Ruffled made hue-free; Yowl to Lilac; Marmalade to `#C98A4A`; Lane swatches moved (Garden Green, Hydrangea); automated ΔE 15 rule (§4.3–4.4) |
| AB-8 | FIXED | §10.9 safety mirror; local frames ≤ 15%; full-field lines Ink/Cream; static Clowder backings; Ruffled pulse ≤ 3 Hz |
| AB-9 | FIXED | Look events ≥ 2 rendered frames; stepped shake; step clock on simulation time (§8.4, §10.4) |
| AB-10 | BACKLOG | Handheld budgets (E-5); slice budgets are PC (§8.3) |
| AB-11 | BACKLOG (part FIXED) | Line width against render-target height (L-3) and zero motion vectors on holds (§8.4) adopted now; AA and engine notes Backlog |
| AB-12 | FIXED | Collar Crimson carries Cream text; disabled 3.3:1; dark coats get Reverse Ink at Night (L-6) |
| AB-13 | FIXED | Three base meshes on one skeleton (§3.4) |
| AB-14 | FIXED | Line hue dropped as a differentiator; UI differentiation stated as shapes; veranda composition rule (§1.4) |
| AB-15 | FIXED | Separation test with σ = 4 px and ΔL* ≥ 20 (E-5); colour acceptance as ΔE2000 ≤ 2 (§8.2) |
| AB-T1–T42 | FIXED via DR-07 | All timing, tier membership, hit-stop, shake, caps and durations are Combat's. Art-owned rows applied here: T22 (full-field lines Ink/Cream), T29 (local ≤ 15%), T30 (smears ≥ 2 frames), T33 (Pile-On 3.5 / 2.5 m), T35 (cut-in content is the portrait rig), T38 (Slow Blink −30% saturation, −10% value), T39 (Art's hit-spark shapes; Thump keeps star + ring, Yowl wavy arcs), T40 (telegraph classes recoloured), T41 (Ink halftone incoming-hit cue), T42 (no glow: drawn shapes only) |
| UX-7 | FIXED | UI built from our shapes: bean panels, chestnut portraits, Clowder-colour ribbons, no brown pill tags, no cloud balloons (§7.1) |
| UX-X13 | FIXED | Standoff name-card in the upper third, morphing into the ribbon (§7.5) |
| UX-X14 | FIXED | Text floor 28 px at 1080p / 18 px at 720p (§7.4) |
| SB-X14 | FIXED | Coral removed from the incoming-hit cue and from low Nerve (§4.3) |
| DR-37 | FIXED | Six personality silhouette signatures and animation sets, with a read test (§3.3) |
| DR-47 | FIXED | Landmark Scent Posts, Clowder wisps, scent compass ring (§6.2, §10.8) |
| DR-49 | FIXED | Lettering look, readability test, English and Japanese sets, localisation brief (§10.7) |
| DR-54 | FIXED | Bell glint, Call glyph, Dusk lamp wave carriers (§5.1, §7.3, §10.8) |
| Split §10–13 into companions | REJECTED | At ≈ 40 KB the slice bible is within the read limit; a split is Backlog if it grows |

- **Owner decisions (2026-11-24, after M0):** the art target is approved — environment and shader as built in M0
  (`prototypes/artifact-slice/`, published look-dev). Mikan's 3D shape is to follow the owner's turnaround
  (`design/reviews/refs/mikan-turnaround-ref.webp`): a clearly lifted nose/muzzle, clearer ear shapes, defined back
  leg and haunch, a seated chest; the face stays the M0 face (`design/reviews/refs/mikan-face-keep.png`). No
  side-profile face swap. E-5 rewritten for inked figures (ink line vs ground ≥ 35 L*), as above.

- **Owner change (2026-11-24, C8):** Mikan now has a **long tail** (replaces the bobtail with round pom). Face: round, fat-cheeked front view; flat cat profile with a short muzzle (no snout). See `design/reviews/user-comments-2026-11-24.md` C8 and `design/reviews/refs/`.

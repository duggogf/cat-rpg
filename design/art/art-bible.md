# Art Bible: Cat RPG (working title)

> **Status**: Draft v0.1 (first pass, written in one sitting for review; nothing here has been tested in engine)
> **Owned By**: art-director
> **Last Updated**: 2026-11-23
> **Art Director Sign-Off (AD-ART-BIBLE)**: [Not yet reviewed]

**How to read this document.** Sections 1–9 follow the studio art-bible template. Sections 10–14 are deep-dive annexes that the template has no slot for (rendering requirements, combat VFX, animation, camera, do/don't). Section 15 is the honest list of what is weak or undecided. Canonical terms (Mikan, Haru, Posse, Clowder, Frazzle, Pile-On, Whisker Sense, Scribble...) are defined in `design/creative-brief.md` and are used here without redefinition.

**Authority.** Art owns how things look. Combat owns every gameplay duration; any timing in this document is a *look* timing (how long a drawing is held), and where a number touches gameplay it is marked **(proposal to Combat)**. UX owns layout and flow; this document owns the visual skin. Audio is not specified here.

**Engine.** The engine is still OPEN (brief §11). Requirements are written engine-neutrally, with implementation notes for the recommended engine (Unity URP) marked *URP note*. Nothing here depends on a feature Godot 4 lacks, but more would be hand-built there.

**Style reference.** The user's reference is *Shin chan: Shiro and the Coal Town*. It is a reference for **qualities only**: flat-colour figures with a uniform clean line, placed in lush painted backgrounds, with rounded, friendly UI. No character, name, place, layout, composition or character-design shape from that or any other IP may appear in this game. Section 1.3 states how our look is our own.

---

## 1. Visual Identity Statement

### 1.1 The one-line rule

> **Ink what acts, paint what stays.**
> Everything that moves, fights, can be knocked over, or loves you is a flat-colour, ink-lined cel. Everything that stays put is soft, unlined, brush-painted gouache. When any visual decision is unclear, ask which of the two it is.

This is the oldest tell of hand-made TV anime: the thing about to move is visibly a cel sitting on a painted background. We turn that production accident into the game's grammar. It gives combat readability for free (cats pop off the town), it gives an affordance language for free (a cel-flat bucket on a painted wall is obviously the bucket you can knock off), and it gives the home story its tenderness (the people are drawn in the same simple ink as the cat; the house around them is painted like a memory).

### 1.2 Supporting principles

| # | Principle | What it means | Design test | Pillar |
|---|---|---|---|---|
| P1 | **Designed from above** | The exploration and combat camera sees a cat's back, ears and tail, not its face. A cat's identity is built on the dorsal view first; the face is a bonus for close-ups. | When a cat needs more identity, change the silhouette seen from above (body, ears, tail) before the pattern, and the pattern before the face. | 4 Rivals Remember; 3 Conduct the Brawl |
| P2 | **Twenty-five centimetres tall** | Detail, colour meaning and craft are spent where a cat looks: below knee height, on floors, under verandas, on hands. Above that, the world simplifies or leaves the frame. | When deciding where to spend texture, modelling or animation budget on a human or a room, spend it below 60 cm. | 1 Cat's-Eye Truth |
| P3 | **Colour says what words cannot** | Every human owns one colour; every Clowder owns one colour; every Life owns a key. Story beats are delivered by a colour arriving, shrinking or going missing. | When a home beat is not reading in playtest, change a colour, an object or the light. Never add a readable sign, and never add a gag. | 1 Cat's-Eye Truth; 2 Two Lives, One Clock |
| P4 | **Loud street, quiet house** | Streets get the whole action-anime toolbox: speed lines, impact frames, smears, glyph bursts, halftone. The house gets none of it: held shots, soft light, small gestures. The two vocabularies never mix in one beat. | When a home scene feels flat, slow it down and move the light; do not add VFX. When a street scene feels flat, add timing contrast and a bigger drawing; do not add melancholy. | 2 Two Lives, One Clock; 3 Conduct the Brawl; tone guardrails |
| P5 | **Printed, not rendered** | Nothing on screen looks computed. No soft glows, no smooth gradients on characters, no alpha fades: tones step, fades are halftone dots, shadows are flat shapes, effects are drawings held on twos. | When an effect or UI transition needs to soften or fade, use a stepped tone or a halftone pattern, not transparency or blur. | 3 Conduct the Brawl (readability) |

### 1.3 What makes this look ours (differentiation from the style reference)

We share the reference's *category* (cel figures on painted nostalgic backgrounds). We must not share its *signature*. These eight markers are mandatory and are the checklist for brief risk 7.

| Aspect | The reference's quality | Our own rule |
|---|---|---|
| Line | Uniform thin dark-brown line | **Aubergine ink** (`#33273B`), two weights (silhouette heavier than interior), tapered at ear tips, tails and whiskers. Never brown. |
| Character shapes | Extremely simple caricature; rounded "potato" heads | Cats built from our **bean / chestnut / pom** kit (Section 3), designed from above. Humans in **naturalistic anime proportions** (7–7.5 heads), never caricature. |
| Point of view | Child's-eye, eye-level framing of whole figures | **Bird's-eye** on the street; **floor-level** at home, where humans are legs, hands and laps. Faces are rare events. |
| Setting | Inland rural summer | A **seaside hill town**: the sea horizon or the hill is in every district's backdrop; the signature hour is **Dusk** (Yunagi means the evening calm). |
| Shadow | Neutral darker tones | Shadow is always **wisteria violet** (`#6E6AA8` family), on cels and on paint. No grey or black shadow anywhere. |
| Action | Gentle, no combat staging | Full **action-anime staging**: impact frames, smears, speed lines, a dust-cloud Pile-On, wordless **glyph bursts** instead of lettered sound effects. |
| UI | Cream panels with brown text and brown tags | **Paper-goods UI**: cream paper, aubergine ink, bell-gold, a flat offset "second print" shadow and halftone; shapes from paw-pads and the bell (Section 7). No brown tags. |
| Whole-screen modes | None comparable | **Whisker Sense** (scent made visible) and **Slow Blink** (an eyelid vignette) are screen states nobody else has. |

A piece of concept art that could be mistaken for a still from the reference fails review even if every other rule here is met.

---

## 2. Mood & Atmosphere

Each state must be tellable from a thumbnail. "Energy" is the density of motion and effects on screen.

| State | Emotional target | Lighting character | Carrier element | Descriptors | Energy |
|---|---|---|---|---|---|
| **Exploration, Morning** | Fresh, hopeful, a town waking | Low sun, pale warm light, cool blue-lavender shadows, long; light mist in low lanes | Long shadows of laundry poles and fence slats across the lane | dewy, pale, airy, quiet | Measured |
| **Exploration, Day** | Swagger, mischief, summer holiday | High sun, near-white light, short hard wisteria shadows, towering cumulus | Hard-edged shade under awnings and eaves; saturated sky | bright, crisp, saturated, busy | Lively |
| **Exploration, Dusk** | The pull toward home | Low orange sun, long plum shadows, windows start to glow | Lit windows and the smell-of-dinner feeling: warm rectangles in cooling streets | golden, glowing, nostalgic, tender | Slowing |
| **Exploration, Night** | The town belongs to cats | Bright moon-blue; nothing truly dark; warm lantern and vending-machine pools | Cat eyes glint; rooftops silver-edged; no humans | cool, luminous, secret, alert | Tense, sparse |
| **Whisker Sense** | Seeing the hidden map | Town drops to near-monochrome lavender-grey; scent glows flat and saturated | Coloured scent ribbons and paw prints on a drained world | hushed, drained, glowing, legible | Still |
| **Standoff** | A showdown played for comedy | Scene dims 15% outside the two cats; a hard light wedge between them | Slanted name-card, arched silhouettes, a single horizontal speed-line band | theatrical, held, cheeky | A held breath |
| **Combat** | Loud, readable cartoon brawl | Scene lighting unchanged (no scene transition); ground inside the ring calms and brightens slightly | Outlines, hit sparks, dust; one screen-wide effect at a time | punchy, clear, bouncy, percussive | Frenetic |
| **Slow Blink** | Calm control inside chaos | Saturation −25% and value −15% on the town; cats keep full colour; an eyelid-shaped vignette closes from top and bottom | The eyelid vignette | suspended, focused, soft-edged | Near-still |
| **Zoomies / Pile-On** | The crowd-pleaser | Flat graphic backgrounds replace the scene for a beat: speed lines, panel splits, inverted impact frame | The scalloped dust cloud with paws and stars flying out | explosive, graphic, silly, triumphant | Peak |
| **Verdict** | Status settled; a small ceremony | Returns to scene light; the loser is centred, small; a soft spotlight shape on the ground | Four choice bubbles around the Routed cat | deliberate, smug, generous | Low |
| **Defeat (slinking home)** | A sting, not a punishment | Scene light with a 10% cool dip; long shadow of the victor; no red, no flashing | Mikan small in frame, ears flat, the victor on a high perch | sheepish, small, bruised-ego | Low |
| **Home** | Safety, tenderness; later, absence | Per-Life colour script (Section 4.6); always softer contrast than the street; one motivated light source | The signature colours and their absence | warm, still, intimate, observed | Contemplative |
| **The Lot** | Clubhouse pride | Same phase key as the street, with rust and tarp colours; bell-gold accents grow with Lot upgrades | The rusting kei truck as a throne | scruffy, cosy, conspiratorial | Relaxed |
| **Doorstep / Morning Sniff** | "What happened overnight?" | Morning key; low angle; the Tribute pile catches the first sun | Scent wisps carrying pictogram stamps | curious, crisp, rewarding | Low, rising |
| **Fence Line and menus** | Surveying your world | Painted panorama in the current phase light; paper UI over it | The wall of cats | orderly, proud, gossipy | Low |
| **Time-skip montage** | Time passing without you | Held painted stills with one moving cel each; seasonal light | The same framing of the house, redressed | wistful, brisk, seasonal | Gentle |
| **Life 8 streets** | Neglect, not tragedy | Overcast or after-rain versions of each key; saturation −20%; rival scent colours creeping back | Faded bell-gold marks in Whisker Sense | grey, damp, untended, stubborn | Subdued |

Rule: the street is never tragic and the house is never slapstick in the same beat (brief §9). Life 8 streets are *neglected*; the grief stays indoors.

---

## 3. Shape Language

### 3.1 The primitives

Four primitives build every character, prop and UI element. Hard corners and straight machine edges are reserved for the human-built background and for danger.

| Primitive | Looks like | Used for | Says |
|---|---|---|---|
| **Bean** | A kidney bean; a soft asymmetric capsule | Cat bodies, UI panels and buttons, speech balloons, clouds | Soft, alive, friendly |
| **Chestnut** | A rounded shape wider at the bottom with a soft point on top | Cat heads (cheeks wide, crown narrower), UI portrait windows, icons | Cat |
| **Pom** | A small imperfect circle | Mikan's tail, the bell, paw-pads, Paws on the gauge, selection dots | Ours: the hero accent |
| **Wedge** | A triangle with one soft corner | Ears, claws, slash arcs, speed lines, name-card banners, warnings | Sharp, fast, threat |

- **Cats** = beans and chestnuts with wedge ears. No straight lines on a cat. Maximum one sharp point per feature.
- **Humans** = longer, straighter, calmer forms than cats: columns (legs), soft boxes (torsos), with rounded joints. They are the architecture of the home. Hands are the exception: fully articulated and expressive.
- **Town** = straight but never ruled: every architectural line has a slight hand wobble and every corner is softened by paint. Roof lines, wall tops and fences run in long horizontals, because those are the High Road and must read as walkable ribbons.
- **Danger and impact** = wedges and zigzags. The only spiky shapes in the game are claws, slash arcs, the Frazzled fur-puff and impact bursts.
- **UI** echoes the cats (beans, chestnuts, poms), not the architecture.

**Hero versus supporting shapes.** A hero shape is one that no other entity may use. Reserved hero shapes: Mikan's **pom tail** and **ginger cap**; the **bell**; each Boss's signature silhouette (Section 5.4); the **scalloped dust cloud** of the Pile-On; the **eyelid** of Slow Blink. Supporting shapes (generic beans, boxes, foliage clumps) must stay lower in contrast and saturation than any hero shape on screen.

### 3.2 Cats: silhouette system (the coat-seed generator's visual parameters)

The nemesis system needs 48 tracked Rivals, up to 24 Crew and passing Strays to read as individuals from above, at about 64 px body length in a handheld fight (Section 13). The generator composes a cat from the axes below. **Axes 1–3 are silhouette axes** and carry most of the identity; axes 4–6 confirm it.

**Axis 1: body type (6).** Footprint = length : width seen from above, at rank scale 1.0.

| Body | Footprint | Read | Style weighting (not a lock) |
|---|---|---|---|
| **Loaf** | 1.3 : 1, near-oval | Heavy, immovable | Bruiser 60% |
| **Bean** | 1.8 : 1 | The standard cat | Any |
| **Wedge** | 1.9 : 1, broad shoulders, narrow hips | Fighter | Scrapper 50% |
| **Noodle** | 2.6 : 1, thin | Slinky, fast | Prowler 55% |
| **Puff** | 1.6 : 1, scalloped fluffy contour | Long-haired, grand | Yowler 45% |
| **Sprout** | 1.4 : 1 at 80% scale, big head | Small, cheeky | Trickster 45% |

Style is confirmed by **stance and idle**, not only body: Bruisers plant wide and sit; Scrappers bounce on their toes; Prowlers hold low with the tail level; Yowlers stand chest-out with the head high; Tricksters tilt the head and carry the tail in a hook.

**Rank scale:** Stray/Tough ×1.0 · Captain ×1.15 · Boss ×1.35 to ×1.8 (authored) · Mikan ×1.0 as an adult. Bigger means higher rank, always.

**Axis 2: tail (8).** Long whip · thick ringed · plume · kinked (one lightning bend) · hook (curled over the back) · stub (short and blunt, not round) · bottle-brush (permanently puffed) · broken-tip (last quarter bent sideways). The round **pom** is reserved for Mikan.

**Axis 3: ears (6).** Standard · wide-set low · tall and narrow · small round · tufted tips · one folded. Scars later modify these (notch, tear).

**Axis 4: head (3).** Round · narrow wedge · wide-cheeked (tomcat jowls).

**Axis 5: coat pattern (dorsal-first, 14 classes).** Solid · saddle (one back patch) · cap-and-saddle · tuxedo · van (colour on head and tail only) · mackerel tabby (3–5 bold bands across the back) · blotch tabby (one bullseye swirl per flank) · spotted (7 big spots at most) · tortoiseshell (2 colours in large blocks with a split face) · calico (3 patches on white) · pointed (dark ears, mask, tail, paws) · dorsal stripe (one line nose to tail) · half-and-half (left/right split) · cloud (soft-edged pale patches on dark). Modifiers: socks (0–4, asymmetric allowed), tail tip, blaze, chin, eyebrow dots.

Pattern rules:
- Patterns are **borderless flat colour shapes** with crisp edges. No pattern has an ink line around it, no fur strokes, no gradients.
- **Maximum 3 coat colours** per cat. No pattern element smaller than 4% of the dorsal area (it would vanish at 64 px).
- The pattern is designed on the top view first, then wrapped. The belly is nearly always the lightest colour (it is rarely seen).

**Axis 6: coat colours (12 fills).** Each has an authored shade tone (Section 4.2).

| Name | Lit | Shade | Notes |
|---|---|---|---|
| White | `#FFF8EC` | `#D8D2EA` | Never pure white; shade is lavender |
| Cream | `#F3DDB3` | `#CDB3A6` | |
| Marmalade | `#D98A3D` | `#B0603A` | The orange for non-Mikan cats |
| **Mikan Ginger** | `#F28C28` | `#C9602E` | **Reserved for Mikan** |
| Rust | `#B5562B` | `#8A3C33` | Madam Sabi's family |
| Brown | `#8B5E3C` | `#684238` | |
| Chocolate | `#5E4338` | `#463040` | |
| Fawn | `#D9B48F` | `#B58D85` | |
| Silver | `#A8AEBC` | `#8388A6` | |
| Blue-grey | `#6F7A8F` | `#555A7C` | |
| Charcoal | `#4F4C5E` | `#3F3A52` | |
| Black | `#3D3A4F` | `#33304A` | "Black" is dark indigo-grey so the ink line still reads; see 10.2 |

Eyes (seen in close-ups and portraits): amber `#FFB52E` (Mikan), green `#7CC65A`, yellow-green `#C9D94A`, blue `#5AB0E8`, copper `#D9772E`, odd-eyed (any two). Flat disc, slit or round pupil in ink, one hard white highlight.

**Distinctness constraints (generator must enforce):**
1. No two cats in the whole town share the same (body, tail, dominant colour) triple.
2. Any two Rivals in the same district differ on at least two of the three silhouette axes, or on both pattern class and dominant colour.
3. Reserved combinations are never generated: ginger cap over both ears on a white body; pom tail; any Boss's signature (Section 5.4).
4. Each Clowder biases (about 60%) toward a small set of coat colours so a gang reads as a family: Wall Sitters toward white, cream and silver; Awning Gang toward rust, marmalade and tortoiseshell; Lantern Eyes toward black, charcoal and blue-grey; Salt Paws toward brown and fawn tabbies; Rust Runners toward silver, charcoal and marmalade; Steam Court toward white, cream and pointed coats.

**Acceptance test for the generator:** render 8 generated Rivals of one district as flat black top-down silhouettes 64 px long. A reviewer who has seen the coloured versions once must match at least 6 of 8. Then repeat in colour at 64 px with the combat outline on: 8 of 8.

### 3.3 History worn on the model (Scars, Titles, rank)

Scars are cartoon-cosmetic and never read as wounds: no red, no open marks.

| Scar | Slot | Visible from above? |
|---|---|---|
| Notched ear / torn ear tip | Ear L or R | Yes: changes the silhouette |
| Sticking plaster (cream strip or X) | Brow, nose bridge, shoulder, rump | Yes: high contrast |
| Kinked tail tip | Tail | Yes: silhouette |
| Bald patch (lighter, pinkish-fawn shape) | Shoulder, flank, rump | Yes |
| Three pale scratch lines (lighter than the coat, never red) | Flank, shoulder | Yes at exploration distance, marginal in combat |
| Bent whisker | Face | Close-ups only |
| Chipped fang, eyebrow nick | Face | Portraits only |

Rules: the **first Scar a cat earns goes to a silhouette slot** (ear or tail) if one is free, because that is the one the player will see in a fight. Maximum 4 Scars shown; older ones stay. A Scar placed by Mikan's Posse is positioned on the side the finishing hit came from where the data allows.

**Rank dress.** Toughs wear nothing. Captains and Bosses carry one piece of **regalia**, a found object: a frayed rope loop, a bandana scrap, a bottle-cap pendant, a clothes-peg on one ear, a leaf that never falls off, a fish-bone, a sardine-tin lid. **Collars mean pets**: only Mikan (red collar, brass bell) and Botan (silk ribbon) wear one. Proposal for creative-director review: Bell Clowder Crew wear a knotted **bell-gold cord** on the tail base or a foreleg (a mark of the gang, pointedly not a collar), so Sentries and Wardens read as yours in the world without UI.

### 3.4 Humans from cat height

- Proportion: naturalistic anime, adults 7–7.5 heads, slim ankles and wrists, simplified but correct anatomy. Children are true child proportions, not chibi.
- **Detail lives below 60 cm**: shoes, slippers, socks, hems, trouser creases, bag bottoms, hands. Shoes are character design: each household member has a readable shoe wardrobe per Life (Sora is introduced as a pair of shoes).
- **Hands are the faces.** Hands get the best topology, a pose library and the most animation attention on any human. A hand's approach (palm down, slow) is how a human "speaks" to Mikan.
- **Faces are rare and plain.** When a human crouches, bends or lifts Mikan, the face that arrives is simple and gentle: two eyes with one highlight, a small nose mark, a line mouth, a blush shape. No caricature. Faces never appear large on screen for more than a few seconds, and never to deliver information that staging could carry.
- **Signature colour sits low**: every household human shows their signature colour below 60 cm in every costume (socks, slippers, hem, cuff, apron edge), plus a personal textile motif so the colour is never the only cue (Section 4.5).
- Street humans are "weather": simpler models, muted district-palette clothing at reduced saturation, no signature-colour hues at full strength, no faces designed to be read.

### 3.5 Environment and UI shape rules (summary)

- Walkable High Road surfaces read as **continuous pale ribbons** with a slightly lighter top edge; anything you cannot walk on is broken up, darker or foliage-covered.
- Scent Posts are **vertical hero props**: one clean upright per Patch, taller than a cat, standing clear of clutter by at least 1 m of quiet ground, drawn as a cel prop (inked).
- UI shapes are in Section 7.2.

---

## 4. Color System

All hex values are sRGB and are the colour that must arrive on screen under the neutral Day key (Section 10.8 forbids tone-mapping that would shift them).

### 4.1 Core palette (12)

| # | Name | Hex | Meaning in this world |
|---|---|---|---|
| 1 | **Aubergine Ink** | `#33273B` | Every outline, all UI text. Our "black". |
| 2 | **Paper Cream** | `#FFF6E3` | UI ground, balloon fill, the white of Mikan's coat family, dust clouds. |
| 3 | **Mikan Ginger** | `#F28C28` | The protagonist. Reserved. |
| 4 | **Collar Crimson** | `#D02A45` | Mikan's collar: belonging. Also the single "important" accent in UI. Never used for damage or danger. |
| 5 | **Bell-Gold** | `#F2B01E` | The Bell Clowder, the Posse, everything that is the player's. |
| 6 | **Haru Yellow** | `#FFD23F` | Haru. Later: sunlight itself. |
| 7 | **Sora Teal** | `#1FA39A` | Sora. |
| 8 | **Koharu Coral** | `#FF7F6B` | Koharu. |
| 9 | **Gran Plum** | `#8E4A7B` | Gran. |
| 10 | **Summer Sky** | `#3F9BE6` | The Day sky; freedom, outdoors. |
| 11 | **Leaf Green** | `#5DB24B` | Gardens and hills; also Nerve (health). |
| 12 | **Shadow Wisteria** | `#6E6AA8` | Every shadow, on cels and paint. |

Support neutrals: Warm Wood `#C28A52` · Tatami `#D9C98A` · Plaster `#F3E3C3` · Roof Tile `#6F8296` · Stone `#A9A79E`.

**Bell-Gold and Haru Yellow are a deliberate family.** The bell came from Haru; Mikan's gang colour is her colour, deepened by the street. They are kept apart by context (Bell-Gold is a street and UI colour, Haru Yellow is a home colour), by value and hue (gold is darker and more orange) and by form (gold is always on poms, bells and marks; yellow is always cloth, plastic or light). This is flagged in Section 15 as something to test.

### 4.2 Tone rules (how any colour gets its shade)

- Every cel colour has exactly **two tones**: lit and shade. The shade is **authored, not computed by darkening**: hue rotated 8–15° toward violet, saturation +5 to +10 points, value −18 to −24 points (HSV). Whites shade to lavender `#D8D2EA`, never to grey.
- Painted backgrounds follow the same idea: shadow areas lean wisteria, sunlit areas lean warm cream.
- **Value bands.** In the play space (ground and High Road surfaces) painted backgrounds stay inside L* 35–80 with local contrast no higher than 15 L* points. Cels own the extremes: the near-white of a coat and the near-black of the ink. This is the main reason cats read on any ground.
- **Saturation ceiling.** Painted backgrounds cap at about 70% HSV saturation. Cels, VFX and signature-colour objects may reach 90%. A background element that needs to exceed the cap is by definition a hero prop and needs sign-off.

### 4.3 Semantic colour (the street's vocabulary)

| Meaning | Colour | Hex | Shape or other backup (never colour alone) |
|---|---|---|---|
| Player / Posse / Bell Clowder | Bell-Gold | `#F2B01E` | Chevron tick above each Posse cat; bell emblem |
| Nerve | Leaf Green to Coral when low | `#5CC46B` → `#FF7F6B` | Bar length; the bar wobbles below 25% |
| Paws (Pounce Gauge) | Pad Pink | `#F6809A` | Paw-pad segments; a filled pad pops and gains a highlight dot |
| Frazzle gauge | Static Yellow | `#FFE14A` | Zigzag-edged bar |
| Frazzled | Frazzle Magenta | `#FF3D8B` | Fur-puff silhouette, spiral eyes, orbiting squiggles |
| Ruffled | Ruffle Orange | `#FF9A2E` | Raised hackle ridge, sweat-drop mark |
| Zoomies ready | Bell-Gold with a white pulse | `#F2B01E` | Ring around the portrait completes and bounces |
| Claw | Ice Cyan | core `#EAFBFF`, edge `#39C6F0` | Three parallel thin arcs |
| Fang | Bite Violet | `#B04DDB` | Two crescents closing like jaws |
| Thump | Thump Amber | `#FFB02E` | Ring shockwave plus a four-point star |
| Yowl | Yowl Lime | `#8BE04A` | Wavy concentric sound arcs |
| Heal / purr | Purr Rose | `#FFB3C1` | Soft rings rising, small heart |
| Morsels | Fish Blue-silver | `#9CC7E0` | Fish icon |
| Shinies | White with a three-colour glint | `#FFFFFF` | Four-point sparkle |
| Bond | Collar Crimson | `#D02A45` | Hearts |
| Unknown Rival | Aubergine Ink | `#33273B` | Solid silhouette with two eye glints |

Red is deliberately **not** the colour of damage. With no blood in the game, the reds are saved for the collar, for Bond and for Akane's vermilion.

**Clowder scent colours** (Whisker Sense, combat outlines, UI). Each has an emblem so colour is never the only cue.

| Clowder | Hex | Emblem |
|---|---|---|
| Bell Clowder (player) | `#F2B01E` | Bell |
| Wall Sitters (moss green) | `#7A9A3A` | Brick block |
| Awning Gang (vermilion) | `#EB5228` | Scalloped awning |
| Lantern Eyes (indigo) | `#4B4FA8` | Crescent eye |
| Salt Paws (sea blue) | `#2F8FCF` | Wave |
| Rust Runners (orange-brown) | `#B8652A` | Rail tie |
| Steam Court (white-violet) | `#CDBFF0` | Steam curl |

### 4.4 District palettes and temperature

Five swatches each: dominant, secondary, accent, deep, glow. All are painted-background colours (subject to the 70% saturation cap except the accent).

| District | Temperature | Dominant | Secondary | Accent | Deep | Glow | Note |
|---|---|---|---|---|---|---|---|
| **Hidamari Lane** | Warm, sunny | Plaster `#F3E3C3` | Garden green `#6FB552` | Persimmon `#F0803C` | Roof tile `#6F8296` | Laundry white `#FFFDF4` | The most "home-coloured" district; highest ground brightness |
| **Akane Arcade** | Warm red | Awning vermilion `#E2452B` | Butter cream `#F7E2B8` | Signboard teal `#3E8F8A` | Asphalt warm grey `#8A7F7A` | Paper-lantern `#F2B950` | Under the roof the light is filtered and striped; most clutter |
| **Tsukimi Hill** | Cool green by day, indigo by night | Bamboo `#3F7A55` | Mossy stone `#8C9486` | Faded torii `#C9503A` | Night indigo `#2E3A78` | Stone-lantern `#FFD98A` | The only district prettier at Night than at Dusk |
| **Shiosai Harbour** | Cool, bleached | Sea `#2F8FCF` | Foam `#F2F8F7` | Buoy orange `#D8623A` | Wet concrete `#8E9AA0` | Boat-paint teal `#4FA7A0` | Biggest sky; salt-white bloom on everything |
| **Kurogane Yard** | Warm-dark, industrial | Iron `#4E4A55` | Ballast `#9A8F86` | Rust `#B8652A` | Oil shadow `#3B3550` | Sodium lamp `#FFB347` | Lowest ground brightness; vending-machine cyan `#7FD6E8` as night accent |
| **Kasumi Heights** | Cool, misty, pale | Mist `#EEF0F5` | Wisteria `#B9A8E0` | Inn lantern rose `#E86A7A` | Deep pine `#3E6B5C` | Hinoki `#D9B88C` | Value range compressed by steam; the highest and palest district |

Climb rule: districts 1 to 6 move from warm, saturated and low to cool, pale and high, so the player feels altitude and status as a colour journey; Akane and Kurogane are the two warm spikes on the way.

### 4.5 The household (signature colours in practice)

| Human | Colour | Hex | Value (L*) | Textile motif (backup cue) | Recurring objects |
|---|---|---|---|---|---|
| **Haru** | Yellow | `#FFD23F` | about 86 | Plain block colour, round forms (hood, round hair clip, buttons) | Raincoat, umbrella, hair clip, mug, slippers |
| **Sora** | Teal | `#1FA39A` | about 60 | Horizontal stripes | Shoes with a teal sole stripe, socks, a striped mug |
| **Koharu** | Coral | `#FF7F6B` | about 68 | Dots | Blanket, rattle, boots, school-bag charm |
| **Gran** | Plum | `#8E4A7B` | about 41 | Small cross-hatch weave | Cushion, apron, a shawl, the photo frame cloth |

The four are separated in lightness as well as hue, and each has a motif, so the story survives colour-blindness and a greyscale screen. Rules: a signature hue at full saturation is never used on any other object inside the house; on the street the four hues appear only desaturated or as the canonical semantic colours of Section 4.3.

### 4.6 Time-of-day keys

One key per phase, applied town-wide and then biased by the district palette. Cels are multiplied by the cel tint; their shade tone is replaced by a mix toward the shadow colour.

| Phase | Sky zenith | Sky horizon | Key light | Shadow colour | Cel tint | Notes |
|---|---|---|---|---|---|---|
| **Morning** | `#BFE3F2` | `#FFE9C7` | `#FFF4DC` | `#8FA0CF` | `#FFF6E8` | Long shadows (sun elevation about 20°), low mist cards, dew glints |
| **Day** | `#3F9BE6` | `#A9DBF5` | `#FFFBEF` | `#6E6AA8` | `#FFFFFF` | Short hard shadows (about 65°), tall cumulus with `#C9D8F0` shade |
| **Dusk** | `#8E6FB0` | `#F7A45A` | `#FFC27A` | `#7A4E8C` | `#FFDDB5` | Longest shadows (about 12°); windows switch on (`#FFD98A`); the hero look for key art |
| **Night** | `#1F2F6B` | `#3F5FB0` | `#BFD4FF` (moon) | `#2A3470` | `#B8C8F5` | Bright moon-blue. **Value floor: nothing in the play space below L* 22.** Warm pools from lamps; cat eyes glint |

Transitions between phases blend over about 20 s of roaming time (proposal; the clock is canon, the blend length is ours). The end-of-Night drowsy state adds a soft cream vignette at the screen edges, not a dark one.

### 4.7 The owner story colour script (per Life)

This is the core of P3. "Presence" is a rough share of a typical home frame taken by each signature colour at full saturation; it is direction for set dressing and costume, not a metric to automate.

| Life | Key and light | Yellow (Haru) | Teal (Sora) | Coral (Koharu) | Plum (Gran) | Saturation | The image |
|---|---|---|---|---|---|---|---|
| **1 The Box in the Rain** | Rain blue-grey `#7C8FA6` outside; lamp amber `#FFC98A` inside | The only saturated thing in the rain: the raincoat. 10% | none | none | Present, stern, large blocks. 8% | Exterior −30%; interior normal | A yellow shape bending over a wet box. The red collar arrives. |
| **2 Uniform** | Spring clear; fresh greens; desk-lamp pool `#FFE7A3` at night | Small and everywhere: clip, bag charm, mug. 6% | none | none | Warm, softened. 8% | Normal | Navy uniform `#2F3E63` legs with yellow socks; a lit window late at night |
| **3 The Empty Room** | Cool dust-light `#A9B9C9` in Haru's room; the rest of the house warm but dim | **Withdrawn**: under 1%, only objects left behind. On visit days it floods back to 12% with festival colour | none | none | Dominant: 12% | −15%; visit days +10% | A still room with one yellow thing on the desk |
| **4 Two Pairs of Shoes** | Evening interiors; a cooler note at the entryway | Back, but muted to mustard `#D9A93A` (work clothes). 6% | **Enters at the edges**: entryway, doorways, the far end of the sofa. 2% growing to 7% | none | Shrinking and paler `#A97A9C`. 5% | Normal | Teal shoes beside yellow ones |
| **5 White Day** | High-key cream `#FFF9EE`, flowers, daylight through paper screens | Paired with teal in every frame. 7% | Paired with yellow. 7% | none | One cushion and one framed photo. 1% | Normal, values lifted | A white dress on a door; yellow and teal slippers side by side |
| **6 The Small Loud One** | Night-feed blue `#44507A` with a warm night-light; cluttered days | Tired: slightly desaturated. 5% | 5% | **Arrives as small loud dots**: blanket, toys. 3% growing to 8% | Photo only. under 1% | Normal; nights −20% | A coral bundle where the lap used to be |
| **7 The Long Summer** | Deep summer: Day key at full strength, fireworks, watermelon red and green | Full. 9% | Full. 8% | Full. 9% | Photo. under 1% | **+10%: the most saturated the game ever gets** | Three colours on the veranda at Dusk |
| **8 The Door** | Rain blue-grey again (rhymes with Life 1); cold entryway light `#C9D3DC`; incense haze | **Removed.** Only two yellows remain in the house: the raincoat on its hook and Mikan's bell. Then a second photo frame beside the plum one | Dimmed toward grey-teal `#5E8F8C`. 5% | Dimmed `#D9897C`. 5% | Photo | **−40%**, value range compressed; recovers by steps as Mikan brings food home | A closed door, seen from the floor, for a long time |
| **9 Nine** | Dawn pastels; lighter, emptier rooms; clean morning light | **Returns as light**: sun patches on the floor are Haru Yellow, and Koharu wears the round yellow hair clip. 5% as objects, plus the light | Soft. 6% | The household's main colour now. 10% | Photo, beside a yellow-framed one | −10%, high key | Small coral hands filling the bowl in a yellow patch of sun |

Rules that make the script work:
1. Signature colours are **exclusive inside the house** (4.5). If a dresser adds a random yellow cushion in Life 8, the script breaks.
2. The Life 8 desaturation applies to the **house and its people, not to Mikan**. Mikan keeps full colour: the bell and the collar become the warmest things in every frame.
3. Life 1 and Life 8 share weather, key and one composition (a yellow raincoat in rain; a yellow raincoat on a hook). Layout and lighting must keep that rhyme exact.
4. Haru Yellow as sunlight in Life 9 is achieved by tinting the interior sun patches and Sunspots at home, never by a visible ghost, glow figure or any supernatural reading.

### 4.8 UI palette

| Role | Hex |
|---|---|
| Panel ground (Paper Cream) | `#FFF6E3` |
| Panel ground, recessed | `#F4E6C8` |
| Ink (text, outlines) | `#33273B` |
| Secondary text | `#6B5A73` |
| Offset "second print" shadow | `#6E6AA8` (flat, no blur) |
| Player accent | `#F2B01E` |
| Important / confirm accent | `#D02A45` |
| Disabled | `#C9BFC4` on `#F4E6C8` |
| Positive | `#5CC46B` |
| Caution | `#FF9A2E` |

Divergence from the world palette: the UI never uses the four household hues at full saturation (they belong to the story), and never uses painted texture; it is flat print. Contrast: Ink on Paper Cream is about 13:1; Secondary text on Paper Cream about 6:1; body text may not be set on any Clowder colour except in Ink on Bell-Gold, Steam Court or Static Yellow.

### 4.9 Colour-vision safety

| Risk pair | Who is affected | Backup cue |
|---|---|---|
| Wall Sitters moss vs. Rust Runners orange-brown vs. Awning vermilion | Protan, deutan | Clowder emblems on name-cards, Scent Posts (Whisker Sense) and the Fence Line; districts are spatially separate, so mixed-gang fights are rare |
| Posse vs. enemy outlines | All | Posse: chevron tick above the cat plus a thin gold keyline. Enemies: thicker halo plus a Frazzle gauge. Shape differs even in greyscale |
| Nerve green to coral | Protan, deutan | Bar length and a wobble under 25% |
| Claw / Fang / Thump / Yowl | All | Each has a unique shape (4.3); colour is secondary |
| Frazzle yellow vs. Ruffle orange | Deutan | Zigzag bar vs. hackle-and-sweat-drop icon; Frazzled changes the silhouette |
| Lantern Eyes indigo scent on the Night key | All (low contrast) | Scent marks carry a 1 px Paper Cream edge in Whisker Sense |
| Steam Court white-violet on Kasumi mist | All (low contrast) | Same cream/ink double edge; see Section 15 |
| Household colours | All | Lightness ordering plus textile motifs (4.5) |

A colour-vision option set (deutan, protan, tritan presets that swap Clowder hues) is recommended to UX; the art requirement is that every state above passes in greyscale without it.

---

## 5. Character Design Direction

### 5.1 Mikan (fixed design; canon in brief §3.1)

White body, ginger cap over both ears, ginger patch over the left eye, pom-pom stub tail, amber eyes, red collar with one small brass bell. Bean body, chestnut head, standard ears.

**The three-point read from above:** (1) ginger cap, (2) crimson collar ring with a gold dot, (3) white pom tail with a ginger tip. If any one of the three is hidden or recoloured by an effect, light or outfit, the other two must still be visible. No other cat may have two of these three.

| Life | Stage | Silhouette | Colour and detail | Animation set |
|---|---|---|---|---|
| 1 | Kitten | ×0.6 scale; head is 45% of body length; oversized ears; the collar is too big and the bell hangs low | Brightest ginger; eyes larger | Kitten set: bouncy, overshooting, tumbles on landings |
| 2 | Young adult | ×0.9; lanky, long legs, thin neck | As canon | Adult set, with extra swagger and slightly too much speed |
| 3–6 | Adult / Prime | ×1.0; by Life 5 a fuller chest and thicker neck | As canon | Adult set (no silhouette change, per canon) |
| 7 | Greying | ×1.0, same silhouette | Grey flecks on the muzzle and eyebrow dots; ginger shifts slightly toward `#E89A45` | Adult set |
| 8 | Old | ×0.97; thinner, hips and shoulder blades show as soft angles; head carried lower | Ginger `#E3A566`; white a touch warmer; collar faded to `#B8455A` | Old set: slower starts, careful jumps, a longer sit-down |
| 9 | Elder | ×0.95; slight sway-back; whiskers droop; tail pom smaller and flatter | As Life 8, with paler eyes | Elder set: walks, short trots, no sprint; stops to rest |

The collar and bell are the same object for nine Lives. They age (faded, scuffed) but are never replaced.

### 5.2 Telling cats apart at a glance

| Group | In the world (no fight) | In a fight |
|---|---|---|
| **Mikan** | Three-point read; collar and bell | Ink line + gold keyline + a larger chevron tick with a bell |
| **Posse / Crew** | Bell-gold cord (proposal, 3.3) | Ink line + thin bell-gold keyline + small chevron tick |
| **Rivals** | Rank scale, regalia, Scars; own name-card on approach | Ink line + thick **Clowder-colour halo**; Frazzle gauge overhead |
| **Nemesis** | As Rival, plus a small scribbled storm mark that appears over the head when it first sees Mikan | As Rival; the halo pulses once on each of its Moves |
| **Strays** | No regalia, no cord, duller coat saturation (−10%) | Halo in neutral Paper Cream |
| **Critters** | Non-cat silhouettes, drawn with more wedges and zigzags; never cuter than the cats | Halo in neutral Paper Cream; no name-card |
| **Sentries** | Sit at the Scent Post facing outward, with the cord | n/a |

### 5.3 Expression and pose

- **Exaggerated, pose-to-pose, readable from above.** Emotion is carried by the things the camera sees: tail (up, hooked, puffed, tucked, lashing), ears (forward, airplane, flat), spine (arched, loafed, stretched), fur volume. Faces add to this in close-ups only.
- Face features are 2D drawings on the head (swapped eye and mouth drawings, not sculpted): a set of at least 12 eye shapes and 8 mouths shared by all cats, plus Mikan extras. Expression changes are cuts, not blends.
- Comedy marks are allowed on cats on the street: sweat drop, vein-pop scribble, stars, spiral eyes, a soul-puff sigh. They are drawn objects, held on twos.
- **No comedy marks on humans, ever**, and none on Mikan inside the house during a drama beat. Sense Icons (brief §5.5) are the only symbol allowed at home, and they are small and quiet.

### 5.4 The six Bosses: reserved hero shapes

Art direction for the authored Bosses. Narrative owns personality; these are silhouettes to protect.

| Boss | Body and scale | Reserved shape | Colour | Regalia / tell |
|---|---|---|---|---|
| **Daifuku** | Loaf ×1.8 | A near-perfect circle from above; ears almost lost in the mass | White with a silver saddle | None. He is the wall. A flat warm spot of dust around him |
| **Madam Sabi** | Puff ×1.35 | A wide ruff like a collar of fur; upright teardrop from above | Rust tortoiseshell, split face | A faded vermilion ribbon scrap from a shop parcel, tied by a shopkeeper |
| **Oboro** | Noodle ×1.4 | The longest, thinnest line in the game; tail as long as the body | Black (indigo-grey) with no markings; pale green eyes | Nothing. In the Night key only eyes and a thin moon-rim are clear until the Standoff |
| **Ikari** | Wedge ×1.45 | Massive shoulders, one closed eye drawn as a simple curved line (no scar tissue) | Brown mackerel tabby with pale "salt" speckles on the back | A loop of frayed net cord |
| **Kiha & Moha** | Two Beans ×1.15 each | **Mirror twins**: identical silhouettes with mirrored markings (one left sock and left ear tip, one right) | Silver and blue-grey, reversed between them | Each has one half of a matching rust-orange tag |
| **Botan** | Puff ×1.6 | An enormous plume tail and a mane; a cloud with a face | Pure long-haired white (the only cat allowed `#FFFFFF` highlights) | Silk ribbon collar in Steam Court white-violet with a peony-pink knot `#E86A9A`: a pet, like Mikan |

### 5.5 Household humans: models and ageing

| Human | Variants needed | Notes |
|---|---|---|
| **Haru** | 5: age 16 (raincoat, casual), 17–18 (uniform), 18–22 (visiting, city clothes), 23–26 (work clothes, wedding), 28–31 (pregnant, parent) | Short dark bob throughout; hair colour a warm near-black `#3F3340`. Yellow in every costume, below 60 cm |
| **Sora** | 3: 24–26, 28, 31 and after (Life 8–9: thinner, plainer clothes, teal dimmed) | Teal sole-stripe shoes are the introduction and must be a memorable design |
| **Koharu** | 3: infant bundle, toddler (about 3), child (8) | In Life 9 inherits the round yellow hair clip |
| **Gran** | 2: Life 1–2, Life 3–4 (slower, a walking stick) | From Life 5: a framed photo on her plum cushion. The photo shows a figure and colours, never a readable face close-up |

Presentation of Haru and Sora is an OPEN user question (brief §11.4); if it changes, only this table changes, not the colour script.

### 5.6 What survives at camera distance (LOD philosophy)

| Distance class | Cat size on screen (1080p) | What must read | What may be dropped |
|---|---|---|---|
| Combat, handheld worst case | about 64 px long | Body type, tail, ear silhouette, dominant colour, outline colour, Frazzled state | Face, whiskers, small Scars, regalia |
| Exploration | about 130 px long | All of the above plus pattern class, plasters, regalia | Whiskers, eye colour |
| Standoff, Slow Blink focus | 250–400 px | Everything, face expressions | Nothing |
| Portrait rig (name-card, Fence Line, cut-ins) | 400 px and up | Everything at best quality, heavier line | Nothing |

There is one gameplay mesh per cat plus a portrait-quality head (Section 8). Because the camera never free-rotates or zooms out far, classic distance LOD chains are mostly unnecessary.

---

## 6. Environment Design Language

### 6.1 The town

Yunagi is a Showa-nostalgic seaside hill town, year and country never stated. Low wooden and mortar houses, tiled roofs, block walls, utility poles with too many wires, narrow stepped lanes, a covered shopping arcade, a fishing harbour, a freight yard, hot-spring inns in mist. It is drawn with affection, slightly sun-bleached, lived-in but not derelict. Every district has **the sea or the hill in its painted backdrop** so the player always knows how high they have climbed.

**Texture philosophy: painted gouache, not PBR.** Light, shade and surface character are painted into the albedo by hand: opaque paint, visible brush direction following form, dry-brush edges, warm lights and violet shadows, no photo textures, no normal-mapped surface detail, no metalness or roughness response. Reason: P1 needs backgrounds that are unmistakably "paint" so that everything inked reads as "alive"; and a painted surface carries nostalgia where a physically lit one carries only accuracy.

Rules for all environments:
1. **No outlines on environment.** The single exception is the cel prop (rule 2).
2. **Cel props.** Anything a cat can knock over, push, hide in, or trigger (buckets, bottles, crates that break, sprinklers, the scooter, flower pots on ledges), every Scent Post, every Sunspot cushion, food and doors that open are **inked flat cels** sitting on the painted world. If it is inked, it does something. Never ink a purely decorative prop.
3. **Quiet ground.** Walkable surfaces (ground and High Road) use larger brushwork, lower contrast and fewer colours than walls and foliage. Clutter hugs the walls; the middle of a lane is calm.
4. **High Road ribbons.** Wall tops, fence rails, roof ridges and awning edges get a continuous lighter top stroke. Unwalkable tops are broken by foliage, spikes of tile or clutter. This must be readable without Whisker Sense; Whisker Sense only confirms it.
5. **Scribble.** All human writing uses the Scribble glyph set (6.5). Signs keep the layout, colour and rhythm of real signage so shops are identifiable by picture, colour and shape.
6. **Skies and far distance are paintings**: cumulus, sea horizon, hills and far roofs are layered painted backdrops with slow cloud drift, not geometry.
7. **Foliage** is painted in clumps of three values with a few loose leaf strokes on the lit edge; it moves as whole clumps on threes, not per-leaf.
8. **No human-made surface is new.** Everything has a little sun-bleaching, a stain or a repair, painted in. Nothing is filthy.

### 6.2 District language

| District | Architecture and shapes | Signature props (cel props in bold) | Density | High Road character | Scent Post types |
|---|---|---|---|---|---|
| **Hidamari Lane** | One- and two-storey houses, block and plaster garden walls, hedges, small gates | Laundry poles, potted plants, bicycles, **watering cans**, **flower pots**, garden hoses, **sprinklers** | Low to medium; wide quiet lanes | Garden walls and low roofs; easy, continuous | Lamp post, mailbox, gatepost |
| **Akane Arcade** | Covered street, shopfronts with rolling shutters, tiled floor, hanging signs | Awnings, **crates**, **fish trays on ice**, croquette stall, **bottle racks**, noren curtains, hanging lanterns | High at the edges, a clear central aisle | Awning tops, sign brackets, the arcade roof beams | Sign pole, gacha machine, shop bench |
| **Tsukimi Hill** | Long stone stairs, torii, a small shrine, bamboo, graves, stone walls with moss | Stone lanterns, **offering saucers**, plain weathered stone figures (no identifiable deity or mascot), **water ladles and basin**, fallen leaves | Low; large simple masses | Stone walls, lantern tops, torii beams, bamboo fence | Stone lantern, stair post, old tree |
| **Shiosai Harbour** | Concrete quays, boat sheds, breakwater, tetrapods | Nets, **buoys**, **ice crates**, **buckets**, drying racks, coiled rope, moored boats (walkable decks) | Medium; big open concrete with prop islands | Boat gunwales, shed roofs, tetrapod tops, stacked crates | Bollard, harbour light, net post |
| **Kurogane Yard** | Station platform, freight sidings, corrugated warehouses, a footbridge | Rails, **oil drums**, **vending machines** (glow, noise), pallets, signal boxes, parked freight wagons | Medium-high; long straight lines | Wagon roofs, pipe runs, warehouse eaves, the footbridge | Signal post, vending machine, platform bench |
| **Kasumi Heights** | Hot-spring inns with deep eaves, stone stairways, wooden bridges, the lighthouse | Steam vents (hazard and cover), **wooden wash buckets**, paper lanterns, bamboo spouts, koi pond | Low-medium; soft edges lost in steam | Inn roofs in tiers, covered walkways, stone walls | Inn lantern, bridge post, the lighthouse door |

Shrine and grave elements on Tsukimi Hill are generic and respectful: no identifiable real shrine, no readable inscriptions (Scribble only), nothing religious used as a joke prop or as regalia.

**Territory dressing (`PatchChanged`).** A Patch held by a Clowder shows it physically, without Whisker Sense: scratch marks on the Scent Post (three pale strokes, more with higher Scent), one or two of that Clowder's cats lounging nearby, and for the Bell Clowder a small bell-gold cord tied on the post once a Sentry is assigned. In Whisker Sense the post carries the scent cloud and emblem. At low Scent the marks look weathered (lighter, broken strokes).

### 6.3 Haru's House across the years

An old wooden house: entryway with a step and a shoe shelf, a main tatami room with a low table, a kitchen with a wooden floor, Haru's room, the veranda, the garden with a low wall. Seen from the floor: the undersides of tables, the edge of the step, the gap under the sliding door.

The **architecture never changes; the dressing always does** (Pillar 2). Change is carried by a small set of tracked "witness objects" that must be designed first and kept in the same place in frame.

| Witness object | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 |
|---|---|---|---|---|---|---|---|---|---|
| **Entryway shoes** | Yellow rain boots; Gran's sandals | School loafers | Gran's sandals only; on visit days, city sneakers | Work shoes + **teal-striped shoes** | Both pairs, tidy; guests' shoes in a crowd | Both pairs, plus tiny coral shoes not yet worn | Three pairs, beach sandals, sand | **Haru's pair does not move.** Black shoes of visitors. Later: her pair is gone from the floor and sits on the shelf | Teal pair, coral school shoes |
| **Coat hook** | Yellow raincoat, dripping | Uniform blazer | Empty hook | Work jacket, a teal jacket | A white dress hung on the door frame | A baby sling | Sun hats | **The yellow raincoat, dry** | The raincoat is still there; a small coral coat beside it |
| **Haru's room** | Cardboard box bed for Mikan | Desk, study lamp, books in piles | Still, dusted, curtains half closed | Reopened; two cushions | Moving boxes | **Nursery**: crib, mobile | Child's drawings (pictures only), toys | Door mostly shut; Koharu sleeps with Sora | Koharu's own room: desk, school bag |
| **Gran's cushion** | Gran on it | Gran on it | Gran on it; Mikan allowed beside | Gran on it, a blanket over her knees | **A framed photo on the cushion** | Photo | Photo | **Two frames** | Two frames, fresh flowers |
| **Mikan's bowl** | A chipped saucer | A proper bowl with a fish drawn on it | Same; filled by plum-sleeved hands | Same; sometimes filled by teal-cuffed hands | Same | Filled late | Filled by small coral hands, spilling | **Empty in the mornings** | Filled by Koharu; the same bowl |
| **The veranda** | Wet; a towel | Homework, a fan | Gran's tea, alone | Two glasses | Flower boxes | Laundry: tiny clothes | Watermelon, sparklers, three pairs of feet | Rain shutters closed | Open; morning sun |
| **The cat flap** | none | **Installed** midway | present | present | present | present | present | present | present, worn smooth |

Rules: each witness object keeps the same camera framing across Lives so the change is readable as a cut (see 13.3 pillow shots). No readable text on boxes, letters, calendars, phones or the television; screens show abstract colour and Scribble. The accident is never depicted or implied by any object (no hospital items, no vehicles, no newspapers).

### 6.4 The Lot, the Doorstep, the Stash

- **The Lot** is the street's version of home: a rusting kei truck (the Boss's seat is the cab roof), stacked crates as tiered seating for Crew, weeds, a tarp. It grows with Lot upgrades through added cel props, and bell-gold cords and found Shinies appear as decoration. It never becomes tidy.
- **The Doorstep** is a stage: one stone step, one sliding door, framed low. The Tribute pile is a cel prop in five sizes (a single fish to an absurd heap) driven by `TributeDelivered`; Haru's bafflement is played in her feet and hands.
- **The Stash** is a hollow under the veranda: cool violet shade with one shaft of light, fish and Shinies in a growing heap.

### 6.5 Scribble (the human writing system)

- A set of about 40 glyphs built from 2–4 brush strokes each, plus 10 "numeral-like" tally glyphs, in two weights (sign brush and thin pen).
- Glyphs must **not resemble** any character of any real script (kana, kanji, hangul, Latin, Cyrillic, Arabic, Devanagari and so on). Acceptance: each glyph is checked by readers of at least Japanese, Chinese, Korean and Latin-script languages; any glyph that reads as a real character or word is redrawn.
- Scribble keeps the *texture* of real text: vertical and horizontal setting, consistent stroke rhythm, plausible line lengths. Clocks have ticks and hands but no numerals. Calendars are grids of Scribble with coloured marks (a yellow circle on a day is allowed; a readable number is not).
- Scribble is never used for cat speech or system UI, and UI fonts are never used on in-world human objects. This rule also covers trailers and store screenshots.

---

## 7. UI/HUD Visual Direction

UX owns layout, flow, controls and accessibility requirements. This section owns the visual language they are built in.

### 7.1 Concept: paper goods

The UI looks like the printed paper ephemera of an old neighbourhood shop: candy wrappers, matchbox labels, milk-bottle caps, stamp cards, price tags. Flat cream paper, one ink, one or two spot colours, a slightly offset second print, halftone dots where a tone is needed. It is rounded and friendly, like the reference's UI in spirit, but it is ours in material: **no brown name tags, no glossy bubbles, no gradients**.

### 7.2 Shape grammar

- **Panels** are beans: rounded rectangles with unequal corner radii and one slightly bulging side; 3 px Ink outline (at 1080p); a flat Shadow Wisteria copy offset 4 px down-right (the "second print"), no blur.
- **Buttons** are small beans or poms. Focus state: Bell-Gold fill, a 2-frame squash bounce, and a paw-pad cursor that presses down beside it. Never focus by colour alone: the cursor and a thicker outline always accompany it.
- **Cat speech balloons** are cloud-edged beans in Paper Cream with Ink text; the tail is a row of three shrinking poms. A shout has a wedge-spiked edge. Balloons carry a small Clowder-colour tab with the emblem on the side nearest the speaker.
- **Sense Icons** sit in a small plain pom bubble: one pictogram in Ink with one accent colour, no text.
- **Name-card (Standoff)**: a slanted wedge-ended banner in the Rival's Clowder colour with the emblem; a chestnut-shaped portrait window; name in display type; Title beneath in italic body type; rank shown as claw-mark pips (Tough 1, Captain 2, Boss 3, Great Boss a small crown of three ear-shapes); known Scars, Fears and Strengths as small stamp icons. It slams in over 3 drawings and settles.
- **Gauges**: Nerve is a pill bar; the Pounce Gauge is a row of paw-pads (each Paw is one pad that fills from the bottom and pops when full); Frazzle is a zigzag-edged bar over the enemy that crackles as it nears full; Zoomies is a ring around the portrait.
- **Halftone** (round dots at 45°) is the only way the UI shows a tone, a disabled state overlay, or a fade.

### 7.3 Diegetic versus screen-space

| Element | Mode | Note |
|---|---|---|
| Scent, trails, footprints, High Road hints | Diegetic (Whisker Sense render state) | The game's only map overlay |
| Posse ticks, enemy halos, Frazzle gauges, balloons, Sense Icons | World-anchored, screen-facing | Constant pixel size, never scaled by distance |
| Posse plates, Pounce Gauge, phase dial, Morsel count | Screen-space | Exploration HUD shows only the phase dial and fades the rest after 3 s of calm |
| Morning Sniff | Diegetic staging + paper overlay | Scent wisps rise from the Doorstep and unroll into stamp-card panels with cat portraits |
| Fence Line | Full-screen diegetic scene | Section 7.6 |
| At home | **No HUD at all** except Bond hearts when they change and Sense Icons | P4 |

The phase dial is a small arc: a sun pom travelling over a roofline silhouette, becoming a moon pom; four tinted segments in the time-of-day keys.

### 7.4 Typography

Personality: soft, round, warm, slightly hand-set; never techy, never childish-wobbly in body text. All suggestions below are published under the SIL Open Font License 1.1 (free for commercial use and embedding, including in games). **The licence file of the exact version shipped must be re-verified by whoever owns legal sign-off before release**; these are suggestions, not cleared assets.

| Role | First choice | Alternates | Use |
|---|---|---|---|
| **Display** (titles, names, verdict labels) | **Mochiy Pop One** (Latin + Japanese) | Fredoka (Latin, variable weight), Baloo 2 | Short strings only, with a 3 px Ink outline and offset print when over the game image |
| **Body / UI** (menus, balloons, descriptions) | **Zen Maru Gothic** (Latin + Japanese, 5 weights) | M PLUS Rounded 1c, Kiwi Maru; Nunito for Latin-only fallback | Medium weight for body, Bold for emphasis |
| **Numbers** (damage, counts, levels) | **Dela Gothic One** | Fredoka Bold | Heavy, wide numerals that survive hit-stop and shake |
| **Other scripts** | Jua (Korean), ZCOOL KuaiLe (Simplified Chinese) as starting points | to be chosen with localisation | Must match the rounded weight of the body face |

Size hierarchy on a 1920×1080 reference canvas (the handheld 720p equivalent is two-thirds of each): display 56–72 · heading 40 · body 30 · caption 26 · **hard floor 24** (16 px at 720p). Cat barks in balloons are body size, 60 characters or fewer (canon), at most 2 lines of about 30 characters. Line height 1.35 for body. Text is never set over the game image without a panel, an outline or a balloon.

Damage numbers: Dela Gothic One, Paper Cream fill with Ink outline, tinted by damage-type colour only on a weakness or a critical; they pop on a 3-drawing arc and are capped by the VFX budget (Section 11.6).

### 7.5 Iconography and UI motion

- Icons: flat filled shapes with a 3 px Ink outline on a 48 px grid, rounded ends, two tones at most, readable at 32 px. Subjects come from the cat world: fish, pads, claws, bells, whiskers, ears, saucers.
- Style icons: Bruiser = a loaf silhouette; Scrapper = crossed claw marks; Prowler = a crescent eye; Yowler = an open mouth with sound arcs; Trickster = a toppling flower pot.
- Fear and Strength icons are pictograms (water drop, cucumber, vacuum, dog, crowd of cats).
- Motion: everything arrives with a small overshoot and settles in 3–5 drawings on twos; panels slide like paper, they do not fade. Exits are faster than entrances. No continuous looping animation on idle UI except one slow element per screen. A "reduce motion" option removes overshoot and shake from UI.

### 7.6 The Fence Line

The hierarchy is a place, not a chart (Pillar 4).

- A **side-on painted panorama of one long wall**, scrolled horizontally, three parallax layers (foreground weeds and poles, the wall, the district's painted backdrop), lit by the current phase key.
- The wall's material changes by district as you scroll: garden block wall with a tile cap (Hidamari), awning beam and stacked crates (Akane), mossy stone with lanterns (Tsukimi), breakwater and tetrapods (Shiosai), corrugated fence and a signal gantry (Kurogane), inn stone wall in steam (Kasumi). The Bell Clowder's section is the Lot's fence with the kei truck behind it.
- **Rank is height.** Each district's Boss sits on the highest perch (a gatepost, a lantern, a bollard); the two Captains on lower posts either side; the five Toughs along the wall. Botan's perch is the highest in the panorama. Mikan sits in the scene too, at a height that follows Clout.
- **States, readable without text:**

| State | Look |
|---|---|
| Unknown Rival | Flat Ink silhouette of its true shape, two eye glints |
| Known | Full colour, idle animation on threes |
| Nemesis | A scribbled storm mark over the head, glaring toward Mikan's seat; mark size follows Grudge |
| Humbled | Sits lower, head down, a small bell-gold tag |
| Chased Off | An empty spot with a dotted outline and paw prints leading off the wall |
| Recruited | Has moved to the Bell section, wearing the cord |
| Rank changed overnight | Hops to its new perch when the screen opens; the displaced cat tumbles one level |
| Feud between Rivals | A chalk-scratch line on the wall between the two; they sit turned away from each other |
| Respect (Nose-Touch) | A small cream nose-mark stamp on the wall beneath the cat |

- Selecting a cat slides up its name-card with Memory shown as a strip of small stamp icons in time order (what happened, with what result), never as a table of text.
- Cats on the wall are the real models through the portrait rig, so every Scar and regalia shows.

### 7.7 Art and readability conflicts (flagged, not resolved)

1. **Minimal exploration HUD versus onboarding clarity.** Art wants the street nearly HUD-free; new players may need persistent prompts. Proposed: prompts in Lives 1–2 only. UX to decide.
2. **Display face legibility.** Mochiy Pop One is charming and heavy; at small sizes and in long strings it clogs. It is restricted to short strings here; if UX needs longer headings, switch headings to Zen Maru Gothic Bold.
3. **Clowder-coloured balloons tabs and outlines versus colour-vision safety.** Covered by emblems, but emblems at 24 px are small on handheld. Needs a handheld test.
4. **Halftone on a 720p screen** can shimmer. Minimum dot pitch 6 px at 720p; test on device.

---

## 8. Asset Standards

**Sourcing note.** `project.yaml` has no `engine` or `performance` block and `.claude/docs/technical-preferences.md` is not configured, so **every budget in 8.4 is a PROPOSED starting point from the art side, not a sourced constraint.** They are sized for the brief's targets (60 fps PC, stable 30 fps on a Switch-class handheld, up to 10 combatants) and must be confirmed or replaced by the technical-artist and technical-director after `/setup-engine`.

### 8.1 Naming

`[category]_[name]_[variant]_[size].[ext]`, lower case, underscores, no spaces.

| Category prefix | Covers | Example |
|---|---|---|
| `char_` | Cats, humans, critters | `char_mikan_kitten_idle_01.fbx`, `char_catbody_noodle_base.fbx` |
| `coat_` | Coat pattern masks | `coat_mackerel_a_512.png` |
| `env_` | Environment pieces | `env_hidamari_wallblock_corner_large.fbx` |
| `prop_` | Cel props | `prop_bucket_tin_small.fbx` |
| `bg_` | Painted backdrops | `bg_shiosai_horizon_day_4k.png` |
| `vfx_` | Flipbooks and effect meshes | `vfx_hitspark_claw_t1_small.png` |
| `ui_` | UI art | `ui_btn_primary_hover.png` |
| `glyph_` | Scribble and combat glyph bursts | `glyph_burst_thump_03.png` |
| `home_` | House dressing sets | `home_entryway_shoes_life4.fbx` |

Variants carry the district (`hidamari`, `akane`, `tsukimi`, `shiosai`, `kurogane`, `kasumi`), the phase (`morning`, `day`, `dusk`, `night`) or the Life (`life1`...`life9`) where relevant.

### 8.2 Formats and colour

- Working files: layered source (PSD or KRA for paint, the DCC's native file for 3D) kept in the art source store, not in the game project.
- Game-ready: meshes as FBX (or glTF if the chosen engine prefers it); textures as PNG (flat colour, masks, UI) or TGA where alpha precision matters; no JPEG anywhere.
- sRGB for colour textures; linear for masks. All palette colours are picked from the swatch file that mirrors Section 4; nobody eyeballs a colour.
- UI authored at 1920×1080 reference; vector or SDF where the engine allows, otherwise 2× raster.

### 8.3 Texture philosophy by asset type

| Asset | Texture approach | Resolution tier |
|---|---|---|
| Cats | **No painted albedo.** Colour comes from palette indices driven by `coat_seed`; pattern is a channel-packed mask (preferably distance-field so edges stay crisp at any size) | 512² mask per pattern class (shared across cats); 512² shared face-drawing atlas; 256² scar/regalia atlas |
| Humans | Flat colour areas + a line/detail mask; signature colour as a palette slot so ageing variants reuse it | 1024² household; 512² street |
| Cel props | Flat colour + line mask | 256²–512², atlased per district |
| Environment | Hand-painted albedo with light and shade painted in; one material type | 256 px per metre in the play space on PC; 128 px/m on handheld (a mip step), 64 px/m beyond the play space |
| Painted backdrops | Layered paintings on cards; Day base + a night-lights mask; one bespoke Dusk repaint per district's hero vista | 4096×2048 per layer on PC, 2048×1024 handheld |
| VFX flipbooks | Hard-edged drawings, 4–8 frames, 2 or 3 flat tones | 1024² atlas at most; 2048² only for full-screen Tier 4 |

### 8.4 Budgets (PROPOSED; see sourcing note)

| Item | PC (60 fps) | Handheld (30 fps) |
|---|---|---|
| Cat, gameplay mesh | 5,000 tris | 3,500 tris |
| Cat, portrait head swap | +4,000 tris (only in portrait rig, one at a time, up to 4 in a Pile-On cut-in) | same |
| Household human | 15,000 tris | 10,000 tris |
| Street human | 6,000 tris | 4,000 tris; at most 8 visible |
| Critter | 2,500–5,000 tris | 2,000–3,500 |
| Cel prop | 150–1,500 tris | same |
| Visible scene total | 800,000 tris | 350,000 tris |
| Draw calls (after batching) | 1,500 | 600 |
| Skinned characters on screen | 10 cats + 8 humans | 10 cats + 4 humans |
| Bones per cat | 45 (shared skeleton across all six body types, including tail chain of 6 and ear bones) | same; 2 influences per vertex on handheld if needed |
| Material slots | Cat 2 (body, face) + outline; human 3 + outline; prop 1; environment 1 per atlas | same |
| VFX overdraw inside the combat ring | 4× | 2.5× |
| Simultaneous flipbook emitters in a fight | 24 | 12 |
| Texture memory, whole scene | 1.5 GB | 600 MB |

**Recorded trade-offs:**
- *Art preference:* a 256 px/m painted texel density everywhere. *Limit:* handheld memory. *Chosen:* 256 in the play space on PC, one mip lower on handheld, lower outside the play space; paint so the brushwork still reads at the lower tier (no detail finer than 8 mm at 128 px/m).
- *Art preference:* a bespoke painting of every backdrop for each of the four phases. *Limit:* 24 or more large repaints. *Chosen:* Day base + night-lights mask + phase grading, with one bespoke Dusk hero vista per district. Flagged in Section 15.
- *Art preference:* separate hand-modelled meshes for all six body types. *Limit:* procedural variety budget (brief risk 8). *Chosen:* one skeleton; body types by two or three base meshes plus shape keys and bone scaling if the technical-artist confirms the outline survives it; otherwise six meshes.

### 8.5 LOD and export

- Cats: one gameplay mesh + portrait head. Street humans: LOD0 and a 50% LOD1 for the far edge of frame. Environment: no LOD chain inside authored camera areas; backdrops are cards.
- Outline data (line width in vertex colour, smoothed normals in a spare UV or tangent channel; Section 10.2) is part of every character and cel-prop export and is validated on import. An asset without it is rejected.
- Pivot at ground contact, facing +Z (or the engine's forward), metres, applied transforms.
- Every character asset ships with a turnaround sheet rendered through the game shader from the exploration camera angle, at 64 px and 130 px, as its acceptance image.

---

## 9. Reference Direction

Five references, each for one specific thing. No two point the same way.

| # | Reference | Take exactly this | Avoid |
|---|---|---|---|
| 1 | ***Shin chan: Shiro and the Coal Town*** (the user's style reference) | The relationship between layers: flat two-tone figures with a clean constant line sitting on lush gouache backgrounds with strong summer light, and the friendliness of rounded cream UI | Everything that identifies it: its characters and their caricature head shapes, brown line and brown tags, its village and layouts, eye-level child framing, any composition. See 1.3 |
| 2 | **Arc System Works' 3D-as-2D fighters** (*Guilty Gear Xrd*, *Dragon Ball FighterZ*) | The technique: edited normals for designed shade shapes, per-character light, stepped animation with held poses, swapped smear meshes, camera cut-ins | Their density of detail, dark palettes, anatomy and intensity. Our cats are four shapes and a tail |
| 3 | **Ozu's "tatami shots" and pillow shots** (the films of Yasujiro Ozu) | A still camera at floor height; life told through doorways, shoes, kettles and empty rooms; cutting to an object and holding | Monochrome austerity. Our house is warm and coloured |
| 4 | **Studio Ghibli town-and-cat films** (*Whisper of the Heart*, *The Cat Returns*) and the painted backgrounds of late-Showa TV anime generally | Hill-town layout: stairs, wires, slopes and a far sea; background paint handling (opaque gouache, violet shade, cumulus) | Their character design and any specific location. Yunagi is not Tama or any real town |
| 5 | **Showa-era print ephemera** (matchbox labels, candy wrappers, milk caps, stamp cards) and two-colour manga printing | The UI material: limited spot colours, offset registration, halftone, rounded hand-set shapes. Also the halftone and speed-line vocabulary for combat | Real brands, real characters, real text. Retro pastiche so heavy it hurts legibility |

### 9.1 Reference boards (described in words; to be assembled by the concept team)

- **Board A, "Cel on gouache".** Stills where a flat character stands on a painted background and the difference in treatment is obvious. Annotate each with line weight, number of tones, and how far the background's values stay from the figure's.
- **Board B, "A town that climbs from the sea".** Photographs of Japanese seaside hill towns and fishing ports: stepped lanes, block walls with tile caps, wire-heavy utility poles, covered arcades with rolling shutters, tetrapods, freight sidings, steaming inn streets. Mid-century to 1980s feel. For structure and props, not for copying a real place.
- **Board C, "Cats from above".** Photographs of street cats shot from roofs, walls and stairs: what a tabby, a calico and a tuxedo look like from on top; how tails are carried; loafing, stretching, squaring up. This is the main board for the coat generator.
- **Board D, "Impact".** Frames from hand-drawn TV action: impact frames in two or three flat colours, smears and multiples, radial and parallel speed lines, dust-cloud brawls with limbs sticking out, manga panel cut-ins, halftone. Annotate how many frames each drawing is held.
- **Board E, "Low and quiet".** Floor-height interior photography and film stills: entryways with shoes, the underside of a low table, feet on tatami, hands with a bowl, light through paper screens, a veranda in rain.
- **Board F, "Paper goods".** Scans of period print ephemera, sorted by shape (labels, tags, caps, stamps) and by number of inks.
- **Board G, "Not this".** Counter-examples: PBR cats, glossy mobile UI, bloom-heavy anime shaders, gradient-shaded "toon" looks, red damage flashes, and the reference's own character art (as the thing we must not resemble).

---

## 10. Rendering Requirements (for the technical-artist)

The goal is a picture that reads as hand-drawn TV anime: flat cels on painted backgrounds. These are **look requirements with acceptance tests**. How they are implemented (shader graph or code, hull or post) is the technical-artist's decision; where a method is named it is a recommendation. Engine notes assume Unity URP as the brief's recommendation and must be re-checked against the pinned engine reference once the engine is chosen.

### 10.1 R-CEL: the cel surface (characters, cel props, VFX meshes)

1. **Two tones only**: lit and shade. One hard threshold. The edge is anti-aliased over about 1–1.5 screen pixels (derivative-based), never a soft gradient.
2. **Shade colour is authored** per palette entry (Section 4.2) and read from a palette or ramp lookup. It is not `lit × grey`.
3. **Character light is decoupled from scene light.** Each camera area authors a character key direction, fixed relative to the camera (default: from upper screen-left, slightly toward the camera). Target: 25–35% of a cat's visible area in shade from the exploration camera. The scene sun moves with the phase; the character key does not, so shade shapes are stable and designed.
4. **Designed shade shapes.** Normals on characters are edited or transferred from simple proxy forms (sphere for the head, capsule for the body) so the shade boundary is one clean curve, with no faceting and no shade crawling over small forms.
5. **No specular, no rim, no ambient occlusion, no received shadow maps** on cels. Allowed highlights: one hard white dot on eyes and one on the bell.
6. **Zone tint instead of cast shadows.** When a character stands in a building's shadow, the *whole* character shifts toward the phase shadow colour (as a TV cel would be repainted in its shadow palette). Driven by one shadow test at the character's root, smoothed over about 0.15 s; strength 60% toward the Section 4.6 shadow colour.
7. **Phase tint.** Cels are multiplied by the phase cel tint (4.6). In the Night key, cats additionally get a thin hard moon-rim on the upper-left edge in `#DCE6FF`; this is the only rim light in the game.
8. Face features, Scars and plasters are flat drawings layered on the surface and are not affected by the shade tone beyond the same two-tone rule.

*Acceptance:* a screenshot of Mikan in the Day key, out of zone shadow, colour-picked on the cap, reads `#F28C28` ±2 per channel; on its shade side `#C9602E` ±2. A turntable shows no more than one shade boundary on the body and one on the head.

### 10.2 R-LINE: the ink line

| Property | Rule |
|---|---|
| Colour | Aubergine Ink `#33273B` for every silhouette line on every character and cel prop. Not per-material tinted lines |
| Weights at 1080p | Silhouette **3.0 px**; interior lines (leg separations, ear inner edge, chin) **2.0 px**. Constant in **screen space**: the line does not thin with distance |
| Resolution scaling | Scale by output height ÷ 1080, clamped to a minimum of 1.5 px (handheld 720p gives 2.0 / 1.5) |
| Close-ups | When a character exceeds about 25% of screen height (Standoff, cut-ins, home camera, portrait rig) the silhouette line grows smoothly up to **6 px**, interior to 3.5 px |
| Taper | Line width multiplier painted per vertex: tapers to 40% at ear tips, tail tips, toes; 0% (no line) on whisker ends |
| Dark coats | Coats darker than Charcoal keep the Ink silhouette (the "Black" fill `#3D3A4F` is deliberately lighter than Ink) and draw interior lines in **reverse ink** `#8A7FA8` |
| Patterns | Coat patterns never get a line |
| Environment | No lines, except cel props, which use the same rule as characters at the same pixel weights |
| Stability | No line flicker or popping while a character turns under the fixed camera; no doubled lines at mesh seams between swapped parts (tail, ears) |

Recommended method: **inverted-hull outlines** for silhouettes (cheap, stable, per-object, works with the swappable part kit), using smoothed normals stored in a spare channel and width in vertex colour, with screen-space width compensation; interior lines either as hull creases on separate shells or as a line mask in the surface. A depth/normal post-process edge pass is an acceptable alternative for cel props only. A full-screen post outline is **not** acceptable for characters because line weight and taper cannot be art-directed per feature and because the environment must stay unlined.

**Combat allegiance outlines** (canon: brief §7), drawn only from Standoff or `EncounterStarted` to `EncounterEnded`:
- Enemies: a second, outer hull in the Clowder colour, **3 px** outside the ink line (2 px at 720p). Strays and Critters: Paper Cream.
- Posse: a thin outer **bell-gold keyline, 1.5 px**, plus the chevron tick above the cat. Mikan's tick is larger and carries a bell.
- The player-controlled cat adds a bell-gold ground ring (flat, hard-edged, 2-frame pulse on switch).
- The ink line always stays between fill and halo, so the halo never changes the cat's own drawing.

*Acceptance:* at 1080p and at 720p, line width measured on a screenshot is within ±0.5 px of the table at the nearest and farthest playable distances.

### 10.3 R-PAINT: the painted environment

1. One environment surface type: painted albedo, no normal maps, no specular. Lighting is a soft two-band response at most (so the paint is not flattened at Night nor blown out at Day), multiplied by the phase key.
2. **Cast shadows are flat colour shapes**: environment-on-environment shadows are rendered hard-edged (slightly softened, about 2 px) and coloured by the phase shadow colour as a multiply-and-tint, never black. Shadow length follows the phase sun elevation (4.6).
3. A subtle **paper-and-brush grain** (4–6% strength) on environment only, anchored in world space (not screen space, to avoid a "shower door" effect under the moving camera). Cels are excluded.
4. Foliage: painted clump cards with soft-normal shading; clump motion stepped on threes.
5. Sky, clouds, sea and far hills: layered painted cards with parallax and slow drift; a night-lights mask switches on windows at Dusk.
6. Water: flat colour with two or three hand-drawn highlight shapes animated on threes; a painted foam line at edges. No reflections, no refraction.
7. Steam, mist, rain: hand-drawn cards and streaks on twos or threes; rain is thin pale diagonal lines plus ground ring drawings, not particles with motion blur.

### 10.4 R-SEP: keeping cels and paint apart

The separation is the style. All seven levers apply at once:

| Lever | Cels | Paint |
|---|---|---|
| Line | Inked | Unlined |
| Tone | 2 flat tones | Continuous brushwork |
| Texture | None | Visible brush and grain |
| Value | Own the extremes (near-white, ink) | L* 35–80 in the play space |
| Saturation | Up to 90% | Capped near 70% |
| Shadow | Blob only; zone tint | Cast flat shadows |
| Motion | Stepped poses | Smooth camera parallax; stepped only for foliage, water, weather |

*Acceptance:* converted to greyscale and blurred by 4 px, every cat in a screenshot of each district at each phase is still visibly separate from the ground under it.

### 10.5 R-BLOB: contact shadows

- Every character and movable cel prop has a **flat elliptical blob shadow**: hard edge, phase shadow colour at 55% multiply, about 0.9× the body footprint, squashed to the ground plane (and to High Road surfaces).
- On a jump the blob stays on the surface below, shrinking to 60% and lightening to 35% at 1.5 m height. It is the player's depth cue for landings and Ambush drops and must never be occluded by ground VFX.
- Characters cast **no** shadow-map shadows.
- Humans get a larger soft-cornered blob; in the home camera, a simple flat floor shadow shape.

### 10.6 R-STEP: limited animation ("on twos and threes")

Poses are held for several display frames while position, camera and physics-driven things stay smooth. To avoid cadence judder, rates are defined per display rate:

| Term | PC, 60 fps | Handheld, 30 fps | Used for |
|---|---|---|---|
| **Ones** | 2 display frames (30 poses/s) | 1 frame (30 poses/s) | Impacts, smears, the 2–4 fastest drawings of an attack |
| **Twos** | 5 frames (12 poses/s) | 3 frames (10 poses/s) | All action: locomotion, attacks, reactions, combat VFX |
| **Threes** | 8 frames (7.5 poses/s) | 4 frames (7.5 poses/s) | Idles, breathing, ambient cats, street humans, foliage, water, UI idles, the Fence Line |

Requirements:
1. Stepping is applied at pose evaluation (or by authoring with stepped keys), per character, with a per-clip rate. It is not a global frame-rate cap.
2. **Input is never delayed by stepping.** A state change shows its first new pose on the next display frame and restarts the step clock. Gameplay timings (active frames, dodge windows, hit-stop) are in seconds, owned by Combat, and independent of the pose rate.
3. Root motion and world position stay smooth. Locomotion cycles are authored so stride and speed match at the stepped rate; visible foot slide of more than about 3 px at exploration distance fails review.
4. Tails and ears may run secondary motion at the same stepped rate as the body; never smooth physics on a stepped body.
5. Home scenes: humans and Mikan on threes with long holds; one moving thing per shot is the ideal.
6. A per-clip override to full rate exists for the few cases that need it (the Call run-home sprint is a candidate for ones throughout).

### 10.7 R-SMEAR: smears, multiples and stretch

- Fast actions replace or deform the mesh for 1–2 "ones" drawings: (a) **stretch** along the motion path up to 200% for a body, 300% for a paw; (b) **smear shapes**: a dedicated wedge-shaped mesh for paw swipes and tail whips; (c) **multiples**: 2–4 ghost paws or heads fanned along the arc for flurries.
- Smears are flat lit-tone colour of the limb, inked on the leading edge only, with a clean open trailing edge that breaks into 2–3 wedge "speed teeth".
- A smear is never on screen longer than about 70 ms and is never the frame on which a hit-stop freezes (freeze on the impact drawing, which must be a strong readable pose).
- The rig must expose squash-and-stretch on spine, neck, tail and limbs; volume is roughly preserved.

### 10.8 R-POST: the final image

- **No tone-mapping curve that shifts hue or saturation** (no filmic/ACES-style look). Colour is authored; the frame is graded only by the per-phase and per-Life lookup tables in Section 4.
- No bloom, lens flare, chromatic aberration, film grain, screen-space AO or motion blur. Glow is a drawn shape (a flat lighter disc with a halftone edge).
- No depth of field on the street. At home, foreground objects (table legs, a bag) may be pre-blurred painted cards to give the floor-level shots depth.
- Anti-aliasing must keep lines crisp: prefer MSAA or a sharp post AA; temporal AA that ghosts on stepped animation fails review.
- Fades are **halftone dissolves** or cuts. Scene and menu transitions use an iris in the shape of a cat's eye pupil, or a paper wipe.

### 10.9 R-WS: Whisker Sense as a render state

A first-class render path (Pillar 1), not a filter over the finished frame:
1. Painted environment: saturation to 15%, values compressed toward the mid-range, hue pushed to lavender-grey `#B9B4C8`. Phase lighting still readable.
2. Cats and Critters keep full colour and line. Humans drop to flat pale silhouettes at 40% (they are not what a cat's nose cares about).
3. **Scent** renders as flat, saturated Clowder-colour forms: a soft-scalloped cloud with four-point sparkles at each Scent Post (size by Scent 0–100, in five steps), drifting ribbon trails along routes, paw-print stamps for Rival footprints (fading in three steps by age), a small steam-curl over hidden food. Each mark carries its Clowder emblem at posts and a 1 px Paper Cream edge.
4. High Road routes: a dashed Paper Cream line along walkable tops and at jump links.
5. Enter and exit in 3 drawings (a ripple from Mikan's nose outward); holding it shows a faint whisker-shaped line pattern at the screen edges.
6. Must be legible in all four phase keys and in Life 8, where fading bell-gold marks are the story.

### 10.10 R-OCC: tall things between the camera and a cat

At cat scale almost everything human is tall. Requirements:
1. Authored yaw per area (canon) is chosen first to keep lanes open to the camera.
2. Any human, wall, roof or tree geometry that would hide a cat or a Scent Post is cut away by a **halftone dissolve** above the occlusion line: the hidden part becomes a dot-screen at about 30% coverage in the object's own flat colour. No smooth alpha fades.
3. Street humans in the bird's-eye view are designed to be read as legs, shoes, bags and umbrellas; their upper bodies commonly leave the frame or dissolve. This supports Cat's-Eye Truth rather than fighting it.
4. A cat hidden behind a non-dissolving object shows as a flat silhouette in its outline colour (Posse gold, enemy Clowder colour).

### 10.11 R-PORT: the portrait rig

Name-cards, the Fence Line, Morning Sniff portraits, Posse plates and Zoomies cut-ins all show **the real generated cat**, rendered through a portrait rig: the portrait head swap, a fixed three-quarter camera, the close-up line weight, a pose from a per-Style pose set, the flat background of the context. No hand-drawn portraits of procedural cats exist. Bosses and Mikan may receive bespoke illustrated cut-ins on top of this.

---

## 11. Combat VFX Language

Combat owns hit-stop, shake amounts, action-line triggers and all durations as gameplay (brief §6). This section defines the drawings, their hierarchy and their look timing. Numbers that affect how long the player waits are **proposals to Combat**.

### 11.1 Rules of the language

1. **Every effect is a drawing**: hard-edged, 2–3 flat tones (a Paper Cream or white core, one colour, optionally Ink), animated on twos, 3–8 drawings long. No soft particles, no additive glows, no gradients, no trails made of fading sprites.
2. **Shape first, colour second.** The four damage types are told apart by shape (4.3) so they survive colour-blindness and a crowded screen.
3. **Fades are halftone**, and effects end by breaking into 2–3 small wedges or dots, not by fading out.
4. **One screen-wide effect at a time** (canon). Tiers 3 and 4 below are screen-wide; a new one cannot start until the current one ends, and Combat arbitrates priority.
5. **The controlled cat is never covered.** Effects draw under the player-controlled cat's outline and tick, except full-screen Tier 4.
6. **No red splashes, no droplets, no liquid of any kind.** Sweat drops and tear drops are flat cream comedy marks.
7. Effects are tinted by damage type or Clowder colour, never by arbitrary taste; white/cream cores keep them readable on any district palette.
8. Every flashing effect obeys 11.7.

### 11.2 Tier catalogue

| Tier | When | Effects | Screen share | Camera |
|---|---|---|---|---|
| **T0 Ambient** | Movement, landings, dodges | Foot dust puff (3 drawings); landing ring; dodge after-image (one flat silhouette in lit tone, 2 drawings); skid lines | Tiny | None |
| **T1 Basic hit** | Every basic attack | Type-shaped hit spark at contact (4 drawings, about 0.3 m across); a small glyph burst on the 3rd hit of a combo; target flashes to Paper Cream for one drawing; light recoil smear | Small, local | None, or a 4 px directional nudge |
| **T2 Move** | Any Move (1 or 2 Paws) | Large type effect (slash arc, bite, ring, sound arcs) up to 3 m; **local speed lines** behind the attacker; a **local impact frame** (11.4) on heavy hits; a medium glyph burst; hit-stop pose; ground crack drawing or dust ring for Thump | Up to a quarter of the screen | Directional shake; brief push-in on 2-Paw Moves |
| **T3 Set-piece** | Frazzled trigger, Fear trigger, Pile-On, Rout of a Captain or Boss | Full-screen speed-line field or the dust-cloud brawl; full-screen impact frame; large glyph burst | Screen-wide | Canon pull-in |
| **T4 Zoomies** | A Zoomies | Cut-in panel, flat graphic background, signature effect, full-screen impact frame, largest glyph burst | Full screen | Authored shot |

### 11.3 The damage-type drawings

| Type | Hit spark (T1) | Move effect (T2) | Colour | Motion character |
|---|---|---|---|---|
| **Claw** | Three short parallel nicks | **Slash arc**: three parallel thin crescents sweeping 90–180°, tapering to points; leaves three pale scratch lines on the ground for 0.5 s | Ice Cyan `#39C6F0`, core `#EAFBFF` | Fastest; appears in 1 drawing, lingers 3 |
| **Fang** | Two small crescents snapping shut | **Bite**: two jagged crescent "jaws" closing on the target, a held "clamp" drawing, then a small star | Bite Violet `#B04DDB` | A hold in the middle: snap, hold, release |
| **Thump** | A four-point star with a ring | **Shockwave**: a thick expanding ring with a flattened dust skirt, the star at centre, ground bounce of nearby cel props | Thump Amber `#FFB02E` | Heavy; expands over 5 drawings, strongest shake |
| **Yowl** | Two wavy arcs | **Sound arcs**: concentric wavy crescents travelling outward in a cone or circle, with wobbling small glyphs riding them | Yowl Lime `#8BE04A` | Rhythmic; pulses 2–3 times |
| Heal / purr | A small heart | Soft rings rising with hearts and a low ripple on the ground | Purr Rose `#FFB3C1` | Slow, the only gentle effect in a fight |

Ambush: a vertical speed-line column and a landing ring, with an oversized glyph burst. Guard: a cream wedge shield-shape flick with two motion ticks. Dodge success: a four-point glint at the eye.

### 11.4 Speed lines and impact frames

**Speed lines.** Drawn Ink (or Paper Cream on dark keys) wedges of uneven length and weight.
- *Local parallel lines* trail a dashing cat (T2), 0.3–0.5 s.
- *Radial focus lines* converge on a target for Frazzled triggers and Standoffs, leaving the centre third of the frame clear.
- *Full-field lines* replace the background behind a flat-colour panel for T3/T4, in the acting cat's outline colour at two values.
- Lines animate by swapping between 3 drawings on twos; they never scroll smoothly.

**Impact frames.** The classic two-drawing hit emphasis.
- *Drawing 1 (about 40 ms):* the image reduces to three flat values: background to Paper Cream (or to Ink at Night), figures to solid Ink silhouettes (inverted: their outlines flip to cream), the effect shape in the damage-type colour at full saturation. This is our "colour inversion": a limited-palette inverted drawing, not a mathematical negative of the frame.
- *Drawing 2 (about 40 ms):* a white or cream flash limited to the effect shape and a radial burst, with the scene returning beneath.
- *Then* the hit-stop hold on the normal-colour impact pose, with thickened line (+1 px) for the duration of the hold.
- **Local** impact frames (T2) are masked to a burst shape around the contact point, at most 30% of the screen. **Full-screen** impact frames are T3/T4 only.

### 11.5 Signature states and set-pieces

**Ruffled.** A ridge of raised fur along the spine (silhouette change), one orange sweat-drop mark, the outline halo flickers between two widths on twos. Subtle by design: it is a tell, not a celebration.

**Frazzled.** The whole silhouette **puffs** by about 15% into a zigzag-edged shape (bottle-brush tail on every cat), spiral eyes, three Static Yellow squiggles and two stars orbiting on twos, the halo turns Frazzle Magenta. On trigger: radial focus lines, a full-screen impact frame, a large glyph burst. The state must be readable in pure silhouette. On recovery the fur deflates over 3 drawings with a little puff of loose fur shapes.

**Pile-On (the signature image).** A hand-drawn **scalloped dust cloud**, Paper Cream `#FFF6E3` with a lavender shade tone `#D8D2EA` and a heavy 5 px ink line, about 2.5 m across, boiling through an 8-drawing loop on twos. Out of it pop, at irregular intervals: paws, tails and ears **in the actual coat colours of the cats inside** (taken from their coat seeds), stars, paw-print glyphs, a flying tuft, the Posse's chevron ticks bobbing above it. The camera pulls in (canon) and the background drops to a flat panel of full-field speed lines in Bell-Gold. It ends on one large burst drawing, a full-screen impact frame, and the cloud blowing apart into four puffs to reveal the Posse posed and the target Routed or dazed. Look length about 1.6–2.2 s (proposal to Combat), shortened on repeats within one fight.

**Routed.** No injury, no collapse. A take (eyes wide, one drawing), then the cat bolts: a stretched smear, a dust-puff trail of three shrinking clouds, a small spinning star where it stood, and optionally a cream tear-drop comedy mark. The Verdict prompt follows for Rivals.

**Zoomies cut-in.** A diagonal panel wipes across the upper two-fifths of the screen (a wedge-ended band with a 6 px ink border), showing the cat through the portrait rig over a full-field speed-line background in its coat or Clowder colour, eyes flashing with a four-point glint. In 3 drawings, hold, out in 2. Look length about 0.7 s first time in a fight and about 0.35 s on repeats (proposal to Combat; skippable). Each of the five Styles has one panel layout and pose family; Bosses have unique ones, and a duo cut-in exists for Kiha & Moha (two bands closing like scissors). The Zoomies that follows owns the screen as T4.

**Fear triggered.** A jagged pom bubble over the victim with the Fear pictogram (water drop, cucumber and so on), the cat's fur-puff take, and a thematic drawing from the source (a flat cyan splash shape made of round blobs for water; a horn blast of sound arcs for the scooter). Water is drawn as opaque flat shapes with cream highlights.

**Spray.** Tail-quiver pose, then a soft scalloped puff in the Clowder colour with four-point sparkles and a single pop ring; the puff settles onto the Scent Post as a mark visible in Whisker Sense. Never a liquid, never a stream, never a stain (canon).

**Standoff.** Both cats arch; a horizontal band of parallel speed lines crosses behind each; the name-card slams in; a single hard light wedge sits between them. On a Nemesis, the band is in Frazzle Magenta and the storm mark appears.

### 11.6 Glyph bursts (our onomatopoeia)

Canon: sound effects are **paw-print and claw-slash glyph bursts, not readable words** (brief §7; pillars' worked example). They are set like manga sound-effect lettering without being lettering.

- A set of about **24 combat glyphs** built from cat-world marks: paw-pads, single pads, claw strokes (1, 2, 3), whisker fans, fish-bones, stars, zigzags, spirals, a bell. Chunky brush forms with rough dry-brush ends, flat fill with a 4 px Ink outline and an offset second print in the damage-type colour.
- **Composition is the lettering**: 2–5 glyphs set in a tilted, overlapping row or stack that grows in size along the direction of the hit, like a shouted word. Size and count scale with tier (T1: 1–2 small; T2: 2–3; T3: 3–4 large; T4: 4–5, filling a third of the screen).
- Families by type: Claw uses strokes and thin shapes; Fang uses paired pads and zigzags; Thump uses fat pads, stars and rings; Yowl uses wobbling spirals and whisker fans.
- Motion: pops in at 120% over one drawing, settles to 100%, jitters between two drawings while held, breaks into wedges. Screen-facing, anchored near the contact point, pushed inward if it would leave the frame.
- Glyphs must **not resemble letters or numerals of any real script** (same review as Scribble), and must stay visibly different from Scribble (Scribble is thin, regular, human; combat glyphs are fat, wild, feline).
- At most 3 glyph bursts on screen at once; the oldest is culled first.

### 11.7 Timing, shake and safety

Look timings below are held-drawing counts on twos unless stated. Gameplay duration is Combat's.

| Element | Look timing | Note |
|---|---|---|
| Hit spark (T1) | 4 drawings (about 0.33 s) | Appears on the contact frame, never earlier |
| Slash arc / bite / ring / sound arcs (T2) | 5–8 drawings (0.4–0.65 s) | The damaging drawing is the 1st or 2nd |
| Local impact frame | 2 drawings on ones (about 80 ms) | Then hit-stop |
| Full-screen impact frame | 2 drawings on ones (about 80 ms) | T3/T4 only; at most one per second |
| Hit-stop hold (look) | Light none · heavy about 60–100 ms · Frazzle and finishers about 150–250 ms | **Proposal to Combat**, which owns hit-stop |
| Glyph burst | 1 in, 3–5 held, 2 out | |
| Frazzled orbit | Loop on twos for the state's duration (canon 8 s) | |
| Screen shake | Directional along the hit; amplitude at 1080p: light 4 px, heavy 10 px, set-piece 16 px; 3–5 stepped offsets, decaying | Amplitudes are proposals; a 0–100% shake setting is required |

**Flash and motion safety (required options and hard limits):**
- No more than 3 flashes in any one second, counting impact frames, white target flashes over large areas and full-field line swaps. Full-screen impact frames are limited to one per second.
- No saturated red flashes of any size.
- A **Reduce Flashes** setting replaces every impact frame with a thick-line hold frame and removes white flashes; a **Screen Shake** slider and a **Reduce Motion** setting (no full-field speed lines; static radial lines instead) are required. These are art-side requirements passed to UX and Combat.

**Budget and priority (when the screen is full):** draw order of importance is controlled cat > Posse ticks and enemy halos > Frazzle gauges > T2+ effects of the controlled cat > glyph bursts > other cats' T1 effects > T0. When the emitter budget (8.4) is hit, effects are dropped from the bottom of that list. AI-controlled Posse cats' T1 sparks render at 70% size.

---

## 12. Animation Direction

### 12.1 Principles

1. **Pose-to-pose with long holds.** Strong, simple key poses that read as silhouettes from above; few in-betweens; snappy transitions. Timing contrast (hold, snap, hold) carries the energy, not constant motion.
2. **Stepped rates** as in 10.6: anticipation on threes, action on twos, impact on ones.
3. **Anticipation is the tell.** Every enemy Move has an anticipation pose that is a distinct silhouette held long enough to read (Combat sets the duration; Art guarantees the pose is unmistakable from above and differs per Move family).
4. **Cats are liquid, humans are furniture.** Cats squash and stretch generously (up to 130% in ordinary motion, far more in smears); humans do not squash or stretch at all and move with real weight and restraint.
5. **True cat behaviour, pushed.** Start from observed motion (the wiggle before a pounce, the sideways crab-hop, the slow blink, the stretch after a nap) and exaggerate timing and arcs. No humanoid acting: cats never stand on two legs to gesture, never use paws as hands beyond what a cat does (batting, pushing, kneading).
6. **The tail is the second face** and must be animated deliberately in every clip.

### 12.2 Cats

| Area | Direction |
|---|---|
| Locomotion | Walk (tail-up swagger), trot, sprint (full stretch gallop with a 1-drawing smear at top speed), stalk (low, tail level, used on Ambush approach), wall-walk (one paw line, tail as balance), jump (crouch-wiggle hold, a stretched arc, squash landing) |
| Style sets | Each Style has its own idle, combat stance, basic combo, dodge and Rout. Bruiser: weighty, drops and sits on things. Scrapper: bunny-kicks, flurries with multiples. Prowler: vanishing dashes, drops from above. Yowler: chest-out yowls with whole-body recoil. Trickster: backward kicks of dirt, the slow deliberate paw pushing an object off a ledge |
| Body types | One shared skeleton and clip set, retargeted with per-body offsets; Loaf and Puff get an added jiggle layer, Noodle an added spine wave |
| Reactions | Hit flinch (1-drawing squash away from the hit), Ruffled, Frazzled (puffed and tottering in a figure-of-eight), Routed bolt, recruit shuffle, Humble (belly-low crawl), Nose-Touch (a slow, sincere lean in: the one moment street animation is quiet) |
| Personality | Each generated cat gets 1 of about 6 idle variants and 1 of 4 walk attitudes from its seed so two identical bodies still move differently |
| Spray | Back up, tail up, quiver on ones, pop. Played as proud comedy |
| Sunspot nap | Circle twice, flop, loaf; breathing on threes; one ear flick |

### 12.3 Mikan through the Lives

Four animation sets (kitten, adult, old, elder; 5.1). The **run home** on hearing the Call exists in all four and is the emotional through-line: the kitten tumbles, the adult sprints tail-up, the old cat hurries stiffly, the elder trots and stops and trots. It should be recognisably the same gesture each time.

### 12.4 Humans

- Performance is in **feet, knees and hands**: weight shifts, a foot tapping, toes curling, slippers shuffling; a hand hesitating, a hand that strokes absently while its owner is busy, a small hand that pats too hard.
- On threes, with held poses. Movements are small and motivated. One human gesture per vignette should be the "line of dialogue" and must be staged clear and unobstructed.
- Bending down into frame is an event: it is slow, it is anticipated by the knees, and the face that arrives is calm.
- Each household member has a recognisable walk seen from the floor (Haru light and quick, Sora long strides that learn to slow near the cat, Gran small steps with a stick later, Koharu thumping).
- Street humans: looped walks on threes, simple reactions (step around a fight, a broom sweep that scatters cats). Never an attack animation, never played as a villain.

### 12.5 Home interaction verbs

Leg rub (figure-of-eight around ankles), jump to lap (with a polite pause first), kneading, being lifted (the long-cat stretch), knocking an object off a table (the slow paw), sitting in a box, waiting at the entryway (Life 8: the same sit, held, with only an ear and the tail tip moving on threes). These are designed with Narrative; the art requirement is that each is one clear pose family and none uses street comedy marks.

---

## 13. Camera Language

### 13.1 Street: exploration

- Canon: high-angle follow camera, pitch about **55°**, **authored yaw per area**, no free rotation.
- **Narrow field of view (25–30°)** from further away, so perspective is gentle and the picture sits flat like an anime layout; painted backdrops then align with geometry more easily.
- Framing: about **9 m of ground across the frame** at Mikan's depth. Mikan sits slightly below centre with lead room in the direction of travel. On the High Road the camera raises its look-at point so the drop below stays visible.
- The camera moves smoothly (it is not stepped), with soft damping; it never rotates during play. Area changes are cuts or short authored moves hidden by a paper wipe.
- Vista points: at stair tops and harbour edges the camera may tilt up by authoring to show the painted backdrop and the sea. These are the postcard moments; one per Patch at most.

### 13.2 Street: combat

- No scene transition (canon). On `EncounterStarted` the camera eases to frame all combatants inside the roughly 12 m ring, widening to about 13 m across if needed, keeping the controlled cat in the lower-middle third.
- **Standoff:** a quick push-in and a 5–8° drop in pitch; the two cats in profile to each other; name-card over the upper third.
- **Slow Blink:** push in about 15% toward the selected cat, pitch to about 45°, eyelid vignette (Section 2). Target lines and area shapes are drawn as flat cream dashed lines and halftone fills on the ground.
- **2-Paw Moves:** a brief push-in and directional shake (11.7).
- **Pile-On and Zoomies:** authored shots that may break every exploration rule: low angles (20–30°), a tilted horizon up to 12°, fast cuts on the impact frame, a flat graphic background. They return to the gameplay framing with a cut on a strong pose, not a slow blend.
- After a fight the camera holds on the Routed cat's exit, then on the Verdict framing, then eases back.

### 13.3 Home and story: floor height

- Camera at **cat's-eye height (about 0.3–0.4 m)**, level or tilted slightly up, on authored positions or short rails per room: effectively a side-on diorama of the floor. Humans are cropped at the knee, hip or waist by the top of the frame. The player still walks Mikan freely within the room.
- **Faces enter the frame only when a human comes down to Mikan** (crouching, lying on the tatami, lifting the cat). When Mikan is lifted or jumps to a lap, the camera rises with Mikan and the human's face may be shared in a close two-shot. These are the rewards of the home story and are rationed.
- **Pillow shots.** Each vignette may open or close on a held, static shot of a witness object (6.3) at floor height: shoes, the hook, the bowl. Two to three seconds, nothing moving but light or one small thing. The same framing is reused across Lives so the change is the content.
- Longer lenses and layered foreground (a table leg, a doorframe edge, a bag) give depth; cuts, not camera moves, change the view. No handheld shake, no dutch angles, no zooms, no combat grammar of any kind.
- The **Doorstep** is shot at floor height from just outside, looking at the door: the Tribute pile in the foreground, the door as the subject. In Life 8 this framing is held on a closed door.
- Time-skip montages are sequences of pillow shots with seasonal light.

### 13.4 Scale and legibility

A real cat is tiny against a 12 m ring: on a 720p handheld, a true-scale cat would be about 44 px long in a full-ring framing, which is too small for the silhouette system. **Proposal (needs creative-director and level-design agreement): cats are modelled at about 1.4× real size relative to architecture** (body length about 0.63 m), and street props that cats interact with are sized to match. This gives about 130 px body length in exploration and about 90 px in a full-ring fight at 1080p, and about 64 px in the handheld worst case, which is the size the shape system is tested at. Humans stay true scale, so cats remain small beside them. At home, where the camera is close, the cheat is invisible.

---

## 14. Do / Don't

| Do | Don't |
|---|---|
| Ink what acts, paint what stays | Outline a wall, a tree or any decorative prop |
| Use exactly two flat tones on a cel, with an authored violet-leaning shade | Use gradients, soft toon ramps, rim lights, specular or ambient occlusion on characters |
| Draw every line in Aubergine Ink `#33273B` at the specified pixel weights | Use brown or black lines, or lines that thin with distance |
| Tint every shadow with wisteria or the phase shadow colour | Use grey or black shadows |
| Design each cat from above, silhouette first | Rely on a face, eye colour or a small marking to identify a cat |
| Keep Mikan's ginger, pom tail and collar unique | Generate a ginger-capped white cat, a pom tail or a second collar (Botan's ribbon excepted) |
| Show history with notches, plasters, kinks and regalia | Draw wounds, scabs, red marks, blood, missing eyes with scar tissue |
| Draw humans in natural anime proportion with their craft below the knee | Caricature humans, or echo any head shape, face or outfit from the reference IP |
| Keep each household colour exclusive inside the house | Dress the house with stray yellow, teal, coral or plum objects |
| Tell home beats with objects, colour, light and hands | Put readable text, numerals, a calendar date or a subtitle anywhere a human made it |
| Use Scribble for all human writing and glyph bursts for all sound effects | Use real letters, kana or numerals in the world or in combat effects |
| Make every effect a hard-edged drawing on twos; fade with halftone | Use soft particles, additive glow, bloom, motion blur or alpha fades |
| Keep one screen-wide effect at a time and the controlled cat always visible | Stack full-screen effects or cover the player's cat |
| Keep the house free of HUD, comedy marks, shake and speed lines | Put a gag effect in a home drama beat, or a sad colour script on a street fight |
| Keep the middle of every lane calm and the High Road readable as ribbons | Scatter high-contrast clutter across walkable ground |
| Make the Night bright moon-blue with a value floor | Make Night dark, desaturated or hard to read |
| Play Spraying as a sparkle puff and a pop | Show any liquid, stream or stain |
| Keep shrine and grave elements generic, respectful and unreadable | Use religious objects as jokes or regalia, or copy a real shrine |
| Check every new design against "could this be mistaken for the reference?" | Reuse any character, name, place, layout or composition from that or any other IP |
| Pick colours from the swatch file | Eyeball a hex value or invent a new semantic colour without updating Section 4 |

---

## 15. Open Questions / Known Weak Spots

This is a first draft written without engine tests, concept art or the other specialists' documents. Reviewers should push hardest on the items below.

### 15.1 Assumptions for creative-director review (decided here because the brief was silent)

1. **Cat scale cheat of about 1.4×** (13.4). Affects level metrics, combat ranges and the truth of "25 cm tall". Without it, handheld combat silhouettes are probably too small.
2. **Home scenes use a floor-height camera** (13.3), not the 55° street camera. The brief's camera canon is written for the street; its originality rule implies cat-height framing at home. If vignettes must use the street camera, Sections 3.4, 5.5, 12.4 and 13.3 change substantially and "faces out of frame" becomes hard to deliver.
3. **Bell-gold cord on Crew** (3.3) as a non-collar gang mark.
4. **"Bell-gold outline tick"** (brief §7) is interpreted as a thin gold keyline plus a chevron marker above each Posse cat, with enemies getting a thicker Clowder-colour halo (10.2).
5. **Bell-Gold and Haru Yellow as a deliberate colour family** (4.1), and **Haru Yellow returning as sunlight in Life 9** (4.7). The second is a narrative-adjacent choice and needs the narrative director's agreement.
6. **Collar Crimson** `#D02A45` for the canon "red collar", pushed toward crimson to stay clear of Akane vermilion.
7. **Red is not a damage colour**; damage types are cyan, violet, amber and lime.
8. **Rank scale** (Captains ×1.15, Bosses ×1.35–1.8) and regalia for Captains and Bosses.
9. **Style biases body type** (3.2) without locking it. If Nemesis wants Style and body fully independent, the stance tells have to carry Style alone.
10. **Textile motifs per household human** (plain, stripes, dots, cross-hatch) as the non-colour backup.
11. **Halftone dissolve for occluding humans and walls** (10.10), which makes street humans mostly legs even in the bird's-eye view.
12. **All portraits of procedural cats come from the 3D portrait rig** (10.11); no 2D portrait generator.
13. Look timings and shake amplitudes in Section 11 are proposals; Combat's game-feel spec overrides them.

### 15.2 Known weak spots

1. **Nothing is validated in engine.** The 2-tone shade share, line weights at 720p, blob shadows on stepped High Road geometry and the zone tint all need a look-dev scene before any production asset is built. The acceptance tests in Section 10 are untried.
2. **Budgets are unsourced** (8.4). No engine or performance configuration exists yet. Outline hulls roughly double character draw cost; ten cats with halos plus Tier 3 effects on a handheld is the stress case and has not been measured.
3. **Hex values are a designed starting set, not a tested one.** Contrast ratios and L* values quoted are estimates; none has been checked on a handheld screen, in the four phase grades, or through a colour-vision simulator. Likely trouble: Steam Court white-violet on Kasumi mist; Lantern Eyes indigo at Night; moss versus rust versus vermilion for protan and deutan players; Bell-Gold versus Haru Yellow versus Static Yellow (three yellows with three meanings); Koharu Coral versus low-Nerve coral versus Pad Pink.
4. **Differentiation from the reference is argued, not proven.** The eight markers in 1.3 are a hypothesis. The category (flat cels on gouache, cream rounded UI, a nostalgic Japanese town) is still close. A side-by-side review of the first three concept pieces against the reference, ideally with someone outside the team, should gate further work; a legal view on look-and-feel proximity is outside this document's competence.
5. **The 64 px silhouette test may fail** even with the scale cheat. Six body types on one skeleton may not be distinct enough from above, and tail and ear differences may vanish in motion. If so, the fallback is fewer simultaneous enemies or a closer combat camera, both of which are Combat and brief-level decisions.
6. **Shared skeleton versus distinct bodies.** Loaf and Noodle on the same rig may deform badly or produce outline artefacts. Unresolved until a technical-artist prototype.
7. **Stepped animation versus responsiveness.** Pose stepping at 10–12 per second under a 5%-time Slow Blink and with instant character switching may feel laggy or may strobe; the rule that input restarts the step clock is untested. Handheld cadence (10 poses/s) will also look different from PC (12 poses/s).
8. **Phase lighting on painted textures.** Paint has light baked in from one sun direction, but the sun moves across four phases. Flat cast shadows plus grading may look wrong at Morning and Dusk (painted highlights disagreeing with long shadows). Options: paint in soft overcast-neutral light and let shadows and grading do everything (less charm), or paint per-phase variants of hero areas (more cost). Undecided.
9. **Backdrop repaint economy** (8.4 trade-off): one Day painting graded to four phases may look cheap exactly at Dusk, the hero hour.
10. **House production cost.** Nine dressings of one interior, witness objects, five Haru variants, three Sora, three Koharu, two Gran, four Mikan animation sets, all at close camera where the low-poly, flat style has least to hide behind. This is the largest single art cost and is not sized here.
11. **Close-up quality of cats.** The gameplay mesh is built for 64–130 px. The portrait rig, home camera and cut-ins show it at 400 px and more. The portrait head swap is a guess at the fix.
12. **Impact frames and photosensitivity.** The limits in 11.7 are conservative rules of thumb, not a certified standard check; a proper photosensitivity analysis pass is needed before any trailer or build is shown.
13. **Glyph bursts and Scribble must resemble no real script.** This needs review by readers of several scripts and is easy to get wrong by accident; no glyphs have been drawn yet.
14. **Font choices are suggestions.** Licences are stated from general knowledge of the families (SIL OFL) and have not been verified against the files that would ship; language coverage beyond Latin and Japanese is unplanned; Mochiy Pop One may be too heavy for handheld.
15. **Wordless legibility of the colour script** is the brief's risk 2 and this document only supplies a method. Whether players notice yellow leaving the house in Life 3, or read the teal shoes, is a playtest question. The Life 8 desaturation may also simply look like a filter rather than grief.
16. **Tone at the edges.** Life 8 streets ("neglected, not tragic") and Tsukimi Hill's graves are fine lines. The bright, comedic street look could read as a children's game (concept market risk) while Life 8 asks for adult restraint.
17. **Whisker Sense in every phase and district** multiplies look-dev: one render state against four keys, six palettes and the Life 8 variant.
18. **Occlusion.** The halftone cut-away for tall humans and walls may be ugly or noisy on a 720p screen, and authored yaw may not save narrow lanes such as the arcade.
19. **Sections not informed by other specialists.** The Combat, Nemesis, UX, Narrative and Audio documents were not available. Anything here that names a state, a screen or a timing may need renaming or resizing when they arrive.
20. **This file is long.** It exceeds the size at which the project's tooling expects section-by-section reads; if it keeps growing, the annexes (Sections 10–13) should be split into `design/art/` companion files.

### 15.3 Questions for the user

1. **Engine** (brief §11.1): confirming Unity URP or Godot 4 unblocks Sections 8 and 10.
2. **How close to the reference do you want to sit?** This draft aims for "same family, clearly our own" (aubergine ink, violet shadows, paper-goods UI, naturalistic humans). If you want it closer, Section 1.3 is where the risk rises.
3. **Is the cat scale cheat acceptable**, or should cats be true scale with a closer combat camera?
4. **Is a floor-height home camera what you imagine** for the owner story, or should home also be seen from above?
5. **Human faces:** this draft shows calm, simple faces only when a human comes down to the cat. Would you prefer never showing faces at all, or showing them more freely?
6. **Sound-effect glyphs:** canon says non-readable paw-and-claw glyph bursts. You mentioned onomatopoeia lettering; if you want real readable sound words in combat, that is a creative-director decision that touches Pillar 1's consistency rule.
7. **Mikan's design is treated as fixed** (brief §11.5 is still open). A coat choice at the start would undo the reserved ginger and three-point read.
8. **Which hour is the key-art hour?** This draft says Dusk.


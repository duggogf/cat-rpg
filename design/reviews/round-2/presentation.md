# Round-2 Review — Presentation Docs (vertical slice)

*Reviewer: senior game director, presentation · Date: 2026-11-24 · Bar (REVIEW-PROTOCOL amendment): could a small team start prototyping the slice from this doc without contradicting another doc? `PASS` or `FIX`; FIX lists only slice-blocking items.*

**Read in full:** `dual-story-progression.md`, `art-bible.md`, `sound-bible.md`, `hud.md`, `key-screens.md`, `accessibility-requirements.md`, `camera-system.md`. **Canon read:** `creative-brief.md` §1–§5, §7–§10 (skipped §6 ownership/interfaces and the changelog); `director-rulings.md` §0, A, B, C, D, I, J. **Cross-checks:** `combat-system.md` §3.1 (controls), §3.16 (teach order), §3.17 (Impact Moments); `day-loop.md` §3.9–§3.11 (onboarding, worked days, pacing).

---

## Summary

| Doc | Verdict | Fix count |
|---|---|---|
| `design/narrative/dual-story-progression.md` | **FIX** | 4 |
| `design/art/art-bible.md` | **FIX** | 5 |
| `design/audio/sound-bible.md` | **FIX** | 3 |
| `design/ux/hud.md` | **FIX** | 2 |
| `design/ux/key-screens.md` | **FIX** | 2 |
| `design/accessibility-requirements.md` | **FIX** | 2 |
| `design/gdd/camera-system.md` | **FIX** | 2 |

Every verdict is FIX, but no doc needs a rewrite. The set has about 20 edits of one to three lines each. Most come from five cross-doc rulings (R1–R5 below) that no single reviser could make alone. Once those edits land, I would let a team start prototyping from these docs.

**What already works, and must survive:**
- **The USP works.** Haru is specific: always late, the stuck bar, she sides with Mikan against Gran, she cries alone. Every Keystone names three Tier A channels, at least two of them visual. Storyboard B ("A Tuesday in Life 2") shows that the home visit is something you *play*: the daily find, the piano duet, the lap. It is not something you watch.
- **The camera is one grammar across all seven docs.** Third person behind the cat; cat height (0.3–0.6 m) at home, with a 1.0 s lower-and-tighten at the wall; authored vignette shots; humans shown as knees and hands. No doc assumes the old bird's-eye view.
- **The control map matches.** `hud.md` §8 is DR-08 verbatim and agrees with Combat §3.1. Brace "hold or toggle" in Combat is the global toggle alternative, not a conflict.
- **Feel tiers mostly match.** The Art §10.2 events, Audio §7.1 freeze scopes (T1–T3 local, T4–T5 global) and the player-authorship rule all match Combat §3.17.
- **The Fence Line is striking and buildable.** One painted side-on panorama; height = rank; Daifuku blocking the sky; Undermark crates; Away paw prints; Mikan's seat set by Clout; the haze of the climb ahead; no labels. Camera §3.10 gives a long-lens side-on rig. Twelve cats at ≈ 120 px fit one 1080p frame. The screenshot test in `key-screens.md` §2.6 is the right acceptance.
- **The art bible still captures the reference.** "Ink what acts, paint what stays", a 2 px even aubergine line, near-flat fills (15–25% shade), a soft contact blob, painted skydome and backdrop cards, and rounded cream-and-Cocoa bean UI. The third-person camera makes this *more* reachable, because the sky is now in frame.
- **The wordless-humans rule holds.** No doc translates Murmur or shows readable human writing. Cat speech is readable text; onomatopoeia is lettering; tone icons show how a voice felt, not what it said.

---

## Cross-doc rulings (binding for the round-2 fix pass)

**R1 · Late Home: it fits, and it plays on Life 2 day 3.** Audio §4.4 is the clearest way to teach the "missing melody = she is late, she will come" idiom before Life 8 A2, where the same Dusk becomes "she's late again" and she never comes. It belongs in the slice. DR-53 had deferred the "Haru late" *rule across Lives 3–8*, not this teaching moment. Conditions:
1. It is a **Routine variant, not a vignette**, so the count of 11 stands. It is fixed on **L2D3 Dusk**. This is the only guaranteed slot: by then the Call has been heard three or more times (L1D1, L1D2, L2D1, L2D2), and L2D1, L2D2 and L2D4 all carry Dusk story beats. On the 6-day fast path no Keystone-free Dusk exists, so the audio doc's "never on a Keystone evening" yields here.
2. **It stacks with K2.2 "Lamp at Night".** Haru comes in late, the Melody returns, and K2.2 then plays as written. The late return gives the study-and-cry beat its cause (Tier B: she stayed late to cram).
3. **The Veranda Lamp is still lit.** Gran's plum sleeve pulls the cord. A dark Lamp is reserved for Life 8 (Narrative C5). What changes is *who*: Haru's Call, Tap-Tap and Melody are missing, and Gran covers for her.
4. **Timing.** If Mikan is on the street, Haru's late Call sounds from the house at Dusk + 2:30 on the street clock. If Mikan is inside the wall, the clock is paused, so her key turns ≈ 40 s of real time after the Feeding.
5. **Muted twins.** No arcs at the Call slot; the bell glint fires alone; Gran's sleeve at the Lamp cord; the raincoat hook stays empty until the door opens; the Call glyph then rises at the door.

**R2 · The Piece never contains the Call cell (Narrative wins).** Haru's Melody, which is also the piece she practises, opens with the rising four-note answer phrase. The Call's three-note cell only ever sounds in a voice (Haru sings it; Sora later whistles it), in the Brass Call, and in Late Home's door Call. This keeps Mikan's name a single, scarce signal, makes Narrative AC 8 ("no Call before K1.3") true while the Life 1 home loop and practice takes are playing, and gives both docs the same K1.1 hum.

**R3 · The number rule (one rule for brief, Art, HUD, Key-screens, Combat A1).** *Numbers count what the cat owns or pays; they never measure a feeling, a relationship or a human.*
- **Allowed:** Morsels, Shinies, Tribute, the Stash, prices (Lessons, the Bribe row, Share a Morsel), Crew levels and XP pips. These appear on screens: the Lot tabs, the Turf Board, the Verdict Bribe row and Pause. They also appear in the two economy moments: the Doorstep Tribute card, and the street pickup tick and encounter tally.
- **Territory numbers** (Scent 0–100, upkeep, per-Patch Tribute) appear only on the Turf Board.
- **Never as numbers:** Grudge, Regard and Loyalty (moods and tier words instead). No level on Rivals; threat is shown by paw size. Nothing inside the house except the Doorstep card. Nothing in the world: all human writing is Scribble.
- **Combat damage numerals are Off by default in the slice**, with an Options toggle (Off / Big hits / All). The manga feel lives in the glyphs and the single lettered word, and numerals compete with both. Weakness and resistance get a spark-shape twin (Art).
- The creative director amends the brief §3.2 Turf Board line to read "the only map-like view, and the only place territory numbers appear".

**R4 · No combat inside the wall. The crow stays outside.** Use the `day-loop.md` §3.10 staging: the player moves and hops in the garden, then fights the crow on the lane-side wall top. Narrative, Key-screens and Camera Edge Case 8 follow this.

**R5 · Faces.** A **face event** is an authored shot where the human face is the subject, at ≥ 20% of screen height. The slice has three: K1.1, K1.3 shot 6 and K2.5. **Incidental faces** are allowed and are not counted: the Goodbye crouch, the face seen from below during Lap (Camera §3.9), and a human kneeling at the low table. They stay partial or small (≤ 15% of screen height) and never hold centre frame for more than 2 s. Camera needs no change. Art §5.5 already agrees.

**Also ruled (for docs outside this set):**
- **K2.3 The Flap stays a Dusk beat (Narrative).** Haru is at school in the morning, and the first use of the flap becomes going out into the first Night with the Lamp lit behind you. `day-loop.md` §3.1 changes its "morning beat" line: leaving through the flap after K2.3 resumes the clock into Night.
- **Day-loop reference path.** `day-loop.md` §3.10–§3.11 must follow Narrative §3.3: K2.2 plays on L2D3 (with Late Home, on the late arrival in its worked day); K2.5 is the L2D4 morning, with a Dusk tail; the slice ends at the Life-end sleep in the suitcase after Daifuku is Routed.
- **Shake values.** `combat-system.md` should reconcile its own §3.17 "steps with ×0.6 decay" against rule 3 "trauma accumulator". Camera plays whichever Combat keeps.

---

## `design/narrative/dual-story-progression.md` — FIX

1. **Late Home (R1).** Add a Late Home row to the §3.3 schedule under L2·3 Dusk, marked "Routine variant, not a vignette". State that K2.2 plays after Haru returns and that Gran lights the Lamp. Add a vocabulary row to §3.1: "A Dusk with no Call, the bell alone = she's late; she will come" | taught L2D3 | paid off at L8 A2. Add the edge case "Mikan out all Night on L2D3" (the late Call is heard from the street) and the inside-the-wall timer to §5.
2. **The F1 slot collision.** On L2·1 Dusk, K2.1's Dusk tail and T2.2 share a slot. Under F1 ("one vignette per slot; Keystone > Texture"), T2.2 slips day after day behind K2.3 and K2.2, so the piano would be introduced late. Add to F1: "A Keystone's tail is a Routine extension and does not occupy its slot." K2.1's tail (the Gift) is player-driven anyway.
3. **The crow (R4).** In §3.3 "Opening timing", replace "The garden (move, jump, Swat, Skitter on a crow)" with "the garden (move, jump), then Swat and Skitter on a crow on the lane-side wall top".
4. **Faces (R5).** In §3.1, change C12 and the Goodbye ritual to define face events against incidental faces, so that "the second/third face event" (K1.3, K2.5) stays true while the daily Goodbye and Lap show her face.

## `design/art/art-bible.md` — FIX

1. **The impact frame breaks Combat's luminance cap.** §10.4 Drawing 1 turns the background to Paper Cream (Ink at Night), which is a full-screen luminance jump far above Combat §3.17's "mid-tone inversion, luminance change ≤ 0.10". Redraw it: the background flattens to a single mid-value tone matched to the current frame's mean luminance (±0.10); figures become Ink silhouettes with Cream lines; the effect shape keeps its damage colour; Drawing 2's flash stays local. Apply the same rule to the T5 flat-panel backings in §10.4 and §10.5 (the Clowder colour, the static Bell-Gold under the Pile-On, the coat colour behind Zoomies): value-match each to the phase within 0.10 (Night uses a darkened shade), or bring it in with a halftone wipe of three or more drawings. Count the panel in the flash budget.
2. **Cat scale is still unset.** Camera assumes 1.4× and Narrative asks Art for a rule, but the bible gives none. Add to §3.4 or §5: **one global cat scale, default 1.25× a real cat (≈ 0.56 m nose to rump), the same on the street and at home, with no per-context swap.** Humans, furniture and props are true scale; the kitten in Life 1 comes from bone scale. Confirm it with Camera's home mock (T3), with Mikan in a 16-year-old's lap and on the piano bench.
3. **Posse tick shape.** §4.3 and §4.8 give every Posse cat a bell-shaped tick. HUD §4.1 and Accessibility §2 give allies a **chevron** and the **controlled cat a bell**, which is HUD priority 1. Adopt the HUD version.
4. **Witness objects drift from Narrative §3.5.** §6.3 says the Box is "later Mikan's bed in the entryway". Per K1.4's Tier A trace, it moves beside Gran's cushion in the Main Room. Also align: the saucer, then the **blue-and-white Bowl with its chip state**; the flap in the **veranda door**; the genkan line-up (loafers, plum sandals, yellow rain boots on day 1 only). Build Narrative's pool of 8 daily finds rather than a separate list of 7 swap states.
5. **Numbers (R3).** §7.4 "Numbers appear only on the Turf Board and in system menus" becomes R3's one-line rule. Add two spark variants to §10.3 as the weakness and resistance twin: an extra Ink crack wedge for a weakness hit, and a blunted spark at 70% for a resisted one.

## `design/audio/sound-bible.md` — FIX

1. **R2.** §3.1 and §3.2 say Haru's Melody "opens with the Call" and is "the one piece Haru practises". Rewrite it to open on the four-note answer phrase (C–D–E–G) and never quote the Call cell on piano. The Call cell stays in voices and the Brass Call only. Update §16.3, and the "Melody joins" notes in K1.3 and K1.4 if any of them quote the cell.
2. **R1.** In §4.4 step 3, §5.3, §9.1 and §11: set Late Home on L2D3 *alongside* K2.2 (delete "never on a Keystone evening" for this instance). **Gran lights the Veranda Lamp** (delete "stays dark until her key turns"). The visual twin becomes Gran's sleeve at the cord with no arcs. Inside the wall, her key turns ≈ 40 s after the Feeding (the clock is paused there); on the street it stays at Dusk + 2:30. Change the Assumption in §16.1 to "confirmed".
3. **The K2.1 cue trigger.** `mus_story_k2_1_shoes` fires "at the first Tribute". It must fire at the **cicada-shell Gift** (Narrative K2.1). Tribute is food, and no food enters the house before Life 8.

## `design/ux/hud.md` — FIX

1. **Damage numerals (R3).** Default **Off** in §4.1, §9 and §6 P8. Keep the Off / Big hits / All option. Weakness and resistance now show in the spark shape (Art fix 5), not the numeral frame. Update the §4.1 "Rule of no world text" to one bark balloon plus one lettered word.
2. **The tone Sense Icon set.** §5.1 lists "sun-pom warm, rain-cloud sad, zigzag sharp, bouncing notes laughter". The rain cloud collides with the rain-cloud icon (wet, cold), and the notes collide with the Note icon (the Call). Use Narrative §3.1's four tone puffs: **Round** (warm) · **Spiky** (sharp) · **Drooping** (low, unhappy) · **Bouncing** (bright, excited).

## `design/ux/key-screens.md` — FIX

1. **The Life 2 teaching ladder.** §7.4 puts props and Fears plus Zoomies on L2D4 and Daifuku on day 5+. Combat §3.16 and `day-loop.md` §3.9 agree with each other: props and Fears on L2D2, Zoomies on L2D3, Den and Daifuku from L2D4. Adopt their order. Keep Sentries and the Turf Board on L2D2 and Lessons on L2D3, and keep "the Zoomies hint fires the first time the gauge is full". UX keeps ownership of the sheet; the other two docs then cite it.
2. **The crow (R4).** In §7.2, place the crow beat (0:05–0:08) on the lane-side wall top, outside the garden.

*(R3 settles Assumption A-1: the doc already matches it. Mark A-1 confirmed.)*

## `design/accessibility-requirements.md` — FIX

1. **Tone icons.** In §3, replace "warm, sad, sharp, laughter" with Narrative's four tone puffs (Round, Spiky, Drooping, Bouncing), matching HUD fix 2.
2. **Two rows in the §2 colour table.** Frazzle reads "Magenta zigzag bar", but the gauge is **Static Yellow `#FFE14A`** zigzag and Magenta is the Frazzled *state* (Art §4.3); split it into two rows. Damage weakness/resist's twin "numeral frame shape" becomes "spark shape (crack wedge / blunted spark)", because numerals default Off (R3).

## `design/gdd/camera-system.md` — FIX

1. **Shake and punch-in values contradict Combat, which owns the tier table (DR-07).** Camera §3.6, §4.5 and §7 have T3 0.8% / T4 1.4% / T5 2.0%, 8 steps with linear decay, punch-ins of none / 4 / 7 / 10%, and "replace, don't stack". Combat §3.17 has 0.4 / 0.7 / 1.1 / 1.6%, 3/4/5/7 steps with ×0.6 decay, punch-ins of 1.5 / 3 / 6 / ≤ 15% authored, and a trauma accumulator capped at 1.8% total. Camera's T5 alone breaks that cap. Delete Camera's values and cite Combat §3.17. Camera keeps the *playback* rules: screen-space translation only, no roll, every offset held for at least 2 frames, a deterministic pattern, and the motion budget.
2. **Edge Case 8 (R4).** The crow is outside the wall, so delete the special garden combat framing. The crow fight uses the normal Explore → Combat blend.

---

## Backlog (non-blocking; append to each owning doc's `## Backlog (post-slice)`)

**Narrative**
- Storyboard metres ("≈ 0.4 m behind the kitten", "follow at 0.4 m") are camera *heights*. Distances follow Camera §3.2 (Home 1.8 m, range 0.6–2.2 m). Say so once above §3.8.
- `day-loop.md` puts K1.4 at ≈ 0:40–0:45; `key-screens.md` §7.3 puts it at 0:52–0:57. Align the first-hour clock times.
- Life titles on title cards (X5 allows them): confirm that "Uniform" and others are written from the cat's side.
- Confirm Audio §16.6 (piano lid closed in Life 8).

**Art**
- **SCRAMBLE** in the English lettering set is a real word that reads as speech (it breaks §10.7 brief item 3). Replace it with a sound-word.
- Titles are "pictogram, no letters" in §3.5, but the HUD ribbon and Rival card show the Title as text. Ruling: show both. The stamp emblem plus the Title as readable text is cat language, which is allowed.
- The raincoat "bloom" (Audio §11) is an optional Melody-presence twin. Decide after the home mock. It must be a stepped tone change, not a glow (P5).
- Whisker compass ring pointers: Art says ≤ 5, HUD says ≤ 6. Pick one.

**Audio**
- K2.2 Part 1 has Haru humming fragments at her desk, but §16.4 says K1.1 is the only hum, and Narrative says "she's quiet". Pick one; a silent desk is the safer choice.
- The collar goes on in "K1.3 morning" in Audio but in the K1.1 day-1 morning in Narrative. Use Narrative's beat for cue ownership.
- During a mid-day visit the "Foundation alone" plays, but `day-loop.md` §3.3 says "the house is empty". Gran is home on school days; day-loop should change its wording.

**HUD**
- The Tag-In camera ease is 150 ms in §4.3; Camera §3.5 makes it 0.3 s. Cite Camera.
- The Pile-On prompt has no word in HUD §4.1, but Combat §3.17 shows the word on its first three showings. Choose one; the HUD hint card is enough.
- The random-pause test uses 10 combatants, but slice groups have 1–6 enemies. Test at 6 + Posse; 10 is the full-game stress test.

**Accessibility**
- Reduce Flashes wording: "local Ink outline pulse" in §1.1 against "+1 px line hold, no luminance change" in Combat and Art. Use Combat's.
- Hit-stop at 0% depends on Combat confirming fairness. It is listed as shipping; mark it REQUEST until confirmed.

**Camera**
- Restate the §4.1 size table at Art's 1.25× scale (R/Art fix 2). All floors already pass at 1.0× and 1.4×.

**Key-screens**
- Fence Line: give the "Last night" replay one held hero frame (the new arrival landing on its perch, with a stamp) for trailer capture. Re-run the flash test on the replay hops.

**Showpiece notes (for the combat prototype, not doc fixes)**
- Run the Harding capture on a Pile-On whose final beat is a Boss phase break. That is the densest moment the docs allow: a T5 panel, an impact frame and a giant word inside about 1 s.
- The ≥ 6% combat size floor (Art) and the ≥ 6.7% floor (Camera) are compatible. Art's silhouette tests should run at Camera's 6.7%.

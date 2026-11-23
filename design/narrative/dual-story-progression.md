# Dual Story Progression

*Owner: narrative-director · Round 2 (vertical slice) · 2026-11-23 · Status: slice spec*
*Canon: `design/creative-brief.md` v1.2, then `design/reviews/round-1/director-rulings.md`. The first draft is archived at `design/backlog/first-drafts/dual-story-progression.md`; it is the content backlog for Lives 3–9.*

**Scope of this doc.** It covers the **slice in full**: Lives 1–2, 11 home vignettes, the Routine layer, the daily find, the piano, and Bond. It gives **the whole game as a one-page framing**, including Life 8 as ruled (DR-27). Everything else is listed under `## Backlog (post-slice)`.

---

## 1. Overview

Mikan lives two lives on one clock. Outside the garden wall, the player fights, recruits and taxes their way up the cat hierarchy of Yunagi. Inside it, the player is a pet in Haru's House, and **watches a human life they cannot understand in words**. There is no subtitle, no readable text, no narrator. Haru's life is told by staging, objects, light, colour, music and Murmur, all seen from 30–60 cm off the floor by a cat.

Every in-game day advances both stories. **Home beats are gated by day count only; conquest never unlocks Haru's life** (DR-21). The house has a small daily game of its own: one thing changes each day, and the player sniffs it out. Over the slice (≈ 2–2.5 h, 6–7 days), the player meets Haru at 16, in the rain. They see her get a cat past her grandmother, practise one piano piece badly, always run late, and study under a lamp at night. At the end she opens an envelope that will take her away. The slice ends on the empty suitcase, as Mikan becomes Boss of Hidamari Lane.

This doc owns: the storytelling rulebook (binding on Art, Audio and UX); the nine Lives' framing; the slice's Keystones, Textures and montage; the Routine layer and home verbs; the daily find; Bond's fiction and points; the household characters; Sense Icons; and Life 8 end to end (framing only in this round).

## 2. Player Fantasy

**Boss outside, pet at home.** For twenty minutes you are a small tyrant who knocks rivals off walls. Then a bell-gold thread leads you home. The camera lowers and tightens as you drop off the garden wall, the world gets big, and a girl in yellow socks taps your bowl twice. You don't know what she's crying about at her desk, but you know to sit on her paper.

Three feelings the slice must deliver:
1. **Detective of the ordinary.** "Something is different in here today." The player comes in curious and finds it by nose.
2. **Belonging, earned by a cat.** Gran's plum slippers move ten centimetres aside. The Box goes up the step. Small territorial victories inside the house rhyme with large ones outside.
3. **Caring about a specific person.** The player should come away with a sentence like "she's always late and she can't get past one bar of her piano piece". That sentence, not "she went to school", is the slice's success.

---

## 3. Detailed Rules

### 3.1 The Storytelling Rulebook (binding on all departments)

This expands the language rule (brief §5.6). Where they differ, the brief wins.

**The three laws.**
1. **Witness.** Camera and microphone never leave Mikan. Nothing is shown that Mikan is not present to perceive: no school, no hospital, no cutaway, no flashback, no dream that delivers human information.
2. **Cat-Sense.** Every story fact arrives through something a cat notices: movement, touch, food, warmth, smell, sound, light, routine. Meaning that needs reading, a human symbol or a human concept (money, dates, diagnoses) may dress a scene but **never carries a beat**.
3. **No-Translation.** Nothing explains the human story: no subtitle, codex, quest text, achievement name, loading tip or cat character. Mikan's reactions say *what Mikan grasps*, never what humans mean.

**Channels** (codes used in beat tables):

| Code | Channel | Rule |
|---|---|---|
| C1 | Staging | Blocking reads from 30 cm: feet, knees, the underside of a table, who stands in a doorway |
| C2 | Body and touch | Hands and feet are the main actors. Each human has a signature gait and hand habit |
| C3 | Colour and costume | Haru **yellow**, Gran **plum** (Sora teal, Koharu coral: Backlog). A human is identifiable by colour plus one shape with the face out of frame |
| C4 | Objects | Things that appear, vanish, move, age. Every Keystone leaves a persistent object trace |
| C5 | Light | The Veranda Lamp is lit at every Dusk in Lives 1–7. Its being dark is reserved for Life 8 |
| C6 | Weather | May rhyme (rain in Life 1, rain in Life 8). Never editorialises in the same beat |
| C7 | Routine and rupture | The strongest channel (§3.3) |
| C8 | Home Scent | Whisker Sense inside the wall shows each human's trail in their colour; four freshness steps: fresh, day-old, old, trace |
| C9 | Music | Confirms what the image shows. Never the only carrier; never anticipates what Mikan cannot know |
| C10 | Murmur and diegetic sound | Prosody only: no phonemes of a real language, no repeated syllable heard as a name. Never comic |
| C11 | Mikan's reaction | Ears, tail, pupils, a trot to the door, plus at most one Sense Icon event per vignette |
| C12 | Camera | Cat height. **A human face entering frame is an event** and is spent deliberately |
| C13 | Pictures | Photos and drawings; faces allowed, captions never |

**Forbidden.**

| # | Never | Why |
|---|---|---|
| X1 | An intelligible human word, spoken or sung, in any language, trailers included | Pillar 1 |
| X2 | Readable writing or numerals in the world. All of it is Scribble | Pillar 1 |
| X3 | Load-bearing human symbols (hearts on cards, medical crosses, arrows, emoji). Sanctioned exceptions only (§3.1 end) | Cat-Sense |
| X4 | Scenes away from Mikan; flashbacks; ghosts | Witness |
| X5 | System text naming a human event ("Haru is studying"). Life titles are allowed: they are written from the cat's side | No-Translation |
| X6 | A cat line that explains, consoles or names a human's affairs. In Lives 1–7 Rivals may cite the collar, bell, bowl, plaster and the Call, never a human (DR-44) | Brief §5.6.5 |
| X7 | Sense Icons that state human meaning (tear, ring, broken heart, clock, numeral, face) | Brief §5.6.3 |
| X8 | A beat carried by one channel, or by audio alone | Accessibility |
| X9 | Music that foreshadows what Mikan cannot know | Tone |
| X10 | The accident, its cause, a vehicle, hospital, body or coffin. Ever | Brief §5.5 |
| X11 | A human harmed, frightened or targeted by any player verb | Brief §9 |
| X12 | A skip option or any path that makes the home story avoidable | Pillar 2 |
| X13 | A gag adjacent to grief. Joy may be funny; sorrow may not be undercut | Brief §9 |

**Comprehension contract (the Rule of Three).** Each beat is written at three tiers. The game only promises the first.

| Tier | Definition | Target |
|---|---|---|
| **A: felt fact** | What a cat would get ("she is hurt, and it is not her body") | **90% of unbriefed testers, audio muted** (DR-03) |
| **B: human fact** | What an adult infers ("exam stress") | 65% |
| **C: detail** | A reward for close reading | Never required |

**Redundancy rules (every Keystone):**
1. **Three channels** carry Tier A.
2. **Two senses:** at least two of those channels are visual, so Tier A survives with audio muted.
3. **One trace:** a persistent object, light or scent state stays for the rest of the Life.
4. **One mirror:** Mikan reacts (C11).
5. **Vocabulary before use:** an idiom that must read instantly at a high-stakes moment is taught earlier at low stakes (table below).
6. **No single point of failure:** a Keystone that tests below its Tier A target gets another channel or clearer staging. Never words.

**Vocabulary taught in the slice** (the full table is Backlog; these rows are taught here and must not be contradicted later):

| Idiom | Taught in the slice | Paid off later |
|---|---|---|
| Shoes in the entryway = who is home | K1.1 tail: loafers and plum sandals | L4 teal laces · L5 black shoes · L8 her shoes never come back |
| The Call = come home, you are wanted | K1.3, every Dusk after | L8 silence at Dusk · L9 a new voice |
| The Alcove (photo, incense, rin) = someone remembered | T1.1: Gran's hand goes still at Grandpa's photo | L5 Gran's photo · L8 Haru's beside it |
| The Goodbye = she leaves, and comes back | K2.1, every school morning after | L8 A2: the last one, unremarked |
| Late = the lamp stays on for you | K2.3 onward (post-flap): the lamp is lit when Mikan comes in late | L8: dark |
| A second Goodbye = Haru is late again | T2.1, then Routine | L8 A2: "she's late again" |
| Home Scent fading = away a long time | (Haru's trail to the door is fresh every slice day) | L3 thins and floods back · L8 thins for good |

**Ritual, Repetition, Rupture.** Establish a ritual and let the player perform it many times (**≥ 3** before any variation carries a beat). Then change **exactly one** element (who, when, where, how or whether). Rituals live in the Routine layer, not in vignettes.

| Ritual | Canonical form (slice) | Introduced |
|---|---|---|
| **The Feeding** | (1) cupboard door and kibble rattle, mixed loud for cat ears; (2) the Bowl on its spot; (3) the **Tap-Tap**: two fingertips tap the rim twice; (4) one stroke down Mikan's back, ringing the bell | K1.3 |
| **The Call** | One bar after the Dusk chime, Haru sings three notes from the veranda (rise a third, fall a fifth). Mikan's ear-turn ends in a head-shake that **rings the bell on the downbeat after the Call** (the fourth beat, DR-53) | K1.3 |
| **The Goodbye** | Leaving, Haru crouches at the entryway step (her face enters frame) and scratches under Mikan's chin with two fingers | K2.1 (seen in K1.1 tail once) |
| **The Lamp** | Haru pulls the Veranda Lamp cord at Dusk. If Mikan is out, it stays lit all night | K1.3 |
| **The Alcove** | Each morning Gran lights incense before Grandpa's photo, strikes the **rin** once (DR-23) and stands still for a breath | Life 1 day 1 Routine; T1.1 |

**Sense Icons** (Narrative owns the vocabulary, UX the look). A bubble over Mikan, ≤ 2 icons at once, ≤ 1 icon event per vignette.

| Icon | A cat's meaning |
|---|---|
| Fish | Food |
| Heart | Mine / safe |
| Question mark | I don't understand (only combined with another icon; sanctioned UI exception) |
| Rain cloud | Wet, cold, unhappy |
| Note (three arcs) | The Call, heard or expected |
| Door | Someone leaving or expected |
| Sun · Curl · Knees | Warm spot · sleepy · a lap is available |
| Sparkle | Shiny, must bat |
| Scent wisp (tinted) | A smell, familiar or new |
| Ear | A sound off-screen (deaf/HoH carrier, DR-54) |
| **Tone puffs** (replace Murmur Ribbons, DR-54) | **Round** = warm voice · **Spiky** = sharp voice · **Drooping** = low, unhappy voice · **Bouncing** = bright, excited voice. They show how a voice *feels to a cat*, never what it says |

**Sanctioned exceptions** (recorded in the brief, DR-55; not precedent): the question-mark icon; the always-on **Call glyph** (singer's colour; Haru = three smooth yellow arcs); the Doorstep as the only HUD space inside the wall; the ring and white dress (Tier B only, Backlog); Haru's Home Scent note in Life 8; the undetermined cause of death.

**Camera at home** (DR-48). The same third-person camera, at cat height (0.3–0.6 m). A gentle lower-and-tighten happens as Mikan drops off the garden wall, and the reverse on leaving. Vignettes use authored shots. Humans are knees and hands unless they bend down. Control loss in any vignette is **≤ 4 s at a time**. Keystones are playable-adjacent: the scene happens around a cat the player still steers wherever possible.

### 3.2 The whole game: the nine Lives (framing only)

| Life | Haru (owner beat) | Mikan (cat beat) | How they rhyme |
|---|---|---|---|
| **1 The Box in the Rain** | 16. Takes a wet kitten home past Gran's refusal; the collar; the first Call | Kitten; first Crew cat; first Spray; hold 1 Patch | *Claimed and claiming.* Haru marks Mikan with a collar the same day Mikan marks the lane. The collar that means *loved* inside is "Collar!" outside |
| **2 Uniform** | 17–18. School mornings, the piano, the study lamp, the flap, the envelope | Claim Hidamari Lane; Daifuku | *Tests and doors.* Both are shut in by an older order (the exam, Daifuku's wall) and get out in the same week. Mikan becomes Boss of the lane as Haru prepares to leave it |
| **3 The Empty Room** | 18–22. Suitcase; her room goes still; Gran feeds you; the phone carries the complete Call | Hold 4 Arcade outer Patches | *Leaving home ground.* Both are in a bigger place among strangers |
| **4 Two Pairs of Shoes** | 23–25. Work clothes; Sora's teal shoes; the lap war; Gran slower | Claim Akane Arcade; Madam Sabi | *A stranger on your turf.* Mikan recruits Rivals as Sora is let in. The Life closes on a Nose-Touch offered to Sora |
| **5 White Day** | 26. **Black Shoes**: Gran's death is played (K5.1, DR-26); boxes; a white dress | Hold 4 Shiosai outer Patches | *An elder's seat empties.* The household reorganises like a Clowder |
| **6 The Small Loud One** | 28. A belly, a fast exit at night (with joy), Koharu; Mikan displaced, then on guard | Claim Shiosai; Ikari | *Guarding the small.* The night exit is taught as hope |
| **7 The Long Summer** | 31. The happiest house in town | Rout Botan; Great Boss | *Peak on both sides.* Botan is a pet called home by a bell, which is what Mikan is |
| **8 The Door** | Haru does not come home. Mikan waits | Old. Three Food Carries across the town | *The inversion.* The food tax becomes an act of love; the empire's wealth is carried in one fish at a time |
| **9 Nine** | Koharu, 8, fills the bowl and sings the Call | Elder. Name an heir; one last walk | *Succession on both sides* |

**Life 8 framing (DR-27; detail Backlog; this section is the single spec other docs cite).** Length 7–8 days, playable from day 1. No time-skip shuffle on entry.
- **Stage A** (2 ordinary days). A1 is Mikan's first day as Great Boss. **Its ordinary Dusk Call is the last** complete sung Call, and nothing marks it. A2 brings the last Goodbye (morning slot, unremarked) and a Dusk where the chime sounds and the Call does not. The bell rings alone on the fourth beat.
- **The wait** (2 days, played live). The street is quiet, with an Ambush budget of 0. Sleep is offered only from Dusk. Knock targets are disabled. Every home verb still accepts input, and most stop being answered.
- **The Season Turn** is held outside, on the Doorstep beside the uncollected Tribute pile. Crows take the pile, frost comes, and Mikan becomes Old. The Doorstep is then empty; there are no Doorstep deliveries all Life.
- **The Carries.** There are 3, on 3 different days, counted and never valued. Carry 1 is a fish from the Stash. Carry 2 is Fresh Catch from a held Patch in the Lane or the Arcade. Carry 3 is Fresh Catch from Shiosai's harbour. While carrying, Mikan cannot attack and the other three fight at 100% AI fill. Combat is never harder than Life 7; the Usurper is optional.
- **Tone.** The Sniff is indifferent and reports gratitude first. Rivals never mention the household. Koharu has at most **four** pathos beats.
- **Music.** From the phone call until Carry 3, neither Haru's voice nor her Melody sounds anywhere, systemic cues included. Music returns on pick-up and on set-down. Her Home Scent note (player-summoned) is the only trace.
- **Close.** Sora whistles two notes of the Call and Koharu sings the third.
- **No food enters the house before Life 8.** Every earlier Gift is a curio.

### 3.3 Slice structure: Lives, days and gates

**Gating rule (DR-21).** Every vignette has a `day_gate` within its Life and a slot (`M` morning, `D` Dusk arrival, `A` any arrival). **Turf never gates a home beat.** Turf gates only the Life's end.

**A Life ends** at the first sleep at home after (a) its turf goal is met, (b) `day_in_life ≥ life_min_days`, and (c) its Closing has played. Life 1: hold 1 Patch, min 2 days. Life 2: claim Hidamari Lane, min 4 days.

**Pre-flap Dusks are universal.** Until the flap (Life 2 day 2), every player is walked home at the end of Dusk (DR-15), so Dusk-slot beats before then reach 100% of players. After the flap, beats a night-owl could miss are either morning beats or staged to work at any hour.

**The slice schedule (11 vignettes: 7 Keystones, 3 Textures, 1 montage).**

| Life · day | Slot | ID | Vignette | Type |
|---|---|---|---|---|
| L1 · 1 | Opening | K1.1 | The Box in the Rain (with Gran's refusal folded into its tail) | Keystone |
| L1 · 1 | D | K1.3 | The Bell and the First Call | Keystone |
| L1 · 2 | M | T1.1 | Grandpa's Photo | Texture |
| L1 · 2 | D | K1.4 | The Step (**Closing**) | Keystone |
| L1→L2 | Life-end sleep | M1 | The Kitten Grows (montage, played as a nap) | Montage |
| L2 · 1 | M (+ D tail) | K2.1 | School Shoes | Keystone |
| L2 · 1 | D | T2.2 | The Stuck Bar | Texture |
| L2 · 2 | M | T2.1 | The Second Goodbye | Texture |
| L2 · 2 | D | K2.3 | The Flap (Night opens) | Keystone |
| L2 · 3 | A (any hour) | K2.2 | The Lamp at Night (K2.2 + K2.4 merged) | Keystone |
| L2 · 4 | M (+ D tail) | K2.5 | The Envelope (**Closing**) | Keystone |
| L2 · 5+ | — | — | Plateau "Waiting to Leave"; the slice ends at the Life-end sleep | — |

**Opening timing (DR-22).** K1.1 runs 0:00–0:04. The garden (move, jump, Swat, Skitter on a crow) runs 0:04–0:08. The old wall cat appears at ≈ 0:08–0:10, then the two-Stray lane fight and Quick Pile-On at 0:10–0:15. The rest of day 1 follows; Dusk brings K1.3.

### 3.4 The slice vignettes, beat by beat

Each Keystone lists what Mikan perceives, the channels, the trace, and the **three-channel Tier A check** (the ≥ 3 channels that carry Tier A, ≥ 2 of them visual). ★ = channels that survive mute.

**K1.1 The Box in the Rain** (opening; ≈ 4 min including control)
- *Perceives:* Shrine steps in rain, and a soaked box (control from the first second: the kitten can only shiver, mew and climb the box rim). A yellow raincoat crouches, and **the first human face in the game bends into frame**: dark bob, wet fringe, a worried grin. She **hums**, and it is **not the Call**: it is the opening phrase of *her piano piece* (§3.7, PP-01). Then dark, a heartbeat, and yellow light through fabric as she carries the kitten inside her coat.
- *Tail (old K1.2):* The entryway. **Plum slippers** plant in the inner doorway. **Yellow socks** shift from foot to foot. Low, sharp Murmur (spiky puff) meets high, pleading Murmur. A chipped **saucer** of food goes down anyway. The Box is left on the entryway's lower floor, **below the step**, beside school loafers and (day 1 only) yellow rain boots.
- *Morning of day 1:* Haru crouches at the step and fastens a **red collar with one brass bell**. It rings when the kitten shakes its head. She leaves late (the first glimpse of the second Goodbye, uncommented). The door to the garden is opened.
- *Channels:* C6★ C3★ C12★ C2★ C9 C10 C11★. *Trace:* the Box below the step; the raincoat on its hook; the collar.
- *Tier A:* "I was cold and alone. The yellow one took me. The old one does not want me inside." (C6 rain, C3 yellow, C12 face, C1 slippers planted.)

**K1.3 The Bell and the First Call** (L1 day 1, Dusk; storyboard §3.8 A)
- *Perceives:* The Dusk chime, and one bar later **the Call** rising from the hill: three yellow arcs over the roofline and the Call glyph. The bell rings on the fourth beat. A bell-gold Head Home thread appears. At the garden wall Haru is on the veranda with a **new blue-and-white Bowl**, and she sings again when she sees the kitten. Kibble rattle, the Tap-Tap, the stroke. Gran's plum sleeve drops a flake of fish beside the Bowl when Haru is not looking. Haru pulls the Lamp cord.
- *Knock tutorial:* the empty Bowl sits on the veranda edge as the only knockable. Batting it off **chips its rim**: Haru laughs (bouncing puff), runs her thumb over the chip, and keeps it. If the player never knocks it before sleep, the kitten's tail sweeps it off while climbing into the Box. **The chip always exists**, and it stays for the whole game (DS-X3).
- *Channels:* C7★ C9 C3★ C4★ C5★ C2★ C11★. *Trace:* the chipped Bowl on its spot; the lit Lamp.
- *Tier A:* "That song is me. It means come home and eat." (C7 song then food, C4 Bowl, C5 Lamp, C2 Tap-Tap; muted, the Call glyph carries the song.)

**T1.1 Grandpa's Photo** (L1 day 2, morning; Texture, DS-C3 Life 1 part)
- Gran lights incense at the Alcove and strikes the rin once. The kitten pads up and leans on her ankle. She picks it up, and while she looks at an old man's photo **her hand goes still on Mikan's back** for three breaths. Then it moves again. This is not sad, but clearly *remembering*. Mikan: scent wisp (plum, with incense braided).
- Teaches the Alcove with feeling once (vocabulary for Life 5 and Life 8). ≤ 3 s control loss (the pick-up).

**K1.4 The Step** (L1 day 2, Dusk; **Closing**)
- *Perceives:* On arrival, the Box is not below the step. A fresh **plum** scent trail leads up the step to the Main Room, where Gran's hands have set the Box **beside her own cushion**. When she sits, the Knees icon appears over her lap for the first time. If the player climbs on, she looks away, Murmurs one gruff syllable (round puff), and lets her hand come down.
- *Channels:* C4★ C8★ C1★ C2★ C10 C11★. *Trace:* the Box in the Main Room for the rest of the game.
- *Tier A:* "The old one is mine too. I live here." (C4 Box moved, C1 beside her cushion, C2 hand comes down, C8 her trail leads there.)
- Life 1 ends at the first sleep after this, once 1 Patch is held.

**M1 The Kitten Grows** (montage, played as Mikan's nap in the Box; ≤ 40 s, no control). Seasons pass through the veranda glass: snow on the garden wall, then cherry petals on the Doorstep, then cicadas. The Box is re-taped and the kitten grows to fill it. Haru's loafers are replaced by bigger ones and her school skirt hem lengthens. The Piece is heard through the walls, slightly better each season, always breaking off at the same bar. The camera stays at cat height in the Main Room (Witness Law). Mikan wakes as a young adult.

**K2.1 School Shoes** (L2 day 1, morning, with a Dusk tail)
- *Morning:* The rush as ritual: toast, school bag, loafers, and **the Goodbye at the step**, established here as daily. Her trail runs fresh to the front door; she is gone all day.
- *Gift tutorial:* A **cicada shell** sits by the Doorstep and pings in Whisker Sense. Carried home at Dusk and put down near Haru, it makes her yelp (spiky puff), then laugh (bouncing). She puts it in a jar on her windowsill: **the Gift Jar** begins. Gran laughs for the first time in the game. (No food enters the house before Life 8: DR-23.)
- *Channels:* C7★ C3★ C2★ C10 C4★ C11★. *Trace:* the school bag's spot by the door; the Gift Jar.
- *Tier A:* "She leaves every morning and comes back every evening."

**T2.2 The Stuck Bar** (L2 day 1, Dusk; Texture). Haru at the upright piano plays the Piece and stops at the same bar. She tries it three times. Mikan can hop on the bench, then walk the keys (§3.6, piano verb). Whatever the player does, she stops, Murmurs bright, plays a bass line under Mikan's footsteps for a few seconds, and lifts Mikan into her lap at the bench. Gran's plum slippers turn toward them in the doorway and stay. **Haru's piano is introduced as hers.**

**T2.1 The Second Goodbye** (L2 day 2, morning; Texture, DS-C4). Toast in mouth, Haru does the Goodbye and goes out the door. Three seconds later the door bangs open and she runs back past Mikan for the forgotten bag: socks skidding on the boards, Gran's long-suffering Murmur. Then **a second Goodbye**, quicker, a chin scratch on the run. From now on the Routine layer repeats this (the second Goodbye fires on ≈ 1 school morning in 2). This is comic. It becomes the cruellest reading of Life 8 A2.

**K2.3 The Flap** (L2 day 2, Dusk)
- *Perceives:* Sawdust smell; a saw's rasp. Gran holds the tools and Murmurs disapproval while Haru cuts. A square of daylight appears in the veranda door. Haru's hands push Mikan through it, and Mikan's head comes back in. Haru laughs. **Night is unlocked.** The Lamp rule is taught: if Mikan goes out, the Lamp stays lit.
- *Channels:* C4★ C10 C2★ C5★ C11★. *Trace:* the flap.
- *Tier A:* "She made me a door of my own."

**K2.2 The Lamp at Night** (L2 day 3, plays on **any** arrival; K2.2 + K2.4 merged; the first Comfort beat)
- *Perceives:* Haru at her desk under the study lamp: heel hooked on the chair rung, Scribble pages in stacks. She's quiet, then her head is on her arms, then her shoulders shake. There is **no Murmur at all** (the drooping puff, once). Mikan may sit on her pages: she moves Mikan off twice, then gives up. **Comfort:** pressing against her arm and holding makes her hand find Mikan and slow down. Only *after* the Comfort resolves does a **crumpled Scribble ball** on the floor become battable. If Mikan bats it, she laughs wetly (the cat cheering her up, not undercutting her: X13).
- *Any-hour staging:* She is a student who studies all night, so the beat plays whenever Mikan comes in. Evening arrival: Gran sets down tea and withdraws. Late arrival (from Night): Gran's room is dark, the tea is cold, and the lamp is the only light in the house. Same beat, a lighting variant.
- *Channels:* C2★ C5★ C1★ C10 (silence) C4★ C11★. *Trace:* the crumpled ball stays in the corner for the rest of the Life.
- *Tier A:* "She is hurt, and it is not her body. Being close helps." (C2 shoulders, C5 one lamp in a dark house, C1 head down, C4 crumpled paper.)

**K2.5 The Envelope** (L2 day 4, morning, with a Dusk tail; **Closing**; slice end)
- *Morning:* A thick envelope comes through the door slot. Haru's legs tremble as she opens it at the step. Then **her feet leave the floor**, Gran's hands go to Haru's face, and both Murmur bright and high (bouncing puffs). Haru picks Mikan up and spins: this is the third face event in the slice.
- *Dusk tail:* A feast smell, and the Bowl gets something better than kibble. That evening Haru plays the Piece **straight through for the first time**, past the stuck bar, still clumsy. Then she takes down a suitcase and leaves it open and empty on her floor. Mikan may sit in it: scent wisp (yellow) + question mark.
- *Channels:* C2★ C10 C4★ C7★ C9 C11★. *Trace:* the open suitcase.
- *Tier A:* "Something wonderful happened to her. And there is a new box, and I do not like it."
- **Slice end.** At Life 2's Life-end sleep (Daifuku Routed, day ≥ 4, K2.5 played), the sleep spot offered is **the open suitcase**. Sleeping in it cuts to the title card. There is no time-skip to Life 3 (DR-01).

### 3.5 The home and what changes

The slice house has five spaces, all walkable: **Entryway** (lower floor, step, shoe shelf, hooks, front door with door slot), **Kitchen/Main Room** (the Bowl's spot, low table, Gran's cushion, the Alcove, the **upright piano**), **Haru's Room** (desk, study lamp, windowsill, bed), **Veranda, Garden and Doorstep** (the Lamp, the flap from L2 day 2, the low wall, the Stash under the boards). Gran's room exists as a closed door with a scent pool. Crew never enter. There is no combat inside the wall, and **the clock pauses inside the wall, garden included** (PP-02).

**Two persistent player objects:** the **Bowl** (blue-and-white, chipped by Mikan in K1.3; a saucer before it) and the **Box** (below the step, then beside Gran's cushion from K1.4).

| Space | L1 start | L1 end | L2 progression | L2 end (slice end) |
|---|---|---|---|---|
| Entryway | Loafers, plum sandals, rain boots (day 1 only); the Box below the step | Box gone up the step | School bag's spot by the door; loafers kicked askew (late) | The envelope's torn flap on the shoe shelf |
| Main Room | Saucer; Gran's cushion; Alcove with rin; piano lid shut | The Bowl, chipped; Box beside Gran's cushion | Piano lid open evenings; Scribble score on the stand | Score stand empty (she finished it) |
| Haru's Room | Futon, school things | Kitten fur on her pillow | Study lamp, paper stacks, Gift Jar on the sill | Open suitcase; stacks boxed |
| Veranda / Garden | Lamp lit at Dusk | — | The flap; the lamp lit through the Night if Mikan is out | — |

**Plateaus.** If a Life's Keystones run out before its turf goal, the house lives in a season with **one prop drift per extra day**, delivered through the daily find (§3.6). Life 1 is "A Kitten Settling In" (a slipper Mikan sleeps in, Gran sweeping around the Box). Life 2 is "Waiting to Leave": one item goes into the suitcase each day (a sweater, the Scribble score, a photo of Mikan), and the piano is played straight through each evening.

### 3.6 The daily home ritual as play

**A visit has a shape, and each part is short:**

| Visit | What the player does | Budget (DR-16) |
|---|---|---|
| **Morning** | Wake where you slept → walk past the Bowl (**the morning Feeding auto-resolves** as Mikan passes it) → the Goodbye at the step if Haru is leaving (stand within 1.5 m) → out to the Doorstep | Wake → door **≤ 15 s** with no vignette, ≤ 1.5 min with one |
| **Evening** | Call → Head Home thread → lower-and-tighten at the wall → the Lamp → **full four-step Feeding** (Eat) → free time → choose a sleep spot | **≤ 2 min** median |

**Free time offers four things worth doing:**
1. **"What changed today?" (the daily find; daily-reset slot 2, DR-18).** Each day the Routine layer changes **one** thing in the house: a prop moved, a new object, different shoes, a Plateau drift. On arrival a **fresh Home Scent trail** in the responsible human's colour leads from the entryway to it (visible with Whisker Sense, which is the first thing the evening teaches). Sniffing it (Interact) plays Mikan's reaction and one Sense Icon, and fills **the day's Bond "find" slot**. It stays available until sleep. Missing it costs nothing beyond that day's point. The slice authors **8 finds** (one per slice day plus spares), drawn from the change table and Plateaus. Examples: a ginger-cat charm on Haru's school bag; Gran's new reading glasses on the low table; a towel warm from the line; the Scribble score with a pencil circle on one bar. It trains the exact skill Life 8 uses.
2. **The piano.** Mikan can walk on the keys whenever the lid is open (L2 evenings, Haru's room door open). Keys sound left-to-right in pitch, quantised to the home key so it's always pleasant. If Haru is at the bench, she plays a bass under Mikan's steps and offers her lap (once per evening, it counts as Lap). The piano gives no reward of its own: it is the home verb that is *play*. Ruling: the Call cell (rise a third, fall a fifth) is **masked**, so key-walks never produce it.
3. **Lap and Rub.** Lap: Interact at a seated human with the Knees icon and hold `lap_hold_s`. The purr loop plays and her Murmur softens (round puff). Rub: walk into legs, and a hand comes down.
4. **Gift and Knock.** Gift: carry a curio found outside and put it down near Haru, and it joins the Gift Jar. The slice has **3 curios**: the cicada shell (K2.1) and **2 hidden in the Lane**, found by Whisker Sense's compass (a ginkgo leaf on a roof, a blue marble in a gutter). They are one-time finds. Knock: authored knockables per room, with human reactions varying by object (Haru laughs; Gran Murmurs sharp and puts it higher). **Knock targets are disabled during Comfort beats and Keystone tender moments** (DS-C12), and in Life 8 stages B–D.

**Why it is worth doing:**
- **Bond → Well-Fed.** Coming home by Dusk and filling slots raises Bond. Combat feels it next day: Zoomies starts at 5% per heart, and every Posse cat starts each fight with ¼ Paw (DR-20).
- **The story lives here.** Day-gated vignettes play on arrival.
- **The house answers.** House Memory for the slice is limited to prop states: the pencil cup moves higher after 3 knocks; a folded blanket appears at the most-used sleep spot; the Gift Jar fills.

**Other verbs:** Eat, Sleep (offered **from Dusk only**, to stop the day count being skipped; day-loop implements it), Meow (gets attention: a door opened, a look down), Sit in Box, Comfort (only when offered).

**After a wipe** (DR-19, DR-40.6). Mikan slinks home. If it is before Dusk, the clock jumps to Dusk and the evening plays as usual (**a K1.3 or K1.4 due that day plays normally: the first Call is never lost**, PP-06). Haru checks Mikan over and puts a **sticking plaster** on an ear: **the same asset as the Scar kit's head plaster**. Mikan wears it all next day (tag `mikan_plastered`), and Rivals may cite it ("Nice plaster, Collar."). In Life 1 nothing is lost.

### 3.7 Who the household is (by the end of the slice)

**Haru (16–18).** By the slice's end the player should be able to say four specific things about her:
1. **She is always late.** Toast in mouth, the second Goodbye, loafers kicked askew.
2. **The upright piano is hers**, and she has **one piece** (*the Piece*). She hums its opening in the rain at K1.1. She stalls at the same bar for a year. The night the envelope comes, she plays it through. (At 25 she plays it well; in Life 9 Koharu plays it haltingly: Backlog.)
3. **She takes Mikan's side against Gran**, and wins by persistence, not argument: socks shifting, saucer down anyway, the flap cut with Gran holding the saw.
4. **She studies too hard and cries alone.** She doesn't hide it from the cat.

Signature gait: a skidding half-run in socks. Hand habit: two fingers (the Tap-Tap, the chin scratch). Colour: yellow (raincoat, socks, cardigan cuff). Murmur: bright, quick, rises at the end, and goes silent when hurt.

**Gran.** Plum; slippers that plant in doorways; a gruff single syllable; feeds Mikan scraps when nobody watches. She does the Alcove each morning, with the rin. Her arc in the slice runs from *no* to *the Box beside her cushion*. She holds the tools for the flap while disapproving. Her laugh is first heard at the Gift tutorial.

**The old wall cat** (narrative names them; Crew owns stats and personality): **Hige**. Dry, few words, calls Mikan "Collar" without malice until the first Verdict, then "kid". First line: "Use your whiskers, Collar." Hige never mentions Haru (X6).

### 3.8 Storyboards (third-person camera, cat height)

**A. "The Bell and the First Call"** (K1.3, Life 1 day 1, Dusk). *Setup: the kitten is in the lane after the first fights. The collar went on this morning. The player has heard Haru hum, never the Call.*

| # | Dur | Camera | Action | Sound | Control |
|---|---|---|---|---|---|
| 1 | 3 s | Explore follow (≈ 3 m back, 1 m up) in the lane | Gold light; the **Dusk lamp wave** runs uphill from the harbour, window by window | The Yunagi chime | Full |
| 2 | 3 s | Same; the kitten's ears snap round | Over the roofline toward the hill: **three yellow arcs** rise (Call glyph). The kitten shakes its head and **the bell glints** | One bar after the chime, the Call, unaccompanied. The bell on the fourth beat | Full |
| 3 | — | Same | A bell-gold **Head Home** thread unrolls along the High Road. *Note + question mark* | Cicadas winding down | Full; the player may keep roaming until drowsy |
| 4 | 3 s | At the garden wall the camera **lowers and tightens** to ≈ 0.4 m behind the kitten | The kitten drops into the garden. The world gets big. Yellow socks on the veranda boards, a cardigan cuff, the new blue-and-white Bowl in two hands | Boards creak | Full |
| 5 | 3 s | Held framing from behind the kitten, looking up | She sees the kitten and **sings again**, softer | The Call | Full |
| 6 | ≤ 6 s | Authored: she crouches | **If the kitten approaches:** go to 7. **If not:** her face comes down into frame (the second face event: bob, grin) and she taps the rim twice and sings again. After a third Call, the kitten's nose leads (an authored two-step, ≤ 1 s control loss) | Tap-tap on ceramic | Full |
| 7 | 5 s | Follow at heel height through the veranda door | Her heels go inside and the kitten follows. In the kitchen doorway, **plum slippers** are planted. Yellow socks step round them; the kitten stops. The slippers shift ten centimetres | One low grudging syllable (spiky → round puff) | Full; the doorway is passable only after the slippers move |
| 8 | 4 s | 0.3 m, the Bowl's spot | Kibble rattle (loud for cat ears). The Bowl goes down. Tap-Tap. *Eat* | Rattle; tap-tap | Eat |
| 9 | 4 s | Same | While the kitten eats, one stroke head to tail. **The bell rings** | The bell lands where the fourth beat was | Eating |
| 10 | 3 s | Same, deep focus | Behind the Bowl, a plum sleeve lowers a flake of fish from chopsticks and withdraws fast | Haru: rising, teasing laugh. Gran: gruff denial | Eating |
| 11 | 3 s | Free camera, the veranda | A yellow sleeve pulls a cord. **The Lamp** comes on: a warm circle on the boards, the garden turning blue beyond | Click. The home theme enters on piano, very quiet | Full |
| 12 | — | Free | The empty Bowl on the veranda edge: Knock tutorial. Batted off, it chips. Haru's thumb on the chip; she keeps it | Ceramic tock; bright laugh | Full |
| 13 | 4 s | Over the kitten toward the shut window | On the garden wall, cat silhouettes, one enormous (Daifuku). The window is closed. The kitten's tail tip moves | Night insects through glass | Full. Sleep offered in the Box, below the step |

*Tier A:* "That song is me. It means come home and eat." *Muted check:* the arcs (C9 via glyph), the Bowl (C4), the Tap-Tap (C2), the Lamp (C5). *Hook:* the wall.

**B. "A Tuesday in Life 2"** (an ordinary Routine evening, Life 2 day 3+, home by Dusk; no Keystone). *This proves the house is worth coming home to when nothing is scheduled.*

| # | Dur | Camera | Action | Sound | Control |
|---|---|---|---|---|---|
| 1 | 3 s | Explore follow on a roof | The lamp wave; three yellow arcs from the hill; the bell glints | Chime → Call → bell | Full |
| 2 | ≤ 60 s | Follow | The Head Home thread. The player runs the High Road home | Lane dusk music thins to the Dusk bleed | Full |
| 3 | 3 s | Lower-and-tighten at the wall | The Lamp already on. In the entryway, **loafers kicked askew, one upside down**: she was late again | Home room tone | Full |
| 4 | 6 s | 0.3 m, the Bowl | The Feeding, all four steps; the bell on the stroke | Rattle, tap-tap, bell | Eat |
| 5 | 3 s | Free; Whisker Sense held | The world desaturates. A **fresh yellow trail** runs from the entryway to Haru's room; Gran's plum is day-old by the cushion | Haru's Home Scent tone, sustained | Full |
| 6 | 5 s | Follow at 0.4 m | The trail ends at the school bag on its hook: **a new ginger-cat charm** dangles from it. Sniff. *Heart* | A tiny charm-bell, a different pitch from Mikan's | Interact (daily find filled) |
| 7 | 4 s | Main Room, low wide framing | Haru at the upright, back to camera. She plays the Piece and stops at the same bar. Again. Stop | The Piece, clumsy; the stall | Full |
| 8 | — | Free | Mikan hops to the bench, then onto the keys. Each step a note | Key notes, quantised, Call cell masked | Full (the piano verb) |
| 9 | 4 s | Authored, 0.5 m beside the bench | Her hands come off the keys; a bright Murmur (bouncing puff). She plays a slow bass under Mikan's footsteps | Duet: her bass, Mikan's notes | Full; Mikan keeps walking |
| 10 | 3 s | Authored low | Her hands lift Mikan into her lap at the bench. *Knees* resolves to *Heart* | Purr loop; Murmur soft (round) | ≤ 2 s loss, then hold for Lap |
| 11 | 3 s | Deep focus to the doorway | Gran's plum slippers stop in the doorway, turn toward them, and stay | One gruff syllable, warmer than in Life 1 | Lap held |
| 12 | — | Free | Choose a sleep spot: the Box by Gran's cushion, or Haru's futon (the study lamp still on) | Room tone | Sleep |

*Tier A:* "She's home, she's late, she can't play that bit, and I'm part of it." *What the player did:* came home, ate, found the change, played, sat. Median ≈ 1:45.

---

## 4. Formulas

**F1. Vignette eligibility**
```
eligible(v) = (life == v.life) AND (day_in_life >= v.day_gate) AND slot_matches(v.slot, now)
              AND (v.prev == null OR played(v.prev))
```
Priority when several are eligible for one slot: **Closing > Keystone > Texture > daily find only**. Losers wait for the next matching slot. At most one vignette per slot (two per day).

**F2. Life end**
```
life_ends_at_sleep = turf_goal_met(life) AND day_in_life >= life_min_days[life] AND played(closing[life])
```
`life_min_days` = L1 2, L2 4 (full game: 2, 4, 3, 3, 3, 3, 4, Life 8 ≈ 7–8, 2).

**F3. Bond** (Narrative owns points and fiction; Combat owns Well-Fed's effect)
```
daily_gain  = min(bond_daily_cap, Σ slot gains earned today)
bond_points = min(55, bond_points + daily_gain)          # never decreases
on LifeAdvanced: bond_points = max(bond_points, floor_points[life])
hearts      = count of thresholds H[i] <= bond_points     # H = 1,3,6,10,15,21,28,36,45,55
```

| Slot | Points | Limit |
|---|---|---|
| Home by Dusk (Evening arrival) | 1.0 | 1/day |
| Late arrival (post-flap) | 0.5 | 1/day |
| Lap (incl. piano lap) | 0.5 | 1/day |
| Daily find | 0.5 | 1/day |
| Gift | 0.5 | per curio (3 in slice) |
| Comfort | 0.5 | per offered beat |

| Variable | Default | Range | Note |
|---|---|---|---|
| `bond_daily_cap` | 2.5 | 1.5–3.0 | Stops grinding in one evening |
| `H[]` | above | — | Front-loaded so the slice is felt |
| `floor_points` | L1 0, L2 1 | — | Life minimum |

*Expected:* An attentive slice player earns ≈ 2.0/day over 7 days, or 14 points = **4 hearts** (Zoomies starts at 20%). A night-owl earns ≈ 1.0/day = 7 points = 3 hearts. Full game at ≈ 2.0/day × 28 days ≈ 56 = 10 hearts. *Example:* L2 day 3, Late arrival 0.5 + Comfort 0.5 + daily find 0.5 = 1.5; points 7.0 → 8.5, hearts stay at 3.

**F4. Home time budget check (playtest)**
```
home_share = (wake_to_door + evening_home) / day_total     # target ≈ 0.15, alarm > 0.20
```

---

## 5. Edge Cases

| Case | Resolution |
|---|---|
| Player claims the Lane on L2 day 2 | No beat accelerates. The Life ends at the first sleep on day ≥ 4 after K2.5. The days between are victory laps: the Fence Line reacts and the Plateau runs |
| Player never Routs Daifuku | The Life never ends. K2.5 has played and the Plateau "Waiting to Leave" runs. Daifuku is plastered −10% per wipe (to −30%) |
| Player stays in the house all day | The clock is paused inside the wall, so nothing advances. No fail state; the door is open |
| Player tries to sleep repeatedly to skip days | Sleep is offered only from Dusk, so the day's clock must be roamed |
| Late arrival on K2.2's day | Any-hour staging (lighting variant) |
| A Closing would play Late | Cannot happen in the slice: K1.4 is pre-flap (universal Dusk) and K2.5 is a morning beat. Rule kept: Closings never play Forensic; they wait for the next morning |
| Wipe on L1 day 1 before Dusk | The clock jumps to Dusk; K1.3 plays in full, plus the plaster |
| Player ignores Haru at the Call (K1.3) | Up to three Calls, then the nose two-step. The Bowl, Tap-Tap and Lamp still play |
| Player never knocks the Bowl | The tail sweeps it off at bedtime; the chip exists |
| Player never finds the daily change | It expires at sleep. No guilt, no comment; the prop state stays (it is just there) |
| Player bats the crumpled ball during the Comfort | Disabled until the Comfort resolves |
| Player walks away from the Comfort | Haru later comes and sits near wherever Mikan is. No penalty, no point |
| Player sits in the suitcase repeatedly | Allowed; Haru lifts Mikan out once per evening, then gives up (Plateau Echo) |
| Player is out when Haru leaves (Goodbye) | Morning starts at home always; the Goodbye fires if Mikan is within 1.5 m of the step before Haru exits. If missed, it is not replayed that day |
| Mute or deaf player | The Call glyph, bell glint, lamp wave, ear icon and tone puffs carry every audio-borne fact (DR-54) |
| Two vignettes eligible in one slot | F1 priority |

---

## 6. Dependencies

| Doc / owner | This doc needs | This doc provides |
|---|---|---|
| Day loop (`design/gdd/day-loop.md`) | Clock pause inside the wall; Sleep from Dusk; `HomeArrived(on_time/late/routed)`; Head Home ≤ 60 s; drowsy walk-home pre-flap | Home visit budgets (§3.6); the daily find as reset slot 2 |
| Camera (`design/gdd/camera-system.md`) | Cat-height home state 0.3–0.6 m; lower-and-tighten at the wall; authored vignette shots; ≤ 4 s control loss | Storyboards §3.8 |
| Combat | Consumes `BondChanged` → Well-Fed | Bond hearts (F3) |
| Crew | Hige's stats, personality and recruit timing (≈ 0:08–0:10) | Hige's name and voice |
| Nemesis | Reads `mikan_plastered`, `evenings_home` / `nights_out`; X6 bark rule | Plaster tag; routine tags |
| Territory / Economy | Doorstep and Stash placement; Gift curio placement (with Level) | No food into the house before Life 8 |
| UX | Sense Icon and tone-puff look; home pause (Mikan tab + Options); Doorstep as only HUD | Icon vocabulary; Knees/Interact prompts |
| Audio, Art | §8 requirements | Rulebook §3.1 |
| Accessibility | Call glyph, bell glint, lamp wave, ear icon; haptics | Muted Tier A test |
| Events | `KeystonePlayed(keystone_id, life, slot)` emitted; consumes `PhaseChanged`, `DayEnded`, `LifeAdvanced`, `DistrictClaimed` (Life-end check only) | — |

---

## 7. Tuning Knobs

| Knob | Default | Range |
|---|---|---|
| `day_gate` per vignette | §3.3 table | ±1 day |
| `life_min_days` | L1 2 · L2 4 | 2–3 · 4–5 |
| Max control loss per vignette shot | 4 s | 2–6 s |
| Wake → door, no vignette | ≤ 15 s | 10–20 s |
| Evening home median | ≤ 2 min | 1.5–2.5 |
| Goodbye reach radius | 1.5 m | 1–3 m |
| Second-Goodbye frequency | 1 school morning in 2 | 1/3–2/3 |
| Calls before nose two-step (K1.3) | 3 | 2–4 |
| `lap_hold_s` | 3 s | 2–5 s |
| `comfort_hold_s` | 4 s | 3–6 s |
| Bond gains, cap, thresholds | F3 | F3 |
| Daily-find pool | 8 | 7–10 |
| Knock-reaction escalation (pencil cup moves) | 3 knocks | 2–5 |
| Sense Icon limits | 2 at once, 1 event/vignette | — |

---

## 8. Requirements Handed to Other Departments (slice)

**Art**
- House set (5 spaces) at cat-height fidelity: **the undersides of tables, feet, slippers, doorways**. The upright piano with lid states (shut / open / score stand). The Alcove with photo, incense cup and rin.
- Persistent props: the saucer; **the blue-and-white Bowl with a chip state**; the Box (fresh / taped); the Gift Jar (0–3 curios); the suitcase (empty → 3 items); the crumpled ball; the flap; the envelope flap; study lamp; Veranda Lamp on/off.
- Haru 16–18: yellow raincoat, socks, cardigan, school uniform; face model for 3 face events; signature skid gait and two-finger hand set. Gran: plum slippers that plant, sleeves, hands; face rarely.
- **Home Scent** look: four freshness steps; plum + incense braid; Haru's yellow.
- Sense Icons including the four **tone puffs**; the Call glyph (three smooth yellow arcs); the bell glint; the **Dusk lamp wave** (windows light uphill with the chime; the Veranda Lamp visible from any High Road).
- **Plaster = Scar-kit head plaster asset.**
- Home scale: cats read correctly in a 16-year-old's lap and on a piano bench (Art sets the scale rule).
- Composition rule: no inside-looking-out veranda-to-garden key art with a pet in the yard.

**Audio**
- **The Piece**: Haru's diegetic piano piece, built from her Melody line, **never containing the Call cell**. Versions: hummed opening (K1.1); practice with the stall at one bar (3 takes); through-the-walls versions for M1 (3 seasons); played through, clumsy (K2.5). A bass-under-cat duet stem.
- The piano verb: key samples quantised to the home key, Call cell masked.
- The Call (Haru, 16–18): K1.3 first and second sings; the daily Dusk Call one bar after the chime; the bell on the fourth beat.
- Ritual sounds: cupboard and kibble rattle (cat-loud), Tap-Tap on ceramic, bell on the stroke, rin strike, lamp click, door-slot envelope, saw rasp, the second-Goodbye door bang and sock skid.
- Murmur: Haru (16–18) and Gran; intents covering warm, sharp, pleading, gruff, bright, wet laugh, and **silence** for K2.2. Household actors are closed-mouth. Never comic.
- Home Scent tones: one sustained note per human (Haru, Gran) × 4 freshness steps.
- Home music: home theme entry at the K1.3 Lamp; the Dusk bleed; the Life 1→2 montage cue. All inside the slice's ≤ 25 min.

**UX**
- No HUD inside the wall except the Doorstep Sniff; home pause shows only the Mikan tab and Options. The Fence Line is never shown in the house.
- Contextual Interact prompts at home are icon-only (Knees, Eat, Sleep spot), never human-event text.
- Onboarding beats at home: Eat (K1.3), Knock (K1.3), Whisker Sense in the house (first evening find, L1 day 2), Gift (K2.1), Comfort (K2.2), piano (T2.2).
- The Call glyph is always on; the ear icon marks off-screen home sounds; haptics are on by default for the bell and Tap-Tap.
- Opt-in content note in Options only (Backlog wording).

---

## 9. Acceptance Criteria

1. **Day-gating:** with turf frozen at 0 Patches, every slice vignette except Life-end still plays on its `day_gate`. No vignette's trigger references turf. *(automated: state-machine test)*
2. **Life end:** Life 1 never ends before day 2 and Life 2 never before day 4, whatever the turf pace; both end at the first sleep satisfying F2. *(automated)*
3. **Muted Tier A:** every slice Keystone's Tier A fact is stated by ≥ 90% of unbriefed testers with audio off (DR-03). *(playtest)*
4. **Haru is a person:** at 2 h, ≥ 80% of testers name one specific, non-milestone thing Haru does (e.g. late, the piano piece). *(playtest)*
5. **Not a reward:** no tester describes the home story as unlocked by beating Rivals or Bosses. *(post-play interview)*
6. **Home budget:** wake → door ≤ 15 s with no vignette (75th percentile); evening ≤ 2 min median; home ≈ 15% of day time. *(telemetry)*
7. **The home is played:** ≥ 70% of evenings home include the daily find; ≥ 50% of testers use the piano unprompted. *(telemetry)*
8. **First Call:** 100% of players experience K1.3 on Life 1 day 1, including after a wipe; no Call is heard before K1.3. *(automated + audit)*
9. **Language audit:** zero readable human text or intelligible words in the slice house and vignettes. *(audit)*
10. **Bond:** an attentive script reaches 4 hearts by slice end; Bond never decreases. *(automated)*
11. **Control:** no vignette removes control > 4 s at a time. *(audit)*

---

## Backlog (post-slice)

**Global / rulebook**
- DS-C3: full vocabulary table, including the Life 4 sock-on-sock romance idiom ×3, and the "black shoes = gone for good" row (K5.1).
- DS-C3.5 / DS-R6: the ring and white dress as Tier B only (ruled; content later).
- DS-C9.3 / DS-R8: content-note wording (opt-in, Options).
- Full House Memory and Echo prop states (the two Life 7 photos); the second Doorstep saucer for "Mikan's friends" (DS-C12).
- Full Sense Icon set (empty bowl, jagged burst, coral blob, paw).
- The Witness/Forensic dual staging for ≤ 1 evening Keystone per Life from Life 3 on; ≥ 70% morning rule audit.

**Life 3** — K3.1, K3.2 (the phone carries the complete Call), K3.3, K3.5; Gran's three taps in the Call's rhythm and one hum (DS-X10, SB-P12); Home Scent fading and flooding back.
**Life 4** — K4.2–K4.5 (K4.1 folded); Sora, teal, whistles the Call and never sings (DS-X7, SB-P17); the lap war; K4.5 storyboard "The Small Box" with Nose-Touch input at home, bat cap 2 (DS-C11).
**Life 5** — K5.1 **Black Shoes** (DR-26; DS-C3), K5.3, K5.5; Haru's parents' shoes at K5.5, once (DS-C12); the home vacuum as a Texture prop (SB-P18).
**Life 6** — K6.1, K6.2 (the fast exit at night, with joy), K6.3, K6.5; the Guard verb; Koharu.
**Life 7** — K7.1, K7.3, K7.5; four Textures (protected; DS-C9.2); the Fireworks; Botan's inverted Call (SB-P16).
**Life 8** — full spec to DR-27 (§3.2 framing). Carries and escort numbers (DS-C2, R3); Sleep-from-Dusk in the wait and the Stash fail-safe (DS-C7); Life 8 difficulty assist; the Season Turn on the Doorstep and the hero image (Carry 3 at Sora's foot, Crew on the wall; DS-C8); Koharu's pathos cap of 4; storyboard "First Morning" with its fixes (DS-C11); yellow and shoe rules (DS-X4, X5: her shoes never return, the slippers go to the shelf, no fresh yellow flowers); music return on pick-up and set-down (DS-X8, SB-N1–N4); the incomplete-Call reservation (DS-X9); Season-Turn decay (DS-X14); comprehension staircase (worry at K8.4, knowledge at K8.6).
**Life 9** — K9.1, K9.3, K9.5; systemic Boss farewells; Koharu plays the Piece haltingly; the ending (DS-R5 / E-3: default, Mikan is alive in the morning; the last sound is the bell).
**Montages** — 2→3 through 7→8 (no montage before Life 8; Stage A instead).
**Cuts confirmed** — Sightings; essential-cut and montage-insert forms; Waiting-up vignettes (now the Late lamp state); Echo vignettes (prop states).

---

## Revision Log

**2026-11-23 — Round 2 (fresh slice rewrite; archived draft at `design/backlog/first-drafts/`).**

| ID | Status | How / why |
|---|---|---|
| DS-C1 | FIXED | Day gates only; Life-end rule F2 with `life_min_days` 2/4 per DR-21 (the critic's 3/5 replaced by the ruled values); `turf_gate`, Rule 7 and compressed forms deleted |
| DS-C2 | BACKLOG | Carries framed as ruled in §3.2 (DR-27); detail post-slice |
| DS-C3 | FIXED (Life 1 part) / BACKLOG | T1.1 Grandpa's Photo added. K5.1, sock idiom, criterion move and ring are Backlog |
| DS-C4 | FIXED | Always late (T2.1, Routine second Goodbye, loafers askew); the upright piano and the Piece (K1.1 hum, T2.2, K2.5); Haru profile §3.7 |
| DS-C5 | FIXED | Daily find (§3.6) fills the Bond find slot; 2 Lane curios + cicada shell; morning Feeding auto-resolves; piano as play. The critic's 3–5 curios per district reduced to 2 per DR-23 |
| DS-C6 | FIXED | 11 slice vignettes per DR-01; full game as a one-page framing |
| DS-C7 | BACKLOG | Sleep-from-Dusk in the wait is in the framing (DR-27); rest post-slice |
| DS-C8 | BACKLOG | Season Turn outside and Koharu's cap are in the framing; hero image post-slice |
| DS-C9 | BACKLOG / REJECTED in part | Stage A is 2 days, not 3 (DR-27); Life 7 Textures and content note Backlog |
| DS-C10 | REJECTED | Superseded by DR-48: one third-person camera; lower-and-tighten at the wall only |
| DS-C11 | FIXED (slice) / BACKLOG | Storyboard A rebuilt for the third-person camera (no free-control camera drop; Call heard from the lane); "A Tuesday in Life 2" added. 12.2 and 12.3 fixes Backlog |
| DS-C12 | FIXED (slice) / BACKLOG | Plaster = Scar-kit asset and barkable; Knock disabled in Comfort and tender beats (and in L8 B–D); question-mark icon sanctioned. Gran's taps, the second saucer, parents and flowers Backlog |
| DS-X1 | REJECTED | DR-48 |
| DS-X2, X4, X5, X7–X11, X13, X14 | BACKLOG | Life 3–8 content |
| DS-X3 | FIXED | Saucer on day 1; blue-and-white Bowl from K1.3, chipped by Mikan; same Bowl all game |
| DS-X6 | FIXED | Loafers and plum sandals; rain boots day 1 only; the Box below the step, then beside Gran's cushion at K1.4 |
| DS-X12 | FIXED | 11 vignettes |
| DS-R1 | FIXED | As DR-21 |
| DS-R2 | REJECTED | DR-48 |
| DS-R3 | BACKLOG | Ruled in DR-27; framed in §3.2 |
| DS-R4 | REJECTED | DR-27: Stage A is 2 days |
| DS-R5, R8 | BACKLOG | E-3 and E-6 defaults noted |
| DS-R6, R7 | FIXED | Recorded in §3.1 sanctioned exceptions (DR-55) |
| DS-R9 | FIXED | Koharu's third note is canon in the Life 8 framing |
| PP-01 | FIXED | K1.1 hum is the Piece's opening, not the Call; the first Call is K1.3 (AC 8) |
| PP-02 | FIXED | The clock pauses inside the wall, garden included (§3.5) |
| PP-06 | FIXED | A Life 1 wipe jumps to Dusk; K1.3/K1.4 play normally; nothing lost (§3.6) |
| PP-10 | FIXED | Life 1 min 2 days, Life 2 min 4, independent of turf pace |
| DR-23 rin | FIXED | The rin is struck once in every Alcove morning ritual from Life 1 |
| DR-53/54 | FIXED | Fourth beat, Call glyph, lamp wave, tone puffs replace Murmur Ribbons |
| Cut list (Sightings, Waiting-up, Echo vignettes, compressed forms) | FIXED | Cut or converted to prop states |

# Sound Bible: Cat RPG (working title)

> **Location**: `design/audio/sound-bible.md` (not `design/gdd/`)
> **Owned By**: audio-director · **Version**: round 2, vertical slice · **Date**: 2026-11-23
> **Canon**: `design/creative-brief.md` v1.2, then `design/reviews/round-1/director-rulings.md` (DR-nn). Where this doc and canon disagree, canon wins and this doc is wrong.
> **Scope**: the vertical slice (DR-01): Lives 1–2, Hidamari Lane, Haru's House, the Lot, ≈ 2–2.5 h, **≤ 25 min music**. The full game appears only as framing (§3.1) and in the Backlog. The archived first draft (`design/backlog/first-drafts/sound-bible.md`) is reference and content backlog.

**Ownership boundary.** Audio owns music and the Call system, instruments, Murmur, cat vocals and the 8 bark intents per voice body, the combat mix mapped to the tier table, adaptive music and scent sonification (brief §6). Audio does **not** own story beats (Narrative), combat timings or tier values (Combat, DR-07), bark triggers and lines (Nemesis/Narrative), or the visual carriers for deaf/HoH parity (UX owns the mechanism, Art draws the carriers, DR-54). Where this doc needs one of those, it cites it.

---

## 1. Audio Vision

### 1.1 Sonic Identity

The game has **two sound worlds and one thread between them**.

- **The Street** is a Showa-era gangster picture scored for brass, taiko and shamisen, played completely straight about animals that weigh four kilograms. Stylised, loud, rhythmic, funny. Hits land like cannon fire.
- **The House** is a chamber room: an upright piano, a reed organ, a wall clock, a human voice heard through its chest. Naturalistic, close, quiet, never ironic.
- **The thread** is the **Call** (three sung notes, rise a third, fall a fifth) and the small brass **bell** on Mikan's collar. The bell goes everywhere Mikan goes; the Call reaches everywhere Mikan is.

Test: eyes closed, the player knows within one second whether they are a boss or a pet.

### 1.2 Audio Pillars

1. **Music is the translator.** The cat cannot understand speech, so Haru's life reaches the player through staging and music. Every home cue must answer: *what does the player now know that they did not before?* If nothing, it is silence.
2. **Heard from 25 centimetres.** The listener is Mikan. The mix follows what a cat cares about: a bowl three rooms away outranks the television; a footstep is an event; a human sentence is weather.
3. **A kilogram of cat, a tonne of sound.** Combat audio is maximalist, locked to Combat's hit-stop tiers, and readable: one full-spectrum event at a time.
4. **Every cat has a voice you would know in the dark.** Voice, bark attitude and a personal yowl-sting carry a Rival's history.
5. **Teach the hole before you dig it.** Every absence the full game will use (the missing Call, the missing Melody) is taught in the slice as an *ordinary* absence that is filled the same evening.

### 1.3 Against the game pillars

| Pillar | What audio contributes in the slice | Gap or risk |
|---|---|---|
| **1. Cat's-Eye Truth** | Murmur makes all human speech tone-only (§6). Listener at cat height; salience mix (§10); Whisker Sense and Home Scent sonification make hearing a cat sense (§9). The Call is wordless, so it survives renaming Mikan. | Murmur can only be tested, never proven word-free (§6.4). The score itself is the player's translation layer, not Mikan's perception; accepted openly. |
| **2. Two Lives, One Clock** | The chime-then-Call ritual pulls the player home every Dusk (§5.3). The home loop is the sum of who is in the house (§3.3); the Melody leaves with Haru and returns with her (§4.4). The wall clock ticks inside the paused house. | If the Call is not heard, the pull fails; the visual twins (§11) are load-bearing, not optional. |
| **3. Conduct the Brawl** | Tier-mapped impacts bound to hit-stop scope (§7.1); telegraph vocals by class; per-cat voices inside the Pile-On ("my four cats"); Tag-In strikes with Style sounds. | Ten combatants, three damage types and music is a density problem; only the combat prototype (DR-02) proves the mix. |
| **4. Rivals Remember** | 8 bark intents per voice body give the one sharp line an attitude (§8.3). A personal yowl-sting per Rival, with 4 slice states (§8.4). Recruits keep voice and sting; the sting gains the bell. | Only 2 generic Rival voice bodies in the slice (DR-01). Honest distinctness ≈ 8–10 voices; enough for ≤ 12 tracked cats only with the district distance rule (§8.2). |

### 1.4 Reference Games / Media

| Reference | Take | Avoid |
|---|---|---|
| *Up* (opening montage) | One theme re-orchestrated as biography | Its sweetness; our home loop must survive 60+ mornings |
| *Peter and the Wolf* | One instrument per person | Peanuts' comic "wah-wah" adults: Murmur must carry grief |
| Final Fantasy VII Remake | Exploration-to-battle arrangements of one theme; clarity in tactical slow-motion | Six-minute battle tracks; our median fight is under a minute |
| 1960s–70s Japanese crime-film scores; chindon'ya street bands | Brass stabs, surf guitar, swagger | Quoting any existing theme; all melodies original |
| Stray | Cat foley and vocal recording quality | Synthetic score; ours is acoustic |
| Japanese municipal evening chimes | A whole town hearing one melody that means "go home" | Any real chime melody |

---

## 2. Music Direction

### 2.1 Style and Genre

| World | Style | Tempo | Harmony | Recording |
|---|---|---|---|---|
| **House** | Chamber music, 1–3 players; lullaby, hymn, waltz idioms | 56–84 BPM, rubato | Diatonic, C major centre | Close-miked, dry small room; pedal, key and bellows noise audible |
| **Street, roaming** | Showa small band: melodica, nylon guitar, clarinet, shamisen, upright bass, brushes; Lane colour instrument: **accordion** | 72–88 BPM | Pentatonic, blues-inflected; keys restricted to C, G, F major / A, E, D minor so the Call always sounds at pitch | Tight, "tape" colour |
| **Street, brawl** | Brass (2 tpt, 2 tbn, bari sax, tuba) + taiko (ō-daiko, shime, atarigane), tsugaru shamisen, surf guitar, kit | 144–176 BPM (double-time of roaming) | Riff-based, stabs on chord tones | Big, bright, compressed; the only place the full ceiling is used |
| **Street, Night** | The Lane theme as a nocturne: upright bass, vibraphone, muted trumpet, shakuhachi breath. "The town belongs to cats." Bright moon-blue, not menace | Same tempo map | Darker voicings | More room |

### 2.2 Instrumentation Palette and the Reserved Timbre Rule

Certain timbres mean one thing and are **never** used for anything else, anywhere, including menus and trailers. This is how a wordless story becomes legible by ear.

| Reserved timbre | Belongs to | Colour (Art) | Slice? |
|---|---|---|---|
| **Solo human voice, sung or hummed** (wordless) | The Call; and a household member humming their own line in an authored home beat (K1.1) | the singer's | Yes |
| **Upright piano** (domestic, slightly imperfect; the real prop in the Main Room) | **Haru** | yellow | Yes |
| **Reed organ** (foot-pumped, audible bellows) | **Gran** | plum | Yes |
| **Small brass bell** (collar) | **Mikan** | bell-gold | Yes |
| **Cello** | Sora | teal | Backlog (Life 4) |
| **Toy piano** | Koharu | coral | Backlog (Life 6) |
| **Rin** (bowl-bell, low and long) | The Alcove ritual only | — | Yes (DR-52.15) |
| **Brass + taiko** | Combat | — | Never inside Haru's wall |
| **Hyōshigi** (wood clappers) | Standoff open, Verdict | — | Yes |

- **Core (Street)**: melodica, nylon guitar, clarinet, shamisen, upright/electric bass, brushed kit, vibraphone, bari sax, muted trumpet, accordion (Lane).
- **Accent**: atarigane, wood block, slide whistle and vibraslap (street slapstick only), shime rolls.
- **Avoid**: synths and electronic drums; choir; any sung lyric or scat syllable; solo violin; chiptune; **string tremolo** (it encroaches on the cello's family); any reserved timbre out of role. A composer who wants a piano on the street writes vibraphone or celesta.

### 2.3 Music Rules

1. **Reserved timbres are law** (§2.2).
2. **Home and Street do not mix inside one cue**, except the four sanctioned crossings (brief §9): the Dusk bleed (§5.3), the Brass Call (§3.2), the Life 8 carry pick-up and the Life 9 walk (both Backlog).
3. **No gag instrument inside the wall.** No slide whistle, vibraslap or cartoon percussion in Haru's House. Never undercut a home scene.
4. **Haru's piano never sounds in town**, except inside the Dusk bleed. Human Sightings on the street get no leitmotif.
5. **Roaming loops** 2:30–3:00 with a tail allowing 8–20 s of ambience-only before restart. **Home loops** 1:30 with a 10–30 s gap.
6. **Brawl music reaches full intensity within one beat** of the first hit.
7. **Transitions are bar- or beat-quantised**, except impacts, Slow Blink and anything on a player button, which are instant.
8. **Nothing musical plays over the Call.** All music ducks ≥ 9 dB for its length (§10.3).
9. **The complete sung Call is rationed**: the Dusk Call and authored home beats only. Never a UI sound, jingle, title or pickup. **The title screen never uses a sung Call** (DR-53).
10. **Paw ticks avoid the rising third**; no UI or combat sound may form the Call's first two notes (§7.2).
11. **All melodies are original.**
12. **Life 8 audit rule (rule now, content Backlog).** From the Life 8 phone call until Carry 3, neither Haru's voice nor her Melody may sound anywhere, systemic or authored (DR-27). Every systemic cue built in the slice declares its Life 8 state in §3.5, so no slice asset has to be reworked later.

---

## 3. The Leitmotif System

### 3.1 Whole-game design (framing; detail is Backlog)

The home theme is built from **four lines, one per human**. *Who is in the house decides which lines sound.* Non-musicians reliably hear two things: **which instrument**, and **whether the tune is there**. Every load-bearing device uses only those two.

| Line | Owner | Instrument | Function | Arc across nine Lives (one line each) |
|---|---|---|---|---|
| **Melody** | Haru | upright piano (and her voice for the Call) | The tune; opens with the Call, answered by a rising four-note phrase; 16 bars AABA | L1 hummed, then practised badly · L2 studied, stumbling · L3 absent except visits · L4–7 adult, fuller · **L8 removed** · L9 Koharu plays it, haltingly |
| **Foundation** | Gran | reed organ | Bass line and harmony, one note per bar, hymn-like | L1 bare fifths softening to triads · L3 the whole theme · L4 slower · from L5 carried by Sora's cello |
| **Countermelody** | Sora | cello | Inner voice, contrary motion | Enters wrong in L4; fits from K4.5. He whistles and hums the Call, never sings it |
| **Ornament** | Koharu | toy piano | High decoration from both parents' halves | Enters out of time in L6; never doubles the Melody's notes |

**Music-minus-one** (Life 8) is done by subtraction and interruption, never distortion: the home theme plays with the Melody deleted. It works only because the player has heard the hole **filled** many times: the Melody drops out when Haru is expected but not yet home, and enters when her key turns in the door. The slice teaches that idiom (§4.4). The Life 8 Dusk is the chime, a 1-bar gap, the bell alone (DR-53, Backlog cue).

**The Brass Call** is the Call's three-note cell in brass: Mikan's street theme. *Sung, it is a pet's name; in brass, a boss's theme.*

**Rivals** each own a 2-bar yowl-sting; **Bosses** own a theme. Daifuku is in the slice (§3.4); Madam Sabi, Oboro, Ikari and Botan (whose theme hides the inverted Call on celesta; no in-fight singer, DR-52.16) are Backlog.

### 3.2 Slice leitmotifs in full

| Motif | Exact content | First heard (slice) | Where else | Never |
|---|---|---|---|---|
| **The Call, Home form** | E4–G4–C4 (up a minor third, down a perfect fifth); short–short–long, a small scoop into the second note; one open vowel with a soft onset, or hummed; never syllables. Same absolute pitches for the whole game. | **K1.3 `first_call`** (day 1 Dusk) | Every Dusk (§5.3); the door on Late Home evenings (§4.4) | Title, naps, UI, combat, street cues (except the Brass Call) |
| **Haru's Melody** | 16-bar AABA on upright piano: the Call's three notes, answered by a rising four-note phrase (C–D–E–G, ending open). **It is the one piece Haru practises** (DR-23): diegetically she plays it badly at 16, with stumbles and restarts, so the player connects tune, prop and person. | K1.1: she **hums the answer phrase** (not the Call, DR-22) | Home loops; the practice piece; the Dusk bleed | The street; menus |
| **Gran's Foundation** | Reed organ, slow descending stepwise bass, one note per bar. Life 1: stern bare fifths with audible bellows; softens to full triads across Life 1, landing at K1.4. | First entry into the house (K1.1 tail) | Home loops; title; Sunspot naps | Combat |
| **The bell** | Brass collar bell, diegetic foley on animation (walk, trot, sprint, land, shake). Damped in Stalk and crouch. Reserved narrow band in the mix (§10.4). | K1.3 morning: the collar goes on; its first ring is the last note of that scene | **The fourth beat** (§5.3); the top note of every T5 and the Pile-On; Recruited stings | — |
| **The Brass Call** | The Call's cell as a syncopated riff over walking bass. Grows with Clout: **House Pet / Lane Cat** melodica + wood block · **Known Face** + bass, clarinet · **Boss** + bari sax, kit (slice ranks; three arrangements). | First Patch held (Low Wall Corner) | Patch claimed (2 s tag), Clout rank up, Lane claimed (8 s fanfare), head of the Lot theme | Inside the wall |
| **Yowl-stings** | Per Rival, generated (§8.4) | First Standoff with the First Thorn (day 1) | Standoff, Ambush, Fence Line focus, Morning Sniff, Gloat | Matching the Call's or its inversion's contour |
| **Daifuku's theme** | §3.4 | His first Standoff | Den open gesture | — |

### 3.3 Home arrangements in the slice

| Context | Lines | Notes |
|---|---|---|
| Life 1 home | Foundation (stern, softening) + Melody (light, one hand) | Two-person house |
| Life 2 home | Foundation (warm) + Melody (two hands, studied, slightly hurried) | One loop with Morning (bright, thin) and Evening (warm, lower) stem mixes |
| Haru out (school day, Late Home) | **Foundation alone** | The Melody stem is muted at the next phrase boundary; nothing replaces it |
| Haru present but asleep (Night arrival after the flap) | No music: clock, her breathing through the door | The Melody means *Haru awake and here* |
| Haru practising (diegetic) | Piano only, from the Main Room, spatialised | Home loop yields; the practice piece *is* the Melody |

### 3.4 Daifuku (slice Boss, 3 phases)

A sumo entrance that refuses to speed up: tuba, ō-daiko, a yawning trombone glissando, accordion. Signature gesture: **one ō-daiko hit and a tuba note a tritone below where you expect it** (plays across the Lane when the Den opens).

| Phase | Music |
|---|---|
| 1 · Seated on his wall | 80 BPM, will not double; the joke is that the music is as immovable as he is |
| 2 · He stands | Brawl double-time arrives on the phase-break T5 |
| 3 · At the edge (the bucket) | Full brass and taiko; his gesture as a riff; the knock-off into the bucket is a Splat with a Water Fear sting |

Phase breaks are T5 (Combat). A Pile-On that plays a phase break as its final beat carries the phase transition on that beat (DR-32).

### 3.5 Systemic cues that contain the Call cell or the Melody (Life 8 audit)

| Cue | Slice behaviour | Life 8 state (Backlog content, ruled now) |
|---|---|---|
| Title | Bell, wall clock, Foundation on reed organ. No sung Call, no Melody | Same in every Life |
| Sunspot nap (4 s quote) | Foundation phrase, never the Melody (DR-53) | Bell alone |
| End-of-Dusk / end-of-Night drowsiness | Low-pass closes; Foundation-only home loop fades up at −18 dB relative | Low-pass and room tone only; nothing fades up |
| Dusk Call | §5.3 | Chime, 1-bar gap, the bell alone; pedal fades after 8 bars |
| Dusk bleed | Home evening loop, spatialised from home | None |
| Home loops | §3.3 | Minus-one from the phone until Carry 3 |
| Piano verb (Mikan on the keys) | Single notes, filtered so no sequence forms the Call | Lid closed (Narrative to confirm) |
| Brass Call | §3.2 | Allowed (it is the cell, not her voice or Melody); thinner arrangement |
| Haru's Home Scent note | §9.2 | The only sound of her instrument permitted (DR-55) |

---

## 4. Slice Story Cues

Narrative owns the beats (DR-01: K1.1, K1.3, K1.4, K2.1, K2.2+K2.4 "Lamp at Night", K2.3, K2.5, 3 Textures, 1 montage). Audio owns how each one sounds. Each cue states what the player must come away knowing.

### 4.1 Keystones

| Cue ID | Beat | Content | The player now knows |
|---|---|---|---|
| `mus_story_k1_1_box` | K1.1 The Box | Rain on cardboard, shrine-step drip. A yellow raincoat bends in: **Haru hums the Melody's answer phrase**, close and breathy, unaccompanied. Darkness, heartbeat, rain on fabric. At the house, the reed organ exhales bare fifths (Gran). | A voice and a tune belong to the yellow one. The old one is stern. |
| `mus_story_k1_3_first_call` | K1.3 The Bell and the First Call | Morning: the collar's first ring ends the scene. **Dusk: the chime, one bar, then the first Call** from the veranda, unaccompanied, then the Feeding with the **Tap-Tap**, then the Melody enters on piano under the eating. Bell's fourth beat on the ear-turn. | *That song is me. It means come, and eat.* The most important teaching cue in the game; no other sound may compete with it. |
| `mus_story_k1_4_step` | K1.4 The Step (Closing) | Foundation in full triads for the first time; at the lap, the Melody joins it once, both lines complete. | The old one is mine too. |
| `mus_story_k2_1_shoes` | K2.1 School Shoes | Accent (≈ 15 s): Morning loop; the Goodbye; the Melody leaves with her (stem mute). At the first Tribute: Haru's shriek (Murmur), then **Gran's first laugh**, then the Foundation brightens one step. | She leaves every morning. |
| `mus_story_k2_2_lamp` | K2.2+K2.4 Lamp at Night | Part 1: the study lamp's buzz, page turns, the Melody practised in fragments on her desk (hummed under breath, piano silent). Part 2 (Exam Nerves): **music withdraws to a held silence**; no Murmur at all; only room tone, clock, a shaky breath. The piano returns softly **only when the player performs Comfort**. Gran's tea cup set down is the only other sound. | She is hurt and it is not her body. My comfort brings her back. |
| `mus_story_k2_3_flap` | K2.3 The Flap | Diegetic: saw rasp, sawdust, Gran's disapproving Murmur, hammer. A square of daylight; the Night theme's first bar heard *through the flap*, then cut as Mikan's head comes back in. | Night is out there now. |
| `mus_story_k2_5_envelope` | K2.5 The Envelope (Closing) | The envelope's slap through the door; Haru's trembling breath; then the **fullest Life 2 arrangement** (Melody and Foundation in full, fastest tempo of the slice) under the feast. **Cut to the Foundation alone** at the empty suitcase. Hold. Title card in silence, then the bell. | Something wonderful happened, and she is going. |

### 4.2 Textures and montage

| Cue ID | Beat | Content |
|---|---|---|
| `mus_story_tx_alcove` | Texture (Life 1): Gran's hand goes still at the Grandpa photo | Rin struck once; the Foundation stops mid-phrase; clock alone for 4 bars; resumes |
| `mus_story_tx_a` / `_b` | The two remaining Textures (Narrative names them) | ≤ 20 s accents on the home palette; no new motif |
| `mus_story_montage_1_2` | Montage Life 1 → 2 | The Melody played once through, getting better as seasons pass: the stumbles disappear. ≤ 60 s |

### 4.3 Routine-layer sounds that carry story

The Routine layer (Eat, Rub, Lap, Meow, Knock), the daily "What changed today?" find and the piano verb use the ritual table (§9.1). The daily find is led by a fresh Home Scent trail (§9.2).

### 4.4 Teaching the "Melody drops out when Haru is late" idiom (slice)

The full game's Life 8 loss lands only if the player has learned, by ear, that **the Melody's absence means "she is not home yet, and she will come"**. The slice teaches it in three escalating steps, each resolved within minutes:

| Step | When | What is heard | What fills the hole |
|---|---|---|---|
| 1 · Leaving | Every morning Goodbye (from K2.1) | The Melody stem mutes at the next phrase boundary as the door shuts; Foundation continues | **The second Goodbye** (she is always late, DR-23): running feet, door, a forgotten thing grabbed; the Melody returns for one phrase, then leaves again |
| 2 · Out all day | Any daytime return home in Life 2 | Foundation alone | Her return at Dusk (the Call) |
| 3 · **Late Home** | Life 2 day 3, fixed; repeats once on a later non-Keystone day if the Life runs ≥ 5 days. Never on a Keystone or Closing evening. A Routine variant, not an extra vignette. | Dusk: **the chime, a 1-bar gap, no Call**. Mikan's ear-turn still fires and the **bell rings into the empty slot**. The Lane's Dusk drift reaches its G pedal and waits. If Mikan goes home: Gran fills the Bowl (overfull, no Tap-Tap, a grunt); the home loop is **Foundation alone**; the Veranda Lamp is dark. | At Dusk + 2:30: **her key in the door** (an S0 sound), running feet, the lamp cord click. The Melody enters at the next phrase boundary and she sings the Call **close, at the door, unducked**. If Mikan is still on the street, the Call sounds late from the house at Dusk + 2:30 and the normal bleed follows. Either way, the hole is filled. |

This is the "chime, gap, bell alone" image of the Life 8 Dusk, taught at zero stakes. Life 8 then reuses every element unchanged, and the entrance never comes.

---

## 5. Adaptive Music for the Slice

### 5.1 Structure

Horizontal re-sequencing between states, vertical stems within a state. One Lane theme family (roam Day, Night nocturne, scuffle stems, brawl arrangement) shares key and phrase length so every transition is a phrase-boundary crossfade. Combat timings are Combat's; music states read Combat's events (§12).

### 5.2 Day phases (4 real minutes each; driven by `PhaseChanged`)

| Phase | Stems | Character | Diegetic markers |
|---|---|---|---|
| **Morning** | Lead + harmony; rhythm enters after ≈ 60 s | Bright, thin, airy | Birds, shutters, a delivery bicycle |
| **Day** | Full Day family | Fullest roaming mix; humans loud | Laundry poles, a school chime (original) |
| **Dusk** | Rhythm thins, voicings drop an octave, lead half as often; drifts to a **G pedal** by Dusk + 2:00 | Golden, slower-feeling at the same tempo | The **Yunagi chime**; cooking; the bowl |
| **Night** (from the cat flap) | Nocturne arrangement (stem remix of the Day family plus vibraphone and muted-trumpet stems) | Wide, quiet, detailed; cat vocals carry far | Crickets, electrical hum, far yowls |

Phase transitions: 8-bar crossfade on the next phrase boundary. Sunspot nap: 4 s Foundation quote, then resume at the new mix position.

### 5.3 The Dusk pull home (the main mechanical job of the music)

| Time into Dusk | Event |
|---|---|
| 0:00 | **The Yunagi chime**: original 8-bar melody (≈ 14 s) from the public loudspeakers, band-limited, echoing between hills. Its last note is a held **G**, the Call's upper note, left hanging. **Visual twin: the lamp wave** (§11). |
| chime + 1 bar (≈ 3 s) | **The Call**, sung by Haru, from the true direction of Haru's House, on the salience curve (faint but clear anywhere in the Lane). All music ducks 9 dB. It starts on E, passes through the chime's G and lands on C: it resolves what the chime left open. The **Head Home** thread appears (DR-17). |
| downbeat after the Call's last note | **The bell's fourth beat**: Mikan's ear-turn ends in a head-shake that rings the collar bell. Call: short–short–long. Bell: one. Visual twin: a bell-gold glint. |
| after the Call | **Bleed**: the Life's home evening loop fades in under the Lane music, spatialised from home: −24 dB at the far edge of the Lane, crossfading to full at the garden wall (the Lane is ≤ 60 s from home). |
| 2:30 (if Mikan is not inside the wall) | One optional repeat of the Call. |
| 4:00, **before the cat flap only** | A final Call at the end of Dusk, then the 1-minute drowsy grace (low-pass closes; §3.5), then Head Home walks Mikan home (DR-15). |
| 4:00, after the flap | No final Call. The bleed fades; the Night arrangement comes in. Staying out is never scolded: no ticking, no alarm. |
| Crossing the garden wall | Street music gone within 2 bars. Door, the Feeding, the evening loop. |

**Late Home** (§4.4) replaces the Call slot with silence and the lone bell, and moves the Call to the door at Dusk + 2:30.

### 5.4 Explore → tension → combat

| State | Trigger | Music | In | Out |
|---|---|---|---|---|
| **Roam** | Default | Phase mix (§5.2) | — | — |
| **Prowl** | Whisker Sense held, or an unaware hostile within ≈ 15 m | Lead and harmony −6 dB and low-passed; heartbeat-tempo bass pulse and brushed shime enter; scent tones audible (§9.3) | Instant on button | 400 ms on release |
| **Stalk** (Ambush possible) | On the High Road above, or behind, an unaware target | Prowl + a held accordion drone rising a semitone every 2 s (max 3); bell damped | 1 beat | Resolves into the Ambush hit, or deflates with an exhale |
| **Standoff** | `EncounterStarted`, opener `standoff` | Two hyōshigi clacks; music cuts to its bass note; the Rival's yowl-sting plays (fits the 2–4 s Standoff). Skipped: sting truncates to its last beat. A memory-citing line holds its 1 s unskippable window over the bass note. | Instant | Brawl enters on the bar after the sting |
| **Scuffle** | ≤ 3 Strays, Toughs or crows | Roam theme **continues**; double-time brawl percussion and bass stems added; no theme restart; 1-bar button at the end | ≤ 1 beat | 1 bar |
| **Brawl** | 4–6 enemies, or a Captain | Full Lane brawl arrangement; a Nemesis or Captain quotes its sting inside it | ≤ 1 beat, masked by the first impact | Outcome sting, 2-bar return |
| **Named** | Daifuku | §3.4 | After the sting | Outcome sting, Verdict vamp |
| **Verdict** | Rival held for the Verdict | Suspended chord, low brushed taiko roll | On Rout | Per-Verdict resolution (§8.5) |

Why tiers: a Tough falls in 6–10 s (DR-31). A full battle-track switch every half-minute is the fastest route to muted music; only fights that matter get "battle music".

- **`ambush_by_player`**: the opener is Combat's Ambush event; audio adds a cymbal choke on it and brawl layers on the next beat.
- **`ambush_by_rival`**: the Rival's sting is compressed to exactly **2.0 s**, played from off-screen at the Rival's position (DR-36). Bar 1 is the sting head; the **final 0.75 s is a held last note over a shime roll**, a rhythmic change that marks the Skitter/Brace counter window by ear. A player who knows that voice can react.
- **`raid_defence`**: the Caterwaul (§9.4) is the intro.

### 5.5 In-combat music states

| Moment | Audio (Combat owns that the cue exists and its timing; Audio owns timbre) |
|---|---|
| **Slow Blink** (time 5%) | Music does not slow. Music bus low-passes and drops ≈ 8 dB; a 60 BPM purr-pulse fades in; world SFX pitched down an octave with long tails; UI and command sounds dry and full. Entry: a **falling two-note figure** (felt mallet on a low bell). Entry on the frame of the press; exit opens in 100 ms on the Move's first frame. |
| **Paw filled** | One bell-gold tick, **pitched per Posse slot**: Mikan C5, Crew 1 D5, Crew 2 A4, Crew 3 C6. E and G are excluded, so no two ticks form the Call's rising third. Never ducked. |
| **Ruffled** | Dry shaker bristle on the target, looping for Combat's Ruffled window |
| **Frazzled** | Cymbal swell at the break, then a taiko roll that ticks on the beat across Combat's Frazzled window; brass and bass drop out. The Pile-On interrupts it, which is correct. |
| **Fed Up** (75 s) | One brass "enough" figure; behaviour is Combat's |
| **Win** | 2–3 s outcome sting resolving to the roaming key |
| **Loss** (Posse wipe) | A deflating muted-trombone slide and one bell. Comic, never tragic. Then the victor's **Gloat** (≤ 3 s): its sting in the Triumphant state. |
| **Fled** | Scurry foley; music snaps to Roam with a cheeky clarinet turn |

---

## 6. Human Speech: Murmur (the language rule, brief §5.6)

### 6.1 Hard constraints

No human utterance is ever intelligible: no subtitle, no source text, in trailers too; diegetic media (radio, school chime announcements) included. Murmur carries **identity, emotion and speech act**, and withholds **lexical content**. Mikan's understanding is shown by **tone Sense Icons over Mikan**; Murmur Ribbons are cut (DR-54).

### 6.2 Method

1. **Household voices (Haru 16–18, Gran)**: performed **closed-mouth from intent cards**, never from a script, and with **no source speech at all**. A card gives situation, speech act, emotion and length ("pleading, hopeful, 3 s, ends rising"). Allowed: nasals (m, n, ng), a neutral central vowel that never fully opens, glides, breath, voice-quality changes, laughs, sighs, gasps, yawns, a kiss-click to call a cat. Forbidden: plosives, fricatives, sibilants, clear vowel contrasts, consonant–vowel alternation at syllable rate.
2. **Street humans and crowd beds**: prosody transfer (pitch and loudness contour of an improvised take resynthesised onto a hum bank). **Each bed draws on a pool of ≥ 3 source languages, none dominant** (DR-53), so no bed reads as garbled Japanese. No source audio containing words ever ships.
3. **Process chain**: gentle low-pass 2.5–4 kHz (voices from above), formant smoothing, light chest boost, room placement. Mild: the warmth must survive.
4. **From a cat's position**: standing humans filtered and slightly behind their footsteps; a face bent to cat height opens up (dry, close, rare, "like sunlight"); in a lap the voice is heard through the body with heartbeat and breath.
5. **Never comic.** No Murmur is exaggerated for comedy, ever. Street comedy comes from situation and SFX (a broom whoosh, sandals), never a funny human voice. No stock "scolding shopkeeper" contour.

| Speaker | Range | Tempo | Signature | Tell |
|---|---|---|---|---|
| Haru (16–18) | A3–E5 | quick, light | phrases end rising, then drop | laughs through her nose |
| Gran | G3–C5, narrow | slow, pauses | falling steps, like her Foundation | a tongue-free exhale in place of a "tsk" |
| Street archetypes (3) | per archetype | — | multi-language beds | — |

### 6.3 Reserved contour

The Call's contour (up a third, down a fifth, short–short–long) never occurs in Murmur.

### 6.4 Safety gates (every shipped Murmur asset)

| Gate | Method | Fail |
|---|---|---|
| Inventory lint | Automated check for plosive/fricative bursts and 4–8 Hz syllable-rate modulation with formant movement | Any clip over threshold |
| Machine listening | Multilingual speech recognition and language ID, all shipped languages plus a wider set | A confident transcription or language ID |
| Human panel | Native listeners of every shipped language **and Japanese**; two questions: "Did you hear a word?" and **"Does any of this sound like an imitation or parody of a real language or accent?"** | Two listeners report the same word, or two parody flags → re-record |
| Ban list | Conventional meaning-bearing tokens ("mm-hm"/"uh-uh" and their Japanese nasal equivalents, "uh-oh", disapproval clicks, "shh"), **and sing-song contour patterns that read as tonal-language caricature** | Any match |

---

## 7. Combat SFX (mapped onto Combat's tiers)

### 7.1 Tier mapping

**Combat owns the tier table** (DR-07: events, hit-stop, shake, impact frame, lettering per tier). Audio does not restate those values; it maps layers onto the same six tiers and binds its freeze to Combat's **hit-stop scope**.

| Tier | Audio layers | Freeze binding |
|---|---|---|
| **T0** | Whiff, prop tick or blocked thud; no body layer | None |
| **T1** | Transient + short body by damage type | Local: the impact layer holds for the hit-stop |
| **T2** | T1 + Style effort vocal + a mid "crack"; Splat adds a wet-free cartoon splat | Local |
| **T3** | T2 + harmonic stab in the current music key (brass/taiko), music −4 dB | Local; music not held |
| **T4** | T3 + tutti stab, no bell; everything else ducks | **Global**: music bus and ambience also hold for the hit-stop |
| **T5** | T4 + full brass-and-taiko hit with the **collar bell as top note**; sub-bass owner | **Global** |

Rules:
- **Player-authorship rule mirrored**: AI-autonomous hits play one tier lower and never carry a stab.
- **Incoming hits** on the controlled cat use Combat's local incoming rule; audio adds an indignant yelp from that cat's voice body, never a pain sound.
- **Lettered onomatopoeia (T4/T5) has no voiced reading** (DR-49). The impact sound *is* the word; no voice ever speaks or sings it.
- **Damage-type bodies (slice)**: **Claw** = bright, dry, high transient, above 6 kHz · **Thump** = low, round, sub and taiko · **Yowl** = pitched vocal burst landing on a chord tone. (Fang is Backlog with the Prowler.) Each type keeps its lane (§10.4).
- **Harmonic stabs**: the 7 diatonic roots of the allowed keys × major/minor, T3 and T5 only. Prototype first.

### 7.2 Verbs and states

| Event | Sound |
|---|---|
| Attack string | Per Style: Scrapper staccato claw flurry on hit 3 · Bruiser grunt-thud knockback · Yowler short pitched cone |
| Pounce (incl. High Road) | Rising whoosh scaled to time aloft (Combat caps it), T2 landing |
| Hop · Skitter · Brace | Light paw scuff · a spit-and-scrabble (perfect Skitter adds a bright tick) · fur-puff and a low hold hum |
| **Hiss** | **Belongs to the acting cat only**: a per-Style hiss from that cat's voice body. A successful interrupt adds a **glass-crack sting** (T3). Never used as an enemy telegraph. |
| **Back Down** | The Tough's thin whine (the Backing-down bark intent), a scurry, dust puff (T4 per DR-07) |
| **Tag-In** | Whoosh across the stereo field from outgoing to incoming cat; the incoming cat's Style strike (T2). **Relay**: each consecutive tag raises the whoosh one scale step (never the Call's interval); a four-cat Relay ends on a brass rip. Bonded pairs add a shared chirp. |
| **Telegraphs** (by class, "distinct by rhythm, not only pitch") | **White (dodge)**: one short chuff · **Yellow (Hiss it)**: a rising growl in **two pulses**, length = windup · **Red (get out)**: a sustained rising yowl in **three pulses** plus a mid-frequency ground rumble (never sub-only) |
| **Fears** (`FearTriggered`) | Universal: a shamisen screech glissando + the cat's own shriek. Then: **Water/bucket** slosh and splash · **Loud Noise/scooter horn** a two-tone toot (the horn is diegetic) · **Cucumber/ledge junk** a vegetable thunk and a vibraslap |
| **Statuses** | Soggy: drips on each step · Cowed: a flat, muffled vocal colour · Fired Up: a brighter, faster effort layer |
| **Rout** | Dust puff, receding bolt yelp panned off-screen. Posse cat Routed: its voice leaves the music's off-beat chirps. |
| **Knock-off** | Scrabble at the edge, a falling yowl, Splat (Boss: Ruffled, DR-32) |

### 7.3 Pile-On and Zoomies

| Event | Sound |
|---|---|
| **Quick Pile-On** (two-cat) | War-cry dyad from the two cats' voice bodies; a short dust-cloud scuffle (wood block, atarigane, slide whistle, sped-up yowls, glockenspiel stars); final T5. Fits Combat's Quick duration. |
| **Full Pile-On** | Unison war-cry chord on the Brass Call cell; **four beats, one per participating cat, each a T3 hit carrying that cat's own voice-body yelp and its Style effort**, so the player hears "my four cats" inside the cloud; music mutes (the cloud is the music); final T5 lands on the camera's cut-out with the bell on top. Shake on the beats only (Combat). |
| **Zoomies** (3 Style Zoomies) | Per-cat vocal trill + rising brass rip; a 4-bar turbo passage per Style looped to Combat's duration. Other Moves' sweeteners suppressed for its duration (one screen-wide effect at a time). |

---

## 8. Cat Vocal Vocabulary

### 8.1 Principles

Cats are animals, not characters doing voices: recorded cats first, human imitators second, processed into consistent **voice bodies**. No words, no syllable babble. **No pain sounds**: hit reactions are indignation (yelp, spit, "mrrp!"). A cat-speech balloon sits over **one vocal gesture, 0.3–1.2 s**, chosen by bark intent; the vocal does not track the text's length. **Fight barks are icon-only** (DR-44), so in fights the vocal carries the attitude alone.

### 8.2 Voice bodies in the slice

| Body | Used by | Notes |
|---|---|---|
| **Mikan A (kitten)** | Life 1 | High, squeaky, meows too long for the body; 12 classes |
| **Mikan B (young adult)** | Life 2 | A confident short "mrah"; 16 classes. Home-only: greeting trill when running to the Call, kneading purr, door-meow |
| **Daifuku** (authored) | Boss | Very low, slow, yawning; a sitting sigh |
| **The old wall cat** (authored) | First story recruit | Dry, rasped, unhurried |
| **Generic body L** (low, chesty) | Rivals, Crew, Strays | Per-cat variation below |
| **Generic body H** (mid-high, bright) | Rivals, Crew, Strays | Per-cat variation below |

Per-cat variation, derived deterministically at load from existing schema fields (no schema change): `voice = f(hash(id), style, personality, scars)` → pitch offset ±4 semitones, formant ±12%, rasp 0–3 (+1 per silhouette Scar: Scars are audible), vibrato from personality, contour preference, chattiness from personality. **Distance rule** (request to Nemesis's generator): no two tracked Lane cats share a body *and* a pitch band.

### 8.3 The 8 bark intents (per voice body; DR-53)

Nemesis owns trigger → intent mapping; Narrative owns the line; Audio owns the gesture and how each personality performs it.

| Intent | Gesture | Typical trigger (Nemesis decides) |
|---|---|---|
| **Sneer** ("Collar!") | Clipped two-note mrow, falling. The rising-third/falling-fifth contour is banned. | `STANDOFF_FIRST`, taunts |
| **Gloat** | A trill into a laugh | Gloat, Lick In |
| **Fury / revenge** | A growl that breaks into a yowl | Memory-citing Standoff, Old Score, comeback |
| **Grudging respect** | Low closed-mouth chirp | Nose-Touch history, high Regard |
| **Backing down / fear** | Thin whine | Back Down, flee, Fear trigger aftermath |
| **Sulk** | Huff and sniff | Humbled resident |
| **Ally warning** | Chatter into a chirp | Crew calling a threat, Caterwaul lead-in |
| **Cold** | Flat, toneless meow | Betrayal (not reachable in the slice; recorded so the set is complete) |

**Rival attitude by personality** (performance colour on top of the intent; DR-37):

| Personality | Signature intents | Performance |
|---|---|---|
| **Braggart** | Sneer, Gloat | Loud, wide, slow release; chattiness 2× |
| **Brooder** | Fury | Low, held, few barks (0.5×); a long silence before Fury |
| **Schemer** | Sneer (near-whispered), Ally warning as Crew | Clipped, close, dry |
| **Fraidy** | Backing down, Ally warning | Thin, fast vibrato, rising contours |
| **Stalwart** | Grudging respect | Steady, no vibrato, falling contours |
| **Goofball** | Gloat (the trill-laugh) | Chirpy, broken contours, unexpected pitch leaps |

**Old Score**: both cats bark (Fury) when they meet; the ally's bark leads by one beat. **Combat classes** shared by all bodies: chirp/trill (Posse acknowledges a command), mrrp/yelp, spit, hiss, telegraph growl/yowl (§7.2), purr (Yowler heals), shriek (Fear), Frazzled warble, bolt yelp, war-cry.

### 8.4 Yowl-stings (personal 2-bar motif per Rival)

- **Grammar**: 2 bars at the Lane brawl tempo; 3–5 notes from the Lane's mode (major pentatonic); one of 12 rhythm cells chosen by personality; contour from the voice; performed by the cat's own pitch-mapped yowl samples doubled by accordion.
- **Uniqueness**: rejected if within an edit-distance threshold of another living Rival's sting, or if its first three notes match the Call's or its inversion's contour.
- **Slice states (4, generator parameters only)**: **Plain** (first met) · **Nemesis** (second voice an octave below, taiko pickup; quoted inside the brawl) · **Recruited** (last note resolves upward and **Mikan's bell strikes with it**) · **Triumphant** (up a fourth with a grace note; Gloat and Lick In).
- **Where**: Standoff; 2.0 s Ambush form (§5.4); Fence Line focus; Morning Sniff items; Gloat. A **sting contour glyph** appears on the name-card (DR-54).
- The First Thorn's sting is the same on day 1 and at the gatepost on day 2: the first audible proof that Rivals remember.

### 8.5 Verdicts (`VerdictApplied`)

| Verdict | Sound | Resolution of the Verdict vamp |
|---|---|---|
| **Chase Off** | Mikan's hiss-yowl; the loser's bolt yelp receding far (long tail) | Brass kick, cadence in key |
| **Humble** | The loser's Sulk; its sting with the last note bent flat; a small plop on the Undermark crate | A descending two-chord "bow" |
| **Recruit** | Chirp exchange; the Recruited sting with the bell | Major resolution on the Brass Call cell |
| **Nose-Touch** | Near-silence: two breaths, a tiny contact, two notes meeting in unison | No brass, no percussion: the quietest moment on the street |

---

## 9. Home Rituals, Scent and Territory Sounds

### 9.1 Ritual sounds (slice)

| Sound | Spec | Variants by person (slice) |
|---|---|---|
| **The Feeding** | Cupboard door, kibble rattle mixed loud for cat ears (S0), the Bowl set on its spot | Haru: correct · Gran: overfull, a grunt |
| **The Tap-Tap** | Two fingertips on the Bowl's ceramic rim, twice; dry, close, **S0 salience** (always audible over everything at home) | Haru: two taps · Gran: none. (Whole-game variants: Sora learns it in Life 6; Koharu's single tap; absent in Life 8; Sora twice at Carry 3: Backlog.) |
| **The stroke** | One long stroke down Mikan's back while eating, ringing the bell | Haru only |
| **The rin** | Struck once in **every Alcove morning ritual** from Life 1 (Gran in the slice). Low, long, bowl-like; tuned and filtered so it is never confusable with the collar bell (DR-52.15) | — |
| **The Veranda Lamp** | Cord click, a filament tick, a faint hum | Lit by Haru at Dusk; dark on Late Home evenings until her key turns |
| **Her key in the door** | Key, latch, sliding door, shoes off at the step. S0 salience | The sound that fills the hole (§4.4) |
| **The wall clock** | Tick loop, every room, every Life; it keeps going while the roaming clock is paused | — |
| **The Goodbye** | Shoes at the step, a Murmured goodbye, the door; the second Goodbye adds running feet | Haru |
| **Piano verb** | Mikan walking on the keys: single white-key notes by paw position, two dynamics; a filter refuses any three-note sequence matching the Call | — |
| **Gift curios** | Cicada shell: a papery tick; beetle: a click. **No food enters the house** (DR-23) | — |
| **The plaster** | Paper tear, a soft pat (after a loss, DR-19) | Haru |

### 9.2 Home Scent sonification

Each human's Home Scent is **one sustained note on their reserved instrument, never a melody**, heard while Whisker Sense is held at home. Level and brightness follow the 4 freshness steps (fresh, warm, faint, trace): fresh = full and bright; trace = barely audible, dull.

| Human | Note | Rendering |
|---|---|---|
| Haru | **E4** (the Call's first note) | Pedalled piano tone, softly re-struck every ≈ 4 s |
| Gran | C3 | Held reed-organ note with audible bellows |

The daily "What changed today?" find is reached by following a fresh trail, so the player learns "louder and brighter = nearer and newer". Whole-game: in Life 8, Haru's E4 is the only sound of her instrument permitted, fading day by day (DR-55, Backlog content).

### 9.3 Territory and Whisker Sense

| Event | Sound |
|---|---|
| **Clowder scent tones** (Whisker Sense) | Bell Clowder: a soft bell-timbre chord · Wall Sitters: an accordion drone. **Strength** = steadiness and brightness; **1–4 wisps** = 1–4 partials. Rival marks and the scent compass ring targets pulse from their true direction. Not available in combat. |
| **Spray** | (1) Tail-quiver: a rising shaker rattle · (2) **the pop**: a dry cork pop with a small pitched "poot" (8 variations + a rare "extra proud") · (3) sparkle cloud: a glittering chord on the bell timbre. Never liquid, never a hiss. |
| Spraying over a rival mark | The rival tone bends down and pops out; the bell chord replaces it |
| **Patch claimed** (`PatchChanged`) | 2 s Brass Call tag at the current Clout arrangement, bar-quantised |
| **Patch lost** | Witnessed: the raider's sting, rudely. Overnight: in the Morning Sniff. Never a tragic sting. |
| **Den opens** (3 of 4 outer Patches) | Daifuku's signature gesture, from the Den, across the Lane |
| **Lane claimed** (`DistrictClaimed`) | 8 s full Brass Call fanfare; every Crew cat in earshot joins a rising yowl chord |
| **Sentry posted** (Turf Board) | The cat's chirp, a settling loaf thump, one bell tick |
| **Caterwaul** (1 in the slice) | The posted Sentry's **own voice body**, a three-phrase yowl repeated up to 3 times over ≈ 20 s, from the Patch's true direction; priority 1; music → Prowl. A Fraidy Sentry raises it earlier (Territory). Never fires inside the wall (the clock is paused there). |
| **Tribute** (`TributeDelivered`) | A cascade of soft plops, count and pitch range scaled in 5 size tiers, ending with one bell tick. Pleasant on day 60: short, varied, skippable by walking past. |
| **Morning Sniff** | Three short inhales; per line, a stamp-card chime plus the relevant cat's sting fragment; the raid forecast line gets the raider's sting |
| **Morsel / Stash** | Crunchy "nom" tick, pitch-stepped on streaks; Stash deposit a hollow under-veranda thump |
| **Shiny** | Glass-marble clink with a long bright ring; used for nothing else |
| **Clout rank up** | Brass Call at the *new* arrangement: the player hears the band get bigger |
| **Share a Morsel / Lesson** (Lot) | Crew chirps in a staggered chord / a short teaching yowl and answer |

---

## 10. Mixing

### 10.1 Bus structure

| Bus | Content | Target (relative) | Notes |
|---|---|---|---|
| Master | Everything | 0 dB, true-peak limiter | — |
| Music / Street | Roam, brawl, stingers | −8 dB roam, −5 dB brawl | Side-chained from the Call, Impacts, Critical vocals |
| Music / Home | Home loops, story cues | −10 dB | Never compressed |
| **The Call** | The sung Call only | −4 dB | Own bus; ducks all music; never ducked |
| Murmur | All human voice | −9 dB | Sits behind SFX: speech is not privileged |
| Cat Vocal / Critical | Telegraphs, Caterwaul, stings, Mikan | −5 dB | — |
| Cat Vocal / Flavour | Barks, reactions, Crew chatter | −10 dB | Voice-limited |
| Impacts | T1–T5 | −4 dB (T5 sets the ceiling) | Light compression |
| SFX / Player · World | Foley, bell, Moves · props, humans, crows | −7 / −9 dB | — |
| Ambient | Beds, emitters | −14 dB (−10 dB at Night) | — |
| Sense | Scent tones, Home Scent | −10 dB | — |
| UI | Interface | −10 dB | Bypasses Slow Blink filters |

### 10.2 Priority (highest first)

1. **Enemy telegraphs aimed at any Posse cat; the Ambush sting; the Caterwaul; the Call; the Tap-Tap and her key in the door at home.** Never stolen, never ducked.
2. The controlled cat's actions and hits received.
3. T3–T5 impacts and state changes (Frazzled, Routed, Zoomies, Pile-On).
4. Rival stings; Posse AI Moves; a human addressing Mikan at home.
5. Other enemy actions (nearest first), T1–T2.
6. Music.
7. UI (rises to 2 inside Slow Blink).
8. Murmur and world SFX.
9. Ambience.

This inverts the template's "dialogue first": a cat does not attend to human speech. Voice limits (PC slice): 64 real voices; impacts 8; cat vocals 6 (2 reserved for priority 1); Murmur 4; only the 4 nearest non-Posse cats get full foley.

### 10.3 Ducking

| Trigger | Ducks | Amount | Attack / hold / release |
|---|---|---|---|
| The Call | Music, Ambient | −9 / −6 dB | 200 ms / Call / 1.5 s |
| Yellow/red telegraph | Music, Flavour vocals | −3 dB | 30 ms / windup / 200 ms |
| T3 | Music −4 dB, other SFX −6 dB | — | 5 ms / hit-stop + 120 ms / 200 ms |
| T4–T5 | Everything else −9 dB | — | 5 ms / hit-stop + 200 ms / 300 ms |
| Slow Blink | Music low-pass and −8 dB; World SFX pitched, −6 dB | — | 0 frames / state / 100 ms |
| Full Pile-On cloud | Music muted | — | 50 ms / cloud / on final hit |
| Standoff sting | Music to bass note | — | 1 beat / 2 bars / bar line |
| Human addresses Mikan at home | Home music −4 dB | — | 300 ms / phrase / 800 ms |
| Lap | Everything outside the lap low-passed | — | 1.5 s / state / 1 s |
| Caterwaul | Music −6 dB, → Prowl | — | 100 ms / 20 s / 2 bars |
| Whisker Sense | All but Sense and priority 1, low-passed, −6 dB | — | 120 ms / state / 400 ms |

### 10.4 Mixing rules

- **One full-spectrum event at a time**: one T4/T5 owns the sub-bass in any 350 ms window; later arrivals lose their sub layer, not their transient.
- **Frequency lanes**: sub/low = Thump and taiko; 300 Hz–3 kHz protected for cat vocals and telegraphs (brawl brass sits in rests around it); above 6 kHz = Claw transients, the bell, sparkle.
- **The bell is always findable**: a reserved narrow band around its fundamental and first partial that no brawl instrument may sustain in.
- **Small-speaker check**: every priority 1–3 cue identifiable on a mono laptop speaker with nothing below 200 Hz. No sub-only information.
- Home music is never compressed beyond the master safety limiter.
- All buses player-adjustable; mono option; default mix checked on headphones, TV and laptop speakers.

### 10.5 Loudness (PC slice)

Standard profile: **−18 LUFS ±2 integrated** over a representative 30-minute session, **−1 dBTP**. Content relative to that: brawl +4 to +6 LU · scuffle +2 to +3 · roaming Day 0 · Night −3 · home vignettes −6 to −8 · **the Call peaks at roaming level even at home** (the one loud thing in a quiet house) · the K2.4 held silence keeps room tone, never digital zero. Wide and Handheld profiles: Backlog.

---

## 11. Deaf and Hard-of-Hearing Parity (DR-54)

**Mechanism owned by UX, carriers drawn by Art.** Audio's job: guarantee every story-critical sound has a named visual or haptic twin, fired from the same event at the same time. Test: **every Keystone's Tier A fact reaches 90% of unbriefed testers with audio muted** (DR-03).

| Sound | Visual / haptic equivalent (concrete) |
|---|---|
| **The Call** | **The Call glyph, always on for every player**: three smooth arcs (up, up, down) in **Haru Yellow** rising from the direction of the house (at home, over Haru), drawn in the Call's short–short–long rhythm. Shape codes the voice, so it survives colour blindness. Haptic: three soft pulses, short–short–long. |
| **The bell's fourth beat** | A single bell-gold **glint on the collar** as the head-shake lands. On Late Home, the glint fires with **no arcs before it**: the same image Life 8 will reuse. |
| **The Dusk chime** | **The lamp wave**: street lamps and windows light in a wave running uphill through the Lane with the chime. **The Veranda Lamp** on Haru's house lights with the Call; on Late Home it **stays dark** until her key turns. |
| **Her key in the door / Late Home resolution** | The Veranda Lamp clicks on; the Call glyph rises at the door; Mikan's ears snap toward the entryway. |
| **The Melody present / absent** | Proposal to Art/UX (under Hearing support): Haru's persistent object, the **yellow raincoat on its hook**, takes a faint warm bloom in time with her Melody; Gran's plum cushion with the Foundation. On Late Home and school days the raincoat stays unlit. No HUD motes inside the house. |
| **The Tap-Tap** | Mikan's ear-turn + ear Sense Icon if off-screen; the two finger-taps are framed in the Feeding's authored shot |
| **Off-screen sounds at home** (key, cupboard, rin) | **Mikan's ear-turn plus an ear Sense Icon** pointing to the source |
| **Murmur** | **Tone Sense Icons over Mikan** (heart, rain cloud, question mark, tone icons). Murmur Ribbons are cut. |
| **K2.4 held silence** | Silence is already visual: no Sense Icons, shoulders shaking. The returning piano on Comfort is twinned by Haru's head lifting. |
| **Rival yowl-sting** | The **sting contour glyph** on the Standoff name-card (the sting's melodic shape as a line) |
| **Ambush sting (2.0 s)** | Edge arrow from the Rival's direction; the arrow's **last 0.75 s fills solid** for the counter window; two-pulse haptic |
| **Telegraphs** | Combat's ground decals and overhead glyphs (white / yellow triangle / red zigzag) already carry class; audio's rhythm coding is the redundant layer |
| **Caterwaul** | Edge arrow toward the raided Patch plus a pulsing scent wisp on the phase dial; Crew on the garden wall turn their heads toward it |
| **Paw filled / Frazzle / Pile-On ready** | Combat UI (gauges, the Pile-On prompt on North) |
| **Haptics** | **On by default**: Call, ring of a door, Ambush, T4/T5 impacts |

Honest limit: comprehension parity is achievable; emotional parity is not fully. The muted-audio test measures the first.

---

## 12. Dependencies and Event Contract

| From | Event / data | Audio uses it for |
|---|---|---|
| Clock | `PhaseChanged`, `DayEnded`, `LifeAdvanced` | Phase mixes, the Dusk sequence, Life arrangement |
| Combat | `EncounterStarted` (opener), `MoveUsed`, `TagIn`, `FearTriggered`, `EncounterEnded` | Music states, Ambush, stings, Relay, Fears |
| Combat | **Request:** an impact event carrying `tier`, `scope` (local/global), `damage_type`, `authored_by_player` | Tier mapping and freeze binding (§7.1) |
| Combat | **Request:** `CatRouted` to list Audio as a consumer | Rout and Back Down sounds |
| Nemesis | `VerdictApplied` (**request:** add Audio), bark trigger → intent, `RivalCombatProfile` (personality, scars) | Verdict resolutions, bark gestures, voice variation |
| Territory | `PatchChanged`, `DistrictClaimed`; **request:** a `CaterwaulRaised(patch_id, sentry_id)` event | Brass Call, Caterwaul |
| Economy | `TributeDelivered` | Tribute plops |
| Day loop | `HomeArrived` (on_time / late / routed); Head Home on Late Home evenings appears in the Call slot (**request** to `day-loop.md`) | Arrival music, plaster beat |
| Narrative | `KeystonePlayed`; the **Late Home** Routine variant on Life 2 day 3 (**request**, §4.4) | Story cues |
| UX / Art | Call glyph, glint, lamp wave, ear Sense Icon, raincoat bloom, sting contour glyph | §11 |

**Middleware**: engine is OPEN; FMOD Studio is recommended for stems, quantised transitions and side-chaining. The technical-director decides.

---

## 13. Technical Specifications

### 13.1 Formats

| Type | Delivery | Runtime | Notes |
|---|---|---|---|
| Music | WAV 48 kHz / 24-bit, stems | OGG Vorbis q6, streamed | Loop points sample-accurate; tails delivered separately |
| SFX | WAV 48 kHz / 24-bit | ADPCM or PCM in memory | Peak −1 dBTP per file |
| Cat vocals | WAV 48 kHz / 24-bit | ADPCM in memory | Normalised per body, not per file |
| Murmur | WAV 48 kHz / 24-bit | OGG, streamed for > 5 s | −23 LUFS per clip ±2 |
| Ambience | WAV 48 kHz / 24-bit | OGG, streamed, loopable | — |

### 13.2 Naming

`[category]_[context]_[name]_[variant].[ext]` — categories `mus`, `sfx`, `vox`, `mur`, `amb`, `ui`.
- `mus_call_haru_teen_home_01.wav` · `mus_home_l2_loop_melody.ogg` (stem) · `mus_lane_dusk_chime.ogg`
- `sfx_combat_claw_t3_02.wav` · `sfx_home_taptap_01.wav` · `sfx_home_rin_01.wav`
- `vox_rival_bodyL_sneer_03.wav` · `vox_mikan_b_trill_02.wav` · `mur_gran_grunt_01.wav` · `amb_lane_night_loop.ogg`

### 13.3 Memory (PC slice)

Resident ≤ 160 MB (SFX and vocals ≤ 110 MB, Murmur short clips ≤ 20 MB, buffers 30 MB); music, long Murmur and ambience streamed (≤ 6 concurrent streams). Handheld budget: Backlog gate.

---

## 14. Slice Asset List

### 14.1 Music (≤ 25 min; DR-01)

| Cue | Min |
|---|---|
| Title (bell, clock, Foundation) | 1.00 |
| Yunagi Dusk chime (diegetic) | 0.25 |
| Lane roaming, Day family (Morning/Day/Dusk as stem mixes) | 3.00 |
| Lane Night nocturne (stem remix + 2 new stems) | 1.00 |
| Scuffle stems (double-time percussion and bass) | 0.75 |
| Lane brawl | 2.00 |
| Daifuku, 3 phases | 2.50 |
| Outcome stingers, Verdict vamp + 4 resolutions, Fed Up | 1.25 |
| Brass Call, 3 arrangements (2 s tags, 8 s fanfare) | 0.50 |
| The Lot theme (1 level) | 0.75 |
| Life 1 home loop (Foundation + Melody stems) | 1.50 |
| Life 2 home loop (Morning/Evening mixes; Melody as separable stem) | 1.50 |
| Haru's practice piece, diegetic piano (3 takes with stumbles) | 0.75 |
| K1.1 · K1.3 `first_call` · K1.4 | 0.75 · 0.50 · 0.75 |
| K2.1 accent · K2.2+K2.4 · K2.3 · K2.5 `envelope` | 0.25 · 1.00 · 0.50 · 1.00 |
| 3 Textures · montage 1→2 | 1.00 · 1.00 |
| 3 Zoomies passages · nap quotes | 0.50 · 0.25 |
| **Total** | **24.25** (0.75 min headroom) |

Sung Call takes (Haru, 16–18): 6 Dusk takes, 1 `first_call`, 2 close door takes (Late Home), ≈ 0.2 min, inside the cues above.

### 14.2 SFX, vocals, Murmur, ambience (files)

| Group | Contents | Files |
|---|---|---|
| Combat impacts | 3 damage types × T1–T5 × 4 vars; T0 set; harmonic stabs (7 × 2 × 2) | 100 |
| Combat verbs and states | Strings, Pounce, Hop/Skitter/Brace, Hiss ×3 Styles + glass crack, Tag-In/Relay, statuses, Ruffled/Frazzled, Slow Blink, Paw ticks, Fears (3 + universal), Rout, Splat, knock-off, Pile-On (Quick/Full), Zoomies entries | 120 |
| Cat vocals | Mikan A (12 × 3), Mikan B (16 × 3), Daifuku (≈ 45), old wall cat (≈ 35), generic L and H (8 intents × 3 + 10 combat classes × 3 + 3 telegraph classes × 2 = 60 each), sting sample sets (2 × 12) | 308 |
| Foley | Bell (7 states × 4), cat steps (6 surfaces × 6), High Road climb/land, human feet, props, crows | 130 |
| Territory and economy | Spray (17), overwrite, Sentry, Caterwaul, Tribute (5 tiers × 3), Sniff, Morsel/Stash, Shiny, Lot, Turf Board, scent tones | 75 |
| Home and ritual | Feeding, Tap-Tap, stroke, rin, lamp, key/door, clock, Goodbye, piano keys (24), Home Scent (2 × 4), Knock items, Gift curios, plaster | 95 |
| Murmur | Haru teen (24 intents × 2 + ≈ 30 bespoke), Gran (24 + ≈ 20 bespoke), 3 street archetypes × 10, 3 crowd beds | 155 |
| Ambience | Lane × 4 phases, Lot × 2, house rooms × day/night, garden, rain, ≈ 30 emitters | 50 |
| UI | Menus, Fence Line, Turf Board, Verdict prompt, Slow Blink commands | 40 |
| **Total** | | **≈ 1,075** |

Bark *lines* (≤ 240, text) belong to Narrative; each plays over one of the gestures above.

---

## 15. Acceptance Criteria (slice)

1. **≥ 50% of unbriefed testers can hum or tap the Call unprompted** after the slice. If not, nothing downstream works; revise the Call before anything else.
2. **≥ 60% of testers**, asked "what was different on the evening the piano wasn't playing?", answer that Haru was late or away, and that she came home.
3. Every Keystone's Tier A fact reaches 90% of testers with audio muted (DR-03, §11).
4. In blind A/B, ≥ 75% of testers can tell a white, yellow and red telegraph apart by ear alone.
5. ≥ 70% of testers identify the First Thorn by its sting at the day-2 gatepost before the name-card appears.
6. Audio freeze and Combat hit-stop start on the same frame for every T1–T5 event in a capture of the combat prototype; no tester uses the word "mushy".
7. Murmur passes all four gates (§6.4) with zero word reports and zero parody flags.
8. No slice asset needs rework to satisfy the Life 8 audit table (§3.5).
9. Music total ≤ 25 min; PC session loudness −18 ±2 LUFS.

---

## 16. Assumptions for Creative-Director Review

1. **Late Home** (§4.4) is a Routine variant on Life 2 day 3, not one of the 11 vignettes. It teaches the late idiom inside the slice, as the round-2 brief requires, while SB-N4's whole-game application stays Backlog. Narrative to confirm the day and staging.
2. The "bell answers nobody" image is shown at zero stakes in the slice so Life 8 reuses a learned image rather than introducing it.
3. Haru's practice piece *is* the Melody (DR-23 "one piece").
4. K1.1's hum (the answer phrase) is the only sung/hummed voice other than the Call in the slice; §2.2 reserves the voice accordingly.
5. The raincoat bloom (§11) is offered to UX/Art as an option; DR-54 does not list it.
6. Piano lid closed in Life 8 (§3.5): Narrative to confirm.

---

## Backlog (post-slice)

- **SB-N1** Life 8 Stage A scoring (A1/A2 Life 7 arrangements unchanged; ordinary Haru-late Dusk; K7.5 is her last complete Call, unmarked); delete `long_summer_eve`.
- **SB-N2** Carry cues `carry_pickup`, `carry_1_unnoticed`, `carry_2_seen`, `carry_3_bowl`, `lamp_k8_8` (Sora's two whistled notes, Koharu's third).
- **SB-N4** "Haru late" Melody rule across Lives 3–7 (visit days, covered-plate evenings); Life 8 minus-one is the same arrangement with no entrance.
- **SB-N6** (non-slice beats) K3.4 `gran_hums`, K3.5 duet, K4.5 `right_call`, K5.x record player and `white_day` split, K5.4 intimate Call, K6.2 exit vocabulary and Sora's first whistle, K6.4 purr-as-melody, K7.4 happy rain (delete the old rain rule), B2 caught breath, K8.4 bright indifferent morning, K8.5, Season Turn ambience and the duller "old" bell, K8.7, K9.2 Sora hums it whole, K9.5 Koharu twice, bell last.
- **SB-N7** (non-slice) Tap-Tap variants for Sora and Koharu; Sora/Koharu Home Scent notes (G2 cello, A5 toy piano); Haru's E4 fading in Life 8.
- **SB-N12** (non-slice twins) Gran's plum-dot glyph, Sora's sagging teal arcs, K8.8 and Life 9 glyphs; phone carriers at B1; Crew head-turn in Stage C.
- **SB-N14** Sora's Call assets are whistle and hum only.
- **SB-N16** Life 6 evening loop is one-handed piano; the hummed lullaby is K6.5 only.
- **SB-N17** Wake staging: no toy piano unless Art adds the prop.
- **SB-P12–P14, P16–P18** Gran's three taps and flat hum (L3); the Life 3 phone carries the complete Call (same ring asset as B1); Stage A; Botan's inverted Call on celesta and the inn hand-bell at her Verdict; Sora whistles; home vacuum Texture.
- **DR-04** Full-game music ≤ 75 min; Arcade, Shiosai, Summit themes and colour instruments; Madam Sabi, Oboro, Ikari, Botan themes.
- Cello and toy-piano lines; the Waiting form of the Call (landing on A3).
- Yowl-sting states beyond 4 (Humbled ending, Chase-Off return, Nose-Touch fifth, Scar crack, Betrayal removes the bell).
- Fang damage body (Prowler), Trickster sounds, Knacks, Home Moves.
- Mikan voice set C (greying to elder); more generic voice bodies (≈ 10 at full game).
- Wide and Handheld loudness profiles; handheld memory budget; Switch-class check.
- Lot theme second level; Roof Run audio; multi-district bleed; Night spatialised stings (only if Nemesis adds a listening mechanic).
- Translated ultrasound (TV whine, rodents in walls) and the Life 8 decay sounds.
- Credits as a rearrangement of existing cues.

---

## Revision Log

### 2026-11-23 — Round 2 (fresh slice-focused rewrite; first draft archived)

| Issue | Status | How / why |
|---|---|---|
| SB-N1 | BACKLOG | Life 8 Stage A (DR-27; action list). Rule-level compatibility kept: the Late Home Dusk (§4.4) is the ordinary "Haru late" Dusk N1 asks Stage A to reuse. |
| SB-N2 | BACKLOG | Carry and K8.8 cues (DR-27). §3.1 no longer claims Life 9 is the first complete Call. |
| SB-N3 | FIXED | Life 8 audit rule (§2.3.12) and the systemic-cue table (§3.5): title has no sung Call; naps quote the Foundation; drowsiness fades nothing in Life 8. |
| SB-N4 | FIXED (slice) / BACKLOG (Lives 3–8) | The idiom is taught inside the slice in three steps: Goodbye, out all day, Late Home (§4.4). The whole-game rule is Backlog per the action list. |
| SB-N5 | FIXED | The Call answers the chime one bar later; one optional repeat at 2:30; pre-flap final Call at 4:00 then the canon 1-minute grace; the bell's fourth beat (§5.3). Retimed for 4-minute phases. |
| SB-N6 | FIXED (slice) / BACKLOG | `first_call` (K1.3), K2.1 accent, K2.4 rewritten as a held silence broken by Comfort, `envelope` (K2.5) (§4.1). Non-slice beats → Backlog. The Stage C Koharu question is REJECTED (DR-27 pathos cap). |
| SB-N7 | FIXED | Ritual sound table with Tap-Tap at S0, rin, lamp cord, key (§9.1); Home Scent as one sustained note per human, 4 freshness steps (§9.2). |
| SB-N8 | FIXED | Six tiers T0–T5 mapped onto Combat's DR-07 table without restating its values; freeze bound to hit-stop scope; authorship rule; Quick and Full Pile-On with per-cat voices (§7). |
| SB-N9 | FIXED | Renamed the Brass Call throughout. |
| SB-N10 | FIXED | Telegraph vocals by class with rhythm coding; Hiss belongs to the acting cat; Yowler debuffs use yowls (§7.2). |
| SB-N11 | FIXED | 8 bark intents per voice body plus personality performance colour (§8.3). Paid for by cutting overlapping generic classes. |
| SB-N12 | FIXED (slice) | Call glyph in the singer's colour with shape coding; bell glint; lamp wave and Veranda Lamp; ear Sense Icon; raincoat bloom proposal; sting contour glyph; haptics; muted-audio test (§11). N12.6 Murmur Ribbons REJECTED (DR-54: cut). Non-slice glyphs → Backlog. |
| SB-N13 | FIXED | ≥ 3 source languages per bed; household closed-mouth with no source speech; never comic; parody question on the panel; sing-song ban (§6). |
| SB-N14 | BACKLOG | Action list. Rule recorded in §3.1 (Sora whistles and hums, never sings). |
| SB-N15 | FIXED | Paw ticks per slot excluding E and G; Slow Blink is a falling two-note figure (§5.5). |
| SB-N16 | BACKLOG | Life 6 content. |
| SB-N17 | BACKLOG | Life 8 content. |
| SB-P11 | FIXED | Dusk chime approved; the Call answers within 1 bar; the chime plays in Life 8 (§5.3, §3.5). |
| SB-P12, P13, P14 | BACKLOG | Lives 3 and 8 content (DR-52). |
| SB-P15 | FIXED | Incense bell rejected; the rin is struck once in every Alcove morning ritual from Life 1 (§2.2, §9.1). |
| SB-P16, P17, P18 | BACKLOG | Botan's inverted Call (no in-fight singer), Sora whistles, vacuum Texture (DR-52). |
| SB-X1, X2, X3 | BACKLOG | Life 8 structure (DR-27). |
| SB-X4 | FIXED | As SB-N5. |
| SB-X5, X6, X7 | BACKLOG | Lives 3–7 content. |
| SB-X8 | FIXED | As SB-P15. |
| SB-X9 | FIXED | Singer's colour plus shape (§11). |
| SB-X10 | FIXED | As SB-N8. |
| SB-X11 | FIXED | As SB-N9. |
| SB-X12 | FIXED | As SB-N10. |
| SB-X13 | FIXED | Combat owns existence and timing; Audio owns timbre. Ruffled = shaker (no string tremolo); Frazzled = cymbal swell then a beat-ticking taiko roll over Combat's window; Slow Blink falling figure; per-slot Paw pitch (§5.5). |
| SB-X14 | FIXED (elsewhere) | Coral incoming-hit pulse replaced by an Ink/halftone pulse in DR-51; audio uses no coral-coded cue. |
| Cut list | FIXED | Night as a stem remix; Lot at 1 level; vignette accents cut; 4 sting states; harmonic stabs reduced; household Murmur to 2 slice actors; ultrasound → Backlog. |

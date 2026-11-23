# Sound Bible: Cat RPG (working title)

> **Location**: `design/audio/sound-bible.md` (not `design/gdd/`, where the GDD checks count every file as a system GDD)
> **Owned By**: audio-director
> **Status**: First draft v0.1, 2026-11-23. Written in a pre-approved design pass; nothing here has been reviewed by the user, the creative-director or the other specialists yet.
> **Canon source**: `design/creative-brief.md` (binding), `design/gdd/game-pillars.md`, `design/gdd/game-concept.md`. All capitalised terms (Mikan, the Call, Murmur, Standoff, Frazzle, Pile-On, Patch, Sunspot...) are used exactly as defined in the brief's glossary.
> **Reading note**: every number in this document is a tuning start. Anything this document decided that the brief did not cover is listed in §16 "Assumptions for creative-director review". The honest list of what is weak or unproven is §17.

---

## 0. How to read this document

| If you are... | Read |
|---|---|
| Creative director, user | §1, §2, §3, §9, §16, §17 |
| Composer | §2, §3, §4, §5, §9 |
| Sound designer (delegate for SFX event lists) | §6, §7, §8, §10, §11, §13 |
| Narrative director | §3, §4.1, §6, §9, §12 |
| Combat designer | §5.3, §5.4, §7.3, §8, §11 |
| Nemesis designer | §3.6, §7.4, §7.5 |
| UX designer / accessibility | §12 |
| Lead programmer, technical director | §11, §13, §14 |

---

## 1. Audio Vision

### 1.1 Sonic Identity

The game has **two sound worlds and one thread between them**.

- **The Street** is a Showa-era gangster picture scored for a brass section, taiko and shamisen, played completely straight about animals that weigh four kilograms. It is stylised, loud, rhythmic and funny. Hits land like cannon fire.
- **The House** is a chamber room: an upright piano, a cello, a reed organ, a toy piano, a wall clock, a human voice heard through its chest. It is naturalistic, close, quiet and never ironic.
- **The thread** is the Call (three sung notes: rise a third, fall a fifth) and the small brass bell on Mikan's collar. The bell goes everywhere Mikan goes; the Call reaches everywhere Mikan is. Every other sound in the game belongs to one world or the other. These two belong to both.

The player should be able to close their eyes and know, within one second, whether they are a boss or a pet.

### 1.2 Audio Pillars

1. **Music is the translator.** The cat cannot understand human language, so the player gets Haru's life through visuals and music only. Music is therefore a narrative channel with the same duty of clarity as dialogue would have in another game. Every home cue must be able to answer: *what does the player now know that they did not know before this cue?* If the answer is "nothing", the cue is decoration and should probably be silence.
2. **Heard from 25 centimetres.** The listener is Mikan, not the camera. The world is mixed by what a cat cares about, not by physics: a food bowl three rooms away outranks the television; a human footstep is an event; a human sentence is weather. Hearing is a gameplay sense, not set dressing.
3. **A kilogram of cat, a tonne of sound.** Combat audio is maximalist and percussive, locked to hit-stop and shake, and always readable: one full-spectrum event at a time, and the player can tell damage type, Frazzle state and who is winning with their eyes closed.
4. **Every cat has a voice you would know in the dark.** Rivals are recognisable by ear. Voice and a personal 2-bar yowl-sting carry memory: they change when the relationship changes.
5. **Silence is scored.** Absence is a composed event with a start, a length and a reason. The game earns it by being generous with music for twenty hours, then takes one specific sound away.

### 1.3 Pillar-by-pillar assessment (what audio contributes to each game pillar, and where it does not)

| Game pillar | What audio contributes | Audio gap or risk |
|---|---|---|
| **1. Cat's-Eye Truth** | Murmur (§6) makes human speech tone-only. Listener at cat ear height, salience mix, translated ultrasound and Whisker Sense sonification (§10) make hearing a cat sense. All diegetic human media (radio, PA, television) is also Murmur. The Call is wordless by construction, so it survives player renaming of Mikan. | Murmur can never be proven free of accidental words in every language; we can only test (§6.5). Music itself is a human art form: a non-diegetic score is arguably outside what a cat perceives. We accept this openly: the score is the *player's* translation layer, not Mikan's. |
| **2. Two Lives, One Clock** | One motif grows up with Haru (§3). The home theme is literally the sum of who lives in the house (§3.3). Each phase of the day has its own arrangement (§5.1). The town's Dusk chime and the Call physically pull the player home through spatial audio (§5.5). The clock on the house wall ticks in every Life. | The street/home pull only works if the player hears the Call at Dusk. Players with sound off, in loud rooms, or deaf/hard-of-hearing get nothing unless the visual twin exists (§12). This is the single largest audio dependency on another department. |
| **3. Conduct the Brawl** | Impact tiers tied to hit-stop (§8.1), harmonic brass-and-taiko stabs in key with the music, per-Style vocal signatures, Frazzle riser into the Pile-On sting, Slow Blink mix state that opens on the frame of the press. | Ten combatants plus four damage types plus music is a density problem. The mix rules in §11 are untested; only the combat prototype will tell us. Fatigue over 22 to 28 hours of 8 to 90 second fights is a real risk. |
| **4. Rivals Remember** | Procedural voice per cat from a deterministic seed (§7.4). Personal yowl-sting that mutates with Verdict, Scar, Title and rank (§7.5). Recruited Rivals keep their voice and sting; the sting gains the bell. A betrayer's sting loses it again. | 48+ generated stings must be distinguishable by non-musicians. A grammar that produces 48 *valid* stings is easy; 48 *memorable* ones is not. No voiced lines, so performance must come from non-verbal vocal acting on a library budget. |

### 1.4 Reference Games / Media

| Reference | What to take | What to avoid |
|---|---|---|
| *Up* (opening montage) | One waltz theme, re-orchestrated, carries a whole marriage with no words. Theme variation as biography. | Its sweetness. Our home theme must survive being played 60+ mornings without cloying. |
| *Peter and the Wolf*; Peanuts specials | One instrument per character; adults as wordless instrument-voice. | Peanuts' trombone "wah-wah" is a joke. Murmur must be able to carry grief. |
| Final Fantasy VII Remake | Seamless exploration-to-battle arrangements of the same theme; mix clarity during tactical slow-motion. | Six-minute battle tracks. Our median fight is under a minute. |
| Ōkami, Ghostwire: Tokyo | Japanese instruments used as a living palette rather than as an "exotic" colour. | Mythic grandeur. Yunagi is a small town with a croquette stall. |
| *Battles Without Honor and Humanity* and 1960s–70s crime-film scores; Showa kayō; chindon'ya street bands | Brass stabs, surf guitar, swagger; the sound of a shopping street. | Quoting any existing theme. All melodies are original (originality rule, brief §9). |
| Katamari Damacy; Yakuza series | Comedy played straight through committed arrangement. | Wackiness inside the house. |
| Stray | Cat foley and vocal recording quality. | Its synthetic score; ours is acoustic. |
| Animal Crossing ("Animalese") | Proof that non-language speech can be charming. | Its method: syllable-rate babble reads as speech-like language. Murmur is prosody, not syllables (§6). |
| Shadow of the Colossus; Inside | Silence and withdrawal of music as statement. | Bleakness as a default mood. |
| Japanese municipal evening chimes | A whole town hearing one melody at dusk that means "go home". | Using any real chime melody. Ours is original (§5.5). |

---

## 2. Music Direction

### 2.1 Style and Genre

| World | Style | Tempo | Harmony | Recording character |
|---|---|---|---|---|
| **House** | Chamber music for 1 to 5 players. Lullaby, waltz and hymn idioms. | 56–84 BPM, rubato allowed | Diatonic, C major centre, modal mixture reserved for Lives 3, 4 and 8 | Close-miked, dry small room, audible pedal, key and bow noise. No reverb larger than a house. |
| **Street (roaming)** | Showa small-band: melodica, nylon guitar, clarinet, shamisen, upright or electric bass, brushes or kit, a district colour instrument. | 72–88 BPM (double-time feel available, §5.3) | Pentatonic and blues-inflected minor/major; close keys only (§5.5) | Tight, slightly saturated "tape" colour, short room. |
| **Street (brawl)** | Brass section (2 trumpets, 2 trombones, baritone sax, tuba) with taiko ensemble (ō-daiko, chū-daiko, shime, atarigane), tsugaru shamisen, surf guitar, kit. | 144–176 BPM as double-time of the roaming tempo | Riff-based, strong tonic, stabs on chord tones | Big, bright, wide, compressed. This is the only place the full dynamic ceiling is used. |
| **Night (roaming)** | The same district themes re-arranged as nocturnes: upright bass, brushes, vibraphone, muted trumpet, shakuhachi breath. "The town belongs to cats." | Same tempo map | Same harmony, darker voicings | More room, more space. |

### 2.2 Instrumentation Palette and the Reserved Timbre Rule

**The Reserved Timbre Rule** is the main legibility device of the score: certain timbres mean one thing and are never used for anything else, anywhere, including menus and trailers. Without it the wordless story cannot be followed by ear.

| Reserved timbre | Belongs to | Signature colour (art) | Notes |
|---|---|---|---|
| **Solo sung human voice** (wordless) | The Call only | follows the singer | No other vocal music in the game. Radio songs are Murmur-sung through a band-limited speaker and never solo, dry or close. |
| **Upright piano** (a slightly imperfect domestic instrument) | **Haru** | yellow | Tuning drifts when Haru is away (Life 3); freshly tuned for Life 5; see §4.1. |
| **Cello** | **Sora** | teal | Enters as tentative pizzicato; becomes arco as Sora becomes family. |
| **Toy piano** | **Koharu** | coral | A small Haru: same keyboard family on purpose. In Life 9 Koharu plays Haru's upright with a child's touch. |
| **Reed organ** (foot-pumped, audible bellows) | **Gran** | plum | Slow, breathing, foundational. She carries the bass line of the home theme (§3.3). |
| **Small brass bell** (collar) | **Mikan** | bell-gold | Diegetic. Also the Bell Clowder's sonic mark in UI and Posse feedback. |
| **Brass section with taiko** | Combat | n/a | Never heard inside the wall of Haru's House. |
| **Hyōshigi (wood clappers)** | Standoff start, Verdict | n/a | Two clacks open a Standoff. |

- **Core instruments (Street)**: melodica, nylon guitar, clarinet, shamisen, upright bass, electric bass, drum kit with brushes, vibraphone, baritone sax, muted trumpet.
- **District colour instruments**: see §4.2.
- **Accent instruments**: atarigane, wood block, slide whistle (Pile-On and slapstick only), vibraslap (Fear triggered), suzu bells (Tsukimi Hill), koto.
- **Avoid**: synthesizers and electronic drums (nothing in Yunagi is modern); orchestral string-section grandeur outside the Life 5, 7 and 9 peaks; choir; any sung lyric or scat syllables; solo violin (too close to "sad film music" cliché, and too close to the cello's job); chiptune; any instrument on the reserved list used out of role.

### 2.3 Music Rules

1. **Reserved timbres are law** (§2.2). A composer who wants a piano on the street writes for vibraphone or celesta instead.
2. **Home and Street do not mix inside one cue**, with exactly four sanctioned exceptions: the Dusk bleed (§5.5); the Swagger, which is the Call in brass (§3.2); the Life 8 food-carrying sequence (§9.3); the Life 9 last walk (§4.1).
3. **No gag instrument inside the wall.** Slide whistle, vibraslap, muted "wah" trombone and cartoon percussion never sound in Haru's House (tone guardrail: never undercut a home scene).
4. **No tragic scoring on the street.** Life 8's streets are tired and thin, not mournful (§4.2).
5. **Roaming loops** are 2:30 to 3:30 long and end in a tail that allows 8 to 20 seconds of ambience-only before the loop restarts. Home loops are 1:30 to 2:00 with a 10 to 30 second gap.
6. **Brawl music reaches full intensity within one beat** of the encounter's first hit (under 0.42 s at 144 BPM).
7. **Every transition is bar- or beat-quantised** except impact stingers, the Slow Blink state and anything triggered by a player button, which are instant (0 to 1 frame).
8. **Nothing musical plays over the Call.** When any human sings it, all music ducks at least 9 dB for its duration (§11.3).
9. **All melodies are original.** No quotation of existing songs, chimes, school bells or folk tunes.

---

## 3. The Leitmotif System

### 3.1 The Call (canon: three sung notes, rise a third, fall a fifth)

The Call is Mikan's name, Haru's leitmotif and the main theme. Canon fixes its contour. This document fixes its pitches, its two forms and its rules of use.

| Form | Pitches (reference key C) | Scale degrees | Intervals | Meaning |
|---|---|---|---|---|
| **Home form** | E4 – G4 – C4 | 3 – 5 – 1 | up a minor third, down a perfect fifth | Lands on the tonic. "Come home" and the answer "home" in one gesture. This is the default. |
| **Waiting form** | C4 – E4 – A3 | 1 – 3 – 6 | up a major third, down a perfect fifth | Same contour, lands on the relative minor's tonic. Unresolved. Used for absence: Life 3, the waiting-up vignette, Life 8. |

Both forms satisfy canon ("rise a third, fall a fifth"). The player is never told there are two; they feel that the Call sometimes does not land.

**Rhythm**: short – short – long (two quavers and a held note), sung with a small upward scoop into the second note. **Sung on a single open vowel with a soft onset, or hummed.** Never on syllables: the player can rename Mikan, and three syllables would read as a word.

**Absolute pitch matters.** Whoever sings the Call at home sings E4–G4–C4 (Sora an octave lower). The same three pitches for 25 hours make the Call recognisable from across a district before the player consciously hears it. Street music keys are constrained so the Call can always sound at pitch (§5.5).

**Rules of use**

- The complete sung Call is rationed: at Dusk (once, with up to two repeats, §5.5), in authored vignettes, and never as a UI sound, a level-up jingle or a pickup.
- Instrumental statements of the Call are free in home cues and forbidden in street roaming cues except inside the Swagger (§3.2).
- An **incomplete** Call (two notes, or the third note missing or wrong) is the strongest device in the score. It is reserved: Sora's early attempts (Life 4), and Life 8. Nowhere else.

### 3.2 The Swagger (Mikan's street theme)

The same three-note cell, rise a third and fall a fifth, played by trombones and baritone sax as a syncopated riff over a walking bass: the Call with its chest out. It is the Bell Clowder's fanfare (Patch claimed, district claimed, Clout rank up) and the head of the Lot theme.

This is the core fantasy in one musical fact: **sung, the cell is a pet's name; in brass, it is a boss's theme.** Most players will not notice consciously until Life 8, when the brass version is taken apart and the sung version is all that is left.

The Swagger grows with Clout: House Pet and Lane Cat hear it on one melodica and a wood block; Known Face adds bass and clarinet; Boss adds baritone sax and kit; Two-Street Boss and Big Whisker add the brass section; Great Boss adds taiko and full tutti. (Four recorded arrangement levels cover the seven ranks.)

### 3.3 The Home Theme ("Veranda") as the sum of the household

The home theme is built from four independent lines, each written for and owned by one person. **Who is in the house decides which lines sound.** The player learns the household by ear without being taught.

| Line | Owner | Instrument | Musical function | Shape |
|---|---|---|---|---|
| **Foundation** | Gran | reed organ | Bass line and harmony | Slow descending stepwise line, hymn-like, one note per bar |
| **Melody** | Haru | upright piano (voice for the Call) | Tune | Begins with the Call, answered by a rising four-note phrase; 16 bars, AABA |
| **Countermelody** | Sora | cello | Inner voice | A stepwise turning figure in contrary motion to Haru's answer phrase. Written to fit the Melody exactly, but first heard alone and in the wrong metre (§3.4) |
| **Ornament** | Koharu | toy piano | High decoration | Made from the first half of Haru's motif (the rising third) and the second half of Sora's (the stepwise fall). Audibly their child. |

Consequences that the arrangement must honour:

- **Lives 1–2**: Foundation + Melody. A two-person house.
- **Life 3**: Foundation alone most days (Gran feeding Mikan). The Melody returns only on Haru's visits, which is why they feel like festival days. The piano, when it returns, has drifted slightly flat.
- **Life 4**: Foundation (slower, with longer breaths between phrases: Gran is slower) + Melody + the Countermelody arriving wrong and gradually fitting.
- **Life 5**: Gran's reed organ is gone. **The cello takes over the Foundation line**, note for note. Sora is now holding up the house. A single held reed-organ note sounds only if Mikan sits on Gran's cushion beside the photo.
- **Life 6**: the Ornament enters as a music-box fragment, out of time (a baby does not keep time), sometimes loud and interrupting.
- **Life 7**: all four lines, in time, in the fullest arrangement of the game (small string group joins the cello on the Foundation). The player should feel that the theme is finally complete, without knowing it was incomplete.
- **Life 8**: the Melody is removed. Everything else plays exactly as before, when it plays at all. See §9.
- **Life 9**: Koharu plays the Melody on the upright, haltingly, with wrong notes corrected. Then sings the Call.

### 3.4 Household themes: development table

| Character | Motif | First heard | Development | Final state |
|---|---|---|---|---|
| **Haru** | The Call + answer phrase (Melody line) | Life 1, hummed under a raincoat hood in the rain, before any instrument | L1: sung, breathy, a teenager. L2: piano, studied, with stumbles (exam nerves: the answer phrase repeats obsessively). L3: absent; heard thin through a telephone receiver. L4: confident, adult touch, left hand added. L5: full two-hand statement. L6: reduced to a tired hum over the crib (the Call as lullaby). L7: richest. | L8: absent. The line is literally missing from the arrangement. |
| **Sora** | Countermelody | Life 4, as four cello pizzicato notes in 3/4 against the home theme's 4/4, when Mikan sniffs the strange shoes | L4: wrong metre, wrong register, interrupts. His attempt at the Call is two notes and a wrong third (the cat does not come). By the end of Life 4 he gets it right once, and Mikan comes: first arco note. L5: fits the Melody as counterpoint. L5–7: also carries Gran's Foundation. | L8: cello alone, playing the Foundation without a tune above it; attempts the Call and stops after two notes. L9: accompanies Koharu. |
| **Koharu** | Ornament | Life 6, as an irregular music-box phrase heard through a wall before the baby is seen | L6: out of time, loud. L7: in time, playful, doubles the Melody a third above. | L9: takes the Melody on the upright; sings the Call at the canonical pitches. |
| **Gran** | Foundation | Life 1, as a reed organ exhale with no melody when the door first slides open: disapproval | L1: stern, bare fifths, softening to full triads by the end of the Life. L3: the whole home theme. L4: slower, bellows audible. | Lives 5+: her line persists in other hands; her timbre is gone, except at the cushion. Her absence is never given its own sad cue: it is the game's quiet rehearsal of loss, and the player should only half notice. |
| **Home itself** | The four-line sum, plus the wall clock | Life 1 | See §3.3 | Life 9: three lines, one of them in new hands |
| **Mikan** | The bell (diegetic); the Call (as name); the Swagger (as boss) | Life 1, when the collar goes on: the bell's first ring is the last note of the scene | The bell is retuned once: a slightly duller strike from Life 8 (an old bell on an old cat). | Life 9: the bell and the Call are the last two sounds of the game (ending shape is OPEN in the brief; see §17). |

### 3.5 Combination at the wedding, fragmentation after the accident

**Life 5, White Day (combination).** The wedding is the only place in Lives 1–6 where the Melody and Countermelody are stated together, complete, by piano and cello alone, with nothing else. The Countermelody that sounded wrong in Life 4 is revealed to have been the other half of the tune all along. The cue has three parts:

1. *Preparation* (boxes, the dress on the door): both lines traded in alternation, never overlapping; house full of happy crowd Murmur.
2. *The joining*: 16 bars, both lines together, piano and cello only. The cello then drops to the Foundation line under the piano's last phrase. Gran's handover. If Mikan is on the cushion beside the photo, one held reed-organ note sounds beneath the final chord.
3. *The house afterwards*: the first evening loop of the new arrangement.

**Life 8, The Door (fragmentation).** Fragmentation is done by **subtraction and interruption, never by distortion**. No detuned pianos, no reversed audio, no minor-key reharmonisation of the home theme. The theme is not made sad; it is made incomplete.

| Device | What the player hears | Where |
|---|---|---|
| **Music minus one** | The home theme with the Melody line deleted; accompaniment plays to an empty space | Life 8 home, after the silence span (§9.2) |
| **The unanswered Call** | The first two notes on cello, a breath, nothing | Sora at the entryway |
| **The Waiting form** | The Call landing on the 6th instead of the tonic | Mikan's waiting vignettes; Dusk on the streets |
| **Orphaned Ornament** | Toy piano playing its decoration over nothing | Koharu's vignettes |
| **The Swagger, emptied** | Brass mutes in, taiko out, one player fewer each time a Patch is lost | Life 8 streets |
| **The dusk slot** | The town chime sounds; the Call that has followed it every evening for seven Lives does not | Life 8, every Dusk (§5.5) |

**Life 9, Nine (reassembly).** The Melody returns in new hands and is allowed to be imperfect. The final complete sung Call, by Koharu at Haru's pitches, is the first complete sung Call since the end of Life 7.

### 3.6 Rival and Boss motifs

**Procedural Rivals** each own a 2-bar yowl-sting (canon, brief §7). Generation and mutation rules are in §7.5.

**Authored Bosses** each own a full theme, a district instrument and a signature gesture. Boss personalities belong to Narrative; these are the musical readings of the brief's one-line descriptions.

| Boss | District | Musical idea | Signature gesture |
|---|---|---|---|
| **Daifuku** (Bruiser; has not moved off his wall in years) | Hidamari Lane | A sumo entrance at 80 BPM that refuses to speed up: tuba, ō-daiko, a yawning trombone glissando. The joke is that the music is as immovable as he is; brawl double-time arrives only when he finally stands up (second phase). | One ō-daiko hit and a tuba note a tritone below where you expect it |
| **Madam Sabi** (Yowler matriarch fed by every shopkeeper) | Akane Arcade | Enka diva with chindon band. Her own yowl is the "vocal" line of the tune, pitched and performed; the band follows her rubato. Shopkeeper Murmur cheers on the off-beats in the Day version. | A long melismatic yowl with wide vibrato over a shamisen tremolo |
| **Oboro** (silent Prowler seen only after dusk) | Tsukimi Hill | A theme made of rests. Kotsuzumi, a single koto string, shakuhachi breath with no tone. When Oboro vanishes, the music stops with him; the next sound is the strike. | Silence, then one hyōshigi clack. His "yowl-sting" is two bars of near-nothing. Players learn to fear the gap. |
| **Ikari** (one-eyed, salt-crusted Scrapper) | Shiosai Harbour | A hauling work-rhythm at speed: tsugaru shamisen, low brass like a fog horn, taiko in call-and-response, surf guitar tremolo. | A fog-horn tuba blast answered by a shamisen rip |
| **Kiha & Moha** (sibling Trickster duo who fight as one) | Kurogane Yard | A hocket: one melody split note-by-note between two saxophones hard-panned left and right, over a rail-joint shuffle. Neither part makes sense alone. **When one sibling is Routed, their notes fall silent and the tune limps.** | A two-note level-crossing figure passed left to right |
| **Botan** (Great Boss; a pampered inn cat in a silk ribbon collar; a pet, like Mikan) | Kasumi Heights | Koto, harp, strings, celesta; the most "expensive" sounding music in the game. Hidden in it is **the inversion of the Call: fall a third, rise a fifth**. She too has a name somebody sings. The reveal is in the final phase, when a distant human voice we have never heard sings Botan's own call and the Great Boss's ears turn. | The inverted Call on celesta |

Captains use the district brawl arrangement plus their own sting. A Rival who becomes a **Nemesis** earns a promoted sting (§7.5) and the dedicated Nemesis brawl track, which is built so the sting can be quoted inside it.

---

## 4. Music Cue Map

Cue IDs follow the naming convention in §13.3. "Loop" means a looping state; "cue" means a one-shot. Durations are composing targets.

### 4.1 Per chapter (the nine Lives): home and story cues

| Life | Home arrangement (morning / evening loops) | Authored story cues | Time-skip montage out of this Life | Mikan / bell |
|---|---|---|---|---|
| **1 The Box in the Rain** | Foundation alone, stern; Melody joins as hummed voice, then first piano notes by the Life's end | `box_rain` (rain, no music, then the Call hummed for the first time, 0:50) · `collar` (bell's first ring ends the scene, 0:30) · `gran_melts` (bare fifths fill in to triads, 0:40) | `skip_1to2`: the Call learned on the piano one hand at a time (1:00) | Kitten voice set; bell bright and too big for the body |
| **2 Uniform** | Foundation + Melody (studied; stumbles in the evening loop; a metronome-like desk clock) | `study_lamp` (late-night loop, piano one finger, 1:20) · `cat_flap` (two clacks, then the first Night arrangement of Hidamari bleeds in from outside, 0:35) · `exam_day` (answer phrase repeats, resolves, 0:45) | `skip_2to3`: the Melody packs up: phrases shorten, last note unplayed (1:10) | Young adult voice |
| **3 The Empty Room** | Foundation only; piano absent; Waiting form on reed organ in the evening. On visit days: full L2 arrangement returns, piano slightly flat | `suitcase` (Melody leaves mid-phrase, 0:40) · `telephone` (the house phone rings; Haru's Murmur and two notes of the Call thin through the receiver; Mikan's ears, 0:30) · `festival_day` ×3 variants (0:45) | `skip_3to4`: reed organ breaths get longer; a door; the piano, in tune again, played by adult hands (1:15) | Adult voice |
| **4 Two Pairs of Shoes** | Foundation (slower) + Melody (adult) + Countermelody arriving in 3/4 and gradually conforming across the Life's vignette pool | `shoes` (four pizzicato notes, 0:25) · `lap_war` ×4 escalating variants: piano and cello compete for the same register, the only comedy the house allows and it is gentle (0:30 each) · `wrong_call` (Sora's two notes and a wrong third, 0:15) · `right_call` (first arco note, 0:30) · `gran_slower` (0:40) | `skip_4to5`: Foundation line passes from reed organ to cello across eight bars; the organ exhales once and does not inhale (1:20) | Adult voice |
| **5 White Day** | Cello Foundation + Melody + Countermelody. No reed organ. | `white_day` in three parts (§3.5; 3:00 total) · `cushion` (interactive: one held reed note while Mikan sits by the photo) · `full_house` (crowd Murmur bed with piano and cello trading, 1:30 loop) | `skip_5to6`: Melody slows, rounder, a second heartbeat-like pulse appears in the bass (1:00) | Prime voice |
| **6 The Small Loud One** | As Life 5, thinner and quieter (a tired house); the Ornament interrupts out of time; evening loop is Haru humming the Call as a lullaby | `belly` (lap disappears; Melody played with one hand, 0:30) · `bundle` (a baby's cry cuts the music dead: Murmur-equivalent infant cry, 0:20) · `displaced` (Mikan's bell alone in another room, 0:30) · `crib_guard` (Ornament and bell in time for the first time, 0:50) | `skip_6to7`: Ornament finds the beat; toy piano doubles the Melody (1:10) | Prime voice |
| **7 The Long Summer** | All four lines; strings on the Foundation; the fullest, warmest mix in the game | `fireworks` (distant booms from cat ear height are frightening, then lap; 1:30) · `watermelon` (0:40) · `tail_pull` (0:20) · `long_summer_eve` (the last complete sung Call by Haru; must be staged so the player does not know it is the last, 0:45) | **None.** Life 7 does not montage into Life 8. It cuts. See §9. | Greying: voice set pitched down, more breath |
| **8 The Door** | Silence span, then music-minus-one (§9) | `phone_night` (diegetic only) · `black_clothes` (diegetic only: rain, incense bell, low crowd Murmur) · `waiting` ×5 (room tone, clock, bell; Waiting form once, on nothing more than a breathy reed) · `unanswered` (Sora's two notes, 0:15) · `food_home` (§9.3; 2:30) · `bowl_remembered` (0:40) | `skip_8to9`: the only montage scored for toy piano growing into upright piano (1:20) | Old: bell duller, vocals rare |
| **9 Nine** | Cello Foundation + Melody in Koharu's hands + Countermelody | `small_hands` (kibble in the bowl, 0:30) · `heir` (the Swagger handed to the heir's sting, at the Lot, 1:00) · `last_walk` (a six-part suite, one part per district, each district theme played by the House palette: piano, cello, toy piano; about 6:00) · `called_home` (Koharu sings the Call; 1:30) · credits (5:00) | n/a | Elder: slow gait foley, long purr |

Standing home states used in every Life: `mus_home_L{n}_morning_loop`, `mus_home_L{n}_evening_loop`, `mus_home_L{n}_waitingup_loop` (a smaller arrangement: one instrument, the porch light hum, a human asleep), `mus_home_lap_layer` (adds warmth and removes high frequencies while Mikan is in a lap; the Murmur is heard through the chest, §6.4).

**Vignette scoring model.** The 100+ vignettes (10 to 20 s each) are **not** individually scored. Each plays over the current Life's home loop and may trigger one of roughly 45 short "accents" (4 to 12 s phrases on the relevant character's instrument, authored per Life) at a timeline marker. Only the roughly 30 authored story cues above are bespoke. Home interaction verbs score themselves: rubbing a leg plays one note of that person's line; knocking something off a table stops the music for one beat.

### 4.2 Per district: roaming, brawl and Boss cues

Each district has one theme, delivered as stems, in a Day-family arrangement (Morning, Day and Dusk are mixes of it) and a Night arrangement, plus a brawl arrangement on the same harmonic grid (§5).

| District | Clowder (colour) | Colour instrument (also its scent tone, §10.4) | Roaming BPM / brawl feel | Character of the theme | Night arrangement | Boss cue |
|---|---|---|---|---|---|---|
| **Hidamari Lane** | Wall Sitters (moss green) | Melodica | 80 / 160 | Lazy shuffle, nylon guitar, a whistle-like melodica tune; the closest street music to the House palette because it is home turf | Upright bass, brushes, vibraphone; unavailable until the cat flap | `mus_boss_daifuku` (2 phases, 3:30) |
| **Akane Arcade** | Awning Gang (vermilion) | Clarinet with chindon percussion | 88 / 176 | Chindon'ya street band; bustling, a little shabby, proud | Shutters down: clarinet alone over bass, a distant Murmur-sung radio | `mus_boss_sabi` (rubato intro + 2 phases, 4:00) |
| **Tsukimi Hill** | Lantern Eyes (indigo) | Koto and suzu bells | 72 / 144 | By day almost ambient: three koto notes and wind in bamboo. **This district inverts the rule: its full arrangement is the Night one.** | Festival-ghost ensemble: shinobue-like flute, kotsuzumi, low shamisen, far-off ohayashi rhythm | `mus_boss_oboro` (rest-based, 3:30) |
| **Shiosai Harbour** | Salt Paws (sea blue) | Tsugaru shamisen with low brass | 84 / 168 | Hauling rhythm, accordion-free (reed timbres are Gran's), swell-like dynamics that follow the wave ambience | Bell-buoy, bowed vibraphone, shamisen harmonics | `mus_boss_ikari` (4:00) |
| **Kurogane Yard** | Rust Runners (orange-brown) | Tremolo electric guitar with baritone sax | 86 / 172 | Rail-joint shuffle; the groove is built from the ambience's actual train rhythm when a train passes (tempo-matched samples) | Sodium-lamp noir: walking bass, brushed snare, muted trumpet | `mus_boss_kiha_moha` (hocket, collapses when one is Routed, 4:00) |
| **Kasumi Heights** | Steam Court (white-violet) | Celesta and harp over strings | 76 / 152 | Elegant, slow, misty; whole-tone colour; water and steam as rhythm | Lighthouse horn as pedal note; strings sul tasto | `mus_boss_botan` (3 phases, the inverted Call revealed, 6:00) |

**District themes across Lives.** A district's roaming theme gains a Bell-Clowder layer (the collar bell on off-beats and a Swagger countermelody) when the district is claimed (`DistrictClaimed`), and Patch-level control is heard in the stems: at 0 to 1 Patches held, the district's colour instrument leads; at 3+, the Swagger line trades phrases with it; at 5, the bell layer is constant. In **Life 8** all claimed-district layers thin by one player per lost Patch, brass goes into mutes and tempo is unchanged: tired, not tragic.

**Other standing street cues**

| Cue | Use | Notes |
|---|---|---|
| `mus_lot_loop` (4 levels) | The Lot | The Swagger as relaxed swing; one level per Crew-size band; Crew cats near the camera add their own vocal chirps on the off-beat |
| `mus_fence_line_loop` | The Fence Line screen | Sparse vamp in a neutral key; focusing a Rival plays their sting over it, so the wall is playable like an instrument |
| `mus_doorstep_sniff` | Morning Sniff | No loop. Each report line is a 1 to 2 s phrase: good news on the Swagger cell, bad news on the offender's sting |
| `mus_brawl_captain`, `mus_brawl_nemesis` | Captain and Nemesis fights | Nemesis track has two 2-bar "windows" per loop where the Nemesis's sting is quoted |
| `mus_brawl_critter` | Critters | Comic, light percussion, no brass above mezzo-forte |
| `mus_setpiece_dog` | The chained dog | Everything from cat height is too big: sub-bass, the chain as percussion |
| `mus_raid_defence` | Live Caterwaul defence | Opens with the Sentry's yowl harmonised |
| `mus_title`, `mus_menu`, `mus_credits` | Front end | Title: the bell, then the Call on solo voice, once, then the room tone of the house. No loop for 20 s. |

---

## 5. Adaptive Music Design

### 5.1 Structure

Vertical layering on a shared harmonic grid, with horizontal re-sequencing only at authored boundaries. Per district, three synchronised arrangements run on one tempo map:

- **Day family** (6 stems: bass, rhythm, harmony, colour instrument lead, Swagger/bell layer, sparkle)
- **Night** (5 stems: bass, brushes, harmony, lead, Swagger/bell layer)
- **Brawl** (4 stems: taiko and kit, bass and low brass, brass riffs, lead/shamisen)

All share bar structure and chord changes, so any crossfade on a beat is musically valid.

### 5.2 Day-phase layers (driven by `PhaseChanged`)

| Phase | Stems active | Mix character | Diegetic time-markers |
|---|---|---|---|
| **Morning** | Lead + harmony only; rhythm enters after about 90 s | Bright, thin, lots of air; ambience forward | Birds, shutters, a delivery bicycle |
| **Day** | Full Day family | Fullest roaming mix; human activity loud | Arcade at peak, school chime (original melody) |
| **Dusk** | Rhythm thins, harmony warms (voicings drop an octave), lead plays half as often. Over the 5-minute phase the arrangement drifts toward a G pedal ready for the Call (§5.5) | Golden, slower-feeling at the same tempo | Town Dusk chime; cooking sounds; the bowl |
| **Night** | Crossfade to Night arrangement over 8 bars at the phase boundary | Wide, quiet, detailed; human sound almost absent; cat vocals carry far | Crickets, electrical hum, distant yowls of the Night Shuffle to come |

Phase transitions are 8-bar crossfades started on the next phrase boundary after `PhaseChanged`. A Sunspot nap (half a phase) plays a 4 s lullaby quotation of the Home theme's answer phrase (not the Call), then resumes at the new mix position.

**End-of-Night drowsiness.** During the 2-minute grace period, a low-pass on the music and ambience buses closes from 20 kHz to about 2.5 kHz, tempo is untouched, and the Home evening loop fades up underneath at −18 dB relative. A yawn is the only foreground sound.

### 5.3 Exploration → tension → combat

| State | Trigger | Music behaviour | Transition in | Transition out |
|---|---|---|---|---|
| **Roam** | Default | District phase mix (§5.2) | n/a | n/a |
| **Prowl** | Whisker Sense held, or a hostile cat within about 15 m unseen | Lead and harmony duck 6 dB and low-pass at 1.2 kHz; a heartbeat-tempo bass pulse and brushed shime pattern enter; scent tones become audible (§10.4) | Instant on button (filter sweep 120 ms) | 400 ms on release |
| **Stalk** (Ambush possible) | On the High Road above, or behind, an unaware target | Prowl plus a held tremolo that rises a semitone every 2 s (max 3 steps); Mikan's bell is damped (§7.2) | 1 beat | Resolves into the Ambush hit or deflates with a soft exhale |
| **Standoff** | `EncounterStarted` opener = standoff | Two hyōshigi clacks; roaming music cuts to its bass note; the Rival's **yowl-sting** plays over it (2 bars at brawl tempo = 2.7 to 3.3 s, sized to the canonical 2 to 4 s Standoff). If skipped, the sting truncates to its last beat. | Instant | Brawl enters on the bar line after the sting |
| **Scuffle** (tier A) | Strays, Toughs, Critters in groups of 3 or fewer | Roaming theme **continues**; brawl percussion and bass stems are added in double-time. No theme restart. Ends with a 1-bar button. | ≤ 1 beat | 1 bar |
| **Brawl** (tier B) | Groups of 4 to 6, or any Captain | Full brawl arrangement of the district theme | ≤ 1 beat, masked by the opening impact | Outcome sting, then 2-bar return |
| **Named** (tier C) | Nemesis or Boss | Dedicated track (§3.6, §4.2) | After the sting | Outcome sting; Verdict vamp |
| **Verdict** | Rival Routed, prompt open | Music holds a suspended chord with brushed taiko roll at low level | On Rout | Per-Verdict resolution (§7.6) |

Why tiers: a Tough is Routed in 8 to 12 s. A full battle-track transition every 30 seconds for 25 hours is the fastest way to make players mute the music. Tier A keeps the theme running and lets percussion carry the fight, so only fights that matter get "battle music".

`ambush_by_player`: the opening impact is forced to tier T3 (§8.1) with a cymbal choke; brawl layers enter on the next beat.
`ambush_by_rival`: the Rival's sting is played **from off-screen, spatialised at the Rival's position, 1.5 to 3 s before contact** (canon: "from off-screen before an Ambush"). This is the game's fairest unfair moment: a player who knows that voice can react. Whether a reaction is mechanically rewarded is Combat's and Nemesis's decision.
`raid_defence`: the Caterwaul (§9.5 of the brief's glossary; design in §8.4 here) is the intro.

### 5.4 In-combat states and stingers

| Moment | Audio behaviour | Timing rule |
|---|---|---|
| **Slow Blink** (time at 5%) | Music does **not** slow or pitch down. Music bus low-passes to 900 Hz and drops 8 dB; a slow purr-pulse at 60 BPM fades in; world SFX are pitched down an octave and stretched (grain-based) with long tails; UI and command sounds stay dry, bright and at full level. A single soft "blink" sound (a felt mallet on a low bell, with a breath) marks entry. | Entry sound and filter start on the frame of the press (pillar 3 engineering rule). No look-ahead, no quantisation. Exit: filter opens in 100 ms on the Move's first frame. |
| **Paw filled** | One bell-gold "pad" tick per Paw, rising a third per Paw (the Call's first interval). At full gauge a soft sustaining shimmer until spent. | Instant, never ducked |
| **Ruffled** | Target's fur-bristle rattle (a short dry shaker) and a pitch-rising loop on the enemy's Frazzle meter tone | Loop rate tied to gauge fill |
| **Frazzled** (stagger, 8 s) | A vibraslap-and-cymbal "boing" at the break; music drops bass and brass for the window and replaces them with an **8-second taiko roll riser** authored to peak at exactly 8 s. Cutting it short is correct: the Pile-On interrupts it. | Break sound is tier T4; the riser is tempo-free |
| **Pile-On** | The signature sound of the game. (1) All four Posse voices in a unison war-cry chord built on the Swagger cell. (2) A 1.5 to 2.5 s "dust-cloud scuffle" loop: fast wood block, atarigane, slide whistle, a blur of sped-up cat vocals, with stars as glockenspiel pings. (3) A tutti brass-and-taiko hit, T4, with the collar bell as its top note. | Music mutes under (2) entirely; the cloud *is* the music. (3) lands on the first frame of the camera's cut-out. |
| **Zoomies** (limit break) | A 4-bar turbo passage per Style at 2× the brawl feel, entered by a per-cat vocal trill and a rising brass rip. Boss-unique Zoomies have bespoke 4-bar passages. Screen-wide effect rule mirrored in audio: other Moves' sweeteners are suppressed for its duration. | Entry instant; passage quantised to the next beat with a pickup fill covering the gap |
| **`FearTriggered`** | Universal fear sting (short string-like glissando screech on shamisen + the cat's own shriek) followed by the Fear's signature sweetener (§8.3) | Instant |
| **Posse cat Routed** | Dust-puff, receding yelp panned off-screen; that cat's voice leaves the music's off-beat chirps | Instant |
| **Mikan at low Nerve** | No beeping. The collar bell jitters on every step; music loses its top octave; heartbeat pulse from the Prowl state returns | Below 25% Nerve, 300 ms blend |
| **Win** | 2 to 3 s outcome sting resolving to the roaming key | Quantised to beat |
| **Loss (Posse wipe)** | A deflating muted-trombone slide and one sad bell. Comic, never tragic. Then the victor's sting in its triumphant variant as their new Title appears. | n/a |
| **Fled** | Scurry foley, music snaps back to Roam with a cheeky clarinet turn | 1 beat |

### 5.5 The Dusk bleed: how home calls the player home

This is the main mechanical job of the music system for Pillar 2, and the set-up for Life 8.

**Sequence, every in-game day from Life 1:**

1. **Dusk begins** (`PhaseChanged` → Dusk). The **Yunagi Dusk chime** plays once from public loudspeakers: an original 8-bar melody, band-limited and echoing between hills, audible in every district with per-district delay and reverb. It is diegetic and impersonal: the town telling everyone to go home. Its last note is G: the upper note of the Call, left hanging.
2. **Arrangement drift.** Over the next minutes the district's Dusk mix thins toward a G pedal (§5.2).
3. **The Call.** At a tunable point (default 2:00 into Dusk, repeated at 3:30 and 4:30 if Mikan is not yet inside the wall), Haru's sung Call sounds **from the true direction of Haru's House**, spatialised at Mikan's ears. It is not attenuated realistically: it uses the salience curve (§10.2), so it is faint but clear from Kasumi Heights. All music ducks 9 dB for its duration. The Call starts on E, passes through the chime's G and lands on C: it resolves what the chime left open.
4. **Bleed.** After the Call, the Home evening loop (current Life's arrangement) fades in under the district music, spatialised from the direction of home, growing with proximity: inaudible beyond 2 districts, −24 dB at 1 district, crossfading to full as Mikan passes the garden wall. District keys are restricted to C major, G major, F major, A minor, E minor and D minor so the bleed never clashes.
5. **Arrival.** Crossing the wall: street music is gone within 2 bars; the cat flap or sliding door; the bowl.

**The pull is never a warning.** No ticking, no alarm, no rising tension. If the player stays out, the Call simply stops after its third statement, the bleed fades, and the Night arrangement comes in. The game does not scold (no time-pressure fail states); the player just hears that somebody stopped calling.

**Who calls, by Life** (proposed staging; Narrative owns the beats):

| Life | At Dusk |
|---|---|
| 1–2 | Haru, sung, home form |
| 3 | No voice. Gran does not sing: she taps the bowl twice with a spoon, and the reed organ plays the Waiting form. On visit days, Haru's Call returns. |
| 4 | Haru; occasionally Sora's attempt (wrong, then right) |
| 5–7 | Haru. In Life 6 sometimes hummed and tired. In Life 7 once, Haru and small Koharu together, Koharu getting only the first two notes. |
| **8** | **The chime. Then nothing.** The arrangement still drifts to its G pedal and waits. After 8 bars the pedal fades without resolving. No bleed. |
| 9 | Koharu, sung, home form, at Haru's pitches |

The Life 8 dusk is the cheapest and probably the most effective cue in the game: it costs no assets, and it works only because the Call has been dependable 50+ times before.

---

## 6. Human Speech: Murmur

### 6.1 Goals and hard constraints

Murmur (canon: "warm, wordless, pitched mumbling with clear emotion and no words") must carry three things and withhold a fourth:

| Must carry | How the player perceives it |
|---|---|
| **Identity** (who is speaking) | Pitch range, tempo, a signature contour, and the speaker's reserved instrument shadowing the voice |
| **Emotion** | Intonation range, loudness, tempo, voice quality (breathy, pressed, creaky), and non-lexical sounds: laugh, sigh, sob, yawn, gasp |
| **Prosody / speech act** (question, call, scold, soothe, announce, argue) | Contour shape and turn-taking rhythm |
| **Must withhold: lexical content** | No phoneme sequence that any listener can parse as a word in any language |

Hard constraints (from the brief's language rule): no intelligible utterance, ever, including trailers; no subtitle; applies equally to diegetic media (radio, television, station and shop loudspeakers, a phone receiver) and to crowds.

### 6.2 Approaches considered

| Approach | Pros | Cons | Verdict |
|---|---|---|---|
| **A. Instrument-as-voice** (Peanuts) | Zero language risk; cheap | Comic by association; cannot carry grief; no identity beyond timbre; not "warm mumbling" (contradicts canon) | Rejected as primary; kept as the *shadow* layer |
| **B. Syllable babble / "Animalese"** | Charming; scalable by text | Syllable-rate consonant-vowel streams are exactly what brains parse as language; accidental words are frequent and culture-specific; sounds like a foreign language rather than like no language | Rejected |
| **C. Real speech, filtered** (low-pass, reversed, time-smeared) | Authentic prosody; cheap | Filtered speech is still partially intelligible to native speakers; reversed speech reads as "a language"; fails the hard constraint under good headphones | Rejected |
| **D. Performed closed-mouth Murmur** (actors act the intent through hums, nasals and glides) with a de-lexicalising process chain | Human, emotive, directable, modest cost; consonants never exist to begin with | Needs skilled performers and firm direction; some conventional hums carry meaning (see ban list) | **Recommended primary** |
| **E. Prosody transfer** (extract pitch and loudness contour from a free spoken take, resynthesise it onto the same actor's sustained hum bank) | Natural contours; mathematically removes phonemes | Tooling cost; can sound synthetic; still carries the source language's rhythm | **Recommended as secondary tool** for long passages (crowds, radio, television) |

### 6.3 The Murmur recipe (D + shadow, with E for beds)

1. **Performance.** Each human is cast with one actor per life-stage voice (Haru: teen, adult, tired parent; Sora: one; Koharu: infant cries are designed, child of 8 is a child actor or adult mimic; Gran: one). Actors work from **intent cards**, not scripts: a card gives the situation, the speech act, the emotion and a length ("scolding, fond underneath, 3 s, ends on a sigh"). There is never a line of text to leak.
2. **Phonetic inventory.** Closed or nearly closed mouth. Allowed: nasals (m, n, ng), a neutral central vowel that never fully opens, pitch glides, breath, voice-quality changes, and universal non-lexical vocalisations (laugh, sob, sigh, gasp, yawn, cough, sneeze, kiss-click to call a cat). Forbidden: plosives, fricatives, sibilants, any clear vowel contrast, any consonant-vowel alternation at syllable rate.
3. **Process chain.** Gentle low-pass between 2.5 and 4 kHz (voices come from above and far away for a 25 cm listener); formant smoothing to blur any residual vowel change; light chest-resonance boost (120 to 250 Hz); per-character room placement. The chain is intentionally mild: the warmth must survive.
4. **The instrument shadow.** At authored beats, the speaker's reserved instrument doubles the Murmur's pitch contour one octave away at low level (piano under Haru, cello under Sora). This is where speech hands over to music and it is the bridge that lets the player move between the two channels. It is used sparingly: in everyday vignettes Murmur is unshadowed.
5. **Signature contours** (identity at a distance):

| Speaker | Range (approx.) | Tempo | Signature contour | Tell |
|---|---|---|---|---|
| Haru | A3–E5 | quick, light | phrases end rising then drop, an echo of the Call's shape | laughs through her nose |
| Sora | E2–B3 | slow, even | flat with a late rise; clears throat before speaking to the cat | hums tunelessly when alone |
| Koharu | infant cries (designed); at 8: D4–A5 | fast, irregular | wide leaps, sudden stops | sings everything |
| Gran | G3–C5, narrower | slow, with pauses | falling steps, like her Foundation line | a "tsk" replaced by a tongue-free exhale (see ban list) |
| Strangers / shopkeepers | per archetype | per archetype | 6 archetype voices × intent library | The broom shopkeeper's scold is a stock contour players learn as a hazard cue |

6. **Crowds and media.** Arcade walla, the wedding and the wake are built by prosody transfer (E) from improvised free speech, resynthesised onto hum banks, then layered: no source audio containing words ever ships. Radio and television are Murmur through a small-speaker impulse response; radio "songs" are a Murmur-sung melody with band, never the Call. A television set also emits its translated-ultrasound whine (§10.3), which is how Mikan (and the player) knows it is on from the next room.

### 6.4 Murmur from a cat's position

- **From above**: standing humans are filtered and slightly delayed against their footsteps, which are large and near.
- **Bent down**: when a face comes to cat height the voice opens up (filter lifts to 6 kHz), dry and close. This is rare and should feel like sunlight.
- **In a lap**: the voice is heard through the body. Low-passed at 500 Hz with strong chest resonance, plus heartbeat and breathing. Lap time is the most intimate mix in the game and the Bond channel for the ear. Purr joins it.
- **Through a wall or the phone**: thin, band-passed, but the signature contour survives. The Life 3 telephone set-up depends on Haru being recognisable through a receiver.

### 6.5 Keeping Murmur from sounding like any real language

Guarantee is impossible; process is not. Every shipped Murmur asset passes these gates:

| Gate | Method | Fail condition |
|---|---|---|
| **Inventory lint** | Automated check for plosive/fricative energy bursts and syllable-rate (4 to 8 Hz) amplitude modulation combined with formant movement | Any clip exceeding thresholds goes back to edit |
| **Machine listening** | Run each clip through multilingual speech recognition and language identification in every shipped localisation language plus a wider set | Any transcription above a confidence threshold, or a confident language ID |
| **Human panel** | Native listeners of every shipped localisation language audition the key story cues (about 150 clips) and a sample of the library, asked only: "Did you hear a word?" | Two or more listeners report the same word |
| **Ban list** | A maintained list of conventionalised non-lexical tokens that carry propositional meaning somewhere: two-part "yes/no" hums (for example the English "mm-hm" / "uh-uh" and comparable Japanese nasal assents), "uh-oh" contours, tongue clicks of disapproval, "shh". | Any match. Allowed instead: sighs, laughs, single hums whose meaning is only emotional. |
| **Reserved contour** | The Call's contour (up a third, down a fifth, short-short-long) may not occur in ordinary Murmur | Any accidental Call |

Known limit: closed-mouth speech still carries the performer's native speech rhythm, and listeners can sometimes identify a language family from rhythm alone. See §17.

---

## 7. Cat Vocal Design

### 7.1 Principles

- Cats are animals, not characters doing voices. No words, no syllable babble, no human-performed "meow" that sounds like a person. Source is recorded cats first, human vocal performers imitating second, both processed into consistent "voice bodies".
- Cat speech text balloons (brief §5.5.4) sit over one vocal gesture per line, chosen by the bark's trigger class, 0.3 to 1.2 s. The vocal does **not** track the text's length or syllables.
- Vocals are gameplay information in combat (telegraphs, states) and identity outside it.
- No pain sounds that suggest injury. Hit reactions are indignation: yelps, spits, "mrrp!" (tone guardrail: no wounds).

### 7.2 Mikan

| Life stage | Voice set | Notes |
|---|---|---|
| Kitten (Life 1) | Recorded set A | High, squeaky, meows too long for the body |
| Young adult / adult / prime (Lives 2–7) | Recorded set B, with small pitch and formant steps per Life | The reference voice. A confident short "mrah". |
| Greying, old, elder (Lives 7–9) | Recorded set C | Lower, breathier, cracks on long meows; purr is louder and slower |

**The collar bell** is foley tied to animation: walk (soft, irregular), trot (regular), sprint (bright, continuous), land (single clear strike), shake (rattle), scratch (muffled). It is Mikan's position marker in a ten-cat fight and the reason Rivals say they can "hear you lose from here". **In Stalk state and while crouch-walking the bell is damped** (the head is low, the bell rests on the chest): this makes stealth feel earned and lets us keep the bell loud otherwise. Whether the bell has any mechanical effect on detection is Combat's decision (§16).

**Home-only vocals**: the greeting trill when running to the Call, kneading purr, the silent meow (mouth opens, almost no sound, for the Life 8 waiting vignettes), the door-meow (long, rising, used when shut in before the cat flap, and again in Life 8 at the entryway).

### 7.3 Vocal vocabulary

| Class | Function | Combat / communication meaning | Example use |
|---|---|---|---|
| **Chirp / trill** | Friendly, attention | Posse acknowledgement of a command; Crew greeting | Selecting a Move in Slow Blink |
| **Meow (short)** | Statement | Generic bark | Taunt balloon |
| **Meow (long, rising)** | Demand | Begging at the fishmonger; door-meow | Scavenging |
| **Mrrp! / yelp** | Indignation | Hit reaction, tiers T1–T2 | Taking a basic hit |
| **Spit** | Sharp defence | Guard or perfect dodge | Dodge reward |
| **Hiss** | Threat | **Yowler debuff Moves** (canon: hisses weaken); enemy heavy-Move telegraph, stage 1 | 300 to 600 ms, noise-based, cuts through any mix |
| **Growl (rising)** | Windup | **Universal telegraph for enemy heavy Moves**: pitch rise length = windup length | Priority 1 audio (§11.2) |
| **Yowl (sustained)** | Challenge | **Yowler taunt Moves**; yowl-sting; Yowl damage type | Standoff |
| **Caterwaul** | Distress, long-distance | The canonical Patch-raid alarm (§8.4) | Sentry under raid |
| **Chatter** | Prey focus | Prowler lock-on; Critter spotted | Ambush available |
| **Purr** | Comfort | **Yowler heal Moves** (canon: purrs heal); Sunspot; lap | Healing has a low, bodily sound, not a sparkle |
| **Shriek** | Fear | `FearTriggered` | Cucumber |
| **Frazzled warble** | Helpless | Looping dizzy trill while Frazzled | Pile-On window |
| **Bolt yelp** | Routed | Receding, with scurry foley and a dust puff | Rout |
| **Slow-blink exhale** | Trust | Nose-Touch Verdict; Loyalty events | Quiet, close |
| **War-cry** | Unison | Pile-On, Zoomies | Chorded across the Posse |

**Style vocal signatures** (canon: each Style has one). A Style biases which classes a cat uses and adds one unique effort sound:

| Style | Register and quality | Signature effort |
|---|---|---|
| Bruiser | Low, chesty, slow attack | A grunt-thud "hwmf" on slams; a sitting sigh |
| Scrapper | Mid, bright, rapid | Staccato "ka-ka-ka" on claw flurries |
| Prowler | Nearly silent; breath and chatter | An inhale before the strike; no vocal on the strike itself |
| Yowler | Widest range, vibrato, most musical | Pitched yowls that land on chord tones of the current music |
| Trickster | Chirpy, irregular, mocking | A descending "mrrow-ow-ow" laugh after a successful bait |

### 7.4 Procedurally varied voices for generated cats

Every cat in the One Cat Schema needs a recognisable voice, but the schema is canon and has no voice field. **Voice is derived deterministically, at load, from existing fields** (no schema change requested):

`voice_params = f(hash(id), style, level, personality, scars)`

| Parameter | Derived from | Range | Audible result |
|---|---|---|---|
| **Voice body** (source sample family) | hash(id) mod N, weighted by Style | N = 10 at full vision (6 at vertical slice) | The basic "who" |
| **Pitch offset** | hash(id); biased down by level and by Bruiser, up by Trickster | ±4 semitones | Size and age |
| **Formant shift** | hash(id), independent of pitch | ±12% | Head size: a big cat with a high voice is a character |
| **Rasp** | hash(id); +1 step per relevant Scar | 0–3 | Scars are audible (Rivals Remember) |
| **Vibrato rate / depth** | personality (Nemesis owns the trait list; we map it) | 0–7 Hz | Nervous versus imperious |
| **Contour preference** | hash(id) | rising / falling / broken / flat | The shape of their meow |
| **Chattiness** | personality | 0.5×–2× bark vocal frequency | Some cats never shut up |

Design budget: 10 bodies × 5 perceptually distinct pitch bands × 3 formant bands × 4 rasp levels gives several hundred combinations, but honest perceptual distinctness is far lower, probably 30 to 50 clearly different voices. With 8 Rivals per district that is enough **if the generator enforces distance within a district**: no two tracked cats in one district may share a voice body and pitch band. This is a constraint Audio asks Nemesis's generator to respect (§16).

Persistence: a recruited Rival keeps voice and sting (canon: Memory, Scars, Title, Fears and Strengths persist). A Chased-Off cat who returns "tougher" comes back with +1 rasp and a slightly lower pitch: the same voice, a worse mood.

### 7.5 The yowl-sting system (personal 2-bar motif per Rival)

**Generation grammar**

- **Length**: 2 bars of 4/4 at the district's brawl tempo.
- **Pitch set**: 3 to 5 notes from the home Clowder's mode (each district has one: Hidamari major pentatonic; Arcade the yo scale; Tsukimi the in scale; Harbour minor pentatonic; Yard blues hexatonic; Heights whole-tone fragment). A Rival exiled to or promoted in another district keeps its birth mode: you can hear where a cat is from.
- **Rhythm**: one of 12 authored rhythm cells per bar, chosen by personality class.
- **Contour**: from the cat's contour preference (§7.4).
- **Voicing**: performed by the cat's own voice (pitch-mapped yowl samples from its voice body) doubled by the district colour instrument.
- **Uniqueness check**: reject any sting within an edit-distance threshold of another living Rival's sting town-wide, and any sting whose first three notes match the Call's or its inversion's contour.

**Mutation: the sting is the audible Memory**

| Event | Change to the sting |
|---|---|
| First met | Plain statement, voice + colour instrument |
| Rank up (`RivalRankChanged`) | Tough: unison. Captain: harmonised in thirds, adds low drum. Boss (procedural promotion): full band hit under it |
| Becomes **Nemesis** | Second voice an octave below; a taiko pickup; quoted inside the Nemesis brawl track |
| Gains a Scar | +1 rasp; one note gains a crack (grace-note break) |
| **Humbled** | Final note bends flat and drops in level; played on a muted instrument while they pay Tribute |
| **Chased Off**, then returns | Transposed down a tone, slower attack, one added note: tougher |
| **Recruited** | The last note resolves upward and **Mikan's bell strikes with it**; the colour instrument is replaced by the Bell Clowder's brass in later statements |
| **Nose-Touch** given | The sting ends on an open fifth with no percussion: respect |
| **Betrayal** (`BetrayalTriggered`) | The bell is removed and the original ending returns, played once in the Morning Sniff. The player should recognise who it is before the portrait appears. |
| Beats Mikan and takes a Title | Triumphant variant: up a fourth, with a cheeky grace note |

**Where stings play**: Standoff; off-screen before an Ambush by that Rival; on the Fence Line when focused; in the Morning Sniff when they did something overnight; faintly, spatialised, when that Rival is nearby but unseen during Night; as a quotation in the Lot theme while they are Crew.

### 7.6 Verdict sounds (`VerdictApplied`)

| Verdict | Sound | Musical resolution of the Verdict vamp |
|---|---|---|
| **Chase Off** | Mikan's full hiss-yowl, the loser's bolt yelp receding far into the distance (long tail: they are leaving the district) | Brass kick; cadence in the district key |
| **Humble** | The loser's flat-ended sting; a small plop of Morsels | A descending two-chord "bow" |
| **Recruit** | Chirp exchange; the resolved sting with the bell | Major resolution with the Swagger cell |
| **Nose-Touch** | Near-silence: two breaths and a tiny soft contact sound, then two notes meeting in unison | No brass, no percussion; the quietest moment on the street |

---

## 8. Sound Effects

### 8.1 Combat impacts tied to hit-stop and screen-shake tiers

Combat owns hit-stop and shake durations. This document defines five **audio impact tiers** and the rule that Combat's game-feel spec maps every hit to one of them. Frame counts below are the assumptions the audio was designed against, to be replaced by Combat's numbers (§16).

| Tier | Typical source | Assumed hit-stop / shake | Layers | Mix behaviour |
|---|---|---|---|---|
| **T0 Whiff** | Missed swing, dodge | none | Air whoosh only (plus spit on a perfect dodge) | No ducking |
| **T1 Light** | Basic attack | 0–2 frames / none | Type transient + small body | No ducking. Minimum 6 variations, pitch randomised ±1.5 semitones, no immediate repeats |
| **T2 Medium** | 1-Paw Move, Ambush opener on a Stray | 3–5 frames / small directional | Transient + body + type sweetener + victim yelp | Ducks ambience 3 dB for 150 ms |
| **T3 Heavy** | 2-Paw Move, crit on Ruffled/Frazzled, Ambush opener on a Rival | 6–10 frames / medium | T2 layers + **harmonic stab** + sub-bass thump + 40 ms pre-silence | Ducks music 4 dB and other SFX 6 dB for the hit-stop length + 120 ms |
| **T4 Finisher** | Frazzle break, Zoomies peak, Pile-On final hit, Rout of a Captain or above, Boss phase change | 10–18 frames + impact frame / large | T3 layers + tutti brass-and-taiko hit + bell + long tail with a reverse-cymbal lead-in where animation allows | Ducks everything else 9 dB; **one T4 owns the mix for 350 ms** (mirrors the "one screen-wide effect at a time" art rule) |

**Behaviour inside hit-stop**

- The transient fires on the contact frame, never later. Latency budget: input-to-sound ≤ 1 frame beyond the animation's contact frame (§14).
- During the freeze, the impact's body layer is **held** (a short granular sustain) and everything else is ducked or low-passed: the ear gets the same frozen frame the eye does.
- On release, the tail and the victim's vocal play, and the shake's direction sets the tail's pan (shake left-to-right, tail travels left-to-right).
- **Pre-silence** (T3+): 40 ms of ducked mix before contact, available only for Moves with authored windups. It makes the hit sound louder without being louder.

**The harmonic stab system.** T3 and T4 impacts include a brass-and-taiko stab (canon: "taiko-and-brass stabs synced to hit-stop"). The stab is chosen at runtime from a small sample set **pitched to the current chord of the brawl music** (the music system exposes current root and quality). Stabs are never quantised: they fire on contact. In-key, off-grid hits read as the player "conducting" the band (Pillar 3), and cost nothing in responsiveness.

**Damage-type palette**

| Type | Transient | Body | Sweetener | Never |
|---|---|---|---|---|
| **Claw** | Fast high "shing": fabric rip, a bamboo-whip crack | Thin | Three-streak whoosh matching the claw-slash glyph | Anything wet or fleshy |
| **Fang** | A wooden "clack-chomp" (castanet, hyōshigi, a trap snapping shut) | Mid | Short shake | Crunch of bone |
| **Thump** | Soft-mallet taiko | Biggest low end; the sub belongs to Thump | Dust puff, rattling environment (roof tiles, crates) | n/a |
| **Yowl** | The attacker's own voice, pitched to a chord tone | Ring-modulated air "wobble" | Visible sound-ring whoosh; nearby glass and bells sympathetically ring | Painful high-frequency content (hard limit above 6 kHz, §12.4) |

Hard rule from the tone guardrails: **no wet, tearing-flesh, bone or blood sounds anywhere in the game.** Hits are wood, cloth, drum, air and voice.

**Posse versus enemy readability**

- Posse hits carry a small bell-gold "tick" (the audio twin of the bell-gold outline tick); Mikan's own hits ring the real collar bell.
- Enemy hits on the Posse are darker (low-passed transient) plus the victim's yelp, which is what tells the player who was hit.
- Enemy heavy Moves always telegraph with the rising growl (§7.3), spatialised, at priority 1. Off-screen telegraphs are boosted 3 dB.
- The controlled cat's sounds are 2D-biased (80% centre); AI Posse cats and enemies are positional.

**Other combat SFX families**: dodge (silk whoosh + spit), guard (padded thud), character switch (the new cat's chirp + a bell-gold whip), Move selection in Slow Blink (see §8.5), Frazzle gauge tone (a rising, soft, pitched rattle per enemy; only the targeted enemy's is audible), Rout dust puff, arena props (bucket, sprinkler, scooter horn, things falling off ledges: each has a "telegraph wobble" before it falls).

### 8.2 Movement and traversal foley

Surfaces: tile roof, wood veranda, tatami, concrete, gravel, grass, metal (boats, rails, awnings as a drum-like bounce), stone steps, wet variants. Gaits: walk, trot, sprint, stalk (near-silent pads). High Road landings are a single clean pad-thud plus bell: precise and light. Jumps have a short breath, not a grunt. Mikan's elder gait (Life 9) has longer ground contact and a faint claw click.

### 8.3 Fears (`FearTriggered`)

Universal fear sting (§5.4), then the Fear's own sound. The Fear's source object carries an idle "tell" so attentive players learn to use the environment.

| Fear | Source idle tell | Trigger sweetener |
|---|---|---|
| Water | Drip, hose hiss, sprinkler tick | Splash with a comic "sploosh", shaken-off spray |
| Loud Noise | Scooter engine ticking as it cools | Horn blast (limited, see §12.4), pan crash |
| Dogs | Chain clink, panting | A bark that is enormous from 25 cm: sub and full band |
| Cucumbers | n/a (silent, which is the joke) | One vibraslap "boing" and a slide-whistle leap |
| Vacuum | Distant motor whine | Roar with Doppler; this sound is also heard at home, where Mikan fears it too |
| Being Outnumbered | n/a | The Posse's unison growl closing in |

### 8.4 Scent-marking, territory and Tribute

| Event | Sound design | Notes |
|---|---|---|
| **Spray** (canon: tail-quiver, sparkle scent cloud, a pop; comedy; never liquid) | (1) Tail-quiver: a rising maraca/shaker rattle, 400 to 600 ms. (2) **The pop**: a dry cork pop with a pitched "poot" from a slide whistle or duck call family at tasteful level. (3) Sparkle cloud: a glittering chord in the Bell Clowder's key, on the collar-bell timbre. | The pop has 8 variations and a 1-in-20 "extra proud" variant. No hiss, no liquid, no stream. |
| Spraying over a rival mark | The rival Clowder's scent tone (§10.4) bends down and "pops" out; the bell chord replaces it | Reads as overwrite |
| **Scent strength** | Heard in Whisker Sense as the tone's steadiness and brightness (§10.4) | 0–100 mapped continuously |
| **Patch claimed** (`PatchChanged` to Bell Clowder) | 2 s Swagger tag at the current Clout arrangement level; the district theme gains its bell layer step | Quantised to the next bar; the pop itself is instant |
| **Patch lost** (`PatchChanged` away) | If witnessed: the rival's sting, rudely. If overnight: heard in the Morning Sniff | No tragic sting |
| **Den opens** (3 of 5 Patches) | The district Boss's signature gesture (§3.6), from the direction of the Den, across the district | An audible invitation |
| **District claimed** (`DistrictClaimed`) | 8 s full Swagger fanfare; every Crew cat within earshot joins a rising yowl chord | The biggest non-combat cue on the street |
| **Sentry posted** | The Crew cat's chirp, a settling "loaf" thump, one bell tick | |
| **Caterwaul** (canon: distress yowl heard across town) | The posted Sentry's **own voice body** performing a long three-phrase yowl, repeated up to three times over about 20 s, spatialised from the Patch's true direction with distance-scaled echo. Uses the salience curve: audible from any district. Music moves to Prowl. | Always at priority 1. Never interrupts a home vignette: Caterwauls cannot fire inside the wall (the clock is paused there). |
| **Tribute on the Doorstep** (`TributeDelivered`) | A cascade of soft "plops" (fish, dried sardines, a croquette), count and pitch range scaled to amount in 5 size tiers; ends with one bell tick. Haru's baffled Murmur in the morning vignette is Narrative's. | Pleasant on day 60: short, varied, skippable by walking past |
| **Morning Sniff** | A wet-free sniff rhythm (three short inhales), then per report line: icon chime + the relevant cat's sting fragment | |
| **Morsel pickup / Stash** | Soft crunchy "nom" tick, pitch-stepped on streaks; Stash deposit is a hollow under-floor thump with a wood echo | |
| **Shiny pickup** | Glass-marble clink with a long bright ring: the rarest, prettiest small sound in the game | Never used for anything else |
| **Clout rank up** | Swagger fanfare at the *new* arrangement level: the player hears their band get bigger | |
| **Life 8: decay** | Scent tones waver and detune faster (triple-rate decay is audible in Whisker Sense). Tribute plops are dull and unpitched, with no bell tick: food nobody wants. | No flies, no rot: not gross |
| **Life 8: carrying food home** | Mouth-full breathing, the bell damped by the lowered head, slow pads. See §9.3. | |

### 8.5 UI

UI sound belongs to the cat world: wood, paper, bell, paw. Menu move = a soft pad tap; confirm = bell tick; cancel = a dry paper flick; Slow Blink menu open = the blink sound (§5.4); Move select = short per-Style chirp + bell tick; Fence Line scroll = claws ticking along a wall; Morning Sniff = sniffs. Never annoying on repeat: all UI sounds under 250 ms, at least 3 variants for anything used more than three times a minute. No UI sound inside home vignettes at all.

### 8.6 SFX rules

- Any SFX played more than 3 times per minute has at least 5 variations; combat T1 hits and footsteps at least 6; no immediate repeats; ±1.5 semitone and ±1.5 dB randomisation.
- Gameplay SFX are 3D with the listener at Mikan (§10.1); UI and music are 2D; the controlled cat's sounds are centre-biased.
- Action SFX trigger within 1 frame of the action or contact frame.
- Street SFX may be stylised and cartoon-sweetened. **Home SFX are naturalistic only**: real foley, no sweeteners, no musical UI.

---

## 9. Silence as a Tool

### 9.1 A vocabulary of silences

| Type | Definition | Used for |
|---|---|---|
| **Breath** | Music tail to ambience-only, 8 to 30 s between loops | Everyday pacing; lets the town be heard |
| **Held beat** | Music stops for one beat or bar | A knocked-over cup at home; Oboro vanishing; pre-silence before T3+ hits |
| **Cut** | Music stops with no tail on a hard edit | A baby's first cry (Life 6); the phone (Life 8) |
| **Withheld line** | One musical line or expected sound is missing while the rest continues | Music-minus-one; the dusk slot |
| **Span** | A long authored period with no non-diegetic music | Life 8, first act |
| **Room tone** | What "silence" actually is: never digital zero | Always |

**Silence is never digital zero.** The floor is room tone (house: wall clock, refrigerator hum, weather; street: district bed at low level), so players never think their audio has failed. The loudness floor is specified in §11.5.

**Silence must be earned.** Lives 1 to 7 are deliberately generous with music at home: every morning and evening has a loop. The wall clock ticks in every home scene of every Life at a level most players will stop noticing by Life 2. Both are investments that pay out once.

### 9.2 The accident (Life 7 → Life 8)

The accident is never shown, explained or specified (canon). The audio never implies its nature: no tyres, no sirens, no hospital sounds.

| Beat | Sound |
|---|---|
| **Last evening of Life 7** | The fullest home arrangement; Haru's complete Call. Nothing marks it as the last. Normal sleep transition. |
| **No time-skip montage** | Every previous Life boundary had a scored montage. This one has none: sleep cuts directly to night. The missing montage is the first withheld thing. |
| **The phone** | Night room tone: clock, rain starting. The house telephone rings. From cat ear height in a sleeping house it is the loudest non-combat sound in the game (within the loud-sound limits of §12.4). It is the same ring that in Life 3 meant Haru's voice from far away. |
| **Sora** | Footsteps, the receiver, Sora's Murmur: short, contour rising, then no contour at all. No instrument shadow. The door. Running steps receding. Rain. |
| **Mikan** | The player has control. The only pitched sound available is the collar bell, and only if they move. |
| **The span begins** | No non-diegetic music at home from the ring until `food_home`. Target span: all of Life 8's home scenes before the food-carrying sequence. |
| **People in black** | Rain on the veranda roof, many slow footsteps at ear height, low crowd Murmur with almost no pitch movement, an incense bell struck once (a new sound, never heard before, never explained), cloth. Koharu's Ornament is heard once, from the real toy piano, diegetic, three notes, stopped by an adult hand. |
| **Waiting** | Room tone, the clock, weather across days. The door-meow (§7.2). The silent meow. The household forgets the bowl: the bowl sounds that marked every evening are absent. |
| **Dusk, outside** | The chime, and no Call (§5.5). |

Rules for the span:

1. No sad music. The game does not tell the player how to feel; it stops telling them anything.
2. The clock does not stop. It keeps ticking, slightly more audible only because nothing covers it.
3. Mikan's bell is never muted in the span. The player's own movement is the house's only music, and standing still is a choice the player can hear.
4. Street music continues in Life 8 (thin, muted, tired). The player can always leave the silence by going out, and will feel what that means.

### 9.3 Breaking the silence: the food-carrying sequence

The first non-diegetic music at home in Life 8 is triggered by the canonical inversion: Mikan carrying food home and leaving it at Sora and Koharu's feet.

- **On the street**, while carrying: the district music drops to its bass alone; the damped bell; pads. As the wall approaches, nothing bleeds from the house (no Call, no loop), which by now the player expects and dreads.
- **Inside**: the food is set down (a small, unglamorous sound). Sora's Murmur: one low syllable-less breath. The cello plays the first two notes of the Call and stops (`unanswered`).
- **Then** the home theme returns as **music-minus-one**: cello Foundation, Countermelody, the Ornament tentative, and the Melody's space left empty. The player's ear supplies the tune. This arrangement is the Life 8 home loop from here on.
- **The bowl**: the first time someone remembers to fill it, the kibble-on-ceramic sound returns, and the Ornament plays the rising third from the Call. Koharu has started to find it.

This is the one place where a street object (Tribute) and the House palette share a cue. It is sanctioned exception 3 in §2.3.

### 9.4 Other authored silences

- **Life 3**: the piano's absence is a withheld line for a whole Life; visit days break it.
- **Life 5, the cushion**: silence unless the player sits there.
- **Oboro**: the Boss whose theme is silence, on the street, played for menace rather than grief. It also rehearses the player in listening to gaps.
- **Nose-Touch**: the only quiet Verdict.
- **Title screen**: bell, Call, then 20 s of house room tone before any loop.

---

## 10. Ambience and Hearing as a Gameplay Sense

### 10.1 The listener

- **Position**: Mikan's head (about 25 cm above ground; follows to the High Road). Not the camera, which is high and far.
- **Orientation**: locked to the area's authored camera yaw, so screen-left is always ear-left. Mikan's facing does not rotate the sound field (it would be disorienting with a fixed camera); instead, a mild forward-focus boost (+2 dB within a 90° cone of Mikan's facing) simulates ear swivel.
- **Vertical filtering**: sources above 1 m (human voices, shop radios, wind chimes) get a slight high-shelf cut and extra early reflections; sources at ground level (insects, drips, paws, leaves, rodents) are dry, close and detailed.
- **Occlusion**: by walls relative to Mikan, even though the camera sees over them. A Rival behind a garden wall is muffled; hopping onto the wall opens the sound. Climbing to the High Road audibly opens the whole district: more distance, less detail.

### 10.2 The salience mix ("a can opening three rooms away is louder than the television")

Attenuation is by **meaning to a cat**, not only by distance. Each emitter has a salience class that sets its attenuation curve and occlusion resistance.

| Salience class | Examples | Behaviour |
|---|---|---|
| **S0 Vital** | The Call; Caterwaul; the bowl being filled; a can or packet opening; a Rival's sting; enemy telegraphs | Near-flat attenuation to very long range; minimal occlusion; never voice-stolen |
| **S1 Interesting** | Other cats' vocals, birds, rodents, fish frying, a door opening at home, Sunspot hum, hidden food | Extended range, light occlusion |
| **S2 Neutral** | Footsteps, weather, water, wind, machines | Physical attenuation |
| **S3 Human noise** | Television, radio, conversation Murmur, traffic far off, crowds | Attenuates **faster** than physical; pushed back and blurred unless a human is addressing Mikan |
| **S4 Threat** | Vacuum, dog, scooter starting, fireworks, broom sweep | Louder and closer than physical; triggers a brief duck of S2 and S3 |

### 10.3 Translated ultrasound

Cats hear well above the human range. We represent that as a design layer: sounds a human could not hear are **transposed down** into the audible range with a consistent glassy, slightly phased character, so players learn "this is cat-only hearing".

| Source | What it tells the player |
|---|---|
| Rodent squeaks inside walls and crates | Critter encounter or hidden Morsels nearby |
| Cathode-ray television whine | A set is on in that house: a human is home (and probably a lap) |
| Vending machine and transformer whine | Landmarks in Kurogane Yard, navigable by ear at Night |
| Bats at dusk on Tsukimi Hill | Phase flavour; a High Road route marker |
| A Prowler's "silent" approach | Faint claw-on-tile ticks only in this layer: an alert player hears an Oboro-style Ambush coming |

An accessibility option replaces or removes this layer (§12.4), and its information is duplicated in Whisker Sense.

### 10.4 Whisker Sense sonification

When Whisker Sense is held, the world low-passes (matching the desaturation), a slow breath-and-heartbeat bed enters, and **scent becomes sound**:

- Each Clowder's scent is a sustained tone on its district colour instrument (§4.2); the Bell Clowder's is the collar-bell timbre, bowed.
- **Scent strength 0–100** maps to level and brightness. Fresh marks are steady and bright; decaying marks waver in pitch and thin out; a contested Patch beats (two tones a fraction apart).
- Scent trails are spatialised along their path: the tone is louder ahead on the trail, so a trail can be followed by ear.
- Rival footprints: soft paw ticks receding in the direction of travel, in that Rival's voice-body pitch.
- Hidden food: a soft sniff-and-sparkle. High Road routes: an airy upward whoosh at the mount point.
- A whole district in Whisker Sense is a chord: all one Clowder's tone when held firmly, a cluster when contested. Claiming a district tunes it.

### 10.5 Ambience per district and time of day

Each district has four phase beds (4-channel loops, 90 to 120 s, two alternates each) plus 20 to 30 spot emitters. Beds are recorded and mixed from ground level.

| District | Morning | Day | Dusk | Night | Signature emitters (hearing as landmarks) |
|---|---|---|---|---|---|
| **Hidamari Lane** | Sparrows, futons being beaten, a kettle through a window | Cicadas in summer, laundry snapping on poles, a bicycle bell, school chime far off | Cooking sounds, bath water, crows, the Dusk chime nearest and clearest | Crickets, a wind chime, one television whine, Daifuku snoring on his wall (audible from two Patches away: a homing beacon to the Boss) | Wind chimes that differ per garden; the cat flap of Haru's House |
| **Akane Arcade** | Shutters rattling up, crates dropped, ice poured | Dense crowd Murmur, vendors' call-contours, a croquette fryer (S1: very attractive), shop jingles, radio | Shutters down one by one, sweeping, the last fryer | Buzzing sign tubes, a moth on glass, dripping awnings, rats | The fishmonger's knife and ice (begging spot); the broom shopkeeper's approaching sandals (hazard cue) |
| **Tsukimi Hill** | Sweeping on stone, a single suzu bell | Wind in bamboo (creaks and knocks), few visitors' footsteps on gravel, coins and a clap at the shrine | Crows leaving, bats arriving (translated ultrasound), lantern flames lit | The fullest bed: owls, bamboo, distant festival-like drum that may or may not be real, many unseen cats | Bamboo knocks mark High Road routes; stone lanterns have a faint flame flutter where Scent Posts are |
| **Shiosai Harbour** | Diesel boats leaving ("pon-pon" single-cylinder engines), gulls, winches | Surf on tetrapods (deep, hollow), nets dragged, ice crates, rope creak | Boats returning, fish being unloaded (S0-adjacent: every cat in town hears it) | Halyards tapping masts, bell-buoy, water slapping hulls | The ice house hum; the gulls (Critter hazard) circle audibly before diving |
| **Kurogane Yard** | First train, points switching | Shunting, a level-crossing bell, a platform loudspeaker in Murmur, vending machine hum | Commuter footsteps in waves, bicycle stands | Sodium-lamp buzz, transformer whine, a freight train passing through every few minutes, which resets the music's groove (§4.2) | Rails sing before a train arrives: a hazard telegraph by ear |
| **Kasumi Heights** | Mist drip, wooden sandals on stone stairs | Steam vents (periodic, each with its own rhythm), running hot-spring water, inn sliding doors | Bath buckets, dinner trays, a shamisen lesson in Murmur-equivalent (instrument only) | The lighthouse horn at long intervals (the district theme's pedal), wind | Steam vents as timed hazards and Fear sources (Loud Noise, Water) |

**Haru's House** has its own bed per Life (the house ages: a new refrigerator hum in Life 5, a mobile over the crib in Life 6, an emptier reverb in Life 3 and Life 8), and the wall clock throughout.

**Weather**: rain is recorded per surface at cat height (leaves, tile, tin, puddles, umbrella fabric from below). Rain is thematically reserved-adjacent: it opens Life 1 and returns in Life 8. It may occur at other times but never during a happy home vignette in Lives 5 to 7.

**Humans as weather**: daytime human footsteps are large, close, low-frequency events with distinct shoe types; a broom is a wide sweeping whoosh; a scolding Murmur has a stock contour. Humans are hazards, never enemies, and their sounds are firm but never frightening.

---

## 11. Mixing

### 11.1 Mix bus structure

| Bus | Content | Target level (relative to master reference) | Notes |
|---|---|---|---|
| **Master** | Everything | 0 dB, true-peak limiter | Loudness profiles in §11.5 |
| **Music / Street** | Roaming, brawl, stingers | −8 dB roam, −5 dB brawl | Side-chained from Call, Impacts, Vocal-critical |
| **Music / Home** | Home loops, accents, story cues | −10 dB | Never compressed |
| **The Call** | The sung Call only | −4 dB | Own bus; ducks all music; never ducked |
| **Murmur** | All human voice, crowds, media | −9 dB | Sits *behind* SFX by default: speech is not privileged in this game |
| **Cat Vocal / Critical** | Telegraphs, Caterwaul, yowl-stings, Mikan | −5 dB | |
| **Cat Vocal / Flavour** | Barks, reactions, Crew chatter | −10 dB | Voice-limited |
| **Impacts** | Combat T1–T4 | −4 dB (T4 peaks define the ceiling) | Light bus compression |
| **SFX / Player** | Foley, bell, Moves | −7 dB | |
| **SFX / World** | Props, humans, Critters | −9 dB | |
| **Ambient** | Beds and emitters | −14 dB (−10 dB at Night) | |
| **Sense** | Whisker Sense tones, translated ultrasound | −10 dB | |
| **UI** | Interface | −10 dB | Bypasses Slow Blink filters |

### 11.2 Audio priority

When voices or attention compete (highest first):

1. **Enemy telegraphs aimed at any Posse cat; Caterwaul; the Call.** Never stolen, never ducked.
2. **The controlled cat's actions and hits received.**
3. **T3–T4 impacts and state changes** (Frazzled, Routed, Zoomies, Pile-On).
4. **Rival yowl-stings; Posse AI cats' Moves.**
5. **Other enemies' actions** (nearest first), T1–T2 impacts.
6. **Music.**
7. **UI** (outside Slow Blink; inside Slow Blink UI rises to 2).
8. **Murmur and world SFX.**
9. **Ambience.**

Note the inversion against the template's default rule ("dialogue always takes priority"): in this game human speech is deliberately low priority, because a cat does not attend to it. The exception is a human addressing Mikan directly at home, which rises to priority 4.

**Voice limits (starting values)**: total real voices 64 PC / 40 handheld; impacts 8; cat vocals 6 concurrent (2 reserved for priority 1); footsteps 6; Murmur 4; ambience emitters 12. With 10 combatants this forces culling: only the 4 nearest non-Posse cats have full foley.

### 11.3 Ducking rules

| Trigger | Ducks | Amount | Attack / hold / release |
|---|---|---|---|
| The Call | All music, Ambient | −9 dB / −6 dB | 200 ms / length of Call / 1.5 s |
| Enemy heavy-Move telegraph | Music, Flavour vocals | −3 dB | 30 ms / windup / 200 ms |
| T2 impact | Ambient | −3 dB | 5 ms / 150 ms / 150 ms |
| T3 impact | Music −4 dB; other SFX −6 dB | | 5 ms / hit-stop + 120 ms / 200 ms |
| T4 impact | Everything else −9 dB | | 5 ms / 350 ms / 300 ms |
| Slow Blink | Music low-pass 900 Hz and −8 dB; World SFX pitched and −6 dB | | 0 frames / state / 100 ms |
| Pile-On dust cloud | Music muted | | 50 ms / cloud / returns on final hit |
| Yowl-sting (Standoff) | Music to bass note only | | 1 beat / 2 bars / on bar line |
| Human addresses Mikan at home | Home music −4 dB | | 300 ms / phrase / 800 ms |
| Lap | High frequencies of everything outside the lap, low-pass 2 kHz | | 1.5 s / state / 1 s |
| Caterwaul | Music −6 dB and to Prowl state | | 100 ms / 20 s / 2 bars |
| Whisker Sense | All but Sense and priority 1, low-pass 1.2 kHz, −6 dB | | 120 ms / state / 400 ms |

### 11.4 Mixing rules

- **One full-spectrum event at a time.** Only one T4 may own the sub-bass (below 80 Hz) in any 350 ms window; later arrivals lose their sub layer, not their transient.
- **Frequency lanes**: sub and low end belong to Thump and taiko; 300 Hz to 3 kHz is protected for cat vocals and telegraphs (music arrangements for brawl leave a notch here: brass riffs sit in rests around the vocal band); above 6 kHz belongs to Claw transients, the bell and sparkle.
- **The bell is always findable.** Mikan's collar bell has a reserved narrow band around its fundamental and first partial that no brawl instrument may sustain in.
- **Handheld speaker check**: every priority 1 to 3 cue must be identifiable on a small mono speaker with no content below 200 Hz. Sub-only information is forbidden.
- All volumes are player-adjustable per group (§12.4). Default mix must work on headphones, television speakers and handheld speakers.
- Home music is never compressed or limited beyond the master safety limiter.

### 11.5 Loudness and dynamic range

Starting targets, to be verified against platform requirements at certification time.

| Profile | Integrated target (30-minute representative session) | True peak | Loudness range intent | Default on |
|---|---|---|---|---|
| **Wide** (home theatre, good headphones) | −24 LUFS ±2 | −1 dBTP | Wide: combat peaks up to +14 LU over home scenes | Console docked |
| **Standard** | −18 LUFS ±2 | −1 dBTP | Moderate: +9 LU | PC |
| **Handheld / Night** | −16 LUFS ±2 | −2 dBTP | Narrow: +6 LU, with a multiband compressor | Handheld mode, small speakers |

| Content | Short-term loudness target relative to the profile's integrated target |
|---|---|
| Brawl (tier B/C) | +4 to +6 LU |
| Scuffle (tier A) | +2 to +3 LU |
| Roaming, Day | 0 LU |
| Roaming, Night | −3 LU |
| Home vignettes | −6 to −8 LU |
| The Call | Peaks at roaming level even at home: it is the one loud thing in a quiet house |
| Life 8 span | −14 to −18 LU, with an absolute floor of about −50 LUFS momentary so room tone is always present |

**Life 8 safety rule.** Players will turn their volume up in the silent span. While Life 8 is active, street content is capped 4 LU lower than normal and the first T4 impact after leaving the house is forced down one tier, so the game never punishes the player for leaning in.

Asset delivery loudness (per file) is specified in §13.2.

---

## 12. Accessibility

**Requirement from the brief and this assignment**: the story must remain comprehensible for deaf and hard-of-hearing players. Because Pillar 1 forbids subtitles for human speech, the usual solution is unavailable. The visual equivalents below are requirements Audio places on Art, UX and Narrative; their look is those departments' to design, and the project-wide standard belongs in `design/accessibility-requirements.md` (UX owns it).

### 12.1 The Redundancy Rule (applies to all players, not an option)

**No story beat may rest on audio alone.** Every leitmotif entrance, Murmur emotion and silence that carries story must coincide with a visual carrier: signature colour, staging, object, light, a Sense Icon. This is consistent with the brief's own mitigation for wordless-story legibility (signature colours *and* instruments), and it is the reason each human's instrument was bound to their colour in §2.2.

Test: a muted playthrough (§15, test 2).

### 12.2 Visual equivalents required for story audio

| Audio carrier | Required visual equivalent | Always on or option | Owner |
|---|---|---|---|
| **The Call** | A "Call glyph": three small marks whose heights trace up-a-third, down-a-fifth, in the singer's signature colour, drifting from the direction of home across the screen edge and HUD. Incomplete Calls show incomplete glyphs (two marks). | **Always on for everyone.** It is a core story device, and the Life 8 dusk only works for deaf players if the glyph has appeared at every previous Dusk and then does not. | Art + UX |
| **Dusk bleed / pull home** | Warm light bleed from the direction of home at Dusk; the Call glyph; window light of Haru's House visible from the High Road | Always on | Art |
| **Murmur emotion and speaker** | "Murmur ribbon": a wordless ribbon or squiggle bubble in the speaker's signature colour whose shape follows the pitch contour and whose size follows loudness (smooth for soothing, jagged for scolding, broken for crying). Contains no glyphs that could read as text. | Option, default off; default on when the "Hearing support" preset is chosen at first launch | UX + Art, vocabulary with Narrative |
| **Leitmotif presence** (who the music is about) | When a reserved instrument is carrying a line, a small colour mote in that person's colour pulses at the screen edge in time with it | Option (part of Hearing support) | UX |
| **Home theme line count** (who is in the house) | Already visual through shoes, objects and room dressing; requirement on Narrative and Art that each line's entry or exit has a matching object change in the same vignette | Always (Redundancy Rule) | Narrative + Art |
| **Music-minus-one / the silence span** | The signature yellow is absent from the house palette; Haru's objects remain but untouched; the Call glyph does not appear at Dusk; with Hearing support on, the leitmotif motes show three colours and a visibly empty fourth position | Always, plus option | Art + UX |
| **Diegetic story sounds** (phone ringing, baby crying, incense bell, fireworks, doorbell) | Sense Icons over Mikan (canon vocabulary: pictograms of what a cat would grasp, for example a jagged "loud" icon with an ear twitch) plus animation: ears snapping toward the source. Never text captions for home sounds. | Sense Icons always; an extended sound-icon set as an option | Narrative (vocabulary) + UX |
| **Purr, lap, heartbeat** | Haptics (§12.3) and a soft pulsing vignette | Haptics on by default where available | UX |

### 12.3 Visual and haptic equivalents required for gameplay audio

| Audio cue | Equivalent |
|---|---|
| Off-screen Rival sting before an Ambush | Edge-of-screen directional indicator in the Rival's Clowder colour, with their portrait chip, for the same 1.5 to 3 s |
| Enemy heavy-Move telegraph (rising growl) | Visual windup flash and ground marker (Combat and Art own; Audio requires that one exists for every telegraphed Move) |
| Caterwaul | Directional HUD marker with district colour and the Sentry's portrait; persistent for the event's duration |
| Rival identity by voice | Name-card and outline already cover this; additionally a small unique "sting shape" glyph (the sting's contour as a line) on the name-card and the Fence Line |
| Damage type | Glyph bursts already differ by type (Art); requirement that they remain distinguishable without sound |
| Frazzle riser | Gauge and fur-puff animation; countdown ring on the Frazzled enemy |
| Paw filled | HUD pop and a controller pulse |
| Whisker Sense tones | Already primarily visual; conversely, the sonification makes scent partly navigable for low-vision players |
| Translated ultrasound | Duplicated in Whisker Sense visuals; optional small ear-twitch indicator toward the source |
| Hazard approach (broom, train) | Shadow and ground-shake visuals; directional indicator option |

**Haptic vocabulary** (controller rumble; the handheld's built-in rumble): the Call = three pulses, short-short-long, the second stronger; purr = continuous low rumble with breathing modulation; lap heartbeat = slow double pulse; impact tiers T2–T4 = three strengths with hit-stop-length duration; Paw filled = one crisp tick; Caterwaul = a long rising rumble. Haptics have their own intensity slider and off switch.

### 12.4 Audio options

- Separate volume sliders: Master, Music, the Call (yes, its own), Human voices (Murmur), Cat voices, Effects, Ambience, Interface.
- **Mono** output; **balance** control; left/right swap.
- **Loudness profile** selector (§11.5) and a "Night mode" compressor.
- **Reduce sudden loud sounds**: caps the phone ring, fireworks, dog bark, scooter horn, vacuum and T4 impacts with a slower attack and −6 dB ceiling.
- **High-frequency comfort**: removes or lowers translated ultrasound, cicadas, electrical whines, Yowl-type ring and the bell's upper partials (tinnitus and hyperacusis). Hard limit regardless of option: no sustained narrow-band tones above 6 kHz louder than −30 dB relative to the mix.
- **Low-frequency independence**: nothing gameplay-critical lives only below 200 Hz or only above 4 kHz.
- **Hearing support preset**, offered at first launch in plain system text: turns on Murmur ribbons, leitmotif motes, extended sound icons, all directional indicators and strong haptics.
- **Music-off playability**: with Music at zero, the Call (own bus), stings (Cat voices) and all state cues still function.
- **Combat audio cue assist** (for low-vision players): boosts priority 1 cues, adds a distinct tone when an enemy becomes Frazzled, and announces Posse switching with each cat's chirp at a fixed pan position.

### 12.5 Honest limit

Visual equivalents can carry *information*: who, where, what changed. They cannot fully carry what the music does to a hearing player in Life 8. The requirement in this document is comprehension parity, tested (§15). Emotional parity is a goal we should design toward with Art and Narrative, and should not claim.

---

## 13. Technical Specifications

### 13.1 Middleware recommendation

The engine is OPEN (brief §11.1: Unity recommended, Godot 4 the alternative). Changing or adopting audio middleware requires technical-director approval; this is a recommendation only.

| Option | Pros | Cons | Fit |
|---|---|---|---|
| **FMOD Studio** | Mature adaptive-music authoring (multi-track timeline, transition regions, parameters); strong Unity integration; a Godot integration exists; good profiler and live mixing; supports multichannel streams; indie-friendly licensing tiers | Licence terms and thresholds must be checked for our budget and platforms; the Godot integration is not first-party and its maintenance status must be verified; middleware adds a build dependency per platform | **Recommended** |
| **Wwise** | The strongest interactive-music hierarchy (states, stingers on beat, music switch containers); best-in-class profiling; HDR mixing built in | Steeper learning curve for a small team; licensing model must be checked; more tool than our SFX needs | Strong alternative if the composer or sound designer already knows it |
| **Engine-native audio** | No dependency or licence | Unity's built-in audio lacks beat-synchronised layered music tools; Godot 4's interactive/synchronised audio streams are promising but young, with no comparable profiler or mixer snapshots. The adaptive system in §5 would have to be custom code. | Acceptable only for the combat prototype |

**Recommendation: FMOD Studio**, decided together with the engine. Reasons specific to this game: (1) the score is a stem-synchronised, beat-quantised, parameter-driven system, which is what FMOD's timeline and transition model is built for; (2) the composer and sound designer can author and audition the Dusk bleed, phase layers and brawl tiers without engineering time; (3) snapshot-based mixing covers Slow Blink, Whisker Sense, lap and Life 8 states; (4) it works with either candidate engine, which matters while the engine is undecided.

Until the engine is chosen, all audio design stays engine-agnostic: this document describes behaviour, events and parameters, not API calls. Audio engine code is delegated to the lead programmer's team.

**Runtime parameters the game must expose to audio**

| Parameter | Source | Range |
|---|---|---|
| `phase`, `phase_progress` | Clock | Morning/Day/Dusk/Night; 0–1 |
| `life_index` | Clock | 1–9 |
| `district_id`, `patch_id`, `patches_held` | Territory | |
| `clout_rank` | Economy | 1–7 |
| `music_state` | Audio state machine (§5.3) | Roam/Prowl/Stalk/Standoff/Scuffle/Brawl/Named/Verdict |
| `encounter_tier` | from `EncounterStarted` participants | A/B/C |
| `slow_blink`, `whisker_sense`, `in_lap`, `inside_wall` | Combat, player, Narrative | bool |
| `frazzle_target` (0–100), `is_frazzled` | Combat | |
| `nerve_ratio_mikan` | Combat | 0–1 |
| `home_bearing`, `home_distance` | World | degrees; metres |
| `chord_root`, `chord_quality` | Music timeline markers, read back by the impact system | |
| `impact_tier`, `damage_type`, `is_posse` | Combat, per hit | T0–T4; Claw/Fang/Thump/Yowl |
| `voice_params` | derived per cat (§7.4) | |
| `bond` | Narrative | 0–10 (warmth of the lap layer) |

### 13.2 Format requirements

| Type | Source | Runtime | Sample rate | Delivery loudness | Loading |
|---|---|---|---|---|---|
| Music (stems) | WAV 48 kHz / 24-bit | Vorbis or platform codec, about 112–160 kbps per stereo stem; stems of one arrangement interleaved into one multichannel stream | 48 kHz | Full mixes at −16 LUFS integrated, −1 dBTP; stems summed to that | Streamed |
| Story cues, the Call | WAV 48/24 | High-quality compressed (the Call at the highest setting; it is the most important asset) | 48 kHz | Cue-specific | Streamed; the Call resident in memory |
| SFX | WAV 48/24 | Compressed in memory; ADPCM for very short, very frequent sounds (T1 hits, footsteps) | 48 kHz (24 kHz allowed for low-frequency-only layers) | Peak-normalised per category: impacts −3 dBFS, foley −9 dBFS, UI −12 dBFS | Resident, in banks |
| Cat vocals | WAV 48/24 | Compressed in memory | 48 kHz | −6 dBFS peak, level-matched by class | Resident by voice body |
| Murmur | WAV 48/24 | Compressed, streamed for long clips | 48 kHz mono | −23 LUFS, −3 dBTP | Per-Life bank |
| Ambience beds | WAV 48/24, 4 channels | Compressed, streamed | 48 kHz | −30 LUFS | Streamed |

### 13.3 Naming convention

`[category]_[context]_[name]_[variant].[ext]`

| Category | Prefix | Examples |
|---|---|---|
| Music | `mus_` | `mus_home_L5_evening_loop.ogg` · `mus_explore_hidamari_day_stems.ogg` · `mus_brawl_harbour_loop.ogg` · `mus_boss_botan_p3_loop.ogg` · `mus_story_L8_food_home.ogg` · `mus_sting_verdict_recruit_01.ogg` |
| The Call | `mus_call_` | `mus_call_haru_L7_home_01.ogg` · `mus_call_sora_L4_wrong_02.ogg` · `mus_call_koharu_L9_home_01.ogg` |
| Sound effects | `sfx_` | `sfx_combat_impact_claw_t3_04.ogg` · `sfx_combat_pileon_cloud_loop.ogg` · `sfx_turf_spray_pop_06.ogg` · `sfx_home_bowl_kibble_02.ogg` · `sfx_foley_bell_trot_03.ogg` |
| Cat vocals | `vox_` | `vox_mikan_adult_trill_03.ogg` · `vox_body04_hiss_02.ogg` · `vox_boss_sabi_yowl_long_01.ogg` |
| Murmur | `mur_` | `mur_haru_L2_scold_fond_03.ogg` · `mur_crowd_arcade_day_loop.ogg` · `mur_media_radio_song_01.ogg` |
| Ambience | `amb_` | `amb_env_harbour_night_loop_a.ogg` · `amb_emit_yard_vending_hum_loop.ogg` · `amb_home_L8_room_loop.ogg` |
| Interface | `ui_` | `ui_menu_confirm_01.ogg` · `ui_blink_open_01.ogg` |

Lower case, underscores, two-digit variants, `_loop` suffix for loops, `L{n}` for Life-specific assets.

### 13.4 Memory and performance budget (starting values, handheld is the constraint)

| Pool | Handheld | PC |
|---|---|---|
| **Total audio memory** | **96 MB** | 192 MB |
| Core bank (Mikan, UI, common combat, impacts, the Call, bell) | 22 MB | 32 MB |
| Cat vocal bodies (10 bodies, resident subset of 6 + Bosses on demand) | 16 MB | 28 MB |
| Moves and Style banks (loaded per Posse and encounter) | 14 MB | 24 MB |
| District bank (one loaded, next one pre-warmed) | 14 MB | 28 MB |
| Home bank (current Life: Murmur, foley, accents) | 10 MB | 20 MB |
| Streaming buffers (music, ambience, long Murmur) | 10 MB | 24 MB |
| Middleware, DSP, reverb | 10 MB | 36 MB |

| Other budget | Handheld | PC |
|---|---|---|
| Real voices | 40 | 64 |
| Virtual voices | 256 | 512 |
| Concurrent streams | 8 (hence interleaved stems) | 16 |
| Audio CPU | ≤ 8% of one core average, ≤ 15% peak | ≤ 5% |
| Reverb instances | 2 (district, house) | 3 |
| Audio latency (input to sound) | ≤ 50 ms total, with trigger within 1 frame | ≤ 40 ms |
| Disk (all audio) | ≤ 550 MB | ≤ 900 MB |

The disk figure is driven by music: roughly three hours of score in stems (§14). It is the first budget likely to be challenged.

---

## 14. Asset List Estimate

Estimates for the **full vision**, accurate to perhaps ±30%, with the **vertical slice** (Lives 1–2, Hidamari Lane, Daifuku) alongside. Timelines are not estimated: team size is unknown (brief §11.2).

### 14.1 Music

| Group | Full vision | Vertical slice |
|---|---|---|
| Home loops (9 Lives × morning / evening / waiting-up, sharing stems) | 26 min | 6 min |
| Authored story cues (about 30) | 28 min | 5 min |
| Vignette accents (about 45 × 4–12 s) | 6 min | 1.5 min |
| Time-skip montages (7; none into Life 8) | 8 min | 1 min |
| District roaming, Day family (6 × about 3 min) | 18 min | 3 min |
| District roaming, Night (6 × about 3 min) | 18 min | 3 min |
| District brawl arrangements (6 × about 2.5 min) | 15 min | 2.5 min |
| Boss themes (6, multi-phase) | 25 min | 3.5 min |
| Captain, Nemesis, Critter, dog set-piece, raid defence | 12 min | 3 min |
| The Lot (4 levels), Fence Line, title, menu | 9 min | 4 min |
| Life 9 last-walk suite and `called_home` | 8 min | n/a |
| Credits | 5 min | n/a |
| Stingers and tags (Verdicts, outcomes, Swagger tags × 4 levels, Zoomies passages, Pile-On, Clout) | about 90 items, 6 min | about 30 items |
| **Total** | **about 185 min, plus 90 stingers** | **about 33 min** |
| The Call: recorded statements (Haru × 3 life-stage voices × forms and moods; Sora attempts; Koharu; Haru + Koharu) | about 60 takes | about 12 takes |
| Yowl-sting system: 12 rhythm cells, 6 modes, authored templates for 6 Bosses; generated at runtime from vocal samples | system + 6 authored | system + 1 authored |

Live players are recommended for all reserved timbres (piano, cello, toy piano, reed organ, voice): they are the story, and sample libraries will read as generic. Street ensembles can be a hybrid of live soloists and samples.

### 14.2 Sound effects, vocals, Murmur, ambience

| Group | Basis | Full vision (files) | Vertical slice |
|---|---|---|---|
| Combat impacts | 4 types × 5 tiers × 5–8 variations + harmonic stab sets (12 roots × 2 qualities × 2 tiers) | about 190 | about 120 |
| Moves, Knacks, Zoomies | about 60 Moves × about 5 assets; 5 Style Zoomies + Boss uniques | about 380 | about 100 |
| Combat states (Slow Blink, Paws, Frazzle, Rout, Pile-On, switch, dodge, guard, props, Fears) | | about 220 | about 150 |
| Mikan vocals | 3 recorded sets × about 28 classes × 4–6 variations | about 400 | about 260 |
| Mikan and cat foley, incl. bell | 12 surfaces × 4 gaits × 6 + bell × 8 states × 6 + landings | about 420 | about 180 |
| Cat voice bodies (procedural Rivals and Crew) | 10 bodies × about 20 classes × 4 variations | about 800 | about 480 (6 bodies) |
| Boss vocals | 6 Bosses (7 cats) × about 35 | about 245 | about 35 |
| Critters | 5 kinds × about 20 | about 100 | about 20 (crow) |
| Territory, Tribute, economy | §8.4 | about 140 | about 90 |
| Murmur: household | 4 humans, 9 life-stage voices, about 40 intents × 2–3 takes + about 150 bespoke story lines | about 1,050 | about 220 |
| Murmur: strangers, crowds, media | 6 archetypes × 25 + beds + radio/television | about 230 | about 50 |
| Home foley and objects per Life | bowl, doors, cat flap, clock, phone, objects to knock over | about 320 | about 110 |
| Ambience beds | 6 districts × 4 phases × 2 alternates + house × 9 Lives × 2 + weather | about 90 | about 16 |
| Ambience emitters | about 25 per district + house + translated ultrasound | about 240 | about 50 |
| Whisker Sense | 7 Clowder tones × states + sense one-shots | about 60 | about 25 |
| Human hazards | footsteps × shoe types × surfaces, broom, bicycle, scooter | about 180 | about 60 |
| UI | | about 120 | about 80 |
| **Total** | | **about 5,200 files** | **about 2,050 files** |

The vertical slice is about 40% of the full file count because the systems (voice bodies, impacts, Mikan, UI) are front-loaded. This is consistent with the brief's scope warning: audio's cost is in the foundations, not the content breadth.

### 14.3 Audio scope tiers

| Tier | Audio content |
|---|---|
| **Prototype (MVP)** | Placeholder impact audio for T1–T4, one hit-stop integration test, Slow Blink mix state, Pile-On placeholder, one looping brawl track with a harmonic stab test. No middleware required. Question to answer: *do tiered impacts with in-key stabs make conducting four cats feel better?* |
| **Vertical slice** | Final quality for Lives 1–2: the Call (Haru teen), home lines Foundation + Melody, Hidamari Day and Night, Scuffle/Brawl tiers, Daifuku, 6 voice bodies, yowl-sting generator v1, Murmur for Haru and Gran, the Dusk chime and bleed, Whisker Sense sonification, accessibility visual twins for the Call. Question: *do players come home when called, and can they retell Lives 1–2?* |
| **Alpha** | All districts with temp music from the stem templates; all states wired |
| **Full vision** | Everything in this document |
| **Fallback cut** (brief §10: 4 districts) | Merged districts share one roaming theme with two colour-instrument variants; Night arrangements become stem remixes instead of separate recordings (saves about 18 min); voice bodies 8; Boss themes stay six; **the leitmotif system, the Dusk bleed, Murmur and the Life 8 design are never cut** |

---

## 15. Validation and Playtest Protocols

| # | Test | Method | Pass condition (starting values) |
|---|---|---|---|
| 1 | **Leitmotif legibility** | Unbriefed players finish Lives 1–2 (later 1–5), then hear four instrument clips | ≥ 70% match piano to Haru and reed organ to Gran; later ≥ 60% for cello and toy piano |
| 2 | **Muted playthrough** (accessibility) | A second cohort plays with all audio off and Hearing support on; both cohorts retell the human story | Muted cohort's story-beat recall ≥ 80% of the sound-on cohort's |
| 3 | **Come-home test** | Telemetry: where is the player 90 s after the first Call at Dusk? | ≥ 50% moving toward home in Lives 1–2 without any UI prompt |
| 4 | **Eyes-closed Rival** | After 2 hours, play 6 stings; ask which is "theirs" | ≥ 60% identify their most-fought Rival |
| 5 | **Murmur word test** | §6.5 gates | Zero confirmed words; any clip flagged by 2+ panel listeners is replaced |
| 6 | **Combat by ear** | Play combat audio only | Players identify damage type ≥ 75%, Frazzle break ≥ 95%, Pile-On 100% |
| 7 | **Telegraph audibility** | Heavy-Move telegraphs during a 10-combatant fight with music at default | Detected ≥ 90% on handheld speakers |
| 8 | **Fatigue** | 4-hour sessions; music slider telemetry | < 10% of players lower Music below 50% by hour 4 |
| 9 | **Latency** | High-speed capture of contact frame versus audio onset | ≤ 1 frame on all platforms; Slow Blink entry sound on the press frame |
| 10 | **Life 8 dusk** | Unbriefed players at the first Life 8 Dusk, think-aloud | A majority notice the missing Call without prompting |
| 11 | **Budget conformance** | Profiler capture in the heaviest scene (Arcade, Day, 10 combatants, rain) | Within §13.4 on handheld hardware |

---

## 16. Assumptions for creative-director review

Decisions made inside Audio's boundary where the brief was silent, and requests that touch other owners.

**Decided here (Audio's boundary)**

1. The Call has two forms: Home (3–5–1, minor third up) and Waiting (1–3–6, major third up). Canon pitches at home: E4–G4–C4.
2. The Call is sung on one open vowel or hummed, never on syllables, so it survives the player renaming Mikan.
3. Instruments per human: Haru = upright piano, Sora = cello, Koharu = toy piano (later Haru's piano), Gran = reed organ. The brief requires "an instrument" each but does not name them.
4. The home theme is four lines owned by the four humans; Gran's line is the bass and is taken over by Sora's cello from Life 5.
5. Mikan's street theme (the Swagger) is the Call's cell in brass.
6. District colour instruments, modes, tempos and Boss musical concepts (§3.6, §4.2).
7. Murmur method: closed-mouth performance from intent cards, with process chain, instrument shadow and prosody transfer for crowds.
8. Voice is derived from existing Cat Schema fields; no new field.
9. Five audio impact tiers T0–T4.
10. Human speech is low mix priority by default.

**Proposed staging that belongs to Narrative** (flagged, not assumed approved)

11. The original Yunagi Dusk chime as a diegetic daily event in every district.
12. In Life 3, Gran taps the bowl instead of singing the Call.
13. The house telephone ringing in Life 3 as Haru calling home, so that the Life 8 ring carries a false hope.
14. No time-skip montage between Lives 7 and 8.
15. The incense bell as a new, unexplained sound in Life 8.
16. Botan's theme hides the inverted Call, and a human sings Botan's own call in the final phase.
17. Sora's failed and then successful attempts at the Call in Life 4; Haru and Koharu singing together once in Life 7.
18. The home vacuum cleaner exists and is the source of the Vacuum Fear's sound.

**Requests to other owners**

19. **Brief §6.1 event contracts**: Audio is listed as a consumer of `EncounterStarted`, `FearTriggered`, `PatchChanged` and the clock events. Audio also needs `CatRouted`, `EncounterEnded`, `VerdictApplied`, `RivalRankChanged`, `BetrayalTriggered`, `DistrictClaimed`, `TributeDelivered`, `BondChanged` and `RaidResolved`.
20. **Combat**: a per-hit event carrying `impact_tier`, `damage_type`, attacker and victim; state events for Slow Blink enter/exit, Paw filled, Ruffled, Frazzled start/end, Zoomies start/end, Pile-On phases; windup durations for telegraphed Moves; confirmation or replacement of the assumed hit-stop frame counts in §8.1; a decision on whether the collar bell affects detection; a decision on whether hearing an off-screen sting gives the player a mechanical reaction window.
21. **Territory**: a `CaterwaulStarted` event (patch_id, sentry_id) or equivalent; confirmation that Caterwauls cannot fire while Mikan is inside the wall.
22. **Nemesis**: the personality trait list (to map vibrato, chattiness and rhythm cells); a generator constraint that no two tracked cats in one district share voice body and pitch band; a "nearby but unseen" query for spatialised stings at Night.
23. **Narrative**: vignette timeline markers for accents; the intent-card set per vignette pool; the Sense Icon vocabulary for diegetic sounds.
24. **Art / UX**: the Call glyph (always on), Murmur ribbons, leitmotif motes, sting-shape glyphs, directional indicators (§12).
25. **Technical director**: approval of the middleware recommendation once the engine is chosen.

---

## 17. Open Questions / Known Weak Spots

Listed in rough order of how much they worry the author.

1. **The whole score is a hypothesis until someone plays it.** The four-line home theme, the reserved timbres and the Swagger-as-Call are elegant on paper. Whether unbriefed, non-musician players perceive any of it is unknown. Tests 1, 3 and 10 exist for this, and the vertical slice must run them before more than about 35 minutes of music is commissioned.
2. **Repetition of the home theme.** Players hear a home loop at least twice per in-game day for 55 to 65 days. A theme designed to be loved can become wallpaper or an irritant by Life 4, which would gut Life 8. The per-Life arrangements and the breath gaps are the mitigation; they may not be enough. An alternative (several home melodies sharing the Call) would weaken the music-minus-one device. Unresolved.
3. **Deaf and hard-of-hearing parity is specified, not solved.** §12 lists required visual twins, but their design belongs to other departments who have not seen this document, and the muted-playthrough target (80% recall) is a guess. The Life 8 design leans on sound more than any other part of the game. If the Call glyph is rejected as an always-on element, the Life 8 dusk has no accessible equivalent.
4. **Murmur's "no real language" guarantee cannot be made.** The gates in §6.5 reduce risk. They do not remove the prosodic accent of the performers, and listeners may hear the setting's language in the rhythm. Is a faint regional colouring acceptable given that Yunagi is plainly Japanese-inspired while the country is "never stated"? This is a creative-director call. Machine-listening gates also need a tool choice and a privacy-safe (offline) workflow.
5. **Murmur may simply be annoying.** Closed-mouth humming for 100+ vignettes could read as people with their mouths taped. The Peanuts approach avoids this by being a joke; ours has to carry a funeral. Needs a recorded proof-of-concept with two actors before anything else in §6 is trusted.
6. **Combat mix density is untested.** Ten combatants, four damage types, harmonic stabs, vocals and brawl music is a lot of sound. The rules in §11 are standard practice but the specific numbers are invented. The combat prototype is the only real test; expect §8.1 and §11.3 to be rewritten after it.
7. **The assumed hit-stop tiers may not match Combat's game-feel spec.** I did not see the Combat GDD. If Combat defines three tiers or seven, §8.1 must be remapped. Pre-silence also needs windup data that may not exist for fast Moves.
8. **Harmonic stabs off the grid may sound wrong rather than "conducted".** In-key but out-of-time brass hits could read as a sloppy band. The fallback is unpitched taiko-only stabs. Needs a prototype.
9. **Scuffle-tier music (no theme restart) might undersell fights.** It is a fatigue mitigation, but Pillar 3 says fights are loud. If Tough fights feel flat, the tier boundary moves down and fatigue risk goes up.
10. **Forty-eight memorable procedural stings is an unsolved generation problem.** The grammar will produce valid, distinct stings. Whether players recall them (test 4) is doubtful beyond their two or three most-fought Rivals. The mutation table (§7.5) adds further variants per Rival, which may blur identity rather than deepen it. Sting mutation may need to be reduced to three or four states.
11. **Perceptual voice variety is lower than the combinatorics suggest.** Ten bodies may yield 30 to 50 truly distinct voices. With 48 Rivals plus up to 24 Crew plus Strays, collisions across districts are certain.
12. **Scope and cost.** About 185 minutes of music with live chamber players, about 5,200 SFX/vocal/Murmur files, nine life-stage voice castings and a child performer is a large audio budget for an indie project of unknown team size. I have not costed it and cannot until budget is known. The fallback cut in §14.3 saves less than it appears to, because the foundations are front-loaded.
13. **Disk and stream budgets on handheld are tight.** Three hours of multi-stem music near 550 MB assumes aggressive compression and interleaving; quality of the reserved timbres (solo piano and cello compress badly) may suffer. Not validated on hardware.
14. **Middleware is recommended without an engine decision** and without verifying current licence terms, platform support for the handheld target, or the maintenance state of the Godot integration. Those checks are required before the recommendation is adopted.
15. **Loudness targets are conventions, not verified platform requirements.** The three profiles and the wide gap between brawl and home loudness (up to 14 LU) may fail on handheld speakers or annoy players; the Life 8 safety rule is a patch over a real dynamic-range problem.
16. **Hearing as a gameplay sense is under-designed mechanically.** §10 gives the player information by ear, but no system in the brief *requires* listening. Without a mechanic that rewards it (a decision for Combat and Nemesis, item 20 in §16), it stays as flavour, and Audio Pillar 2 is half-met.
17. **Listener at Mikan with a fixed, distant camera may feel wrong.** Sounds near the screen edge but close to Mikan will be loud; sounds at screen centre but far from Mikan will be quiet. A blended listener (position at Mikan, attenuation partly from the camera's focus) may be needed. Requires in-engine testing.
18. **The Dusk Call could be mis-tuned in either direction.** Too insistent and it becomes the nagging the pillars forbid; too subtle and the pull does not exist. Timing (2:00, 3:30, 4:30) and level are guesses.
19. **Street/home separation versus the bleed.** The Dusk bleed and the Life 8 food-carrying cue deliberately cross the street/home line that the tone guardrails draw. I believe these are the right exceptions, but they are exceptions to a creative-director rule and need sign-off.
20. **Reliance on Japanese instruments and idioms.** The palette draws on chindon'ya, enka, taiko, shamisen and shrine sounds. Done by people who know these traditions it will be the game's identity; done from samples and stereotype it will be pastiche. The composer and players should have real fluency, which constrains hiring. The Shinto and Buddhist-adjacent sounds (suzu, incense bell) need cultural review, especially around the wake.
21. **The ending is OPEN in the brief** (does Life 9 imply Mikan's passing?). §4.1 and §3.4 score "comes home when called" and end on the bell and the Call. If the ending changes, the final cue and the last-walk suite change with it.
22. **Haru's presentation is OPEN** (brief §11.4). Register assumptions for Haru's and Sora's voices and the pitch of the Call depend on it. The instrument assignments do not.
23. **Botan's inverted Call (item 16)** makes a narrative claim (Botan has a human who calls her) that belongs to Narrative. If rejected, Botan's theme needs a different core idea.
24. **No Formulas or Tuning Knobs sections.** This is a sound bible, not a system GDD, so it follows the sound-bible template. Several systems here (salience attenuation, voice derivation, sting generation, impact layering) will need their own GDD-format specs with formulas, edge cases and acceptance criteria before implementation. The sound-designer should own the detailed SFX event list that §8 only outlines.
25. **Things not covered at all**: localisation of system UI audio (none expected), trailer and marketing audio rules beyond "no intelligible speech", the soundtrack release, audio for difficulty modes (assumed identical), photo-mode or pause-menu behaviour, save/load audio continuity across the Night Shuffle, and audio QA tooling.

---

*Next steps proposed: (1) creative-director and user review of §16 and §17; (2) a two-actor Murmur proof-of-concept and a piano-and-voice demo of the Call and home theme lines; (3) impact-tier and harmonic-stab test inside the combat prototype; (4) delegate the detailed SFX event list to sound-designer once Combat's game-feel spec exists; (5) run `/design-review design/audio/sound-bible.md`.*

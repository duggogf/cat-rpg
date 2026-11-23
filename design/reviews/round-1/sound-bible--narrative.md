# Round 1 Critique: `design/audio/sound-bible.md` (Narrative lens)

*Reviewer: narrative-director · Date: 2026-11-23 · Round 1*

**Coverage.** I read the whole of the sound bible (§0–§17). I checked it against: `design/creative-brief.md` (canon), `design/gdd/game-pillars.md`; in `design/narrative/dual-story-progression.md` §3.1–3.8 (rulebook and channels), §4.1–4.8 (structure, montages), §7 (beat sheet, Lives 1–7), §8 (house tables, who sings the Call), §9 (Life 8), §10 (Life 9) and §18 (requirements handed to other departments, especially §18.2 Audio and §18.3 UX); and in `design/gdd/combat-system.md` CR-4, CR-5, CR-6, CR-7, CR-8, CR-11, the Visual/Audio Requirements table and the whole Game Feel section. I did not read the other narrative-doc sections (§5, §6, §11–17, §19–23) or the rest of the combat doc, because they were outside this brief.

---

## 1. Verdict

**NEEDS REVISION.**

The ideas behind it are the best audio thinking this project could have hoped for, and most of them should survive unchanged. But it was written without seeing the story it scores, and it shows. It scores a Life 8 that differs from the one Narrative staged. It has no cue for the Life 8 Closing Keystone. It merges three escalating Food Carries into one cue. It leaks Haru's Call into the title screen, naps and drowsiness, which breaks the Life 8 silence. Its impact tiers do not match Combat's six-tier spec. It uses "Swagger" for something Combat already uses the word for. Its deaf/hard-of-hearing section names the right carriers, but the most important one, the Call glyph, is coloured in a way that hides the story's "who". None of this needs a rethink. All of it needs fixing before a composer is briefed.

---

## 2. What is strong (must survive revision)

- **The Reserved Timbre Rule (§2.2) and one instrument per human.** This is how a wordless story becomes legible by ear. Keep piano = Haru, cello = Sora, toy piano = Koharu, reed organ = Gran, bell = Mikan, sung voice = the Call only.
- **The Call's two forms and fixed pitches (§3.1).** Same pitches for 25 hours is exactly the kind of quiet training Narrative's "vocabulary before use" rule (narrative §3.4.5) asks for.
- **The Call in brass as Mikan's street theme (§3.2).** "Sung, it is a pet's name; in brass, a boss's theme" is the core fantasy as one musical fact. It also meets narrative §18.2's "street/home kinship" requirement.
- **Four lines owned by four humans, and Life 8 as music-minus-one (§3.3, §3.5).** Doing the fragmentation by subtraction and interruption, and never by distortion, is the right rule. I rule on it below. It stays.
- **The Life 8 dusk (§5.5): the chime, then nothing.** It costs nothing and is the most effective cue in the game.
- **Silence as composed events (§9.1), never digital zero, with the clock that never stops.**
- **The salience mix (§10.2).** "A can opening three rooms away is louder than the television" is Pillar 1 made audible.
- **Sting mutation as audible Memory (§7.5), especially Recruit = the bell strikes and Betrayal = the bell is removed.** This is Pillar 4 at its best.
- **Murmur method D (§6.2–6.5):** closed-mouth performance from intent cards, a script that can never leak because there is none, and the ban list.
- **§12.5 Honest limit.** The doc separates comprehension parity from emotional parity. That is the correct frame.

---

## 3. Issues

### N1 · BLOCKER · §9.2, §4.1 row 8: the sound bible scores a Life 8 that is not the one staged

**What is wrong.** §9.2 goes straight from "Last evening of Life 7" to "No time-skip montage" to "The phone". Narrative §9.2–9.3 puts a whole **Stage A, "The Last Ordinary Day"**, in between:
- A1, a normal Life 7 morning with Haru's last Goodbye;
- A2, Mikan's first day as Great Boss;
- A3, a Dusk with light rain where **the Call does not come for the first time**;
- A4, the covered plate, with Sora waiting by the telephone;
- and only then B1, the phone on the next sleep.

As written, the sound bible has no music rule for A1 (narrative requires "the same morning cue as every day of Life 7") and no rule for the first missing Call at A3. It also has no rule for the A4 evening, when Haru is absent but not yet "gone".

**Why it matters to the player.** Stage A is where the player's hope lives. If the audio does anything different on that day, whether a foreshadowing cue (forbidden by narrative X9) or early music-minus-one, the player is told before Mikan could know. If the audio has no rule, an implementer will improvise one.

**Fix.**
1. Add Stage A to §9.2. A1 and A2 use the Life 7 morning and street arrangements unchanged.
2. A3 uses the **ordinary "Haru is late" Dusk** described in N4: the chime, the drift to the G pedal, no Call, and the pedal fades after 8 bars.
3. A4 uses the Life 7 evening loop in its **"Haru late" variant** (Melody absent, N4), exactly as on every earlier covered-plate evening.
4. The span of no non-diegetic music at home starts at B1, as both docs already agree.
5. Delete `long_summer_eve` as a separate cue. Haru's last complete Call is already K7.5 Fireworks (narrative §7, Life 7), where she sings it quietly with her lap open. Score it there, and stage it so that nothing marks it as the last.

### N2 · BLOCKER · §9.3, §4.1 row 8, §5.5 table: the Food Carry and the Life 8 close are mis-staged, and K8.8 has no cue

**What is wrong.**
1. Narrative §9.6 has **three Carries on three different days**, escalating: Unnoticed (Koharu understands), Seen (Sora breaks down and cries aloud), and The Bowl Again (Sora restores the Feeding). The sound bible has one `food_home` cue of 2:30.
2. Narrative §9.9 says the score returns **at pick-up, on the street**: "the player's hands cue the music", and it is the street theme slowed on home instruments with Haru's line as rests. The sound bible instead drops the street music to bass alone while carrying, and brings music back only after the food is set down inside.
3. The sound bible puts `unanswered` (Sora's two notes on cello) at the first Carry. Narrative puts Sora's two notes at **K8.8 The Lamp (Stage G)**: two notes whistled, flat on the second, then Koharu sings the third. That is a completed Call, split between the two survivors, and it is the Closing Keystone of Life 8. **The sound bible has no cue for it.** §5.5 says Life 8 Dusk is "the chime, then nothing" for the whole Life, and §3.5 calls Koharu's Life 9 Call "the first complete sung Call since Life 7". Neither statement leaves room for K8.8.
4. `bowl_remembered` has Koharu's Ornament "finding" the rising third. In the narrative, the Bowl is restored by **Sora** at Carry 3 (the Tap-Tap twice, the stroke, the bell). Koharu's beat is K8.7: she spills the kibble and taps the floorboards **once**.

**Why it matters.** Life 8 is the design centre of the USP. As written, the player's emotional peak (Carry 2, Sora's face, the first crying aloud) has no score. The Life ends without its resolving musical event. And the act the player performs (picking up the fish) is silent at the very moment narrative wants it to be answered.

**Fix.** Replace `food_home`, `unanswered` and `bowl_remembered` with:

| Cue | Beat | Content |
|---|---|---|
| `carry_pickup` | First pick-up of each Carry (street or Doorstep) | The Brass Call cell (see N9 for the rename), slowed to home tempo, on cello alone. The Melody's position is rests. It continues as Mikan walks home: this is sanctioned exception 3. It grows by Carry: cello alone; then cello and toy piano; then the full minus-one texture. |
| `carry_1_unnoticed` | Carry 1 | On set-down the cue thins to the toy piano alone (Koharu noticing), on Koharu's half-motif. No cello resolution, because Sora has not seen. |
| `carry_2_seen` | Carry 2 | Sora's face enters frame: the music **stops** (a held beat). Under his crying there is no score. Then the cello returns on the Foundation, and the purr is the only melody. This is the one beat where the player's purr input should audibly sit in the mix like an instrument. |
| `carry_3_bowl` | Carry 3 | Diegetic first: the kibble rattle "loud as it always was", the Tap-Tap twice, the bell on the stroke. Then music-minus-one enters as the Life 8 home loop, and stays. |
| `lamp_k8_8` | Stage G | At Dusk, from home: two whistled notes, the second flat (Sora). A breath. Koharu sings the third, on pitch, landing on C. All music ducks as for any Call. The bell answers (N5). This is the first *completed* Call since K7.5. Rewrite the §3.5 Life 9 sentence to read "the first complete Call **by one voice** since Life 7". |

### N3 · BLOCKER · §4.2 `mus_title`, §5.2 (Sunspot nap, end-of-Night drowsiness), §3.4: Haru's Call and Melody leak into Life 8 through systemic cues

**What is wrong.**
- The title screen plays "the bell, then the Call on solo voice, once" on every boot.
- A Sunspot nap plays a "lullaby quotation of the Home theme's answer phrase". The answer phrase belongs to the Melody line, which is Haru's.
- End-of-Night drowsiness fades up "the Home evening loop".

None of these has a Life 8 variant. A Life 8 player who boots the game hears Haru sing. One who naps on the street in Stage C hears Haru's piano. One who stays out late hears the full home loop bleed in.

**Why it matters.** The Life 8 design works only if Haru's voice and line are **absent everywhere**. Narrative §9.1: "the player's own evening stops working". One leak per session undoes it.

**Fix.** Add a **Life 8 audit rule** to §2.3: *from B1 until `carry_3_bowl`, neither Haru's sung voice nor the Melody line may sound anywhere in the game, systemic or authored.* Then apply it:
1. **Title.** The title never uses a sung Call, in any Life. It uses the bell, the wall clock and the Foundation line. A sung voice on the title screen also spends the Call outside the story, against the sound bible's own §3.1 rationing rule.
2. **Sunspot nap.** The nap quotes the Foundation (Gran's or Sora's line), never the Melody. In Life 8 the nap is the bell alone.
3. **Drowsiness.** In Life 8 Stages B–F, nothing fades up under drowsiness: only the low-pass and room tone.
4. **Every other systemic cue.** List every systemic cue that contains the Call cell or the Melody, and give each one a Life 8 state.

### N4 · MAJOR · §3.3: "who is in the house decides which lines sound" has no rule for *late*, so music-minus-one arrives untaught

**What is wrong.** Narrative teaches the covered plate in Lives 4–7: Haru works late, and she always arrives (narrative §3.4 vocabulary table). The sound bible never says what the home loop does on those evenings.

**Why it matters, and the opportunity.** If the Melody drops out on covered-plate evenings and **enters when her key turns in the door**, then music-minus-one becomes taught vocabulary. Across Lives 3–7 it means "she is late; she will come". Life 8 then pays it off in the cruellest and most cat-true way possible: the same arrangement, and the entrance never comes. This is the answer to "will players notice the deleted Melody?" They will, because they have heard the hole fill dozens of times before.

**Fix.** Add to §3.3:
1. *Whenever Haru is expected but not yet home, the home loop plays without the Melody. Her key in the door, a diegetic S0 sound, brings the Melody in at the next phrase boundary.*
2. Apply it to Life 3 visit-day arrivals and to every covered-plate Texture in Lives 4–7.
3. In Life 8, music-minus-one is that same arrangement, with no entrance.

### N5 · MAJOR · §3.1, §5.5, §7.2: the bell's "fourth beat" (narrative §18.2) is missing, and Dusk timing contradicts the ritual

**What is wrong.**
1. Narrative §18.2 asks that "the collar bell answers the Call". The sound bible makes the bell a foley consequence of movement only.
2. The sound bible fires the Call at 2:00 into Dusk, then at 3:30 and 4:30. Narrative §3.5 says Haru sings "at the **start** of Dusk", and narrative A3 and §9.4 fire the ear-turn on `PhaseChanged(Dusk)`.
3. For Lives 1–2 before the cat flap, narrative §4.3 has the Call sound a second time at the **end** of Dusk, followed by the walk home. The sound bible's "Night arrangement comes in" cannot happen before the flap exists.

**Why it matters.** With the Call 2:00 after the chime, the chime-then-Call pairing is loose. In Life 8 the player would have to stand still for two minutes to notice the absence, and most will have walked off by then. Narrative's ear-turn would fire at the chime and the absence would land two minutes later. The two docs would disagree on screen.

**Fix.**
1. **The Call answers the chime.** It sounds 1 bar after the chime's held G (about 3–4 s), so chime and Call are one gesture, heard 50+ times. A single optional repeat at 2:30. Pre-flap: a final Call at the end of Dusk, then the canon 2-minute grace.
2. **The fourth beat.** Mikan's ear-turn animation ends in a head-shake that rings the bell, quantised to the downbeat after the Call's last note. Call: short–short–long. Bell: one. In Life 8 the ear-turn still fires (narrative §9.8), so **the bell rings into the silence where the Call should have been**. It is the player's own cat answering nobody. This costs one animation event.
3. Life 8 dusk then reads: chime, a 1-bar gap, the bell alone, and the pedal fading after 8 bars.

### N6 · MAJOR · §4.1: beat coverage is incomplete in both directions

Narrative §7–10 Keystones **with no cue or rule** in the sound bible. The ones in bold are load-bearing.

| Beat | Needed |
|---|---|
| **K1.3 first Dusk Call** ("That song is me") | The first Call is the most important teaching cue in the game. Give it a named cue `first_call`, not just the Dusk system. |
| K2.1 School Shoes / first Tribute | An accent: Haru's shriek, then Gran's first laugh. |
| **K2.4 Exam Nerves** | `exam_day` misreads the beat. Narrative K2.4 is a *hurt* beat with **no Murmur, silence as a channel**, and the first Comfort. Rewrite: music withdraws (a held silence). The piano returns only when the player performs Comfort. |
| **K2.5 The Envelope** | No cue. Joy, a feast, then the empty suitcase. Needs `envelope`: the fullest Life 2 arrangement, cut to the Foundation alone at the suitcase. |
| **K3.4 Gran hums the Call, low and flat** | Contradicts §5.5 ("Gran does not sing"). Narrative §18.2 explicitly asks for "her flat hum". Needs `gran_hums`: the Call in Gran's voice, flat, with the reed organ shadowing. It is her only Call. |
| K3.5 Tea on the Veranda | The last time piano and reed organ play together, with nobody Murmuring. A short duet cue. |
| **K4.5 The Small Box** | Narrative: Sora's line is in harmony **from K4.5**. Map `right_call` (the first arco note) to K4.5 explicitly. |
| K5.1 Photo on the Cushion / the Alcove | Narrative §18.2: "a trace [of Gran] survives in the Alcove ritual cue". Tie the held reed note to the Alcove ritual each morning of Lives 5–7, not only to the cushion. Also correct the staging: Gran's photo sits *on Gran's cushion*, and Mikan sits on **their own small cushion beside it**. |
| **K5.2 / K5.5 the record player** | Narrative §18.2: Sora's line is "available diegetically from his record player", and the wedding dance is the duet. Fix: `white_day` part 2 starts **diegetic from the record player** (band-limited, with surface noise) and blooms into the non-diegetic piano and cello as Mikan settles. Also split `white_day` across Keystones K5.3–K5.5. They are on different days, not one 3:00 sequence. |
| K5.4 Haru finds Mikan under the veranda and sings the Call softly | An intimate Call variant (close, unducked, from 30 cm). |
| **K6.2 The Night They Left** | Missing, and it is vocabulary for Life 8 B3 ("a fast exit at night = something big", narrative §3.4). The audio of the exit (door, running feet, empty house) must be **built from the same elements** as Life 8 B2–B3, so that B3 is recognised. Then dawn: Sora whistles the Call badly. This is the first statement of Sora's whistle, which K8.8 pays off. |
| K6.4 Three in the Morning | The purr as the only melody (the same device as `carry_2_seen`, taught here at low stakes). |
| K7.1 Koharu's single tap | A ritual sound (see N7). |
| **K7.4 Rain Day** | §10.5 forbids rain "during a happy home vignette in Lives 5 to 7". K7.4 is *deliberately* happy rain with the yellow raincoat, so that the raincoat on its hook in Life 8 has been seen as harmless. **Delete the §10.5 rule.** Replace it with: rain never coincides with a sad non-diegetic cue, and K7.4 is the happiest rain in the game. |
| **B2 "a sound that is not Murmur"** (narrative §18.2) | §9.2 has Sora's Murmur "then no contour at all", and omits it. Specify: one broken, caught breath, low level, not a scream and not a sob-cry. Then the dropped receiver swinging and humming. Within the guardrails: no editorialising. |
| **K8.4 First Morning** | The title card is small and has **no sting** (narrative §9.9). The morning ambience is *bright*: birds, a bicycle. The world is indifferent. Say so. |
| **Stage C: Koharu sings two notes down the hall as a question** | A missing asset. It is a sung incomplete Call in Life 8, which fits the sound bible's own reservation. Diegetic, so it is allowed during the span. |
| K8.5 A Different Hand | Diegetic only: three wrong cupboards, a saucer on the wrong floor spot. |
| **Season Turn** (about 20 s) | No cue. Span rules apply, so no music. Seasons pass through the frosted door glass as ambience: cicadas, then autumn crickets, then wind, then a winter hush. The clock ticks through all of it. The bell changes to its duller "old" strike **here**, at the Old silhouette, not "from Life 8" (fixes §3.4). |
| K8.7 The Forgotten Bowl | A tongue on the dry, dusty bowl. Koharu's single tap on floorboards (wood, not ceramic). |
| **K8.8** | See N2. |
| **K9.2 The Desk** | Sora "hums the Call, whole and in tune, without noticing". This is Sora finally completing it, and it is missing. Also: reuse `study_lamp` (K2.2) with Koharu at the desk. The echo is the point. |
| K9.5 / §10.1 | Koharu sings twice: from across town, then nearer, at Hidamari Lane. The last sound is the bell (narrative beat 8). |

Sound-bible cues **with no narrative beat**, and what to do with each:

| Cue | Ruling |
|---|---|
| `long_summer_eve` | Merge into K7.5 (N1). |
| `wrong_call` / `right_call` | Rule 17 below. `right_call` maps to K4.5. `wrong_call` becomes one Life 4 Texture. |
| `unanswered`, `bowl_remembered` | Replaced (N2). |
| Botan's human singer | Rejected (rule 16). |
| `lap_war` ×4, `festival_day` ×3, `waiting` ×5 | Allowed as Texture accents. Counts cut in §6. |
| Orphaned Ornament "in Koharu's vignettes" (§3.5) | During the span it must be **diegetic** (a real toy piano), or it is cut. After Carry 3 it may be non-diegetic. It must never double the Melody's notes, because that would fill the hole. |
| `displaced`, `tail_pull` | Fine as accents. |

Sightings (narrative §4.8): the sound bible is silent on them. **Ruling: no leitmotif on the street.** A Sighting is Tier C, "humans as weather". Haru's piano never sounds in town. This keeps the two sound worlds apart.

### N7 · MAJOR · §8, §10.4: narrative §18.2 ritual sounds and Home Scent sonification are missing

**What is wrong.** The Tap-Tap is the single most-repeated story sound in the game: two fingertips on the Bowl's rim, every Feeding, about 100 times. It has no spec. Neither does the Lamp's cord click. The variants by person carry story and must be specified:
- Gran: no tap.
- Sora: none, then learned in Life 6.
- Koharu: one tap, missing, in Life 7; once on floorboards in K8.7.
- Life 8: absent.
- Sora at Carry 3: twice.

Home Scent sonification ("per-human tone, fading with freshness; no melody", narrative §3.7 and §18.2) is also absent. §10.4 covers only Clowder scent on the street.

**Why it matters.** The Feeding is narrative's "strongest channel" (C7), and it is a sound. As for Home Scent: in Life 8 Stage C, "Haru's yellow is everywhere and one day old … every trail leads to the front door".

**Fix.**
1. Add a "Ritual sounds" table to §8 with each person's variant. The Tap-Tap is S0 salience, dry and close.
2. Add Home Scent sonification. Each human's scent is **one sustained note on their reserved instrument**, never a melody. Level and brightness follow the four freshness steps.
3. **Ruling: Haru's scent note is the only sound of her instrument permitted in Life 8 before `carry_3_bowl`.** It is player-summoned, by holding Whisker Sense, and it decays day by day to "trace", then to nothing after the Season Turn. This is sonification, not score, so it does not breach narrative §9.9. It lets the player go looking for her and find less each day. That is the "going looking is the point" of narrative §3.7.

### N8 · MAJOR · §8.1: the impact tiers do not match Combat's game-feel spec

**What is wrong.**
1. Combat (Game Feel → Impact Moments) defines **six** tiers, T0–T5. The sound bible defines five, T0–T4, with a different mapping:

| Event | Sound bible | Combat |
|---|---|---|
| 1-Paw Move main hit | T2 | **T3** |
| 2-Paw Move main hit | T3 | **T4** |
| String finisher / Whack / Pounce | (unassigned) | T2 |
| Fear trigger, Hiss interrupt, Counter-Pounce | (unassigned) | T3 |
| Hit that Frazzles | T4 | T4 |
| Rout of a Tough | (unassigned) | T4 |
| Pile-On, Zoomies, Boss phase break, Rout of Captain+ | T4 | **T5** |

2. **The hit-stop numbers differ.** Combat T1 is 2 ticks; T4 is 9/12 ticks with **global** freeze; T5 is 14 ticks with a global freeze, then authored. The sound bible assumes T4 is 10–18 frames.
3. **The sound bible lacks Combat's player-authorship rule** (AI-autonomous hits shown one tier lower) and the incoming-hit rule (local hit-stop, 75% as long).
4. The **Full Pile-On** is 150 ticks with **four beats, one per participating cat, each a T3 hit**, then a final T5. The **Quick Pile-On** is 72 ticks. The sound bible models one generic scuffle loop and has no Quick variant.

**Why it matters.** Pillar 3 is the user's headline. Audio and image must freeze on the same tick, or hits feel "mushy" (a fail word in Combat's Feel Acceptance Criteria).

**Fix.**
1. Adopt Combat's T0–T5 table verbatim. The sound bible's T4 layers become T5. A new T4 is "T3 + tutti stab, no bell, global duck 6 dB".
2. Bind the audio freeze (the held body layer) to Combat's hit-stop **scope**: local tiers hold the impact only; global tiers also hold the music bus and ambience.
3. Mirror the authorship rule in audio: AI-autonomous hits play one tier lower, with no stab.
4. Pile-On: each of the four beats carries **that cat's own voice body** yelp and its Style effort sound. The player hears "my four cats" inside the cloud. Add a 72-tick Quick Pile-On variant.

### N9 · MAJOR · §3.2 and throughout: "Swagger" collides with Combat's Swagger

**What is wrong.** Combat CR-11.1 defines **Swagger** as a player-facing enemy state: a damage reduction for ranked Rivals, shown in the Slow Blink target panel, with a "deflate sting on loss" (combat V/A table). The sound bible uses "the Swagger" for Mikan's street theme, the Call in brass. One word cannot name an enemy buff and the hero's theme.

**Fix.** The sound bible renames, because its term is internal and Combat's is player-facing. Proposed name: **the Brass Call**, with cue prefix `mus_brasscall_`. It names exactly what it is, and it keeps the pet-and-boss pairing in the name.

### N10 · MAJOR · §7.3: telegraph and Hiss vocals contradict Combat

**What is wrong.**
1. The sound bible makes Hiss "enemy heavy-Move telegraph, stage 1" and "Yowler debuff Moves". Combat CR-5.4 makes **Hiss a universal verb every cat has**, the player's interrupt. An enemy telegraph built on a hiss would sound like the player's own interrupt.
2. Combat requires **three telegraph classes (white, yellow, red), "distinct by rhythm not only pitch"**. The sound bible has one universal rising growl.

**Fix.** Telegraph vocals by class:
- **White** (Bap-able): one short chuff.
- **Yellow** (Hiss-interruptible): a rising growl in two pulses. Its length equals the windup.
- **Red** (leave the area): a sustained rising yowl in three pulses, plus a ground rumble at mid frequency. It must not be sub-only (§11.4).

Hiss belongs to the acting cat only: a per-Style hiss, with the glass-crack sting on a successful interrupt (combat V/A table). Yowler debuff Moves use yowls, not hisses.

### N11 · MAJOR · §7.3–7.4: the cat vocal vocabulary is too thin to perform the nemesis barks

**What is wrong.** Every bark balloon sits over "one vocal gesture chosen by trigger class", but only "Meow (short): generic bark / taunt" serves barks. Brief risk 3 says the nemesis system must sell itself without voiced lines, through "silhouette, Scars, Titles, yowl-stings and one sharp line of text". The vocal carries the **attitude** the text cannot.

**Why it matters.** A Rival who cites "you Humbled me at the fish stall" over the same short meow as "nice weather" has no performance. Pillar 4 dies at the vocal layer.

**Fix.** Replace the generic bark meow with **eight bark intents**, each a short gesture per voice body:

| Intent | Gesture |
|---|---|
| Sneer (the "Collar!" taunt) | A clipped two-note mrow, falling. The rising-third / falling-fifth contour is banned. |
| Gloat | A trill into a laugh |
| Fury / revenge | A growl that breaks into a yowl |
| Grudging respect (Nose-Touch history) | A low closed-mouth chirp |
| Backing down / fear | A thin whine |
| Sulk (Humbled) | A huff and sniff |
| Ally warning | Chatter into a chirp |
| Cold (betrayal) | A flat, toneless meow |

Nemesis owns the trigger to intent mapping; Narrative owns the line. Pay for it by cutting overlapping classes for generic voice bodies (see the cut list): the long rising meow, the slow-blink exhale and the Caterwaul, the last of which is only needed for Crew-eligible bodies. Net file count stays about the same.

### N12 · MAJOR · §12: deaf/hard-of-hearing parity is specified, not solved; concrete visual equivalents

The sound bible is honest about this (§17.3). Here are the equivalents I propose, owned by Art and UX within Narrative's vocabulary.

1. **The Call glyph must be in the singer's colour, with the shape coding the voice.** This settles a cross-doc conflict: narrative §18.3.6 says "three bell-gold arcs"; the sound bible says singer colour. Singer colour wins, because with bell-gold a deaf player cannot tell Gran's taps (Life 3) from Haru's Call, cannot see Sora and Koharu share K8.8, and cannot see that it is Koharu in Life 9.

   | Voice | Glyph |
   |---|---|
   | Sung | Three smooth arcs (up, up, down) |
   | Gran's spoon-taps | Three plum **dots** in short-short-long rhythm |
   | Gran's hum | Plum arcs, drawn low |
   | Sora's whistle | Thin teal arcs, the top one sagging (flat) |
   | Incomplete Call | Two arcs and an empty outlined third position |
   | Life 8 | Nothing. The ear-turn and the bell glint (below) only |
   | K8.8 | Two thin teal arcs, a beat, one coral arc |
   | Life 9 | Three coral arcs |

   Shape backs colour for colour-blind players. It is always on, as the sound bible says.

2. **The bell's fourth beat, made visible.** A single bell-gold glint on the collar as the head-shake lands. In Life 8 the glint fires with no arcs before it. Deaf players get the same "answering nobody" image.
3. **The Dusk chime, made visible.** Street lamps and windows light in a wave from the harbour uphill, synced to the chime, every day. In Life 8 the wave still runs, and **the Veranda Lamp on the hill stays dark**. It is visible from any High Road, which narrative §18.1.7 already requires.
4. **Who is in the music (replaces the "leitmotif motes" at the screen edge).** HUD motes inside the house break the no-UI home. Instead, under Hearing support, each person's persistent object takes a faint colour bloom in time with their line:
   - Haru: the yellow raincoat on its hook.
   - Sora: the teal jacket.
   - Koharu: the drawing.
   - Gran: the plum cushion.

   In Life 8 music-minus-one, the others bloom and **the raincoat stays unlit**. The hole is visible.
5. **The telephone at B1.** No Sense Icons are allowed in Stage B (narrative §9.9). Use these carriers instead: the handset trembling on its cradle; the hall light snapping on; Mikan's ears snapping and fur rising; and **haptics on by default**, with the ring as a two-pulse rumble in the dark. The dropped receiver swinging on its cord is the visual twin of the "non-Murmur sound" at B2.
6. **Murmur ribbons.** Keep them as an option. They must be **open wavy lines radiating from the speaker, never an enclosed bubble**, because enclosed balloons are the cats' readable-speech idiom (brief §5.5.4) and players would read a closed squiggle balloon as "untranslated text".
7. **The Caterwaul while Waiting (Stage C).** No HUD portrait in the house. Instead, the Crew on the garden wall (narrative §9.4) **turn their heads toward the raid's direction**, and Mikan's ears follow. This is diegetic, and it is stronger for every player.
8. **Test target.** Replace the "80% of the sound-on cohort" target with narrative's binding rule (§3.4.2): every Keystone's Tier A fact reaches **90% of unbriefed players with audio muted**.

### N13 · MAJOR · §6: Murmur is workable, but the mockery risk is under-managed

**Assessment.** Method D (closed-mouth performance from intent cards) is workable and can be emotionally legible, provided body language (narrative C2) carries the scene with it. The gaps:

1. **Prosody transfer keeps the source language's rhythm** (the sound bible admits this in §6.5 and §17.4). In a plainly Japanese-inspired town, crowd beds resynthesised from Japanese free speech risk being heard as **garbled Japanese**, which is a parody of a real language and the exact failure the brief forbids.
2. **The stock "broom shopkeeper scold contour"** used as a learnable hazard cue risks becoming a caricature of a nagging local.
3. Street Murmur is "humans as weather" and slightly comic, while home Murmur carries a funeral. If the same voice idiom is ever played *for laughs*, the funeral sounds like the joke.

**Fix.**
1. Source improvised speech for prosody transfer from a **pool of at least three languages per bed, none dominant**. Household actors perform closed-mouth from intent cards only, with no source speech at all.
2. **No Murmur is ever exaggerated for comedy.** Street comedy comes from situation and SFX (the broom whoosh, the sandals), never from a funny human voice.
3. Add to the §6.5 human panel, for native Japanese listeners **and** speakers of other shipped languages, a second question: "Does any of this sound like an imitation or parody of a real language or accent?" Two flags means a re-record.
4. Ban list addition: no pitched "sing-song" contour patterns that read as tonal-language caricature.

### N14 · MINOR · §3.1, §5.5, §16.17: Sora sings the Call an octave lower

Narrative §8.3 and §18.2 never have Sora sing. He **whistles** (flat on the top note, from K6.2) and **hums** (Life 9, in tune). Fix: Sora's Call assets are whistle and hum only. Remove "Sora an octave lower".

### N15 · MINOR · §3.2 / §5.4: two Call-fragment sounds in combat erode the Life 8 device

**What is wrong.** Paw-filled ticks rise "a third per Paw (the Call's first interval)". Combat also asks for a "slow two-note blink" on Slow Blink. Over 25 hours, thousands of rising-third pairs in combat will train the Call's **first two notes** as a UI sound. Those two notes are exactly the incomplete Call that Stage C (Koharu's question) and K8.8 depend on. This also contradicts the sound bible's own rule: "never as a UI sound".

**Fix.** Paw ticks follow Combat's "different pitch per Posse slot", all pitches taken from the pentatonic **excluding** the 3–5 rise. The Slow Blink two-note figure is a falling second.

### N16 · MINOR · §3.3 Life 6, §4.1: the Life 6 evening loop is Haru humming the Call

A looped sung voice spends the Call nightly, against §3.1's rationing rule, and blurs the K6.5 lullaby. Fix: the evening loop has the piano Melody played softly with one hand. Haru's hummed Call lullaby is K6.5 only, plus at most one Texture.

### N17 · MINOR · §9.2 People in Black: the incense bell and the toy piano

See rulings 15 and 6. The toy piano at the wake needs an Art prop from Life 7 (a toy piano is not in narrative §8.1), or the beat is cut.

---

## 4. Rulings on the eight staging proposals (§16, items 11–18)

| # | Proposal | Ruling | Conditions |
|---|---|---|---|
| 11 | Original Yunagi Dusk chime, diegetic, every district | **APPROVED** | The Call answers it within 1 bar (N5). The chime plays in Life 8 too: the town is indifferent. Visual twin: the lamp wave (N12.3). The melody is original and never resembles a real municipal chime. |
| 12 | Gran taps the bowl instead of singing the Call in Life 3 | **APPROVED, corrected** | **Three** taps in the Call's rhythm (short-short-long), not two (narrative K3.1, §3.5). The Bowl has one pitch, so this is the Call without its tune: Gran cannot sing it, so she drums it. Gran **does** hum it once, flat, at K3.4 (N6). Glyph: plum dots. |
| 13 | Life 3 telephone as Haru calling home, so the Life 8 ring carries false hope | **APPROVED; already canon in narrative K3.2** | Through the receiver comes the **complete** Call, three notes, tinny (narrative: "the three notes come down the line"). The sound bible's "two notes" would spend the reserved incomplete Call in Life 3. Use the same ring asset in Life 3 and Life 8 B1. Lives 4–7: the phone rings with relaxed Murmur, never at night (keep the night ring unique to B1). |
| 14 | No montage between Life 7 and Life 8 | **APPROVED; already canon (narrative §4.7)** | The sound bible must add Stage A (N1). There is no montage, but there *is* one ordinary day before the phone. |
| 15 | Incense bell as a new, unexplained sound in Life 8 | **REJECTED as written** | It breaks narrative's vocabulary-before-use rule (§3.4.5). The Alcove ritual, incense before a photo, runs every morning from Life 1. Instead: a small rin bowl-bell is struck **once in every Alcove morning ritual**. Gran in Lives 1–4, Haru in 5–7: nobody is sad. It is absent in Life 8 B–C (nobody does the ritual). Many strangers strike it at D. Sora with Koharu strike it in late Life 8. It is low, long and bowl-like, and must never be confusable with Mikan's collar bell. Cultural review as §17.20 asks. |
| 16 | Botan's theme hides the inverted Call; a human sings Botan's own call in the final phase | **SPLIT: inversion APPROVED; the in-fight human voice REJECTED** | (a) A solo sung human voice is reserved for the Call (§2.2). A second sung call weakens the reservation at its most valuable moment, minutes before K7.5, Haru's last Call. (b) It interrupts a Boss fight (Pillar 3). (c) It risks making "every cat has a singer" generic. Instead: keep the inverted Call on celesta in her theme. **After** the Rout, during the Verdict, a non-sung human summons comes from the inn: a hand-bell, or a treat tin shaken. Botan's ears turn and she looks toward it. Tier C, no words, no singing. Koharu's Ornament stays as the sound bible built it (the halves of both parents). Narrative §18.2's "for instance, inverted" was only an example and is withdrawn, so there is no clash. |
| 17 | Sora's failed then successful Call in Life 4; Haru and Koharu sing together once in Life 7 | **PARTIAL** | Life 4: Sora does not *sing* (N14). One Texture: Sora tries to **whistle** it, gets the interval wrong, and Mikan's ears flick and do not turn. It is an authored reaction, because "the cat does not come" cannot be imposed on the player at Dusk. Sora never makes the Dusk Call in Life 4 (he only visits in the evenings). His "success" is K4.5, the cello's first arco entry in harmony, not a sung Call. Life 7: approved, but as **routine**, not once. At Dusk, Koharu sometimes echoes two notes after Haru (narrative §8.3), plus K7.5. This sets up Stage C and K8.8. |
| 18 | The home vacuum cleaner exists and is the source of the Vacuum Fear sound | **APPROVED as a Texture prop** | Lives 2–7 Routine only: someone vacuums, and Mikan flees under the veranda. It is never in a Keystone, never in Life 8 or 9, never in the same beat as a tender moment (tone guardrail). Art needs to add the prop to narrative §8.1. |

---

## 5. Judgements asked for in the brief

**Is the leitmotif system strong enough and simple enough? Yes, with one dependency.** Non-musicians will not hear an inner-voice countermelody or a bass-line handover. They do hear two things reliably: **which instrument** (timbre) and **whether the tune is there**. The sound bible's load-bearing devices are exactly those two: one instrument per human, and the Melody present or absent. Gran's bass handover and Koharu's "halves" motif are Tier C, and the doc already accepts that only some players will half-notice them. The dependency is the tune itself. Add a vertical-slice target: **≥50% of unbriefed testers can hum the Call unprompted after Lives 1–2.** If they cannot, nothing downstream works.

**Will players notice the deleted Melody in Life 8? Yes, if N4 is adopted.** As written, minus-one appears only after Carry 3, after the player already knows, and it has never been heard before. That makes it a decoration, not a device. Adopted with the late-evening rule, it becomes the third rupture of a learned ritual. The ear has heard this exact hole filled by a key in the door dozens of times. It also obeys narrative C9: music confirms, and never carries the fact alone. The visual is the dark Lamp, the raincoat, and the slippers toes-inward.

**Is the Murmur approach workable and safe?** It is workable (N13). It is safe only with the multi-language sourcing, the no-comedy rule and the parody question added to the panel.

**Is the cat vocal vocabulary rich enough?** For combat, nearly, once telegraphs are fixed (N10). For nemesis barks, no (N11).

**Does the combat audio match the hit-stop tiers?** No (N8, N9).

**Is DHH parity solved?** No. The concrete equivalents are in N12.

---

## 6. Cross-doc conflicts

| # | Sound bible says | Other doc says | Resolution |
|---|---|---|---|
| X-1 | §9.2: last Life 7 evening, then the phone | Narrative §9.2: Stage A, a full ordinary day, between them | Narrative's structure (N1) |
| X-2 | §5.5: Life 8 Dusk is "the chime, then nothing" for the whole Life; §3.5: Koharu's L9 Call is the first complete since L7 | Narrative §9.7: K8.8, Sora two whistled notes + Koharu the third | Add `lamp_k8_8` (N2) |
| X-3 | §9.3: music returns after set-down, as home minus-one | Narrative §9.9: music returns on pick-up, street theme on home instruments | `carry_pickup` (N2) merges both |
| X-4 | §5.5: Call at 2:00 into Dusk | Narrative §3.5, A3: at the start of Dusk | The Call answers the chime (N5) |
| X-5 | §5.5: "Gran does not sing" | Narrative K3.4, §18.2: Gran hums the Call flat | Narrative (N6) |
| X-6 | §3.1: Sora sings an octave lower | Narrative §8.3: Sora whistles, then hums | Narrative (N14) |
| X-7 | §10.5: no rain in happy home vignettes in Lives 5–7 | Narrative K7.4 Rain Day | Delete the audio rule (N6) |
| X-8 | §9.2: incense bell is new in Life 8 | Narrative §3.4: the Alcove is taught from Life 1 | Rin in every Alcove ritual (rule 15) |
| X-9 | §12.2: Call glyph in the singer's colour | Narrative §18.3.6: bell-gold arcs | **Singer's colour + shape** (N12.1). Narrative §18.3.6 to be updated by Narrative. |
| X-10 | §8.1: five tiers T0–T4 | Combat: six tiers T0–T5 | Combat's (N8) |
| X-11 | "Swagger" = Mikan's theme | Combat CR-11.1: Swagger = enemy damage reduction | Audio renames to the Brass Call (N9) |
| X-12 | §7.3: hiss = enemy telegraph | Combat CR-5.4: Hiss = universal player interrupt | Combat's (N10) |
| X-13 | §5.4: Ruffled = dry shaker; Frazzled = taiko riser peaking at 8 s; Slow Blink = one felt-mallet note; Paw = rising third | Combat V/A table: Ruffled = "tense string tremolo"; Frazzled = cymbal swell then ticking; Slow Blink = slow two-note; Paw = per-slot pitch | Combat owns **that** a cue exists and its timing; Audio owns **timbre**. Ruffled stays a shaker, because a string tremolo encroaches on the cello's reserved family. Frazzled: cymbal swell, then a taiko roll that ticks on the beat and peaks at 8 s (both satisfied). Slow Blink: a falling two-note figure. Paw: per-slot pitch (N15). |
| X-14 | (observation, not the sound bible's fault) | Combat: incoming hits flash a **coral** vignette pulse | Coral is Koharu's reserved signature colour (brief §3.1). Flag to Art/Combat: use another hue. |

---

## 7. Needs director ruling

1. **Haru's Home Scent note in Life 8 (N7.3).** It is the only sound of her instrument permitted in the span. Narrative recommends it as sonification, not score, but it bends narrative §9.9's "no non-diegetic music in the house", so the creative director should confirm.
2. **The Call glyph is always on for every player (N12.1, §12.2).** It is a UI element in the home story. Narrative supports it as the only way the Life 8 dusk reaches deaf players. It needs a director ruling because it touches Pillar 1's "no explanation" spirit, though not its letter.
3. **The sanctioned street/home crossings (§2.3, §17.19)**: Dusk bleed, Brass Call, `carry_pickup`, Life 9 last walk. Narrative supports all four.
4. **Faint regional prosody in Murmur (§17.4).** Narrative recommends **no**: multi-language sourcing, N13.
5. **Ending shape (brief OPEN §11.7).** The sound bible and narrative agree to stage it so either reading works, with the bell last.

---

## 8. Cut list

Target: get music under 140 min and files under 4,000 at full vision, and the vertical slice under 25 min and 1,400 files. **Never cut:** the Call assets, the four reserved-timbre lines, the Dusk system, Murmur for the household, the Life 8 cues.

| Cut | Saves |
|---|---|
| Night arrangements become **stem remixes of the Day family by default**, not the fallback | about 15 min recorded music |
| Life 9 last-walk suite: from six parts (6:00) to **one 2:30 piece**. The home theme on the House palette, with each district's colour instrument entering as a solo as Mikan passes | about 3.5 min |
| Botan theme from 6:00 / 3 phases to 4:00; the human-singer phase removed | about 2 min + one sung-voice recording |
| Vignette accents from 45 to 25; `lap_war` from ×4 to ×2; `festival_day` from ×3 to ×1; `waiting` from ×5 to 0 bespoke (room tone + one Waiting-form statement) | about 4 min, about 8 cues |
| The Lot theme from 4 levels to 2 | about 3 min |
| Credits: rearrangement of existing cues, not new | about 3 min new |
| Yowl-sting mutation from 10 states to **4** (first met; Nemesis; Recruited (bell added); Humbled-or-beaten variant). Scar crack and rank harmonisation go | generator complexity; better recall (§17.10) |
| Sting quotations inside the Lot theme | cue logic |
| Kurogane groove reset by passing trains (tempo-matched samples) | tech risk |
| Translated ultrasound as a layer: **cut** to two emitters (the television whine at home, rodents in walls). No mechanic rewards it (§17.16) | about 150 files of emitters and design |
| Mikan voice sets: kitten set A down to 12 classes (Life 1 is a tutorial); elder set C down to 14 classes (in Life 9 the Crew fights) | about 150 files |
| Generic voice bodies: drop the long rising meow, the slow-blink exhale and the Caterwaul for non-Crew-eligible bodies; spend the savings on the 8 bark intents (N11) | file-neutral, much better performance |
| Household Murmur from 9 life-stage voices to **6 actors**: Haru teen and Haru adult (tired parent by direction, not casting); Sora; Gran; Koharu at 8; infant designed. Intent library from 40 to 24; bespoke lines from 150 to about 90 (47 Keystones + Life 8) | about 400 files, 3 castings |
| Harmonic stab sets from 12 roots × 2 qualities × 2 tiers to the 7 diatonic roots of the allowed keys × 2 qualities, T3/T5 only. Prototype first (§17.8) | about 20 files |
| Spatialised Rival stings "nearby but unseen at Night" | **Keep only if** Nemesis adopts a listening mechanic; otherwise cut |
| Leitmotif motes HUD | Replaced by the object blooms of N12.4 (Art-side, cheaper) |

**Added by this review (net):** about 12 short story cues (N2, N6), the Tap-Tap and ritual set, Home Scent tones (4 notes × 4 freshness steps), and the 8 bark intents. That is about 10 min of music and about 150 files, well inside the cuts above.

---

*Round-1 critique ends.*

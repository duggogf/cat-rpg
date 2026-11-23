# Dual Story Progression

> **Status**: Designed (first draft; awaiting design review and creative-director sign-off)
> **Author**: narrative-director (pre-approved design pass)
> **Last Updated**: 2026-11-23
> **Last Verified**: 2026-11-23 against `design/creative-brief.md` v1.0, `design/gdd/game-pillars.md` v1.0, `design/gdd/game-concept.md`
> **Implements Pillar**: Pillar 2 *Two Lives, One Clock* (primary); Pillar 1 *Cat's-Eye Truth* (binding constraint)

All canonical terms (Mikan, Haru, Sora, Koharu, Gran, the Call, Life, Bond, Well-Fed, Murmur, Scribble, Sense Icons, Tribute, the Doorstep, the Stash, Whisker Sense, Sunspot, Verdict, Nose-Touch, Sentry, Warden, Caterwaul, Night Shuffle...) are used exactly as defined in `design/creative-brief.md`. Terms this document introduces are listed in §22 for creative-director review and are marked *(new)* at first use.

## Summary

Dual Story Progression is the game's unique selling point: every in-game day the player spends building Mikan's street empire is also one day in the life of Haru, the human who feeds them, and the player reads that human life without a single understandable word. This document is the rulebook for how that wordless story is told, the beat sheet for all nine Lives, the design of what the player does at home each morning and evening, the trigger rules that keep the two stories in step, and the detailed staging of the accident, its aftermath and the ending.

> **Quick reference** — Layer: `Core` · Priority: `Vertical Slice` (Lives 1–2), `Alpha` (all nine Lives blocked in) · Key deps: `Day clock & Life progression (creative brief §5)`, `Territory & Economy`, `Art`, `Audio`, `UX`, `Crew & Progression`, `Nemesis`, `Combat`

---

## 1. Overview

The player is a house cat with two lives. Outside the garden wall Mikan is a rising boss who claims the six districts of Yunagi. Inside it, Mikan is a pet who watches one human, Haru, go from a 16-year-old in a yellow raincoat to a 31-year-old parent, and then stop coming home. Both stories advance on the same clock: each of the nine Lives pairs one district to claim with one chapter of Haru's life, and every day starts and ends in Haru's House. Because Mikan is a cat, no human word is ever intelligible. The human story is delivered only through what a cat could perceive: where bodies stand, what hands do, which shoes are in the entryway, what has appeared or gone missing in a room, the light, the weather, the daily routine and its ruptures, scent made visible, music, and the tone of muffled speech. The player's part in the home story is small, physical and cat-true (eat, rub, sit in a lap, knock a cup off a shelf, bring a gift, press against someone who is crying), and those small acts are remembered and reflected back. They never change what happens to the humans. They change what the player meant to them. In Life 8 the two stories collide: the house goes quiet, the empire rots, and the food the player has taxed from the whole town becomes something to carry home.

---

## 2. Player Fantasy

**"I never understood a word. I understood everything that mattered."**

| Layer | What the player should feel | Delivered by |
|---|---|---|
| Daily | The pull of two places. Swagger outside; being small, known and fed inside. "One more Patch, or go home?" | The Call at Dusk, the Bowl, the lap, Well-Fed |
| Detective | The private pleasure of working it out: *those are someone else's shoes.* | Home changes, the Rule of Three (§3.4), no explanation ever |
| Witness | Tenderness toward people the player cannot help, advise or warn | Fixed fate; cat-sized verbs |
| Ritual | Ownership of small routines repeated some 60 times: the song, the two-finger tap on the bowl rim, the chin scratch at the door | Ritual, Repetition, Rupture (§3.5) |
| Loss | Not "a sad scene happened" but "my evening is broken". The player's own habits stop working | Life 8 systems design (§9) |
| Repair | Power turned into care. The most feared cat in town carrying a fish across the kitchen floor | The Food Carry (§9.6) |
| Legacy | Being called home by a new voice and going | Life 9 (§10) |

MDA targets served: **Narrative** (authored), **Discovery** (decoding the house), **Submission** (the evening at home), **Fantasy** (boss outside, pet at home). SDT: this is the game's main source of **Relatedness**, and it deliberately withholds **Autonomy** over the humans' fate while preserving full autonomy over Mikan's conduct. That asymmetry is the emotional engine: a pet's love is real and its power is nil.

**What this system must never feel like:** a cutscene interrupting the game; a puzzle with a fail state; a relationship meter to grind; a tragedy the player is blamed for; a tear-jerker that arrives by ambush and leaves the player with nothing to do.

---

## 3. Detailed Design — The Storytelling Rulebook

This rulebook binds every department. It expands the language rule (creative brief §5.5); where the two differ, the brief wins.

### 3.1 The three laws

1. **The Witness Law.** The camera and microphone never leave Mikan. Nothing is shown that Mikan is not present to perceive. There is no school scene, no wedding ceremony away from the house, no hospital, no road. If Mikan is in the Arcade, the human story is not happening on screen.
2. **The Cat-Sense Law.** Every piece of story information must arrive through a sense a cat has and a kind of thing a cat notices: movement, touch, food, warmth, smell, sound, light, territory, routine. Meaning that depends on reading, on a human symbol or on a human concept (money, a date, a diagnosis) may exist in the scene but must never carry the beat.
3. **The No-Translation Law.** Nobody and nothing explains the human story: no subtitle, no narrator, no codex, no quest text, no achievement name, no loading tip, no cat character. Mikan's own reactions may tell the player *what Mikan grasps* (§3.6), never what the humans mean.

### 3.2 Allowed channels

Each channel has a code used in the beat sheets.

| Code | Channel | What it may carry | Rules |
|---|---|---|---|
| C1 | **Staging** | Relationships and status: who stands where, the distance between two bodies, who faces whom, who is in the doorway | Blocking must read from 30 cm off the floor: feet, knees, the under-side of a table |
| C2 | **Body language and touch** | Emotion: a bouncing heel, a hand that hangs, shoulders seen when someone sits on the step, how a hand pets (firm, absent, shaking) | Hands and feet are the main actors. Each human has a signature gait and hand habit |
| C3 | **Costume and signature colour** | Identity and life stage: Haru **yellow**, Sora **teal**, Koharu **coral**, Gran **plum**; uniform, work clothes, white dress, black | A human is identifiable by colour plus one shape cue with the face out of frame |
| C4 | **Objects** | Change over time: things that appear, vanish, move, multiply, age or stop being used | The home-changes table (§7) is the master list. Every Keystone leaves a persistent object trace |
| C5 | **Light** | Time, mood, presence: which windows are lit, the study lamp, curtains open or shut, the *Veranda Lamp* *(new)* | The Veranda Lamp is lit at Dusk on every day of Lives 1–7. Its being dark is reserved for Life 8 |
| C6 | **Weather and season** | Passage of time between and within Lives; emotional rhyme (rain in Life 1, rain in Life 8) | Weather may rhyme, but must not editorialise in the same beat (no thunderclap on bad news; see §11) |
| C7 | **Routine and rupture** | The strongest channel. A ritual performed daily, then performed differently, by someone else, late, or not at all | §3.5 governs. Routines are systemic (the Routine layer, §4.2), not cutscenes |
| C8 | **Scent made visible** | Presence, absence and newness: who has been where, how recently | *Home Scent* *(new)*: inside the house, Whisker Sense shows each human's trail in their signature colour. Fresh = saturated; old = thin and pale. §3.7 |
| C9 | **Music** | Identity and relationship via leitmotif and instrument; emotional temperature; silence | §18.2. Music may confirm what the image shows. It may never be the only carrier of a fact, and never anticipates a fact Mikan has not perceived |
| C10 | **Murmur and diegetic sound** | Emotional tone of speech; through-wall muffling; the telephone, the kettle, a key in the door, the can opener three rooms away | Murmur carries prosody only: no phonemes of any real language, no repeated syllable that could be heard as a name |
| C11 | **Mikan's reaction** | What a cat grasps: ears, tail, pupils, a flinch, a trot to the door, plus at most one Sense Icon cluster | §3.6. Reaction animations are authored per Keystone; the player keeps control wherever possible |
| C12 | **Camera** | Cat's-eye height: humans are legs, laps and hands; a face enters frame only when the human bends, crouches, lies down, or is a small child | A face entering frame is an event. It is spent deliberately (first sight of Haru; Sora on his knees; Koharu at Mikan's eye level) |
| C13 | **Pictures** | Photographs and children's drawings: who is in the family, who is being remembered | Images, not writing. Faces in photos are allowed. No captions |

### 3.3 Forbidden

| # | Forbidden | Why |
|---|---|---|
| X1 | Any intelligible human word, spoken or sung, in any language, including names, laughter-words, lyrics, and trailer voice-over | Creative brief §5.5.1; Pillar 1 |
| X2 | Any readable writing or numeral in the world (signs, letters, screens, calendars, clock faces, price tags). All of it is Scribble | Creative brief §5.5.1 |
| X3 | **Load-bearing human symbols**: a heart drawn on a card, a medical cross, a ring-finger close-up that needs cultural knowledge, test strips, arrows, emoji on a screen. They may dress a set; no beat may depend on one | Cat-Sense Law. A symbol is writing by another name |
| X4 | Scenes away from Mikan; cutaways; flashbacks; dream sequences that deliver human information; ghosts or visitations | Witness Law; §11 (no manipulation) |
| X5 | System text that names a human event: objectives, tips, achievements, save-slot labels, chapter recaps ("Haru is getting married") | No-Translation Law. Life titles from the brief are allowed as system text because they are written from the cat's side ("Two Pairs of Shoes") |
| X6 | Cats discussing humans' affairs; any cat line that explains, consoles or names the loss | Creative brief §5.5.5 |
| X7 | Sense Icons that state human meaning: ring, tear, broken heart, skull, clock, numeral, a human face | Creative brief §5.5.3 |
| X8 | A beat carried by one channel only, or by audio only | §3.4; accessibility |
| X9 | Music that foreshadows what Mikan cannot yet know (an ominous cue on the last ordinary morning) | §11 |
| X10 | The accident, its cause, its location, a vehicle, a hospital, a body, a coffin | Creative brief §5.4: never shown, never explained, never specified |
| X11 | A human harmed, frightened or made a target by any player verb | Creative brief §9 |
| X12 | A default skip, or any option that makes the home story avoidable | Pillar 2 |

### 3.4 Guaranteeing comprehension: the Rule of Three

Wordless does not mean vague. Each story beat is written at three levels and the game only promises the first.

| Tier | Definition | Promise | Example (Life 4) |
|---|---|---|---|
| **A — Felt fact** | The emotional truth a cat would get | Guaranteed: target 90% of unbriefed players | "A stranger has come into my house and Haru likes them." |
| **B — Human fact** | The specific event an adult infers | Designed for: target 65% | "Haru has a partner and they are getting serious." |
| **C — Detail** | A reward for close reading | Never required | "He smells of the sea. He works at the Harbour." |

**Redundancy rules (binding on every Keystone, §4.1):**

1. **Three channels.** A Keystone's Tier A fact is carried by at least **three** channels from §3.2.
2. **Two senses.** At least **two** of them are visual and at least one is non-visual when sound is on. The beat must still deliver Tier A with audio muted (accessibility; X8).
3. **One trace.** At least one channel is a **persistent trace**: an object, light state or scent that stays in the house for the rest of the Life, so a player who looked away, arrived late, or put the game down for a month can still find the beat.
4. **One mirror.** Mikan reacts (C11). The reaction tells the player that *something worth noticing just happened*, even if they have not yet worked out what.
5. **Vocabulary before use.** A visual idiom that must be understood instantly at a high-stakes moment is taught earlier at low stakes. The table below is the binding list.
6. **No single point of failure.** If a playtest shows a Keystone below its Tier A target, the fix is another channel or a clearer staging. Never words (Pillar 1 design test).

**Vocabulary taught before it is needed**

| Idiom | Taught (low stakes) | Reused | Paid off |
|---|---|---|---|
| Shoes in the entryway = who is home | Life 1: loafers and plum sandals | Life 4: teal laces. Life 5: guests' shoes, many and colourful. Life 7: three pairs in a row | Life 8: one pair comes back; then dozens, all black; then two pairs |
| The Call = come home, you are wanted | Life 1, day 2 | Every Dusk, Lives 1–7 | Life 8: silence at Dusk. Life 9: a new voice |
| The covered plate = someone is late, and will come | Lives 4–7 texture (Haru works late; she always arrives) | — | Life 8: the plate stays covered |
| A fast exit at night = something big | Life 6: they rush out, and come back with a baby | — | Life 8: Sora rushes out. Mikan, and the player, have reason to hope |
| The telephone = Haru's voice when she is away | Life 3: a tinny Call down the line | Life 4–7: Haru Murmurs on it, relaxed | Life 8: it rings at night, and it is not her voice |
| The *Alcove* *(new)*: a photo, an incense cup, a morning gesture = someone remembered | Life 1: Gran lights incense each morning before an old man's photo. Nobody is sad | Life 5: Gran's photo on her cushion. Plum scent fades from the house | Life 8: Haru's photo beside Gran's. Yellow scent fades |
| Home Scent fading = gone for a long time | Life 3: Haru's yellow thins to her pillow, then floods back on a visit | Life 5: plum thins and does not come back | Life 8: yellow thins. The player already knows which kind this is |
| An empty house at Dusk | Life 5 wedding day (they return laughing) | Life 6 birth night | Life 8 |
| Carrying food in from the Doorstep | Life 2: a joke; Haru is baffled | Lives 2–7: the Gift verb | Life 8: the Food Carry |

### 3.5 Ritual, Repetition, Rupture

The home story's grammar is: **establish a ritual, let the player perform it many times, then change one thing.** A change only means something if the player's hands know the original.

- A ritual must be seen or performed **at least three times** before any variation of it is used to carry a beat.
- Rituals are implemented in the systemic **Routine layer** (§4.2), not in authored vignettes, so they recur daily at no authoring cost.
- A rupture changes **exactly one** element at a time (who, when, where, how, or whether), so the difference is legible.

**The five household rituals (canon for this document)**

| Ritual | Canonical form (Haru) | Variations that carry story |
|---|---|---|
| **The Feeding** | (1) cupboard door and kibble rattle, mixed loud for cat ears; (2) the Bowl set down on its spot in the kitchen; (3) the *Tap-Tap* *(new)*: two fingertips tap the rim twice; (4) one long stroke down Mikan's back while Mikan eats, ringing the collar bell | Gran: no tap, too much food, a grunt. Sora: wrong spot, forgets the stroke, learns the Tap-Tap in Life 6. A stranger: wrong dish, late. Nobody: Life 8. Koharu: spills (Life 8), then the whole ritual, correct (Life 9) |
| **The Call** | At the start of Dusk Haru sings the three notes from the veranda. Audible across town | Gran taps the rhythm on the bowl rim with a spoon. Sora whistles it flat. Koharu babbles two notes. Life 8: nothing |
| **The Goodbye** *(new)* | Leaving the house, Haru crouches at the entryway step (her face enters frame) and scratches under Mikan's chin with two fingers | Absent in Life 3. Performed in a white dress in Life 5. Joined by Koharu's clumsy pat in Life 7. Performed for the last time, unremarkably, on the first morning of Life 8 |
| **The Lamp** | Haru pulls the cord of the Veranda Lamp at Dusk. If Mikan is out late it stays lit all night | Gran lights it in Life 3. Dark in Life 8. Lit by Sora at Life 8's close. Lit by Koharu, standing on a stool, in Life 9 |
| **The Alcove** | Each morning one human lights incense before the photo(s) and stands still for a breath | Gran (Lives 1–4), Haru (5–7), nobody, then Sora with Koharu (late 8), Koharu (9) |

### 3.6 Mikan as mirror: reactions and the Sense Icon vocabulary

Narrative owns the Sense Icon vocabulary. Icons appear in a small bubble over Mikan, at most **two icons at once**, at most **one icon event per vignette**, and never during the Life 8 stages listed in §9.9.

| Icon | A cat's meaning | Typical use |
|---|---|---|
| Fish | Food | The Feeding; the Doorstep pile |
| Heart | This one is mine / I am safe | Lap, the Call answered |
| Question mark | I do not understand | Combined with another icon |
| Rain cloud | Wet, cold, unhappy | Life 1 opening; Rain Day |
| Note (three small arcs: up, down) | The Call | Heard or expected |
| Empty bowl | Where is my food | Late feeding; Life 8 |
| Door | Someone leaving, someone expected | Goodbyes; waiting |
| Sun | Warm, good spot | Naps, laps |
| Jagged burst | Loud, frightening | The baby's cry; fireworks |
| Sparkle | Shiny, must bat | The ring; a Shiny |
| Scent wisp (tinted with a signature colour) | A smell: familiar or new | Sora's shoes; Haru's fading trail |
| Paw | Cat business, mine | Marking, the Crew on the wall |
| Curl | Sleepy | Sleep spots |
| Knees | A lap is available | Lap prompts |
| Small wobbling blob (coral) | The small loud one | Koharu, Life 6 |

Icon combinations state confusion, not answers: *scent wisp (teal) + question mark* when Sora's shoes first appear; *note + question mark* at the first silent Dusk. Forbidden icons: X7.

### 3.7 Home Scent rules (smell as a visual)

- Inside Haru's House, Whisker Sense renders each human's scent as trails and pools in their signature colour. Koharu's coral carries a fine **yellow strand** from birth (a child smells of her mother; Tier C).
- Home Scent is **authored per Life and per stage**, not simulated. Narrative specifies a scent map for each home state; Art owns the look; Audio owns the sonification.
- Freshness is shown by saturation and trail continuity in four steps: **fresh, day-old, old, trace**.
- Home Scent is never required to progress. It is a second-pass channel for players who go looking, and in Life 8 going looking is the point (§9.4).
- Unfamiliar smells arriving from outside (the city on Haru in Life 3, the sea on Sora, milk on Koharu, incense) appear as a braided second tint.

### 3.8 Two ways of reading: Witness and Forensic

The curfew choice (home by Dusk, or out through Night) must never cost the player the story (Pillar 2: "neither is punished"). Every evening Keystone therefore has two stagings.

| Reading *(new)* | When | What the player gets |
|---|---|---|
| **Witness** | Mikan is home in the Dusk slot | The scene itself, with people in it, playable-adjacent |
| **Forensic** | Mikan comes home at Night | The *Aftermath staging*: the same beat told by what was left behind (dishes for three, a jacket on the hook, a human asleep beside a cold plate, the lamp still on), plus the persistent trace, plus a short morning coda the next day in which the humans' changed behaviour confirms it |

A night-owl player experiences the human story as a cat who comes home to a house that has changed while they were out. That is cat-true, is cheaper to author than a full scene (props, light, one sleeping pose), and is a legitimate second way to play, not a degraded one.

---

## 4. Detailed Design — Structure, Pacing and Triggers

### 4.1 Content classes

| Class *(new)* | What it is | Length | Count (full vision) | Selection |
|---|---|---|---|---|
| **Keystone** | A must-see, ordered story beat. Has Witness and Forensic stagings if it is an evening beat | 15–45 s | 47 (4, 5, 5, 5, 5, 5, 5, 8, 5 by Life) | Gated; §4.4 |
| **Closing Keystone** | The last Keystone of a Life; plays on the arrival before the Life-ending sleep | 20–60 s | (9 of the 47) | Turf goal only |
| **Texture** | A small unordered vignette of life in that Life's house | 10–20 s | about 38 | Random, unseen first |
| **Waiting-up** | The canon late-arrival vignette | 8–15 s | about 14 | Night arrivals without a pending Keystone |
| **Echo** | A vignette or prop change that reflects the player's own conduct back (§6) | 5–20 s or prop-only | about 14 vignettes plus prop states | Triggered by House Memory |
| **Routine** | The systemic layer: humans following a per-Life daily schedule and responding to home verbs | Continuous | 9 schedules | Always running underneath |
| **Montage** | The time-skip between Lives, staged as Mikan's nap (§4.7) | 20–30 s | 7 | On `LifeAdvanced` |
| **Sighting** | Optional: a household human glimpsed in town in their colour (§4.8) | Ambient | up to 12 | Day phases, Lives 2–7 and 9 |

Total authored vignettes: about 113, plus the three Food Carry beats of Life 8, in line with the concept's "100+".

### 4.2 The Routine layer

Each Life defines a **household schedule**: for each of four home times (Morning, Daytime, Evening, Late) where each human is, what they are doing, and which home verbs they respond to and how. Vignettes play on top of Routine. When no vignette is selected, Routine alone is the home scene; it is never an empty house unless emptiness is the content. The per-Life schedules are summarised in §8.

### 4.3 Home slots and arrival classification

Each day has two **home slots**: the **morning slot** (on waking) and the **arrival slot** (on coming home).

| Arrival | Condition | Home time | Slot content | Bond/Well-Fed |
|---|---|---|---|---|
| **Evening** | Mikan enters the house during Dusk | Evening | Keystone (Witness) > Echo > Texture > Routine. The Feeding happens | Evening Bond; Well-Fed eligible on eating |
| **Stay-in** | Mikan enters during Morning or Day and chooses Sleep | Time-lapse to Evening (window light sweeps the floor, 3 s) | As Evening | As Evening, only if Mikan roamed for at least one full phase that day |
| **Daytime visit** | Mikan enters during Morning or Day and does not Sleep | Daytime | Routine only. Curl Up available | None |
| **Late** | Mikan enters during Night, or walks home drowsy | Late | Keystone (Forensic) > Waiting-up > Routine. Bowl is covered with a saucer; food is cold | Late Bond; no Well-Fed |
| **Routed home** | Posse wipe (brief §6.1) | The phase in which the loss happened, mapped as above | *Tended* variant: a human notices, dabs Mikan with a cloth; a sticking plaster is on Mikan's ear next morning | As the mapped arrival |

Before the cat flap exists (Life 1 and Life 2 until Keystone K2.3) there is no Night: at the end of Dusk the Call sounds a second time and Mikan walks home after the canon 2-minute grace. Every pre-flap arrival is therefore Evening. This is how the first two Lives train the habit the rest of the game plays against.

### 4.4 Keystone gating: neither story can stall or outrun the other

Canon (brief §5.4) fixes the frame: a Life ends when its turf goal is met and Mikan next sleeps at home; target 5–8 days per Life; no deadlines. Inside that frame:

**Turf progress index `T`** *(new)*, per Life, counted in the Life's target district, as a **high-water mark** (it never goes down if Patches are later lost):

| T | Meaning |
|---|---|
| 0 | Life has begun |
| 1 | One Patch of the target district held at some point this Life |
| 2 | Two Patches |
| 3 | Three Patches (the Den is open) |
| 4 | Boss Routed: `DistrictClaimed` received. The turf goal is met |

**Rule 1 — Dual gate.** Keystone `k` (k = 1 is the Life's opener) unlocks when **either** its turf gate **or** its day gate is satisfied, and the previous Keystone has played:

```
unlocked(k) = played(k-1) AND ( T >= turf_gate(k) OR day_in_life >= day_gate(k) )
```

Default gates for a five-Keystone Life: K1 `day 1` (always, morning); K2 `T>=1 or day 3`; K3 `T>=2 or day 5`; K4 `T>=3 or day 7`; Closing `T>=4` only.

**Rule 2 — One per slot.** At most one Keystone plays per home slot (exception: Rule 5).

**Rule 3 — Slot affinity.** Each Keystone is tagged `morning`, `arrival` or `any`. An `arrival` Keystone plays in its Witness staging on an Evening arrival and in its Forensic staging on a Late arrival.

**Rule 4 — Anti-stall (the human story does not wait for a slow player).** The day gates mean a player who is exploring, losing fights or simply dawdling still sees every non-closing Keystone by about day 7. After that the house sits on the Life's **Plateau** *(new)*: a stable household condition that can plausibly last as long as the player likes (exam season; Gran and Mikan alone; a baby in the house; a long summer). Texture vignettes play until the pool is used once, then Routine carries the home scene, with Echoes still firing. Nothing repeats as if it were new, and nothing is lost.

**Rule 5 — Anti-outrun (the cat story does not leave the human story behind).** If the turf goal is met while Keystones are still unplayed, the Life still ends on canon terms, and no beat is dropped:
1. Each remaining slot before the Life-ending sleep plays the next Keystone as normal.
2. On the arrival that precedes the Life-ending sleep, up to `catchup_max` (default 1) backlog Keystone plays in its short **essential cut** (the Tier A shots only), followed by the Closing Keystone.
3. Any Keystone still unplayed appears as a 3–5 s **montage insert** in the time-skip, and its persistent trace is present in the next Life's house.

Every Keystone is therefore authored with three forms: full, essential cut, montage insert. The Closing Keystone and Life 8 are exempt from skipping in any form.

**Rule 6 — The Closing Keystone cannot be missed.** It plays on whichever arrival comes after `T = 4`, in Witness or Forensic staging, before the Sleep prompt becomes available.

**Rule 7 — The human story never advances past the Plateau without the turf goal.** Haru does not marry while the player ignores the Harbour. One day is one day for both; the years go by only in the montage.

**Rule 8 — Life 8 is the exception.** Its first stages are gated by days alone and its later stages by the player's own carrying (§9.2). In the one Life about loss, achievement does not move time. Then care does.

### 4.5 Slot selection

On each home slot, in order:

1. An unlocked Keystone compatible with the slot.
2. Otherwise a pending Echo, if at least `echo_cooldown` slots have passed since the last Echo.
3. Otherwise, with probability `texture_rate`, an unseen Texture compatible with the slot and current flags.
4. Otherwise Routine (or Waiting-up, on a Late arrival).

A Texture already seen is not replayed within the same Life. After a Keystone, the next slot never draws an Echo (the beat gets room to breathe).

### 4.6 Time budget at home

| Phase of the home visit | Target | Hard limit | Player control |
|---|---|---|---|
| Morning: wake to "free to leave" | 20 s | 45 s (Keystone morning) | Movement and all verbs from the first frame. The door and flap accept input once the vignette's read window has passed |
| Morning: optional lingering | 0–2 min | none | Full |
| Arrival: greeting plus vignette | 20 s | 60 s (Closing Keystones) | Full movement; camera authored |
| Evening: optional lingering | 1–3 min | none | Full |
| Sleep | 5 s | — | Confirm, then Night Shuffle |

No home vignette removes control for more than `max_control_loss` (default 4 s) at a time, except the named exceptions in Life 8 (§9).

### 4.7 Time-skip montages: every montage is a nap

A montage begins when the player confirms Sleep and ends with control returning to Mikan in the same spot. The camera holds one fixed framing of the room at cat height. Mikan is in every shot, asleep, as the room, the light and the people's legs dissolve through months or years around them. Mikan's own body changes on screen at the canon points (Lives 1→2, 7→8 handled in §9.5, 8→9). The player wakes into a changed house and may walk around it at once: the montage is not disconnected from play, it is the nap that play resumes from.

| Skip | Time | The nap's shots (each 3–5 s) |
|---|---|---|
| 1→2 | about 1 year | Kitten asleep in the Box beside Gran's cushion. Summer uniform legs become winter uniform legs. The Box sags; Mikan no longer fits and sleeps half out of it. A school bag lands by the door |
| 2→3 | months | Mikan asleep in the open suitcase. Clothes pile in around them. Yellow sleeves lift Mikan out; the lid closes. Legs at the door: the Goodbye, long. The room: bed made, desk bare, dust in a sunbeam |
| 3→4 | about 4 years | Mikan asleep on the small cushion beside Gran. Four seasons cross the garden. Gran's hand grows slower on Mikan's back. A cane appears. Boxes arrive; work shoes step in |
| 4→5 | about 1 year | Mikan on Gran's lap. Gran's cushion with Mikan alone on it, autumn. Black sleeves pass at the edge of frame; a thread of incense. A framed photo is set on the cushion. Boxes. White cloth on a door |
| 5→6 | about 2 years | Mikan asleep on the dress's train. The dress is boxed. Gran's room door slides open; two futons. Mikan on Haru's lap, and the lap shrinks dissolve by dissolve behind a belly |
| 6→7 | about 3 years | Mikan on the teal towel by the crib. Crib becomes small bed. A crawling shape, then standing legs. A drawing is taped at cat height. Mikan's muzzle greys |
| 7→8 | **none** | No montage. Mikan sleeps after the fireworks and wakes to an ordinary morning (§9.3) |
| 8→9 | about 5 years | Mikan asleep under the lit Veranda Lamp. Koharu's legs lengthen. Curtains open; a wall is repainted lighter. A small yellow raincoat on the hook. Mikan's coat thins; the red collar is loosened one hole |

### 4.8 Sightings (optional, cuttable)

In Day phases of Lives 2–7 and 9, a household member may be glimpsed in the district paired with that Life, recognisable by colour: Haru walking to school in Hidamari Lane (2); Gran with a shopping bag in Akane Arcade (3); Haru and Sora on the shrine steps of Tsukimi Hill (4); Sora in work gear at Shiosai Harbour (5); Sora with a pram at Kurogane Yard station (6); all three at the Kasumi Heights lighthouse (7); Koharu walking home from school (9; Mikan may escort her). Sightings are humans-as-weather: they never speak to Mikan in a way that carries story, never start a scene, and never appear in Life 8 (the streets are never tragic; brief §9). They are Tier C only.

---

## 5. Detailed Design — The Home Phase

### 5.1 The house

Haru's House is one storey, seven spaces, all walkable in every Life: the **Entryway** (lower floor, step, shoe shelf, coat hooks, umbrella stand, front door), the **Kitchen** (the Bowl's spot), the **Main Room** (low table, Gran's cushion, the Alcove, the photo shelf, the telephone in the hall beside it), **Haru's Room**, **Gran's Room**, the **Washroom** (the toothbrush cup is visible from the sink ledge, which Mikan can jump to), and the **Veranda, Garden and Doorstep** (the lamp, the flap, the wall, the Stash under the boards). Crew never enter. No combat happens inside the wall.

Two objects persist through all nine Lives and belong to the player:
- **The Bowl** *(new)*: a blue-and-white rice bowl. In the Life 1 tutorial that teaches Knock, the kitten knocks it off the step and chips its rim. The chip is there for the rest of the game.
- **The Box** *(new)*: the cardboard box Mikan was found in. Haru keeps it as Mikan's bed. It sags, is taped, is re-taped. Mikan may always sleep in it.

### 5.2 Flow of a morning

1. Wake where Mikan slept. Control is immediate.
2. The morning slot resolves around the player (Keystone, Texture or Routine).
3. The Feeding (morning form: shorter, no Call).
4. The Goodbye, if a human is leaving and Mikan is within reach of the entryway.
5. Out through the door (pre-flap: when a human opens it) or the flap, to the Doorstep: Tribute and the Morning Sniff (owned by Economy and UX).

### 5.3 Flow of an evening

1. At `PhaseChanged(Dusk)` the Call sounds across town (§3.5). Mikan's ears turn toward home.
2. On entering the garden: the Veranda Lamp is on. On entering the house: a greeting from the Routine layer.
3. The arrival slot resolves (§4.3).
4. The Feeding, full form. Eating grants Well-Fed eligibility.
5. Free time: lap, gifts, knocking, exploring what has changed, Whisker Sense.
6. Choose a sleep spot and Sleep. The day ends; the Night Shuffle runs.

### 5.4 Home verbs

Narrative owns the verbs and their fiction; numeric effects of Bond are consumed by Combat and Economy. Inputs are UX's to assign; the intent is one contextual **Interact**, one **Meow**, and one **Carry** (pick up / put down).

| Verb | What the player does | Mechanical effect | Remembered? |
|---|---|---|---|
| **Eat** | Interact at the Bowl when it has food | Evening: grants Well-Fed eligibility for the next day (strength from Bond; Combat owns the value). Morning and Late: none | Whether Mikan ate with the household |
| **Sleep** | Interact at any sleep spot, confirm | Ends the day. Saves. Full Posse recovery (brief §6.1) | Where Mikan slept |
| **Curl Up** | Interact at a home nap spot without confirming Sleep | Proposed: identical to a Sunspot (checkpoint save, full Posse heal, half a phase passes). See §22 | No |
| **Rub** | Walk into or Interact with a human's legs | Triggers the human's Routine response (a hand comes down, or does not). Starts Comfort when a human is in a low state | Lightly |
| **Lap** | Interact with a seated human showing the Knees icon; hold to settle | Bond (once per day). Purr loop; the human's Murmur softens | Whose lap, how often |
| **Meow** | Dedicated button | Gets attention: a human opens a door, looks down, fills a late bowl sooner. In Life 8 it goes unanswered | No |
| **Knock** | Interact with a knockable object on a ledge | None. Humans react by Life and by history | Count and targets |
| **Gift** | Carry an object in from outside and put it down near a human | Bond (once per day). The object joins the house (§6.2) | Every gift, by type |
| **Comfort** | Rub, then stay pressed against a human in a low state; or Lap when offered | Bond (only when a Comfort beat is offered). No effect on the human's fate or on how fast they recover | Whether Mikan stayed |
| **Guard** | Sit at a watch spot: the crib chair (Life 6 on), the entryway step (Life 8, as **Wait**) | Life 8 Wait only: half a phase passes per hold, as a nap. Otherwise none | Yes |
| **Sit in Box** | Interact with any open container | None | Fondly |

No home verb can harm, startle or obstruct a human in a way that reads as hostile (X11). Mikan never scratches or bites a person. Koharu may pull Mikan's tail; the player may always walk away.

### 5.5 How the verbs evolve across the nine Lives

| Life | What changes in the player's hands at home |
|---|---|
| 1 | Learn Eat, Rub, Sleep (in the Box), Knock (the Bowl chips). Haru's lap is always open. Gran's lap refuses Mikan until the Closing Keystone |
| 2 | **Gift is taught as a joke**: the first Tribute appears on the Doorstep and the tutorial invites Mikan to carry one fish inside. Haru shrieks and holds it by the tail; Gran laughs for the first time. Comfort is first offered (exam nerves). The flap: Mikan now chooses when to come home. Late arrival and the Veranda Lamp begin |
| 3 | Haru's lap is gone. Gran's lap replaces it and is slower to offer, longer to hold. Mikan can sleep on Haru's pillow, where the yellow scent is strongest. The Feeding is Gran's version. On Festival Days everything of Haru's returns at once |
| 4 | The lap is contested. When Sora sits beside Haru, the Knees icon is replaced by his hand; the player may wedge in, go to Gran's lap, or leave. Sora offers a finger at nose height all Life: Sniff, turn away, or walk past with tail up. Each is remembered |
| 5 | Boxes everywhere: Sit in Box. Gran's lap is gone; her cushion and Mikan's small cushion remain. Strangers' hands pet Mikan during the wedding gathering; under the veranda is the quiet place. Sora's lap becomes available |
| 6 | Haru's lap disappears behind a belly; leaning on it produces a kick and an ear-flick. The bedroom door is shut at night: Mikan's sleep spots shrink to the hall, the Box and the Main Room. The crib is off-limits (Sora lifts Mikan out) until the Closing Keystone grants the Guard spot. Purring beside a crying Koharu quietens her (a Yowler's purr heals; the same verb at home) |
| 7 | Everything is available at once. Koharu's lap exists but Mikan slides off it. Koharu carries the Bowl. The fullest set of responses in the game |
| 8 | Every verb still accepts input. Most stop being answered (§9.4). **Wait** appears. **Gift becomes the Food Carry** |
| 9 | All verbs are slow. Jumps need the wooden step Sora has built. Koharu's lap fits. Sleep is offered everywhere |

---

## 6. Detailed Design — What the House Remembers

The player's conduct as a cat is tracked in **House Memory** *(new)* and reflected back through Echo vignettes, prop states and the epilogue. **It never branches the humans' fate, never gates a Keystone, and never produces a judgement.** Each reflection has a version for each kind of cat; none is the sad version.

### 6.1 Tracked values

| Value | Counts |
|---|---|
| `evenings_home`, `nights_out` (per Life and lifetime) | Evening/Stay-in arrivals vs. Late arrivals |
| `home_ratio` | `evenings_home / (evenings_home + nights_out)`, per Life |
| `gifts[]` | Each gift's type and the Life it was given in |
| `knocks`, `knock_targets[]` | Objects knocked off ledges |
| `laps{haru, gran, sora, koharu}` | Completed lap holds per human |
| `comforts_stayed`, `comforts_left` | Comfort beats where Mikan stayed or walked off |
| `sora_greeting` | Life 4: mostly sniffed, mostly ignored, or mixed |
| `sleep_spots{}` | Where Mikan chose to sleep |
| `guard_time` | Holds at the crib chair |
| `tail_pull_tolerated` | Life 7 |
| `food_carries` | Life 8 |

### 6.2 Reflections

| Player conduct | How the house answers | The other kind of cat gets |
|---|---|---|
| **Usually home by Dusk** (`home_ratio >= 0.6`) | Echo: Haru has started setting a cushion beside her own before she calls. In Life 7 the family photo on the shelf shows Mikan asleep in a lap | — |
| **Usually out at Night** (`home_ratio <= 0.3`) | Echo: Haru no longer waits up, but the Veranda Lamp is always lit and the bowl is covered with the same saucer; in Life 4 she props the bedroom door open a cat's width. In Life 7 the family photo shows Mikan on the garden wall at sunset with cat silhouettes behind | Both photos are of a loved cat. Neither is of an absent one |
| **Gifts** | The *Gift Jar* *(new)*: a glass jar on Haru's windowsill, later on the Main Room shelf, holding every durable gift Mikan has brought (a ginkgo leaf, a cicada shell, a bottle cap, a marble). It fills visibly. Fish gifts are held up by the tail and returned to the Doorstep with a baffled Murmur. Gran keeps a camellia in a teacup | A player who never gifts has a jar with the one tutorial item in it, kept all the same |
| **Knocking things off** | Life 2: Haru's pencil cup migrates to a higher shelf. Life 4: a favourite cup is replaced by an unbreakable one. Life 6: the house is baby-proofed, and so cat-proofed. Life 7 Echo: Koharu, watching Mikan, pushes a cup off the table and everyone looks at Mikan | If the player rarely knocks: Koharu drops the cup by accident and everyone looks at Mikan anyway |
| **Whose lap** | The most-used lap's owner is the one who lifts Mikan onto the veranda in Life 7's fireworks, and whose side of the bed keeps a cat-shaped dent | — |
| **Staying to comfort** | The human's hand finds Mikan sooner in later Comfort beats | If Mikan usually leaves: the human later comes and sits near wherever Mikan is. The closeness happens either way; only who crossed the room differs |
| **Sora's finger** | If usually sniffed: Sora's lap opens early in Life 5 and he hums at Mikan. If usually ignored: he keeps offering, patiently, through Life 5, and bribes with dried fish | The Life 4 Closing Keystone ends in a Nose-Touch offer either way |
| **Where Mikan sleeps** | Humans leave the favoured spot clear: a folded blanket appears there | — |
| **Guarding the crib** | Koharu's first drawing shows the ginger blob next to the small bed | Otherwise next to the Bowl |
| **Being Routed** | The *Tended* arrival: a human notices, checks Mikan over, and a sticking plaster is on Mikan's ear next morning. Through Lives 1–7 the humans comfort the cat | In Life 8 nobody notices. Later, Mikan is the one who comforts |

### 6.3 What is deliberately not remembered

- Whether Mikan was home on the evening or the night of the accident. No Echo, epilogue detail, achievement or statistic may refer to it (§11).
- Any value that would rank the player as a good or bad pet.
- Anything in Life 8 stages A–D. Echoes are suspended for those stages.

---

## 7. The Beat Sheet — Lives 1 to 7

Format for each Life: the premise; the human Keystones (slot, gate, what Mikan perceives, channels, persistent trace, Tier A read); the cat story; how the two rhyme and counterpoint; Texture and Echo examples; the Plateau; the Closing. Life frame (names, ages, turf goals, Bosses) is canon from the brief §4 and §5.4. The individual Keystones are this document's proposal (canon level: Provisional; §21).

Gate notation: `M` morning slot, `A` arrival slot, `Any`. `T` is the turf progress index (§4.4).

### Life 1 — The Box in the Rain

*Haru 16 · Mikan a kitten · turf: the garden, then one Patch · target 3–4 days · Bond floor 0*

Life 1 uses a custom turf index: `T1` = the kitten has climbed the garden wall (tutorial complete); `T2` = first Patch held (goal).

| # | Keystone | Gate | What Mikan perceives | Channels · trace | Tier A |
|---|---|---|---|---|---|
| K1.1 | **The Box** | Opening (fixed) | Shrine steps, rain, a soaked cardboard box. A yellow raincoat crouches: the first human face in the game bends into frame. She hums three notes to quiet the kitten. Dark, a heartbeat, yellow light through fabric: carried home inside the coat | C6 C3 C12 C9 C11 · trace: the Box, the raincoat on the hook | "I was cold and alone. The yellow one took me." |
| K1.2 | **Gran Says No** | A, day 1 | Plum slippers planted in the inner doorway; yellow socks shifting from foot to foot. Low sharp Murmur against high pleading Murmur. A saucer of food is put down anyway. The Box is left on the entryway's lower floor: not up the step, not in the house | C1 C2 C10 C4 · trace: the Box below the step | "The old one does not want me here. I am not inside yet." |
| K1.3 | **The Bell and the First Call** | M then A · `T1 or day 2` | Morning: a red collar with a brass bell is fastened; a real bowl replaces the saucer (the Bowl; the Knock tutorial chips it); school uniform legs leave. Dusk: the Call is sung from the veranda for the first time, and it means food. Gran slips a scrap beside the Bowl when Haru is not looking | C7 C9 C4 C2 C11 · trace: collar, the Bowl, the lit Veranda Lamp | "That song is me. It means come, and eat." |
| K1.4 | **The Step** (Closing) | `T2` | Gran's hands lift the Box up the step and set it beside her own cushion. Later Mikan may climb onto her lap; she looks away and lets her hand come down | C4 C1 C2 C10 · trace: the Box in the Main Room | "The old one is mine too. I live here." |

**Cat story.** Tutorial: walk, climb the wall, bat a crow, fill a first Paw, first Spray. Daifuku is visible all Life on his wall, enormous and uninterested. A Wall Sitter Tough delivers the first "Collar!".

**Rhyme.** *Being claimed and claiming.* In the same day Haru puts a mark on Mikan (the collar) and Mikan puts a mark on the lane (the first Spray). **Counterpoint:** the collar that means *loved* inside the wall is the insult outside it. The game's central irony is planted in the first hour and paid off with Botan.

**Texture examples.** The kitten falls asleep in a slipper. Haru does homework on the floor with the kitten on the page. Gran sweeps around the Box rather than moving it.
**Plateau.** A kitten settling in. **Montage:** 1→2 (§4.7).

### Life 2 — Uniform

*Haru 17–18 · Mikan a young adult · turf: claim Hidamari Lane (Daifuku) · target 6–8 days · Bond floor 1*

| # | Keystone | Gate | What Mikan perceives | Channels · trace | Tier A |
|---|---|---|---|---|---|
| K2.1 | **School Shoes** | M, day 1 | The morning rush as ritual: toast, bag, loafers, the Goodbye at the step (established here). She is gone all day. First Tribute on the Doorstep; the Gift tutorial; Haru's shriek, Gran's first laugh | C7 C3 C2 C10 · trace: the school bag's place by the door; the Gift Jar begins | "She leaves every morning and comes back every evening." |
| K2.2 | **The Lamp at Night** | A · `T1 or day 3` | Haru at her desk under a study lamp long after dark, heel hooked on the chair rung, sighing. The window is shut. Outside it is moon-blue and cats are on the wall. Mikan may sit on her Scribble pages; she moves Mikan off, twice, then gives up | C5 C2 C1 C11 · trace: the lamp, the paper stacks | "She is shut in. So am I." |
| K2.3 | **The Flap** | A · `T2 or day 5` | Sawdust smell, a saw's rasp, Gran's disapproving Murmur while Gran holds the tools. A square of daylight in the veranda door. Haru's hands push Mikan through it and Mikan's head comes back in. **Night is unlocked** | C4 C10 C2 C11 · trace: the flap | "She made me a door of my own." |
| K2.4 | **Exam Nerves** | Any · `T3 or day 7` | Haru's head on her arms on the desk; a crumpled ball of Scribble on the floor (battable); shoulders shaking; no Murmur at all. First Comfort beat. Gran sets down tea and withdraws | C2 C5 C10(silence) C4 · trace: the crumpled paper stays in the corner | "She is hurt and it is not her body." |
| K2.5 | **The Envelope** (Closing) | `T4` | A thick envelope through the door. Haru's legs trembling as she opens it; her feet leave the floor; Gran's hands on her face. A feast; the Bowl gets fish. Then: a suitcase is taken down, open and empty, on Haru's floor. Mikan may sit in it | C2 C10 C4 C7 C9 · trace: the suitcase | "Something wonderful happened. And there is a new box, and I do not like it." |

**Cat story.** The five Patches of Hidamari Lane, first recruits, first Sentry and raid, Night after the flap, Daifuku at the Den.

**Rhyme.** *Tests and doors.* Both are shut in by an older order (school and the closed window; Daifuku's wall). Both get out in the same week: the flap and the exam. **Counterpoint:** Mikan becomes Boss of the lane at the moment Haru prepares to leave it. The cat wins home turf as the home loses its centre.

**Texture examples.** Haru practises something aloud, pacing; Mikan follows her socks. Gran irons the uniform; Mikan in the warm laundry. Haru falls asleep on the floor with the lamp on.
**Echo hooks.** The pencil cup moves to a higher shelf. First Waiting-up vignette: Haru asleep at the desk, window ajar, lamp lit.
**Plateau.** Exam season. **Montage:** 2→3.

### Life 3 — The Empty Room

*Haru 18–22, away · Mikan an adult · turf: claim Akane Arcade (Madam Sabi) · target 6–8 days · Bond floor 2*

| # | Keystone | Gate | What Mikan perceives | Channels · trace | Tier A |
|---|---|---|---|---|---|
| K3.1 | **Gran's Hand** | M, day 1 | Waking on Haru's bed: made, cool, dust in the sunbeam. No Goodbye. Gran fills the Bowl: too much, no Tap-Tap, a grunt. Gran Murmurs to Mikan at length, as to a person. At Dusk the Call is three spoon-taps on the bowl rim | C7 C4 C8 C10 · trace: only plum sandals in the entryway; yellow scent thinning | "She is gone. The old one feeds me now, and does it wrong." |
| K3.2 | **The Voice in the Box** | A · `T1 or day 3` | The telephone rings. Gran's Murmur brightens. From the receiver, thin and tinny: Haru's pitch. Gran holds the receiver to Mikan's ear and the three notes come down the line. Mikan looks behind the telephone | C10 C9 C2 C11 (note + question mark) · trace: the telephone, now a place Mikan may sit beside | "Her song is inside that thing. She is somewhere." |
| K3.3 | **Festival Day** | A · `T2 or day 5` | At Dusk, from across town: the real Call, in her real voice. At home: a suitcase, a city coat with a yellow scarf, an unfamiliar smell braided into the yellow, presents, the full Feeding with Tap-Tap, a lap for as long as the player wants. She is still there next morning; then the Goodbye, with the suitcase | C9 C3 C8 C7 C2 · trace: a new toy; a new photo on the shelf | "She came back. She smells different. She left again." |
| K3.4 | **Gran's Cushion** | Any · `T3 or day 7` | Afternoon sun. Gran has sewn a small plum cushion and set it beside her own. She dozes with Mikan on her lap and hums the Call, low and flat, for the first time. She turns the pages of a photo album for Mikan: a young woman, an old man (the Alcove photo), a child in yellow | C4 C2 C9 C13 · trace: Mikan's cushion | "The old one and I are the ones who are left. We keep each other." |
| K3.5 | **Tea on the Veranda** (Closing) | `T4` | Haru's second visit. Her hair is different; her step is surer. Gran's hand shakes pouring tea and Haru's hand steadies it. The two sit with Mikan between them and nobody Murmurs for a while | C2 C3 C1 C10 · trace: a second teacup left out | "She is bigger. The old one is smaller." |

**Cat story.** Akane Arcade: awnings, crowds, begging from shopkeepers by day, the Awning Gang, Madam Sabi, a matriarch fed by every hand on the street.

**Rhyme.** *Who feeds you.* At home the wrong hand fills the Bowl. In the Arcade Mikan learns that food comes from many hands, and that a cat can be beloved by a whole street. Sabi is Gran's mirror: an old queen who has been looked after so long she has become the place. **Counterpoint:** Mikan's world doubles while the house halves. Mikan is a Known Face in town on the days nobody but Gran is home to know it. This Life also plants two things Life 8 needs: food is love that can travel, and a house can be lived in by fewer people.

**Texture examples.** Gran eats alone and puts her leftover fish straight in the Bowl. Gran talks to the Alcove photo. Mikan sleeps on Haru's pillow (strongest yellow). A parcel of Scribble arrives; Gran reads it twice, lips moving.
**Echo hooks.** Gifts to Gran: the camellia in a teacup.
**Plateau.** Gran and Mikan alone. **Montage:** 3→4.

### Life 4 — Two Pairs of Shoes

*Haru 23–25 · Mikan an adult, 3 Paws · turf: claim Tsukimi Hill (Oboro) · target 6–8 days · Bond floor 2*

| # | Keystone | Gate | What Mikan perceives | Channels · trace | Tier A |
|---|---|---|---|---|---|
| K4.1 | **Work Shoes** | M, day 1 | Haru is home for good: low work shoes, a blouse, a bag with a strap. The Goodbye and the Tap-Tap return. Now Haru cooks and carries the tray to Gran, who walks with a cane | C3 C7 C2 C4 · trace: the cane in the umbrella stand | "She is back and she is the one who looks after things now." |
| K4.2 | **Two Pairs of Shoes** | A · `T1 or day 3` | Large shoes with teal laces beside Haru's. A smell of sea. A deep Murmur in the Main Room. Gran's cushion has been turned to face the guest. A stranger's hand rests where Mikan's lap should be | C4 C8 C10 C1 C11 (teal wisp + question mark) · trace: the shoes return on later evenings; a teal jacket on a hook | "A stranger is in my house, and she likes him." |
| K4.3 | **The War for the Lap** | A · `T2 or day 5` | Sora sits close beside Haru. The lap is contested (§5.5). He offers a finger. He has brought dried fish. Gran's lap is neutral ground, and Gran is visibly amused | C1 C2 C7 C11 · trace: a packet of dried fish on the kitchen shelf | "He wants what is mine. He is trying to buy me. It is working a little." |
| K4.4 | **Slower** | Any · `T3 or day 7` | Gran does not get up until late. Haru and Sora walk her to the veranda between them; Sora carries her cushion. Gran pats his cheek twice. She falls asleep mid-Murmur with Mikan on her lap; her hand stops and simply rests | C2 C1 C7 C10 · trace: a third toothbrush (teal) in the cup; Gran's backrest cushion | "The old one is tired. The stranger is gentle with her." |
| K4.5 | **The Small Box** (Closing) | `T4` | The proposal. Storyboard in §12.2. Ends with Sora's finger offered and a **Nose-Touch** prompt | C2 C4 C9 C12 C10 C11 · trace: the ring on Haru's hand in every later Tap-Tap | "He asked for something enormous. She said yes. The old one blessed it. He is staying." |

**Cat story.** Tsukimi Hill: shrine steps (where the Box was found), bamboo, stone lanterns, old graves; a district that wakes at night. The Lantern Eyes; Oboro, a rival who is felt before being seen.

**Rhyme.** *The stranger.* On the Hill, Mikan is the intruder in an old, quiet order. At home, Mikan is the old order facing an intruder. The player treats Sora with the only vocabulary they have: territory. Mikan cheek-marks his shoes, contests the lap like a Patch, and in the Closing gives him the same gesture the Verdict system calls Nose-Touch: respect for a worthy opponent. **Counterpoint:** the Hill is where the town keeps its dead, and Mikan brawls among the lanterns without knowing what they are, in the Life where Gran slows down.

**Texture examples.** The covered plate: Haru is late; Gran and Mikan wait; she arrives. Sora asleep on the floor; Mikan sits on his chest. Gran teaches Haru a dish, hands over hands.
**Echo hooks.** `sora_greeting`; the unbreakable cup; the bedroom door propped a cat's width.
**Plateau.** Sora visiting. **Montage:** 4→5, which contains the game's quiet rehearsal of loss: Gran's cushion, then Mikan alone on it, then black sleeves and an incense thread at the edge of frame, then a photo.

### Life 5 — White Day

*Haru 26 · Mikan in their prime · turf: claim Shiosai Harbour (Ikari) · target 6–8 days · Bond floor 3*

| # | Keystone | Gate | What Mikan perceives | Channels · trace | Tier A |
|---|---|---|---|---|---|
| K5.1 | **The Photo on the Cushion** | M, day 1 | Waking on the small cushion beside Gran's. On Gran's: a framed photo. Haru, not Gran, lights the incense and stands still. In Whisker Sense plum survives only on the cushion and the cane. Gran's room door is shut | C4 C7 C8 C13 · trace: the photo; the shut door; the cane that nobody moves | "The old one is not here. This is how they keep her." |
| K5.2 | **Boxes** | A · `T1 or day 3` | Sora's things arrive: boxes with Scribble on the sides, a fishing rod, a record player that plays his tune. His shoes are on the shelf now, not the floor. Mikan may sit in every box | C4 C3 C9 C8 · trace: the record player; teal on the coat hooks | "He lives here now." |
| K5.3 | **The Dress on the Door** | A · `T2 or day 5` | A white dress hangs on Haru's door in the last sun. Haru stands before it. She fetches Gran's photo and holds it up to face the dress. Comfort is offered. A ginger hair on the white; she picks it off and keeps it between her fingers | C4 C5 C2 C13 · trace: the dress | "Something great is coming, and she wishes the old one could see it." |
| K5.4 | **The House Fills** | Any · `T3 or day 7` | Shoes of every colour crowd the entryway. Futons in every room. Many Murmurs, much laughter, strangers' hands. If Mikan retreats under the veranda, Haru comes and finds them there, crouches, and sings the Call very softly | C4 C10 C1 C9 · trace: paper lanterns strung in the garden | "The whole world has come to our house, and she still came looking for me." |
| K5.5 | **White Day** (Closing) | `T4` | The wedding party at home. Haru in white with yellow flowers; Sora in a dark suit and a teal tie. Mikan is passed from lap to lap. On the veranda the record player plays; yellow hem and dark trouser legs turn slowly together. Gran's photo has been carried out on its cushion to face the garden. Mikan falls asleep on the train of the dress | C3 C9 C1 C13 C5 · trace: flowers pressed in a frame on the shelf | "They are one household now. Everyone is here, even the one who is not." |

**Cat story.** Shiosai Harbour: nets, boats, gulls, the richest Tribute in town, the Salt Paws, one-eyed Ikari. The Doorstep pile becomes absurd; wedding guests step over fish.

**Rhyme.** *Union and plenty.* The Bell Clowder becomes a family in the Life the household does; Mikan's wealth peaks as the house fills. **Counterpoint:** the richest Life opens on an empty cushion. Ikari, an old fighter who has plainly lost things and carried on, is the street's version of what Haru is doing at the Alcove.

**Texture examples.** Sora fills the Bowl in the wrong place; Haru's Murmur corrects him. Haru at Gran's sewing box, altering something white. Sora tries to pair the shoes in the entryway neatly, as Gran did.
**Echo hooks.** Sora's lap, early or late.
**Plateau.** Wedding preparations. **Montage:** 5→6.

### Life 6 — The Small Loud One

*Haru 28 · Mikan in their prime · turf: claim Kurogane Yard (Kiha & Moha) · target 6–8 days · Bond floor 3*

| # | Keystone | Gate | What Mikan perceives | Channels · trace | Tier A |
|---|---|---|---|---|---|
| K6.1 | **No Lap** | M, day 1 | Haru moves slowly; her lap is gone behind a belly. Leaning against it: a kick from inside, an ear-flick. Sora fills the Bowl and, after a correcting Murmur, does the Tap-Tap for the first time. Haru's old room is being cleared; a crib lies in pieces | C2 C7 C11 C4 · trace: the crib; a packed bag by the door | "There is something alive in her, and the house is making room." |
| K6.2 | **The Night They Left** | A · `T1 or day 3` | Dusk. Haru breathing in a rhythm, hand on the wall. Sora's feet going three directions at once. The bag, the door, gone. The house is empty overnight. At dawn Sora returns alone, grinning, shaking, overfills the Bowl, whistles the Call badly, and leaves again | C2 C10 C7 C5 · trace: the bag is gone; one teal shoe left behind in the rush | "They ran out in the night. It was good news." |
| K6.3 | **The Bundle** | A · `T2 or day 5` | They come home. Haru walks carefully. A coral blanket with a face in it. A new smell: milk. Then the cry: jagged burst; Mikan may bolt for the veranda. That night the bedroom door is shut and the Bowl is filled late | C3 C8 C10 C11 C7 · trace: coral everywhere; the shut door at night | "There is a small loud one, and nobody has time for me." |
| K6.4 | **Three in the Morning** | Any (incl. Late) · `T3 or day 7` | Haru walks the hall with the crying bundle, crying a little herself. Mikan weaves between her ankles; she slides down the wall to sit. Mikan purrs. The crying thins and stops. Her free hand finds Mikan's head | C2 C10 C5 C9 · trace: a folded blanket left in the hall where they sat | "She is worn thin. I can do one thing, and it helps." |
| K6.5 | **The Guard** (Closing) | `T4` | A tiny hand closes on Mikan's fur through the crib bars and holds. Sora, who has lifted Mikan out of the crib all Life, folds a teal towel onto the chair beside it. Haru sings the Call, drawn out into a lullaby | C2 C4 C1 C9 · trace: the teal towel on the chair | "The small one is mine to watch. They trust me with her." |

**Cat story.** Kurogane Yard: rails, freight, sodium lamps, the loudest district in town; the Rust Runners; Kiha & Moha, siblings who fight as one. Mikan now rules through Wardens.

**Rhyme.** *Siblings and posts.* Mikan fights a pair who are one creature in the Life Mikan acquires a sibling. Mikan masters the loudest place in Yunagi while fleeing an eight-pound human's cry. Outside, Mikan posts Sentries; inside, Mikan is given a post. **Counterpoint:** Mikan's status at home is the lowest it has been since the Box sat below the step, in the Life their Clout is near its height.

**Texture examples.** Sora asleep upright with Koharu on his chest; the only free warm spot is on his feet. Haru feeds Koharu; Mikan watches the bottle. A mobile turns above the crib; it is not knockable.
**Echo hooks.** `guard_time`; baby-proofing removes Knock targets.
**Plateau.** A baby in the house. **Montage:** 6→7.

### Life 7 — The Long Summer

*Haru 31 · Koharu about 3 · Mikan greying · turf: claim Kasumi Heights, Rout Botan, become Great Boss · target 7–8 days · Bond floor 4*

| # | Keystone | Gate | What Mikan perceives | Channels · trace | Tier A |
|---|---|---|---|---|---|
| K7.1 | **Small Hands, Big Bowl** | M, day 1 | Three humans at the low table. Koharu carries the Bowl in both hands, Haru's hands hovering under hers, sets it down, and taps the rim once, missing. The Goodbye now includes a small flat pat on the head | C7 C2 C1 C3 · trace: three pairs of shoes in a row; three toothbrushes | "All of them are mine. The small one is learning how it is done." |
| K7.2 | **Watermelon** | A · `T1 or day 3` | Veranda, cicadas, watermelon. Koharu offers Mikan a piece and pulls the stub tail; the player may leave or stay. Sora's arm round Haru. A wind chime | C6 C2 C1 C10 · trace: the wind chime | "This is the good place." |
| K7.3 | **The Drawing** | A · `T2 or day 5` | Koharu, on her stomach, draws: three stick people in yellow, teal and coral, and a ginger blob with a red line and a yellow dot. Haru tapes it to the wall at cat height | C13 C3 C2 C4 · trace: the drawing, which stays through Life 9 | "There are four of us. I am one of the four." |
| K7.4 | **Rain Day** | Any · `T3 or day 7` | Summer rain. Haru in a yellow raincoat and Koharu in a tiny coral one stamp in the garden; Mikan watches from the dry boards. Haru hangs the raincoat on the entryway hook, dripping | C6 C3 C10 C11 · trace: the yellow raincoat on its hook | "Rain, and the yellow coat, and nothing is wrong." |
| K7.5 | **Fireworks** (Closing) | `T4` | The night Mikan becomes Great Boss. Fireworks over the harbour. Koharu on Sora's shoulders. Haru sits on the veranda edge, pats her lap, and sings the Call quietly; the Great Boss of Yunagi climbs in. On the garden wall, the Crew's silhouettes watch the sky too: the only frame in the game that holds both families. Koharu sings two notes of the Call and loses the third | C9 C1 C5 C2 C11 · trace: none needed | "I have everything." |

**Cat story.** Kasumi Heights: mist, steam, stone stairs, the lighthouse; the Steam Court; Botan, a pampered inn cat in a silk ribbon, a pet like Mikan.

**Rhyme.** *The pet at the top.* Botan is Mikan's reflection: a collar-wearer whose throne rests on being loved by humans. "Collar" was always hypocrisy; the Verdict the player gives Botan is a verdict on their own double life. **Counterpoint: none, on purpose.** This is the one Life in which street and home play in unison (brief: peak power and peak happiness, deliberately aligned). The unison is the set-up.

**Texture examples.** The covered plate: Haru late; she arrives. Height notches cut in the door frame (notches, not numerals), with one very low notch in ginger pencil. Koharu "reads" a Scribble book to Mikan in Murmur.
**Echo hooks.** The cup Echo; the family photo variant; who lifts Mikan onto the veranda.
**Plateau.** A long summer. **No montage** follows.

---

## 8. The House and the Household, Life by Life

### 8.1 Home changes, room by room

Art owns the look; this table is the narrative content requirement. Items in **bold** are persistent traces of Keystones.

| Life | Entryway | Kitchen | Main Room, Alcove, telephone | Haru's Room | Gran's Room | Washroom | Veranda, Garden, Doorstep |
|---|---|---|---|---|---|---|---|
| 1 | School loafers; plum sandals; **yellow raincoat on the hook**; umbrella stand; **the Box below the step**, later moved inside | Gran's domain: kettle, pickling jars. A saucer, then **the Bowl (chipped)** | Low table; Gran's plum cushion; Alcove with an old man's photo and an incense cup; television showing colour blobs; a clock with no numerals | School desk, picture posters, bed with a yellow quilt | Door ajar; futon; sewing box (thread to bat) | One cup, two brushes: yellow, plum | **Veranda Lamp**; laundry pole; low wall; nothing in the Stash |
| 2 | School bag by the door every evening | Two places set; snacks on a tray for studying | Scribble calendar (not load-bearing) | **Study lamp**, stacks of Scribble, **crumpled paper**, the pencil cup (moves higher), the Gift Jar on the sill, **the suitcase** at the close | Unchanged | Unchanged | **The cat flap**. First Tribute on the Doorstep |
| 3 | Plum sandals only; Haru's shoes and a suitcase on Festival Days | One place set; the Bowl overfull | **The telephone** becomes a sitting place; **Mikan's small plum cushion** beside Gran's; a **new photo** after each visit; a second teacup | Bed made; desk bare; quilt folded; door ajar; dust in the sunbeam; yellow scent only on the pillow | Door open in the day; Gran naps here more | Plum brush wet; yellow brush dry | Gran lights the Lamp; a camellia in a teacup if gifted |
| 4 | Work shoes; **the cane** in the stand; **teal-laced shoes**, at first crooked, later parallel to Haru's; a teal jacket | Haru cooks; a tray for Gran; a pill box with no writing; **dried fish packet**; the covered plate | Gran's cushion gains a backrest; the cushion turned to face guests | An adult's room: wardrobe, work bag; door propped a cat's width (Echo) | Gran in bed later each morning | **A third brush: teal** | Three chairs on the veranda |
| 5 | Gran's sandals gone; the cane stays, untouched; Sora's shoes on the shelf; guests' shoes of every colour | Sora's mug; two people cooking in each other's way | **Gran's photo on her cushion**; incense lit by Haru; boxes; **record player**; pressed flowers in a frame | Double futon; **the white dress on the door** | **Door shut all Life** | Yellow and teal; the plum brush is gone | Paper lanterns in the garden; the Doorstep pile at its largest so far |
| 6 | **Packed bag**, then gone; a pram; tiny coral shoes on the shelf, unworn | Bottles; a steaming pot; the Bowl pushed to a corner, then restored | Baby mat; washing on a rack; low shelves emptied (baby-proofed) | **The crib**, a coral mobile; the school desk is carried out; **the teal towel on the chair** | Opened: the couple's bedroom. **Shut at night** | Yellow, teal; a baby bath basin | Small clothes on the laundry pole |
| 7 | **Three pairs in a row**: yellow, teal, small coral sandals; **the yellow raincoat on its hook** beside a tiny coral one | A step-stool; three bowls and the Bowl | **The drawing at cat height**; toys on the floor; a full photo shelf; height notches on the door frame | A small bed replaces the crib | The couple's room; a cat-shaped dent on one side of the bed (Echo) | **Three brushes**: yellow, teal, small coral | **Wind chime**; paddling pool; watermelon rinds; the Lamp |
| 8 | The raincoat, all Life; **her slippers waiting, toes inward**; a yellow scarf on the hook; wet teal shoes, askew; then dozens of black shoes; then two pairs | Dishes stacked; takeaway containers; the Bowl dry; a saucer in the wrong place; spilled kibble; later, the Bowl filled | Curtains shut; **the covered plate**; **Haru's photo beside Gran's**; white flowers that wilt; later fresh yellow ones; the telephone receiver off its hook | Koharu's bed unslept in | Her side of the bed undisturbed; her pillow the strongest yellow in the house; Koharu sleeps on Sora's side | Three brushes still; the yellow one dry | **The Lamp dark**; a yellow blouse left on the pole in the rain for days; Tribute piling on the Doorstep; later, the Lamp lit |
| 9 | Sora's shoes; school loafers; small yellow rain boots; **a small yellow raincoat on the hook** | The step-stool; Koharu's hands; the same chipped Bowl | Curtains open; lighter walls; three photos and fresh flowers; Mikan's cushion with a blanket; the drawing, faded; the Gift Jar | Koharu's room; **the school desk is back**, with a study lamp | Sora's room; a wooden step so Mikan can reach the bed | Teal and coral | The Lamp, lit by Koharu from a stool; **a wooden step up to the veranda**; the Box, re-taped in coral |

### 8.2 Routine and relationship, Life by Life

| Life | Who is home | Morning | Evening | Who feeds, and how | Lap | Mikan's standing at home |
|---|---|---|---|---|---|---|
| 1 | Haru, Gran | Haru leaves in uniform; Gran sweeps | Haru back at Dusk; the Call is born | Haru: the canonical Feeding takes shape | Haru: always. Gran: at the close | A guest on probation, then family |
| 2 | Haru, Gran | The rush; the Goodbye | Study under the lamp; Gran brings snacks | Haru; Gran sneaks scraps | Haru: brief, distracted, one hand on the page | Loved and slightly in the way |
| 3 | Gran; Haru on Festival Days | Gran's slow routine; the Alcove | Spoon-tap Call; television; Gran talks to Mikan | Gran: overfull, no Tap-Tap | Gran: long, sleepy | Gran's companion; the last one left |
| 4 | Haru, Gran; Sora in the evenings | Haru to work; the Goodbye; Gran rises later | Dinner for three; the lap war | Haru; Sora's bribes | Contested. Gran's is neutral ground | Defending their place |
| 5 | Haru, Sora | Haru at the Alcove; both leave | Two people learning one house | Haru; Sora, wrongly | Haru; Sora's becomes available | Sharing, with decreasing protest |
| 6 | Haru, Sora, Koharu | Chaos; nobody leaves on time | Exhaustion; the door shuts early | Sora, with the Tap-Tap learned; often late | None, then Haru's on the hall floor at 3 a.m. | Displaced, then posted as guard |
| 7 | Haru, Sora, Koharu | Three at the table; Koharu carries the Bowl | The veranda; the fullest evenings | Koharu and Haru together | Everyone's. Koharu's does not fit | At the centre |
| 8 | Sora, Koharu; visitors | No routine | No Call, no Lamp | Nobody; a stranger, late; Koharu, spilling; finally Sora | Ignored; then clung to | Forgotten, then needed more than ever |
| 9 | Sora, Koharu | Koharu feeds, then school | Koharu's Call from the veranda | Koharu: the whole ritual, correct | Koharu's, and it fits | The elder of the house |

### 8.3 Who sings the Call

| Life | At Dusk | Note |
|---|---|---|
| 1–2 | Haru, sung clear | Its birth (K1.1) and first use (K1.3) |
| 3 | Gran: three spoon-taps on the bowl rim. Haru's real voice on Festival Days; once, tinny, down the telephone | The player learns to hear the difference from across town |
| 4–5 | Haru | Under it from Life 4: Sora's line, at first out of step, in harmony from K4.5 |
| 6 | Haru, tired; Sora whistles it, flat on the top note, when her hands are full | It also becomes a lullaby |
| 7 | Haru; Koharu echoes two notes | The third note is Koharu's unfinished business |
| 8 | Nobody. At the close: Sora two notes, Koharu the third | §9 |
| 9 | Koharu, whole | Canon |

---

## 9. Life 8 — The Door

*Haru does not come home · Koharu about 3 · Mikan becomes Old · target 7–9 days · Bond floor 5*

Life 8 is the design centre of the USP (brief §5.4). Canon fixes its content: a phone at night, Sora running out, rain, people in black, incense, Haru's photo beside Gran's, Mikan waiting without understanding, the empire rotting, the forgotten bowl, the return to the streets, and food carried home to Sora and Koharu. This section stages it.

### 9.1 Design intent

1. **Loss is shown as broken routine, not as a scene.** By Life 8 the player has heard the Call about fifty times, received the Goodbye about fifty times, eaten from the Bowl a hundred times. Life 8 removes them. The player does not watch grief; their own evening stops working.
2. **The cat does not understand, and the player does.** Every beat is staged from inside Mikan's expectation that Haru is late. The gap between what the player knows and what their character keeps doing is the heartbreak. Nothing closes that gap: Mikan never "realises".
3. **The verbs keep accepting input and stop being answered.** Helplessness is delivered through the controller, cat-sized.
4. **Then the player is given something to do.** The low-agency stretch is bounded (three in-game days). What ends it is an act the player performs with a verb learned as a joke in Life 2.
5. **Nothing is repaired.** The Food Carry does not bring Haru back or cure Sora. It restarts a household: a bowl is filled, rice is cooked, a lamp is lit.

### 9.2 Stages

Life 8 is a sequence of stages *(new)*. Stages A–D advance by sleeps alone; E–F by the player's carrying; G by canon turf terms as specified by Territory & Economy.

| Stage | Name | Entry | Exit | Days |
|---|---|---|---|---|
| **A** | The Last Ordinary Day | `LifeAdvanced(8)`; no montage, no title card | First Sleep | 1 |
| **B** | The Night | Sleep in stage A is interrupted | Mikan settles at the entryway step (or 90 s elapse) | same night |
| **C** | The Waiting | Morning of day 2 | `wait_days` sleeps (default 2) | 2 |
| **D** | People in Black | Morning after stage C | Sleep, then the Season Turn | 1 |
| **E** | The Forgotten Bowl | Waking from the Season Turn | First Food Carry | 1+ (player-paced, hinted) |
| **F** | The Carrying | First Food Carry | Third Food Carry, on three different days, and Territory's Life 8 turf condition | 2+ |
| **G** | The Lamp | First Dusk after stage F's exit conditions hold | Sleep; `LifeAdvanced(9)` | 1 |

### 9.3 Stages A and B, beat by beat

**A1 — Morning (K8.1, The Goodbye).** An ordinary Life 7 morning in every respect: three at the table, Koharu's one-tap, cicadas. Haru leaves in work clothes with a yellow scarf; the sky is overcast, not raining; her raincoat stays on its hook. She crouches at the step and gives the Goodbye: two fingers under the chin. Nothing marks it. The music is the same morning cue as every day of Life 7. No title card is shown for Life 8.

**A2 — The day.** Mikan's first day as Great Boss. The streets are at their most triumphant; Rivals defer. This is deliberately a good day.

**A3 — Dusk.** Light rain begins. `PhaseChanged(Dusk)`: Mikan's ears turn toward home as always, and the Call does not come. *Note + question mark.* This has happened before, on evenings Haru worked late (the covered-plate Textures of Lives 4–7); it is not yet alarming.

**A4 — Arrival (K8.2, The Covered Plate).**
- *Witness (Evening):* Sora cooks. Koharu is fed. A third place is set and covered with a cloth. Sora fills the Bowl (correct spot, Tap-Tap) and looks at the wall clock, then at the door. He lights the Veranda Lamp himself. Koharu is put to bed. He sits by the telephone with a book he does not turn the pages of.
- *Forensic (Late):* the Lamp is on, the plate is covered, Sora is asleep sitting up beside the telephone.
- Either way the player may eat (Well-Fed is granted as normal, for the last time until stage F), take Sora's lap, and Sleep anywhere.

**B1 — The telephone (K8.3).** The player confirms Sleep. The screen dims as on every other night. Instead of the Night Shuffle: black, and the telephone rings. Control returns in the dark house.

**B2.** The bedroom door slides. Bare feet run to the hall. Sora's Murmur: thick with sleep; then a silence that lasts too long; then a sound that is not Murmur. The receiver is dropped and swings on its cord, humming.

**B3.** He runs: trousers over nightclothes, Koharu scooped up in her blanket still asleep, shoes trodden down at the heel. The front door is left wide open. Rain blows onto the entryway floor. His footsteps go down the lane and are gone. The player has seen this once before (K6.2), and that time it was joy.

**B4.** The player is alone in a lit, open house: the swinging receiver, the covered plate, the raincoat on the hook, her slippers. Every room can be walked. The garden gate can be reached; Mikan will not go further into the rain (*rain cloud*). There is no music.

**B5.** The only sleep spot offered is the entryway step. When the player settles there (or after 90 s Mikan walks there unprompted), Mikan sits facing the open door and the rain. The day ends. The Night Shuffle runs as normal: the town does not know.

Both readings converge at B1. The Goodbye in A1 is in the morning slot, which every player sees, so nobody is denied the last one, and nobody is told it was the last.

### 9.4 Stage C — The Waiting

**K8.4 — First Morning (day 2, morning).** Storyboard in §12.3. Sora comes home alone with Koharu asleep on his shoulder and a yellow scarf in his hand. He sits on the step in his wet shoes. The Life 8 title card appears, small and without a sting, at the end of this scene.

**What the verbs do now**

| Verb | Response in stage C |
|---|---|
| Rub (Sora) | First time: nothing. Second time: a hand comes down and rests on Mikan's back, heavy, not stroking |
| Lap (Sora) | The Knees icon does not appear. He is never sitting in a way that makes a lap |
| Meow | No one looks |
| Eat | The Bowl holds last night's dry crumbs. The sound of a tongue on ceramic |
| Knock | Things fall. Nobody scolds, nobody looks up. A hand rights the object hours later |
| Gift | A gift set down is not picked up. It stays where it was put |
| Comfort (Koharu) | Works. Koharu holds on too tightly and falls asleep that way |
| Whisker Sense | Haru's yellow is everywhere and one day old: the slippers, the raincoat, the hall, the pillow. Every trail leads to the front door and ends there |
| Sleep | Offered only at the entryway step in stages C and D |
| **Wait** (new verb) | At the entryway step, hold to sit and watch the door. Light crosses the floor; half a phase passes per hold, as a nap. Legs come and go. From far away, now and then, a Caterwaul |

The cat flap is open. The player is never held in the house. They may go out and play the turf game, which works exactly as before and has become beside the point; or they may Wait, and listen to their empire call for help, and stay. Neither is the right answer. Both are what a cat might do.

**The silent Dusk.** At each `PhaseChanged(Dusk)` in stages C–F, wherever Mikan is, the ears turn toward home, and nothing comes. The icon (*note + question mark*) is shown on the first of these only.

**K8.5 — A Different Hand (day 2 arrival, or day 3 morning).** A visitor in a grey cardigan, with an unfamiliar smell, is cooking and tidying quietly. She hears Mikan or sees the Bowl. She opens three wrong cupboards. She fills a saucer, not the Bowl, sets it in the wrong place, hours late, and pats Mikan with a flat kind hand. Sora is at the table with his back to the room. *Tier A: "Someone else is doing her things, and does not know how they go."*

**Koharu.** Through stage C the three-year-old is Mikan's equal: neither understands. She looks into each room. She sings two notes of the Call down the hall as a question. On the second evening she comes and sits on the entryway step beside Mikan and waits too, and falls asleep there. Sora carries her to bed, stepping over the cat.

**The wall.** From the second night, the Crew cats with the highest Loyalty sit on the garden wall, facing the house. They do not come in and they say nothing (brief §5.5.5).

### 9.5 Stage D — People in Black, and the Season Turn

**K8.6 — People in Black (day 4, all day).**
- The front door stands open. The entryway is solid with black shoes. The vocabulary was taught in joy (K5.4: shoes of every colour).
- Legs in black. Sora in black: for the first time since Life 4 there is no teal on him. Koharu in a black dress with a coral hair tie.
- Many low Murmurs. In Whisker Sense a white thread of incense lies over every yellow trail.
- In the Main Room people kneel in rows facing the Alcove; Mikan may weave between their backs. On Gran's cushion, beside Gran's photo, there is now a photo of Haru in yellow, smiling. Mikan's own small cushion is still next to it. If the player sits there, Mikan is level with the photo, sniffs it (glass; no smell), and looks at the door.
- Koharu is under the low table. Mikan may join her. She pets too hard and does not let go.
- Strangers' hands come down to stroke Mikan. Some shake.
- Evening: the shoes thin out to two pairs. Nobody lights the Lamp. Sora sits at the low table, lifts the cloth from the covered plate, looks, and lays the cloth back.
- No coffin, no body, no cause, no ceremony away from the house (X10, Witness Law). No Sense Icons in this stage.

The player may leave at any time. If they do, the town is exactly as usual. Mikan still does not understand: that night the only sleep spot is, again, the entryway step.

**The Season Turn** *(new; see §22)*. On Sleep at the end of stage D, one held shot of about 20 s: Mikan on the step, facing the door. Through the door's frosted glass the light changes; leaves gather on the sill; the glass frosts. Mikan's muzzle whitens and the body settles into the **Old** silhouette (the canon model change at Life 8). The white flowers at the Alcove wilt. This is the game's Hachikō image, held once and not repeated. It is the only in-Life time skip in the game: some weeks.

### 9.6 Stages E and F — The Forgotten Bowl and the Food Carry

**K8.7 — The Forgotten Bowl (stage E, first morning).** The Bowl is dry and dusty. Meow: nothing. Sora is asleep at the table in yesterday's clothes among stacked dishes; the curtains are shut. Koharu drags the step-stool to the cupboard, pulls at the kibble bag, and it empties across the floor. She pushes a heap toward Mikan with both hands and taps the floorboards, once. *Empty bowl + small blob.* *Tier A: "Nobody here is feeding anybody. The small one is trying."*

**Outside.** The Doorstep is heaped with Tribute that nobody has collected. The streets have rotted to the degree Territory & Economy defines: Scent thin, Nemeses risen, Wardens tested. Mikan is Old (Crew & Progression owns the modifiers).

**The Food Carry** *(new)*. A Food Carry is: pick up one food item (from the Doorstep pile, the Stash, or anything carried home from town), walk it into the house in Mikan's mouth, and put it down within reach of Sora or Koharu. It is the Gift verb with no new input. One Carry counts per day. Costs, sources and the turf condition belong to Territory & Economy; narrative's requirements of that system are in §18.4.

**The game never tells the player to do this.** There is no objective text. The prompt on the Doorstep pile is the same Carry prompt it has shown since Life 2. If the player does not think of it, hints escalate (§14, F5), all wordless and all in the world:

| Hint level | When | What happens |
|---|---|---|
| 0 | Stage E, day 1 | K8.7 only |
| 1 | Day 2 | On arrival, Koharu sits at the table before an empty dish, holding a spoon |
| 2 | Day 3 | At the Doorstep, Mikan looks at the pile, then back at the house door. *Fish + door* |
| 3 | Day 4 on | Koharu opens the front door, finds the pile, lifts one fish by the tail exactly as her mother did in Life 2, carries it in and drops it in the Bowl. The Carry prompt on the pile pulses from then on |

The Carry is never performed for the player. This is the one place in the game where progress requires a specific act; see §23 for the risk.

**While carrying.** Mikan walks; no Meow; the camera sits lower. The Crew on the wall turn their heads to watch Mikan pass. **Music returns here**, on pick-up, for the first time since stage A (§9.9).

| Carry | Name | What happens | Tier A |
|---|---|---|---|
| **1** | **Unnoticed** | Mikan sets the food by Sora's foot. He does not see it. Koharu does. She crouches, face level with Mikan, looks from the fish to the cat, and strokes Mikan gently: the first gentle touch she has managed. She carries the fish to the Alcove and puts it on a small dish before the photo, as she has seen the adults do with other things | "I brought food. The small one understood." |
| **2** | **Seen** | The food lands by his foot and this time he looks down. He bends; his face enters frame for the first time in Life 8. A breath that is nearly a laugh. Then he comes apart: he slides to the floor, pulls Mikan in and holds on, and cries aloud for the first time. Koharu climbs in. Mikan is clung to (control is withheld for up to 6 s; the player may purr). Afterwards he goes out and takes the yellow blouse in off the laundry pole | "He saw me. He is holding me like the last thing he has." |
| **3** | **The Bowl Again** | Sora is on his feet at the sink; the stack of dishes is smaller. He crouches, lifts the fish by the tail, and Murmurs, low and nearly steady. He opens the right cupboard. The kibble rattles, loud as it always was. The Bowl goes down on its spot. Two fingers tap the rim, twice. A stroke down the back; the bell rings. Then steam: he cooks rice. Koharu pulls a curtain open. The covered plate has been washed and is in the rack | "I fed them. They remembered how to feed me." |

From Carry 3 the Feeding is restored (Sora's version) and Well-Fed is available again.

### 9.7 Stage G — The Lamp (Closing Keystone K8.8)

At the first Dusk after stage F's exit conditions hold, wherever Mikan is: the ears turn toward home, out of habit. Two notes come, whistled, flat on the second. They stop. A small voice sings the third. *Note + heart.*

- *Witness:* the Veranda Lamp is lit. Sora's hand is still on the cord. Koharu sits on the boards with the Bowl held in both hands. There is teal on him again: an old jacket.
- *Forensic:* the Lamp is lit. Sora and Koharu are asleep on the veranda under one blanket, the Bowl beside them covered with a saucer. For the first time in the game, somebody other than Haru has waited up.

Mikan eats. Sleep is offered anywhere. The montage 8→9 is Mikan asleep under the lit Lamp.

### 9.8 How the systems change in Life 8

| System | Change | Stages | Owner of the numbers |
|---|---|---|---|
| The Call | Absent. Ear-turn animation still fires at Dusk | A(dusk)–F | Narrative, Audio |
| Veranda Lamp | Lit by Sora in A; dark B–F; lit in G | — | Narrative, Art |
| The Feeding, Well-Fed | Unavailable from B until Carry 3 | B–F | Narrative sets eligibility; Combat owns the buff |
| Bond | Rises only through Comfort, Wait and Food Carries. The heart display does not animate in B–D | B–F | Narrative |
| Sleep spots | Entryway step only | B–D | Narrative |
| Home verbs | Unanswered, as §9.4 | C–E | Narrative |
| Scent decay | Triple rate (brief §5.4). Narrative exposes the stage; Territory decides when it starts, stops and what the Season Turn costs | proposed C–F | Territory & Economy |
| Tribute | Still delivered for whatever is held; piles on the Doorstep if uncollected | all | Territory & Economy |
| Caterwaul | Audible from inside the house while Waiting | C–D | Territory; Audio |
| Nemeses, Wardens, betrayals | "Every debt comes due" (brief §7) | E–F | Nemesis |
| Mikan's body | Old silhouette and gait after the Season Turn | E on | Crew & Progression; Art |
| Rival and Crew barks | A restrained Life 8 pool. Cats may notice the Great Boss has been scarce; no line refers to humans, home or loss | all | Narrative (voice); Nemesis (triggers) |
| Street music | Requested: thinned and slowed, never mournful | C–F | Audio |
| Echoes, Sightings | Suspended | A–D; all | Narrative |
| Morning Sniff | Unchanged. Cat business goes on, indifferent | all | UX |

### 9.9 Presentation rules for Life 8

- **Music.** From the telephone ring (B1) to the first Food Carry there is no non-diegetic music inside the house: rain, the wall clock, the refrigerator, the receiver's hum, Murmur through a door. The score returns when the player picks up the food: **the player's hands cue the music.** What returns is the street theme, slowed and played on the home instruments, with Haru's own line left as rests.
- **Sense Icons.** None in stages B and D. Exactly one in stage C (the first silent Dusk). Normal use from stage E.
- **Camera.** No push-ins on faces. Sora's face is withheld until Carry 2.
- **Weather.** Rain on the night (canon). The first morning is clear and bright: the world is indifferent, and the scene is not told how to feel.
- **Title card.** Withheld until the end of K8.4.
- **Duration.** The low-agency stretch (B through D) is three in-game days and cannot be extended by the player except by choosing to Wait.

---

## 10. Life 9 — Nine

*Koharu 8 · Sora older · Mikan an elder (about twenty) · turf: name an heir; one last walk · target 2–3 days · Bond floor 6*

Short and gentle (brief §5.4). The Crew does the fighting. Nothing is at stake.

| # | Keystone | Gate | What Mikan perceives | Tier A |
|---|---|---|---|---|
| K9.1 | **Small Hands** | M, day 1 | A lighter house: curtains open, pale walls, a wooden step up to the veranda built for an old cat. Koharu, in school loafers, performs the whole Feeding correctly, Tap-Tap and stroke. Her goodbye is her own: she crouches and presses her forehead to Mikan's | "The small one is the one who looks after me now, and she knows how." |
| K9.2 | **The Desk** | A, day 1 | Haru's school desk is back in Haru's old room, under a study lamp. Koharu works at it with her heel hooked on the chair rung. Mikan may sit on the pages; she moves Mikan off, twice, and gives up (K2.2). In the kitchen Sora cooks and hums the Call, whole and in tune, without noticing | "I have seen this before. It is all right." |
| K9.3 | **The Heir** | On naming the heir at the Lot (Crew & Progression) | Next morning the heir sits on the garden wall. Koharu notices, and puts a saucer out on the Doorstep. The next cat and the next human look at each other | "Mine will be looked after, on both sides of the wall." |
| K9.4 | **The Last Walk** | Six districts visited | In each district, one short Farewell with its authored Boss, varied by the Verdict history (Nemesis supplies the state): warm, wry, unhurried. Daifuku has still not moved | "They all know me." |
| K9.5 | **The Call** (ending) | First Dusk after K9.3 and K9.4 | §10.1 | — |

### 10.1 The ending, beat by beat

1. **Dusk.** From across the whole town, Koharu sings the Call: three notes, complete, clear. Mikan's ears turn; then the head; then the body.
2. **The walk home.** The player holds the stick toward home at an elder's pace. Dusk is held: the clock does not advance and no encounter can begin. Along the High Road the Crew, and Rivals who were Humbled, Recruited, Chased Off and returned, or Nose-Touched, sit and watch Mikan go by: the Fence Line made real. The heir may speak one line of cat business (60 characters or fewer). Nobody speaks of anything else.
3. **Hidamari Lane.** She sings again, nearer.
4. **The garden.** The wooden step. The Lamp, lit. Koharu on the veranda edge in yellow rain boots, the Bowl beside her. Teal legs in the doorway behind.
5. **The Bowl.** Eat. Tap-Tap. The stroke. The bell.
6. **The lap.** Koharu pats her knees. It fits. Hold to settle. On the wall: the epilogue's cats (§10.2).
7. **Sleep.** The prompt the player has confirmed some sixty times. They confirm it. The camera rises to the canon street height and keeps rising: one lit veranda among the lamps of Yunagi.
8. **Morning (recommended; OPEN, brief §11.7).** The Doorstep in early light, with whatever the epilogue puts there. The cat flap swings. A bell rings once. Title.

The recommended reading of beat 8 is that Mikan has simply come home and is alive in the morning; the alternative (the flap does not swing; the bell is heard from nowhere) implies Mikan's passing. This document stages beats 1–7 so that either works and takes no decision. Recommendation: the first. The brief asks that the player smile at Life 9, and a second death, of the player's own character, risks making the first one feel like a set-up for it.

### 10.2 Epilogue variations (one ending; details only)

| Detail | Driven by | Variants |
|---|---|---|
| Who sits on the wall | Loyalty; Verdict history (Crew, Nemesis) | The heir always. Up to three more: highest-Loyalty Crew; a Nose-Touched Rival; the longest-standing Nemesis, at a little distance |
| What is on the Doorstep | Territory held; `gifts[]` | The heir's first Tribute; or a single fish; and, if the player was a giver, one small gift left by a Crew cat who learned the habit |
| The photo on the shelf | `home_ratio`, lifetime | Mikan in a lap, or Mikan on the wall at sunset |
| Where Mikan sleeps in beat 7 | `sleep_spots`, `home_ratio` | Koharu's lap and then her bed; or the cushion under the Lamp, with the flap in view |
| The Gift Jar | `gifts[]` | On Koharu's desk, as full as the player made it |
| Koharu's drawing on the wall | `guard_time` | Unchanged since Life 7 |

No variant is marked as better. None refers to the night of the accident.

---

## 11. Tone and Content Guardrails

These extend brief §9. They are acceptance-tested (§20).

**Earned, not manipulative**

1. **No foreshadowing by score or camera.** The last ordinary day sounds and looks like every other. Objects may rhyme (the raincoat, the rain); the music and framing may not hint.
2. **Never shown, never explained** (X10). The dev-facing cause is also unspecified (§21).
3. **Grief is absence of ritual.** Every Life 8 beat must be traceable to a ritual in §3.5 or an idiom in §3.4 that the player met at least three times before.
4. **No guilt accounting.** The game never reflects whether the player was home that night (§6.3).
5. **No sorrow as spectacle.** No slow motion, no push-in on a crying face, no child crying in close-up for more than 5 s, no swelling strings over a still image.
6. **Music is withheld, then cued by the player** (§9.9).
7. **Comfort does not cure.** No meter fills. The humans' recovery is three authored steps tied to three Carries on three days; it cannot be accelerated by repeating a button.
8. **Bounded helplessness.** Three in-game days at most, then a verb.
9. **Nothing is taken back.** No return, no vision, no ghost, no dream of Haru, no flashback montage. The only memory is in objects, scent and the tune.
10. **No replacement.** Life 9 introduces no new partner for Sora and no new pet. The house is lighter, not refilled.
11. **Mikan's old age is gentle.** Slower, greyer, helped by a wooden step. No illness, no suffering, no vet.

**Separation of tones (brief §9)**

12. Never a gag in the same beat as grief. In stages B–D nothing in the house is played for a laugh, including Knock.
13. Never a tragic street scene. Life 8's streets are quieter and harder, not sad. No Rival mocks, mentions or notices the household. No Sightings.
14. The Alcove is never interactive as a toy: its photos, incense and flowers cannot be knocked, batted or sat on, in any Life. Mikan's cushion beside it can be sat on.

**Humans and children**

15. No player verb harms or frightens a human. Koharu is never in danger. The tail pull is gentle and escapable.
16. Sora is never shown neglecting Koharu to a degree that reads as danger: she is clothed, housed and held. What lapses is cooking, cleaning, light and the Bowl.
17. Funeral and memorial customs are shown in the generic, cat-level terms the brief gives (black clothes, incense, a photograph) and reviewed by a cultural consultant before final art (§23).

**Player care**

18. Each Life 8 day ends on a small warmth available to the player: Koharu asleep against Mikan, the Crew on the wall.
19. Whether to offer an opt-in content note is an open question (§23). No option may skip Life 8 (X12).

---

## 12. Three Staged Scenes

Wordless storyboards. "Camera" describes narrative intent for the art director and camera owner to realise; heights are from the floor. `P` marks what the player controls.

### 12.1 Early — "The Bell and the First Call" (Life 1, K1.3, the Dusk half)

*Setup: the kitten has been in the garden all afternoon. The collar went on this morning. The player has not yet heard the Call used as a call.*

| # | Dur | Camera | Action | Sound and music | P |
|---|---|---|---|---|---|
| 1 | 4 s | Garden, the canon follow camera | Gold light. Long shadows of the laundry pole. The kitten by the wall | Cicadas winding down. No music | Full control |
| 2 | 2 s | Same | From inside the house: a cupboard door and the rattle of kibble, far louder than it should be. The kitten's ears snap round. *Fish* | Kibble rattle, mixed for cat ears | Full |
| 3 | 4 s | Drops to 20 cm, looking up at the veranda edge | Yellow socks step onto the boards. A school skirt hem, a yellow cardigan cuff, the Bowl held in both hands. The face is out of frame | Boards creak | Full |
| 4 | 3 s | Hold | She sings three notes: up a third, down a fifth. Three bell-gold arcs spread from her across the garden. *Note + question mark* | The Call, unaccompanied | Full |
| 5 | up to 6 s | Hold | **If the player walks to her:** go to 7. **If not:** she crouches. Her face comes down into frame for the second time in the game (bobbed hair, a grin). She taps the rim of the Bowl with two fingers, twice, and sings again | Tap-tap on ceramic. The Call | Full |
| 6 | — | — | (If still no approach after a third Call, the kitten's own nose leads: an authored two-step toward the bowl, then control returns) | — | 1 s withheld |
| 7 | 5 s | Tracks at heel height through the open veranda door | Her heels walk inside; the kitten follows. In the kitchen doorway stand plum slippers, planted. Yellow socks step round them. The kitten stops. The plum slippers shift ten centimetres to one side | Gran's Murmur: one low grudging syllable-shape | Full; the doorway is passable only after the slippers move |
| 8 | 4 s | 15 cm, at the Bowl's spot | The Bowl goes down. Two fingers tap the rim twice. *Eat* prompt | Tap-tap | Eat |
| 9 | 4 s | Same | While the kitten eats, a hand strokes once from head to tail. The brass bell rings | The bell rings on the beat after the Call's third note: the motif's fourth note is Mikan | Eating |
| 10 | 3 s | Same, deep focus | Behind the Bowl, a plum sleeve lowers a flake of fish from chopsticks to the floor beside it, and withdraws fast | Haru's Murmur: a rising, teasing laugh. Gran's: a gruff denial | Eating |
| 11 | 3 s | Pulls back to the veranda | A yellow sleeve pulls a cord. The Veranda Lamp comes on: a warm circle on the boards. Beyond it the garden turns blue | Lamp click. First entry of the home theme, on Haru's instrument, very quiet | Full |
| 12 | 4 s | Over the kitten, toward the shut window | Outside, on the wall, cat silhouettes, one of them enormous. The window is closed. The kitten's tail tip moves | Night insects, muffled by glass | Full. Sleep is offered in the Box |

**Channels:** C7 (the Feeding and the Call are born), C9, C10, C2, C3, C4, C5, C11, C12. **Trace:** the collar, the Bowl, the Lamp. **Tier A:** "That song is me. It means come and eat." **Tier B:** Gran is softening. **Hook:** the wall, and the cats on it.

### 12.2 The proposal — "The Small Box" (Life 4, K4.5, Closing; Witness staging)

*Setup: Mikan has Routed Oboro and comes home at Dusk. Sora has been visiting all Life and has offered Mikan a finger on every visit.*

| # | Dur | Camera | Action | Sound and music | P |
|---|---|---|---|---|---|
| 1 | 3 s | Entryway, 15 cm | Three pairs: plum sandals with the cane beside them; Haru's work shoes; teal laces. The teal pair is set exactly parallel to Haru's (all Life it was left crooked) | Murmur from the Main Room: three voices, easy | Full. Sniffing the shoes is offered |
| 2 | 4 s | Main Room, floor level, looking under the low table | Three sets of knees. Gran on her cushion by the Alcove. Haru's feet tucked. Sora's heel is bouncing | Sora's line alone on his instrument: it starts, stops, starts | Full |
| 3 | 3 s | Same | Sora's hand, on the side away from Haru, is in his jacket pocket turning something over and over | Cloth rustle | Full. Haru's lap shows the Knees icon |
| 4 | 3 s | 10 cm, close on the floor by his knee | The hand comes out with a small dark box, fumbles, drops it. It rolls to the tatami and the lid springs: a glint. Mikan's pupils go wide. *Sparkle* | A tiny wooden clack. His instrument cuts off mid-phrase | Full. **Knock** is offered on the ring |
| 5a | 3 s | Tracks the ring | **If the player bats it:** the ring skitters across the mats toward the Alcove | Skitter. Gran's Murmur: a short bark of surprise | Bat again is possible |
| 5b | 3 s | Same | **If the player does not, for 4 s:** Mikan lowers a nose to it; Sora lunges and knocks it away himself | Same | — |
| 6 | 4 s | Floor level under the table | Sora on hands and knees, crawling after it. His face comes down into frame for the first time in the game, level with Mikan's, wide-eyed, pleading | A whispered, frantic Murmur. Comic | Full |
| 7 | 3 s | Low, toward Gran | A plum sock comes down on the ring and pins it. Gran's hand lifts it to the lamp, turns it. She puts it in Sora's palm, closes his fingers over it and pats his hand twice | Gran: a dry, low chuckle. Silence after | Full |
| 8 | 5 s | From floor beside Haru, looking across at Sora | Still on his knees from the crawl, he turns to Haru and holds the ring up in both hands. They shake. Haru's hands leave frame toward her face, then come down, one held out, fingers spread | The Call enters on Haru's instrument. Sora's line joins beneath it and, for the first time, fits | Full |
| 9 | 4 s | Same | The ring goes on. A yellow sleeve and a teal sleeve close round each other. If Mikan is on the lap, Mikan is inside the hug | Haru's Murmur climbs, cracks, laughs. The two lines in harmony | Full |
| 10 | 4 s | Wide, low | Behind them Gran sits alone, hands folded, looking at the old man's photo in the Alcove. Then her hand pats the small plum cushion beside her | Gran's motif under the duet | Full. Going to Gran offers her lap |
| 11 | up to 8 s | 15 cm, Mikan and Sora | Sora, sitting back on his heels, holds out one finger at nose height, as he has all Life. **Nose-Touch** prompt, with the Verdict's input and animation | The duet thins to let the bell be heard | **If pressed:** nose to fingertip; his breath goes out. **If declined:** he waits, laughs, scratches his head; Mikan's tail brushes his knee in passing |
| 12 | 3 s | Entryway | Three pairs of shoes. The Veranda Lamp's light reaches them | The duet's last bar | Sleep is offered |

**Channels:** C2 (heel, hands), C4 (the box, the ring, the shoes), C9 (two motifs locking), C10, C11, C12 (Sora's face), C1 (Gran apart, then the cushion). **Trace:** the ring on Haru's hand, visible in every Tap-Tap from now on. **Tier A:** "He asked for something enormous; she said yes; the old one blessed it; he is staying." **Tier B:** an engagement. **Tier C:** Gran is thinking of her own husband. **Forensic staging:** the small box, empty, open on the low table; three teacups; Haru asleep with her ringed hand hanging off the futon at cat height; Sora asleep on the floor of the Main Room, finger out. The Nose-Touch is offered to a sleeping man.

### 12.3 The day after — "First Morning" (Life 8, K8.4)

*Setup: Mikan has spent the night on the entryway step. The front door was shut by a neighbour's hand at some point. The rain has stopped.*

| # | Dur | Camera | Action | Sound and music | P |
|---|---|---|---|---|---|
| 1 | 4 s | Black, then the entryway floor at 15 cm | Grey light through the frosted door. Mikan is curled on Haru's slippers | Water dripping from the eaves. The wall clock. No music, here or anywhere in this scene | Control from the first frame |
| 2 | 3 s | Same | A shape darkens the glass. A key. Mikan's ears go forward; the tail goes up | Key in the lock | Full; Mikan's idle is the tail-up greeting |
| 3 | 4 s | Low, toward the opening door | The door slides. Teal-laced shoes, soaked, muddy to the ankle. One pair. Small coral sandals hang at the height of his hip: Koharu, asleep on his shoulder, out of frame. Mikan looks past his legs at the gap: a wet path, a bright morning, nobody. The door slides shut | The door. Sparrows | Full. Walking to the gap is possible until it closes |
| 4 | 5 s | Same height, side on | He does not take his shoes off. He sits down on the step in them. His hands hang between his knees. In one of them is a yellow scarf | His breath | Full |
| 5 | player-paced | Same | **Rub:** nothing. **Rub again:** the empty hand comes down on Mikan's back and stays there, heavy, trembling, not stroking. **Meow:** nothing | Bell, faintly, when the hand lands | Full |
| 6 | player-paced | Kitchen, 15 cm | The Bowl holds yesterday's crumbs. On the low table next door, the covered plate, cloth undisturbed. On the hall floor the telephone receiver still hangs | **Eat:** tongue on dry ceramic. The receiver's hum | Full |
| 7 | player-paced | Canon home camera, Whisker Sense | **If the player uses Whisker Sense:** fresh yellow on the slippers, the raincoat, down the hall, on the pillow. Every trail runs to the front door and ends at it. (If unused after 20 s: no prompt. This is for those who look) | Whisker Sense's ordinary scent tone for Haru's colour and nothing more (no melody: §9.9) | Full |
| 8 | 6 s | 30 cm: Koharu's eye height and Mikan's | Koharu wakes and slides down. Sock feet go to the bedroom door, look in, come back. She squats in front of Mikan: a human face level with the camera without bending. She sings two notes of the Call, as a question. She does not have the third. Mikan's ears turn to the front door | Two notes. The gap where the third goes | Full |
| 9 | 5 s | Low, wide | Sora stands. He steps out of his shoes at last and leaves them where they fall, one on its side. He hangs the scarf on the hook over the raincoat. He lifts Koharu and goes in. The bedroom door slides shut | Through the door: one low voice, Murmuring; it breaks; it goes on | Full |
| 10 | 4 s | Entryway, still | The slippers, toes inward. The raincoat and the scarf. One shoe on its side. Sunlight arrives on the floor, ordinary and warm | Sparrows. A bicycle bell in the lane | Full |
| 11 | 3 s | Same | The Life title card appears, small, lower corner, and fades | Nothing added | Full |
| 12 | open | Same | The cat flap is unlatched. At the step: the **Wait** prompt. Far off, a Caterwaul | The Caterwaul, distant | The player chooses |

**Channels:** C7 (shoes kept on; the Bowl; the missing Goodbye), C4 (one pair of shoes, the scarf, the plate, the receiver), C2 (the hand that rests), C8 (trails ending at the door), C10 (no music; Murmur through a door), C1 (Koharu and Mikan at one height), C11 (the tail-up greeting for the wrong person), C6 (an indifferent fine morning). **Trace:** slippers, raincoat, scarf, plate, all Life. **Tier A:** "She did not come back with him. Everything of hers is still here." **Tier B:** the player understands what Mikan does not. **What the scene refuses:** music, a close-up, an explanation, and any sign that Mikan has understood.

---

## 13. States, Transitions and Interfaces

### 13.1 Home visit states

| State | Entry | Exit | Behaviour |
|---|---|---|---|
| **Outside** | Mikan leaves the garden wall | Mikan crosses the wall inward | Clock runs. The Call fires at `PhaseChanged(Dusk)` when the Life's schedule has a caller |
| **Arriving** | Crossing the wall inward | Entering the house | Arrival is classified (§4.3). Lamp state shown. Clock pauses on entering the house (brief §5.2) |
| **Slot resolving** | Entering the house, or waking | Vignette's read window ends | Selection per §4.5. Player keeps control |
| **Free at home** | Read window ends | Leaving, or confirming Sleep | Routine layer answers home verbs. Clock paused, except Curl Up and Wait |
| **Sleeping** | Sleep confirmed | Night Shuffle step 4 completes | Save. If the Life's exit condition holds: montage, `LifeAdvanced` |
| **Waking** | New day | Slot resolving | Mikan is placed at the chosen sleep spot |

### 13.2 Life states

| State | Entry | Exit | Behaviour |
|---|---|---|---|
| **Opening** | `LifeAdvanced` | K1 played | Morning Keystone; new house dressing; new schedule |
| **Developing** | K1 played | All non-closing Keystones played | Dual-gated Keystones (§4.4) |
| **Plateau** | All non-closing Keystones played, `T < 4` | `T = 4` | Texture until exhausted, then Routine; Echoes continue |
| **Goal met** | `T = 4` (`DistrictClaimed`) | Next arrival | Catch-up rule applies |
| **Closing** | Arrival after goal met | Sleep | Closing Keystone; Sleep unlocks after it |
| **Montage** | Sleep | Control returns | §4.7 |

Life 8 replaces Developing and Plateau with the stages of §9.2. Life 9 uses Opening, a two-condition Developing, and the ending.

### 13.3 Household member states

Each human in the Routine layer is in one of: **Present** (answers verbs normally), **Busy** (answers briefly; no lap), **Low** (Comfort is offered), **Asleep** (lap replaced by "sleep against"), **Absent**, and in Life 8 only **Unreachable** (verbs accepted, not answered).

### 13.4 Interfaces

**Consumed (names from brief §6.1)**

| Event | Use here |
|---|---|
| `PhaseChanged` | The Call at Dusk; arrival classification; the silent Dusk |
| `DayEnded` | Slot bookkeeping; `day_in_life`; stage advance in Life 8 A–D |
| `LifeAdvanced` | House dressing, schedule, Bond floor, vignette pools |
| `DistrictClaimed` | `T = 4`; Closing Keystone armed |
| `PatchChanged` | `T` 1–3 (high-water). Narrative is not yet listed as a consumer: §22 |
| `TributeDelivered` | Doorstep pile size; humans' bafflement Textures; Life 8 pile |
| `EncounterEnded` (outcome = loss) | The *Tended* arrival. Narrative is not yet listed as a consumer: §22 |
| `RivalRankChanged` | Bark voice only (outside this document's scope) |

**Emitted**

| Event | Payload | Consumers |
|---|---|---|
| `BondChanged` (canon) | bond (0–10) | Combat (Well-Fed), UX |

**Proposed additions (§22; not canon until the creative-director accepts them)**

| Proposal | Shape | Why |
|---|---|---|
| `HomeArrival` | arrival_type (evening / stay_in / daytime / late / routed), well_fed_eligible (bool, set on Eat) | Combat needs to know whether to grant Well-Fed; UX and Audio need the arrival type |
| `GiftDelivered` | item_type, is_food, recipient | Economy removes the item; in Life 8 Territory & Economy counts Food Carries |
| `NarrativeState` (read-only query) | life_index, life_state, life8_stage, T, caller_today | Territory (Life 8 decay window), Audio, Art (dressing), UX (title card) |
| Clock exceptions | (a) Sleep interrupted once in Life 8 stage B; (b) Wait and Curl Up advance half a phase inside the house; (c) Dusk is held during the Life 9 ending | The brief owns the clock; each needs its ruling |

---

## 14. Formulas

### F1 — Turf progress index

```
T = max over the current Life of:
      4                      if DistrictClaimed(target_district) received
      min(3, patches_held)   otherwise
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| patches_held | int | 0–5 | `PatchChanged` | Patches of the Life's target district currently held by the Bell Clowder |
| T | int | 0–4 | calculated, high-water | Story progress contributed by turf |

**Output range:** 0–4. Never decreases within a Life. **Life 1** substitutes its own two-step index (§7). **Example:** the player takes two Arcade Patches (T = 2), loses one overnight (T stays 2), then takes two more (T = 3).

### F2 — Keystone unlock

```
day_gate(k)  = 1                                   for k = 1
             = 1 + (k - 1) * keystone_day_interval  for 2 <= k < closing
turf_gate(k) = k - 1                                for 2 <= k < closing
unlocked(k)  = played(k - 1) AND ( T >= turf_gate(k) OR day_in_life >= day_gate(k) )
unlocked(closing) = played(all others, or queued for catch-up) AND T == 4
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| k | int | 1–5 (up to 8 in Life 8) | data | Keystone order within the Life |
| keystone_day_interval | int | 1–3 (default 2) | tuning | Days between anti-stall releases |
| day_in_life | int | 1+ | Clock | Days since `LifeAdvanced`, counting from 1 |

**Output:** boolean. **Example (default interval 2):** day gates fall on days 1, 3, 5, 7. A fast player with T = 3 on day 2 sees K2 that evening, K3 next morning or evening by affinity, K4 after it. A slow player with T = 0 on day 7 has still seen K1–K4. **Edge:** with five Keystones and two slots a day, the minimum days needed to show all of them without catch-up is 3.

### F3 — Bond

```
daily_gain  = min( bond_daily_cap, sum of gains earned today )
bond_points = min( 100, bond_points + daily_gain )
on LifeAdvanced:  bond_points = max( bond_points, 10 * bond_floor[life] )
hearts      = floor( bond_points / 10 )         -> BondChanged when hearts changes
```

| Gain | Points | Limit | Condition |
|---|---|---|---|
| Evening or Stay-in arrival | 1.0 | 1/day | Stay-in requires at least one full phase roamed that day |
| Late arrival | 0.5 | 1/day | — |
| Lap | 0.5 | 1/day | Held for `lap_hold_seconds` |
| Gift | 0.5 | 1/day | Put down within reach of a human who is not Unreachable |
| Comfort | 0.5 | per offered beat | Stayed for `comfort_hold_seconds` |
| Guard / Wait | 0.5 | 1/day | Life 6 on; Wait in Life 8 |
| Food Carry | 1.0 | 1/day | Life 8 stages E–F; replaces Gift |

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| bond_points | float | 0–100 | save data | Internal Bond |
| bond_daily_cap | float | 1.5–4.0 (default 2.5) | tuning | Stops grinding in one evening |
| bond_floor[life] | int hearts | 0,1,2,2,3,3,4,5,6 for Lives 1–9 | tuning | The canon "Life minimum" |
| hearts | int | 0–10 | calculated | The canon Bond value consumed by Combat and UX |

**Bond never decreases.** The brief says Bond "never falls below its Life minimum"; this document implements that as a floor applied at each Life's start and no decay at all, because every day ends at home and "neither is punished" (§22).

**Expected ranges.** A player home most evenings earns about 2.0 a day (arrival + lap + one other): about 94 points by the end of Life 7 (47 days), 9 hearts, reaching 10 during Life 8. A player out every night earns about 0.5–1.0 a day: 24–47 points, lifted to the Life 7 floor of 4 hearts. **Example:** day 12, Evening arrival (1.0), lap (0.5), a ginkgo leaf (0.5), an offered Comfort beat (0.5), a second lap (0, limit): sum 2.5, cap 2.5, `bond_points` 21.0 → 23.5, hearts stay 2. **Consumer check:** at 9 hearts Well-Fed is +18% max Nerve (brief §8: 2% per heart); at the floor of 4 it is +8%, on the evenings that player does come home.

### F4 — Authored coverage of home slots

```
slots(life)    = 2 * days(life)
coverage(life) = ( keystones + textures + echoes_expected + waiting_up_expected ) / slots(life)
```

**Target:** 0.6–0.9 at the Life's target day count; never below 0.35 before the Plateau begins. **Example, Life 2 at 7 days:** 14 slots; 5 Keystones + 5 Textures + 1 Echo = 11; coverage 0.79. At 12 days: 24 slots; coverage 0.46, with the last five days on the Plateau.

### F5 — Life 8 hint level

```
hint_level = clamp( days_in_stage_E - 1, 0, 3 )
```

`days_in_stage_E` counts from 1 on the first day of stage E. **Range:** 0–3. **Example:** on the third day without a Carry, `hint_level = 2` (Mikan looks from the pile to the door).

### F6 — Home ratio

```
home_ratio = evenings_home / max( 1, evenings_home + nights_out )
category   = Homebody if home_ratio >= homebody_threshold
             Wanderer if home_ratio <= wanderer_threshold
             Both     otherwise
```

Evaluated per Life from Life 2's flap onward, and over the lifetime for the epilogue. **Range:** 0–1. **Example:** 3 evenings and 4 nights out in Life 4 gives 0.43: Both.

### F7 — Day budget check

Target days per Life: 4, 7, 7, 7, 7, 7, 8, 8, 3 = **58**, inside the brief's 55–65. With the day gates above, the slowest a Life's non-closing story can take is 7 days; the fastest a Life can be completed without catch-up is 3.

---

## 15. Edge Cases

| Scenario | Expected behaviour | Rationale |
|---|---|---|
| The player claims the district in two days | Catch-up (§4.4 rule 5): one backlog Keystone in essential cut plus the Closing on the last arrival; the rest as montage inserts with their traces present next Life | Canon Life-end rule is kept; no beat is lost |
| The player spends 20 days in one Life | Keystones done by day 7; Texture pool plays once; then Routine and Echoes. Nothing repeats as new; the humans' situation holds on its Plateau | No stall, no deadline |
| The player sleeps repeatedly without leaving the house | Days pass and day gates open, but no Evening Bond is earned (no phase roamed), no Closing fires (needs T = 4), and Textures run out | Sleeping is not a way to skip the story or farm Bond |
| The player never comes home before Night, all game | Every evening Keystone is delivered in Forensic staging with a morning coda; Bond sits at the Life floors; the ending is unchanged | Neither curfew choice is punished |
| The Closing Keystone's turn comes on a Late arrival | Forensic staging of the Closing plays; Sleep unlocks after it | §3.8 |
| A Posse wipe sends Mikan home | Arrival classified by the phase of the loss; *Tended* variant; an armed Keystone still plays first | A loss is content, not a skip |
| A wipe happens on the arrival that should carry a Closing Keystone | The Closing plays; the Tended beat is appended as its last shot | Closing cannot be missed |
| Patches are lost after a turf gate was reached | `T` is a high-water mark; no Keystone is revoked or replayed | The human story never runs backwards |
| Mikan is carrying a Gift when a fight starts | The item is dropped at the edge of the fight ring and can be picked up afterwards. On a wipe it is lost | Combat owns the ring; a gift is not a resource |
| A Gift is set down during a Keystone | It lies where it was put; the reaction and Bond are given in the first free moment after the read window | Keystones are not interrupted |
| The player knocks things over at the wake | The object falls. Nobody reacts. A hand rights it later. Alcove objects cannot be touched at all (§11.14) | Cat-true, and no gag |
| The player leaves the house during stage B, C or D of Life 8 | Allowed. The town plays normally; stage timers advance on sleeps regardless | No confinement; grief is not a locked room |
| The player Waits through whole days in stage C | Phases pass; Caterwauls sound; nothing else changes; the stage still ends after `wait_days` sleeps | Waiting is honoured but cannot be prolonged into a stall |
| The player never performs a Food Carry | Hints escalate to level 3 and stay there. Stage E does not end. All other play continues | The one required act; see §23 |
| Life 8 with no Patches, no Tribute and an empty Stash | Requirement on Territory & Economy (§18.4): one carryable food item must always be obtainable within a single day (scavenging, begging, a fight) | The Carry must never be blocked by the economy |
| Two Food Carries on one day | The second is received with a touch but does not advance the count | Three days, not three button presses |
| The player Carries food to Koharu rather than Sora | Counts. Carry beats 1–3 are staged so that either placement works; in Carry 2 Koharu fetches Sora's attention | The player chooses whom to feed |
| Mikan has been renamed | No effect: the Call is not a word | Canon |
| The player muted audio or cannot hear | Every Keystone passes the muted Tier A test (§3.4 rule 2); the Call has a visual form (§18.3); the silent Dusk is shown by the ear-turn with no arcs | Accessibility |
| The player returns after weeks away from the game | No recap text. The house's persistent traces, the photo shelf and the current Routine are the recap; a load-in may place the camera on the newest trace for 3 s (UX) | No-Translation Law |
| A save is loaded mid-visit | The home visit resumes in Free at home; a Keystone counts as played only once its read window has completed | No half-seen beats |
| Difficulty mode is changed | No effect on any part of this system | Brief §8 |
| The fallback cut (4 districts) is taken | Nine Lives remain. Paired Lives share a merged district: the first Life of a pair uses `T` up to 3 with a mid-district goal, the second ends on the Boss. Needs Territory's ruling (§23) | Brief §10 |
| Bond is already 10 before Life 8 | Gains are discarded; all Life 8 beats play identically | Bond never gates story |
| The player reaches Life 9's Dusk without the heir named or the walk finished | Koharu's ordinary Call plays; the ending does not trigger; the day ends as any other | No pressure in Life 9 |
| The player ignores the final Call and stays out through Night | Forensic ending: Koharu asleep on the veranda under the Lamp, the Bowl beside her. Mikan climbs into her lap. Beats 7–8 follow | Both readings to the end |

---

## 16. Dependencies

Each row must be mirrored in the other document when it is written.

| System | Direction | Nature of dependency |
|---|---|---|
| Day clock and Life progression (creative brief §5) | This depends on it | Phases, day index, Life index, the Life-end rule. Three clock exceptions requested (§13.4) |
| Territory & Economy | This depends on it | `PatchChanged`, `DistrictClaimed`, `TributeDelivered`; the Doorstep pile; the Stash as a food source |
| Territory & Economy | It depends on this | Life 8 stage for the decay window; Food Carry detection; the Season Turn's elapsed time; Curl Up as a Sunspot |
| Combat | It depends on this | `BondChanged`; Well-Fed eligibility |
| Combat | This depends on it | `EncounterEnded` (loss) for the Tended arrival; dropping a carried item at fight start |
| Crew & Progression | This depends on it | Loyalty ranking (who sits on the wall); Mikan's ageing sets; the heir |
| Crew & Progression | It depends on this | When the Old and Elder sets begin (after the Season Turn; Life 9) |
| Nemesis | This depends on it | Verdict history per Boss for the Life 9 Farewells; the Nose-Touch animation reused at home |
| Nemesis | It depends on this | Bark voice and the Life 8 restrained pool; the rule that no bark refers to the household |
| Art | It depends on this | §18.1 |
| Audio | It depends on this | §18.2 |
| UX | It depends on this | §18.3 |
| Level design | It depends on this | The house's seven spaces and fixed anchor points; Sightings locations; the route home being short from every district |
| Engineering / tools | It depends on this | Vignette sequencing with player control retained; per-Life home state as core save data; the Routine scheduler; Home Scent maps |
| Writer; world-builder (delegates) | They depend on this | Vignette scripts for every Keystone, Texture and Echo; Boss and district lore consistent with the rhymes in §7 |

---

## 17. Tuning Knobs

| Parameter | Current | Safe range | Effect of increase | Effect of decrease |
|---|---|---|---|---|
| `keystone_day_interval` | 2 days | 1–3 | Slow players wait longer for beats; more Plateau risk before story is complete | Story front-loads; later days thin |
| `catchup_max` | 1 | 0–2 | Longer final evening for rushers (above 60 s risks friction) | More beats pushed into montage inserts |
| `texture_rate` | 0.7 | 0.4–1.0 | Pool exhausted sooner; richer early days | More Routine-only slots; pool lasts |
| `echo_cooldown` | 2 slots | 1–4 | Reflections feel rarer | Risk of the house seeming to comment constantly |
| `vignette_read_window` | 12 s | 6–20 s | More certain comprehension; more friction at the door | Players leave before the beat lands |
| `max_control_loss` | 4 s | 0–6 s | More directed scenes; less "playable-adjacent" | Harder staging |
| `bond_daily_cap` | 2.5 | 1.5–4.0 | Bond maxes earlier; less to gain late | Home feels less rewarding per evening |
| `bond_floor[life]` | 0,1,2,2,3,3,4,5,6 | each ±1; non-decreasing | Night-owls get more Well-Fed; the curfew trade weakens | The trade sharpens; risks reading as punishment |
| `lap_hold_seconds` | 4 s | 2–8 s | Lap is a real pause | Lap becomes a tap |
| `comfort_hold_seconds` | 6 s | 3–10 s | Staying is a commitment | Comfort is cheap |
| `call_repeat_count` | 2 per Dusk | 1–3 | Harder to miss; risks nagging | Easier to miss the day's central cue |
| `preflap_grace_seconds` | 120 s | 60–180 s | Looser tutorial evenings | Tighter habit-training |
| `homebody_threshold` / `wanderer_threshold` | 0.6 / 0.3 | 0.5–0.75 / 0.2–0.4 | Fewer players get a defined Echo set | More get one; "Both" narrows |
| `wait_days` (Life 8 stage C) | 2 | 1–3 | Longer low-agency stretch; heavier | Lighter; the absence has less time to be felt |
| `stage_b_timeout` | 90 s | 45–150 s | More time alone in the open house | Less |
| `season_turn_seconds` | 20 s | 12–30 s | Heavier; risks indulgence | May not register |
| `carry_days_required` | 3 | 2–4 | Slower repair; more street play between | Recovery risks feeling sudden |
| `hint_days_per_level` | 1 | 1–2 | Longer for the player to find the Carry unaided | More hand-holding |
| `clung_control_loss` (Carry 2) | 6 s | 3–8 s | The hold lands harder | Less |
| `life_target_days[]` | 4,7,7,7,7,7,8,8,3 | sum 55–65 | Longer game | Shorter |

---

## 18. Requirements Handed to Other Departments

Narrative states what the story needs. How it looks, sounds and is laid out is each owner's decision.

### 18.1 Art (art director, technical artist)

1. **Identification without faces.** Each human must be recognisable from the knees down and by one hand, in every life-stage: signature colour plus a shape cue (gait, footwear, a hand habit). Colour must be backed by shape or pattern for colour-blind players.
2. **The home camera question.** Canon (brief §4) is a follow camera at about 55° with authored yaw. Canon also says humans are knees, hands and laps, with faces only when they bend. This document needs, inside the house: (a) humans cropped so that faces are normally out of frame during free play; (b) authored cat-height shots (10–40 cm) for vignettes; (c) a clean way for a face to enter frame as an event. How those are reconciled with the 55° camera is for the art director and camera owner to decide (§23).
3. **Haru's House in nine states**, seven spaces, per §8.1, with every bold item as a distinct, readable prop at cat height.
4. **Life-stage sets:** Haru at 16, 17–18, 22, 23–25, 26, 28 (pregnant and after), 31; Sora at about 25, 28, 31, 36; Koharu as infant, about 3, and 8; Gran in Lives 1–4, visibly slower in Life 4; black clothing for Sora and Koharu; about six generic adults for the wedding and the wake.
5. **Persistent player objects:** the Bowl with its chip; the Box in five states of wear; the Gift Jar in fill states driven by `gifts[]`.
6. **Home Scent** (§3.7): four freshness steps per colour, the braided second tint, the coral-with-a-yellow-strand, the incense overlay. A scent map per home state.
7. **Light states:** the Veranda Lamp lit and dark as a silhouette readable from the lane; the study lamp; curtains open and shut; the Season Turn through frosted glass.
8. **Photographs and drawings** as images with no captions: the Alcove photos, the shelf photos (two Life 7 variants), Koharu's drawing, the album.
9. **Shoes** as a prop family with clear colour identity and deliberate placement states (crooked, parallel, askew, in rows).
10. **Scribble** on every written surface, including envelopes, box sides, the calendar, book pages, instruction sheets and the clock face.
11. **Mikan's reaction set** per Keystone (ears, tail, pupils), and the Sense Icon set of §3.6.
12. **Montage support:** dissolves of one room across states with Mikan fixed in place and ageing on screen.
13. **Restraint list** (§11): no close-up rigs for crying faces; no coffin, vehicle or hospital assets.

### 18.2 Audio (audio director)

Audio owns the Call motif system, instruments and Murmur. Narrative's needs:

| Need | Requirement |
|---|---|
| **The Call** | Three notes (up a third, down a fifth), sung on an open vowel, never a word. Performable as: Haru's sung voice at 16, 18, 25, 31; Gran's spoon-taps and her flat hum; a tinny telephone version; Sora's flat whistle; Sora's unconscious in-tune hum (Life 9); Koharu's two notes at 3; Sora-two-plus-Koharu-one; Koharu's full sung version at 8. Audible at any distance in town, directional toward home |
| **A fourth beat** | The collar bell answers the Call. Mikan's instrument is the bell, diegetic, in every Feeding |
| **Home theme** | The Call extended into a melody; also a lullaby form (K6.5) |
| **One instrument per human** | Each must be recognisable alone, and removable. In Life 8 the family arrangement plays with Haru's line left as rests: the hole must be audible |
| **Sora's line** | Out of step with the Call in K4.2–K4.4; in harmony from K4.5; the wedding dance is the duet; available diegetically from his record player |
| **Koharu's line** | Related to her parents' (for instance the Call inverted); her voice takes Haru's vacant line in Life 9 |
| **Gran's line** | Low and simple; fades from the mix across Life 4; a trace survives in the Alcove ritual cue |
| **Street/home kinship** | The Bell Clowder's street theme should contain the Call's intervals, so that in the Food Carry it can be played slowly on the home instruments and be recognised as both |
| **Silence** | No non-diegetic music in the house from Life 8 B1 until the first Food Carry pick-up. No foreshadowing cue in stage A |
| **Murmur** | Prosody only; per-human timbre and age; through-door and telephone filters; crowd Murmur in two moods (wedding, wake); one non-Murmur sound for Sora at B2. No syllable repeated so as to suggest a name |
| **Cat-ear mix at home** | Kibble rattle, can opener, key, cupboard, the bell: louder than the television or conversation |
| **Ritual sounds** | The Tap-Tap on ceramic (and once on floorboards); tongue on a dry bowl; the Lamp's cord click |
| **Home Scent sonification** | Per-human tone, fading with freshness; no melody |
| **Life 8 streets** | Thinner and slower, not mournful |
| **Vocals** | No lyrics in any language anywhere in the game |

### 18.3 UX (UX designer)

1. **No system text may name a human event** (X5): objectives, tips, achievements, save labels, loading screens, store text for gameplay captures. Life goals are stated as turf goals only.
2. **Life title cards** use the brief's titles. The Life 8 card is withheld until the end of K8.4 and is small and silent. Save-slot labels show the Life number and district, not a story summary.
3. **Home prompts:** one contextual Interact, Meow, Carry. Prompts must not caption the scene ("Comfort Haru" is forbidden; an icon or a neutral verb is required). Final wording is UX's, within X5.
4. **Bond display:** hearts, shown at home. No floating "+1". No animation in Life 8 stages B–D.
5. **Sense Icon rendering:** bubble over Mikan, two icons at most, legible on a handheld.
6. **The Call's visual form:** three bell-gold arcs travelling from the direction of home, plus Mikan's ear-turn, so it reads with sound off. In Life 8: ear-turn, no arcs.
7. **No skip.** A vignette cannot be skipped. A pause is always available. On a second playthrough: OPEN (§23).
8. **No recap text.** An optional three-second camera rest on the newest persistent trace when loading into the house.
9. **The Morning Sniff** reports cat business only, in every Life including 8.
10. **The Food Carry has no objective marker.** The Carry prompt on the Doorstep pile is the ordinary one until hint level 3, when it may pulse.
11. **Sleep confirmation** is the same prompt in the same place for the whole game, including the last one.
12. **Accessibility:** muted-audio comprehension; colour-blind-safe identification; a photosensitivity check on the fireworks; hold-to-settle actions (Lap, Wait, Comfort) need a toggle alternative.
13. **Content note:** an opt-in advisory, if adopted, lives in the options menu and never in the flow of play (§23).

### 18.4 Territory & Economy

1. Emit `PatchChanged` to Narrative, or expose patches held in the target district.
2. Define the Life 8 turf condition ("retakes what matters"). Narrative's request: small and personal, not the whole town. Suggested: the Patch containing Haru's House, plus any holdings that put food on the Doorstep.
3. Guarantee one carryable food item is obtainable within one day in any economic state.
4. Decide what a Food Carry costs and where the item comes from (Doorstep pile, Stash, both).
5. Decide whether the Season Turn applies elapsed decay or is cosmetic, and when triple decay starts and stops (proposed: stages C–F).
6. Keep Tribute physically present on the Doorstep as a pile whose size the player can read from Life 2 on; it is the set-up for Life 8.
7. Rule on Curl Up at home as a Sunspot.
8. Optional sink: Shinies as durable Gifts in the Gift Jar. Narrative does not require it.

### 18.5 Combat, Nemesis, Crew & Progression, Level, Engineering

- **Combat:** consume Well-Fed eligibility; define what happens to a carried item at encounter start; no combat inside the wall (canon).
- **Nemesis:** supply per-Boss Verdict history for the Life 9 Farewells; share the Nose-Touch input and animation for home use; honour the Life 8 bark restrictions; no Ambush on Mikan during the Life 9 walk home.
- **Crew & Progression:** supply Loyalty ranking for the wall; time the Old set to the Season Turn and the Elder set to Life 9; the heir.
- **Level:** keep the walk home short from every district; fix anchor points in the house (the Bowl's spot, the step, the Alcove, sleep spots) across all nine states.
- **Engineering:** in-engine vignette sequencing that leaves the player in control; a schedule-driven Routine layer; per-Life home state, House Memory and Keystone ledger as core save data; a text-audit tool that fails the build on any non-Scribble glyph in human-world textures.

### 18.6 Game feel at home

| Aspect | Target |
|---|---|
| Reference | The weight and unhurriedness of sitting down in a warm place. Not the snap of combat: no hit-stop, shake or action lines inside the wall |
| Interact response | A human or object begins to respond within 100 ms of input |
| Lap | Hold to settle; a visible sink into the lap over about 0.6 s; purr loop and controller rumble; release at any time |
| Carry | Mikan's head is held high and the gait shortens; turning is slightly wider. In Life 8 the Old gait is slower still |
| Wait | Hold; light moves; release at any time and Mikan stays seated until the stick is moved |
| Failure texture | There is none. No home input is ever wrong |

---

## 19. Cross-References

Sibling GDDs do not exist yet; targets are named by owner as in brief §6. Paths to be filled in when those documents are written.

| This document references | Target | Specific element | Nature |
|---|---|---|---|
| Day phases, Sleep ends the day, clock paused at home, drowsy grace | `design/creative-brief.md` §5.2 | Day clock | Rule dependency |
| Life-end condition; nine Lives table; Life 8 inversion | `design/creative-brief.md` §5.4 | Life progression | Rule dependency |
| Language rule | `design/creative-brief.md` §5.5 | Rules 1–5 | Rule dependency |
| Narrative step of the Night Shuffle | `design/creative-brief.md` §5.3 | Step 4 | State trigger |
| Well-Fed = +2% max Nerve per heart | `design/creative-brief.md` §8; Combat GDD (path TBD) | Buff value | Ownership handoff (Narrative sets Bond; Combat owns the effect) |
| Patches held; district claimed | Territory & Economy GDD (path TBD) | `PatchChanged`, `DistrictClaimed` | State trigger |
| Tribute on the Doorstep; the Stash | Territory & Economy GDD (path TBD) | `TributeDelivered`; Stash contents | Data dependency |
| Life 8 decay; bring-food-home mechanics | Territory & Economy GDD (path TBD) | Decay window; Food Carry cost and count | Ownership handoff |
| Sunspot rules for Curl Up and Wait | Territory & Economy GDD / brief §3.2 | Nap = save, heal, half a phase | Rule dependency |
| Loss sends Mikan home | Combat GDD (path TBD) | `EncounterEnded` outcome = loss | State trigger |
| Nose-Touch | Nemesis GDD (path TBD) | Verdict input and animation | Rule dependency |
| Boss Verdict history | Nemesis GDD (path TBD) | Per-Boss Memory | Data dependency |
| Loyalty; ageing sets; heir | Crew & Progression GDD (path TBD) | `Loyalty(cat_id)`; Life 8/9 modifiers | Data dependency |
| Whisker Sense look and sound | Art bible; Audio direction (paths TBD) | Scent rendering and sonification | Rule dependency |

---

## 20. Acceptance Criteria

**Rulebook**

- [ ] A text audit of every human-world texture, UI string shown during home scenes, achievement and loading tip finds zero readable glyphs and zero strings naming a human event (X1, X2, X5).
- [ ] Every Keystone's design sheet lists at least three channels, at least two visual, one persistent trace and one Mikan reaction (§3.4), and a reviewer can point to each in the build.
- [ ] Every idiom in the §3.4 vocabulary table appears in the build at least three times before its pay-off.
- [ ] No Sense Icon from the forbidden list (X7) exists in the asset set.
- [ ] In a full playthrough capture, the camera never shows a location where Mikan is not present (Witness Law).

**Comprehension (unbriefed playtests, eight or more players per round)**

- [ ] After Lives 1–2, at least 90% retell each Keystone's Tier A fact unprompted or with one neutral prompt ("what was going on at home?"), and at least 65% state the Tier B fact.
- [ ] The same thresholds hold for a second group playing with audio muted (Tier A only).
- [ ] After Life 5, at least 80% can say, without prompting, that Gran has died, and how they know.
- [ ] At the end of K8.4, at least 90% understand that Haru is not coming back; 0% report that the game told them so in words.
- [ ] At least 70% of players perform the first Food Carry at hint level 0 or 1; 100% by level 3.
- [ ] Among players who came home Late on more than 70% of evenings, Tier A comprehension is within 10 points of the Witness group.

**Pacing and triggers (automatable)**

- [ ] For simulated play at 2, 3, 5, 8 and 20 days per Life, every Keystone of that Life is recorded as played in full, in essential cut, or as a montage insert before `LifeAdvanced`; none is dropped.
- [ ] No Closing Keystone plays with `T < 4`; no Life advances without its Closing Keystone having played.
- [ ] At most one Keystone plays per home slot, except the catch-up arrival, which plays at most `catchup_max + 1`.
- [ ] `T` never decreases within a Life under any sequence of `PatchChanged` events.
- [ ] No Texture plays twice within one Life.
- [ ] Life 8 stages A–D advance on sleeps alone, in order, regardless of turf state; stage E cannot be exited without a Food Carry.
- [ ] Bond: `bond_points` never decreases; daily gain never exceeds `bond_daily_cap`; hearts at each `LifeAdvanced` are at or above the Life floor; `BondChanged` fires only when hearts change.
- [ ] Sleeping without roaming a full phase grants no Evening Bond.
- [ ] No value in House Memory records Mikan's whereabouts on Life 8 day 1.

**Home phase**

- [ ] From waking to "door accepts input" is 45 s or less on every morning, and 20 s or less on mornings with no Keystone.
- [ ] No home vignette withholds control for more than `max_control_loss`, except Carry 2 (`clung_control_loss`).
- [ ] Every home verb in §5.4 produces a visible response within 100 ms in every Life; in Life 8 stage C each produces the "unanswered" response of §9.4.
- [ ] Each reflection in §6.2 can be triggered in a test save and is visible in the house.
- [ ] Alcove objects cannot be knocked, carried or sat on in any Life.

**Life 8 and tone**

- [ ] No non-diegetic music plays inside the house between B1 and the first Food Carry pick-up (audio log check).
- [ ] The Life 8 stage A morning uses the same music cue and camera set-ups as a Life 7 morning (asset comparison).
- [ ] No asset depicts the accident, a vehicle, a hospital, a body or a coffin.
- [ ] In post-play interviews, fewer than 15% of players describe Life 8 as "manipulative", "cheap" or "forced"; at least 70% report that they wanted to bring the food before or without being hinted.
- [ ] No player reports believing that a different choice of theirs would have saved Haru; if any do, the cue that suggested it is identified and removed.
- [ ] At least 70% of players describe the end of Life 9 with a word in the family of "warm", "peaceful" or "smiling".
- [ ] A cultural consultant has reviewed the wake, the Alcove and the fish-on-a-dish beat before final art.

**Engineering**

- [ ] All values in §17 are loaded from data; none is hard-coded.
- [ ] Home state, Keystone ledger, House Memory and Life 8 stage survive save and load at every state in §13.1.
- [ ] Slot selection completes within 2 ms; entering the house causes no hitch above one frame at target frame rates on the handheld target.

---

## 21. Canon Levels and Documented True Answers

| Content | Canon level |
|---|---|
| Names, colours, ages, Life titles, turf goals, Bosses, the Call, the language rule, the Life 8 inversion, the single ending | **Established** (creative brief) |
| Everything this document adds: individual Keystones, the five rituals, the vocabulary table, the house's layout and change table, the home verbs, House Memory, the Life 8 stages, the Life 9 ending staging | **Provisional** (awaiting design review and creative-director sign-off) |
| Items listed in §22 that touch another owner's boundary or extend the brief | **Under Review** |

**Mysteries** (the narrative rules require a documented true answer for each)

| Mystery | True answer |
|---|---|
| What happened to Haru | **Deliberately undetermined, at dev level too.** The brief rules that the accident is never shown, explained or specified. No cause is to be written down, so that none can leak into a prop, an animation or a sound. This is a knowing exception to the "true answer" rule and is raised in §23 |
| Who the old man in the Alcove is | Gran's late husband, Haru's grandfather. Dead before Life 1 |
| Where Haru's parents are | Not answered here; they do not appear. Needs a ruling (§23) |
| Where Haru goes in Life 3 | A city, to study. Tier C only: the unfamiliar smell, the city coat |
| What Sora does | Works at Shiosai Harbour (smell of sea; the Life 5 Sighting). Tier C |
| Who the visitor in the grey cardigan is | A neighbour from Hidamari Lane. Not a relative, so that no new family member needs introducing |
| Who abandoned the kitten | Never answered, never pursued (brief §9: the box is as dark as abandonment gets) |
| Whether Mikan is alive in the last shot | OPEN, the user's decision (brief §11.7). Recommended: yes |

---

## 22. Assumptions for Creative-Director Review

Decisions taken inside the narrative boundary, or requests that cross it. None is canon until accepted.

**New terms introduced**

Keystone, Closing Keystone, Texture, Echo, Routine (layer), Plateau, Turf progress index `T`, Witness / Forensic reading, Aftermath staging, the Alcove, the Veranda Lamp, the Goodbye, the Tap-Tap, the Bowl (and its chip), the Box (as a persistent prop), Home Scent, the Gift Jar, House Memory, Sighting, the Wait verb, Curl Up, the Tended arrival, Life 8 stages A–G, the Season Turn, the Food Carry.

**Additions to the brief's story**

1. **Grandpa's photo in the Alcove from Life 1**, with a daily incense ritual. The brief has Gran's photo on her cushion (Life 5) and Haru's beside it (Life 8); this adds an earlier photo so the idiom is taught before it matters.
2. **Life 8 opens on an ordinary day**, with the telephone on the first night, rather than opening on the telephone. No montage and no title card precede it.
3. **Sora takes Koharu with him** when he runs out, and returns with her at dawn.
4. **The Season Turn**: an in-Life time skip of some weeks at the end of stage D, which is also when Mikan becomes Old.
5. **Koharu sings one note of the Call at the end of Life 8.** The brief says she sings the Call in Life 9; this gives her the third note four in-game days earlier.
6. **The wedding party is at the house.** The ceremony itself is elsewhere and unseen.
7. **The Life 4 proposal gives Mikan a playable part** (batting the ring), and ends on a Nose-Touch offered to Sora.
8. **Household Sightings in town** (optional).
9. **Mikan's small cushion**, sewn by Gran, beside the Alcove.
10. **Koharu's own goodbye** (forehead to forehead) rather than a copy of Haru's.

**Rules decided here**

11. **Bond never decreases**; the "Life minimum" is a floor applied at each Life's start (F3).
12. **Well-Fed requires eating the evening Bowl**, not merely arriving by Dusk.
13. **Stay-in**: sleeping at home before Dusk counts as an evening at home only if a full phase was roamed that day.
14. **Before the flap**, the Call repeats at the end of Dusk and Mikan walks home after the 2-minute grace.
15. **Home Whisker Sense shows human scent** in signature colours, extending the brief's Clowder-colour scent.
16. **The Call is audible town-wide** and has a visual form.
17. **Gifts are a non-currency object class** found in town; Mikan carries one thing at a time.

**Requests across boundaries**

18. Narrative added as a consumer of `PatchChanged` and `EncounterEnded`.
19. New events `HomeArrival` and `GiftDelivered`; read-only query `NarrativeState`.
20. Three clock exceptions (§13.4).
21. Curl Up at home treated as a Sunspot.
22. The home camera requirement (§18.1 item 2) against the canon 55° follow camera.
23. Vertical-slice vignette count: this design needs about 16 for Lives 1–2 (9 Keystones, about 5 Textures, 1 Echo, 1 Waiting-up), against the brief's "about 10".

**Not done in this pass (by instruction, this file only):** `design/gdd/systems-index.md`, `design/registry/entities.yaml` and `production/session-state/active.md` were not created or updated.

---

## 23. Open Questions / Known Weak Spots

Stated plainly for reviewers. Owners are proposals.

| # | Question or weakness | Why it matters | Owner |
|---|---|---|---|
| 1 | **Camera.** The 55° follow camera and "humans are knees and laps" pull against each other. This document leans on cat-height authored shots that the canon camera does not obviously provide, and all three storyboards assume them | If the home is shown from above, C12 and much of C1 and C2 are lost, and faces can no longer be an event | art-director, creative-director |
| 2 | **"One day is one day" is only true inside a Life.** The user's intent is that a day of the cat's life is a day of the owner's. Here fifteen human years pass in about 58 days because the years go by in montages, and Life 3 covers four years in a week | The user may have meant something stricter, or looser | user |
| 3 | **The Plateau strains belief.** A player who lingers 20 days in Life 6 sees a household that never changes; a pregnancy or an exam season cannot plausibly idle | Anti-stall is solved mechanically, not fictionally | narrative-director, game-designer |
| 4 | **Catch-up is the weakest pacing rule.** A fast player gets beats as essential cuts or montage inserts, which is exactly the "montage disconnected from play" Pillar 2 warns about. The real fix may be a minimum of three days per Life, which is Territory's to guarantee | The best players of the turf game get the thinnest home story | Territory & Economy, narrative-director |
| 5 | **Scope.** About 113 vignettes, each Keystone in three forms and evening Keystones in two stagings, nine house states, seven human life-stage sets. The slice alone needs about 16 vignettes against a budget of about 10 | This is likely more than "home vignettes" was costed at; production has not seen it | producer |
| 6 | **Forensic reading is unproven.** It may be too subtle; night-owl players may simply miss the story and the 10-point comprehension criterion may fail | The curfew choice would then be punished after all | narrative-director; playtest |
| 7 | **The Food Carry can stall.** It is the one act the game requires and refuses to perform for the player, in a game with "no fail states". Hint level 3 is close to a tutorial; whether that is still "discovered" is doubtful | The USP moment is either unprompted for most players or it is not the moment the brief describes | creative-director; playtest |
| 8 | **Ludonarrative risk in Life 8's streets.** A player who leaves the wake to brawl meets jaunty cartoon fights. The request for "thinner, slower, not mournful" street audio is a hope, not a design | Tonal whiplash is the brief's risk 6 | audio-director, combat designer |
| 9 | **The Season Turn** breaks the day-for-day premise, changes Mikan's model mid-Life, and asks Territory to accept weeks of off-screen decay. Without it, Mikan becomes Old overnight and triple decay over a few days rots very little | The brief's Life 8 may not be achievable day-for-day | creative-director, Territory & Economy |
| 10 | **Opening Life 8 on an ordinary day** departs from the brief's wording and spends a whole day on a set-up the player cannot recognise. It may read as padding on replay | The alternative (wake to the telephone) is quicker and more of a shock, which is the thing §11 tries to avoid | creative-director |
| 11 | **Koharu's third note in Life 8** may steal from Life 9, where the brief places her singing. Alternative: Life 8 closes on the Lamp and Sora's two broken notes only | Two pay-offs or one | creative-director |
| 12 | **Mikan as agent.** The concept calls the protagonist a witness, not an agent. Batting the ring (K4.5) and the purr that quiets the baby (K6.4) give Mikan small causal roles | They are charming and may dilute the premise | creative-director |
| 13 | **Fish at the Alcove; the wake.** Koharu placing the fish before the photo, the kneeling rows, incense and black dress are culturally specific in a town whose country is "never stated". Risk of error or of cliché | Needs a consultant before art; the fish beat may have to change | narrative-director, producer |
| 14 | **Sora and Koharu on the night.** A father running into the rain with a sleeping three-year-old, and a toddler present through everything after, will be hard for some players. Guardrail 16 is thin | Rating, audience, and the line between honest and harrowing | creative-director |
| 15 | **No documented cause of death.** The narrative rules demand a true answer for every mystery; the brief forbids this one. §21 records a deliberate exception | A rule is being broken on purpose and someone should approve that | creative-director |
| 16 | **Haru's parents are unexplained.** A sixteen-year-old lives with her grandmother and nobody asks why. Players will wonder; a cat would not | Either a Tier C answer is needed or a decision that there is none | narrative-director, world-builder |
| 17 | **Is the Call heard across the whole town?** It is the day's central cue and the Life 8 absence depends on it, but a girl's voice carrying from Hidamari Lane to the lighthouse is a stretch even for cat ears | May need to be "heard" as Mikan's own sense of the hour once out of range | audio-director |
| 18 | **Deaf and hard-of-hearing players.** The game's emotional spine is a melody and its absence. The arcs-and-ear-turn substitute is a patch, not an equivalent | Accessibility of the USP itself | ux-designer, audio-director |
| 19 | **Content note versus surprise.** An opt-in advisory protects players who have lost someone; any advisory tells everyone what is coming | Pillar 2 forbids a skip; it does not settle this | user |
| 20 | **Second playthroughs.** No skip, ever, is right the first time and may be wrong the third | Needs a ruling compatible with Pillar 2 | creative-director, ux-designer |
| 21 | **Bond floors may make home optional.** A night-owl is lifted to 4–6 hearts for nothing; if that is enough Well-Fed, the curfew trade is hollow. If floors are lowered it reads as punishment | Depends on Combat's balance, which does not exist yet | combat designer, economy |
| 22 | **Well-Fed disappears in Life 8** just as Mikan gets old and the streets get harder. That is thematically right and may be mechanically miserable on Feral | Difficulty spike at the emotional low point | combat designer |
| 23 | **Gift and Carry versus combat.** Dropping a carried item when a fight starts, and Gifts as a new object class beside Morsels and Shinies, are both light on detail | Overlaps Economy's and Combat's boundaries | economy, combat designer |
| 24 | **The fallback cut.** With four districts and nine Lives, two Lives share a district and the `T` gates need redefining | Not designed here | Territory & Economy |
| 25 | **Selectable Haru and Sora** (brief §11.4) would multiply every life-stage set in §18.1 | This document assumes the default | user |
| 26 | **Gran's death may be missed.** It happens inside a montage. If players do not register it, the Alcove idiom fails and Life 8's wake must do all its own teaching | The 80% criterion in §20 is the test; there is no fallback yet | narrative-director; playtest |
| 27 | **The Life 9 ending** is staged to suit either reading of Mikan's fate. An ending built to be ambiguous can land as evasive | Needs the user's decision before the last 30 seconds are written properly | user |
| 28 | **Sightings** put household humans on the streets, which may blur the street/home separation the brief depends on | First candidate to cut | creative-director |
| 29 | **Knocking at the wake** is allowed and unanswered. It may be the right kind of bleak, or it may produce clips that make the game look callous | Could be disabled for stages B–D instead | creative-director |
| 30 | **Sense Icons include a question mark**, which is a human symbol. It is canon (brief §5.5.3) but sits oddly beside X3 | Consistency of Pillar 1 | creative-director |

# Game Pillars: Cat RPG (working title)

## Document Status
- **Version**: 1.0
- **Last Updated**: 2026-11-23
- **Approved By**: creative-director (author); awaiting user sign-off
- **Status**: Draft

Canonical terms used here (Mikan, Haru, Posse, Rival, Verdict, Pounce Gauge, Slow Blink, Frazzle, Pile-On, Tribute, Life...) are defined in `design/creative-brief.md`.

---

## Core Fantasy

> **Boss outside, pet at home.** You are a small animal with a secret empire. On the streets of Yunagi you are feared: you spray your mark on six districts, lead a posse of cats you beat and won over, and every rival on the wall knows your name. Then a human sings three notes, and you run home like a kitten. You never understand a word that human says. You understand everything that matters.

---

## Target MDA Aesthetics

| Rank | Aesthetic | How Our Game Delivers It |
| ---- | ---- | ---- |
| 1 | Sensation | Maximalist cel-shaded combat feel (hit-stop, action lines, dust clouds); painted nostalgic town; music carrying the story |
| 2 | Fantasy | Being a cat: scent, rooftops, naps, status games; the double life of boss and pet |
| 3 | Narrative | Authored: Haru's life in nine wordless chapters. Emergent: personal histories with Rivals |
| 4 | Challenge | Conducting a four-cat Posse in real time; Bosses and Nemeses that adapt to how you beat them |
| 5 | Expression | Posse composition, Move teaching, Verdicts that shape who populates your town |
| 6 | Discovery | Scent trails, High Road routes, hidden Strays, reading the human story from clues |
| 7 | Submission | Naps, the walk home at dusk, lap time |
| N/A | Fellowship | Single-player; relatedness comes from Haru and the Crew, not other players |

---

## The Pillars

### Pillar 1: Cat's-Eye Truth

**One-Sentence Definition**: Everything in the game is perceived, valued and done the way a cat would, and the player is never given information a cat could not have, above all, intelligible human language.

**Target Aesthetics Served**: Fantasy, Discovery, Sensation

**Design Test**: If we are debating between a clear subtitle that explains a story beat and a staging change (a colour, an object, a melody) that most but not all players will read, this pillar says we choose the staging and fix it with craft, never with words.

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | Mechanics come from cat behaviour, not from RPG convention with ears on | The map overlay is Whisker Sense (scent you can see); the save point is a nap in a Sunspot; the currency is food |
| **Art** | Camera, scale and framing belong to something 25 cm tall | Humans are knees, hands and laps; faces appear only when they bend down. All human writing is Scribble |
| **Audio** | Human voices are tone without words; the world is mixed for cat ears | Murmur speech; a can opening three rooms away is louder than the television |
| **Narrative** | Story is shown through what changes in the house, never told | Sora is introduced as a second pair of shoes in the entryway |
| **Engineering** | Systems must support wordless, in-engine vignettes and a sense-mode render path | Whisker Sense as a first-class render feature, not a post-process afterthought |

**Serving This Pillar**
- Tribute arrives as a pile of fish on the Doorstep, to Haru's bafflement.
- Rival weaknesses are real cat fears: water, cucumbers, the vacuum.

**Violating This Pillar**
- A readable calendar, letter, phone screen or shop sign. A subtitled human line, even one, even in the ending.
- A quest log that says "Haru is getting married". Cats talking to each other about human events.
- An equipment system of swords and armour for cats.

---

### Pillar 2: Two Lives, One Clock

**One-Sentence Definition**: Every in-game day advances both Mikan's turf and Haru's life, and the home is a place the player must pass through and wants to, not a menu and not a skippable cutscene.

**Target Aesthetics Served**: Narrative, Submission, Fantasy

**Design Test**: If we are debating between letting the player fast-travel and sleep anywhere to keep the turf loop tight, or routing every day's start and end through Haru's House, this pillar says every day starts and ends at home, and we make the trip short and the arrival rewarding.

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | Home gives things the street cannot, and the street costs time you could spend at home | Being home by Dusk grants Bond and the Well-Fed buff; staying out all Night grants Clout and rare Rivals |
| **Art** | The house ages with its people; each Life re-dresses it | Haru's room: school desk → empty → shared → nursery |
| **Audio** | One motif, the Call, grows up with Haru and survives her | Sung by a teenager, hummed by a tired parent, finally sung by Koharu |
| **Narrative** | Home beats are paced by territory milestones, never by a calendar the player can fail | A Life ends when its district is claimed and Mikan sleeps |
| **Engineering** | Day clock, Life state and home state are core save data, built first | The clock pauses in combat and menus so home is never missed by accident |

**Serving This Pillar**
- Life 8: the Tribute you hoarded becomes food you carry home to a grieving family.
- Haru installing the cat flap is what unlocks Night.

**Violating This Pillar**
- A "skip home scene" default. Any optional toggle that makes the owner story avoidable.
- Home story delivered as a montage disconnected from play, with no way to walk around in it.
- A deadline: "claim the Arcade in 7 days or lose".

---

### Pillar 3: Conduct the Brawl

**One-Sentence Definition**: Combat is a short, loud, perfectly readable cartoon brawl in which the player directs four cats, and when simulation depth and moment-to-moment feel conflict, feel wins.

**Target Aesthetics Served**: Sensation, Challenge, Expression

**Design Test**: If we are debating between adding a sixth status effect with interesting numbers and spending the same effort on hit-stop, camera and VFX for the Moves we already have, this pillar says polish the existing Moves.

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | Every action has an immediate, exaggerated response; no encounter outstays 90 seconds unless it is a Boss | Frazzle → Pile-On is a guaranteed crowd-pleaser the player can always work toward |
| **Art** | VFX are a language with a budget: one screen-filling effect at a time, Clowder-coloured outlines always visible | Manga action lines and impact frames on Moves; paw-and-claw glyph bursts instead of readable onomatopoeia |
| **Audio** | Hits have weight a kilogram of cat should not have | Taiko-and-brass stabs synced to hit-stop; each Style has a vocal signature |
| **Narrative** | Fights start fast; character comes through 3-second Standoffs, not speeches | A Rival's taunt is one line, 60 characters or fewer |
| **Engineering** | Input latency, animation cancel windows and frame pacing are features | Slow Blink must open on the frame of the button press |

**Serving This Pillar**
- AI-controlled cats fill Paws at half rate, so switching and commanding always matters.
- Arena props (buckets, sprinklers, things on ledges) are there to be knocked over.

**Violating This Pillar**
- Random encounters that cut to a separate battle scene. Damage-sponge Toughs.
- Combat depth that lives in menus (gear scores, elemental charts) instead of on screen.
- VFX so dense the player loses their cat.

---

### Pillar 4: Rivals Remember

**One-Sentence Definition**: Every named cat carries a visible, audible, mechanical history of its dealings with Mikan and the Crew, and because nobody dies, every outcome returns.

**Target Aesthetics Served**: Narrative (emergent), Challenge, Expression

**Design Test**: If we are debating between 20 hand-written side-quest cats with fixed stories and 48 procedural Rivals whose stories come from play, this pillar says the 48, and we spend the writing budget on their bark templates.

| Department | This Pillar Says... | Example |
| ---- | ---- | ---- |
| **Game Design** | A fight with a Rival always ends in a choice (the Verdict) and always changes that cat | Chase Off, Humble, Recruit, Nose-Touch |
| **Art** | History is worn on the model | A notched ear from your bite; a sticking plaster; a Title on the name-card |
| **Audio** | A Rival is recognisable with eyes closed | A personal 2-bar yowl-sting that plays in the Standoff and from off-screen before an Ambush |
| **Narrative** | Voice lives in templates that cite Memory | "Still wearing that bell? I can hear you lose from here." |
| **Engineering** | One Cat Schema for Rivals and Crew; the overnight simulation is deterministic and testable | A recruited Nemesis keeps Memory, Scars and Fears |

**Serving This Pillar**
- Losing a fight promotes the victor and gives them a Title at your expense.
- A neglected ex-Rival in your Crew can betray you and take a Patch with them.

**Violating This Pillar**
- A Rival who greets you generically after you beat him three times.
- Killing or permanently deleting a Rival. Stat-only "elite" enemies with no identity.
- Hiding the hierarchy in a spreadsheet UI instead of on the Fence Line.

---

## Anti-Pillars (What This Game Is NOT)

- **NOT a cat-life simulator**: no hunger, thirst, hygiene or litter meters. They would turn Pillar 1 into chores and steal time from Pillars 3 and 4. Food is power and love, never upkeep.
- **NOT a collect-them-all monster game**: Crew cap is 24, and every one is an individual with history. A 150-entry dex would make Rivals disposable (violates Pillar 4) and explode art scope.
- **NOT a dialogue-driven story**: no human text, no cat exposition about humans, no codex. Violates Pillar 1.
- **NOT dark or violent**: no blood, no street deaths, no cruelty. The only death is off-screen and human. A grim street game would numb the player before Life 8.
- **NOT a timed strategy game**: no deadlines, no losing the save to neglect. Territory can decay; the game cannot be failed. Protects Pillar 2's "want to go home".
- **NOT an open world of checklists**: 30 Patches, each with a reason to care, not 300 icons.
- **NOT multiplayer or live-service**: every hour of budget goes to the four pillars.

---

## Pillar Conflict Resolution

| Priority | Pillar | Rationale |
| ---- | ---- | ---- |
| 1 | Cat's-Eye Truth | It is the identity. One readable human sentence breaks the whole premise retroactively. |
| 2 | Two Lives, One Clock | It is the USP and the reason the ending works. Systems bend to route through home. |
| 3 | Conduct the Brawl | The 30-second loop. Nemesis presentation yields to combat pacing (Standoffs stay under 4 s). |
| 4 | Rivals Remember | Deep, but it expresses itself *through* fights, territory and Crew, so it adapts most easily. |

**Priority is not investment.** Combat and nemesis are the systems that make the game stand out in play and get the deepest design and largest production budget. The ranking only says who yields when two pillars truly collide.

**Resolution Process**
1. Identify which pillars are in tension.
2. Consult the ranking.
3. Serve the lower pillar partially if that does not compromise the higher.
4. Otherwise the higher pillar wins.
5. Record the decision in the relevant GDD.
6. If the conflict is fundamental, escalate to the creative-director.

Worked examples: *Nemesis wants a long taunt cutscene* → Pillar 3 wins: 2–4 s Standoff, skippable on repeat. *Combat wants big readable "WHAM!" text* → Pillar 1 does not forbid cat-world graphics, but to keep the screen language consistent we use glyph bursts. *Territory wants a remote management screen usable anywhere* → Pillar 2 wins: management happens at the Lot and the Doorstep.

---

## Player Motivation Alignment

| Need | Which Pillar Serves It | How |
| ---- | ---- | ---- |
| **Autonomy** | Rivals Remember; Two Lives, One Clock | Verdicts shape the town's population; every day the player chooses street or home |
| **Competence** | Conduct the Brawl | Readable mastery: faster Frazzles, cleaner Pile-Ons, beating a Nemesis who adapted to you |
| **Relatedness** | Two Lives, One Clock; Rivals Remember | Haru and her family; Crew cats with shared history; enemies you grow fond of |

**Gap check**: all three needs are covered by at least one pillar.

---

## Emotional Arc

### Session Emotional Arc (one in-game day, about 30 min)

| Phase | Duration | Target Emotion | Pillar(s) | Mechanics Delivering It |
| ---- | ---- | ---- | ---- | ---- |
| Opening | 0–3 min | Warmth, curiosity | 2, 1 | Morning vignette; Doorstep Tribute and Morning Sniff |
| Rising | 3–15 min | Mischief, swagger, flow | 3, 4 | Prowling, Ambushes, Patch fights, Spraying |
| Climax | 15–25 min | Tension, then triumph or a stinging loss | 3, 4 | A Rival Standoff, a Den fight, a Night raid; the Verdict |
| Resolution | 25–30 min | Comfort, tenderness | 2 | The walk home; evening or waiting-up vignette; lap; sleep |
| Hook | End | "What happened overnight? What is Haru packing?" | 4, 2 | Night Shuffle results and the next vignette are withheld until morning |

### Long-Term Emotional Progression

- **Lives 1–2 (kitten to Lane boss):** smallness, cheek, first wins. Home is big and safe.
- **Lives 3–4:** swagger on the streets; the first ache at home (Haru leaves; a stranger takes the lap).
- **Lives 5–7:** peak power and peak happiness, deliberately aligned. The player should feel they have everything.
- **Life 8:** the game slows. Power is revealed as beside the point; then repurposed as care.
- **Life 9:** acceptance, legacy, being called home.

---

## Reference Games

| Reference | What We Take From It | What We Do Differently | Which Pillar It Validates |
| ---- | ---- | ---- | ---- |
| Final Fantasy VII Remake | Real-time action with a slow-filling command resource, tactical slow-mo, stagger | Interchangeable recruits instead of fixed heroes; fights are 60 seconds, not 6 minutes | Conduct the Brawl |
| Pokémon (mainline) | A roster you catch, teach and swap | Small roster of individuals with memory; no dex | Conduct the Brawl, Rivals Remember |
| Middle-earth: Shadow of Mordor | Persistent enemies with hierarchy, memory, traits | No death: humiliation, exile, recruitment and respect; the hierarchy is a wall of cats | Rivals Remember |
| Shin chan: Shiro and the Coal Town | Cel-shaded characters on painted nostalgic backdrops; bubbly UI (style only) | Entirely original characters, town and shape language | Cat's-Eye Truth (look) |
| Stray | Cat-scale traversal and perspective | Top-down action RPG; the cat has a home | Cat's-Eye Truth |
| Yakuza / Like a Dragon series | Turf-war melodrama played straight and funny at once | The gangsters weigh four kilograms | Rivals Remember |

**Non-game inspirations**: the opening montage of *Up* (a life told without words); *Hachikō* (the animal who waits); *The Cat Returns* and *Whisper of the Heart* (cats with a society just out of human sight); Peanuts animated specials (adults as wordless sound); the observed fact that neighbourhood cats in Japan have recognised local "boss cats".

---

## Pillar Validation Checklist

- [x] **Count**: 4 pillars
- [x] **Falsifiable**: each makes a claim that could be wrong
- [x] **Constraining**: each rules out plausible ideas (subtitles; sleep-anywhere; deep stat systems; hand-written NPC cats)
- [x] **Cross-departmental**: each has a five-department table
- [x] **Design-tested**: each has a concrete design test
- [x] **Anti-pillars defined**: 7
- [x] **Priority-ranked**
- [x] **MDA-aligned**: pillars deliver Sensation, Fantasy, Narrative, Challenge
- [x] **SDT coverage**: all three needs
- [x] **Memorable**: Cat's-Eye Truth · Two Lives, One Clock · Conduct the Brawl · Rivals Remember
- [x] **Core fantasy served**
- [ ] **User sign-off**: not yet given

---

## Next Steps

- [ ] User approves or amends the pillars and their priority order
- [ ] Distribute to all specialists together with `design/creative-brief.md`
- [ ] Re-test each pillar against the first combat prototype
- [ ] First pillar review after the vertical slice

---

*This document is the creative north star. It lives in `design/gdd/game-pillars.md` and is referenced by every design, art, audio, and narrative document in the project.*

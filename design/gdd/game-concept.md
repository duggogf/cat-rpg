# Game Concept: Cat RPG (working title)

*Created: 2026-11-23*
*Status: Draft (creative-director pass; awaiting user review)*

Recommended release title: **"Nine Lives of a Boss Cat"** (open). Shared canon, terms and numbers: `design/creative-brief.md`. Pillars in full: `design/gdd/game-pillars.md`.

---

## Elevator Pitch

> It's a cel-shaded bird's-eye action RPG where you are a pet cat who sprays, brawls and recruits your way to boss of a nostalgic Japanese seaside town, leading a four-cat posse against rivals who remember every scratch, while at home the human who feeds you lives a whole life you witness day by day and never understand in words.
>
> Short form: **FF7 Remake combat + Pokémon recruits + Shadow of Mordor grudges, starring a house cat, wrapped around the first ten minutes of *Up*.**

---

## Core Identity

| Aspect | Detail |
| ---- | ---- |
| **Genre** | Action RPG (real-time party combat) with territory management and a procedural nemesis system |
| **Platform** | PC (Steam) lead; Switch-class handheld console second (recommended; open) |
| **Target Audience** | Action-RPG players who also buy emotional indies; cat people. See Player Profile |
| **Player Count** | Single-player |
| **Session Length** | 30 min (one in-game day); comfortable for 60–90 min |
| **Monetization** | Premium, one-time purchase. No microtransactions |
| **Estimated Scope** | Large (well over 9 months; cannot be dated until team size is known) |
| **Comparable Titles** | Final Fantasy VII Remake (combat), Middle-earth: Shadow of Mordor (nemesis), Stray (cat perspective), Shin chan: Shiro and the Coal Town (art style only). Sales figures: not researched |

---

## Core Fantasy

**Boss outside, pet at home.**

On the street you are Mikan, the collar-wearing upstart who took Hidamari Lane off a cat three times your size and now has fish delivered to your doorstep every morning. Rivals have scars with your name on them. Then, from a veranda, a human sings three notes, and the most feared cat in Yunagi sprints home with tail up to be picked up like a baby.

No other game lets you hold both: the petty, glorious status war of neighbourhood cats, and the wordless devotion of a pet watching its person grow up, fall in love, become a parent, and one day not come home.

---

## Unique Hook

**Dual Story Progression.** It's like an action RPG about conquering a town district by district, AND ALSO every day you conquer is a day in your owner's life, told without a single understandable word, because you are a cat.

- **One sentence:** your turf war and your human's life run on the same clock.
- **Novel:** the protagonist is a witness to the main emotional story, not its agent, and lacks the language to follow it. Players read it from shoes in the entryway, a suitcase, a white dress on a door, a melody.
- **Tied to the fantasy:** the pull between street and home is a daily mechanical choice (home by Dusk for Bond and the Well-Fed buff, or out all Night for Clout and rare Rivals).
- **Affects gameplay:** the owner's life stages gate the world (the cat flap unlocks Night; each Life maps to a district), and in Life 8 the story inverts the economy: the Tribute you extorted all game becomes food you carry home to a grieving family.

Supporting hooks: a **nemesis system where nobody dies** (humiliation, exile, recruitment, respect), and **combat you conduct**, four cats, one dust cloud.

---

## Player Experience Analysis (MDA Framework)

### Target Aesthetics (What the player FEELS)

| Aesthetic | Priority | How We Deliver It |
| ---- | ---- | ---- |
| **Sensation** | 1 | Maximalist cel-shaded combat feel; painted nostalgic town; a score that carries the story |
| **Fantasy** | 2 | Living as a cat: scent, rooftops, naps, status; boss and pet at once |
| **Narrative** | 3 | Authored wordless owner story in nine Lives; emergent Rival histories |
| **Challenge** | 4 | Real-time Posse command; Bosses and Nemeses that adapt |
| **Fellowship** | N/A | Single-player |
| **Discovery** | 6 | Scent trails, High Road routes, hidden Strays, decoding the human story |
| **Expression** | 5 | Posse builds, Move teaching, Verdicts that decide who lives in your town |
| **Submission** | 7 | Sunspot naps, walking home at dusk, lap time |

### Key Dynamics (Emergent player behaviours)

- Players build a favourite Posse and get attached to individual cats, including former Nemeses.
- Players tell stories about "their" Rival: the one who keeps coming back, the one who betrayed them.
- Players choose Verdicts strategically (Humble for income, Chase Off for peace now and trouble later, Recruit for a Move they want to copy).
- Players use the environment to hit Fears (kick the bucket, lure to the sprinkler).
- Players argue with themselves at Dusk: one more Patch, or go home?
- Players piece together Haru's life from details and compare readings with each other.

### Core Mechanics (Systems we build)

1. **Posse combat**: real-time action for Mikan + 3 swappable Crew; Pounce Gauge (Paws) spent on Moves through Slow Blink tactical slow-motion; Frazzle (stagger) into Pile-On finishers; Zoomies limit breaks.
2. **Cat nemesis system**: 48 persistent Rivals across six Clowders with rank, Memory, Grudge, Scars, Titles, Fears and Strengths; four Verdicts; overnight simulation; betrayal.
3. **Territory and Tribute**: 30 Patches marked by Spraying; Scent that decays; Sentries and Wardens from your Crew; raids; daily food Tribute delivered to your Doorstep.
4. **Crew and Lessons**: recruit defeated cats; five Styles; teach Moves and Knacks between cats; Loyalty.
5. **Day clock and the nine Lives**: every day starts and ends at Haru's House; home vignettes; Life transitions tied to claiming districts.

---

## Player Motivation Profile

### Primary Psychological Needs Served

| Need | How This Game Satisfies It | Strength |
| ---- | ---- | ---- |
| **Autonomy** | Which Patch, which Posse, which Verdict, street or home tonight | Core |
| **Competence** | Visible combat mastery; a town map turning your colour; Rivals who acknowledge you | Core |
| **Relatedness** | Haru and the household; Crew with shared history; beloved enemies | Core |

### Player Type Appeal (Bartle Taxonomy)

- [x] **Achievers** — How: six districts to claim, 30 Patches, Clout ranks, the Fence Line to climb, Moves to master.
- [x] **Explorers** — How: Whisker Sense trails, High Road routes, discovering Rival Fears, reading the wordless story.
- [x] **Socializers** — How (single-player form): relationships with Crew, Rivals and the household; a highly shareable story and nemesis anecdotes.
- [x] **Killers/Competitors** — How: dominance fantasy over named, reactive opponents who resent it. Secondary.

### Flow State Design

- **Onboarding curve**: Life 1 is a kitten in a garden. Minute 1: walk, jump on the wall. Minute 3: bat at a crow (basic attack, dodge). Minute 6: first Paw fills, Slow Blink teaches itself by slowing time. Minute 10: first Spray. First Rival, first loss or win and first Verdict within 20 minutes. Posse grows one cat at a time across Lives 1–2.
- **Difficulty scaling**: district level bands (1–8 up to 40–48); enemy groups grow from 1–2 to 6; Rivals adapt to repeated tactics; three difficulty modes (Kitten, Alley, Feral).
- **Feedback clarity**: Frazzle gauges, Clowder-coloured outlines, the town changing colour in Whisker Sense, the Doorstep pile growing, Rivals' taunts changing from "Collar!" to wary respect.
- **Recovery from failure**: a wipe ends the day at home with a small loss of carried Morsels; the victor is promoted and becomes a personal story. Failure generates content rather than a reload.

---

## Core Loop

### Moment-to-Moment (30 seconds)
Prowl a lane. Flick on Whisker Sense, see a rival mark glowing on a lamp post. Hop to the wall, drop on the holder: Ambush. Light combo, dodge a swipe, a Paw fills; Slow Blink, pick a Move; the enemy Frazzles; Pile-On. Dust cloud, stars, the loser bolts. Spray the post.

### Short-Term (5–15 minutes)
Take or defend one Patch. Clear its Toughs, meet its Rival in a Standoff, win or lose, give a Verdict, Spray, decide whether a Crew cat stays as Sentry. Between Patches: scavenge, beg at the fishmonger, nap in a Sunspot, follow a trail to a Stray worth recruiting.

### Session-Level (30–120 minutes)
One in-game day is about 30 minutes: wake at home, morning vignette, collect Tribute and read the Morning Sniff at the Doorstep, set Posse and Lessons at the Lot, spend Day, Dusk and Night in town, choose when to go home, evening vignette, sleep. The Night Shuffle then moves the world, so every morning has news. Natural stop: bedtime. Reason to return: what happened overnight, and what Haru is doing tomorrow.

### Long-Term Progression
Nine Lives. Lives 2–7 each claim one district while Haru moves through school, leaving, love, marriage, parenthood. Mikan grows from kitten to greying Great Boss (Lv 1–50); the Crew grows to 24 known individuals; Nemeses accumulate history. Life 8 takes it apart. Life 9 hands it on.

### Retention Hooks
- **Curiosity**: What does the suitcase mean? Who is the cat at the top of the Fence Line? What came back from exile last night?
- **Investment**: a Crew taught Move by Move; Rivals with years of history; a house the player knows room by room.
- **Social**: none in-game; outside it, shareable Rival stories and the wordless narrative.
- **Mastery**: tighter Posse play, Feral difficulty, clean Boss wins, exploiting Fears.

---

## Game Pillars

Full definitions, department tables and conflict rules are in `design/gdd/game-pillars.md`.

### Pillar 1: Cat's-Eye Truth
Everything is perceived, valued and done as a cat would; the player never receives intelligible human language.

*Design test*: Between a subtitle that explains a beat and staging that most players will read, we choose staging.

### Pillar 2: Two Lives, One Clock
Every day advances both Mikan's turf and Haru's life; home is unavoidable and wanted.

*Design test*: Between sleep-anywhere convenience and routing each day through Haru's House, we route through home and make it short and rewarding.

### Pillar 3: Conduct the Brawl
Short, loud, readable cartoon fights where you direct four cats; feel beats simulation.

*Design test*: Between another status effect and more polish on existing Moves, we polish.

### Pillar 4: Rivals Remember
Every named cat carries visible history with you; nobody dies, so everything returns.

*Design test*: Between 20 scripted NPC cats and 48 procedural Rivals whose stories come from play, we build the 48.

### Anti-Pillars (What This Game Is NOT)

- **NOT a cat-life sim**: no needs meters; chores would smother the turf war.
- **NOT a collect-them-all game**: 24 Crew, each an individual; no dex.
- **NOT a dialogue-driven story**: no human text, no lore codex.
- **NOT dark**: no blood, no street deaths; grief lives only in the home story.
- **NOT timed**: territory can decay, the game cannot be failed.
- **NOT multiplayer or live-service**.

---

## Inspiration and References

| Reference | What We Take From It | What We Do Differently | Why It Matters |
| ---- | ---- | ---- | ---- |
| Final Fantasy VII Remake | Action combat with a slow command gauge, tactical slow-mo, stagger | Swappable recruits; one-minute fights; cartoon tone | Shows real-time-plus-commands party combat works |
| Pokémon | Recruit, teach, swap | Few cats, each with memory and loyalty | The attachment loop |
| Middle-earth: Shadow of Mordor | Enemy hierarchy, memory, traits, revenge | Non-lethal: Verdicts; cats feud among themselves; your Crew is inside the system | Emergent personal stories |
| Shin chan: Shiro and the Coal Town | Cel-shaded figures on painted nostalgic backgrounds, bubbly UI | Style reference only; all characters, places and shapes original | Proves the look carries a small-town game |
| Stray | The appeal of cat-scale play | A cat with a home, a gang and an RPG | Audience interest in cat protagonists (sales: not researched) |

**Non-game inspirations**: the opening of *Up*; *Hachikō*; *The Cat Returns* and *Whisper of the Heart*; Peanuts specials' wordless adults; Japanese neighbourhood "boss cats"; Showa-era shopping streets and fishing towns.

---

## Target Player Profile

| Attribute | Detail |
| ---- | ---- |
| **Age range** | 16–40 |
| **Gaming experience** | Mid-core |
| **Time availability** | 30–60 min on weeknights; longer weekend sessions |
| **Platform preference** | PC with a controller; handheld |
| **Current games they play** | Modern action RPGs (FF7 Remake/Rebirth), creature RPGs, narrative indies |
| **What they're looking for** | Combat with real feel in a world that is warm instead of grim, and a story that earns its tears |
| **What would turn them away** | Chore-like sim upkeep; mushy, unreadable combat; twee tone with no bite; a sad ending that feels cheap or manipulative |

---

## Technical Considerations

| Consideration | Assessment |
| ---- | ---- |
| **Recommended Engine** | **Unity (URP)**, recommendation only; decision is the user's. Mature toon-shading, VFX, authored-camera and timeline tooling and an established console path for a small team. Godot 4 is the alternative if openness and licence cost matter more than port convenience |
| **Key Technical Challenges** | Toon shader and outlines readable at bird's-eye distance; 10-combatant fights with heavy VFX at handheld frame rates; deterministic, testable overnight nemesis simulation; procedural cat appearance from few meshes; in-engine wordless vignette tooling; companion AI |
| **Art Style** | 3D stylised: cel-shaded, flat colour, clean outlines, hand-painted textures and painted backdrops |
| **Art Pipeline Complexity** | High (custom 3D, custom shader, per-Life redressing of the house, ageing variants of four humans and Mikan) |
| **Audio Needs** | Music-heavy and adaptive; the Call motif system; Murmur voice design; large cat vocal library |
| **Networking** | None |
| **Content Volume** | 6 districts / 30 Patches; 9 Lives; about 60 Moves, 20 Knacks; 48 Rival slots; 6 authored Bosses; 100+ home vignettes; 22–28 h main story |
| **Procedural Systems** | Rival generation (name, coat, personality, traits), bark assembly from templates, overnight simulation. The town itself is hand-built |

---

## Risks and Open Questions

### Design Risks
- The wordless story may be misread or missed by some players.
- Nemesis personality without voice acting may feel thin.
- Passive Tribute could make fighting optional or the economy trivial.
- Slapstick streets and a bereavement story may clash if the separation rule is broken.
- Mandatory home visits could feel like friction if vignettes are slow or repetitive.

### Technical Risks
- Combat readability: many small, similar silhouettes from above under heavy VFX.
- Overnight simulation producing unfair or incomprehensible outcomes.
- Handheld performance with outlines, VFX and 10 animated cats.

### Market Risks
- Genre mix is hard to explain in one image (not researched).
- Visual style may be read as a children's game, mismatching the combat depth and the ending (not researched).
- Proximity of the look to a known licensed game could invite unfavourable comparison; our shape language must be distinct (not researched).

### Scope Risks
- Four headline systems, each large; content breadth of six districts and nine Lives.
- Team size, budget and timeline are unknown, so no tier below can be dated.

### Open Questions
- Is conducting four cats fun for 20 minutes? → combat prototype.
- Do players care about a Rival and about Haru within two hours? → vertical slice playtest, no briefing.
- Can playtesters retell Life 1–2's human story unprompted? → same playtest.
- Engine, title, Haru's presentation, Mikan customisation, cat speech as text, ending shape: listed for the user in `design/creative-brief.md` §11.

---

## MVP Definition

**Core hypothesis**: Players find commanding a four-cat Posse in real time (basic attacks, Paws, Slow Blink, Frazzle, Pile-On, switching) satisfying for 20+ minutes with no progression attached.

**Required for MVP**:
1. One grey-box arena with a few knock-over props.
2. Mikan + 3 Crew of different Styles, switchable; companion AI.
3. Pounce Gauge, Slow Blink, 8 Moves, Frazzle/Ruffled, Pile-On, one Zoomies.
4. Three enemy group compositions and one Captain-grade Rival with a Fear.
5. First-pass feel: hit-stop, shake, dust cloud, placeholder impact audio.

**Explicitly NOT in MVP**:
- Territory, Tribute, the day clock, home, nemesis memory, recruiting, Lessons, final art.

### Scope Tiers (if budget/time shrinks)

Timelines are not estimated: team size and budget are unknown (open question).

| Tier | Content | Features | Timeline |
| ---- | ---- | ---- | ---- |
| **MVP** | 1 arena | Combat core only | Not estimated |
| **Vertical Slice** | Lives 1–2: Haru's House, the Lot, Hidamari Lane (5 Patches), 8 Rivals, Daifuku, 6 recruits, 16 Moves, about 10 vignettes | All five systems at small scale, final quality | Not estimated |
| **Alpha** | All 6 districts and 9 Lives, placeholder art | All features, rough | Not estimated |
| **Full Vision** | Everything in the creative brief | All features, polished | Not estimated |

Pre-agreed fallback: 4 districts instead of 6, 40 Moves, fewer Critters. Never cut: the dual story, Rival memory and Verdicts, the Pile-On.

---

## Next Steps

- [ ] User reviews concept, pillars and creative brief; answers the open questions
- [ ] Choose the engine and fill in the technology stack (`/setup-engine`)
- [ ] **Prototype the combat core** (`/prototype`) before locking system GDDs' numbers
- [ ] Specialists write system GDDs from `design/creative-brief.md`
- [ ] Cross-GDD consistency review (`/review-all-gdds`)
- [ ] Art bible (`/art-bible`) with an original shape language
- [ ] Vertical slice: Lives 1–2 (`/vertical-slice`), playtested without briefing

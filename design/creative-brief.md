# Creative Brief — Shared Canon: "Cat RPG"

*Created: 2026-11-23 · Owner: creative-director · Status: **v1.4** (records the user's 2026-11-24 decisions on engine, title and art style; folds in `design/reviews/round-1/director-rulings.md` and the round-2 cross-doc rulings R1–R5 in `design/reviews/round-2/`; decisions marked OPEN await the user)*

**Read this in full before writing or revising a GDD.** Anything named or numbered here is canon: use the exact terms; do not rename or redefine them. If your system needs something this brief does not cover, decide it inside your own boundary (§6) and list it under "Assumptions for creative-director review". Companion docs: `design/gdd/game-pillars.md`, `design/gdd/game-concept.md`. Where this brief and the pillars disagree, this brief wins (see changelog).

**Current target: a GDD set good enough to start prototyping the vertical slice (§10).** Each doc specifies what the slice needs and ends with a `## Backlog (post-slice)` section listing everything else, one line each. The full game appears only as framing.

---

## 1. The game in one breath

A 3D third-person action RPG. You are **Mikan**, a house cat in the seaside town of **Yunagi**. By day and by night you spray, brawl, recruit and tax your way from one garden wall to **Great Boss** of the whole town. You lead a four-cat **Posse** in stylised real-time fights against **Rivals** who remember everything you did to them, and you post cats with real personalities to guard the turf that feeds you. Every morning and evening you go home, where your human, **Haru**, is living a whole life that you witness but cannot understand in words: school, leaving, love, a wedding, a baby, and then a door that stops opening.

**Core fantasy:** *Boss outside, pet at home.* A ruthless little alley tyrant who still comes running when one particular human calls.

**Title:** **"Cat RPG"** — final, settled by the user on 2026-11-24 (simple and straightforward; no alternative release title).

---

## 2. Pillars (full text in game-pillars.md)

| # | Pillar | One-line test |
|---|---|---|
| 1 | **Cat's-Eye Truth** | If a cat could not perceive, want or do it, it is not in the game. No intelligible human language, ever. |
| 2 | **Two Lives, One Clock** | Every in-game day advances both Mikan's turf and Haru's life; home is mechanically and emotionally unavoidable. |
| 3 | **Conduct the Brawl** | Fights are short, loud, readable cartoon brawls where you command four cats; feel beats simulation. |
| 4 | **Rivals Remember** | Every named cat carries visible history with you; no fight with a Rival is ever anonymous or consequence-free. |

Conflict priority follows the table order. Priority is not investment: **combat, nemesis and the dual story make the game stand out; territory and economy carry half the play time and get equal design weight.**

Anti-pillars:
- Not a cat-life simulator: no hunger, thirst or litter meters.
- Not a collect-them-all game: the Crew are few and known.
- Not dialogue-driven.
- Not grimdark: nobody dies on the streets.
- No time-pressure fail states.
- Not a checklist: at most 3 once-a-day actions in the whole game.
- No multiplayer or live-service.
- **Not an FF7 Remake–depth combat game**: the structure is borrowed; the detail is kept light.

---

## 3. Glossary of canonical terms

### 3.1 People and cats

| Term | Canon |
|---|---|
| **Mikan** | Protagonist (renameable). Ginger-and-white Japanese bobtail: white body, ginger cap over both ears, a ginger patch over the left eye, pom-pom stub tail, amber eyes, **red collar with one small brass bell**. Referred to by name or "they". Ages from kitten (Life 1) to elder (Life 9). |
| **The Call** | Haru's name for Mikan is a **three-note sung motif** (rise a third, fall a fifth). It is Mikan's name, Haru's leitmotif and the main theme. In brass it is Mikan's street theme, **the Brass Call**. |
| **Haru** | The owner. Dev-facing name only; never shown as readable text. 16 in Life 1, 31 at the accident. Short dark bob, yellow raincoat; **yellow** is her colour; her instrument is the **upright piano** (a real prop in the Main Room). She is **always late**. |
| **Sora** | Haru's partner, later spouse. Teal; cello. First appears as a second pair of shoes. He whistles and hums the Call, never sings it. |
| **Koharu** | Haru and Sora's child, born in Life 6. Coral; toy piano. In Life 9 Koharu sings the Call. |
| **Gran** | Haru's grandmother; plum; reed organ. Lives 1–4. Taps the Call on the bowl (three taps). |
| **Rival** | Any named, persistent, non-Crew cat tracked by the nemesis system. |
| **Nemesis** | A Rival holding one of the scarce **Nemesis slots** (one per district + the arc lead), chosen among cats with Grudge ≥ 75. Others with high Grudge are **Bitter**. **One declared arc lead at a time** (v1.3): a Humbled lead stays the lead; if the lead resolves with < 3 encounters, a new lead is named the same night. Slice target: Nemeses max 2, median 1 for chase/humble players; a mixed player may end with 0. |
| **Stray** | An unaffiliated cat; not tracked until promoted. Strays have no signature perk. |
| **Critter** | A non-cat opponent (crows, rats, a weasel, a chained dog set-piece). Never Rival or Crew. The slice has crows only. |
| **Clowder** | A cat gang, one per district. The player's own is the **Bell Clowder**. |
| **Tough → Captain → Boss → Great Boss** | Rival ranks. Each district has 1 Boss, 2 Captains and 5 Toughs (ordered 1–5 on the wall). **Botan** is Great Boss. |
| **Keeper** | The Rival holding a Patch (`keeper_id`). |
| **Crew / Posse** | Crew = every recruited cat. Posse = Mikan + 3 Crew in combat. Swappable at the Lot, or away from it by **Tail-Up** (Lounging cats only). |
| **Sentry / Warden** | A Crew cat posted to guard a Patch. The **Warden** is the Den's first Sentry slot (True+ Loyalty). |
| **Personality** | Each cat's one of six fixed personalities, shared by Crew and Rivals (§3.5). **The reason to want this cat over that one.** |
| **"Collar"** | The street insult for a pet cat. |
| **The old wall cat** | Life 1's first story recruit ("Use your whiskers, Collar."): **Hige**. Narrative names them; Crew owns their stats. |
| **The slice six** (v1.3; Crew §3.3, one per personality) | **Hige** (Stalwart Bruiser; the old wall cat, ≈ 0:08–0:10) · **Pon** (Goofball Yowler; story recruit 2, Life 1 day 2) · **Kinako** (Fraidy Scrapper; the Friend Stray, Life 2 day 1's required first objective; recruited by Interact within 4 m, Mikan's slow-blink gesture) · **Togemaru**, *the First Thorn* (Braggart Scrapper; Fear Cucumbers; Keeper of Laundry Pole Yard; flees on day 1, contested at the gatepost on day 2) · **Kagi** (Schemer Yowler; Captain of Tofu Shop Step) · **Daifuku** (Brooder Bruiser; the Boss). The Low Wall Corner Keeper is an untracked Stray: Routing it gives no Verdict. |

### 3.2 World

| Term | Canon |
|---|---|
| **Yunagi** | A Showa-nostalgic Japanese seaside hill town; year and country never stated. **Three districts and the Lighthouse Summit** (§4). |
| **Patch** | The unit of territory (**20** in total). Each has one **Scent Post**: tall, landmark-shaped, visible from distance. One Patch per district is the **Den**. |
| **Haru's House** | Old wooden house with veranda, garden and a low wall, in Hidamari Lane. Safe zone: no combat inside the wall; the clock pauses inside the wall, garden included. |
| **The Doorstep** | Where Tribute appears and the **Morning Sniff** is read. The only licensed HUD space inside the wall. |
| **The Stash** | Mikan's Morsel bank under the veranda. Bribes are paid from it. |
| **The Lot** | Vacant lot behind the house. Crew HQ: Posse, **Turf Board**, Lessons, Share a Morsel. Crew never enter the house. |
| **Sunspot** | A nap point: checkpoint, full Posse heal, half a phase passes. |
| **High Road** | Walls, fences, roofs and awnings: the upper traversal layer, played as third-person platforming. |
| **The Fence Line** | The nemesis hierarchy screen: one continuous wall, height = rank, one disposition pose per cat, no rank labels. Read-only on the street, at the Doorstep and at the Lot; never shown in the house. |
| **Turf Board** | The Lot's territory screen: drag a portrait onto a Patch. The only map-like view, and the only place territory numbers appear (R3, §5.7). |
| **Phase dial** | The always-visible day indicator while roaming (sun over a roofline; no digits). |

### 3.3 Verbs and systems

| Term | Canon |
|---|---|
| **Spray** | Marking a Scent Post: tail-quiver pose, sparkle scent cloud, pop. Never liquid. Your own Spray is offered only when a post is below Strong. |
| **Scent** | Per-Patch control, 0–100, shown in the world as 1–4 wisps in the Clowder's colour. Strong = 60+. |
| **Whisker Sense** | Hold mode. The world desaturates; scent trails glow; a **scent compass ring** around Mikan points to rival marks, Rivals and hidden finds. Not usable in combat. |
| **Head Home** | A bell-gold High Road scent thread to Haru's wall. It appears at the Dusk Call or on request, and is ≤ 60 s long in the slice. |
| **Standoff** | The pre-fight beat (2–4 s name-card and one taunt). A memory-citing line cannot be skipped for 1 s. |
| **Ambush** | Opening a fight unseen or from the High Road; the target starts Ruffled. A Rival Ambush gives a 2.0 s directional yowl-sting; Skitter or Brace in its last 0.75 s gives a neutral start. |
| **Attack / string** | The Attack button runs a 3-hit string; the 3rd hit is the Style finisher. Airborne or from the High Road it becomes a **Pounce**. |
| **Hop · Skitter · Brace** | Jump (High Road), dodge, guard (hold). |
| **Hiss** | 8 s cooldown. Interrupts a yellow telegraph and Ruffles the attacker; a Tough at ≤ 15% Nerve **Backs Down** (Routed by intimidation). |
| **Pounce Gauge / Paws** | The command resource. 2 Paws per cat (Mikan 3 from Life 4). Fills over time and from hits. |
| **Slow Blink** | Tactical mode: time at 5%; choose Moves and targets for any Posse cat; commands chain. |
| **Move** | An active skill costing 1–2 Paws, either a **Set-up** or a **Pay-off**. 4 slots per cat. |
| **Knack** | Passive skill. **Backlog** (not in the slice). |
| **Tag-In / Relay** | Switching control right after a string finisher, Pounce or Hiss interrupt: the incoming cat leaps in with a free Style strike. Chaining Tag-Ins within 3 s is a Relay (each cat once). The heart of conducting. |
| **Zoomies** | The limit-break, one per Style. Charges from damage taken and from Frazzling enemies; persists within a day. |
| **Ruffled** | For 4 s, Frazzle builds ×2. A leader cannot be re-Ruffled for 6 s after it ends. |
| **Frazzle / Frazzled** | The stagger gauge. When full: 6 s helpless, damage taken ×1.5. |
| **Statuses** | Only three: **Soggy** (slower), **Cowed** (deals less), **Fired Up** (deals more). |
| **Pile-On** | Posse finisher on a Frazzled enemy: four cats vanish into a cartoon dust cloud. Needs ≥ 2 standing Posse cats. Always Routs below Captain. On trash it is offered only with 2+ enemies Frazzled within 3 m, or on the last enemy standing. The signature street image. |
| **Old Score** | A Crew cat fighting a Rival it has Routed, or been Routed by, deals extra Frazzle, and both bark. |
| **Nerve / Routed** | HP. At 0 the cat bolts in a dust puff. Nobody is killed, ever. |
| **Verdict** | After Routing a Rival (one full Verdict per fight; other tracked cats slip away): **Chase Off**, **Humble**, **Recruit**, **Nose-Touch** (§7). |
| **Grudge / Regard / Memory** | Grudge 0–100 and Regard 0–100 are never shown as numbers. Memory is a Rival's log of you (10 entries, ≤ 6 pinned). |
| **Fear / Strength / Scar / Title** | Rival traits. Slice Fears: Water, Loud Noise, Cucumbers. Every player-sourced Scar is a **silhouette Scar** until the cat has two. |
| **Lick In** | A Rival that Routs Mikan in a fight the Posse still wins earns a Glory Title (no promotion). |
| **Gloat** | The victor's ≤ 3 s beat after a Posse wipe. |
| **Wall event** | The director's overnight hierarchy change, one per district every 2–3 nights, always visible on the wall. |
| **Morsels / Shinies** | Soft currency (food) / rare currency (≈ 50 in the full game). |
| **Tribute** | Daily Morsels from held Patches, placed on the Doorstep. |
| **Bribe** | The recruit payment: none / fair / feast, from the Stash. |
| **Share a Morsel** | Feeding the whole Crew at the Lot, once per day; costs the sum of Crew levels; +2 Loyalty to all. |
| **Clout** | Reputation, 7 ranks: House Pet → Lane Cat → Known Face → Boss → Two-Street Boss → Big Whisker → Great Boss. Milestones only. |
| **Bond** | Closeness with the household, 0–10 hearts. |
| **Loyalty** | 0–100 per Crew cat. Tiers in §8. |
| **Lesson** | Teaching a Move at the Lot. Slice routes: Instinct and Lessons. |
| **Night Shuffle** | The overnight simulation (§5.3). |
| **Caterwaul** | A distress yowl when a held Patch is raided while you are out; optional live defence. Current district only. |
| **Life** | A story chapter; there are nine. Not a retry counter. |
| **Keystone / Texture / Closing / Plateau** | A required home beat / an optional home vignette / the last Keystone of a Life / the "season" the house lives in after a Life's Keystones run out. |
| **Murmur / Scribble** | Wordless human speech / illegible human writing. |
| **Offering · Carry · Fresh Catch** | Life 8 only (§5.5). |

### 3.4 Styles and damage types

| Style | Role | Basic type | Resists ×0.8 | Weak to ×1.2 |
|---|---|---|---|---|
| **Bruiser** | Tank; Frazzle builder | Thump | Thump | Fang |
| **Scrapper** | Fast melee (Mikan's base) | Claw | Claw | Thump |
| **Prowler** | Burst; Ambush | Fang | Fang | Yowl |
| **Yowler** | Support and debuff by voice | Yowl | Yowl | Claw |
| **Trickster** | Ranged; props | mixed | — | — |

*A Style resists its own damage type.* Mikan may slot at most 2 cross-Style Moves. Five stats: **Nerve, Bite, Hide, Voice, Zip**. Style sets stats; personality does not.

### 3.5 Personality (one model for Crew and Rivals)

Assigned at generation by Nemesis; never changes. Each owning doc sets the numbers for its own column; the shape is canon.

| Personality | Fights like (AI) | Combat perk | On guard | Loyalty: likes / dislikes | Bonds / clashes | As a Rival |
|---|---|---|---|---|---|---|
| **Braggart** | Charges the biggest enemy | First hit on a leader adds Frazzle | Raid defence +; Patch +10% Tribute | Posse time / being benched | Goofball / Braggart | Loud; returns fast for revenge |
| **Brooder** | Hangs back, avenges allies | Old Score doubled | Never leaves; slower decay | Long service (half-speed both ways) / being dismissed | Stalwart / Schemer | Grudge decays at half rate |
| **Schemer** | Flanks; hunts Ruffled/Frazzled | Bonus on Frazzled | The district forecast names the motive | Lessons / soft choices | Fraidy / Brooder | Ambushes; as Crew, Wavers below 35 |
| **Fraidy** | Keeps distance, supports | Perfect Skitter gives Pounce | Weak defence; raises the Caterwaul early | Never being Routed / being Routed | Stalwart / Braggart | Flees early; returns slowly |
| **Stalwart** | Guards the controlled cat, Braces | Allies within 3 m take less damage | Best raid defence | Fair play / Mikan Humbling cats | Brooder / Schemer | Honourable; accepts Nose-Touch readily |
| **Goofball** | Plays; goes for props | Props it triggers hit harder | Humbled residents never simmer | Share a Morsel counts double / being left at the Lot | everyone but Brooder / Brooder | Clowns about; easy to Recruit |

**Social pairs.** A bonded pair in the Posse gets a stronger Tag-In; bonded cats posted in the same district gain +1 Loyalty per night. A clashing pair loses 1 Loyalty each per day when together.

**Shown, not listed.** Each personality has its own idle, walk, posture, bark intents and Pile-On flourish. A recruited Rival also keeps its Memory, Scars and Title, and its Nemesis **Strength becomes an always-on signature perk** (its Fear stays).

---

## 4. Yunagi: districts and Bosses (full-game framing)

| # | District | Character | Patches | Lv | Clowder (colour) | Boss | Lives |
|---|---|---|---|---|---|---|---|
| 1 | **Hidamari Lane** | Sunny lanes, garden walls, laundry poles, Haru's House | Den + 4 outer = 5 | 1–8 | Wall Sitters (light sage `#A8C878`) | **Daifuku**: enormous white-and-grey tom who never leaves his wall. Bruiser. | L1 · L2 |
| 2 | **Akane Arcade** | Covered shopping street (fishmonger, croquette stall, awnings); at its top end, shrine steps, torii and stone lanterns that come alive at night | Den + 6 outer = 7 | 8–18 | Awning Gang (vermilion) | **Madam Sabi**: rust tortoiseshell matriarch. Yowler. **Oboro** (silent black Prowler) is her authored night Captain. | L3 · L4 |
| 3 | **Shiosai** | Fishing harbour below (nets, tetrapods, the net shed); hot-spring inns and stone stairs above | Den + 6 outer = 7 | 18–28 | Salt Paws (sea blue) | **Ikari**: one-eyed, salt-crusted brown tabby. Scrapper. | L5 · L6 |
| ★ | **The Lighthouse Summit** | Botan's seat above Shiosai; opens when Shiosai is claimed | 1 | 28–30 | Steam Court (white-violet) | **Botan**: Great Boss, a pampered long-haired white inn cat in a silk ribbon collar. A pet, like Mikan. Trickster. | L7 |

Bosses are authored personalities who use the nemesis trait and memory system; everything below Boss is procedural. **Claiming:** the Lane's Den opens when 3 of its 4 outer Patches are held; the Arcade's and Shiosai's when 4 of 6 are held. The district is claimed by Routing the Boss at the Den. Botan offers only Humble or Nose-Touch: at her Verdict the inn's hand-bell rings and she is called home.

### 4.1 Camera and space (canon for art, UX, combat, level; spec in `design/gdd/camera-system.md`)

**A third-person camera behind and above the cat, like FF7 Remake.**
- **Explore:** ≈ 3 m back and ≈ 1 m up, gently pitched down; right-stick orbit; auto-follow; wall collision. Low height makes the town huge.
- **Combat:** pulls back (≈ 6–8 m) and up to frame the controlled cat and its lock target; soft lock-on; edge arrows for off-screen Posse cats and attackers; fight ring ≈ 10 m; no scene transition.
- **Slow Blink:** a lifted tactical three-quarter view.
- **Cinematics:** Standoff, Pile-On and Zoomies use authored cuts and cut-ins.
- **Home:** the same camera, at cat height (0.3–0.6 m); vignettes use authored shots; humans are knees and hands unless they bend down (faces: R5, §5.7).
- **Cat scale (v1.3):** one global cat scale, **1.25× a real cat (≈ 0.56 m nose to rump)**, the same on the street and at home, no per-context swap; humans, furniture and props are true scale (Art §3.4).
- **Options:** FOV, camera speed, auto-centre, motion comfort.

**Look (v1.4, settled by the user):** match the reference's *visuals* 1:1 — **3D cel-shaded characters that read like 2D cartoon cels, in environments that read like 2D painted anime backgrounds** — but built in full 3D for a free-rotating third-person camera (the reference's 3C is not copied). **Environments:** 3D geometry with hand-painted, flat-lit textures and trim sheets, no outlines; **painted skydome and backdrop cards (sky, hills, sea are in frame)**. The method is proven by a one-alley look-dev test (Art bible §8). All visible human writing is Scribble.

**Readability:**
- Posse cats carry a bell-gold keyline plus an overhead **chevron** tick (the controlled cat carries the **bell**); enemies an outline in their Clowder colour. Both have a 1 px Paper Cream rim.
- Telegraphs: white = dodge; yellow = Hiss it (Paper Cream dashed with a triangle glyph); red = get out (Frazzle Magenta with a zigzag edge).
- One screen-wide effect at a time.

---

## 5. Loops, the day, and the nine Lives

### 5.1 Core loops

- **30 seconds:** prowl, flick on Whisker Sense, spot a rival mark, take the High Road, Ambush. String, dodge, a Paw fills, Slow Blink, a Move; Tag-In to the next cat; Frazzle; Pile-On; dust cloud; Spray.
- **5 minutes:** take or defend a Patch: clear it, Standoff, Verdict, Spray, decide who guards it (and which personality suits the post).
- **One day (≈ 20–25 min in the slice):** wake → morning slot → Doorstep (Tribute, Sniff with tonight's raid forecast) → the Lot (Posse, Turf Board, Lessons, Share a Morsel) → Morning, Day, Dusk, Night → home → evening → sleep → Night Shuffle.
- **Long term:** claim three districts and the Summit across nine Lives; grow a Crew of personalities; turn Rivals into Nemeses, Crew or friends; watch Haru's life; in the end, bring your food home.

### 5.2 The day clock (implementation detail owned by `design/gdd/day-loop.md`)

- **Four phases × 4 real minutes = 16 minutes of roaming clock.** The clock pauses in combat, Standoffs, Verdicts, menus, the Lot, and inside Haru's wall.
- Sunspot nap = half a phase. Sleeping at home ends the day.
- **No fail state for time.** At the end of Night (and at the end of Dusk before the cat flap), Mikan grows drowsy; after a 1-minute grace the Head Home thread walks Mikan home.
- **Phase flavour:**
  - Morning and Day: humans on the streets (hazards, begging).
  - Dusk: golden hour; the **Yunagi chime**, answered within one bar by the Call; the evening bowl.
  - **Night belongs to cats:** tougher Rivals, raids, the Arcade's shrine end wakes. Rendered in bright moon-blue.
- **Curfew trade:**
  - Home by Dusk: evening vignette, Bond, and **Well-Fed** (§8).
  - Out all Night: Night-only Rivals, Shinies, Clout — never Morsels.
  - Neither is punished.
- **Night access is earned:** the cat flap arrives on Life 2 day 2.
- **Losing ends the outing, not the day:** Mikan slinks home; if before Dusk the clock jumps to Dusk; the evening plays (Haru puts on a plaster); 20% of the day's field haul is lost (none in Life 1); the Stash is safe.
- **Daily-reset budget: at most 3** — Share a Morsel, the home "What changed today?" find, Tribute pick-up.
- **Day budget** (75th percentile; hard cap 30 min in the slice, 35 later): wake → door ≤ 0.25 min (≤ 1.5 with a Keystone) · Doorstep ≤ 0.5 · Lot ≤ 1 · clock 12–16 · encounters 5–7 (4–6 fights) · way home ≤ 1 · evening ≤ 2.
- **Design weight per day:** ≈ 50% roaming and territory · 35% combat · 15% home.
- Suspend-on-quit anywhere; autosave each phase.

### 5.3 The Night Shuffle (canon order)

Every draw comes from a counter-based seeded substream `(save_seed, day_index, step, subsystem, cat_id, ordinal)`. Daytime outcome rolls are seeded per encounter, so reloads reproduce them.

1. **Crew:** Loyalty deltas; Sentry XP.
2. **Territory:** Scent decay; flat upkeep; resolve the raids requested last night (forecast in today's Sniff); uprisings (an uprising uses the night's single raid slot, v1.3).
3. **Nemesis:** betrayals; comebacks; wall events; refills and promotions; Grudge decay and Nemesis slots; tomorrow's raid requests (≤ 1 per district).
4. **Economy:** Tribute to the Doorstep (none in Life 8).
5. **Narrative:** next morning slot; Life-end check.

The **Morning Sniff** shows the Tribute line, tonight's raid forecast (always, when one is coming) and ≤ 3 nemesis items. Items are admitted only for cats with history with the player, or that touch the player's Patches or Crew.

### 5.4 The nine Lives

**Home beats are gated by day count only. Conquest moves the years, not the days.**
- Every Keystone, including each Closing, has a day gate within its Life.
- A Life ends at the first sleep at home after **(a)** its turf goal is met, **(b)** `day_in_life ≥ life_min_days`, and **(c)** its Closing has played. Then a wordless time-skip montage.
- If Keystones run out first, the house lives in its **Plateau**.
- Closings never play in their Late (Forensic) form; they wait for the next morning.
- `life_min_days` = 2, 4, 3, 3, 3, 3, 4, (Life 8 ≈ 7–8), 2.
- Each wipe against the same Boss leaves it plastered with −10% max Nerve for the rematch (stacks to −30%).

| Life | Name | Haru | What Mikan sees at home | Turf goal | Mikan |
|---|---|---|---|---|---|
| 1 | **The Box in the Rain** | 16 | Found in a wet box on the shrine steps; yellow raincoat; the bell collar; Gran's disapproval melting; the first Call | Hold 1 Patch | Kitten |
| 2 | **Uniform** | 17–18 | School bag, late study lamp, exam nerves, the cat flap, the envelope | Claim Hidamari Lane | Young adult |
| 3 | **The Empty Room** | 18–22 | Suitcase; Haru's room goes still; Gran feeds you | Hold 4 Arcade outer Patches | Adult |
| 4 | **Two Pairs of Shoes** | 23–25 | Work clothes; Sora's shoes; the lap war; Gran slower | Claim Akane Arcade | Adult |
| 5 | **White Day** | 26 | Black shoes in the entryway (Gran's death is played); boxes; a white dress | Hold 4 Shiosai outer Patches | Prime |
| 6 | **The Small Loud One** | 28 | A belly, then Koharu; Mikan displaced, then on guard | Claim Shiosai | Prime |
| 7 | **The Long Summer** | 31 | The happiest house in town | Rout Botan at the Summit; become Great Boss | Greying |
| 8 | **The Door** | — | Haru does not come home. Mikan waits | Three Food Carries | Old |
| 9 | **Nine** | Koharu 8 | Koharu fills the bowl and sings the Call | Name an heir; one last walk | Elder |

### 5.5 Life 8 (framing; owner: narrative-director, `dual-story-progression.md` §9; other docs supply numbers and cite it)

- **Stage A** (2 ordinary days): A1 is Mikan's first day as Great Boss, and **its ordinary Dusk Call is the last** (unmarked). A2 brings the last Goodbye and a Dusk where the Call does not come.
- **The wait** (2 days, played live): street quiet; no Ambushes; Sleep only from Dusk; Knock disabled.
- **The Season Turn** is held outside on the Doorstep beside the Tribute pile; crows take it, frost comes, and Mikan becomes Old.
- **The Carries:** 3 on 3 different days, counted, never valued.
  - Carry 1: a fish from the Stash.
  - Carry 2: **Fresh Catch** from a held Patch in the Lane or the Arcade.
  - Carry 3: Fresh Catch from Shiosai's harbour.
  - While carrying, Mikan cannot attack; the other three fight with AI fill at 100%.
- **Territory:** no Doorstep deliveries all Life.
- **Combat:** never harder than Life 7. The Usurper is optional.
- **Tone:** the Sniff is indifferent, with gratitude first. Koharu's pathos beats are capped at four.
- **Music:** from the phone call until Carry 3, Haru's voice and her Melody are absent everywhere; her Home Scent note is the only trace.
- **The close:** Sora whistles two notes, Koharu sings the third.
- **The inversion is canon:** the food tax becomes an act of love. **No food enters the house before Life 8**; earlier Gifts are curios (a cicada shell, a beetle).

**Life 9** is short and gentle: the Crew fights (AI fill 70%), an heir is chosen, one walk through the town with one farewell gesture per district, and home when called. The accident is never shown or explained. One ending (OPEN: whether Mikan's passing is implied; default no).

### 5.6 The language rule (hard rule, all departments)

1. **No human utterance is ever intelligible.** No subtitles, readable signage, letters, screens or calendars, trailers and store screenshots included. Speech is Murmur; writing is Scribble.
2. Human story is told by staging, costume colour, objects, light, weather, music and Murmur tone.
3. Mikan's understanding shows as **Sense Icons** (fish, heart, rain cloud, ear, and the four **tone puffs**: Round = warm, Spiky = sharp, Drooping = low/unhappy, Bouncing = bright/excited).
4. **Cats understand cats** (user decision, settled): cat speech is readable text in bubbly balloons over meows (no voiced words); barks ≤ 60 characters. System UI is normal localised text.
5. Cats never explain the human story. Rivals never mention the household in Life 8. In Lives 1–7 they may cite the collar, bell, bowl and the Call, never a human.
6. **Combat onomatopoeia is readable** (user decision, settled):
   - T4 and T5 hits show **one hand-lettered manga sound-effect word** (≈ 16 per language), at most one on screen; smaller hits use shape glyphs.
   - **Localised:** each language gets its own hand-lettered set; Japanese uses native onomatopoeia.
   - It is the sound of the cat brawl, not human language. It never appears at home and is never a human word.

---

### 5.7 Round-2 presentation rulings (binding; v1.3)

- **R1 · Late Home.** A **Routine variant, not a vignette** (the count of 11 stands), fixed on **Life 2 day 3 Dusk**, stacked with K2.2 "Lamp at Night" (the late return is its cause: she stayed late to cram). No Call at the slot, the bell alone; **Gran lights the Veranda Lamp** (a dark Lamp is reserved for Life 8); Haru's key turns at Dusk + 2:30 on the street clock, or ≈ 40 s of real time after the Feeding if Mikan is inside the wall; then the Melody returns and the Call sounds at the door. It teaches "no Call, bell alone = she's late; she will come" before Life 8 A2.
- **R2 · The Piece never contains the Call cell.** Haru's Melody (the one piece she practises) opens on the rising four-note answer phrase. The Call's three-note cell sounds only in a voice (Haru sings it; Sora later whistles it), in the Brass Call and in Late Home's door Call. No Call before K1.3.
- **R3 · Numbers.** *Numbers count what the cat owns or pays; they never measure a feeling, a relationship or a human.* Allowed: Morsels, Shinies, Tribute, the Stash, prices (Lessons, the Bribe row, Share a Morsel), Crew levels and XP pips, on the Lot tabs, Turf Board, Verdict Bribe row and Pause, plus the Doorstep Tribute card and the street pickup tick and encounter tally. Territory numbers (Scent 0–100, upkeep, per-Patch Tribute) only on the Turf Board. Never numbers: Grudge, Regard, Loyalty (moods and tier words), Rival levels (paw size shows threat), anything inside the house except the Doorstep card, anything in the world (Scribble). **Combat damage numerals are Off by default** (Options: Off / Big hits / All); weakness and resistance show in the spark shape.
- **R4 · No combat inside the wall.** The crow tutorial moves to the lane-side wall top: move and hop in the garden, fight outside.
- **R5 · Faces.** A **face event** is an authored shot where the human face is the subject at ≥ 20% of screen height; the slice has three (K1.1, K1.3 shot 6, K2.5). **Incidental faces** (the Goodbye crouch, the face from below during Lap, a human kneeling at the low table) are allowed and uncounted: ≤ 15% of screen height, never centre frame for > 2 s.
- **Also ruled:** K2.3 The Flap stays a Dusk beat; Combat owns every feel number (shake, punch-in, impact frame) and Camera only plays them; the Life 2 teaching sheet is UX's (`key-screens.md` §7.4).

---

## 6. System boundaries and ownership

**One Cat Schema:** `id, name, title, coat_seed, style, personality, level, xp, stats{nerve,bite,hide,voice,zip}, moves[4], knacks[2] (Backlog), zoomies, signature_strength, traits{strengths[],fears[],scars[]}, loyalty, grudge, regard, memory[], rank, former_rank, clowder, assignment`. `personality` and `former_rank` are Nemesis-owned.

| Doc (owner) | Owns | Does NOT own |
|---|---|---|
| **Combat** (combat designer) | Real-time rules; controls' actions; strings, Hop, Skitter, Brace, Hiss; Pounce Gauge, Slow Blink, Ruffled/Frazzle, Tag-In/Relay, Zoomies, Pile-On; **all Move and Zoomies definitions and numbers**; the Style matchup chart; damage and heal formulas; the 3 statuses; Posse AI per personality (combat column); enemy AI; encounters; Critters; **the game-feel/VFX tier table**; difficulty modes; which events show lettered onomatopoeia | Learnsets; stat curves; Rival trait selection; Morsel rewards |
| **Nemesis** (nemesis/AI) | Rival generation, including **personality** and `former_rank`; the rank ladder and Fence Line data; Memory, Grudge, Regard, Titles, Scars, Strengths, Fears; **recruit availability**; Verdict rules; Night Shuffle step 3, wall events, comebacks, Ambush injection, betrayal events; bark trigger taxonomy and grammar; Boss trait kits | Combat values of traits; raid maths; the Loyalty formula; the writing voice |
| **Territory & Economy** | Patches, Scent, Spraying, claiming, Sentry/Warden rules and the guard column of personality, raid resolution (step 2), Caterwauls; Tribute and every Morsel/Shiny source, sink and **price** (one price sheet); the Clout table, Crew cap and Sentry slots; the Stash; the Turf Board rules; Life 8 territory numbers | Which Rival raids; stat curves; Move data |
| **Crew & Progression** | Stat and XP curves; Power Rating; the **Bribe** and **starting Loyalty**; the **Loyalty formula** and the personality loyalty/social columns; learnsets, Lessons, slot rules, Mikan's cross-Style rule; Tail-Up; full-Crew "make room"; Mikan's ageing; the heir | Move numbers; betrayal logic; prices |
| **Narrative** (narrative director) | The nine Lives' beats and gates; vignettes; montages; household characters; Bond's fiction and home verbs; the daily home find; Boss personalities; the cat writing voice and bark lines; Sense Icons; **Life 8 end to end (§9 of the DSP doc)**; epilogue | Bond's numeric effects; bark triggers |
| **Art** | Art bible; toon shader and outlines; character design and coat generator; **six personality animation sets**; district palettes; environment method (after look-dev); VFX drawings for the tier table; **lettering sets and the localisation brief**; Scribble; Scar/Title kits; Whisker Sense look; deaf/HoH visual carriers | Gameplay timings |
| **Audio** | Music and the Call system; instruments and Murmur; cat vocals and the **8 bark intents** per voice body; combat mix per the tier table; adaptive music; scent sonification | Story beats |
| **UX** | HUD, Slow Blink menu, Fence Line, Morning Sniff, Lot and Turf Board screens, Verdict prompt, the **control map**, onboarding beat sheet, accessibility | System rules |
| **Day loop** (game-designer, `design/gdd/day-loop.md`) | Clock implementation, day budget and playtest test, Head Home and fast travel, Caterwaul reach, daily-reset audit, encounter density, save/suspend | Phase lengths and Life rules (this brief) |
| **Camera** (technical-artist, `design/gdd/camera-system.md`) | Camera states, collision, lock-on framing, options | Combat timing |
| **Accessibility** (UX, `design/accessibility-requirements.md`) | Flash and motion safety mirror, remapping, assists, Hearing support | — |

### 6.1 Interfaces (event contracts; use these names)

| Event | Emitted by | Payload (minimum) | Consumed by |
|---|---|---|---|
| `EncounterStarted` | Combat | participants, patch_id, opener (standoff / ambush_by_player / ambush_by_rival / raid_defence), phase | Nemesis, Audio, UX |
| `CatRouted` | Combat | victim_id, finisher_id, finisher_move, damage_type, was_frazzled, by_pile_on, by_back_down | Nemesis, Crew |
| `MoveUsed` | Combat | user_id, move_id, targets_hit[] | Crew, Audio |
| `TagIn` | Combat | from_id, to_id, relay_count | Audio, VFX, Crew (bonded pairs) |
| `FearTriggered` | Combat | cat_id, fear_id, source | Nemesis, Audio, VFX |
| `EncounterEnded` | Combat | outcome (win / loss / player_fled / rival_fled), duration, routed_ids[], survivors[] | Nemesis, Territory, Crew, Economy |
| `VerdictApplied` | Nemesis | rival_id, verdict, slipped_away_ids[] | Territory, Crew, Economy, UX |
| `RivalRankChanged` / `WallEvent` | Nemesis | rival_id(s), old/new rank or kind, cause | UX, Territory, Narrative |
| `RaidRequested` | Nemesis | attacker_ids[], patch_id, motive, night (= tomorrow) | Territory, UX (forecast) |
| `RaidResolved` | Territory | patch_id, outcome, sentries_routed[] | Nemesis, UX |
| `BetrayalTriggered` | Nemesis | crew_id, new_clowder | Crew, Territory, UX |
| `PatchChanged` | Territory | patch_id, old_clowder, new_clowder, scent | Nemesis, Economy, Art, Audio |
| `DistrictClaimed` | Territory | district_id | Narrative, Nemesis, Economy |
| `TributeDelivered` | Economy | amount, by_district | UX, Narrative |
| `HomeArrived` | Day loop | kind (on_time / late / routed) | Narrative, Audio |
| `KeystonePlayed` | Narrative | keystone_id, life, slot | Audio, UX, Nemesis (routine tags) |
| `FoodPickedUp` / `CarryDelivered` | Territory / Narrative | source_kind, patch_id / carry_index | Narrative, Combat (escort), Audio (Life 8, Backlog) |
| `PhaseChanged` / `DayEnded` / `LifeAdvanced` | Clock | phase, day_index, life_index | Everyone |
| `BondChanged` | Narrative | bond (0–10) | Combat (Well-Fed), UX |

**Queries:** Combat asks Nemesis for a `RivalCombatProfile` (level, style, personality, moves, strengths, fears, title, scars). Territory and Nemesis ask Crew for `PowerRating(cat_id)` and `Loyalty(cat_id)`.

**Grey areas:**
- A Strength or Fear is chosen by Nemesis and valued by Combat.
- Posse cats Routed in a fight recover at the next Sunspot or at home. No permadeath.
- A Crew cat is lost only by betrayal or release.
- Recruited Rivals keep their Memory, Scars, Title, Fears and personality.

---

## 7. Nemesis and combat: creative direction

**Combat (Pillar 3).** FF7 Remake's **structure**, Pokémon's roster, a cat's verbs, kept deliberately light:
- **The rules:** one 3-hit string per Style, twelve inputs, three statuses, stagger and Slow Blink commands. You control one cat and switch instantly between all four. A timed switch is a **Tag-In**, and Relays are the skill expression.
- **The Posse:** AI cats fight by their personality and fill Paws at half rate, so the player conducts.
- **Fight lengths:** Tough 6–10 s · encounter 30–60 s · Captain 30–45 s · Boss 2–3 min · Botan 4–5 min. Fed Up at 75 s.
- **Bosses stagger:** phase breaks keep the Frazzle gauge and wait for the Pile-On.
- **The environment is the weapon:** knock things (and Daifuku) off ledges; buckets, horns and cucumbers hit Fears. Knock-offs always Splat.
- **Feel budget:** hit-stop, stepped screen shake, manga action lines, impact frames, smear frames, glyph bursts, and **readable hand-lettered onomatopoeia on big hits**, all inside the safety limits (§8).
- **Spec level:** the GDD gives intent and ranges in milliseconds; frame data lives in tuning data and the prototype.

**Nemesis (Pillar 4).** Mordor's structure, re-reasoned for cats. **Nobody dies, so everyone comes back.**

| Verdict | The cat | The post |
|---|---|---|
| **Chase Off** | Exiled; returns changed (escorts → promoted → the Grand Standoff), adapted to how you beat it | Yours |
| **Humble** | Stays on the Undermark crate and pays (+15% Tribute); simmers unless the Patch is guarded | Yours |
| **Recruit** | Joins with full Memory, its personality and its signature perk, for a Bribe | Yours |
| **Nose-Touch** | Respects you | It **keeps its post** (5-day truce; afterwards a respectful Rival yields it without a fight) |

- **Memory is visible and audible early:** the First Thorn returns inside Life 1; silhouette Scars read in play; memory lines play at the Standoff, or at the Rout after an Ambush; Lick In; Mikan's plaster after a loss; a personal 2-bar yowl-sting per Rival.
- **Cats hold a town in common:** wall events change the Fence Line overnight.
- **The Crew is inside the system:** posted cats build grudges with raiders, neglect breeds Wavering, and a Turncoat takes the Patch it guarded.
- **Personality ties the halves together:** the Braggart who taunted you on the wall is the Braggart who charges first in your Posse and makes his Patch pay.

---

## 8. Shared numeric frame (tuning starts, not final balance)

| Quantity | Canon value |
|---|---|
| Level range | 1–**30**. Life-end levels: L1 3 · L2 8 · L3 13 · L4 18 · L5 22 · L6 26 · L7 30 · L8–9 30 |
| Nerve (Style-neutral) | 100 at Lv 1 → 1,500 at Lv 30. Style multiplier 0.8 (Prowler) to 1.3 (Bruiser) |
| Other stats | 10 at Lv 1 → ≈ 100 at Lv 30 |
| Basic hit, same level | ≈ **4–5%** of a neutral cat's Nerve at every level (flat across levels by formula) |
| Moves | 1 Paw ≈ 3.5 basic hits + a Frazzle chunk · 2 Paws ≈ 8 basic hits or strong utility · no self-refunds |
| Rank multipliers | Nerve: Tough ×1 · Captain ×8 · Boss ×20 · Botan ×30 · Critter ×0.5–×3. Damage: 1 / 1.3 / 1.6 / 1.8 |
| Fight lengths | §7. Fed Up 75 s |
| Posse | Mikan + 3. Enemy groups 1–6. Hard cap 10 combatants |
| Pounce Gauge | 2 Paws (Mikan 3 from Life 4). AI fill **50%** in Lives 1–7, 60% from the Life 8 Season Turn, 70% in Life 9, 100% while carrying |
| Slow Blink | Time ×5% |
| Ruffled / Frazzled | Ruffled: 4 s, Frazzle ×2, leader re-Ruffle cooldown 6 s. Frazzled: 6 s, damage taken ×1.5 |
| Healing / guard | ≤ 60% of max Nerve healed per cat per fight; ≥ 30% of damage always gets through |
| Slots | 4 Moves · 1 Zoomies · (2 Knacks, Backlog) |
| Content | **Slice:** 3 Styles, 12 Moves, 3 Zoomies. **Full:** ≈ 50 Moves (45 Style + 4 Home), 5 Zoomies, Knacks TBD |
| Crew cap / Sentry slots by Clout rank | 6/7/8/9/10/11/12 · 1/2/3/4/5/6/8 |
| Patches | 20 (Lane 5, Arcade 7, Shiosai 7, Summit 1) |
| Rivals | 8 seats per district + Botan's court of 3 = 27; ≤ 12 off-wall. Slice ≤ 12 tracked. One Nemesis slot per district + the arc lead. Memory 10 entries, ≤ 6 pinned |
| Grudge | Decays −2 per quiet night (Brooder −1). Per-encounter cap 35, then 20. Humble +10; Restless at 80 |
| Loyalty tiers | **Shifty 0–29 · Aloof 30–44 · Steady 45–59 · True 60–79 · Sworn 80–100**. Teach at Steady+; Warden at True+. **Betrayal: < 30 → Wavering (2 warning mornings) → Turncoat.** Release at ≥ 60 = clean parting |
| Starting Loyalty | `clamp(5, 80, 50 − 0.4·Grudge_before_halving + 0.3·Regard + personality_mod + 5·bribe_step − 20·returned)` |
| Day | 4 phases × 4 min = **16 min** roaming. Session ≈ 20–25 min (slice), ≤ 35 (late game) |
| Playtime | Main story **12–15 h** (≈ 26–32 in-game days); thorough ≈ 20 h. **Slice ≈ 2–2.5 h** |
| Economy | Tribute/day ≈ 60 at end of Life 2 (later anchors Backlog). Lessons: Rank I 40 · II 120 · III 300 · IV 600, ×1.5 cross-Style. Bribe fair = 8 × level × (Stray 0.75 / Tough 1 / Captain 2 / Boss 4); feast 2×; from the Stash. Share a Morsel = Σ Crew levels. Shinies ≈ 50 |
| Bond / Well-Fed | 0–10 hearts. **Well-Fed:** next day, Zoomies starts at 5% per heart (max 50%) and every Posse cat starts each fight with ¼ Paw |
| Loss | The outing ends; 20% of the day's field haul is lost (none in Life 1); the Stash is safe |
| Difficulty | Kitten / Alley (default) / Feral. Scales enemy Nerve, damage and aggression only |
| **Flash and motion safety** (overrides all feel values) | ≤ 3 flashes per second (WCAG 2.3.1, area > 20% of the screen); ≤ 1 full-screen impact frame per second; local impact ≤ 15% of the screen; no saturated red changing over > 5% of the screen; full-field lines Ink/Cream; every look event ≥ 2 rendered frames; stepped shake; global hit-stop ≤ 20% of any second. The default configuration must pass a Harding-style test before public footage |

---

## 9. Tone, audience, platform, engine

**Tone guardrails:**
- It is cats: scratches, hisses, puffed tails, bunny-kicks, dust clouds, stars, sticking plasters. **No blood, wounds, gore or street death.**
- The streets are a comedy of status; the house is a quiet drama. **All real grief belongs to the home story.** Never undercut a home scene with a gag.
- Spraying is slapstick. Humans are never enemies or harmed. No cruelty to animals.
- Rivals are villains you enjoy; insults are petty, never cruel.
- Murmur is never exaggerated for comedy.
- The ending is sad and then warm.

**Art-style ruling (v1.4, user decision 2026-11-24):** *reference-close*. The look of *Shin chan: Shiro and the Coal Town* — 3D cel-shaded characters that read like 2D cels over backgrounds that read like 2D painted anime art — is the rendering target, matched as closely as we can on the visuals. It is **not** the 3C target: ours is a free-orbit third-person camera you walk and rotate freely. Differentiation comes from our original characters, world, UI content and camera, not from pushing the rendering away from the reference. This supersedes the "print-stylised" default proposed in Iteration 3.

**Originality rule:** the Shin-chan/Shiro game is a *style* reference only (cel shading, flat colour, clean line, painted nostalgic backgrounds, warm bubbly UI) — a rendering/look target, nothing more. All characters, names, locations and assets are original; that IP's characters are never drawn, named or reused. We take its warmth, not its components (no brown name tags, no cloud-balloon layout, no composition lifts). Home key art never uses the inside-looking-out veranda-to-garden frame with a pet in the yard.

**Sanctioned exceptions** (recorded, not precedent):
- Readable combat onomatopoeia.
- The ring and the white dress (Tier B meaning only).
- The question-mark Sense Icon and the always-on **Call glyph** (singer's colour; shape codes the voice).
- The Doorstep as the licensed HUD space.
- Haru's Home Scent note in Life 8.
- The Call Ripple in Haru Yellow.
- The undetermined cause of death.
- The four street/home sound crossings: Dusk bleed, Brass Call, carry pick-up, Life 9 walk.

**Audience:** 16–40; action-RPG players who also buy emotional indies; cat people. PEGI 7–12 / ESRB E10+. Solo, premium, offline.

**Platforms:** PC (Steam) lead, controller-first, full keyboard/mouse; a handheld console second (the slice is PC; handheld floor OPEN). 60 fps PC, stable 30 fps handheld.

**Engine (settled by the user, 2026-11-24):** **Unreal Engine 5.8** (C++ primary, Blueprint for prototyping and tuning). GDDs stay engine-agnostic; engine specifics live in the art bible's rendering requirements, `project.yaml` and the ADRs.

---

## 10. Scope

**The vertical slice (current build target):**
- **Lives 1–2, ≈ 2–2.5 h.**
- **World:** Hidamari Lane (5 Patches); Haru's House (garden, entryway, Main Room with piano, Haru's room); the Lot; 4 Sunspots.
- **Rivals:** the Wall Sitters (8 seats incl. Daifuku and the First Thorn) + 2 Roamers, ≤ 12 tracked.
- **Crew:** Mikan + 6 recruitable (the old wall cat by ≈ minute 10, a second story recruit before Life 1 ends, 1 Friend Stray, 3 Rivals), **one per personality**. Crew cap 6.
- **Combat:** 3 Styles, 12 Moves, 3 Zoomies, 3 Fears; Tag-In, Pile-On, Daifuku in 3 phases. The 12 (Combat §3.10 names; v1.3 corrects the archived ids): Scrapper **Face Swat, Scruff Toss, Bunny-Kick, Shred** · Bruiser **Shoulder Check, Belly Flop, Puff Up, Sit On It** · Yowler **Withering Hiss, Howl, Purr, Banshee Screech**. Claw Flurry, Wall-Kick, Loaf and Big Talk are retired.
- **Nemesis:** all four Verdicts, the Gloat, Lick In, wall events, the Fence Line.
- **Territory:** 2 Sentry slots; **one forecast raid every night** from the first (requested night 3, forecast in the Life 2 day 2 Sniff, fires that Night as the Caterwaul; afterwards ≤ 1 per district per night whenever an admissible target exists, Strong Patches included, worst case Scuffed); Tribute, Lessons I–II, Bribes, Share a Morsel.
- **Home:** 11 vignettes (7 Keystones, 3 Textures, 1 montage), the Routine layer, the daily find, the piano.
- **Audio and lines:** ≤ 25 min music; ≤ 240 bark lines.
- Final art and audio for this content.

**Slice questions:** Is conducting four cats fun? Do players care about a Rival and about Haru within two hours? Is territory management fun at this scale? Does a day fit ≈ 25 minutes?

**Slice tests:**
- Two cats and a Pile-On by minute 15.
- A memory-citing Rival line before minute 60.
- ≥ 80% can name a Rival and something specific Haru does.
- Tier A facts reach 90% of testers with audio muted.
- Flash test passes.

**Before the slice:** the combat prototype (grey box; Mikan + 3; 3 Styles; 8 Moves; Tag-In; Pile-On; a Captain and a 3-phase Boss; personality AI for 3 personalities) and three small sims (combat, Night Shuffle, Lives 1–2 economy).

**The full game (framing only):** nine Lives, 3 districts + the Summit, 20 Patches, ≈ 50 Moves, ≈ 58 story vignettes (33 Keystones, 18 Textures, 7 montages), ≤ 700 bark lines, ≤ 75 min music, 12–15 h, sized for a small team.

**Never cut:** the dual story, the nemesis memory loop, Tag-In, the Pile-On, personality.

**Cut from v1.0:**
- Districts 6 → 3 (Kurogane Yard and Kiha & Moha gone).
- Elders, Keepsakes, Zoomies tiers, Swagger, Bap, Whack.
- Spats, Clean Duels, Old-Timers, Lure, Sightings.
- `rounds`, Rations, Specialisations, Skim, Clout points.
- Waiting-up and Echo vignettes (now prop states).

**Backlog:** Knacks, Tactics, Watching, Kits, Wall Watch, Home Moves, Life 3–9 content.

**Top risks:**
1. Scope; mitigated by slice-first, Backlog discipline and the three-district plan.
2. Wordless legibility; mitigated by vocabulary-before-use, colours, instruments, no-briefing tests.
3. Nemesis without voice; mitigated by personality animation, Scars, the yowl-sting and one sharp line.
4. Combat readability with four cats in a third-person camera; mitigated by keylines, edge arrows, telegraph decals and the effect budget.
5. Third-person environment cost (sky and every angle visible); mitigated by the look-dev test and one district first.
6. Tonal whiplash; mitigated by the street/home separation.
7. Style proximity to the reference (the user chose reference-close, v1.4): mitigated by the originality rule — original characters, names, locations, assets and UI content — and by the free third-person camera; the look is matched, the content never is.
8. Procedural cat variety; mitigated by personality sets and the coat generator.
9. The nemesis patent; needs a legal review before public showing.

---

## 11. Open questions for the user

1. ~~**Engine.**~~ Settled 2026-11-24: Unreal Engine 5.8.
2. **Team size, budget, timeline.**
3. ~~**Title.**~~ Settled 2026-11-24: "Cat RPG" (final).
4. **Haru's presentation:** canon default, or selectable?
5. **Mikan customisation:** fixed iconic design (recommended)?
6. **Ending:** does Life 9 imply Mikan's passing? (Default: no; Mikan is alive in the morning.)
7. **Handheld floor:** Switch 1-class (default) or Switch 2-class.
8. **Night lock in Lives 1–2** until the cat flap: acceptable? (Default: yes.)
9. **Spraying presentation:** sparkle-cloud euphemism? (Default: yes.)
10. ~~**Reference closeness.**~~ Settled 2026-11-24: reference-close on the visuals (3D cel characters reading as 2D cels, environments reading as 2D painted backgrounds), with our own free third-person camera. The look-dev test now proves the method, not the choice.
11. **IP review** of the nemesis system and a **cultural consultant** for the home rituals (defaults: commission both before public showing / before slice home content is final).

*Settled by the user on 2026-11-24:* engine (Unreal Engine 5.8); title ("Cat RPG", final); art style (reference-close on the visuals, not the 3C).

*Settled by the user on 2026-11-23:* slice-first target; simplified FF7R-structure combat; personality as the Crew hook; third-person camera; the tight three-district game; readable cat speech; readable, localised combat onomatopoeia.

---

## Changelog

- **v1.4 (2026-11-24, Iteration 3b — user decisions)** — Records three settled decisions:
  - **Engine:** Unreal Engine 5.8 (§9); the Unity (URP) / Godot 4 recommendation is withdrawn. `project.yaml` and `CLAUDE.md` carry the engine config.
  - **Title:** "Cat RPG" is the final title (§1); "Nine Lives of a Boss Cat" is withdrawn. "Nine Lives" remains the game's structure term.
  - **Art style:** reference-close on the visuals, not the 3C (§4.1, §9 art-style ruling); supersedes the "print-stylised" default. The originality rule is unchanged. Open questions 1, 3 and 10 closed (§11).
- **v1.3 (2026-11-24, Iteration 3)** — Folds in the round-2 reviews (`design/reviews/round-2/presentation.md`, `combat-and-crew.md`, `nemesis-territory-dayloop.md`):
  - **Rulings R1–R5** recorded in §5.7 (Late Home on L2D3 with K2.2; the Piece never contains the Call cell; the numbers rule; no combat inside the wall; face events vs incidental faces). Turf Board glossary line amended per R3.
  - **Cat scale** 1.25× (≈ 0.56 m), one global value (§4.1). Posse tick = chevron, controlled cat = bell (§4.1). Tone Sense Icons are the four tone puffs (§5.6).
  - **Named slice cats** and personalities (§3.1): Hige, Pon, Kinako, Togemaru (the First Thorn), Kagi, Daifuku. Kinako's recruit input is Interact, not hold Sit.
  - **Move names** corrected to Combat §3.10 (§10); the archived Claw Flurry, Wall-Kick, Loaf and Big Talk retired.
  - **Raids:** one forecast raid every night from Life 2 day 2, Strong Patches admissible (worst case Scuffed); supersedes v1.2's "raids take only Patches below Strong" (§10).
  - **Nemesis:** one declared arc lead at a time; Humbled lead stays the lead; same-night re-naming (§3.1).
- **v1.2 (2026-11-23)** — Folds in `design/reviews/round-1/director-rulings.md`:
  - **Target:** the vertical slice (§10), with a Backlog discipline in every doc.
  - **Camera** is third-person (§4.1), replacing the fixed 55° bird's-eye view; painted sky and backdrops return; one camera grammar at home.
  - **World:** 3 districts + the Lighthouse Summit, 20 Patches, level cap 30, 12–15 h; Lives re-mapped (§4, §5.4).
  - **Combat simplified** (one string per Style, 12 inputs, 3 statuses; Tag-In/Relay; Pile-On rules; Swagger, Bap and Whack cut; new fight lengths and rank multipliers).
  - **Personality** model shared by Crew and Rivals (§3.5); it replaces both `temperament` fields.
  - **Recruitment** deterministic, with a Bribe from the Stash; one Loyalty table; betrayal below 30.
  - **Nemesis:** decay and Nemesis slots; silhouette Scars; Lick In; Nose-Touch keeps the post; wall events replace duels.
  - **Territory:** `rounds` deleted; raids take only Patches below Strong; forecasts always on; Turf Board; minimal management.
  - **The day:** 16-min clock; day budget; Head Home; 3 daily resets; losing ends the outing; Well-Fed felt in the fight.
  - **Home beats** day-gated; Life-end rule; Life 8 framing unified under Narrative.
  - **Language:** readable localised onomatopoeia on big hits; cats speak readable text.
  - **Safety and accessibility:** flash and motion safety; deaf/HoH carriers; renames (Keeper, Seated, Bribe, Share a Morsel, Brass Call, Turf Board, phase dial); new events (`MoveUsed`, `TagIn`, `WallEvent`, `HomeArrived`, `KeystonePlayed`).
  - **New docs commissioned:** `design/gdd/day-loop.md`, `design/gdd/camera-system.md`, `design/accessibility-requirements.md`.
- **v1.0 (2026-11-23)** — First canon for the parallel first drafts.

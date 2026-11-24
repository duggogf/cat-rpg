# Creative Brief — Shared Canon: "Cat RPG"

*Created: 2026-11-23 · Owner: creative-director · Status: **v1.6** (v1.6 records the consistency pass `design/reviews/owner-feedback/consistency-pass.md`, rulings F1–F12; v1.5 folded in the owner's preview-gallery comments C1–C5 through `design/reviews/owner-feedback-rulings.md` (OR-01…OR-21), under the patent guardrails of `design/legal/nemesis-patent-analysis.md` v2; v1.4 recorded the user's 2026-11-24 decisions on engine, title and art style; earlier canon from `design/reviews/round-1/director-rulings.md` and round-2 rulings R1–R5; decisions marked OPEN await the user)*

> **Patent rule for every department (v1.5):** nothing Mikan does to one cat, and nothing that cat becomes because of it, may change a *different* cat. Changes land on the cat Mikan dealt with, on territory and objects, on the calendar, or on newly generated cats. Cats speak only from their own history. See `owner-feedback-rulings.md` (appendix) and the legal note v2 §5. Not legal advice; counsel review still blocks scope lock and any public showing.

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
| 3 | **Command the Brawl** | Fights are short, loud, readable cartoon brawls: you fight as Mikan and command three AI cats through the skill bar and the Special chain; feel beats simulation. |
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
| **Rival** | Any named, persistent, non-Crew cat tracked by the nemesis system. Shown on the **Rivals board** (§3.2). |
| **Nemesis** | Internal term (UI: **Sworn Enemy** / **Sworn Rival**; never "nemesis" in game or marketing text). In Lives 1–2 there is one slot, held by the **fixed arc lead, Togemaru**, declared at ≥ 3 encounters + ≥ 1 mark or at the deadline (the night after L2D3); a truce greeting counts as an encounter (v1.6). **The lead is never re-named** (v1.5, OR-15): if Togemaru is Chased Off or Recruited, his arc closes with a closing card and the slot stays his as a record. All three Verdicts are open on him, and **every Verdict on him is a complete ending of his arc** (v1.6): Chase Off = gone with a farewell line; Recruit = he joins; Nose-Touch = a truce his daily greeting and join-ins carry. His first Rout always leaves a Scar. Others at Grudge ≥ 75 are **Bitter**. A Lane slot opens in Life 3 (Backlog). |
| **Challenger** (v1.5) | A **newly generated** outsider who comes to town on a fixed calendar to take one of Mikan's Patches: announced in the Sniff, stands at the post by day (Standoff, fight, Verdict), over-marks −10 a night and uses the raid slot (`challenge`). Lost → it becomes the Keeper; Repelled twice → it leaves (OR-16). |
| **Newcomer** (v1.5) | A freshly generated cat that fills a keeperless Patch or an empty seat on a town-event night. Existing cats never move up or in (OR-10, OR-19). |
| **Usurper** (v1.6; full game, unreachable in the slice) | The owner's "new boss": on a town-event night in a district with no Boss on the street (Gone, Crew, in truce or a Friend) where Mikan's influence is below 25, a **freshly generated** Boss arrives and stakes the Den as a challenger; if it takes the Den it is the district's new Boss. Nothing is inherited (Nemesis §3.20). |
| **Stray** | An unaffiliated cat; not tracked until it becomes a tracked Rival. Strays have no signature perk. |
| **Critter** | A non-cat opponent (crows, rats, a weasel, a chained dog set-piece). Never Rival or Crew. The slice has crows only. |
| **Clowder** | A cat gang, one per district. The player's own is the **Bell Clowder**. |
| **Tough → Captain → Boss → Great Boss** | Rival **roles**, fixed at generation and never changed by any outcome: no seats, no promotions, no demotions (v1.5, OR-19). Each district has 1 Boss, 2 Captains and 5 Toughs (unordered). **Botan** is Great Boss. |
| **Relationship tags** (v1.5) | Six words for four relations, shown on the Rivals board when you hover one discovered cat over another: **Boss / Gang**, **Rival** (NPC–NPC), **Kin**, **Old Boss / Old Gang** (stored only in the recruit's own Memory). Display only; each effect lands on the cat that holds the tag (OR-04, OR-05). |
| **Keeper** | The Rival holding a Patch (`keeper_id`). |
| **Crew / Posse** | Crew = every recruited cat. Posse = Mikan + 3 Crew in combat. Swappable at the Lot, or away from it by **Tail-Up** (Lounging cats only). |
| **Sentry / Warden** | A Crew cat posted to guard a Patch. The **Warden** is the Den's first Sentry slot (True+ Loyalty). |
| **Personality** | Each cat's one of six fixed personalities, shared by Crew and Rivals (§3.5). **The reason to want this cat over that one.** |
| **"Collar"** | The street insult for a pet cat. |
| **The old wall cat** | Life 1's first story recruit ("Use your whiskers, Collar."): **Hige**. Narrative names them; Crew owns their stats. |
| **The slice six** (v1.3; Crew §3.3, one per personality) | **Hige** (Stalwart Bruiser; the old wall cat, ≈ 0:08–0:10; v1.5: an ex–Wall Sitter, Old Gang of Daifuku) · **Pon** (Goofball Yowler; story recruit 2, Life 1 day 2) · **Kinako** (Fraidy Scrapper; the Friend Stray, Life 2 day 1's required first objective; recruited by Interact within 4 m, Mikan's slow-blink gesture; Kin of the Wall Sitter Sasa) · **Togemaru**, *the First Thorn* (Braggart Scrapper; Fear Cucumbers; Keeper of Laundry Pole Yard; **his day-1 flee cannot be interrupted**, so he is contested at the gatepost on day 2; Rival of Goma) · **Kagi** (Schemer Yowler; Captain of Tofu Shop Step) · **Daifuku** (Brooder Bruiser; the Boss). The Low Wall Corner Keeper is an untracked Stray: Routing it gives no Verdict. |

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
| **The Rivals board** (v1.5; replaces the Fence Line) | The roster of every cat in town on one painted wall, by district from left to right uphill, then **Outsiders**, then the **Bell fence** (Mikan and Crew). Each district's Boss sits on its gatepost, and its gang is in one row in order of discovery. **No rank ladder.** Cats are flat silhouettes until **discovered** (an encounter, or a 1 s Whisker Sense sniff within 10 m). Hovering a cat shows relationship tags on the other discovered cats. Gone cats stay as legend cards. Read-only on the street, at the Doorstep and at the Lot; never in the house (OR-03). |
| **Turf Board** | The Lot's territory screen, **unified (v1.5, OR-17)** into four zones: a header (district + influence bar + tabs), the map (where), the Tonight panel (the one decision: who guards the threatened Patch) and the Crew strip (who). The only map-like view and the only place territory numbers appear (R3, §5.7). |
| **Influence** (v1.5) | Per district, per Clowder, 0–100, **derived from Patch Scent**: each outer Patch held at Strong is a full share (the Lane: 4 × 25). It moves only through territory acts (Spray, marking), NPC raids and time, never by fight outcomes. Shown as a tug-of-war bar; the % only on the Turf Board (OR-08). |
| **Boss window** (v1.5; replaces the Den gate) | At influence 100 the district's Boss leaves the Den and roams a **three-stop patrol** (one stop per daytime phase; each stop uses the same arena kit: a knock-off edge and a water prop), and can be challenged. It stays open while influence is ≥ 75. While it is open, held outer Patches cannot be Lost (OR-09). **Slice reference day: L2D3**, at the Tofu Shop Step Claim Spray; the first fight is L2D4 (v1.6). |
| **Phase dial** | The always-visible day indicator while roaming (sun over a roofline; no digits). |

### 3.3 Verbs and systems

| Term | Canon |
|---|---|
| **Spray** | Marking a Scent Post: tail-quiver pose, sparkle scent cloud, pop. Never liquid. Your own Spray is offered only when a post is below Strong. |
| **Scent** | Per-Patch control, 0–100, shown in the world as 1–4 wisps in the Clowder's colour. Strong = 60+. |
| **Whisker Sense** | Hold mode. The world desaturates; scent trails glow; a **scent compass ring** around Mikan points to rival marks, Rivals and hidden finds (v1.5: also the roaming Boss's stop and an active challenger). Holding it on a cat within 10 m for 1 s **discovers** it. Not usable in combat. |
| **Head Home** | A bell-gold High Road scent thread to Haru's wall. It appears at the Dusk Call or on request, and is ≤ 60 s long in the slice. |
| **Standoff** | The pre-fight beat (2–4 s name-card and one taunt). A memory-citing line cannot be skipped for 1 s. |
| **Ambush** | Opening a fight unseen or from the High Road; the target starts Ruffled. A Rival Ambush gives a 2.0 s directional yowl-sting; a Dodge in its last 0.75 s gives a neutral start. |
| **Control (M1.1)** | **The player controls Mikan only**; the three Crew are always AI and are commanded from the skill bar. The one control table is Combat §3.1 (KB+M: LMB Light, RMB Heavy (hold to charge), Space Dodge, Shift Dash, **Tab** Lock-on, **F** Special, **R** skill bar, Esc/P Pause). |
| **Light / Heavy strings** (M1.1) | Mikan's five strings: L-L-L; **L-L-L-H finisher**; L-H launcher; hold H charged heavy; Dash-L lunge. Heavies build Frazzle faster. A Light's first active frame is ≤ 3 frames; one-slot input buffer (last ≈ 150 ms); move-out gradient from ≈ 60% of recovery. A Light airborne or from the High Road is a **Pounce**. Crew and enemies have no player strings (AI dash-in combos). |
| **Dodge (Skitter) · Dash** | Dodge cancels recovery after the hit; Dash → Light is the lunge, and a Dash at a reachable ledge mantles onto the High Road. **Brace** is an AI guard posture only; there is no jump button in combat. |
| **Lock-on** (M1.1) | Not locked by default. Tab locks the nearest enemy; again: a different nearest enemy, or unlock (free camera). |
| **Hiss** | A skill-bar entry for every cat (M1.1). 8 s cooldown. Interrupts a yellow telegraph and Ruffles the attacker; a Tough at ≤ 15% Nerve **Backs Down** (Routed by intimidation). |
| **Pounce Gauge / Paws** | The command resource. 2 Paws per cat (Mikan 3 from Life 4). Fills over time and from hits. |
| **Skill bar** (Slow Blink; M1.1) | Opened with **R**: time at 5%; one row per Posse cat; fire Mikan's Moves and **force** any Crew cat's Move or Hiss; commands chain. A command to a Cowed recruit steadies it. |
| **Move** | An active skill costing 1–2 Paws, either a **Set-up** or a **Pay-off**. 4 slots per cat. |
| **Knack** | Passive skill. **Backlog** (not in the slice). |
| ~~Tag-In / Relay~~ | **Removed (M1.1):** no control switching. Commanding from the skill bar and the Special chain are the heart of commanding. |
| **Special** (Zoomies folded in, M1.1) | **F** on a Frazzled (staggered) enemy while Mikan's Special meter is full: the camera punches in, time stops, Mikan alone over an impact-frame background (≈ 1 s cut-in), then the hit. One Special per Style (the old Zoomies: Midnight Laps, Landslide, Midnight Aria). Each cat's meter fills from hits, damage taken and Frazzles; persists within a day. |
| **Special chain** (M1.1) | After Mikan's Special, every Crew cat in range with a full meter fires its own Special and cut-in **automatically**, in turn. ≤ ≈ 6 s; shortened after the first in a fight. |
| **Attack tokens** (M1.1) | Only 1–2 enemies engage Mikan at once; the rest circle, stalk, posture, flank and feint, then dash in for a combo and back out. Crew follow the same rules. Cats think before they charge. |
| **Ruffled** | For 4 s, Frazzle builds ×2. A leader cannot be re-Ruffled for 6 s after it ends. |
| **Frazzle / Frazzled** | The stagger gauge; Frazzled = staggered. When full: 6 s helpless, damage taken ×1.5. The stagger plays a brief zoom, slow-down and shattered-glass blink (≤ 0.5 s; full for Captains, Bosses and the first stagger per fight), inside the flash limits. |
| **Statuses** | Only three: **Soggy** (slower), **Cowed** (deals less), **Fired Up** (deals more). |
| **Team Pile-On** (M1.1; was the Pile-On) | The **team finisher**: when all four Posse cats land their Specials in one chain, they vanish into the KA-BLAM cartoon dust cloud. Routs every Frazzled enemy below Captain within 3 m. In the spirit of Granblue Fantasy Relink's Full Burst, with our own art and staging (counsel watch item). The signature street image. The old Quick and Full Pile-On inputs are gone. |
| **Old Score** | A Crew cat fighting a Rival it has Routed, or been Routed by, deals extra Frazzle, and both bark. |
| **Nerve / Routed** | HP. At 0 the cat bolts in a dust puff. Nobody is killed, ever. |
| **Verdict** | After Routing a Rival (one full Verdict per fight; other tracked cats slip away): **three options (v1.5): Recruit, Chase Off, Nose-Touch** (§7). Humble is removed. Every Verdict clears the post; Mikan then **Claim Sprays** it ("fight to clear, spray to claim"). No other cat moves up or in. |
| **Chase Off** (v1.5) | The cat is **Gone** for good: no comeback, and a legend card on the Rivals board. Empty places wait for newcomers and challengers. |
| **Nose-Touch** (v1.5; gate v1.6) | Offered when the cat's pending Grudge is below 50 + a personality shift **and, from Life 2, the take was quiet**: not after two or more Counter-Sprays on its own post, and, for a Boss, not if it came to the fight Seething or Furious (deterministic; no roll). Grudge 0, Regard +25. The cat **steps down** (Mikan Claim Sprays the post) into a **10-day truce**. During the truce, and as a Friend afterwards, it may **join** Mikan's fight against its own tagged Rival (p 0.35–0.65, seeded), as an allied AI guest; the opposing Rival is unchanged. A truce that ends with Regard < 75 turns the cat into a challenger. |
| **Old Gang Nerves** (v1.5; the "stare-down") | A trait written into a recruit's **own** Memory when it joins. When it sees its Old Boss among the opponents it flinches and is **Cowed** for 20 s (Fraidy 30 s) until the player commands it from the skill bar. Braggart, Stalwart, Brooder and Sworn cats resist. The old boss behaves exactly as it would with any Posse. |
| **Boss anger** (v1.5) | A Boss-only meter, 0–100, shown as 0–3 steam puffs. Fed only by marking acts in its district (Over-mark +5, Counter-Spray +15), never by fights; −15 a night. It gives the Boss **Fired Up** for 20 s / 40 s / the whole fight (Riled / Seething / Furious). Spent after any fight with the Boss that ends in a win, a loss or `rival_fled`; not after a Scram. |
| **Discovered** (v1.5) | A cat met in any encounter, or sniffed for 1 s in Whisker Sense within 10 m. Until then it is a silhouette on the Rivals board and on Sniff cards. |
| **Grudge / Regard / Memory** | Grudge 0–100 and Regard 0–100 are never shown as numbers. Memory is a Rival's log of you (10 entries, ≤ 6 pinned). |
| **Fear / Strength / Scar / Title** | Rival traits. Slice Fears: Water, Loud Noise, Cucumbers. Every player-sourced Scar is a **silhouette Scar** until the cat has two. |
| **Lick In** | A Rival that Routs Mikan in a fight the Posse still wins earns a Glory Title (no promotion). |
| **Gloat** | The victor's ≤ 3 s beat after a Posse wipe. The victor gets Memory, a Glory Title and its lines, and nothing else changes for any cat (v1.5). Only the victor may cite the loss or Mikan's plaster next day. |
| **Town event** (v1.5; replaces the wall event) | The director's overnight change, one per district every 2–3 nights, on a calendar: a **newcomer** fills a keeperless Patch or empty seat, or a **feud scuffle** happens between a Rival-tagged pair (the loser wears a head plaster for 2 days). Shown on the Rivals board. No promotions. |
| **Morsels / Shinies** | Soft currency (food) / rare currency (≈ 50 in the full game). |
| **Tribute** | Daily Morsels from held Patches, placed on the Doorstep. |
| **Bribe** | The recruit payment, from the Stash: **free in Life 1** (teaching, PP-07); from Life 2 **fair or feast** only (v1.6: no "none" tier, so Recruit always costs Morsels). |
| **Share a Morsel** | Feeding the whole Crew at the Lot, once per day; costs the sum of Crew levels; +2 Loyalty to all. |
| **Clout** | Reputation, 7 ranks: House Pet → Lane Cat → Known Face → Boss → Two-Street Boss → Big Whisker → Great Boss. Milestones only. |
| **Bond** | Closeness with the household, 0–10 hearts. |
| **Loyalty** | 0–100 per Crew cat. Tiers in §8. |
| **Lesson** | Teaching a Move at the Lot. Slice routes: Instinct and Lessons. |
| **Night Shuffle** | The overnight simulation (§5.3). |
| **Caterwaul** | A distress yowl when a held Patch is raided while you are out; optional live defence. Current district only. v1.5 **presence rule**: reaching the Patch in time boosts the Sentry term by ×1.5 whatever happens in the brawl. The fight itself decides only the Verdict and Memory. |
| **Routed Evening** (v1.5) | The home evening after a loss: the clock jumped to Night, the street was closed, Mikan walked home. It opens with Haru's plaster beat, then free home play. Keystones play in their Late form, and Closings wait. |
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
| **Braggart** | Charges the biggest enemy | First hit on a leader adds Frazzle | Raid defence +; Patch +10% Tribute | Posse time / being benched | Goofball / Braggart | Loud; bolts and comes straight back after a flee |
| **Brooder** | Hangs back, avenges allies | Old Score doubled | Never leaves; slower decay | Long service (half-speed both ways) / being dismissed | Stalwart / Schemer | Grudge decays at half rate |
| **Schemer** | Flanks; hunts Ruffled/Frazzled | Bonus on Frazzled | The district forecast names the motive | Lessons / soft choices | Fraidy / Brooder | Ambushes; as Crew, Wavers below 35 |
| **Fraidy** | Keeps distance, supports | Perfect Skitter gives Pounce | Weak defence; raises the Caterwaul early | Never being Routed / being Routed | Stalwart / Braggart | Flees early; returns slowly |
| **Stalwart** | Guards Mikan, Braces (AI), holds ground | Allies within 3 m take less damage | Best raid defence | Fair play / a Scuffed or Lost night on its own post (v1.5) | Brooder / Schemer | Honourable; Nose-Touch gate +15 |
| **Goofball** | Plays; goes for props | Props it triggers hit harder | Laughs off a challenge: a challenger staking its Patch over-marks 0 (v1.5) | Share a Morsel counts double / being left at the Lot | everyone but Brooder / Brooder | Clowns about; easy to Nose-Touch (gate +10) |

**Social pairs.** A bonded pair in the Posse gets stronger Specials back to back in a chain; bonded cats posted in the same district gain +1 Loyalty per night. A clashing pair loses 1 Loyalty each per day when together.

**Shown, not listed.** Each personality has its own idle, walk, posture, bark intents, movement in a fight (circling, stalking, posturing; M1.1) and Team Pile-On flourish. A recruited Rival also keeps its Memory, Scars and Title, and its Nemesis **Strength becomes an always-on signature perk** (its Fear stays).

---

## 4. Yunagi: districts and Bosses (full-game framing)

| # | District | Character | Patches | Lv | Clowder (colour) | Boss | Lives |
|---|---|---|---|---|---|---|---|
| 1 | **Hidamari Lane** | Sunny lanes, garden walls, laundry poles, Haru's House | Den + 4 outer = 5 | 1–8 | Wall Sitters (light sage `#A8C878`) | **Daifuku**: enormous white-and-grey tom who never comes down off the walls (v1.5: his Boss-window patrol runs along wall tops). Bruiser. | L1 · L2 |
| 2 | **Akane Arcade** | Covered shopping street (fishmonger, croquette stall, awnings); at its top end, shrine steps, torii and stone lanterns that come alive at night | Den + 6 outer = 7 | 8–18 | Awning Gang (vermilion) | **Madam Sabi**: rust tortoiseshell matriarch. Yowler. **Oboro** (silent black Prowler) is her authored night Captain. | L3 · L4 |
| 3 | **Shiosai** | Fishing harbour below (nets, tetrapods, the net shed); hot-spring inns and stone stairs above | Den + 6 outer = 7 | 18–28 | Salt Paws (sea blue) | **Ikari**: one-eyed, salt-crusted brown tabby. Scrapper. | L5 · L6 |
| ★ | **The Lighthouse Summit** | Botan's seat above Shiosai; opens when Shiosai is claimed | 1 | 28–30 | Steam Court (white-violet) | **Botan**: Great Boss, a pampered long-haired white inn cat in a silk ribbon collar. A pet, like Mikan. Trickster. | L7 |

Bosses are authored personalities who use the nemesis trait and memory system; everything below Boss is procedural. **Claiming (v1.5, OR-09):**
- When Mikan's **influence** in a district reaches 100 (every outer Patch held at Strong), the **Boss window** opens and the Boss roams his three-stop patrol.
- Rout him at any stop, give any Verdict, then **Claim Spray the Den post**: the district is claimed.
- His departure re-tasks nobody: no gang cat is promoted and gang behaviour does not change.
- The Arcade and Shiosai (6 outer Patches each) re-tune the gate in Backlog.

Botan offers **only Nose-Touch**: at her Verdict the inn's hand-bell rings and she is called home.

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
- **Losing ends the day (v1.5, OR-01; the owner's C2):**
  - After a Posse wipe the clock jumps to **Night** (from any phase, before the cat flap too, staged as nightfall).
  - The street closes: no encounters, marking, pickups or Lot. Mikan's only action is to walk home along the Head Home thread (autopilot after 60 s).
  - Home is the **Routed Evening**: Haru's plaster beat, then free home play. Keystones play in their Late form, and Closings wait for the next morning.
  - No Well-Fed. 20% of the day's field haul is lost (none in Life 1). The Stash and Tribute are unaffected.
  - The victor gets Memory, a Title and its Gloat, and **no other cat changes**. A wipe stays dominated by Settle In in every currency.
- **Daily-reset budget: at most 3** — Share a Morsel, the home "What changed today?" find, Tribute pick-up.
- **Day budget** (75th percentile; hard cap 30 min in the slice, 35 later): wake → door ≤ 0.25 min (≤ 1.5 with a Keystone) · Doorstep ≤ 0.5 · Lot ≤ 1 · clock 12–16 · encounters 5–7 (4–6 fights) · way home ≤ 1 · evening ≤ 2.
- **Design weight per day:** ≈ 50% roaming and territory · 35% combat · 15% home.
- Suspend-on-quit anywhere; autosave each phase.

### 5.3 The Night Shuffle (canon order)

Every draw comes from a counter-based seeded substream `(save_seed, day_index, step, subsystem, cat_id, ordinal)`. Daytime outcome rolls are seeded per encounter, so reloads reproduce them.

1. **Crew:** Loyalty deltas; Sentry XP; Wavering flags.
2. **Territory:** Scent decay and refresh; challenger over-mark; flat upkeep; resolve the raid or challenge requested last night (forecast in today's Sniff); recompute influence and the Boss window.
3. **Nemesis:** betrayals (live from Life 2); town events (newcomers, feud scuffles); the challenger calendar and truce expiry; adaptation; Grudge and anger decay; the Declaration; tomorrow's raid requests (≤ 1 per district; challenger first). *(v1.5: comebacks, promotions, refills by existing cats, uprisings and Stewing are removed.)*
4. **Economy:** Tribute to the Doorstep (none in Life 8).
5. **Narrative:** next morning slot; Life-end check.

The **Morning Sniff** shows the Tribute line, tonight's raid forecast (always, when one is coming) and ≤ 3 nemesis items. Items are admitted only for cats with history with the player, or that touch the player's Patches or Crew. v1.5 card types: a challenger arrival (silhouette), the Boss window, Boss anger at Seething or Furious, Wavering, and arc-closing cards. **One priority order (v1.6):** Wavering > Declaration / arc closing > challenger > Boss window > anger > the arc lead > town events. **Night numbering (v1.6):** night *n* is the Night Shuffle that ends day *n*; its news is in day *n* + 1's Sniff.

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

**One Cat Schema:** `id, name, title, coat_seed, style, personality, level, xp, stats{nerve,bite,hide,voice,zip}, moves[4], knacks[2] (Backlog), zoomies, signature_strength, traits{strengths[],fears[],scars[]}, loyalty, grudge, regard, memory[], rank, former_rank, clowder, assignment, relations[] (v1.5), discovered (v1.5), old_gang_nerves (v1.5), anger (Bosses, v1.5), truce_until_day (v1.5)`. `personality`, `former_rank`, `relations`, `discovered`, `old_gang_nerves`, `anger` and `truce_until_day` are Nemesis-owned. `OLD_GANG(boss_id)` lives only in the recruit's `memory[]`.

| Doc (owner) | Owns | Does NOT own |
|---|---|---|
| **Combat** (combat designer) | Real-time rules; controls' actions; strings, Hop, Skitter, Brace, Hiss; Pounce Gauge, Slow Blink, Ruffled/Frazzle, Tag-In/Relay, Zoomies, Pile-On; **all Move and Zoomies definitions and numbers**; the Style matchup chart; damage and heal formulas; the 3 statuses; Posse AI per personality (combat column); enemy AI; encounters; Critters; **the game-feel/VFX tier table**; difficulty modes; which events show lettered onomatopoeia | Learnsets; stat curves; Rival trait selection; Morsel rewards |
| **Nemesis** (nemesis/AI) | Rival generation, including **personality** and `former_rank`; roles and Rivals-board data; **relationships and tags, discovery**; Memory, Grudge, Regard, Titles, Scars, Strengths, Fears; **recruit availability**; Verdict rules (three); **Old Gang Nerves, Boss anger, truces and the join-in roll**; **the challenger calendar, newcomers and town events**; Night Shuffle step 3, Ambush injection, betrayal events; bark trigger taxonomy and grammar (G8: own history only); Boss trait kits and patrol placement | Combat values of traits and statuses; raid maths; influence; the Loyalty formula; the writing voice |
| **Territory & Economy** | Patches, Scent, Spraying, claiming ("fight to clear, spray to claim"), **influence and the Boss window** (a place-and-schedule gate), Sentry/Warden rules and the guard column of personality, raid and challenge resolution (step 2), the challenger over-mark, Caterwauls and the presence rule; Tribute and every Morsel/Shiny source, sink and **price** (one price sheet); the Clout table, Crew cap and Sentry slots; the Stash; the Turf Board rules; Life 8 territory numbers | Which Rival raids or challenges; stat curves; Move data |
| **Crew & Progression** | Stat and XP curves; Power Rating; the **Bribe** and **starting Loyalty**; the **Loyalty formula** and the personality loyalty/social columns; learnsets, Lessons, slot rules, Mikan's cross-Style rule; Tail-Up; full-Crew "make room"; Mikan's ageing; the heir | Move numbers; betrayal logic; prices |
| **Narrative** (narrative director) | The nine Lives' beats and gates; vignettes; montages; household characters; Bond's fiction and home verbs; the daily home find; Boss personalities; the cat writing voice and bark lines; Sense Icons; **Life 8 end to end (§9 of the DSP doc)**; epilogue | Bond's numeric effects; bark triggers |
| **Art** | Art bible; toon shader and outlines; character design and coat generator; **six personality animation sets**; district palettes; environment method (after look-dev); VFX drawings for the tier table; **lettering sets and the localisation brief**; Scribble; Scar/Title kits; Whisker Sense look; deaf/HoH visual carriers | Gameplay timings |
| **Audio** | Music and the Call system; instruments and Murmur; cat vocals and the **8 bark intents** per voice body; combat mix per the tier table; adaptive music; scent sonification | Story beats |
| **UX** | HUD, Slow Blink menu, **Rivals board**, Morning Sniff, Lot and **unified** Turf Board screens, Verdict prompt (three cards), the **control map**, onboarding beat sheet, accessibility | System rules |
| **Day loop** (game-designer, `design/gdd/day-loop.md`) | Clock implementation, day budget and playtest test, Head Home and fast travel, Caterwaul reach, daily-reset audit, encounter density, save/suspend, **the loss time-skip to Night and the closed street** | Phase lengths and Life rules (this brief) |
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
| `VerdictApplied` | Nemesis | rival_id, verdict ∈ {chase, recruit, nose} (v1.5), slipped_away_ids[] | Territory, Crew, Economy, UX |
| `TownEvent` (v1.5; replaces `RivalRankChanged` / `WallEvent`) | Nemesis | kind ∈ {newcomer, feud_scuffle}, cat_ids, patch_id? | UX, Territory, Narrative |
| `RaidRequested` | Nemesis | attacker_ids[], patch_id, motive ∈ {grudge, gang_orders, gloat, challenge} (v1.5), night (= tomorrow) | Territory, UX (forecast) |
| `RaidResolved` | Territory | patch_id, outcome, sentries_routed[], presence (v1.5) | Nemesis, UX |
| `BetrayalTriggered` | Nemesis | crew_id, patch_id (reachable from Life 2, v1.5) | Crew, Territory, UX |
| `CatDiscovered` (v1.5) | Nemesis | cat_id, how ∈ {encounter, sniff, crew} | UX, Audio |
| `InfluenceChanged` (v1.5) | Territory | district_id, by_clowder{} | UX, Audio |
| `BossWindowChanged` (v1.5) | Territory | district_id, open | Nemesis (patrol placement), UX, Audio |
| `AngerChanged` (v1.5) | Nemesis | boss_id, stage | UX, Audio, Combat (read at fight start) |
| `ChallengerArrived` (v1.5) | Nemesis | cat_id, district_id, patch_id, origin ∈ {calendar, truce_end} | Territory, UX, Audio |
| `AllyJoined` (v1.5) | Nemesis | cat_id, encounter_id | Combat, UX, Audio |
| `MarkApplied` (v1.6) | Territory | patch_id, district_id, kind ∈ {over_mark, counter_spray, claim_spray, rescue_spray}, target_clowder | Nemesis (Boss anger; the Nose-Touch quiet-take count), Audio |
| `PatchChanged` | Territory | patch_id, old_clowder, new_clowder, scent | Nemesis, Economy, Art, Audio |
| `DistrictClaimed` | Territory | district_id | Narrative, Nemesis, Economy |
| `TributeDelivered` | Economy | amount, by_district | UX, Narrative |
| `HomeArrived` | Day loop | kind (on_time / late / routed) | Narrative, Audio |
| `KeystonePlayed` | Narrative | keystone_id, life, slot | Audio, UX, Nemesis (routine tags) |
| `FoodPickedUp` / `CarryDelivered` | Territory / Narrative | source_kind, patch_id / carry_index | Narrative, Combat (escort), Audio (Life 8, Backlog) |
| `PhaseChanged` / `DayEnded` / `LifeAdvanced` | Clock | phase, day_index, life_index | Everyone |
| `BondChanged` | Narrative | bond (0–10) | Combat (Well-Fed), UX |

**Queries:** Combat asks Nemesis for a `RivalCombatProfile` (level, style, personality, moves, strengths, fears, title, scars; v1.5: + `anger_stage`; for Crew cats `old_gang_nerves`, `old_boss_id` (from its own Memory), `kin_ids`). Territory and Nemesis ask Crew for `PowerRating(cat_id)` and `Loyalty(cat_id)`.

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

**Nemesis (Pillar 4).** Mordor's skeleton, re-reasoned for cats and **kept clear of the patent family's core** (v1.5): what Mikan does to one cat changes that cat, territory, or the calendar, never a different cat. **Nobody dies**: a fled or spared cat comes back; a Chased-Off cat is gone for good, and new faces arrive as newcomers and challengers.

| Verdict (v1.5: three) | The cat | The post |
|---|---|---|
| **Recruit** | Joins with full Memory, its personality and its signature perk, for a Bribe. Its own Memory gains `OLD_GANG`, and it may flinch at the sight of its old boss | Cleared → Claim Spray |
| **Chase Off** | **Gone for good**; a legend card on the Rivals board | Cleared → Claim Spray |
| **Nose-Touch** | Gated by its own pending Grudge and, from Life 2, by a quiet take (v1.6). Steps down into a 10-day truce; may join Mikan's fights against its own Rival; a Friend at Regard ≥ 75, otherwise a challenger when the truce ends | Cleared → Claim Spray |

- **Memory is visible and audible early:** the First Thorn returns inside Life 1 (his day-1 flee cannot be interrupted); silhouette Scars read in play; memory lines play at the Standoff, or at the Rout after an Ambush; Lick In; the victor reads Mikan's plaster after a loss; a personal 2-bar yowl-sting per Rival. **Cats speak only from their own history.**
- **Cats hold a town in common:** the **Rivals board** shows every cat in town (silhouettes until discovered) and its relationships; town events, newcomers and challengers change it overnight. There is no ladder and no promotions.
- **The Boss is a presence before he is a fight:** his anger rises as you mark his district loudly. He comes down off his wall only when your influence is full.
- **The Crew is inside the system:** posted cats build grudges with raiders, neglect breeds Wavering, and from Life 2 a neglected ex-Rival on a post can turn and take the Patch it guarded.
- **Personality ties the halves together:** the Braggart who taunted you on the wall is the Braggart who charges first in your Posse, makes his Patch pay, and stares his old boss down rather than flinching.

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
| Grudge | Decays −2 per quiet night (Brooder −1). Per-encounter cap 35, then 20. (Humble and Restless removed, v1.5) |
| Loyalty tiers | **Shifty 0–29 · Aloof 30–44 · Steady 45–59 · True 60–79 · Sworn 80–100**. Teach at Steady+; Warden at True+. **Betrayal (live from Life 2, v1.5): only a posted ex-Rival recruit at < 30 (Schemer < 35) → Wavering (2 warning mornings) → Turncoat on the 3rd night, taking the Patch it guards** (never Home Ground or the Den). Release at ≥ 60 = clean parting; below 60 = Gone |
| Influence (v1.5) | Per district, 0–100, derived from Scent: each outer Patch at Strong is worth `100 / n_outer` (the Lane: 25). Full = 100 opens the Boss window; it closes below 75 at step 2 |
| Boss anger (v1.5) | 0–100, Bosses only; Over-mark +5, Counter-Spray +15, never fights; −15 a night. Riled 30 / Seething 60 / Furious 90 → Fired Up for 20 s / 40 s / the whole fight; reset by a win, loss or `rival_fled` (not Scram) |
| Nose-Touch (v1.5) | Gate: pending Grudge < 50 + shift (Stalwart +15, Goofball +10, Fraidy +5, Schemer 0, Brooder −5, Braggart −5) **and, from Life 2, not a loud take** (≥ 2 Counter-Sprays on its own post; a Boss at Seething+) (v1.6). Truce **10 days**. Join-in p = 0.35 (+0.15 near its old Patch, +0.15 at Regard ≥ 75), cap 0.65; ≤ 1 per encounter, ≤ 1 per cat per day |
| Old Gang Nerves (v1.5) | Cowed 20 s (Fraidy 30 s) at the sight of the Old Boss; cleared by a Tag-In. Resist: Braggart, Stalwart, Brooder, Sworn |
| Challengers (v1.5) | First on the 2nd night after Mikan first holds ≥ 3 Patches in a district (slice: night 5, announced in the L2D4 Sniff), then every 4th night (skipped if one is active); ≤ 1 active per district; over-mark −10 a night (Goofball post 0); takes the raid slot (`challenge`); Repelled twice → it leaves |
| Starting Loyalty | `clamp(5, 80, 50 − 0.4·Grudge_before_halving + 0.3·Regard + personality_mod + 5·bribe_step − 20·returned)` |
| Day | 4 phases × 4 min = **16 min** roaming. Session ≈ 20–25 min (slice), ≤ 35 (late game) |
| Playtime | Main story **12–15 h** (≈ 26–32 in-game days); thorough ≈ 20 h. **Slice ≈ 2–2.5 h** |
| Economy | Tribute/day ≈ 60 at end of Life 2 (later anchors Backlog). Lessons: Rank I 40 · II 120 · III 300 · IV 600, ×1.5 cross-Style. Bribe fair = 8 × level × (Stray 0.75 / Tough 1 / Captain 2 / Boss 4); feast 2×; from the Stash. Share a Morsel = Σ Crew levels. Shinies ≈ 50 |
| Bond / Well-Fed | 0–10 hearts. **Well-Fed:** next day, Zoomies starts at 5% per heart (max 50%) and every Posse cat starts each fight with ¼ Paw |
| Loss | **The day ends (v1.5):** the clock jumps to Night, the street closes, and Mikan walks home to the Routed Evening; no Well-Fed; 20% of the day's field haul is lost (none in Life 1); the Stash and Tribute are safe; the victor gets Memory, a Title and its Gloat only |
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
- **Nemesis:** the three Verdicts, the Gloat, Lick In, town events, the **Rivals board** (with relationship tags and discovery), Old Gang Nerves, Daifuku's anger, Nose-Touch join-ins.
- **Territory:** 2 Sentry slots; **influence and the Boss window** (Daifuku's three-stop patrol; the window opens on Life 2 day 3 on the reference path); **one forecast raid every night** from the first (requested night 3, forecast in the Life 2 day 2 Sniff, fires that Night as the Caterwaul; afterwards ≤ 1 per district per night whenever an admissible target exists, Strong Patches included, worst case Scuffed); **≈ 1 challenger** (announced on Life 2 day 4); the unified Turf Board; Tribute, Lessons I–II, Bribes, Share a Morsel.
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
9. The nemesis patent family (US 10,926,179; 11,660,540; 12,201,908; pending 2025/0108303). Mitigated by the v1.5 rule (no change ever lands on a second cat because of Mikan's dealings with a first) and the guardrails in `design/legal/nemesis-patent-analysis.md` v2 §5. Still needs qualified counsel review before scope lock and any public showing.

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
11. **IP review** of the nemesis system and a **cultural consultant** for the home rituals (defaults: commission both before public showing / before slice home content is final). v1.5: counsel now has the full claim text (`design/legal/claims/`).
12. ~~**Nose-Touch truce length**~~ Settled by the owner 2026-11-24: **10 in-game days**.
13. ~~**Chase Off is final even for Togemaru**~~ Settled by the owner 2026-11-24: final for everyone. His arc closes with an ending of its own (v1.6), and no other cat is named in his place.
14. ~~**The old boss's targeted trash-talk at a recruit**~~ Settled by the owner 2026-11-24: the recruit's own flinch now; counsel to say whether a line-only boss taunt can return.
15. ~~**Recruit betrayal in the slice**~~ Settled by the owner 2026-11-24: on (rare).
16. ~~**Full influence = all outer Patches Strong at once**~~ Settled by the owner 2026-11-24: yes.

*Settled by the user on 2026-11-24:* engine (Unreal Engine 5.8); title ("Cat RPG", final); art style (reference-close on the visuals, not the 3C).

*Settled by the user on 2026-11-23:* slice-first target; simplified FF7R-structure combat; personality as the Crew hook; third-person camera; the tight three-district game; readable cat speech; readable, localised combat onomatopoeia.

---

## Changelog

- **Owner combat direction M1.1 (2026-11-24)** — glossary and pillar amendment to v1.6, from the owner's C10 and `design/reviews/owner-feedback/combat-m1.1-spec.md` (final bindings: F = Special on a staggered enemy, R = skill bar, Tab = lock-on cycle):
  - **Pillar 3** renamed **Command the Brawl** (skill bar + Special chain) (§2).
  - **Glossary (§3.3, §3.5):** player controls Mikan only (new Control row); Light/Heavy strings with the L-L-L-H finisher and the responsiveness rules; Dodge · Dash (Hop and Brace leave the player's verbs); Lock-on; Hiss on the skill bar; Slow Blink becomes the **skill bar**; **Tag-In / Relay removed**; **Zoomies folded into the Special**; new Special chain, Attack tokens and **Team Pile-On** (replaces the Pile-On; Full Burst resemblance on the counsel checklist); stagger presentation on Frazzle; Old Gang Nerves cleared by a skill-bar command; Stalwart, social pairs and personality flourish rows.
  - **Not yet amended** (outside this pass): §4.1 camera canon, §5.1 loops, §6 ownership and `TagIn` event, §7, §8 numeric frame, §10 scope; `combat-system.md` §3.1 and the spec win where they differ.

- **v1.6 (2026-11-24, consistency pass)** — Records `design/reviews/owner-feedback/consistency-pass.md` (rulings F1–F12), the last pass before the docs are compiled:
  - **Togemaru's arc (F11):** every Verdict on him is a complete ending (Chase Off = gone with a farewell; Recruit = he joins; Nose-Touch = a truce his greeting and join-ins carry); his first Rout always scars; a truce greeting counts as an encounter, so a Nose-Touched lead is declared on night 3 (§3.1).
  - **Nose-Touch gate (F12):** from Life 2 a loud take closes it (≥ 2 Counter-Sprays on the Keeper's own post, or a Boss at Seething+), so the three-way Verdict is a real choice (§3.3, §7, §8).
  - **Bribe (F1):** free in Life 1, then fair or feast only (§3.3).
  - **`MarkApplied` (F8)** added to the event contracts (§6.1).
  - **Days (F3, F7):** night *n* ends day *n*; the first challenger arrives on night 5 (the L2D4 Sniff); the Boss window's reference day is L2D3, at the Tofu Shop Step Claim Spray, with the first fight on L2D4 (§3.2, §5.3, §8, §10).
  - **Sniff priority** made one order (§5.3). **The Usurper** (the owner's "new boss may appear") written as a full-game rule (§3.1). Goofball's Rival cell reads "easy to Nose-Touch", matching its gate. Open questions 12–16 marked settled by the owner's answers (§11).
- **v1.5 (2026-11-24, owner feedback C1–C5)** — Folds in `design/reviews/owner-feedback-rulings.md` (OR-01…OR-21). These are the owner's preview-gallery comments, ruled under the full-claim patent note v2 (`design/legal/nemesis-patent-analysis.md`, `design/legal/claims/`).
  - **Patent rule for all departments** (header): no change ever lands on a second cat because of Mikan's dealings with a first. Changes land on that cat, on territory and objects, on the calendar, or on new cats. Cats speak only from their own history.
  - **Loss (C2):** the day ends. The clock jumps to Night, the street closes, and Mikan walks home to the Routed Evening. No promotion, Mark Over or Snatch (§3.3, §5.2, §8).
  - **Rivals board (C1)** replaces the Fence Line: every cat in town, silhouettes until discovered, relationship tags (Boss/Gang, Rival, Kin, Old Boss/Old Gang), no rank ladder. Plus **Old Gang Nerves** (recruit-side only) and **Boss anger** (marking acts only; Fired Up spent after a real fight) (§3.1–3.3, §8).
  - **Influence (C3)**, derived from Scent, moves only through territory acts. At full influence the **Boss window** opens: Daifuku roams a three-stop patrol, replacing the Den gate. "Fight to clear, spray to claim"; the Caterwaul presence rule. **Betrayal** is live from Life 2 for posted ex-Rivals (§3.2, §3.3, §4, §8).
  - **Verdict (C4)**: three options. Humble is removed. Chase Off = Gone. Nose-Touch is gated, with a 10-day truce and join-ins against the cat's own Rival. Goofball and Stalwart cells updated. The arc lead (Togemaru) is fixed and never re-named. Recruit is open on the Nemesis (§3.1, §3.3, §3.5, §7).
  - **Challengers and the unified Turf Board (C5)**: newcomers on a fixed calendar take the raid slot (`challenge`). A four-zone Turf Board with one decision a day (§3.1–3.3, §8).
  - **Roles, not seats:** no promotions; town events (newcomer, feud scuffle) replace wall events; Stewing cut; `pretender` → `challenge`, `boss_orders` → `gang_orders` (§3.1, §3.3, §5.3).
  - **Events:** `TownEvent`, `CatDiscovered`, `InfluenceChanged`, `BossWindowChanged`, `AngerChanged`, `ChallengerArrived`, `AllyJoined`. `VerdictApplied` takes {chase, recruit, nose} (§6, §6.1).
  - **Scope (§10):** the slice gains the Rivals board, influence, the Boss window and ≈ 1 challenger. Open questions 12–16 added (§11).
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

- **Owner change (2026-11-24, C8):** Mikan now has a **long tail** (replaces the bobtail with round pom). Face: round, fat-cheeked front view; flat cat profile with a short muzzle (no snout). See `design/reviews/user-comments-2026-11-24.md` C8 and `design/reviews/refs/`.

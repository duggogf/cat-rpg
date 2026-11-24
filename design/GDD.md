# Cat RPG — Game Design Document (Vertical Slice)

| | |
|---|---|
| **Title** | "Cat RPG" (final; user decision 2026-11-24) |
| **Engine** | Unreal Engine 5.8 (user decision 2026-11-24) |
| **Version** | 1.2 · 2026-11-24 · compiled by the producer with the technical director; 1.2 folds in the owner's comments C1–C6 (changelog at the end) |
| **Status** | Design final for the slice; ready to prototype. **Counsel review of Rivals still blocks scope lock and any public showing** (§19–20) |
| **Canon order** | Owner comments [`user-comments-2026-11-24.md`](reviews/user-comments-2026-11-24.md) (C1–C6) → [`owner-feedback-rulings.md`](reviews/owner-feedback-rulings.md) (OR-01…OR-21; owner answers §5) → [`consistency-pass.md`](reviews/owner-feedback/consistency-pass.md) (F1–F12) → [`creative-brief.md`](creative-brief.md) v1.6 → [`director-rulings.md`](reviews/round-1/director-rulings.md) (DR-xx) → round-2 R1–R5 → system docs. If this GDD and a source disagree, the source wins |

Read this once to know the game, the slice and how the systems fit; each section links its full spec. Mock-up frames: [`previews/`](previews/) (06 now shows the Rivals board, 07 the three-card Verdict, 08 the unified Turf Board).

> **Patent working rule (every department).** Nothing Mikan does to one cat, and nothing that cat becomes because of it, may change a **different** cat. A change may land on the cat Mikan dealt with, on territory and objects, on the calendar, or on newly generated cats. Cats speak only from their own history. Source: [`legal/nemesis-patent-analysis.md`](legal/nemesis-patent-analysis.md) v2 §5 (guardrails G1–G12). This is design distance, not clearance.

> **Superseded facts.** [`gdd/game-concept.md`](gdd/game-concept.md) and [`gdd/game-pillars.md`](gdd/game-pillars.md) predate the rulings; where they disagree **the brief wins** (third-person camera; 3 districts + the Summit, 20 Patches; level cap 30; 12–15 h; home beats gated by day count; a ≈ 20–25 min day).

---

## 1. One-page summary

**High concept.** A 3D third-person action RPG. You are **Mikan**, a ginger-and-white bobtail house cat in **Yunagi**, a Showa-nostalgic Japanese seaside hill town. You spray, brawl, recruit and tax your way from one garden wall to **Great Boss** of the town, leading a four-cat **Posse** in stylised real-time fights against **Rivals** who remember what you did to them. Every morning and evening you go home, where your human, **Haru**, lives a whole life you witness but cannot understand in words: school, leaving, love, a wedding, a baby, and then a door that stops opening.

**The fantasy: *Boss outside, pet at home.*** A ruthless little alley tyrant who still comes running when one particular human sings three notes.

**USP: Dual Story Progression.** Every in-game day advances both stories on one clock. The human story has no intelligible word, ever: only staging, objects, colour, light, music and wordless **Murmur**, seen from 30–60 cm off the floor. In Life 8 the food tax you extorted all game becomes food you carry home to a grieving family.

**Key features.**
- **Conduct the brawl:** FF7 Remake's structure, Pokémon's roster, a cat's verbs. Switch between four cats, time **Tag-Ins** into **Relays**, stagger with **Frazzle**, finish with the **Pile-On**. **You can lose:** a wipe ends the day, the clock jumps to Night and Mikan walks home to Haru's sticking plaster. No game over.
- **Rivals remember:** every unique cat sits on the **Rivals board**, each gang staged as an alley scene, silhouetted until you **discover** it; hover one to see its ties. Cats keep a Memory of you, wear the **Scars** you gave them, earn Titles for beating you. Every win ends in one of **three Verdicts**: **Recruit** (for a Bribe), **Chase Off** (gone for good) or **Nose-Touch** (a truce; it may later fight beside you against its own Rival).
- **Six personalities** drive how a cat fights, guards, stays loyal, gets along, flinches at its old boss and behaves as a Rival.
- **Territory that never stays won:** fight to clear, **spray to claim**; fill your **district influence** until the Boss comes down off his wall to be challenged; post Sentries against forecast raids and **challengers** new in town; collect **Tribute** as a pile of fish on Haru's Doorstep. Neglected influence fades.
- **The house:** a daily sniff-out, a piano to walk on, and vignettes that make you care about one person.

**Audience:** 16–40; action-RPG players who also buy emotional indies; cat people. PEGI 7–12 / ESRB E10+. Solo, premium, offline. **Platforms:** PC (Steam) lead, controller-first with full KB/M, 60 fps; a handheld second at 30 fps (floor OPEN). No phone or touch layout. **Engine:** Unreal Engine 5.8.

**References** (structure and feel, never components): *Final Fantasy VII Remake* (combat structure, slow-mo commands, stagger) · *Pokémon* (recruit, teach, swap) · *Shadow of Mordor* (remembering enemies, a roster screen) · *Shin chan: Shiro and the Coal Town* (the look, matched closely; never its characters, names, places, assets or 3C) · *Stray* (cat scale) · *Yakuza* (turf melodrama played straight and funny).

**Why it stands out.** Combat and Rivals carry the word of mouth ("the cat I let off with a nose-touch came yowling over the laundry poles to help me, then we knocked the Boss off his wall into a bucket"); the wordless home story is why people remember it; territory carries half the play time.

---

## 2. Pillars

Full text: [`gdd/game-pillars.md`](gdd/game-pillars.md).

| # | Pillar | Test |
|---|---|---|
| 1 | **Cat's-Eye Truth** | If a cat could not perceive, want or do it, it is not in the game. No intelligible human language, ever |
| 2 | **Two Lives, One Clock** | Every day advances both Mikan's turf and Haru's life; home is mechanically and emotionally unavoidable |
| 3 | **Conduct the Brawl** | Short, loud, readable cartoon brawls where you command four cats; feel beats simulation |
| 4 | **Rivals Remember** | Every named cat carries visible history with you; no Rival fight is anonymous or consequence-free |

Conflicts resolve in table order. **Anti-pillars:** no survival meters; not collect-them-all; not dialogue-driven; not grimdark (nobody dies on the streets); no time-pressure fail states (a lost fight ends the day, never the game); no multiplayer or live service. **Tone:** scratches, dust clouds and sticking plasters, never blood; the streets a comedy of status, the house a quiet drama. The ending is sad, then warm.

---

## 3. The full game in brief (framing only)

| District | Patches | Levels | Boss | Lives |
|---|---|---|---|---|
| **Hidamari Lane** (garden walls, laundry poles, Haru's House) | 5 | 1–8 | **Daifuku**, enormous white-and-grey Brooder Bruiser who never comes down off the walls until the Lane smells of you | 1–2 |
| **Akane Arcade** (covered shopping street; shrine steps at night) | 7 | 8–18 | **Madam Sabi**, tortoiseshell Yowler (night Captain Oboro) | 3–4 |
| **Shiosai** (harbour, hot-spring inns) | 7 | 18–28 | **Ikari**, one-eyed salt-crusted Scrapper | 5–6 |
| **Lighthouse Summit** | 1 | 28–30 | **Botan**, Great Boss: a pampered inn cat in a silk collar, a pet like Mikan (Nose-Touch only; the hand-bell calls her home) | 7 |

A Life is a story chapter, not a retry counter. **Home beats are gated by day count only; conquest moves the years, not the days.** A Life ends at the first sleep after its turf goal, its minimum days and its Closing vignette; a wordless montage follows.

| Life | Name | Haru | What Mikan sees at home | Turf goal | Mikan |
|---|---|---|---|---|---|
| 1 | **The Box in the Rain** | 16 | A wet box; yellow raincoat; the bell collar; Gran's disapproval melting; the first Call | Hold 1 Patch | Kitten |
| 2 | **Uniform** | 17–18 | School bag, study lamp, the cat flap, the envelope | Claim the Lane | Young adult |
| 3 | **The Empty Room** | 18–22 | Suitcase; her room goes still; Gran feeds you | 4 Arcade outer Patches | Adult |
| 4 | **Two Pairs of Shoes** | 23–25 | Work clothes; Sora's shoes; the lap war | Claim the Arcade | Adult |
| 5 | **White Day** | 26 | Black shoes (Gran's death); boxes; a white dress | 4 Shiosai outer Patches | Prime |
| 6 | **The Small Loud One** | 28 | A belly, then Koharu; Mikan displaced, then on guard | Claim Shiosai | Prime |
| 7 | **The Long Summer** | 31 | The happiest house in town | Rout Botan; Great Boss | Greying |
| 8 | **The Door** | — | Haru does not come home. Mikan waits | Three Food Carries | Old |
| 9 | **Nine** | Koharu 8 | Koharu fills the bowl and sings the Call | Name an heir; one last walk | Elder |

**Life 8:** the Call stops coming; Mikan waits, then carries food home three times (no food enters the house before). **Full game:** 12–15 h, ≈ 50 Moves, 5 Styles, ≈ 58 vignettes. **Never cut:** the dual story, the nemesis memory loop, Tag-In, the Pile-On, personality.

---

## 4. The vertical slice

Lives 1–2 in Hidamari Lane: Mikan arrives as a kitten in the rain and becomes Boss of the Lane the week Haru's envelope arrives. The Life ends at the first sleep after the Lane is **claimed** (the Den post Claim Sprayed): Mikan asleep in Haru's empty suitcase, then the title card.

| Scope | Slice |
|---|---|
| **Lives / days** | 1–2 · 6–7 in-game days |
| **Places** | Hidamari Lane; Haru's House; the Lot; 4 Sunspots |
| **Patches** | 5: Low Wall Corner (Home Ground), Laundry Pole Yard, Persimmon Alley, Tofu Shop Step, the Den. 2 Sentry slots |
| **Rivals** | ≤ 12 tracked: the Wall Sitters (Daifuku, 2 Captains, 5 Toughs incl. the First Thorn; roles fixed at generation, no seats) + 2 Roamers, plus newcomers and **≈ 1 challenger** from the calendar. Crows are the only Critter |
| **Crew** | Mikan + 6 recruitable, one per personality. Cap 6 |
| **Moves** | 3 Styles, **12 Moves**, 3 Zoomies, 3 Fears; Daifuku in 3 phases on any of his three patrol stops |
| **Rivals system** | The **Rivals board** (staged gang scenes, discovery, relationship tags), three Verdicts, Gloat, Lick In, town events, **Old Gang Nerves**, **Boss anger**, Nose-Touch **join-ins**, exactly one declared Nemesis |
| **Territory** | Scent, marking, **district influence and the Boss window**, Tribute, one forecast raid a night from L2D2, the Caterwaul (presence rule), the first challenger (night 5), rare recruit betrayal, the unified **Turf Board**, Lessons I–II, Bribes, Share a Morsel |
| **Vignettes** | **11** (7 Keystones, 3 Textures, 1 montage) + the Routine layer, the Routed Evening, daily find, piano |
| **Audio** | ≤ 25 min music; ≤ 240 bark lines |
| **Minutes** | ≈ 2–2.5 h (reference path **143.5 min**; fast path ≈ 128) |

**Questions:** Is conducting fun? Do players care about a Rival and about Haru within two hours? Is territory fun? Does a day fit ≈ 25 min? Is the Verdict a real choice? **Pass/fail tests:** two cats and a Pile-On by minute 15; a memory-citing Rival line before minute 60 (≈ 0:28); ≥ 80% name a Rival and something specific Haru does; no Verdict > 60% of Verdicts and ≥ 70% of testers use ≥ 2; ≥ 80% open the Rivals board on L2D1 and ≥ 60% name one tie; Keystone facts reach 90% of testers with audio muted; the flash test passes.

---

## 5. Day loop

*Owner: game-designer · [`gdd/day-loop.md`](gdd/day-loop.md)*

**Fantasy.** A cat's day, not a shift. Wake, check the pile on the step, nod to your crew, go out. Then the light turns gold, a chime rolls up the hill, a voice sings three notes, and you *want* to go home.

**Rules.**
- **Wake → Doorstep → the Lot → street (Morning, Day, Dusk, Night) → home → evening → sleep → Night Shuffle.** The roaming clock is **4 phases × 4 real minutes**, running only while roaming; the **phase dial** is the only clock. Night opens with the cat flap on L2D2.
- At **Dusk** the chime sounds, the **Call** answers, and a bell-gold **Head Home** thread appears (≤ 60 s from anywhere); after 60 s of drowsiness it walks Mikan home. **Curfew trade:** home by Dusk = the evening, Bond and **Well-Fed**; out all Night = Night Rivals, Shinies, Clout. Neither is punished.
- **Losing a fight ends the day (OR-01, C2).** A loss is a Posse wipe (Scram and a fleeing Rival are not). After the victor's Gloat the clock jumps to **Night** from any phase (before the cat flap, a staged moon-blue nightfall). **The street closes:** nothing works but the Head Home thread (autopilot after 60 s) and the read-only Rivals board. Home is the **Routed Evening** (§11). **Costs:** no Well-Fed, Bond as `late`, the Night forfeit, 20% of the day's field haul (none in Life 1). The Stash and Tribute are safe and **a loss changes no territory**; overnight runs as normal. Tutorial fights can't be lost; no loss is ever scripted. Settle In dominates a deliberate wipe in every currency.
- **Exactly three once-a-day actions:** the automatic Tribute pick-up, Share a Morsel, and the home "what changed today?" find.
- Sunspot nap: ≈ 15 s, skips half a phase, fully heals the Posse. Suspend anywhere; autosave each phase, after every Verdict and at the loss jump.
- **Encounter density:** ≥ 2 engageable encounters within 30 s in every phase; 4–6 fights a day. A staking challenger and the roaming Boss each count as one optional encounter. Life 2: ≤ 1 Rival Ambush a day.

**Numbers.** Budget (75th percentile): wake → door ≤ 0.25 min · Doorstep ≤ 0.5 · Lot ≤ 1 (1.5–2 on first-use days) · roaming 12/16 · encounters 5–7 · way home ≤ 1 · evening ≤ 2 · **total ≈ 20–25, hard cap 30**.

**Worked example: L2D3 (24 min, the longest).** Sniff forecasts a raid; at the Lot, post a Sentry, buy a Lesson, Share. Spray a faint post, Ambush two Toughs, take Tofu Shop Step from Kagi with the first Zoomies. **The Claim Spray fills the influence bar: Daifuku's yowl rolls down and he climbs to his Day stop, in view, on the running clock** (fighting him today is optional). Dusk chimes with **no Call**: Haru is late; Night falls; a `late` arrival, then *The Lamp at Night*. **The loss branch, L2D4 (15.5 min; budgeted, never scripted):** the first Daifuku attempt, Fired Up; a wipe → nightfall, the walk home, the plaster. The window survives; the L2D5 rematch meets him Calm and plastered.

**Connects to.** Pauses on encounter events; banks the haul at `HomeArrived(on_time / late / routed)`; runs the overnight steps (§16); sequences influence, anger and the window across the day.

---

## 6. Character, camera, controls (3C)

*Owners: technical-artist (camera), UX (map), Combat (actions) · [`gdd/camera-system.md`](gdd/camera-system.md), [`ux/hud.md`](ux/hud.md) §8*

**Character.** Mikan is a fixed design: white body, ginger cap over both ears, ginger patch over the left eye, pom-pom bobtail, amber eyes, **red collar with one brass bell**. Renameable, "they". Scrapper Style; no personality, no Loyalty. One global cat scale, **1.25× a real cat (≈ 0.56 m)**; humans and furniture true scale. Traversal: ground plus the **High Road** (walls, fences, roofs) as third-person platforming.

**Camera.** One rig behind and above the cat, everywhere, with no scene transitions. *Small cat, big town* when exploring; the *conductor's seat* in a fight; *you are the pet* at home.

| State | Distance / height / pitch | Notes |
|---|---|---|
| Explore | 3.0 m / ≈ 1.0 m / +10° | Orbit; auto-recentre after 1.5 s |
| Combat | 6.0–7.2 m / ≈ 3 m / +25° | Frames the controlled cat (lower third) and its lock target; soft lock; edge arrows |
| Slow Blink | 8.5 m / 6.5 m / +50° | Tactical three-quarter |
| Home | 1.8 m / 0.3–0.6 m / ≤ 0° | Standing adults' faces clamped out within 2.5 m |

The garden wall blends Explore → Home in 1.0 s (no cut). Tag-Ins retarget in 0.3 s, so a Relay reads as one move. Camera only plays Combat's shake. Options: FOV, speed, auto-centre, invert, motion comfort.

**Control map** (DR-08, full table in [`ux/hud.md`](ux/hud.md) §8; all remappable; every hold has a toggle, every chord a one-button option). **Pad:** West Swat / **Attack** (3-hit string; from the air or the High Road = **Pounce**) · South Hop · East Dash / **Skitter** · North Interact (Spray, Sniff, Nap) / **Hiss**, **Pile-On** · R1 **Brace** · R2 **Whisker Sense** (1 s on a cat within 10 m discovers it) / **Slow Blink** · L2 Stalk · L1 + face Moves 1–4, L1 + R1 **Zoomies** · D-pad Tail-Up, Meow, Sit (hold = **Head Home**) / switch cats (timed = **Tag-In**) · View **Rivals** board · Menu Pause. **KB/M:** WASD + mouse, LMB, RMB, Space, Shift, E, F, Tab, Ctrl, 1–4, R, Z X C V, V/T/C/H, **J Rivals**, Esc (Pause ▸ Rivals on the street and at the Lot, never at home).

---

## 7. Combat

*Owner: combat designer · [`gdd/combat-system.md`](gdd/combat-system.md) · frames [`02`](previews/02-combat-clash.png), [`03`](previews/03-combat-slow-blink.png), [`04`](previews/04-combat-pile-on.png)*

**Fantasy.** *"I'm the boss of a gang of very different cats, and I'm conducting a brawl."* Slapstick at maximum, but every big effect answers something you did or ordered.

**Rules.**
- **No random encounters, no scene change, no combat inside Haru's wall.** A ≈ 10 m ring forms around visible opponents.
- You drive one Posse cat and switch instantly. Each has **one 3-hit string**, **Hop**, **Skitter** (≈ 200 ms invulnerable), **Brace** and **Hiss** (interrupts yellow; a Tough at ≤ 15% Nerve **Backs Down**). **Telegraphs:** white = dodge or Brace; yellow = Hiss; red = get out.
- Hits fill the **Pounce Gauge** (2 Paws per cat). **Moves** cost 1–2 Paws, by shortcut or in **Slow Blink** (time ×5%; command any cat). Every Move is a **Set-up** (Ruffled, Splat, Clumped, Cowed) or a **Pay-off**. AI cats fight by **personality**, fire Set-ups only when commanded and **never target their own Kin**.
- **Frazzle** = stagger; **Ruffled** (4 s) doubles it; **Frazzled** = 6 s helpless, damage ×1.5. **Tag-In:** switch within **0.35 s** of a finisher, Pounce or Hiss interrupt; a **Relay** chains tags within 3 s. **Pile-On:** on a Frazzled enemy with ≥ 2 Posse cats standing, everyone dives into a dust cloud.
- **Nobody dies:** at 0 **Nerve** a cat is **Routed** and bolts. **A wipe is a loss:** the victor Gloats (≤ 3 s), any guest slips away, Day Loop ends the day (§5).
- **Fight-start statuses:** a Boss starts **Fired Up** (×1.25 damage) by his anger: Riled 20 s, Seething 40 s, Furious all fight (paused while Soggy). A recruit with **Old Gang Nerves** that sees its Old Boss starts **Cowed** (×0.75; won't target him) for 20 s (Fraidy 30 s) unless it resists or is Sworn; **a Tag-In to it clears it**.
- **The Nose-Touch guest:** from Life 2 a truce cat or Friend whose own **Rival** is an opponent may join after a 3 s yowl as an **allied AI guest** (no control, no Pile-On, counts toward the 10-cat cap). The opposing Rival is unchanged (G7).
- **Props and Fears:** bucket (Water), scooter horn (Loud Noise), cucumber (Cucumbers). Knock-offs from the High Road always Splat. Damage numbers Off by default.

**The 12 Moves** (★ = the 8 prototype Moves): Scrapper (Mikan) ★ Face Swat, ★ Scruff Toss, ★ Bunny-Kick, Shred · Bruiser ★ Shoulder Check, ★ Belly Flop, Puff Up, Sit On It · Yowler ★ Withering Hiss, Howl, ★ Purr, ★ Banshee Screech. Zoomies: Midnight Laps · Landslide · Midnight Aria. Each Style resists its own damage type (×0.8) and is weak to one (×1.2).

**Numbers.** Tough 6–10 s · normal encounter 30–60 s · Captain 30–45 s · **Daifuku 2–3 min** (sim 166–176 s; costed ≈ 3–3.5 paused min) · Fed Up at 75 s. Rank Nerve ×1 / ×8 / ×20, damage 1 / 1.3 / 1.6. A basic hit ≈ 4.5% of a same-level cat's Nerve. **Feel:** one tier table T0–T5 (hit-stop 40 → 230 ms, stepped shake, impact frames, one lettered word on player-authored T4/T5). Safety overrides it (§15).

**Daifuku: "knock him off into the bucket"** at whichever **patrol stop** he is on (§10); each stop is an arena kit with a knock-off edge and a water prop. Knock-offs are deterministic; three phases add Toughs (a seeded pick), a horn and a crumbling wall top. Furious raises the Posse's median Nerve lost from 52% to 61%. Each wipe plasters him −10% for the rematch and spends his anger. Hige and a recruited Togemaru stare him down; a recruited Kagi flinches until you Tag-In to him.

**Worked example: a Captain's Frazzle.** Pile-On at once: 4 × (2 + 6) × 1.5 = **48 MV**; beating first then Piling On: 34; two banked Moves in the ×1.5 window, then a Pile-On: **55**. Paw management makes the Pile-On a decision.

**Connects to.** Reads `RivalCombatProfile` (+ `anger_stage`, `old_gang_nerves`, `old_boss_id`, `kin_ids`); spawns the guest on `AllyJoined`; emits the encounter events (§16); owns the tier table.

---

## 8. Crew and personality

*Owner: systems-designer · [`gdd/crew-and-progression.md`](gdd/crew-and-progression.md)*

**Fantasy.** *"I know these cats."* You take Pon because she makes the bucket hit harder and sulks if left at the Lot; you post Hige because nothing gets past an old Stalwart; you keep Togemaru because he was the first cat to call you Collar and now charges the biggest enemy for you, loudly.

**Rules.**
- A Crew cat is in the **Posse** (Mikan + 3), a **Sentry** (2 slots; the Den's is the **Warden**, True+) or **Lounging**. Swap at the Lot or in the field by **Tail-Up**. **Style sets stats; personality sets everything else** and never changes. Slice Lv 1–10.
- **Exactly three recruitment routes (C4):** the **Recruit Verdict for a Bribe**, a **story beat** (Hige, Pon) and the **Friend Stray** favour (Kinako). A truce cat or Friend may fight beside you as a guest but never joins (*"Comes Knocking" is cut*).
- **The Bribe:** free in Life 1 (onboarding); from Life 2 **Fair or Feast** from the Stash, no free tier; if the Stash cannot cover Fair, Recruit is greyed. It sets only starting Loyalty; a Recruit always succeeds.
- **Joining:** a recruit keeps Memory, Scars, Title, Fear and personality; its Strength becomes a perk. A recruit from a gang writes **`OLD_GANG(boss)` into its own Memory** and gains **Old Gang Nerves** unless it resists. The Old Boss's record never changes.
- **Loyalty** shows only as a tier word and pose: **Shifty 0–29 · Aloof 30–44 · Steady 45–59 · True 60–79 · Sworn 80–100**. Steady+ teach **Lessons** (from L2D3). Release below 60 makes the cat **Gone**.
- **Rare betrayal, live from Life 2:** only an **ex-Rival recruit posted as a Sentry** at Shifty (< 30; Schemer < 35). Two **Wavering** mornings, then on the third night it keeps the Patch it guarded as a **turncoat** (never Low Wall Corner or the Den). Un-posting it or Loyalty 30+ cancels it. Slice bound: 0% (earliest: a neglected Togemaru on Life 2 night 13).
- **Bonded** pairs (Kin included) get a stronger Tag-In and +1 Loyalty a night when both are posted; **clashing** pairs lose 1 each a day together. No new Loyalty input reads a Verdict on another cat (two old ones are held '303 watch items, Crew §3.7.6).

| Personality | Fights like | On guard (counters) | Likes / dislikes | As a Rival (Nose-Touch shift; nerves) |
|---|---|---|---|---|
| **Braggart** | Charges the biggest enemy | Defence ×1.25, +10% Tribute (`gloat`) | Posse time / benched | Loud; −5; resists |
| **Brooder** | Hangs back, avenges allies | Never leaves; decay ×0.5 (`challenge`) | Long service / dismissal | Slow decay; −5; resists |
| **Schemer** | Flanks; hunts Frazzled | Names the raid motive (`challenge`) | Lessons / Nose-Touch Verdicts (watch item) | Ambushes; 0; susceptible; betrays < 35 |
| **Fraidy** | Keeps distance, supports | Raises the Caterwaul early | Never Routed / being Routed | Flees early; +5; susceptible (30 s) |
| **Stalwart** | Guards the controlled cat | Best defence ×1.5 (`gang_orders`) | Fair play / a Scuffed or Lost night on its own post | Honourable; +15; resists |
| **Goofball** | Goes for props | **Laughs off a challenge** (over-mark 0) (`grudge`) | Share counts double / left at the Lot | Clowns; +10; susceptible |

| Slice cat | Personality · Style | Joins | Start Loyalty |
|---|---|---|---|
| **Hige**, the old wall cat (ex–Wall Sitter: Old Boss Daifuku) | Stalwart · Bruiser | Story, L1D1 ≈ 0:08 ("Use your whiskers, Collar.") | 60 |
| **Pon** | Goofball · Yowler | Story, L1D2, after crows corner her | 55 |
| **Kinako** (Kin of Sasa) | Fraidy · Scrapper | Friend Stray, L2D1 required objective | 50 |
| **Togemaru**, the First Thorn (Rival of Goma) | Braggart · Scrapper | Recruit Verdict from L1D2 (free), declared or not | ≈ 44 |
| **Kagi**, Captain of Tofu Shop Step | Schemer · Yowler | Recruit from L2D3; fair 96 / feast 192 | 40 / 45 |
| **Daifuku**, Boss | Brooder · Bruiser | Recruit after his Boss fight, Regard ≥ 50 | 56 / 61 |

**Worked example: who sits out?** Six cats, three Posse places, two posts: one lounges daily. Never Pon. Not Togemaru for long (a Shifty posted ex-Rival can Waver). Hige + Pon + Kinako is all-bonded but has no Frazzle opener; Togemaru + Kagi + Pon cracks Captains, but Kagi flinches at Daifuku until you Tag-In to him.

**Connects to.** Supplies `PowerRating` and `Loyalty`; Wavering flags at step 1; `CatRecruited` triggers the `OLD_GANG` entry.

---

## 9. Rivals (the nemesis system)

*Owner: systems-designer (nemesis/AI) · [`gdd/nemesis-system.md`](gdd/nemesis-system.md) · screens [`ux/key-screens.md`](ux/key-screens.md) §2–4 · frames [`05`](previews/05-rival-standoff.png), [`06`](previews/06-fence-line.png) (the Rivals board, pre-C6 layout), [`07`](previews/07-verdict.png) · UI name **Rivals**; "Nemesis" is internal only (G12)*

**Fantasy.** *"That one, with the kinked tail. I let him off with a nose-touch, and three days later he came yowling over the laundry poles to help me flatten Goma."* A petty, funny, persistent neighbour. The player should feel: *it remembers me; I marked it; the cat I spared fights beside me; it got one over on me; the town moved while I slept; it chose me*, plus *the Boss is angry at what I did to his walls* and *my recruit flinches at its old boss*.

**Rules.**
- **≤ 12 tracked cats**, each with a personality, a 10-entry **Memory** of events it took part in, and hidden **Grudge** and **Regard** (never numbers). **Roles are fixed at generation:** no seats, promotions or demotions; nothing that happens to one cat moves another.
- **The Rivals board (C1, C6; replaces the Fence Line).** **Each gang is a scene in deep perspective:** the Boss on a raised perch at the far end of its alley (crown), the gang **down the steps toward the camera by standing** (its fixed role; play never reorders it), each cat with **only a name ribbon at rest**, its **role tag** for its own fixed job on its card when focused (rank: "Boss of …" or "Captain · …"; role from personality, fixed for life: Brawler, Enforcer, Sneak, Lookout, Shield, Prankster, shown with a Style icon; Outsiders: Challenger, Newcomer, Turncoat, Roamer), and faint **dashed arrows for who answers to whom**. Header: place name and a compact scene strip (no influence bar; influence, posts and tonight's raid live on the Turf Board); bottom-left, on focus only: the focused cat's card (role tag, personality, anger, one history line); ≤ 3 tags for rare ties on focus, the full Rival card lists all ties (owner declutter, 2026-11-24). Further scenes: the uphill districts (authored silhouettes in haze), the **Outsiders** (challengers, newcomers, turncoats), the **Bell** (the Crew), **legend cards** for Gone cats. Read-only; View / J on the street and at the Lot, never in the house; unlocks L2D1. Spec: [`ux/key-screens.md`](ux/key-screens.md) §2–§3 (revised for C6); preview `previews/06-fence-line.png`. *Roles and reporting lines are facts fixed at generation, only shown (v2 §5, G3, G11).*
- **Discovery:** undiscovered cats are silhouettes (a crown outline for a Boss). Any encounter, a **Whisker Sense sniff** (1.0 s within 10 m) or joining the Crew discovers a cat.
- **Relationship tags:** hover or focus a discovered cat and a tag appears on every other **discovered** cat it relates to: **Boss / Gang**, **Rival**, **Kin**, **Old Boss / Old Gang** (stored only on the recruit). Also on the card's Ties line. Effects land only on the holder: Gang says whose influence a Patch counts for; Rival enables the join-in and feud scuffles; Kin means AI never targets its Kin; Old Gang gives the recruit its nerves.
- A **Standoff** (2–4 s): name-card, a personal **yowl-sting**, one line from the cat's own history. **Silhouette Scars:** Claw → ear notch, Thump → kinked tail, Yowl → folded ear, Water Fear → damp cowlick. **Lick In:** flatten Mikan in a fight the Posse wins and earn a Title. **After a wipe only the victor changes**; only it may cite Mikan's plaster. **Adaptation** follows a flee or slip-away; every Rival keeps a way in.

| Verdict (one per fight) | Available | The cat | Later |
|---|---|---|---|
| **Recruit** (Right) | Grudge < 90 or Regard ≥ 50; slice-recruitable (Togemaru, Kagi, Daifuku) | Joins with its history | A Bribe (free in Life 1) and a slot; may betray if neglected on a post |
| **Chase Off** (Left) | Always | **Gone for good**; a legend card | A stranger may fill the gap |
| **Nose-Touch** (Up) | Pending Grudge < 50 + shift, **and from Life 2 a quiet take** | Steps down; Grudge 0, Regard +25; **10-day truce** | May join your fights against its own Rival; then a **Friend** (Regard ≥ 75) or a challenger |

**All three clear the post**; Mikan Claim Sprays it; nothing else in the district changes. **Tells:** tail lashing = Nose-Touch closed; eyes and lean = the Bribe band; Mikan turning away = Chase Off. A closed card names its reason: "Tail lashing. Not today." · "Too much of your stink on its post." (≥ 2 Counter-Sprays on a Keeper's own post) · "Still steaming. Not today." (a Boss met Seething+). Recruit adds a fighter and costs; Chase Off is free and final; Nose-Touch is free but earned and deferred.

- **The Nemesis slot:** one in Lives 1–2, the fixed **arc lead, Togemaru**, never re-named. **Declared** once he has ≥ 3 encounters (a truce greeting counts) and ≥ 1 mark, or by the night after L2D3: **Sworn Enemy** or **Sworn Rival**; storm mark. **Every Verdict on him is a complete ending:** Chase Off = his farewell ("Fine! I've got other walls. Better walls!"); Recruit = "Wears the bell now"; Nose-Touch = a truce carried by greetings and join-ins, a Sworn Rival on night 3. His first Rout always scars.
- **Boss anger (C1):** raised only by **marking his gang's objects** (Over-mark +5, Counter-Spray +15), never by fights; −15 a night; **0–3 steam puffs** (Calm / Riled / Seething / Furious). It buys **Fired Up** in his next real fight and is **spent** by a win, loss or his flight (not Scram). It touches no other cat.
- **New cats, never moved cats:** **town events** (every 2–3 nights) bring a **newcomer** into an empty place or keeperless Patch, or a **feud scuffle** between a Rival pair. **Challengers** come on a calendar (§10). **The Usurper** (full game): a fresh Boss staking the Den of a Boss-less district where Mikan's influence is below 25.

**Numbers.** Grudge per encounter: Routed +6, Pile-On +3, after its Fear +3, Ambushed +3, Keeper whose post was marked +6, fled +8, won a wipe +5; capped 35 (20 after two encounters); −2 a quiet night. Regard: clean win +8, Nose-Touch +25, Recruit +10, won join-in +5. Gate shifts: §8. **Join-in** `p = 0.35 + 0.15·[near its old Patch] + 0.15·[Regard ≥ 75]`, cap 0.65. **Sim:** one Nemesis for 100% of seeds; arc achieved 100%; mixed Verdicts 55 / 8 / 37% (chase / recruit / nose); Nose-Touch open on 82% of Life 2 Verdicts; **0 non-participant cats changed in ≈ 51,300 invariant checks.**

**Worked example: Togemaru** (gate 45). L1D1 ≈ 0:20: "Nice bell, Collar. Does it ring when you run?"; he bolts (uninterruptible on day 1). L1D2 ≈ 0:28, on his gatepost: "I ran yesterday. Not off my own post, Collar." A quiet take, a Pile-On, an **ear notch**; pending Grudge 43 < 45, all three cards open. Mikan sniffs **Daifuku** from the yard. **A, Nose-Touch:** a truce; on L2D1 he greets Mikan and may join against Goma (p 0.50); a **Sworn Rival** in the L2D2 Sniff. **B, Recruit:** on L2D4 he faces Daifuku: "Not your cat anymore." **C, Chase Off:** a legend card; Daifuku and the challenger carry Life 2.

**Connects to.** Consumes encounter events and `MarkApplied`; emits `VerdictApplied`, `TownEvent`, `CatDiscovered`, `AngerChanged`, `ChallengerArrived`, `AllyJoined`, `BetrayalTriggered`, `NemesisDeclared`, `RaidRequested`; places the patrol; overnight step 3; owns bark triggers. **Legal:** §19–20.

---

## 10. Territory and economy

*Owner: economy-designer · [`gdd/territory-management.md`](gdd/territory-management.md) · frames [`01-exploration.png`](previews/01-exploration.png), [`08-turf-board.png`](previews/08-turf-board.png), [`09-tribute-doorstep.png`](previews/09-tribute-doorstep.png)*

**Fantasy.** *"This wall is mine. That cat pays me in fish."* And the Lane is never done with you: the bar fades, strangers stake your posts, and the Boss comes down off his wall when the whole Lane smells of you.

**Rules.**
- Each **Patch** has one **Scent Post** and **Scent** 0–100, shown as 1–4 wisps in the owner's colour. **Strong** (60+) can't be taken by a raid.
- **Fight to clear, spray to claim.** Erode rival Scent by marking: **Over-mark** a Rub Mark (−10, quiet if unseen) or **Counter-Spray** the post (−30, loud). The first loud act sends waves; at Scent ≤ 30 the **Keeper** comes; Rout it, give a Verdict, **Claim Spray** (yours at 70). Quiet take: two Over-marks, one Counter-Spray. Loud take: two Counter-Sprays (more fighting; from Life 2 the Keeper won't Nose-Touch; the Boss gets angrier). **Rescue Spray** your own post below Strong (→ 90). Every act emits `MarkApplied`.
- **Only territory acts, raids and time move Scent (G5)**; a fight, a Verdict or a loss never does.
- **District influence (C3)** is read off Scent: each Lane outer Patch at Strong is worth 25, below Strong `scent/60` of 25. One **tug-of-war bar** (bell gold vs the gang, the Boss's crown at the full end); the % shows only in the Turf Board header. **It decays for everyone:** your posts −10 a night (×0.5 on Home Ground), a Sentry +10; a gang's posts recover +8.
- **The Boss window:** at **influence 100** (all four outer Patches Strong) Daifuku's yowl rolls down and he **roams three stops**, one per phase: Morning Laundry Pole Yard's yard wall (wash tub) · Day Tofu Shop's back wall (rain barrel) · Dusk–Night the Den corner stone (bucket). It stays open while influence is **≥ 75** at step 2; while open, held outer Patches **can't be Lost**. **Claim:** Rout him, any Verdict, **Claim Spray the Den post** → `DistrictClaimed`. Before the window he ignores you ("Come back when the Lane smells of you, Collar."). His departure re-tasks nobody.
- **Raids:** from L2D2, one a night, requested by Nemesis and **forecast** in the Sniff. Overnight it resolves against Scent and the **Sentry**: Repelled −5, Scuffed −20 (Tribute stolen twice over), Lost (flips at 40). Motive counters: `grudge` Goofball, `gloat` Braggart, `gang_orders` Stalwart, `challenge` Schemer or Brooder. Out at Night it fires as a **Caterwaul**: arriving in time multiplies the Sentry term ×1.5 **whatever happens in the brawl** (the presence rule).
- **Ground is taken back (C3, C5)** by raids; by **challengers**, fresh cats who stake your lowest-Scent held Patch (never Low Wall Corner or the Den) on a calendar: the first on the second night after Mikan first holds ≥ 3 Patches (slice: **night 5, the L2D4 Sniff**), then every 4th night, ≤ 1 active. By day it waits at the post (beat it for a Verdict; no Scent); by night it over-marks −10 (a posted Goofball: 0) and takes the raid slot (`challenge`). Lost: it becomes the Keeper; Repelled twice: it leaves. Also by **newcomers** into keeperless Patches and rare **turncoats** (§8).
- **Guard = Style × personality**; bonded neighbours +25%, clashing −25%. **Tribute** lands as a pile on the Doorstep into the **Stash** (cap 400, always safe).
- **The unified Turf Board (C5):** four zones, one job each: **header** (district, influence %, crown, Lot tabs) · **map** (5 Patch stamps: wisps, one badge, the seated Sentry; no numbers) · **Tonight panel** (opens on tonight's threatened Patch: threat, Scent, tomorrow's Tribute; an odds bar in three segments, no percentages) · **Crew strip** (two Sentry pegs, cat chips, totals). **One decision a day:** who guards the threatened Patch, and so who leaves the Posse; ≤ 1 min.

**Numbers.** `patch_tribute = base_yield × band × watch × (1 + min(bonus, 0.35) − clash)`; yields 8/10/12/14/18; Faint ×0.6, Clear ×0.9, Strong ×1; Unwatched ×0.8; Braggart +10%, Full House +10%. `I = round(100 × Σ min(scent,60)/60 ÷ n_outer)`. **Prices:** Lesson I 40 / II 120; Bribe fair = 8 × level × (0.75 / 1 / 2 / 4 by rank), feast 2×; Share = Σ Crew levels; upkeep 2 per post. Tribute climbs **6 → ≈ 58 a day by the claim night** (target 54–66). Posting well beats random by **+24% over the slice, +33% on raid nights** (sim).

**Worked example: night 6 (L2D4), a challenger on Tofu Shop Step** (the window is open, so nothing can be Lost). Nobody posted: Scuffed 95%, the bar sags. **Kagi** (the counter): Repelled 79%; one more Repel sends it away. **Pon:** no over-mark, the bar stays full, Repelled 40%. **Hige:** 75%, but the Posse loses its anchor on Daifuku's day. Or Rout it by day (≈ 2 min).

**Connects to.** Consumes encounter, Verdict and raid events; emits `PatchChanged`, `MarkApplied`, `InfluenceChanged`, `BossWindowChanged`, `RaidResolved`, `DistrictClaimed`, `TributeDelivered`; overnight steps 2 and 4; owns Clout and every price.

---

## 11. Dual Story Progression

*Owner: narrative-director · [`narrative/dual-story-progression.md`](narrative/dual-story-progression.md) · frame [`10-home-evening.png`](previews/10-home-evening.png)*

**Fantasy.** Twenty minutes a tyrant; then a bell-gold thread home, the camera drops at the wall, and a girl in yellow socks taps your bowl twice. You don't know why she's crying at her desk, but you know to sit on her paper. Three feelings: **detective of the ordinary**, **belonging earned by a cat**, **caring about a specific person**.

**Rules.**
- **The language rule:** no human utterance is ever intelligible (**Murmur**, **Scribble**), in trailers too. Mikan's grasp shows as **Sense Icons**. Cat speech is readable, but cats never explain the human story. **Three laws:** *Witness*, *Cat-Sense*, *No-Translation*.
- **Gating:** each vignette has a day gate and a slot; **turf never gates a home beat**, only a Life's end. A loss shortens its day but never moves a day gate.
- **The Routed Evening (after a loss):** Haru is home and waiting at Night; she kneels and puts a **sticking plaster** on Mikan's ear (≤ 30 s), then the normal evening. A Keystone due that evening plays its **Late form** (K1.3's keeps the Call: the first Call is never lost); a Closing waits for the next morning slot.
- **The house:** no combat, clock paused, Crew never enter. Evening ≤ 2 min: the **daily find**, the **piano** (walk the keys; Haru plays a bass under you), **Lap**, **Gift**, **Knock**. Three face events in the slice; otherwise humans are knees, hands and laps.

| Day · slot | ID | Vignette | Core fact |
|---|---|---|---|
| L1D1 open | K1.1 | The Box in the Rain | The yellow one took me; the old one does not want me |
| L1D1 Dusk | K1.3 | The Bell and the First Call | That song is me: come home and eat |
| L1D2 morning | T1.1 | Grandpa's Photo (Texture) | Gran remembers someone |
| L1D2 Dusk | K1.4 | The Step (Closing) | The old one is mine too; I live here |
| L1→L2 | M1 | The Kitten Grows (montage) | — |
| L2D1 morning | K2.1 | School Shoes | She leaves every morning, returns every evening |
| L2D1 Dusk | T2.2 | The Stuck Bar (Texture) | The piano is hers; one bar defeats her |
| L2D2 morning | T2.1 | The Second Goodbye (Texture) | She is always late |
| L2D2 Dusk | K2.3 | The Flap | She made me a door (Night opens) |
| L2D3 any | K2.2 | The Lamp at Night | She is hurt, not in her body; closeness helps |
| L2D4 morning | K2.5 | The Envelope (Closing) | Something wonderful happened; a new box I don't like |

Plus **Late Home** (L2D3 Dusk): no Call, the bell alone, Haru comes home late; it teaches "no Call = she's late, she will come" before Life 8 reuses that Dusk.

**Numbers: Bond.** 0–10 hearts, never decreases. Daily points: home by Dusk 1.0, late or routed 0.5, Lap, find, Gift, Comfort 0.5 each; cap 2.5. **Well-Fed** next day (not after a loss): Zoomies starts at 5% per heart; every Posse cat starts fights with ¼ Paw. ≈ 2 points a day for 7 days = **4 hearts**.

**Connects to.** Consumes `HomeArrived`, `DayEnded`; emits `KeystonePlayed`, `BondChanged`, `LifeAdvanced`; step 5; Routine tags for Rivals' taunts. Narrative writes every line, each from the speaker's own history (G8).

---

## 12. Art direction

*Owner: art-director · [`art/art-bible.md`](art/art-bible.md) · mock-up kit [`previews/kit/`](previews/kit/README.md)*

**Ink what acts, paint what stays.** Everything that moves, fights, can be knocked over or loves you is a flat two-tone cel with a thin **Aubergine Ink** line (2 px at 1080p); everything that stays put is soft, unlined paint. **Principles:** read from behind; thirty centimetres tall; colour says what words cannot; loud street, quiet house.

**Palette highlights:** Paper Cream and Cocoa UI; **Mikan Ginger** reserved for the hero; **Bell-Gold** for everything that is the player's (the influence bar's left side); **Haru Yellow** exclusive inside the house; **Wall Sitter Sage** for the slice's gang; **Frazzle Magenta** the loudest combat colour; shadows Wisteria, never grey. Phase keys Morning, Day, **Dusk** (the key-art hour), Night in bright moon-blue (also the loss nightfall). Rivals marks: steam puffs (anger; Collar Crimson with a zigzag twin at Furious), the truce sprig, the storm mark, legend cards, the challenger's staking stamp.

**Characters:** one animation set per personality (plus the old-gang flinch and the defiant stare); a coat generator that never produces Mikan's look or a Scar shape; humans seen from the knee. **Reference-close on the visuals** (user decision): 3D cel characters reading as 2D cels over environments reading as 2D painted backgrounds, under a free camera. **Originality:** all characters, names, places and assets are ours. A one-alley look-dev test in UE 5.8 proves the method. The **Rivals board** (C6) is a staged perspective diorama of a painted alley per gang: Art owns its set and phase lighting.

---

## 13. Audio direction

*Owner: audio-director · [`audio/sound-bible.md`](audio/sound-bible.md)*

**Two worlds, one thread.** **The Street** is a Showa gangster picture for brass, taiko and shamisen; **the House** a chamber room (upright piano, reed organ, a human voice). **The thread** is **the Call** (E4–G4–C4) and Mikan's brass **bell**.

**Rules.** The Call is Mikan's name and the main theme, first heard at K1.3; **Haru's Melody never contains it**. The Dusk pull: chime → Call within one bar → bell on beat four. **Murmur** is prosody only. A personal yowl-sting per Rival. **New cues (owner pass):** the moon-blue nightfall after a loss and the Late form of K1.3 with the Call; **Daifuku's yowl** rolling down when the window opens (in view, uninterrupted on L2D3); the challenger's arrival sting; the 3 s join-in yowl; steam-puff huffs by anger stage. **Budgets:** ≤ 25 min music, ≤ 240 barks. Every load-bearing sound has a visual twin (§15).

---

## 14. UX, HUD and key screens

*Owner: ux-designer · [`ux/hud.md`](ux/hud.md), [`ux/key-screens.md`](ux/key-screens.md) · desktop only: gamepad first, full keyboard and mouse*

**Three HUDs.** *Street:* the world is the interface: a phase dial, an on-demand Patch tag (a steam puff when a marking act angers the Boss), flares, the Call glyph, Head Home, barks; compass ticks for the roaming Boss and a challenger. **The closed street** after a loss shows only the thread, the dial and the Rivals binding. *Combat:* Posse plates bottom-left (a guest plate with its sprig), Zoomies bottom-right, ribbons for named Rivals; the Frazzle bar and Pile-On ring sit **on the enemy**. *Home:* pictograms only, except the **Doorstep Morning Sniff**.

| Screen | What it is |
|---|---|
| **Rivals board** | Per-gang perspective scenes (§9) with name ribbons, answers-to arrows, silhouettes, hover/focus tags, puffs, sprigs, legend cards; header with scene strip, focus-only cat card (role tag) |
| **Rival card** | One cat's history: Memory lines, Scars, Title, ties, anger; how to discover it if unmet |
| **Verdict** | Three cards with honest tells; Bribe row (Fair · Feast; "Free" in Life 1); closed cards name their reason; no timer. "Every choice clears the post. Then spray it." |
| **Loss** | No defeat card: the Gloat, a 2 s nightfall iris, a haul tally, the walk home |
| **Turf Board** | The four-zone board (§10); first look L2D1 (≤ 15 s), first posting L2D2 (≤ 45 s median) |
| **Morning Sniff** | Tribute, the raid forecast, ≤ 3 Rival items in one order: Wavering > Declaration / arc closing > challenger > Boss window > anger > the arc lead > town events. ≤ 30 s |

**The numbers rule:** numbers count what the cat owns or pays, never a feeling, a relationship or a human. Anger is puffs and a word; influence % only in the Turf Board header; truce days are a calendar count. **Onboarding:** one new verb every 60–90 s, situation first, then a ≤ 6-word hint; the home teaches nothing with text.

---

## 15. Accessibility

*Owner: ux-designer · [`accessibility-requirements.md`](accessibility-requirements.md) (project-wide floor)*

**Flash and motion safety overrides every feel value:** ≤ 3 flashes/s over > 20% of the screen; ≤ 1 full-screen impact frame/s (a runtime arbiter); no saturated red change over > 5%; stepped shake; global hit-stop ≤ 20% of any second. **The default build must pass a Harding-style analysis before any public footage** (the nightfall iris and the board's "Last night" replay included).

**Slice options:** Reduce Flashes, Reduce Motion, shake and hit-stop sliders, onomatopoeia On/Smaller/Off; text to 150%; full remapping; a toggle for every hold; Slow Blink full pause; Kitten difficulty; keyboard-only and gamepad-only completion. **No state by colour alone.** **Nothing depends on hover:** every tie is also on the card's Ties line and on pad focus. **Deaf/HoH parity without captions:** the Call glyph, bell glint, lamp wave, Sense Icons, sting glyphs, haptics. **REQUESTs pending with Combat:** Auto Slow Blink, a wider Tag-In window, combat speed 70/85%, hold-to-string, hit-stop 0%.

---

## 16. Cross-system map

**One Cat Schema:** `id, name, title, coat_seed, style, personality, level, xp, stats{5}, moves[4], zoomies, signature_strength, traits{strengths,fears,scars}, loyalty, grudge, regard, memory[], rank (fixed), former_rank, clowder, assignment, relations[], discovered, old_gang_nerves, anger, truce_until_day, wavering_nights, keeper_of`.

| Event | From | → To |
|---|---|---|
| `EncounterStarted`, `CatRouted`, `MoveUsed`, `TagIn`, `FearTriggered` | Combat | Nemesis, Crew, Audio, UX, Day loop |
| `EncounterEnded` (win / loss / player_fled / rival_fled) | Combat | Nemesis, Territory, Crew, Economy, Day loop |
| `VerdictApplied` (chase / recruit / nose) | Nemesis | Territory, Crew, Economy, UX |
| `TownEvent` (newcomer / feud_scuffle), `NemesisDeclared`, `RaidRequested` (grudge / gang_orders / gloat / challenge) | Nemesis | UX, Territory, Narrative |
| `CatDiscovered`, `AngerChanged`, `AllyJoined`, `ChallengerArrived`, `BetrayalTriggered` | Nemesis | UX, Audio, Territory, Crew; Combat (anger, guest) |
| `MarkApplied(patch_id, district_id, kind ∈ {over_mark, counter_spray, claim_spray, rescue_spray}, target_clowder)` | Territory | Nemesis (anger; the quiet-take count), Audio |
| `InfluenceChanged`, `BossWindowChanged` | Territory | UX, Audio; Nemesis (patrol) |
| `RaidResolved` (+ presence), `PatchChanged`, `DistrictClaimed` | Territory | Nemesis, Economy, Narrative, UX, Art, Audio |
| `CatRecruited` | Crew | Nemesis (`OLD_GANG`), UX |
| `TributeDelivered` | Economy | UX, Narrative |
| `HomeArrived` (on_time / late / routed) | Day loop | Narrative, Audio, Territory |
| `KeystonePlayed`, `BondChanged`; `PhaseChanged`, `DayEnded`, `LifeAdvanced` | Narrative; Clock | Audio, UX, Nemesis, Combat; everyone |

Queries: Combat → Nemesis `RivalCombatProfile`; Territory, Nemesis → Crew `PowerRating`, `Loyalty`. **Invariant (unit-tested):** a Verdict, a loss, a join-in or an anger change alters no cat but its subject.

**Night Shuffle** (steps never reorder; seeded substreams `(save_seed, day, step, subsystem, cat, ordinal)`; night *n* ends day *n*, its news is in day *n* + 1's Sniff): **0 Day loop** close the day (haul −20% after a loss; heal; `DayEnded`) · **1 Crew** Loyalty, Sentry XP, Wavering · **2 Territory** decay and refresh, challenger over-mark, upkeep, tonight's raid or challenge, influence and the window · **3 Nemesis** betrayals, town events, the challenger calendar and truce expiry, adaptation, Grudge and anger decay, the Declaration, tomorrow's raid request (challenger first) · **4 Economy** Tribute · **5 Narrative** next slot, Life-end check · **6 Day loop** autosave, wake.

---

## 17. Slice onboarding and pacing

*Clock times: [`gdd/day-loop.md`](gdd/day-loop.md) §3.9–3.11 (the budget owner); teaching sheet: [`ux/key-screens.md`](ux/key-screens.md) §7 (aligned to it).*

| Time | Beat | Taught |
|---|---|---|
| 0:00–0:08 | **K1.1**; garden; a crow on the lane-side wall top | Camera, Move, Hop, Attack, Skitter |
| 0:08–0:15 | **Hige** joins; two Strays; **two-cat Pile-On ≈ 0:14** | Whisker Sense, switch, Slow Blink, command, Frazzle, Pile-On |
| 0:15–0:20 | Low Wall Corner; an untracked Stray Keeper; **Claim Spray: Patch 1** | Rub, Spray, Hiss, Back Down |
| 0:20–0:25 | **Togemaru** flees (day 1); nap; Head Home; **K1.3, the first Call** | Standoff, Brace, home |
| 0:25–0:32 | Day 2 Doorstep and Lot; **memory line ≈ 0:28**; **first Verdict**; **Patch 2**; sniff Daifuku | Tag-In, Verdict, discovery |
| 0:32–0:45 | **Pon**; **K1.4** at 0:40–0:45; Life-end sleep | Relay |
| 0:45–1:00 | Montage; L2D1: K2.1, **the Rivals board**, **Kinako**, Ambush, **Patch 3**; influence ≈ 75 | Rivals board, tags, influence |

**Life 2, one headline a day:** **D1** Ambush, the Rivals board, the influence bar · **D2** the first forecast (often beside the Declaration), Sentries and the Turf Board's one decision, props and Fears, the cat flap, Night, the Caterwaul · **D3** Lessons, Zoomies on Kagi, **the Tofu Shop Step Claim Spray opens the Boss window** (in view), Late Home, K2.2 · **D4** K2.5, **the first challenger**, **the Daifuku fight** (a lost attempt is the budget's long case) · **D5** the rematch, **Claim Spray the Den**, the Life-end sleep. Taught when they first happen: a join-in, the first loss, a Nose-Touch card closed by a loud take ("Spray quietly to make peace."), the first Gone cat, the first Wavering.

| Day | Min | C | T | H | S | Beats |
|---|---|---|---|---|---|---|
| L1D1 | 25 | 9 | 8 | 2 | 6 | K1.1, Pile-On, Patch 1, K1.3 |
| L1D2 | 20 | 7 | 10 | 1.5 | 1.5 | Memory line, Verdict, Patch 2, Pon, K1.4 |
| L2D1 | 20 | 7 | 9.5 | 1 | 2.5 | Rivals board, Kinako, Ambush, Patch 3 |
| L2D2 | 23 | 7.75 | 13 | 1 | 1.25 | Declaration, forecast, Turf Board, K2.3, Caterwaul |
| L2D3 | 24 | 6.75 | 15.5 | 0.75 | 1 | Lessons, Kagi, Zoomies, **window opens**, Late Home, K2.2 |
| L2D4 | 15.5 | 3.5 | 7.25 | 1.75 | 3 | K2.5, challenger, Daifuku attempt lost → Night, Routed Evening |
| L2D5 | 16 | 7 | 7.5 | 0.75 | 0.75 | Rematch, Den Claim Spray, suitcase, title card |
| **Total** | **143.5** | **33%** | **49%** | **6%** | **11%** | |

**Fast path** (Daifuku won on L2D4): 6 days, ≈ 2 h 08. Each extra Boss wipe adds a rematch day (≈ 16 min). L2D3 (24.9 typical) has no slack: the window reveal must stay in view. *(v1.1's K1.4 and Turf Board-day disagreements are resolved.)*

---

## 18. Prototype plan

**Build first** (brief §10):
1. **Combat grey box** (highest risk): Mikan + 3, 3 Styles, the 8 ★ Moves, Tag-In, Relay, Pile-On, a Captain, a 3-phase Daifuku on one patrol-stop kit with Fired Up by anger, Cowed and the Tag-In that clears it, the join-in guest; AI for Stalwart Hige, Goofball Pon, Braggart Togemaru; camera states; the tier table with the safety arbiter.
2. **Sims** as regression checks: [`reviews/round-3/sim/`](reviews/round-3/sim/) and [`reviews/owner-feedback/sim/`](reviews/owner-feedback/sim/) (combat with anger and nerves, Nemesis with the patent-invariant self-test, territory economy, day budget). **Owed:** Crew's Lives 1–2 sim for betrayal rate (AC-23) and pacing (AC-6).
3. **One-alley look-dev test (UE 5.8)** and a **home mock** (Mikan at 1.25× in a lap).
4. **Browser showcase first** ([`IMPLEMENTATION-PLAN.md`](../production/artifact-slice/IMPLEMENTATION-PLAN.md)): a ≈ 14-min desktop-only stakeholder build of the owner's direction, starting with the M0 look-dev go/no-go; its data tables and findings carry over.

**Questions it must answer.**
- Is conducting fun (≥ 75% do ≥ 1 Tag-In and ≥ 3 commanded Moves per normal encounter)? Random pause: ≥ 90% find their cat within 1 s? Do AI Paw habits ever fire?
- Is Daifuku 2–3 min at every anger stage, and do ≥ 60% bucket him unaided? Can a Life 1 kitten beat Togemaru?
- In the slice build: does a day fit 25 min? Is posting a real choice? **Is Nose-Touch ≤ 60% of Verdicts, and can testers say why a card closed?** Does the influence bar read without a street strip (key-screens A-7)? Does the walk home read as a sting, not dead air? Does a flinching recruit or a join-in come up unprompted?

---

## 19. Risks

| Risk | Mitigation |
|---|---|
| **Scope** | Slice first; Backlog discipline; OR-18's "deliberately not added" list |
| **Wordless legibility** / **Nemesis without voice** | Vocabulary before use; muted tests / personality animation, Scars, yowl-sting, one sharp line |
| **Four-cat readability** | Keylines, edge arrows, decals above dust, random-pause test |
| **Environment cost** (sky and every angle visible; the Rivals board is a second staged set per gang) | Look-dev test; one district first; one board scene in the slice |
| **Tonal whiplash** | Hard street/home separation; HUD falls away at the wall; the plaster beat is tender, not punitive |
| **Style proximity** | Originality rule, own UI shapes and content, free camera |
| **Nemesis patent family** (US 10,926,179; 11,660,540; 12,201,908; pending US 2025/0108303) | The risk reading now rests on the **full claim text** of all 11 independent claims: [`legal/nemesis-patent-analysis.md`](legal/nemesis-patent-analysis.md) **v2** and [`legal/claims/`](legal/claims/). The design follows the working rule and guardrails G1–G12 (v2 §5). **No legal conclusion; distance, not clearance. Counsel review blocks scope lock and any public showing** (v2 §1, §8). Watch items: join-ins and two Verdict-keyed Loyalty inputs ('303, G10); raid-requester and Ambush selection (OR-19); the quiet-take gate and the Usurper check; the C6 board's role tags and answers-to arrows, which make the gang hierarchy more visible ('908 A3; display only, roles fixed) |
| **Day overrun** (L2D3 24.9 typical / 28.9 heavy; L2D2 22.4 / 28.9) | Measure Lot/Doorstep first; keep the L2D3 reveal in view; move the Turf Board back to L2D1 or trim Night |
| **Nose-Touch dominance** | The quiet-take gate (open on 82% of Life 2 Verdicts in sim); playtest AC 4; lever: gate base 40–60 |
| **Low-stakes posting** (+24% / +33% after fights stopped moving Scent) | Motive counters, neighbours, challengers; watch the "stand out" score |
| **Loss reads as punishment or dead air** | No defeat card, ≤ 60 s walk, the plaster beat; lever: one Mikan inner beat on the walk (G8-safe) |
| **Betrayal rate unmeasured** | Analytic slice bound 0%; Crew sim owed before the slice ships |
| **Photosensitivity** | Safety overrides feel; runtime arbiter; Harding gate |

---

## 20. Open decisions for the user

| # | Decision | Default / recommendation |
|---|---|---|
| 1 | **Patent counsel review** of Rivals against the full claims (v2 note, `legal/claims/`) | **Blocking:** qualified US patent counsel before the Rivals scope locks and before any public showing (trailers, store pages, demos, links outside the team). Questions: v2 §8.3; packet: v2 §8.2 plus the consistency pass's two items and the C6 board |
| 2 | Cultural consultant for the home rituals | Before slice home content is final |
| 3 | Team size, budget, timeline | — |
| 4–9 | Haru canon or selectable · Mikan customisation · does Life 9 imply Mikan's passing · handheld floor · Night locked until the flap · Spraying as a sparkle cloud | Canon · fixed design · no (the bell is last) · Switch 1-class · yes · yes |
| 10 | Remaining doc alignments | Pile-On prompt word vs hint card; Togemaru's Strength (+15% Nerve) vs Nemesis's slice list |

*Settled by the owner 2026-11-24 (rulings §5; every answer matched the default):* the recruit's **own flinch** replaces the old boss's targeted trash-talk (pending counsel on a line-only taunt); Nose-Touch truce = **10 in-game days**; **Chase Off is final for everyone**, Togemaru included (his arc closes with an ending of its own); **recruit betrayal is on in the slice** (rare); **full influence = all four outer Patches Strong at once**. Also the owner's comments C1–C6 themselves (Rivals board and staged gang scenes, losing ends the day, district influence, the three-option Verdict, the unified Turf Board and challengers), and **no phone support** for the browser showcase (desktop only).

*Settled earlier:* engine UE 5.8, title "Cat RPG", reference-close visuals (2026-11-24); slice first, simplified FF7R combat, personality as the Crew hook, third-person camera, three districts, readable cat speech and onomatopoeia (2026-11-23).

---

## 21. Glossary

New or easily confused terms; the full canon glossary is [`creative-brief.md`](creative-brief.md) §3.

| Term | Meaning |
|---|---|
| **Boss window** | When a Boss roams his patrol stops and can be challenged: opens at influence 100, closes below 75 |
| **Claim / Rescue Spray** | Spraying a keeperless post (yours at 70) / your own post below Strong (back to 90) |
| **Challenger / newcomer / turncoat** | A new cat staking your Patch on a calendar / a new cat filling an empty place / a recruit that defects with its post |
| **Clowder / Clout** | A district's gang (yours is the Bell) / reputation milestones that set Crew cap and Sentry slots |
| **Discovered / Gone** | Met, sniffed or recruited (until then a silhouette) / left town for good (a legend card) |
| **Influence** | A district's 0–100 read-out of how much of it smells of you |
| **Keeper / the Lot** | The Rival holding a Patch / Crew HQ: Posse, Turf Board, Lessons, Share a Morsel |
| **Keystone / Texture / Closing** | Required home beat / optional one / a Life's last Keystone |
| **Morsels / Stash** | Food currency / Mikan's always-safe bank |
| **Nerve / Routed** | HP / bolting in a dust puff at 0. Nobody dies |
| **Old Gang Nerves** | A recruit's own fear of its old boss: Cowed until you Tag-In to it |
| **Routed Evening** | The night-lit evening after a loss, opening with Haru's sticking plaster |
| **Town event** | An overnight newcomer or feud scuffle, never caused by what Mikan did to a cat |
| **Truce / Friend** | 10 days of peace after a Nose-Touch / a truce cat at Regard ≥ 75, never hostile again |
| **Whisker Sense** | Hold mode: scent trails glow; a compass points at marks, Rivals, the Boss's stop and finds |

---

## Changelog

- **1.2 (2026-11-24)** — Owner feedback C1–C6 compiled from OR-01…OR-21, F1–F12 and brief v1.6: losing ends the day (Night, closed street, the Routed Evening); the Rivals board replaces the Fence Line (discovery, tags; staged gang scenes per C6); three Verdicts (Humble removed; Chase Off final; gated Nose-Touch with truce and join-ins); Togemaru's three endings; Boss anger, Old Gang Nerves, Fired Up/Cowed; district influence, the Boss window and patrol (Den gate removed); challengers, newcomers, town events (no seats, promotions, wall events or Stewing); rare betrayal; the unified Turf Board; Bribe tiers; `MarkApplied` and the new events; pacing re-measured (143.5 min); patent risk re-based on the full claims (v2); owner answers recorded as settled.
- **1.1 (2026-11-24)** — The user's engine, title and art-style decisions (brief v1.4).
- **1.0 (2026-11-24)** — First compile from the round-3 design set.

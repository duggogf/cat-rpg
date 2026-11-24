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

> **Superseded facts.** [`gdd/game-concept.md`](gdd/game-concept.md) and [`gdd/game-pillars.md`](gdd/game-pillars.md) predate the rulings. Their pillars and fantasy hold, but where they disagree **the brief wins**: the camera is **third-person behind the cat**; the town is **3 districts + the Lighthouse Summit, 20 Patches**; level cap **30**; main story **12–15 h**; **≈ 50 Moves, ≈ 58 vignettes**; a small known Crew; **home beats are gated by day count, never by claiming districts**; a day is **≈ 20–25 min**; big hits show **one readable hand-lettered sound word**.

---

## 1. One-page summary

**High concept.** A 3D third-person action RPG. You are **Mikan**, a ginger-and-white bobtail house cat in **Yunagi**, a Showa-nostalgic Japanese seaside hill town. You spray, brawl, recruit and tax your way from one garden wall to **Great Boss** of the town, leading a four-cat **Posse** in stylised real-time fights against **Rivals** who remember what you did to them. Every morning and evening you go home, where your human, **Haru**, lives a whole life you witness but cannot understand in words: school, leaving, love, a wedding, a baby, and then a door that stops opening.

**The fantasy: *Boss outside, pet at home.*** A ruthless little alley tyrant who still comes running when one particular human sings three notes.

**USP: Dual Story Progression.** Every in-game day advances both stories on one clock. The human story has no intelligible word, ever: only staging, objects, colour, light, music and wordless **Murmur**, seen from 30–60 cm off the floor. In Life 8 the story inverts the economy: the food tax you extorted all game becomes food you carry home to a grieving family.

**Key features.**
- **Conduct the brawl:** FF7 Remake's structure, Pokémon's roster, a cat's verbs, kept light. Switch instantly between four cats, time **Tag-Ins** into **Relays**, stagger with **Frazzle**, finish with the **Pile-On** dust cloud. **You can lose:** a wipe ends the day, the clock jumps to Night and Mikan walks home to Haru's sticking plaster. No game over.
- **Rivals remember:** every unique cat in town sits on the **Rivals board**, a staged alley scene per gang, silhouetted until you **discover** it; hover one to see who it is tied to. Named cats keep a Memory of you, wear **Scars** you gave them and earn Titles for beating you. Every win ends in one of **three Verdicts**: **Recruit** (for a Bribe), **Chase Off** (gone for good) or **Nose-Touch** (a truce; the cat may later fight beside you against its own Rival). Nobody dies.
- **Six personalities** drive how a cat fights for you, guards for you, stays loyal, gets along, flinches at its old boss, and behaves as a Rival.
- **Territory that feeds you and never stays won:** fight to clear, **spray to claim**; fill your **district influence** bar until the Boss comes down off his wall to be challenged; post Sentries against forecast raids and **challengers** new in town; collect **Tribute** as a real pile of fish on Haru's Doorstep. Influence fades if you neglect it.
- **The house:** a daily sniff-out, a piano to walk on, and vignettes that make you care about one person.

**Audience:** 16–40; action-RPG players who also buy emotional indies; cat people. PEGI 7–12 / ESRB E10+. Solo, premium, offline. **Platforms:** PC (Steam) lead, controller-first with full KB/M, 60 fps; a handheld second at 30 fps (floor OPEN). The slice is PC. No phone or touch layout. **Engine:** Unreal Engine 5.8.

**References** (structure and feel, never components): *Final Fantasy VII Remake* (combat structure, slow-mo commands, stagger) · *Pokémon* (recruit, teach, swap) · *Shadow of Mordor* (remembering enemies, a roster screen) · *Shin chan: Shiro and the Coal Town* (the look, matched closely; never its characters, names, places, assets or 3C) · *Stray* (cat scale) · *Yakuza* (turf melodrama played straight and funny).

**Why it stands out.** Combat and Rivals carry the word of mouth ("the cat I let off with a nose-touch came yowling over the laundry poles to help me flatten his rival, then we knocked the Boss off his wall into a bucket"); the wordless home story is why people remember it; territory carries half the play time. No other game puts a petty gang war and a quiet human life on one clock.

---

## 2. Pillars

Full text: [`gdd/game-pillars.md`](gdd/game-pillars.md).

| # | Pillar | Test |
|---|---|---|
| 1 | **Cat's-Eye Truth** | If a cat could not perceive, want or do it, it is not in the game. No intelligible human language, ever |
| 2 | **Two Lives, One Clock** | Every day advances both Mikan's turf and Haru's life; home is mechanically and emotionally unavoidable |
| 3 | **Conduct the Brawl** | Short, loud, readable cartoon brawls where you command four cats; feel beats simulation |
| 4 | **Rivals Remember** | Every named cat carries visible history with you; no Rival fight is anonymous or consequence-free |

Conflicts resolve in table order, but **priority is not investment**. **Anti-pillars:** no hunger/thirst/litter meters; not collect-them-all; not dialogue-driven; not grimdark (nobody dies on the streets); no time-pressure fail states (a lost fight ends the day, never the game); at most 3 once-a-day actions; no multiplayer or live service; not FF7R-depth combat. **Tone:** scratches, puffed tails, dust clouds and sticking plasters, never blood. The streets are a comedy of status, the house a quiet drama; all real grief belongs to the home story. The ending is sad, then warm.

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

**Life 8:** the Call stops coming; Mikan waits, then carries food home three times. **No food enters the house before Life 8**; the accident is never shown. **Full game:** 12–15 h, ≈ 50 Moves, 5 Styles, ≈ 58 vignettes, ≤ 700 barks, ≤ 75 min music, small team. **Never cut:** the dual story, the nemesis memory loop, Tag-In, the Pile-On, personality.

---

## 4. The vertical slice

Lives 1–2 in Hidamari Lane: Mikan arrives as a kitten in the rain and becomes Boss of the Lane the week Haru's envelope arrives. The Life ends at the first sleep after the Lane is **claimed** (the Den post Claim Sprayed): Mikan asleep in Haru's empty suitcase, then the title card.

| Scope | Slice |
|---|---|
| **Lives / days** | 1–2 · 6–7 in-game days |
| **District** | Hidamari Lane; Haru's House (garden, entryway, Main Room with piano, Haru's room); the Lot; 4 Sunspots |
| **Patches** | 5: Low Wall Corner (Home Ground), Laundry Pole Yard, Persimmon Alley, Tofu Shop Step, the Den. 2 Sentry slots |
| **Rivals** | ≤ 12 tracked: the Wall Sitters (Daifuku, 2 Captains, 5 Toughs incl. the First Thorn; roles fixed at generation, no seats) + 2 Roamers, plus newcomers and **≈ 1 challenger** from the calendar. Crows are the only Critter |
| **Crew** | Mikan + 6 recruitable, one per personality. Cap 6 |
| **Moves** | 3 Styles, **12 Moves**, 3 Zoomies, 3 Fears; Daifuku in 3 phases on any of his three patrol stops |
| **Rivals system** | The **Rivals board** (staged gang scenes, discovery, relationship tags), three Verdicts, Gloat, Lick In, town events, **Old Gang Nerves**, **Boss anger**, Nose-Touch **join-ins**, exactly one declared Nemesis |
| **Territory** | Scent, marking, **district influence and the Boss window**, Tribute, one forecast raid a night from L2D2, the Caterwaul (presence rule), the first challenger (night 5), rare recruit betrayal, the unified **Turf Board**, Lessons I–II, Bribes, Share a Morsel |
| **Vignettes** | **11** (7 Keystones, 3 Textures, 1 montage) + the Routine layer, the Routed Evening, daily find, piano |
| **Audio** | ≤ 25 min music; ≤ 240 bark lines |
| **Minutes** | ≈ 2–2.5 h (reference path **143.5 min**; fast path ≈ 128) |

**Questions:** Is conducting four cats fun? Do players care about a Rival and about Haru within two hours? Is territory fun at this scale? Does a day fit ≈ 25 min? Is the three-way Verdict a real choice? **Pass/fail tests:** two cats and a Pile-On by minute 15; a memory-citing Rival line before minute 60 (≈ 0:28); ≥ 80% name a Rival and something specific Haru does; no Verdict > 60% of Verdicts and ≥ 70% of testers use ≥ 2; ≥ 80% open the Rivals board on L2D1 and ≥ 60% name one tie; Keystone facts reach 90% of testers with audio muted; the flash test passes.

---

## 5. Day loop

*Owner: game-designer · [`gdd/day-loop.md`](gdd/day-loop.md)*

**Fantasy.** A cat's day, not a shift. Wake, check the pile on the step, nod to your crew, go out. Then the light turns gold, a chime rolls up the hill, a voice sings three notes, and you *want* to go home.

**Rules.**
- **Wake → Doorstep → the Lot → street (Morning, Day, Dusk, Night) → home → evening → sleep → Night Shuffle.**
- The roaming clock is **4 phases × 4 real minutes = 16 min**, running only while roaming (paused in combat, menus, at the Lot and inside Haru's wall). The **phase dial** (a sun over a roofline, no digits) is the only clock. Night opens with the cat flap on L2D2; before that every day ends at Dusk.
- At **Dusk** the town chime sounds, the **Call** answers within one bar, and a bell-gold **Head Home** thread appears (≤ 60 s from anywhere). **No time fail state:** at the end Mikan grows drowsy and, after 60 s, the thread walks them home.
- **Curfew trade:** home by Dusk = the evening, Bond and **Well-Fed** tomorrow; out all Night = Night Rivals, Shinies, Clout, never Morsels. Neither is punished.
- **Losing a fight ends the day (OR-01, C2).** A loss is a Posse wipe (Scram and a fleeing Rival are not). After the victor's Gloat the clock jumps to **Night (720)** from any phase; before the cat flap this is a staged moon-blue nightfall the player cannot stay out in. **The street closes:** no encounters, Ambushes, Caterwauls, marking, pickups or Lot; the Head Home thread is drawn at once and the autopilot takes over after 60 s. Home is the **Routed Evening**: Haru is waiting and puts a sticking plaster on Mikan's ear (≤ 30 s), then the normal home verbs. A Keystone due that evening plays in its **Late form** (K1.3's keeps the Call); a Closing waits for the next morning. **Costs:** no Well-Fed, Bond as `late`, Night forfeit, 20% of the day's field haul (none in Life 1). The Stash and Tribute are safe and **a loss changes no territory**. Overnight runs as normal; the raid auto-resolves. At most one loss a day. Life 1 tutorial fights can't be lost; no loss is ever scripted.
- **Exactly three once-a-day actions** exist: the automatic Tribute pick-up, Share a Morsel, and the home "what changed today?" find. No daily list; nothing stacks.
- Sunspot nap: ≈ 15 real seconds, skips half a phase, fully heals the Posse (the only daytime heal). Suspend anywhere; autosave each phase, after every Verdict and at the loss jump.
- **Encounter density:** ≥ 2 engageable encounters within 30 s in every phase; 4–6 fights and 5–7 paused minutes a day. A staking challenger and the roaming Boss each count as one optional encounter; a join-in adds none. Life 2: ≤ 1 Rival Ambush a day.

**Numbers.** Budget (75th percentile): wake → door ≤ 0.25 min (≤ 1.5 with a vignette) · Doorstep ≤ 0.5 · Lot ≤ 1 (1.5–2 on first-use days) · roaming 12/16 · encounters 5–7 (4–6 fights) · way home ≤ 1 · evening ≤ 2 · **total ≈ 20–25, hard cap 30**. Weight: ≈ 50% territory, 33% combat, 17% home and story. **Losing on purpose never pays:** Settle In dominates a wipe in every currency (Territory §4.13); a wipe before clock 240 ends the outing sooner in real time (accepted residue).

**Worked example: Life 2 day 3 (24 min, the longest).** Sniff forecasts a raid on Laundry Pole Yard; at the Lot, post a Sentry, buy a Lesson, Share. Spray a faint post, Ambush two Toughs, take Tofu Shop Step from Kagi with the first Zoomies. **The Claim Spray fills the influence bar: Daifuku's yowl rolls down and he climbs to his Day stop, in view, on the running clock** (fighting him today is optional). Nap. Dusk chimes with **no Call**: Haru is late. Her late Call rises 2.5 clock-minutes later; Night falls. A `late` arrival, then *The Lamp at Night*. Overnight the Sentry meets the raid.

**The loss branch: L2D4 (15.5 min, a budgeted case, never scripted).** K2.5 in the morning; the Sniff carries the challenger and "Daifuku has come down off the walls"; rescue Sprays keep the bar full; Daifuku at his Day stop, Fired Up by his anger; a wipe in phase 3 → nightfall, the walk home, the plaster. The window survives (influence unchanged); the rematch on L2D5 meets him Calm and plastered (−10%).

**Connects to.** Pauses on Combat's encounter events; banks Territory's haul at `HomeArrived`; runs the overnight steps (§16); feeds Narrative `HomeArrived(on_time / late / routed)`; sequences influence, anger and the window across the day.

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

*Owner: combat designer · [`gdd/combat-system.md`](gdd/combat-system.md) · frames [`02-combat-clash.png`](previews/02-combat-clash.png), [`03-combat-slow-blink.png`](previews/03-combat-slow-blink.png), [`04-combat-pile-on.png`](previews/04-combat-pile-on.png)*

**Fantasy.** *"I'm the boss of a gang of very different cats, and I'm conducting a brawl."* Slapstick at maximum, but you never lose your cat, because every big effect answers something you did or ordered.

**Rules.**
- **No random encounters, no scene change, no combat inside Haru's wall.** A ≈ 10 m ring forms around visible opponents.
- You drive one Posse cat and switch instantly. Each has **one 3-hit string** (hit 3 = Style finisher), **Hop**, **Skitter** (≈ 200 ms invulnerable), **Brace** (red can't be Braced) and **Hiss** (8 s cooldown: interrupts yellow and Ruffles; a Tough at ≤ 15% Nerve **Backs Down**).
- **Telegraphs:** white = dodge or Brace; yellow (cream, dashed, triangle) = Hiss; red (magenta, zigzag) = get out.
- Hits fill the **Pounce Gauge** (100 = 1 Paw, 2 Paws per cat). **Moves** cost 1–2 Paws, fired by shortcut or in **Slow Blink** (time ×5%; command any cat; commands chain). Every Move is a **Set-up** (Ruffled, Splat, Clumped, Cowed) or a **Pay-off** that cashes one in.
- AI cats fight by **personality**, fill Paws at **50%**, fire Set-ups only when commanded and never spend their last Paw. **AI never targets its own Kin** (the player can still drive it in).
- **Frazzle** = stagger. **Ruffled** (4 s) doubles it. **Frazzled** = 6 s helpless, damage ×1.5.
- **Tag-In:** switch within **0.35 s** of landing a finisher, Pounce or Hiss interrupt; the incoming cat leaps in invulnerable with a free strike; both gain ¼ Paw. A **Relay** chains tags within 3 s (each cat once, up to 4; +10/+15/+20 flat Frazzle).
- **Pile-On:** on a Frazzled enemy with ≥ 2 Posse cats standing, North sends everyone into a dust cloud. Always Routs trash; on a Captain or Boss it is worth more the earlier you trigger it (5 draining pips).
- **Zoomies:** one limit-break per Style. **Nobody dies:** at 0 **Nerve** a cat is **Routed** and bolts. **A wipe is a loss:** the victor Gloats (≤ 3 s), any guest slips away, and Day Loop ends the day (§5). Combat applies no penalty of its own.
- **Fight-start statuses (OR-06, OR-07):** a Boss starts **Fired Up** (damage ×1.25) by his anger stage: Riled 20 s, Seething 40 s, Furious the whole fight (paused while he is Soggy). A recruit with **Old Gang Nerves** that sees its Old Boss starts **Cowed** (damage ×0.75; its AI won't target him) for 20 s (Fraidy 30 s) unless it resists or is Sworn; **a Tag-In to it clears Cowed at once** with a "steeled" bark.
- **The Nose-Touch guest (OR-13):** from Life 2 a truce cat or Friend whose own **Rival** is among the opponents may join after a 3 s yowl as an **allied AI guest**: not controllable, no Pile-On, counts toward the 10-cat cap. The opposing Rival's AI, targeting, buffs and lines are unchanged (G7).
- **Props and Fears:** bucket (Water), scooter horn (Loud Noise), cucumber on a crate (Cucumbers). A Fear Ruffles and adds Frazzle. Knock-offs from the High Road always Splat. **Damage numbers Off by default.**

**The 12 Moves** (★ = the 8 prototype Moves):

| Scrapper (Mikan) | Bruiser | Yowler |
|---|---|---|
| ★ Face Swat (1, Set-up Ruffled) | ★ Shoulder Check (1, Set-up Splat; pushes a Boss) | ★ Withering Hiss (1, Set-up Cowed) |
| ★ Scruff Toss (1, Set-up Splat) | ★ Belly Flop (1, Pay-off Clumped/Splat) | Howl (1, Set-up Clumped) |
| ★ Bunny-Kick (1, Pay-off Splat/Soggy) | Puff Up (1, Set-up Ruffled) | ★ Purr (1, heal; ×1.5 near Cowed) |
| Shred (2, Pay-off Ruffled/Frazzled) | Sit On It (2, Pay-off Splat/Frazzled) | ★ Banshee Screech (2, Pay-off Cowed; ring-wide) |

Zoomies: Midnight Laps · Landslide · Midnight Aria. Each Style resists its own damage type (×0.8) and is weak to one (×1.2): Scrapper to Thump, Bruiser to Fang, Yowler to Claw.

**Numbers.** Sim-checked (Alley): Tough 6–10 s · normal encounter 30–60 s · Captain 30–45 s (two Frazzles) · **Daifuku 2–3 min** (sim 166–176 s; 157 s at −10%; costed ≈ 3–3.5 paused min a Boss day) · Fed Up at 75 s. Rank Nerve ×1 / ×8 / ×20, damage 1 / 1.3 / 1.6. A basic hit ≈ 4.5% of a same-level cat's Nerve. Heals ≤ 60% of max Nerve per fight; ≥ 30% of damage always lands. **Feel:** one tier table T0–T5 (hit-stop 40 → 230 ms, stepped shake 0.4 → 1.6% of screen, impact frames, the single lettered word on player-authored T4/T5); AI cats' own hits render a tier lower. Safety overrides all of it (§15).

**Daifuku: "knock him off into the bucket".** He fights on whichever **patrol stop** he is at (§10): each stop is one arena kit with a wall, a knock-off edge and a water prop. Any knockback across the edge drops him (deterministic), Ruffled, wetter in the water. Three phases add Toughs (a seeded pick, never chosen by who is in truce or the Posse), a horn and a crumbling wall top. Fired Up by anger does not change his Nerve or phases: Furious raises the Posse's Nerve lost at the median from 52% to 61%. Each wipe plasters him −10% Nerve for the rematch (stacks to −30%) and spends his anger. In his fight Hige and a recruited Togemaru stare him down (defiant line, no status); a recruited Kagi flinches, Cowed, until you Tag-In to him.

**Worked example: cashing a Captain's Frazzle.** Pile-On at once: 4 × (2 + 6) × 1.5 = **48 MV** in 2.5 s. With no Paws banked, beating first then Piling On gives only 34 MV. With 2 Paws banked, two Moves in the ×1.5 window then a Pile-On at 4.5 s left gives **55 MV**. Paw management makes the Pile-On a decision.

**Connects to.** Asks Nemesis for `RivalCombatProfile` (+ `anger_stage`; on Crew cats `old_gang_nerves`, `old_boss_id`, `kin_ids`); spawns the guest on `AllyJoined`; emits the encounter events (§16); reads Crew's stats, learnsets and bonded pairs; owns the tier table Art draws, Audio mixes and Camera plays; Well-Fed gives ¼ Paw at fight start.

---

## 8. Crew and personality

*Owner: systems-designer · [`gdd/crew-and-progression.md`](gdd/crew-and-progression.md)*

**Fantasy.** *"I know these cats."* You take Pon because she makes the bucket hit harder and sulks if left at the Lot; you post Hige because nothing gets past an old Stalwart; you keep Togemaru because he was the first cat to call you Collar and now charges the biggest enemy for you, loudly. Teaching is the second pleasure: every Move a cat did not grow into, it took from another cat.

**Rules.**
- A Crew cat is in the **Posse** (Mikan + 3), a **Sentry** (2 slots; the Den's is the **Warden**, True+ Loyalty) or **Lounging**. Swap at the Lot, or in the field by **Tail-Up** (≈ 5 s, 30 s cooldown, never mid-fight).
- **Style sets stats** (Nerve, Bite, Hide, Voice, Zip); **personality sets everything else** and never changes. Nothing is bought or equipped. Slice Lv 1–10.
- **Exactly three recruitment routes (C4):** the **Recruit Verdict for a Bribe** (the only route for Rivals), a **story beat** (Hige, Pon) and the **Friend Stray** favour (Kinako). A truce cat or Friend may fight beside you as a guest but never joins. *(Cut: "Comes Knocking".)*
- **The Bribe (F1):** Life 1 recruits are free (onboarding). From Life 2 a Recruit costs **Fair or Feast**, paid from the Stash; there is no free tier. If the Stash cannot cover Fair, Recruit is greyed and Chase Off stays open. The Bribe sets only starting Loyalty; a Recruit always succeeds.
- **Joining:** a recruit keeps its Memory, Scars, Title, Fear and personality; its Strength becomes an always-on perk. A recruit from a gang writes **`OLD_GANG(boss)` into its own Memory** and gains **Old Gang Nerves** unless its personality resists (**resist: Braggart, Stalwart, Brooder; susceptible: Schemer, Fraidy, Goofball**). The Crew card shows an old-gang stamp. The Old Boss's record never changes.
- **Loyalty** shows only as a tier word and pose: **Shifty 0–29 · Aloof 30–44 · Steady 45–59 · True 60–79 · Sworn 80–100**. Steady+ can teach. Release at ≥ 60 is a clean parting; below 60 the cat is **Gone**.
- **Rare betrayal (OR-11), live from Life 2:** only an **ex-Rival recruit posted as a Sentry** at Shifty (< 30; Schemer < 35). Two **Wavering** mornings (a Sniff card, a turned-away pose, a Turf Board fix line), then on the third night it defects and keeps the Patch it guarded as a **turncoat** (never Low Wall Corner or the Den). Un-posting it, moving it to the Posse or Loyalty 30+ cancels it. Story recruits and the Friend Stray never betray. Slice bound: 0% (the earliest defection is a neglected Togemaru on Life 2 night 13).
- **Moves:** Instinct grants native Moves at Lv 1, 4 and 7; **Lessons** at the Lot (from L2D3) let any Steady+ cat teach a Move it knows. Mikan learns all 12, teaches 3 a day and slots ≤ 2 cross-Style. 4 slots per cat.
- **Bonded** pairs (Kin included) get a stronger Tag-In and +1 Loyalty a night when both are posted; **clashing** pairs lose 1 each per day together. No Loyalty input is keyed to a Verdict on another cat except two held '303 watch items (Schemer, Stalwart; Crew §3.7.6).

| Personality | Fights like | Combat perk | On guard | Likes / dislikes | Bonds / clashes | As a Rival |
|---|---|---|---|---|---|---|
| **Braggart** | Charges the biggest enemy | First hit on a leader +20 Frazzle | Defence ×1.25; Patch +10% Tribute; counters `gloat` | Posse time / benched (−2/day from day 3) | Goofball / Braggart, Fraidy | Loud; resists Old Gang Nerves; gate −5 |
| **Brooder** | Hangs back, avenges allies | Old Score ×1.5 | Never leaves; Scent decay ×0.5; counters `challenge` | Long service (changes halved) / dismissal | Stalwart / Schemer, Goofball | Grudge decays at half rate; resists; gate −5 |
| **Schemer** | Flanks; hunts Frazzled | +20% vs Frazzled | Sniff names the raid motive; counters `challenge` | Lessons / Nose-Touch Verdicts (watch item) | Fraidy, Goofball / Brooder, Stalwart | Ambushes; susceptible; gate 0; betrays below 35 |
| **Fraidy** | Keeps distance, supports | Perfect Skitter +¼ Paw | Weak; raises the Caterwaul early | Never Routed / being Routed | Stalwart, Schemer, Goofball / Braggart | Flees early; susceptible (Cowed 30 s); gate +5 |
| **Stalwart** | Guards the controlled cat | Allies within 3 m ×0.85 damage | Best defence (×1.5); counters `gang_orders` | Fair play / a Scuffed or Lost night on its own post (−3) | Brooder, Fraidy, Goofball / Schemer | Honourable; resists; gate +15 |
| **Goofball** | Goes for props | Props it triggers ×1.3 | **Laughs off a challenge** (a challenger's over-mark is 0); counters `grudge` | Share counts double / left at the Lot | All but Brooder / Brooder | Clowns about; susceptible; gate +10 (easy to Nose-Touch) |

| Slice cat | Personality · Style | Joins | Start Loyalty | Ties (Rivals board) |
|---|---|---|---|---|
| **Hige**, the old wall cat | Stalwart · Bruiser | Story, L1D1 ≈ 0:08 ("Use your whiskers, Collar.") | 60 True | Old Boss: Daifuku (an ex–Wall Sitter; resists) |
| **Pon** | Goofball · Yowler | Story, L1D2, after crows corner her | 55 Steady | — |
| **Kinako** | Fraidy · Scrapper | Friend Stray, L2D1 required objective (Interact within 4 m) | 50 Steady | Kin: Sasa (a Wall Sitter Tough) |
| **Togemaru**, the First Thorn | Braggart · Scrapper | Recruit Verdict from L1D2 (free), declared or not | ≈ 44 Aloof | Boss Daifuku; Rival Goma (resists nerves) |
| **Kagi**, Captain of Tofu Shop Step | Schemer · Yowler | Recruit Verdict from L2D3; fair 96 / feast 192; brings Banshee Screech | 40 / 45 | Boss Daifuku; Rival the second Captain (susceptible) |
| **Daifuku**, Boss | Brooder · Bruiser | Recruit after his Boss fight at any patrol stop, Regard ≥ 50 only | 56 / 61 | Gang: the Wall Sitters |

**Worked example: who sits out?** Six cats, three Posse places, two posts: one cat lounges daily. Never Pon (−2). Not Togemaru for long (posting counts as out, and a Shifty posted ex-Rival can Waver). The cosy Hige + Pon + Kinako Posse is all-bonded but has no Frazzle opener; Togemaru + Kagi + Pon cracks Captains, but in the Daifuku fight Kagi flinches until you Tag-In to him.

**Connects to.** Supplies `PowerRating` and `Loyalty` to Territory and Nemesis; Wavering flags at overnight step 1; learnsets keyed by Combat's `move_id`; `CatRecruited` triggers Nemesis's `OLD_GANG` entry.

---

## 9. Rivals (the nemesis system)

*Owner: systems-designer (nemesis/AI) · [`gdd/nemesis-system.md`](gdd/nemesis-system.md) · screens [`ux/key-screens.md`](ux/key-screens.md) §2–4 · frames [`05-rival-standoff.png`](previews/05-rival-standoff.png), [`06-fence-line.png`](previews/06-fence-line.png) (the Rivals board; pre-C6 layout), [`07-verdict.png`](previews/07-verdict.png) · UI name **Rivals**; "Nemesis" is an internal term only (G12)*

**Fantasy.** *"That one, with the kinked tail and the cowlick that never dries. I let him off with a nose-touch, and three days later he came yowling over the laundry poles to help me flatten Goma."* A petty, funny, persistent neighbour, not an orc warlord. The player should feel: *it remembers me; I marked it; the cat I spared fights beside me; it got one over on me; the town moved while I slept; it chose me.* Beside them: *the Boss is angry because of what I did to his walls*, and *my recruit flinches at the sight of its old boss*.

**Rules.**
- **≤ 12 tracked cats.** Each has a personality, a 10-entry **Memory** (≤ 6 pinned) of events it took part in, and hidden **Grudge** and **Regard** (0–100, never numbers). **Roles are fixed at generation** (Tough, Captain, Boss): no seats, no promotions, no demotions; nothing that happens to one cat ever moves another. Empty places wait for newcomers.
- **The Rivals board (C1, C6; replaces the Fence Line).** Every unique cat in town, each **gang staged as a scene in deep perspective**: the Lane's alley climbing away from the camera, **the Boss on a raised perch at the far end** (crown), the gang arranged **down the steps toward the camera by standing**, each cat with a **name ribbon and a short role tag** for its own fixed job (working set: Boss, Lieutenant, Enforcer, Sentry, Brawler, Scout, Patrol; UX finalises the words), and **dashed arrows showing who answers to whom**. A header carries the place name and the district's influence bar; a left column the facts (tonight's raid, the post's Scent, the objective); the focused cat's card sits bottom-left (personality, anger, ties); a button bar bottom-right. Other scenes: the uphill districts (authored silhouettes in haze, not discoverable in the slice), the **Outsiders** (challengers, newcomers, turncoats), the **Bell** (Mikan and the Crew) and **legend cards** for Gone cats. Read-only; View / J on the street and at the Lot (and on the walk home after a loss), never inside the house; unlocks on L2D1. Spec: [`ux/key-screens.md`](ux/key-screens.md) §2 (being revised for C6). *Roles and reporting lines are display of facts fixed at generation; they never change because of what Mikan did to another cat (v2 §5, G3, G11).*
- **Discovery.** An undiscovered cat is a flat silhouette in its place (a crown outline if a Boss), no name or tags. A cat is discovered by any encounter (Standoff, fight, Ambush, join-in), by a **Whisker Sense sniff** (hold 1.0 s within 10 m) or by joining the Crew (`CatDiscovered`).
- **Relationship tags (OR-04).** Hover (mouse) or focus (pad) a discovered cat and a small tag appears on every other **discovered** cat it relates to: **Boss / Gang**, **Rival**, **Kin**, **Old Boss / Old Gang** (stored only on the recruit). Words, never numbers; also listed on the card's Ties line. Tags are generation facts or the recruit's own memory. What each does, on the holder only: Gang says whose influence a Patch counts for; Rival enables the join-in and off-screen feud scuffles; Kin means AI never targets its Kin and two Kin in the Crew are bonded; Old Gang gives the recruit its nerves. Mikan's own standing with a cat is a pose, sprig or storm mark, never a tag.
- A **Standoff** (2–4 s) gives a name-card, a personal **yowl-sting** and one line from the cat's own history (memory lines unskippable for 1 s). **Silhouette Scars** record how Mikan won: Claw → ear notch, Thump → kinked tail, Yowl → folded ear, after its Water Fear → damp cowlick.
- **Lick In:** a Rival that flattens Mikan in a fight the Posse wins earns a Title. **After a wipe only the victor changes:** a `WON` entry, its Title if it has none, the Gloat; a Boss is plastered −10% and his anger spent. Only the victor may cite Mikan's plaster.
- **Adaptation:** the night after a cat **fled or slipped away**, it adapts to your habit (Ambushed → Roof-Wise; prop used → Got Over It; same finisher twice → resists it); every Rival keeps a way in.

| Verdict (one per fight, the highest-role Routed tracked cat; others slip away) | Available | The cat | Later |
|---|---|---|---|
| **Recruit** (Right) | Grudge < 90 or Regard ≥ 50; slice-recruitable (Togemaru, Kagi, Daifuku at Regard ≥ 50); room | Joins with Memory, Scars, Title; Grudge halved, Regard +10 | Costs a Bribe (free in Life 1) and a slot; may betray if neglected on a post |
| **Chase Off** (Left) | Always | **Gone for good:** leaves town, keeps a legend card | Never returns; a stranger may fill the gap |
| **Nose-Touch** (Up) | Pending Grudge < 50 + shift **and, from Life 2, a quiet take** | Steps down in peace: Grudge 0, Regard +25, a **10-day truce** (sprig) | May join your fights against its own Rival; at truce end a **Friend** (Regard ≥ 75) or a challenger for its old Patch |

**All three clear the post**; Mikan then Claim Sprays it. Nothing else in the district changes. The compass has no Down card. **Tells:** tail lashing = Nose-Touch closed; eyes and lean = the Bribe band; Mikan turning away = Chase Off. A closed Nose-Touch card names its reason: "Tail lashing. Not today." (Grudge) · "Too much of your stink on its post." (≥ 2 Counter-Sprays on a Keeper's own post) · "Still steaming. Not today." (a Boss met Seething or Furious). Life 1 is exempt from the quiet-take clause. **Why none dominates:** Recruit is the only one that adds a fighter and the only one that costs; Chase Off is free and final; Nose-Touch is free but earned (sneak, don't shout) and deferred.

- **The Nemesis slot.** Lives 1–2 have **exactly one**, held by the fixed **arc lead, Togemaru, the First Thorn**; never re-named. He is **declared** in the Sniff on the first night he has ≥ 3 encounters (a truce greeting counts) and ≥ 1 mark, or by the night after L2D3: **Sworn Enemy** (Grudge ≥ Regard) or **Sworn Rival**; storm mark; turns up daily until his arc closes. **All three Verdicts stay open on him, and each is a complete ending (F11):** Chase Off = gone with his farewell ("Fine! I've got other walls. Better walls!") and a "Run out of town" card; Recruit = "Wears the bell now", and he stares his old boss down in the Daifuku fight; Nose-Touch = a truce his daily greeting and join-ins carry, a Sworn Rival declared on night 3, a rematch when it ends. **His first Rout by the Posse always leaves a Scar.** Others at Grudge ≥ 75 are **Bitter**.
- **Boss anger (OR-07, C1).** Bosses only. Raised only by **marking acts on his gang's objects** (Over-mark +5, Counter-Spray +15), never by fights; −15 a night; shown as **0–3 steam puffs** (Calm / Riled / Seething / Furious) and a Sniff card at Seething+. It buys the Boss **Fired Up** in his next real fight and is **spent** by a win, a loss or his flight (not by Scram). It touches no other cat.
- **New cats, never moved cats (OR-10, OR-14, OR-16).** **Town events** (one per district every 2–3 nights) bring a **newcomer** (a freshly generated Tough into an empty gang place or a keeperless Patch) or a **feud scuffle** (a Rival pair; the loser wears a head plaster 2 days). **Challengers** arrive on a fixed calendar (§10). **The Usurper** (full game): a fresh Boss who stakes the Den of a Boss-less district where Mikan's influence is below 25; unreachable in the slice.

**Numbers.** Grudge per encounter: Routed +6, Pile-On +3, after its Fear +3, Ambushed +3, Keeper whose post was marked +6, fled +8, won a wipe +5; capped 35 for the first two encounters, 20 after; −2 a quiet night (Brooder −1; not the arc lead). Regard: clean win +8, Nose-Touch +25, Recruit +10, won join-in +5, Scram −8. Nose-Touch shift: Stalwart +15 · Goofball +10 · Fraidy +5 · Schemer 0 · Brooder −5 · Braggart −5. **Join-in** `p = 0.35 + 0.15·[near its old Patch] + 0.15·[Regard ≥ 75]`, cap 0.65; ≤ 1 joiner per encounter, ≤ 1 join per cat per day. Anger stages 0–29 / 30–59 / 60–89 / 90–100. ≤ 1 Rival Ambush a day (none in Life 1). **Sim:** one Nemesis record for 100% of seeds; arc achieved 100% for every policy; mixed-policy Verdicts chase 55 / recruit 8 / nose 37%; Nose-Touch open on 100% of Life 1, 82% of Life 2 Verdicts; challengers 0.98 per slice; **0 cats other than participants changed in ≈ 51,300 invariant checks.**

**Worked example: Togemaru** (Braggart, gate 45). L1D1 ≈ 0:20: "Nice bell, Collar. Does it ring when you run?"; at 25% he bolts (uninterruptible on day 1; G 25). L1D2 ≈ 0:28, on his gatepost: "I ran yesterday. Not off my own post, Collar." Two Over-marks and a Counter-Spray (Daifuku's anger +25, Calm); a Pile-On Routs him; **ear notch**; pending Grudge 43 < 45, so all three cards are open. From the yard Mikan **sniffs Daifuku** on his wall. **A, Nose-Touch:** a truce sprig; L2D1 he greets Mikan at the gatepost (encounter 3) and, if Goma is in the Persimmon Alley fight, may yowl in to help (p 0.50); declared a **Sworn Rival** in the L2D2 Sniff. **B, Recruit:** free; "Wears the bell now"; on L2D4 he faces Daifuku: "Not your cat anymore." **C, Chase Off:** gone, his farewell, a legend card. In every branch Life 2's pressure also comes from Daifuku's anger and window and the night-5 challenger.

**Connects to.** Consumes encounter events and `MarkApplied`; emits `VerdictApplied`, `TownEvent`, `CatDiscovered`, `AngerChanged`, `ChallengerArrived`, `AllyJoined`, `BetrayalTriggered`, `NemesisDeclared`, `RaidRequested`; places the Boss's patrol on `BossWindowChanged`; runs overnight step 3; owns bark triggers (Narrative writes the words: ≤ 60 characters, ≤ 240 lines). **Legal:** §19–20.

---

## 10. Territory and economy

*Owner: economy-designer · [`gdd/territory-management.md`](gdd/territory-management.md) · frames [`01-exploration.png`](previews/01-exploration.png), [`08-turf-board.png`](previews/08-turf-board.png), [`09-tribute-doorstep.png`](previews/09-tribute-doorstep.png)*

**Fantasy.** *"This wall is mine. That cat pays me in fish."* You are a cat other cats pay, and the Lane is never done with you: the bar fades, strangers stake your posts, and the Boss comes down off his wall when the whole Lane smells of you.

**Rules.**
- Each **Patch** has one landmark **Scent Post** and **Scent** 0–100, shown as 1–4 wisps in the owner's colour. **Strong** (60+) can't be taken by a raid (worst case Scuffed).
- **Fight to clear, spray to claim.** Read the Patch in Whisker Sense; erode rival Scent by marking: **Over-mark** a Rub Mark (−10, quiet if unseen) or **Counter-Spray** the post (−30, loud). The first loud or seen act sends 1–2 waves; at Scent ≤ 30 the **Keeper** comes; Rout it, give a Verdict, then **Claim Spray** (yours at 70). Quiet take: two Over-marks and one Counter-Spray (one wave; the Keeper's Nose-Touch stays open). Loud take: two Counter-Sprays (more fighting; from Life 2 the Keeper won't Nose-Touch; the Boss gets angrier). Your own **Rescue Spray** is offered only below Strong (→ 90). Every act emits `MarkApplied`.
- **Only territory acts, raids and time move Scent (G5).** A fight's outcome, a Verdict or a loss never does.
- **District influence (OR-08, C3)** is a read-out of Scent: in the Lane each outer Patch at Strong is worth 25, below Strong `scent/60` of 25. Shown as one **tug-of-war bar** (bell gold vs the gang's colour, the Boss's crown at the full end); the % appears only in the Turf Board header. **It decays for everyone:** your posts −10 a night (×0.5 on Home Ground), a Sentry refreshes +10, a gang's posts recover +8. Home Ground keeps the Lane's bar above 0.
- **The Boss window (OR-09).** At **influence 100** (all four outer Patches Strong at once) Daifuku's yowl rolls down and he **roams a three-stop patrol**, one arena-kit stop per phase: Morning Laundry Pole Yard's yard wall (wash tub) · Day Tofu Shop's back wall (rain barrel) · Dusk and Night the Den corner stone (the bucket). Challenge him within 8 m of his stop. The window stays open while influence is **≥ 75** at step 2; while open, held outer Patches **can't be Lost**. **Claim:** Rout him, any Verdict, then **Claim Spray the Den post** → `DistrictClaimed`, Clout Boss. Before the window he stays at the Den and ignores you ("Come back when the Lane smells of you, Collar."). His departure re-tasks nobody.
- **Raids:** from L2D2, one a night, requested by Nemesis and **forecast** in the Sniff (target, raiders' portraits, motive if a Schemer is posted). Overnight it resolves against Scent and the **Sentry**: Repelled −5, Scuffed −20 (Tribute stolen twice over) or Lost (flips to the attacker at 40). Motives and counters: `grudge` (Goofball), `gloat` (Braggart), `gang_orders` (Stalwart; the gang's fallback), `challenge` (Schemer, Brooder). If Mikan is out at Night it fires live as a **Caterwaul**: reaching the Patch in time multiplies the Sentry term ×1.5 **whatever happens in the brawl** (the presence rule); ignoring it is never worse than sleeping.
- **How ground is taken back (C3, C5):** raids; **challengers**, freshly generated newcomers who stake your lowest-Scent held Patch (never Low Wall Corner or the Den) on a fixed calendar: the first on the second night after Mikan first holds ≥ 3 Patches in a district (slice: **night 5, announced in the L2D4 Sniff**), then every 4th night, ≤ 1 active per district. By day it stands at the post (fight it for a Verdict; beating it adds no Scent); by night it over-marks −10 (a posted Goofball: 0) and takes the raid slot with `challenge`. Lost: it becomes the Keeper. Repelled twice: it leaves town. Also **newcomers** into keeperless Patches on town-event nights, and rare **turncoats** (§8).
- **Guard = Style × personality.** Bonded neighbours +25%; clashing neighbours −25% and −10% Tribute. **Tribute** lands as a pile on the Doorstep each morning, into the **Stash** (cap 400, always safe), plus a field haul from daytime fights and 6 caches.
- **The unified Turf Board (OR-17, C5):** four zones, one job each: **header** (district, influence bar with %, the crown, Lot tabs) · **map** (5 Patch stamps; wisps, one badge, the seated Sentry; no numbers) · **Tonight panel** (opens on tonight's threatened Patch: the threat, its Scent, tomorrow's Tribute; while carrying a cat, an odds bar in three segments with no percentages) · **Crew strip** (two Sentry pegs, each cat's chip, the totals). Numbers appear in exactly three places. **One decision a day:** who guards the threatened Patch, and so who leaves the Posse. ≤ 1 min at the Lot.

**Numbers.** `patch_tribute = base_yield × band × watch × (1 + min(bonus, 0.35) − clash)`; yields 8/10/12/14/18; Faint ×0.6, Clear ×0.9, Strong ×1; Unwatched ×0.8; Braggart +10%, Full House +10%. `I = round(100 × Σ min(scent,60)/60 ÷ n_outer)` over Mikan's outer Patches. **Prices:** Lesson I 40 / II 120 (×1.5 cross-Style); Bribe fair = 8 × level × (0.75 / 1 / 2 / 4 by rank), feast 2×; Share = Σ Crew levels; upkeep 2 per post. Tribute climbs **6 → ≈ 58 a day by the claim night** (anchor ≈ 60, target 54–66). Posting well beats random by **+24% over the slice and +33% on raid nights** (sim).

**Worked example: night 6 (L2D4), a challenger on Tofu Shop Step** (68 last night, the weakest post; `challenge` attack 1.76; the window is open, so nothing can be Lost). Nobody posted: Scuffed 95%, −10 Tribute, the bar sags toward 75. **Kagi** (Schemer, the counter): Repelled 79%, +7.3; one more Repel sends the challenger out of town. **Pon** (Goofball): no over-mark, the post stays Strong and the bar full, Repelled 40%. **Hige:** Repelled 75%, but the Posse loses its anchor on Daifuku's day. Or find the challenger by day and Rout it (≈ 2 min; a Verdict on a new cat; no Scent).

**Connects to.** Consumes encounter, Verdict and raid events; emits `PatchChanged`, `MarkApplied`, `InfluenceChanged`, `BossWindowChanged`, `RaidResolved`, `DistrictClaimed`, `TributeDelivered`; queries `PowerRating`; runs overnight steps 2 and 4; owns Clout and every price.

---

## 11. Dual Story Progression

*Owner: narrative-director · [`narrative/dual-story-progression.md`](narrative/dual-story-progression.md) · frame [`10-home-evening.png`](previews/10-home-evening.png)*

**Fantasy.** Twenty minutes a tyrant; then a bell-gold thread home, the camera drops at the wall, and a girl in yellow socks taps your bowl twice. You don't know why she's crying at her desk, but you know to sit on her paper. Three feelings: **detective of the ordinary**, **belonging earned by a cat**, **caring about a specific person**.

**Rules.**
- **The language rule:** no human utterance is ever intelligible. Speech is **Murmur**, writing is **Scribble**, in trailers too. Mikan's grasp shows as **Sense Icons** (fish, heart, ear; tone puffs Round / Spiky / Drooping / Bouncing). **Cats understand cats:** cat speech is readable balloons, but cats never explain the human story.
- **Three laws:** *Witness* (only what Mikan is present for), *Cat-Sense* (every fact through something a cat notices), *No-Translation*.
- **Gating:** each vignette has a day gate and a slot; **turf never gates a home beat**, only a Life's end. A loss shortens its day but never moves a day gate.
- **The Routed Evening (after a loss):** Haru is home and waiting at Night; she kneels and puts a **sticking plaster** on Mikan's ear (≤ 30 s), then the normal evening. A Keystone due that evening plays its **Late form** (K1.3's keeps the Call: the first Call is never lost); a Closing waits for the next morning slot.
- **The house:** no combat, no HUD beyond pictograms, clock paused, Crew never enter. Morning visit ≤ 15 s; evening ≤ 2 min. Free time: the **daily find**, the **piano** (walk the keys; Haru plays a bass under you), **Lap**, **Gift** (3 curios, the Gift Jar), **Knock**.
- Three face events in the slice; otherwise humans are knees, hands and laps.

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

Plus **Late Home** (L2D3 Dusk, a Routine variant): no Call, the bell alone, Gran lights the Lamp, Haru comes home late. It teaches "no Call = she's late, she will come" before Life 8 reuses that Dusk. By slice end Haru is **always late**, has **one piano Piece**, **takes Mikan's side against Gran**, and **studies too hard and cries alone**. Haru is yellow; Gran is plum.

**Numbers: Bond.** 0–10 hearts, never decreases. Daily points: home by Dusk 1.0, late or routed 0.5, Lap 0.5, find 0.5, Gift 0.5, Comfort 0.5; cap 2.5. **Well-Fed** next day (not after a loss): Zoomies starts at 5% per heart; every Posse cat starts fights with ¼ Paw. *Example:* ≈ 2.0 points a day for 7 days = 14 = **4 hearts**; a night owl ends at 3.

**Connects to.** Consumes `HomeArrived` and `DayEnded`; emits `KeystonePlayed`, `BondChanged`, `LifeAdvanced`; overnight step 5; gives Audio the Call system, Art the colour script, Nemesis the Routine tags Rivals taunt ("Home by dusk, every day. We noticed."). Narrative writes every line, each from the speaker's own history (G8).

---

## 12. Art direction

*Owner: art-director · [`art/art-bible.md`](art/art-bible.md) · mock-up kit [`previews/kit/`](previews/kit/README.md)*

**Ink what acts, paint what stays.** Everything that moves, fights, can be knocked over or loves you is a flat two-tone cel with a thin, even **Aubergine Ink** line (`#33273B`, 2 px at 1080p). Everything that stays put is soft, unlined paint, with painted skydome and backdrop cards. An inked bucket on a painted wall is obviously the bucket you can knock off.

**Principles:** read from behind; thirty centimetres tall; colour says what words cannot; loud street, quiet house; printed characters, painted world.

**Palette highlights:** Paper Cream and Cocoa UI; **Mikan Ginger** reserved for the hero; **Bell-Gold** for everything that is the player's (the influence bar's left side); **Haru Yellow** exclusive inside the house; **Wall Sitter Sage** for the slice's gang; **Frazzle Magenta** the loudest combat colour; shadows Wisteria, never grey. Phase keys Morning, Day, **Dusk** (the key-art hour), Night in bright moon-blue (also the loss nightfall). Rivals marks: steam puffs (anger; Collar Crimson with a zigzag twin at Furious), the truce sprig, the storm mark, legend cards, the challenger's staking stamp.

**Characters:** cats from bean, chestnut and pom shapes; one animation set per personality (plus the old-gang flinch and the defiant stare); a coat generator that never produces Mikan's look or a Scar shape. Humans are naturalistic, seen from the knee. **Combat VFX** draws Combat's tiers, including hand-lettered onomatopoeia (English and Japanese). **Reference closeness (user decision 2026-11-24): reference-close on the visuals.** Characters are 3D cel-shaded to read like 2D cels; environments read like 2D painted anime backgrounds; both are full 3D for a free-rotating camera. **Originality:** a look target only; all characters, names, locations and assets are original; home key art never uses the inside-looking-out veranda frame. A one-alley look-dev test in Unreal Engine 5.8 proves the method first. The **Rivals board scene** (C6) is a staged perspective diorama of a painted alley: Art owns its set and lighting per phase.

---

## 13. Audio direction

*Owner: audio-director · [`audio/sound-bible.md`](audio/sound-bible.md)*

**Two worlds, one thread.** **The Street** is a Showa gangster picture for brass, taiko and shamisen, played straight about four-kilogram animals. **The House** is a chamber room: upright piano, reed organ, wall clock, a human voice through its chest. **The thread** is **the Call** (three sung notes, E4–G4–C4) and Mikan's brass **bell**. Test: eyes closed, you know within a second whether you are a boss or a pet.

**Pillars:** music is the translator; heard from 25 cm; a kilogram of cat, a tonne of sound; a voice you'd know in the dark; teach the hole before you dig it.

**Rules.** The Call is Mikan's name and the main theme, first heard at K1.3; its cell sounds only in a voice, in the street **Brass Call** (grows with Clout) and at Late Home's door; **Haru's Melody never contains it**. The Dusk pull: chime → Call within one bar → bell on the fourth beat. **Murmur** is prosody only, safety-gated against real phonemes; never comic. 8 bark intents per voice body and a personal yowl-sting per Rival. **New cues (owner pass):** the moon-blue nightfall after a loss and the Late form of K1.3 with the Call; **Daifuku's yowl** rolling down when the window opens (in view, uninterrupted on L2D3); the challenger's arrival sting; the 3 s join-in yowl; steam-puff huffs by anger stage. **Budgets:** ≤ 25 min music, ≤ 240 barks. Every load-bearing sound has a visual twin (§15).

---

## 14. UX, HUD and key screens

*Owner: ux-designer · [`ux/hud.md`](ux/hud.md), [`ux/key-screens.md`](ux/key-screens.md) · desktop only: gamepad first, full keyboard and mouse; no touch or phone layout*

**Three HUDs.** *Street:* the world is the interface; one phase dial plus on-demand Patch tag (a steam puff when a marking act angers the Boss), Caterwaul and Ambush flares, the Call glyph, Head Home prompt, barks; the Whisker Sense compass ticks for the roaming Boss's stop and a challenger. **The closed street** after a loss: moon-blue, only the thread, the phase dial and the Rivals binding. *Combat:* a conductor's score in the corners (Posse plates bottom-left, a guest plate with its sprig, Zoomies bottom-right, ribbon for named Rivals); the Frazzle bar and Pile-On ring sit **on the enemy**; centre and bottom-centre are keep-outs. *Home:* no interface; the HUD fades at the wall over 800 ms; pictograms only, except the **Doorstep Morning Sniff**.

| Screen | What it is |
|---|---|
| **Rivals board** | Per-gang perspective scenes (§9): Boss on the far perch, gang down the steps with name ribbons and role tags, answers-to arrows, silhouettes until discovered, hover/focus tags, anger puffs, sprigs, legend cards; header with place and influence; facts column; cat card. Read-only; never in the house |
| **Rival card** | One cat's history: Memory lines, Scars, Title, ties, anger (Bosses), how to discover it if unmet |
| **Verdict** | Three cards (Up Nose-Touch, Left Chase Off, Right Recruit) with honest tells; Bribe row (Fair · Feast; "Free" in Life 1); halftoned cards name their reason; hold 600 ms or press-confirm; no timer. "Every choice clears the post. Then spray it." |
| **Loss** | No defeat card: the victor's Gloat → a 2 s nightfall iris → a haul tally → the walk home on the closed street |
| **Turf Board** | The four-zone board (§10); first look on L2D1 (≤ 15 s), first posting on L2D2 (≤ 45 s median) |
| **Morning Sniff** | Tribute card, raid forecast, ≤ 3 Rival items in one priority order: Wavering > Declaration / arc closing > challenger > Boss window > anger > the arc lead > town events. Out in ≤ 30 s |

**The numbers rule:** *numbers count what the cat owns or pays; never a feeling, a relationship or a human.* Grudge, Regard and Loyalty are never numbers; anger is puffs and a stage word; influence % only in the Turf Board header; truce days and challenger Repelled pips are calendar counts; damage numerals Off by default. **Onboarding:** one new verb every 60–90 s, situation first, then a ≤ 6-word hint card; the home teaches nothing with text.

---

## 15. Accessibility

*Owner: ux-designer · [`accessibility-requirements.md`](accessibility-requirements.md) (project-wide floor)*

**Flash and motion safety overrides every feel value:** ≤ 3 flashes/s over > 20% of the screen (design cap 2); ≤ 1 full-screen impact frame/s (a runtime arbiter downgrades extras); local impact ≤ 15%; no saturated red change over > 5%; every look event ≥ 2 frames; stepped shake; global hit-stop ≤ 20% of any second. **The default build must pass a Harding-style analysis before any public footage.** The nightfall iris and the Rivals board's "Last night" replay are screened too.

**Slice options:** Reduce Flashes, Reduce Motion (also stops the board's parallax and thread draw), shake and hit-stop sliders, onomatopoeia On/Smaller/Off, camera comfort; text to 150% (floor 28 px at 1080p); full per-context remapping; a toggle for every hold and one button for every chord; Slow Blink full pause; Kitten difficulty; keyboard-only and gamepad-only completion. **No state by colour alone:** every signal has a shape twin. **Nothing depends on hover:** every tie is also on the card's Ties line, and pad focus shows the same tags. **Deaf/HoH parity without captions:** the always-on **Call glyph**, bell glint, Dusk lamp wave, ear Sense Icon, tone puffs, sting glyphs, haptics. **REQUESTs pending with Combat:** Auto Slow Blink, a wider Tag-In window, combat speed 70/85%, hold-to-string, hit-stop 0%.

---

## 16. Cross-system map

**One Cat Schema:** `id, name, title, coat_seed, style, personality, level, xp, stats{5}, moves[4], zoomies, signature_strength, traits{strengths,fears,scars}, loyalty, grudge, regard, memory[], rank (fixed), former_rank, clowder, assignment, relations[], discovered, old_gang_nerves, anger (Bosses), truce_until_day, wavering_nights, keeper_of`.

| Event | From | → To |
|---|---|---|
| `EncounterStarted` (opener: standoff / ambush_by_player / ambush_by_rival / raid_defence) | Combat | Nemesis, Audio, UX, Day loop |
| `CatRouted`, `MoveUsed`, `TagIn`, `FearTriggered` | Combat | Nemesis, Crew, Audio, VFX |
| `EncounterEnded` (win / loss / player_fled / rival_fled) | Combat | Nemesis, Territory, Crew, Economy, Day loop |
| `VerdictApplied` (chase / recruit / nose) | Nemesis | Territory, Crew, Economy, UX |
| `TownEvent` (newcomer / feud_scuffle; replaces `WallEvent`), `NemesisDeclared`, `RaidRequested` (grudge / gang_orders / gloat / challenge) | Nemesis | UX, Territory, Narrative |
| `CatDiscovered` (encounter / sniff / crew), `AngerChanged`, `AllyJoined` | Nemesis | UX, Audio; Combat (anger at fight start, the guest) |
| `ChallengerArrived` (calendar / truce_end), `BetrayalTriggered` | Nemesis | Territory, Crew, UX, Audio |
| `MarkApplied(patch_id, district_id, kind ∈ {over_mark, counter_spray, claim_spray, rescue_spray}, target_clowder)` | Territory | Nemesis (anger; the quiet-take count), Audio |
| `InfluenceChanged`, `BossWindowChanged` | Territory | UX, Audio; Nemesis (patrol placement) |
| `RaidResolved` (+ presence) | Territory | Nemesis, UX |
| `PatchChanged`, `DistrictClaimed` | Territory | Nemesis, Economy, Narrative, Art, Audio |
| `CatRecruited` | Crew | Nemesis (`OLD_GANG`), UX |
| `TributeDelivered` | Economy | UX, Narrative |
| `HomeArrived` (on_time / late / routed) | Day loop | Narrative, Audio, Territory |
| `KeystonePlayed`, `BondChanged` | Narrative | Audio, UX, Nemesis, Combat |
| `PhaseChanged`, `DayEnded`, `LifeAdvanced` | Clock | Everyone |

Queries: Combat → Nemesis `RivalCombatProfile`; Territory and Nemesis → Crew `PowerRating`, `Loyalty`. **Invariant tested in every system's ACs:** a Verdict, a loss, a join-in or an anger change alters no cat other than its subject.

**Overnight step order (Night Shuffle).** Steps never reorder; no system reads a later step's output. Every draw uses a seeded substream `(save_seed, day, step, subsystem, cat, ordinal)`. Night *n* is the Shuffle that ends day *n*; its news is in day *n* + 1's Sniff.

| Step | Owner | Resolves |
|---|---|---|
| 0 | Day loop | Close the day: haul banked (−20% after a loss), Posse healed, Routine tags, Well-Fed flag, `DayEnded` |
| 1 | Crew | Loyalty deltas (−3 per Routed Posse cat after a loss); Sentry XP; Wavering flags |
| 2 | Territory | Scent decay and refresh; challenger over-mark; upkeep; **tonight's raid or challenge**; influence and the Boss window (open at 100, closes below 75) |
| 3 | Nemesis | Betrayals; town events; the challenger calendar and truce expiry; adaptation; Grudge and anger decay; the Declaration; **tomorrow's raid request** (challenger first) |
| 4 | Economy | Tribute to the Doorstep |
| 5 | Narrative | Next morning slot; Life-end check |
| 6 | Day loop | Autosave; next day; montage, title card or wake |

**A raid across systems:** step 3 requests it → the morning Sniff forecasts it → the player posts a counter on the Turf Board → that Night it fires as a Caterwaul or resolves at step 2 → the Doorstep pile shows the result.

---

## 17. Slice onboarding and pacing

*Clock times: [`gdd/day-loop.md`](gdd/day-loop.md) §3.9–3.11 (the budget owner); teaching sheet: [`ux/key-screens.md`](ux/key-screens.md) §7 (aligned to it).*

| Time | Beat | Taught |
|---|---|---|
| 0:00–0:04 | **K1.1**; Haru hums her Piece (not the Call) | Camera |
| 0:04–0:08 | Garden; a crow on the **lane-side wall top** | Move, Hop, Attack, Skitter |
| 0:08–0:10 | **Hige**: "Use your whiskers, Collar." | Whisker Sense; first recruit |
| 0:10–0:15 | Two Strays (tutorial fights can't be lost) | Switch, Paw, Slow Blink, command, Frazzle, **two-cat Pile-On ≈ 0:14** |
| 0:15–0:20 | Low Wall Corner escalation; its Keeper is an untracked Stray; **Claim Spray: Patch 1** | Scent, Rub, Spray, Hiss, Back Down |
| 0:20–0:25 | **Togemaru** flees (uninterruptible on day 1); nap to Dusk; Head Home; **K1.3, the first Call** | Standoff, Brace, nap, home |
| 0:25–0:27 | Day 2: first Tribute, 1-item Sniff, the Lot | Doorstep, Lot, Share |
| ≈ 0:28–0:32 | Togemaru's gatepost: **first memory line ≈ 0:28**; **first Verdict** (three cards); **Patch 2**; sniff Daifuku from the yard | Tag-In, Verdict, sniff-to-discover |
| 0:32–0:45 | **Pon** joins; Relay; **K1.4** at 0:40–0:45; Life-end sleep | Relay |
| 0:45–1:00 | Montage; L2D1: K2.1, **the Rivals board**, **Kinako**, Ambush, **Patch 3**; influence ≈ 75 | Rivals board, tags, influence, Ambush |

**Life 2, one headline a day:** **D1** Ambush, the Rivals board and the influence bar (a ≤ 15 s Turf Board look) · **D2** the first forecast (often beside the Declaration), Sentries and the Turf Board's one decision, props and Fears, the cat flap, Night and the Caterwaul · **D3** Lessons, Zoomies on Kagi, **the Tofu Shop Step Claim Spray opens the Boss window** (Daifuku climbs down in view), Late Home, K2.2 · **D4** K2.5, **the first challenger** (Sniff), **the Daifuku fight** at his stop (a lost attempt is the budget's long case) · **D5** the rematch, **Claim Spray the Den**, the Life-end sleep. Taught when they first happen: a join-in, the first loss, a Nose-Touch card closed by a loud take ("Spray quietly to make peace."), the first Gone cat, the first Wavering morning.

| Day | Min | Combat | Territory | Home | Story | Beats |
|---|---|---|---|---|---|---|
| L1D1 | 25 | 9 | 8 | 2 | 6 | K1.1, Pile-On 0:14, Patch 1, Togemaru flees, K1.3 |
| L1D2 | 20 | 7 | 10 | 1.5 | 1.5 | Memory line, first Verdict, Patch 2, Pon, K1.4 |
| L2D1 | 20 | 7 | 9.5 | 1 | 2.5 | K2.1, Rivals board, Kinako, Ambush, Patch 3, influence ≈ 75 |
| L2D2 | 23 | 7.75 | 13 | 1 | 1.25 | Declaration + forecast, Sentries and Turf Board, K2.3, Caterwaul |
| L2D3 | 24 | 6.75 | 15.5 | 0.75 | 1 | Lessons, Kagi, Zoomies, Patch 4 → **Boss window opens**, Late Home, K2.2 |
| L2D4 | 15.5 | 3.5 | 7.25 | 1.75 | 3 | K2.5, challenger + window Sniff, rescue Sprays, Daifuku attempt lost → Night, the Routed Evening |
| L2D5 | 16 | 7 | 7.5 | 0.75 | 0.75 | Rematch (−10%, Calm), Den Claim Spray, suitcase, title card |
| **Total** | **143.5** | **48 (33%)** | **70.75 (49%)** | **8.75 (6%)** | **16 (11%)** | |

Combat and territory alternate inside every day; neither runs > ≈ 4 min without the other except Daifuku. **Fast path** (Daifuku won on L2D4): 6 days, ≈ 2 h 08. Each extra Boss wipe adds one rematch day, ≈ 16 min. L2D3 (24.9 typical) has no slack: the window reveal must stay in view, on the running clock. *(The K1.4 and Turf Board-day disagreements of v1.1 are resolved.)*

---

## 18. Prototype plan

**Build first** (brief §10):
1. **Combat grey box** — the highest risk. Mikan + 3; 3 Styles; the 8 ★ Moves; Tag-In, Relay, Pile-On; a Captain; a 3-phase Daifuku on one patrol-stop arena kit with the bucket, Fired Up by anger stage; Cowed from Old Gang Nerves and the Tag-In that clears it; the join-in guest; personality AI for **Stalwart Hige, Goofball Pon, Braggart Togemaru** (test the Brooder separately). Camera Explore/Combat/Slow Blink/Cinematic; the tier table with the safety arbiter and a Harding capture.
2. **Sims** (kept as regression checks): [`reviews/round-3/sim/`](reviews/round-3/sim/) and the owner-feedback sims [`reviews/owner-feedback/sim/`](reviews/owner-feedback/sim/) (combat with anger and nerves, Nemesis slice and 30-day runs with the patent invariant self-test, territory economy and posting stakes, day budget). **Owed:** Crew's Lives 1–2 sim for betrayal rate (AC-23) and pacing (AC-6).
3. **One-alley look-dev test (Unreal Engine 5.8):** cel shader and line rule matched to the reference, painted sky cards, camera collision in 1–2 m corridors and on roofs.
4. **Home mock:** Main Room, face-out clamp, a two-cut vignette, Mikan at 1.25× in a lap.
5. **Browser showcase first** ([`production/artifact-slice/IMPLEMENTATION-PLAN.md`](../production/artifact-slice/IMPLEMENTATION-PLAN.md)): a ≈ 14-min desktop-only stakeholder build of the owner's direction, starting with the M0 look-dev go/no-go. Throwaway code; its data tables and findings carry over.

**Questions it must answer.**
- Is conducting fun at 20 min (≥ 75% do ≥ 1 Tag-In and ≥ 3 commanded Moves per normal encounter)?
- Random pause: do ≥ 90% find their cat within 1 s and name the telegraph? Do ≥ 70% say how a Crew cat fights differently?
- Do AI Paw habits ever fire (first self-cast ≈ 60 s; levers: spend at 1 Paw, `ai_fill` 0.6)?
- Is Daifuku 2–3 min at every anger stage, and do ≥ 60% bucket him unaided? Can a Life 1 kitten beat Togemaru?
- Then, in the slice build: does a day fit 25 min (L2D2/L2D3 have no slack; measure Lot time first)? Is posting a real choice? **Is Nose-Touch ≤ 60% of Verdicts, and can testers say why a card closed?** Does the influence bar read without a street strip (key-screens A-7)? Does the closed walk home read as a sting, not dead air? Does a flinching recruit or a join-in come up unprompted?

---

## 19. Risks

| Risk | Mitigation |
|---|---|
| **Scope** | Slice first; Backlog discipline; three districts; OR-18's "deliberately not added" list |
| **Wordless legibility** | Vocabulary before use; colour, objects, instruments; muted no-briefing tests |
| **Nemesis without voice** | Personality animation, Scars, yowl-sting, one sharp line from the cat's own history |
| **Four-cat readability** in third person | Keylines, chevrons, edge arrows, decals above dust, one screen-wide effect, random-pause test |
| **Environment cost** (sky and every angle visible; the Rivals board is a second staged set per gang) | Look-dev test; one district first; one board scene in the slice |
| **Tonal whiplash** | Hard street/home separation; HUD falls away at the wall; the plaster beat is tender, not punitive |
| **Style proximity** / **procedural variety** | Originality rule, own UI shapes and content, free camera, mock-frame review / personality sets, coat generator |
| **Nemesis patent family** (US 10,926,179; 11,660,540; 12,201,908; pending US 2025/0108303) | The analysis now rests on the **full claim text** of all 11 independent claims: [`legal/nemesis-patent-analysis.md`](legal/nemesis-patent-analysis.md) **v2** and [`legal/claims/`](legal/claims/). The design follows the working rule above and guardrails G1–G12 (v2 §5). **Not legal advice and no legal conclusion; this is distance, not clearance. Qualified US patent counsel must review the design against the claims before the Rivals scope locks and before any public showing** (v2 §1, §8). Watch items for counsel: Crew-side join-ins and two Verdict-keyed Loyalty inputs ('303, G10); the raid-requester and Ambush-candidate selection (OR-19 residuals); the Nose-Touch quiet-take gate and the Usurper's "no Boss on the street" check; and the C6 board's role tags and answers-to arrows, which make the gang hierarchy more visible ('908 A3; display only, roles fixed, G11) |
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
| 1 | **Patent counsel review** of Rivals against the full claims of the Warner Bros. family (v2 note, `legal/claims/`) | **Blocking:** qualified US patent counsel before the Rivals scope locks and before any public showing (trailers, store pages, demos, preview links outside the team). Counsel's question list: v2 §8.3; send list: v2 §8.2 plus the consistency pass's two new items and the C6 board |
| 2 | Cultural consultant for the home rituals | Before slice home content is final |
| 3 | Team size, budget, timeline | — |
| 4 | Haru's presentation: canon or selectable | Canon |
| 5 | Mikan customisation | Fixed iconic design |
| 6 | Does Life 9 imply Mikan's passing? | No; the last sound is the bell |
| 7 | Handheld floor | Switch 1-class |
| 8 | Night locked until the cat flap | Yes |
| 9 | Spraying as a sparkle cloud | Yes |
| 10 | Remaining doc alignments | Daifuku Lv 8 (Bribe 256) vs ≈ 9 (288); Pile-On prompt word vs hint card; Togemaru's Strength (+15% Nerve) vs Nemesis's slice list; the C6 role-tag words (one, "Sentry", collides with the Crew's guard role) |

*Settled by the owner 2026-11-24 (rulings §5; every answer matched the default):* the recruit's **own flinch** replaces the old boss's targeted trash-talk (pending counsel on a line-only taunt); Nose-Touch truce = **10 in-game days**; **Chase Off is final for everyone**, Togemaru included (his arc closes with an ending of its own); **recruit betrayal is on in the slice** (rare); **full influence = all four outer Patches Strong at once**. Also the owner's comments C1–C6 themselves (Rivals board and staged gang scenes, losing ends the day, district influence, the three-option Verdict, the unified Turf Board and challengers), and **no phone support** for the browser showcase (desktop only).

*Settled 2026-11-24:* **engine** — Unreal Engine 5.8; **title** — "Cat RPG", final; **reference closeness** — reference-close on the visuals, not the 3C.

*Settled 2026-11-23:* slice first; simplified FF7R-structure combat; personality as the Crew hook; third-person camera; three districts; readable cat speech; readable localised onomatopoeia.

---

## 21. Glossary

Terms not already defined where they first appear above. The full canon glossary is [`creative-brief.md`](creative-brief.md) §3.

| Term | Meaning |
|---|---|
| **Boss window** | The time a district Boss roams his patrol stops and can be challenged: opens at influence 100, closes below 75 |
| **Claim / Rescue Spray** | Spraying a keeperless post to make it yours at 70 / spraying your own post below Strong back to 90 |
| **Challenger / newcomer / turncoat** | A new cat staking one of your Patches on a calendar / a new cat filling an empty place / an ex-Rival recruit that defects with its post |
| **Clowder** | A district's cat gang; the player's is the Bell Clowder |
| **Clout** | Reputation milestones (House Pet → … → Great Boss); set Crew cap and Sentry slots |
| **Crew / Posse** | All recruits / Mikan + 3 in combat |
| **Discovered** | A cat met, sniffed or recruited; until then a silhouette on the Rivals board |
| **Gone** | Chased Off (or released below 60): left town for good; a legend card |
| **Influence** | A district's 0–100 read-out of how much of it smells of you |
| **Keeper** | The Rival holding a Patch |
| **Keystone / Texture / Closing / Plateau** | Required home beat / optional one / a Life's last Keystone / the house's "season" once Keystones run out |
| **The Lot** | Crew HQ behind the house: Posse, Turf Board, Lessons, Share a Morsel |
| **Morsels / Shinies** | Food currency / rare currency |
| **Murmur / Scribble** | Wordless human speech / illegible human writing |
| **Nerve / Routed** | HP / bolting in a dust puff at 0. Nobody dies |
| **Old Gang Nerves** | A recruit's own fear of its old boss: Cowed at the sight of him until you Tag-In to it |
| **Old Score** | Extra Frazzle when a Crew cat fights a Rival it has Routed or been Routed by |
| **Pounce Gauge / Paws** | The command resource; Moves cost 1–2 Paws |
| **Routed Evening** | The night-lit evening after a loss, opening with Haru's sticking plaster |
| **Sense Icon** | A pictogram of what Mikan grasps (fish, heart, ear, tone puffs) |
| **Stash** | Mikan's always-safe Morsel bank under the veranda |
| **Style** | Combat role and stats: Scrapper, Bruiser, Yowler (Prowler and Trickster later) |
| **Town event** | An overnight newcomer or feud scuffle, never caused by what Mikan did to a cat |
| **Truce / Friend** | 10 days of peace after a Nose-Touch / a truce cat with Regard ≥ 75, never hostile again |
| **Whisker Sense** | Hold mode: the world desaturates, scent trails glow, a compass ring points at marks, Rivals, the Boss's stop and finds |

---

## Changelog

- **1.2 (2026-11-24)** — Owner feedback C1–C6 compiled from OR-01…OR-21, F1–F12 and brief v1.6: losing ends the day (Night, closed street, the Routed Evening); the Rivals board replaces the Fence Line (discovery, tags; staged gang scenes per C6); three Verdicts (Humble removed; Chase Off final; gated Nose-Touch with truce and join-ins); Togemaru's three endings; Boss anger, Old Gang Nerves, Fired Up/Cowed; district influence, the Boss window and patrol (Den gate removed); challengers, newcomers, town events (no seats, promotions, wall events or Stewing); rare betrayal; the unified Turf Board; Bribe tiers; `MarkApplied` and the new events; pacing re-measured (143.5 min); patent risk re-based on the full claims (v2); owner answers recorded as settled.
- **1.1 (2026-11-24)** — The user's engine, title and art-style decisions (brief v1.4).
- **1.0 (2026-11-24)** — First compile from the round-3 design set.

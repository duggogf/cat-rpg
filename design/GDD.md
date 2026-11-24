# Cat RPG — Game Design Document (Vertical Slice)

| | |
|---|---|
| **Working title** | "Cat RPG" (recommended release title *Nine Lives of a Boss Cat*, OPEN) |
| **Version** | 1.0 · 2026-11-24 · compiled by the producer from the final round-3 design set |
| **Status** | Design final for the slice; ready to prototype. Open user decisions: §20 |
| **Canon order** | [`creative-brief.md`](creative-brief.md) v1.3 → [`director-rulings.md`](reviews/round-1/director-rulings.md) (DR-xx) → round-2 rulings R1–R5 (brief §5.7) → system docs. If this GDD and a source disagree, the source wins |

Read this once to know the game, the slice and how the systems fit; each section links its full spec. Mock-up frames: [`previews/`](previews/).

> **Superseded facts.** [`gdd/game-concept.md`](gdd/game-concept.md) and [`gdd/game-pillars.md`](gdd/game-pillars.md) predate the rulings. Their pillars and fantasy hold, but where they disagree **the brief wins**: the camera is **third-person behind the cat** (not bird's-eye or top-down); the town is **3 districts + the Lighthouse Summit, 20 Patches** (not 6 districts / 30); level cap **30** (not 50); main story **12–15 h** (not 22–28); **≈ 50 Moves, ≈ 58 vignettes** (not 60 / 100+); a small known Crew (not 24); **home beats are gated by day count, never by claiming districts**; a day is **≈ 20–25 min** (not 30); big hits show **one readable hand-lettered sound word** (user decision), not glyphs only.

---

## 1. One-page summary

**High concept.** A 3D third-person action RPG. You are **Mikan**, a ginger-and-white bobtail house cat in **Yunagi**, a Showa-nostalgic Japanese seaside hill town. You spray, brawl, recruit and tax your way from one garden wall to **Great Boss** of the town, leading a four-cat **Posse** in stylised real-time fights against **Rivals** who remember what you did to them. Every morning and evening you go home, where your human, **Haru**, lives a whole life you witness but cannot understand in words: school, leaving, love, a wedding, a baby, and then a door that stops opening.

**The fantasy: *Boss outside, pet at home.*** A ruthless little alley tyrant who still comes running when one particular human sings three notes.

**USP: Dual Story Progression.** Every in-game day advances both stories on one clock. The human story has no intelligible word, ever: only staging, objects, colour, light, music and wordless **Murmur**, seen from 30–60 cm off the floor. In Life 8 the story inverts the economy: the food tax you extorted all game becomes food you carry home to a grieving family.

**Key features.**
- **Conduct the brawl:** FF7 Remake's structure, Pokémon's roster, a cat's verbs, kept light. Switch instantly between four cats, time **Tag-Ins** into **Relays**, stagger with **Frazzle**, finish with the **Pile-On** dust cloud. Manga feel: hit-stop, stepped shake, impact frames, one hand-lettered sound word on big hits.
- **Rivals remember:** named cats keep a Memory of you, wear **Scars** you gave them, earn Titles for beating you, adapt and come back. Every win ends in a **Verdict**. Nobody dies, so everybody returns.
- **Six personalities** drive how a cat fights for you, guards for you, stays loyal, gets along, and behaves as a Rival.
- **Territory that feeds you:** take Patches, post Sentries against forecast raids, collect **Tribute** as a real pile of fish on Haru's Doorstep.
- **The house:** a daily sniff-out, a piano to walk on, and vignettes that make you care about one person.

**Audience:** 16–40; action-RPG players who also buy emotional indies; cat people. PEGI 7–12 / ESRB E10+. Solo, premium, offline. **Platforms:** PC (Steam) lead, controller-first with full KB/M, 60 fps; a handheld second at 30 fps (floor OPEN). The slice is PC.

**References** (structure and feel, never components): *Final Fantasy VII Remake* (combat structure, slow-mo commands, stagger) · *Pokémon* (recruit, teach, swap) · *Shadow of Mordor* (remembering enemies, a hierarchy screen) · *Shin chan: Shiro and the Coal Town* (art style only) · *Stray* (cat scale) · *Yakuza* (turf melodrama played straight and funny).

**Why it stands out.** Combat and Rivals carry the word of mouth ("my whole gang piled on, and I knocked the Boss off his wall into a bucket"); the wordless home story is why people remember it; territory carries half the play time. No other game puts a petty gang war and a quiet human life on one clock.

---

## 2. Pillars

Full text: [`gdd/game-pillars.md`](gdd/game-pillars.md).

| # | Pillar | Test |
|---|---|---|
| 1 | **Cat's-Eye Truth** | If a cat could not perceive, want or do it, it is not in the game. No intelligible human language, ever |
| 2 | **Two Lives, One Clock** | Every day advances both Mikan's turf and Haru's life; home is mechanically and emotionally unavoidable |
| 3 | **Conduct the Brawl** | Short, loud, readable cartoon brawls where you command four cats; feel beats simulation |
| 4 | **Rivals Remember** | Every named cat carries visible history with you; no Rival fight is anonymous or consequence-free |

Conflicts resolve in table order, but **priority is not investment**. **Anti-pillars:** no hunger/thirst/litter meters; not collect-them-all; not dialogue-driven; not grimdark (nobody dies on the streets); no time-pressure fail states; at most 3 once-a-day actions in the whole game; no multiplayer or live service; not FF7R-depth combat. **Tone:** scratches, puffed tails, dust clouds and sticking plasters, never blood. The streets are a comedy of status, the house a quiet drama; all real grief belongs to the home story, never undercut by a gag. The ending is sad, then warm.

---

## 3. The full game in brief (framing only)

| District | Patches | Levels | Boss | Lives |
|---|---|---|---|---|
| **Hidamari Lane** (garden walls, laundry poles, Haru's House) | 5 | 1–8 | **Daifuku**, enormous white-and-grey Bruiser who never leaves his wall | 1–2 |
| **Akane Arcade** (covered shopping street; shrine steps at night) | 7 | 8–18 | **Madam Sabi**, tortoiseshell Yowler (night Captain Oboro) | 3–4 |
| **Shiosai** (harbour, hot-spring inns) | 7 | 18–28 | **Ikari**, one-eyed salt-crusted Scrapper | 5–6 |
| **Lighthouse Summit** | 1 | 28–30 | **Botan**, Great Boss: a pampered inn cat in a silk collar, a pet like Mikan | 7 |

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

Lives 1–2 in Hidamari Lane: Mikan arrives as a kitten in the rain and becomes Boss of the Lane the week Haru's envelope arrives. It ends with Mikan asleep in Haru's empty suitcase, then the title card.

| Scope | Slice |
|---|---|
| **Lives / days** | 1–2 · 6–7 in-game days |
| **District** | Hidamari Lane; Haru's House (garden, entryway, Main Room with piano, Haru's room); the Lot; 4 Sunspots |
| **Patches** | 5: Low Wall Corner (Home Ground), Laundry Pole Yard, Persimmon Alley, Tofu Shop Step, the Den. 2 Sentry slots |
| **Rivals** | ≤ 12 tracked: the Wall Sitters' 8 seats (Daifuku, 2 Captains, 5 Toughs incl. the First Thorn) + 2 Roamers. Crows are the only Critter |
| **Crew** | Mikan + 6 recruitable, one per personality. Cap 6 |
| **Moves** | 3 Styles, **12 Moves**, 3 Zoomies, 3 Fears; Daifuku in 3 phases |
| **Nemesis** | All four Verdicts, Gloat, Lick In, wall events, Fence Line, exactly one declared Nemesis |
| **Territory** | Scent, Spray, Tribute, one forecast raid a night from Life 2 day 2, Caterwaul, Lessons I–II, Bribes, Share a Morsel |
| **Vignettes** | **11** (7 Keystones, 3 Textures, 1 montage) + Routine layer, daily find, piano |
| **Audio** | ≤ 25 min music; ≤ 240 bark lines |
| **Minutes** | ≈ 2–2.5 h (reference path 149 min; fast path ≈ 132) |

**Questions:** Is conducting four cats fun? Do players care about a Rival and about Haru within two hours? Is territory fun at this scale? Does a day fit ≈ 25 min? **Pass/fail tests:** two cats and a Pile-On by minute 15; a memory-citing Rival line before minute 60; ≥ 80% name a Rival and something specific Haru does; Keystone facts reach 90% of testers with audio muted; the flash test passes.

---

## 5. Day loop

*Owner: game-designer · [`gdd/day-loop.md`](gdd/day-loop.md)*

**Fantasy.** A cat's day, not a shift. Wake, check the pile on the step, nod to your crew, go out. Then the light turns gold, a chime rolls up the hill, a voice sings three notes, and you *want* to go home.

**Rules.**
- **Wake → Doorstep → the Lot → street (Morning, Day, Dusk, Night) → home → evening → sleep → Night Shuffle.**
- The roaming clock is **4 phases × 4 real minutes = 16 min**, running only while roaming (paused in combat, menus, at the Lot and inside Haru's wall). The **phase dial** (a sun over a roofline, no digits) is the only clock. Night opens with the cat flap on Life 2 day 2; before that every day ends at Dusk.
- At **Dusk** the town chime sounds, the **Call** answers within one bar, and a bell-gold **Head Home** thread appears (≤ 60 s from anywhere). **No time fail state:** at the end Mikan grows drowsy and, after 60 s, the thread walks them home.
- **Curfew trade:** home by Dusk = the evening, Bond and **Well-Fed** tomorrow; out all Night = Night Rivals, Shinies, Clout, never Morsels. Neither is punished.
- **Losing ends the outing, not the day:** Mikan slinks home, the clock jumps to Dusk, Haru puts a plaster on their ear, 20% of the day's field haul is lost (none in Life 1); the Stash is safe.
- **Exactly three once-a-day actions** exist: the automatic Tribute pick-up, Share a Morsel, and the home "what changed today?" find. No daily list; nothing stacks.
- Sunspot nap: ≈ 15 real seconds, skips half a phase, fully heals the Posse (the only daytime heal). Suspend anywhere; autosave each phase.

**Numbers.** Budget (75th percentile): wake → door ≤ 0.25 min (≤ 1.5 with a vignette) · Doorstep ≤ 0.5 · Lot ≤ 1 · roaming 12/16 · encounters 5–7 (4–6 fights) · way home ≤ 1 · evening ≤ 2 · **total ≈ 20–25, hard cap 30**. Weight: ≈ 50% territory, 35% combat, 15% home.

**Worked example: Life 2 day 3 (24 min, the longest).** Sniff forecasts a raid; at the Lot, post a Sentry, buy a Lesson, Share. Spray a faint post, Ambush two Toughs, take Tofu Shop Step from Kagi with the first Zoomies, nap. Dusk chimes with **no Call**: Haru is late. The player stays out; her late Call rises 2.5 clock-minutes later; Night falls. A `late` arrival, then *The Lamp at Night*. Overnight the Sentry meets the raid.

**Connects to.** Pauses on Combat's encounter events; banks Territory's haul at `HomeArrived`; runs the overnight steps (§16); feeds Narrative `HomeArrived(kind)`; keeps ≥ 2 encounters within 30 s in every phase.

---

## 6. Character, camera, controls (3C)

*Owners: technical-artist (camera), UX (map), Combat (actions) · [`gdd/camera-system.md`](gdd/camera-system.md), [`ux/hud.md`](ux/hud.md) §8*

**Character.** Mikan is a fixed design: white body, ginger cap over both ears, ginger patch over the left eye, pom-pom bobtail, amber eyes, **red collar with one brass bell**. Renameable, "they". Scrapper Style; no personality, no Loyalty. One global cat scale, **1.25× a real cat (≈ 0.56 m)**, street and home alike; humans and furniture true scale. Traversal: ground plus the **High Road** (walls, fences, roofs) as third-person platforming.

**Camera.** One rig behind and above the cat, like FF7 Remake, everywhere, with no scene transitions. *Small cat, big town* when exploring; the *conductor's seat* in a fight; *you are the pet* at home.

| State | Distance / height / pitch | Notes |
|---|---|---|
| Explore | 3.0 m / ≈ 1.0 m / +10° | Orbit; auto-recentre after 1.5 s |
| Combat | 6.0–7.2 m / ≈ 3 m / +25° | Frames the controlled cat (lower third) and its lock target; soft lock; edge arrows |
| Slow Blink | 8.5 m / 6.5 m / +50° | Tactical three-quarter |
| Home | 1.8 m / 0.3–0.6 m / ≤ 0° | Standing adults' faces clamped out within 2.5 m |

The garden wall blends Explore → Home in 1.0 s (no cut). Tag-Ins retarget in 0.3 s, so a Relay reads as one move. Camera only plays Combat's shake. Options: FOV, speed, auto-centre, invert, motion comfort.

**Final control map** (DR-08; all remappable; every hold has a toggle, every chord a one-button option):

| Gamepad | Exploration | Combat |
|---|---|---|
| Left / right stick (R3) | Move / camera (recentre) | Move / camera (lock-on; flick = next target) |
| West | Swat | **Attack** (3-hit string; airborne or from the High Road = **Pounce**) |
| South | Jump / Hop | Hop |
| East | Dash (hold = sprint) | **Skitter** (dodge) |
| North | Interact (Spray, Sniff, Nap, pick up) | **Hiss**; **Pile-On** when offered |
| R1 | — | **Brace** (hold) |
| R2 | **Whisker Sense** (hold) | **Slow Blink** |
| L2 | Stalk (hold) | — |
| L1 + face / L1 + R1 | — | Shortcut Move 1–4 / **Zoomies** |
| D-pad | Left/Right Tail-Up · Up Meow · Down Sit (hold = **Head Home**) | Switch: Up Mikan, Left/Down/Right Crew 1/2/3 (timed = **Tag-In**) |
| View / Menu | Fence Line / Pause | — / Pause |

**KB/M:** WASD + mouse · LMB Swat/Attack · RMB Brace · Space Hop · Shift Dash/Skitter · E Interact · F Hiss/Pile-On · Tab Whisker Sense/Slow Blink · Ctrl Stalk · 1–4 Moves · R Zoomies · Z X C V switch · V/T/C/H Tail-Up/Meow/Sit/Head Home · J Fence Line · Esc Pause. **In Slow Blink:** stick cursor, L1/R1 change cat, South confirm, East back, R2 close; Scram is a menu entry.

---

## 7. Combat

*Owner: combat designer · [`gdd/combat-system.md`](gdd/combat-system.md) · frames [`02-combat-clash.png`](previews/02-combat-clash.png), [`03-combat-slow-blink.png`](previews/03-combat-slow-blink.png)*

**Fantasy.** *"I'm the boss of a gang of very different cats, and I'm conducting a brawl."* Slapstick at maximum, but you never lose your cat, because every big effect answers something you did or ordered.

**Rules.**
- **No random encounters, no scene change, no combat inside Haru's wall.** A ≈ 10 m ring forms around visible opponents.
- You drive one Posse cat and switch instantly. Each has **one 3-hit string** (hit 3 = Style finisher), **Hop**, **Skitter** (≈ 200 ms invulnerable), **Brace** (red can't be Braced) and **Hiss** (8 s cooldown: interrupts yellow and Ruffles; a Tough at ≤ 15% Nerve **Backs Down**).
- **Telegraphs:** white = dodge or Brace; yellow (cream, dashed, triangle) = Hiss; red (magenta, zigzag) = get out.
- Hits fill the **Pounce Gauge** (100 = 1 Paw, 2 Paws per cat). **Moves** cost 1–2 Paws, fired by shortcut or in **Slow Blink** (time ×5%; command any cat; commands chain). Every Move is a **Set-up** (Ruffled, Splat, Clumped, Cowed) or a **Pay-off** that cashes one in.
- AI cats fight by **personality**, fill Paws at **50%**, fire Set-ups only when commanded and never spend their last Paw: the big moments are the player's.
- **Frazzle** = stagger. **Ruffled** (4 s) doubles it. **Frazzled** = 6 s helpless, damage ×1.5.
- **Tag-In:** switch within **0.35 s** of landing a finisher, Pounce or Hiss interrupt; the incoming cat leaps in invulnerable with a free strike; both gain ¼ Paw. A **Relay** chains tags within 3 s (each cat once, up to 4; +10/+15/+20 flat Frazzle).
- **Pile-On:** on a Frazzled enemy with ≥ 2 Posse cats standing, North sends everyone into a dust cloud. Always Routs trash; on a Captain or Boss it is worth more the earlier you trigger it (5 draining pips).
- **Zoomies:** one limit-break per Style, charged by damage taken and Frazzles. **Nobody dies:** at 0 **Nerve** a cat is **Routed** and bolts.
- **Props and Fears:** bucket (Water), scooter horn (Loud Noise), cucumber on a crate (Cucumbers). A Fear Ruffles and adds Frazzle. Knock-offs from the High Road always Splat. **Damage numbers Off by default.**

**The 12 Moves** (★ = the 8 prototype Moves):

| Scrapper (Mikan) | Bruiser | Yowler |
|---|---|---|
| ★ Face Swat (1, Set-up Ruffled) | ★ Shoulder Check (1, Set-up Splat; pushes a Boss) | ★ Withering Hiss (1, Set-up Cowed) |
| ★ Scruff Toss (1, Set-up Splat) | ★ Belly Flop (1, Pay-off Clumped/Splat) | Howl (1, Set-up Clumped) |
| ★ Bunny-Kick (1, Pay-off Splat/Soggy) | Puff Up (1, Set-up Ruffled) | ★ Purr (1, heal; ×1.5 near Cowed) |
| Shred (2, Pay-off Ruffled/Frazzled) | Sit On It (2, Pay-off Splat/Frazzled) | ★ Banshee Screech (2, Pay-off Cowed; ring-wide) |

Zoomies: Midnight Laps · Landslide · Midnight Aria. Each Style resists its own damage type (×0.8) and is weak to one (×1.2): Scrapper to Thump, Bruiser to Fang, Yowler to Claw.

**Numbers.** Sim-checked (Alley): Tough 6–10 s · normal encounter 30–60 s · Captain 30–45 s (two Frazzles) · **Daifuku 2–3 min** (sim 166–176 s) · Fed Up at 75 s. Rank Nerve ×1 / ×8 / ×20, damage 1 / 1.3 / 1.6. A basic hit ≈ 4.5% of a same-level cat's Nerve. Heals ≤ 60% of max Nerve per fight; ≥ 30% of damage always lands. **Feel:** one tier table T0–T5 (hit-stop 40 → 230 ms, stepped shake 0.4 → 1.6% of screen, impact frames, the single lettered word on player-authored T4/T5); AI cats' own hits render a tier lower. Safety overrides all of it (§15).

**Daifuku: "knock him off into the bucket".** He never leaves his wall; any knockback across its edge drops him (deterministic), Ruffled, wetter in the bucket. Three phases add Toughs, a horn, a crumbling wall top. Each wipe plasters him −10% Nerve for the rematch.

**Worked example: cashing a Captain's Frazzle.** Pile-On at once: 4 × (2 + 6) × 1.5 = **48 MV** in 2.5 s. With no Paws banked, beating first then Piling On gives only 34 MV. With 2 Paws banked, two Moves in the ×1.5 window then a Pile-On at 4.5 s left gives **55 MV**. Paw management makes the Pile-On a decision.

**Connects to.** Asks Nemesis for `RivalCombatProfile`; emits the encounter events (§16); reads Crew's stats, learnsets and bonded pairs; owns the tier table Art draws, Audio mixes and Camera plays; Well-Fed gives ¼ Paw at fight start.

---

## 8. Crew and personality

*Owner: systems-designer · [`gdd/crew-and-progression.md`](gdd/crew-and-progression.md)*

**Fantasy.** *"I know these cats."* You take Pon because she makes the bucket hit harder and sulks if left at the Lot; you post Hige because nothing gets past an old Stalwart; you keep Togemaru because he was the first cat to call you Collar and now charges the biggest enemy for you, loudly. Teaching is the second pleasure: every Move a cat did not grow into, it took from another cat.

**Rules.**
- A Crew cat is in the **Posse** (Mikan + 3), a **Sentry** (2 slots; the Den's is the **Warden**, True+ Loyalty) or **Lounging**. Swap at the Lot, or in the field by **Tail-Up** (≈ 5 s, 30 s cooldown, never mid-fight).
- **Style sets stats** (Nerve, Bite, Hide, Voice, Zip); **personality sets everything else** and never changes. Nothing is bought or equipped. Slice Lv 1–10 (≈ Lv 3 at Life 1's end; Posse Lv 7–9 at Daifuku).
- **Recruiting is deterministic:** a Recruit Verdict always works; the **Bribe** (none / fair / feast) sets only starting Loyalty. Life 1 recruits are free.
- **Loyalty** shows only as a tier word and pose: **Shifty 0–29 · Aloof 30–44 · Steady 45–59 · True 60–79 · Sworn 80–100**. Steady+ can teach. Betrayal unlocks in Life 3.
- **Moves:** Instinct grants native Moves at Lv 1, 4 and 7; **Lessons** at the Lot (from Life 2 day 3) let any Steady+ cat teach a Move it knows. Mikan learns all 12, teaches 3 a day and slots ≤ 2 cross-Style. 4 slots per cat.
- **Bonded** pairs get a stronger Tag-In and +1 Loyalty a night when both are posted; **clashing** pairs lose 1 each per day together.

| Personality | Fights like | Combat perk | On guard | Likes / dislikes | Bonds / clashes |
|---|---|---|---|---|---|
| **Braggart** | Charges the biggest enemy | First hit on a leader +20 Frazzle | Defence ×1.25; Patch +10% Tribute | Posse time / benched (−2/day from day 3) | Goofball / Braggart, Fraidy |
| **Brooder** | Hangs back, avenges allies | Old Score ×1.5 | Never leaves; Scent decay ×0.5 | Long service (changes halved) / dismissal | Stalwart / Schemer, Goofball |
| **Schemer** | Flanks; hunts Frazzled | +20% vs Frazzled | Sniff names the raid motive | Lessons / Nose-Touch Verdicts | Fraidy, Goofball / Brooder, Stalwart |
| **Fraidy** | Keeps distance, supports | Perfect Skitter +¼ Paw | Weak; raises the Caterwaul early | Never Routed / being Routed | Stalwart, Schemer, Goofball / Braggart |
| **Stalwart** | Guards the controlled cat | Allies within 3 m ×0.85 damage | Best defence (×1.5) | Fair play / Mikan Humbling (−3) | Brooder, Fraidy, Goofball / Schemer |
| **Goofball** | Goes for props | Props it triggers ×1.3 | Humbled residents never simmer | Share counts double / left at the Lot | All but Brooder / Brooder |

| Slice cat | Personality · Style | Joins | Start Loyalty |
|---|---|---|---|
| **Hige**, the old wall cat | Stalwart · Bruiser | Story, L1D1 ≈ 0:08 ("Use your whiskers, Collar.") | 60 True |
| **Pon** | Goofball · Yowler | Story, L1D2, after crows corner her | 55 Steady |
| **Kinako** | Fraidy · Scrapper | Friend Stray, L2D1 required objective (Interact within 4 m) | 50 Steady |
| **Togemaru**, the First Thorn | Braggart · Scrapper | Recruit Verdict from L1D2 (free), unless declared Nemesis | ≈ 36 Aloof |
| **Kagi**, Captain of Tofu Shop Step | Schemer · Yowler | Recruit Verdict from L2D3; brings Banshee Screech | 40 / 45 feast |
| **Daifuku**, Boss | Brooder · Bruiser | Recruit at the Den, Regard ≥ 50 only | 56 / 61 feast |

**Worked example: who sits out?** Six cats, three Posse places, two posts: one cat lounges daily. Never Pon (−2). Not Togemaru for long (posting counts as out). The cosy Hige + Pon + Kinako Posse is all-bonded but has no Frazzle opener; Togemaru + Kagi + Pon cracks Captains but leaves Hige or Kinako on the wall. Togemaru posted beside Kinako (clash) costs both.

**Connects to.** Supplies `PowerRating` and `Loyalty` to Territory and Nemesis; learnsets keyed by Combat's `move_id`; Loyalty at overnight step 1; a recruited Rival keeps Memory, Scars and Title, and its Strength becomes an always-on perk.

---

## 9. Rivals (the nemesis system)

*Owner: systems-designer (nemesis/AI) · [`gdd/nemesis-system.md`](gdd/nemesis-system.md) · frame [`05-rival-standoff.png`](previews/05-rival-standoff.png) · in-project name **Rivals**; marketing avoids the original name until counsel advises*

**Fantasy.** *"That one, with the kinked tail and the cowlick that never dries. I gave him both."* A petty, funny, persistent neighbour, not an orc warlord. The player should feel, in order: *it remembers me; I marked it; my choice mattered; it got one over on me; the wall moved while I slept; it chose me.*

**Rules.**
- **≤ 12 tracked cats** on the **Fence Line** (8 seats) plus Roamers. Each has a personality, a 10-entry **Memory**, and hidden **Grudge** and **Regard** (0–100, never numbers).
- A **Standoff** (2–4 s) gives a name-card, a personal **yowl-sting** and one readable line citing history (memory lines unskippable for 1 s; after an Ambush the line plays at the Rout).
- **Silhouette Scars** record how Mikan won: Claw → ear notch, Thump → kinked tail, Yowl → folded ear, after its Water Fear → damp cowlick. Generated coats never use these shapes.
- **Lick In:** a Rival that flattens Mikan in a fight the Posse wins earns a Title. After a wipe the victor **Gloats** and is promoted.
- **Adaptation** on a comeback answers your habit (Ambushed → Roof-Wise; prop used → Got Over It; same finisher twice → resists it), but every Rival keeps a way in.

| Verdict (one per fight) | The cat | The post | Comes back |
|---|---|---|---|
| **Chase Off** | Exiled | Yours | In 1–3 nights with escorts and an adaptation, then promoted, then the **Grand Standoff** |
| **Humble** | Stays on its crate | Yours, +15% Tribute | Simmers if Unwatched; Restless at 80 → uprising raid |
| **Recruit** | Joins with Memory, Scars, Title | Yours | Costs a Bribe and a slot (3 slice cats) |
| **Nose-Touch** | Accept: truce, Regard +25. Snub: bolts | **Accept: it keeps its post** | After the truce a friend yields the post |

- **Nemesis is a slot.** Lives 1–2 have **exactly one**: the **arc lead** (the First Thorn, **Togemaru**), **declared** in the Sniff once it has ≥ 3 encounters and a mark, or by the night after L2D3. It shows as **Sworn Enemy** (Grudge ≥ Regard) or **Sworn Rival**, wears a storm mark, can't be Recruited in the slice and turns up daily. Others at Grudge ≥ 75 are **Bitter**.
- **Wall events** (one per district every 2–3 nights) move the town overnight, always visible; the Sniff mentions only cats with history with you.

**Numbers.** Grudge: Rout +6, Pile-On +3, Fear +3, Ambush +3, Spraying its post +6, fleeing +8, Chase/Humble +10; capped 35 per encounter (20 after two); −2 a quiet night (Brooder −1; not the arc lead). ≤ 1 Rival Ambush a day (none in Life 1), countered by Skitter/Brace in the last 0.75 s of its 2.0 s sting. Sim: ≤ 15% of seated Rivals Bitter; one Nemesis at slice end for 100% of seeds.

**Worked example: Togemaru** (a first-timer who chases and Humbles). L1D1 ≈ 0:20: "Nice bell, Collar. Does it ring when you run?"; flees (G 25). L1D2 ≈ 0:30, on its own gatepost: "I ran yesterday. Not off my own post, Collar." Pile-On, Chase Off, **ear notch** (G 55). L2D1: returns adapted and Ambushes; flattens Mikan though the Posse wins (**Lick In**, Title *Bell-Ringer*); Hige's Thump gives a **kinked tail** (G 75). Night 3: **declared the Nemesis**; promoted; requests the first raid. L2D2: Declaration card; raid fires as the Caterwaul; Chase Off. L2D3 Dusk: **Grand Standoff**, "Cucumbers? I sleep on them now." Humbled (G 100). A pacifist is still declared on night 3, as a Sworn Rival (sim 100%).

**Connects to.** Consumes encounter events; emits `VerdictApplied`, `WallEvent`, `NemesisDeclared`, `RaidRequested`; runs overnight step 3; owns bark triggers (Narrative writes the words: ≤ 60 characters, ≤ 240 lines). **Legal flag:** see §20.

---

## 10. Territory and economy

*Owner: economy-designer · [`gdd/territory-management.md`](gdd/territory-management.md) · frames [`01-exploration.png`](previews/01-exploration.png), [`08-turf-board.png`](previews/08-turf-board.png), [`09-tribute-doorstep.png`](previews/09-tribute-doorstep.png)*

**Fantasy.** *"This wall is mine. That cat pays me in fish."* You are a cat other cats pay. Every Spray is a conquest or a rescue, never a chore.

**Rules.**
- Each **Patch** has one landmark **Scent Post** and **Scent** 0–100, shown as 1–4 wisps in the owner's colour. **Strong** (60+) can't be taken by a raid.
- **Taking a Patch:** read it in Whisker Sense; erode rival Scent (Rub −10 quietly, Counter-Spray −30 loudly, Routs −15); the first loud act sends 1–2 waves; at Scent ≤ 30 the **Keeper** comes for a Standoff; Rout, Verdict, **Claim Spray** (yours at 70).
- Your own **Spray** is offered only below Strong: a rescue to 90.
- **The Den** opens at 3 of 4 outer Patches; while open, outer Patches can't be Lost. Routing Daifuku claims the Lane. **Low Wall Corner** is the Home Ground: never raided, never lost.
- **Raids:** from L2D2, one a night, requested by Nemesis and **forecast** in the Sniff (target, raiders' portraits, motive if a Schemer is posted). Overnight it resolves against Scent and the **Sentry**: Repelled, Scuffed (Tribute stolen twice over) or Lost. If Mikan is out at Night it fires live as a **Caterwaul**; ignoring it is never worse than sleeping.
- **Guard = Style × personality.** Each motive has a counter at ×2: Stalwart vs `boss_orders`, Braggart vs `gloat`, Goofball vs `grudge`, Schemer/Brooder vs `pretender`. Bonded neighbours +25%; clashing neighbours −25% and −10% Tribute.
- **Tribute** lands as a pile on the Doorstep each morning, into the **Stash** (cap 400, always safe). Plus a field haul from daytime Routs and 6 caches. Territory numbers appear only on the **Turf Board**.

**Numbers.** `patch_tribute = base_yield × band × watch × (1 + bonus − clash)`; yields 8/10/12/14/18; Faint ×0.6, Clear ×0.9, Strong ×1; Unwatched ×0.8; Braggart +10%, Humbled +15% (+25% with a Goofball), Full House +10%. Full pay 2 days after a visit, then −20%/day. **Prices:** Lesson I 40 / II 120 (×1.5 cross-Style); Bribe fair = 8 × level × (0.75 / 1 / 2 / 4 by rank), feast 2×; Share = Σ Crew levels; upkeep 2 per post. Tribute climbs **6 → 65 a day** by the claim (anchor ≈ 60). Posting well beats random by **+45% on raid nights** (sim).

**Worked example: night 7.** The Sniff shows one portrait, a Captain, for Persimmon Alley (53 after decay). No Schemer posted, so "?"; an ex-Keeper alone suggests `pretender`. Do nothing: Lost 95%, ≈ 32 Tribute. Move Togemaru there: Repelled 63%, ≈ 53. **Post Kagi (the Schemer counter): Repelled 83%, ≈ 58**, at the cost of a Posse place. Post the "spare" Kinako beside Togemaru (clash): Repelled 16%.

**Connects to.** Consumes encounter, Verdict and raid events; emits `PatchChanged`, `RaidResolved`, `DistrictClaimed`, `TributeDelivered`; queries `PowerRating`; runs overnight steps 2 and 4; owns Clout (House Pet → Lane Cat → Known Face → Boss in the slice) and every price.

---

## 11. Dual Story Progression

*Owner: narrative-director · [`narrative/dual-story-progression.md`](narrative/dual-story-progression.md) · frame `previews/10-home-evening.png` (in production)*

**Fantasy.** Twenty minutes a tyrant; then a bell-gold thread home, the camera drops at the wall, and a girl in yellow socks taps your bowl twice. You don't know why she's crying at her desk, but you know to sit on her paper. Three feelings: **detective of the ordinary**, **belonging earned by a cat**, **caring about a specific person**.

**Rules.**
- **The language rule:** no human utterance is ever intelligible. Speech is **Murmur**, writing is **Scribble**, in trailers too. Mikan's grasp shows as **Sense Icons** (fish, heart, ear; tone puffs Round / Spiky / Drooping / Bouncing). **Cats understand cats:** cat speech is readable balloons, but cats never explain the human story.
- **Three laws:** *Witness* (only what Mikan is present for), *Cat-Sense* (every fact through something a cat notices), *No-Translation*.
- **Gating:** each vignette has a day gate and a slot; **turf never gates a home beat**, only a Life's end.
- **The house:** no combat, no HUD beyond pictograms, clock paused, Crew never enter. Morning visit ≤ 15 s; evening ≤ 2 min. Free time: the **daily find** (a fresh Home Scent trail in the responsible human's colour leads to one changed thing), the **piano** (walk the keys; Haru plays a bass under you), **Lap**, **Gift** (3 curios, the Gift Jar), **Knock**.
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

**Numbers: Bond.** 0–10 hearts, never decreases. Daily points: home by Dusk 1.0, late 0.5, Lap 0.5, find 0.5, Gift 0.5, Comfort 0.5; cap 2.5. **Well-Fed** next day: Zoomies starts at 5% per heart; every Posse cat starts fights with ¼ Paw. *Example:* ≈ 2.0 points a day for 7 days = 14 = **4 hearts** (Zoomies at 20%); a night owl ends at 3.

**Connects to.** Consumes `HomeArrived` and `DayEnded`; emits `KeystonePlayed`, `BondChanged`, `LifeAdvanced`; overnight step 5; gives Audio the Call system, Art the colour script, Nemesis the Routine tags Rivals taunt ("Home by dusk, every day. We noticed.").

---

## 12. Art direction

*Owner: art-director · [`art/art-bible.md`](art/art-bible.md) · mock-up kit [`previews/kit/`](previews/kit/README.md)*

**Ink what acts, paint what stays.** Everything that moves, fights, can be knocked over or loves you is a flat two-tone cel with a thin, even **Aubergine Ink** line (`#33273B`, 2 px at 1080p). Everything that stays put is soft, unlined paint, with painted skydome and backdrop cards (sky, hills and sea in frame). An inked bucket on a painted wall is obviously the bucket you can knock off.

**Principles:** read from behind; thirty centimetres tall; colour says what words cannot; loud street, quiet house; printed characters, painted world.

**Palette highlights:** Paper Cream and Cocoa UI; **Mikan Ginger** reserved for the hero; **Bell-Gold** for everything that is the player's; **Haru Yellow** exclusive inside the house; **Wall Sitter Sage** for the slice's enemy Clowder; **Frazzle Magenta** the loudest combat colour; shadows Wisteria, never grey. Phase keys Morning, Day, **Dusk** (the key-art hour), Night in bright moon-blue.

**Characters:** cats from bean, chestnut and pom shapes; one animation set per personality; a coat generator that never produces Mikan's look or a Scar shape. Humans are naturalistic, seen from the knee. **Combat VFX** draws Combat's tiers, including hand-lettered onomatopoeia (English and Japanese). **Originality:** the Shin chan reference's warmth, not its components; home key art never uses the inside-looking-out veranda frame. A one-alley look-dev test proves the method first.

---

## 13. Audio direction

*Owner: audio-director · [`audio/sound-bible.md`](audio/sound-bible.md)*

**Two worlds, one thread.** **The Street** is a Showa gangster picture for brass, taiko and shamisen, played straight about four-kilogram animals. **The House** is a chamber room: upright piano, reed organ, wall clock, a human voice through its chest. **The thread** is **the Call** (three sung notes, E4–G4–C4) and Mikan's brass **bell**. Test: eyes closed, you know within a second whether you are a boss or a pet.

**Pillars:** music is the translator; heard from 25 cm; a kilogram of cat, a tonne of sound; a voice you'd know in the dark; teach the hole before you dig it (Life 8's absences are taught in the slice as ordinary ones).

**Rules.** The Call is Mikan's name and the main theme, first heard at K1.3; its cell sounds only in a voice, in the street **Brass Call** (grows with Clout) and at Late Home's door; **Haru's Melody never contains it**. The Dusk pull: chime → Call within one bar → bell on the fourth beat. **Murmur** is prosody only, safety-gated against real phonemes; never comic. 8 bark intents per voice body and a personal yowl-sting per Rival. The combat mix follows Combat's tiers. **Budgets:** ≤ 25 min music, ≤ 240 barks. Every load-bearing sound has a visual twin (§15).

---

## 14. UX, HUD and key screens

*Owner: ux-designer · [`ux/hud.md`](ux/hud.md), [`ux/key-screens.md`](ux/key-screens.md)*

**Three HUDs.** *Street:* the world is the interface; one phase dial plus on-demand Patch tag, Caterwaul and Ambush flares, the Call glyph, Head Home prompt, barks. *Combat:* a conductor's score in the corners (Posse plates bottom-left with D-pad glyphs, Zoomies bottom-right, ribbon for named Rivals); the Frazzle bar and Pile-On ring sit **on the enemy**; centre and bottom-centre are keep-outs. *Home:* no interface; the HUD fades at the wall over 800 ms; pictograms only, except the **Doorstep Morning Sniff**.

| Screen | What it is |
|---|---|
| **Fence Line** | One painted wall: height = rank, a pose per cat, Scars, Title stamp, storm mark. No labels or numbers; never in the house |
| **Verdict** | Four-way compass with an honest tell; Bribe row on Recruit; hold 600 ms or press-confirm; no timer |
| **Turf Board** | Drag a portrait onto a Patch; the only map-like view and only place territory numbers appear |
| **Morning Sniff** | Tribute card, raid forecast, ≤ 3 Rival items; out in ≤ 30 s |

**The numbers rule:** *numbers count what the cat owns or pays; never a feeling, a relationship or a human.* Grudge, Regard and Loyalty are never numbers; Rival threat is paw size; damage numerals Off by default. **Onboarding:** one new verb every 60–90 s, situation first, then a ≤ 6-word hint card; the home teaches nothing with text.

---

## 15. Accessibility

*Owner: ux-designer · [`accessibility-requirements.md`](accessibility-requirements.md) (project-wide floor)*

**Flash and motion safety overrides every feel value:** ≤ 3 flashes/s over > 20% of the screen (design cap 2); ≤ 1 full-screen impact frame/s (a runtime arbiter downgrades extras); local impact ≤ 15%; no saturated red change over > 5%; every look event ≥ 2 frames; stepped shake; global hit-stop ≤ 20% of any second. **The default build must pass a Harding-style analysis before any public footage.**

**Slice options:** Reduce Flashes, Reduce Motion, shake and hit-stop sliders, onomatopoeia On/Smaller/Off, camera comfort; text to 150% (floor 28 px at 1080p); full per-context remapping; a toggle for every hold and one button for every chord; Slow Blink full pause; Kitten difficulty; keyboard-only and gamepad-only completion. **No state by colour alone:** every signal has a shape twin. **Deaf/HoH parity without captions:** the always-on **Call glyph**, bell glint, Dusk lamp wave, ear Sense Icon, tone puffs, sting glyphs, haptics; tested by the 90%-muted Tier A test with deaf and HoH players on the panel. **REQUESTs pending with Combat:** Auto Slow Blink, a wider Tag-In window, combat speed 70/85%, hold-to-string, hit-stop 0%.

---

## 16. Cross-system map

**One Cat Schema:** `id, name, title, coat_seed, style, personality, level, xp, stats{5}, moves[4], zoomies, signature_strength, traits{strengths,fears,scars}, loyalty, grudge, regard, memory[], rank, former_rank, clowder, assignment`.

| Event | From | → To |
|---|---|---|
| `EncounterStarted` (opener: standoff / ambush_by_player / ambush_by_rival / raid_defence) | Combat | Nemesis, Audio, UX, Day loop |
| `CatRouted`, `MoveUsed`, `TagIn`, `FearTriggered` | Combat | Nemesis, Crew, Audio, VFX |
| `EncounterEnded` (win / loss / player_fled / rival_fled) | Combat | Nemesis, Territory, Crew, Economy, Day loop |
| `VerdictApplied` (chase / humble / recruit / nose_accept / nose_snub) | Nemesis | Territory, Crew, Economy, UX |
| `WallEvent`, `NemesisDeclared`, `RaidRequested` | Nemesis | UX, Territory, Narrative |
| `RaidResolved` | Territory | Nemesis, UX |
| `PatchChanged`, `DistrictClaimed` | Territory | Nemesis, Economy, Narrative, Art, Audio |
| `TributeDelivered` | Economy | UX, Narrative |
| `HomeArrived` (on_time / late / routed) | Day loop | Narrative, Audio, Territory |
| `KeystonePlayed`, `BondChanged` | Narrative | Audio, UX, Nemesis, Combat |
| `PhaseChanged`, `DayEnded`, `LifeAdvanced` | Clock | Everyone |

Queries: Combat → Nemesis `RivalCombatProfile`; Territory and Nemesis → Crew `PowerRating`, `Loyalty`.

**Overnight step order (Night Shuffle).** Steps never reorder; no system reads a later step's output. Every draw uses a seeded substream `(save_seed, day, step, subsystem, cat, ordinal)`, so runs are reproducible.

| Step | Owner | Resolves |
|---|---|---|
| 0 | Day loop | Close the day: haul banked, Posse healed, Routine tags, Well-Fed flag, `DayEnded` |
| 1 | Crew | Loyalty deltas; Sentry XP |
| 2 | Territory | Scent decay; upkeep; **tonight's raid** (an uprising uses the slot) |
| 3 | Nemesis | Comebacks; wall events; refills; Grudge decay; the Declaration; **tomorrow's raid request** |
| 4 | Economy | Tribute to the Doorstep |
| 5 | Narrative | Next morning slot; Life-end check |
| 6 | Day loop | Autosave; next day; montage, title card or wake |

**A raid across systems:** step 3 requests it → the morning Sniff forecasts it → the player posts a counter → that Night it fires as a Caterwaul or resolves at step 2.

---

## 17. Slice onboarding and pacing

*Clock times: [`gdd/day-loop.md`](gdd/day-loop.md) §3.9–3.11; teaching sheet: [`ux/key-screens.md`](ux/key-screens.md) §7.*

| Time | Beat | Taught |
|---|---|---|
| 0:00–0:04 | **K1.1**; Haru hums her Piece (not the Call) | Camera |
| 0:04–0:08 | Garden; a crow on the **lane-side wall top** (no combat inside the wall) | Move, Hop, Attack, Skitter |
| 0:08–0:10 | **Hige**: "Use your whiskers, Collar." | Whisker Sense; first recruit |
| 0:10–0:15 | Two Strays (tutorial fights can't be lost) | Switch, Paw, Slow Blink, command, Frazzle, **two-cat Pile-On ≈ 0:14** |
| 0:15–0:20 | Low Wall Corner escalation; its Keeper is an untracked Stray; **Patch 1** | Scent, Spray, Hiss, Back Down |
| 0:20–0:25 | **Togemaru** flees; nap to Dusk; Head Home; **K1.3, the first Call** | Standoff, Brace, nap, home |
| 0:25–0:27 | Day 2: first Tribute, 1-item Sniff, the Lot | Doorstep, Lot, Share |
| ≈ 0:28–0:33 | Togemaru's gatepost: **first memory line**; **first Verdict**; **Patch 2** | Tag-In, Verdict |
| 0:32–0:46 | **Pon** joins; **K1.4**; Life-end sleep; montage | Relay |
| 0:46–1:00 | L2D1: K2.1, Fence Line, **Kinako**, Ambush, **Patch 3: the Den opens** | Fence Line, Ambush |

**Life 2, one headline a day:** D1 Ambush · D2 Sentries and the Turf Board (answering the first forecast), props and Fears, the cat flap and Night · D3 Lessons and Zoomies · D4+ the Den.

| Day | Min | Combat | Territory | Home | Story | Beats |
|---|---|---|---|---|---|---|
| L1D1 | 25 | 9 | 8 | 2 | 6 | K1.1, Pile-On, Patch 1, K1.3 |
| L1D2 | 20 | 7 | 10 | 1.5 | 1.5 | Memory line, Verdict, Patch 2, Pon, K1.4 |
| L2D1 | 20 | 7 | 9.5 | 1 | 2.5 | K2.1, Fence Line, Kinako, Patch 3 |
| L2D2 | 23 | 7.75 | 13 | 1 | 1.25 | Declaration, forecast, Sentries, K2.3, Caterwaul |
| L2D3 | 24 | 6.75 | 15.5 | 0.75 | 1 | Lessons, Kagi, Zoomies, Late Home, K2.2 |
| L2D4 | 21 | 8.5 | 9 | 1 | 2.5 | K2.5, Daifuku attempt lost |
| L2D5 | 16 | 7 | 7.5 | 0.75 | 0.75 | Lane claimed, suitcase, title card |
| **Total** | **149** | **36%** | **49%** | **5%** | **10%** | |

Combat and territory alternate inside every day; neither runs > ≈ 4 min without the other except Daifuku. Fast path (Daifuku won on L2D4): ≈ 2 h 13; each extra Boss wipe adds 16–20 min.

> **Known timing disagreements** (logged in both docs; align on the first playable): K1.4 at ≈ 0:40–0:45 (day loop) vs 0:52–0:57 (key-screens §7.3); and Sentries/Turf Board on **L2D2** (presentation ruling, followed by Day Loop, Territory, Nemesis) vs L2D1 in key-screens §7.4's table. This GDD follows L2D2.

---

## 18. Prototype plan

**Build first** (brief §10):
1. **Combat grey box** — the highest risk. Mikan + 3; 3 Styles; the 8 ★ Moves; Tag-In, Relay, Pile-On; a Captain; a 3-phase Daifuku on his wall with the bucket; personality AI for **Stalwart Hige, Goofball Pon, Braggart Togemaru** (the early Crew; test the Brooder separately). Camera Explore/Combat/Slow Blink/Cinematic; the tier table with the safety arbiter and a Harding capture.
2. **Three sims** (started in [`reviews/round-2/sim/`](reviews/round-2/sim/), [`reviews/round-3/sim/`](reviews/round-3/sim/)): fight lengths, the 7-day Night Shuffle, the Lives 1–2 economy. Keep them as regression checks.
3. **One-alley look-dev test:** shader and line rule, painted sky cards, camera collision in 1–2 m corridors and on roofs.
4. **Home mock:** Main Room, face-out clamp, a two-cut vignette, Mikan at 1.25× in a lap; decides reference closeness.

**Questions it must answer.**
- Is conducting fun at 20 min (≥ 75% do ≥ 1 Tag-In and ≥ 3 commanded Moves per normal encounter)?
- Random pause: do ≥ 90% find their cat within 1 s and name the telegraph? Do ≥ 70% say how a Crew cat fights differently?
- Do AI Paw habits ever fire (first self-cast ≈ 60 s; levers: spend at 1 Paw, `ai_fill` 0.6)?
- Is Daifuku 2–3 min (fragile to knock-off frequency), and do ≥ 60% bucket him unaided?
- Can a Life 1 kitten beat Togemaru (a Scrapper resisting Claw)?
- Optional rule trims; Zoomies pace; Yowler basics strength (combat Backlog B-15–B-20).
- Then, in the slice build: does a day fit 25 min (L2D2/L2D3 have no slack; measure Lot time first)? Is posting a real choice or is "Stalwart on the forecast" near-dominant? Does Humble's cost show inside 7 days?

---

## 19. Risks

| Risk | Mitigation |
|---|---|
| **Scope** | Slice first; Backlog discipline; three districts |
| **Wordless legibility** | Vocabulary before use; colour, objects, instruments; muted no-briefing tests |
| **Nemesis without voice** | Personality animation, Scars, yowl-sting, one sharp line |
| **Four-cat readability** in third person | Keylines, chevrons, edge arrows, decals above dust, one screen-wide effect, random-pause test |
| **Environment cost** (sky and every angle visible) | Look-dev test; one district first |
| **Tonal whiplash** | Hard street/home separation; HUD falls away at the wall |
| **Style proximity** / **procedural variety** | Originality rule, own UI shapes, mock-frame review / personality sets, coat generator |
| **Nemesis patent** | Legal review before scope lock and any showing (§20) |
| **Day overrun** (L2D2/L2D3 at 28.9 min heavy) | Measure Lot/Doorstep first; move the Turf Board, take Tofu Shop Step earlier, trim Night |
| **Low-stakes posting** | Motive counters and neighbours; spare levers in the Backlog |
| **Deadline Nemesis feels unearned** (37–48% of mixed players) | Playtest; move the deadline |
| **Photosensitivity** | Safety overrides feel; runtime arbiter; Harding gate |

---

## 20. Open decisions for the user

| # | Decision | Default / recommendation |
|---|---|---|
| 1 | **Engine** (none set in `project.yaml`) | Unity (URP) recommended; Godot 4 the alternative; then `/setup-engine` |
| 2 | **Title** | *Nine Lives of a Boss Cat* |
| 3 | **Legal review** of Rivals against the Warner Bros. nemesis patent (cited as US 10,926,179, to verify) | Qualified patent counsel before the Rivals scope is locked and before any public showing; distance levers each cost design ([`nemesis-system.md`](gdd/nemesis-system.md) §6.4) |
| 4 | Cultural consultant for the home rituals | Before slice home content is final |
| 5 | Team size, budget, timeline | — |
| 6 | Haru's presentation: canon or selectable | Canon |
| 7 | Mikan customisation | Fixed iconic design |
| 8 | Does Life 9 imply Mikan's passing? | No; the last sound is the bell |
| 9 | Handheld floor | Switch 1-class |
| 10 | Night locked until the cat flap | Yes |
| 11 | Spraying as a sparkle cloud | Yes |
| 12 | Reference-close or print-stylised | Decide on look-dev mock frames |
| 13 | Doc alignments | K1.4 time; Turf Board day; Daifuku Lv 8 vs ≈ 9 (Bribe 256 vs 288); Pile-On prompt word vs hint card |

*Settled 2026-11-23:* slice first; simplified FF7R-structure combat; personality as the Crew hook; third-person camera; three districts; readable cat speech; readable localised onomatopoeia.

---

## 21. Glossary

Terms not already defined where they first appear above. The full canon glossary is [`creative-brief.md`](creative-brief.md) §3.

| Term | Meaning |
|---|---|
| **Clowder** | A district's cat gang; the player's is the Bell Clowder |
| **Clout** | Reputation milestones (House Pet → … → Great Boss); set Crew cap and Sentry slots |
| **Crew / Posse** | All recruits / Mikan + 3 in combat |
| **Keeper** | The Rival holding a Patch |
| **Keystone / Texture / Closing / Plateau** | Required home beat / optional one / a Life's last Keystone / the house's "season" once Keystones run out |
| **The Lot** | Crew HQ behind the house: Posse, Turf Board, Lessons, Share a Morsel |
| **Morsels / Shinies** | Food currency / rare currency |
| **Murmur / Scribble** | Wordless human speech / illegible human writing |
| **Nerve / Routed** | HP / bolting in a dust puff at 0. Nobody dies |
| **Old Score** | Extra Frazzle when a Crew cat fights a Rival it has Routed or been Routed by |
| **Pounce Gauge / Paws** | The command resource; Moves cost 1–2 Paws |
| **Sense Icon** | A pictogram of what Mikan grasps (fish, heart, ear, tone puffs) |
| **Stash** | Mikan's always-safe Morsel bank under the veranda |
| **Style** | Combat role and stats: Scrapper, Bruiser, Yowler (Prowler and Trickster later) |
| **Whisker Sense** | Hold mode: the world desaturates, scent trails glow, a compass ring points at marks, Rivals and finds |

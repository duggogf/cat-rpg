# Director Rulings — Round 1

*Author: creative-director · Date: 2026-11-23 · Status: **BINDING** for round-1 revisers. Overrides `creative-brief.md` v1.0 and `game-pillars.md` where they conflict. The brief has been rewritten as v1.2 to match.*

## 0. The target, and how to read this

**User decisions (2026-11-23, settled, not re-opened):**
1. **The target is a GDD set good enough to start prototyping a vertical slice.** It is not the full game and it is not perfection. Each doc specifies what the slice needs in order to be built. Everything else goes to that doc's **Backlog** section.
2. **Combat is simplified.** Keep FF7 Remake's *structure* (real time; spend a gauge on commands in slow-motion; stagger; 1 leader + 3 swappable Crew; switching) and keep the flashy impact (VFX, action lines, shake, readable onomatopoeia). Simplify the moment-to-moment: short strings, few inputs, few statuses, no frame data in the GDD. Territory/economy is half the game and gets equal design weight.
3. **Crew personality is the standout hook.** One personality model, shared by Crew and Rivals, shapes both combat (AI behaviour, what a cat is good at) and management (guarding, Tribute, Loyalty, who gets on with whom).
4. **The camera is third-person**, behind and above the cat, like FF7 Remake. The fixed 55° bird's-eye camera is retired.
5. **The full game is the tight game**: nine Lives, all four headline features, **3 districts**, 12–15 h main story, ≈ 50 Moves, ≈ 58 story vignettes, sized for a small team. It appears here only as a framing summary (DR-04).
6. **Cats speak readable text; humans never do.** Big combat hits show **readable hand-lettered onomatopoeia**, localised.

**Critic ID prefixes** used in Part 2:

| Prefix | Critique | Prefix | Critique |
|---|---|---|---|
| CX | combat-system--experience (Issue n) | CP | crew-and-progression--design (Issue n, X-n) |
| CS | combat-system--systems (S-n, C-n → CS-Cn) | DS | dual-story-progression--creative (Cn, Xn, Rn) |
| NX | nemesis-system--experience (N-XP-nn, Cn) | AB | art-bible--technical (Issue n; §4.1 rows → AB-Tn) |
| NS | nemesis-system--simulation (Issue n, Cn) | SB | sound-bible--narrative (Nn; staging 11–18 → SB-Pn; X-n) |
| TE | territory-management--economy (Issue n, Xn) | UX | ux--art-direction (Issue n, Xn) |
| PP | paper-playtest (PP-nn) | | |

**Rules for revisers.**
- Part 1 is the law. Part 2 says per doc which critic issues are **Fix now** (they block the slice), which are **Backlog**, and which are **Overruled**.
- Anything a critic raised that Part 2 does not list is Backlog by default, unless it contradicts a ruling, in which case it is overruled.
- **Backlog handling.** Every doc ends with a `## Backlog (post-slice)` section: one line per deferred item, giving the critic ID or DR and the intent. Delete full-game detail from the body rather than keep it. Size target: each GDD's slice body is **≤ 50 KB**.
- **What is already presentable passes.** Do not rewrite sections no ruling touches.
- **Revision Log:** log FIXED, REJECTED (cite the DR) or DEFERRED → Backlog.

---

# PART 1 — GLOBAL RULINGS

## A. The vertical slice (the thing we are building)

**DR-01 · Vertical slice definition (binding).**

| Item | Slice content |
|---|---|
| **Lives** | **Life 1** (≥ 2 days) and **Life 2** (≥ 4 days). Ends on Life 2's Closing (K2.5 The Envelope) and a title card. No time-skip to Life 3. |
| **Play time** | **≈ 2–2.5 h** (≈ 6–7 in-game days × 20–25 min) |
| **World** | **Hidamari Lane only: 5 Patches** (Den + 4 outer; Low Wall Corner is Home Ground and the tutorial Patch). **Haru's House**: garden, entryway, kitchen/Main Room with the **upright piano**, Haru's room. **The Lot**. 4 Sunspots. Night opens with the cat flap on Life 2 day 2. |
| **Rivals** | The Wall Sitters: **8 seats** (Daifuku, 2 Captains, 5 Toughs; the **First Thorn** is a Tough) + 2 Roamers, ≤ 2 Away. **≤ 12 tracked cats.** One Nemesis slot + the arc lead. Critters: crows only. |
| **Crew** | Mikan + **6 recruitable**: 2 story recruits (the **old wall cat** at ≈ minute 10, a second before Life 1 ends), 1 Friend Stray, and 3 Rival-recruitable cats (the Thorn, one Captain, Daifuku at Regard ≥ 50). Crew cap 6. Posse of 4 by Life 2 day 2. **All 6 personalities appear** among these cats (DR-30). |
| **Combat** | 3 Styles (Scrapper = Mikan, Bruiser, Yowler); **12 Moves** (4 per Style), every one a Set-up or a Pay-off; 3 Style Zoomies; **no Knacks**; 3 Fears with props (Water/bucket, Loud Noise/scooter horn, Cucumber/ledge junk); Tag-In/Relay; Pile-On; one Boss (Daifuku, 3 phases) and two Captains. |
| **Nemesis** | Memory, 4 silhouette Scar types, 6 Titles, all four Verdicts, the Gloat, Lick In, comebacks, director wall events, the Fence Line (one district), ≤ 240 bark lines. |
| **Territory / economy** | Scent, Spray, the claiming flow, **2 Sentry slots**, 1 forecast raid + 1 Caterwaul, Tribute on the Doorstep, the Stash, Bribes, Lessons (Ranks I–II), Share a Morsel, Clout ranks House Pet → Boss (4 ranks). |
| **Home** | **11 vignettes**: Keystones K1.1, K1.3, K1.4, K2.1, K2.2+K2.4 ("Lamp at Night"), K2.3 (cat flap), K2.5, plus 3 Textures and 1 montage (1→2). Also the Routine layer (Eat, Rub, Lap, Meow, Knock), the daily "What changed today?" find, and the piano verb. |
| **Audio** | The Call, the Dusk chime and the bell's fourth beat; Lane day/night and home music **≤ 25 min**; Murmur for Haru (16–18) and Gran; 2 Rival voice bodies × 8 bark intents; Tap-Tap and ritual sounds. |
| **Platform** | PC, controller-first, with keyboard/mouse. A handheld performance check is a Backlog gate. |
| **Questions** | *Is conducting four cats fun?* · *Do players care about a Rival and about Haru within two hours?* · *Is territory management fun at this scale?* · *Does a day fit ≈ 25 minutes?* |

**DR-02 · The combat prototype comes first** (grey box, before the slice). Mikan + 3 cats against groups, a Captain and a 3-phase Boss. 3 Styles, Combat's 8 strongest slice Moves, Tag-In/Relay, Frazzle, Pile-On, Slow Blink, switching. Personality-driven AI for 3 personalities. Acceptance: unprompted, 75% of testers perform ≥ 1 Tag-In and ≥ 3 commanded Moves per encounter, and rate the fight fun at 20 minutes.

**DR-03 · Slice acceptance tests** (owner: each doc for its part; QA assembles them).
- Two cats and a Pile-On by minute 15.
- The first memory-citing Rival line by minute 60 for 100% of testers.
- ≥ 80% can name one Rival and one specific thing Haru does (not a milestone) at 2 h.
- A median day takes ≤ 25 real minutes.
- Every Keystone's Tier A fact reaches 90% of unbriefed testers with audio muted.
- The default flash configuration passes an automated Harding-style analysis.

**DR-04 · Full-game framing (summary only; details are Backlog).** Nine Lives, one ending (Escalation E-3). **3 districts + the Lighthouse Summit, 20 Patches.** Level cap 30. Crew cap 12. 27 Rival seats. ≈ 50 Moves (45 Style + 4 Home + Zoomies). ≈ 58 story vignettes (33 Keystones, 18 Textures, 7 montages). ≤ 700 bark lines. ≤ 75 min music. Main story 12–15 h (≈ 26–32 in-game days).

| District | Folds in (v1.0) | Patches | Lv | Boss | Lives |
|---|---|---|---|---|---|
| Hidamari Lane | — | 5 | 1–8 | Daifuku (Bruiser) | L1 tutorial · L2 claim |
| Akane Arcade | shopping street + old Tsukimi shrine steps at its top end (comes alive at night) | 7 | 8–18 | Madam Sabi (Yowler); Oboro = her authored night Captain | L3 hold 4 outer · L4 claim |
| Shiosai | harbour below + old Kasumi inns above | 7 | 18–28 | Ikari (Scrapper) | L5 hold 4 outer · L6 claim |
| Lighthouse Summit | Botan's seat | 1 | 30 | Botan, Great Boss (Trickster) | L7 |

Kurogane Yard and Kiha & Moha are cut. Life 8 is the Food Carry chapter (DR-27). Life 9 names an heir and takes one last walk.

## B. Ownership of doubly-defined things

**DR-05 · Moves: one catalogue, owned by Combat.** Combat owns every Move and Zoomies definition and number (data `assets/data/combat/moves.*`). Crew owns only learnsets keyed by `move_id` (`styles[], source, rank, instinct_level`). Crew deletes its Pow/Frz/Effect columns, its F10 HE model and its Posse-index table. The slice catalogue is 12 Moves. The full catalogue is Backlog.

Every Move is either a **Set-up** (creates Ruffled, Soggy, Cowed, Clumped or Splat) or a **Pay-off** (bonus against one of those). There are no pure-damage Moves. At most one Ruffle-applying Move per Style.

Budget scale: a 1-Paw Move ≈ 3.5 basic hits plus a Frazzle chunk; a 2-Paw Move ≈ 8 basic hits or a strong utility. Moves never refund their own cost.

**DR-06 · Style matchup chart (owner Combat; the shape is canon).** The rule: *a Style resists its own damage type.*

| Style | Basic type | Resists ×0.8 | Weak to ×1.2 |
|---|---|---|---|
| Bruiser | Thump | Thump | Fang |
| Scrapper | Claw | Claw | Thump |
| Prowler | Fang | Fang | Yowl |
| Yowler | Yowl | Yowl | Claw |
| Trickster | mixed | — | — |

Daifuku is neutral to Mikan's Claw.

**DR-07 · Game-feel/VFX tier table: one table, owned by Combat.** It lives in Combat's Impact Moments section. Art keeps the drawings and Audio maps to the same tiers. Six tiers, adopted from AB §4.2 with values expressed in milliseconds:

| | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| Events | whiff, prop, blocked hit | string hits | string finisher, Pounce, Tag-In strike, Splat | 1-Paw Move, Hiss interrupt, Fear trigger | 2-Paw Move, Frazzle hit, Tough Rout, Back Down | Pile-On, Zoomies, Boss phase break, leader Rout |
| Hit-stop | 0 | ≈ 40 ms | ≈ 80 ms | ≈ 120 ms | ≈ 180 ms, global | ≈ 230 ms, global |
| Shake (stepped) | 0 | 0 | small | medium | large | max |
| Impact frame | — | — | — | local | full-screen | full-screen |
| Glyph / lettering | — | spark | glyph | glyph burst | **lettered word** (DR-49) | **giant lettered word** |

Two further rules: AI-autonomous hits render one tier lower (the player-authorship rule), and the safety rules in DR-48 override every row.

**DR-08 · Final control map (owner UX; actions owned by Combat).** Everything is remappable, and every chord or hold has a one-button or toggle alternative. Positional naming: West = X/□, North = Y/△, South = A/×, East = B/○.

| Gamepad | Exploration | Combat |
|---|---|---|
| Left stick | Move | Move |
| Right stick / R3 | Camera orbit / recentre | Camera orbit (soft-lock keeps the target framed) / **lock-on toggle**; flick = next target |
| West | Swat | **Attack** (3-hit string; airborne or from the High Road = **Pounce**) |
| South | Jump / Hop | Hop |
| East | Dash (hold to sprint) | Skitter (dodge) |
| North | Interact (Spray, Sniff, Nap, pick up/put down) | **Hiss**; becomes **Pile-On** while one is available |
| R1 | — | Brace (hold) |
| R2 | **Whisker Sense** (hold) | **Slow Blink** |
| L2 | Stalk (hold) | — |
| L1 hold + face button | — | Shortcut Move 1/2/3/4 (W/N/E/S) |
| L1 + R1 | — | Zoomies |
| D-pad | Left/Right = Tail-Up picker; Up = Meow; Down = Sit (hold = **Head Home** thread) | Direct switch: Up = Mikan, Left/Down/Right = Crew 1/2/3 (a switch at the right moment is a **Tag-In**) |
| View / Menu | Fence Line / Pause | — / Pause |

Inside Slow Blink: stick = cursor; L1/R1 = change cat; South = confirm; East = back; R2 = close. Commands **chain** while any cat can afford one. Scram (flee) is a menu entry.

| Keyboard & mouse | Exploration | Combat |
|---|---|---|
| WASD / mouse | Move / camera | Move / camera |
| LMB | Swat | Attack |
| RMB | — | Brace |
| Space / Shift | Jump / Dash | Hop / Skitter |
| E / F | Interact / — | — / Hiss (Pile-On when available) |
| Tab | Whisker Sense (hold) | Slow Blink |
| Ctrl | Stalk | — |
| 1–4 / R | — | Shortcut Moves / Zoomies |
| Z X C V | — | Switch Mikan / Crew 1 / 2 / 3 |
| MMB / wheel | Recentre | Lock-on / next target |
| V / T / C / H | Tail-Up / Meow / Sit / Head Home (hold) | — |
| J / Esc | Fence Line / Pause | — / Pause |

Cut: Whack, Bap, Righting input, hold-charge attacks, Tactics (slice), L3+R3 chord, Whisker Sense in combat (Slow Blink shows props and known Fears).

**DR-09 · Recruitment is deterministic.**
- **Availability (Nemesis owns):** the Rival is held for the Verdict, Grudge < 90 or Regard ≥ 50, and there is room (or the player makes room, DR-34). Bosses need Regard ≥ 50.
- **Price and starting Loyalty (Crew owns).** The price is a **Bribe** ("Offering" is reserved for Life 8) at none / fair / feast. Fair = `8 × level × rank_mult` (Stray 0.75, Tough 1, Captain 2, Boss 4); feast = 2× fair. It is **paid from the Stash** and greyed if the Stash is short.
- **Starting Loyalty:** `L0 = clamp(5, 80, 50 − 0.4·G_pre + 0.3·Regard + personality_mod + 5·bribe_step − 20·returned)`, where `G_pre` is Grudge before Nemesis's recruit halving. Story recruits and Friend Strays are fixed.
- Life 1 recruits are free. No Willingness roll and no Fear penalty.

**DR-10 · Loyalty thresholds (canon numbers in the brief).** Tiers: Shifty 0–29 · Aloof 30–44 · Steady 45–59 · True 60–79 · Sworn 80–100. Gates: teach at Steady+; Den Sentry/Warden at True+. **Betrayal threshold: Loyalty < 30** makes the cat **Wavering** (two warning mornings in the Sniff), then a **Turncoat** if it is still < 30 on the third night. Crew writes Loyalty; Nemesis reads it. Betrayal is not reachable in the slice (unlock ladder, DR-23); the formula still is.

**DR-11 · Loyalty formula (owner Crew).** Inputs:

| Input | Change |
|---|---|
| In the Posse that day | +2 |
| Posted, and the district `seen` within 3 days | +1 |
| Posted and unseen for > 3 nights | −1 × m (1 ex-Stray/Tough, 1.5 ex-Captain, 2 ex-Boss) |
| Share a Morsel (whole Crew, once a day) | +2 |
| Lesson taken | +1 |
| Routed in a lost fight | −3 |
| Personality likes and dislikes | DR-30 |

Loyalty no longer affects stats. There is no absence drain in Life 8.

**DR-12 · Schema.** The One Cat Schema gains `personality`, `regard`, `former_rank` and `signature_strength`.
- `personality` replaces **both** `temperament` definitions (Nemesis's 6-value field and Crew's 11-value stat nature). It is Nemesis-owned at generation, read by Combat, Crew and Territory, and defined in DR-30.
- `former_rank` is Nemesis-owned.

Renames that end the collisions:

| Old | New |
|---|---|
| Nemesis state `Perched` | `Seated` |
| Patch holder ("Holder") | **Keeper** (`keeper_id`) |
| Territory upgrade "Settled" | Claimed-In |
| Crew Moves "Pounce" / "Hiss" / "Yowl" | Leap / Withering Hiss / Howl |
| "Nine Shadows", "Everything Off The Shelf" | stay Zoomies names only |
| Audio theme "Swagger" | **the Brass Call** |
| Share a Meal / Treat | **Share a Morsel** |
| Recruit payment | **Bribe** |
| UI names | **Turf Board**; **phase dial** |
| Wound words | Scruff Nip, Ankle Ambush, Pick On The Puffed |

**DR-13 · Night Shuffle (canon order).** Every draw comes from a counter-based substream `rng(save_seed, day_index, step, subsystem, cat_id, ordinal)`. Daytime outcome rolls are seeded on `(save_seed, encounter_serial, cat_id)`, so reloading reproduces them. Prehistory nights use negative day indices.
1. **Crew** — Loyalty deltas; Sentry XP.
2. **Territory** — Scent decay, flat upkeep, resolve the raids requested last night (they were forecast in today's Sniff), uprisings.
3. **Nemesis** — betrayals; comebacks; one director wall event per district every 2–3 nights; refills and promotions; Grudge decay and Nemesis-slot reassignment; tomorrow's raid requests (≤ 1 per district).
4. **Economy** — Tribute to the Doorstep (none in Life 8).
5. **Narrative** — next morning's slot; the Life-end check (DR-21).

**DR-14 · One price sheet, owned by Territory/Economy.**

| Item | Price |
|---|---|
| Lessons | Rank I 40 · II 120 · III 300 · IV 600; ×1.5 cross-Style (slice: Ranks I–II) |
| Bribe | DR-09 |
| Share a Morsel | Σ Crew levels, once per day |
| Crew cap by Clout rank (full game) | 6 / 7 / 8 / 9 / 10 / 11 / 12 |
| Sentry slots by Clout rank (full game) | 1 / 2 / 3 / 4 / 5 / 6 / 8 |

The slice uses the first four Clout ranks. Clout is milestones only (Clout points cut). Territory's Treat, its own recruit formula and its 6-tier Lesson table are deleted. Economy anchors: Tribute per day ≈ 60 at the end of Life 2; later anchors are Backlog.

## C. The day and the home

**DR-15 · Clock.** Four phases × **4 real minutes** = 16 minutes of roaming clock. The clock pauses inside Haru's wall (garden included), in combat, Standoffs, Verdicts, menus and the Lot. A nap at a Sunspot advances half a phase. At the end of Dusk before the cat flap, and at the end of Night, Mikan grows drowsy; after a 1-minute grace period the Head Home thread walks Mikan home. Suspend-on-quit anywhere, plus an autosave at every phase change.

**DR-16 · Day budget (slice target, measured at the 75th percentile, hard cap 30 min).**

| Segment | Minutes |
|---|---|
| Wake → door (no Keystone / with Keystone) | ≤ 0.25 / ≤ 1.5 |
| Doorstep + Morning Sniff | ≤ 0.5 |
| The Lot | ≤ 1.0 |
| Roaming clock | 12 (pre-flap) / 16 |
| Encounters (paused): 4–6 fights, Standoffs and Verdicts | 5–7 |
| Way home | ≤ 1.0 |
| Evening at home | ≤ 2.0 |
| **Total** | **≈ 20–25** |

Design weight across the day: **≈ 50% roaming and territory** (scent, spraying, posting, Rivals as territory actors), **≈ 35% combat**, **≈ 15% home**. The full-game day (≤ 35 min) is Backlog for `day-loop.md`.

**DR-17 · The Way Home.** When the Dusk Call sounds, and whenever the player holds Head Home, a bell-gold scent thread appears along the High Road to Haru's wall. In the slice it is ≤ 60 s from anywhere. Roof Run fast travel is Backlog. Caterwauls fire only in the current district.

**DR-18 · Daily-reset budget: at most 3 once-a-day actions in the game.**
1. Share a Morsel at the Lot.
2. The "What changed today?" home find.
3. Tribute pick-up (automatic).

Changes that keep the budget:
- Your own Rub Marks give no Scent; they count as a `seen` visit.
- Your own Spray is offered only below Strong (it sets Scent to 90).
- Caches are one-time finds.

Cuts: Feeder and back-door daily scraps, Humbled-resident visits, Friend Stray daily Trust pips (replaced by a one-time scent-trail favour), per-cat meals.

**DR-19 · Losing ends the outing, not the day.** After a wipe, Mikan slinks home. If it is before Dusk, the clock jumps to Dusk and the evening plays, Haru puts on the plaster, and the Night is forfeit. 20% of the day's field haul is lost; the Stash is safe. In Life 1 nothing is lost. The victor is promoted and Gloats (≤ 3 s).

**DR-20 · Well-Fed** (home by Dusk): next day, Mikan's Zoomies gauge starts at 5% per Bond heart (max 50%), and every Posse cat starts each fight with a quarter Paw. It is not a status icon. Night pays only in Night-only things (Night Rivals, Shinies, Clout), never Morsels.

**DR-21 · Home beats are gated by day count only; the turf goal gates only the time-skip.**
- Every Keystone, including each Life's Closing, has a `day_gate`. `turf_gate`, "Rule 7" and the essential-cut and montage-insert forms are deleted.
- **A Life ends** at the first sleep at home after (a) its turf goal is met, (b) `day_in_life ≥ life_min_days`, and (c) its Closing has played.
- `life_min_days`: **Life 1 = 2, Life 2 = 4** in the slice. Full game: 2, 4, 3, 3, 3, 3, 4, (Life 8), 2.
- **Closings never play Forensic.** On a Late arrival they wait for the next morning slot. ≥ 70% of non-Closing Keystones are morning beats.
- **Story players and Bosses:** each wipe against the same Boss leaves it plastered with −10% max Nerve for the rematch (stacks to −30%).

**DR-22 · Life 1 and the first 15 minutes** (Narrative owns K1.x, UX owns the beat sheet, Combat owns what is taught; one new verb every 60–90 s).

| Time | Beat |
|---|---|
| 0:00–0:04 | K1.1. Haru **hums**; it is not the Call. |
| 0:04–0:08 | The garden: move, jump, Swat and Skitter on a crow. |
| ≈ 0:08–0:10 | **The old wall cat** ("Use your whiskers, Collar.") teaches Whisker Sense and joins as the first story recruit. |
| 0:10–0:15 | A two-Stray lane fight: switching, the first Paw, Slow Blink, commanding the other cat, Frazzle on the last enemy → **a two-cat Quick Pile-On**. |

Then:
- Low Wall Corner's scripted short escalation (1 Rub, 1 Counter-Spray, 1 wave, the Keeper).
- The First Thorn Standoff, with Combat's normal interruptible flee.
- Spray, nap.
- Day 1 Dusk: **K1.3, the first Call.**
- Day 2: the Thorn waits at the gatepost (the first 1-item Sniff); the first Verdict; the second recruit; K1.4.

Hiss, Back Down, Brace and Tag-In are taught in Life 1. Ambush, props and Fears, Sentries, Lessons, Zoomies, Night and raids come in Life 2, one per day.

**DR-23 · The home has a daily game, and Haru is a person.**
- **Daily change:** each day one thing in the house changes. A fresh Home Scent trail leads to it, and finding it fills the day's Bond "other" slot.
- **Haru's specifics:** she is always late (the second Goodbye), and the upright piano is hers. She practises one piece, badly at 16. Mikan can walk on the keys.
- **No food enters the house before Life 8.** K2.1's Gift tutorial uses a cicada shell. The Lane hides 2 Gift curios found with Whisker Sense.
- **Texture:** in Life 1, Gran's hand goes still at the Grandpa photo.
- **Rin:** a rin is struck once in every Alcove morning ritual from Life 1.

**Nemesis unlock ladder** (by first occurrence, from NX-06):

| When | Switches on |
|---|---|
| Life 1 | Standoff, Verdict, First Thorn, 1-item Sniff |
| Life 2 days 1–2 | Fence Line, Ambush, 3-item Sniff |
| First Humble | Restless warnings |
| Cat flap | Night Rivals, the first raid (scripted from the arc lead) |
| Life 3+ | Wavering/Turncoat and the rest (Backlog) |

**DR-24 · Home UI vetoes.**
- At home, pause offers only the Mikan tab and Options.
- The Fence Line is read-only on the street, at the Doorstep and at the Lot. It never appears in the house.
- **The Doorstep Morning Sniff is the single licensed HUD space inside the wall.** It is drawn as stamp cards unrolling from scent wisps.
- The phase dial is always visible while roaming (Always / Contextual / Off) and hidden in combat and at home.

**DR-25 · Owner of the day: commissioned doc `design/gdd/day-loop.md`** (game-designer, ≤ 20 KB). It owns the clock detail (DR-15), the day budget and its playtest test (DR-16), the Way Home (DR-17), the daily-reset audit (DR-18), encounter density, and save/suspend. Slice scope first; the full-game day goes to its Backlog.

**DR-26 · Teach death before it matters (rule now, build later).** K5.1 becomes "Black Shoes", using the framing K8.6 reuses. The sock-on-sock romance idiom appears in Life 4. The ring is Tier B only. All of this is Backlog content, but no slice decision may contradict it.

## D. Life 8 — framing (detail is Backlog; owner: narrative-director in `dual-story-progression.md` §9)

**DR-27 · Life 8, the shape every doc must not contradict.**
- **Owner and length:** one spec, owned by Narrative §9. Other docs supply numbers and cite §9. Playable from day 1. Length 7–8 days.
- **Stage A** (2 ordinary days): A1 ends with the last complete sung Call, at an ordinary Dusk. A2 brings the last Goodbye and a Dusk with no Call.
- **The wait** (2 days, played live): street quiet, Ambush budget 0, Sleep only from Dusk, no Knock targets.
- **The Season Turn** is held outside on the Doorstep beside the Tribute pile; crows take the pile, and Mikan becomes Old.
- **The Carries:** 3 on 3 different days, counted, never valued.
  - Carry 1: a fish from the Stash.
  - Carry 2: Fresh Catch from a held Patch in the Lane or the Arcade.
  - Carry 3: Fresh Catch from Shiosai's harbour.
  - While carrying, Mikan cannot attack; the other three fight with 100% AI fill.
- **Territory:** no Doorstep deliveries all Life (which closes the softlock).
- **Combat:** never harder than Life 7. The Usurper is optional.
- **Tone:** the Sniff stays indifferent, with gratitude reported first. Koharu's pathos beats are capped at four.
- **Music:** from the phone call until Carry 3, neither Haru's voice nor her Melody sounds anywhere. Music returns on pick-up and set-down. Her Home Scent note is the only trace.
- **Ending:** Sora's two whistled notes and Koharu's third close the Life.

Everything else (numbers, Reckoning, decay multipliers, hints, cues) is Backlog. **No R13.3 time-skip shuffle runs on entering Life 8.**

## E. Combat — simplified

**DR-28 · The simplified combat model (canon).** The FF7R structure stays; the detail goes.

| Element | Ruling |
|---|---|
| **Inputs** | Attack, Hop, Skitter, Brace, Hiss/Pile-On, Slow Blink, shortcut layer, Zoomies, switch, lock-on (DR-08). Twelve, FF7R-sized. |
| **Strings** | Each Style has **one 3-hit string**. The third hit is the Style finisher (Bruiser knockback, Scrapper flurry, Yowler short cone). Airborne or from the High Road: Pounce. No heavy attack, no hold-charge. |
| **Pounce Gauge** | Every cat has **2 Paws** (Mikan gets 3 from Life 4). Fills slowly over time and faster from hits. AI cats fill at 50%. |
| **Moves** | 4 slots. 1 or 2 Paws. Fired by shortcut or Slow Blink (time 5%). |
| **Hiss** | 8 s cooldown. Interrupts a **yellow** telegraph and Ruffles the attacker. Makes a Tough at ≤ 15% Nerve **Back Down** (a cat-true win). AI cats Hiss only at telegraphs aimed at themselves. |
| **Ruffled** | For 4 s, the target's Frazzle builds ×2. Sources: Ambush, Fear props, Hiss interrupts, one Move per Style. **A leader cannot be re-Ruffled for 6 s after Ruffled ends.** |
| **Frazzled** (stagger) | Fills from hits. Lasts 6 s; damage taken ×1.5. Opens the Pile-On. |
| **Statuses** | **Three only: Soggy** (slower), **Cowed** (deals less), **Fired Up** (deals more). Max 1 per cat at a time. |
| **Poise** | Toughs flinch from string hits. **Captains and Bosses do not flinch** from strings, only from finishers, Hiss interrupts, knock-offs and phase breaks. Enemy windups are armoured. Red telegraphs cannot be stopped. |
| **Telegraphs** | Three classes: white (dodge), yellow (Hiss it), red (get out). Each has a ground decal plus an overhead glyph; colours per DR-47. |
| **Damage types** | 4 types and the DR-06 chart. |
| **Cut** | Swagger and Composure, Bap, Whack, Righting input (Posse cats land on their feet automatically), Perch, Tactics and Knacks (Backlog), Dirt-Eyed, Startled, Pinned, damage variance, the "+100 Pounce" gift, Shoo hazards, the cucumber carry, Zoomies tiers, Auto-Hiss. |
| **Spec level** | Combat's GDD gives intent, rules and **ranges in milliseconds/seconds**. Frame data lives in tuning data and the prototype, not in the GDD. |

**DR-29 · Conducting is the core: Tag-In and Relay (new core rule).**
- **Trigger:** switch control within ≈ 0.35 s after the controlled cat lands a string finisher, a Pounce or a Hiss interrupt.
- **Effect:** the incoming cat leaps in (invulnerable during the leap) with its Style's **Tag-In strike** (a T2 hit with a Frazzle chunk), and both cats gain a quarter Paw.
- **Relay:** a Tag-In strike can itself be tagged. Each consecutive tag within 3 s adds Frazzle. Each cat appears once per relay.
- **Payoff:** a four-cat Relay is the skill route to crack a Captain.
- **Support rules:**
  - Personality drives AI behaviour (DR-30).
  - Set-up Moves are command-only for AI cats.
  - **Old Score:** a Crew cat fighting a Rival it has Routed, or been Routed by, deals extra Frazzle to it, and both bark.
  - Commanded Moves inside a Frazzle window skip pathing.
  - There is no mid-fight bench swap.

**DR-30 · Pile-On.**
- Needs ≥ 2 standing Posse cats.
- **Always Routs anything below Captain.**
- On trash, a Quick Pile-On is offered only when 2+ enemies are Frazzled within 3 m, or the target is the last enemy standing.
- On a Captain or Boss, a Full Pile-On is worth more the earlier it is triggered in the Frazzle window (Combat sets the formula).
- Each beat uses that cat's Style animation, voice and personality flourish. Shake only on the beats.

**DR-31 · Fight lengths (Normal difficulty, same level).**

| Fight | Target length |
|---|---|
| Tough under focus | 6–10 s |
| Normal encounter | 30–60 s |
| Captain | 30–45 s |
| Daifuku (Boss) | 2–3 min |
| Botan | 4–5 min (Backlog) |

**Fed Up at 75 s** for non-Boss fights. Levers (Combat owns the values):
- A basic hit is ≈ 4–5% of a same-level cat's Nerve.
- Rank Nerve multipliers: Captain ×8, Boss ×20.
- Rank damage multipliers: 1 / 1.3 / 1.6.
- Healing cap: 60% of max Nerve per cat per fight.
- Damage reduction floor: 30% of damage always gets through.
- A small encounter simulation replaces the hand model as acceptance.

**DR-32 · Bosses must stagger.**
- Phase breaks keep the Frazzle gauge.
- A break is deferred while the Boss is Frazzled.
- A Pile-On on a clamped Frazzle plays the phase break as its final beat.
- Acceptance: every Daifuku phase contains ≥ 1 Frazzle in the median run.

**Knock-offs are deterministic:** an enemy knocked off a High Road edge always Splats (Boss: Ruffled). The High Road Pounce charges with time aloft (≤ 3 s). Daifuku never leaves his wall voluntarily. **His fight is "knock him off into the bucket"**: cat verb plus prop.

**DR-33 · Protagonist share.** Mikan may slot at most 2 cross-Style Moves. When the controlled cat is Routed, control passes to the next slot, not to Mikan. Acceptance (sim): the Crew collectively deals ≥ 55% of Posse damage.

**DR-34 · Full Crew.** At the Verdict, "Recruit — make room" lists Lounging cats to release. Release at Loyalty ≥ 60 is a clean parting (Grudge 0, Regard +10); below 60 it follows the Chase Off rules. Nobody is deleted.

**DR-35 · AI fill (canon change, Backlog values).** 50% in Lives 1–7, 60% from the Life 8 Season Turn, 70% in Life 9, 100% during a Carry.

**DR-36 · Ambush.** A 2.0 s directional yowl-sting. The counter is a Skitter or Brace in its final 0.75 s, which gives a neutral start. Routed tracked Rivals in won fights are held at the ring edge for the Verdict.

## F. Crew — personality is the hook

**DR-37 · One personality model, shared by Crew and Rivals** (canon; replaces both `temperament` fields).
- Six personalities.
- Nemesis assigns them at generation, and they never change.
- They drive: Rival barks and Verdict reactions; AI behaviour and one combat perk; one guard/management perk; Loyalty likes and dislikes; social pairs.
- Combat, Crew, Territory and Nemesis each own the numbers for their own column. The shape below is canon.

| Personality | In a fight (AI) | Combat perk | On guard / management | Loyalty rises from / falls from | Bonds with / clashes with | As a Rival |
|---|---|---|---|---|---|---|
| **Braggart** | Charges the biggest enemy | First hit on a leader adds Frazzle | Raid defence +; posted Patch +10% Tribute (residents pay a loud cat) | Being in the Posse / being benched > 2 days | Goofball / Braggart | Loud taunts; comes back fast for revenge |
| **Brooder** | Hangs back, then goes for whoever hurt an ally | Old Score doubled | Never leaves its post; posted Patch decays slower | Long service (Loyalty moves at half speed both ways) / being dismissed from a post | Stalwart / Schemer | Grudge decays at half rate |
| **Schemer** | Flanks; hunts Ruffled and Frazzled targets | Bonus damage on Frazzled | Its district's raid forecast names the motive | Learning Lessons / Mikan choosing Nose-Touch (soft) | Fraidy / Brooder | Ambushes; as Crew, Wavers at < 35 instead of < 30 |
| **Fraidy** | Keeps distance; supports, dodges | A perfect Skitter gives Pounce | Weak raid defence but **raises the Caterwaul early** (longer window) | Never being Routed / being Routed | Stalwart / Braggart | Flees early; returns slowly |
| **Stalwart** | Stays near the controlled cat; Braces; draws attacks | Allies within 3 m take less damage | Best raid defence | Fair play (Nose-Touch, clean wins) / Mikan Humbling cats | Brooder / Schemer | Honourable; accepts Nose-Touch readily |
| **Goofball** | Plays; goes for props | Props it triggers hit harder | Humbled residents on its Patch never simmer | Share a Morsel counts double / being left at the Lot | Everyone except Brooder / Brooder | Clowns about; easy to Recruit |

**Social pairs:**
- A **bonded pair** in the Posse gets a stronger Tag-In between them. Posted in the same district, each gains +1 Loyalty per night.
- A **clashing pair** in the Posse or the same district: each loses 1 Loyalty per day.

**Expression and look:** personality is shown, not listed. Each personality has its own idle, walk, posture, bark intents and Pile-On flourish. That is **6 animation sets**, the art cost of the hook.

The ±8% stat nudge is cut; Style alone sets stats. Ex-Rival recruits also keep their history (Memory, Scars, Title). Their Nemesis **Strength becomes an always-on signature perk** (their Fear stays). **Strays have no signature perk.**

**DR-38 · Crew rules for the slice.**
- Teaching routes in the slice: **Instinct and Lessons**. Watching is Backlog (kept as intent). Elders and Keepsakes are cut.
- Mikan teaches 3 Lessons a day, others 1.
- No Pending list, no refresher fee, no last-copy rules.
- Tail-Up stands: away from the Lot only Lounging cats can be called; posted cats show as disabled.
- XP: the slice covers levels 1–8 with Turf XP included. Acceptance: the Posse level at Daifuku is 7–9.
- Home Moves are Backlog.

## G. Nemesis

**DR-39 · Grudge decays; Nemesis is a slot.**
- Grudge decays at any value: −2 per quiet night (Brooder −1). The arc lead is exempt while it leads.
- Per-encounter cap: 35 for a cat's first two encounters, 20 after.
- **One Nemesis slot per district plus the arc lead**, chosen among cats with Grudge ≥ 75. Others display as **Bitter**.
- Sim target: share of seated Rivals at Grudge ≥ 75 is ≤ 15%.
- Grudge and Regard are never shown as numbers. The Fence Line shows one disposition pose per cat plus the storm mark.
- A **friend arc** (3 encounters, a mark, an accepted Nose-Touch) counts toward the arc guarantee.

**DR-40 · Memory on screen, early.**
1. **The First Thorn returns inside Life 1** (day 2, at the gatepost).
2. Ambushing a remembered Rival shows its memory line **at the Rout**, over the flattened cat.
3. A memory-citing Standoff line cannot be skipped for its first 1 s.
4. **Every player-sourced Scar is a silhouette Scar** (ear notch, folded ear, kinked tail, puffed tail, cowlick, head plaster) until the cat has two. The third-person camera makes them visible in play, not only on the name-card.
5. **Lick In:** a Rival that Routs Mikan in a fight the Posse wins earns a Glory Title (no promotion).
6. Mikan wears Haru's plaster the day after a wipe (tag `mikan_plastered`).
7. Routine tags (`evenings_home` / `nights_out`) feed two barks.

**DR-41 · No scripted outcomes.** The First Thorn uses the normal flee. If it is Routed, it gets a Verdict. Unless it is Recruited or accepts a Nose-Touch, it is the guaranteed returner.

**DR-42 · The four Verdicts (each answers "the cat" and "the post").**

| Verdict | The cat | The post | Numbers |
|---|---|---|---|
| Chase Off | Away (2 slots per district); returns changed (escorts, then promoted, then the Grand Standoff); adapts to the player's last opener | Yours | Clout +2 |
| Humble | Stays on the Undermark crate (one per Patch); pays | Yours; +15% Tribute | Grudge +10; Restless at 80; no simmer while the Patch is Watched; an uprising is the resident alone; Settled after one failure |
| Recruit | Joins with full Memory and its signature perk | Yours | Bribe (DR-09) |
| Nose-Touch | Respects you (accept roll seeded) | **Keeps its post** under a 5-day truce. Afterwards: Regard ≥ 75 → it yields with a nose; otherwise a normal fight that adds no Grudge | Clout 0 |

**One full Verdict per fight** (the highest rank). Other Routed tracked cats slip away (`SLIPPED_AWAY`). Humble daily interactions are cut; the Sentry is the only lever.

**DR-43 · Off-screen model: director wall events.**
- They replace off-screen duels: one per district every 2–3 nights (promotion, feud scuffle, return, Restless, refill), each visible on the wall.
- Toughs are ordered 1–5 on the wall.
- **Morning Sniff:** the Tribute line, plus the raid forecast (always shown when a raid is coming), plus ≤ 3 nemesis items. Items are admitted only for cats with history with the player, or that touch the player's Patches or Crew.
- Stewing never picks Nodding Cats, cats under truce, Crew, or Regard ≥ 50.

**DR-44 · Cuts and caps.**
- **Cut:** Spats, Hangers-on, Clean Duels, First Captain, Lure, Old-Timers, gossip quirks (14 quirks → 6), the `scattered` outcome, F12 salience.
- **Backlog:** Kits, Wall Watch, Usurper, ageing.
- **Memory:** 10 entries, ≤ 6 pinned.
- **Caps:** slice ≤ 12 tracked; full game 27 seats + ≤ 12 off-wall.
- **Barks:** slice 20 triggers. Floors per personality only for the 8 most-heard; ≤ 240 lines. Fight barks are icon-only. `STANDOFF_FIRST` lines never repeat within 20 days.
- **Tag grammar:** formal, with a lint tool.
- **Narrative rule 13** ("Rivals never mention the household") applies to Life 8 only. In Lives 1–7 Rivals may cite the collar, bell, bowl and the Call, never a human.

**DR-45 · Botan** (Backlog content, ruled now): at her Verdict the inn's hand-bell rings and she is called home. Only Humble or Nose-Touch are offered. She is never recruitable.

## H. Territory and economy (half the game)

**DR-46 · Territory rules for the slice.**
- `rounds` is deleted (with its wipe rule). `seen` is the only presence rule: floor 0, step 0.20, 2-day grace.
- **A raid can take only a Patch below Strong** (Scent < 60); on a Strong Patch a loss becomes Scuffed.
- A lost Patch is retaken by revenge: a Standoff with the raid leader, no waves.
- While the Den is Open, its held outer Patches cannot be lost.
- **Forecasts are always on.**
- **Management surface:**
  1. The **Turf Board** at the Lot: drag a portrait onto a Patch.
  2. The Sniff forecast.
  3. The Doorstep pile.
- Style role on a post is automatic, and personality adds its perk (DR-37).
- **The Warden is the Den's first Sentry slot.** Upkeep is flat per post and auto-paid.
- **Cut:** Rations, Treats, Specialisations, the Established tier, Skim, Clout points, weather effects, the Larder/Scrounger terms, most Lot upgrades.
- **Claiming:** in the Lane the Den opens at 3 of 4 outer Patches held; in the other districts at 4 of 6.
- Humble is legal when the fight's Patch will become yours.
- Routing a thief returns its loot.

**DR-47 · Territory readability under a third-person camera.**
- Scent Posts are tall, landmark-shaped and visible at distance.
- Patch ownership shows in the world: scent wisps in the Clowder colour hang in the air at the post, with 1–4 wisps for strength. Bunting is not cat-true.
- **Whisker Sense** draws scent trails and a **scent compass ring** around Mikan pointing to rival marks, Rivals and hidden finds.
- The High Road rooftops give vantage over the Lane.
- The Turf Board at the Lot is the only map-like view.
- Numbers appear only on the Turf Board.

## I. Camera, art, safety

**DR-48 · The camera is third-person, like FF7 Remake (overrules brief §4).** Owner: commissioned doc **`design/gdd/camera-system.md`** (technical-artist; reviewers art-director, combat designer, UX). Combat owns combat timing.

| State | Spec (intent; tuning in the camera doc) |
|---|---|
| **Explore** | Behind and above the cat, ≈ 3 m back, ≈ 1 m up, gently pitched down. Player orbit on the right stick, with auto-follow when idle. Collision with walls and roofs. Low height makes the town feel huge. |
| **Combat** | Pulls back (≈ 6–8 m) and up to frame the controlled cat and its lock target. Soft lock-on keeps the target framed. Edge arrows show off-screen Posse cats and attackers. Fight ring ≈ 10 m. AI Posse cats stay within the frame bias. |
| **Slow Blink** | Lifts to a tactical three-quarter view over the controlled cat. |
| **Standoff / Pile-On / Zoomies** | Authored cuts and cut-ins. |
| **Home** | The same camera, closer and lower (cat height, 0.3–0.6 m). No separate grammar. Vignettes use authored shots. Humans are knees and hands unless they bend down (Pillar 1, now natural). |
| **Options** | FOV slider, camera speed, auto-centre toggle, reduced camera shake (motion comfort). |

Consequences, each owned by the named doc:
- **Art:**
  - The cat is large on screen (≈ 10–20% of screen height in exploration), so faces, Scars and personality animation read. The 48/64 px silhouette worries and the readable-axis distinctness rules relax: they are Backlog, kept only for crowded fights.
  - **Sky, hills and the sea are now in frame.** Painted skydomes and painted backdrop cards are back, and the reference's postcard look is reachable.
  - **The camera-aligned paint-over plate method is withdrawn** (the camera rotates). The environment method becomes stylised hand-painted textures and trim sheets with vertex colour on 3D geometry, plus painted sky and backdrop cards. To be proven by a one-alley **look-dev test** before the slice art budget is fixed.
  - All visible human writing stays Scribble, and more signage is now in view.
- **Level:** alleys wide enough for the camera; High Road traversal designed as third-person platforming.
- **Combat:** readability comes from the Posse bell-gold keyline and overhead tick, Clowder-colour enemy outlines, telegraph ground decals, edge arrows and the one-screen-effect budget.
- **UX:** HUD corners no longer collide with a top-down ring. Keep the HUD in the corners; the bottom-centre stays clear.

**DR-49 · Readable onomatopoeia on big hits (user decision; overrides the brief and the pillars' worked example).**
- **When:** T4 and T5 events show **one hand-lettered manga sound-effect word** (≈ 12% of screen height at T4, ≈ 30% at T5), drawn from ≈ 16 sound-words per language. T0–T3 keep shape-only glyphs.
- **Display rules:** at most one lettered word on screen at a time. Never over the controlled cat or the HUD. World-anchored graphic. Never at home.
- **Localisation:** each shipped language gets its own hand-lettered set in the house style (vector/SDF lettering assets, not a typed font). Japanese uses native onomatopoeia. Art owns the sets and the localisation brief.
- **Canon status:** onomatopoeia is the sound of the cat brawl, not human language, so it is a sanctioned exception to Pillar 1. A lettered word is never a human utterance.

**DR-50 · Flash and motion safety (overrides every feel row; owner of the mirror: UX in `design/accessibility-requirements.md`, commissioned).**
- Flashes: ≤ 3 in any 1 s (WCAG 2.3.1, area > 20% of the screen); ≤ 1 full-screen impact frame per second; local impact frames ≤ 15% of the screen.
- **No saturated red** changing over > 5% of the screen. Full-field speed lines in Ink or Paper Cream only. Onomatopoeia in Ink/Cream or the damage-type colour.
- Timing: every look event ≥ 2 rendered frames; shake as stepped offsets; global hit-stop ≤ 20% of any second.
- **The default configuration must pass an automated Harding-style analysis before any public footage.**
- Reduce Flashes and Reduce Motion options ship.

**DR-51 · Colour fixes (slice-relevant).**
- Every Clowder outline and the Posse keyline get a 1 px Paper Cream rim.
- Wall Sitters `#A8C878`.
- The Thump effect colour moves off Bell-Gold.
- Telegraphs: yellow becomes Paper Cream dashed with a triangle; red becomes Frazzle Magenta with a zigzag edge.
- The incoming-hit cue is an Ink/halftone pulse (coral is Koharu's colour).
- Collar Crimson fills carry Cream text.
- Disabled UI ≥ 3:1.
- Text floor 28 px at 1080p.
- P5 "printed, not rendered" applies to characters, VFX and combat UI only.
- Composition rule: home key art never uses the inside-looking-out veranda-to-garden frame with a pet in the yard.

## J. Audio, narrative staging, accessibility

**DR-52 · Sound-bible staging proposals (SB §16, 11–18), as the narrative critic ruled.**

| # | Ruling |
|---|---|
| 11 | Dusk chime **approved**. The Call answers it within 1 bar; the chime plays in Life 8. |
| 12 | Gran taps **three** times in the Call's rhythm and hums it once (Life 3, Backlog). |
| 13 | The Life 3 phone carries the complete Call. |
| 14 | Stage A exists. |
| 15 | Incense bell **rejected**; replaced by the rin in every Alcove ritual (slice). |
| 16 | Botan's inverted Call **approved**; no in-fight singer. |
| 17 | Sora whistles, never sings. |
| 18 | Home vacuum is a Texture prop (Backlog). |

**DR-53 · Call, bell and sound rules (slice).**
- The Call sounds one bar after the Dusk chime.
- **The bell's fourth beat:** Mikan's ear-turn head-shake rings the collar bell on the downbeat after the Call.
- The title screen never uses a sung Call. Sunspot naps quote the Foundation, never the Melody.
- Paw ticks avoid the rising third.
- The Tap-Tap and a ritual-sound table are added. Home Scent tones: one sustained note per human.
- Combat audio follows the DR-07 tiers: freeze bound to hit-stop scope; AI hits one tier lower; telegraph vocals by class; Hiss belongs to the acting cat.
- **Eight bark intents** per voice body, mapped from personality and trigger.
- Murmur safety: ≥ 3 source languages per crowd bed; household actors closed-mouth; never comic; a parody check on the listening panel.
- Rename to the Brass Call.
- "Haru late" Melody rule, Life 8 cues, carry cues: Backlog, ruled as in SB-N1–N4.

**DR-54 · Deaf/HoH parity mechanism (owner UX, carriers from Art).**
- **The Call glyph is always on**, in the singer's colour with shape coding the voice (Haru: three smooth yellow arcs).
- A bell glint on the fourth beat.
- **The Dusk lamp wave** runs uphill with the chime.
- Off-screen sounds at home: Mikan's ear-turn plus an ear Sense Icon.
- **Tone Sense Icons over Mikan replace Murmur Ribbons** (cut).
- Haptics on by default. A Rival sting contour glyph on the name-card.
- Test: every Keystone's Tier A fact reaches 90% of testers with audio muted.

**DR-55 · Sanctioned exceptions (recorded in the brief; not precedent).**
- Readable combat onomatopoeia (DR-49).
- The ring and white dress (Tier B only).
- The question-mark Sense Icon and the Call glyph (UI).
- The Doorstep as the licensed HUD space.
- Haru's Home Scent note in Life 8.
- The Call Ripple in Haru Yellow.
- The undetermined cause of death.
- The four street/home sound crossings.

## K. Commissions and gates

**DR-56 · Commissioned docs** (consolidations, slice scope first):
- `design/gdd/day-loop.md` (game-designer)
- `design/gdd/camera-system.md` (technical-artist)
- `design/accessibility-requirements.md` (ux-designer)

**DR-57 · Simulation gates for the slice:**
- Combat's small encounter sim (TTK, Frazzles per Daifuku phase, Crew share).
- Nemesis's Night Shuffle Monte Carlo over 7 days in one district, including a pacifist policy (Nemesis share at Grudge ≥ 75, arc achieved, Sniff noise).
- Territory's model for Lives 1–2 (Tribute ≈ 60 at the end of Life 2, no idle or wipe exploit).

Report the figures in each Revision Log.

---

# PART 2 — PER-DOCUMENT ACTION LISTS (binding)

## 1. `combat-system.md` (CX, CS)

**Fix now (blocks the slice):** CX-1 (via DR-08), CX-2 (DR-30), CX-3 (DR-29), CX-4 (ring and readability under DR-48), CX-5 (knock-offs, High Road Pounce; Daifuku), CX-6 (Set-up/Pay-off, Old Score, Style beats), CX-7 and CS-2 (DR-32), CX-8 (Auto-Hiss deleted), CX-11 (Fed Up 75 s), CX-12 (Fear flinch tell, 3 Fears), CS-1 (DR-31 targets), CS-3 (poise, DR-28), CS-5 (basic hits halved; Crew share), CS-6 (Pile-On timing), CS-7 (switching matters, via Tag-In), CS-8 (flat hit% over Lv 1–8), CS-10 (Purr/heal cap), CS-11 (damage-reduction floor), CS-12 (rank damage), CS-13 (DR-50), CS-16 (via High Road Pounce charge), CS-C1–C24 **for the 12 slice Moves only**, AB-T1–T42 (via DR-07), SB-X13/X14, UX-1, UX-2.

**Backlog:** CX-9, CX-10, CX-13, CS-9 (damage-cap ceiling at high level), CS-14, CS-15, CS-C for non-slice Moves, the full catalogue, Knacks, Tactics, Prowler/Trickster detail, Botan.

**Overruled:**
- CS-4 (Swagger with a Composure cap): Swagger is cut (DR-28); the leader re-Ruffle cooldown replaces Composure.
- CX-1 parts keeping Whack and Bap, and CS-7's Tag-In variant: DR-08 and DR-29.
- CX-2's per-Paw gradient: DR-30.
- All frame-level specification moves out of the GDD (DR-28).

**Implement:** DR-02, DR-05–DR-08, DR-22 (CR-21 rewritten), DR-28–DR-36, DR-37 (AI column and combat perks), DR-48, DR-49 (which events letter), DR-50. Cut the doc to ≤ 50 KB of slice body.

## 2. `nemesis-system.md` (NX, NS)

**Fix now:** NX-01, NX-02, NX-03, NX-04, NX-05, NX-06, NX-07, NX-09, NX-10, NX-12 (slice budget), NX-14, NX-15, NX-16 (slice lines), NX-17; NS-1, NS-3 (personality and `former_rank`), NS-4, NS-5, NS-6, NS-8 (as wall events and ordered Toughs), NS-9, NS-11 (grammar plus slice volumes), NS-12, NS-13, NS-16, NS-17, NS-18; NS-C1, NS-C2, NS-C5, NS-C7, NS-C11, NS-C12, NS-C13, NS-C14; PP-05, PP-14, PP-21.

**Backlog:** NX-08 (2nd/3rd comeback forms beyond the Lane), NX-11 (Kits), NX-13 (Life 8 Reckoning; ruled in DR-27), NS-2 (betrayal tuning; the Loyalty fix is Crew's), NS-7, NS-10 (full population and save), NS-14 (rewrite Appendix A.1 for the slice; A.2–A.3 Backlog), NS-15, NS-C8 (Comes Knocking), Wall Watch, ageing, multi-district behaviour.

**Overruled:**
- NX-C9 ("Holder"): it is Keeper.
- NS-C3 (visible recruit roll): deterministic, DR-09.
- NS-C4 thresholds 20/40/60: 30/60/80, DR-10.
- NS-C6: dismissal per DR-34.
- NS-C9: Nemesis requests, Territory resolves.
- NX's "keep Hold Firm" and the Spat "Wade in" option: all cut (DR-44).
- `temperament` (6-value) becomes `personality` with DR-37's wider remit.

**Implement:** DR-09 (availability gate), DR-12, DR-13 step 3, DR-23 (unlock ladder), DR-37 (generation, barks, Rival column), DR-39–DR-45, DR-53 (bark intents), DR-57 sim.

## 3. `territory-management.md` (TE)

**Fix now:** TE-2 (`rounds` deleted), TE-3 (seen floor 0), TE-6 (management surface), TE-7 (raid rules), TE-8 (spraying), TE-10.1 (Clout points cut), TE-10.9 and TE-X4 (Share a Morsel price), TE-X2, TE-X3 (price sheet), TE-X6, TE-X7, TE-X8, TE-X11, TE-X12, TE-X13, TE-X14; PP-03, PP-11, PP-12, PP-13.

**Backlog:** TE-1 and TE-5 (Life 8; ruled in DR-27), TE-4 (whole-game sinks and Life 7 surplus), TE-9 (late Tribute anchors), TE-10.2–10.8, TE-10.10, TE-X1, TE-X5, TE-X9, TE-X10, Roof Run, multi-district raids, PP-34–36.

**Overruled:** TE-X1 and PP-34 (Crew-cap curves): DR-14. TE-4's Pack Lunch: Bribes come from the Stash.

**Implement:** DR-13 steps 2 and 4, DR-14, DR-17, DR-18, DR-19, DR-37 (guard column), DR-46, DR-47 (readability under third-person). Run the Lives 1–2 model. Territory is half the game: the slice must offer a real daily posting decision (the forecast plus personalities make it one).

## 4. `crew-and-progression.md` (CP)

**Fix now:** CP-1 (learnsets only), CP-2 (delete F10), CP-3 (recruitment and Loyalty), CP-4 (answered by personality and signature perk), CP-5 (DR-33), CP-6 (delete Pending and last-copy rules), CP-8 (DR-34), CP-9, CP-11 (Lv 1–8 pacing), CP-12, CP-13 (personality), CP-14 (Zoomies II cut), CP-15 (renames for slice Moves), CP-16, CP-17; CP-X1–X3, X5–X15, X17; PP-07, PP-08, PP-20, PP-31.

**Backlog:** CP-7 (Watching), CP-10 (full catalogue audit), CP-X16 (Old Boss, ruled in DR-35), Home Moves, the heir, Mikan's ageing, stat curves beyond Lv 8 (re-derive over Lv 1–30 later).

**Overruled:**
- CP-13's stat-nudge table: personality has no stat nudge (DR-37).
- CP-X4: the matchup chart is DR-06.
- CP-1's "Lands On Feet once per encounter": Knacks are Backlog.
- UX-6b gate crate: DR-34.

**Implement:** DR-05, DR-09, DR-10, DR-11, DR-12, DR-22 (the old wall cat and the second recruit), DR-33, DR-34, DR-37 (loyalty and social columns; bonded/clashing pairs), DR-38. Six slice cats, one per personality.

## 5. `dual-story-progression.md` (DS)

**Fix now (Lives 1–2):**
- DS-C1, as DR-21: day-gating and Life-end rules.
- DS-C3, the Life 1 Alcove Texture only.
- DS-C4: always late; the piano.
- DS-C5: daily change; 2 Gift curios; morning auto-Feeding.
- DS-C6: the slice list in DR-01, plus the full-game spine as framing.
- DS-C11 storyboard 12.1, plus a new "A Tuesday in Life 2" Routine storyboard.
- DS-C12: plaster as the Scar asset; Knock rule.
- DS-X3 (the Bowl), DS-X6 (entryway and Box).
- PP-01, PP-02, PP-06, PP-10.

**Backlog:**
- DS-C2 (Carries, ruled in DR-27), DS-C3 (K5.1, Life 4 idiom), DS-C7, DS-C8, DS-C9.
- DS-C10, now superseded by DR-48: home scenes use the third-person camera at cat height.
- DS-X2, DS-X4, DS-X5, DS-X7–X14, DS-R5, DS-R8.
- All Lives 3–9 beat-by-beat content, condensed to a one-paragraph-per-Life framing.
- PP-16, PP-18, PP-23–28.

**Overruled:** the DS-C10 two-grammar camera and the wall-crossing descent. A single third-person camera is used (DR-48); a gentle lower-and-tighten move at the garden wall is allowed.

**Implement:** DR-01 (home column), DR-21–DR-24, DR-26, DR-27 (keep §9 as the Life 8 framing only; detail to Backlog), DR-40.6 (plaster), DR-53, DR-54, DR-55. Name and voice the old wall cat with Crew.

## 6. `art/art-bible.md` (AB)

**Fix now:** AB-5 (single tier table), AB-7 (Lane palette, keyline rim, Thump colour), AB-8 (DR-50), AB-9 (≥ 2 rendered frames, stepped shake), AB-12, AB-13 (three base meshes), AB-14 (composition rule), AB-T1–T42; UX-7, UX-X13/X14; SB-X14.

**Backlog:** AB-10 and AB-11 (handheld budgets, outlines and AA on handheld), AB-15, handheld floor (E-5).

**Moot or overruled by DR-48:**
- AB-1 (paint-over plates withdrawn): replaced by a look-dev test of the third-person environment method (Fix now).
- AB-2 and AB-3 (38/48 px cats, readable axes): relaxed; crowd-fight readability goes to Backlog.
- AB-4 (sky never in frame): now in frame. Keep the P5 limits; mock frames per E-1.
- AB-6 (two-camera system): one third-person camera.

**Implement:** DR-07, DR-37 (six personality animation sets), DR-47 (scent wisps, landmark posts, scent compass), DR-48 (environment method and look-dev; painted sky and backdrops; large-cat detail and LOD), DR-49 (lettering sets and localisation brief), DR-50, DR-51, DR-54 carriers. Split §10–13 into `design/art/` companions.

## 7. `audio/sound-bible.md` (SB)

**Fix now:** SB-N3 (title and naps), SB-N5 (Call answers the chime; fourth beat; pre-flap end-of-Dusk Call), SB-N6 (K1.3 `first_call`, K2.4 rewrite, K2.5 `envelope`, K2.1 accent), SB-N7 (Tap-Tap, ritual sounds, Home Scent), SB-N8 (tiers), SB-N9, SB-N10, SB-N11 (bark intents), SB-N12 (slice twins), SB-N13, SB-N15; SB-P11, SB-P15 (rin).

**Backlog:** SB-N1, SB-N2 and SB-N4 (Life 8 and the "Haru late" rule; ruled in DR-27/DR-53), SB-N14, SB-N16, SB-N17, SB-P12–P14, SB-P16–P18, full-game music budget (≤ 75 min).

**Overruled:** SB-N12.6 Murmur Ribbons (cut, DR-54). SB-N6's Stage C Koharu question (Koharu pathos cap, DR-27).

**Implement:** DR-01 (≤ 25 min music, slice voice bodies), DR-07, DR-37 (bark intents by personality), DR-49 (lettered words have no voiced reading), DR-52, DR-53, DR-54. Retime the Dusk system for 4-minute phases.

## 8. `ux/hud.md` + `ux/key-screens.md` (UX)

**Fix now:**
- UX-1 (DR-08).
- UX-2, redone for the third-person camera: corner HUD, no world text except damage numbers, one bark balloon and onomatopoeia; Frazzle gauge on the enemy; identity ribbon only for named Rivals; Frazzle bonus as pips; rows fixed by D-pad.
- UX-3 (Fence Line as a continuous wall, no rank labels).
- UX-4 (beat sheet per DR-22).
- UX-5: no numbers for Grudge, Regard or Scent; DR-10 tier names; Bribe row; one Verdict per fight; Gloat ≤ 3 s.
- UX-6c, UX-7, UX-8, UX-9.
- UX-10 (accessibility basics into the commissioned doc), UX-11.
- UX-X1–X7, X9–X15, X18–X20; CX-C1, CX-C6; PP-31.

**Backlog:** the full-game Turf Board (multi-district), one-handed presets, per-screen split, Life 8 and Life 9 screens.

**Overruled:**
- UX-1's Whack, Bap and chord layout: DR-08.
- UX-6a and UX-6b: forgetting rules cut (DR-38); "make room" replaces the gate crate (DR-34).
- UX-5's Willingness % and the Rations/upgrade panels: cut systems.
- UX-2.1 HUD keep-out for a top-down ring: moot under DR-48.

**Implement:** DR-08, DR-17, DR-19, DR-22, DR-24, DR-36, DR-37 (the Crew card shows personality as a pose and an icon, plus bonded/clashing marks), DR-40, DR-42, DR-43, DR-46, DR-47, DR-48 options, DR-50, DR-54. Author `design/accessibility-requirements.md`.

---

# PART 3 — PILLAR SCORECARD

| Pillar | Now | After revision (slice) | Why |
|---|---|---|---|
| 1. Cat's-Eye Truth | 7 | **8.5** | The management spreadsheet goes (Rations, willingness %, Clout points). No food enters the house before Life 8. The cat-height third-person camera makes "humans are knees and hands" natural. Readable onomatopoeia is a bounded, sanctioned exception. |
| 2. Two Lives, One Clock | 6 | **8** | Day-gating, a 25-minute day, the Way Home, Well-Fed felt in the fight, Haru as a person (late, the piano) and a daily home find. Life 8 is unified but only framed; it is proven later. |
| 3. Conduct the Brawl | 5 | **8** (prototype must prove it) | Simpler and deeper where it counts: Tag-In/Relay, personality-driven AI, the Pile-On by minute 15, Bosses that stagger, knock-offs that work. The frame-data sprawl is gone. |
| 4. Rivals Remember | 7 | **9** | Nemesis slots, silhouette Scars now visible up close, the Life 1 return, memory at the Rout, Lick In, a rebalanced Verdict table, and personality shared between Rival and Crew, so the cat you beat is the cat you get. |

---

# PART 4 — ESCALATED TO THE USER

Already settled by the user, not re-opened: slice-first target, simplified combat, personality hook, third-person camera, the tight 3-district game, readable cat text, readable localised onomatopoeia.

| # | Decision | Why it is the user's | **Default (work proceeds on this)** |
|---|---|---|---|
| E-1 | How close to the reference look ("reference-close" soft vs "print-stylised" halftone), now that the sky is in frame | Taste; the first impression | Print rules on characters, VFX and combat UI only; soft painted environment and sky. Confirm on two mock frames from the look-dev test. |
| E-2 | Environment art method for a rotating third-person camera (hand-painted textures and trim sheets vs a heavier stylised-lighting approach) | Budget and team skills | Hand-painted textures and trim sheets plus painted sky/backdrop cards, decided by the one-alley look-dev test. |
| E-3 | The ending: Mikan simply comes home, or Mikan's passing is implied | The game's thesis | Mikan is alive in the morning; the last sound is the bell. |
| E-4 | IP review of the nemesis system (the WB patent flag) | Legal | Counsel review before any public showing; document our differences. |
| E-5 | Handheld floor (Switch 1-class vs Switch 2-class) | Platform and budget | Slice on PC; budget the handheld check for Switch 1-class later. |
| E-6 | Cultural review (Alcove, incense, rin, funeral, Murmur sourcing) and the content note | Cultural and legal risk | Hire a consultant before the slice's home content is final; content note opt-in in Options. |
| — | Still open from the brief | | Engine (default Unity URP), title, Haru's presentation, Mikan customisation, night lock until the cat flap, Spray presentation — defaults unchanged. |

*End of rulings.*

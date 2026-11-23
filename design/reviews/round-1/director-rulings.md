# Director Rulings — Round 1

*Author: creative-director · Date: 2026-11-23 · Status: **BINDING** for round-1 revisers (overrides `creative-brief.md` v1.0 and `game-pillars.md` where they conflict; the brief has been updated to v1.1 to match).*

Inputs: all eleven round-1 critiques, `sim/territory_economy_model.out.txt` not used (not needed: the critics' hand figures are consistent with each other). Where a ruling cites a critic's issue, the ID prefixes are:

| Prefix | Critique file | Their own IDs |
|---|---|---|
| **CX** | combat-system--experience | Issue 1–13 → CX-1…CX-13 |
| **CS** | combat-system--systems | S-1…S-16 → CS-1…CS-16; conflicts C-1…C-24 → CS-C1… |
| **NX** | nemesis-system--experience | N-XP-01…17 → NX-01…; conflicts C1–C9 → NX-C1… |
| **NS** | nemesis-system--simulation | Issue 1–18 → NS-1…; conflicts C1–C16 → NS-C1… |
| **TE** | territory-management--economy | Issue 1–10 (10.1–10.10) → TE-1…; X1–X14 → TE-X1… |
| **CP** | crew-and-progression--design | Issue 1–17 → CP-1…; X-1…X-17 → CP-X1… |
| **DS** | dual-story-progression--creative | C1–C12 → DS-C1…; X1–X14 → DS-X1…; R1–R9 → DS-R1… |
| **PP** | paper-playtest | PP-01…PP-36 |
| **AB** | art-bible--technical | Issue 1–15 → AB-1…; §4.1 rows #1–42 → AB-T1… |
| **SB** | sound-bible--narrative | N1–N17 → SB-N1…; staging rulings 11–18 → SB-P11…; X-1…X-14 → SB-X1… |
| **UX** | ux--art-direction | Issue 1–11 → UX-1…; X1–X20 → UX-X1… |

**How to read this.** Part 1 is the law. Part 2 tells each reviser exactly what to do. If Part 2 and Part 1 ever disagree, Part 1 wins. Anything a critic proposed that is **not** mentioned here and does not contradict a ruling is upheld by default; anything that contradicts a ruling is overruled by it. "Owner" means the only doc allowed to define the thing; every other doc cites it by name and never restates its numbers.

**The test I applied to every dispute:** does it make the nemesis and the combat stand out in the player's hands, does it protect the dual story as the USP, and is it the smaller design? When two critics disagreed, the cut won unless it cost a pillar.

---

# PART 1 — GLOBAL RULINGS

## A. Single ownership of doubly-defined things

**DR-01 · One Move/Knack catalogue, owned by Combat.** Every Move, Knack and Zoomies definition and number lives in `combat-system.md` (data: `assets/data/combat/moves.*`, `knacks.*`) in Combat's grammar: MV, a **separate** FZ budget, frames, flags, CR-15 statuses only. Crew owns **only** `assets/data/crew/learnsets.*` keyed by `move_id` (columns: `styles[], source, rank, instinct_level, signature_eligible`). Crew deletes its Pow/Frz/Effect columns, its F10 HE model and its §3.13 Posse-index table. Combat's 20 starters are the canonical rows; Crew's set-up/pay-off intents and surviving names migrate in under DR-38. *Rationale: two scales produced a Frazzle loop where spending a Paw frazzled less than pressing Swipe.*

**DR-02 · Numeric scale.** 1-Paw Move = MV 3.5 **and** FZ 35; 2-Paw = MV 8 (or strong utility) and FZ 70; **3-Paw row added** = MV 12.5 / FZ 105 (Crib Guard only). Moves never refund their own cost; Paw *transfer* to another cat is allowed at ≤ 0.75 Paw per Paw spent. Amplifier product (Type × Crit × Buff × Opener) clamped **≤ 1.60** before PoiseMod; single-hit MV cap 8.0 including add-ons; GuardMod floor 0.30. Owner: Combat. *Rationale: CS-9/CS-11 ceiling and turtle exploits.*

**DR-03 · Style matchup chart (owner Combat; shape is canon, values tunable).** Rule the player can guess: **a Style resists its own damage type.**

| Style | Native basic type | Resists (×0.80) | Weak to (×1.20 dmg, ×1.25 Frazzle) |
|---|---|---|---|
| Bruiser | Thump | Thump | Fang |
| Scrapper (Mikan) | Claw | Claw | Thump |
| Prowler | Fang | Fang | Yowl |
| Yowler | Yowl | Yowl | Claw |
| Trickster | mixed | — | — |

Daifuku (Bruiser) is neutral to Mikan's Claw in Life 2; Ikari (Scrapper) resists it in Life 5, where that restructure beat is designed. Rival Strengths/Fears then modify per cat. *Rationale: one sentence ("don't fight claws with claws"), punishes mono-Style Posses, keeps the Life 5 beat.*

**DR-04 · Game-feel/VFX tier table: one table, owned by Combat.** Adopt AB §4.2 verbatim as `combat-system.md` § Impact Moments. Art keeps drawings, colours and shapes and cites it; Audio maps its layers to the same T0–T5 (DR-93). Summary of the binding rows:

| | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| Events | whiff, prop, blocked | light basics | string finisher, Whack, Pounce, Tag-In strike, Splat | 1-Paw hit, Counter-Pounce, Bap on Captain+, Fear trigger, Hiss interrupt | 2-Paw hit, Frazzle hit, Tough/Critter Rout, Back Down | Pile-On, Zoomies, Boss phase break, Captain/Boss Rout, final Rout |
| Hit-stop atk/victim (ticks) | 0/0 | 2/3 | 4/6 | 6/9 | 9/12 global | 14/14 global |
| Shake peak (% vh), stepped | 0 | 0 | 0.40 ×3 steps | 0.70 ×4 | 1.10 ×5 | 1.60 ×7 |
| Impact frame | — | — | — | local disc ≤15% screen, 2 ticks | full-screen inverted 2 + shape flash 2 | full-screen 3 + 2 |
| Glyph burst | — | spark | 1 | 2–3 | 4–5 | giant (30% vh) |

Plus the player-authorship rule (AI-autonomous hits render one tier lower; a Tough Rout is T4 full-screen only if player-authored and none in the last 60 ticks), and the safety row in DR-89. *Rationale: three docs had three tier systems.*

**DR-05 · Final control map (owner UX, actions owned by Combat). All remappable; every chord and hold has a one-button/toggle alternative.**

*Gamepad (positional: West = X/□, North = Y/△, South = A/×, East = B/○)*

| Input | Exploration | Combat |
|---|---|---|
| Left stick | Move | Move |
| South | Hop / jump to High Road | Hop (airborne Swipe = Pounce) |
| West | Swat | Swipe |
| North | Interact (Spray, Sniff, Nap, Beg, pick up / put down food) | Whack (single input, no hold); **becomes Pile-On while one is available** (prompt over the Frazzled enemy) |
| East | Dash (hold = sprint) | Skitter |
| R1 | Stalk (hold) | Brace / Bap |
| R2 | **Whisker Sense** (hold; toggle option) | **Slow Blink** (press toggles) |
| L2 | — | Hiss |
| L1 (hold) + W/N/E/S | — | Shortcut Move 1/2/3/4 |
| L1 + R1 | — | Zoomies (controlled cat) |
| D-pad | Left/Right = Tail-Up picker; Up = Meow; Down = Sit (hold 1.5 s = **Head Home** thread, DR-15) | Direct switch: Up = Mikan, Left/Down/Right = Crew slot 1/2/3 (a timed switch is a **Tag-In**, DR-36) |
| R3 / right stick | — (no camera control) | Lock-on toggle (**auto lock-on ON by default**) / flick = next target |
| L3 | Bell ping | — |
| View / Menu | Fence Line / Pause | — / Pause |

*Inside Slow Blink:* stick or D-pad Up/Down = cursor; **L1/R1 = change cat** (skips Routed); South = confirm; East = back; North (hold) = info; West = Tactic; hold View = Scram; R2 = close. Commands **chain** by default while any Posse cat can afford one.

*Keyboard & mouse*

| Action | Combat | Exploration |
|---|---|---|
| Move | WASD | WASD |
| Swipe / Swat | LMB | LMB |
| Whack (Pile-On when available) | RMB | — |
| Hop / jump | Space | Space |
| Skitter / Dash | Shift | Shift (hold sprint) |
| Brace / Bap | Q | — |
| Stalk | — | Ctrl (hold) |
| Hiss / Interact | F | E |
| Slow Blink / Whisker Sense | Tab | Tab (hold) |
| Shortcut Moves | 1–4 | — |
| Zoomies | R | — |
| Pile-On | E | — |
| Switch Mikan / Crew 1 / 2 / 3 | Z / X / C / V | — |
| Lock-on / next target | MMB / wheel | — |
| Tail-Up picker / Meow / Sit | — | V / T / C |
| Head Home thread | — | H (hold) |
| Bell ping / Fence Line / Pause | — / — / Esc | G / J / Esc |
| *Inside Slow Blink* | W/S or mouse = cursor; Q/E = change cat; Space/LMB = confirm; Esc/RMB = back; Alt (hold) = info; T = Tactic; Backspace (hold) = Scram; Tab = close | |

Whisker Sense is **unavailable in combat** (Slow Blink shows props and known Fears). L3+R3 chord, Bunny-Kick hold, Bruiser Sit-hold, HUD's "everyone on my target" directive, in-menu L1 direct pick and right-stick peek are **cut**. *Rationale: Combat's verbs, UX's conductor logic, one "see" button, no colliding chords.*

**DR-06 · Recruitment: deterministic.** No Willingness roll. **Nemesis owns availability**: Recruit is offered when the Rival is held for the Verdict and (Grudge < 90 or Regard ≥ 50) and the Crew has room (or the player makes room, DR-70). Bosses are recruitable from Daifuku on at Regard ≥ 50. **Botan is never recruitable** (DR-60). **Crew owns the price and starting Loyalty**:
- **Bribe** (player-facing name; "Offering" is reserved for Life 8): `fair = 8 × level × rank_mult` (Stray 0.75, Tough 1, Captain 2, Boss 4); steps **none / fair / feast (2×)**; **paid from the Stash** automatically (debited at tomorrow's Doorstep; may go to 0, never negative — if short, the step is greyed).
- **Starting Loyalty** `L0 = clamp(5, 80, 50 − 0.4·G_pre + 0.3·R + t_temp + 20·settled + 5·bribe_step − 20·returned)`, where `G_pre` is Grudge **before** Nemesis's recruit halving and `bribe_step` ∈ {0,1,2}. Story recruits and Friend Strays have fixed values in Crew (Friend Strays 55). Life 1 recruits are free.
- The Fear penalty is cut. Thaw (Grudge-memory easing) reads `G_pre ≥ 60`.
*Rationale: "I chose Recruit and the game said no" at Pillar 4's peak (CP-3, PP-21); fixes the 0-carried-Morsels dead end (PP-12).*

**DR-07 · Loyalty thresholds — one table, canon in the brief §8.** Tiers: **Shifty 0–29 · Aloof 30–44 · Steady 45–59 · True 60–79 · Sworn 80–100.** Gates: teach a Lesson at Steady+; Den Sentry (= Warden, DR-77) at True+; heir prefers Sworn. **Betrayal threshold: Loyalty < 30** → the cat is **Wavering** (shown in the Sniff, two warning mornings) → if still < 30 on the third night, **Turncoat**. No tier is immune. Nemesis reads, Crew writes. *Rationale: three docs had three bands (NS-C4, CP-X7).*

**DR-08 · Loyalty formula (owner Crew)** must contain these nightly/daily inputs and no others: Posse use that day **+2**; posted **and** that district `seen` within 3 days **+1**; posted and **unseen > 3 nights −1 × m** (m = 1 ex-Stray/Tough, 1.5 ex-Captain, 2 ex-Boss); Lounging ex-Captain/ex-Boss **−1** (pride: an ordinary post satisfies only ex-Strays/Toughs); **Share a Morsel** at the Lot **+2** to the whole Crew (DR-79); Lesson taken **+1**; Routed in a lost fight **−3**. Loyalty → stats is **cut**. **No absence drain in Life 8.** *Rationale: makes betrayal fire from neglect, symmetric for posted and idle cats (NS-2); kills the per-cat meal chore (PP-13).*

**DR-09 · Schema field names.** One Cat Schema gains `temperament`, `regard`, `former_rank`, `signature{strength_id, move_id}`.
- **`temperament`** — Nemesis-owned, top-level, **6 values** (Braggart, Brooder, Schemer, Fraidy, Stalwart, Goofball), each with a ±8% stat nudge: Braggart +Bite −Hide; Brooder +Nerve −Zip; Schemer +Zip −Nerve; Fraidy +Zip −Bite; Stalwart +Hide −Voice; Goofball +Voice −Bite. Mikan neutral. Crew's 11-value enum is **deleted**.
- **`former_rank`** — Nemesis-owned (written at recruit), read by Crew.
- Renames to kill collisions: Nemesis state `Perched` → **`Seated`**; breaking point "Cowed" → **"Cowed Down"**; Patch-holding Rival = **Keeper** (`keeper_id` everywhere; "Holder" retired); Territory upgrade "Settled" → **"Claimed-In"**; "Holdouts" = the cats (Nemesis), "Holdout Patch" = the Patch (Territory); Crew Move "Pounce" → **Leap**; Crew "Hiss" → **Withering Hiss**; Crew "Yowl" → **Howl**; Crew "Bunny-Kick" row deleted (the Scrapper basic keeps the name); Moves "Nine Shadows" / "Everything Off The Shelf" renamed (Zoomies keep the names); Knack "Stubborn" merged into **Lands On Feet**; wound vocabulary renamed (Neck Nip → **Scruff Nip**, Hamstring → Ankle Ambush, Go For The Throat → Pick On The Puffed); audio "Swagger" theme → **the Brass Call**; "Share a Meal"/"Treat"/"Share a Morsel" → one verb **Share a Morsel**; recruit payment → **Bribe**; UI names **Turf Board** and **phase dial** ("Sky Disc", "Turf" retired).
*Rationale: PP-22, NS-3, CP-13.*

**DR-10 · Night Shuffle (canon order; replaces brief §5.3).** Every random draw uses a counter-based substream `rng(save_seed, day_index, step_id, subsystem_id, cat_id, ordinal)`; prehistory and time-skip nights use **negative** day indices; daytime outcome rolls (Nose-Touch acceptance, Scar pick, Ambush moment, bark pick) are seeded on `(save_seed, encounter_serial, cat_id)` so reloading reproduces them.
1. **Crew** — nightly Loyalty deltas (DR-08); Sentry XP.
2. **Territory** — Scent decay; flat upkeep; resolve the raids **requested last night** (they were forecast in today's Sniff); uprisings; emit `PatchChanged`.
3. **Nemesis** — (a) betrayals (Wavering ≥ 2 mornings and Loyalty < 30 → Turncoat); (b) comebacks from Away; (c) one director **wall event** per simulating district every 2–3 nights (DR-61); (d) vacancy refills, promotions; (e) Grudge decay and Nemesis-slot reassignment; (f) raid requests for **tomorrow night** (≤ 1 per district, ≤ 2 town-wide); (g) arc director.
4. **Economy** — Tribute from Patches held after 2–3, placed on the Doorstep (**none in Life 8**).
5. **Narrative** — next morning slot; Life transition check (DR-23).
The Morning Sniff reports 1–4 through the filter in DR-57. *Rationale: Loyalty must be computed before betrayal reads it; raids "fixed a night early" becomes structural.*

**DR-11 · Morsel prices set by two docs → one price sheet, owned by Territory/Economy.** Lessons use Crew's structure: **Rank I 40 · II 150 · III 450 · IV 1,000**, ×1.5 cross-Style; Rank IV cross-Style = **1,500 + 2 Shinies** (canon endpoints kept). Knacks cost as Rank II / Rank IV Lessons. Bribe per DR-06. Feeding = **Share a Morsel** at `Σ level of the Crew` Morsels, once per day (DR-79). Territory's Treat, its recruit-offering formula and its 6-tier Lesson table are **deleted**. Shiny total revised to **≈ 80** (Specialisation/Established sinks are cut). *Rationale: TE-X2–X4, CP-X17.*

**DR-12 · Crew cap and Clout table (owner Territory).** Crew cap by Clout rank: **6 / 7 / 8 / 10 / 12 / 14 / 16** (was 24). Sentry slots by rank: **1 / 2 / 3 / 5 / 7 / 9 / 11** (the Den's first slot is the Warden, DR-77). Clout gates on **milestones only**; Clout points are cut. *Rationale: "Crew are few and known"; posting stops being strictly dominant because posts < cap − 4 (TE-6, CP-8).*

## B. The day

**DR-13 · Day shape and clock.** Four phases of **4 real minutes** each (Morning, Day, Dusk, Night) = **16 minutes of roaming clock**. The clock runs only while roaming; it **pauses inside Haru's wall (garden included)**, in combat, Standoffs, Verdicts, menus and the Lot. Sunspot nap = half a phase (2 min). End of Night (and end of Dusk before the cat flap): drowsy, **1-minute** grace, then the Head Home thread auto-walks Mikan home. Suspend-on-quit anywhere plus autosave at every phase change (handheld). *Rationale: PP-17 measured 45–55 min mid-game days against a 30-min promise; the cut comes from the clock and the chores, not the fights.*

**DR-14 · Real-minute budget per day (binding acceptance target; measured at the 75th percentile in playtest, hard cap 40 min).**

| Segment | Early (Life 1–2, pre-flap) | Mid (Life 3–5) | Late (Life 6–7) |
|---|---|---|---|
| Home morning, wake → door (no Keystone / Keystone) | ≤ 0.25 / ≤ 1.5 | same | same |
| Doorstep + Morning Sniff | ≤ 0.5 | ≤ 1.0 | ≤ 1.0 |
| The Lot | ≤ 1.0 | ≤ 2.0 | ≤ 2.0 |
| Roaming clock | 12 (no Night) | 16 | 16 |
| Encounters (paused), incl. Standoffs and Verdicts | 4–6 (4–5 fights) | 8–10 (6–8 fights) | 9–11 (6–8, longer leaders) |
| Way home | ≤ 1.5 | ≤ 1.5 | ≤ 1.5 |
| Evening at home | ≤ 2.0 | ≤ 2.0 | ≤ 2.0 |
| **Total** | **≈ 22–25** | **≈ 30–33** | **≈ 32–35** |

Encounter design target: **6–8 encounters per day** from Life 3. Life 8 day shapes are in DR-29.

**DR-15 · How the player gets home ("the Way Home").** (1) At the Dusk Call, and on hold-D-pad-Down / hold-H at any time, a bell-gold **scent thread** appears along the High Road to Haru's wall; level design guarantees **≤ 90 s** of travel from any point of any district. (2) **Roof Run**: from any Sunspot, an authored ≤ 8 s rooftop run to the garden wall or to the Den Sunspot of any claimed district; advances the clock 30 s; unlocked when Hidamari Lane is claimed. No other fast travel. (3) **Caterwauls** fire only for Patches in the current or an adjacent district (120 s window). *Rationale: PP-30; Pillar 2's "short trip, rewarding arrival" now has an owner.*

**DR-16 · Daily-reset budget: at most three once-a-day actions in the whole game.** (1) **Share a Morsel** at the Lot (one button, whole Crew). (2) The **"What changed today?"** home find (DR-27). (3) **Tribute** on the Doorstep (automatic pick-up as Mikan passes). Everything else is either a one-time find or event-driven: own Rub Marks give **no Scent** (they count as a `seen` visit, done in passing); own Spray is offered **only below Strong**; Caches are one-time; Feeder/back-door daily scraps are cut; Humbled-resident visits are cut; Friend Stray daily Trust pips become a one-time scent-trail favour. Lesson limits (Mikan 3/day, others 1/day) are limits, not chores. *Rationale: PP-13 BLOCKER — four authors each added "a few" chores.*

**DR-17 · Losing ends the outing, not the day.** On a Posse wipe Mikan slinks home (Routed arrival, the Tended evening with Haru's plaster); if before Dusk, the clock jumps to Dusk and the evening vignette plays. The Night out is forfeit. **20% of the day's field haul** (Morsels earned since leaving home, not yet Stashed) is lost; the Stash is always safe. In Life 1 nothing is lost. The victor is promoted and Gloats (≤ 3 s). Crew Loyalty −3 per Posse cat. *Rationale: PP-06; closes the wipe-skip exploit together with DR-73.*

**DR-18 · The curfew trade made felt.** **Well-Fed** (home by Dusk, evening bowl): next day, Mikan's Zoomies gauge **starts at 5% per Bond heart (max 50%)** and every Posse cat starts each encounter with **+25 Pounce points**. The old "+2% max Nerve per heart" is deleted; Well-Fed is a day-start modifier, not a status icon. **Night** pays only in Night-only things: Night Rivals, Shinies, Clout — never Morsels. *Rationale: PP-19; home must show up in the first second of the next brawl.*

**DR-19 · Owner of the day: new doc `design/gdd/day-loop.md` (owner: game-designer).** Commissioned. It owns: the clock implementation detail (DR-13), the session budget and its playtest acceptance tests (DR-14), the Way Home, Roof Run and Caterwaul reach (DR-15), the daily-reset audit (DR-16), encounter density per district/phase, save/suspend. Target ≤ 25 KB, 8 GDD sections. It may not redefine phases or Life rules (brief §5). Every other doc cites it for these items.

**DR-20 · Morning and Lot budget enforcement.** The morning Feeding auto-resolves as Mikan passes the Bowl (the full Feeding ritual is the evening's). The Lot shows one screen: Posse, Turf Board, Lessons, Share a Morsel. Management happens at the Lot and the Doorstep only; the Fence Line is **read-only** anywhere on the street, at the Doorstep and the Lot, **never inside the house**.

## C. Home story, the Lives, and what ends them

**DR-21 · Home-story beats are gated by day count only. Never by turf, never by a Boss kill.** Every Keystone, **including each Life's Closing**, has `day_gate(k)` within its Life. Delete `turf_gate` everywhere and delete Rule 7 ("Haru does not marry while the player ignores the Harbour"). Delete the essential-cut and montage-insert forms of every Keystone; no Keystone is ever compressed. *Rationale: DS-C1 — players read reward structures before stories; Haru's life must not be a progress bar for conquest.*

**DR-22 · The turf goal gates only the time-skip.** Conquest moves the *years*, not the *days*. When a Life's Keystones run out before its turf goal is met, the house enters its **Plateau**: a season, not a frozen frame (1–2 Routine prop drifts per extra day; Life 7's Plateau has the richest Texture pool, 4 Textures).

**DR-23 · What ends a Life.** A Life ends at the first sleep at home after **all** of: (a) its turf goal is met, (b) `day_in_life ≥ life_min_days`, (c) its Closing Keystone has played. Then the time-skip montage. `life_min_days` = **2, 5, 5, 5, 5, 5, 6, (Life 8 per DR-29), 2**. Target 5–7 days per Life 2–7. A player who claims early gets victory-lap days (Echo props, the Fence Line reacting).

**DR-24 · Closings are never Forensic.** A Closing that comes due on a Late arrival waits for the next morning slot (or the next on-time evening). Witness/Forensic dual staging survives for at most one non-Closing evening Keystone per Life. ≥ 70% of non-Closing Keystones are tagged `morning`. *Rationale: PP-18 (the Life 4 proposal on a Night-district Life).*

**DR-25 · Story players and Bosses.** The time-skip still needs the district Boss Routed. Help is cat-true and Pillar 4: each Posse wipe against the same Boss leaves it wearing a visible plaster and **−10% max Nerve for the rematch** (stacks to −30%, all difficulties; resets when beaten). Kitten + Auto-Scrap must clear every Boss in playtest. *Rationale: PP-16 without a skip button.*

**DR-26 · Life 1 and the first 15 minutes (canon outline; Narrative owns K1.x, UX owns the minute-by-minute beat sheet, Combat owns what is taught).** 0:00–0:04 K1.1 (Haru *hums* — not the Call). 0:04–0:08 garden: move, Hop, Swat/Skitter on a crow. ≈ 0:08–0:10 the old wall cat ("Use your whiskers, Collar.") teaches Whisker Sense and **joins as the first story recruit** (free). 0:10–0:15 a two-Stray lane fight: switching (D-pad), the first Paw, Slow Blink opening itself, commanding the other cat, Frazzle on the last enemy → **a two-cat Quick Pile-On by minute 15**. Then the scripted short escalation at Low Wall Corner (DR-80), the First Thorn Standoff (normal interruptible flee, DR-52), Spray, nap. Day 1 Dusk = **K1.3, the first Call** (the motif's first meaning; UX's minute-2 Call is cut). Day 2: the Thorn at the gatepost (1-item Sniff), the first Verdict, the **second recruit** (third Posse cat) before Life 1 ends (≈ minute 45–50); K1.4 Closing. Full Posse of four by Life 2 day 2. Frazzle and Pile-On are taught in Life 1; Whack, Ambush, props/Fears, Bap, Tactics, Sentries, Lessons, Zoomies in Life 2, one per fight. *Rationale: PP-04/PP-09 BLOCKERs — the hook must arrive in the first session.*

**DR-27 · The home has a daily game.** Each day the Routine layer changes **one** thing in the house; a fresh Home Scent trail leads to it; finding it grants the day's Bond "other" slot (no new currency). Haru gets specifics that run through all nine Lives: **she is always late** (the second Goodbye) and **the upright piano is hers** (a diegetic prop in the Main Room in all house states; Mikan can walk on the keys; lid shut and dusty in Life 8; Koharu plays her piece in Life 9). **No food enters the house before Life 8**: Lives 1–7 Gifts are Critter/curio trophies (beetle, cicada shell); K2.1's Gift tutorial uses a cicada shell. Each district hides **2** authored Gift curios found by Whisker Sense. *Rationale: DS-C4, DS-C5, TE-5; protects the inversion.*

**DR-28 · Teach death before it matters.** K5.1 becomes **"Black Shoes"** (the entryway crowded with black shoes in the exact framing K8.6 reuses; Haru's first incense; Comfort) — Gran's death is played, not montaged. Add the Life 1 Texture where Gran's hand goes still at the Grandpa photo; the sock-on-sock romance idiom three times in Life 4; the ring carries Tier B only (sanctioned exception). "She is not coming back" criterion moves to the end of K8.6 (90%). *Rationale: DS-C3.*

## D. Life 8 — one specification

**DR-29 · Life 8 (owner: narrative-director in `dual-story-progression.md` §9; Territory, Nemesis, Crew and Combat supply numbers in their own docs and cite §9; no doc may add a Life 8 rule §9 does not authorise).**

| Question | Ruling |
|---|---|
| **Playable when** | From its first day. **Stage A = 3 ordinary playable days**: A1–A2 normal (Haru home, Dusk Call — the **last complete sung Call is A2's ordinary Dusk**, unmarked); A3 = the last Goodbye in the morning, a Dusk where the Call does not come, the covered plate. That night: B (the phone). No territory Vigil auto-sim; no R13.3 time-skip shuffle on `LifeAdvanced(8)`. |
| **The wait (B–D)** | 3 in-game days, played live. Sleep unlocks only from Dusk; Wait holds advance half a phase. The street stays reachable but quiet: **Ambush budget 0**, raids resolve off-screen at the normal cap. Knock targets disabled in B–D. Reckoning changes (returns, Pretenders, conceded Patches) resolve in these nights and are presented as *the state of the wall* on the first street morning. |
| **Season Turn** | ≈ 20 s held shot **outside**, Mikan on the Doorstep beside the Tribute pile; the pile grows, crows take it, leaves, frost; Mikan becomes **Old** here (the duller bell strike starts here). Elapsed decay is applied once, capped so **no district loses its Den**. |
| **Food carries** | **3 Carries on 3 different days; one counts per day.** Carry 1: one fish from the **Stash** under the veranda. Carry 2: **Fresh Catch** from a held (or retaken) Patch in Hidamari Lane or Akane Arcade, collected at its Den. Carry 3: Fresh Catch from **Shiosai Harbour** (Sora's scent), the farthest walk. Offerings are counted, never valued; no Morsel thresholds; no size picker. |
| **Carry escort** | While carrying, Mikan cannot attack; the other three fight with AI Paw fill **100%**; dropping the food to fight is allowed (it waits at the ring edge). |
| **Goal** | The 3 Carries, then stage G (K8.8 The Lamp), then sleep. Nothing else. |
| **Combat intensity** | Never above Life 7. Enemy levels at Posse mean − 3. Ambush budget 0 on the first two street days, then 1/day. Raids at the normal cap. The **Usurper** is one optional, announced Grand Standoff (a Pretender at Boss scale), never a hunt; if ignored, raid pressure decays by itself after Carry 3. AI Paw fill 60% from the Season Turn (DR-46). |
| **Territory** | **No Doorstep deliveries all Life 8** (the pile stops). Dens with a True+ Den Sentry keep their Tribute as Fresh Catch for 5 days; other Patches store 3 days. Scent decay ×3 during the waiting nights, ×1.5 in E–F, ×1 after Carry 3. Raids may take only Patches below Strong (DR-75). No Crew absence drain. |
| **Hints** | From stage E day 1 the Stash flap stands open with a fish visible (object state). **Hint 3 (Koharu lifts a fish by the tail) on stage E day 2.** |
| **Well-Fed** | Normal on stage-A evenings; none from B until **Carry 3** (Sora restores the Feeding); every evening after. |
| **Street tone** | Morning Sniff stays indifferent and capped at 3; **gratitude is reported first** ("Buri kept the net shed."); never grim. Only Lounging Crew sit on the garden wall; posted cats appear in the Sniff. |
| **Koharu** | Pathos beats capped at **four**: K8.7 kibble, Carry 1, hint 3, stage G's third note. She sleeps through K8.4; the step vigil becomes her blanket left on the step. |
| **Day shapes** | Stage A ≈ normal days; B–D ≈ 8–15 min each; E–F ≈ 20–30 min each. Life 8 length 9–11 days. |

**DR-30 · Life 8 music and silence.** From B1 until `carry_3_bowl`, neither Haru's sung voice nor the Melody line sounds anywhere in the game, systemic or authored (title, naps, drowsiness included). Music returns in two player-cued steps: **pick-up** (bass and pads + the Brass Call cell slowed on cello) and **set-down** (per-Carry cues, SB-N2 table). Haru's Home Scent note (one sustained piano note, decaying daily, gone after the Season Turn) is the **only** sound of her instrument permitted in the span. K8.8: Sora whistles two notes (flat second), Koharu sings the third.

**DR-31 · Life 9.** One walk, not three: the ending walk (DS §10.1 beat 2) with one farewell gesture per district, systemic (4 shared poses by Verdict history + one templated line), plus a Boss-state table (Boss on wall / in Crew / heir / Humbled) owned by Narrative. Rivals' hostile intents in Life 9 are limited to one `call_out` aimed at the heir.

## E. Combat

**DR-32 · Fight-length targets (Alley, same level, whole Posse engaged).** Tough under player focus **8–12 s**; normal encounter (3–5 Toughs, or Captain + 2) **40–75 s**; Captain alone **35–55 s**; Boss **2.5–4 min**; Botan **4–6 min**. **Fed Up at 90 s** for non-Boss encounters. These replace the brief's 45–75 s Captain / 3–5 min Boss / 6–8 min Botan.

**DR-33 · Levers to hit them (all adopted; Combat owns values).** Halve every basic-attack MV (a basic hit ≈ **4–5%** of same-level Nerve; FZ, PG and Move MV unchanged). Rank Nerve multipliers **Tough ×1 · Captain ×10 · Boss ×24 · Botan ×40** (Critter ×0.5–×3). Rank damage multipliers **1.0 / 1.3 / 1.6 / 1.8**. AI posture 3.5–5.0 s. `K_dmg(L) = 0.20 × base_nerve(L) / base_other(L)` (flat hit% across levels), `K_heal` likewise at 0.10. Den Captains and Bosses levelled at `max(band top, Posse mean − 2)`. **Poise rule**: Toughs/Strays/Critters Flinch from basics at most once per 60 ticks; Captains armoured vs T1; Bosses armoured except Bap, Hiss-on-yellow, `interrupts` Moves and phase-specific Ruffle routes; all enemy windups armoured from the first tick (yellow stoppable only by Hiss/Screech/`interrupts`, red by nothing). Interrupts **spend the enemy's Paw** and put that Move on a 6 s cooldown. Heal cap 60% of max Nerve per cat per encounter; Purr single-target total 3.0 HealMV; heal bonuses capped +25%. Incoming-damage model: a normal encounter costs 15–25% of Posse Nerve; a Boss 50–80% without healing. **F-10 is replaced by an encounter Monte Carlo** (inputs: kits, stat weights, AI cadence, tokens, poise, Composure, phases) whose outputs (TTK, Frazzles per phase, Move share, AI share, Nerve cost) are acceptance criteria. *Rationale: CS-1/3/5/8/10/12; fights were 3–5× too short and stun-lockable.*

**DR-34 · Bosses must stagger.** Phase breaks **keep** the Frazzle gauge (the break adds +20). A break is **deferred while Frazzled**: damage clamps at the gate, the Frazzle and its Pile-On run to completion, up to 10% max Nerve overflow carries into the next phase. A Pile-On on a gate-clamped Frazzle **plays the phase break as its final beat** and leaves the Boss **Cornered** (Swagger off, Ruffled until the next Frazzle; exempt from Composure). Delete Edge Case 10. Acceptance: every Boss phase on Alley contains ≥ 1 Frazzle in the median run. *Rationale: CS-2 + CX-7 — the signature image becomes the punctuation of every Boss phase.*

**DR-35 · Swagger survives, smaller and visible.** Swagger (damage reduction while not Ruffled/Frazzled) = **0 / 0.20 / 0.30 / 0.30** (Tough / Captain / Boss / Botan); Kitten ×0.5. **Composure cap**: a Captain can be Ruffled at most **8 s**, a Boss/Botan **6 s**, per Frazzle cycle (resets when its Frazzle ends; shown on the HUD). Move-applied Ruffled lasts ≤ 3 s on Captain+ and diminishes within a cycle (full, half, none). Being Outnumbered obeys Composure. Damage numbers on a Swaggering target render grey with a small shield glyph. **Auto-Hiss is deleted**: an AI cat Hisses only a yellow telegraph aimed at itself; interrupting a leader is the player's act. *Rationale: CS-4, CX-8 — Ruffle becomes a burst you time, not a lock the AI maintains.*

**DR-36 · Conducting is mandatory and delightful: the Tag-In / Relay (new core rule CR-9.8).** Switching control within **20 ticks** after the controlled cat lands a T2+ hit (or right after a Hair's-Breadth) is a **Tag-In**: the incoming cat leaps ≤ 8 m to that target (invulnerable during the leap) and performs its Style's **Tag-In strike** (startup 6, MV 1.2, FZ 20, T2); both cats gain +15 Pounce points; no Paw cost. A Tag-In strike is itself T2, so it can be tagged again: each consecutive Tag-In within 3 s adds +10 FZ (relay bonus); each cat at most once per relay; a tagged-out cat cannot be tagged back for 3 s. A four-cat Relay (~2 s) is the top-skill way to crack a Captain. 5 Style animations. Mid-fight bench swapping stays **out** (canon). Plus: Paw income per Style within ±10% seconds-per-Paw when controlled; ranged basics PG ×0.7; commanded Moves inside a Frazzle window use the Pile-On leap (no pathing). *Rationale: CX-3 (CS-7's free-strike variant is folded in; its once-per-5 s limit is overruled because it would kill the relay).*

**DR-37 · The Pile-On.** Needs ≥ 2 standing Posse cats (canon). **Always Routs anything below Captain.** On Toughs, Strays and Critters a **Quick** Pile-On is offered only when **2+ enemies are Frazzled within 3 m** or the target is the **last enemy standing**; otherwise Frazzled trash just dies faster. On Captain+ the **Full** Pile-On deals per cat `MV = 2.0 + 0.6 × T_remaining_s` (early = safe, late = bigger) under the Frazzle damage cap ×2.0. Each participant's beat uses **its Style's animation and voice** (5 variants). Pile-On camera shake only on the four beats. *Rationale: CX-2, CS-6 — the cloud becomes an event, and a real timing choice.*

**DR-38 · Every Move is a Set-up or a Pay-off; no pure-damage Moves.** Set-ups create a named state (Ruffled, Pinned, Clumped, Soggy, Tangled, Splat, Backstab-armed); Pay-offs state a bonus against one. At most **one native Ruffle-applying Move per Style** plus ≤ 3 Street Moves. Move field `ai_use: auto | command_only | support`; set-up Moves are `command_only`. **Old Score** (innate): a Crew cat fighting a Rival whose Memory records a Rout between them deals ×1.25 Frazzle to it and both bark at the Standoff (replaces the Grudge-Holder Knack). *Rationale: CX-6; teaching gives interactions, not numbers.*

**DR-39 · Cat-ness: Wind-Up replaces Perch.** On the High Road passive Pounce fill stops and climbers/ranged enemies prioritise the perched cat after 2 s, but the next Pounce charges +0.4 MV and +8 FZ per second aloft (cap 3 s). A Pounce within 90 ticks of mantling deals ×0.6 and gives no PG. **Knock-offs are deterministic**: an enemy knocked off a High Road edge always Splats (Boss: Ruffled 6 s); Posse cats always Right automatically (Righting input and the AI roll are cut). Daifuku is exempt from forced descent by name. Each Boss's table names the cat verb **and the prop** that beats it. *Rationale: CX-5 — "knock the Boss off his wall into a bucket" is a trailer beat, not a coin flip.*

**DR-40 · Fears: six, each with a prop or Move source.** Water, Loud Noise, Cucumbers (ledge junk to knock off — no carry state), Dogs, Being Outnumbered, Falling (knock-offs). Nemesis selects among these six; Combat values them; unknown Fears show a **flinch tell** when their prop fires nearby, which reveals them. The Vacuum Fear and vacuum prop leave the street (the home vacuum survives as a Texture prop, DR-95). Combat values Overconfident (5 s free opening) and Dread (Ruffled 9 s). *Rationale: CX-12, CX-C5.*

**DR-41 · Ring and frame.** Normal fights use a **screen-aligned oval 12 m wide × 8 m deep**; Den rings authored. Brawl framing ≤ 14 m wide (DR-84). The camera auto-fit region excludes the HUD panel rectangles. CR-6.3 requires the controlled cat, its target and every active telegraph in frame, not every combatant. Telegraph poses are secondary; the ground decal plus an overhead glyph (≥ 3% screen height on handheld) carry the class. *Rationale: CX-4, AB-2, UX-2.*

**DR-42 · Frazzle and stall tuning.** Frazzle decay by rank: Tough 3/s, Captain 1/s, Boss 0.5/s; delay 6 s for Captain+. Fed Up 90 s. The "+100 Pounce after 15 s of no damage" gift is cut. *Rationale: CX-10/11, CS cut list.*

**DR-43 · Zoomies.** One per Style, no tiers (Zoomies II cut). Boss Zoomies are their Style Zoomies with a unique name and cut-in panel. AoE Zoomies pay the 40% per-target exchange; Zoomies prop activation triggers ≤ 1 Fear per target; Zoomies charge from damage taken capped +40 per encounter. Mikan's Life 5 Prime milestone: Zoomies fill +15%. *Rationale: CS-15, CP-14.*

**DR-44 · Status list stays closed** at Combat's 5 debuffs + 3 buffs, minus **Dirt-Eyed** (Kick Dirt applies Cowed 3 s) and **Startled** (use Flinch). Every Crew effect maps onto the survivors or is cut; Hide-down is cut. Well-Fed is not a status (DR-18). *Rationale: CX cut list, CS-C13, CP-1.5.*

**DR-45 · Combat cut list (binding).** Perch; player Righting input and AI Righting roll; Bunny-Kick hold and Bruiser Sit-hold (Whack is single-input); Dirt-Eyed; Startled; Tactic Hang Back (three Tactics remain: Shadow Me, Scrap, Mind the Others); toggles Own Zoomies and Auto-Hiss; Shoo hazards; cucumber carry; street vacuum prop; `damage_variance`; "+100 Pounce" gift; Being Outnumbered's diminishing exemption; Zoomies II; Quick Swat / Counter-Swipe refunds; the L3+R3 chord; the F-10 hand model; Combat's `scattered` outcome request (never added).

**DR-46 · AI Paw fill (canon change).** 50% in Lives 1–7; **60% from the Life 8 Season Turn**; **70% in Life 9**; **100% during a Carry escort**. Pack Cat Knack stacks additively, capped 75% outside escorts. *Rationale: Life 9's "the Crew does the fighting" becomes true; only safe once DR-33 drops autonomous AI share to ≈ 35%.*

**DR-47 · Ambush warning.** A Rival Ambush plays a **2.0 s directional yowl-sting**; the counter is Combat's **Ears Up** (Skitter or Brace in the final 0.75 s) → neutral start (no Standoff downgrade). Routed tracked Rivals in won fights are **held** (cower at the ring edge) for the Verdict. *Rationale: NX-17, NS-12, PP-32/33.*

**DR-48 · Protagonist damage share.** Mikan may slot at most **2 cross-Style Moves** (the others Scrapper or Home Moves); cross-Style Moves never gain the specialist's Style passive. When the controlled cat is Routed, control passes to the next slot clockwise, **not** to Mikan. Acceptance (sim): a fully kitted controlled Mikan deals ≤ +5% over the best controlled specialist of the same level; Crew collectively ≥ 55% of Posse damage. *Rationale: CP-5, PP-20.*

## F. Nemesis

**DR-49 · Grudge decays, and Nemesis is a slot (keeps it rare).** Grudge decays at **any** value: −2 per quiet night (Brooders −1); the arc lead is exempt only while lead. Per-encounter Grudge cap 35 for a cat's first two encounters, 20 after. **Nemesis = a slot**: at most **1 Nemesis per simulating district + the arc lead** town-wide, chosen by arc score among cats with Grudge ≥ 75; the others display and bark as **Bitter** (display cap 74). Sim target: share of seated Rivals at Grudge ≥ 75 ≤ 15%; Nemeses per Life median 1–2. *Rationale: NS-1 — the town flooded with Nemeses. (Brief wording "crossed the threshold" changes to "holds a Nemesis slot".)*

**DR-50 · Regard stays (data and behaviour); the player sees one disposition pose.** The Fence Line shows one of the six R6.3 disposition poses per cat plus the Nemesis storm mark sized by Grudge; Grudge and Regard are never numbers. Regard counts toward `NemesisArcAchieved` via a **friend arc** (3 encounters, a mark, an accepted Nose-Touch). A Rival with Regard ≥ 75 and Grudge < 25 meeting Mikan on Mikan's Patch slow-blinks and yields without a fight. *Rationale: NX-14, NS-6, NX §5.*

**DR-51 · Memory is surfaced early and on screen.** (1) The **First Thorn returns inside Life 1** (Life 1 day 2 morning; first ever 1-item Morning Sniff; waits at the post it lost; Standoff with `REMATCH_I_FLED`); its second return (the Ambush teaching Ears Up) is Life 2 day 1. (2) **Ambushing a remembered Rival** shows its best memory line **at the Rout**, over the flattened cat at the start of the Verdict (`AMBUSHED_REMATCH`). (3) A repeat Standoff whose line cites Memory is unskippable for its first 1.0 s. (4) **Scars: every player-sourced Scar is a silhouette Scar** (ear notch, folded/flat ear, kinked tail-tip, never-unpuffed tail, damp cowlick, top-of-head plaster) until the cat has two; portrait Scars come only from off-screen sources. Fantasy line becomes "That one, with the kinked tail. I gave him that." (5) **Lick In**: a tracked Rival that Routs Mikan in a fight the Posse still wins earns its Glory Title (no promotion) and `REMATCH_GOT_A_LICK_IN`; the "−5 Grudge, got my lick in" row is deleted. (6) The day after a wipe Mikan wears Haru's plaster (1 day; tag `mikan_plastered`). (7) Routine tags `evenings_home` / `nights_out` drive two triggers ("Home by dusk, every day. We noticed."). Acceptance: the first memory-tagged bark reaches **100% of slice testers before minute 60**; in an 8-cat district at 48 px a reviewer picks out the cat Mikan Scarred 8/8. *Rationale: NX-01–04, NX-15.*

**DR-52 · No scripted outcomes.** The First Thorn uses Combat's normal flee (25% threshold, interruptible yellow windup). If Routed, it gets a Verdict; whatever the player picks except Recruit or an accepted Nose-Touch, it is the guaranteed returner. *Rationale: NX-09, PP-05.*

**DR-53 · Balancing the four Verdicts (each answers "what happens to the cat" and "what happens to the post").**

| Verdict | The cat | The post | Numbers |
|---|---|---|---|
| **Chase Off** | Exiled to Away (2 slots per district); returns **changed** — 1st with escorts, 2nd promoted in the next district up (guaranteed for the arc lead), 3rd the Grand Standoff; adaptations prefer counters to the player's last opener and Verdict | Yours | Clout +2 |
| **Humble** | Stays on the Undermark crate (one resident per Patch); pays | Yours; that Patch +15% Tribute | Grudge **+10** (was +20); Restless at **80**; no Simmer while the Patch is Watched; Uprising = the resident alone vs the Sentry with home advantage; Settled after the first failed Uprising; Clout +2 |
| **Recruit** | Joins with full Memory and its signature Strength perk (DR-65) | Yours | Bribe (DR-06); Clout +2 |
| **Nose-Touch** | Respects you (accept/snub roll seeded per encounter) | **It keeps its post.** You cannot Spray that Patch during the 5-day truce; afterwards, at the next Standoff, Regard ≥ 75 → it yields with a nose (no fight), otherwise a normal fight that adds no Grudge | Clout **0** |

**One full Verdict per fight** (the highest-ranked Routed tracked Rival); other tracked Routed Rivals **slip away** (`SLIPPED_AWAY` Memory). Humble daily interactions (Share a Morsel, Stare Down) are cut; the Sentry is the only lever. Dismissal: Loyalty ≥ 60 = clean parting (treated as an accepted Nose-Touch: Grudge 0, Regard +10); below 60 = Chase Off rules. *Rationale: NX-05 (Nose-Touch dominant), NS-5 (uprising faucet), PP-14.*

**DR-54 · The Gloat.** ≤ 3 s, inside UX's ≤ 6 s loss beat; never the only place a loss is narrated (the Tended arrival also narrates it). Mark Over no longer requests a raid: it sprays over Mikan's nearest post (Scent −30). The victor's next line may cite the plaster ("Nice plaster, Collar."). *Rationale: NX-15.*

**DR-55 · Fate of the extras.**
- **Spats: cut** (all forms). **Hangers-on: cut** everywhere (raids and uprisings). **Clean Duels: cut** (the Nose-Touch post rule and the Grand Standoff replace them). **First Captain: cut.** **Lure** (invisible branch and Hold Firm): **cut**; Wavering comes from Loyalty alone. **Old-Timers** (ledge, gossip): **cut**. **Gossip/Chirper quirks: cut**; quirks 14 → **6** (Box-Sitter, Glutton, Roof-Walker, Night Owl, Sore Loser, Secret Collar). `scattered` outcome and Verdict-matrix row 11: **cut**. F12 salience: **cut** (pinned + most recent).
- **Kits: out of committed scope** (stretch only, under NX-11's rules: parent arc score ≥ 20, "Mum"/"the old one", ≤ 1 per Life).
- **Ageing**: Rivals grey cosmetically at time-skips; at a time-skip a cat with arc score < 20 seated for 2+ Lives retires to a **legend** record. Resolved Nemeses may retire (the poignant case).
- **Wall Watch**: full vision only (once per Rival per Life); not in the slice.
- **Usurper**: Life 8 optional Grand Standoff only (DR-29).

**DR-56 · Tracked-cat cap.** **48 seats** (8 per district: 1 Boss, 2 Captains, 5 ordered Toughs) + at most **24 off-wall** (Away 2 per district = 12; Undermark soft cap 2 per district = 12) = **72 live tracked cats excluding Crew**, plus Crew ≤ 16. Overflow → the oldest without player marks goes **Over the Hill** to a legend record (name, coat, one Memory line, ≈ 64 B). Memory capacity **10** entries; **pinned ≤ 6** (FIRST_MEETING, latest encounter, one per displayed Scar/Title); repeated events collapse into counters. Only unlocked districts simulate. Save target ≤ 256 KB in compact binary. Under the MVG (DR-99) the seat count is 32.

**DR-57 · Morning noise.** Morning Sniff = the Tribute line + the raid forecast line (always, when a raid is coming) + **≤ 3 nemesis items**, admitted only for cats with arc score ≥ 20 or anything touching the player's Patches or Crew. Fence Line overnight hops ≤ 3 town-wide under the same filter; strangers' rank changes show on the wall only. Gossip shares the 3 slots. **Unlock ladder** (by first occurrence): Life 1 = Standoff, Verdict, First Thorn, 1-item Sniff → Life 2 days 1–2 = Fence Line, Ambush, 3-item Sniff → first Humble = Restless warnings → cat flap = Night Rivals, first raid (scripted from the arc lead) → Life 3 = exiles moving uphill → first ex-Rival with 3+ days in the Crew = Wavering/Turncoat → Life 4 = Holdouts and Pretenders. *Rationale: NX-06/07.*

**DR-58 · Stewing never turns a friend.** Exclude Nodding Cats, cats under truce, Crew and cats with Regard ≥ 50 from Stewing; if none is eligible, spawn a fresh Braggart/Brooder as Keeper of the next Patch the player is likely to take, with a feud against one of the player's Nodding Cats. Escalation runs from Life 2 day 2. *Rationale: NX-10, NS-6.*

**DR-59 · Barks.** Slice: **20 triggers** (6 memory-citing Standoff triggers, 5 Gloats, 5 Verdict reactions, `AMBUSHED_REMATCH`, `LICK_IN`, `WAVERING`, `CALL_HEARD`), per-temperament floors only for the 8 most-heard Standoff/After triggers, `any` floors elsewhere → **≤ 300 lines**. Full game **≤ 1,100**. Fight-group barks are **icon-only**. Town-wide no-repeat for `STANDOFF_FIRST` (retired 20 in-game days after use). Formal tag grammar (EBNF, operators, scope prefixes, slot-binding rules) with a lint tool as an acceptance criterion. Write the slice's examples on the **Verdict prompt** first. Narrative "rule 13" (no Rival mentions the household) applies to **Life 8 only**; in Lives 1–7 Rivals may reference the collar, bell, bowl, cushion and the Call (never labelled as a human), never a named human or human event. *Rationale: NX-12, NS-11, NX-C5.*

**DR-60 · Botan.** At her Verdict the inn's hand-bell rings (a human summons — no singing) and her ears turn. Only **Humble** or **Nose-Touch** are offered: she is called home either way. She is never recruitable and never Chased Off. Narrative stages both. *Rationale: PP-28; the "Collar" hypocrisy pays off — she is a pet who goes home, like Mikan.*

**DR-61 · The cheaper off-screen model.** Off-screen duels (F6/F7) are **replaced by director wall events**: one per simulating district every 2–3 nights, drawn from a weighted list (promotion, feud scuffle, return, Restless, vacancy refill), each guaranteed visible on the wall and, if it passes DR-57's filter, in the Sniff. Toughs are ordered on the wall (positions 1–5). Away overflow per DR-56. Step 2 of the Nemesis tick shrinks to ≈ 6 sub-steps. Nemesis's Monte Carlo becomes a CI gate including a **pacifist** policy. *Rationale: NS cut list; the sim showed duels contributed < 0.25 changes/night anyway.*

**DR-62 · Comes Knocking.** A Nodding Cat with Regard ≥ 75 may come to the Lot to join, at most once per Life (Nemesis decides when).

**DR-63 · Raids.** Nemesis requests (≤ 1 per district, ≤ 2 town-wide per night, same in Life 8); Territory resolves (admissibility, odds). Motive enum = Nemesis's (`boss_orders, grudge, gloat, uprising, pretender, comeback`); Territory gives each a `motive_mod`; `squat` is a Territory outcome. *Rationale: TE-X6/X7 over NS-C9.*

**DR-64 · Legal.** No public showing of the nemesis system before the IP review in Escalation E-6.

## G. Crew

**DR-65 · Why want this cat: signature perk and signature Move.** A recruited Rival's Nemesis **Strength becomes its signature perk** — always on, never teachable, never forgettable (its Fear stays as a liability). Every generated Rival carries one Street Move flagged **signature**, teachable **only by that cat**, only while it is Steady+; betrayal or departure takes the source away (the only way a Move can be lost). Temperament nudges stats (DR-09). **Strays carry no Strength and no signature.** Friend Strays: **6** (one per district). *Rationale: CP-4, CP-9 — the premium catch is an ex-Nemesis.*

**DR-66 · Final Move count.** Full vision: **40 Style Moves (8 per Style) + 4 Home Moves**, **16 Knacks**, 5 Style Zoomies. MVG: 30 + 4, 12 Knacks. Vertical slice: **16 Moves** across Scrapper, Bruiser, Yowler (Combat's 12 starters for those Styles + 4 Crew-derived), 8 Knacks. Prototype: Combat's MVP 8. Crew's 14-Move cut list (CP-10) and its Knack cuts (Night Eyes, Lone Tom, Big Lungs, Butterfingers) are adopted; Combat trims each Style to 8.

**DR-67 · Teaching routes: three survive — Instinct, Watching, Lessons.** Elders and Keepsakes are **cut** (their Moves go to the Street pool carried by Captains, or are cut). Watching: pips accrue regardless of Rank (learnable at Rank level); Boss fights grant up to 4 pips per Move; Rank IV threshold 6 (Mikan 3); "2 pips if hit" becomes "2 pips if the watcher Braced, Skittered or Hair's-Breadthed it". Pending list, refresher multiplier and last-copy rules are cut: earned Moves go to a per-cat **Can learn** list (free swap at the Lot). Lessons: Mikan teaches 3 per day, others 1. Mikan re-slots at the Lot, a Sunspot or home (pictogram-only at home). *Rationale: CP-6/7/17.*

**DR-68 · Home Moves** (Biscuits, Bell Ringer, Come Running, Crib Guard) are kept, Bond-gated.

**DR-69 · XP pacing.** Include Turf XP in the daily figure; `FPL_CAP` 26; AC-7 corrected to "Lv 18 within 75 TE"; acceptance: Posse level at each Boss = band top ± 2.

**DR-70 · Full Crew behaviour.** The Standoff name-card shows a Crew-count stamp ("16/16") when the Crew is full and the Rival is recruitable. At the Verdict, **"Recruit — make room"** opens a short list of Lounging cats; releasing one follows the dismissal rule (DR-53). No gate crate, no over-cap state; nobody is deleted. The dead "more than 5 levels above Mikan" and "district not yet claimed" blocks are deleted. *Rationale: CP-8 over UX-6b (the gate crate adds a state).*

**DR-71 · Tail-Up stands** (Crew's rule): away from the Lot only Lounging cats can be called in; posted cats are listed disabled ("On guard at Fish Crates. Change at the Lot."); not inside Haru's wall.

**DR-72 · Lands On Feet** (merged Knack) triggers once per **day**, not per encounter. *Rationale: per-encounter is a free revive every fight (CS-C15 over CP-1.4).*

## H. Territory and economy

**DR-73 · `rounds` is deleted**, with its wipe-forcing rule. `seen` is the only presence rule: **seen_floor 0, seen_step 0.20, grace 2 days**; a True+ Den Sentry gives +1 grace day (not a higher floor). Target: a district not marked for 3–4 days pays nothing by day 8 of neglect. *Rationale: TE-2/3 — closes the wipe-skip (194 Morsels/min) and idle (53/min) exploits and stops charging players for going home.*

**DR-74 · Life 8 softlock closed** by DR-29 (no deliveries; Den Fresh Catch held 5 days). Acceptance: with every Den Sentry Sworn, Life 8 completes.

**DR-75 · Raids that do not nag.** A raid may take only a Patch **below Strong** (Scent < 60); on a Strong Patch a Lost result becomes Scuffed (−20). A Patch in Stale Claim is retaken by **revenge**: entering it triggers a Standoff with the raid leader (no erosion, no waves). While a district's Den is Open, its held outer Patches cannot be Lost. Forecasts are **always on** (the Sniff names tonight's targets and raiders). *Rationale: TE-7, TE-X8.*

**DR-76 · Spraying means something.** Own Rub = `seen` only. Own Spray prompt appears only below Strong and sets Scent to 90 with a visible reaction. Contest verbs (Over-mark, Counter-Spray, Claim Spray) are unchanged. *Rationale: TE-8.*

**DR-77 · Minimum management surface.** (1) The **Turf Board** at the Lot: drag a portrait onto a Patch; Style roles automatic; ineligible cats greyed with the reason. (2) The Morning Sniff forecast. (3) The Doorstep pile. The **Warden is the Den's first Sentry slot** (True+). Upkeep is flat per post (`2 × district_index` Morsels/night, auto-paid; Short Rations when the Stash is empty). Prowler Sentry role: raiders arrive Ruffled in a live defence and that post's Caterwaul window is ×1.5. **Cut:** Rations dial, Treats, Specialisations (Larder, Lookout, Hangout), the Established tier, Skim, Clout points, weather effects on Tribute and Feeders, Larder/Scrounger bonus terms, Lot upgrades except Crate Stack and Cushion Pile I, Claim Bonuses that buff cut rules, the "Last 7 mornings" sparkline. Scent is wisps on the street; numbers only on the Turf Board. *Rationale: TE-6/9/10, PP §8 "cats do not budget rations".*

**DR-78 · Tribute anchors.** `bonus_sum = upgrade + humbled + full_house`, clamped +0.3; band multipliers 0.6 / 0.9 / 1.0 / 1.0. Scale `base_yield` so the **optimiser** lands at **1,200 ± 10%** per day at the end of Life 7 (reference player ≈ 15% under). Anchors end of Life 2 ≈ 60, Life 4 ≈ 300 stand.

**DR-79 · Sinks.** **Share a Morsel** at the Lot: once per day, costs `Σ level` of the Crew, +2 Loyalty to all (the designed late sink and the "feeding them in the good years is why they stay" bridge). Leftovers rot on the Doorstep while Haru sweeps (kept). Target: reference Stash 3,000–6,000 at the end of Life 7; casual spoilage ≤ 15%. Life 7 `life_min_days` 6. Rebuild §5.3 with all three docs' sinks. *Rationale: TE-4, PP-36.*

**DR-80 · Claiming and the tutorial Patch.** A district = **a Den + 4 outer Patches**; the Den opens when **3 of the 4 outer** are held, then the Boss is Routed at the Den (brief corrected). Life 1's Low Wall Corner uses a scripted short escalation: 1 Rub, 1 Counter-Spray, 1 wave, the Keeper fight. First Sentry lesson is on the first non-Home Patch in Life 2. Humble is legal when the fight's Patch will become the player's (residence created at the Claim Spray). At claim, hostile seated cats above 3 become Holdouts on the lowest perches. `patch_level` = district band midpoint.

**DR-81 · Returns and thieves.** Routing a thief returns its `loot_held` in full as field haul.

**DR-82 · Life 8 numbers owed by Territory:** Fresh Catch storage (DR-29), decay multipliers, the Season Turn elapsed-decay cap, survivors target (write it in: with good Den Sentries ≈ 12–18 of 30 Patches survive the wait, 6–10 without).

## I. Camera, art, readability, flash safety

**DR-83 · One camera system, new doc `design/gdd/camera-system.md` (owner: technical-artist; reviewers art-director, combat designer, ux-designer).** Commissioned (≤ 20 KB). States:

| State | Pitch | Vertical FOV | Framing | Numbers owned by |
|---|---|---|---|---|
| Roam | 55° | 28° | ≈ 9 m wide; yaw authored per area, no rotation | Art (lens/pitch), Level (yaw) |
| Vista | 45–55° | 28° | authored | Art |
| Standoff | 48° | 28° | push-in; name-card upper third | Combat timing |
| Brawl | 57° | 28° | **≤ 14 m wide**, auto-fit excludes HUD rectangles | Combat |
| Slow Blink | 50° | 28° | 8.5 m distance | Combat |
| Cinematic | 35–45° over the scene; 20–30° and tilt only over a full graphic panel | authored | Pile-On, Zoomies | Combat timing, Art shots |
| **Home free-play** | 0.5–0.7 m high, pitched down 10–20° | 30° | fixed yaw per room; cuts at room thresholds; input direction **latched** across a cut until the stick returns to neutral or turns > 45° | Art / Narrative |
| Home vignette | 0.1–0.4 m | authored | faces only when humans bend down | Art / Narrative |

**The wall-crossing is a feature**: every arrival the camera descends from 55° to floor height as Mikan drops off the garden wall; every departure it rises. **Cat scale 1.0× inside Haru's wall (house and garden), 1.4× everywhere else**, swapped under the wall-crossing. Brief §4 is amended accordingly.

**DR-84 · Minimum on-screen cat size.** At 720p handheld: **≥ 48 px long side-on (≥ 40 px toward camera) in Brawl**, ≥ 64 px in Roam. All silhouette tests run at 48 px, moving, 30 fps, with T2 effects on screen, on target hardware. Distinctness is enforced on readable axes: no two cats in a district share (footprint class × dominant colour × pattern macro-class); dominant pattern element ≥ 8% of dorsal area; three base meshes on one skeleton; tails 4 and ears 3 variants for gameplay meshes; head shape only in portraits. Individual recognition lives on the Standoff card and the identity ribbon; combat recognises role (rank scale, Clowder halo, storm mark).

**DR-85 · Painted environments = Method B** (camera-aligned paint-over plates projected on proxy geometry; baked per-phase SDF shadow masks; no environment shadow maps), **pending a one-area look-dev test on target hardware**. 256 px/m UV albedo and street-gameplay backdrop layers are cut; backdrops only for vistas, home windows, the Fence Line and menus. Bring the sky down (cloud-shadow cards, reflections). Brief §4 amended.

**DR-86 · Colour fixes.** Every Clowder halo and the Posse bell-gold keyline get a 1 px Paper Cream outer rim. Rust Runners → `#7A4A6A`; Wall Sitters → `#A8C878`; Thump effect colour moves off Bell-Gold (cream core + Ink star); Marmalade → `#C98A4A`. No Clowder colour within ΔE 15 of its own district palette (automated check). Telegraph classes: white; **yellow → Paper Cream dashed with a triangle glyph**; **red → Frazzle Magenta with a zigzag edge**. Incoming-hit cue: Ink/halftone edge pulse (coral is Koharu's). Collar Crimson fills carry Paper Cream text. Disabled UI ≥ 3:1.

**DR-87 · Reference closeness.** P5 "printed, not rendered" applies to characters, VFX and combat UI only; painted plates, skies and blob-shadow edges may be soft. Final confirmation on two mock frames goes to the user (E-2).

**DR-88 · Composition rule (originality).** Home key art and pillow shots never use the inside-looking-out veranda-to-garden framing with a pet in the yard; Mikan's ginger cap is in every home key frame.

**DR-89 · Flash and motion safety (overrides every feel row).** ≤ 3 flashes in any 1 s (WCAG 2.3.1 definition, any change over > 20% of the screen); ≤ 1 full-screen impact frame per 60 ticks (else downgraded to local); local impact frames ≤ 15% of the screen; **no saturated red** (linear R/(R+G+B) ≥ 0.8) changing over > 5% of the screen; full-field speed lines Ink/Paper Cream only (Clowder colour only as a static backing); every look event ≥ 2 ticks; shake = stepped offsets (one per 2 ticks, ×0.6 decay), no Hz-based shake; global hit-stop budget **12 ticks per 60**; Frazzle/Ruffled timers do not advance during global hit-stop. **The default configuration must pass a Harding-style automated analysis of captured combat video before any public footage.** Reduce Flashes, Reduce Motion (speed lines + punch-ins together) and shake/hit-stop sliders ship. "Maximum impact" means maximum *within* this envelope. Mirrored by UX in `design/accessibility-requirements.md` (commissioned, owner ux-designer).

**DR-90 · Handheld rendering rules** (adopt AB-9/10/11): look events specified in rendered frames as well as ticks; author stepped animation at 10 poses/s; gameplay cat 1,800 tris handheld / 3,000 PC; hull width computed against the current render target, dynamic resolution floored at 85%; stepped characters write zero motion vectors on hold frames; "MSAA 2× if under 1.5 ms on handheld, else SMAA 1×"; per-pass frame budget on handheld (environment 6, characters 5, VFX 4, UI 2, post 2 ms).

## J. Audio, narrative staging, accessibility

**DR-91 · Sound-bible staging proposals (SB §16 items 11–18): SB-P11–P18 adopted exactly as the narrative critic ruled.** 11 Dusk chime APPROVED (the Call answers it within one bar; the chime plays in Life 8). 12 Gran's Call = **three** spoon-taps in the Call's rhythm; she hums it **once**, flat, at K3.4. 13 Life 3 phone carries the **complete** Call; same ring asset as B1; no night ring before B1. 14 No 7→8 montage, but Stage A exists. 15 Incense-bell REJECTED → a rin struck once in every Alcove morning ritual from Life 1. 16 Botan's inverted Call on celesta APPROVED; in-fight human singer REJECTED (hand-bell at her Verdict, DR-60). 17 Sora never sings: one Life 4 Texture of a wrong whistle; his success is K4.5's first arco entry; Koharu's two-note echo at Dusk is routine in Life 7. 18 Home vacuum = Lives 2–7 Texture prop only.

**DR-92 · Call and ritual rules.** The Call sounds **one bar after the Dusk chime** (one optional repeat 2:00 into Dusk; pre-flap a final Call at the end of Dusk). **The bell's fourth beat**: Mikan's ear-turn ends in a head-shake that rings the collar bell on the downbeat after the Call; in Life 8 the bell rings into the silence. **"Haru late" rule**: whenever Haru is expected but not home, the home loop plays without the Melody; her key in the door brings it in — so music-minus-one is taught vocabulary before Life 8. The title screen never uses a sung Call. Sunspot naps quote the Foundation, never the Melody. Paw ticks avoid the rising third; Slow Blink's figure is a falling second. Sora whistles and hums, never sings. The Tap-Tap and ritual-sound table, and Home Scent sonification (one sustained note per human on their instrument, by freshness), are added. *Rationale: SB-N3–N7, N14–N16.*

**DR-93 · Combat audio follows DR-04.** T0–T5 verbatim; audio freeze bound to hit-stop scope (global tiers hold music and ambience); AI-autonomous hits one tier lower, no stab; each Pile-On beat carries that cat's voice body and Style effort; a 72-tick Quick Pile-On variant. Telegraph vocals by class (white = one chuff; yellow = two-pulse rising growl; red = three-pulse yowl + mid rumble); Hiss belongs only to the acting cat. **Eight bark intents** (sneer, gloat, fury, grudging respect, backing down, sulk, ally warning, cold) replace the generic bark meow; Nemesis maps triggers to intents. Ruffled stays a dry shaker (string tremolo would trespass on Sora's cello).

**DR-94 · Murmur safety.** Prosody-transfer crowd beds use ≥ 3 source languages per bed, none dominant; household actors perform closed-mouth from intent cards with no source speech; **no Murmur is ever exaggerated for comedy**; the panel asks "does this sound like an imitation of a real language or accent?" (two flags = re-record). No regional prosody.

**DR-95 · Deaf/HoH parity mechanism (owner UX, carriers from Art).** Comprehension parity is achieved by visual twins of every story-bearing sound, always inside canon channels: (1) **Call glyph always on**, in the **singer's colour with shape coding the voice** (sung = three smooth arcs; Gran taps = three plum dots short-short-long; Sora = thin teal arcs, top sagging; incomplete = two arcs + an empty outline; Life 8 = nothing; K8.8 = two teal arcs, a beat, one coral arc; Life 9 = three coral arcs). (2) Bell glint on the fourth beat. (3) **Dusk lamp wave** uphill with the chime; in Life 8 the Veranda Lamp stays dark. (4) Under Hearing support, **object blooms** in time with each human's line (raincoat, teal jacket, the drawing, plum cushion) — the raincoat stays unlit in Life 8. (5) Off-screen sounds at home = Mikan's ear turn + an **ear Sense Icon**; HUD sound chips never appear inside the wall. (6) Haptics on by default (the B1 phone = two-pulse rumble). (7) **Murmur Ribbons are cut**; tone Sense Icons over Mikan (sun-pom, rain-cloud, zigzag, bouncing notes) replace them, with a "More Sense Icons" setting. (8) During the wait, the Crew on the wall turn their heads toward a Caterwaul. (9) Rival sting contour glyph on the name-card. **Test target: every Keystone's Tier A fact reaches 90% of unbriefed players with audio muted.** *Rationale: SB-N12 with UX-8 (ribbons overruled as an interpretation layer on humans).*

**DR-96 · Combat onomatopoeia: manga-weight lettering that spells nothing — "claw-script".** Impact SFX are drawn as hand-lettered manga sound-effect blocks (heavy outline, perspective, speed trails, tier-sized, a fixed alphabet of ≈ 12 "sound-words" built from paw-pad and claw-stroke letterforms) that read as lettering at a glance and as no language on inspection. **Readable words are rejected**: an English "WHAM" is human language on screen (Pillar 1's consistency of screen language), baked VFX text cannot localise, and words on 48 px cats are clutter. This keeps the user's maximal manga impact and the brief's no-readable-onomatopoeia rule. Taste confirmation goes to the user with mock frames (E-3).

**DR-97 · Sanctioned exceptions (recorded in the brief, not precedent):** the ring and white dress (Tier B only), the question-mark Sense Icon (UI), the Call glyph (UI), Haru's Home Scent note in Life 8, the Call Ripple in Haru Yellow (Coral in Life 9), the Doorstep as the single licensed HUD space inside the wall, the deliberately undetermined cause of death, and the four street/home sound crossings (Dusk bleed, Brass Call, `carry_pickup`, Life 9 last walk).

**DR-98 · Home UI vetoes.** At home, pause offers only the Mikan tab (hearts, turf goal) and Options; no Fence Line, Turf or Crew tabs; no Posse editing. The Doorstep Morning Sniff is the single licensed exception, drawn as diegetic stamp cards unrolling from scent wisps. Phase dial always visible while roaming (48 px at 1080p, top-right; enlarges at phase change and in the last 60 s; Always/Contextual/Off), hidden in combat, at home and while paused. Text floor 28 px at 1080p / 18 px at 720p for every glyph-bearing element.

## K. Scope

**DR-99 · Tiers (binding).**

| Tier | Contains | Question it answers |
|---|---|---|
| **Prototype** | Grey-box arena; Mikan + 3; three Styles; Combat's MVP 8 Moves; Swipe/Whack/Hop/Skitter/Brace/Hiss; Pounce Gauge, Slow Blink, Frazzle, **Tag-In/Relay**, Pile-On, switching; one Captain and one Boss with phases; the encounter Monte Carlo and the Nemesis Monte Carlo running as CI gates | *Is conducting four cats fun for 20 minutes?* (AC: ≥ 1 Tag-In per encounter and ≥ 3 commanded Moves per encounter for 75% of testers, unprompted) |
| **Vertical slice** | Lives 1–2: Haru's House (Life 1–2 states, piano), the Lot, Hidamari Lane (5 Patches), the 16-min day, Way Home; 8 seated Rivals + the First Thorn with Memory, silhouette Scars, Titles, all four Verdicts, Gloat, Lick In; Daifuku; 6 recruitable cats (2 story, 1 Friend Stray, 3 Rivals); 3 Styles; 16 Moves; 8 Knacks; Sentries + one forecast raid; Tribute; **11 home vignettes** (7 Keystones + 3 Textures + 1 montage) + the daily-change loop; ≤ 300 bark lines; ≤ 25 min music; final art and audio for this content | *Do players care about a Rival and about Haru within two hours?* and *Is the day ≤ 30 min?* |
| **MVG — committed ship** | Nine Lives; **4 districts** (Hidamari Lane, Akane Arcade, Shiosai Harbour, Kasumi Heights; Tsukimi Hill and Kurogane Yard are stretch). Mapping: L1 tutorial · L2 Lane · L3 Arcade outer Patches · L4 claim Arcade · L5 Harbour outer · L6 claim Harbour · L7 Heights + Botan · L8 · L9. 32 seats; 30 + 4 Moves; 12 Knacks; ≈ 58 vignettes; ≤ 800 bark lines; ≤ 90 min music | Ship decision at Alpha |
| **Full vision (revised)** | Brief canon geography: **6 districts** × 5 Patches, 48 seats, 40 + 4 Moves, 16 Knacks, ≈ 58 vignettes, ≤ 1,100 bark lines, **≤ 120 min music**, ≤ 4,000 audio files | Only if the MVG is on track at Alpha |

Docs are written to the **full vision**, with district count and district-specific content as data; any content that exists only in Tsukimi Hill or Kurogane Yard is tagged `[stretch]`. Nothing in the dual story may depend on a stretch district (Carry 3 uses the Harbour).

**DR-100 · Cut from the full vision (all docs).** Narrative: Keystones 47 → **33** (DS-C6 spine), Textures 38 → **18** (Life 7 keeps 4), Waiting-up vignettes → a Routine "Late" state, Echo vignettes → prop states (keep the two Life 7 photos), **Sightings: all 12 cut**, essential-cut/montage-insert forms cut, authored Life 9 Boss farewells → systemic. Combat/Crew: Elders, Keepsakes, Zoomies II, 24 Moves and 4 Knacks. Nemesis: Spats, Clean Duels, Old-Timers, Kits (stretch), First Captain, Lure, 8 quirks, F12. Territory: `rounds`, Rations, Treats, Skim, Specialisations, Established tier, most Lot upgrades, weather economy, Clout points, Food Gifts before Life 8. Art: six body meshes → three, head axis, fine tail/ear variants, street backdrops, 256 px/m albedo. Audio: night arrangements as stem remixes, Life 9 suite → one 2:30 piece, Botan theme 4:00, vignette accents 45 → 25, Lot theme 4 → 2 levels, sting mutation states 10 → 4, translated ultrasound to two emitters, household Murmur to 6 actors, kitten/elder voice sets trimmed. UX: Command Stub after Life 1, ally Move ribbons, Frazzle numeral (→ 5 pips), whole-town Fence Line mode (→ continuous panorama zoom), Fence Line header and rank labels, Slow Blink 2%, "Crew initiative" assist.

**DR-101 · Commissioned docs (three, all consolidations, no new systems):** `design/gdd/day-loop.md` (game-designer), `design/gdd/camera-system.md` (technical-artist), `design/accessibility-requirements.md` (ux-designer; flash/motion safety, remapping, Hearing support, the DR-95 twins, difficulty assists). The art bible also splits §10–13 into `design/art/` companion files (art-director's own revision).

**DR-102 · Simulation gates.** Combat's encounter Monte Carlo, Nemesis's Night Shuffle Monte Carlo (6 policies incl. pacifist), and Territory's economy model (`sim/territory_economy_model.py`, run with all three docs' sinks) are acceptance criteria for round 2. Each owning reviser states the measured figures in its Revision Log.

---

# PART 2 — PER-DOCUMENT ACTION LISTS (binding)

Format: **Upheld** (fix as the critic proposed unless a ruling says otherwise) · **Overruled** (log as REJECTED citing the DR) · **Implement** (rulings the doc must carry, including ones no critic raised).

## 1. `design/gdd/combat-system.md` (critics CX, CS)

**Upheld:** CX-1 (as modified by DR-05), CX-2 parts 1, 2 and 4, CX-3, CX-4, CX-5, CX-6, CX-7, CX-8, CX-9, CX-10, CX-11, CX-12, CX-13; CX cut list in full. CS-1 (option R-1 a), CS-2, CS-3, CS-4, CS-5, CS-6, CS-7 (Paw-per-Style rebalance only), CS-8, CS-9, CS-10, CS-11, CS-12, CS-13 (via DR-89), CS-14, CS-15, CS-16; CS-C1 (as DR-03), CS-C2–C14, CS-C15 (Lands On Feet once per day), CS-C16 (cut), CS-C17 (DR-46), CS-C18–C24. Combat-relevant: NX-17, NS-12, PP-04, PP-09, PP-20, PP-32, PP-33, AB-T1–T42 and AB §4.2, SB-X13/X14, UX-1, UX-2.1, UX-X12/X15/X17/X18.

**Overruled:** CX-2 part 3 (the `per_paw` gradient) — superseded by DR-37's remaining-window formula. CS-7's free-strike Tag-In with a 5 s Posse-wide limit — DR-36's relay version instead. CS-C1's "Combat's weaknesses as Crew" — DR-03 sets the weakness column. CS-C10's "keep Crew's 1-Paw Lv 1 Neck Nip" naming — it becomes Scruff Nip (DR-09). UX-1's L1+R1 = Pile-On and L1+R2 = Zoomies — DR-05 (contextual North Pile-On, L1+R1 Zoomies).

**Implement:** DR-01–DR-05, DR-26 (CR-21 rewritten: second cat and Pile-On in Life 1), DR-32–DR-48, DR-60 (Botan's Verdict set as data), DR-84 (restate ranges for 0.63 m cats, ring oval), DR-89, DR-99 (prototype ACs). Emit `MoveUsed`, `TagIn`, `FoodDropped` (DR-29 escort). Add the encounter Monte Carlo spec. Carry-escort rules and Life 8/9 AI fill as data. Remove coral from the incoming-hit cue.

## 2. `design/gdd/nemesis-system.md` (critics NX, NS)

**Upheld:** NX-01–NX-10, NX-11 (as stretch-only, DR-55), NX-12 (budget per DR-59), NX-13, NX-14, NX-15, NX-16, NX-17; NX cut list except as below; NX §5 Standoff-yield idea (DR-50); NX §6 routine tags (DR-51.7); NX-C1–C8. NS-1–NS-7, NS-8 (superseded by DR-61 wall events; the ordered-Tough part stands), NS-9–NS-14, NS-16, NS-17, NS-18; NS-C1, NS-C2 (Crew owns, DR-06), NS-C5, NS-C7, NS-C10, NS-C11 (`keeper_id`), NS-C12, NS-C13, NS-C14 (`Seated`, "Cowed Down"), NS-C15; NS cut list. PP-05, PP-14, PP-21 (gate owner = Nemesis), PP-23/24 (as DR-29), PP-27, PP-28.

**Overruled:** NX-C9 (recommends "Holder") — DR-09 picks Keeper. NX cut-list "Spat option 'Wade in' only" — all Spats cut (DR-55). NX "Memory capacity 10" stands, but NS-4's "pinned ≤ 10" becomes **pinned ≤ 6** (DR-56). NS-7's 3 Away slots per district → **2** (DR-56 cap). NS-15 moot (Spats cut). NS-C3 (Crew's visible roll) — recruit is deterministic (DR-06). NS-C4 thresholds 20/40/60 — **30/60/80** (DR-07). NS-C6 (adopt Crew's +30 dismissal Grudge) — DR-53's dismissal rule. NS-C9 (Territory's intake cap governs) — Nemesis's request budget governs (DR-63). NX's "keep Hold Firm as visible event" — cut (DR-55).

**Implement:** DR-07 (reads), DR-09, DR-10 step 3, DR-29 (Reckoning numbers cite §9), DR-31, DR-47, DR-49–DR-64, DR-56 (caps, legend list, save budget), DR-57 (Sniff filter, unlock ladder), DR-93 (trigger → bark-intent map). Fears reduced to the DR-40 six. Delete "the system's one scripted outcome". Rewrite Appendix A.1–A.3 from the revised formulas and the sim. Add `wall_event` and `SLIPPED_AWAY`, `AMBUSHED_REMATCH`, `LICK_IN`, `mikan_plastered`, `RECRUIT_REFUSED` removed (no refusals). Rival ageing per DR-55.

## 3. `design/gdd/territory-management.md` (critic TE)

**Upheld:** TE-1, TE-2, TE-3, TE-4 (sheet per DR-11/DR-79; Pack Lunch dropped), TE-5, TE-6, TE-7, TE-8, TE-9, TE-10.1–10.10; TE-X2–X14; TE cut list in full; TE §5 rulings 1–5 (Life 7 emptiness is **not** the point; Offerings count-based; no food in the house before Life 8; `rounds` deleted; empty Doorstep in Life 8). PP-03, PP-11, PP-12 (bribes from Stash), PP-13 (territory chores), PP-30 (Caterwaul reach), PP-35, PP-36.

**Overruled:** TE-X1 and PP-34 (both Crew-cap curves) — DR-12's 6/7/8/10/12/14/16. TE-4's Pack Lunch — unnecessary once Bribes come from the Stash (DR-06). TE-X9's "total stays 120" — Shinies ≈ 80 (DR-11).

**Implement:** DR-10 step 2 and 4, DR-11, DR-12, DR-15 (Caterwaul reach; Roof Run cost to clock), DR-16, DR-17 (field haul, not carried Morsels), DR-29 / DR-74 / DR-82 (Life 8 numbers, citing DS §9), DR-63, DR-73, DR-75–DR-81. Re-run `sim/territory_economy_model.py` with all sinks and report.

## 4. `design/gdd/crew-and-progression.md` (critic CP)

**Upheld:** CP-1 (except the Lands On Feet frequency), CP-2, CP-3, CP-4, CP-5, CP-6, CP-7, CP-8 (make-room inline), CP-9, CP-10 (cut list adopted; target count per DR-66), CP-11, CP-12 (MEAL becomes the whole-Crew Share a Morsel +2), CP-13, CP-14, CP-15, CP-16, CP-17; CP-X1–X3, CP-X5–X15, CP-X16 (approved at DR-46 values), CP-X17; CP §5 rulings 1 (Combat owns), 3 (deterministic), 4 (Bosses recruitable from Daifuku; Botan no), 5, 6. PP-07, PP-08, PP-20, PP-26, PP-31.

**Overruled:** CP-1.4 "Lands On Feet once per encounter" — once per day (DR-72). CP-10 / CP §5.1 "50 + 4 Moves" — **40 + 4** (DR-66). CP-X4 "Combat's matchup table" — DR-03's self-resist chart replaces both. UX-6b gate crate — DR-70.

**Implement:** DR-01 (learnsets only), DR-06 (Bribe, L0 formula), DR-07, DR-08, DR-09 (delete the temperament enum; read `former_rank`), DR-26 (Life 1 story recruit as the old wall cat; second recruit before Life 1 ends), DR-46, DR-48, DR-65–DR-72. Strays: no signature. Friend Strays 6 via one-time favour (DR-16).

## 5. `design/narrative/dual-story-progression.md` (critic DS; also SB, PP)

**Upheld:** DS-C1 (extended by DR-21: Closings day-gated too), DS-C2, DS-C3, DS-C4, DS-C5 (Gifts 2 per district), DS-C6, DS-C7 (C7.3 answered by DR-29/DR-46), DS-C8, DS-C9, DS-C10 (DR-83), DS-C11, DS-C12; DS-X1–X14; DS-R1 (as DR-21–23), R2, R3, R4, R6, R7, R8 (escalated E-5 with default), R9; DS cut list in full. PP-01, PP-10, PP-16 (DR-25), PP-18, PP-23–PP-27. SB-X1–X9 narrative sides.

**Overruled:** none. Note DR-21 goes further than DS-C1: the Life still needs its turf goal, but only for the time-skip; even the Closing is day-gated.

**Implement:** **Owner of Life 8 end to end: rewrite §9 as the single Life 8 spec exactly per DR-29/DR-30** (others cite it). DR-21–DR-28, DR-31, DR-60 (stage Botan's hand-bell and both Verdicts), DR-91–DR-92 (taps, hum, rin, Haru late, last Call at A2), DR-95 (Call glyph colours — update §18.3.6 to singer colour + shape), DR-97, DR-98. Name the old wall cat (first story recruit) and give it a voice line set. K2.1 Gift = cicada shell. Life 9 Boss-state table. Cap Koharu's Life 8 beats at four.

## 6. `design/art/art-bible.md` (critic AB; also UX, SB)

**Upheld:** AB-1 (pending look-dev), AB-2, AB-3, AB-4 (P5 limited; mock frames escalated E-2), AB-5, AB-6 (camera moves to DR-83; home free-play height per DR-83, which follows DS-C10 over AB's 0.3–0.4 m level framing for free play — AB's height survives for vignettes), AB-7, AB-8, AB-9, AB-10, AB-11, AB-12–AB-15; AB-T1–T42; AB §4.3 conflicts; AB cut list. UX-7 (adopt art components over reference components), UX-X13/X14/X17. DS-X3–X6 (narrative wins on the Bowl, yellow in Life 8, shoes, entryway). SB-X14 (coral).

**Overruled:** AB-6's "cats 1.0× inside Haru's House only" — **1.0× inside the whole wall** (house and garden), swapped at the wall crossing (DR-83).

**Implement:** DR-04 (delete §11.2 and §11.7; cite Combat's table), DR-83 (cite camera doc), DR-84, DR-85, DR-86, DR-87, DR-88, DR-89, DR-90, DR-95 carriers (Call glyph shapes, bell glint, lamp wave, object blooms, tone and ear Sense Icons), DR-96 (claw-script alphabet), DR-98 (text floor). Add the piano, the second Doorstep saucer (Crew-size tracking, DS-C12), the rin, the toy piano (Life 7+), home vacuum prop. Split §10–13 into `design/art/` companions.

## 7. `design/audio/sound-bible.md` (critic SB)

**Upheld:** SB-N1 (except N1.5's "last complete Call is K7.5"), SB-N2, SB-N3, SB-N4, SB-N5, SB-N6 (except the Stage C Koharu question), SB-N7 (N7.3 approved), SB-N8, SB-N9 (the Brass Call), SB-N10, SB-N11, SB-N12 (except N12.6), SB-N13, SB-N14, SB-N15, SB-N16, SB-N17; SB-P11–P18 as ruled; SB-X1–X14; SB cut list; SB §7 rulings 1–4.

**Overruled:** SB-N1.5 — the last complete sung Call is the **ordinary Dusk of Stage A day 2** (DS-X2), unmarked; `long_summer_eve` is still deleted and K7.5 is scored as an ordinary joyful Call. SB-N6 "Stage C: Koharu sings two notes as a question" — cut under the Koharu pathos cap (DR-29); Sora's broken-off two notes behind the bedroom door at K8.4 carry the unanswered Call. SB-N12.6 Murmur Ribbons as an option — cut (DR-95.7).

**Implement:** DR-04/DR-93 (tiers), DR-30, DR-46 (no audio change), DR-91, DR-92, DR-94, DR-95 (audio side of every twin), DR-97. Music ≤ 120 min full / ≤ 25 min slice; files ≤ 4,000 / ≤ 1,400. Phases are now 4 min: retime the Dusk system and phase transitions.

## 8. `design/ux/hud.md` + `design/ux/key-screens.md` (critic UX; also CX, PP, SB)

**Upheld:** UX-1 (map as DR-05), UX-2, UX-3, UX-4 (timing per DR-26: the second cat by ≈ minute 10, not 0:40), UX-5 (as amended below), UX-6c, UX-7, UX-8, UX-9, UX-10, UX-11; UX-X1–X7, X9–X20; UX cut list. CX-C1, CX-C6 (chain by default), PP-01, PP-02, PP-06, PP-07, PP-31.

**Overruled:** UX-1's Pile-On = L1+R1 and Zoomies = L1+R2 — DR-05. UX-6a (forgetting confirm states) — moot: only signature Moves can be lost; show "Gone with [cat]" on signature Moves only (DR-67). UX-6b / UX-X8 gate crate — "Recruit — make room" (DR-70). UX-5 Recruit row "live Willingness %" — no roll: the row is the Bribe steps none/fair/feast with the resulting Loyalty tier preview (DR-06). UX-5 Turf screen "add Rations dial and upgrade panel" — those systems are cut (DR-77). UX-5 Loyalty tier names — use DR-07's tiers and ranges.

**Implement:** DR-05, DR-15 (Head Home thread prompt), DR-17 (loss beat), DR-20 (Fence Line access), DR-26 (beat sheet: three acts re-timed around the minute-10 recruit and the minute-15 Pile-On, one new verb per 60–90 s), DR-35 (Composure display, grey Swagger numbers), DR-41 (HUD keep-out rectangles requested of Combat in writing), DR-50 (one disposition pose), DR-51 (memory line at the Rout), DR-57 (Sniff ≤ 3 + Tribute + forecast), DR-70, DR-77 (Turf Board as painted terrace strips), DR-89 (mirror in the accessibility doc), DR-95, DR-98; author `design/accessibility-requirements.md` (DR-101). Verdict tells split by preview direction (Nose-Touch = ears, Recruit = eyes and lean, Chase Off/Humble = tail). Frazzle bonus as 5 pips. Then split key-screens into per-screen specs.

---

# PART 3 — PILLAR SCORECARD (my honest scores)

| Pillar | Now | After revision | Why now → what moves it |
|---|---|---|---|
| **1. Cat's-Eye Truth** | **7** | **8.5** | The narrative rulebook, cat verbs, Fears and Whisker Sense are superb; the management layer (Rations, willingness %, Clout points, pocketed fish, Murmur ribbons) was RPG convention with ears. Cuts (DR-77, DR-06, DR-95.7), food never entering the house before Life 8, and claw-script lettering fix it. |
| **2. Two Lives, One Clock** | **6** | **8.5** | The home writing is the best in the set, but Haru's life was a reward for conquest, the day ran 50 minutes, nobody owned the way home and Life 8 was four designs. Day-gating (DR-21), the day budget and Way Home (DR-13–DR-19), one Life 8 (DR-29) and Well-Fed felt in the brawl (DR-18) raise it. |
| **3. Conduct the Brawl** | **5** | **8** (must be proven by the prototype) | Fights 3–5× too short, stun-locks, Bosses that never staggered, the AI doing the conducting, the party arriving in hour two. DR-32–DR-48 fix the maths; Tag-In/Relay, Set-up/Pay-off Moves and Old Score make conducting the optimal *and* the fun line; the second cat and Pile-On arrive by minute 15. |
| **4. Rivals Remember** | **7** | **9** | The most original system, undermined by a Grudge ratchet (everyone a Nemesis), Scars the camera cannot see, a dominant Nose-Touch and memory that surfaced only at hour two. Nemesis slots, silhouette Scars, the Life 1 return, memory at the Rout, Lick In and the Verdict rebalance put it on screen in the first hour. |

**Overall: 6.3 now → 8.5 expected.** The two scores I am least sure of are Pillar 3 (no build exists) and Pillar 2's wordless legibility (needs the no-briefing playtests DS §7 defines).

---

# PART 4 — ESCALATED TO THE USER

Only decisions that are genuinely the user's. Each has a default so no reviser is blocked; revisers proceed on the default.

| # | Decision | Why it is the user's | **Default (work proceeds on this)** |
|---|---|---|---|
| **E-1** | **Scope commitment**: ship the 4-district MVG with 6 districts as stretch, or commit to all 6 now | Budget, team size and timeline are unknown (brief §11.2) | **Commit to the 4-district MVG; decide on 6 at the Alpha gate.** Docs are written to 6 with stretch tags. |
| **E-2** | **How close to the reference look**: "reference-close" (soft, near-flat) vs "print-stylised" (halftone, two-tone manga print) | Taste; it is the first impression | P5 print rules on characters, VFX and combat UI only; soft painted plates and skies. Confirm on two side-by-side mock frames before look-dev locks. |
| **E-3** | **Combat onomatopoeia** | Taste; you asked for manga-style impact | **Claw-script** (DR-96): manga-weight SFX lettering that spells nothing. Alternative if you want real words: localised readable SFX (costs Pillar 1 consistency and per-language VFX). Confirm on mock frames. |
| **E-4** | **The ending**: does Life 9 end with Mikan simply coming home, or imply Mikan's passing? | The emotional thesis of the game | **Mikan is alive in the morning**; the last sound is the bell. A second death makes Haru's look like a set-up for it and breaks "cry at Life 8, smile at Life 9". |
| **E-5** | **Content note** for the loss theme | Store/rating and audience care | Opt-in, in Options only, general wording ("themes of loss"); no in-flow prompt. |
| **E-6** | **IP review of the nemesis system** (the WB Nemesis patent flagged by Nemesis Appendix B) | Legal | Commission IP counsel before any public showing of the nemesis system; meanwhile document our differences (no death; four Verdicts; Regard; the Fence Line). |
| **E-7** | **Target handheld floor**: Switch 1-class (720p, ≈ 3.2 GB) or Switch 2-class (1080p, upscaler) | Platform and budget | **Budget for Switch 1-class 720p** until you say otherwise; every size and budget in DR-84/DR-90 assumes it. |
| **E-8** | **Cultural review** of the Alcove ritual, incense, the rin and the funeral staging; Murmur sourcing | Cultural/legal risk in a Japan-inspired setting | Hire a cultural consultant before the vertical slice's home content is final. |
| — | Still open from the brief (unchanged): engine (default Unity URP), title (default "Nine Lives of a Boss Cat"), Haru's presentation (default as canon), Mikan customisation (default fixed design), cat speech readable (default yes), night lock until the cat flap (default yes), Spray presentation (default sparkle cloud) | | |

*End of rulings. Revisers: log every upheld issue as FIXED, every overruled one as REJECTED citing the DR number, and run the sims named in DR-102.*

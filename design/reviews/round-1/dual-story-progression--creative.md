# Round 1 Critique: Dual Story Progression (creative-director)

*Target:* `design/narrative/dual-story-progression.md` (first draft, 2026-11-23)
*Reviewer:* creative-director · *Date:* 2026-11-23
*Read in full:* the whole target doc (§0–§23). *Read for cross-checking:* `design/creative-brief.md`, `design/gdd/game-pillars.md`, sound bible §3 (Leitmotif System), §4 (Music Cue Map), §5.2 and §5.5 (Dusk bleed), §9 (Silence); art bible §3.4, §4.5–§4.7 (household colours and owner-story colour script), §6.3 (house witness objects), §13 (Camera Language). Nothing in the target doc was skipped.

---

## 1. Verdict

**NEEDS REVISION**

This is the best-crafted first draft in the pass. The rulebook (§3) is the right foundation for the whole USP and should become binding on every department almost word for word. It still does not pass. Four structural faults would reach a real player:

1. The pacing model makes Haru's life a **reward for conquering districts**. That is the "two games stapled together" failure, and it needs the doc's three weakest mechanisms (the Plateau, catch-up, and authoring every Keystone in three forms) just to hold together.
2. The USP climax, the Food Carry, takes place **two metres from the front door**. The boss half of the game is not in it.
3. Whether players understand Life 8 depends on Gran's death, and Gran's death happens **off-stage inside a montage**. That is a single point of failure.
4. Scope is roughly double what the brief costed. Within that scope, the **daily home visit has no play of its own** beyond repeating rituals.

None of these needs a rewrite. All four are fixable with cuts and re-gating, and most of the fixes reduce scope.

---

## 2. What is strong (must survive revision)

- **§3.1–§3.5 as a whole.** The Witness, Cat-Sense and No-Translation laws; the channel codes; the Tier A/B/C comprehension contract; the redundancy rules (three channels, two senses, one trace, one mirror); and above all the **vocabulary-before-use table** (§3.4) and **Ritual, Repetition, Rupture** (§3.5). This is how a wordless story is engineered rather than hoped for. Keep all of it.
- **Teaching "a fast exit at night" with joy (K6.2) so that Life 8's exit (B3) carries hope.** Also the covered plate as "she is late, and will come". This is earned dread, not foreshadowing.
- **The Goodbye in A1 as the last touch, placed in the morning slot** so every player gets it and nobody is told it was the last one.
- **The verbs keep accepting input and stop being answered** (§9.4). Helplessness delivered through the controller, cat-sized.
- **The hint 3 callback** (§9.6): Koharu lifts the fish by the tail exactly as her mother did in Life 2. That is the best single idea in the doc.
- **K4.5 ends on a Nose-Touch offered to Sora.** A street verb used at home. This is the doc's best rhyme, because the player performs it rather than reads about it.
- **§11 guardrails 1–11**, especially "no guilt accounting" (§6.3) and "music is withheld, then cued by the player's hands".
- **House Memory reflections where no variant is the sad one** (§6.2). The two Life 7 photos are exactly right.
- **The Bowl's chip and the Box** as persistent player-made objects.

---

## 3. Issues

### C1. BLOCKER: Turf-gated Keystones turn the human story into a reward for conquest (§4.4, §13.2, F2)

**What is wrong.** `unlocked(k) = played(k-1) AND (T >= turf_gate(k) OR day >= day_gate(k))` combined with Rule 7 ("Haru does not marry while the player ignores the Harbour") means the player experiences this loop: take a Patch, then a home beat plays; Rout the Boss, then the wedding. Players read reward structures faster than they read stories. Within one Life they will learn that **Haru's life is a progress bar for the turf game**. That is the opposite of the user's premise ("each day of your life, a day of theirs passes"). It is also exactly the stapled structure the brief warns against. The doc's own known weak spots §23.3 (the Plateau) and §23.4 (catch-up) are symptoms of this one decision. So is the scope cost of authoring every Keystone as full, essential cut and montage insert.

**Why it matters to the player.** (a) The best turf players get the thinnest story, as essential cuts and montage inserts. (b) A slow player in Life 6 lives in a frozen pregnancy or baby household for weeks. (c) In Life 7 a player who knows the premise (most will, from the store page; see C9) can see that **beating Botan is what kills Haru**. That brings in the causal guilt §11.4 forbids.

**Fix.**
1. **Non-closing Keystones are gated by day only.** Use `day_gate(k) = 1 + (k-1) * keystone_day_interval`. Delete `turf_gate` for k < closing. The human clock runs on its own, one day per day, as the user described.
2. **A Life ends when `T = 4` AND `day_in_life >= life_min_days[life]`**, then Mikan sleeps at home. Defaults: `life_min_days` = 3, 5, 5, 5, 5, 5, 6, (Life 8 per stages), 2. A player who claims the district early gets victory-lap days: Echoes, Textures, the Fence Line reacting. The Life does not end early. This changes the wording of brief §5.4 and needs a ruling (§5, R1).
3. **Delete Rule 5's essential cut and montage insert forms entirely.** No Keystone is ever compressed. Rule 6 (the Closing cannot be missed) stays.
4. Once the day gates are primary, the Plateau only covers players who go past day 7–9. Write each Plateau as a *season*: one plausible state, plus 1–2 Routine prop drifts per extra day (laundry, weather, toys). It should not read as a frozen frame.

### C2. BLOCKER: The Food Carry leaves the boss half of the game out of the climax (§9.6, §18.4)

**What is wrong.** The canon inversion is "the food tax becomes an act of love". As written, Carry 1 picks a fish off the Doorstep pile and walks it about two metres inside. Nothing the player built as a boss (Crew, Posse, territory, the fights) takes part. The "carrying" is a Gift with a different recipient. This is the single moment where the two stories are meant to fuse, and here they only touch.

**Why it matters.** The image the game is sold on, "the most feared cat in town carrying a fish across the kitchen floor", only has weight if the player *feels* the town between the fish and the floor. Otherwise Life 8's street play is, in the doc's own words, "beside the point", and the player experiences two separate games at their emotional peak.

**Fix.**
1. **During the Season Turn the uncollected Doorstep pile is taken by crows** (one held shot of the Season Turn; see C8). When stage E begins, the Doorstep is empty. The player's wealth is gone and food has to be fetched.
2. **The three Carries escalate in distance and in what the empire costs:**
   - Carry 1 comes from **the Stash under the veranda**: Mikan's own savings, a few steps away. It is the first and smallest act.
   - Carry 2 comes from **a Patch the player still holds or retakes in Hidamari Lane or the Arcade**, collected from a Warden.
   - Carry 3 comes from **Shiosai Harbour**: Sora's place by his scent (Tier C), and the farthest walk.
3. **Carry Escort mode.** While Mikan carries food, Mikan cannot attack (an old cat with a fish in its mouth). The other three Posse cats fight, and AI Paw fill is lifted to 100% for the escort. The player conducts the brawl (Pillar 3) *around* the act of love (Pillar 2). Dropping the item to fight is allowed: it sits at the ring's edge (existing §15 rule). Rivals who have risen in Life 8 target the carrier. This is the brief's "every debt comes due" made playable, and it also sets up Life 9, where the Crew fights for an old Mikan. Combat and Territory own the numbers. Narrative owns the requirement that **the Carry crosses the town**.
4. Re-stage hint levels 2–3 for an empty Doorstep. Level 2: Mikan sits at the empty Doorstep, *fish + door*. Level 3 stays as written (Koharu modelling the Life 2 fish-by-the-tail), using a fish from the Stash, which the player then sees is reachable.

### C3. BLOCKER: Life 8's legibility rests on Gran's death, which is never played (§3.4 vocabulary, §4.7 montage 4→5, §20)

**What is wrong.** The Life 8 reading "dead, not left" depends on one idiom above all: *Haru's photo is placed beside Gran's photo*. That idiom only works if the player understood that Gran died. Gran's death happens inside the 4→5 montage, as "black sleeves at the edge of frame; a thread of incense; a photo". The teaching example in Life 1 (Grandpa's Alcove photo, "nobody is sad") deliberately strips out the emotion, so many players outside Japan will read the Alcove as decoration. The doc admits it has no fallback (§23.26).

**Beat-by-beat misreading test (the ones that fail as written):**

| Beat | Likely misreading | Probability as written | Why |
|---|---|---|---|
| Montage 4→5 (Gran gone) | "Gran moved to a care home / hospital" | High | Cane left behind, door shut: both match "moved out". Nobody is seen grieving |
| K8.4 First Morning | "Haru is in hospital" or "she left Sora" | High, and correctly so at this point | He came back with her scarf. Nothing yet says death. The §20 criterion "90% understand she is not coming back *at the end of K8.4*" is wrong: at this point a hospital reading is the correct one |
| K8.6 People in Black | "Divorce / she left" | Low **only if** Gran's death was read | The photo beside Gran's photo is the decisive cue |
| K4.2 Two Pairs of Shoes | "Brother / cousin / coworker" | Medium for coworker, low for sibling | "Gran's cushion turned to face the guest" rules out a sibling (siblings are not guests). Nothing seen at 30 cm says *romance* until K4.5 |
| K6.2 Night They Left | "Something bad happened" | Low | The grin and the overfilled Bowl at dawn carry it |
| K2.5 Envelope | Fine at Tier A | — | — |

**Fix.**
1. **Gran's death gets a played beat, and it is the rehearsal of the wake.** Replace K5.1 "The Photo on the Cushion" with **K5.1 "Black Shoes"** (morning, day 1 of Life 5). The entryway is crowded with black shoes in **the exact framing Life 8 K8.6 will reuse**. Haru, in black, lights incense at the Alcove for the first time, then sits on the step with her shoulders shaking: a Comfort beat. Then the photo is placed on the cushion. This teaches black shoes = mourning, the photo on the cushion = a death, and Haru's own grief posture, all at low stakes and three Lives early. Add the row "Black shoes crowding the entryway = someone is gone for good" to the vocabulary table, taught in Life 5 and paid off in Life 8. The montage 4→5 keeps Gran's slowing hand and loses the black sleeves (they become the Keystone).
2. **Teach the Alcove with feeling once.** In Life 1, add one Texture in which Gran lingers at the Grandpa photo and her hand goes still on Mikan's back. Not sad, but clearly *remembering*.
3. **Move the "not coming back" criterion** to the end of K8.6 (target 90%). At the end of K8.4 the target becomes "at least 90% understand something is badly wrong and Haru is absent". This is an honest staircase: worry, then dread, then knowledge.
4. **Partner read for K4.2–K4.4:** add one staged, cat-height, culture-neutral romance idiom, repeated three times across Life 4 (Rule of Three). Under the low table, Haru's yellow sock rests on Sora's teal-striped sock. It must be seen at least three times before K4.5. Pair it with Haru's Murmur rising in pitch when the teal shoes appear.
5. **The ring (K4.5) contradicts the doc's own X3** ("a ring-finger close-up that needs cultural knowledge"). Tier A survives without the ring (Gran's blessing, the embrace, the two lines of music locking). Tier B (engagement) depends on it. **Amend X3:** a near-universal human symbol may carry *Tier B* when Tier A is carried without it. Record this as a sanctioned exception. Do not cut the ring: the ring scene is good (see §7).

### C4. MAJOR: Haru is a life script, not yet a person (§7 Lives 1–2, §8.2)

**What is wrong.** Haru, as written, is defined by the milestones the premise lists: school, leaving, love, marriage, baby. Her character traits are "kind", "studious", "nervous before exams": the rescue-girl trope. Nothing in Lives 1–2 is *hers alone*. The brief's vertical-slice question ("do players care about Haru within two hours?") will fail on a likeable silhouette.

**Why it matters.** Players grieve *specifics*. *Up* works because of Ellie's adventure book and the jar of coins, not because of the miscarriage montage beat.

**Fix: give Haru two specific, cat-perceivable things that run through all nine Lives.**
1. **She is always late.** In Lives 1–2: toast in mouth, out the door, back for the forgotten bag, *a second Goodbye*. A comic Texture family, and her defining habit. It pays off as characterisation of the covered plate in Lives 4–7 and as the cruellest possible reading of Life 8 A3 ("she's late again"). It costs nothing: it reuses rituals that already exist.
2. **The upright piano is hers.** The sound bible already makes Haru's line an upright piano, and has Koharu play it in Life 9. **The house table §8.1 has no piano.** Put a real, diegetic upright in the Main Room from Life 1. Haru practises one piece, badly at 16 and well at 25. Mikan can **walk on the keys**: a home verb that makes music (the iconic cat-and-piano interaction, and the only home verb that is play rather than ritual). In Life 8 the lid is shut and the keys are dusty, and walking on the lid produces no sound. In Life 9 Koharu plays her mother's piece haltingly (sound bible §3.3). One prop, and the leitmotif becomes an object.
3. **One human want of her own that is not a milestone.** It can be shown through the piano: in Life 4 she plays to Sora; in Life 6 she plays one-handed with the baby on her arm.

### C5. MAJOR: The home visit has rituals but no daily play loop (§5, §4.5)

**What is wrong.** Over 58 days and about 116 home visits, after the authored pool runs out, the Routine layer offers Eat, Rub, Lap (hold a button), Meow, Knock and Gift. Only Knock is play. The doc rightly rejects a cutscene tax (4 s control-loss cap, playable-adjacent, no skip). It replaces that with *interactive ambience*. Most players will learn that the fastest path is wake, bowl, door, and the house becomes a corridor. Then the Life 8 rupture has fewer habits to break.

**Fix.**
1. **Make "What changed today?" the daily home game.** Each day the Routine layer changes **one** thing in the house: a prop moved, a new object, a different pair of shoes. One fresh Home Scent trail leads to it from the sleep spot. Following the trail and finding the change (sniff, Sense Icon) grants a small home reward: the day's Bond "other" slot, which replaces one of the existing 0.5 gains. Do not add a new currency. It is cheap (prop states, not vignettes), cat-true, and makes the Detective fantasy (§2) a daily verb instead of a Keystone-only one. It also trains players in exactly the skill Life 8 stage C uses.
2. **The piano keys** (C4.2) as a second purely playful verb.
3. **Gifts become a street-to-home loop.** Each district has 3–5 authored Gift objects found through Whisker Sense in town, each with a distinct household reaction. This is a reason to explore the street *for* the house.
4. **The morning is fast by default.** The morning Feeding auto-resolves when Mikan passes the Bowl. The full four-step Feeding is reserved for the evening. Morning target: under 15 s wake-to-door with no Keystone.

### C6. MAJOR: Scope is about double the brief's costing, and the minimum set is not defined (§4.1, §23.5)

**What is wrong.** 47 Keystones, each in up to three forms and evening ones in two stagings, about 38 Textures, 14 Waiting-up, 14 Echo vignettes, 7 montages, 12 Sightings, 6 Boss Farewells × verdict variants, 9 house states, about 16 human life-stage sets. The doc counts 113 vignettes. Counted in authored *forms* it is more than 170. The vertical slice needs 16 against a budget of about 10.

**Fix: cut to a ~58-vignette "Spine" that still lands.**
- **Keystones: 47 → 33.** Spine per Life:
  - L1: K1.1, K1.3, K1.4 (fold K1.2 into K1.1's tail)
  - L2: K2.1, K2.3, K2.2+K2.4 merged ("Lamp at Night" carries the first Comfort), K2.5
  - L3: K3.1, K3.2, K3.3, K3.5 (K3.4 becomes a Texture)
  - L4: K4.2, K4.3, K4.4, K4.5 (K4.1 folds into K4.2's morning)
  - L5: K5.1 (new, C3), K5.3, K5.5 (K5.2 and K5.4 become Textures)
  - L6: K6.1, K6.2, K6.3, K6.5 (K6.4 becomes a Texture)
  - L7: K7.1, K7.3, K7.5
  - L8: all 8 (protected)
  - L9: K9.1, K9.3, K9.5
- **Delete essential cuts and montage inserts** (C1).
- **Tag at least 70% of non-closing Keystones `morning`.** Every player sees mornings, so those need only one staging. Witness and Forensic dual stagings are kept only for Closings and at most one evening Keystone per Life. This also removes most of the risk in §23.6 (Forensic too subtle).
- **Textures: 38 → 18** (2 per Life).
- **Waiting-up: 14 → 0 vignettes.** It becomes a Routine "Late" state (the lamp lit, the covered bowl, one sleeping pose per Life).
- **Echoes: 14 vignettes → prop-only**, except the two Life 7 photo variants.
- **Sightings: cut** (see Cut list).
- **Life 9 Farewells: 6 authored → systemic.** Each Boss sits on their wall in one of 4 shared poses chosen by Verdict history, plus one templated line.
- **Vertical slice:** 7 Keystones (L1 ×3, L2 ×4) + 3 Textures + 1 montage = **11**. Close enough to the brief's 10.

### C7. MAJOR: Life 8 can be slept through in about two minutes, and the stall rule is real (§9.2, §9.4, §15)

**What is wrong.** Stages C and D advance "by sleeps alone", and Sleep is offered at the entryway step at any time. A player can wake, walk to the step and sleep, four times, and be through the waiting in a couple of minutes. The doc guards against prolonged helplessness but not against *skipped* grief. Separately, stage E has no exit without a Carry. With C2's escort design, the Carry becomes a visible street task, so the stall risk falls a lot.

**Fix.**
1. **In stages C–D, Sleep unlocks only from Dusk.** The day must be lived, by Wait (half a phase per hold) or on the street. This is a clock exception; add it to the §13.4 list.
2. **Keep hint 3 on day 4**, but add a fail-safe that does not perform the act: from hint 3 the Stash flap under the veranda stands open with a fish visible (an object state, not a prompt).
3. **Life 8 difficulty.** Losing Well-Fed, old-age modifiers and triple decay all arrive at once. Ask Combat for a Life 8 rule: the Crew gets +1 Loyalty tier of combat confidence (or similar). The Posse carries the old cat. This is thematic and fixes the spike flagged in §23.22.

### C8. MAJOR: The ending's images are borrowed. The game's own image is underused (§9.5 Season Turn, §10.1)

**What is wrong.** The doc names the Season Turn "the game's Hachikō image". A pet waiting at a door through the seasons *is* Hachikō, the most famous precedent there is. The marriage/baby/loss arc in a wordless life is the *Up* montage. The pillars cite both as inspirations. Quoting them at the climax makes reviewers write "it's Up with cats" or "Hachikō as a game".

**What is ours and nobody else's:** a **boss's wealth piling up uselessly against a closed door**, then carried in, one fish at a time, by the most feared cat in town, with the Crew watching from the wall. *Nine Lives* is the only game where the pet is powerful outside, and that power is the image.

**Fix.**
1. **Re-frame the Season Turn outside, using the art bible's Doorstep framing** (§13.3: "in Life 8 this framing is held on a closed door"). Mikan sits on the Doorstep *beside the Tribute pile*. Across the held shot the pile grows, crows pick at it, leaves cover it, frost comes, and Mikan's muzzle whitens. The door behind stays shut. Same duration, and it delivers C2's empty-Doorstep set-up. The image becomes "a cat on a heap of fish nobody wants", not "a dog at a station".
2. **The hero image for key art and the trailer's last beat:** Carry 3, the fish set down at Sora's foot, seen from floor height, with the Crew's silhouettes on the garden wall through the open veranda door. Brief this to Art and Marketing as the game's signature home image (the Pile-On is the signature street image).
3. **Earned or manipulative?** Mostly earned, because every Life 8 beat traces back to a ritual (guardrail 3). The manipulative pressure comes from **Koharu**. She is in B3, K8.4 (the question-shaped two notes, *and* the face-as-event), the step vigil, under the table at K8.6, the kibble spill at K8.7, Carry 1, Carry 2 and stage G. Eight child-pathos beats in about nine days will tip players into feeling worked on. **Cap Koharu's Life 8 pathos beats at four:** K8.7 kibble, Carry 1, hint 3, stage G's third note. In K8.4 she stays asleep on Sora's shoulder throughout (cut storyboard shot 8). Cut the step vigil, or make it a Forensic-only prop (her small blanket left on the step).
4. **Sora's "comes apart" at Carry 2** (cries aloud, clings, 6 s control loss) is the right size. Keep it. It is the only big emotional release in Life 8, which is why the others must be cut back.

### C9. MAJOR: Designing for a player who already knows (§9, §11, §23.19)

**What is wrong.** The doc stages Life 8 as if it were a surprise. It will not be one for most players: the premise will be in the store copy, in reviews and in the title. Players who know will (a) feel dread through Lives 5–7, which is good if designed for, and (b) in Life 7, deliberately avoid Routing Botan to "keep Haru alive". That second behaviour is a real design hazard, and C1 alone does not remove it.

**Fix.**
1. **Separate the coronation from the death by more than one day.** Stage A lasts **3 ordinary days** (`ordinary_days` = 3), not 1. The first two are plain Life 8 mornings with Haru: Goodbye, Tap-Tap, Call at Dusk, with **no Keystone in A1–A2 so nothing is marked**. The last Goodbye then falls on a day the player did not trigger. Winning no longer "kills" Haru in the player's causal model.
2. **Life 7's Plateau is the richest Texture pool in the game** (4 Textures, not 2, a protected exception to C6), so a player who lingers out of dread is rewarded with ordinary happiness, not punished with emptiness.
3. **The content note (§23.19): recommend an opt-in note in Options only**, worded generally ("themes of loss"). No in-flow prompt. Knowledge is already the default, so the cost to surprise is small.

### C10. MAJOR: The home camera is not fatal, and has already been solved elsewhere (§18.1.2, §23.1)

**What is wrong.** The doc leaves the camera to others. All three storyboards rely on cat-height shots. Art bible §13.3 has *already* specified a floor-height home camera (0.3–0.4 m, authored positions and short rails per room, free walking, faces only when a human comes down). That contradicts brief §4's "canon for art, UX, combat, level" 55° camera, which makes no exception for home.

**Ruling recommendation (see R2).** Adopt **two camera grammars, one per world**, with a signature transition:
- **Street:** 55° follow, as canon.
- **Home (inside the garden wall):** art bible §13.3, with one amendment. Free-play positions sit at **0.5–0.7 m, pitched down 10–20°**, so the floor, the Bowl, Home Scent trails and knockable ledges stay readable and navigable across seven rooms. Humans are cropped at the hip. Vignette and Keystone shots drop to 0.1–0.4 m. Cuts are triggered by room thresholds, and yaw is fixed per room (no free rotation, which is consistent with the brief).
- **The wall-crossing transition is a feature.** Every arrival, the camera *descends* from 55° to floor height as Mikan drops off the garden wall, and the world gets big. Every departure, it rises. Done about 116 times, this is the core fantasy ("boss outside, pet at home") as a camera move. It makes the two worlds feel different without words.
- **Navigation risk:** under fixed floor cameras, stick-relative movement must be camera-relative with input latching across cuts (the classic fixed-camera problem). Hand this to UX and Engineering.
- **Scale note:** art bible §13.4 sets cats at 1.4× and humans at true scale. At home, a 0.63 m cat in a 16-year-old's lap will look wrong. Ask Art for a home-scale rule: cats revert toward 1.1× inside the wall, hidden by the wall-crossing transition.

### C11. MINOR: Storyboards: specific notes (§12)

- **12.1 First Call.** A good scene. The kibble rattle before the song teaches that the Call means food, Gran's slippers shifting is a gate, and the bell as the motif's "fourth note" is lovely. Fix: shot 3 "drops to 20 cm" happens during free garden control, which contradicts C10's model. Make shot 3 the *wall-crossing descent*: the kitten is already at the veranda. Shot 6's authored two-step is fine.
- **12.2 The Small Box.** The best of the three. Batting the ring is cat-true comedy in a joyful beat (allowed by brief §9, which forbids gags next to *grief*, not joy). Gran pinning the ring is her blessing, performed. Fixes: (a) use the Nose-Touch **input and animation**, not the Verdict prompt frame or UI, at home; street UI must not enter the house. (b) Add the sock-on-sock idiom (C3.4) in shot 2 as the third repetition. (c) If the player bats the ring repeatedly, cap it at 2 bats, then Gran's foot comes down regardless, so the scene cannot become a loop.
- **12.3 First Morning.** Strong restraint. Fixes: (a) cut shot 8 (Koharu's face, the two-note question) per C8.3; Koharu stays asleep. (b) The "unanswered two notes" belong to Sora, not Koharu, per sound bible §3.5 (`unanswered`). Move them to shot 9, behind the bedroom door: two notes hummed and broken off. (c) Shot 6's receiver "still hangs": per the setup, a neighbour shut the front door overnight, so would they not also replace the receiver? Keep the receiver hanging (it is the stronger trace) and say in the setup that the neighbour only pulled the door to.
- **Missing storyboard:** none of the three shows an *ordinary* day. Add **12.4 "A Tuesday in Life 5"**: a Routine-only evening with the C5 daily-change loop and the piano. That is the scene that proves the home is worth 25 hours.

### C12. MINOR: Other

- **§3.5 The Call by Gran:** the doc says three spoon-taps; sound bible §5.5 says two. Use **three, in the Call's rhythm** (short, short, long). The doc also has Gran *humming* the Call (K3.4), while the sound bible says "Gran does not sing". Keep the hum, once only, in K3.4, as her single concession, and update the sound bible.
- **The Tended plaster** (§6.2) should be **the same sticking-plaster asset as the Scar kit** (brief §3.3). Let Rival barks cite it ("Nice plaster, Collar."). This is cat business, not human affairs, and it puts home onto the street.
- **Crew size seen at home.** From Clout rank Boss onward, Haru puts a **second saucer on the Doorstep for "Mikan's friends"**, and the number of cats on the garden wall at dusk tracks Crew size. This is cheap, links street to home, and Haru becomes a Showa-era "cat feeder", which is characterful.
- **Haru's parents (§21, §23.16):** Tier C answer. They live far away for work. They appear once, at K5.5 (one older couple's shoes placed beside Gran's photo cushion). Do not add more dead family: four deaths in one household turns quiet into grim.
- **The fresh yellow flowers at the Alcove (§8.1, Life 8):** cut them. They are a new yellow object (see conflict X4) and on the nose.
- **§3.6 question-mark icon vs X3:** accept as a canon UI exception. It is system iconography over Mikan, not a symbol in the human world.
- **§4.8 Sightings:** see Cut list.
- **§11.29 Knocking at the wake:** disable Knock targets in stages B–D. Clips of a cat batting things at a wake will define the game online. The "unanswered" point is already made by Rub and Meow.
- **§10.1 beat 8:** endorse the "alive in the morning" reading (see R5).

---

## 4. Cross-doc conflicts

| # | Conflict | Side A | Side B | Recommended resolution |
|---|---|---|---|---|
| X1 | Home camera | Brief §4: "high-angle follow camera, pitch about 55° … canon for art, UX, combat, level" | Art bible §13.3: "Camera at cat's-eye height (about 0.3–0.4 m) … on authored positions or short rails per room". Narrative §18.1.2 treats it as undecided | Ruling R2: two grammars, one per world, with the 0.5–0.7 m free-play amendment and the wall-crossing descent (C10). Brief §4 to be amended |
| X2 | The 7→8 transition | Sound bible §9.2: "Last evening of Life 7 … sleep cuts directly to night: the phone" | Narrative §9.2–9.3: stage A is an ordinary day; the phone rings the *following* night | Narrative wins, extended to 3 ordinary days (C9.1). Sound bible updates §9.2: the last complete sung Call is still Life 7's Fireworks *or* any stage-A Dusk Call. **Decide which:** recommend that stage-A days 1–2 have a normal Dusk Call, so the last Call is unmarked and ordinary. Sound bible `long_summer_eve` is re-specified as "the last stage-A Dusk" |
| X3 | The Bowl | Narrative §5.1: "a blue-and-white rice bowl … the kitten knocks it off the step and chips its rim" (K1.3) | Art bible §6.3: L1 "A chipped saucer"; L2 "A proper bowl with a fish drawn on it" | Narrative wins: saucer on day 1, the blue-and-white Bowl from K1.3, chipped by the player in the tutorial, the same Bowl through Life 9. Art bible updates its witness-object row |
| X4 | Yellow in Life 8 | Art bible §4.7: "Removed. Only two yellows remain in the house: the raincoat on its hook and Mikan's bell" | Narrative §8.1: yellow scarf on the hook, yellow blouse on the pole, slippers, fresh yellow flowers, the Haru photo "in yellow" | Merge: **Haru's left-behind objects keep their yellow; nothing new is yellow until Life 9.** Keep the raincoat, scarf, blouse, slippers and photo. Cut the fresh flowers. Art bible rule reworded |
| X5 | Haru's shoes in Life 8 | Art bible §6.3: "Haru's pair does not move … later her pair is gone from the floor and sits on the shelf" | Narrative A1: she leaves *in* her work shoes; what stays is "her slippers waiting, toes inward" | Narrative logic wins: **her shoes never come back**, and that absence is the cue. The art bible's slow beat (moved to the shelf) is good: apply it to the **slippers** in stage F, as Sora's first act of putting away |
| X6 | Entryway in Life 1 / where the Box lives | Art bible §6.3: L1 shoes "Yellow rain boots"; Haru's room L1 "Cardboard box bed for Mikan" | Narrative: school loafers; the Box below the entryway step (K1.2), then beside Gran's cushion (K1.4) | Narrative wins (the Box's journey up the step *is* K1.2 and K1.4). Rain boots can sit beside the loafers on day 1 only |
| X7 | Who sings the unanswered two notes in Life 8 | Sound bible §3.5: "The unanswered Call: the first two notes on cello … Sora at the entryway" | Narrative K8.4 shot 8: Koharu sings two notes as a question | Sora (C11, 12.3). Koharu's partial Call is kept for stage G's completing third note only |
| X8 | When music returns in Life 8 | Narrative §9.9: "The score returns when the player picks up the food … the street theme, slowed, on the home instruments" | Sound bible §9.3: on the street "district music drops to its bass alone … pads"; inside, nothing until the food is set down, then cello `unanswered`, then music-minus-one | Two steps, both cued by the player. **Pick-up** brings bass and pads plus the Swagger cell slowed on cello (the street and home kinship). **Set-down** brings music-minus-one. Both docs update to this |
| X9 | Sound bible self-conflict on the incomplete Call | SB §3.1: incomplete Call "reserved: Sora's early attempts (Life 4), and Life 8. Nowhere else" | SB §5.5 and Narrative §8.3: Koharu sings two notes in Life 7 | Allow Koharu's Life 7 two notes (a child failing, not absence). Amend SB §3.1 to "Sora L4, Koharu L7, Life 8" |
| X10 | Gran's Call | Narrative: three spoon-taps; Gran hums the Call in K3.4 | SB §5.5: two taps; "Gran does not sing" | Three taps in the Call's rhythm; one hum in K3.4 (C12) |
| X11 | Piano | SB §3.3: Haru = upright piano; Koharu plays "the upright" in Life 9 | Narrative §8.1: no piano in the house | Add a diegetic upright to the Main Room in all nine states (C4.2). Narrative and Art update |
| X12 | Vertical-slice vignette budget | Brief §10: "about 10 home vignettes" | Narrative §22.23: about 16 | 11 under the C6 Spine. No brief change needed |
| X13 | Cat scale at home | Art bible §13.4: cats 1.4×, humans true scale, "at home … the cheat is invisible" | Narrative: laps, crib bars, Koharu's lap "fits" in Life 9 | Art to specify home scale (C10). Laps are the most-seen interaction in the game, so the cheat will not be invisible there |
| X14 | Life 8 decay vs duration | Brief §5.4: triple decay "while Mikan waits" | Narrative: 3 days of waiting, plus an invented Season Turn of weeks | Keep the Season Turn as the elapsed-time device (it is necessary), re-framed outside (C8.1). Territory rules on whether it applies elapsed decay. Recommend yes, capped so no district is lost wholesale |

---

## 5. Needs director ruling

- **R1. Life-end rule.** Amend brief §5.4 so a Life ends at `T = 4 AND day_in_life >= life_min_days`, with non-closing Keystones gated by day only (C1). *My recommendation: adopt.* It is the most important change in this review: it makes "a day is a day" true and removes the reward-gate staple.
- **R2. Home camera.** Amend brief §4 to define two camera grammars, with the wall-crossing descent (C10). *Recommend: adopt.*
- **R3. Food Carry crosses the town, with Posse escort** (C2). This touches Territory and Combat boundaries. *Recommend: adopt as canon intent; owners set the numbers.*
- **R4. Stage A lasts 3 ordinary days** (C9.1), extending the doc's own departure from the brief's wording (§22.2). *Recommend: adopt.*
- **R5. The ending (brief §11.7, user decision).** Creative-director recommendation to put to the user: **Mikan is alive in the morning.** A second death (the player's own character) would make Haru's death look like a set-up for it, and it breaks "cry at Life 8, smile at Life 9". Stage beats 1–7 for that reading, not ambiguously.
- **R6. Sanctioned exceptions to Pillar 1 / X3:** the ring (Tier B only), the white dress (Tier B only), the question-mark Sense Icon (UI). Record them in the pillars doc so they do not set precedent.
- **R7. The deliberately undetermined cause of death (§21)** is approved as a knowing exception to the narrative "true answer" rule. Record it in the brief.
- **R8. The content note:** opt-in, Options-only, general wording (C9.3). User to confirm.
- **R9. Koharu's third note at Life 8's close (§23.11):** keep. It completes the Call *across two people* (Sora's two notes, then Koharu's one). In Life 9 she sings it whole and alone, so it is a stepped pay-off, not a stolen one.

---

## 6. Cut list

| Cut | Saves | Why |
|---|---|---|
| **Sightings (§4.8), all 12** | 12 street placements, life-stage street variants | Blurs the street/home separation the brief depends on. Tier C only. Not visible in the Witness frame |
| **Essential cut and montage-insert forms for every Keystone (§4.4 Rule 5)** | about 76 authored forms | Made unnecessary by C1 |
| **Witness/Forensic dual staging, except Closings and ≤1 evening Keystone per Life** | about 25 stagings | Moving Keystones to the morning slot (C6) delivers the story to night-owls without a second version |
| **Waiting-up vignettes (14)** | 14 vignettes | A Routine "Late" state does the same job |
| **Echo vignettes (14) → prop states** (keep the two Life 7 photos) | 12 vignettes | Echoes land better as discoveries than as scenes, and feed the C5 daily-change loop |
| **Keystones: 47 → 33** (Spine in C6) | 14 Keystones | Folded into Textures or neighbouring beats; nothing on the vocabulary table is lost |
| **Textures: 38 → 18** (Life 7 keeps 4, C9.2) | 20 vignettes | Routine plus the daily-change loop carries the home between beats |
| **Six authored Life 9 Boss Farewells × verdict variants** → systemic poses plus templated lines | about 20 authored beats | Same emotional function; the Fence Line made real is the image, not the dialogue |
| **Fresh yellow flowers at the Alcove (Life 8)** | 1 prop state | Breaks the colour script; on the nose |
| **Knock targets in Life 8 stages B–D** | none (removes risk) | Avoids clips that make the game look callous |
| **Koharu's step vigil, her K8.4 face shot, and her presence in B3 as an on-camera beat** | 3 beats | Child-pathos cap (C8.3) |

**Net:** about 113 vignettes (more than 170 authored forms) becomes about 58 vignettes (about 65 forms). Two props are added: the upright piano, and the second Doorstep saucer.

---

## 7. Design tests for the revision

We will know the revised doc is right if:
- In unbriefed playtests of Lives 1–2, ≥ 6 of 8 players can name **something specific Haru does** that is not a milestone ("she's always late", "she plays the piano badly").
- ≥ 80% register Gran's death **at K5.1**, not later.
- No player in a post-play interview describes the home story as "what you unlock by beating bosses".
- ≥ 70% of players describe Carry 3 as something they *did*, not watched, and can say where the fish came from.
- No playtester in Life 7 reports deliberately delaying Botan *because* they feared it would trigger Haru's death. If some do and report it as meaningful rather than resentful, record that as a finding, not a failure.

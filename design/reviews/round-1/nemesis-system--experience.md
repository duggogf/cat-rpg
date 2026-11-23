# Round 1 Critique: `design/gdd/nemesis-system.md`, player-experience angle

*Reviewer: game-designer (player experience) · Date: 2026-11-23 · Round 1*
*Read in full: every section, lines 1–1631, including Formulas F1–F18, Edge Cases, Tuning Knobs, Game Feel, Appendices A and B, Assumptions and Open Questions. Nothing skipped.*
*Also checked against: `creative-brief.md`, `game-pillars.md`, and the sections of `combat-system.md`, `territory-management.md`, `crew-and-progression.md`, `dual-story-progression.md`, `art/art-bible.md`, `audio/sound-bible.md` and `ux/key-screens.md` that touch Rivals.*
*Balance-check inputs: `assets/data/` ABSENT, `design/balance/` ABSENT, `design/registry/entities.yaml` FOUND but empty. No numeric value can be judged against a data target, so this review judges numbers only against the doc's own stated targets and the brief.*

---

## 1. Verdict

**NEEDS REVISION**

The simulation is ambitious, internally coherent and unusually honest about its weak spots. The cat-specific ideas (Verdicts, the Gloat, Regard, the collar insult, Life 8 gratitude, the Last Walk) give it an identity Mordor never had. The problem is the gap between what it simulates and what a player sees. Three of the system's main surfacing channels are cut off by other parts of the design:

- **The Standoff memory line**: the game's own 30-second loop says "hop to the High Road, Ambush", and an Ambush skips the Standoff.
- **The Scars**: Art says small Scars cannot be seen at 64 px, and the doc's headline fantasy is a bent whisker.
- **The Gloat and the Glory Titles**: players who do not wipe never see them, and the doc expects most players not to wipe.

The first personal callback also arrives at about the 2-hour mark, which is exactly the vertical slice's deadline. The core can stay. The revision has to move drama from the spreadsheet onto the screen, earlier, and cut the parts no player will ever see.

---

## 2. What is strong (must survive revision)

- **The four Verdicts as the engine (R7.2), and the tell (R7.1).** Reading a Routed cat's ears and tail before choosing is a real, cat-true skill. Mordor never had this, and it should be the system's signature moment.
- **The Gloat (R7.3).** It inverts "the orc killed you" into "the cat got one over on you" in 3 seconds. It is funny, specific and on tone. The Stalwart's Turn Away ("Good scrap. Come back when the bell means something.") is the best loss beat in any of the drafts.
- **Regard as a second axis (R6.2/R6.3).** Respect is what makes Nose-Touch, honourable Nemeses and Life 8 gratitude possible. A face-based society needs it, and it is the clearest point of distance from Mordor (Appendix B).
- **"Always a Way In" (R6.7 rule 4) and announced adaptation (rule 5).** These answer the most common Mordor complaint: "the captain became immune to everything and it was just a wall".
- **Anti-frustration architecture (R12.3, R12.4).** The level cap at Mikan + 3, Overconfident, a Rival that stops hunting at loss streak 3, mandatory warning days before betrayals and Uprisings, and the bad-news cap. These are the right instincts and must survive.
- **"Collar" as the audible track of Clout (R10.6, R13.2.7), with Botan as the hypocrisy payoff.** This is the system's best thematic idea.
- **Wall Watch (R13.2.3).** It is the one mechanic where the street physically presses against the home. Keep it.
- **The Reckoning's gratitude half and the Last Walk (R13.5, R13.6).** "You look thin, Boss. Eat something." and posts kept warm by cats you were fair to are the strongest bridge between the two halves of the game.
- **"Go on, tip the bucket. I like the rain now." (R10.8, ADAPTED).** This is the model for every bark: a rule change explained in fiction, in one line.

---

## 3. Issues

### N-XP-01 · BLOCKER · R12.2, R13.1 · The first personal callback lands at about hour 2, the slice's own deadline

**What is wrong.** Narrative sets Life 1 at 3–4 days (about 1.5–2 h at 30 min per day) and Life 2 at 6–8 days (hours 2–6). In Life 1 only the First Thorn and 2 Roamers are active. There is no Morning Sniff (UI Requirements: "From Life 2"), and the Thorn bolts in its first fight and does not return until "the first 2 days of Life 2". So for the first 1.5–2 hours, the only nemesis beat is a cat running away. The first "it remembers me" moment (`REMATCH_I_FLED`) lands at about hour 2. Kinako (Appendix A.1) reaches Nemesis only on Life 2 day 4, about hour 3.5, and only because the player lost. The slice's stated question is "do players care about a Rival … within two hours?", and the acceptance criterion is "80% can name one Rival after two hours". The design delivers its first callback at the moment it is being measured.

**Why it matters.** Mordor's hook landed early because the tutorial-area captain who killed you came back inside the first session. Here a player can finish the slice's first hour having met three cats who said one generic line each.

**Fix.**
1. The First Thorn returns **inside Life 1**, on the morning after its bolt. Its scent mark sits over Mikan's gatepost, reported as the first ever Morning Sniff item (enable a 1-item Morning Sniff from Life 1 day 2). It waits at the post it lost, and opens a Standoff with `REMATCH_I_FLED`. No Ambush, so Life 1's no-Ambush rule holds.
2. Its second return (the Ambush with the sting pre-roll, which teaches Ears Up) moves to Life 2 day 1.
3. Add an acceptance criterion: in the slice playtest, the first Memory-tagged bark (F16 `n_mem` ≥ 1) is shown to 100% of players **before minute 60**.

### N-XP-02 · BLOCKER · R8.2, R10.2, Combat CR-18 opener table · Ambush, the core 30-second loop, skips the system's main surfacing moment

**What is wrong.** Brief §5.1's 30-second loop is "spot a rival mark, hop to the High Road, Ambush". Combat's `ambush_by_player` opener replaces the Standoff with "a 1 s corner tag", and a repeat Standoff is skippable anyway. The memory line, which the doc calls "the moment … a captain you had forgotten steps out and names what you did to him" (Feel Reference), is therefore never seen by a player playing the loop the brief designed. The better the player, the less they hear Rivals remember.

**Why it matters.** This is exactly how Mordor's later hours went flat. Critics noted that as players progressed, the game "required you to interact with the uruk leaders" less and less (Tom's Guide). The drama ends up in a system the player routes around.

**Fix.**
1. When the player Ambushes a tracked Rival with any Memory of Mikan, its highest-scoring line (F16) is shown **at the Rout**, over the flattened cat at the start of the Verdict prompt, where the clock is paused and the player is looking at that cat. Add the triggers `AMBUSHED_REMATCH` (an After-group line spoken from the dust: "The roof again? You never fight on the ground, Collar.") and keep the corner tag for name and Title only.
2. A repeat Standoff whose selected line has `n_mem` ≥ 1 cannot be skipped for its first 1.0 s. Lines without memory tags stay instantly skippable.
3. Add `ambushed` counts to the tag family so the Rival comments on *how* Mikan always fights. This is the cheap version of Mordor's "you ran last time" that a top-down camera can actually deliver.

### N-XP-03 · MAJOR · R6.4, Player Fantasy · Scars the camera cannot see; the headline fantasy is unreadable

**What is wrong.** The Player Fantasy is "That cat, with the bent whisker. I gave him that." The Art bible's readability table (§13) lists "face, whiskers, small Scars, regalia" as *lost* at the 64 px combat size. Half the Scar pools are unreadable from above: bent whisker, nose plaster, nicked ear-tip, scruff tuft, chin lump, one startled eye. Art's rule ("the first Scar goes to a silhouette slot") helps, but the Nemesis pools do not respect it. A Fang finisher yields a nicked ear-tip or a scruff tuft at random.

**Why it matters.** In Mordor the burn-bag over the head and the metal jaw were legible at combat distance. That is why players remembered them. If Scars live only on the 400 px portrait, Memory is carried by the card and the balloon alone, which is the doc's own Open Question 7.

**Fix.**
1. Split every pool into **silhouette Scars** (ear notch, folded or flat ear, kinked tail-tip, never-unpuffed tail, damp cowlick, top-of-head plaster) and **portrait Scars** (whiskers, nose, chin, eye).
2. **Every player-sourced Scar is a silhouette Scar** until the cat has two of them. Portrait Scars only come from off-screen sources (duels, Sentries).
3. Rewrite the fantasy line around a silhouette Scar ("That one, with the kinked tail. I gave him that.").
4. Make a readability check part of the R6.4 acceptance: an 8-cat district, top-down at 64 px, where a reviewer can pick out the cat Mikan Scarred 8 times out of 8.

### N-XP-04 · MAJOR · R7.3, Open Question 6 · Half the system's colour depends on losing, and good players rarely lose

**What is wrong.** Promotion, the Gloat, Glory Titles, Bell-Hunter, Wall Watch and the victor's triumphant sting all require a Posse wipe. On Alley difficulty, with 45–90 s fights and Rivals capped at Mikan + 3, a competent player may wipe two or three times in 25 hours. Meanwhile **Mikan being Routed in a fight the Posse still wins**, which will happen constantly because Mikan is the controlled frontliner, *lowers* Grudge by 5 ("got my lick in") and produces only a bark flag.

**Why it matters.** Mordor's emotional engine was "that orc beat me". A player who never loses sees only the half of this system where they win: Rivals who get humiliated, sulk and come back. That half is the repetitive half (see N-XP-08).

**Fix.** Add a **Lick In** outcome. When a tracked Rival Routs Mikan in an encounter the Posse goes on to win:
- the Rival earns its temperament's Glory Title (no promotion, no level);
- it is not eligible for the `−5` Grudge row (delete that row);
- its next Standoff draws from `REMATCH_GOT_A_LICK_IN`;
- the Verdict tell shows it smug (chin up).

Titles stay the scarce resource, at one Title per encounter. Promotion stays exclusive to wipes, so the brief's loss canon holds. Players who never wipe still meet Rivals who have something on them.

### N-XP-05 · MAJOR · R7.2, R6.3, R11.2, R8.7, R13.5, R13.6 · Nose-Touch is the dominant Verdict for any player who fights clean

**What is wrong.** Here is the full ledger of an accepted Nose-Touch:
- **Gains**: Grudge to 0 and a 5-day truce. Nodding Cats never raid and tip off every raid and hunt by their Clowder. A Nodding Captain skips the Boss's Den fight, so the Boss fight is easier. Patches are kept warm in Life 8, and the cat is in the epilogue wall-companion pool.
- **Costs**: "this Rival's loot and Clout". Territory pays Nose-Touch **+4 Clout, the highest of the four Verdicts** (see Cross-doc conflicts), and late-game fight loot is about 30% of income spread across many fights. The player keeps the Patch (Assumption 5).

So the cost is near zero and the benefits compound. F10 gives 0.95 acceptance to a clean-fought Stalwart or Goofball, and R3.4 guarantees at least one of those per district.

Humble, by comparison:
- **Costs**: +20 Grudge, a daily visit chore (Open Question 3) and Uprising risk.
- **Gain**: +15% yield on one Patch (Territory §4.2).

That makes Humble the weakest choice and Nose-Touch the strongest. The result is the boring optimal play the protocol warns about: "Nose-Touch everything I can, Recruit the cats with Moves I want". Worse, it **deletes drama**. Pacifist play produces no Nemeses, so the director's Stewing (R12.2.4) has to force one, and that Stewing can land on a Nodding Cat (see N-XP-10).

**Fix.** Give each Verdict one clear answer to two questions, *what happens to the cat* and *what happens to the post*:

| Verdict | The cat | The post |
|---|---|---|
| Chase Off | Gone for now, back tougher | You take it |
| Humble | Stays, pays, simmers | You take it |
| Recruit | Joins you; costs an offering | You take it |
| **Nose-Touch** | Respects you | **It keeps its post.** A Nose-Touched Keeper stays Keeper; the player cannot Spray that Patch while the truce runs, and afterwards only by winning a Clean Duel (R8.4), where the cat yields the post with a nose |

Mercy now costs turf, which is the currency of Life goals, and the choice becomes a real trade-off with a different best answer for each cat. Also: drop Territory's Nose-Touch Clout to the same value as Chase Off (+2), or to 0 as the brief intends ("forgoes reward").

### N-XP-06 · MAJOR · R13.1 · Everything switches on at once in Life 2: a scaffolding failure

**What is wrong.** R13.1 row 2 is "Everything in R1–R12 at district scale". On Life 2 day 1 the player gets all of these together:

- Morning Sniff (5 items)
- Fence Line with an overnight animation (5 hops)
- gossip (2 items)
- raids
- Humble interactions
- Restless warnings
- Spats
- Clean Duels
- the Ambush pre-roll
- Wavering
- Lures

Flow and onboarding practice say each mechanic should be introduced alone before being combined. This is the opposite.

**Why it matters.** These are hours 2–4, when the slice is judged. A wall of icons each morning reads as a management game, which is the "system becomes a menu" failure Shadow of War was criticised for.

**Fix.** Use an unlock ladder keyed to first occurrences, not dates:

| When | What switches on |
|---|---|
| Life 1 | Standoff, Verdict, First Thorn, a 1-item Morning Sniff |
| Life 2 days 1–2 | Fence Line; the Ambush pre-roll (the Thorn); a 3-item Sniff |
| Life 2, first Humble | Restless warnings |
| Life 2, cat flap | Night Rivals; the first raid (scripted to come from the arc lead so the player knows who and why) |
| Life 3 | Spats, gossip, exiles moving uphill |
| Life 3, first ex-Rival recruit with 3 or more days in the Crew | Wavering and Turncoat |
| Life 4 | Holdouts and Pretenders |

### N-XP-07 · MAJOR · R9.2j, R11.3, R12.1 · The morning is noisy: up to 12 nemesis items before the player has moved

**What is wrong.** Each morning, after the home vignette, the player can get up to 5 Morning Sniff items, up to 5 Fence Line hops per district (each with a caption, per UX §2), and 2 gossip facts, plus Tribute. By Life 4 three districts are simulating (about 1 duel rank change per night at `p_duel` 0.35 × 3) along with Holdout refills, Lures, Clean Duel call-outs and Restless residents in two old districts. Most of those items concern cats the player has no history with.

**Why it matters.** Pillar 2 wants home to be warm, and the pillars' session arc gives 0–3 min to "warmth, curiosity". A daily ledger of strangers' rank swaps trains players to mash past the Sniff, and then they miss the two items that matter: the comeback and the Wavering warning.

**Fix.**
1. Cap the Morning Sniff at **3 items**.
2. Only cats with arc score F13 ≥ 20, or anything touching the player's Patches or Crew, may appear. Rank changes between cats with no player history are never reported; they show on the wall only.
3. Fence Line hops are capped at 3 town-wide per morning, with the same history filter.
4. Gossip shares those 3 slots rather than adding to them.

### N-XP-08 · MAJOR · R7.2, R9.3, R12.5, Appendix A.1 · The Chase Off loop is the repetitive core, and it has the shape of Mordor's weakest late game

**What is wrong.** Kinako's arc is Chase Off, return in 3 nights, Rout, Chase Off, return in 2, Rout, Chase Off, then a Grand Standoff. That is three near-identical loops of "find him, use the Fear, Pile-On, pick the same Verdict". Each return adds one Strength icon and one `RETURNED_FROM_EXILE` line. F5 brings angry exiles back in 2–3 nights, and the median target is "6–12 days from first meeting to breaking point". So a lead is fought about every 2–3 days, with the same Verdict menu each time.

**Why it matters.** "Nemesis becomes gimmicky" and "repetitive cutscenes" were Destructoid's and others' main complaints about Mordor and War. Returning without change in the *relationship* is repetition. Only the stats change.

**Fix.** Each return must change what the encounter *is*, not only the stat block:

| Return | What changes | Example |
|---|---|---|
| 1st | Comes back with escorts it recruited in exile (new cats on the card) | |
| 2nd | Comes back as a Captain of the next district up (already in R9.3, make it guaranteed for the arc lead), with a Title earned elsewhere that the player learns about from gossip | "Kinako runs the fish stall roof now" |
| 3rd | The Grand Standoff | |

The comeback adaptation should also prefer counters to the **player's last Verdict and opener**, not only to the damage type. Repeated Chase Offs give Roof-Wise if the player Ambushed, and Street-Smart if the player used props. That way the Rival is visibly answering the player's habits.

### N-XP-09 · MAJOR · R12.2.1, Combat CR-19.6 · The First Thorn's scripted flee contradicts Combat's flee rules and teaches the wrong lesson

**What is wrong.** R12.2 forces a bolt at 25% Nerve. Combat CR-19.6 says a bolt is "a yellow 60-tick windup that can be interrupted or stopped by any hit; a Frazzled, pinned or Tangled cat cannot bolt". The first fight is where the player is learning Frazzle → Pile-On. Either the script overrides Combat, so the player watches an un-stoppable escape after doing everything right, or it obeys Combat, so most players interrupt it by accident while mid-combo and the "seed" never happens. It also costs the player their **first Verdict on a cat that matters**. The tutorial Verdict then lands on an anonymous Roamer.

**Why it matters.** "Feels authored" requires the player to believe it could have gone otherwise. A forced outcome in a system whose promise is "results are earned" (Open Question 5) is how players learn not to trust the system.

**Fix.** The Thorn gets Combat's normal flee: a `flee_threshold` of 25% with the yellow windup, which can be interrupted. Most first-time players will not know to interrupt it, so most see the flee and the lesson. Those who stop it earn the Verdict. If the Thorn is Routed, the Verdict prompt still teaches. Whatever the player picks (except Recruit or an accepted Nose-Touch), the Thorn is the guaranteed returner under N-XP-01. If the player Recruits it, it becomes the first ex-Rival in the Crew with `CREW_MEMORY` lines, a different but still personal story. Delete "the system's one scripted outcome" from R12.2.

### N-XP-10 · MAJOR · R12.2.4 · Director Stewing can turn a friend hostile for no reason the player caused

**What is wrong.** Escalation takes "the highest scorer" by F13 and adds +10 Grudge per night. F13 rewards Regard (0.2 × R), escapes and recency. A Nodding Cat the player has met three times can easily top the list for a pacifist player. Five nights later the cat the player made peace with is Bitter and hunting. This breaks Player Fantasy point 4 ("always traceable to something the player did") and is invisible to the player.

**Fix.** Exclude Nodding Cats, cats under truce, Crew, and cats with Regard ≥ 50 from Stewing. If no eligible cat exists, the director spawns a fresh Braggart or Brooder as the **Keeper of the next Patch the player is likely to take**, with a prehistory feud against one of the player's Nodding Cats ("Buri went soft. I didn't."). That way the new antagonist is motivated by the player's mercy.

### N-XP-11 · MAJOR · R13.3.4–5, F17 · Kits come from the wrong parents

**What is wrong.** Retirement excludes Nemeses, the arc lead and Crew, so the cats that retire are those with the *least* history. Kits are generated for each retiree and at 25% for other Rivals with 3 or more Lives. So the typical Kit inherits 40% of a stranger's Grudge. Buri (Appendix A.3) works only because he is the rare Stalwart Captain who happened to retire. Separately, "Dad says you fight fair" is not cat-true (Pillar 1): tomcats do not raise kittens, and a kitten would know its mother.

**Fix.**
1. A Kit may only be generated from a cat with arc score ≥ 20 or a player-sourced Mark. Prefer resolved leads and Nodding Cats.
2. Retirement excludes only the *current* lead and any Nemesis with active intent `hunt`. Resolved Nemeses may retire, which is the poignant case.
3. The parent bond is "Mum", or for a tom an unrelated "the old one". Change the example bark to "The old one on the ledge says you fight fair. Show me." (49 characters).
4. Cap at 1 Kit per Life (the visibility is the point, not the count).

### N-XP-12 · MAJOR · R10.9, R10.5 · The bark budget does not cover its own floor, and late-game repetition is guaranteed

**What is wrong.** R10.9's slice target is "about 250 templates (every Standoff and After trigger × 6 temperaments × at least 2 …)". The doc's own triggers give Standoff 15 + After 10 = 25 triggers × 6 × 2 = **300**, before Fight (8), World (9) and Crew (5) triggers. R10.5 then demands an untagged floor line for **every** trigger per temperament: 47 × 6 = **282 floor lines alone**. The stated number cannot produce the stated rule. At full scale, R10.5 forbids a cat repeating a line *to the player*, but across cats the only guard is a penalty within the last 10 barks. By hour 10 (about 150 Standoffs) the player will hear the same `STANDOFF_FIRST` from different Braggarts, which is the Shadow of War "cutscenes repeat" complaint, now in text.

**Fix.**
1. Cut the slice trigger list to 20: the 6 Standoff triggers that cite memory, the 5 Gloats, the 5 Verdict reactions, `AMBUSHED_REMATCH`, `LICK_IN`, `WAVERING` and `CALL_HEARD`. Budget it as 20 × 6 × 3 = 360 lines.
2. Fight-group barks (`FEAR_HIT`, `LOW_NERVE`, `ALLY_ROUTED`) become **icon-only** (Sense-Icon-style pictograms), because a 60-character balloon over a 64 px cat in a brawl capped at "one screen-wide effect" will not be read.
3. Add a **town-wide** no-repeat rule for `STANDOFF_FIRST`: a line is retired for 20 in-game days after use by any cat.

### N-XP-13 · MAJOR · R13.5 · The Reckoning is the noisiest Life, at the moment the game must be quietest

**What is wrong.** Life 8 sets:
- Ambushes to 2 per day and raids to 4 per night;
- Grudge ×1.5 and Simmer ×2, with Settled cats Simmering again;
- the bad-news cap lifted;
- a Boss-scale Usurper fight.

Narrative's Life 8 rules ask for "bounded helplessness", "quieter and harder, not sad", and music cued by the player's hands. Pillar emotional arc: "Life 8: the game slows." The nemesis doc makes it speed up. Open Question 10 already fears this.

**Why it matters.** A grieving player ambushed twice a day by cats with 50%-boosted grudges will feel punished for grief. That is the one feeling the USP cannot survive.

**Fix.** Make the Reckoning about **what the player finds**, not what hunts them:
1. All Reckoning changes (returns, Pretenders, conceded Patches, Loyalty Tests) are resolved *during the waiting days* and presented as the state of the wall on the first morning back.
2. After that, the Ambush budget is **0 for the first 2 street days and 1 per day after**. Raids stay at the normal cap.
3. Remove K (Grudge ×1.5).
4. The Usurper is one fight, announced as a Grand Standoff (no hunt).
5. Gratitude is reported **first** in every Life 8 Morning Sniff ("Buri kept the net shed.") before any loss.

### N-XP-14 · MINOR · R6.3, R11.3 · Two meters shown as two moods is more than the player can read; show the disposition

**What is wrong.** The Fence Line shows "a mood in four steps for Grudge and four for Regard": 16 combinations per cat, on top of temperament, Fears, Strengths, feuds, intent and a Memory strip. Behaviour actually follows only R6.3's six dispositions.

**Fix.** Keep both meters in data. The Fence Line shows **one disposition pose** per cat (the six cells of R6.3), plus the Art bible's Nemesis storm mark sized by Grudge. Regard is felt through the pose (back turned, side-on, facing, slow blink).

### N-XP-15 · MINOR · R13.2, Narrative tie · The Gloat ignores the best home echo already designed

**What is wrong.** Narrative's "Routed home" arrival has a human dab Mikan and put a **sticking plaster on Mikan's ear next morning**. Nemesis Open Question 14 asks whether Mikan can be Scarred. Separately, the R7.3 table's Mark Over Gloat raises a real raid on a player Patch, stacking a third penalty on top of the day ending and the 20% Morsel loss.

**Fix.**
1. The day after a wipe, Mikan wears Haru's plaster (cosmetic, 1 day, Art/Narrative already own it). Add tag `mikan_plastered` so the victor's next line can read it: "Nice plaster, Collar. Did your human lick it better?" (52 characters; check it against Narrative's rule 13 for Lives 1–7). The home marks the cat and the street reads the mark. That is "Two Lives, One Clock" in one line, and it answers Open Question 14 without permanently Scarring the iconic design.
2. Mark Over no longer requests a raid. It sprays over Mikan's nearest post (Scent −30, Territory to confirm). The Title stays.

### N-XP-16 · MINOR · R10.8 · Bark writing notes

The voice is good overall: terse, petty, grounded in what a cat smells and sees, and under the character cap. Specific edits:

| Line | Assessment | Proposed |
|---|---|---|
| "Nice bell, Collar. Does it ring when you run?" | Strong opener; plants the bell motif | Keep |
| "I still smell like that bucket. You'll pay for it." | Second half is stock villain filler | "I still smell like that bucket. Soon, so will you." |
| "You chased me off {patch}. I walked back." | Excellent Brooder economy | Keep |
| "Go on, tip the bucket. I like the rain now." | The template for the whole system | Keep; write one per adaptation |
| "{crew}? You wear the bell's stink now? Shame on you." | "Shame on you" is flat and parental | "{crew}? You smell of bell now. Ugh." |
| "That's your human singing, Collar. Better trot." | Labels the Call, which the game never does; may conflict with Narrative rule 13 | "Hear that? Somebody's kitten is wanted." |
| "Dad says you fight fair. Show me." | Cat-false parenting (N-XP-11) | "The old one says you fight fair. Show me." |
| "Captain now. {other} is licking a bent whisker." | Good, but cites an unreadable Scar (N-XP-03) | "Captain now. {other} is nursing a kinked tail." |
| "You look thin, Boss. Eat something." | The best line in the doc | Keep; protect it in Life 8 |

Structural note: most examples are **Standoff** lines. The most-seen moment in this design is the **Verdict prompt** (every win against a Rival), and only one example (`VERDICT_REACT_NOSE_SNUB`) is written for it. The tell plus a line spoken from the dust is where players will learn each cat's voice. Write the slice's examples there first.

### N-XP-17 · MINOR · Ambush warning timing (R8.3) · Three docs, three windows, and "face the attacker" is unreadable on a fixed-yaw camera

R8.3 gives 2.0 s, and the counter is "face the attacker or reach the High Road". Combat gives a 60-tick sting with Skitter/Brace in the last 30 ticks (Ears Up). Audio gives 1.5–3 s. With a fixed-yaw top-down camera, "facing" is ambiguous. **Fix**: 2.0 s directional sting; the counter is Combat's Ears Up (Skitter or Brace) in the final 0.75 s. Nemesis adopts Combat's verb.

---

## 4. Walkthroughs

### Hours 0–3 (Life 1 at 3–4 days, early Life 2)

| Time | What the player meets | Read |
|---|---|---|
| 0:00–0:35 | Box in the rain, the house, the garden | Correctly silent |
| about 0:40 | First Patch: the Thorn's name-card, "Nice bell, Collar…", a fight, a forced bolt at 25% | One good line; the scripted bolt may feel like a robbed win (N-XP-09). **No Verdict on the cat that matters** |
| 0:45–1:45 | Two Roamers, maybe a first Verdict on one; no Morning Sniff; no Fence Line changes | **Silent.** The Thorn is gone and nothing says it is coming back (N-XP-01) |
| about 1:45–2:00 | Time-skip; the first Fence Line opens with a "while you were away" reshuffle of strangers' prehistory | **Noisy without meaning**: rank changes among cats the player has never met |
| 2:00–2:30 | Thorn's sting from the laundry poles, `REMATCH_I_FLED`. First real "it remembers" | The best beat in the opening, at the 2-hour deadline |
| 2:30–3:00 | Everything switches on: Sniff, gossip, Spats, Humble, raids (N-XP-06). The Thorn Chased Off, back in 3 nights | **Noisy**; the one personal thread is buried in a 5-item morning |

**Answer to "by which hour":** as written, a winning player first feels a personal rivalry at about **hour 2.5–4**, and only via Chase Off and return. A losing player gets it at about hour 3.5 with the Gloat and Wall Watch. With N-XP-01, -02 and -04, it moves to **about hour 1**.

### Hours 10–12 (early to mid Life 4, Tsukimi Hill frontier; Lane and Arcade claimed)

| Situation | Read |
|---|---|
| Mornings: Sniff items from three districts, Holdout refills, a Pretender appearing in the Lane, a Lure, a Clean Duel mark from a Nodding Cat, rank swaps among Lantern Eyes cats not yet met | **Noisy** (N-XP-07). The arc lead's comeback competes with strangers |
| Humbled residents in the Lane and Arcade want a Morsel visit or they simmer | **Chore**, and 2 districts behind the frontier (Open Question 3). It pulls the player backwards across the map |
| Fresh Lantern Eyes cats: new `STANDOFF_FIRST` lines, heard about 150 times by now | **Repetitive** text (N-XP-12) |
| The player Ambushes from torii and rooftops (Prowler-heavy district, Night) | **Silent**: memory lines skipped (N-XP-02) |
| The arc lead "moved uphill" waits in Lantern Eyes colours | **Strong**, provided the player can spot the silhouette Scar (N-XP-03) |
| A Wavering ex-Rival Sentry back in the Arcade | **Strong** if the warning survives the morning noise; otherwise "out of nowhere" |
| The Life 3→4 time-skip greyed some faces; first retirements | Good idea, but the retirees are strangers, so it does not land (N-XP-11) |

---

## 5. Adaptation or clone with fur?

About 60/40 adaptation. The **skeleton is Mordor**:
- a hierarchy screen;
- intel, then Fears and Strengths;
- promotion on the player's loss;
- off-screen duels;
- adaptation;
- War's betrayal;
- Mordor's crash-ins.

The **organs are cat**: Verdicts, Regard, the tell, the Gloat, scent intel, Collar, Wall Watch, generations, Life 8 gratitude. The risk is that the parts players touch hourly (hierarchy, Fears, promotion, adaptation) are the Mordor parts, and the cat parts are either rare (Wall Watch once per Rival per Life; the Gloat only on wipes) or late (generations from Life 5, the Reckoning in Life 8). N-XP-04 (Lick In), N-XP-05 (Nose-Touch costs a post) and N-XP-15 (the plaster) move the cat identity into the hourly loop. One more step toward identity is to let the **Standoff itself resolve status**, as real cats do. A Rival with Regard ≥ 75 and Grudge < 25 that meets Mikan on Mikan's Patch slow-blinks and yields with no fight. This is cheap, unique, and already implied by the Nodding Cat.

---

## 6. Does it speak to the owner story?

**Yes, on paper; rarely in play.** The system responds to these home moments:

| Rule | Home moment it reads | Frequency in play |
|---|---|---|
| R13.2.2 | Fleeing home | Rare |
| Wall Watch | Mikan at home after a loss or a run home | Once per Rival per Life |
| `CURFEW` | Leaving at Dusk | Frequent but mechanically empty |
| `CALL_HEARD` | The Call | Frequent but mechanically empty |
| `well_fed` | The evening bowl | A tag only |
| Collar | Pet status, fading with Clout | Constant (good) |
| R13.5, R13.6 | The household's arc | Life 8 and Life 9 only |

Lives 3–7 (Haru leaves, Sora's shoes, the wedding, the baby) have no street echo at all, correctly, since cats cannot know. But the street *could* read **Mikan's routine**, which is the only home data a cat can perceive. Proposal:
- The system tracks `evenings_home` versus `nights_out` (already a Narrative stat).
- A player who goes home at Dusk 5 days running gets Rivals who schedule hunts after Dusk and say so ("Home by dusk, every day. We noticed.").
- A night-owl player gets "Don't they feed you anymore?"

The street then reflects the home choice the player makes daily, which is Pillar 2's core trade, and it costs one tag and two triggers. Together with N-XP-15 (the plaster), this is enough. Do not add more.

---

## 7. Cross-doc conflicts

| # | This doc | Other doc | Resolution |
|---|---|---|---|
| C1 | R7.2: Nose-Touch "forgoes this Rival's loot and Clout" | Territory §Clout: "Verdict given: … Nose-Touch +4" (highest Verdict award) | Territory sets Nose-Touch to 0 (brief: "forgoes reward"); see N-XP-05 |
| C2 | R7.2, Assumption 6: "one resident per Patch"; Turfed Out | Territory §4.2: "0.15 per Humbled Rival living on the Patch, max 2" | One per Patch (Turfed Out is drama); Territory edits its max to 1 |
| C3 | R12.2.1: forced bolt at 25% Nerve | Combat CR-19.6: bolt is a 60-tick windup "interrupted or stopped by any hit"; Frazzled cats cannot bolt | Combat's rule wins; see N-XP-09 |
| C4 | R8.3: 2.0 s warning; counter = face the attacker or reach the High Road | Combat opener table: 60-tick sting, Ears Up = Skitter/Brace in the last 30 ticks; Audio §5.3: 1.5–3 s | 2.0 s sting, Ears Up in the final 0.75 s; see N-XP-17 |
| C5 | R10.8 `CALL_HEARD` "That's your human singing"; Wall Watch "Sleep well on your cushion?" | Narrative §Life 8 rule 13: "No Rival mocks, mentions or notices the household" | Needs ruling (§8): rule 13 applies to Life 8 only; in Lives 1–7 Rivals may reference the collar, bowl, cushion and Call but never a named human or human event |
| C6 | R13.6: one "wall companion" = highest Regard + arc score non-Crew | Narrative epilogue table: "a Nose-Touched Rival; the longest-standing Nemesis, at a little distance" | Nemesis supplies both candidates (`wall_friend`, `wall_nemesis`); Narrative stages both |
| C7 | R7.3: Gloat "is shown in 3 seconds or less … the only place a loss is narrated" | UX §4: loss beat "last under 6 s", reuses the name-card; Narrative: the Tended arrival narrates the loss at home | Gloat ≤ 3 s inside UX's ≤ 6 s loss beat; delete "the only place a loss is narrated" and add the plaster tie (N-XP-15) |
| C8 | Combat Open Question 12: "Routed cats bolt; the Verdict needs the Rival present" | R7.1: "held in place (flattened in the settling dust)" | Adopt R7.1; Combat updates its Routed animation for tracked Rivals in won fights |
| C9 | R4.2 "Keeper" | Territory `holder_id` / "Holder" | One term; recommend Territory's **Holder** for data, "Keeper" never shown to players |

---

## 8. Needs director ruling

1. **Does Nose-Touch leave the Rival its post?** (N-XP-05.) This changes claiming flow, since the Den needs 3 of 5 Patches, and is the biggest single balance lever in the system. Recommended: yes.
2. **Narrative rule 13's scope** (C5): Life 8 only, or the whole game? Recommended: Life 8 only, with the brief §5.5 rule 5 boundary everywhere.
3. **"Lick In" Titles without a wipe** (N-XP-04). This extends the brief's "the victor … gains a Title at your expense" to non-wipe outcomes. Recommended: yes, Title only, no promotion.
4. **Life 8 Reckoning intensity** (N-XP-13): front-loaded state, not ongoing hunts. This touches brief §5.4 "the empire rots" and should be ruled with the narrative director.
5. **Does Mikan wear the plaster?** (N-XP-15, Open Question 14.) This touches the fixed iconic design; it is temporary and 1 day.

---

## 9. Cut list

| Cut | Why | Saves |
|---|---|---|
| **Lure, invisible branch** (R9.6.1, Loyalty 30–59: "nothing visible") | Simulated drama no player perceives. Keep Hold Firm as a visible event, triggered when Loyalty ≥ 60 and the old Clowder has a Captain, once per Life | A roll, a Memory type, test surface |
| **First Captain** (R4.6) | The doc calls it "a thin substitute"; invisible except one cat standing to the Boss's right | A duel scoring rule |
| **Spat option "Wade in, no side"** (R8.5) | Duplicates a normal fight; three choices are enough (Watch, Back one, ignore) | Combat cap pressure (Open Question 18) |
| **Humble daily interactions** (Share a Morsel / Stare Down as a visit loop) | Chore risk (Open Question 3, anti-pillar). Replace with: Sentries suppress Simmer; **one** Share a Morsel available only while Restless, as the answer to a warning | A daily obligation across old districts |
| **Mark Over raid** (R7.3) | A third penalty on a loss; replace with a Scent spray-over (N-XP-15) | A raid motive |
| **Quirks 14 → 8** | Cut Gossip (duplicates Chirper), Shadow, Collector, Show-Off, Littermate (the bonded-pair coat rule fights R3.6's distinctness rule), Sun-Chaser (keep Night Owl for the Lantern Eyes). Keep Box-Sitter, Glutton, Roof-Walker, Night Owl, Loaf, Chirper, Sore Loser, Secret Collar | About 40% of quirk content and tests |
| **Kits beyond 1 per Life, and from parents without history** (N-XP-11) | Only meaningful when the parent mattered | Generation and F17 cases |
| **Clean Duel as a recurring loop** (R8.4) for the slice | Overlaps with the Grand Standoff; keep for full vision | Slice scope |
| **F12 salience decay** | Replace with: pinned entries + the 8 most recent. Players cannot perceive salience ranking | One formula |
| **Memory capacity 16 → 10** | Barks cite at most 2 facts; the Fence Line strip shows 5 | Save size, tests |
| **Prehistory reshuffle animation** at the first Fence Line opening (R13.3.8 for Life 2) | Strangers' rank changes are noise; show the wall static the first time | First-impression clutter |
| **Tracked population ceiling about 120 → about 70** | Away 6 → 4, Old-Timers 6 → 4, Undermark ≤ 1 per player-held Patch with an overall soft cap of 2 per district. Players can hold perhaps 12–15 cats in mind; the director should concentrate repeat appearances on a small cast, not widen it | Simulation, save size, bark volume |

Formulas: 18 is not the problem in itself. Most are cheap and invisible. The problem is that **F6, F7, F12, F14 and the Lure roll produce events the player is never shown**. Each formula should justify itself by a visible output. F12 and the Lure roll fail that test and are listed above.

---

## Sources consulted on the original system

- [Tom's Guide: Shadow of War review roundup](https://www.tomsguide.com/us/shadow-of-war-review-roundup,news-25946.html)
- [Tom's Guide: Shadow of War Is at War with Itself](https://www.tomsguide.com/us/shadow-of-war,review-4768.html)
- [TechRadar: Shadow of War's Nemesis system is at once both brilliant and frustrating](https://techradar.com/news/shadow-of-wars-nemesis-system-is-at-once-brilliant-and-yet-incredibly-frustrating)
- [TechRadar: Shadow of Mordor's nemesis system is still yet to be bested](https://www.techradar.com/gaming/skulking-in-middle-earth-shadow-of-mordor-is-superb-and-the-nemesis-system-is-still-yet-to-be-bested-by-12-years-of-action-games)
- [GamesRadar: Shadow of Mordor's Nemesis system is amazing, here's how it works](https://gamesradar.com/shadow-mordor-nemesis-system-amazing-how-works)
- [PC Gamer: Why hasn't anyone copied Shadow of Mordor's Nemesis system?](https://www.pcgamer.com/uk/why-hasnt-anyone-copied-shadow-of-mordors-nemesis-system)
- [PCGamesN: Shadow of War filler](https://www.pcgamesn.com/middle-earth-shadow-of-war/middle-earth-shadow-of-war-filler)
- [Giant Bomb: Shadow of War review](https://giantbomb.com/reviews/middle-earth-shadow-of-war-review)
- [Game Informer: the nemesis system was once more complicated](https://www.gameinformer.com/b/news/archive/2015/01/20/shadow-of-mordor-s-nemesis-system-was-once-a-bit-more-complicated.aspx)

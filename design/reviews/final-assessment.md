# Final Assessment: Vertical-Slice GDD after Iteration 3

*Author: creative-director · 2026-11-24 · Scope: the GDD set as it stands after the three permitted iterations (first draft → slice rewrite → final fix pass). Bar (REVIEW-PROTOCOL amendment): is it good enough to **start prototyping the vertical slice**? The bar is not perfection.*

*Read for this assessment: `REVIEW-PROTOCOL.md`; `creative-brief.md` v1.3 (§1–2, §5.7, §9–11, changelog); `game-pillars.md`; the three round-2 reviews; the Overview, Acceptance Criteria, Backlog and Revision Log of each of the twelve final docs (headings grepped, the rest not read); the round-2 and round-3 sim outputs. Round-1 pillar scores come from `round-1/paper-playtest.md` §13. **This file also serves as the protocol's `unresolved.md`**: §3 lists everything a fourth iteration would take up.*

---

## 1. Verdict

**Yes, start prototyping. Begin with the combat grey box this week. Build the slice's Life 2 teaching flow only after a one-row fix to `key-screens.md` §7.4 (Ruling R-A).** The set now does what the round-1 drafts did not. Every system has an owner. The numbers come from sims, not hope: the economy hits its ≈ 60 anchor; every player gets a remembered Rival by about minute 33 and ends the slice with exactly one named Nemesis; the day fits its 25-minute clock; every fight band but one edge case holds in the sim. The twelve docs mostly agree with each other, and each has testable acceptance criteria and a disciplined Backlog. What paper cannot settle is the part that decides whether the game stands out: whether conducting four cats *feels* good, and whether a wordless Haru makes players care. Both are prototype questions. The honest weaknesses are three:

- **Territory is the weakest headline feature.** It is functional and balanced, but the daily posting decision is mostly "post *someone* on the forecast Patch". Who you post moves Tribute by only about 4%.
- **Commanded Moves are a minor share of combat damage** (6–17%). The Pile-On carries the fantasy.
- **The fix pass left one live contradiction**: which day the Turf Board and Sentries are first taught.

None of these blocks a prototype. All of them are worth a fourth pass *after* the prototype has answered §4.

---

## 2. Scorecard

**Ready** = could a small team build the slice part of this from the doc without asking anyone? **Stand out** = will this make the game memorable against its genre? Scores are hard: 8 means "good, with known gaps", 9 means "rare".

### 2.1 Documents

| Document | Ready /10 | Stand out /10 | Justification |
|---|---|---|---|
| `gdd/combat-system.md` | **8** | **7** | Every round-2 blocker is fixed, bands are corrected to the sim, ACs are measurable and the safety layer is complete. The structure is borrowed from FF7R; the distinctive parts (Pile-On, personality AI, manga feel) are unproven until played. 74 KB is heavy to build from. |
| `gdd/nemesis-system.md` | **8** | **8** | Deterministic, simmed and bark-linted. No-death Verdicts, silhouette Scars and the Declaration give every player a named Nemesis. Some deadline Declarations are unearned, and Humble's cost is invisible inside 7 days. |
| `gdd/territory-management.md` | **7** | **5** | The economy is closed (anchor 60.8–65, no exploits, no spiral) and the motive counters raised the posting stakes to +45% vs random. The "who" choice is thin (habit trails best by 4%), and the doc contradicts `key-screens` on the teaching day. |
| `gdd/crew-and-progression.md` | **8** | **6** | Cleanly re-pinned to Combat. One personality model for Crew and Rivals is a strong hook. The Brooder is never seen in the Posse, and leader levels still drift (Daifuku Lv 9 here, Lv 8 elsewhere). |
| `gdd/day-loop.md` | **8** | **6** | It does its job: owns the day, the 3-reset audit, the curfew trade and the first hour. Every day fits, but L2D3 has under 0.1 min of slack at the median, and the slice sits at the top of its band (149 of 120–150 min). |
| `gdd/camera-system.md` | **8** | **5** | Tight, testable (T1–T5) and scaled to 1.25×. It is a competent FF7R-style rig; only cat-height home framing and the face rules are distinctive. One Backlog line (the shake model) is now stale. |
| `narrative/dual-story-progression.md` | **8** | **9** | The USP on paper. Day-gated, a specific Haru (late, the stuck bar, the lamp), Late Home teaching the Life 8 idiom, a home that is played rather than watched. Everything hangs on the muted Tier A 90% test. |
| `art/art-bible.md` | **7** | **7** | Clear grammar ("ink what acts, paint what stays"), a safety-compliant impact frame, global scale settled. No art-director sign-off yet, the look-dev spike (E-1–E-9) has not run, and the style sits close to a named reference. |
| `audio/sound-bible.md` | **8** | **8** | The Call and bell thread, Murmur gates, the Late Home melody idiom and a Life 8 audit, all tied to the event contract. "Can testers hum the Call?" is the right first test. |
| `ux/hud.md` | **8** | **6** | Three HUDs for three modes; the HUD falling away at the garden wall is a designed beat. The rest is sound conventional practice. |
| `ux/key-screens.md` | **6** | **7** | The Fence Line is a genuine showpiece and buildable. But its §7.4 beat sheet, which every other doc cites as the owner, now contradicts Territory and Day Loop on the Turf Board day. |
| `accessibility-requirements.md` | **8** | **5** | A complete slice floor: flash/motion, CVD twins, deaf/HoH carriers for a music-told story. Four Combat REQUESTs are unagreed. It is a floor, not a differentiator, though the deaf/HoH parity for a wordless story is unusually thoughtful. |
| **Set average** | **7.7** | **6.6** | Round-1 paper fun was 6.5 overall. |

### 2.2 Key features (the user's five)

| Feature | Ready /10 | Stand out /10 | Justification |
|---|---|---|---|
| **Cat nemesis system** | **8** | **8** | Memory callback 100% by minute 33; exactly 1 Nemesis for 100% of players; seated-Bitter share ≤ 11%. No death, Verdicts and a wall of cats make it more than a Mordor clone. Legal review is pending. |
| **Territory management** | **7** | **5** | Balanced and small (three screens, one verb). Personality guards are charming, but the decision is shallow and pre-claim raids can never cost a Patch. Today it is a good subsystem, not a reason to buy. |
| **Dual Story Progression** | **8** | **9** | The strongest idea in the project, and well protected by rules (no text, day gates, never a reward). The slice shows only its gentle opening; its emotional proof (Life 8) is outside the slice. |
| **Intensive cat combat** | **8** | **7** | Rules, numbers and the feel table are build-ready. "Intensive" lives in feel (hit-stop, shake, impact frames, Pile-On), which no doc can prove. Moves are a small damage share, so commanding risks feeling optional. |
| **Crew personality** | **7** | **7** | Personality visibly drives movement and targeting, guarding and bonds. AI Paw habits fire after about 60 s, longer than most fights, and the Brooder is unseen, so in a fight the hook reads more weakly than on paper. |

### 2.3 Pillars: round 1 (paper playtest) → now

| Pillar | Round 1 | Now | Movement |
|---|---|---|---|
| 1 · Cat's-Eye Truth | 7 | **8** | The numbers rule (R3) removed most "RPG convention with ears". Face events are bounded, and muted Tier A tests are in every doc. The list of sanctioned exceptions keeps growing; hold it. |
| 2 · Two Lives, One Clock | 6 | **8** | Day-gated home beats, a played home (daily find, piano, lap), a Head Home guarantee, Late Home and an audited ≈ 15% home share. "Do players *want* to go home?" is still untested. |
| 3 · Conduct the Brawl | 5 | **7** | Two cats and a Pile-On by minute 15, a 4-cat Posse by L2D1, Crew share 59–68%, conductor share ≈ 58% vs leaders, verb list cut. Commanded Moves are minor and AI habits rarely fire. Never prototyped. |
| 4 · Rivals Remember | 8 | **8** | Held. It gained a guaranteed Nemesis and a 100% callback, and lost a little organic emergence: some Declarations name a cat with fewer than 3 encounters, a few with none (R-B fixes the latter). |
| **Overall** | **6.5** | **7.75** | |

---

## 3. What a fourth iteration would address

### 3.1 Rulings (made here; owners apply them in the next touch of their doc, no new iteration needed)

- **R-A · Turf Board and Sentries are first taught on Life 2 day 2**, as the answer to the first forecast. Territory §3.12, Day Loop §3.9, the presentation review and the round-3 posting sim all use L2D2. Only `key-screens.md` §7.4 (row "Life 2 day 1" and the note under the table) says L2D1, and it cites Territory as its reason. Move that one cell to L2D2. Day Loop's Backlog lever (move the Board back to L2D1 if L2D2 overruns) stays as the measured fallback.
- **R-B · The Declaration is approved** as built: one slot in Lives 1–2, any Grudge, Sworn Enemy or Sworn Rival, Recruit greyed, Boss never lead. **Added condition:** a deadline Declaration requires the lead to have **≥ 1 encounter** with Mikan. The round-3 sim shows mixed players declared at 0 encounters. If the lead has none, the director places it as a crate-challenge Standoff the next day and declares after that fight. This amends brief §3.1 in the next brief revision.
- **R-C · Leader levels come from Combat's leader-level rule, never from hand-set sheet values.** Daifuku is **Lv 8 (Bribe 256)**. Crew F8 and its character sheets cite the rule; Kagi takes whatever the rule gives.
- **R-D · Togemaru's Strength is +15% Nerve.** Combat §3.9's Strength menu is canonical for effects. Nemesis's §3.9 slice list adds this entry.
- **R-E · The Pile-On is taught by the HUD hint card only.** Combat drops the lettered "Pile-On" word on its first three showings. The one-lettered-word budget stays reserved for onomatopoeia on player-authored T4/T5 hits.
- **R-F · `zoomies_per_frazzle` = 5 for the slice** (Combat B-19). This brings Zoomies back to about 1 per cat per 2 encounters.
- **R-G · The prototype ships the AI self-cast toggle on by default:** an AI cat may fire a 1-Paw `auto` Set-up when the controlled cat holds ≥ 1 Paw (Combat B-17). A/B it off. Personality reads (AC 18) outrank the half-rate purity rule for the test.
- **R-H · Build the simplified High Road first** (Combat B-15: one fixed Pounce, MV 2.5, FZ 35, 3 s re-use). Wind-Up, the perch Paw-stop and the mantle penalty come back only if the grey box asks for them.
- **R-I · Combat AC 1's Tough-in-group band reads 6–11 s.** The sim's F9 table is the expected value; the hand model is explanation only.
- **R-J · Humble stays at +8 simmer until playtest.** Verdict variety (Nemesis AC 4) is the test.
- **R-K · Stale lines void:** Camera Backlog "combat shake model" (Combat now has one summed model); Nemesis Backlog "Crew to retag Kagi" (done); Narrative Backlog "K2.5 L2D5 in Territory" (Territory §4.11 now says L2D4).

### 3.2 Open items (what a fourth iteration would take up)

| # | Item | Now /10 | What needs to improve | Base idea for improving it |
|---|---|---|---|---|
| 1 | **Territory posting is a "where" decision, not a "who" decision** | **5** | The best posting beats random by 45% on raid nights, but the habit "Stalwart on the forecast" trails the best by only 4%. Pre-claim raids can never take a Patch (DR-46). After two days the player stops reading the Sniff. | **The two-scent forecast.** The Sniff names the raiders and *two* candidate Patches. The motive (shown only if the Schemer is posted) or a Fraidy's early Caterwaul narrows it. Posting becomes a hedge: cover both with weaker cats, or bet your Stalwart on one. Add the unused lever: a Routed Sentry costs −3 Loyalty, so a bad bet has a face. |
| 2 | **Commanded Moves barely matter to damage** | **6** | Moves are 6–17% of damage. The catalogue averages 2.1–2.5 MV per Paw against a 3.5 budget. No Move is affordable inside a Tough-length fight (AC 16's "≥ 3 commanded Moves" is unsuppliable there). | **Make Moves the fast road to the Pile-On, not to damage.** Raise Set-up FZ about 1.5× and trim basic-string FZ, so a commanded Set-up visibly shortens time-to-Frazzle. Commanding then *causes* the fantasy moment. Scope AC 16 to threat 4–6 encounters and Captains (B-18). |
| 3 | **Personality barely shows in short fights** | **6** | An AI cat's first self-cast comes at 60 s. In trash fights personality shows only as movement, so AC 18 (70% can say how a cat "fights differently") is at risk. | **One free signature flourish per encounter per AI cat** (no Paw cost, personality-specific): the Braggart's chest-puff charge, the Fraidy's yelp-and-retreat, the Goofball's prop shove. It is readable in the first 10 s. R-G is the cheap version to test first. |
| 4 | **Daifuku fight length depends on how often he is knocked off** | **6** | In band (166–176 s) only at a knock-off every ≈ 8 s of wall time; 24 s gives 206 s, never gives 235 s. That cadence depends on AI climbing, which is new and untested. | **A crumbling wall top.** Each Posse hit on the wall cracks a tile, and the third crack drops him into the bucket (deterministic). This guarantees a knock-off cadence of about 10–12 s whatever the AI does, and turns "knock him off" into a visible meter in the world. |
| 5 | **Some Declarations are unearned** | **6** | 37–48% of mixed and lose-40 players get a deadline lead with fewer than 3 encounters, and some with none (R-B covers the zero case). A guaranteed Nemesis that feels assigned undermines Pillar 4. | **"The one who keeps turning up."** From L2D1 the director routes the provisional lead into the player's path at least twice before the deadline (an Ambush, a crate challenge, a Gloat after a raid), so the Declaration names a cat the player already recognises. |
| 6 | **Humble has no visible cost inside the slice** | **6** | At +8 simmer the slice shows Restless warnings, not uprisings (0.01 per slice). If Humble feels free, it dominates Chase Off. | **Make the cost social and immediate:** a Humbled resident on a posted neighbour's Patch counts as a clash (−10% Tribute) until the Goofball is posted there. The cost then shows on the next morning's pile rather than 13 nights later. |
| 7 | **The Brooder is never in the Posse** | **5** | Daifuku, the only Brooder, joins at the slice's end. One of the six personalities, the hook, is untested by players. | **Swap personalities between Kagi and Daifuku** (Kagi Brooder, recruitable on L2D3; Daifuku Schemer, a plotting Boss). The cost is that the Schemer's motive-reading guard leaves the slice, which matters if idea 1 lands. Decide after the grey box has tested Brooder AI. |
| 8 | **Numbers drift between docs** | **7** | Daifuku Lv 8 vs ≈ 9, the Strength lists, the Brooder dismissal arithmetic (−10→−5 vs the F7 clamp →−4), stale Backlog lines. Each is small, but together they cost a programmer an afternoon of asking. | **Make `design/registry/entities.yaml` the single source** for every named cat (level rule, Style, personality, Strength, Fear, post). Docs cite it and never restate it; `/consistency-check` runs before each build sprint. |
| 9 | **The teaching ladder is restated in four docs** | **5** | R-A fixes the current contradiction, but the cause remains: Combat, Territory, Day Loop and UX each restate the Life 2 ladder, and the fixers chased each other's stale copies. | **One table, owned by UX** (`key-screens.md` §7.4), which every other doc links to and never paraphrases. A doc may add only the *how* of its own beat. |
| 10 | **Day budget has no slack where it matters** | **7** | L2D3 out all Night: 24.9 typical / 28.9 heavy. The slice is 149 min against 120–150. Lot first-use time (1.5–2 min) is the weakest assumption. | **A "one-decision" first use for every Lot screen:** the first Turf Board shows only the forecast Patch and two portraits; the first Lessons screen one teacher and one Move. The full screen unlocks the next day. That saves about 1 min on each first-use day. |
| 11 | **No integrated Lives 1–2 sim** | **7** | Crew AC-6 (Posse Lv 7–9 at Daifuku) and F2 pacing are still hand derivations. The territory, combat and day-budget sims run separately. DR-57's third sim (the economy) is only partly covered. | **Chain the three existing sims day by day:** encounters from Combat's F9 table feed XP (Crew F2) and field haul (Territory §4.11), and the day budget checks the total. One script, one seed, one table per policy. |
| 12 | **The docs are too long to build from** | **6** | Combat 74 KB, Nemesis 77 KB, Territory 71 KB, Crew 64 KB, against a 50 KB slice target. Revision Logs and Backlog are a large share. | **A two-page build sheet per system** (rules in bullets plus one numbers table, linking to the long doc for *why*). Move Revision Logs to `design/reviews/logs/`. |
| 13 | **Look-dev unproven; art direction unsigned** | **6** | The E-1–E-9 spike has not run, reference closeness is open, the art director has not signed, and the third-person sky makes every angle visible (brief risk 5). It does not block a grey box; it blocks final slice art. | **Run the one-alley look-dev spike in parallel with the combat grey box.** Produce two mock frames per closeness option (§5). Both decisions (closeness, art sign-off) come from those frames, not from documents. |

---

## 4. What only a prototype can answer (first prototype's test list, in order)

**Prototype A: combat grey box** (brief §10: Mikan + 3, 3 Styles, 8 Moves, Tag-In, Pile-On, a Captain, a 3-phase Daifuku, 3 personalities: Hige Stalwart, Pon Goofball, Togemaru Braggart, plus a Brooder test cat):

1. **Is conducting four cats fun?** Unprompted, do ≥ 75% of testers Tag-In at least once and command ≥ 3 Moves per normal encounter, and rate it fun at 20 minutes (Combat AC 16)? Run with R-G's self-cast on and off.
2. **Can you read the brawl from behind a cat?** Random-pause test at 6 enemies + Posse: controlled cat found in < 1 s, telegraph class named, ≥ 90% (Combat AC 14, HUD AC 1). Camera T1: controlled cat in the safe frame ≥ 98%.
3. **Does it hit?** Hit-stop, stepped shake, impact frames and audio freeze on the same frame. No tester says "mushy" (Sound AC 6). Harding flash pass on the densest moment: a Pile-On whose last beat is a Daifuku phase break (Camera T5).
4. **Do personalities read in a fight?** ≥ 70% can say how one cat "fights differently" (Combat AC 18). Watch whether movement alone carries it.
5. **Is the Pile-On worth chasing, and are Moves worth commanding?** Log damage shares against the sim (Pile-On 44–48%, Moves 6–17%). If testers ignore Moves, open item 2 becomes urgent.
6. **Daifuku's bucket:** knock-off cadence with the new climbing AI (target about 8–12 s of wall time) and the resulting fight length. ≥ 60% find the second knock-off without a hint (Combat AC 19).
7. **Can a Life 1 kitten beat Togemaru?** He is a Scrapper who resists Claw ×0.8; Hige's Thump does ×1.2 against him.

**Prototype B: look-dev and home mock** (in parallel):

8. **Does a wordless Keystone land?** Muted Tier A ≥ 90% on K1.3 and K2.5 storyboards played in the home mock (Narrative AC 3). This is the single biggest risk to the USP.
9. **Can testers hum the Call?** ≥ 50% after exposure (Sound AC 1).
10. **Cat scale 1.25× at home:** Mikan in a 16-year-old's lap and on the piano bench reads right, and face-out rules hold (Camera T3).
11. **Reference closeness:** two mock frames per option, judged by the user (§5).

**First slice playtest** (after A and B):

12. **Do players want to go home?** ≥ 70% "because I wanted to" (Day Loop AC-P6); curfew trade 30–70% late.
13. **Do players care?** ≥ 80% name a Rival and what they did to it, and name a specific thing Haru does (slice tests).
14. **Is the posting decision real?** ≥ 70% change a post after the Sniff on ≥ 3 of 4 raid days, and give a personality reason (Territory AC 17–18). Failure triggers open item 1.
15. **Does the Declaration feel earned?** Interview: "why is that cat your Nemesis?" Deadline Declarations are the watch case.
16. **Verdict variety:** no Verdict above 60% (Nemesis AC 4). If Humble dominates, use open item 6.
17. **Day length:** Lot and Doorstep times on first-use days (L2D2, L2D3); median day ≤ 25 min; slice 120–150 min.

---

## 5. Decisions waiting on the user

| # | Decision | Type | Recommended default | Why |
|---|---|---|---|---|
| 1 | **Pillars sign-off** (`game-pillars.md`, unchecked) | Taste | Approve as written, with the brief's priority order | Every doc has been built against them for three iterations; nothing in the reviews argues for re-ranking. |
| 2 | **Engine** | Budget / tech | **Unity 6 LTS with URP**; Godot 4 if licence cost or team skill favours it | The slice needs a third-person cel/outline pipeline, a painted skydome, a deterministic overnight sim and a later handheld port. URP's toon and outline ecosystem and console tooling lower that risk. The GDDs are engine-agnostic, so either works; decide before the grey box starts. |
| 3 | **Team size, budget, timeline** | Budget | Size the slice for 4–6 people over ≈ 6–9 months, combat grey box first (≈ 6 weeks) | Without this, the Backlog cannot be prioritised, and the 50 KB doc-size target and scope risk 1 cannot be judged. |
| 4 | **Title** | Taste / legal | **"Nine Lives of a Boss Cat"**, subject to a trademark search | It carries both lives (nine Lives = the structure; Boss Cat = the street). Keep "Cat RPG" internally until cleared. |
| 5 | **Nemesis legal review** | Legal | **Commission a freedom-to-operate review by an IP attorney before any public showing, and ideally before the slice locks the nemesis loop.** | WB Games holds a US patent on its Nemesis System (granted 2021). Our design differs in ways that may matter (no death; Verdicts; a director wall-event model rather than a simulated hierarchy economy; one declared slot), but only counsel can judge claim scope. This assessment is not legal advice. Budget it now; it is cheaper than a redesign after a trailer. |
| 6 | **Reference closeness** (the *Shin chan: Shiro and the Coal Town* look) | Taste / legal | **"Print-stylised"**: take the warmth, flat cel fills and painted backdrops; push shape language, line colour and UI further from the reference | It reduces trade-dress risk (brief risk 7) and makes the game recognisable as itself in a thumbnail. Decide on the look-dev mock frames (§4 item 11), not in words. |
| 7 | **Cultural consultant** for the home rituals (Alcove, rin, genkan) | Budget | Commission before slice home content is final | The home is the USP; an inauthentic ritual would undercut it with the very audience that loves the reference. |
| 8 | **Handheld floor** | Budget | **Defer to after the slice; lean Switch 2-class** | A painted skydome plus outlines in third person is expensive on Switch 1-class. The slice is PC-only either way. |
| 9 | **Haru's presentation** | Taste | Canon default, not selectable | Specificity is why she lands (Narrative AC 4). |
| 10 | **Mikan customisation** | Taste | Fixed iconic design | Key art, the bell and the plaster depend on one Mikan. |
| 11 | **Ending** (does Life 9 imply Mikan's passing?) | Taste | No: Mikan is alive in the morning; the last sound is the bell | Life 8 already carries the death; a second one tips sad into grim. Not needed for the slice. |
| 12 | **Night locked in Lives 1–2 until the cat flap** | Taste | Yes | The flap is a story beat (K2.3) and staggers teaching. |
| 13 | **Spraying presentation** | Taste / rating | Sparkle-cloud euphemism | Keeps PEGI 7–12 / E10+ and the slapstick tone. |
| 14 | **Damage numerals** | Taste | Off by default, option Off / Big hits / All (already ruled, R3) | Listed only so the user can overrule. |

---

## 6. Decisions received (2026-11-24)

Recorded after this assessment; §5 above is left as written.

| §5 # | Decision | User's ruling | Against the recommended default |
|---|---|---|---|
| 2 | **Engine** | **Unreal Engine 5.8** | Replaces "Unity 6 LTS with URP; Godot 4". Set in `project.yaml` and `CLAUDE.md`; the art bible's §6.1 rendering requirements now target UE 5.8. |
| 4 | **Title** | **"Cat RPG"**, final: simple and straightforward | Replaces "Nine Lives of a Boss Cat"; no separate release title. |
| 6 | **Reference closeness** | **Reference-close on the visuals, not the 3C**: 3D cel-shaded characters that read like 2D cartoon cels, in environments that read like 2D painted anime backgrounds, built in full 3D with a free-rotating third-person camera | Replaces "print-stylised". Differentiation now comes from original characters, world, UI content and the free camera, not from moving the rendering away from the reference. The originality guardrail is unchanged: a look target only; all characters, names, locations and assets are original. |

Applied in `design/creative-brief.md` v1.4, `design/GDD.md` §1/§12/§20, `design/art/art-bible.md` (Iteration 3b) and `design/gdd/camera-system.md` (header note; free orbit already specified).

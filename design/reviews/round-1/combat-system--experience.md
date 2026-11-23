# Round 1 critique: `design/gdd/combat-system.md` (player-experience angle)

*Reviewer: game-designer (experience critic) · Date: 2026-11-23 · Read in full: all sections, lines 1–1405, none skipped. Also checked against `design/creative-brief.md`, `design/gdd/game-pillars.md`, and, for cross-doc conflicts, `design/ux/hud.md` §C1–C3 and §9, `design/gdd/crew-and-progression.md` §3.7, §3.13 and F10, `design/gdd/nemesis-system.md` (Fears, Strengths and requests to Combat), and `design/art/art-bible.md` (camera FOV).*

---

## 1. Verdict: **NEEDS REVISION**

This is an unusually rigorous first draft. The frame data, telegraph grammar, Paw arithmetic and feel-tier table are better than most shipped GDDs. It is still, second to second, a **very competent FF7 Remake clone with a great finisher image bolted on**. The things the user actually asked for on top of FF7R are thin: companions you switch and teach that *matter mid-fight*, a fight that plays like *cats* and not like Cloud with ears, and maximal impact that still *reads* from the canon camera. Three problems would show up the moment a real player picks this up:

1. the control scheme is too big, and it already conflicts with the HUD spec;
2. the companion layer is economic (switch to earn Paws faster), not expressive;
3. the most cat-like verbs (roofs, pounces, knock-offs) are either punished (the Perch rule) or left to a coin flip (AI Righting).

None of this is structural. The stagger loop, the Paw economy and the feel spec should all survive. The fix is cutting, plus one addition (Issue 3).

### The five questions, answered short

- **Exciting or a competent clone?** A clone in the real-time layer. The basic-attack layer is "string Swipes to fill Paws", which is the exact part of FF7 Remake critics called mashy. Rebirth answered that criticism with Synergy Skills: free partner moves that charge *both* characters' ATB. This draft has no answer to it. The excitement lives in the punctuation (Frazzle break, Pile-On, Zoomies), not in the sentences between.
- **What would a player tell a friend?** "When you stagger someone, your whole gang dives on them and disappears into a cartoon dust cloud." That is a good line and it belongs to the game. The second line should be "and I knocked the Boss off his wall into a bucket of water". The doc has every ingredient for that line, but it hedges each one (Issue 5).
- **Does being a cat change how it plays?** Partly. Hiss / Back Down (winning by intimidation), Pounce from the High Road, knock-offs and Fear props are real cat mechanics. But the Perch rule caps roof time at 4 s, AI Righting is a 50% roll, Bap is a renamed parry and Brace is a renamed guard. A player would describe this as an FF7R-style game *about* cats. They would not say they fight *as* cats.
- **Do four cats read from bird's-eye with all the VFX?** Not as specified. The camera cannot frame a 12 m ring at the art bible's 25–30° FOV within the 16 m clamp, and the telegraph poses ("ear flick", "shoulder dip") are about 40 px tall on handheld (Issue 4).
- **Is the 3-companion layer deep enough?** No. Mid-fight, Crew differ by Style basics and four Moves, but the *reasons to switch* (CR-9.7) are all resource or verb access. Between fights, the Move catalogue is mostly plain damage, so teaching a Move adds numbers, not new interactions (Issue 6).

---

## 2. What is strong (must survive revision)

- **The stagger loop.** CR-11 (Ruffled → Frazzled → Pile-On), with the Frazzle window drawn as a shrinking ring. It is readable, and it gives every fight a visible goal.
- **Three telegraph classes with absolute answers** (CR-18.1), plus class minimum windups enforced by a data check. This is the backbone of fairness.
- **Deterministic crits, refund-before-commit and "a failed Bap is still a Brace".** Together they produce a failure texture of "I got greedy", never "the game ate my input".
- **The Game Feel tier table and budget rules**, especially rule 4 (player authorship: AI-initiated hits render one tier lower). This is the best single idea in the doc for the conductor fantasy. Keep it word for word.
- **Hiss → Back Down.** Routing a weak Tough by intimidation is the most cat-true win condition in the doc, and it feeds Nemesis humiliation for free.
- **Attack tokens with a posturing idle.** It is readable, cat-true and cheap.
- **The Pile-On spec** (four beats, one per cat). This is the signature image, and it is correctly protected.
- **The anti-stall section and the honest Open Questions.** Q1, Q3 and Q8 identify real problems. This critique mostly pushes them from "watch in playtest" to "decide now".

---

## 3. Issues

### Issue 1 — BLOCKER — The control scheme cannot be learned in 10 minutes, and two docs already disagree on it
**Section:** CR-2, CR-21 (and UX `hud.md` §9.2)

**What is wrong.** The controlled cat has 15 inputs: Move, Swipe, Whack (tap/hold), Hop, Skitter, Brace/Bap, shortcut layer, Hiss, Slow Blink, a 4-way cat switch, lock-on and flick, a Pile-On chord, a Zoomies chord (L3+R3, i.e. clicking both sticks while steering), plus the contextual timing windows for Righting, Pounce and Ears Up. FF7 Remake gives Cloud fewer than this. The UX designer, working in parallel, could not fit it either. `hud.md` §9.2 has **no Hop, no Hiss and no lock-on in combat**, puts Slow Blink on South (where Combat puts Hop), puts Pile-On on North and puts Zoomies on L1+R1 (where Combat puts Pile-On). Two specialists produced two layouts, and that is itself the evidence the set is too big.

**Why it matters to the player.** On the handheld (a co-lead platform) L3+R3 is close to unusable mid-fight. Separately, CR-21 introduces Move, Hop, Swipe, Skitter, Brace, Slow Blink, a Move, Hiss and Back Down in Life 1, then dumps Whack, Ambush/Pounce, props and Fears on the player in one Life 2 beat. Meanwhile the thing that sells the game (switching, commanding, the Pile-On) does not appear until Life 2, which could be 60–90 minutes in. The vertical-slice question is "do players care within two hours". As written, they will meet the hook in hour two.

**Fix (concrete).**
1. Fix the gamepad map to this, and have UX adopt it:

| Button | Action |
|---|---|
| West | Swipe (Pounce when airborne or on the High Road) |
| North | Whack; becomes **Pile-On** while one is available (HUD's idea; Whack has low value inside a Frazzle window anyway) |
| South | Hop |
| East | Skitter |
| R1 | Brace / Bap |
| L1 (hold) + face buttons | Shortcuts |
| R2 | Slow Blink |
| L2 | Hiss |
| L1 + R1 | Zoomies (L3+R3 deleted) |
| D-pad Up / Left / Down / Right | Direct switch to Mikan / Crew 1 / 2 / 3 |
| R3 | Lock-on toggle. **Auto lock-on defaults to ON** |

2. Righting becomes automatic (see Cut list), which removes one timing input.
3. Rewrite CR-21 so the conductor loop arrives in the first 15 minutes. The Life 1 story recruit (Crew doc §3.4 already reserves one in Life 1) joins before the first Patch fight. The first Frazzle in that fight yields a **two-cat Quick Pile-On**; CR-12.1 already allows two cats. Switching is introduced here; Slow Blink commands to the *other* cat are taught in the same fight.
4. Move Whack, Ambush and Bap to the 2nd to 4th fights of Life 1–2, one per fight. Props and Fears go with the first Captain.

### Issue 2 — MAJOR — Pile-On is overexposed on Toughs and underpowered on leaders, so the "decision" in CR-12.7 is a script
**Section:** CR-12, F-5, F-3 paper table, Open Q8

**What is wrong.**
- **Overexposed.** Toughs Frazzle in 3–5 s and die in 5–8 s. Every Tough therefore becomes a Quick Pile-On: 4 clouds in a 4-Tough fight, and thousands over 25 hours.
- **Inconsistent.** F-5's own numbers say a Pile-On Routs any Tough at Lv 1 (100 damage vs 100 Nerve) but leaves one at 18% at Lv 50 (2,040 vs 2,500). The signature finisher stops finishing in the late game, and 18% is above the 15% Back Down line, so the player is left chipping.
- **Underpowered.** On a Captain the Pile-On is about 10 MV-equivalents. That is less than a single Shred inside the same window (8 MV × 1.7). On a Boss it is 6.8% of Nerve.
- **Not really a decision.** +0.05 per Paw means dumping all eight Paws raises the Pile-On by about 27%. The optimal line is always the same: dump everything, then Pile-On at about 6 s. That is boring optimal play, not tension.

**Why it matters.** The never-cut signature image gets worn out on trash, and it feels weak exactly when it should feel biggest (Captains, Bosses).

**Fix.**
1. **Pile-On always Routs anything below Captain rank** (one readable rule, at every level).
2. **On Toughs, Strays and Critters, a Quick Pile-On is available only when 2 or more enemies are Frazzled within 3 m of each other, or when the target is the last enemy standing.** Otherwise Frazzled Toughs simply die faster to hits. This turns "Frazzle two at once" (Bait, Belly Flop, Banshee Screech, Ricochet) into the skill goal against groups, and makes the cloud an event.
3. **On Captain and above**, raise `pile_on_mv_per_cat` from 1.5 to 2.5, and make the bonus gradient worth chasing: `per_paw` goes from 0.05 to 0.08, so eight Paws move ×1.5 to ×2.0 (the cap). Spending the window and the Pile-On then both visibly matter.
4. Take Boss phase breaks from Issue 7.

### Issue 3 — MAJOR — Switching is bookkeeping. Add one thing: the **Tag-In** (the single addition that most raises the ceiling)
**Section:** CR-9, CR-7, Game Feel

**What is wrong.** CR-9.7 lists the reasons to switch: double Pounce rate, access to Bap and Hair's-Breadth, a different Whack, and the fact that AI never spends the last Paw. Every one is a resource or permission reason. Switching never *does* anything on screen. In Pokémon the swap is the most charged moment in a battle ("Go, Kuri!"). Here it is a 3-tick camera re-centre. FF7 Rebirth's main addition to Remake was **Synergy Skills**: held-button partner actions that cost nothing and charge ATB on both characters (Kotaku; Steam Wiki/RPG Site guides). That is precisely a fix for "the real-time layer is just attacking".

**Fix: Tag-In (new rule CR-9.8).**
- **Trigger.** Switch control within **20 ticks** after the controlled cat lands a T2+ hit (string finisher, Whack, Pounce, Counter-Pounce, Bap), or immediately after a Hair's-Breadth.
- **Effect.** The incoming cat leaps up to 8 m to that target and performs its Style's **Tag-In strike**: startup 6, MV 1.2, FZ 20, Style basic type, invulnerable during the leap. Both cats gain **+15 Pounce points** at their new control rates. It costs no Paws and replaces Switch Grace on that switch.
- **Relay.** A Tag-In strike is itself a T2 hit, so it can be tagged off again. Each consecutive Tag-In within 3 s adds +10 FZ (relay bonus). A cat that was tagged out cannot be tagged back in for 3 s, which stops two-cat ping-pong. A **four-cat Relay** takes about 2 s, deals 4 strikes plus 60 relay FZ, and is the top-skill way to crack a Captain's Frazzle gauge.
- **Why this one.** It uses an existing verb, so there is no new button (fits Issue 1). It makes the companions physically visible in the player's own combo. It gives real-time Paws to half-rate AI cats through player skill, which is the Rebirth lesson. It makes Posse *variety* matter mid-fight, because each Style's strike reaches, launches or Ruffles differently. It costs 5 animations, one per Style. A Knack can later modify it (e.g. "Hand-Off: a Tag-In passes on the remaining Ruffled time").
- **What from Rebirth NOT to borrow.** Do not borrow **Synergy Abilities**, the big charged duo attacks that also raise the limit level. The Pile-On is already the team super, and a second team cinematic would dilute the signature image and spend the one-screen-wide-effect budget. Do not borrow the Folio skill tree either: Lessons are our version of that.

### Issue 4 — MAJOR — The camera spec cannot frame the canon ring, and the telegraph poses are invisible at that distance
**Section:** CR-6.3, CR-18.1, Game Feel budget, Open Q5

**What is wrong.** The art bible sets a 25–30° FOV. At the 16 m clamp and about 27.5°, the frustum is about 7.8 m tall. A 12 m ring seen at 55° pitch projects about 9.8 m deep, so CR-6.3's "every combatant inside the central 85%" is geometrically impossible in a spread fight. The camera will sit at the 16 m clamp with combatants off the top and bottom edges, and edge arrows will be permanent. *(These figures are my own estimate from the stated pitch, clamp and art-bible FOV; the combat doc gives no FOV.)* At that distance an adult cat is about 0.45 m on screen, roughly 6% of screen height, or about 42 px on the 720p handheld. A shoulder dip or ear flick at 42 px cannot be read. On top of that, a 4-Tough fight produces about 12 T4/T5 events (a Frazzle hit, a Rout and a Pile-On per Tough), each with full-screen flash and radial lines, which is one every 4 s. That is maximal, but with no contrast between beats.

**Why it matters.** This is brief risk 4, and Pillar 3 forbids "VFX so dense the player loses their cat". Readability fails exactly in the 6-enemy fights the brief allows.

**Fix.**
1. **Rings become screen-aligned ovals, 12 m wide × 8 m deep**, for normal fights; Den rings stay authored. That fits at about 16 m with margin. This needs a director ruling on the brief's "about 12 m across".
2. CR-6.3 specifies a FOV (match the art bible) and a 12–16 m clamp, and drops the "every combatant in frame" requirement in favour of "the controlled cat, its target and every active telegraph in frame".
3. Telegraph pose cues become **secondary**. The primary carriers are the ground decal plus an overhead glyph sized at ≥ 3% of screen height on handheld. Rewrite CR-18.1's pose column as "supporting".
4. **Rate-limit full-screen effects** to one per 1.5 s outside T5. A Tough Rout drops from T4 to T3 unless it is the final Rout. Any 2-tick full-screen impact frame on T4 happens only on player-commanded hits.
5. Add a pass criterion: in the random-pause test, the **active telegraph's class** must also be identifiable within 1 s.

### Issue 5 — MAJOR — The cat-ness is peripheral, and the Perch rule punishes the most cat-like play
**Section:** CR-5.2, CR-5.3, CR-5.5, CR-18.6 (Daifuku)

**What is wrong.**
- The Perch rule stops Paw fill and makes the cat top priority after 4 s on the High Road. Enemies are forced down after 4 s. Taking the high ground and waiting to pounce is *the* cat fantasy, and here it is an anti-stall tax.
- AI Righting is a seeded 50% roll (more or less with Zip), so the knock-off play (CR-5.5's "real, repeatable play") works half the time on any un-Frazzled enemy. That contradicts the doc's own determinism stance (CR-14.4).
- Daifuku "will not come down" contradicts CR-5.2's forced descent.

**Fix.**
1. **Replace Perch with Wind-Up.** On the High Road, passive Pounce fill stops at once (no free banking), and climbers and ranged enemies prioritise the perched cat after 2 s. The player's next Pounce, however, **charges with time aloft**: +0.4 MV and +8 FZ per second, capped at 3 s (MV 3.0, FZ 46). The charge is shown by the pre-pounce bottom wiggle the doc already specifies. Roof time becomes a cat-true risk/reward decision.
2. **Knock-offs are deterministic**: enemies knocked off a High Road edge **always Splat**, and Posse cats always Right (see Cut list). On a Boss, a knock-off Splat is Ruffled 6 s, not 3 s. Daifuku is exempt from forced descent by name.
3. Then sell it: the Boss table should say each Boss is beaten with a cat verb *and a prop*, and the first trailer beat is "knock the Boss off his wall".

### Issue 6 — MAJOR — The teaching layer adds numbers, not interactions; companions are not individuals in combat
**Section:** CR-17.3, CR-17.4, CR-14.2, CR-10

**What is wrong.**
- Of the 20 starter Moves, 7 are plain damage (Claw Flurry, Shred, Neck Nip, Belly Flop, Drop Strike, Shoulder Check, Wall-Kick) with a rider at most. Teaching a Bruiser a Scrapper damage Move gives it a slightly different number. The Crew doc's §3.13 "set-up → pay-off" table (Bait clumps → Belly Flop; Sit On It → a free wind-up; Ruffled → Neck Nip ×1.6) is a much better design for a teach-and-swap game, but it is written against a *different* Move catalogue (see Cross-doc conflict 2).
- Combat ignores that a Crew cat is an ex-Rival with history (Pillar 4). It touches combat only through the Grudge-Holder Knack.
- In the Pile-On, all four "beats" are generic, so the signature image does not show *who* is in your Posse.

**Fix.**
1. **Catalogue rule (CR-17.1): every Move is either a Set-up (creates a named state: Ruffled, Pinned, Clumped, Soggy, Tangled, Splat, Backstab-armed) or a Pay-off (states a bonus against one of those states). No Move is pure damage.** Rewrite the 7 plain-damage starters against this rule. Teaching then means "give my Bruiser Bait so its Belly Flop hits four", which is the Pokémon-move-tutor fantasy.
2. **Old Score (innate rule, replaces Grudge-Holder as a Knack).** A Crew cat fighting a Rival whose Memory records a Rout between them, either way, deals ×1.25 Frazzle to that Rival, and both play a recognition bark at the Standoff. A recruited Rival facing its old Clowder's Boss gets the same. The rule is cheap and it makes "who is in my Posse" matter for this particular fight.
3. **Style beats in the Pile-On.** Each participant's beat uses its Style's animation and sound (5 variants), so the cloud tells you what your Posse is. This also eases the Open Q8 fatigue.

### Issue 7 — MAJOR — The Boss fight drags at the phase gates and in Swaggering stretches (walkthrough below)
**Section:** CR-18.6, CR-11.1, Edge Case 10

**What is wrong.**
- Edge Case 10: a Frazzled Boss that reaches a phase gate through hits loses the rest of the window, including Paws just dumped into it, and the gate clamps the damage. The player is punished for exactly the play the system asks for.
- Between Ruffles, 50% Swagger halves every number with no reason shown beyond tail carriage.
- Un-Ruffled time-to-Frazzle is 40–55 s by the doc's own model. That is a long chip stretch.

**Fix.**
1. **Phase breaks are triggered by the Pile-On.** Damage that would cross a threshold clamps at it as now, but the Boss then enters **Cornered**: Swagger off and permanently Ruffled until the next Frazzle. The Pile-On on that Frazzle plays its final beat *as* the phase break. The signature image becomes the punctuation of every Boss phase, nothing is wasted, and the "chip" stretch disappears in the last part of each phase.
2. Delete Edge Case 10.
3. Damage numbers on a Swaggering target render in grey with a small shield glyph, so the player sees *why* hits are small and that Ruffling is the answer.

### Issue 8 — MAJOR — Auto-Hiss lets the AI take the player's best Ruffle route on Captains
**Section:** CR-10.2, CR-10.3, CR-5.4, Open Q4

**What is wrong.** Auto-Hiss defaults to on, and AI cats answer yellow telegraphs 70% of the time. Against a Captain the main Ruffle source is interrupting its yellow 1-Paw Move, which comes about every 9 s. Three AI cats will Hiss most of those before the player can. That breaks the doc's own rule that the player should never feel an AI cat won the fight for them, and the player-authorship feel rule (the interrupt is T3 and is shown one tier lower for the AI).

**Fix.** Delete the Auto-Hiss toggle. An AI cat Hisses only a yellow telegraph **aimed at itself**. Interrupting a Captain's or Boss's yellow is a player action, either directly or via a Slow Blink command.

### Issue 9 — MINOR — The ranged controlled cat is the safe Paw farm
**Section:** CR-3, F-6

A controlled Trickster earns 18 PG per string from 6 m away, about 80% of a Scrapper's 22.8 (which includes Flurry), and takes none of the melee risk. The Perch rule does not apply on the ground. **Fix:** PG on ranged basics ×0.7 (Trickster string 13, Yowler 10). Range costs Paw income, which matches the doc's own "range costs 15%" exchange rate.

### Issue 10 — MINOR — Frazzle decay punishes clearing adds in a Captain fight
**Section:** CR-11.4

On a Captain the whole Posse builds about 5 Frazzle per second, and the gauge drains 3 per second after 4 s of no gain. Ten seconds spent Routing a Tough erases about 15 s of Captain work. **Fix:** decay rate × `RankRes`-scaled factor: Tough 3/s, Captain 1/s, Boss 0.5/s; delay 6 s for Captain and above.

### Issue 11 — MINOR — Fed Up fires at 120 s, but the pillar says 90 s
**Section:** CR-19.9.3

Pillar 3: "no encounter outstays 90 seconds unless it is a Boss". **Fix:** `fed_up_seconds` 90 (safe range 75–120).

### Issue 12 — MINOR — The Fear catalogue is unlearnable mid-fight
**Section:** CR-16, CR-6.3 (Whisker Sense in combat)

Unknown Fears show nothing, so a prop activated near an unknown-Fear Rival is silent noise. FF7R has Assess for this. **Fix (no new verb):** any cat with the matching Fear inside a prop's radius plays a visible **flinch tell** even when the Fear is diminished or the prop deals nothing; the Fear then becomes known (a request to Nemesis). Discovery through experiment serves the Discovery aesthetic.

### Issue 13 — MINOR — The FF7 Remake reference table needs correcting
**Section:** Game Feel → Feel Reference

- **Shortcuts.** Confirmed. In Remake L2/R2 open the two allies' command menus directly, and L1+L2/R2 cycles *ally* shortcut sets (Fextralife manual; Game8; Shacknews). The doc's "deliberate difference" claim stands, but the text should say that Remake *has* ally shortcuts.
- **Slower ally ATB.** Not documented as a rule in Remake. Rebirth players do report that non-active characters fill noticeably slower (Steam discussions). Our 50% is brief canon, so cite the brief, not FF7R.
- **Precision block.** Rebirth's Precision Guard (timed block: zero damage, no pushback, extra ATB) corresponds to our Bap. Cite it.
- **Tactics.** Remake has no ally tactics or gambit settings, so Tactics are our own addition and should be described that way (closer to FF15/FF12).

---

## 4. Beat-by-beat walkthroughs (as a player, Alley mode)

### A. Tough fight: 3 Wall Sitters Toughs, Lv 5, Life 2, a Patch with one wall and a bucket

| t (s) | Beat | Read |
|---|---|---|
| 0 | I hold Whisker Sense, hop to the wall and Pounce. Ambush: ×1.5 damage, target Ruffled 6 s, group Startled 1.5 s, everyone +50 Pounce, so each cat has 1 Paw | **Great.** The best 2 seconds in the doc |
| 1–4 | Swipe string on the Ruffled Tough; it Frazzles at about 3 s. Pile-On prompt; I chord L1+R1 (Quick Pile-On, 1.2 s) and the Tough is Routed | Good, but this is the moment Issue 2 bites: it will be identical for the next 2,000 Toughs |
| 4–6 | Shadow Me sends all three Crew to my new target. Two of them posture (2.5–4 s) while one strings | **Drag/confusion:** six cats in a 2 m knot, three circling. At about 42 px each I check the ground ring to find mine |
| 6–15 | Tough 2 telegraphs yellow; an AI cat Auto-Hisses it before I can (Issue 8). Frazzle, Pile-On #2 | Feels like spectating my Crew's best moment, at a lower feel tier |
| 15–25 | Tough 3 at 15%; I Hiss and it Backs Down | **Great,** cat-true and funny |
| ~25 | The fight ends at about 25 s. The brief wants 45–90 s for 3–5 Toughs | Fine for Pillar 3; matches Open Q1 option (a) |

Net: the opener and the Back Down are excellent. The middle is a repeated Frazzle → chord → cloud with the Crew mostly circling. Tag-In (Issue 3) and the two-Frazzled Pile-On rule (Issue 2) turn the middle into "set up a double, relay through the Crew".

### B. Captain fight: a Captain (Bruiser, Fear of Water, Strength "cannot be knocked off the High Road") + 2 Toughs, Lv 12

| t (s) | Beat | Read |
|---|---|---|
| 0–3 | Standoff name-card and taunt | Good; Pillar 4 lands |
| 3–10 | I lock the Captain (most players will, because it has the name). Its 2 Alley tokens go to it and one Tough, so I am being hit from two sides. I Swipe; numbers are 30% smaller (Swagger), shown by a tail glint I cannot see at this zoom | **Confusion:** "why is it a sponge?" Issue 7.3's grey numbers fix this |
| 10–20 | Is the Water Fear known? Only if Nemesis says so. If not, the bucket is decoration. If it is, the Slow Blink panel tags it; I order the Trickster's Shelf Sweep on the bucket: Fear triggered, Ruffled 6 s, Soggy | When known: **great.** When unknown: dead content (Issue 12) |
| 20–28 | Ruffled window: Frazzle at about 46 per string-equivalent. Frazzled. I open Slow Blink, queue three Moves, close it. Some cats run up to 2.5 s to reach range, then Pile-On (Full, 2.5 s) | The queue-travel-execute delay eats a third of the 8 s window. **Drag** inside the climax. Fix: commanded Moves inside a Frazzle window use the Pile-On leap (no pathing) |
| 28–40 | I peel to kill a Tough that keeps hitting my Yowler; the Captain's gauge decays 3/s (Issue 10) | Punished for sensible play |
| 40–60 | Second Frazzle; Rout. Verdict | Total about 60 s: on target |

Net: it works when the Fear is known and the prop is near. The confusion points are Swagger visibility, unknown Fears, decay and the travel time of queued commands inside the window. Five poise states (Swaggering, Steady, Ruffled, Frazzled, Shaking Off) plus a Harden the player cannot see are too many to read; at the very least, Shaking Off needs no separate visual.

### C. Boss fight: Daifuku, Bruiser, Den in Hidamari Lane, end of Life 2

| t | Beat | Read |
|---|---|---|
| 0:00 | Standoff. Daifuku sits on his wall and "will not come down" | **Contradiction:** CR-5.2 forces enemies down after 4 s |
| 0:05–0:40 | Ground melee cannot reach him. I Hop up (24-tick mantle). After 4 s I am Perched: no Paw fill, top priority. Swipe 4 knockback might push him off, but whether knockback moves a Boss is unspecified. If he falls, a seeded roll at about 50% decides whether he Splats | **Biggest problem in the doc.** The first Boss's lesson ("knock-offs") is either impossible, punished, or a coin flip. Issue 5 fixes it |
| on a Splat | Ruffled 3 s, which is about 14 Frazzle at Boss resistance. He climbs back. Repeat | **Drag:** a climb/push/roll loop for 30% of his Nerve |
| ~1:30 | Phase break (3–4 s): Toughs enter, everyone +50 Pounce. **Great** spectacle |  |
| 1:30–2:30 | Phase 2: un-Ruffled, 50% Swagger, 40–55 s to Frazzle. Ruffle sources are Bap (2 s), Hiss on his yellows (taken by the AI under Auto-Hiss), props | **Chip stretch.** Pillar 3's "damage sponge" warning applies here more than anywhere |
| ~2:20 | Frazzled. I dump 8 Paws; ordinary hits cross 35%; Frazzle ends; the gate clamps; Paws wasted (Edge Case 10) | **Feels like a bug** to a player. Issue 7.1 makes this Pile-On the phase break instead |
| 2:30–3:30 | Phase 3; third Frazzle; Pile-On deals 6.8% of Nerve; finish with hits | The finisher does not finish. With Issue 7, the last Frazzle's Pile-On is the T5 Rout of the Boss |

---

## 5. Cross-doc conflicts

1. **Combat controls vs HUD controls.**
   - Combat CR-2: "Hop | A / Cross … Hiss | L2 … Slow Blink | R2 … Pile-On | L1 + R1 together … Zoomies | L3 + R3 together … Switch cat | D-pad: Up = Mikan, Left / Down / Right = Crew 1 / 2 / 3".
   - `hud.md` §9.2: "Slow Blink (open command menu) | South … Style action; Pile-On when an enemy is Frazzled | North … Zoomies (when full) | L1 + R1 … Switch leader previous / next | D-pad Left / Right … Slow Blink on previous / next Posse cat | L2 / R2". It has no Hop, Hiss or lock-on, and its conductor cue (§C1) shows "the ally-command glyph (L2 or R2)".
   - **Resolution:** adopt the map in Issue 1.1. Combat keeps Hop on South (a cat verb) and Hiss on L2. UX's North-as-contextual-Pile-On and L1+R1 Zoomies are adopted. Ally-targeted Slow Blink moves to the in-menu tabs (L1/R1 inside Slow Blink, as CR-8.2 says). The HUD conductor cue shows the D-pad direction for that cat. HUD's "everyone on my target" directive (D-pad Down) is cut, because Shadow Me already does it.
2. **Two Move catalogues.**
   - Brief §6: Combat owns "**all Move, Knack and Zoomies definitions and numbers**".
   - Combat CR-17.3 defines 20 Moves (Claw Flurry, Shred, Loaf…). Crew §3.9/§3.13 uses a different set (Knock It Off, Hairball, Chirrup, Bell Ringer, Fish-Hook, Avalanche…) and builds its synergy table and Posse indices on them.
   - **Resolution:** one catalogue, owned by Combat. Crew's names and set-up/pay-off intents are migrated in under the Issue 6.1 rule with Combat numbers. Crew keeps the Source, Rank and learnset columns only.
3. **Style matchup chart.**
   - Combat CR-14.2: "Scrapper … Resists Fang … Trickster — —".
   - Crew §3.13: "Scrapper | Claw | Thump … Trickster | Thump | Fang", i.e. each Style resists its own type, and its Boss rhythm ("Ikari resists Mikan's whole native kit") depends on that.
   - **Resolution:** Combat owns it, but adopt "each ring Style resists its own damage type" (Bruiser–Thump, Scrapper–Claw, Prowler–Fang, Yowler–Yowl) and keep Combat's weaknesses and a neutral Trickster. That is one rule a player can guess ("don't fight claws with claws"), and it keeps Crew's Ikari beat.
4. **Paw income.** Crew F10: "the player-controlled slot earns **6** [Paws per 60 s] (one per 10 s)". Combat F-6: 1 Paw per 6.3 s under sustained offence (about 9.5 per minute). **Resolution:** Crew re-runs its Posse indices on Combat's F-6.
5. **Fears.** Nemesis lists 13 Fears and asks Combat to value Dread, Overconfident, Spat allies and a `scattered` outcome. Combat values 6 Fears, each with a prop. **Resolution:** a Fear ships only if Combat has a prop or Move source for it. For the slice that means 5–6, which matches Nemesis's own slice proposal (Open Q2 there). Combat adds `scattered` and values Overconfident (5 s free opening: accept) and Dread (Ruffled 9 s instead of 6: accept). Spat allies count against the 10-combatant cap.
6. **Slow Blink chaining.** Combat CR-8.4 allows commands to several cats in one Slow Blink. `hud.md` §C2 closes after one confirm by default ("Chain commands" is an option). **Resolution:** the default is to chain while any other Posse cat can afford a Move. Commanding three cats in one blink *is* the FF7R tactical moment and the conductor fantasy.
7. **Pillar 3's 90 s rule vs Fed Up at 120 s.** See Issue 11.

---

## 6. Needs director ruling

1. **Ring shape and size** (Issue 4): change the brief's "about 12 m across" to screen-aligned 12 × 8 m ovals for normal fights. Recommended.
2. **Tag-In** (Issue 3) as a new core rule. Recommended. It is the only addition this critique proposes.
3. **Pile-On rules** (Issue 2): always Routs below Captain; on trash, only with 2+ Frazzled or the last enemy. Recommended. It changes how often the brief's "signature image" appears, which is the director's call.
4. **Fight length** (Open Q1): accept option (a), shorter fights (Captain 30–60 s, Boss 2.5–4 min). Recommended, because it suits Pillar 3, and Issue 7 removes the chip stretches that would otherwise be used to pad length.
5. **Mid-fight bench swapping (Pokémon).** Canon says the Posse is swappable only outside combat. I recommend **keeping canon**. Tag-In delivers the "Go!" moment without a bench, a fifth model on screen, or breaking the 10-combatant cap.
6. **Life 1 Posse**: the first story recruit joins before the first Patch fight, so that the Pile-On and switching appear in the first 15 minutes (Issue 1.3). This touches Narrative's Life 1 beat sheet.

---

## 7. Cut list

| Cut | Why |
|---|---|
| Player Righting input, and the AI Righting roll (CR-5.5) | Righting becomes automatic for the Posse; enemies knocked off always Splat. One fewer timing window, no RNG on the core knock-off play |
| Perch rule (CR-5.2) | Replaced by Wind-Up (Issue 5) |
| Bruiser hold-Whack **Sit** | Duplicates the Sit On It Move; one fewer hold input |
| **Dirt-Eyed** status | Targeting-rule complexity; on a player cat it disables soft lock, which feels like input denial. Kick Dirt applies Cowed 3 s instead |
| **Startled** as a separate state | Use Flinch (36 ticks) everywhere it appears |
| Well-Fed as a combat *status* | It is a max-Nerve modifier applied at day start, not an icon competing for the 3 status slots |
| Tactics **Hang Back**; toggles **Own Zoomies** and **Auto-Hiss** | Three Tactics are enough to "direct AI allies" (Shadow Me / Scrap / Mind the Others). Auto-Hiss is fixed by Issue 8 |
| **Shoo** hazards (CR-19.8) | Random from the player's view; the doc's own Open Q20 says it cuts cleanly |
| Cucumber carry-in-mouth | Needs a carry state mid-fight and overloads Hop with interact. Make it ledge junk ("knock the cucumber off the crate") |
| Vacuum prop | Level-scripted, by day, at doorsteps only. Rare, expensive, and it brings humans' houses into fights. Keep the Vacuum Fear only if a Move can trigger it |
| `damage_variance` knob | Off by default and contrary to the readability goal |
| HUD's "everyone on my target" directive | Duplicates Shadow Me |

Net effect: statuses go from 5+3 to 4+2, Tactics from 4+2 toggles to 3, timing inputs from 6 to 4, and hold inputs from 3 to 2. That meets Pillar 3's design test ("polish the existing Moves" instead of adding status sprawl).

---

## Sources (FF7 Remake / Rebirth checks, 2026-11-23)

- [Kotaku: FF7 Rebirth synergy skills and abilities](https://kotaku.com/final-fantasy-ff7-rebirth-synergy-skills-abilities-1851309980)
- [RPG Site: Rebirth Synergy Skills and Synergy Abilities](https://www.rpgsite.net/guide/15564-final-fantasy-vii-rebirth-synergy-skills-and-synergy-abilities-every-synergy-action-and-how-to-unlock-it)
- [Inverse: Rebirth synergy guide](https://www.inverse.com/gaming/ff7-rebirth-best-synergy-skills-abilities-guide)
- [VideoGamer: how Synergy works in Rebirth](https://www.videogamer.com/guides/final-fantasy-7-rebirth-synergy-skills-abilities)
- [Push Square: Rebirth combat tips (precision block)](https://www.pushsquare.com/guides/final-fantasy-7-rebirth-5-combat-tips-to-conquer-every-battle)
- [Fextralife: FF7 Remake Manual (controls)](https://finalfantasy7remake.wiki.fextralife.com/Manual)
- [Game8: How to Use Shortcuts, FF7 Remake](https://game8.co/games/Final-Fantasy-VII-Remake/archives/286848)
- [Shacknews: FF7 Remake controls](https://shacknews.com/article/116647/final-fantasy-7-remake-controls-and-keybindings)
- [Steam discussion: Rebirth non-active ATB fill](https://steamcommunity.com/app/2909400/discussions/0/720115720988395339)
- [Samurai Gamers: FF7 Remake ATB guide](https://samurai-gamers.com/final-fantasy-7-remake/atb-gauge-guide/)

# Round 1 Critique: UX docs (`design/ux/hud.md`, `design/ux/key-screens.md`), art-direction review

*Reviewer: art-director · Date: 2026-11-23 · Protocol: `design/reviews/REVIEW-PROTOCOL.md`*

**Coverage.** I read both UX docs in full. Against them I read these GDD sections: Combat CR-1, CR-2, CR-3 (Scrapper/Bruiser only), CR-4 to CR-13, CR-15, CR-19 to CR-21, Game Feel (Impact Moments and budget rules), UI Requirements, Assumptions, Open Questions. Nemesis R4, R7, R8, R11, UI Requirements. Territory §3.6, §3.7, §3.11, §3.12, §11. Crew §3.4 to §3.8, UI Requirements, Edge Cases (Recruit at cap). Art bible §4 (colour), §7 (UI), §11 (combat VFX), §13 (camera). I skipped: Combat CR-14 (partly), CR-16 to CR-18, all Formulas. Nemesis R1 to R3, R5, R6, R9, R10, R12, R13 and Formulas. Territory §3.1 to §3.5, §3.8 to §3.10, §3.13 and Formulas. Crew §3.1 to §3.3 and §3.9 onward. Those sections may hold more UI-relevant rules than the ones I found.

**Style reference.** The image at the user's path is a Shin-chan/Shiro screenshot: a semi-transparent cream cloud balloon, a brown pill name tab top-left, and a round portrait with a red ring. The brief's originality rule (§9) allows it as a *style* reference only. Art bible §7.1 already sets our material ("paper goods": flat print, no brown name tags, no glossy bubbles, no gradients). The bottom caption in the image is a video subtitle, not game UI. Ignore it.

---

## 1. Verdict

**NEEDS REVISION**, with five blockers.

The UX thinking is the best in the design set: the three-HUD philosophy, the language and home vetoes, the One Cat Card, and the Verdict compass. But the docs were built blind, and three things fail on contact with the real GDDs:

- the control map contradicts Combat on almost every button;
- the onboarding teaches mechanics illegally and in the wrong Life;
- the Fence Line wireframe contradicts both Nemesis's data contract and the art bible's composition.

None of this needs a new philosophy. It needs reconciliation, cuts, and one honest pass at handheld pixel budgets.

---

## 2. What is strong (must survive revision)

- **Three HUDs as a Pillar 2 signal** (hud §1). The HUD falls away at the garden wall over 800 ms. It is the best idea in either doc. Keep it exactly.
- **Language veto applied to accessibility too** (key-screens §9). It is stated, not just implied.
- **The HUD does not shake; hit-stop freezes the world, not the HUD; there is a fixed draw order** (hud §7). Keep all three.
- **Damage numbers: hide AI basic hits, merge multi-hits, size by hit class rather than magnitude, encode with frames not colour** (C7). Keep the full ruleset.
- **Call Ripple drawn as the Call's own contour**, and silenced in Life 8 (E6). This is the strongest wordless UI beat in the project.
- **Verdict compass**: no default focus, a 500 ms input lock, hold to commit, fixed positions with mnemonic meaning (key-screens §4). Keep it.
- **One Cat Card across every context**, with recruited Rivals keeping their history (key-screens §1.1.3).
- **Unavailable actions stay focusable and say why.** Keep it.
- **Sting contour glyph** so deaf players can learn a Rival's yowl-sting (key-screens §3.4).
- **Conductor cue on the Posse row** (C1). The concept is right; its binding is wrong (Issue 1).

---

## 3. Issues

### Issue 1 — BLOCKER — Control maps disagree on nearly every combat button (hud §9.1 to §9.3; Combat CR-2, CR-8, CR-9)

UX designed for a game with no combat jump, no heavy attack, no Hiss and no direct switching. Combat has all four. If the map is not reconciled, the onboarding, every prompt glyph and the conductor cue are wrong.

**Every conflict** (UX vs Combat; gamepad by position, West = X/Square, North = Y/Triangle, South = A/Cross, East = B/Circle):

| # | Input | UX (hud §9.2) | Combat (CR-2) | Nature |
|---|---|---|---|---|
| G1 | South | Slow Blink | **Hop** (mantle, Pounce from High Road, Righting) | Hard clash. UX A2 assumes no jump in combat; Combat's High Road fighting needs one |
| G2 | North | Style action; Pile-On (contextual) | **Whack** (heavy, tap or hold-charge) | Hard clash. UX has no heavy attack; Whack is each Style's identity |
| G3 | West | Attack, hold for heavy | Swipe only | UX's hold-for-heavy collides with Bunny-Kick/Sit, which are hold-Whack |
| G4 | R2 | Slow Blink on next Posse cat | **Slow Blink** | Same family, different semantics |
| G5 | L2 | Slow Blink on previous Posse cat | **Hiss** | Hard clash. UX has no Hiss at all: no binding, no cooldown display |
| G6 | L1 + R1 | **Zoomies** | **Pile-On** | Direct inversion: the same chord fires different finishers |
| G7 | L3 + R3 | — (L3 = bell ping, R3 = lock) | **Zoomies** | The chord collides with UX's bell ping, which fires on the first click |
| G8 | D-pad Left / Right | Switch leader previous / next | Switch to Crew slot 1 / 3 | Cycling vs direct selection |
| G9 | D-pad Down | "Everyone on my target" directive | Switch to Crew slot 2 | Combat's Shadow Me Tactic already does the directive |
| G10 | Shortcut layer order | L1 + W/N/E/S = Moves 1/2/3/4 | L1 + X/Y/A/B = W/N/**S/E** | Slots 3 and 4 are swapped |
| G11 | Whisker Sense in combat | Unavailable (L2 reassigned; A10) | Available; highlights props and known Fears | Combat also puts Hiss on L2, contradicting its own "binding unchanged" |
| G12 | Slow Blink cat change | L2/R2 or D-pad Left/Right | L1/R1 or D-pad | Clash |
| G13 | Slow Blink direct pick | L1 + face inside the menu | — | Redundant once the cursor exists |
| G14 | Slow Blink entries | 4 Moves, Zoomies, Pile-On (flat, at most 6) | Adds **Tactic** and **Scram** (8) | Breaks UX's flat-menu assumption (UX OQ7 predicted this) |
| G15 | Pile-On availability | Contextual North; solo Pile-On in Life 1 (K19) | Needs **2 standing Posse cats** (CR-12.1) | A rule conflict, not only a binding |
| K1 | RMB | Guard | Whack | Clash |
| K2 | Space | Slow Blink (combat); Jump (exploration) | Hop | Clash |
| K3 | Q | Whisker Sense / Slow Blink previous cat | Brace | Clash |
| K4 | E | Interact / Slow Blink next cat | Pile-On | Clash in combat |
| K5 | F | Pile-On / Style action | Hiss | Clash |
| K6 | Tab | Fence Line | Slow Blink | Clash |
| K7 | Z / C / X | Switch previous / next / Mikan | Z = Zoomies; switching on F1–F4 | Clash. F1–F4 is also a bad reach from WASD |
| K8 | R | Zoomies | — | — |

**Fix: adopt this final map.** Combat owns the actions; UX owns the map (brief §6). This keeps Combat's verbs, keeps UX's conductor logic, and removes every chord that collides.

**Gamepad**

| Action | Exploration | Combat |
|---|---|---|
| Move | Left stick | Left stick |
| Hop / jump to High Road | **South** | **South** (Hop; Righting; airborne Swipe = Pounce) |
| Swipe / Swat | **West** | **West** |
| Whack (heavy; hold to charge per Style) | — | **North** |
| Interact (Spray, Sniff, Nap, Beg) | **North** | — |
| Skitter / Dash (hold = sprint) | East | **East** |
| Brace / Bap | R1 = Stalk (hold) | **R1** |
| **"See" button** | **R2 = Whisker Sense** (hold; toggle option) | **R2 = Slow Blink** (press toggles) |
| Hiss | — | **L2** |
| Shortcut layer | — | **L1 hold** + West / North / East / South = Move 1 / 2 / 3 / 4 (clockwise from left, matching the menu row order; Combat updates its X/Y/A/B order) |
| Zoomies (controlled cat) | — | **L1 hold + R2** (the diamond shows a crown slot by R2 when full); also pinned in Slow Blink |
| Pile-On | — | **L1 + R1** chord (Combat's binding; theme: "all paws"); one-button remap required (Combat CR-20.2 already offers it) |
| Switch cat | D-pad Left / Right = **Tail-Up** picker (Crew §3.5) | **D-pad direct**: Up = Mikan, Left / Down / Right = Crew slots 1 / 2 / 3 |
| Meow / Sit | D-pad Up / Down | — |
| Lock-on / next target | — | R3 / right-stick flick |
| Bell ping | L3 | L3 (now safe: no L3 chord exists) |
| Pause | Menu | Menu |
| Fence Line shortcut | View | — |

Inside Slow Blink: left stick or D-pad Up/Down moves the cursor; **L1/R1 changes the selected cat** (skipping Routed cats); South chooses; East backs out; North held shows info; **West = Tactic**; **hold View = Scram**.

**Keyboard and mouse** (combat; exploration in brackets where different)

| Action | Key |
|---|---|
| Move | WASD |
| Swipe [Swat] | LMB |
| Whack | RMB |
| Hop [jump] | Space |
| Skitter [dash] | Shift |
| Brace / Bap | Q |
| Hiss [Interact] | F [E] |
| "See": Slow Blink [Whisker Sense, hold] | Tab |
| Shortcuts | 1–4 |
| Zoomies | R |
| Pile-On | E |
| Switch: Mikan / Crew 1 / 2 / 3 | Z / X / C / V |
| Lock-on / next target | Middle mouse / wheel |
| Bell ping | G |
| Slow Blink cat change | Q / E inside the menu (Brace and Pile-On cannot fire while time is at 5%) |
| Fence Line [exploration only] | Tab tap is Whisker Sense, so Fence Line moves to **J**; it also opens from pause |

Consequences for UX:
- The conductor cue stops being a button glyph. It becomes a pad-bell icon on the row ("this cat can act").
- The Posse Panel rows each carry their D-pad glyph (Issue 2).
- The Command Stub's three lines change (Issue 2 cuts the stub anyway).
- **Cut** UX's Posse directive (G9: Shadow Me already does it), the in-menu L1 direct pick (G13), and right-stick "peek" in exploration (art §13.1: the camera never nudges).

### Issue 2 — BLOCKER — The combat HUD overloads a 720p handheld under the VFX the tiers specify (hud §3, §4, §7)

**The real numbers.** Art §13.4 puts a cat at about **64 px long** on a 720p handheld in a full-ring framing. Combat's brawl camera fits every combatant into the **central 85% of the frame** (CR-6.3), and art keeps the controlled cat in the lower-middle third (§13.2).

UX's layout rationale says the bottom corners are "the cheapest pixels" (§3.1). That is false under Combat's camera: the near edge of the ring lands in exactly those corners, under **90–100% opaque** panels. Cats will fight under the Posse Panel.

**The count.** In real-time combat UX allows, at once:
- **Screen-anchored:** Posse Panel, Command Stub, Target Plate, a callout, and edge flares.
- **World-anchored on or around 64 px cats:** leader bell on a stalk, ground ring, four chevron ticks, reticle, Combat's soft-lock bracket, up to 6 enemy mini-bars, tell decals, 6 damage numbers, glyph bursts, up to 3 Move ribbons with text, a bark balloon, a Pile-On word prompt, Perched and Scram markers.
- **Per Posse row (Combat adds a Tactic icon and a queued-command icon):** about 10 sub-elements × 4 rows.

That is over 60 discrete readable items. Five of them carry world-space text, and they move during T4 global hit-stop and full-screen impact frames.

UX's own text floor also fails at 720p. The floor is 26 px at 1080p, which is 17.3 px at 720p, below UX's stated 18 px handheld floor (§7 vs §10.2). Art §7.4's 24 px floor (16 px at 720p) is worse. The risk is not clutter in general. It is losing the leader and misreading the Frazzle window, the two things Pillar 3 and brief risk 4 name.

**Fix (rules and cuts, not "consider"):**

1. **Camera keep-out.** Combat's auto-fit region is the frame minus the screen-anchored panel rectangles (bottom-left and bottom-right blocks, top-centre ribbon), not the raw 85%. This is a Combat/technical-artist change UX must request in writing.
2. **One overhead mark per Posse cat.** Allies get the chevron tick (art §4.3). The controlled cat's chevron is **replaced** by the bell, plus Combat's ground ring. No stalk stacked on top of a chevron.
3. **The Target Plate becomes an identity ribbon.** The Frazzle gauge moves to the enemy, as the zigzag world bar art §7.2 and Combat UI Requirements already specify. That is where the Pile-On decision is made.
   - The top-centre ribbon appears **only for tracked Rivals, Captains and Bosses**: the Clowder banner, name, Title, claw-mark rank pips, and up to 3 known Fear/Strength stamps. For Bosses it also shows a segmented Nerve bar.
   - Strays, Toughs without a name-card, and Critters get **no plate**.
   - This resolves UX WEAK #9.
4. **Frazzle bonus as pips, not a numeral.** Five pips (1.6, 1.7, 1.8, 1.9, 2.0) on the Frazzled countdown ring. It replaces "x1.6" (UX) and Combat's "percentage beside the gauge". The decision stays readable without a number (Pillar 3).
5. **No world-space text in real-time combat** except damage numerals, the single bark balloon, and the Pile-On prompt's word on its first 3 showings only (glyph alone after that).
   - **Cut ally Move ribbons (C9)**. Combat's cut-in flash and art's T2 effect already carry them.
   - Keep enemy callouts only for **red** telegraphs by Captains and above, docked under the identity ribbon, never over the cat.
6. **Posse Panel trims on handheld.** Nerve numerals on the controlled cat's row only (bars elsewhere). The Tactic icon shows only in Slow Blink. Keep the queued-command icon: it is the conductor's proof. Status icons max 3 (Combat CR-15.4), on the panel only.
7. **Rows are fixed by slot and ordered by D-pad (Up, Left, Down, Right), each with its D-pad glyph.** UX's rule that "the leader's row moves to the top of the stack" is **cut**: reordering rows on every switch destroys the spatial mapping the player uses to switch. The leader row enlarges in place.
8. **Kill the Command Stub after Life 1.** It occupies the bottom-left corner for a teaching job that hint cards already do. From Life 2 the bottom-left is empty in real time and belongs to the Slow Blink menu alone. The shortcut diamond moves next to the leader row (Combat's placement), so the eye stays where the Paws are.
9. **Text floor: 18 px physical at 720p for every glyph-bearing element, including damage numbers and balloons.** That means 28 px at 1080p baseline (handheld HUD preset L applies ×1.0 on top). I will move art §7.4's floor to match.
10. **Default damage numbers to "Moves only" on handheld.** "All" stays available.
11. **Glyph-burst cap: art's rule wins.** At most 3 bursts on screen, at most one of T3+ size (art §11.6). UX's "1 large + 3 small" becomes "1 large + 2 small". The T5 screen-space giant glyph is allowed only while the HUD is already hidden for the cinematic (UX §5.2), so the hidden HUD resolves the "may not cover corner panels" rule.
12. **Acceptance test.** Combat's random-pause test (19 of 20 find the controlled cat in under 1 s) must be run **on handheld at 720p** with 10 combatants and T4 effects, not only on PC.

### Issue 3 — BLOCKER — The Fence Line wireframe is a chart dressed as a wall, and it contradicts Nemesis's data contract (key-screens §2; Nemesis R4.3, R11.3; art §7.6)

This screen is the nemesis system's face and the game's most distinctive screenshot (Pillar 4 forbids "hiding the hierarchy in a spreadsheet UI"). The wireframe draws:
- a text header bar ("FENCE LINE · Mikan · Lane Cat (Clout 2 of 7) · Day 15 · Morning");
- text rank labels ("BOSS", "CAPTAINS", "TOUGHS (crates)");
- uniform portrait boxes;
- a three-line text footer;
- a separate whole-town mode with its own layout.

It reads as a roster with a fence drawn on it.

**Structural errors against Nemesis R11.3:**
- Toughs sit on the wall. The **crate row below the wall is the Undermark** (Humbled residents, one crate per player-held Patch). UX puts Toughs on the crates.
- Exiles are paw prints off to one side, not empty seats on the perch row.
- Old-Timers have a sunny ledge. UX omits them.
- The First Captain sits at the Boss's right. UX does not mark him.
- Crew ex-Rivals sit on the player's own gatepost. UX says Recruited cats are "gone from the wall".
- The Memory strip is up to 5 icons with one line each. UX gives a text footer.

**Visual errors against art §7.6:**
- The art bible specifies a side-on painted panorama with parallax and phase lighting, wall material changing by district, cats as real models through the portrait rig, and **Mikan seated in the scene at a height set by Clout**. That answers UX OQ5.
- The Nemesis mark is a storm scribble glaring at Mikan's seat. UX uses a spiked frame.
- Memory is a stamp strip, "never as a table of text".

**Fix:**

1. **One continuous panorama, not district screens plus a whole-town mode.**
   - The default framing shows one district's 8 perches plus its crate row, about 120 px per cat at 720p.
   - L1/R1 scrolls the wall to the neighbouring district. L2/R2 zooms out to the whole town and back.
   - The whole-town zoom is the money shot: the Bell section (the Lot fence and kei truck) at the harbour end with Mikan low on it, Botan on the lighthouse perch at the far hilltop end, the colour climbing warm to pale (art §4.4). The player's climb becomes a picture.
2. **No rank labels.** Height is rank. The View legend carries the words.
3. **No header bar.** Phase is the lighting. Clout is Mikan's seat height, plus one small stamp beside Mikan.
4. **Name pills appear only on Nemeses and on the focused cat.** Everyone else is a cat, not a label. The screenshot must sell cats.
5. **Selection slides up the Standoff name-card component** (art §7.2: slanted Clowder banner, chestnut portrait, claw-mark rank pips) with the 5-icon Memory strip and moods. South opens the full Rival Card. This keeps UX's One Cat Card rule.
6. **Seat states use the art bible's table (§7.6)**, extended with Nemesis's states:
   - Wavering: turned away.
   - Loot held: fish stamp.
   - Feud: chalk scratch plus cats turned away (Nemesis requires a hissing arc at mutual feud of 50 or more; art draws it as the chalk line).
   - Intent known: a small paw-arrow stamp toward the target Patch.
7. **Overnight replay: at most 5 hops (Nemesis cap)**, with UX's one-line captions docked in a slim paper strip at the bottom. Reduced-motion list mode stays.
8. **Screenshot acceptance criterion.** A 1080p capture of a mid-game district, with no text visible except focused-cat and Nemesis name pills, lets 4 of 5 no-briefing viewers say who is the boss, who hates the player, and where the player sits.

### Issue 4 — BLOCKER — The onboarding beat sheet teaches mechanics that are illegal or scheduled for Life 2 by the owning GDDs (key-screens §8.3; Combat CR-12.1, CR-21; Nemesis R8.3, UI table; Territory §3.7; Crew §3.4.D)

Conflicts:
- **Solo Pile-On at 0:12**: illegal. Pile-On needs 2 standing Posse cats (CR-12.1).
- **Frazzle at 0:12**: Combat introduces it in Life 2 with the first Crew cat.
- **Ambush at 0:42**: Combat schedules it for Life 2.
- **Morning Sniff Rival line at 0:27, used to reveal the Fence Line at 0:29**: Nemesis Sniff items start in Life 2.
- **Missing beats.** The sheet never teaches Hop in combat, Whack, Brace, Hiss and Back Down (Combat: Life 1), or Tactics.
- **Its own principle is broken.** "No new verb within 60 s of another" (§8.1.2) fails at 0:00, 0:01, 0:02 and 0:03.
- **Load.** About 35 concepts in 50 minutes, ending in a time-skip at 0:50. That is not realistic for a player who also has to read a wordless home story in the same hour.
- **Crew vs Combat on the first recruit.** Crew reserves the first story recruit for Life 1; Combat puts "first Crew cat: switching, Frazzle, Quick Pile-On" in Life 2.

The user's headline is combat feel. The signature image (Pile-On) must land in hour one, and it cannot land without a second cat.

**Fix: re-cut the first hour into three acts, and move the first recruit to the end of Life 1** (ruling needed: Combat CR-21 and Crew §3.4.D must agree).

| Act | Time | Teaches (one per beat, at least 90 s apart) | Not yet |
|---|---|---|---|
| 1. The garden and the lane (Day 1) | 0:00–0:25 | Move; Hop to the wall; the Call and home (Call Ripple, first heart); Swipe and Skitter on a crow; first Paw, Slow Blink opening itself once, one Move; Brace on a Stray; Whisker Sense, then Spray (scent, Patch); Hiss and Back Down on two Strays; nap (Sunspot, phase dial) | Frazzle, Pile-On, Ambush, Whack |
| 2. A name, a choice, a home (Day 1 Dusk → Day 2 morning) | 0:25–0:40 | First named Rival Standoff (a lone Tough fits Combat's Life 1 budget of 1); first Verdict (Chase Off / Nose-Touch only make sense here; Humble needs a held Patch, Recruit gets the Offering step, so show all four with reasons); "See the wall" from the Verdict reveals the Fence Line (not from the Sniff); Dusk, home, evening vignette, sleep; Doorstep Tribute (the Sniff shows only the Tribute line in Life 1) | Morning Sniff nemesis lines, raids |
| 3. Two cats (Day 2) | 0:40–0:60 | Story recruit at the Lot (Crew's Life 1 slot); Posse of two; **switching** (D-pad Up / Left); **conducting** (pad-bell cue; L1/R1 in Slow Blink); **Frazzle → Quick Pile-On**, the extended-window request to Combat moving here | Shortcut diamond, Whack, props/Fears, Ambush, Bap, Tactics, Sentries, Lessons, Zoomies, Night: all Life 2 per CR-21, Territory and Crew |

Acceptance: the 80% playtest criterion in key-screens §12 changes to "used Slow Blink, commanded the second cat, performed a Pile-On, Sprayed, gave a Verdict, went home when called". Ambush is dropped from it.

### Issue 5 — BLOCKER — Several screens display what the owning systems forbid, or omit what they require (key-screens §3, §4, §5, §6; hud C11, E4)

| Item | UX shows | Owner says | Fix |
|---|---|---|---|
| Grudge | Number "72" and a 10-segment bar (Rival card, Verdict, Fence Line footer); 5-step hackles on the Standoff card | "Grudge and Regard are shown as moods, never numbers", four steps each (Nemesis UI Requirements, R11.3) | 4-step Grudge mood and 4-step **Regard** mood everywhere; Nemesis mark size follows Grudge (art §7.6). Regard is missing from UX entirely: add it |
| Scent | Number in the Patch Tag and Whisker Sense | "Scent is always shown as 1–4 wisps and colour, never as a number, outside the Turf Board" (Territory §11) | Wisps on the street; number on the Turf Board only |
| Loyalty | devoted / loyal / content / wary / restless, plus the number | Tiers **Shifty / Aloof / Steady / True / Sworn** with gates: teach at Steady+, Warden at True+, heir at Sworn (Crew §3.6) | Use Crew's tier names; show the gate the tier unlocks on the card |
| "!" on the roster | Restless | "!" means a **pending learn**; sulking is a **cloud icon** (Crew UI Requirements) | "!" = pending learn; cloud = idle/sulking; tier word = Loyalty |
| Recruit | One price, from carried Morsels; K15 dead end | Offering steps nothing / half / fair / feast; Willingness as ear posture **and %**; refusal reopens the prompt with Recruit greyed; hard blocks (cap, Critter, more than 5 levels above Mikan, unclaimed Boss) (Crew §3.4.A) | Choosing Right opens a 4-step Offering row inside the card with live Willingness %; refusal path specified |
| Nose-Touch copy | "Grudge cleared" | Accepted (Grudge 0) or **snubbed** (Grudge halved) per F10 (Nemesis R7.2) | Copy: "Offer respect. They may accept." The preview pose shows the acceptance band (see the body-language rule below) |
| Verdict order | Order Routed | Highest rank first (Nemesis R7.1) | Use Nemesis's rule |
| Loss beat | 6 s or less | Gloat 3 s or less (Nemesis R7.3) | 3 s |
| Turf screen | Holder, Scent, Sentry, Tribute | Also: Watched/Unwatched, Sentry **Style role** (Anchor, Lookout, ...), upgrades and Specialisations, **Rations** with projected upkeep, projected Tribute, Lot upgrades, Stash cap (Territory §11) | Add a Rations dial and an upgrade panel; show the Style-role stamp on each Sentry portrait |
| Field posting | After any Spray | Only after a **Claim Spray or a won raid defence** (Territory §3.6) | Narrow it |
| Caterwaul flare | Icon and Patch name | Also **time left** as a shrinking ring (Territory §3.7) | Add the ring |
| Mikan's Moves | "(S) Change" from pause anywhere | Mikan re-slots from the **Repertoire** at the Lot, a Sunspot or home (Crew §3.5.6) | Change enabled only in those contexts; Repertoire view added |
| Watch pips, Pending | Absent | Required on the cat sheet (Crew UI Requirements) | Add them |

**Body-language collision (a cross-doc problem UX must arbitrate).** Nemesis R7.1 uses **ears** for Nose-Touch acceptance. Crew §3.4.A uses **ears** for Recruit Willingness. One cat cannot hold both postures. Fix: each tell plays only on its Verdict's raised-card preview. Raising Up (Nose-Touch) shows the ears. Raising Right (Recruit) shows eyes tracking the Offering and a forward lean. Raising Left or Down shows the tail (flee/uprising risk, Nemesis). UX's preview-pose system (§4.5) is already the right vehicle.

### Issue 6 — MAJOR — The three rule conflicts UX found: verdicts and resolutions (key-screens §6.4, OQ8, OQ9, OQ12)

**(a) "Replacing a Move destroys it": real, but narrower than UX thinks.** Crew §3.7 confirms Crew cats know only their 4 slotted Moves. It adds recovery paths:
- **Old Habits**: Instinct Moves of the cat's own Style re-learn free.
- **Refresher Lessons**: 50% price, if any Crew cat or Mikan knows the Move.
- **Elders**.
- **Mikan's Repertoire**: Mikan never forgets and is "the Crew's library".

A Move is truly lost only when the last copy of a non-Instinct Move goes, and for Keepsakes that loss is permanent. Fix:
- The confirm step shows one of three outcomes:
  - "Relearn free at the Lot" (Instinct);
  - "Suzu can teach it again, half price";
  - "**Gone for good**" (hold to confirm).
- In the last-copy case, the confirm offers a one-press **"Teach Mikan first"** when the cat has its daily Lesson to give. This turns the warning into the fiction Crew intends.
- For Mikan as student, there is no warning ever.
- Close UX OQ12: keep Crew's rule. The loss is rare, warned, and drives "Mikan is the library".

**(b) "Recruit dead-ends when the Crew is full": real, and it fails Pillar 4 at its peak moment.** Crew's answer (Recruit disabled at cap; "the Lot offers Dismissal first") makes the player lose a Nemesis they spent fights courting, at the moment of triumph, because of a menu chore they did not know about. Fix:
- The Standoff name-card shows the Crew count stamp ("6/6") on any Rival whose Recruit Willingness band is 50% or higher. Warn before the fight, not after.
- Allow **one over-cap recruit**. The new cat waits on "the gate crate" at the Lot. It cannot join the Posse or a post until the player Dismisses someone at the Lot. If the player has not resolved it after 2 mornings, it leaves on good terms and becomes a **Comes Knocking** candidate (Crew §3.4.D). Nothing is destroyed; the moment stays a win.
- Needs a Crew and director ruling.

**(c) "Posse swap moves a Sentry remotely": real in UX, already solved by Crew.** Crew §3.5.3 **Tail-Up**: outside the Lot, only *Lounging* cats can be called in, posted cats cannot be Tail-Upped, there is a 30 s cooldown, it does not work inside Haru's wall, and Routed cats cannot be brought in. Fix:
- Away from the Lot, the Posse Builder lists posted cats disabled ("On guard at Fish Crates. Change at the Lot.").
- Tail-Up launches from a world verb (D-pad Left/Right in exploration, Issue 1) as a compact portrait-pom picker, not from the pause menu, so the arrival over the High Road is seen.
- Posse editing at home is removed (it currently says "All, read-only except Posse").

### Issue 7 — MAJOR — The wireframes are drawn in the reference's visual language, not ours (hud header; key-screens §1.4, §9.5; art §7)

hud.md's style assumption is "rounded cream panels, **dark-brown ink**, **pill-shaped name tags**, soft cloud-edged balloons". That is the reference screenshot's look: brown name tab, cloud balloon. Art §7.1 rejects it: "no brown name tags, no glossy bubbles, no gradients". The brief's originality rule forbids lifting layouts and compositions. The user's image is a style reference, so we take its *warmth* (cream, rounded, friendly, heavy ink), not its components.

| UX element | Art bible | Fix |
|---|---|---|
| Dark-brown ink and focus ring | Aubergine Ink `#33273B`; focus = Bell-Gold fill, 2-frame squash, paw-pad cursor, thicker outline (§7.2) | Use the art spec |
| Name pill on balloons | Clowder-colour tab with emblem on the speaker side; the tail is three shrinking poms (§7.2) | Use the art spec; no free-standing name pill |
| Rank pips as stacked ear-notches | Claw-mark pips: Tough 1, Captain 2, Boss 3; Great Boss a crown of three ear-shapes (§7.2) | Use claw marks. Ear-notches also collide with the *notched ear* Scar, which is history, not rank |
| Nemesis spiked seat frame | Scribbled storm mark, size following Grudge (§7.6) | Use the storm mark |
| Disabled = dimmed / greyed | Halftone overlay is the only tone and disabled treatment (§7.2); minimum dot pitch 6 px at 720p (§7.7) | Use halftone |
| One cream Posse panel with 4 rows | Posse *plates* (§7.3), bean panels with offset print | Four bean plates stacked by D-pad order. Gestalt: each cat is one closed figure; matches Issue 2.7 |
| Standoff card at bottom centre | Slanted banner slamming into the upper third (§7.2, §13.2) | Upper third. The banner then **shrinks into the top-centre identity ribbon** when the brawl starts: one component, continuous (UX's own One Cat Card rule) |
| Sky Disc (contextual, hidden by default) | Phase dial always shown in exploration (§7.3) | See Issue 9 |
| Turf screen as nodes on lines | Territory: "scent-coloured blobs by district"; framed as the view from the truck roof | One painted terraced-town silhouette per district band (6 cheap painted strips), with Patch scent puffs stamped at fixed positions and wisps for Scent. Diegetic enough to drop the spreadsheet look (UX OQ10) at a fraction of a full painted map's cost |
| Panel opacity 90–100% (UX OQ18) | Flat print; translucency is off-style | **Approved.** Panels are opaque paper. Close OQ18 |
| Lantern Eyes emblem "two lit eyes" (UX) / "crescent eye" (art) | Art's Prowler Style icon is also a crescent eye, and UX's "unaware" mark is a closed-eye crescent | Triple collision. Lantern Eyes = **paired stone-lantern windows**; the Prowler icon keeps the crescent eye; the unaware mark becomes **Zz over closed lids**. I will amend art §4.3 |

### Issue 8 — MAJOR — The home is mostly wordless, but four leaks remain (hud §5.2, §10.4; key-screens §7.4, §9.6)

H1–H4 are pictogram-only, and the street HUD falls away at the wall. That part is right. The leaks:

1. **The pause menu at home opens the Fence Line, Turf and Crew**: text-dense Rival names and numbers laid over the house. Nemesis says "no nemesis information is shown inside Haru's House". Art §7.3 allows only hearts and Sense Icons at home. Fix: at home, pause offers only the **Mikan** tab (hearts, turf goal) and Options. Adopt UX's own purer option (OQ28).
2. **Sound Cues as edge chips at home** put a HUD panel in the home frame. Fix: the twin becomes Mikan's ear-and-head turn (always present) plus an **ear Sense Icon** pom over Mikan pointing at the source. That keeps it inside canon's Sense Icon channel (what a cat perceives).
3. **Murmur Ribbons over humans** are an interpretation layer drawn on a human. They strain Pillar 1 and break art's home rule. Fix: replace them with **tone Sense Icons** over Mikan, authored per vignette from a small fixed set (sun-pom warm, rain-cloud sad, zigzag sharp, bouncing notes laughter). They show what the cat felt, not what the human meant. Offer a "More Sense Icons" setting rather than a separate system.
4. **The Doorstep Morning Sniff** shows Rival portraits and numbers inside the garden wall, where the HUD has already "fallen away". Fix: rule the Doorstep the **single licensed exception**, presented as art §7.3's diegetic stamp cards unrolling from scent wisps. It is the moment the boss hat goes on for the day. Write it into hud §5.2 as an exception, not leave it implied.

Also: the Call Ripple uses Haru Yellow, which art §4.8 bars from UI at full saturation. **I grant it as the single exception**: it is the human reaching into the street. Drawn as Ink-outlined note-poms with the contour as the non-colour carrier. I will add this to the art bible. Coral in Life 9 inherits the exception.

### Issue 9 — MAJOR — The hidden day clock invites the "I missed Dusk" failure UX itself flags (hud E1, OQ2; art §7.3)

A clock that appears only at phase change, in the last 60 s, or while Whisker Sense is held is cat-true. But Pillar 2's curfew trade only works if the player *feels it approaching*. The art bible already designs a dial that reads as sky, not timer: a sun pom over a roofline, no digits. Fix:
- The **phase dial is always visible while roaming**: 48 px at 1080p, top-right.
- It enlarges for 4 s at phase change and in the last 60 s (UX's contextual behaviour kept as emphasis).
- Settings: Always (default) / Contextual / Off.
- Hidden in combat, at home, and while the clock is paused.
- Closes UX WEAK #2. The no-briefing playtest then checks for anxiety, not for missed Dusks.

### Issue 10 — MAJOR — Accessibility is real in intent but half of it is unpromised by Combat (key-screens §9.4, §9.7; Combat CR-20.2)

Real and agreed:
- full-pause Slow Blink;
- hold/toggle;
- Auto-Scrap;
- generous timing;
- longer tells;
- auto lock-on;
- tap-twice charge;
- chord → single button;
- shake, hit-stop and flash sliders;
- telegraph palette;
- damage numbers off;
- the photosensitivity cap.

Listed by UX but absent from Combat:
- Slow Blink at 2%;
- Auto Slow Blink (four triggers);
- Slow Blink on danger;
- combat speed 70/85%;
- Crew initiative;
- wide Pile-On windows;
- hold-to-combo.

Fixes:
- **Cut** Slow Blink 2%: it adds nothing between 5% and full stop.
- **Cut** "Crew initiative": Combat's **Scrap** Tactic already is that feature, set per cat. Point the option at it.
- **Keep as written requests to Combat, marked unagreed**: Auto Slow Blink, combat speed, hold-to-combo. Auto Slow Blink is the single highest-value missing assist.
- Remove "Comprehensive tier" from both headers until `design/accessibility-requirements.md` exists.
- **Key-screens OQ18 is already answered** by art §4.5: each human has a lightness step and a textile motif (Haru plain/round, Sora stripes, Koharu dots, Gran cross-hatch). Cite it and close.
- **One-handed presets** stay paper until tested; the "Right hand moves with the right stick" preset should be prototyped before it is promised.

### Issue 11 — MINOR — Smaller corrections

- **Slow Blink menu with 8 entries** (G14). Keep it one level: Pile-On and Zoomies pinned on top when present, then Moves 1–4. Tactic (West) and Scram (hold View) go in the footer. The three-press path survives.
- **Pile-On prompt position.** Combat says centre-bottom; UX says over the enemy. Use **over the Frazzled enemy**, which is where the eye is, and keep bottom-centre free for accessibility cues.
- **Ambush opener tag.** Combat says a 1 s corner tag; UX says a Target Plate highlight. Use the identity ribbon slamming in (one component).
- **Fence Line access** (needs ruling, see §5). Nemesis says the Doorstep and the Lot only; UX says anywhere. Recommend read-only anywhere on the street (it is information, not management), at the Doorstep and Lot, never in the house. The Lot rule protects *management*; the Fence Line is the screen players should want to open constantly.
- **Field-post confirm copy, Watched/Unwatched**: Territory names. Use them.
- **Hiss cooldown** needs a display: a small hiss-mouth pom on the leader row that refills. UX currently has none.
- **"Turf" vs Territory's "Turf Board"**, and **"Sky Disc" vs art's "phase dial"**: the creative director picks one name each. I recommend "Turf Board" and "phase dial".
- **The Tribute overview's "Last 7 mornings" sparkline** is spreadsheet furniture. Cut it (§5 cut list).
- **Damage-number colour.** Art tints only weakness or crit hits; UX's frames are the non-colour channel. Both stand.
- **Combat's T4 full-screen impact frame** fires on every Tough Rout, so it can exceed art's limit of one full-screen impact frame per second in a 6-Tough fight. Not UX's to fix. Flagged to Combat and Art below.

---

## 4. Cross-doc conflicts

| # | Side A | Side B | Recommended resolution |
|---|---|---|---|
| X1 | hud §9.2: "Slow Blink (open command menu) — South"; "Zoomies — L1 + R1" | Combat CR-2: "Hop — A / Cross"; "Pile-On — L1 + R1 together"; "Slow Blink — R2" | Issue 1 final map. Combat's verbs, UX's conductor logic |
| X2 | key-screens K19: "a solo Pile-On exists (Mikan alone in the dust cloud)" | Combat CR-12.1: "at least two Posse cats are standing" | Combat wins. Move the first Pile-On to Act 3 with the first recruit |
| X3 | Combat CR-21: "Life 2, first Crew cat — Switching, Tactics, Frazzle and Quick Pile-On" | Crew §3.4.D: story recruits, "the first in Life 1" | First recruit at the end of Life 1; switching, Frazzle and Quick Pile-On move with it; Tactics stay in Life 2. **Ruling needed** |
| X4 | key-screens §2.3: Toughs drawn on "crates" | Nemesis R11.3: "the crate row below the wall (the Undermark, one crate per player-held Patch)"; art §7.6: "the five Toughs along the wall" | Toughs on the wall; crates = Humbled residents |
| X5 | key-screens §3.2: "GRUDGE ▮▮▮▮▮▮▮▯▯▯ 72" | Nemesis UI: "Grudge and Regard are shown as moods, never numbers" | 4-step moods; add Regard |
| X6 | hud E4: "a ring gauge for Scent with the number inside" | Territory §11: "never as a number, outside the Turf Board" | Wisps on the street |
| X7 | key-screens §6.3: Posse swap of a posted Sentry "still permitted because Posse swapping is canon-anywhere" | Crew §3.5.3: "posted cats cannot be Tail-Upped" | Crew wins (Issue 6c) |
| X8 | key-screens K15: Recruit unavailable at full Crew, no inline flow | Crew Edge Cases: "Recruit is disabled at cap ... The Lot offers Dismissal first" | One over-cap "gate crate" recruit (Issue 6b). **Ruling needed** |
| X9 | Nemesis R7.1: ears = Nose-Touch acceptance | Crew §3.4.A: ears = Recruit Willingness | Tells split by Verdict preview direction (Issue 5) |
| X10 | key-screens §2.2: Fence Line on View/Tab anywhere, readable at home | Nemesis UI: "opened at the Doorstep and the Lot"; "No nemesis information is shown inside Haru's House" | Street, Doorstep and Lot yes; house never. **Ruling needed** |
| X11 | hud E1: Sky Disc hidden by default | Art §7.3: "Exploration HUD shows only the phase dial" | Always-on small dial (Issue 9) |
| X12 | hud §3: Target Plate screen-anchored top-centre, with Frazzle | Combat UI: enemy bars "over the hard-lock target"; art §7.2: Frazzle "zigzag-edged bar over the enemy" | Frazzle in world, identity ribbon at top (Issue 2.3) |
| X13 | hud C11: Standoff card bottom-centre | Art §13.2: "name-card over the upper third" | Upper third, morphing into the ribbon |
| X14 | hud §7: text floor 26 px at 1080p | Art §7.4: "hard floor 24 (16 px at 720p)"; UX's own handheld floor of 18 px | 28 px at 1080p / 18 px at 720p for all; art bible amended |
| X15 | Combat CR-11.6: Frazzle bonus "displayed as a percentage" | hud C4: "x1.5" numeral; UX OQ12: "could be cut" | Five pips, no number |
| X16 | Territory §3.11 Crew cap: 6/7/8/10/13/18/24 | Crew §3.5.1: "6 / 8 / 10 / 13 / 16 / 20 / 24" | Not UX's, but every Crew header shows it. Territory owns Clout gates (brief §6); Crew adopts Territory's ladder |
| X17 | Combat Game Feel: T4 = "2 ticks, full screen" impact frame, including on any Tough Rout | Art §11.7: "Full-screen impact frames are limited to one per second"; art tiers T0–T4 do not match Combat's T0–T5 | Combat and Art must share one tier table; full-screen impact frames rate-limited to 1/s by the budget arbiter. Flag for Combat and art revisions |
| X18 | Combat CR-2: Whisker Sense usable in combat | hud A10: unavailable in combat | Unavailable. Its in-combat job (prop and Fear highlights) is already done by Slow Blink (Combat UI: "while Whisker Sense held or in Slow Blink"). This frees L2 for Hiss and R2 for the "see" pairing |
| X19 | key-screens §5.4: field-post "after Spraying a Scent Post" | Territory §3.6: only "after a Claim Spray or a won raid defence" | Territory wins |
| X20 | key-screens §7.2: Mikan's Moves "(S) Change" from pause | Crew §3.5.6: Mikan re-slots "at the Lot, at any Sunspot, or at home" | Crew wins. Note "at home" re-slotting must itself be pictogram-only or deferred to the Lot (home veto) |

---

## 5. Needs director ruling

1. **First recruit in Life 1** (X3). Combat CR-21 and Crew §3.4.D must agree; my recommendation puts the Pile-On in hour one.
2. **Over-cap gate-crate recruit** (Issue 6b, X8).
3. **Fence Line access**: street-readable anywhere, never at home (X10).
4. **The Doorstep as the single licensed HUD exception inside the garden wall** (Issue 8.4).
5. **Murmur Ribbons, Music Motes and home Sound Cue chips replaced by tone and ear Sense Icons over Mikan** (Issue 8). This settles UX OQ4, OQ5 and key-screens OQ17 in favour of Pillar 1, at some cost to explicitness for deaf players. Consult deaf and hard-of-hearing players before the vertical slice gate, as UX asks.
6. **The R2 "see" pairing** (Whisker Sense out of combat, Slow Blink in combat). It is a consistency bet; confirm it.
7. **Camera keep-out for HUD rectangles** (Issue 2.1). A Combat and technical-artist change.
8. **Always-visible phase dial** (Issue 9) against UX's contextual default.
9. **Naming**: Turf Board, phase dial, Sky Disc, conductor cue (UX A18).

---

## 6. Cut list

| Cut | Why | Saves |
|---|---|---|
| Command Stub after Life 1 | Hint cards teach; frees the bottom-left corner | Permanent screen area |
| Ally Move callout ribbons (C9) | World text on 64 px cats; the cut-in carries it | 2 text elements in combat |
| Frazzle multiplier numeral | Replaced by 5 pips | One number in a feel-first game |
| Nerve numerals on non-controlled rows (handheld default) | Bars suffice | Panel width |
| Leader row jumping to the top | Breaks D-pad mapping | — |
| D-pad Down "everyone on my target" directive | Shadow Me exists | A binding |
| L1 direct pick inside Slow Blink | Redundant | A rule |
| Right-stick "peek" in exploration | Art camera never nudges; unneeded | A binding and camera work |
| Separate whole-town Fence Line mode | The continuous panorama zoom replaces it | One layout |
| Fence Line header bar and rank labels | Height and lighting carry them | Screenshot clutter |
| "Last 7 mornings" sparkline | Spreadsheet | One widget |
| Slow Blink 2% option | No distinct need | An option |
| "Crew initiative" assist | Combat's Scrap Tactic is that feature | A combat request |
| Murmur Ribbons, Music Motes, home Sound Cue chips | Replaced by tone and ear Sense Icons (pending ruling) | Per-vignette authoring on three systems |
| Posse editing from pause at home | Crew forbids Crew inside the wall | A rule exception |
| Fence Line, Turf and Crew tabs in pause at home | Home veto, Nemesis rule | — |
| Turf node-and-line graph | Replaced by painted terrace strips and scent stamps | The spreadsheet risk (UX OQ10) |

**Splitting key-screens.md into per-screen specs** (UX's own §14.2) should happen in the revision, after these fixes, not before. Splitting first would copy every conflict into six files.

---

## 7. What I will change in my own doc (for the record, not a request to UX)

I will amend the art bible in its own revision pass:
- §7.4: text floor raised to 28 px at 1080p / 18 px at 720p.
- §4.8: the Call Ripple exception for household hues.
- §4.3: Lantern Eyes emblem changed to paired lantern windows.
- §7.6: Fence Line state table extended with Wavering, loot held, intent and Undermark crates.
- Shared tier table with Combat (X17).

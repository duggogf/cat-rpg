# Rivals and the Warner Bros. "Nemesis" patent family: landscape and design-risk note

*Prepared 2026-11-24 for the design team and for patent counsel. Answers the owner's request in `design/reviews/user-comments-2026-11-24.md` (C1): "please check carefully on what is patent on this nemesis system to avoid lawsuits". Covers `design/gdd/nemesis-system.md` (Rivals, slice spec), the Rivals glossary in `design/creative-brief.md` §3, and the owner's new features in comments C1–C5.*

## Changelog

**Owner combat direction M1.1 (2026-11-24).** §8 gains item 6, a one-line watch item: the Team Pile-On's resemblance to Granblue Fantasy Relink's Full Burst. No legal conclusions added or changed.

**v2 (2026-11-24, same day).** Rewritten against the full claim text of all four family documents. The text is saved in `design/legal/claims/`, extracted from Google Patents pages; it was not independently re-checked against the USPTO scans.

- **§3 gap closed.** All 11 independent claims are quoted in full, with an element breakdown for each. The provisional reconstruction is withdrawn.
- **Confirmed: every independent claim in the family requires a *second* non-player character (NPC).** That NPC must change because of the outcome of the player's interaction with a *first* NPC. The open question from v1 §3.1 is answered.
- **New: three claims are broader than '179 claim 1** (§3.6):
  - '540 drops the on-screen output step and accepts "outcomes … meeting a pre-defined condition".
  - '908 drops "oppose": an NPC that merely *interacts* counts. It covers a status change of the first NPC that ripples to a second NPC in a hierarchy.
  - The pending '303 also drops the faction requirement.
- **§4 mapping revised.** The current design's seat refills after a Verdict now map *closely* to '908, where v1 had them as "similar". The recruit stare-down now maps *closely* to '908 and '303, where v1 had it as "similar".
- **§5 guardrails changed:**
  - **G4 rewritten.** The v1 fix ("the boss only barks and animates") is no longer enough, because '908 and '303 claim effects on a second NPC's "control parameters".
  - **G7 moved up to #3.**
  - **G3 and G5 tightened.**
  - **New G8:** cats speak only from their own history.
  - **New G10:** a watch item on Crew-side effects under the pending '303.
  - "Hide the change from the UI" is noted as low value: only '179 has an output element.
- **§7 updated** with claim counts and an ownership note on the 2025–26 Warner Bros. corporate deals.

---

## 1. Disclaimer

**This is not legal advice and reaches no legal conclusion.** It does not say that anything infringes, does not infringe, is valid, is invalid or is "safe". The author is not a lawyer. Claim scope is decided by claim construction: the claims read with the specification and the prosecution history. Only qualified patent counsel can do that.

**Recommendation (blocking):** qualified US patent counsel should review Rivals against these claims before the Rivals scope is locked, and again before any public showing. A public showing includes trailers, store pages, demos, and preview links shared outside the team. This repeats `nemesis-system.md` §6.4, `GDD.md` §20 and `final-assessment.md` item 5.

How to read it:
- **Fact:** taken from the claim text or a cited record.
- **Commentary:** the opinion of a law firm, journalist or developer; labelled.
- **Observation:** this note's design reading; not a legal finding.

---

## 2. Patent facts

| Field | Value | Source / confidence |
|---|---|---|
| Number | **US 10,926,179 B2** ("'179") | Justia; Google Patents. Verified |
| Title | "Nemesis characters, nemesis forts, social vendettas and followers in computer games" | Verified |
| Assignee of record | Warner Bros. Entertainment Inc. | Justia; Google Patents. Current owner: see §7.3 |
| Inventor(s) | Includes Kevin Leslie Stephens (Justia inventor index). Full list not retrieved | Partial |
| Application | US 15/081,732, filed **25 Mar 2016**; published as US 2016/0279522 A1, 29 Sep 2016 | Google Patents family data; Justia |
| Priority | US provisional, **26 Mar 2015** | Google Patents family data |
| Grant | Allowed 23 Oct 2020 after six rejections and revisions; **granted 23 Feb 2021** | Patent Arcade; Finnegan |
| Claims | 36: independent claims 1 (method), 19 (apparatus) and 36 (means-plus-function) | `claims/US10926179B2.txt` |
| Expiry | **Adjusted expiration 11 Aug 2036**: 20 years from filing plus about 139 days of patent term adjustment (inferred), subject to maintenance fees | Google Patents (not a legal analysis); GameSpot, Engadget, TechRadar 2025 |
| Status | "Active" on Google Patents. The 3.5-year fee was due by Aug 2024; the 7.5-year fee is due by Aug 2028 | Counsel to confirm |
| Prosecution | Repeated §103 rejections. The examiner compared *Crusader Kings II* and WB's *Batman: Arkham* games. A §101 issue arose. Claim 1 was amended to require "an interaction between the avatar and the first non-player character" and "automatically oppose avatars" | Patent Arcade; Finnegan; VGC (Hoeg) |
| Territory | US only. No foreign counterparts found (not exhaustive) | Counsel to search WO/EP/JP |

Sources: [Justia](https://patents.justia.com/patent/10926179) · [Google Patents](https://patents.google.com/patent/US10926179B2/en) · [USPTO PDF](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10926179) · [Patent Arcade](https://www.patentarcade.com/2021/02/warner-brothers-granted-patent-for-nemesis-system-from-middle-earth-video-games.html) · [Finnegan](https://www.finnegan.com/en/insights/articles/will-101-be-a-nemesis-to-warner-brothers-patent.html) · [GameSpot 2025](https://www.gamespot.com/articles/monoliths-shadow-of-mordor-nemesis-system-patent-doesnt-expire-for-another-decade/1100-6529722/) · [Engadget 2025](https://www.engadget.com/gaming/shadow-of-mordors-innovative-nemesis-system-is-locked-behind-a-patent-until-2036-195437208.html)

---

## 3. The independent claims, quoted in full, with element breakdowns

The claims are quoted verbatim from `design/legal/claims/`, including the source's typos (marked [sic]). Infringement of a claim generally requires every element of that one claim, literally or by equivalents. Dependent claims add limitations to their parent, so they can only be met where the parent is met: they add exposure but cannot create it alone.

### 3.1 US 10,926,179 B2: claims 1, 19 and 36

> **1.** A method comprising:
> controlling, by a processor, game events in a computer-implemented game, the game events involving an avatar that is operated in response to input from a player, and a first non-player character that is controlled by the processor to respond to and automatically oppose avatars based on first character parameters defined in a computer memory;
> detecting, by the processor, occurrence of a predefined one of the game events involving an interaction between the avatar and the first non-player character;
> changing, by the processor, second character parameters defined in at least one of the computer memory or a second computer memory for control of a second non-player character in the game based on the detecting, wherein the second non-player character is controlled by the processor to respond to and automatically oppose avatars based on the second character parameters defined in the at least one of the computer memory or the second computer memory; and
> outputting, to an output device, an indication of the second character parameters that are changed by the changing.

> **19.** An apparatus for controlling a video game, comprising:
> a processor, a memory coupled to the processor, and a display device coupled to the processor, wherein the memory holds instructions that when executed by the processor, cause the apparatus perform:
> controlling game events in a computer-implemented game, the game events involving an avatar that is operated in response to input from a player, and a first non-player character that is controlled by the processor to respond to and automatically oppose avatars based on a first character parameters [sic] defined in a computer memory;
> detecting occurrence of a predefined one of the game events involving an interaction between the avatar and the first non-player character;
> changing second character parameters defined in at least one of the computer memory or a second computer memory for control of a second non-player character in the game based on the detecting, wherein the second non-player character is controlled by the processor to respond to and automatically oppose avatars based on the second character parameters defined in the at least one of the computer memory or the second computer memory; and
> outputting, to an output device, an indication of the second character parameters that are changed by the changing.

> **36.** A video game apparatus, comprising:
> means for controlling game events in a computer-implemented game, the game events involving an avatar that is operated in response to input from a player, and a first non-player character that is controlled by the processor to respond to and automatically oppose avatars based on first character parameters defined in a computer memory;
> means for detecting occurrence of a predefined one of the game events involving an interaction between the avatar and the first non-player character;
> means for changing second character parameters defined in at least one of the computer memory or a second computer memory for control of a second non-player character in the game based on the detecting, wherein the second non-player character is controlled by the processor to respond to avatars and automatically oppose [sic] based on the second character parameters defined in the at least one of the computer memory or the second computer memory; and
> means for outputting, to an output device, an indication of the second character parameters that are changed by the changing.

| El. | '179 claims 1 / 19 / 36 require | Specific or broad (observation) |
|---|---|---|
| A1 | A player-operated avatar, and a **first NPC that automatically opposes avatars** based on stored parameters | Broad: any game with enemies |
| B1 | Detecting a **predefined game event that is an interaction between the avatar and the first NPC** | Broad, narrowed by amendment |
| C1 | **Changing the parameters of a second NPC** because of that detection; the **second NPC also automatically opposes avatars** | **Specific.** Two NPCs, both hostile, with a causal link |
| D1 | **Outputting an indication of the second NPC's changed parameters** to an output device | Specific to '179. Claim 19 adds a display device. Claim 36 is means-plus-function (35 U.S.C. §112(f)), construed by the structures in the specification (a counsel question) |

**'179 dependent claims (summary):**
- Claim 2: the trigger is **"the avatar death or entry of the avatar into a new zone of play"**.
- Claims 3–4: a change of status in a **faction**, which is a **ranked hierarchy with ranks correlated to power**: a rank change, or entry to or exit from the hierarchy.
- Claims 5–9: faction data sent to **another user's independent game instance**, with tracking of whether that user defeats the highest-ranking member, and benefits or notices sent back.
- Claim 10: a **third NPC's** status changes as a knock-on.
- Claims 11–12: the change is to the second NPC's **appearance, personality trait, ability, a "player interaction score"** (a better chance of beating the player), or a **"power center"** attribute or configuration.
- Claim 13: **dialog selection** based on the event.
- Claims 14–18: the **first NPC also changes** (same menu of changes).
- Claims 20–35 mirror these for the apparatus.

### 3.2 US 11,660,540 B2: claims 1 and 14

> **1.** A method comprising:
> controlling, by at least one processor executing a computer game, one or more interactions between an avatar operated in response to input from a player and a first non-player character controlled by the at least one processor to respond to and automatically oppose the avatar based on first character parameters defined in a computer memory;
> detecting, by the at least one processor, one or more outcomes of the interactions meeting a pre-defined condition;
> changing, by the at least one processor, second character parameters defined in at least one of the computer memory or a second computer memory for control of a second non-player character based on the detecting, wherein the second non-player character is controlled by the processor to respond to and automatically oppose the avatar based on the second character parameters defined in the at least one of the computer memory or the second computer memory; and
> controlling the second non-player character based on the second character parameters that are changed by the changing.

> **14.** An apparatus for controlling a video game, comprising:
> at least one processor, a memory and a display device coupled to the at least one processor, wherein the memory holds instructions that when executed by the processor, cause the apparatus perform:
> controlling in a computer-implemented game one or more interactions between an avatar operated in response to input from a player, and a first non-player character that is controlled by the at least one processor to respond to and automatically oppose the avatar based on first character parameters defined in a computer memory;
> detecting one or more outcomes of the interactions satisfying a pre-defined condition;
> changing second character parameters defined in at least one of the computer memory or a second computer memory for control of a second non-player character based on the detecting, wherein the second non-player character is controlled by the processor to respond to and automatically oppose the avatar based on the second character parameters defined in the at least one of the computer memory or the second computer memory; and
> controlling the second non-player character based on the second character parameters that are changed by the changing.

| El. | '540 claims 1 / 14 require | Compared with '179 claim 1 |
|---|---|---|
| A2 | Interactions between the avatar and a **first NPC that automatically opposes the avatar** | Same |
| B2 | Detecting **outcomes of the interactions meeting a pre-defined condition** | **Broader:** it can be a threshold over several outcomes, not one predefined event |
| C2 | Changing the parameters of a **second NPC that also opposes the avatar** | Same |
| D2 | **Controlling the second NPC** with the changed parameters | **Broader:** no on-screen output is needed. A hidden change that alters behaviour fits |

The dependent claims (2–13, 15–20) repeat the '179 menu: the avatar-death or zone trigger, faction status and ranked hierarchy, a third NPC, other users' instances, the appearance/trait/ability/score/power-center changes, dialog, and a change to the first NPC.

### 3.3 US 12,201,908 B2: claims 1, 13 and 20

> **1.** A method comprising:
> determining, by at least one processor executing a computer game, an outcome of an interaction between an avatar operated in response to input from a player and at least one non-player character member of a faction of non-player characters, wherein the faction comprises a hierarchy of non-player characters and the at least one non-player character is controlled by the at least one processor to respond to and automatically interact with the avatar based at least in part on status of the at least one non-player character in the hierarchy of the faction;
> changing, by the at least one processor, the status of the at least one non-player character in the faction based on the outcome, wherein changing the status affects control parameters for at least one second non-player character in the faction; and
> controlling the second non-player character based on the control parameters after the changing.

> **13.** An apparatus for controlling a video game, comprising:
> at least one processor, a memory and a display device coupled to the at least one processor, wherein the memory holds instructions that when executed by the processor, cause the apparatus to perform:
> determining for the video game an outcome of an interaction between an avatar operated in response to input from a player and at least one non-player character member of a faction of non-player characters, wherein the faction comprises a hierarchy of non-player characters and the at least one non-player character is controlled by the at least one processor to respond to and automatically interact with the avatar based at least in part on status of the at least one non-player character in the hierarchy of the faction;
> changing the status of the at least one non-player character in the faction based on the outcome, wherein changing the status affects control parameters for at least one second non-player character in the faction; and
> controlling the second non-player character based on the control parameters after the changing.

> **20.** A non-transitory computer readable medium holding program instructions that when executed by at least one processor cause an apparatus to perform:
> determining for a video game an outcome of an interaction between an avatar operated in response to input from a player and at least one non-player character member of a faction of non-player characters, wherein the faction comprises a hierarchy of non-player characters and the at least one non-player character is controlled by the at least one processor to respond to and automatically interact with the avatar based at least in part on status of the at least one non-player character in the hierarchy of the faction;
> changing the status of the at least one non-player character in the faction based on the outcome, wherein changing the status affects control parameters for at least one second non-player character in the faction; and
> controlling the second non-player character based on the control parameters after the changing.

| El. | '908 claims 1 / 13 / 20 require | Compared with '179 claim 1 |
|---|---|---|
| A3 | The outcome of an interaction between the avatar and an NPC that is a **member of a faction comprising a hierarchy**. That NPC **automatically interacts with** the avatar **based at least in part on its status in the hierarchy** | **Broader:** "interact", not "oppose", so a neutral, truce or friendly NPC fits. **Narrower:** it needs a faction with a hierarchy, and status-dependent behaviour |
| B3 | **Changing that first NPC's status in the faction** based on the outcome, where the change **affects the control parameters of a second NPC in the faction** | A different route: the first NPC's status change ripples to a second NPC. Only the second NPC needs to be "in the faction"; it need not be hostile |
| C3 | **Controlling the second NPC** with those parameters | No output step needed |

The dependent claims (2–12, 14–19) cover: the avatar-death or zone trigger; the second NPC's own status change; ranks correlated with power (a rank change, or in or out of the ranked hierarchy); a third NPC; other users' instances; the appearance/trait/ability/score/power-center changes; and **"selecting dialog for any non-player character in the faction, based on the outcome"** (claims 12 and 19).

### 3.4 US 2025/0108303 A1 (pending application): claims 37, 44 and 51

These are the published claims of a **pending application**. Claims 1–36 are cancelled. Pending claims are not enforceable as granted claims and may be amended, narrowed or rejected. Counsel should advise on provisional rights under 35 U.S.C. §154(d), which can attach when granted claims are substantially identical to published ones and there is actual notice.

> **37.** A computer-implemented method for controlling a video game, the computer-implemented method comprising:
> receiving, by at least one processor executing a computer game, input from a player to operate an avatar to interact with at least one non-player character, wherein the at least one non-player character is controlled by the at least one processor to respond to and automatically interact with the avatar;
> determining, by the at least one processor, an outcome of the interaction between the avatar and the at least one non-player character;
> changing, by the at least one processor, a status of the at least one non-player character based on the outcome, wherein changing the status affects one or more control parameters for at least one second non-player character; and
> controlling, by the at least one processor, the at least one second non-player character based on the one or more control parameters after the changing.

> **44.** An apparatus for controlling a video game, comprising:
> at least one processor, a memory and a display device coupled to the at least one processor, wherein the memory holds instructions that when executed by the at least one processor, cause the apparatus to perform:
> receiving input from a player to operate an avatar to interact with at least one non-player character, wherein the at least one non-player character is controlled by the at least one processor to respond to and automatically interact with the avatar;
> determining an outcome of the interaction between the avatar and the at least one non-player character;
> changing a status of the at least one non-player character based on the outcome, wherein changing the status affects one or more control parameters for at least one second non-player character; and
> controlling the at least one second non-player character based on the one or more control parameters after the changing.

> **51.** A non-transitory computer readable medium holding program instructions that when executed by at least one processor cause an apparatus to perform:
> receiving input from a player to operate an avatar to interact with at least one non-player character, wherein the at least one non-player character is controlled by the at least one processor to respond to and automatically interact with the avatar;
> determining an outcome of the interaction between the avatar and the at least one non-player character;
> changing a status of the at least one non-player character based on the outcome, wherein changing the status affects one or more control parameters for at least one second non-player character; and
> controlling the at least one second non-player character based on the one or more control parameters after the changing.

| El. | '303 claims 37 / 44 / 51 (pending) require | Compared with '179 claim 1 |
|---|---|---|
| A4 | The player operates an avatar to interact with an NPC that **automatically interacts with** the avatar | **Broader:** no hostility, no faction |
| B4 | Determining the **outcome** of that interaction | Broader: no "predefined" event |
| C4 | **Changing a "status" of that first NPC** based on the outcome, where the change **affects control parameters of a second NPC** | "Status" is undefined. The second NPC need not be hostile or in any faction |
| D4 | **Controlling the second NPC** with those parameters | No output step |

The dependent claims (38–43, 45–50, 52–56) cover: the second NPC's status change; the appearance/trait/ability/score/power-center changes; ranks in a faction hierarchy correlated with power; the avatar-death or zone trigger; and detecting a predefined event and changing the first NPC's parameters.

### 3.5 Union of the independent claims (observation)

Every independent claim in the family, granted or pending, has the same core:

> **the player's avatar interacts with NPC #1 → an outcome or event of that interaction is determined → a *different* NPC #2 has its parameters or control changed because of it (directly, or through NPC #1's status) → NPC #2 is shown or controlled differently.**

**No independent claim covers a change confined to the NPC the player interacted with.** Such changes appear only as add-ons in dependent claims ('179 claims 14–18, '540 claim 13, '303 claims 42–43), on top of a second-NPC change. The family's specific features (two hostile NPCs; a faction hierarchy with status-dependent behaviour; on-screen output; online instances) each appear in some independent claims but not in others.

### 3.6 Claims broader than '179 claim 1, and what that means for us

| Claim | Broader in | What it means for our features (observation) |
|---|---|---|
| **'540 cl. 1/14** | No output step; "outcomes … meeting a pre-defined condition" | Threshold mechanics fit the trigger language: an **anger meter** filling up, **influence reaching full**. Keeping a change off screen gives no distance |
| **'908 cl. 1/13/20** | "interact", not "oppose"; the ripple runs through the first NPC's **status in a faction hierarchy**; no output step | The Clowder (Boss → Captains → Toughs, seats) is a faction with a hierarchy. The following fit the shape closely: **Verdicts that change a cat's status** (Away, Humbled, Crew, stepped down) and so move another cat's seat or behaviour; **a recruit's change of side changing the old boss's behaviour**; **a Nose-Touched boss stepping down**. A truce cat or ally can be the first NPC |
| **'303 cl. 37/44/51 (pending)** | No faction, no hostility, undefined "status" | If granted as published, almost any **cross-NPC reactivity** after a player interaction would fit, Crew-side included (bonds and clashes, loyalty). Pending; the claims may change |

---

## 4. Mapping our design to the elements (risk observations, not conclusions)

Legend:
- **Close:** the design plainly has a mechanic that matches every element of that claim, as written.
- **Similar:** near, with a difference counsel may or may not find meaningful.
- **Absent:** a required element is missing (named).
- **Unclear:** depends on construction.

The first-NPC elements (A1–A4) and the outcome elements (B1–B4) are present for **every** combat-based Rival feature. The question is almost always the second NPC.

| Our feature (source) | '179 (1/19/36) | '540 (1/14) | '908 (1/13/20) | '303 pending (37/44/51) | Reasoning |
|---|---|---|---|---|---|
| Per-cat Memory, Grudge/Regard, Scars, Titles, adaptation, Lick In (GDD §3.5–3.9) | absent (no second NPC) | absent | absent | absent | Changes stay on the cat Mikan fought. This stays true only if no other cat reads them (see the barks row) |
| **Loss promotion with displacement** (GDD §3.10: the victor is promoted, another cat is demoted or "drops to seat 1 with a feud") | **close** | **close** | **close** | **close** | The wipe is an avatar–victor outcome that changes another hostile cat's rank. The Fence Line and Sniff show it ('179 D1). It also fits the "avatar death" trigger of each claim 2, if a Rout or wipe counts as death (a construction question) |
| Loss under the owner's direction (C2: time skips to night, the cat goes home) **with G1** | absent | absent | absent | absent | The victor gets a Title and Memory only; no other cat changes |
| Chase Off / Humble / Recruit **vacate a seat; a Roamer refills it**; the 2nd Chase Off return is **promoted, swapping** (GDD §3.11–3.12) | similar | similar | **close** | **close** | The Verdict changes cat X's status (Away, Humbled, Crew). That moves cat Y into or down a seat, and seat or rank governs behaviour (Keeper role, raids, level). That is the shape of '908 B3 |
| Scheduled wall events (promotion, feud scuffle; GDD §3.12 3c) | absent (B) | absent (B) | absent (no outcome) | absent | Run by the director's schedule, not by an interaction outcome. Becomes similar where a feud was seeded by Mikan's action |
| Raids and escorts: a Grudge-led raid brings escorts; a Chase Off returner brings Stray escorts (GDD §3.11–3.12) | unclear | unclear | absent (Strays are not faction members) | similar | Cat X's state after the player's actions makes other cats (escorts) act |
| Barks citing *another* cat's history ("Buri went soft. I didn't."; backlog gossip-borne Titles) | similar | similar | similar | similar | Cat Y's lines are chosen from what Mikan did to cat X. '908 claims 12/19 recite dialog for any faction NPC, as a dependent claim |
| Old Score; Crew bonds and clashes (creative brief §3.5) | absent (allies do not oppose) | absent | unclear | similar | Only '303 lacks a hostility or faction requirement. A cat the player controls through Tag-In may itself be "an avatar" (construction) |
| **NEW Roster screen**: silhouettes, relationship tags on hover (C1) | absent as display only | absent | absent | absent | Tags that only describe change nothing. Note: the roster or Fence Line *would* serve as '179's output (D1) for any second-NPC change it displays |
| **NEW Recruit vs old boss stare-down**: the boss taunts the defector, which is scared unless its personality resists (C1) | similar | similar | **close** | **close** | Recruiting X changes X's faction status (gang → Crew), and that changes boss Y's behaviour (targeted taunt and stare, X's fear). Under '179/'540, X opposed Mikan when recruited and Y is hostile |
| **NEW Boss anger meter** from "bad acts" on its territory; buffs spent after the next fight (C1) | **close** if gang fights count | **close** | similar | **close** | Routing gang cat X buffs boss Y's combat parameters. The visible meter supplies '179 D1, and a full meter fits '540's "pre-defined condition". If only acts on objects count, the A/B elements (interaction with an NPC) are absent |
| **NEW District influence**: gang fights and spraying shift it; at full influence the boss roams (C3) | similar | similar (threshold) | similar | similar | Fight outcomes with gang cats change the boss's behaviour (roaming), through a district value. Whether a district value or a spawn or patrol state is a "character parameter" or "control parameter" is for counsel |
| **NEW Decay; newcomers challenge; rarely recruits defect** (C3, C5) | absent (B) | absent | absent | unclear | Time-driven. Defection is unclear under '303 if it is driven by the player's treatment of that cat and it changes other cats |
| **NEW Chase Off → later a new procedural boss, mainly on total influence loss** (C4) | unclear | unclear | unclear / similar | unclear / similar | Creating a new NPC may not be "affecting control parameters" of an existing one. It is similar if the Chase Off itself (X's status change) promotes or re-tasks an existing gang cat, or makes the gang behave differently |
| **NEW Nose-Touch**: the boss steps down peacefully and may join fights against its rival (C4) | similar / unclear | similar / unclear | **similar** | **similar** | X's status changes (stepped down, truce). If that re-tasks another gang cat or changes the rival's targeting, it nears '908 B3 and '303 C4. Under '908 the rival must be in X's faction |
| Online forts and vendettas | absent | absent | absent | absent | Single-player. Dependent claims only |

**Pattern (observation):** the riskiest couplings are those where *what Mikan did to one cat, or what that cat became because of it, changes a different cat*. That covers promotion and displacement on loss, seat refills and swaps after a Verdict, the gang-fight → boss anger buff, the boss's reaction to a defector, and gang behaviour after a boss steps down.

---

## 5. Design guardrails (ranked by distance bought per unit of design cost)

Each guardrail targets named elements. None is a clearance; counsel confirms or relaxes them. **Changed vs v1** is marked.

| Rank | Guardrail | Elements | Distance (observation) | Gameplay cost |
|---|---|---|---|---|
| **G1** (unchanged) | **Defeat changes no other cat.** After a loss (C2: night, go home), the victor gets Memory, a Title and Gloat lines only. No promotion, swap, level or feud for anyone. Replace GDD §3.10's promotion block with the Lick In model | Second NPC (C1–C4); the avatar-death dependent claims | **High** | **Low.** The beat "it climbed the wall because it beat me" is lost |
| **G2** (unchanged; now sourced) | **Anger comes from acts on things, not on cats, and touches only the boss.** Fill it only through acts on the boss's posts, food or stash, and fights with the boss itself. Routing gang cats moves influence (G3), never the boss's stats. Anger never changes gang members | A/B (no NPC interaction) and the second NPC | **High.** Matters more because the owner wants the meter visible ('179 D1) and it is a threshold ('540 B2) | **Low to medium** |
| **G3** (was G7; **moved up**) | **No ladder that shifts when one cat's status changes.** A vacated seat is not filled by moving an existing cat up. It stays empty until a **newcomer arrives on the director's schedule** (the owner's C5 "new cats coming to town"). Drop the "2nd return promoted, swapping" rule. Scheduled wall events keep their own timer | '908 B3, '303 C4, '179/'540 C | **Medium to high** | **Medium.** The wall is less of a ladder, but it fits C5 |
| **G4** (**rewritten**) | **The old boss behaves the same whoever is in the Posse.** The defector carries a self-contained "old gang nerves" reaction, triggered by its *own* memory when it sees its former boss (personality may resist). The boss runs its normal intimidation routine for any Posse cat, with no defector-targeted taunt, stare or aggro. *v1 allowed a targeted bark and animation; '908 and '303 claim "control parameters" of the second NPC, and '908 claims 12/19 recite dialog, so that is no longer recommended.* | '908 B3, '303 C4 | **Medium** | **Medium.** The bespoke trash-talk is lost. Alternative: hold the feature for counsel |
| **G5** (**tightened**) | **Influence moves only through territory acts.** Spraying, marking and holding posts move it. Gang fights matter only because gang cats guard posts you then spray. The boss's roaming keys off the district's influence value, never off fight outcomes or a tally of beaten gang cats | '540 B2, '908 B3, '303 C4 | **Medium** (construction-dependent) | **Low to medium.** "Fight to clear, spray to claim" stays readable |
| **G6** (**tightened**, was G5) | **A boss's departure re-tasks nobody.** After Chase Off or Nose-Touch, no existing gang cat is promoted to boss, and gang AI does not change because the boss left. A new boss is a newly generated cat, arriving from influence state and time (total influence loss, days elapsed), with fresh traits and no inheritance from the departed boss | '908 B3, '303 C4 | **Medium** | **Low** |
| **G7** (was G6) | **A Nose-Touch join-in belongs to the joiner.** It comes from a seeded roll at fight start, from a pre-existing relationship tag. The opposing rival's AI, targeting rules, buffs and lines are unchanged: the joiner is treated like any Posse cat | '303 C4; '908 if the rival shares the faction | **Medium** | **Very low** |
| **G8** (**new**) | **Cats speak only from their own history.** Barks and dialog are selected from the speaker's own Memory and relationship tags, never from what Mikan did to another cat. Cut cross-cat references such as "Buri went soft. I didn't." and backlog gossip-borne Titles | Second NPC; dialog dependent claims | **Medium** | **Low to medium.** Some world reactivity is lost |
| **G9** (unchanged) | **Single-player only.** No sharing factions or bosses with other players' games, and no rewards or notices between game instances | Online dependent claims of all four | **High** for that subject | **Zero** today |
| **G10** (**new**, watch item) | **Crew-side effects keyed to the cat itself.** Under the pending '303, a second NPC need not be hostile or in a faction. Keep Crew bonds, clashes and loyalty driven by each cat's own experience and the player's resource actions, not by the player's interactions with a different cat. Revisit when '303's final claims are known | '303 C4 | Unclear (pending) | **Hold.** Do not redesign yet |
| **G11** (revised value) | **A flatter gang.** A gang whose behaviour does not depend on hierarchy status (boss plus peers, no seats driving behaviour) moves away from '908 A3 entirely. Ordering the roster by discovery rather than rank alone buys little | '908 A3; rank dependent claims | Medium vs '908; none vs '303 | **High.** Boss, Captain and Tough identity |
| **G12** (unchanged) | **Naming and communication.** Do not use "Nemesis", "nemesis fort", "vendetta" or "follower" for our systems. Route patent discussion through counsel. Ask counsel how to handle the team's knowledge of the patent (willfulness) | Not a claim element | n/a | **Zero** |

**Top five by value:** G1, G2, G3, G4, G5. G9 is free and already true.

**Low-value lever (new note):** hiding second-NPC changes from the UI defeats only '179's output element. '540, '908 and '303 need no output, and hiding conflicts with the pillar "can the player see it?". It is not recommended as a guardrail.

**Not needed on current claim text:** removing per-cat Memory, Scars, Titles or adaptation. No independent claim covers changes confined to the cat the player fought (§3.5).

---

## 6. What the claims do not appear to cover

Each point is supported by the claim text or by labelled commentary. None is a clearance.

- **Changes confined to the NPC the player interacted with.** Every independent claim requires a second NPC (§3.5). This is fact as to the claim text; how it applies is for counsel.
- **Changes driven only by time or a schedule.** Every independent claim requires an event or outcome of the avatar's interaction with an NPC.
- **Display-only relationship tags, silhouettes and a roster.** No independent claim recites a display of relationships. '179 recites output only of a changed second-NPC parameter.
- **Single-player play.** Online instances appear only in dependent claims.
- **Concepts in the abstract.** Rivals, recurring enemies, procedural names, relationship webs and persistent memory are not claimed as concepts; implementations are judged element by element. **Commentary** (Acer Corner, Columbia Journal of Law & the Arts): patents protect mechanics, not characters or story, and copyright does not protect mechanics.
- **Other games.** Commentary lists Warframe's Liches, *Assassin's Creed Odyssey*, *Path of Exile*'s Betrayal and *XCOM 2: War of the Chosen*. This is not a defence: shipping is not a licence, and post-2015 games are not prior art. Pre-2015 games, including the examiner's *Crusader Kings II* comparison, may interest counsel for validity.
- **Territory and time.** These are US rights only; no counterparts were found. The family ends around mid-2036 (§7).

Commentary on breadth, for context only:
- "So broad as to be absurd": Cat Manning, as reported by VGC, 2021.
- "Eminently challengeable", but only at significant legal cost: Richard Hoeg, VGC opinion.

The patent remains presumed valid.

---

## 7. Related family, litigation and expiry

### 7.1 Family (all claim the 26 Mar 2015 priority; assignee of record Warner Bros. Entertainment Inc.)

| Document | Application / dates | Status | Independent claims |
|---|---|---|---|
| **US 10,926,179 B2** | 15/081,732 · filed 25 Mar 2016 · granted 23 Feb 2021 | Active; adjusted expiry 11 Aug 2036 | 1, 19, 36 (of 36) |
| **US 11,660,540 B2** (pub. US 2021/0245057 A1) | Continuation filed 23 Feb 2021 · granted 30 May 2023 | Granted | 1, 14 (of 20) |
| **US 12,201,908 B2** (pub. US 2024/0115952 A1) | 18/144,798 · filed 8 May 2023 · granted 21 Jan 2025 (one Justia listing says 22 Apr 2025: verify) | Granted | 1, 13, 20 (of 20) |
| **US 2025/0108303 A1** "Systems and methods for controlling non-player characters based on control parameters in video gaming" | 18/978,236 · filed 12 Dec 2024 · published 3 Apr 2025 | **Pending** when last indexed. Current status **not verified**: Google Patents rate-limited this session, and search found no later record | 37, 44, 51 (claims 1–36 cancelled) |

**Observations:**
- The family has broadened step by step: from "oppose + output" ('179), to "outcomes + control" ('540), to "interact + faction ripple" ('908), to "interact + any status ripple" ('303).
- While '303 is pending, new claims can still be pursued on the 2016 specification. Keep Rivals private until counsel has reviewed it, and have counsel watch '303 (and any further continuation filed from it).
- **Expiry:** continuations share the 25 Mar 2016 filing date, so they generally end by about 25 Mar 2036, adjusted by their own term adjustment and any terminal disclaimer. The parent ends on 11 Aug 2036. The effective end of the family is **about mid-2036**, for counsel to confirm.

### 7.2 Litigation and validity challenges

- **None found** in November 2026 searches for lawsuits, IPR, PGR or reexamination. That is not proof that none exist; counsel should search PACER, Docket Navigator and PTAB.
- The validity debate so far is commentary: Finnegan on §101; Hoeg in VGC.

### 7.3 Ownership

- WB closed Monolith on 25 Feb 2025 and kept the patent (Kotaku, Engadget, TechRadar).
- **Fact (news):** Netflix announced a deal for Warner Bros.' studio, streaming and games units in December 2025 (Axios, PBS). A Semafor headline of 26 Feb 2026 reports Netflix walking away, and a Paramount bid was reported. The details were not verified.
- The current owner of all four documents should be checked in the USPTO assignment database.

---

## 8. Recommended next steps

1. **Engage US patent counsel now**, before scope lock and before any showing outside the team. Ask for a claim-by-claim freedom-to-operate review of the slice and of C1–C5.
2. **Send counsel:**
   - this note;
   - `design/legal/claims/` (and ask counsel to verify it against certified copies);
   - `design/gdd/nemesis-system.md` §1–3 and §6.4;
   - `design/creative-brief.md` §3;
   - `design/gdd/territory-management.md`;
   - `design/reviews/user-comments-2026-11-24.md`;
   - the list of guardrails adopted provisionally.
3. **Questions for counsel:**
   - (a) Is a Rout or Posse wipe "avatar death"? Is a cat the player controls through Tag-In "an avatar"?
   - (b) Is a district influence value, or a spawn or patrol state, a "character parameter" or "control parameter"?
   - (c) Is our Clowder a "faction comprising a hierarchy", and is a cat's behaviour "based … on status" in it?
   - (d) Is a newly generated NPC "affected" by another NPC's status change?
   - (e) Does dialog selection alone count as "control parameters"?
   - (f) How does claim 36 (§112(f)) read?
   - (g) What do the prosecution amendments mean for equivalents?
   - (h) What are '303's current status and provisional-rights exposure?
   - (i) Are there foreign counterparts?
   - (j) Who is the current owner, and is a licence realistic?
   - (k) How should the team handle its knowledge of the patent (willfulness), and should it obtain a written opinion?
4. **Design actions now (provisional):**
   - Resolve GDD §3.10 against C2 per G1.
   - Write the anger meter, influence, the stare-down and boss succession per G2–G6 when Territory and Nemesis spec them.
   - Apply G8 to the bark taxonomy.
   - Keep G9 true.
5. **Keep previews private** until counsel clears a showing.
6. **Watch item (originality, not a Nemesis-claim question):** the Team Pile-On (owner combat direction M1.1, `design/reviews/owner-feedback/combat-m1.1-spec.md` §6: all four cats' Specials chained into a team finisher) resembles Granblue Fantasy Relink's Full Burst; our cut-in art and staging are our own; list it for counsel's look.

*Other sources:* [Eastgate IP](https://www.eastgateip.com/warner-brothers-patents-shadow-of-mordors-nemesis-system/) · [VGC news](https://www.videogameschronicle.com/news/warner-bros-receives-criticism-for-patenting-shadow-of-mordors-nemesis-system/) · [VGC, Hoeg](https://www.videogameschronicle.com/features/opinion/is-warners-nemesis-patent-really-gross-im-not-sure-id-go-that-far/) · [Northwestern JTIP](https://jtip.law.northwestern.edu/2026/02/06/protection-v-play-the-paradox-of-video-game-mechanic-patents/) · [Fordham IPLJ](https://fordhamiplj.org/2021/03/04/warner-bros-nemesis-patent-a-nemesis-to-future-gaming-innovation/) · [Kotaku 2025](https://kotaku.com/monolith-productions-middle-earth-nemesis-system-patent-1851766437) · [TechRadar 2025](https://www.techradar.com/gaming/shadow-of-mordors-nemesis-system-will-remain-warner-bros-property-until-2036) · [Acer Corner](https://blog.acer.com/en/discussion/3936/the-nemesis-system-a-brilliant-idea-trapped-by-patents) · [Axios, Dec 2025](https://www.axios.com/2025/12/05/netflix-warner-bros-buy-acquisition) · [Semafor, Feb 2026](https://www.semafor.com/article/02/26/2026/netflix-says-no-thank-you-to-warner-bros-discovery) · [Google Patents US20210245057A1](https://patents.google.com/patent/US20210245057A1) · [USPTO PDF 11,660,540](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11660540) · [USPTO PDF 12,201,908](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12201908) · [Google Patents US20250108303A1](https://patents.google.com/patent/US20250108303A1/en)

# Rivals and the Warner Bros. "Nemesis" patent family: landscape and design-risk note

*Prepared 2026-11-24 for the design team and for patent counsel. Answers the owner's request in `design/reviews/user-comments-2026-11-24.md` (C1): "please check carefully on what is patent on this nemesis system to avoid lawsuits". Covers `design/gdd/nemesis-system.md` (Rivals, slice spec), the Rivals glossary in `design/creative-brief.md` §3, and the owner's new features in comments C1 to C5.*

---

## 1. Disclaimer: read this first

**This is not legal advice, and it reaches no legal conclusion.** It does not say that anything infringes, does not infringe, is valid, is invalid or is "safe". The author is not a lawyer. Patent scope is decided by claim construction, which depends on the full claim text, the specification and the prosecution history, and only qualified patent counsel can do it.

**This note has a known gap, and counsel must close it.** The patent databases (patents.google.com, patents.justia.com) were blocked by this session's network settings. Web search returned only fragments and paraphrases of the claims, never the full official text. So **§3 does not quote the independent claims in full.** It quotes the claim fragments that sources reproduce, says which source each one comes from, and marks every gap. Before anyone relies on the element breakdown, counsel, or an agent run with patents.google.com allowed, must replace §3 with the official claims of **all four** family documents (§7).

**Recommendation (blocking):** qualified US patent counsel should review the Rivals design against the official claims before the Rivals scope is locked, and again before any public showing. A public showing includes trailers, store pages, demos, and preview links shared outside the team. This repeats `nemesis-system.md` §6.4, `GDD.md` §20 and `final-assessment.md` item 5.

How to read it: **Fact** means a statement taken from a primary record, or from a secondary source quoting one, with the source cited. **Commentary** means an opinion of a law firm, journalist or developer, and it is labelled as such. **Observation** means this note's own design reading, which is not a legal finding.

---

## 2. Patent facts

| Field | Value | Source / confidence |
|---|---|---|
| Number | **US 10,926,179 B2** | Justia record; Google Patents (via search). Verified |
| Title | "Nemesis characters, nemesis forts, social vendettas and followers in computer games" | Justia; Google Patents; Patent Arcade. Verified |
| Assignee | Warner Bros. Entertainment Inc. | Justia; Google Patents. Current owner **not verified** (see §7.3) |
| Inventor(s) | Includes Kevin Leslie Stephens (Justia inventor index). Full list not retrieved | Partial |
| Application | US 15/081,732, filed **25 Mar 2016**; published as US 2016/0279522 A1 on 29 Sep 2016 | Google Patents family table; Justia. Verified |
| Priority | US provisional, **26 Mar 2015** (press reports of a "March 2015 filing" refer to this) | Google Patents family data via search. Provisional number not retrieved |
| Allowed / granted | Allowed 23 Oct 2020 after six rejections and revisions; issue notice 3 Feb 2021; **granted 23 Feb 2021** | Patent Arcade; Finnegan; GamesRadar/PC Gamer. Verified |
| Claims | 36 claims (count). Claim 1 is a method; at least one apparatus claim mirrors it | Google Patents extraction (via search); DTF ("36 пунктов"). Independent-claim count **not verified** |
| Expiry | **Adjusted expiration 11 Aug 2036** (20 years from 25 Mar 2016 plus patent term adjustment of about 139 days, inferred from the dates), subject to maintenance fees | Google Patents "anticipated expiration" (Google notes it is not a legal analysis); GameSpot, Engadget, TechRadar 2025. Press figures of "2035" are wrong or approximate |
| Status | "Active" on Google Patents at the time it was indexed | Google Patents (no legal analysis). The 3.5-year fee was due by Aug 2024; the 7.5-year fee is due by Aug 2028. Counsel should confirm |
| Prosecution notes | Repeated §103 obviousness rejections; the examiner compared the system to *Crusader Kings II* and WB's own *Batman: Arkham* games; a §101 (abstract idea) issue arose | Patent Arcade; Finnegan (Lexology/Mondaq reprints); VGC (Hoeg). The file wrapper itself was not read |
| Territory | United States only. **No foreign counterparts found** in the family listings retrieved | Unverified; counsel should search WO, EP and JP |

Sources: [Justia record](https://patents.justia.com/patent/10926179) · [Google Patents US10926179B2](https://patents.google.com/patent/US10926179B2/en) · [USPTO PDF](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10926179) · [Patent Arcade, Feb 2021](https://www.patentarcade.com/2021/02/warner-brothers-granted-patent-for-nemesis-system-from-middle-earth-video-games.html) · [Finnegan, "Will 101 Be a Nemesis to Warner Brothers' Patent?"](https://www.finnegan.com/en/insights/articles/will-101-be-a-nemesis-to-warner-brothers-patent.html) · [GameSpot 2025](https://www.gamespot.com/articles/monoliths-shadow-of-mordor-nemesis-system-patent-doesnt-expire-for-another-decade/1100-6529722/) · [Engadget 2025](https://www.engadget.com/gaming/shadow-of-mordors-innovative-nemesis-system-is-locked-behind-a-patent-until-2036-195437208.html) · [TechRadar 2025](https://www.techradar.com/gaming/shadow-of-mordors-nemesis-system-will-remain-warner-bros-property-until-2036) · [DTF (Russian)](https://dtf.ru/gameindustry/634044-patent-warner-bros-na-sistemu-nemesis-v-detalyah)

---

## 3. The independent claim(s) of US 10,926,179 and their elements

### 3.1 Claim 1: what sources reproduce

**Full text not retrieved (see §1).** Below are the fragments that sources reproduce, in claim order. Text in quotation marks is quoted by the named source. Text in brackets is this note's paraphrase of a source and is **not claim language**.

| # | Fragment | Source |
|---|---|---|
| 1 | "A method comprising: controlling, by at least one processor, game events …" | Google Patents extraction (via search); Patent Arcade says the claim opens "A method comprising" |
| 2 | "… involving an avatar operated by a player and a first non-player character …" that the processor controls "to respond to and automatically oppose avatars based on first character parameters defined in a computer memory" | Google Patents extraction (via search). Patent Arcade reports that "and automatically oppose avatars" was **added by amendment** |
| 3 | "detecting … occurrence of a predefined one of the game events involving an interaction between the avatar and the first non-player character" | Patent Arcade, quoting the amendment, which replaced "occurrence of a predefined game event involving the first non-player character" |
| 4 | [changing parameters of a **second** non-player character in response to that event; the second character also responds to and opposes avatars, based on] "second character parameters defined in at least one of the computer memory" | Google Patents extraction (via search). Patent Arcade: WB "added detail about the second non-player character's parameters". Eastgate IP (commentary): the claims are directed to "adjusting the parameters of a second NPC based on predefined events between a first NPC and a player" |
| 5 | [outputting an indication of the changed character parameters to an output device] | Finnegan's paraphrase of claim 1 (commentary) |

**A discrepancy counsel must resolve.** Finnegan's summary of claim 1 describes *the* NPC's parameters changing because of avatar–NPC interactions, and never mentions a second NPC. Patent Arcade, Eastgate IP, VGC's commentary ("a player-avatar's interaction with an NPC affecting the parameters of a second NPC") and the Google Patents extraction all point to a second NPC. **This matters more than any other open question.** If claim 1 needs a second NPC, an NPC that changes only *itself* after fighting the player (its own Memory, Scars, Grudge) is outside element C below. If it does not, nearly every Rival mechanic sits near the claim.

### 3.2 Element breakdown of claim 1 (provisional)

Infringement of a claim generally requires every element of that claim (the "all-elements" rule, possibly by equivalents). Counsel decides how it applies.

| Element | What it requires (plain words, provisional) | Breadth |
|---|---|---|
| **A** | A computer game in which a processor controls game events involving a **player-operated avatar** and a **first NPC that automatically opposes avatars** based on stored character parameters | **Broad.** Almost any action game with enemies |
| **B** | Detecting a **predefined** game event that is an **interaction between the avatar and that first NPC** | **Broad**, but narrowed by amendment: the trigger must be an avatar–NPC interaction, not just any event involving the NPC |
| **C** | In response, **changing character parameters of a second NPC** that also opposes avatars based on its own stored parameters | **The distinctive element.** The player does something with cat X, and *a different hostile cat* Y changes. Also added by amendment |
| **D** | Outputting or using the change (for example, an indication on an output device, or Y behaving differently later) | Probably broad, but wording unverified |
| **?** | Any further limitation not seen (for example, a required relationship, faction or hierarchy link between the first and second NPC) | **Unknown.** Counsel to check |

### 3.3 Other independent claims

The Google Patents extraction shows an apparatus claim (a processor coupled to memory, with instructions for the same steps) interleaved with claim 1. Apparatus and medium claims usually mirror the method's elements, but **this is unverified**.

### 3.4 Dependent claims: what sources show (unverified summaries)

A dependent claim adds limitations to its parent, so it can only be met where the parent is met. Dependent claims therefore add exposure but cannot create it on their own. Distance has to come from the independent claims.

- The second NPC belongs to a **faction**, described as a **ranked hierarchy of NPCs whose ranks are positively correlated with game-playing power** (Justia, via search).
- Determining a **change of status of the second NPC in the faction** based on the event (the specification, and probably a dependent claim).
- The second NPC's changed parameter is its **rendered appearance, a behavioural personality trait, a game-playing ability, or a player interaction score** (specification language. Whether it is claimed is unverified).
- **Claims 27–28:** sending in-game benefit data to a **separate game instance**, and sending notice that **another user has defeated the highest-ranking member** (the online "nemesis fort" / "social vendetta" features).
- **Promotion for killing the player:** the specification says a soldier "may be promoted for accomplishing some great feat, such as killing the player avatar", and that a killing blow by a nemesis may raise its power level. **In the text retrieved this is in the description, not the claims.** Commentary (Northwestern JTIP) describes the patent's scope as enemies "promoted to a bigger threat after they defeat the player". Treat it as a sensitive area until counsel reads the claims.

---

## 4. Mapping our design to the elements (risk observations, not conclusions)

Legend: **clearly present** = the design plainly has a mechanic matching the element as paraphrased · **similar** = close, with a difference counsel may or may not find meaningful · **absent** = not in the design · **unclear** = depends on claim text or construction.

Elements A, B and D are present for **every** combat-based Rival feature (cats that fight Mikan, with stats; Routs, Ambushes, Verdicts and Sprays logged as events; results shown on screen). The table therefore concentrates on **element C**: does a player interaction with one cat change a *different* hostile cat?

| Our feature (source) | A | B | **C: a second hostile cat changes** | Reasoning |
|---|---|---|---|---|
| Rival Memory, Grudge/Regard, Scars, Titles, adaptation Strengths (GDD §3.5–3.9) | present | present | **absent if C needs a second NPC; clearly present if it does not** | Each change lands on the *same* cat the player fought. This is where the §3.1 discrepancy bites |
| **Loss promotion** (GDD §3.10): the victor of a wipe is promoted, and the cat in its seat is demoted, or "drops to seat 1 with a feud" | present | present (the wipe) | **clearly present** | The wipe is an avatar–victor interaction, and it changes the rank of a *different* hostile cat (the displaced one). It is also the "promotion for defeating the player" theme of the specification (§3.4) |
| **Loss under the new direction** (C2: no game over; time skips to night; the cat goes home) | present | present | **unclear** (depends on whether §3.10 promotion survives) | The new direction does not say what happens to the victor. With Title and Memory only, and no change to any other cat, C is absent for this event |
| Lick In (GDD §3.8.5: Title, no promotion) | present | present | absent | Changes only the cat that flattened Mikan |
| Chase Off: seat vacated, later refilled by a Roamer; 2nd return **promoted one seat** (GDD §3.11, §3.12 3c–3d) | present | present (the Verdict) | **similar** | A Verdict on cat X opens a seat that cat Y fills, or X's promoted return swaps Y down. The night-step delay mediates it, but the causal link remains |
| Humble: seat vacated, refilled (GDD §3.11) | present | present | **similar** | Same chain as Chase Off |
| Director wall events (promotion, feud scuffle) on a schedule (GDD §3.12 3c) | present | **absent** for scheduled events | absent / unclear | Triggered by the schedule, not by an avatar–NPC interaction. Becomes *similar* where a feud was seeded by the player's action |
| Stewing: generates a Roamer with a feud against the player's Friend (GDD §3.12) | present | unclear | **unclear** | The trigger is the *absence* of player events, though the feud references a cat the player befriended |
| Fence Line hierarchy screen, height = rank (GDD §3.13) | — | — | n/a (presentation) | A ranked hierarchy is dependent-claim territory (§3.4). It matters only if A–D are met |
| **NEW Roster screen**: silhouettes until discovered; hover shows relationship tags (Boss, Rival, Cousins) (C1) | — | — | **absent** as display only | Tags that only *describe* relationships change nothing. Risk returns if the relationships drive changes (rows below) |
| **NEW Recruit vs old boss**: the boss trash-talks and stares down the recruit, which gets scared unless its personality resists (C1) | present | present (recruiting cat X was an avatar–X interaction) | **similar** | Two readings. (i) The boss (a hostile cat Y) behaves differently *because* of the player's interaction with X: near C. (ii) The scared party is X, now an *ally*, which does not "oppose avatars": arguably outside C. The design controls which reading applies (G4) |
| **NEW Boss anger meter**: rises each time the player "does something bad" on its territory; grants combat buffs spent after the next fight (C1) | present | **present when the bad act is fighting gang cats; absent when it is spraying or other acts on objects** | **clearly present** for gang fights | Beating gang cat X changes boss Y's combat parameters. **This is the nearest new feature to element C** |
| **NEW District influence**: gang fights and scent-marking raise yours and lower theirs; at full influence the boss starts roaming and can be challenged (C3) | present | present for gang fights; absent for scent-marking | **similar / unclear** | The boss's *availability* changes, mediated by a district variable rather than a character stat. Whether a spawn or patrol state counts as a "character parameter" is a construction question for counsel |
| **NEW Influence decay; challengers arrive; rarely your own recruits defect** (C3, C5) | present | absent (time-driven) | absent / unclear | Time and territory state drive it, not an avatar–NPC event. Defection by followers touches the "followers" subject of the title; continuation claims are unknown (§7) |
| **NEW Chase Off → a new procedurally created boss later appears, mainly when you lose a territory's influence completely** (C4) | present | weak (the chain runs through the territory) | **unclear** | Generating a new hostile cat is arguably not "changing parameters" of an existing one. The risk rises if the new boss's rank or traits are derived from the chased boss's history with the player |
| **NEW Nose-Touch**: the boss steps down peacefully, no fights for weeks; may join your fight against its rival (C4) | present | present | **similar / unclear** | The changed cat (X) stops opposing avatars and becomes an ally. The trigger for joining is a fight with Y, X's rival, a relationship-driven behaviour. Counsel to judge; G6 keeps Y unchanged |
| Online features (forts, vendettas between users) | — | — | **absent** | Single-player; no separate game instances (claims 27–28) |
| Followers by domination (the original's "branding") | — | — | absent | Ours: Recruit for a Bribe after a Verdict |

**The pattern (observation):** the riskiest couplings are the ones where *what the player did to one cat changes a different hostile cat*: loss promotion that displaces another cat, seat-swaps after Verdicts, the gang-fight-to-boss anger buff, and the boss's reaction to a recruit. Changes confined to the cat the player dealt with, display-only relationship tags, and time-driven territory decay sit further from the paraphrased claim 1.

---

## 5. Design guardrails (ranked by distance bought per unit of design cost)

None of these is a clearance. Each aims at a specific element, so that counsel has concrete options. Adopt them provisionally; counsel confirms or relaxes them.

| Rank | Guardrail | Elements | Distance (observation) | Gameplay cost |
|---|---|---|---|---|
| **G1** | **Defeat changes no other cat.** When Mikan loses (C2: time skips to night, the cat goes home), the victor gets Memory, a Title and Gloat lines only. No promotion, no seat swap, no level gain, no demotion or feud for anyone else. Replace GDD §3.10's promotion block with the Lick In model (already Title-only). This is the "Title-only on a loss" lever in GDD §6.4 | C; the specification's promotion-for-killing-the-player theme | **High** | **Low.** It loses "it climbed the wall because it beat me". Smugness, Title and the plaster lines keep the sting |
| **G2** | **Boss anger comes from acts on things, not on cats.** Drive the anger meter only by the player's acts against the boss's *territory objects* (spraying over its posts, raiding its food spots, knocking over its stash) and by fights with the **boss itself**. Fighting gang cats raises *influence* (G3), never the boss's stats. Alternatively, keep gang fights as a trigger, but let anger change the **encounter** (more escorts, a harsher arena hazard) rather than the boss's character parameters | B (no avatar–NPC interaction) or C (no change to a second NPC) | **High** | **Low to medium.** "You hurt my boys" is intuitive, but spraying is already the main provocation |
| **G3** | **Influence is a property of the district; the boss's stats never move with it.** Influence lives on the district or Patch (Territory owns it). Full influence opens a *place and schedule* (the boss's patrol route or Den door), but never changes the boss's level, buffs, traits or rank. Document it as a territory gate, like the existing Den gate | C | **Medium** (construction-dependent) | **Low.** It reads the same to the player |
| **G4** | **Recruit-vs-old-boss affects only the recruit.** Compute a fixed trait on the *recruited* cat at recruitment ("old gang nerves", resisted by personality), which applies when it faces its former boss. The boss's trash-talk and stare are a bark and an animation chosen from the relationship tag, with **no stat change to the boss** | C (the changed NPC is an ally, not an opposing NPC) | **Medium** | **Very low.** The player sees the same scene |
| **G5** | **New bosses arise from time and territory state, not from a Verdict.** Spawn the new procedural boss from district conditions (influence at 0, days elapsed, the challenger schedule), with traits drawn fresh. Never inherit rank, traits or memories from the chased-off boss or from the player's history with it | C; dependent hierarchy claims | **Medium** | **Low.** It slightly weakens the "my Chase Off made this" story |
| **G6** | **Nose-Touch join-ins change only the joiner.** The truce cat may join a fight against its tagged rival (a seeded roll at fight start, from a pre-existing relationship). The opposing rival gets no buff, anger or rank change from it | C | **Medium** | **Very low** |
| **G7** | **Vacancies refill on the director's schedule, not because of the player.** Fill empty seats from Roamers or new cats on the 2–3-night wall-event schedule, without swapping a cat downward. Drop "the 2nd Chase Off return is promoted one seat (swapping)" or make it Title-only | C (weakens the causal link) | **Medium / unclear** | **Medium.** The wall feels less reactive. Keep it visible on the Fence Line |
| **G8** | **Keep it single-player.** No asynchronous or online features: no sharing a boss, fort or vendetta with another player, no "avenge a friend", no rewards sent between game instances | Claims 27–28 and the online subject matter | **High for that subject** | **Zero** today |
| **G9** | **Roster ordered by discovery or district, not by power rank.** Relationship tags stay descriptive. Avoid a single power ladder across all cats. The Fence Line could be unranked (GDD §6.4 lever) | Dependent hierarchy claims only | **Low** (matters only if A–D are met) | **Low to medium.** Rank-as-height is a readable Fence Line idea |
| **G10** | **Naming and communication.** Do not call the system or its parts "Nemesis", "nemesis fort", "vendetta" or "follower" in the game, store copy or marketing (already the rule in GDD header and §6.4). Route patent discussion through counsel. Ask counsel how to handle the team's knowledge of the patent: enhanced damages for *willful* infringement are a recognised risk, which counsel addresses, for example with an opinion | Not a claim element: litigation posture | n/a | **Zero** |

**Top five by value:** G1, G2, G4, G3, G5. G8 is free and already true; keep it true.

Leave alone until counsel asks, because they cost the most and buy unclear distance: removing per-cat Memory, Scars and adaptation. These change only the cat the player fought. They become a concern only if claim 1 turns out not to require a second NPC (§3.1). If so, counsel should advise before any redesign.

---

## 6. What the patent does not appear to own

Each point is supported by the claim structure as sourced, or by labelled commentary. None is a clearance.

- **Concepts in the abstract.** A patent claim covers the specific combination of elements it recites, not an idea. Recurring enemies, rival characters, procedural names, relationship webs, persistent NPC memory and hierarchy screens are not claimed *as concepts*; any implementation is judged element by element against the claims (§3.2). Fact (claim structure), but it is a general rule, not a judgement about any of our features.
- **Changes confined to the NPC the player dealt with** appear to fall outside claim 1's second-NPC element, **if** the sources that report that element are right (§3.1). Unresolved; counsel must check.
- **Purely time-driven or schedule-driven changes** do not involve the avatar–NPC interaction of element B as paraphrased. Observation.
- **Characters, story, art, names and writing** are not patent subject matter. Commentary (Acer blog) notes the patent protects mechanics, not characters or story. Copyright does not protect game mechanics as such (commentary: Columbia Journal of Law & the Arts).
- **Other games with similar systems.** Commentary lists Warframe's Liches, *Assassin's Creed Odyssey*'s mercenaries, *Path of Exile*'s Betrayal and *XCOM 2: War of the Chosen* (KitGuru/GamesRadar coverage), and the examiner compared *Crusader Kings II* and the *Batman: Arkham* games. **Commentary, not a defence:** other games shipping does not mean they were licensed or that they practise the claims, and a game released after 2015 is not prior art. Pre-2015 games may matter to counsel as prior art for a validity analysis.
- **Territory.** US patents are enforceable only in the US. No foreign counterpart was found, but sales into the US are still covered, and the search for counterparts was not exhaustive.
- **Time.** The family expires around 2036 (§7). Until then, these limits apply.

Commentary on breadth, for context only: developers called the patent "so broad as to be absurd" (Cat Manning, reported by VGC and PlayStation LifeStyle, 2021). Richard Hoeg (VGC opinion) called it "eminently challengeable", but only at significant legal cost. The Fordham IPLJ and Northwestern JTIP pieces argue against mechanic patents generally. None of this changes the patent's presumption of validity.

---

## 7. Related family, litigation and expiry

### 7.1 Family (all Warner Bros. Entertainment Inc.; all claim the 26 Mar 2015 priority)

| Document | Application / dates | Status | Claims |
|---|---|---|---|
| US 2016/0279522 A1 → **US 10,926,179 B2** | 15/081,732 · filed 25 Mar 2016 · granted 23 Feb 2021 | Active (Google Patents); adjusted expiry 11 Aug 2036 | 36; §3 |
| US 2021/0245057 A1 → **US 11,660,540 B2** | Continuation filed 23 Feb 2021 · published 12 Aug 2021 · granted 30 May 2023 | Granted; status not checked | 21 in the publication; **claims not retrieved** |
| US 2024/0115952 A1 → **US 12,201,908 B2** | 18/144,798 · filed 8 May 2023 · granted **21 Jan 2025** (Google Patents, Justia; one Justia listing shows 22 Apr 2025: verify) | Granted | **Not retrieved.** Filewrapper (commentary) describes the subject as nemesis characters, followers, nemesis-fort conditions and social vendettas |
| **US 2025/0108303 A1**, retitled "Systems and methods for controlling non-player characters based on control parameters in video gaming" | 18/978,236 · filed 12 Dec 2024 · published 3 Apr 2025 | **Pending** per Google Patents when indexed. Current status unknown | **Not retrieved** |

**Why the pending application matters (observation):** while a continuation is pending, the owner can pursue new claims supported by the 2016 specification, including claims drafted after seeing other games on the market. That is one more reason to keep Rivals private until counsel has reviewed it, and for counsel to watch this application.

**Expiry of the family:** continuations share the 25 Mar 2016 filing date, so they generally expire by about 25 Mar 2036, plus any patent term adjustment of their own and minus any terminal disclaimer. The parent's adjusted date is 11 Aug 2036. Effective end of exposure for the family: **about mid-2036**, to be confirmed by counsel.

### 7.2 Litigation, reexamination, validity challenges

- **None found.** Searches in November 2026 for lawsuits, inter partes review, post-grant review or reexamination involving US 10,926,179 returned nothing. That is not proof that none exist. Counsel should search PACER, Docket Navigator and PTAB.
- The validity debate is commentary only. Finnegan (2021) discusses §101 (abstract idea) vulnerability. Hoeg (VGC) calls it challengeable. The examiner's own *Crusader Kings II* comparison is in the prosecution record.

### 7.3 Ownership and context

- WB closed Monolith Productions on 25 Feb 2025 and kept the patent (fact: Kotaku, Engadget, TechRadar, TweakTown 2025). Press noted that WB could license it (commentary: Richard Hoeg, via GameSpot coverage).
- A blog (Acer Corner) suggests the patent may pass to Netflix's games division following corporate deals. **Unverified.** Counsel should check the USPTO assignment database for the current owner of all four documents.

---

## 8. Recommended next steps

1. **Engage US patent counsel now**, before the Rivals scope locks and before any showing outside the team. Ask for a claim-by-claim freedom-to-operate review of the slice and of features C1–C5.
2. **Send counsel this package:**
   - this note;
   - `design/gdd/nemesis-system.md` (§1–3, §3.10–3.12, §6.4 especially);
   - `design/creative-brief.md` §3 (glossary) and the Rivals pillar;
   - `design/gdd/territory-management.md` (Scent, decay, raids);
   - `design/reviews/user-comments-2026-11-24.md` (C1–C5, the new features);
   - a one-page list of which guardrails (§5) the team has provisionally adopted.
3. **Questions for counsel:**
   - (a) The official independent claims of all four documents, including the pending application.
   - (b) Does claim 1 of '179 require a *second* NPC (§3.1)?
   - (c) Are an NPC's spawn or patrol availability, or a district-level influence value, "character parameters"?
   - (d) Does an NPC that has become an ally still meet "automatically opposes avatars"?
   - (e) What do the prosecution amendments mean for equivalents?
   - (f) Foreign counterparts.
   - (g) Current owner, and whether a licence is realistic.
   - (h) How the team should handle its knowledge of the patent (willfulness), and whether to obtain a written opinion.
   - (i) Whether pre-2015 games are worth a validity look.
4. **Design actions now (provisional):**
   - Resolve the conflict between GDD §3.10 (loss promotion) and C2 (lose → night, go home) in favour of G1.
   - Spec the anger meter, influence and the recruit stare-down per G2–G4 when Territory and Nemesis write them up.
   - Keep G8 true.
5. **Close this note's gap:** allow patents.google.com in the session's network settings (or have counsel supply certified claim copies). Then replace §3 with the official claims and re-run the §4 mapping.
6. **Keep previews private** (the artifact-slice plan already does) until counsel clears a showing.

*Sources not linked inline above:* [Eastgate IP](https://www.eastgateip.com/warner-brothers-patents-shadow-of-mordors-nemesis-system/) · [VGC news](https://www.videogameschronicle.com/news/warner-bros-receives-criticism-for-patenting-shadow-of-mordors-nemesis-system/) · [VGC opinion, Hoeg](https://www.videogameschronicle.com/features/opinion/is-warners-nemesis-patent-really-gross-im-not-sure-id-go-that-far/) · [Northwestern JTIP 2026](https://jtip.law.northwestern.edu/2026/02/06/protection-v-play-the-paradox-of-video-game-mechanic-patents/) · [Fordham IPLJ](https://fordhamiplj.org/2021/03/04/warner-bros-nemesis-patent-a-nemesis-to-future-gaming-innovation/) · [Goodmans IP](https://www.goodmans.ca/insights/post/goodmans-ip-blog/warner-brothers-secures-patent-protection-for-nemesis-system) · [GamesRadar 2021](https://www.gamesradar.com/middle-earth-shadow-of-mordors-nemesis-system-was-patented-by-warner-bros) · [Kotaku 2025](https://kotaku.com/monolith-productions-middle-earth-nemesis-system-patent-1851766437) · [Acer Corner](https://blog.acer.com/en/discussion/3936/the-nemesis-system-a-brilliant-idea-trapped-by-patents) · [Google Patents US20210245057A1](https://patents.google.com/patent/US20210245057A1) · [USPTO PDF 11,660,540](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11660540) · [USPTO PDF 12,201,908](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12201908) · [Google Patents US20250108303A1](https://patents.google.com/patent/US20250108303A1/en) · [KitGuru](https://www.kitguru.net/gaming/matthew-wilson/warner-bros-patents-shadow-of-mordors-nemesis-system/)

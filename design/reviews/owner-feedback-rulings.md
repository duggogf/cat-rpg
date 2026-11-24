# Owner Feedback Rulings (C1–C5), 2026-11-24

*Owner: creative-director · Status: **binding** for the five parallel revisions and the browser showcase slice · Implements `design/reviews/user-comments-2026-11-24.md` (C1–C5) under `design/legal/nemesis-patent-analysis.md` **v2** (full claim text in `design/legal/claims/`; guardrails G1–G12 of v2 §5)*

**Canon order from today:** owner comments C1–C5 → **these rulings (OR-xx)** → `creative-brief.md` v1.5 (updated to match) → round-1 DR-xx and round-2 R1–R5 → final-assessment rulings R-A…R-K → system docs. Where an older ruling disagrees with an OR, the OR wins.

**How to read it.** Each ruling gives:
- the comment it implements;
- the rule, with numbers (tuning starts; the safe ranges are in the owning doc's knobs);
- **the v2 guardrails it respects, and the claim elements it stays away from**;
- the docs that must change.

The owner's three constraints shaped every call: *keep it simple*, *don't over-bloat it*, *good enough to prototype*. Anything bigger goes to Backlog. Personality stays the Crew hook. Combat stays simple and flashy. Territory and the economy are half the game.

**Patent posture.** These rulings rule against the **union of all 11 independent claims** of the family (v2 §3.5), including the pending '303.

**The common core of every independent claim:** the player's avatar interacts with NPC #1 → an outcome of that interaction (an event, a threshold, or a status change of NPC #1) → a **different** NPC #2 has its parameters or control changed.

Element shorthand used below:

| Shorthand | Claims |
|---|---|
| **2nd-NPC element** | '179 C1 · '540 C2 · '908 B3 · '303 C4 |
| **outcome element** | '179 B1 · '540 B2 (thresholds count) · '908 A3 · '303 B4 |
| **output element** | '179 D1 only |

The working rule: **nothing Mikan does to one cat, and nothing that cat becomes because of it, may change a different cat.** A change may land on:
- the cat Mikan dealt with (outside every independent claim, v2 §3.5);
- territory and objects;
- the calendar;
- newly generated cats.

None of this is a legal conclusion or a clearance. **Counsel review before scope lock and before any public showing still blocks** (v2 §1, §8).

---

## 0. The rulings at a glance

| # | Comment | Ruling in one line | v2 guardrails |
|---|---|---|---|
| OR-01 | C2 | A loss ends the day: the clock jumps to Night, the street closes, and Mikan can only walk home to Haru | — |
| OR-02 | C2 | What a loss costs, and what it does to cats: only the victor changes, by Memory, Title and Gloat | G1, G8 |
| OR-03 | C1 | The **Rivals board** replaces the Fence Line: every cat in town, silhouetted until discovered, grouped by district, no rank ladder | G11 (partial), G12 |
| OR-04 | C1 | Relationship tags: six words, four relations, shown on hover only when both cats are discovered; display only | G8 |
| OR-05 | C1 | What each relationship does in play: every effect lands on the cat that holds the tag | G4, G7, G10 |
| OR-06 | C1 | The stare-down becomes **Old Gang Nerves**: the recruit's own memory scares it. The old boss behaves exactly as with anyone | G4, G8 |
| OR-07 | C1 | **Boss anger**: fed only by marking acts on objects, never by fights; it buffs only the Boss; spent after the next real fight | G2 |
| OR-08 | C3 | **District influence**, derived from Patch Scent, which moves **only through territory acts**; it decays for everyone | G5 |
| OR-09 | C3 | Full influence opens the **Boss window**: the Boss roams a three-stop patrol and can be challenged. This replaces the Den gate | G5, G6 |
| OR-10 | C3 | How territory is taken back: raids, challengers, newcomers into empty Patches, turncoats | G3, G6 |
| OR-11 | C3 | Rare recruit betrayal, switched on from Life 2 for posted ex-Rivals only | G10 |
| OR-12 | C4 | The Verdict has three options: **Recruit · Chase Off · Nose-Touch**. All three clear the post, and Mikan sprays to claim | G3, G6, G10 |
| OR-13 | C4 | Nose-Touch: a deterministic gate, a 10-day truce, and a join-in chance against the cat's own Rival | G7, G10 (watch) |
| OR-14 | C4 | Chase Off is final. New cats come from the calendar and territory state, never from the chased cat | G3, G6 |
| OR-15 | C4 | Humble is removed. What replaces each of its jobs; the Nemesis slot (the arc lead is fixed and never re-named) | G1, G3 |
| OR-16 | C5 | **Challengers**: newcomers who come to take a Patch, on a fixed calendar | G3, G5, G6 |
| OR-17 | C5 | The **unified Turf Board**: four zones, one decision a day | — |
| OR-18 | C5 | What we deliberately did not add | G9 |
| OR-19 | all | Ranks are fixed roles, with no seats and no promotions. **Town events** replace wall events. Stewing is cut | G1, G3, G8, G11 |
| OR-20 | all | Event contracts and ownership | — |
| OR-21 | all | Everything these rulings make obsolete (the delete list) | — |

---

## 1. Rulings

### 1.1 C2: losing a fight

#### OR-01 · A loss ends the day *(C2)*

1. **What a loss is** (unchanged): a Posse wipe, meaning every Posse cat is Routed. Scram (`player_fled`) and a Rival fleeing are not losses. Life 1 tutorial fights still cannot be lost.
2. **The clock jumps to Night** (clock = 720, the start of Night), from any phase. If the wipe happens during Night, the clock stays where it is. This applies **before the cat flap too**: in Lives 1–2 the jump stages a "nightfall" (moon-blue light, an empty street) that the player cannot stay out in. It is a sting, not a reward.
3. **The street closes.** After the Gloat, Mikan comes to on the spot. The player walks Mikan home under moonlight, and the **Head Home thread** is drawn at once (≤ 60 s from anywhere). Nothing else works: no encounters, Ambushes, Caterwauls, Rub, Spray, pickups or the Lot. The pause menu and the Rivals board (read-only) stay available. If the player has not reached the wall after **60 s**, the drowsy autopilot walks Mikan home (existing rule).
4. **Home: the Routed Evening.** `HomeArrived(kind = routed)`. Haru is home and waiting. The evening opens with the **plaster beat** (≤ 30 s: she kneels and puts a sticking plaster on Mikan's ear; Narrative stages it). After that, the normal home verbs are open until sleep: Lap, the piano, the daily find. A Keystone due that evening plays in its **Late form**, and a Closing waits for the next morning slot (the same as a `late` arrival). A loss never plays a Closing sooner than walking home would.
5. **Overnight runs as normal.** Tonight's forecast raid auto-resolves at step 2, with no Caterwaul because Mikan is home.

*Docs:* `day-loop.md` §3.1, §3.3, §3.6, §5, AC · `combat-system.md` §3.14 · `dual-story-progression.md` (the Routed Evening) · `hud.md` · `GDD.md` §5, §7 · brief §5.2, §8.

#### OR-02 · What a loss costs, and what it does to cats *(C2; G1, G8)*

| Who | Effect of a loss | Not done |
|---|---|---|
| **The victor** | Gloat (≤ 3 s); a `WON` Memory entry; its Glory Title if it has none. A **Boss** victor is plastered at −10% max Nerve for the rematch (stacks to −30%; existing canon, and it changes only that same cat). A Boss's anger is spent (OR-07) | **No promotion, seat change or level gain. No demotion, feud or swap for any other cat** (G1) |
| **Rival lines next day** | Only the **victor** may cite the loss and Mikan's plaster (`REMATCH_I_WON`, `mikan_plastered`). Other cats do not read it (G8: cats speak only from their own history) | No cat's lines are chosen from what another cat did to Mikan |
| **The Posse** | Heals at step 0. −3 Loyalty per Routed Posse cat at step 1 (Crew, existing; the cat's own experience) | — |
| **Economy** | 20% of the day's field haul is lost (none in Life 1). The Stash is safe. **Tribute is unchanged** | **Mark Over and Snatch are cut.** A loss changes no territory |
| **The day** | No Dusk, so **no Well-Fed**. Bond as for a `late` evening. Night forfeit | — |

*Claim elements avoided:* the wipe is an avatar–victor outcome (the outcome element is present), so **nothing may follow from it on any other cat**: this stays away from the 2nd-NPC element in all four documents, and from the avatar-death dependent claims ('179 cl. 2 and its counterparts).

**The "lose on purpose" exploit stays closed.** Round 1's `rounds` factor made wipe-skipping the best strategy (194 Morsels per minute). These rulings keep it shut:
- Tribute stays invariant to wipes (Territory AC 4 and AC 14 unchanged).
- A wipe is dominated by Settle In (clock ≥ 240, an `on_time` arrival) in every currency. Settle In gives the evening, Bond, Well-Fed and the full haul. A wipe gives a plaster, −20% haul, −3 Loyalty per cat, no Well-Fed and a later clock (Night, not Dusk).
- Influence decays every night whatever you do (OR-08), so a skipped day is one more night of decay.
- **Known residue, accepted (iteration 3):** a wipe before clock 240 ends the outing sooner in *real time* than Settle In can. Its costs are real, and the story's day gates are unchanged.
- **Scram does not spend anger** (OR-07), so "engage the Boss, flee, re-engage calm" is not a free reset.

*Docs:* `nemesis-system.md` §3.5, §3.8 item 6 (plaster lines victor-only), §3.10, §5 · `territory-management.md` §3.7, §4.13 · brief §8.

---

### 1.2 C1: the Rivals board

#### OR-03 · The Rivals board replaces the Fence Line *(C1; G11 partial, G12)*

**Decision: replace, not merge or split.** The owner read the Fence Line as "the district's cats only" (C3) and asked for a Mordor-like **roster of every unique cat** (C1). District information (who holds which Patch, influence) moves to the Turf Board (OR-17). The Fence Line's painted wall art becomes the board's backdrop. Height = rank goes.

**Who is on it.** Every cat that exists in the game state, in sections from left to right, climbing the town:
1. **District sections** (the Lane, the Arcade, Shiosai, the Summit). Each district has its **Boss** on the section's gatepost (a role mark) and its gang in **one row in order of discovery**, then undiscovered silhouettes. In the slice the Lane holds its ≤ 10 tracked cats. The other sections show only their **authored** cats, as silhouettes in haze (Madam Sabi, Oboro, Ikari, Botan; others as Narrative authors them). This is the "climb ahead", not discoverable in the slice.
2. **Outsiders** (a gate after the districts): challengers, newcomers and turncoats.
3. **The Bell fence** (far right): Mikan and every Crew cat.
4. **Legends:** Gone cats (Chased Off) stay in place as a faded card with paw prints leading off the edge.

**Discovered (defined).** A cat is discovered at the first of:
- (a) any encounter with it: a Standoff, a fight, a Rival Ambush, or a join-in;
- (b) a **Whisker Sense sniff**: holding Whisker Sense with the cat on screen within **10 m** for **1.0 s**, which gives a brief scent-outline confirmation;
- (c) Crew are always discovered.

An undiscovered cat shows a flat silhouette, its section, and a crown outline if it is a Boss: no name, tags, pose or traits. Forecast and challenger cards show undiscovered cats as the same silhouette. Discovery emits `CatDiscovered`.

**What a discovered cat shows:** its disposition pose, name, Title, silhouette Scars, the storm mark (the Nemesis), a truce sprig, anger puffs (Bosses only), known Fear and Strength icons, and a "new since last night" tape star. Focus slides up the existing name-card. South opens the Rival card. Access is unchanged from the Fence Line: read-only; View / J on the street, at the Doorstep and at the Lot; never inside the house; unlocks on Life 2 day 1. The **"Last night" replay** shows town events (OR-19).

*Guardrail notes:*
- **G11:** v2 says ordering by discovery "buys little" against '908's faction hierarchy. The real distance comes from OR-19 (no seats, no status changes that ripple). The board is a display. v2 §6 says display-only tags and rosters are outside every independent claim.
- The board **would** serve as '179's output element for any second-NPC change it displayed, so the rule is simply that no such change exists (OR-05 to OR-19).
- **G12:** the UI name is **"Rivals"**. "Nemesis" stays an internal design term. The UI faces are *Sworn Enemy* and *Sworn Rival*. Never "nemesis", "vendetta", "fort" or "follower" in game, store or marketing text.

**Acceptance:** all slice cats (≤ 12 tracked + Crew + 5 uphill silhouettes) fit the 1080p default framing without scrolling. A screenshot with only the Nemesis pill lets 4 of 5 unbriefed viewers say who the Lane's boss is, who hates the player, and which cats they have not met.

*Docs:* `key-screens.md` §1.2, §2 (rewrite as "The Rivals board"), §3 · `nemesis-system.md` §3.13, the new `discovered` field · `hud.md` · `GDD.md` §9, §14 · brief §3.2.

#### OR-04 · Relationship tags *(C1; G8)*

**Display (the owner's rule):** hover a discovered cat (mouse) or focus it (pad), and a small tag appears on **every other discovered cat it relates to**, worded from the hovered cat's point of view. If either cat is undiscovered, nothing shows. Tags are words, never numbers.

| Relation | Tag on the other cat | Stored on | Where it comes from |
|---|---|---|---|
| Gang membership | **Boss** (hovering a member) / **Gang** (hovering the Boss) | Each member (its `clowder`) | Generation. A newcomer joining a gang on the town-event schedule (OR-19) is the only later change |
| NPC rivalry | **Rival** | Both cats, fixed | Authored, or one seeded feud pair per district at prehistory; challengers carry one with p 0.5 (OR-16) |
| Family | **Kin** | Both cats, fixed | Authored, or seeded at generation (p 0.15 per same-district pair, ≤ 1 Kin per cat) |
| Former gang | **Old Boss** (hovering the Crew cat) / **Old Gang** (hovering that Boss) | **Only the recruit**, as a Memory entry `OLD_GANG(boss_id)` | Written when the cat joins the Crew. The Boss's record never changes. Its "Old Gang" tag is derived for display from the recruit's data |

Mikan's own relationship with a cat (Grudge/Regard, truce, Nemesis) is **not** a tag. It stays as the pose, sprig and storm mark.

**Tags never change because of what the player did to another cat.** They are facts fixed at generation, or the recruit's own memory. Showing them changes nothing (v2 §6).

**Slice seeds** (Narrative confirms names and fiction):
- Every Wall Sitter has Daifuku as **Boss**.
- **Rival:** Togemaru ↔ Goma (the gatepost); Kagi ↔ the second Captain.
- **Kin:** Kinako ↔ Sasa (cousins).
- **Old Gang:** **Hige** is authored as an ex–Wall Sitter (the "old wall cat" was Daifuku's once), so his Memory holds `OLD_GANG(daifuku)` from the start. Togemaru and Kagi gain the entry if recruited.

*Docs:* `nemesis-system.md` §3.2 (`relations[]`), §3.3, §3.7 (the `OLD_GANG` kind) · `crew-and-progression.md` §3.3, §3.4.4 · `key-screens.md` §2, §3 · brief §3.1.

#### OR-05 · What each relationship does in play *(C1; G4, G7, G10)*

Every effect lands on **the cat that holds the tag**, never on the other cat:

| Relation | Effect (the whole list) | Owner |
|---|---|---|
| **Boss / Gang** | Says whose influence a Patch counts for (OR-08). That is all. Raid escorts stay untracked **Strays** (outside any faction). A gang member's behaviour never depends on what happened to its Boss, and the Boss's never on what happened to a member | Territory |
| **Old Boss / Old Gang** | **Old Gang Nerves** on the recruit (OR-06) | Nemesis, Combat |
| **Rival** | (1) The **Nose-Touch join-in** (OR-13): the truce cat may join a fight against its Rival. Only the joiner acts. The opposing Rival's AI, targeting, buffs and lines are unchanged (G7). (2) **Feud scuffles** on the town-event calendar (OR-19), never player-triggered | Nemesis, Combat |
| **Kin** | (1) **AI never targets its own Kin.** A Crew cat under AI control will not attack an opponent that is its Kin; the player can still drive it in directly. One `kin` bark, spoken by that cat. (2) Two Kin in the Crew are a **bonded pair** (Crew's matrix) | Combat (AI), Crew |

*Claim elements avoided:* no relationship lets an outcome with cat X alter cat Y (the 2nd-NPC element in all four). The Crew-side effects (Kin bond, join-in) are keyed to the acting cat's own tags. They are watch items under the pending '303 (**G10**), held, not redesigned.

#### OR-06 · Old Gang Nerves (the owner's stare-down) *(C1; G4, G8)*

**The owner asked:** "the boss will talk shit and stare down at the cat you recruited, making it scared (unless their personality are against it)."

**The collision:** v2 G4 is rewritten because '908 and '303 claim effects on a second NPC's "control parameters", and '908 claims 12/19 recite dialog. A boss that singles out its ex-member is a second NPC whose behaviour changed because of the recruitment, which is an outcome of Mikan's interaction with the member. That is near '908 B3 and '303 C4.

**The version that keeps the owner's moment:** the fear comes entirely from the **recruit's own memory**, and the old boss behaves exactly as it would with any Posse.

1. **At recruitment** (any Crew join, including authored Hige), the recruit's Memory gains `OLD_GANG(boss_id)`, and Nemesis sets `old_gang_nerves` = **true** unless the cat's personality resists. **Resist: Braggart** (too proud), **Stalwart** (steady), **Brooder** (it hates the old boss more than it fears it). **Susceptible: Schemer, Fraidy, Goofball.**
2. **In an encounter** where the recruit is in the Posse and it **sees** its Old Boss among the opponents (at the start, or in a wave), the recruit's *own* reaction plays at the Standoff: ears flat, a flinch, and its own line from its own memory ("…That's Daifuku's wall."). **The Old Boss runs its ordinary Standoff taunt and intimidation for whatever Posse it faces.** It has no defector-targeted taunt, stare, aggro or line, and its parameters never read who is in the Posse.
3. **If `old_gang_nerves` is true** and the recruit's Loyalty is below Sworn (< 80), the recruit is **Cowed** (Combat's existing status) for **20 s** (Fraidy **30 s**). While Cowed, its AI will not target the Old Boss. **A Tag-In to that cat clears it at once** with a "steeled" bark: that is the player's answer, a conducting moment.
4. **Resisting cats** play a defiant line of their own ("Not your cat anymore."). There is no status.
5. In the slice, **Hige** (Stalwart) and **Togemaru** (Braggart) resist, and **Kagi** (Schemer) is susceptible, so the Daifuku fight shows both halves.

**What the owner gives up:** the *boss's* bespoke trash-talk aimed at the defector. The player still sees an old boss on the wall and a recruit who flinches at the sight of it. **Held for counsel:** if counsel clears a defector-targeted boss bark, it can be restored as a line-only addition.

*Claim elements avoided:* the 2nd-NPC element ('908 B3, '303 C4; '179/'540 C). The only cat whose parameters change is the recruit: by its own memory, after it has stopped opposing the avatar.

*Docs:* `nemesis-system.md` §3.2, §3.7, §3.15 (recruit-voiced `old_gang` and `steeled` tags; no boss-voiced defector tag) · `combat-system.md` (Cowed at fight start; Tag-In clears it; AI target exclusion) · `crew-and-progression.md` §3.4.4, the Crew card stamp · `key-screens.md` §3, §6.2.

#### OR-07 · Boss anger *(C1; G2)*

**The owner asked:** show "how angry they are every time you do something bad on its territory", with a combat buff "expensed after a fight, whether you lose or not."

**Why the sources matter:** v2 notes the meter is visible ('179's output element) and is a threshold ('540 B2). So anger must have **no avatar–NPC interaction as a source**, and it must **change only the Boss**.

| | Rule |
|---|---|
| **Who has it** | District **Bosses** only (the slice: Daifuku), until the Boss has been Verdicted |
| **Scale** | 0–100, stored. **Shown as 0–3 steam puffs** on the Rivals board and the name-card. Never a number (a feeling, R3) |
| **Sources** (marking acts on objects in the Boss's district) | Over-mark a rival Rub Mark **+5** · Counter-Spray a rival post **+15** |
| **Never a source** | **Fighting or Routing any cat**, gang or Boss. **Claim Spray** (it follows a Verdict on a Keeper, so it is conditioned on a fight outcome). Spraying your own posts. The influence value |
| **Decay** | **−15 per night** (Nemesis step 3) |
| **Stages** | Calm 0–29 · Riled 30–59 · Seething 60–89 · Furious 90–100 |
| **The buff** (the Boss only) | At the start of a fight with that Boss: **Fired Up** (existing status) for **20 s** when Riled, **40 s** when Seething, **the whole fight** when Furious |
| **Spent** | Reset to 0 at `EncounterEnded` of any fight the Boss took part in with outcome **win, loss or `rival_fled`**. **Not on Scram** |
| **Shown** | The puffs; one Sniff item at Seething or Furious ("The big wall is seething."); the Boss's own Standoff line about its own posts |
| **Touches nobody else** | Gang members' parameters, spawns, escorts and lines never read anger |

**What this does to play:** quiet erosion (Rubs) keeps the Boss Calm, and loud Counter-Sprays bring a Furious Boss to the window. Territory's existing sneak-versus-loud choice now also sets how hard the Boss hits. The rematch meets a Calm Boss at −10% Nerve: the owner's "spent whether you lose or not."

*Claim elements avoided:* the outcome element (the sources are acts on objects, with no NPC interaction) and the 2nd-NPC element (only the Boss changes). This is stricter than v2 G2, which would allow fights with the Boss itself as a source; we do not need them.

*Docs:* `nemesis-system.md` (new § Boss anger, F-anger, step 3) · `combat-system.md` (Fired Up at fight start) · `territory-management.md` (marking acts carry a district id) · `key-screens.md` §2, §3 · brief §3.3, §8.

---

### 1.3 C3: district influence

#### OR-08 · District influence *(C3; G5)*

**Decision: per district, derived from per-Patch Scent.** Per-Patch Scent stays the only stored territory number (balanced, simmed, and it drives Tribute, raids, wisps and the Spray prompt). **Influence is a read-out per district**, owned by Territory, so there is no second number to decay or balance.

```
I(c, d) = round( 100 × Σ_{p ∈ outer(d), owner(p) = c}  min(scent_p, 60) / 60  ÷  n_outer(d) )
```

- **Scale 0–100.** In the Lane, `n_outer` = 4 (Low Wall Corner, Laundry Pole Yard, Persimmon Alley, Tofu Shop Step; the Den is the Boss's seat), so **each outer Patch held at Strong (≥ 60) is worth 25**. Below Strong, a Patch is worth `scent/60` of its share. Open Patches count for nobody.
- One idea for the player: **keep your posts Strong.** The bar drops exactly when a post's wisps thin and the Spray prompt appears.
- **Shown** as one tug-of-war bar per district: bell gold from the left, the gang's colour from the right, outsiders after it, the Open gap between, and the **Boss's crown at the full end**. The % appears **only in the Turf Board header**. The street shows wisps only.

**What moves Scent, and so influence: territory acts, NPC raids and time only (G5).** The owner's "you fight with every gang… and pee on the territory" keeps its shape as **"fight to clear, spray to claim"**: fights matter because gang cats guard the posts you then spray.

| Moves it | Effect |
|---|---|
| Claim Spray a post with **no Keeper** | yours at 70 (+25) |
| Rescue Spray your own post (offered only below 60) | → 90 |
| Over-mark a rival Rub Mark / Counter-Spray a rival post | rival −10 / −30 |
| Overnight raid result (NPCs against your Sentry, by formula) | Repelled −5 · Scuffed −20 · Lost: flips to the attacker at 40 |
| Challenger over-mark (an NPC act on the post) | −10 a night |
| Decay and refresh | Below |

**Cut, because a fight outcome would move influence:**
- "Rout a rival cat inside the Patch −15 each".
- "A Posse wipe during a contest gives the rival +30".
- The live Caterwaul's "+10 in person instead of −5". It becomes the **presence rule**: if Mikan reaches the Patch within the Caterwaul window, the raid resolves by the normal formula with the Sentry term ×1.5 (Mikan counts as an Unwatched Patch's guard). **Whatever happens in the brawl.** Showing up is a territory act; who wins the scrap affects only the cats in it (the Verdict on the raid leader, Memory). Territory tunes the presence term so a guarded post usually holds. Ignoring a Caterwaul is still never worse than being asleep.
- The Keeper still comes when the rival post falls to **≤ 30** through marking, at the next moment no encounter is running. Its arrival keys off Scent only, never off which wave cats were beaten.

**Decay, for everyone including you:**
- **Your Scent:** −10 a night, +2 per rival-held neighbour; ×0.5 on Home Ground (floor 10) and with a posted Brooder. Sentry refresh +10 (Crier +14).
- **A gang's Scent recovers** +8 a night up to its ceiling (outer 80). Your erosion fades, so your influence in that district goes down.
- In influence terms: a post Sprayed to 90 and left Unwatched holds its full 25 for three nights, then loses ≈ 4 a night until it lapses on the ninth night. Home Ground never gives less than 4, so **the Lane's influence never reaches 0**.

**Worked example (Life 2 day 3 evening):** Low Wall Corner 80, Laundry Pole Yard 66, Persimmon Alley 48, Tofu Shop Step 70 (just claimed) → 25 + 25 + 20 + 25 = **95**. Spray Persimmon Alley to 90 → **100: full influence** (OR-09).

*Claim elements avoided:* the outcome element for anything influence drives ('540 B2's "outcomes … meeting a pre-defined condition" included). No avatar–NPC outcome feeds the value.

*Docs:* `territory-management.md` §1, §3.2–3.4, §3.8, §4 (new Influence §), §6, §7, §8 · `GDD.md` §10 · brief §3.2, §8.

#### OR-09 · Full influence opens the Boss window *(C3; G5, G6)*

This **replaces the Den gate** (3 of 4 outer Patches held) and the Den-Open rule.

1. **Opening.** When Mikan's influence reaches **100** (checked after any Scent change, and at step 2), the district's **Boss starts to roam**. A yowl rolls down from his wall, he climbs down, and the Sniff and Turf Board say so. `BossWindowChanged(district, open = true)`. The trigger is the district value alone, never a fight outcome or a count of beaten cats (G5).
2. **The patrol.** The Boss walks a fixed **three-stop patrol**, one stop per daytime phase, staying at the last through Night. Each stop is one **arena kit**: a wall segment with a knock-off edge and a water prop, so "knock him off into the bucket" holds wherever you find him. **Slice:** Daifuku, who now "never comes down off the walls":
   - Morning: Laundry Pole Yard's yard wall (wash tub).
   - Day: Tofu Shop's back wall (rain barrel).
   - Dusk and Night: the Den corner stone (the bucket).

   The current stop shows on the Turf Board map and as a crown tick on the Whisker Sense compass.
3. **Challenging.** Approach within 8 m of a stop for a Standoff, then the Boss fight there (Combat's 3-phase design, played on the kit). Before the window opens, the Boss stays at the Den and ignores Mikan ("Come back when the Lane smells of you, Collar."). The Den post cannot be marked.
4. **Closing (hysteresis).** The window stays open while influence is **≥ 75** at step 2. Below that, he returns to the Den.
5. **While the window is open, held outer Patches cannot be Lost** (Lost becomes Scuffed).
6. **Claiming.** Rout the Boss, give any Verdict (OR-12), then **Claim Spray the Den post** (the corner stone; a highlighted Head Home–style thread leads there): `DistrictClaimed`. Fight to clear, spray to claim, same as every Patch. The turf goal is met and Clout becomes Boss.
7. **The Boss's departure re-tasks nobody (G6).** After the Verdict, no gang cat is promoted, given the Den, or behaves differently. The gang stays seated as it was. The raid fallback is the gang's, not the Boss's (OR-19), so it does not change either. Any future new Boss is a newly generated cat arriving from territory state and time (Backlog: the full-game Usurper rule).
8. **G5:** the window opens a **place and a schedule** only. The Boss's level, stats, traits and rank never read influence. His only buff is anger, which is a separate store fed by objects.

*Claim elements avoided:* '540 B2 (the threshold is reached by territory acts, not by interaction outcomes) and the 2nd-NPC element after a Boss Verdict ('908 B3, '303 C4).

**Pacing impact (Day Loop to re-measure):** the gate is now **all four outer Patches Strong at once**, stricter than "any three held". On the reference path the window opens on Life 2 day 4 after rescue Sprays (the Daifuku attempt day), and the claim stays on Life 2 day 5.

*Docs:* `territory-management.md` §3.5, §3.7, §4.13, §5, AC 9 · `nemesis-system.md` (Boss patrol placement; Daifuku edge cases) · `combat-system.md` §3.13 (any stop, arena kit) · `day-loop.md` §3.7, §3.10–3.11 · `key-screens.md` §5 · level (two extra kit stops) · brief §4.

#### OR-10 · How other cats take territory back *(C3; G3, G6)*

| Route | Trigger | Result |
|---|---|---|
| **Raid** (existing) | One forecast raid per district per night | Repelled / Scuffed / Lost. No Lost if the Patch is Strong, Home Ground, or the window is open |
| **Challenger** (OR-16) | A fixed calendar, or a truce that ended | Stakes a held Patch; may take it |
| **Newcomer** | A Patch with **no Keeper** (it lapsed to 0, or was cleared by a Verdict and not Claim Sprayed) is still keeperless on a **town-event night** (OR-19) | A **freshly generated newcomer** becomes its Keeper at rival Scent 60, with traits drawn fresh. **Never an existing cat moved in** (G3). This is the owner's "a new character will be created and own that place" |
| **Turncoat** (OR-11) | Loyalty state over time | Takes the Patch it guarded |

A Lost or squatted Patch is retaken by the existing **Stale Claim** Standoff with its Keeper, then a Claim Spray.

*Claim elements avoided:* '908 B3 and '303 C4. A vacancy waits for the calendar and is filled only by a new cat, so no Verdict ripples into an existing cat's status.

*Docs:* `territory-management.md` §3.7, §5 · `nemesis-system.md` §3.12 (refills → newcomers only, on the town-event schedule; NS-18's Roamer rule deleted) · brief §5.3.

#### OR-11 · Rare recruit betrayal *(C3; G10)*

Betrayal was locked until Life 3. **It is switched on from Life 2**, kept narrow, and driven by the cat's own Loyalty over time:
1. **Eligible:** only **ex-Rival recruits**, **only while posted as a Sentry**, only at **Shifty** Loyalty (< 30; a Schemer < 35) at step 1. Story recruits and the Friend Stray never betray.
2. **Warning:** two consecutive mornings of **Wavering**: a Sniff item, a turned-away pose on the Turf Board and the Rivals board, and a Turf Board line saying what fixes it.
3. **Defection:** if the cat is still eligible on the **third night**, `BetrayalTriggered`. It leaves the Crew and becomes the **Keeper of the Patch it guarded** at rival Scent 40, shown in the Outsiders section. Never Low Wall Corner or the Den.
4. **Cancelled by** un-posting it, moving it to the Posse, or its Loyalty reaching 30+.
5. **Rate:** 0% of reference-policy slice runs; ≤ 10% under a neglect policy (simulated).

*Guardrail note:* this is time- and state-driven, and it changes only the defecting cat. Its Loyalty inputs are the player's resource actions and the cat's own experience (G10). Crew should check that no Loyalty input it feeds is "Mikan's Verdict on a different cat" (see OR-12).

*Docs:* `crew-and-progression.md` §3.7.4, F7 · `nemesis-system.md` §3.12 3a, §3.14 · `territory-management.md` §5 · `key-screens.md` §5, §6 · brief §8.

---

### 1.4 C4: the Verdict

#### OR-12 · Three Verdicts *(C4; G3, G6, G10)*

**One full Verdict per fight** for the highest-ranked Routed tracked Rival (unchanged); the others slip away. The clock pauses, with no timer and no default. **All three options clear the post:** the Keeper leaves, and **Claim Spray** is offered at once (yours at 70). Nothing else in the district changes: no cat moves up, in or over (G3, G6).

| Verdict (compass) | Available | The cat | Grudge / Regard | Later |
|---|---|---|---|---|
| **Recruit** (Right) | The gate is unchanged (Grudge < 90 or Regard ≥ 50; slice-recruitable; room or "make room"). **The declared Nemesis may now be recruited** (OR-15) | Joins with Memory, Scars, Title, Fear and personality; its Strength becomes its perk; its Memory gains `OLD_GANG` (OR-06) | rout items, then halved / +10 | Costs a **Bribe** (free in Life 1) and a slot. May betray if neglected on a post (OR-11) |
| **Chase Off** (Left) | Always | **Gone for good** (OR-14) | — | Never returns. Empty places wait for newcomers |
| **Nose-Touch** (Up) | Deterministic gate (OR-13) | Steps down peacefully: a **10-day truce**, then a Friend or a rematch | set to 0 / +25 | May **join Mikan's fights against its own Rival** |

**The compass loses its Down card.** The three cards fan Left, Up and Right. Tells: **tail** (lashing = Nose-Touch closed); **eyes and lean** (the Bribe band); **Mikan turns away** (Chase Off).

**Why none dominates:**
- **Recruit** is the only option that adds a fighter, and the only one that costs Morsels and a slot.
- **Chase Off** is free and final: you lose the cat as a future ally, recruit or story, and a stranger eventually fills the gap.
- **Nose-Touch** is free but earned (by clean play) and deferred (a possible rematch in 10 days).

Acceptance: no Verdict exceeds 60% of all Verdicts, and ≥ 70% of testers use ≥ 2 of the three.

**Crew reactions (G10):** no *new* Crew reaction is keyed to a Verdict on another cat. The Stalwart's "dislikes Mikan Humbling" goes with Humble. Its new dislike is keyed to its own experience: **a Scuffed or Lost night on its own post, −3** ("it failed the line"). The Schemer's existing "dislikes Nose-Touch Verdicts" is a **'303 watch item**, held, not redesigned (v2 G10: "do not redesign yet").

**Botan** (full game): Nose-Touch only; the hand-bell calls her home.

*Docs:* `nemesis-system.md` §3.11, §3.5, §5 · `key-screens.md` §4 · `territory-management.md` §3.4 step 5, §3.13, §5 · `crew-and-progression.md` §3.2.1, F7 · `GDD.md` §9 · brief §3.3, §3.5, §4, §7.

#### OR-13 · Nose-Touch: gate, truce, join-in *(C4; G7; G10 watch)*

1. **Gate (deterministic; F4's roll and snubs are cut):** Nose-Touch is offered when the cat's own pending Grudge (after the rout items, F1) is **below 50 + its personality shift**: Stalwart +15 · Goofball +10 · Fraidy +5 · Schemer 0 · Brooder −5 · Braggart −5. Otherwise the card is halftoned: "Tail lashing. Not today." *Check:* Togemaru on Life 1 day 2 after a clean Pile-On has pending Grudge 43 against his gate of 45, so the option is open.
2. **Effect:** Grudge 0, Regard +25. The cat **steps down**: it leaves its post (Claim Spray it) and roams its district in `Truce`, non-hostile, with a truce sprig. **No other cat takes its post or changes role** (G6).
3. **Truce: 10 in-game days** (range 7–14). During the truce the cat is never a raid requester, never an Ambusher, and never in a group hostile to Mikan.
4. **Join-in.** At `EncounterStarted`, from Life 2, for each truce cat or Friend in the same district where an opponent in the encounter is tagged its **Rival**:
   `p_join = 0.35 + 0.15·[encounter on or adjacent to its old Patch] + 0.15·[Regard ≥ 75]`, cap **0.65**, seeded per encounter.
   - ≤ 1 joiner per encounter; ≤ 1 join per cat per day.
   - It arrives after a 3 s yowl as an **allied AI guest**: not controllable, no Pile-On, counts toward the 10-cat cap (raid-defence guest rules).
   - If the Posse wins, the **joiner** gains +5 Regard. A join counts as an encounter for the arc.
   - **The opposing Rival is untouched:** the same AI, targeting, buffs and lines as if the joiner were any Posse cat (G7). It has no "traitor" bark.
5. **After the truce:** Regard ≥ 75 → a **Friend** for good (never hostile; the join-in continues). Otherwise it becomes a **challenger** for its old Patch (OR-16, origin `truce_end`) on the next free calendar slot. This is driven by time and the cat's own Regard.
6. **On a Boss:** see OR-09.

*Claim elements avoided:* the 2nd-NPC element (the joiner changes itself; the Rival is unchanged). **Watch item:** under the pending '303 (no hostility or faction needed), an ally joining because of its own earlier truce is a Crew-side effect counsel should look at (v2 G10). It is held for counsel, not redesigned.

*Docs:* `nemesis-system.md` §3.4, §3.11, F4 (rewritten as the gate), new F-join · `combat-system.md` (ally guest) · `key-screens.md` §4 · brief §3.3, §3.5, §8.

#### OR-14 · Chase Off is final; new cats from the calendar *(C4; G3, G6)*

1. **Chase Off makes the cat `Gone`:** it leaves Yunagi for good and keeps a legend card. There is **no comeback**. Deleted: Away, F5, the Away cap, escorts → promoted → the Grand Standoff, `chased_count`, Twice-Chased.
2. **New cats** (the owner's "over time, new boss may appear, mainly when you lose influence over some of your territory completely"):
   - **(a) Newcomers into keeperless Patches** on town-event nights (OR-10). This fires exactly when Mikan lets a Patch lapse.
   - **(b) Empty seats** wait for the same calendar and are filled only by newcomers.
   - **(c) Challengers** on their own calendar (OR-16).
3. **Fresh, always:** a newcomer's traits, personality, rank and Memory are drawn fresh. Nothing is inherited from, scaled by, or chosen because of the chased cat or Mikan's history with it. Existing cats are never moved up or into the gap (G3, G6).
4. **Adaptation stays, re-triggered:** with no comebacks or promotions, a cat adapts **the night after an encounter in which it was Routed but not Verdicted (it slipped away), or fled**. It changes only that cat, which v2 §5 says needs no change.
5. **Life 1 day 1:** Togemaru's first encounter always ends `rival_fled`. His flee at 25% cannot be interrupted on that day ("faster than a kitten"), so the first Verdict is always day 2's, after his memory line.

*Claim elements avoided:* '908 B3 and '303 C4 (Chase Off changes X's status; no second cat's status or control follows).

*Docs:* `nemesis-system.md` §3.2, §3.8, §3.9, §3.11, §3.12, F5 (delete), §5 · `combat-system.md` §3.14 · `GDD.md` §9 · brief §3.3, §7.

#### OR-15 · Humble is removed: what replaces it; the Nemesis slot *(C4; G1, G3)*

| Humble did | Now |
|---|---|
| A paid option (+15% Tribute, +25% with a Goofball) | **Dropped.** Recruit is the Morsel-spending option. The Tribute anchor is re-simmed without it |
| Gave Sentries a reason to guard (the simmer) | **Challengers** and **visible influence decay** |
| The `uprising` raid and Restless warnings | **Deleted**; challengers supply the pressure |
| The Goofball's guard perk | **"Laughs off a challenge":** a challenger staking the Goofball's Patch over-marks **0** instead of −10 a night. The Goofball keeps its `grudge` counter |
| The Stalwart's dislike (Mikan Humbling) | **A Scuffed or Lost night on its own post, −3** (OR-12) |
| Kept the arc lead around (the crate challenge) | **Nose-Touch** keeps the lead |

**The Nemesis slot (amends A-6 and R-B):**
1. **The arc lead is fixed: Togemaru, the First Thorn, for all of Lives 1–2. He is never re-named.** The old rule (b) named a new lead the same night the old one was Recruited. That made cat Y's role, presence placement and Grudge decay change because of the player's Verdict on cat X, which is the '908 B3 / '303 C4 shape. It is deleted. Stewing goes too (OR-19).
2. **The Declaration:** the night Togemaru has ≥ 3 encounters + ≥ 1 mark, or at the deadline (the night after Life 2 day 3). Sworn Enemy or Sworn Rival, chosen by his own Grudge and Regard. **All three Verdicts stay open on him** (Recruit is no longer greyed: simpler, and his Crew hook is "your first enemy, now your loudest friend").
3. **If he is Chased Off or Recruited before or after the Declaration,** his arc closes: a closing Sniff card ("Run out of town" / "Wears the bell now"). The slot stays his as a record (the legend card, or Crew with the storm mark turned into a bell). **No other cat is promoted to the role.** If he is Nose-Touched, he stays the lead and is normally declared a **Sworn Rival**.
4. **Arc achieved** = ≥ 3 encounters (join-ins count) + ≥ 1 mark + a resolved state: the Nemesis slot, Friend, `Truce`, Crew or Gone. A player who Chases him off on Life 1 day 2 closes the arc at 2 encounters, "unachieved". This is accepted as the price of a final Chase Off (owner question 2).
5. **Presence guarantee:** from Life 2 day 1, Togemaru turns up on Mikan's route at least once a day **until his arc closes**. Placements: Keeper, waiting at a post, a Rival Ambush, the raid leader, or, under a truce, a non-hostile greeting or a join-in. For players whose arc closed early, Life 2's antagonist pressure comes from **Daifuku** (his anger, then his window) and the challenger.

*Docs:* `nemesis-system.md` §3.6, §3.7 (delete (a) and (b); amend (c)), §3.8, §3.16 (new worked story), §8 AC 4, 7, 8, 11 · `crew-and-progression.md` §3.2.1 · `territory-management.md` §3.6 · `GDD.md` §8, §9 · brief §3.1, §3.5.

---

### 1.5 C5: the Turf Board and challengers

#### OR-16 · Challengers *(C5; G3, G5, G6)*

**The owner asked for** new cats coming to town to take Mikan's ground. Lean by design: **a challenger is a raid leader with a face by day.** It reuses the raid slot, raid resolution, the Standoff and the Verdict.

| | Rule |
|---|---|
| **Who** | A **freshly generated newcomer** with the Wall Sitter personality weights. Tough tier in Lives 1–2, Captain tier from Life 3. It carries one **Rival** tag (p 0.5) to a random non-Gone, non-Crew town cat, drawn uniformly and **never weighted by Mikan's history**. Origins: `calendar`; or `truce_end` (an existing cat, by its own timer, OR-13) |
| **How often** (a fixed calendar, so no cat's fate starts the clock) | The **first** in a district comes on the **second night after Mikan first holds ≥ 3 Patches there**. Then **every 4th night after that first one**. If a challenger is still active on a due night, that arrival is skipped. **≤ 1 active per district.** Slice expectation: one, announced in the Life 2 day 4 Sniff |
| **Target** | Mikan's lowest-Scent held Patch in the district (never Low Wall Corner, never the Den; ties: the higher yield) |
| **Announced** | The next morning's Sniff card "A stranger's scent": its silhouette (undiscovered until met), the target's landmark, a tape star. It also appears at the Outsiders gate on the Rivals board, as a stamp on the Turf Board, and as a compass tick |
| **By day** (Morning–Dusk) | It stands at the target post in a staking pose. Approach for a Standoff ("This post's mine now, Collar."), then a fight: challenger + 1 Stray escort. **Win: a Verdict**, and the challenge ends. Optional; it counts toward the day's 4–6 encounters. **Beating it never adds Scent** (G5): the reward is the Verdict and the end of its over-marking |
| **By night** | **Over-mark −10** on the target each night it is active (a posted Goofball: 0). From the night after it arrives it **takes the district's raid slot** with motive **`challenge`** (replaces `pretender`): leader + 1 Stray, counters Schemer and Brooder, `motive_mod` 1.10. **Lost: it becomes the Patch's Keeper. Repelled twice: it leaves town** (`Gone`) |
| **Links** | **C3:** its over-mark is decay pressure on influence, and a Patch it takes gets a new Keeper. **C4:** Chase Off is final, so challengers are how the town refills with faces. The calendar never reads which cats were Chased Off |

*Claim elements avoided:* the outcome element (arrivals are calendar- and territory-driven) and the 2nd-NPC element (only new cats appear; no existing cat is re-tasked).

*Docs:* `nemesis-system.md` §3.12 (challenger arrival; raid priority `challenge` > arc lead > others), new F-challenger, §3.13, §3.15 · `territory-management.md` §3.6, §3.7, §4.1, §5, AC · `day-loop.md` §3.7 · `key-screens.md` §2, §5 · `hud.md` · brief §3.3, §5.3, §6.1.

#### OR-17 · The unified Turf Board *(C5)*

**What is wrong now** (`previews/08-turf-board.png`):
- Seven regions compete: the title, the tab bar, a separate Sentry counter, floating Scent pills, a right panel, a clothesline Crew strip, a totals box and a legend.
- Scent shows twice per Patch.
- Numbers sit in five places.
- The one decision is split across three regions.

**The layout: four zones, each with one job.**

```
+----------------------------------------------------------------------------------+
| HIDAMARI LANE  [bell ===== 95% =====|open|== sage ==]  (crown)   Crew·TURF·Lessons·Share |
+-----------------------------------------------------+----------------------------+
|                                                     | TONIGHT                    |
|   MAP  (≈ 65% width): 5 Patch stamps at fixed       |  Persimmon Alley           |
|   positions. Each stamp = landmark + owner ring     |  [Togemaru][Stray]  grudge |
|   + wisps + ONE badge + the seated Sentry.          |  Scent 48 · Strong at 60   |
|   Badge priority: raid/challenge tonight >          |  Tribute tomorrow 12       |
|   fading (below Strong) > Home.                     |  ---- carrying Pon ----    |
|   Boss window open: crown paw-marks on the 3 stops. |  Repelled ███ Scuffed █ Lost ▁ |
|   Neighbour links appear ONLY while carrying a cat. |  counter ×2 · ♥ Hige next door |
|                                                     |  [ Post Pon ]              |
+-----------------------------------------------------+----------------------------+
| SENTRIES (o)(o) | Hige Stalwart True·Posse | Pon Goofball Steady·Posse | ... | Tomorrow 43 − 4 = 39 · Stash 128 |
+----------------------------------------------------------------------------------+
  shared Lot footer: (S) pick up  (N) cat card  (W) unpost  (View) legend  (E) leave
```

1. **Header (one line):** the district, the **influence bar** (with its % and the Boss crown, lit when the window is open) and the Lot tabs. There is no separate Sentry counter.
2. **Map = where.** No numbers. Wisps, one badge and the seated Sentry.
3. **Tonight panel = the one decision.** It opens **focused on tonight's threatened Patch** (a forecast raid or a challenger), so the first press is "pick a cat". It shows the threat, that Patch's Scent and tomorrow's Tribute, and, while carrying a cat, the Repelled/Scuffed/Lost bar, the counter icon and the neighbour link. On a quiet night it lists the fading posts.
4. **Crew strip = who.** Two Sentry pegs, then each cat's portrait, personality icon, Loyalty tier word and assignment chip (Wavering shows turned away). The strip ends with the totals.
5. **Numbers appear in exactly three places:** the header %, the Tonight panel and the totals.
6. **The one decision a day:** *who guards the threatened Patch, and so who leaves the Posse.* First use stays "one decision" (final-assessment open item 10). Target ≤ 1 min at the Lot.

*Docs:* `key-screens.md` §5 · `territory-management.md` §6 · `previews/08-turf-board.html` (re-render) · `IMPLEMENTATION-PLAN.md`.

#### OR-18 · What we deliberately did not add *(C5; G9)*

- **No second territory number;** influence is read off Scent.
- **No challenger tiers, waves, escalation or factions;** one at a time per district, on the existing raid slot.
- **No NPC-vs-NPC turf wars.**
- **No anger for anyone but Bosses, and no anger from fights.**
- **No buffs from influence.**
- **No diplomacy, tribute-to-gangs, bidding or new currency.**
- **No promotions, seat ladders, demotions or "who takes over" successions.**
- **No cross-cat gossip:** no lines or Titles about what Mikan did to another cat (G8).
- **No online, shared or asynchronous features** (G9).
- **No new daily action;** influence and anger are state.

---

### 1.6 Cross-cutting

#### OR-19 · Fixed roles, no seats; town events; Stewing cut *(G1, G3, G8, G11)*

- **Ranks are fixed roles** (Tough, Captain, Boss, Great Boss), set at generation and **never changed by any outcome**. Combat's multipliers and the Keeper roles still need them.
- **The Tough seat order 1–5 is deleted,** with every seat swap. "Lowest-seat Tough" / "Tough seat 1" now means a seeded pick among Toughs.
- **No promotions of any kind.** This goes partway toward v2 G11 (a flatter gang): a role still shapes behaviour ('908 A3 stays present), but no status in the hierarchy ever moves because of an interaction, so '908 B3's ripple has nothing to ride on.
- **Wall events become town events** (`TownEvent`), one per district every 2–3 nights (F6 schedule unchanged), shown on the Rivals board and in the Sniff only for cats with history with Mikan. Kinds:
  - **newcomer** (a keeperless Patch or empty seat gets a freshly generated cat);
  - **feud scuffle** (a Rival-tagged pair scuffles; the loser wears a head plaster for 2 days; no role change).

  Deleted kinds: promotion, return, refill-by-Roamer, Restless. **Roamers** stay as off-wall cats (Ambush and raid candidates) but never fill seats.
- **The raid fallback belongs to the gang:** "if no cat qualifies, the district's gang sends a seeded Tough under `gang_orders`" (renamed from `boss_orders`). It does not depend on whether the Boss is present, Gone, in truce or Crew (G6).
- **Stewing is cut entirely.** It raised a cat's Grudge because of how Mikan had treated *other* cats, and generated a Roamer feuding with Mikan's Friend. The challenger calendar and the gang fallback now supply its pressure.
- **Barks (G8):** every line is selected from the speaker's own Memory, its own relationship tags, its own state, and Mikan's visible routine (`evenings_home`, `nights_out`). There are **no lines citing what Mikan did to another cat.** Delete "Buri went soft. I didn't." and the Backlog "gossip-borne Titles". `mikan_plastered` is victor-only (OR-02).

**Residual items for counsel** (not redesigned; the same class as every enemy-selection rule):
- The nightly raid requester and the daily Rival Ambush candidate are picked among eligible cats by each cat's own Grudge. Removing one cat from eligibility (for example, Gone) leaves another to be picked.

#### OR-20 · Event contracts and ownership

| Event / query | Change | Emitted by → consumed by |
|---|---|---|
| `VerdictApplied.verdict` | ∈ {`chase`, `recruit`, `nose`} | Nemesis → Territory, Crew, Economy, UX |
| `TownEvent(kind ∈ {newcomer, feud_scuffle}, cat_ids, patch_id?)` | **Replaces** `RivalRankChanged` / `WallEvent` | Nemesis → UX, Territory, Narrative |
| `CatDiscovered(cat_id, how ∈ {encounter, sniff, crew})` | New | Nemesis → UX, Audio |
| `InfluenceChanged(district_id, by_clowder{})` | New | Territory → UX, Audio |
| `BossWindowChanged(district_id, open)` | New | Territory → Nemesis (patrol placement), UX, Audio |
| `AngerChanged(boss_id, stage)` | New | Nemesis → UX, Audio, Combat (read at fight start) |
| `ChallengerArrived(cat_id, district_id, patch_id, origin ∈ {calendar, truce_end})` | New | Nemesis → Territory, UX, Audio |
| `AllyJoined(cat_id, encounter_id)` | New | Nemesis → Combat, UX, Audio |
| `RaidRequested.motive` | ∈ {`grudge`, `gang_orders`, `gloat`, `challenge`} | Nemesis → Territory, UX |
| `RaidResolved` | + `presence` (bool) | Territory → Nemesis, UX |
| `BetrayalTriggered(crew_id, patch_id)` | Reachable from Life 2 | Nemesis → Crew, Territory, UX |
| `RivalCombatProfile` | + `anger_stage`; on Crew cats `old_gang_nerves`, `old_boss_id` (from its own Memory), `kin_ids` | Nemesis → Combat |

**Ownership:**
- **Territory:** influence and the Boss window (a place-and-schedule gate); the presence rule.
- **Nemesis:** relationships, discovery, anger, the challenger calendar and generation, the join-in roll, Old Gang Nerves, truces, newcomers and town events.
- **Combat:** the values of Cowed and Fired Up; the ally guest; the Kin targeting rule; the patrol arena kit.
- **Day Loop:** the loss time-skip and the closed street.
- **Narrative:** the Routed Evening, the plaster beat, and every line (G8).
- **Crew:** the Loyalty side, the betrayal thresholds, and the G10 audit of its Loyalty inputs.
- **UX:** the Rivals board and the Turf Board.

**Night Shuffle (canon order, amended):**
1. **Crew:** Loyalty; Sentry XP; Wavering flags.
2. **Territory:** decay and refresh; challenger over-mark; upkeep; tonight's raid or challenge; influence and the Boss window.
3. **Nemesis:** betrayals; town events (newcomers, feud scuffles); the challenger calendar and truce expiry; adaptation; Grudge and anger decay; the Declaration; tomorrow's raid request.
4. **Economy:** Tribute.
5. **Narrative:** next morning slot; Life-end check.

#### OR-21 · Obsolete: the delete list

Revisers delete these wherever they appear, including Backlog lines, ACs, worked examples, sims and previews:

1. **Humble and everything hanging off it:**
   - the Undermark crate and row; the `Humbled` state;
   - simmer, Restless, uprisings, the `uprising` motive, Settled;
   - the Humbled Tribute bonuses; the Goofball's "never simmer" perk; the Stalwart's Humble dislike;
   - the crate challenge; "a Humbled lead stays the lead";
   - R-J; final-assessment open item 6;
   - the Down card; the "Humble +10" Grudge row; GDD §18's Humble question.
2. **The Nose-Touch roll and its outcomes:**
   - F4 as a probability; snubs; `nose_accept` / `nose_snub`;
   - "keeps its post"; `TRUCE_YIELD`; "a truce Patch can't be Sprayed or counted";
   - the "spare one Keeper" argument; the pacifist snub bound; the 5-day truce.
3. **Chase Off comebacks:** Away, F5, the Away cap, escorts → promoted → the Grand Standoff, `chased_count`, Twice-Chased, the "return" event. Keep `RETURNED` only for "back after fleeing".
4. **Loss consequences:**
   - loss promotion and seat swaps; "drops to seat 1 with a feud"; victor level +1;
   - **Mark Over**; **Snatch** and its `loot_held`;
   - "Losing ends the outing, not the day"; the clock jump to Dusk;
   - non-victor plaster lines.
5. **The ladder:** Tough seats 1–5; promotion events; seat swaps in feuds; height = rank; Mikan's Clout-height seat; Away paw prints; **refill by Roamer** (NS-18 and §3.12 3d).
6. **The Fence Line** as a screen; `RivalRankChanged` / `WallEvent`.
7. **The Den gate** (Locked/Open at 3 of 4) and the Den-Open rule; the automatic Den claim on a Boss Verdict.
8. **Fight-driven Scent:** "Rout −15 inside a contested Patch"; "a wipe during a contest gives the rival +30"; the Caterwaul "+10 in person"; the Verdict setting `S_r = 0`; the Keeper waiting on a cleared wave.
9. **Lead re-naming** (§3.7 b) and the "new lead the same night" rules; **Recruit greyed for the Nemesis**.
10. **Stewing**, entirely, including the feud-against-the-Friend Roamer; cross-cat gossip lines and gossip-borne Titles.
11. **`pretender` and `boss_orders`** (now `challenge` and `gang_orders`).
12. **Betrayal "unreachable in the slice"** notes.
13. **Botan's "Humble or Nose-Touch".**
14. **The Life 1 day 1 Thorn Verdict branch.**
15. **Daifuku "never leaves his wall"** (now "never comes down off the walls").

---

## 2. Doc change list

Every reviser also applies OR-20 (events) and OR-21 (deletes) in their doc. **[re-sim]** marks the sims that must be re-run.

| Doc | Implements | Write | Delete |
|---|---|---|---|
| `design/gdd/nemesis-system.md` | OR-02–07, 10–16, 19, 20 | <ul><li>Overview and fantasy: #3 "the cat I spared fights beside me", #5 "the town moved while I slept".</li><li>New fields: `relations[]`, `discovered`, the `OLD_GANG` Memory kind and `old_gang_nerves`, `anger`, `truce_until_day` (10 days), challenger fields.</li><li>Relationship seeding and the slice seeds.</li><li>Old Gang Nerves (recruit-side only); Boss anger (+ formula).</li><li>The three-Verdict table; the Nose-Touch gate (F4 rewritten); F-join; Chase Off = Gone; adaptation re-trigger.</li><li>Newcomers only; the challenger calendar (F-challenger) and raid priority; Boss patrol placement; town events; `gang_orders`.</li><li>The fixed arc lead; the bark rule (G8: own history only).</li><li>A new §3.16 worked story (Togemaru through all three Verdicts).</li><li>§6.4 rewritten to cite the v2 note, list G1–G12 as adopted, list the OR-19 residual items, and keep counsel review blocking.</li><li>New ACs: Verdict variety (≤ 60%; ≥ 70% use ≥ 2); exactly 1 Nemesis record for 100% of seeds; unit tests that a join-in, a Verdict, a loss and an anger change never alter any cat other than the subject; anger never moves on a fight.</li></ul>**[re-sim: DR-57 policies; lose-40 under OR-01/02]** | OR-21 items 1–6, 9, 10, 13, 14; F5; the old §3.10 loss block; the Humble and gossip Backlog lines |
| `design/gdd/territory-management.md` | OR-02, 08–12, 15–17 | <ul><li>Influence (formula, bar, worked example).</li><li>"Fight to clear, spray to claim": Claim Spray on a keeperless post; marking-only erosion; the Keeper arrives on Scent ≤ 30.</li><li>The Caterwaul **presence rule**.</li><li>The Boss window (patrol, hysteresis, no-Lost rule, Den Claim Spray).</li><li>Newcomers into keeperless Patches; the `challenge` motive and over-mark; the Goofball's "Laughs off a challenge".</li><li>The Turf Board spec as OR-17.</li><li>§4.11 without Humble; §4.13 exploits under OR-01/02 (wipe-skip, Scram on anger).</li><li>New ACs: full influence opens the window; it never closes at ≥ 75; no Lost while it is open; no fight outcome changes Scent (unit test); ≤ 1 challenger per district; Repelled twice → it leaves.</li></ul>**[re-sim: Lives 1–2 economy, anchor 54–66 without Humble and without Rout erosion; adjust `base_yield` within ±25% if needed. Posting stakes with challengers and the presence rule]** | OR-21 items 1, 4 (Mark Over, Snatch), 7, 8, 11 |
| `design/gdd/combat-system.md` | OR-01, 02, 05, 06, 07, 09, 13, 14 | <ul><li>The `loss` line hands the day's end to Day Loop (Gloat, no promotion).</li><li>Cowed from Old Gang Nerves (recruit only; cleared by a Tag-In; no target on the Old Boss while Cowed).</li><li>Fired Up by anger stage (Boss only).</li><li>The ally-guest join-in (the opponent unchanged).</li><li>The Kin AI rule.</li><li>Daifuku on the patrol arena kit.</li><li>Togemaru's uninterruptible Life 1 day 1 flee.</li></ul>**[re-sim: Daifuku fight length when Furious, and with Kagi Cowed]** | "Daifuku never leaves his wall"; promotion references |
| `design/gdd/day-loop.md` | OR-01, 02, 09, 16 | <ul><li>§3.6 rewritten to OR-01.</li><li>The §3.3 `routed` row.</li><li>§3.5 order per OR-20.</li><li>§3.7: the roaming Boss and challengers count toward encounter density.</li><li>§3.10–3.11 pacing re-measured: the window and the challenger on L2D4, the claim on L2D5.</li><li>§5 edge cases: a loss at Night, during a Caterwaul, before the flap.</li></ul> | §3.6 steps 1, 3 and 5 as written |
| `design/gdd/crew-and-progression.md` | OR-04, 05, 06, 11, 12, 15 | <ul><li>Hige's authored `OLD_GANG` Memory entry.</li><li>`OLD_GANG` and nerves written at the join step, shown on the Crew card.</li><li>Kin as a bonded pair.</li><li>The Stalwart's new dislike (a Scuffed or Lost night on its own post, −3).</li><li>Betrayal live from Life 2 (posted ex-Rival recruits).</li><li>Release below 60 = Gone.</li><li>**G10 audit:** list every Loyalty input keyed to Mikan's dealings with a *different* cat (the Schemer's Nose-Touch dislike), mark each as a '303 watch item, and add none.</li></ul> | The Humble dislike; "betrayal locked in the slice" |
| `design/ux/key-screens.md` | OR-03, 04, 06, 07, 11, 12, 16, 17 | <ul><li>§2 rewritten as **The Rivals board**.</li><li>§3: tags, the discovered state, anger, the old-gang stamp.</li><li>§4: three-card fan, new copy and tells.</li><li>§5: OR-17.</li><li>§7.4: the influence bar from L2D1; the window and the challenger on L2D4; the Rivals board on L2D1.</li></ul> | The Fence Line spec; the Down card; Undermark and Restless displays |
| `design/ux/hud.md` | OR-01, 03, 09, 16 | The closed-street HUD after a loss; compass ticks for the roaming Boss and a challenger; the sniff-to-discover confirmation; the binding renamed "Rivals"; new Sniff card types (challenger, Boss window, anger, Wavering) and priority | Fence Line references |
| `design/GDD.md` | all | §4 slice table · §5, §7 loss · §8 personality cells · §9 rules, Verdict table, a new worked example · §10 influence, window, challengers · §14 screens · §16 events and steps · §17 pacing · §18 questions · §19 patent row (cite v2) · §20 the owner questions below · §21 glossary | Every OR-21 item restated in the GDD |
| `production/artifact-slice/IMPLEMENTATION-PLAN.md` | OR-01, 03, 04, 09, 12, 13, 15, 16, 17 | See "Showcase scope" below | The Humble branch, the Fence Line, the four-card Verdict, Goma-as-lead branches |

**Showcase scope (≈ 14 min; the main path stays within the plan's 11–15 min acceptance).**

**Required in the main path:**
1. **The three-option Verdict** on Togemaru at Life 1 day 2 (his day-1 flee is uninterruptible). Branches:
   - **A = Nose-Touch:** a truce; declared a Sworn Rival.
   - **B = Recruit:** free; the Declaration card plays as "Wears the bell now".
   - **C = Chase Off:** Gone; the legend card; the closing "Run out of town".

   **There is no lead re-naming**, so Goma never becomes the lead.
2. **The Rivals board** at 9:15 and at the end card:
   - the Lane row and the uphill silhouettes;
   - one **sniff-to-discover** moment (sniff Daifuku from Laundry Pole Yard in Life 1 day 2);
   - hover tags: Togemaru ↔ Goma **Rival**; Hige ↔ Daifuku **Old Gang**.
3. **The unified Turf Board** with the influence bar in its header, first use as one decision.
4. **A challenger:** announced on the Life 2 day 2 Sniff (silhouette), staking Laundry Pole Yard. **It replaces the optional 4-cat Goma/Sasa fight:** challenger + 1 Stray at the gatepost, with the bucket and a Relay, ending in a second Verdict. It is showcase-seeded with a Rival tag to Togemaru, so **in branch A Togemaru joins** (forced to 100% for the showcase, as the Scar is). If the player skips it, its over-mark shows on the next morning's pile.
5. **The roaming-Boss reveal:** the snapshot's influence sits at 95 with the gatepost below Strong. The **rescue Spray of the gatepost** (a territory act, never the challenger win) takes it to 100. Daifuku's yowl, he climbs down, and his patrol stop appears on the Laundry Pole Yard wall (≈ 15 s).

**Required as a branch:**

6. **The loss-to-night moment.** An optional **Daifuku bout** at his Laundry Pole Yard stop (wash tub): phase 1 only; Furious from the Life 1 Counter-Sprays.
   - A wipe plays OR-01: moon-blue skip, walk home, the Routed Evening (the plaster beat in front of Storyboard B at night light).
   - Reaching his phase break makes him leap back to the Den (`rival_fled`), and the Dusk evening plays.
   - Chapter select adds **"Lose to Daifuku"**.
   - **Fallback** if the bout does not fit its milestone: a chapter-select seed with a stronger challenger demonstrates the loss.

**Trims:** M1 montage 35 → 25 s; overnight diorama 15 → 10 s; Turf Board first use ≤ 45 s. Daifuku moves from OUT to **IN** as the reveal and the optional bout (one arena, already built: the Laundry Pole Yard wall).

---

## 3. Scorecard impact (honest expectation; against `final-assessment.md` §2.2)

| Feature | Stand out now | Expected | Why |
|---|---|---|---|
| **Cat nemesis system** ("Rivals") | 8 | **7.5** (range 7–8.5) | **Gains:** the owner's roster with silhouettes and discovery; relationship tags; Old Gang Nerves and join-ins that play; visible Boss anger. **Loses:** comebacks; promotions; "the wall moved"; lead re-naming; the boss's bespoke defector taunt; gossip lines. Chase Off's finality and the fixed lead end some players' arcs early. **The patent distance costs about half a point of reactivity, deliberately.** Upside to 8.5 if testers bring up a flinching recruit or a join-in unprompted. Ready drops from 8 to 6 until the rewrite and re-sim |
| **Territory management** | 5 | **7** (range 6–7) | **Gains:** a visible district goal (fill the bar, bring the Boss down off his wall); territory that is never "done" (challengers, newcomers, decay); a readable board; anger as a sneak-versus-loud choice. **Capped by** posting still being a "where", not a "who" decision (open item 1), and by "fight to clear, spray to claim" making Routs worth less on the map. Ready drops from 7 to 5 until the economy re-sim |

---

## 4. For the owner (essentials only; defaults apply if unanswered)

1. **"A few weeks" of Nose-Touch peace = 10 in-game days.** The whole story is about 30 in-game days over many years. **Default: 10** (range 7–14).
2. **Chase Off is final even for Togemaru, the First Thorn, declared or not.** Chasing him off ends his arc with a closing card, and no other cat is promoted into the role (the patent guardrails forbid re-naming). **Default: final, as you wrote.** *Alternative:* grey Chase Off for him until the Declaration.
3. **The old boss's trash-talk at a recruit is replaced by the recruit's own flinch.** Under the full claim text, a boss reacting to who defected is the riskiest shape in your comments. **Default: the recruit-side version now; ask counsel whether a line-only boss taunt can come back.**
4. **Recruit betrayal is on in the slice:** rare, ex-Rivals left on a post at Shifty, after two warning mornings. **Default: on.**
5. **"Full influence" = all four outer Patches Strong at once,** stricter than the old "any three". The window then stays open down to 75. **Default: yes.**

Standing item, not a question: **qualified patent counsel** must review this design against the claims in `design/legal/claims/` before the Rivals scope locks and before any public showing. The pending '303 is the reason the Crew-side effects (join-ins, Verdict-keyed Loyalty) are watch items. These guardrails are distance, not clearance.

---

## Appendix: v2 guardrail → ruling map, and the claim elements stayed away from

| v2 guardrail | Rulings | Claim elements it keeps us away from |
|---|---|---|
| **G1** defeat changes no other cat | OR-02, OR-19 | 2nd-NPC element in all four; the avatar-death dependent claims |
| **G2** anger from objects, touches only the Boss | OR-07 | The outcome element (no NPC interaction as a source); the 2nd-NPC element ('540's threshold included) |
| **G3** no shifting ladder; vacancies wait for newcomers | OR-10, OR-12, OR-14, OR-15 (fixed lead), OR-16, OR-19 | '908 B3; '303 C4; '179/'540 C |
| **G4** old boss unchanged; defector's own memory | OR-05, OR-06 | '908 B3; '303 C4 (control parameters; dialog dependents) |
| **G5** influence only through territory acts | OR-08, OR-09, OR-16 | '540 B2; '908 B3; '303 C4 |
| **G6** a boss leaving re-tasks nobody; new bosses are new cats | OR-09, OR-12, OR-13, OR-14, OR-19 (`gang_orders`) | '908 B3; '303 C4 |
| **G7** the join-in belongs to the joiner | OR-05, OR-13 | '303 C4; '908 B3 if the Rival shares the faction |
| **G8** cats speak only from their own history | OR-02, OR-04, OR-06, OR-19 | 2nd-NPC element; '908 cl. 12/19 dialog |
| **G9** single-player | OR-18 | Online dependent claims |
| **G10** Crew-side effects keyed to the cat (watch) | OR-05, OR-11, OR-12, OR-13 | '303 C4 (pending) |
| **G11** a flatter gang | OR-19 (no seats or promotions; roles fixed) | Partial against '908 A3 |
| **G12** naming | OR-03 | Not a claim element (litigation posture) |

*Left alone, as v2 §5 says is not needed on the current claim text:* per-cat Memory, Scars, Titles, Lick In and adaptation, which change only the cat Mikan dealt with.

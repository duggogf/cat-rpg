# Crew & Progression

*Owner: systems-designer · Round 2 (vertical slice) · 2026-11-23, owner feedback pass 2026-11-24 · Canon: owner comments C1–C5 → `design/reviews/owner-feedback-rulings.md` (OR-01…OR-21, binding) → `design/creative-brief.md` v1.5 → `design/reviews/round-1/director-rulings.md`. Patent guardrails: `design/legal/nemesis-patent-analysis.md` v2 §5 (binding; not legal advice, counsel review still blocks scope lock). First draft archived at `design/backlog/first-drafts/crew-and-progression.md`.*

**Scope.** This doc specifies what the vertical slice (DR-01: Lives 1–2, Hidamari Lane, levels 1–8, Crew cap 6) needs: the **personality model** shared by Crew and Rivals (§3.2), the six slice recruits (§3.3), stats/levels/XP for Lv 1–10, recruitment and starting Loyalty, the Crew / Posse / guard-duty split, allied guests (§3.5.7), Loyalty and the betrayal thresholds, learnsets and Lessons, Tail-Up, and "make room". Everything else is in `## Backlog (post-slice)`.

**Ownership reminders (brief §6, DR-05, DR-37, OR-20).** Combat owns every Move and Zoomies number, the AI implementation, the combat-perk values, the values of Cowed and Fired Up, the ally guest and the Kin targeting rule. Territory owns guard-perk values, raid maths, Sentry slots and every price. Nemesis owns personality *assignment*, recruit availability, relationship tags, the `OLD_GANG` Memory entry and `old_gang_nerves`, truces and the join-in roll, the betrayal event and the Rival column. This doc owns the **Loyalty and social columns**, starting Loyalty, the Bribe rule, **the betrayal thresholds and the G10 audit of Loyalty inputs** (§3.7), learnsets, Lessons, slot rules, stats, XP and Power Rating. Where this doc quotes another owner's value it is marked *(owner: X; proposed start)* and the owner's value wins.

**Patent rule (brief v1.5; OR Appendix).** Nothing Mikan does to one cat, and nothing that cat becomes because of it, may change a *different* cat. Every Crew rule below changes only the cat it is about, driven by that cat's own experience and the player's resource actions (posting, the Posse, Morsels, Lessons). The few Loyalty inputs that read Mikan's dealings with another cat are listed as '303 watch items in §3.7.6 and are fenced off from betrayal.

---

## 1. Overview

The Crew are the cats Mikan has won over: a few known faces, not a collection. Any of them can stand in the four-cat **Posse**, be posted as a **Sentry** on a Patch, or lounge at **the Lot**, and the player swaps them freely, Pokémon-style: at the Lot at will, in the field by **Tail-Up**. Every cat can be taught Moves at the Lot by any cat that knows them (**Lessons**), on top of the Moves it grows into (**Instinct**). Style sets what a cat's body is good at; **personality** sets everything else, and personality is the hook. Each of the six personalities (Braggart, Brooder, Schemer, Fraidy, Stalwart, Goofball) decides how the cat fights when the AI drives it, the one thing it is best at in a brawl, how it guards a post, what makes it more or less loyal, and who it gets on or clashes with. The same model runs the Rivals, so the Braggart who taunted you from the wall is the Braggart who charges first in your Posse, makes his Patch pay, and stares his old boss down where a Schemer would flinch. A Rival joins only through the **Recruit Verdict, for a Bribe**; a cat Mikan spares with a Nose-Touch may fight beside the Posse as a guest, but it is never Crew. A recruit left to sulk on a post can, rarely, turn and take that Patch for itself. In the slice the player meets all six personalities in six recruitable cats, and the daily question at the Lot ("who fights, who guards, who sits out today?") has no single right answer because personalities pull in different directions.

## 2. Player Fantasy

*"I know these cats."* You do not pick the cat with the best number; you pick **Pon** because she makes the bucket hit harder and she sulks if you leave her at the Lot, you post **Hige** on the corner because nothing gets past an old Stalwart, and you keep **Togemaru**, the Thorn, in the Posse because he was the first cat who ever called you Collar and now he charges the biggest enemy for you, loudly. The swap is the pleasure: bring the Fraidy for the crow-heavy lanes, the Brooder for the rematch with the cat who flattened your friend, the Goofball for the alley full of junk. When Kagi sees Daifuku, the old boss, on his wall, Kagi's ears go flat, and your Tag-In is what steadies the Schemer; Hige, who was one of Daifuku's cats once, just stares back.

Teaching is the second pleasure. A Move is something one cat shows another: the old Captain you recruited knows a screech nobody else does, and by tomorrow morning your Bruiser has learned to bellow it too. Every Move a cat did not grow into, it took from another cat.

Pillar fit: **Conduct the Brawl** (four cats who each behave differently under AI, so composition is a combat decision), **Rivals Remember** (a recruited Rival brings its personality, history, Old Scores and signature perk), **Cat's-Eye Truth** (personality is shown by pose, walk and bark, not a stat screen; numbers count only what a cat owns or pays, such as levels, XP pips and prices, and Loyalty is never a number: presentation ruling R3).

---

## 3. Detailed Rules

### 3.1 The cat sheet (schema)

All cats use the One Cat Schema (brief §6). This doc **writes** `level, xp, stats{}, moves[4], loyalty, assignment` and **reads** `style, personality, former_rank, signature_strength, traits, memory, grudge, regard, rank, relations[]` (for `kin_ids`), `old_gang_nerves` and the `OLD_GANG(boss_id)` Memory entry (Nemesis writes both, OR-06). Ranks are fixed roles set at generation (OR-19); `former_rank` is a record, never a seat.

Requested schema extensions (Crew-only, flagged for the schema owner):

| Field | Type | Purpose |
|---|---|---|
| `known_moves[]` | list of `move_id` | Every Move the cat has learned (Instinct or Lesson). Slots draw from it for free. Never shrinks |
| `loyalty_accum` | float | Fractional Loyalty (Brooder half-speed); `loyalty = floor(loyalty_accum)` |
| `days_out_of_posse` | int | Braggart counter (consecutive days not in the Posse) |
| `nights_on_post` | int | Brooder counter (consecutive nights on the same Patch) |
| `origin` | enum `story / friend_stray / rival` | Fixed-Loyalty and release rules |
| `returned` | bool | Has been Crew before (F6) |
| `wavering_nights` | int | Consecutive Night Shuffles the cat has ended betrayal-eligible (F11); 0 when not eligible |

Mikan has **no personality and no Loyalty**. Mikan's AI profile (when the player controls another cat) is the **Mikan row of Combat §3.11** (stays 2–4 m from the controlled cat's lock target, base Pay-off rule, no perk).

### 3.2 Personality — the one model (canon shape: brief §3.5, DR-37)

Six personalities. Nemesis assigns one at generation; it never changes; Style alone sets stats (no stat nudge). Each personality is expressed in five places, plus two v1.5 hooks that come from the same field: whether a recruit **flinches at its old boss** (Old Gang Nerves, OR-06) and how readily it accepts a **Nose-Touch** (the gate shift, OR-13). A Nose-Touched cat that joins a fight as a guest fights by its own "Fights like" row (§3.5.7). The sheets below is the single reference for the whole team; the columns marked with an owner are briefs to that owner, not values this doc sets.

#### 3.2.1 Full personality sheets

**BRAGGART** — *"Watch this."* Loud, front-foot, needs an audience.
- **Fights like (AI; Combat §3.11 owns):** charges the biggest enemy (highest rank, then highest max Nerve) and stays in melee; spends a Pay-off at the first chance.
- **Combat perk (Combat §3.11):** its first hit on a **Captain or Boss** each encounter adds **+20 FZ** (flat).
- **On guard (Territory owns values):** raid defence bonus; its posted Patch yields **+10% Tribute** ("residents pay a loud cat").
- **Loyalty (this doc):** **+1** extra on any day in the Posse. **−2 per day** from the 3rd consecutive day out of the Posse (posting counts as out: he wants to be seen fighting).
- **Social:** bonds with **Goofball**; clashes with **Braggart**.
- **Old gang (OR-06):** **resists** (too proud): stares his old boss down with his own defiant line; no status.
- **As a Rival (Nemesis owns):** loud taunts; bolts and comes straight back after a flee. Nose-Touch gate **−5**.
- **Why you want him:** fastest cat to open a Captain's Frazzle; best Tribute guard; never flinches. **Cost:** cannot be parked on a post for long without sulking, which is how an ex-Rival Braggart drifts towards Wavering (§3.7.4).

**BROODER** — *"I remember."* Quiet, slow to warm, slower to cool.
- **Fights like (AI; Combat §3.11):** hangs back at 5–7 m until an enemy hits an ally, then goes for that enemy for 6 s; saves Paws for Pay-offs on its avenge target.
- **Combat perk (Combat §3.11):** **Old Score ×1.5** instead of the usual ×1.25 Frazzle against a Rival it has Routed or been Routed by.
- **On guard:** **never leaves its post** (cannot be drawn off by a raid feint, Territory defines); its posted Patch's Scent decays slower.
- **Loyalty:** **every Loyalty change is halved, both ways** (stored in `loyalty_accum`). **+1** (not halved) on every 3rd consecutive night on the same post. Being **dismissed from a post** the Bell Clowder still holds (moved off it by the player, including to another post): **−5** net.
- **Social:** bonds with **Stalwart**; clashes with **Schemer** and **Goofball** (Goofball's clash column names Brooder).
- **Old gang:** **resists** (it hates the old boss more than it fears it): a cold line of its own; no status.
- **As a Rival:** Grudge decays at half rate (−1 per quiet night). Nose-Touch gate **−5**.
- **Why you want him:** the steady post-holder whose Loyalty you can forget about for days; the rematch specialist. **Cost:** a bad start takes twice as long to repair; hates being shuffled around.

**SCHEMER** — *"Wait for it."* Opportunist, admires cleverness, despises softness.
- **Fights like (AI; Combat §3.11):** approaches from the target's rear 120°; switches to a Ruffled or Frazzled target within 6 m; spends on Frazzled targets.
- **Combat perk (Combat §3.11):** **+20% damage to Frazzled** targets.
- **On guard:** its district's raid forecast in the Morning Sniff **names the raider's motive** (Territory/UX render it).
- **Loyalty:** a Lesson taken gives **+3** instead of +1. **−2** for each Nose-Touch Verdict Mikan gives that day (max −4/day), wherever the Schemer is (*'303 watch item, held; fenced off from betrayal*, §3.7.6).
- **Social:** bonds with **Fraidy** and **Goofball**; clashes with **Brooder** and **Stalwart** (Stalwart's clash column names Schemer).
- **Old gang:** **susceptible**: flinches and is **Cowed 20 s** at the sight of its old boss unless Sworn; a Tag-In steadies it (§3.4.4).
- **As a Rival:** Ambushes. Nose-Touch gate **0**. **As Crew:** becomes betrayal-eligible below **35** instead of 30 when posted (DR-37, OR-11; §3.7.4).
- **Why you want it:** the best Pay-off cat in a Frazzle window; the posting that tells you *why* a raid is coming. **Cost:** clashes with your two most reliable personalities; dislikes mercy; flinches at its old boss; the likeliest turncoat if left Shifty on a post.

**FRAIDY** — *"Not me, not me."* Jumpy, quick, a superb lookout.
- **Fights like (AI; Combat §3.11):** keeps 4–6 m away; Skitters white telegraphs eagerly; prefers support and holds Paws for `support` Moves; never climbs to the High Road.
- **Combat perk (Combat §3.11):** a **perfect Skitter gives +25 Pounce points** (a quarter Paw), also when the player drives it.
- **On guard:** weak raid defence, but **raises the Caterwaul early** (longer live-defence window).
- **Loyalty:** **+1** on any day it fought at least one encounter and was never Routed. **−2** extra each time it is Routed (any fight, won or lost).
- **Social:** bonds with **Stalwart**, **Schemer** and **Goofball**; clashes with **Braggart**.
- **Old gang:** **susceptible**, and worst of the six: **Cowed 30 s** unless Sworn; a Tag-In steadies it.
- **As a Rival:** flees early; slow to show itself again after a flee. Nose-Touch gate **+5**.
- **Why you want it:** the cat that rarely gets Routed and feeds the Pounce Gauge when the player drives it well; the early-warning Sentry. **Cost:** lowest guard strength; a bad day makes it miserable; the longest flinch.

**STALWART** — *"Behind me."* Honourable bodyguard.
- **Fights like (AI; Combat §3.11):** stays within 3 m of the controlled cat; Braces against attacks aimed at itself; takes attack-token priority from enemies; spends on whatever is attacking the controlled cat.
- **Combat perk (Combat §3.11):** **allies within 3 m take ×0.85 damage** (never below the 30% floor).
- **On guard:** **best raid defence** of the six.
- **Loyalty:** likes fair play: **+1** for each Nose-Touch Verdict or each won Rival fight that opened with a Standoff (not an Ambush), max **+2/day** (*'303 watch item, held; fenced off from betrayal*, §3.7.6). Dislikes **a Scuffed or Lost night on its own post: −3** ("it failed the line"; OR-12, OR-15; its own experience, read from `RaidResolved` for the Patch it guarded).
- **Social:** bonds with **Brooder**, **Fraidy** and **Goofball**; clashes with **Schemer**.
- **Old gang:** **resists** (steady): "Not your cat anymore."; no status.
- **As a Rival:** honourable; Nose-Touch gate **+15** (accepts it most readily).
- **Why you want it:** keeps the controlled cat alive; the post you never worry about; never flinches. **Cost:** takes a raided post personally, so posting it on the threatened Patch is a gamble with its goodwill.

**GOOFBALL** — *"Ooh, a bucket!"* Playful, easy-going, needs company.
- **Fights like (AI; Combat §3.11):** goes for props that would catch an enemy (within 6 m); otherwise picks randomly between the nearest two enemies (seeded); fires eligible Pay-offs on a seeded 50% roll.
- **Combat perk (Combat §3.11):** **props it triggers: ×1.3 effect**.
- **On guard (Territory owns values; OR-15, OR-16):** **"Laughs off a challenge":** a challenger staking its Patch over-marks **0** instead of −10 a night.
- **Loyalty:** **Share a Morsel counts double** (+4). **−2** for each day spent **Lounging** at the Lot (neither in the Posse nor posted at the Night Shuffle).
- **Social:** bonds with **everyone except Brooder**, including another Goofball; clashes with **Brooder**.
- **Old gang:** **susceptible**: **Cowed 20 s** unless Sworn; a Tag-In steadies it.
- **As a Rival:** clowns about; easy to Recruit (+10 starting Loyalty, F6); Nose-Touch gate **+10**.
- **Why you want it:** turns every prop-rich alley into a weapon (and the slice's three Fears are prop-driven); the social glue of any Posse; the post a challenger cannot wear down. **Cost:** must never be the one left at the Lot.

#### 3.2.2 Social matrix (this doc owns)

**Rule.** Two Crew cats tagged **Kin** of each other (Nemesis `relations[]`, fixed at generation; OR-04, OR-05) are a **bonded pair** whatever their personalities: Kin beats a clash. Otherwise a pair is **clashing** if either cat's clash column names the other's personality; otherwise it is **bonded** if either cat's bond column names the other's; otherwise neutral. Symmetric. The matrix applies between Crew cats only; an allied guest (§3.5.7) has no pairs. *Slice:* the only Kin seed is Kinako ↔ Sasa, and Sasa is not slice-recruitable, so the Kin bond is inert in the slice; the Kin **AI rule** (an AI-driven cat never targets its own Kin; Combat owns) still applies when Kinako meets Sasa.

| | Braggart | Brooder | Schemer | Fraidy | Stalwart | Goofball |
|---|---|---|---|---|---|---|
| **Braggart** | ✗ clash | · | · | ✗ clash | · | ♥ bond |
| **Brooder** | · | · | ✗ clash | · | ♥ bond | ✗ clash |
| **Schemer** | · | ✗ | · | ♥ bond | ✗ clash | ♥ bond |
| **Fraidy** | ✗ | · | ♥ | · | ♥ bond | ♥ bond |
| **Stalwart** | · | ♥ | ✗ | ♥ | · | ♥ bond |
| **Goofball** | ♥ | ✗ | ♥ | ♥ | ♥ | ♥ bond |

Among the slice's one-of-each six: **7 bonded, 4 clashing, 4 neutral** pairs.

**Effects (DR-37):**
- **Bonded pair, both in the Posse:** a stronger Tag-In between them (Combat §3.3: **MV ×1.25 and +10 FZ**). The UX Crew card and the Posse picker show the ♥ link.
- **Bonded pair, both posted in the same district at the Night Shuffle:** **+1 Loyalty each per night**.
- **Clashing pair "together"** (both in the Posse that day, or both posted in the same district that night): **−1 Loyalty each per day**, once per clashing partner.
- In the slice there is **one district**, so the two Sentries are always "together". A Posse cat and a Sentry are never together.

#### 3.2.3 Choosing a cat (the reason to want this one)

| If today you need… | Take | Because |
|---|---|---|
| To crack a Captain fast | Braggart + Schemer | One opens Frazzle on the leader; the other cashes the window |
| To survive a Boss phase | Stalwart near the controlled cat | Damage shield around the cat you are driving |
| To exploit a Fear prop | Goofball | Props ×1.3 (Water bucket, scooter horn, ledge junk) |
| Revenge on a Rival who beat your cat | Brooder | Old Score ×1.5 |
| A cat that will not get flattened | Fraidy (driven by you) | Distance AI, Pounce from perfect Skitters |
| To hold a Patch under a forecast raid | Stalwart, then Braggart | Best defence; defence + Tribute |
| To know why a raid is coming | Schemer on post | Motive in the Sniff |
| To hear trouble early | Fraidy on post | Early Caterwaul |
| Tribute | Braggart on post (but rotate him) | +10%, sulks after 2 days out of the Posse |
| To face a recruit's old Boss | Braggart, Stalwart or Brooder (or any Sworn cat) | They resist Old Gang Nerves; a Schemer, Fraidy or Goofball flinches and needs your Tag-In |
| To hold a Patch a challenger is staking | Goofball on post | Laughs off a challenge: no over-mark |

### 3.3 The six slice recruits (character sheets)

**Constraint (DR-01, DR-37):** the six slice recruitables carry **one personality each**, and their Styles split 2 Bruiser / 2 Scrapper / 2 Yowler. Names marked *working* are proposals; Narrative names the old wall cat with this doc (DR action list 5), Nemesis generates Rival names and personalities, and this table is the **seed request** to Nemesis for the slice's fixed seeds. Strengths/Fears are proposals to Nemesis (selection) and Combat (values).

| | **Hige** *(working)* | **Pon** *(working)* | **Kinako** *(working)* | **Togemaru**, the First Thorn, Keeper of Laundry Pole Yard (name adopted by Nemesis) | **Kagi** *(working)*, Captain of Tofu Shop Step | **Daifuku** |
|---|---|---|---|---|---|---|
| **Role** | The old wall cat; story recruit 1 | Story recruit 2 | Friend Stray | Rival (Tough) | Rival (Captain) | Rival (Boss) |
| **Personality** | **Stalwart** | **Goofball** | **Fraidy** | **Braggart** | **Schemer** | **Brooder** |
| **Style** | Bruiser | Yowler | Scrapper | Scrapper | Yowler | Bruiser |
| **Look** | Big grey tom, torn left ear (old, authored), heavy jowls, sits like a loaf on the low wall | Small round calico, one ear always half-folded, tail up like a question mark | Pale fawn ("kinako" soy flour) shorthair, huge ears, thin, always half-crouched | Lean black-and-tan tom, spiky cheek ruff, struts | Long-bodied silver tabby, narrow eyes, sits on the tofu shop's awning looking down | Canon: enormous white-and-grey tom who never comes down off the walls (until full influence opens his window, OR-09) |
| **Joins** | Life 1 day 1, ≈ 0:08–0:10, after teaching Whisker Sense ("Use your whiskers, Collar.") | Life 1 day 2, at a Narrative beat (proposal: the crows cornering her at the laundry poles are day 2's first fight; she tags along) | Life 2 day 1: one-time scent-trail favour, **the day's required first objective** (§3.4.3) | Recruit Verdict, Life 1 day 2 earliest, at the gatepost (Laundry Pole Yard); his day-1 flee cannot be interrupted (OR-14), so day 2 holds the first Verdict. **Free, fixed yes** in Life 1 (PP-07). He is the fixed arc lead, and Recruit stays open on him before and after the Declaration (OR-15): his arc closes "Wears the bell now" | Recruit Verdict, Life 2 day 3 earliest (Tofu Shop Step), for a fair or feast Bribe | Recruit Verdict after his Boss fight at any of his three patrol stops, once full influence opens the Boss window (OR-09); Regard ≥ 50 (DR-09); fair or feast Bribe; Mikan then Claim Sprays the Den post. End of Life 2 |
| **Join level** | Mikan's level | Mikan's level | Mikan's level − 1 (min 1) | Own level (Nemesis) | Own level (≈ 6) | Own level (≈ 9) |
| **Starting Loyalty** | **60** fixed (True) | **55** fixed (Steady) | **50** fixed (Steady) | F6 (worked: 36, Aloof) | F6 (worked: 40 fair / 45 feast) | F6 (worked: 56 fair / 61 feast) |
| **Signature perk** | none (story) | none (story) | none (Stray) | Strength → perk *(proposal, from Combat §3.9's menu: **+15% Nerve**)* | *(proposal, menu: **Thick Ruff**, resists Claw ×0.6, covering the Yowler's Claw weakness)* | *(proposal, menu: **immune to Cowed**; no effect on knock-offs or stagger. Never "cannot be knocked off": Combat §3.13 forbids it on Daifuku)* |
| **Fear (kept)** | — | — | — | *(proposal)* Cucumbers | *(proposal)* Loud Noise | *(proposal)* Water (the bucket) |
| **Arrives knowing** | Belly Flop, Shoulder Check | Purr, Withering Hiss | Face Swat, Bunny-Kick | Nemesis kit (Tough: 2 Moves) | Nemesis kit (Captain: 4 Moves, incl. **Banshee Screech**) | Authored Boss kit (incl. **Sit On It**) |
| **Bonds / clashes in the six** | ♥ Fraidy, Goofball, Brooder · ✗ Schemer | ♥ all but Brooder · ✗ Brooder | ♥ Stalwart, Schemer, Goofball · ✗ Braggart | ♥ Goofball · ✗ Fraidy | ♥ Fraidy, Goofball · ✗ Brooder, Stalwart | ♥ Stalwart · ✗ Schemer, Goofball |
| **Tags (OR-04 slice seeds)** | Ex–Wall Sitter: **Old Boss** Daifuku (authored) | — | **Kin** Sasa (a Wall Sitter) | **Boss** Daifuku; **Rival** Goma | **Boss** Daifuku; **Rival** the second Captain | **Gang** (the Wall Sitters) |
| **Old Gang Nerves (OR-06)** | Authored `OLD_GANG(daifuku)` from the start; Stalwart **resists**: "Not your cat anymore." | — (no old gang) | — (a Stray; no gang) | Gains `OLD_GANG(daifuku)` on recruit; Braggart **resists** | Gains `OLD_GANG(daifuku)` on recruit; Schemer **susceptible**: Cowed 20 s in the Daifuku fight unless Sworn; a Tag-In steadies Kagi | — (he was the Boss) |
| **The other Verdicts (OR-12–14)** | — | — | — | **Chase Off:** Gone for good; his arc closes "Run out of town"; no other cat becomes the lead. **Nose-Touch** (gate 45; open on Life 1 day 2 after a clean Pile-On, pending Grudge 43): 10-day truce, normally declared a Sworn Rival; may join Mikan's fights against Goma (§3.5.7) | **Chase Off:** Gone. **Nose-Touch** (gate 50): truce; may join fights against the second Captain | **Chase Off:** Gone. **Nose-Touch** (gate 45): steps down into a 10-day truce; no Rival tag, so no join-in |
| **Betrayal (OR-11)** | Never (story) | Never (story) | Never (Friend Stray) | Eligible when posted and Shifty (§3.7.4); posting is what he hates | Eligible when posted below 35 (Schemer) | Eligible in principle; joins at the end of Life 2, so not reachable in the slice |
| **Hook in one line** | The bodyguard who taught you to smell the street, and once sat on Daifuku's wall | Prop chaos and the reason everyone gets along | The skittish lookout who never gets flattened | Your first enemy, now your loudest friend | The clever one who brings the screech, and friction, and a flinch at the old boss | The old king who never comes down off the walls until the Lane smells of you, and only warms to the cat who earned it |

**What the roster asks of the player.** The comfortable "family" Posse (Hige + Pon + Kinako) is all-bonded but has no Frazzle opener and no Pay-off specialist. The "Rival" Posse (Togemaru + Kagi + Pon) hits harder at Captains and is bond-linked through Pon, but leaves Hige or Kinako to guard. With 6 cats, 3 Posse places and 2 Sentry slots, exactly one cat lounges every day: never Pon (−2), and not Togemaru for long (−2 from day 3). Posting Togemaru with Kinako (clash) costs both; posting Hige with Daifuku (bond) earns both. In the Daifuku fight the Posse shows both halves of Old Gang Nerves: Hige and Togemaru stare their old boss down, Kagi flinches until the player Tag-Ins to Kagi.

### 3.4 Recruitment (DR-09, deterministic)

**A cat joins the Crew by exactly three routes (C4, OR-12):** (1) the **Recruit Verdict, for a Bribe** (§3.4.1), the only route for Rivals; (2) a **story beat** (Hige, Pon; §3.4.2); (3) the **Friend Stray favour** (Kinako; §3.4.3). Nothing else recruits. A Nose-Touched cat in truce, or a Friend, may fight beside the Posse as an **allied guest** but never becomes Crew (§3.5.7). The former "Comes Knocking" route (a high-Regard cat joining from the Lot) is cut.

#### 3.4.1 From a Verdict (Rivals)
1. **Availability is Nemesis's** (DR-09): held for the Verdict (one full Verdict per fight, for the highest-ranked Routed tracked Rival); Grudge < 90 or Regard ≥ 50; Bosses need Regard ≥ 50; room in the Crew, or the player makes room (§3.4.4). **The arc lead (Togemaru) may be recruited**, declared or not (OR-15); Recruit is no longer greyed for him.
2. **Recruit is the Verdict that costs Morsels** (OR-12): the Bribe (price formula F8; the price sheet is Territory's, DR-14) is offered as **fair / feast**, paid **from the Stash**. There is **no "none" option** from Life 2: a Rival joins *for a Bribe*. An option the Stash cannot cover is greyed; if fair is uncovered, Recruit itself is greyed with its price ("A fair Bribe is 96 Morsels"), and Chase Off and Nose-Touch stay open. The Bribe step changes only starting Loyalty (F6), never whether the cat joins.
3. **Life 1 recruits are free** (DR-09, PP-07): the Bribe row is hidden in Life 1 and `bribe_step = 1` is applied (treated as fair). Bribes are introduced in Life 2.
4. The Verdict **always succeeds** when offered. There is no Willingness roll and no Fear penalty. The prompt shows the Rival's eyes and lean as the readout of the resulting starting Loyalty tier (the Bribe band; UX owns the art; no number).
5. **The post clears** (OR-12): the recruit leaves its post and Territory offers Claim Spray at once. No other cat moves up, in or over.

#### 3.4.2 Story recruits
Fixed: they join at their beat, at Mikan's level, with fixed Loyalty (Hige 60, Pon 55) and no Bribe. They cannot be released in the slice.

#### 3.4.3 Friend Stray (one-time favour, DR-18)
Kinako is found by a Whisker Sense scent trail in Life 2 day 1 (UX/Level place it). **The favour is Life 2 day 1's required first objective: the Lot opens after it**, so it cannot be skipped and every player has a 4-cat Posse before Life 2 day 2 teaches the Relay (Combat §3.16, DR-01). The favour: drive off the crows harrying it at its hiding place (a Critter fight), then press **Interact (North / E) within 4 m**, which plays Mikan's slow-blink gesture; Kinako follows. (Not hold Sit, which is Head Home under DR-08, and not Slow Blink, which is the combat tactical mode.) It follows Mikan to the Lot and joins, Loyalty 50. No daily Trust pips, no food, no roll. Strays have no signature perk.

#### 3.4.4 Join step, full Crew and release
1. The joining cat keeps `name, title, coat_seed, style, personality, level, xp, traits, memory, relations[], signature_strength` and its kit (into `known_moves` and slots). `rank` is cleared; `former_rank` is set by Nemesis; `clowder = Bell`; `assignment = lot`; `loyalty` per F6 or the fixed value; `wavering_nights = 0`. Emits `CatRecruited(cat_id, origin)`.
1a. **Old gang (OR-04, OR-06).** On `CatRecruited`, if the cat belonged to a gang with a Boss, Nemesis writes `OLD_GANG(boss_id)` into the **recruit's own Memory** and sets `old_gang_nerves` = true unless its personality resists (**resist: Braggart, Stalwart, Brooder; susceptible: Schemer, Fraidy, Goofball**). The Boss's record never changes. Hige's entry is authored from the start. A Stray or a Boss has no entry. Both values are fixed from then on; only the cat's own Loyalty can override the flinch (Sworn, below).
   - **What it does in a fight** (Combat owns the values): when the recruit is in the Posse and sees its Old Boss among the opponents, *its own* reaction plays at the Standoff (ears flat, a flinch, its own line from its own memory). A susceptible cat below **Sworn (< 80)** is **Cowed for 20 s (Fraidy 30 s)** and its AI will not target the Old Boss; **a Tag-In to it clears Cowed at once** with a "steeled" bark. A resisting or Sworn cat plays a defiant line of its own and gets no status. The Old Boss behaves exactly as it would against any Posse.
   - **Shown on the Crew card** (UX): an **old-gang stamp**, the Old Boss's mark in faded paint with its portrait, plus a flinch glyph (susceptible) or a raised-chin glyph (resisting, or Sworn). The Rivals board shows the Old Boss / Old Gang tag on hover (UX, from the recruit's data).
2. If the Posse has fewer than 3 Crew, the new cat is offered a Posse place on the spot.
3. **Crew cap** comes from Territory's Clout table (slice: **6**; Mikan does not count). The slice has exactly 6 recruitables, so the cap is never exceeded in normal play; the rule below still ships.
4. **"Recruit — make room" (DR-34):** at a full Crew the Verdict shows Recruit with a short list of **Lounging** cats to release. Release at **Loyalty ≥ 60** is a clean parting (Nemesis sets Grudge 0, Regard +10). **Below 60 the cat is Gone** (OR-14): it leaves Yunagi for good, keeps a legend card on the Rivals board and never returns. The same release is available at the Lot, and the release prompt names which of the two it will be.
5. **Origin rules on release:** story recruits cannot be released in the slice; a Friend Stray released at ≥ 60 returns to its hiding spot, untracked, and can rejoin once with `returned = true`; below 60 it is Gone like any cat.
6. Leaving the Crew happens only by **release** or **betrayal** (live from Life 2 for posted ex-Rival recruits, §3.7.4). A cat that leaves takes its own `known_moves`; Moves it taught stay with the learners.

### 3.5 Crew, Posse and guard duty

Every Crew cat has exactly one `assignment`:

| Assignment | Slice count | What it does | XP | Loyalty (base, DR-11) |
|---|---|---|---|---|
| **Posse** | Mikan + up to 3 | Fights; AI by personality when not controlled | Full (F3) | +2 per day in the Posse |
| **Sentry** | **2 slots** in the slice (Territory) | Guards a Patch overnight; raid resolution is Territory's, reading `PowerRating` (F9) and the personality guard perk | Sentry XP (F4) | +1 if the district was `seen` within 3 days; −1 × m if unseen > 3 nights |
| **Warden** | The Den's first Sentry slot; True+ only (DR-10) | As Sentry | As Sentry | As Sentry |
| **Lounging** | the rest | Nothing | 25% share (F3) | 0 (Goofball −2) |

1. **Posse growth (PP-08, PP-09, DR-22):** Mikan + Hige by ≈ minute 10 (two-cat Pile-On by minute 15); + Pon on Life 1 day 2 (three cats); + Kinako on **Life 2 day 1** (four cats, before Life 2 day 2's Relay lesson). Kinako's favour is that day's required first objective (§3.4.3), so the 4-cat Posse is guaranteed whether or not the player recruits a Rival.
2. **Changing the Posse at the Lot:** free, any number of times.
3. **Tail-Up (DR-38, PP-31; UX shows it as the in-field swap):** outside the Lot, D-pad Left/Right opens the picker. Mikan raises tail and chirps; the outgoing cat peels off towards the Lot and the chosen cat arrives over the High Road in ≈ 5 s. Only **Lounging** cats can be called; posted cats show greyed (un-post them at the Turf Board). Not during an encounter, Standoff or Verdict; not inside Haru's wall; **30 s cooldown**; a Routed cat cannot be called until it recovers (Sunspot nap or home). There is no mid-fight bench swap (DR-29).
4. A cat brought in arrives with the Nerve it last had today; Zoomies gauges are Combat's.
5. Mikan cannot leave the Posse.
6. **Posting** is done at the Turf Board (Territory). This doc only supplies the Loyalty and XP consequences and the personality guard perk's identity.
7. **Allied guests: the Nose-Touched cat (OR-13; not Crew).** From Life 2, at `EncounterStarted`, Nemesis may roll a **join-in** for a cat in `Truce` (10 days) or a Friend, in the same district, when an opponent in the encounter is tagged its **Rival** (p 0.35–0.65, seeded; ≤ 1 joiner per encounter, ≤ 1 join per cat per day). The joiner is a **temporary fight ally, never Crew**:
   - **In the fight** (Combat owns): it arrives after a 3 s yowl over the High Road as an **allied AI guest**. It is not controllable (no Tag-In, no Slow Blink commands), takes no part in the Pile-On, and counts toward the 10-combatant cap. It fights by **its own personality's "Fights like" row** (§3.2.1) with its own Rival kit, so a Stalwart guest shields the controlled cat and a Fraidy guest hangs back: personality is the hook here too. Its Nemesis Strength stays a Rival trait; it becomes a signature perk only on recruitment.
   - **Outside the Crew:** it has no `assignment`, Loyalty, Crew XP, Moves slots or Lessons; it never takes a Crew-cap slot, a Posse place or a Sentry slot; it never appears in the Posse picker, Tail-Up or the Turf Board Crew strip; it cannot Waver or betray. The social matrix (§3.2.2) does not apply to it. When the encounter ends it leaves and resumes roaming its district.
   - **G10:** no Crew cat's Loyalty, assignment or AI reads a join-in or `AllyJoined`. The opposing Rival is untouched (Combat, G7). The only cat a join changes is the joiner (Nemesis: +5 Regard if the Posse wins).
   - **How it is shown** (UX/HUD owns the art): a **truce sprig** above its head and a guest name-plate in its own coat colours, never bell-gold; a small sprig-marked portrait after the Posse row with no Paws gauge; `AllyJoined(cat_id, encounter_id)` drives the yowl and the arrival. On the Rivals board it keeps its own section and the truce sprig; it never moves to the Bell fence.
   - **Becoming Crew:** only through a Recruit Verdict (§3.4.1). A Friend is never hostile, so it stays a Friend; a truce cat whose truce ends below Regard 75 becomes a challenger and can be fought and Verdicted like any Rival.

### 3.6 Stats, levels and XP (slice range Lv 1–10)

1. Five stats: **Nerve, Bite, Hide, Voice, Zip.** A stat is a pure function of level and Style (F1). Personality, Loyalty and Bribes never change stats. Nothing is bought, equipped or rolled.
2. **Style weights (budget-5 rule):** every row sums to 5.00; a Style redistributes, never adds power. Nerve 0.80 (Prowler) and 1.30 (Bruiser) are canon.

| Style | Nerve | Bite | Hide | Voice | Zip | Reads as |
|---|---|---|---|---|---|---|
| **Bruiser** | 1.30 | 1.00 | 1.25 | 0.75 | 0.70 | A warm, immovable lump |
| **Scrapper** | 1.00 | 1.20 | 0.90 | 0.75 | 1.15 | All elbows |
| **Yowler** | 0.90 | 0.75 | 0.95 | 1.35 | 1.05 | A voice with a cat attached |
| *Prowler (Backlog)* | 0.80 | 1.30 | 0.75 | 0.85 | 1.30 | Glass with claws |
| *Trickster (Backlog)* | 0.90 | 0.95 | 0.90 | 1.15 | 1.10 | A bit of everything |

3. Stats are recomputed only at level-up and at recruitment, never mid-encounter. When max Nerve changes, current Nerve keeps its percentage.
4. **XP is not split.** Every Posse cat gets the full award for every enemy Routed in a won encounter (`outcome = win` or `rival_fled`), once, at encounter end. A Posse cat Routed during it gets 50%. Lounging cats get 25%. Posted cats get Sentry XP instead. On `loss` or `player_fled`: none.
5. **Level-difference multiplier** (F3) is both catch-up (a cat behind the Posse levels fast) and anti-grind brake.
6. **Turf XP** (F5): Patch captured → the Posse gains a flat award; `DistrictClaimed` → every Crew cat gains 50% of its own `xp_to_next`.
7. Level-ups resolve at encounter end; one encounter pays at most 2 levels' worth. No XP items; Morsels buy Lessons and Bribes, never levels.
8. **Slice level cap: 10** (`SLICE_LEVEL_CAP`); XP stops at the cap. Rivals and Strays use the same curves; Combat applies rank multipliers on top. **Exception (Combat §3.12):** while a Rival is a Captain, Combat uses Nerve weight 1.0 instead of its Style's; once recruited it uses its Style row like any Crew cat.
9. **Pacing target (DR-38):** Life 1 ends at Lv 3; the Posse is **Lv 7–9 at the Daifuku fight**; Lv 8 at Life 2's end (brief §8). Derivation in F2.
10. **Mikan** uses the Scrapper row, 2 Paws in the slice (Combat), no age modifier in the slice (ageing is Backlog).

### 3.7 Loyalty (DR-10, DR-11)

1. Loyalty 0–100 per Crew cat. Updated once per day at **Night Shuffle step 1** (DR-13) from that day's events (F7). Written by this doc, read by Nemesis (`Loyalty(cat_id)`) and Territory.
2. **Tiers and gates:**

| Tier | Range | Gates |
|---|---|---|
| **Shifty** | 0–29 | Cannot teach; no Warden. From Life 2, a **posted ex-Rival recruit** here (a Schemer below 35) is betrayal-eligible (§3.7.4) |
| **Aloof** | 30–44 | Cannot teach; no Warden |
| **Steady** | 45–59 | **Can teach Lessons** |
| **True** | 60–79 | Can teach; **Warden-eligible**; release is a clean parting |
| **Sworn** | 80–100 | As True (heir eligibility: Backlog) |

3. Loyalty never changes stats, Moves, level or XP. It is shown on the Crew card and the Turf Board as the cat's pose and tier name (UX), **never as a number** (presentation ruling R3).
4. **Rare recruit betrayal (C3, OR-11; live from Life 2).** Driven only by the betraying cat's own state over time; this doc owns the thresholds (F11), Nemesis owns the event.
   - **Eligible** at Night Shuffle step 1 only when **all** hold: Life ≥ 2; `origin = rival` (an ex-Rival recruit; story recruits and the Friend Stray never betray); `assignment` is a Sentry post **other than Low Wall Corner (Home Ground) or the Den**; Loyalty **< 30 (Schemer < 35)**.
   - **Counting:** step 1 sets `wavering_nights` +1 if eligible, else 0.
   - **Warning:** each morning after a night with `wavering_nights` 1 or 2, the cat is **Wavering**: a Sniff item, a turned-away pose on the Turf Board Crew strip and the Rivals board, and a Turf Board line saying what fixes it ("Kagi won't look at you. Bring Kagi in, or feed the Crew.").
   - **Defection:** at step 3 of the **third** consecutive eligible night (`wavering_nights` = 3), Nemesis emits `BetrayalTriggered(crew_id, patch_id)`. The cat leaves the Crew (taking its own `known_moves`; Moves it taught stay) and becomes the **Keeper of the Patch it guarded** at rival Scent 40, shown in the Rivals board's Outsiders section. Its Memory, Scars and Title stay its own. No other cat changes: the other Sentry, the Posse and the Crew's Loyalty do not react.
   - **Cancelled** by any of: un-posting it, moving it to the Posse, or its Loyalty reaching its threshold (30, Schemer 35). Every cure is a player resource action or the cat's own Loyalty; Share a Morsel (+2, Goofball +4) and a Lesson (Schemer +3) are the cheap ones.
   - **A loss closes the Lot** (OR-01): a Wavering cat cannot be un-posted on the evening of a Posse wipe, so its warning morning is the time to act.
   - **Rate:** 0% of reference-policy slice runs; ≤ 10% under the neglect policy (Lives 1–2 sim). Personality drives who is at risk: a posted Braggart sulks from his 3rd day out of the Posse, a Schemer turns at 35, a Brooder falls (and recovers) at half speed.
5. Loyalty is a live tension in the slice through: low-start Rival recruits (F6), clashes, Braggart/Goofball neglect, Fraidy Routs, the Stalwart's failed posts, the Brooder's half-speed, and, from Life 2, the Wavering warning on a neglected ex-Rival Sentry.
6. **G10 audit: Loyalty inputs keyed to Mikan's dealings with a different cat (OR-11, OR-12; legal note v2 G10).** Every other Loyalty input reads the cat's own experience (its Posse days, posts, Routs, Lessons, Morsels, its own post's raid result) or a player resource action (posting, the Posse, Morsels, Lessons). **The complete list of exceptions, each a '303 watch item, held and not redesigned (v2: "do not redesign yet"); this pass adds none:**

| # | Input | Keyed to | Status |
|---|---|---|---|
| W1 | Schemer **−2 per Nose-Touch Verdict** (max −4/day) | Mikan's Verdict on another cat | '303 watch item (OR-12) |
| W2 | Stalwart **+1 per Nose-Touch Verdict or won Standoff-opened Rival fight** (max +2/day) | Mikan's Verdict on, or fight with, another cat | '303 watch item |
| W3 | Social matrix and Kin bond (§3.2.2): bonded +1 / clashing −1 | Which cats share the Posse or the district: an assignment (a resource action), but the partner exists in the Crew because Mikan recruited it | '303 watch item (OR-05 names the Kin bond) |

   **The betrayal firewall (OR-11's check).** W1 and W2 never move a cat into, out of or within its betrayal band (below 30, Schemer 35): they **count only when the cat's Loyalty is at or above its threshold both before the day and after its own inputs**, and even then **cannot take it below the threshold** (F7, betrayal firewall). So no Verdict on cat X can start, advance, delay or cancel cat Y's Wavering or betrayal. W3 is a resource action and is not fenced. The Stalwart's dislike (its own post Scuffed or Lost) is its own experience and is not on the list. No join-in, Verdict, loss or anger change ever writes a Crew cat's Loyalty except as listed here, or through that cat's own Rout in a lost fight (AC-19).

### 3.8 Moves: learnsets, Instinct, Lessons and slots (DR-05, DR-38)

**Combat owns every Move definition and number.** This doc owns only the learnset table `assets/data/crew/learnsets.*`, keyed by `move_id`: `styles[], source, rank, instinct_level`. The ids below are the slice's 12 Moves of **Combat §3.10, which is canonical**; and if Combat renames or replaces a Move, the row follows the id. Every slice Move is a Set-up or a Pay-off (Combat's tag); AI cats fire Pay-offs on their own and Set-ups only when commanded (DR-29), so which Moves you slot on an AI cat matters.

#### 3.8.1 Slice learnsets (12 Moves)

| move_id | Native Style | Paws (Combat) | Rank | Instinct level (native) | Cross-Style learners (Lesson only) |
|---|---|---|---|---|---|
| `face_swat` | Scrapper | 1 | I | 1 | — |
| `bunny_kick` | Scrapper | 1 | I | 1 | Yowler |
| `scruff_toss` | Scrapper | 1 | II | 4 | Bruiser |
| `shred` | Scrapper | 2 | II | 7 | — |
| `belly_flop` | Bruiser | 1 | I | 1 | Yowler |
| `shoulder_check` | Bruiser | 1 | I | 1 | Scrapper |
| `puff_up` | Bruiser | 1 | II | 4 | — (Combat gives the Yowler no Ruffle Move) |
| `sit_on_it` | Bruiser | 2 | II | 7 | — |
| `purr` | Yowler | 1 | I | 1 | — |
| `withering_hiss` | Yowler | 1 | I | 1 | Scrapper |
| `howl` | Yowler | 1 | II | 4 | Bruiser |
| `banshee_screech` | Yowler | 2 | II | 7 | — |

Shape: each Style grows into two Rank I Moves at Lv 1, a Rank II at Lv 4 and its 2-Paw capstone at Lv 7. Each Style can be taught exactly **two** foreign 1-Paw Moves; 2-Paw capstones never cross for Crew cats. **Mikan can learn any of the 12.**

#### 3.8.2 Instinct
A cat adds a native Move to `known_moves` automatically on reaching its `instinct_level` (or on joining at or above it). Free. Shown as a Lot notification next morning.

#### 3.8.3 Lessons (the teaching route)
1. **Where/when:** at the Lot (clock paused), **from Life 2 day 3** (Day Loop §3.9's teaching ladder, one new system a day per DR-22). Taking or giving a Lesson costs no clock time.
2. **Teacher:** any cat that has the Move in `known_moves`. A Crew teacher must be **Steady+**. **Mikan teaches up to 3 Lessons a day; every other cat 1** (DR-38).
3. **Learner:** any Crew cat or Mikan whose Style is the Move's native Style or listed as a cross-Style learner (Mikan: any Move). Learner level ≥ 1 for Rank I, ≥ **4** for Rank II.
4. **Price** (Territory's sheet, DR-14; F10): Rank I 40, Rank II 120 Morsels, ×1.5 if cross-Style for the learner. Paid from the Stash.
5. **Effects:** the Move enters the learner's `known_moves` at once. Learner Loyalty +1 (Schemer +3), **counted once per learner per day**.
6. **Mikan as the library:** Mikan can learn from any Crew teacher, then teach it onward three times a day. This is how a Move brought in by one recruit spreads through the Crew (e.g. Kagi teaches Banshee Screech to Mikan, who teaches it to Pon the same morning, at Lv ≥ 4).
7. **Capstone early:** a native capstone (Rank II, instinct Lv 7) can be taught from Lv 4 by anyone who knows it. In the slice the first teachers are Kagi (arrives with Banshee Screech), Daifuku (Sit On It) and any cat that reaches Lv 7.
8. No Pending list, no refresher fee, no last-copy rules (DR-38). Known Moves are never lost.

#### 3.8.4 Slots
1. **4 Move slots** per cat (canon). At the Lot, any known Move can be slotted or unslotted for free.
2. **Mikan may slot at most 2 cross-Style Moves** (DR-33); the other slots hold Scrapper Moves. There is no hidden potency penalty (and Combat has no Style passive to withhold).
3. Slots change only at the Lot. A Tail-Up'd cat arrives with its current slots.
4. **Zoomies** (Combat owns the three slice Zoomies and their gauges; Zoomies tiers are cut, CP-14): Mikan's unlocks on **Life 2 day 3**, where Combat §3.16 teaches Zoomies (on the Captain); a Crew cat's unlocks at **Lv 6**. One per Style; no Zoomies II.

#### 3.8.5 Rival kits (service to Nemesis/Combat, CP-X9)
`DefaultKit(style, level, rank)`: Nemesis sets the count (Tough 2 Moves, Captain 4, Boss authored). Crew's selection rule: the cat's native Moves whose `instinct_level ≤ level`, most recent first; a Captain whose native list is short of 4 fills with its Style's capstone. So a Lv 6 Yowler Captain carries Purr, Withering Hiss, Howl and Banshee Screech, and recruiting it brings the capstone two levels early. Knacks are Backlog.

### 3.9 Protagonist share (DR-33, CP-5, PP-20)

Mikan's ceiling is held by rules the player can read: 2 cross-Style slots max; the same 2 Paws as everyone in the slice; no Loyalty or personality perk; control passes to the **next slot**, not to Mikan, when the controlled cat is Routed (Combat). The Crew's edge is personality perks, signature perks, bonded Tag-Ins and Old Scores, none of which Mikan has. Acceptance is Combat's sim (Crew ≥ 55% of Posse damage).

---

## 4. Formulas

`round()` is round-half-up. Constants in CAPS are tuning knobs (§7).

### F1. Stat value

```
stat(cat, s) = round( base_s(L) × STYLE_W[style][s] )
base_nerve(L) = NERVE_L1 + (NERVE_L30 − NERVE_L1) × (L − 1) / 29
base_other(L) = STAT_L1  + (STAT_L30  − STAT_L1)  × (L − 1) / 29
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| L | int | 1–10 (slice) | Level |
| s | enum | nerve, bite, hide, voice, zip | Stat |
| NERVE_L1, NERVE_L30 | int | 100, 1500 | Canon Style-neutral Nerve endpoints (brief §8) |
| STAT_L1, STAT_L30 | int | 10, 100 | Canon endpoints for the other four |
| STYLE_W | float | 0.70–1.35 | §3.6 table |
| stat | int | Nerve 90–695; others 7–51 (slice Styles, Lv 1–10) | Final stat |

**Output range.** Bounded, never ≤ 0. Nerve minimum **90** (Lv 1 Yowler, 100 × 0.90), maximum **695** (Lv 10 Bruiser, 534.5 × 1.30). Other stats minimum **7** (Lv 1 Bruiser Zip, 10 × 0.70), maximum **51** (Lv 10 Yowler Voice, 37.9 × 1.35). Signature perks such as +Nerve are applied by Combat afterwards.

| L | 1 | 3 | 5 | 7 | 8 | 10 |
|---|---|---|---|---|---|---|
| base_nerve | 100 | 197 | 293 | 390 | 438 | 534 |
| base_other | 10.0 | 16.2 | 22.4 | 28.6 | 31.7 | 37.9 |

**Worked example.** Hige, Lv 5 Bruiser: base_nerve = 100 + 1400 × 4/29 = 293.1 → Nerve 293.1 × 1.30 = **381**; base_other = 22.41 → Bite **22**, Hide **28**, Voice **17**, Zip **16**.

### F2. XP to next level

```
xp_to_next(L)      = tough_yield(L) × fights_per_level(L)
tough_yield(L)     = YIELD_BASE + YIELD_PER_LEVEL × L
fights_per_level(L)= FPL_START + FPL_RAMP × (L − 1)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| L | int | 1–9 | Current level (no value at the cap 10) |
| YIELD_BASE, YIELD_PER_LEVEL | int | 8, 4 | XP for Routing one same-level Tough |
| FPL_START, FPL_RAMP | int | 4, 2 | Same-level Tough-equivalents (TE) per level: 4 at Lv 1, +2 per level |
| xp_to_next | int | 48–880 | XP from L to L+1 |

**Output range.** Bounded: **48** at Lv 1 (12 × 4) to **880** at Lv 9 (44 × 20). Strictly increasing.

| L | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| TE per level | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 |
| xp_to_next | 48 | 96 | 160 | 240 | 336 | 448 | 576 | 720 | 880 |
| cumulative to reach L | 0 | 48 | 144 | 304 | 544 | 880 | 1,328 | 1,904 | 2,624 |

**Pacing derivation (CP-11, includes Turf XP).** Supply assumption A-1: 4–6 fights a day (DR-16) at ≈ 2.5 TE each (mixed Tough/Stray groups, crows ×0.5) ≈ **12.5 TE/day**; the two Captains add 6 TE each; each Patch capture adds 2 TE (F5).
- **Life 1** (2 days, tutorial-light ≈ 5.5 TE/day + Low Wall Corner capture 2 TE ≈ 13 TE) vs need Lv 1→3 = **10 TE** → Lv 3 ✓.
- **Life 2** before Daifuku (median 4.5 days): 4.5 × 12.5 + 12 (Captains) + 6 (3 captures) ≈ **74 TE**; need Lv 3→8 = **60 TE** → Lv ≈ 8.6 at Daifuku once diff_mult < 1 against Lv ≤ 8 trash slows the last level. Light play (4 fights × 2 TE, 4 days): 32 + 12 + 6 = 50 TE → **Lv 7.4**. Heavy play (6 days × 15 TE): ≈ 108 TE raw, damped by diff_mult (0.70–0.85 at Lv 9 vs Lv 7–8 enemies) → **≈ Lv 9.3**. Band 7–9 at Daifuku holds for light-to-normal play; heavy play touches the top (AC-6 checks it in the economy/encounter sim).

**Worked example.** Lv 6: tough_yield = 8 + 24 = 32; fights_per_level = 4 + 10 = 14; xp_to_next = **448**.

### F3. XP award

```
xp_award(cat, enemy) = max( 1, round( tough_yield(L_enemy) × RANK_XP[rank] × diff_mult × share ) )
diff_mult = clamp( 1 + DIFF_SLOPE × (L_enemy − L_cat), DIFF_MIN, DIFF_MAX )
per encounter: total = min( Σ xp_award, AWARD_CAP_LEVELS × xp_to_next(L_cat) )
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| L_enemy, L_cat | int | 1–10 | Levels |
| RANK_XP | float | Stray/Tough 1 · Captain 6 · Boss 20 · crow 0.5 | Rank weight |
| DIFF_SLOPE | float | 0.15 | Per level of difference |
| DIFF_MIN, DIFF_MAX | float | 0.25, 2.0 | Floor (5+ under), cap (7+ over) |
| share | float | 1.0 standing Posse · 0.5 Routed in Posse · 0.25 Lounging · 0 posted | Participation |
| AWARD_CAP_LEVELS | int | 2 | Max levels' worth per encounter |
| xp_award | int | 1–1,920 before cap | XP for one Routed enemy |

**Output range.** Clamped below at **1** (a Lv 1 crow at the floor with 0.25 share rounds to 1). Uncapped maximum **1,920** (a Lv 10 Boss seen by a cat 7+ levels under: 48 × 20 × 2.0 × 1.0), then limited by the per-encounter cap (at most 2 × 880 = **1,760**).

**Worked example.** A standing Lv 5 Bruiser helps Rout a Lv 6 Captain: 32 × 6 × 1.15 × 1.0 = **221 XP** (66% of 336). Lounging Lv 4 Kinako hears of it: 32 × 6 × 1.30 × 0.25 = **62 XP**. **Catch-up check:** a Lv 4 cat joining Lv 7 fights earns tough_yield(7) 36 × 1.45 = 52 per Tough vs need 240 → 4.6 TE per level instead of 10. **Grind check:** a Lv 9 cat farming Lv 3 Toughs: 20 × 0.25 = 5 XP vs 880 → 176 fights per level.

### F4. Sentry XP

```
sentry_xp(cat) = round( SENTRY_TE × tough_yield(L_patch) × diff_mult(L_patch, L_cat) )   per night the post is held
               + Σ xp_award(cat, raider) with share = 1.0                               on a won raid defence
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| SENTRY_TE | int | 4 | TE per quiet night (≈ ⅓ of a Posse day) |
| L_patch | int | 1–8 | Patch level (Territory; default band midpoint 4) |
| diff_mult | float | 0.25–2.0 | As F3 |
| sentry_xp | int | 12–320 per quiet night | Nightly XP |

**Output range.** Bounded: minimum **12** (L_patch 1, cat 5+ levels over: 4 × 12 × 0.25), maximum **320** (L_patch 8, cat 7+ levels under: 4 × 40 × 2.0). Raid-defence awards add F3 values on top.

**Worked example.** Lv 5 Hige on a Lv 4 Patch: 4 × 24 × 0.85 = **82 XP** per night (24% of 336). Posting costs XP; diff_mult repays it when the cat returns to the Posse.

### F5. Turf XP

```
turf_xp(cat) = round( TURF_TE × tough_yield(L_patch) )        to each Posse cat, on PatchChanged(new = Bell)
claim_xp(cat) = round( CLAIM_SHARE × xp_to_next(L_cat) )       to every Crew cat and Mikan, on DistrictClaimed
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| TURF_TE | int | 2 | TE per captured Patch |
| CLAIM_SHARE | float | 0.5 | Half a level on claiming the district |
| turf_xp | int | 24–80 | Per capture (L_patch 1–8) |
| claim_xp | int | 24–440 | Per claim |

**Output range.** Bounded by the inputs: turf_xp 24 (L_patch 1) to 80 (L_patch 8); claim_xp 24 (Lv 1) to 440 (Lv 9). Not subject to the encounter cap.

**Worked example.** Capturing a Lv 5 Patch: 2 × 28 = **56 XP** to each Posse cat.

### F6. Starting Loyalty (canon formula, DR-09)

```
L0 = clamp( L0_MIN, L0_MAX, 50 − 0.4·G_pre + 0.3·Regard + P_mod + 5·bribe_step − 20·returned )
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| G_pre | int | 0–100 | Grudge **before** Nemesis's recruit halving |
| Regard | int | 0–100 | Nemesis's respect meter |
| P_mod | int | Goofball +10 · Stalwart +5 · Braggart 0 · Fraidy 0 · Schemer −5 · Brooder −5 | Personality term (this doc owns) |
| bribe_step | int | 1 fair · 2 feast (Life 1: always 1, free). No "none" step: Recruit is for a Bribe (OR-12) | Bribe |
| returned | bool | 0/1 | Was Crew before |
| L0_MIN, L0_MAX | int | 5, 80 | Canon clamp |
| L0 | int | 5–80 | Starting Loyalty for Rival recruits |

Fixed values (not F6): story recruits Hige 60, Pon 55; Friend Stray 50.

**Output range.** Clamped 5–80. Unclamped extremes: maximum 50 + 30 + 10 + 10 = **100** (G 0, Regard 100, Goofball, feast) → 80; minimum under the availability gate (G ≥ 90 needs Regard ≥ 50): 50 − 40 + 15 − 5 + 5 − 20 = **5**; without the gate the expression could reach −10, which the clamp absorbs.

**Worked examples.** Togemaru, the First Thorn (G_pre 55, Regard 10, Braggart, Life 1): 50 − 22 + 3 + 0 + 5 = **36** (Aloof: cannot teach yet). Kagi (G_pre 40, Regard 20, Schemer, fair): 50 − 16 + 6 − 5 + 5 = **40**; feast **45** (Steady: can teach Banshee Screech at once; that is what a feast buys). Daifuku (G_pre 30, Regard 60, Brooder, fair): 50 − 12 + 18 − 5 + 5 = **56**; feast **61** (True: Warden-eligible).

### F7. Daily Loyalty change

```
raw   = Σ base_events + Σ personality_events + Σ social_events
Δ     = clamp( raw, −DAILY_CAP, +DAILY_CAP ) × speed + brooder_service
loyalty_accum' = clamp( 0, 100, loyalty_accum + Δ );  loyalty = floor(loyalty_accum')
speed = 0.5 for Brooder, else 1.0;   brooder_service = +1 on every 3rd consecutive night on the same post (Brooder only), else 0
```

Base events (DR-11): in the Posse that day (in the Posse at the start of any encounter, or at the Night Shuffle) **+2** · posted and district `seen` within 3 days **+1** · posted and unseen > 3 nights **−1 × m** (m = 1 story/Stray/ex-Tough, 1.5 ex-Captain, 2 ex-Boss) · Share a Morsel **+2** · Lesson taken **+1** (once/day) · Routed in a lost fight **−3** (per fight).
Personality events: §3.2.1 Loyalty bullets (Braggart +1/−2; Brooder −10 raw for dismissal from a held post; Schemer +2 extra per Lesson, −2 per Nose-Touch max −4 [W1]; Fraidy +1 / −2 per Rout; Stalwart +1 per Nose-Touch or won Standoff-opened Rival fight, max +2 [W2], / −3 for a Scuffed or Lost night on its own post; Goofball +2 extra Morsel / −2 Lounging).
Social events: +1 per bonded partner (Kin counts as bonded) posted in the same district (per night); −1 per clashing partner "together".

**Betrayal firewall (§3.7.6; OR-11).** Split the day's events into `raw_watch` (W1 + W2) and `raw_own` (everything else). Let `T` = 35 for a Schemer, else 30 (`WAVER_T`), `L` = Loyalty before the day, and run the three lines above twice: `L_own` with `raw_watch` = 0 and `L_all` with both.
```
L' = L_own                 if L < T or L_own < T      (watch inputs ignored inside or entering the band)
L' = max( L_all, T )       otherwise                   (watch inputs apply, but never take the cat below T)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| raw | int | −20 to +14 (theoretical) | Sum of the day's events |
| DAILY_CAP | int | 8 | Max movement per day before speed |
| speed | float | 0.5, 1.0 | Brooder half-speed |
| brooder_service | int | 0, 1 | Long-service reward (not halved) |
| Δ | float | −8 to +8 (Brooder −4 to +5) | Applied change |
| loyalty | int | 0–100 | Displayed value (tier) |

**Output range.** Δ is clamped to ±8 (Brooder −4 to +5); Loyalty is clamped 0–100. Realistic raw maxima sit at +7 (Goofball: Posse 2 + Morsel 4 + Lesson 1; Schemer: Posse 2 + Morsel 2 + Lesson 3), so the +8 cap only bites on bonded Sentries with stacked events. Raw minimum ≈ −20 (a Fraidy Routed in three lost fights while clashing), which the cap holds at −8. No unusable values.

**Worked example (a Life 2 day).** Posse: Togemaru, Kagi, Pon; Sentries: Hige and Kinako (district seen); Lounging: none (5 Crew). Share a Morsel given; Mikan Nose-Touches one Rival; Kagi takes a Lesson.
- **Togemaru** (Braggart): Posse 2 + Braggart 1 + Morsel 2 = **+5**.
- **Kagi** (Schemer): Posse 2 + Morsel 2 + Lesson 3 − Nose-Touch 2 = **+5**.
- **Pon** (Goofball): Posse 2 + Morsel 4 = **+6**. (Bonded with Togemaru and Kagi in the Posse: stronger Tag-Ins, no Loyalty.)
- **Hige** (Stalwart): post 1 + Morsel 2 + bond with Kinako 1 + Nose-Touch 1 = **+5**.
- **Kinako** (Fraidy): post 1 + Morsel 2 + bond with Hige 1 = **+4**.
Swap Hige for Togemaru on the post and Togemaru/Kinako clash: Togemaru post 1 + Morsel 2 − clash 1 = +2 (and −2 from day 3 out of the Posse), Kinako +2.
Firewall check: Kagi starts at 40 and `L_own` = 47, both ≥ 35, so W1 applies (−2 → +5); Hige is far above 30, so W2 applies. Had Kagi started the day at 34, W1 would be ignored and only Kagi's own +7 would count.

### F8. Bribe (price from Territory's sheet, DR-09/DR-14)

```
bribe_fair  = BRIBE_PER_LEVEL × level × RANK_MULT[rank]
bribe_feast = FEAST_MULT × bribe_fair;  bribe_none = 0
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| BRIBE_PER_LEVEL | int | 8 | Canon |
| level | int | 1–10 | Rival's level |
| RANK_MULT | float | Stray 0.75 · Tough 1 · Captain 2 · Boss 4 | Canon |
| FEAST_MULT | float | 2 | Canon |
| bribe | int | 0–640 | Morsels from the Stash (Life 1: 0) |

**Output range.** 0 (none, or Life 1) to **640** (feast for a Lv 10 Boss: 2 × 8 × 10 × 4). Territory's sheet wins on any difference.

**Worked example.** Kagi, Lv 6 Captain: fair 8 × 6 × 2 = **96**; feast **192**. Daifuku, Lv 9 Boss: fair **288**, feast 576.

### F9. Power Rating (query for Territory and Nemesis)

```
PowerRating(cat) = round( (nerve / PR_NERVE_DIV + bite + hide + voice + zip) × (1 + PR_MOVE × Σ rank(slotted)) )
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| nerve…zip | int | F1 ranges | Final stats |
| PR_NERVE_DIV | int | 10 | Puts Nerve on the other stats' scale |
| Σ rank | int | 0–8 | Sum of Ranks (I = 1, II = 2) over 4 slots |
| PR_MOVE | float | 0.02 | Kit weight |
| PowerRating | int | 50–245 | Single strength number; personality guard perks and rank weights are applied by the caller |

**Output range.** Bounded. Minimum **50** (any Lv 1 cat, empty slots: stat sum 50 for every slice Style because of the budget-5 rule). Maximum **≈ 245** (Lv 10 Bruiser, Σ rank 8: 210 × 1.16 = 243.6 → 244). Shown only on the Turf Board.

**Worked example.** Lv 5 Hige with Belly Flop (I), Shoulder Check (I), Puff Up (II), Howl (II): stats 38.1 + 22 + 28 + 17 + 16 = 121.1 × (1 + 0.02 × 6) = **136**.

### F10. Lesson price (Territory's sheet, DR-14)

```
lesson_price = LESSON_RANK_PRICE[rank] × (CROSS_MULT if cross_style(learner) else 1)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| LESSON_RANK_PRICE | int | I 40 · II 120 | Canon (III/IV Backlog) |
| CROSS_MULT | float | 1.5 | Canon |
| lesson_price | int | 40–180 | Morsels from the Stash |

**Output range.** 40 (Rank I native) to **180** (Rank II cross-Style). **Worked example.** Teaching Howl (Yowler, II) to Hige (Bruiser): 120 × 1.5 = **180**.

### F11. Wavering and betrayal thresholds (this doc owns; OR-11)

```
eligible(cat)        = Life ≥ 2 ∧ origin = rival ∧ assignment ∈ Sentry posts \ {Home Ground, Den} ∧ loyalty < WAVER_T[personality]
wavering_nights'     = wavering_nights + 1   if eligible(cat) at step 1,   else 0
Wavering (shown)     = wavering_nights ∈ {1, …, WAVER_NIGHTS − 1}         (the following mornings)
BetrayalTriggered    ⇔ wavering_nights = WAVER_NIGHTS                     (Nemesis, step 3 of that night)
```

| Symbol | Type | Range | Description |
|---|---|---|---|
| WAVER_T | int | 30 (Schemer 35) | Loyalty threshold; brief §8 canon |
| WAVER_NIGHTS | int | 3 | Eligible nights in a row before defection, giving 2 warning mornings |
| wavering_nights | int | 0–3 | Per cat; resets to 0 the first night it is not eligible |

**Output range.** Boolean per cat per night. At most one betrayal per cat (it leaves the Crew). With 2 Sentry slots, at most 2 per night; in practice ≤ 1 in a slice run, and 0 under the reference policy.

**Worked example (neglect policy).** Togemaru is recruited free on Life 1 day 2 at 36 and ends Life 1 at 39. From Life 2 day 1 the player posts him beside Kinako (a clash) and never feeds the Crew. Nights 1–2: post +1, clash −1 → 39. From night 3 the Braggart's "out of the Posse" −2 bites: 37, 35, 33, 31, then **29 on night 7** → `wavering_nights` 1; Wavering mornings on days 8 and 9; if he is still posted and below 30 on night 9, he takes his Patch. A day in the Posse (+3, and it resets his days out) or un-posting him cancels it at once; Share a Morsel only holds him at 29, because the sulk eats it. For a Braggart the cure is the thing he wants: the Posse. A median Life 2 lasts 4.5–6 days, so this path is reachable only by long neglect: that is the "rare" of C3, and his personality is what drives it.

---

## 5. Edge Cases

| Situation | Resolution |
|---|---|
| Recruit Verdict with a full Crew | "Recruit — make room" lists Lounging cats (§3.4.4). If none is Lounging, the list is empty and Recruit is greyed with the reason "Everyone's busy: bring one home first". Story recruits are never listed |
| The Stash cannot cover fair/feast | Those options grey out; "none" is always available. Life 1 never shows the row |
| Recruited cat's level exceeds `SLICE_LEVEL_CAP` | Kept as is (Daifuku ≤ 10 by Nemesis's Mikan + 3 cap); XP stops at the cap |
| A cat is Tail-Up'd out mid-day | It counts as "in the Posse that day" (+2) if it was in the Posse at any encounter start; Goofball "Lounging" penalty applies only if it was never in the Posse and is not posted at the Night Shuffle |
| Bonded or clashing cat Routed mid-fight | Still "together" for the day; the bonded Tag-In needs both standing (Combat) |
| Clashing pair split before the Night Shuffle | "Together" means both in the Posse at the same encounter start that day, or both posted at the Night Shuffle |
| Brooder moved from one held post to another | Counts as dismissal (−10 raw → −5) and resets `nights_on_post`. Unposting because the Patch was lost is not a dismissal |
| Posted cat's Patch Scuffed or Lost in a raid or to a challenger | Lost: Territory returns it to the Lot. If it was Routed in the raid fight: −3 (and Fraidy −2 extra). A posted **Stalwart** also takes −3 for the failed line on a Scuffed or Lost night (stacks, within `DAILY_CAP`). A Repelled night costs nothing |
| Fraidy never fights that day | No +1 (needs ≥ 1 encounter); no penalty |
| Schemer below 35 / any cat below 30 | Shifty pose and gate limits for every cat. Betrayal-eligible only if it is a posted ex-Rival recruit, from Life 2, on a post other than Low Wall Corner or the Den (§3.7.4). Story recruits, the Friend Stray, Lounging and Posse cats never Waver |
| Wavering cat on a Home Ground or Den post | Not eligible: `wavering_nights` resets to 0. It can never take those Patches |
| Wavering cat moved from one post to another | Still eligible on the new post; the count continues (it is the cat's Loyalty that matters). A Brooder also takes the dismissal hit |
| Both Sentries reach their third eligible night together | Both defect; each takes its own Patch. Neither reacts to the other |
| Posse wipe on a Wavering cat's second warning day | The Lot is closed after a loss (OR-01), so the cat stays posted; the betrayal check runs that night as normal |
| Story recruit or Friend Stray at Loyalty 5 | Never betrays; shows the Shifty pose only |
| Recruit with Life 2+ Stash below a fair Bribe | Recruit is greyed with its price; Chase Off and Nose-Touch stay open. No "none" Bribe exists |
| Recruit's Old Boss is Gone, in truce or in the Crew | Old Gang Nerves never fire: they need the Old Boss among the **opponents** |
| Two recruits from the same gang face their Old Boss | Each reacts from its own flag: one may flinch while the other stares him down |
| Susceptible recruit reaches Sworn (≥ 80) | Plays its defiant line instead; no Cowed. Drops below 80 → flinches again |
| Cowed recruit is not the controlled cat and the player never Tag-Ins to it | Cowed lasts its full 20 s (Fraidy 30 s), then ends; no Loyalty effect |
| Nose-Touched guest joins a fight with a full 10-cat cap | No join (Nemesis/Combat). Nothing changes for the Crew |
| Guest is Routed | It bolts like any cat; no Crew XP, Loyalty or social effect; its truce is Nemesis's |
| Released at Loyalty < 60 | Gone for good (legend card); never rejoins; `returned` is moot |
| Teacher drops below Steady overnight | Lessons already given stand; it cannot teach until Steady again |
| Teacher leaves the Crew | Learners keep the Move. If no remaining cat knows it, it can still be learned by Instinct (native Style) |
| Mikan tries to slot a 3rd cross-Style Move | Slot rejected with the rule shown on the cat card |
| Learner below Lv 4 for a Rank II Move | Lesson greyed with "not ready" |
| Same personality twice (Rivals, post-slice duplicates) | Matrix diagonal applies (Braggart–Braggart clash; Goofball–Goofball bond; others neutral) |
| Share a Morsel when the Stash is short | Unavailable that day (price is Territory's) |
| Several personality events in one day exceed the cap | Clamp to ±8 before the Brooder's halving |
| Crew of fewer than 3 (Life 1) | Posse plays with fewer cats; Pile-On needs ≥ 2 standing (Combat) |
| Posse loses; a Routed Posse cat | −3 for Routed in a lost fight (its own experience, OR-02); XP none; the day ends and the Posse heals at step 0 (OR-01). No Crew cat's Loyalty reads who beat Mikan |
| Daifuku recruited at a patrol stop (end of Life 2) | Joins before the Closing; Mikan Claim Sprays the Den post (`DistrictClaimed`); the slice ends on the title card. His ex-Boss neglect multiplier (2) applies from Life 3. No gang cat changes role (G6) |
| The player never recruits a Rival | The slice still shows all six personalities (three as Rivals); a 4-cat Posse is guaranteed by Kinako, whose favour is Life 2 day 1's required first objective (the Lot opens after it) |
| The player tries to go to the Lot before Kinako's favour on Life 2 day 1 | The Lot is closed until the favour is done; the scent trail is the day's first objective marker |
| Released Friend Stray rejoins (released at ≥ 60 only) | `returned = true`, fixed Loyalty 50 − 20 = 30 |

---

## 6. Dependencies

| System | Direction | Contract |
|---|---|---|
| **Combat** | reads ← | `stats`, `moves[4]`, `personality` (AI profile + combat perk), `signature_strength`, bonded pairs incl. Kin (Tag-In bonus), `Loyalty` (Sworn check for Old Gang Nerves, via `RivalCombatProfile`). Owns all Move/Zoomies data, AI implementation, combat-perk values, Old Score, Tag-In, Cowed and its Tag-In clear, the Kin targeting rule, and the allied guest (§3.5.7) |
| **Combat** | emits → | `EncounterEnded` (XP, Rout and loss events), `CatRouted` (Fraidy), `TagIn`, `MoveUsed` |
| **Nemesis** | → | personality and `former_rank` at generation; recruit availability; `VerdictApplied(verdict ∈ {chase, recruit, nose})` (Recruit opens the join step; Nose-Touch feeds W1/W2 in F7); `G_pre`, Regard; Rival kit counts; `relations[]` (Kin), the `OLD_GANG` entry and `old_gang_nerves` (OR-06); `AllyJoined` (**not consumed** by Crew, G10); `BetrayalTriggered(crew_id, patch_id)` from Life 2; release consequences (clean parting / Gone) |
| **Nemesis** | reads ← | `Loyalty(cat_id)`, `wavering_nights` and the F11 thresholds (it emits the betrayal at step 3); `origin`; `DefaultKit` selection rule; `CatRecruited` (writes `OLD_GANG`) |
| **Territory & Economy** | → | Crew cap (6), Sentry slots (2), `seen`, posting via the Turf Board, `PatchChanged`, `DistrictClaimed`, `RaidResolved` (per post: the Stalwart's dislike), guard-perk values (incl. the Goofball's "Laughs off a challenge"), the price sheet (Lessons, Bribe, Share a Morsel), the Stash, Claim Spray after a Verdict |
| **Territory** | reads ← | `PowerRating(cat_id)`, personality (guard perk), `Loyalty` (Warden gate); `BetrayalTriggered` (the Patch flips to the turncoat at rival Scent 40) |
| **Narrative** | ↔ | Story-recruit beats (Hige ≈ 0:10 Life 1 day 1; Pon Life 1 day 2), names and voices of Hige and Pon; Hige as an ex–Wall Sitter; the recruit-voiced `old_gang`, defiant and `steeled` lines, and the Wavering fix line (each cat speaks only from its own history, G8) |
| **UX** | reads ← | Crew card (personality pose + icon, tier name, ♥/✗ marks, **old-gang stamp** with flinch/raised-chin glyph), Posse picker, Tail-Up picker, Lessons screen, Verdict Bribe row (fair/feast) and eyes-and-lean readout, make-room list and release prompt (clean parting / Gone), Wavering pose and Turf Board fix line, allied-guest sprig and portrait (§3.5.7) |
| **Art / Audio** | reads ← | Six personality animation sets and bark intents (DR-37, DR-53) |
| **Clock / Night Shuffle** | → | Step 1 runs F7, Sentry XP and the F11 count (Wavering flags; OR-20 canon order); step 3 (Nemesis) emits any betrayal |
| **Day Loop** | → | A loss ends the day and closes the Lot (OR-01); Crew's −3 per Routed Posse cat runs at step 1 as before |

---

## 7. Tuning Knobs

| Knob | Default | Safe range | Effect |
|---|---|---|---|
| FPL_START / FPL_RAMP | 4 / 2 | 3–5 / 1–3 | Levelling pace; must keep Lv 7–9 at Daifuku |
| YIELD_BASE / YIELD_PER_LEVEL | 8 / 4 | fixed ratio | XP scale (keep TE as the design unit) |
| DIFF_SLOPE, DIFF_MIN, DIFF_MAX | 0.15, 0.25, 2.0 | 0.10–0.20, 0.1–0.4, 1.5–2.5 | Catch-up strength vs anti-grind |
| RANK_XP Captain / Boss | 6 / 20 | 4–8 / 10–30 | Weight of big fights |
| Lounging share | 0.25 | 0.1–0.5 | How far the bench falls behind |
| SENTRY_TE | 4 | 2–6 | XP cost of posting |
| TURF_TE, CLAIM_SHARE | 2, 0.5 | 1–4, 0.25–1 | Reward for taking ground |
| AWARD_CAP_LEVELS | 2 | 1–3 | Anti-spike |
| SLICE_LEVEL_CAP | 10 | 9–12 | Hard bound for the slice |
| P_mod per personality | +10/+5/0/0/−5/−5 | ±15 | Recruit warmth by personality |
| DAILY_CAP | 8 | 5–10 | Loyalty volatility |
| Personality Loyalty values (§3.2.1) | as listed | ±1–2 each | Strength of likes/dislikes |
| Bonded posted gain / clash loss | +1 / −1 | 0–2 | Weight of the social puzzle |
| Braggart grace days | 2 | 1–3 | How long he tolerates the post |
| Brooder service interval | 3 nights | 2–5 | Long-service reward |
| Lessons per day (Mikan / others) | 3 / 1 | 2–4 / 1–2 | Teaching throughput |
| Rank II learner level | 4 | 3–5 | When capstones can arrive early |
| Instinct levels (I, II, capstone) | 1, 4, 7 | ±1 | Growth cadence |
| Crew Zoomies unlock level | 6 | 5–8 | When Crew Zoomies appear |
| Tail-Up arrival / cooldown | 5 s / 30 s | 3–8 s / 15–60 s | Field-swap friction |
| PR_MOVE | 0.02 | 0–0.05 | Kit weight in Power Rating |
| Fixed Loyalty (story / Friend Stray) | 60, 55 / 50 | 45–65 | Early Crew stability |
| WAVER_T (betrayal threshold) | 30 (Schemer 35) | 25–35 (Schemer +0–10) | How neglected an ex-Rival Sentry must be before it Wavers; must keep the slice rate at 0% reference / ≤ 10% neglect |
| WAVER_NIGHTS | 3 (2 warning mornings) | 2–4 | Warning time before a turncoat takes its Patch |
| Stalwart failed-post dislike | −3 | −1 to −4 | Cost of posting the Stalwart on the threatened Patch |
| Minimum Bribe step from Life 2 | 1 (fair) | 1 only (0 would re-open free recruits, against OR-12) | Recruit's Morsel cost |

Owned elsewhere (do not tune here): combat-perk magnitudes, Cowed durations (20 s / Fraidy 30 s) and the guest's combat rules (Combat), guard-perk magnitudes (Territory), prices (Territory), Crew cap and Sentry slots (Territory), availability gates, the Nose-Touch gate shifts, the truce length and `p_join` (Nemesis). The Old Gang resist list (Braggart, Stalwart, Brooder) is personality canon (brief §3.5), not a knob.

---

## 8. Acceptance Criteria

1. **AC-1 (budget-5):** every Style row in `STYLE_W` sums to 5.00 ± 0.001; every Lv 1 cat has stat sum (Nerve/10 + others) 50 ± 1. *(unit test)*
2. **AC-2 (F1/F2/F3/F6/F7/F8/F9/F10/F11):** each worked example in §4 reproduces exactly from data. *(unit test)*
3. **AC-3 (no Move numbers here):** `learnsets.*` has only `move_id, styles[], source, rank, instinct_level`; every `move_id` resolves in Combat's `moves.*`; 12 rows, 4 native per Style, 2 cross-Style 1-Paw entries per Style, no cross-Style capstone. *(data lint)*
4. **AC-4 (deterministic recruit):** for any Verdict where Nemesis reports Recruit available, choosing Recruit always adds the cat; no code path rolls a random number in recruitment. Life 1 recruits cost 0 and use `bribe_step = 1`. *(unit + integration)*
5. **AC-5 (one personality model):** the schema has one `personality` field; no `temperament` field exists; personality never alters a stat. *(lint)*
6. **AC-6 (pacing):** in the Lives 1–2 sim (DR-57) with the light, median and heavy policies, Posse level at the Daifuku fight is 7–9 for median and light play and ≤ 9.5 for heavy; Life 1 ends at Lv 3 ± 0.5. *(sim)*
7. **AC-7 (catch-up):** a Lv 4 cat in Lv 7 fights reaches Lv 6 within 13 same-level-Tough kills (F3 gives ≈ 11.8; same-level pace would be 22). *(unit)*
8. **AC-8 (Posse growth):** in playtests, 100% of testers have 2 cats by minute 15 (two-cat Pile-On, DR-03), 3 by the end of Life 1, and a 4-cat Posse by the end of Life 2 day 1 (before the Relay lesson on day 2). *(playtest)*
9. **AC-9 (personality reads):** after 2 h, ≥ 70% of unbriefed testers can name one cat's personality-driven behaviour in a fight ("the grey one stays next to me") and one reason they posted or benched a specific cat. *(playtest)*
10. **AC-10 (no dominant roster):** across playtest logs, no single 3-cat Posse is chosen on > 60% of Life 2 days, and at least 4 of 6 cats each spend ≥ 1 day posted. *(telemetry)*
11. **AC-11 (social puzzle):** every slice day after Life 2 day 1 presents at least one posting choice where the bonded option and the strongest-guard option differ (true by roster construction; verify in the Turf Board). *(design check)*
12. **AC-12 (Loyalty is live):** in the Lives 1–2 sim, at least one recruit-able roster state has a cat at Aloof or below at some point, and a median player's Crew has ≥ 1 tier change in Life 2. No cat can move more than 8 Loyalty in a day. *(sim + unit)*
13. **AC-13 (betrayal eligibility):** no `BetrayalTriggered` or Wavering item can occur in Life 1, for a story recruit or the Friend Stray, for a Posse or Lounging cat, or for a cat posted on Low Wall Corner or the Den, even at Loyalty 5. A posted ex-Rival recruit in Life 2 below 30 (Schemer below 35) for 3 consecutive Night Shuffles shows Wavering on the 2 mornings between and emits `BetrayalTriggered` at step 3 of the third night, becoming the Keeper of its Patch at rival Scent 40; un-posting it, moving it to the Posse or raising it to its threshold on any night resets the count. *(integration)*
14. **AC-14 (protagonist share):** Mikan cannot slot a 3rd cross-Style Move; Combat's sim reports Crew ≥ 55% of Posse damage with these learnsets. *(unit + Combat sim)*
15. **AC-15 (Tail-Up):** only Lounging, un-Routed cats appear in the picker; posted cats show greyed; unavailable in combat, Standoff, Verdict and inside the wall; 30 s cooldown enforced. *(integration)*
16. **AC-16 (Lessons):** Mikan can teach 3 and any other cat 1 per day; Crew teachers below Steady are refused; Loyalty from Lessons counts once per learner per day. *(unit)*
17. **AC-17 (make room):** at a full Crew the Verdict's make-room list contains exactly the Lounging, non-story cats; a release at ≥ 60 emits a clean parting, below 60 the cat becomes Gone and never reappears in any later state of the run. *(integration)*
18. **AC-18 (recruitment routes and Bribe):** the only code paths that emit `CatRecruited` are the Recruit Verdict, the two story beats and the Friend Stray favour. From Life 2 every Recruit debits ≥ `bribe_fair` from the Stash; no `bribe_step = 0` exists. *(unit + lint)*
19. **AC-19 (G10 audit and firewall):** the only Loyalty inputs that read `VerdictApplied` or another cat's encounter are W1 and W2 (§3.7.6) (lint on F7's event list). For any cat and any day, adding or removing every W1/W2 event never changes whether the cat is below its threshold after step 1, nor its `wavering_nights` (property test over seeded days). `AllyJoined`, `AngerChanged`, `TownEvent` and a loss never change a Crew cat's Loyalty except through its own Rout (unit). *(unit + lint)*
20. **AC-20 (Old Gang Nerves, Crew side):** on every recruit join from a gang with a Boss, the recruit's Memory gains exactly one `OLD_GANG(boss_id)` and the Boss's record is unchanged; `old_gang_nerves` is true exactly for Schemer, Fraidy and Goofball; Hige starts with `OLD_GANG(daifuku)`; the Crew card shows the stamp. In the Daifuku fight with Hige, Togemaru and Kagi (< 80), only Kagi is Cowed, and a Tag-In to Kagi clears it. *(unit + integration)*
21. **AC-21 (allied guest is not Crew):** a joined guest never appears in the Crew list, Posse picker, Tail-Up picker or Turf Board strip, never counts toward the Crew cap, never earns Crew XP or Loyalty, and cannot be Tag-In'd or commanded; the truce sprig and guest portrait show for the whole encounter. *(integration)*
22. **AC-22 (Stalwart and Goofball posts):** a posted Stalwart takes −3 on a Scuffed or Lost night on its own Patch and nothing on Repelled; a challenger staking a posted Goofball's Patch over-marks 0 (Territory's value, Crew's perk identity). *(unit + integration)*
23. **AC-23 (betrayal rate):** in the Lives 1–2 sim, betrayal occurs in 0% of reference-policy runs and ≤ 10% of neglect-policy runs. *(sim)*

---

## Backlog (post-slice)

- **CP-7 Watching** — learning a Move by watching it used, with Brace/Skitter reads earning progress; kept as intent (DR-38). Boss-fight pip rules re-derived then.
- **CP-10 Full catalogue audit** — ≈ 50 Moves (45 Style + 4 Home) and the learnsets for Prowler and Trickster; Ranks III–IV (300/600) and their level gates.
- **Signature Moves** (CP-4 part 2) — teachable only by their owner; revisit once the full catalogue exists.
- **Knacks** — slots, learn routes, the union/dedupe list from CP-1 (Combat owns effects).
- **Home Moves** (Biscuits, Bell Ringer, Come Running, Crib Guard), Bond-gated.
- **Mikan's ageing** — Life-stage stat rows (kitten → elder), Voice up / others down; the elder arc.
- **The heir** (Life 9), Sworn eligibility.
- **Stat and XP curves for Lv 1–30** — re-derive FPL (with Turf XP) for 5–8 days per Life; `FPL_CAP`.
- **CP-X16 Old Boss / AI fill** — ruled in DR-35 (50/60/70/100%); Crew adds no fill modifiers.
- **Generic Stray recruiting** through the same Recruit Verdict and Bribe (Stray `RANK_MULT` 0.75), never a separate prompt; Friend Strays beyond the Lane (one per district).
- **Kin content** — a recruitable Kin pair (e.g. Sasa with Kinako) so the Kin bond (§3.2.2) plays; Nemesis seeds, Narrative writes.
- **Counsel: G10 watch items** (§3.7.6 W1–W3, the join-in) — revisit when the '303 claims are final; the betrayal firewall stays until counsel relaxes it.
- **Neglect pride by rank** beyond DR-11's unseen multiplier (ex-Captains/Bosses wanting prestige posts).
- **Multi-district social rules** (bonded/clashing "same district" across 3 districts), Warden per district.
- **Life 8 Loyalty** (no absence drain, DR-11) and Life 9 Crew-carries numbers (Narrative §9 owns the frame).
- **Prowler and Trickster** personality AI notes for those Styles' kits.
- *From the round-2 check (`design/reviews/round-2/combat-and-crew.md`), not fixed in iteration 3:*
- **R-1 Brooder dismissal arithmetic** — the edge case says −10 raw → −5, but F7 clamps to ±8 before halving (→ −4). Set dismissal to −8 raw, or exempt it from `DAILY_CAP`.
- **R-3 Leader levels** — Daifuku Lv ≈ 9 (Bribe 288) and Kagi Lv 6 here vs Combat's leader-level rule (Combat B-21) and Territory's Daifuku Lv 8 (Bribe 256). Settle with Combat/Nemesis; F8's example becomes 256/512 at Lv 8.
- **R-4 Slice body ≈ 54 KB** vs the 50 KB target (§3.2.1's combat lines are now short pointers; trim further later).
- **R-5 AC-6 / F2 pacing** is a hand derivation; confirm in the Lives 1–2 economy sim with Combat's sim encounter lengths (skirmishes 18–28 s, not 16–24).
- **X-1 Brooder visibility** — Daifuku is the only Brooder and joins at the end of Life 2, so no tester fights beside Brooder AI. Use Stalwart Hige, Goofball Pon and Braggart Togemaru as DR-02's three prototype personalities; test the Brooder in the grey box.
- **Pon's join beat** — "crows at the laundry poles" sits on Laundry Pole Yard, which is Togemaru's Patch on Life 1 day 2; Narrative to confirm the two beats don't collide.

---

## Revision Log

**2026-11-23 — Round 2 (fresh slice rewrite; first draft archived).** Issue IDs from `design/reviews/round-1/crew-and-progression--design.md` and `paper-playtest.md`.

| ID | Status | How |
|---|---|---|
| CP-1 | FIXED | Crew owns only `learnsets.*` (`move_id, styles[], source, rank, instinct_level`); all Move/Knack numbers, Pow/Frz columns and the 64-Move catalogue deleted (§3.8, DR-05). "Lands On Feet once per encounter" REJECTED: Knacks are Backlog |
| CP-2 | FIXED | F10 value model and §3.13 Posse table deleted; balance is Combat's sim (DR-31, DR-33) |
| CP-3 | FIXED | Willingness roll and Fear penalty deleted; Nemesis owns availability; canon F6 with `G_pre` (thaw rule removed); tiers 0–29/30–44/45–59/60–79/80–100; release per DR-34 |
| CP-4 | FIXED | Answered by personality (§3.2) and the always-on signature perk for Rival recruits (§3.3); signature Moves → Backlog per DR-37 |
| CP-5 | FIXED | ≤ 2 cross-Style slots for Mikan, no hidden penalty, control passes to next slot (§3.8.4, §3.9) |
| CP-6 | FIXED | Pending list, refresher fee and last-copy rules deleted; `known_moves` with free re-slotting |
| CP-7 | BACKLOG | Watching kept as intent (DR-38) |
| CP-8 | FIXED | "Recruit — make room" (§3.4.4); 5-level and "district not claimed" blocks deleted. Posting-pride-by-rank REJECTED for the slice: DR-11's unseen multiplier `m` replaces it (Backlog line kept) |
| CP-9 | FIXED | Strays and story recruits have no signature perk; one Friend Stray in the slice; Rival recruits are the premium catch |
| CP-10 | BACKLOG | Full catalogue audit with the full catalogue |
| CP-11 | FIXED | Lv 1–10 curve re-derived for 4–6 fights/day including Turf XP; Daifuku band 7–9 (F2); old AC-7 replaced (AC-7) |
| CP-12 | FIXED | Loyalty → stats cut; Share a Morsel +2, Lesson +1; Share a Morsel naming |
| CP-13 | FIXED | One `personality` field (DR-37). Stat-nudge table REJECTED (DR-37: Style alone sets stats) |
| CP-14 | FIXED | Zoomies II cut; Crew Zoomies unlock Lv 6, Mikan at the cat flap (§3.8.4) |
| CP-15 | FIXED | Slice Moves use Combat ids/names; no wound vocabulary or Zoomies/verb collisions in the 12 |
| CP-16 | FIXED | Slice uses Combat's catalogue for Scrapper/Bruiser/Yowler; no non-learnable Moves (Avalanche gone) |
| CP-17 | FIXED | Mikan teaches 3 Lessons/day, others 1 |
| CP-X1 | FIXED | One catalogue, Combat's |
| CP-X2 | FIXED | Combat's scale only; no Crew budget |
| CP-X3 | FIXED | No Crew Move uses a Zoomies name |
| CP-X4 | REJECTED | Overruled: the matchup chart is DR-06 (neither draft's) |
| CP-X5 | FIXED | Deterministic recruit |
| CP-X6 | FIXED | Canon F6 (Nemesis F18 + Bribe + return) |
| CP-X7 | FIXED | Shifty 0–29 |
| CP-X8 | FIXED | Release ≥ 60 clean parting, < 60 Chase Off |
| CP-X9 | FIXED | Nemesis kit counts + Crew selection rule (§3.8.5) |
| CP-X10 | FIXED | Level block deleted |
| CP-X11 | FIXED | Boss recruit uses Nemesis's Regard ≥ 50 only |
| CP-X12 | FIXED | One `personality` field |
| CP-X13 | BACKLOG | Comes Knocking (NS-C8 Backlog) |
| CP-X14 | FIXED | No refunds; no Crew Move numbers |
| CP-X15 | FIXED | Knack effects are Combat's; Knacks Backlog |
| CP-X16 | BACKLOG | AI fill ruled in DR-35 |
| CP-X17 | FIXED | Share a Morsel, one verb |
| PP-07 | FIXED | Life 1 Recruit is a fixed free yes; Bribes from Life 2 (§3.4.1) |
| PP-08 | FIXED | Hige (story) joins Life 1 day 1 ≈ 0:10; Pon Life 1 day 2 (§3.3, §3.5) |
| PP-20 | FIXED | Mikan capped at 2 cross-Style slots; Crew carry personality and signature perks (§3.9) |
| PP-31 | FIXED | Tail-Up is the single in-field swap rule (§3.5.3) |

**2026-11-24 — Iteration 3 (final fix pass; `design/reviews/round-2/combat-and-crew.md`, `presentation.md`, `nemesis-territory-dayloop.md`).**

| Fix | Status | How |
|---|---|---|
| Crew 1 · Move ids | FIXED | §3.8.1 now uses Combat §3.10 ids: `claw_flurry`→`face_swat`, `wall_kick`→`bunny_kick`, `loaf`→`puff_up` (no cross learner; the Yowler's second cross slot is `belly_flop`), `big_talk`→`howl`. Propagated to §3.3 (Kinako: Face Swat, Bunny-Kick), §3.8.5, F9 (still 136), F10 (still 180). "Archived starter list" wording deleted |
| Crew 2 · Signature Strengths | FIXED | From Combat §3.9's menu: Togemaru +15% Nerve; Kagi resists Claw ×0.6; Daifuku immune to Cowed (never "cannot be knocked off") |
| Crew 3 · Combat columns | FIXED | Every "Fights like" and "Combat perk" line in §3.2.1, the §3.2.2 bonded Tag-In (MV ×1.25, +10 FZ) and §3.2.3 cells (props ×1.3, Old Score ×1.5) now carry Combat §3.11's values and cite it. Stalwart body-blocking removed (Combat B-23). §3.1 points Mikan's AI to Combat's new Mikan row |
| Crew 4 · Kinako input | FIXED | Interact (North / E) within 4 m plays Mikan's slow-blink gesture (§3.4.3) |
| Crew 5 · 4-cat Posse | FIXED | Kinako's favour is Life 2 day 1's required first objective; the Lot opens after it (§3.3, §3.4.3, §3.5.1, §5, AC-8) |
| Crew 6 · Zoomies day | FIXED | Mikan's Zoomies unlock on Life 2 day 3 (§3.8.4); Crew stays Lv 6 |
| Lessons day | FIXED | Lessons open at the Lot from Life 2 day 3 (§3.8.3.1), per Day Loop §3.9 and the Nemesis/Territory review |
| Names and posts | FIXED | Togemaru (the First Thorn, Braggart Scrapper, Keeper of Laundry Pole Yard) used throughout; Kagi is Captain of Tofu Shop Step, recruitable from Life 2 day 3 |
| Captain Nerve | FIXED | §3.6.8 notes Combat's new rule: a Captain uses Nerve weight 1.0 while it is a Captain (Combat §3.12, iteration-3 retune) |
| Number rule (R3) | FIXED | Loyalty is never a number (§3.7.3); Pillar line restated |
| R-2 · Style passive | FIXED | Deleted the "never gains the native Style's passive" line (§3.8.4); Combat has no passive |
| R-1, R-3, R-4, R-5, X-1 | BACKLOG | Moved to `## Backlog (post-slice)` |

**Assumptions for creative-director / owner review:** working names Hige, Pon, Kinako, Kagi (Narrative/Nemesis; Togemaru adopted by Nemesis in round 2); the six seeds' personality assignments and proposed Strengths/Fears (Nemesis, Combat); schema extensions in §3.1; A-1 fight supply (≈ 12.5 TE/day) to be confirmed by Day-loop/Combat encounter density.

# Combat System — Vertical Slice

*Owner: combat designer (game-designer) · Round 2 (slice rewrite) · 2026-11-23 · Canon: `design/creative-brief.md` v1.2, `design/reviews/round-1/director-rulings.md` (binding). First draft archived at `design/backlog/first-drafts/combat-system.md`.*

**Scope.** This doc covers what the vertical slice (DR-01) and the grey-box combat prototype (DR-02) need: real-time rules, the 12 slice Moves, 3 Zoomies, 3 Fears, Tag-In/Relay, Frazzle and the Pile-On, Posse AI by personality, enemy grammar, Daifuku, the game-feel/VFX tier table, and the combat column of the control map. Everything else is in `## Backlog (post-slice)`. **Spec level (DR-28):** intent, rules and ranges in milliseconds or seconds. Frame data goes in `assets/data/combat/*` and the prototype.

---

## 1. Overview

Combat is a short, loud, readable cartoon brawl with FF7 Remake's **structure** but deliberately light detail. You directly control one cat of a four-cat **Posse** (Mikan + 3 Crew), seen from a third-person camera behind and above the cat. You can switch instantly to any of the four. Each cat has one 3-hit string, a dodge (**Skitter**), a guard (**Brace**), a jump (**Hop**) and a **Hiss**. Hits fill a **Pounce Gauge** measured in **Paws**. Paws are spent on **Moves**, either from a shortcut or in **Slow Blink**, where time runs at 5% and you give orders to any cat. Every Move is either a **Set-up** that creates a state or a **Pay-off** that cashes one in. Hits build an enemy's **Frazzle** gauge. A Frazzled enemy is helpless and takes ×1.5 damage, and it opens the **Pile-On**: the Posse dives in and vanishes into a cartoon dust cloud. Switching control at the right moment is a **Tag-In**, and chaining Tag-Ins is a **Relay**. Relays are how a skilled player conducts the fight. AI Crew fight according to their **personality** and fill Paws at half rate, so the biggest moments are always ones the player chose. A Tough falls in 6–10 s, a normal encounter takes 30–60 s, a Captain 30–45 s and Daifuku 2–3 min. Formulas and the reference model (§4) show the arithmetic for each.

## 2. Player Fantasy

**"I'm the boss of a gang of very different cats, and I'm conducting a brawl."** It reads as cat slapstick turned up to the maximum: action lines, stepped screen shake, impact frames, hand-lettered sound-effect words on the big hits. But the player never loses track of their cat, because every big effect answers something they did or ordered.

- **Target aesthetics (MDA):** *Challenge* (read telegraphs, time the Tag-In, cash in the Frazzle window); *Sensation* (a tiered feel budget peaking at the Pile-On); *Fellowship* through *Fantasy* (four distinct personalities you can watch working); *Expression* (who is in your Posse and how you chain them).
- **Pillar 3, Conduct the Brawl:** fights are short, with one goal you can always see (fill the Frazzle gauge), three telegraph colours with absolute answers, and Tag-In/Relay as the skill ceiling.
- **Pillar 1, Cat's-Eye Truth:** the verbs are cat verbs. You Hiss a weak Tough until it backs down. You wait on a wall and pounce. You knock the Boss off his wall into a bucket. Nobody dies; a beaten cat bolts away in a puff of dust.
- **Pillar 4, Rivals Remember:** Old Score makes a fight between cats with history play out differently. Memory lines appear at the Standoff, or at the Rout after an Ambush.
- **SDT:** *Competence* comes from readable telegraphs and a gauge you can see. *Autonomy* comes from Posse choice, Move slots and when to cash in a Frazzle. *Relatedness* comes from Crew who act like themselves.

**What the player tells a friend:** "When you stagger someone, your whole gang piles on in a dust cloud. And I knocked the Boss off his wall into a bucket."

---

## 3. Detailed Design

### 3.1 Controls (actions owned here; map owned by UX, DR-08)

Everything can be remapped. Every hold has a toggle alternative. West, North, South and East are face-button positions.

| Action | Gamepad | KB/M | Rule |
|---|---|---|---|
| Move | Left stick | WASD | — |
| Camera / lock-on | Right stick; R3 toggles lock, flick picks the next target | Mouse; MMB / wheel | Soft lock is on by default |
| **Attack** | West | LMB | 3-hit string. Airborne or from the High Road it becomes a **Pounce** |
| **Hop** | South | Space | Jump and mantle onto the High Road |
| **Skitter** | East | Shift | Dodge |
| **Brace** | R1 (hold or toggle) | RMB | Guard |
| **Hiss** / **Pile-On** | North | F | Becomes Pile-On while one is offered |
| **Slow Blink** | R2 | Tab | Tactical menu, time ×5% |
| Shortcut Move 1–4 | L1 hold + W/N/E/S | 1–4 | Fires the controlled cat's Move slots |
| **Zoomies** | L1 + R1 | R | When the controlled cat's gauge is full |
| Switch | D-pad Up = Mikan; Left/Down/Right = Crew 1/2/3 | Z X C V | Switching in a Tag-In window makes it a **Tag-In** |
| Pause | Menu | Esc | — |

**Inside Slow Blink:** stick = cursor; L1/R1 = change cat; South = confirm; East = back; R2 = close. Scram (flee) is a menu entry. The menu shows props and **known** Fears, which is why there is no Whisker Sense in combat. **Cut (DR-08, DR-28):** Whack, Bap, the Righting input, hold-charge attacks, the L3+R3 chord, Tactics and Auto-Hiss.

### 3.2 The controlled cat's verbs

**Attack string.** Each Style has **one** 3-hit string (about 1.8 s per full cycle including recovery). Hits 1–2 are T1. Hit 3 is the **Style finisher** (T2):

| Style | Basic type | Finisher |
|---|---|---|
| Scrapper (Mikan) | Claw | **Flurry**: a 3-swipe burst counted as one hit |
| Bruiser | Thump | **Shove**: 2 m knockback, which can push an enemy off a High Road edge |
| Yowler | Yowl | **Yowl cone**: a 3 m, 60° cone hitting every enemy in it |

There is no heavy attack and no hold-charge. A string can be cancelled into Skitter, Brace, Hiss, a Move or a switch at any point; the prototype tunes exactly when.

**Pounce.** Attack while airborne, or from the High Road, dives at the lock target (up to 6 m). On the High Road the Pounce **charges with time aloft** (Wind-Up, up to 3 s; F7). The charge shows as the pre-pounce bottom wiggle. While a cat is perched, its passive Paw fill stops. After 2 s perched, enemies with reach (crows, Yowlers, Daifuku) prefer it as a target. A Pounce made within 1.5 s of mantling deals ×0.6 and gives no Paw points, so mantle-and-pounce cannot be looped (CS-16).

**Skitter.** A dodge of about 2.5 m, about 350 ms long, invulnerable for about the first 200 ms. A **perfect Skitter** starts within 150 ms of an incoming hit; only the Fraidy perk rewards it.

**Brace.** Hold to guard the front 120°. White and yellow hits are reduced to the 30% floor. **Red cannot be Braced.** There is no guard break; red attacks and Fed Up stop players from turtling.

**Hiss.** 8 s cooldown, 4 m reach in front. Against a **yellow** telegraph, it **interrupts** the attack, **Ruffles** the attacker (§3.5) and flinches it. The interrupted enemy **spends the Paw**, and that Move goes on a 6 s cooldown, so there is no retry loop. Against a **Tough at ≤ 15% Nerve**, the Tough **Backs Down**: it is Routed by intimidation, T4, `CatRouted(by_back_down)`. Otherwise a Hiss flinches Toughs and does nothing to leaders. **AI cats Hiss only yellow telegraphs aimed at themselves** (DR-28, CX-8).

**Switch.** Switching is instant. The outgoing cat goes back to AI at once. You cannot switch to a Routed cat. If the controlled cat is Routed, control passes to the next standing slot in D-pad order (Up, Left, Down, Right, wrapping round), **not** to Mikan (DR-33). There is no mid-fight bench swap.

### 3.3 Tag-In and Relay (the conducting core, DR-29)

- **Trigger:** switch within **0.35 s** after the controlled cat **lands** a string finisher, a Pounce, or a Hiss interrupt.
- **Effect:** the incoming cat leaps to the target from up to 8 m, **invulnerable during the leap**, and lands its Style's **Tag-In strike** (T2, MV 1.5, FZ 20; F6). Both cats gain **25 Pounce points** (a quarter Paw). If the target is out of range, the switch is just a plain switch.

| Style | Tag-In strike |
|---|---|
| Scrapper | **Cut-Through**: dashes through the target, two swipes counted as one hit |
| Bruiser | **Body Slam**: 1.5 m knockback that can knock an enemy off a High Road edge |
| Yowler | **Yowl Pop**: 3 m cone; a Fear in range shows its flinch tell (§3.9) |

- **Relay:** a Tag-In strike opens its own 0.35 s window. Each Tag-In must start within 0.35 s of the previous strike landing and within 3 s of the previous Tag-In. **Each cat may be the incoming cat once per Relay; the cat that started the Relay may also be the incoming cat of its final tag.** Max 4 tags (a four-cat Relay is A→B→C→D→A; a 2-cat Relay is A→B→A). Each tag after the first adds a flat Frazzle bonus that **ignores rank resistance**: tag 2 **+10**, tag 3 **+15**, tag 4 **+20**. After a Relay of 3 or more tags, the Relay bonus is unavailable for 6 s. Tag-Ins still work during that time but add no bonus. `TagIn(from, to, relay_count)` is emitted on every tag.
- **Bonded pair** (DR-37): a Tag-In between bonded cats deals MV ×1.25 and adds +10 FZ.
- **Payoff:** a four-cat Relay adds about 61 FZ to a Captain (F6). It is the skill route to cracking a Captain.

### 3.4 Pounce Gauge, Moves, Slow Blink

- **Pounce Gauge:** 100 points = 1 Paw. Every cat has **2 Paws** (Mikan's third, from Life 4, is outside the slice). The gauge fills slowly over time and faster from hits (F3). AI-controlled cats fill at **`ai_fill` = 50%** (data per Life, DR-35). It starts each fight at 0 (25 with Well-Fed, DR-20). Fights do not carry it over.
- **Moves:** 4 slots per cat; each costs 1 or 2 Paws. A Move is fired by shortcut (controlled cat) or from Slow Blink (any cat). The Paw is spent when the Move **commits**; a Move interrupted before then refunds. **No Move refunds its own cost** (CS-C12). `MoveUsed(user, move, targets_hit[])` is emitted.
- **Slow Blink:** R2 sets time to ×5% and lifts the camera to a tactical three-quarter view (owned by `camera-system.md`). Pick a cat, a Move and a target. **Commands chain** while any cat can afford one. All timers, including the Frazzle window and Pile-On pips, run at 5%. **A Move commanded during an enemy's Frazzle window skips pathing:** the cat leaps to range. Slow Blink is closed during Standoff, Pile-On and Zoomies cinematics.

### 3.5 Ruffled, Frazzle, poise, statuses

- **Ruffled** (state, 4 s): the target's Frazzle builds ×2. Sources: Ambush, Fear triggers, Hiss interrupts, a knock-off on a Boss, and **one Move per Style** (Face Swat, Puff Up; the Yowler has none). **A Captain or Boss cannot be Ruffled again for 6 s after Ruffled ends** (this replaces Swagger and Composure, which are cut). Fed Up ignores that cooldown.
- **Frazzle** gauge 0–100, shown as a zigzag bar on the enemy in the world. It fills from hits (F2) and decays only after a pause in gains (Tough 5/s after 4 s; Captain 2/s and Boss 1/s after 6 s). **Frazzled** when full: **6 s** helpless, damage taken ×1.5, the window drawn as a shrinking ring. When the window ends, the gauge resets to 0. Hits do not build Frazzle while the target is Frazzled.
- **Poise (DR-28, CS-3):**
  - **Toughs, Strays and crows** flinch (about 0.4 s) from string hits. After a flinch ends, they ignore *string-hit* flinches for 1.0 s.
  - **Captains and Bosses do not flinch from strings.** They flinch only from finishers, Tag-In strikes, Hiss interrupts, knock-offs and phase breaks, and from finishers or Tag-In strikes at most once per 3 s.
  - **Every enemy windup is armoured from its start.** Yellow can be stopped only by Hiss. Red cannot be stopped.
- **Statuses: three only, one per cat at a time (the newest replaces the old):** **Soggy** (move speed and recovery ×0.8, 6 s), **Cowed** (deals ×0.75, 8 s), **Fired Up** (deals ×1.25, 8 s). Well-Fed is not a status (DR-20).
- **States that are not statuses** (Set-up targets): **Ruffled**, **Splat** (knocked flat and helpless for 1.5 s, plus a flat 20 FZ chunk; a Boss is never Splatted and is Ruffled instead) and **Clumped** (2+ enemies pulled within 2 m of each other for 3 s).

### 3.6 Pile-On (DR-30)

- **Requires** ≥ 2 standing Posse cats and a Frazzled target. North (or Slow Blink) triggers it. Every standing Posse cat joins and is invulnerable for the duration. Enemies not in the Pile-On hold their attacks until it ends.
- **On trash (Toughs, Strays, crows): Quick Pile-On** (about 1.2 s). It is offered **only** when 2+ enemies are Frazzled within 3 m of each other (all of them are Routed), or when the target is the **last enemy standing**. It **always Routs** anything below Captain. Otherwise Frazzled Toughs just die faster to hits.
- **On a Captain or Boss: Full Pile-On** (about 2.5 s), worth **more the earlier it is triggered** (F5). The Frazzle ring shows **5 pips** that drain as the window runs, so the current value is readable without a number. The Pile-On ends the Frazzle.
- **The decision:** cash in now for the biggest Pile-On, or first spend banked Paws on Moves (×1.5 inside the window, no pathing) and cash in a smaller Pile-On after. With no Paws banked, cashing in at once is best. With 2+ Paws banked, dumping them first and then cashing in is best (F5 worked example). That way the decision depends on how well you managed your Paws.
- **Each beat** uses that cat's Style animation and voice and its **personality flourish**. Camera shake happens on the beats only; the cloud itself does not shake the screen.

### 3.7 Zoomies (one per Style)

Each cat has its own Zoomies gauge (0–100). It fills from damage taken and from Frazzles (F8), and it **persists within a day**. When full, the controlled cat fires it with L1+R1, or any cat can be ordered to from Slow Blink. Zoomies are invulnerable, with a 0.6 s cut-in, and are T5 (DR-07). **Unlocks** (Crew owns, §3.8.4): Mikan's on Life 2 day 3 (§3.16); a Crew cat's at Lv 6. A locked cat's gauge does not fill. The budget is a single-target value of 12 MV; area hits pay 40% per target.

| Style | Zoomies | Effect |
|---|---|---|
| Scrapper | **Midnight Laps** | Three laps of the ring: 4 hits of MV 1.2 on every enemy (4.8 each), FZ 15 per hit |
| Bruiser | **Landslide** | Rolls along a line: MV 12 and FZ 80 to the first target; MV 4.8 to others in the path. **Knocks every target off High Road edges** |
| Yowler | **Midnight Aria** | Ring-wide MV 3.0, all enemies Cowed; heals the Posse 15% of max Nerve, counted against the heal cap |

### 3.8 Damage types and Style matchups (DR-06)

**A Style resists its own damage type.** Resisted ×0.8; weak ×1.2. Weakness also gives ×1.2 Frazzle.

| Style (slice) | Basic type | Resists | Weak to | Nerve multiplier |
|---|---|---|---|---|
| Bruiser | Thump | Thump | Fang | 1.3 |
| Scrapper | Claw | Claw | Thump | 1.0 |
| Yowler | Yowl | Yowl | Claw | 0.9 |

Daifuku (a Bruiser) is neutral to Mikan's Claw. Prowler and Trickster are Backlog. Fang appears in the slice only as a Bruiser weakness that nothing exploits yet.

### 3.9 Props and Fears (slice: 3)

A prop activates when any attack hits it, when a Pounce lands on it, or when a knocked-back cat collides with it. Enemies can trigger props too. A **Goofball** triggering a prop gets ×1.3 effect.

| Prop | Effect | Fear | Reuse |
|---|---|---|---|
| **Water bucket** | 3 m cone splash: Soggy on everything; a cat knocked off a ledge into it takes an extra 10 FZ (flat) | Water | Once (Daifuku's arena refills it each phase) |
| **Scooter horn** | 6 m bang: interrupts Toughs' yellow windups in radius | Loud Noise | 15 s cooldown |
| **Ledge junk** (cucumber on a crate) | Falls at its ground point: 1.5 m radius, MV 2.0, FZ 25 | Cucumbers (3 m) | Once |

- **A triggered Fear:** `FearTriggered` is emitted; the cat is **Ruffled** (the leader cooldown applies), takes a flat Frazzle chunk (Tough 30 / Captain 20 / Boss 15), any non-red action is interrupted, and a rider applies: **Water**, Soggy 6 s; **Loud Noise**, a 0.8 s flinch; **Cucumbers**, launched upward, helpless 1.0 s, then Splat (Boss: no Splat).
- **Diminishing:** the same Fear on the same cat in one encounter gives full effect, then half the chunk and no rider, then nothing.
- **Flinch tell (CX-12):** any cat with the matching Fear inside a prop's radius plays a visible flinch-and-ears-flat tell, even when the Fear is diminished or the prop does nothing else. The Fear then becomes **known**: `FearTriggered(source = tell)` is sent, and Nemesis records it. Slow Blink then tags that prop.
- Nemesis chooses Fears and Strengths; Combat values them. A Strength is worth one of: resist one type at ×0.6; cannot be knocked off the High Road; immune to one status; +15% Nerve; +25% Frazzle resistance. A cat may not hold a Strength that cancels its own Fear.

### 3.10 The slice Move catalogue (12; DR-05)

Data lives in `assets/data/combat/moves.*`. Crew owns learnsets keyed by `move_id`. Fields: `id, name, style, cost, type, mv, fz, role (setup|payoff), creates|pays_on, target, range, ai_use (auto|command_only|support), flags, feel_tier`. **Set-up Moves are `command_only` for AI.** Budget: 1 Paw ≈ 3.5 MV + about 30 FZ; 2 Paws ≈ 8 MV or a strong utility; area damage pays 40% per target. ★ marks the 8 prototype Moves (DR-02).

| # | Move | Style · Paws | Role | Effect | ai_use |
|---|---|---|---|---|---|
| S1 ★ | **Face Swat** | Scrapper · 1 | Set-up: **Ruffled** | Fast slap combo: MV 2.0, FZ 20; target Ruffled 4 s | command_only |
| S2 ★ | **Scruff Toss** | Scrapper · 1 | Set-up: **Splat** | Grabs a non-Boss and throws it 4 m: MV 2.0, FZ 25. A throw into a wall, prop, enemy or off a ledge is a Splat (+MV 1.0 to both cats if it hits an enemy). Activates props | command_only |
| S3 ★ | **Bunny-Kick** | Scrapper · 1 | Pay-off: Splat / Soggy | Rabbit-kick flurry: MV 3.0, FZ 25. On a Splat or Soggy target: ×1.5 MV and +20 FZ | auto |
| S4 | **Shred** | Scrapper · 2 | Pay-off: Ruffled / Frazzled | MV 7.0, FZ 50; ×1.3 MV on a Ruffled or Frazzled target | auto |
| B1 ★ | **Shoulder Check** | Bruiser · 1 | Set-up: **Splat** | Charges 4 m: MV 2.5, FZ 30, 3 m knockback; into a wall, prop, enemy or off a ledge it Splats. **Pushes a Boss 1.5 m** (the knock-off tool) | command_only |
| B2 ★ | **Belly Flop** | Bruiser · 1 | Pay-off: Clumped / Splat | Leaps (reaches the High Road) and lands a 2.5 m radius: MV 2.0, FZ 25 each; on Clumped or Splat targets ×1.5 MV and +15 FZ | auto |
| B3 | **Puff Up** | Bruiser · 1 | Set-up: **Ruffled** | Puffs to twice its size: enemies within 3 m are Ruffled (leader cooldown applies); the Bruiser takes ×0.7 damage for 4 s (floor still 30%) | command_only |
| B4 | **Sit On It** | Bruiser · 2 | Pay-off: Splat / Frazzled | Drops on one target: MV 7.0, FZ 50; on a Splat target it extends the Splat by 1.5 s and adds +30 FZ; on a Frazzled target ×1.3 MV. No pin (Pinned is cut) | auto |
| Y1 ★ | **Withering Hiss** | Yowler · 1 | Set-up: **Cowed** | 5 m cone, 90°: MV 1.5 each; Cowed 8 s | command_only |
| Y2 | **Howl** | Yowler · 1 | Set-up: **Clumped** | 6 m cone: Toughs and crows are pulled 2 m toward the Yowler and Clumped 3 s; leaders are not pulled but count as the clump's centre. MV 1.0, FZ 15 each | command_only |
| Y3 ★ | **Purr** | Yowler · 1 | Pay-off: Cowed | Heals one ally HealMV 3.0 (≈ 13.5% of neutral Nerve), or allies within 3 m HealMV 1.8; **×1.5 if any enemy within 6 m is Cowed**. No heal-over-time | support (an ally < 40%) |
| Y4 ★ | **Banshee Screech** | Yowler · 2 | Pay-off: Cowed | Ring-wide, up to 6 targets: MV 2.5, FZ 35 each; ×1.5 MV and FZ on Cowed targets. **Knocks every enemy off High Road edges** | auto |

Set-up → Pay-off pairs inside one Style: Face Swat → Shred; Scruff Toss → Bunny-Kick; Shoulder Check → Sit On It; Withering Hiss → Purr / Screech. Pairs across Styles: Howl → Belly Flop; Shoulder Check → Bunny-Kick. Teaching a cat a Move gives it a new interaction, not just a bigger number.

### 3.11 Posse AI by personality (combat column, DR-37)

All AI shares one base:
- It keeps within the camera's frame bias.
- It attacks with its string at AI cadence: about 35% attack uptime, the rest spent posturing, repositioning and dodging white telegraphs.
- It Hisses only at yellow telegraphs aimed at itself.
- **It never spends its last Paw on its own**, so one Paw is always banked for the conductor.
- It uses `auto` Pay-offs only when their condition is met, and `support` Moves under the condition stated in the catalogue.
- **High Road:** if the AI's target stands on the High Road within 3 m of a reachable ledge, the cat Hops up after 1 s (Fraidy: never; Brooder: only once it has an avenge target). **At most 2 Posse cats are on Daifuku's wall at once**; the rest attack props and Toughs below. The controlled cat counts toward the 2.
- Its hits render one feel tier lower.

| Personality | How it fights (target choice and distance) | Paw habit | Combat perk |
|---|---|---|---|
| **Braggart** | Charges the biggest enemy (highest rank, then highest max Nerve); stays in melee | Spends a Pay-off at the first chance | Its first hit on a Captain or Boss each encounter adds **+20 FZ** (flat) |
| **Brooder** | Hangs back at 5–7 m until an enemy hits an ally, then goes for that enemy for 6 s | Saves for Pay-offs on its avenge target | **Old Score ×1.5** instead of ×1.25 |
| **Schemer** | Approaches from the target's rear 120°; switches to a Ruffled or Frazzled target within **6 m** | Spends on Frazzled targets | **+20% damage to Frazzled** targets |
| **Fraidy** | Keeps 4–6 m away; Skitters whites eagerly; prefers support | Holds Paws for `support`; with no `support` Move slotted, uses the base Pay-off rule | **Perfect Skitter: +25 Pounce points** |
| **Stalwart** | Stays within 3 m of the controlled cat; Braces against attacks aimed at itself; takes attack-token priority from enemies | Spends on whatever is attacking the controlled cat | **Allies within 3 m take ×0.85 damage** |
| **Goofball** | Goes for props that would catch an enemy (6 m); otherwise picks randomly between the nearest two enemies (seeded) | Each time an `auto` Pay-off becomes eligible, fires it on a seeded 50% roll; otherwise waits 3 s before rolling again | **Props it triggers: ×1.3 effect** |
| **Mikan** (no personality; AI only when the player has switched away) | Stays 2–4 m from the controlled cat's lock target and attacks it | Base Pay-off rule | None (no flourish beyond the Scrapper Pile-On beat) |

- **Old Score (DR-29):** a Crew cat fighting a Rival whose Memory records a Rout between them, either way, deals ×1.25 Frazzle to that Rival (Brooder ×1.5). Both bark at the Standoff. Fight barks are icon-only (DR-44).
- **Signature perks:** an ex-Rival's Nemesis Strength becomes an always-on perk, valued per §3.9. Strays have none.

### 3.12 Enemies

**Telegraphs (DR-28, DR-51).** Each class has a ground decal (the primary signal) plus an overhead glyph at least 3% of screen height. Pose is a secondary signal.

| Class | Look | Answer | Windup |
|---|---|---|---|
| White | White thin arc or line | Skitter or Brace | 300–500 ms (Tough), ≥ 250 ms (Captain+) |
| Yellow | **Paper Cream, dashed, triangle glyph** | **Hiss** (best), Skitter, Brace | ≥ 750 ms |
| Red | **Frazzle Magenta, zigzag edge, filling area** | Get out or Skitter through; nothing stops it | ≥ 1,000 ms (Boss specials ≥ 1,500 ms) |

At most one red is active in the ring outside the Boss fight. A hit never exceeds its drawn shape. An off-screen attacker shows an edge arrow for its whole windup.

**Attack tokens** (on Alley): 2 melee tokens on the controlled cat, 1 on each AI cat, with at least 300 ms between two hits landing on the same cat. An enemy without a token postures (circles, makes a hiss idle, shuffles sideways). Each attack averages about 1.5 MV, roughly one attack per 4.5 s per token holder (F10).

**Enemy kits.** An enemy uses its Style's string (white), plus up to 4 slice Moves from its `RivalCombatProfile`: a 1-Paw Move is yellow, a 2-Paw Move is red. **Enemy Paws** fill at a flat rate: Tough 1 per 16 s, Captain 1 per 9 s, Boss 1 per 6 s. No enemy heals more than 25% of its max Nerve per encounter.

| Archetype | Nerve × | Damage × | Notes |
|---|---|---|---|
| Stray | 1 | 1.0 | 0–1 Moves; Backs Down at ≤ 25% |
| Tough | 1 | 1.0 | 1–2 Moves; Style sets its job |
| Captain (2 in the slice) | **8** | **1.3** | 4 Moves, a Fear and a Strength |
| Boss (Daifuku) | **20** | **1.6** | §3.13 |
| Crow (Critter) | 0.5 | 0.8 | Groups of 2–4. Lives in the air and on the High Road; its dive is white, after which it hops on the ground for 1.5 s and can be hit. Pounce, Yowl cones and Howl reach it in the air. Never Rival or Crew |

Style Nerve multipliers stack on top for Strays, Toughs, crows and the Boss (Daifuku = 20 × 1.3 = **26×**). **Captains do not take the Style Nerve multiplier** (`captain_style_nerve` = off): every Captain has 8 × neutral Nerve, and Style still sets its Hide, Bite and Voice. *(Iteration 3: with the ×1.3 stacked, a Bruiser Captain took 55–58 s in the sim, outside the 30–45 s band; without it every Captain Style lands at 37–44 s with 2 Frazzles.)* **Leader levels (CS-C24):** Den Captains and Daifuku are levelled at `max(district band top, Posse mean level − 2)`. Nemesis supplies the level.

### 3.13 Daifuku (the slice Boss; 3 phases)

**His fight is "knock him off into the bucket".** He never leaves his wall voluntarily. On the wall, only High Road cats reach him. **Knock-offs are deterministic:** any knockback that crosses a High Road edge (Bruiser finisher, Shoulder Check, Body Slam, Banshee Screech, Landslide) drops him, and a Boss knock-off means **Ruffled 4 s** plus a flat 20 FZ (+10 more, and Soggy, if he lands in the bucket splash). He then spends **6 s** on the ground before a yellow **Climb Back**. A Hiss on the Climb Back keeps him down 3 s more. **Frazzled on the wall, he stays on the wall; the Pile-On plays on the wall top** (every standing Posse cat leaps up for it). Which AI cats climb to him is the §3.11 High Road rule (at most 2 on the wall). The fight length depends on knock-off frequency (F9): the sim needs about one knock-off per 8 s of wall time.

| Phase (Nerve) | Arena | New attack | New Ruffle route |
|---|---|---|---|
| 1 (100–70%) | His garden wall, one bucket below | Yellow **Paw Swat** at perched cats; red **Belly Drop** from the wall onto a ground area (he jumps straight back) | Knock-off into the bucket |
| 2 (70–35%) | 2 Wall Sitter Toughs join; the bucket refills; a scooter horn is in reach | Yellow **Wall Yowl** (Fired Up on his Toughs): Hiss it | The horn (Loud Noise, if he has it) |
| 3 (35–0%) | The wall top crumbles at both ends, so knock-off edges get wider; 2 more Toughs | Red **Rolling Thunder** along the ground after each Climb Back | Ledge junk (a cucumber) above his wall |

- **Phase rules (DR-32):** damage that would cross a phase threshold clamps at it. **The phase break keeps the Frazzle gauge.** **A break is deferred while he is Frazzled:** the window and the Pile-On run to completion, and a Pile-On on a clamped Frazzle plays the break as its final beat. Up to 10% of max Nerve of overflow carries into the next phase. A break lasts 3–4 s, he is invulnerable, it is T5, and every Posse cat gains +50 Pounce points. Total break time is ≤ 8 s.
- **Rematch:** each wipe against him leaves him plastered with −10% max Nerve (stacking to −30%, DR-21).

### 3.14 Encounters

- **No random encounters and no scene change.** Every opponent is visible first. **No combat inside Haru's wall** (house and garden, presentation ruling R4): no encounter starts or is placed there, and the tutorial crow is fought on the lane-side wall top. The ring is **≈ 10 m** (DR-48), centred on the nearest authored arena anchor. Level places 1–3 anchors per Patch, each with ≥ 2 props and a High Road ledge.
- **Openers** (`EncounterStarted.opener`):
  - `standoff`: name-card plus one taunt, 2–4 s. A memory-citing line cannot be skipped for 1 s. Both sides start neutral.
  - `ambush_by_player`: an unseen first hit, or a Pounce from the High Road. That hit is ×1.5 and **Ruffles** the target; every Posse cat gets +25 Pounce points; there is no Standoff. A remembered Rival's memory line plays **at its Rout** (DR-40).
  - `ambush_by_rival`: a 2.0 s directional yowl-sting. A Skitter or Brace in its **last 0.75 s** gives a neutral start. Otherwise the controlled cat takes MV 1.5 and the Posse starts at 0 Pounce points.
  - `raid_defence`: the posted Sentries fight as allied AI. They are not controllable, do not join Pile-Ons, and count toward the cap.
- **Composition** (threat: Tough 1, Captain 3, Boss 8, crow 0.5):
  - **skirmish** (roaming): 2–3
  - **normal encounter**: 4–6, for example 4–6 Toughs or a Captain + 1–3 Toughs
  - **Den approach**: 6
  - **Life 1 tutorial**: a crow; then 2 Strays
- **Caps:** 1–6 enemies at the start; **≤ 10 combatants** in total; anything beyond that arrives as a wave when ≤ 2 enemies remain; at most 2 waves outside the Boss fight.
- **Scram:** hold the controlled cat > 2 m outside the ring for 3 s, or pick Scram in Slow Blink. Outcome `player_fled`. The group is then alert for 20 s, so it cannot be Ambushed. Combat applies no penalty of its own.
- **Rival flight:** a Rival with a `flee_threshold` (Nemesis) bolts on a yellow windup of 1.0 s. A Hiss or any landed hit stops it. A Frazzled or Splat cat cannot bolt. The First Thorn uses this same rule (DR-22, DR-41).
- **Fed Up at 75 s** (non-Boss fights): every enemy is Ruffled for the rest of the fight, ignoring the cooldown, and Toughs Back Down to a Hiss at ≤ 30%.
- **Ending:**
  - `win`: survivors Lick Wounds (+25% of missing Nerve, outside the heal cap). Mikan, if Routed, gets up at 20%. Routed Crew stay Routed until a Sunspot or home.
  - `loss`: every Posse cat Routed. DR-19 applies; the victor Gloats (≤ 3 s, Nemesis/UX).
  - Nerve and Zoomies persist within the day. Paws, statuses and Frazzle do not.
- **Verdict:** routed tracked Rivals are held at the ring edge (DR-36). There is one full Verdict per fight (Nemesis).

### 3.15 Difficulty (enemy-side only)

| | Kitten | **Alley (default; all targets)** | Feral |
|---|---|---|---|
| Enemy Nerve | ×0.75 | ×1 | ×1.2 |
| Enemy damage | ×0.6 | ×1 | ×1.3 |
| Melee tokens on the controlled cat | 1 | 2 | 3 |
| Enemy Paw rate | ×0.75 | ×1 | ×1.25 |

### 3.16 What is taught when (DR-22; UX owns the beat sheet)

| When | Verbs |
|---|---|
| 0:04–0:08, garden, then the lane-side wall top | Move, Hop in the garden; then Attack, Skitter on a crow on the lane-side wall top (no combat inside the wall, R4) |
| 0:10–0:15, lane | With the old wall cat against 2 Strays: switch, first Paw, Slow Blink, command the other cat, Frazzle the last enemy → **two-cat Quick Pile-On** |
| Rest of Life 1 | Hiss, Back Down, Brace (First Thorn), **Tag-In** (2-cat) |
| Life 2 day 1 | Ambush, High Road Pounce |
| Life 2 day 2 | Props and Fears; Relay (Posse of 4) |
| Life 2 day 3 | Zoomies (Mikan's unlocks today, on the Captain; Crew `crew-and-progression.md` §3.8.4). Lessons open at the Lot the same day (Crew/Territory) |
| Life 2 day 4+, Den | Daifuku: knock-offs |

### 3.17 Game feel and VFX — Impact Moments (the single tier table, DR-07)

Art owns the drawings and Audio maps to these same tiers. **DR-50 safety overrides every row.**

| | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| **Events** | Whiff, prop hit, blocked hit | String hits 1–2; middle hits of multi-hit Moves | Finisher, Pounce, Tag-In strike, Splat | 1-Paw Move hit, Hiss interrupt, Fear trigger | 2-Paw Move hit, Frazzling hit, Tough Rout, Back Down | Pile-On, Zoomies, Boss phase break, leader (Captain/Boss) Rout |
| Hit-stop | 0 | ≈ 40 ms, local | ≈ 80 ms, local | ≈ 120 ms, local | ≈ 180 ms, **global** | ≈ 230 ms, **global**, then authored |
| Screen shake (stepped, peak % of viewport height) | 0 | 0 | 0.4 | 0.7 | 1.1 | 1.6 |
| Shake steps (one per 33 ms, ×0.6 decay per step) | — | — | 3 | 4 | 5 | 7 |
| Smear | ≥ 2 rendered frames | ≥ 2 | ≥ 2 | ≈ 70 ms | ≈ 70 ms | ≈ 70 ms |
| Action lines | — | — | Local streak, ≈ 200 ms | Radial on 20% of the edge, ≈ 300 ms | Radial on 40% of the edge, ≈ 400 ms | Full-field (Ink/Cream), ≈ 600 ms, plus cut-in |
| Impact frame | — | — | — | Local disc ≤ 15% of screen, 2 frames | Full-screen mid-tone inversion (luminance change ≤ 0.10), 2 frames, plus a 2-frame effect-shape flash | Full-screen, 3 frames plus 2 |
| Glyph / lettering | — | Spark | 1 glyph, 0.6 m | Glyph burst of 2–3, 1.0 m | **Lettered word**, ≈ 12% of screen height, ≈ 500 ms | **Giant lettered word**, ≈ 30%, ≈ 800 ms |
| Dust | 2 puffs | 3-puff ring | 5-puff ring | Ring plus trail | Ring plus crack decal | Cloud 3.5 m across (Full) / 2.5 m (Quick) |
| Camera punch-in | — | — | 1.5% | 3% | 6% | Authored, ≤ 15% |
| Time dip after hit-stop | — | — | — | — | 30% for ≈ 200 ms | 20% for ≈ 500 ms (final Rout only) |
| Rumble (low/high, 0–1) | 0/0.1 | 0/0.25 | 0.35/0.3 | 0.55/0.5 | 0.85/0.7 | 1/1, 3 pulses then decay |

**Rules:**
1. **Player authorship:** hits from AI cats acting on their own render **one tier lower** and never cause global hit-stop, full-screen effects or lettering. Commanded hits render at full tier.
2. **One screen-wide channel:** full-screen frames, full-field lines, cut-ins and giant words share it. A higher tier pre-empts a lower one, and equal tiers queue at least 170 ms apart. **A Tough Rout gets its full-screen frame only if player-authored and only if no full-screen frame played in the last 1 s; otherwise it downgrades to local.**
3. **Shake (one model):** each event plays the table's stepped pattern (peak %, one step per 33 ms, ×0.6 decay per step). When patterns overlap they are **summed and clamped**: total displacement never exceeds **1.8% of viewport height**, and a new pattern never restarts a louder one already running. There is no separate trauma curve. The motion option scales it to 0–100%. Camera plays it back (`camera-system.md`).
4. Multi-hit Moves: only the first and last hits use the Move's tier. A multi-target hit gets one hit-stop and one shake.
5. **Caps:** 4 glyph bursts / 20 glyphs alive (PC). 60 dust puffs. Nothing covers the controlled cat's ground ring or an active telegraph decal, and telegraph decals draw above dust.
6. **Timers** (Frazzle, Ruffled, statuses, cooldowns) **stop during global hit-stop** and run at 5% in Slow Blink. Time dips ease out over ≈ 100 ms.
7. **Incoming hit on the controlled cat:** same tier as the enemy's class (white T1/T2, yellow T3, red T4), but hit-stop is local and 75% as long, with an **Ink/halftone edge pulse** (≈ 150 ms, alpha 0.35) instead of an impact frame. The pulse is never coral, which is Koharu's colour. Hits on AI cats render two tiers lower with no shake.
8. **Paw-fill feedback:** a drawn flat disc with a halftone edge at the cat's feet (Art's "glow"), plus a per-slot audio cue.

**Safety (DR-50; the default configuration must pass an automated Harding-style analysis):**
- ≤ 3 flashes in any 1 s (WCAG 2.3.1, area > 20%), with a **design cap of 2/s and 6 per rolling 5 s**.
- ≤ 1 full-screen impact frame per second (any extra downgrades to local).
- No saturated red change over > 5% of the screen; full-field lines in Ink/Cream; lettering in Ink/Cream or the damage-type colour.
- Every look event lasts ≥ 2 rendered frames; shake is stepped.
- **Global hit-stop ≤ 200 ms in any rolling 1 s** outside authored T5 sequences (excess is dropped, not queued).
- **Reduce Flashes:** impact frames become a +1 px line hold with no luminance change. **Reduce Motion:** shake, punch-ins and full-field lines are scaled together.

**Lettered onomatopoeia (DR-49), which events letter:**
- **Only T4 and T5, and only when player-authored.** At most one word on screen. Never over the controlled cat or the HUD. World-anchored. Never at home.
- Event → word class: Claw hit → *scratch* word; Thump → *thud* word; Yowl → *yowl* word; Frazzling hit → *pop/burst* word; Back Down → *hiss* word; Pile-On final beat → *dust-cloud* word; Boss phase break → *crash* word; leader Rout → *bolt/whoosh* word.
- Art supplies about 16 hand-lettered words per language from these classes. Japanese uses native onomatopoeia.

**Audio timing (SB-X13):** Combat owns *that* a cue exists and *when* it plays; Audio owns the timbre.
- Ruffled: cue on onset, held 4 s.
- Frazzled: a swell on the Frazzle, then a tick on each beat through the 6 s.
- Slow Blink: a cue on open and on close.
- Paw: a cue per slot.
- Hit-stop freezes audio within its scope.
- Telegraph vocals by class; the Hiss sound belongs to the acting cat.

**Camera and readability (DR-48; camera states owned by `camera-system.md`):**
- The combat camera pulls back 6–8 m and frames **the controlled cat, its lock target and every active telegraph**. It does not try to frame every combatant.
- Edge arrows mark off-screen Posse cats and attackers.
- Posse cats: bell-gold keyline plus an overhead tick. Enemies: a Clowder-colour outline. Both have a 1 px Paper Cream rim.
- **World text in real-time combat:** only the single bark balloon, one lettered word, and the Pile-On prompt's word (on its first 3 showings; glyph only after that). **Damage numerals are Off by default in the slice** (presentation ruling R3), with an Options toggle Off / Big hits / All (UX owns the display). Weakness and resistance read from the spark shape (an extra Ink crack wedge on a weak hit, a blunted spark on a resisted one; Art).
- The enemy Frazzle bar sits on the enemy. An identity ribbon appears only for tracked Rivals, Captains and Daifuku (UX-2).

---

## 4. Formulas

**Notation.** `N_ref(L)` and `S_ref(L)` are Crew's neutral Nerve and neutral other-stat curves (brief §8: Nerve 100 → 1,500, other stats 10 → 100, over Lv 1–30; slice Lv 1–10, Crew's cap). **1 MV = one basic hit = 4.5% of a same-level neutral cat's max Nerve.**

### F1. Damage
```
dmg = round( MV × B(L_a) × (Off_a / S_ref(L_a)) × clamp(S_ref(L_d) / Hide_d, 0.75, 1.25) × A × R × F × G )
B(L)  = 0.045 × N_ref(L)                         base hit size; flat 4.5% at every level (CS-8)
Off   = Bite (Claw, Thump) or Voice (Yowl)
A     = clamp(Type × Status × Perk × Ambush, 0.5, 1.6)   amplifier cap (CS-C20)
R     = rank damage of the attacker: Posse/Tough 1.0, Captain 1.3, Boss 1.6, crow 0.8
F     = 1.5 if the target is Frazzled, else 1
G     = max(0.30, Brace 0.3 × Puff Up 0.7 × Stalwart 0.85 × …)   ≥ 30% always gets through (CS-11)
```
**MV is defined for a neutral attacker against a neutral defender** (Off = Hide = S_ref): there, one MV is exactly B(L).
*Example (Lv 8, Crew F1 stats; N_ref(8) ≈ 438, S_ref(8) ≈ 31.7, B = 19.7):* Mikan (Scrapper, Bite 38, so ×1.20) lands string hit 1 (MV 1.0):
- on a Lv 8 Bruiser Tough (Hide 40, so ×0.79; Claw neutral): 19.7 × 1.20 × 0.79 = **19**, against 569 Nerve = 3.3%;
- on a Scrapper Tough (Hide 29, ×1.09; Claw resisted ×0.8): **21**;
- on a Yowler Tough (Hide 30, ×1.06; weak to Claw ×1.2): **30**.
A mixed Wall Sitters group averages about 1.0, which the F9 doc model assumes.
*Example cap:* an Ambush (×1.5) on a Yowler (×1.2) by a Fired Up cat (×1.25) = 2.25, clamped to **1.6**.

### F2. Frazzle gain
```
ΔFZ = FZ × r_rank × (2 if Ruffled) × OldScore × Weak   +   flat chunks
r_rank   = Tough/Stray/crow 1.0 · Captain 0.20 · Boss 0.15
OldScore = 1.25 (Brooder 1.5);  Weak = 1.2 if the target is weak to the hit's type
flat chunks (ignore r_rank and Ruffled): Relay +10/+15/+20 · knock-off/Splat 20 · bucket +10 ·
  Braggart first hit 20 · Fear 30/20/15 (Tough/Captain/Boss)
```
Basic FZ: string hits 8, 8, finisher 14 (30 per string). Tag-In strike 20. Pounce F7.

### F3. Pounce Gauge (Paws)
```
ΔP = fill × (4/s passive [0 while perched] + 4 per string hit landed + 6 per finisher/Pounce) + grants
fill = 1.0 controlled, ai_fill (0.5) AI      grants: Tag-In 25 (both cats) · Ambush 25 · Well-Fed 25 at the start · Fraidy perfect Skitter 25
cap = 200 (2 Paws)
```
*Controlled cat:* at 65% attack uptime that is 0.65 × 3 hits / 1.8 s = 1.08 hits/s × 4.67 average = 5.1, + 4 passive = **9.1 pts/s → 1 Paw per 11 s**.
*AI cat:* 0.5 × (4 + 0.35 × 1.67 × 4.67) = **3.4 pts/s → 1 Paw per 30 s**.
*Tag-Ins* (baseline 1 per 10 s × 50 pts) = 0.05 Paw/s.
*Posse total:* 0.091 + 3 × 0.034 + 0.05 = **0.242 Paws/s**.

### F4. Healing
```
heal = HealMV × B(L_h) × (Voice_h / S_ref(L_h)) × (1.5 if a Cowed enemy is within 6 m)
Total healed per cat per fight ≤ 0.60 × its max Nerve (Purr, Aria; Lick Wounds after the fight is outside the cap)
```
*Example:* a neutral Yowler's single Purr heals 3.0 × 4.5% = 13.5% of neutral Nerve, or 20.3% with a Cowed enemy nearby. A Bruiser ally (×1.3 Nerve) receives 15.6% of its own bar. It takes at least 3 Cowed Purrs to reach the 60% cap, which uses that Yowler's whole Paw income for about 90 s of AI time (CS-10).

### F5. Pile-On
```
Quick (trash): Routs every Frazzled enemy in the cluster (or the last enemy). No damage roll.
Full (Captain/Boss): PileOn = Σ_cats (2.0 + k × T_rem) × TypeMod_cat × 1.5        k = 1.0 MV/s, T_rem = seconds left of the 6 s window
Pips shown = ceil(T_rem / 1.2)  (5 → 0)
```
*Why k = 1.0:* the window is worth about 2.5–2.8 MV/s × 1.5 in basics to a leader. Four cats × k × 1.5 = 6 MV per remaining second, which is more than the basics would deal. So the **Pile-On itself is always worth more earlier** (DR-30).
*Decision, worked (Captain, 4 cats):*
- **(a)** Cash in at once: 4 × (2 + 6) × 1.5 = **48 MV** in 2.5 s.
- **(b)** No Paws banked, wait to the end: basics 6 s × 2.48 × 1.5 = 22.3, then 4 × 2 × 1.5 = 12, total **34.3 MV** in 8.5 s. **(a) wins.**
- **(c)** 2 Paws banked, 1.5 s spent dumping them, then cash in at T_rem 4.5: basics 1.5 × 2.48 × 1.5 = 5.6, Moves 2 × 3.5 × 1.5 = 10.5, Pile-On 4 × 6.5 × 1.5 = 39, total **55.1 MV** in 4 s. **(c) beats (a)**, which is what makes Paw banking a real decision (CS-6).

### F6. Tag-In and Relay
```
Tag-In strike: MV 1.5 (bonded ×1.25), FZ 20 (+10 bonded), T2
Relay flat FZ: tag 2 +10, tag 3 +15, tag 4 +20 (ignores r_rank); bonus locked 6 s after a 3+ relay
```
*Four-cat Relay on a Captain:* strikes 4 × 20 × 0.20 = 16, plus 45 flat = **61 FZ in about 2 s**. Normal Captain build is about 7.4 FZ/s (F9), so a Relay saves about 8 s of building.

### F7. High Road Pounce (Wind-Up)
```
MV = 1.5 + 0.5 × t_aloft (max 3.0 at 3 s) · FZ = 15 + 10 × t_aloft (max 45) · ×0.6 and no Paw points if within 1.5 s of mantling
```

### F8. Zoomies gain
```
+1 per 1% of own max Nerve lost (≤ +40 per encounter) · +10 to every standing Posse cat on each enemy Frazzle · gauge 100, persists through the day
Well-Fed: Mikan starts the day at 5% × Bond hearts (max 50)
```
*Pace:* about 3 Frazzles plus about 20% damage per normal encounter gives about +50, so each cat gets one Zoomies about every 2 encounters (2–3 per day per cat).

### F9. Reference model: the fight-length arithmetic (Alley, same level, neutral matchups)

This is the **expected-value spec for the encounter sim (DR-57)**, not a substitute for it.

**Iteration 3 — sim-checked figures (these replace the hand claims below where they differ).** The round-2 sim (`design/reviews/round-2/sim/combat_slice_sim.py`, deterministic) shows the hand model below is optimistic by 0–25%, because it treats Paw income as continuous Move damage (no Move is affordable inside a Tough-length fight) and the catalogue averages ≈ 2.1 MV / 20 FZ per Paw, not 3.5 / 30. Ranges are *doc variant – slice variant* (slice = Crew's Lv 8 stats and the slice Posse):

| Fight (ruled band) | Hand claim below | **Sim (canonical)** | In band? |
|---|---|---|---|
| Tough, focused in a group (6–10 s) | 7.9 s | **9.7–10.7 s** | Upper edge |
| Tough, last enemy (Quick Pile-On) | — | **5.6–5.7 s** | ✓ |
| Skirmish, 2 / 3 Toughs (A2) | 16 / 24 s | **18–21 / 25–28 s** | ✓ (A2) |
| 4 / 5 / 6 Toughs (30–60 s) | 31 / 39 / 44 s | **33–36 / 40–44 / 48–53 s** | ✓ |
| Captain, any Style (30–45 s) | 36.7 s (Bruiser 44, Yowler 33) | **37 s; Bruiser 37–44 s** (after `captain_style_nerve` = off, §3.12) | ✓, 2 Frazzles each |
| Captain, expert policy (≥ 21 s) | 25 s | **27–31 s** (Bruiser 35 s) | ✓ |
| Daifuku (120–180 s) | 140 s | **166–176 s** at one knock-off per 8 s of wall time (≈ 14 s cycle); Frazzles per phase 2/3/2 – 3/2/3 | ✓ but fragile: 10 s of wall time → 175–185 s, 24 s → 206 s |

The single retune is `captain_style_nerve` = off (the ×1.3 Bruiser Captain ran 55–58 s). Every other line is a corrected figure, not a retune. The hand derivation below is kept as the explanation of *why* the bands hold.

**Rates per cat (from F1–F3):**

| Source | MV/s | Raw FZ/s |
|---|---|---|
| Controlled cat, basics (string 3.5 MV and 30 FZ per 1.8 s × 65% uptime) | 1.26 | 10.8 |
| AI cat, basics (× 35% uptime) | 0.68 | 5.8 |
| Posse basics (1 + 3 AI) | **3.30** | **28.2** |
| Moves (0.242 Paw/s × 3.5 MV / 30 FZ) | 0.85 | 7.3 |
| Tag-In strikes (1 per 10 s) | 0.15 | 2.0 |
| **All four on one target** | **4.30** | **37.5** (8.7 FZ per MV) |

**Focus factors**, the share of that output that reaches the target:
- Tough under focus: the controlled cat + 1 AI.
- Normal group: 0.55 (targets split, 4–6 attackers to dodge, token posturing).
- Captain: 0.75, with half the Paws banked for the window, which gives **2.91 MV/s** and **25.4 raw FZ/s**.
- Boss on his wall: 0.5 (High Road cats only). Boss on the ground: 0.85.

**Tough under focus (target 6–10 s).**
- Output: 1.26 + 0.68 + 0.175 Paw/s × 3.5 + 0.15 = **2.70 MV/s**, at 8.8 FZ per MV.
- Nerve 22.2 MV (100% ÷ 4.5%). It Frazzles after 100 / 8.8 = 11.3 MV, which takes **4.2 s**, with 51% Nerve left.
- The remaining 10.9 MV at ×1.5 is 7.3 effective, which takes **2.7 s**.
- Plus 1 s to close the distance: **≈ 7.9 s ✓**.
- After an Ambush (Ruffled 4 s): ≈ 6.0 s ✓.

**Normal encounter (target 30–60 s).**
- Group output: 4.30 × 0.55 = **2.37 MV/s**.
- Each Tough is effectively 11.5 + 10.7 / 1.5 = **18.6 MV**. The last enemy's Quick Pile-On saves 7.1 MV. Opening and closing add 3 s.
- 4 Toughs: (74.4 − 7.1) / 2.37 = 28.4 s + 3 = **31 s ✓**
- 5 Toughs: **39 s ✓**
- 6 Toughs: **44 s ✓**
- Captain + 2 Toughs: 37.2 / 2.37 = 15.7 s + Captain 36.7 s (below), partly overlapping, ≈ **50 s ✓**
- (Skirmishes of 2–3 Toughs: 16–24 s by hand, 18–28 s in the sim, deliberately below this band. DR-16's 4–6 fights per day mixes both.)

**Captain (target 30–45 s; Nerve 8 × 22.2 = 177.8 MV).**
- Build: 25.4 × 0.20 = 5.08 FZ/s, × 1.25 for 25% Ruffle uptime (Hiss on its yellows, a prop; capped at 40% by the cooldown) = 6.35, + a 2-cat Relay every 10 s (+1.0) = **7.35 FZ/s**.
- So it Frazzles after **13.6 s**, by which time the Posse has dealt 13.6 × 2.91 = **39.6 MV**.
- Window: F5(c) = **55.1 MV in 4 s**.
- One cycle = 17.6 s and 94.7 MV, leaving 83.1 MV. The second build (13.6 s, 39.6 MV) leaves 43.5 MV, which an early Pile-On finishes in about 3.5 s.
- **Total ≈ 17.6 + 13.6 + 3.5 + 2 (opening) = 36.7 s ✓**, with 2 Frazzles.
- Style spread: Captains take no Style Nerve multiplier (§3.12), so every Captain has 177.8 MV; a Bruiser Captain is slower only through its Hide (sim 44 s in the slice variant) ✓.
- Expert policy (a 4-cat Relay per cycle, 40% Ruffle uptime): **≈ 25 s**. That is allowed down to 0.7 × the band floor, which rewards skill.

**Daifuku (target 2–3 min; Nerve 26 × 22.2 = 577.8 MV; phases 173 / 202 / 202 MV).**
- **Knock-off cycle (≈ 14 s):**
  - Wall, 8 s at focus 0.5: 1.94 MV/s gives 15.5 MV; 16.9 × 0.15 = 2.54 FZ/s gives 20 FZ.
  - Knock-off into the bucket: 30 FZ flat.
  - Ground, 6 s at focus 0.85: 3.29 MV/s gives 19.7 MV; 4.3 FZ/s, ×2 for the 4 s Ruffled, gives 43 FZ.
  - Relays: 14 FZ.
  - Cycle total: **35 MV and 107 FZ**, so about one Frazzle per knock-off (≈ 13 s of building, ≈ 33 MV).
- **Window:** 1.5 s × 2.8 × 1.5 = 6.3, + 10.5 (2 Paws), + 39 (Pile-On) = **55.8 MV in 4 s**.
- **Frazzle cycle:** 17 s and ≈ 89 MV. 577.8 / 89 = 6.5 cycles, about **110 s**.
- Add 2 phase breaks (7 s), the opening (3 s) and the phase 2–3 Tough waves (≈ 20 s): **≈ 140 s = 2.3 min ✓**.
- **Frazzles per phase:** 1.9 / 2.3 / 2.3, so every phase has ≥ 1 ✓ (DR-32).
- At −30% plastered, the fight takes **≈ 1.7 min** (a deliberate story-player assist).

**Crew share (DR-33, target ≥ 55%).** Worst case, the player controls Mikan the whole fight. Basics: Mikan 1.26 against Crew 2.04. Moves: Mikan's 0.32 against the Crew's commanded Paws 0.53. Pile-Ons: 3 of 4 beats. **Crew share ≈ 62% in trash fights and ≈ 66% against a Captain ✓.**

**Conductor share.** Against a Captain, commanded Moves, Tag-In strikes and Pile-Ons are 4.3 + 1.5 + 49.5 = 55.3 of 94.7 MV per cycle, **≈ 58%** (CS-5: the conductor layer is now the majority where it matters).

### F10. Incoming damage model (CS-12)

**Normal 5-Tough encounter (≈ 40 s):**
- Token holders attack once per 4.5 s at about 1.5 MV each. About 55% of enemies are still standing on average across the fight.
- Controlled cat: 2 tokens × 8.9 attacks × 1.5 MV × 40% landed = 10.7 MV.
- AI cats: 3 × 8.9 × 1.5 × 60% = 24.0 MV.
- Total 34.7 × 0.55 = **19.1 MV ≈ 21% of the Posse's 89 MV of Nerve** (target 15–25% ✓).

**Daifuku (≈ 140 s):**
- He attacks every 4 s for 2 MV × 1.6 = 3.2 MV, about half of which lands: 35 attacks × 3.2 × 0.5 = 56 MV.
- The Tough waves add about 8 MV.
- Total 64 MV = **72% without heals** (target 50–80% ✓).
- Purr can recover at most 60% per cat, so the fight stays tense but survivable.

---

## 5. Edge Cases

1. **Frazzled at a phase gate:** damage clamps; the break waits until the window or Pile-On ends; overflow up to 10% of max Nerve carries over. A Pile-On started on a clamped Frazzle plays the break as its last beat.
2. **Phase gate reached with Frazzle at 95:** the gauge is kept through the break, so the first hits in the next phase can Frazzle him.
3. **Pile-On while a second enemy attacks:** the participants are invulnerable, and enemies outside the Pile-On hold their attacks until it ends. A red windup already in progress pauses.
4. **Pile-On availability drops mid-window** (a Posse cat Routed, leaving < 2 standing): the prompt disappears. Frazzle continues.
5. **Quick Pile-On with 3 Frazzled Toughs, two within 3 m and one 5 m away:** only the cluster of two is Routed. The third stays Frazzled.
6. **Last enemy is a Captain:** the Full Pile-On rule applies, not the "last enemy" Rout rule. Auto-Rout applies only below Captain.
7. **Tag-In to a cat > 8 m away or out of line of sight:** it is a plain switch with no strike, no Paw grant and no Relay.
8. **Relay revisiting a cat:** a non-starter cat that has already been the incoming cat cannot be selected (its D-pad direction is greyed for the rest of the Relay); switching to it is a plain switch and ends the Relay. The Relay's starter stays selectable and, as the incoming cat, closes the Relay with that tag (so A→B→A is a 2-tag Relay, A→B→C→A a 3-tag one and A→B→C→D→A the 4-tag maximum). After tag 4 the Relay ends.
9. **Controlled cat Routed during a Tag-In leap:** impossible, because the leap is invulnerable. If the cat is Routed in its recovery, control passes to the next slot.
10. **Slow Blink during a Frazzle window:** pips drain at 5% time. Commands skip pathing. A Pile-On can be chosen from the menu.
11. **Hiss on a red telegraph:** the cooldown is spent and nothing happens (the HUD shows a fizzle glyph). Red is never interruptible.
12. **Two yellow windups at once:** one Hiss interrupts only the attacker in front within 4 m. Interrupting several is a job for the conductor (switch, then Hiss).
13. **Back Down on a Tough that is Frazzled:** allowed. Back Down beats the Pile-On prompt, and the event `CatRouted(by_back_down)` is sent.
14. **Ruffle on a leader during its cooldown:** the Ruffle is ignored and a small "wise to it" glyph shows. Fear triggers still give their chunk and rider. Fed Up overrides the cooldown.
15. **Status replacement:** a Cowed enemy hit by a Soggy splash becomes Soggy, not Cowed. Purr's bonus checks Cowed at cast time.
16. **Damage-reduction stacking:** a Bracing Bruiser in Puff Up next to a Stalwart is 0.3 × 0.7 × 0.85 = 0.18, floored to **0.30**.
17. **Heal cap reached:** further heals on that cat show a capped glyph and do nothing. Purr cannot be cast at a capped cat from Slow Blink (greyed).
18. **Knock-off of an enemy with the Strength "cannot be knocked off":** the enemy stops at the edge, and knockback becomes a flinch. On Daifuku that Strength is forbidden (Nemesis rule request).
19. **Crow knocked off the High Road:** it flies; there is no Splat. Crows are exempt from knock-offs.
20. **Fear prop triggered by the enemy side:** it applies to every cat in range, Posse included, if a Crew cat carries that Fear (recruited Rivals keep their Fears).
21. **Daifuku knocked off with no bucket in reach:** Ruffled plus 20 FZ, no Soggy. The bucket only adds value; it is never required.
22. **Wipe during a Pile-On:** impossible (participants are invulnerable). A wipe in the frames after it resolves normally (`loss`).
23. **Fed Up during a Frazzle window:** the window is unaffected. Ruffled applies after it ends.
24. **Ambush by player on a group:** only the first target is Ruffled and takes ×1.5. The rest start neutral.
25. **Degenerate strategies checked:**
    - **Stun-lock:** poise rules cap a leader's lost action time to ≤ 4 s outside Frazzled, Splat or Fear.
    - **Turtle:** red attacks and Fed Up.
    - **Mantle-pounce loop:** the 1.5 s penalty.
    - **Heal loop:** the 60% cap.
    - **Paw farming:** no self-refunds, and AI never spends its last Paw.
    - **Hiss loop on leaders:** the interrupt spends the enemy's Paw, puts the Move on cooldown, and the re-Ruffle cooldown applies.
    - **Control one cat all fight:** Tag-Ins are worth both damage and Paws (F3, F6). The sim checks that the switch rate is > 0 in the best policies.

## 6. Dependencies

| System (doc) | Direction | Contract |
|---|---|---|
| Nemesis (`nemesis-system.md`) | ← reads | `RivalCombatProfile` (level, style, personality, moves, strengths, fears, title, scars, `flee_threshold`); Memory query for Old Score; leader levels per §3.12; Daifuku's trait kit must not include "cannot be knocked off" |
| Nemesis | → emits | `EncounterStarted`, `CatRouted` (incl. `by_back_down`, `by_pile_on`), `FearTriggered` (incl. `source = tell`), `EncounterEnded`; Verdict hold at the ring edge |
| Crew & Progression (`crew-and-progression.md`) | ← reads | Stat curves `N_ref`, `S_ref`; per-cat stats; learnsets by `move_id`; Mikan's ≤ 2 cross-Style Moves; bonded/clashing pairs; Zoomies unlocks (Mikan Life 2 day 3, Crew Lv 6). Crew's personality sheets point to §3.11 for every combat value |
| Crew | → emits | `MoveUsed`, `TagIn`, `EncounterEnded` (XP, Loyalty "Routed in a lost fight") |
| Territory & Economy (`territory-management.md`) | ↔ | `raid_defence` opener with Sentries as allied AI; `EncounterEnded` for loot; no prices here |
| Day loop (`day-loop.md`) | ← reads | Well-Fed flag (DR-20); phase for Night Rivals; Combat pauses the clock |
| Camera (`camera-system.md`) | → requires | Combat state (6–8 m, framing the controlled cat + lock target + active telegraphs), Slow Blink view, cinematic cuts for the Standoff, Pile-On, Zoomies and phase breaks; the reduced-shake option |
| UX (`ux/hud.md`) | → requires | The control map (DR-08) with this doc's actions; Slow Blink menu; Frazzle bar on the enemy with 5 pips; identity ribbon for named enemies; edge arrows; Pile-On prompt; beat sheet (§3.16) |
| Art (`art/art-bible.md`) | → requires | Drawings for every row of §3.17; telegraph decals and glyphs; 6 personality animation sets including Pile-On flourishes; Tag-In strikes (3 Styles); lettering sets |
| Audio (`audio/sound-bible.md`) | → requires | Cues per tier, the §3.17 cue timing list, 8 bark intents, a Rival yowl-sting for Ambush |
| Accessibility (`design/accessibility-requirements.md`) | ↔ | Mirrors the safety rules; Reduce Flashes and Reduce Motion; remapping; hold toggles |
| Narrative (`dual-story-progression.md`) | ← reads | Life 1 beats (DR-22); Life 8 Carry AI fill (Backlog) |
| Level design | → requires | Arena anchors (≈ 10 m ring, ≥ 2 props, a High Road ledge); Daifuku's 3-phase arena with bucket refills |

## 7. Tuning Knobs (`assets/data/combat/*`)

| Knob | Default | Safe range | Category | Rationale |
|---|---|---|---|---|
| `basic_hit_pct` (B/N_ref) | 0.045 | 0.04–0.05 | Curve | Canon 4–5%; drives every TTK |
| `string_mv` | 1.0 / 1.0 / 1.5 | ±20% | Curve | 3.5 MV per string |
| `string_fz` | 8 / 8 / 14 | ±25% | Curve | Tough Frazzles at about 50% Nerve |
| `string_cycle_s` | 1.8 | 1.5–2.2 | Feel | Short and readable |
| `ai_attack_uptime` | 0.35 | 0.25–0.45 | Curve | Crew share vs player authorship |
| `ai_fill` (per Life) | 0.5 | 0.4–1.0 | Gate | DR-35 |
| `paw_passive`, `paw_per_hit`, `paw_per_finisher` | 4/s, 4, 6 | ±25% | Curve | 1 Paw per 11 s controlled |
| `tag_in_window_s` | 0.35 | 0.25–0.5 | Feel | DR-29 |
| `tag_in_strike` | MV 1.5, FZ 20 | MV 1–2 | Curve | A T2-sized hit |
| `tag_in_paw_grant` | 25 | 15–35 | Curve | Quarter Paw (DR-29) |
| `relay_bonus_fz` | 10/15/20 | ±50% | Curve | Four-cat Relay ≈ 61 FZ on a Captain |
| `relay_lockout_s` | 6 | 4–10 | Gate | Stops Relay spam |
| `frazzle_res` (rank) | 1.0 / 0.20 / 0.15 | Captain 0.15–0.3 | Curve | 2 Frazzles per Captain, ≥ 1 per Boss phase |
| `frazzled_s`, `frazzled_dmg` | 6, 1.5 | canon | — | DR-28 |
| `ruffled_s`, `leader_reruffle_cd_s` | 4, 6 | canon | — | DR-28 |
| `frazzle_decay` | T 5/s @4 s; C 2/s, B 1/s @6 s | — | Curve | Clearing adds does not erase leader work |
| `pile_on_base`, `pile_on_k` | 2.0, 1.0 | k 0.8–1.3 | Curve | Earlier = more (F5); k > 0.75 required |
| `rank_nerve`, `rank_dmg` | 1/8/20; 1/1.3/1.6 | canon | — | DR-31 |
| `captain_style_nerve` | off (Captains use ×1.0) | off / on | Curve | On puts a Bruiser Captain at 55–58 s, outside 30–45 s (sim, F9) |
| `focus_*` (sim policy only) | 0.55 / 0.75 / 0.5 / 0.85 | — | — | Model inputs, measured by the sim |
| `hiss_cd_s`, `back_down_pct` | 8, 0.15 | canon | — | DR-28 |
| `enemy_paw_s` | 16 / 9 / 6 | ±30% | Gate | Leader pressure |
| `tokens_controlled` | 2 (Alley) | 1–3 | Gate | Incoming 15–25% |
| `heal_cap`, `dr_floor` | 0.6, 0.3 | canon | — | DR-31 |
| `fed_up_s` | 75 | canon | — | DR-31 |
| `knockoff_fz`, `bucket_fz`, `boss_ground_s` | 20, 10, 6 | ground 4–8 s | Curve | Daifuku's pace |
| `pounce_windup` | +0.5 MV/s, +10 FZ/s, 3 s cap | — | Feel | Rewards waiting on a wall |
| `zoomies_dmg_cap`, `zoomies_per_frazzle` | 40, 10 | — | Curve | About 1 Zoomies per 2 fights |
| Feel table rows (§3.17) | as listed | safety caps | Feel | DR-07; safety limits are not knobs |

## 8. Acceptance Criteria

**Simulation (DR-57; median policy, Alley, same level, 500 seeded runs per case):**
1. Tough under focus: median TTK 6–10 s. Normal encounter (4–6 threat): 30–60 s. Captain (+0–2 Toughs, Captain TTK): 30–45 s. Daifuku: 2–3 min. Expert policy is ≥ 0.7 × each band's floor.
2. Every Daifuku phase contains ≥ 1 Frazzle in the median run. Each Captain gets ≥ 2 Frazzles in ≥ 60% of runs.
3. Crew deal ≥ 55% of Posse damage with a Mikan-only policy. Commanded Moves + Tag-In strikes + Pile-Ons deal ≥ 45% of damage to Captains and Daifuku.
4. Incoming damage: a normal encounter costs 15–25% of total Posse Nerve; Daifuku costs 50–80% before heals.
5. Under a best-response policy, no input sequence keeps a Captain or Boss unable to act for > 4 s outside Frazzled, Splat or a Fear rider. Max-switch policies outperform no-switch policies on Captains.
6. A Full Pile-On with 0 Paws banked is worth more at T_rem = 6 than at T_rem = 0. With 2 Paws banked, the best trigger time is between 3 and 5 s remaining.

**Functional (unit/integration):**
7. Unrounded B(L) / N_ref(L) = 0.045 at every level 1–10 (Crew's slice cap); F1 with Crew's F1 stats reproduces the worked examples (19 / 21 / 30 at Lv 8). The amplifier never exceeds 1.6, and G never drops below 0.30.
8. A Pile-On Routs any Tough at any HP. A Quick Pile-On is offered only under the two DR-30 conditions.
9. A knock-off always Splats a non-Boss and always Ruffles Daifuku. No randomness in knock-offs, crits or damage.
10. AI cats never Hiss a telegraph aimed at another cat, never fire `command_only` Moves, and never spend their last Paw on their own.
11. Every Move in `moves.*` has `role` = setup or payoff and a state in `creates` or `pays_on`; ≤ 1 Ruffle-applying Move per Style; no Move refunds its own cost.
12. Events fire with the §6 payloads; `TagIn.relay_count` is correct through 4 tags.

**Feel and safety:**
13. The default build passes an automated Harding-style flash analysis on a capture of the Daifuku fight plus three normal encounters. Global hit-stop never exceeds 200 ms in any 1 s window outside T5. At most 1 full-screen impact frame per second.
14. Random-pause test: in ≥ 90% of pauses, testers point to their controlled cat within 1 s and name the active telegraph's class (colour-blind simulation included).
15. At most one lettered word is on screen at a time, never over the controlled cat or the HUD, and only on player-authored T4/T5 events.

**Playtest (DR-02, DR-03):**
16. Prototype: unprompted, ≥ 75% of testers perform ≥ 1 Tag-In and ≥ 3 commanded Moves per encounter, and rate the fight fun at 20 minutes.
17. Slice: every tester has controlled two cats and seen a Pile-On by minute 15.
18. ≥ 70% of testers can say, unprompted, how one Crew cat "fights differently" (personality reads).
19. ≥ 60% knock Daifuku into the bucket at least once without a hint after the first knock-off.

---

## Assumptions for creative-director review

- A1. **Damage numerals:** resolved by presentation ruling R3: Off by default in the slice, Options toggle Off / Big hits / All (§3.17).
- A2. "Normal encounter" means a threat budget of 4–6. Roaming skirmishes of 2–3 are allowed to run 18–28 s (sim, F9).
- A3. The Pile-On "earlier is worth more" coefficient (k = 1.0) is stated together with the Paw-dump trade-off, so the choice stays non-trivial.
- A4. The Daifuku phase arena (bucket refills, scooter horn, crumbling wall top) is a request to Level and Nemesis. His Fear is Nemesis's choice. The fight does not require it.

## Backlog (post-slice)

- B-1 · DR-04 / CS-C: full catalogue (≈ 45 Style Moves + 4 Home Moves); Prowler and Trickster strings, Tag-In strikes and Zoomies (names *Nine Shadows*, *Everything Off The Shelf* reserved; CS-C6); 3-Paw Move budget row (CS-C21); Mikan's third Paw from Life 4.
- B-2 · CS-C5, CS-C7, CS-C10, CS-C11 (non-slice): Dirt Kick, Loaf (with the S-11 limits), Neck Nip, Vanish, Shadow Step, Wall-Kick, Bait, Leap. Each is re-specified as a Set-up or Pay-off.
- B-3 · CS-C15 / DR-28: Knacks (merge duplicates; budget +10–15% of one channel; no new verbs). Tactics.
- B-4 · CX-9: PG ×0.7 on ranged basics (relevant once the Trickster ships).
- B-5 · CX-10: final Frazzle decay values (interim rank-scaled defaults are in §3.5).
- B-6 · CX-13: FF7R/Rebirth reference table corrections (the table is not in the slice body).
- B-7 · CS-9: damage-display ceiling at Lv 30 (with the 1.6 amplifier cap; re-check with Crew's maximum stats).
- B-8 · CS-14: arithmetic slips in deleted first-draft formulas; the reference path is now `crew-and-progression.md`.
- B-9 · CS-15: Zoomies budget audit for AoE and prop-activating Zoomies (the damage-gain cap of 40 is already in).
- B-10 · Botan (4–5 min, four phases; DR-45), Madam Sabi, Oboro, Ikari Boss kits; other Critters (rats, weasel, chained dog); the Usurper.
- B-11 · Life 8–9: AI fill 60/70/100% values and Carry escort combat (DR-27, DR-35).
- B-12 · Handheld feel scaling (shake ×0.8, glyphs ×1.2; AB-10/11 handheld budgets).
- B-13 · Crowd-fight readability beyond 6 enemies; one-handed presets.
- B-14 · Over-level tuning across Lv 1–30 (re-derive K from Crew's full curve).
- *From the round-2 check (`design/reviews/round-2/combat-and-crew.md`), not fixed in iteration 3:*
- B-15 · C-1 trim for the slice (optional): cut the 6 s Relay lockout; replace Wind-Up, the perch Paw-stop, "enemies prefer perched cats" and the 1.5 s mantle penalty with one fixed High Road Pounce (MV 2.5, FZ 35, 3 s re-use); Fear diminishing "full once, then tell only"; drop the Hiss Paw-spend + 6 s cooldown unless a Hiss loop shows up.
- B-16 · C-3 F9 realism: rewrite F9 and AC 1's expected values with whole-Paw arrival (the sim table in F9 is canonical meanwhile); decide whether 1-Paw Set-ups trade damage for the state (catalogue averages 2.1–2.5 MV per Paw against the 3.5 budget) or Pay-off MV rises.
- B-17 · C-4 AI Paw habits rarely fire (first AI self-cast at 60 s): let AI self-cast at 1 Paw when the controlled cat holds ≥ 1, or `ai_fill` 0.6 for the slice. Prototype question.
- B-18 · C-5 scope AC 16's "≥ 3 commanded Moves per encounter" to normal encounters (threat 4–6) and Captains; supply is 0 in a Tough-length fight.
- B-19 · C-6 Zoomies pace: F8 gives ≈ 0.7 Zoomies per cat per normal encounter, not 0.5; set `zoomies_per_frazzle` 5 or count only Captain/Boss Frazzles.
- B-20 · C-7 Yowler basics strongest (Voice 1.35, multi-target cone); watch in prototype, or normalise `Off` by Style offence weight.
- B-21 · C-8 leader level rule vs Crew's Daifuku Lv ≈ 9 / Kagi Lv 6; say which Lane Captains are "Den" Captains (with Crew R-3).
- B-22 · C-9 Rival personality AI: one target-choice bias per personality for enemies.
- B-23 · C-10 adopt Crew's old Stalwart idea (step into white telegraphs aimed at the controlled cat) if the Stalwart reads weakly.
- B-24 · C-11 slice body ≈ 57 KB vs 50 KB target (move rumble/punch-in rows to data, trim log).
- B-25 · Presentation backlog: Pile-On prompt word (Combat §3.17, first 3 showings) vs HUD §4.1 hint card; pick one. Hit-stop 0% option shipping only once fairness is confirmed.

## Revision Log

**2026-11-23 — Round 2 (fresh slice rewrite; first draft archived).**

*Experience critique (CX):*
- CX-1 **FIXED**: the DR-08 map is in §3.1; Righting is automatic; onboarding is §3.16 per DR-22, with two cats and a Pile-On by minute 15. The parts keeping Whack and Bap are **REJECTED** (DR-08).
- CX-2 **FIXED**: Pile-On always Routs below Captain; trash Pile-Ons only with 2+ Frazzled or on the last enemy; F5 makes the Full Pile-On worth more early. The per-Paw gradient is **REJECTED** (DR-30).
- CX-3 **FIXED**: Tag-In/Relay per DR-29 (§3.3, F6). Each cat appears once per Relay, so there is no ping-pong.
- CX-4 **FIXED**: ≈ 10 m ring under the third-person camera (DR-48); framing is the controlled cat + target + telegraphs; decal and glyph are the primary telegraph signals, pose secondary; full-screen frame rate limit; random-pause criterion (AC 14). The oval ring is moot under DR-48.
- CX-5 **FIXED**: Perch replaced by Wind-Up (F7); knock-offs are deterministic; Daifuku is never voluntarily down; his fight is the bucket (§3.13).
- CX-6 **FIXED**: every Move is a Set-up or Pay-off (§3.10); Old Score (§3.11); Style and personality beats in the Pile-On.
- CX-7 **FIXED** via DR-32 (gauge kept, break deferred, Pile-On plays the break). "Cornered" is **REJECTED** (DR-32 chosen); grey Swagger numbers are moot (Swagger cut).
- CX-8 **FIXED**: Auto-Hiss deleted; AI Hisses only telegraphs aimed at itself.
- CX-9 **BACKLOG** B-4 · CX-10 **BACKLOG** B-5 (interim default in §3.5) · CX-11 **FIXED** (Fed Up 75 s) · CX-12 **FIXED** (flinch tell, 3 Fears, §3.9) · CX-13 **BACKLOG** B-6.

*Systems critique (CS):*
- CS-1 **FIXED**: rank ×8/×20 with hit 4.5%; F9 hits every DR-31 band; sim acceptance AC 1.
- CS-2 **FIXED**: DR-32 rules; D-to-Frazzle on Daifuku ≈ 33 MV of 577.8 (≈ 6%), so ≈ 2 Frazzles per phase.
- CS-3 **FIXED**: poise rules (§3.5), armoured windups, AC 5.
- CS-4 **REJECTED**: Swagger cut and the re-Ruffle cooldown replaces Composure (DR-28). Its "interrupt spends the enemy Paw plus a 6 s Move cooldown" is adopted; Auto-Hiss deleted.
- CS-5 **FIXED**: basic hit 4.5%; AI uptime 35%; Crew share 62–66%; conductor share ≈ 58% against leaders.
- CS-6 **FIXED** in DR-30's form: earlier = more, with a Paw-dump trade-off (F5).
- CS-7 **FIXED** via the DR-29 Tag-In (the CS variant **REJECTED**). All Styles share Paw rules, so Paw income is equal across Styles.
- CS-8 **FIXED**: B(L) = 0.045 × N_ref(L), so hit% is flat at every level; leader levels set by rule.
- CS-9 **BACKLOG** B-7 (amplifier cap 1.6 adopted now).
- CS-10 **FIXED**: Purr HealMV 3.0, no heal-over-time, 60% cap.
- CS-11 **FIXED**: 30% floor on all reductions.
- CS-12 **FIXED**: rank damage 1/1.3/1.6; F10 model.
- CS-13 **FIXED**: stepped shake (no Hz), flash design cap 2/s, luminance limit on inverted frames, no full-screen cut-in flash, Pile-On shake on beats only, hit-stop ≤ 200 ms per 1 s; missing numbers supplied in §3.17.
- CS-14 **BACKLOG** B-8 · CS-15 **BACKLOG** B-9 (partial fix) · CS-16 **FIXED** (mantle-pounce penalty).

*Systems critique, catalogue conflicts (CS-C, slice Moves only):*
- C1 **FIXED** (DR-06 chart).
- C2 **FIXED**: Bunny-Kick is a Scrapper Move; there is no basic variant.
- C3 **FIXED**: "Pounce" is the gauge plus the verb only; "Leap" is Backlog.
- C4 **FIXED** (Withering Hiss).
- C5 **BACKLOG** · C6 **BACKLOG** · C7 **BACKLOG** (the floor rule already applies).
- C8 **FIXED**: Belly Flop takes Combat's numbers, recast as a Pay-off.
- C9 **FIXED**: Sit On It is 2 Paws; the pin is cut (DR-28).
- C10 **BACKLOG**.
- C11 **FIXED** for Shoulder Check and Purr; the rest **BACKLOG** B-2.
- C12 **FIXED**: no self-refunds; there is no Paw transfer in the slice.
- C13 **FIXED**: 3 statuses plus 3 states.
- C14 **FIXED**: Ruffled is a fixed 4 s, with the leader cooldown.
- C15 **BACKLOG** B-3.
- C16 **FIXED**: no Zoomies tiers.
- C17 **FIXED**: `ai_fill` per Life in data.
- C18 **FIXED**: hand models replaced by F9 as the sim's expected values.
- C19 **FIXED**: 4.5% at every level.
- C20 **FIXED**: amplifier product clamped to 0.5–1.6.
- C21 **FIXED**: no 3-Paw Moves in the slice (row in B-1).
- C22 **FIXED**: `ai_use` field.
- C23 **FIXED**: `MoveUsed`.
- C24 **FIXED**: leader level rule.

*Art critique, tier-table mismatches (AB-T1–T42, via DR-07):*
- **FIXED** by adopting AB §4.2 in milliseconds (§3.17). Six tiers; T0 victim hit-stop 0; T1 shake 0; shake stepped; durations are whole drawings; full-field lines Ink/Cream; local impact frame ≤ 15%; full-screen frames ≤ 1/s; Tough Rout full-screen only if player-authored; smears ≥ 2 frames; glyph and dust caps; Pile-On cloud 3.5/2.5 m; Art's spark shapes; red telegraph → Frazzle Magenta zigzag; yellow → Paper Cream dashed triangle; coral cue → Ink pulse (T41); glow → flat halftone disc (T42).
- T36–T37 (cinematic and Slow Blink camera values) **DEFERRED** → `camera-system.md`. T38 (Slow Blink grade) **DEFERRED** → Art.

*Sound and UX critiques:*
- SB-X13 **FIXED**: Combat owns cue existence and timing, Audio owns timbre (§3.17).
- SB-X14 **FIXED**: coral replaced by the Ink/halftone pulse.
- UX-1 **FIXED**: DR-08 map; Combat's actions match it.
- UX-2 **FIXED** for Combat's part: Frazzle bar on the enemy with 5 pips; identity ribbon only for named enemies; no world text beyond the bark balloon, one lettered word and the early Pile-On word; ally Move ribbons cut. The camera keep-out is moot (DR-48). The damage-numeral question is A1.

**2026-11-24 — Iteration 3 (final fix pass; `design/reviews/round-2/combat-and-crew.md`, `presentation.md`, `nemesis-territory-dayloop.md`).**
- Fix 1 **FIXED** · Relay membership (§3.3, Edge 8): each cat is incoming once; the starter may close the Relay; max 4 tags (A→B→C→D→A). F6's 61 FZ and F9's 2-cat Relay are now reachable.
- Fix 2 **FIXED** · High Road AI (§3.11 base): AI Hops up after 1 s to a High Road target within 3 m of a ledge (Fraidy never, Brooder only when avenging); ≤ 2 Posse cats on Daifuku's wall. §3.13: Frazzled on the wall stays there; Pile-On on the wall top.
- Fix 3 **FIXED** · §3.11 Mikan row (AI when switched away); Schemer reach 6 m; Goofball seeded-50% rule with 3 s wait; Fraidy fallback to the base Pay-off rule.
- Fix 4 **FIXED** · F1 example now uses Crew's stats (19 / 21 / 30 at Lv 8) and defines MV for neutral-vs-neutral; AC 7 checks unrounded B/N_ref = 0.045 at Lv 1–10 (C-12 part).
- **Sim vs hand figures:** one knob retuned, `captain_style_nerve` = off (§3.12, §7): Captains no longer take the Style Nerve multiplier, so the Bruiser Captain drops from 55–58 s to 37–44 s (re-run of the round-2 sim; all Captains 2 Frazzles). Every other fight length is **corrected to the sim's values** in the new F9 table (Tough in a group 9.7–10.7 s, skirmishes 18–28 s, Daifuku 166–176 s at a knock-off per 8 s of wall time); A2 updated.
- Presentation R3 **FIXED** · damage numerals Off by default, toggle Off / Big hits / All; weakness/resistance via spark shape (§3.17); A1 resolved, B-12 trimmed.
- Presentation R4 **FIXED** · no combat inside Haru's wall (§3.14); the crow is on the lane-side wall top (§3.16).
- Presentation shake note **FIXED** · §3.17 rule 3 now one model: stepped patterns summed and clamped at 1.8%; the separate trauma curve is gone.
- Teaching ladder (§3.16): Zoomies and Mikan's unlock on Life 2 day 3; Lessons the same day; Den from Life 2 day 4. §3.7 cites Crew's unlocks (C-12 part).
- Backlog: C-1, C-3–C-11 and two presentation notes moved to B-15–B-25. C-2 resolved by the retune above.

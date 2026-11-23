# Combat System

> **Status**: In Review (first draft; no section has had user sign-off yet)
> **Author**: game-designer (combat pass, pre-approved by user)
> **Last Updated**: 2026-11-23
> **Last Verified**: 2026-11-23 (against `design/creative-brief.md` Draft v1.0)
> **Implements Pillar**: Pillar 3 **Conduct the Brawl** (primary); Pillar 1 **Cat's-Eye Truth** (cat verbs, Fears, no readable onomatopoeia); Pillar 4 **Rivals Remember** (every Rout is reported to Nemesis)

## Summary

Combat is a real-time brawl in which the player directly controls one cat of a four-cat Posse, builds Paws by scrapping, and spends them through a slow-motion command mode (Slow Blink) on any of the four cats. Enemies are broken with a Ruffled → Frazzled → Pile-On loop, and the fight is dressed in maximal cartoon impact feedback. It exists because "conducting four cats" is the game's 30-second loop and one of its two headline systems.

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `Crew & Progression (stats, learnsets), Nemesis (RivalCombatProfile, Fears/Strengths), UX (HUD, Slow Blink menu), Art (VFX language), Audio (impact mix), Level (arena anchors, props)`

Canonical terms (Posse, Paws, Slow Blink, Ruffled, Frazzle, Pile-On, Zoomies, Nerve, Rout, Style names, stat names, event names) are used exactly as defined in `design/creative-brief.md`. Terms **introduced by this document** are listed in "Assumptions for creative-director review" near the end.

All frame counts are **simulation ticks at 60 Hz**. The handheld target renders at 30 fps but the combat simulation and input sampling stay at 60 Hz; durations are also given in milliseconds where feel depends on them. All distances are metres at cat scale (an adult cat is about 0.5 m long).

---

## Overview

When Mikan and a hostile cat or Critter notice each other, a fight starts in place, with no scene change, inside a soft ring about 12 m across. The player controls one cat directly: light and heavy attack strings, a dodge, a guard with a timed parry, a hop onto walls and roofs (the High Road), a pounce back down, and a hiss that interrupts. Scrapping fills that cat's Pounce Gauge, measured in Paws. At any moment the player can open Slow Blink, which drops time to 5%, and spend Paws on Moves for any Posse cat; frequently used Moves can also be fired from shortcuts without slowing time. The other three cats fight on their own, following a simple player-set Tactic, but they earn Paws at half rate and never use the big tools by themselves, so the player keeps hopping between cats and issuing orders. Every enemy has a Frazzle gauge; knocking an enemy off balance (Ruffled) fills it twice as fast, filling it leaves the enemy Frazzled and taking bonus damage, and a Frazzled enemy can be finished with a Pile-On, the four-cat dust-cloud finisher. Each cat also has a Zoomies super that charges over two or three fights. Nobody dies: a cat at 0 Nerve is Routed and bolts. Fights against rank-and-file cats last under a minute; a district Boss is a multi-phase three-to-five-minute set-piece.

---

## Player Fantasy

**"I am the smallest general in the world, and this alley is mine."**

The player should feel like a conductor with claws: personally landing the scrappy hits, then blinking slowly, pointing at three other cats, and watching a plan go off in a burst of dust, stars and paw-prints. The fight is a status contest, played loud. A Captain struts until something knocks the Swagger out of them; a Tough backs down when hissed at; a Boss who has been Frazzled disappears under four cats.

Target MDA aesthetics, in priority order for this system:

| Aesthetic | What it means here | Pillar |
|---|---|---|
| **Sensation** | Every hit above a light swipe has hit-stop, shake and a glyph burst. The Pile-On is the signature image. | Conduct the Brawl |
| **Challenge** | Reading three telegraph classes, timing the Bap and the Hair's-Breadth dodge, and budgeting four cats' Paws across a Frazzle window. | Conduct the Brawl |
| **Expression** | Posse composition, which Moves were taught to whom, which Tactic each cat runs, which prop to use on which Fear. | Conduct the Brawl, Rivals Remember |
| **Fantasy** | Being a cat in a fight: high ground, pounces, hissing, landing on your feet, knocking things off ledges. | Cat's-Eye Truth |

Self-Determination Theory check: **Competence** is served by deterministic, readable feedback (no random base crits, colour-and-shape-coded telegraphs, a visible Frazzle gauge); **Autonomy** by four cats, four Tactics, shortcuts versus Slow Blink, and props as an alternative route to Ruffled; **Relatedness** by the Posse being individuals whose Routs, Grudges and histories the fight reports back to Nemesis and Crew.

What the player must **never** feel: that they lost track of their cat; that an AI cat won the fight for them; that a Tough was a sponge; that the menu, not the screen, is where the fight happened.

---

## Detailed Design

### Core Rules

Rules are numbered **CR-n** for reference from stories and tests.

#### CR-1. Simulation frame

1. Combat simulation runs at a fixed 60 Hz. Hit-stop and Slow Blink are time-scale effects on that simulation, never frame skips.
2. Every combatant is a One Cat Schema record (brief §6) or a Critter record (CR-18.5). Combat reads `level, style, stats{nerve,bite,hide,voice,zip}, moves[4], knacks[2], zoomies, traits{strengths[],fears[]}` and `rank`. It never writes to the schema except current Nerve, Routed state and the Zoomies gauge (see Dependencies).
3. Combat base movement: run 4.5 m/s; guard-walk 1.4 m/s; turn is instant (arcade acceleration: full speed in 4 ticks, stop in 3). Run speed scales with `ZipFactor` (Formula F-7), clamped to 4.0–5.2 m/s.
4. Two layers exist, as in exploration: **Ground** and **High Road**. A cat is on exactly one.

#### CR-2. Controls (actions and default bindings)

Combat owns the action set and its timing; UX owns the final controls map and may rebind. Defaults below are the designed-for layout.

| Action | Gamepad (Xbox / PS) | Keyboard + mouse | Notes |
|---|---|---|---|
| Move | Left stick | WASD | Camera-relative; yaw is fixed per area |
| **Swipe** (light) | X / Square | LMB | Style-specific string (CR-3) |
| **Whack** (heavy) | Y / Triangle | RMB | Tap, or hold to charge where the Style allows |
| **Hop** | A / Cross | Space | Jump; auto-mantles a High Road ledge within 1.2 m |
| **Skitter** (dodge) | B / Circle | Shift | Direction of stick; neutral = backward |
| **Brace** (guard) / **Bap** (parry) | R1 hold / R1 tap-timed | Q | CR-4 |
| **Shortcuts** | L1 hold + X/Y/A/B | 1–4 | Controlled cat's 4 Moves, real time (CR-8) |
| **Hiss** | L2 | F | CR-5.4 |
| **Slow Blink** | R2 (press = toggle; optional hold mode) | Tab | Opens on the tick of the press |
| Switch cat | D-pad: Up = Mikan, Left / Down / Right = Crew 1 / 2 / 3 | F1–F4 | CR-9 |
| Lock-on | R3 click; right-stick flick = next target | Middle mouse; wheel = next | CR-6 |
| **Pile-On** | L1 + R1 together (prompted) | E | Only when available (CR-12) |
| **Zoomies** | L3 + R3 together | Z | Controlled cat; others via Slow Blink (CR-13) |
| Whisker Sense | (exploration binding, unchanged) | | In combat: highlights props and *known* Fears; time does not slow |
| Scram (flee) | Slow Blink menu entry, or leave the ring | | CR-19.5 |

Input rules:

- **Buffer**: 10 ticks (167 ms) for Swipe, Whack, Skitter, Hop, Brace and shortcuts. One buffered input is held; a newer input replaces it.
- **Cancel rules** (applies to every Style's basic attacks): Skitter cancels any basic attack on any tick except its active ticks; Brace cancels recovery only; a Move (shortcut or queued command) cancels recovery only; Hop cancels recovery only. Moves cannot be cancelled once past their commit tick (CR-8.6).
- **Slow Blink** and **cat switch** are accepted on any tick, in any state except a T5 cinematic (CR-12, CR-13), and are never buffered behind an animation.

#### CR-3. Basic attacks

Every Style has a **Swipe string** and one **Whack** with a Style-specific identity (the equivalent of a character's unique ability). Basic attacks cost nothing, generate Pounce (CR-7) and Frazzle (CR-11). `MV` is the motion value used by the damage formula (F-1); `FZ` is base Frazzle; `PG` is Pounce points on hit (100 points = 1 Paw). Frame data is startup / active / recovery; the next string hit may begin when recovery ends, or earlier where "chain" is given.

**Scrapper (Mikan's base kit)** — type Claw, stat Bite, melee reach 1.0 m, lunge magnetism 1.5 m to the locked or soft-locked target.

| Attack | Startup | Active | Recovery | MV | FZ | PG | Notes |
|---|---|---|---|---|---|---|---|
| Swipe 1 | 5 | 3 | 14 | 0.85 | 8 | 4 | |
| Swipe 2 | 5 | 3 | 14 | 0.85 | 8 | 4 | |
| Swipe 3 | 6 | 3 | 17 | 0.95 | 8 | 4 | |
| Swipe 4 (finisher) | 12 | 4 | 24 | 1.15 | 16 | 7 | Knockback 1.5 m; pushes targets off High Road edges |
| **Whack: Rake** | 14 | 4 | 26 | 1.60 | 20 | 9 | Forward lunge 2 m; Tier T2 feel |
| **Whack (hold 20+ ticks): Bunny-Kick** | 20 | 5 hits over 50, then kick-off | 26 | 5 × 0.40 + 0.80 | 30 total | 12 total | Latches onto a non-Boss target; attacker cannot cancel until tick 60 and takes full damage while latched; kick-off launches 2 m |

Full Swipe string: 110 ticks (1.83 s), MV 3.80, FZ 40, PG 19.

**Bruiser** — type Thump, stat Bite, reach 1.2 m.

| Attack | Startup | Active | Recovery | MV | FZ | PG | Notes |
|---|---|---|---|---|---|---|---|
| Cuff 1 | 9 | 4 | 19 | 1.15 | 12 | 5 | |
| Cuff 2 | 10 | 4 | 20 | 1.25 | 12 | 5 | |
| Cuff 3 (finisher) | 16 | 5 | 29 | 1.60 | 22 | 9 | Small 1.5 m radius shock; knockdown on Toughs and Critters |
| **Whack: Flop** | 20 | 5 | 30 | 1.80 | 26 | 9 | Body slam, 2.5 m radius; **armoured** from tick 6 (takes damage, cannot be flinched) |
| **Whack (hold) on a knocked-down or Frazzled target: Sit** | 16 | — | 20 on release | 0.50 per second | 10 per second | 3 per second | Pins a non-Boss target while held, max 3 s; Bruiser is armoured but takes ×1.25 damage |

Full string: 116 ticks (1.93 s), MV 4.00, FZ 46, PG 19.

**Prowler** — type Fang, stat Bite, reach 0.9 m, lunge magnetism 2.0 m.

| Attack | Startup | Active | Recovery | MV | FZ | PG | Notes |
|---|---|---|---|---|---|---|---|
| Nip 1 | 4 | 2 | 12 | 0.70 | 6 | 4 | |
| Nip 2 | 4 | 2 | 12 | 0.70 | 6 | 4 | |
| Nip 3 (finisher) | 8 | 3 | 21 | 1.00 | 12 | 6 | |
| **Whack: Slink** | 8 | — | 14 | — | — | — | Dash 3 m through the target, ending behind it; invulnerable ticks 3–10; the next Nip or Move within 90 ticks is a **Backstab** (CR-14.4) |

Full string: 68 ticks (1.13 s), MV 2.40, FZ 24, PG 14.

**Yowler** — type Yowl, stat Voice, ranged 4 m cone of 30°, no magnetism.

| Attack | Startup | Active | Recovery | MV | FZ | PG | Notes |
|---|---|---|---|---|---|---|---|
| Yap 1 | 10 | 2 | 16 | 0.70 | 6 | 4 | |
| Yap 2 | 10 | 2 | 16 | 0.70 | 6 | 4 | |
| Yap 3 (finisher) | 14 | 2 | 26 | 1.00 | 12 | 6 | |
| **Whack: Screech** | 18 | 4 | 28 | 1.40 | 18 | 8 | 3.5 m cone of 70°; knockback 2 m; interrupts yellow telegraphs exactly as a Hiss does (CR-5.4) but does not use the Hiss cooldown |

Full string: 98 ticks (1.63 s), MV 2.40, FZ 24, PG 14. Lower output is the price of range and safety.

**Trickster** — type Thump (flicked pebbles, dirt, bottle caps), stat Bite, ranged 6 m single-target projectile at 18 m/s.

| Attack | Startup | Active | Recovery | MV | FZ | PG | Notes |
|---|---|---|---|---|---|---|---|
| Flick 1–3 | 8 | 2 | 14 | 0.60 | 6 | 4 | |
| Flick 4 (finisher) | 12 | 2 | 26 | 1.00 | 12 | 6 | |
| **Whack: Kick Dirt** | 12 | 4 | 24 | 0.80 | 10 | 6 | 3 m cone; applies **Dirt-Eyed** 3 s (CR-15); Flicks and Kick Dirt **activate props** they hit (CR-16) |

Full string: 112 ticks (1.87 s), MV 2.80, FZ 30, PG 18.

Design intent: every Style's uninterrupted string delivers roughly 2.1 MV/s in melee and 1.5 MV/s at range. No Style's basics are strictly better; they differ in commitment, reach and what the Whack does. This is **asymmetric balance** on purpose.

#### CR-4. Defence

**CR-4.1 Skitter (dodge).** 22 ticks total. Invulnerable ticks 2–11 at baseline Zip (window scales by F-8, between 8 and 12 ticks). Travel 2.0 m. Attack-cancellable from tick 16. No resource cost. A third Skitter begun within 90 ticks of the first adds 8 recovery ticks to that third dodge and any further one until 90 ticks pass without dodging (anti-mash, not a stamina bar).

**CR-4.2 Hair's-Breadth.** If an enemy attack's active hit overlaps the cat during the **first 6 invulnerable ticks** of a Skitter, it is a Hair's-Breadth dodge:
- local time-scale 30% for 21 ticks of real time (0.35 s), applied to everything except the dodging cat;
- +25 Pounce points;
- for 60 ticks, the cat's next Swipe is replaced by **Counter-Pounce**: startup 4, active 4, recovery 18, MV 1.60, FZ 15, PG 6, homing up to 4 m. Tier T3 feel.
- Only the player-controlled cat can earn a Hair's-Breadth. AI cats dodge, but without this reward.

**CR-4.3 Brace (guard).** Hold. Active from the tick after the press. Blocks attacks arriving from the front 180°: damage ×0.40 (Bruiser Style: ×0.20), no flinch, +6 Pounce points per blocked attack (not per hit of a multi-hit). Movement slows to guard-walk. **Red** telegraphed attacks ignore Brace completely. Brace does nothing against attacks from behind.

**CR-4.4 Bap (parry).** If Brace is pressed 1–8 ticks (up to 133 ms) before a **white or yellow melee** hit lands from the front, it is a Bap: a paw smack that
- negates all damage from that hit;
- Flinches the attacker for 48 ticks (Boss: 24);
- applies FZ 20 and Ruffled for 3 s (Captain and above: 2 s);
- grants +20 Pounce points; Tier T2 feel (T3 against a Captain or above).
- A Bap against a **projectile** bats it back at the sender for its original damage (cat-true and a deliberate crowd-pleaser).
- Yowl attacks cannot be Bapped (they can be Braced). Red attacks cannot be Bapped.
- A failed Bap is simply a Brace; there is no whiff penalty. This is deliberate: the game's failure texture is "I got greedy", never "the game ate my input".

Only the player-controlled cat can Bap.

#### CR-5. Cat verbs (verticality, pounce, righting, hiss)

**CR-5.1 High Road in a fight.** Any ledge flagged High Road inside the ring is usable by every cat on both sides. Hop within 1.2 m of a ledge mantles it in 24 ticks (invulnerable ticks 4–12). A cat on the High Road cannot be hit by ground melee; it can be hit by ranged basics, Yowl attacks, Pounces, and any Move flagged `reaches_high_road`.

**CR-5.2 Perch rule (anti-stall).** A cat that stays on the High Road for more than 4 s of combat time is **Perched**: its passive Pounce fill stops, and every enemy able to climb or shoot gives it top target priority. Perched clears 1 s after returning to Ground. Enemy cats obey the same rule and additionally are forced by AI to come down after 4 s (CR-18.3).

**CR-5.3 Pounce (dive attack).** From the High Road, or airborne from a Hop off a ledge, Swipe toward a target within 5 m performs a **Pounce**: startup 6, travel up to 18, active on landing 4, recovery 20; MV 1.80, FZ 22, PG 10; type follows the Style's basic type. Out of combat against an unaware target this is the **Ambush** opener (CR-19.2). In combat it is the reward for taking the high ground, and it is rate-limited only by having to climb again.

**CR-5.4 Hiss.** Universal, costs no Paws, per-cat cooldown 10 s (Yowler Style: 5 s). Startup 6, active 12, recovery 14. Cone 4 m × 90° (Yowler: 5 m × 110°). Effects, in order:
1. Any enemy in the cone that is in the windup of a **yellow** telegraphed action is **interrupted**: the action is cancelled, the enemy Flinches 36 ticks, gains FZ 15 and becomes Ruffled for 4 s. (Brief: "interrupting certain Moves" causes Ruffled.)
2. **Back Down:** any Stray, Tough or Critter in the cone whose Nerve is at or below 15% of its maximum is Routed on the spot. `CatRouted` is emitted with `finisher_move = hiss`, `damage_type = yowl`. Captains and above never Back Down.
3. Otherwise a Hiss does nothing to an enemy. It deals no damage and gives no Pounce.

Hiss is the interrupt tool every cat has; Yowler Moves are the heavy voice artillery. A Hiss wasted on nothing is the cost of using it carelessly.

**CR-5.5 Righting (landing on feet).** Whenever a cat is launched, thrown, or knocked off the High Road it enters **Tumble**. Pressing Hop or Skitter within the last 12 ticks before touching ground performs a **Righting**: lands standing, invulnerable for 8 ticks, +10 Pounce points, no fall damage. Failing it is a **Splat**: knockdown for 48 ticks and fall damage (F-1 with MV 0.60, type Thump, the pusher's Bite; fall damage only applies for drops of 1.5 m or more). AI cats, on both sides, succeed with probability `0.5 + 0.3 × clamp(Zip / StatRef(level) − 1, −1, 1)`, rolled on a seeded RNG. A **Frazzled** cat can never Right itself. This makes throwing a Frazzled enemy off a wall a real, repeatable play.

**CR-5.6 Knock-offs.** Any knockback that carries a cat past a High Road edge sends it into Tumble. Attackers get FZ 20 on the victim's Splat in addition to the fall damage.

#### CR-6. Lock-on and camera

**CR-6.1 Soft lock (default).** With no hard lock, melee attacks pick the nearest enemy within 60° of stick direction (or facing) and 5 m, and apply that attack's lunge magnetism. A thin bell-gold bracket marks the soft target.

**CR-6.2 Hard lock.** R3 toggles a hard lock on the soft target. Right-stick flick moves the lock to the next enemy in that screen direction. On the target's Rout the lock jumps to the nearest enemy to the controlled cat, preferring a Frazzled one, then a Ruffled one. The lock is per controlled cat and is remembered across switches during one encounter. AI cats on the **Shadow Me** Tactic attack the controlled cat's hard-lock target (CR-10).

**CR-6.3 Camera, from roaming into a fight.** The brief fixes pitch at about 55° and yaw per area with no free rotation. Combat changes framing only:

| Camera state | Trigger | Framing | Blend |
|---|---|---|---|
| Roam | Default | Follows Mikan; pitch 55°; distance per level | — |
| Standoff | `EncounterStarted` with opener `standoff` | Dolly in to frame Mikan and the lead Rival nose to nose; pitch 48°; name-card | 0.4 s in; 2–4 s hold (Nemesis/UX content); skippable after first sight |
| **Brawl** | Fight begins | Look-at point = 0.5 × controlled cat + 0.3 × locked target (or enemy centroid) + 0.2 × Posse centroid. Distance auto-fits so every combatant sits inside the central 85% of the frame, clamped to 10–16 m; pitch 57° | 0.6 s; look-at follows with 0.12 s damping; distance changes at 3 m/s max |
| Slow Blink | Slow Blink open | Dolly to 8.5 m, pitch 50°, centred on the selected cat and biased toward its current target; background desaturates 30% | 9 ticks real time in, 6 out |
| Punch-in | Feel tiers T2–T4 | Additive dolly per the Game Feel table; never changes look-at | Per tier |
| Cinematic | Pile-On, Zoomies, Boss phase break | Authored dolly to 5–7 m and pitch down to 35–45°, yaw unchanged, plus a 2D manga cut-in panel of the acting cat | Authored, 0.2 s in |
| Resolve | Last enemy Routed | 0.5 s at 20% time-scale on the final hit, then ease back to Roam over 0.8 s | — |

- The camera never rotates in yaw. If a cat is hidden behind geometry it draws as an outline-coloured silhouette (look owned by Art).
- Any combatant outside the frame gets an edge indicator in its outline colour; an enemy attacking from off-screen gets a pulsing edge arrow for the full length of its telegraph.
- A switch of controlled cat re-centres the look-at over 15 ticks.

#### CR-7. Pounce Gauge (Paws)

1. Each cat has a Pounce Gauge of `MaxPaws × 100` points. `MaxPaws` is **2** for every cat, and **3 for Mikan from Life 4** (brief §8).
2. **Encounter start value**: 50 points for every Posse cat. Player Ambush: +50 to every Posse cat (so each starts with 1 full Paw). Ambushed by a Rival: 0. The gauge does not persist between encounters.
3. **Passive fill**: `100 / 14 = 7.14` points per second at baseline Zip, multiplied by `ZipFactor` (F-7).
4. **Active gains** (on the listed event; values are for the player-controlled cat):

| Event | Points |
|---|---|
| Basic attack hit | the attack's `PG` (CR-3); each additional target struck by the same attack adds 50% of PG, capped at +100% |
| Pounce / Counter-Pounce hit | 10 / 6 |
| Hair's-Breadth | 25 |
| Bap | 20 |
| Brace a hit | 6 |
| Righting | 10 |
| Taking an unblocked hit | 3 |
| Any Move, Zoomies or Pile-On hit | 0 (Moves never refund their own cost) |

5. **AI-controlled cats** apply ×0.50 to passive fill and to every active gain (brief §8). The multiplier follows control: it changes on the tick of a switch.
6. Scrapper Style passive: ×1.2 on `PG` from basic attacks (CR-14.3).
7. Points beyond the cap are lost. Passive fill pauses while a cat is Perched, Routed, or inside a T5 cinematic.
8. **Design target** (brief §8): about 1 Paw per 6–7 s for a player-controlled cat under sustained offence; see the worked budget in F-6.
9. Enemies use the same gauge at rank-set rates (CR-18.4); they never use Slow Blink.

#### CR-8. Slow Blink, commands and shortcuts

1. **Opening.** Slow Blink opens on the tick of the press. World time-scale becomes **0.05**. It can be opened with zero Paws (to inspect, retarget, set Tactics or Scram). It cannot be opened during a T5 cinematic; a press during one is buffered and opens on its last tick.
2. **Layout (rules; the screen is UX's).** Top level lists, for the **selected cat** (default: the controlled cat): its 4 Moves with Paw cost, **Zoomies** (if full), **Pile-On** (if available), **Tactic**, and **Scram**. L1/R1 (or D-pad) changes the selected cat without changing who is controlled. Moves the cat cannot afford are shown dimmed with the missing points.
3. **Targeting.** After choosing a Move the player picks a target (enemy, ally, or ground point, per the Move). Default target: the selected cat's current target; for heals, the lowest-Nerve ally. Area Moves preview their shape on the ground. While targeting an enemy the panel shows its Nerve, Frazzle gauge, Ruffled/Frazzled/Swagger state, Style weak/resist icons, and any **known** Fears (Nemesis decides what is known).
4. **Queueing.** Confirming reserves the Paws and gives that cat exactly one queued command. Each cat holds at most one queued command; queueing again replaces it and releases the earlier reservation. Several cats may be given commands in a single Slow Blink.
5. **Execution.** After Slow Blink closes, a cat executes its queued command at its next free tick: immediately if idle, moving or in basic-attack recovery; at the end of active ticks if mid-attack; after hit-stun ends if stunned. If the cat must travel, it runs or leaps to range first (max 2.5 s, then the command is dropped and Paws are released).
6. **Commit and refund.** Paws are **spent on the Move's first active tick** (the commit tick). If the cat is interrupted, Routed, or loses a valid target before the commit tick, the reservation is released and nothing is spent. After the commit tick the Move resolves fully even if its target is Routed mid-animation (extra hits whiff).
7. **Armour.** Every Move grants flinch immunity from its commit tick to the end of its active ticks (the cat still takes damage). Before the commit tick a Move can be interrupted like anything else.
8. **Shortcuts.** L1 + face button fires the controlled cat's Move in that slot in real time at the hard-lock or soft-lock target (heals: lowest-Nerve ally). Same cost, commit and refund rules. Shortcuts exist only for the controlled cat; commanding other cats always goes through Slow Blink. This is a deliberate difference from FF7 Remake's ally shortcut menus: with three interchangeable Crew, a per-ally shortcut layer would need twelve bindings and would let the player conduct without ever looking at the Posse.
9. **No limit** on the number or length of Slow Blinks. Encounter duration targets are measured in game time, so Slow Blink does not count against them. An accessibility option makes it a full pause (CR-20).
10. The day clock is already paused in combat (brief §5.2); Slow Blink adds nothing to that.

#### CR-9. Switching the controlled cat

1. D-pad direction switches control to that Posse slot within 3 ticks. Camera look-at re-centres over 15 ticks.
2. The cat being left finishes its current action, keeps any queued command, and resumes its Tactic. Its Pounce gains drop to ×0.5 from that tick.
3. The cat being taken over can be acted with on the next tick. If it is mid-Move, the player gains control when the Move ends; inputs are buffered.
4. **Switch Grace**: the newly controlled cat is invulnerable for 12 ticks, at most once every 3 s (so switching into a cat about to be hit is not a punishment, and switch-spamming is not a defence).
5. A Routed cat cannot be selected. If the controlled cat is Routed, control passes automatically to Mikan if standing, otherwise to the lowest-numbered standing slot, with 30 ticks of 30% time-scale so the player can re-orient.
6. Mikan is always in the Posse; if Mikan is Routed the fight continues while any Posse cat stands (brief §7).
7. Reasons to switch that the system guarantees: full-rate Pounce on the controlled cat; Bap, Hair's-Breadth and Counter-Pounce exist only under player control; each Style's Whack has a different job; AI cats never spend a cat's last Paw, Zoomies or a Pile-On on their own (CR-10).

#### CR-10. Posse AI and player-set Tactics

AI Posse cats must look competent and must not be the main source of damage. Their behaviour is cat-true: short flurries separated by circling and posturing.

**CR-10.1 Core cadence.** An AI cat engages its target, performs one full basic string, then **postures** (circles at 2–3 m, facing the target) for 2.5–4.0 s before the next string. Sustained output is therefore about 0.75 MV/s against the player's 1.5–2.1.

**CR-10.2 Defence.** AI cats react to telegraphs with these per-attack success chances (Posse side; these do not change with difficulty mode, which scales enemies only):

| Telegraph | Response | Chance |
|---|---|---|
| White | Brace | 50% |
| Yellow | Skitter away, or Hiss if **Auto-Hiss** is on and off cooldown | 70% |
| Red | Leave the marked area | 85% |

At or below 25% Nerve an AI cat stops attacking, keeps 4 m from enemies and Braces, until healed above 40% or commanded.

**CR-10.3 Tactics.** One Tactic per Crew cat, set at the Lot or in Slow Blink, remembered per cat.

| Tactic | Targeting | Paw spending (autonomous) | Use |
|---|---|---|---|
| **Shadow Me** (default) | The controlled cat's hard-lock target; otherwise its last-hit target | Spends only when its gauge is full, and only down to 1 Paw banked; damage Moves first | The conductor default: banked Paws wait for orders |
| **Scrap** | Nearest enemy; prefers Ruffled or Frazzled | Spends whenever it can afford a damage Move | For players who want less micromanagement; wastes Paws outside Frazzle windows |
| **Mind the Others** | Any enemy that is attacking an ally, lowest-Nerve ally's attacker first; never the controlled cat's target unless it is the only enemy | Uses heals when an ally is below 50% Nerve, taunts and control Moves when an ally is being attacked by 2 or more; never damage Moves | Peel and support |
| **Hang Back** | None; keeps 5 m away, dodges | Never | Protect a hurt cat or bank for a Frazzle window |

Two per-cat toggles: **Auto-Hiss** (default on: AI uses Hiss on yellow telegraphs within its cone) and **Own Zoomies** (default off: when on, the cat uses its Zoomies by itself the moment a Captain or Boss is Frazzled).

**CR-10.4 Hard limits on autonomy.** AI Posse cats never trigger a Pile-On, never use Zoomies unless Own Zoomies is on, never use props deliberately, and never Bap. These belong to the player.

**CR-10.5 Commanded actions outrank everything.** A queued command pre-empts posturing, retreat and Tactic.

#### CR-11. Swagger, Ruffled and Frazzle (the stagger loop)

Every enemy has a **Frazzle gauge** 0–100 (brief). Posse cats have none.

**CR-11.1 Swagger (introduced here).** A ranked Rival fights with its tail up. While an enemy with Swagger is **neither Ruffled nor Frazzled**, all damage it takes is multiplied by `(1 − Swagger)`:

| Rank | Swagger |
|---|---|
| Stray, Tough, Critter | 0% |
| Captain | 30% |
| Boss | 50% |
| Botan | 55% |

Swagger is the reason Ruffled matters against leaders, and the reason props and Fears matter: anything that Ruffles a Boss doubles Frazzle gain **and** doubles the damage the Posse is doing. It is always visible (tail carriage, a strut idle, a glint on the outline; Art owns the look) and is removed, not reduced. See Open Questions for the risk.

**CR-11.2 Frazzle gain.** Each hit adds Frazzle per F-3. In short: `FZ × rank resistance × modifiers`, doubled while Ruffled. The gauge is visible under every enemy's Nerve bar at all times.

**CR-11.3 Ruffled.** A timed state. Sources and durations:

| Source | Duration |
|---|---|
| Player Ambush (on the Ambushed target) | 6 s |
| A Fear triggered (CR-16) | 6 s (second time in the same encounter 3 s; third and later: none) |
| Yellow action interrupted (Hiss, Screech, or a Move flagged `interrupts`) | 4 s |
| Bap | 3 s (Captain and above 2 s) |
| Splat after a knock-off | 3 s |
| Specific Moves | As listed (CR-17) |

Re-applying Ruffled sets the remaining time to the larger of the two values; it never stacks. While Ruffled: Frazzle gain ×2 (brief), Swagger is off, and the gauge does not decay.

**CR-11.4 Decay.** If an enemy that is not Ruffled gains no Frazzle for 4 s, its gauge drains 3 points per second.

**CR-11.5 Frazzled.** When the gauge reaches 100 the enemy becomes **Frazzled** for **8 s** (brief): fur puffed, helpless (no actions, no dodge, no guard, cannot Right itself, cannot Back Down by itself, cannot flee), Swagger off, any action interrupted. Bosses can still be moved by throws only if the Move says so.

**CR-11.6 Frazzle bonus.** Damage to a Frazzled enemy is multiplied by the **Frazzle bonus**, which starts at **×1.50** and rises toward a cap of **×2.00** (brief): +0.05 for every Paw spent on a damaging Move that hits it, plus any `bonus_add` a Move lists. Basic attacks do not raise it. The current value is displayed as a percentage beside the gauge.

**CR-11.7 Recovery.** When the 8 s end, or a Pile-On resolves, the gauge resets to 0, the bonus resets, and the enemy is immune to Ruffled and Frazzle gain for 2 s while it shakes itself off (this is also the player's cue to back away). Each completed Frazzle on a **Captain or above** raises that enemy's Frazzle resistance for the rest of the encounter (F-3 `Harden`), to a maximum of three steps.

**CR-11.8 Zoomies credit.** The cat that lands the hit which fills the gauge is the **Frazzler** and receives the larger Zoomies award (F-9).

#### CR-12. Pile-On

1. **Availability.** A Pile-On is available when (a) at least one enemy is Frazzled, (b) at least **two** Posse cats are standing and not pinned, Tangled or Spooked, and (c) no T5 cinematic is playing. One Pile-On per Frazzled state of the primary target.
2. **Trigger.** L1+R1, or the Slow Blink entry. Primary target = the hard-lock target if Frazzled, else the nearest Frazzled enemy to the controlled cat. It costs **no Paws**.
3. **Sequence.** All eligible Posse cats, wherever they are, leap to the target (they do not need to path there) and vanish with it into the dust cloud. During the sequence all participants and the victim are invulnerable to everything else; other enemies keep acting at normal speed after the opening freeze.
   - **Full Pile-On** (primary target is a Captain or above, or is the last enemy standing): 150 ticks (2.5 s).
   - **Quick Pile-On** (any other target): 72 ticks (1.2 s), same damage, shorter cloud.
4. **Sweep.** Every other **Frazzled** enemy within 3 m of the primary is dragged into the cloud and takes 50% of the damage.
5. **Damage.** Each participating cat deals one hit of MV **1.50** using the higher of its Bite and Voice, against the victim's Hide, multiplied by the **current Frazzle bonus** (F-5). Damage type is the cat's Style basic type; Style weak/resist applies per cat.
6. **Aftermath.** The Pile-On ends the victim's Frazzled state (CR-11.7). Participants are placed in a loose ring 1.5 m around the victim with 30 ticks of invulnerability, each holding the gauge it had.
7. **The decision it creates.** The Frazzle window is 8 s. Spending Paws inside it raises the bonus that the Pile-On then multiplies, but the Pile-On closes the window. Trigger early and waste the window; trigger late and risk the window expiring with the Pile-On unused. The gauge shows the remaining window as a shrinking ring.
8. `CatRouted.by_pile_on = true` when a Pile-On hit Routs the victim; `finisher_id` is the controlled cat.

#### CR-13. Zoomies

1. Each cat has a Zoomies gauge 0–100 that fills from **damage taken** and from **Frazzling enemies** only (brief), per F-9. It persists between encounters within a day and resets when Mikan sleeps (brief). Routed cats keep their gauge.
2. A full gauge can be spent at any time the cat is standing and not in hit-stun: L3+R3 for the controlled cat, Slow Blink for any cat. It costs no Paws and empties the gauge.
3. **Sequence.** On trigger: global time-scale 10% for 36 ticks real time while the cut-in panel plays, then the Zoomies resolves at normal speed. The user is invulnerable from trigger to the end of its recovery. Only one Zoomies or Pile-On cinematic may run at once; a second trigger queues and fires when the first ends.
4. **Style Zoomies** (one per Style; power budget about 12 MV-equivalents, roughly 3.5 Paws of value). Zoomies hits cannot crit and do not raise the Frazzle bonus, but are multiplied by it.

| Style | Zoomies | Effect |
|---|---|---|
| Scrapper | **Ricochet** | 10 dashes between random enemies in the ring, never the same enemy twice in a row unless only one remains; each MV 1.20 Claw, FZ 8. Total MV 12.0 |
| Bruiser | **The Big Sit** | Leap and land on a 4 m radius: MV 7.0 Thump to all, FZ 60, knockdown; the primary target is pinned for 3 s (Boss 1 s) while the Bruiser sits on it for MV 1.0 per second |
| Prowler | **Nine Shadows** | Single target: 9 hits, each MV 1.30 Fang (total 11.7), from nine directions; ends behind the target with Backstab armed |
| Yowler | **Midnight Aria** | All enemies in the ring: MV 4.0 Yowl, interrupts everything short of a red Boss action, Cowed 8 s. All Posse cats: heal HealMV 4.0 and clear negative statuses |
| Trickster | **Everything Off the Shelf** | Eight falling objects over 2 s at enemy positions, each MV 1.50 Thump, 1.5 m radius; then **every prop in the ring activates at once** |

5. Boss-unique Zoomies and any Rival-unique Zoomies follow the same budget and are defined with each Boss kit (CR-18.6). An enemy Zoomies is always a **red** telegraph of at least 90 ticks and is announced by the Rival's yowl-sting (Audio).

#### CR-14. Damage types, Style matchups and Style passives

**CR-14.1 Types.** Claw, Fang, Thump use the attacker's **Bite**; Yowl uses **Voice** (brief §3.4). All four are reduced by **Hide**. Heals and buffs scale with Voice.

**CR-14.2 Style defaults.** There is no global type chart (brief). Each Style has at most one weak and one resisted type; individual cats override or add through Strengths and Fears.

| Style | Deals (basic) | Weak to (×1.25 damage, ×1.25 Frazzle) | Resists (×0.75 damage) |
|---|---|---|---|
| Bruiser | Thump | Yowl | Claw |
| Scrapper | Claw | Thump | Fang |
| Prowler | Fang | Claw | Yowl |
| Yowler | Yowl | Fang | Thump |
| Trickster | Thump (ranged) | — | — |

This is a four-way soft ring, **Scrapper → Prowler → Yowler → Bruiser → Scrapper**, with Trickster outside it as the flex pick: no weakness, no resistance, lower raw output. The multipliers are small on purpose. Pillar 3 says combat depth must be on screen, not in a chart: a player who ignores matchups loses about a fifth of their output, not the fight. Matchups are shown at the moment of impact (larger, type-coloured hit spark and a "weak" chime; a dull spark and thud for a resist), never only in a menu.

Because Mikan can equip Moves of any Style (brief), Mikan can always carry an answer to any matchup. Crew cats' Moves are limited by learnsets (owned by Crew & Progression).

**CR-14.3 Style passives** (innate; not Knacks; cannot be unequipped).

| Style | Passive |
|---|---|
| Bruiser | **Heft**: Frazzle dealt ×1.3; Brace blocks 80%; armour on Whack |
| Scrapper | **Flurry**: Pounce points from basic attacks ×1.2 |
| Prowler | **Opportunist**: every hit on a Frazzled enemy is a crit; hits from behind on a Ruffled enemy are crits; Ambush opener damage ×1.5 |
| Yowler | **Big Voice**: Hiss cooldown 5 s with a wider cone; heals given +15% |
| Trickster | **Butterpaws**: basic attacks and Kick Dirt activate props at range; prop damage ×1.5 |

**CR-14.4 Crits.** There is **no random crit chance**. A hit is a crit only when a rule says so: Prowler Opportunist, a Backstab (the first hit within 90 ticks after Slink or a Move that arms it, if it lands from the rear 120°), or a Move that states it. Crit multiplier ×1.5. Crits are deterministic so the player always knows why a number was big.

#### CR-15. Status effects

Pillar 3's design test argues against status sprawl. The list is closed at **five debuffs and three buffs**; a new one needs an old one removed. Ruffled, Frazzled and Swagger are states of the stagger loop (CR-11), not statuses.

| Status | Kind | Effect | Default duration | Sources (examples) |
|---|---|---|---|---|
| **Cowed** | Debuff | Damage dealt −25% | 10 s | Withering Hiss, Midnight Aria |
| **Soggy** | Debuff | Run speed −30%, Skitter invulnerable ticks −3, cannot Hop | 8 s | Water props; Water Fear rider |
| **Dirt-Eyed** | Debuff | Cannot target anything farther than 2 m; ranged attacks auto-miss; (on a player cat: screen edge dirt vignette and soft lock disabled) | 3–6 s | Kick Dirt, Dirt Devil |
| **Tangled** | Debuff | Rooted, cannot Skitter or Hop; can attack and Brace | 5 s | Yarn Tangle; laundry props |
| **Spooked** | Debuff | Loses control and runs from the source at 1.3× speed; any action interrupted | 2–3 s | Vacuum and Dog Fears, human Shoo hazard |
| **Well-Fed** | Buff | +2% max Nerve per Bond heart (brief §8), all day | Until sleep | `BondChanged` / home by Dusk |
| **Purring** | Buff | Regenerates Nerve (F-2 `HoT`) | 8 s | Purr |
| **Fired Up** | Buff | Damage dealt +20% | 10 s | Knacks, some Moves |

Rules:
1. A status does not stack with itself. Re-application sets remaining time to the larger value.
2. Rank scaling of debuff duration on enemies: Tough and below ×1.0, Captain ×0.75, Boss ×0.5. Bosses are immune to Spooked and Tangled roots (Tangled instead slows them 50%).
3. A Frazzled enemy keeps its debuffs; their timers keep running.
4. At most three status icons are shown per cat (most recent first); the rules still apply to all.
5. Hit reactions are not statuses and have fixed lengths: **Flinch** 36 ticks, **Knockdown/Splat** 48, **Launch** until landing, **Pin** per source, **Startled** (cannot Brace or Skitter; Pounce gain off) per source.

#### CR-16. Props, Fears and Strengths

The environment is how the Posse hits Fears (brief §7). Combat owns what a prop does and what a Fear or Strength is worth; Level design places props; Nemesis decides which cat has which trait and what the player knows.

**CR-16.1 Prop grammar.** A prop is activated by a Whack, a Pounce landing on it, any Trickster basic, a Move flagged `activates_props`, or a knocked-back cat colliding with it. Enemy cats can activate props too (and the Posse has no Fears unless a recruited Rival brought one along, in which case it applies to that Crew cat exactly as it did when it was a Rival, brief §6.1).

| Prop | Activation effect | Fear it triggers | Reuse |
|---|---|---|---|
| Water bucket | 3 m cone splash: Soggy 8 s | Water | Once |
| Sprinkler / tap | 4 m radius wet zone for 6 s: Soggy while inside | Water | 20 s cooldown |
| Scooter horn / wind chime rack / tin cans | 6 m radius bang: interrupts yellow actions | Loud Noise | 15 s cooldown |
| Ledge junk (flowerpot, crate, paint tin) | Falls on the ground point below: MV 2.0 Thump (pusher's Bite), 1.5 m radius, FZ 30 | — | Once |
| Cucumber (market crates, gardens) | Carried in the mouth by Hop-interact, dropped behind a target | Cucumbers | Once |
| Laundry line / net | Drops a sheet: Tangled 5 s on up to 2 cats beneath | — | Once |
| Kennel chain / a dog behind a gate (set-pieces only) | A bark: 7 m radius | Dogs | 12 s cooldown |
| Vacuum (only at open house doors, by day) | Roar for 3 s in a 5 m cone | Vacuum | Level-scripted |

**CR-16.2 What a triggered Fear does.** On trigger: emit `FearTriggered(cat_id, fear_id, source)`; the cat is Ruffled (CR-11.3 durations), gains flat Frazzle 25 before rank resistance is applied at half strength (F-3 `FearFZ`), has any non-red action interrupted, and suffers the Fear's rider:

| Fear (brief §3.3) | Rider |
|---|---|
| Water | Soggy 8 s |
| Loud Noise | Flinch 48 ticks |
| Dogs | Spooked 2 s (Boss: Flinch 36 instead) |
| Cucumbers | Launched straight up, 60 ticks airborne and helpless; cannot Right itself on this launch |
| Vacuum | Spooked 3 s (Boss: Flinch 36 instead) |
| Being Outnumbered | Passive, no prop: while this cat is the only enemy standing, or 3 or more Posse cats are within 3 m of it, it is Ruffled continuously (does not use the diminishing rule) |

Diminishing rule (anti-lock): the same Fear on the same cat in one encounter gives full effect, then half Ruffled duration and no rider, then nothing ("wise to it").

**CR-16.3 Valuing other Fears and Strengths.** Nemesis owns the catalogue and proposes effects; Combat sets values using this budget so that any trait is worth about the same:

- A **Fear** is worth: one Ruffled application of 6 s + one rider no stronger than "2 s of lost control" or "8 s of a listed debuff".
- A **Strength** is worth one of: resist one damage type ×0.5 (replaces the Style default for that type); immunity to one listed debuff; immunity to Hiss interruption; cannot be knocked off the High Road; +15% Nerve; +1 enemy Paw; one extra Move slot in use; Frazzle resistance +25%.
- Total type multiplier on any hit is clamped to 0.5–1.5 (F-1).
- A cat may not hold a Strength that cancels its own Fear.

#### CR-17. Moves, Knacks and their budgets

Combat owns every Move, Knack and Zoomies definition and number (brief §6). Crew & Progression owns who can learn what, slot rules and Lesson costs. Individual definitions live in data (`assets/data/combat/moves.*`, `knacks.*`); this section fixes the grammar and the first 20 Moves and 10 Knacks. The full vision is about 60 Moves (12 per Style) and 20 Knacks.

**CR-17.1 Move budget.** A Move is built from a Paw cost and a budget:

| Cost | Single-target damage | FZ | Or utility of about |
|---|---|---|---|
| 1 Paw | MV 3.5 (brief: 3–4× a basic hit) | 35 | Heal HealMV 3.0; an 8–10 s debuff on a group; a 5–6 s hard control on Toughs; a reposition with invulnerability |
| 2 Paws | MV 8.0 (brief: about 8×) | 70 | Ring-wide effect; a 4–5 s pin; `bonus_add` to the Frazzle bonus |

Exchange rates: area damage costs 40% of MV per target (MV 3.5 becomes about 2.2 to each); range of 4 m or more costs 15%; added invulnerability or reposition costs 0.5 MV; a rider status costs 0.5–1.0 MV; guaranteed interrupt costs 0.5 MV. A Move that exceeds its budget in one column must fall short in another.

**CR-17.2 Common Move fields.** `id, name, style, cost_paws, type, mv[], fz, target (enemy / ally / self / ground / cone / ring), range, startup, commit_tick, active, recovery, flags (interrupts, activates_props, reaches_high_road, arms_backstab, throws), statuses[], bonus_add, feel_tier`.

**CR-17.3 Starter Moves (20).** Startup values are to the commit tick.

| Style | Move | Cost | Type | Effect | Startup |
|---|---|---|---|---|---|
| Scrapper | **Claw Flurry** | 1 | Claw | 6 hits × MV 0.60 (3.6), FZ 35, single target, lunge 3 m | 8 |
| Scrapper | **Wall-Kick** | 1 | Claw | Dash 5 m in a line, MV 2.4 to each enemy crossed, FZ 20 each; invulnerable during the dash; ends on the High Road if a ledge is at the end of the line | 6 |
| Scrapper | **Scruff Toss** | 1 | Thump | Grab and throw a non-Boss 4 m: MV 2.0, plus MV 1.5 and a Splat if it hits a wall, a prop or another enemy (which also takes MV 1.5); FZ 35; throws off ledges; `throws`, `activates_props` | 12 |
| Scrapper | **Shred** | 2 | Claw | MV 8.0 single target, FZ 60; `bonus_add` +0.10 | 16 |
| Bruiser | **Belly Flop** | 1 | Thump | 2.5 m radius, MV 2.2 each, FZ 45, knockdown on Toughs and Critters; `reaches_high_road` (leaps) | 18 |
| Bruiser | **Shoulder Check** | 1 | Thump | Charge 4 m, MV 3.0, FZ 40, knockback 3 m; `interrupts` | 10 |
| Bruiser | **Loaf** | 1 | — | Self, 6 s: damage taken ×0.5, immovable, cannot attack; enemies within 4 m are taunted (Tough and below forced; Captain and above ×3 targeting weight); melee attackers take MV 0.5 Thump | 6 |
| Bruiser | **Sit On It** | 2 | Thump | Pin one enemy 4 s (Boss 1.5 s): MV 1.0 per second, FZ 70 on impact; the Bruiser can be hit but not moved | 20 |
| Prowler | **Vanish** | 1 | — | Untargetable and unseen for 2.5 s, all enemy targeting on this cat dropped; Backstab armed for 4 s after reappearing and that Backstab gains +MV 1.5 | 4 |
| Prowler | **Drop Strike** | 1 | Fang | Leap to High Road height and dive: MV 3.8, FZ 30; crit if the target is Ruffled; `reaches_high_road` | 14 |
| Prowler | **Shadow Step** | 1 | Fang | Teleport behind a target within 8 m: MV 2.5 as a Backstab (crit, so effective 3.75), FZ 25; extends an existing Ruffled by 3 s | 5 |
| Prowler | **Neck Nip** | 2 | Fang | MV 7.0 single target, FZ 40; `bonus_add` +0.15 | 14 |
| Yowler | **Purr** | 1 | — | Heal HealMV 3.0 to one ally, or HealMV 1.8 to all allies within 3 m of the Yowler; applies Purring 8 s | 20 |
| Yowler | **Withering Hiss** | 1 | Yowl | Cone 5 m × 90°: MV 1.5, Cowed 10 s; `interrupts` | 12 |
| Yowler | **Big Talk** | 1 | — | Enemies within 6 m must target a chosen ally (default: self) for 5 s (Captain and above: ×3 weight); that ally takes ×0.7 damage for the duration | 10 |
| Yowler | **Banshee Screech** | 2 | Yowl | Ring-wide, up to 6 targets: MV 3.0 each, FZ 45; `interrupts`; knocks every enemy off High Road ledges | 24 |
| Trickster | **Shelf Sweep** | 1 | Thump | Activate any one prop within 10 m instantly; if no prop is in range, lob a found object 7 m: MV 3.0, 1.5 m radius, FZ 30 | 10 |
| Trickster | **Dirt Devil** | 1 | Claw | Ground zone 3 m radius for 6 s: MV 1.5 on cast; enemies inside are Dirt-Eyed | 12 |
| Trickster | **Bait** | 1 | — | Drop a lure: Toughs and Critters within 6 m go to it and bat at it for 4 s; Captains for 1.5 s; Bosses are immune but any yellow action they are winding up is interrupted | 8 |
| Trickster | **Yarn Tangle** | 2 | Thump | Target and up to 2 enemies within 2 m: Tangled 5 s, MV 2.0 each, FZ 50 each | 16 |

MVP set (8 Moves): Claw Flurry, Shred, Belly Flop, Loaf, Drop Strike, Vanish, Purr, Shelf Sweep. Vertical-slice set (16 Moves, 3 Styles, brief §10): which three Styles ship is a Crew/production decision; all five Styles have four defined here so any three can be chosen.

**CR-17.4 Starter Knacks (10 of 20).** Passive; two equipped per cat.

| Knack | Effect |
|---|---|
| **Always Lands** | Righting always succeeds (player and AI); no fall damage |
| **Thick Scruff** | Brace blocks an extra 15 percentage points |
| **Loud Purr** | Heals given +20% |
| **Alley Eyes** | Hair's-Breadth window 9 ticks instead of 6 |
| **First Swipe** | Starts every encounter with +50 Pounce points |
| **Grudge-Holder** | +15% damage to any cat whose Memory records that it has Routed this cat (read-only query to Nemesis) |
| **Pack Cat** | When AI-controlled, Pounce gains ×0.65 instead of ×0.50 |
| **Stubborn** | Once per day, a hit that would Rout this cat leaves it at 1 Nerve with 60 ticks of invulnerability |
| **Kick 'Em While They're Down** | +20% damage to Frazzled enemies (additive bucket, F-1) |
| **Motor** | Zoomies gain +25% |

Knack budget: one Knack is worth about +10–15% of one output channel (damage, survivability, Paw economy or Zoomies) and never grants a new verb.

#### CR-18. Enemy design grammar

**CR-18.1 Telegraph language.** Every enemy attack belongs to exactly one class. Class is conveyed by pose, shape **and** colour, so it never depends on colour vision.

| Class | Pose cue | Shape cue | Colour | Player answers | Minimum windup |
|---|---|---|---|---|---|
| **White** | Ear flick and shoulder dip | Thin arc or line on the ground | White | Brace, Bap, Skitter | 18 ticks (Tough), 14 (Captain and above) |
| **Yellow** | Tail lash, crouch, a triangle "!" glyph over the head | Dashed outline of the area | Yellow | **Hiss / interrupt** (best), Skitter, Brace | 45 ticks |
| **Red** | Ears flat, whole body flashes once | **Solid filled** area on the ground that fills up as a timer | Red | Leave the area or Skitter through; **cannot be Braced, Bapped or Hissed** | 60 ticks (90 for an enemy Zoomies) |

Rules: no enemy attack may be shorter than its class minimum; an attack's hit area never exceeds its drawn shape; an off-screen attacker shows an edge arrow for the whole windup (CR-6.3); at most **one red** telegraph may be active in the ring at a time outside Boss fights.

**CR-18.2 Attack tokens.** Enemies need a token to begin an attack. Tokens limit how many attacks can be in flight:

| | Kitten | Alley | Feral |
|---|---|---|---|
| Melee tokens on the player-controlled cat | 1 | 2 | 3 |
| Ranged / Yowl tokens on the player-controlled cat | 0 | 1 | 1 |
| Tokens on each AI Posse cat | 1 | 1 | 2 |
| Minimum gap between two attacks landing on the same cat | 30 ticks | 20 ticks | 12 ticks |

Enemies without a token posture (circle, hiss idle, shuffle sideways), which is both readable and cat-true.

**CR-18.3 Enemy behaviour rules.** Enemies use the same basic kits per Style as the Posse (CR-3) with AI cadence (CR-10.1), plus their four Moves from the `RivalCombatProfile`. They obey the Perch rule and come down from the High Road after 4 s. Captains and above Brace or Skitter player strings with a chance set by difficulty (CR-20), never against a Bap-follow-up, a Counter-Pounce or while Ruffled. No enemy heals more than 25% of its max Nerve per encounter in total. An enemy group contains at most one healer below Captain rank.

**CR-18.4 Enemy Paws.** Enemy gauges fill at a flat rate with no gain from hits: Stray/Tough 1 Paw per 16 s, Captain 1 per 9 s, Boss 1 per 6 s (×difficulty, CR-20). Enemy Moves use their class from CR-18.1: 1-Paw Moves are at least yellow; 2-Paw Moves and Zoomies are red unless the Move is a self-buff or heal, which is yellow (and therefore Hissable).

**CR-18.5 Archetypes.**

| Archetype | Rank / Nerve (brief §8) | Role in a fight | Signature behaviour |
|---|---|---|---|
| **Stray** | ×1 | One-on-one tutorial opponent, recruit candidate | No Moves or one; Backs Down readily |
| **Tough** (any Style) | ×1 | The body of every group; dies in 8–12 s of attention | One or two Moves; Style decides its job (Bruiser Tough blocks a lane, Yowler Tough heals, Prowler Tough goes for the back line) |
| **Captain** | ×4, Swagger 30% | The centre of a Patch fight | Full four Moves, a Fear and a Strength, Braces and Skitters, may use a Zoomies once below 50% Nerve if Nemesis flags them a Nemesis |
| **Boss** | ×12 (Botan ×20), Swagger 50–55% | Phased set-piece | CR-18.6 |
| **Critter: crows** | ×0.5 each, groups of 2–4 | Aerial harassment | Live on the High Road layer; only vulnerable during a dive (yellow) or to ranged, Pounce and `reaches_high_road`; a Hissed dive makes the crow Splat (Frazzled for 4 s) |
| **Critter: rats** | ×0.5 each, groups of 3–5 | Swarm | Fast white nips; every rat Backs Down when the swarm is reduced to one |
| **Critter: weasel** | ×2 | Duelist | Skitters constantly; long red chain-dash; weak to Tangled and Bait |
| **Critter: tanuki** | ×3 | Bruiser-like | Belly-drum yellow buff (Fired Up) that must be Hissed; once per fight **plays dead** at 30% Nerve (fake Rout puff; gets up after 3 s with Ruffled if anyone is within 2 m to see through it) |
| **Set-piece: the chained dog** | Not Routable | Arena hazard for both sides | Lunges to the end of its chain on a red arc; its bark triggers the Dogs Fear on any cat in 7 m, Posse included; the fight is about luring enemies into the arc |

Critters are never Rivals or Crew, never get a Verdict, and make up at most 20% of encounters (brief §3.1).

**CR-18.6 Boss grammar.** Bosses are authored (personality: Narrative; trait kit: Nemesis; combat behaviour: here).

1. **Phases.** Three phases at 100–70%, 70–35% and 35–0% Nerve (Botan: four, at 75 / 50 / 25%). Damage that would cross a threshold is clamped to the threshold (**phase gate**).
2. **Phase break.** Crossing a threshold triggers a 3–4 s break: the Boss is invulnerable, Frazzle gauge resets, the arena changes (a prop set appears or is removed, High Road access opens or closes), a wave of 2–3 Toughs may enter, and all Posse cats gain 50 Pounce points. T5 feel. Total break time per Boss fight must not exceed 12 s (16 s for Botan).
3. **Each phase adds, never replaces**: one new attack and one new way to Ruffle the Boss. A Boss must always have at least one environmental route to Ruffled in every phase.
4. **A Boss teaches one cat verb.** Proposed mechanical hooks (subject to Nemesis and Narrative):

| Boss | Style | Verb taught | Hook |
|---|---|---|---|
| Daifuku | Bruiser | High Road, knock-offs | Begins on his wall and will not come down: he can only be damaged meaningfully after being knocked off it (Splat → Ruffled). Later phases he climbs back |
| Madam Sabi | Yowler | Hiss interrupts, target priority | Calls Awning Gang Toughs and heals with yellow yowls that must be interrupted; shop props (tin cans, crates) everywhere |
| Oboro | Prowler | Whisker Sense in combat, lock-on discipline | Vanishes between attacks; stone lanterns knocked alight reveal and Ruffle; Backstabs the cat with the lowest Nerve |
| Ikari | Scrapper | Positioning | One-eyed: attacks from his blind side count as from behind and Ruffle on a Whack; harbour arena has ice crates and a hose |
| Kiha & Moha | Trickster ×2 | Splitting the Posse, Tactics | Two bodies, each ×6 Nerve, separate Frazzle gauges; if one is Routed the other is Fired Up and Ruffle-immune for 10 s, then permanently Ruffled (Outnumbered) |
| Botan | (Nemesis to set) | Everything | Four phases, 55% Swagger, a unique Zoomies; her kit should mirror Mikan's: she too is a pet |

**CR-18.7 Nemesis adaptation hook.** "Rivals adapt to how you beat them" (pillars) is expressed through Strengths gained between encounters, which Nemesis grants and CR-16.3 values. Combat adds no hidden adaptation of its own.

#### CR-19. Encounter structure

**CR-19.1 No random encounters, no scene change.** Every opponent is visible in the world before a fight. A fight starts when `EncounterStarted` is emitted with one of the four canonical openers.

**CR-19.2 Openers.**

| Opener | Condition | Start state |
|---|---|---|
| `standoff` | Mikan and a hostile group are mutually aware within 5 m, or the player interacts with a Rival | Standoff camera and name-card (2–4 s, skippable after first sight); then both sides start neutral; Posse gauges at 50 points |
| `ambush_by_player` | A Pounce from the High Road, or any attack from the rear 120°, on an **unaware** target | That hit deals ×1.5 damage (Prowler ×2.25 with Opportunist); the target is **Ruffled 6 s** (brief); its whole group is Startled 1.5 s; every Posse cat +50 Pounce points; no Standoff (the name-card slides in as a 1 s corner tag instead) |
| `ambush_by_rival` | Injected by Nemesis | The Rival's yowl-sting plays from off-screen for 60 ticks. If the player Skitters or Braces during the last 30 ticks (**Ears Up**), the ambush is spoiled and the fight starts neutral with gauges at 50. Otherwise the controlled cat takes one hit of MV 1.5, the Posse is Startled 2 s and gauges start at 0 |
| `raid_defence` | The player answers a Caterwaul and arrives at a raided Patch | Sentries posted there fight as allied AI on Scrap Tactic; they are not controllable and not part of Pile-On; the fight starts neutral |

**CR-19.3 The ring.** On `EncounterStarted` the ring is centred on the nearest authored **arena anchor** to the midpoint of the two groups (Level design places 1–3 anchors per Patch, each with a nav-validated ring and at least two props and one High Road ledge; Den anchors may author a diameter of 10–16 m). Default diameter 12 m (brief §4). The ring is soft:
- Enemies are leashed to it and return if pushed out.
- Posse AI cats stay inside.
- The player-controlled cat can cross it; see Scram.
- Knockbacks stop at the ring edge unless a High Road ledge or drop is there.

**CR-19.4 Composition rules.** Each encounter has a **threat budget**: Critter 0.5–1.5 (by Nerve multiplier), Stray/Tough 1, Captain 3, Boss 8.

| Context | Budget | Typical make-up |
|---|---|---|
| Roaming group | 2–4 | 2–4 Toughs, or Critters |
| Patch holders | 3–5 | 3–5 Toughs; or 1 Captain + 2 Toughs |
| Den approach | 5–6 | 1 Captain + 2–3 Toughs |
| Boss at a Den | 8 + waves of 2–3 | CR-18.6 |
| Life 1 tutorial | 0.5–1 | One crow; one Stray |

Hard rules: 1–6 enemies in the opening group (brief); never more than **10 combatants** present including Posse and Sentries (brief), so with a full Posse at most 6 enemies are active and any further enemies arrive as a wave when 2 or fewer enemies remain; at most 2 waves outside Boss fights; at most 2 ranged enemies and 1 healer among non-Captains; no two Captains in one encounter before Life 5; enemy level is supplied by Nemesis within the district band (brief §4).

**CR-19.5 Scram (fleeing).** The player flees by holding the controlled cat more than 2 m outside the ring for 3 s (a visible countdown), or by choosing Scram in Slow Blink (the Posse disengages over 1.5 s, during which they can still be hit). Result: `EncounterEnded(outcome = player_fled)`. Combat applies no penalty of its own: no Morsel loss, and Routed Crew stay Routed. Every enemy's Nerve and Frazzle reset, and that group is **alert** for 20 s (it cannot be Ambushed), so fleeing cannot be used to re-roll an opener. Boss fights can be fled like any other. What a Rival makes of being run from is Nemesis's business.

**CR-19.6 Enemy flight.** A Rival whose `RivalCombatProfile` carries a `flee_threshold` (see Assumptions) tries to bolt when its Nerve falls below it: a yellow 60-tick windup that can be interrupted or stopped by any hit; a Frazzled, pinned or Tangled cat cannot bolt. If the last enemies bolt, `EncounterEnded(outcome = rival_fled)`.

**CR-19.7 Ending and consequences.**

| Outcome | Condition | What Combat does | What others do |
|---|---|---|---|
| `win` | All enemies Routed or fled with at least one Routed | Emits `CatRouted` per victim as it happens and `EncounterEnded`; survivors **Lick Wounds** (+25% of missing Nerve); Mikan, if Routed, **Shakes It Off** at 20% Nerve; Routed Crew stay Routed until a Sunspot or home (brief §6.1) | Verdict (Nemesis/UX), loot (Economy), XP and Loyalty (Crew) |
| `loss` | Every Posse cat Routed | Emits `EncounterEnded(loss)` | Mikan slinks home, the day ends, 20% of carried Morsels are lost, the victor is promoted and Titled (brief §6.1); none of that is computed here |
| `player_fled` | CR-19.5 | As described | Nemesis |
| `rival_fled` | CR-19.6 | Lick Wounds applies | Nemesis |

Nerve and Zoomies persist between encounters within a day. Pounce Gauge, statuses (except Well-Fed) and Frazzle do not.

**CR-19.8 Humans as weather.** In Morning and Day phases in districts with humans, Level design may place **Shoo** hazards: a human (broom, feet, bicycle) crosses the ring along a marked lane with a 3 s red-class telegraph (a shadow and footsteps). Every cat in the lane on arrival, on both sides, is Spooked 2 s and pushed 3 m; no damage. Humans are never targetable and never harmed (brief §9). At most one Shoo per 30 s per encounter; none in Boss fights; none at Night.

**CR-19.9 Anti-stall guarantees** ("nothing may stall", brief §7).
1. Perch rule (CR-5.2) on both sides.
2. Enemy healing cap (CR-18.3).
3. **Fed Up:** if a non-Boss encounter reaches 120 s of game time, every enemy permanently loses Swagger and is Ruffled for the rest of the fight.
4. If no damage has been dealt by either side for 15 s, every enemy with a token is forced to attack and all Posse cats gain 100 Pounce points.
5. Fears diminish (CR-16.2) and Frazzle hardens (CR-11.7) so no lock can be looped indefinitely; Bosses always progress by phase gate.

#### CR-20. Difficulty and accessibility

**CR-20.1 Modes.** Per the brief, modes scale enemy Nerve, enemy damage and AI aggression **only**; player-side timings, Paw rates, Frazzle rules, nemesis and story are identical in all three.

| Parameter | Kitten | Alley (default) | Feral |
|---|---|---|---|
| Enemy Nerve | ×0.80 | ×1.00 | ×1.25 |
| Enemy damage dealt | ×0.60 | ×1.00 | ×1.35 |
| Attack tokens | CR-18.2 | CR-18.2 | CR-18.2 |
| Enemy Paw fill rate | ×0.70 | ×1.00 | ×1.30 |
| Captain/Boss chance to Brace or Skitter a player string | 10% | 25% | 45% |
| Enemy posture time between strings | ×1.4 | ×1.0 | ×0.7 |
| Enemy use of props against the Posse | Never | Captains and above | Any rank |

The mode can be changed at any time outside combat with no penalty or flag.

**CR-20.2 Accessibility and assist options** (independent of mode; Combat defines the rule, UX owns presentation and `design/accessibility-requirements.md`).

| Option | Values (default first) | Rule |
|---|---|---|
| Slow Blink speed | 5% / full pause | Full pause sets time-scale 0 while the menu is open |
| Slow Blink input | Toggle / hold | |
| **Auto-Scrap** | Off / on | The controlled cat uses its AI basic-attack and defence routine (at full player Pounce rate); the player only switches and commands. The equivalent of a "classic" mode |
| Generous timing | Off / on | Bap window 8 → 12 ticks; Hair's-Breadth window 6 → 9; Righting window 12 → 20 |
| Longer tells | Off / on | All enemy telegraph windups ×1.3 |
| Auto lock-on | On / off | Hard-locks the soft target automatically |
| Hold-to-charge → tap twice | Off / on | For Bunny-Kick and Sit |
| Simultaneous-press actions | Chord / single button | Pile-On and Zoomies get a dedicated remappable button |
| Screen shake | 100% / 0–100% slider | Scales every amplitude in the Game Feel table |
| Hit-stop | 100% / 50% / off | Scales every hit-stop duration |
| Flash reduction | Off / on | Impact frames become a 2-tick outline pop with no full-screen luminance change; action lines stay |
| Camera punch-in | On / off | |
| Rumble | 100% / 0–100% | |
| Telegraph palette | Default / high-contrast / custom | Shapes and poses are unchanged, so colour is never the only cue |
| Damage numbers | On / off | |

**CR-20.3 Photosensitivity rule (not optional).** In any configuration, full-screen luminance flashes are limited to 3 per second, and no impact frame may hold for more than 3 ticks.

#### CR-21. Introduction order (input to UX's onboarding flow)

Scaffolded so each verb appears alone before it is combined (brief §5.4 turf goals; concept onboarding curve).

| When | Introduced | First opponent |
|---|---|---|
| Life 1, garden | Move, Hop, Swipe string | A crow on the wall |
| Life 1 | Skitter; Brace | A Stray kitten |
| Life 1 | First Paw: Slow Blink opens itself once and teaches one Move | Same Stray |
| Life 1, first Patch | Hiss on a yellow telegraph; Back Down | Two Strays |
| Life 2, first Crew cat | Switching, Tactics, Frazzle and Quick Pile-On | Toughs |
| Life 2 | Ambush and the High Road Pounce; Whack; props and a first Fear | Wall Sitters Toughs, a Captain |
| Life 2 | Bap and Hair's-Breadth named (available from the start, undisclosed) | Captain |
| Life 2 end | Full Pile-On, Zoomies, phases | Daifuku |
| Life 4 | Mikan's third Paw | — |

### States and Transitions

#### Encounter state machine

| State | Entry condition | Exit condition | Behaviour |
|---|---|---|---|
| **Roaming** | Default; `EncounterEnded` processed | An opener condition (CR-19.2) | Day clock runs; no combat HUD |
| **Opening** | Opener chosen | Standoff ends or is skipped; ambush hit resolves; Ears Up window ends | `EncounterStarted` emitted on entry; ring placed; day clock paused; camera to Standoff or straight to Brawl |
| **Brawl** | Opening complete | Win, loss, flee conditions | Full combat rules |
| **Slow Blink** (sub-state of Brawl) | Slow Blink pressed | Pressed again, command confirmed with auto-close on, or a T5 cinematic starts | Time-scale 0.05 (or 0); commands queue |
| **Cinematic** (sub-state of Brawl) | Pile-On, Zoomies, phase break | Sequence ends | Participants invulnerable; one at a time; Slow Blink input buffered |
| **Wave** (sub-state of Brawl) | Active enemies ≤ 2 and budget remains | Wave has entered the ring | New enemies enter from the ring edge with a 1 s arrival telegraph; they cannot attack for 1 s |
| **Resolve** | Last enemy Routed or fled; or last Posse cat Routed; or Scram completes | 0.8 s camera return | `EncounterEnded` emitted; Lick Wounds / Shake It Off applied; ring removed; hand-off to Verdict if any Rival was Routed |

#### Cat action state machine (any combatant)

| State | Entry | Exit | Behaviour |
|---|---|---|---|
| **Neutral** | Default | Any input or AI decision | Move freely; passive Pounce fill |
| **Basic attack** | Swipe / Whack | Recovery ends; cancelled per CR-2 | Startup → active → recovery; chain to next string hit |
| **Skitter** | Dodge input | 22 ticks (or attack-cancel from 16) | Invulnerable window; may become Hair's-Breadth |
| **Brace** | Guard held | Released; hit from behind; red hit | Blocks front; first 8 ticks can Bap |
| **Hop / Mantle / Airborne** | Hop | Landing | Layer may change; Swipe in air = Pounce |
| **Hiss** | Hiss input off cooldown | 32 ticks | Cone check on active ticks |
| **Move** | Shortcut or queued command reaches its free tick | Recovery ends; interrupted before commit | Paws spent at commit; flinch-immune from commit to end of active |
| **Flinch** | Unblocked hit while not armoured | 36 ticks | No actions; Skitter allowed from tick 24 |
| **Tumble** | Launch, throw, knock-off | Landing: Righting → Neutral, or Splat | Righting window in the last 12 ticks |
| **Knockdown / Splat** | Failed Righting; knockdown attacks | 48 ticks | Invulnerable during the last 12 get-up ticks |
| **Pinned / Tangled / Spooked** | Per source | Timer | Per CR-15 |
| **Perched** (flag) | 4 s on the High Road | 1 s after touching Ground | No passive Pounce; top target priority |
| **Frazzled** (enemies only) | Frazzle gauge 100 | 8 s; Pile-On resolves | Helpless; Frazzle bonus applies |
| **Cinematic** | Pile-On participant or victim; Zoomies user | Sequence ends | Invulnerable |
| **Routed** | Nerve 0 | End of encounter (Mikan), Sunspot or home (Crew) | Dust puff, bolts to the ring edge and leaves; `CatRouted` emitted; cannot be targeted, healed or selected |

#### Enemy poise states (the stagger loop)

| State | Entry | Exit | Damage taken | Frazzle gain |
|---|---|---|---|---|
| **Swaggering** (Captain and above only) | Default; Ruffled expires | Ruffled or Frazzled | ×(1 − Swagger) | ×1 |
| **Steady** (Tough and below default) | Default | Ruffled or Frazzled | ×1 | ×1 |
| **Ruffled** | CR-11.3 sources | Timer ends → default; gauge fills → Frazzled | ×1 | ×2, no decay |
| **Frazzled** | Gauge 100 | 8 s or Pile-On → **Shaking Off** | ×Frazzle bonus (1.5–2.0) | none |
| **Shaking Off** | Frazzled ends | 2 s → default | Default multiplier | none; immune to Ruffled |

#### Posse AI states

| State | Entry | Exit | Behaviour |
|---|---|---|---|
| **Engage** | Has a target per Tactic | String complete | Close distance, one basic string |
| **Posture** | String complete; no token | 2.5–4.0 s | Circle at 2–3 m, face target, may Hiss |
| **React** | Telegraph aimed at this cat | Response resolved | Brace / Skitter / Hiss per CR-10.2 |
| **Retreat** | Nerve ≤ 25% | Nerve > 40% or any command | Keep 4 m away, Brace |
| **Command** | Queued command | Move resolved or dropped | Overrides all of the above |
| **Controlled** | Player switches in | Player switches out | AI suspended |

### Interactions with Other Systems

| System | Combat receives | Combat provides | Responsibility line |
|---|---|---|---|
| **Crew & Progression** | Each cat's `level`, `stats`, equipped `moves[4]`, `knacks[2]`, `zoomies`, Style; Mikan's ageing modifiers as already-applied stats | `CatRouted`, `EncounterEnded` (for XP and Loyalty); the Move/Knack/Zoomies catalogue that learnsets reference by `id` | They own growth curves, learnsets, Lessons, slot rules. Combat owns what each `id` does |
| **Nemesis** | `RivalCombatProfile` at encounter start; ambush injections; which Fears are known to the player | `EncounterStarted`, `CatRouted`, `FearTriggered`, `EncounterEnded`; valuation of every Strength and Fear (CR-16) | Nemesis decides who, when and why; Combat decides how hard |
| **Territory & Economy** | `patch_id`; Sentries present for `raid_defence` | `EncounterEnded` (Patch holder changes follow from Verdicts, not from Combat) | Loot in Morsels is theirs; Combat defines no rewards |
| **Narrative** | `BondChanged` (0–10) for Well-Fed | — | Narrative sets when Bond rises; Combat applies +2% max Nerve per heart for the next day |
| **Clock (brief §5)** | `PhaseChanged` (to enable or forbid Shoo hazards; Night composition comes via Nemesis) | Pauses the day clock from `EncounterStarted` to `EncounterEnded` | — |
| **Level design** | Arena anchors, ring sizes, High Road ledges, prop placement, Shoo lanes | The prop grammar (CR-16.1) and anchor requirements (CR-19.3) | Level places; Combat defines behaviour |
| **UX** | Final controls map; HUD and Slow Blink menu layout | The data each screen must show (UI Requirements) and the timing contract ("opens on the tick of the press") | UX owns screens; Combat owns rules behind them |
| **Art** | VFX and animation look | Every duration, frame count and tier assignment (Game Feel) | Combat owns timings; Art owns how they look (brief §6) |
| **Audio** | Impact audio, vocal sets, yowl-stings | Tier events with timestamps for sync; `EncounterStarted`, `FearTriggered` | Audio owns the mix |

---

## Formulas

Notation: `floor()` rounds down; `clamp(x, a, b)` limits x to [a, b]. Worked examples use the brief's **Style-neutral** stat frame: every non-Nerve stat is 10 at Lv 1 and 160 at Lv 50; Nerve is 100 and 2,500. Real cats differ by Style weighting (Crew & Progression).

### F-0. Reference curves

```
StatRef(L) = 10 + 150 × (L − 1) / 49
K_dmg(L)   = 2.00 + 0.50 × (L − 1) / 49
K_heal(L)  = 1.00 + 0.5625 × (L − 1) / 49
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| L | int | 1–50 | Cat schema | Level of the acting cat |
| StatRef | float | 10–160 | Derived | The Style-neutral stat expected at level L. **Must track Crew & Progression's neutral curve**; if their curve is not linear, this table is replaced by theirs |
| K_dmg | float | 2.00–2.50 | Data | Level scaling so a basic hit lands on the brief's 8–12 → 170–230 band |
| K_heal | float | 1.00–1.5625 | Data | Level scaling so a 1-Paw heal restores about 30% of neutral Nerve at any level |

Why two K curves exist: the brief scales Nerve ×25 from Lv 1 to 50 but other stats ×16. Without a level term, hits would shrink from 10% to 6.4% of Nerve over the game.

### F-1. Damage

```
Mit      = clamp( StatRef(L_att) / ( StatRef(L_att) + Hide_def ), 0.10, 0.90 )
Base     = MV × Atk × K_dmg(L_att)
TypeMod  = clamp( StyleMod × TraitMod, 0.50, 1.50 )
PoiseMod = FrazzleBonus            if target Frazzled      (1.50–2.00)
         = 1.00                    if target Ruffled, or has no Swagger
         = 1 − Swagger             otherwise               (0.45–0.70)
BuffMod  = clamp( 1 + Σ(additive bonuses) − Σ(additive penalties), 0.50, 1.60 )
Damage   = max( 1, floor( Base × Mit × TypeMod × PoiseMod × CritMod × BuffMod
                          × GuardMod × OpenerMod × DiffMod × Variance ) )
Displayed and applied damage is capped at 9,999 per hit.
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| MV | float | 0.4–8.0 | Move / attack data | Motion value |
| Atk | int | 10–~210 | Cat stats | Bite for Claw/Fang/Thump; Voice for Yowl |
| Hide_def | int | 10–~210 | Target stats | After buffs |
| StyleMod | float | 0.75 / 1.00 / 1.25 | CR-14.2 | Style weak/resist |
| TraitMod | float | 0.50–1.25 | CR-16.3 | Strength/Fear type modifier |
| FrazzleBonus | float | 1.50–2.00 | CR-11.6 | |
| Swagger | float | 0–0.55 | CR-11.1 | Enemy rank |
| CritMod | float | 1.0 or 1.5 | CR-14.4 | Deterministic |
| Additive bonuses | float | each 0.10–0.25 | Fired Up +0.20, Kick 'Em +0.20, Grudge-Holder +0.15; Cowed −0.25 | One bucket, so bonuses do not multiply each other |
| GuardMod | float | 1.0; 0.40 Brace; 0.20 Bruiser Brace (0.25 / 0.05 with Thick Scruff); 0.5 Loaf; 0.7 Big Talk | CR-4.3 | Brace and one other source multiply |
| OpenerMod | float | 1.0; 1.5 Ambush opener hit (×1.5 again for Prowler) | CR-19.2 | |
| DiffMod | float | 0.60 / 1.00 / 1.35 | CR-20.1 | Applied only to damage dealt **by enemies** |
| Variance | float | 1.00 (default); knob allows 0.95–1.05 uniform, seeded | Data | Off by default for readability and deterministic tests |

**Expected output range**: 1 to 9,999 per hit. Typical: 8–11 (Lv 1 basic), 170–230 (Lv 50 basic).

**Worked example A, Lv 1, basic hit.** Mikan Lv 1 (Bite 10) lands Swipe 1 (MV 0.85) on a Lv 1 neutral Tough (Hide 10, no Swagger).
`Mit = 10 / (10 + 10) = 0.50` · `Base = 0.85 × 10 × 2.00 = 17.0` · `Damage = floor(17.0 × 0.50) = 8`.
Swipe 4 (MV 1.15): `floor(1.15 × 10 × 2.0 × 0.5) = 11`. The string deals 8 + 8 + 9 + 11 = **36**, 36% of the Tough's 100 Nerve. Brief target 8–12 per hit: met.

**Worked example B, Lv 50, basic hit.** Bite 160, Hide 160: `Mit = 160 / 320 = 0.50` · `Base = 0.85 × 160 × 2.50 = 340` · `Damage = 170`. Swipe 4: `1.15 × 160 × 2.5 × 0.5 = 230`. The string deals 170 + 170 + 190 + 230 = **760**, 30.4% of 2,500 Nerve. Brief target 170–230: met exactly. Note the string is worth 36% of Nerve at Lv 1 and 30% at cap: by the brief's own frame, fights at cap run about 20% longer.

**Worked example C, a Move in the Frazzle window.** Lv 50 Scrapper, Shred (MV 8.0, Claw) on a Frazzled Lv 50 Prowler (weak to Claw), Frazzle bonus already at 1.70, attacker Fired Up and holding Kick 'Em While They're Down.
`Base = 8.0 × 160 × 2.5 = 3,200` · `× Mit 0.5 = 1,600` · `× TypeMod 1.25 = 2,000` · `× PoiseMod 1.70 = 3,400` · `× BuffMod (1 + 0.20 + 0.20) = 4,760`. Under the 9,999 cap.

**Ceiling check.** The largest single hit the starter catalogue allows: Neck Nip (MV 7.0) as a Prowler crit ×1.5 on a Frazzled Yowler (weak to Fang) at bonus 2.00 with BuffMod at its 1.60 clamp: `7.0 × 160 × 2.5 × 0.5 × 1.25 × 2.00 × 1.5 × 1.60 = 8,400`. Below 9,999, as the brief requires, but with only 16% headroom: any future Move above MV 8 or any new multiplier must be re-checked against this line.

**Worked example D, under-levelled against Swagger.** Mikan Lv 10 (neutral Bite `StatRef(10) = 37.55`, use 37) hits a Lv 16 Swaggering Captain (neutral Hide 55.9, use 55) with Swipe 1.
`K_dmg(10) = 2.092` · `Mit = 37.55 / (37.55 + 55) = 0.406` · `Base = 0.85 × 37 × 2.092 = 65.8` · `× 0.406 = 26.7` · `× (1 − 0.30) = 18.7` → **18**. The same hit on the Captain while Ruffled: **26**. While Frazzled at 1.50: **40**.

**Edge cases.** `Hide_def` ≤ 0 is treated as 1. Damage to an invulnerable target is 0 and shows no number. Immunity from a Strength shows a "no effect" glyph, deals 0 and generates no Pounce or Frazzle. The phase gate (CR-18.6) clamps after this formula.

### F-2. Healing

```
Heal = floor( HealMV × Voice × K_heal(L) × (1 + Σ heal bonuses) )
HoT (Purring) = floor( 0.6 × Voice × K_heal(L) ) per 2 s, 4 ticks over 8 s
```

| Variable | Type | Range | Source | Description |
|---|---|---|---|---|
| HealMV | float | 1.8–4.0 | Move data | |
| Voice | int | 10–~210 | Healer's stats | |
| heal bonuses | float | 0–0.35 | Big Voice +0.15, Loud Purr +0.20 | Additive |

**Expected output**: Purr single target, neutral Voice: **30** at Lv 1 (30% of neutral Nerve), **750** at Lv 50 (`3.0 × 160 × 1.5625`, 30% of 2,500). Purring adds 4 × 6 = 24 at Lv 1 and 4 × 150 = 600 at Lv 50 over 8 s. A Yowler with Big Voice and Loud Purr: ×1.35.
**Edge cases.** Healing never exceeds max Nerve; overheal is discarded. A Routed cat cannot be healed. Lick Wounds: `floor(0.25 × (MaxNerve − Nerve))`. Well-Fed: `MaxNerve × (1 + 0.02 × Bond)`, so +20% at 10 hearts; current Nerve is raised by the same amount when the buff is applied in the morning.

### F-3. Frazzle gain

```
ΔFrazzle = FZ × RankRes × Harden × AttackerMod × WeakMod × RuffledMod
RankRes   = 1.00 (Stray, Tough, Critter) | 0.20 (Captain) | 0.08 (Boss) | 0.06 (Botan)
Harden    = 1 / (1 + 0.10 × n)      n = completed Frazzles on this enemy this encounter, max 3;
                                    always 1 for Tough and below
AttackerMod = 1.3 for a Bruiser attacker, else 1.0
WeakMod   = 1.25 if the hit's type is the target's weakness, else 1.0
RuffledMod = 2.0 if Ruffled, else 1.0
FearFZ    = 25 × sqrt(RankRes)      flat Frazzle on a Fear trigger (25 / 11.2 / 7.1 / 6.1)
```

**Expected output**: 0.4 to 182 per hit; gauge clamps at 100.

**Worked example (level-independent, so it holds at Lv 1 and Lv 50).** A Scrapper's full Swipe string (FZ 40) on a Tough: 40 points; two strings and one Claw Flurry (35) = 115, so a focused Tough Frazzles in about 4–5 s; if Ambushed (Ruffled) in half that. The same sequence on a Swaggering Captain: `115 × 0.20 = 23`; while Ruffled: 46. On a Boss: 9.2, or 18.4 Ruffled.

**Paper estimate of time-to-Frazzle** (assumptions: whole Posse on the target, player uptime 70%, AI cadence per CR-10.1, about 30 Frazzle per second on the Tough scale before resistance):

| Target | Not Ruffled | Ruffled half the time | Intent |
|---|---|---|---|
| Tough | 3–5 s | 2–3 s | Roughly once per Tough; sets up a Quick Pile-On |
| Captain | 17–22 s | 11–15 s | Two Frazzles in a 45–75 s fight |
| Boss | 40–55 s | 28–37 s | Three or four Frazzles in a 3–5 min fight |

These are untested model outputs, not measurements.

### F-4. Frazzle bonus

```
FrazzleBonus = min( 2.00, 1.50 + 0.05 × PawsSpentOnTarget + Σ bonus_add )
```

**Example.** A Posse that banked 2 + 2 + 2 + 2 Paws and spends all eight in the window reaches `1.50 + 0.40 = 1.90`; if one of those is Shred (+0.10) it reaches the 2.00 cap. From Life 4, Mikan's third Paw makes the cap reachable without a `bonus_add` Move. Identical at every level.

### F-5. Pile-On damage

```
PileOnHit(cat) = F-1 with MV = 1.50, Atk = max(Bite, Voice), type = Style basic type,
                 PoiseMod = current FrazzleBonus, CritMod = 1.0
PileOnTotal    = Σ over participating cats;   swept enemies take 50%
```

**Lv 1 example.** Four neutral cats, bonus 1.70, target Hide 10: each `floor(1.5 × 10 × 2.0 × 0.5 × 1.70) = 25`; total **100**: Routs any Tough, 25% of a Captain's 400 Nerve, 8% of a Boss's 1,200.
**Lv 50 example.** Each `floor(1.5 × 160 × 2.5 × 0.5 × 1.70) = 510`; total **2,040**: 82% of a 2,500-Nerve Tough, 20% of a Captain's 10,000, 6.8% of a Boss's 30,000.
With only two cats standing the total halves, which is the intended cost of losing Crew.

### F-6. Pounce gain and the Paw budget

```
ΔPounce/s (passive) = (100 / 14) × ZipFactor × ControlMod
ΔPounce (event)     = Points × ZipFactor × ControlMod × StyleMod
ControlMod = 1.0 player-controlled | 0.5 AI-controlled (0.65 with Pack Cat)
StyleMod   = 1.2 for Scrapper basic-attack PG, else 1.0
```

**Budget check against the brief (Scrapper under player control, baseline Zip).** One Swipe string yields `19 × 1.2 = 22.8` points in 1.83 s.

| Situation | Passive | From hits | Total | Seconds per Paw | Brief target |
|---|---|---|---|---|---|
| Not attacking | 7.14/s | 0 | 7.14/s | 14.0 | 14 |
| Sustained offence, 70% uptime | 7.14/s | 8.7/s | 15.9/s | 6.3 | 6–7 |
| Perfect uptime | 7.14/s | 12.5/s | 19.6/s | 5.1 | — |
| Same cat under AI (one string per ~5.1 s, ×0.5) | 3.57/s | 2.2/s | 5.8/s | 17 | "half rate" |

So a Posse earns about one Paw every 6–7 s on the controlled cat plus one every ~6 s across the three AI cats: **a command roughly every 3–3.5 s of game time**, about half of them on cats the player is not controlling. That ratio is the conductor fantasy expressed as a number. Identical at Lv 1 and Lv 50 (Paw economy does not scale with level; only Mikan's third Paw at Life 4 changes capacity).

### F-7. ZipFactor

```
ZipFactor = clamp( 1 + 0.5 × ( Zip / StatRef(L) − 1 ), 0.80, 1.30 )
```

**Lv 1**: Zip 10 → 1.00; Zip 13 → 1.15 (passive Paw in 12.2 s). **Lv 50**: Zip 160 → 1.00; Zip 208 → 1.15; Zip 112 → 0.85 (16.5 s). Also multiplies run speed (CR-1.3).

### F-8. Skitter invulnerability window

```
IFrames = 10 + round( 2 × clamp( (Zip / StatRef(L) − 1) / 0.3, −1, 1 ) )      → 8 to 12 ticks
```

Lv 1 Zip 10 → 10 ticks (167 ms); Zip 13 → 12; Zip 7 → 8. Same ratios at Lv 50. Soggy subtracts 3 afterwards (minimum 5).

### F-9. Zoomies gain

```
From damage:   ΔZ = 60 × DamageTaken / MaxNerve × (1 + Motor)
From Frazzling: Frazzler ΔZ = 12 (Tough/Critter) | 20 (Captain) | 30 (Boss) ; every other standing Posse cat gets one third
```

**Example (any level; inputs are ratios).** A normal 4-Tough encounter: the controlled cat loses 30% of its Nerve (+18), is the Frazzler twice (+24) and a bystander once (+4): **46**, so full in about 2.2 encounters. An AI cat loses 25% (+15), Frazzles one (+12) and stands by for two (+8): **35**, so about 3 encounters. Brief target "about 2–3 normal encounters": met on paper.

### F-10. Time-to-Rout model (paper check against brief §8)

Sustained output assumptions, in MV per second on one target: player-controlled cat 1.0–1.5 from basics at 50–70% uptime plus 0.5 from Paws; each AI cat about 0.75 from basics plus about 0.2 from Paws. At Lv 1, 1 MV ≈ 10 damage against a neutral target.

| Target (Lv 1 frame) | Nerve | Modelled time | Brief target | Verdict |
|---|---|---|---|---|
| Tough, player focus, AI cats busy elsewhere | 100 | 5–8 s (+1–2 s to close distance) | 8–12 s | Low end or slightly under |
| Captain + 2 Toughs, Swagger 30% | 400 | 30–50 s | 45–75 s | Under by up to a third |
| Boss, Swagger 50%, 2 phase breaks, waves | 1,200 | 2.3–3.5 min | 3–5 min | Under at the fast end |
| Botan | 2,000 | Not modelled | 6–8 min | Unknown |

This is the most important known weak spot of the draft: see Open Questions 1. The model is arithmetic from the tables above, not a simulation and not a playtest.

---

## Edge Cases

| # | Scenario | Expected behaviour | Rationale |
|---|---|---|---|
| 1 | Mikan is Routed but Crew are standing | Fight continues; control passes per CR-9.5; on a win Mikan Shakes It Off at 20% Nerve | Brief §7; the player must be able to walk away from a won fight |
| 2 | The controlled cat is Routed during Slow Blink | Slow Blink stays open; selection moves to the new controlled cat; the Routed cat's reservation is released | Never eject the player from the menu mid-decision |
| 3 | A queued Move's target is Routed before the commit tick | Retarget to the nearest valid target of the same kind within the Move's range; if none, drop the command and release the Paws | No wasted Paws on things the player could not foresee |
| 4 | A cat is interrupted before its Move's commit tick | Paws not spent; command dropped | CR-8.6 |
| 5 | Two cats are ordered to use Moves needing the same position | Second cat offsets 1 m; no collision between Posse cats | Readability over simulation |
| 6 | Pile-On pressed as the Frazzle window expires on the same tick | Pile-On wins: availability is checked before the state timer on each tick | Ties go to the player |
| 7 | Pile-On with only one Posse cat standing | Not available; prompt hidden | A "pile" of one is not the signature image; that cat can still use the Frazzle bonus |
| 8 | Two Zoomies / a Zoomies and a Pile-On triggered in the same tick | Pile-On first, then Zoomies in slot order; each waits for the previous to finish | One screen-wide effect at a time (brief §7) |
| 9 | Pile-On would cross a Boss phase gate | Damage clamps at the gate; the phase break plays immediately after the cloud clears | Phases must not be skipped |
| 10 | A Frazzled Boss reaches a phase gate through ordinary hits | Frazzled ends, phase break plays; the unspent window is lost | Stated cost, keeps Boss pacing authored; shown to the player as the gauge ring snapping |
| 11 | Slow Blink pressed during a T5 cinematic | Buffered; opens on the cinematic's last tick | Pillar: opens on the press whenever the game can honour it |
| 12 | Player switches cats repeatedly to chain Switch Grace | Grace is granted at most once per 3 s | Not a defence mechanic |
| 13 | Player stays on a roof to wait for Paws | Perched after 4 s: passive fill stops and ranged/climbing enemies converge | Anti-stall |
| 14 | Enemy pushed outside the ring | It walks back in. Leaving the ring never Routs an enemy, and it can still be hit while outside | Leash, not a wall |
| 15 | Posse cat knocked out of the ring or off the map edge | Level anchors guarantee no lethal drops; a cat that leaves nav is placed at the nearest valid point after Tumble | No falls out of the world |
| 16 | Both the last enemy and the last Posse cat reach 0 Nerve on the same tick | `win`: enemy Routs are resolved first | Ties go to the player |
| 17 | Hiss used on an enemy at ≤15% Nerve that is a Captain | No Back Down; only the interrupt rule applies | Leaders are finished properly |
| 18 | Back Down would Rout the last enemy, who is a tracked Rival Tough | Allowed; `CatRouted` carries `finisher_move = hiss` so Nemesis can record the humiliation | Pillar 4 |
| 19 | The same Fear is triggered three times in one fight | Full, half, then nothing | Anti-lock (CR-16.2) |
| 20 | A recruited Rival in the Posse has a Fear and an enemy activates the matching prop | The Crew cat suffers the rider and Startled 2 s (Posse cats have no Frazzle gauge); `FearTriggered` is emitted for it | Brief: recruits keep their Fears |
| 21 | An enemy has the Outnumbered Fear and the Posse is reduced to two cats | "Only enemy standing" still triggers it; "3 Posse cats within 3 m" cannot | As written in CR-16.2 |
| 22 | Mit denominator is zero or negative (Hide debuffed below 1) | Hide treated as 1; Mit clamps to 0.90 | No division by zero, no over-99% hits |
| 23 | Damage computes below 1 | 1, unless the target is immune or invulnerable (then 0) | Every landed hit shows something |
| 24 | Damage computes above 9,999 | Applied and shown as 9,999 | Brief cap |
| 25 | Type multiplier stack (Style weak × Fear weak) exceeds 1.5 | Clamped to 1.5 | CR-16.3 |
| 26 | An attack hits 6 enemies at once | Pounce gain capped at +100% of PG; hit-stop uses the single highest tier once, not six times | Feel: one beat per action |
| 27 | Bunny-Kick latched to an enemy that gets Routed by another cat | Latch ends; attacker gets 12 ticks of recovery, not the full 26 | Do not punish the player for an ally's success |
| 28 | A Bap is attempted against a red or Yowl attack | Treated as Brace (which red ignores) | Telegraph classes are absolute |
| 29 | Encounter exceeds 120 s (non-Boss) | Fed Up (CR-19.9) | Brief: nothing may stall |
| 30 | Neither side deals damage for 15 s | Enemies forced to attack; Posse +100 Pounce | Same |
| 31 | A wave is due but 10 combatants are present (Sentries) | Wave waits until a slot frees | Brief hard cap |
| 32 | Player Scrams while a Posse cat is pinned | The pinned cat stays pinned for the 1.5 s disengage and can be Routed; the flee still completes | Fleeing has a readable cost |
| 33 | `ambush_by_rival` fires while the player is in a menu or Whisker Sense | Nemesis may not inject during menus (request to Nemesis); in Whisker Sense the yowl-sting also draws a scent arrow | Fairness |
| 34 | A fight starts within 2 m of Haru's House wall | It cannot: the anchor system excludes the safe zone; enemies do not cross the wall (brief §3.2) | Canon |
| 35 | Well-Fed changes max Nerve mid-day | It cannot: applied once at the morning `BondChanged`/day start, removed at sleep | Stable numbers within a day |
| 36 | Mikan gains the third Paw (Life 4) | Gauge cap changes at the next encounter start, never mid-fight | — |
| 37 | Frame rate drops below 30 fps | Simulation keeps fixed 60 Hz steps (up to 4 steps per frame, then slows down rather than skipping); input windows are measured in ticks, never frames rendered | Timing windows must not shrink on weak hardware |
| 38 | Life 9: Mikan is slow by design | Combat needs no special case; the default controlled cat at encounter start is a setting (`start_controlled_slot`) that Crew & Progression may set to the heir | Brief §5.4 |

**Degenerate strategies considered** (Sirlin: is it healthy mastery or a broken equilibrium?)

| Strategy | Assessment | Mitigation |
|---|---|---|
| Never switch; play Mikan only | Viable on Kitten and for Toughs on Alley; loses about half the Posse's Paws to the cap and never builds a full Frazzle bonus | Intended soft incentive. Not blocked |
| Hold every Paw, dump in the Frazzle window, Pile-On at the last second | The intended high-skill line | None needed; the window timer and enemy pressure are the cost |
| Perch on a roof and plink with a Trickster or Yowler | Would be dominant without rules | Perch rule; enemies climb and shoot; crows |
| Fear-lock a Boss with one sprinkler | Would trivialise Swagger | Diminishing Fear rule; prop cooldowns; one-use buckets |
| Turtle behind Brace and Bap everything | Bap is strong (Ruffled + Paws) but only against white and yellow melee, one enemy at a time | Red attacks; Yowl attacks; tokens send two attackers on Alley. Watch in playtest |
| Hang Back three cats to bank Paws for free | They still fill at half rate and take area damage; the player fights 1 vs N meanwhile | Acceptable; it is a real trade |
| Slow Blink spam to read every attack in slow motion | Legitimate and accessible; costs real time, not game time | Accepted. Enemy telegraph minimums are tuned for real time, so this is an assist, not a requirement |
| Scram and re-engage to re-roll Ambush | Enemies reset Nerve; they are alert for 20 s (cannot be Ambushed) after a `player_fled` | Added rule: 20 s alert state |
| Quick Pile-On every Tough for invulnerability | 1.2 s of safety per Frazzle, but other enemies keep acting and it ends the window | Acceptable; it is the reward loop the brief asks for |

---

## Dependencies

Directions: "Combat needs" = this document cannot function without it. "Needs Combat" = the other document consumes something defined here. Other GDDs must list Combat in return; paths are the expected file names and should be corrected when those documents exist.

| System (expected doc) | Direction | Nature of dependency |
|---|---|---|
| Crew & Progression (`design/gdd/crew-progression.md`) | Combat needs | Stat values per cat and level (their curves must hit the brief's neutral frame or `StatRef` and `K` must be re-derived); equipped Moves/Knacks/Zoomies; Mikan's ageing modifiers; `start_controlled_slot` |
| Crew & Progression | Needs Combat | Move/Knack/Zoomies `id` catalogue and Paw costs for learnsets and Lesson pricing; `CatRouted`, `EncounterEnded` for XP and Loyalty; the fact that AI cats' Tactic is stored per cat |
| Nemesis (`design/gdd/nemesis-system.md`) | Combat needs | `RivalCombatProfile`; Fear/Strength ids; known-Fear flags; ambush injection timing; `flee_threshold` |
| Nemesis | Needs Combat | The four combat events; valuation table for every Strength and Fear; Back Down and Hiss Routs as Memory material; Swagger by rank |
| Territory & Economy (`design/gdd/territory-economy.md`) | Needs Combat | `EncounterEnded`; Sentries participating in `raid_defence` use Combat's AI and can be Routed here |
| Territory & Economy | Combat needs | `patch_id`, Sentry list for a raided Patch |
| Narrative (`design/narrative/`) | Combat needs | `BondChanged` for Well-Fed; Boss personalities to align Boss hooks |
| Level design (`design/levels/`) | Combat needs | Arena anchors, High Road ledges, prop placement, Shoo lanes, Den arenas |
| UX (`design/ux/hud.md`, Slow Blink menu spec, `design/accessibility-requirements.md`) | Combat needs | Final controls map; HUD; Slow Blink menu; accessibility presentation |
| UX | Needs Combat | Action list, timing contract, the data list in UI Requirements, the option list in CR-20.2 |
| Art (art bible, VFX language) | Needs Combat | All durations, tiers and budgets in Game Feel; telegraph class shapes; Swagger/Ruffled/Frazzled must be distinguishable by pose |
| Audio | Needs Combat | Tier events for sync; `EncounterStarted`, `FearTriggered`; yowl-sting timing for ambush (60 ticks) |
| Clock (brief §5) | Combat needs / Needs Combat | `PhaseChanged`; Combat pauses the day clock during encounters |
| Registry (`design/registry/entities.yaml`) | Needs Combat | Not yet updated by this pass; candidates are listed under Cross-References |

---

## Tuning Knobs

All values live in external data (`assets/data/combat/`), never in code. Category: **F** = feel (tune by hand in playtests), **C** = curve (tune by model), **G** = gate (tune to pacing targets).

| Parameter | Current | Safe range | Cat. | Effect of increase | Effect of decrease |
|---|---|---|---|---|---|
| `input_buffer_ticks` | 10 | 6–14 | F | More forgiving, mushier | Crisper, more dropped inputs |
| Basic-attack frame data (CR-3) | per table | ±25% per value | F | Slower, weightier | Faster, lighter, higher output |
| Basic-attack MV (Scrapper string) | 0.85 / 0.85 / 0.95 / 1.15 | 0.7–1.3 | C | Shorter fights | Longer fights; must stay in the brief's 8–12 / 170–230 band |
| `skitter_iframes_base` | 10 | 8–14 | F | Easier dodging | Harder |
| `hairs_breadth_window` | 6 | 4–9 | F | More Hair's-Breadth, more Paws | Rarer, more prestigious |
| `bap_window_ticks` | 8 | 5–12 | F | Parry-centric play | Brace-centric play |
| `brace_block` | 0.60 | 0.4–0.8 | C | Turtling stronger | Dodging preferred |
| `hiss_cooldown_s` | 10 (Yowler 5) | 6–15 | G | Fewer interrupts; yellow attacks more threatening | Interrupt spam |
| `back_down_threshold` | 0.15 | 0.05–0.25 | G | Faster clean-up | Every Tough must be hit to zero |
| `perch_limit_s` | 4 | 3–8 | G | More rooftop play | Roofs are for Pounces only |
| `paw_passive_seconds` | 14 | 10–20 (brief fixes 14) | G | Slower command rhythm | Faster |
| `PG` per hit | per table | ±50% | C | More commands per fight | Fewer |
| `ai_pounce_mult` | 0.50 (brief) | 0.35–0.70 | G | Less need to switch | More need |
| `start_pounce_points` | 50 | 0–100 | G | Earlier first command | Slower opening |
| `slow_blink_timescale` | 0.05 (brief) | 0–0.10 | F | Less thinking time | Full pause |
| `ai_posture_seconds` | 2.5–4.0 | 1.5–6.0 | C | AI cats contribute less; player matters more | AI wins fights; shorter TTK |
| AI defence chances (CR-10.2) | 50 / 70 / 85% | 30–95% | C | Crew survive unattended | Babysitting |
| `swagger` by rank | 0 / 0.30 / 0.50 / 0.55 | 0–0.60 | C | Longer leader fights; Ruffled worth more | Leaders melt; props matter less |
| `rank_frazzle_res` | 1.0 / 0.20 / 0.08 / 0.06 | Captain 0.12–0.35; Boss 0.05–0.15 | C | Faster Frazzles | Slower |
| `frazzle_decay_per_s` / delay | 3 / 4 s | 0–8 / 2–8 s | C | Punishes disengaging | Gauge is a ratchet |
| `ruffled_seconds` by source | 6 / 6 / 4 / 3 / 3 | 2–10 | G | Longer burst windows | Shorter |
| `frazzled_seconds` | 8 (brief) | 6–12 | G | More dump time | Tighter |
| `frazzle_bonus_start / cap / per_paw` | 1.50 / 2.00 / 0.05 (first two: brief) | per_paw 0.03–0.10 | C | Banking Paws worth more | Flat bonus |
| `harden_step` / max steps | 0.10 / 3 | 0–0.25 / 0–5 | C | Later Frazzles slower | Repeatable loop |
| `pile_on_mv_per_cat` | 1.50 | 1.0–2.5 | C | Pile-On decides fights | Pile-On is a flourish |
| `pile_on_full_ticks / quick_ticks` | 150 / 72 | 120–210 / 48–90 | F | More spectacle, more interruption | Snappier |
| `pile_on_sweep_radius / share` | 3 m / 50% | 2–5 m / 25–100% | C | Rewards grouping Frazzles | Single-target finisher |
| `zoomies_damage_coeff` | 60 | 40–100 | G | Faster charge | Slower; brief target is 2–3 encounters |
| `zoomies_frazzle_award` | 12 / 20 / 30 | ±50% | G | Same | Same |
| Zoomies MV budget | 12 | 9–16 | C | Bigger supers | Smaller |
| `style_weak / style_resist` | 1.25 / 0.75 | 1.1–1.5 / 0.5–0.9 | C | Matchups dominate Posse choice | Matchups cosmetic |
| `crit_mult` | 1.5 | 1.25–2.0 | C | Prowler burst up | Down |
| Move budget (CR-17.1) | 3.5 / 8.0 MV | 3.0–4.0 / 7.0–9.0 (brief) | C | Moves dominate basics | Basics dominate |
| `K_dmg` endpoints | 2.00 / 2.50 | 1.6–3.0 | C | All damage up | Down |
| `K_heal` endpoints | 1.00 / 1.5625 | ±30% | C | Healing sustains fights (stall risk) | Healing irrelevant |
| `lick_wounds_fraction` | 0.25 | 0–0.5 | G | Fewer Sunspot trips | More attrition pressure toward home (Pillar 2 lever) |
| `shake_it_off_fraction` | 0.20 | 0.1–0.5 | G | Softer | Harsher |
| Attack tokens (CR-18.2) | per table | 1–4 | G | More simultaneous threats | Duel-like |
| Telegraph minimums | 18 / 45 / 60 ticks | 14–30 / 36–60 / 48–90 | F | Easier reads | Twitchier |
| Enemy Paw seconds | 16 / 9 / 6 | 6–24 | G | Fewer enemy Moves | More |
| Phase thresholds | 70 / 35% | any | G | — | — |
| `phase_break_seconds` | 3–4 | 2–6 | F | More spectacle | Less downtime |
| Threat budgets (CR-19.4) | per table | ±1 | G | Longer, busier fights | Shorter |
| `ring_diameter_m` | 12 (brief) | 10–16 | F | More room, less readable | Tighter |
| `fed_up_seconds` | 120 | 90–180 | G | Later rescue | Earlier |
| `scram_hold_s` | 3 | 2–5 | G | Harder to flee | Easier |
| Difficulty multipliers (CR-20.1) | per table | Nerve 0.6–1.5; damage 0.4–1.75 | G | — | — |
| `damage_variance` | 0 | 0–0.05 | F | Numbers look organic | Deterministic |
| All Game Feel tier values | per table below | per table | F | — | — |

---

## Visual/Audio Requirements

Art owns the look and Audio the sound; this table lists what must exist and how important it is. Timings are in Game Feel.

| Event | Visual feedback | Audio feedback | Priority |
|---|---|---|---|
| Any hit | Type-coloured hit spark at contact (Claw: three slashes; Fang: two points; Thump: paw-print; Yowl: ring) | Impact per type and tier | Must |
| Weak / resisted hit | Larger spark with a type-coloured ring / dull grey spark | Bright chime / thud | Must |
| Telegraph classes | White arc, yellow dashed area with triangle glyph, red filling area; matching poses | Rising cue per class, distinct by rhythm not only pitch | Must |
| Swagger on / off | Tail-up strut and outline glint / tail drops, ears flatten | Small "deflate" sting on loss | Must |
| Ruffled | Fur half-raised, sweat-drop glyphs, gauge pulses | Tense string tremolo layer | Must |
| Frazzled | Fur fully puffed, stars and spirals overhead, gauge ring countdown | Cymbal swell, then a ticking layer for 8 s | Must |
| Paw filled | Paw-pad segment pops with a bounce on the HUD and a small glow at the cat's feet | Soft "pap"; a different pitch per Posse slot | Must |
| Slow Blink | Desaturate 30%, vignette, the selected cat's eyes half-close | Low-pass on the mix; a slow two-note "blink" | Must |
| Hair's-Breadth | After-image of the cat, whisker-line streaks | Reverse cymbal, brief silence | Must |
| Bap | Paw-print glyph, attacker's head snaps aside | Wood-block "bap" | Must |
| Hiss / interrupt | Cone of jagged lines; a cracked triangle glyph over the interrupted enemy | Per-Style hiss; glass-crack sting on interrupt | Must |
| Back Down / Rout | Dust puff, the cat bolts along a speed-line trail to the ring edge | Yelp and scamper | Must |
| Pile-On | The dust cloud: stars, paws, tails, claw glyphs flying out; cut-in panel | Scuffle loop, drum roll, final hit | Must (signature image) |
| Zoomies | Cut-in panel, full action lines, Style-specific sequence | Per-cat vocal, brass stab | Must |
| Fear triggered | Fear icon bursts over the cat; prop-specific effect (splash, sound rings) | Prop sound, the cat's startled yowl | Must |
| Righting / Splat | Mid-air twist with a sparkle / flat pancake squash and dust | Light "tup" / comic thud | Should |
| Posse identification | Bell-gold outline tick on the four Posse cats; enemies outlined in Clowder colour (brief §7); controlled cat has a ground ring | — | Must |
| Posturing | Arched back, sideways shuffle, tail flicks | Low growl loops | Should |
| Phase break | Arena change, Boss tantrum, cut-in panel | Music layer change, the Boss's yowl-sting | Must |

No blood, wounds or gore under any tier (brief §9). Hurt is shown with sticking-plaster and dizzy-star glyphs only.

---

## Game Feel

### Feel Reference

- **Structure and rhythm**: Final Fantasy VII Remake's loop of basic strings into a slowed command menu into a stagger payoff. Ours is compressed to a third of the length and with a single shared finisher.
- **Impact language**: the freeze-frame, radial-line, two-tone impact panels of action manga and anime, applied to four-kilogram animals: an exaggeration gag as much as a power fantasy.
- **The dust cloud**: classic newspaper-strip and cartoon brawl clouds.
- **Anti-references**: NOT floaty or weightless (hits must stop the attacker's animation); NOT a particle soup in which the player's cat is lost (brief risk 4); NOT realistic animal violence.

How the FF7 Remake details were checked for this draft:

| Detail adapted | Verified by web search on 2026-11-23? | Source |
|---|---|---|
| ATB fills slowly over time and faster from attacking and guarding; gates commands | Yes | [TheGamer combat guide](https://www.thegamer.com/final-fantasy-7-remake-complete-combat-guide/), [Fextralife: Combat](https://finalfantasy7remake.wiki.fextralife.com/Combat) |
| Limit gauge fills from taking damage and staggering; limits do not consume ATB | Yes | [Inverse combat guide](https://www.inverse.com/gaming/final-fantasy-7-remake-combat-guide-tips-materia-weapons-stagger-atb), [Fextralife: Limit Break](https://finalfantasy7remake.wiki.fextralife.com/Limit+Break) |
| Pressured enemies fill the stagger gauge much faster; each enemy has its own way to be pressured | Yes | [Final Fantasy Wiki: Stagger (VII Remake)](https://finalfantasy.fandom.com/wiki/Stagger_(VII_Remake)), [G2A guide](https://www.g2a.com/news/features/guide/final-fantasy-vii-remake-combat-guide/) |
| Stagger damage bonus starts at 160% and specific abilities raise it (to 200–300%) | Yes | [RPG Site](https://www.rpgsite.net/feature/9641-final-fantasy-vii-remake-how-to-increase-stagger-bonus-to-200-and-300), [Game Rant](https://gamerant.com/final-fantasy-7-remake-stagger-200-300-damage-bonus-effect-pt-3-staggering-feat/) |
| AI-controlled allies build ATB more slowly than the controlled character | **Not confirmed by the searches run**; taken from the designer's recollection and from the brief, which sets our value (50%) independently | — |
| Shortcut commands on a held shoulder button; two ATB segments by default; guard-counter stances | **Not confirmed by the searches run**; recollection only | — |

Our numbers differ deliberately from the reference where the brief says so (bonus 150% → 200% cap instead of 160% → 300%; 60-second fights).

### Input Responsiveness

Latency is from the input sample to the first changed frame of animation, at 60 fps. At 30 fps rendering the simulation response is identical; the visible response may be one rendered frame (33 ms) later.

| Action | Max latency (ms) | Frame budget (60 fps) | Notes |
|---|---|---|---|
| Slow Blink open | 16 | 1 | Time-scale changes on the tick of the press; menu art may animate in over 6 ticks but is interactive at once |
| Switch cat | 50 | 3 | Control transfers by tick 3; camera follows over 15 |
| Skitter | 33 | 2 | Invulnerable from tick 2 |
| Brace | 16 | 1 | Active the tick after the press |
| Swipe (from neutral) | 50 | 3 | First pose change by tick 3; hit on tick 5–7 |
| Whack | 50 | 3 | Anticipation pose must read by tick 3 even though the hit is tick 14+ |
| Hop | 50 | 3 | |
| Hiss | 50 | 3 | |
| Shortcut Move | 50 | 3 | |
| Pile-On / Zoomies trigger | 33 | 2 | Freeze-frame begins by tick 2 |
| Target switch | 33 | 2 | |

### Animation Feel Targets

Basic-attack frame data is in CR-3. Additional targets:

| Animation | Startup | Active | Recovery | Feel goal | Notes |
|---|---|---|---|---|---|
| Swipe 1–3 (Scrapper) | 5–6 | 3 | 14–17 | Snappy, low commitment | 1-tick claw-arc smear on each |
| Swipe 4 | 12 | 4 | 24 | A full stop at the end of a sentence | 2-tick smear; attacker slides 0.3 m |
| Rake | 14 | 4 | 26 | Committed lunge | Anticipation squash on ticks 1–8 |
| Cuff (Bruiser) | 9–16 | 4–5 | 19–29 | Heavy, the ground notices | Dust on every Cuff |
| Flop | 20 | 5 | 30 | Maximum weight; brief hang at the apex (4 ticks) | Armoured |
| Nip (Prowler) | 4 | 2 | 12 | The fastest thing on screen | After-image instead of smear |
| Skitter | 1 | 10 (invulnerable) | 11 | Instant, low to the ground | Stretch on tick 1, dust at origin |
| Brace | 1 | held | 6 on release | Solid loaf | |
| Bap | 0 | 1 | 10 | A dismissive smack | Attacker's reaction sells it |
| Hop / mantle | 3 | 18 | 3 | Effortless | No landing lag on a successful mantle |
| Pounce | 6 | up to 18 travel + 4 | 20 | Predatory arc, hard landing | Wiggle on startup (the pre-pounce bottom wiggle, 6 ticks) |
| Hiss | 6 | 12 | 14 | Whole body commits | |
| Move (typical 1 Paw) | 8–20 to commit | 6–40 | 16–30 | The cat poses, then the world reacts | Cut-in flash 6 ticks on commit |
| Routed | — | — | 40 to exit | Comic, never pitiful | Legs spin before traction |

### Impact Moments

Events are grouped into six tiers. Every value scales with the accessibility sliders (CR-20.2). Shake amplitude is peak camera displacement as a **percentage of viewport height**; shake is directional (along the hit vector projected to screen), with exponential decay. Hit-stop is in ticks (ms). "Local" hit-stop freezes only attacker and victim; "global" freezes the simulation.

**Tier assignment**

| Tier | Events |
|---|---|
| **T0** | Whiff; hit on a prop; blocked hit (Brace) |
| **T1** | Light basic hit (Swipe 1–3, Nip, Yap, Flick, Cuff 1–2); multi-hit Move intermediate hits |
| **T2** | String finisher; Whack; Pounce; Bap on a Tough; fall Splat |
| **T3** | 1-Paw Move main hit; Counter-Pounce; Bap on a Captain or above; Fear trigger; interrupt by Hiss |
| **T4** | 2-Paw Move main hit; the hit that Frazzles; any Rout of a Tough or Critter; Back Down |
| **T5** | Pile-On; Zoomies; Boss phase break; Rout of a Captain or Boss; the final Rout of an encounter |

**Per-tier values (outgoing: the Posse hits an enemy)**

| Effect | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| Hit-stop, attacker (ticks / ms) | 0 | 2 / 33 | 4 / 67 | 6 / 100 | 9 / 150 | 14 / 233 freeze, then authored |
| Hit-stop, victim (ticks / ms) | 1 / 17 | 3 / 50 | 6 / 100 | 9 / 150 | 12 / 200 | 14 / 233 |
| Hit-stop scope | Local | Local | Local | Local | **Global** | Global |
| Victim shake during hit-stop (model jitter) | — | 2 cm | 3 cm | 4 cm | 6 cm | 8 cm |
| Screen shake amplitude (% viewport height) | 0 | 0.15 | 0.40 | 0.70 | 1.10 | 1.60 |
| Screen shake duration (ms) | 0 | 80 | 140 | 200 | 300 | 450 |
| Screen shake frequency (Hz) | — | 30 | 28 | 24 | 20 | 16 |
| Camera punch-in (dolly, % of distance) / in-out (ms) | — | — | 1.5 / 50–120 | 3 / 60–160 | 6 / 80–260 | 12–20 authored |
| Time-scale dip after hit-stop | — | — | — | — | 30% for 12 ticks | 20% for 30 ticks (final Rout only) |
| Smear frames (ticks) | 1 | 1 | 2 | 3 | 3 | 4 |
| Action / speed lines | — | — | Local streak behind the attacker, 6 ticks | Radial lines on 20% of the screen edge, 8 ticks | Radial lines on 40%, 12 ticks | Full-screen radial lines, 18 ticks, plus cut-in panel |
| Impact frame (two-tone inverted flash) | — | — | — | 1 tick, limited to a 3 m world-space disc | 2 ticks, full screen | 3 ticks, full screen |
| Glyph burst (paw-print and claw-slash, never letters) | — | 1 small spark only | 1 glyph, 0.6 m | 2–3 glyphs, 1.0 m | 4–5 glyphs + stars, 1.6 m | Screen-space giant glyph, 30% of screen height, 20 ticks |
| Dust | 2 puffs at feet | 3-puff ring, 0.4 m | 5-puff ring, 0.8 m | Ring + trail, 1.2 m | Ring + ground crack decal, 2.0 m | Pile-On cloud 3 m radius (Full) / 2 m (Quick) |
| Victim knockback pose hold (ticks) | 0 | 2 | 4 | 6 | 10 | Authored |
| Rumble: low motor / high motor (0–1) | 0 / 0.10 | 0 / 0.25 | 0.35 / 0.30 | 0.55 / 0.50 | 0.85 / 0.70 | 1.0 / 1.0 |
| Rumble duration (ms) | 20 | 40 | 90 | 140 | 220 | 600, patterned: 3 pulses then a long decay |

**Incoming (an enemy hits the controlled cat)** uses the same tier by the enemy attack's class (white = T1/T2, yellow = T3, red = T4, enemy Zoomies = T5) with these changes: hit-stop is local and 75% as long; shake amplitude ×1.2 and non-directional for red; rumble emphasises the low motor (+0.15); a 150 ms coral vignette pulse at the screen edge replaces the impact frame; damage to an AI Posse cat uses the tier two steps lower with no screen shake.

**Special moments**

| Moment | Spec |
|---|---|
| Hair's-Breadth | No hit-stop. World 30% time-scale for 21 real ticks; after-image trail of 4 ghosts; 0.3% shake; rumble 0 / 0.4 for 60 ms; audio ducks 6 dB |
| Slow Blink open / close | No shake. Dolly per CR-6.3 over 9 ticks; rumble 0.15 / 0 for 50 ms on open; action lines freeze in place as static streaks while it is open |
| Frazzle break (the filling hit) | T4 plus: gauge shatters into star glyphs; victim hangs in a 10-tick puffed-up pose; every Posse cat's outline flashes bell-gold for 12 ticks to cue Pile-On |
| Full Pile-On (150 ticks) | Ticks 0–14: global freeze, 3-tick impact frame, cut-in panel of all four cats. 15–35: cats leap in along thick speed lines, punch-in 20%. 36–125: cloud, with a 0.5% continuous 12 Hz rumble-shake and four **beats** (one per participating cat, 22 ticks apart), each a T3 hit with its damage number. 126–135: final beat, T5 shake. 136–150: cloud pops into star glyphs, the victim tumbles out (or is Routed), camera eases out |
| Quick Pile-On (72 ticks) | Ticks 0–8 freeze and 2-tick impact frame; 9–20 leap; 21–60 cloud with all beats compressed to 10-tick spacing as T2; 61–72 pop. No cut-in panel |
| Zoomies | 36 real ticks at 10% time-scale with cut-in panel and full action lines; then Style sequence in which the first hit is T4 and the last is T5, intermediate hits T1–T2 |
| Rout (Tough) | T4, then the dust puff and a 40-tick comic scramble exit |
| Final Rout | T5 with 20% time-scale for 30 ticks, the losing cat's silhouette held against radial lines |
| Boss phase break | T5 freeze, 3–4 s authored tantrum, arena change |
| Loss (last Posse cat Routed) | No celebration tiers. Time-scale 40% for 40 ticks, colour drains 50%, a single low drum. Kept short and dry: the sting belongs to Nemesis |

**Budget and priority rules (these protect readability, brief risk 4)**

1. **One screen-wide effect at a time.** Full-screen impact frames, full-screen action lines, cut-in panels and giant glyphs share one channel; a higher tier pre-empts a lower one; equal tiers queue with a minimum 10-tick gap.
2. **Global hit-stop budget**: at most 24 ticks of global freeze in any rolling 60 ticks outside T5 sequences. Excess is dropped, not queued.
3. **Shake is a trauma accumulator**, not a sum: new shake raises trauma toward the tier's value; total displacement is capped at 1.8% of viewport height (1.4% on handheld).
4. **Player authorship rule**: hits from AI Posse cats acting on their own are shown **one tier lower** and never produce global hit-stop or full-screen effects. Hits from any cat acting on a **player command** are shown at full tier. The biggest feedback on screen is always something the player did or ordered.
5. **Multi-hit Moves**: only the first hit and the final hit use the Move's tier; hits between them are T1.
6. **Multi-target hits**: one hit-stop and one shake for the whole attack at the highest applicable tier; each victim gets its own spark and glyph.
7. **Particle ceilings per encounter** (for Art and tech art to refine): dust puffs alive ≤ 60; glyphs alive ≤ 24; no particle may cover the controlled cat's ground ring or any active telegraph shape; telegraph decals draw above all dust.
8. **Photosensitivity**: CR-20.3 limits apply before any other rule.
9. **Handheld**: shake ×0.8, glyph size ×1.2, punch-in unchanged.

### Weight and Responsiveness Profile

- **Weight**: light on the feet, heavy on contact. Movement is instant and arcade-like; hits stop the attacker dead for a moment. A four-kilogram cat should hit like a thrown sofa cushion full of bricks.
- **Player control**: high. Lights can be dodge-cancelled on any non-active tick; only Whacks, Bunny-Kick and Moves commit the player, and each announces that it will. Slow Blink and switching are never refused except inside a cinematic.
- **Snap quality**: crisp and binary. States change on a tick with a pose, not a blend; stretch and squash sell the motion.
- **Acceleration model**: arcade. Full speed in 4 ticks, stop in 3, instant turns. No momentum to manage.
- **Failure texture**: fair. Every hit taken was announced by a class-coded telegraph with a guaranteed minimum length; a failed Bap is still a Brace; an interrupted Move refunds its Paws. When the player loses, the read should be "I got greedy during a red" or "I let the Yowler heal", never "I could not see" or "the cat did not obey".

### Feel Acceptance Criteria

- [ ] Playtesters describe hits with weight words ("crunchy", "punchy", "thwack") unprompted in at least 4 of 5 sessions.
- [ ] No playtester uses "floaty", "mushy", "laggy" or "stuttery" about attacks or hit-stop.
- [ ] At no point in a recorded 10-combatant fight can a reviewer pausing the footage at random fail to find the controlled cat within one second (20 random pauses, 19 passes required).
- [ ] The first Full Pile-On a new player triggers produces a visible or audible reaction (laugh, exclamation) in at least 4 of 5 testers.
- [ ] Testers can name which telegraph class hit them after being hit, in at least 80% of prompted cases.
- [ ] Slow Blink "feels instant" to every tester; none reports waiting for the menu.
- [ ] With shake at 0%, hit-stop off and flash reduction on, testers still rate hits as "clearly registering" (the feel must not depend on effects some players will disable).
- [ ] Playtesters report that the biggest moments felt like "something I did", not something the AI cats did.

---

## UI Requirements

UX owns layout and visual design; these are the data and timing requirements.

| Information | Display location | Update frequency | Condition |
|---|---|---|---|
| Each Posse cat: portrait, Nerve bar, Pounce Gauge as paw-pad segments with partial fill, Zoomies gauge, status icons (max 3), current Tactic icon, queued-command icon | Posse panel, one row per slot matching the D-pad direction | Every tick | In an encounter |
| Controlled-cat marker | Ground ring under the cat and highlight on its panel row | On switch | In an encounter |
| Shortcut map (4 Moves, costs, affordability) | Overlay near the controlled cat's row | While L1 held | In an encounter |
| Enemy Nerve bar, Frazzle gauge, state (Swagger / Ruffled / Frazzled with window ring and bonus %), status icons | Over the hard-lock target (full); thin bars over other enemies; all enemies in Slow Blink | Every tick | Enemy within the ring |
| Rival name and Title | With the locked enemy's bar; Standoff name-card | On lock | Rivals only (content from Nemesis) |
| Telegraph shapes | World-space decals | Every tick | Always above dust |
| Off-screen combatant and attack indicators | Screen edge | Every tick | Off-screen only |
| Pile-On prompt | Centre-bottom, pulsing, with the chord glyph | While available | CR-12.1 |
| Zoomies ready prompt | On that cat's row; chord glyph for the controlled cat | While full | |
| Damage and heal numbers | World-space at the hit, type-coloured, larger for crit / weak, capped at 9,999 | Per hit | Option to hide |
| Known Fears and Style weak/resist icons | Slow Blink target panel; also on the lock-on bar as small icons | On target change | Fears only if known |
| Prop highlights | World-space outline | While Whisker Sense held or in Slow Blink | In an encounter |
| Scram countdown | Ring edge and centre-top | Every tick | Controlled cat outside the ring |
| Perched warning | Icon on the cat's row and over the cat | On state | |
| Ring boundary | World-space scuffed ring in the two Clowders' colours | Static | In an encounter |
| Slow Blink menu | UX spec | On the tick of the press | CR-8 |

All text in these elements is system UI (localised, readable); no human-language text appears in the world (brief §5.5). Every element must be legible on a handheld screen.

---

## Cross-References

| This document references | Target | Specific element referenced | Nature |
|---|---|---|---|
| Stat frame, Nerve multipliers, TTK targets, Paw rates, Frazzle and Slow Blink constants, slot counts, difficulty mode names | `design/creative-brief.md` §8 | Shared numeric frame | Rule dependency |
| Event names and payloads | `design/creative-brief.md` §6.1 | `EncounterStarted`, `CatRouted`, `FearTriggered`, `EncounterEnded`, `BondChanged`, `PhaseChanged` | Data dependency |
| Ownership boundaries | `design/creative-brief.md` §6 | Ownership table | Rule dependency |
| Camera canon and ring size | `design/creative-brief.md` §4 | Pitch 55°, fixed yaw, 12 m ring | Rule dependency |
| Pillar 3 design test (status count, 90 s limit) | `design/gdd/game-pillars.md` | Conduct the Brawl | Rule dependency |
| Stat values, growth curves, learnsets, slot rules, Mikan's ageing | Crew & Progression GDD (not yet written) | Per-cat `stats`, `moves[4]`, `knacks[2]`, `zoomies` | Data dependency |
| Rival data at fight start | Nemesis GDD (not yet written) | `RivalCombatProfile` query | Data dependency |
| Fear and Strength catalogue | Nemesis GDD | Trait ids and which are known | Data dependency |
| Verdict after a Rout | Nemesis GDD | Verdict flow after `EncounterEnded` | Ownership handoff |
| Loss consequences (Morsels, day end, promotion) | `design/creative-brief.md` §6.1; Economy and Nemesis GDDs | Loss penalty | Ownership handoff |
| Sunspot heal, Routed Crew recovery | `design/creative-brief.md` §3.2, §6.1 | Sunspot nap | Rule dependency |
| Well-Fed | Narrative (Bond) and brief §8 | +2% max Nerve per heart | Data dependency |
| Sentries in `raid_defence` | Territory & Economy GDD (not yet written) | Sentry list per Patch | Data dependency |
| Arena anchors and props | Level design docs (not yet written) | Anchor and prop placement | Rule dependency |
| HUD, Slow Blink menu, controls map, accessibility | UX specs (not yet written); `design/accessibility-requirements.md` | Screens and bindings | Ownership handoff |

**Registry candidates** (`design/registry/entities.yaml` is an empty stub and was not edited in this pass): constants `ai_pounce_mult 0.5`, `slow_blink_timescale 0.05`, `frazzled_seconds 8`, `frazzle_bonus_start 1.5`, `frazzle_bonus_cap 2.0`, `swagger_by_rank`, `rank_frazzle_res`, `back_down_threshold`, `lick_wounds_fraction`; formulas F-1 (damage), F-2 (heal), F-3 (Frazzle gain), F-9 (Zoomies gain).

---

## Acceptance Criteria

**Functional (automatable unless marked)**

- [ ] F-1 reproduces worked examples A–D exactly: 8 and 11 (Lv 1), 170 and 230 (Lv 50), 4,760 (example C), 18 / 26 / 40 (example D).
- [ ] No hit in the shipped catalogue can exceed 9,999 under maximum legal modifiers; the ceiling line (8,400) is covered by a test that fails if a new Move or modifier breaks it.
- [ ] F-2: Purr heals 30 at Lv 1 and 750 at Lv 50 with neutral Voice.
- [ ] F-3: a Scrapper string adds 40 Frazzle to a Tough, 8 to a Captain, 16 to a Ruffled Captain, 3.2 to a Boss.
- [ ] F-4: eight Paws spent on a Frazzled target give a bonus of 1.90; Shred among them gives 2.00; the value never exceeds 2.00.
- [ ] F-6: an idle player-controlled cat at baseline Zip gains exactly 1 Paw in 14.0 s; an AI-controlled one in 28.0 s; the rate changes on the tick of a switch.
- [ ] A scripted "sustained offence" bot (Scrapper, 70% uptime) earns 1 Paw every 6.0–7.0 s.
- [ ] Slow Blink sets time-scale to 0.05 on the same tick as the input in every cat state except T5 cinematics.
- [ ] Paws are deducted on the commit tick and never when a Move is interrupted earlier; reserved Paws cannot be double-spent across Slow Blink and shortcuts.
- [ ] Switching control completes within 3 ticks; Switch Grace cannot be granted twice within 3 s.
- [ ] Ruffled doubles Frazzle gain and removes Swagger; re-application never stacks; Frazzled lasts exactly 480 ticks unless ended by a Pile-On or phase gate.
- [ ] Pile-On is offered if and only if CR-12.1 holds; it costs no Paws; it ends the Frazzled state; swept enemies take 50%.
- [ ] Zoomies gauges persist across encounters in a day and are zero after sleep.
- [ ] `EncounterStarted`, `CatRouted`, `FearTriggered` and `EncounterEnded` are emitted with every field of the brief's minimum payload, once each per occurrence, in causal order (`CatRouted` for the last victim precedes `EncounterEnded`).
- [ ] A Hiss Routs a Tough at 15% Nerve and not at 16%; never Routs a Captain.
- [ ] The same Fear on the same cat yields 6 s, 3 s, 0 s of Ruffled across three triggers in one encounter.
- [ ] No enemy attack in data has a windup shorter than its class minimum; an automated data check enforces it.
- [ ] Never more than 10 combatants are active; waves wait for a free slot.
- [ ] A non-Boss encounter that reaches 120 s applies Fed Up; a 15 s no-damage period triggers CR-19.9.4.
- [ ] Difficulty modes change only the parameters listed in CR-20.1 (a diff of the three mode data files shows no other keys).
- [ ] All input windows are defined and tested in ticks; results are identical at 30 and 60 fps rendering.
- [ ] Performance: with 10 combatants and worst-case effects, the combat simulation step completes within 2.0 ms on the handheld target (provisional budget; to be confirmed once the engine is chosen).
- [ ] No gameplay value from this document is hardcoded; every number in Tuning Knobs resolves from `assets/data/combat/`.

**Experiential (playtest)**

- [ ] MVP question (brief §10): at least 4 of 5 testers choose to keep playing the grey-box arena past 20 minutes.
- [ ] Median Alley encounter against 3–5 same-level Toughs lasts 45–90 s of game time; median time to Rout one Tough under player focus is 8–12 s; Captain 45–75 s; Boss 3–5 min. (If the model in F-10 is right, these will fail short on the first build; that is the first tuning pass.)
- [ ] In a 20-minute session, testers switch the controlled cat at least once per encounter on average and issue at least 40% of all Moves to cats they are not controlling.
- [ ] At least 80% of Frazzles on Captains end in a Pile-On.
- [ ] Testers use a prop against a Fear at least once without being told how, in a fight where Whisker Sense has revealed the Fear.
- [ ] AI Posse cats account for 25–40% of total damage dealt on Alley; fewer than one unprompted complaint per five sessions that Crew "die on their own" or "do nothing".
- [ ] A normal Alley encounter costs the Posse 15–25% of its total Nerve.
- [ ] Zoomies are available about once every 2–3 normal encounters per cat.
- [ ] All Feel Acceptance Criteria in the Game Feel section pass.

---

## Assumptions for creative-director review

Decisions taken inside Combat's boundary that the brief does not cover. None renames or redefines a canon term.

1. **New named terms**: Swipe, Whack (and per-Style names Rake, Bunny-Kick, Cuff, Flop, Sit, Nip, Slink, Yap, Screech, Flick, Kick Dirt), Skitter, Hair's-Breadth, Counter-Pounce, Brace, Bap, Hop, Pounce (the dive attack; shares its word with the Pounce Gauge on purpose), Righting, Tumble, Splat, Perched, Hiss (as a universal action), Back Down, **Swagger**, Shaking Off, Startled, Ears Up, Scram, Lick Wounds, Shake It Off, Fed Up, Shoo, Tactics (Shadow Me, Scrap, Mind the Others, Hang Back), Auto-Scrap, the five statuses (Cowed, Soggy, Dirt-Eyed, Tangled, Spooked) and two buffs (Purring, Fired Up), Style passives (Heft, Flurry, Opportunist, Big Voice, Butterpaws), and every Move, Knack and Zoomies name in CR-13 and CR-17.
2. **Swagger** is a new rank-based damage reduction on Captains and Bosses. It is the main lever used to approach the brief's time-to-Rout targets and it changes how leaders feel to fight.
3. **Style weak/resist table** (CR-14.2) and the decision that Trickster sits outside the ring.
4. **No random crits.**
5. **No in-fight revival**, following the brief's "recover at the next Sunspot or at home"; **Mikan alone** gets up at 20% Nerve after a won fight; survivors recover 25% of missing Nerve after each win.
6. **Nerve persists between encounters** within a day (inferred from the Sunspot's "full Posse heal").
7. **Fleeing is free** from Combat's side and allowed in Boss fights.
8. **`RivalCombatProfile` additions requested from Nemesis**: `flee_threshold` (optional), `rank` (for Swagger and Frazzle resistance), per-Fear `known_to_player`, and an optional `is_nemesis` flag for the once-per-fight Captain Zoomies.
9. **Request to Nemesis**: no `ambush_by_rival` injection while a menu is open. Combat itself applies a 20 s alert state (no Ambush) to a group after `player_fled`.
10. **Request to Crew & Progression**: per-cat stored Tactic and toggles; `start_controlled_slot`; confirmation that the neutral stat curve is linear between the brief's endpoints (otherwise `StatRef` must be replaced).
11. **Request to Level design**: arena anchors with at least two props and one High Road ledge each.
12. **Sentries** joining `raid_defence` as uncontrollable allies who cannot join a Pile-On.
13. **Boss hooks** in CR-18.6 are mechanical proposals only; Botan's Style is left to Nemesis and Narrative.
14. **Rank-set enemy damage** is not separately scaled in this draft (an enemy Tough hits as hard as a Crew cat of its level); see Open Questions 6.
15. Default **bindings** are a proposal to UX.

---

## Open Questions / Known Weak Spots

Listed in order of how much they could change the design. Nothing here has been prototyped; every number in this document is a paper starting value.

| # | Question / weak spot | Why it matters | Owner | Deadline | Resolution |
|---|---|---|---|---|---|
| 1 | **The brief's numbers do not agree with each other on fight length, and this draft only partly closes the gap.** A basic hit is fixed at 8–10% of a same-level cat's Nerve and a 1-Paw Move at 3–4 hits, with about one Paw every 3–3.5 s across the Posse. That output Routs a ×4 Captain in well under 45 s and a ×12 Boss in under 3 min unless something absorbs it. This draft adds Swagger, enemy defence, phase breaks and deliberately low AI cadence, and the paper model (F-10) still lands at or below the low end of every target. | Either fights are shorter than the brief wants, or leaders need more Nerve, or the Posse needs less output. Each choice changes feel. | creative-director + game-designer | Before MVP tuning | Options: (a) accept shorter fights (Captain 30–50 s, Boss 2.5–3.5 min), which suits Pillar 3; (b) raise Captain/Boss Nerve multipliers in the brief; (c) raise Swagger; (d) slow AI cats further. Recommendation: (a) first, measure in the prototype, then (b) if needed. Not (c): see 2 |
| 2 | **Swagger may read as a hidden sponge.** It is the same idea as the reference game's resistant-until-pressured enemies, but at 50% on Bosses the un-Ruffled stretches could feel like chip damage. | Pillar 3 forbids sponges and menu-only depth. | game-designer | MVP playtest | Needs a build. Fallback: cut Swagger to 0 / 0.15 / 0.30 and make up the time with Nerve |
| 3 | **Is the control set too large?** Swipe, Whack, Hop, Skitter, Brace/Bap, Hiss, shortcuts, Slow Blink, switch, lock-on, Pile-On, Zoomies, plus Righting and Pounce contexts. The reference game has fewer verbs per character. | Onboarding load; handheld ergonomics; chords (L1+R1, L3+R3) are accessibility problems. | game-designer + ux-designer | Vertical slice | CR-21 staggers introduction across Lives 1–2. Candidates to cut if testers drown: universal Hiss (make it Yowler-only and move interrupts to Moves), or Bap |
| 4 | **Hiss versus Yowler identity.** A universal free interrupt may make Yowlers feel less special and make yellow telegraphs trivial with four cats Auto-Hissing. | Style distinctness; enemy threat. | game-designer | MVP playtest | Tune cooldown; consider Auto-Hiss default off |
| 5 | **Readability from 10–16 m with ten cats and full effects** is asserted by budget rules, not demonstrated. The tier table is aggressive by request ("to the maximum"); values may need to come down 20–30% on handheld. | Brief risk 4. | game-designer + art-director + technical-artist | Vertical slice | Random-pause test in Feel Acceptance Criteria |
| 6 | **Incoming damage and attrition are unmodelled.** With no in-fight revival and Nerve persisting between fights, the cost of a normal encounter (target 15–25% of Posse Nerve) decides how often the player must nap or go home. Enemy damage has no rank scaling here yet. | Directly drives the Pillar 2 curfew tension; could make days feel punishing or trivial. | game-designer + economy-designer | Before vertical slice | Needs an incoming-DPS model once enemy Move lists exist |
| 7 | **AI Posse competence is specified as percentages, not behaviours.** "Fight competently" needs pathing, target selection ties, formation and how they avoid stealing the player's Bap/Pounce space. | The conductor fantasy fails if Crew look stupid or die unattended. | game-designer + ai-programmer | MVP | Expand CR-10 into a behaviour spec after the first prototype |
| 8 | **Quick Pile-On frequency.** If nearly every Tough ends in one, the signature image may wear thin by hour five; if Toughs die before Frazzling, the 30-second loop in the brief does not happen. | The Pile-On is on the never-cut list. | game-designer | MVP playtest | Tune Tough Frazzle (F-3) and the 72-tick length; possibly vary the cloud by Style mix |
| 9 | **Only 20 of about 60 Moves and 10 of 20 Knacks are defined**, and none has been checked for dominance. Loaf + Big Talk + Purr may make a stall Posse; Vanish + Neck Nip burst may delete Captains. | Balance; Lesson pricing depends on this catalogue. | game-designer + systems-designer | Alpha (16 Moves by vertical slice) | Delegate the remaining catalogue to systems-designer under the CR-17.1 budget |
| 10 | **Style matchups versus Pillar 3.** Even at ±25% a matchup table invites "bring the counter Style" Posse-swapping at the Lot before every Den. | Could push depth into menus. | game-designer + creative-director | Vertical slice | Watch whether testers re-roster per fight; consider ±15% |
| 11 | **Verticality in a 12 m ring under a fixed 55° camera.** Roof-level cats may be hard to read, and many Patches may not have usable ledges. | Cat-ness is meant to matter mechanically. | level-designer + game-designer | First district block-out | Anchor requirements in CR-19.3 are a request, not yet agreed |
| 12 | **Verdict presentation after a Rout.** Combat makes Routed cats bolt in a dust puff; the Verdict needs the Rival present. | Hand-off between Combat, Nemesis and UX is undefined. | nemesis designer + ux-designer | Nemesis GDD review | Proposal: a Routed Rival cowers at the ring edge until the Verdict |
| 13 | **Multiple Rivals Routed in one fight**: one Verdict each, or one for the leader? | Pacing after every fight. | nemesis designer | Nemesis GDD review | Not Combat's to decide; flagged |
| 14 | **Botan** is not modelled (6–8 min target, four phases, unique Zoomies) and her Style is unset. | Final Boss. | game-designer + narrative-director | Alpha | — |
| 15 | **Level scaling out of band.** `Mit` uses the attacker's level reference; a Posse 8+ levels over a district will flatten it. Whether old districts should stay threatening (raids, Life 8) is undecided. | Life 8 "the empire rots" needs fights that still matter. | crew/progression designer + game-designer | Alpha | — |
| 16 | **Fights run about 20% longer at Lv 50 than at Lv 1** because the brief scales Nerve ×25 and hits ×20. | Possibly intended; possibly not. | creative-director | Brief v1.1 | — |
| 17 | **FF7 Remake reference details**: two points (slower AI gauge fill, shortcut layout) were not confirmed by the searches run for this draft. | Low: our values come from the brief. | game-designer | Next review | Verify against an authoritative source if the comparison is used in marketing |
| 18 | **Engine not chosen.** Fixed 60 Hz simulation with 30 fps rendering, local versus global hit-stop, and per-object time-scale are feasibility questions. | Architecture. | lead-programmer / technical-director | Engine decision | — |
| 19 | **Enemy use of props against the Posse** and recruited Rivals' Fears applying in the player's Posse are fun on paper and may feel unfair in practice. | Pillar 4 flavour versus frustration. | game-designer | Vertical slice | — |
| 20 | **Shoo hazards** interrupt fights at random from the player's point of view. | "Nothing may stall" versus daytime flavour. | game-designer + level-designer | Arcade block-out | Could be cut without touching anything else |

# Combat System — Vertical Slice

*Owner: combat designer (game-designer) · Round 2 (slice rewrite) · 2026-11-23 · Owner feedback pass 2026-11-24 · Consistency pass (creative director) 2026-11-24 · Canon: the owner's comments C1–C5 → `design/reviews/owner-feedback-rulings.md` (OR-01…OR-21, binding), as settled by `design/reviews/owner-feedback/consistency-pass.md` (F1–F12) → `design/creative-brief.md` v1.6 → `design/reviews/round-1/director-rulings.md`. Patent guardrails: `design/legal/nemesis-patent-analysis.md` v2 §5 (binding). First draft archived at `design/backlog/first-drafts/combat-system.md`. · **Owner combat direction M1.1 (2026-11-24):** `design/reviews/owner-feedback/combat-m1.1-spec.md` is binding and supersedes this doc where they differ (final bindings: **F = Special on a staggered enemy, R = skill bar, Tab = lock-on cycle**). · **Owner combat direction M1.2 (2026-11-24):** `design/reviews/owner-feedback/combat-m1.2-spec.md` (owner's C11) is binding and wins over M1.1 where they differ: one **Evade** on Space, move-out at 60% of the whole animation, F = Special at any time, sequential chain, Tab lock/unlock with flick switching, cornered-cat AI, Final KO cinematic, and **Daifuku as a ground Boss** on a universal Boss pattern.*

> **Patent rule (brief v1.5):** nothing Mikan does to one cat, and nothing that cat becomes because of it, changes a *different* cat. In combat that means: a loss changes only the victor (G1); Boss anger buffs only that Boss and never comes from a fight (G2); an old boss fights the same whoever is in the Posse, and only the recruit's own memory makes it flinch (G4); a join-in belongs to the joiner and its Rival fights exactly as it would anyway (G7). Not legal advice; counsel review still blocks scope lock.

**Scope.** This doc covers what the vertical slice (DR-01) and the grey-box combat prototype (DR-02) need: real-time rules, Mikan's five strings, Evade and the input rules, the 12 slice Moves, the skill bar, 3 Fears, Frazzle (stagger), the Special chain and the Team Pile-On (Zoomies folded in), Posse and enemy AI (attack tokens, cat-like spacing, personality), enemy grammar, the universal Boss pattern and Daifuku, the game-feel/VFX tier table, and the combat column of the control map. Everything else is in `## Backlog (post-slice)`. **Spec level (DR-28):** intent, rules and ranges in milliseconds or seconds. Frame data goes in `assets/data/combat/*` and the prototype.

---

## 1. Overview

Combat is a short, loud, readable cartoon brawl with FF7 Remake's **structure**, NieR: Automata's **responsiveness** and deliberately light detail. **The player controls Mikan only** (owner direction M1.1). The three Crew of the four-cat **Posse** are always AI; the player **commands** them from the **skill bar**. The camera is third-person behind and above Mikan and free by default; **Tab** locks on and off, and a mouse flick switches targets while locked. Mikan has a near-instant **Light** and a slower **Heavy** with a readable wind-up, one **Evade** (Space, ≈ 2 m, i-frames, ≈ 0.8 s cooldown) that cancels any attack at any frame, and five strings (L-L-L, the **L-L-L-H finisher**, the L-H launcher, a charged Heavy, the Evade-L lunge). Mikan is never locked in place: slow steering runs through every attack and full movement returns at 60% of the animation (M1.2). Combat movement matches the Lane's fast walk. Hits fill a **Pounce Gauge** measured in **Paws**. Paws are spent on **Moves** from the skill bar (**R**), where time slows and the player picks a Move for Mikan or forces one for any Crew cat. Every Move is either a **Set-up** that creates a state or a **Pay-off** that cashes one in, and every Move is visible (name banner, cat colour, wind-up pose). Hits build an enemy's **Frazzle** gauge; **Frazzled** is this game's word for *staggered*. A Frazzled enemy is helpless and takes ×1.5 damage, and the stagger plays a short zoom, slow-down and shattered-glass blink. **F** fires Mikan's **Special** whenever its meter is full (Zoomies are folded into it), with a bonus on a staggered target; every Crew cat in range with a full meter follows **in sequence**, each after the last one's animation ends, and if all four land, the **Team Pile-On** ("full burst") adds extra damage on top. AI on both sides thinks like cats: only 1–2 enemies engage Mikan at once (attack tokens) while the rest circle, stalk, posture and flank; a **cornered** cat stops hovering and lashes out. The last opponent's fall plays the **Final KO** cinematic. Bosses run on one **universal Boss pattern**; Daifuku, the first, fights on the ground with a **belly-flop shockwave**. AI Crew fight according to their **personality** and fill Paws at half rate, so the biggest moments are always ones the player chose. A Tough falls in 6–10 s, a normal encounter takes 30–60 s, a Captain 30–45 s and Daifuku 2–3 min (F9; the M1.1/M1.2 re-baseline of those figures is owned by the sim's data and tests). **A fight can be lost** (the owner's C2): a Posse wipe ends the encounter, the victor Gloats, and the day ends (Day Loop jumps the clock to Night and sends Mikan home). Two personal moments ride on statuses the fight already has: a recruit that sees its old boss may flinch **Cowed** until the player commands it from the skill bar, and a Boss the player has angered by loud marking starts the fight **Fired Up**.

## 2. Player Fantasy

**"I'm the boss of a gang of very different cats, and I'm commanding a brawl."** It reads as cat slapstick turned up to the maximum: action lines, stepped screen shake, impact frames, hand-lettered sound-effect words on the big hits. But the player never loses track of their cat, because every big effect answers something they did or ordered.

- **Target aesthetics (MDA):** *Challenge* (read telegraphs, time the skill-bar orders, cash in the stagger with **F**); *Sensation* (a tiered feel budget peaking at the Special cut-ins and the Team Pile-On); *Fellowship* through *Fantasy* (four distinct personalities you can watch working); *Expression* (who is in your Posse and what you order them to do).
- **Pillar 3, Command the Brawl:** fights are short, with one goal you can always see (fill the Frazzle gauge to stagger), three telegraph colours with absolute answers, and the skill bar plus the Special chain as the skill ceiling.
- **Pillar 1, Cat's-Eye Truth:** the verbs are cat verbs. You Hiss a weak Tough until it backs down. You wait on a wall and pounce. You Evade through the Boss's belly-flop shockwave and make him pay for landing. Nobody dies; a beaten cat bolts away in a puff of dust.
- **Pillar 4, Rivals Remember:** Old Score makes a fight between cats with history play out differently. Memory lines appear at the Standoff, or at the Rout after an Ambush. A recruit ears-flat at the sight of its old boss, steeled by your command; a cat you spared yowling in to fight its own Rival beside you; a Boss already steaming because you sprayed his walls loudly.
- **SDT:** *Competence* comes from readable telegraphs and a gauge you can see. *Autonomy* comes from Posse choice, Move slots, what to order and when to cash in a stagger. *Relatedness* comes from Crew who act like themselves.

**What the player tells a friend:** "When you stagger someone you hit F, everything freezes on your cat for a manga panel, and if the whole gang's meters are full they all chain in one after another and pile on in a dust cloud. And I jumped Daifuku's belly-flop shockwave and the last hit froze like a fighting game."

---

## 3. Detailed Design

### 3.1 Controls (actions owned here; map owned by UX, DR-08; final map per owner directions M1.1 and M1.2)

Everything can be remapped. Every hold has a toggle alternative. West, North, South and East are face-button positions. **This is the one control table**; `ux/hud.md`, `ux/key-screens.md` and `GDD.md` copy it. The KB+M column is the owner's (2026-11-24; M1.2 replaces Dodge and Dash with one Evade and changes Tab and F); the gamepad column mirrors it and is UX's to refine. **Shift and East are unused in combat** (Shift stays the fast walk while roaming).

| Action | KB+M | Gamepad | Rule |
|---|---|---|---|
| Move | WASD | Left stick | Combat move speed = the Lane's fast walk; free third-person camera on the mouse / right stick |
| **Light attack** | LMB | West | Near-instant (first active frame on the next sim tick). Strings (§3.2). Airborne or from the High Road it becomes a **Pounce** |
| **Heavy attack** | RMB | North | Readable wind-up before the hit; hold to charge |
| **Evade** | Space | South | ≈ 2 m with i-frames, cooldown ≈ 0.8 s (shown on the HUD). Cancels any attack at any frame; the string survives it. Evade → Light = lunge |
| **Lock-on** | Tab | R3 | Press: lock the nearest enemy. Press again: unlock (free camera). While locked, a horizontal mouse / right-stick flick past a threshold switches to the next enemy on that side of the screen (no free yaw while locked) |
| **Special** | **F** | R1 | Any time Mikan's Special meter is full; a **Frazzled (staggered)** target takes bonus Special damage (§3.6) |
| **Skill bar** | **R** | R2 | Opens the skill bar (time slows). Commands Mikan's Moves **and forces Crew Moves** (§3.3) |
| Pause | Esc / P | Menu | — |

**Removed (owner M1.1, M1.2):** switching control to other cats (Z X C V / D-pad, Tag-In, Relay); the Pile-On input; the Zoomies input (folded into the Special); Slow Blink on Tab / R2 (it is now the skill bar on R); shortcut Moves 1–4; Hop on Space; Brace on RMB; Hiss on F; **Dodge and Dash** (M1.2: one Evade on Space; Shift unused); the Tab lock-on *cycle* (M1.2: Tab locks and unlocks; switching is a mouse flick).

**Where the old verbs went** (designer's rulings to keep the map at the owner's table; owner to confirm, Assumptions A8–A10):
- **Hop / mantle:** there is no jump button in combat. An **Evade** at a reachable High Road ledge mantles onto it; an Evade off an edge drops. A Light while airborne or on the High Road is the **Pounce**.
- **Brace:** cut as a player verb (RMB is Heavy). Mikan answers white and yellow with Evade. AI cats keep **Brace** as an AI guard posture (§3.11), and its damage factor still applies (F1 `G`).
- **Hiss:** an entry on every cat's skill-bar row (0 Paws, its own 8 s cooldown). The skill bar slows time, so a yellow windup can still be read and Hissed.
- **Scram:** an entry on Mikan's skill-bar row, or leave the ring (§3.14).

**Inside the skill bar** (the old Slow Blink; same name in fiction: Mikan's slow blink to the gang). Time runs at ×5%. One row per Posse cat, Mikan first, each with its 4 Move slots, its Hiss and its Paw pips (Mikan's row adds Scram). Mouse / stick picks a slot, then a target (the lock target by default); LMB / South confirms; RMB / East goes back; R / R2 closes. **Commands chain** while any cat can afford one. Props and **known** Fears are tagged in the world while it is open, which is why there is no Whisker Sense in combat. **Cut (DR-08, DR-28):** Whack, Bap, the Righting input, the L3+R3 chord, Tactics and Auto-Hiss.

### 3.2 Mikan's verbs (the player controls Mikan only)

**Feel: responsive first (M1.2, NieR: Automata as the reference; binding).**
- **Pace:** combat movement speed equals **the Lane's fast walk** (Shift-walk, 1.6 m/s in `prototypes/artifact-slice/src/entries/main.js`; `move_speed_mps` follows it). Longer follow-through on Heavies and Moves; pace never comes from delay before a Light.
- **Light is near-instant:** its first active frame is on the **next sim tick** after the press (≤ 1 frame at 60 Hz, from neutral or from the buffer); short and snappy.
- **Heavy has a readable anticipation:** a wind-up pose of ≈ 250–350 ms before the hit (`heavy_windup_ms`), for impact; a charged Heavy holds longer (§3.2 strings).
- **One-slot input buffer:** an attack press is buffered only in the **last ≈ 150 ms** of the current attack (`buffer_window_ms`); earlier presses are dropped. The buffer holds one press, and a newer press replaces it. Three fast clicks never queue three attacks.
- **No locking in place:** from an attack's first frame Mikan keeps **slow steering** at ≈ 25–35% of walk speed (`attack_steer_scale` 0.30); **full movement returns at 60% of the attack's total animation** (startup + active + recovery; `moveout_at` 0.60, hard rule for every attack, the finisher included). A move input past that point ends the attack. *(M1.1's ramp from 60% of recovery is superseded.)*
- **Evade cancels anything** (§3.2 Evade).
- **Steering:** Light strings step forward (≈ 0.4 m per hit) and steer toward the stick, or toward the lock target when locked and the stick is neutral.

**Mikan's five strings (Mikan only; keep it to these five).** Heavy hits build Frazzle faster than Lights. Values are starting values; the re-baseline is owned by the sim's data and tests.

| String | Input | What it does | MV / FZ per hit | Tier |
|---|---|---|---|---|
| **Basic** | L → L → L | Two swipes, then **Flurry** (a 3-swipe burst counted as one hit) | 1.0 / 8, 1.0 / 8, 1.5 / 14 | T1, T1, T2 |
| **Finisher** | L → L → L → **H** | Heavy pounce-slam: 2 m knockback that can push an enemy off a High Road edge; flinches leaders | 2.0 / 24 | T3 |
| **Launcher** | L → H | Knock-up: a Tough, Stray or crow is popped up and helpless ≈ 1.0 s; leaders flinch | 1.5 / 16 | T2 |
| **Charged heavy** | hold H (tap = uncharged) | Wind-up, then charge level 0 / 1 / 2 at 0 / 0.5 / 1.0 s held beyond it | 1.5 / 16 · 2.2 / 24 · 3.0 / 32 | T2 · T2 · T3 |
| **Lunge** | Evade → L | Closes ≈ 3 m and strikes; a string starter (continues as L → L) | 1.2 / 10 | T2 |

**Crew and enemies have no player strings.** Their AI attacks with its Style's **dash-in combo** (2 basic hits and a Style finisher, ≈ 1.8 s), chosen by the AI (§3.11):

| Style | Basic type | Combo finisher (AI) |
|---|---|---|
| Scrapper | Claw | **Flurry**: a 3-swipe burst counted as one hit |
| Bruiser | Thump | **Shove**: 2 m knockback, which can push an enemy off a High Road edge |
| Yowler | Yowl | **Yowl cone**: a 3 m, 60° cone hitting every enemy in it |

**Pounce.** A Light while airborne, or from the High Road, dives at the lock target (or the nearest enemy in front when unlocked; up to 6 m). On the High Road the Pounce **charges with time aloft** (Wind-Up, up to 3 s; F7). The charge shows as the pre-pounce bottom wiggle. While a cat is perched, its passive Paw fill stops. After 2 s perched, enemies with reach (crows, Yowlers) prefer it as a target. A Pounce made within 1.5 s of mantling deals ×0.6 and gives no Paw points, so mantle-and-pounce cannot be looped (CS-16).

**Evade (Space; M1.2, replaces Dodge and Dash).** About 2 m in about 300 ms, invulnerable for about the first 200 ms, **cooldown ≈ 0.8 s** (`evade_cd_s`; the HUD shows it on Mikan's plate). It **cancels any attack at any frame** after the input, including startup, active frames and the finisher. **The string survives an evade:** the next Light within 0.6 s continues the string where it was (L → L → Evade → L is the third hit); Evade → Light from neutral is the Lunge. A **perfect Evade** (started within ≈ 150 ms before an enemy hit would land on Mikan) triggers a short slow-motion (time ×0.3 for ≈ 0.4 s real time) and opens a **counter window** of ≈ 0.8 s: the next attack in it deals ×1.5 MV and FZ and cannot be interrupted. Only the Fraidy's perk adds Paw points to a perfect evade (§3.11).

*Reference check (NieR: Automata).* The references found agree that a well-timed NieR evade gives i-frames and a "Perfect Evade" that enables a counter attack on the next Light or Heavy input, varying by weapon ([Fextralife: Counter](https://nierautomata.wiki.fextralife.com/Counter), [Fextralife: Combat](https://nierautomata.wiki.fextralife.com/Combat)). **Differences from NieR, on purpose:** NieR's evade has no cooldown (ours is ≈ 0.8 s, the owner's ask); in NieR the slow-motion on a perfect evade comes from the Overclock plug-in chip ([Kotaku](https://kotaku.com/nothing-beats-a-great-gaming-dodge-1827288664)), ours is built in; the references found do not document NieR's combo carrying through an evade, so "the string survives an evade" is our own rule; our counter is a damage-and-armour bonus on the next attack, not a separate counter move set.

**Hiss** (from the skill bar). 8 s cooldown per cat, 4 m reach in front. Against a **yellow** telegraph, it **interrupts** the attack, **Ruffles** the attacker (§3.5) and flinches it. The interrupted enemy **spends the Paw**, and that Move goes on a 6 s cooldown, so there is no retry loop. Against a **Tough at ≤ 15% Nerve**, the Tough **Backs Down**: it is Routed by intimidation, T4, `CatRouted(by_back_down)`. Otherwise a Hiss flinches Toughs and does nothing to leaders. **AI cats Hiss on their own only at yellow telegraphs aimed at themselves** (DR-28, CX-8); the player can force any cat's Hiss from its row.

**No control switching.** The player controls Mikan only; Crew are always AI. If Mikan is Routed while Crew stand, the player keeps the skill bar (commanding the Crew) and the camera frames the nearest standing Posse cat; F is unavailable. A `win` gets Mikan up at 20% (§3.14). There is no mid-fight bench swap.

### 3.3 Command: the skill bar and visible Moves (the commanding core; replaces Tag-In and Relay)

- **Commanding** is the player's reach into the Crew. On the skill bar (§3.1) the player fires Mikan's Moves and **forces** any Crew cat's Move or Hiss. A forced Move fires as soon as the cat can act (it finishes its current hit first); during an enemy's Frazzle window it skips pathing (§3.4). A commanded hit is player-authored and renders at full tier (§3.17 rule 1). `MoveUsed(user, move, targets_hit[], commanded)` is emitted.
- **Steeling a Cowed recruit:** a skill-bar command to that cat (any Move or its Hiss) clears Old Gang Nerves' Cowed at once (§3.5).
- **Bonded pair** (DR-37; moved from the Tag-In): when two bonded cats fire their Specials back to back in a Special chain (§3.6), the second deals MV ×1.25 and adds +10 FZ to any non-Frazzled rider targets (F6).
- **Every Move is visible (M1.1 §7).** Every Move, Mikan's or a Crew cat's, commanded or fired by the AI on its own, shows:
  - a **name banner** over the cat (world-anchored, ≈ 1.2 s, in that cat's colour; UX draws it);
  - a **per-cat colour** (Art assigns one per Posse cat; never Frazzle Magenta, never Koharu's coral, and distinct from the telegraph colours);
  - a readable **wind-up pose** held ≥ 200 ms before the first active frame (Moves only; the Light's ≤ 3-frame rule is not affected);
  - **distinct VFX** per Move (Art), drawn at the Move's tier even when the hit renders one tier lower under rule 1 (rule 1 lowers hit-stop, shake and lettering, never the Move's identity);
  - a **highlight on that cat's HUD plate** for the Move's duration.
  Audio for Moves arrives in M6.

### 3.4 Pounce Gauge, Moves, the skill bar

- **Pounce Gauge:** 100 points = 1 Paw. Every cat has **2 Paws** (Mikan's third, from Life 4, is outside the slice). The gauge fills slowly over time and faster from hits (F3). AI cats (every Crew cat) fill at **`ai_fill` = 50%** (data per Life, DR-35); Mikan fills at 100%. It starts each fight at 0 (25 with Well-Fed, DR-20). Fights do not carry it over.
- **Moves:** 4 slots per cat; each costs 1 or 2 Paws. Every Move, Mikan's included, is fired from the skill bar (§3.1, §3.3); Crew also fire `auto` and `support` Moves on their own (§3.11). The Paw is spent when the Move **commits**; a Move interrupted before then refunds. **No Move refunds its own cost** (CS-C12). `MoveUsed(user, move, targets_hit[])` is emitted.
- **Skill bar (Slow Blink):** R sets time to ×5% and eases the camera to the skill-bar pose (owned by `camera-system.md`). Pick a cat's row, a Move and a target. **Commands chain** while any cat can afford one. All timers, including the Frazzle window and its Special pips, run at 5%. **A Move commanded during an enemy's Frazzle window skips pathing:** the cat leaps to range. The skill bar is closed during the Standoff, the Special chain and phase breaks.

### 3.5 Ruffled, Frazzle, poise, statuses

- **Ruffled** (state, 4 s): the target's Frazzle builds ×2. Sources: Ambush, Fear triggers, Hiss interrupts, a Boss's signature-attack recovery (§3.13), and **one Move per Style** (Face Swat, Puff Up; the Yowler has none). **A Captain or Boss cannot be Ruffled again for 6 s after Ruffled ends** (this replaces Swagger and Composure, which are cut). Fed Up ignores that cooldown.
- **Frazzle** gauge 0–100, shown as a zigzag bar on the enemy in the world. It fills from hits (F2) and decays only after a pause in gains (Tough 5/s after 4 s; Captain 2/s and Boss 1/s after 6 s). **Frazzled** when full: **6 s** helpless, damage taken ×1.5, the window drawn as a shrinking ring. When the window ends, the gauge resets to 0. Hits do not build Frazzle while the target is Frazzled.
- **Poise (DR-28, CS-3):**
  - **Toughs, Strays and crows** flinch (about 0.4 s) from string hits. After a flinch ends, they ignore *string-hit* flinches for 1.0 s.
  - **Captains and Bosses do not flinch from strings.** They flinch only from finishers (L-L-L-H, launcher, a level-2 charged heavy, an AI combo finisher), Hiss interrupts, a perfect-Evade counter and phase breaks, and from finishers at most once per 3 s.
  - **Every enemy windup is armoured from its start.** Yellow can be stopped only by Hiss. Red cannot be stopped.
- **Statuses: three only, one per cat at a time (the newest replaces the old):** **Soggy** (move speed and recovery ×0.8, 6 s), **Cowed** (deals ×0.75, 8 s), **Fired Up** (deals ×1.25, 8 s). Well-Fed is not a status (DR-20).
- **Two fight-start sources (owner feedback, OR-06 and OR-07).** Same statuses, same multipliers; only the duration and the source differ. Both are applied at the end of the Standoff and read data Nemesis puts in `RivalCombatProfile` (§6). Neither is a new status.
  - **Old Gang Nerves → Cowed on the recruit (OR-06).** A Crew cat in the Posse whose own record has `old_gang_nerves` = true and Loyalty < 80 (below Sworn) starts **Cowed for 20 s** (Fraidy **30 s**) when it **sees** its Old Boss among the opponents: at the Standoff, or when a wave brings him in. Resisting personalities (Braggart, Stalwart, Brooder) never carry the flag (Nemesis sets it at recruitment); they play a defiant line instead. While Cowed this way: it deals ×0.75; **its AI will not target the Old Boss** (it picks another opponent, or postures at 4–6 m if he is the only one); the player can still force its Moves. **A skill-bar command to that cat clears it at once** (a "steeled" bark, recruit-voiced; M1.1 §8, Tag-In no longer exists); nothing else clears it early except a newer status. The Old Boss's AI, targeting, taunt and parameters never read who is in the Posse (G4).
  - **Boss anger → Fired Up on the Boss (OR-07).** At the end of the Standoff a Boss is Fired Up by its anger stage: **Riled 20 s · Seething 40 s · Furious the whole fight** (Calm: none). Only that Boss; his Toughs and waves never read anger. **Doused, not lost:** a newer status (for example Soggy from a water prop) suspends anger's Fired Up and **pauses its timer**; it resumes with its remaining time when the newer status ends. So a soaking buys 6 s of calm, and a tier's seconds are always seconds of buff. Anger itself is Nemesis's store, fed only by marking acts on objects, never by fights; Combat only reads the stage at fight start.
- **States that are not statuses** (Set-up targets): **Ruffled**, **Splat** (knocked flat and helpless for 1.5 s, plus a flat 20 FZ chunk; a Boss is never Splatted and is Ruffled instead) and **Clumped** (2+ enemies pulled within 2 m of each other for 3 s).

### 3.6 Stagger, the Special chain and the Team Pile-On (replaces the Pile-On, DR-30; M1.1 §5–6)

**Stagger presentation.** When an enemy becomes Frazzled (staggered): a brief **zoom onto the staggered cat** (camera §3.7), **time slows** briefly, and a **shattered-glass blink** plays on and around it (in the spirit of FF7 Remake's stagger; our own drawing). Total ≤ ≈ 0.5 s (`stagger_fx_s`). Input stays buffered under the one-slot rule (§3.2), and the 6 s Frazzle window starts after it.
- **Full treatment** for Captains, Bosses and the first stagger in each fight: zoom, time ×0.25 for ≈ 0.3 s, two soft blink pulses.
- **Light treatment** for Toughs, Strays and crows after the first: no zoom, time ×0.5 for ≈ 0.15 s, one local pulse.
- **Safety:** the blink is a soft pulse (luminance change ≤ 0.10, ≥ 2 rendered frames each, never a strobe) and counts against §3.17's flash caps; a full treatment counts as that second's one full-screen frame. Reduce Flashes turns it into a held crack line with no luminance change; Reduce Motion drops the zoom.

**The Special (F; M1.2: any time).** Whenever Mikan's **Special meter** is full (F8), **F** fires Mikan's **Special** at the lock target (unlocked: the nearest enemy in front, up to `chain_range_m` 8 m): the camera punches in on Mikan, **time stops**, only Mikan renders over an impact-frame background (a shonen-ultimate cut-in, ≈ 1 s), then Mikan leaps to the target (High Road included) and the hit lands. A **Frazzled (staggered)** target takes **bonus Special damage** (`sp_stagger_bonus`, F5) on top of the ×1.5 Frazzled multiplier. Zoomies are folded into the Special: there is no separate limit break. The Special spends the whole meter. The F glyph shows on Mikan's meter pom whenever it is full and over the target when that target is Frazzled (the bonus read).
- **Crew Specials chain automatically and in sequence** (owner's decisions, M1.1 and M1.2). After Mikan's Special, every Crew cat that is standing, within `chain_range_m` of the target and has a full meter fires its own Special and cut-in **only after the previous cat's animation has finished** (Posse slot order; in the spirit of Granblue Fantasy Relink's link attacks). No input. A Crew cat whose meter is not full is skipped. Crew never start a Special on their own and cannot be forced into one from the skill bar: the chain is the only way in.
- **Team Pile-On ("full burst").** If **all four** Posse cats land their Specials in one chain, the **Team Pile-On** plays (≈ 1.5 s): the KA-BLAM dust cloud, each cat's beat with its Style animation, voice and **personality flourish**, dealing **extra damage on top** of the four Specials (F5). It is the existing Pile-On art, in the spirit of Granblue Fantasy Relink's Full Burst (our art and staging; counsel watch item, `design/legal/nemesis-patent-analysis.md` §8).
- **During the chain** every Posse cat in it is invulnerable, enemies not in it hold their attacks, a red windup already in progress pauses, and the target's Frazzle window (if any) is paused. The skill bar is closed. Camera shake happens on the hits and beats only; the cloud itself does not shake the screen.
- **Pacing:** each cut-in ≈ 1 s (`cutin_s`) plus that cat's Special animation; the full chain, Team Pile-On included, ≤ ≈ 6 s; **repeat chains in the same fight play a faster version** (cut-ins ≈ 0.5 s, `cutin_repeat_s`; Team Pile-On ≈ 1.0 s).
- **What it does.** **Below Captain:** a Special Routs a Frazzled target, and a Team Pile-On Routs every Frazzled enemy below Captain within 3 m of the target; on an un-staggered Tough it is a big hit (F5). **On a Captain or Boss:** the Specials deal their value with the stagger bonus if Frazzled; the Team Pile-On's extra is worth **more the earlier in the Frazzle window** it lands (F5), so the Frazzle ring keeps its **5 pips**. The chain does not end the Frazzle; the window resumes after it.
- **The decision:** fire F as soon as the meter is full for a sure hit, or hold it for a stagger (bonus damage) and for the Crew meters to fill (a longer chain and the full burst). Holding risks the meter sitting idle; it does not overfill.
- `SpecialChain(target, cats[], team)` is emitted when the chain ends; Routs from it are `CatRouted(by_pile_on)` (the name is kept for Nemesis's contract: it means a Rout by a Special or the Team Pile-On).

### 3.7 Specials (Zoomies folded in; one per Style)

Each cat has one **Special meter** (0–100), shown on its plate. It fills from hits landed, damage taken and Frazzles (F8), and it **persists within a day**. Mikan fires with F; Crew fire only through the chain (§3.6). Each cat shows its own Special name on its cut-in and banner (data `special_name`; the Style sets the effect). **Every cat has its Special from the day it joins** (designer's ruling, A11: the old Zoomies unlocks, Mikan Life 2 day 3 and Crew Lv 6, would keep the Team Pile-On out of most of the slice). Specials are invulnerable, player-authored and T5 (DR-07). The primary hit on the staggered target is F5's value; the Style's rider follows (area hits pay 40% per target).

| Style | Special (was its Zoomies) | Rider on other enemies |
|---|---|---|
| Scrapper | **Midnight Laps** | Three laps of the ring: 4 hits of MV 1.2 on every other enemy, FZ 15 per hit |
| Bruiser | **Landslide** | Rolls along a line through the target: MV 4.8 to others in the path; knocks non-Boss targets off High Road edges |
| Yowler | **Midnight Aria** | Ring-wide MV 3.0 on every other enemy, all enemies Cowed; heals the Posse 15% of max Nerve, counted against the heal cap |

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
| **Water bucket** | 3 m cone splash: Soggy on everything; a cat knocked off a ledge into it takes an extra 10 FZ (flat) | Water | Once |
| **Scooter horn** | 6 m bang: interrupts Toughs' yellow windups in radius | Loud Noise | 15 s cooldown |
| **Ledge junk** (cucumber on a crate) | Falls at its ground point: 1.5 m radius, MV 2.0, FZ 25 | Cucumbers (3 m) | Once |

- **A triggered Fear:** `FearTriggered` is emitted; the cat is **Ruffled** (the leader cooldown applies), takes a flat Frazzle chunk (Tough 30 / Captain 20 / Boss 15), any non-red action is interrupted, and a rider applies: **Water**, Soggy 6 s; **Loud Noise**, a 0.8 s flinch; **Cucumbers**, launched upward, helpless 1.0 s, then Splat (Boss: no Splat).
- **Diminishing:** the same Fear on the same cat in one encounter gives full effect, then half the chunk and no rider, then nothing.
- **Flinch tell (CX-12):** any cat with the matching Fear inside a prop's radius plays a visible flinch-and-ears-flat tell, even when the Fear is diminished or the prop does nothing else. The Fear then becomes **known**: `FearTriggered(source = tell)` is sent, and Nemesis records it. The skill bar then tags that prop.
- Nemesis chooses Fears and Strengths; Combat values them. A Strength is worth one of: resist one type at ×0.6; cannot be knocked off the High Road; immune to one status; +15% Nerve; +25% Frazzle resistance. A cat may not hold a Strength that cancels its own Fear.

### 3.10 The slice Move catalogue (12; DR-05)

Data lives in `assets/data/combat/moves.*`. Crew owns learnsets keyed by `move_id`. Fields: `id, name, style, cost, type, mv, fz, role (setup|payoff), creates|pays_on, target, range, ai_use (auto|command_only|support), flags, feel_tier`. **Set-up Moves are `command_only`: an AI cat fires them only when the player forces them from the skill bar.** Budget: 1 Paw ≈ 3.5 MV + about 30 FZ; 2 Paws ≈ 8 MV or a strong utility; area damage pays 40% per target. ★ marks the 8 prototype Moves (DR-02).

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

### 3.11 AI: cats think before they charge (enemies and Crew; combat column, DR-37; M1.1 §4)

**Every AI fighter, enemy or Crew, shares one base** (like cats, in the spirit of Assassin's Creed group fights, not a strict copy):
- **Attack tokens.** Only a token holder may start an attack on a cat. **Mikan carries 2 tokens** on Alley (§3.15), so only 1–2 enemies engage the player at once; every Crew cat carries 1; every enemy accepts at most 2 Posse attackers at once (Crew use the same rule on the other side). A holder returns its token after its dash-in combo or Move (or after 4 s) and cannot take one again for `token_cooldown_s` (2 s). At least 300 ms separates two hits landing on the same cat.
- **No beeline.** A fighter without a token keeps spacing (3–6 m; personality sets it), faces its target and **circles** (strafes at ≈ 40% move speed), **stalks** (slow low approach), **postures** (arched back, tail lash, hiss idle; 1–2 s), side-steps, **feints** (a fake step-in ≤ 0.5 s, no hit) and **flanks** (works toward the target's rear 120° while another fighter holds its front). It never runs straight at the nearest target.
- **Cornered cat (M1.2).** A fighter that is outnumbered or surrounded (≥ 2 opponents within 3 m and none of its own side within 4 m, or ≥ 3 opponents within 4 m) **stops hovering**: it hisses (0.3 s, no windup class of its own) and **lashes out** at the nearest or the weakest (lowest Nerve %) attacker with its combo or a Move, with no token needed. Attack tokens limit many-vs-one **against the player**; they never hold back a cornered cat. A cornered enemy still telegraphs every attack (§3.12).
- **Dash in, combo, back out.** A token holder waits for an opening (the target in recovery, facing away, or after ≥ 1 s of posturing), **dashes in** for its combo (§3.2) or a Move, then backs out to spacing.
- It keeps within the camera's frame bias.
- Attack uptime stays about 35% (`ai_attack_uptime`); the rest is circling, stalking, posturing, repositioning and dodging white telegraphs.
- It Hisses on its own only at yellow telegraphs aimed at itself. **Brace** is an AI guard posture (front 120°; white and yellow reduced to the 30% floor; red cannot be Braced).
- **It never spends its last Paw on its own**, so one Paw is always banked for the commander.
- It uses `auto` Pay-offs only when their condition is met, and `support` Moves under the condition stated in the catalogue. It never starts a Special (§3.6).
- **High Road:** if the AI's target stands on the High Road within 3 m of a reachable ledge, the cat mantles after 1 s (Fraidy: never; Brooder: only once it has an avenge target).
- Its hits render one feel tier lower; its Moves still show in full (§3.3).

**Personality shapes the movement** (the "Moves like" column) as well as target choice. Enemies with a personality (Rivals, Captains, Daifuku) use the same "Moves like" flavour; their target choice stays the base rule (B-22).

| Personality | How it fights (target choice and distance) | Moves like (M1.1) | Paw habit | Combat perk |
|---|---|---|---|---|
| **Braggart** | Goes for the biggest enemy (highest rank, then highest max Nerve); stays close | Struts in front of its target, chest out; takes a token first | Spends a Pay-off at the first chance | Its first hit on a Captain or Boss each encounter adds **+20 FZ** (flat) |
| **Brooder** | Hangs back at 5–7 m until an enemy hits an ally, then goes for that enemy for 6 s | Stalks low and slow, eyes fixed; long postures | Saves for Pay-offs on its avenge target | **Old Score ×1.5** instead of ×1.25 |
| **Schemer** | Approaches from the target's rear 120°; switches to a Ruffled or Frazzled target within **6 m** | Flanks; feints often; dashes in when the target turns away | Spends on Frazzled targets | **+20% damage to Frazzled** targets |
| **Fraidy** | Keeps 4–6 m away; evades whites eagerly; prefers support | Hangs back and darts: short dash-ins, quick retreats | Holds Paws for `support`; with no `support` Move slotted, uses the base Pay-off rule | **Perfect Evade: +25 Pounce points** |
| **Stalwart** | Stays within 3 m of Mikan; Braces against attacks aimed at itself; takes attack-token priority from enemies | Holds ground: little circling, squared up | Spends on whatever is attacking Mikan | **Allies within 3 m take ×0.85 damage** |
| **Goofball** | Goes for props that would catch an enemy (6 m); otherwise picks randomly between the nearest two enemies (seeded) | Bouncy, erratic circling; play-pounces | Each time an `auto` Pay-off becomes eligible, fires it on a seeded 50% roll; otherwise waits 3 s before rolling again | **Props it triggers: ×1.3 effect** |
| **Mikan** (no personality) | Always the player's; never AI | — | — | None (no flourish beyond the Scrapper beat in the Team Pile-On) |

- **Old Score (DR-29):** a Crew cat fighting a Rival whose Memory records a Rout between them, either way, deals ×1.25 Frazzle to that Rival (Brooder ×1.5). Both bark at the Standoff. Fight barks are icon-only (DR-44).
- **Kin (OR-05):** a Crew cat under AI control **never targets an opponent that is its own Kin** (its `kin_ids`). It picks another opponent; if its Kin is the last one standing, it postures at 4–6 m and Braces. The player can still force its Moves onto its Kin from the skill bar, and its Special still chains on a staggered Kin (both player-authored). It plays one `kin` bark of its own at the Standoff. Slice pair: Kinako ↔ Sasa. The opposing Kin's AI is unchanged.
- **Old Boss exclusion (OR-06):** while Cowed by Old Gang Nerves (§3.5), the recruit's AI will not target its Old Boss. Nothing else about its row changes.
- **Signature perks:** an ex-Rival's Nemesis Strength becomes an always-on perk, valued per §3.9. Strays have none.

### 3.12 Enemies

**Telegraphs (DR-28, DR-51).** Each class has a ground decal (the primary signal) plus an overhead glyph at least 3% of screen height. Pose is a secondary signal.

| Class | Look | Answer | Windup |
|---|---|---|---|
| White | White thin arc or line | Evade (AI: Skitter or Brace) | 300–500 ms (Tough), ≥ 250 ms (Captain+) |
| Yellow | **Paper Cream, dashed, triangle glyph** | **Hiss** (best; skill bar), Evade (AI: Brace) | ≥ 750 ms |
| Red | **Frazzle Magenta, zigzag edge, filling area** | Get out or Skitter through; nothing stops it | ≥ 1,000 ms (Boss specials ≥ 1,500 ms) |

At most one red is active in the ring outside the Boss fight. A hit never exceeds its drawn shape. An off-screen attacker shows an edge arrow for its whole windup.

**Attack tokens** (on Alley; rules in §3.11): 2 melee tokens on Mikan, 1 on each Crew cat, with at least 300 ms between two hits landing on the same cat. An enemy without a token circles, stalks, postures and flanks (§3.11), unless it is cornered (§3.11), when it lashes out without one. Each attack averages about 1.5 MV, roughly one attack per 4.5 s per token holder (F10).

**Enemy kits.** An enemy uses its Style's dash-in combo (white), plus up to 4 slice Moves from its `RivalCombatProfile`: a 1-Paw Move is yellow, a 2-Paw Move is red. **Enemy Paws** fill at a flat rate: Tough 1 per 16 s, Captain 1 per 9 s, Boss 1 per 6 s. No enemy heals more than 25% of its max Nerve per encounter.

| Archetype | Nerve × | Damage × | Notes |
|---|---|---|---|
| Stray | 1 | 1.0 | 0–1 Moves; Backs Down at ≤ 25% |
| Tough | 1 | 1.0 | 1–2 Moves; Style sets its job |
| Captain (2 in the slice) | **8** | **1.3** | 4 Moves, a Fear and a Strength |
| Boss (Daifuku) | **20** | **1.6** | The Boss pattern, §3.13 |
| Crow (Critter) | 0.5 | 0.8 | Groups of 2–4. Lives in the air and on the High Road; its dive is white, after which it hops on the ground for 1.5 s and can be hit. Pounce, Yowl cones and Howl reach it in the air. Never Rival or Crew |

Style Nerve multipliers stack on top for Strays, Toughs, crows and the Boss (Daifuku = 20 × 1.3 = **26×**). **Captains do not take the Style Nerve multiplier** (`captain_style_nerve` = off): every Captain has 8 × neutral Nerve, and Style still sets its Hide, Bite and Voice. *(Iteration 3: with the ×1.3 stacked, a Bruiser Captain took 55–58 s in the sim, outside the 30–45 s band; without it every Captain Style lands at 37–44 s with 2 Frazzles.)* **Leader levels (CS-C24):** Den Captains and Daifuku are levelled at `max(district band top, Posse mean level − 2)`. Nemesis supplies the level.

### 3.13 Bosses: the universal Boss pattern, and Daifuku (the slice Boss; M1.2)

**One pattern for every Boss (M1.2, owner: "Make it universal").** A Boss is data, not bespoke code: `assets/data/combat/bosses.*` holds one **Boss pattern** per Boss, and Daifuku is the first instance (Madam Sabi, Oboro and Ikari, B-10, reuse it).

```
BossPattern {
  id, display, style, rank = boss                     # Nerve and damage from §3.12 (×20, ×1.6, Style Nerve)
  arena_kit { props[], wave_entries[] }               # ground arena; no special terrain required
  signature_attacks[] {
    id, class (white | yellow | red), windup_ms        # never below §3.12's floors (red Boss specials ≥ 1,500 ms)
    telegraph { decal_shape, radius_m, grow_ms }       # the decal grows across the windup (Art §4.3)
    hit { mv, fz, knockdown_s, radius_from_m, radius_to_m, travel_ms }   # an expanding ring if radius_to > radius_from
    recovery_open_s                                    # the punish window after it; he is Ruffled for it if set
    cooldown_s, ai_weight
  }
  phases[] { nerve_from, nerve_to, adds[] (waves), signature_ids[], new_props[], ruffle_routes[] }
  rage[] { at_nerve_pct, windup_scale (floors still hold), cooldown_scale, extra_signature_id? }
  phase_break { duration_s (3–4), invulnerable, tier = T5, pounce_grant = 50 }
  bout { phase_cap, on_cap = final_ko }               # the last phase of a bout ends in the Final KO cinematic (§3.14)
  anger_hook = fired_up_by_stage                      # §3.5; Bosses only
}
```

**Where Daifuku is fought (OR-09).** There is no Den gate. When Mikan's Lane influence reaches 100, the **Boss window** opens (Territory) and Daifuku roams a fixed **three-stop patrol**, one stop per daytime phase (Morning: Laundry Pole Yard · Day: Tofu Shop's back lane · Dusk and Night: the Den corner). Approach within 8 m of the current stop for the Standoff; the fight plays **on the ground at that stop's arena kit**: a ≈ 10 m ring with a noise prop (scooter horn), ledge junk (a cucumber) above the ring edge and wave entry points. **No wall, no wash tub, no knock-off** (M1.2). Before the window opens he stays at the Den and ignores Mikan; there is no fight to be had.

**His fight is "jump the shockwave, punish the landing".** Daifuku fights **on the ground like any cat**, under the §3.11 base (tokens, circling, cornered rule) with Brooder movement. His gimmick is the **Belly-Flop Shockwave** (red): he crouches and wiggles (the telegraph decal grows as a ring around him), leaps, slams down, and a **shockwave ring expands** from 1 m to 6 m over ≈ 0.6 s. **Evade through the ring** (its i-frames cover it) or be **knocked down** (MV 3.0, helpless 1.0 s). After every Belly-Flop he sits **stunned and Ruffled for 2 s** (`recovery_open_s`): that is the punish window, and the route to his Frazzle.

| Phase (Nerve) | Adds and arena | Signature attacks | Ruffle routes |
|---|---|---|---|
| 1 (100–70%) | Daifuku alone | Yellow **Paw Swat** (melee); red **Belly-Flop Shockwave** (windup ≥ 1,500 ms, 1 → 6 m ring) | The landing (2 s Ruffled); a Hiss on the Paw Swat |
| 2 (70–35%) | 2 Wall Sitter Toughs join (a seeded pick among the gang's Toughs, never chosen by who is in truce or in the Posse); the scooter horn is in reach | Adds yellow **Big Yowl** (Fired Up on his Toughs): Hiss it | The horn (Loud Noise, if he has it) |
| 3 (35–0%) | 2 more Toughs | Adds red **Double Flop** (two rings 0.8 s apart; Evade both) | Ledge junk (a cucumber) above the ring edge |

**Rage (pattern `rage[]`):** at 50% and 20% of max Nerve his signature cooldowns ×0.8 (windups never below their floors).

- **Phase rules (DR-32):** damage that would cross a phase threshold clamps at it. **The phase break keeps the Frazzle gauge.** **A break is deferred while he is Frazzled:** the window and any Special chain run to completion, and a chain on a clamped Frazzle plays the break as its final beat. Up to 10% of max Nerve of overflow carries into the next phase. A break lasts 3–4 s, he is invulnerable, it is T5, and every Posse cat gains +50 Pounce points. Total break time is ≤ 8 s. **A phase always ends cleanly:** the break completes even if a chain, a hit-stop or a Rout is in flight, and the next phase (or the bout's end) always follows it (the M1.1 "stuck after phase 1" bug, AC 42).
- **Anger (OR-07):** he starts the fight Fired Up by his anger stage (§3.5): Riled 20 s, Seething 40 s, Furious all fight. Fired Up changes only the damage he deals; it never changes his Nerve, phases, Frazzle resistance or Toughs. The sim (F9, F10) shows what it does: a win takes the same time at every stage, and Furious raises the Posse's Nerve lost at the median from 52% to 61% and moves the expected-value wipe line from 95% to 83% of his swings landing.
- **Old gangs in his fight (OR-06):** in the slice, Hige (Stalwart, authored ex–Wall Sitter) and Togemaru (Braggart) resist and play a defiant line; Kagi (Schemer) is susceptible and flinches Cowed unless Sworn. So the fight can show both halves. Daifuku runs his ordinary Standoff taunt whoever is in the Posse.
- **Rematch:** each wipe against him leaves him plastered with −10% max Nerve (stacking to −30%, DR-21); it changes only him. A win, a loss or his `rival_fled` **spends his anger** (Nemesis resets it to 0 at `EncounterEnded`), so the rematch meets a Calm Boss unless Mikan has marked loudly since. **Scram does not spend it.**
- **Showcase and M1 (M1.2):** the bout plays **phase 1 only** (`bout.phase_cap` = 1): reaching the phase break plays the **Final KO cinematic** (§3.14) and then the bout-end screen; he limps back to the Den, outcome `rival_fled` (no Verdict). Phases 2–3 are later milestones; the slice fight is all three phases.

### 3.14 Encounters

- **No random encounters and no scene change.** Every opponent is visible first. **No combat inside Haru's wall** (house and garden, presentation ruling R4): no encounter starts or is placed there, and the tutorial crow is fought on the lane-side wall top. The ring is **≈ 10 m** (DR-48), centred on the nearest authored arena anchor. Level places 1–3 anchors per Patch, each with ≥ 2 props and a High Road ledge.
- **Openers** (`EncounterStarted.opener`):
  - `standoff`: name-card plus one taunt, 2–4 s. A memory-citing line cannot be skipped for 1 s. Both sides start neutral.
  - `ambush_by_player`: an unseen first hit, or a Pounce from the High Road. That hit is ×1.5 and **Ruffles** the target; every Posse cat gets +25 Pounce points; there is no Standoff. A remembered Rival's memory line plays **at its Rout** (DR-40).
  - `ambush_by_rival`: a 2.0 s directional yowl-sting. An Evade in its **last 0.75 s** gives a neutral start. Otherwise Mikan takes MV 1.5 and the Posse starts at 0 Pounce points.
  - `raid_defence`: the posted Sentries fight as allied AI. They are not commandable, never join the Special chain, and count toward the cap. *(Territory's presence rule: the raid resolves by its formula whatever happens in this brawl; its outcome changes only the cats in it.)*
- **Allied guest: the Nose-Touch join-in (OR-13).** Nemesis rolls the join-in at `EncounterStarted` (from Life 2; a truce cat or Friend in the same district whose own **Rival** is among the encounter's opponents, including its waves) and emits `AllyJoined(cat_id, encounter_id)`. Combat then:
  - **Entry:** a 3 s directional yowl from the ring edge nearest its old Patch, then it bounds in. If its Rival arrives in a wave, the yowl starts when that wave enters. It needs a free combatant slot (≤ 10); if none is free, it waits at the edge and enters when one frees up.
  - **AI:** an **allied AI guest** under the `raid_defence` guest rules: no skill-bar row (it cannot be commanded), no Special and never in the chain or the Team Pile-On, its own personality row (§3.11) for distance and habits, Paws at `ai_fill` used only for `auto` Pay-offs. Its one bias is its own: it prefers its Rival as a target while the Rival stands. Its hits render at the AI tier (§3.17 rule 1).
  - **Sides and HUD:** it fights on the Posse's side. It shows the Posse's bell-gold keyline but a **truce-sprig tick** instead of the Posse chevron, gets a small fifth **guest plate** beside the Posse plates (Nerve only: no Paw pips, no Special meter), and never shows an enemy Frazzle bar. UX owns the drawing (`ux/hud.md`).
  - **Leaving:** Routed, it slips away like any Routed Rival (no Verdict, nothing recorded against it). At `EncounterEnded` it leaves the ring whatever the outcome. On a Posse `win` Nemesis gives **the joiner** +5 Regard.
  - **The opposing Rival is untouched (G7):** the same AI, targeting, buffs and lines as against any Posse cat. No "traitor" bark, no aggro toward the joiner.
- **Composition** (threat: Tough 1, Captain 3, Boss 8, crow 0.5):
  - **skirmish** (roaming): 2–3
  - **normal encounter**: 4–6, for example 4–6 Toughs or a Captain + 1–3 Toughs
  - **challenger** (OR-16): the challenger (a Tough) + 1 Stray escort at its staked post, as a normal encounter; on a win, a Verdict
  - **Boss bout**: Daifuku alone at his patrol stop (threat 8), on the ground; his Toughs arrive by phase (§3.13)
  - **Life 1 tutorial**: a crow; then 2 Strays
- **Caps:** 1–6 enemies at the start; **≤ 10 combatants** in total; anything beyond that arrives as a wave when ≤ 2 enemies remain; at most 2 waves outside the Boss fight.
- **Scram:** hold Mikan > 2 m outside the ring for 3 s, or pick Scram on the skill bar. Outcome `player_fled`. The group is then alert for 20 s, so it cannot be Ambushed. Combat applies no penalty of its own.
- **Rival flight:** a Rival with a `flee_threshold` (Nemesis) bolts on a yellow windup of 1.0 s. A Hiss or any landed hit stops it. A Frazzled or Splat cat cannot bolt. The First Thorn uses this same rule (DR-22, DR-41), **except on Life 1 day 1 (OR-14):** at 25% Nerve Togemaru bolts with no windup and nothing interrupts it ("faster than a kitten"), not even Frazzled or Splat; the encounter ends `rival_fled`. So the first Verdict is always day 2's, after his memory line.
- **Final KO cinematic (M1.2).** When the **last opponent** of an encounter is Routed (or a Boss bout reaches its phase cap): a zoom-in on the final hit, a **frame freeze over an impact background** (≈ 0.3 s), then **slow motion** (time ×0.25 for ≈ 1.5 s) as the cat bolts, fighting-game style (Street Fighter's KO as the reference; our own drawing). T5, player-authored whoever landed it, inside every §3.17 safety limit (one full-screen frame, no strobe; Reduce Motion: no zoom, a cut; Reduce Flashes: no luminance change). Input is ignored for it; `EncounterEnded` fires after it.
- **Fed Up at 75 s** (non-Boss fights): every enemy is Ruffled for the rest of the fight, ignoring the cooldown, and Toughs Back Down to a Hiss at ≤ 30%.
- **Ending:**
  - `win`: survivors Lick Wounds (+25% of missing Nerve, outside the heal cap). Mikan, if Routed, gets up at 20%. Routed Crew stay Routed until a Sunspot or home.
  - `loss`: every Posse cat Routed (a Scram or a Rival fleeing is never a loss; Life 1 tutorial fights cannot be lost). Combat's part ends at the Gloat: the ring holds, the victor plays its Gloat (≤ 3 s, Nemesis/UX), any allied guest slips away, and `EncounterEnded(outcome = loss)` fires. **Day Loop owns what follows** (`day-loop.md` §3.6, OR-01): the clock jumps to Night, the street closes, and Mikan comes to on the spot and walks home. **Only the victor changes** (OR-02, Nemesis): a `WON` Memory entry, its Glory Title if it has none, and for a Boss the −10% plaster. No promotion, level gain, seat, feud or line for any other cat. Combat applies no penalty of its own.
  - `rival_fled` (a Rival bolted, §3.14 Rival flight) and `player_fled` (Scram) end the encounter with the outing going on.
  - **Boss anger at the end (OR-07):** Nemesis spends it at `EncounterEnded` when the outcome is `win`, `loss` or `rival_fled` and the Boss took part. **Not on `player_fled`**, so engaging a Furious Boss, Scramming and re-engaging gives no calm reset.
  - Nerve and Special meters persist within the day. Paws, statuses and Frazzle do not.
- **Verdict:** routed tracked Rivals are held at the ring edge (DR-36). There is one full Verdict per fight (Nemesis).

### 3.15 Difficulty (enemy-side only)

| | Kitten | **Alley (default; all targets)** | Feral |
|---|---|---|---|
| Enemy Nerve | ×0.75 | ×1 | ×1.2 |
| Enemy damage | ×0.6 | ×1 | ×1.3 |
| Melee tokens on Mikan | 1 | 2 | 2 (shorter token cooldown, 1 s) |
| Enemy Paw rate | ×0.75 | ×1 | ×1.25 |

### 3.16 What is taught when (DR-22; UX owns the beat sheet)

| When | Verbs |
|---|---|
| 0:04–0:08, garden, then the lane-side wall top | Move and Jump in the garden; then Light, Evade and Lock-on (Tab) on a crow on the lane-side wall top (no combat inside the wall, R4) |
| 0:10–0:15, lane | With the old wall cat against 2 Strays: Heavy and the L-L-L-H finisher, first Paw, the skill bar (R), command the other cat, Frazzle the last enemy → **F: Mikan's first Special with the stagger bonus, the wall cat's chains after it** (the tutorial starts both meters full) |
| Rest of Life 1 | Hiss from the skill bar, Back Down (First Thorn); the launcher and the charged Heavy; the perfect Evade and its counter; lock-on flick switching |
| Life 2 day 1 | Ambush, High Road Pounce; the 4-cat Posse makes the first **Team Pile-On** possible |
| Life 2 day 2 | Props and Fears; a full four-cat chain (Team Pile-On) taught |
| Life 2 day 3 | The Captain: a four-cat Special chain on a leader (early is worth more). Lessons open at the Lot the same day (Crew/Territory) |
| Life 2 day 4+, his patrol stop (Boss window open) | Daifuku on the ground: Evade through the belly-flop shockwave and punish the landing; Fired Up read from his anger; a recruit's Cowed flinch answered by a skill-bar command |
| Life 2, any fight against a truce cat's Rival | The join-in ally (no new input: it shows the guest plate) |

### 3.17 Game feel and VFX — Impact Moments (the single tier table, DR-07)

Art owns the drawings and Audio maps to these same tiers. **DR-50 safety overrides every row.**

| | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| **Events** | Whiff, prop hit, blocked hit | String hits 1–2; middle hits of multi-hit Moves | L-L-L Flurry, launcher, Lunge, charged heavy (0–1), AI combo finisher, Pounce, Splat, perfect-Evade counter | L-L-L-H finisher, level-2 charged heavy, 1-Paw Move hit, Hiss interrupt, Fear trigger | 2-Paw Move hit, Frazzling hit, Tough Rout, Back Down | Special (each), Team Pile-On, Boss phase break, leader (Captain/Boss) Rout, Final KO |
| Hit-stop | 0 | ≈ 40 ms, local | ≈ 80 ms, local | ≈ 120 ms, local | ≈ 180 ms, **global** | ≈ 230 ms, **global**, then authored |
| Screen shake (stepped, peak % of viewport height) | 0 | 0 | 0.4 | 0.7 | 1.1 | 1.6 |
| Shake steps (one per 33 ms, ×0.6 decay per step) | — | — | 3 | 4 | 5 | 7 |
| Smear | ≥ 2 rendered frames | ≥ 2 | ≥ 2 | ≈ 70 ms | ≈ 70 ms | ≈ 70 ms |
| Action lines | — | — | Local streak, ≈ 200 ms | Radial on 20% of the edge, ≈ 300 ms | Radial on 40% of the edge, ≈ 400 ms | Full-field (Ink/Cream), ≈ 600 ms, plus cut-in |
| Impact frame | — | — | — | Local disc ≤ 15% of screen, 2 frames | Full-screen mid-tone inversion (luminance change ≤ 0.10), 2 frames, plus a 2-frame effect-shape flash | Full-screen, 3 frames plus 2 |
| Glyph / lettering | — | Spark | 1 glyph, 0.6 m | Glyph burst of 2–3, 1.0 m | **Lettered word**, ≈ 12% of screen height, ≈ 500 ms | **Giant lettered word**, ≈ 30%, ≈ 800 ms |
| Dust | 2 puffs | 3-puff ring | 5-puff ring | Ring plus trail | Ring plus crack decal | Cloud 3.5 m across (Team Pile-On) |
| Camera punch-in | — | — | 1.5% | 3% | 6% | Authored, ≤ 15% |
| Time dip after hit-stop | — | — | — | — | 30% for ≈ 200 ms | 20% for ≈ 500 ms (final Rout only) |
| Rumble (low/high, 0–1) | 0/0.1 | 0/0.25 | 0.35/0.3 | 0.55/0.5 | 0.85/0.7 | 1/1, 3 pulses then decay |

**Rules:**
1. **Player authorship:** hits from AI cats acting on their own render **one tier lower** and never cause global hit-stop, full-screen effects or lettering. Commanded hits and every Special (the chain starts from Mikan's F) render at full tier. A Move's banner, colour, wind-up and VFX are never lowered (§3.3).
2. **One screen-wide channel:** full-screen frames, full-field lines, cut-ins and giant words share it. A higher tier pre-empts a lower one, and equal tiers queue at least 170 ms apart. **A Tough Rout gets its full-screen frame only if player-authored and only if no full-screen frame played in the last 1 s; otherwise it downgrades to local.**
3. **Shake (one model):** each event plays the table's stepped pattern (peak %, one step per 33 ms, ×0.6 decay per step). When patterns overlap they are **summed and clamped**: total displacement never exceeds **1.8% of viewport height**, and a new pattern never restarts a louder one already running. There is no separate trauma curve. The motion option scales it to 0–100%. Camera plays it back (`camera-system.md`).
4. Multi-hit Moves: only the first and last hits use the Move's tier. A multi-target hit gets one hit-stop and one shake.
5. **Caps:** 4 glyph bursts / 20 glyphs alive (PC). 60 dust puffs. Nothing covers Mikan's ground ring or an active telegraph decal, and telegraph decals draw above dust.
6. **Timers** (Frazzle, Ruffled, statuses, cooldowns) **stop during global hit-stop**, run at 5% on the skill bar, and stop during the stagger presentation and the Special chain. Time dips ease out over ≈ 100 ms.
7. **Incoming hit on Mikan:** same tier as the enemy's class (white T1/T2, yellow T3, red T4), but hit-stop is local and 75% as long, with an **Ink/halftone edge pulse** (≈ 150 ms, alpha 0.35) instead of an impact frame. The pulse is never coral, which is Koharu's colour. Hits on AI cats render two tiers lower with no shake.
8. **Paw-fill feedback:** a drawn flat disc with a halftone edge at the cat's feet (Art's "glow"), plus a per-slot audio cue.
9. **Stagger presentation** (§3.6): full or light treatment; it shares the screen-wide channel and its blink pulses count as flashes.
10. **Special cut-ins** (§3.6; cut-ins in a chain are sequential, M1.2): each cut-in is one screen-wide event. Its impact-frame background is a held drawing (no flicker); entering it is one full-screen frame under the ≤ 1 per second cap, so cut-ins in a chain start ≥ 1 s apart (≥ 0.5 s shortened cut-ins use a cut with no luminance change). Time stop is not hit-stop and is not counted against the 200 ms global hit-stop budget; it is an authored T5 sequence.
11. **Hit flash (M1.2):** every cat hit (Mikan, Crew, enemies) flashes for **≈ 120–150 ms** (`hit_flash_ms`; was shorter in M1.1), character-local: a 2-step Cream body flash, never a screen flash.
12. **Perfect Evade** (§3.2): time ×0.3 for ≈ 0.4 s, a local Cream afterimage on Mikan; not a flash; ≤ 1 per second.
13. **Final KO** (§3.14): an authored T5 sequence (freeze ≈ 0.3 s over an impact background, ≈ 1.5 s slow motion); its freeze is the second's one full-screen frame.

**Safety (DR-50; the default configuration must pass an automated Harding-style analysis):**
- ≤ 3 flashes in any 1 s (WCAG 2.3.1, area > 20%), with a **design cap of 2/s and 6 per rolling 5 s**.
- ≤ 1 full-screen impact frame per second (any extra downgrades to local).
- No saturated red change over > 5% of the screen; full-field lines in Ink/Cream; lettering in Ink/Cream or the damage-type colour.
- Every look event lasts ≥ 2 rendered frames; shake is stepped.
- **Global hit-stop ≤ 200 ms in any rolling 1 s** outside authored T5 sequences (excess is dropped, not queued).
- **Reduce Flashes:** impact frames become a +1 px line hold with no luminance change. **Reduce Motion:** shake, punch-ins and full-field lines are scaled together.
- **Hit flash (M1.2):** character-local only (the hit cat's body), never a screen flash; it is not counted as a screen flash but obeys ≤ 3 per second per cat.

**Lettered onomatopoeia (DR-49), which events letter:**
- **Only T4 and T5, and only when player-authored.** At most one word on screen. Never over Mikan or the HUD. World-anchored. Never at home.
- Event → word class: Claw hit → *scratch* word; Thump → *thud* word; Yowl → *yowl* word; Frazzling hit → *pop/burst* word; Back Down → *hiss* word; Team Pile-On final beat → *dust-cloud* word (KA-BLAM); Boss phase break → *crash* word; leader Rout → *bolt/whoosh* word.
- Art supplies about 16 hand-lettered words per language from these classes. Japanese uses native onomatopoeia.

**Audio timing (SB-X13):** Combat owns *that* a cue exists and *when* it plays; Audio owns the timbre.
- Ruffled: cue on onset, held 4 s.
- Frazzled: a swell on the Frazzle, then a tick on each beat through the 6 s.
- Skill bar: a cue on open and on close.
- Paw: a cue per slot.
- Hit-stop freezes audio within its scope.
- Telegraph vocals by class; the Hiss sound belongs to the acting cat.

**Camera and readability (DR-48; camera states owned by `camera-system.md`):**
- The combat camera sits behind Mikan at ≈ 3.8 m (`camera-system.md` §3.2) and frames **Mikan, the lock target when locked (otherwise the nearest threat ahead) and every active telegraph**. It does not try to frame every combatant.
- Edge arrows mark off-screen Posse cats and attackers.
- **Outlines (M1.2):** Posse cats (and an allied guest) carry a **yellow** (Bell-Gold) outline plus an overhead tick; **enemies carry a red outline plus a small red chevron over the head** (the shape cue, so colour is never the only signal). Both have a 1 px Paper Cream rim. The red is Art's (`art/art-bible.md` §4.2), kept apart from Frazzle Magenta (telegraphs, Frazzled outline) and from Koharu's coral; a Frazzled enemy's outline turns Magenta as before.
- **World text in real-time combat:** only the single bark balloon, one lettered word, Move name banners (§3.3) and the **F** Special prompt (key glyph plus the word "Special" on its first 3 showings; glyph only after that). **Damage numerals are On by default** (owner M1.2, reversing presentation ruling R3's Off), with an Options toggle All / Big hits / Off (UX owns the display). Weakness and resistance read from the spark shape (an extra Ink crack wedge on a weak hit, a blunted spark on a resisted one; Art).
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
flat chunks (ignore r_rank and Ruffled): Splat 20 · bonded chain +10 (riders) ·
  Braggart first hit 20 · Fear 30/20/15 (Tough/Captain/Boss)
```
Basic FZ: Mikan's L-L-L 8, 8, 14 (30 per string); L-L-L-H adds 24 (54 per finisher string); launcher 16; charged heavy 16 / 24 / 32; Lunge 10 (§3.2). AI combos 8, 8, 14. Pounce F7. *(M1.1: string values are starting values; the sim's data and tests own the re-baseline.)*

### F3. Pounce Gauge (Paws)
```
ΔP = fill × (4/s passive [0 while perched] + 4 per string hit landed + 6 per finisher/Pounce) + grants
fill = 1.0 Mikan, ai_fill (0.5) Crew      grants: Ambush 25 · Well-Fed 25 at the start · Fraidy perfect Evade 25
cap = 200 (2 Paws)
```
*Mikan:* at 65% attack uptime that is 0.65 × 3 hits / 1.8 s = 1.08 hits/s × 4.67 average = 5.1, + 4 passive = **9.1 pts/s → 1 Paw per 11 s**.
*AI cat:* 0.5 × (4 + 0.35 × 1.67 × 4.67) = **3.4 pts/s → 1 Paw per 30 s**.
*Tag-Ins* † (removed in M1.1; was 0.05 Paw/s).
*Posse total:* 0.091 + 3 × 0.034 = **0.193 Paws/s** (was 0.242 with Tag-In grants; the sim re-baselines F9 on this).

### F4. Healing
```
heal = HealMV × B(L_h) × (Voice_h / S_ref(L_h)) × (1.5 if a Cowed enemy is within 6 m)
Total healed per cat per fight ≤ 0.60 × its max Nerve (Purr, Aria; Lick Wounds after the fight is outside the cap)
```
*Example:* a neutral Yowler's single Purr heals 3.0 × 4.5% = 13.5% of neutral Nerve, or 20.3% with a Cowed enemy nearby. A Bruiser ally (×1.3 Nerve) receives 15.6% of its own bar. It takes at least 3 Cowed Purrs to reach the 60% cap, which uses that Yowler's whole Paw income for about 90 s of AI time (CS-10).

### F5. Specials and the Team Pile-On (M1.2: Special any time, sequential chain, full burst on top)
```
Special (each cat):   SP = sp_mv(style) × F1 multipliers (incl. F = 1.5 if Frazzled) × (sp_stagger_bonus if Frazzled) × Bond_cat
                      sp_mv from specials.* (Midnight Laps 4 × 1.2 on all enemies · Landslide 12 primary, 4.8 path · Midnight Aria 3.0 ring-wide)
                      sp_stagger_bonus = 1.25 (the "bonus Special damage" on a staggered target)
                      Bond_cat = 1.25 for the second of two bonded cats fired back to back, else 1
Team Pile-On (full burst, only if all four land):
                      TPO = Σ_4 cats (pile_on_base + pile_on_k × T_rem) × TypeMod_cat × 1.5      added on top of the four SPs
                      pile_on_base = 2.0 MV · pile_on_k = 1.0 MV/s · T_rem = seconds left of the Frazzle window at F (0 if not Frazzled)
Below Captain:        a Special on a Frazzled target Routs it; a Team Pile-On Routs every Frazzled enemy < Captain within 3 m
Pips shown = ceil(T_rem / 1.2)  (5 → 0)
```
*Worked (Captain at T_rem 6, neutral matchups, no bonded pair):* Mikan's Midnight Laps on the staggered Captain = 4.8 × 1.5 × 1.25 = **9 MV**; a Bruiser's Landslide = 12 × 1.5 × 1.25 = **22.5 MV**; a Yowler's Aria = 3.0 × 1.5 × 1.25 = **5.6 MV**; with a second Scrapper the four Specials are ≈ 46 MV, and the full burst adds 4 × (2 + 6) × 1.5 = **48 MV**, ≈ 94 MV in all. The same chain on an un-staggered Captain: SPs ≈ 25 MV and the full burst 4 × 2 × 1.5 = 12 MV. **Waiting for the stagger is worth ≈ 2.5×**, and firing early in the window keeps the full burst's T_rem term high.
*Decision:* F the moment the meter is full (a sure ≈ 25 MV), or hold it for a stagger and for Crew meters (up to ≈ 94 MV). Paw-dumping first still costs T_rem on the burst (F5's k > 0.75 rule).
*Numbers:* `sp_mv`, `pile_on_base`, `pile_on_k` are the sim's data (`prototypes/artifact-slice/src/data/combat/specials.json`, `combat_constants.json`; F15: sim data wins for numbers). `sp_stagger_bonus` and `Bond_cat` are design values the sim does not use yet (follow-up F15).

### F6. Command (replaces Tag-In and Relay)
```
Commanded Move: the Move's own MV/FZ (§3.10); ×1.5 inside a Frazzle window; no pathing in the window
Bonded chain:   the second of two bonded cats fired back to back in a chain: MV ×1.25, +10 FZ on rider targets
Steel:          a command to a Cowed-by-nerves recruit ends the status (F11)
```
*Removed:* the Tag-In strike (MV 1.5, FZ 20, 25 Pounce points to both cats) and the Relay flat bonus (+10/+15/+20; ≈ 61 FZ for a four-cat Relay on a Captain). Their share of the Captain build (≈ 1.0 FZ/s in F9) and of Paw income (0.05 Paw/s in F3) is gone; the heavier strings (§3.2) and the chain are meant to cover it, and the sim re-baselines F9.

### F7. High Road Pounce (Wind-Up)
```
MV = 1.5 + 0.5 × t_aloft (max 3.0 at 3 s) · FZ = 15 + 10 × t_aloft (max 45) · ×0.6 and no Paw points if within 1.5 s of mantling
```

### F8. Special meter gain (was Zoomies gain)
```
+sp_per_hit (2) per hit landed × fill (1.0 Mikan, ai_fill Crew) · +1 per 1% of own max Nerve lost (≤ +40 per encounter)
+10 to every standing Posse cat on each enemy Frazzle · gauge 100, emptied by its Special, persists through the day
Well-Fed: Mikan starts the day at 5% × Bond hearts (max 50) · Life 1 tutorial: Mikan and the wall cat start full
```
*Pace (design intent; the sim owns the numbers):* Mikan lands ≈ 1.1 hits/s at 65% uptime, so ≈ 2.2 + Frazzle and damage terms ≈ 50–60 per Captain Frazzle cycle (≈ 18 s): **Mikan's Special about every second stagger of a Captain and about once per normal encounter**; a Crew cat (≈ 0.6 hits/s × 2 × 0.5) about half as often, so a full four-cat chain is a Captain-or-Boss event, a few times in the Daifuku fight. This replaces the old Zoomies pace (≈ 1 per cat per 2 encounters; B-19).

### F9. Reference model: the fight-length arithmetic (Alley, same level, neutral matchups)

This is the **expected-value spec for the encounter sim (DR-57)**, not a substitute for it.

> **M1.1 re-baseline pending (owned by the sim's data and tests).** Every figure below was computed with Tag-In strikes, Relays, Tag-In Paw grants and an always-available Pile-On. Owner direction M1.1 replaces them with the meter-gated Special chain (F5, F8), Mikan's heavier strings (§3.2) and attack-token AI (§3.11). The **bands** (Tough 6–10 s, normal 30–60 s, Captain 30–45 s, Daifuku 2–3 min, incoming 15–25% / 50–80%) and the ACs are unchanged; terms that no longer exist are marked †, and "Pile-On" below reads as "Special chain". The sim and the M1 tests own the new numbers; this hand model is not re-derived here.

**Iteration 3 — sim-checked figures (these replace the hand claims below where they differ).** The round-2 sim (`design/reviews/round-2/sim/combat_slice_sim.py`, deterministic) shows the hand model below is optimistic by 0–25%, because it treats Paw income as continuous Move damage (no Move is affordable inside a Tough-length fight) and the catalogue averages ≈ 2.1 MV / 20 FZ per Paw, not 3.5 / 30. Ranges are *doc variant – slice variant* (slice = Crew's Lv 8 stats and the slice Posse):

| Fight (ruled band) | Hand claim below | **Sim (canonical)** | In band? |
|---|---|---|---|
| Tough, focused in a group (6–10 s) | 7.9 s | **9.7–10.7 s** | Upper edge |
| Tough, last enemy (Quick Pile-On †; now a Special) | — | **5.6–5.7 s** | ✓ |
| Skirmish, 2 / 3 Toughs (A2) | 16 / 24 s | **18–21 / 25–28 s** | ✓ (A2) |
| 4 / 5 / 6 Toughs (30–60 s) | 31 / 39 / 44 s | **33–36 / 40–44 / 48–53 s** | ✓ |
| Captain, any Style (30–45 s) | 36.7 s (Bruiser 44, Yowler 33) | **37 s; Bruiser 37–44 s** (after `captain_style_nerve` = off, §3.12) | ✓, 2 Frazzles each |
| Captain, expert policy (≥ 21 s) | 25 s | **27–31 s** (Bruiser 35 s) | ✓ |
| Daifuku (120–180 s) | 140 s | **166–176 s** at one knock-off per 8 s of wall time (≈ 14 s cycle); Frazzles per phase 2/3/2 – 3/2/3 | ✓ but fragile: 10 s of wall time → 175–185 s, 24 s → 206 s († M1.2: no wall; re-run on the ground pattern) |

The single retune is `captain_style_nerve` = off (the ×1.3 Bruiser Captain ran 55–58 s). Every other line is a corrected figure, not a retune. The hand derivation below is kept as the explanation of *why* the bands hold.

**Owner feedback pass (2026-11-24) — Daifuku under the new rules.** Sim: `design/reviews/owner-feedback/sim/combat_slice_sim.py` (round-2 model unchanged, so every line above reproduces exactly; output `combat_slice_sim.out.txt`, before `combat_slice_sim.before.out.txt`). It adds F10's incoming damage, Purr heals, Routs and the wipe, plus F11. Slice variant, same level, Alley, one knock-off per 8 s of wall time; "landed" is the share of his swings that land (good 35% / median 50% / poor 65%).

| Daifuku case | Fight length | Posse Nerve lost (before heals), median | Notes |
|---|---|---|---|
| Before (round 2, no incoming model) | 175.6 s | — | Reproduced exactly with incoming off |
| Calm / Riled 20 s / Seething 40 s / Furious all fight | **175.5 s at every stage** (wins at good, median and poor dodging) | **52.3 / 54.0 / 56.1 / 60.6%** (good 37–42%, poor 68–79%) | Fired Up changes his damage only, so a win takes the same time; all inside F10's 50–80% band |
| Where the expected-value Posse wipes | — | — | Calm at ≥ 95% landed, Riled 93%, Seething 91%, **Furious 83%**; a lost attempt lasts ≈ 190 s with ≈ 90–96% of his Nerve gone |
| Rematch at −10%, anger spent (Calm) | **157.2 s** (161 s good dodging) | 45.7% | Wipe line ≥ 98% landed |
| Kagi Cowed 20 s, cleared by the first Tag-In † (≈ 10 s; now the first skill-bar command to Kagi) | 176.0 s | 52.3% | **+0.6 s** |
| Kagi Cowed 20 s, no answer (Fraidy 30 s: same) | 179.7 s | 54.0% | **+4.3 s** at every anger stage; the cost is quantised by the Frazzle cycle |
| Nose-Touch ally (Togemaru, guest), family Posse | **161.7 s from the start / 169.5 s with the phase-2 wave** (no ally 175.5 s) | 40.9% / 45.8% (no ally 54.2%) | −14 s / −6 s; Furious with the ally from the start 162.2 s, 47.0% lost. In the slice Daifuku has no Rival tag, so the reachable case is the phase-2 wave holding Goma |

**What the numbers say.** Anger is a *pressure* knob, not a *length* knob: the fight stays 2.6–3 min at every stage, and the stage shows up as Nerve lost and as how much dodging the player can get wrong before a wipe. A Cowed recruit costs ≤ 5 s even unanswered, so the flinch is a beat and a prompt to command the recruit, not a tax. A join-in ally is worth ≈ 8% of the fight and ≈ 13 points of Nerve. The expected-value model wipes only under very poor dodging; the reference path's lost L2D4 attempt (`day-loop.md` §3.10) is a first-attempt assumption that variance and under-levelling supply, and Furious makes it more likely.

**Rates per cat (from F1–F3):**

| Source | MV/s | Raw FZ/s |
|---|---|---|
| Mikan, basics (string 3.5 MV and 30 FZ per 1.8 s × 65% uptime; M1.1 strings re-baselined by the sim) | 1.26 | 10.8 |
| AI cat, basics (× 35% uptime) | 0.68 | 5.8 |
| Posse basics (1 + 3 AI) | **3.30** | **28.2** |
| Moves (0.242 Paw/s † (0.193 in M1.1) × 3.5 MV / 30 FZ) | 0.85 | 7.3 |
| Tag-In strikes † (1 per 10 s; removed) | 0.15 | 2.0 |
| **All four on one target** | **4.30** | **37.5** (8.7 FZ per MV) |

**Focus factors**, the share of that output that reaches the target:
- Tough under focus: Mikan + 1 AI.
- Normal group: 0.55 (targets split, 4–6 attackers to dodge, token posturing).
- Captain: 0.75, with half the Paws banked for the window, which gives **2.91 MV/s** and **25.4 raw FZ/s**.
- Boss: 0.85 on the ground (M1.2: he no longer fights on a wall; the old 0.5 wall focus is †).

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
- Build: 25.4 × 0.20 = 5.08 FZ/s, × 1.25 for 25% Ruffle uptime (Hiss on its yellows, a prop; capped at 40% by the cooldown) = 6.35, + a 2-cat Relay † every 10 s (+1.0) = **7.35 FZ/s** (6.35 without it).
- So it Frazzles after **13.6 s**, by which time the Posse has dealt 13.6 × 2.91 = **39.6 MV**.
- Window: F5(c) = **55.1 MV in 4 s**.
- One cycle = 17.6 s and 94.7 MV, leaving 83.1 MV. The second build (13.6 s, 39.6 MV) leaves 43.5 MV, which an early Pile-On finishes in about 3.5 s.
- **Total ≈ 17.6 + 13.6 + 3.5 + 2 (opening) = 36.7 s ✓**, with 2 Frazzles.
- Style spread: Captains take no Style Nerve multiplier (§3.12), so every Captain has 177.8 MV; a Bruiser Captain is slower only through its Hide (sim 44 s in the slice variant) ✓.
- Expert policy (a 4-cat Relay † per cycle; now four-cat chains, 40% Ruffle uptime): **≈ 25 s**. That is allowed down to 0.7 × the band floor, which rewards skill.

**Daifuku (target 2–3 min; Nerve 26 × 22.2 = 577.8 MV; phases 173 / 202 / 202 MV).** *M1.2: the knock-off cycle below is † (he fights on the ground; the belly-flop landing's 2 s Ruffled window replaces the knock-off as his Frazzle route). The sim re-baselines his fight on the Boss pattern; the 2–3 min band stands.*
- **Knock-off cycle (≈ 14 s):**
  - Wall, 8 s at focus 0.5: 1.94 MV/s gives 15.5 MV; 16.9 × 0.15 = 2.54 FZ/s gives 20 FZ.
  - Knock-off into the bucket: 30 FZ flat.
  - Ground, 6 s at focus 0.85: 3.29 MV/s gives 19.7 MV; 4.3 FZ/s, ×2 for the 4 s Ruffled, gives 43 FZ.
  - Relays †: 14 FZ.
  - Cycle total: **35 MV and 107 FZ**, so about one Frazzle per knock-off (≈ 13 s of building, ≈ 33 MV).
- **Window:** 1.5 s × 2.8 × 1.5 = 6.3, + 10.5 (2 Paws), + 39 (Pile-On) = **55.8 MV in 4 s**.
- **Frazzle cycle:** 17 s and ≈ 89 MV. 577.8 / 89 = 6.5 cycles, about **110 s**.
- Add 2 phase breaks (7 s), the opening (3 s) and the phase 2–3 Tough waves (≈ 20 s): **≈ 140 s = 2.3 min ✓**.
- **Frazzles per phase:** 1.9 / 2.3 / 2.3, so every phase has ≥ 1 ✓ (DR-32).
- At −30% plastered, the fight takes **≈ 1.7 min** (a deliberate story-player assist).

**Crew share (DR-33, target ≥ 55%).** The player controls Mikan the whole fight (always, under M1.1). Basics: Mikan 1.26 against Crew 2.04. Moves: Mikan's 0.32 against the Crew's commanded Paws 0.53. Special chains: 3 of 4 Specials when all meters are ready. **Crew share ≈ 62% in trash fights and ≈ 66% against a Captain ✓.**

**Commander share** (was conductor share). Against a Captain, commanded Moves, Tag-In strikes † and Pile-Ons † were 4.3 + 1.5 + 49.5 = 55.3 of 94.7 MV per cycle, **≈ 58%** (CS-5). Under M1.1 the share is commanded Moves plus Special chains; the sim re-measures it against AC 3.

### F10. Incoming damage model (CS-12)

**Normal 5-Tough encounter (≈ 40 s):**
- Token holders attack once per 4.5 s at about 1.5 MV each. About 55% of enemies are still standing on average across the fight.
- Mikan: 2 tokens × 8.9 attacks × 1.5 MV × 40% landed = 10.7 MV.
- AI cats: 3 × 8.9 × 1.5 × 60% = 24.0 MV.
- Total 34.7 × 0.55 = **19.1 MV ≈ 21% of the Posse's 89 MV of Nerve** (target 15–25% ✓).

**Daifuku (≈ 140 s):**
- He attacks every 4 s for 2 MV × 1.6 = 3.2 MV (M1.2: the Belly-Flop Shockwave is MV 3.0 × 1.6 and is evadable; the sim re-measures), about half of which lands: 35 attacks × 3.2 × 0.5 = 56 MV.
- The Tough waves add about 8 MV.
- Total 64 MV = **72% without heals** (target 50–80% ✓).
- Purr can recover at most 60% per cat, so the fight stays tense but survivable.
- **Sim (owner feedback pass):** with his swings held while he is Frazzled, during Pile-Ons (now Special chains) and during phase breaks, the 175 s fight costs **52% at the median** (37% good dodging, 68% poor). **Fired Up** (F11) multiplies the swings it covers by 1.25: Riled +1.7, Seething +3.8, Furious +8.3 points at the median; poor dodging while Furious reaches 79%, still inside the band.

### F11. Fight-start statuses: anger and nerves (OR-06, OR-07)

```
Fired Up on a Boss:  D_out = D × fu_dmg   while  fu_left > 0  and the Boss has no newer status
                     fu_left(0) = anger_fu_s[stage]       stage ∈ {Calm, Riled, Seething, Furious}
                     fu_left decreases only while the anger Fired Up is active (paused under Soggy)
Cowed on a recruit:  D_out = D × cowed_dmg ; AI target set excludes old_boss_id
                     while  t < t_seen + nerves_s[personality]  and no skill-bar command to it since t_seen
                     applies iff  old_gang_nerves = true  and  Loyalty < 80  and  old_boss_id ∈ opponents
```

| Variable | Meaning | Value (range) |
|---|---|---|
| `fu_dmg` | Fired Up damage multiplier (existing status) | 1.25 (1.15–1.4) |
| `anger_fu_s` | Seconds of Fired Up by stage | Calm 0 · Riled 20 · Seething 40 · Furious ∞ (the whole fight) |
| `cowed_dmg` | Cowed damage multiplier (existing status) | 0.75 |
| `nerves_s` | Seconds Cowed at the sight of the Old Boss | 20; Fraidy 30 (10–30) |
| `t_seen` | Standoff end, or the moment a wave brings the Old Boss in | — |

*Example (Furious Daifuku, median):* he swings every 4 s for 2 × 1.6 = 3.2 MV, half lands = 1.6 MV; Fired Up makes it 2.0 MV, +0.4 MV a swing. About 20 of his swings fall outside his Soggy windows (the rest land while he is doused, or are held by Frazzles, Special chains and breaks), so the Posse takes ≈ 8 MV more of its 97 MV of Nerve: 52.3% → 60.6% (sim). *Riled:* 20 s of buff is 5 swings × 0.4 MV = 2.0 MV ≈ +1.7 points. *Kagi Cowed and unanswered:* 20 s × 0.68 MV/s (AI basics) × 1.08 (a Yowler on a Bruiser) × 0.5 (wall focus) ≈ 7 MV withheld, ≈ 1.3% of his 578 MV, which costs 4.3 s once the Frazzle cycle rounds it.

---

## 5. Edge Cases

1. **Frazzled at a phase gate:** damage clamps; the break waits until the window or Special chain ends; overflow up to 10% of max Nerve carries over. A chain started on a clamped Frazzle plays the break as its last beat.
2. **Phase gate reached with Frazzle at 95:** the gauge is kept through the break, so the first hits in the next phase can Frazzle him.
3. **Special chain while a second enemy attacks:** the cats in the chain are invulnerable, and enemies outside it hold their attacks until it ends. A red windup already in progress pauses.
4. **F with no enemy within 8 m:** nothing fires and the meter is kept. **Mikan Routed:** F is unavailable.
5. **Team Pile-On with 3 Frazzled Toughs, two within 3 m of the target and one 5 m away:** only the two are Routed. The third stays Frazzled. A single Special Routs only its own target.
6. **Last enemy is a Captain:** F5's value applies; auto-Rout applies only below Captain.
7. **F pressed with the meter not full:** nothing fires; the prompt is not shown, and the plate's meter pulses once. **A Crew cat's meter fills mid-chain:** it does not join that chain (eligibility is fixed when F is pressed).
8. **Lock-on (M1.2):** Tab while locked always unlocks. Tab with no enemy within 14 m: nothing. A flick with no enemy on that side of the screen: the lock stays. The locked enemy Routed, Backing Down or leaving the ring: the lock releases; it never jumps to another target by itself. **Evade on cooldown:** the press is dropped (not buffered); the HUD's cooldown ring shows why.
9. **Mikan Routed while Crew stand:** the player keeps the skill bar and the camera frames the nearest standing Posse cat; no F prompt. A `win` gets Mikan up at 20%; all four Routed is a `loss`. **Three fast clicks:** the first press starts the first Light; a later press is kept only if it falls in that attack's last 150 ms (the newest replaces an older buffered one); the string never queues more than one follow-up.
10. **Skill bar during a Frazzle window:** pips drain at 5% time. Commands skip pathing. The Special is not on the bar: close it and press F.
11. **Hiss on a red telegraph:** the cooldown is spent and nothing happens (the HUD shows a fizzle glyph). Red is never interruptible.
12. **Two yellow windups at once:** one Hiss interrupts only the attacker in front within 4 m. Interrupting several is a job for the commander (force two cats' Hisses from the skill bar).
13. **Back Down on a Tough that is Frazzled:** allowed. Back Down beats the Special prompt, and the event `CatRouted(by_back_down)` is sent.
14. **Ruffle on a leader during its cooldown:** the Ruffle is ignored and a small "wise to it" glyph shows. Fear triggers still give their chunk and rider. Fed Up overrides the cooldown.
15. **Status replacement:** a Cowed enemy hit by a Soggy splash becomes Soggy, not Cowed. Purr's bonus checks Cowed at cast time.
16. **Damage-reduction stacking:** a Bracing (AI) Bruiser in Puff Up next to a Stalwart is 0.3 × 0.7 × 0.85 = 0.18, floored to **0.30**.
17. **Heal cap reached:** further heals on that cat show a capped glyph and do nothing. Purr cannot be cast at a capped cat from the skill bar (greyed).
18. **Knock-off of an enemy with the Strength "cannot be knocked off":** the enemy stops at the edge, and knockback becomes a flinch. (Bosses fight on the ground and are never knocked off, M1.2.)
19. **Crow knocked off the High Road:** it flies; there is no Splat. Crows are exempt from knock-offs.
20. **Fear prop triggered by the enemy side:** it applies to every cat in range, Posse included, if a Crew cat carries that Fear (recruited Rivals keep their Fears).
21. **Belly-Flop Shockwave with Mikan mid-attack:** an Evade cancels the attack at any frame and its i-frames cover the ring; a perfect Evade opens the counter window. Crew AI evade the ring by their personality's dodge rule; a Crew cat caught is knocked down 1.0 s.
22. **Wipe during a Special chain:** impossible (the cats in it are invulnerable; Routed cats are not in it). A wipe in the frames after it resolves normally (`loss`).
23. **Fed Up during a Frazzle window:** the window is unaffected. Ruffled applies after it ends.
24. **Ambush by player on a group:** only the first target is Ruffled and takes ×1.5. The rest start neutral.
25. **Degenerate strategies checked:**
    - **Stun-lock:** poise rules cap a leader's lost action time to ≤ 4 s outside Frazzled, Splat or Fear.
    - **Turtle:** red attacks and Fed Up.
    - **Mantle-pounce loop:** the 1.5 s penalty.
    - **Heal loop:** the 60% cap.
    - **Paw farming:** no self-refunds, and AI never spends its last Paw.
    - **Hiss loop on leaders:** the interrupt spends the enemy's Paw, puts the Move on cooldown, and the re-Ruffle cooldown applies.
    - **Never command:** commanded Moves and the Special chain carry the commander share (AC 3, AC 5). The sim checks that the command rate is > 0 in the best policies.
    - **Heavy spam:** Heavies build Frazzle faster but recover slower and the finisher commits; the one-slot buffer stops mash queues; tokens cap incoming, not outgoing, so dodging still matters.
    - **Special stalling:** a meter never overfills, and an unused meter does nothing outside a stagger.
    - **Lose on purpose to end the day** (owner feedback): a wipe is dominated by Settle In in every currency (Day Loop §3.6, Territory §4.13); Combat adds nothing that rewards it.
    - **Scram-reset anger:** closed, Scram does not spend it (edge 32).
26. **Wipe with a join-in ally standing:** the guest is not Posse, so all four Posse cats Routed is a `loss` even if the guest still stands. It slips away at the Gloat; it gains no Regard and nothing is recorded on it.
27. **Wipe while a recruit is still Cowed:** a normal `loss`. The flinch writes nothing anywhere; next time it sees its Old Boss it flinches again unless Sworn by then.
28. **Cowed recruit when the Old Boss is the only opponent** (Daifuku's phase 1): its AI has no target, so it postures at 4–6 m, Braces, and still Hisses yellows aimed at itself. It still fills Paws (passive only). A skill-bar command to it is the answer.
29. **Old Boss arrives in a wave:** the flinch starts when he enters the ring (`t_seen`), not at the Standoff. A Cowed recruit hit by a newer status (Soggy) loses the Cowed early under the one-status rule; the AI exclusion ends with it.
30. **Two susceptible recruits from the same gang:** each flinches on its own memory and needs its own command. The Old Boss's behaviour is the same either way.
31. **Anger Fired Up and Soggy:** any Soggy on him (a water prop's splash, if the arena has one) pauses anger's Fired Up, which resumes with its remaining time. A Furious Boss is Fired Up again as soon as he is dry. Big Yowl's Fired Up on his **Toughs** (phase 2) is the move's own effect and has nothing to do with anger.
32. **Scram from a Furious Boss:** `player_fled`; anger is not spent and he is still Furious at the next Standoff (unless a night's −15 dropped the stage). Re-engaging is never a calm reset.
33. **Boss phase break, or a stop reached at a phase change:** the arena is the stop where the Standoff began. The clock is paused in combat, so `PhaseChanged` (and his walk to the next stop) cannot happen mid-fight; he walks on after `EncounterEnded`.
34. **Join-in rolled but no free slot (10 combatants):** the guest waits at the ring edge and enters when a slot frees. If the fight ends first, it never enters, and the join is not counted.
35. **The joiner's Rival is Routed or bolts before the guest arrives:** it still enters and fights the rest of the opponents; its target bias simply has nothing to point at.
36. **A Kin opponent is the last enemy standing:** the Kin AI cat postures and Braces; the others finish it. A Special chain includes the Kin cat if its meter is full (player-authored).
37. **Togemaru on Life 1 day 1 Frazzled or Splatted at 25%:** he still bolts (the day-1 exception overrides both). On every later day the normal flight rule applies.
39. **Cornered cat with tokens taken:** it lashes out anyway (§3.11); against Mikan this can briefly make 3 attackers. That is allowed; the 300 ms spacing between hits landing on one cat still holds.
40. **Last opponent Routed by a Crew cat's own AI hit:** the Final KO still plays (it marks the end of the fight, not authorship). **During a Special chain:** it plays after the chain.
38. **Loss in a `raid_defence` brawl (the Caterwaul):** a normal `loss` for the day (Day Loop §5). The raid result is Territory's formula with the presence term; the brawl's outcome moves no Scent.

## 6. Dependencies

| System (doc) | Direction | Contract |
|---|---|---|
| Nemesis (`nemesis-system.md`) | ← reads | `RivalCombatProfile` (level, style, personality, moves, strengths, fears, title, scars, `flee_threshold`; **+ `anger_stage`** on a Boss; on Crew cats **`old_gang_nerves`, `old_boss_id`** (from the cat's own Memory) and **`kin_ids`**, OR-20); `AngerChanged` (read at fight start only); `AllyJoined(cat_id, encounter_id)` (the guest, §3.14); Togemaru's Life 1 day 1 uninterruptible flee flag; Memory query for Old Score; leader levels per §3.12; Daifuku's trait kit must not include "cannot be knocked off"; his patrol-stop placement (Nemesis places, Territory opens the window) |
| Nemesis | → emits | `EncounterStarted`, `CatRouted` (incl. `by_back_down`, `by_pile_on` = a Special or Team Pile-On Rout, name kept), `FearTriggered` (incl. `source = tell`), `EncounterEnded(outcome ∈ {win, loss, player_fled, rival_fled})` (Nemesis spends anger on win, loss, `rival_fled`; writes the victor's `WON` and Title on a loss; +5 Regard to a joiner on a win); Verdict hold at the ring edge. **Combat never changes any cat's record; it reports outcomes** |
| Crew & Progression (`crew-and-progression.md`) | ← reads | Stat curves `N_ref`, `S_ref`; per-cat stats; learnsets by `move_id`; Mikan's ≤ 2 cross-Style Moves; bonded/clashing pairs; Specials (no unlock level under M1.1, §3.7). Crew's personality sheets point to §3.11 for every combat value; **Loyalty for the Sworn check on Old Gang Nerves (§3.5); two Kin in the Crew are a bonded pair (§3.3: bonded chain bonus)** |
| Crew | → emits | `MoveUsed` (with `commanded`), `SpecialChain(target, cats[], team)` (replaces `TagIn`), `EncounterEnded` (XP, Loyalty "Routed in a lost fight") |
| Territory & Economy (`territory-management.md`) | ↔ | `raid_defence` opener with Sentries as allied AI; `EncounterEnded` for loot; no prices here. **No combat outcome moves Scent or influence** (G5: the presence rule and "fight to clear, spray to claim" are Territory's); `BossWindowChanged` decides whether Daifuku can be fought at all |
| Day loop (`day-loop.md`) | ↔ | Reads the Well-Fed flag (DR-20), the phase (Night Rivals; Daifuku's stop) and pauses the clock. **Hands it the loss:** `EncounterEnded(outcome = loss)` after the Gloat; Day Loop jumps the clock to Night, closes the street and sends Mikan home (§3.6 there). Tutorial fights cannot wipe |
| Camera (`camera-system.md`) | → requires | Combat state (≈ 3.8 m behind Mikan, framing Mikan + lock target + active telegraphs); Tab lock/unlock with flick target switching and free orbit; the Final KO cinematic; the perfect-Evade slow-motion; the skill-bar view; the stagger zoom; the Special cut-in, the chain and the Team Pile-On; Standoff and phase-break cinematics; the reduced-shake option |
| UX (`ux/hud.md`) | → requires | The control map (§3.1, DR-08); the skill bar (R); Frazzle bar on the enemy with 5 pips; the F Special prompt (meter full; stagger bonus mark); the Evade cooldown on Mikan's plate; damage numerals On by default; Special meters and Move highlights on the plates (no control keys); Move name banners; the Tab lock-on indicator; identity ribbon for named enemies; edge arrows; beat sheet (§3.16); **the guest plate and truce-sprig tick for a join-in ally; the Cowed flinch and "steeled" (on command) read on a Posse plate; the Boss's Fired Up read (steam puffs on his ribbon) and its doused state** |
| Art (`art/art-bible.md`) | → requires | Drawings for every row of §3.17; telegraph decals and glyphs; 6 personality animation sets including Team Pile-On flourishes and the circling, stalking and posturing sets (§3.11); Mikan's five strings; Special cut-in art and impact-frame backgrounds (3 Styles); the shattered-glass stagger blink; per-cat colours, wind-up poses and Move VFX (§3.3); lettering sets |
| Audio (`audio/sound-bible.md`) | → requires | Cues per tier, the §3.17 cue timing list, 8 bark intents, a Rival yowl-sting for Ambush |
| Accessibility (`design/accessibility-requirements.md`) | ↔ | Mirrors the safety rules; Reduce Flashes and Reduce Motion; remapping; hold toggles |
| Narrative (`dual-story-progression.md`) | ← reads | Life 1 beats (DR-22); Life 8 Carry AI fill (Backlog) |
| Level design | → requires | Arena anchors (≈ 10 m ring, ≥ 2 props, a High Road ledge); **Daifuku's ground arena kit at each of the three patrol stops** (Laundry Pole Yard, Tofu Shop's back lane, the Den corner): a ≈ 10 m flat ring, noise prop, ledge junk above the ring edge, wave entries (M1.2: no wall, no wash tub, no knock-off edge) |

## 7. Tuning Knobs (`assets/data/combat/*`)

| Knob | Default | Safe range | Category | Rationale |
|---|---|---|---|---|
| `basic_hit_pct` (B/N_ref) | 0.045 | 0.04–0.05 | Curve | Canon 4–5%; drives every TTK |
| `string_mv` | 1.0 / 1.0 / 1.5 | ±20% | Curve | 3.5 MV per string |
| `string_fz` | 8 / 8 / 14 | ±25% | Curve | Tough Frazzles at about 50% Nerve |
| `string_cycle_s` | 1.8 | 1.5–2.2 | Feel | AI combo length; Mikan's strings re-baselined by the sim |
| `mikan_strings` (finisher, launcher, charge 0/1/2, lunge) | MV 2.0, 1.5, 1.5/2.2/3.0, 1.2; FZ 24, 16, 16/24/32, 10 | ±25% | Curve | Heavies build Frazzle faster than Lights (M1.1 §3); sim owns the re-baseline |
| `light_first_active_frames` | 1 (next sim tick) | ≤ 1 | Feel | M1.2 binding: near-instant Light |
| `heavy_windup_ms` | 300 | 250–350 | Feel | M1.2: readable Heavy anticipation |
| `buffer_window_ms` | 150 | 100–200 | Feel | One-slot buffer; earlier presses dropped |
| `moveout_at` | 0.60 of the total animation | fixed (owner) | Feel | M1.2 hard rule, every attack |
| `attack_steer_scale` | 0.30 of walk speed | 0.25–0.35 | Feel | M1.2: never locked in place |
| `evade_m`, `evade_s`, `evade_iframe_s`, `evade_cd_s` | 2.0, 0.3, 0.2, 0.8 | 1.6–2.4, —, 0.15–0.25, 0.6–1.0 | Feel | M1.2: one Evade, cooldown shown on the HUD |
| `perfect_evade_s`, `counter_window_s`, `counter_mult` | 0.15, 0.8, 1.5 | 0.1–0.2, 0.6–1.0, 1.25–1.5 | Feel | NieR-style perfect evade |
| `string_keep_after_evade_s` | 0.6 | 0.4–0.8 | Feel | The string survives an evade |
| `move_speed_mps` | = the Lane's fast walk (1.6 m/s, `src/entries/main.js`) | tied to the Lane | Feel | M1.2: combat pace = Lane fast walk |
| `skillbar_time_scale` | 0.05 | 0.03–0.15 | Feel | Time on the skill bar |
| `token_cooldown_s` | 2 | 1–4 | Feel | How often a token re-engages Mikan |
| `ai_spacing_m` | 3–6 (personality) | 2–8 | Feel | Circling distance (§3.11) |
| `stagger_fx_s` | ≤ 0.5 (full) / 0.15 (light) | ≤ 0.5 | Feel | Stagger presentation; flash caps apply |
| `ai_attack_uptime` | 0.35 | 0.25–0.45 | Curve | Crew share vs player authorship |
| `ai_fill` (per Life) | 0.5 | 0.4–1.0 | Gate | DR-35 |
| `paw_passive`, `paw_per_hit`, `paw_per_finisher` | 4/s, 4, 6 | ±25% | Curve | 1 Paw per 11 s controlled |
| `frazzle_res` (rank) | 1.0 / 0.20 / 0.15 | Captain 0.15–0.3 | Curve | 2 Frazzles per Captain, ≥ 1 per Boss phase |
| `frazzled_s`, `frazzled_dmg` | 6, 1.5 | canon | — | DR-28 |
| `ruffled_s`, `leader_reruffle_cd_s` | 4, 6 | canon | — | DR-28 |
| `frazzle_decay` | T 5/s @4 s; C 2/s, B 1/s @6 s | — | Curve | Clearing adds does not erase leader work |
| `sp_stagger_bonus` | 1.25 | 1.1–1.5 | Curve | M1.2: bonus Special damage on a staggered target (F5) |
| `pile_on_base`, `pile_on_k` | 2.0, 1.0 (sim data) | k 0.8–1.3 | Curve | Full burst on top, earlier in the window = more (F5); k > 0.75 required |
| `chain_range_m` | 8 | 6–12 | Gate | Which Crew chain |
| `cutin_s` / `cutin_repeat_s` | 1.0 / 0.5 | 0.8–1.2 / 0.4–0.7 | Feel | Chain ≤ ≈ 6 s |
| `rank_nerve`, `rank_dmg` | 1/8/20; 1/1.3/1.6 | canon | — | DR-31 |
| `captain_style_nerve` | off (Captains use ×1.0) | off / on | Curve | On puts a Bruiser Captain at 55–58 s, outside 30–45 s (sim, F9) |
| `focus_*` (sim policy only) | 0.55 / 0.75 / 0.5 / 0.85 | — | — | Model inputs, measured by the sim |
| `hiss_cd_s`, `back_down_pct` | 8, 0.15 | canon | — | DR-28 |
| `enemy_paw_s` | 16 / 9 / 6 | ±30% | Gate | Leader pressure |
| `tokens_on_mikan` | 2 (Alley) | 1–2 | Gate | M1.1: only 1–2 engage at once; incoming 15–25% |
| `heal_cap`, `dr_floor` | 0.6, 0.3 | canon | — | DR-31 |
| `fed_up_s` | 75 | canon | — | DR-31 |
| `bellyflop` (windup, ring 1→6 m over, knockdown, landing Ruffled) | ≥ 1,500 ms, 0.6 s, 1.0 s, 2.0 s | windup ≥ 1,500 · landing 1.5–3 s | Curve | Daifuku's pace (Boss pattern data) |
| `hit_flash_ms` | 135 | 120–150 | Feel | M1.2: longer, character-local |
| `damage_numerals_default` | All | All / Big hits / Off | Feel | M1.2: on by default |
| `cornered_*` (opponents within 3 m / 4 m, allies within 4 m) | 2 / 3 / 0 | — | Feel | M1.2 cornered-cat rule |
| `final_ko` (freeze, slow scale, slow s) | 0.3 s, 0.25, 1.5 s | — | Feel | M1.2 Final KO cinematic |
| `lock_flick_px` | 60 px of mouse travel (right stick 0.6) | 30–120 | Feel | M1.2 lock-on target switch |
| `pounce_windup` | +0.5 MV/s, +10 FZ/s, 3 s cap | — | Feel | Rewards waiting on a wall |
| `sp_per_hit`, `sp_dmg_cap`, `sp_per_frazzle` | 2, 40, 10 | 1–4, —, 5–15 | Curve | Special meter pace (F8): Mikan about once per normal encounter |
| Feel table rows (§3.17) | as listed | safety caps | Feel | DR-07; safety limits are not knobs |
| `fu_dmg`, `cowed_dmg` (the existing statuses) | 1.25, 0.75 | 1.15–1.4, 0.6–0.85 | Curve | OR-20: Combat owns the values. At 1.25, Furious adds ≈ 8 points of Posse Nerve lost at the median (F9, F11) |
| `anger_fu_s` (Riled / Seething / Furious) | 20 / 40 / whole fight | 10–30 / 30–60 / fixed | Gate | OR-07 tiers; a wider spread makes loud marking costlier |
| `anger_fu_pause_under_status` | true | bool | Gate | False lets the first soaking end a Riled buff; true keeps a tier's seconds honest (F11) |
| `nerves_s` (default / Fraidy) | 20 / 30 | 10–30 | Feel | OR-06. Unanswered cost ≤ 5 s on Daifuku (F9), so it is a beat, not a tax |
| `nerves_loyalty_ceiling` | 80 (Sworn) | 60–80 | Gate | Below it, a susceptible recruit flinches |
| `guest_entry_yowl_s` | 3 | 2–4 | Feel | OR-13: the join-in's arrival tell |
| `guest_ai_fill` | = `ai_fill` | 0–`ai_fill` | Curve | Guests spend only on `auto` Pay-offs; 0 makes them string-only (the sim's assumption) |
| `kin_posture_m` | 4–6 | 3–8 | Feel | Where a Kin AI cat waits when its Kin is the only target |
| `thorn_d1_flee_pct` | 0.25, uninterruptible | fixed | Gate | OR-14.5: the first Verdict is always day 2's |
| `bout.phase_cap` (Boss pattern) | 3 (slice) · 1 (showcase and M1) | 1–3 | Gate | At the cap: Final KO, bout ends (§3.13) |

## 8. Acceptance Criteria

**Simulation (DR-57; median policy, Alley, same level, 500 seeded runs per case):**
1. Tough under focus: median TTK 6–10 s. Normal encounter (4–6 threat): 30–60 s. Captain (+0–2 Toughs, Captain TTK): 30–45 s. Daifuku: 2–3 min. Expert policy is ≥ 0.7 × each band's floor.
2. Every Daifuku phase contains ≥ 1 Frazzle in the median run. Each Captain gets ≥ 2 Frazzles in ≥ 60% of runs.
3. Crew deal ≥ 55% of Posse damage (the player always controls Mikan). Commanded Moves + Special chains (incl. Team Pile-Ons) deal ≥ 45% of damage to Captains and Daifuku. *(M1.1: re-run on the new chain; the sim owns the figures.)*
4. Incoming damage: a normal encounter costs 15–25% of total Posse Nerve; Daifuku costs 50–80% before heals.
5. Under a best-response policy, no input sequence keeps a Captain or Boss unable to act for > 4 s outside Frazzled, Splat or a Fear rider. Policies that command from the skill bar outperform no-command policies on Captains.
6. A four-cat Special chain with 0 Paws banked is worth more at T_rem = 6 than at T_rem = 0. With 2 Paws banked, the best F time is between 3 and 5 s remaining.

**Functional (unit/integration):**
7. Unrounded B(L) / N_ref(L) = 0.045 at every level 1–10 (Crew's slice cap); F1 with Crew's F1 stats reproduces the worked examples (19 / 21 / 30 at Lv 8). The amplifier never exceeds 1.6, and G never drops below 0.30.
8. A Special Routs a Frazzled Tough at any HP. F fires whenever Mikan stands with a full meter (M1.2); a Frazzled target takes `sp_stagger_bonus`. Each chained Special starts only after the previous one's animation ends. A Team Pile-On plays iff all four Posse cats land Specials in one chain, and its damage is added on top.
9. A knock-off always Splats a non-Boss; no Boss is ever knocked off. No randomness in knock-offs, crits or damage.
10. AI cats never Hiss a telegraph aimed at another cat on their own, never fire `command_only` Moves unless forced from the skill bar, never start a Special, and never spend their last Paw on their own.
11. Every Move in `moves.*` has `role` = setup or payoff and a state in `creates` or `pays_on`; ≤ 1 Ruffle-applying Move per Style; no Move refunds its own cost.
12. Events fire with the §6 payloads; `SpecialChain.cats` lists the chaining cats in fire order and `team` is true iff all four landed.

**Feel and safety:**
13. The default build passes an automated Harding-style flash analysis on a capture of the Daifuku fight plus three normal encounters. Global hit-stop never exceeds 200 ms in any 1 s window outside T5. At most 1 full-screen impact frame per second.
14. Random-pause test: in ≥ 90% of pauses, testers point to Mikan within 1 s and name the active telegraph's class (colour-blind simulation included).
15. At most one lettered word is on screen at a time, never over Mikan or the HUD, and only on player-authored T4/T5 events.

**Playtest (DR-02, DR-03):**
16. Prototype: unprompted, ≥ 75% of testers make ≥ 3 skill-bar commands per encounter and fire ≥ 1 Special per Captain, and rate the fight fun at 20 minutes.
17. Slice: every tester has commanded a Crew Move and seen a Special chain by minute 15.
18. ≥ 70% of testers can say, unprompted, how one Crew cat "fights differently" (personality reads).
19. ≥ 60% Evade through Daifuku's belly-flop shockwave and hit him in his landing window at least once without a hint after the first one.

**Owner feedback pass (functional unless marked):**
20. **Loss hand-off:** a Posse wipe produces exactly one `EncounterEnded(outcome = loss)` after the Gloat (≤ 3 s), and Combat writes nothing to any cat's record. Unit test: across 1,000 seeded wipes, the only Nemesis records that differ from before the fight are the **victor's** (`WON` entry, Title if none, Boss plaster) and the Routed Posse cats' own Loyalty step-1 delta; no other cat's level, role, Memory, Grudge or lines change. Scram and `rival_fled` never produce `loss`; Life 1 tutorial fights never reach it.
21. **Fired Up from anger:** at the end of the Standoff a Boss at Riled / Seething / Furious carries Fired Up for 20 s / 40 s / the whole fight (± one frame of buffed time outside Soggy windows), and a Calm Boss none. No Tough, wave cat or guest ever reads `anger_stage` (static check on AI inputs). Soggy pauses the anger timer and the buff resumes after it.
22. **Anger spend:** with the Boss in the fight, anger resets to 0 on `win`, `loss` and `rival_fled`, and is unchanged on `player_fled` (integration test with Nemesis). Unit test: no combat event ever *raises* anger.
23. **Old Gang Nerves:** a recruit with `old_gang_nerves` = true and Loyalty < 80 is Cowed for 20 s (Fraidy 30 s) from `t_seen`; its AI never selects `old_boss_id` while Cowed; a skill-bar command to it clears the status within one frame; nothing else clears it early but a newer status. A resisting or Sworn recruit is never Cowed this way. **The Old Boss's AI inputs contain no Posse-membership or recruit field** (static check), and his Standoff line is chosen identically with and without his ex-member present (seeded comparison).
24. **Join-in guest:** on `AllyJoined` the guest enters 3 s after its yowl (or after its Rival's wave enters), has no skill-bar row, is never commanded and is never in a Special chain, counts toward the 10-combatant cap, and leaves at `EncounterEnded`. **The opposing Rival's AI, targeting weights, buffs and line selection are bit-identical in seeded runs with and without the guest** apart from the guest's presence as a valid target like any Posse cat.
25. **Kin:** a Crew cat's AI never selects an opponent in its `kin_ids`; the player can force its Moves onto that opponent from the skill bar; one `kin` bark per encounter.
26. **Daifuku anywhere on the patrol:** the full 3-phase ground fight completes on each of the three stop kits (build check: flat ring, noise prop, ledge junk, wave entries at every stop; no wall, tub or knock-off edge). No Standoff is offered while `BossWindowChanged(open = false)`.
27. **Togemaru, Life 1 day 1:** his encounter always ends `rival_fled` at 25% Nerve; no input (Hiss, hit, Frazzle, Splat) delays it.
28. *Sim:* Daifuku at the median stays inside 2–3 min at every anger stage, his rematch at −10% inside it, and Posse Nerve lost inside 50–80% at every stage (sim 52–61%; poor dodging ≤ 80%). A Cowed recruit, unanswered, adds ≤ 10 s. Re-run on any change to `fu_dmg`, `anger_fu_s` or `nerves_s`.
29. *Playtest:* ≥ 70% of testers who see a recruit flinch command it within its 20 s at least once in the slice; ≥ 60% who get a join-in can say afterwards which cat helped them and why ("the one I spared").


**Owner combat direction M1.1 (functional unless marked):**
30. **Response (M1.2):** in a 60 Hz capture, a Light's first active frame is on the next sim tick after the press (≤ 1 frame), from neutral and from the buffer, in 100% of 200 scripted presses.
31. **Buffer:** a press earlier than the last 150 ms of an attack never produces an attack; three presses 100 ms apart from neutral produce exactly one Light plus at most one buffered follow-up.
32. **Move-out (M1.2):** during any attack Mikan moves at 25–35% of walk speed from its first frame and at full speed from 60% of its total animation (every attack); an Evade cancels any attack at any frame, and the next Light within 0.6 s continues the string.
33. **Strings:** exactly five strings exist (L-L-L, L-L-L-H, L-H, hold H, Evade-L); Heavy hits deal more FZ per MV than Lights; no Crew cat has a player string.
34. **Lock-on (M1.2):** not locked at fight start; Tab locks the nearest enemy; Tab again unlocks; while locked, a horizontal flick past `lock_flick_px` switches to the next enemy on that side of the screen; no automatic target switch.
35. **Tokens:** on Alley, no more than 2 enemies are mid-attack on Mikan in any frame across 500 seeded encounters; no AI path runs straight at a target from > 6 m without a circle, stalk, posture or flank phase first (log check).
36. **Stagger and chain:** the stagger presentation is ≤ 0.5 s; full treatment fires for Captains, Bosses and the first stagger per fight, light otherwise; a chain with all four ready lasts ≤ 6 s (first), each Special starting after the previous animation ends, and plays the Team Pile-On; later chains use the faster version.
37. **Visibility:** every `MoveUsed` (commanded or AI) shows a name banner, the cat's colour, a wind-up of ≥ 200 ms and a plate highlight (integration check on all 12 slice Moves). *Playtest:* ≥ 80% of testers can name the Move a Crew cat just used.
38. **Safety capture:** a capture of a full four-cat chain plus two full stagger treatments passes the Harding-style analysis with default settings (AC 13 limits hold).

**Owner combat direction M1.2:**
39. **Evade:** ≈ 2 m, i-frames ≈ 0.2 s, cooldown 0.8 s (a press on cooldown does nothing); Shift does nothing in combat; a perfect Evade (≤ 150 ms before a hit) triggers the slow-motion and a counter window, and the next attack in it deals ×1.5.
40. **Pace:** combat `move_speed_mps` equals the Lane's fast-walk speed (data check against `src/entries/main.js`).
41. **Readability:** damage numerals show by default; hit flash 120–150 ms on every cat; Posse outline yellow, enemy outline red **plus** the red overhead chevron (deuteranopia and protanopia simulation: ≥ 90% of testers tell sides apart).
42. **Boss pattern:** Daifuku is loaded from one `BossPattern` record; a second test Boss runs from a different record with no code change; every phase break completes and is followed by the next phase or the bout end in 500 seeded runs (the "stuck after phase 1" regression); no Boss is ever on a wall or knocked off.
43. **Cornered:** an enemy with ≥ 2 Posse cats within 3 m and no ally within 4 m starts an attack within 1.5 s in ≥ 95% of seeded cases.
44. **Final KO:** plays exactly once per encounter win (and at a bout's phase cap), freeze ≈ 0.3 s then ≈ 1.5 s slow motion, inside the AC 13 limits.
45. **Special any time:** F fires on an un-staggered target with a full meter; chained Specials never overlap (each starts after the previous animation ends).

---

## Assumptions for creative-director review

- A1. **Damage numerals:** *(M1.2, owner)* **On by default**, Options toggle All / Big hits / Off (§3.17). Presentation ruling R3's Off default is reversed for combat.
- A2. "Normal encounter" means a threat budget of 4–6. Roaming skirmishes of 2–3 are allowed to run 18–28 s (sim, F9).
- A3. The Special chain keeps the Pile-On's "earlier is worth more" coefficient (k = 1.0), stated together with the Paw-dump trade-off, so the choice stays non-trivial.
- A4. The Daifuku ground arena kit (flat ≈ 10 m ring, noise prop, ledge junk, wave entries; M1.2: no wall, no water prop), needed at **each of his three patrol stops** (OR-09), is a request to Level and Nemesis. His Fear is Nemesis's choice. The fight does not require it.
- A5. *(Owner feedback pass)* Anger's Fired Up **pauses under a newer status** instead of being replaced (§3.5). The one-status rule would otherwise let the first soaking end a Riled buff after ≈ 8 s and make the tiers unreadable. **CONFIRMED by the creative director (consistency pass F4):** the dunk still pays (no Fired Up while he is Soggy) and the stage stays readable; the knob `anger_fu_pause_under_status` reverts it.
- A6. *(Owner feedback pass)* The join-in guest uses the `raid_defence` guest rules plus one bias of its own (it prefers its own Rival as a target). The bias is keyed to the joiner's own tag (G7). Counsel watch item under '303 (G10), held, not redesigned.
- A7. *(Superseded by M1.1 §8)* A skill-bar command to the recruit clears the Cowed flinch (Tag-In no longer exists); it is the new "commanding moment".
- A8. *(M1.1/M1.2, designer's ruling)* **Hop** has no button: an Evade at a reachable ledge mantles (was Dash; Dash is gone in M1.2). Owner to confirm, or give mantling its own key.
- A9. *(M1.1, designer's ruling)* **Brace** is AI-only; Mikan answers white and yellow with Evade.
- A10. *(M1.1, designer's ruling)* **Hiss** moved to the skill bar (0 Paws, per-cat 8 s cooldown); the slowed time keeps it a live yellow answer. Gamepad column (§3.1) is a mirror for UX to refine; the KB+M column is the owner's.
- A11. *(M1.1, designer's ruling)* **Specials have no unlock level** (Zoomies' Life 2 day 3 / Lv 6 unlocks dropped) so a four-cat chain is reachable from Life 2 day 1. Crew doc §3.8.4 updated to match.
- A13. *(M1.2, designer's rulings)* Perfect-Evade counter = ×1.5 on the next attack (no separate counter moves); the string survives an evade for 0.6 s; cornered thresholds; Daifuku's phase 2–3 signatures (Big Yowl, Double Flop) replace the wall attacks; `sp_stagger_bonus` 1.25.
- A12. *(M1.1, designer's ruling)* If Mikan is Routed, the player keeps the skill bar and the fight continues under Crew AI; the bonded-pair bonus moved from the Tag-In to back-to-back chained Specials; `CatRouted(by_pile_on)` keeps its name for Nemesis's contract.

## Backlog (post-slice)

- B-1 · DR-04 / CS-C: full catalogue (≈ 45 Style Moves + 4 Home Moves); Prowler and Trickster AI combos and Specials (names *Nine Shadows*, *Everything Off The Shelf* reserved; CS-C6); 3-Paw Move budget row (CS-C21); Mikan's third Paw from Life 4.
- B-2 · CS-C5, CS-C7, CS-C10, CS-C11 (non-slice): Dirt Kick, Loaf (with the S-11 limits), Neck Nip, Vanish, Shadow Step, Wall-Kick, Bait, Leap. Each is re-specified as a Set-up or Pay-off.
- B-3 · CS-C15 / DR-28: Knacks (merge duplicates; budget +10–15% of one channel; no new verbs). Tactics.
- B-4 · CX-9: PG ×0.7 on ranged basics (relevant once the Trickster ships).
- B-5 · CX-10: final Frazzle decay values (interim rank-scaled defaults are in §3.5).
- B-6 · CX-13: FF7R/Rebirth reference table corrections (the table is not in the slice body).
- B-7 · CS-9: damage-display ceiling at Lv 30 (with the 1.6 amplifier cap; re-check with Crew's maximum stats).
- B-8 · CS-14: arithmetic slips in deleted first-draft formulas; the reference path is now `crew-and-progression.md`.
- B-9 · CS-15: Special rider budget audit for AoE and prop-activating Specials (the damage-gain cap of 40 is already in).
- B-10 · Botan (4–5 min, four phases; DR-45), Madam Sabi, Oboro, Ikari Boss kits; other Critters (rats, weasel, chained dog); the Usurper.
- B-11 · Life 8–9: AI fill 60/70/100% values and Carry escort combat (DR-27, DR-35).
- B-12 · Handheld feel scaling (shake ×0.8, glyphs ×1.2; AB-10/11 handheld budgets).
- B-13 · Crowd-fight readability beyond 6 enemies; one-handed presets.
- B-14 · Over-level tuning across Lv 1–30 (re-derive K from Crew's full curve).
- *From the round-2 check (`design/reviews/round-2/combat-and-crew.md`), not fixed in iteration 3:*
- B-15 · C-1 trim for the slice (optional): ~~cut the 6 s Relay lockout~~ (moot: Relay removed, M1.1); replace Wind-Up, the perch Paw-stop, "enemies prefer perched cats" and the 1.5 s mantle penalty with one fixed High Road Pounce (MV 2.5, FZ 35, 3 s re-use); Fear diminishing "full once, then tell only"; drop the Hiss Paw-spend + 6 s cooldown unless a Hiss loop shows up.
- B-16 · C-3 F9 realism: rewrite F9 and AC 1's expected values with whole-Paw arrival (the sim table in F9 is canonical meanwhile); decide whether 1-Paw Set-ups trade damage for the state (catalogue averages 2.1–2.5 MV per Paw against the 3.5 budget) or Pay-off MV rises.
- B-17 · C-4 AI Paw habits rarely fire (first AI self-cast at 60 s): let AI self-cast at 1 Paw when Mikan holds ≥ 1, or `ai_fill` 0.6 for the slice. Prototype question.
- B-18 · C-5 scope AC 16's "≥ 3 commanded Moves per encounter" to normal encounters (threat 4–6) and Captains; supply is 0 in a Tough-length fight.
- B-19 · C-6 Special meter pace (was Zoomies pace): superseded by F8's M1.1 intent; the sim sets `sp_per_hit` and `sp_per_frazzle`.
- B-20 · C-7 Yowler basics strongest (Voice 1.35, multi-target cone); watch in prototype, or normalise `Off` by Style offence weight.
- B-21 · C-8 leader level rule (Daifuku settled at Lv 8, Kagi Lv 6, 2026-11-24); say which Lane Captains are "Den" Captains (with Crew R-3).
- B-22 · C-9 Rival personality AI: one target-choice bias per personality for enemies.
- B-23 · C-10 adopt Crew's old Stalwart idea (step into white telegraphs aimed at the controlled cat) if the Stalwart reads weakly.
- B-24 · C-11 slice body ≈ 57 KB vs 50 KB target (move rumble/punch-in rows to data, trim log).
- B-25 · Presentation backlog: Special prompt word (Combat §3.17, first 3 showings) vs HUD §4.1 hint card; pick one. Hit-stop 0% option shipping only once fairness is confirmed.
- *From the owner feedback pass (2026-11-24):*
- B-26 · **Held for counsel (OR-06):** a line-only, Boss-voiced taunt aimed at his ex-member. Restore only if counsel clears it; until then the Old Boss's lines never read the Posse.
- B-27 · Rival personality AI for **join-in guests** beyond the own-Rival bias (with B-22).
- B-28 · Boss anger for Madam Sabi, Oboro, Ikari (same F11 tiers; their kits are B-10).
- B-29 · A variance model for the Daifuku sim (bursty damage, controlled-cat Routs) so the wipe rate, not just the expected-value wipe line, can be read per anger stage.

## Revision Log

**2026-11-24 — Owner combat direction M1.2 (2026-11-24).** Source: owner C11 (`design/reviews/user-comments-2026-11-24.md`), ruled into `design/reviews/owner-feedback/combat-m1.2-spec.md` (wins over M1.1).
- Header, §1, §2: NieR responsiveness, Evade, Special any time, sequential chain, cornered AI, Final KO, ground Daifuku; friend line.
- §3.1: one final control table: **Evade on Space** replaces Dodge and Dash (Shift and East unused in combat); **Tab lock/unlock** with flick switching; **F any time**. Mantle on Evade (A8).
- §3.2: Light on the next tick, Heavy wind-up, slow steering from frame 1 and full movement at **60% of the total animation**, Evade (cooldown, cancels anything, string survives, perfect Evade + counter) with the NieR reference check and differences; combat speed = Lane fast walk.
- §3.5–§3.7: Boss knock-off and bucket references removed; Special any time with stagger bonus; chain sequential; full burst on top; faster repeats; per-cat Special names.
- §3.11–§3.12: cornered-cat rule; wall limit removed; Fraidy perfect Evade.
- §3.13 rewritten: **universal Boss pattern** (data structure) and Daifuku on the ground with the **Belly-Flop Shockwave**; no wall, wash tub, knock-off, Climb Back or tub Soggy; phase 1 ends cleanly into the Final KO.
- §3.14 Final KO cinematic; §3.16 teaching; §3.17 hit flash 120–150 ms, perfect-Evade slow-mo, Final KO, **damage numerals On**, **yellow / red outlines + enemy chevron**.
- F2, F3, F5 (rewritten on the sim's data names), F9/F10 Daifuku marked † for re-baseline; edge cases 4, 8, 18, 21, 31, 33, 39, 40; dependencies; knobs; ACs 8, 9, 19, 26, 30, 32–34, 36 and new 39–45; A1, A4, A5, A8, A9, A13.

**2026-11-24 — Owner combat direction M1.1 (2026-11-24).** Source: owner C10 and follow-up (`design/reviews/user-comments-2026-11-24.md`), ruled into `design/reviews/owner-feedback/combat-m1.1-spec.md` (final bindings F = Special, R = skill bar, Tab = lock-on cycle).
- §1, §2: player controls Mikan only; pillar wording "Command the Brawl"; friend line.
- §3.1: one final control table (KB+M owner's; gamepad mirror); removed switching (Z X C V, D-pad), Tag-In, Relay, Pile-On input, Zoomies input, shortcut Moves, Hop/Brace/Hiss buttons; skill bar replaces Slow Blink. Rulings A8–A10 for the orphaned verbs.
- §3.2: slower-but-responsive rules (≤ 3-frame first active frame, one-slot 150 ms buffer, move-out gradient, finisher commit, steering); Mikan's five strings; Crew/enemy AI combos; no switching.
- §3.3: Tag-In and Relay replaced by Command (skill bar, steeling, bonded chain bonus) and the ability-visibility rule.
- §3.5: Cowed cleared by a skill-bar command; leader flinch list.
- §3.6, §3.7: Pile-On and Zoomies replaced by the stagger presentation, the F Special, the automatic Crew chain and the Team Pile-On (Full Burst resemblance noted for counsel); Specials per Style; no unlock level (A11).
- §3.11, §3.12, §3.15: attack tokens, circling, stalking, posturing, flanking, feints, dash-in/back-out; "Moves like" personality column; Brace as AI posture; Feral tokens 3 → 2.
- §3.13, §3.14, §3.16, §3.17: knock-off list, wall-top chain, guest rules, Scram, teaching beats, tier events, Special cut-in and stagger safety rules, camera framing at 3.8 m, world text.
- F2, F3, F5, F6, F8, F11 rewritten for the chain, command and meter; F9/F10 marked † for removed terms, **numeric re-baseline owned by the sim's data and tests**. Edge cases 1–10, 12, 13, 22, 25, 28, 30, 36; dependencies; knobs; ACs 3, 5, 6, 8, 10, 12, 14–17, 23–25, 29 and new 30–38; A3, A7 (superseded), A8–A12; B-1, B-9, B-15, B-17, B-19, B-25.

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

**2026-11-24 — Owner feedback pass (2026-11-24)** (`design/reviews/user-comments-2026-11-24.md` C1–C5 via `design/reviews/owner-feedback-rulings.md`; guardrails `design/legal/nemesis-patent-analysis.md` v2 §5; brief v1.5). Re-sim: `design/reviews/owner-feedback/sim/combat_slice_sim.py` → `combat_slice_sim.out.txt` (before: `combat_slice_sim.before.out.txt`; every round-2 figure reproduces unchanged).

| Ruling | Status | Where / how |
|---|---|---|
| OR-01 A loss ends the day | IMPLEMENTED | §3.14 `loss`: Combat ends at the Gloat and hands the day to Day Loop §3.6 (clock to Night, street closed, walk home); Scram and `rival_fled` are not losses; tutorial fights cannot be lost; §6 Day loop row; AC 20 |
| OR-02 Only the victor changes | IMPLEMENTED | §3.14, §6: victor's `WON`, Title and Boss plaster only (Nemesis writes them); Combat writes no record; AC 20 unit test. Promotion references: none were left in this doc |
| OR-05 Relationship effects | IMPLEMENTED (Combat's rows) | §3.11 Kin rule (AI never targets its own Kin; player can drive it in; one `kin` bark); the join-in's Rival unchanged (§3.14); edge 36; AC 25. Boss/Gang and feud scuffles are not Combat's |
| OR-06 Old Gang Nerves | IMPLEMENTED | §3.5 (Cowed 20 s, Fraidy 30 s; Loyalty < 80; resist Braggart/Stalwart/Brooder; AI won't target the Old Boss; a Tag-In clears it, a plain switch does not), §3.11, §3.13 slice halves (Hige, Togemaru resist; Kagi flinches), F11, edges 27–30, AC 23. The Old Boss reads nothing about the Posse. Sim: +0.6 s answered, +4.3 s unanswered |
| OR-07 Boss anger → Fired Up | IMPLEMENTED | §3.5, §3.13, F11: Riled 20 s / Seething 40 s / Furious all fight, Boss only; spent on win, loss, `rival_fled`, not on Scram (§3.14); Soggy pauses it (A5). Sim: fight length 175.5 s at every stage; Posse Nerve lost 52 → 54 → 56 → 61% (median); EV wipe line 95% → 83% landed |
| OR-09 Roaming Boss / patrol kit | IMPLEMENTED | §3.13: no Den gate; fought at any of three stops on an arena kit; ignores Mikan before the window; §3.16 row; §6 Level row; edge 33; AC 26 |
| OR-13 Nose-Touch join-in | IMPLEMENTED | §3.14 allied guest: entry (3 s yowl, wave timing, slot cap), AI (guest rules + own-Rival bias), HUD (Posse side, truce-sprig tick, guest plate), leaving, +5 Regard to the joiner on a win; the opposing Rival untouched (G7); edges 26, 34, 35; AC 24. Sim: −14 s from the start, −6 s with the phase-2 wave. G10 watch item held (A6) |
| OR-14 Chase Off final; Togemaru day-1 flee | IMPLEMENTED | §3.14 Rival flight: Life 1 day 1 flee at 25% uninterruptible; edge 37; AC 27. Chase Off itself is Nemesis's |
| OR-16 Challengers | IMPLEMENTED (Combat's part) | §3.14 composition: challenger + 1 Stray, a normal encounter ending in a Verdict |
| OR-20 Event contracts | IMPLEMENTED | §6: `RivalCombatProfile` + `anger_stage`, `old_gang_nerves`, `old_boss_id`, `kin_ids`; `AngerChanged`, `AllyJoined` read; `EncounterEnded.outcome` set |
| OR-21 Delete list | IMPLEMENTED | "Daifuku never leaves his wall" → "never comes down off the walls" (§3.13); "his garden wall" → the stop's wall; the Den approach composition and the "Life 2 day 4+, Den" teaching row replaced; Revision-log history left as history |
| OR-03, 04, 08, 10–12, 15, 17–19 | NOT COMBAT'S | No Combat rule depends on them beyond the above; the Verdict stays "one full Verdict per fight" (three options, Nemesis) |
| Showcase bout (doc change list) | IMPLEMENTED | `boss_phase_cap` knob; phase 1 only → `rival_fled` at the break (§3.13) |
| Owner answers (rulings §5) | NOTED | Every answer matched the default (the recruit-side flinch pending counsel; 10-day truce; Chase Off final; full influence = four Strong posts; betrayal on). Nothing here changed because of them |
| Sim deliverables | DONE | Daifuku per anger stage, with an ally, rematch, Cowed cost (F9 table). **Not done:** a wipe *rate* needs a variance model (B-29); the EV model wipes only under very poor dodging |

**2026-11-24 — Consistency pass (creative director; `design/reviews/owner-feedback/consistency-pass.md`).** F4: A5 confirmed (Soggy pauses anger's Fired Up). F7: the Boss window's reference day is L2D3 (the Tofu Shop Step Claim Spray); the first fight stays L2D4, so §3.16's "Life 2 day 4+" teaching row is unchanged. F12: a Boss met Seething or Furious will not Nose-Touch after the fight (Nemesis F4); no combat value changes.

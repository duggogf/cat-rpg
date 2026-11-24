# Combat M1.1 — owner direction (2026-11-24)

> **Final bindings (owner, last word):** F = Special on a staggered enemy; R = skill bar; Tab = lock-on cycle.

Binding change spec for the combat sim, presentation and docs. Source: the owner's two chat messages after playing
the M1 grey box (quoted in `design/reviews/user-comments-2026-11-24.md`, C10). Supersedes the GDD and the M1 build
where they differ. Docs are updated to match (combat-system, camera-system, hud, crew where touched).

## 1. Control map (keyboard + mouse; gamepad mirrors it)

| Action | KB+M | Notes |
|---|---|---|
| Move | WASD | Free third-person camera on the mouse |
| Light attack | LMB | |
| Heavy attack | RMB | Hold to charge |
| Dodge | Space | Cancels recovery |
| Dash | Shift | Dash → attack is a string starter |
| **Lock-on** | **Tab** | Not locked by default. Press: lock the nearest enemy. Press again: if the nearest enemy is now a *different* enemy, lock that one; otherwise **unlock** (free camera) |
| **Special** | **F** (prompt) | Only on a **staggered** enemy; shown as a context prompt |
| **Skill bar** | **R** | Opens the skill bar (time slows). Commands Mikan's Moves **and forces crew skills** |
| Pause | Esc / P | |

Removed: switching control to other cats (Z X C V, Tag-In, Relay). **The player controls Mikan only.** Crew are
always AI; the player can force their skills from the skill bar.

## 2. Feel: slower, but responsive

- **Slower overall**: movement and action pacing slowed (target ≈ 25–30% slower move speed; longer anticipation and
  follow-through), judged at the new 3.8 m camera, which magnifies apparent speed.
- **Responsive**: a light hit's first active frame within ≈ 50 ms (≤ 3 frames at 60 Hz) of the press. Slowness lives
  in follow-through/recovery, never before the hit.
- **One-slot input buffer**: a press is buffered only in the last ≈ 150 ms of the current attack; earlier presses are
  dropped. Clicking 3 times fast never queues 3 attacks.
- **Move-out gradient**: the player does not wait for the animation to end. Toward the end of each attack (from about
  60% of recovery) movement input is accepted on a ramp — partial steering first, full control by the end — and dodge
  cancels recovery at any point after the hit. Only the heavy finisher commits briefly.
- Light strings step forward and steer toward the stick.

## 3. Mikan's strings (Mikan only)

- **L → L → L** basic string.
- **L → L → L → H = finisher** (the owner's choice).
- **L → H** launcher / knock-up; **hold H** charged heavy; **Dash → L** lunge.
- Heavy hits build stagger faster than lights.
- Keep it to these five; crew have no strings (AI Moves only).

## 4. AI: cats think before they charge (enemies and crew)

Like cats, and in the spirit of Assassin's Creed group fights (not a strict copy):
- **Attack tokens**: only 1–2 enemies engage the player at once; the rest **circle, stalk, posture** (arched back,
  tail lash, hiss), **flank**, and look for an opening, then **dash in** for a combo and back out.
- Fighters keep spacing, face each other, side-step, feint; no beeline to the nearest target.
- Personality shapes it (Braggart struts in front; Schemer flanks; Fraidy hangs back and darts; Stalwart holds ground).
- Crew AI follows the same rules on the other side.

## 5. Stagger presentation

- On stagger: brief **zoom onto the staggered cat**, **time slows** briefly, and a **shattered-glass blink** effect
  (in the spirit of FF7 Remake's stagger) — total ≤ ≈ 0.5 s, input stays buffered, within the flash-safety limits
  (soft pulses, never a strobe).
- Full treatment for Captains, Bosses and the first stagger in each fight; a lighter version for Toughs.

## 6. Special and the team finisher (Zoomies folded in)

- **Zoomies is folded into the Special** (no separate limit break). Each cat has a Zoomies/Special meter.
- **F on a staggered enemy** = Mikan's **Special**: camera punches in on Mikan, **time stops**, only Mikan renders over
  an impact-frame background (shonen-ultimate cut-in, ≈ 1 s), then the hit.
- **Crew specials chain automatically** (owner's decision): crew in range with a ready meter follow with their own
  specials and cut-ins, in sequence.
- If **all four** land inside the window → the **team finisher** ("Team Pile-On", the KA-BLAM dust cloud — the
  existing Pile-On art becomes this payoff), in the spirit of Granblue Fantasy Relink's Full Burst.
- Pacing: each cut-in ≈ 1 s; the full chain ≤ ≈ 6 s; shortened after the first time in a fight.
- The old Quick/Full Pile-On inputs are replaced by this chain.
- Originality: our cut-in art and staging; add the Full Burst resemblance to the counsel checklist.

## 7. Abilities must be visible

Every Move (Mikan's or crew, commanded or AI): a **name banner**, a **per-cat colour**, a readable **wind-up pose**,
distinct VFX, and a highlight on that cat's plate. (Audio comes in M6.)

## 8. Knock-on changes

- Cowed status: cleared by a skill-bar command to that cat (Tag-In no longer exists).
- Pillar "Conduct the brawl" becomes "Command the brawl" (skill bar + specials chain).
- HUD: crew plates without control keys; Special prompt (F) on stagger; skill bar on R; lock-on indicator on Tab.
- Tests: F1–F11 worked examples that depended on Tag-In/Relay/Pile-On inputs are updated to the new chain.

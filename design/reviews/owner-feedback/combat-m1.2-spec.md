# Combat M1.2 — owner direction (2026-11-24, after playing M1.1)

Binding change spec for the combat sim, presentation and docs. Owner's words: C11 in
`design/reviews/user-comments-2026-11-24.md`. Builds on `combat-m1.1-spec.md`; where they differ, this wins.
Owner: "Do a ground version for Daifuku, but no need the wash tub anymore. Make it universal. The rest, however you
suggest. Go."

## 1. Responsiveness (NieR: Automata as the reference)

- **Move-out at 60% of the TOTAL attack animation** (hard rule; M1.1 wrongly started the ramp at 60% of recovery).
  From 60% the player steers freely; before it, see §3.
- **Evade cancels anything** (NieR-style): the evade cancels any attack at any frame after input; the combo state
  survives an evade (the next light continues the string). Brief i-frames. A well-timed evade (enemy hit imminent)
  triggers a short slow-mo and a counter window. Verify NieR's behaviour against references and note differences.
- **Light attack is near-instant**: first active frame on the next sim tick after the press; short, snappy.
- **Heavy is slower with a readable anticipation** (wind-up pose before the hit) for impact; charged heavy longer.
- One-slot input buffer stays (last ~150 ms only).

## 2. Evade replaces Dash and Dodge (one button)

- **Space = Evade** (Shift no longer used in combat). Distance ≈ 2 m (shorter than the M1.1 dash), i-frames,
  **cooldown ≈ 0.8 s** (visible on the HUD). Evade → Light = lunge (replaces Dash → L).

## 3. No locking in place

- During an attack the player keeps **reduced, slow steering** (≈ 25–35% of walk speed) from the first frame;
  full movement from 60% of the animation.

## 4. Pace

- Combat movement speed = **the Lane's fast-walk speed** (match `src/entries/main.js` Shift-walk speed).

## 5. Readability

- **Damage numbers on** (option to turn off). Reverses the earlier "damage numbers off by default" rule.
- **Hit flash longer** on every cat (player, crew, enemies): ≈ 120–150 ms, character-local (not a screen flash).
- **Allies = yellow outline, enemies = red outline**, plus a small shape cue on enemies (e.g. a chevron) so colour
  is not the only signal.

## 6. Camera

- **Fix horizontal mouse rotation** (bug: user yaw was added to the lagging pose and smoothed again, passing ~5% of
  the input). Mouse look applies directly; smoothing only on follow, not on input.
- **Smooth follow without ghosting**: interpolate the controlled cat between sim ticks like everyone else (it was
  drawn at raw 60 Hz steps, which double-images on high-refresh monitors); critically damped follow; check the
  paint post does not smear in motion (reduce wobble/Kuwahara on camera motion if it does). Not a vsync issue.
- **Near-camera objects dither-fade** (as in the Lane), never hidden outright.
- **Lock-on**: Tab locks the nearest enemy; Tab again unlocks. While locked, a horizontal mouse flick past a threshold
  switches to the next enemy on that side of the screen (no free yaw while locked).

## 7. Specials

- **F = Special at any time** (meter permitting); a **staggered** target takes bonus Special damage.
- **Chain is sequential**: each crew Special starts only after the previous cat's animation finishes; the team
  finisher ("full burst") is extra damage on top. Crew still join automatically.
- Repeat chains within the same fight play a faster version (keep the total reasonable).

## 8. Fights

- **Cornered cat**: an enemy that is outnumbered/surrounded does not hover; it hisses and **lashes out** at the
  nearest or weakest attacker (attack-token limits apply to many-vs-one against the player, not to a cornered cat).
- **Final KO cinematic** (last opponent defeated): zoom-in, frame freeze over an impact background, then slow motion
  (≈ 1.5 s), fighting-game style; within flash limits.

## 9. Daifuku — universal ground boss pattern

- Daifuku fights **on the ground** like any cat. **No wall, no wash tub, no knock-off.**
- His gimmick: a **belly-flop shockwave** (telegraphed jump → ground slam → expanding ring; evade or be knocked down).
- **Make it universal**: a reusable "Boss pattern" data structure (phases, signature attacks, telegraphs, rage
  thresholds) that any boss can use; Daifuku is the first instance.
- Phase 1 ends cleanly (phase break → KO cinematic / bout end screen). Phases 2–3 are later milestones.

## 10. Docs

Update `combat-system.md` (Daifuku's fight, controls, evade, specials, AI), `camera-system.md`, `hud.md`, the GDD's
control table, and the art bible (red enemy outline; damage numbers) with a dated "Owner combat direction M1.2" entry.

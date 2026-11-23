# Camera System — Cat RPG

*Created: 2026-11-23 · Owner: technical-artist · Status: **Draft v1 (round 2, slice scope)** · Reviewers: art-director, combat designer, UX (DR-48)*
*Canon: `design/creative-brief.md` v1.2 §4.1, §8 (safety row); `design/reviews/round-1/director-rulings.md` DR-07, DR-08, DR-22, DR-24, DR-29, DR-30, DR-48, DR-50; Part 2 §5 (one camera grammar; a gentle lower-and-tighten at the garden wall) and §6 (AB-6 overruled: one camera).*
*Engine is OPEN (brief §9). This doc is engine-agnostic: no engine API is named as a requirement. Shipping implementation (for example a camera-rig package) is an implementation choice and is unverified against `docs/engine-reference/` until the engine is pinned.*

---

## 1. Overview

One third-person camera rig, behind and above Mikan like FF7 Remake, runs everywhere: in the street, in fights, on the High Road and inside Haru's House. It is a single state machine with named **states** (Explore, Whisker, Combat, Slow Blink, Cinematic, Home, Vignette, Screen) whose parameters blend into each other. There are no scene transitions and no second camera grammar. The camera owns framing, collision and occlusion, lock-on framing, shake playback, the input reference frame across cuts, and the comfort options. It does **not** own combat timing, target selection, the tier table or which events fire (Combat), the edge arrows and HUD (UX), or the authored story shots' content (Narrative and Art). The slice needs the states and numbers below; everything else is in the Backlog.

**Scale convention.** Distances are in metres for a street cat of **0.63 m nose to rump** (the 1.4× gameplay scale the art review proposed; the scale cheat is Art's call and still open). Each key distance is also given in **body lengths (BL)**. If Art settles on 1.0× (0.45 m), the metre values stand and the cat lands at the low end of every size target, which still passes (§4.1).

## 2. Player Fantasy

*Small cat, big town.* In the street the camera sits low, about a human knee height above the ground, so walls are cliffs, a bicycle is a building and the sea and hills sit painted on the horizon. Mikan is big on screen, so their ears, tail and scars read, and every Rival you meet is a face, not a dot.

*Conductor's seat.* When a fight starts, the camera rises and pulls back without a cut. You see your cat, your target and most of the brawl. Switching cats swings the view smoothly to the new cat, so a four-cat Relay reads as one continuous move. Big hits punch in, freeze and shake like a manga panel. They never make you lose your cat and never strobe.

*At home, you are the pet.* Inside the wall the camera drops to cat height. Haru is knees, slippers, hands and a lap; her face appears when she kneels, sits at the low table or bends to you. You walk freely through her life, and the camera never steals the stick from you without giving it back the way you were holding it.

## 3. Detailed Rules

### 3.1 Rig model

- **Pivot** = a point on the followed subject (Mikan's head height + 0.10 m, ≈ 0.45 m above ground on the street) or a framing point computed per state.
- **Pose** = yaw, pitch, distance from pivot, vertical FOV, screen offset. Every state defines target values; the rig **blends** between states (§4.4). Cuts happen only in Cinematic and Vignette states and at Screen entry/exit.
- **FOV is vertical** (Hor+): wider monitors see more to the sides, never less above and below. 16:9 is the reference.
- The camera runs on **unscaled time**. Slow Blink (5%), hit-stop and Zoomies slow time do not slow camera blends unless a state says so.
- One rig, one active state, plus two overlay layers that any state may receive: the **Shake layer** (§3.6) and the **Punch-in layer** (§3.6).
- Gameplay values live in data (`assets/data/camera/camera_states.*`), not in code.

### 3.2 State table (starting values)

| State | Pivot | Distance | Height above ground | Pitch (down +) | vFOV (default) | Player orbit |
|---|---|---|---|---|---|---|
| **Explore** | Mikan | **3.0 m** (4.8 BL); 0.8–3.6 m | ≈ **1.0 m** (result of distance + pitch) | **+10°**; range −10° to +55° | **45°** (≈ 73° horizontal) | Yes |
| **Explore · High Road** | Mikan | 3.4 m | — | +16° | 45° | Yes |
| **Explore · Low Ceiling** | Mikan | 1.4 m | clearance − 0.10 m | 0° | 50° | Yaw only |
| **Whisker** (Whisker Sense held) | Mikan | +0.5 m over current | — | +8° over current | unchanged | Yes |
| **Combat** | framing point (§4.2) | **6.0–8.0 m** (solved from frame width) | ≈ 2.5–3.4 m | **+25°**; range +15° to +40° | 45° | Yes, inside soft-lock limits |
| **Slow Blink** | controlled cat | **8.5 m** | ≈ 6.5 m | **+50°** (lifted three-quarter) | 45° | No (stick drives the cursor) |
| **Cinematic** | authored | authored | authored | +35° to +45° over the scene; lower and tilted only behind a full graphic panel | free | No |
| **Home** | Mikan | **1.8 m** (≈ 4 BL at 1.0×); 0.6–2.2 m | **0.30–0.60 m** | **−5° to 0°** free; up-tilt only authored | 45°, max 50° | Yes |
| **Vignette** | authored shots | — | cat height unless authored | authored | authored | Only if the shot says so |
| **Screen** (Fence Line, Turf Board, Pause, Morning Sniff) | — | — | — | — | — | No |

The Explore height of ≈ 1.0 m follows from a 0.45 m pivot, 3.0 m distance and 10° pitch (0.45 + 3.0 × sin 10° ≈ 0.97 m). It matches DR-48's "≈ 3 m back, ≈ 1 m up, gently pitched down".

### 3.3 Explore (street, Lot, High Road)

**Follow.** Yaw and position follow Mikan with critically damped springs (position half-life 0.12 s; yaw half-life 0.25 s). **Vertical tracking uses the last landing height**: during a Hop or a jump between High Road ledges the pivot stays on the take-off height until Mikan lands, falls more than 1.0 m below it, or rises more than 1.5 m above it. This stops bobbing on fence-to-roof hops.

**Player control.** Right stick or mouse orbits yaw (360°) and pitch (−10° to +55°). Camera speed default 180°/s yaw, 120°/s pitch at full deflection (option range ×0.33 to ×1.66). Invert X and Y are separate options.

**Auto-recentre.** After **1.5 s** without camera input while Mikan moves, yaw eases behind the movement direction at ≤ 90°/s (ease-in over 0.3 s). It does not recentre while Mikan moves toward the camera (angle between move direction and camera forward > 135°), so running back toward the lens never spins the view. Pitch returns to the state default over 1.0 s. R3 / MMB recentres immediately (0.25 s blend). Option: Auto-centre **On / Slow (45°/s, 3 s delay) / Off**.

**Sub-states** (blend 0.4 s, chosen by Mikan's surface):
- **High Road** (on walls, fences, roofs, awnings): 3.4 m and +16° so the drop and the next landing read; this is third-person platforming (DR-48).
- **Rail assist** (moving along a fence top or ridge ≤ 0.3 m wide for > 0.5 s): yaw biases toward the rail direction at ≤ 45°/s, ±30° behind it; any camera input cancels for 3 s.
- **Low Ceiling** (clearance above Mikan < 0.9 m: under porches, the veranda crawl space to the Stash, under parked cars): §3.2 row; entry and exit blend 0.3 s.
- **Vantage**: on a rooftop with the ground > 3 m below and no wall within 4 m, distance may extend to 3.6 m and pitch to +22° (DR-47: rooftops give vantage over the Lane).

**Spray.** Interacting with a Scent Post does not cut. The camera swings to a side three-quarter of Mikan (≤ 60° yaw change, 0.35 s) and raises pitch so the post's top and its wisps are in frame, then returns over 0.5 s. Skippable by any camera input.

### 3.4 Collision and occlusion

**Two kinds of geometry, tagged by Level and Art:**
- **Camera-solid** (walls, roofs, ground, large props): the camera never passes through them.
- **Camera-soft** (fence slats, laundry, poles, wires, foliage, signs, bicycles, thin awning edges): no collision; when they lie between the camera and the pivot they **dither-fade** to 30% over 0.1 s and back over 0.3 s.

**Collision rule.** Each frame, cast a sphere (radius **0.15 m**) from the pivot to the desired camera position. If blocked, the camera snaps in to the hit distance **immediately** (no lag inward, which is what stops wall clipping) and eases back out with a 0.4 s half-life after the obstruction clears. Below 1.2 m, pitch rises by up to +20° so the camera looks over Mikan rather than into their back. At the 0.8 m floor (0.6 m at home) Mikan dither-fades to 50% rather than the camera entering the cat.

**Narrow alleys.** Along an alley axis the default distance survives. When Mikan turns a corner, a **whisker probe** (two extra casts ±25° yaw) pre-emptively swings yaw up to 20° toward the open side, so the camera does not drag along a wall. Level requirement: slice alleys keep **≥ 1.0 m of camera-clear width between 0.3 m and 1.5 m height**; anywhere tighter needs a camera hint volume.

**Hint volumes.** Authored boxes that override distance, yaw bias or pitch (blend 0.5 s). Slice cap **≤ 15 in Hidamari Lane** and ≤ 5 in the House: if a space needs more, the space is changed, not the camera.

**Occluded subject.** If Mikan (Explore) or the controlled cat or lock target (Combat) is hidden behind camera-solid geometry for > 0.25 s and the rig cannot clear the line within its constraints, the camera emits `CameraSubjectOccluded`. Art draws the keyline through walls on that signal (x-ray keyline is Art's asset).

### 3.5 Combat

**Entry.** On `EncounterStarted`: no scene change. The rig blends Explore → Combat over **0.6 s** (ease in-out) and keeps the current yaw within ±45° so the stick frame does not flip. Openers:
- `standoff`: a Cinematic Standoff push-in plays first (§3.7), then the rig returns on the solved combat pose.
- `ambush_by_player` from the High Road: the camera stays in Explore through the Pounce and blends to Combat on landing.
- `ambush_by_rival`: the camera **does not turn** toward the attacker during the 2.0 s yowl-sting (reacting is the skill, DR-36). The directional cue is UX's edge arrow plus audio.
- `raid_defence`: as Standoff.

**Framing.** The rig frames the **controlled cat** and the **lock target** (the enemy Combat's targeting reports as current). Both must sit in the **safe frame**: the central 80% of width and 75% of height, keeping UX's corner HUD and the bottom-centre clear (DR-48 UX). The controlled cat is biased to the lower third, the target above and ahead of it, so you look *past* your cat at the target, FF7R style. Frame width is solved from their separation (§4.2) between **8.8 m and 11.8 m**, which yields the canon 6–8 m distance at default FOV. Other Posse cats and attackers are framed if they fit; anything off-screen gets UX's edge arrow (the camera publishes each combatant's on-screen/off-screen state and its screen-edge bearing).

**Frame bias for Posse AI.** The camera publishes `frame_bias_region`: the ground footprint of the safe frame. Combat's Posse AI prefers positions inside it (DR-48: "AI Posse cats stay within the frame bias").

**Soft lock (default).** The target is Combat's current target. Yaw re-aims at ≤ 120°/s only when the target leaves the central 60% of width. The player may orbit freely; after 1.0 s without camera input the soft lock pulls back.

**Hard lock** (R3 / MMB toggle; DR-08). Yaw tracks the controlled-cat → target line continuously (half-life 0.15 s). Flick right stick or scroll wheel = next target in the flick direction (Combat picks the cat; camera blends 0.3 s). Breaks when the target is Routed, Backs Down, leaves the ring or is > 14 m away; the rig then frames Combat's next target, or, if none, the centroid of remaining enemies.

**Soft arena bounds.** Combat owns the fight ring (≈ 10 m across, DR-48). The framing point is clamped inside the ring + 1 m. The camera may go outside the ring but never more than distance_max beyond its edge, and never through camera-solid geometry; in walled alleys the collision rule wins and pitch rises (up to +40°) to recover frame height instead of pulling back through a wall.

**High Road fights.** If the controlled cat is on a High Road surface and the target on the ground (or the reverse), the framing point takes the midpoint height and pitch may rise to +40° so the knock-off ledge is visible (DR-32 knock-offs, Daifuku's wall).

**Tag-In and switching** (DR-29). On `TagIn` or a direct switch, the rig retargets to the incoming cat with a **0.3 s** blend, **keeping yaw** unless the incoming cat would land outside the safe frame, in which case yaw turns the minimum needed (≤ 60°). The incoming leap is never cut. In a **Relay**, each new `TagIn` restarts the blend from the current pose; distance is held at the larger of the current and solved values for the 3 s Relay window, so the frame does not pump in and out. When the controlled cat is Routed (control passes to the next slot, DR-33), the same blend runs after the Rout's hit-stop.

**Slow Blink.** On open, blend to the Slow Blink pose in **0.2 s** real time. While the menu runs, the camera does not chase the cursor; it pans (≤ 2 m) only if the selected target leaves the safe frame. L1/R1 cat changes re-pivot over 0.2 s. On close, it blends back to the solved combat pose in 0.2 s. Art owns the Slow Blink grade (saturation −30%, value −10%).

**Exit.** On `EncounterEnded`: Verdict (if any) holds a two-shot of the controlled cat and the Rival held at the ring edge (authored rig, no cut if within 90° of current yaw; otherwise one cut); the Gloat (≤ 3 s) frames the victor. Then blend to Explore over **0.8 s**, yaw preserved.

### 3.6 Feel overlays: punch-ins, shake, hit-stop, impact frames

These play Combat's tier events (DR-07) and obey DR-50, which overrides every value here.

| Tier | Shake (stepped) | Punch-in | Camera during hit-stop |
|---|---|---|---|
| T0–T1 | none | none | pivot frozen |
| T2 | small: 0.4% of screen height, 80 ms | none | pivot frozen |
| T3 | medium: 0.8%, 140 ms | 4% (player-authored only) | pivot frozen |
| T4 | large: 1.4%, 220 ms | 7% | pivot frozen; shake runs |
| T5 | max: 2.0%, 300 ms | 10% | pivot frozen; shake runs |

- **Stepped shake.** Offsets are screen-space translation only (**no roll**, no FOV wobble), chosen from a fixed 8-step pattern, and each offset is held for **≥ 2 rendered frames** (a new step every 33 ms at 60 fps, every 66 ms at 30 fps). Amplitude decays linearly across the steps.
- **No stacking.** Only one shake plays: a new event replaces the current one if its tier is equal or higher, otherwise it is ignored.
- **Player authorship.** AI-autonomous hits render one tier lower (DR-07), so AI hits never shake above medium.
- **Camera motion budget** (camera-side, inside DR-50): at most one max-tier shake per second; at most two large-or-max shakes in any 1 s; shake active ≤ 50% of any 2 s window. Excess events drop their shake but keep hit-stop and VFX.
- **Punch-in** = a dolly toward the impact point (not an FOV change) by the listed share of distance, in over the hit-stop and out over 150 ms. It never pushes the controlled cat out of the safe frame and is skipped if it would. It never stacks.
- **Impact frames.** A full-screen impact frame (T4, T5; ≤ 1 per second, DR-50) is a VFX/post effect. The camera **holds its pose** for the impact frame's duration and starts the shake on the first frame after it. A jittering full-screen inversion is the flicker the Harding test catches.
- Hit-stop scope (global or local) and the ≤ 20%-per-second cap are Combat's. During global hit-stop camera blends pause; player orbit input is buffered and applied after.

### 3.7 Cinematic: Standoff, Pile-On, Zoomies

All three are authored shot sets owned for timing by Combat and for shot design by Art.
- **Standoff** (2–4 s): one push-in to the Rival, Rival face ≥ 25% of screen height so Scars and Title read; keeps the line of action (Mikan on the same screen side through every shot). The memory-citing line's 1 s no-skip is Combat/Nemesis timing.
- **Pile-On** (Full ≈ 2.5 s, Quick ≈ 1.2 s; Combat owns durations): a wide shot of the dust cloud at +35° to +45°; shake only on the beats (DR-30), each beat one shake event under §3.6's budget; the last beat may be the T5.
- **Zoomies**: the cut-in is a 2D panel (≈ 0.6 s; Combat's timing) over a frozen frame, and only behind the panel may the camera tilt or drop below +35°. The Move itself plays on an authored track.
- **Return pose rule.** Every combat cinematic ends on the rig's solved combat pose for the current controlled cat and target (or blends to it in ≤ 0.3 s). Player input is ignored during a cinematic and the first input after is read in the returned camera's frame. No combat cinematic returns with yaw changed by more than 90°.

### 3.8 Whisker Sense

Holding Whisker Sense blends to the Whisker state over **0.3 s** (+0.5 m, +8° pitch) so the scent compass ring around Mikan (DR-47) sits fully on screen; release blends back over 0.3 s. Not available in combat (DR-08). FOV does not change.

### 3.9 Home (inside Haru's wall)

**Crossing the wall.** Passing the garden wall inward blends Explore → Home over **1.0 s**: a gentle lower-and-tighten, the only transition DS ruling Part 2 §5 allows. No cut, no fade. Outward reverses it.

**Threshold profiles.** The **garden** and the **Doorstep** use Home at its upper values (2.2 m, 0.6 m). The Doorstep Morning Sniff frames Mikan, the Tribute pile and the stamp cards, with no human standing next to the cat in frame. The **Lot** is Explore (it is outside the wall).

**Face-out rule.** In free roam, a standing adult's face stays out of frame within 2.5 m: pitch-up is clamped by §4.3. Humans read as knees, slippers, hands, bags and laps. Faces come into frame when the human kneels, sits on the floor or at the low table, or bends down, which is the staging tool Narrative uses (Pillar 1). Upward tilts toward a face are authored only.

**Routine verbs** (Eat, Rub, Lap, Meow, Knock, piano): no cuts. **Lap** raises the pivot with Mikan (camera height follows to pivot + 0.15 m) and keeps the face-out clamp disabled while Mikan is on the lap, so Haru's face is in frame. That is the reward. **Piano**: walking on the keys holds Explore-like follow at 1.6 m.

**Vignettes** (Keystones, Textures): authored shots. Rules:
1. **Control is preserved.** Where the player keeps walking during a vignette, the input direction is **latched across a cut**: the stick keeps meaning the direction it meant before the cut until it returns to neutral (< 20% deflection) or changes by more than **45°**.
2. **Cut discipline:** consecutive shots in a controllable vignette differ by ≤ 90° yaw where staging allows; shot changes are triggered by Mikan entering authored zones, not by timers, so the player is never cut away mid-step.
3. **Exit:** from the last authored shot, the rig blends to Home behind Mikan in 0.5 s, unless the shot is within 90° of that yaw, when it cuts.
4. Vignettes never use shake, punch-ins or lettering (DR-49, brief §9 tone).

### 3.10 Screens: Fence Line, Turf Board, Pause, Sniff

- **Fence Line** (View / J; read-only on the street, Doorstep and Lot; never in the house, DR-24). A separate rendered diorama of one continuous wall (Nemesis owns the data, UX the screen). Its camera is **side-on, long lens (vFOV 20°), no orbit**; the stick pans along the wall and zooms between two fixed heights so rank (height) is always visible; it never rotates, so the wall reads as one strip. The gameplay rig freezes underneath and resumes the exact pose on close.
- **Turf Board** (the Lot): the only map-like, top-down view (DR-47); orthographic overhead, owned by UX's screen spec. The gameplay rig freezes.
- **Pause / Options**: rig frozen. At home, pause shows only the Mikan tab and Options (DR-24).
- Opening any Screen is a cut; closing restores the frozen pose with no blend, so input frame is unchanged.

### 3.11 Comfort and options (mirrored in `design/accessibility-requirements.md`)

| Option | Values | Default |
|---|---|---|
| Field of view (Explore and Home) | vFOV 40°–60° (≈ 66°–92° horizontal at 16:9); Home capped at 50° | 45° |
| Camera speed | ×0.33–×1.66 | ×1.0 |
| Invert X / Invert Y | on/off each | off |
| Auto-centre | On / Slow / Off | On |
| Screen shake | 0–100% in 25% steps | 100% |
| Punch-ins | on/off | on |
| **Reduce Motion** (DR-50) | on: shake 0, punch-ins off, Combat entry/exit blends doubled in length, Tag-In blends become 0.15 s cuts if motion-sick players prefer (sub-toggle), High Road vertical lag halved | off |
| Hard lock default | toggle / hold | toggle |

Combat distance is solved from frame width (§4.2), so changing FOV does not shrink fighters below their size floor.

## 4. Formulas

### 4.1 On-screen size

`h_screen = h_obj / (2 · D · tan(vFOV / 2))` (share of screen height), where `h_obj` is the subject's visible height and `D` its distance from the camera.

| Case | h_obj | D | vFOV | Result | Target |
|---|---|---|---|---|---|
| Explore, 1.4× cat from behind | ≈ 0.50 m (ears + foreshortened back) | 3.0 m | 45° | **20%** | 10–20% (DR-48) |
| Explore, max FOV | 0.50 m | 3.0 m | 60° | 14% | ≥ 10% at every option |
| Explore, 1.0× cat | 0.36 m | 3.0 m | 45° | 14% | ≥ 10% |
| Combat, at distance_max | 0.45 m | 8.0 m | 45° | **6.8%** (73 px at 1080p, 49 px at 720p) | controlled cat and lock target **≥ 6.7%** (≥ 48 px at 720p) |
| Home | 0.30 m (1.0× cat) | 1.8 m | 45° | 20% | 15–30% |
| Standoff push-in | Rival face ≈ 0.12 m | ≈ 0.3 m | 30° | ≈ 25% | ≥ 25% |

**Size floors (acceptance):** Explore ≥ 10% of screen height; Combat controlled cat and lock target ≥ 6.7%, other on-screen Posse ≥ 5%; Home Mikan ≥ 15%; Standoff Rival face ≥ 25%.

### 4.2 Combat framing

- Framing point `P = lerp(C, T, 0.35)`, where C = controlled cat, T = lock target (if none: `T` = centroid of enemies within 8 m; if none, `P = C`).
- Required frame width `W = clamp(k · |C − T| + m, W_min, W_max)`, with k = 1.4, m = 3.0 m, W_min = 8.8 m, W_max = 11.8 m.
- Distance `D = W / (2 · tan(hFOV / 2))`, with `hFOV = 2 · atan(tan(vFOV / 2) · aspect)`, where aspect is capped at 16:9 for this formula (ultrawide gets extra side view, not a closer camera). At vFOV 45°: tan(36.35°) ≈ 0.736, so D = W / 1.47 → **6.0 m to 8.0 m**.
- If FOV is set wider, D shrinks for the same W, so subjects at P keep the same share of the frame. D is clamped to [4.5 m, 8.0 m].
- Height `= P.y + D · sin(pitch)`; default pitch 25° gives ≈ 2.5–3.4 m.

### 4.3 Home face-out clamp

`pitch_up_max = atan((H_face − h_cam) / D_near) − vFOV / 2`, where H_face = 1.45 m (lowest standing-adult face edge; Narrative may tune per character), D_near = 2.5 m, h_cam = current camera height. At h_cam 0.45 m, vFOV 45°: atan(0.40) − 22.5° ≈ −0.7°, so free pitch is clamped to ≤ 0° (level), as §3.2 states. At vFOV 50°, ≈ −3.2°. The clamp is recomputed when FOV changes.

### 4.4 Blends and springs

- State blend: `pose(t) = lerp(pose_a, pose_b, s(t / T))`, smootherstep `s(x) = 6x⁵ − 15x⁴ + 10x³`. Yaw interpolates along the shortest arc. A blend started mid-blend begins from the current pose.
- Damped follow per axis: `x += (target − x) · (1 − 2^(−dt / half_life))`.
- Collision: `D_actual = min(D_desired, hit_distance − r)` immediately; `D_actual` rises toward `D_desired` with half-life 0.4 s.

### 4.5 Shake

`offset(step i) = A_tier · S · (1 − i / 8) · pattern[i]`, i = 0…7, each step held `max(2 frames, 33 ms)`; `A_tier` from §3.6 as a share of screen height; S = the shake option (0–1); `pattern` is a fixed unit-vector table (deterministic, so captures are reproducible for the Harding test).

## 5. Edge Cases

1. **Combat in a 1 m alley** (the Lane has them): collision beats framing. Pitch rises to +40°, distance compresses to the hit distance; if the lock target still falls outside the safe frame, it gets an edge arrow. Level should keep slice encounter spaces ≥ 6 m across; narrower ones are flagged in the alley test (§8 T2).
2. **Target and controlled cat > 11.8 m apart**: W hits W_max; the controlled cat stays framed and the target gets an edge arrow. Hard lock breaks at 14 m.
3. **Controlled cat Routed mid-Relay**: Relay blend rules apply after the Rout's hit-stop; distance hold continues.
4. **Tag-In to a cat behind the camera**: minimum yaw turn ≤ 60°; if more would be needed, yaw turns 60° and the incoming cat gets framed by distance (W grows) rather than a spin.
5. **Two T5s within 1 s** (a Pile-On final beat right after a Frazzle hit): the second keeps hit-stop and VFX but its max shake is dropped (§3.6 budget); the impact-frame cap is Combat/VFX's.
6. **Shake during Slow Blink**: none. Events landing at 5% time play their shake at real-time length when Slow Blink closes only if still within 0.2 s; otherwise dropped.
7. **Mikan under the veranda during a home vignette trigger**: vignette zones are never placed in Low Ceiling volumes; if a Keystone fires there, the vignette waits until Mikan exits (Narrative rule; camera reports the conflict).
8. **Garden crow tutorial (DR-22, 0:04–0:08) vs "no combat inside the wall"**: the camera uses Home's upper values with Combat framing (W_min 4.5 m, pitch +20°) for that beat. **Cross-doc flag** to Combat and Narrative: confirm whether that beat is an `EncounterStarted` fight or a scripted interaction.
9. **Mikan carried or lifted by a human** (lap, lift): pivot follows Mikan; face-out clamp off while held.
10. **Falling off a roof edge**: vertical lag releases at 1.0 m below take-off; follow half-life drops to 0.06 s until landing.
11. **Ultrawide (21:9)**: Hor+ shows more sides; combat formula caps aspect at 16:9 so the camera does not move closer. HUD stays within the 16:9 safe frame.
12. **Camera input during a cinematic**: ignored, not buffered (prevents a flick on return). Movement input is buffered for 0.1 s.
13. **Fence Line opened mid-Hop**: refused until Mikan lands (UX may grey the prompt).
14. **Head Home thread behind the camera**: no auto-turn; UX's thread starts at Mikan's feet. Pressing recentre while the thread is shown recentres along the thread's first segment.
15. **Reduce Motion plus a Pile-On**: cinematic plays with no shake and with cuts instead of moves where an alternate shot exists.

## 6. Dependencies

| System / doc | The camera needs | The camera provides |
|---|---|---|
| **Combat** (`combat-system.md`) | `EncounterStarted` / `EncounterEnded`, `TagIn`, current target, ring centre and radius, a feel event per DR-07 tier hit with `tier, position, is_player_authored, hit_stop_scope` (**proposed name `ImpactEvent`**), cinematic timings (Standoff, Pile-On, Zoomies) | `frame_bias_region`; per-combatant on/off-screen state |
| **UX** (`ux/hud.md`, `accessibility-requirements.md`) | Edge arrows, HUD safe frame, options UI, control map (DR-08), Fence Line and Turf Board screens | Screen-edge bearings, safe-frame rectangle, option hooks |
| **Art** (`art/art-bible.md`) | Cat scale decision, dither-fade and x-ray keyline in the toon shader, Slow Blink grade, cinematic shot design, painted sky/backdrop placement for these sightlines, look-dev alley | `CameraSubjectOccluded`, state far-clip distances, screen-size LOD metric |
| **Level design** | Camera-solid/soft tags, ≥ 1.0 m camera-clear alleys, ≤ 15 hint volumes per district, encounter spaces ≥ 6 m | Alley test report |
| **Narrative** (`dual-story-progression.md`) | Vignette shot lists, Keystone trigger zones, which humans kneel/sit when | Home rules §3.9, input latch |
| **Nemesis** | Fence Line data; Standoff Rival identity | — |
| **Day loop** (`day-loop.md`) | `HomeArrived`, wall-crossing trigger, Head Home thread | — |
| **Audio** | — | Listener at the pivot, oriented to camera yaw (so the cat hears from where it stands) |

**Performance (proposed; no camera budget is stated in the project yet).** Camera update ≤ 0.3 ms CPU per frame on the PC slice target (≤ 6 sphere/ray casts per frame). LOD and particle LOD switch on **screen-size**, not distance, so the FOV option cannot raise draw calls or vertex counts. The low street camera puts sky, hills and sea in frame: backdrop cards and the skydome are the cheap answer, and the rendering budget for those sightlines belongs to the look-dev test (E-2).

## 7. Tuning Knobs

| Knob | Start | Safe range | Affects |
|---|---|---|---|
| explore.distance / pitch / vFOV | 3.0 m / +10° / 45° | 2.4–3.6 m / +5–+20° / 40–60° | scale feel, cat size |
| explore.pivot_offset | head + 0.10 m | 0–0.25 m | horizon height |
| follow half-lives (pos / yaw) | 0.12 s / 0.25 s | 0.05–0.3 / 0.1–0.5 | lag feel |
| recentre delay / rate | 1.5 s / 90°/s | 0.8–4 s / 30–180°/s | auto-centre |
| vertical lag release (down / up) | 1.0 m / 1.5 m | 0.5–2 m | High Road bob |
| collision radius / return half-life | 0.15 m / 0.4 s | 0.1–0.25 / 0.2–0.8 | clipping vs pops |
| combat W_min / W_max / k / m | 8.8 / 11.8 / 1.4 / 3.0 | 7–10 / 10–14 / 1–2 / 2–4 | brawl framing |
| combat pitch | +25° | +15–+40° | depth read |
| P lerp toward target | 0.35 | 0.2–0.5 | look-past framing |
| safe frame | 80% × 75% | 70–90% | HUD clearance |
| Tag-In blend / Relay hold | 0.3 s / 3 s | 0.15–0.5 s / tied to Combat | switch readability |
| Slow Blink distance / pitch / blend | 8.5 m / +50° / 0.2 s | 7–10 / 40–60° / 0.1–0.4 | tactical view |
| shake amplitudes T2–T5 | 0.4/0.8/1.4/2.0% | ≤ 2.5% max | feel vs comfort |
| punch-in T3–T5 | 4/7/10% | 0–15% | impact |
| home distance / height | 1.8 m / 0.45 m | 0.6–2.2 / 0.30–0.60 | cat-height feel |
| H_face / D_near | 1.45 m / 2.5 m | 1.3–1.6 / 1.5–3.5 | face-out rule |
| input latch angle | 45° | 30–60° | control across cuts |
| wall-crossing blend | 1.0 s | 0.6–1.5 s | home transition |

## 8. Acceptance Criteria

**Prototype and look-dev tests that validate this spec.**
- **T1 · Combat rig in the grey-box prototype (DR-02).** Mikan + 3 against 6 enemies in a 10 m ring and a 3-phase Boss on a wall. Logged per frame: controlled cat and lock target inside the safe frame; distance; shake events.
- **T2 · Alley test inside the one-alley look-dev (E-2).** Corridors 1.0 / 1.5 / 2.0 m, an L-corner, veranda crawl space (0.45 m), fence run, roof ridge, laundry pole, bicycle. Scripted path plus 5 free-roam testers.
- **T3 · Home mock** (Main Room with low table and piano, mannequins standing, kneeling and seated). Face-out check; a controllable two-cut vignette walk.
- **T4 · Comfort test.** 8 testers, 20 min mixed play at defaults and at Reduce Motion, short simulator-sickness questionnaire before and after.
- **T5 · Flash capture.** Recorded default-setting footage of the worst-case Pile-On and Zoomies sequence with shake, run through the Harding-style analysis (DR-50).

**Pass conditions.**
1. Explore: Mikan's on-screen height is 10–20% at default and ≥ 10% at every FOV option (automated capture, T2).
2. Combat: controlled cat inside the safe frame ≥ 98% of combat frames outside cinematics; lock target ≥ 90%; both ≥ 6.7% of screen height when on screen (T1).
3. Combat distance stays in 6.0–8.0 m at default FOV in ≥ 95% of combat frames not under collision constraint (T1).
4. A four-cat Relay produces no frame where the incoming cat is off-screen for > 0.15 s (T1).
5. No camera clipping into camera-solid geometry in T2's scripted path; ≤ 1 visible collision pop (distance jump > 0.5 m in one frame on ease-out) per minute of free roam.
6. Hint volume count ≤ 15 for Hidamari Lane, ≤ 5 for the House (asset audit).
7. Home: no standing adult's face appears in free-roam frames within 2.5 m (T3); faces appear in ≥ 1 authored shot per Keystone when the human kneels or sits.
8. Across a vignette cut, a held stick keeps Mikan walking in the same world direction in 100% of T3 trials until the stick changes by > 45° or is released.
9. Every combat cinematic returns within 90° of the pre-cinematic yaw and on the solved combat pose (log check).
10. Shake: no roll; every offset held ≥ 2 rendered frames at 30 and 60 fps; ≤ 1 max shake per second (log check).
11. T5 passes with the default configuration.
12. T4: at Reduce Motion, no tester reports moderate or worse nausea; at defaults ≤ 1 of 8.
13. Camera update ≤ 0.3 ms CPU per frame on the PC slice target (profiler capture).
14. Wall crossing into Home produces no cut or fade and completes in 1.0 s ± 0.1 s.

### Assumptions for creative-director review
- Street cat scale 1.4× (0.63 m) is assumed for numbers; Art's ruling may change it (all floors still pass at 1.0×).
- A combat feel event (`ImpactEvent`) is a new interface the brief's §6.1 table does not list; Combat to emit it.
- Fight ring "≈ 10 m" is read as diameter.
- Floor-seated humans (low table, kneeling) are Narrative's main way to bring faces into frame.

## Backlog (post-slice)
- AB-2/AB-3: crowded-fight readability (10 combatants, 48 px floor stress test) beyond the slice's 1–6 enemy groups.
- AB-10/E-5: handheld camera tuning (30 fps step timing check, lower FOV default, collision cast budget on Switch 1-class).
- Akane Arcade covered street (low ceiling over a wide space), shrine stairs and Shiosai harbour/tetrapod collision profiles.
- Lighthouse Summit and Botan fight framing (4–5 min, Trickster ranged spacing).
- Roof Run fast-travel camera (TE Backlog).
- Life 8 Carry camera (carry-escort framing with Mikan unable to attack) and Life 9 farewell walk shots (Narrative §9).
- Lap/lift two-shot authoring tool for many vignettes; full-game vignette shot library (≈ 58 vignettes).
- Photo mode.
- Spectator-friendly "trailer camera" for capture (must still pass the flash test).
- Mouse-specific smoothing and raw-input options beyond sensitivity.
- Per-character H_face values for Sora, Koharu (child height changes the face-out rule) and Gran.
- Dynamic Posse-wide framing mode (all four cats) as an option, if T1 shows players want it.

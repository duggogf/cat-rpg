# M1 combat grey box — presentation evidence (artifact slice)

PROTOTYPE - NOT FOR PRODUCTION. Throwaway browser showcase (three.js 0.160.1), `prototypes/artifact-slice/`.
Plan: `production/artifact-slice/IMPLEMENTATION-PLAN.md` §3.3–§3.4, §4.5–§4.6, §5 M1, §5.2.
The rules run in the deterministic sim (`src/sim/combat/`, its own tests); this folder is the
**presentation half**: combat sandbox, camera, feel/VFX, HUD, input, capture harness.
(`cats/` is the cat builder's evidence, not produced here.)

## Run

```bash
cd prototypes/artifact-slice && npm install
node tools/m1-shots.mjs            # bundles src/entries/combat.js -> dist/combat.{js,html}, writes everything here
node tools/m1-shots.mjs --only pile,flash --no-build   # subsets: random, pile, slowblink, guest, daifuku, flash
node tools/serve.mjs 5173          # then http://localhost:5173/dist/combat.html?fight=toughs3
```

`tools/build.mjs` also emits `dist/combat.html` (every file in `src/entries/` is an entry).
Query params: `?fight=toughs3|captain|daifuku|sandbox|challenger|lose`, `?seed=N`, `?script=bot|median|daifuku|passive`
(a bot drives the controlled cat: demo mode), `?phase=dusk`, `?flash=reduce`, `?motion=0..1`, `?rim=0`, `?hud=0`,
`?brace=toggle`, `?test=1` (deterministic; `window.__cat.frames(n)`, `.until(eventType)`, `.inject(inputFrame)`,
`.menu(evt)`, `.state()`, `.hash()`, `.events()`, `.debug()`).

Controls (Combat §3.1 / HUD §8, desktop only): WASD move · LMB attack · Space hop · Shift skitter · RMB brace ·
F hiss / Pile-On · Tab Slow Blink (W/S rows, Q/E cat, Space confirm, Esc back, Tab close) · 1–4 Moves ·
Z X C V switch / Tag-In · wheel or MMB next lock · drag or pointer-lock (double-click) orbit · P pause.
Gamepad (standard mapping): LS, RS orbit, West attack, South hop, East skitter, R1 brace, North hiss, R2 Slow Blink,
L1 + face = Moves 1–4, D-pad switch, R3 lock. **The gamepad path is untested** (no pad in headless runs).

## Shots (1920 × 1080, SwiftShader; one line each)

| File | What it shows |
|---|---|
| `random-01..10.png`, `random-sheet.png` | 10 seeded random pauses across toughs3 / sandbox / captain / challenger / daifuku with bot input (HUD §4.6 readability test material) |
| `impact-t4-rout-inversion.png` | T4 Tough Rout, drawing 1 of the full-screen impact frame: background flattened to one lavender mid tone matched to the frame's mean luminance, Ink silhouettes with Cream lines, the effect keeps its colour, HUD untouched |
| `impact-t4-rout-after.png` | same Rout 4 frames on: radial focus lines on 40% of the edge (centre clear), the lettered word placed off the controlled cat and HUD |
| `tagin.png` | Tag-In: bell-gold streak with its Relay pip, plate flash, Relay chain, 0.3 s retarget |
| `pileon-01..08.png`, `pileon-sheet.png` | Pile-On set-piece: halftone wipe in (3 drawings) → static Bell-Gold panel + full-field Ink lines → scalloped cloud boiling on twos with coat-coloured paws/tails, Mikan peeking, Posse chevrons, the routed Tough bolting → burst + giant word + four-puff reveal → outcome card |
| `slowblink-menu.png`, `slowblink-target.png`, `slowblink-queued.png` | Slow Blink: ×5% time, lifted view, −30% sat / −10% value grade, command menu (Move costs, Set-up/Pay-off diamonds), bracket target step, queued command |
| `guest-join.png` | challenger + Stray with Togemaru's Nose-Touch join: dashed-gold guest plate above the stack (no glyph, no Paws) |
| `daifuku-standoff.png`, `daifuku-wall.png`, `daifuku-knockoff.png`, `daifuku-tub.png`, `daifuku-phasebreak-1/2.png`, `daifuku-flees.png` | Daifuku phase 1 on the wash-tub kit: name-card, identity ribbon (3-phase Nerve, Furious puffs, Fired Up pom), knock-off, tub splat (opaque blobs, no liquid), phase break T5, rival_fled |
| `flash-frame-*.png` | every 30th frame of the flash-screening capture (480 × 270) |
| `results.json` | per-shot draw calls / triangles / page errors; full per-frame flash data |

## Flash screening (Pile-On capture) — a screening tool, NOT a certified Harding test

420 frames at a fixed 60 fps (2 s before the toughs3 seed-7 Pile-On through 2.5 s after it, including the
Rout's full-screen impact frame and the Pile-On panel). Relative luminance per pixel (sRGB → linear,
Rec. 709 weights). A frame is a transition when a same-direction change of ≥ 0.10 (darker side < 0.80)
covers > 20% of the screen (art bible §10.9); a flash is a pair of opposing transitions.

| Check | Cap | Result |
|---|---|---|
| Flashes in any 1 s | WCAG 3 · design 2 | **2** — pass (round 2; was 3 before crowd-hide hysteresis) |
| Flashes in any 5 s | design 6 | **2** — pass |
| Saturated-red change area | ≤ 5% | **0.01%** — pass |
| Transitions in 7 s | — | 6 (round 2): close-camera hit/swing repaint, the Pile-On's opening impact frame + panel wipe, the panel leaving |

**Round 2 finding:** at the new 3.8 m camera, an AI cat hidden and re-shown at the lens edge blinked a large area (3 flashes/s); fixed with hysteresis and a 0.6 s hold. **Found and fixed in round 1:** the first capture FAILED (7 flashes/s): the full-field Ink lines on the gold
panel were re-randomised every drawing (≈ 22% of the screen repainting at 15 Hz). The line set is now fixed per
effect and successive drawings only nudge the tips (±2.5%), and radial lines no longer ride the camera shake.

## Performance (headless SwiftShader: counts only; frame time needs a real laptop, plan §4.8)

Draw calls 35–110 (budget ≤ 350). Visible triangles 0.49–0.86 M with 8 cats (budget ≤ 0.5 M): each cat is
drawn 4× (cel fill, ink hull, Bell-Gold/Sage keyline shell, Paper Cream rim shell) plus a re-draw of the
controlled cat above the VFX. `?rim=0` drops the rim shell (−27 k triangles per cat). Bundle `dist/combat.js`
≈ 690 KB unminified (kit drawings ≈ 110 KB, kit fonts inlined ≈ 120 KB). CPU, sandbox fight with 8 cats: sim + presentation
update ≈ 0.7 ms per frame; a full frame including the DOM HUD, the SVG screen layer and WebGL submission ≈ 4.6 ms of
main-thread time under SwiftShader. Real-time FPS on a GPU is unmeasured.


## Round 2 (directors FIX / designer GO WITH FIXES) — presentation changes

- **Camera (owner direction, FF7R third person):** the rig sits behind the controlled cat at 3.8 m, +12°, with a 0.45 m
  shoulder offset and a 20% lead toward the lock target. It pulls out to ≤ 6 m only while the target is > 4.5 m away,
  pulls in before camera-solid geometry, and hides AI cats that crowd the lens. Slow Blink pushes in low (4.6 m, +20°),
  and the target bracket now frames the cat's body. `design/gdd/camera-system.md` §3.2, §4.1, §7 and §8 are amended,
  with the change logged as "Owner direction: third-person behind the cat (2026-11-24)".
- **Casts:** `CAST_MAP` in `src/render/vfx/fighters.js` now uses the real casts. Toughs and Strays are `tough` variants,
  and no gang coat repeats a Posse coat. HUD portraits read the same table. The controlled cat is drawn at
  `setLod('full')`; at most the 2 nearest other cats may take the full mesh, and the rest stay low. **10-cat brawl
  (`brawl10.png`, `results.json.brawl`): 0.28–0.48 M triangles, median 0.38 M (budget 0.5 M).**
- **Hits:** each player hit adds a head-sized starburst, a larger slash arc, a ground crack, pebble debris and a T1
  smear. Lunges stretch 1.42× and recoils squash. Local Cream shapes are capped at about 40% of screen height so
  DR-50's flash area holds.
- **Arena:** dressing comes from the sim's exported bounds, and walls sit on the ring edge. A close fence encloses
  three sides. Inside the ring are a tarp, planks, tyres, a crate and box, pots, pebbles and grass at the fence bases.
- **HUD and feel:** glyphs follow the input device. On keyboard + mouse: Z X C V on the plates, Q/E, Space, Esc, Tab,
  A/D and F in Slow Blink and on prompts, plus a P / Tab key strip. Fight barks are icon-only, one balloon at a time,
  with a personality pictogram. A Move cast shows its pom on the user's plate, a bark, a ring, a lunge and hearts for
  heals. Each Pile-On beat pops that cat's face with its flourish and its Style word (SKRITCH / WHAM / YOWWL).
- **Publishing:** `src/entries/main.js` now accepts `?chapter=combat&fight=toughs3|captain|daifuku`, which hands the
  page to `combat.js` (now in the publish set). Both scenes show a kit-styled chapter pill. `node tools/publish-check.mjs`
  is green for the default and for both `?chapter=combat` fights.
- **Clip:** `fight-clip.webm` is 7 s at 60 fps around a Tough Rout, for judging shake and hit-stop in motion.
- Run `node tools/m1-shots.mjs --only brawl,clip` for those two sections.


## M1.1 (owner direction, `design/reviews/owner-feedback/combat-m1.1-spec.md`): presentation

The player controls **Mikan only**. Controls: WASD move; the mouse drives the camera (click captures the pointer);
LMB light; RMB heavy (hold to charge); Space dodge; Shift dash; **Tab lock-on cycle**; **F Special** (a context
prompt, only on a staggered enemy); **R skill bar**; P / Esc pause. The gamepad mirrors this but is untested.
Z X C V switching and the Tag-In cue are gone. Run `?script=demo` for the M1.1 player bot. The presentation reads the
reworked sim's API (`light`, `heavy` held, `dodge`, `dash`, `special`, `skillBar`, `lockOn`; `special_prompt`,
`special_chain`, `intent`, `staggered_s`, `attack`) and falls back to the M1 inputs on the old sim.

| File | What it shows |
|---|---|
| `stagger-01..04.png`, `stagger-sheet.png` | Stagger cinematic. A zoom onto the staggered cat with a ≈ 30° swing so Mikan does not hide it, the sim's time slow, then the shattered-glass blink: Ink and Cream cracks, with Cream shard tints at ≤ 0.16 alpha so they pulse softly and never strobe. Full treatment for Captains, Bosses and the first stagger; light for Toughs |
| `special-cutin-1..4a/b.png`, `team-finisher-1..3.png`, `special-chain-sheet.png` | F Special chain. Mikan's cut-in, then each crew cat with a ready meter, then the Team finisher (the Pile-On art, one beat per cat with its face and word), ending on KA-BLAM. During each cut-in, time is stopped and only that cat renders, close up, over an impact-frame panel: the cat's colour value-matched to the frame's mean luminance, full-field Ink lines, a 3-drawing halftone wipe in. The name band shows the Special (Midnight Laps / Landslide / Midnight Aria) and the chain's paw pips. Cut-ins are shortened after the first chain (the sim's timing) |
| `skillbar-*.png` | Skill bar (R). Time slows; Q/E picks a crew cat to force its skill; target brackets; the cast shows a name banner in the cat's colour, a wind-up pose and a plate highlight |
| `latency-*.png`, `results.json.latency` | Three rapid clicks. The first light is on screen within the sim's first active frame (`latency_ticks`); the later presses are dropped or buffered (the one-slot buffer), so three attacks never queue |
| `stalk-1..4.png`, `stalk-sheet.png`, `results.json.intents` | AI intents, animated. While squaring off, cats face their opponent: a low creep for circling, stalking and flanking; an arched, puffed posture with hiss glyphs and claw ticks; a crouched retreat; a stretched dash-in with a streak. The sim's `intent` is used when it is specific; its default is refined from the cat's motion |
| `brawl10.png` | 10-cat triangle budget (`results.json.brawl`) |
| `fight-clip.webm` | 10 s at 60 fps: strings, a stagger, the full Special chain and the Team finisher |

Plates no longer show control keys. Each plate has a Special meter (a ring in the cat's colour; it pulses when full)
and lights in the caster's colour when that cat uses a Move. A lock-on reticle marks the locked enemy, and an F
SPECIAL prompt appears over a staggered enemy when Mikan's meter is ready. The key strip reads Tab Lock · R Skills ·
P Pause.

**M1.1 numbers:** flash screening on the 10 s Special-chain capture (stagger, four cut-ins, Team finisher): 0 flashes/s, 2 per 5 s, red-change area 0.7% — all pass. The first M1.1 capture FAILED the red rule: the ginger cut-in panel was double colour-managed and showed as a saturated orange-red field (76% of the screen); the panel is now raw-sRGB and red-leaning colours are pulled toward Cream. Latency: a light's first active frame lands 2 ticks after the press (≤ 3 required); clicks 2 and 3 (4 ticks apart) were dropped by the one-slot buffer. 10-cat brawl: 0.23–0.49 M triangles (median 0.36 M).

**M1.1 weak spots:** the staggered cat can still sit behind Mikan in the zoom (the ≈ 30° swing helps but does not always clear her); forced crew skills need the target in range, so `skillbar-cast.png` may show the queued pom rather than the cast; gamepad untested; no audio.

## Known gaps / deviations (for the art + creative directors)

- **Combat poses are procedural** (lunge, recoil, squash, arch, puff, splat) on a wrapper: the cat rig has only
  idle/walk. No spiral-eye decal: two spiral glyphs float over the face when it turns to camera.
- **Along-the-wall views:** when a fight hugs the sandbox's High Road wall, the occlusion turn can still give a side-on view with a smaller cat (about 3 of 10 random pauses).
- Lettering uses Dela Gothic One (the kit's stand-in), not hand-lettered SDF assets; English set only.
- No Zoomies pom (Zoomies not in M1 scope), no damage numerals (default Off), no audio.
- Hit-stop / time-dip are honoured from the arbiter (`feel`); the time dip slows the sim stepping.

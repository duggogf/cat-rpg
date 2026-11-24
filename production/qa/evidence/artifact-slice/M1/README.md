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
| Flashes in any 1 s | WCAG 3 · design 2 | **1** — pass |
| Flashes in any 5 s | design 6 | **2** — pass |
| Saturated-red change area | ≤ 5% | **0.01%** — pass |
| Transitions in 7 s | — | 5: a full-screen impact frame in/out (ticks 1327/1329), the Pile-On's opening impact frame + panel wipe (1440/1442), the panel leaving (1527) |

**Found and fixed in this pass:** the first capture FAILED (7 flashes/s): the full-field Ink lines on the gold
panel were re-randomised every drawing (≈ 22% of the screen repainting at 15 Hz). The line set is now fixed per
effect and successive drawings only nudge the tips (±2.5%), and radial lines no longer ride the camera shake.

## Performance (headless SwiftShader: counts only; frame time needs a real laptop, plan §4.8)

Draw calls 35–110 (budget ≤ 350). Visible triangles 0.49–0.86 M with 8 cats (budget ≤ 0.5 M): each cat is
drawn 4× (cel fill, ink hull, Bell-Gold/Sage keyline shell, Paper Cream rim shell) plus a re-draw of the
controlled cat above the VFX. `?rim=0` drops the rim shell (−27 k triangles per cat). Bundle `dist/combat.js`
≈ 690 KB unminified (kit drawings ≈ 110 KB, kit fonts inlined ≈ 120 KB). CPU, sandbox fight with 8 cats: sim + presentation
update ≈ 0.7 ms per frame; a full frame including the DOM HUD, the SVG screen layer and WebGL submission ≈ 4.6 ms of
main-thread time under SwiftShader. Real-time FPS on a GPU is unmeasured.

## Known gaps / deviations (for the art + creative directors)

- **Cast stand-ins:** only `mikan` and `wallSitter` casts exist, so every other cat is a grey tabby (scale varies;
  Daifuku 1.7×). Identity comes from the keyline colour, ticks and plates. One mapping table
  (`src/render/vfx/fighters.js` `CAST_MAP`) switches them when the cast lands. HUD portraits use the kit's
  designed coats, so plates and 3D do not match yet.
- **Combat poses are procedural** (lunge, recoil, squash, arch, puff, splat) on a wrapper: the cat rig has only
  idle/walk. No spiral-eye decal: two spiral glyphs float over the face when it turns to camera.
- **Free-standing High Road wall:** the sim's ring runs 0.6 m past the sandbox wall, so fights happen behind it;
  the camera turns (≤ 90°) to keep both cats visible, which gives some along-the-wall views (`tagin.png`).
- Lettering uses Dela Gothic One (the kit's stand-in), not hand-lettered SDF assets; English set only.
- No Zoomies pom (Zoomies not in M1 scope), no damage numerals (default Off), no audio.
- Hit-stop / time-dip are honoured from the arbiter (`feel`); the time dip slows the sim stepping.

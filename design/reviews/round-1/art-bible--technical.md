# Round 1 Critique: `design/art/art-bible.md` (technical-art review)

*Reviewer: technical-artist · Date: 2026-11-23 · Target: art-bible Draft v0.1*

**Coverage.** I read the whole art bible (§1–15, 1,075 lines). In `design/gdd/combat-system.md` I read Game Feel (Feel Reference, Input Responsiveness, Animation Feel Targets, Impact Moments, budget rules, Feel Acceptance Criteria), Visual/Audio Requirements, CR-6 (camera) and CR-20.2–20.3 (accessibility and photosensitivity). I skipped the rest of the combat doc. I read the brief, the pillars, the user's reference still, and the Unity 6.3 and Godot 4.7 rendering references in `docs/engine-reference/`.

**Method.** I worked out every contrast ratio, colour difference and colour-vision result below from the bible's hex values: WCAG 2.x relative luminance, CIEDE2000, and Machado 2009 colour-vision matrices at full severity. Camera numbers use plain lens trigonometry. The scripts are not part of the design. Engine claims that the engine-reference files do not cover are marked **(unverified)**.

---

## 1. Verdict: **NEEDS REVISION**

This is an unusually good first draft. The look rules are clear and nearly every requirement comes with an acceptance test. But the identity statement, "ink what acts, paint what stays", rests on a painted-environment pipeline the doc never chooses or costs. Its camera and scale numbers, combined with Combat's, put a fighting cat at about 38 px on a 720p handheld, not the 64 px the whole silhouette system is designed for. Its combat VFX annex contradicts Combat's game-feel table on almost every row, including the photosensitivity limits. Those three are blockers. None needs the bible rewritten, but all three must be settled before look-dev starts.

## 2. What is strong (must survive revision)

- **"Ink what acts, paint what stays."** The rule unifies readability, affordance and tone in one sentence. Keep it as the rule. Issue 1 is about making it buildable, not about dropping it.
- **R-CEL decoupled character light, authored shade tones and zone tint.** The zone tint uses one shadow test at the cat's root, not shadow maps. It is the right call for a fixed camera and is cheap on a handheld.
- **Inverted hull outlines in screen-space pixels, no full-screen post outline for characters.** Correct, and correctly argued (§10.2).
- **R-STEP defined per display rate, with "input is never delayed by stepping".** Most toon specs miss this.
- **Pile-On cloud spec, glyph bursts, "shape first, colour second" for damage types.** These are the strongest feel-language content in either doc.
- **The household colour script (§4.7) and witness objects (§6.3).** This is the USP, delivered with tools a cat can perceive. Keep it untouched.
- **§15 honesty.** Most of my issues sharpen weak spots the author already flagged. The revision should put numbers on them, not argue with them.

---

## 3. Issues

### Issue 1 — BLOCKER — §6.1, §8.3, §10.3, §15.2.8–9: "paint what stays" has no production method, and the one implied is unaffordable and fights the moving sun

**What is wrong.** R-PAINT asks for "hand-painted albedo with light and shade painted in" at 256 px/m (PC) and 128 px/m (handheld) over every surface in the play space, unique and unlined, under a sun that moves through four phases. The doc never says how a gouache painting ends up on 3D geometry that the camera moves over. Three methods exist, with very different costs:

| Method | How it works | Look fidelity to the reference | Runtime cost (Switch-class) | Production cost | Verdict |
|---|---|---|---|---|---|
| **A. Hand-painted UV textures on modular kits** (what §8.3 implies) | Painted tiling textures and trim sheets plus vertex-colour variation, as in many "painterly" 3D games | Low to medium. Tiling repeats destroy the unique-painting feel; painted-in light disagrees with phase shadows (§15.2.8) | Low | Medium for tiling. *Unique* painting at 256 px/m over about 30,000 m² per district is roughly 2 gigapixels of UV-space painting per district: infeasible | Reads as "textured 3D", not gouache |
| **B. Camera-aligned paint-over plates** (my recommendation) | Canon fixes pitch and yaw per area and forbids rotation. With a 25–30° lens, every visible surface is seen from almost one direction. Render each area's grey-box from the canonical view direction, an artist paints over the render, and the painting is projected back along the view direction onto low-poly proxy geometry. The proxy still provides depth, occlusion, High Road collision and blob-shadow surfaces. Disco Elysium's paint-over-3D environments are the nearest shipped precedent (recollection, unverified) | **High.** A real painting with brush direction chosen per composition: the reference's quality | **Very low.** Unlit, one texture fetch, one shadow-mask fetch, world-space grain. About 1 draw call per plate tile | Per-area paint-over. About 30,000 m² × (128 px/m)² ≈ 490 Mpx per district at handheld density: ≈220 MB in ASTC 6×6 or ≈490 MB in BC7, streamed by tile. PC at 256 px/m is 4×: about 2 GB of BC7 on disk per district, about 12 GB for six districts | Recommended |
| **C. Real-time painterly filter** (Kuwahara or brush-stroke post pass on the environment) | Filters a normally lit 3D scene | Medium; looks like a filter, not gouache | **High.** Even a 4-sector Kuwahara at radius 4 is about 80 taps per pixel at 720p, a large share of a Switch 1 handheld GPU frame (estimate) | Low | Reject for handheld; PC-only polish at most |

**Why it matters to the player.** This is the whole look. Method A will not deliver the reference. Method C will not hold 30 fps. If the choice is left implicit, art production starts on A by default and the game ships looking like any cel-shaded 3D game.

**Fix.** Rewrite R-PAINT around Method B:
1. One painted **plate per camera area per yaw**, painted in neutral, slightly warm overcast light with **no cast shadows painted in**.
2. Phase shadows come from a **baked per-phase shadow mask**: one RGBA texture, one channel per phase, stored as a signed distance field so hard edges survive at 32 px/m. That costs about 30 MB per district. The 20 s phase blend interpolates the SDF channels, so shadows slide instead of cross-fading.
3. Characters sample the same mask at their root for the zone tint. **No runtime shadow maps at all.** Cel props use blob shadows as already specified.
4. Bespoke Dusk repaints only where a vista shot uses them.
5. Pitch limit: the plate is valid from pitch 45° to 60°. Below 45°, revealed surfaces have no paint. Every shot below 45° (Combat's cinematic 35–45°, Art's Pile-On 20–30°) must be over a full-field graphic panel, which both docs already want for Pile-On and Zoomies, or over a dedicated painted backdrop.
6. Delete "256 px/m painted albedo" from §8.3 and replace it with plate texel density and streaming tile size, initially 2048² tiles.

Approve this only after a one-area look-dev test on target hardware. I can prototype it in either engine; it uses no engine-specific API beyond custom shaders.

### Issue 2 — BLOCKER — §5.6, §13.1, §13.4 vs combat CR-6.3: the camera numbers do not produce 64 px cats; the real worst case is about 38 px

**What is wrong.** Art sets FOV at 25–30° and about 9 m of ground across the frame in exploration. Combat sets the brawl distance at 10–16 m with pitch 57°, and requires every combatant inside the central 85% of the frame for a ring about 12 m across. These numbers do not agree:

- **Ring framing is limited by frame height, not width.** A 12 m ring seen at 57° pitch spans 12 × sin 57° ≈ 10.1 m of frame height. To fit that inside 85%, the frame must be 11.9 m tall, which at 16:9 means **21 m wide**, whatever the FOV.
- **At 21 m wide, a 1.4×-scale cat (0.63 m) is 38 px long side-on at 720p and about 32 px walking toward or away from the camera** (foreshortened by sin 57°). On a 1080p handheld it is 57 px.
- With Art's lens (27.5° vertical) the camera must sit about 24 m away to frame that ring. Combat's 16 m clamp gives a 13.9 m × 9.3 m frame, so cats at the ring edge leave the screen. In that framing the cat is 58 px side-on at 720p (49 px toward the camera). That is the only configuration close to 64 px, and it does not fit the ring.
- The §5.6 table header says "(1080p)" while its handheld row uses a 720p figure. The silhouette acceptance test (§3.2) is run at 64 px, static and without VFX, which is not the real case.

**Why it matters.** The player cannot tell their Scrapper from an enemy Tough, and the nemesis system's "visible history" disappears exactly where it is meant to pay off (Pillar 4, brief risk 4).

**Fix.**
1. One camera spec (see Issue 6) with a stated vertical FOV of 28°.
2. A **brawl frame no wider than 14 m** (frame height ≈ 7.9 m, cats ≥ 58 px side-on and ≥ 49 px toward the camera at 720p).
3. Combat either shrinks the ring to about 9 m, which fits 14 m at 85%, or accepts that ring-edge combatants use the edge indicators it already specifies.
4. Rewrite §3.2 and §5.6 to test at **48 px, moving, at 30 fps, with T2 effects on screen**, on target hardware. 64 px becomes the exploration minimum.

### Issue 3 — MAJOR — §3.2, §3.3, §5.6: the trait system spends its distinctness on features that are invisible at bird's-eye distance

**Smallest readable feature.** On a Switch 1 handheld (6.2", 720p, viewed at about 35 cm), one pixel subtends about 1.05 arcmin, right at the limit of normal visual acuity. Telling one shape from another needs about 5–6 px when the frame is calm and about 8 px under shake, hit-stop and effects. On a 48 px cat (my proposed worst case; 38 px in the current numbers), **8 px is one-sixth of the body length.** On a 1080p, 7.9" handheld (Switch 2 class) a pixel is about 0.89 arcmin and the thresholds hold in pixels.

| Axis | Distinct at 48 px in a fight? | Why |
|---|---|---|
| Footprint (6 bodies) | **3 classes**: round (Loaf/Sprout/Puff), standard (Bean/Wedge), long (Noodle) | Bean 1.8:1 vs Wedge 1.9:1 is a 1 px width difference; Puff vs Loaf vs Sprout differ by less than 2 px |
| Scale (rank) | Yes | ×1.15 and up is 7 px or more |
| Dominant colour | Yes, apart from near-pairs (Mikan Ginger vs Marmalade ΔE 5.0) | |
| Pattern macro-class | About 5 classes: solid, bicolour with white, striped/tabby, patched (calico/tortie), pointed | A 4% element is about 41 px² (≈6 px square) on a 48 px Bean: threshold |
| Tail (8) | **About 4**: long/whip, plume/bottle-brush, short/stub, hook | Kinked vs broken-tip vs ringed differ by 2–4 px |
| Ears (6) | **About 2**: upright vs folded/flat | An ear is about 5–7 px. A notch is 1–2 px |
| Head (3) | No | Head about 12 px wide, seen from above and behind |
| Scars, plasters, regalia | No (the bible admits this for combat) | 2–4 px |

**Why it matters.** Distinctness rule 1, the unique (body, tail, dominant colour) triple, is enforced on axes the player cannot see in a fight. Two Rivals can pass the generator and still look identical on screen. Meanwhile the identity that does survive (rank scale, Clowder, colour plus pattern) is not what the rules guarantee.

**Fix.**
1. Re-state the distinctness rules on **readable axes**. No two cats in one district may share (footprint class × dominant colour × pattern macro-class), giving 3 × 11 × 5 = 165 combinations, plenty for 8 per district. Keep the fine axes as flavour for 130 px exploration and for portraits.
2. Put individual recognition where pixels exist. Combat recognises *role* (rank scale, Clowder halo, Nemesis storm mark). The Standoff close-up and name-card recognise the *individual* (250–400 px). Exploration at 130 px confirms *history* (Scars, regalia).
3. Raise the minimum pattern element from 4% to **8% of dorsal area** for the dominant mark.
4. Ask UX (needs ruling) for a 16 px Title/Scar stamp on the enemy Frazzle gauge for Captains and Nemeses.

### Issue 4 — MAJOR — §1.3, §1.2 P5, §7, §10.5, §13.1: the bible partly drifts away from the reference the user asked for, and part of the reference's look is structurally impossible from the gameplay camera

**What the reference still shows:**
- Character fills are nearly flat: Shinnosuke shows almost no shade; the adult shows faint shade.
- A thin, uniform dark line.
- A **soft-edged** contact shadow.
- Backgrounds with lush, saturated, painterly foliage, a soft-gradient sky, and wood with smooth gradients and highlights.
- A warm, **translucent**, cloud-edged cream balloon with a round portrait.

**Where the bible diverges:**
1. **P5 "Printed, not rendered"** bans soft edges, gradients and alpha everywhere: hard blob shadows, halftone fades, halftone UI tones, offset-print shadows. Together with the two-tone shade at 25–35% of the body and the violet-everywhere shadows, this layers a second style (two-colour manga print, ASW-like shading) on top of the reference. That is a reasonable style. It is not "just like" the reference, and the user's "warm bubbly UI" risks becoming "retro matchbox label".
2. **No sky in the gameplay frame.** With pitch 55° and a 27.5° vertical FOV, the top edge of the frame looks 41° below the horizon. The sky, cumulus, sea horizon and hills (§6.1 rule 6, "sea or hill in every district's backdrop", 4096×2048 backdrop layers) **are never on screen during play**. You only see the horizon at pitch below half the FOV, about 14°. The reference's sky-and-foliage beauty can only appear at home, in vistas, on the Fence Line and in menus.

**Why it matters.** The user's first impression of the street will be roofs and ground, not the postcard. And the stated look test ("like the reference") will fail for reasons no shader can fix.

**Fix.**
1. Restrict P5 to **characters, VFX and combat UI**. Allow soft blob shadow edges (2–4 px feather), soft gradients in painted plates and skies, and an opaque (not translucent) but soft-shadowed balloon style. Halftone stays for transitions and combat.
2. Put the lushness where the 55° camera looks: tree canopies, gardens, roof tiles, laundry and awnings, painted at hero quality in the plates.
3. Bring the sky *down*: drifting cloud-shadow cards across the ground, and sky and cumulus reflected as painted shapes in the sea, puddles and window glass.
4. Spend backdrop budget only on vista shots, home windows (the reference's own composition: a garden seen from inside), the Fence Line and menus.
5. Ask the user (§15.3.2) with two side-by-side mock frames, "reference-close" and "print-stylised", before locking P5.

### Issue 5 — BLOCKER — §11.2, §11.4, §11.7 vs combat Game Feel: two incompatible feel specs (full mismatch list in §4.1 below)

The doc says Combat overrides (§15.1.13). But the bible's timing values are still written as if they were the spec, and several are *safety* rules (the flash limits) where the two docs genuinely disagree. Builders will implement whichever doc they read. **Fix:** adopt the single table in §4.2 below. Combat owns the table; Art keeps only the drawings and look constraints and cites the table. The bible's §11.2 tier catalogue and §11.7 timing table are deleted.

### Issue 6 — MAJOR — §13 vs brief §4 camera canon and Pillar 1: the 55° street camera and the cat's-eye home camera are not a contradiction, but the doc leaves the hand-off and the control problem unsolved

The brief's camera canon is written for environments, combat and level design. Pillar 1 ("humans are knees, hands and laps; faces only when they bend down") cannot be met from a 55° camera 10 m up, where every human is a head and shoulders. So the home needs its own camera. That is consistent with canon, and the bible is right (§15.1.2).

**What is missing:**
1. **Control reference across cuts.** §13.3 says "the player still walks Mikan freely" while "cuts, not camera moves, change the view". Camera-relative input then flips direction on every cut: the classic fixed-camera problem.
2. **The scale cheat is most visible at home, not invisible.** A 0.63 m cat on a true-scale lap or in a lift is the size of a fox. §13.4's "at home the cheat is invisible" is backwards.
3. **Threshold spaces.** The Doorstep, the garden (the Life 1 tutorial) and the Lot sit between the two camera systems.

**Fix.** One camera system with named states, specified in one place:

| State | Pitch | Lens (vertical) | Framing | Owner of numbers |
|---|---|---|---|---|
| Roam | 55° | 28° | 9 m wide; yaw per area | Art (lens/pitch envelope), Level (yaw) |
| Vista | 45–55° (≤10° tilt from the plate's pitch) | 28° | Authored | Art |
| Standoff | 48° | 28° | Push-in | Combat (timing) |
| Brawl | 57° | 28° | ≤14 m wide | Combat |
| Slow Blink | 50° | 28° | 8.5 m distance | Combat (Art drops its 45°) |
| Cinematic (Pile-On, Zoomies) | 35–45° over the scene; 20–30° and tilt **only over a full graphic panel** | free | Authored | Combat timing, Art shot design |
| Home | 0.3–0.4 m high, level to +10° | 18–24° | Authored fixed shots | Art / Narrative |
| Lap / lift two-shot | Rises with Mikan | — | Authored | Art / Narrative |

- **Home input rule:** camera-relative direction is latched through a cut until the stick returns to neutral or changes by more than 45°.
- **Scale:** cats at **1.0× inside Haru's House** (a separate scene; it shares no metrics with the street) and 1.4× elsewhere. The Doorstep is framed so no human stands next to the cat.
- The full camera spec lives in one doc, `design/gdd/camera-system.md` or a camera section in the level-design doc (needs ruling); the bible and Combat cite it.

### Issue 7 — MAJOR — §4.3, §4.9: territory colours fail colour-vision checks and camouflage against their own districts

Results, CIEDE2000 (normal / protan / deutan / tritan):

| Pair | ΔE | Problem |
|---|---|---|
| Awning `#EB5228` vs Rust Runners `#B8652A` | 12.5 / **0.7** / **6.6** / **9.1** | Identical for protan players; weak for everyone |
| Wall Sitters `#7A9A3A` vs Awning | 51.2 / 12.3 / **4.8** / 45.2 | Collapses for deutan players |
| Wall Sitters vs Rust Runners | 37.8 / 13.0 / **4.9** / 39.6 | Collapses for deutan players |
| Bell-Gold `#F2B01E` vs Thump Amber `#FFB02E` | **4.0** / 0.7 / 1.3 / 0.9 | The Posse keyline colour equals the Thump effect colour for everyone |
| Bell-Gold vs Haru Yellow | 9.4 / 7.6 / 6.2 / 9.0 | Intended family, but close; fine by context |
| Mikan Ginger vs Marmalade | **5.0** / 4.2 / 4.7 / 3.1 | "Reserved" ginger is barely distinct from generated orange cats |
| Mikan Ginger vs Ruffle Orange | **4.0** | Ruffled marks read as Mikan-coloured |
| Nerve green vs low-Nerve coral | 62.1 / 12.3 / **2.7** / 62.6 | Deutan players see no change (bar length backs it up, as stated) |

Halo against own district (contrast ratio, ΔE):

| Halo | Background | CR | ΔE | Problem |
|---|---|---|---|---|
| Salt Paws | Shiosai sea `#2F8FCF` | **1.00** | **0.0** | Same hex: the halo disappears |
| Rust Runners | Kurogane rust `#B8652A` | **1.00** | **0.0** | Same hex |
| Awning | Akane awning `#E2452B` | 1.13 | 4.4 | Disappears |
| Lantern Eyes | Night indigo `#2E3A78` | 1.50 | 9.6 | Weak |
| Bell-Gold | Akane lantern glow | 1.08 | 4.2 | **The player's keyline vanishes in lamp pools** |
| Bell-Gold | Kurogane sodium | 1.07 | 5.5 | Same |

**Why it matters.** Enemies are hardest to see exactly in their home district, which is where most of their fights happen. And the player's own cats lose their marker under warm lamps.

**Fix.**
1. Every halo gets a **1 px Paper Cream outer rim** (the bible already does this for Whisker Sense). Contrast then comes from cream vs ground, not hue vs ground.
2. Change Rust Runners to **rail-tie brown-violet `#7A4A6A`** or a similar value-shifted, non-orange colour.
3. Separate Wall Sitters from the warm pair by value: make it **light sage `#A8C878`**, which differs in lightness from both vermilion and rust.
4. Move Thump to **cream-white core with an Ink star** (shape-led) or to `#FFF0A0`. Thump must not share a hue with Bell-Gold.
5. Rule: no Clowder colour may be within ΔE 15 of any swatch in its own district palette, checked automatically against the swatch file.
6. Push Mikan Ginger and Marmalade apart: Marmalade toward `#C98A4A`, desaturated.

### Issue 8 — MAJOR — §11.4, §11.7, §11.5 and combat CR-20.3: the flash-safety rules are under-specified and, as written, broken by the bible's own effects

**Results:**
- **What counts as a flash.** Under WCAG 2.3.1 (general flash threshold), a flash is a pair of opposing luminance changes of 10% or more of maximum relative luminance, where the darker state is below 0.80. A Day impact frame takes a typical ground (asphalt Y≈0.22, garden 0.37) to Paper Cream (Y 0.93) and back: **one flash per impact frame**. At Night, Ink (0.025) followed by a cream or white burst drawing makes 1–2 flashes per impact frame.
- **The area threshold makes "local" impact frames count.** WCAG and Harding-style limits apply when flashing covers more than about 25% of the screen (or of a 10° visual field). A Switch 1 screen at 35 cm spans only about 22°, so a 10° field is about 45% of the screen width. The bible's **local impact frame "at most 30% of the screen" exceeds 25%**, so it counts. Combat's 3 m world disc is about 5.5% of the screen at a 14 m frame, which is fine.
- **Saturated red.** The red-flash test (linear R/(R+G+B) ≥ 0.8) flags **Collar Crimson 0.88, Awning vermilion halo 0.89, Akane awning 0.90, torii 0.83, buoy 0.81, Rust coat 0.80**. Frazzle Magenta is borderline at 0.77. The bible says "no saturated red flashes of any size". Yet §11.4 draws full-field speed lines "in the acting cat's outline colour", swapping drawings on twos. **An Awning Gang Boss's T3 or T4 is a full-screen saturated-red pattern alternating at about 12 Hz.** The Nemesis halo "pulses once on each Move" in vermilion as well.
- **Combat's limit is looser than Art's.** Combat allows 3 full-screen flashes per second; Art allows 1 full-screen impact frame per second. Combat's channel lets equal tiers queue at a 10-tick gap (up to 6 per second before the cap). A Zoomies sequence ("first hit T4, last T5") can put two full-screen impact frames under a second apart.

**Fix.** Adopt the safety row of §4.2:
1. At most 3 flashes in any 1 s, counting every luminance pair as defined above that covers more than 20% of the screen (a margin under 25%). At most **1 full-screen impact frame per 60 ticks**; a second one in the window is downgraded to the local disc.
2. Local impact frames are capped at **15% of the screen**.
3. **No saturated-red colour (ratio ≥ 0.8) may change or alternate over more than 5% of the screen.** Full-field speed lines are always Ink/Paper Cream; the Clowder colour appears only as a *static* panel backing.
4. Ruffled halo "flickers between two widths on twos": make it a steady width with a slow 2-step pulse (≤3 Hz).
5. Before any public footage, run an automated check on captured combat video with a Harding-style analyser, and make passing it an acceptance criterion in both docs.

### Issue 9 — MAJOR — §10.6, §10.7, §11.4 vs combat CR-1 (60 Hz simulation, 30 fps handheld render): sub-frame look events vanish on handheld

Combat runs at 60 Hz ticks; the handheld renders at 30 fps. These events last 1 tick (17 ms) and **will be rendered on only about half of handheld frames, or not at all**:
- the T3 local impact frame (1 tick);
- the T0 victim hit-stop (1 tick);
- the 1-tick smears (T0–T1, Swipe 1–3);
- the "Ones = 1 frame" smear drawings.

Combat's shake frequencies (16–30 Hz) are **above the 15 Hz limit a 30 fps image can show** (and at the limit at 60 fps). They alias into random jitter.

**Fix.**
1. Every *look* event has a floor of **2 ticks (one rendered frame at 30 fps)** and is specified in rendered frames alongside ticks.
2. Shake becomes **stepped offsets**, one new offset every 33 ms on both platforms (matching the bible's own "3–5 stepped offsets"), with a step count per tier and ×0.6 decay per step. This replaces the Hz rows.
3. The step clock for stepped animation runs on **simulation time**, so hit-stop and Slow Blink lengthen holds instead of strobing. Add that to R-STEP.
4. Fix the cadence mismatch flagged in §15.2.7: handheld twos at 3 frames (10 poses/s) vs PC twos at 5 frames (12 poses/s). Use **12 poses/s on PC and 10 on handheld, and author on 10** (6 frames at 60 = 10/s), so both platforms show the same drawings.

### Issue 10 — MAJOR — §8.4: budgets are plausible in total but wrong in the parts that matter, and the target hardware is not pinned

- **"Switch-class" is two machines.** Switch 1 (720p handheld, about 3.2 GB usable RAM, from memory) and a Switch 2-class device (1080p handheld, much more RAM, a temporal upscaler; unverified) need different budgets. **Fix:** budget for Switch 1 handheld as the floor until the user rules (§5 below).
- **Cat triangles are overbuilt.** A 48 px cat covers about 1,000 px². At 3,500 tris that is under 1 px per triangle, which wastes GPU work (pixels are shaded in 2×2 blocks) and makes the hull outline crawl. Three hull-or-body passes per enemy (body, ink hull, halo hull) triple vertex work. **Fix:** gameplay cat **1,800 tris handheld / 3,000 PC**, with silhouette edge loops prioritised. The portrait head stays.
- **Totals.** 350k visible tris, 600 draw calls, 600 MB textures and 2.5× overdraw at 30 fps are plausible for Switch 1 if the environment is Method B (unlit plates). With Method A plus shadow maps plus two-band lighting plus Whisker Sense as a second environment shader, I would not sign 600 draw calls without a test.
- **Recorded trade-off to add:** merged plate meshes cut draw calls but defeat per-object culling. With a fixed camera and per-area streaming, culling buys little, so merging wins. Write that down.
- **Missing budgets:** frame time per pass on handheld (proposal: environment 6 ms, characters and outlines 5 ms, VFX 4 ms, UI 2 ms, post 2 ms of 33.3 ms); streaming bandwidth for plates; the VFX texture-memory share inside the 600 MB.
- **Particle ceilings disagree.** Combat allows 60 dust puffs and 24 glyphs alive at once. Art allows 12 handheld emitters and 3 glyph bursts (≤15 glyphs). See §4.2.

### Issue 11 — MAJOR — §10.2, §10.8: the outline and anti-aliasing requirements conflict with how handheld games are actually rendered

1. **Dynamic resolution vs pixel-exact lines.** Handheld titles commonly render below native (dynamic resolution). "Line width within ±0.5 px" at a fixed output height cannot hold if the render target shrinks. **Fix:** hull width is computed against the *current render target height*. Dynamic resolution is floored at 85%, or characters are composited at native resolution.
2. **Temporal upscalers vs stepped animation.** A temporal upscaler is the standard tool on a Switch 2-class device (unverified). Stepped poses produce one large motion-vector jump every few frames, which ghosts. **Fix:** stepped characters write zero motion vectors on hold frames and the true delta on step frames, or the engine is required to support excluding characters from temporal accumulation. Make this an acceptance test.
3. **AA choice.** "Prefer MSAA" should name a fallback. Godot 4.5+ has SMAA 1x ("sharper than FXAA, cheaper than TAA", `docs/engine-reference/godot/modules/rendering.md`). In Unity 6.3 URP, MSAA cost on the target is unverified. **Fix:** "MSAA 2× if under 1.5 ms on handheld, else SMAA 1×."
4. **Engine notes need updating for the pinned versions.** Unity 6 custom passes (an outline renderer feature, Whisker Sense) must be written against **RenderGraph** (`RecordRenderGraph`); `Execute`/CommandBuffer is deprecated (`docs/engine-reference/unity/modules/rendering.md`). Godot 4.5+ **stencil buffer support** is the natural tool for the R-OCC silhouette-through-walls (§10.10.4) and the halo masks. Whether skinning is shared across a skinned mesh's multiple hull passes (computed once) is **unverified** in both engines and must be measured, because it decides whether hull outlines double the skinning cost (§15.2.2).
5. Stepped-pose evaluation needs a manual animation update path: Unity Playables with manual evaluation, Godot `AnimationMixer` in manual callback mode with `advance()`. **Both unverified**; the engine-reference animation modules do not cover them.

### Issue 12 — MINOR — §4.8: UI contrast is mostly good; two rules are wrong

Computed WCAG ratios:

| Pair | Ratio | Result |
|---|---|---|
| Ink on Paper Cream | 13.1:1 | Matches the bible's "about 13:1" |
| Secondary text on Paper Cream | 5.86:1 | Passes |
| Secondary text on recessed panel | 5.10:1 | Passes |
| Ink on Bell-Gold | 7.37:1 | Passes |
| Ink on Steam Court | 8.24:1 | Passes |
| Ink on Static Yellow | 10.8:1 | Passes |
| Ink on Positive | 6.4:1 | Passes |
| Ink on Caution | 6.6:1 | Passes |
| **Ink on Collar Crimson** | **2.74:1** | **Fails.** The "important/confirm accent" fill must carry Paper Cream text (4.77:1, passes AA for body text) |
| Disabled `#C9BFC4` on `#F4E6C8` | **1.45:1** | WCAG exempts inactive controls, but on a handheld it is invisible |

**Fix for Disabled:** reach ≥3:1 (for example Secondary `#6B5A73` at a 50% halftone).

**Ink silhouette vs dark coats** (1.28:1 on Black, 1.69 on Charcoal) is fine in combat because the halo sits outside the line. Out of combat, a black cat on Kurogane's oil-shadow ground loses its silhouette. **Fix:** dark coats get the reverse-ink colour on their *silhouette* line in the Night key.

### Issue 13 — MINOR — §3.2 and §8.4 trade-off: the shared skeleton across six body types is fine if bodies drop to three

Loaf (1.3:1) and Noodle (2.6:1) on one rig with shape keys will stretch the hull normals at the spine. Since only three footprints read (Issue 3), build **three base meshes on one skeleton** (round, standard, long). Size, fur-puff and Sprout come from bone scale, and their smoothed outline normals are baked per mesh. This removes §15.2.6.

### Issue 14 — MINOR — §1.3, §6.3: differentiation from the reference IP is adequate in category, weak in two markers, at risk in one composition

- **The line hue is not a real marker.** Aubergine `#33273B` and dark brown are indistinguishable at 2–3 px on a handheld. Do not count it as one of the eight.
- **"Cream panels, no brown tags" is cosmetic.** Real UI differentiation comes from the bean/pom shapes and the paw-pad cursor; say so.
- **Real differentiators:** the bird's-eye camera, a cat cast built from bean/chestnut/pom with no human caricature, action-anime staging, Whisker Sense, the seaside setting.
- **The risk.** The reference's own still is a **hallway veranda opening onto a garden, with a small white pet in the yard**. Our home is "an old wooden house with a veranda, small garden and a low wall", our pet is white-bodied, and the veranda is a witness object. **Fix:** add a composition rule. Home key art and pillow shots never use the inside-looking-out veranda-to-garden framing with a pet in the yard. The veranda is shot from the garden side or at floor level along its length. Mikan's ginger cap is in every home key frame.
- Style itself is broadly shared across the genre. Specific compositions, characters and UI trade dress are where proximity risk lives; a legal view stays outside this review, as §15.2.4 says.

### Issue 15 — MINOR — §8.3, §10.4 acceptance tests are untestable as written

- "Greyscale and blurred 4 px" should name the blur (Gaussian σ = 4 px at 720p) and a pass threshold: the cat's mean L* differs from a ring of ground pixels around it by ≥ 20.
- §10.1 "±2 per channel" is impossible with ASTC/BC compression plus a phase LUT. Use ΔE2000 ≤ 2 instead.

---

## 4. Cross-doc conflicts

### 4.1 Art bible §11 vs combat Game Feel: every mismatch

| # | Item | Art bible says | Combat says | Resolution |
|---|---|---|---|---|
| 1 | Number of tiers | 5: T0–T4 | 6: T0–T5 | Combat's six (they are tied to gameplay events) |
| 2 | What T0 is | Movement, landings, dodges (no hit) | Whiff, hit on a prop, blocked hit | Combat's; Art's movement effects become an untiered "ambient" class |
| 3 | What T2 is | Any Move | String finisher, Whack, Pounce | Combat's |
| 4 | Where Moves sit | All Moves in T2 | 1-Paw = T3, 2-Paw = T4 | Combat's |
| 5 | Fear trigger | T3 set-piece (screen-wide) | T3 = local (3 m disc impact, 20% edge lines) | Combat's (local); Art's Fear drawing is kept |
| 6 | Frazzle trigger | T3, full-screen impact frame | T4, full-screen 2-tick impact | Combat's T4 |
| 7 | Pile-On | T3 | T5 | Combat's T5 |
| 8 | Rout of Captain/Boss | T3 | T5 | Combat's T5 |
| 9 | Zoomies | T4 | T5 | Combat's T5 |
| 10 | Rout of a Tough | Not tiered | T4 (global hit-stop, full-screen impact) | T4, but full-screen impact only if player-authored and none in the last 60 ticks |
| 11 | Hit-stop, light hits | "None" | T1 33 ms attacker / 50 ms victim | Combat's |
| 12 | Hit-stop, heavy | 60–100 ms, one value | Separate attacker/victim, local/global scope, 67–233 ms | Combat's |
| 13 | Hit-stop, finishers | 150–250 ms | T5 233 ms | Combat's (inside Art's range) |
| 14 | T0 victim hit-stop | — | 1 tick (17 ms) | 0 (invisible at 30 fps) |
| 15 | Shake unit | px at 1080p (4 / 10 / 16) | % of viewport height (0.15–1.60) | % of viewport height (resolution-independent). The values nearly agree: 4/10/16 px = 0.37/0.93/1.48% |
| 16 | T1 shake | "None, or a 4 px nudge" (0.37%) | 0.15% (1.6 px at 1080p, 1.1 px at 720p: below perception and rounds to 0–1 px) | **0** for T1 |
| 17 | Shake form | 3–5 stepped, decaying offsets | Continuous, 16–30 Hz, exponential decay | Stepped (Issue 9) |
| 18 | Shake cap | — | 1.8% / 1.4% handheld; handheld ×0.8 | Combat's |
| 19 | Speed lines T2 | Local parallel lines for 0.3–0.5 s | Local streak for 6 ticks (100 ms) | 12 ticks (2 drawings at 30 fps) |
| 20 | Speed lines T3–T4 | Radial focus lines on Frazzle and Standoff; full-field lines on T3/T4 | Radial on 20% / 40% of the screen edge, 8 / 12 ticks | Combat's areas, durations set to whole drawings (§4.2) |
| 21 | Line animation | Swap among 3 drawings on twos | Durations shorter than one drawing | Durations are multiples of a drawing |
| 22 | Full-field line colour | Acting cat's outline colour | Not specified | Ink/Paper Cream only; Clowder colour as a static backing (Issue 8) |
| 23 | Impact frame on T2 | Local, on heavy hits | None | None (Combat's) |
| 24 | Impact frame on T3 | Full-screen | 1 tick, 3 m disc | 2 ticks, disc ≤15% of screen |
| 25 | Impact frame on T4 | Full-screen | 2 ticks, full-screen | 2 ticks inverted plus 2 ticks of effect-shape flash; full-screen part 2 ticks |
| 26 | Impact frame on T5 | Full-screen | 3 ticks, full-screen | 3 ticks plus 2 ticks |
| 27 | Impact frame length | 2 drawings of about 40 ms each (80 ms) | At most 3 ticks (50 ms) | Full-screen inverted part at most 3 ticks; the second drawing is local to the effect shape, so it is not a full-screen flash |
| 28 | Impact frame frequency | Full-screen at most 1 per second; at most 3 flashes per second in total | Full-screen luminance flashes at most 3 per second | Art's stricter rule, defined as in Issue 8 |
| 29 | Local impact frame size | At most 30% of the screen | 3 m disc (≈5.5%) | At most 15% |
| 30 | Smears | At most 70 ms; 1–2 drawings on ones | 1–4 ticks by tier | Minimum 2 ticks; T3+ 4 ticks |
| 31 | Glyph caps | At most 3 bursts on screen (≤15 glyphs) | 24 glyphs alive | 3 bursts / 15 glyphs on handheld; 4 / 20 on PC |
| 32 | Particle caps | 12 emitters handheld / 24 PC | 60 dust puffs | Puffs are flipbook instances, not emitters: 60 puffs PC / 40 handheld, drawn from ≤12 emitters on handheld |
| 33 | Pile-On cloud size | 2.5 m across | 3 m *radius* (6 m across) Full / 2 m radius Quick | 3.5 m across Full / 2.5 m Quick (a 6 m cloud covers half a 14 m frame) |
| 34 | Pile-On length | 1.6–2.2 s look | 150 ticks (2.5 s) Full / 72 ticks (1.2 s) Quick | Combat's (Combat owns duration) |
| 35 | Zoomies cut-in | 0.7 s first / 0.35 s on repeats; 3D portrait rig | 36 ticks at 10% time (0.6 s real); "2D manga cut-in panel" | Combat's 0.6 s; the panel *content* is the 3D portrait rig (Art's) |
| 36 | Cinematic camera | Pitch 20–30°, horizon tilted up to 12°, fast cuts | Pitch 35–45°, yaw unchanged | Combat's over the scene; Art's only over a full graphic panel (Issue 1.5) |
| 37 | Slow Blink camera | Push-in 15%, pitch 45° | Dolly to 8.5 m, pitch 50° | Combat's |
| 38 | Slow Blink grade | Saturation −25%, value −15% | Desaturate 30% | Saturation −30%, value −10% (one number owned by Art, cited by Combat) |
| 39 | Hit-spark shapes | Thump = four-point star plus ring; Yowl = two wavy arcs | Thump = paw-print; Yowl = ring | Art's (Combat's Yowl "ring" collides with Art's Thump ring) |
| 40 | Danger colour | Red never means damage or danger | Telegraph classes white / yellow / **red filling area** | Keep Combat's three classes. Recolour "red" to **Frazzle Magenta with a zigzag edge** or Ink with a hatched fill; recolour "yellow" away from Bell-Gold and Static Yellow (ΔE 8–14) to Paper Cream dashed with a triangle glyph |
| 41 | Incoming-hit cue | — | 150 ms **coral** edge vignette | Coral is Koharu's colour and the low-Nerve colour. Use an Ink-and-halftone edge pulse instead |
| 42 | "Glow" at feet when a Paw fills | Glow is forbidden (§10.8) | "A small glow at the cat's feet" | A drawn flat disc with a halftone edge (Art's definition of glow) |

### 4.2 The single table (proposed; owner: **Combat**, `combat-system.md` § Impact Moments)

Combat owns the game-feel spec under brief §6. Art is the required reviewer of every row marked (A), and the art bible §11 keeps only drawings, colours and shapes and cites this table. 1 tick = 16.7 ms; "f30" = rendered frames at 30 fps.

| Effect | T0 | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|---|
| Events | Whiff, prop hit, blocked hit | Light basic hits; middle hits of a multi-hit | String finisher, Whack, Pounce, Bap on a Tough, Splat | 1-Paw main hit, Counter-Pounce, Bap on Captain+, Fear trigger, Hiss interrupt | 2-Paw main hit, Frazzle hit, Rout of Tough/Critter, Back Down | Pile-On, Zoomies, Boss phase break, Rout of Captain/Boss, final Rout |
| Hit-stop attacker / victim (ticks) | 0 / 0 | 2 / 3 | 4 / 6 | 6 / 9 | 9 / 12 | 14 / 14 |
| Hit-stop scope | — | Local | Local | Local | Global | Global |
| Screen shake peak (% viewport height) | 0 | 0 | 0.40 | 0.70 | 1.10 | 1.60 |
| Shake steps (one per 2 ticks), decay ×0.6 per step | — | — | 3 | 4 | 5 | 7 |
| Smear (ticks, minimum 2) (A) | 2 | 2 | 2 | 4 | 4 | 4 |
| Speed lines (A) | — | — | Local streak, 12 ticks (2 drawings) | Radial, 20% of edge, 18 ticks (3 drawings) | Radial, 40% of edge, 24 ticks | Full-field, 36 ticks, plus cut-in |
| Impact frame (A) | — | — | — | Local disc ≤15% of screen, 2 ticks (1 f30) | Full-screen inverted 2 ticks plus effect-shape flash 2 ticks | Full-screen 3 ticks plus 2 ticks |
| Glyph burst | — | Spark only | 1 glyph, 0.6 m | 2–3 glyphs, 1.0 m | 4–5 glyphs, 1.6 m | Giant glyph, 30% of screen height, 20 ticks |
| Dust | 2 puffs | 3-puff ring, 0.4 m | 5-puff ring, 0.8 m | Ring plus trail, 1.2 m | Ring plus crack, 2.0 m | Cloud 3.5 m across (Full) / 2.5 m (Quick) |
| Punch-in, time dip, rumble, knockback hold | Combat's current values unchanged | | | | | |
| **Safety (overrides every row)** | At most 3 flashes per 1 s (WCAG 2.3.1 definition, area >20% of screen); at most 1 full-screen impact frame per 60 ticks, else downgrade to local; no saturated-red (linear R/(R+G+B) ≥ 0.8) change over >5% of screen; every look event ≥ 2 ticks; full-field lines Ink/Cream only. Reduce Flashes: impact frame becomes a +1 px line hold, no luminance change | | | | | |
| Caps | Glyphs: 3 bursts / 15 alive on handheld (4 / 20 PC). Dust puffs: 40 / 60. Shake total ≤1.8% (1.4% handheld) | | | | | |

### 4.3 Other conflicts

- **Brief §4 ("hand-painted textures and painted distant backdrops") vs Issue 4.2.** The backdrops are never visible from the canon camera. Recommend the brief be amended to "painted environment plates; painted backdrops in vistas, home and menus".
- **Brief §7 ("bell-gold outline tick") vs §10.2.** Art's reading (thin keyline plus chevron) is fine. Add a Paper Cream rim to the keyline so it survives warm lamp pools (Issue 7).
- **Pillar 1 / brief §9 originality ("faces only when they bend down") vs the 55° camera inside the house.** Resolved by the Home camera state (Issue 6). Record it as a canon amendment.
- **§13.4 (1.4× scale) vs combat ranges.** Combat's ranges (5 m soft lock, 0.3 m slides, 12 m ring) were written without knowing about the cheat. Combat must restate ranges in body lengths or confirm they assume 0.63 m cats.

## 5. Needs director ruling

1. **Target handheld.** Switch 1-class (720p, about 3.2 GB) or Switch 2-class (1080p, temporal upscaler) as the floor? Every number in §8.4 and Issue 2 depends on it. Recommend budgeting for Switch 1 until the user says otherwise.
2. **Painted-environment method B** (paint-over plates) as canon, including the pitch envelope of 45–60° for scene shots.
3. **Brawl framing.** A maximum 14 m frame, with Combat either shrinking the ring to about 9 m or accepting off-screen ring edges.
4. **Cat scale.** 1.0× inside the house, 1.4× elsewhere.
5. **How close to the reference** (bible §15.3.2): decide on two mock frames, "reference-close" vs "print-stylised", before P5 is locked.
6. **Camera spec ownership.** One camera doc, cited by Art, Combat, UX and Level design.
7. **Feel table ownership.** Combat owns the single table; Art reviews the (A) rows; the safety row is mirrored in `design/accessibility-requirements.md` by UX.
8. **Danger colour.** Allow Combat's "red" telegraph class under a non-red colour, as proposed in conflict #40.

## 6. Cut list

- **4096×2048 backdrop layers and per-phase backdrop repaints for street gameplay.** Never visible at 55° (Issue 4). Keep backdrops for vistas, home windows, the Fence Line and menus only.
- **Unique hand-painted UV albedo at 256 px/m** (§8.3). Replaced by plates (Issue 1).
- **Runtime shadow maps for the environment.** Replaced by baked per-phase SDF shadow masks.
- **The art bible's own tier catalogue (§11.2) and timing table (§11.7).** Replaced by the single table.
- **Six body meshes / shape-key bodies.** Three base meshes (Issue 13).
- **Head-shape axis in the generator** (3 types). Invisible in gameplay; keep it in the portrait head only.
- **Fine tail and ear variants.** Collapse tails 8 → 4 and ears 6 → 3 for gameplay meshes; keep Scar modifiers.
- **Gameplay cat triangles.** 3,500 → 1,800 on handheld; 5,000 → 3,000 on PC.
- **Line hue as a differentiation marker** (§1.3). Not perceivable; stop counting it.
- **Split §10–13 into `design/art/` companion files** (the bible's own §15.2.20). At 117 KB this doc already exceeds the project's whole-file read limit.

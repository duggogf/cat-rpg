# M0 look-dev review: art director

PROTOTYPE EVIDENCE REVIEW, 2026-11-24. Reviewer: art-director. Scope: plan §5 M0 row (IMPLEMENTATION-PLAN.md), the art target the owner set (reference-close to the "Shiro and the Coal Town" visuals: 3D cel characters that read as flat 2D cels with a clean even outline, over environments that read as painted anime backgrounds, free third-person camera), and our 2D target frame `design/previews/01-exploration.png`.

Evidence read: `env/compare-01.png`, `view01-day.png`, `view01-dusk.png`, `orbit-day-sheet.png`, `orbit-dusk-sheet.png`, `orbit-day-2.png`, `orbit-day-4.png`, `orbit-dusk-5.png`; `cats/01`, `02`, `03`, `04`, `05`, `09`; both `README.md` files; `env/results.json`; the reference `design/reviews/refs/style-reference.webp`. Colour values below were sampled from the PNGs as box averages, with L* computed from sRGB.

## Verdict: GO WITH FIXES

The pipeline works. Code-authored three.js can produce this look, and nothing here calls for the §8 fallbacks (risk 1: hybrid head; risk 2: heavier post and a tighter pitch clamp). The grammar is right: two-tone cels with a hard terminator and lavender shade over an unlined, painted world. The shadows carry a phase tint (0% neutral grey at every view measured). The shadow edges on the ground are wobbly and painted. Ink ΔE is 0. The 01 framing reads as the same picture at a glance. The scene is also far under budget: 62 draw calls, 66k triangles and a 0.75 MB texture download.

The gap to the target is real, though. The cats are close from the front and the back but turn into toys in side profile. The environment matches 01's composition but not its density, its values or its crispness. The five fixes below must land, and be re-shot at the same framings, before M1 art spend. Re-review the side profile and orbits 2, 4 and 6 specifically.

## Scores

| Area | vs reference | vs our 01 frame | Note |
|---|---|---|---|
| Characters | 6/10 | 6.5/10 | From front 3/4 and back they read as cels, and the faces have appeal. From the side they read as vinyl toys. |
| Environment | 5.5/10 | 6/10 | The hero view holds up. Off-axis there are bare planes, a flat-grey lantern and a ghost-geometry artefact. |
| Lighting / colour | 7/10 | 6.5/10 | Shadow hue and shape are right and the sky is good. The ground is too dark and too khaki, and the Dusk walls have muddy banding. |
| **Overall** | **6/10** | **6.5/10** | Viable. It reads as a good cel-shaded 3D game, not yet as an anime background with cels printed on it. |

## M0 acceptance, criterion by criterion

| # | Criterion | Result |
|---|---|---|
| 1 | Side-by-side at the 01 framing, Day and Dusk | **Passes as a direction, fails as a match.** The camera, the lane, the wall-left/fence-right split, the lantern and hydrangeas, the wires, the laundry, the sea card and the Wall Sitter on the coping all land. Missing from 01: the pot plant, bucket, manhole, the passer-by's legs and bag, and the overhanging tree mass. The ground value and the paint crispness are off (see fixes). |
| 2 | Pixel checks | Line: 1.60 / 1.57 px median at 1080p, which passes but sits at the thin end. At 85% scale it measures **1.44 px and fails.** Ink ΔE 0 passes. No grey shadows passes. **E-5 fails at orbit 0** (18.6 Day, 19.6 Dusk) and passes at view01 (20.8, 22.2). |
| 3 | 8 orbit shots, none reading as untextured 3D | **Pass with exceptions.** No shot reads as untextured overall, but three things do. **The stone lantern reads as untextured** low-poly, flat grey with visible hexagonal facets, in every shot it appears in (0, 1, 7 and the view01 frames). **Orbits 2 and 6** fill the frame with one wall plane or one fence run with nothing on it, so they read as a textured box. **Orbit 4** has translucent, dithered geometry in the lower-left foreground (the camera-occlusion fade on the fence and lantern), which reads as an engine artefact. |
| 4 | Silhouette strip of the 6 tail carriages | **Readable but mis-framed.** Post, spring, blade and anchor read distinctly. Flag (leftmost) and comma (rightmost) are cropped by the frame edge, so the strip proves 4 of 6. Re-shoot wider. |

## Characters

- **Cel read.** Good in `01`, `03`, `09` and the view01 frames. The hard two-tone shade in lavender and the flat coat masks with borderless edges are on-model. The whiskers break the silhouette nicely. Mikan's front face (`09`) and the Wall Sitter's smug lids have real appeal and are the strongest thing in M0.
- **Side profile (`02`, `04`) is the weak angle.** The head is a ball with the face decal seen edge-on: the eye becomes a sliver, and there is no muzzle, cheek or nose bump. On the Wall Sitter, one face stripe runs through where the eye should be. The neck is a pinched tube. The body is a sausage on four peg legs, not a bean. The collar is a flat ribbon whose edge shows. This angle is what sells "toy".
- **Tail pom.** It is a lumpy, faceted rock (SDF noise shows in the silhouette). In 01 the pom is a clean, scalloped tuft.
- **Line.** The silhouette is clean and even and the colour is exact, but it is thinner than the reference and thinner than 01 (about 3 px at 1080p). There are **no interior lines**: a leg in front of the body, the head over the shoulders and the tail over the haunch all merge into one fill. Interior overlap lines are what make the reference characters read as drawn cels and not shaded meshes. There are also small spikes at the ear tips, from polygonisation.
- **Shade terminator.** It stair-steps on the legs and chest in `01` and `09`. It should be a smooth, designed shape.
- **Animation.** The walk mid-stride (`04`) is barely different from the idle, and its appeal is low. The 01 frame's cat is seated and compact, while ours stands stiff-legged.

## Environment and lighting

- **Ground value and hue.** Our lit lane samples at **#C3AB86 (L* 71)**: a saturated khaki dirt. 01's lit lane is **#DBCFB5 (L* 83.5)**: a pale cream. The lavender shadow is right (ours #7C6E79, L* 48; 01 #807582, L* 51). Because the ground is darker, the whole frame sits a stop low and reads heavier than 01 and the reference.
- **Paint quality.** The post pass smears the walls and fence into vertical streaks, which reads as a filter, not as brushwork. Anime backgrounds (the reference) are crisp: flat value shapes with deliberate brush edges, stains and moss painted as shapes. Fence boards and grass tufts are the closest to target. The roofs and the distant town card repeat as a visible stamp.
- **Dusk.** The warm key is lovely on the ground and on Mikan. On the long wall, though, the orange glaze falls in diagonal smeared bands (orbit-dusk 1 to 3) that read as a shadow-map artefact, not as designed light.
- **Separation tension (for the creative director, then the user).** 01 itself puts a white cat on cream ground. The art bible's walkable-ground cap (L* ≤ 80) and the E-5 ≥ 20 L* rule are probably why the builder darkened the ground. Raising the ground toward 01 will make E-5 fail more often for white coats. I recommend fix 2 regardless, and ask whether E-5 should be measured with the line and the contact blob counted, or in ΔE rather than in L* alone. That is a rules question, not a builder question.

## The 5 highest-impact fixes

1. **Environment builder: bring the 01 set dressing in, and paint the lantern.**
   - Rebuild the stone lantern with chamfered, smoothed normals (no visible hex facets) and a baked painted texture: a moss cap, a warm lit face, a Wisteria shade face, and the 01 green drip.
   - From 01, add the blue bucket, the terracotta pot with spiky aloe, the manhole-cover ground decal, a second potted plant at the fence, and a passer-by's legs, socks, shoes and tote. These can be a static painted card at M0, or the M4 leg rig as a placeholder.
   - Push the overhanging tree mass further across the wall coping and down into frame, as in 01.
2. **Environment builder: ground values and the bare planes.**
   - Lit lane ground: change #C3AB86 to **#D2C4A4 (L* 79.5)**. That is less saturated, cream, and inside the 35–80 walkable band. Keep the shadow pools at #7C6E79.
   - Break every wall and fence run so that any 1.5 m stretch in frame has at least one feature. On the plaster: rain streaks running down from the coping, painted stains, a second poster, a drainpipe with a bracket, moss along the base, a hairline crack. On the fence: a gate, a missing board, a hose or broom leaning on it.
   - Retune the paint post: less Kuwahara radius and no vertical streaking. Aim for flat value shapes with hard-edged brush accents. Re-shoot orbits 2 and 6 as the check.
3. **Environment builder: kill the 3D tells in orbit.**
   - Replace the dithered translucent occlusion fade in orbit 4 with a full hide of the occluder, or a camera pull-in. Never show half-transparent set pieces.
   - Replace the soft banded Dusk light on the long wall with crisp painted dapple shapes, or clamp the shadow-map filter on vertical surfaces.
   - Vary the distant town and sea card so the roof stamp does not repeat. Mixing 3 tile variants would do it.
4. **Cat builder: get the line to the reference.**
   - Raise the nominal hull to **2.5 px** (the median is 1.6 today) and compute the expansion against the *output* height, not the render-target height, so that 85% scale passes (1.44 px today).
   - Add **interior overlap lines** for leg-over-body, head-over-shoulders and tail-over-haunch. Use a character-only depth/normal edge pass masked by the cat stencil, so the environment stays unlined.
   - Remove the ear-tip spikes with SDF tip rounding before polygonising.
5. **Cat builder: fix the side profile and the form.**
   - Add a muzzle, cheek and nose SDF so the head is not a ball. Add a profile face-decal variant (almond eye, nose bump, mouth corner) that swaps in at view yaw > 60°.
   - Side profile: thicken the neck and chest bean so it is not a tube, and lift the belly line so the body reads as a bean on short legs, not a sausage on pegs.
   - Seat the collar into the neck as a curved band with no exposed ribbon edge.
   - Smooth the pom tail SDF: drop the noise and use scalloped tuft lobes as in 01.
   - Smooth the shade terminator, for example by shading from a smoothed-normal attribute, so it stops stair-stepping.
   - Make the default idle in the 01 view a compact sit or loaf, and double the walk's stride amplitude.
   - Re-frame the tail strip so all 6 carriages are in frame.

## Re-shoot to close

Shoot `compare-01` Day and Dusk, `cats/02` and `04` (side), orbits 2, 4 and 6 in both phases, and the tail strip, then the pixel checks again. E-5 at orbit 0 and the 85% line must pass, or E-5 gets a ruling from the creative director.

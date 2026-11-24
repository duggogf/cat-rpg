# Mikan C7 shape pass: art director review (anatomy and appeal)

PROTOTYPE EVIDENCE REVIEW, 2026-11-24. Reviewer: art-director. Scope: owner comment C7
(`design/reviews/user-comments-2026-11-24.md`): judge the 3D cat on anatomy and appeal, not as a 1:1 trace of the
reference.

**Evidence read:**
- References: `design/reviews/refs/mikan-turnaround-ref-v2.webp`, `mikan-legs-feedback.png`, `cat-anatomy-wireframe.png`,
  `mikan-face-keep.png` and `mikan-turnaround-ref.webp`.
- Renders: `turnaround-compare.png`, `14`, `15`, `16`, `17`, `18`, `01`, `02`, `03`, `04`, `07`, `09`, `10`, `11-walk-seq-sheet.png`
  and `README.md`, plus `env/view01-day.png`. That env frame may predate this pass. Its head-from-behind shape matches
  the current `07`.

**Canon, not counted as errors:**
- Mikan is a bobtail with a round pom and a ginger cap. The reference's long tail and back patches are not canon.
- The face decal stays as it is.

## Verdict: FIX (one more pass, then show the owner)

Both of the owner's complaints are answered:
- **Front legs.** They now drop from under the neck base and the collar line, not from mid-body. Compare the side views
  in `14` and `16` at 90° and 270° with the owner's red circle in `mikan-legs-feedback.png`.
- **Hind thighs.** From behind (`14`, `16` at 180°, `07`) the haunches now sit inside a pear-shaped rump, with no lateral
  bulge. The two hind legs read narrow and separate, as they do in the v2 reference's back view.

A pass that fixed only those two things would be enough to show. Three things stop me sending it now:
- The forelegs read as one block from the front.
- The skull reads as a box from behind, which is the angle the player sees most.
- The walk has a broken ink artefact.

Each is a small fix.

## Scores

| | Score | Why |
|---|---|---|
| **Anatomy** | **6.5 / 10** | The leg placement and the haunch width are now right. The front view's fused foreleg column, the flat-faced profile, the vague hock and the box skull keep it from reading as a cat skeleton under the fur. |
| **Appeal** | **7 / 10** | The front and 3/4 views are charming, with the kept face, the big head and the bell. The back view in the gameplay camera reads instantly: cap, collar, pom and two feet. Appeal drops in profile, where the eye sits on the silhouette and there is no snout, and from behind, where the head looks like a beanie with ears. |

## What works (keep it)

- **The owner's two fixes landed.** Side-on, the foreleg is a straight column under the collar, and the elbow sits
  under the shoulder at the front of the chest, as in the anatomy wireframe. From behind, the rump is a clean pear and
  the legs come out of its underside, not its flanks. Do not undo either of these.
- **Head-to-body ratio.** The head, ears included, is about 53% of standing height in the front view. In the v2
  reference it is about 56%. The body width from the front is about 54% of the head width, against about 55% in the
  reference. So the chibi proportion matches the target and there is no bobblehead problem. Leg length is also good:
  slightly longer than in the reference, which helps the walk read at 3 m.
- **Face continuity.** The 24-step orbit (`17`) has no pop, no doubled eye and no swap. The front face (`18`) holds the
  kept face.
- **Gameplay silhouette.** At the 3 m Explore camera (`07`, `view01-day`) Mikan reads in one glance: ginger cap,
  red collar, round pom and two white feet. This is the strongest view.
- **Pom, collar and bell.** The pom is clean and the collar sits high at the nape. The bell hangs proud of the
  chest and catches the eye in 3/4.
- **The Wall Sitter** (`15`) carries the same shape language well in its Round build. The heavier haunch suits it, and
  the lidded face has real character.

## Corrections, in priority order (one pass, technical artist)

1. **Walk: far front paw inks solid black through the leg gap.** This is broken. In `04` and in walk frames 1, 2, 6
   and 7 of `11-walk-seq-sheet.png`, the far foreleg at mid-swing renders as a dark, spiky ink wedge between the near
   legs. The cause is either the hull pull reaching the far leg or the legs shell drawing its back faces. Fix: exclude
   the far-side leg shell from the inward pull while it is occluded, or clamp the hull on legs to about 0.8 cm
   (half the current 1.6 cm cap). Re-shoot the 8-frame walk. Nothing goes to the owner while this shows.

2. **Front view: split the forelegs and give the chest a bib.** In the front views (`14`, `16` at 0°, `17` at 0° and 345°)
   the chest and both forelegs form one rectangular white column, with a seam only at the paws. That reads as trousers,
   not legs. Fix:
   - Open a gap between the forelegs from the paws up to elbow height, about 40% of the leg length, so you can see
     daylight between them. Do this by narrowing the inner face of each leg by about 15%, not by moving the leg roots.
   - Above the elbows, round the chest into a convex bib that bulges about 0.8–1 cm forward of the leg tops. The chest
     should lead the legs slightly in side view, as in the wireframe, and the legs stay where C7 put them.

3. **Head from behind: set the ears in and dome the crown.** This is the gameplay camera's main view (`07`,
   `view01-day`, `16` at 135°–225°). The ear bases sit at the full width of the skull, so their outer edges continue
   the vertical sides of the head. The line between the ears is flat, so the head reads as a box with ear tabs, like a
   beanie. Fix:
   - Move the ear roots inward by about 10% of head width each.
   - Tilt the ears outward by about 10–12°. The reference's ears splay; ours stand vertical.
   - Raise the crown between the ears by about 0.6–0.8 cm so that line is convex.
   - Round the upper back corners of the skull, so that from behind the head is a soft dome sitting wider at the cheeks
     than at the ear bases.

   The face decal and the front view stay unaffected, apart from slightly splayed ears, which also match the
   reference's front view better.

4. **Profile: a muzzle that leads the eye.** Side-on (`02`, `14`, and `16` at 90° and 270°), the near eye sits on the
   front edge of the silhouette with only a small nub below it. That reads as pug-faced, and slightly bug-eyed. In the
   v2 side view, the nose and lifted muzzle sit clearly ahead of the eye. Fix: push the muzzle and nose pad forward
   about 1 cm, and lift the nose tip about 0.3 cm. That gives a snout plus cheek ahead of the eye in profile. If
   needed, also cap the eye anchor's slide round the skull at about 30° (currently 38°) so a sliver of cheek stays in
   front of the eye. Both changes are invisible front-on, so the kept face is safe. Check `18` again afterwards.

5. **Hind leg in side view: a readable hock.** Under the now-correct round thigh, the shin runs in one diagonal into a
   long flat foot that lands at or behind the rump line. It reads as a boot, and in the walk (`11`, frames 3–4) as a
   plantigrade foot. Fix:
   - Make the metatarsal, from hock to paw, close to vertical, leaning back about 10–15° at most.
   - Raise the hock point about 1 cm and sharpen its back edge into a visible heel.
   - Bring the standing hind paw forward about 1.5 cm, so it lands under the back of the rump, not behind it.

   Keep the C7 thigh width.

## Notes (not part of this pass)

- **Wall Sitter.** In side and 3/4 views (`02`, `04`, `09`), one grey face stripe lands as a floating dash on the
  cheek behind the eye, and reads like a stray brow. Shorten it or curve it to follow the cheek when the Wall Sitter
  next gets a pass.
- **Lower-face shade.** The shade terminator now crosses the face just under the eyes (`18`, `09`), so the muzzle and
  mouth sit in lavender shade most of the time. This is a lighting choice, not anatomy, but a clean white lower face,
  as in the reference, would add appeal. Consider a face-only shade offset when the face is next touched.
- **Re-shoot after the pass:** `14`, `16`, `04`, `11-walk-seq-sheet.png`, `07` and `turnaround-compare.png`. Re-review
  the 0°, 90°, 180° and walk frames specifically.

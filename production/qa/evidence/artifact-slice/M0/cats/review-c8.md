# Art-director review: C8 pass (owner references only)

Date: 2026-11-24. Scope: how closely the model matches the owner's C8 references
(`design/reviews/user-comments-2026-11-24.md` §C8). No new shape ideas. Anything that does not
move the model toward a named reference image is left out.

Inputs: `design/reviews/refs/mikan-front-round-face-good.png` (KEEP), `mikan-front-pear-face-bad.png`,
`mikan-side-dog-snout-bad.png`, `cat-side-profile-ref.png`, `mikan-turnaround-ref-v2.webp`. Renders:
`19-c8-compare.png`, `turnaround-compare.png`, `14-turnaround-mikan.png`, `16-orbit-8x45.png`,
`17-orbit-24x15-continuity.png`, `18-front-face-check.png`, `11-walk-seq-sheet.png`, `README.md`.

## Verdict: FIX

The face is now close to the references. The tail is not: it is the owner's explicit C8 ask, and
it reads as a thin whip, not the thick cat tail in the reference.

## (1) Front-on vs KEEP: matches. Not pear-shaped.

Measured on `18-front-face-check.png` (scale-normalised, outline extents per row):

| | KEEP | Now | Pear (rejected) |
|---|---|---|---|
| Widest row | at nose level (473 px) | at nose level (475 px) | just under the eyes |
| Crown width at ear bases ÷ widest | 0.80 | 0.80 | 0.65 |
| Jaw curve (width per row below the widest) | reference | the same curve, about 15 px higher | short, sharp drop to the chin |
| Mouth to chin (centre column) | 45 px | 61 px | — |

- The ears sit on the outer corners of a broad crown, as in KEEP. The narrow crown that made the pear is gone.
- The only remaining difference: the eyes, nose and mouth sit about 20 px (about 4% of head width)
  higher inside the outline. That leaves a little more chin below the mouth. It is minor, within tolerance.
- `19-c8-compare.png` makes the head look more bottom-heavy than it is. Its "now (front)" panel is
  cropped tighter than KEEP, so the ears and crown are cut off while the cheeks fill the frame.
  The owner will judge from this panel, so it must be re-framed (fix 4).

## (2) Side-on vs `cat-side-profile-ref.png`: passes

- The face is flat and the skull round. There is no snout protrusion and no crease lines, so the
  dog-snout problem from `mikan-side-dog-snout-bad.png` is gone.
- The eye sits near the front of the face, as in the reference.
- At 90° the nose tip does not read at all. The reference shows a tiny nose barely ahead of the cheek.
  This is acceptable as is; it is not a blocker.

## (3) Tail vs `cat-side-profile-ref.png` (and the approved v2 back view): FIX

| | Reference | Now |
|---|---|---|
| Length | about body length | about body length. Correct. |
| Base thickness | about a foreleg's width | about half a foreleg's width (radius 2.2 cm) |
| Taper | nearly uniform to a blunt, rounded tip | tapers to about half (1.05 cm), a thin pointed whip |
| Root | top of the rump, continuing the back line; centred high from behind (v2 back view) | from behind, about a third of the way down the rump. At 135–165° it is a separate cylinder plugged into the rump flank, with its outline ringing the root |
| Carriage | near level, a slight arc (side ref); upright curl (v2) | rises steeply to a vertical tip above ear height. The carriage system can keep this; the thickness is what reads wrong |

## (4) Orbit and walk

- Walk: all 8 frames are clean, with no ink wedges or pops.
- Orbit: the per-eye decal travels continuously, with no doubled eye.
- Back of the head at 135–195°: the silhouette reads boxy, with vertical sides and square lower
  corners. The v2 back view has a rounder head that is fuller at the cheeks below the ears.
- `14-turnaround-mikan.png`: the side-view cat's tail crosses into the back-view panel, so the back
  view appears to have two tails. This is a capture layout fault, not a model fault.

## Corrections (max 4)

1. **Tail thickness and taper** (`cat-side-profile-ref.png`): make the base about a foreleg's width.
   Taper it by no more than about 25%, and end it in a blunt rounded tip.
2. **Tail root** (`cat-side-profile-ref.png` and the v2 back view): put the root at the top centre of
   the rump, on the spine line, and blend it into the back. No cylinder cap may show at 120–165°.
3. **Back of head** (v2 back view): round the lower corners of the head's back silhouette into the
   cheeks. Do NOT narrow the crown or inset the ears; that is what produced the rejected pear
   (`mikan-front-pear-face-bad.png`). The front silhouette measured above must not change.
4. **Evidence framing** (KEEP image): recapture the 19 "now (front)" panel framed like KEEP, with
   the ears and crown in frame. Space the 14 turnaround panels so that no tail crosses into the
   next view.

# M0 cats: look-dev evidence (character half), owner shape pass

Re-captured 2026-11-24 after the owner approved the art target and asked for clearer shapes, using the turnaround
`design/reviews/refs/mikan-turnaround-ref.webp`. The changes:
- a lifted muzzle and nose that read in silhouette
- larger cupped, pointed ears with a bigger inner pink
- a round thigh into a visible hock
- a full, forward chest and a compact, deeper body with the head sitting on the chest
- sturdy paws with toe splits
- a collar tilted high at the nape, with the bell hung proud of the chest

The face decal is unchanged, and the profile-face swap is removed: one decal at every angle. The tail and coat stay canon. Captured with
`node tools/shot.mjs` (headless Chromium + SwiftShader, 1920×1080, DPR 1) from
`prototypes/artifact-slice/dist/catlab.html` (build it with `node tools/cats/build-lab.mjs`). Every
frame is deterministic: `t=` steps the sim at 1/60 s. Day key unless noted (art bible §4.4). Cat
scale is 1.25.

| File | What it shows | Lab URL query |
|---|---|---|
| `01-front34-day.png` | Mikan + Wall Sitter, front 3/4, third-person camera height | `view=front34&dist=2.0&h=0.95` |
| `02-side-day.png` | Side profile: lifted muzzle, round thigh into a hock, full chest, collar, interior lines | `view=side&dist=2.0&h=0.95` |
| `03-back34-day.png` | Back 3/4, the gameplay read: cap, collar line, back, tail | `view=back34&dist=2.0&h=0.95` |
| `04-walk-midstride-side.png` | Walk at 0.6 m/s, passing pose | `view=side&gait=walk&t=2.0556` |
| `05-tail-carriages-silhouette.png` | M0 test (4): the six carriages, all in frame. Left to right: flag, post, spring, blade, anchor, comma | `strip=1` |
| `06-tail-carriages-colour.png` | The same six, in colour | `strip=1&sil=0` |
| `07-explore-distance-back-day.png` | Mikan from behind at the Explore camera (3.0 m) | `view=back&cast=mikan&dist=3.0&h=1.05` |
| `08-back34-dusk.png` | As 03, under the Dusk key | `view=back34&phase=dusk` |
| `09-closeup-faces.png` | Close-up faces | `view=front34&cam=close` |
| `10-walk-back34.png` | Walk from behind 3/4, passing pose | `view=back34&gait=walk&t=2.0556` |
| `11-walk-seq-1..8.png` + `11-walk-seq-sheet.png` | One full walk cycle (0.444 s at 0.6 m/s) in 8 frames: stride, body bounce with a settle at contact, head bob a beat late, pom bouncing behind | `view=side&gait=walk&cast=mikan&t=2.0…2.389` |
| `12-lookat-camera-back34.png` | `Cat.lookAt(worldPos)`: both cats turn their heads to the camera from behind | `view=back34&look=cam&t=1.2` |
| `13-side-day-res85.png` | As 02 at 85% render scale (canvas upscaled), for the line check | `view=side&res=0.85` |
| `14-turnaround-mikan.png` | Front / side / back at the reference sheet's eye-level camera | `turn=1&t=0` |
| `15-turnaround-wallsitter.png` | The same layout for the Wall Sitter (same shape language, Round build) | `turn=1&cast=wallSitter&t=0` |
| `turnaround-compare.png` | The owner's reference (left) beside 14 (right). The reference's long tail and back patches are not canon, so they are not modelled | composed from 14 |

**Line (L-3 as revised):** the nominal width is 2.5 px against the OUTPUT height, with a top-up when the render target is smaller than the output. Horizontal ink-run medians are 3 px on `02` and 3 px on `13`; the same count on the first M0 `02` gave 2 px. So the line is heavier, and it no longer thins at 85%. Interior overlap lines (leg over body, haunch, head over neck, tail over rump) come from a separate legs shell, plus a hull pulled toward the eye by a share of the baked local thickness. Thin parts (ears) are never pulled, and the pull is capped at 1.6 cm so far paws never ink solid through leg gaps.

**Cost:** 2 cats = 8 draw calls (fill, hull, whiskers, blob each); about 28k triangles per cat mesh, drawn twice.

# M0 cats: look-dev evidence (character half), owner shape pass + eye pass

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
| `14-turnaround-mikan.png` | Front / side / back / 3-4 at the reference sheet's eye-level camera | `turn=4&t=0` |
| `15-turnaround-wallsitter.png` | The same layout for the Wall Sitter (same shape language, Round build) | `turn=4&cast=wallSitter&t=0` |
| `16-orbit-8x45.png` | Mikan at 8 yaws, 45° apart: one face decal set, no swap | `angle=0..315&dist=1.7&h=0.5&fov=30` |
| `17-orbit-24x15-continuity.png` | 24 yaws, 15° apart: the near eye travels continuously round the skull. No pop and no doubled eye | same, 15° steps |
| `18-front-face-check.png` | Front-on face: the kept face before this pass, now (camera 1.22× further to cancel the 1.22× head), and the absolute difference. Measured: eye spacing, nose drop and feature areas match within 1–2% of eye separation; after normalising for scale, nose IoU is 0.92 and eye IoU 0.87 (the eyes now sit on a rounder skull) | `view=front&cast=mikan&t=0` |
| `19-c8-compare.png` | C8: the owner's KEEP round face and target side profile beside the current front, side, 3/4 and back | composed |
| `turnaround-compare.png` | The owner's v2 reference (left) beside 14 (right). The reference's long tail and back patches are not canon, so they are not modelled | composed from 14 |

**Line (L-3 as revised):** the nominal width is 2.5 px against the OUTPUT height, with a top-up when the render target is smaller than the output. Horizontal ink-run medians are 3 px on `02` and 3 px on `13`; the same count on the first M0 `02` gave 2 px. So the line is heavier, and it no longer thins at 85%. Interior overlap lines (leg over body, haunch, head over neck, tail over rump) come from a separate legs shell, plus a hull pulled toward the eye by a share of the baked local thickness. Thin parts (ears) are never pulled, and the pull is capped at 1.6 cm so far paws never ink solid through leg gaps.

**Cost:** 2 cats = 8 draw calls (fill, hull, whiskers, blob each); about 28k triangles per cat mesh, drawn twice.

**Eye pass (coordinator, after the owner sign-off).** The face card now carries only the nose and mouth. Each eye, with its lids and expression, is its own decal. Front-on it projects along +Z, exactly as the kept face did. As the camera moves round to that eye's side, its projection axis turns toward the camera (up to 68°) and its anchor slides round the skull (up to 38°), and it grows up to 12%. All of this is continuous with the camera's yaw around the head, with no discrete switch, so side-on the near eye reads as the reference's big round eye. The head grew to 1.22× (Round build 1.27×) with a rounder cranium and fuller cheeks; the front legs are straight columns, and the hind shin grows out of the thigh.

**C7 pass (owner: thighs and front legs; anatomy and appeal, not a 1:1 trace).**
- **Hind thighs:** narrower, sitting under the body. They keep the round side-view shape but now live inside a wider rump pear, so from behind the haunches read inside the outline with no lateral bulge.
- **Front legs:** moved 4.4 cm forward, so they drop from the shoulder at the upper front of the chest, under the neck base, with the chest slightly ahead of them (cf. the anatomy wireframe).
- **Legs overall:** slightly longer.


**AD anatomy review fixes (`review-art-director-anatomy.md`).**
1. **Walk ink wedge (blocker).** The swinging foreleg's wrist was folding inside out at an 86° bend, which exposed the hull's back faces as solid ink. Now the leg skin weights blend over twice the distance, lift comes mostly from the shoulder and hip, wrist and hock bends stay under about 55°, and the hull pull on legs is capped at 0.8 cm. All 8 walk frames and `04` are clean.
2. **Front view.** Forelegs slimmer on the inner face and 4 mm further apart, so there is daylight up to the elbow. A convex bib leads the legs by about 1 cm.
3. **Head from behind.** The skull is narrower than the cheeks; the ears are set in about 10% of head width and splayed about 10° more; a crown dome sits between them. It reads as a dome, not a box (`07`, `16` at 180°).
4. **Profile.** The muzzle is about 1 cm further forward with the nose lifted. The near eye's anchor slides 45° round the skull, so cheek and muzzle lead the eye. The reviewer suggested capping the slide at 30°, but a smaller slide moves the eye forward; raising it gives the cheek-ahead-of-eye result the review asked for. Front-on is unaffected (`18`).
5. **Hind leg.** The hock is raised about 1 cm and given a heel point. The foot is near vertical, and the paw sits about 1.4 cm forward under the back of the rump.

**C8 pass (owner: the round fat face, a short cat muzzle, a long tail).**
- **Reverted from the AD anatomy round:** the narrowed cranium, inset and splayed ears, and crown dome (together they made the pear head). The cheeks now sit lower and fuller.
- **Cap and eye patch:** both are scaled by head size again. The 1.22× head had shrunk the patch over the left eye away; it is now restored.
- **Muzzle:** a shallow, softly blended bump; the nose sits barely ahead of the face. No crease lines.
- **Tail (canon change):** a long tapered tail (`tail: 'long'`, 0.37 m real size, radius 2.2 → 1.05 cm) on a new 'mikan' carriage. It rises, curls up gently and sways with lag. The six personality carriages still work on it (`05`, `06`, rendered on Mikan).
- **Kept from earlier passes:** the C7 body (front legs under the chest, narrow haunches, hind heel) and the per-eye decals (no swap).
- **Checks:** the walk (8 frames) and the 24-angle orbit are free of artefacts.
- **Line:** the low-resolution boost is eased (factor 2.2 → 1.0) so the harness lands at about 2.3–2.4 px at 85%.

**C9 pass (owner: a small snout with a nose bridge; a shorter, thick S-curve tail with a white tip).** This supersedes the C8 tail.
- **Muzzle:** a nose bridge (a narrow capsule from between the eyes down to the nose) and a small snout: the nose tip and upper lip sit about 1 cm ahead of the cheek. The profile now reads forehead, bridge, small nose, small chin. The eye's slide round the skull is eased 45° → 40° so the bridge shows ahead of it.
- **Front-on (`18`):** the outline stays within about 3% of KEEP, the state already accepted at C8. The bridge is invisible front-on.
- **Tail:** 0.25 m real size, radius 3.0 → 2.6 cm (about a foreleg), with a blunt tip and a white tip. The root sits at the top of the rump on the spine line, buried so no cap shows. The 'mikan' carriage is an S (up, back, tip hooking forward) with sway and lag. The six carriages still work (`05`, `06`).
- **Back of the head:** a soft nape fill rounds the lower outline from behind; the crown, ears and front silhouette are unchanged.
- **Framing:** `19` now shows the front framed like KEEP (ears in) beside the C9 references; `14` is re-spaced so no tail crosses a neighbour; the `16` and `17` orbits are framed higher.
- **Checks:** walk and orbit are clean. `node tools/build.mjs && node tools/publish-check.mjs` passes.
- **Shared rules:** the head and tail-root changes apply to every cast, so the M1 lineup is re-rendered.

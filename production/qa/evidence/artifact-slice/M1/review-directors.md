# M1 combat grey box: creative and art director review (round 1 of 3)

Reviewers: creative-director + art-director (joint). Date: 2026-11-24.
Inputs: `random-sheet.png`, `random-02/03/07/09.png`, `pileon-sheet.png`, `impact-t4-rout-inversion.png`,
`slowblink-menu.png`, `slowblink-target.png`, `guest-join.png`, `daifuku-standoff.png`, `daifuku-tub.png`,
`daifuku-phasebreak-1.png`, `cats/00-lineup-sheet.png`, `README.md`, `results.json`; targets
`design/previews/02-combat-clash.png`, `03-combat-slow-blink.png`, `04-combat-pile-on.png`;
`design/gdd/camera-system.md` §3.2, §3.5, §4.1, §7; `design/ux/hud.md` §4.1–§4.4.

## Verdict: **FIX**

The cinematic beats meet the brief. The Pile-On (`pileon-sheet.png`) is close to preview 04: halftone wipe, Bell-Gold panel,
dust cloud with paws and tails, Mikan peeking, KA-BLAM. The T4 impact frame (lavender flattening, ink
silhouettes, FWIP!) and the T5 phase-break word are good manga beats, and the flash screening is honest work.

**Regular play does not look like the previews, and that is where the player spends 90% of the fight.**
The camera is a high, far tactical view, not "third-person behind the cat". Every cat except Mikan is the
same grey tabby. Fights take place in the middle of an empty lot, and the hit language is too small to read at this distance.
"Combat feeling to maximum" currently happens only when the game takes the camera away from the player.

## Scores (/10)

| Area | Score | Why |
|---|---|---|
| Camera | **3** | Controlled cat is 5–14% of screen height (random-sheet: about 5–6% in 01/05/08; 13–14% in 03/07/09). Preview 02 is about 35%. Pitch is high, and the view is often to the side of or above the cat, not behind it. The rig follows `camera-system.md` (6.0–7.2 m, +25°, 6.7% floor), so **the spec itself is wrong for the owner's brief**, not only the build. Slow Blink at 8.5 m / +50° is nearly top-down (`slowblink-menu.png`). That is the opposite of preview 03's low view behind the cat. |
| Readability / identity | **4** | Mikan reads (orange + gold ring + bell). The other seven cats are identical grey tabbies, so allies and enemies differ only by a thin gold vs sage keyline. That fails at brawl distance (`random-03`, `guest-join`). Plates show Hige/Pon/Kinako coats that the 3D does not. In `slowblink-target.png` the target bracket frames the Captain's bars while the Captain is **hidden behind the High Road wall**. |
| Impact / VFX | **6** | Set-pieces 8–9. Real-time hits about 4: dust poms, small sparks and one swipe arc at 5–10% scale. None of the preview 02 language: starburst the size of a head, speed-smear arc, ground cracks, dizzy spirals, stretched lunge pose, debris pebbles. Procedural poses leave cats standing upright mid-fight. Shake cannot be judged from stills. |
| HUD | **7** | Plates, boss ribbon, overhead Nerve/Frazzle bars and the Slow Blink menu track preview 03 and hud.md §4.2/§4.4 closely. Issues: the plate stack takes about 28% × 37% of the frame (fine once cats are bigger, heavy now). The controlled-cat ground ring is the strongest graphic in most frames. The target bracket sits on the bar, not the body. |
| Arena | **4** | The painted fences, houses and bushes are on-look (M0 approved). The floor is a vast bare dirt plane: about 70–80% of most frames is empty ground with one bucket, a manhole and puddles. Preview 02 has a tarp, a crate, a van, grass clumps, a pole and a close fence. A free-standing wall puts fights behind it. |
| **Overall** | **5** | The sound parts are already in place: sim, HUD system, cinematic grammar, capture harness. Presentation of real-time combat is at grey-box level. |

## Fixes (prioritised, max 6)

1. **[presentation: camera] Rebuild the combat rig behind the cat, FF7R style.** Starting values to tune:
   distance 3.5–4.5 m, pitch +10° to +15°, framing point biased so the controlled cat sits lower-left/centre
   third at **≥ 20% of screen height**, lock target ≥ 12%. Default yaw stays behind the controlled cat. Free
   orbit is kept, and soft-lock recentres behind the cat, not side-on. This contradicts `camera-system.md` §3.2,
   §4.1 and §7 (6.0–7.2 m, 6.7% floor), so those rows must be amended with the owner's sign-off in the same round.
   Acceptance: in a new random-sheet, ≥ 8 of 10 shots show the cat from behind at ≥ 18% height.
2. **[cats] Wire `CAST_MAP` to the ten new casts now** (`cats/00-lineup-sheet.png` shows they exist and
   their silhouettes are distinct). The 3D coat must match the HUD plate portrait. Enemy Toughs must not share
   a coat with any Posse cat. Re-check the triangle budget after the camera change: 0.86 M vs 0.5 M with 4 draws per cat.
   With the cats bigger, budget the rim shell rather than cutting it.
3. **[sim] Keep the fight ring on the playable side of the High Road wall.** The ring runs 0.6 m past the
   wall (README), so lock targets are occluded (`slowblink-target.png`) and the camera turns ≤ 90° along the wall.
   Clamp ring and spawn points to the lot. Presentation adds the x-ray keyline for any remaining occlusion.
4. **[presentation: camera + HUD] Make Slow Blink push in, not lift.** Match preview 03: low three-quarter
   view behind the controlled cat at about 4–5 m and +15–20°, with the target body bracketed (not its bar).
   Keep the −30% sat / −10% value grade and the menu as built. Amend `camera-system.md` §3.2 Slow Blink row.
5. **[presentation: VFX] Scale the real-time hit language to preview 02.** For T2–T3: a starburst spark about ⅓
   of the cat's height, a speed-smear arc on swipes, a ground crack decal, pebble debris and speed lines on lunges.
   For Frazzle: dizzy spirals. Exaggerate procedural lunge/recoil squash-stretch (at least 1.4× stretch on lunge).
   Supply a short video or GIF capture so shake and hit-stop can be judged. Stills cannot show them.
6. **[presentation: arena] Dress the ring, not the horizon.** Within the 10 m ring add about 4–6 mid-size props:
   tarp, crate, tyres, planks, a bucket cluster and grass clumps along the fence base. Bring the fence/backdrop
   closer so it fills the upper frame at the new camera pitch, and add foreground grass occluders at
   the frame edges. Target: no more than about 40% of the frame is empty ground.

Re-review in round 2 on: a new `random-sheet.png`, `slowblink-menu.png`, one T3 real-time hit still, and a
5 s clip.

# M1 combat grey box: final review (round 3 of 3)

PROTOTYPE - NOT FOR PRODUCTION. Reviewers: creative-director + art-director + game-designer (joint). Date: 2026-11-24.
This is the last round for M1. Nothing more is fixed in M1; open items carry into M2+.

**Inputs:** round-1 `review-directors.md` and `review-game-designer.md`; refreshed `random-sheet.png`, `random-01/03/06/08.png`,
`pileon-sheet.png`, `slowblink-menu.png`, `slowblink-target.png`, `guest-join.png`, `daifuku-standoff/wall/tub/phasebreak-1.png`;
`fight-clip.webm` (16 frames sampled at 2 fps into a scratch contact sheet); `README.md`, `results.json`;
`design/gdd/camera-system.md` change log ("Owner direction: third-person behind the cat (2026-11-24)");
`prototypes/artifact-slice/src/sim/combat/API.md` assumptions 15 and 18–22, plus its round-2 table.
I also ran `node tools/sim-run.mjs` today (20 seeds by default; API.md quotes 30 seeds). All scenarios met their expectations, and the
numbers agree with API.md to within about 2 s.

## Verdict: **GO WITH FIXES** (the fixes carry into M2)

Round 1's main complaint has been answered: real-time play did not look like the previews.
- **Camera:** it now sits behind the cat, and the cat fills about 20% of the screen height in most real-time frames.
- **Cats:** the casts are real, and each coat is distinct.
- **Fight space:** the ring has a close fence and props.
- **Challenger:** the fight now lasts 24 s instead of 7 s.

Problems remain at the edges. The camera still fails beside walls and props. The lettering runs off the frame. The Pile-On beats still read as one generic "BAP-BAP-BAP!". AI Moves fire, but the Set-up → Pay-off chains do so only thinly. None of these blocks a showcase grey box.

## Round-1 fix items

### Directors (round 1: FIX)

| # | Item | Status | Evidence |
|---|---|---|---|
| D1 | Combat rig behind the cat (3.5–4.5 m, +10–15°, cat ≥ 20%) and amend the spec | **PARTLY** | The rig and the spec are both **done**: 3.8 m, +12°, 0.45 m shoulder offset, and `camera-system.md` §3.2/§4.1/§7/§8 amended under owner direction. Back views at about 19–21% height in `random-01/03/07`, `guest-join` and `daifuku-standoff`. The acceptance target (≥ 8 of 10 frames from behind at ≥ 18%) is **narrowly missed**. Of the 8 real-time frames in the sheet, about 6 pass. `random-06` and `daifuku-tub` look **over a wall top**: the wall fills the left third of the frame and cuts the controlled cat. Props sit as foreground occluders: planks in `random-01`, tyres in the clip's frames 10–12. The Pile-On reveal and outcome views (`pileon-06..08`) are still high and far, with the cats at about 10% height. |
| D2 | Wire `CAST_MAP` to the ten casts and hold the triangle budget | **DONE** | The enemies in every frame are tan tabby, tuxedo, brown, piebald and orange tabby. None of them is grey and none repeats a Posse coat. Plates match the 3D models. In the 10-cat brawl, LOD brings triangles to 0.28–0.48 M (median 0.38 M, under the 0.5 M budget), and the rim shell is kept. |
| D3 | Keep the ring on the playable side of the High Road wall | **PARTLY** | The sim part is **done** (API #22: walls at ring edge, half-plane clamp), and `slowblink-target` now brackets a visible Captain. Two things are still open. The camera can still sit on the far side of a wall (`daifuku-tub`, `random-06`). No x-ray keyline is visible for occluded cats. |
| D4 | Slow Blink pushes in low (4–5 m, +15–20°) and the bracket frames the body | **DONE** | `slowblink-menu` and `slowblink-target`: the view is low three-quarter at about 4.6 m / +20°, the grade is kept, and the bracket frames the Captain's body. Nit: this capture shows Mikan from the front-left three-quarter, not from behind as preview 03 does. |
| D5 | Scale the real-time hit language and supply a clip | **PARTLY** | The parts are built: a big slash arc (`daifuku-tub`), a crack and pebbles, larger poms, lettered hit words (ZOOM/WHAM in `random-08`, BZZT in the clip), 1.42× lunge stretch, and a 7 s clip. In stills, the dust poms still dominate and the head-sized starburst does not read. Two things are still missing: authored combat poses (procedural only) and a spiral-eye decal. |
| D6 | Dress the ring and bring the fence in | **DONE** | Three sides of fence are close. The ring has a tarp, planks, tyres, a crate/box, a bucket and grass at the fence bases. Empty ground is about 35–45% of the frame (`guest-join`, `slowblink-menu`, clip), against the ~40% target. New issue: in-ring props have no camera fade (see D1). |

### Game designer (round 1: GO WITH FIXES)

| # | Item | Status | Evidence |
|---|---|---|---|
| G1 | Challenger 6.9 s, so use a showcase Captain-rank override with Fear Water | **DONE** | Skilled 24.1 s, from 14.9 to 33.6 s (target 23–34 s). 20/20 Pile-Ons. 7.5 tags and 4 Relays per fight. Togemaru casts Moves in 30% of fights. **Creative-director sign-off granted here for the showcase only.** Canon OR-16 keeps the challenger a Tough, and `showcase_overrides` never transfers. |
| G2 | Show glyphs for the input device in use | **DONE** | Z X C V on the plates. Q/E, Space, Esc and Tab in Slow Blink. A/D in the target step. A P/Tab key strip. The gamepad path is still untested. |
| G3 | Give each Pile-On beat its own cat, plus barks | **PARTLY** | **Barks are done:** one icon balloon at a time (shield, droplet, "!"). Beat faces exist: Mikan's face with "SHNK!" in `pileon-05` and `random-09`. Frames 01–04 of `pileon-sheet` still lead with the generic **"BAP-BAP-BAP!"**, cut off at the right edge. The stills show no other cat's face or Style word (SKRITCH/WHAM/YOWWL). |
| G4 | §3.9 bucket splash as a 3 m cone, then re-check Goofball prop use and the sandbox Pile-On rate | **DONE** (the follow-up shows a cost) | The cone is built (API #15). The re-check shows the cost I predicted in round 1. Median-bot sandbox Pile-On reach is now **16/20**, against 29/30 before. Pile-On is **3%** of Posse damage there. |
| G5 | Skilled bot chains a Set-up with its Pay-off, then re-report | **PARTLY** | Shoulder Check → Bunny-Kick lands 0.25–0.50 times per fight. Withering Hiss → Purr lands 0–0.20 (0.00 in the challenger fight today). Splat → Belly Flop lands at most 0.05. Moves are 7–13% of Posse damage, against about 20% in F9. |

## Scores (/10)

| Area | Round 1 | Final | Why |
|---|---|---|---|
| Camera | 3 | **6** | The rig is right: from behind, at about 20% height in most real-time frames, and Slow Blink pushes in. Three faults remain: views over walls and along walls (about 3 in 10 by README's own count), props as foreground occluders, and Pile-On reveal/outcome views that are still tactical-far. |
| Readability / identity | 4 | **7** | Coats are distinct and match the plates. The bracket now frames the body. Two faults: lettering overlaps enemy bars (`random-08`), and in tight brawls (`random-01`) cats overlap into one mass. |
| Impact / VFX | 6 | **7** | Set-pieces are still 8–9. Real-time hits are now about 6: bigger arc and poms, cracks, words. Weak points: the starburst is lost under the poms, poses are procedural, and lettering runs off the frame (BAP right edge; KA-BLAM top edge and over the key strip in `daifuku-phasebreak-1`). Flash screening passes: 2/s and 2 per 5 s, red 0.01%. |
| HUD | 7 | **8** | Keycaps, key strip, barks and the body bracket are all done. Three faults: the plate stack still takes about 25% × 35% of the frame and covers cats in the lower left (`random-08`); the key strip stays visible over full-screen set-pieces; there is no x-ray keyline for occluded cats. |
| Arena | 4 | **7** | Close fence, props in the ring, grass at the fence bases. Empty ground is about 40%. Props have no camera fade. |
| Gameplay / conducting | — (designer: GO WITH FIXES, unscored) | **7** | The challenger fight now carries the teaching beat. AI personalities now **act** (Hige self-casts in 73–90% of sandbox/Captain/challenger fights, Pon in 47–80%), not only stand. Weak points: thin Pay-off chains, Move share about half of F9, trash fights 20–30% short of F9 (accepted in round 1), and Daifuku phase 1 at **28 s** to the break (round 1: 39 s; GDD ≈ 55–60 s). |
| **Overall** | 5 | **7** | Real-time combat now reads as the game in the previews in most frames. What remains is edge-case camera work, lettering discipline and the depth of personality, all M2 work. |

## Ruling: personality Move policies (API #18–#20; deviate from Combat §3.10/§3.11; backlog B-17)

**Accepted for the showcase. Not accepted as canon.** The combat GDD is not amended by this ruling.

Reasons:
- The owner's direction is that personality shows in *how a cat fights*. In round 1, AI Moves were 0.00 per fight everywhere. Now Hige self-casts Shoulder Check 0.9–1.5 times per fight, and Pon casts Withering Hiss and Purr 0.6–1.0 times. The deviation is the thing that makes the personalities visible.
- The scope is narrow and driven by data. It covers only the listed Moves (in `personalities.json`). Every other `command_only` Move stays command-only. A guest still spends only on auto Pay-offs (§3.14).
- It does not take conducting away. The conductor still commands 0.5–1.9 Moves per cat per fight. Hige's self-cast Shoulder Check mostly **sets up** the player's Bunny-Kick (the only chain that lands regularly), so it feeds the conductor.

Conditions, all for M2:
1. The combat designer decides on amending §3.10 (Set-ups `command_only` for AI) and §3.11 (last Paw) **before engine work starts**. The Unreal slice must not inherit the sim's behaviour by default.
2. When an AI cat spends its last Paw under #19, the Paw pip on its plate must visibly drain, so the conductor can see it.
3. `ai_fill` 1.0 (#20) stays a showcase override. Canon stays at 0.5.

## Carry into M2 (max 8)

1. **Camera near geometry.** Collide with and avoid the far side of walls (`random-06`, `daifuku-tub`). Fade or cut away in-ring props that come between the camera and the controlled cat (planks, tyres). Add the x-ray keyline for occluded cats. Bring the Pile-On reveal and outcome views in to third person. Re-run the acceptance test: ≥ 8/10 frames from behind at ≥ 18% height.
2. **Lettering safe area.** Keep every word inside title-safe. "BAP-BAP-BAP!" is clipped at the right and "KA-BLAM!" at the top, where it also overlaps the key strip. No word may sit on enemy bars. Hide the key strip during full-screen set-pieces.
3. **Pile-On per-beat identity.** Replace the generic headline with each beat's Style word and face for every participating cat. Supply one still per cat as evidence.
4. **Real-time hit read.** Make the starburst read above the dust poms. Author combat poses (lunge, recoil, splat) on the rig instead of the procedural wrapper. Add a spiral-eye decal.
5. **B-17 decision and Move depth.** Rule on the GDD amendment for §3.10/§3.11. Raise the Withering Hiss → Purr and Splat → Belly Flop rates. Bring the Move share up toward F9's ~20%. Give Kinako one Move so her personality is more than distance.
6. **Fight-length re-baseline.** Re-baseline the F9 table against the spatial sim (the game designer's GDD edit). Settle Daifuku phase 1 at 28 s against ≈ 55–60 s: the boss climax currently ends too fast. Recover the median sandbox Pile-On reach after the cone change (16/20).
7. **Real-hardware checks.** Measure frame time on a GPU laptop (plan §4.8); triangles peak at 0.48 M against 0.5 M. Test the gamepad path. Run a human playtest for the 0.35 s Tag-In window and the keyboard-and-mouse map.
8. **Record the showcase-only overrides.** In the decision log, record the challenger as Captain + Water Fear (OR-16), `ai_fill` 1.0, the personality Move policies, and the bucket cone angle (90°, assumed). The engine slice must start from canon, not from `showcase_overrides`.

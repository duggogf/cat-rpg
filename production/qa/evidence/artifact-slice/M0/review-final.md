# M0 look-dev: final review (art director + creative director)

PROTOTYPE - NOT FOR PRODUCTION. Date: 2026-11-24. Iteration 3 of 3, the last for M0. Nothing more is fixed in
M0; everything open below goes to the M1+ backlog.

**Target:** the visuals of *Shin chan: Shiro and the Coal Town* (`design/reviews/refs/style-reference.webp`), which
means inked 3D cel characters that read as 2D cels over un-inked painted anime backgrounds, with a free camera. Our
2D target frame is `design/previews/01-exploration.png`.

**Evidence read (images opened):** `env/compare-01.png`, `compare-01-day-full.png`, `compare-01-dusk-full.png`,
`view01-day.png`, `orbit-day-sheet.png`, `orbit-dusk-sheet.png`, `orbit-day-2.png`, `orbit-dusk-1.png`,
`motion/walk-day-sheet.png`, `motion/walk-dusk-sheet.png`, `motion/walk-day-06.png`, `motion/walk-day-11.png`;
`cats/01`, `02`, `03`, `04`, `05`, `11-walk-seq-sheet`, `12`; both READMEs and `env/results.json`; the two earlier
reviews. The `.webm` files were not reviewed frame by frame, so the ambient-motion items rest on the README and the
12-frame sheets. I sampled the lit lane in `view01-day.png` as 100×60 px box averages: **#C5B599 / #C7B798, L\* 74–75**.

## Verdict: GO WITH FIXES (carried into M1)

M0 has answered its question: code-authored three.js can hit this look in a browser, inside budget (98 draw calls
of 350, 137k triangles of 500k, 1.03 MB of env textures). The fix pass moved every area. Mikan now has a profile,
a walk and a face she can turn to the camera. The lane is dressed on all sides. The 01 framing now reads as the
same picture, and Dusk is the best frame in the set. Nothing argues for the §8 fallbacks or for a pivot.

What separates us from the reference is now **finish, not direction**. The lit ground is a stop short of 01's cream.
The plaster still shows the post filter. The Dusk wall glaze is still soft. The pom and the terminator still show
facets. Mikan has no seated idle. None of these needs a decision reversed. They go into M1 as listed below.

## Earlier fix items

### Art director (5 fixes)

| # | Item | Status | Evidence / what remains |
|---|---|---|---|
| 1a | Stone lantern: no facets, painted moss, lit/shade faces, green drip | **DONE** | Round lathe parts, moss cap and drip, painted terminator (`view01-day`, orbit 1, walk 5). |
| 1b | 01 dressing: bucket, pot + aloe, manhole, second plant, passer-by | **DONE** | All present at the 01 framing. The passer-by card shows only down the lane, which is correct. |
| 1c | Tree mass over the coping and down into frame | **DONE** | The Wall Sitter now sits inside foliage, as in 01. |
| 2a | Lit lane to #D2C4A4 (L\* 79.5), less saturated | **PARTLY** | Hue and chroma are fixed (no longer khaki). Value measures L\* 74–75, against 79.5 asked and 83.5 in 01. |
| 2b | Break every wall/fence run (stains, pipe, posters, gate, broom, moss, crack) | **DONE** | Orbits 2 and 6 now carry a drainpipe, posters, cracks, pots, a gate and a broom. Large bare ground still fills the bottom 40–50% of orbits 2, 5 and 6 (see the CD list). |
| 2c | Paint post: smaller Kuwahara radius, no vertical streaking | **PARTLY** | Softer, but the plaster still shows vertical smear (`orbit-day-2`, `walk-day-06`). It reads as a filter, not as brushwork. |
| 3a | No half-transparent set pieces (orbit 4 ghost) | **PARTLY** | The orbit 4 ghost is gone. A new lens-proximity tell appeared: in `walk-day-06` and `walk-dusk-06` a hydrangea clump fills the lower right as a soft blue ball with white blobs. The hide does not cover hydrangeas. |
| 3b | Dusk wall banding: crisp shapes, not smears | **PARTLY** | Better, but `orbit-dusk-1` still shows broad, soft diagonal orange bands across the long wall. The bands on the ground are good. |
| 3c | Vary the distant town / roof stamp | **DONE** | Two crisp layers, mountains behind (orbits 4 and 7), lit windows at Dusk. |
| 4a | Line 2.5 px against output height; 85% must pass | **DONE** | Median 2.45 / 2.41 px; 2.48 px at 85%; ink ΔE 0. Note: **p10 = 0 px** in every run, so at least 10% of silhouette samples find no line. See the E-5 ruling. |
| 4b | Interior overlap lines | **DONE** | Leg-over-body, haunch and head-over-neck lines are visible in `02`, `04` and `11`. |
| 4c | Ear-tip spikes | **DONE** | Tips are clean at 1080p. |
| 5a | Muzzle, cheek, nose; profile decal at yaw > 60° | **DONE** | `02`: an almond eye, a nose bump and a mouth corner. Side-on, Mikan leans slightly puppy-like (short snout, tall upright ear); watch this in M1. |
| 5b | Thicker neck, bean torso, lifted belly | **DONE** | The "sausage on pegs" read is gone. |
| 5c | Collar seated as a curved band | **DONE** | |
| 5d | Pom: no noise, scalloped tuft lobes | **PARTLY** | The noise is gone, but the pom is now a smooth disc with a polygonal outline. It is not 01's scalloped tuft. From behind (`view01-day`) it shows a blocky shade facet. |
| 5e | Smooth shade terminator | **PARTLY** | Body and legs are smoother. The pom and the cap/white mask edge still stair-step, and a thin dark crack crosses the left ear in `01-front34`. |
| 5f | Default idle in the 01 view: compact sit / loaf | **NOT DONE** | Mikan still stands stiff-legged at the 01 framing; 01 has her seated. |
| 5g | Double the walk stride | **DONE** | `11-walk-seq` has a readable stride, a bounce with a settle, and the head and pom lag behind. |
| 5h | Re-frame the tail strip, all 6 in frame | **DONE** | `05`: all six carriages read distinctly. |

### Creative director (5 changes)

| # | Item | Status | Evidence / what remains |
|---|---|---|---|
| 1 | Komorebi: moving leaf dapple, higher-key lit surfaces, dapple on Mikan, sea-gap glow | **PARTLY** | Dapple is cast from every clump and drifts with the wind; the sea gap glows. Lit ground is short of high-key (see 2a). The dapple does **not** fall on the cats (by design, per the env README). |
| 2 | Dress all 360° at 01 density | **DONE** | Vending machine (lit at Dusk), gates, broom, ivy, mountain skyline, pots on both sides. There are still big empty ground fields in orbits 1, 2, 5 and 6, above the 40% rule. |
| 3 | Mikan alive in motion: stride, bob, pom lag, idle ear/blink/swish, head turns | **PARTLY** | Walk **done**; `Cat.lookAt` **done** (`12`). The idle life (ear flicks, blinks, tail swish) is not evidenced, and the seated idle is missing. |
| 4 | Ambient motion: foliage, laundry, grass, clouds, Wall Sitter tail | **DONE (by README)** | The wind is on sim time and in both videos. The Wall Sitter's tail twitch is not evidenced. |
| 5 | Repaint the vista; dusk windows; shaped wall light; occluder ghost | **PARTLY** | Vista, windows and the ghost are done. The wall light is still soft bands (= AD 3b). |

**Tally: 15 DONE, 9 PARTLY, 1 NOT DONE** across the 25 rows.

## Scores (/10)

The creative-director review gave no numbers. Its "earlier" column is the art director's, which both earlier reviews
endorsed.

| Area | vs reference: earlier → **final** | vs our 01: earlier → **final** | Why |
|---|---|---|---|
| Characters | 6 → **7.5** | 6.5 → **7.5** | The profile, walk, line weight and interior lines now read as drawn cels from every orbit angle. Held back by the faceted pom, the stepped mask/terminator edges and the missing seated idle. |
| Environment | 5.5 → **6.5** | 6 → **7.5** | It now matches 01 element for element, and 360° dressing makes the free camera survivable. Against the reference it is still sparser and less crisp: the plaster shows the filter and the ground fields are empty. |
| Lighting / colour | 7 → **7.5** | 6.5 → **7.5** | Dusk is excellent and the dapple sells summer. Day lit ground is about a stop low (L\* 74.5 vs 83.5) and the Dusk wall glaze is soft. Shade tint is still 0–0.06% neutral. |
| **Overall** | 6 → **7** | 6.5 → **7.5** | Reads as an anime alley with cels in it at the 01 framing, and as a good cel-shaded game off-axis. |

## Ruling: E-5 contrast (white coat on light ground, 13.3–17.5 L\* vs the ≥ 20 target)

**Accept for M0, with the ink line and contact shadow as the carriers. No value fix: do not darken the ground and do
not grey the coat.** Require a **rules fix plus a line-integrity fix in M1.**

Reasoning:
- 01 itself, our approved target, puts a white cat on cream ground. It would fail E-5 as written, and so would the
  reference (white Shiro on pale dirt). The style separates figure from ground with the line, not with fill value.
  An L\*-only fill test therefore measures the wrong thing for inked characters.
- The line clearly does the job: ink #33273B (about L\* 18) against the ring (L\* 54.7–63.6) is a **37–46 L\***
  step, all the way round the figure. In every frame I read, Mikan is found at a glance, helped by the orange cap
  and pom and by the lavender contact blob.
- But the acceptance rests entirely on the line, and the line data shows **p10 = 0 px** in all five runs. If those
  are real gaps and not measurement artefacts (feet on the contact blob, whisker crossings), the safeguard has holes.
  That must be closed before E-5 can rely on it.

**M1 requirement (owner approval needed for the art bible change):**
1. **Rewrite E-5 for inked figures** in the art bible: ink-vs-ring ≥ 35 L\*, **and** ≥ 90% of silhouette samples with
   line ≥ 1.5 px at output, **and** a contact blob present under every grounded cat. Keep the ≥ 20 L\* fill rule for
   un-inked elements (props, pickups, VFX).
2. **Explain or close p10 = 0**: classify the zero-width samples. Fix real gaps in the hull. Exclude the ground-contact
   arc only if the contact blob covers it.
3. **Worst-case check**: a white coat on fully lit lane at the Explore 3 m camera, at 85% scale and at 390 px width.
   If either fails the rewritten E-5, the first lever is a slightly stronger, wider contact blob, never a darker ground.

## Carry into M1

1. **E-5 rewrite + line integrity** (above). Blocking for M1 art sign-off.
2. **Lit ground to high-key**: lit lane to L\* ≥ 79 (target #D2C4A4, toward 01's 83.5). Re-measure E-5 under the new rule.
3. **Paint post on vertical planes**: no vertical smear on the plaster. Use flat value shapes with hard brush accents.
4. **Dusk wall light**: replace the soft diagonal bands with crisp, shaped light (slat and branch shapes).
5. **Lens-proximity hide for all foliage, including hydrangeas** (`walk-*-06`), and a test that fails on any
   near-lens blob.
6. **Mikan finish**: a scalloped pom with lobes and a smooth outline; smooth terminators on the pom and the cap/mask
   edge; remove the ear crack in `01-front34`; check that the profile reads cat, not puppy (ear placement, muzzle length).
7. **Idle life**: a seated/loaf idle as the default at rest, plus ear flicks, blinks and a tail swish; Wall Sitter tail
   twitch. Capture `view01` with Mikan seated as in 01.
8. **Ground fields**: break up the bare lane in orbits 1, 2, 5 and 6 to under 40% unbroken (stains, cracks, leaf
   litter, puddle, cat-scale props).
9. **Optional, creative-director wish**: let the dapple fall on the cats through `setLighting`, as long as it does not
   break the cel read or E-5.
10. **Stakeholder show**: a 20–30 s orbit-and-walk video at Day and Dusk, after items 2–5 and 7.

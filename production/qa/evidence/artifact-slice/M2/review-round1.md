# M2 review, round 1 of 3: lane, exploration, territory

Reviewers: creative director, art director, game designer (one combined pass). Date 2026-11-24.
Inputs: plan §2 and §5 M2 row; this folder's README, `results.json`, the 12 vantages, the 5 flows; `src/sim/territory/API.md`;
`design/previews/01-exploration.png`; `M0/env/compare-01.png`; owner direction C3/C5. Territory unit tests re-run here: **43/43 pass**.

## Verdict: GO WITH FIXES

The measurable acceptance is met: the bot walks (0 camera-in-geometry frames, cat in frame 99.06 to 99.91%), 6 × 2 vantages,
sim tests including the §4.14 95 → 100 case, no console errors. The laptop frame log is still pending. The rules underneath are sound.
**What fails is the presentation of territory.** The payoffs happen above the frame or are missing, the Boss coming down is never seen,
and district influence, which the owner calls half the game, has no readout on the street. Fixes 1 to 4 must land, and the
rescue, rival and dusk flows must be re-shot, before M2 closes.

## Scores

| | /10 | Why |
|---|---|---|
| Look | 6 | Vantages 1 and 3 and the LPY close shots hold the M0 look: painted plaster, inked cels, hydrangeas, buckets and posters. Vantages 0 and 4 are bare fence-and-wall corridors, and vantage 2's Den wall is a flat brown slab. The High Road shows an empty lawn behind the lane, and Haru's garden in dusk-04 is an empty grass plane. In dusk the house wall in vantage 5 and dusk-04 shows blotchy orange patches that read as a texture fault |
| Territory readability | 4 | The Patch tag (glyph plus wisp count) is clear. District influence and rival influence are not shown anywhere on the street, and the 95 → 100 moment is only a crown badge. The posts read as places to go: the red mailbox and the lantern are clear, and gold wisps work as beacons from 30 m (highroad-00/01). Daifuku is a plain grey cat the same size as a Wall Sitter, with nothing marking him as a Boss before the sniff |
| Marking feedback | 4 | Prompts are clean (E · Over-mark / Counter-Spray / Claim Spray / Rescue Spray), and the Whisker Sense desaturation with dashed rub-mark lines is good. But the wisps and the sparkle cloud sit about 3 m above the post and are **cut off at the top edge in every marking shot** (rescue-00 to -04, rival-02 to -04). rescue-01 matches rescue-00 pixel for pixel: **the 1.2 s hold ring is missing**. The Over-mark puff is a few pixels (rival-01). No numbers or bars move, so the 48 → 90 Rescue Spray doesn't feel like a payoff |
| Navigation | 7 | The camera is robust. The High Road hop and ribbon work, and the Head Home thread reads well (dusk-03/04). The lamp wave is not visible: dusk-02 has no lit lamps in frame. A potted plant clips through Mikan in rival-00/01, and a hedge blocks the ribbon and the cat in highroad-01 and sniff-00 |
| Overall | 5.5 | The systems are ready. The street does not yet sell territory |

## Fixes (prioritised, max 6)

1. **Lane builder: bring the marking payoff into frame.** Anchor the wisps and the spray cloud about 0.4 to 0.6 m above the post cap, and size them for the Explore camera. On a Spray, add a short camera tilt-up and settle. Acceptance: in every rescue and rival shot, all wisps and the cloud are fully in frame.
2. **Lane builder: restore the hold ring and add a number on hit.** Draw the 1.2 s fill ring at the post (it is absent in rescue-01). On `ScentChanged`, pop "48 → 90" in the Scent band colour, and show wisps sprouting one by one (2 → 4). Do the same for Over-mark −10 and Counter-Spray −30, with a puff at least 3× bigger, in the rival clowder's colour.
3. **Lane builder (HUD): put district influence on the street.** Add a slim bar under the Patch tag: Bell gold against the rival clowders, the crown at the end lighting at 100. It ticks and pulses on `InfluenceChanged` and fades after 4 s, with a short "Hidamari 95 → 100" card. Today the owner's core loop (raise ours, lower theirs) cannot be seen.
4. **Lane builder: show the Boss coming down.** Daifuku's climb happens off-screen (rescue-03/04 show only an edge badge that drifts from top-left to mid-left to bottom-left). Place S_M where the yard framing sees it, or do a 2 to 3 s soft look-at with control kept, as plan §2.2 says ("in view"). Pin the edge badge to the screen edge toward him with an arrow, and give Daifuku Boss presence: a larger silhouette, a crown pom and puffs.
5. **Lane builder: dress the bare stretches.** Use the 01 kit (posters, pots, laundry and wires, drains, moss, a bike or crates) on both sides about every 8 m at vantages 0 and 4. Texture the Den wall and the wall-top ribbons. Give the High Road side a back fence, sheds and house backs instead of an open lawn. Dress Haru's garden behind the gate. Fix the dusk wall blotches. Put two or three lamps in the vantage-0 frame so the lamp wave reads. Fix the pot clipping.
6. **Territory sim: give the HUD deltas to animate.** `InfluenceChanged` carries only `by_clowder` (the new values). Add `from`, `delta` and a `cause` (`patch`, `kind`) so fixes 2 and 3 can show "+5 ours / −x theirs" without diffing snapshots. Also expose the rival clowder's loss on Over-mark and Counter-Spray in the same event. Small API change; update `API.md` and its tests.

## Notes (no action this round)

- LPY's post is `gatepost` in the sim, but the street draws the M0 lantern. Pick one name before M5's Turf Board copy is written.
- The Outsiders wisp colour is still a placeholder. The art director will set it before M5 (challenger stakes).
- The sniff tape star (sniff-02) is small. Consider a scent-outline flash on discovery, as plan §2.2 says.

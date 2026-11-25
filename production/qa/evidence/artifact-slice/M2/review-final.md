# M2 review, final (round 3 of 3): lane, exploration, territory

Reviewers: creative director, art director, game designer (one combined pass). Date 2026-11-25.
Inputs: `review-round1.md` (fix list, scores); this folder's refreshed `README.md`, `results.json`, both vantage sheets and the
single vantages 4-day and 5-dusk, the rescue (00 to 06), rival (00 to 03, 05), dusk (02, 04), highroad-01 and sniff-02 shots;
`src/sim/territory/API.md`. Commits read: `94b9e8a` (sim events) and `b3510cf` (lane fixes). Territory unit tests re-run here:
**46/46 pass** (43 in round 1, plus the new influence-delta tests).

Nothing more is fixed in M2. Open items carry into M3+.

## Verdict: GO WITH FIXES (carried)

Round 1 said the systems were ready but the street did not sell territory. That has mostly changed. The rescue now reads
end to end: the hold ring, the cloud at the cap, "48 → 90", wisps growing from 2 to 4, the bar filling, the crown lighting and
"Hidamari 95 → 100". The rival flow shows the loss too ("−10", "−30", "10 → 70", "Hidamari 0 → 25"). Ours against theirs is
now visible on the street. Measurable acceptance still holds: 4 bot seeds, 0 camera-in-geometry frames, cat in frame 99.36 to
99.91%, no console errors. Draw calls peak at 314 against a budget of 350.

What is still weak: **the Boss coming down is still not properly seen.** In rescue-04 Daifuku's head and crown are above the
frame. In rescue-05 his drop to S_M is hidden behind the lantern, and only a crown pip shows. No camera ease toward him can be
seen. Vantage 4 is still a bare corridor. The laptop frame log is still pending. None of these blocks M3 from starting, but
the Boss framing has to land before the M3 Boss encounter is judged.

## Round-1 fixes

| # | Fix | Status | Evidence |
|---|---|---|---|
| 1 | Bring the marking payoff into frame | **PARTLY** | The rescue and Counter-Spray clouds and numbers are in frame (rescue-02, rival-02/03/05). The four gold wisps at 90 touch the top edge in rescue-03 to -06. In rival-00/01 the sage wisps are cut off at the top right and run into the day clock. No tilt-up can be seen on any Spray. The acceptance was "every rescue and rival shot", so this is not met |
| 2 | Hold ring and a number on hit | **DONE** | The ring fills around the E key (rescue-01 now differs from -00). "48 → 90", "−10", "−30" and "10 → 70" appear in the Scent colours. The wisps grow 2 → 4 (rescue-02 → -03). The Counter-Spray cloud is well over 3× the old puff. Nits: the ring is on the key, not at the post; the first Counter-Spray (rival-02) shows no "−30"; the Claim cloud (rival-05) is sage, not Bell gold |
| 3 | District influence on the street | **DONE** | There is a slim bar under the Patch tag. The crown is unlit at 95 and lights at 100 (rescue-03). The cards "Hidamari 95 → 100" and "Hidamari 0 → 25" fade out by rescue-05. Rival influence shows as a sage segment (rival-00 to -05). Nit: our segment in rival-05 reads cream, not Bell gold |
| 4 | Show the Boss coming down | **PARTLY** | Daifuku now has Boss presence: larger, with the crown pom (rescue-04/06, sniff-02). The badge has an arrow, but it floats mid-screen in rescue-04 instead of sitting on the screen edge. His climb and drop are still not framed: in rescue-04 his head is out of frame, and in rescue-05 he is behind the lantern. No look-at can be seen in rescue-03. No steam puffs are visible |
| 5 | Dress the bare stretches | **PARTLY** | The Den wall now has stone and moss texture (vantage 2, sniff-02). The High Road side now has house backs, fences, hedges and a vending machine (highroad-01). Haru's garden has shrubs, hydrangeas, a pot, a laundry pole and a tree (dusk-04). Two lamps are lit in dusk-02. The dusk wall blotches now read as a plaster wash. Still to do: vantage 4 is two pots on a bare corridor, and vantage 0 is thin. The pot at the rival start is only dithered and still covers Mikan (rival-00/01) |
| 6 | Sim: deltas for the HUD | **DONE** | `ScentChanged` carries `from/to/delta/cause` plus `previous_clowder`. `InfluenceChanged` carries per-Clowder `from/delta`, a `cause{kind, patch}` and `scent[]`. The rival's loss arrives in the same event. `API.md` is updated and new tests pass |

Round 1 also asked for the hedge blocking the ribbon (highroad-01, sniff-00) to be fixed. It is fixed: Mikan is clear on the coping.

## Scores

| | Round 1 | Final | Why |
|---|---|---|---|
| Look | 6 | **7** | The Den wall, the High Road backs, Haru's garden and the dusk lamps all hold the M0 look now. Vantage 4 is still a bare fence-and-wall corridor, and the pot clipping is still there |
| Territory readability | 4 | **6.5** | Influence and the rival share are now on the street, the crown lights at 100, and the cards name the district. The Boss window still does not show its Boss: the payoff of "raise ours to 100" is a crown pip behind a lantern |
| Marking feedback | 4 | **7** | The ring, the numbers, the clouds at the cap and the wisps growing and withering make the marking verbs feel like they land. Left over: wisps clip at the top edge in close framings, "−30" is missing on the first Counter-Spray, and the Claim cloud is the wrong colour |
| Navigation | 7 | **7.5** | The hedge no longer blocks the ribbon, and the lamp wave reads. The pot still clips at the LPY wall, and the camera ease toward the Boss cannot be seen |
| Overall | 5.5 | **7** | The street now sells the territory loop. The Boss descent and one bare stretch are what is left |

## Carry into M3+ (max 6)

1. **Boss descent framing (M3, before the Boss encounter is judged).** Do a 2 to 3 s soft look-at with control kept. Place S_M in front of the lantern, not behind it, keep Daifuku whole in frame from coping to drop, and pin the badge to the screen edge. Acceptance: rescue-04 and -05 show his full silhouette and crown.
2. **Headroom for wisps and the challenger.** Keep the wisps at 90 (four of them) inside the frame in close and wall-hugging framings (rival-00/01, rescue-03 to -06), and keep them clear of the day clock. Stop the challenger on the fence top being cut off at the top right. Make the Spray tilt-up visible or drop it.
3. **Dressing and clipping.** Dress vantage 4 and the rest of vantage 0 with the 01 kit about every 8 m. Move the pot at the LPY wall or give it collision; dithering alone does not fix it.
4. **Marking polish.** Make the Claim cloud and our bar segment Bell gold. Show "−30" on every Counter-Spray. Clear the "Fight to clear, spray to claim." toast once the Claim lands. Decide whether the hold ring sits at the key or at the post, and record the choice.
5. **Laptop frame log.** It has been pending since round 1. Capture it before M3 adds combat load. In dusk the shadow pass alone is 159 draw calls.
6. **Naming and colour (before M5 copy).** Choose `gatepost` or lantern for LPY. Set the Outsiders wisp colour (still `#4E9DA6`). Add a scent-outline flash on sniff discovery; the tape star in sniff-02 is still small.

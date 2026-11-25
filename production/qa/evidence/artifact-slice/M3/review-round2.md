# M3 review, round 2 of 3: Rivals, the Verdict, the Rivals board

Reviewers: creative director, art director, UX designer, game designer (one combined pass). Date 2026-11-25.
Inputs: `review-round1.md` (6 fixes); this folder's `README.md` "Round 1 fixes"; every re-shot PNG in this folder (board rest,
focus Togemaru/Daifuku/silhouette, hover, full card, Bell Hige/Kinako/B, Lane B/C, all eight Verdict shots incl.
`verdict-l2-bribe` and `verdict-combat`, closing B/C); commit `be0cd68` (code); owner direction C1, C4, C6 and the
2026-11-24 declutter (`design/reviews/user-comments-2026-11-24.md`); patent guardrails `design/legal/nemesis-patent-analysis.md` §5.

## Regression run (prototypes/artifact-slice)

| Command | Result |
|---|---|
| `node --test 'tests/unit/**/*.test.mjs'` | **173/173 pass**, 0 fail |
| `node tools/nemesis-run.mjs --branch all` | A Truce G 0 R 38 · B Crew G 22 R 23 Loyalty 44 · C Gone G 25 R 10 (same end states as round 1) |
| `node tools/build.mjs` | OK, `game.js` 853,619 bytes (was 844,414 at `fa954c8`) |
| `node tools/publish-check.mjs` | OK (65 files). `publish-check.png`: Lane renders normally, HUD and chapter bar intact |
| `node tools/publish-check.mjs '?chapter=combat'` | OK (65 files). `publish-check.png` matches a fresh render of `fa954c8` frame for frame (built in a throwaway worktree, since removed) |

The shared-file changes are additive: `catAnim.js` adds the `routed` posture and `setPosture` (the default pose is unchanged),
`cat.js`/`index.js` expose `setPosture` and `bones`, and in `combat.js` every new path is guarded by `vstage`, which is set only
by the M3 Verdict hook. **No regressions found.**

## Round 1 fixes: did they land?

| # | Fix | Landed? | What the evidence shows |
|---|---|---|---|
| 1 | Recruit tell is honest | **Yes** | `verdict-l2-right`: the greyed card and the bubble both say "Turns its tail to the bell.", with a turned-tail glyph, and Goma turns his back. `verdict-l2-bribe`: "Eyes on the fish." on an open offer. Small leftover: in `verdict-l1-left` the Chase Off tell bubble overlaps the Recruit card's left edge by about 25 px |
| 2 | Legal Life 2 Bribe from the sim | **Yes** | The `test_l2_kagi_rout` offer gives Fair 96 open, Feast 192 greyed "Stash short: 150 of 192", and Crew 4/6, as in mock 07. The gate tests cover Goma and the challenger (`recruit_not_slice`), Togemaru in Life 2 (OR-15) and Daifuku's teeth |
| 3 | Illegal fallback removed, record fixed | **Yes** | `seeds=1` is gone. The fallback reads `recruitable_slice`. The README gives the DR-01 reason. The Bribe shot is now on Kagi. **New defect:** Kagi is also standing on the wall in the background of that shot, so there are two Kagis on screen. This is a test-only start, so players never see it |
| 4 | Verdict staged on the cat | **Partly** | The HUD, lock ring, chevrons, effects and other cats are gone; it is a clean two-shot; Mikan is clear of Chase Off; the hint is a 5-word bubble. **But** (a) in `verdict-combat` Goma's face is pitched into his chest: his eye sits at the chin, the mouth is inside the head, and the body shows split seams. `verdictFrame()` calls `T.cat.lookAt(M.clone().lerp(S, 0.6))`, which aims the head at a point on the ground 0.7 m ahead, on top of the posture's head 0.34 and the 1.06/0.9/1.06 root squash. (b) The Scar mark is a 0.15 cream triangle on the **head** bone with `depthTest: false`. It reads as a paper party hat on Togemaru and Goma (`verdict-l1-none`, `l2-up`, `combat`) and as a sticker on the back of Goma's head (`l2-right`). It does not read as a notched ear. The street routed pose (Kagi in `l2-bribe`) reads well |
| 5 | Board legibility | **Yes** | All six silhouettes stand in clear view with no overlaps (`board-lane-rest`). Each arrow is a single curve with no shared kink. Ties are a line in the focus card ("Old Gang: Hige · the Bell", "Old Boss: Daifuku · the Lane"). The B knot card is named. Minor: arrows start at the head and cross the face (Hige, Kinako), and the six silhouettes are all the same pose |
| 6 | Show the memory | **Yes** | The full card lists all five history entries. Hige reads "Before you". The closing subtitles no longer repeat their headlines. Minor: pinned-first order reads L1 D1, D2, D1, D2, D2 with no pin glyph, so it looks mis-sorted. On closing-C the red stamp still repeats the headline "Run out of town" |

## Patent check (§5)

**Still a pass.** G1/G2: the invariant tests are green, including the new one where a Bribe on Kagi changes only Kagi. G3/G6: B
and C leave Togemaru's spot as a card and promote nobody. G4: Togemaru's "Old Boss: Daifuku" line in Bell-B is read from his
own record, and nothing Daifuku-side was added. G8: the subtitles come from the cat's own record. G12: no banned terms on
screen. The stage only reads the sim's Scar list and writes no cat record.

## Scores

| | /10 | Round 1 | Why |
|---|---|---|---|
| Board look and calm | 8 | 8 | The silhouettes now read as cats, and the arrows are clean curves. The same-pose silhouettes and arrows over faces hold it at 8 |
| Board usability | 8 | 7 | Ties now sit where you look (the focus card). "Before you" replaces D0, and B's card has a name |
| Standoff | 7 | 7 | Unchanged (mock 05 drama stays in M7 polish) |
| Verdict | 7 | 6 | It is now honest and legal. The staging fails on the model: a mangled cat in combat and a Scar that reads as a hat |
| Memory / rival feel | 8 | 7 | Five history lines, honest labels and closing cards that add information |
| Overall | 8 | 7 | Five of six fixes landed cleanly and nothing regressed. The cat being judged must look right before publish |

## Verdict: GO WITH FIXES

## Fixes (max 4)

1. **MUST before publish. Combat Verdict pose** (`src/entries/combat.js` `verdictFrame`). Aim `lookAt` at Mikan's head height
   (e.g. `M + (0, 0.5·scaleK, 0)`) or pass `null`, not at a ground point. Check whether the non-uniform root squash in
   `stageSubject` is what splits a combat Fighter's keyline shells. If it is, drop the squash for combat and rely on the
   `routed` crouch. Also clear the red enemy rim. Re-shoot `verdict-combat`. Acceptance: Goma's face reads at a 3/4 view, the
   eyes sit above the muzzle, and there are no seams.
2. **MUST before publish. The Scar has to read as a notch** (`src/ui/verdict-stage.js`). Attach the mark to the camera-side
   `earL`/`earR` bone (both exist in `assets/mesh/cats.json`), not to the head. Make it about 0.06 instead of 0.15, with no cream
   fill (an ink V and a crimson cut on the ear's own colour), and `depthTest: true` so it never shows through the skull. Re-shoot
   `verdict-l1-none`, `l2-up`, `l2-right` and `verdict-combat`. Acceptance: an art director reads "notched ear" in each shot.
3. **Can carry over. Verdict screen tidy.** Hide the Lane's wall Kagi when Kagi is the judged cat (`verdict-l2-bribe`). Keep
   the tell bubble clear of the Recruit card (`verdict-l1-left`). Per the declutter request, merge the first-Verdict hint
   and the strip into one line on the first Verdict.
4. **Can carry over. Memory polish.** Mark pinned history entries with a pin glyph or a rule under the pinned block, so
   the full card does not read as mis-sorted. Drop the closing-C stamp text, or make it a glyph, so the headline is
   not said twice.

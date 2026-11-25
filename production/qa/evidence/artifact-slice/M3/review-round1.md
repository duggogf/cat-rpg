# M3 review, round 1 of 3: Rivals, the Verdict, the Rivals board

Reviewers: creative director, art director, UX designer, game designer (one combined pass). Date 2026-11-25.
Inputs: plan §1.1 #3–#4, §2.1–§2.5, §3.4 and the §5 M3 row; owner direction C1, C4, C6 and the 2026-11-24 declutter
(`design/reviews/user-comments-2026-11-24.md`); patent guardrails `design/legal/nemesis-patent-analysis.md` §5; mocks
`design/previews/05-rival-standoff.png`, `06-fence-line.png`, `07-verdict.png`; this folder's 25 PNGs, `README.md`,
`results.json`, `combat-verdict.json`. Re-run here: `node --test 'tests/unit/nemesis/*.test.mjs'` → **58/58 pass**;
`node tools/nemesis-run.mjs --branch all` → A, B and C all reach the end of the run with the expected state (A Truce G 0 R 38 · B Crew Loyalty 44 · C Gone).

## Verdict: GO WITH FIXES

The rules are right and the measurable acceptance is met. The arc runs as scripted: flee on L1D1, the memory line
"I ran yesterday. Not off my own post, Collar." with its 1 s lock, the G 43 < 45 gate, the notch, and three branches that
store the right state. The patent invariant tests cover Verdicts, join-ins, anger, losses, 1,000 seeded encounters
and read-only display. The board opens in 214 ms the first time and 8 ms after that (budget 300), within 58 calls and
140k triangles. The two tag checks pass. The board is the owner's C6 scene: a deep-perspective alley, the Boss on the far
perch with his puffs, the gang down the steps, no fact column and no influence bar.
**What fails is the honesty and staging of the Verdict.** Its Recruit tell contradicts its own greyed card. The Bribe shot
shows a state the rules forbid. And the in-combat Verdict never shows the cat being judged. Fixes 1 to 4 must land and the
verdict shots must be re-taken before M3 closes.

## Scores

| | /10 | Why |
|---|---|---|
| Board look and calm | 8 | Reads as one staged alley at Dusk gold: names only at rest, faint arrows, three steam puffs, Kagi's sprig, unmet cats in the shade. It is calmer than mock 06 and closer to the owner's declutter. Against it: the two upper-step silhouettes stack on top of each other and sit half behind the stair walls and the bushes, and the left mid one hides behind the shrub, so "who is still out there" reads as a smudge. Daifuku is small for a Boss at the vanishing point (his crown and puffs do the work) |
| Board usability | 7 | The 120 ms hover works, keys follow step order, the focus lifts with a rim, the others dim, and the focus card carries the role tag. Against it: the answers-to arrows run from each cat to one shared kink on the middle step and end in empty air beside Daifuku (rest, focus-togemaru, bell-kinako, bell-B), so "who answers to whom" is hard to read. Cross-scene ties appear as a tiny chip under a header tab (Old Gang, Old Boss, Rival), far from any cat. Hige's card reads "D0". The B legend card has no name (C's has one) |
| Standoff | 7 | It cites yesterday in the cat's own words, with a "remembers" glyph and the Fight lock. The name card matches mock 05. But it is flat beside that mock: no clash plates, no spotlight, no title stamp, and Mikan's back fills the left third |
| Verdict | 6 | The three cards sit on the compass (Up Nose-Touch, Left Chase Off, Right Recruit). The Nose-Touch tell is honest (Tail still), Chase Off shows the turn-away, Life 1 is "Free", Crew counts are right, and it is hold-to-decide. **Defects:** (a) in `verdict-l2-right` the card says "Turns its tail to the bell." while the tell bubble says "Eyes on the fish.": `verdict.js:141` ignores `r.tell`. (b) `verdict-l2-bribe` is Goma with Recruit open: the UI fallback (`seeds=1`) shows a state the sim forbids. (c) `verdict-combat` keeps the combat HUD, the lock ring and the ally chevrons; the cat being judged is hidden behind Mikan and a dithered ghost. (d) Togemaru stands in a neutral pose with no visible fresh notch, though plan §1.1 #3 says the Verdict "shows on his model (a Scar)". (e) The first-Verdict hint is 8 words of bare outlined text over the strip (the rule is 6 words or fewer, in a bubble) |
| Memory / rival feel | 7 | The Declaration card ("Sworn Rival · L1 D2 'This notch? Yours.'"), the closing cards, the legend card on his old spot, the truce counter ("8 days left"), Daifuku as Furious and "Angry at your marks in his Lane", and Hige's own-history line all sell C1's "rivals remember". But the full Rival card shows **one** history line, while the sim returns five (`rivalCard('togemaru').history`: first sniff, notch, fled, routed, nose). The best evidence of memory is dropped. The closing cards repeat their headline as the subtitle |
| Overall | 7 | The systems and the board are ready. The Verdict screen does not yet tell the truth or show the cat |

## Ruling 1: Recruit greyed for every Life 2 cat in normal play

**This matches the design. It is not a sim bug.** The sim greys Recruit for each cat by `recruitable_slice`
(`town.js:454`), not by Life. Nemesis §3.1 (DR-01) lists exactly three slice recruitables among the Rivals:
Togemaru (at any time, OR-15), Kagi, and Daifuku at Regard ≥ 50. "Every other Rival shows Recruit greyed, with the tell
'turns its tail to the bell'" (also §642). The showcase's Recruit is branch B, on Togemaru in **Life 1**, free (Crew §3.4.1
rule 3, PP-07, plan §2.3). In Life 2 the only Verdicts in normal play are Goma, other Toughs and the challenger, and none of
them can be recruited: plan §2.2 at 11:15 says "Recruit halftoned, 'turns its tail to the bell'", and §2.5 puts Bribes OUT.
Kagi does not fight in the slice, and Daifuku's bout ends at the phase break without a Verdict. So a normal run never shows the Bribe row, and that is correct.

**What is wrong is the evidence and the fallback.** (1) `verdictFacts` (`verdict.js` ≈ lines 82–86) opens Recruit with
Fair/Feast for *any* non-boss Life 2 cat when no sim offer exists. `verdict-l2-bribe` was shot that way, on Goma, which the
rules forbid. (2) The README reason "no Life 2 recruit in the slice" is the wrong reason. Togemaru, Kagi and Daifuku can be recruited in Life 2.
(3) The sim gives `stash_short` and `recruit_boss` the tell `bares_teeth`. Being short of Morsels is not the cat refusing:
keep `eyes_lean` for `stash_short`, and use `bares_teeth` only for the Grudge/Regard and Boss gates. Changes: fixes 2 and 3.

## Ruling 2: Ohagi, Kuri and Sasa as silhouettes on L2D2

**Correct. Keep them.** A cat is discovered only by meeting it in an encounter or by a 1.0 s sniff within 10 m (Nemesis
overview; plan §2.4). The script never meets or sniffs any of the three. Kuri's Persimmon Alley is skyline only, and Ohagi is a
procedural Captain shown on the board only. Plan §2.1 says Sasa is "met only as a silhouette", and the M3 acceptance *requires*
"Kinako shows none while Sasa is unmet". That check passes because Sasa is a silhouette. Mock 06 shows a later save as
illustration and does not set the slice's discovery state. Two conditions: a silhouette has to read as a cat (fix 5), and the combat
sandbox (which fights Sasa) must not write discovery to the main save.

## Patent check (§5)

Pass at this milestone. **G1** and **G2** are covered by the loss and anger invariant tests. **G3/G6**: on Chase Off his spot
becomes a legend card, and Goma is not promoted (board-lane-C). **G4**: Old Gang is shown only from Hige's own Memory ("Sat on
Daifuku's wall once."), and Daifuku has no line aimed at the defector. **G7**: Togemaru's join comes from his own Rival tag, and
the challenger is untouched (invariant test at line 35). **G8**: every line comes from the speaker's own history. **G12**: no
player-facing "Nemesis", vendetta or follower (the internal `pose: "nemesis"` key is fine). One watch item: the challenger's Rival
tag points at Togemaru in A and at Goma in B and C. That is a newcomer generated from town state, which G6 allows, and no existing cat
changes. Keep it that way.

## Fixes (max 6)

1. **Presentation: make the Recruit tell honest.** In `verdict.js:141`, render from `f.recruit.tell`:
   `tail_to_bell` shows a turned-tail glyph and "Turns its tail to the bell.", and the 3D subject turns its back.
   `bares_teeth` shows a teeth glyph and the reason text. Only `eyes_lean` shows the eyes with "Eyes on the fish/bell". Re-take
   `verdict-l2-right` and `verdict-combat`. Acceptance: the bubble and the greyed card never disagree.
2. **Nemesis sim: a legal Life 2 Bribe case and honest tells.** Add a test-only start, `createTown({start:
   'test_l2_kagi_rout'})` (Kagi routed in Life 2, Stash 150, Crew 4/6), so the Bribe row comes from a real offer that matches
   mock 07: Fair 96 open, Feast 192 greyed "Stash short". Map `stash_short` to `eyes_lean`. Add a gate test: Goma and the
   challenger in Life 2 give `recruit_not_slice`, and Togemaru in Life 2 is open with a Fair/Feast price (OR-15).
3. **Presentation: remove the illegal fallback and fix the record.** Delete the Life 2 open-Recruit branch from
   `verdictFacts`; the fallback must use the sim's recruitable list or grey Recruit. Re-shoot `verdict-l2-bribe` from fix 2's
   fixture on Kagi. Change the README reason to "Goma is not slice-recruitable (Nemesis §3.1 DR-01)".
4. **Presentation: stage the Verdict on the cat.** When combat ends with a Verdict, hide the combat HUD, the lock ring and the
   chevrons, and cut to the Verdict vantage: the subject in the middle ground in a routed pose (low, ears back, as in mock 07)
   with the **fresh Scar visible**, and Mikan clear of the Chase Off card. Replace the first-Verdict hint with a bubble of 6
   words or fewer ("Chasing off is for good."), placed above the strip.
5. **Presentation: board legibility.** Move the upper-step and shrub-side silhouette anchors so that no silhouette is more than 20%
   hidden or overlaps another. Draw each answers-to arrow as one smooth curve from the cat to its superior's ribbon (no shared
   kink). Show cross-scene ties as a line in the focus card ("Old Gang: Hige · the Bell") in place of the chip under a tab. Put the name
   on the B legend card, as on C's.
6. **Nemesis sim + presentation: show the memory.** Sim: an authored pre-game entry gets the day label "Before you", not
   "L1 D0" (`historyLine`). Presentation: the full Rival card lists every `history[]` entry, pinned first (Togemaru: first sniff,
   notch, fled, routed, nose), and the closing cards use a subtitle that does not repeat the headline (e.g. B: "Aloof. Notched.
   On the Posse bench."). Re-take `board-lane-full-card`, `board-bell-focus-hige` and `closing-B`/`-C`.

## Notes (no action this round)

- Standoff drama (clash plates, spotlight and title stamp as in mock 05) is a polish item for M7, not a blocker.
- `pause-rivals` says "every cat in town you have met", but the board also shows the unmet as silhouettes. Consider "every cat in town, one gang at a time".
- The combat Verdict fight ran at 352,800 triangles. That is under combat's budget, not the board's; noted only.

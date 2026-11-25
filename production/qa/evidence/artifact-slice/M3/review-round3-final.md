# M3 review, round 3 of 3 (FINAL): Rivals, the Verdict, the Rivals board

Reviewers: creative director, art director, UX designer, game designer (one combined pass). Date 2026-11-25.
Inputs: `review-round1.md`, `review-round2.md`; this folder's `README.md` ("Round 1 fixes", "Round 2 fixes"); the re-shot
PNGs (`verdict-combat`, `verdict-l1-none/-up/-left/-right`, `verdict-l2-up/-right/-bribe`, `board-lane-full-card`,
`closing-B`, `closing-C`), each viewed at full size and zoomed 3x on the judged cat's face and ear; commit `25dfcbb`
(`combat.js`, `shaders.js`, `verdict-stage.js`); owner direction C1, C4, C6 and the declutter
(`design/reviews/user-comments-2026-11-24.md`); patent guardrails `design/legal/nemesis-patent-analysis.md` §5.
This is the last round. No fix iteration follows: the open items below are carry-overs to M7 polish.

## Regression run (prototypes/artifact-slice)

| Command | Result |
|---|---|
| `node --test 'tests/unit/**/*.test.mjs'` | **173/173 pass**, 0 fail |
| `node tools/nemesis-run.mjs --branch all` | A Truce G 0 R 38 · B Crew G 22 R 23 · C Gone G 25 R 10 (same end states as rounds 1 and 2) |
| `node tools/build.mjs` | OK, `game.js` 856,494 bytes (853,619 in round 2) |
| `node tools/publish-check.mjs` | OK (65 files) |
| `node tools/publish-check.mjs '?chapter=combat'` | OK (65 files) |

The working tree is clean after the runs (`publish-check.png` is gitignored). Every new combat path in `25dfcbb` is behind
`vstage`, and the notch uniform is off by default (`uNick.x = 0`) and reset on undo, so cats outside a Verdict draw as
before. **No regressions found.**

## Round 2 must-fixes

| # | Fix | Landed? | What the evidence shows |
|---|---|---|---|
| 1 | Goma's combat Verdict pose, face and seams | **Yes** | `verdict-combat`: Goma stands on his mark at a 3/4 view facing Mikan. His eyes sit above the muzzle under an angry brow, and the head dips without folding into the chest. At 3x zoom there are no cream seams on the flank or paws, and the keyline is Ink, not enemy red. The sim's routed bolt no longer walks him in place, because `present()` feeds both staged cats an idle state on their marks. The crouch reads as beaten but not collapsed |
| 2 | The Scar reads as an ear notch | **Yes, small** | The head sprite is gone. A shader V is cut into the outer edge of the lens-side ear, with a crimson rim. It is depth-tested and lit with the ear, so it shows on Togemaru (`l1-none`), on Goma at 3/4 (`l2-up`, `combat`) and on the back of his ear when he turns away (`l2-right`), and it never shows through the skull. At 3x an art director reads "fresh notch". At 1080p it is about 10–15 px, so it reads only when you look for it. On Togemaru's black coat the crimson rim does all the work, as the README notes. It meets the acceptance, but it is not yet a beat |

## Carry-overs from round 2

| # | Item | Landed? | Notes |
|---|---|---|---|
| 3 | Verdict tidy | **Yes** | `l2-bribe`: one Kagi (the wall sitter has stepped out); Fair 96 open, Feast 192 greyed with "Stash short: 150 of 192", Crew 4/6, "Eyes on the fish.". `l1-left`: the tell bubble sits clear of the Recruit card. The first Verdict uses one strip line, "Chasing off is for good. Every choice clears the post. Then spray it." (13 words, one bubble, which meets the declutter ask) |
| 4 | Memory polish | **Yes** | `board-lane-full-card`: crimson pins on the two pinned entries and an equal gap on the other three, so the list no longer reads as mis-sorted. `closing-C`: the stamp is the Chase Off glyph in stamp red and the headline is said once. `closing-B`: "Aloof. Notched. On the Posse bench." |

New small findings (none block): in the street Verdict the 3D cats do not act out the previewed tell. On Chase Off the
bubble says "Ears drop. You turn away." but Mikan and Togemaru look the same as in `l1-none`, and the Chase Off card covers
Mikan's tail and ear. Goma's back view (`l2-right`) is brown on brown: the curled tail has no value contrast and the
shape reads as a loaf. The full-card banner clips the board title ("Hidam…"), and the card's lower half is empty. The
`closing-B` portrait has no bell, though the headline is "Wears the bell now". `nemesis-run` still prints "(chip under
bell)", a stale label from before round 1.

## Owner direction

C1 (rivals remember; silhouettes until discovered; tags only between discovered cats; anger shown) holds on the board
and in the Sniff cards. C4: exactly three Verdicts, Recruit priced as a bribe in Life 2 and greyed honestly where the
rules forbid it, Chase Off "for good", Nose-Touch "10 days" with the join-in line. C6: the deep-perspective alley staging
is unchanged and calm. Declutter: the Verdict now carries three cards, one tell and one strip line.

## Patent check (§5)

**Still a pass.** Round 2 is presentation only. The stage reads the sim's Scar list and writes no cat record. Hiding the wall
Kagi and the other fighters is camera dressing. The notch is confined to the judged cat, which §5 lists as not needed
("changes confined to the cat the player fought"). G1/G2 invariant tests are green. G3/G6: B and C leave Togemaru's spot as
a card and promote nobody. G4: the "Old Boss" line comes from Togemaru's own record. G8: the closing subtitles come from
his own history. G12: no banned terms on screen.

## Final scores

| | /10 | R1 | R2 | Why |
|---|---|---|---|---|
| Board look and calm | 8 | 8 | 8 | A calm, staged alley at Dusk gold. The same-pose silhouettes and the arrows over faces keep it at 8 |
| Board usability | 8 | 7 | 8 | Hover, keys, ties in the focus card and a full history card with pins all work. The banner clipping the title is cosmetic |
| Standoff | 7 | 7 | 7 | Unchanged. The memory line and the 1 s lock are right, but it is flat beside mock 05 |
| Verdict | 8 | 6 | 7 | Honest, legal and staged on a cat that now looks right, with a real ear notch. The notch is small, and the 3D cats do not act out the tells |
| Memory / rival feel | 8 | 7 | 8 | Five history lines with pins, "Before you", closing cards that add information, and the Scar on the model |
| **Overall** | **8** | 7 | 8 | Both must-fixes landed, both carry-overs landed, and nothing regressed across three rounds |

## Decision: **GO** for publishing M3 to the showcase

## If there were a round 4 (carry-overs to M7 polish)

1. **Make the Scar a beat.** Grow the notch to about 0.6 of the ear's width, flash the crimson rim for 0.3 s when the Verdict
   opens, and keep the notch on the cat's board and street models afterwards. Lifts Verdict 8 → 9, Memory 8 → 9.
2. **Act out the tells in 3D.** Mikan turns away and the judged cat's ears drop on Chase Off. Nose-Touch stills the tail.
   On Recruit the cat's eyes go to the bell. Keep the Chase Off card off Mikan in the street two-shot. Lifts Verdict 8 → 9.
3. **Standoff drama from mock 05:** clash plates, a spotlight and a title stamp, with Mikan's back no longer filling a
   third of the frame. Lifts Standoff 7 → 8 (Overall toward 9).
4. **Board finish:** varied silhouette poses, arrows that start from the ribbon and not across the face, the full-card
   banner kept clear of the board title, and the card's empty lower half used. Lifts Board look 8 → 9.
5. **Readable back view and matching portraits:** a lighter tail tip or rim on brown coats in the turned-away pose
   (`l2-right`), a bell on the branch B portrait, and the stale "chip under bell" label removed from `nemesis-run`. Lifts
   Memory / rival feel 8 → 9.

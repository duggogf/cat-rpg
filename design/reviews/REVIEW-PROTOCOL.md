# Design Review Protocol — Cat RPG

The first drafts in `design/` were written in parallel by separate specialists who
could not see each other's work. This protocol turns them into a design the
directors are satisfied with, through critique → ruling → revision rounds.

## Standing authorisation

The user has pre-approved this whole review pass. Reviewers and revisers write
directly to the paths their brief names, without asking. Nobody commits or
pushes. Nobody edits a file their brief does not name.

## Canon

`design/creative-brief.md` is binding canon, then `design/gdd/game-pillars.md`.
From round 1 onward, `design/reviews/round-N/director-rulings.md` overrides both
where it says so (the creative director then folds rulings back into the brief).

The user's own priorities, in their words: the **nemesis** and **combat** systems
are what should make the game stand out; the unique selling point is the **Dual
Story Progression** (the owner's human life told wordlessly, in parallel with
the cat's); combat is "FF7 Remake + Pokémon" — real-time, 1 leader + 3
interchangeable recruited cats with teachable moves — "stylized with cool vfx,
action lines, screen shake, etc., to amplify the combat feeling to maximum".

## Reading large docs

Most docs are 90–155 KB. Grep the headings first (`^#`), then Read in ranges
with offset/limit until you have covered everything your brief requires. A
review that has not read the whole target doc must say which sections it skipped.

## Critique output (reviewers)

Write to the path your brief names. Structure:

1. **Verdict** — one of `APPROVED`, `APPROVED WITH MINOR FIXES`, `NEEDS REVISION`,
   `MAJOR REVISION NEEDED`. Be a hard marker: a first draft that is merely
   competent is `NEEDS REVISION`. Approve only what you would stake your role on.
2. **What is strong** — brief; name what must survive revision.
3. **Issues** — numbered, each with: severity (`BLOCKER` / `MAJOR` / `MINOR`),
   the section it lives in, what is wrong and *why it matters to the player*,
   and a concrete proposed fix (a rule, a number, a cut) — not "consider".
4. **Cross-doc conflicts** — contradictions with other docs or the brief,
   quoting both sides, with a recommended resolution.
5. **Needs director ruling** — anything only the creative director can settle.
6. **Cut list** — scope you would remove. First drafts overbuild; say what to
   kill.

Critique the design, not the prose. Hunt for: dominant strategies, exploits,
death spirals, boring optimal play, rules that contradict each other, numbers
that do not produce the stated targets, features that serve no pillar, anything
generic that could be in any game, and anything that would not survive contact
with a real player's hands.

## Revision output (revisers)

Edit the target doc in place. Address every BLOCKER and MAJOR issue and every
director ruling that touches the doc; fix MINORs unless there is a reason not
to. Prefer cutting and simplifying to adding. Then append a dated entry to a
`## Revision Log` section at the end of the doc: per issue ID, `FIXED` (how),
`REJECTED` (why — reviewers will re-check this), or `DEFERRED` (to whom).
Keep the doc's 8 required GDD sections intact.

## Convergence

A doc is done when its reviewer(s) return `APPROVED` or `APPROVED WITH MINOR
FIXES`. Maximum three rounds; anything still disputed after round 3 is listed in
`design/reviews/unresolved.md` for the user rather than papered over.

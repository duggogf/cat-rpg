# Cat RPG — Session Handover

**Written:** 2026-11-24 · **Branch:** `design/cat-rpg-gdd` (pushed; no pull request opened)
· **`main`:** the untouched Claude Code Game Studios template baseline

Read this file first in a new session. It says where the project stands, what the
user has decided, how they want the work run, and what to do next.

---

## 1. What this project is

**Cat RPG** (final title) is a third-person action RPG in which you play a pet cat
who becomes an alley boss. Four key features, in the user's words: a cat nemesis
system, territory management with a food-tax economy, intensive cat combat
(FF7 Remake structure + Pokémon-style swappable, teachable companions), and the
unique selling point, **Dual Story Progression** — the owner's human life unfolds
wordlessly at home, in parallel with the cat's rise.

The real game will be built in **Unreal Engine 5.8**. Before that, the user wants
a **playable vertical slice delivered as a browser Artifact** to showcase the
gameplay and the art direction.

## 2. Where things stand

| Phase | Status |
|---|---|
| Vertical-slice GDD (12 system docs + master GDD) | **Done** — three review iterations, the user's cap |
| Final director assessment, scores, fourth-iteration notes | **Done** |
| Ten static preview mock-ups + shared art kit | **Done** — one art-director critique and one fix pass |
| User decisions recorded (engine, title, art target) | **Done** |
| Implementation plan for the Artifact showcase slice | **Done — awaiting the user's go** |
| Building the showcase slice | **Not started.** Next step is milestone M0 (look-dev spike) |

Nothing has been played or built. Every balance number is a paper value checked
by small Python simulations, not by a prototype.

## 3. Read these, in this order

1. `design/GDD.md` — master Game Design Document for the vertical slice.
2. `production/artifact-slice/IMPLEMENTATION-PLAN.md` — the plan for the next phase.
3. `design/reviews/final-assessment.md` — scores, the 13 open items a fourth
   iteration would address, the prototype's test list, decisions received.
4. `design/creative-brief.md` — binding canon (v1.4). It wins over
   `design/gdd/game-concept.md` and `game-pillars.md`, which predate later rulings.
5. `design/README.md` — map of the design folder. System docs are 35–80 KB each:
   grep headings and read by section.

Also useful:

- `design/backlog/BACKLOG.md` — consolidated post-slice backlog (Next / Later / Full game).
- `design/backlog/first-drafts/` — archived full-game first drafts; a content reservoir, not canon.
- `design/reviews/` — full critique history, director rulings, simulation scripts and outputs.
- `design/previews/` — ten mock frames (`01`–`10`, HTML source + PNG), `kit/` (palette,
  CSS UI components, SVG painting helpers), `CRITIQUE.md`, `gallery.html`.
- Preview gallery Artifact (private to the user): https://claude.ai/artifact/UWgvyxoFUBKw7mX8Jebjfb
  Republish `design/previews/gallery.html` with that `url` to update it.

## 4. Decisions the user has made (settled — do not reopen)

**Scope and target**
- The GDD targets a **vertical slice**, good enough to start prototyping; not the
  full game and not perfection. Content and non-blocking critique go to the backlog.
- Full game, when it comes: a tight ~3-district, 12–15 hour game with all nine "Lives".
- Slice: Lives 1–2, about 2–2.5 hours, one district of five patches.

**Design direction**
- **Combat:** keep the FF7 Remake *structure* and flashy presentation, but keep
  mechanics simple. Matching FF7R's depth is explicitly not a goal; combat and the
  territory/economy game carry equal weight.
- **Crew:** each cat's **personality** is the hook, affecting both how it fights
  and how it performs in management.
- **3C:** third-person camera behind the cat, freely rotatable, like FF7R.
- Cats speak **readable text**; humans are never intelligible, spoken or written.
- Combat impact lettering is **readable** onomatopoeia.

**Decided 2026-11-24**
- **Engine:** Unreal Engine 5.8 (set in `project.yaml` and `CLAUDE.md`).
- **Title:** "Cat RPG" — final.
- **Art target:** match the look of the reference, *Shin chan: Shiro and the Coal
  Town*, as closely as possible **on visuals, not on 3C**: 3D cel-shaded characters
  that read as 2D cartoon cels, over environments that read as 2D painted
  backgrounds, in full 3D with a free camera. This is a rendering target only: all
  characters, names, places and assets are original, and that IP's characters are
  never drawn, named or reused.
- **Next deliverable:** an implementation plan, then a playable slice **as an
  Artifact**, before any Unreal work.

## 5. How the user wants the work run

- **Use the studio template's agents** (`.claude/agents/`): directors working with
  designers, artists and so on, critiquing each other.
- **Model split:** the session model (Fable) lays foundations only. **Opus** does
  all reviews, critiques, revisions and iteration loops, and the previews.
- **Iteration cap: three per piece of work.** If a fourth would be needed, do not
  run it — write it down with a score out of ten, what needs to improve, and the
  base idea for improving it.
- **Good enough, not perfect.** Presentable work passes; remaining critique goes
  to the backlog.
- **Autonomy:** the user asked once for any questions up front, then said to
  proceed freely. Ask only when a decision is genuinely theirs (taste, budget,
  legal). The template's `CLAUDE.md` ask-before-every-write protocol was overridden
  by the user's explicit request for an autonomous pass; a new session should
  confirm that still holds before a large autonomous run.
- **Usage limits:** the user's plan has a 5-hour limit. They asked that when it is
  about to run out the session idles and schedules its own wake-up for the reset.
  `get_session` reports `rate_limit_info.resetsAt`; schedule a `send_later` a few
  minutes after it at the start of any long run. Remaining quota is not visible,
  so push after every phase.

## 6. Practical notes learned this session

- **Agent turn caps.** Most studio agents have `maxTurns: 20` (directors 30). That
  is too few for reading several 50 KB docs and writing one. Either brief the agent
  to budget its turns and read files whole, or use `general-purpose` with the role
  file named in the prompt. An agent that stops at its cap can be resumed with
  `SendMessage`.
- **Designer-role agents have no shell.** For anything that must run a script
  (simulations, renders), use `general-purpose` or a programmer role.
- **Parallel authors cannot see each other.** What made the docs converge was a
  shared canon written first, single ownership of every doubly-defined thing, and a
  director ruling pass between rounds. Keep that pattern for the build.
- **Verify with scripts.** The most valuable critiques recomputed the drafts' own
  formulas. Simulation scripts are in `design/reviews/round-{1,2,3}/sim/`.
- **A stop hook requires a clean tree.** Commit and push after every agent
  hand-back; `git -c push.negotiate=true push -u origin design/cat-rpg-gdd`.
- **Sandbox network.** npm works; CDNs (cdnjs, jsDelivr) are blocked from the
  container, so local tests must load libraries from an npm copy. Playwright and
  headless Chromium are pre-installed; do not reinstall them.
- **Preview frames** render with `node design/previews/render.js <file.html> <out.png>`.

## 7. Next step: the Artifact showcase slice

The plan is `production/artifact-slice/IMPLEMENTATION-PLAN.md`. In brief:

- **Scope:** a 10–15 minute guided path through Life 1 days 1–2 and one day of
  Life 2 — first two-cat Pile-On at about 3:35, the rival Togemaru returning with a
  memory line, the Verdict, one Turf Board posting decision with a raid resolving
  overnight, the tribute morning, and the wordless home scenes with the piano.
- **Tech:** Three.js r160.1 (UMD from a CDN), plain DOM HUD reusing the preview
  kit's CSS, WebAudio synthesis; every model, texture, animation and sound authored
  in code. Gameplay data in JSON mirroring the GDD's tables so tuning carries over
  to Unreal.
- **Milestones:** M0 look-dev spike (go/no-go on the art target) → M1 combat grey
  box → M2 lane and territory → M3 rivals and Verdict → M4 home and story → M5 full
  script and overnight → M6 audio (in parallel) → M7 polish and touch.
  Estimated 42–50 agent-sessions; each milestone republishes the same Artifact URL.
- **Start with M0.** It tests the three biggest risks — whether code-authored cats
  and environments can hit the reference look under a free camera — before any
  gameplay work. Show the user the M0 result and get their go before M1.

**Questions in the plan still open for the user** (each has a default that applies
if unanswered): phone support (default: full touch play in landscape); budget
(default: accept 42–50 sessions); audience (default: private link only); code
location (default: `prototypes/artifact-slice/`); supporting both outcomes of
recruiting Togemaru (default: yes); a Japanese sound-word toggle (default: include).

## 8. Open items to carry forward

- **Legal:** the nemesis system adapts a mechanic covered by a Warner Bros. patent.
  `design/gdd/nemesis-system.md` lists how this design differs and recommends review
  by qualified counsel before any public showing. No legal conclusion has been reached.
- **Reference closeness:** the user chose a look very close to a commercial game's
  style. Keep every character and asset original, keep reference names and logos
  off any page, and keep showcase links private until the user decides otherwise.
- **Three doc mismatches** survived iteration 3 and are flagged in `design/GDD.md`:
  the day the Turf Board is taught (director ruled Life 2 day 2; `key-screens.md`
  §7.4 still says day 1), the timing of home scene K1.4, and the first boss's level
  (8 vs about 9). Fix them when those systems are built.
- **Weakest feature:** territory scored 5/10 on "will it stand out". The director's
  idea is to forecast two possible raid targets so posting becomes a hedge. Worth
  trying in the showcase slice.
- **Unreal setup:** `engine.path`, build/test commands and `engine.code_root` are
  unset; they need `/setup-engine` on a machine with UE 5.8 installed.
  `.claude/docs/technical-preferences.md` (legacy mirror) was not updated.
- **No pull request** has been opened from `design/cat-rpg-gdd` to `main`. The user
  has not asked for one.

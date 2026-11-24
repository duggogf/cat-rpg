# Cat RPG — Session Handover

**Written:** 2026-11-24 (updated the same day after the owner-feedback pass) · **Branch:** `design/cat-rpg-gdd` (pushed; no pull request opened)
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
| Owner feedback on the gallery (6 comments) | **Done** — rulings, patent check, five doc revisions, consistency pass, redrawn previews |
| Showcase-slice plan v2 (owner feedback + desktop only) | **Done** |
| Prototype scaffold (`prototypes/artifact-slice/`) | **Done** — build, dev server, headless WebGL screenshots verified |
| Showcase M0 look-dev | **Done on the studio side** — GO WITH FIXES after 3 iterations; published at https://claude.ai/artifact/MBsJLyudNiAdVyUu9BhpD6 ; **owner: GO** (2026-11-24) |
| Showcase M1 combat grey box | **Done** — 3 review rounds, final GO WITH FIXES (overall 5 → 7/10); published on the same showcase link (chapter menu → Combat). Carry-overs: `production/qa/evidence/artifact-slice/M1/review-final.md` |
| Showcase M1.1 combat rework (owner C10) | **Done, awaiting the owner's play test** — Mikan-only control, one-slot buffer, move-out gradient, L/H strings (L-L-L-H finisher), cat-like AI with attack tokens, stagger cinematic, F Special + auto crew chain + team finisher, R skill bar, Tab lock-on cycle. Spec: `design/reviews/owner-feedback/combat-m1.1-spec.md`; published as version 6 of the showcase |
| Showcase M2–M7 | Not started. Next: M2 lane and territory, carrying the M1 list and follow-ups F13–F16 |

Nothing has been played or built. Every balance number is a paper value checked
by small Python simulations, not by a prototype.

## 3. Read these, in this order

1. `design/GDD.md` — master Game Design Document for the vertical slice.
2. `production/artifact-slice/IMPLEMENTATION-PLAN.md` — the plan for the next phase (v2).
3. `design/reviews/user-comments-2026-11-24.md` — the owner's six comments, verbatim, and
   `design/reviews/owner-feedback-rulings.md` + `design/reviews/owner-feedback/consistency-pass.md` — how they were ruled.
4. `design/legal/nemesis-patent-analysis.md` (v2) — patent risk note; full claim text in `design/legal/claims/`.
5. `design/reviews/final-assessment.md` — scores, the 13 open items a fourth
   iteration would address, the prototype's test list, decisions received.
6. `design/creative-brief.md` — binding canon (v1.6). It wins over
   `design/gdd/game-concept.md` and `game-pillars.md`, which predate later rulings.
7. `design/README.md` — map of the design folder. System docs are 35–80 KB each:
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
- **Showcase plan questions:** phone support **not needed** (desktop only); every other
  default accepted (private link, `prototypes/artifact-slice/`, both Togemaru outcomes,
  Japanese sound-word toggle).

**Owner feedback, 2026-11-24** (`design/reviews/user-comments-2026-11-24.md`, C1–C6)
- **Rivals board** replaces the Fence Line: every unique/boss cat, silhouettes until
  discovered, hover relationship tags, boss anger → a one-fight buff. Laid out as a
  **staged scene per gang** (boss on a perch at the end of an alley, gang down the steps
  by standing, role tags, arrows to the boss) — reference `design/reviews/refs/rivals-board-layout-ref.webp`.
- **Losing a fight** is not game over: the clock jumps to Night and Mikan goes home.
- **District influence** from fighting gangs and spraying; it decays everywhere; at full
  influence (all four outer patches Strong) the district boss roams and can be fought;
  challengers arrive in town; recruits can (rarely) betray.
- **Verdict = three options:** Recruit (bribe), Chase Off (gone for good, even Togemaru),
  Nose-Touch (10-day truce; may join your fights against its own rival).
- **Turf Board unified:** four zones, one decision a day.
- Owner accepted the recruit's own-memory flinch in place of the boss's targeted taunt,
  pending counsel.
- **Patent working rule (binding):** nothing Mikan does to one cat may change a different
  cat. Every independent claim of the Warner Bros. family needs exactly that.

## 5. How the user wants the work run

- **Use the studio template's agents** (`.claude/agents/`): directors working with
  designers, artists and so on, critiquing each other.
- **Model split:** the session model (Fable) laid foundations only. **Opus** does
  all reviews, critiques, revisions and iteration loops, and the previews. From
  2026-11-24 the owner asked that **every agent run on Opus at high effort**
  (`model: opus`, `effort: high` on each Agent call).
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
- **Usage limits:** the user's plan has a 5-hour limit and a weekly limit; on
  2026-11-24 the weekly limit was in "warning", resetting 2026-11-30 14:00 UTC, and a
  wake-up is scheduled for 14:10 UTC that day to resume the build. They asked that when it is
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
- **Sandbox network.** The owner enabled full network access on 2026-11-24, but local
  tests should still load libraries from the npm copy so dev and test runs make no
  external requests. USPTO patent PDFs are image scans; claim text comes from Google
  Patents pages (retry with a browser user-agent on 503).
- **Prototype tooling:** in `prototypes/artifact-slice/`, `node tools/build.mjs`
  bundles `src/main.js` (three.js as the global `THREE`) and writes `dist/index.html`
  (published fragment, jsDelivr three@0.160.1) and `dist/dev.html` (local three);
  `node tools/shot.mjs dist/dev.html out.png` renders with headless SwiftShader WebGL
  and fails on console errors or any external request. Playwright and
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
  box → M2 lane and territory → M3 rivals, Rivals board and Verdict → M4 home and
  story → M5 full script and overnight → M6 audio (in parallel) → M7 polish (desktop only).
  Plan v2 estimate: **45–53 agent-sessions**, above the originally accepted 42–50
  (the owner's new features outweigh the removed phone work); re-confirm with the owner.
  Each milestone republishes the same Artifact URL.
- **Start with M0.** It tests the three biggest risks — whether code-authored cats
  and environments can hit the reference look under a free camera — before any
  gameplay work. Show the user the M0 result and get their go before M1.

**Owner decisions after M0 (2026-11-24):** art target approved (environment and shader as built); reshape Mikan to the
turnaround `design/reviews/refs/mikan-turnaround-ref.webp` while keeping the M0 face (`mikan-face-keep.png`); no
side-profile face swap; E-5 contrast rewritten for inked figures; budget 45–53 sessions accepted. **M1 is go.**

## 8. Open items to carry forward

- **Legal:** the nemesis system adapts a mechanic covered by a Warner Bros. patent
  family (US 10,926,179; 11,660,540; 12,201,908; pending 2025/0108303). The full claim
  text is in `design/legal/claims/`; `design/legal/nemesis-patent-analysis.md` v2 maps
  every feature against it and lists the guardrails. Qualified counsel must review before
  scope lock and any public showing. No legal conclusion has been reached. Watch items for
  counsel include the staged gang hierarchy on the Rivals board and the Nose-Touch ally.
- **Reference closeness:** the user chose a look very close to a commercial game's
  style. Keep every character and asset original, keep reference names and logos
  off any page, and keep showcase links private until the user decides otherwise.
- **Doc mismatches:** the Turf Board teaching day and Daifuku's level (Lv 8) are now
  settled; the remaining small alignments are listed in `design/GDD.md` §20.
- **Owner comment threads:** the six gallery comments stay open on the page because they
  were not sent to Claude; the owner can resolve them in the artifact view.
- **Weakest feature:** territory scored 5/10 on "will it stand out" before the owner
  feedback; influence, decay, challengers and the roaming boss are expected to lift it
  to about 7. Posting well is now worth +24% over the slice (sim), down from +34%.
- **Unreal setup:** `engine.path`, build/test commands and `engine.code_root` are
  unset; they need `/setup-engine` on a machine with UE 5.8 installed.
  `.claude/docs/technical-preferences.md` (legacy mirror) was not updated.
- **No pull request** has been opened from `design/cat-rpg-gdd` to `main`. The user
  has not asked for one.

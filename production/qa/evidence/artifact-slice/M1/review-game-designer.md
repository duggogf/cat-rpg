# M1 combat grey box: game-designer review (round 1 of 3)

PROTOTYPE - NOT FOR PRODUCTION. Reviewer: game-designer (combat-system.md owner). Date 2026-11-24.

**Verdict: GO WITH FIXES.** The rules hold together and the fights are readable. Two showcase beats are not landing yet. The challenger fight is over in about 7 s, and the cats' personalities show only in where they stand.

## What I ran (`prototypes/artifact-slice/`)

- `node --test 'tests/unit/combat/*.test.mjs' 'tests/smoke/combat/*.test.mjs'`: 52/52 pass. (`node --test tests/unit/combat/` with a directory path fails on Node 22 with MODULE_NOT_FOUND. Use the glob, as the README does.)
- `node tools/sim-run.mjs --seeds 30`: reproduces the API.md table exactly. All scenarios meet their expectations.
- Scratch probes (30 seeds each, in the scratchpad and not committed) cover: the challenger and tutorial fights, the MV share by source and by cat, Slow Blink, Tag-In and Relay counts, AI Move use against `ai_fill`, per-cat spacing, props and Fears, and the bucket splash radius.

## 1. Fight lengths (F13): ACCEPTED for the showcase, no retune

| Fight | Median bot | Skilled bot | GDD F9 | Ruling |
|---|---|---|---|---|
| 2 Toughs | 14.2 s | 12.1 s | 18–21 s | Accept |
| 3 Toughs | 21.1 s | 18.5 s | 25–28 s | Accept |
| Sandbox, 4 | 26.1 s | 25.2 s | 33–36 s (band 30–60) | Accept; the only band miss, in an optional chapter |
| Captain | 41.4 s | 31.1 s | 37 s (band 30–45) | In band; not on the showcase path |
| Daifuku phase 1 | — | 39.0 s (max 85.5) | ≈ 55–60 s | Accept: the bout must stay ≤ 1:30 |

Why I accept rather than retune:
- **The gap comes from the model, not from a wrong value.** F9's group focus of 0.55 was a model input. In this spatial sim the cats rarely split their targets, and Quick Pile-Ons clear Frazzled clusters, which is a GDD rule. To lengthen trash fights I would have to change canon F2 values (Tough `r_rank`, Frazzle decay). Those values have worked-example tests and they transfer to Unreal.
- **The showcase is time-boxed.** It has to fit 11–15 min, and half of it is territory. Phase 1 at 55–60 s would push the bout's worst case past its 90 s budget.
- **I tested one data knob and reverted it.** Setting the bucket `splash_m` to 3.0 (the §3.9 reach) brought the sandbox to 29.5 s and raised Pon's bucket use from 0.07 to 0.60 per fight. But it cut Pile-On reach in the median sandbox from 29/30 to 25/30. That cost is not worth it. `src/data/combat/*` is unchanged.
- **Follow-up for the engine slice:** re-baseline the F9 table against this spatial sim. That is my GDD edit; I did not make it here.

## 2. The 17 assumptions in API.md: all accepted

- #6: I accept the Fear Water chunk on a dunk. The §3.9 diminishing must apply (full effect, then half, then nothing); `fearCount` is present.
- #17: the 3-phase figure of 128–195 s on the phase-1 kit is not evidence for F9. Do not quote it against the 166–176 s target.
- #15 is accepted as an approximation: a circle of 1.5 m instead of a 3 m cone. The correction belongs to the sim (Fix 4).

## 3. Conducting and personality

| Measure (per fight) | Skilled bot | Median bot |
|---|---|---|
| Slow Blink opened | 3.1–3.3 | 1.9–3.6 |
| Tag-Ins | 5.3–5.4 | 1.2–1.9 |
| Relays of 3+ tags | 1.4–1.7 | 0 |

Conducting happens for the skilled bot and only thinly for the median bot.

Share of the Posse's damage by source:
- **Crew:** 68–76% (target ≥ 55%) ✓.
- **Pile-On:** 32–46% in leader fights ✓.
- **Moves:** 5–9%, against about 20% in the F9 model.
- **Tag-In strikes:** 2–12%.

The Set-up → Pay-off pairs barely fire:
- Shoulder Check Splats about 0.9 times per sandbox fight, but Bunny-Kick follows only 0.03–0.10 times.
- Belly Flop and Withering Hiss never fire.

**AI Paw habits never fire.** The AI used 0.00 Moves per fight in trash fights, even at `ai_fill` 1.0. The showcase loadouts give the AI only one `auto` Move (Belly Flop), and an AI cat never spends its last Paw. This confirms backlog B-17.

So personality shows only in spacing:
- Hige stays 1.1 m from the controlled cat.
- Kinako keeps 3.6 m from enemies.
- Pon triggers a prop 0.07–0.17 times per fight.

The cats are grey stand-ins, and every Pile-On beat reads the same "BAP-BAP-BAP!".

## 4. Controls (keyboard and mouse)

The map can be learned in a 10–15 min session if the screen shows the keys:
- **Gamepad glyphs on keyboard.** The Slow Blink menu shows L1/R1/R2 and face-button glyphs while the player is on keyboard and mouse.
- **Plate glyphs.** The Posse plates show D-pad glyphs instead of the Z X C V keys.
- **Pause key.** Pause is P in the build and Esc in GDD §3.1. Keep P, because Esc is Back inside Slow Blink, and show it on screen.
- **Tag-In window.** Keep it at 0.35 s until a human playtest. If first-timers miss Tag-Ins, 0.5 s is the top of the GDD range.

## Fixes (max 5)

1. **Data + sim. The challenger fight takes 6.9 s.** The bot ran 0 Moves, 0 props and 0 Fears, and the guest was in the fight for about 4 s. The plan gives this beat 60 s to teach Relay, Fears and the join-in. A Captain-rank challenger, which I probed, gives:
   - 23–34 s;
   - 2 Full Pile-Ons;
   - 4-cat Relays from the skilled bot;
   - 7–11 guest hits.

   Add a showcase override that the sim reads, so canon keeps the Tough, and give the challenger Fear Water. This needs the creative director's sign-off, because OR-16 says the challenger is a Tough.
2. **Presentation.** Show glyphs for the input device in use: keycaps in Slow Blink and on the plates (Z X C V, Q/E, Space, Esc, Tab, P).
3. **Presentation.** Give each Pile-On beat its own cat: a Style word per beat (Claw, Thump, Yowl), that cat's face and its personality flourish, and personality barks or icons during the fight.
4. **Sim.** Build the §3.9 bucket splash as a 3 m cone away from the hitter, then re-check Goofball prop use and the sandbox Pile-On rate.
5. **Sim (bots).** In one Slow Blink, have the skilled bot chain a Set-up and its Pay-off (Shoulder Check → Bunny-Kick, Withering Hiss → Purr), then re-report Move share and how often each pair lands.

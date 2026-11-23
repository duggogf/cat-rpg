# Round 1 critique: `design/gdd/combat-system.md` (systems and maths)

*Reviewer: systems-designer · Date: 2026-11-23 · Canon checked: creative-brief.md v1.0, game-pillars.md v1.0*

**Coverage.** I read all of `combat-system.md` (lines 1–1405). From `crew-and-progression.md` I read §3.1–3.3, §3.7–3.13 (slots, Zoomies tiers, the Move catalogue, Knacks, Mikan, heir, matchup chart and example Posses), F1–F3, F10–F11, Edge Cases, Dependencies and Cross-doc assumptions. I skipped Crew §3.4–3.6 and F4–F9 (recruitment, Loyalty, prices), which the brief did not ask for. I had no shell, so every figure below is worked by hand from the doc's own tables. Where I state a model, its inputs are given so the reviser can check it.

---

## 1. Verdict

**MAJOR REVISION NEEDED.**

The stagger-loop architecture is sound. The frame data is careful, and most worked examples recompute exactly. But run the doc's own inputs through the doc's own formulas and they do not give the fight the doc describes:

- Captains and Bosses die 3–5× faster than the brief's targets.
- Bosses almost never Frazzle, because phase gates reset the gauge before it can fill. The signature Pile-On therefore mostly does not happen on the fights that matter most.
- Any enemy, Bosses included, can be stun-locked with basic attacks.
- The optimal line is to mash basics with the highest-Zip cat and leave Ruffling to Auto-Hiss. Conducting is optional.

Separately, the Move list, the Knack list and the matchup chart conflict with Crew & Progression almost everywhere they overlap.

---

## 2. What is strong (must survive revision)

- **Tick-exact frame data and string totals.** I recomputed all five Style strings (ticks, MV, FZ, PG) and the MV/s figures. Every one matches.
- **The worked examples A–D, F-2, F-5, F-7, F-8 and F-9 are arithmetically correct** (8/11, 170/230, 4,760, 18/26/40, 30/750, 100/2,040, 46/35 Zoomies).
- **Deterministic crits, the closed status list, telegraph classes conveyed by shape and pose as well as colour, and the commit-tick Paw refund.** These are the right foundations.
- **The player-authorship feel rule** (AI hits shown one tier lower), the trauma-style shake cap and the global hit-stop budget.
- **The anti-stall list** (Perch, Fed Up, Fear diminishing, Harden) and the honest Open Questions table. OQ1, OQ2 and OQ16 point at real problems, though they understate them (see below).
- **The paper-model habit itself.** It is what made these errors findable.

---

## 3. Issues

### S-1 · BLOCKER · F-10, CR-11, CR-19.4: time-to-Rout is off by 3–5×, not "a third"

F-10 states its inputs: the player cat does 1.0–1.5 MV/s from basics plus 0.5 from Paws; each AI cat does 0.75 plus 0.2; 1 MV ≈ 10 damage at Lv 1. Summed, the Posse does **4.35–4.85 MV/s ≈ 45–48 damage/s** on one target. F-10 then claims "Captain + 2 Toughs: 30–50 s". With those inputs that encounter is 400 Nerve at Swagger 0.7 plus 200 Nerve, which is ≈ 77 MV-equivalents ÷ 4.6 MV/s ≈ **17 s**, before any Frazzle bonus.

The model I use throughout:

- Lv 1 frame. Posse DPS P = 48 dmg/s at efficiency η = 1.
- η = 0.6–1.0 covers travel, dodging, AI retreat and output split across targets.
- Frazzle inflow F ≈ 50 FZ/s before resistance (player string 15.3, three AI strings 23.6, Moves 11.7), scaled by the same η.

| Target | Nerve | Modelled TTK (η 1.0 → 0.6) | Brief | Doc's claim |
|---|---|---|---|---|
| Tough, player alone | 100 | 5.0 → 8 s (+1–2 s closing) | 8–12 s | 5–8 s ✓ |
| 4 Toughs (roaming budget), whole Posse | 400 | **8 → 14 s** | encounter 45–90 s (AC) | — |
| Captain (Swagger 0.3) | 400 | **11 → 19 s** | 45–75 s | "30–50 s" ✗ |
| Boss (Swagger 0.5, +12 s of breaks, 2 waves) | 1,200 | **≈ 60 → 95 s** | 3–5 min | "2.3–3.5 min" ✗ |
| Botan (×20, 0.55, +16 s) | 2,000 | **≈ 1.5 → 2.3 min** | 6–8 min | not modelled |

Why it matters to the player:

- Captains die inside their first Frazzle window. They Frazzle at about 15% Nerve remaining, which contradicts the doc's intent of "two Frazzles in a 45–75 s fight".
- Every normal encounter misses its own acceptance criterion (45–90 s) by 3–6×.

The root cause sits in the brief. A basic hit is 8–10% of Nerve, a string is two hits per second, and there are four cats, so the Posse kills a ×1 Tough in 2–3 s. The ×4 and ×12 multipliers then cannot reach 45 s or 3 min without extreme sponging.

**Fix.** Do not patch this with Swagger. Take the package in S-5 (halve basic MV) together with these rank values:

| | Captain | Boss | Botan |
|---|---|---|---|
| Nerve multiplier | ×10 | ×24 | ×40 |
| Swagger | 0.20 | 0.30 | 0.30 |
| RankRes | 0.25 | 0.10 | 0.08 |

Under the same model this gives:

- Captain 33–55 s
- Boss ≈ 2.2–3.5 min
- Botan ≈ 4–6.5 min

The multipliers and the basic-hit band are canon, so this needs a ruling (§5, R-1). Replace the F-10 table with a simulation spec (an encounter Monte Carlo like `round-1/sim/`), and make the TTK acceptance criteria name the focus assumption: "whole Posse engaged, Alley, same level".

### S-2 · BLOCKER · CR-18.6, CR-11.7, Edge Cases 9–10: Bosses cannot be Frazzled; the phase gate eats the signature loop

Ruffled doubles damage and doubles Frazzle gain, so **the damage dealt before a Frazzle does not depend on Ruffle**:

```
D_toFrazzle = (100 / (RankRes × RuffMod)) × (1 − Swagger if not Ruffled) × d
d = P / F ≈ 1.0 damage per FZ point at Lv 1 (≈ 0.75 at Lv 10–30, see S-8)

Boss:    unruffled 100/0.08 × 0.5 = 625     ruffled 100/0.16 × 1.0 = 625
Captain: unruffled 100/0.20 × 0.7 = 350     ruffled 100/0.40 × 1.0 = 250
Tough:   100 (= its whole Nerve; it dies as it Frazzles, which confirms OQ8)
```

A ×12 Boss has 1,200 Nerve, so 625 damage is **52% of its Nerve before the first Frazzle**. The phase segments are 30% / 35% / 35% (360 / 420 / 420). The posse therefore crosses each phase gate before the gauge fills. Each phase break **resets the Frazzle gauge** (CR-18.6.2), so the Boss can go from 100% to Routed **without ever being Frazzled**.

If a Frazzle does happen (Fear burst, Banshee Screech), the 8 s window deals 8 × 48 × 1.7 ≈ 650 damage. That is more than one phase segment, so Edge Case 10 ends the window early and Edge Case 9 clamps the Pile-On. The player sees a Pile-On wasted against a wall they could not see coming.

**Fix (all three parts):**

1. **Phase breaks keep the Frazzle gauge.** Do not reset it; the break may add +20.
2. **Defer the phase break while Frazzled.** Damage still clamps at the gate, but the Frazzled state and the Pile-On run to completion, the break plays after the cloud clears, and up to 10% of max Nerve of overflow carries into the next phase.
3. **Retune so D_toFrazzle is about 15–20% of Boss Nerve.** With the S-1/S-5 package: 0.7 × 0.6 / (0.10 × 24) = 17.5%, which gives about one Frazzle per phase plus one spare. Add an acceptance criterion: "every Boss phase on Alley contains at least one Frazzle in the median run".

### S-3 · BLOCKER · CR-15.5, cat action state machine, CR-18: there is no enemy poise, so every enemy can be stun-locked

The state machine enters **Flinch (36 ticks) on any unblocked hit while not armoured**, and enemies have no armour rule. Trace a Scrapper string:

- Swipe 1 lands around tick 5–7 and Flinches the target until about tick 42.
- Swipe 2 lands around tick 27–29, which refreshes the Flinch.
- Swipe 4 lands around tick 82 and holds the Flinch until about tick 118.
- The next Swipe 1 lands at about tick 115, and its 1.5 m lunge magnetism covers Swipe 4's 1.5 m knockback.

So **one player string-loop holds a single target in permanent Flinch**. Toughs have no Brace or Skitter escape. Captains escape 25% of strings on Alley. Bosses have nothing.

There is a second hole. Enemy Moves only gain flinch immunity *after* the commit tick, so yellow (45-tick) and red (60-tick) windups can be cancelled by **any Swipe**. Four cats on a Boss means the Boss never finishes an attack. The red class ("cannot be Braced, Bapped or Hissed") is unstoppable on paper and trivial in practice.

**Fix.** Add a poise rule to CR-18:

- **Toughs, Strays and Critters:** Flinch from basics at most once per 60 ticks (Flinch immunity 60 ticks after a Flinch ends). Finishers, Whacks and knockbacks ignore that limit.
- **Captains:** hit-armour against T1 basic hits. They Flinch only from T2+ hits, Bap, Hiss-on-yellow, `interrupts` Moves and knock-offs.
- **Bosses:** hit-armour against everything except Bap (24 ticks), Hiss-on-yellow, `interrupts` Moves and phase-specific Ruffle routes.
- **All enemy windups:** armoured from the start of the windup. Yellow can be stopped only by Hiss, Screech or `interrupts`. Red cannot be stopped at all.
- Add an acceptance criterion: "no input sequence keeps a Captain or Boss unable to act for more than 4 s outside Frazzled, pins and Fear riders".

### S-4 · MAJOR · CR-11.1, CR-11.3, CR-5.4, CR-10.3, CR-16.2: Swagger plus unlimited Ruffle creates a lock loop. Swagger is a sponge for novices and decoration for experts

**Swagger audit.** Ruffled removes Swagger *and* doubles Frazzle. On a Boss that is a **×2 damage × ×2 Frazzle ≈ ×4 progress** multiplier. Nothing limits Ruffle uptime on leaders:

- **Hiss interrupts.** Every enemy 1-Paw Move is at least yellow (CR-18.4), and a Boss earns one Paw every 6 s. Auto-Hiss is **on by default** for all three AI cats (70% success). Each interrupt adds Ruffled 4 s, Flinch 36 and FZ 15.
- **The retry problem.** CR-8.6 refunds Paws when an action is interrupted before its commit tick, and CR-7.9 says enemies use the same gauge. The interrupted Boss therefore keeps the Paw and retries at once. Four cats with 10 s cooldowns (Yowler 5 s) provide a Hiss every 2–2.5 s. **Result: near-permanent Ruffled, and the Boss's Moves almost never land.**
- **Ruffle-applying Moves** stack on top: Shadow Step +3 s, Big Talk, and in Crew's catalogue Back-Talk (6 s, 1 Paw), Feint, Fish-Hook, Glint, Bait, New Moon. None of these diminish.
- **Being Outnumbered** gives continuous Ruffled with **no diminishing** whenever three Posse cats stand within 3 m. Hugging the target makes the lock permanent.

The numbers: with Ruffle maximised, Boss Swagger is never active. Average PoiseMod over a Frazzle cycle is about 1.18, against about 0.72 for a player who never interrupts. That is **1.64× faster**, plus more Pile-Ons.

So Swagger works out as follows:

- **A hidden sponge for exactly the players who most need help.** Kitten-mode players, Auto-Scrap users and new players fight a Boss that is effectively ×24 Nerve. Difficulty modes do not touch Swagger.
- **Cosmetic for optimisers.** Their real objective becomes "maximise Ruffle uptime", and the AI does it for them, which breaks the doc's own player-authorship rule.

**Fix:**

1. **Composure cap.** A Captain can be Ruffled for at most 8 s per Frazzle cycle, a Boss or Botan for 6 s. The counter resets when its Frazzled state ends, and the HUD shows remaining Composure. Ruffle then becomes a burst you *time* to finish a gauge, not a state you maintain.
2. **Interrupts spend the enemy's Paw.** An interrupted enemy Move consumes its Paw and puts that Move on a 6 s cooldown.
3. **Auto-Hiss defaults to off.** The AI Hisses only under Mind the Others or on command.
4. **Swagger values:** 0 / 0.20 / 0.30 / 0.30. Kitten mode multiplies Swagger by 0.5 (add it as a CR-20.1 row).
5. **Being Outnumbered** follows the Composure cap like every other Ruffle source.

### S-5 · MAJOR · CR-3, CR-7, CR-10.1, CR-17.1: the conductor layer is a minority of output, and AI cats are the main damage source

From F-6 and F-10's own rates:

- **Moves (all Paws) ≈ 1.16 of 4.85 MV/s = 24% of Posse damage.** Moves also supply under a quarter of Frazzle (11.7 of 50 FZ/s).
- **AI cats ≈ 2.85 of 4.85 = 59% of damage**, and 46% from *autonomous basics alone*. This breaks CR-10 ("must not be the main source of damage") and the AC "AI 25–40%".
- Paw income is fixed at 1 per 6–7 s, while a string lands about 10 basic hits in the same time. A 1-Paw Move is worth 3.5 of them. The brief's §8 numbers lock this ratio in.

The optimising player's turn, every fight:

1. Control the highest-output cat (S-7).
2. Mash strings: about 75% of personal output, with permanent stun-lock (S-3).
3. Fire Paws from shortcuts on whatever is affordable.
4. Let Auto-Hiss Ruffle.
5. Open Slow Blink only to Pile-On on the last tick (S-6).

That is competent mashing with a garnish of commands. It is not "Conduct the Brawl".

**Fix (needs ruling R-1 because the basic-hit band is canon):**

- **Halve every basic-attack MV.** A hit becomes about 4–5% of same-level Nerve; Lv 1 Swipe 1 = 4.
- Keep FZ, PG and Move MV unchanged.
- Raise AI posture to **3.5–5.0 s**.

Results:

- **Moves rise to about 40% of Posse damage.** Autonomous AI falls to about 35%.
- **A Tough under player focus takes 7.7 s plus closing**, which sits inside the brief's 8–12 s for the first time.
- **Toughs Frazzle at about 40% Nerve remaining**, so a Quick Pile-On becomes the finisher. This fixes OQ8.
- With Captain ×10 / Boss ×24 (S-1), the leader TTKs land in band.

### S-6 · MAJOR · CR-12.7, F-5, Edge Case 6: the Pile-On timing decision is fake

The Pile-On is worth 4 × 1.5 MV × bonus = 6 MV × bonus. The rest of the window is worth 4.85 MV/s × bonus. **A Pile-On therefore equals about 1.2 s of window**, so triggering it before the last 1.2 s is strictly worse.

The stated risk of waiting ("the window expires") is zero:

- Slow Blink runs at 5% time and can trigger the Pile-On.
- The shrinking ring shows the exact time left.
- Edge Case 6 gives ties to the player.

Every Frazzle therefore ends the same way: Slow Blink at about 0.5 s left, Pile-On. That is a chore, not a decision.

**Fix.** Make the Pile-On cash out the remaining window:

```
PileOnMV_per_cat = 2.0 + 0.6 × T_remaining_s
```

- Triggered at once, it is worth about 65% of the window's value, with 2.5 s of invulnerability.
- Triggered at the last tick, it is worth 2.0 MV per cat.
- Early means safe; late means bigger but exposed to other enemies. That is a real choice.

Raising the base from 1.5 to 2.0 also keeps the Pile-On meaningful against ×10 and ×24 leaders. Add tuning knob `pile_on_mv_per_remaining_s` (safe range 0.3–1.0).

### S-7 · MAJOR · CR-9.7, CR-7.5, F-6: switching changes nothing in the Paw economy, and one controlled cat dominates

Total Posse Paw income is 15.9 + 3 × 5.8 points/s **whoever is controlled**. Switching only moves the ×2 multiplier around. The player spends the controlled cat's Paws by shortcut and the other cats' Paws through Slow Blink, so a switch is never needed to use a resource.

The cat worth controlling is fixed, because Crew's Style weights tilt CR-3's "≈2.1 MV/s for every Style":

| Style (player-controlled) | Basics, MV/s × attack weight | Paw rate with ZipFactor |
|---|---|---|
| **Prowler** (Bite 1.30, Zip 1.30) | 2.12 × 1.30 = **2.76**, every hit a crit on Frazzled | **5.5 s/Paw** |
| Scrapper / Mikan (1.20, 1.15) | 2.07 × 1.20 = 2.49 | 5.9 s |
| Bruiser (1.00, 0.70) | 2.07 | 8.4 s |
| Yowler (Voice 1.35, 1.05) | 1.47 × 1.35 = 1.99 | 7.4 s |
| Trickster (0.95, 1.10) | 1.50 × 0.95 = 1.43 | 6.9 s |

The Prowler's cost (Nerve 0.80, Hide 0.75) is exactly what player Skitter and Bap erase. **The dominant line is to control the Prowler all fight**, and the doc's AC of "switch at least once per encounter" has no mechanical support.

**Fix.** Add **Tag-In**: for 60 ticks after a switch, the new cat's first hit is a free Counter-Pounce-class strike (MV 1.6, FZ 15, PG 6, homing 4 m, T3). It can trigger at most once per 5 s Posse-wide. That makes rotation part of optimal output and makes each Style's Whack matter. Also state in CR-14 that Style stat weights are part of basic-attack balance, and re-balance PG per Style so seconds-per-Paw under control is within ±10% across Styles (Bruiser is currently 53% slower than Prowler).

### S-8 · MAJOR · F-0: the level curve dips mid-game; difficulty drifts 39% inside the vertical slice

Hit size as a share of same-level Nerve:

```
hit% = 0.425 × S(L) × K(L) / N(L)
```

Because N and S are both linear with different intercept ratios, the result is not monotonic:

| Lv | 1 | 2 | 4 | 8 | 12 | 16 | 20 | 30 | 40 | 50 |
|---|---|---|---|---|---|---|---|---|---|---|
| hit% | 8.50 | 7.49 | 6.70 | 6.24 | **6.14** | 6.12 | 6.17 | 6.34 | 6.56 | 6.80 |

OQ16 only compared the endpoints ("about 20% longer at cap"). The real problem is that **fights in Lives 2–5 run about 39% longer than in the tutorial**, and the steepest part of that drop happens *inside* the vertical slice (Lv 1–8). Playtest TTK numbers from the slice will not hold later in the game.

**Fix.** Derive K from the stat curves so hit% is flat at every level:

```
K_dmg(L)  = 0.20 × base_nerve(L) / base_other(L)     → 2.00 at Lv 1, 2.96 at Lv 14, 3.125 at Lv 50
K_heal(L) = 0.10 × base_nerve(L) / base_other(L)     → 1.00 at Lv 1, 1.5625 at Lv 50 (same endpoints)
```

These read Crew F1's base curves directly, which also settles the CR-F-0 "must track Crew's curve" note. Lv 50 basic Swipe 1 becomes 212, still inside the brief's 170–230 band. (If S-5 is ruled in, both K coefficients halve with the basic MV; only the ratio matters.)

**Over-level.** Crew F3 lets the Posse sit at band-top + 5. With the fixed K, +5 levels gives ×1.45 damage dealt and ×0.68 damage taken, so **≈2.1× easier**. District Bosses drawn at band-mid become trivial. Add to CR-19.4: "Den Captains and the Boss are levelled at max(band top, Posse mean level − 2)". In Life 8, decayed-district Rivals use Posse mean − 3. (Cross-doc with Nemesis; see C-11.)

### S-9 · MAJOR · F-1 ceiling check: the 9,999 cap is breached by the starter catalogue

The ceiling line ignores Vanish's Backstab bonus (+MV 1.5 on the armed Backstab). Prowler Neck Nip after Vanish:

```
8.5 MV × 160 × 2.5 × 0.5 × 1.25 × 2.00 × 1.5 × 1.60 = 10,200   (neutral Bite)
```

Crew F1 allows Bite up to about 236 for a Lv 50 Prowler (weight 1.30, Bitey +8%, Loyalty 100). That gives **≈15,000**, and Neck Nip *without* Vanish gives ≈12,400. The AC "no hit can exceed 9,999" fails today, and the brief says the cap is "never reached".

**Fix.** Adopt Crew's proposed amplifier cap in a tighter form: the product TypeMod × CritMod × BuffMod × OpenerMod is clamped to **≤ 1.60**, applied before PoiseMod. Cap a single hit's MV, including add-ons, at 8.0. Re-run the ceiling with Atk_max = 245 (Crew F1's stated maximum): 8 × 245 × 3.125 × 0.5 × 1.60 × 2.00 = **9,800**. That passes even with the S-8 K, and the ceiling test must use these inputs.

### S-10 · MAJOR · F-2, CR-17.3 Purr, CR-10.3: healing is 180% of budget and erases attrition (Pillar 2 lever)

- **Purr = HealMV 3.0 + Purring HoT** (4 × 0.6 = 2.4 HealMV), so **5.4 HealMV against a 3.0 budget**.
- For a Yowler with Big Voice and Loud Purr: Lv 1 Voice 14 gives 56 + 32 = **88% of a neutral cat's Nerve for one Paw**. At Lv 50 it is about 87%.
- One Purr undoes about 10 enemy basic hits.
- Mind the Others heals automatically below 50%, and every fight starts with half a Paw.

Together, a Yowler in the Posse makes Lick Wounds, Sunspots and the curfew attrition lever (Tuning Knobs, `lick_wounds_fraction`) irrelevant.

**Fix:**

- Purr single target = HealMV 2.2 + Purring (4 × 0.2) = 3.0 total.
- The group version gets no HoT.
- Total healing received per cat per encounter is capped at 60% of max Nerve.
- Heal bonuses (Big Voice + Loud Purr) are capped at +25% combined.

### S-11 · MAJOR · F-1 GuardMod, CR-4.3, Loaf, Thick Scruff: 97.5% damage reduction with a taunt

"Brace and one other source multiply":

- Bruiser Brace 0.20 with Thick Scruff 0.05, × Loaf 0.5 = **0.025 damage taken**.
- Loaf also forces every Tough within 4 m onto the Bruiser and reflects MV 0.5 per melee hit.
- Each blocked hit gives Brace +6 Pounce, and Baps add Ruffled.

A player-controlled Bruiser can Loaf about 80% of the time. That is a near-invulnerable taunt turret, which is the "turtle" line the doc says to "watch in playtest".

**Fix:**

- Combined GuardMod floor of **0.30** (no more than 70% reduction from all sources).
- Loaf cannot be combined with Brace (Loaf *is* the guard).
- Thick Scruff becomes +10 points.
- Loaf's taunt on Captains and above lasts 3 s.

### S-12 · MAJOR · CR-18.3–18.5, OQ6: enemy damage has no rank scaling, and there is no incoming-damage model

Captains (×4, or ×10 after S-1) and Bosses hit exactly as hard as a same-level Tough. A Boss is a large, harmless Nerve bar. That is the definition of a sponge from the player's side, whatever Swagger does.

**Fix:**

- Rank damage multiplier: Tough 1.0 / Captain 1.3 / Boss 1.6 / Botan 1.8.
- Write an incoming-DPS model next to F-10 with the target "normal Alley encounter costs 15–25% of Posse Nerve; Boss fight 50–80% without healing".
- Tune attack tokens against that model, not by feel.

### S-13 · MAJOR · Game Feel, CR-20.2–20.3: flash and shake accessibility risks and missing numbers

1. **Shake frequencies cannot be rendered.**
   - T1–T5 specify 30 / 28 / 24 / 20 / 16 Hz.
   - On the 30 fps handheld the Nyquist limit is 15 Hz, so every tier aliases into strobing jitter or nothing.
   - At 60 fps, 30 Hz is alternate-frame flicker.
   - Fix: noise-based shake at 8–12 Hz (60 fps) and at most 10 Hz on handheld.
2. **The flash limit sits at the legal maximum.**
   - CR-20.3 allows 3 full-screen flashes per second, which is the WCAG 2.3.1 / Harding ceiling itself, with no margin.
   - A Frazzle window with four cats on command produces several T4 events per second (2-ticks full screen, queued 10 ticks apart, which is up to 6/s before the cap).
   - Fix: design cap of **2 per second and 6 per rolling 5 s**. The **default** configuration must pass a Harding FPA test; Flash reduction then goes beyond that rather than being the only safe setting.
3. **The impact-frame luminance change is unspecified.** A "two-tone inverted flash" over the full screen is close to a 100% luminance swing. Fix: limit the inverted frame to a mid-tone palette with relative-luminance change ≤ 0.10 for T4, or ≤ 0.20 limited to 25% of screen area. Saturated-red full-screen frames are forbidden.
4. **The Move-commit "cut-in flash 6 ticks"** (Animation Feel Targets) conflicts with the 3-tick impact-frame limit if it is full screen. State that it is a panel or outline effect with no luminance change.
5. **The Pile-On's continuous 0.5% 12 Hz shake for 90 ticks** is sustained full-screen oscillation, a vestibular trigger. Fix: limit it to the cloud sprite. Camera shake is only on the four beats.
6. **The global hit-stop budget of 24 per 60 ticks** allows the game to be frozen 40% of the time in a Frazzle dump, which reads as stutter. Fix: 12 per 60.
7. **Missing numbers** the reviser must supply:
   - shake decay half-life per tier
   - the trauma → displacement curve (for example displacement = cap × trauma²) and trauma decay per second
   - T5 punch-in value (currently "12–20 authored")
   - glyph lifetime for T1–T4 (only T5 has one)
   - dust lifetime
   - victim-jitter frequency
   - the coral damage-vignette alpha
   - ease curves on time-scale dips
   - whether Frazzle and Ruffled timers advance during global hit-stop (they should not)
   - a motion-reduction option covering speed lines and punch-ins together

### S-14 · MINOR · arithmetic and spec slips

- **F-3 expected-output maximum is 227.5, not 182.** Sit On It FZ 70 × Bruiser 1.3 × weak 1.25 × Ruffled 2. The doc's figure drops WeakMod. The minimum is 0.28, not 0.4.
- **F-4 Life 4 claim is wrong.** "From Life 4, Mikan's third Paw makes the cap reachable": 2+2+2+3 = 9 Paws gives **1.95**. Reaching the cap needs 10 Paws or a `bonus_add`.
- **FearFZ text and formula disagree.** CR-16.2 says rank resistance applies "at half strength", but F-3 uses √RankRes (0.447 for a Captain, not 0.60). Pick one.
- **Ruffled duration rank scaling is ambiguous.** CR-15.2 scales *statuses* by rank, and Ruffled is a *state*. Only the Bap line scales. State the rule.
- **F-4's "2+2+2+2 banked" cannot happen under Shadow Me**, because AI cats auto-spend at full down to 1 Paw. Either say the banking line requires Hang Back or change Shadow Me to "spend at full only if no Frazzle is within 25 points".
- **Dependencies points at the wrong path:** `design/gdd/crew-progression.md` should be `crew-and-progression.md`.

### S-15 · MINOR · CR-13, F-9: Zoomies budget and farming

- **Midnight Aria** (MV 4.0 to every enemy, Cowed 8 s, HealMV 4.0 to the Posse, cleanse) is worth about 24 MV + 16 HealMV against six enemies, roughly 3× the stated 12-MV budget.
- **Everything Off the Shelf** activates every prop, which can be several Fear triggers.
- Fix: AoE Zoomies pay the 40% per-target exchange rate. Prop activation by Zoomies triggers at most one Fear per target.
- **Zoomies from damage taken is uncapped** (Loaf plus Purr farms it). Cap it at +40 per encounter.

### S-16 · MINOR · CR-5.1–5.3: ledge Pounce loop

Mantle (24 ticks, invulnerable 4–12, untouchable by ground melee) → Pounce (MV 1.8, FZ 22, PG 10, 48 ticks) repeats every 72 ticks. That is 1.5 MV/s at about 75% of string DPS, with large windows where melee cannot touch the cat. Perch does not trigger, because the cat is on the High Road under 4 s per cycle. Fix: a Pounce made within 90 ticks of mantling deals ×0.6 and gives no PG.

---

## 4. Cross-doc conflicts (Combat vs Crew & Progression)

**Ownership ruling I recommend for all of them.** The brief §6 already gives Combat *all Move, Knack and Zoomies definitions and numbers*, and Crew *learnsets, sources, Rank and slot rules*. Build **one catalogue** (`assets/data/combat/moves.*`, `knacks.*`) as follows:

- Use Crew's 64-Move and 20-Knack **ID and name skeleton**, because its learn routes, Ranks, Style lists and fallback cut already depend on those IDs.
- Use **Combat's numbers grammar**: MV, FZ, frames, flags and the CR-17.1 budget.
- Crew deletes its Pow, Frz and Effect columns and the F10 HE model, and references Moves by ID only.
- Combat defines the remaining Moves under CR-17.1 (its own OQ9).

| # | Conflict | Combat says | Crew says | Resolution |
|---|---|---|---|---|
| C-1 | **Matchup chart** | Resists: Bruiser Claw, Scrapper Fang, Prowler Yowl, Yowler Thump; Trickster neutral (CR-14.2). Weaknesses as Crew | Each Style **resists its own type** (B Thump, S Claw, P Fang, Y Yowl); Trickster resists Thump, weak to Fang (§3.13) | **Combat owns. Adopt Crew's self-resist columns at ×1.20 / ×0.80.** Combat's ring is two-edged: the counter Style deals ×1.25 *and* takes ×0.75, a 1.67× swing that feeds Combat's own OQ10 (re-rostering at the Lot). Combat's chart also makes Daifuku, the **first Boss (Life 2)**, resist Mikan's entire native Claw kit before the player has cross-Style Moves. Crew's version moves that beat to Ikari (Life 5), where it is designed. Self-resist also punishes mono-Style Posses, which encourages variety. Keep Combat's ×1.25 Frazzle on weakness |
| C-2 | **Bunny-Kick** | Free Scrapper Whack-hold basic | S1, a 1-Paw Instinct Move (5 × 0.7) | Keep it as the Combat basic. Rename Crew S1 (for example "Rabbit Rake") or replace it |
| C-3 | **Pounce** | Gauge name and universal dive verb | S3, a 1-Paw Move ("8 m gap-closer") | Triple collision. Rename S3 ("Leap"). Combat's Pounce verb stays |
| C-4 | **Hiss** | Universal free action with cooldown; Yowler Move = Withering Hiss | Y1 "Hiss", a 1-Paw cone with −20% damage | Rename Y1 to **Withering Hiss** and use Combat's numbers |
| C-5 | **Kick Dirt / Dirt Kick / Dirt Devil** | Trickster Whack (Dirt-Eyed 3 s) plus Move Dirt Devil | T2 Dirt Kick: **Blinded 4 s, basic attacks miss half the time** | Keep Combat's Whack and Dirt Devil and cut T2. Crew's 50% random miss breaks Combat's determinism principle and adds an unlisted status |
| C-6 | **Nine Shadows; Everything Off the Shelf** | Prowler and Trickster **Zoomies** | P7 and T7, 2-Paw Lv 34 **Moves** | Zoomies keep the names. Crew renames its capstones |
| C-7 | **Loaf** | 6 s, ×0.5, immovable, Tough taunt forced / Captain weight ×3, reflect MV 0.5 | 5 s, −50%, enemies within 4 m must target | Use Combat's values with the S-11 fixes |
| C-8 | **Belly Flop** | MV 2.2 each, FZ 45, knockdown, `reaches_high_road`, Bruiser | Pow 1.4, FZ 10, B/T, Lv 5 | Combat's numbers (FZ 45 is right for a Frazzle-builder Style). Crew keeps B/T and Lv 5 |
| C-9 | **Sit On It** | **2 Paws**, pin 4 s (Boss 1.5 s), FZ 70 | **1 Paw**, pins Toughs only, Frz 25 on leaders | Combat's 2 Paws. Crew's Rank II at Lv 10 still works |
| C-10 | **Neck Nip / Neck-Nip** | **2 Paws**, MV 7.0, FZ 40, `bonus_add` 0.15 | **1 Paw**, Pow 2.5, ×1.6 vs Ruffled/Frazzled, Lv 1 | Keep Crew's 1-Paw Lv 1 version (an Instinct Move at Lv 1 cannot be a 2-Paw burst), with Combat numbers MV 2.5, ×1.4 vs Ruffled. Move Combat's 2-Paw version to Crew's P7 slot under a new name |
| C-11 | **Vanish, Shadow Step, Shoulder Check, Wall-Kick, Bait, Purr** | Different durations, MVs, types (Wall-Kick Claw vs Thump), riders | — | Combat's values. Crew's sources, Styles and Ranks. Wall-Kick takes Combat's dash version, with Crew's terrain condition as the bonus |
| C-12 | **Paw refunds** | "Moves never refund their own cost" (CR-7.4) | Quick Swat refunds 0.25 on hit; Counter-Swipe refunds 0.25 on whiff; Chirrup, Bell Ringer, Box Fort and K5/K12/K14 grant Paws | **Combat's rule stands for self-refund.** Quick Swat as written is 3.4 + 0.875 = **4.3 HE/Paw, +22% unconditional**, which breaks Crew's own rule (a) of ±10%. Paw transfer to *another* cat (Chirrup, Bell Ringer) is allowed at ≤ 0.75 Paw per Paw spent, so there is no loop |
| C-13 | **Status list** | Closed: 5 debuffs, 3 buffs (CR-15) | Adds Slowed (×3 variants), Hide-down (×3), Blinded, Doze, Nipped, Marked, Zip-up, Hide-up, Shield, flee, a −20% damage-down that duplicates Cowed at −25% | Map every Crew effect to Combat's eight, or cut it. A new status must replace an old one (CR-15 rule). Hide-down stacking is the main ceiling risk (S-9) |
| C-14 | **Ruffle-applying Moves** | Swagger makes Ruffled ×2 damage + ×2 Frazzle on leaders | Values Ruffled at "≈0.3 HE/s"; Back-Talk gives 6 s for 1 Paw | Under Combat, 6 s of Ruffle on a Boss is worth about 15 MV, roughly 4 Paws. The Composure cap (S-4) plus a cap of ≤ 4 s for Move-applied Ruffle fixes both docs |
| C-15 | **Knacks** | Thick Scruff = Brace +15 pts; Motor = Zoomies +25%; Pack Cat = AI Pounce ×0.65; Grudge-Holder +15%; Stubborn = cheat death once per day; First Swipe +50 Pounce; Kick 'Em +20% vs Frazzled | K1 Thick Scruff = −30% from behind; K11 Motor = ally regen; K16 Pack Cat = +4% per mate; K18 Grudge-Bearer +20%; K6 Lands On Feet = cheat death **per encounter**; K15 Nine Schemes = +0.5 Paw start (**identical to First Swipe**); K8 Go For The Throat +30% vs Ruffled/Frazzled | Crew's 20 IDs and learn data, Combat's effects, merged: keep one of each duplicate pair (Grudge-Bearer/Holder at +15%; First Swipe/Nine Schemes as one Knack; Stubborn/Lands On Feet at **once per day**, since per encounter is a free revive every fight). "Stubborn" is also a Crew Temperament, so rename the Knack. Crew K2, K6, K17 break Combat's Knack budget (one channel, +10–15%, no new verb) and must be cut down to it |
| C-16 | **Zoomies tiers** | One Zoomies per Style, no tiers | Zoomies II ("3 a.m. Zoomies") at Lv 30 + Loyalty 60, Mikan at Life 5 | Either Combat defines tier II (+25% budget, same verb) or Crew cuts the tier. I recommend the cut (see Cut list) |
| C-17 | **Old Boss** (AI Paw fill 55 / 60 / 70% in Lives 7–9) | `ai_pounce_mult` fixed at 0.50 (canon); Pack Cat 0.65 | Raise it as Mikan ages | Acceptable *after* S-5 brings autonomous AI share down to about 35%. At today's 59% AI share it would mean the Posse wins without the player. Expose `ai_pounce_mult` per Life in Combat data. Needs ruling R-3 (canon number) |
| C-18 | **Basic-hit and Paw model** | Basics ≈ 2 hits/s player, 0.75 MV/s AI; Moves ≈ 24% of output; Paws 9.5/min player, 3.5/min AI | Basics 0.1 BH/s per cat (**15–20× lower**); Moves 70% of output; Paws 6/min and 3/min | Crew's whole F10 HE model and the §3.13 ten-Posse index table do not hold under Combat's arithmetic. Delete both; they move into Combat's simulation spec |
| C-19 | **BH = 9% at every level** (Crew A-1) | 8.5% at Lv 1, 6.1% at Lv 10–20, 6.8% at Lv 50 | — | The S-8 K fix makes A-1 true at 8.5% |
| C-20 | **Amplifier cap** (Crew F10 check 3: ×2.0 on all outgoing amplifiers) | Separate clamps: TypeMod 1.5, BuffMod 1.6, plus unclamped crit and opener | — | Single product cap ≤ 1.60 before PoiseMod (S-9) |
| C-21 | **3-Paw Move** (Crib Guard, Crew A-3) | Budget table covers 1–2 Paws only | 3 Paws, 12.6 HE | Add a CR-17.1 row: 3 Paws = MV 12.5 or equivalent utility. Crib Guard's damage taken −50% is limited by the GuardMod floor (S-11) |
| C-22 | **AI use of set-up Moves** (Crew A-6) | Shadow Me spends damage Moves first; Mind the Others never uses damage Moves; nothing for Bait, Scent Mark, Vanish | "AI uses any slotted Move competently" | Add a Move field `ai_use: auto / command_only / support` to CR-17.2. Set-up Moves are `command_only`, which is also good for the conductor share |
| C-23 | **`MoveUsed` event** (Crew A-8, needed for Watching) | Not emitted | Required | Add `MoveUsed(user_id, move_id, targets_hit[])` to Combat's emitted events and to brief §6.1 |
| C-24 | **Den leader levels** (S-8) | "Enemy level supplied by Nemesis within band" | Posse self-limits to band-top + 5 | Den Captains and Boss at max(band top, Posse mean − 2). Combat states the rule; Nemesis supplies the level |

---

## 5. Needs director ruling

- **R-1. Fight length and the canon numeric frame (brief §8).** The brief's basic hit (8–10% of Nerve), Move multipliers, Paw rate, rank Nerve multipliers and TTK targets cannot all be true with a four-cat Posse. Choose one:
  - **(a) Recommended:** halve basic MV (hit ≈ 4–5%), with Captain ×10, Boss ×24, Botan ×40 and Swagger 0 / 0.2 / 0.3 / 0.3. This keeps the brief's TTK targets and raises the conductor share to about 40%.
  - **(b)** Keep the hit band and multipliers, and accept fights of about Captain 15 s and Boss 1.5 min. This conflicts with "Boss 3–5 min" and keeps Moves at about 24% of output.
  - **(c)** Keep the hit band and raise the multipliers to about ×20 and ×60. That reaches the targets through sponging, which Pillar 3 forbids.
- **R-2. Swagger.** Keep it as the visible "knock the strut out of them" mechanic, at the reduced values with the Composure cap (S-4), or cut it as a damage reduction and keep it only as a pose cue for "can be Ruffled". I recommend keeping the reduced version: it is cat-true status comedy, and the cap removes the sponge.
- **R-3. Old Boss.** This changes canon's 50% AI Paw fill in Lives 7–9 (C-17).
- **R-4. Damage display cap.** If S-8's K is adopted without S-9's amplifier cap, the 9,999 "never reached" canon breaks. Confirm the cap approach.
- **R-5. The default flash configuration** must pass a Harding test, even though the user asked for effects "to the maximum" (S-13). Maximum spectacle has to fit inside photosensitivity law, not override it.
- **R-6. Auto-Hiss default off** (S-4). It changes how much the AI "fights competently" out of the box.

---

## 6. Cut list

- **Bunny-Kick hold and Bruiser Sit-hold as basic-attack variants.** Both duplicate Moves of the same names in Crew, add hold-to-charge accessibility toggles, and Sit duplicates Sit On It. Whacks stay single-input.
- **Damage variance knob.** It contradicts the determinism pillar and test rules, and nobody needs it.
- **CR-19.9.4 "+100 Pounce after 15 s of no damage".** Forced attacks already break the stall. The Paw gift only rewards hiding.
- **Being Outnumbered's exemption from diminishing.** Fold it into the Composure cap.
- **Shoo hazards** (OQ20). Random from the player's view, no system depends on them, and they cost a red-telegraph slot.
- **Crew's Zoomies II tier** (C-16). It is a second definition burden on 5+ Zoomies for an unlock beat; Loyalty already gates stats.
- **Crew's extra statuses** (C-13) and the 50% "Blinded" miss (C-5).
- **One of each duplicate Knack pair** (C-15). That frees 3–4 of the 20 Knack slots, so the 20-Knack target is met with fewer designs.
- **Quick Swat's and Counter-Swipe's refunds** (C-12).
- **The F-10 and Crew F10 hand models.** Replace both with one encounter simulation owned by Combat. Inputs: Posse kit, stat weights, AI cadence, tokens, poise, Composure, phase rules. Outputs: TTK, Frazzles per phase, Move share, AI share and Nerve cost per encounter, each checked against the acceptance criteria.

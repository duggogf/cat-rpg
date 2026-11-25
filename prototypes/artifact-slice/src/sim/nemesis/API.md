<!-- PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see ../../../README.md) -->
# Nemesis ("Rivals") simulation API (M3)

Pure, deterministic, headless Rivals logic for `design/gdd/nemesis-system.md` (owner-feedback and consistency passes, 2026-11-24; `owner-feedback-rulings.md` and `consistency-pass.md` win where they differ). No rendering, no DOM, no `Math.random`, no wall clock. The presentation **calls verbs**, **reads** `board()` / `nameCard()` / `verdictOffer()` / `sniff()`, and **plays** the returned events. Every number is in `src/data/nemesis/*.json` with `_src`; showcase-only seeds are only in `showcase_overrides.json`.

**The binding rule** (`nemesis-patent-analysis.md` §5): *nothing Mikan does to one cat may change a different cat.* A Verdict changes only its cat; a loss only the victor; a join-in only the joiner (and the cats in that fight, by their own rows); an anger change only the Boss. `tests/unit/nemesis/invariants.test.mjs` hashes every other cat before and after.

```js
import { createTown, ARC } from '../sim/nemesis/index.js';

const t = createTown({ seed: 42 });                                   // L1D1
const t2 = createTown({ seed: 42, start: 'showcase_l2d2', branch: 'A' }); // A Nose-Touch · B Recruit · C Chase Off
t.onTerritory(territoryEvents);        // MarkApplied, CatDiscovered, BossWindowChanged, ContestEnded
t.onCombat(combatEvents, { patch: 'LPY' });   // EncounterStarted, CatRouted, FearTriggered, BossFlee, EncounterEnded
t.verdictOffer(); t.applyVerdict('nose');     // the three cards and their resolution
t.board(); t.tags('togemaru'); t.nameCard('daifuku'); t.sniff();
t.hash(); t.catHash('goma');
```

## Ids

Cats are `cats.json` Names: `mikan`, `hige`, `pon`, `kinako` (Crew); `daifuku` (Boss), `kagi`, `ohagi` (Captains), `togemaru`, `goma`, `sasa`, `kuri` (Keeper of PA; territory id `pa_tough`), `azuki` (Toughs), `nori`, `tsubu` (Roamers); uphill silhouettes `madam_sabi`, `oboro`, `ikari`, `shiosai_sil`, `botan`. The showcase's challenger is **`challenger`** (the same id as combat's `combatants.json` and the board model); a canon calendar challenger is `challenger_<night>`. Untracked combat ids (`stray`, `captain`) are ignored. Patches are Territory's (`LWC`, `LPY`, `PA`, `TSS`, `DEN`).

## Time

| Call | Rule |
|---|---|
| `createTown({seed, start, branch, showcase, overrides})` | `start: 'l1d1'` (day 1) or `'showcase_l2d2'`: plays L1D1–L2D1 **by the rules** from Togemaru's Verdict (`ARC` below), Kagi's L2D1 truce, then the showcase seeds (Daifuku anger 95, the night-3 challenger on LPY with its Rival tag forced to Togemaru (A) / Goma (B, C), join-in p 1.0). `town.startLog` holds those events. **Test/showcase only:** `'test_l2_kagi_rout'` plays branch B's Life 1, then Routs Kagi on L2D1 with Stash 150 and leaves his Verdict offer pending (Fair 96 open, Feast 192 short, Crew 4/6; mock 07) |
| `night({mikan_patches, challenger_target, raid_target})` | Step 3 for night *n* = today, then opens day *n* + 1: 3c truce expiry → Friend (R ≥ 75) or a waiting challenger; the F12 calendar (h + 2, every 4th; showcase: night 3); 3e F2 drift (the open arc lead does not decay) and anger −15; 3f the Declaration (≥ 3 encounters + ≥ 1 mark, or night 5); 3g the raid request (challenge > the lead > highest F3 at G ≥ 40 > `gang_orders`). Pon joins on day 2, Kinako on day 3 (story beats). 3a, 3b and 3d are out of the slice (plan §2.5) |
| `setPhase(p)`, `setClout(c)`, `setStash(n)` | Context for bark tags, the address word and the Recruit card's "Stash short" |
| `day`, `life` | Day 1 = L1D1, day 3 = L2D1 (F12 night numbering). `dayLabel(k, day)` → "L2 D2" |

## Encounters

| Call | Rule | Events |
|---|---|---|
| `beginEncounter({patch, opener, posse, opponents, combatants})` | `opener` ∈ `standoff` · `ambush` (Mikan's) · `ambushed`. Discovers tracked opponents; counts the encounter; writes `FIRST_MEETING`; picks the headline cat's Standoff line (F8, own history only); plays Old Gang reactions; **rolls the join-in** (F11, Life 2+). Read `town.s.enc.joiner` to choose the combat def with the guest | `CatDiscovered`, `Standoff {cat, trigger, template, text, n_mem, unskippable_s (1.0 when n_mem ≥ 1), card}`, `OldGangReaction {cat, old_boss, kind: defiant\|flinch, cowed_s, line}`, `JoinRolled`, `AllyJoined {cat_id, encounter_id, yowl_s 3, line}` |
| `greet(id, {patch})` | `TRUCE_GREET` with a Truce cat or Friend: a counted encounter (≤ 1 counted meeting a day) | `Standoff {greeting: true, counted}` |
| `routed(id, {by, how, damage_type?})` | `how: by_pile_on` is the Special / Team Pile-On row. The finisher's Style gives the damage type (Claw / Thump / Yowl). `routed('mikan', {by})` records a Lick In / the victor | — |
| `fear(id, fear)`, `fled(id)` | A Fear prop hit this fight (Water → damp cowlick); a normal flee | — |
| `endEncounter({outcome, victor_ids})` | `win` · `loss` · `rival_fled` · `player_fled`. §3.5 rows through F1 (caps 35 / 20). Scars (F7; Togemaru's first Rout always). Anger spent on win, loss, `rival_fled` (not Scram). **Loss:** only the victor (WON, +5 / −10, its Glory Title, a Boss's rematch plaster). **Win:** the Verdict is held for the highest-ranked Routed tracked cat; the others slip away now | `NemesisEncounterResolved {ledgers, scars, slipped_away, verdict_cat}`, `ScarGained {cat, scar}`, `SlippedAway`, `AngerChanged`, `VictorRecorded {cat, title, gloat}`, `VerdictOffered` |
| `onCombat(events, {patch, opener?, alias?})` | Maps Combat's events onto the calls above (`CatRouted.side === 'enemy'`; `FearTriggered` except `source: 'tell'`) | as above |
| `onTerritory(events)` | **`MarkApplied`**: anger +5 `over_mark` / +15 `counter_spray` on the Boss's own Clowder (`target_clowder`), never claim/rescue sprays; counts Counter-Sprays per post for F4 and the Keeper row. `CatDiscovered` (a sniff) sets the flag (not re-emitted). `BossWindowChanged(open)` queues the Sniff card and moves the Boss to `walking_out` | `AngerChanged {boss_id, stage, from, puffs, cause}` |

## The Verdict (key-screens §4)

`verdictOffer()` → `{cat, patch, life, g_pending, r_pending, keeper, n_counter_own, anger_stage_at_standoff, slipped_away, chin_up, strip, hint, cards: {nose, chase, recruit}}`. Each card: `{dir: up|left|right, title, available, line, chip, reason, reason_text, tell}`.
- **nose** (Up): F4 gate `G_pending < 50 + shift` and, from Life 2, not a loud take (Keeper with ≥ 2 Counter-Sprays on its own post; a Boss met Seething+). `tell`: `tail_still` / `tail_lashing`; `reason` `grudge` · `loud` · `boss_anger`; chip "10 days".
- **chase** (Left): always; `tell: mikan_turns_away`.
- **recruit** (Right): `bribe {free, fair, feast}`, `tiers [{step: free|fair|feast, price, value, tier}]` (Crew F6/F8), `make_room`, `stash`, `crew`; greyed reasons `recruit_not_slice` ("Turns its tail to the bell.", `tell: tail_to_bell`), `recruit_gate` and `recruit_boss` (`tell: bares_teeth`: the cat refuses), `stash_short` (`tell: eyes_lean`: not a refusal). Recruit is greyed **per cat** (`recruitable_slice`: Togemaru, Kagi, Daifuku at Regard ≥ 50), never per Life.

`applyVerdict('nose'|'chase'|'recruit', {bribe: 'fair'|'feast'})` → `VerdictApplied {rival_id, verdict, slipped_away_ids, patch, clears_post: true, line, ledger, loyalty?, bribe?, old_gang?, challenge_ended?}` (+ `NemesisArcClosed`, `NemesisArcAchieved`). Nose → `Truce` 10 days (then the join-in); Chase → `Gone` (legend card); Recruit → `Crew` with Loyalty (F6), `OLD_GANG(boss)` in its own Memory and `old_gang_nerves` (resist: Braggart, Stalwart, Brooder). Call Territory's `verdict(patch, v)` with the same patch for the Claim Spray.

**Togemaru's endings** (F11): Chase "Fine! I've got other walls. Better walls!" + "Run out of town"; Recruit + "Wears the bell now" (Aloof, Loyalty 44); Nose "Keep the post. I'll be back for it. Ten days.", the L2D1 greeting, Sworn Rival on night 3, the join-in against the challenger.

## Display (read-only; AC 25)

| Query | Returns |
|---|---|
| `board()` | `{day, life, day_label, branch, unlocked, scenes: [{id, name, kind (gang/silhouette/outsiders/bell), emblem, caption, dots [{id, met}], perch {cat, empty, mark, puffs}}], cats: [...]}`. Each cat: `{id, scene, anchor, order, haze, discovered, silhouette, crown, name, title, role, state, pose, marks {storm {face, word, large}, puffs, stage, sprig: truce\|flower, grumble, plaster, bell}, drawn_mark (≤ 1 at rest), scars, legend, old_spot {scene, mark: 'knot'}, arrow_to, tape_star, personality, style}`. **Anchors** (`board.json` `anchors`): `perch`, `steps` (Captains), `path` (Toughs), `wall` (Roamers), `stop` (Outsiders), `bed` (Crew), `truck_roof` (Mikan), `shade` (unmet cats; an unmet Boss keeps `perch` with `crown`), `walking_out` (window open), `beside_perch` (a Boss in truce), `haze` (uphill). `order` = discovery order within (scene, anchor), centre line out |
| `tags(id)` | `{focus, in_scene: [≤ 3 {cat, kind, word, icon}], chips: [{scene, cat, kind, word, icon, more}], overflow, all}`. Only between discovered cats; Rival > Kin > Old Boss / Old Gang. Gang/Boss is `arrow_to`, never a tag |
| `nameCard(id)` | Unmet: `{silhouette, crown, line: "Not met yet…" / "A stranger's scent. Staking …"}`. Met: `{name, title, role_tag, style_icon, personality_word, grudge, regard (pictogram words), face, bitter, sprig, puffs, scars, history {day, line}, context {kind: anger\|roaming\|truce\|friend\|gone\|stake\|raid\|crew, line, puffs, stage, fired, pips}, ties_overflow}` |
| `rivalCard(id)` | The full card: + `history[]` (every Memory entry, pinned first; an authored pre-game entry is labelled "Before you", not "L1 D0"), `ties[]` (incl. Boss), `fears` ("?" until revealed), `anger {puffs, stage, lines}`, `recruit_gate`, `challenger_pips`, `legend` |
| `boardView()` | The shape `src/ui/rivals-model.js` `fromNemesis()` reads: `{branch, anger (puffs), discovered {id: bool}, cats [{id, discovered, state: present\|crew\|gone, marks {storm, sprig, puffs}, history {day, line}, tapeStar, card}], ties [{a, b, kind}]}` |
| `sniff({consume})` | `{items: [≤ 3; Life 1 day 2: 1], forecast {motive, patch, patch_name, attackers [{id, silhouette, name}]}}`. Item kinds in priority: `declaration` {title "Sworn Rival", face, storm, scars, best_line, sprig} · `arc_closing` {title "Wears the bell now" / "Run out of town", line from the cat's own record that never repeats the title, e.g. "Aloof. Notched. On the Posse bench."} · `challenger` {silhouette, line, patch} · `boss_window` · `anger` {puffs, stage} · `arc_lead`. `consume: true` once when the Doorstep plays it |
| `boardOpened()` | Clears tape stars |
| `combatProfile(id)` | RivalCombatProfile: level, style, fears, scars, `anger_stage`, `fired_up_s`, `rematch_nerve`, `old_gang_nerves`, `old_boss_id`, `kin_ids`, `rival_ids` (Combat's `opts.anger: {id: stage}`) |
| `snapshot()` | `{day, life, day_label, phase, clout, branch, cats, offer, encounter, raid, arc {cat, open, declared, face, closed_how, achieved, encounters, marks}, verdicts, board}` |
| `hash()`, `catHash(id)`, `catHashes()` | 16 hex chars (`core/hash.js`); `catHash` covers one cat's record plus the lines it has said |

## `ARC` (the reference path, played by the rules)

`ARC.l1d1(t)`, `ARC.night(t, n)`, `ARC.l1d2(t, {ambush, counterSprays})`, `ARC.sniffDaifuku(t)`, `ARC.kagiTruce(t)`, `ARC.l2d1(t)`; `BRANCH_VERDICT = {A: 'nose', B: 'recruit', C: 'chase'}`.

## Run

```bash
node --test 'tests/unit/nemesis/*.test.mjs'
node tools/nemesis-run.mjs [--seed 1] [--branch A|B|C|all] [--json out.json]
```

## Assumptions (flagged)

- F8 ties: a template written for the speaker's personality beats an `any` floor before the seeded pick (F8 is silent; keeps Togemaru's farewell).
- The "clean win" row (+8 Regard) applies to each Routed cat in a won Standoff-opened fight with no Fear prop on it, Verdict and slipped-away cats alike (matches §3.16's R 16 / 23 / 33).
- A join-in guest's Rout counts as the Posse's (the opposing Rival is treated as against any Posse cat, G7).
- A loss changes nothing for non-victor opponents beyond the encounter count and discovery made at the Standoff (AC 27).
- The anti-repeat list `recent` (F8 `recent_any`) and the `STANDOFF_FIRST` retirement are town-wide by the GDD; they are presentation state, excluded from `catHash`.
- Kagi's L2D1 truce in the showcase is played as a quiet TSS take + Nose-Touch (`showcase_overrides.json` `l2d1_kagi_truce`), so he carries what the rules gave him (a 35% Scar roll may land).
- Out of the slice (plan §2.5): adaptation and Strengths growth, town events, betrayal, Rival Ambush placement, Titles beyond Glory Titles on a Lick In / win.

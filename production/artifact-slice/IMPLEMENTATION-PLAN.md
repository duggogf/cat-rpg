# Cat RPG: Browser Showcase Slice, Implementation Plan

| | |
|---|---|
| **Owner** | technical-director, with the prototyper; producer for estimates and the cut list |
| **Date** | 2026-11-24 · **v2** (revised for the owner's comments C1–C6) |
| **Status** | Plan. The prototype folder is scaffolded; **M0 has not started.** Approve it, or change the defaults in §8 first |
| **What it is** | A ≈ 14-minute playable showcase in one shareable claude.ai Artifact page, for stakeholders, showing gameplay, the owner's new direction and the art direction. **Desktop only** |
| **What it is not** | The Unreal Engine 5.8 build or the 2–2.5 h vertical slice (`design/GDD.md` §4). The code is throwaway; data, tuning and findings carry over (§7) |
| **Canon** | `design/GDD.md` v1.2 and the system docs, under `design/reviews/owner-feedback-rulings.md` (OR-xx) and `design/reviews/owner-feedback/consistency-pass.md` (F1–F12). Showcase-only seeds and simplifications are listed in §2.4 and kept in one file; the design is never changed here |

## Changes since v1

- **The owner's direction is now the spine of Life 2** (rulings §2 "Showcase scope"): the **Rivals board** replaces the Fence Line, staged as a **perspective gang scene** per C6 (silhouettes, one sniff-to-discover moment, hover tags); the Verdict has **three cards** (Humble and its branch are gone; no lead re-naming, so Goma never becomes the lead); **district influence** sits in the Turf Board header and is filled by a **rescue Spray that brings Daifuku down off his wall**; a **challenger** is announced, stakes Laundry Pole Yard and replaces the optional Goma/Sasa fight, ending in a second Verdict and, in the Nose-Touch branch, a **join-in**; the **unified four-zone Turf Board**.
- **Losing → Night → home** is an **optional, budgeted branch**, never forced: an optional phase-1 **Daifuku bout** (Furious, so Fired Up all fight). A wipe plays nightfall, the closed street and the Routed Evening's plaster beat; reaching his phase break sends him back to the Den.
- **Daifuku moves from OUT to IN** (the reveal and the optional bout, on one arena kit). **Togemaru's first Rout always scars** and the Nose-Touch branch's **Declaration on night 3** are canon now, not showcase cheats.
- **Phone support is cut (owner decision, 2026-11-24).** Desktop only: keyboard + mouse and gamepad. Small or touch screens get a "best on desktop" card. Touch controls, the phone performance tier, phone shadows and audio pre-rendering, and every phone test are removed; **M7 drops from 4–5 to 2–3 sessions**.
- **Estimates:** 45–53 sessions (was 42–50); see §5 and §8 Q3. M0 is still first and unchanged in intent.
- Trims to stay ≈ 14 min: montage 35 → 25 s, overnight diorama 15 → 10 s, Turf Board first use ≤ 45 s.

---

## 1. Purpose and success criteria

### 1.1 What a stakeholder must experience in one sitting

1. **The look.** Within 30 seconds: "a hand-painted anime I can walk around in". Inked cel cats over painted streets and sky, from any camera angle.
2. **The brawl.** They switch cats and command a Move in Slow Blink. Before minute 4 they finish their first **two-cat Pile-On**.
3. **A Rival who remembers.** Togemaru flees on day 1, returns on day 2 and **cites yesterday** (≈ 7:15). They give him one of **three Verdicts**, and it shows on his model (a Scar) and on the **Rivals board**.
4. **A town of cats who know each other.** The Rivals board as a **staged alley scene**: Daifuku on the far perch, the gang down the steps with name ribbons (role tags on the focused cat's card), silhouettes for cats not yet met; they **hover a cat and see its ties**, including one they discovered by sniffing.
5. **Territory that never stays won.** A stranger **stakes their post**; the **influence bar** sits at 95%; one rescue Spray fills it and **the Boss climbs down off his wall**. They read the threat on the **unified Turf Board**, **post a Sentry**, sleep, and find the result **as a pile of fish on the Doorstep**, with the bar a little lower for the night.
6. **Home.** The HUD fades at the garden wall and the camera drops to cat height. **The Call** (E4–G4–C4), the bell on the fourth beat, then a wordless scene with Haru at the upright piano: Mikan walks the keys and she plays a bass line under the steps.
7. **Optional: losing.** Those who take on the Boss early and lose see the day end: moon-blue nightfall, the walk home, and Haru's sticking plaster.

**The conclusion we want:** "Boss outside, pet at home works, the Rivals and the turf feel alive, and this team can make it look like this."

### 1.2 What it proves (against `final-assessment.md` §4)

| §4 item | This build | Evidence |
|---|---|---|
| 11 Reference closeness | **Answers it** (main purpose) | M0 go/no-go; 3D frames under a free camera |
| 10 Cat scale 1.25× at home | **Answers it** | Piano bench and lap shot |
| 2, 3, 4 Readable brawl; does it hit; personalities read | **Partly** | Random-pause shots; tier feel plus flash screening (not a certified Harding pass); three Crew personalities plus a Braggart enemy |
| 1, 5, 8, 9 Conducting fun; Pile-On worth it; wordless beat; hum the Call | **First signal** | Session telemetry on the end card; a muted home run; the Call heard three times |
| 12–14 Want home; care; real posting | **Shows, not proves** | One forecast threat, three cats, a counter, resolved by the real formula |
| **Owner comments C1–C6** | **Shows each one** | C1/C6 the board scene, discovery, tags, anger puffs; C2 the loss branch; C3 the influence bar, its decay and the window; C4 two three-card Verdicts and a join-in; C5 the challenger and the unified Turf Board |
| 6, 7, 15–17 | **Not tested** | Need the engine slice |

**Deliberately not proven:** the 25-minute day, the 7-day economy, Boss pacing, Verdict shares, long-run Rival emergence, betrayal, Unreal performance.

### 1.3 Acceptance

- The main path takes **11–15 min** for a first-time player without help (fast path ≈ 12:30), measured by an in-page timer. **Each optional Daifuku branch adds ≤ 2:30** (≤ 17 min in total with the challenger fight).
- Title within **≤ 6 s** on broadband, **≤ 12 MB** total download, **≥ 50 fps** at 1080p on an Iris Xe or M1-class laptop.
- **Zero** requests to non-allowlisted hosts and zero console errors. The page boots with `localStorage` blocked.
- **Desktop only.** Keyboard + mouse and gamepad, both able to finish the main path. When the page has **no fine pointer** (`any-pointer: fine` false) or the viewport is **under 900 × 500 CSS px**, it shows a **"best on desktop" card** (the title vista, one line, no horizontal scroll at 390 px); a key press or a connected gamepad offers "Play anyway". There are no touch controls.
- Every milestone's screenshots are retained in `production/qa/evidence/artifact-slice/`.

---

## 2. Scope: the showcase slice

Life 1 days 1–2 stay almost intact (≈ 9 min). Then the Life 1→2 montage, and a jump to **Life 2 day 2** for the owner's direction: the Rivals board, one posting decision against a challenger, the Boss coming down, one evening at home and one tribute morning (≈ 5 min). The rules run for real; a director script decides where things happen, and a few showcase-only seeds (§2.4) make the owner's beats land inside 14 minutes.

### 2.1 Content list

| Kind | In |
|---|---|
| **Places** | Shrine steps in rain (K1.1). Haru's House: garden, Doorstep, entryway, Main Room with the upright piano and Gran's cushion. Hidamari Lane: **Low Wall Corner** (red-mailbox Scent Post, Sunspot), **Laundry Pole Yard** (gatepost, High Perch, a fence top beside the gatepost for the challenger, and **the yard wall above the wash tub: Daifuku's Morning patrol stop, one arena kit**), the lane between them, and **the Den wall, visible and sniffable within 10 m of a yard perch** (not playable). Persimmon Alley's mouth and Tofu Shop Step are skyline dressing and Turf Board stamps only. **The Lot** (kei truck, Turf Board). **The Rivals board set** (§3.4). ≈ 120 m of walkable lane; a simplified High Road |
| **Phases** | Morning, Day, Dusk; Night as the overnight diorama and, on the loss branch, the moon-blue walk home; rain only in K1.1 |
| **Cats** | **Mikan** (kitten in Life 1, young adult in Life 2; Scrapper). **Hige** (Stalwart · Bruiser; joins ≈ 2:00). **Pon** (Goofball · Yowler) and **Kinako** (Fraidy · Scrapper), both in the Life 2 state. **Togemaru** (Braggart · Scrapper), joins only on a Recruit |
| **Rivals** | **Togemaru, the First Thorn** (the fixed arc lead). Wall Sitter Toughs **Goma** (Togemaru's Rival) and **Sasa** (Kinako's Kin; met only as a silhouette). **Daifuku** (Brooder · Bruiser; the reveal and the optional phase-1 bout). **The challenger** (a generated Tough on a fixed showcase seed) + 1 Stray escort. 2 Strays, the Keeper Stray, 2 crows. Kagi, the second Captain and the uphill Bosses appear only on the Rivals board |
| **Moves (6 of the 8 ★)** | Mikan: Face Swat, Bunny-Kick · Hige: Shoulder Check, Belly Flop · Pon: Withering Hiss, Purr · Kinako: string only |
| **Combat** | 3-hit string with Style finishers, Hop, Skitter, Brace, Hiss (yellow interrupt, Back Down), switch, **Tag-In** (0.35 s), **Relay** (2–4 cats), Paws, **Slow Blink**, Ruffled and Frazzle, **Quick Pile-On** and **Full Pile-On**, the **bucket** and the **wash tub** (Water Fear), **Fired Up** by anger stage, the **allied guest** (join-in), Daifuku phase 1 with knock-offs and the phase-break flee |
| **Rivals layer** | Standoff name-card with a yowl-sting. Memory. The **day-2 memory line**. The **three-card Verdict** (Up Nose-Touch, Left Chase Off, Right Recruit; honest tells; halftoned cards with their reasons; "Free" in Life 1). Silhouette Scar by finisher type. **Declaration card** (Sworn Rival, branch A) or **closing card** (B, C). **The Rivals board** (§3.4): discovery, hover/focus tags, anger puffs, truce sprig, legend card, Outsiders gate. Old Gang shown by its **resisting** half (Hige's defiant line at Daifuku) |
| **Territory** | Over-mark, Counter-Spray, Claim Spray, **Rescue Spray**, 1–4 wisps. Two Patches taken live. **District influence** (read off Scent, decays overnight) and **the Boss window** opening on a Spray. **The challenger**: staking, over-mark, the `challenge` raid. **The unified Turf Board** first use as one decision. Raid resolved by `territory-management.md` §4.5. **Tribute** by §4.2 as a physical pile. Stash count |
| **Home** | K1.1 and K1.3 condensed, the M1 montage, and **Storyboard B "A Tuesday in Life 2"** with T2.2's piano duet folded in. One daily find (the bag charm). The Knock tutorial (chipped Bowl). Lap. **Loss branch:** the Routed Evening's **plaster beat** at night light, then Storyboard B's short form |
| **Audio** | The Call (voice), the bell, Haru's Melody, Gran's Foundation, the Lane theme (Day and Dusk mixes), a brawl loop, the Brass Call cell, Togemaru's sting, the Dusk chime, **Daifuku's yowl** and phase-1 cue, **the challenger's arrival sting**, **the 3 s join-in yowl**, **the nightfall sting**, ≈ 45 SFX by tier, Murmur. All synthesised (§3.6) |
| **Text** | English UI, cat speech, hint cards ≤ 6 words. Sound words in English, with a Japanese toggle. Human writing is Scribble only |

### 2.2 Player script (reference path; [fast path])

| Time | Beat | Teaches | Run by |
|---|---|---|---|
| — | **Title**: painted Dusk vista, the bell, "Click or press any key" (this also unlocks audio). Options: Reduce Flashes, Reduce Motion, shake, onomatopoeia, Kitten difficulty. On a small or touch screen: the "best on desktop" card | — | — |
| 0:00–1:00 | **K1.1** condensed. The kitten shivers, mews and climbs the box rim. Yellow raincoat; Haru's face (face event 1); she **hums the answer phrase**, not the Call. Entryway: plum slippers planted, yellow socks shifting, the saucer goes down. Morning: the collar goes on, and **the bell's first ring** ends the scene | Camera, move | Vignette; input latched across cuts |
| 1:00–1:45 | Garden → **crow on the lane-side wall top**. Home ↔ Explore camera blend at the wall | Move, Hop, Attack, Skitter | Systemic; tutorial fights can't wipe |
| 1:45–2:15 | **Hige**: "Use your whiskers, Collar." Whisker Sense trail; he joins | Whisker Sense | Scripted join |
| 2:15–3:45 | **Two Strays.** Switch, Paw, Slow Blink, command Hige's Shoulder Check (Splat), Frazzle → **two-cat Quick Pile-On ≈ 3:35** [3:00]. If no Frazzle by 3:15, it fills faster | Switch, command, **Pile-On** | Systemic |
| 3:45–4:45 | **Low Wall Corner**: Over-mark −10, Counter-Spray −30 (a sparkle cloud), the Keeper Stray: a yellow telegraph, Hiss, Back Down → **Claim Spray: Patch 1**; the Brass Call on melodica. Hint: "Fight to clear, spray to claim." | Scent, Spray, Hiss | Systemic Scent; scripted wave |
| 4:45–5:30 | **Togemaru Standoff**: "Nice bell, Collar. Does it ring when you run?" A short fight; at 25% he bolts, **uninterruptible on day 1** (`rival_fled`; no Verdict today) | Standoff, Brace | Systemic (OR-14.5) |
| 5:30–6:45 | **Sunspot nap → Dusk.** Lamp wave → chime → **the Call** one bar later → the bell glint on beat four → the Head Home thread → the wall blend → **K1.3**: socks, the blue-and-white Bowl, Tap-Tap, a stroke with the bell, Gran's fish flake, the Lamp; Knock chips the Bowl (optional). Sleep in the Box | Nap, Head Home | Vignette |
| 6:45–7:05 | **The Doorstep**: the first Tribute pile. 1-item Sniff: Togemaru's fresh mark on his gatepost | Tribute, Sniff | Formula |
| 7:05–8:35 | **Laundry Pole Yard.** **Memory line ≈ 7:15**: "I ran yesterday. Not off my own post, Collar." (unskippable 1 s). A quiet take (two Over-marks, one Counter-Spray; Daifuku's anger rises unseen). Mikan + Hige vs Togemaru + Goma; **Tag-In** taught on the first two windows. Quick Pile-On → **ear notch** (his first Rout always scars) → **the three-card Verdict** (Nose-Touch open, tail still; Recruit "Free"; Chase Off "Gone from town for good") → **Claim Spray: Patch 2** | Tag-In, Verdict | Systemic; the Verdict picks Life 2's snapshot |
| 8:35–8:55 | **Sniff to discover.** Hige: "That's Daifuku up there." Hold Whisker Sense on him for 1 s from the yard perch → the scent-outline confirmation [skippable; he then stays a crowned silhouette] | Discovery | Systemic rule; placed perch |
| 8:55–9:20 | **M1 The Kitten Grows** (25 s): seasons through the glass; the Piece through the walls, always stopping at the same bar. "Life 2" | Wordless; piano motif | Scripted |
| 9:20–9:45 | **Life 2 day 2, the Doorstep**: a bigger pile. The Sniff, in canon priority: **A** the Declaration card (Sworn Rival, sprig, notch) · **B** "Wears the bell now" · **C** "Run out of town"; **"A stranger's scent"** (a silhouette staking Laundry Pole Yard, tape star); **"The big wall is seething."** (steam puffs). Forecast: tonight's **`challenge`** on Laundry Pole Yard (the silhouette + a Stray) | Sniff cards, forecast | Snapshot; forecast from data |
| 9:45–10:15 | **The Rivals board** ("(N) See the Rivals"): the Lane's alley in deep perspective, Daifuku on the far perch with three puffs, the gang down the steps with name ribbons and faint answers-to arrows, unmet cats as silhouettes. One hint: "Hover a cat: see who it knows." Hover Togemaru → Goma **Rival** and his arrow to Daifuku brightens (B: **Old Boss** tag on Daifuku), his card slides up with his role tag; hover Daifuku → Hige **Old Gang** (if sniffed); Kinako shows no tag, because Sasa is still a silhouette. The Outsiders gate holds the challenger's silhouette | Rivals board, tags, discovery | Systemic display |
| 10:15–10:55 | **The Lot → unified Turf Board (≤ 45 s, one decision).** Header: **influence 95%**, crown unlit. Map: Laundry Pole Yard with a stake badge. The Tonight panel opens on it: the challenger + Stray, `challenge`, "Scent 48 · Strong at 60", tomorrow's Tribute. Carry a cat: **Pon** (laughs off the challenge: no over-mark), **Hige** (best odds, leaves the Posse) or **Kinako** (weak alone). The odds bar in three segments, no percentages | Sentries, counters | Systemic; seeded per save |
| 10:55–11:15 | **The gatepost.** The challenger glowers from the fence top beside it. **Rescue Spray the gatepost** (48 → 90; hint "Spray it Strong. The bar fills.") → **influence 100**: Daifuku's yowl rolls down and he climbs to his Morning stop on the yard wall above the wash tub (≈ 15 s, in view, control kept); a crown tick on the compass | Rescue Spray, the Boss window | Systemic window; staged climb |
| 11:15–12:15 | *Optional* [fast path: "Nap to Dusk"]. **The challenger**: "This post's mine now, Collar." Challenger + 1 Stray at the gatepost, the **bucket** and a **Relay**. **A:** a 3 s yowl and **Togemaru joins** as an allied guest (sprig plate). Rout → **the second Verdict** (Chase Off or Nose-Touch; Recruit halftoned, "turns its tail to the bell"). The challenge ends; no Scent is gained | Relay, Fears, join-in | Systemic; join forced in A |
| *branch D* | *Optional* **Daifuku bout** at the wash tub (≤ 1:30): Standoff with his puffs; Hige's own line "Not your cat anymore." (B: Togemaru's too); **Furious = Fired Up all fight**; phase 1 only. **A wipe → branch L.** **His phase break** → he leaps back to the Den (`rival_fled`, anger spent), and the day goes on to Dusk | Fired Up, knock-off | Systemic fight; phase cap |
| 12:15–13:35 | **Dusk → home (Storyboard B).** Call, thread, loafers kicked askew (she was late), Feeding, **Whisker Sense: a yellow trail to the bag charm**. Haru at the upright stops at the same bar, twice. Mikan walks the keys (quantised, the Call cell masked). She plays **a bass under Mikan's steps**, then lifts Mikan to her lap. Gran's slippers stop in the doorway and stay [≈ 1:00] | Piano, Lap | Scripted beats, free roam between |
| 13:35–13:45 | **Overnight diorama** (10 s). Moon-blue silhouettes at the gatepost act out the rolled `challenge` (Repelled or Scuffed; nothing is Lost while the window is open), or a dozing Sentry on a quiet post if the challenger was Verdicted | Overnight steps 2–4 | Systemic outcome, staged |
| 13:45–14:20 | **Tribute morning.** The pile shows the night (full; a gap with paw prints and twice the Patch's pay stolen; or, if the challenger was left alone, a stranger's mark on the post and a thinner share). The result card shows the **influence bar ticking down** with the night's decay (Tofu Shop Step slips below Strong; the window stays open above 75). → **Rivals board** (what changed, with tape stars) → end card: session stats and two questions ("Name a Rival and what you did to him." "Name one thing Haru does.") | Consequence, decay | Systemic |

**Branch L, the loss (from branch D):** the Gloat (≤ 3 s; his Title stamp) → **nightfall** (a 2 s pom iris: the sun drops, the moon rises, the street empties) → the haul tally → Mikan gets up and the **Head Home thread is already drawn**; the **closed street** (only the thread, the dial and the Rivals binding) and a ≤ 60 s walk under moonlight (autopilot at 60 s) → the garden wall → **the Routed Evening**: Haru kneels and puts a sticking plaster on Mikan's ear (≤ 30 s), then Storyboard B's short form at night light (piano and Lap, ≈ 0:50) → the diorama → the morning, where Mikan wears the plaster and **only the victor** may cite it ("Nice plaster, Collar. Fall off a cushion?"). Branch total ≈ 16:40 with the challenger fight, ≈ 15:40 without.

Fast path ≈ 12:30 (no sniff, no challenger fight, Storyboard B short). There is no fail state; the Head Home thread and drowsiness bring a dawdler home.

### 2.3 Branches

- **Togemaru's Verdict** picks one of three authored One-Cat-Schema snapshots for Life 2. There is **no lead re-naming**: Goma never becomes the lead, and Togemaru never raids in Life 2 (he is not hostile in any branch).
  - **A, Nose-Touch:** a truce (sprig); declared a **Sworn Rival** in the L2D2 Sniff; the challenger's Rival tag points at him, and **he joins the challenger fight**.
  - **B, Recruit (free):** in the Crew (Aloof, notched, on the Bell scene of the board), available for the Posse; defiant at Daifuku. The challenger's Rival tag points at Goma.
  - **C, Chase Off:** Gone; his legend card; "Run out of town". The challenger's Rival tag points at Goma.
- **The second Verdict** (the challenger): Chase Off (Gone, a legend card at the Outsiders gate) or Nose-Touch (a sprig). Either ends the challenge, so tonight's `challenge` raid is declined.
- **Branch D / L** as in §2.2. If the bout slips its milestone, the **fallback** is a chapter-select seed with a stronger challenger that wins, which demonstrates the same loss flow.
- **The raid** draws from `rng(save_seed, day, 2, "territory", patch)`, so it is reproducible.
- **Chapter select** offers: each chapter, "Branch A / B / C", **"Lose to Daifuku"** (the bout with Mikan + Pon only, so the loss flow is near-certain for a viewer who asks to see it), the combat sandbox, and "new seed".

### 2.4 What runs for real and what is scripted

| Runs for real (data-driven, by the docs) | Scripted, faked or showcase-only (all seeds live in `showcase_overrides.json`) |
|---|---|
| Combat F1–F6 and F11 (Fired Up), telegraphs, attack tokens, poise, Ruffled, the 6 s Frazzle window, the allied guest rules | Where encounters spawn and what they contain; the challenger's perch beside the gatepost (so the post can be Sprayed without engaging it) |
| Posse AI by personality, the R-G self-cast toggle on | Tutorial fights can't wipe; the Frazzle boost; Hige's join and his sniff line |
| The tier table T0–T5 and the DR-50 safety arbiter | The Life 2 snapshots: levels, Loyalty, Scents (Low Wall Corner 80, Laundry Pole Yard 48, Persimmon Alley 75, Tofu Shop Step 70 → **influence 95**), Kagi in truce, Daifuku **Furious** |
| Grudge/Regard ledger, Memory, bark score F8, Scar from damage type, Togemaru's first-Rout Scar | **The challenger arrives on night 3** (canon: night 5) with its Rival tag forced to Togemaru (A) or Goma (B, C) |
| **The three Verdicts and the Nose-Touch gate** (Grudge + shift; the quiet-take clause from Life 2; Life 1 exempt) and their tells | **Join-in probability 1.0** in A (canon 0.35–0.65) |
| **Discovery** (encounter, 1.0 s sniff within 10 m), **relationship tags** from fixed seeds, anger stages F10 | Daifuku held at his Morning stop through Morning and Day (no Tofu Shop stop); `boss_phase_cap` = 1 for the bout |
| Scent bands, wisps, Over-mark, Counter-Spray, Claim and Rescue Spray, `MarkApplied` | The phase clock jumps on naps and beats (no 16-min real clock) |
| **Influence** (Territory §4.14) and **the window** opening at 100 and holding at ≥ 75; overnight decay and the challenger over-mark | The window's climb-down is an authored clip; the overnight diorama stages the rolled result |
| Raid resolve §4.5 incl. `challenge` (`motive_mod` 1.10), Tribute §4.2 | All vignettes: shots, timelines, Murmur takes |
| **The loss flow**: clock to Night, the closed street, −20% haul, only the victor changes | The Routed Evening's short form of Storyboard B |
| **The patent invariant**: no Verdict, loss, join-in or anger change alters any cat but its subject (unit-tested) | — |
| Camera states and collision from `camera_states.json` | — |

### 2.5 OUT

Kagi as a fighter, Tofu Shop Step and Persimmon Alley as playable Patches; Daifuku's phases 2–3, his Day and Dusk stops, the Den Claim Spray and `DistrictClaimed`; **the flinch half of Old Gang Nerves** (Cowed at the Old Boss needs Kagi; the resisting half shows); Zoomies; Lessons, Bribes (Togemaru is free in Life 1; the challenger's Recruit is greyed), Share and prices; XP and levels; Loyalty arithmetic, Wavering and betrayal; the Caterwaul, the presence rule and Night roaming; Late Home; K1.4, K2.1–K2.5, T1.1, T2.1; town events (newcomers, feud scuffles) and the board's "Last night" replay; the Usurper; Ambushes; adaptation and Strengths; Lick In and Titles; playable uphill board scenes (haze silhouettes only); the Gift Jar beyond one curio; full High Road platforming; damage numerals; full remapping; mid-chapter saves; a Japanese UI; generated Crew; street humans; **touch controls and any phone layout**.

**IN despite its size:** a **combat sandbox chapter** (Mikan, Hige, Pon and Kinako vs Goma, Sasa and Strays, with the bucket). Stakeholders will ask to "just fight", and it reuses everything.

---

## 3. Art pipeline in code

**The constraint:** no artist and no image generator, so every pixel comes from code agents write. There are three moves:

1. **Reuse the preview kit.** Its SVG helpers already match the palette, the line and the paint grammar, so we bake them to textures in headless Chromium.
2. **Build cats as signed distance fields (SDFs).** Smooth bean, chestnut and pom primitives are polygonised offline into seamless skinned meshes.
3. **Let shaders enforce "ink what acts, paint what stays".**

### 3.1 Characters (inked cels)

- **Modelling.**
  - Base meshes are Round, Standard and Long, plus Mikan's kitten head and pom tail, and Daifuku's oversized Round. Each is authored in `tools/cats/*.sdf.js` as smooth-unions of ellipsoids and capsules over a ≈ 24-bone skeleton (spine, neck, head, jaw, 2 ears, 6 tail bones, 4 legs).
  - `bake-meshes.mjs` polygonises with surface nets (≈ 4–6k triangles), bakes **smoothed normals** into a second attribute for the outline, derives 4-influence skin weights from distance to each bone, and writes `.bin` plus JSON.
  - Ears and tails are rigid parts, from the generator's 4 tail shapes and 3 ear shapes. Scars per art bible §3.5: the ear notch is an SDF subtraction; the kinked tail is 2 bones locked at 40°.
- **Coat patterns without UVs.** Object-space mask functions run in the fragment shader. Mikan's cap is a head-local height test plus a sphere over the left eye. Tabby is banded noise along the spine. Calico is 3 Voronoi blocks. Edges are hard and **borderless** (L-7). Colours come from `Kit.COATS`; shades come from the kit's lavender multiply.
- **Toon shading.** Two tones with a hard terminator, shade share 15–25% under Day, and a **separate character key light** per phase (E-3). Characters receive **no** shadow map. Shade on a cat is a **zone tint**: one sun ray from the cat's root against the collision boxes, blended over 80 ms. Under every cat sits a feathered Shadow Wisteria contact blob at 45% (E-4).
- **Faces.** The kit's 12 front-head expressions are baked into a 1024² decal atlas and drawn on a curved card skinned to the head bone. Expressions swap on twos.
- **Outline (L-3 to L-5).**
  - An **inverted hull** from the smoothed normals, expanded in clip space by `px × 2 / renderTargetHeight`. That gives 2.0 px at 1080p at any distance, falling to 1 px below 4% of screen height.
  - Combatants get three hulls: Ink → Clowder keyline (Bell-Gold, Sage, or the outsiders' colour for the challenger; 2 px) → 1 px Paper Cream rim. A join-in guest keeps Sage with a sprig tick.
  - Interior lines live in the face atlas and in thin mesh strips.
  - There is **no screen-space edge pass**, so the environment is never inked.
- **Animation.** Poses are JSON (bone quaternions plus scale for squash and stretch), authored in an in-page pose editor (`?tool=pose`) that shows the flat-black silhouette check.
  - **Locomotion runs on ones,** with a procedural gait per personality (the Braggart's fourth-step hitch, the Fraidy's stop-start, the Goofball's skip). Tail carriage is a pose layer.
  - **Actions run on twos.** Strings, finishers, Tag-In leaps, takes, Routed bolts and Pile-On flourishes are pose-to-pose clips sampled at 1/12 s of *sim* time, so hit-stop and Slow Blink lengthen the holds (art bible §8.4). New clips: Daifuku's climb-down, Climb Back and phase-break leap; the challenger's staking pose; the defiant stare; the guest's yowl-in.
  - **Smears** are a 1–2 drawing stretch pose (×1.6 along the velocity) plus an inked multi-paw decal.
- **Humans from cat height.** Haru and Gran are built from column legs, soft-box hems, detailed shoes and socks, and **hands with ≈ 15 finger poses** (Tap-Tap, chin scratch, palm-down approach, the lift, **the plaster on the ear**). Faces appear only in the two face events and the lap shot.

### 3.2 Environment (painted, unlined, from any angle)

- **Geometry** comes from `world/lane.json`: extruded walls and houses, roof prisms, fence runs, tube poles and wires, steps, the shrine set, the yard wall arena kit with the wash tub. A little vertex noise gives the hand wobble. Every block also emits **collision boxes** for movement and the camera.
- **Painted textures baked from the kit.** `bake-textures.mjs` runs `design/previews/kit/kit.js` in Playwright and renders its painting helpers into 2048² trim-sheet atlases per phase (plus the moon-blue Night set). Texel density is E-7 halved to fit the download: ground 256 px/m, walls 128, roofs 64.
- **The environment shader** uses a **soft 2-band sun ramp** (10–15% terminator, E-1), phase shadow tint (never grey) and baked vertex ambient occlusion, with phase uniforms that blend over ≈ 20 s (the loss nightfall snaps them inside the iris). Cast shadows: one 1024² shadow map that only environment surfaces receive, with wide filtering and a Wisteria tint; the quality ladder (§4.8) can turn it off.
- **Painted from any angle:** a painted sky dome per phase; 2–3 parallax backdrop card rings at 150–400 m; drifting cumulus cards; **foliage clumps** of crossed alpha-cut cards with sphere-projected normals; a fade to the horizon colour beyond 40 m; pitch clamped to −10°…+55°.
- **Paint post-process (decided at M0).** The environment renders to a target with depth. A fullscreen pass adds paper grain, light colour quantisation and a 3×3 Kuwahara-lite filter. **Characters render after it**, so the cels stay crisp ("printed characters, painted world").
- **Rules checked by tests:** walkable ground at L* 35–80, and the E-5 separation test (§5.2).

### 3.3 VFX (inked, flat, on twos)

- **Source.** Drawings are baked from the kit into sprite atlases: `slashArc`, `impactBurst`, `dustCloud` (an 8-drawing Pile-On loop), `speedLines`, `sparkle`, `frazzleOrbit`, `scentWisps`, `ribbon` (the Head Home thread and Tag-In streak), the three telegraph decals, **`steamPuff`** (anger, 0–3), and the **Fired Up** flicker.
- **Slash arcs** are world-space ribbons along each hit's authored paw path.
- **Speed lines** are a screen overlay that swaps between 3 drawings and keeps the centre third clear.
- **Impact frames.** **Local (T3):** a disc masked to ≤ 15% of the screen. **Full-screen (T4/T5):** a three-value flatten; the background becomes one mid tone matched to the frame's mean luminance (±0.10), characters become Ink silhouettes through a stencil.
- **Onomatopoeia.** The kit's `sfx()` renders the 16 English and 16 Japanese words at T4 (12% of screen height) and T5 (30%), baked to a signed-distance-field atlas, world-anchored, at most one on screen.
- **The safety arbiter** (`sim/combat/safety.js`) owns the single screen-wide channel: ≤ 1 full-screen frame per second, ≤ 2 flashes per second and 6 per rolling 5 s, global hit-stop ≤ 200 ms per rolling second, ≥ 2 frames for every look event. It also screens the nightfall iris. Reduce Flashes and Reduce Motion work as specified.

### 3.4 HUD, screens and the Rivals board set

- **`kit.css` is used directly** (bean panels, pom buttons, gauges, ribbons, bubbles, `k-band`, `k-drowsy`), plus `Kit.ui.*` SVG for the phase dial, button glyphs, icons, wisp rows, the **influence bar** and **chestnut portraits** drawn from the live coat seed (a new Scar shows on the portrait). Fonts: M PLUS Rounded 1c and Dela Gothic One from Google Fonts, with a rounded fallback.
- **Screens:** Title, the desktop card, Options, Chapter select, the street HUD (incl. the closed-street state), the combat HUD (`hud.md` §4.1; the guest plate), the Slow Blink menu, the Standoff band, the **three-card Verdict** (hold 600 ms or press), the Morning Sniff stamp cards, the **unified Turf Board** (four zones per `key-screens.md` §5; a top-down orthographic map render), **the Rivals board**, Pause (Mikan · Rivals · Options), the loss beat, and the end card.
- **The Rivals board is a staged 3D diorama (C6; `key-screens.md` §2 owns the layout).** It is not a 2D panel: it is a small separate scene, rendered alone while the street is paused.
  - **Set:** a narrow alley climbing away from a fixed camera in deep perspective (vFOV ≈ 35°, low eye height): stone steps and a path toward the camera, a raised porch perch at the vanishing point for the Boss, built from `world/board_lane.json` with the same environment shader, baked paint and phase lighting as the street (Dusk gold by default; moon-blue after a loss).
  - **Cats:** the live SDF meshes in a neutral idle per personality, placed on authored **step anchors** by each cat's fixed role (`relations.json`); play never reorders them. **Undiscovered** cats use the same anchor with a flat Ink material and a generic sit pose (no coat, Scars or pose), plus a crown outline for a Boss. Gone cats are paper legend cards on their anchor.
  - **Labels:** name ribbons, relationship tags (≤ 3, on focus), puffs and sprigs are DOM elements positioned each frame from projected 3D anchor points; **answers-to arrows** are dashed SVG paths between projected anchors; the header (place name, scene strip), the bottom-left cat card (on focus only; carries the role tag) and the bottom-right button bar are static DOM. No fact column and no influence bar on the board (owner declutter, 2026-11-24).
  - **Interaction:** mouse hover raycasts against per-cat bounding capsules (120 ms delay); pad and keys move focus in step order (nearest first); L1/R1 cycle scenes (the Lane, the Outsiders gate, the Bell at the Lot); 2–4 px camera drift on focus change (off under Reduce Motion).
  - **Budget:** ≤ 200 draw calls and ≤ 250k triangles, so it opens in ≤ 300 ms after the first visit (the set is built once and kept).
- **Sizing:** scales from `min(vw, vh)`; text floor 28 px at 1080p, 150% option. Home shows pictograms only; the HUD fades over 800 ms at the wall.

### 3.5 Look risks, fallbacks, originality

Look risks and their fallbacks are §8 risks 1–3 and 5. Technical fallbacks: hull artefacts at joints → view-space offset and depth bias on tail and ear hulls; bake drift → bakes and tests share one Chromium and baked PNGs are diffed; a weak integrated GPU → the quality ladder (§4.8).

**Originality (applies at full reference closeness too).** Original characters; our own UI shapes (no brown name tags or cloud balloons); **no inside-looking-out veranda-to-garden pet shot**; no reference names or logos on the page. The board reference image (`design/reviews/refs/rivals-board-layout-ref.webp`) is a **layout reference only**: its cats, places and words are not used.

### 3.6 Audio in code (WebAudio)

The sound bible bans synths, so we **model acoustic timbres** rather than use synth sounds:

| Sound | Model |
|---|---|
| Upright piano | Additive partials with stretch inharmonicity, a hammer-noise burst, two-stage decay |
| Reed organ | Band-limited pulse through formant filters, plus bellows noise |
| Brass bell | Modal synthesis: partials at 1, 2.76, 5.40, 8.93 |
| **The Call** | Formant voice on an open "ah": E4–G4–C4, short–short–long, a scoop into G4, breath noise |
| Murmur | The same voice with random prosody and no consonant bursts, so there are no phonemes by construction |
| Shamisen and guitar | Karplus–Strong |
| Taiko | A membrane mode set plus noise |
| Brass and tuba | Saw stacks with filter envelopes and vibrato |
| Melodica and accordion | Detuned reeds |
| Cat yowls (Daifuku's, the join-in, stings) | The formant voice pitched and growled, with breath noise |

- **Music** is JSON scores played by a lookahead scheduler. Stems mute at phrase boundaries. The Call ducks all music by ≥ 9 dB. Hit-stop freezes the voices in its scope. The voice cap is 32. *(v1's phone pre-render fallback is removed.)*

---

## 4. Technical architecture

### 4.1 Library and versions

- **Three.js r160.1, UMD global**, the last release that ships `build/three.min.js` (checked on npm: r161 drops it; released 2024-01-22).
  - Production tag: `<script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>`.
  - At M0, check whether cdnjs (preferred) carries `https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.min.js`; switch to it if so.
  - Nothing else loads from a CDN. Any `examples/jsm` add-on is vendored into our bundle with `three` mapped to the global `THREE` (none planned).
- **Runtime:** plain DOM and kit.css, WebAudio, the Gamepad API. No other libraries.
- **Dev tooling (local only):** npm `three@0.160.1` as the CDN stand-in. `esbuild` bundles `src/` into one IIFE, `game.js`. Playwright 1.63; headless WebGL uses `--use-angle=swiftshader --enable-unsafe-swiftshader`. Unit tests use `node:test`; pixel checks use `pngjs`.

### 4.2 File layout

Code lives in **`prototypes/artifact-slice/`**: throwaway prototypes sit outside the code root (`directory-structure.md`), and the Unreal build will own `Source/`. Plans stay in `production/artifact-slice/`; evidence goes in `production/qa/evidence/artifact-slice/`.

```
prototypes/artifact-slice/
  page/index.html      # PUBLISHED fragment (no doctype/html/head/body): CSS, HUD DOM, three CDN tag, game.js
  page/dev.html        # full document, local three copy
  src/core/            loop fsm events rng clock save quality testhooks devicegate
  src/input/           keyboard-mouse gamepad actions
  src/data/*.json      # §4.4, mirrors the GDD tables
  src/sim/             combat/ (damage frazzle paws pileon tagin guest ai/ enemies tiers safety)
                       nemesis/ (ledger verdict gate discovery relations anger challenger)
                       territory/ (scent influence window raid tribute) day/ (director overnight phases loss) narrative/
  src/render/          toon outline env sky foliage shadows post impact boardscene cats/ humans/ vfx/
  src/anim/            skeleton poses clips gait stepper smear
  src/camera/          rig states collision framing shake home-clamp
  src/audio/           engine mixer scheduler instruments/ sfx murmur scores/
  src/ui/              hud plates slowblink verdict sniff turfboard rivalsboard loss title chapters endcard desktopcard
  src/world/           lane.json board_lane.json house.json lot.json builder collide
  tools/               build serve bake-textures bake-meshes check-budget flash-analyse pixel-checks cats/*.sdf.js
  tests/unit/  tests/smoke/
  dist/                index.html game.js data/ tex/ mesh/ audio/    # the publish set
```

**The publish set is ≈ 25–40 files.** Targets: page ≤ 200 KB, `game.js` ≤ 1.5 MB, textures ≤ 8 MB with no file over 4 MB, meshes ≤ 1 MB, audio ≤ 1 MB (no pre-rendered loops). `check-budget.mjs` fails the build on any Artifact limit.

### 4.3 Loop and state machine

- **Loop:** a fixed 60 Hz simulation with an accumulator and interpolated rendering. Three clocks: **real** (camera, UI), **sim** (×0.05 in Slow Blink, 0 in global hit-stop, local hit-stop per entity) and **step** (sim time quantised to 1/12 s).
- **Top-level FSM:** `Boot → DeviceGate → Title → ChapterSelect → {Vignette | Home | Street} ⇄ Screen(Sniff | TurfBoard | RivalsBoard | Pause | Options) → Overnight → EndCard`. `Street` holds Explore, WhiskerSense, Standoff, Combat and **ClosedStreet**; `Combat` holds Realtime, SlowBlink, Cinematic, Verdict, Gloat and **Nightfall**; `Home` holds Evening and **RoutedEvening**.
- **The director** is a JSON beat list (`beats.json`): preconditions, spawns, gates and next. Systems emit the canon events from `GDD.md` §16 on one bus (`EncounterStarted`, `CatRouted`, `EncounterEnded`, `VerdictApplied`, `MarkApplied`, `PatchChanged`, `InfluenceChanged`, `BossWindowChanged`, `CatDiscovered`, `AngerChanged`, `ChallengerArrived`, `AllyJoined`, `RaidResolved`, `TributeDelivered`, `HomeArrived`, `PhaseChanged`, …); the director, HUD, audio and VFX only subscribe.
- **The overnight** runs canon steps 0–6 (OR-20 order) with seeded substreams `(save_seed, day, step, subsystem, cat, ordinal)`.

### 4.4 Data (mirrors the GDD; this is what transfers)

Every table is a JSON array of rows keyed by `Name`, importable straight into a UE DataTable (§7). **Showcase-only values never sit in these files.**

| File | Source |
|---|---|
| `moves.json` | Combat §3.10 fields (`id, name, style, cost, type, mv, fz, role, creates/pays_on, target, range, ai_use, flags, feel_tier`) |
| `tiers.json` | Combat §3.17, T0–T5, plus the safety caps |
| `combat_constants.json` | F1–F6 constants, poise, tokens, Frazzle decay, `ai_fill`, the R-G toggle, Pile-On k, Relay bonuses; **F11** (`fu_dmg`, `anger_fu_s` by stage, `cowed_dmg`, `nerves_s`); the allied-guest rules; Daifuku's phase table and arena-kit fields |
| `styles.json`, `personalities.json` | AI targeting, Paw habit, perk, `guard_mod`, motive counters (incl. `challenge`), bonds and clashes, **Nose-Touch shift**, **nerves resist/susceptible**, gait and tail parameters |
| `cats.json`, `snapshots/*.json` | One Cat Schema rows (incl. `relations[]`, `discovered`, `old_gang_nerves`, `anger`, `truce_until_day`); the Life 2 states **A, B, C** |
| `rivals.json`, `barks.json` | Nemesis §3.5 event table and caps, Memory kinds (incl. `OLD_GANG`, `JOINED_IN`), the Scar map, **the three Verdicts and the F4 gate** (Grudge base, quiet-take clause, Life 1 exemption, reason lines), truce length, **F10 anger** (sources, decay, stages), **F11 join-in**, **F12 challenger calendar** (h + 2, every 4th night, ≤ 1 active, Repelled twice), discovery (10 m, 1.0 s), bark templates and tags (≤ 60 characters) |
| `relations.json` | The slice's fixed ties (Gang, Rival, Kin, Old Gang) and, for the C6 board, each cat's **fixed role tag** and **answers-to** line |
| `patches.json`, `territory_constants.json` | Territory §3.1–3.3, the §4.5 variables, motives, §4.2 tribute; **influence** (`n_outer` 4, Strong 60, open 100, close 75), decay and refresh, Claim 70 / Rescue 90, challenger over-mark −10, `challenge` `motive_mod` 1.10 |
| `day_constants.json` | The loss: clock to 720, field-haul loss 20%, the 60 s autopilot, closed-street rules; nap and phase values |
| `camera_states.json`, `board_camera.json` | Camera §3.2 table, springs, blends, collision, framing, the face clamp; the board diorama camera and step anchors |
| `phases.json` | Art bible §4.4 phase keys and Lane swatches (incl. the nightfall moon-blue) |
| `beats.json`, `vignettes.json` | Director beats; shot lists per `dual-story-progression.md` §3.8 (incl. the plaster beat) |
| `scores/*.json`, `sfx.json` | Music and SFX by tier |
| **`showcase_overrides.json`** | **Throwaway, never transfers:** the Life 2 day-2 jump, the snapshot influence 95, Daifuku Furious, the night-3 challenger and its forced Rival tag, join-in p 1.0, `boss_phase_cap` 1, Daifuku held at his Morning stop, the "Lose to Daifuku" chapter, the fallback stronger challenger |

### 4.5 Camera

`camera/rig.js` implements the `camera-system.md` states:

| State | Values |
|---|---|
| Explore | 3.0 m, +10°, recentre after 1.5 s; High Road and Low Ceiling sub-states |
| Whisker | +0.5 m, +8° |
| Combat | Framing point `lerp(C, T, 0.35)`, width 8.8–10.6 m, distance 4.5–7.2 m; soft and hard lock; Tag-In retarget 0.3 s |
| Slow Blink | 8.5 m, +50° |
| Cinematic | Standoff push-in; Pile-On wide; Daifuku's climb-down in view (control kept: a soft look-at bias only) |
| Home | 1.8 m, 0.3–0.6 m high; the §4.3 face clamp, released on Lap |
| Vignette | Authored shots; input latched across cuts |
| Board | Fixed diorama camera (`board_camera.json`) with 2–4 px focus drift |

- **Blends** use smootherstep, then the doc's half-life springs.
- **Collision:** five rays against the level boxes approximate a 0.15 m sphere-cast. The camera snaps in and eases out with a 0.4 s half-life. Camera-soft objects dither to 30%.
- **Shake** is the stepped deterministic pattern from `tiers.json`: each step held ≥ 2 frames, total clamped at 1.8%.

### 4.6 Input

- **One action map** with DR-08 bindings in `input.json`. Desktop only.
- **Keyboard and mouse:** WASD, LMB, RMB, Space, Shift, E, F, Tab, 1–4, Z X C V, J, Esc. **Pointer lock is optional** (toggled by a click); drag-to-orbit works otherwise. On the Rivals board, the mouse hovers cats for tags.
- **Gamepad:** the standard mapping; on the board, the stick or D-pad moves focus and shows the same tags.
- **Constraints:** every hold has a toggle. No audio before a gesture. No `alert`, `confirm`, `prompt` or downloads. No touch handlers.

### 4.7 Save

A try/catch wrapper around `localStorage` with an in-memory fallback. It stores the options, the chapters reached, the Verdicts and snapshot, discoveries, the raid seed and the post. Nothing depends on it, and chapter select is always open in showcase mode.

### 4.8 Performance budget (desktop only)

| | Mid laptop (Iris Xe / M1, 1080p) |
|---|---|
| Target | 60 fps (floor 50), DPR ≤ 1.5, dynamic resolution 0.7–1.0 |
| Draw calls | ≤ 350 on the street (environment merged per block ≈ 120, cats ≤ 60, VFX ≤ 60, sky ≤ 20); ≤ 200 on the Rivals board |
| Visible triangles | ≤ 500k |
| Texture memory | ≤ 160 MB |
| CPU per frame | sim ≤ 3 ms, submit ≤ 4 ms, audio ≤ 1.5 ms |

`quality.js` picks a tier from a 1 s GPU probe and the core count, and steps down if frame time stays over budget for 3 s: dynamic resolution first, then the paint post, then the environment shadow map. Headless runs can't measure GPU speed, so from M2 on each milestone logs a **manual capture on a real laptop** (one run with a gamepad) with the `?fps=1` overlay.

---

## 5. Milestones

An **agent-session** is one focused session by one specialist agent (≈ 2–4 h of agent work) that ends in a reviewed, runnable build. **Every milestone ends with a publish to the same Artifact URL** (§6.3).

| # | Milestone | Deliverable (demo-able) | Acceptance | Sessions |
|---|---|---|---|---|
| **M0** | **Look-dev spike: GO/NO-GO on the art target** (unchanged in intent) | Adult Mikan and one Wall Sitter (idle and walk) in **one lane corner**: plaster wall with coping, board fence, laundry pole, stone-lantern Scent Post, hydrangeas, a foliage clump, sky dome, sea card. Day and Dusk, free orbit camera. A comparison page beside `01-exploration.png` | (1) Side-by-side at the 01 framing in Day and Dusk, judged by the art- and creative-directors, then **the user**. (2) Pixel checks: line 2.0 ± 0.5 px at 1080p and at 85% scale; Ink ΔE ≤ 3; E-5 separation ≥ 20 L*; no grey shadows. (3) 8 orbit shots 45° apart, none reading as untextured 3D. (4) A silhouette strip of the 6 tail carriages. **Decision:** GO / GO with fixes / pivot to the §8 risk 1–2 fallbacks | **5–6** |
| **M1** | **Combat grey box** | The sandbox chapter: the full verb set, Tag-In and Relay, Slow Blink, Quick and Full Pile-On, the 6 Moves, personality AI, tiers and the arbiter, the combat camera and HUD; **the allied guest**; **Daifuku phase 1 on the wash-tub kit** (knock-offs, Climb Back, Fired Up by stage, the phase-break flee) | Unit tests reproduce F1–F6 worked examples (Pile-On 48 / 34.3 / 55.1 MV) and F11 (Fired Up seconds by stage; paused while Soggy). The same seed and input log give the same outcome hash. A smoke run reaches a Pile-On. A guest joins on cue and the opposing Rival's AI state is unchanged (hash). Daifuku: a scripted bot reaches the phase break; a passive bot wipes. 10 random-pause shots. Flash screening on a Pile-On | **8–9** |
| **M2** | **Lane, exploration, territory** | ≈ 120 m of lane with two Patches, the yard-wall stop and the Den sniff perch, High Road ribbons, Whisker Sense (incl. the 1 s sniff), Over-mark, Counter-Spray, Claim and Rescue Spray, wisps, `MarkApplied`, the Explore camera with collision, Day → Dusk with the lamp wave, the Head Home thread, the street HUD, the wall blend | A 5-min bot walk: zero frames with the camera inside geometry; the cat in frame ≥ 98%. Scent and influence unit tests (Territory §4.14 worked example: 95 → 100). 6 vantage shots × 2 phases. A real-laptop frame log | **6–7** |
| **M3** | **Rivals, Verdict, the Rivals board** | The Togemaru arc over L1D1–L1D2 (Standoff, sting, day-1 flee, memory line, the first-Rout Scar, **the three-card Verdict** with tells and reasons); discovery; **the Rivals board as a 3D perspective diorama** (§3.4) with ribbons, answers-to arrows, the focus card with role tags, silhouettes, hover/focus tags, puffs, sprigs, legend cards, the Outsiders and Bell scenes; the Declaration and closing cards | Ledger tests against Nemesis §3.5 and its caps; F4 gate checks (Togemaru 43 < 45 open; a loud take closes a Life 2 Keeper's card). **Patent invariant tests:** a Verdict, a join-in and an anger change alter no cat but the subject. One smoke run per Verdict (A, B, C) checks the stored state and the snapshot. Tag tests: no tag on an undiscovered cat; Kinako shows none while Sasa is unmet. The board opens ≤ 300 ms after first build; all slice cats fit 1080p without scrolling. Screenshots of each screen and scene | **6–7** |
| **M4** | **Home and story** | The house, Haru's and Gran's legs and hands, K1.1, K1.3, M1, Storyboard B with the piano duet and Lap, **the plaster beat** and Storyboard B's short form at night light, the Home camera, the Call system | No standing-adult face in 200 random free-roam frames. Shot-list screenshots (incl. the plaster beat). **A muted run reviewed against the Tier A lines.** The Call's pitches verified by FFT on an offline render (E4, G4, C4 ± 10 cents) | **7–8** |
| **M5** | **Day loop, overnight, owner beats, full script** | The director runs §2.2 end to end: the Sniff cards, the Rivals board stop, **the unified Turf Board** with the influence header, **the rescue-Spray reveal**, **the challenger** (staking, fight, second Verdict, join-in in A, over-mark, `challenge` raid), **the loss flow** (nightfall, closed street, walk home, Routed Evening hook) and **branch D/L**, the overnight diorama with decay, the tribute morning, chapter select (A/B/C, "Lose to Daifuku", sandbox, new seed), the end card | Raid odds match the §4.5 worked table (Stalwart single raider 90/5/5; Pon `grudge` counter 78%) and a `challenge` case. Influence after the night matches Territory §4.1 (seeded case with the gatepost guarded: Tofu Shop Step 70 → 58, bar 99, window open). Loss tests: clock = 720, −20% haul, only the victor's record changes. Full-run smoke tests reach the end card in A, B, C and L with no console errors. **Timed human runs:** main ≤ 15 min, fast ≈ 12:30, branch L ≤ 17 min. Turf Board first use ≤ 45 s | **6–7** |
| **M6** | **Audio** (in parallel from M1) | Instruments, the scores, ≈ 45 SFX, Murmur, the mix; Daifuku's yowl, the challenger sting, the join-in yowl, the nightfall sting | Property test: 10k random key-walks never form the Call. Duck ≥ 9 dB. Peaks ≤ −1 dBFS. Audio-director sign-off. A 3-person "hum the Call" check | **5–6** |
| **M7** | **Polish, accessibility, hardening, desktop gate** | All options, the JP sound words, Kitten difficulty, a loader, final screening, **the "best on desktop" card** | The full §5.2 suite green. Flash screening on the densest captures (a Pile-On; Daifuku's phase break; the nightfall iris). A keyboard-only and a gamepad-only full run. The desktop card at 390 × 844 with touch emulation, no horizontal scroll. The final evidence set | **2–3** (was 4–5) |

**Total: 45–53 sessions** (v1: 42–50). The critical path M0 → M1 → M2 → M3 → M5 → M7 is ≈ 33–39 sessions. M4 can run alongside M1–M2 after M0; M6 runs alongside from M1. With 2–3 agents in parallel that is **≈ 7–9 weeks**, plus the user's time at each gate. *Delta from v1:* the owner's direction adds ≈ +1 (M1: guest, Daifuku phase 1), +2 (M3: the diorama board, discovery, tags) and +2 (M5: Turf Board, reveal, challenger, loss branch); removing phone support saves ≈ 2 (M7) plus the pre-render tool inside M6.

**Cut order** (first cut first): the Daifuku bout → its fallback (a stronger-challenger loss seed; saves ≈ 1) → JP sound words → the paint post → the Outsiders and Bell board scenes folded into strips on the Lane scene → the Knock tutorial → the montage shortened to 15 s. **Never cut:** the two-cat Pile-On; the memory line and the three-card Verdict; the Rivals board scene with discovery and tags; the influence bar and the Boss coming down; a challenger; the post plus the morning pile; the loss flow in some form; the Call; the piano scene.

### 5.2 Automated harness (every milestone)

- **Test hooks:** `?test=1&seed=N&chapter=X&fixedStep=1` exposes `window.__cat` with `step(n)`, `input(log)`, `state()`, `hash()` and `shot(name)`, and turns off real-time pacing so runs are deterministic.
- **Sandbox checks (Playwright):**
  - any request that is not relative, or the local stand-in for the CDN, fails the run;
  - `alert`, `confirm`, `prompt` and downloads are stubbed and asserted unused;
  - a throwing `localStorage` stub must still boot;
  - no AudioContext starts before a click or key press;
  - the fragment has no `html`, `head` or `body` tags;
  - `THREE` exists before `game.js` runs;
  - `check-budget.mjs` passes;
  - **desktop gate:** at 390 × 844 with `hasTouch` the card shows and nothing scrolls horizontally; at 1920 × 1080 with a fine pointer it does not.
- **Rules checks (`node:test`):** the patent invariant (no Verdict, loss, join-in or anger change alters any cat but its subject, over 1,000 seeded encounters); anger never moves on a fight; no fight outcome changes Scent; tags never show on an undiscovered cat.
- **Pixel checks:** line width by scanline; Ink and palette ΔE2000; E-5 blur-and-ring separation; no neutral-grey shadows; no HUD pixels in the bottom-centre band.
- **Flash screening** (`flash-analyse.mjs`): a fixed 60 fps capture, scored with relative luminance, against the DR-50 caps. It is **a screening tool, not a certified Harding test**.
- **Evidence:** `production/qa/evidence/artifact-slice/M<n>/` with one line per shot.

---

## 6. How the work is run with the studio's agents

### 6.1 Roles

| Agent (model tier) | Owns |
|---|---|
| **technical-director** (`opus`) | This plan, architecture and budgets, the M0 GO/NO-GO write-up, code and performance review at every gate, final acceptance |
| **prototyper** (`sonnet`) | Build lead: loop, FSM, director, data plumbing, `showcase_overrides.json`, integration, publishing; throwaway discipline |
| **technical-artist** (`inherit`) | Shaders, the SDF cat pipeline and bakes, VFX atlases, **the Rivals board diorama set and its lighting**, pixel checks |
| **art-director** (`inherit`) | Look review at M0, M2, M3 (the board scene), M4 and M7; pose and silhouette strips; phase keys |
| **gameplay-programmer** (`inherit`) | The combat sim, territory, influence and the window, raids and `challenge`, Verdicts and the gate, the loss flow, the invariant tests |
| **ai-programmer** (`inherit`) | Personality AI, enemy tokens and telegraphs, the flee rule, the guest AI, Daifuku phase 1 |
| **ui-programmer** (`inherit`) | The DOM HUD from kit.css, screens, the three-card Verdict, the unified Turf Board, **the board's projected labels, tags and arrows**, the desktop card |
| **ux-designer** (`inherit`) | Keeps the board, Turf Board and Verdict faithful to `key-screens.md` §2, §4, §5 (C6 layout) |
| **audio-director** + **sound-designer** (`inherit`) | Instrument models, scores, the SFX map, the mix; sign-off on the Call and piano |
| **narrative-director** + **writer** (`inherit`) | Vignette shot lists, the plaster beat, barks (≤ 60 characters, each from the speaker's own history), the muted Tier A review, end-card questions |
| **qa-tester** (`inherit`) | Smoke and branch runs (A, B, C, L), evidence, the timed-run checklist |
| **creative-director** (`opus`) | Taste calls at M0, M3 and M7; art vs readability conflicts |
| **producer** (`inherit`) | Sessions against estimates; owns the cut list |

### 6.2 Review loop per milestone (maximum three iterations)

1. The owners build against the milestone's acceptance list and run the §5.2 suite.
2. **Iteration 1:** the technical-director (code, performance, fidelity to the GDD) and the domain reviewer (art-, audio-, narrative-director or ux-designer) each return PASS or a fix list. Every fix cites a failed acceptance item or a doc rule; taste notes go once to the creative-director.
3. **Iterations 2 and 3:** fix, then re-review.
4. After iteration 3, open items are logged as "unresolved" in the milestone notes, each with a recommended default, and the milestone ships. **Only** a broken hard constraint blocks shipping: the sandbox rules, flash safety, the patent invariant, or a crash.
5. Publish, and show the user the link and the evidence. **The user's go opens the next milestone.** Per CLAUDE.md, agents ask before writing outside the paths a milestone names, and nothing is committed without the user's instruction.

### 6.3 Publishing

- **One Artifact, updated in place.** M0 creates it (icon "game", title "Cat RPG Showcase"). Each later milestone republishes `dist/index.html` from the same path, so **the URL never changes**.
- Supporting files go through the `files` map (`game.js`, `data/`, `tex/`, `mesh/`, `audio/`); removed files are mapped to `null`. Each publish carries a `label` (e.g. "M3 Rivals board").
- The page has an explicit background, colour tokens and a short `<title>`. At phone width it shows the desktop card with no horizontal scroll.
- **It stays private.** The user decides who gets the link (§8, Q4). A showing outside the team is a **public showing** in the patent note's sense: counsel review comes first (`GDD.md` §19–20).

---

## 7. What transfers to Unreal 5.8 and what is throwaway

| Transfers | How |
|---|---|
| **Data tables** (Moves, tiers, combat constants incl. F11, personalities, cats, Rival events, Verdict gate, anger, join-in, challenger calendar, relations, barks, Patches, influence and window, raid, tribute, loss constants, camera, phases) | JSON row arrays keyed by `Name` → UE DataTable import with matching `USTRUCT` rows; GDD field names kept. `showcase_overrides.json` is excluded |
| **Tuning changed in play** | Every edit is logged per milestone with its reason. It becomes the UE starting tuning and a GDD change request (`/propagate-design-change`), never a silent edit |
| **State machines and rules** (the combat FSM, personality and guest AI rules, the beat schema, the overnight step order, the loss flow, event names and payloads incl. `MarkApplied`, `InfluenceChanged`, `BossWindowChanged`, `CatDiscovered`, `AngerChanged`, `ChallengerArrived`, `AllyJoined`) | Rebuilt as UE State Trees or Behavior Trees and gameplay events with the same names. The F1–F6, F11, §4.5, §4.14 worked examples and **the patent-invariant tests** port as UE automation tests |
| **Feel tiers and safety rules** | The table and arbiter logic port directly; the flash screening method becomes the UE capture check |
| **Camera parameters** | `camera_states.json` → the UE camera manager and modifiers |
| **The Rivals board diorama** | `board_lane.json`, `board_camera.json` and the step anchors → a streamed board sub-level (or a dedicated map) with a fixed CineCamera, the same materials as the street, and UMG labels anchored by `ProjectWorldToScreen`. The diorama's look is validated here first |
| **Look decisions** | Shade share, line widths, outline order, zone-tint lighting, phase keys (incl. nightfall), value bands, paint settings: kept as validated targets plus screenshots, with notes mapping each technique to a UE material |
| **Proportions and poses** | SDF cats exported to glTF as blockouts for the character artist; pose frames and silhouette strips as references |
| **Music** | JSON scores → MIDI sketches for the composer (the Call, Melody, Foundation, Lane, brawl) |
| **UX flows** | The three-card Verdict, the unified Turf Board's first use, the Sniff priority, the Rivals board interaction (hover/focus, scene cycling), the loss beat: references for UMG |

**Throwaway:** all rendering code and GLSL, the WebAudio instruments, the DOM HUD, input, the desktop card, procedural meshes and gait, build tools, the director's shortcuts and **every value in `showcase_overrides.json`** (the day-2 jump, influence 95, a Furious Daifuku, the night-3 challenger, the forced Rival tag and join-in, the phase cap, the held patrol stop), and all performance numbers.

---

## 8. Risks and open questions

### 8.1 Risks

| # | Risk | L / I | Mitigation and fallback |
|---|---|---|---|
| 1 | **Agents can't reach the reference look in code**, especially the cats (blobby toys) | High / High | M0 is a hard go/no-go before gameplay spend; the kit already proves the 2D grammar. Fallback: sharper SDF shapes, then a **hybrid head** (the kit's drawn front head on a camera-facing card over the 3D body) |
| 2 | **Painted-from-any-angle environments read as cheap 3D** | Med / High | Card rings, foliage clumps, distance fade, baked paint; judged on 8 orbit shots at M0. Fallback: heavier paint post, pitch clamp −5°…+35°, painted AO decals |
| 3 | **Procedural animation lacks appeal** | Med / High | Pose-to-pose on twos; pose editor with silhouette checks; one strong clip per verb; art-director sign-off at M0 and M1 |
| 4 | **Synthesised audio sounds cheap** or breaks the reserved timbres | Med / Med | Model acoustic timbres; a small palette; silence is a valid fallback except for the Call and the bell |
| 5 | **The board diorama costs more than a panel** (a second set, projected labels, arrows, hover) | Med / Med | One Lane scene built in full; the Outsiders and Bell scenes as lighter sets; reuse the street's shader and bakes. Fallback (cut order): a painted backdrop card for the set with the same anchors |
| 6 | **Scope creep toward the 2.5 h slice** | Med / High | The OUT list, the cut order, the producer tracking sessions; new asks go to the Unreal backlog |
| 7 | **Viewers skip the optional beats**, so C2 (losing) or the join-in goes unseen | Med / Med | The anger card and the puffs invite the bout; chapter select offers "Lose to Daifuku" and each branch; the end card names what was missed |
| 8 | **Showcase seeds read as canon pacing** (challenger on L2D2, influence 95, a forced join-in) | Med / Med | All in `showcase_overrides.json`, listed in §2.4 and the transfer table; the end card says "showcase: Life 2 compressed" |
| 9 | **Headless SwiftShader differs from real GPUs** | High / Low | Fixed settings for pixel checks; real-laptop captures from M2 |
| 10 | **Style proximity and the nemesis patent** | Med / High | The originality rules (§3.5), a private link, and **counsel review before any showing outside the team** (`GDD.md` §19–20; patent note v2 §1). The C6 board makes the gang hierarchy more visible (role tags, answers-to arrows; display of fixed roles only) and goes into the counsel packet |
| 11 | **The flash screening isn't certified** | Low / High | Runtime arbiter caps; screening on every build (incl. the nightfall iris); no public footage before a certified test |
| 12 | **The CDN stand-in hides a load-order bug** | Low / Med | Smoke assert that `THREE` exists before `game.js`; a manual check of the live URL after every publish |
| 13 | **The 14-minute target slips** with the new beats | Med / Med | Timed runs from M5; the trims above; the fast path; branch D/L budgeted separately |

### 8.2 Questions for the user (default applies if unanswered)

| # | Question | Default |
|---|---|---|
| Q1 | ~~Reference closeness~~ | **Settled by the user (2026-11-24): reference-close.** 3D cel-shaded characters over painted-2D-looking environments, free third-person camera, §3.5 originality rules apply |
| Q2 | ~~Phone support~~ | **Settled by the user (2026-11-24): not needed.** Desktop only (keyboard + mouse, gamepad); a "best on desktop" card on small or touch screens. Touch controls, the phone tier and phone tests are removed; M7 is 2–3 sessions |
| Q3 | **Budget (re-confirm)** | The accepted budget was 42–50 sessions minus the phone work (≈ 40–47). The owner's direction brings it to **45–53**. **Default: accept 45–53.** Alternative: take cut-order items 1–4 to land near 42–48, keeping every "never cut" beat |
| Q4 | ~~Audience~~ | **Settled (2026-11-24): private link only** |
| Q5 | ~~Name on the page~~ | **Settled by the user (2026-11-24): "Cat RPG"** |
| Q6 | ~~Code location~~ | **Settled (2026-11-24):** `prototypes/artifact-slice/` |
| Q7 | ~~Togemaru Recruit branch~~ | **Settled (2026-11-24): support every Life 2 outcome**, now three (A Nose-Touch, B Recruit, C Chase Off) |
| Q8 | ~~JP sound-word toggle~~ | **Settled (2026-11-24): include it** |
| Q9 | **Showcase-only seeds** (§2.4: Life 2 compressed, influence 95, the challenger on L2D2 with a forced tie, a forced join-in, a phase-1 Furious Daifuku) | **Default: accept**, labelled as showcase-only in the build and never ported as tuning |
